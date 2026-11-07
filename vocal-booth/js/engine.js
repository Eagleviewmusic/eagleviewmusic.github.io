/* ==========================================================================
   Vocal Booth — engine.js
   The audio: one AudioContext, the microphone, recording, playback.

   For the best sound nothing is put between the microphone and the take:
   every call-style process is asked off and then read back (a constraint is a
   request, not a promise), samples are taken raw from an AudioWorklet (never
   MediaRecorder, which compresses), and the context runs at the microphone's
   own rate when it can, so no resampling happens at all.

   Timing: the take starts on an exact frame of the clock the backing is
   scheduled on. The singer hears the backing late (output latency) and the
   microphone delivers late (input latency), so a take is placed earlier by the
   round trip: measured by the timing test when there is one, else estimated.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB;
  const P = VB.Project, Store = VB.Store;

  /* What the singer is holding. A phone or tablet has no input level to turn, and
     its operating system (not the page) picks some of the microphone's behaviour. */
  VB.device = (function () {
    const ua = navigator.userAgent || '';
    const touchMac = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;   // an iPad asking for the desktop site
    let d;
    if (/iPhone|iPod/.test(ua)) d = { kind: 'phone', ios: true, android: false };
    else if (/iPad/.test(ua) || touchMac) d = { kind: 'tablet', ios: true, android: false };
    else if (/Android/.test(ua)) d = { kind: /Mobile/.test(ua) ? 'phone' : 'tablet', ios: false, android: true };
    else d = { kind: 'computer', ios: false, android: false };
    d.mobile = d.kind !== 'computer';
    return d;
  })();
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const say = (m, k) => { if (VB.say) VB.say(m, k); };
  const DELAY_KEY = 'vocal_booth_delay_v1';

  const E = VB.Engine = {
    ctx: null, master: null,
    state: 'stopped',          // 'stopped' | 'playing' | 'recording'
    anchorTime: 0, anchorPos: 0,
    nodes: [], gains: new Map(),
    mic: null,                 // { stream, track, settings, label, deviceId, problems, src, node, silent }
    take: null, cap: null,
    level: { peak: 0, rms: 0, chs: 0, clipped: false, seen: 0 },
    log: [],                   // the last 10 s of { t, peak, rms }
    onstate: null
  };
  let capId = 0;

  /* -------- The context -------- */
  async function buildCtx(rate) {
    dropMic();
    if (E.ctx) { try { await E.ctx.close(); } catch (e) {} }
    E.nodes = [];
    E.gains.clear();
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const opts = { latencyHint: 'interactive' };
    if (rate) opts.sampleRate = rate;
    const ctx = new Ctx(opts);
    // Started at once, while the tap that made it still counts: iPhones and iPads
    // only let sound start from a tap, and the module load below is not one.
    try { ctx.resume(); } catch (e) {}
    // A clock that stops mid-take (a phone call, an alarm) stops the take, rather than
    // leaving a gap in it that nobody hears until later.
    ctx.addEventListener('statechange', () => {
      if (E.ctx === ctx && ctx.state !== 'running' && ctx.state !== 'closed') interrupted();
    });
    await ctx.audioWorklet.addModule('js/capture-worklet.js');
    E.ctx = ctx;
    E.master = ctx.createGain();
    E.master.connect(ctx.destination);
  }

  E.ready = async function () {
    const want = P.data.rate || 0;
    if (!E.ctx || E.ctx.state === 'closed' || (want && E.ctx.sampleRate !== want)) await buildCtx(want);
    if (E.ctx.state !== 'running') { try { await E.ctx.resume(); } catch (e) {} }
    return E.ctx;
  };

  E.rate = () => P.data.rate || (E.ctx ? E.ctx.sampleRate : 48000);

  /* -------- The microphone -------- */
  const hasNothing = () => !P.sources.size;
  const goodRate = r => (r === 44100 || r === 48000 ? r : 48000);

  /* A Bluetooth name. "Headset" alone is not enough: Android calls a wired one
     "Wired headset" and its own earpiece "Headset earpiece", and an iPhone calls
     wired EarPods "Headset Microphone". */
  const isBluetooth = label => /bluetooth|hands-?free|airpods|buds|beats|\bbt\b|hfp/i.test(label || '') ||
    (/headset/i.test(label || '') && !/wired headset|headset earpiece|headset microphone/i.test(label || ''));
  E.isBluetooth = isBluetooth;

  function bluetoothWords() {
    const dev = VB.device;
    return dev.mobile
      ? 'Bluetooth headphones are being used. While the microphone is on, a ' + dev.kind + ' switches them to phone-call quality, for your voice and the music alike. Use wired headphones, or turn Bluetooth off.'
      : 'This looks like a Bluetooth microphone, which is phone quality. A wired or USB microphone, or even your computer’s built-in one, will sound far better.';
  }

  function audit(track, s, inputs) {
    const out = [];
    if (s.echoCancellation) out.push('Echo cancellation is on. This browser would not turn it off, so held notes may cut out.');
    if (s.noiseSuppression) out.push('Noise suppression is on. This browser would not turn it off, so your tone may come out dull or wobbly.');
    if (s.autoGainControl) out.push('Automatic volume is on. This browser would not turn it off, so your level may swell and sag.');
    if (s.voiceIsolation) out.push('Voice isolation is on, which can thin out your tone. Turn it off in your computer’s microphone settings.');
    // A microphone under 32 kHz is a phone call's: on an iPhone that is how Bluetooth headphones show.
    const callRate = s.sampleRate && s.sampleRate < 32000;
    // Android opens Bluetooth headphones whenever they are connected, even for "Default",
    // unless something wired or USB is plugged in too.
    const label = track.label || '';
    const names = (inputs || []).map(d => d.label || '');
    const androidBt = VB.device.android && !/speakerphone|wired|usb/i.test(label) &&
      names.some(n => /bluetooth/i.test(n)) && !names.some(n => /wired headset|usb/i.test(n));
    if (isBluetooth(label) || androidBt) out.push(bluetoothWords());
    else if (callRate) {
      out.push('This microphone is working at phone-call quality (' + Math.round(s.sampleRate / 1000) + ' kHz), which usually means Bluetooth headphones. ' +
        (VB.device.mobile ? 'Use wired headphones, or turn Bluetooth off.' : 'A wired or USB microphone will sound far better.'));
    }
    return out;
  }

  /* iPhone and iPad: say up front that this page plays and records. The sound then
     starts at its proper level, and keeps going if the screen locks mid-take. */
  function audioSession(type) {
    try { if (VB.device.ios && navigator.audioSession) navigator.audioSession.type = type; } catch (e) {}
  }

  function dropMic() {
    const m = E.mic;
    if (!m) return;
    E.mic = null;
    try { m.track.onended = null; m.track.onmute = null; } catch (e) {}
    try { m.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { m.src.disconnect(); m.node.disconnect(); m.silent.disconnect(); } catch (e) {}
    E.level.peak = E.level.rms = 0;
    E.log.length = 0;
    audioSession('auto');
  }
  E.closeMic = function () {
    if (E.state === 'recording') return;
    dropMic();
    if (E.onstate) E.onstate();
  };

  /* One request at a time: a permission box can wait for as long as the person likes,
     and a second request meanwhile would leave a microphone open with nothing using it. */
  let opening = null;
  E.asking = () => !!opening;
  E.openMic = function (deviceId) {
    if (opening) return opening;
    opening = openMicNow(deviceId).finally(() => {
      opening = null;
      // no microphone after all: an iPhone left set to record plays through its earpiece
      if (!E.mic) audioSession('auto');
      if (E.onstate) E.onstate();
    });
    if (E.onstate) E.onstate();
    return opening;
  };
  async function openMicNow(deviceId) {
    await E.ready();
    if (E.state === 'recording') return E.mic;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const err = new Error('nomic'); err.name = 'NoApi'; throw err;
    }
    dropMic();
    /* No sample rate is asked for: an iPhone would convert to it, and hide the rate the
       microphone really runs at (which is how Bluetooth's call quality shows). The context
       follows the microphone instead, below. On an iPhone or iPad, echo cancellation off
       is what switches off Apple's voice processing (auto volume and noise removal with it). */
    const audio = {
      echoCancellation: { ideal: false }, noiseSuppression: { ideal: false }, autoGainControl: { ideal: false },
      voiceIsolation: { ideal: false }, channelCount: { ideal: 2 }
    };
    audioSession('play-and-record');
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? Object.assign({ deviceId: { exact: deviceId } }, audio) : audio, video: false });
    } catch (err) {
      // the microphone chosen last time may be unplugged now: use the default one
      if (!deviceId || (err.name !== 'OverconstrainedError' && err.name !== 'NotFoundError')) throw err;
      stream = await navigator.mediaDevices.getUserMedia({ audio, video: false });
    }
    const track = stream.getAudioTracks()[0];
    const settings = track.getSettings ? track.getSettings() : {};

    // Nothing recorded yet: run at the microphone's own rate, so nothing is converted.
    if (hasNothing() && settings.sampleRate && goodRate(settings.sampleRate) !== E.ctx.sampleRate) {
      P.data.rate = 0;
      await buildCtx(goodRate(settings.sampleRate));
    }
    // A page that is using the microphone may start its sound without a tap, so this
    // also wakes a context that an iPhone kept asleep.
    // Never waited on for long: a browser that refuses may leave the promise hanging.
    if (E.ctx.state !== 'running') { try { await Promise.race([E.ctx.resume(), sleep(500)]); } catch (e) {} }
    if (E.onstate) E.onstate();

    let src;
    try {
      src = E.ctx.createMediaStreamSource(stream);
    } catch (err) {
      // Firefox refuses a microphone at a different rate from the context.
      if (hasNothing() && settings.sampleRate) {
        P.data.rate = 0;
        await buildCtx(settings.sampleRate);
        try { await E.ctx.resume(); } catch (e) {}
        src = E.ctx.createMediaStreamSource(stream);
      } else {
        stream.getTracks().forEach(t => t.stop());
        const e2 = new Error('rate'); e2.name = 'RateMismatch'; throw e2;
      }
    }

    const node = new AudioWorkletNode(E.ctx, 'vocal-capture', {
      numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1],
      channelCountMode: 'max', channelInterpretation: 'discrete'
    });
    const silent = E.ctx.createGain();
    silent.gain.value = 0;
    src.connect(node);
    node.connect(silent);
    silent.connect(E.ctx.destination);
    node.port.onmessage = onCapture;

    let inputs = [];
    try { inputs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput'); } catch (e) {}
    const mic = E.mic = {
      stream, track, settings, src, node, silent, inputs,
      label: track.label || 'Microphone',
      deviceId: settings.deviceId || deviceId || '',
      problems: audit(track, settings, inputs)
    };
    track.onended = () => {
      if (E.state === 'recording') {
        say('The microphone went away, so recording stopped. Your take is saved.', 'warn');
        E.stop();
      }
      dropMic();
      if (E.onstate) E.onstate();
    };
    // A phone mutes the microphone for a call, an alarm or Siri: the take would only gather silence.
    track.onmute = () => {
      if (E.state === 'recording' && VB.device.mobile) interrupted();
    };
    // An iPhone shares one microphone setup between pages and apps, and says when another changes it.
    try {
      track.addEventListener('configurationchange', () => {
        if (E.mic !== mic) return;
        mic.settings = track.getSettings ? track.getSettings() : {};
        mic.problems = audit(track, mic.settings, mic.inputs);
        if (mic.problems.length && E.state === 'recording') say(mic.problems[0], 'warn');
        if (E.onstate) E.onstate();
      });
    } catch (e) {}
    E.level.clipped = false;
    if (E.onstate) E.onstate();
    return E.mic;
  }

  E.micErrorText = function (err) {
    const name = err && err.name;
    if (name === 'NoApi') return 'This page can’t reach a microphone. It has to be opened over https, in a current version of Chrome, Edge or Safari.';
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      return window.top !== window
        ? 'The microphone is blocked inside this frame. Open Vocal Booth in its own tab.'
        : 'The microphone is blocked. Click the icon at the left of the address bar, allow the microphone, then try again.';
    }
    if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'No microphone was found. Plug one in, then try again.';
    if (name === 'NotReadableError' || name === 'AbortError') return 'Another app may be using the microphone. Close it, then try again.';
    if (name === 'RateMismatch') return 'This browser can’t use this microphone with these recordings. Chrome or Edge will.';
    return 'The microphone would not open (' + (name || 'unknown') + ').';
  };

  /* -------- Messages from the worklet -------- */
  function onCapture(e) {
    const m = e.data;
    if (m.type === 'meter') {
      const peak = m.chs > 1 ? Math.max(m.p0, m.p1) : m.p0;
      const rms = m.chs > 1 ? Math.max(m.r0, m.r1) : m.r0;
      const L = E.level;
      if (peak > L.peak) L.peak = peak;
      L.rms = rms;
      L.chs = m.chs;
      L.seen = performance.now();
      if (peak >= 0.99) L.clipped = true;
      E.log.push({ t: L.seen, peak, rms });
      while (E.log.length && L.seen - E.log[0].t > 10000) E.log.shift();
    } else if (m.type === 'chunk') {
      const s = E.cap;
      if (!s || s.id !== m.id) return;
      if (s.first == null) s.first = m.first;
      if (s.onChunk) s.onChunk(m);
    } else if (m.type === 'end') {
      const s = E.cap;
      if (!s || s.id !== m.id) return;
      E.cap = null;
      if (s.done) s.done();
    }
  }

  function beginCapture(from, onChunk) {
    const s = { id: ++capId, from, first: null, onChunk, done: null };
    E.cap = s;
    E.mic.node.port.postMessage({ cmd: 'start', id: s.id, from });
    return s;
  }
  function endCapture(s) {
    return new Promise(res => {
      let over = false;
      const finish = () => {
        if (over) return;
        over = true;
        if (E.cap === s) E.cap = null;
        res();
      };
      s.done = finish;
      if (E.mic) E.mic.node.port.postMessage({ cmd: 'stop', id: s.id });
      else finish();
      // A stopped clock cannot answer: what has arrived is kept (rows are already saved).
      setTimeout(finish, 1500);
    });
  }

  function interrupted() {
    if (E.state !== 'recording') return;
    say('Recording stopped because the sound was interrupted (a call, an alarm, or another app). Your take is saved.', 'warn');
    E.stop();
  }

  // The screen lock is let go while the page is hidden; take it again on the way back.
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || E.state !== 'recording' || !navigator.wakeLock) return;
    try { E.wake = await navigator.wakeLock.request('screen'); } catch (e) {}
  });

  const concat = (list, n) => {
    const out = new Float32Array(n);
    let at = 0;
    for (const x of list) { out.set(x, at); at += x.length; }
    return out;
  };
  /* The voice: whichever input carries more. */
  function louder(a, b) {
    if (!b) return 0;
    let ea = 0, eb = 0;
    for (let i = 0; i < a.length; i++) { ea += a[i] * a[i]; eb += b[i] * b[i]; }
    return eb > ea ? 1 : 0;
  }

  /* -------- Playback -------- */
  function gainFor(track) {
    let g = E.gains.get(track.id);
    if (!g) {
      g = E.ctx.createGain();
      g.gain.value = track.muted ? 0 : track.volume;
      g.connect(E.master);
      E.gains.set(track.id, g);
    }
    return g;
  }
  E.syncGains = function () {
    if (!E.ctx) return;
    for (const t of P.data.tracks) {
      const g = E.gains.get(t.id);
      if (g) g.gain.setTargetAtTime(t.muted ? 0 : t.volume, E.ctx.currentTime, 0.008);
    }
  };

  function silenceNodes() {
    const now = E.ctx.currentTime;
    if (E.nodes.length) {
      E.master.gain.cancelScheduledValues(now);
      E.master.gain.setValueAtTime(E.master.gain.value, now);
      E.master.gain.linearRampToValueAtTime(0, now + 0.008);
    }
    for (const n of E.nodes) {
      try { n.stop(now + 0.01); } catch (e) {}
    }
    E.nodes = [];
  }

  function schedule(fromPos, t0, skipTrackId) {
    const ctx = E.ctx, sr = ctx.sampleRate;
    silenceNodes();
    E.master.gain.cancelScheduledValues(t0 - 0.002);
    E.master.gain.setValueAtTime(1, t0 - 0.002);
    const fade = VB.FADE / sr;
    for (const tr of P.data.tracks) {
      if (tr.id === skipTrackId) continue;
      const out = gainFor(tr);
      for (const s of P.plan(tr.id)) {
        if (s.end <= fromPos) continue;
        const src = P.source(s.sourceId);
        const from = Math.max(s.start, fromPos);
        const when = t0 + (from - fromPos) / sr;
        const off = (s.off + (from - s.start)) / sr;
        const dur = (s.end - from) / sr;
        const node = ctx.createBufferSource();
        node.buffer = src.buffer;
        const needIn = s.fadeIn && from === s.start, needOut = s.fadeOut;
        if (needIn || needOut) {
          const g = ctx.createGain();
          if (needIn) {
            g.gain.setValueAtTime(0, when);
            g.gain.linearRampToValueAtTime(1, when + fade);
          }
          if (needOut && dur > fade) {
            g.gain.setValueAtTime(1, when + dur - fade);
            g.gain.linearRampToValueAtTime(0, when + dur);
          }
          node.connect(g);
          g.connect(out);
        } else {
          node.connect(out);
        }
        node.start(when, off, dur);
        E.nodes.push(node);
      }
    }
  }

  const heardTime = () => E.ctx.currentTime - (E.ctx.outputLatency || 0);

  E.position = function () {
    if (E.state === 'stopped' || !E.ctx) return P.data.playhead;
    return E.anchorPos + Math.max(0, Math.round((heardTime() - E.anchorTime) * E.ctx.sampleRate));
  };

  E.play = async function () {
    if (E.state !== 'stopped') return;
    await E.ready();
    const sr = E.ctx.sampleRate;
    if (P.data.playhead >= P.end()) P.data.playhead = 0;
    const pos = P.data.playhead;
    const t0 = Math.ceil((E.ctx.currentTime + 0.06) * sr) / sr;
    schedule(pos, t0, null);
    E.anchorTime = t0;
    E.anchorPos = pos;
    E.state = 'playing';
    if (E.onstate) E.onstate();
  };

  /* After an edit made during playback, carry on from the same place. */
  E.refresh = function () {
    if (E.state !== 'playing') return;
    const sr = E.ctx.sampleRate;
    const pos = E.position();
    const t0 = Math.ceil((E.ctx.currentTime + 0.05) * sr) / sr;
    schedule(pos, t0, null);
    E.anchorTime = t0;
    E.anchorPos = pos;
  };

  E.seek = function (pos) {
    P.data.playhead = Math.max(0, Math.round(pos));
    if (E.state === 'playing') {
      const sr = E.ctx.sampleRate;
      const t0 = Math.ceil((E.ctx.currentTime + 0.05) * sr) / sr;
      schedule(P.data.playhead, t0, null);
      E.anchorTime = t0;
      E.anchorPos = P.data.playhead;
    }
  };

  E.stop = async function () {
    if (E.state === 'recording') return stopRecord();
    if (E.state === 'playing') {
      P.data.playhead = Math.min(E.position(), Math.max(P.end(), E.anchorPos));
      silenceNodes();
      E.state = 'stopped';
      if (E.onstate) E.onstate();
    }
  };

  /* Called every frame: playback stops by itself at the end of the music. */
  E.tick = function () {
    if (E.state === 'playing' && E.position() >= P.end()) {
      silenceNodes();
      E.state = 'stopped';
      P.data.playhead = P.end();
      if (E.onstate) E.onstate();
    }
  };

  /* -------- Timing -------- */
  function delays() {
    try { return JSON.parse(localStorage.getItem(DELAY_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  E.delayInfo = function () {
    const label = E.mic ? E.mic.label : '';
    const d = delays()[label];
    if (d && Number.isFinite(d.ms)) return { ms: d.ms, how: 'measured' };
    let sec = 0.01;
    if (E.ctx) sec = (E.ctx.outputLatency || 0) + (E.ctx.baseLatency || 0);
    const inp = E.mic && E.mic.settings && Number.isFinite(E.mic.settings.latency) ? E.mic.settings.latency : 0.01;
    return { ms: Math.round((sec + inp) * 1000), how: 'estimated' };
  };
  E.saveDelay = function (ms) {
    const all = delays();
    if (E.mic) all[E.mic.label] = { ms, at: Date.now() };
    try { localStorage.setItem(DELAY_KEY, JSON.stringify(all)); } catch (e) {}
  };

  /* -------- Recording -------- */
  const ROW = () => Math.round(E.ctx.sampleRate / 2);   // half a second per stored row: the most a crash can cost

  function queueRow(q, data, id, ch, force) {
    if (data) { q.list.push(data); q.frames += data.length; }
    if (q.frames && (force || q.frames >= ROW())) {
      const row = concat(q.list, q.frames);
      q.list = []; q.frames = 0;
      q.writes.push(Store.putRow(id, ch, q.row++, row));
    }
  }

  E.startRecord = async function () {
    if (E.state === 'recording') return false;
    if (E.state === 'playing') await E.stop();
    await E.ready();
    if (!E.mic) {
      let saved;
      try { saved = localStorage.getItem('vocal_booth_mic') || undefined; } catch (e) {}
      await E.openMic(saved);
    }

    let track = P.recordTarget();
    if (!track) track = P.addTrack();

    const ctx = E.ctx, sr = ctx.sampleRate;
    if (!P.data.rate) P.data.rate = sr;
    if (navigator.storage && navigator.storage.persist) { try { navigator.storage.persist(); } catch (e) {} }
    try { if (navigator.wakeLock) E.wake = await navigator.wakeLock.request('screen'); } catch (e) {}

    const pos = P.data.playhead;
    const from = Math.ceil((ctx.currentTime + 0.15) * sr);
    const t0 = from / sr;
    const id = VB.uid('s');
    const name = 'Take ' + P.data.takeNo;
    const take = E.take = {
      id, name, trackId: track.id, pos, from, n: 0, a: [], b: null, peaks: new VB.Peaks(4096),
      q: [{ list: [], frames: 0, row: 0, writes: [] }, { list: [], frames: 0, row: 0, writes: [] }]
    };
    Store.putMeta({
      id, kind: 'take', name, rate: sr, state: 'recording', trackId: track.id, pos, ch: 0, channels: 1,
      mic: E.mic.label, delayMs: E.delayInfo().ms, at: Date.now()
    });

    E.level.clipped = false;
    schedule(pos, t0, track.id);
    take.cap = beginCapture(from, m => {
      const a = m.n === m.a.length ? m.a : m.a.subarray(0, m.n);
      let b = null;
      if (m.b) {
        b = m.n === m.b.length ? m.b : m.b.subarray(0, m.n);
        if (!take.b) {          // a second channel woke up: everything so far was silent on it
          take.b = [];
          if (take.n) { const z = new Float32Array(take.n); take.b.push(z); queueRow(take.q[1], z, id, 1, true); }
        }
      } else if (take.b) {
        b = new Float32Array(m.n);
      }
      take.a.push(a);
      queueRow(take.q[0], a, id, 0, false);
      if (take.b) { take.b.push(b); queueRow(take.q[1], b, id, 1, false); }
      take.peaks.add(a, b, m.n);
      take.n += m.n;
    });
    E.anchorTime = t0;
    E.anchorPos = pos;
    E.state = 'recording';
    if (E.onstate) E.onstate();
    return true;
  };

  async function stopRecord() {
    const take = E.take;
    silenceNodes();
    E.state = 'stopped';
    if (take && take.cap) await endCapture(take.cap);
    E.take = null;
    if (E.wake) { try { E.wake.release(); } catch (e) {} E.wake = null; }
    if (!take) { if (E.onstate) E.onstate(); return; }
    P.data.playhead = take.pos;
    await finishTake(take);
    if (E.onstate) E.onstate();
  }

  /* A finished take becomes a source and a clip, and is reported on. */
  async function finishTake(take) {
    const sr = E.ctx.sampleRate;
    const N = take.n;
    const A = concat(take.a, N);
    const B = take.b ? concat(take.b, N) : null;
    const keep = louder(A, B);
    const data = keep ? B : A;

    queueRow(take.q[0], null, take.id, 0, true);
    if (take.b) queueRow(take.q[1], null, take.id, 1, true);
    await Promise.all([...take.q[0].writes, ...take.q[1].writes]);
    if (take.b) await Store.dropChannel(take.id, keep ? 0 : 1);

    const startedLate = take.cap && take.cap.first != null ? take.cap.first - take.from : 0;
    const info = E.delayInfo();
    const delay = Math.round(info.ms / 1000 * sr);
    const stats = measure(data);

    if (N - delay < sr * 0.05) {
      await Store.dropSource(take.id);
      say('That was too short to keep.', 'warn');
      return;
    }

    const buffer = new AudioBuffer({ numberOfChannels: 1, length: N, sampleRate: sr });
    buffer.copyToChannel(data, 0);
    P.sources.set(take.id, {
      id: take.id, kind: 'take', name: take.name, rate: sr, channels: 1, length: N, buffer, peaks: VB.peaksOf(buffer)
    });
    await Store.putMeta({
      id: take.id, kind: 'take', name: take.name, rate: sr, state: 'done', ch: keep, channels: 1, length: N,
      mic: E.mic ? E.mic.label : '', delayMs: info.ms, delayHow: info.how, peak: stats.peak, clipped: stats.clipped, at: Date.now()
    });

    P.edit('recording', () => {
      const c = {
        id: VB.uid('c'), trackId: take.trackId, sourceId: take.id, name: take.name, muted: false,
        pos: take.pos + startedLate, offset: delay, len: N - delay
      };
      P.data.clips.push(c);
      P.data.takeNo++;
      const tr = P.track(take.trackId);
      if (tr) tr.muted = false;
      P.sel.clipId = c.id;
      P.sel.range = null;
    });
    E.syncGains();

    if (stats.peak < 0.0003) say(take.name + ' is silent. Is the right microphone chosen in Mic check?', 'warn');
    else if (stats.clipped) say(take.name + ' hit the top of the meter, so it may sound distorted. Move back a little and try again.', 'warn');
    else if (stats.peak < 0.03) say(take.name + ' is very quiet. Move closer to the microphone if you can.', 'warn');
  }

  function measure(data) {
    let peak = 0, clipped = 0, run = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] < 0 ? -data[i] : data[i];
      if (v > peak) peak = v;
      if (v >= 0.99) { if (++run === 3) clipped++; } else run = 0;
    }
    return { peak, clipped };
  }

  /* -------- A take that was cut off by a crash or a closed tab -------- */
  E.recover = async function (meta) {
    const a = await Store.readChannel(meta.id, 0);
    const b = await Store.readChannel(meta.id, 1);
    const N = Math.max(a.length, b.length);
    if (N < (meta.rate || 48000) * 0.25) { await Store.dropSource(meta.id); return false; }
    let data = a;
    let keep = 0;
    if (b.length === a.length && louder(a, b)) { data = b; keep = 1; }
    if (b.length) await Store.dropChannel(meta.id, keep ? 0 : 1);
    const buffer = new AudioBuffer({ numberOfChannels: 1, length: data.length, sampleRate: meta.rate });
    buffer.copyToChannel(data, 0);
    P.sources.set(meta.id, {
      id: meta.id, kind: 'take', name: meta.name, rate: meta.rate, channels: 1, length: data.length, buffer, peaks: VB.peaksOf(buffer)
    });
    await Store.putMeta(Object.assign({}, meta, { state: 'done', ch: keep, length: data.length }));
    const trackId = P.track(meta.trackId) ? meta.trackId : P.data.tracks[0].id;
    const delay = Math.min(Math.round((meta.delayMs || 0) / 1000 * meta.rate), data.length >> 1);
    P.data.clips.push({
      id: VB.uid('c'), trackId, sourceId: meta.id, name: meta.name + ' (recovered)', muted: false,
      pos: meta.pos || 0, offset: delay, len: data.length - delay
    });
    P.data.takeNo++;
    return true;
  };

  /* -------- A file (the accompaniment) -------- */
  E.importFile = async function (file) {
    await E.ready();
    const ctx = E.ctx;
    const bytes = await file.arrayBuffer();
    const decoded = await ctx.decodeAudioData(bytes);
    if (!P.data.rate) P.data.rate = ctx.sampleRate;
    let buffer = decoded;
    if (decoded.numberOfChannels > 2) {
      buffer = new AudioBuffer({ numberOfChannels: 2, length: decoded.length, sampleRate: decoded.sampleRate });
      buffer.copyToChannel(decoded.getChannelData(0), 0);
      buffer.copyToChannel(decoded.getChannelData(1), 1);
    }
    const id = VB.uid('s');
    const name = file.name.replace(/\.[^.]+$/, '') || 'Audio file';
    const channels = buffer.numberOfChannels;
    const src = { id, kind: 'file', name, rate: buffer.sampleRate, channels, length: buffer.length, buffer, peaks: VB.peaksOf(buffer) };
    P.sources.set(id, src);
    const rowLen = Math.round(buffer.sampleRate);
    for (let ch = 0; ch < channels; ch++) {
      const data = buffer.getChannelData(ch);
      let row = 0;
      for (let at = 0; at < data.length; at += rowLen) {
        await Store.putRow(id, ch, row++, data.slice(at, at + rowLen));
      }
    }
    await Store.putMeta({ id, kind: 'file', name, rate: buffer.sampleRate, state: 'done', channels, length: buffer.length, at: Date.now() });
    return src;
  };

  /* -------- For the Mic Check -------- */
  E.testRecord = async function (seconds) {
    const ctx = E.ctx, sr = ctx.sampleRate;
    const a = [], b = [];
    const from = Math.ceil((ctx.currentTime + 0.05) * sr);
    const s = beginCapture(from, m => {
      a.push(m.a.subarray(0, m.n));
      if (m.b) b.push(m.b.subarray(0, m.n));
    });
    await sleep(seconds * 1000 + 100);
    await endCapture(s);
    let n = 0;
    for (const x of a) n += x.length;
    const A = concat(a, n);
    const B = b.length === a.length && b.length ? concat(b, n) : null;
    return louder(A, B) ? B : A;
  };
  E.playBuffer = function (data) {
    const ctx = E.ctx;
    const buffer = new AudioBuffer({ numberOfChannels: 1, length: data.length, sampleRate: ctx.sampleRate });
    buffer.copyToChannel(data, 0);
    return new Promise(res => {
      const n = ctx.createBufferSource();
      n.buffer = buffer;
      n.connect(ctx.destination);
      n.onended = () => res();
      n.start();
      E.testNode = n;
    });
  };
  E.stopTest = function () {
    if (E.testNode) { try { E.testNode.stop(); } catch (e) {} E.testNode = null; }
  };

  /* Soft chirps out, listened for at the microphone. Heard: the exact round trip
     (and the speakers can reach the microphone). Not heard: no leak. */
  E.timingTest = async function () {
    const ctx = E.ctx, sr = ctx.sampleRate;
    const LEN = Math.round(0.02 * sr);
    const chirp = new Float32Array(LEN);
    let ph = 0, energy = 0;
    for (let i = 0; i < LEN; i++) {
      const t = i / LEN;
      ph += 2 * Math.PI * (1000 + 5000 * t) / sr;
      const w = Math.sin(Math.PI * t);
      chirp[i] = Math.sin(ph) * w * w * 0.35;
      energy += chirp[i] * chirp[i];
    }
    const buf = new AudioBuffer({ numberOfChannels: 1, length: LEN, sampleRate: sr });
    buf.copyToChannel(chirp, 0);
    const SPACE = Math.round(0.7 * sr), LEAD = Math.round(0.35 * sr), COUNT = 5;
    const SEARCH = Math.round(0.6 * sr);
    const a = [], b = [];
    const from = Math.ceil((ctx.currentTime + 0.1) * sr);
    const cap = beginCapture(from, m => {
      a.push(m.a.subarray(0, m.n));
      if (m.b) b.push(m.b.subarray(0, m.n));
    });
    for (let k = 0; k < COUNT; k++) {
      const n = ctx.createBufferSource();
      n.buffer = buf;
      n.connect(ctx.destination);
      n.start((from + LEAD + k * SPACE) / sr);
    }
    await sleep((0.1 + (LEAD + COUNT * SPACE) / sr) * 1000 + 150);
    await endCapture(cap);
    let n = 0;
    for (const x of a) n += x.length;
    const A = concat(a, n);
    const B = b.length === a.length && b.length ? concat(b, n) : null;
    const x = louder(A, B) ? B : A;
    const first = cap.first == null ? from : cap.first;

    const lags = [];
    for (let k = 0; k < COUNT; k++) {
      const at = from + LEAD + k * SPACE - first;
      if (at < 0 || at + LEN + SEARCH > x.length) continue;
      const c = new Float32Array(SEARCH);
      let top = 0;
      for (let lag = 0; lag < SEARCH; lag++) {
        let sum = 0;
        const o = at + lag;
        for (let i = 0; i < LEN; i++) sum += chirp[i] * x[o + i];
        const v = Math.abs(sum) / energy;
        c[lag] = v;
        if (v > top) top = v;
      }
      const sorted = Array.from(c).sort((p, q) => p - q);
      const middle = sorted[SEARCH >> 1] || 1e-9;
      if (top < middle * 12 || top < 0.002) continue;
      let hit = 0;
      while (c[hit] < top * 0.6) hit++;
      lags.push(hit);
      await sleep(0);
    }
    lags.sort((p, q) => p - q);
    if (lags.length < 3) return { heard: false };
    const mid = lags[lags.length >> 1];
    const tol = Math.round(0.002 * sr);
    const agree = lags.filter(l => Math.abs(l - mid) <= tol).length;
    if (agree < 3) return { heard: false };
    const ms = Math.round(mid / sr * 1000);
    if (ms < 1) return { heard: false };
    E.saveDelay(ms);
    return { heard: true, ms };
  };

  /* Where the sound is going, when the browser will say. */
  E.outputLabel = async function () {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const out = list.filter(d => d.kind === 'audiooutput');
      const dev = out.find(d => d.deviceId === 'default') || out[0];
      return dev && dev.label ? dev.label.replace(/^Default\s*-\s*/i, '') : '';
    } catch (e) { return ''; }
  };
})();

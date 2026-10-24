/* ==========================================================================
   Recording Studio — voice.js
   Voice tracks: the microphone, recorded as sound.

   - THE MICROPHONE comes in on the studio's own audio context, through
     voice-tap.js (an AudioWorklet), so every sample carries the clock the
     tracks are played on. It is on only while the Voice tab is showing (or
     a take is going).
   - MUSIC, NOT A PHONE CALL: a browser's microphone defaults are tuned for
     one talking voice — echo cancellation, noise suppression, automatic
     gain and (where it exists) voice isolation. Each of them dulls, warbles
     or pumps a sung note, a recorder, a class. So every one is asked off by
     name, as an `ideal` (an `exact` a device cannot meet would throw and
     leave no microphone at all), and then what the browser ACTUALLY applied
     is read back from the track and shown — a request is not a promise.
     "Filter out the speakers" turns echo cancellation alone back on.
   - LEVELS: with automatic gain off, the level is whatever the microphone
     gives, and a basic one is quiet at a distance and clips up close. The
     meter says so in words, next to the band to aim for. "Boost" is one
     static gain laid over the whole take once it is in, held back so the
     loudest sample stays under full scale, and kept with the take; nothing
     rides the level while recording. The quietest quarter second of the
     last eight is kept as the ROOM NOISE, so "is anyone singing" judgements
     are made against this room, not a fixed number.
   - TIMING: a voice is heard late twice over — the backing reaches the
     singer through the speakers, and the singing reaches the studio through
     the microphone. "Line up the microphone" measures both at once: beeps
     out of the speakers, listened for by the microphone. Until then, the
     browser's own figures stand in.
   - CLIPS are kept in this browser's IndexedDB as 16-bit samples (too big
     for localStorage), with the boost and the microphone settings they were
     made with. A project only says where each take sits:
     regions { c (clip id), b (beat), o (seconds into the clip), d (seconds) }.
     A take does not change speed with the tempo.
   - MIC CHECK: a fold in the panel with what the browser applied, the
     rates, the live level, the room noise, a spectrum (overtones past
     4 kHz, or a wall where a Bluetooth path ends) and a report to copy.
   - THE SPEAKERS IN THE TAKE. A singer needs the backing out loud, so the
     studio's own sound is taken back out of the take afterwards: a second
     tap listens to exactly what went to the speakers (the reference, from
     StudioBus), "Line up the microphone" plays a sweep and learns how the
     room returns it (backing-removal.js), and a take's predicted echo —
     fitted to the take, checked in its pauses — is subtracted before the
     take is kept. The singer's own sound is untouched: the filter is fixed
     before the take and cannot learn them. The count-in, where only the
     speakers sound, measures how loud they are at the microphone (the
     bleed), which is shown, not acted on. The browser's own echo
     cancellation stays as a last resort: it is made for calls, and with
     the speakers loud at the microphone it swallows the voice too.

   window.StudioVoice — studio.js, voices.js and link.js call in.
   ========================================================================== */
const StudioVoice = (() => {
  'use strict';

  const DB_NAME = 'evm_studio_audio_v1', STORE = 'clips';
  const PREFS_KEY = 'evm_studio_voice_v1';
  const DELAY_KEY = 'evm_studio_mic_delay_v1';
  const BLEED_KEY = 'evm_studio_bleed_v1';
  const IR_KEY = '_ir';        // the room's response, in the clips store (keys() leaves it out)
  const PEAKS = 200;          // waveform peaks a second, for drawing
  const CEILING = 0.89;       // about −1 dBFS: no boosted sample goes past it

  const el = id => document.getElementById(id);
  const loadJSON = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const dB = x => x > 0 ? 20 * Math.log10(x) : -100;
  const FRAMED = (() => { try { return window.top !== window.self; } catch (e) { return true; } })();

  // -------- THE CLIPS (IndexedDB) --------
  let dbp = null;
  function db() {
    if (!dbp) dbp = new Promise((resolve, reject) => {
      if (!window.indexedDB) { reject(new Error('no indexedDB')); return; }
      const rq = indexedDB.open(DB_NAME, 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore(STORE);
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => reject(rq.error);
    });
    return dbp;
  }
  // one transaction: `fn(store)` may return a request whose result is the answer
  function tx(mode, fn) {
    return db().then(d => new Promise((resolve, reject) => {
      const t = d.transaction(STORE, mode);
      const rq = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(rq ? rq.result : undefined);
      t.onerror = t.onabort = () => reject(t.error);
    }));
  }

  const cache = new Map();    // id -> { rate, data: Float32Array, peaks: Float32Array, meta }
  const missing = new Set();  // ids looked for and not found (a deleted take)

  function toI16(f32) {
    const out = new Int16Array(f32.length);
    for (let i = 0; i < f32.length; i++) {
      const x = f32[i] < -1 ? -1 : f32[i] > 1 ? 1 : f32[i];
      out[i] = x < 0 ? x * 32768 : x * 32767;
    }
    return out;
  }
  function toF32(i16) {
    const out = new Float32Array(i16.length);
    for (let i = 0; i < i16.length; i++) out[i] = i16[i] < 0 ? i16[i] / 32768 : i16[i] / 32767;
    return out;
  }
  function peaksOf(data, rate) {
    const w = Math.max(1, Math.round(rate / PEAKS));
    const out = new Float32Array(Math.ceil(data.length / w));
    for (let k = 0, i = 0; k < out.length; k++) {
      let p = 0;
      for (const end = Math.min(data.length, i + w); i < end; i++) { const a = data[i] < 0 ? -data[i] : data[i]; if (a > p) p = a; }
      out[k] = p;
    }
    return out;
  }
  // What travels with a take besides its samples: the boost it was given,
  // whether the microphone clipped, and the microphone it was made with.
  function cleanMeta(m) {
    const out = {};
    if (!m || typeof m !== 'object') return out;
    if (Number.isFinite(m.gain) && m.gain > 0 && m.gain !== 1) out.gain = Math.round(m.gain * 1000) / 1000;
    if (m.clipped === true) out.clipped = true;
    if (Number.isFinite(m.removed)) out.removed = Math.round(m.removed);
    if (m.mic && typeof m.mic === 'object') { try { if (JSON.stringify(m.mic).length < 600) out.mic = m.mic; } catch (e) {} }
    return out;
  }

  async function saveClip(id, rate, data, meta) {
    const m = cleanMeta(meta);
    cache.set(id, { rate, data, peaks: peaksOf(data, rate), meta: m });
    missing.delete(id);
    await tx('readwrite', st => st.put({ rate, pcm: toI16(data).buffer, at: Date.now(), ...m }, id));
  }
  // Bring takes into memory. Resolves true when every one is there.
  async function load(ids) {
    const want = [...new Set(ids)].filter(id => !cache.has(id) && !missing.has(id));
    for (const id of want) {
      let rec = null;
      try { rec = await tx('readonly', st => st.get(id)); } catch (e) {}
      if (rec && rec.pcm) {
        const data = toF32(new Int16Array(rec.pcm));
        cache.set(id, { rate: rec.rate, data, peaks: peaksOf(data, rec.rate), meta: cleanMeta(rec) });
      } else missing.add(id);
    }
    return ids.every(id => cache.has(id));
  }
  const clip = id => cache.get(id) || null;
  const isMissing = id => missing.has(id);
  async function keys() { try { return ((await tx('readonly', st => st.getAllKeys())) || []).filter(k => typeof k === 'string' && k[0] !== '_'); } catch (e) { return []; } }
  async function forget(ids) {
    if (!ids.length) return;
    ids.forEach(id => cache.delete(id));
    try { await tx('readwrite', st => { ids.forEach(id => st.delete(id)); return null; }); } catch (e) {}
  }

  // A take as an AudioBuffer on a context (made once per context).
  const buffers = new WeakMap();
  function bufferFor(ctx, id) {
    const c = cache.get(id);
    if (!c) return null;
    let m = buffers.get(ctx);
    if (!m) { m = new Map(); buffers.set(ctx, m); }
    let b = m.get(id);
    if (!b) {
      b = ctx.createBuffer(1, Math.max(1, c.data.length), c.rate);
      b.copyToChannel(c.data, 0);
      m.set(id, b);
    }
    return b;
  }

  // For a project file: the takes as base64 16-bit samples, and back.
  function toBase64(bytes) {
    let s = '';
    for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function fromBase64(str) {
    const s = atob(str);
    const out = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
    return out;
  }
  async function exportClips(ids) {
    await load(ids);
    const out = {};
    ids.forEach(id => {
      const c = cache.get(id);
      if (c) out[id] = { rate: c.rate, pcm16: toBase64(new Uint8Array(toI16(c.data).buffer)), ...(c.meta || {}) };
    });
    return out;
  }
  async function importClips(map) {
    if (!map || typeof map !== 'object') return 0;
    let n = 0;
    for (const id of Object.keys(map)) {
      const c = map[id];
      if (!/^[\w-]{1,40}$/.test(id) || !c || !Number.isFinite(c.rate) || typeof c.pcm16 !== 'string') continue;
      try {
        const bytes = fromBase64(c.pcm16);
        const data = toF32(new Int16Array(bytes.buffer, 0, bytes.length >> 1));
        await saveClip(id, c.rate, data, c);
        n++;
      } catch (e) { console.error(e); }
    }
    return n;
  }

  // -------- THE MICROPHONE --------
  let prefs = { deviceId: '', gain: 1, echo: false, remove: true };
  (() => {
    const p = loadJSON(PREFS_KEY);
    if (!p || typeof p !== 'object') return;
    if (typeof p.deviceId === 'string') prefs.deviceId = p.deviceId;
    if (Number.isFinite(p.gain)) prefs.gain = Math.min(3, Math.max(0.5, p.gain));
    prefs.echo = p.echo === true;
    prefs.remove = p.remove !== false;
  })();
  let bleed = (() => { const b = loadJSON(BLEED_KEY); return b && Number.isFinite(b.db) && Number.isFinite(b.at) ? b : null; })();
  const savePrefs = () => saveJSON(PREFS_KEY, prefs);

  let mic = null;             // { stream, track, source, hp, tap, refTap, analyser, sink, ctx, audit }
  let opening = null;         // the promise of a microphone being opened
  let workletOn = false;
  let shownNow = false;
  let problem = '';           // why there is no microphone, in words
  let meterPeak = 0, meterRms = 0, meterHold = 0, meterHoldAt = 0, clipAt = 0;
  const recent = [];          // [time, peak] of the last chunks: the words judge a held peak, not the falling bar
  let chanInfo = { chs: 0, ch: 0 };
  let cap = null;             // the capture under way, if any

  /* What is asked of the browser — every call-tuned process named and off,
     each as an `ideal`. Firefox turns the others off along with echo
     cancellation only when that is the sole constraint; naming all of them
     removes the guesswork. Unknown names (voiceIsolation, in most browsers)
     are dropped, not errors. `exact` is kept for the chosen device only. */
  const MUSIC = {
    echoCancellation: { ideal: false }, noiseSuppression: { ideal: false }, autoGainControl: { ideal: false },
    voiceIsolation: { ideal: false },
    channelCount: { ideal: 1 }, sampleRate: { ideal: 48000 }, latency: { ideal: 0.01 }
  };
  function constraints() {
    const a = { ...MUSIC, echoCancellation: { ideal: prefs.echo } };
    if (prefs.deviceId) a.deviceId = { exact: prefs.deviceId };
    return a;
  }

  /* What the browser actually applied. A problem is shown, not fatal: the
     take is still made, and the report says what it was made through. */
  function auditMic(track) {
    let s = {};
    try { s = (track && track.getSettings) ? track.getSettings() : {}; } catch (e) {}
    const problems = [];
    if (s.echoCancellation && !prefs.echo) problems.push('Echo cancellation is on, though the studio asked for it off. Sound may be gated when the backing plays.');
    if (s.noiseSuppression) problems.push('Noise suppression is on (the browser would not turn it off): held notes and overtones may come out dull or wobbly.');
    if (s.autoGainControl) problems.push('Automatic gain is on (the browser would not turn it off): the level will swell and sag on its own.');
    if (s.voiceIsolation) problems.push('Voice isolation is on: other voices and instruments will be cut away.');
    const label = (track && track.label) || '';
    if (/bluetooth|hands-free|airpods|headset|buds|\bbt\b|hfp/i.test(label))
      problems.push('This looks like a Bluetooth microphone: phone quality, with the overtones cut off. The built-in, a wired or a USB microphone sounds far better.');
    return { settings: s, label, problems };
  }
  // the microphone, in a few words — kept with each take and in the report
  function micInfo() {
    if (!mic) return null;
    const s = mic.audit.settings || {};
    const on = v => v === true ? 'on' : v === false ? 'off' : '?';
    return { label: mic.audit.label.slice(0, 80), ec: on(s.echoCancellation), ns: on(s.noiseSuppression), agc: on(s.autoGainControl),
             vi: on(s.voiceIsolation), rate: mic.ctx.sampleRate, trackRate: s.sampleRate || null, chs: chanInfo.chs || s.channelCount || null,
             ch: chanInfo.ch, floorDb: Math.round(floorDb()) };
  }

  function ensureMic() {
    if (mic) return Promise.resolve(true);
    if (opening) return opening;
    opening = openMic().finally(() => { opening = null; });
    return opening;
  }
  async function openMic() {
    problem = '';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      problem = location.protocol === 'http:' && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)
        ? 'A microphone needs a secure page (https). Open the studio on eagleviewmusic.com, or from “Open the Recording Studio”.'
        : 'This browser cannot record from a microphone on this page.';
      render();
      return false;
    }
    const ctx = Audio.ensure();
    if (!ctx.audioWorklet || !window.AudioWorkletNode) {
      problem = 'This browser is too old to record a voice here. Try the latest Chrome, Edge, Firefox or Safari.';
      render();
      return false;
    }
    try {
      if (!workletOn) { await ctx.audioWorklet.addModule('js/voice-tap.js'); workletOn = true; }
    } catch (e) {
      console.error(e);
      problem = 'The recorder did not start. Reload the page and try again.';
      render();
      return false;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: constraints(), video: false });
    } catch (e) {
      const name = (e && e.name) || '';
      if (name === 'OverconstrainedError' && prefs.deviceId) {   // the chosen microphone is gone
        prefs.deviceId = '';
        savePrefs();
        return openMic();
      }
      console.warn('microphone:', name, e && e.message);
      problem = name === 'NotAllowedError'
        ? (FRAMED
            ? 'The microphone is not allowed inside this page. Open the studio in its own tab — or, if the browser asked and Block was clicked, click the lock icon in the address bar and allow Microphone.'
            : 'The microphone was not allowed. Click the lock icon in the address bar, allow Microphone, then turn it on again.')
        : name === 'NotFoundError'
          ? 'No microphone was found. Plug one in, then turn it on again.'
          : name === 'NotReadableError'
            ? 'Another app or tab is using the microphone (or it is not working). Close that app, then try again.'
            : name === 'OverconstrainedError'
              ? 'That microphone could not be opened the way the studio asks. Choose another one, or try again.'
              : (name === 'SecurityError' || name === 'AbortError' || name === 'TypeError')
                ? 'This page cannot use the microphone here. Open the studio in its own tab (it needs https, or its own window).'
                : 'The microphone did not start. Check no other app is using it, then try again.';
      render();
      return false;
    }
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) {} }
    const track = stream.getAudioTracks()[0];
    const source = ctx.createMediaStreamSource(stream);
    // 25 Hz: DC and rumble go, every fundamental stays (a bass's low B is 31 Hz)
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 25; hp.Q.value = 0.7;
    // two channels in (see voice-tap.js: the louder one is kept)
    const tap = new AudioWorkletNode(ctx, 'voice-tap', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 2, channelCountMode: 'explicit', channelInterpretation: 'speakers' });
    const analyser = ctx.createAnalyser(); analyser.fftSize = 2048; analyser.smoothingTimeConstant = 0.55;
    const sink = ctx.createGain();
    sink.gain.value = 0;      // the tap has to be pulled by the graph to run; nothing is heard
    source.connect(hp);
    hp.connect(tap);
    hp.connect(analyser);
    tap.connect(sink);
    analyser.connect(sink);
    sink.connect(ctx.destination);
    tap.port.onmessage = e => onChunk(e.data);
    // the reference: exactly what the studio sends to the speakers, as one channel
    const refTap = new AudioWorkletNode(ctx, 'voice-tap', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1, channelCountMode: 'explicit', channelInterpretation: 'speakers' });
    StudioBus.out(ctx).connect(refTap);
    refTap.connect(sink);
    refTap.port.onmessage = e => onRefChunk(e.data);
    mic = { stream, track, source, hp, tap, refTap, analyser, sink, ctx, audit: auditMic(track) };
    await loadIR();
    resetNoise();
    if (track) track.addEventListener('ended', () => { closeMic(); problem = 'The microphone was disconnected.'; render(); });
    watchDevices();
    listDevices();
    render();
    meterLoop();
    return true;
  }
  function closeMic() {
    if (!mic) return;
    if (cap) finish(cap);
    try { mic.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { mic.source.disconnect(); mic.hp.disconnect(); mic.tap.disconnect(); mic.analyser.disconnect(); mic.sink.disconnect(); StudioBus.out(mic.ctx).disconnect(mic.refTap); mic.refTap.disconnect(); } catch (e) {}
    mic.tap.port.onmessage = null;
    mic.refTap.port.onmessage = null;
    mic = null;
    meterPeak = meterRms = meterHold = 0;
    recent.length = 0;
    chanInfo = { chs: 0, ch: 0 };
    resetNoise();
    render();
  }
  async function listDevices() {
    const sel = el('vp-device');
    if (!sel || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    let devs = [];
    try { devs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput'); } catch (e) {}
    const current = (mic && mic.audit.settings.deviceId) || prefs.deviceId;
    sel.innerHTML = devs.map((d, i) => `<option value="${d.deviceId.replace(/"/g, '&quot;')}">${(d.label || 'Microphone ' + (i + 1)).replace(/</g, '&lt;')}</option>`).join('');
    if (current && devs.some(d => d.deviceId === current)) sel.value = current;
    sel.disabled = devs.length < 2 || !!cap;
  }
  // a USB microphone plugged in mid-lesson appears in the picker
  let watching = false;
  function watchDevices() {
    if (watching || !navigator.mediaDevices || !navigator.mediaDevices.addEventListener) return;
    watching = true;
    navigator.mediaDevices.addEventListener('devicechange', () => listDevices());
  }

  // -------- ROOM NOISE --------
  /* The quietest quarter second of the last eight seconds, as RMS. The
     words "quiet", "silent" and the pick-up rule are set against it. */
  const NOISE_CHUNKS = 6, NOISE_KEEP = 32;
  let nAcc = 0, nN = 0, nHist = [], floorRms = 0;
  function resetNoise() { nAcc = 0; nN = 0; nHist = []; floorRms = 0; }
  function noteNoise(rms) {
    nAcc += rms * rms;
    if (++nN < NOISE_CHUNKS) return;
    nHist.push(Math.sqrt(nAcc / nN));
    nAcc = 0; nN = 0;
    if (nHist.length > NOISE_KEEP) nHist.shift();
    floorRms = Math.min(...nHist);
  }
  const floorDb = () => nHist.length ? dB(floorRms) : -100;
  const floorKnown = () => nHist.length >= 4;

  // -------- CAPTURE --------
  /* From now (audio clock) until endCapture(c, at): every sample, placed by
     its frame. c.peaks grows as it goes, for the lane to draw the take live. */
  function startCapture() {
    const ctx = Audio.ensure();
    cap = { from: ctx.currentTime, rate: ctx.sampleRate, chunks: [], t0: null, end: 0, stopAt: Infinity,
            peaks: [], acc: 0, accN: 0, win: Math.max(1, Math.round(ctx.sampleRate / PEAKS)), done: null, finished: false, boost: prefs.gain,
            ref: [], countSpan: null };   // the speakers' feed; the count-in's span on the speakers' clock (set by studio.js)
    if (el('vp-device')) el('vp-device').disabled = true;
    return cap;
  }
  function onChunk(m) {
    const p = m.peak || 0;
    if (p > meterPeak) meterPeak = p;
    meterRms = m.rms || 0;
    const now = performance.now();
    recent.push([now, p]);
    while (recent.length && recent[0][0] < now - 400) recent.shift();
    if (p >= 0.99) clipAt = now;
    if (m.chs) chanInfo = { chs: m.chs, ch: m.ch };
    noteNoise(m.rms || 0);
    const c = cap;
    if (!c || c.finished) return;
    const rate = c.rate;
    const t = m.frame / rate;
    const end = t + m.data.length / rate;
    if (end <= c.from) return;
    let data = m.data, t1 = t;
    if (t < c.from) { const k = Math.round((c.from - t) * rate); data = data.subarray(k); t1 = t + k / rate; }
    if (t1 >= c.stopAt) { finish(c); return; }
    let last = false;
    if (t1 + data.length / rate > c.stopAt) { data = data.subarray(0, Math.max(0, Math.round((c.stopAt - t1) * rate))); last = true; }
    if (c.t0 == null) c.t0 = t1;
    c.chunks.push({ t: t1, data });
    c.end = t1 + data.length / rate;
    for (let i = 0; i < data.length; i++) {           // the lane's live sketch, boosted, never past full scale
      const a = data[i] < 0 ? -data[i] : data[i];
      if (a > c.acc) c.acc = a;
      if (++c.accN >= c.win) { c.peaks.push(Math.min(1, c.acc * c.boost)); c.acc = 0; c.accN = 0; }
    }
    if (last) finish(c);
  }
  // The speakers' feed, kept by frame beside the microphone's samples.
  function onRefChunk(m) {
    const c = cap;
    if (!c || c.finished) return;
    const t = m.frame / c.rate;
    if (t + m.data.length / c.rate <= c.from) return;
    c.ref.push({ t, data: m.data });
  }
  // Resolves { t0, rate, data (raw), peak, boost, clipped, mic, ref, countSpan } once the last samples before `at` are in.
  function endCapture(c, at) {
    if (!c) return Promise.resolve(null);
    c.stopAt = at;
    return new Promise(resolve => {
      c.done = resolve;
      if (c.finished) { resolve(c.result); return; }
      c.timer = setTimeout(() => finish(c), 700);   // a microphone that stopped sending
    });
  }
  function finish(c) {
    if (c.finished) { if (c.done) c.done(c.result); return; }
    c.finished = true;
    clearTimeout(c.timer);
    if (cap === c) cap = null;
    listDevices();
    let result = null;
    if (c.t0 != null && c.chunks.length) {
      const n = Math.max(0, Math.round((c.end - c.t0) * c.rate));
      const data = new Float32Array(n);
      let peak = 0;
      c.chunks.forEach(ch => {
        const at = Math.round((ch.t - c.t0) * c.rate);
        const part = ch.data.subarray(0, Math.max(0, Math.min(ch.data.length, n - at)));
        data.set(part, at);
        for (let i = 0; i < part.length; i++) { const a = part[i] < 0 ? -part[i] : part[i]; if (a > peak) peak = a; }
      });
      // raw: the boost goes on the kept slice (boosted()), not the count-in
      result = { t0: c.t0, rate: c.rate, data, peak, boost: c.boost, clipped: peak >= 0.99, mic: micInfo(), countSpan: c.countSpan };
      if (c.ref.length) {          // the speakers' feed, on the same samples
        const ref = new Float32Array(n);
        c.ref.forEach(ch => {
          const at = Math.round((ch.t - c.t0) * c.rate);
          const skip = at < 0 ? -at : 0;
          const len = Math.min(ch.data.length - skip, n - (at + skip));
          if (len > 0) ref.set(ch.data.subarray(skip, skip + len), at + skip);
        });
        result.ref = ref;
      }
    }
    c.result = result;
    if (c.done) c.done(result);
  }

  /* How late the speakers reached the microphone in this take, measured on
     the take itself (backing-removal.js). A take that heard the speakers is
     placed by this, and it becomes the voice delay for the takes that do not. */
  function measureDelay(res) {
    if (!res || !res.ref) return null;
    const m = BackingRemoval.measureDelay(res.data, res.ref, res.rate);
    if (!m || m.ms < 1 || m.ms > 550) return null;
    saveJSON(DELAY_KEY, { ms: m.ms, how: 'take' });
    render();
    return m;
  }
  /* The count-in, where only the speakers sounded: how loud they were at
     the microphone, dBFS peak (null without a count-in). Kept for the panel. */
  function bleedOf(res, vd) {
    const sp = res && res.countSpan;
    if (!sp) return null;
    const a = Math.max(0, Math.round((sp.from + vd - res.t0) * res.rate)), b = Math.min(res.data.length, Math.round((sp.to + vd - res.t0) * res.rate));
    if (b - a < 0.2 * res.rate) return null;
    let bp = 0;
    for (let i = a; i < b; i++) { const v = res.data[i] < 0 ? -res.data[i] : res.data[i]; if (v > bp) bp = v; }
    bleed = { db: dB(bp), at: Date.now() };
    saveJSON(BLEED_KEY, bleed);
    return bleed.db;
  }

  // -------- THE ROOM'S RESPONSE --------
  let irRec;                  // undefined: not looked up yet; null: none; { rate, ir, ms, erle, at, label }
  async function loadIR() {
    if (irRec !== undefined) return irRec;
    try {
      const r = await tx('readonly', st => st.get(IR_KEY));
      irRec = r && r.ir && Number.isFinite(r.rate) ? { rate: r.rate, ir: new Float32Array(r.ir), ms: r.ms, erle: r.erle, at: r.at, label: r.label || '' } : null;
    } catch (e) { irRec = null; }
    return irRec;
  }
  async function saveIR(rec) {
    irRec = rec;
    await tx('readwrite', st => st.put({ rate: rec.rate, ir: rec.ir.buffer.slice(0), ms: rec.ms, erle: rec.erle, at: rec.at, label: rec.label }, IR_KEY));
  }
  // The backing can be taken out of a take: a response for this sample rate, and the browser not filtering already.
  const removalReady = () => !!(prefs.remove && irRec && mic && irRec.rate === mic.ctx.sampleRate && !prefs.echo);
  /* A take's predicted echo, fitted (a small lag, a gain — the path may have
     shifted since the sweep) over the take itself and subtracted. The singer
     need not be silent anywhere: their voice is unrelated to the echo, so the
     fit ignores it and the check (blockErle) finds the figure in the pauses.
     Returns { clean, erle (dB, null when nothing to measure), median, lag, gain }. */
  async function removeBacking(res, delaySec) {
    if (!res || !res.ref || !irRec || irRec.rate !== res.rate) return null;
    const echo = await BackingRemoval.predictEcho(res.ref, irRec.ir, res.rate);
    const n = res.data.length;
    // the sweep's response carries the sweep's delay; this take's own, when measured, says how far to look
    const center = Number.isFinite(delaySec) ? Math.round((delaySec - irRec.ms / 1000) * res.rate) : 0;
    const fit = BackingRemoval.fitEcho(res.data, echo, 0, Math.min(n, Math.round(20 * res.rate)), Math.round(0.015 * res.rate), center);
    const lag = fit ? fit.lag : 0, gain = fit ? fit.gain : 1;
    const clean = new Float32Array(n);
    for (let i = 0; i < n; i++) { const j = i - lag; clean[i] = res.data[i] - (j >= 0 && j < echo.length ? gain * echo[j] : 0); }
    const q = BackingRemoval.blockErle(res.data, clean, echo, res.rate);
    return { clean, erle: q ? q.best : null, median: q ? q.median : null, lag, gain };
  }

  /* The boost: one static gain over the whole kept take, held back so its
     loudest sample stays under the ceiling (a boosted clip is still a clip).
     Returns { data, gain, peak, clipped }; gain is kept with the take. */
  function boosted(data, boost) {
    let raw = 0;
    for (let i = 0; i < data.length; i++) { const a = data[i] < 0 ? -data[i] : data[i]; if (a > raw) raw = a; }
    let gain = Number.isFinite(boost) && boost > 0 ? boost : 1;
    if (gain > 1) gain = Math.min(gain, Math.max(1, raw > 0 ? CEILING / raw : gain));
    if (gain !== 1) for (let i = 0; i < data.length; i++) data[i] *= gain;
    return { data, gain, peak: raw * gain, clipped: raw >= 0.99 };
  }

  /* A take begins where Play began — unless it was sung into during the
     count-in (a pick-up), as a key played in the count-in is. The count-in's
     sound has to be loud beside the take's own — and well above this room's
     noise — so speaker bleed of the clicks is not mistaken for singing.
     Returns that onset (audio time) or null. */
  function pickupOnset(res, tFrom) {
    if (!res || tFrom <= res.t0) return null;
    const win = Math.max(1, Math.round(res.rate * 0.02));
    const rms = (a, b) => { let s = 0; for (let i = a; i < b; i++) s += res.data[i] * res.data[i]; return Math.sqrt(s / Math.max(1, b - a)); };
    const split = Math.min(res.data.length, Math.round((tFrom - res.t0) * res.rate));
    let mainMax = 0;
    for (let i = split; i + win <= res.data.length; i += win) mainMax = Math.max(mainMax, rms(i, i + win));
    const count = [];
    for (let i = 0; i + win <= split; i += win) count.push(rms(i, i + win));
    const countMax = count.reduce((m, x) => Math.max(m, x), 0);
    const floor = floorKnown() ? floorRms : 0;
    if (countMax < Math.max(0.03, floor * 6, 0.4 * mainMax)) return null;
    const k = count.findIndex(x => x > 0.5 * countMax);
    return res.t0 + Math.max(0, k * win / res.rate - 0.03);
  }

  // -------- TIMING --------
  function estimate() {
    let out = 0, inp = 0.01;
    try { const ctx = Audio.ensure(); out = ctx.outputLatency || ctx.baseLatency || 0; } catch (e) {}
    try { const s = mic && mic.track && mic.track.getSettings(); if (s && Number.isFinite(s.latency)) inp = s.latency; } catch (e) {}
    return out + inp;
  }
  function stored() { const d = loadJSON(DELAY_KEY); return d && Number.isFinite(d.ms) ? d : null; }
  const delaySec = () => { const d = stored(); return d ? d.ms / 1000 : estimate(); };

  /* A sweep out of the speakers, listened for by the microphone, with the
     speakers' feed kept beside it. The room's response to it (how, and how
     late, the speakers come back to the microphone) is learned and kept:
     its peak is the round trip a voice take is moved back by, and the whole
     of it is what a take's backing is taken out with. Needs speakers
     (headphones cannot be heard) and the echo filter off. */
  const SWEEP_S = 1.5, IR_S = 0.5;
  async function lineUp() {
    const msg = el('vp-cal-msg');
    const say = t => { if (msg) msg.textContent = t; };
    if (window.Studio && Studio.busy()) Studio.stop();
    if (!await ensureMic()) return;
    if (prefs.echo || (mic.audit.settings && mic.audit.settings.echoCancellation)) { say('Turn off “Filter out the speakers” first — echo cancellation would filter out the test sound too.'); return; }
    const ctx = Audio.ensure();
    say('Listen: a two-second whoosh out of the speakers. Keep the room quiet…');
    const btn = el('vp-cal');
    if (btn) btn.disabled = true;
    const c = startCapture();
    const src = ctx.createBufferSource();
    src.buffer = BackingRemoval.makeSweep(ctx, SWEEP_S, 60, Math.min(20000, ctx.sampleRate * 0.45), 0.5);
    src.connect(StudioBus.out(ctx));
    const t0 = ctx.currentTime + 0.5;
    src.start(t0);
    await sleep((0.5 + SWEEP_S + 0.7) * 1000);
    const res = await endCapture(c, ctx.currentTime);
    if (btn) btn.disabled = false;
    if (!res || !res.ref) { say('Nothing came from the microphone. Check it is plugged in, then try again.'); return; }
    const sr = res.rate;
    const at = t => Math.max(0, Math.min(res.data.length, Math.round((t - res.t0) * sr)));
    let noise = 0, heard = 0;
    for (let i = 0; i < at(t0 - 0.05); i++) noise = Math.max(noise, Math.abs(res.data[i]));
    for (let i = at(t0); i < at(t0 + SWEEP_S + 0.3); i++) heard = Math.max(heard, Math.abs(res.data[i]));
    if (heard < Math.max(0.01, noise * 3)) { say('The microphone did not hear the whoosh. Turn the speakers up (this test cannot hear headphones), then try again — or keep the estimate.'); return; }
    const s = Math.max(0, at(t0) - Math.round(0.05 * sr)), e = at(t0 + SWEEP_S + 0.6);
    const ir = BackingRemoval.estimateIR(res.ref.subarray(s, e), res.data.subarray(s, e), Math.round(IR_S * sr), 3e-4);
    const d = BackingRemoval.irDelay(ir);
    const ms = Math.round(d.at / sr * 1000);
    if (d.clarity < 6 || ms < 1 || ms > 450) { say('The whoosh came back too faint or too muddled to measure — a noisy room, or the speakers very quiet? Try again in a quiet moment.'); return; }
    const echo = await BackingRemoval.predictEcho(res.ref.subarray(s, e), ir, sr);
    const clean = new Float32Array(e - s);
    for (let i = 0; i < clean.length; i++) clean[i] = res.data[s + i] - (echo[i] || 0);
    const erle = Math.round(BackingRemoval.erleDb(res.data.subarray(s, e), clean));
    try { await saveIR({ rate: sr, ir, ms, erle, at: Date.now(), label: mic.audit.label }); } catch (err) { console.error(err); }
    saveJSON(DELAY_KEY, { ms, how: 'test' });
    let text = `Measured: your speakers and microphone take ${ms} ms there and back; voice takes will be moved ${ms} ms earlier. `;
    text += erle >= 10
      ? `The backing can be taken back out of voice takes (${erle} dB).`
      : `The backing will only partly come out of voice takes (${erle} dB): a quieter room, or the speakers a little louder, measure better.`;
    if (heard > 0.5) text += ' The speakers are loud at the microphone — turn them down a little before recording.';
    say(text);
    render();
  }

  // -------- THE PANEL --------
  const MIC_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
  const OFF_NOTE = 'The browser asks first. Recordings stay in this browser — nothing is sent anywhere.';
  function build() {
    const p = el('voice-panel');
    if (!p || p.dataset.built) return;
    p.dataset.built = '1';
    p.innerHTML = `
      <div class="vp">
        <div class="vp-head">
          <span class="vp-icon">${MIC_ICON}</span>
          <div><h3>Voice</h3><p>Sing, speak or play a real instrument into the microphone.</p></div>
        </div>
        <div class="vp-off-ui">
          <button class="btn btn-primary" id="vp-on" type="button">Turn on the microphone</button>
          <p class="panel-note" id="vp-problem">${OFF_NOTE}</p>
          <a class="link-btn" id="vp-own-tab" target="_blank" rel="noopener" hidden>Open the studio in its own tab</a>
        </div>
        <div class="vp-on-ui">
          <div class="vp-meter-row">
            <div class="vp-meter" aria-hidden="true" title="Aim for the shaded band"><div class="vp-target"></div><div class="vp-fill" id="vp-fill"></div><div class="vp-hold" id="vp-hold"></div></div>
            <span class="vp-level" id="vp-level">Quiet</span>
          </div>
          <p class="vp-advice" id="vp-advice" role="status"></p>
          <ul class="vp-audit" id="vp-audit" hidden></ul>
          <div class="vp-grid">
            <label class="vp-field"><span>Microphone</span><select class="select" id="vp-device" aria-label="Microphone"></select></label>
            <label class="vp-field"><span>Boost (laid over the take, never past full scale)</span><span class="vp-range"><input type="range" id="vp-gain" min="50" max="300" step="5"><output id="vp-gain-out">100%</output></span></label>
          </div>
          <p class="panel-note" id="vp-last"></p>
          <p class="vp-tip">Sing with the speakers on: once the microphone is lined up, the studio takes its own sound back out of the take and leaves your voice as it was. You will not hear yourself through the speakers while recording. A good level comes from your distance to the microphone, not from the boost — aim for the shaded band.</p>
          <label class="check"><input type="checkbox" id="vp-remove"><span>Take the studio’s own sound back out of voice takes (once the microphone is lined up). Off, a take keeps the speakers’ sound in it, lined up with the tracks.</span></label>
          <label class="check"><input type="checkbox" id="vp-echo"><span>Use the browser’s echo cancellation instead (a last resort: made for calls, it swallows the voice while the speakers are loud)</span></label>
          <div class="vp-timing"><span id="vp-delay"></span> <button class="link-btn" id="vp-cal" type="button">Line up the microphone</button></div>
          <p class="panel-note vp-cal-msg" id="vp-cal-msg" role="status"></p>
          <details class="vp-check" id="vp-check">
            <summary>Mic check</summary>
            <dl class="vp-dl">
              <dt>Microphone</dt><dd id="vc-label">—</dd>
              <dt>Processing</dt><dd id="vc-proc">—</dd>
              <dt>Sound</dt><dd id="vc-rate">—</dd>
              <dt>Level now</dt><dd id="vc-level">—</dd>
              <dt>Room noise</dt><dd id="vc-noise">—</dd>
              <dt>Voice timing</dt><dd id="vc-delay">—</dd>
              <dt>Speakers at the mic</dt><dd id="vc-bleed">—</dd>
            </dl>
            <canvas class="vp-spec" id="vp-spec" width="640" height="96" aria-label="Spectrum of the microphone"></canvas>
            <p class="vp-tip">The spectrum, low notes left, overtones right. A bright sound should reach past 4 kHz; a wall at 4 or 8 kHz means a phone-quality path, such as Bluetooth. Your computer may process the microphone too (macOS Voice Isolation, Windows “audio enhancements”, ChromeOS noise cancellation) — turn those off for music; this page cannot.</p>
            <div class="row-wrap"><button class="btn btn-sm btn-quiet" id="vc-copy" type="button">Copy a report</button><span class="panel-note" id="vc-copied"></span></div>
          </details>
          <div class="row-wrap"><button class="btn btn-sm btn-quiet" id="vp-off" type="button">Turn the microphone off</button></div>
        </div>
      </div>`;
    el('vp-on').addEventListener('click', () => ensureMic());
    el('vp-off').addEventListener('click', () => { if (!cap) closeMic(); });
    el('vp-own-tab').href = location.href;
    el('vp-device').addEventListener('change', async (e) => {
      prefs.deviceId = e.target.value;
      savePrefs();
      if (mic && !cap) { closeMic(); await ensureMic(); }
    });
    el('vp-gain').addEventListener('input', (e) => {
      prefs.gain = e.target.value / 100;
      el('vp-gain-out').textContent = e.target.value + '%';
      savePrefs();
    });
    el('vp-echo').addEventListener('change', async (e) => {
      prefs.echo = e.target.checked;
      savePrefs();
      if (mic && !cap) { closeMic(); await ensureMic(); }   // the flags are fixed when a stream opens
    });
    el('vp-remove').addEventListener('change', (e) => { prefs.remove = e.target.checked; savePrefs(); render(); });
    el('vp-cal').addEventListener('click', lineUp);
    el('vc-copy').addEventListener('click', copyReport);
  }
  function render() {
    const p = el('voice-panel');
    if (!p) return;
    build();
    p.classList.toggle('mic-on', !!mic);
    const prob = el('vp-problem');
    if (prob) {
      prob.textContent = problem || OFF_NOTE;
      prob.classList.toggle('vp-warn', !!problem);
    }
    el('vp-own-tab').hidden = !(FRAMED && problem);
    el('vp-gain').value = Math.round(prefs.gain * 100);
    el('vp-gain-out').textContent = Math.round(prefs.gain * 100) + '%';
    el('vp-echo').checked = prefs.echo;
    el('vp-remove').checked = prefs.remove;
    const d = stored();
    const delayText = d
      ? `${d.ms} ms (${d.how === 'take' ? 'from your last take' : 'measured'}).`
      : `about ${Math.round(estimate() * 1000)} ms (the browser’s estimate).`;
    const removal = !prefs.remove ? ' Takes keep the speakers’ sound, lined up.'
      : irRec
        ? (irRec.rate === (mic ? mic.ctx.sampleRate : irRec.rate) ? ` Backing removal ready (${irRec.erle} dB).` : ' The sample rate changed — line up the microphone again for backing removal.')
        : ' Line up the microphone and the studio can take the backing back out of voice takes.';
    el('vp-delay').textContent = 'Voice timing: ' + delayText + removal;
    el('vc-delay').textContent = delayText;
    el('vc-bleed').textContent = bleed ? `${Math.round(bleed.db)} dB in the last count-in${bleed.db > -6 ? ' — loud: turn the speakers down' : bleed.db > -20 ? ' — fine' : ' — quiet'}` : 'not measured yet (recorded with a count-in)';
    const audit = el('vp-audit');
    const problems = mic ? mic.audit.problems : [];
    audit.hidden = !problems.length;
    audit.innerHTML = problems.map(t => `<li>${t.replace(/</g, '&lt;')}</li>`).join('');
    renderCheck();
  }
  // The Mic check's standing lines (the live ones are in meterTick).
  function renderCheck() {
    const s = mic ? mic.audit.settings : null;
    const on = v => v === true ? 'on' : v === false ? 'off' : 'unknown';
    el('vc-label').textContent = mic ? (mic.audit.label || 'the default microphone') : 'off';
    el('vc-proc').textContent = s
      ? `echo cancellation ${on(s.echoCancellation)} · noise suppression ${on(s.noiseSuppression)} · auto gain ${on(s.autoGainControl)}${'voiceIsolation' in s ? ' · voice isolation ' + on(s.voiceIsolation) : ''}`
      : '—';
    el('vc-rate').textContent = mic ? soundLine() : '—';
  }
  function soundLine() {
    const s = mic.audit.settings || {};
    const chs = chanInfo.chs || s.channelCount;
    let t = `${mic.ctx.sampleRate} Hz`;
    if (s.sampleRate && s.sampleRate !== mic.ctx.sampleRate) t += ` (the microphone gives ${s.sampleRate} Hz; the browser resamples)`;
    if (chs) t += `, ${chs === 1 ? 'one channel' : chs + ' channels, keeping the ' + (chanInfo.ch ? 'right' : 'left') + ' one'}`;
    return t;
  }

  // The meter: peak in dB, a hold line, words for it, and advice under it.
  let metering = false, tick = 0;
  function meterLoop() {
    if (metering) return;
    metering = true;
    meterTick();
  }
  function meterTick() {
    if (!mic || !shownNow) { metering = false; return; }
    const fill = el('vp-fill'), hold = el('vp-hold'), word = el('vp-level'), advice = el('vp-advice');
    const now = performance.now();
    const clipped = now - clipAt < 1500;
    const shown = Math.min(1, meterPeak * prefs.gain);     // what the take will get
    const held = recent.reduce((m, r) => r[1] > m ? r[1] : m, 0);
    const db = dB(Math.min(1, held * prefs.gain));
    const pct = Math.max(0, Math.min(100, (dB(shown) + 60) / 60 * 100));
    if (pct >= meterHold || now - meterHoldAt > 1200) { meterHold = pct; meterHoldAt = now; }
    if (fill) { fill.style.width = pct + '%'; fill.dataset.zone = clipped || db > -1 ? 'red' : db > -6 ? 'yellow' : 'green'; }
    if (hold) hold.style.left = meterHold + '%';
    const floor = floorDb();
    const noisy = floorKnown() && floor > -50;
    const rawDb = dB(held);
    const text = clipped ? 'Too loud — move back'
      : db > -1 ? 'Loud'
        : db > -6 ? 'Loud — a touch back'
          : db > -18 ? 'Good'
            : db > -30 ? 'A little quiet'
              : rawDb > floor + 8 ? 'Quiet — come closer'
                : 'Silent';
    if (word) { word.textContent = text; word.classList.toggle('vp-warn', clipped); }
    if (advice) {
      advice.textContent = clipped
        ? 'The microphone itself is clipping: move back, or turn the microphone down in your computer’s sound settings. The boost cannot mend this.'
        : noisy
          ? `Room noise is high (${Math.round(floor)} dB): fans, windows, the keyboard? A quieter spot, or the microphone further from the computer, helps more than any setting.`
          : '';
    }
    const check = el('vp-check');
    if (check && check.open && (tick++ % 4 === 0)) {
      el('vc-level').textContent = `peak ${Math.round(rawDb)} dB · average ${Math.round(dB(meterRms))} dB` + (prefs.gain !== 1 ? ` · with the boost, peak ${Math.round(db)} dB` : '');
      el('vc-noise').textContent = floorKnown() ? `${Math.round(floor)} dB — ${floor > -40 ? 'loud' : floor > -50 ? 'noisy' : floor > -60 ? 'fair' : 'quiet'}` : 'listening…';
      el('vc-rate').textContent = soundLine();
      drawSpectrum();
    }
    meterPeak *= 0.6;
    requestAnimationFrame(meterTick);
  }
  // The spectrum: 40 Hz to the top on a log axis, −100 to −10 dB tall.
  let specArr = null;
  function drawSpectrum() {
    const cv = el('vp-spec');
    if (!cv || !mic) return;
    const an = mic.analyser, N = an.frequencyBinCount;
    if (!specArr || specArr.length !== N) specArr = new Float32Array(N);
    an.getFloatFrequencyData(specArr);
    const g = cv.getContext('2d'), W = cv.width, H = cv.height;
    const cs = getComputedStyle(cv);
    const fmin = 40, fmax = mic.ctx.sampleRate / 2, lw = Math.log(fmax / fmin);
    const binOf = f => Math.min(N - 1, Math.max(0, Math.round(f / fmax * N)));
    g.clearRect(0, 0, W, H);
    g.fillStyle = cs.getPropertyValue('--rec').trim() || '#ff3b4a';
    let prev = binOf(fmin);
    for (let x = 0; x < W; x++) {
      const b = binOf(fmin * Math.exp(lw * (x + 1) / W));
      let m = -200;
      for (let k = prev; k <= b; k++) if (specArr[k] > m) m = specArr[k];
      prev = b;
      const h = Math.max(0, Math.min(1, (m + 100) / 90)) * H;
      g.fillRect(x, H - h, 1, h);
    }
    g.fillStyle = cs.getPropertyValue('--text-3').trim() || '#7f8799';
    g.font = '700 10px ' + (cs.getPropertyValue('--font-ui') || 'sans-serif');
    [[100, '100'], [1000, '1k'], [4000, '4k'], [8000, '8k'], [16000, '16k']].forEach(([f, l]) => {
      if (f >= fmax) return;
      const x = Math.round(Math.log(f / fmin) / lw * W);
      g.fillRect(x, 0, 1, H);
      g.fillText(l, x + 3, 11);
    });
  }
  // A report for a teacher to paste when something sounds wrong.
  async function copyReport() {
    const lines = [];
    const s = mic ? mic.audit.settings : {};
    lines.push('Recording Studio — mic check, ' + new Date().toISOString());
    lines.push('Page: ' + location.href + (FRAMED ? ' (inside another page)' : ''));
    lines.push('Browser: ' + navigator.userAgent);
    lines.push('Microphone: ' + (mic ? (mic.audit.label || '(no label)') : 'off'));
    lines.push('Asked for: ' + JSON.stringify(constraints()));
    lines.push('Applied: ' + JSON.stringify(s));
    if (mic) {
      lines.push('Sound: ' + soundLine());
      lines.push('Level now: ' + el('vc-level').textContent);
      lines.push('Room noise: ' + el('vc-noise').textContent);
      lines.push('Boost: ' + Math.round(prefs.gain * 100) + '%');
      lines.push('Voice timing: ' + el('vc-delay').textContent);
      lines.push('Speakers at the mic: ' + el('vc-bleed').textContent);
      lines.push('Backing removal: ' + (!prefs.remove ? 'off' : irRec ? `response of ${irRec.rate} Hz, ${irRec.ms} ms, ${irRec.erle} dB, measured ${new Date(irRec.at).toISOString()}` : 'not measured'));
      lines.push('Context: ' + mic.ctx.sampleRate + ' Hz, base latency ' + Math.round((mic.ctx.baseLatency || 0) * 1000) + ' ms, output latency ' + Math.round((mic.ctx.outputLatency || 0) * 1000) + ' ms');
      mic.audit.problems.forEach(p => lines.push('Problem: ' + p));
    } else if (problem) lines.push('Problem: ' + problem);
    const text = lines.join('\n');
    const out = el('vc-copied');
    try { await navigator.clipboard.writeText(text); out.textContent = 'Copied.'; }
    catch (e) { out.textContent = 'Could not copy — it is in the browser console instead.'; console.log(text); }
    setTimeout(() => { out.textContent = ''; }, 2500);
  }

  // The Voice tab showing (link.js): the microphone is on only while it is.
  async function shown(on) {
    shownNow = on;
    if (!on) { if (!cap) closeMic(); return; }
    render();
    let granted = false;
    try { granted = navigator.permissions && (await navigator.permissions.query({ name: 'microphone' })).state === 'granted'; } catch (e) {}
    if (granted && shownNow) await ensureMic();
    if (mic) meterLoop();
  }

  // A line under the fields about the last take (studio.js).
  function say(text) { const p = el('vp-last'); if (p) p.textContent = text || ''; }

  return {
    ensureMic, closeMic, shown, render, say,
    get on() { return !!mic; },
    startCapture, endCapture, boosted, pickupOnset, delaySec, floorDb, micInfo,
    bleed: () => bleed, bleedOf, measureDelay, removalReady, removeBacking, echoFilter: () => prefs.echo, removalWanted: () => prefs.remove,
    saveClip, load, clip, isMissing, keys, forget, bufferFor, exportClips, importClips, peaksPerSec: PEAKS
  };
})();

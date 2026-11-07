/* ==========================================================================
   Recording Studio — voice.js
   Voice tracks: the microphone, recorded as sound. The recording is Vocal
   Booth's (vocal-booth/js/engine.js, miccheck.js), on the studio's timeline.

   - NOTHING IS PUT BETWEEN THE MICROPHONE AND THE TAKE. Every call-style
     process is asked off and read back (a constraint is a request, not a
     promise); samples come raw from an AudioWorklet (capture-worklet.js, a
     copy of Vocal Booth's); no filter, no boost, no echo or noise removal.
     So what comes out of the speakers goes into the take: headphones.
   - THE CLOCK runs at the microphone's own rate while the project has no
     takes, and at the takes' rate once it has, so nothing is converted.
   - A TAKE IS MONO: whichever input carried more, chosen when it ends. It is
     kept whole, count-in and all, as rows of 32-bit floats written while it
     runs, so a closed page costs half a second of singing at most. The
     project says which part of it is heard:
     regions { c (clip id), b (beat), o (seconds into the clip), d (seconds) }.
     A take does not change speed with the tempo.
   - TIMING: a take moves earlier by the round trip, measured by the timing
     test per microphone, else the browser's own figures.

   IndexedDB, store `clips`:
     <clip id>            { rate, rows: 1, ch, length, at, clipped, mic, delayMs }
                          (older takes: { rate, pcm: Int16 samples, at, … })
     _r:<id>:<ch>:<row>   Float32Array, half a second
     _take:<id>           a take still going: where it belongs, for the rescue

   window.StudioVoice — studio.js, voices.js and link.js call in.
   ========================================================================== */
const StudioVoice = (() => {
  'use strict';

  const DB_NAME = 'evm_studio_audio_v1', STORE = 'clips';
  const PREFS_KEY = 'evm_studio_voice_v1';        // { deviceId }
  const DELAY_KEY = 'evm_studio_mic_delays_v2';   // microphone name -> { ms, at }
  const PEAKS = 200;          // waveform peaks a second, for drawing
  const ROW_SEC = 0.5;        // the most a closed page can cost

  const el = id => document.getElementById(id);
  const loadJSON = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const dB = x => 20 * Math.log10(Math.max(x, 1e-6));
  const FRAMED = (() => { try { return window.top !== window.self; } catch (e) { return true; } })();
  const named = n => { const e = new Error(n); e.name = n; return e; };

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
  const rowKey = (id, ch, row) => `_r:${id}:${ch}:${String(row).padStart(6, '0')}`;
  const rowRange = (id, ch) => {
    const head = `_r:${id}:${ch == null ? '' : ch + ':'}`;
    return IDBKeyRange.bound(head, head + '￿');
  };
  const takeKey = id => '_take:' + id;

  const cache = new Map();    // id -> { rate, data: Float32Array, peaks: Float32Array, meta }
  const missing = new Set();  // ids looked for and not found (a deleted take)

  const concat = (list, n) => {
    const out = new Float32Array(n);
    let at = 0;
    for (const x of list) { out.set(x, at); at += x.length; }
    return out;
  };
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
  // What travels with a take besides its samples.
  function cleanMeta(m) {
    const out = {};
    if (!m || typeof m !== 'object') return out;
    if (m.clipped === true) out.clipped = true;
    if (Number.isFinite(m.delayMs)) out.delayMs = Math.round(m.delayMs);
    if (m.mic && typeof m.mic === 'object') { try { if (JSON.stringify(m.mic).length < 600) out.mic = m.mic; } catch (e) {} }
    return out;
  }

  async function readChannel(id, ch) {
    const rows = (await tx('readonly', st => st.getAll(rowRange(id, ch)))) || [];
    let n = 0;
    rows.forEach(r => { n += r.length; });
    return concat(rows, n);
  }
  const dropChannel = (id, ch) => tx('readwrite', st => { st.delete(rowRange(id, ch)); return null; });

  // A whole take at once (one from a project file).
  async function saveClip(id, rate, data, meta) {
    const m = cleanMeta(meta);
    cache.set(id, { rate, data, peaks: peaksOf(data, rate), meta: m });
    missing.delete(id);
    await dropChannel(id, null);
    const step = Math.round(rate * ROW_SEC);
    for (let at = 0, row = 0; at < data.length; at += step, row++) {
      const part = data.slice(at, at + step);
      await tx('readwrite', st => { st.put(part, rowKey(id, 0, row)); return null; });
    }
    await tx('readwrite', st => { st.put({ rate, rows: 1, ch: 0, length: data.length, at: Date.now(), ...m }, id); return null; });
  }
  // Bring takes into memory. Resolves true when every one is there.
  async function load(ids) {
    const want = [...new Set(ids)].filter(id => !cache.has(id) && !missing.has(id));
    for (const id of want) {
      let rec = null, data = null;
      try {
        rec = await tx('readonly', st => st.get(id));
        if (rec && rec.pcm) data = toF32(new Int16Array(rec.pcm));
        else if (rec && rec.rows) data = await readChannel(id, rec.ch || 0);
      } catch (e) { console.error(e); }
      if (data && data.length) cache.set(id, { rate: rec.rate, data, peaks: peaksOf(data, rec.rate), meta: cleanMeta(rec) });
      else missing.add(id);
    }
    return ids.every(id => cache.has(id));
  }
  const clip = id => cache.get(id) || null;
  const isMissing = id => missing.has(id);
  async function keys() { try { return ((await tx('readonly', st => st.getAllKeys())) || []).filter(k => typeof k === 'string' && k[0] !== '_'); } catch (e) { return []; } }
  async function forget(ids) {
    if (!ids.length) return;
    ids.forEach(id => cache.delete(id));
    try { await tx('readwrite', st => { ids.forEach(id => { st.delete(id); st.delete(takeKey(id)); st.delete(rowRange(id, null)); }); return null; }); } catch (e) {}
  }
  // The rate most of these takes (in memory) were made at, or 0.
  function mainRate(ids) {
    const by = new Map();
    new Set(ids).forEach(id => { const c = cache.get(id); if (c) by.set(c.rate, (by.get(c.rate) || 0) + c.data.length); });
    let best = 0, most = -1;
    by.forEach((n, rate) => { if (n > most) { most = n; best = rate; } });
    return best;
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
  let prefs = { deviceId: '' };
  (() => {   // (an older page also kept a boost and echo switches here: they mean nothing now)
    const p = loadJSON(PREFS_KEY);
    if (p && typeof p.deviceId === 'string') prefs.deviceId = p.deviceId;
    saveJSON(PREFS_KEY, prefs);
    try { ['evm_studio_mic_delay_v1', 'evm_studio_bleed_v1'].forEach(k => localStorage.removeItem(k)); } catch (e) {}
    tx('readwrite', st => { st.delete('_ir'); return null; }).catch(() => {});
  })();
  const savePrefs = () => saveJSON(PREFS_KEY, prefs);

  let mic = null;             // { ctx, stream, track, settings, label, deviceId, problems, src, node, silent }
  let opening = null;         // the promise of a microphone being opened
  let shownNow = false;
  let problem = '';           // why there is no microphone, in words
  let testing = false;        // a test in the panel is using the microphone
  let closeAfter = false;     // the microphone went away during a take: close when it is kept
  let capId = 0;
  let raw = null;             // the capture the worklet is sending, if any
  let cap = null;             // the take under way, if any
  const level = { peak: 0, rms: 0, chs: 0, clipped: false };
  const log = [];             // the last 10 s of { t, peak, rms }
  const modules = new WeakSet();   // contexts that have the worklet

  const goodRate = r => (r === 44100 || r === 48000 ? r : 48000);
  const sounding = () => window.Studio && Studio.sounding();
  const projectIds = () => (window.Studio ? Studio.takeIds() : []);

  /* The rate this project's takes want. Nothing may be sounding to change clocks;
     the microphone is on the old context, so it goes and comes back. */
  async function matchRate() {
    const ids = projectIds();
    if (ids.length) await load(ids);
    const want = mainRate(ids);
    let ctx = Audio.ensure();
    if (want && ctx.sampleRate !== want && !sounding() && !cap && !testing) {
      const had = !!mic;
      if (had) dropMic();
      ctx = Audio.restart(want);
      if (had) { try { await openMic(savedDevice()); } catch (err) { problem = errorText(err); render(); } }
    }
    return want;
  }
  const savedDevice = () => prefs.deviceId || undefined;

  function audit(track, s) {
    const out = [];
    if (s.echoCancellation) out.push('Echo cancellation is on. This browser would not turn it off, so held notes may cut out.');
    if (s.noiseSuppression) out.push('Noise suppression is on. This browser would not turn it off, so your tone may come out dull or wobbly.');
    if (s.autoGainControl) out.push('Automatic volume is on. This browser would not turn it off, so your level may swell and sag.');
    if (s.voiceIsolation) out.push('Voice isolation is on, which can thin out your tone. Turn it off in your computer’s microphone settings.');
    if (/bluetooth|hands-?free|airpods|headset|buds|\bbt\b|hfp/i.test(track.label || '')) {
      out.push('This looks like a Bluetooth microphone, which is phone quality. A wired or USB microphone, or even your computer’s built-in one, will sound far better.');
    }
    return out;
  }
  // the microphone, in a few words — kept with each take
  function micInfo(ch) {
    if (!mic) return null;
    const s = mic.settings || {};
    const on = v => v === true ? 'on' : v === false ? 'off' : '?';
    return { label: mic.label.slice(0, 80), ec: on(s.echoCancellation), ns: on(s.noiseSuppression), agc: on(s.autoGainControl), vi: on(s.voiceIsolation),
             rate: mic.ctx.sampleRate, trackRate: s.sampleRate || null, chs: level.chs || s.channelCount || null, ch: ch || 0 };
  }

  function dropMic() {
    const m = mic;
    if (!m) return;
    mic = null;
    try { m.track.onended = null; } catch (e) {}
    try { m.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { m.src.disconnect(); m.node.disconnect(); m.silent.disconnect(); m.node.port.onmessage = null; } catch (e) {}
    level.peak = level.rms = 0;
    log.length = 0;
  }
  function closeMic() {
    if (cap) return;
    dropMic();
    render();
  }

  /* One request at a time: a permission box can wait for as long as the person
     likes, and a second request meanwhile would leave a microphone with nothing using it. */
  function ensureMic() {
    if (mic) return Promise.resolve(true);
    if (opening) return opening;
    problem = '';
    opening = openMic(savedDevice())
      .then(() => {
        if (!shownNow && !cap) { dropMic(); return false; }   // the tab was left while the browser asked
        return true;
      })
      .catch(err => { console.warn('microphone:', err && err.name, err && err.message); problem = errorText(err); return false; })
      .finally(() => { opening = null; render(); if (mic) startMeters(); });
    render();
    return opening;
  }
  async function openMic(deviceId) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw named('NoApi');
    const want = await matchRate();
    let ctx = Audio.ensure();
    if (!ctx.audioWorklet || !window.AudioWorkletNode) throw named('NoWorklet');
    if (mic) return mic;
    const audio = {
      echoCancellation: { ideal: false }, noiseSuppression: { ideal: false }, autoGainControl: { ideal: false },
      voiceIsolation: { ideal: false }, channelCount: { ideal: 2 }, sampleRate: { ideal: want || 48000 }
    };
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

    // No takes yet: run at the microphone's own rate, so nothing is converted.
    ctx = Audio.ensure();
    if (!want && settings.sampleRate && goodRate(settings.sampleRate) !== ctx.sampleRate && !sounding()) {
      ctx = Audio.restart(goodRate(settings.sampleRate));
    }
    let src;
    try {
      src = ctx.createMediaStreamSource(stream);
    } catch (err) {
      // Firefox refuses a microphone at a different rate from the context.
      if (!want && settings.sampleRate && !sounding()) {
        ctx = Audio.restart(settings.sampleRate);
        src = ctx.createMediaStreamSource(stream);
      } else {
        stream.getTracks().forEach(t => t.stop());
        throw named('RateMismatch');
      }
    }
    if (!modules.has(ctx)) { await ctx.audioWorklet.addModule('js/capture-worklet.js'); modules.add(ctx); }
    if (ctx.state === 'suspended') {
      try { await ctx.resume(); } catch (e) {}
      if (ctx.state === 'suspended') document.addEventListener('pointerdown', () => ctx.resume(), { once: true });
    }
    const node = new AudioWorkletNode(ctx, 'vocal-capture', {
      numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [1],
      channelCountMode: 'max', channelInterpretation: 'discrete'
    });
    const silent = ctx.createGain();
    silent.gain.value = 0;      // the worklet has to be pulled by the graph to run; nothing is heard
    src.connect(node);
    node.connect(silent);
    silent.connect(ctx.destination);
    node.port.onmessage = onCapture;
    mic = {
      ctx, stream, track, settings, src, node, silent,
      label: track.label || 'Microphone',
      deviceId: settings.deviceId || deviceId || '',
      problems: audit(track, settings)
    };
    track.onended = () => {
      if (cap) {
        closeAfter = true;
        if (window.Studio) { Studio.toast('The microphone went away, so recording stopped. Your take is saved.'); Studio.stop(); }
        return;
      }
      dropMic();
      problem = 'The microphone was disconnected.';
      render();
    };
    level.clipped = false;
    watchDevices();
    listDevices();
    return mic;
  }
  function errorText(err) {
    const name = err && err.name;
    if (name === 'NoApi') return 'This page can’t reach a microphone. It has to be opened over https, in a current version of Chrome, Edge or Safari.';
    if (name === 'NoWorklet') return 'This browser is too old to record a voice here. Try the latest Chrome, Edge, Firefox or Safari.';
    if (name === 'NotAllowedError' || name === 'SecurityError') {
      return FRAMED
        ? 'The microphone is blocked inside this frame. Open the studio in its own tab.'
        : 'The microphone is blocked. Click the icon at the left of the address bar, allow the microphone, then try again.';
    }
    if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'No microphone was found. Plug one in, then try again.';
    if (name === 'NotReadableError' || name === 'AbortError') return 'Another app may be using the microphone. Close it, then try again.';
    if (name === 'RateMismatch') return 'This browser can’t use this microphone with these recordings. Chrome or Edge will.';
    return 'The microphone would not open (' + (name || 'unknown') + ').';
  }

  async function listDevices() {
    const sel = el('vp-device');
    if (!sel || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    let list = [];
    try { list = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput' && d.deviceId !== 'communications'); } catch (e) {}
    sel.innerHTML = '';
    for (const d of list) {
      const o = document.createElement('option');
      o.value = d.deviceId;
      o.textContent = (d.label || 'Microphone').replace(/^Default\s*-\s*/i, 'Default: ');
      sel.append(o);
    }
    const current = mic ? mic.deviceId : prefs.deviceId;
    if (current && list.some(d => d.deviceId === current)) sel.value = current;
    sel.disabled = !!cap || list.length < 2;
  }
  // a USB microphone plugged in mid-lesson appears in the picker
  let watching = false;
  function watchDevices() {
    if (watching || !navigator.mediaDevices || !navigator.mediaDevices.addEventListener) return;
    watching = true;
    navigator.mediaDevices.addEventListener('devicechange', () => { listDevices(); showOutput(); });
  }

  // -------- FROM THE WORKLET --------
  function onCapture(e) {
    const m = e.data;
    if (m.type === 'meter') {
      const peak = m.chs > 1 ? Math.max(m.p0, m.p1) : m.p0;
      const rms = m.chs > 1 ? Math.max(m.r0, m.r1) : m.r0;
      if (peak > level.peak) level.peak = peak;
      level.rms = rms;
      level.chs = m.chs;
      if (peak >= 0.99) level.clipped = true;
      const now = performance.now();
      log.push({ t: now, peak, rms });
      while (log.length && now - log[0].t > 10000) log.shift();
    } else if (m.type === 'chunk') {
      const s = raw;
      if (!s || s.id !== m.id) return;
      if (s.first == null) s.first = m.first;
      if (s.onChunk) s.onChunk(m);
    } else if (m.type === 'end') {
      const s = raw;
      if (!s || s.id !== m.id) return;
      raw = null;
      if (s.done) s.done();
    }
  }
  function beginRaw(from, onChunk) {
    const s = { id: ++capId, from, first: null, onChunk, done: null };
    raw = s;
    mic.node.port.postMessage({ cmd: 'start', id: s.id, from });
    return s;
  }
  function endRaw(s) {
    return new Promise(res => {
      s.done = res;
      if (mic && raw === s) mic.node.port.postMessage({ cmd: 'stop', id: s.id });
      else { if (raw === s) raw = null; res(); }
    });
  }
  /* The voice: whichever input carries more. */
  function louder(a, b) {
    if (!b) return 0;
    let ea = 0, eb = 0;
    for (let i = 0; i < a.length; i++) { ea += a[i] * a[i]; eb += b[i] * b[i]; }
    return eb > ea ? 1 : 0;
  }

  // -------- A TAKE --------
  const newQueue = () => ({ list: [], frames: 0, row: 0, writes: [] });
  function queueRow(c, ch, data, force) {
    const q = c.q[ch];
    if (data) { q.list.push(data); q.frames += data.length; }
    if (!q.frames || (!force && q.frames < Math.round(c.rate * ROW_SEC))) return;
    const row = concat(q.list, q.frames);
    q.list = []; q.frames = 0;
    const key = rowKey(c.id, ch, q.row++);
    const place = ch === 0 ? { ...c.info, id: c.id, rate: c.rate, t0: c.t0, mic: mic ? mic.label : '', alive: Date.now() } : null;
    q.writes.push(tx('readwrite', st => {
      st.put(row, key);
      if (place) st.put(place, takeKey(c.id));
      return null;
    }).catch(err => { console.error(err); c.failed = true; }));
  }
  /* From now until endCapture: every sample, on exact frames of the clock the
     tracks are scheduled on. c.peaks grows for the lane to draw the take live.
     info = { id, project, track, from, anchor, spb, vdelay } says where it belongs. */
  function startCapture(info) {
    const ctx = mic.ctx, sr = ctx.sampleRate;
    const c = cap = {
      id: info.id, info, rate: sr, t0: null, n: 0, a: [], b: null, failed: false,
      peaks: [], acc: 0, accN: 0, win: Math.max(1, Math.round(sr / PEAKS)),
      q: [newQueue(), newQueue()]
    };
    level.clipped = false;
    if (navigator.storage && navigator.storage.persist) { try { navigator.storage.persist(); } catch (e) {} }
    if (navigator.wakeLock) navigator.wakeLock.request('screen').then(w => { if (c.finishing) w.release(); else c.wake = w; }).catch(() => {});
    c.raw = beginRaw(Math.ceil(ctx.currentTime * sr), m => takeChunk(c, m));
    if (el('vp-device')) el('vp-device').disabled = true;
    return c;
  }
  function takeChunk(c, m) {
    const a = m.n === m.a.length ? m.a : m.a.subarray(0, m.n);
    let b = null;
    if (c.t0 == null) c.t0 = m.first / c.rate;
    if (m.b) {
      b = m.n === m.b.length ? m.b : m.b.subarray(0, m.n);
      if (!c.b) {            // a second channel woke up: everything so far was silent on it
        c.b = [];
        if (c.n) { const z = new Float32Array(c.n); c.b.push(z); queueRow(c, 1, z, true); }
      }
    } else if (c.b) {
      b = new Float32Array(m.n);
    }
    c.a.push(a);
    queueRow(c, 0, a, false);
    if (c.b) { c.b.push(b); queueRow(c, 1, b, false); }
    for (let i = 0; i < m.n; i++) {     // the lane's live sketch
      let v = a[i] < 0 ? -a[i] : a[i];
      if (b) { const w = b[i] < 0 ? -b[i] : b[i]; if (w > v) v = w; }
      if (v > c.acc) c.acc = v;
      if (++c.accN >= c.win) { c.peaks.push(c.acc); c.acc = 0; c.accN = 0; }
    }
    c.n += m.n;
  }
  function measure(data) {
    let peak = 0, clipped = 0, run = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i] < 0 ? -data[i] : data[i];
      if (v > peak) peak = v;
      if (v >= 0.99) { if (++run === 3) clipped++; } else run = 0;
    }
    return { peak, clipped: clipped > 0 };
  }
  /* Resolves { id, t0, rate, data, ch, peak, clipped, mic, delayMs, failed } once the last samples are in. */
  function endCapture(c) {
    if (!c) return Promise.resolve(null);
    if (!c.ending) c.ending = new Promise(resolve => {
      const go = () => { clearTimeout(timer); finish(c).then(resolve); };
      const timer = setTimeout(go, 700);   // a microphone that stopped sending
      endRaw(c.raw).then(go);
    });
    return c.ending;
  }
  function finish(c) {
    if (!c.finishing) c.finishing = (async () => {
      if (c.wake) { try { c.wake.release(); } catch (e) {} c.wake = null; }
      let result = null;
      if (c.n) {
        const A = concat(c.a, c.n), B = c.b ? concat(c.b, c.n) : null;
        const ch = louder(A, B);
        const data = ch ? B : A;
        queueRow(c, 0, null, true);
        if (c.b) queueRow(c, 1, null, true);
        await Promise.all([...c.q[0].writes, ...c.q[1].writes]);
        if (B) { try { await dropChannel(c.id, ch ? 0 : 1); } catch (e) { console.error(e); } }
        const stats = measure(data);
        result = { id: c.id, t0: c.t0, rate: c.rate, data, ch, peak: stats.peak, clipped: stats.clipped, mic: micInfo(ch), delayMs: Math.round((c.info.vdelay || 0) * 1000), failed: c.failed };
      }
      if (cap === c) cap = null;
      listDevices();
      if (closeAfter) { closeAfter = false; dropMic(); problem = 'The microphone was disconnected.'; render(); }
      else if (!shownNow && !testing) closeMic();
      return result;
    })();
    return c.finishing;
  }
  /* The take stays. False when the browser could not store it: it still plays here. */
  async function commit(res) {
    const m = cleanMeta(res);
    cache.set(res.id, { rate: res.rate, data: res.data, peaks: peaksOf(res.data, res.rate), meta: m });
    missing.delete(res.id);
    try {
      await tx('readwrite', st => {
        st.put({ rate: res.rate, rows: 1, ch: res.ch || 0, length: res.data.length, at: Date.now(), ...m }, res.id);
        st.delete(takeKey(res.id));
        return null;
      });
    } catch (e) { console.error(e); return false; }
    return !res.failed;
  }
  const discard = res => forget([res.id]);

  /* Takes cut off by a closed page or a crash. Takes another tab is still writing
     (their rows are fresh) are left alone; studio.js asks again a little later. */
  async function recover() {
    let recs = [];
    try { recs = (await tx('readonly', st => st.getAll(IDBKeyRange.bound('_take:', '_take:￿')))) || []; } catch (e) { return []; }
    const out = [];
    for (const rec of recs) {
      if (!rec || !rec.id || (cap && cap.id === rec.id) || Date.now() - (rec.alive || 0) < 4000) continue;
      const a = await readChannel(rec.id, 0), b = await readChannel(rec.id, 1);
      const both = Math.min(a.length, b.length);
      const ch = b.length && (!a.length || louder(a.subarray(0, both), b.subarray(0, both))) ? 1 : 0;
      const data = ch ? b : a;
      if (data.length < rec.rate * 0.25) { await forget([rec.id]); continue; }
      if (a.length && b.length) await dropChannel(rec.id, ch ? 0 : 1);
      const stats = measure(data);
      await commit({ id: rec.id, rate: rec.rate, data, ch, clipped: stats.clipped, mic: { label: rec.mic || '' }, delayMs: Math.round((rec.vdelay || 0) * 1000) });
      out.push({ ...rec, length: data.length });
    }
    return out;
  }

  // The quietest quarter second lately, as RMS, or null before there is enough to say.
  function roomRms() {
    if (log.length <= 150) return null;
    let quiet = null;
    const W = 12;
    for (let i = 0; i + W <= log.length; i += 4) {
      let s = 0;
      for (let k = 0; k < W; k++) s += log[i + k].rms * log[i + k].rms;
      s = Math.sqrt(s / W);
      if (quiet == null || s < quiet) quiet = s;
    }
    return quiet;
  }

  /* A take begins where Play began — unless it was sung into during the
     count-in (a pick-up), as a key played in the count-in is. The count-in's
     sound has to be loud beside the take's own — and well above this room's
     noise — so a click heard by the microphone is not mistaken for singing.
     Returns that onset (audio time) or null. The rest is still in the clip,
     so dragging the take's start back brings it out either way. */
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
    const floor = roomRms() || 0;
    if (countMax < Math.max(0.03, floor * 6, 0.4 * mainMax)) return null;
    const k = count.findIndex(x => x > 0.5 * countMax);
    return res.t0 + Math.max(0, k * win / res.rate - 0.03);
  }

  // -------- TIMING --------
  function delayInfo() {
    const d = (loadJSON(DELAY_KEY) || {})[mic ? mic.label : ''];
    if (d && Number.isFinite(d.ms)) return { ms: d.ms, how: 'measured' };
    let sec = 0;
    try { const ctx = Audio.ensure(); sec = (ctx.outputLatency || 0) + (ctx.baseLatency || 0); } catch (e) {}
    const inp = mic && mic.settings && Number.isFinite(mic.settings.latency) ? mic.settings.latency : 0.01;
    return { ms: Math.round((sec + inp) * 1000), how: 'estimated' };
  }
  const delaySec = () => delayInfo().ms / 1000;
  function saveDelay(ms) {
    const all = loadJSON(DELAY_KEY) || {};
    if (mic) all[mic.label] = { ms, at: Date.now() };
    saveJSON(DELAY_KEY, all);
  }

  // -------- THE TWO TESTS --------
  async function testRecord(seconds) {
    const ctx = mic.ctx, sr = ctx.sampleRate;
    const a = [], b = [];
    const s = beginRaw(Math.ceil((ctx.currentTime + 0.05) * sr), m => {
      a.push(m.a.subarray(0, m.n));
      if (m.b) b.push(m.b.subarray(0, m.n));
    });
    await sleep(seconds * 1000 + 100);
    await endRaw(s);
    let n = 0;
    for (const x of a) n += x.length;
    const A = concat(a, n);
    const B = b.length === a.length && b.length ? concat(b, n) : null;
    return louder(A, B) ? B : A;
  }
  function playBuffer(ctx, data) {
    const buffer = ctx.createBuffer(1, Math.max(1, data.length), ctx.sampleRate);
    buffer.copyToChannel(data, 0);
    return new Promise(res => {
      const n = ctx.createBufferSource();
      n.buffer = buffer;
      n.connect(ctx.destination);
      n.onended = () => res();
      n.start();
    });
  }
  /* Soft chirps out, listened for at the microphone. Heard: the exact round trip
     (and the speakers can reach the microphone). Not heard: no leak. */
  async function timingTest() {
    const ctx = mic.ctx, sr = ctx.sampleRate;
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
    const buf = ctx.createBuffer(1, LEN, sr);
    buf.copyToChannel(chirp, 0);
    const SPACE = Math.round(0.7 * sr), LEAD = Math.round(0.35 * sr), COUNT = 5;
    const SEARCH = Math.round(0.6 * sr);
    const a = [], b = [];
    const from = Math.ceil((ctx.currentTime + 0.1) * sr);
    const s = beginRaw(from, m => {
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
    await endRaw(s);
    let n = 0;
    for (const x of a) n += x.length;
    const A = concat(a, n);
    const B = b.length === a.length && b.length ? concat(b, n) : null;
    const x = louder(A, B) ? B : A;
    const first = s.first == null ? from : s.first;

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
    if (lags.filter(l => Math.abs(l - mid) <= tol).length < 3) return { heard: false };
    const ms = Math.round(mid / sr * 1000);
    if (ms < 1) return { heard: false };
    saveDelay(ms);
    return { heard: true, ms };
  }

  // A test needs the microphone to itself: playback stops, a take is left alone.
  function testsFree() {
    if (window.Studio && Studio.busy()) Studio.stop();
    return !testing && !cap && !!mic;
  }
  function testsBusy(on) {
    testing = on;
    el('vp-test').disabled = on;
    el('vp-chirp').disabled = on;
    if (!on && !shownNow) closeMic();
  }
  async function hearYourself() {
    if (!testsFree()) return;
    const btn = el('vp-test');
    testsBusy(true);
    try {
      const ctx = mic.ctx;
      btn.textContent = 'Recording, sing now…';
      const data = await testRecord(5);
      btn.textContent = 'Playing it back…';
      await playBuffer(ctx, data);
      btn.textContent = 'Test again';
    } catch (err) {
      console.error(err);
      btn.textContent = 'Test recording';
    }
    testsBusy(false);
  }
  const TIMING_INTRO = 'Put your headphones on, then press Test. You’ll hear five soft chirps.';
  async function runTiming() {
    if (!testsFree()) return;
    const msg = el('vp-timing-msg');
    testsBusy(true);
    msg.dataset.kind = '';
    msg.textContent = 'Listening… please stay quiet for a moment.';
    try {
      const r = await timingTest();
      if (r.heard) {
        msg.dataset.kind = 'warn';
        msg.textContent = 'Your microphone heard the chirps, so timing is now measured exactly (' + r.ms + ' ms). If that came from speakers or leaky headphones, the music will end up in your voice track too: record with headphones on, and keep them away from the microphone.';
      } else {
        msg.dataset.kind = 'good';
        msg.textContent = 'Your microphone didn’t hear the chirps. That is what you want while recording. Optional, for exact timing: hold one headphone right against the microphone and press Test again.';
      }
    } catch (err) {
      console.error(err);
      msg.textContent = 'That test didn’t work. Try once more.';
    }
    testsBusy(false);
    render();
  }

  // -------- THE PANEL --------
  const MIC_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
  const OFF_NOTE = 'The browser asks first. Recordings stay in this browser — nothing is sent anywhere.';
  const TIPS = 'Wear headphones: whatever comes out of the speakers goes into the take. Sing about a hand’s width from the microphone, a little off to the side, and leave one ear uncovered so you can hear yourself. The studio can’t change your microphone’s hardware level, so if it’s too loud or too quiet, move, or change the input volume in your computer’s sound settings. It adds no effects and doesn’t clean up your sound, so a quiet room makes the biggest difference.';
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
          <p class="panel-note" id="vp-problem" role="status">${OFF_NOTE}</p>
          <a class="link-btn" id="vp-own-tab" target="_blank" rel="noopener" hidden>Open the studio in its own tab</a>
        </div>
        <div class="vp-on-ui">
          <div class="vp-col">
            <label class="vp-field"><span>Microphone</span><select class="select" id="vp-device" aria-label="Microphone"></select></label>
            <div class="vp-level">
              <div class="vp-meter-row">
                <div class="vp-meter" aria-hidden="true">
                  <div class="vp-meter-cover" id="vp-cover"></div>
                  <div class="vp-meter-hold" id="vp-hold"></div>
                </div>
                <button class="vp-clip" id="vp-clip" type="button" title="Your sound reached the very top of the meter. Click to clear.">Too loud</button>
              </div>
              <div class="vp-scale" aria-hidden="true">
                <span style="left:0%">−60 dB</span><span style="left:50%">−30</span><span style="left:70%">−18</span><span style="left:90%">−6</span><span style="left:100%">0</span>
              </div>
              <p class="vp-verdict" id="vp-verdict" role="status"></p>
              <p class="vp-room" id="vp-room"></p>
            </div>
            <ul class="vp-problems" id="vp-problems" hidden></ul>
          </div>
          <div class="vp-col">
            <section class="vp-card">
              <div>
                <h4>Hear yourself</h4>
                <p>Records five seconds of you, then plays them back.</p>
              </div>
              <button class="btn" id="vp-test" type="button">Test recording</button>
            </section>
            <section class="vp-card">
              <div>
                <h4>Headphones and timing</h4>
                <p id="vp-timing-msg" role="status">${TIMING_INTRO}</p>
              </div>
              <button class="btn" id="vp-chirp" type="button">Test</button>
            </section>
            <p class="vp-foot"><span id="vp-output"></span> <span id="vp-delay"></span></p>
            <p class="vp-note" data-key="tips">${TIPS}</p>
            <div class="row-wrap"><button class="btn btn-sm btn-quiet" id="vp-off" type="button">Turn the microphone off</button></div>
          </div>
        </div>
      </div>`;
    el('vp-on').addEventListener('click', () => ensureMic());
    el('vp-off').addEventListener('click', () => { if (!cap && !testing) closeMic(); });
    el('vp-own-tab').href = location.href;
    el('vp-clip').addEventListener('click', () => { level.clipped = false; });
    el('vp-test').addEventListener('click', hearYourself);
    el('vp-chirp').addEventListener('click', runTiming);
    el('vp-device').addEventListener('change', async (e) => {
      prefs.deviceId = e.target.value;
      savePrefs();
      if (cap || testing) return;
      dropMic();
      await ensureMic();
    });
    foldNote(p.querySelector('.vp-note'));
  }
  // An explaining note folds into a circled i, remembered per device.
  function foldNote(note) {
    const key = 'evm_studio_fold_' + note.dataset.key;
    const body = document.createElement('span');
    body.className = 'vp-note-body';
    while (note.firstChild) body.append(note.firstChild);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vp-note-i';
    btn.textContent = 'i';
    btn.setAttribute('aria-label', 'Show or hide this note');
    note.append(body, btn);
    const apply = folded => {
      note.classList.toggle('folded', folded);
      btn.setAttribute('aria-expanded', String(!folded));
      btn.title = folded ? body.textContent.trim() : '';
    };
    let folded = false;
    try { folded = localStorage.getItem(key) === '1'; } catch (e) {}
    apply(folded);
    btn.addEventListener('click', () => {
      folded = !note.classList.contains('folded');
      apply(folded);
      try { localStorage.setItem(key, folded ? '1' : '0'); } catch (e) {}
    });
  }
  async function showOutput() {
    let label = '';
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      const out = list.filter(d => d.kind === 'audiooutput');
      const dev = out.find(d => d.deviceId === 'default') || out[0];
      label = dev && dev.label ? dev.label.replace(/^Default\s*-\s*/i, '') : '';
    } catch (e) {}
    const o = el('vp-output');
    if (o) o.textContent = label ? 'Sound is going to: ' + label + '.' : '';
  }
  function render() {
    const p = el('voice-panel');
    if (!p) return;
    build();
    p.classList.toggle('mic-on', !!mic);
    const prob = el('vp-problem');
    prob.textContent = problem || (opening ? 'Your browser is asking to use the microphone. Look near the address bar and choose Allow.' : OFF_NOTE);
    prob.classList.toggle('vp-warn', !!problem);
    el('vp-on').disabled = !!opening;
    el('vp-own-tab').hidden = !(FRAMED && problem);
    const ul = el('vp-problems');
    const list = mic ? mic.problems : [];
    ul.hidden = !list.length;
    ul.innerHTML = '';
    list.forEach(t => { const li = document.createElement('li'); li.textContent = t; ul.append(li); });
    if (mic) {
      const info = delayInfo();
      el('vp-delay').textContent = `Timing: takes move ${info.ms} ms earlier to line up (${info.how}).`;
      showOutput();
    }
  }

  // The meter: its colours sit still, a cover slides off them. Falls at 26 dB a second.
  let metering = false, shownPeak = 0, holdPeak = 0, holdAt = 0, lastFrame = 0;
  const toFrac = d => Math.max(0, Math.min(1, (d + 60) / 60));
  function startMeters() {
    if (metering) return;
    metering = true;
    lastFrame = performance.now();
    requestAnimationFrame(meterFrame);
  }
  function meterFrame(now) {
    if (!mic || !shownNow) { metering = false; return; }
    const dt = Math.min(100, Math.max(0, now - lastFrame)) / 1000;
    lastFrame = now;
    shownPeak = Math.max(level.peak, shownPeak * Math.pow(10, -26 * dt / 20));
    level.peak = 0;
    if (shownPeak >= holdPeak || now - holdAt > 1600) { holdPeak = shownPeak; holdAt = now; }
    el('vp-cover').style.transform = 'scaleX(' + (1 - toFrac(dB(shownPeak))).toFixed(4) + ')';
    const hold = toFrac(dB(holdPeak));
    el('vp-hold').style.left = (hold * 100).toFixed(2) + '%';
    el('vp-hold').style.opacity = hold > 0.02 ? '1' : '0';
    el('vp-clip').classList.toggle('lit', !!level.clipped);
    verdict(now);
    requestAnimationFrame(meterFrame);
  }
  // What the last few seconds say about the level and the room.
  function verdict(now) {
    const v = el('vp-verdict'), room = el('vp-room');
    let loud = 0;
    for (const r of log) if (now - r.t < 5000 && r.peak > loud) loud = r.peak;
    const d = dB(loud);
    let word, kind;
    if (level.clipped && d > -1) { word = 'Too loud: that distorted. Move back, or turn the input volume down in your computer’s sound settings.'; kind = 'bad'; }
    else if (d < -50) { word = 'Sing the loudest part of your song.'; kind = ''; }
    else if (d < -30) { word = 'Too quiet. Move closer, or turn the input volume up in your computer’s sound settings.'; kind = 'bad'; }
    else if (d < -18) { word = 'A little quiet, but it will work. Closer would be better.'; kind = 'warn'; }
    else if (d <= -6) { word = 'Great level. Your loudest notes have room.'; kind = 'good'; }
    else if (d < -0.5) { word = 'A little loud. Back up a bit so your biggest notes have room.'; kind = 'warn'; }
    else { word = 'Too loud: that distorted. Move back, or turn the input volume down in your computer’s sound settings.'; kind = 'bad'; }
    if (v.textContent !== word) v.textContent = word;
    v.dataset.kind = kind;
    const quiet = roomRms();
    let t = '';
    if (quiet != null) {
      const q = dB(quiet);
      t = q > -45 ? 'Room noise: high. A quieter spot would help (fans, windows, other people).'
        : q > -58 ? 'Room noise: some, but fine.'
          : 'Room noise: nice and quiet.';
    }
    if (room.textContent !== t) room.textContent = t;
  }

  // The Voice tab showing (link.js): the microphone is on only while it is.
  async function shown(on) {
    shownNow = on;
    if (!on) { if (!cap && !testing) closeMic(); return; }
    render();
    let granted = false;
    try { granted = navigator.permissions && (await navigator.permissions.query({ name: 'microphone' })).state === 'granted'; } catch (e) {}
    if (granted && shownNow) await ensureMic();
    if (mic) startMeters();
  }

  return {
    ensureMic, closeMic, shown, render, matchRate,
    get on() { return !!mic; },
    get testing() { return testing; },
    get mic() { return mic; },        // (the tests)
    startCapture, endCapture, commit, discard, recover, pickupOnset, delaySec, delayInfo,
    saveClip, load, clip, isMissing, keys, forget, mainRate, bufferFor, exportClips, importClips, peaksPerSec: PEAKS
  };
})();

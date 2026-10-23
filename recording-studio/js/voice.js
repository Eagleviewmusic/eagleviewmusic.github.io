/* ==========================================================================
   Recording Studio — voice.js
   Voice tracks: the microphone, recorded as sound.

   - THE MICROPHONE comes in on the studio's own audio context, through
     voice-tap.js (an AudioWorklet), so every sample carries the clock the
     tracks are played on. Echo cancellation, noise suppression and auto
     gain are off unless asked for: they are made for calls, and smear music.
     It is on only while the Voice tab is showing (or a take is going).
   - TIMING: a voice is heard late twice over — the backing reaches the
     singer through the speakers, and the singing reaches the studio through
     the microphone. "Line up the microphone" measures both at once: beeps
     out of the speakers, listened for by the microphone. Until then, the
     browser's own figures stand in.
   - CLIPS are kept in this browser's IndexedDB as 16-bit samples (too big
     for localStorage). A project only says where each take sits:
     regions { c (clip id), b (beat), o (seconds into the clip), d (seconds) }.
     A take does not change speed with the tempo.

   window.StudioVoice — studio.js, voices.js and link.js call in.
   ========================================================================== */
const StudioVoice = (() => {
  'use strict';

  const DB_NAME = 'evm_studio_audio_v1', STORE = 'clips';
  const PREFS_KEY = 'evm_studio_voice_v1';
  const DELAY_KEY = 'evm_studio_mic_delay_v1';
  const PEAKS = 200;          // waveform peaks a second, for drawing

  const el = id => document.getElementById(id);
  const loadJSON = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const saveJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

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

  const cache = new Map();    // id -> { rate, data: Float32Array, peaks: Float32Array }
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

  async function saveClip(id, rate, data) {
    cache.set(id, { rate, data, peaks: peaksOf(data, rate) });
    missing.delete(id);
    await tx('readwrite', st => st.put({ rate, pcm: toI16(data).buffer, at: Date.now() }, id));
  }
  // Bring takes into memory. Resolves true when every one is there.
  async function load(ids) {
    const want = [...new Set(ids)].filter(id => !cache.has(id) && !missing.has(id));
    for (const id of want) {
      let rec = null;
      try { rec = await tx('readonly', st => st.get(id)); } catch (e) {}
      if (rec && rec.pcm) {
        const data = toF32(new Int16Array(rec.pcm));
        cache.set(id, { rate: rec.rate, data, peaks: peaksOf(data, rec.rate) });
      } else missing.add(id);
    }
    return ids.every(id => cache.has(id));
  }
  const clip = id => cache.get(id) || null;
  const isMissing = id => missing.has(id);
  async function keys() { try { return (await tx('readonly', st => st.getAllKeys())) || []; } catch (e) { return []; } }
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
      if (c) out[id] = { rate: c.rate, pcm16: toBase64(new Uint8Array(toI16(c.data).buffer)) };
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
        await saveClip(id, c.rate, data);
        n++;
      } catch (e) { console.error(e); }
    }
    return n;
  }

  // -------- THE MICROPHONE --------
  let prefs = { deviceId: '', gain: 1, echo: false };
  (() => {
    const p = loadJSON(PREFS_KEY);
    if (!p || typeof p !== 'object') return;
    if (typeof p.deviceId === 'string') prefs.deviceId = p.deviceId;
    if (Number.isFinite(p.gain)) prefs.gain = Math.min(3, Math.max(0, p.gain));
    prefs.echo = p.echo === true;
  })();
  const savePrefs = () => saveJSON(PREFS_KEY, prefs);

  let mic = null;             // { stream, track, source, gain, tap, sink }
  let opening = null;         // the promise of a microphone being opened
  let workletOn = false;
  let shownNow = false;
  let problem = '';           // why there is no microphone, in words
  let meterPeak = 0, meterHold = 0, meterHoldAt = 0, clipAt = 0;
  let cap = null;             // the capture under way, if any

  const constraints = () => ({
    deviceId: prefs.deviceId ? { exact: prefs.deviceId } : undefined,
    echoCancellation: prefs.echo, noiseSuppression: prefs.echo, autoGainControl: false,
    channelCount: { ideal: 1 }
  });

  function ensureMic() {
    if (mic) return Promise.resolve(true);
    if (opening) return opening;
    opening = openMic().finally(() => { opening = null; });
    return opening;
  }
  async function openMic() {
    problem = '';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      problem = 'This browser cannot record from a microphone on this page.';
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
      stream = await navigator.mediaDevices.getUserMedia({ audio: constraints() });
    } catch (e) {
      if (e && e.name === 'OverconstrainedError' && prefs.deviceId) {   // the chosen microphone is gone
        prefs.deviceId = '';
        savePrefs();
        return openMic();
      }
      problem = e && e.name === 'NotAllowedError'
        ? 'The microphone was not allowed. Allow it for this site (the icon in the address bar), then turn it on again.'
        : e && e.name === 'NotFoundError'
          ? 'No microphone was found. Plug one in, then turn it on again.'
          : 'The microphone did not start. Check no other app is using it, then try again.';
      render();
      return false;
    }
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) {} }
    const source = ctx.createMediaStreamSource(stream);
    const gain = ctx.createGain();
    gain.gain.value = prefs.gain;
    const tap = new AudioWorkletNode(ctx, 'voice-tap', { numberOfInputs: 1, numberOfOutputs: 1, channelCount: 1, channelCountMode: 'explicit', channelInterpretation: 'speakers' });
    const sink = ctx.createGain();
    sink.gain.value = 0;      // the tap has to be pulled by the graph to run; nothing is heard
    source.connect(gain);
    gain.connect(tap);
    tap.connect(sink);
    sink.connect(ctx.destination);
    tap.port.onmessage = e => onChunk(e.data);
    const track = stream.getAudioTracks()[0];
    mic = { stream, track, source, gain, tap, sink, ctx };
    if (track) track.addEventListener('ended', () => { closeMic(); problem = 'The microphone was disconnected.'; render(); });
    listDevices();
    render();
    meterLoop();
    return true;
  }
  function closeMic() {
    if (!mic) return;
    if (cap) finish(cap);
    try { mic.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    try { mic.source.disconnect(); mic.gain.disconnect(); mic.tap.disconnect(); mic.sink.disconnect(); } catch (e) {}
    mic.tap.port.onmessage = null;
    mic = null;
    meterPeak = meterHold = 0;
    render();
  }
  async function listDevices() {
    const sel = el('vp-device');
    if (!sel || !navigator.mediaDevices.enumerateDevices) return;
    let devs = [];
    try { devs = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput'); } catch (e) {}
    const current = mic && mic.track && mic.track.getSettings ? mic.track.getSettings().deviceId : prefs.deviceId;
    sel.innerHTML = devs.map((d, i) => `<option value="${d.deviceId.replace(/"/g, '&quot;')}">${(d.label || 'Microphone ' + (i + 1)).replace(/</g, '&lt;')}</option>`).join('');
    if (current && devs.some(d => d.deviceId === current)) sel.value = current;
    sel.disabled = devs.length < 2 || !!cap;
  }

  // -------- CAPTURE --------
  /* From now (audio clock) until endCapture(c, at): every sample, placed by
     its frame. c.peaks grows as it goes, for the lane to draw the take live. */
  function startCapture() {
    const ctx = Audio.ensure();
    cap = { from: ctx.currentTime, rate: ctx.sampleRate, chunks: [], t0: null, end: 0, stopAt: Infinity,
            peaks: [], acc: 0, accN: 0, win: Math.max(1, Math.round(ctx.sampleRate / PEAKS)), done: null, finished: false };
    if (el('vp-device')) el('vp-device').disabled = true;
    return cap;
  }
  function onChunk(m) {
    const p = m.peak || 0;
    if (p > meterPeak) meterPeak = p;
    if (p > 0.98) clipAt = performance.now();
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
    for (let i = 0; i < data.length; i++) {
      const a = data[i] < 0 ? -data[i] : data[i];
      if (a > c.acc) c.acc = a;
      if (++c.accN >= c.win) { c.peaks.push(c.acc); c.acc = 0; c.accN = 0; }
    }
    if (last) finish(c);
  }
  // Resolves { t0, rate, data, peak } once the last samples before `at` are in.
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
      result = { t0: c.t0, rate: c.rate, data, peak };
    }
    c.result = result;
    if (c.done) c.done(result);
  }

  /* A take begins where Play began — unless it was sung into during the
     count-in (a pick-up), as a key played in the count-in is. The count-in's
     sound has to be loud beside the take's own, so speaker bleed of the
     clicks is not mistaken for singing. Returns that onset (audio time) or null. */
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
    if (countMax < Math.max(0.05, 0.4 * mainMax)) return null;
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

  /* Six beeps out of the speakers, listened for by the microphone: the time
     from each beep to where it is heard is the round trip a voice take is
     moved back by. Needs speakers (headphones cannot be heard) and the
     echo filter off (it would filter the beeps out). */
  async function lineUp() {
    const msg = el('vp-cal-msg');
    const say = t => { if (msg) msg.textContent = t; };
    if (window.Studio && Studio.busy()) Studio.stop();
    if (!await ensureMic()) return;
    if (prefs.echo) { say('Turn off “Filter out the speakers” first — it would filter out the test beeps too.'); return; }
    const ctx = Audio.ensure();
    say('Listen: six beeps. Keep the room quiet…');
    const btn = el('vp-cal');
    if (btn) btn.disabled = true;
    const c = startCapture();
    const N = 6, GAP = 0.5;
    const t0 = ctx.currentTime + 0.6;
    const beeps = [];
    for (let i = 0; i < N; i++) {
      const t = t0 + i * GAP;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 1000;
      g.gain.setValueAtTime(0.6, t);
      g.gain.setValueAtTime(0.6, t + 0.04);
      g.gain.linearRampToValueAtTime(0, t + 0.05);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.06);
      beeps.push(t);
    }
    await sleep((0.6 + N * GAP + 0.4) * 1000);
    const res = await endCapture(c, ctx.currentTime);
    if (btn) btn.disabled = false;
    if (!res) { say('Nothing came from the microphone. Check it is plugged in, then try again.'); return; }
    const at = t => Math.round((t - res.t0) * res.rate);
    let noise = 0;
    for (let i = 0; i < Math.max(0, at(t0 - 0.05)); i++) noise = Math.max(noise, Math.abs(res.data[i]));
    const thr = Math.max(0.015, noise * 3);
    const offs = [];
    beeps.forEach(t => {
      const from = Math.max(0, at(t)), to = Math.min(res.data.length, at(t + 0.4));
      for (let i = from; i < to; i++) if (Math.abs(res.data[i]) > thr) { offs.push(res.t0 + i / res.rate - t); break; }
    });
    if (offs.length < 4) {
      say(`The microphone heard ${offs.length ? 'only ' + offs.length + ' of the beeps' : 'none of the beeps'}. Turn the speakers up (this test cannot hear headphones), then try again — or keep the estimate.`);
      return;
    }
    offs.sort((a, b) => a - b);
    const mid = offs[offs.length >> 1];
    if (offs[offs.length - 1] - offs[0] > 0.012) { say('The beeps came back unevenly — a noisy room? Try again in a quiet moment.'); return; }
    const ms = Math.round(mid * 1000);
    saveJSON(DELAY_KEY, { ms, how: 'test' });
    say(`Measured: your speakers and microphone take ${ms} ms there and back. Voice takes will be moved ${ms} ms earlier.`);
    render();
  }

  // -------- THE PANEL --------
  const MIC_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
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
          <p class="panel-note" id="vp-problem">The browser asks first. Recordings stay in this browser — nothing is sent anywhere.</p>
        </div>
        <div class="vp-on-ui">
          <div class="vp-meter-row">
            <div class="vp-meter" aria-hidden="true"><div class="vp-fill" id="vp-fill"></div><div class="vp-hold" id="vp-hold"></div></div>
            <span class="vp-level" id="vp-level">Quiet</span>
          </div>
          <div class="vp-grid">
            <label class="vp-field"><span>Microphone</span><select class="select" id="vp-device" aria-label="Microphone"></select></label>
            <label class="vp-field"><span>Input level</span><span class="vp-range"><input type="range" id="vp-gain" min="0" max="300" step="5"><output id="vp-gain-out">100%</output></span></label>
          </div>
          <label class="check"><input type="checkbox" id="vp-echo"><span>Filter out the speakers (echo cancellation) — only without headphones</span></label>
          <p class="vp-tip">Headphones give the cleanest take: through speakers, the other tracks are recorded too. You will not hear yourself while recording.</p>
          <div class="vp-timing"><span id="vp-delay"></span> <button class="link-btn" id="vp-cal" type="button">Line up the microphone</button></div>
          <p class="panel-note vp-cal-msg" id="vp-cal-msg" role="status"></p>
          <div class="row-wrap"><button class="btn btn-sm btn-quiet" id="vp-off" type="button">Turn the microphone off</button></div>
        </div>
      </div>`;
    el('vp-on').addEventListener('click', () => ensureMic());
    el('vp-off').addEventListener('click', () => { if (!cap) closeMic(); });
    el('vp-device').addEventListener('change', async (e) => {
      prefs.deviceId = e.target.value;
      savePrefs();
      if (mic && !cap) { closeMic(); await ensureMic(); }
    });
    el('vp-gain').addEventListener('input', (e) => {
      prefs.gain = e.target.value / 100;
      el('vp-gain-out').textContent = e.target.value + '%';
      if (mic) mic.gain.gain.setTargetAtTime(prefs.gain, mic.ctx.currentTime, 0.02);
      savePrefs();
    });
    el('vp-echo').addEventListener('change', async (e) => {
      prefs.echo = e.target.checked;
      savePrefs();
      if (mic && !cap) { closeMic(); await ensureMic(); }
    });
    el('vp-cal').addEventListener('click', lineUp);
  }
  function render() {
    const p = el('voice-panel');
    if (!p) return;
    build();
    p.classList.toggle('mic-on', !!mic);
    const prob = el('vp-problem');
    if (prob) {
      prob.textContent = problem || 'The browser asks first. Recordings stay in this browser — nothing is sent anywhere.';
      prob.classList.toggle('vp-warn', !!problem);
    }
    el('vp-gain').value = Math.round(prefs.gain * 100);
    el('vp-gain-out').textContent = Math.round(prefs.gain * 100) + '%';
    el('vp-echo').checked = prefs.echo;
    const d = stored();
    el('vp-delay').textContent = d
      ? `Voice timing: ${d.ms} ms (measured).`
      : `Voice timing: about ${Math.round(estimate() * 1000)} ms (the browser’s estimate).`;
  }
  // The meter: peak in dB, a hold line, and words for it.
  let metering = false;
  function meterLoop() {
    if (metering) return;
    metering = true;
    meterTick();
  }
  function meterTick() {
    if (!mic || !shownNow) { metering = false; return; }
    const fill = el('vp-fill'), hold = el('vp-hold'), word = el('vp-level');
    const now = performance.now();
    const db = meterPeak > 0 ? 20 * Math.log10(meterPeak) : -90;
    const pct = Math.max(0, Math.min(100, (db + 60) / 60 * 100));
    if (pct >= meterHold || now - meterHoldAt > 1200) { meterHold = pct; meterHoldAt = now; }
    if (fill) { fill.style.width = pct + '%'; fill.dataset.zone = db > -3 ? 'red' : db > -12 ? 'yellow' : 'green'; }
    if (hold) hold.style.left = meterHold + '%';
    if (word) word.textContent = now - clipAt < 1500 ? 'Too loud — turn the input down' : db > -40 ? 'Good' : db > -55 ? 'Quiet' : 'Silent';
    if (word) word.classList.toggle('vp-warn', now - clipAt < 1500);
    meterPeak *= 0.6;
    requestAnimationFrame(meterTick);
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

  return {
    ensureMic, closeMic, shown, render,
    get on() { return !!mic; },
    startCapture, endCapture, pickupOnset, delaySec,
    saveClip, load, clip, isMissing, keys, forget, bufferFor, exportClips, importClips, peaksPerSec: PEAKS
  };
})();

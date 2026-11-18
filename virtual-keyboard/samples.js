/* ==========================================================================
   Virtual Keyboard 2.0 — samples.js
   The recorded instruments. Their notes are small MP3s in samples/<id>/,
   made by _build/build-samples.mjs from two free sample libraries (both
   CC0, no permission or credit needed — credited anyway in samples/CREDITS.txt):
     VCSL       — Versilian Community Sample Library
     VSCO 2 CE  — Versilian Studios Chamber Orchestra 2, Community Edition
   samples/manifest.js lists every note (window.VK_SAMPLE_MANIFEST).

   Each instrument becomes one more preset in the Audio engine (audio.js,
   kind 'sample'). Nothing is downloaded until an instrument is picked:
   want(id) starts it, ready(ids) waits for it. Until its notes are in, the
   instrument's stand-in synth sound plays, so a key is never silent.
   ========================================================================== */
const Samples = (() => {
  /* Inside the Recording Studio (?embed=studio) the keyboard keeps to its
     synth sounds, as before 2.0 replaced 1.0 (2026-11-17): the studio plays its
     tracks back on its own sound engine, which has no recorded instruments, so
     a Violins take would come back as Piano. With no instruments listed here,
     none reach the sound menu, and a saved recorded sound falls back to Piano. */
  const inStudio = (() => {
    try {
      return new URLSearchParams(location.search).get('embed') === 'studio'
        && window.parent !== window && !!window.parent.EVMStudio;
    } catch (e) { return false; }
  })();
  const MANIFEST = inStudio ? { instruments: {} } : (window.VK_SAMPLE_MANIFEST || { instruments: {} });
  const BASE = 'samples/';

  /* How each one plays: release = seconds to fade once the key is let go
     (short for dampers and wind, long for things that ring); gain = how loud,
     MEASURED (2026-11-16): each one rendered offline over three notes of its
     range sits 2 dB under the old synth Piano (where Electric piano and Bell
     sit), unless its loudest note would then peak over 0.85 at full volume —
     piano, harpsichord and xylophone are held back by that. Rebuilding the
     samples changes their levels: measure again. fallback = the synth sound
     that stands in while the notes load; tune = correct the measured tuning. */
  const FEEL = {
    'grand-piano':     { gain: 1.96, release: 0.35, fallback: 'piano' },
    'harpsichord':     { gain: 1.69, release: 0.25, fallback: 'pluck' },
    'pipe-organ':      { gain: 0.66, release: 0.18, fallback: 'organ' },
    'concert-harp':    { gain: 1.56, release: 1.4,  fallback: 'pluck', tune: true },     // recorded ~10¢ flat
    'vibraphone':      { gain: 0.80, release: 1.6,  fallback: 'bell' },
    'concert-marimba': { gain: 1.32, release: 0.8,  fallback: 'marimba' },
    'xylophone':       { gain: 2.74, release: 0.6,  fallback: 'marimba', tune: true },   // recorded ~15¢ sharp
    'violins':         { gain: 1.24, release: 0.4,  fallback: 'strings', attack: 0.02 },
    'flute':           { gain: 1.72, release: 0.22, fallback: 'voice', attack: 0.015 },
    'trumpet':         { gain: 1.03, release: 0.22, fallback: 'sawtooth', attack: 0.01 },
  };

  const ids = Object.keys(MANIFEST.instruments);
  ids.forEach(id => {
    const inst = MANIFEST.instruments[id], f = FEEL[id] || {};
    Audio.PRESETS[id] = {
      name: inst.name, kind: 'sample', sampled: true,
      attack: f.attack || 0.003, release: f.release || 0.3, gain: f.gain || 1,
      fallback: f.fallback || 'piano', rev: 0.3
    };
    if (!Audio.PRESET_ORDER.includes(id)) Audio.PRESET_ORDER.push(id);
  });

  const state = {};          // id -> { promise, got, total, failed }
  const listeners = new Set();
  const tell = (id) => listeners.forEach(fn => { try { fn(id, status(id)); } catch (e) {} });

  let decoder = null;        // decodes on its own small context: no need to wake the sound first
  function decode(bytes) {
    if (!decoder) {
      const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      decoder = new OAC(1, 1, 44100);
    }
    return new Promise((res, rej) => {
      const p = decoder.decodeAudioData(bytes, res, rej);
      if (p && p.then) p.then(res, rej);
    });
  }

  /* Where the sound really starts. An MP3 begins with a little silence of
     its own (the encoder's), which differs between browsers; the build
     wrote down when each note first reaches 10% of its peak (t10), so the
     difference is that silence. It is the same for every file in a browser
     (Chrome: 25 ms), so each instrument takes the middle of its notes'
     figures — one odd reading cannot move a note. Loop points move with it. */
  function leadOf(buffer, t10) {
    const d = buffer.getChannelData(0);
    let peak = 0;
    for (let i = 0; i < d.length; i++) { const v = Math.abs(d[i]); if (v > peak) peak = v; }
    let i = 0;
    while (i < d.length && Math.abs(d[i]) < peak * 0.1) i++;
    return i / buffer.sampleRate - (t10 || 0);
  }
  function settle(id, zones) {
    const leads = zones.map(z => z.lead).sort((a, b) => a - b);
    const start = Math.max(0, Math.min(0.12, leads[Math.floor(leads.length / 2)] || 0));
    return zones.map(({ raw, lead, ...zone }) => {
      zone.start = start;
      if (raw.le > raw.ls) { zone.ls = start + raw.ls; zone.le = start + raw.le; }
      if (FEEL[id] && FEEL[id].tune && raw.c) zone.tune = raw.c;
      return zone;
    });
  }

  async function loadZone(id, z) {
    const r = await fetch(BASE + id + '/' + z.f);
    if (!r.ok) throw new Error(z.f + ': ' + r.status);
    const buffer = await decode(await r.arrayBuffer());
    return { m: z.m, buffer, lead: leadOf(buffer, z.t10), raw: z };
  }

  function load(id) {
    const inst = MANIFEST.instruments[id];
    const s = state[id] = { got: 0, total: inst.zones.length, failed: false, done: false };
    const queue = inst.zones.slice(), zones = [];
    const worker = async () => {
      while (queue.length) {
        const z = queue.shift();
        zones.push(await loadZone(id, z));
        s.got++;
        tell(id);
      }
    };
    s.promise = Promise.all([0, 1, 2, 3, 4, 5].map(worker))
      .then(() => { Audio.setSamples(id, settle(id, zones)); s.done = true; tell(id); })
      .catch(e => {
        console.warn('Recorded instrument did not load:', id, e);
        s.failed = true; s.done = true;
        delete state[id].promise;
        tell(id);
      });
    tell(id);
    return s.promise;
  }

  const isSampled = (id) => !!MANIFEST.instruments[id];

  // Start loading `id` if it is a recorded instrument not yet loaded (or one that failed before).
  function want(id) {
    if (!isSampled(id) || Audio.hasSamples(id)) return;
    const s = state[id];
    if (s && s.promise && !s.failed) return;
    load(id);
  }

  // Resolves once every recorded instrument in `list` has loaded (or given up).
  function ready(list) {
    const need = [...new Set([].concat(list || []))].filter(id => isSampled(id) && !Audio.hasSamples(id));
    need.forEach(want);
    return Promise.all(need.map(id => state[id] && state[id].promise ? state[id].promise : null)).then(() => {});
  }

  // 'none' (not a recorded instrument) · 'idle' · 'loading' · 'ready' · 'failed', with how far along
  function status(id) {
    if (!isSampled(id)) return { state: 'none' };
    if (Audio.hasSamples(id)) return { state: 'ready' };
    const s = state[id];
    if (!s) return { state: 'idle' };
    if (s.failed) return { state: 'failed' };
    return { state: 'loading', got: s.got, total: s.total };
  }

  return { ids, isSampled, want, ready, status, onChange: (fn) => listeners.add(fn), manifest: MANIFEST };
})();

// script.js, recorder.js and lesson.js look for it on window (a top-level const is not there by itself)
window.Samples = Samples;

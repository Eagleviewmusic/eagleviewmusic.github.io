/* ==========================================================================
   Melody Reader — sound.js
   --------------------------------------------------------------------------
   RR.Sound — Rainbow Xylophone's utils/audio.ts in plain JS (ENGINE §7):

     vibraphone  a sine with a ~2.8 s bell envelope, and a 45 ms triangle
                 tap an octave up (the mallet)
     marimba     a sine with a ~0.5 s wooden envelope, a ×4 overtone of
                 75 ms, and a 25 ms pitch-swept thud

   through a compressor (−12 dB, 12:1) and a master gain of 0.28 × volume.
   Striking a bar that is still ringing stops its last voice first, with a
   12 ms fade — the original's rule, so a fast repeated note never piles up.

   Time. Everything that is scheduled — Play's notes, the count-in, the
   beat — goes on the audio clock. Two more clocks matter for With the
   beat, and both are read through getOutputTimestamp():
     heardNow()       the audio time being heard right now
     eventTime(e)     the audio time that was being heard when an input
                      event happened — a child plays to what they hear, so
                      this is what a strike is judged by
     heardAt(t)       when audio time t will be heard, in performance.now()
                      terms — for anything drawn
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  let ctx = null, master = null;
  let voiceName = RR.device.voice === 'marimba' ? 'marimba' : 'vibraphone';
  let volume = typeof RR.device.volume === 'number' ? Math.max(0, Math.min(1, RR.device.volume)) : 0.8;
  const live = new Map();       // bar id → its ringing voice
  const played = new Set();     // voices scheduled by Play, so Stop can silence them

  function init() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC({ latencyHint: 'interactive' });
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12; comp.ratio.value = 12;
      comp.connect(ctx.destination);
      master = ctx.createGain(); master.gain.value = 0.28 * volume;
      master.connect(comp);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function osc(v, type, f, t, stop) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    o.start(t); o.stop(stop); v.oscs.push(o); return o;
  }
  function env(v, t, pts) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    pts.forEach(p => g.gain.exponentialRampToValueAtTime(Math.max(0.0001, p[0]), t + p[1]));
    g.connect(master); v.gains.push(g); return g;
  }
  function make(f, t, l, kind) {
    const v = { oscs: [], gains: [], end: 0 };
    if ((kind || voiceName) === 'marimba') {
      osc(v, 'sine', f, t, t + 0.52).connect(env(v, t, [[l, 0.003], [0.28 * l, 0.06], [0.08 * l, 0.16], [0.015 * l, 0.32], [0.0001, 0.48]]));
      osc(v, 'triangle', f * 4, t, t + 0.08).connect(env(v, t, [[0.18 * l, 0.003], [0.0001, 0.075]]));
      const th = osc(v, 'triangle', f * 3.2, t, t + 0.03);
      th.frequency.exponentialRampToValueAtTime(Math.max(f * 0.8, 80), t + 0.022);
      th.connect(env(v, t, [[0.3 * l, 0.002], [0.0001, 0.025]]));
      v.end = t + 0.55;
    } else {
      osc(v, 'sine', f, t, t + 2.9).connect(env(v, t, [[l, 0.006], [0.5 * l, 0.35], [0.18 * l, 0.95], [0.04 * l, 1.8], [0.0001, 2.8]]));
      osc(v, 'triangle', f * 2, t, t + 0.05).connect(env(v, t, [[0.05 * l, 0.006], [0.0001, 0.045]]));
      v.end = t + 2.95;
    }
    setTimeout(() => { v.gains.forEach(g => { try { g.disconnect(); } catch (_) { /* gone */ } }); played.delete(v); }, (v.end - ctx.currentTime) * 1000 + 100);
    return v;
  }
  function silence(v) {
    const t = ctx.currentTime;
    v.gains.forEach(g => {
      try {
        if (g.gain.cancelAndHoldAtTime) g.gain.cancelAndHoldAtTime(t);
        else { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); }
        g.gain.setTargetAtTime(0, t, 0.004);
      } catch (_) { /* already finished */ }
    });
    v.oscs.forEach(o => { try { o.stop(t + 0.02); } catch (_) { /* already stopped */ } });
  }

  function outTs() {
    if (!ctx || !ctx.getOutputTimestamp) return null;
    const ts = ctx.getOutputTimestamp();
    return ts && ts.performanceTime > 0 ? ts : null;
  }
  const latency = () => ctx ? (ctx.outputLatency || ctx.baseLatency || 0) : 0;
  /* the audio time heard at performance time p — the output timestamp when
     it is trustworthy, else the clock less the output latency */
  function heardAtPerf(p) {
    if (!init()) return 0;
    const fallback = ctx.currentTime - latency() + (p - performance.now()) / 1000;
    const ts = outTs();
    if (!ts) return fallback;
    const v = ts.contextTime + (p - ts.performanceTime) / 1000;
    return Math.abs(v - fallback) < 0.5 ? v : fallback;
  }

  RR.Sound = {
    init,
    get ctx() { return init(); },
    now() { return init() ? ctx.currentTime : 0; },
    heardNow() { return heardAtPerf(performance.now()); },
    eventTime(e) { return heardAtPerf(e && e.timeStamp > 0 ? e.timeStamp : performance.now()); },
    heardAt(t) {
      if (!init()) return performance.now();
      const ts = outTs();
      if (ts) return ts.performanceTime + (t - ts.contextTime) * 1000;
      return performance.now() + (t - ctx.currentTime + latency()) * 1000;
    },

    /* a bar struck now (a finger, a key) */
    strike(id, level) {
      if (!init()) return;
      const b = RR.BAR[id]; if (!b) return;
      const old = live.get(id); if (old) silence(old);
      live.set(id, make(b.freq, ctx.currentTime + 0.003, level || 1));
    },
    /* a bar played by the app at audio time t (Play, Hear your song) */
    playAt(id, t, level, kind) {
      if (!init()) return;
      const b = RR.BAR[id]; if (!b) return;
      played.add(make(b.freq, Math.max(ctx.currentTime + 0.003, t), level || 1, kind));
    },
    stopPlayed() { if (ctx) { played.forEach(silence); played.clear(); } },
    /* the beat: a short blip, higher on the first beat of the bar */
    click(t, accent, soft) {
      if (!init()) return;
      const v = { oscs: [], gains: [] };
      const l = (accent ? 0.55 : 0.32) * (soft ? 0.45 : 1);
      osc(v, 'triangle', accent ? 1760 : 1320, t, t + 0.06).connect(env(v, t, [[l, 0.002], [0.0001, 0.05]]));
    },
    /* a melody finished: C E G on the marimba, an octave up for three stars */
    celebrate(stars) {
      if (!init()) return;
      const t = ctx.currentTime + 0.05;
      ['C5', 'E5', 'G5'].forEach((id, i) => {
        const v = make(RR.BAR[id].freq * (stars === 3 ? 2 : 1), t + i * 0.07, 0.3, 'marimba');
        played.add(v);
      });
    },
    /* resume, wait for it, and wake a sleeping Bluetooth or projector speaker */
    async prime(warm) {
      if (!init()) return false;
      if (window.EVMCountIn) return EVMCountIn.prime(ctx, { warm: warm == null ? 0.3 : warm });
      try { await ctx.resume(); } catch (_) { /* checked below */ }
      return ctx.state === 'running';
    },
    get voice() { return voiceName; },
    set voice(v) { voiceName = v === 'marimba' ? 'marimba' : 'vibraphone'; RR.device.voice = voiceName; RR.saveDevice(); },
    get volume() { return volume; },
    set volume(v) { volume = Math.max(0, Math.min(1, +v || 0)); if (master) master.gain.value = 0.28 * volume; RR.device.volume = volume; RR.saveDevice(); }
  };
})();

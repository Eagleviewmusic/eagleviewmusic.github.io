/* ==========================================================================
   Key Blocks — audio.js
   A small polyphonic synth with a handful of designed voices, one shared
   master chain (mix → high-pass → compressor → master) and a synthesized
   reverb. Each side of the instrument has its own voice and level.

   Two ways to sound a note: play()/stop() for a key held down now, and
   schedule() for a note laid down ahead of time on the audio clock with
   its own length (a player that schedules a whole song — Song Writer).
   ========================================================================== */
const Audio = (() => {
  let ctx = null;
  let master, mixBus, hp, comp, reverb, reverbGain, dryGain;
  const sides = {};           // side -> { gain }
  const voices = new Map();   // voiceId -> { nodes, stop }
  const timed = new Map();    // voiceId -> { notes, end } — schedule()'s, outside MAX_VOICES
  let voiceSeq = 0;
  const MAX_VOICES = 24;

  const PRESETS = {
    piano:   { name: 'Piano',        kind: 'sub',  waves: ['triangle', 'sine'], mix: [0.7, 0.5], detune: 0,  attack: 0.005, decay: 0.9, sustain: 0.25, release: 0.35, cutoff: 5200, cutoffEnv: 2800, q: 0.6, gain: 0.55, rev: 0.25 },
    epiano:  { name: 'Electric piano', kind: 'fm', ratio: 14, index: 0.6,  attack: 0.004, decay: 1.4, sustain: 0.15, release: 0.5,  cutoff: 6000, cutoffEnv: 0, q: 0.5, gain: 0.5, rev: 0.3 },
    bell:    { name: 'Bell',         kind: 'fm',   ratio: 3.5, index: 1.4,  attack: 0.003, decay: 2.2, sustain: 0.0,  release: 1.2,  cutoff: 9000, cutoffEnv: 0, q: 0.5, gain: 0.4, rev: 0.45 },
    pluck:   { name: 'Pluck',        kind: 'sub',  waves: ['sawtooth', 'square'], mix: [0.6, 0.25], detune: 4, attack: 0.002, decay: 0.45, sustain: 0.0, release: 0.25, cutoff: 900, cutoffEnv: 5200, q: 1.4, gain: 0.45, rev: 0.25 },
    marimba: { name: 'Marimba',      kind: 'sub',  waves: ['sine', 'triangle'], mix: [0.9, 0.2], detune: 0, attack: 0.002, decay: 0.55, sustain: 0.0, release: 0.3, cutoff: 3000, cutoffEnv: 3000, q: 0.7, gain: 0.6, rev: 0.3 },
    organ:   { name: 'Organ',        kind: 'organ', attack: 0.01, decay: 0.05, sustain: 1.0, release: 0.12, cutoff: 7000, cutoffEnv: 0, q: 0.4, gain: 0.32, rev: 0.28 },
    pad:     { name: 'Warm pad',     kind: 'sub',  waves: ['sawtooth', 'sawtooth'], mix: [0.5, 0.5], detune: 9, attack: 0.28, decay: 0.6, sustain: 0.8, release: 0.9, cutoff: 1400, cutoffEnv: 900, q: 0.8, gain: 0.34, rev: 0.5 },
    strings: { name: 'Strings',      kind: 'sub',  waves: ['sawtooth', 'triangle'], mix: [0.6, 0.4], detune: 6, attack: 0.18, decay: 0.3, sustain: 0.9, release: 0.6, cutoff: 2600, cutoffEnv: 600, q: 0.6, gain: 0.36, rev: 0.45 },
    voice:   { name: 'Voice',        kind: 'voice', attack: 0.06, decay: 0.15, sustain: 0.75, release: 0.35, cutoff: 3200, cutoffEnv: 0, q: 0.9, gain: 0.5, rev: 0.35, vibrato: true },
    sine:    { name: 'Sine',         kind: 'sub',  waves: ['sine'], mix: [1], detune: 0, attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.3, cutoff: 8000, cutoffEnv: 0, q: 0.5, gain: 0.5, rev: 0.2 },
    triangle:{ name: 'Triangle',     kind: 'sub',  waves: ['triangle'], mix: [1], detune: 0, attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.3, cutoff: 8000, cutoffEnv: 0, q: 0.5, gain: 0.5, rev: 0.2 },
    square:  { name: 'Square',       kind: 'sub',  waves: ['square'], mix: [1], detune: 0, attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.3, cutoff: 3500, cutoffEnv: 0, q: 0.5, gain: 0.3, rev: 0.2 },
    sawtooth:{ name: 'Sawtooth',     kind: 'sub',  waves: ['sawtooth'], mix: [1], detune: 0, attack: 0.02, decay: 0.1, sustain: 0.7, release: 0.3, cutoff: 3200, cutoffEnv: 0, q: 0.5, gain: 0.3, rev: 0.2 }
  };
  const PRESET_ORDER = ['piano', 'epiano', 'pluck', 'marimba', 'bell', 'organ', 'pad', 'strings', 'voice', 'sine', 'triangle', 'square', 'sawtooth'];

  let voiceWave = null;
  let organWave = null;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC({ latencyHint: 'interactive' });

    mixBus = ctx.createGain(); mixBus.gain.value = 0.9;
    hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 60; hp.Q.value = 0.7;
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 24; comp.ratio.value = 4; comp.attack.value = 0.006; comp.release.value = 0.22;
    master = ctx.createGain(); master.gain.value = 0.9;

    dryGain = ctx.createGain(); dryGain.gain.value = 1;
    reverb = ctx.createConvolver(); reverb.buffer = makeImpulse(1.9, 2.6);
    reverbGain = ctx.createGain(); reverbGain.gain.value = 0.32;

    mixBus.connect(dryGain); dryGain.connect(hp);
    mixBus.connect(reverb); reverb.connect(reverbGain); reverbGain.connect(hp);
    hp.connect(comp); comp.connect(master); master.connect(ctx.destination);

    // custom 'voice' wave (from the towers) and an organ drawbar wave
    const n = 20, real = new Float32Array(n), imag = new Float32Array(n);
    real[1] = 1; real[2] = 0.15; real[3] = 0.1; real[4] = 0.05;
    voiceWave = ctx.createPeriodicWave(real, imag);
    const or = new Float32Array(16), oi = new Float32Array(16);
    or[1] = 1; or[2] = 0.6; or[3] = 0.35; or[4] = 0.4; or[6] = 0.2; or[8] = 0.15;
    organWave = ctx.createPeriodicWave(or, oi);
    return ctx;
  }

  function makeImpulse(seconds, decay) {
    const rate = ctx.sampleRate, len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay) * (i < 400 ? i / 400 : 1);
      }
    }
    return buf;
  }

  function sideGain(side) {
    ensure();
    if (!sides[side]) {
      const g = ctx.createGain(); g.gain.value = 0.8; g.connect(mixBus);
      sides[side] = { gain: g, level: 0.8 };
    }
    return sides[side].gain;
  }
  function setLevel(side, v) { sideGain(side); sides[side].level = v; sides[side].gain.gain.setTargetAtTime(v, ctx.currentTime, 0.02); }
  function setReverb(v) { ensure(); reverbGain.gain.setTargetAtTime(v * 0.7, ctx.currentTime, 0.05); }

  /* Build one note of a voice. Returns { stop(when) } */
  function buildNote(freq, preset, out, when, velocity) {
    const P = PRESETS[preset] || PRESETS.piano;
    const now = when;
    const env = ctx.createGain(); env.gain.value = 0;
    const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.Q.value = P.q;
    const oscs = [], extras = [];
    const peak = P.gain * velocity;

    if (P.kind === 'sub') {
      P.waves.forEach((w, i) => {
        const o = ctx.createOscillator(); o.type = w; o.frequency.value = freq;
        if (P.detune) o.detune.value = (i % 2 ? -1 : 1) * P.detune;
        const g = ctx.createGain(); g.gain.value = P.mix[i];
        o.connect(g); g.connect(filt); oscs.push(o);
      });
    } else if (P.kind === 'fm') {
      const car = ctx.createOscillator(); car.type = 'sine'; car.frequency.value = freq;
      const mod = ctx.createOscillator(); mod.type = 'sine'; mod.frequency.value = freq * P.ratio;
      const mg = ctx.createGain(); mg.gain.setValueAtTime(freq * P.index, now);
      mg.gain.exponentialRampToValueAtTime(freq * P.index * 0.08 + 0.001, now + P.decay);
      mod.connect(mg); mg.connect(car.frequency);
      car.connect(filt); oscs.push(car, mod);
      if (preset === 'epiano') { // a soft octave-up sine for shimmer
        const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = freq * 2;
        const g2 = ctx.createGain(); g2.gain.value = 0.12; o2.connect(g2); g2.connect(filt); oscs.push(o2);
      }
    } else if (P.kind === 'organ') {
      const o = ctx.createOscillator(); o.setPeriodicWave(organWave); o.frequency.value = freq; o.connect(filt); oscs.push(o);
      const trem = ctx.createOscillator(); trem.frequency.value = 5.5;
      const tg = ctx.createGain(); tg.gain.value = 0.06;
      trem.connect(tg); tg.connect(env.gain); extras.push(trem); oscs.push(trem);
    } else if (P.kind === 'voice') {
      const o = ctx.createOscillator(); o.setPeriodicWave(voiceWave); o.frequency.value = freq; o.connect(filt); oscs.push(o);
      const lfo = ctx.createOscillator(); lfo.frequency.setValueAtTime(1.5, now); lfo.frequency.linearRampToValueAtTime(5, now + 1);
      const lg = ctx.createGain(); lg.gain.value = freq * 0.006; lfo.connect(lg); lg.connect(o.frequency); oscs.push(lfo);
    }

    // filter envelope
    const fBase = Math.min(P.cutoff, 18000);
    filt.frequency.setValueAtTime(Math.min(fBase + P.cutoffEnv, 18000), now);
    if (P.cutoffEnv) filt.frequency.exponentialRampToValueAtTime(fBase, now + Math.max(0.05, P.decay));

    // amp envelope
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(peak, now + P.attack);
    const sus = Math.max(P.sustain * peak, 0.0001);
    env.gain.setTargetAtTime(sus, now + P.attack, P.decay / 3);

    filt.connect(env); env.connect(out);
    oscs.forEach(o => o.start(now));

    return {
      stop(t) {
        const rel = P.release;
        env.gain.cancelScheduledValues(t);
        env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), t);
        env.gain.exponentialRampToValueAtTime(0.0001, t + rel);
        oscs.forEach(o => { try { o.stop(t + rel + 0.05); } catch (e) {} });
        setTimeout(() => { try { env.disconnect(); filt.disconnect(); } catch (e) {} }, (rel + 0.2) * 1000);
      },
      // a release laid down ahead of time: it eases away from whatever the
      // envelope has reached by then (schedule, below)
      release(t) {
        const rel = P.release;
        env.gain.setTargetAtTime(0.0001, t, rel / 4);
        oscs.forEach(o => { try { o.stop(t + rel + 0.05); } catch (e) {} });
        oscs[0].onended = () => { try { env.disconnect(); filt.disconnect(); } catch (e) {} };
      }
    };
  }

  /* Play a set of frequencies as one voice (a note or a chord). */
  function play(side, freqs, preset) {
    ensure();
    const out = sideGain(side);
    const now = ctx.currentTime + 0.002;
    if (voices.size >= MAX_VOICES) {
      const oldest = voices.keys().next().value;
      stop(oldest);
    }
    const n = freqs.length;
    const velocity = n > 1 ? Math.min(1, 1.15 / Math.sqrt(n)) : 1;
    const notes = freqs.map((f, i) => buildNote(f, preset, out, now + (n > 1 ? i * 0.006 : 0), velocity));
    const id = ++voiceSeq;
    voices.set(id, notes);
    return id;
  }
  /* Lay a note (or chord) down on the clock: it starts at `when` (context
     time) and is let go `hold` seconds later; `level` scales it (1 = as
     play() would). Returns an id — stop(id) silences it early, whether or
     not it has started. A song lays many down at once, so these are kept
     apart from play()'s voices and never steal them. */
  function schedule(side, freqs, preset, when, hold, level) {
    ensure();
    const out = sideGain(side);
    const now = ctx.currentTime;
    timed.forEach((v, id) => { if (v.end < now) timed.delete(id); });
    const P = PRESETS[preset] || PRESETS.piano;
    const t0 = Math.max(when || 0, now + 0.002);
    const n = freqs.length;
    const velocity = (level === undefined ? 1 : level) * (n > 1 ? Math.min(1, 1.15 / Math.sqrt(n)) : 1);
    const notes = freqs.map((f, i) => buildNote(f, preset, out, t0 + (n > 1 ? i * 0.006 : 0), velocity));
    const off = t0 + Math.max(hold || 0, P.attack + 0.02);
    notes.forEach(nt => nt.release(off));
    const id = ++voiceSeq;
    timed.set(id, { notes, end: off + P.release + 0.1 });
    return id;
  }

  function stop(id) {
    const notes = voices.get(id) || (timed.get(id) || {}).notes;
    if (!notes) return;
    const t = ctx.currentTime;
    notes.forEach(nt => nt.stop(t));
    voices.delete(id);
    timed.delete(id);
  }
  function stopAll() { [...voices.keys(), ...timed.keys()].forEach(stop); }

  return { ensure, play, schedule, stop, stopAll, setLevel, setReverb, PRESETS, PRESET_ORDER };
})();

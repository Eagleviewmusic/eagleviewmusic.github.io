/*!
 * trumpet-synth.js — a Web Audio B♭ trumpet for the Virtual Trumpet
 *
 * The sound is built the way a brass instrument makes it:
 *   the lips open and close once per cycle and let a pulse of air through. Blown gently the pulse is round
 *   (nearly a sine); blown harder it gets sharper, so every higher overtone grows faster than the one below
 *   it. That "louder is brighter" is what makes brass sound like brass (Risset's trumpet study, and Beauchamp's
 *   nonlinear model: an oscillator, a waveshape that follows the dynamic, and the bell's high-pass).
 *   Here the pulse is the closed form of  cos φ + r·cos 2φ + r²·cos 3φ + …  where r = exp(-f / fb): the
 *   overtones fall away evenly with frequency and one number, fb, says how bright the note is. fb follows the
 *   breath, a moment late on the way up (a brass note opens up: "taah") and early on the way down.
 *   The bell then lets high sound out far more easily than low sound, which gives the trumpet its ring around
 *   1 to 1.5 kHz. A tongued start adds a small click of air and a slightly proud first moment.
 *
 * One note = one AudioWorklet voice (a phase counter, so every note is exactly in tune).
 * Same outward shape as the recorder / flute / clarinet synths:
 *
 *   const synth = await TrumpetSynth.create(audioCtx, { timbre: 'open' });
 *   synth.connect(audioCtx.destination);
 *   synth.noteOn(58);  synth.noteOff(58);      // SOUNDING pitch as a MIDI note (58 = concert B♭3 = written C4)
 *   synth.set('breath', 0.8);
 *
 * No dependencies. MIT licence.
 */
(function (global) {
  'use strict';

  const DEFAULTS = {
    timbre: 'open',      // 'open' | 'mellow' | 'bright' | 'mute'
    mono: true,          // one note at a time; a held note slurs into the next
    transpose: 0,
    volume: 0.8,
    breath: 0.7,         // 0..1 how hard it is blown: louder AND brighter
    attack: 0.025,       // tonguing, seconds: "tu" is short, "du" is long
    release: 0.07,
    tongue: 0.5,         // 0..1 the little click and push at the start of a tongued note
    noise: 0.3,          // 0..1 air you can hear in the tone
    vibrato: 0.12,       // 0..1
    vibratoRate: 5.4,    // per second
    vibratoDelay: 0.4,   // seconds before it fades in
    drift: 0.3,          // 0..1 slow, tiny wander in pitch and tone
    reverb: 0.22,
    glide: 0.03,         // slur time, seconds
  };

  // bright: scales how bright the lips' pulse is.  hp: where the bell stops holding low sound in (Hz).
  // eq: what the room hears on top of that.  gain: level trim.
  const TIMBRES = {
    open:   { label: 'Open',   bright: 1.0,  hp: 1150, gain: 1,
      eq: [{ type: 'peaking', f: 1250, gain: 2, q: 0.9 }, { type: 'peaking', f: 2600, gain: 1.5, q: 1.4 }, { type: 'highshelf', f: 7500, gain: -3 }] },
    mellow: { label: 'Mellow', bright: 0.66, hp: 820, gain: 1.05,
      eq: [{ type: 'peaking', f: 900, gain: 2, q: 0.8 }, { type: 'highshelf', f: 3200, gain: -6 }] },
    bright: { label: 'Bright', bright: 1.45, hp: 1250, gain: 0.9,
      eq: [{ type: 'peaking', f: 1500, gain: 2, q: 1 }, { type: 'peaking', f: 3000, gain: 3.5, q: 1.1 }, { type: 'highshelf', f: 9000, gain: -2 }] },
    // A straight mute: the low end goes, two nasal peaks arrive
    mute:   { label: 'Mute',   bright: 1.1,  hp: 1900, gain: 0.8,
      eq: [{ type: 'highpass', f: 700, q: 0.7 }, { type: 'peaking', f: 1900, gain: 7, q: 2.4 }, { type: 'peaking', f: 3400, gain: 5, q: 2.6 },
        { type: 'highshelf', f: 6500, gain: -4 }] },
  };

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  // How bright (fb, Hz) a note is at full pressure for a given loudness 0..1. The worklet uses the same sum.
  const FB_LOW = 330, FB_SPAN = 1350, FB_REST = 240, FB_TRACK = 0.2, REF_LEVEL = 0.64;
  const fbFor = (f0, level, bright) => (FB_LOW + FB_SPAN * level * level) * bright * Math.pow(f0 / 350, FB_TRACK);

  // Level trim per note: the power of the pulse after the bell's high-pass, at a middling loudness, so a scale
  // comes out even. Higher notes are left a touch stronger, as on the instrument.
  function normFor(f0, timbre, sampleRate) {
    const fb = fbFor(f0, REF_LEVEL, timbre.bright);
    const r = Math.exp(-f0 / fb);
    let power = 0, a = 1;
    for (let n = 1; n * f0 < sampleRate / 2 && n < 200; n++) {
      const f = n * f0;
      const h = f / Math.sqrt(f * f + timbre.hp * timbre.hp);
      power += 0.5 * a * a * h * h;
      a *= r;
    }
    return 0.15 * timbre.gain * Math.pow(f0 / 350, 0.12) / Math.sqrt(power);
  }

  // ------------------------------------------------------------------------
  // The voice, as an AudioWorklet (registered from a Blob URL)
  // ------------------------------------------------------------------------
  const WORKLET_NAME = 'trumpet-lips';
  const WORKLET_SRC = `
class TrumpetLips extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'frequency', defaultValue: 233, minValue: 20, maxValue: 5000, automationRate: 'a-rate' },
      { name: 'gate', defaultValue: 0, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
    ];
  }
  constructor(options) {
    super();
    this.o = Object.assign({ attack: 0.03, release: 0.07, breath: 0.7, tongue: 0.5, noise: 0.3, vibrato: 0.12,
      vibratoRate: 5.4, vibratoDelay: 0.4, drift: 0.3, vel: 0.8, bright: 1, norm: 0.2 }, options.processorOptions || {});
    this.phase = Math.random();
    this.vphase = 0;
    this.env = 0; this.bEnv = 0; this.dip = 0;
    this.t = 0; this.age = 0;
    this.on = false; this.started = false;
    this.driftP = 0; this.driftB = 0; this.shimmer = 0; this.nz = 0;
    this.port.onmessage = e => {
      const m = e.data || {};
      if (m.set) Object.assign(this.o, m.set);
      if (m.slur) this.dip = 1;
    };
  }
  process(inputs, outputs, params) {
    const out = outputs[0][0];
    if (!out) return true;
    const o = this.o, sr = sampleRate, N = out.length;
    const fArr = params.frequency, gate = params.gate[0] >= 0.5;
    if (gate && !this.on) { this.on = true; this.started = true; this.t = 0; }
    else if (!gate && this.on) this.on = false;
    this.age += N / sr;
    if (!this.started) { out.fill(0); return this.age < 20; }

    const level = Math.min(1, Math.max(0.03, o.breath)) * (0.55 + 0.45 * o.vel);
    const kA = 1 - Math.exp(-1 / (sr * Math.max(0.002, o.attack / 3)));
    const kR = 1 - Math.exp(-1 / (sr * Math.max(0.004, o.release / 3)));
    const kB = 1 - Math.exp(-1 / (sr * (0.007 + o.attack * 0.55)));     // the tone opens up a moment after the pressure
    const kDip = Math.exp(-1 / (sr * 0.022));
    const kNz = 0.55;
    // slow wander, once a block
    const kD = 1 - Math.exp(-2 * Math.PI * 2 * N / sr);
    this.driftP += (Math.random() * 2 - 1 - this.driftP) * kD;
    this.driftB += (Math.random() * 2 - 1 - this.driftB) * kD;
    this.shimmer += (Math.random() * 2 - 1 - this.shimmer) * (1 - Math.exp(-2 * Math.PI * 9 * N / sr));
    const driftCents = this.driftP * 40 * o.drift;
    const f00 = fArr[0];
    const fbTop = (${FB_LOW} + ${FB_SPAN} * level * level) * o.bright * Math.pow(f00 / 350, ${FB_TRACK}) * (1 + 0.5 * o.drift * this.driftB);
    const vibFade = Math.min(1, Math.max(0, (this.t - o.vibratoDelay) / 0.35));
    const vibAmt = o.vibrato * vibFade * vibFade * (3 - 2 * vibFade);
    const vInc = 2 * Math.PI * o.vibratoRate * (1 + 0.06 * this.driftB) / sr;
    const loud = (0.3 + 0.7 * level) * o.norm * (1 + 0.12 * o.drift * this.shimmer);
    const TWO_PI = 2 * Math.PI, LN_CENT = 0.000577622650466;
    const target = this.on ? 1 : 0, many = fArr.length > 1;
    let env = this.env, bEnv = this.bEnv, dip = this.dip, phase = this.phase, vphase = this.vphase, t = this.t, nzLp = this.nz;

    for (let i = 0; i < N; i++) {
      const f0 = many ? fArr[i] : f00;
      env += (target - env) * (this.on ? kA : kR);
      bEnv += ((this.on ? env : env * env) - bEnv) * (this.on ? kB : kR * 2.2);
      dip *= kDip;
      const vib = Math.sin(vphase); vphase += vInc;
      // pitch: vibrato, wander, and the tongue's first moment a hair under the note
      const cents = vibAmt * 22 * vib + driftCents - 14 * o.tongue * Math.exp(-t / 0.016);
      const f = f0 * Math.exp(cents * LN_CENT);
      phase += f / sr; if (phase >= 1) phase -= 1;
      const squeeze = 1 - 0.45 * dip;
      const fb = ${FB_REST} + (fbTop - ${FB_REST}) * bEnv * squeeze * (1 + 0.07 * vibAmt * vib);
      const r = Math.exp(-f / fb);
      const c = Math.cos(TWO_PI * phase);
      const x = (c - r) / (1 - 2 * r * c + r * r);                       // cos φ + r cos 2φ + r² cos 3φ + …
      const push = 1 + 0.25 * o.tongue * Math.exp(-t / 0.045);           // a tongued note starts a little proud
      const p = env * push * squeeze * (1 + 0.05 * vibAmt * vib);
      // air: hiss that the lips chop once a cycle, plus the tongue's click
      const w = Math.random() * 2 - 1;
      nzLp += (w - nzLp) * kNz;
      const air = nzLp * o.noise * 0.11 * (0.35 + 0.65 * (0.5 + 0.5 * c)) / Math.sqrt(1 - r * r);
      const click = t < 0.03 ? w * o.tongue * 0.9 * Math.exp(-t / 0.0035) * (this.on ? 1 : 0) : 0;
      out[i] = loud * (p * (x + air) + click * 0.5);
      t += 1 / sr;
    }
    this.env = env; this.bEnv = bEnv; this.dip = dip; this.phase = phase; this.vphase = vphase % TWO_PI; this.t = t; this.nz = nzLp;
    if (!this.on && env < 0.0002) return false;
    return true;
  }
}
registerProcessor('${WORKLET_NAME}', TrumpetLips);
`;

  const workletReady = new WeakMap();
  function loadWorklet(ctx) {
    if (!ctx.audioWorklet) return Promise.reject(new Error('AudioWorklet not supported'));
    if (!workletReady.has(ctx)) {
      // A Blob URL first, then a data: URL (some pages' security policies allow only one)
      const url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: 'application/javascript' }));
      const dataUrl = 'data:application/javascript;base64,' + btoa(unescape(encodeURIComponent(WORKLET_SRC)));
      const p = ctx.audioWorklet.addModule(url)
        .catch(() => ctx.audioWorklet.addModule(dataUrl))
        .finally(() => { try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ } });
      workletReady.set(ctx, p);
      p.catch(() => workletReady.delete(ctx));
    }
    return workletReady.get(ctx);
  }

  // A room: early reflections and a 1.5 s tail, a little darker than the horn
  const rooms = new WeakMap();
  function roomFor(ctx) {
    if (rooms.has(ctx)) return rooms.get(ctx);
    const sr = ctx.sampleRate, len = Math.floor(sr * 1.7);
    const ir = ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        d[i] = (Math.random() * 2 - 1) * Math.exp(-t / 0.27) * (t < 0.01 ? t / 0.01 : 1);
      }
      for (const [ms, g] of [[13, .5], [19, .36], [27, .3], [37, .22], [49, .16], [63, .1]]) {
        const k = Math.floor(sr * (ms + c * 2.7) / 1000); if (k < len) d[k] += g * (c ? -1 : 1);
      }
      let lp = 0; for (let i = 0; i < len; i++) { lp += 0.3 * (d[i] - lp); d[i] = lp; }
    }
    rooms.set(ctx, ir);
    return ir;
  }

  // ------------------------------------------------------------------------
  // One sounding note
  // ------------------------------------------------------------------------
  class Voice {
    constructor(synth, midi, velocity, when) {
      const ctx = synth.ctx, p = synth.params, timbre = TIMBRES[p.timbre] || TIMBRES.open;
      this.synth = synth; this.start = when; this.released = false; this.plannedOff = null;
      const f = mtof(midi);
      if (synth.workletOk) {
        this.node = new AudioWorkletNode(ctx, WORKLET_NAME, {
          numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1],
          processorOptions: {
            attack: p.attack, release: p.release, breath: p.breath, tongue: p.tongue, noise: p.noise,
            vibrato: p.vibrato, vibratoRate: p.vibratoRate, vibratoDelay: p.vibratoDelay, drift: p.drift,
            vel: velocity, bright: timbre.bright, norm: normFor(f, timbre, ctx.sampleRate),
          },
        });
        this.freq = this.node.parameters.get('frequency');
        this.gate = this.node.parameters.get('gate');
        this.freq.value = f;
        this.freq.setValueAtTime(f, ctx.currentTime);
        this.gate.setValueAtTime(0, ctx.currentTime);
        this.gate.setValueAtTime(1, when);
        this.node.connect(synth.bus);
      } else {
        // No AudioWorklet (an old browser): one fixed overtone recipe and a volume envelope
        const level = clamp(p.breath, 0.03, 1) * (0.55 + 0.45 * velocity);
        const r = Math.exp(-f / fbFor(f, level, timbre.bright));
        const count = Math.min(48, Math.floor(ctx.sampleRate / 2 / f));
        const real = new Float32Array(count + 1), imag = new Float32Array(count + 1);
        for (let n = 1; n <= count; n++) real[n] = Math.pow(r, n - 1);
        this.osc = ctx.createOscillator();
        this.osc.setPeriodicWave(ctx.createPeriodicWave(real, imag, { disableNormalization: true }));
        this.osc.frequency.setValueAtTime(f, ctx.currentTime);
        this.freq = this.osc.frequency;
        this.amp = ctx.createGain();
        this.peak = (0.3 + 0.7 * level) * normFor(f, timbre, ctx.sampleRate);
        this.amp.gain.setValueAtTime(0, when);
        this.amp.gain.setTargetAtTime(this.peak, when, Math.max(0.003, p.attack / 3));
        this.osc.connect(this.amp).connect(synth.bus);
        this.osc.start(when);
      }
    }

    // Slur to another note without tonguing: the pitch flips over quickly and the tone pinches for a moment
    glide(midi, when, time) {
      const ctx = this.synth.ctx, f = mtof(midi);
      const timbre = TIMBRES[this.synth.params.timbre] || TIMBRES.open;
      when = Math.max(when, ctx.currentTime);
      this.freq.cancelScheduledValues(when);
      this.freq.setValueAtTime(this.freq.value, when);
      this.freq.exponentialRampToValueAtTime(f, when + Math.max(0.004, time));
      if (this.node) this.node.port.postMessage({ slur: true, set: { norm: normFor(f, timbre, ctx.sampleRate) } });
    }

    release(when) {
      if (this.released) return;
      this.released = true;
      const ctx = this.synth.ctx, rel = this.synth.params.release;
      when = Math.max(when, ctx.currentTime);
      if (this.node) {
        this.gate.cancelScheduledValues(when);
        this.gate.setValueAtTime(0, when);
      } else {
        this.amp.gain.cancelScheduledValues(when);
        this.amp.gain.setTargetAtTime(0, when, Math.max(0.004, rel / 3));
        this.osc.stop(when + rel * 3 + 0.1);
      }
      const ms = (when - ctx.currentTime + rel * 4 + 0.4) * 1000;
      setTimeout(() => {
        try { (this.node || this.amp).disconnect(); } catch (e) { /* ignore */ }
        this.synth._forget(this);
      }, ms);
    }
  }

  // ------------------------------------------------------------------------
  // TrumpetSynth: public API
  // ------------------------------------------------------------------------
  class TrumpetSynth {
    static async create(ctx, options = {}) {
      const s = new TrumpetSynth(ctx, options);
      try { await loadWorklet(ctx); s.workletOk = true; }
      catch (e) { console.warn('[TrumpetSynth] AudioWorklet unavailable, using the simple voice:', e.message); }
      return s;
    }

    constructor(ctx, options = {}) {
      this.ctx = ctx;
      this.params = Object.assign({}, DEFAULTS, options);
      if (!TIMBRES[this.params.timbre]) this.params.timbre = 'open';
      this.voices = new Set();
      this.byNote = new Map();
      this.workletOk = false;

      // voices -> bus -> bell (high-pass) -> eq -> dry + room -> master -> limiter -> output
      this.bus = ctx.createGain();
      this.chain = [];
      this.eqOut = ctx.createGain();
      this.dry = ctx.createGain();
      this.wet = ctx.createGain();
      this.convolver = ctx.createConvolver();
      this.convolver.buffer = roomFor(ctx);
      this.master = ctx.createGain();
      this.limiter = ctx.createDynamicsCompressor();
      this.limiter.threshold.value = -6; this.limiter.knee.value = 6;
      this.limiter.ratio.value = 5; this.limiter.attack.value = 0.004; this.limiter.release.value = 0.16;
      this.output = ctx.createGain();
      this.eqOut.connect(this.dry); this.eqOut.connect(this.convolver);
      this.convolver.connect(this.wet);
      this.dry.connect(this.master); this.wet.connect(this.master);
      this.master.connect(this.limiter); this.limiter.connect(this.output);
      this._buildChain();
      this._applyMix();
    }

    connect(dest) { this.output.connect(dest); return dest; }
    disconnect() { this.output.disconnect(); }

    set(name, value) {
      if (!(name in DEFAULTS)) throw new Error('Unknown parameter: ' + name);
      if (name === 'timbre' && !TIMBRES[value]) throw new Error('Unknown timbre: ' + value);
      this.params[name] = value;
      if (name === 'timbre') this._buildChain();
      if (name === 'reverb' || name === 'volume') this._applyMix();
    }
    get(name) { return this.params[name]; }

    /** Start a note. `note` is the SOUNDING pitch as a MIDI number (fractions allowed). */
    noteOn(note, velocity = 0.8, when) {
      const ctx = this.ctx;
      when = Math.max(when == null ? ctx.currentTime : when, ctx.currentTime);
      const midi = note + (this.params.transpose || 0);
      if (this.params.mono) {
        const held = [...this.voices].filter(v => !v.released && v.start <= when + 1e-4 &&
          (v.plannedOff == null || v.plannedOff > when - 1e-3)).pop();
        if (held) {
          this._unmap(held);
          held.glide(midi, when, this.params.glide);
          held.note = note;
          held.plannedOff = null;
          this._map(note, held);
          return held;
        }
        for (const v of this.voices) if (!v.released) v.release(v.plannedOff != null ? Math.min(v.plannedOff, when) : when);
      }
      const voice = new Voice(this, midi, velocity, when);
      voice.note = note;
      this.voices.add(voice);
      this._map(note, voice);
      return voice;
    }

    noteOff(note, when) {
      const list = this.byNote.get(note);
      if (!list || !list.length) return;
      const v = list.shift();
      if (!list.length) this.byNote.delete(note);
      v.release(when == null ? this.ctx.currentTime : when);
    }

    playNote(note, duration = 0.5, velocity = 0.8, when) {
      const t = Math.max(when == null ? this.ctx.currentTime : when, this.ctx.currentTime);
      const v = this.noteOn(note, velocity, t);
      const list = this.byNote.get(note);
      if (list) { const i = list.indexOf(v); if (i >= 0) list.splice(i, 1); if (!list.length) this.byNote.delete(note); }
      const offAt = t + Math.max(0.03, duration);
      if (this.params.mono) {
        v.plannedOff = offAt;
        const check = () => { if (v.note === note && !v.released) v.release(offAt); };
        const ms = (offAt - this.ctx.currentTime) * 1000 - 30;
        if (ms <= 0) check(); else setTimeout(check, ms);
      } else {
        v.release(offAt);
      }
      return v;
    }

    allNotesOff(when) { for (const v of [...this.voices]) v.release(when == null ? this.ctx.currentTime : when); this.byNote.clear(); }

    dispose() {
      this.allNotesOff();
      setTimeout(() => { try { this.output.disconnect(); } catch (e) { /* ignore */ } }, 500);
    }

    _map(note, v) { if (!this.byNote.has(note)) this.byNote.set(note, []); this.byNote.get(note).push(v); }
    _unmap(v) { for (const [n, list] of this.byNote) { const i = list.indexOf(v); if (i >= 0) { list.splice(i, 1); if (!list.length) this.byNote.delete(n); } } }
    _forget(v) { this.voices.delete(v); this._unmap(v); }

    _buildChain() {
      const ctx = this.ctx, timbre = TIMBRES[this.params.timbre] || TIMBRES.open;
      try { this.bus.disconnect(); } catch (e) { /* ignore */ }
      for (const f of this.chain) { try { f.disconnect(); } catch (e) { /* ignore */ } }
      this.chain = [];
      // The bell: 6 dB per octave up to its cutoff, level above (a one-pole high-pass)
      const K = Math.tan(Math.PI * timbre.hp / ctx.sampleRate);
      if (ctx.createIIRFilter) this.chain.push(ctx.createIIRFilter([1 / (1 + K), -1 / (1 + K)], [1, (K - 1) / (K + 1)]));
      timbre.eq.forEach(b => {
        const f = ctx.createBiquadFilter();
        f.type = b.type; f.frequency.value = b.f;
        if (b.gain != null) f.gain.value = b.gain;
        if (b.q) f.Q.value = b.q;
        this.chain.push(f);
      });
      let prev = this.bus;
      for (const f of this.chain) { prev.connect(f); prev = f; }
      prev.connect(this.eqOut);
    }

    _applyMix() {
      const r = clamp(this.params.reverb, 0, 1), t = this.ctx.currentTime;
      const to = (param, v) => { param.cancelScheduledValues(t); param.setValueAtTime(param.value, t); param.setTargetAtTime(v, t, 0.02); };
      to(this.dry.gain, 1 - 0.3 * r);
      to(this.wet.gain, r * 0.6);
      to(this.master.gain, clamp(this.params.volume, 0, 1.5) / 0.8);
    }
  }

  TrumpetSynth.TIMBRES = Object.keys(TIMBRES);
  TrumpetSynth.DEFAULTS = Object.assign({}, DEFAULTS);
  TrumpetSynth.WORKLET_SOURCE = WORKLET_SRC;
  TrumpetSynth.mtof = mtof;

  global.TrumpetSynth = TrumpetSynth;
  if (typeof module !== 'undefined' && module.exports) module.exports = TrumpetSynth;
})(typeof window !== 'undefined' ? window : globalThis);

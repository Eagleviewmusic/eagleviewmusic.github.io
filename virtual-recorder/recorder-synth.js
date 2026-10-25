/*!
 * recorder-synth.js — a Web Audio recorder (wind instrument) synthesizer
 * Four interchangeable engines that share one "realism layer":
 *   'spectral'    additive PeriodicWave tables per register (recommended default)
 *   'waveguide'   jet-drive physical model in an AudioWorklet (most natural, more CPU)
 *   'fm'          1:2 FM, which makes the odd-harmonic recorder spectrum cheaply
 *   'subtractive' triangle + sine through a key-tracked low-pass (cheapest)
 *
 * No dependencies. Works as a plain <script> (sets window.RecorderSynth) or via require().
 *
 *   const ctx = new AudioContext();                    // create/resume after a click
 *   const rec = await RecorderSynth.create(ctx, { engine: 'spectral', size: 'soprano' });
 *   rec.connect(ctx.destination);
 *   rec.playNote(72, 0.5);                              // MIDI note, seconds
 *   rec.noteOn(74, 0.8); rec.noteOff(74, ctx.currentTime + 1);
 *   await rec.setEngine('waveguide');
 *
 * MIT licence. Physical model after the jet-drive flute models of Verge, Fabre and
 * Hirschberg, and Perry Cook's STK Flute (delay + jet nonlinearity + resonator).
 *
 * Virtual Recorder copy: one change, in Voice.glide() — the waveguide slides into a slurred
 * note instead of jumping, and leaves out the chiff tick there (both marked in the code).
 */
(function (global) {
  'use strict';

  // ------------------------------------------------------------------------
  // Instrument data
  // ------------------------------------------------------------------------

  // Sounding ranges as MIDI notes; `written` = semitones added when you pass
  // written (notated) pitches and set { writtenPitch: true }.
  const SIZES = {
    sopranino: { low: 77, high: 103, written: 12 },
    soprano:   { low: 72, high: 98,  written: 12 },
    alto:      { low: 65, high: 91,  written: 0 },
    tenor:     { low: 60, high: 86,  written: 0 },
    bass:      { low: 53, high: 79,  written: 12 },
  };

  // Harmonic amplitudes (1 = fundamental). Odd harmonics dominate and evens are weak,
  // as measured on recorders; upper register thins out. `soft`/`loud` are the two ends
  // of the breath (dynamic) range; low/high are the bottom/top of the instrument.
  const TIMBRES = {
    wood: {
      label: 'Wooden (baroque)',
      soft: { low: [1, .05, .20, .03, .07, .015, .03, .008, .01], high: [1, .03, .07, .01, .02, .005] },
      loud: { low: [1, .09, .34, .05, .14, .03, .06, .015, .025, .008], high: [1, .05, .14, .02, .05, .01, .015] },
      eq: [{ type: 'peaking', f: 1100, gain: 1.5, q: 1.0 }, { type: 'highshelf', f: 5000, gain: -4 }],
      wg: { pole: 0.35, loss: 0.95, even: 0.06, center: -15 },
      fm: [0.22, 0.62], sub: [2.0, 4.5], noise: 1.0,
    },
    plastic: {
      label: 'Plastic (school)',
      soft: { low: [1, .07, .30, .05, .12, .03, .06, .02, .03, .01], high: [1, .04, .13, .02, .05, .01, .01] },
      loud: { low: [1, .13, .52, .08, .24, .05, .12, .035, .06, .02, .02], high: [1, .06, .24, .03, .09, .02, .03] },
      eq: [{ type: 'peaking', f: 2800, gain: 3.5, q: 1.2 }, { type: 'highshelf', f: 6500, gain: -1.5 }],
      wg: { pole: 0.12, loss: 0.955, even: 0.12, center: -13.5 },
      fm: [0.35, 0.85], sub: [2.8, 6.0], noise: 0.85,
    },
  };

  const DEFAULTS = {
    engine: 'spectral',  // 'spectral' | 'waveguide' | 'fm' | 'subtractive'
    timbre: 'wood',      // 'wood' | 'plastic'
    size: 'soprano',     // which instrument's register map to use
    writtenPitch: false, // true: incoming notes are notated pitch (soprano sounds 8va)
    transpose: 0,        // extra semitones
    mono: false,         // true: one note at a time; overlapping notes slur (no re-tongue)
    volume: 0.8,
    breath: 0.7,         // overall blowing strength 0..1 (louder, brighter, a bit sharper)
    attack: 0.025,       // tongued onset, seconds ("tu"); ~0.06 for a soft "du"
    release: 0.06,       // seconds
    chiff: 0.5,          // 0..1 attack noise burst + octave pre-sound
    noise: 0.35,         // 0..1 breath noise riding on the tone
    vibrato: 0.15,       // 0..1 (breath vibrato: pitch + amplitude)
    vibratoRate: 5.2,    // Hz
    vibratoDelay: 0.35,  // seconds before vibrato fades in
    pitchFollow: 0.5,    // 0..1 how much pitch rises with breath (non-waveguide engines)
    drift: 0.3,          // 0..1 slow random pitch wander
    reverb: 0.18,        // 0..1 small-room send
    glide: 0.025,        // slur time in mono mode, seconds
  };

  const ENGINES = ['spectral', 'waveguide', 'fm', 'subtractive'];

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const lerp = (a, b, t) => a + (b - a) * t;

  // ------------------------------------------------------------------------
  // AudioWorklet source for the jet-drive waveguide (registered from a Blob URL)
  // ------------------------------------------------------------------------
  const WORKLET_NAME = 'recorder-jet-waveguide';
  const WORKLET_SRC = `
class RecorderJetWaveguide extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'frequency', defaultValue: 523.25, minValue: 20, maxValue: 8000, automationRate: 'k-rate' },
      { name: 'detune', defaultValue: 0, minValue: -2400, maxValue: 2400, automationRate: 'k-rate' },
      { name: 'pressure', defaultValue: 0, minValue: 0, maxValue: 2, automationRate: 'a-rate' },
      { name: 'noise', defaultValue: 0.02, minValue: 0, maxValue: 0.5, automationRate: 'k-rate' },
    ];
  }
  constructor(options) {
    super();
    const o = (options && options.processorOptions) || {};
    this.pole = o.pole != null ? o.pole : 0.3;       // bore loss low-pass (higher = darker)
    this.loss = o.loss != null ? o.loss : 0.95;      // round-trip reflection gain (pipe Q)
    this.even = o.even != null ? o.even : 0.06;      // labium asymmetry -> even harmonics
    this.gain = o.gain != null ? o.gain : 3.0;       // jet amplification
    this.jetRatio = o.jetRatio != null ? o.jetRatio : 0.43; // jet delay / period at normal breath
    this.jetLP = o.jetLP != null ? o.jetLP : 3.0;    // jet band-limit, multiple of f
    this.offset = o.offset != null ? o.offset : 0.12;
    this.boost = o.boost != null ? o.boost : 4.0;    // extra jet gain while the tongue releases the air
    this.injBoost = o.injBoost != null ? o.injBoost : 1.0; // extra jet flow into the pipe at the attack
    this.seedAmp = o.seed != null ? o.seed : 2.0;    // jet-formation pulse that rings the pipe at onset
    this.pPrev = 0; this.atk = 0; this.armed = true; this.seedLeft = 0; this.seedLen = 1;
    this.atkDecay = Math.exp(-1 / ((o.atkTime != null ? o.atkTime : 0.015) * sampleRate));
    this.size = 8192; this.mask = this.size - 1;
    this.bore = new Float32Array(this.size);
    this.jet = new Float32Array(this.size);
    this.w = 0; this.lp = 0; this.j1 = 0; this.j2 = 0;
    this.dcx = 0; this.dcy = 0; this.rad = 0; this.ox = 0; this.oy = 0;
    this.rng = (Math.random() * 4294967296) >>> 0;
    this.f = -1; this.N = 100; this.M = 50; this.period = 100; this.jp = 0.5; this.jpd = 0;
    this.done = false;
    this.port.onmessage = e => { if (e.data === 'stop') this.done = true; };
  }
  rnd() { this.rng = (this.rng * 1664525 + 1013904223) >>> 0; return this.rng / 2147483648 - 1; }
  read(buf, d) {
    const pos = this.w - d, i = Math.floor(pos), fr = pos - i, m = this.mask;
    const a = buf[i & m], b = buf[(i + 1) & m];
    return a + (b - a) * fr;
  }
  setFreq(f) {
    this.f = f;
    const sr = sampleRate;
    const period = sr / f; this.period = period;
    const w = 2 * Math.PI * f / sr, p = this.pole;
    // compensate the loop filter's phase delay so the pipe resonates in tune
    this.N = Math.max(2, Math.min(this.size - 4, period - Math.atan2(p * Math.sin(w), 1 - p * Math.cos(w)) / w));
    const fc = Math.min(0.45 * sr, this.jetLP * f);
    this.jp = Math.exp(-2 * Math.PI * fc / sr);
    this.jpd = 2 * Math.atan2(this.jp * Math.sin(w), 1 - this.jp * Math.cos(w)) / w;
    this.regBoost = Math.min(2.2, Math.max(0.35, 523.25 / f)); // low pipes need more help to speak
  }
  process(inputs, outputs, params) {
    const out = outputs[0][0];
    if (!out) return !this.done;
    const f = params.frequency[0] * Math.pow(2, params.detune[0] / 1200);
    if (Math.abs(f - this.f) > 1e-3) this.setFreq(f);
    const P = params.pressure, pa = P.length > 1;
    const turb = params.noise[0];
    // jet convection delay shortens as blowing pressure rises (jet speed ~ sqrt(p))
    const pBlock = Math.max(pa ? P[P.length >> 1] : P[0], 0.05);
    const ratio = Math.min(0.5, Math.max(0.36, this.jetRatio * Math.sqrt(0.7 / pBlock)));
    const M = Math.max(1, this.period * ratio - this.jpd);
    const lpA = 1 - this.pole, jpA = 1 - this.jp, jp = this.jp, pole = this.pole;
    const loss = this.loss, gain = this.gain, off = this.offset, even = this.even, m = this.mask;
    for (let i = 0; i < out.length; i++) {
      const p = pa ? P[i] : P[0];
      const back = this.read(this.bore, this.N);
      this.lp = lpA * back + pole * this.lp;
      const v = this.lp * loss;
      this.jet[this.w] = v;
      const jr = this.read(this.jet, M);
      this.j1 = jpA * jr + jp * this.j1;
      this.j2 = jpA * this.j1 + jp * this.j2;
      const n = this.rnd();
      // a fast rise in blowing pressure (tonguing) forms a strong, unstable jet that
      // drives the pipe hard for a few tens of ms; this is what lets a recorder speak quickly
      const dp = p - this.pPrev; this.pPrev = p;
      this.atk = this.atk * this.atkDecay + (dp > 0 ? dp : 0);
      const ab = Math.min(1, this.atk * 1.5);
      const eta = -this.j2 * gain * (0.5 + 0.5 * p) * (1 + this.boost * ab);
      if (this.armed && p > 0.02) { this.armed = false; this.seedLen = Math.max(2, Math.round(this.period / 2)); this.seedLeft = this.seedLen; }
      else if (p < 0.004) this.armed = true;
      const q = Math.tanh(eta + off + turb * n * p * 6);
      const y = q - this.dcx + 0.995 * this.dcy; this.dcx = q; this.dcy = y;
      let inj = y * 0.5 * p * (1 + this.injBoost * this.regBoost * ab);
      if (this.seedLeft > 0) { inj += this.seedAmp * Math.min(1, p * 2) * Math.sin(Math.PI * (this.seedLen - this.seedLeft) / this.seedLen); this.seedLeft--; }
      this.bore[this.w] = v + inj;
      this.w = (this.w + 1) & m;
      // radiation (gentle high-pass) + labium asymmetry + direct breath noise
      let s = (v - 0.6 * this.rad) * 0.11; this.rad = v;
      s = s + even * s * s + n * turb * p * 0.6;
      const z = s - this.ox + 0.997 * this.oy; this.ox = s; this.oy = z;
      out[i] = Math.tanh(z);
    }
    if (!(this.lp === this.lp) || !isFinite(this.lp)) { this.bore.fill(0); this.jet.fill(0); this.lp = 0; this.j1 = 0; this.j2 = 0; this.dcx = this.dcy = 0; }
    return !this.done;
  }
}
registerProcessor('${WORKLET_NAME}', RecorderJetWaveguide);
`;

  const workletReady = new WeakMap();
  function loadWorklet(ctx) {
    if (!ctx.audioWorklet) return Promise.reject(new Error('AudioWorklet not supported'));
    if (!workletReady.has(ctx)) {
      // Try a Blob URL first, then a data: URL (some pages' security policies allow only one).
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

  // ------------------------------------------------------------------------
  // Shared resources per AudioContext (noise buffer, reverb impulse, waves)
  // ------------------------------------------------------------------------
  const shared = new WeakMap();
  function getShared(ctx) {
    if (shared.has(ctx)) return shared.get(ctx);
    const sr = ctx.sampleRate;
    // 2 s of white noise
    const noise = ctx.createBuffer(1, Math.floor(sr * 2), sr);
    const nd = noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    // small, slightly bright room: early reflections + 1.1 s exponential tail
    const len = Math.floor(sr * 1.4);
    const ir = ctx.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        d[i] = (Math.random() * 2 - 1) * Math.exp(-t / 0.22) * (t < 0.008 ? t / 0.008 : 1);
      }
      for (const [ms, g] of [[11, .5], [17, .35], [23, .3], [31, .22], [43, .15]]) {
        const k = Math.floor(sr * (ms + c * 2.3) / 1000); if (k < len) d[k] += g * (c ? -1 : 1);
      }
      // gentle low-pass on the tail
      let lp = 0; for (let i = 0; i < len; i++) { lp += 0.35 * (d[i] - lp); d[i] = lp; }
    }
    const res = { noise, ir, waves: new Map() };
    shared.set(ctx, res);
    return res;
  }

  function harmonicTable(timbre, dyn, t) {
    const T = TIMBRES[timbre] || TIMBRES.wood;
    const mix = (a, b) => {
      const n = Math.max(a.length, b.length), r = new Array(n);
      for (let i = 0; i < n; i++) r[i] = lerp(a[i] || 0, b[i] || 0, t);
      return r;
    };
    return dyn === 'soft' ? mix(T.soft.low, T.soft.high) : mix(T.loud.low, T.loud.high);
  }

  function getWave(ctx, timbre, dyn, t) {
    const S = getShared(ctx);
    const key = timbre + dyn + Math.round(t * 12);
    if (S.waves.has(key)) return S.waves.get(key);
    const h = harmonicTable(timbre, dyn, Math.round(t * 12) / 12);
    const real = new Float32Array(h.length + 1), imag = new Float32Array(h.length + 1);
    // alternate cosine/sine phases a little so the waveform is not a spiky sum
    for (let k = 1; k <= h.length; k++) {
      const ph = (k % 4) * 0.35;
      real[k] = h[k - 1] * Math.sin(ph);
      imag[k] = h[k - 1] * Math.cos(ph);
    }
    const w = ctx.createPeriodicWave(real, imag, { disableNormalization: false });
    S.waves.set(key, w);
    return w;
  }

  // ------------------------------------------------------------------------
  // Voice: one sounding note. Builds the engine's tone source plus the shared
  // realism layer (pitch bus, vibrato, drift, breath noise, chiff, envelope).
  // ------------------------------------------------------------------------
  class Voice {
    constructor(synth, midi, velocity, when) {
      const ctx = this.ctx = synth.ctx;
      const P = this.P = Object.assign({}, synth.params);
      const S = getShared(ctx);
      this.synth = synth;
      this.midi = midi;
      this.start = when;
      this.released = false;
      this.nodes = [];
      this.sources = [];

      const size = SIZES[P.size] || SIZES.soprano;
      const f = this.f = mtof(midi);
      // where this note sits in the instrument's range: 0 = lowest, 1 = highest
      const t = this.t = clamp((midi - size.low) / (size.high - size.low), 0, 1);
      const dyn = this.dyn = clamp(velocity * P.breath * 1.43, 0, 1.2);
      const T = TIMBRES[P.timbre] || TIMBRES.wood;
      const engine = synth.engine;

      // ---- output chain: tone VCA (envelope) -> tremolo -> voice out
      const out = this.out = this._n(ctx.createGain());
      out.connect(synth.bus);
      const trem = this._n(ctx.createGain()); trem.gain.value = 1; trem.connect(out);
      const vca = this.vca = this._n(ctx.createGain()); vca.gain.value = 0; vca.connect(trem);

      // ---- pitch bus (cents): static offset + scoop + vibrato + drift
      const pitchBus = this.pitchBus = this._src(ctx.createConstantSource());
      const pitchSum = this._n(ctx.createGain()); pitchSum.gain.value = 1;
      pitchBus.connect(pitchSum);
      this.pitchTargets = [];
      const pitchCents = engine === 'waveguide' ? 0 : P.pitchFollow * 22 * (dyn - 0.6);
      if (engine === 'waveguide') {
        // the model sharpens with breath by itself (about 25 cents from soft to hard);
        // this offset puts a medium breath (dyn ~0.7) on pitch
        pitchBus.offset.value = T.wg.center;
      } else {
        pitchBus.offset.setValueAtTime(pitchCents - 14 * (0.5 + 0.5 * P.pitchFollow), when);
        pitchBus.offset.setTargetAtTime(pitchCents, when + 0.004, 0.022);   // pitch rises as pressure builds
      }

      // vibrato LFO (breath vibrato: amplitude + pitch)
      const lfo = this._src(ctx.createOscillator());
      lfo.frequency.value = P.vibratoRate * (0.95 + 0.1 * Math.random());
      const vibCents = this._n(ctx.createGain()); vibCents.gain.value = 0;
      const vibAmp = this._n(ctx.createGain()); vibAmp.gain.value = 0;
      lfo.connect(vibCents); lfo.connect(vibAmp);
      vibCents.connect(pitchSum); vibAmp.connect(trem.gain);
      const vOn = when + P.vibratoDelay, vFull = vOn + 0.45;
      vibCents.gain.setValueAtTime(0, vOn); vibCents.gain.linearRampToValueAtTime(P.vibrato * 22, vFull);
      vibAmp.gain.setValueAtTime(0, vOn); vibAmp.gain.linearRampToValueAtTime(P.vibrato * 0.12, vFull);
      this.vibAmp = vibAmp; this.lfo = lfo;

      // slow drift: two slow incommensurate sines
      if (P.drift > 0) {
        for (const [rate, depth] of [[0.11 + Math.random() * 0.08, 3.2], [0.37 + Math.random() * 0.2, 1.6]]) {
          const d = this._src(ctx.createOscillator()); d.frequency.value = rate;
          const g = this._n(ctx.createGain()); g.gain.value = depth * P.drift * (Math.random() < 0.5 ? -1 : 1);
          d.connect(g); g.connect(pitchSum);
        }
      }

      // ---- loudness for this note: limited dynamic range, low notes a bit softer
      const peak = this.peak = (0.38 + 0.62 * clamp(dyn, 0, 1)) * (0.78 + 0.22 * t) * 0.32;

      // ---- the tone source for the chosen engine
      let tone; // node whose output is the steady tone (fed to vca)
      const freqParams = [];
      if (engine === 'waveguide' && synth.workletOk) {
        const wg = Object.assign({}, T.wg);
        const node = this.wgNode = this._n(new AudioWorkletNode(ctx, WORKLET_NAME, {
          numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1],
          processorOptions: { pole: wg.pole, loss: wg.loss, even: wg.even, gain: 3.0, jetRatio: 0.43, jetLP: 3.0, offset: 0.12 },
        }));
        node.parameters.get('frequency').value = f;
        node.parameters.get('noise').value = 0.012 + 0.03 * P.noise * T.noise;
        pitchSum.connect(node.parameters.get('detune'));
        const pr = this.pressure = node.parameters.get('pressure');
        const pTarget = this.pTarget = 0.3 + 0.8 * clamp(dyn, 0, 1.2);
        pr.setValueAtTime(0, when);
        pr.linearRampToValueAtTime(pTarget * 1.06, when + Math.max(0.008, P.attack * 0.8));
        pr.setTargetAtTime(pTarget, when + P.attack, 0.04);
        // breath vibrato also wobbles the blowing pressure (which bends pitch physically)
        const vibP = this._n(ctx.createGain()); vibP.gain.value = 0;
        lfo.connect(vibP); vibP.connect(pr);
        vibP.gain.setValueAtTime(0, vOn); vibP.gain.linearRampToValueAtTime(P.vibrato * 0.06, vFull);
        node.connect(vca);
        tone = node;
        this.toneLevel = 1.0;
      } else if (engine === 'fm') {
        const car = this._src(ctx.createOscillator());
        const mod = this._src(ctx.createOscillator());
        const mod1 = this._src(ctx.createOscillator());
        car.frequency.value = f; mod.frequency.value = 2 * f; mod1.frequency.value = f;
        const idx = lerp(T.fm[0], T.fm[1], clamp(dyn, 0, 1)) * (1 - 0.45 * t);
        const dev = this._n(ctx.createGain());
        dev.gain.setValueAtTime(0, when);
        dev.gain.linearRampToValueAtTime(idx * 1.8 * 2 * f, when + 0.006);   // bright "spit" at the attack
        dev.gain.setTargetAtTime(idx * 2 * f, when + 0.012, 0.03);
        const dev1 = this._n(ctx.createGain()); dev1.gain.value = idx * 0.12 * f; // a touch of even harmonics
        mod.connect(dev); mod1.connect(dev1); dev.connect(car.frequency); dev1.connect(car.frequency);
        freqParams.push(car.detune, mod.detune, mod1.detune);
        this.fmDev = dev; this.fmIdx = idx;
        this.freqNodes = [[car, 1], [mod, 2], [mod1, 1]];
        car.connect(vca); tone = car; this.toneLevel = 0.95;
      } else if (engine === 'subtractive') {
        const tri = this._src(ctx.createOscillator()); tri.type = 'triangle';
        const sin = this._src(ctx.createOscillator()); sin.type = 'sine';
        tri.frequency.value = f; sin.frequency.value = f;
        const b = clamp(dyn, 0, 1);
        const gT = this._n(ctx.createGain()); gT.gain.value = lerp(0.45, 0.85, b);
        const gS = this._n(ctx.createGain()); gS.gain.value = lerp(0.6, 0.25, b);
        const lp = this._n(ctx.createBiquadFilter()); lp.type = 'lowpass'; lp.Q.value = 0.4;
        const cut = f * lerp(T.sub[0], T.sub[1], b) * (1 - 0.35 * t);
        lp.frequency.setValueAtTime(Math.min(cut * 1.8, 18000), when);
        lp.frequency.setTargetAtTime(Math.min(cut, 18000), when + 0.01, 0.03);
        tri.connect(gT); sin.connect(gS); gT.connect(lp); gS.connect(lp);
        freqParams.push(tri.detune, sin.detune);
        this.freqNodes = [[tri, 1], [sin, 1]];
        this.subLP = lp; this.subCutRatio = cut / f;
        lp.connect(vca); tone = lp; this.toneLevel = 1.0;
      } else {
        // 'spectral' (also the fallback when AudioWorklet is missing)
        const soft = this._src(ctx.createOscillator());
        const loud = this._src(ctx.createOscillator());
        soft.setPeriodicWave(getWave(ctx, P.timbre, 'soft', t));
        loud.setPeriodicWave(getWave(ctx, P.timbre, 'loud', t));
        soft.frequency.value = f; loud.frequency.value = f;
        const b = clamp(dyn, 0, 1);
        const gs = this._n(ctx.createGain()); gs.gain.value = Math.cos(b * Math.PI / 2);
        const gl = this._n(ctx.createGain()); gl.gain.value = Math.sin(b * Math.PI / 2);
        // amplitude vibrato also nudges brightness, like a real breath pulse
        const sum = this._n(ctx.createGain()); sum.gain.value = 0.85;
        soft.connect(gs); loud.connect(gl); gs.connect(sum); gl.connect(sum);
        freqParams.push(soft.detune, loud.detune);
        this.freqNodes = [[soft, 1], [loud, 1]];
        sum.connect(vca); tone = sum; this.toneLevel = 1.0;
      }
      for (const fp of freqParams) pitchSum.connect(fp);
      this.pitchSum = pitchSum;

      // ---- breath noise, band-limited and pulsed by the tone itself
      const nsrc = this._src(ctx.createBufferSource());
      nsrc.buffer = S.noise; nsrc.loop = true;
      this.noiseOffset = Math.random() * 1.9;
      const hp = this._n(ctx.createBiquadFilter()); hp.type = 'highpass'; hp.frequency.value = Math.max(700, f * 1.2); hp.Q.value = 0.5;
      const nlp = this._n(ctx.createBiquadFilter()); nlp.type = 'lowpass'; nlp.frequency.value = 7500; nlp.Q.value = 0.5;
      const pulse = this._n(ctx.createGain()); pulse.gain.value = 0.55;      // base level
      const modDepth = this._n(ctx.createGain()); modDepth.gain.value = 0.45; // + tone-synchronous part
      tone.connect(modDepth); modDepth.connect(pulse.gain);
      const nEnv = this.nEnv = this._n(ctx.createGain()); nEnv.gain.value = 0;
      nsrc.connect(hp); hp.connect(nlp); nlp.connect(pulse); pulse.connect(nEnv); nEnv.connect(trem);
      const noiseLevel = this.noiseLevel = (engine === 'waveguide' ? 0.35 : 1) * P.noise * T.noise * 0.11 * (0.7 + 0.6 * t) * (0.6 + 0.4 * clamp(dyn, 0, 1.2));

      // ---- chiff: noise bands near the 2nd/3rd pipe modes + a brief octave pre-sound
      if (P.chiff > 0) {
        const cAmt = P.chiff * (0.6 + 0.4 * clamp(dyn, 0, 1.2)) * (engine === 'waveguide' ? 0.6 : 1);
        const cEnv = this.cEnv = this._n(ctx.createGain()); cEnv.gain.value = 0;
        for (const [mult, q, g] of [[2, 7, 0.9], [3, 6, 0.7], [5.5, 1.2, 0.5]]) {
          const bp = this._n(ctx.createBiquadFilter()); bp.type = 'bandpass';
          bp.frequency.value = Math.min(f * mult, 16000); bp.Q.value = q;
          const bg = this._n(ctx.createGain()); bg.gain.value = g;
          nsrc.connect(bp); bp.connect(bg); bg.connect(cEnv);
        }
        cEnv.connect(out);
        const cPeak = cAmt * 0.5 * peak / 0.32;
        cEnv.gain.setValueAtTime(0, when);
        cEnv.gain.linearRampToValueAtTime(cPeak, when + 0.004);
        cEnv.gain.setTargetAtTime(0, when + 0.006, 0.014);
        if (engine !== 'waveguide') {
          const oct = this._src(ctx.createOscillator()); oct.frequency.value = 2 * f;
          pitchSum.connect(oct.detune);
          const og = this._n(ctx.createGain()); og.gain.value = 0;
          oct.connect(og); og.connect(out);
          og.gain.setValueAtTime(0, when);
          og.gain.linearRampToValueAtTime(cAmt * 0.16 * peak, when + 0.006);
          og.gain.setTargetAtTime(0, when + 0.01, 0.012);
          this.octNode = oct;
        }
      }

      // ---- envelopes
      const a = Math.max(0.004, P.attack);
      const v = vca.gain;
      v.setValueAtTime(0, when);
      if (engine === 'waveguide' && synth.workletOk) {
        // the model grows its own oscillation; this VCA only sets level and guards the tail
        v.linearRampToValueAtTime(peak * 3.0, when + 0.003);
      } else {
        v.setValueAtTime(0, when + 0.003);                        // tone starts just after the chiff
        v.linearRampToValueAtTime(peak * this.toneLevel * 1.05, when + 0.003 + a);
        v.setTargetAtTime(peak * this.toneLevel, when + 0.003 + a, 0.04);
      }
      nEnv.gain.setValueAtTime(0, when);
      nEnv.gain.linearRampToValueAtTime(noiseLevel * 1.6, when + a * 0.7);
      nEnv.gain.setTargetAtTime(noiseLevel, when + a, 0.05);

      // start everything
      for (const s of this.sources) {
        if (s === nsrc) s.start(when, this.noiseOffset); else s.start(when);
      }
    }

    _n(node) { this.nodes.push(node); return node; }
    _src(node) { this.nodes.push(node); this.sources.push(node); return node; }

    /** Slur to a new pitch without re-tonguing (mono mode). */
    glide(midi, when, time) {
      const f = mtof(midi), f0 = this.f;
      this.midi = midi; this.f = f;
      const tc = Math.max(0.002, time / 3);
      // anchor each ramp at its old value so it starts at `when`, not now
      const slide = (param, from, to) => { param.setValueAtTime(from, when); param.setTargetAtTime(to, when, tc); };
      if (this.wgNode) {
        // Virtual Recorder change: the pipe slides to the new note over the slur time. It used to
        // jump there in one step, which made every slur sound plucked, like a harpsichord.
        const fr = this.wgNode.parameters.get('frequency');
        fr.cancelScheduledValues(when);
        fr.setValueAtTime(f0, when);
        fr.exponentialRampToValueAtTime(f, when + Math.max(0.005, time));
      }
      if (this.freqNodes) for (const [node, mult] of this.freqNodes) slide(node.frequency, f0 * mult, f * mult);
      if (this.fmDev) slide(this.fmDev.gain, this.fmIdx * 2 * f0, this.fmIdx * 2 * f);
      if (this.subLP) slide(this.subLP.frequency, Math.min(f0 * this.subCutRatio, 18000), Math.min(f * this.subCutRatio, 18000));
      if (this.octNode) slide(this.octNode.frequency, 2 * f0, 2 * f);
      // a whisper of chiff where the fingers change. Virtual Recorder change: not on the waveguide,
      // where its filters (still tuned to the old note) added an off-pitch tick to the slide.
      if (this.cEnv && !this.wgNode) {
        this.cEnv.gain.setValueAtTime(0, when);
        this.cEnv.gain.linearRampToValueAtTime(this.P.chiff * 0.12 * this.peak / 0.32, when + 0.004);
        this.cEnv.gain.setTargetAtTime(0, when + 0.006, 0.01);
      }
    }

    release(when) {
      if (this.released) return;
      this.released = true;
      const ctx = this.ctx, P = this.P;
      const t0 = Math.max(when, ctx.currentTime);
      const r = Math.max(0.01, P.release);
      // cancelAndHoldAtTime is missing in Firefox and inconsistent elsewhere, so we hold
      // at a value computed from our own envelope shape instead.
      const hold = (param, value) => { param.cancelScheduledValues(t0); param.setValueAtTime(value, t0); };
      hold(this.vca.gain, this._envAt(t0));
      this.vca.gain.setTargetAtTime(0, t0, r / 3.5);
      hold(this.nEnv.gain, this.noiseLevel);
      this.nEnv.gain.setTargetAtTime(0, t0, r / 5);
      if (this.pressure) {
        hold(this.pressure, this.pTarget);
        this.pressure.setTargetAtTime(0, t0, r / 4);
      }
      const end = t0 + r * 2.5 + 0.08;
      for (const s of this.sources) { try { s.stop(end); } catch (e) { /* already stopped */ } }
      const done = () => this.dispose();
      const timer = this.sources[0];
      if (timer) timer.onended = done;
      else setTimeout(done, (end - ctx.currentTime) * 1000 + 50);
      this.endTime = end;
    }

    _envAt(t) {
      const dt = t - this.start, a = Math.max(0.004, this.P.attack) + 0.003;
      const target = this.wgNode ? this.peak * 3.0 : this.peak * this.toneLevel;
      if (this.wgNode) return dt < 0.003 ? target * dt / 0.003 : target;
      return dt <= 0.003 ? 0 : dt < a ? target * 1.05 * (dt - 0.003) / (a - 0.003) : target;
    }

    dispose() {
      if (this.disposed) return;
      this.disposed = true;
      if (this.wgNode) { try { this.wgNode.port.postMessage('stop'); } catch (e) { /* ignore */ } }
      for (const n of this.nodes) { try { n.disconnect(); } catch (e) { /* ignore */ } }
      this.synth._forget(this);
    }
  }

  // ------------------------------------------------------------------------
  // RecorderSynth: public API
  // ------------------------------------------------------------------------
  class RecorderSynth {
    /** Create and prepare a synth. Always await this (it loads the worklet if needed). */
    static async create(ctx, options = {}) {
      const s = new RecorderSynth(ctx, options);
      await s.setEngine(s.params.engine);
      return s;
    }

    constructor(ctx, options = {}) {
      this.ctx = ctx;
      this.params = Object.assign({}, DEFAULTS, options);
      this.voices = new Set();
      this.byNote = new Map();
      this.workletOk = false;
      this.engine = 'spectral';

      // voices -> bus -> body EQ -> dry + reverb -> master -> limiter -> output
      this.bus = ctx.createGain();
      this.eq = [];
      this.dry = ctx.createGain();
      this.wet = ctx.createGain();
      this.convolver = ctx.createConvolver();
      this.convolver.buffer = getShared(ctx).ir;
      this.master = ctx.createGain();
      this.limiter = ctx.createDynamicsCompressor();
      this.limiter.threshold.value = -10; this.limiter.knee.value = 8;
      this.limiter.ratio.value = 6; this.limiter.attack.value = 0.003; this.limiter.release.value = 0.15;
      this.output = ctx.createGain();
      this.eqOut = ctx.createGain();
      this.eqOut.connect(this.dry); this.eqOut.connect(this.convolver);
      this.convolver.connect(this.wet);
      this.dry.connect(this.master); this.wet.connect(this.master);
      this.master.connect(this.limiter); this.limiter.connect(this.output);
      this._buildEQ();
      this._applyMix();
    }

    connect(dest) { this.output.connect(dest); return dest; }
    disconnect() { this.output.disconnect(); }

    get engines() { return ENGINES.slice(); }

    /** Switch engine. Returns the engine actually in use ('waveguide' falls back to 'spectral'). */
    async setEngine(name) {
      if (!ENGINES.includes(name)) throw new Error('Unknown engine: ' + name);
      if (name === 'waveguide' && !this.workletOk) {
        try { await loadWorklet(this.ctx); this.workletOk = true; }
        catch (e) { console.warn('[RecorderSynth] waveguide unavailable, using spectral:', e.message); name = 'spectral'; }
      }
      this.engine = name;
      this.params.engine = name;
      return name;
    }

    setTimbre(name) { if (!TIMBRES[name]) throw new Error('Unknown timbre: ' + name); this.params.timbre = name; this._buildEQ(); }

    /** Set any parameter from DEFAULTS. Applies to notes started afterwards (volume/reverb apply now). */
    set(name, value) {
      if (name === 'engine') return this.setEngine(value);
      if (name === 'timbre') return this.setTimbre(value);
      if (!(name in DEFAULTS)) throw new Error('Unknown parameter: ' + name);
      this.params[name] = value;
      if (name === 'reverb' || name === 'volume') this._applyMix();
    }
    get(name) { return this.params[name]; }

    _noteToMidi(note) {
      const size = SIZES[this.params.size] || SIZES.soprano;
      return note + (this.params.writtenPitch ? size.written : 0) + (this.params.transpose || 0);
    }

    /** Start a note. `note` is MIDI (60 = middle C). velocity 0..1. Returns the voice. */
    noteOn(note, velocity = 0.8, when) {
      const ctx = this.ctx;
      when = Math.max(when == null ? ctx.currentTime : when, ctx.currentTime);
      const midi = this._noteToMidi(note);
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

    /** Release the most recent voice started on `note`. */
    noteOff(note, when) {
      const list = this.byNote.get(note);
      if (!list || !list.length) return;
      const v = list.shift();
      if (!list.length) this.byNote.delete(note);
      v.release(when == null ? this.ctx.currentTime : when);
    }

    /** Convenience for sequencers: play `note` for `duration` seconds starting at `when`. */
    playNote(note, duration = 0.5, velocity = 0.8, when) {
      const t = Math.max(when == null ? this.ctx.currentTime : when, this.ctx.currentTime);
      const v = this.noteOn(note, velocity, t);
      const list = this.byNote.get(note);
      if (list) { const i = list.indexOf(v); if (i >= 0) list.splice(i, 1); if (!list.length) this.byNote.delete(note); }
      const offAt = t + Math.max(0.03, duration);
      if (this.params.mono) {
        // in mono mode a later overlapping note re-uses this voice; only release if still on this note
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

    _buildEQ() {
      const ctx = this.ctx;
      try { this.bus.disconnect(); } catch (e) { /* ignore */ }
      for (const f of this.eq) { try { f.disconnect(); } catch (e) { /* ignore */ } }
      this.eq = (TIMBRES[this.params.timbre] || TIMBRES.wood).eq.map(b => {
        const f = ctx.createBiquadFilter();
        f.type = b.type; f.frequency.value = b.f; f.gain.value = b.gain; if (b.q) f.Q.value = b.q;
        return f;
      });
      let prev = this.bus;
      for (const f of this.eq) { prev.connect(f); prev = f; }
      prev.connect(this.eqOut);
    }

    _applyMix() {
      const r = clamp(this.params.reverb, 0, 1), t = this.ctx.currentTime;
      const to = (param, v) => { param.cancelScheduledValues(t); param.setValueAtTime(param.value, t); param.setTargetAtTime(v, t, 0.02); };
      to(this.dry.gain, 1 - 0.35 * r);
      to(this.wet.gain, r * 0.55);
      to(this.master.gain, clamp(this.params.volume, 0, 1.5) / 0.8);
    }
  }

  RecorderSynth.ENGINES = ENGINES;
  RecorderSynth.SIZES = SIZES;
  RecorderSynth.TIMBRES = Object.keys(TIMBRES);
  RecorderSynth.DEFAULTS = Object.assign({}, DEFAULTS);
  RecorderSynth.WORKLET_SOURCE = WORKLET_SRC;
  RecorderSynth.mtof = mtof;

  global.RecorderSynth = RecorderSynth;
  if (typeof module !== 'undefined' && module.exports) module.exports = RecorderSynth;
})(typeof window !== 'undefined' ? window : globalThis);

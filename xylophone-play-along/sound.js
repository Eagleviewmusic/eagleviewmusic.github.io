/* The Rainbow Xylophone's sound, copied from its engine: a vibraphone and a marimba built from
   oscillators, through a compressor. Volume 0–1 scales the master level (0.7 = the Rainbow
   Xylophone's own level). */
window.XyloSound = class XyloSound {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.ringing = new Map();
    this.instrument = 'vibraphone';
    this.level = 0.28;
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC({ sampleRate: 44100, latencyHint: 'interactive' });
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 12;
      comp.connect(this.ctx.destination);
      this.master = this.ctx.createGain();
      this.master.gain.value = this.level;
      this.master.connect(comp);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  setVolume(v) {
    this.level = 0.4 * v;
    if (this.master) this.master.gain.setTargetAtTime(this.level, this.ctx.currentTime, 0.02);
  }

  play(id, freq) {
    this.init();
    this.stop(id);
    if (this.instrument === 'marimba') this.marimba(id, freq);
    else this.vibraphone(id, freq);
  }

  vibraphone(id, f) {
    const c = this.ctx, t = c.currentTime;
    const body = c.createOscillator();
    body.type = 'sine';
    body.frequency.setValueAtTime(f, t);
    const bodyGain = c.createGain();
    bodyGain.gain.setValueAtTime(1e-4, t);
    bodyGain.gain.exponentialRampToValueAtTime(1, t + 0.006);
    bodyGain.gain.exponentialRampToValueAtTime(0.5, t + 0.35);
    bodyGain.gain.exponentialRampToValueAtTime(0.18, t + 0.95);
    bodyGain.gain.exponentialRampToValueAtTime(0.04, t + 1.8);
    bodyGain.gain.exponentialRampToValueAtTime(1e-4, t + 2.8);
    const tick = c.createOscillator();
    tick.type = 'triangle';
    tick.frequency.setValueAtTime(f * 2, t);
    const tickGain = c.createGain();
    tickGain.gain.setValueAtTime(1e-4, t);
    tickGain.gain.exponentialRampToValueAtTime(0.05, t + 0.006);
    tickGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.045);
    body.connect(bodyGain); bodyGain.connect(this.master);
    tick.connect(tickGain); tickGain.connect(this.master);
    body.start(t); tick.start(t);
    tick.stop(t + 0.05); body.stop(t + 2.9);
    this.hold(id, { oscs: [body, tick], gains: [bodyGain, tickGain], main: bodyGain }, 2950);
  }

  marimba(id, f) {
    const c = this.ctx, t = c.currentTime;
    const body = c.createOscillator();
    body.type = 'sine';
    body.frequency.setValueAtTime(f, t);
    const bodyGain = c.createGain();
    bodyGain.gain.setValueAtTime(1e-4, t);
    bodyGain.gain.exponentialRampToValueAtTime(1, t + 0.003);
    bodyGain.gain.exponentialRampToValueAtTime(0.28, t + 0.06);
    bodyGain.gain.exponentialRampToValueAtTime(0.08, t + 0.16);
    bodyGain.gain.exponentialRampToValueAtTime(0.015, t + 0.32);
    bodyGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.48);
    const overtone = c.createOscillator();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(f * 4, t);
    const overGain = c.createGain();
    overGain.gain.setValueAtTime(1e-4, t);
    overGain.gain.exponentialRampToValueAtTime(0.18, t + 0.003);
    overGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.075);
    const knock = c.createOscillator();
    knock.type = 'triangle';
    knock.frequency.setValueAtTime(f * 3.2, t);
    knock.frequency.exponentialRampToValueAtTime(Math.max(f * 0.8, 80), t + 0.022);
    const knockGain = c.createGain();
    knockGain.gain.setValueAtTime(1e-4, t);
    knockGain.gain.exponentialRampToValueAtTime(0.3, t + 0.002);
    knockGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.025);
    body.connect(bodyGain); bodyGain.connect(this.master);
    overtone.connect(overGain); overGain.connect(this.master);
    knock.connect(knockGain); knockGain.connect(this.master);
    body.start(t); overtone.start(t); knock.start(t);
    knock.stop(t + 0.03); overtone.stop(t + 0.08); body.stop(t + 0.52);
    this.hold(id, { oscs: [body, overtone, knock], gains: [bodyGain, overGain, knockGain], main: bodyGain }, 550);
  }

  hold(id, voice, ms) {
    this.ringing.set(id, voice);
    setTimeout(() => {
      if (this.ringing.get(id) !== voice) return;
      try { voice.gains.forEach(g => g.disconnect()); } catch (e) {}
      this.ringing.delete(id);
    }, ms);
  }

  /* a quick damp, so striking a ringing bar again starts it fresh */
  stop(id) {
    const v = this.ringing.get(id);
    if (!v) return;
    const t = this.ctx.currentTime, g = v.main.gain;
    try {
      if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(t);
      else { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); }
      g.setTargetAtTime(0, t, 0.004);
      v.oscs.forEach(o => { try { o.stop(t + 0.02); } catch (e) {} });
      setTimeout(() => { try { v.gains.forEach(x => x.disconnect()); } catch (e) {} }, 40);
    } catch (e) {}
    this.ringing.delete(id);
  }
};

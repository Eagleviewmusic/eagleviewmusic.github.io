// Solfege Tower — one AudioContext shared by both towers.
// Each tower keeps the voice and output chain of the app it came from, so it sounds
// exactly as it did on its own: the melody uses Melody Tower's "speaker-friendly"
// master chain, the chords use Chord Tower's compressor.
window.ST = window.ST || {};
ST.audio = (function () {
  const AC = window.AudioContext || window.webkitAudioContext;
  const context = new AC();

  const waveforms = ['sine', 'triangle', 'square', 'sawtooth', 'voice'];
  // Each synth carries its own waveform, so the two towers can sound different together.

  // Custom "voice" wave (same partials in both original apps)
  const harmonics = 20;
  const real = new Float32Array(harmonics);
  const imag = new Float32Array(harmonics);
  real[1] = 1; real[2] = 0.15; real[3] = 0.1; real[4] = 0.05;
  const customVoiceWave = context.createPeriodicWave(real, imag);

  // --- Melody master chain (Melody Tower) ---
  const mixBus = context.createGain();
  mixBus.gain.value = 0.8;
  const masterHP = context.createBiquadFilter();
  masterHP.type = 'highpass'; masterHP.frequency.value = 100; masterHP.Q.value = 0.7;
  const masterLP = context.createBiquadFilter();
  masterLP.type = 'lowpass'; masterLP.frequency.value = 10000; masterLP.Q.value = 0.7;
  const melodyCompressor = context.createDynamicsCompressor();
  melodyCompressor.threshold.value = -24; melodyCompressor.knee.value = 30; melodyCompressor.ratio.value = 4;
  melodyCompressor.attack.value = 0.01; melodyCompressor.release.value = 0.25;
  const masterGain = context.createGain();
  masterGain.gain.value = 0.9;
  mixBus.connect(masterHP); masterHP.connect(masterLP); masterLP.connect(melodyCompressor);
  melodyCompressor.connect(masterGain); masterGain.connect(context.destination);

  // --- Chord chain (Chord Tower) ---
  const chordCompressor = context.createDynamicsCompressor();
  chordCompressor.threshold.value = -24; chordCompressor.knee.value = 30; chordCompressor.ratio.value = 12;
  chordCompressor.attack.value = 0.003; chordCompressor.release.value = 0.25;
  chordCompressor.connect(context.destination);
  const CHORD_VOLUME = 0.36;   // Chord Tower had 0.4; 10% quieter beside the melody

  function resume() {
    if (context.state !== 'running') { try { context.resume(); } catch (e) {} }
  }

  // ---------- Melody voices ----------
  const MAX_POLYPHONY = 16;
  class MelodySynth {
    constructor() { this.active = {}; this.queue = []; this.onSteal = null; this.waveform = 'triangle'; }
    start(id, freq) {
      const waveform = this.waveform;
      if (Object.keys(this.active).length >= MAX_POLYPHONY) {
        const oldest = this.queue.shift();
        if (oldest && this.active[oldest]) {
          if (this.onSteal) this.onSteal(oldest);
          this.stop(oldest, true);
        }
      }
      this.stop(id);
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      let lfo = null, lfoGain = null;
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(8000, now);
      filter.Q.value = 0.7;
      if (waveform === 'voice') {
        osc.setPeriodicWave(customVoiceWave);
        lfo = context.createOscillator();
        lfoGain = context.createGain();
        lfo.frequency.setValueAtTime(1.5, now);
        lfo.frequency.linearRampToValueAtTime(5, now + 1);
        lfoGain.gain.setValueAtTime(2.0, now);
        lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
        lfo.start();
      } else {
        osc.type = waveform;
      }
      osc.frequency.value = freq;
      const count = Object.keys(this.active).length + 1;
      const peak = Math.min(0.2, 0.6 / count);
      const attack = 0.02, decay = 0.1, sustain = 0.7;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peak, now + attack);
      gain.gain.linearRampToValueAtTime(peak * sustain, now + attack + decay);
      osc.connect(filter); filter.connect(gain); gain.connect(mixBus);
      osc.start();
      this.active[id] = { osc, gain, lfo };
      this.queue.push(id);
    }
    stop(id, stolen) {
      const a = this.active[id];
      if (!a) return;
      const now = context.currentTime;
      const release = 0.3, stopBuffer = 0.01;
      a.gain.gain.cancelScheduledValues(now);
      a.gain.gain.setValueAtTime(a.gain.gain.value, now);
      a.gain.gain.linearRampToValueAtTime(0, now + release);
      a.osc.stop(now + release + stopBuffer);
      if (a.lfo) a.lfo.stop(now + release + stopBuffer);
      delete this.active[id];
      if (!stolen) {
        const i = this.queue.indexOf(id);
        if (i > -1) this.queue.splice(i, 1);
      }
    }
    stopAll() { Object.keys(this.active).forEach(id => this.stop(id)); }
  }

  // ---------- Chord voices ----------
  class ChordSynth {
    constructor() { this.active = {}; this.waveform = 'triangle'; }
    start(id, freqs) {
      const waveform = this.waveform;
      this.stop(id);
      const now = context.currentTime;
      const voices = [];
      freqs.forEach(freq => {
        if (!freq) return;
        const osc = context.createOscillator();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();
        let lfo = null;
        gain.gain.setValueAtTime(0, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.Q.value = 1;
        if (waveform === 'voice') {
          osc.setPeriodicWave(customVoiceWave);
          lfo = context.createOscillator();
          const lfoGain = context.createGain();
          lfo.frequency.setValueAtTime(1.5, now);
          lfo.frequency.linearRampToValueAtTime(5, now + 1);
          lfoGain.gain.setValueAtTime(2.0, now);
          lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
          lfo.start();
          const attack = 0.08, decay = 0.18;
          gain.gain.linearRampToValueAtTime(CHORD_VOLUME * 0.85, now + attack);
          gain.gain.linearRampToValueAtTime(CHORD_VOLUME * 0.5, now + attack + decay);
        } else {
          osc.type = waveform;
          gain.gain.linearRampToValueAtTime(CHORD_VOLUME / freqs.length, now + 0.015);
        }
        osc.frequency.value = freq;
        osc.connect(filter); filter.connect(gain); gain.connect(chordCompressor);
        osc.start();
        voices.push({ osc, gain, lfo, voice: waveform === 'voice' });
      });
      this.active[id] = voices;
    }
    stop(id, quick) {     // quick: the chord is about to be re-struck a semitone away
      const voices = this.active[id];
      if (!voices) return;
      const now = context.currentTime;
      voices.forEach(v => {
        v.gain.gain.cancelScheduledValues(now);
        v.gain.gain.setValueAtTime(v.gain.gain.value, now);
        if (quick) {
          v.gain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
          v.osc.stop(now + 0.1);
          if (v.lfo) v.lfo.stop(now + 0.1);
        } else if (v.voice) {
          v.gain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
          v.osc.stop(now + 0.7);
          if (v.lfo) v.lfo.stop(now + 0.7);
        } else {
          v.gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          v.osc.stop(now + 1.3);
        }
      });
      delete this.active[id];
    }
    stopAll() { Object.keys(this.active).forEach(id => this.stop(id)); }
  }

  return { context, waveforms, resume, MelodySynth, ChordSynth };
})();

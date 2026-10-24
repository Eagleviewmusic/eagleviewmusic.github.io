/* ==========================================================================
   Recording Studio — voice-tap.js (an AudioWorklet)
   The microphone, sample by sample, on the studio's own audio clock: every
   2048 frames it posts the samples, the frame they began at (currentFrame,
   the clock every track is scheduled on), their peak and their RMS, for
   the meter and the room-noise estimate.

   It is fed up to two channels. A basic microphone is mono, but Safari can
   hand a mono microphone over as a stereo track with sound in the left
   channel only, and a webcam may carry two capsules; averaging the two
   would lose 6 dB in the first case. So the tap listens to both, keeps a
   running energy for each, and passes on the louder one (switching only
   when the other is 10 dB louder, so a true stereo pair does not flicker).
   Loaded by voice.js with audioWorklet.addModule().
   ========================================================================== */
const SIZE = 2048;
const DECAY = 0.9995;       // per 128-frame block: energies remember about the last 5 seconds

class VoiceTap extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(SIZE);
    this.n = 0;
    this.start = 0;
    this.peak = 0;
    this.sq = 0;              // sum of squares, for the RMS
    this.e = [0, 0];          // running energy per channel
    this.pick = 0;            // the channel passed on
    this.chs = 0;
  }

  process(inputs) {
    const input = inputs[0];
    const chs = input ? input.length : 0;
    const len = chs ? input[0].length : 128;
    if (this.n === 0) this.start = currentFrame;
    if (chs) {
      this.chs = chs;
      if (chs > 1) {
        let e0 = 0, e1 = 0;
        const a = input[0], b = input[1];
        for (let i = 0; i < len; i++) { e0 += a[i] * a[i]; e1 += b[i] * b[i]; }
        this.e[0] = this.e[0] * DECAY + e0;
        this.e[1] = this.e[1] * DECAY + e1;
        const other = 1 - this.pick;
        if (this.e[other] > this.e[this.pick] * 10 && this.e[other] > 1e-6) this.pick = other;
      } else this.pick = 0;
      const ch = input[Math.min(this.pick, chs - 1)];
      this.buf.set(ch, this.n);
      for (let i = 0; i < len; i++) {
        const x = ch[i], a = x < 0 ? -x : x;
        if (a > this.peak) this.peak = a;
        this.sq += x * x;
      }
    } else {
      this.buf.fill(0, this.n, this.n + len);
    }
    this.n += len;
    if (this.n >= SIZE) {
      this.port.postMessage({ frame: this.start, data: this.buf, peak: this.peak, rms: Math.sqrt(this.sq / SIZE), ch: this.pick, chs: this.chs }, [this.buf.buffer]);
      this.buf = new Float32Array(SIZE);
      this.n = 0;
      this.peak = 0;
      this.sq = 0;
    }
    return true;
  }
}

registerProcessor('voice-tap', VoiceTap);

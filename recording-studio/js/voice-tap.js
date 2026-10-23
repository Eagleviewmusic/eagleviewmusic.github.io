/* ==========================================================================
   Recording Studio — voice-tap.js (an AudioWorklet)
   The microphone, sample by sample, on the studio's own audio clock: every
   2048 frames it posts the samples, the frame they began at (currentFrame,
   the clock every track is scheduled on) and their peak, for the meter.
   Loaded by voice.js with audioWorklet.addModule().
   ========================================================================== */
const SIZE = 2048;

class VoiceTap extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Float32Array(SIZE);
    this.n = 0;
    this.start = 0;
    this.peak = 0;
  }

  process(inputs) {
    const input = inputs[0];
    const ch = input && input[0];
    const len = ch ? ch.length : 128;
    if (this.n === 0) this.start = currentFrame;
    if (ch) {
      this.buf.set(ch, this.n);
      for (let i = 0; i < len; i++) {
        const a = ch[i] < 0 ? -ch[i] : ch[i];
        if (a > this.peak) this.peak = a;
      }
    } else {
      this.buf.fill(0, this.n, this.n + len);
    }
    this.n += len;
    if (this.n >= SIZE) {
      this.port.postMessage({ frame: this.start, data: this.buf, peak: this.peak }, [this.buf.buffer]);
      this.buf = new Float32Array(SIZE);
      this.n = 0;
      this.peak = 0;
    }
    return true;
  }
}

registerProcessor('voice-tap', VoiceTap);

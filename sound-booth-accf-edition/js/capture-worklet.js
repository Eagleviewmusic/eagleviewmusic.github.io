/* ==========================================================================
   Sound Booth-ACCF Edition — capture-worklet.js (an AudioWorklet)
   The microphone, sample by sample, untouched, on the same clock the tracks
   are scheduled on. A take starts on an exact frame, so what was recorded can
   be placed exactly against what was playing.

   Up to two input channels come through as they are. Which one is the voice
   is decided when the take ends (a two-input interface may have the singer on
   either; averaging would lose 6 dB to a silent channel).
   ========================================================================== */
const CHUNK = 4096;   // frames per message while recording (about 85 ms)
const METER = 1024;   // frames per level reading (about 47 a second)

class VocalCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.mp = [0, 0];
    this.ms = [0, 0];
    this.mn = 0;
    this.rec = null;
    this.port.onmessage = e => {
      const m = e.data;
      if (m.cmd === 'start') {
        this.rec = { id: m.id, from: m.from, first: -1, a: new Float32Array(CHUNK), b: new Float32Array(CHUNK), n: 0, chs: 1 };
      } else if (m.cmd === 'stop' && this.rec && this.rec.id === m.id) {
        this.flush();
        this.port.postMessage({ type: 'end', id: m.id });
        this.rec = null;
      }
    };
  }

  flush() {
    const r = this.rec;
    if (!r || !r.n) return;
    const msg = { type: 'chunk', id: r.id, first: r.first, n: r.n, chs: r.chs, a: r.a, b: r.chs > 1 ? r.b : null };
    this.port.postMessage(msg, r.chs > 1 ? [r.a.buffer, r.b.buffer] : [r.a.buffer]);
    r.a = new Float32Array(CHUNK);
    r.b = new Float32Array(CHUNK);
    r.n = 0;
  }

  process(inputs) {
    const input = inputs[0];
    const chs = input ? input.length : 0;
    const len = chs ? input[0].length : 128;
    const a = chs > 0 ? input[0] : null;
    const b = chs > 1 ? input[1] : null;

    // the level, every channel, whether or not a take is running
    for (let c = 0; c < Math.min(chs, 2); c++) {
      const x = input[c];
      let p = this.mp[c], s = this.ms[c];
      for (let i = 0; i < len; i++) {
        const v = x[i], av = v < 0 ? -v : v;
        if (av > p) p = av;
        s += v * v;
      }
      this.mp[c] = p; this.ms[c] = s;
    }
    this.mn += len;
    if (this.mn >= METER) {
      this.port.postMessage({
        type: 'meter', chs,
        p0: this.mp[0], p1: this.mp[1],
        r0: Math.sqrt(this.ms[0] / this.mn), r1: Math.sqrt(this.ms[1] / this.mn)
      });
      this.mp[0] = this.mp[1] = this.ms[0] = this.ms[1] = 0;
      this.mn = 0;
    }

    // the take
    const r = this.rec;
    if (r) {
      let i = 0;
      if (currentFrame < r.from) i = r.from - currentFrame;
      if (i < len) {
        if (r.first < 0) r.first = currentFrame + i;
        if (b) r.chs = 2;
        while (i < len) {
          const k = Math.min(len - i, CHUNK - r.n);
          if (a) r.a.set(a.subarray(i, i + k), r.n);
          if (b) r.b.set(b.subarray(i, i + k), r.n);
          r.n += k;
          i += k;
          if (r.n === CHUNK) this.flush();
        }
      }
    }
    return true;
  }
}

registerProcessor('vocal-capture', VocalCapture);

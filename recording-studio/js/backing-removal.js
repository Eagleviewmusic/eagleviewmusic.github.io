/* ==========================================================================
   Recording Studio — backing-removal.js
   Taking the speakers' sound back out of a voice take.

   The studio knows exactly what it sent to the speakers (the reference,
   tapped from StudioBus). What the microphone hears of it is that sound
   delayed and reshaped by the speakers, the room and the microphone — a
   path that hardly changes during a take. So: play a short sweep with the
   singer quiet, learn the path (an impulse response, delay included) by
   dividing the microphone's spectrum by the reference's, then for a take
   predict the echo by convolving the whole reference with that response
   and subtract it. The filter is fixed before the take, so it cannot learn
   the singer and takes nothing from their voice. The measure of success is
   ERLE: how many dB the playback-only part of a take went down by.

   window.BackingRemoval = { makeSweep, estimateIR, predictEcho, erleDb, irDelay, firstAbove }
   ========================================================================== */
const BackingRemoval = (() => {
  'use strict';

  // A log sweep f1 → f2, with short fades, as an AudioBuffer on `ctx`.
  function makeSweep(ctx, seconds, f1, f2, level) {
    seconds = seconds || 1.5; f1 = f1 || 80; f2 = f2 || 16000; level = level == null ? 0.5 : level;
    const sr = ctx.sampleRate;
    const n = Math.round(seconds * sr);
    const buf = ctx.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    const k = Math.log(f2 / f1);
    const fade = Math.round(0.05 * sr);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      const phase = 2 * Math.PI * f1 * seconds / k * (Math.exp(t / seconds * k) - 1);
      let g = level;
      if (i < fade) g *= i / fade; else if (i > n - fade) g *= (n - i) / fade;
      d[i] = g * Math.sin(phase);
    }
    return buf;
  }

  // In-place radix-2 FFT on Float64Array re/im (length a power of two).
  function fft(re, im, inverse) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = (2 * Math.PI / len) * (inverse ? 1 : -1);
      const wr = Math.cos(ang), wi = Math.sin(ang), half = len / 2;
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0;
        for (let k = 0; k < half; k++) {
          const a = i + k, b = a + half;
          const vr = re[b] * cr - im[b] * ci, vi = re[b] * ci + im[b] * cr;
          re[b] = re[a] - vr; im[b] = im[a] - vi;
          re[a] += vr;        im[a] += vi;
          const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
        }
      }
    }
    if (inverse) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }

  /* The speaker-to-microphone impulse response (delay included), learned
     from a window where only the reference was sounding:
     H = conj(X)·M / (|X|² + λ), λ a small share of the mean power. */
  function estimateIR(ref, mic, irLen, reg) {
    reg = reg || 1e-3;
    let n = 1; while (n < ref.length + irLen) n <<= 1;
    const xr = new Float64Array(n), xi = new Float64Array(n);
    const mr = new Float64Array(n), mi = new Float64Array(n);
    xr.set(ref); mr.set(mic);
    fft(xr, xi, false); fft(mr, mi, false);
    let p = 0; for (let k = 0; k < n; k++) p += xr[k] * xr[k] + xi[k] * xi[k];
    const lambda = reg * p / n;
    const hr = new Float64Array(n), hi = new Float64Array(n);
    for (let k = 0; k < n; k++) {
      const d = xr[k] * xr[k] + xi[k] * xi[k] + lambda;
      hr[k] = (xr[k] * mr[k] + xi[k] * mi[k]) / d;
      hi[k] = (xr[k] * mi[k] - xi[k] * mr[k]) / d;
    }
    fft(hr, hi, true);
    return Float32Array.from(hr.subarray(0, irLen));
  }

  // The predicted echo of `ref` through `ir`, by fast native convolution.
  async function predictEcho(ref, ir, sr) {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const off = new OAC(1, ref.length + ir.length, sr);
    const src = off.createBufferSource();
    const rb = off.createBuffer(1, ref.length, sr); rb.copyToChannel(ref, 0);
    src.buffer = rb;
    const conv = off.createConvolver();
    conv.normalize = false;                           // must precede setting the buffer
    const ib = off.createBuffer(1, ir.length, sr); ib.copyToChannel(ir, 0);
    conv.buffer = ib;
    src.connect(conv); conv.connect(off.destination);
    src.start();
    return (await off.startRendering()).getChannelData(0);
  }

  function firstAbove(x, thr) { thr = thr || 1e-3; for (let i = 0; i < x.length; i++) if (Math.abs(x[i]) > thr) return i; return -1; }

  // 10·log10(echo power / residual power) over the same window.
  function erleDb(mic, clean) {
    let pm = 0, pc = 0;
    for (let i = 0; i < mic.length; i++) { pm += mic[i] * mic[i]; pc += clean[i] * clean[i]; }
    return 10 * Math.log10((pm + 1e-12) / (pc + 1e-12));
  }

  /* The path can shift a little between the sweep and a take — a stream's
     buffering, Bluetooth, a nudged volume. Over a window where only the
     speakers sounded, find the lag (±maxLag samples) and the gain that fit
     the predicted echo to the microphone best; null when nothing fits. */
  function fitEcho(mic, echo, a, b, maxLag, center) {
    center = center || 0;
    const dot = L => { let s = 0; for (let i = a; i < b; i++) { const j = i - L; if (j >= 0 && j < echo.length) s += mic[i] * echo[j]; } return s; };
    let best = 0, bestL = center;
    for (let L = center - maxLag; L <= center + maxLag; L += 8) { const s = dot(L); if (s > best) { best = s; bestL = L; } }
    for (let L = bestL - 7; L <= bestL + 7; L++) { if (Math.abs(L - center) > maxLag) continue; const s = dot(L); if (s > best) { best = s; bestL = L; } }
    if (best <= 0) return null;
    let ee = 0; for (let i = a; i < b; i++) { const j = i - bestL; if (j >= 0 && j < echo.length) ee += echo[j] * echo[j]; }
    if (ee <= 0) return null;
    const gain = best / ee;
    if (!(gain > 0.2 && gain < 5)) return null;
    return { lag: bestL, gain };
  }

  /* How well the backing came out, with no need for the singer to be silent
     anywhere: ERLE in quarter-second blocks where the predicted echo carries
     energy. The 90th percentile is the figure (the pauses between phrases
     show the true one); the median says whether it helped at all. */
  function blockErle(mic, clean, echo, rate) {
    const w = Math.round(0.25 * rate);
    const es = [];
    let eMax = 0;
    for (let a = 0; a + w <= mic.length; a += w) {
      let pe = 0;
      for (let i = a; i < a + w; i++) pe += echo[i] * echo[i];
      es.push(pe);
      if (pe > eMax) eMax = pe;
    }
    const vals = [];
    es.forEach((pe, k) => {
      if (pe < eMax * 0.01) return;
      const a = k * w;
      let pm = 0, pc = 0;
      for (let i = a; i < a + w; i++) { pm += mic[i] * mic[i]; pc += clean[i] * clean[i]; }
      vals.push(10 * Math.log10((pm + 1e-12) / (pc + 1e-12)));
    });
    if (!vals.length) return null;
    vals.sort((x, y) => x - y);
    return { best: vals[Math.floor(vals.length * 0.9)], median: vals[vals.length >> 1], blocks: vals.length };
  }

  /* How late the speakers reach the microphone in THIS take, from the take
     itself: the onsets of what the microphone heard against the onsets of
     what was sent (1 ms envelopes, so the singer's own sound hardly counts),
     then the raw signals within ±2 ms of that. Null when the speakers were
     not heard in the take (headphones, nothing playing, too faint). */
  function measureDelay(mic, ref, sr, maxMs) {
    maxMs = maxMs || 600;
    const w = Math.round(sr / 1000);
    const n = Math.floor(Math.min(mic.length, ref.length) / w);
    if (n < 800) return null;
    const env = x => { const e = new Float32Array(n); for (let k = 0; k < n; k++) { let s = 0; for (let i = k * w; i < (k + 1) * w; i++) s += x[i] * x[i]; e[k] = Math.sqrt(s / w); } return e; };
    const onset = e => { const o = new Float32Array(n); for (let k = 3; k < n; k++) { const d = Math.log(e[k] + 1e-5) - Math.log(e[k - 3] + 1e-5); o[k] = d > 0 ? d : 0; } return o; };
    const om = onset(env(mic)), or = onset(env(ref));
    let mm = 0, rr = 0;
    for (let k = 0; k < n; k++) { mm += om[k] * om[k]; rr += or[k] * or[k]; }
    if (rr < 1e-6 || mm < 1e-6) return null;
    const norm = Math.sqrt(mm * rr);
    const scores = new Float32Array(maxMs + 1);
    let best = 0, bestL = 0;
    for (let L = 0; L <= maxMs; L++) {
      let s = 0;
      for (let k = L; k < n; k++) s += om[k] * or[k - L];
      scores[L] = s / norm;
      if (scores[L] > best) { best = scores[L]; bestL = L; }
    }
    const median = Float32Array.from(scores).sort()[maxMs >> 1];
    if (best < 0.1 || best < median * 3 + 0.03) return null;
    // the raw signals, within ±2 ms, over the first 20 s
    const lim = Math.min(mic.length, Math.round(20 * sr));
    let fb = 0, fl = bestL * w;
    for (let lag = Math.max(0, (bestL - 2) * w); lag <= (bestL + 2) * w; lag++) {
      let s = 0;
      for (let i = lag; i < lim; i++) s += mic[i] * ref[i - lag];
      if (s > fb) { fb = s; fl = lag; }
    }
    return { sec: fl / sr, ms: Math.round(fl / sr * 1000), score: best };
  }

  // Where the direct sound lands in the response: the delay, in samples —
  // and how clearly it stands out of the response's noise (peak / rms).
  function irDelay(ir) {
    let k = 0, m = 0, sq = 0;
    for (let i = 0; i < ir.length; i++) { const a = Math.abs(ir[i]); sq += ir[i] * ir[i]; if (a > m) { m = a; k = i; } }
    const rms = Math.sqrt(sq / Math.max(1, ir.length));
    return { at: k, peak: m, clarity: rms > 0 ? m / rms : 0 };
  }

  window.BackingRemoval = { makeSweep, estimateIR, predictEcho, erleDb, irDelay, firstAbove, fitEcho, blockErle, measureDelay };
  return window.BackingRemoval;
})();

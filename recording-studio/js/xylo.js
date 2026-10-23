/* ==========================================================================
   Recording Studio — xylo.js
   The Rainbow Xylophone's two sounds, vibraphone and marimba, from its
   engine (rainbow-xylophone/utils/audio.ts; the Xylophone Basics Play-Along
   keeps the same copy in sound.js) — the same oscillators and envelopes,
   but laid on the clock at any time and on any context: the live one when a
   track plays back, an offline one when the song is saved as a file.

   Its master is the xylophone's own: a gain of 0.28 into a compressor
   (−12 dB, 12 : 1). A bar struck again while it rings is damped first (the
   xylophone's 12 ms crossfade), so a fast repeat never piles up.

   window.Xylo = { bus(ctx, dest), strike(bus, freq, sound, t, level) → voice,
                   ring(sound) }   voice = { damp(t) }
   ========================================================================== */
const Xylo = (() => {
  const LEVEL = 0.28;

  /* The xylophone's master, on a context, into `dest`. */
  function bus(ctx, dest) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.ratio.value = 12;
    comp.connect(dest);
    const master = ctx.createGain();
    master.gain.value = LEVEL;
    master.connect(comp);
    return master;
  }

  // How long each sound rings, in seconds.
  const RING = { vibraphone: 2.9, marimba: 0.52 };
  const ring = sound => RING[sound] || RING.vibraphone;

  /* One bar struck at `t` into `out` (a bus, or a gain in front of one).
     `level` scales it (1 = as the xylophone plays it). */
  function strike(out, freq, sound, t, level) {
    const c = out.context;
    const lv = Math.max(0.001, level == null ? 1 : level);
    const parts = sound === 'marimba' ? marimba(c, freq, t, lv) : vibraphone(c, freq, t, lv);
    parts.gains.forEach(g => g.connect(out));
    parts.oscs.forEach(o => o.start(t));
    parts.stops.forEach(([o, at]) => o.stop(t + at));
    parts.oscs[0].onended = () => { try { parts.gains.forEach(g => g.disconnect()); } catch (e) {} };
    return {
      end: t + ring(sound),
      // a quick damp, so striking the same bar again starts it fresh
      damp(at) {
        const g = parts.main.gain;
        try {
          if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(at);
          else g.cancelScheduledValues(at);
          g.setTargetAtTime(0, at, 0.004);
          parts.oscs.forEach(o => { try { o.stop(at + 0.02); } catch (e) {} });
        } catch (e) {}
      }
    };
  }

  // 1. Vibraphone: metallic, bell-like, a warm ring (~2.8 s)
  function vibraphone(c, f, t, lv) {
    const body = c.createOscillator();
    body.type = 'sine';
    body.frequency.setValueAtTime(f, t);
    const bodyGain = c.createGain();
    bodyGain.gain.setValueAtTime(1e-4, t);
    bodyGain.gain.exponentialRampToValueAtTime(1 * lv, t + 0.006);
    bodyGain.gain.exponentialRampToValueAtTime(0.5 * lv, t + 0.35);
    bodyGain.gain.exponentialRampToValueAtTime(0.18 * lv, t + 0.95);
    bodyGain.gain.exponentialRampToValueAtTime(0.04 * lv, t + 1.8);
    bodyGain.gain.exponentialRampToValueAtTime(1e-4, t + 2.8);
    const tick = c.createOscillator();
    tick.type = 'triangle';
    tick.frequency.setValueAtTime(f * 2, t);
    const tickGain = c.createGain();
    tickGain.gain.setValueAtTime(1e-4, t);
    tickGain.gain.exponentialRampToValueAtTime(0.05 * lv, t + 0.006);
    tickGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.045);
    body.connect(bodyGain);
    tick.connect(tickGain);
    return { oscs: [body, tick], gains: [bodyGain, tickGain], main: bodyGain, stops: [[tick, 0.05], [body, 2.9]] };
  }

  // 2. Marimba: short, hollow wood (~0.5 s)
  function marimba(c, f, t, lv) {
    const body = c.createOscillator();
    body.type = 'sine';
    body.frequency.setValueAtTime(f, t);
    const bodyGain = c.createGain();
    bodyGain.gain.setValueAtTime(1e-4, t);
    bodyGain.gain.exponentialRampToValueAtTime(1 * lv, t + 0.003);
    bodyGain.gain.exponentialRampToValueAtTime(0.28 * lv, t + 0.06);
    bodyGain.gain.exponentialRampToValueAtTime(0.08 * lv, t + 0.16);
    bodyGain.gain.exponentialRampToValueAtTime(0.015 * lv, t + 0.32);
    bodyGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.48);
    const overtone = c.createOscillator();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(f * 4, t);
    const overGain = c.createGain();
    overGain.gain.setValueAtTime(1e-4, t);
    overGain.gain.exponentialRampToValueAtTime(0.18 * lv, t + 0.003);
    overGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.075);
    const knock = c.createOscillator();
    knock.type = 'triangle';
    knock.frequency.setValueAtTime(f * 3.2, t);
    knock.frequency.exponentialRampToValueAtTime(Math.max(f * 0.8, 80), t + 0.022);
    const knockGain = c.createGain();
    knockGain.gain.setValueAtTime(1e-4, t);
    knockGain.gain.exponentialRampToValueAtTime(0.3 * lv, t + 0.002);
    knockGain.gain.exponentialRampToValueAtTime(1e-4, t + 0.025);
    body.connect(bodyGain);
    overtone.connect(overGain);
    knock.connect(knockGain);
    return {
      oscs: [body, overtone, knock], gains: [bodyGain, overGain, knockGain], main: bodyGain,
      stops: [[knock, 0.03], [overtone, 0.08], [body, 0.52]]
    };
  }

  return { bus, strike, ring, SOUNDS: [['vibraphone', 'Vibraphone'], ['marimba', 'Marimba']] };
})();

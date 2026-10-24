/* ==========================================================================
   Recording Studio — bus.js
   One way out to the speakers. Every sound the studio makes on a context —
   the synth's master chain (audio.js), the xylophones and kits (voices.js),
   the metronome (studio.js), the microphone's own test sounds (voice.js) —
   goes through StudioBus.out(ctx), a gain in front of ctx.destination.
   So the studio can listen to exactly what it sent to the speakers: the
   reference a voice take's backing is removed with (voice.js). Loaded first.

   window.StudioBus = { out(ctx) → GainNode }
   ========================================================================== */
const StudioBus = (() => {
  'use strict';
  const outs = new WeakMap();   // context -> its bus
  function out(ctx) {
    let g = outs.get(ctx);
    if (!g) {
      g = ctx.createGain();
      g.connect(ctx.destination);
      outs.set(ctx, g);
    }
    return g;
  }
  window.StudioBus = { out };
  return { out };
})();

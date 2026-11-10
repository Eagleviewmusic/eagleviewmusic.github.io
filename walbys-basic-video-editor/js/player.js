/* ==========================================================================
   Walby's Basic Video Editor — js/player.js
   Playing the project: the audio clips through Web Audio, the canvas redrawn
   from the audio clock so pictures and sound stay together.

   schedule(ctx, dest, from, at) starts every audio clip that is heard from
   project time `from`, with project time `from` landing at ctx time `at` —
   the MP4 export mixes with the same function, so it sounds the same.
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const PL = VE.Player = { playing: false };
  let ctx = null, master = null, nodes = [], t0 = 0, c0 = 0, raf = 0;

  PL.schedule = function (ac, dest, from, at) {
    const out = [];
    const P = VE.P;
    for (const c of P.clips) {
      if (c.kind !== 'audio') continue;
      const tr = VE.track(c.track), r = VE.assets.get(c.asset);
      if (!tr || tr.muted || !r || !r.buffer) continue;
      const end = VE.end(c);
      if (end <= from) continue;
      const src = ac.createBufferSource(), g = ac.createGain();
      src.buffer = r.buffer;
      src.connect(g).connect(dest);
      const lvl = c.gain * tr.volume;
      const T = pt => at + (pt - from);                         // project time → ctx time
      // the fades as a gain line
      const pts = [[c.start, c.fadeIn > 0 ? 0 : lvl]];
      if (c.fadeIn > 0) pts.push([c.start + c.fadeIn, lvl]);
      if (c.fadeOut > 0) pts.push([end - c.fadeOut, lvl], [end, 0]);
      else pts.push([end, lvl]);
      const now = Math.max(from, c.start);
      g.gain.setValueAtTime(lvl * VE.fade(c, now), T(now));
      for (const [pt, v] of pts) if (pt > now) g.gain.linearRampToValueAtTime(v, T(pt));
      const into = c.offset + (now - c.start), len = end - now;
      if (len > 0 && into < r.buffer.duration) src.start(T(now), into, len);
      out.push({ src, g, clip: c });
    }
    return out;
  };

  PL.play = function () {
    if (!VE.P || PL.playing) return;
    if (!ctx) { ctx = new AudioContext({ latencyHint: 'interactive' }); master = ctx.createGain(); master.connect(ctx.destination); }
    ctx.resume();
    const len = VE.length();
    if (len > 0 && VE.time >= len - 0.01) VE.time = 0;
    t0 = VE.time; c0 = ctx.currentTime + 0.06;
    nodes = PL.schedule(ctx, master, t0, c0);
    PL.playing = true;
    VE.emit('playstate');
    tick();
  };
  PL.pause = function () {
    if (!PL.playing) return;
    PL.playing = false;
    cancelAnimationFrame(raf);
    stopNodes();
    VE.emit('playstate');
    VE.emit('time');
  };
  PL.toggle = () => (PL.playing ? PL.pause() : PL.play());
  function stopNodes() {
    for (const n of nodes) { try { n.src.stop(); n.src.disconnect(); n.g.disconnect(); } catch (e) { /* done */ } }
    nodes = [];
  }
  PL.now = () => t0 + Math.max(0, ctx.currentTime - c0 - (ctx.outputLatency || 0));
  function tick() {
    if (!PL.playing) return;
    const t = PL.now(), len = VE.length();
    if (t >= len) { VE.time = len; PL.pause(); return; }
    VE.time = t;
    VE.emit('time');
    raf = requestAnimationFrame(tick);
  }
  /* an edit while playing: start the sound again from here */
  PL.retune = function () {
    if (!PL.playing) return;
    stopNodes();
    t0 = PL.now(); c0 = ctx.currentTime + 0.03;
    nodes = PL.schedule(ctx, master, t0, c0);
  };
  VE.on('project', () => PL.retune());
})();

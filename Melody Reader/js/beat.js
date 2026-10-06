/* ==========================================================================
   Melody Reader — beat.js
   --------------------------------------------------------------------------
   RR.Beat — the count-in run (Melody Reader Design/POINTS-AND-COUNT-IN.md).

   A Test with the metronome on (Slow · Moderate · Fast — the button under
   the music since 2026-10-05; the practice's three tempos) → the family
   count-in (EVMCountIn: prime the sound, the "Get ready 1 2 3 4" card, one
   bar — two in 2/4), then the metronome — the first beat of each bar
   higher — through the melody. The music does not wait. Nothing is drawn
   but the notes lighting as their bars are struck in time: no playhead,
   no words, no ghost notes. The run is the try (tier 3, points.js).
   (Practice has no count-in any more: its metronome is Listen's.)

   A 25 ms timer does all the timing — it places clicks 120 ms ahead on the
   audio clock, marks notes Missed once their window has passed (shown only
   at the end), and ends the run. (Animation frames stop when the tab or
   the app's pane is hidden; a loop run on them froze the mockup's count-in
   for good.)

   A strike is judged by the audio time being *heard* when it happened
   (RR.Sound.eventTime — the event's timeStamp through the output
   timestamp): a child plays to what they hear. It is matched to the
   nearest unplayed note within the OK window:

     Perfect  ≤ max(75 ms, 0.11 beat)    Good  ≤ max(150 ms, 0.22 beat)
     Early / Late  ≤ max(260 ms, 0.38 beat)    beyond that: Missed

   Any other strike is a wrong bar.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$;
  const G = RR.Game;
  let B = null;          // the run in progress
  let token = 0;         // bumped by stop(), so a count-in waiting on prime() knows it was cancelled

  async function start() {
    const s = G.setup;
    if (G.overlay || G.clock || G.phase === 'countin' || G.phase === 'running' || G.phase === 'done') return;
    if (G.stage !== 'game' || !G.metroOn() || G.started) return;   // a Test, the metronome on, the try not begun on its own
    G.stopHear(true);
    if (G.phase !== 'ready' || G.states.some(x => x !== 'todo')) G.resetCard();
    const pace = G.metro, tempo = RR.paceTempo(s, pace);
    G.phase = 'countin';
    G.run = { pace, tempo, wrong: 0 };
    G.started = true;                                     // the run is the try
    RR.Xylo.setGlow(null);
    const my = ++token;
    const CI = window.EVMCountIn;
    const n = CI ? CI.beats(s.time[0]) : Math.max(4, s.time[0]);
    if (CI) CI.open(n, s.time[0]);
    G.draw();
    const ok = await RR.Sound.prime(0.35);
    if (my !== token) return;                             // stopped while the sound woke
    if (!ok) {
      if (CI) CI.close();
      G.resetCard(); G.draw();
      RR.toast("The sound isn't coming through — check the volume, then try again.");
      return;
    }
    const total = G.evs.reduce((a, e) => a + e.t, 0);
    const beat = 60 / tempo, spt = beat / 4;
    const t0 = RR.Sound.now() + 0.12, startT = t0 + n * beat;
    const clicks = [];
    for (let b = 0; b < n; b++) clicks.push({ t: t0 + b * beat, accent: b % s.time[0] === 0 });
    for (let b = 0; b < total / 4; b++) clicks.push({ t: startT + b * beat, accent: b % s.time[0] === 0 });   // the metronome
    const okW = Math.max(0.26, 0.38 * beat);
    const last = G.evs.reduce((a, e) => e.rest ? a : Math.max(a, e.start), 0);
    B = {
      my, n, beat, spt, t0, startT, clicks, ci: 0, timer: null,
      perfect: Math.max(0.075, 0.11 * beat), good: Math.max(0.15, 0.22 * beat), ok: okW,
      // the end: the last note's length, or its window if that is longer (a short last note)
      end: Math.max(startT + total * spt, startT + last * spt + okW) + 0.12,
      flashAt: s.flash ? RR.now() + s.flash * 1000 : null
    };
    if (CI) CI.run(clicks.slice(0, n).map(c => RR.Sound.heardAt(c.t)), RR.Sound.heardAt(startT));
    B.timer = setInterval(tick, 25);
    tick();
  }

  function tick() {
    if (!B) return;
    const now = RR.Sound.now();
    while (B.ci < B.clicks.length && B.clicks[B.ci].t < now + 0.12) {
      const c = B.clicks[B.ci++];
      RR.Sound.click(c.t, c.accent, false);
    }
    const heard = RR.Sound.heardNow();
    if (G.phase === 'countin' && heard >= B.startT - B.beat * 0.45) { G.phase = 'running'; G.drawSides(); }
    if (B.flashAt && RR.now() >= B.flashAt && !G.hidden) { G.hidden = true; B.flashAt = null; G.draw(); }
    // missed notes are only noted — nothing shows until the end
    G.evs.forEach((ev, i) => {
      if (!ev.rest && !G.judge[i] && heard > B.startT + ev.start * B.spt + B.ok) G.judge[i] = 'Missed';
    });
    if (G.phase === 'running' && heard > B.end) {
      stop(true);
      G.hidden = false;
      G.finish();
    }
  }

  function strike(id, e) {
    if (!B) return;
    const at = RR.Sound.eventTime(e);
    let best = null;
    G.evs.forEach((ev, i) => {
      if (ev.rest || G.judge[i]) return;
      const d = at - (B.startT + ev.start * B.spt);
      if (Math.abs(d) <= B.ok && (!best || Math.abs(d) < Math.abs(best.d))) best = { i, d };
    });
    const game = G.stage === 'game';
    if (best && G.evs[best.i].p === id) {
      const a = Math.abs(best.d);
      G.judge[best.i] = a <= B.perfect ? 'Perfect' : a <= B.good ? 'Good' : best.d < 0 ? 'Early' : 'Late';
      G.times[best.i] = at;
      G.lightNote(best.i);
      if (game) G.record(id, G.tries[best.i] === 0);
      G.draw(); G.sparkAtNote(best.i);
    } else {
      // a wrong bar: it only sounds
      G.run.wrong++; G.slips++; G.clean = false;
      if (best) { G.tries[best.i]++; if (game) G.mixup(G.evs[best.i].p, id); }
    }
  }

  /* stop a run (or a count-in still waking the sound); finishing keeps the card */
  function stop(finishing) {
    token++;
    if (B) clearInterval(B.timer);
    const was = !!B || G.phase === 'countin';
    B = null;
    if (window.EVMCountIn) EVMCountIn.close();
    if (was && !finishing && (G.phase === 'countin' || G.phase === 'running')) G.phase = 'ready';
  }

  RR.Beat = {
    start, stop, strike, running: () => !!B,
    /* for tests: when the music starts (audio time) and how long a tick is */
    info: () => B && { startT: B.startT, spt: B.spt, beat: B.beat, windows: [B.perfect, B.good, B.ok] }
  };
})();

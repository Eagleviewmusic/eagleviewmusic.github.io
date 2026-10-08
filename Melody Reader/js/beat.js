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

   Meters and pick-ups (2026-10-07): the clicks are the meter's beats — a
   quarter, or in 6/8 a dotted quarter (two to the bar, so the count is
   1 2 · 1 2). The tempos are quarter notes; in 6/8 the eighths move as
   fast as they do in 4/4 at the same pace (a dotted quarter = 2/3 of the
   BPM). A melody with a pick-up comes in that much before the count's
   last bar line: a beat's pick-up in 4/4 is counted 1 2 3 and played on
   4; an eighth's in 6/8 lands on the last eighth of the count. The
   windows are measured in quarter notes, whatever the meter.

   The practice metronome (2026-10-07, the user's): in Practice, a tempo
   picked starts the click at once — no count-in — on the card's beats, the
   first of each bar higher, and it keeps going while the card is in
   Practice with the metronome on (game.js syncTick decides). Listen joins
   it, coming in on its next bar line. A Test still counts in (above). It
   runs on the same 25 ms timer, each click placed 120 ms ahead.
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
    const M = RR.meter(G.card.time), pick = G.card.pickup || 0;
    const n = CI ? CI.beats(M.beats) : Math.max(4, M.beats);        // the count: a bar (two of 2/4 or 6/8)
    const lead = n * M.beatTicks - pick;                           // ticks of count before the music
    const shown = Math.ceil(lead / M.beatTicks);                    // the count's numbers that come before it
    if (CI) CI.open(shown, M.beats);
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
    const spt = 60 / tempo / 4, beat = M.beatTicks * spt, quarter = 4 * spt;
    const t0 = RR.Sound.now() + 0.12, startT = t0 + lead * spt;
    // every beat from the count's first to the melody's end, on the bar's grid; the first of each bar higher
    const clicks = [];
    for (let b = 0; t0 + b * beat < startT + total * spt - 1e-6; b++) clicks.push({ t: t0 + b * beat, accent: b % M.beats === 0 });
    const okW = Math.max(0.26, 0.38 * quarter);
    const last = G.evs.reduce((a, e) => e.rest ? a : Math.max(a, e.start), 0);
    B = {
      my, n, beat, spt, t0, startT, clicks, ci: 0, timer: null,
      perfect: Math.max(0.075, 0.11 * quarter), good: Math.max(0.15, 0.22 * quarter), ok: okW,
      // the end: the last note's length, or its window if that is longer (a short last note)
      end: Math.max(startT + total * spt, startT + last * spt + okW) + 0.12,
      flashAt: s.flash ? RR.now() + s.flash * 1000 : null
    };
    if (CI) CI.run(clicks.slice(0, shown).map(c => RR.Sound.heardAt(c.t)), RR.Sound.heardAt(startT));
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
    if (G.phase === 'countin' && heard >= B.startT - Math.min(B.beat, 4 * B.spt) * 0.45) { G.phase = 'running'; G.drawSides(); }
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

  /* ---------------- the practice metronome ---------------- */
  let T = null, tPending = null, tToken = 0;
  async function tickStart() {
    tickStop();
    const my = ++tToken, pace = G.metro;
    tPending = pace;
    const ok = await RR.Sound.prime(0.3);
    if (my !== tToken) return;
    tPending = null;
    if (!ok || !G.card) return;
    const M = RR.meter(G.card.time), spt = 60 / RR.paceTempo(G.setup, pace) / 4;
    T = { pace, t0: RR.Sound.now() + 0.08, beat: M.beatTicks * spt, beats: M.beats, n: 0, timer: null };
    T.timer = setInterval(tickRun, 25);
    tickRun();
  }
  function tickRun() {
    if (!T) return;
    const now = RR.Sound.now();
    while (T.t0 + T.n * T.beat < now + 0.12) {
      const t = T.t0 + T.n * T.beat, accent = T.n % T.beats === 0;
      T.n++;
      if (t < now - 0.03) continue;                         // a throttled timer fell behind: skip, never a burst
      RR.Sound.click(t, accent, false);
      const at = RR.Sound.heardAt(t) - performance.now();
      setTimeout(() => { if (T && G.metroBeat) G.metroBeat(accent); }, Math.max(0, at));
    }
  }
  function tickStop() { tToken++; tPending = null; if (T) { clearInterval(T.timer); T = null; } }
  /* the audio time of the click's next bar line at least `lead` seconds from now (null when it isn't running) */
  function tickNextBar(lead) {
    if (!T) return null;
    const bar = T.beat * T.beats, at = RR.Sound.now() + (lead || 0);
    return T.t0 + Math.max(0, Math.ceil((at - T.t0) / bar - 1e-9)) * bar;
  }

  RR.Beat = {
    start, stop, strike, running: () => !!B,
    tickStart, tickStop, tickNextBar, ticking: () => (T ? T.pace : tPending),
    /* for tests: when the music starts (audio time) and how long a tick is */
    info: () => B && { startT: B.startT, spt: B.spt, beat: B.beat, windows: [B.perfect, B.good, B.ok] }
  };
})();

/* ==========================================================================
   Melody Reader — beat.js
   --------------------------------------------------------------------------
   RR.Beat — the count-in run (Melody Reader Design/POINTS-AND-COUNT-IN.md).

   A Test with the metronome on (Slow · Moderate · Fast — the button under
   the music since 2026-10-05; the practice's three tempos) → the family
   count-in (EVMCountIn: prime the sound, the "Get ready 1 2 3 4" card, one
   bar — two in 2/4), then the metronome — the first beat of each bar
   higher — for as long as the run lasts. The run is the try (tier 3,
   points.js).

   FOLLOWING THE PLAYER (2026-10-12, the user's: "it wants the user to play
   exactly at the correct moment in the metronome … I don't want it that
   strong — I just want it to click and to light the notes up in order").
   It used to match each strike to the note its click said was due
   (RR.Points.follower): coming in two beats late made the first strike
   note 3, notes 1 and 2 Missed. Now a strike in a run goes where any other
   does — game.js judgeFind: the next note lights when its bar is struck,
   any other bar is a slip — and nothing is ever missed by the clock. The
   click keeps going until the melody is played through (then the run is
   scored: the player's tempo against the metronome's, wherever they came
   in) or the player stops it (Off, ↻, Practice, Next, a window).
   (Practice has no count-in: its metronome is the free-running click
   below.)

   A 25 ms timer does the timing — it places clicks 120 ms ahead on the
   audio clock. (Animation frames stop when the tab or the app's pane is
   hidden; a loop run on them froze the mockup's count-in for good.)

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

   Teach Me to Read goes round and round (2026-10-11, the user's: "do not
   stop it after 1 round, let it repeat"): the click goes on and each time
   the melody is played through it is marked (G.passDone) and the notes go
   dark for the next time round — whenever the player starts it.
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
    G.run = { pace, tempo };
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
    const spt = 60 / tempo / 4, beat = M.beatTicks * spt;
    const t0 = RR.Sound.now() + 0.12, startT = t0 + lead * spt;
    // the count's clicks for the card; then every beat on the bar's grid, the first of each bar higher, made as
    // they come (`bi`) — for as long as the run goes on
    const counts = [];
    for (let b = 0; b < shown; b++) counts.push(t0 + b * beat);
    B = { my, beat, spt, t0, startT, bi: 0, beats: M.beats, loop: G.mode.kind === 'teach', timer: null,
      flashAt: s.flash ? RR.now() + s.flash * 1000 : null };
    if (CI) CI.run(counts.map(t => RR.Sound.heardAt(t)), RR.Sound.heardAt(startT));
    B.timer = setInterval(tick, 25);
    tick();
  }

  function tick() {
    if (!B) return;
    const now = RR.Sound.now();
    while (B.t0 + B.bi * B.beat < now + 0.12) {
      const t = B.t0 + B.bi * B.beat, accent = B.bi % B.beats === 0;
      B.bi++;
      if (t >= now - 0.03) RR.Sound.click(t, accent, false);      // a throttled timer fell behind: skip, never a burst
    }
    const heard = RR.Sound.heardNow();
    if (G.phase === 'countin' && heard >= B.startT - B.beat * 0.45) { G.phase = 'running'; G.drawSides(); }
    if (B.flashAt && RR.now() >= B.flashAt && !G.hidden) { G.hidden = true; B.flashAt = null; G.draw(); }
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
    start, stop, running: () => !!B,
    tickStart, tickStop, tickNextBar, ticking: () => (T ? T.pace : tPending),
    /* for tests: when the music starts (audio time) and how long a tick is */
    info: () => B && { startT: B.startT, spt: B.spt, beat: B.beat, loop: B.loop }
  };
})();

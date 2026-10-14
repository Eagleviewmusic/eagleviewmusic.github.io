/* ==========================================================================
   Melody Reader — beat.js
   --------------------------------------------------------------------------
   RR.Beat — the count-in run (Melody Reader Design/POINTS-AND-COUNT-IN.md).

   A Test with the metronome on (at the tempo dial's tempo, G.tempo — 56
   to 132, 72 to begin with, 2026-10-13; it was Slow · Moderate · Fast)
   → the family count-in (EVMCountIn: prime the sound, the "Get ready
   1 2 3 4" card, one bar — two in 2/4), then the metronome — the first
   beat of each bar higher — for as long as the run lasts. The run is the
   try, scored like any other (points.js score).

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

   The click or the drum beat (2026-10-13, drums.js): the metronome's sound
   is the practice's `beat` (Practice's lessons: the look's). Everything
   above plays one bar at a time through a pulse (pulse / pump): the click
   on each beat, the bar's first higher — or, with Drum beat chosen and a
   beat written for the meter, the drum beat. A count-in is still clicked —
   "Get ready 1 2 3 4" — and the drums come in at the music's first full
   bar, as a band's would after the drummer's count (a pick-up is played
   over the last clicks); Practice's click has no count, so its drums start
   at once. A beat longer than a bar (3/4's is two) goes round from its
   first bar there. A meter with no drum beat clicks.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$;
  const G = RR.Game;
  let B = null;          // the run in progress
  let token = 0;         // bumped by stop(), so a count-in waiting on prime() knows it was cancelled
  const AHEAD = 0.12;    // how far ahead each sound is placed on the audio clock

  /* ---------------- the beat's sound: the click, or the drum beat ---------------- */
  /* the metronome's sound for what is playing: 'click' or 'drums' */
  const soundNow = () => (G.mode.kind === 'teach' ? RR.teachLook().beat : G.setup && G.setup.beat) === 'drums' ? 'drums' : 'click';
  /* a bar of clicks: on each beat, the first higher */
  const clickBar = M => Array.from({ length: M.beats }, (_, k) => ({ tick: k * M.beatTicks, accent: k === 0 }));
  /* the bars the drums play in a meter (one, or more going round) — null for the click (Click chosen, or no beat
     for the meter) */
  const drumBars = time => soundNow() === 'drums' && RR.Drums ? RR.Drums.bars(time) : null;
  /* one hit at audio time t (spt: seconds a tick, for the drum's gap to its next hit); a drum bar with nothing in it
     holds a rest's place */
  function sound(h, t, spt) {
    if (h.rest) return;
    if (h.id && RR.Sound.drum(h.id, t, h.gap * spt * 1000)) return;
    RR.Sound.click(t, h.id ? h.tick === 0 : h.accent, false);
  }
  /* a pulse: bars from audio time t0 on, the first `count` of them clicked (a count-in), the rest the drum beat
     (or clicks) — pump() places every hit due before now + AHEAD and moves on */
  function pulse(time, t0, spt, count) {
    const M = RR.meter(time);
    return { t0, spt, barDur: M.barTicks * spt, click: clickBar(M), drums: drumBars(time), count: count || 0, n: 0, j: 0 };
  }
  function pump(P, now) {
    for (;;) {
      const bar = P.drums && P.n >= P.count ? P.drums[(P.n - P.count) % P.drums.length] : P.click, h = bar[P.j];
      const t = P.t0 + P.n * P.barDur + h.tick * P.spt;
      if (t >= now + AHEAD) return;
      if (t >= now - 0.03) sound(h, t, P.spt);                    // a throttled timer fell behind: skip, never a burst
      if (++P.j >= bar.length) { P.j = 0; P.n++; }
    }
  }
  /* every hit between two of a card's ticks (Listen: its bar lines at pick + m bars), each { tk, h } — the bars
     before tick `countTo` clicked; `offset`: bars played before this (Listen's round and round), so a beat of more
     than a bar goes on round */
  function span(time, from, to, pick, countTo, offset) {
    const M = RR.meter(time), click = clickBar(M), drums = drumBars(time), out = [], L = drums ? drums.length : 1;
    for (let m = Math.floor((from - pick) / M.barTicks); pick + m * M.barTicks < to; m++) {
      const at = pick + m * M.barTicks, bar = drums && at >= countTo ? drums[(((m + (offset || 0)) % L) + L) % L] : click;
      bar.forEach(h => { const tk = at + h.tick; if (tk >= from && tk < to) out.push({ tk, h }); });
    }
    return out;
  }

  async function start() {
    const s = G.setup;
    if (G.overlay || G.clock || G.phase === 'countin' || G.phase === 'running' || G.phase === 'done') return;
    if (G.stage !== 'game' || !G.metroOn() || G.started) return;   // a Test, the metronome on, the try not begun on its own
    G.stopHear(true);
    if (G.phase !== 'ready' || G.states.some(x => x !== 'todo')) G.resetCard();
    const tempo = G.tempo;
    G.phase = 'countin';
    G.run = { tempo };
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
    const t0 = RR.Sound.now() + AHEAD, startT = t0 + lead * spt;
    // the count's numbers for the card; then the beat on the bar's grid — the count's bar(s) clicked, the drum beat
    // (when chosen) from the music's first full bar — made as they come, for as long as the run goes on
    const counts = [];
    for (let b = 0; b < shown; b++) counts.push(t0 + b * beat);
    B = { my, beat, spt, t0, startT, P: pulse(G.card.time, t0, spt, n / M.beats), loop: G.mode.kind === 'teach', timer: null,
      flashAt: s.flash ? RR.now() + s.flash * 1000 : null };
    if (CI) CI.run(counts.map(t => RR.Sound.heardAt(t)), RR.Sound.heardAt(startT));
    B.timer = setInterval(tick, 25);
    tick();
  }

  function tick() {
    if (!B) return;
    const now = RR.Sound.now();
    pump(B.P, now);
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
    const my = ++tToken, tempo = G.tempo, key = keyNow();
    tPending = key;
    const ok = await RR.Sound.prime(0.3);
    if (my !== tToken) return;
    tPending = null;
    if (!ok || !G.card) return;
    const M = RR.meter(G.card.time), spt = 60 / tempo / 4, t0 = RR.Sound.now() + 0.08;
    T = { key, t0, beat: M.beatTicks * spt, beats: M.beats, n: 0, P: pulse(G.card.time, t0, spt, 0), timer: null };
    T.timer = setInterval(tickRun, 25);
    tickRun();
  }
  function tickRun() {
    if (!T) return;
    const now = RR.Sound.now();
    pump(T.P, now);
    // the metronome button's nod on each beat (the bar's first a bigger one), click or drums
    while (T.t0 + T.n * T.beat < now + AHEAD) {
      const t = T.t0 + T.n * T.beat, accent = T.n % T.beats === 0;
      T.n++;
      if (t < now - 0.03) continue;
      const at = RR.Sound.heardAt(t) - performance.now();
      setTimeout(() => { if (T && G.metroBeat) G.metroBeat(accent); }, Math.max(0, at));
    }
  }
  /* what the practice metronome plays: a change of tempo or sound starts it again (game.js syncTick) */
  const keyNow = () => G.tempo + ' ' + soundNow();
  function tickStop() { tToken++; tPending = null; if (T) { clearInterval(T.timer); T = null; } }
  /* the audio time of the click's next bar line at least `lead` seconds from now (null when it isn't running) */
  function tickNextBar(lead) {
    if (!T) return null;
    const bar = T.beat * T.beats, at = RR.Sound.now() + (lead || 0);
    return T.t0 + Math.max(0, Math.ceil((at - T.t0) / bar - 1e-9)) * bar;
  }

  RR.Beat = {
    start, stop, running: () => !!B,
    tickStart, tickStop, tickNextBar, ticking: () => (T ? T.key : tPending), keyNow,   // the tempo and sound clicking (or waking), else null
    soundNow, span, sound, hasDrums: time => !!drumBars(time),
    /* for tests: when the music starts (audio time) and how long a tick is */
    info: () => B && { startT: B.startT, spt: B.spt, beat: B.beat, loop: B.loop }
  };
})();

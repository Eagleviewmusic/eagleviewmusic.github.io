/* ==========================================================================
   Melody Reader — game.js
   --------------------------------------------------------------------------
   RR.Game — one card at a time (ENGINE §4; the points and the count-in
   since 2026-10-04: Melody Reader Design/POINTS-AND-COUNT-IN.md).

   A card has two stages, switched by the Practice / Test button under the
   music (2026-10-05). **Practice** (a blue pause; when the practice has
   it): Listen, try the bars — the notes light as they are found, nothing
   counts. **Test** (a red ball in a red ring): with the metronome Off the
   notes are simply live — the first bar struck starts a try on your own
   (judgeFind; tiers 1–2); with the metronome on (Slow · Moderate · Fast)
   the family count-in starts at once and the run is the try (beat.js;
   tier 3). A try done → finish(): RR.Points, stars, the streak, the
   praise, then the next card (by itself, or the Next button glows; a Test
   with the metronome always rolls on, counting in again), or Round done.

   Which stage a card opens in (the user's rule): Practice — unless the
   player went to Test on the last card *before playing a note in
   Practice there*; then the next card opens in Test (they want to play
   without the practice). Practising, then testing, turns Practice back on.

   Start over (↻ beside Next): a card with notes played (or a try under
   way, or done) starts again; an untouched card starts the whole round
   again from the first melody, the round's points taken back. A card's
   try counts once in the round: trying it again replaces it.

   The card: evs (the notes with their start ticks), states[i] ('todo' ·
   'lit' · 'missed'), judge[i] (a count-in run's Perfect … Missed — never
   shown), times[i] (when it was struck, s), tries[i] (slips before it was
   found), idx (the next note, rests skipped), slips, slipsHere, run (a
   count-in run: pace, wrong bars), stage ('practice' · 'game'), started,
   phase ('ready' · 'countin' · 'running' · 'review' (Practice showing what
   was played) · 'done').

   Games: Round of 5 · Round of 10 · Song (a Songbook song card by card,
   then Hear your song) · Beat the clock (the clock starts with the first
   note) · Endless.

   RR.Scores — this player's saved scores (rainbow_reader_scores_v1, v 2): best
   rounds per practice and game, the level ladder's stars, first-try
   counts per note (tricky notes), mix-ups, totals.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, BAR = RR.BAR;

  /* ---------------- scores ---------------- */
  const Scores = RR.Scores = {
    data: null,
    load() {
      const d = RR.load(RR.KEY.scores, null);
      this.data = d && (d.v === 1 || d.v === 2) && d.players && typeof d.players === 'object' && !Array.isArray(d.players) ? d : { v: 2, players: {} };
      if (this.data.v === 1) {
        // points became 1–20 a melody (2026-10-04): best rounds on the old scale would never be beaten.
        // The ladder's stars, tricky notes, mix-ups and totals stay.
        Object.keys(this.data.players).forEach(k => {
          const L = this.data.players[k] && this.data.players[k].levels;
          if (L && typeof L === 'object') Object.keys(L).forEach(l => { if (L[l] && typeof L[l] === 'object') L[l].bests = []; });
        });
        this.data.v = 2;
        RR.save(RR.KEY.scores, this.data);
      }
    },
    me() {
      const k = RR.device.player || '';
      const p = this.data.players[k] = (this.data.players[k] && typeof this.data.players[k] === 'object') ? this.data.players[k] : {};
      if (!p.levels || typeof p.levels !== 'object') p.levels = {};
      if (!p.stats || typeof p.stats !== 'object') p.stats = {};
      if (!p.mix || typeof p.mix !== 'object') p.mix = {};
      if (!p.totals || typeof p.totals !== 'object') p.totals = { melodies: 0, notes: 0, first: 0 };
      return p;
    },
    save() { RR.save(RR.KEY.scores, this.data); },
    key() {
      const m = G.mode;
      if (m.kind === 'lesson') return 'lesson:' + m.name;
      if (G.playingSet()) return 'set:' + G.setup.set;          // a melody set is its own score board
      return m.kind === 'level' ? String(m.n) : m.kind === 'mine' ? 'mine:' + m.name : 'custom';
    },
    entry(key) {
      const L = this.me().levels;
      const e = L[key] = (L[key] && typeof L[key] === 'object') ? L[key] : {};
      if (!Array.isArray(e.bests)) e.bests = [];
      if (typeof e.stars !== 'number') e.stars = 0;
      return e;
    },
    levelStars(key) { const e = this.me().levels[key]; return e && typeof e.stars === 'number' ? e.stars : 0; },
    reset() { delete this.data.players[RR.device.player || '']; this.save(); }
  };
  Scores.load();

  /* ---------------- state ---------------- */
  const G = RR.Game = {
    mode: { kind: 'level', n: 1 }, setup: null, contentChanged: false, roundChanged: false,
    card: null, evs: [], states: [], judge: [], times: [], tries: [], idx: -1, clean: true, slips: 0, slipsHere: 0,
    stage: 'practice', started: false, run: null, result: null, practiceT: null,
    metro: 'off',                 // the metronome: off · slow · moderate · fast (for this visit; Off when the page opens)
    practisedHere: false,         // a bar struck in Practice on this card
    openTest: false,              // the next card opens in Test (see leaveCard)
    fresh: false,                 // a new practice, set or player: the next card opens in Practice
    cardEntry: -1, cardStreak: 0, // this card's place in the round once counted; the streak before it
    dealt: [],                    // the round's cards so far, for starting it over
    phase: 'ready', justLit: -1, justAt: 0, ghosts: [], hearIdx: -1, hearing: false, hearTimers: [],
    hidden: false, rows: null,
    round: [], roundN: 5, points: 0, streak: 0, bestStreak: 0, queue: [], recent: [], songPtr: 0, rstats: {},
    overlay: false, autoT: null, clock: null
  };
  /* players: each has their own points for the session (players.js) */
  G.sessions = {};
  G.switchPlayer = function (name) {
    const old = RR.device.player || '';
    G.sessions[old] = { points: G.points, streak: G.streak, bestStreak: G.bestStreak };
    RR.device.player = name; RR.saveDevice();
    const s = G.sessions[name] || { points: 0, streak: 0, bestStreak: 0 };
    G.points = s.points; G.streak = s.streak; G.bestStreak = s.bestStreak;
    G.fresh = true;                            // a new player starts with Practice on
    G.newRound();
  };
  const nextNote = from => { for (let i = from; i < G.evs.length; i++) if (!G.evs[i].rest) return i; return -1; };

  /* ---------------- choosing what to play ---------------- */
  function modeLabel(m) {
    if (m.kind === 'level') return 'Level ' + m.n + ' · ' + RR.LEVELS[m.n - 1].name;
    if (m.kind === 'mine') return 'Mine · ' + m.name;
    if (m.kind === 'lesson') return 'Lesson · ' + m.name;
    return 'Custom' + (m.from ? ' (from ' + m.from + ')' : '');
  }
  /* the melody set being played, if there is one (My melodies, or a lesson's) */
  G.playingSet = function () {
    const id = G.setup && G.setup.set;
    const rec = id ? RR.Sets.get(id) : null;
    return rec && rec.melodies.length ? rec : null;
  };
  G.modeLabel = () => { const set = G.playingSet(); return (set && G.mode.kind !== 'lesson' ? set.title + ' · ' : '') + modeLabel(G.mode); };
  G.modeColour = () => G.mode.kind === 'level' ? RR.bandOf(G.mode.n).colour : G.mode.kind === 'lesson' ? '#7c3aed' : RR.MINE_COLOUR;

  function usePractice(practice, mode) {
    G.mode = mode;
    G.setup = RR.sanitize(practice);
    if (mode.kind !== 'lesson') {             // the game this browser plays (see settings.js)
      const g = RR.sanitize({ game: RR.device.game, clockSecs: RR.device.clockSecs, song: RR.device.song });
      G.setup.game = g.game; G.setup.clockSecs = g.clockSecs; G.setup.song = g.song;
      G.setup.tricky = RR.device.tricky === true;
      // a melody set chosen to play (My melodies) is laid over the same way
      G.setup.set = RR.device.set && RR.Sets.get(RR.device.set) ? RR.device.set : null;
    }
    G.queue = []; G.songPtr = 0; G.contentChanged = false; G.roundChanged = false;
    G.fresh = true;
    if (mode.kind === 'level') { RR.device.level = mode.n; RR.device.practice = null; RR.saveDevice(); }
    else if (mode.kind === 'custom' || mode.kind === 'mine') { RR.device.practice = { kind: mode.kind, name: mode.name || null, from: mode.from || null, practice: G.setup }; RR.saveDevice(); }
    applyInstrument();
    newRound();
  }
  G.usePractice = usePractice;
  G.selectLevel = n => usePractice(RR.practiceOfLevel(n), { kind: 'level', n });
  /* a change in the Settings tabs: the practice becomes Custom (from …) */
  G.markCustom = function () {
    if (G.mode.kind === 'custom' || G.mode.kind === 'lesson') { if (G.mode.kind === 'custom') { RR.device.practice = { kind: 'custom', from: G.mode.from, practice: G.setup }; RR.saveDevice(); } return; }
    const from = G.mode.kind === 'level' ? 'Level ' + G.mode.n : G.mode.name;
    G.mode = { kind: 'custom', from };
    RR.device.practice = { kind: 'custom', from, practice: G.setup };
    RR.saveDevice();
  };

  /* the practice's songs that can be mixed in: only those whose every note
     is in the practice (a Custom practice of line notes doesn't get Ode to Joy) */
  function mixedSongs() {
    const s = G.setup;
    if (s.from === 'made') return [];
    return s.songs.filter(id => RR.SONGS[id] && Array.from(RR.Melody.songNotes(id)).every(n => s.notes.includes(n)));
  }
  function liveBars() {
    const s = G.setup, set = G.playingSet();
    if (set) return RR.Sets.notesOf(set);                       // a set: its own notes, nothing else
    const live = new Set(s.notes);
    const songs = s.game === 'song' ? [s.song || s.songs[0] || 'hot-cross-buns'] : mixedSongs();
    songs.forEach(id => RR.Melody.songNotes(id).forEach(n => live.add(n)));
    return live;
  }
  function applyInstrument() {
    const s = G.setup, live = liveBars();
    const twelve = Array.from(live).some(id => BAR[id].i >= 10);
    if (RR.Xylo.count() !== (twelve ? 12 : 10)) RR.Xylo.build(twelve ? 12 : 10);
    RR.Xylo.setGreyed(s.grey ? live : null);
    RR.Xylo.setLabels(s.letters, s.nums);
    const app = $('#app');
    app.classList.toggle('no-play', !!s.playHidden);
    app.classList.toggle('game-clock', s.game === 'clock');
    app.classList.toggle('game-open', s.game === 'endless' || s.game === 'clock');
    app.classList.toggle('in-lesson', G.mode.kind === 'lesson');
  }
  G.applyInstrument = applyInstrument;

  /* a melody set as cards: in order, "Week 3 · 2 of 5" */
  function setCards(set) {
    return set.melodies.map((m, i) => ({ title: set.title, sub: m.title || '', part: i + 1, of: set.melodies.length, set: set.id, time: m.time.slice(), notes: RR.clone(m.notes) }));
  }
  G.setCards = setCards;
  function refill() {
    const s = G.setup;
    const set = G.playingSet();
    if (set) { G.queue.push.apply(G.queue, setCards(set)); return; }
    const songs = mixedSongs();
    if (s.game === 'song') { G.queue.push.apply(G.queue, RR.Melody.songCards(s.song || songs[0] || 'hot-cross-buns')); return; }
    if (songs.length) { G.queue.push.apply(G.queue, RR.Melody.songCards(songs[G.songPtr % songs.length])); G.songPtr++; }
    if (s.from !== 'songbook' || !songs.length) {
      for (let i = 0; i < 2; i++) { const m = RR.Melody.make(s, { recent: G.recent, stats: Scores.me().stats }); if (m) G.queue.push(m); }
    }
  }

  function newRound() {
    clearTimeout(G.autoT);
    stopClock();
    G.round = []; G.rstats = {}; G.overlay = false; G.dealt = [];
    G.roundStreak = G.streak;
    if (RR.Board) RR.Board.hideRound();
    const s = G.setup;
    if (s.game === 'song') { G.queue = []; refill(); G.roundN = G.queue.length; }
    else if (G.playingSet() && (s.game === 'round5' || s.game === 'round10')) G.roundN = Math.min(s.game === 'round10' ? 10 : 5, G.playingSet().melodies.length) || 5;
    else G.roundN = s.game === 'round10' ? 10 : (s.game === 'endless' || s.game === 'clock') ? Infinity : 5;
    G.clock = s.game === 'clock' ? { secs: s.clockSecs, started: null, notes: 0, melodies: 0, clean: 0, pts: 0, timer: null } : null;
    nextCard();
  }
  G.newRound = newRound;

  function nextCard(card) {
    clearTimeout(G.autoT);
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    if (G.fresh) { G.fresh = false; G.openTest = false; } else leaveCard();
    if (!card) { if (!G.queue.length) refill(); card = G.queue.shift(); }
    G.card = card; G.dealt.push(card);
    G.practisedHere = false; G.cardEntry = -1;
    resetCard(openingStage());
    draw();
    roll();
  }
  G.nextCard = nextCard;

  /* the practice rule, as a card is left: went to Test without playing a
     note in Practice here → the next card opens in Test too; practised,
     then tested (or still in Practice) → Practice again */
  function leaveCard() {
    if (!G.card || !G.setup.practice || G.clock) return;
    G.openTest = G.stage === 'game' && !G.practisedHere;
  }
  /* a card opens in Practice, unless the player has chosen to play without
     it (above), the practice has none (the sight-reading levels) or it's
     Beat the clock */
  const openingStage = () => G.setup.practice && !G.clock && !G.openTest ? 'practice' : 'game';

  /* the metronome */
  const metroOn = () => G.metro !== 'off';
  G.metroOn = metroOn;
  /* Listen's pace: the metronome's, or Slow when it's off (Make a melody and My melodies hear it so too) */
  RR.listenPace = () => metroOn() ? G.metro : 'slow';
  const windowOpen = () => !!document.querySelector('.modal:not([hidden]), .evm-shelf.show');
  /* in a Test with the metronome on, a card waiting to be played counts in by
     itself — after Next, a finished try, Start over, or a window closing */
  function roll() {
    if (G.stage !== 'game' || !metroOn() || G.clock || G.overlay || G.phase !== 'ready' || G.started) return;
    if (windowOpen() || (RR.Maker && RR.Maker.active)) return;
    RR.Beat.start();
  }
  G.roll = roll;
  RR.onWindowClosed = () => setTimeout(roll, 0);

  /* the card from the top; a stage given = a new start (else the stage stays) */
  function resetCard(stage) {
    if (stage) G.stage = stage;
    $('#btn-mode').classList.remove('ready');
    clearTimeout(G.practiceT);
    G.evs = RR.Eng.events(G.card).evs;
    G.states = G.evs.map(() => 'todo');
    G.judge = G.evs.map(() => null);
    G.times = G.evs.map(() => null);
    G.tries = G.evs.map(() => 0);
    G.idx = nextNote(0);
    G.clean = true; G.slips = 0; G.slipsHere = 0; G.started = false; G.run = null; G.result = null;
    G.phase = 'ready';
    G.ghosts = []; G.justLit = -1; G.hidden = false; G.hearIdx = -1;
    $('#praise').className = 'praise';
    RR.Xylo.setGlow(G.setup.glow === 'always' && G.idx >= 0 ? G.evs[G.idx].p : null);
    $('#btn-next').classList.remove('ready');
  }
  G.resetCard = resetCard;

  /* Practice → Test: the notes dark again and live; with the metronome on,
     the count-in starts at once */
  G.toGame = function () {
    if (G.overlay || G.stage !== 'practice') return;
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    clearTimeout(G.autoT);
    resetCard('game'); draw();
    if (metroOn()) RR.Beat.start();
    else announce('Test: play it for points.');
  };
  /* Test → Practice, at any point: a try under way is called off (it never
     counts), a pending move to the next card too — this card, in Practice */
  G.toPractice = function () {
    if (G.overlay || G.stage !== 'game' || !canPractise()) return;
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    clearTimeout(G.autoT);
    resetCard('practice'); draw();
    announce('Practice: nothing counts.');
  };
  G.toggleMode = () => { if (G.stage === 'practice') G.toGame(); else G.toPractice(); };
  /* the Get ready card tapped while it counts (or Escape): they want it to
     stop — back to Practice, the pause (or, with no Practice here, a Test
     waiting). The metronome stays as it was */
  G.stopCountIn = function () {
    if (G.phase !== 'countin') return;
    RR.Beat.stop();
    const practice = G.setup.practice && !G.clock;
    resetCard(practice ? 'practice' : undefined); draw();
    announce(practice ? 'Stopped. Practice: nothing counts.' : 'Stopped.');
  };
  /* Practice is there unless the practice has none, it's Beat the clock, or
     One go and the try has begun */
  const canPractise = () => G.setup.practice && !G.clock && !(G.setup.oneGo && G.started);

  /* Off → Slow → Moderate → Fast → Off. In a Test not yet finished the try
     starts again: counted in at the new pace, or the notes simply live */
  G.cycleMetro = function () {
    if (G.overlay || G.clock) return;
    const order = ['off', 'slow', 'moderate', 'fast'];
    G.metro = order[(order.indexOf(G.metro) + 1) % order.length];
    if (G.hearing) stopHear(true);
    if (G.stage === 'game' && G.phase !== 'done' && !(G.setup.oneGo && G.started)) {
      RR.Beat.stop(); resetCard(); draw();
      if (metroOn()) RR.Beat.start();
    } else drawSides();
    announce(metroOn() ? 'Metronome: ' + RR.Points.paceOf(G.metro).name : 'Metronome off');
  };

  /* ↻ — a card with something played starts over; an untouched one starts
     the whole round over */
  const cardTouched = () => G.started || G.phase !== 'ready' || G.states.some(x => x !== 'todo');
  const canRestartCard = () => !(G.setup.oneGo && G.stage === 'game' && G.started);
  G.restart = function () {
    if (G.overlay) return;
    if (cardTouched()) {
      if (!canRestartCard()) return;
      stopHear(true); if (RR.Beat) RR.Beat.stop();
      clearTimeout(G.autoT);
      resetCard(); draw();
      announce('From the top.');
      roll();
    } else {
      // the round from its first melody: the same melodies, its points taken back
      G.points -= G.round.reduce((a, r) => a + r.pts, 0);
      G.streak = G.roundStreak | 0;
      G.queue = G.dealt.concat(G.queue);
      newRound();
      announce('The round starts over.');
    }
  };

  /* ---------------- a bar is struck ---------------- */
  function strike(id, e) {
    if (G.overlay) return;
    if (G.phase === 'done' || G.phase === 'countin' || G.phase === 'review') return;
    if (G.phase === 'running') { RR.Beat.strike(id, e); return; }
    if (G.clock && !G.clock.started) startClock();
    judgeFind(id, e);
  }
  RR.Xylo.onHit = strike;

  function record(note, first) {
    const me = Scores.me();
    [me.stats, G.rstats].forEach(st => {
      const x = st[note] = (st[note] && typeof st[note] === 'object') ? st[note] : { n: 0, first: 0 };
      x.n = (x.n | 0) + 1; if (first) x.first = (x.first | 0) + 1;
    });
    me.totals.notes = (me.totals.notes | 0) + 1;
    if (first) me.totals.first = (me.totals.first | 0) + 1;
    if (G.clock) { G.clock.notes++; drawChips(); }
  }
  G.record = record;
  function mixup(target, played) {
    const mix = Scores.me().mix, key = target + '>' + played;
    mix[key] = (mix[key] | 0) + 1;
  }
  G.mixup = mixup;
  function addGhost(id, col) {
    const g = { id, col, at: RR.now() };
    G.ghosts.push(g);
    setTimeout(() => { G.ghosts = G.ghosts.filter(x => x !== g); if (G.phase !== 'running') draw(); }, 1150);
  }
  G.addGhost = addGhost;

  function lightNote(i) {
    G.states[i] = 'lit'; G.justLit = i; G.justAt = RR.now();
    RR.Xylo.flash(G.evs[i].p, 'right', 520);
  }
  G.lightNote = lightNote;

  /* playing on your own (and Practice): in order, anything in between. The
     time of each found note is kept for the rhythm (tier 2) — on the page's
     clock, not the audio's: only the spacing matters, and it works before
     the sound has woken */
  function judgeFind(id, e) {
    const s = G.setup, i = G.idx, game = G.stage === 'game';
    if (i < 0) return;
    if (game && !G.started) { G.started = true; drawSides(); }
    if (!game) G.practisedHere = true;
    const ev = G.evs[i];
    if (id === ev.p) {
      lightNote(i);
      G.times[i] = (e && e.timeStamp > 0 ? e.timeStamp : performance.now()) / 1000;
      G.tries[i] = G.slipsHere;
      if (game) record(ev.p, G.slipsHere === 0);
      G.slipsHere = 0;
      G.idx = nextNote(i + 1);
      RR.Xylo.setGlow(s.glow === 'always' && G.idx >= 0 ? G.evs[G.idx].p : null);
      draw(); sparkAtNote(i);
      if (G.idx < 0) { if (game) finish(); else practiceFound(); }
    } else {
      G.clean = false; G.slips++; G.slipsHere++;
      if (game) mixup(ev.p, id);
      if (s.ghost) addGhost(id, i);
      if (s.glow === 'after2' && G.slipsHere >= 2) RR.Xylo.setGlow(ev.p);
      draw();
    }
  }

  /* Practice: the notes found — say so, then clear them to go again */
  function practiceFound() {
    G.phase = 'review';
    showPraise('Got it!', 0, 0, 'Go again — or tap Practice for the Test');
    $('#btn-mode').classList.add('ready');
    practiceClear(1500);
  }
  function practiceClear(ms) {
    const card = G.card;
    clearTimeout(G.practiceT);
    G.practiceT = setTimeout(() => {
      if (G.card !== card || G.stage !== 'practice' || G.phase !== 'review') return;
      resetCard(); draw();
    }, ms);
  }

  /* the try, worth 1–20 (points.js) */
  function noteIdx() { return G.evs.map((e, i) => e.rest ? -1 : i).filter(i => i >= 0); }
  function scoreRun() {
    const idx = noteIdx();
    return RR.Points.countIn({ judge: idx.map(i => G.judge[i] || 'Missed'), starts: idx.map(i => G.evs[i].start),
      times: idx.map(i => G.times[i]), wrong: G.run ? G.run.wrong : 0, pace: G.run ? G.run.pace : 'slow' });
  }
  function scoreFree() {
    const idx = noteIdx();
    return RR.Points.free({ tries: idx.map(i => G.tries[i]), starts: idx.map(i => G.evs[i].start), times: idx.map(i => G.times[i]) });
  }

  /* ---------------- a melody done ---------------- */
  function finish() {
    const s = G.setup;
    G.phase = 'done';
    let r;
    if (G.run) {
      // a count-in run: the missed notes show now (nothing showed while it ran), and count as slips
      noteIdx().forEach(i => { if (!G.judge[i] || G.judge[i] === 'Missed') { G.judge[i] = 'Missed'; G.states[i] = 'missed'; record(G.evs[i].p, false); } });
      r = scoreRun();
    } else r = scoreFree();
    G.result = r;
    let pts = r.pts;
    const stars = RR.Points.starsFor(pts);
    G.clean = pts >= 8;                         // every note first time
    // a card counts once in the round: tried again (Start over, or back to Practice), the new try replaces it
    const again = G.cardEntry >= 0;
    if (!again) G.cardStreak = G.streak;
    G.streak = G.clean ? G.cardStreak + 1 : 0;
    G.bestStreak = Math.max(G.bestStreak, G.streak);
    if (G.clock && !again) { G.clock.melodies++; if (G.clean) G.clock.clean++; }
    if (!RR.device.points) pts = 0;
    const c = G.card;
    const entry = { stars, pts, label: c.set ? '#' + c.part : c.title ? c.title.split(/[ ,]/)[0] + ' ' + c.part : 'Made up' };
    if (again) {
      const old = G.round[G.cardEntry];
      G.points -= old.pts; if (G.clock) G.clock.pts -= old.pts;
      G.round[G.cardEntry] = entry;
    } else { G.cardEntry = G.round.length; G.round.push(entry); }
    G.points += pts;
    if (G.clock) G.clock.pts += pts;
    const me = Scores.me();
    me.totals.melodies = (me.totals.melodies | 0) + 1;
    Scores.save();
    RR.Xylo.setGlow(null);
    showPraise(r.word, stars, pts, r.detail);
    announce(r.word + ' ' + (r.detail ? r.detail + '. ' : '') + (RR.device.stars ? stars + (stars === 1 ? ' star. ' : ' stars. ') : '') + (RR.device.points && pts ? pts + ' points.' : ''));
    if (RR.device.celebrate) RR.Sound.celebrate(stars);
    draw();
    if (G.clock) { G.autoT = setTimeout(() => nextCard(), 700); return; }
    // a Test with the metronome rolls on: the next card, counted in again
    const rolling = !!G.run && metroOn();
    if (G.round.length >= G.roundN) G.autoT = setTimeout(() => { leaveCard(); RR.Board.roundDone(); }, 1800);
    else if (s.auto || rolling) G.autoT = setTimeout(() => nextCard(), rolling ? 2200 : 1900);
    else $('#btn-next').classList.add('ready');
  }
  G.finish = finish;

  function next() {
    if (G.overlay) return;
    if (G.cardEntry < 0) {                       // never finished in a Test: skipped
      G.round.push({ stars: 0, pts: 0, label: 'Skipped' });
      G.streak = 0;
    }
    if (G.round.length >= G.roundN) { stopHear(true); if (RR.Beat) RR.Beat.stop(); leaveCard(); RR.Board.roundDone(); return; }
    nextCard();
  }
  G.next = next;

  /* ---------------- Beat the clock ---------------- */
  function startClock() {
    const c = G.clock; if (!c || c.started) return;
    c.started = RR.now();
    c.timer = setInterval(() => {
      const left = c.secs - (RR.now() - c.started) / 1000;
      const bar = $('#clock i'); if (bar) bar.style.width = Math.max(0, 100 * left / c.secs) + '%';
      if (left <= 0) timeUp();
    }, 100);
  }
  function stopClock() { if (G.clock && G.clock.timer) clearInterval(G.clock.timer); }
  function timeUp() {
    stopClock();
    clearTimeout(G.autoT);
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    G.phase = 'done';
    RR.Xylo.setGlow(null);
    draw();
    RR.Board.timeUp();
  }

  /* ---------------- ▶ Listen: hear the melody ---------------- */
  /* Practice's (unless Listen in Practice is off), and after a try — never
     during one. At the metronome's pace — and with the metronome on, its
     clicks too: a bar of them first, then on every beat (Off: Slow, no clicks) */
  const canHear = () => G.phase === 'done' || (G.stage === 'practice' && !G.setup.playHidden);
  G.canHear = canHear;
  function hearIt() {
    if (G.hearing) { stopHear(true); return; }
    if (G.overlay || G.phase === 'countin' || G.phase === 'running' || !canHear()) return;
    if (!RR.Sound.ctx) return;
    const s = G.setup, beat = 60 / RR.paceTempo(s, RR.listenPace()), spt = beat / 4;
    const per = G.card.time[0], lead = metroOn() ? per : 0;
    const t0 = RR.Sound.now() + 0.12 + lead * beat;
    G.hearing = true; $('#btn-play').classList.add('playing');
    $('#btn-play').setAttribute('aria-label', 'Stop');
    G.hearTimers = [];
    if (metroOn()) {
      // clicks aren't stoppable once made, so each is made just before it is due
      const total = G.evs.reduce((a, e) => a + e.t, 0);
      for (let b = -lead; b < total / 4; b++) {
        const t = t0 + b * beat, accent = ((b % per) + per) % per === 0;
        G.hearTimers.push(setTimeout(() => RR.Sound.click(t, accent, false), Math.max(0, (t - RR.Sound.now() - 0.15) * 1000)));
      }
    }
    G.evs.forEach((ev, i) => {
      const t = t0 + ev.start * spt;
      if (!ev.rest) RR.Sound.playAt(ev.p, t);
      G.hearTimers.push(setTimeout(() => {
        G.hearIdx = i;
        if (!ev.rest && s.playLights) RR.Xylo.flash(ev.p, 'demo', Math.min(380, ev.t * spt * 900));
        draw();
      }, Math.max(0, RR.Sound.heardAt(t) - RR.now())));
    });
    const total = G.evs.reduce((a, e) => a + e.t, 0);
    G.hearTimers.push(setTimeout(() => stopHear(false), Math.max(0, RR.Sound.heardAt(t0 + total * spt) - RR.now()) + 60));
  }
  function stopHear(silence) {
    G.hearTimers.forEach(clearTimeout); G.hearTimers = [];
    const was = G.hearing;
    if (was && silence) RR.Sound.stopPlayed();
    G.hearing = false; G.hearIdx = -1;
    $('#btn-play').classList.remove('playing');
    $('#btn-play').setAttribute('aria-label', 'Listen');
    if (was) draw();
  }
  /* a window opening over the music: Play stops, and a count-in run (which
     can't be played under a window) is called off — the card starts again */
  G.pause = function () {
    stopHear(true);
    if (RR.Beat && (RR.Beat.running() || G.phase === 'countin' || G.phase === 'running')) { RR.Beat.stop(); resetCard(); draw(); }
  };
  G.hearIt = hearIt;
  G.stopHear = stopHear;

  /* Hear your song: every card of a Songbook song, one after another */
  let songTimers = [];
  G.songPlaying = false;
  G.hearSong = function (id, onEnd) {
    G.stopSong();
    const set = G.playingSet();
    const cards = set ? setCards(set) : RR.Melody.songCards(id); if (!cards.length || !RR.Sound.ctx) return;
    const spt = 60 / RR.paceTempo(G.setup, RR.listenPace()) / 4;
    let t = RR.Sound.now() + 0.15;
    G.songPlaying = true;
    cards.forEach(c => c.notes.forEach(n => {
      if (n.p) {
        RR.Sound.playAt(n.p, t);
        const id_ = n.p, when = RR.Sound.heardAt(t) - RR.now();
        songTimers.push(setTimeout(() => RR.Xylo.flash(id_, 'demo', 300), Math.max(0, when)));
      }
      t += n.t * spt;
    }));
    songTimers.push(setTimeout(() => { G.songPlaying = false; songTimers = []; if (onEnd) onEnd(); }, Math.max(0, RR.Sound.heardAt(t) - RR.now())));
  };
  G.stopSong = function () {
    if (G.songPlaying) RR.Sound.stopPlayed();
    songTimers.forEach(clearTimeout); songTimers = []; G.songPlaying = false;
  };

  /* ---------------- drawing the music card ---------------- */
  const music = $('#music');
  function draw() {
    if (RR.Maker && RR.Maker.active) { RR.Maker.render(); return; }   // Make a melody has the music card
    if (!G.card || !RR.Eng.available) return;
    const s = G.setup;
    const fitW = music.clientWidth, fitH = music.clientHeight;
    if (fitW && fitH) {
      const card = G.card, barTicks = card.time[0] * 4;
      const total = G.evs.reduce((a, e) => a + e.t, 0);
      const rowH = 2.7 + 4 + 2.9 + (s.labels !== 'none' ? 1.5 : 0);
      const age = RR.now() - G.justAt;
      const nextIdx = (G.phase === 'ready' && !G.hearing) ? G.idx : -1;
      const justLit = age < 450 ? G.justLit : -1;
      const ghosts = G.ghosts.map(g => ({ id: g.id, col: g.col, age: RR.now() - g.at }));
      // a two-bar melody on a narrow screen (a phone held upright) is drawn one bar above the other
      const cut = G.evs.findIndex(e => e.start >= barTicks);
      const split = fitW < 560 && total === 2 * barTicks && cut > 0;
      const ranges = split ? [[0, cut], [cut, G.evs.length]] : [[0, G.evs.length]];
      const subs = ranges.map(([a, b], r) => ({ a, b, startTick: r ? barTicks : 0, card: { time: card.time, notes: card.notes.slice(a, b) }, noTime: r > 0, endBar: split && r === 0 ? 'single' : 'final' }));
      const widest = Math.max.apply(null, subs.map(x => { const m = RR.Eng.measure(x.card, false, x.noTime); return m.prefix + m.notes * 0.95 + m.fixed; }));
      const ss = Math.max(8, Math.min(fitH / (rowH * subs.length), fitW / widest, split ? 26 : 46));   // 46: a smartboard's big staff
      const shift = (i, a, b) => (i >= a && i < b ? i - a : -1);
      // a count-in run shows nothing but the notes lighting: no playhead, no judgement words, no ghosts
      G.rows = subs.map(x => Object.assign(x, {
        geo: RR.Eng.render(x.card, {
          ss, maxW: fitW, maxStretch: split ? 3 : 1.9, noTime: x.noTime, endBar: x.endBar,
          colour: s.colour, states: G.states.slice(x.a, x.b),
          nextIdx: shift(nextIdx, x.a, x.b), hearIdx: shift(G.hearIdx, x.a, x.b), justLit: shift(justLit, x.a, x.b), justAge: age,
          labels: s.labels,
          ghosts: ghosts.filter(g => g.col >= x.a && g.col < x.b).map(g => Object.assign({}, g, { col: g.col - x.a })),
          hidden: G.hidden
        })
      }));
      music.innerHTML = subs.length > 1 ? '<div class="rows">' + G.rows.map(x => x.geo.svg).join('') + '</div>' : G.rows[0].geo.svg;
    }
    // for a screen reader: what is on the stand — never the notes' names, which would read it for them
    music.setAttribute('aria-label', describe());
    // around the music
    drawSides();
    const c = G.card;
    $('#tune-name').textContent = c.title ? c.title + ' · ' + (c.sub ? c.sub + ' · ' : '') + c.part + ' of ' + c.of : 'A made-up melody';
    // the round's dots, top centre: the card being played rings (a counted one being tried again too)
    const dots = [], here = G.cardEntry >= 0 ? G.cardEntry : G.round.length;
    if (isFinite(G.roundN)) {
      for (let i = 0; i < G.roundN; i++) {
        const r = G.round[i];
        dots.push('<span class="dot' + (r ? ' done s' + r.stars : '') + (i === here ? ' now' : '') + '"></span>');
      }
    }
    $('#dots').innerHTML = dots.join('');
    $('#clock').hidden = !G.clock;
    if (G.clock && !G.clock.started) $('#clock i').style.width = '100%';
    drawChips();
  }
  G.draw = draw;
  function describe() {
    const c = G.card, total = G.evs.reduce((a, e) => a + e.t, 0);
    const notes = G.evs.filter(e => !e.rest).length, lit = G.states.filter(x => x === 'lit').length;
    const bars = Math.round(total / (c.time[0] * 4));
    const name = c.title ? c.title + ', ' + (c.sub ? c.sub + ', ' : '') + c.part + ' of ' + c.of : 'A made-up melody';
    return (G.stage === 'practice' ? 'Practice. ' : 'Test. ') + 'The music: ' + name + '. ' + c.time[0] + '/4, ' + bars + (bars === 1 ? ' bar' : ' bars') + ', ' + notes + ' notes' +
      (lit ? ', ' + lit + ' played' : '') + (G.clean ? '' : ', with slips') + '.';
  }

  /* the controls, by stage:
       under the music   ▶ Listen (Practice, or a try done) · Practice / Test · the metronome
       beside it         ↻ Start over · Next */
  const WEIGHT = { off: 0.55, slow: 0.8, moderate: 0.56, fast: 0.32 };   // up the metronome's arm: higher is slower
  function drawSides() {
    const app = $('#app'), s = G.setup, practice = G.stage === 'practice';
    const busy = G.phase === 'countin' || G.phase === 'running';
    app.classList.toggle('stage-practice', practice);
    app.classList.toggle('stage-game', !practice);
    app.classList.toggle('card-done', G.phase === 'done');
    // the Get ready card takes a tap only while it counts (stopCountIn) — not in the last
    // half beat, when a bar under it may be struck early for the first note
    document.documentElement.classList.toggle('ci-tap', G.phase === 'countin');
    // ▶ Listen
    const play = $('#btn-play'), hear = canHear() || G.hearing;
    play.disabled = !hear;
    play.title = hear ? 'Listen' + (metroOn() ? ' — with the metronome' : '') : practice ? 'Listening is off for this practice' : 'Listen comes back when the Test is done';
    // Practice (a blue pause) / Test (a red ball in a red ring — it pulses while a try is under way)
    const mode = $('#btn-mode');
    mode.classList.toggle('test', !practice);
    mode.classList.toggle('recording', !practice && (busy || (G.started && G.phase !== 'done')));
    mode.disabled = practice ? false : !canPractise();
    mode.setAttribute('aria-pressed', String(!practice));
    $('#mode-label').textContent = practice ? 'Practice' : 'Test';
    mode.title = practice ? 'Practice: nothing counts. Press for a Test' :
      !s.practice ? 'Test only: no Practice here' : G.clock ? 'Beat the clock is all Test' :
      s.oneGo && G.started ? 'Test — one go' : 'Test: for points. Press for Practice';
    mode.setAttribute('aria-label', mode.title);
    // the metronome: Off · Slow · Moderate · Fast, lit when on
    const on = metroOn(), pace = RR.Points.paceOf(G.metro), m = $('#btn-metro');
    m.classList.toggle('on', on);
    m.disabled = !!G.clock;
    $('#metro-label').textContent = on ? pace.name : 'Off';
    m.title = on ? 'Metronome: ' + pace.name + ' (' + RR.paceTempo(s, pace.id) + ' BPM) — a Test counts you in, worth ' + pace.lo + '–' + pace.hi + ' points. Tap to change.' :
      'Metronome off. Tap for Slow, Moderate or Fast';
    m.setAttribute('aria-label', m.title);
    const w = WEIGHT[G.metro] || WEIGHT.off;
    $('#metro-weight').setAttribute('transform', 'translate(' + (12 + 5.6 * w).toFixed(2) + ' ' + (15.2 - 11.6 * w).toFixed(2) + ') rotate(25.8)');
    // ↻ Start over
    const r = $('#btn-restart'), touched = cardTouched();
    r.disabled = touched && !canRestartCard();
    r.title = touched ? 'Start this melody over' : 'Start the round over, from the first melody';
    r.setAttribute('aria-label', r.title);
  }
  G.drawSides = drawSides;

  function drawChips() {
    const chip = $('#level-chip');
    chip.style.setProperty('--band', G.modeColour());
    chip.querySelector('.level-text').textContent = G.modeLabel();
    const who = RR.Players ? RR.Players.current() : '';
    $('#sc-player').textContent = who;
    $('#sc-player').hidden = !who;
    $('#sc-stars').textContent = G.round.reduce((a, r) => a + r.stars, 0);
    $('#sc-points').textContent = G.points;
    $('#sc-streak').textContent = G.streak;
    $('#score-chip').classList.toggle('no-points', !RR.device.points);
    $('#score-chip').classList.toggle('no-stars', !RR.device.stars);
  }
  G.drawChips = drawChips;
  new ResizeObserver(() => draw()).observe(music);

  /* ---------------- effects ---------------- */
  const reduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sparkAt(x, y, colour, n, star) {
    if (reduced()) return;
    const fx = $('#fx');
    for (let i = 0; i < n; i++) {
      const sp = document.createElement('i');
      sp.className = 'spark' + (star ? ' star' : '');
      const a = Math.random() * Math.PI * 2, d = 26 + Math.random() * (star ? 90 : 40);
      sp.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--c:' + colour + ';--dx:' + Math.cos(a) * d + 'px;--dy:' + Math.sin(a) * d + 'px';
      fx.appendChild(sp);
      setTimeout(() => sp.remove(), 750);
    }
  }
  function sparkAtNote(i) {
    if (!G.rows) return;
    const ri = G.rows.findIndex(x => i >= x.a && i < x.b); if (ri < 0) return;
    const row = G.rows[ri], svg = music.querySelectorAll('svg.score')[ri]; if (!svg) return;
    const r = svg.getBoundingClientRect(), ev = row.geo.evs[i - row.a];
    sparkAt(r.left + ev.cx, r.top + row.geo.yOf(ev.step), BAR[ev.p].colour, 8);
  }
  G.sparkAtNote = sparkAtNote;
  /* the word after a try (or a practice run: no stars, no points) */
  function showPraise(word, stars, pts, detail) {
    const el = $('#praise');
    el.innerHTML = '<b>' + word + (detail ? '<small>' + RR.esc(detail) + '</small>' : '') + '</b>' +
      (RR.device.stars && stars ? '<span class="p-stars">' + RR.starsHtml(stars, 3) + '</span>' : '') +
      (RR.device.points && pts ? '<span class="p-pts">+' + pts + '</span>' : '');
    el.className = 'praise'; void el.offsetWidth; el.className = 'praise show';
    const r = el.getBoundingClientRect();
    if (stars === 3 && RR.device.stars) sparkAt(r.left + r.width / 2, r.top + r.height / 2, '#fbbf24', 16, true);
    if (RR.device.points && pts && !reduced()) {
      const from = (el.querySelector('.p-pts') || el).getBoundingClientRect();
      setTimeout(() => {
        const chip = $('#score-chip').getBoundingClientRect();
        const f = document.createElement('div');
        f.className = 'fly'; f.textContent = '+' + pts;
        f.style.left = from.left + 'px'; f.style.top = from.top + 'px';
        $('#fx').appendChild(f);
        el.querySelector('.p-pts') && (el.querySelector('.p-pts').style.visibility = 'hidden');
        f.animate([{ transform: 'translate(0,0)', opacity: 1 },
          { transform: 'translate(' + (chip.left + chip.width / 2 - from.left - from.width / 2) + 'px,' + (chip.top - from.top) + 'px) scale(.6)', opacity: 0.2 }],
          { duration: 650, easing: 'ease-in' }).onfinish = () => {
          f.remove();
          const ch = $('#score-chip'); ch.classList.remove('bump'); void ch.offsetWidth; ch.classList.add('bump');
        };
      }, 450);
    }
  }
  function announce(text) { const a = $('#announce'); if (a) { a.textContent = ''; setTimeout(() => { a.textContent = text; }, 30); } }
  G.announce = announce;
})();

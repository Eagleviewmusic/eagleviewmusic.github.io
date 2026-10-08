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
   praise, then the next card (by itself, or the Next button glows), or
   Round done. The metronome (2026-10-06): a tap opens Slow · Moderate ·
   Fast; picking one in a Test counts in at once; in Practice it simply
   starts clicking (2026-10-07: no count-in — syncTick); it is Off again on
   every new melody — nothing ever counts in by itself.

   Which stage a card opens in (the user's rule): Practice — unless the
   player went to Test on the last card *before playing a note in
   Practice there*; then the next card opens in Test (they want to play
   without the practice). Practising, then testing, turns Practice back on.

   Start over (↻ beside Next): a card with notes played (or a try under
   way, or done) starts again; an untouched card starts the whole round
   again from the first melody, the round's points taken back. A card's
   try counts once in the round: trying it again replaces it.

   Battle Mode (2026-10-05): a battle session's teams take turns — `per`
   melodies a turn, every team once a round, `rounds` rounds; the whole
   battle is one long round (G.roundN = rounds × teams × per) whose entries
   carry their `team`. Board.js puts a card up at each turn (Go ▸), between
   rounds (the standings) and at the end (the winner). Every melody of the
   battle is planned when it starts (RR.Melody.battlePlan, 2026-10-06): in a
   round every team gets the same rhythms, reordered, with notes of matching
   difficulty; the rounds vary and mostly grow harder. Points go to the team,
   not the player's session total; with points off a battle counts gold
   stars. A battle in progress is kept in device.battle, so a reload can
   carry on.

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
      return m.kind === 'level' ? RR.levelKey(m.n) : m.kind === 'session' ? 'session:' + m.id : 'custom';
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
  /* the old Mine band's scores follow their practices into My sessions (levels.js), once */
  RR.Sessions.list().forEach(x => {
    if (!x.legacy) return;
    Object.keys(Scores.data.players).forEach(k => {
      const L = Scores.data.players[k] && Scores.data.players[k].levels;
      if (L && typeof L === 'object' && L[x.legacy] && !L['session:' + x.id]) L['session:' + x.id] = L[x.legacy];
    });
    Scores.save();
    RR.Sessions.dropLegacy(x.id);
  });

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
    battle: null, battleResume: false,   // Battle Mode: { teams, per, rounds } while a battle session plays
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
    if (m.kind === 'session') return (G.battle ? '⚔️ ' : '') + m.name;
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
  G.modeColour = () => G.mode.kind === 'level' ? RR.bandOf(G.mode.n).colour : G.mode.kind === 'lesson' ? '#7c3aed' : G.mode.kind === 'session' ? RR.SESSION_COLOUR : '#8a7563';

  function usePractice(practice, mode, battle) {
    G.mode = mode;
    G.setup = RR.sanitize(practice);
    G.battle = battle ? RR.cleanBattle(battle) : null;
    if (G.battle) G.setup.game = 'round5';      // a battle's length is its own (newRound); never Song or the clock
    if (mode.kind !== 'lesson') {
      if (mode.kind !== 'session') {          // the game this browser plays (see settings.js); a session keeps its own
        const g = RR.sanitize({ game: RR.device.game, clockSecs: RR.device.clockSecs, song: RR.device.song, songPicks: RR.device.songPicks });
        G.setup.game = g.game; G.setup.clockSecs = g.clockSecs; G.setup.song = g.song; G.setup.songPicks = g.songPicks;
      }
      G.setup.tricky = RR.device.tricky === true;
      // a melody set chosen to play (My melodies) is laid over the same way
      G.setup.set = RR.device.set && RR.Sets.get(RR.device.set) ? RR.device.set : null;
    }
    G.queue = []; G.songPtr = 0; G.contentChanged = false; G.roundChanged = false;
    G.fresh = true;
    if (mode.kind === 'level') { RR.device.level = mode.n; RR.device.practice = null; RR.saveDevice(); }
    else if (mode.kind === 'custom') { RR.device.practice = { kind: 'custom', from: mode.from || null, practice: G.setup }; RR.saveDevice(); }
    else if (mode.kind === 'session') { RR.device.practice = { kind: 'session', id: mode.id, practice: G.setup }; RR.saveDevice(); }
    applyInstrument();
    newRound();
  }
  G.usePractice = usePractice;
  G.selectLevel = n => usePractice(RR.practiceOfLevel(n), { kind: 'level', n });
  G.selectSession = function (id) {
    const x = RR.Sessions.get(id);
    if (x) usePractice(x.practice, { kind: 'session', id: x.id, name: x.name }, x.kind === 'battle' ? x.battle : null);
    return !!x;
  };
  /* a change in the Settings tabs: a session keeps it (it saves as you go);
     anything else becomes Custom (from …) */
  G.markCustom = function () {
    if (G.mode.kind === 'session') {
      RR.Sessions.update(G.mode.id, G.setup);
      RR.device.practice = { kind: 'session', id: G.mode.id, practice: G.setup }; RR.saveDevice();
      return;
    }
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
    // Songbook as the Melody Source with no songs of its own (a session): every song that fits
    const list = s.songs.length || s.from !== 'songbook' ? s.songs : Object.keys(RR.SONGS);
    return list.filter(id => RR.SONGS[id] && Array.from(RR.Melody.songNotes(id)).every(n => s.notes.includes(n)));
  }
  /* the Song format's songs, in order: Songbook songs and My melodies sets ('set:<id>'), any number —
     or the one song an older practice had */
  G.songPicks = function () {
    const s = G.setup;
    const ok = id => RR.SONGS[id] || (id.indexOf('set:') === 0 && RR.Sets.get(id.slice(4)) && RR.Sets.get(id.slice(4)).melodies.length);
    const list = (s.songPicks || []).filter(ok);
    return list.length ? list : [s.song || s.songs[0] || 'hot-cross-buns'];
  };
  /* each pick: its title, its cards and its notes */
  G.songItems = () => G.songPicks().map(id => {
    if (id.indexOf('set:') === 0) { const set = RR.Sets.get(id.slice(4)); return { id, title: set.title, cards: setCards(set), notes: RR.Sets.notesOf(set) }; }
    return { id, title: RR.SONGS[id].title, cards: RR.Melody.songCards(id), notes: RR.Melody.songNotes(id) };
  });
  function liveBars() {
    const s = G.setup, set = G.playingSet();
    if (set) return RR.Sets.notesOf(set);                       // a set: its own notes, nothing else
    const live = new Set(s.notes);
    if (s.game === 'song') G.songItems().forEach(x => x.notes.forEach(n => live.add(n)));
    else mixedSongs().forEach(id => RR.Melody.songNotes(id).forEach(n => live.add(n)));
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
    if (s.game === 'song') { G.songItems().forEach(x => G.queue.push.apply(G.queue, x.cards)); return; }
    if (songs.length) { G.queue.push.apply(G.queue, RR.Melody.songCards(songs[G.songPtr % songs.length])); G.songPtr++; }
    if (s.from !== 'songbook' || !songs.length) {
      for (let i = 0; i < 2; i++) { const m = RR.Melody.make(s, { recent: G.recent, stats: Scores.me().stats }); if (m) G.queue.push(m); }
    }
  }

  function newRound() {
    clearTimeout(G.autoT);
    stopClock();
    endlessDone();
    G.round = []; G.rstats = {}; G.overlay = false; G.dealt = []; G.needNew = false;
    G.roundStreak = G.streak;
    if (RR.Board) RR.Board.hideRound();
    const s = G.setup;
    const len = RR.roundLen(s.game);              // a round: 1–99 melodies
    if (s.game === 'song') { G.queue = []; refill(); G.roundN = G.queue.length; }
    else if (G.playingSet() && len) G.roundN = Math.min(len, G.playingSet().melodies.length) || len;
    else G.roundN = len || ((s.game === 'endless' || s.game === 'clock') ? Infinity : 5);
    G.clock = s.game === 'clock' ? { secs: s.clockSecs, started: null, notes: 0, melodies: 0, clean: 0, pts: 0, timer: null } : null;
    G.roundGame = G.battle ? 'battle' : s.game;
    G.battleResume = false;
    if (G.battle) {
      G.roundN = RR.battleTotal(G.battle);
      // a battle left part-way (a reload, the row picked again): carry on from where it was
      const saved = RR.device.battle;
      if (saved && saved.id === G.mode.id && saved.shape === battleShape() && Array.isArray(saved.round) &&
        saved.round.length > 0 && saved.round.length < G.roundN) {
        G.round = saved.round.map(e => Object.assign({}, e));
        G.battleResume = true;
        // the same melodies as before the reload, so the round stays fair
        G.battlePlan = Array.isArray(saved.plan) && saved.plan.length === G.roundN ? saved.plan : planBattle();
      } else { clearBattle(); G.battlePlan = planBattle(); }
    }
    nextCard();
  }
  G.newRound = newRound;

  /* an Endless run ends when another round starts (or the page closes): My stats keeps the longest */
  function endlessDone() {
    if (G.roundGame !== 'endless' || !G.round.length) return;
    RR.History.endless({ n: G.round.filter(e => !e.skip).length, pts: G.round.reduce((a, e) => a + (e.h ? e.h.p : 0), 0), gold: G.round.filter(e => e.gold).length });
  }
  window.addEventListener('pagehide', endlessDone);

  /* leaving the music for the home page or My stats: the sound stops, a count-in is called off, and
     Beat the clock — which can't wait — is over: Carry on starts a new one (G.needNew) */
  G.leave = function () {
    G.pause();
    if (G.clock && G.clock.started && G.phase !== 'done' && !G.overlay) { stopClock(); G.needNew = true; }
  };

  /* ---------------- Battle Mode ---------------- */
  const battleShape = () => G.battle.teams.length + '-' + G.battle.per + '-' + G.battle.rounds;
  /* the battle's melodies, planned at the start (melody.js) — none when a My melodies set is played */
  const planBattle = () => G.playingSet() ? null : RR.Melody.battlePlan(G.setup, G.battle);
  /* the notes or rhythms changed part-way (Settings): the rounds to come are planned again; this one stays as it was */
  G.replanBattle = function () {
    if (!G.battle) return;
    const fresh = planBattle(), old = G.battlePlan, now = G.battleNow().round, per = G.battle.teams.length * G.battle.per;
    G.battlePlan = fresh && old ? fresh.map((c, k) => Math.floor(k / per) <= now ? old[k] : c) : fresh;
    saveBattle();
  };
  function saveBattle() {
    if (!G.battle || G.mode.kind !== 'session') return;
    RR.device.battle = { id: G.mode.id, shape: battleShape(), plan: G.battlePlan || null,
      round: G.round.map(e => ({ team: e.team, pts: e.pts, stars: e.stars, made: !!e.made, gold: !!e.gold, skip: !!e.skip, label: e.label })) };
    RR.saveDevice();
  }
  function clearBattle() { if (RR.device.battle) { RR.device.battle = null; RR.saveDevice(); } }
  G.clearBattle = clearBattle;
  /* the slot being played (from 0), and where it falls */
  G.slot = () => G.cardEntry >= 0 ? G.cardEntry : G.round.length;
  G.battleNow = () => G.battle ? RR.battleAt(G.battle, Math.min(G.slot(), G.roundN - 1)) : null;
  /* each team's score so far: points (with points off, gold stars) and gold stars */
  G.teamScores = function () {
    const b = G.battle; if (!b) return [];
    return b.teams.map((t, i) => {
      const mine = G.round.filter(e => e.team === i);
      const pts = mine.reduce((a, e) => a + (e.pts | 0), 0), gold = mine.filter(e => e.gold).length;
      return { i, name: t.name, colour: t.colour, pts, gold, score: RR.device.points ? pts : gold };
    });
  };
  /* a battle's teams or shape changed in Settings: the names and colours at once; a new shape, a new battle */
  G.setBattle = function (b) {
    const old = G.battle && battleShape();
    G.battle = RR.cleanBattle(b);
    if (old !== battleShape()) G.roundChanged = true;
    draw();
  };

  function nextCard(card) {
    clearTimeout(G.autoT);
    closePick();
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    if (G.fresh) { G.fresh = false; G.openTest = false; } else leaveCard();
    if (G.battle && RR.battleAt(G.battle, G.round.length).q === 0) G.openTest = false;   // each team's turn starts afresh: Practice (if any)
    G.metro = 'off';                                       // every melody: tap the metronome and pick a tempo (the user's, 2026-10-06)
    syncTick();
    if (!card && G.battle && G.battlePlan) card = RR.clone(G.battlePlan[Math.min(G.round.length, G.roundN - 1)]);
    if (!card) { if (!G.queue.length) refill(); card = G.queue.shift(); }
    G.card = card; G.dealt.push(card);
    G.practisedHere = false; G.cardEntry = -1;
    resetCard(openingStage());
    draw();
    if (G.battle && RR.Board) RR.Board.battleCard();       // whose turn: a card with Go ▸
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
  const openingStage = () => G.setup.practice && G.setup.practiceStart !== 'off' && !G.clock && !G.openTest ? 'practice' : 'game';   // Practice Off (default): Test first

  /* the metronome */
  const metroOn = () => G.metro !== 'off';
  G.metroOn = metroOn;
  /* Listen's pace: the metronome's, or Slow when it's off (Make a melody and My melodies hear it so too) */
  RR.listenPace = () => metroOn() ? G.metro : 'slow';
  const windowOpen = () => !!document.querySelector('.modal:not([hidden]), .evm-shelf.show');
  /* a Test with the metronome on, waiting: count in — for Start over and the
     Space key only (2026-10-06: nothing counts in by itself any more) */
  function roll() {
    if (G.stage !== 'game' || !metroOn() || G.clock || G.overlay || G.phase !== 'ready' || G.started) return;
    if (windowOpen() || (RR.Maker && RR.Maker.active)) return;
    RR.Beat.start();
  }
  G.roll = roll;

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
    resetCard('game'); syncTick(); draw();
    if (metroOn()) RR.Beat.start();
    else announce('Test: play it for points.');
  };
  /* Test → Practice, at any point: a try under way is called off (it never
     counts), a pending move to the next card too — this card, in Practice */
  G.toPractice = function () {
    if (G.overlay || G.stage !== 'game' || !canPractise()) return;
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    clearTimeout(G.autoT);
    resetCard('practice'); draw(); syncTick();
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
    resetCard(practice ? 'practice' : undefined); draw(); syncTick();
    announce(practice ? 'Stopped. Practice: nothing counts.' : 'Stopped.');
  };
  /* Practice is there unless the practice has none, it's Beat the clock, or
     One go and the try has begun */
  const canPractise = () => G.setup.practice && !G.clock && !(G.setup.oneGo && G.started);

  /* the metronome (Battle Mode's way, everywhere since 2026-10-06): a tap opens
     a choice — Slow · Moderate · Fast (and Off while it is on) — and picking a
     tempo in a Test counts in at once. It goes back to Off on every new
     melody (nextCard) */
  G.metroTap = function () {
    if (G.overlay || G.clock) return;
    if (pickOpen()) { closePick(); return; }
    const s = G.setup, pick = $('#metro-pick');
    pick.innerHTML = (metroOn() ? '<button type="button" data-metro="off" class="off">Off</button>' : '') +
      RR.Points.PACES.map(p => '<button type="button" data-metro="' + p.id + '" class="' + (G.metro === p.id ? 'on' : '') + '">' +
        '<b>' + p.name + '</b><small>' + RR.beatTempo(s, p.id, G.card.time) + ' BPM</small></button>').join('');
    pick.hidden = false;
    $('#btn-metro').setAttribute('aria-expanded', 'true');
    const f = pick.querySelector('.on') || pick.querySelector('[data-metro]:not(.off)'); if (f) f.focus();
  };
  const pickOpen = () => !$('#metro-pick').hidden;
  function closePick() {
    const pick = $('#metro-pick'); if (pick.hidden) return;
    pick.hidden = true;
    $('#btn-metro').setAttribute('aria-expanded', 'false');
  }
  G.closePick = closePick; G.pickOpen = pickOpen;
  G.setMetro = id => { closePick(); setMetro(id); };
  /* a tempo picked (or Off): in a Test not yet finished the try starts again —
     counted in at the new pace, or the notes simply live */
  function setMetro(id) {
    if (G.overlay || G.clock) return;
    G.metro = ['off', 'slow', 'moderate', 'fast'].includes(id) ? id : 'off';
    if (G.hearing) stopHear(true);
    if (G.stage === 'game' && G.phase !== 'done' && !(G.setup.oneGo && G.started)) {
      RR.Beat.stop(); resetCard(); draw();
      if (metroOn()) RR.Beat.start();
    } else drawSides();
    syncTick();                                  // Practice: the click starts (or changes pace, or stops) at once
    announce(metroOn() ? 'Metronome: ' + RR.Points.paceOf(G.metro).name + (G.stage === 'practice' ? ', clicking' : '') : 'Metronome off');
  }

  /* the practice metronome (2026-10-07, the user's): clicking whenever the card is in Practice with the
     metronome on, the music on screen and nothing over it — no count-in; a Test counts in instead */
  function syncTick() {
    if (!RR.Beat || !RR.Beat.tickStart) return;
    const want = metroOn() && G.card && G.stage === 'practice' && !G.clock && !G.overlay &&
      G.phase !== 'countin' && G.phase !== 'running' && (!RR.View || RR.View.current === 'play') &&
      !windowOpen() && !(RR.Maker && RR.Maker.active);
    const now = RR.Beat.ticking();
    if (!want) { if (now) RR.Beat.tickStop(); }
    else if (now !== G.metro) RR.Beat.tickStart();
  }
  G.syncTick = syncTick;
  /* each click: the metronome button gives a little nod (the bar's first beat a bigger one) */
  G.metroBeat = function (accent) {
    if (reduced()) return;
    const m = $('#btn-metro');
    m.classList.remove('beat', 'beat1'); void m.offsetWidth;
    m.classList.add(accent ? 'beat1' : 'beat');
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
    } else if (G.battle) {
      // a battle: everything back to 0 — asked first
      if (!G.round.length) return;
      RR.ask('Start the whole battle over? Every team goes back to 0.', 'Start over').then(yes => {
        if (!yes) return;
        clearBattle(); G.queue = G.dealt.concat(G.queue); newRound();
        announce('The battle starts over.');
      });
    } else {
      // the round from its first melody: the same melodies, its points taken back (from My stats too)
      G.points -= G.round.reduce((a, r) => a + r.pts, 0);
      G.round.forEach(r => { if (r.h) RR.History.unmelody(r.h); });
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
    if (!G.battle) RR.History.note(note, first);     // My stats: a battle is the teams', not the player's
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
      addGhost(id, i);                        // ghost notes are always on (2026-10-06)
      if (s.glow === 'after2' && G.slipsHere >= 2) RR.Xylo.setGlow(ev.p);
      draw();
    }
  }

  /* Practice: the notes found — say so, then clear them to go again */
  function practiceFound() {
    G.phase = 'review';
    showMark(true, false, 0);
    announce('Got it! Go again, or tap Practice for the Test.');
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
      times: idx.map(i => G.times[i]), tries: idx.map(i => G.tries[i]), wrong: G.run ? G.run.wrong : 0, pace: G.run ? G.run.pace : 'slow' });
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
    const stars = RR.Points.starsFor(pts);                 // 1–3: the ladder's (the level list, Level n+1)
    // what the player sees: a green check — played through (with the metronome: no note missed) —
    // and a gold star from the practice's mark (over 10 points of 20, unless it says otherwise)
    const made = !G.run || noteIdx().every(i => G.judge[i] !== 'Missed');
    const gold = made && pts >= (s.gold || 11);
    G.clean = pts >= 8;                         // every note first time
    // a card counts once in the round: tried again (Start over, or back to Practice), the new try replaces it
    const again = G.cardEntry >= 0, old = again ? G.round[G.cardEntry] : null;
    if (!again) G.cardStreak = G.streak;
    G.streak = G.clean ? G.cardStreak + 1 : 0;
    G.bestStreak = Math.max(G.bestStreak, G.streak);
    if (G.clock && !again) { G.clock.melodies++; if (G.clean) G.clock.clean++; }
    if (!RR.device.points) pts = 0;
    const c = G.card;
    const entry = { stars, pts, made, gold, label: c.set ? '#' + c.part : c.title ? c.title.split(/[ ,]/)[0] + ' ' + c.part : 'Made up' };
    if (G.battle) { entry.team = G.battleNow().team; pts = r.pts; entry.pts = pts; }   // a battle's points go to the team, even with points off
    else {
      // My stats (history.js): the try, its points before Points off; a try again takes the old one back
      if (old && old.h) RR.History.unmelody(old.h);
      entry.h = RR.History.melody({ pts: r.pts, tier: r.tier, gold, made, pace: G.run ? G.run.pace : null });
      RR.History.streak(G.streak);
    }
    if (again) {
      if (!G.battle) G.points -= old.pts;
      if (G.clock) G.clock.pts -= old.pts;
      G.round[G.cardEntry] = entry;
    } else { G.cardEntry = G.round.length; G.round.push(entry); }
    if (!G.battle) G.points += pts;
    else saveBattle();
    if (G.clock) G.clock.pts += pts;
    const me = Scores.me();
    me.totals.melodies = (me.totals.melodies | 0) + 1;
    Scores.save();
    RR.Xylo.setGlow(null);
    showMark(made, gold, pts);
    announce(r.word + ' ' + (r.detail ? r.detail + '. ' : '') + (gold && RR.device.stars ? 'A gold star! ' : '') + (RR.device.points && pts ? pts + ' points.' : ''));
    if (RR.device.celebrate && made) RR.Sound.celebrate(gold ? 3 : 2);
    draw();
    if (G.clock) { G.autoT = setTimeout(() => nextCard(), 700); return; }
    if (G.round.length >= G.roundN) G.autoT = setTimeout(() => { leaveCard(); RR.Board.roundDone(); }, 1800);
    else if (s.auto) G.autoT = setTimeout(() => nextCard(), 1900);
    else $('#btn-next').classList.add('ready');
  }
  G.finish = finish;

  function next() {
    if (G.overlay) return;
    if (G.cardEntry < 0) {                       // never finished in a Test: skipped
      const e = { stars: 0, pts: 0, made: false, gold: false, skip: true, label: 'Skipped' };
      if (G.battle) e.team = G.battleNow().team;
      G.round.push(e);
      G.streak = 0;
      saveBattle();
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
  const canHear = () => !G.setup.playHidden && (G.phase === 'done' || G.stage === 'practice');   // Play button Disabled: never
  G.canHear = canHear;
  function hearIt() {
    if (G.hearing) { stopHear(true); return; }
    if (G.overlay || G.phase === 'countin' || G.phase === 'running' || !canHear()) return;
    if (!RR.Sound.ctx) return;
    const s = G.setup, spt = 60 / RR.paceTempo(s, RR.listenPace()) / 4;
    const M = RR.meter(G.card.time), pick = G.card.pickup || 0, beat = M.beatTicks * spt;
    // the practice metronome clicking: come in on its next bar line, with no clicks of Listen's own
    const join = RR.Beat.tickNextBar ? RR.Beat.tickNextBar(0.15 + pick * spt) : null;
    const lead = metroOn() && join == null ? M.barTicks - pick : 0;   // ticks of clicks before the music (a pick-up shortens it)
    const t0 = join != null ? join - pick * spt : RR.Sound.now() + 0.12 + lead * spt;
    G.hearing = true; $('#btn-play').classList.add('playing');
    $('#btn-play').setAttribute('aria-label', 'Stop');
    G.hearTimers = [];
    if (metroOn() && join == null) {
      // clicks aren't stoppable once made, so each is made just before it is due — on the bar's beats, from a bar before
      const total = G.evs.reduce((a, e) => a + e.t, 0);
      for (let tk = pick - M.barTicks; tk < total; tk += M.beatTicks) {
        const t = t0 + tk * spt, b = Math.round((tk - pick) / M.beatTicks), accent = ((b % M.beats) + M.beats) % M.beats === 0;
        G.hearTimers.push(setTimeout(() => RR.Sound.click(t, accent, false), Math.max(0, (t - RR.Sound.now() - 0.15) * 1000)));
      }
    }
    G.evs.forEach((ev, i) => {
      const t = t0 + ev.start * spt;
      if (!ev.rest) RR.Sound.playAt(ev.p, t);
      G.hearTimers.push(setTimeout(() => {
        // Animates music and bars: the note glows and its bar lights; Plays sounds only: neither
        if (s.playLights) { G.hearIdx = i; if (!ev.rest) RR.Xylo.flash(ev.p, 'demo', Math.min(380, ev.t * spt * 900)); }
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
    stopHear(true); closePick();
    if (RR.Beat && RR.Beat.tickStop) RR.Beat.tickStop();
    if (RR.Beat && (RR.Beat.running() || G.phase === 'countin' || G.phase === 'running')) { RR.Beat.stop(); resetCard(); draw(); }
  };
  G.hearIt = hearIt;
  G.stopHear = stopHear;

  /* Hear your song(s): every card of the Song format's songs (or the set played), one after another */
  let songTimers = [];
  G.songPlaying = false;
  G.hearSong = function (onEnd) {
    G.stopSong();
    const set = G.playingSet();
    const cards = set ? setCards(set) : [].concat.apply([], G.songItems().map(x => x.cards)); if (!cards.length || !RR.Sound.ctx) return;
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
      const card = G.card, barTicks = RR.meter(card.time).barTicks, pick = card.pickup || 0;
      const total = G.evs.reduce((a, e) => a + e.t, 0);
      const rowH = 2.7 + 4 + 2.9 + (s.labels !== 'none' ? 1.5 : 0);
      const age = RR.now() - G.justAt;
      const nextIdx = (G.phase === 'ready' && !G.hearing) ? G.idx : -1;
      const justLit = age < 450 ? G.justLit : -1;
      const ghosts = G.ghosts.map(g => ({ id: g.id, col: g.col, age: RR.now() - g.at }));
      // a two-bar melody on a narrow screen (a phone held upright) is drawn one bar above the other
      // (a pick-up stays with the first bar)
      const cutTick = pick + barTicks, cut = G.evs.findIndex(e => e.start >= cutTick);
      const split = fitW < 560 && total === 2 * barTicks && cut > 0 && G.evs[cut].start === cutTick;
      const ranges = split ? [[0, cut], [cut, G.evs.length]] : [[0, G.evs.length]];
      const subs = ranges.map(([a, b], r) => ({ a, b, startTick: r ? cutTick : 0, card: { time: card.time, pickup: r ? 0 : pick, notes: card.notes.slice(a, b) }, noTime: r > 0, endBar: split && r === 0 ? 'single' : 'final' }));
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
    const bn = G.battleNow();
    $('#tune-name').textContent = bn ? 'Round ' + (bn.round + 1) + ' of ' + G.battle.rounds :
      c.title ? c.title + ' · ' + (c.sub ? c.sub + ' · ' : '') + c.part + ' of ' + c.of : 'A made-up melody';
    // the round's dots, top centre: the card being played rings (a counted one being tried again too)
    const dots = [], here = G.cardEntry >= 0 ? G.cardEntry : G.round.length;
    // a battle: the team whose turn it is, and its melodies this turn; the music card wears its colour
    const stand = $('#stand');
    stand.classList.toggle('battle-on', !!bn);
    if (bn) {
      const t = G.battle.teams[bn.team], first = here - bn.q;
      stand.style.setProperty('--tc', t.colour);
      dots.push('<span class="turn-tag" style="--tc:' + t.colour + '">' + RR.esc(t.name) + '</span>');
      for (let i = first; i < first + G.battle.per; i++) {
        const r = G.round[i];
        dots.push('<span class="dot' + (r ? ' done ' + (r.gold && RR.device.stars ? 'gold' : r.made ? 'made' : r.skip ? 'skip' : 'miss') : '') + (i === here ? ' now' : '') + '"></span>');
      }
    } else if (isFinite(G.roundN) && G.roundN > 12) {
      // a long round: a count and a bar, not a row of dots
      dots.push('<span class="dots-count">' + Math.min(here + 1, G.roundN) + ' of ' + G.roundN + '</span><span class="dots-bar"><i style="width:' + (100 * G.round.length / G.roundN) + '%"></i></span>');
    } else if (isFinite(G.roundN)) {
      for (let i = 0; i < G.roundN; i++) {
        const r = G.round[i];
        dots.push('<span class="dot' + (r ? ' done ' + (r.gold && RR.device.stars ? 'gold' : r.made ? 'made' : r.skip ? 'skip' : 'miss') : '') + (i === here ? ' now' : '') + '"></span>');
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
    const bars = Math.round(total / RR.meter(c.time).barTicks);
    const name = c.title ? c.title + ', ' + (c.sub ? c.sub + ', ' : '') + c.part + ' of ' + c.of : 'A made-up melody';
    const bn = G.battleNow();
    return (bn ? G.battle.teams[bn.team].name + '’s turn. ' : '') + (G.stage === 'practice' ? 'Practice. ' : 'Test. ') + 'The music: ' + name + '. ' + RR.meterText(c.time) + ', ' + (c.pickup ? 'a pick-up and ' : '') + bars + (bars === 1 ? ' bar' : ' bars') + ', ' + notes + ' notes' +
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
    play.title = hear ? 'Listen' + (metroOn() ? ' — with the metronome' : '') : s.playHidden ? 'The Play button is off for this practice' : 'Listen comes back when the Test is done';
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
    m.setAttribute('aria-haspopup', 'true');
    $('#metro-label').textContent = on ? pace.name : 'Off';
    m.title = on ? 'Metronome: ' + pace.name + ' (' + RR.beatTempo(s, pace.id, G.card.time) + ' BPM)' + (practice ? ', clicking' : '') + ' — a Test counts you in, worth ' + pace.lo + '–' + pace.hi + ' points. Tap to change.' :
      'Metronome off. Tap to pick a tempo' + (practice ? ' — it clicks while you practise; a Test counts in' : ' — the count-in starts at once');
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
    $('#sc-stars').textContent = G.round.filter(r => r.gold).length;     // the round's gold stars
    $('#sc-points').textContent = G.points;
    $('#sc-streak').textContent = G.streak;
    $('#score-chip').classList.toggle('no-points', !RR.device.points);
    $('#score-chip').classList.toggle('no-stars', !RR.device.stars);
    // a battle: the score chip is the teams' scores, the team playing ringed
    const sc = $('#score-chip'), teams = $('#sc-teams');
    sc.classList.toggle('battle', !!G.battle);
    if (G.battle) {
      const bn = G.battleNow(), done = G.round.length >= G.roundN;
      teams.innerHTML = G.teamScores().map(t => '<span class="team-pill' + (!done && bn && bn.team === t.i ? ' on' : '') + '" style="--tc:' + t.colour + '" title="' + RR.esc(t.name) + '">' +
        '<i></i><b>' + RR.esc(t.name) + '</b><em>' + (RR.device.points ? t.pts : '★ ' + t.gold) + '</em></span>').join('');
      sc.setAttribute('aria-label', 'Score board: ' + G.teamScores().map(t => t.name + ' ' + t.score).join(', '));
    } else sc.setAttribute('aria-label', 'Score board');
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
  /* after a try: a gold star for a high score, or else a green check if it was
     played through — one or the other, never both — floating up and fading
     (2026-10-05; the words went to the screen reader). The points still fly
     to the score chip */
  function showMark(made, gold, pts) {
    const el = $('#praise'), star = gold && RR.device.stars;
    el.innerHTML = (star ? RR.STAR_SVG : made ? RR.CHECK_SVG : '') + (RR.device.points && pts ? '<span class="p-pts">+' + pts + '</span>' : '');
    if (!el.innerHTML) return;
    el.className = 'praise mark'; void el.offsetWidth; el.className = 'praise mark show';
    const r = el.getBoundingClientRect();
    if (star) { const st = el.querySelector('.mk-star').getBoundingClientRect(); sparkAt(st.left + st.width / 2, st.top + st.height / 2, '#fbbf24', 16, true); }
    else if (made) sparkAt(r.left + r.width / 2, r.top + r.height / 2, '#22c55e', 8);
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

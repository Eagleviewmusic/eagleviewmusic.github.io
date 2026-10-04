/* ==========================================================================
   Melody Reader — game.js
   --------------------------------------------------------------------------
   RR.Game — one card at a time (ENGINE §4; the points and the count-in
   since 2026-10-04: Melody Reader Design/POINTS-AND-COUNT-IN.md).

   A card has two stages. **Practice** (when the practice has it): hear it,
   try the bars — the notes light as they are found, nothing counts — or a
   practice count-in; I'm ready ▸ goes on. **The game**: the first bar
   struck starts a try on your own (judgeFind; tiers 1–2), or Count me in
   starts a run with the metronome (beat.js; tier 3). Once started, the try
   is the score. A try done → finish(): RR.Points, stars, the streak, the
   praise, then the next card (by itself, or the Next button glows), or
   Round done.

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
    G.round = []; G.rstats = {}; G.overlay = false;
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
    if (!card) { if (!G.queue.length) refill(); card = G.queue.shift(); }
    G.card = card;
    resetCard(openingStage());
    draw();
  }
  G.nextCard = nextCard;

  /* a card opens in Practice, unless the practice has none (the sight-reading
     levels) or it's Beat the clock */
  const openingStage = () => G.setup.practice && !G.clock ? 'practice' : 'game';

  /* the card from the top; a stage given = a new start (else the stage stays) */
  function resetCard(stage) {
    if (stage) { G.stage = stage; $('#btn-ready').classList.remove('ready'); }
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

  /* I'm ready ▸ — from Practice to the game: the notes dark again, ▶ gone */
  G.toGame = function () {
    if (G.overlay || G.stage !== 'practice') return;
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    resetCard('game'); draw();
    announce('Now for points. Play it on your own, or Count me in for more.');
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
    showPraise('Got it!', 0, 0, 'Go again — or I’m ready ▸');
    $('#btn-ready').classList.add('ready');
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
  /* Practice: a count-in run over (beat.js) — what it would have scored */
  G.practiceRun = function () {
    G.phase = 'review';
    const r = scoreRun();
    G.evs.forEach((ev, i) => { if (!ev.rest && G.judge[i] === 'Missed') G.states[i] = 'missed'; });
    draw();
    showPraise(r.tier === 3 ? 'All in time!' : r.word, 0, 0, 'That would be ' + r.pts + (r.pts === 1 ? ' point' : ' points') + (r.tier === 1 ? ' · ' + r.detail : ''));
    $('#btn-ready').classList.add('ready');
    practiceClear(2600);
  };

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
    if (G.clean) { G.streak++; G.bestStreak = Math.max(G.bestStreak, G.streak); } else G.streak = 0;
    if (G.clock) { G.clock.melodies++; if (G.clean) G.clock.clean++; }
    if (!RR.device.points) pts = 0;
    G.points += pts;
    if (G.clock) G.clock.pts += pts;
    const me = Scores.me();
    me.totals.melodies = (me.totals.melodies | 0) + 1;
    Scores.save();
    const c = G.card;
    G.round.push({ stars, pts, label: c.set ? '#' + c.part : c.title ? c.title.split(/[ ,]/)[0] + ' ' + c.part : 'Made up' });
    RR.Xylo.setGlow(null);
    showPraise(r.word, stars, pts, r.detail);
    announce(r.word + ' ' + (r.detail ? r.detail + '. ' : '') + (RR.device.stars ? stars + (stars === 1 ? ' star. ' : ' stars. ') : '') + (RR.device.points && pts ? pts + ' points.' : ''));
    if (RR.device.celebrate) RR.Sound.celebrate(stars);
    draw();
    if (G.clock) { G.autoT = setTimeout(() => nextCard(), 700); return; }
    if (G.round.length >= G.roundN) G.autoT = setTimeout(() => RR.Board.roundDone(), 1800);
    else if (s.auto) G.autoT = setTimeout(() => nextCard(), 1900);
    else $('#btn-next').classList.add('ready');
  }
  G.finish = finish;

  function next() {
    if (G.overlay) return;
    if (!(G.stage === 'game' && G.phase === 'done')) {     // Practice, or a try not finished: skipped
      G.round.push({ stars: 0, pts: 0, label: 'Skipped' });
      G.streak = 0;
    }
    if (G.round.length >= G.roundN) { stopHear(true); if (RR.Beat) RR.Beat.stop(); RR.Board.roundDone(); return; }
    nextCard();
  }
  /* the same melody again, from Practice (a new card in the round). A try
     under way is the score: Again waits for it */
  function again() {
    if (G.overlay || G.setup.oneGo) return;
    if (G.stage === 'game' && G.started && G.phase !== 'done') return;
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    clearTimeout(G.autoT);
    resetCard(openingStage()); draw();
  }
  G.next = next; G.again = again;

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

  /* ---------------- ▶ Play: hear the melody ---------------- */
  /* Practice's (unless Hear it in Practice is off), and after a try — never
     during one; at the chosen pace's tempo */
  const canHear = () => G.phase === 'done' || (G.stage === 'practice' && !G.setup.playHidden);
  G.canHear = canHear;
  function hearIt() {
    if (G.hearing) { stopHear(true); return; }
    if (G.overlay || G.phase === 'countin' || G.phase === 'running' || !canHear()) return;
    if (!RR.Sound.ctx) return;
    const s = G.setup, spt = 60 / RR.paceTempo(s, RR.device.pace) / 4;
    const t0 = RR.Sound.now() + 0.12;
    G.hearing = true; $('#btn-play').classList.add('playing');
    $('#btn-play').setAttribute('aria-label', 'Stop');
    G.hearTimers = [];
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
    $('#btn-play').setAttribute('aria-label', 'Play — hear the melody');
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
    const spt = 60 / RR.paceTempo(G.setup, RR.device.pace) / 4;
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
    const dots = [];
    if (isFinite(G.roundN)) {
      for (let i = 0; i < G.roundN; i++) {
        const r = G.round[i];
        dots.push('<span class="dot ' + (r ? 'done s' + r.stars : i === G.round.length ? 'now' : '') + '"></span>');
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
    return (G.stage === 'practice' ? 'Practice. ' : '') + 'The music: ' + name + '. ' + c.time[0] + '/4, ' + bars + (bars === 1 ? ' bar' : ' bars') + ', ' + notes + ' notes' +
      (lit ? ', ' + lit + ' played' : '') + (G.clean ? '' : ', with slips') + '.';
  }

  /* the buttons beside the music, by stage:
       Practice   ▶ Hear it · Count me in (a practice run) · I'm ready ▸ · Next
       the game   Count me in · Again (once the try is done) · Next; ▶ after the try
     and the pace pill (Slow · Moderate · Fast) under Count me in */
  function drawSides() {
    const app = $('#app'), s = G.setup, practice = G.stage === 'practice';
    const busy = G.phase === 'countin' || G.phase === 'running';
    app.classList.toggle('stage-practice', practice);
    app.classList.toggle('stage-game', !practice);
    app.classList.toggle('card-done', G.phase === 'done');
    app.classList.toggle('can-hear', canHear());
    $('#btn-count').disabled = !!G.clock || G.phase === 'done' || G.phase === 'review' || (!practice && G.started && !busy);
    $('#btn-again').disabled = !!s.oneGo || busy || (G.started && G.phase !== 'done');
    const pace = RR.Points.paceOf(RR.device.pace), pill = $('#pace');
    pill.innerHTML = '<b>' + pace.name + '</b>' + (practice ? '' : '<small>' + pace.lo + (pace.hi > pace.lo ? '–' + pace.hi : '') + '</small>');
    pill.disabled = busy || (!practice && G.started);
    pill.title = 'Count me in at ' + pace.name + ' (' + RR.paceTempo(s, pace.id) + ' BPM)' + (practice ? '' : ' — worth ' + pace.lo + '–' + pace.hi + ' points') + '. Tap to change.';
    pill.setAttribute('aria-label', pill.title);
    $('#count-label').textContent = busy ? 'Listen…' : 'Count me in';
    const tag = $('#stage-tag');
    tag.hidden = !!G.clock;
    tag.textContent = practice ? 'Practice' : 'For points';
    tag.className = 'stage-tag ' + (practice ? 'practice' : 'game');
    tag.title = practice ? 'Practice: nothing counts yet. Hear it, try it, then I’m ready ▸' : 'Play it on your own (up to 12 points), or Count me in for up to ' + pace.hi;
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

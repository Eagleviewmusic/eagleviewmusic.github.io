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
   (judgeFind); with the metronome on the family count-in starts at once
   and the run is the try (beat.js). Either way the try is scored the same
   (2026-10-13, points.js score: the notes and the player's own rhythm and
   tempo). A try done → finish(): RR.Points, stars, the streak, the
   praise, then the next card (by itself, or the Next button glows), or
   Round done. The metronome: started in Tools (beside the music in a
   battle) at the tempo dial's tempo (2026-10-13: 56–132, 72 to begin
   with — dial.js); in a Test it counts in at once; in Practice it simply
   starts clicking (2026-10-07: no count-in — syncTick); it is Off again on
   every new melody — nothing ever counts in by itself. The tempo stays
   for whatever is being played and goes back to 72 when something else
   is picked (usePractice); Listen plays at it too.

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
   'lit' · 'missed'), judge[i] (unused since 2026-10-12: a metronome run is
   followed in order like any try), times[i] (when it was struck, s),
   firstAt[i] (when the first bar was struck for it, right or wrong — its
   time for the rhythm, 2026-10-13), tries[i] (slips before it was found),
   idx (the next note, rests skipped), slips, slipsHere, run (a metronome
   run: its tempo), passOver (Teach Me
   to Read: a time round played through, lit until the next strike),
   stage ('practice' · 'game'), started,
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
      if (m.kind === 'teach') return 'teach:' + m.id;           // Teach Me to Read keeps no scores (its marks: teach-data.js)
      // a melody set played just this time — or on its own, from the home page — is its own score board (a session's own set is the session's)
      if ((G.over.set || m.kind === 'custom') && G.playingSet()) return 'set:' + G.setup.set;
      return m.kind === 'level' ? RR.levelKey(m.n) : m.kind === 'session' ? 'session:' + m.id : m.gen ? 'gen' : 'custom';
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
    mode: { kind: 'level', n: 1 },
    base: null,                   // the level's, session's (…) own settings: what its ✎ page shows and saves
    over: {},                     // just this time, on top: { set, game: { game, clockSecs, songPicks }, tricky }
    setup: null,                  // what is played: base + over (compose)
    contentChanged: false, roundChanged: false,
    card: null, evs: [], states: [], judge: [], times: [], firstAt: [], tries: [], idx: -1, clean: true, slips: 0, slipsHere: 0,
    stage: 'practice', started: false, run: null, result: null, practiceT: null,
    metro: 'off',                 // the metronome: 'off' · 'on' (Off on every new melody, and when the page opens)
    tempo: RR.TEMPO.DEFAULT,      // the tempo dial (2026-10-13): the metronome's and Listen's; 72 again when something else is picked
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
    if (G.mode.kind === 'teach') {                 // their own marks: their own place in it (a session played this way stays the session)
      if (G.mode.session && RR.Sessions.get(G.mode.session.id)) { G.selectSession(G.mode.session.id); return; }
      if (!RR.Teach.start(G.mode.id)) RR.Teach.start('L1'); return;
    }
    G.newRound();
  };
  const nextNote = from => { for (let i = from; i < G.evs.length; i++) if (!G.evs[i].rest) return i; return -1; };

  /* ---------------- choosing what to play ---------------- */
  function modeLabel(m) {
    if (m.kind === 'level') return 'Level ' + m.n + ' · ' + RR.LEVELS[m.n - 1].name;
    if (m.kind === 'session') return (G.battle ? '⚔️ ' : '') + m.name;
    if (m.kind === 'lesson') return 'Lesson · ' + m.name;
    if (m.kind === 'teach') {
      if (m.session) return m.session.name;                // a session played the Practice or Songs way (2026-10-12)
      const L = RR.teachLevel(m.id) || {};
      // Songs: the song (and the section); Practice (was Teach Me to Read, renamed 2026-10-12): its lesson, song or unit
      if (m.song) return '♪ ' + L.title + (L.ex && (m.from > 0 || m.to < L.ex.length - 1) ? ' · slides ' + (m.from + 1) + '–' + (m.to + 1) : '');
      return 'Practice · ' + L.title;
    }
    if (m.label) return m.label;                          // the home page's Generated, or a set of My melodies (2026-10-08)
    return 'Custom' + (m.from ? ' (from ' + m.from + ')' : '');
  }
  /* the melody set being played, if there is one (My melodies, or a lesson's) */
  G.playingSet = function () {
    const id = G.setup && G.setup.set;
    const rec = id ? RR.Sets.get(id) : null;
    return rec && rec.melodies.length ? rec : null;
  };
  // a set played just this time is named first ("Week 3 · Level 4"); a session's own set is the session's
  G.modeLabel = () => { const set = G.over.set ? G.playingSet() : null; return (set && G.mode.kind !== 'lesson' ? set.title + ' · ' : '') + modeLabel(G.mode); };
  G.modeColour = () => G.mode.kind === 'level' ? RR.bandOf(G.mode.n).colour : G.mode.kind === 'lesson' ? '#7c3aed' : G.mode.kind === 'session' ? RR.SESSION_COLOUR : G.mode.kind === 'teach' ? (G.mode.song ? '#7c3aed' : RR.TEACH_COLOUR) : '#8a7563';

  /* ---------------- choosing what to play (2026-10-08) ----------------
     The user's rule: "all the session's rules apply to that session, and
     then the new rules apply to the new session". Picking a level, a
     session, a battle or a lesson starts from nothing: its own settings
     (G.base) exactly as saved, a new round, the score chip at 0, no battle
     unless it is one, the metronome Off at 72, Practice as it says. Nothing that
     was playing before comes along — that used to leak (a battle's score,
     a set of My melodies, the browser's game).

     What is played "just this time" (G.over) sits on top and is never
     saved into the level or session: a My melodies set played from the ♫
     window, a format card on the home page (Rounds · Songs · Beat the
     Clock · Endless), Practise my tricky notes. It stays through a reload
     (device.practice.over) and ends the moment something else is picked. */
  const OVER_GAME = ['game', 'clockSecs', 'songPicks'];
  function cleanOver(o) {
    const out = {};
    if (!o || typeof o !== 'object') return out;
    if (typeof o.set === 'string' && RR.Sets.get(o.set)) out.set = o.set;
    if (o.game && typeof o.game === 'object') { const g = RR.sanitize(o.game); out.game = { game: g.game, clockSecs: g.clockSecs, songPicks: g.songPicks }; }
    if (o.tricky === true) out.tricky = true;
    return out;
  }
  /* base + just this time = what is played */
  function compose() {
    const s = RR.clone(G.base), o = G.over;
    if (o.game) OVER_GAME.forEach(k => { s[k] = RR.clone(o.game[k]); });
    // the melody set played: one picked just this time — or the practice's own My Melodies source
    // (not for a Song, which plays the songs picked)
    if (o.set) { s.from = 'set'; s.set = o.set; }
    else if (!(s.from === 'set' && s.game !== 'song' && s.set && RR.Sets.get(s.set))) s.set = null;
    s.tricky = !!o.tricky;
    if (G.battle) s.game = 'round5';            // a battle's length is its own (newRound); never Song or the clock
    return s;
  }
  G.compose = () => { G.setup = compose(); };
  /* where this browser keeps what is playing, for the next visit (a lesson is never kept) */
  function remember() {
    const m = G.mode, over = Object.keys(G.over).length ? RR.clone(G.over) : undefined;
    if (m.kind === 'level') { RR.device.level = m.n; RR.device.practice = { kind: 'level', n: m.n, over }; }
    else if (m.kind === 'session') RR.device.practice = { kind: 'session', id: m.id, over };
    else if (m.kind === 'custom') RR.device.practice = { kind: 'custom', from: m.from || null, label: m.label || undefined, gen: m.gen || undefined, practice: G.base, over };
    else if (m.kind === 'teach') RR.device.practice = Object.assign(m.song ? { kind: 'teach', id: m.id, at: RR.Teach.at, song: true, from: m.from, to: m.to, practice: !!m.practice, auto: m.auto !== false }
      : { kind: 'teach', id: m.id, at: RR.Teach.at }, m.session ? { session: m.session.id } : {});
    else return;
    RR.saveDevice();
  }
  G.remember = remember;

  function usePractice(practice, mode, battle, over) {
    // whatever was going on stops
    clearTimeout(G.autoT); clearTimeout(G.practiceT);
    closePick(); stopHear(true); G.stopSong();
    if (RR.Beat) { RR.Beat.stop(); if (RR.Beat.tickStop) RR.Beat.tickStop(); }
    if (RR.Tools) { RR.Tools.close(); RR.Tools.kbd(false); }
    if (RR.Teach) RR.Teach.cancelAuto();
    G.mode = mode;
    G.base = RR.sanitize(practice);
    if (mode.kind !== 'lesson') G.base.tricky = false;
    G.battle = battle ? RR.cleanBattle(battle) : null;
    G.battlePlan = null; G.battleResume = false;
    G.over = mode.kind === 'lesson' ? {} : cleanOver(over);
    if (G.over.game && OVER_GAME.every(k => JSON.stringify(G.over.game[k]) === JSON.stringify(G.base[k]))) delete G.over.game;   // its own format: nothing on top
    G.setup = compose();
    // a clean slate: this choice's own score, streak and melodies
    G.points = 0; G.streak = 0; G.bestStreak = 0; G.sessions = {};
    G.queue = []; G.recent = []; G.songPtr = 0; G.contentChanged = false; G.roundChanged = false;
    G.fresh = true; G.openTest = false; G.metro = 'off'; G.needNew = false;
    G.tempo = RR.TEMPO.DEFAULT;          // the user's (2026-10-13): a tempo changed is for this; anything new starts at 72
    remember();
    applyInstrument();
    newRound();
  }
  G.usePractice = usePractice;
  G.selectLevel = (n, over) => usePractice(RR.practiceOfLevel(n), { kind: 'level', n }, null, over);
  /* a session plays by its Format (2026-10-12): Practice and Songs the way their home cards play (teach.js,
     G.mode keeping the session: { kind: 'teach', …, session: { id, name } }); Rounds, Games and Battle on its
     own settings, as before. Its points — on or off — come with it (the Points switch is the browser's, and a
     session sets it) */
  G.selectSession = function (id, over, at) {
    const x = RR.Sessions.get(id);
    if (!x) return false;
    if (RR.device.points !== x.points) { RR.device.points = x.points; RR.saveDevice(); }
    const ses = { session: { id: x.id, name: x.name } };
    if (x.format === 'practice' && RR.Teach.start(x.teach.id, at, undefined, ses)) return true;
    if (x.format === 'songs' && RR.teachLevel(x.song.id)) {
      const n = RR.teachLevel(x.song.id).ex.length, s = x.song;
      const opt = { from: s.part ? s.from : 0, to: s.part ? s.to : n - 1, practice: s.practice, auto: s.auto };
      if (RR.Teach.start(x.song.id, typeof at === 'number' ? at : opt.from, opt, ses)) return true;
    }
    // (a Practice or Songs pick that has gone — a unit taken out, a set deleted — plays its own melodies instead)
    usePractice(x.practice, { kind: 'session', id: x.id, name: x.name }, x.kind === 'battle' ? x.battle : null, over);
    return true;
  };
  /* the session playing, if one is — on its own settings, or the Practice or Songs way */
  G.sessionId = () => G.mode.kind === 'session' ? G.mode.id : G.mode.kind === 'teach' && G.mode.session ? G.mode.session.id : null;
  /* what a new session or battle starts as: the settings of what is chosen (never "just this time") —
     a battle's are a battle's (Practice off), so from a battle the level last played */
  G.readingPractice = () => G.battle ? RR.practiceOfLevel(RR.device.level || 1) : RR.clone(G.base);

  /* a change on the ✎ page: saved into what is chosen — a level's own changes (Reset gives the level back),
     the session, a Custom practice. A lesson's settings are the lesson's */
  G.saveSetup = function () {
    const m = G.mode;
    if (m.kind === 'level') RR.LevelEdits.save(m.n, G.base);
    else if (m.kind === 'session') RR.Sessions.update(m.id, G.base);
    else if (m.gen) RR.device.gen = RR.clone(G.base);      // the next Generate starts from it
    remember();
  };
  /* a level back as it was made */
  G.resetLevel = function () {
    if (G.mode.kind !== 'level') return;
    RR.LevelEdits.reset(G.mode.n);
    G.selectLevel(G.mode.n, G.over);
  };

  /* just this time: a My melodies set (or none), a format (or none), tricky notes — a new round */
  G.playOnce = function (kind, value) {
    // Teach Me to Read has no "just this time": a set or a format from elsewhere plays over the level last played
    if (G.mode.kind === 'teach') { if (!value) return; G.selectLevel(RR.device.level || 1, kind === 'set' ? { set: value } : kind === 'game' ? { game: value } : {}); return; }
    if (kind === 'set') { if (value) G.over.set = value; else delete G.over.set; }
    else if (kind === 'game') {
      if (value) {
        const g = { game: G.base.game, clockSecs: G.base.clockSecs, songPicks: G.base.songPicks.slice() };
        Object.keys(value).forEach(k => { if (OVER_GAME.includes(k)) g[k] = RR.clone(value[k]); });
        const same = OVER_GAME.every(k => JSON.stringify(g[k]) === JSON.stringify(G.base[k]));
        if (same) delete G.over.game; else G.over.game = g;      // the choice's own format: nothing on top
        if (g.game === 'song') delete G.over.set;                 // a Song plays the songs picked
      } else delete G.over.game;
    } else if (kind === 'tricky') { if (value) G.over.tricky = true; else delete G.over.tricky; }
    G.setup = compose();
    remember();
    if (kind === 'tricky') { G.queue = []; return; }               // from the next melody
    G.tempo = RR.TEMPO.DEFAULT;                                     // other melodies: the tempo starts at 72 again
    G.queue = []; G.fresh = true;
    applyInstrument(); newRound();
  };
  /* the top drop-down (drop.js, 2026-10-08) changes an aspect of what is playing, not what is played:
     the songs of a Song — the ones played just this time, or the practice's own — a new round when it closes */
  G.setSongPicks = function (list) {
    if (G.over.game && G.over.game.game === 'song') G.over.game.songPicks = list.slice();
    else { G.base.songPicks = list.slice(); G.saveSetup(); }
    G.setup = compose(); remember();
    G.roundChanged = true;
  };
  /* …and the melody set played: one played just this time, a set played on its own, or the practice's own
     My Melodies (saved into the level or session) — a new round at once */
  G.switchSet = function (id) {
    const set = RR.Sets.get(id); if (!set) return;
    if (G.over.set) { G.playOnce('set', id); return; }
    G.base.from = 'set'; G.base.set = id;
    if (G.mode.kind === 'custom' && G.mode.label) G.mode.label = '♫ ' + set.title;
    G.saveSetup();
    G.setup = compose();
    G.queue = []; G.fresh = true; G.tempo = RR.TEMPO.DEFAULT;
    applyInstrument(); newRound();
  };

  /* the just-this-time things, in words (the home page and the ✎ page say what is on top) */
  G.overWords = function () {
    const o = G.over, out = [];
    if (o.game) out.push({ kind: 'game', text: RR.gameText(o.game) === 'Beat the clock' ? 'Beat the clock · ' + (o.game.clockSecs === 120 ? '2 min' : o.game.clockSecs + ' s') : RR.gameText(o.game) });
    if (o.set && RR.Sets.get(o.set)) out.push({ kind: 'set', text: '♫ ' + RR.Sets.get(o.set).title });
    if (o.tricky) out.push({ kind: 'tricky', text: 'Your tricky notes' });
    return out;
  };

  /* the practice's songs that can be mixed in: only those whose every note
     is in the practice (a Custom practice of line notes doesn't get Ode to Joy) */
  function mixedSongs() {
    const s = G.setup;
    if (s.from === 'made' || s.from === 'set') return [];
    // Songbook as the Melody Source with no songs of its own (a session): every song that fits
    const list = s.songs.length || s.from !== 'songbook' ? s.songs : Object.keys(RR.SONGS);
    return list.filter(id => RR.SONGS[id] && Array.from(RR.Melody.songNotes(id)).every(n => s.notes.includes(n)));
  }
  /* the Song format's songs, in order: Songbook songs and My melodies sets ('set:<id>'), any number —
     or the one song an older practice had */
  G.songPicks = function (practice) {
    const s = practice || G.setup;
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
    const n = RR.barsFor(live);                        // ten bars, twelve to high G, thirteen to high A
    if (RR.Xylo.count() !== n) RR.Xylo.build(n);
    RR.Xylo.setGreyed(s.grey ? live : null);
    RR.Xylo.setLabels(s.letters, s.nums);
    const app = $('#app');
    app.classList.toggle('no-play', !!s.playHidden);
    app.classList.toggle('game-clock', s.game === 'clock');
    app.classList.toggle('game-open', s.game === 'endless' || s.game === 'clock');
    app.classList.toggle('in-lesson', G.mode.kind === 'lesson');
    app.classList.toggle('teach-on', G.mode.kind === 'teach');
    app.classList.toggle('song-on', G.mode.kind === 'teach' && !!G.mode.song);        // Songs: its own Practice button
    // the buttons beside the music (2026-10-12): the metronome stands there only in a battle (elsewhere it is in
    // Tools); a battle can turn Tools off; no Practice button where there is no Practice
    app.classList.toggle('battle-mode', !!G.battle);
    app.classList.toggle('no-tools', !!(G.battle && G.battle.tools === false));
    app.classList.toggle('no-practice', !s.practice || s.game === 'clock');
  }
  G.applyInstrument = applyInstrument;
  G.liveBars = liveBars;

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
    if (!card && G.mode.kind === 'teach') card = RR.Teach.card();     // Teach Me to Read: the exercise it is on
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
    if (!G.card || !G.setup.practice || G.clock || G.mode.kind === 'teach') return;
    G.openTest = G.stage === 'game' && !G.practisedHere;
  }
  /* a card opens in Practice, unless the player has chosen to play without
     it (above), the practice has none (the sight-reading levels) or it's
     Beat the clock */
  const openingStage = () => G.setup.practice && G.setup.practiceStart !== 'off' && !G.clock && !G.openTest ? 'practice' : 'game';   // Practice Off (default): Test first

  /* the metronome */
  const metroOn = () => G.metro !== 'off';
  G.metroOn = metroOn;
  /* Listen's tempo: the dial's, the metronome on or off (2026-10-13, the user's: "this dial will effect the
     playback too"; Make a melody and My melodies hear it so too) */
  RR.listenTempo = () => G.tempo;
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
  /* keepMark: the check (or star) floating up after a melody goes on to its end */
  function resetCard(stage, keepMark) {
    if (stage) G.stage = stage;
    $('#btn-mode').classList.remove('ready');
    clearTimeout(G.practiceT);
    G.evs = RR.Eng.events(G.card).evs;
    G.states = G.evs.map(() => 'todo');
    G.judge = G.evs.map(() => null);
    G.times = G.evs.map(() => null);
    G.firstAt = G.evs.map(() => null);
    G.tries = G.evs.map(() => 0);
    G.idx = nextNote(0);
    G.clean = true; G.slips = 0; G.slipsHere = 0; G.started = false; G.run = null; G.result = null; G.passOver = false;
    G.phase = 'ready';
    G.ghosts = []; G.justLit = -1; G.hidden = false; G.hearIdx = -1;
    if (!keepMark) $('#praise').className = 'praise';
    RR.Xylo.setGlow(G.setup.glow === 'always' && G.idx >= 0 ? G.evs[G.idx].p : null);
    $('#btn-next').classList.remove('ready');
    $('#btn-restart').classList.remove('ready');
  }
  G.resetCard = resetCard;

  /* Practice → Test: the notes dark again and live; with the metronome on,
     the count-in starts at once */
  G.toGame = function () {
    if (G.overlay || G.stage !== 'practice' || G.mode.kind === 'teach') return;   // Teach Me to Read: no Test (the metronome is its way)
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    clearTimeout(G.autoT);
    resetCard('game'); syncTick(); draw();
    if (metroOn()) RR.Beat.start();
    else announce('Test: play it for points.');
  };
  /* Test → Practice, at any point: a try under way is called off (it never
     counts), a pending move to the next card too — this card, in Practice */
  G.toPractice = function () {
    if (G.overlay || G.stage !== 'game' || !canPractise() || G.mode.kind === 'teach') return;
    stopHear(true); if (RR.Beat) RR.Beat.stop();
    clearTimeout(G.autoT);
    resetCard('practice'); draw(); syncTick();
    announce('Practice: nothing counts.');
  };
  G.toggleMode = () => {
    if (G.mode.kind === 'teach') { if (G.mode.song) RR.Teach.togglePractice(); return; }    // Songs: Practice on / off
    if (G.stage === 'practice') G.toGame(); else G.toPractice();
  };
  /* the Get ready card tapped while it counts (or Escape): they want it to
     stop — back to Practice, the pause (or, with no Practice here, a Test
     waiting). The metronome stays as it was */
  G.stopCountIn = function () {
    if (G.phase !== 'countin') return;
    RR.Beat.stop();
    // Teach Me to Read: the metronome goes off — back to playing on your own
    if (G.mode.kind === 'teach') { G.metro = 'off'; resetCard('practice'); draw(); announce('Stopped. The metronome is off.'); return; }
    const practice = G.setup.practice && !G.clock;
    resetCard(practice ? 'practice' : undefined); draw(); syncTick();
    announce(practice ? 'Stopped. Practice: nothing counts.' : 'Stopped.');
  };
  /* Practice is there unless the practice has none, it's Beat the clock, or
     One go and the try has begun */
  const canPractise = () => G.setup.practice && !G.clock && !(G.setup.oneGo && G.started);

  /* the metronome beside the music — a battle's (elsewhere it is in Tools): a tap opens the tempo dial and a
     Start / Stop button (2026-10-13; it was a choice of Slow · Moderate · Fast). Starting it in a Test counts in
     at once. It goes back to Off on every new melody (nextCard) */
  const pickEl = $('#metro-pick');
  RR.Dial.bind(pickEl);
  G.metroTap = function () {
    if (G.overlay || G.clock) return;
    if (pickOpen()) { closePick(); return; }
    $('#btn-metro').classList.remove('hint');
    drawPick();
    pickEl.hidden = false;
    $('#btn-metro').setAttribute('aria-expanded', 'true');
    placePick();
    const f = pickEl.querySelector('.td-svg'); if (f) f.focus({ preventScroll: true });
  };
  function drawPick() {
    const on = metroOn(), time = G.card ? G.card.time : [4, 4];
    pickEl.innerHTML = '<div class="mp-head"><b id="mp-title">Metronome</b></div>' + RR.Dial.soundHtml(RR.Beat.soundNow(), time) +
      RR.Dial.html({ tempo: G.tempo, time, points: !!RR.device.points }) +
      '<button type="button" class="tl-go' + (on ? ' on' : '') + '" data-metro="' + (on ? 'off' : 'on') + '">' + (on ? '■ Stop the metronome' : '▶ Start the metronome') + '</button>';
  }
  /* beside the metronome, its middle level with it (kept on the screen); a phone: over the xylophone (style.css) */
  function placePick() {
    if (pickEl.hidden) return;
    if (window.innerWidth <= 700) { pickEl.style.left = ''; pickEl.style.top = ''; return; }
    const b = $('#btn-metro').getBoundingClientRect(), h = pickEl.offsetHeight;
    const top = Math.max(8, Math.min(window.innerHeight - h - 8, b.top + b.height / 2 - h / 2));
    pickEl.style.left = Math.round(b.right + 14) + 'px';
    pickEl.style.top = Math.round(top) + 'px';
    pickEl.style.setProperty('--ay', Math.round(b.top + b.height / 2 - top) + 'px');
  }
  window.addEventListener('resize', placePick);
  const pickOpen = () => !pickEl.hidden;
  function closePick() {
    if (pickEl.hidden) return;
    pickEl.hidden = true;
    $('#btn-metro').setAttribute('aria-expanded', 'false');
  }
  G.closePick = closePick; G.pickOpen = pickOpen;
  G.setMetro = id => { closePick(); setMetro(id); };
  /* the metronome started (or stopped): in a Test not yet finished the try starts again — counted in, or the
     notes simply live. `quiet`: a new tempo (setTempo says so itself) */
  function setMetro(id, quiet) {
    if (G.overlay || G.clock) return;
    G.metro = id && id !== 'off' ? 'on' : 'off';
    if (G.hearing) stopHear(true);
    // Teach Me to Read: started, it counts in at once (a play for a gold star); Off — playing on your own
    if (G.mode.kind === 'teach') {
      RR.Beat.stop(); clearTimeout(G.practiceT);
      resetCard(metroOn() ? 'game' : 'practice'); draw();
      if (metroOn()) RR.Beat.start();
      if (!quiet) announce(metroOn() ? 'Metronome on, ' + G.tempo + ' BPM. Play along for a gold star.' : 'Metronome off.');
      return;
    }
    if (G.stage === 'game' && G.phase !== 'done' && !(G.setup.oneGo && G.started)) {
      RR.Beat.stop(); resetCard(); draw();
      if (metroOn()) RR.Beat.start();
    } else drawSides();
    syncTick();                                  // Practice: the click starts (or changes tempo, or stops) at once
    if (!quiet) announce(metroOn() ? 'Metronome on, ' + G.tempo + ' BPM' + (G.stage === 'practice' ? ', clicking' : '') : 'Metronome off');
  }
  /* Click or Drum beat (2026-10-13; dial.js draws the choice in Tools and the battle's pop-up): kept where the
     look is (tools.js — the level's or session's, or Practice's look); a metronome going starts again with it */
  G.setBeatSound = function (v) {
    if (!['click', 'drums'].includes(v) || v === RR.Beat.soundNow()) return;
    RR.Tools.setLook('beat', v);
    G.beatChanged();
    if (pickOpen()) { drawPick(); const f = pickEl.querySelector('[data-beat="' + v + '"]'); if (f) f.focus(); }
    const none = v === 'drums' && G.card && !RR.Beat.hasDrums(G.card.time);
    announce(v === 'drums' ? 'Drum beat' + (none ? ' — none for ' + RR.meterText(G.card.time) + ' yet, so it clicks.' : '.') : 'Click.');
  };
  G.beatChanged = function () {
    if (!metroOn() || G.overlay || G.clock) { drawSides(); return; }
    RR.Beat.tickStop();
    setMetro('on', true);
  };
  /* the dial turned (dial.js): the tempo for what is playing, until something else is picked. A metronome
     going starts again at it — a Test or Teach Me to Read counts in again, Practice's click changes step */
  G.setTempo = function (v) {
    const t = RR.snapTempo(+v);
    if (t === G.tempo) return;
    G.tempo = t;
    if (metroOn() && !G.overlay && !G.clock) setMetro('on', true);
    else { if (G.hearing) stopHear(true); drawSides(); }
    announce('Tempo ' + t + ' BPM, ' + RR.Points.paceAt(t).name + (metroOn() ? '.' : ' — Listen plays at it.'));
  };

  /* the practice metronome (2026-10-07, the user's): clicking whenever the card is in Practice with the
     metronome on, the music on screen and nothing over it — no count-in; a Test counts in instead */
  function syncTick() {
    if (!RR.Beat || !RR.Beat.tickStart) return;
    const want = metroOn() && G.card && G.stage === 'practice' && !G.clock && !G.overlay && G.mode.kind !== 'teach' &&
      G.phase !== 'countin' && G.phase !== 'running' && (!RR.View || RR.View.current === 'play') &&
      !windowOpen() && !(RR.Maker && RR.Maker.active);
    const now = RR.Beat.ticking();
    if (!want) { if (now) RR.Beat.tickStop(); }
    else if (now !== RR.Beat.keyNow()) RR.Beat.tickStart();     // not clicking, or at another tempo or sound
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
    if (G.mode.kind === 'teach') { RR.Teach.again(); return; }
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
    if (RR.Tools && RR.Tools.kbdOn()) { RR.Tools.kbdHit(id); return; }   // the computer keyboard's picture: just for playing
    if (G.overlay) return;
    // Teach Me to Read: a play with the metronome that never got going (the sound didn't wake) — on your own instead
    if (G.mode.kind === 'teach' && G.stage === 'game' && G.phase === 'ready') { G.metro = 'off'; resetCard('practice'); }
    // Practice, the melody just found: the next bar struck starts it again at once, as its first note —
    // the check floats on over the music. (The user, 2026-10-08: with the practice metronome clicking,
    // strikes were ignored for 1.5 s, so the next downbeat was lost and the clear landed mid-melody.)
    if (G.phase === 'review' && G.stage === 'practice') { if (RR.Teach) RR.Teach.cancelAuto(); resetCard(undefined, true); }   // playing on: no Auto-Next
    if (G.phase === 'done' || G.phase === 'review') return;
    // with the metronome (2026-10-12, the user's: "just … click and … light the notes up in order"): a run is
    // followed like any try — the next note lights when its bar is struck, whenever that is; nothing is matched
    // to a click. Teach Me to Read's round and round: a time round played through stays lit until the next strike
    if (G.passOver) newPass();
    if (G.clock && !G.clock.started) startClock();
    judgeFind(id, e);
  }
  RR.Xylo.onHit = strike;

  function record(note, first) {
    if (G.mode.kind === 'teach') return;             // Teach Me to Read keeps no scores
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
    if (G.mode.kind === 'teach') return;
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
     time of each found note is kept for the rhythm — on the page's clock, not
     the audio's: only the spacing matters, and it works before the sound has
     woken. A note with a slip is timed by the first bar struck for it
     (firstAt, 2026-10-13: the user's "correct rhythms but miss a note" — a
     wrong bar played on its beat is the rhythm kept); not a stray in the
     count-in, before the music starts */
  function judgeFind(id, e) {
    const s = G.setup, i = G.idx, game = G.stage === 'game';
    if (i < 0) return;
    if (game && !G.started) { G.started = true; drawSides(); }
    if (!game) G.practisedHere = true;
    const ev = G.evs[i], at = (e && e.timeStamp > 0 ? e.timeStamp : performance.now()) / 1000;
    if (G.firstAt[i] == null && G.phase !== 'countin') G.firstAt[i] = at;
    if (id === ev.p) {
      lightNote(i);
      G.times[i] = at;
      if (G.firstAt[i] == null) G.firstAt[i] = at;
      G.tries[i] = G.slipsHere;
      if (game) record(ev.p, G.slipsHere === 0);
      G.slipsHere = 0;
      G.idx = nextNote(i + 1);
      RR.Xylo.setGlow(s.glow === 'always' && G.idx >= 0 ? G.evs[G.idx].p : null);
      draw(); sparkAtNote(i);
      if (G.idx < 0) {
        if (game && G.mode.kind === 'teach' && RR.Beat.running()) G.passDone();      // round and round: the click goes on
        else if (game) finish(); else practiceFound();
      }
    } else {
      G.clean = false; G.slips++; G.slipsHere++;
      if (game) mixup(ev.p, id);
      addGhost(id, i);                        // ghost notes are always on (2026-10-06)
      if (s.glow === 'after2' && G.slipsHere >= 2) RR.Xylo.setGlow(ev.p);
      draw();
    }
  }

  /* Practice: the notes found — say so (the check floats up), then clear them to go again. The next
     bar struck clears them at once (strike), so a player keeping the beat goes straight round again */
  function practiceFound() {
    G.phase = 'review';
    if (G.mode.kind === 'teach') { if (RR.Teach.found() !== false) practiceClear(1500); return; }   // a check (Songs: on to the next slide)
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
      resetCard(undefined, true); draw();
    }, ms);
  }

  /* the try, worth 1–20 (points.js score — the same with the metronome or without it since 2026-10-13: the
     notes, and the rhythm at the player's own tempo; the metronome's tempo only when they were with it) */
  function noteIdx() { return G.evs.map((e, i) => e.rest ? -1 : i).filter(i => i >= 0); }
  function scoreTry() {
    const idx = noteIdx();
    return RR.Points.score({ starts: idx.map(i => G.evs[i].start), times: idx.map(i => G.firstAt[i] != null ? G.firstAt[i] : G.times[i]),
      tries: idx.map(i => G.tries[i]), metro: G.run ? G.run.tempo : null });
  }

  /* ---------------- a melody done ---------------- */
  function finish() {
    const s = G.setup;
    G.phase = 'done';
    if (RR.Beat.running()) RR.Beat.stop(true);          // the melody played through: the click stops
    // Teach Me to Read: no points — the exercise gets its mark (teach.js)
    if (G.mode.kind === 'teach') {
      RR.Xylo.setGlow(null);
      RR.Teach.runDone();
      return;
    }
    const r = scoreTry();
    G.result = r;
    let pts = r.pts;
    const stars = RR.Points.starsFor(pts);                 // 1–3: the ladder's (the level list, Level n+1)
    // what the player sees: a green check — played through (with the metronome: no note missed) —
    // and a gold star from the practice's mark (over 10 points of 20, unless it says otherwise)
    const made = true;                          // every note was found to get here (nothing is missed by the clock since 2026-10-12)
    const gold = made && pts >= (s.gold || 11);
    G.clean = pts >= 8;                         // the streak: 8 and up (every note first time, or in rhythm)
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
      entry.h = RR.History.melody({ pts: r.pts, tier: r.tier, gold, made, pace: r.pace });   // pace: the player's, when in rhythm
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
  /* Teach Me to Read with the metronome goes round and round (beat.js, 2026-10-11): each time round is marked
     like a play of its own (RR.Teach.runDone), then the notes go dark for the next — the run, its click and
     its count carry on */
  G.passDone = function () {
    const card = G.card;
    RR.Teach.runDone(true);
    if (G.card !== card) return;                // Auto-Next (or Songs) moved on to the next one, the click going on
    G.passOver = true;                          // lit, as played, until the next bar is struck (strike → newPass)
    RR.Xylo.setGlow(null);
    draw();
  };
  /* Teach Me to Read's Auto-Next with the metronome (2026-10-12): the next exercise in the same run — the click
     goes on. Only in the same meter (the click's beats stay right); false: the caller deals it afresh */
  G.swapCard = function (card) {
    if (!card || !RR.Beat.running() || !G.run || !G.card || card.time.join('/') !== G.card.time.join('/')) return false;
    const run = G.run;
    G.card = card; G.dealt.push(card); G.cardEntry = -1;
    resetCard('game');
    G.run = run; G.started = true; G.phase = 'running';
    draw();
    return true;
  };
  /* the next time round: the notes dark again, followed from the first */
  function newPass() {
    G.passOver = false;
    G.states = G.evs.map(() => 'todo'); G.judge = G.evs.map(() => null); G.times = G.evs.map(() => null); G.firstAt = G.evs.map(() => null); G.tries = G.evs.map(() => 0);
    G.idx = nextNote(0); G.clean = true; G.slips = 0; G.slipsHere = 0; G.ghosts = []; G.justLit = -1;
    RR.Xylo.setGlow(G.setup.glow === 'always' && G.idx >= 0 ? G.evs[G.idx].p : null);
  }

  function next() {
    if (G.overlay) return;
    if (G.mode.kind === 'teach') { RR.Teach.next(); return; }
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
     during one. At the tempo dial's tempo — and with the metronome on, its
     clicks too: a bar of them first, then on every beat (Off: no clicks) */
  // Play button Disabled: never. Teach Me to Read: any time (playing along with the metronome stops for it), but not
  // while the computer keyboard shows
  const canHear = () => !G.setup.playHidden && !(RR.Tools && RR.Tools.kbdOn()) && (G.mode.kind === 'teach' || G.phase === 'done' || G.stage === 'practice');
  G.canHear = canHear;
  function hearIt() {
    const teach = G.mode.kind === 'teach';
    if (G.hearing) {
      stopHear(true);
      if (teach && metroOn() && G.stage === 'game') $('#btn-restart').classList.add('ready');   // ↻ to play along again
      return;
    }
    if (G.overlay || (!teach && (G.phase === 'countin' || G.phase === 'running')) || !canHear()) return;
    if (!RR.Sound.ctx) return;
    // Teach Me to Read: Listen while playing along with the metronome — the play-along stops, Listen plays
    // with the metronome's clicks; ↻ comes back to playing along
    if (teach && (RR.Beat.running() || G.phase === 'countin' || G.phase === 'running')) { RR.Beat.stop(); resetCard('game'); G.phase = 'done'; }
    const s = G.setup, spt = 60 / RR.listenTempo() / 4;
    const M = RR.meter(G.card.time), pick = G.card.pickup || 0;
    const total = G.evs.reduce((a, e) => a + e.t, 0);
    // the practice metronome clicking: come in on its next bar line, with no clicks of Listen's own
    const join = RR.Beat.tickNextBar ? RR.Beat.tickNextBar(0.15 + pick * spt) : null;
    const lead = metroOn() && join == null ? M.barTicks - pick : 0;   // ticks of clicks before the music (a pick-up shortens it)
    const t0 = join != null ? join - pick * spt : RR.Sound.now() + 0.12 + lead * spt;
    G.hearing = true; $('#btn-play').classList.add('playing');
    $('#btn-play').setAttribute('aria-label', 'Stop');
    G.hearTimers = [];
    // Teach Me to Read (2026-10-11, the user's: "do not stop it after 1 round, let it repeat" — a class can
    // read the board and play along on real xylophones): round and round, each time straight after the
    // last, until Listen is pressed again. Elsewhere it plays once
    const loop = teach;
    let prev = [];
    function pass(k, tStart) {
      const mine = [];
      if (metroOn() && join == null) {
        // the metronome's sound (the click, or the drum beat — 2026-10-13): none is stoppable once made, so each is
        // made just before it is due — on the bar's grid, from a bar before (counted with clicks; the drums come in
        // at the first full bar)
        RR.Beat.span(G.card.time, k ? 0 : pick - M.barTicks, total, pick, k ? -Infinity : pick, k * Math.round(total / M.barTicks)).forEach(x => {
          const t = tStart + x.tk * spt;
          mine.push(setTimeout(() => RR.Beat.sound(x.h, t, spt), Math.max(0, (t - RR.Sound.now() - 0.15) * 1000)));
        });
      }
      G.evs.forEach((ev, i) => {
        const t = tStart + ev.start * spt;
        if (!ev.rest) RR.Sound.playAt(ev.p, t);
        mine.push(setTimeout(() => {
          // Animates music and bars: the note glows and its bar lights; Plays sounds only: neither
          if (s.playLights) { G.hearIdx = i; if (!ev.rest) RR.Xylo.flash(ev.p, 'demo', Math.min(380, ev.t * spt * 900)); }
          draw();
        }, Math.max(0, RR.Sound.heardAt(t) - RR.now())));
      });
      const end = tStart + total * spt;
      if (loop) mine.push(setTimeout(() => pass(k + 1, end), Math.max(0, RR.Sound.heardAt(end) - RR.now() - 600)));   // the next time round, a little ahead
      else mine.push(setTimeout(() => stopHear(false), Math.max(0, RR.Sound.heardAt(end) - RR.now()) + 60));
      // the timers still to come: this time round's and the last's (every earlier one has gone off)
      G.hearTimers = prev.concat(mine); prev = mine;
    }
    pass(0, t0);
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
    if (RR.Beat && (RR.Beat.running() || G.phase === 'countin' || G.phase === 'running')) {
      RR.Beat.stop();
      if (G.mode.kind === 'teach') { G.metro = 'off'; resetCard('practice'); } else resetCard();
      draw();
    }
  };
  G.hearIt = hearIt;
  G.stopHear = stopHear;

  /* Hear your song(s): every card of the Song format's songs (or the set played), one after another */
  let songTimers = [];
  G.songPlaying = false;
  G.hearSong = function (onEnd, only) {
    G.stopSong();
    const set = G.playingSet();
    // `only`: these cards (Songs' end card: the song, or the section played)
    const cards = only || (set ? setCards(set) : [].concat.apply([], G.songItems().map(x => x.cards))); if (!cards.length || !RR.Sound.ctx) return;
    const spt = 60 / RR.listenTempo() / 4;
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
      // Teach Me to Read (2026-10-11, the user's: "make the notation larger and clearer"): less room above and
      // below the staff, the notes a little closer, and one row or two — whichever draws it bigger
      // every mode since 2026-10-12 (the user's: "I really like the way the Teach Me to Read section looks … implement
      // it in the other sections"): the tight rows, one row or two — whichever is bigger — and Tools' staff lines
      const teach = !!card.teach, big = true;
      const staff = RR.Tools ? RR.Tools.staff() : null;     // its notes' lines lit, all five, or plain
      const rowH = RR.Eng.rowSpaces(big, s.labels !== 'none');
      const age = RR.now() - G.justAt;
      const nextIdx = ((G.phase === 'ready' || G.phase === 'running') && !G.hearing && !G.passOver) ? G.idx : -1;   // a run shows it too, as on your own (2026-10-12)
      const justLit = age < 450 ? G.justLit : -1;
      const ghosts = G.ghosts.map(g => ({ id: g.id, col: g.col, age: RR.now() - g.at }));
      // a two-bar melody on a narrow screen (a phone held upright) is drawn one bar above the other
      // (a pick-up stays with the first bar)
      const cutTick = pick + barTicks, cut = G.evs.findIndex(e => e.start >= cutTick);
      const canSplit = total === 2 * barTicks && cut > 0 && G.evs[cut].start === cutTick;
      const fill = big ? 0.8 : 0.95;
      const plan = sp => {
        const ranges = sp ? [[0, cut], [cut, G.evs.length]] : [[0, G.evs.length]];
        const subs = ranges.map(([a, b], r) => ({ a, b, startTick: r ? cutTick : 0, card: { time: card.time, pickup: r ? 0 : pick, notes: card.notes.slice(a, b) }, noTime: r > 0, endBar: sp && r === 0 ? 'single' : 'final' }));
        const widest = Math.max.apply(null, subs.map(x => { const m = RR.Eng.measure(x.card, false, x.noTime); return m.prefix + m.notes * fill + m.fixed; }));
        return { split: sp, subs, ss: Math.max(8, Math.min(fitH / (rowH * subs.length), fitW / widest, sp && !big ? 26 : 46)) };   // 46: a smartboard's big staff
      };
      let lay = plan(canSplit && fitW < 560);
      if (big && canSplit) { const other = plan(!lay.split); if (other.ss > lay.ss * 1.04) lay = other; }
      const split = lay.split, subs = lay.subs, ss = lay.ss;
      const shift = (i, a, b) => (i >= a && i < b ? i - a : -1);
      // a metronome run is drawn like any try (2026-10-12): the next note's glow, ghost notes for slips
      G.rows = subs.map(x => Object.assign(x, {
        geo: RR.Eng.render(x.card, {
          ss, maxW: fitW, maxStretch: split ? 3 : 1.9, noTime: x.noTime, endBar: x.endBar,
          colour: s.colour, states: G.states.slice(x.a, x.b),
          nextIdx: shift(nextIdx, x.a, x.b), hearIdx: shift(G.hearIdx, x.a, x.b), justLit: shift(justLit, x.a, x.b), justAge: age,
          labels: s.labels, lines: staff ? staff.lines : null, ledgers: staff ? staff.ledgers : null, tight: big,
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
      c.teach ? (c.title ? c.title + ' · ' + c.part + ' of ' + c.of : 'Exercise ' + c.part + ' of ' + c.of) :
      c.title ? c.title + ' · ' + (c.sub ? c.sub + ' · ' : '') + c.part + ' of ' + c.of : 'A made-up melody';
    // the round's dots, top centre: the card being played rings (a counted one being tried again too)
    const dots = [], here = G.cardEntry >= 0 ? G.cardEntry : G.round.length;
    // a battle: the team whose turn it is, and its melodies this turn; the music card wears its colour
    const stand = $('#stand');
    stand.classList.toggle('battle-on', !!bn);
    const dotsEl = $('#dots');
    dotsEl.classList.toggle('teach-dots', G.mode.kind === 'teach');
    if (G.mode.kind === 'teach') dotsEl.removeAttribute('aria-hidden'); else dotsEl.setAttribute('aria-hidden', 'true');
    if (G.mode.kind === 'teach') dots.push(RR.Teach.dotsHtml());       // the five exercises: check, gold star, or not yet — a tap goes to one
    else if (bn) {
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
    const name = c.teach ? (c.title ? c.title + ', ' : '') + 'exercise ' + c.part + ' of ' + c.of : c.title ? c.title + ', ' + (c.sub ? c.sub + ', ' : '') + c.part + ' of ' + c.of : 'A made-up melody';
    const bn = G.battleNow();
    return (bn ? G.battle.teams[bn.team].name + '’s turn. ' : '') + (G.mode.kind === 'teach' ? '' : G.stage === 'practice' ? 'Practice. ' : 'Test. ') + 'The music: ' + name + '. ' + RR.meterText(c.time) + ', ' + (c.pickup ? 'a pick-up and ' : '') + bars + (bars === 1 ? ' bar' : ' bars') + ', ' + notes + ' notes' +
      (lit ? ', ' + lit + ' played' : '') + (G.clean ? '' : ', with slips') + '.';
  }

  /* the controls, by stage:
       under the music   ▶ Listen (Practice, or a try done) · Practice / Test · the metronome
       beside it         ↻ Start over · Next */
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
    // the metronome (a battle's, beside the music): lit when on, its tempo under it
    const on = metroOn(), m = $('#btn-metro');
    m.classList.toggle('on', on);
    m.disabled = !!G.clock;
    m.setAttribute('aria-haspopup', 'true');
    $('#metro-label').textContent = on ? G.tempo + ' BPM' : 'Off';
    const drums = RR.Beat.soundNow() === 'drums' && RR.Beat.hasDrums(G.card.time);
    m.title = on ? 'Metronome: ' + G.tempo + ' BPM, ' + RR.Points.paceAt(G.tempo).name + (drums ? ', the drum beat' : '') + (practice ? ', playing' : '') + '. Tap to change the tempo or stop it.' :
      'Metronome off (' + G.tempo + ' BPM). Tap to start it or turn the dial' + (practice ? ' — it clicks while you practise; a Test counts in' : ' — the count-in starts at once');
    m.setAttribute('aria-label', m.title);
    // the weight up the arm: higher is slower (Off: halfway)
    const w = on ? 0.8 - 0.48 * RR.tempoIndex(G.tempo) / (RR.TEMPO.MARKS.length - 1) : 0.55;
    $('#metro-weight').setAttribute('transform', 'translate(' + (12 + 5.6 * w).toFixed(2) + ' ' + (15.2 - 11.6 * w).toFixed(2) + ') rotate(25.8)');
    // ↻ Start over
    const r = $('#btn-restart'), touched = cardTouched();
    r.disabled = touched && !canRestartCard();
    r.title = touched ? 'Start this melody over' : 'Start the round over, from the first melody';
    r.setAttribute('aria-label', r.title);
    const nx = $('#btn-next');
    nx.disabled = false; nx.classList.remove('teach-ok');
    $('.next-label').textContent = 'Next';
    if (G.mode.kind === 'teach') RR.Teach.drawSides();       // no Test, no score; Next once the exercise is played through
    if (RR.Tools) RR.Tools.drawButton();                     // Tools, in every mode (2026-10-12)
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
    } else { teams.innerHTML = ''; sc.setAttribute('aria-label', 'Score board'); }   // no battle: no teams left behind
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
  G.sparkAt = sparkAt;
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

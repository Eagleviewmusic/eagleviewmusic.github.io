/* ==========================================================================
   Melody Reader — levels.js
   --------------------------------------------------------------------------
   The fifteen levels in six rainbow bands — redone 2026-10-07 in a music
   teacher's order (the user's sequences): the notes as solfège, C = Do —
   Mi So, La, Do, Re, high Do, Fa, Ti, the octave (and La-based tunes),
   then D E, F, G above high C, then leaps of a 4th, a 5th, both, and at
   Level 15 the whole xylophone with major 6ths too. The rhythms, a step
   every two levels: ta ti-ti · sh · ta-a · ti-ri-ti-ri · sh-sh ta-a-a-a ·
   syn-co-pa tam-ti · ti-ti-ri ti-ri-ti · 6/8 and pick-ups (14–15). Every
   melody is made up (no Songbook cards in the levels). Each level's new
   note and new rhythm come up more often (`focus`).
   A level is only data: a practice — the same choices the Settings tabs
   edit (ENGINE §2.3) — plus its number, band and name.

   RR.DEFAULTS     what a practice is when nothing says otherwise
   RR.LEVELS       the ladder
   RR.BANDS        Red … Violet
   RR.sanitize(p)  any practice from storage or a link, made safe: unknown
                   fields dropped, every value checked, defaults filled in
   RR.levelKey(n)  where a level's scores are kept: 'lv2:n' — the ladder
                   started fresh with the new levels (the old '1'…'15'
                   stay in storage, unused)
   RR.LevelEdits   your own changes to a level, kept and played every time
                   (2026-10-08); RR.originalLevel(n) is the level as made,
                   RR.practiceOfLevel(n) the level as it plays
   RR.Sessions     My sessions — your own named practices, top of the
                   level list (2026-10-05; were the Mine band); Battle Mode
                   sessions among them (RR.cleanBattle, RR.battleAt)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;

  RR.BANDS = [
    { id: 'red', name: 'Red', title: 'First notes', colour: '#ef4444', about: 'Mi and So, then La and Do' },
    { id: 'orange', name: 'Orange', title: 'Pentatonic and beyond', colour: '#f97316', about: 'Re, high Do, then Fa — the first half step' },
    { id: 'yellow', name: 'Yellow', title: 'The whole scale', colour: '#eab308', about: 'Ti, then the full octave and La-based tunes' },
    { id: 'green', name: 'Green', title: 'Above high C', colour: '#22c55e', about: 'D and E, then F, then G at the top of the staff' },
    { id: 'blue', name: 'Blue', title: 'Leaps', colour: '#3b82f6', about: 'Jumps of a 4th, then a 5th, across a wider range' },
    { id: 'violet', name: 'Violet', title: '6/8 and everything', colour: '#8b5cf6', about: 'Compound time, pick-ups, the whole xylophone' }
  ];
  RR.SESSION_COLOUR = '#0d9488';

  RR.DEFAULTS = {
    notes: ['C4', 'D4', 'E4', 'F4', 'G4'], moves: 'steps', endDo: true, tricky: false, grey: false,
    rhythms: ['q', 'h'], time: [4, 4], bars: 1, endLong: true,
    times: [[4, 4]], pickup: false,                                    // times: each melody's meter, one of these (time = the first); pickup: half the melodies start with one
    leaps: ['P4', 'P5'], endLa: false, focus: [],                      // leaps (with Leaps too): 'P4' 'P5' 'M6'; endLa: half the melodies La-based; focus: a level's new notes and rhythms, more often
    tempos: [60, 80, 100], practice: true, practiceStart: 'on', oneGo: false, flash: 0,   // practiceStart: 'off' = each melody starts in Test     // the metronome: Slow · Moderate · Fast (POINTS-AND-COUNT-IN.md)
    gold: 11,                                                          // a gold star from this many points (of 20): over 10
    game: 'round5', clockSecs: 60, song: null, songPicks: [], from: 'both', auto: true,   // songPicks: the Song format's songs ('ode', 'set:<id>'), in order
    colour: 'always', letters: true, nums: true, glow: 'after2', labels: 'none',   // labels: 'none' · 'letters' · 'solfege'
    playHidden: false, playLights: true,
    songs: [], set: null
  };

  /* the rhythm steps (the user's sequence), each a step on from the last */
  const R1 = ['q', 'ee'], R2 = R1.concat('qr'), R3 = R2.concat('h'), R4 = R3.concat('ssss'), R5 = R4.concat('hr', 'w'),
    R6 = R5.concat('eqe', 'dqe'), R7 = R6.concat('ess', 'sse');
  const SIX8 = ['c3', 'cqe', 'ceq', 'cdq', 'cdh', 'cdqr'];
  const PENTA = ['C4', 'D4', 'E4', 'G4', 'A4'];
  const OCTAVE = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
  const TO = top => RR.TWELVE.slice(0, RR.TWELVE.indexOf(top) + 1);
  // every level: generated melodies only (from: 'made', no songs)
  const L = o => { if (o.time && !o.times) o.times = [o.time]; return Object.assign(RR.clone(RR.DEFAULTS), { from: 'made' }, o); };
  const LIT = { colour: 'lit', glow: 'never', auto: false };
  RR.LEVELS = [
    L({ n: 1, band: 'red', name: 'Mi and So', notes: ['E4', 'G4'], rhythms: R1, grey: true }),
    L({ n: 2, band: 'red', name: 'Add La', notes: ['E4', 'G4', 'A4'], rhythms: R1, grey: true, focus: ['A4'] }),
    L({ n: 3, band: 'red', name: 'Add Do', notes: ['C4', 'E4', 'G4', 'A4'], rhythms: R2, focus: ['C4', 'qr'] }),
    L({ n: 4, band: 'orange', name: 'Add Re', notes: PENTA, rhythms: R2, bars: 2, colour: 'lit', focus: ['D4'] }),
    L({ n: 5, band: 'orange', name: 'High Do', notes: PENTA.concat('C5'), rhythms: R3, bars: 2, colour: 'lit', focus: ['C5', 'h'] }),
    L({ n: 6, band: 'orange', name: 'Add Fa', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'], rhythms: R3, bars: 2, colour: 'lit', focus: ['F4'] }),
    L(Object.assign({ n: 7, band: 'yellow', name: 'Add Ti', notes: OCTAVE, rhythms: R4, focus: ['B4', 'ssss'] }, LIT)),
    L(Object.assign({ n: 8, band: 'yellow', name: 'The whole octave', notes: OCTAVE, rhythms: R4, bars: 2, moves: 'skips', endLa: true }, LIT)),
    L(Object.assign({ n: 9, band: 'green', name: 'Up to high E', notes: TO('E5'), rhythms: R5, bars: 2, moves: 'skips', endDo: false, focus: ['D5', 'E5', 'hr', 'w'] }, LIT)),
    L(Object.assign({ n: 10, band: 'green', name: 'Up to high F', notes: TO('F5'), rhythms: R5, bars: 2, moves: 'skips', endDo: false, focus: ['F5'] }, LIT)),
    L(Object.assign({ n: 11, band: 'green', name: 'Up to high G', notes: RR.TWELVE.slice(2), rhythms: R6, bars: 2, moves: 'skips', endDo: false, focus: ['G5', 'eqe', 'dqe'] }, LIT)),
    L(Object.assign({ n: 12, band: 'blue', name: 'Leaps of a 4th', notes: PENTA.concat('C5', 'D5', 'E5', 'G5'), rhythms: R6, bars: 2, moves: 'leaps', leaps: ['P4'], endDo: false, letters: false, playLights: false }, LIT)),
    L(Object.assign({ n: 13, band: 'blue', name: 'Leaps of a 5th', notes: RR.TWELVE.slice(1), rhythms: R7, bars: 2, moves: 'leaps', leaps: ['P5'], endDo: false, letters: false, playLights: false, focus: ['ess', 'sse'] }, LIT)),
    // 6/8 is new here: Practice and Listen stay (Level 15 is the sight-reading one)
    L({ n: 14, band: 'violet', name: 'Six-eight time', notes: TO('F5'), rhythms: SIX8, time: [6, 8], pickup: true, bars: 2, colour: 'black', moves: 'leaps', leaps: ['P4', 'P5'], endDo: false, letters: false, glow: 'never', auto: false, playLights: false }),
    L({ n: 15, band: 'violet', name: 'Everything', notes: RR.TWELVE, rhythms: R7.concat(SIX8, 'csx'), time: [4, 4], times: [[4, 4], [6, 8]], pickup: true, bars: 2, colour: 'black', moves: 'leaps', leaps: ['P4', 'P5', 'M6'], endDo: false, letters: false, glow: 'never', auto: false, playHidden: true, playLights: false, oneGo: true, flash: 4, practice: false })
  ];
  RR.levelKey = n => 'lv2:' + n;
  RR.bandOf = n => RR.BANDS.find(b => b.id === RR.LEVELS[n - 1].band);
  const levelN = n => Math.max(1, Math.min(RR.LEVELS.length, n | 0));
  /* the level as it was made */
  RR.originalLevel = n => {
    const p = RR.clone(RR.LEVELS[levelN(n) - 1]); delete p.n; delete p.band; delete p.name;
    return p;
  };
  /* the level as it plays: your own changes to it, if you made any (LevelEdits below) */
  RR.practiceOfLevel = n => RR.LevelEdits.get(levelN(n)) || RR.originalLevel(n);

  /* a round's length is in its game: 'round5', 'round12' … any 1–99 melodies
     (2026-10-05; there were only 5 and 10). 0 = not a round (Song, Beat the
     clock, Endless). Kept in the name, so the old rounds and their best
     scores (kept per game) carry on as they were */
  RR.ROUND_MAX = 99;
  RR.roundLen = g => { const m = /^round(\d{1,3})$/.exec(typeof g === 'string' ? g : ''); return m && +m[1] >= 1 && +m[1] <= RR.ROUND_MAX ? +m[1] : 0; };
  RR.gameText = p => {
    const n = RR.roundLen(p.game);
    const songs = Math.max(1, (p.songPicks || []).length);
    return n ? n + (n === 1 ? ' melody' : ' melodies') : p.game === 'song' ? (songs === 1 ? 'a song' : songs + ' songs') : p.game === 'clock' ? 'Beat the clock' : 'Endless';
  };

  /* the gold star's marks: [points, the button, what it means] */
  RR.GOLDS = [
    [8, '8 or more', 'every note right first time'],
    [11, 'Over 10', 'more than half the points'],
    [13, '13 or more', 'in time with the metronome'],
    [16, '16 or more', 'with the metronome at Moderate or Fast']
  ];

  /* ---- making any practice safe ---- */
  const oneOf = (v, list, d) => list.includes(v) ? v : d;
  const bool = (v, d) => typeof v === 'boolean' ? v : d;
  RR.sanitize = function (raw) {
    const D = RR.DEFAULTS, p = RR.clone(D);
    if (!raw || typeof raw !== 'object') return p;
    const cells = RR.Melody.CELLS.map(c => c.id);
    if (Array.isArray(raw.notes)) { const n = raw.notes.filter(id => RR.BAR[id]); if (n.length) p.notes = Array.from(new Set(n)); }
    if (Array.isArray(raw.rhythms)) { const r = raw.rhythms.filter(id => cells.includes(id)); if (r.some(id => !RR.Melody.CELL[id].rest)) p.rhythms = Array.from(new Set(r)); }
    const meterOk = t => Array.isArray(t) && RR.METERS.some(m => m[0] === t[0] && m[1] === t[1]);
    if (Array.isArray(raw.time) && [2, 3, 4].includes(raw.time[0]) && raw.time[1] !== 8) p.time = [raw.time[0], 4];
    else if (meterOk(raw.time)) p.time = raw.time.slice();
    // times: every meter the melodies may use (an older practice has only `time`); the first is `time`
    const ts = Array.isArray(raw.times) ? RR.METERS.filter(m => raw.times.some(t => meterOk(t) && t[0] === m[0] && t[1] === m[1])) : [];
    if (ts.length) { p.times = ts.map(t => t.slice()); if (!ts.some(t => t[0] === p.time[0] && t[1] === p.time[1])) p.time = ts[0].slice(); else p.times = [p.time.slice()].concat(ts.filter(t => !(t[0] === p.time[0] && t[1] === p.time[1])).map(t => t.slice())); }
    else p.times = [p.time.slice()];
    if (Array.isArray(raw.leaps)) { const lp = Object.keys(RR.Melody.LEAPS).filter(k => raw.leaps.includes(k)); if (lp.length) p.leaps = lp; }
    if (Array.isArray(raw.focus)) p.focus = Array.from(new Set(raw.focus.filter(id => typeof id === 'string' && (RR.BAR[id] || RR.Melody.CELL[id])))).slice(0, 12);
    if (Array.isArray(raw.songs)) p.songs = raw.songs.filter(id => RR.SONGS[id]);
    p.moves = oneOf(raw.moves, ['steps', 'skips', 'leaps'], D.moves);
    p.bars = oneOf(raw.bars, [1, 2], D.bars);
    // old practices and links carried judge, tempo, click…: those are dropped
    if (Array.isArray(raw.tempos) && raw.tempos.length === 3 && raw.tempos.every(v => typeof v === 'number' && isFinite(v))) {
      p.tempos = raw.tempos.map(v => Math.max(40, Math.min(160, Math.round(v)))).sort((a, b) => a - b);
    }
    p.flash = oneOf(raw.flash, [0, 2, 3, 4, 6], D.flash);
    p.gold = oneOf(raw.gold, RR.GOLDS.map(g => g[0]), D.gold);
    p.game = RR.roundLen(raw.game) ? 'round' + RR.roundLen(raw.game) : oneOf(raw.game, ['song', 'clock', 'endless'], D.game);
    p.clockSecs = oneOf(raw.clockSecs, [30, 60, 120], D.clockSecs);
    p.song = RR.SONGS[raw.song] ? raw.song : null;
    if (Array.isArray(raw.songPicks)) p.songPicks = Array.from(new Set(raw.songPicks.filter(id => typeof id === 'string' && (RR.SONGS[id] || /^set:[\w-]{1,80}$/.test(id))))).slice(0, 40);
    p.set = typeof raw.set === 'string' && raw.set ? raw.set.slice(0, 80) : null;
    // the Melody Source: 'set' = My Melodies, the set in `set` (2026-10-08: a session's or level's own)
    p.from = oneOf(raw.from, ['both', 'made', 'songbook', 'set'], D.from);
    p.colour = oneOf(raw.colour, ['always', 'lit', 'black'], D.colour);
    p.glow = oneOf(raw.glow, ['never', 'after2', 'always'], D.glow);
    p.labels = oneOf(raw.labels, ['none', 'letters', 'solfege'], D.labels);   // rhythm syllables were retired 2026-10-06
    p.practiceStart = oneOf(raw.practiceStart, ['on', 'off'], D.practiceStart);
    ['endDo', 'tricky', 'grey', 'endLong', 'practice', 'oneGo', 'auto', 'letters', 'nums',
      'playHidden', 'playLights', 'pickup', 'endLa'].forEach(k => { p[k] = bool(raw[k], D[k]); });
    return p;
  };
  /* the practice less everything that is a default — what a link carries */
  RR.trimPractice = function (p) {
    const out = {};
    Object.keys(RR.DEFAULTS).forEach(k => { if (JSON.stringify(p[k]) !== JSON.stringify(RR.DEFAULTS[k])) out[k] = p[k]; });
    return out;
  };

  /* ---- words for a practice ---- */
  RR.notesText = function (ids) {
    const key = ids.slice().sort((a, b) => RR.BAR[a].step - RR.BAR[b].step).join(' ');
    const named = {
      'C4 D4 E4': 'E D C', 'C4 D4 E4 G4': 'C D E G', 'C4 D4 E4 F4 G4': 'C to G', 'C4 D4 E4 F4 G4 A4 B4 C5': 'C to high C',
      'E4 G4 B4 D5 F5': 'Lines', 'F4 A4 C5 E5': 'Spaces',
      'E4 G4': 'Mi So', 'E4 G4 A4': 'Mi So La', 'C4 E4 G4 A4': 'Do Mi So La', 'C4 D4 E4 G4 A4': 'Do Re Mi So La', 'C4 D4 E4 G4 A4 C5': 'Do Re Mi So La Do',
      'C4 D4 E4 F4 G4 A4 C5': 'C to high C, no B', 'C4 D4 E4 G4 A4 C5 D5 E5 G5': 'Two-octave pentatonic'
    };
    named[RR.TWELVE.slice(0, 11).join(' ')] = 'C to high F'; named[RR.TWELVE.slice(2).join(' ')] = 'E to high G'; named[RR.TWELVE.slice(1).join(' ')] = 'D to high G';
    named[RR.TEN.join(' ')] = 'All ten'; named[RR.TWELVE.join(' ')] = 'All twelve';
    return named[key] || ids.slice().sort((a, b) => RR.BAR[a].step - RR.BAR[b].step).map(id => id[0]).join(' ');
  };
  RR.summary = function (p) {
    const C = RR.Melody.CELL;
    const times = p.times && p.times.length ? p.times : [p.time];
    const kinds = times.map(t => RR.meter(t).compound ? 'compound' : 'simple');
    const LEAP_WORD = { P4: '4ths', P5: '5ths', M6: 'major 6ths' };
    return RR.notesText(p.notes) + ' · ' + p.rhythms.filter(r => C[r] && !C[r].rest && kinds.includes(C[r].meter)).map(r => C[r].name).join(' ') +
      (p.rhythms.some(r => C[r] && C[r].rest && kinds.includes(C[r].meter)) ? ' · rests' : '') +
      (times.length > 1 || times[0][0] !== 4 || times[0][1] !== 4 ? ' · ' + times.map(RR.meterText).join(' & ') : '') + (p.pickup ? ' · pick-ups' : '') +
      (p.moves === 'leaps' ? ' · leaps of ' + p.leaps.map(k => LEAP_WORD[k]).join(', ') : '') + (p.endLa ? ' · La-based too' : '') +
      (p.tempos.join() !== RR.DEFAULTS.tempos.join() ? ' · ' + p.tempos.join('/') + ' BPM' : '') +
      (p.practice ? (p.practiceStart === 'off' ? ' · Practice off' : '') : ' · no Practice') + (p.flash ? ' · Flash' : '') + (p.gold !== RR.DEFAULTS.gold ? ' · ★ ' + p.gold + '+' : '');
  };

  /* ---- Battle Mode: the teams' colours, and a battle made safe ----
     A battle (2026-10-05) is a session that teams play in turns: 2–4 teams,
     each a name and a colour; each turn one team plays `per` melodies (1–3);
     every team once is a round; `rounds` rounds (1–20) make the battle. */
  RR.TEAM_COLOURS = [
    ['#ef4444', 'Red'], ['#3b82f6', 'Blue'], ['#22c55e', 'Green'], ['#eab308', 'Gold'],
    ['#a855f7', 'Purple'], ['#f97316', 'Orange'], ['#14b8a6', 'Teal'], ['#ec4899', 'Pink']
  ];
  RR.BATTLE_ROUNDS_MAX = 20;
  const colourOk = c => RR.TEAM_COLOURS.some(x => x[0] === c);
  RR.freeColour = teams => (RR.TEAM_COLOURS.find(c => !teams.some(t => t.colour === c[0])) || RR.TEAM_COLOURS[0]);
  RR.cleanBattle = function (b) {
    const teams = [];
    (b && Array.isArray(b.teams) ? b.teams : []).slice(0, 4).forEach(t => {
      if (!t || typeof t !== 'object') return;
      const c = colourOk(t.colour) && !teams.some(x => x.colour === t.colour) ? t.colour : RR.freeColour(teams)[0];
      const name = typeof t.name === 'string' && t.name.trim() ? t.name.trim().slice(0, 24) : RR.TEAM_COLOURS.find(x => x[0] === c)[1] + ' team';
      teams.push({ name, colour: c });
    });
    while (teams.length < 2) { const c = RR.freeColour(teams); teams.push({ name: c[1] + ' team', colour: c[0] }); }
    const per = [1, 2, 3].includes(b && b.per) ? b.per : 1;
    const rounds = b && Number.isInteger(b.rounds) && b.rounds >= 1 && b.rounds <= RR.BATTLE_ROUNDS_MAX ? b.rounds : 3;
    return { teams, per, rounds };
  };
  /* where melody k (from 0) falls: which round, whose turn, which of the turn's melodies */
  RR.battleAt = function (b, k) {
    const T = b.teams.length;
    return { round: Math.floor(k / (b.per * T)), team: Math.floor(k / b.per) % T, q: k % b.per };
  };
  RR.battleTotal = b => b.rounds * b.teams.length * b.per;

  /* ---- your own changes to the levels (2026-10-08, the user's ask) ----
     Each of the fifteen levels can be changed like a session (its ✎ page);
     the change is kept here, { n: practice }, and the level plays it every
     time it is picked, until Reset gives back the level as it was made. A
     change that leaves the level as it was made is no change: it's dropped.
     The level keeps its number, name, place on the ladder and scores. */
  const keepSet = c => { if (c.from !== 'set') c.set = null; c.tricky = false; return c; };   // tricky notes are "just this time"
  function readEdits() {
    const v = RR.load(RR.KEY.levels, {});
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  }
  RR.LevelEdits = {
    get(n) {
      const raw = readEdits()[n];
      return raw && typeof raw === 'object' ? keepSet(RR.sanitize(raw)) : null;
    },
    edited: n => !!RR.LevelEdits.get(n),
    save(n, practice) {
      const all = readEdits(), c = keepSet(RR.sanitize(practice));
      if (JSON.stringify(c) === JSON.stringify(keepSet(RR.sanitize(RR.originalLevel(n))))) delete all[n]; else all[n] = c;
      RR.save(RR.KEY.levels, all);
    },
    reset(n) { const all = readEdits(); delete all[n]; RR.save(RR.KEY.levels, all); }
  };

  /* ---- My sessions ----
     A session is a named practice of your own — the notes, the rhythms, the
     look, the helps, the game, the gold star, where its melodies come from
     (made up, a My melodies set of yours, or the Songbook) — kept exactly as
     you left it and played that way every time it is picked. Kept as
     [{ id, name, practice }] in rainbow_reader_sessions_v1, in the order they
     were made; a Battle Mode session also has kind: 'battle' and its battle
     (teams, per, rounds — its practice's game is not used). The first read
     brings the old Mine band's practices across (`legacy` = their old score
     key; game.js moves the scores, then drops it). Practise my tricky notes
     is never kept: it is "just this time". */
  const newId = () => 'ses_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  const own = p => { const c = RR.sanitize(p); c.endDo = false; c.endLa = false; c.focus = []; if (c.from === 'both') c.from = 'made'; return keepSet(c); };
  function readSessions() {
    let v = RR.load(RR.KEY.sessions, null);
    if (!Array.isArray(v)) {
      const old = RR.load(RR.KEY.mine, []);
      v = Array.isArray(old) ? old.filter(m => m && typeof m.name === 'string' && m.name.trim())
        .map(m => ({ id: newId(), name: m.name.trim().slice(0, 40), practice: own(m.practice), legacy: 'mine:' + m.name })) : [];
      RR.save(RR.KEY.sessions, v);
    }
    return v.filter(x => x && typeof x.id === 'string' && typeof x.name === 'string')
      .map(x => Object.assign({ id: x.id, name: x.name.slice(0, 40) || 'My session', practice: own(x.practice) },
        x.kind === 'battle' ? { kind: 'battle', battle: RR.cleanBattle(x.battle) } : {},
        typeof x.legacy === 'string' ? { legacy: x.legacy } : {}));
  }
  const write = list => RR.save(RR.KEY.sessions, list);
  RR.Sessions = {
    list: readSessions,
    get: id => readSessions().find(x => x.id === id) || null,
    add(name, practice, battle) {
      const list = readSessions(), rec = { id: newId(), name: String(name).trim().slice(0, 40), practice: own(practice) };
      if (battle) { rec.kind = 'battle'; rec.battle = RR.cleanBattle(battle); }
      list.push(rec); write(list); return rec;
    },
    update(id, practice) { const list = readSessions(), x = list.find(y => y.id === id); if (x) { x.practice = own(practice); write(list); } },
    updateBattle(id, battle) {
      const list = readSessions(), x = list.find(y => y.id === id);
      if (x && x.kind === 'battle') { x.battle = RR.cleanBattle(battle); write(list); return x.battle; }
      return null;
    },
    rename(id, name) {
      const n = String(name).trim().slice(0, 40); if (!n) return false;
      const list = readSessions(), x = list.find(y => y.id === id); if (!x) return false;
      x.name = n; write(list); return true;
    },
    remove(id) { write(readSessions().filter(x => x.id !== id)); },
    dropLegacy(id) { const list = readSessions(), x = list.find(y => y.id === id); if (x) { delete x.legacy; write(list); } }
  };
})();

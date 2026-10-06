/* ==========================================================================
   Melody Reader — levels.js
   --------------------------------------------------------------------------
   The fifteen levels in six rainbow bands (Melody Reader Design/LEVELS.md).
   A level is only data: a practice — the same choices the Settings tabs
   edit (ENGINE §2.3) — plus its number, band and name.

   RR.DEFAULTS     what a practice is when nothing says otherwise
   RR.LEVELS       the ladder
   RR.BANDS        Red … Violet
   RR.sanitize(p)  any practice from storage or a link, made safe: unknown
                   fields dropped, every value checked, defaults filled in
   RR.Sessions     My sessions — your own named practices, top of the
                   level list (2026-10-05; were the Mine band); Battle Mode
                   sessions among them (RR.cleanBattle, RR.battleAt)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;

  RR.BANDS = [
    { id: 'red', name: 'Red', title: 'First notes', colour: '#ef4444', about: 'Find the notes — anything in between is fine' },
    { id: 'orange', name: 'Orange', title: 'Reading, not colours', colour: '#f97316', about: 'Black notes that light up when played; clean runs' },
    { id: 'yellow', name: 'Yellow', title: 'Rhythm joins in', colour: '#eab308', about: 'Rhythm syllables, a steady beat, the count-in' },
    { id: 'green', name: 'Green', title: 'The whole staff', colour: '#22c55e', about: 'Lines, spaces, two bars, skips' },
    { id: 'blue', name: 'Blue', title: 'Leaps and new times', colour: '#3b82f6', about: 'No letters on the bars; 3/4, dotted rhythms' },
    { id: 'violet', name: 'Violet', title: 'Sight-reader', colour: '#8b5cf6', about: 'Black notes, one go, no Practice; Flash' }
  ];
  RR.SESSION_COLOUR = '#0d9488';

  RR.DEFAULTS = {
    notes: ['C4', 'D4', 'E4', 'F4', 'G4'], moves: 'steps', endDo: true, tricky: false, grey: false,
    rhythms: ['q', 'h'], time: [4, 4], bars: 1, endLong: true,
    tempos: [60, 80, 100], practice: true, oneGo: false, flash: 0,     // the metronome: Slow · Moderate · Fast (POINTS-AND-COUNT-IN.md)
    gold: 11,                                                          // a gold star from this many points (of 20): over 10
    game: 'round5', clockSecs: 60, song: null, from: 'both', auto: true,
    colour: 'always', letters: true, nums: true, glow: 'after2', ghost: true, labels: 'none',
    playHidden: false, playLights: true,
    songs: [], set: null
  };

  const CtoG = ['C4', 'D4', 'E4', 'F4', 'G4'];
  const CtoC = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
  const L = o => Object.assign(RR.clone(RR.DEFAULTS), o);
  RR.LEVELS = [
    L({ n: 1, band: 'red', name: 'Mi Re Do', notes: ['C4', 'D4', 'E4'], rhythms: ['q', 'h'], grey: true, songs: ['hot-cross-buns'] }),
    L({ n: 2, band: 'red', name: 'Add So', notes: ['C4', 'D4', 'E4', 'G4'], rhythms: ['q', 'h'], grey: true, songs: ['mary', 'rain'] }),
    L({ n: 3, band: 'red', name: 'Five notes', notes: CtoG, rhythms: ['q', 'h'], songs: ['au-clair', 'frere', 'jingle'] }),
    L({ n: 4, band: 'orange', name: 'Lit when played', notes: CtoG, rhythms: ['q', 'h', 'ee'], bars: 2, colour: 'lit', songs: ['lightly-row', 'ode'] }),
    L({ n: 5, band: 'orange', name: 'No slips', notes: CtoG, rhythms: ['q', 'h', 'ee'], bars: 2, colour: 'lit', songs: ['ode', 'frere'] }),
    L({ n: 6, band: 'orange', name: 'Up to high C', notes: CtoC, rhythms: ['q', 'h', 'ee'], bars: 2, colour: 'lit', moves: 'skips', songs: ['twinkle', 'london'] }),
    L({ n: 7, band: 'yellow', name: 'With the beat', notes: CtoG, rhythms: ['q', 'h'], colour: 'lit', labels: 'syllables', glow: 'never', auto: false, songs: ['au-clair'] }),
    L({ n: 8, band: 'yellow', name: 'Ti-ti and rests', notes: CtoC, rhythms: ['q', 'h', 'ee', 'qr'], bars: 2, colour: 'lit', labels: 'syllables', glow: 'never', auto: false, songs: ['saints'] }),
    L({ n: 9, band: 'green', name: 'Line notes', notes: ['E4', 'G4', 'B4', 'D5', 'F5'], rhythms: ['q', 'h', 'ee'], bars: 2, colour: 'lit', glow: 'never', endDo: false, auto: false }),
    L({ n: 10, band: 'green', name: 'Space notes', notes: ['F4', 'A4', 'C5', 'E5'], rhythms: ['q', 'h', 'ee'], bars: 2, colour: 'lit', glow: 'never', endDo: false, auto: false }),
    L({ n: 11, band: 'green', name: 'All ten', notes: RR.TEN, rhythms: ['q', 'h', 'ee', 'qr'], bars: 2, colour: 'lit', moves: 'skips', glow: 'never', auto: false, songs: ['old-macdonald'] }),
    L({ n: 12, band: 'blue', name: 'Leaps and 3/4', notes: RR.TEN, rhythms: ['q', 'h', 'dh', 'ee'], time: [3, 4], bars: 2, colour: 'lit', moves: 'leaps', letters: false, glow: 'never', auto: false, playLights: false }),
    L({ n: 13, band: 'blue', name: 'Dotted rhythms', notes: RR.TEN, rhythms: ['q', 'h', 'w', 'ee', 'dqe', 'qr', 'hr'], bars: 2, colour: 'lit', moves: 'skips', letters: false, glow: 'never', auto: false, playLights: false, songs: ['ode', 'london', 'jingle'] }),
    L({ n: 14, band: 'violet', name: 'Sight-read', notes: RR.TEN, rhythms: ['q', 'h', 'dh', 'ee', 'dqe', 'qr'], bars: 2, colour: 'black', moves: 'leaps', letters: false, ghost: false, glow: 'never', auto: false, playHidden: true, playLights: false, oneGo: true, practice: false }),
    L({ n: 15, band: 'violet', name: 'Flash', notes: RR.TWELVE, rhythms: ['q', 'h', 'ee', 'dqe', 'ssss', 'ess', 'sse', 'qr'], bars: 2, colour: 'black', moves: 'leaps', letters: false, ghost: false, glow: 'never', auto: false, playHidden: true, playLights: false, oneGo: true, flash: 4, practice: false })
  ];
  RR.bandOf = n => RR.BANDS.find(b => b.id === RR.LEVELS[n - 1].band);
  RR.practiceOfLevel = n => {
    const l = RR.LEVELS[Math.max(1, Math.min(RR.LEVELS.length, n | 0)) - 1];
    const p = RR.clone(l); delete p.n; delete p.band; delete p.name;
    return p;
  };

  /* a round's length is in its game: 'round5', 'round12' … any 1–99 melodies
     (2026-10-05; there were only 5 and 10). 0 = not a round (Song, Beat the
     clock, Endless). Kept in the name, so the old rounds and their best
     scores (kept per game) carry on as they were */
  RR.ROUND_MAX = 99;
  RR.roundLen = g => { const m = /^round(\d{1,3})$/.exec(typeof g === 'string' ? g : ''); return m && +m[1] >= 1 && +m[1] <= RR.ROUND_MAX ? +m[1] : 0; };
  RR.gameText = p => {
    const n = RR.roundLen(p.game);
    return n ? n + (n === 1 ? ' melody' : ' melodies') : p.game === 'song' ? 'a Songbook song' : p.game === 'clock' ? 'Beat the clock' : 'Endless';
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
    if (Array.isArray(raw.time) && [2, 3, 4].includes(raw.time[0])) p.time = [raw.time[0], 4];
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
    p.set = typeof raw.set === 'string' && raw.set ? raw.set.slice(0, 80) : null;
    p.from = oneOf(raw.from, ['both', 'made', 'songbook'], D.from);
    p.colour = oneOf(raw.colour, ['always', 'lit', 'black'], D.colour);
    p.glow = oneOf(raw.glow, ['never', 'after2', 'always'], D.glow);
    p.labels = oneOf(raw.labels, ['none', 'letters', 'syllables'], D.labels);
    ['endDo', 'tricky', 'grey', 'endLong', 'practice', 'oneGo', 'auto', 'letters', 'nums', 'ghost',
      'playHidden', 'playLights'].forEach(k => { p[k] = bool(raw[k], D[k]); });
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
      'E4 G4 B4 D5 F5': 'Lines', 'F4 A4 C5 E5': 'Spaces'
    };
    named[RR.TEN.join(' ')] = 'All ten'; named[RR.TWELVE.join(' ')] = 'All twelve';
    return named[key] || ids.slice().sort((a, b) => RR.BAR[a].step - RR.BAR[b].step).map(id => id[0]).join(' ');
  };
  RR.summary = function (p) {
    const C = RR.Melody.CELL;
    return RR.notesText(p.notes) + ' · ' + p.rhythms.filter(r => !C[r].rest).map(r => C[r].name).join(' ') +
      (p.rhythms.some(r => C[r].rest) ? ' · rests' : '') + (p.time[0] !== 4 ? ' · ' + p.time.join('/') : '') +
      (p.tempos.join() !== RR.DEFAULTS.tempos.join() ? ' · ' + p.tempos.join('/') + ' BPM' : '') +
      (p.practice ? '' : ' · no Practice') + (p.flash ? ' · Flash' : '') + (p.gold !== RR.DEFAULTS.gold ? ' · ★ ' + p.gold + '+' : '');
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

  /* ---- My sessions ----
     A session is a named practice of your own — the notes, the rhythms, the
     look, the helps, the game, the gold star — and every melody in it is
     made up from those choices, new each time it is played. Kept as
     [{ id, name, practice }] in rainbow_reader_sessions_v1, in the order they
     were made; a Battle Mode session also has kind: 'battle' and its battle
     (teams, per, rounds — its practice's game is not used). The first read
     brings the old Mine band's practices across (`legacy` = their old score
     key; game.js moves the scores, then drops it). A session never keeps the
     browser's own things: a My melodies set laid over it, or Practise my
     tricky notes. */
  const newId = () => 'ses_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  const own = p => { const c = RR.sanitize(p); c.set = null; c.tricky = false; return c; };
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

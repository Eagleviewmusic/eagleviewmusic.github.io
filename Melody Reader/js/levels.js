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
   RR.Mine         the ladder's Mine band (saved practices)
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
  RR.MINE_COLOUR = '#8a7563';

  RR.DEFAULTS = {
    notes: ['C4', 'D4', 'E4', 'F4', 'G4'], moves: 'steps', endDo: true, tricky: false, grey: false,
    rhythms: ['q', 'h'], time: [4, 4], bars: 1, endLong: true,
    tempos: [60, 80, 100], practice: true, oneGo: false, flash: 0,     // Count me in: Slow · Moderate · Fast (POINTS-AND-COUNT-IN.md)
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
    p.game = oneOf(raw.game, ['round5', 'round10', 'song', 'clock', 'endless'], D.game);
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
      (p.practice ? '' : ' · no Practice') + (p.flash ? ' · Flash' : '');
  };

  /* ---- the Mine band ---- */
  RR.Mine = {
    list() {
      const v = RR.load(RR.KEY.mine, []);
      return Array.isArray(v) ? v.filter(m => m && typeof m.name === 'string').map(m => ({ name: m.name.slice(0, 40), practice: RR.sanitize(m.practice) })) : [];
    },
    add(name, practice) {
      const list = RR.Mine.list().filter(m => m.name !== name);
      list.push({ name, practice: RR.clone(practice) });
      RR.save(RR.KEY.mine, list);
    },
    remove(name) { RR.save(RR.KEY.mine, RR.Mine.list().filter(m => m.name !== name)); }
  };
})();

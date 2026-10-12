/* ==========================================================================
   Melody Reader — teach-data.js
   --------------------------------------------------------------------------
   Teach Me to Read (2026-10-11, the user's design): the very first steps,
   before the fifteen levels. Three levels, each with an Advanced level:

     Level 1      E and G (Mi So) — their lines lit yellow and turquoise,
                  the other three greyed
     Advanced 1   the same, low and high (E5 G5) — the green F line lit
                  too, between the high pair
     Level 2      + A (La)
     Advanced 2   + A, low and high — the high A on its own line above the
                  staff, lit blue (until 2026-10-11 the xylophone stopped
                  at G and the low A stood in; the user added high A, key +)
     Level 3      + D (Re)
     Advanced 3   + D, low and high (D5 — the orange line lit), high A too

   Five written exercises each — the same five every time, so a gold star
   can be earned on each one — two bars of 4/4, quarters and eighths only.
   Written as tokens: a letter is a quarter, two letters a pair of
   eighths, ' the octave up (G' is G5, A' is A5); | is a bar line.

   RR.TEACH             the six, in order
   RR.teachCards(L)     a level's five cards
   RR.teachLines(notes) the staff's five lines, bottom to top: a bar
                        colour (lit) or 'dim'
   RR.teachLedgers(notes) the ledger lines lit: { 40: A's blue } for A5
   RR.teachMark(o)      what a play earns: 2 a gold star (with the
                        metronome, every note, no wrong bar) · 1 a check
                        (played through) · 0 nothing yet
   RR.TeachMarks        each player's marks, kept (rainbow_reader_teach_v1)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;

  RR.TEACH_COLOUR = '#be185d';      // its colour: the level box, the home page's card and window (white on it passes AA)
  // its picture (the home page's card, its window): the yellow and turquoise lines lit, E and G on them
  RR.TEACH_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke-linecap="round"><path d="M6 15h36M6 22h36M6 8h36" stroke="#d9cfbf" stroke-width="1.8"/>' +
    '<path d="M6 36h36" stroke="#facc15" stroke-width="3.8"/><path d="M6 29h36" stroke="#2dd4bf" stroke-width="3.8"/></g>' +
    '<ellipse cx="17" cy="36" rx="5" ry="3.8" transform="rotate(-20 17 36)" fill="#facc15" stroke="#2b1d16" stroke-width="1.5"/>' +
    '<ellipse cx="32" cy="29" rx="5" ry="3.8" transform="rotate(-20 32 29)" fill="#2dd4bf" stroke="#2b1d16" stroke-width="1.5"/></svg>';

  const PITCH = { D: 'D4', E: 'E4', G: 'G4', A: 'A4', "D'": 'D5', "E'": 'E5', "G'": 'G5', "A'": 'A5' };
  /* "G E GG E | GG EE G E" → notes [{ p, t }] (a quarter is 4 ticks, an eighth 2) */
  function parse(src) {
    const out = [];
    src.split(/\s+/).filter(t => t && t !== '|').forEach(tok => {
      const ps = tok.match(/[A-G]'?/g) || [];
      ps.forEach(x => out.push({ p: PITCH[x] || null, t: ps.length === 1 ? 4 : 2 }));
    });
    return out;
  }

  const L = (id, n, adv, name, sub, notes, ex) => ({ id, n, adv, name, sub, notes, ex });
  RR.TEACH = [
    L('L1', 1, false, 'Mi and So', 'E and G', ['E4', 'G4'], [
      'G G E E | G G E E',
      'E G E G | E E G G',
      'GG E GG E | GG EE G E',
      'G E GG E | GG EE G E',
      'E GE G E | GE GE G E'
    ]),
    L('A1', 1, true, 'High and low', 'E and G, high and low', ['E4', 'G4', 'E5', 'G5'], [
      "G' G' E' E' | G' G' E' E'",
      "G G E E | G' G' E' E'",
      "E' G' E' G' | E G E G",
      "G' E' G'G' E' | G E GG E",
      "G G' E E' | G'G' EE G' E"
    ]),
    L('L2', 2, false, 'Add La', 'E, G and A', ['E4', 'G4', 'A4'], [
      'G G A A | G G E E',
      'E G A G | E G E E',
      'GG AA G E | GG AA G E',
      'G E AG E | GG AA G E',
      'E GA G E | AG AG E E'
    ]),
    L('A2', 2, true, 'High and low, with La', 'E, G and A, high and low', ['E4', 'G4', 'A4', 'E5', 'G5', 'A5'], [
      "G' G' A' A' | G' G' E' E'",
      "G A G E | G' A' G' E'",
      "E' G' A' G' | E G A G",
      "G'G' A'A' G E | GG AA G' E'",
      "E A E' A' | A'G' E'E' A E"
    ]),
    L('L3', 3, false, 'Add Re', 'D, E, G and A', ['D4', 'E4', 'G4', 'A4'], [
      'E E D D | E E D D',
      'D E G A | G E D D',
      'DD E EE G | AA G EE D',
      'G E DE G | AG ED E D',
      'GA G ED E | GG AA GE D'
    ]),
    L('A3', 3, true, 'High and low, with Re', 'D, E, G and A, high and low', ['D4', 'E4', 'G4', 'A4', 'D5', 'E5', 'G5', 'A5'], [
      "E' E' D' D' | E E D D",
      "D E G A | D' E' G' A'",
      "G' E' D'D' E' | G E DD E",
      "A' G' E'D' E' | A G ED E",
      "DE GA D'E' G'A' | A'G' E'D' A D"
    ])
  ];
  RR.TEACH.forEach(x => {
    x.title = x.adv ? 'Advanced ' + x.n : 'Level ' + x.n;
    x.long = x.adv ? 'Advanced Level ' + x.n : 'Level ' + x.n;
  });
  RR.teachLevel = id => RR.TEACH.find(x => x.id === id) || null;

  /* the five lines, bottom to top (E G B D F): lit in the bar's colour when its note is in the level;
     the F line lit too when the high E or G is (they sit either side of it); the rest greyed */
  RR.teachLines = function (notes) {
    return ['E4', 'G4', 'B4', 'D5', 'F5'].map(id =>
      notes.includes(id) || (id === 'F5' && (notes.includes('E5') || notes.includes('G5'))) ? RR.BAR[id].colour : 'dim');
  };
  /* a ledger line lit too: high A sits on the one above the staff — blue, like its bar */
  RR.teachLedgers = notes => notes.includes('A5') ? { 40: RR.BAR.A5.colour } : null;
  RR.TEACH.forEach(x => { x.lines = RR.teachLines(x.notes); x.ledgers = RR.teachLedgers(x.notes); });

  RR.teachCards = function (lv) {
    return lv.ex.map((src, i) => ({ teach: lv.id, title: '', part: i + 1, of: lv.ex.length, time: [4, 4], notes: parse(src) }));
  };
  RR.teachParse = parse;

  /* what a play earns: a gold star — the metronome on, every note found, no wrong bar; a check — played
     through (on your own, or with the metronome and a slip); nothing — notes missed */
  RR.teachMark = o => o.missed ? 0 : o.run && !o.wrong ? 2 : 1;

  /* ---- each player's marks: { L1: [0|1|2 × 5], … } — the best kept ---- */
  const KEY = 'rainbow_reader_teach_v1';
  const M = RR.TeachMarks = {
    data: null,
    load() {
      const d = RR.load(KEY, null);
      this.data = d && d.v === 1 && d.players && typeof d.players === 'object' && !Array.isArray(d.players) ? d : { v: 1, players: {} };
    },
    me() {
      const k = RR.device.player || '';
      const p = this.data.players[k];
      return (this.data.players[k] = p && typeof p === 'object' && !Array.isArray(p) ? p : {});
    },
    get(id) {
      const lv = RR.teachLevel(id); if (!lv) return [];
      const a = this.me()[id];
      return lv.ex.map((_, i) => Array.isArray(a) && [0, 1, 2].includes(a[i]) ? a[i] : 0);
    },
    set(id, i, mark) {
      const a = this.get(id);
      if (i < 0 || i >= a.length || !(mark > a[i])) return false;
      a[i] = mark; this.me()[id] = a;
      RR.save(KEY, this.data);
      return true;
    },
    reset(id) { delete this.me()[id]; RR.save(KEY, this.data); }
  };
  M.load();
})();

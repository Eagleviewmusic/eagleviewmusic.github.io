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
                        metronome, every note, no wrong bar, at about
                        its tempo) · 1 a check
                        (played through) · 0 nothing yet
   RR.TeachMarks        each player's marks, kept (rainbow_reader_teach_v1)

   YOUR UNITS (2026-10-12, the user's: "take the melodies I've created or
   create new ones, and build a unit that will show up in the Teach Me to
   Read section"). A unit is a My melodies set played the Teach Me to Read
   way — big, round and round, its notes' lines lit. Any set can be one
   (yours, shared, the Teacher Library's); the set stays in My melodies,
   where its melodies are written and changed.
   RR.TeachUnits        the sets in Teach Me to Read, in the order added
                        (rainbow_reader_teach_units_v1, this browser's)
   RR.teachLevel('U:<set id>') a unit, built from its set like a level:
                        its notes, lines, ledgers, its melodies as `ex`
                        and each melody's content key (`keys`) — a
                        unit's marks follow the melody, not its place, so
                        moving one keeps its mark and changing it starts
                        it afresh

   THE LOOK (2026-10-12, the user's: "remove some of the scaffolding … at
   any instance"): the Tools panel on the music card changes the note
   colours, the staff's colours and the names under the notes, for every
   level and unit (RR.teachLook, kept in device.teachLook).
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
  const BUILT = RR.TEACH.slice();
  RR.teachLevel = id => BUILT.find(x => x.id === id) || unitLevel(id);

  /* the five lines, bottom to top (E G B D F): lit in the bar's colour when its note is in the level;
     the F line lit too when the high E or G is (they sit either side of it); the rest greyed */
  RR.teachLines = function (notes) {
    return ['E4', 'G4', 'B4', 'D5', 'F5'].map(id =>
      notes.includes(id) || (id === 'F5' && (notes.includes('E5') || notes.includes('G5'))) ? RR.BAR[id].colour : 'dim');
  };
  /* a ledger line lit too: high A sits on the one above the staff — blue, like its bar; low C (a unit's,
     2026-10-12) on the one below — red */
  RR.teachLedgers = function (notes) {
    const o = {};
    if (notes.includes('A5')) o[40] = RR.BAR.A5.colour;
    if (notes.includes('C4')) o[28] = RR.BAR.C4.colour;
    return Object.keys(o).length ? o : null;
  };
  RR.TEACH.forEach(x => { x.lines = RR.teachLines(x.notes); x.ledgers = RR.teachLedgers(x.notes); });

  RR.teachCards = function (lv) {
    if (lv.unit) return lv.ex.map((m, i) => ({ teach: lv.id, title: m.title || '', part: i + 1, of: lv.ex.length, time: m.time.slice(), notes: RR.clone(m.notes) }));
    return lv.ex.map((src, i) => ({ teach: lv.id, title: '', part: i + 1, of: lv.ex.length, time: [4, 4], notes: parse(src) }));
  };
  RR.teachParse = parse;

  /* what a play earns: a gold star — the metronome on, every note, no wrong bar, at about its tempo (`inTempo`,
     RR.Points.tempoCheck — where the player came in doesn't matter, 2026-10-12); a check — played through (on
     your own, or with the metronome and a slip, or too fast or slow for it); nothing — notes missed */
  RR.teachMark = o => o.missed ? 0 : o.run && !o.wrong && o.inTempo !== false ? 2 : 1;

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
      // a unit's marks go by each melody's content: { key: mark }
      if (lv.unit) { const o = a && typeof a === 'object' && !Array.isArray(a) ? a : {}; return lv.keys.map(k => [0, 1, 2].includes(o[k]) ? o[k] : 0); }
      return lv.ex.map((_, i) => Array.isArray(a) && [0, 1, 2].includes(a[i]) ? a[i] : 0);
    },
    set(id, i, mark) {
      const lv = RR.teachLevel(id); if (!lv) return false;
      const a = this.get(id);
      if (i < 0 || i >= a.length || !(mark > a[i])) return false;
      a[i] = mark;
      if (lv.unit) {
        // only the melodies the unit has now (one changed or taken out leaves no mark behind)
        const o = {}; lv.keys.forEach((k, j) => { if (a[j]) o[k] = Math.max(a[j], o[k] || 0); });
        this.me()[id] = o;
      } else this.me()[id] = a;
      RR.save(KEY, this.data);
      return true;
    },
    reset(id) { delete this.me()[id]; RR.save(KEY, this.data); }
  };
  M.load();

  /* ---- your units (2026-10-12): which My melodies sets are in Teach Me to Read ---- */
  const UKEY = 'rainbow_reader_teach_units_v1';
  const U = RR.TeachUnits = {
    data: null, rev: 0,
    load() {
      const d = RR.load(UKEY, null);
      const list = d && d.v === 1 && Array.isArray(d.units) ? d.units : [];
      const seen = new Set();
      this.data = { v: 1, units: list.filter(x => x && typeof x.set === 'string' && x.set && !seen.has(x.set) && seen.add(x.set)).map(x => ({ set: x.set, at: Number(x.at) || 0 })) };
      this.rev++;
    },
    save() { RR.save(UKEY, this.data); this.rev++; },
    has(setId) { return this.data.units.some(x => x.set === setId); },
    add(setId) {
      if (!setId || /^lesson/.test(setId) || this.has(setId)) return false;
      this.data.units.push({ set: setId, at: Date.now() }); this.save();
      return true;
    },
    /* out of Teach Me to Read (the set stays in My melodies); its marks go too */
    remove(setId) {
      const n = this.data.units.length;
      this.data.units = this.data.units.filter(x => x.set !== setId);
      if (this.data.units.length === n) return false;
      this.save();
      Object.keys(M.data.players).forEach(p => { const o = M.data.players[p]; if (o && typeof o === 'object') delete o['U:' + setId]; });
      RR.save(KEY, M.data);
      return true;
    },
    /* the units whose sets are here, in order — one whose set has gone (a Teacher Library book put back)
       stays listed, out of sight, and comes back with it */
    levels() { return this.data.units.map(x => RR.teachLevel('U:' + x.set)).filter(Boolean); }
  };
  U.load();

  /* a melody's content, as a short key — its notes and its meter, not its name */
  function melKey(m) {
    const src = m.time[0] + '|' + m.notes.map(n => (n.p || 'r') + ':' + n.t).join(' ');
    let h = 5381;
    for (let i = 0; i < src.length; i++) h = ((h << 5) + h + src.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36) + src.length.toString(36);
  }
  RR.teachMelKey = melKey;
  const byStep = (a, b) => RR.BAR[a].step - RR.BAR[b].step;
  /* "6 melodies · D E G A · high E G" */
  RR.teachNotesWords = function (notes) {
    const low = notes.filter(id => RR.BAR[id].octave === 4).map(id => RR.BAR[id].letter);
    const high = notes.filter(id => RR.BAR[id].octave === 5).map(id => RR.BAR[id].letter);
    return [low.join(' '), high.length ? 'high ' + high.join(' ') : ''].filter(Boolean).join(' · ');
  };
  /* a level made of written melodies — a unit, a song, a set — its notes, lines and content keys */
  function melodyLevel(id, title, mels, extra) {
    const notes = Array.from(new Set([].concat.apply([], mels.map(m => m.notes.filter(n => n.p && RR.BAR[n.p]).map(n => n.p))))).sort(byStep);
    const word = extra.kind === 'unit' ? ['melody', 'melodies'] : ['slide', 'slides'];
    return Object.assign({
      id, unit: true, n: 0, adv: false, name: title, title, long: title,
      sub: mels.length ? mels.length + ' ' + (mels.length === 1 ? word[0] : word[1]) + ' · ' + RR.teachNotesWords(notes) : 'No melodies yet',
      notes, ex: mels, keys: mels.map(melKey), lines: RR.teachLines(notes), ledgers: RR.teachLedgers(notes)
    }, extra);
  }
  /* a unit ('U:<set id>'), a Songbook song ('S:<song id>', 2026-10-12: Practice → Songs, and the Songs card) or
     any My melodies set as a song ('M:<set id>', the Songs card), as a level: rebuilt only when a set or the units
     changed (RR.Sets.rev, U.rev) */
  const cache = new Map();
  function unitLevel(id) {
    if (typeof id !== 'string' || !/^[USM]:/.test(id)) return null;
    const key = id.slice(2);
    if (id[0] === 'S') {
      const hit = cache.get(id); if (hit) return hit.L;
      const song = RR.SONGS && RR.SONGS[key];
      const L = song && RR.Melody ? melodyLevel(id, song.title, RR.Melody.songCards(key).map(c => ({ title: song.title + ' ' + c.part, time: c.time.slice(), notes: RR.clone(c.notes) })),
        { kind: 'song', songId: key }) : null;
      cache.set(id, { L });
      return L;
    }
    if (!RR.Sets) return null;
    const stamp = RR.Sets.rev + '/' + U.rev;
    const hit = cache.get(id);
    if (hit && hit.stamp === stamp) return hit.L;
    const set = id[0] === 'M' || U.has(key) ? RR.Sets.get(key) : null;
    const L = set ? melodyLevel(id, set.title, set.melodies, { kind: id[0] === 'U' ? 'unit' : 'mset', set: key, shared: !!set.received, book: set.book || '' }) : null;
    cache.set(id, { stamp, L });
    return L;
  }
  /* Practice → Songs: the Songbook's songs, as levels */
  RR.teachSongs = () => Object.keys(RR.SONGS || {}).map(k => unitLevel('S:' + k)).filter(Boolean);

  /* ---- the look (2026-10-12): Tools → Note Colors · Staff Color · Text Below the Notes ---- */
  RR.TEACH_LOOK = { colour: 'solid', staff: 'notes', labels: 'letters', auto: false };   // auto: Auto-Next Slide (Tools, 2026-10-12)
  const LOOKS = { colour: ['solid', 'always', 'lit', 'black'], staff: ['notes', 'all', 'plain'], labels: ['letters', 'solfege', 'none'], auto: [true, false] };
  RR.teachLook = function () {
    const d = RR.device.teachLook, o = Object.assign({}, RR.TEACH_LOOK);
    if (d && typeof d === 'object') Object.keys(LOOKS).forEach(k => { if (LOOKS[k].includes(d[k])) o[k] = d[k]; });
    return o;
  };
  RR.setTeachLook = function (k, v) {
    if (!LOOKS[k] || !LOOKS[k].includes(v)) return false;
    RR.device.teachLook = Object.assign(RR.teachLook(), { [k]: v });
    RR.saveDevice();
    return true;
  };
  /* the staff's lines for a level and a look: its notes' lines lit (the rest greyed) · all five in their
     colours · or plain black */
  RR.teachStaff = function (L, staff) {
    if (staff === 'plain') return { lines: null, ledgers: null };
    if (staff === 'all') return { lines: ['E4', 'G4', 'B4', 'D5', 'F5'].map(id => RR.BAR[id].colour), ledgers: { 28: RR.BAR.C4.colour, 40: RR.BAR.A5.colour } };
    return { lines: L.lines, ledgers: L.ledgers };
  };
})();

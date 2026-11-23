/* ==========================================================================
   Virtual Chordophone — rhythm.js                              VC.rhythm
   --------------------------------------------------------------------------
   How a chord plays while its box is held: Song Writer 3.5's chord rhythms
   (components/chord-rhythm.js, rhythm-box.js, track.js), for one bar that
   goes round and round.

     HELD          struck once, ringing while the box is held
     BLOCK CHORDS  the meter's pre-built rhythms (Song Writer's), or your own
                   (one bar of sixteenths: strike · hold · rest)
     ARPEGGIOS     the chord's notes one by one — up, down, up and down, down
                   and up, middle out, ends in, Alberti, bass and chord, bass
                   then down, random — in quarters, 8ths or 16ths
     YOUR OWN      a grid: the chord's notes (high to low) by the bar's
                   quarters, 8ths or 16ths; a tap puts that note there (two
                   or more in a column sound together), an empty column lets
                   the notes ring on. Built on a chord of n notes, a chord of
                   another size plays it by place (bottom for bottom, top for
                   top — Song Writer's mapRank).

   A RHYTHM (what a box keeps)
     { kind: 'held' }
     { kind: 'block', cells: 'XOOOXOOO…', preset?: i }   X strike, O hold, R rest — one bar of 16ths
     { kind: 'arp', arp: 'up', by: 'q'|'e'|'s' }
     { kind: 'build', by, cols: [[ranks], …], n }        ranks 0 = the lowest note

   Cells are sixteenths: a beat is 4 of them (6 in compound time, where the
   beat is a dotted quarter, as Ostinato Builder counts 6/8).

   API  meterOf(id) · METER_CHOICES · cells(str) · fit(c, n) · presets(m) · sayAll(cells, m)
        ARPS · ARP_INFO · arpOrder(arp, M) · defaultRhythm(m) · clean(r, m) · refit(r, from, to)
        pattern(r, m, M) → { held, barCells, strikes, byCell, empty } · stripOf(pattern) · describe(r, m)
   ========================================================================== */
(function () {
  'use strict';
  const VC = window.VC = window.VC || {};

  /* ---------------- meters ---------------- */
  const METER_CHOICES = ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8'];
  function meterOf(id) {
    const m = /^(\d{1,2})\/(\d{1,2})$/.exec(String(id || ''));
    let num = m ? +m[1] : 4, den = m ? +m[2] : 4;
    if (!(num >= 1 && num <= 16) || [2, 4, 8, 16].indexOf(den) === -1) { num = 4; den = 4; }
    let beats, per, compound = false;
    if (den === 8 && num % 3 === 0 && num > 3) { beats = num / 3; per = 6; compound = true; }    // 6/8 9/8 12/8: dotted-quarter beats
    else if (den === 8) { beats = num; per = 2; }                                              // 3/8 5/8 7/8: eighth beats
    else if (den === 2) { beats = num; per = 8; }
    else if (den === 16) { beats = num; per = 1; }
    else { beats = num; per = 4; }
    return { id: num + '/' + den, num, den, beats, per, compound, barCells: beats * per };
  }

  /* ---------------- rhythm strings ('q q e e') ---------------- */
  const LEN = { w: 16, h: 8, q: 4, e: 2, s: 1 };
  function cells(str) {
    let out = '';
    const toks = String(str || '').trim().split(/\s+/).filter(Boolean);
    for (const t of toks) {
      const m = /^(r?)([whqes])(\.?)$/.exec(t);
      if (!m) return null;
      const n = LEN[m[2]] * (m[3] ? 1.5 : 1);
      out += m[1] ? 'R'.repeat(n) : 'X' + 'O'.repeat(n - 1);
    }
    return out || null;
  }
  /* a hold with nothing sounding before it is a rest (round the bar: a bar can begin by holding its last strike) */
  function tidy(c) {
    const a = c.split('');
    if (a.indexOf('X') === -1) return a.map(() => 'R').join('');
    for (let pass = 0; pass < 2; pass++) for (let i = 0; i < a.length; i++) {
      if (a[i] === 'O' && a[(i - 1 + a.length) % a.length] === 'R') a[i] = 'R';
    }
    return a.join('');
  }
  /* a bar laid over n cells: tiled, or cut */
  function fit(c, n) {
    if (!c) return 'X' + 'O'.repeat(n - 1);
    let out = '';
    for (let i = 0; i < n; i++) out += c[i % c.length];
    return out;
  }

  /* Song Writer's pre-built rhythms, one bar each (rhythm-box.js PRESETS) */
  const PRESETS = {
    '4/4': ['q q q q', 'h h', 'q q e e q', 'e e e e e e e e', 'q e e q e e', 'e q e e q e', 'h q q', 'q. e q q', 'w'],
    '3/4': ['q q q', 'h q', 'q e e e e', 'e e e e e e', 'q q e e', 'q h', 'h.'],
    '2/4': ['q q', 'e e e e', 'q e e', 'e q e', 'e e q', 'h'],
    '6/8': ['q. q.', 'e e e e e e', 'q e q e', 'q. e e e', 'q e q.', 'h.'],
    '9/8': ['q. q. q.', 'h. q.', 'e e e e e e e e e', 'q e q e q e'],
    '12/8': ['q. q. q. q.', 'h. h.', 'q e q e q e q e', 'e e e e e e e e e e e e', 'q. q. q e q e']
  };
  /* any other meter: a strike on every beat, on every other beat, and on the first */
  function generic(m) {
    const beat = 'X' + 'O'.repeat(m.per - 1);
    const list = [beat.repeat(m.beats)];
    if (m.per % 2 === 0) list.push(('X' + 'O'.repeat(m.per / 2 - 1)).repeat(m.beats * 2));
    list.push('X' + 'O'.repeat(m.barCells - 1));
    return list;
  }
  /* Simplified Kodály, as Rhythm Poetry counts a beat */
  function sayBeat(c, c0, pb) {
    const s = c.slice(c0, c0 + pb);
    if (s.indexOf('X') === -1) return s[0] === 'O' ? '-a' : '';
    const halves = [];
    const step = pb === 6 ? 2 : pb >= 4 ? Math.max(1, pb / 4) * 2 / 2 : 1;
    if (pb === 6) {                     // compound: three eighths
      const e = [s[0] === 'X', s[2] === 'X', s[4] === 'X'];
      const subs = [s[1] === 'X', s[3] === 'X', s[5] === 'X'];
      if (subs.some(Boolean)) return 'ti-ki-ti-ki-ti-ki'.split('-').filter((w, i) => s[i] === 'X').join('-') || '·';
      if (e[0] && !e[1] && !e[2]) return 'ta';
      if (e[0] && !e[1] && e[2]) return 'ta-ti';
      if (e[0] && e[1] && e[2]) return 'ti-ti-ti';
      return e.map(x => (x ? 'ti' : '-')).join(' ');
    }
    for (let k = 0; k < pb; k += 2 * step) {
      const x0 = s[k] === 'X', x1 = s[k + step] === 'X';
      halves.push(x0 && x1 ? 'ti-ki' : x0 ? 'ti' : x1 ? 'ki' : '-');
    }
    if (s[0] === 'X' && s.slice(1).indexOf('X') === -1) return 'ta';
    return halves.indexOf('-') === -1 ? halves.join('-') : halves.join(' ');
  }
  function sayAll(c, m) {
    const words = [];
    for (let i = 0; i < c.length; i += m.per) {
      const w = sayBeat(c, i, m.per);
      if (w === '-a' && words.length) words[words.length - 1] += '-a';
      else words.push(w || '·');
    }
    return words.join(' ');
  }
  function presets(m) {
    const seen = new Set();
    const list = PRESETS[m.id] ? PRESETS[m.id].map(cells) : generic(m);
    return list.map(c => {
      if (!c) return null;
      const one = fit(c, m.barCells);
      if (seen.has(one)) return null;
      seen.add(one);
      return { cells: one, label: sayAll(one, m) };
    }).filter(Boolean);
  }

  /* ---------------- arpeggios (Song Writer's track.js) ---------------- */
  const ARPS = ['up', 'down', 'updown', 'downup', 'out', 'in', 'alberti', 'oompah', 'bassdown', 'random'];
  const ARP_INFO = {
    up: ['Up', 'Lowest to highest'],
    down: ['Down', 'Highest to lowest'],
    updown: ['Up and down', 'Up, then back down'],
    downup: ['Down and up', 'Down, then back up'],
    out: ['Middle out', 'From the middle to the ends'],
    in: ['Ends in', 'From the ends to the middle'],
    alberti: ['Alberti', 'Low, high, middle, high'],
    oompah: ['Bass and chord', 'The bass, then the rest together'],
    bassdown: ['Bass, then down', 'The bass, then from the top down'],
    random: ['Random', 'Any note — never the same twice in a row']
  };
  const BYS = ['q', 'e', 's'];
  function mapRank(r, N, M) {
    if (N === M) return Math.min(r, M - 1);
    if (r <= 0) return 0;
    if (r >= N - 1) return M - 1;
    if (M <= 2) return r < (N - 1) / 2 ? 0 : M - 1;
    return Math.max(1, Math.min(M - 2, r));
  }
  function arpOrder(arp, M) {
    if (!arp || M < 1) return [];
    if (typeof arp === 'object') {
      return arp.o.map(gr => Array.from(new Set(gr.map(r => mapRank(r, arp.n, M)))).sort((x, y) => x - y));
    }
    const up = Array.from({ length: M }, (x, i) => i);
    const one = list => list.map(r => [r]);
    switch (arp) {
      case 'up': return one(up);
      case 'down': return one(up.slice().reverse());
      case 'updown': return one(M < 3 ? up : up.concat(up.slice(1, -1).reverse()));
      case 'downup': return one(M < 3 ? up.slice().reverse() : up.slice().reverse().concat(up.slice(1, -1)));
      case 'out': { const m = (M - 1) / 2; return one(up.slice().sort((a, b) => Math.abs(a - m) - Math.abs(b - m) || a - b)); }
      case 'in': { const out = []; for (let lo = 0, hi = M - 1; lo <= hi; lo++, hi--) { out.push(lo); if (hi !== lo) out.push(hi); } return one(out); }
      case 'alberti': return one(M < 3 ? up : [0, M - 1, 1, M - 1]);
      case 'oompah': return M < 2 ? [up] : [[0], up.slice(1)];
      case 'bassdown': return one(M < 3 ? up : [0].concat(up.slice(1).reverse()));
      default: return [];
    }
  }
  const spanOf = (by, m) => (by === 'q' ? m.per : by === 'e' ? Math.max(1, Math.min(m.per, 2)) : 1);
  const colsOf = (by, m) => Math.floor(m.barCells / spanOf(by, m));
  const speedName = (by, m) => (by === 'q' ? (m.compound ? 'Dotted quarters' : 'Quarters') : by === 'e' ? '8ths' : '16ths');

  /* ---------------- a box's rhythm ---------------- */
  function defaultRhythm(m) {
    // the user's default: four quarter notes (a strike on every beat, whatever the meter)
    return { kind: 'block', cells: presets(m)[0].cells, preset: 0 };
  }
  function clean(r, m) {
    if (!r || typeof r !== 'object') return defaultRhythm(m);
    if (r.kind === 'held') return { kind: 'held' };
    if (r.kind === 'arp') return { kind: 'arp', arp: ARPS.indexOf(r.arp) !== -1 ? r.arp : 'up', by: BYS.indexOf(r.by) !== -1 ? r.by : 'e' };
    if (r.kind === 'build') {
      const by = BYS.indexOf(r.by) !== -1 ? r.by : 'e';
      const n = Math.max(2, Math.min(8, Math.round(Number(r.n)) || 3));
      const want = colsOf(by, m);
      const src = Array.isArray(r.cols) ? r.cols : [];
      const cols = [];
      for (let i = 0; i < want; i++) {
        const g = src.length ? src[i % src.length] : [];
        cols.push(Array.isArray(g) ? Array.from(new Set(g.map(Number).filter(x => Number.isInteger(x) && x >= 0 && x < n))).sort((a, b) => a - b) : []);
      }
      return { kind: 'build', by, n, cols };
    }
    if (r.kind === 'block') {
      const list = presets(m);
      if (Number.isInteger(r.preset) && list[r.preset] && (!r.cells || r.cells.length !== m.barCells || r.cells === list[r.preset].cells)) {
        return { kind: 'block', cells: list[r.preset].cells, preset: r.preset };
      }
      let c = typeof r.cells === 'string' && /^[XOR]+$/.test(r.cells) ? r.cells : null;
      c = tidy(fit(c, m.barCells));
      const p = list.findIndex(x => x.cells === c);
      return p >= 0 ? { kind: 'block', cells: c, preset: p } : { kind: 'block', cells: c };
    }
    return defaultRhythm(m);
  }
  /* a rhythm carried into another meter: a pre-built one becomes the same place on the new list */
  function refit(r, from, to) {
    if (r && r.kind === 'block' && Number.isInteger(r.preset)) {
      const list = presets(to);
      return { kind: 'block', cells: (list[r.preset] || list[0]).cells, preset: list[r.preset] ? r.preset : 0 };
    }
    return clean(r, to);
  }

  /* ---------------- the strikes of one bar ----------------
     { c (cell in the bar), len (cells until the next strike or a rest), n (ranks, null = every note),
       random?, ring (cells it rings — until a note it shares is struck again) } */
  function pattern(r0, m, M) {
    const r = clean(r0, m);
    const B = m.barCells;
    if (r.kind === 'held') return { held: true, barCells: B, strikes: [], byCell: new Map(), kind: 'held' };
    let strikes = [];
    if (r.kind === 'block') {
      const c = r.cells;
      for (let i = 0; i < B; i++) if (c[i] === 'X') strikes.push({ c: i, n: null });
      strikes.forEach(st => {                       // a strike holds through the O's after it (round the bar)
        let len = 1;
        while (len < B && c[(st.c + len) % B] === 'O') len++;
        st.len = len; st.ring = len;
      });
    } else {
      const span = spanOf(r.by, m);
      if (r.kind === 'arp') {
        const order = arpOrder(r.arp, M);
        for (let i = 0, k = 0; i * span < B; i++) {
          const st = { c: i * span, len: span };
          if (r.arp === 'random') { st.n = null; st.random = true; } else st.n = order[k++ % order.length].slice();
          strikes.push(st);
        }
      } else {
        const groups = r.cols.map((g, i) => ({ i, g })).filter(x => x.g.length);
        const mapped = arpOrder({ o: groups.map(x => x.g), n: r.n }, M);
        groups.forEach((x, j) => strikes.push({ c: x.i * span, n: mapped[j] }));
        strikes.forEach((st, j) => {
          const nx = strikes[(j + 1) % strikes.length];
          st.len = ((nx.c - st.c + B - 1) % B) + 1;            // through the empty columns after it (round the bar)
        });
      }
      // a note rings until it is struck again (or a bar)
      strikes.forEach((st, j) => {
        if (st.random || !st.n) { st.ring = st.len; return; }
        let dist = st.len, ring = B;
        for (let k = 1; k <= strikes.length; k++) {
          const o = strikes[(j + k) % strikes.length];
          if (k > 1) dist += strikes[(j + k - 1) % strikes.length].len;
          if (o.random || !o.n || o.n.some(x => st.n.indexOf(x) !== -1)) { ring = dist; break; }
        }
        st.ring = Math.max(st.len, Math.min(B, ring));
      });
    }
    const byCell = new Map();
    strikes.forEach(st => byCell.set(st.c, st));
    return { held: false, barCells: B, strikes, byCell, kind: r.kind, empty: !strikes.length };
  }
  /* what the box's little strip shows, cell by cell: X strike, O sounding, R silent */
  function stripOf(p) {
    if (p.held) return null;
    const out = new Array(p.barCells).fill('R');
    p.strikes.forEach(st => { for (let i = 0; i < st.len; i++) out[(st.c + i) % p.barCells] = i ? 'O' : 'X'; });
    return out.join('');
  }
  function describe(r0, m) {
    const r = clean(r0, m);
    if (r.kind === 'held') return { title: 'Ring', sub: 'struck once, rings while held' };
    if (r.kind === 'arp') return { title: ARP_INFO[r.arp][0], sub: 'arpeggio · ' + speedName(r.by, m) };
    if (r.kind === 'build') return { title: 'Your own', sub: 'notes in order · ' + speedName(r.by, m) };
    return { title: sayAll(r.cells, m), sub: Number.isInteger(r.preset) ? 'block chords' : 'your own block rhythm' };
  }

  VC.rhythm = {
    METER_CHOICES, meterOf, cells, fit, tidy, presets, sayAll,
    ARPS, ARP_INFO, BYS, arpOrder, spanOf, colsOf, speedName,
    defaultRhythm, clean, refit, pattern, stripOf, describe
  };
})();

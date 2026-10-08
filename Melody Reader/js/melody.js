/* ==========================================================================
   Melody Reader — melody.js
   --------------------------------------------------------------------------
   RR.Melody — where every card's music comes from (ENGINE §3).

   A melody: { title, part, of, song, time: [4,4], notes: [{ p: 'E4'|null, t }] }
   with time in ticks, four to a quarter note (a sixteenth is 1); p null is
   a rest. The notes always fill the bars exactly.

   make(practice, { recent, stats })   a new made-up melody:
     1. its meter, one of the practice's (`times`: 2/4 3/4 4/4 6/8), and —
        with Pick-ups on, half the time — a pick-up before the first bar
        line (a beat, or ti-ti; in 6/8 an eighth); the last bar is then
        that much short, as in printed music (2026-10-07)
     2. the rhythm, bar by bar, from the practice's rhythm cells for that
        meter (the 6/8 cells are a dotted-quarter beat, or two)
     3. the pitches, a walk through the practice's notes: Steps (the next
        note of the practice), Steps and skips, or Leaps too — seconds and
        thirds plus the practice's leaps, by interval: a 4th (P4), a 5th
        (P5), a major 6th (M6); never a tritone, a 6th only between notes
        a quarter or longer, at most two kinds of leap in one melody, and
        at least one leap in it (2026-10-07). End on Do; or, La-based
        (`endLa`, half the melodies), start round La or Mi and end on La
     4. checks, which give way in order when a small practice runs out of
        fresh melodies: first "not one of the last six", then "enough
        different notes" — never "enough notes"
   songCards(id)   a Songbook song, as its one- and two-bar cards
   difficulty(m)   how hard a melody is to read: { rhythm, pitch, total }
   battlePlan(practice, battle)   every melody of a battle, made fair
                   (2026-10-06): each round a difficulty and a rhythm
                   focus; in a round every team gets the same rhythms in
                   another order, with other notes of matching difficulty
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const BAR = RR.BAR;

  // ticks; a negative tick is a rest. In the order they are taught (the user's sequence, 2026-10-07), with
  // the Kodály names: ta, ti-ti · sh · ta-a · ti-ri-ti-ri · sh-sh, ta-a-a-a · syn-co-pa, tam-ti · ti-ti-ri,
  // ti-ri-ti — then 6/8 (`meter: 'compound'`), where a cell is a dotted-quarter beat or two
  const CELLS = [
    { id: 'q', name: 'ta', ticks: [4], w: 3, about: 'quarter' },
    { id: 'ee', name: 'ti-ti', ticks: [2, 2], w: 2, about: 'two eighths' },
    { id: 'qr', name: 'sh', ticks: [-4], w: 0.5, rest: true, about: 'quarter rest' },
    { id: 'h', name: 'ta-a', ticks: [8], w: 1.4, long: true, about: 'half' },
    { id: 'ssss', name: 'ti-ri-ti-ri', ticks: [1, 1, 1, 1], w: 0.9, about: 'four sixteenths' },
    { id: 'hr', name: 'sh-sh', ticks: [-8], w: 0.3, rest: true, about: 'half rest' },
    { id: 'w', name: 'ta-a-a-a', ticks: [16], w: 0.5, long: true, about: 'whole' },
    { id: 'eqe', name: 'syn-co-pa', ticks: [2, 4, 2], w: 0.8, about: 'eighth, quarter, eighth' },
    { id: 'dqe', name: 'tam-ti', ticks: [6, 2], w: 1.1, about: 'dotted quarter, eighth' },
    { id: 'ess', name: 'ti-ti-ri', ticks: [2, 1, 1], w: 0.7, about: 'eighth, two sixteenths' },
    { id: 'sse', name: 'ti-ri-ti', ticks: [1, 1, 2], w: 0.7, about: 'two sixteenths, eighth' },
    { id: 'dh', name: 'ta-a-a', ticks: [12], w: 0.9, long: true, about: 'dotted half' },
    { id: 'c3', name: 'ti-ti-ti', ticks: [2, 2, 2], w: 2.2, about: 'three eighths', meter: 'compound' },
    { id: 'cqe', name: 'ta ti', ticks: [4, 2], w: 2, about: 'quarter, eighth', meter: 'compound' },
    { id: 'ceq', name: 'ti ta', ticks: [2, 4], w: 0.7, about: 'eighth, quarter', meter: 'compound' },
    { id: 'cdq', name: 'tam', ticks: [6], w: 1.8, about: 'dotted quarter', meter: 'compound' },
    { id: 'cdh', name: 'tam-a', ticks: [12], w: 0.6, long: true, about: 'dotted half', meter: 'compound' },
    { id: 'cdqr', name: 'sh (6/8)', ticks: [-6], w: 0.4, rest: true, about: 'dotted quarter rest', meter: 'compound' },
    { id: 'csx', name: 'ti-ri ti ti', ticks: [1, 1, 2, 2], w: 0.6, about: 'two sixteenths, two eighths', meter: 'compound' }
  ];
  CELLS.forEach(c => { c.len = c.ticks.reduce((a, t) => a + Math.abs(t), 0); c.meter = c.meter || 'simple'; });
  const CELL = {};
  CELLS.forEach(c => { CELL[c.id] = c; });
  /* the leaps a practice can allow, in semitones (a 4th from B is a tritone, so it never counts) */
  const LEAPS = { P4: 5, P5: 7, M6: 9 };

  function rng(seed) {                       // mulberry32
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(r, items, w) {
    let sum = 0; items.forEach((it, i) => { sum += w(it, i); });
    if (sum <= 0) return items[Math.floor(r() * items.length)];
    let x = r() * sum;
    for (let i = 0; i < items.length; i++) { x -= w(items[i], i); if (x <= 0) return items[i]; }
    return items[items.length - 1];
  }
  const shuffle = (r, a) => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = x[i]; x[i] = x[j]; x[j] = t; } return x; };

  /* where a cell may start in its bar: a whole note or a dotted half (or 6/8's) at the start, and nothing two
     beats long (ta-a, sh-sh, syn-co-pa, tam-ti) across the middle of 4/4 */
  function placeOk(c, pos, M) {
    if ((c.len === 16 || c.len === 12) && pos !== 0) return false;
    if (c.len === 8 && M.barTicks === 16 && pos % 8 !== 0) return false;
    return true;
  }
  /* a pick-up: in 2/4 3/4 4/4 a beat — ta, or ti-ti when the practice has it; in 6/8 one eighth */
  function pickupFor(s, M, r) {
    if (M.compound) return [2];
    return s.rhythms.includes('ee') && (!s.rhythms.includes('q') || r() < 0.5) ? [2, 2] : [4];
  }

  function makeRhythm(s, r, focus, time, up) {
    const M = RR.meter(time), barTicks = M.barTicks, kind = M.compound ? 'compound' : 'simple';
    let cells = CELLS.filter(c => s.rhythms.includes(c.id) && c.meter === kind);
    if (!cells.some(c => !c.rest)) cells = cells.concat(M.compound ? [CELL.cdq, CELL.c3] : [CELL.q]);
    // a level's new rhythm (its focus), and a battle round's, come up three times as often
    const stress = (s.focus || []).concat(focus ? [focus] : []);
    const wt = c => c.w * (stress.includes(c.id) ? 3 : 1);
    const p = up ? up.reduce((a, t) => a + t, 0) : 0;
    const out = up ? [{ id: null, ticks: up.slice(), len: p }] : [], bars = [];
    for (let b = 0; b < s.bars; b++) {
      const lastBar = b === s.bars - 1;
      const room = lastBar ? barTicks - p : barTicks;          // a pick-up's length comes off the last bar
      // the ending: seven times in ten a long note is kept for the end of the last bar
      let reserve = null;
      if (lastBar && s.endLong && r() < 0.7) {
        const longs = cells.filter(c => c.long && c.len <= (s.bars === 1 ? barTicks / 2 : barTicks) && c.len <= room && placeOk(c, room - c.len, M));
        if (longs.length) reserve = pick(r, longs, wt);
      }
      const space = room - (reserve ? reserve.len : 0);
      let left = space;
      const bar = [];
      let guard = 0;
      while (left > 0 && guard++ < 40) {
        const pos = space - left;
        const prev = bar.length ? bar[bar.length - 1] : out[out.length - 1];
        const fits = cells.filter(c => {
          if (c.len > left) return false;
          if (c.rest && b === 0 && !bar.length) return false;                 // never start on a rest (nor straight after a pick-up)
          if (c.rest && prev && prev.rest) return false;                       // never two rests running
          if (c.rest && lastBar && left === c.len && !reserve) return false;   // never end on one
          return placeOk(c, pos, M);
        });
        // nothing fits (the short end of a 6/8 bar after a pick-up): a plain note of what is left
        const c = fits.length ? pick(r, fits, wt) : !M.compound && CELL.q.len <= left ? CELL.q : { id: null, ticks: [left], len: left };
        bar.push(c); left -= c.len;
      }
      if (reserve) bar.push(reserve);
      out.push.apply(out, bar);
      bars.push(bar.map(c => c.id || null));
    }
    const flat = [];
    out.forEach(c => c.ticks.forEach(t => flat.push(t < 0 ? { rest: true, t: -t } : { rest: false, t })));
    flat.cells = bars;                         // the cells, bar by bar (a battle's fair copies reorder them)
    flat.pick = up ? up.slice() : null;        // the pick-up's notes, before the first bar line
    return flat;
  }

  /* o: { la (a La-based melody: home is La), leaps (the kinds this melody may use) } */
  function makePitches(s, durs, r, stats, o) {
    o = o || {};
    const count = durs.length;
    const pool = s.notes.filter(id => BAR[id]).sort((a, b) => BAR[a].step - BAR[b].step);
    const ix = id => pool.indexOf(id);
    // tricky notes come up more often: a note read right half the time, twice as often
    const tw = id => {
      if (!s.tricky || !stats) return 1;
      const st = stats[id]; if (!st || st.n < 2) return 1;
      return 1 + 2 * (1 - st.first / st.n);
    };
    const fw = id => (s.focus || []).includes(id) ? 2 : 1;              // a level's new note, twice as often
    const la = !!o.la && pool.some(id => id[0] === 'A');
    const homes = pool.filter(id => id[0] === (la ? 'A' : 'C'));
    const semis = (o.leaps || s.leaps || []).map(k => LEAPS[k]).filter(Boolean);
    const seq = [];
    let cur = pick(r, pool, id => (homes.includes(id) ? 2 : 1) * ((la ? id[0] === 'E' : id === 'E4' || id === 'G4') ? 1.5 : 1) * tw(id) * fw(id));
    for (let n = 0; n < count; n++) {
      if (n > 0) {
        const ci = ix(cur), sc = BAR[cur].step;
        let cands;
        if (s.moves === 'leaps') {
          // seconds and thirds (or the next note of a gappy practice), and the practice's leaps
          const short = durs[n] <= 2 || durs[n - 1] <= 2;
          cands = pool.filter(id => {
            if (Math.abs(BAR[id].step - sc) <= 2 || Math.abs(ix(id) - ci) <= 1) return true;
            const d = Math.abs(BAR[id].midi - BAR[cur].midi);
            return semis.includes(d) && !(short && d > 7);
          });
        } else {
          const maxD = s.moves === 'steps' ? 1 : 2;
          cands = pool.filter(id => Math.abs(ix(id) - ci) <= maxD);
        }
        const rep2 = seq.length >= 2 && seq[seq.length - 1] === seq[seq.length - 2];
        // the last note goes home (Do, or La) — by a move the practice allows; if home is out of reach, make() tries again
        const goHome = n === count - 1 && (s.endDo || la) ? cands.filter(id => homes.includes(id)) : [];
        if (goHome.length) cur = goHome.reduce((a, id) => Math.abs(BAR[id].step - sc) < Math.abs(BAR[a].step - sc) ? id : a, goHome[0]);
        else cur = pick(r, cands, id => {
          const d = Math.abs(ix(id) - ci);
          if (d === 0) return pool.length === 1 ? 1 : rep2 ? 0 : 0.7;
          const leap = s.moves === 'leaps' && d > 1 && Math.abs(BAR[id].step - sc) >= 3;
          return (leap ? 1.8 : d === 1 ? 4 : d === 2 ? 2 : 1.4) * tw(id) * fw(id);
        });
      }
      seq.push(cur);
    }
    return seq;
  }
  /* a leap of one of these kinds somewhere in the walk */
  function hasLeap(seq, kinds) {
    const semis = kinds.map(k => LEAPS[k]);
    for (let i = 1; i < seq.length; i++) {
      if (Math.abs(BAR[seq[i]].step - BAR[seq[i - 1]].step) >= 3 && semis.includes(Math.abs(BAR[seq[i]].midi - BAR[seq[i - 1]].midi))) return true;
    }
    return false;
  }

  function make(s, opts) {
    const o = opts || {};
    const recent = o.recent || [];
    const times = Array.isArray(s.times) && s.times.length ? s.times : [s.time];
    let last = null;
    for (let tries = 0; tries < 40; tries++) {
      const seed = Math.floor(Math.random() * 1e9);
      const r = rng(seed);
      const time = times[Math.floor(r() * times.length)];
      const M = RR.meter(time);
      const up = s.pickup && r() < 0.5 ? pickupFor(s, M, r) : null;
      const rhythm = makeRhythm(s, r, o.focus, time, up);
      const durs = rhythm.filter(x => !x.rest).map(x => x.t), count = durs.length;
      if (count < (s.bars === 1 ? Math.min(3, time[0]) : 4) && tries < 39) continue;
      // three kinds of leap allowed: any two of them in one melody (the user's "not all in the same example")
      const kinds = s.moves === 'leaps' ? ((s.leaps || []).length > 2 ? shuffle(r, s.leaps).slice(0, 2) : (s.leaps || []).slice()) : [];
      const la = !!s.endLa && r() < 0.5;
      const seq = makePitches(s, durs, r, o.stats, { la, leaps: kinds });
      const distinct = new Set(seq).size;
      let j = 0;
      const notes = rhythm.map(x => x.rest ? { p: null, t: x.t } : { p: seq[j++], t: x.t });
      last = { title: null, time: time.slice(), notes, seed, cells: rhythm.cells };
      if (up) { last.pickup = up.reduce((a, t) => a + t, 0); last.pick = up.slice(); }
      if (la) last.la = true;
      if (kinds.length) last.leaps = kinds;
      if (distinct < Math.min(3, s.notes.length, Math.ceil(count * 0.6)) && tries < 30) continue;
      if (kinds.length && !hasLeap(seq, kinds) && tries < 30) continue;          // a leaps practice: a leap in every melody
      const home = la ? 'A' : 'C';
      if ((s.endDo || la) && s.notes.some(id => id[0] === home) && seq[seq.length - 1][0] !== home && tries < 36) continue;   // home was out of reach: again
      const key = notes.map(n => (n.p || 'r') + n.t).join(' ');
      if (recent.includes(key) && tries < 20) continue;
      recent.push(key); if (recent.length > 6) recent.shift();
      return last;
    }
    return last;
  }

  /* ---------------- how hard a melody is to read ----------------
     Rhythm: a long note is easy, a quarter 1, an eighth more, a dotted
     rhythm or a sixteenth more again, a rest asks for counting. Pitch: a
     repeat or a step is easy, a skip harder, a leap harder the wider it
     is; a ledger line (C) and a wide range add a little. Only ever compared
     between melodies of one practice (the same time and bars). */
  function difficulty(m) {
    let rhythm = 0, pitch = 0;
    m.notes.forEach(n => {
      if (!n.p) { rhythm += 0.9; return; }
      const t = n.t;
      rhythm += t >= 8 ? 0.6 : t === 6 ? 1.8 : t === 4 ? 1 : t === 3 ? 2.2 : t === 2 ? 1.5 : t === 1 ? 2.4 : 1.5;
    });
    const ps = m.notes.filter(n => n.p && BAR[n.p]).map(n => BAR[n.p].step);
    ps.forEach((st, i) => {
      if (st <= 28) pitch += 0.3;                                   // C4, on its ledger line
      if (!i) return;
      const d = Math.abs(st - ps[i - 1]);
      pitch += d === 0 ? 0.1 : d === 1 ? 0.3 : d === 2 ? 0.7 : d <= 4 ? 1.3 : 2;
    });
    if (ps.length) pitch += (Math.max.apply(null, ps) - Math.min.apply(null, ps)) * 0.08;
    return { rhythm, pitch, total: rhythm + pitch };
  }

  /* the rules a bar's cells keep (as in makeRhythm) — for reordering them; a pick-up shortens the last bar */
  function cellsOk(s, bars, time, p) {
    const M = RR.meter(time || s.time);
    p = p || 0;
    let prev = p ? { rest: false } : null, first = !p;
    for (let b = 0; b < bars.length; b++) {
      let pos = 0;
      const room = b === bars.length - 1 ? M.barTicks - p : M.barTicks;
      for (let k = 0; k < bars[b].length; k++) {
        const c = CELL[bars[b][k]]; if (!c) return false;
        if (c.rest && (first || (b === 0 && k === 0))) return false;
        if (c.rest && prev && prev.rest) return false;
        if (!placeOk(c, pos, M)) return false;
        pos += c.len; prev = c; first = false;
      }
      if (pos !== room) return false;
    }
    return !(prev && prev.rest);
  }
  const rhythmKey = m => m.notes.map(n => (n.p ? '' : 'r') + n.t).join(' ');
  const pitchKey = m => m.notes.map(n => n.p || 'r').join(' ');

  /* a melody as a card of its own: its meter, pick-up, home and leaps travel with it */
  function cardOf(m, notes) {
    const c = { title: null, time: m.time.slice(), notes: notes || RR.clone(m.notes), cells: m.cells };
    ['pickup', 'pick', 'la', 'leaps'].forEach(k => { if (m[k]) c[k] = Array.isArray(m[k]) ? m[k].slice() : m[k]; });
    return c;
  }

  /* another team's copy of a round's melody: the same cells in another order
     (bar by bar; a long last note stays last), then a new walk through the
     notes whose difficulty is nearest the model's */
  function variant(s, model, r, moves, used, orders) {
    let bars = model.cells;
    if (Array.isArray(bars) && bars.every(b => b.every(id => CELL[id]))) {
      const keyOf = bs => bs.map(b => b.join(',')).join('|');
      orders = orders || new Set([keyOf(bars)]);
      let best = null;
      for (let t = 0; t < 60 && !best; t++) {
        const tryBars = bars.map((b, i) => {
          const last = i === bars.length - 1, keepEnd = last && b.length > 1 && CELL[b[b.length - 1]].long;
          return keepEnd ? shuffle(r, b.slice(0, -1)).concat(b[b.length - 1]) : shuffle(r, b);
        });
        const order = bars.length > 1 && !model.pickup && r() < 0.5 && !CELL[bars[bars.length - 1].slice(-1)[0]].long ? shuffle(r, tryBars) : tryBars;
        // an order no team in this round has had yet, if the rhythms allow one
        if (cellsOk(s, order, model.time, model.pickup) && (!orders.has(keyOf(order)) || t > 50)) best = order;
      }
      bars = best || bars;
      orders.add(keyOf(bars));
    } else bars = null;
    const durs = (bars && model.pick) ? model.pick.slice() : [];
    if (bars) bars.forEach(b => b.forEach(id => CELL[id].ticks.forEach(t => durs.push(t))));
    else model.notes.forEach(n => durs.push(n.p ? n.t : -n.t));
    const sounding = durs.filter(t => t > 0);
    const target = difficulty(model).pitch, ms = Object.assign({}, s, { moves });
    let pickNotes = null, bestGap = Infinity;
    // up to 200 walks, stopping at the first within a quarter point (a melody with unusual leaps needs more looking)
    for (let t = 0; t < 200; t++) {
      const seq = makePitches(ms, sounding, r, null, { la: model.la, leaps: model.leaps });
      if (new Set(seq).size < Math.min(3, s.notes.length, Math.ceil(seq.length * 0.6)) && t < 150) continue;
      let j = 0;
      const notes = durs.map(d => d < 0 ? { p: null, t: -d } : { p: seq[j++], t: d });
      const m = { notes };
      if (pitchKey(m) === pitchKey(model) && t < 190) continue;
      const gap = Math.abs(difficulty(m).pitch - target) + (used.has(pitchKey(m)) ? 3 : 0);
      if (gap < bestGap) { bestGap = gap; pickNotes = notes; }
      if (gap < 0.25) break;
    }
    const out = cardOf(model, pickNotes || RR.clone(model.notes));
    out.cells = bars || model.cells;
    used.add(pitchKey(out));
    return out;
  }

  /* every melody of a battle, in the order they are played. A wide sample of
     what the practice can make (with easier moves and different rhythm focuses
     mixed in) is sorted by difficulty; each round takes a target — easier at
     the start, harder at the end, wobbling so some rounds are easier — and a
     focus it didn't have last round; the round's first team gets the melody
     nearest that target, the other teams fair copies of it */
  function battlePlan(s, b, opts) {
    const o = opts || {}, r = rng(o.seed != null ? o.seed : Math.floor(Math.random() * 1e9));
    const T = b.teams.length, R = b.rounds, P = b.per;
    const LV = ['steps', 'skips', 'leaps'], top = Math.max(0, LV.indexOf(s.moves));
    const focuses = [null].concat(s.rhythms.filter(id => CELL[id] && !CELL[id].rest && CELL[id].ticks.length > 1));
    const pool = [];
    for (let i = 0; i < 180; i++) {
      const moves = LV[Math.min(top, Math.floor(r() * (top + 1.6)))];   // the practice's own moves most, easier ones too
      const focus = focuses[Math.floor(r() * focuses.length)];
      const m = make(Object.assign({}, s, { moves }), { recent: [], focus });
      if (!m) continue;
      m.moves = moves; m.focus = focus; m.d = difficulty(m).total;
      pool.push(m);
    }
    pool.sort((a, c) => a.d - c.d);
    const at = q => pool[Math.max(0, Math.min(pool.length - 1, Math.round(q * (pool.length - 1))))].d;
    const plan = new Array(R * T * P);
    const usedRhythm = new Set(), used = new Set();
    let lastFocus = [];
    for (let rd = 0; rd < R; rd++) {
      const q = R === 1 ? 0.5 : 0.15 + 0.7 * rd / (R - 1) + (r() - 0.5) * 0.2;
      const target = at(Math.max(0.05, Math.min(0.95, q)));
      const focusNow = [];
      for (let k = 0; k < P; k++) {
        // the model: nearest the target, a new rhythm, a focus other than last round's
        let model = null, bestScore = Infinity;
        pool.forEach(m => {
          const sc = Math.abs(m.d - target) + (usedRhythm.has(rhythmKey(m)) ? 4 : 0) +
            (m.focus && lastFocus.includes(m.focus) ? 1.5 : 0) + (focusNow.includes(m.focus) ? 1 : 0);
          if (sc < bestScore) { bestScore = sc; model = m; }
        });
        if (!model) model = make(s, { recent: [] });
        usedRhythm.add(rhythmKey(model)); used.add(pitchKey(model)); focusNow.push(model.focus);
        const moves = model.moves || s.moves;
        const order = shuffle(r, Array.from({ length: T }, (_, i) => i));   // which team gets the model itself: any of them
        const orders = new Set(Array.isArray(model.cells) ? [model.cells.map(b => b.join(',')).join('|')] : []);
        order.forEach((team, n) => {
          const card = n === 0 ? cardOf(model) : variant(s, model, r, moves, used, orders);
          card.round = rd;
          plan[rd * T * P + team * P + k] = card;
        });
      }
      lastFocus = focusNow.filter(Boolean);
    }
    return plan;
  }

  function parse(src) {
    return src.split(/\s+/).filter(t => t && t !== '|').map(t => {
      const [p, d] = t.split(':');
      return { p: p === 'r' ? null : p, t: +d };
    });
  }
  function songCards(id) {
    const s = RR.SONGS[id];
    if (!s) return [];
    return s.cards.map((src, i) => ({ title: s.title, part: i + 1, of: s.cards.length, song: id, time: (s.time || [4, 4]).slice(), notes: parse(src) }));
  }
  /* every pitch a song uses — a practice that plays it needs these bars live */
  function songNotes(id) {
    const set = new Set();
    songCards(id).forEach(c => c.notes.forEach(n => { if (n.p) set.add(n.p); }));
    return set;
  }

  RR.Melody = { CELLS, CELL, LEAPS, rng, make, songCards, songNotes, parse, difficulty, battlePlan, variant, cellsOk, hasLeap };
})();

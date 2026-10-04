/* ==========================================================================
   Melody Reader — melody.js
   --------------------------------------------------------------------------
   RR.Melody — where every card's music comes from (ENGINE §3).

   A melody: { title, part, of, song, time: [4,4], notes: [{ p: 'E4'|null, t }] }
   with time in ticks, four to a quarter note (a sixteenth is 1); p null is
   a rest. The notes always fill the bars exactly.

   make(practice, { recent, stats })   a new made-up melody:
     1. the rhythm, bar by bar, from the practice's rhythm cells
     2. the pitches, a walk through the practice's notes
     3. checks, which give way in order when a small practice runs out of
        fresh melodies: first "not one of the last six", then "enough
        different notes" — never "enough notes"
   songCards(id)   a Songbook song, as its one- and two-bar cards
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const BAR = RR.BAR;

  // ticks; a negative tick is a rest
  const CELLS = [
    { id: 'q', name: 'ta', ticks: [4], w: 3, about: 'quarter' },
    { id: 'h', name: 'ta-a', ticks: [8], w: 1.4, long: true, about: 'half' },
    { id: 'dh', name: 'ta-a-a', ticks: [12], w: 0.9, long: true, about: 'dotted half' },
    { id: 'w', name: 'ta-a-a-a', ticks: [16], w: 0.5, long: true, about: 'whole' },
    { id: 'ee', name: 'ti-ti', ticks: [2, 2], w: 2, about: 'two eighths' },
    { id: 'dqe', name: 'ta-i ti', ticks: [6, 2], w: 1.1, about: 'dotted quarter, eighth' },
    { id: 'ssss', name: 'ti-ka-ti-ka', ticks: [1, 1, 1, 1], w: 0.9, about: 'four sixteenths' },
    { id: 'ess', name: 'ti ti-ka', ticks: [2, 1, 1], w: 0.7, about: 'eighth, two sixteenths' },
    { id: 'sse', name: 'ti-ka ti', ticks: [1, 1, 2], w: 0.7, about: 'two sixteenths, eighth' },
    { id: 'qr', name: 'sh', ticks: [-4], w: 0.5, rest: true, about: 'quarter rest' },
    { id: 'hr', name: 'sh-sh', ticks: [-8], w: 0.3, rest: true, about: 'half rest' }
  ];
  CELLS.forEach(c => { c.len = c.ticks.reduce((a, t) => a + Math.abs(t), 0); });
  const CELL = {};
  CELLS.forEach(c => { CELL[c.id] = c; });

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

  function makeRhythm(s, r) {
    const barTicks = s.time[0] * 4;
    let cells = CELLS.filter(c => s.rhythms.includes(c.id));
    if (!cells.some(c => !c.rest)) cells = cells.concat(CELL.q);
    const out = [];
    for (let b = 0; b < s.bars; b++) {
      const lastBar = b === s.bars - 1;
      // the ending: seven times in ten a long note is kept for the end of the last bar
      let reserve = null;
      if (lastBar && s.endLong && r() < 0.7) {
        const longs = cells.filter(c => c.long && c.len <= (s.bars === 1 ? barTicks / 2 : barTicks));
        if (longs.length) reserve = pick(r, longs, c => c.w);
      }
      const space = barTicks - (reserve ? reserve.len : 0);
      let left = space;
      const bar = [];
      let guard = 0;
      while (left > 0 && guard++ < 40) {
        const pos = space - left;
        const prev = bar.length ? bar[bar.length - 1] : out[out.length - 1];
        const fits = cells.filter(c => {
          if (c.len > left) return false;
          if (c.rest && !out.length && !bar.length) return false;              // never start on a rest
          if (c.rest && prev && prev.rest) return false;                       // never two rests running
          if (c.rest && lastBar && left === c.len && !reserve) return false;   // never end on one
          if (c.len === 16 && pos !== 0) return false;                         // whole notes start the bar
          if (c.len === 12 && pos !== 0) return false;                         // so do dotted halves
          if (c.len === 8 && s.time[0] === 4 && pos % 8 !== 0) return false;   // no half note across the middle of 4/4
          return true;
        });
        const c = fits.length ? pick(r, fits, c2 => c2.w) : (CELL.q.len <= left ? CELL.q : { ticks: [left], len: left });
        bar.push(c); left -= c.len;
      }
      if (reserve) bar.push(reserve);
      out.push.apply(out, bar);
    }
    const flat = [];
    out.forEach(c => c.ticks.forEach(t => flat.push(t < 0 ? { rest: true, t: -t } : { rest: false, t })));
    return flat;
  }

  function makePitches(s, durs, r, stats) {
    const count = durs.length;
    const pool = s.notes.filter(id => BAR[id]).sort((a, b) => BAR[a].step - BAR[b].step);
    const ix = id => pool.indexOf(id);
    // tricky notes come up more often: a note read right half the time, twice as often
    const tw = id => {
      if (!s.tricky || !stats) return 1;
      const st = stats[id]; if (!st || st.n < 2) return 1;
      return 1 + 2 * (1 - st.first / st.n);
    };
    const home = pool.includes('C4') ? 'C4' : pool.includes('C5') ? 'C5' : null;
    const seq = [];
    let cur = pick(r, pool, id => (id === home ? 2 : 1) * (id === 'E4' || id === 'G4' ? 1.5 : 1) * tw(id));
    for (let n = 0; n < count; n++) {
      if (n > 0) {
        if (n === count - 1 && s.endDo && home) {
          const cs = pool.filter(id => id[0] === 'C');
          cur = cs.reduce((a, id) => Math.abs(BAR[id].step - BAR[cur].step) < Math.abs(BAR[a].step - BAR[cur].step) ? id : a, cs[0]);
        } else {
          const ci = ix(cur);
          const maxD = s.moves === 'steps' ? 1 : s.moves === 'skips' ? 2 : 99;
          // a leap next to a short note (an eighth or less) stops at a fifth
          const reach = durs[n] <= 2 || durs[n - 1] <= 2 ? 4 : 7;
          const cands = pool.filter(id => s.moves === 'leaps' ? Math.abs(BAR[id].step - BAR[cur].step) <= reach : Math.abs(ix(id) - ci) <= maxD);
          const rep2 = seq.length >= 2 && seq[seq.length - 1] === seq[seq.length - 2];
          cur = pick(r, cands, id => {
            const d = Math.abs(ix(id) - ci);
            if (d === 0) return pool.length === 1 ? 1 : rep2 ? 0 : 0.7;
            return (d === 1 ? 4 : d === 2 ? 2 : 1.4) * tw(id);
          });
        }
      }
      seq.push(cur);
    }
    return seq;
  }

  function make(s, opts) {
    const o = opts || {};
    const recent = o.recent || [];
    let last = null;
    for (let tries = 0; tries < 40; tries++) {
      const seed = Math.floor(Math.random() * 1e9);
      const r = rng(seed);
      const rhythm = makeRhythm(s, r);
      const count = rhythm.filter(x => !x.rest).length;
      if (count < (s.bars === 1 ? Math.min(3, s.time[0]) : 4) && tries < 39) continue;
      const seq = makePitches(s, rhythm.filter(x => !x.rest).map(x => x.t), r, o.stats);
      const distinct = new Set(seq).size;
      let j = 0;
      const notes = rhythm.map(x => x.rest ? { p: null, t: x.t } : { p: seq[j++], t: x.t });
      last = { title: null, time: s.time.slice(), notes, seed };
      if (distinct < Math.min(3, s.notes.length, Math.ceil(count * 0.6)) && tries < 30) continue;
      const key = notes.map(n => (n.p || 'r') + n.t).join(' ');
      if (recent.includes(key) && tries < 20) continue;
      recent.push(key); if (recent.length > 6) recent.shift();
      return last;
    }
    return last;
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

  RR.Melody = { CELLS, CELL, rng, make, songCards, songNotes, parse };
})();

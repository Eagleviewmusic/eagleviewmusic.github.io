/* ==========================================================================
   Melody Reader — points.js
   --------------------------------------------------------------------------
   RR.Points — what a melody is worth: 1 to 20 (Melody Reader Design/
   POINTS-AND-COUNT-IN.md). Pure functions, so the tests page can try them.

     tier 1   the notes: first try 1, second try ½ → max(1, ⌊8 × credit ÷ n⌋)
     tier 2   every note first time, in the player's own steady beat → 9–12
              (8 when the spacing isn't the music's)
     tier 3   a Test with the metronome, every note right and in time:
              Slow 13–15 · Moderate 16–18 · Fast 19–20 — every note right
              first time but not all with the click (a little behind, say)
              is scored as on your own: 9–12 (2026-10-07)

   follower()  which written note a strike in a metronome run is: by where
              the player is, not only by the clock (2026-10-07)

   Times are seconds, starts are the notes' written starts in ticks
   (sixteenths). Stars follow the tiers: ★ 1–7 · ★★ 8–12 · ★★★ 13–20.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;

  const PACES = [
    { id: 'slow', name: 'Slow', lo: 13, hi: 15 },
    { id: 'moderate', name: 'Moderate', lo: 16, hi: 18 },
    { id: 'fast', name: 'Fast', lo: 19, hi: 20 }
  ];
  const paceOf = id => PACES.find(p => p.id === id) || PACES[0];

  /* tier 1: tries[i] = the slips on note i before it was found */
  function reading(tries) {
    const n = tries.length; if (!n) return 8;
    const credit = tries.reduce((a, t) => a + (t === 0 ? 1 : t === 1 ? 0.5 : 0), 0);
    return Math.max(1, Math.floor(8 * credit / n + 1e-9));
  }

  /* tier 2: how well the strike times keep the written spacing, at the
     player's own tempo. A least-squares line, time = a + b × start; what is
     left over (RMS), in beats, is the error. */
  function rhythm(starts, times) {
    const n = starts.length;
    if (n < 3) return { grade: 12, err: 0, bpm: null };             // nothing to judge
    const ms = starts.reduce((a, s) => a + s, 0) / n, mt = times.reduce((a, t) => a + t, 0) / n;
    let cov = 0, vs = 0;
    for (let i = 0; i < n; i++) { cov += (starts[i] - ms) * (times[i] - mt); vs += (starts[i] - ms) ** 2; }
    if (!vs) return { grade: 12, err: 0, bpm: null };
    const b = cov / vs, a = mt - b * ms;
    if (!(b > 0)) return { grade: 8, err: Infinity, bpm: null };
    const beat = 4 * b, bpm = 60 / beat;
    let ss = 0;
    for (let i = 0; i < n; i++) ss += (times[i] - (a + b * starts[i])) ** 2;
    const err = Math.sqrt(ss / n) / beat;
    const grade = bpm < 30 ? 8 : err <= 0.06 ? 12 : err <= 0.10 ? 11 : err <= 0.15 ? 10 : err <= 0.21 ? 9 : 8;
    return { grade, err, bpm };
  }

  /* played on your own: tiers 1 and 2 */
  function free(o) {
    const n = o.tries.length;
    if (o.tries.every(t => t === 0)) {
      const r = rhythm(o.starts, o.times);
      return { pts: r.grade, tier: r.grade >= 9 ? 2 : 1, rhythm: r, word: { 12: 'Steady beat!', 11: 'Great rhythm!', 10: 'Good rhythm!', 9: 'Good rhythm!', 8: 'Every note!' }[r.grade] };
    }
    const right = o.tries.filter(t => t === 0).length;
    return { pts: reading(o.tries), tier: 1, word: 'Found them all!', detail: right + ' of ' + n + ' first time' };
  }

  /* Count me in: judge[i] is Perfect · Good · Early · Late (within the click's window) · Off (found,
     but further from the click) · Missed (never played) for each note; tries[i] = the wrong bars
     struck before note i was found (the follower's, below); wrong = all of them.
       every note first time, all Perfect/Good       → tier 3, by the pace
       every note first time, some off the click     → the player's own steady beat, as on your own:
                                                       9–12 (at least 9 if all were within the window)
       a wrong bar or a missed note                   → the notes found: first try 1, second ½, missed 0 */
  function countIn(o) {
    const n = o.judge.length, pace = paceOf(o.pace);
    const tries = Array.isArray(o.tries) && o.tries.length === n ? o.tries : o.judge.map(() => 0);
    const count = w => o.judge.filter(j => j === w).length;
    const missed = count('Missed'), far = count('Off'), off = count('Early') + count('Late') + far, perfect = count('Perfect');
    if (!missed && !tries.some(t => t > 0)) {
      if (!off) {
        const p = n ? perfect / n : 1;
        const pts = pace.id === 'fast' ? (p >= 0.6 ? 20 : 19) : p >= 0.8 ? pace.hi : p >= 0.5 ? pace.hi - 1 : pace.lo;
        return { pts, tier: 3, word: pace.id === 'fast' ? 'Fast and on the beat!' : 'On the beat!', detail: pace.name };
      }
      const r = rhythm(o.starts, o.times);
      const pts = far ? r.grade : Math.max(9, r.grade);
      return { pts, tier: pts >= 9 ? 2 : 1, rhythm: r, word: 'Every note!', detail: off + (off === 1 ? ' note' : ' notes') + ' not quite with the click' };
    }
    const credit = o.judge.reduce((a, j, i) => a + (j === 'Missed' ? 0 : tries[i] === 0 ? 1 : tries[i] === 1 ? 0.5 : 0), 0);
    const wrong = o.wrong || tries.reduce((a, t) => a + t, 0);
    return {
      pts: Math.max(1, Math.floor(8 * credit / Math.max(1, n) + 1e-9)), tier: 1, word: 'Keep at it!',
      detail: (n - missed) + ' of ' + n + ' played' + (wrong ? ' · ' + wrong + (wrong === 1 ? ' wrong bar' : ' wrong bars') : '')
    };
  }

  /* Following a metronome run (2026-10-07). It used to be the clock alone: a note counted only within
     its window of its click, so a player a little slow — easy to be — drifted out of the windows a few
     notes in, and every note after that was Missed and every strike a wrong bar (1–4 points for what
     would be 12 on your own). Now each note is expected a written length after the last one found, at
     the player's own tempo (the last five notes found, kept to 60–160% of the metronome's; the
     metronome's own until there are two), and a strike is the right bar nearest where its note is
     expected — passing over a note marks that one Missed. The click only decides the judgement:
     Perfect · Good · Early · Late, or Off when it is further than the window.
       notes: [{ p, start (ticks), rest }]
       at: { startT, spt (s a tick), beat (s), perfect, good, ok (s) }   — all on one clock */
  function follower(notes, at) {
    const found = [], judge = notes.map(() => null), tries = notes.map(() => 0), times = notes.map(() => null);
    let wrong = 0;
    const last = () => found.length ? found[found.length - 1] : null;
    function speed() {
      const m = found.slice(-5);
      if (m.length < 2) return at.spt;
      const xs = m.map(f => notes[f.i].start), ys = m.map(f => f.t);
      const mx = xs.reduce((a, x) => a + x, 0) / xs.length, my = ys.reduce((a, y) => a + y, 0) / ys.length;
      let c = 0, v = 0;
      xs.forEach((x, k) => { c += (x - mx) * (ys[k] - my); v += (x - mx) * (x - mx); });
      const b = v ? c / v : at.spt;
      return Math.max(0.6 * at.spt, Math.min(1.6 * at.spt, b > 0 ? b : at.spt));
    }
    const click = i => at.startT + notes[i].start * at.spt;
    const expect = i => { const l = last(); return l ? l.t + (notes[i].start - notes[l.i].start) * speed() : click(i); };
    /* how far either side of where it is expected a strike may be: the click's window, or 30% of the way
       from the last note found when that is wider; the first note may come up to a beat late */
    function reach(i) {
      const l = last();
      if (!l) return [at.ok, Math.max(at.ok, 1.2 * at.beat)];
      const w = Math.max(at.ok, 0.3 * (expect(i) - l.t));
      return [w, w];
    }
    function next() {
      for (let i = last() ? last().i + 1 : 0; i < notes.length; i++) if (!notes[i].rest && !judge[i]) return i;
      return -1;
    }
    function strike(id, t) {
      const from = last() ? last().i + 1 : 0;
      let best = null, near = null, passed = 0;
      for (let i = from; i < notes.length; i++) {
        if (notes[i].rest || judge[i]) continue;
        const d = t - expect(i), r = reach(i);
        if (d < -r[0]) break;                                   // too early for this note, and so for every later one
        if (d <= r[1]) {
          const sc = Math.abs(d) + 0.15 * passed;               // passing over a note costs a little
          if (!near || sc < near.sc) near = { i, sc };
          if (notes[i].p === id && (!best || sc < best.sc)) best = { i, sc };
        }
        passed++;
      }
      if (best) {
        for (let k = from; k < best.i; k++) if (!notes[k].rest && !judge[k]) judge[k] = 'Missed';
        found.push({ i: best.i, t });
        const g = t - click(best.i), a = Math.abs(g);
        judge[best.i] = a <= at.perfect ? 'Perfect' : a <= at.good ? 'Good' : a <= at.ok ? (g < 0 ? 'Early' : 'Late') : 'Off';
        times[best.i] = t;
        return { i: best.i, judge: judge[best.i] };
      }
      const k = near ? near.i : next();
      if (k < 0) return { stray: true };                         // after the last note: nothing to count it against
      wrong++; tries[k]++;
      return { wrong: k };
    }
    /* when the run can end: just after the last note is played — or, if the player stops, once the next
       note is well overdue (and never before the metronome's end, `metroEnd`) */
    function endAt(metroEnd) {
      const k = next();
      if (k < 0) return last() ? last().t + 0.3 : metroEnd;
      return Math.max(metroEnd, expect(k) + reach(k)[1] + Math.max(1, at.beat));
    }
    return { strike, expect, next, endAt, judge, tries, times, found, wrong: () => wrong };
  }

  const starsFor = pts => pts >= 13 ? 3 : pts >= 8 ? 2 : pts >= 1 ? 1 : 0;

  /* a practice's tempo for a pace (Slow · Moderate · Fast) */
  RR.paceTempo = (s, id) => {
    const t = s && Array.isArray(s.tempos) ? s.tempos : [60, 80, 100];
    return t[Math.max(0, PACES.findIndex(p => p.id === id))] || 80;
  };

  /* the click's own BPM for a meter: a quarter's — or in 6/8 a dotted quarter's, 2/3 of it (the eighths move as
     fast as in 4/4 at the same pace) */
  RR.beatTempo = (s, id, time) => Math.round(RR.paceTempo(s, id) * 4 / RR.meter(time).beatTicks);

  RR.Points = { PACES, paceOf, reading, rhythm, free, countIn, follower, starsFor };
})();

/* ==========================================================================
   Melody Reader — points.js
   --------------------------------------------------------------------------
   RR.Points — what a melody is worth: 1 to 20 (Melody Reader Design/
   POINTS-AND-COUNT-IN.md). Pure functions, so the tests page can try them.

     tier 1   the notes: first try 1, second try ½ → max(1, ⌊8 × credit ÷ n⌋)
     tier 2   every note first time, in the player's own steady beat → 9–12
              (8 when the spacing isn't the music's)
     tier 3   a Test with the metronome, every note right and in time:
              Slow 13–15 · Moderate 16–18 · Fast 19–20

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

  /* Count me in: judge[i] is Perfect · Good · Early · Late · Missed for each
     note; wrong = the wrong bars struck in the run */
  function countIn(o) {
    const n = o.judge.length, pace = paceOf(o.pace);
    const count = w => o.judge.filter(j => j === w).length;
    const missed = count('Missed'), off = count('Early') + count('Late'), perfect = count('Perfect');
    const inTime = n - missed - off;
    if (!o.wrong && !missed) {
      if (!off) {
        const p = n ? perfect / n : 1;
        const pts = pace.id === 'fast' ? (p >= 0.6 ? 20 : 19) : p >= 0.8 ? pace.hi : p >= 0.5 ? pace.hi - 1 : pace.lo;
        return { pts, tier: 3, word: pace.id === 'fast' ? 'Fast and on the beat!' : 'On the beat!', detail: pace.name };
      }
      const r = rhythm(o.starts, o.times);
      return { pts: Math.max(9, r.grade), tier: 2, rhythm: r, word: 'Every note!', detail: off + ' a little early or late' };
    }
    const credit = Math.max(0, inTime + 0.5 * off - 0.5 * (o.wrong || 0));
    return {
      pts: Math.max(1, Math.floor(8 * credit / Math.max(1, n) + 1e-9)), tier: 1, word: 'Keep at it!',
      detail: inTime + ' of ' + n + ' in time' + (o.wrong ? ' · ' + o.wrong + (o.wrong === 1 ? ' wrong bar' : ' wrong bars') : '')
    };
  }

  const starsFor = pts => pts >= 13 ? 3 : pts >= 8 ? 2 : pts >= 1 ? 1 : 0;

  /* a practice's tempo for a pace (Slow · Moderate · Fast) */
  RR.paceTempo = (s, id) => {
    const t = s && Array.isArray(s.tempos) ? s.tempos : [60, 80, 100];
    return t[Math.max(0, PACES.findIndex(p => p.id === id))] || 80;
  };

  RR.Points = { PACES, paceOf, reading, rhythm, free, countIn, starsFor };
})();

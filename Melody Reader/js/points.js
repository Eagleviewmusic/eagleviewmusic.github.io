/* ==========================================================================
   Melody Reader — points.js
   --------------------------------------------------------------------------
   RR.Points — what a melody is worth: 1 to 20 (Melody Reader Design/
   POINTS-AND-COUNT-IN.md). Pure functions, so the tests page can try them.

     tier 1   the notes: first try 1, second try ½ → max(1, ⌊8 × credit ÷ n⌋)
     tier 2   every note first time, in the player's own steady beat → 9–12
              (8 when the spacing isn't the music's)
     tier 3   a Test with the metronome, every note right first time, at
              (basically) the metronome's tempo: Slow 13–15 · Moderate
              16–18 · Fast 19–20. Where the player came in doesn't matter
              — on beat 3, between clicks — only that their beat is the
              metronome's; too fast or too slow (or not steady) is scored
              as on your own: 9–12 (2026-10-12)

   tempoCheck() the player's tempo, from the spacing of their notes, against
              the metronome's (2026-10-12; it replaced the follower, which
              matched each strike to the click it fell nearest)

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

  /* With the metronome (2026-10-12, the user's: "it wants the user to play exactly at the correct moment in the
     metronome — so if it's on beat three and you're on beat one, it will consider what you're playing as on
     beat three … I just want it to click and to light the notes up in order … if the user played the melody at
     basically the correct tempo — even if they started on beat 3 instead of beat 1 — count that as correct").
     The notes are followed in order, as on your own (game.js); the click is the tempo to keep. What is judged
     is the player's own beat — the least-squares line through their notes (tier 2's) — against the
     metronome's: within TEMPO_OK of it and steady (tier 2's 9 or better) is with the metronome. When they
     started is never asked. `tempo` is the metronome's in quarter notes a minute (RR.paceTempo). */
  const TEMPO_OK = 0.15;
  function tempoCheck(starts, times, tempo) {
    const r = rhythm(starts, times);
    const ratio = r.bpm ? r.bpm / tempo : 1;                    // fewer than three notes: nothing to judge — with it
    return { rhythm: r, ratio, ok: r.grade >= 9 && Math.abs(ratio - 1) <= TEMPO_OK };
  }
  /* a Test with the metronome: o = { starts, times, tries, pace, tempo }
       a wrong bar on the way                          → the notes: first try 1, second ½ (tier 1)
       every note first time, at the metronome's tempo → tier 3 by the pace: the top for steady and close
                                                         (≤ 0.06 beat, within 4%), one under for ≤ 0.10, 6%
       every note first time, faster or slower         → as on your own: 9–12 (8 when the spacing isn't the music's) */
  function countIn(o) {
    const n = o.tries.length, pace = paceOf(o.pace);
    if (o.tries.some(t => t > 0)) {
      const right = o.tries.filter(t => t === 0).length, wrong = o.tries.reduce((a, t) => a + t, 0);
      return { pts: reading(o.tries), tier: 1, word: 'Keep at it!', detail: right + ' of ' + n + ' first time · ' + wrong + (wrong === 1 ? ' wrong bar' : ' wrong bars') };
    }
    const m = tempoCheck(o.starts, o.times, o.tempo || 80);
    if (m.ok) {
      const d = Math.abs(m.ratio - 1), e = m.rhythm.err;
      const top = e <= 0.06 && d <= 0.04, near = e <= 0.10 && d <= 0.06;
      const pts = pace.id === 'fast' ? (near ? 20 : 19) : top ? pace.hi : near ? pace.hi - 1 : pace.lo;
      return { pts, tier: 3, rhythm: m.rhythm, ratio: m.ratio, word: pace.id === 'fast' ? 'Fast, with the metronome!' : 'With the metronome!', detail: pace.name };
    }
    const g = m.rhythm.grade;
    return { pts: g, tier: g >= 9 ? 2 : 1, rhythm: m.rhythm, ratio: m.ratio, word: 'Every note!',
      detail: g < 9 ? 'not quite a steady beat' : m.ratio < 1 ? 'a little slower than the metronome' : 'a little faster than the metronome' };
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

  RR.Points = { PACES, paceOf, reading, rhythm, free, countIn, tempoCheck, TEMPO_OK, starsFor };
})();

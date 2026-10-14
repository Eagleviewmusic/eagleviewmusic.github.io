/* ==========================================================================
   Melody Reader — points.js
   --------------------------------------------------------------------------
   RR.Points — what a melody is worth: 1 to 20 (Melody Reader Design/
   POINTS-AND-COUNT-IN.md, and since 2026-10-13 the user's new rule:
   "if they play the rhythms mostly correct — whether with the metronome
   or not — give them the points they would have gotten if played with the
   metronome"). Pure functions, so the tests page can try them.

     every note first time, in rhythm     by the player's own tempo:
                                          about 100 BPM or faster → 20 at
                                          the top · 70–100 → 17 · under 70
                                          → 15 (one under for a looser
                                          rhythm, two under for looser still)
     in rhythm, a wrong bar or two        the same, 2 points off for each
                                          wrong bar ("take off only 2 points
                                          for a wrong note but correct
                                          rhythms") — never under the notes'
                                          score below
     the rhythm not right                 the notes, as before: first try 1,
                                          second ½ → max(1, ⌊8 × credit ÷ n⌋)
                                          — every note first time is 8

   The rhythm is the player's own: a least-squares line through when each
   note was played (rhythm(); the time of a note with a slip is the first
   bar struck for it — the moment it was played, right or wrong). With the
   metronome on, the tempo is the player's too — but within 6% of the
   metronome counts as the metronome's when that is faster (playing along
   at 100 is "around 100" even if the line says 96).

   tempoCheck() the player's tempo against the metronome's — Practice's gold
              star (teach.js), which is still "with the metronome"

   RR.TEMPO — the metronome's dial (2026-10-13, the user's: "a dial from
   easy to hard, going from 56 to 132 bpm … the default 72"): the marks of
   a classic metronome. A quarter note's BPM, whatever the meter.

   Times are seconds, starts are the notes' written starts in ticks
   (sixteenths). Stars: ★ 1–7 · ★★ 8–12 · ★★★ 13–20.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;

  /* the dial: Easy (slow) → Hard (fast), on a classic (Maelzel) metronome's marks */
  const MARKS = [56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 126, 132];
  RR.TEMPO = { MIN: MARKS[0], MAX: MARKS[MARKS.length - 1], DEFAULT: 72, MARKS };
  /* the mark nearest a tempo (and its place on the dial) */
  RR.tempoIndex = v => { let best = 0; MARKS.forEach((m, i) => { if (Math.abs(m - v) < Math.abs(MARKS[best] - v)) best = i; }); return best; };
  RR.snapTempo = v => MARKS[RR.tempoIndex(typeof v === 'number' && isFinite(v) ? v : RR.TEMPO.DEFAULT)];
  /* the click's own BPM for a meter: a quarter's — or in 6/8 a dotted quarter's, 2/3 of it (the eighths move as
     fast as in 4/4 at the same tempo) */
  RR.beatTempo = (tempo, time) => Math.round(tempo * 4 / RR.meter(time).beatTicks);

  /* the tempos the points go by (the user's): "around 100 or faster" · "between 70–100" · "less than 70" */
  const PACES = [
    { id: 'slow', name: 'Slow', top: 15, words: 'under 70 BPM' },
    { id: 'moderate', name: 'Moderate', top: 17, words: '70–99 BPM' },
    { id: 'fast', name: 'Fast', top: 20, words: '100 BPM and up' }
  ];
  const FAST_FROM = 98, MODERATE_FROM = 70;
  const paceOf = id => PACES.find(p => p.id === id) || PACES[0];
  /* the pace of a tempo (rounded: 69.6 plays as 70) */
  const paceAt = bpm => { const b = Math.round(bpm || 0); return b >= FAST_FROM ? PACES[2] : b >= MODERATE_FROM ? PACES[1] : PACES[0]; };

  /* the notes: tries[i] = the slips on note i before it was found */
  function reading(tries) {
    const n = tries.length; if (!n) return 8;
    const credit = tries.reduce((a, t) => a + (t === 0 ? 1 : t === 1 ? 0.5 : 0), 0);
    return Math.max(1, Math.floor(8 * credit / n + 1e-9));
  }

  /* the rhythm: how well the strike times keep the written spacing, at the player's own tempo. A least-squares
     line, time = a + b × start; what is left over (RMS), in beats, is the error. grade: 12 ≤ .06 · 11 ≤ .10 ·
     10 ≤ .15 · 9 ≤ .21 · else 8 (and under 30 BPM: finding, not a beat) — 9 and up is "in rhythm" */
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
    // three to five notes leave the line little to fit (it bends to them): what is left over counts for more —
    // ×1.41 for three, ×1.15 for four; six and up as they always were (2026-10-13: three quarters played
    // short-long were "in rhythm", and in rhythm is now worth up to 20)
    const few = n < 6 ? Math.sqrt(2 * n / (3 * (n - 2))) : 1;
    const err = Math.sqrt(ss / n) / beat * few;
    const grade = bpm < 30 ? 8 : err <= 0.06 ? 12 : err <= 0.10 ? 11 : err <= 0.15 ? 10 : err <= 0.21 ? 9 : 8;
    return { grade, err, bpm };
  }

  /* a Test played (2026-10-13), with the metronome or not: o = { starts, times, tries, metro }
       times   when each note was played — a note with a slip: the first bar struck for it
       metro   the metronome's tempo when it was on (else nothing) */
  const METRO_NEAR = 0.06;
  function score(o) {
    const tries = o.tries, n = tries.length;
    const wrong = tries.reduce((a, t) => a + t, 0), right = tries.filter(t => t === 0).length;
    const r = rhythm(o.starts, o.times);
    // two notes: no rhythm to judge, but their spacing is a tempo
    let bpm = r.bpm;
    if (bpm == null && n === 2 && o.times[1] > o.times[0] && o.starts[1] > o.starts[0]) bpm = 15 * (o.starts[1] - o.starts[0]) / (o.times[1] - o.times[0]);
    const inRhythm = r.grade >= 9 && !(bpm != null && bpm < 30);
    const notes = reading(tries), bars = wrong + (wrong === 1 ? ' wrong bar' : ' wrong bars');
    if (!inRhythm) {
      return wrong ? { pts: notes, tier: 1, rhythm: r, bpm, pace: null, word: 'Found them all!', detail: right + ' of ' + n + ' first time · ' + bars }
        : { pts: notes, tier: 1, rhythm: r, bpm, pace: null, word: 'Every note!', detail: 'the rhythm wasn’t steady yet' };
    }
    // the tempo the points go by: the player's — or the metronome's, when they were with it and it is faster
    let tempo = bpm;
    if (o.metro && (tempo == null || Math.abs(tempo / o.metro - 1) <= METRO_NEAR)) tempo = Math.max(tempo || 0, o.metro);
    const pace = paceAt(tempo);
    const best = pace.top - (r.err <= 0.06 ? 0 : r.err <= 0.10 ? 1 : 2);
    const about = tempo ? ' · about ' + Math.round(tempo) + ' BPM' : '';
    if (!wrong) return { pts: best, tier: 3, rhythm: r, bpm, tempo, pace: pace.id, word: 'Every note, in rhythm!', detail: pace.name + about };
    const pts = best - 2 * wrong;
    if (pts < notes) return { pts: notes, tier: 1, rhythm: r, bpm, tempo, pace: pace.id, word: 'Found them all!', detail: right + ' of ' + n + ' first time · ' + bars };
    return { pts: Math.max(1, pts), tier: 2, rhythm: r, bpm, tempo, pace: pace.id, word: 'Good rhythm!', detail: bars + ', 2 points off each · ' + pace.name + about };
  }

  /* Practice's gold star (teach.js): the player's tempo, from the spacing of their notes, against the
     metronome's — within TEMPO_OK of it and steady (the rhythm's 9 or better). When they started is never asked
     (2026-10-12, the user's: "even if they started on beat 3 instead of beat 1 — count that as correct") */
  const TEMPO_OK = 0.15;
  function tempoCheck(starts, times, tempo) {
    const r = rhythm(starts, times);
    const ratio = r.bpm ? r.bpm / tempo : 1;                    // fewer than three notes: nothing to judge — with it
    return { rhythm: r, ratio, ok: r.grade >= 9 && Math.abs(ratio - 1) <= TEMPO_OK };
  }

  const starsFor = pts => pts >= 13 ? 3 : pts >= 8 ? 2 : pts >= 1 ? 1 : 0;

  RR.Points = { PACES, paceOf, paceAt, FAST_FROM, MODERATE_FROM, METRO_NEAR, reading, rhythm, score, tempoCheck, TEMPO_OK, starsFor };
})();

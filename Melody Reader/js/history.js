/* ==========================================================================
   Melody Reader — history.js
   --------------------------------------------------------------------------
   RR.History — what each player has played, day by day, for My stats
   (2026-10-07). Kept inside the player's scores (rainbow_reader_scores_v1),
   beside the best rounds, tricky notes and totals that were there already:

     days     { 'YYYY-MM-DD': a day — m melodies, p points, g gold stars,
              k checks (played through), n notes read, f of them first
              time, s seconds playing, r rounds finished, t [tier 1, 2, 3]
              melodies, pc [Slow, Moderate, Fast] Tests with the
              metronome and pk of those in time all through (tier 3), nt
              { C4: [read, first time] } }
     log      the last 200 melodies: { at, p, t, g, k, pc }
     games    the last 60 rounds, Songs and Beat the clocks finished
     rec      records: the best round, Beat the clock (per length), the
              longest Endless run, the longest streak
     since    the day history began (points, gold stars and time count
              from then; melodies and notes were counted before)

   A melody counts once, as in the round: tried again, the new try
   replaces the old one here too (unmelody). Practice never counts.
   Battles are the teams', not the player's: game.js leaves them out.
   The functions taking `me` are pure, for the tests page; the short ones
   (melody, note, game …) work on the player playing and save.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const LOG_MAX = 200, GAMES_MAX = 60;
  const PACE_I = { slow: 0, moderate: 1, fast: 2 };

  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const today = () => dayKey(new Date());
  const parseDay = k => new Date(k + 'T12:00:00');
  const addDays = (k, n) => { const d = parseDay(k); d.setDate(d.getDate() + n); return dayKey(d); };
  const isDay = k => /^\d{4}-\d{2}-\d{2}$/.test(k) && !isNaN(parseDay(k));
  /* the Monday of a day's week */
  const weekOf = k => { const d = parseDay(k); return addDays(k, -((d.getDay() + 6) % 7)); };
  const num = v => (typeof v === 'number' && isFinite(v) ? v : 0);

  /* a player's record, made ready for history (old files simply lack it) */
  function ready(me) {
    if (!me.days || typeof me.days !== 'object' || Array.isArray(me.days)) me.days = {};
    if (!Array.isArray(me.log)) me.log = [];
    if (!Array.isArray(me.games)) me.games = [];
    if (!me.rec || typeof me.rec !== 'object' || Array.isArray(me.rec)) me.rec = {};
    if (!me.totals || typeof me.totals !== 'object') me.totals = {};
    ['melodies', 'notes', 'first', 'points', 'gold', 'made', 'rounds', 'secs'].forEach(k => { me.totals[k] = num(me.totals[k]); });
    if (!isDay(me.since)) me.since = today();
    return me;
  }
  /* one day's bucket, made safe */
  function dayOf(me, k) {
    const d = me.days[k] = me.days[k] && typeof me.days[k] === 'object' ? me.days[k] : {};
    ['m', 'p', 'g', 'k', 'n', 'f', 's', 'r'].forEach(x => { d[x] = num(d[x]); });
    ['t', 'pc', 'pk'].forEach(x => { if (!Array.isArray(d[x]) || d[x].length !== 3) d[x] = [0, 0, 0]; else d[x] = d[x].map(num); });
    if (!d.nt || typeof d.nt !== 'object' || Array.isArray(d.nt)) d.nt = {};
    return d;
  }

  /* ---------------- recording (pure: `me` is a player's record) ---------------- */
  /* a melody finished in a Test: o = { pts (1–20, before Points off), tier 1–3, gold, made, pace } —
     returns its handle, kept on the round's entry so a try again can take it back */
  function addMelody(me, o, at) {
    ready(me);
    at = at || Date.now();
    const k = dayKey(new Date(at)), d = dayOf(me, k);
    const tier = Math.max(1, Math.min(3, o.tier | 0 || 1)), pi = o.pace in PACE_I ? PACE_I[o.pace] : -1;
    const h = { d: k, at, p: Math.max(0, o.pts | 0), t: tier, g: o.gold ? 1 : 0, k: o.made ? 1 : 0, pc: pi };
    d.m++; d.p += h.p; d.g += h.g; d.k += h.k; d.t[tier - 1]++;
    if (pi >= 0) { d.pc[pi]++; if (tier === 3) d.pk[pi]++; }
    me.totals.points += h.p; me.totals.gold += h.g; me.totals.made += h.k;
    me.log.push({ at, p: h.p, t: h.t, g: h.g, k: h.k, pc: pi });
    if (me.log.length > LOG_MAX) me.log.splice(0, me.log.length - LOG_MAX);
    return h;
  }
  /* a melody's try taken back (tried again, or the round started over) */
  function removeMelody(me, h) {
    if (!h || !me.days || !me.days[h.d]) return;
    ready(me);
    const d = dayOf(me, h.d), pi = h.pc;
    d.m = Math.max(0, d.m - 1); d.p = Math.max(0, d.p - h.p); d.g = Math.max(0, d.g - h.g); d.k = Math.max(0, d.k - h.k);
    d.t[h.t - 1] = Math.max(0, d.t[h.t - 1] - 1);
    if (pi >= 0) { d.pc[pi] = Math.max(0, d.pc[pi] - 1); if (h.t === 3) d.pk[pi] = Math.max(0, d.pk[pi] - 1); }
    me.totals.points = Math.max(0, me.totals.points - h.p); me.totals.gold = Math.max(0, me.totals.gold - h.g); me.totals.made = Math.max(0, me.totals.made - h.k);
    const i = me.log.findIndex(x => x.at === h.at);
    if (i >= 0) me.log.splice(i, 1);
  }
  /* a note read in a Test (first = no slip before it) */
  function addNote(me, id, first, at) {
    ready(me);
    const d = dayOf(me, dayKey(new Date(at || Date.now())));
    d.n++; if (first) d.f++;
    const x = d.nt[id] = Array.isArray(d.nt[id]) ? d.nt[id] : [0, 0];
    x[0]++; if (first) x[1]++;
  }
  function addTime(me, secs, at) {
    ready(me);
    const d = dayOf(me, dayKey(new Date(at || Date.now())));
    d.s += secs; me.totals.secs += secs;
  }
  /* a round, a Song or a Beat the clock finished: g = { game, key, label, pts, n (melodies), gold, clean, notes, secs } */
  function addGame(me, g, at) {
    ready(me);
    at = at || Date.now();
    const k = dayKey(new Date(at)), d = dayOf(me, k);
    const rec = { at, d: k, game: String(g.game || ''), label: String(g.label || '').slice(0, 80), pts: g.pts | 0, n: g.n | 0, gold: g.gold | 0, clean: g.clean | 0 };
    if (g.game === 'clock') { rec.secs = g.secs | 0; rec.notes = g.notes | 0; }
    d.r++; me.totals.rounds++;
    me.games.push(rec);
    if (me.games.length > GAMES_MAX) me.games.splice(0, me.games.length - GAMES_MAX);
    const R = me.rec;
    if (RR.roundLen && RR.roundLen(rec.game) && (!R.round || rec.pts > R.round.pts)) R.round = { pts: rec.pts, n: rec.n, gold: rec.gold, label: rec.label, d: k };
    if (rec.game === 'clock') {
      R.clock = R.clock && typeof R.clock === 'object' ? R.clock : {};
      const c = R.clock[rec.secs];
      if (!c || rec.notes > c.notes || (rec.notes === c.notes && rec.pts > c.pts)) R.clock[rec.secs] = { notes: rec.notes, pts: rec.pts, n: rec.n, d: k };
    }
    return rec;
  }
  /* an Endless run, as it ends (or is left): the longest is kept */
  function addEndless(me, run, at) {
    ready(me);
    const R = me.rec, k = dayKey(new Date(at || Date.now()));
    if (!R.endless || run.n > R.endless.n || (run.n === R.endless.n && run.pts > R.endless.pts)) R.endless = { n: run.n | 0, pts: run.pts | 0, gold: run.gold | 0, d: k };
  }
  function addStreak(me, n) { ready(me); if ((n | 0) > num(me.rec.streak)) me.rec.streak = n | 0; }

  /* ---------------- reading it back (pure) ---------------- */
  const active = d => d && (d.m > 0 || d.n > 0 || d.s >= 60);
  /* days in a row with some playing: now (ending today or yesterday) and the longest ever */
  function dayStreak(days, now) {
    now = now || today();
    const keys = Object.keys(days || {}).filter(k => isDay(k) && active(days[k])).sort();
    let best = 0, run = 0, prev = null;
    keys.forEach(k => { run = prev && addDays(prev, 1) === k ? run + 1 : 1; best = Math.max(best, run); prev = k; });
    let cur = 0, k = days && active(days[now]) ? now : addDays(now, -1);
    while (days && active(days[k])) { cur++; k = addDays(k, -1); }
    return { current: cur, best };
  }
  const EMPTY = () => ({ m: 0, p: 0, g: 0, k: 0, n: 0, f: 0, s: 0, r: 0, t: [0, 0, 0], pc: [0, 0, 0], pk: [0, 0, 0], nt: {} });
  function addInto(a, d) {
    if (!d) return a;
    ['m', 'p', 'g', 'k', 'n', 'f', 's', 'r'].forEach(x => { a[x] += num(d[x]); });
    ['t', 'pc', 'pk'].forEach(x => { for (let i = 0; i < 3; i++) a[x][i] += Array.isArray(d[x]) ? num(d[x][i]) : 0; });
    if (d.nt && typeof d.nt === 'object') Object.keys(d.nt).forEach(id => {
      const v = d.nt[id]; if (!Array.isArray(v)) return;
      const x = a.nt[id] = a.nt[id] || [0, 0]; x[0] += num(v[0]); x[1] += num(v[1]);
    });
    return a;
  }
  /* the buckets a range is drawn as, oldest first:
       '7d' 7 days · '30d' 30 days · '12w' 12 weeks · 'all' days (to 60), weeks (to 2 years) or months
     each { key, from, to, unit: 'day' | 'week' | 'month', …the day's sums } */
  function series(days, range, now) {
    now = now || today();
    days = days || {};
    const keys = Object.keys(days).filter(isDay).sort();
    let unit = 'day', count;
    if (range === '7d') count = 7;
    else if (range === '30d') count = 30;
    else if (range === '12w') { unit = 'week'; count = 12; }
    else {
      const first = keys.length ? keys[0] : now;
      const span = Math.round((parseDay(now) - parseDay(first)) / 864e5) + 1;
      if (span <= 60) count = Math.max(7, span);
      else if (span <= 731) { unit = 'week'; count = Math.ceil(span / 7) + 1; }
      else {
        unit = 'month';
        const a = parseDay(first), b = parseDay(now);
        count = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth() + 1;
      }
    }
    const out = [];
    for (let i = count - 1; i >= 0; i--) {
      let from, to;
      if (unit === 'day') { from = to = addDays(now, -i); }
      else if (unit === 'week') { from = addDays(weekOf(now), -7 * i); to = addDays(from, 6); }
      else { const d = parseDay(now); d.setDate(1); d.setMonth(d.getMonth() - i); from = dayKey(d); d.setMonth(d.getMonth() + 1); d.setDate(0); to = dayKey(d); }
      out.push(Object.assign(EMPTY(), { key: from, from, to, unit }));
    }
    keys.forEach(k => {
      const b = out.find(x => k >= x.from && k <= x.to);
      if (b) addInto(b, days[k]);
    });
    return out;
  }
  /* the sums of some buckets, or of every day from `from` to `to` */
  const total = buckets => buckets.reduce((a, b) => addInto(a, b), EMPTY());
  function between(days, from, to) {
    const a = EMPTY();
    Object.keys(days || {}).forEach(k => { if (isDay(k) && k >= from && k <= to) addInto(a, days[k]); });
    return a;
  }

  /* ---------------- the player playing ---------------- */
  const me = () => ready(RR.Scores.me());
  const save = () => RR.Scores.save();
  const H = RR.History = {
    ready, dayOf, addMelody, removeMelody, addNote, addTime, addGame, addEndless, addStreak,
    dayStreak, series, total, between, EMPTY,
    dayKey, today, addDays, parseDay, weekOf, isDay,
    me,
    melody(o) { const h = addMelody(me(), o); save(); return h; },
    unmelody(h) { removeMelody(me(), h); save(); },
    note(id, first) { addNote(me(), id, first); },            // saved with the melody
    game(g) { const r = addGame(me(), g); save(); return r; },
    endless(run) { if (run && run.n > 0) { addEndless(me(), run); save(); } },
    streak(n) { addStreak(me(), n); }
  };

  /* ---------------- time playing ----------------
     Counted in 5-second steps while the music is on screen, the page is
     visible and someone has touched or played in the last minute — not
     while a melody is being written or a battle is on. */
  let lastAct = 0, unsaved = 0;
  const touch = () => { lastAct = Date.now(); };
  document.addEventListener('pointerdown', touch, { capture: true, passive: true });
  document.addEventListener('keydown', touch, { capture: true });
  setInterval(() => {
    const G = RR.Game;
    if (!G || !RR.Scores || !RR.View || RR.View.current !== 'play') return;
    if (document.visibilityState !== 'visible' || Date.now() - lastAct > 60000) return;
    if (G.battle || (RR.Maker && RR.Maker.active)) return;
    addTime(me(), 5);
    if (++unsaved >= 6) { unsaved = 0; save(); }
  }, 5000);
  window.addEventListener('pagehide', () => { if (unsaved && RR.Scores) save(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && unsaved && RR.Scores) { unsaved = 0; save(); } });
  H.touch = touch;
})();

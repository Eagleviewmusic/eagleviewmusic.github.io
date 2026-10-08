/* ==========================================================================
   Melody Reader — stats.js
   --------------------------------------------------------------------------
   RR.Stats — the My stats page (2026-10-07), a view of its own (home.js),
   for the player playing (the names at the top switch). From the top:

     the totals      points, melodies, gold stars, notes read, first try,
                     time playing, days in a row
     Over time       one choice of range above it all — 7 days · 30 days ·
                     12 weeks · All time — and under it:
                       Activity            points, melodies or minutes, a column a day (or week)
                       First try           how many notes were right first time, as a line
                       How melodies scored the three kinds of score, one bar
                       Note by note        each bar's first-try share, and the change
                       The metronome       Tests at Slow · Moderate · Fast, and how many in time
     Recent          the last 50 melodies (columns by kind of score, the
                     average of the last ten as a line) · the calendar
     All time        the ladder's stars · records · mix-ups · the last games

   Every chart has a Table button: the same numbers as a table (for a
   screen reader, a keyboard, or a printout). With Points off nothing shows
   a number of points; with Gold stars off, no gold stars.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game, esc = RR.esc;
  const H = () => RR.History, C = () => RR.Charts;

  const RANGES = [['7d', '7 days'], ['30d', '30 days'], ['12w', '12 weeks'], ['all', 'All time']];
  let range = '30d', metric = null;          // metric: 'p' points · 'm' melodies · 's' minutes
  const tables = {};                          // chart id → showing its table
  let charts = [];                            // [{ id, draw(w) → svg }] filled after the page is laid out

  const plural = (n, one, many) => n.toLocaleString() + ' ' + (n === 1 ? one : (many || one + 's'));
  const pct = (a, b) => b ? Math.round(100 * a / b) : null;
  function timeWords(secs) {
    const m = Math.round(secs / 60);
    return secs < 30 ? '0 min' : m < 1 ? '< 1 min' : m < 60 ? m + ' min' : Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '');
  }
  function dateWords(k, long) {
    const d = H().parseDay(k);
    return d.toLocaleDateString(undefined, long ? { weekday: 'short', day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short' });
  }
  /* a bucket's name: under its column, and in full */
  function bucketX(b, n) {
    const d = H().parseDay(b.key);
    if (b.unit === 'month') return d.toLocaleDateString(undefined, { month: 'short' });
    if (b.unit === 'week') return dateWords(b.key);
    return n <= 7 ? d.toLocaleDateString(undefined, { weekday: 'short' }) : dateWords(b.key);
  }
  function bucketName(b) {
    if (b.unit === 'month') return H().parseDay(b.key).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    if (b.unit === 'week') return 'Week of ' + dateWords(b.key);
    return b.key === H().today() ? 'Today' : dateWords(b.key, true);
  }
  const TIER_NAMES = () => [
    ['Found the notes', RR.device.points ? '1–8 points' : 'every note, with slips'],
    ['In your own steady beat', RR.device.points ? '9–12 points' : 'every note first time'],
    ['With the metronome', RR.device.points ? '13–20 points' : 'every note in time']
  ];
  const PACE_NAMES = ['Slow', 'Moderate', 'Fast'];

  /* ---------------- pieces ---------------- */
  function cardHtml(id, title, sub, body, o) {
    o = o || {};
    return '<section class="st-card' + (o.wide ? ' wide' : '') + '" aria-labelledby="st-' + id + '"><div class="st-card-head"><h3 id="st-' + id + '">' + title + '</h3>' +
      (o.tools || '') + (o.table ? '<button type="button" class="st-tbl' + (tables[id] ? ' on' : '') + '" data-s="table" data-id="' + id + '" aria-pressed="' + !!tables[id] + '">Table</button>' : '') + '</div>' +
      (sub ? '<p class="st-sub">' + sub + '</p>' : '') + body + '</section>';
  }
  const empty = text => '<div class="st-empty">' + text + '</div>';
  function tableHtml(head, rows) {
    return '<div class="st-table-wrap"><table class="st-table"><thead><tr>' + head.map(h => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
      rows.map(r => '<tr>' + r.map((c, i) => (i ? '<td>' : '<th scope="row">') + esc(c) + (i ? '</td>' : '</th>')).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  /* a chart's place: its SVG drawn once the page knows how wide it is — or, asked for, its table */
  function chartSlot(id, label, draw, table, h) {
    if (tables[id] && table) return tableHtml(table[0], table[1]);
    charts.push({ id, draw });
    return '<div class="chart" data-chart="' + id + '" role="img" aria-label="' + esc(label) + '" style="min-height:' + (h || 190) + 'px"></div>';
  }
  const seg = (k, opts, cur) => '<div class="seg" role="group">' + opts.map(o =>
    '<button type="button" data-s="' + k + '" data-v="' + o[0] + '" class="' + (cur === o[0] ? 'on' : '') + '" aria-pressed="' + (cur === o[0]) + '">' + o[1] + '</button>').join('') + '</div>';

  /* ---------------- the page ---------------- */
  function html() {
    const h = H(), me = h.me(), tot = me.totals, pts = RR.device.points, stars = RR.device.stars;
    const streak = h.dayStreak(me.days);
    charts = [];
    if (!pts && metric === 'p') metric = null;
    if (!metric) metric = pts ? 'p' : 'm';
    const who = RR.Players.current();
    const nothing = !me.log.length && !Object.keys(me.days).length && !tot.melodies;

    // the totals
    const tile = (v, l, cls) => '<div class="st-tile' + (cls ? ' ' + cls : '') + '"><b>' + v + '</b><span>' + l + '</span></div>';
    let out = '<div class="st-wrap"><div class="st-top"><h2 tabindex="-1">My stats' + (who ? ' · ' + esc(who) : '') + '</h2>' +
      (RR.Players.list().length ? '<div class="st-players"><span class="h-lab">Who’s playing?</span>' + RR.Players.chipsHtml(false) + '</div>' : '') + '</div>';
    if (nothing) out += '<div class="st-welcome"><b>Your stats fill in as you play.</b> Play a round of melodies, then come back here to see your points, your best notes and how you’re getting on.</div>';
    out += '<div class="st-tiles">' +
      (pts ? tile(tot.points.toLocaleString(), 'points earned') : '') +
      tile(tot.melodies.toLocaleString(), 'melodies read') +
      (stars ? tile('<span class="t-star">★</span> ' + tot.gold.toLocaleString(), 'gold stars') : '') +
      tile(tot.notes.toLocaleString(), 'notes read') +
      tile(tot.notes ? pct(tot.first, tot.notes) + '%' : '–', 'right first time') +
      tile(timeWords(tot.secs), 'time playing') +
      tile(tot.rounds.toLocaleString(), 'rounds finished') +
      tile('<span class="t-fire">🔥</span> ' + streak.current, (streak.current === 1 ? 'day' : 'days') + ' in a row · best ' + streak.best) + '</div>' +
      RR.note('st-since', 'Points, gold stars and time playing are counted from ' + dateWords(me.since) + ', when Melody Reader began keeping them; melodies and notes from the start. Battles count for the teams, not here.');

    // ---- Over time ----
    const B = h.series(me.days, range), sum = h.total(B), n = B.length;
    const rangeName = RANGES.find(r => r[0] === range)[1];
    out += '<div class="st-section"><h2>Over time</h2><div class="st-filter"><span class="h-lab">Show</span>' + seg('range', RANGES, range) + '</div></div><div class="st-grid">';

    // Activity
    const mv = b => metric === 'p' ? b.p : metric === 'm' ? b.m : Math.round(b.s / 60);
    const unit = metric === 'p' ? ['point', 'points'] : metric === 'm' ? ['melody', 'melodies'] : ['minute', 'minutes'];
    const best = B.reduce((a, b) => (mv(b) > (a ? mv(a) : 0) ? b : a), null);
    const actSub = (metric === 'p' ? plural(sum.p, 'point') : metric === 'm' ? plural(sum.m, 'melody', 'melodies') : timeWords(sum.s) + ' playing') +
      (range === 'all' ? ' in all' : ' in the last ' + rangeName) + (best ? ' · best ' + bucketName(best).replace(/^Week of/, 'the week of').replace(/^Today$/, 'today') + ': ' + plural(mv(best), unit[0], unit[1]) : '');
    const actData = B.map(b => ({ v: mv(b), x: bucketX(b, n), tv: plural(mv(b), unit[0], unit[1]),
      tl: bucketName(b) + (metric !== 'm' ? ' · ' + plural(b.m, 'melody', 'melodies') : '') + (metric !== 's' && b.s >= 30 ? ' · ' + timeWords(b.s) : '') }));
    out += cardHtml('activity', 'Activity', actSub,
      sum.m || sum.s ? chartSlot('activity', 'Activity: ' + actSub, w => C().bars(w, actData, { h: 200 }),
        [['When', unit[1][0].toUpperCase() + unit[1].slice(1), 'Melodies', 'Time'], B.map(b => [bucketName(b), String(mv(b)), String(b.m), timeWords(b.s)])], 200)
        : empty('Nothing played in the last ' + rangeName + ' yet.'),
      { wide: true, table: true, tools: seg('metric', (pts ? [['p', 'Points']] : []).concat([['m', 'Melodies'], ['s', 'Minutes']]), metric) });

    // First try
    const accPts = B.map(b => ({ v: b.n >= 3 ? 100 * b.f / b.n : null, x: bucketX(b, n), tv: b.n ? pct(b.f, b.n) + '% first time' : '', tl: bucketName(b) + ' · ' + plural(b.n, 'note') }));
    const accAll = pct(sum.f, sum.n);
    out += cardHtml('accuracy', 'Right first time', sum.n ? accAll + '% of ' + plural(sum.n, 'note') + ' in a Test were right first time' : '',
      accPts.some(p => p.v != null) ? chartSlot('accuracy', 'Right first time, ' + rangeName + ': ' + accAll + '%', w => C().line(w, accPts),
        [['When', 'Notes', 'First time', '%'], B.filter(b => b.n).map(b => [bucketName(b), String(b.n), String(b.f), pct(b.f, b.n) + '%'])])
        : empty('Read a few notes in a Test and this line starts.'), { table: true, wide: !pts });

    // Average score: points a melody, as a line (the volume can't hide whether they're getting better)
    if (pts) {
      const avgPts = B.map(b => ({ v: b.m ? b.p / b.m : null, x: bucketX(b, n), tv: b.m ? (b.p / b.m).toFixed(1) + ' points a melody' : '', tl: bucketName(b) + ' · ' + plural(b.m, 'melody', 'melodies') }));
      const avgAll = sum.m ? sum.p / sum.m : 0;
      out += cardHtml('avg', 'Average score', sum.m ? '<b>' + avgAll.toFixed(1) + '</b> points a melody, out of 20' : '',
        sum.m ? chartSlot('avg', 'Average points a melody, ' + rangeName + ': ' + avgAll.toFixed(1), w => C().line(w, avgPts, { max: 20, ticks: [0, 5, 10, 15, 20], suffix: '', color: C().COL.bar }),
          [['When', 'Melodies', 'Points', 'A melody'], B.filter(b => b.m).map(b => [bucketName(b), String(b.m), String(b.p), (b.p / b.m).toFixed(1)])])
          : empty('Finish a melody in a Test and this line starts.'), { table: !!sum.m });
    }

    // Note by note
    out += cardHtml('notes', 'Note by note', 'How often each note was right first time' + (range === 'all' ? ' — every note you’ve read' : ' · ▲▼ against the ' + rangeName + ' before'),
      notesHtml(me, B), { wide: true, table: true });

    // How melodies scored
    const tn = TIER_NAMES(), tc = C().TIERS, tsum = sum.t[0] + sum.t[1] + sum.t[2];
    const segs = sum.t.map((v, i) => ({ v, name: tn[i][0], c: tc[i], text: C().TIER_TEXT[i] }));
    out += cardHtml('tiers', 'How your melodies scored', tsum ? plural(tsum, 'melody', 'melodies') + ' in a Test' : '',
      tsum ? (tables.tiers ? tableHtml(['Kind of score', 'Melodies', '%'], segs.map((s, i) => [tn[i][0] + ' (' + tn[i][1] + ')', String(s.v), pct(s.v, tsum) + '%']))
        : (charts.push({ id: 'tiers', draw: w => C().stack(w, segs, { h: 32 }) }), '<div class="chart" data-chart="tiers" role="img" aria-label="' + esc(segs.map(s => s.name + ' ' + s.v).join(', ')) + '" style="min-height:32px"></div>')) +
        '<ul class="st-legend">' + segs.map((s, i) => '<li><i style="background:' + s.c + '"></i><span><b>' + s.name + '</b> · ' + tn[i][1] + '</span><em>' + s.v + '</em></li>').join('') + '</ul>' +
        '<div class="st-minis">' + '<div><span class="mk-i">' + RR.CHECK_SVG + '</span><b>' + sum.k + '</b> played through</div>' +
          (stars ? '<div><span class="mk-i">' + RR.STAR_SVG + '</span><b>' + sum.g + '</b> gold stars</div>' : '') + '</div>'
        : empty('Finish a melody in a Test to see how it scored.'), { table: !!tsum });

    // The metronome
    const paceSum = sum.pc[0] + sum.pc[1] + sum.pc[2], maxPc = Math.max(1, ...sum.pc);
    const tempos = RR.Points.PACES.map(p => RR.paceTempo(G.setup, p.id));
    out += cardHtml('metro', 'With the metronome', paceSum ? plural(paceSum, 'Test') + ' counted in · darker = in time all through' : '',
      paceSum ? (tables.metro ? tableHtml(['Tempo', 'Tests', 'In time all through'], PACE_NAMES.map((p, i) => [p + ' (' + tempos[i] + ' BPM)', String(sum.pc[i]), String(sum.pk[i])]))
        : '<div class="hbars">' + PACE_NAMES.map((p, i) => {
          const all = sum.pc[i], ok = sum.pk[i];
          return '<div class="hbar"><span class="hb-l"><b>' + p + '</b><small>' + tempos[i] + ' BPM</small></span><span class="hb-track">' +
            (ok ? '<i class="hb-ok" style="width:' + (100 * ok / maxPc) + '%" data-tv="' + ok + ' in time" data-tl="' + p + ' · every note in time"></i>' : '') +
            (all - ok ? '<i class="hb-rest" style="width:' + (100 * (all - ok) / maxPc) + '%" data-tv="' + (all - ok) + ' other tries" data-tl="' + p + ' · a note early, late or missed"></i>' : '') +
            '</span><span class="hb-v">' + ok + ' of ' + all + '</span></div>';
        }).join('') + '</div>')
        : empty('Pick a tempo on the metronome, then Test — it counts you in.'), { table: !!paceSum });
    out += '</div>';

    // ---- Recent ----
    out += '<div class="st-section"><h2>Recent</h2></div><div class="st-grid">';
    if (pts) {
      const log = me.log.slice(-50);
      const avg = log.map((_, i) => { const w = log.slice(Math.max(0, i - 9), i + 1); return i < 2 ? null : w.reduce((a, x) => a + x.p, 0) / w.length; });
      const data = log.map((x, i) => ({ v: Math.max(0.4, x.p), c: tc[x.t - 1], x: i === log.length - 1 ? 'latest' : i === 0 ? (log.length === 50 ? '50 ago' : 'first') : '',
        tv: plural(x.p, 'point'), tl: new Date(x.at).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + tn[x.t - 1][0] + (x.g && stars ? ' · ★ gold' : '') }));
      const last10 = log.slice(-10), prev10 = log.slice(-20, -10);
      const a10 = last10.length ? last10.reduce((a, x) => a + x.p, 0) / last10.length : 0, p10 = prev10.length ? prev10.reduce((a, x) => a + x.p, 0) / prev10.length : null;
      out += cardHtml('last', 'Your last ' + (log.length >= 50 ? '50 ' : '') + 'melodies', log.length ? 'Points for each melody · the line is the average of the last ten: <b>' + a10.toFixed(1) + '</b>' +
        (p10 != null ? (a10 > p10 + 0.05 ? ' <span class="up">▲ up from ' + p10.toFixed(1) + '</span>' : a10 < p10 - 0.05 ? ' <span class="down">▼ from ' + p10.toFixed(1) + '</span>' : ' (steady)') : '') : '',
        log.length ? chartSlot('last', 'Points for your last ' + log.length + ' melodies; the average of the last ten is ' + a10.toFixed(1),
          w => C().bars(w, data, { h: 190, max: 20, avg, labelEvery: 1, noPeak: true }),
          [['#', 'When', 'Points', 'Kind of score'], log.map((x, i) => [String(i + 1), new Date(x.at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }), String(x.p), tn[x.t - 1][0]])])
          + '<ul class="st-legend inline">' + tn.map((t, i) => '<li><i style="background:' + tc[i] + '"></i><span>' + t[0] + '</span></li>').join('') + '<li><i class="line"></i><span>average of ten</span></li></ul>'
          : empty('Your melodies will line up here, newest on the right.'), { wide: true, table: !!log.length });
    }
    out += cardHtml('cal', 'Every day you played', calSub(me), calHtml(me), { wide: true, table: true });
    out += '</div>';

    // ---- All time ----
    out += '<div class="st-section"><h2>All time</h2></div><div class="st-grid">' + ladderHtml() + recordsHtml(me) + mixHtml(me) + gamesHtml(me) + bestsHtml(me) + '</div>';
    out += '<div class="st-foot"><button type="button" class="pill-btn" data-s="reset">Reset scores' + (who ? ' for ' + esc(who) : '') + '…</button></div></div>';
    return out;
  }

  /* ---- Note by note: a little xylophone, each bar as tall as its first-try share ---- */
  function notesHtml(me, B) {
    const h = H();
    let now = {}, before = null;
    if (range === 'all') {
      Object.keys(me.stats || {}).forEach(id => { const x = me.stats[id]; if (x && x.n) now[id] = [x.n | 0, x.first | 0]; });
    } else {
      now = h.total(B).nt;
      const from = B[0].from, span = Math.round((h.parseDay(B[B.length - 1].to) - h.parseDay(from)) / 864e5) + 1;
      before = h.between(me.days, h.addDays(from, -span), h.addDays(from, -1)).nt;
    }
    const twelve = Object.keys(now).some(id => RR.BAR[id] && RR.BAR[id].i >= 10);
    const bars = RR.BARS.slice(0, twelve ? 12 : 10);
    if (!Object.keys(now).length) return empty('Read some notes in a Test and each bar shows how often you got it right first time.');
    if (tables.notes) return tableHtml(['Note', 'Read', 'First time', '%'].concat(before ? ['Before'] : []),
      bars.filter(b => now[b.id]).map(b => [b.id, String(now[b.id][0]), String(now[b.id][1]), pct(now[b.id][1], now[b.id][0]) + '%'].concat(before ? [before[b.id] && before[b.id][0] ? pct(before[b.id][1], before[b.id][0]) + '%' : '–'] : [])));
    let worst = null;
    bars.forEach(b => { const x = now[b.id]; if (x && x[0] >= 3 && (!worst || x[1] / x[0] < now[worst][1] / now[worst][0])) worst = b.id; });
    return '<div class="nb-xylo" role="img" aria-label="' + esc(bars.filter(b => now[b.id]).map(b => b.id + ' ' + pct(now[b.id][1], now[b.id][0]) + '%').join(', ')) + '">' + bars.map(b => {
      const x = now[b.id], p = x ? pct(x[1], x[0]) : null;
      const was = before && before[b.id] && before[b.id][0] >= 3 && x && x[0] >= 3 ? pct(before[b.id][1], before[b.id][0]) : null;
      const d = was == null ? '' : p - was >= 3 ? '<em class="up">▲' + (p - was) + '</em>' : was - p >= 3 ? '<em class="down">▼' + (was - p) + '</em>' : '<em>=</em>';
      return '<div class="nb' + (x ? '' : ' none') + (b.id === worst && p < 90 ? ' worst' : '') + '" style="--c:' + b.colour + '"' +
        (x ? ' data-tv="' + p + '% first time" data-tl="' + b.id + ' · read ' + plural(x[0], 'time') + (was != null ? ' · was ' + was + '%' : '') + '"' : '') + '>' +
        '<span class="nb-p">' + (x ? p + '%' : '') + '</span><span class="nb-col"><i style="height:' + (x ? Math.max(4, p) : 4) + '%"></i></span>' +
        '<span class="nb-l">' + b.letter + '<sub>' + b.octave + '</sub></span><span class="nb-n">' + (x ? x[0] : '–') + '</span><span class="nb-d">' + d + '</span></div>';
    }).join('') + '</div>' + (worst && pct(now[worst][1], now[worst][0]) < 90 ? '<p class="st-sub nb-tip">The trickiest: <b class="lpill" style="--c:' + RR.BAR[worst].colour + '">' + worst[0] + '</b> — on the Score board, <i>Practise these</i> makes it come up more.</p>' : '');
  }

  /* ---- the calendar: the last 26 weeks (fewer on a phone) ---- */
  function calCells(me, weeks) {
    const h = H(), t = h.today(), start = h.addDays(h.weekOf(t), -7 * (weeks - 1)), out = [];
    for (let k = start; k <= t; k = h.addDays(k, 1)) {
      const d = me.days[k] || {}, m = d.m | 0, s = d.s | 0;
      out.push({ key: k, today: k === t, v: m || (s >= 60 ? 1 : 0),
        tv: m ? plural(m, 'melody', 'melodies') : s >= 60 ? 'practice' : 'no playing', tl: dateWords(k, true) + (s >= 30 ? ' · ' + timeWords(s) : '') });
    }
    return out;
  }
  function calSub(me) {
    const h = H(), s = h.dayStreak(me.days);
    const played = Object.keys(me.days).filter(k => (me.days[k].m | 0) || (me.days[k].s | 0) >= 60).length;
    return played ? plural(played, 'day') + ' with some reading · ' + s.current + ' in a row now · best run ' + plural(s.best, 'day') : '';
  }
  function calHtml(me) {
    if (tables.cal) {
      const days = Object.keys(me.days).filter(k => H().isDay(k)).sort().reverse().slice(0, 120);
      return days.length ? tableHtml(['Day', 'Melodies', 'Points', 'Time'], days.map(k => [dateWords(k, true), String(me.days[k].m | 0), String(me.days[k].p | 0), timeWords(me.days[k].s | 0)])) : empty('No days yet.');
    }
    charts.push({ id: 'cal', draw: w => {
      const weeks = Math.max(8, Math.min(26, Math.floor((w - 28) / 17)));
      return C().heat(w, calCells(me, weeks)).svg;
    } });
    return '<div class="chart cal" data-chart="cal" role="img" aria-label="A calendar of the days you played; the Table button lists them" style="min-height:135px"></div>' +
      '<div class="cal-key"><span>Less</span>' + C().HEAT.map(c => '<i style="background:' + c + '"></i>').join('') + '<span>More</span><small>melodies in a day: 1 · 3 · 6 · 11+</small></div>';
  }

  /* ---- the ladder ---- */
  function ladderHtml() {
    const got = RR.LEVELS.reduce((a, l) => a + RR.Scores.levelStars(RR.levelKey(l.n)), 0);
    const ses = RR.Sessions.list().filter(x => x.kind !== 'battle');
    return cardHtml('ladder', 'The levels', '<b>★ ' + got + '</b> of ' + RR.LEVELS.length * 3 + ' stars — a round of 5 or more with ★★ or better in 4 of 5 melodies opens the next level',
      '<div class="st-ladder">' + RR.LEVELS.map(l => {
        const st = RR.Scores.levelStars(RR.levelKey(l.n)), b = RR.bandOf(l.n);
        return '<div class="sl" style="--bc:' + b.colour + '" data-tv="' + st + ' of 3 stars" data-tl="Level ' + l.n + ' · ' + esc(l.name) + '"><b class="' + (st ? 'got' : '') + '">' + l.n + '</b><span>' + RR.starsHtml(st, 3) + '</span></div>';
      }).join('') + '</div>' +
      (ses.length ? '<div class="st-ses">' + ses.map(x => '<span class="ses-chip static">♪ ' + esc(x.name) + '<span class="lad-st">' + RR.starsHtml(RR.Scores.levelStars('session:' + x.id), 3) + '</span></span>').join('') + '</div>' : ''),
      { wide: true });
  }

  /* ---- records ---- */
  function recordsHtml(me) {
    const R = me.rec || {}, pts = RR.device.points, rows = [];
    const days = Object.keys(me.days).filter(k => H().isDay(k));
    const bestDay = days.reduce((a, k) => ((me.days[k].m | 0) > (a ? me.days[a].m | 0 : 0) ? k : a), null);
    if (R.round) rows.push(['🏆', 'Best round', pts ? plural(R.round.pts, 'point') : RR.device.stars ? '★ ' + R.round.gold : plural(R.round.n, 'melody', 'melodies'), R.round.label + ' · ' + plural(R.round.n, 'melody', 'melodies') + ' · ' + dateWords(R.round.d)]);
    [30, 60, 120].forEach(s => { const c = R.clock && R.clock[s]; if (c) rows.push(['⏱️', 'Beat the clock, ' + (s === 120 ? '2 min' : s + ' s'), plural(c.notes, 'note'), plural(c.n, 'melody', 'melodies') + ' · ' + dateWords(c.d)]); });
    if (R.endless) rows.push(['∞', 'Longest Endless run', plural(R.endless.n, 'melody', 'melodies'), (pts ? plural(R.endless.pts, 'point') + ' · ' : '') + dateWords(R.endless.d)]);
    if (R.streak) rows.push(['🔥', 'Longest streak', plural(R.streak, 'melody', 'melodies') + ' in a row', 'every note right first time']);
    if (bestDay && me.days[bestDay].m) rows.push(['📅', 'Busiest day', plural(me.days[bestDay].m | 0, 'melody', 'melodies'), dateWords(bestDay, true)]);
    return cardHtml('records', 'Records', '', rows.length ? '<ul class="st-records">' + rows.map(r => '<li><span class="ri" aria-hidden="true">' + r[0] + '</span><span class="rn">' + r[1] + '<small>' + esc(r[3]) + '</small></span><b>' + r[2] + '</b></li>').join('') + '</ul>'
      : empty('Finish a round, Beat the clock or an Endless run to set a record.'));
  }

  /* ---- mix-ups: the bars played instead of the right one ---- */
  function mixHtml(me) {
    const mix = Object.keys(me.mix || {}).filter(k => /^[A-G]\d>[A-G]\d$/.test(k)).map(k => [k, me.mix[k] | 0]).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const max = mix.length ? mix[0][1] : 1;
    const pill = id => RR.BAR[id] ? '<b class="lpill" style="--c:' + RR.BAR[id].colour + '">' + id[0] + '</b>' : esc(id);
    return cardHtml('mix', 'Mix-ups', mix.length ? 'The bar you played, and the note it should have been' : '',
      mix.length ? '<ul class="st-mix">' + mix.map(m => { const [a, b] = m[0].split('>'); return '<li><span class="mx-l">' + pill(b) + ' for ' + pill(a) + '</span><span class="hb-track"><i class="hb-rest" style="width:' + (100 * m[1] / max) + '%"></i></span><span class="hb-v">' + plural(m[1], 'time') + '</span></li>'; }).join('') + '</ul>'
        : empty('No mix-ups yet — a slip in a Test shows up here.'));
  }

  /* ---- the last games ---- */
  function gamesHtml(me) {
    const list = me.games.slice(-8).reverse(), pts = RR.device.points;
    const what = g => RR.roundLen(g.game) ? 'Round of ' + RR.roundLen(g.game) : g.game === 'song' ? 'Song' : g.game === 'clock' ? 'Beat the clock ' + (g.secs === 120 ? '2 min' : g.secs + ' s') : g.game;
    const result = g => g.game === 'clock' ? plural(g.notes || 0, 'note') : pts ? plural(g.pts, 'point') : RR.device.stars ? '★ ' + g.gold : plural(g.n, 'melody', 'melodies');
    return cardHtml('games', 'Last games', '', list.length ? '<ul class="st-games">' + list.map(g => '<li><span class="gd">' + dateWords(g.d) + '</span><span class="gw"><b>' + esc(what(g)) + '</b><small>' + esc(g.label) + '</small></span><b class="gr">' + result(g) + '</b></li>').join('') + '</ul>'
      : empty('Rounds, Songs and Beat the clocks you finish are listed here.'));
  }

  /* ---- the best rounds, from every level and session (the Score board keeps the top ten of each) ---- */
  function keyName(k) {
    if (/^lv2:\d+$/.test(k)) { const l = RR.LEVELS[+k.slice(4) - 1]; return l ? 'Level ' + l.n + ' · ' + l.name : null; }   // the old ladder's ('1'…'15'): not shown
    if (k.indexOf('session:') === 0) { const x = RR.Sessions.get(k.slice(8)); return x ? x.name : null; }
    if (k.indexOf('set:') === 0) { const x = RR.Sets.get(k.slice(4)); return x ? x.title : null; }
    if (k.indexOf('lesson:') === 0) return 'Lesson · ' + k.slice(7);
    return k === 'custom' ? 'Custom' : k === 'gen' ? 'Generated' : null;
  }
  function bestsHtml(me) {
    const pts = RR.device.points, all = [];
    Object.keys(me.levels || {}).forEach(k => {
      const e = me.levels[k], name = keyName(k);
      if (!name || !e || !Array.isArray(e.bests)) return;
      e.bests.forEach(b => { if (b && RR.roundLen(b.game) && typeof b.pts === 'number') all.push({ name, b }); });
    });
    all.sort((x, y) => y.b.pts - x.b.pts || (y.b.gold | 0) - (x.b.gold | 0));
    const top = all.slice(0, 6);
    return cardHtml('bests', 'Best rounds', top.length ? 'Your highest-scoring rounds, from every level and session' : '',
      top.length ? '<ul class="st-games">' + top.map((x, i) => '<li><span class="gd">' + (i + 1) + '.</span><span class="gw"><b>' + esc(x.name) + '</b><small>Round of ' + RR.roundLen(x.b.game) + ' · ' + (x.b.date ? dateWords(x.b.date) : '') + '</small></span>' +
        '<b class="gr">' + (pts ? plural(x.b.pts, 'point') : RR.device.stars && typeof x.b.gold === 'number' ? '★ ' + x.b.gold : '') + '</b></li>').join('') + '</ul>'
        : empty('Finish a round to see your best ones here.'));
  }

  /* ---------------- drawing ---------------- */
  let lastW = 0;
  function fill() {
    charts.forEach(c => {
      const host = document.querySelector('#stats [data-chart="' + c.id + '"]'); if (!host) return;
      host.innerHTML = c.draw(Math.max(200, Math.floor(host.clientWidth)));
    });
    lastW = $('#stats').clientWidth;
  }
  function render() {
    const el = $('#stats'); if (!el || !RR.View || RR.View.current !== 'stats') return;
    const y = el.scrollTop;
    el.innerHTML = html();
    el.scrollTop = y;
    fill();
  }
  new ResizeObserver(() => { if (RR.View && RR.View.current === 'stats' && Math.abs($('#stats').clientWidth - lastW) > 2) fill(); }).observe($('#stats'));

  $('#stats').addEventListener('click', async e => {
    if (RR.foldClick(e)) return;
    const pl = e.target.closest('[data-player]');
    if (pl) { RR.Players.use(pl.dataset.player); render(); return; }
    const b = e.target.closest('[data-s]'); if (!b) return;
    const k = b.dataset.s;
    if (k === 'range') range = b.dataset.v;
    else if (k === 'metric') metric = b.dataset.v;
    else if (k === 'table') tables[b.dataset.id] = !tables[b.dataset.id];
    else if (k === 'reset') {
      if (!(await RR.ask('Reset all the scores' + (RR.device.player ? ' for ' + RR.device.player : '') + '? Best scores, stars on the levels, tricky notes and every stat on this page all go.', 'Reset'))) return;
      RR.Scores.reset(); G.points = 0; G.streak = 0; G.bestStreak = 0; G.drawChips(); RR.toast('Scores reset');
    }
    render();
    const again = document.querySelector('#stats [data-s="' + k + '"]' + (b.dataset.v ? '[data-v="' + b.dataset.v + '"]' : b.dataset.id ? '[data-id="' + b.dataset.id + '"]' : ''));
    if (again) again.focus({ preventScroll: true });
  });

  RR.Stats = { render };
})();

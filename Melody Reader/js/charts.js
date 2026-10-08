/* ==========================================================================
   Melody Reader — charts.js
   --------------------------------------------------------------------------
   RR.Charts — the little charts on My stats and the home page (2026-10-07),
   drawn as SVG at the width they are given, no library:

     bars     columns from one baseline (≤ 24 px wide, a 4 px round top),
              the tallest labelled; an optional average line over them
     line     a percentage over time: a 2 px line, a light wash, dots
     heat     a calendar, a week to a column, darker for more melodies
     stack    one bar split into parts (the three kinds of score)

   Colours (checked with the dataviz validator, 2026-10-07): amber
   #d97706 for amounts, teal #0d9488 for the first-try line; the three
   scores are one amber ramp, light → dark (#e59a3a · #c06a10 · #7c3f0a),
   and the calendar runs from the paper's beige into the same ramp. Text
   is always ink, never the data's colour. Hairline grid, no dashes.

   Every mark that means something carries data-tv (its value) and data-tl
   (what it is): one tooltip, filled with textContent, follows the pointer
   (a tap shows it for a moment). The numbers are also in each chart's
   Table view (stats.js), so the tooltip never hides anything.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, esc = RR.esc;

  const COL = { bar: '#d97706', line: '#0d9488', grid: '#efe5d3', axis: '#d9c9ad', ink: '#2b1d16', soft: '#6b5446', surface: '#ffffff' };
  const TIERS = ['#e59a3a', '#c06a10', '#7c3f0a'];
  const TIER_TEXT = [COL.ink, '#ffffff', '#ffffff'];
  const HEAT = ['#f1e9da', '#f6d29a', '#e59a3a', '#c06a10', '#7c3f0a'];

  /* a round top to a scale: 1 2 5 × 10ⁿ */
  function niceMax(v) {
    if (!(v > 0)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }
  function ticks(max) {
    const step = niceMax(max / 4);
    const out = []; for (let t = 0; t <= max + 1e-9; t += step) out.push(+t.toFixed(6));
    return out.length > 6 ? out.filter((_, i) => i % 2 === 0) : out;
  }
  const fmt = v => (v >= 10000 ? (v / 1000).toFixed(0) + 'k' : v >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(Math.round(v * 10) / 10));
  const tip = (v, l) => ' data-tv="' + esc(v) + '" data-tl="' + esc(l) + '"';
  const open = (w, h, cls) => '<svg class="ch ' + (cls || '') + '" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true" focusable="false">';
  /* a column with a round top, square on the baseline */
  function col(x, top, w, base) {
    const r = Math.min(4, w / 2, base - top);
    return 'M' + x + ' ' + base + 'V' + (top + r) + 'Q' + x + ' ' + top + ' ' + (x + r) + ' ' + top + 'H' + (x + w - r) + 'Q' + (x + w) + ' ' + top + ' ' + (x + w) + ' ' + (top + r) + 'V' + base + 'Z';
  }
  /* which x labels to show: as many as fit, always the last */
  function labelEvery(n, room) { return Math.max(1, Math.ceil(n / Math.max(1, Math.floor(room / 46)))); }

  /* data: [{ v, x (the label under it), tv, tl, c (a colour of its own) }]
     o: { h, max, mini (no axis: a sparkline of columns), avg: [value or null per column], unit } */
  function bars(w, data, o) {
    o = o || {};
    const h = o.h || 190, mini = !!o.mini;
    const padL = mini ? 2 : 34, padR = mini ? 2 : 8, padT = 18, padB = mini ? 16 : 24;
    const pw = Math.max(20, w - padL - padR), ph = h - padT - padB, base = padT + ph;
    const top = Math.max(1, ...data.map(d => d.v || 0), ...(o.avg || []).filter(v => v != null));
    const max = o.max || niceMax(top);
    const y = v => base - (Math.min(v, max) / max) * ph;
    const n = Math.max(1, data.length), slot = pw / n, bw = Math.max(2, Math.min(24, slot * 0.62));
    let s = open(w, h, mini ? 'mini' : '');
    if (!mini) ticks(max).forEach(t => {
      s += '<line x1="' + padL + '" x2="' + (w - padR) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="' + (t ? COL.grid : COL.axis) + '" stroke-width="1"/>' +
        '<text x="' + (padL - 6) + '" y="' + (y(t) + 4) + '" text-anchor="end" class="ch-tick">' + fmt(t) + '</text>';
    });
    else s += '<line x1="' + padL + '" x2="' + (w - padR) + '" y1="' + base + '" y2="' + base + '" stroke="' + COL.axis + '" stroke-width="1"/>';
    let hi = -1; data.forEach((d, i) => { if (d.v > 0 && (hi < 0 || d.v >= data[hi].v)) hi = i; });
    data.forEach((d, i) => {
      const x = padL + i * slot + (slot - bw) / 2;
      if (d.v > 0) s += '<path class="mark" data-i="' + i + '" d="' + col(x, Math.min(y(d.v), base - 1.5), bw, base) + '" fill="' + (d.c || o.color || COL.bar) + '"/>';
    });
    if (o.avg) {
      const pts = o.avg.map((v, i) => v == null ? null : [padL + i * slot + slot / 2, y(v)]).filter(Boolean);
      if (pts.length > 1) s += '<polyline points="' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)) .join(' ') + '" fill="none" stroke="' + COL.ink + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    if (hi >= 0 && !o.noPeak) {
      const cx = padL + hi * slot + slot / 2;
      s += '<text x="' + Math.max(padL + 8, Math.min(w - padR - 8, cx)) + '" y="' + (y(data[hi].v) - 5) + '" text-anchor="middle" class="ch-peak">' + fmt(data[hi].v) + '</text>';
    }
    const every = o.labelEvery || labelEvery(n, pw);
    data.forEach((d, i) => {
      if ((n - 1 - i) % every) return;
      const cx = padL + i * slot + slot / 2;
      s += '<text x="' + cx + '" y="' + (h - (mini ? 3 : 7)) + '" text-anchor="middle" class="ch-x">' + esc(d.x || '') + '</text>';
    });
    // the hit targets: the whole column's slot, taller than the mark
    data.forEach((d, i) => { s += '<rect class="hit" data-i="' + i + '" x="' + (padL + i * slot) + '" y="' + padT + '" width="' + slot + '" height="' + (ph + padB) + '" fill="transparent"' + tip(d.tv, d.tl) + '/>'; });
    return s + '</svg>';
  }

  /* pts: [{ v or null, x, tv, tl }], evenly spaced; the line joins the days that have one.
     o: { max (100), ticks ([0 25 50 75 100]), suffix ('%'), color } */
  function line(w, pts, o) {
    o = o || {};
    const h = o.h || 190, padL = 38, padR = 14, padT = 16, padB = 24, max = o.max || 100, suf = o.suffix == null ? '%' : o.suffix;
    const colr = o.color || COL.line;
    const pw = Math.max(20, w - padL - padR), ph = h - padT - padB, base = padT + ph;
    const n = Math.max(1, pts.length), step = n > 1 ? pw / (n - 1) : 0;
    const x = i => n > 1 ? padL + i * step : padL + pw / 2, y = v => base - (Math.min(v, max) / max) * ph;
    let s = open(w, h);
    (o.ticks || [0, 25, 50, 75, 100]).forEach(t => {
      s += '<line x1="' + padL + '" x2="' + (w - padR) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="' + (t ? COL.grid : COL.axis) + '" stroke-width="1"/>' +
        '<text x="' + (padL - 6) + '" y="' + (y(t) + 4) + '" text-anchor="end" class="ch-tick">' + t + suf + '</text>';
    });
    const on = pts.map((p, i) => p.v == null ? null : [x(i), y(p.v), i]).filter(Boolean);
    if (on.length > 1) {
      const d = on.map((p, k) => (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
      s += '<path d="' + d + 'L' + on[on.length - 1][0].toFixed(1) + ' ' + base + 'L' + on[0][0].toFixed(1) + ' ' + base + 'Z" fill="' + colr + '" opacity=".1"/>';
      s += '<path d="' + d + '" fill="none" stroke="' + colr + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    on.forEach(p => { s += '<circle class="mark dot" data-i="' + p[2] + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5" fill="' + colr + '" stroke="' + COL.surface + '" stroke-width="2"/>'; });
    if (on.length) {
      const last = on[on.length - 1], v = pts[last[2]].v;
      s += '<text x="' + Math.min(w - padR, last[0] + 2) + '" y="' + (last[1] - 10) + '" text-anchor="end" class="ch-peak">' + (max === 100 ? Math.round(v) : Math.round(v * 10) / 10) + suf + '</text>';
    }
    const every = labelEvery(n, pw);
    pts.forEach((p, i) => { if (!((n - 1 - i) % every)) s += '<text x="' + x(i) + '" y="' + (h - 7) + '" text-anchor="middle" class="ch-x">' + esc(p.x || '') + '</text>'; });
    on.forEach(p => { s += '<circle class="hit" data-i="' + p[2] + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="13" fill="transparent"' + tip(pts[p[2]].tv, pts[p[2]].tl) + '/>'; });
    return s + '</svg>';
  }

  /* a calendar: cells [{ key (YYYY-MM-DD), v, tv, tl }] from a Monday to today, a week to a column;
     levels: the counts where each darker step starts */
  function heat(w, cells, o) {
    o = o || {};
    const size = 14, gap = 3, padL = 28, padT = 16, levels = o.levels || [1, 3, 6, 11];
    const weeks = Math.ceil(cells.length / 7);
    const width = padL + weeks * (size + gap), height = padT + 7 * (size + gap);
    let s = open(width, height, 'heat');
    ['Mon', '', 'Wed', '', 'Fri', '', ''].forEach((d, r) => { if (d) s += '<text x="0" y="' + (padT + r * (size + gap) + size - 3) + '" class="ch-x" text-anchor="start">' + d + '</text>'; });
    let lastMonth = -1;
    cells.forEach((c, i) => {
      const wk = Math.floor(i / 7), r = i % 7, x = padL + wk * (size + gap), yy = padT + r * (size + gap);
      const d = RR.History.parseDay(c.key);
      if (r === 0 && d.getMonth() !== lastMonth && (wk < weeks - 1 || weeks === 1)) {
        lastMonth = d.getMonth();
        s += '<text x="' + x + '" y="10" class="ch-x" text-anchor="start">' + d.toLocaleDateString(undefined, { month: 'short' }) + '</text>';
      }
      let lv = 0; levels.forEach((t, k) => { if (c.v >= t) lv = k + 1; });
      s += '<rect class="mark cell' + (c.today ? ' today' : '') + '" data-i="' + i + '" x="' + x + '" y="' + yy + '" width="' + size + '" height="' + size + '" rx="3" fill="' + HEAT[lv] + '"' + tip(c.tv, c.tl) + '/>';
    });
    return { svg: s + '</svg>', width };
  }

  /* segs: [{ v, name, c, text }] — one bar, its parts in order, a 2 px gap between them */
  function stack(w, segs, o) {
    o = o || {};
    const h = o.h || 30, total = segs.reduce((a, x) => a + x.v, 0);
    let s = open(w, h, 'stack');
    if (!total) return s + '<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="8" fill="' + COL.grid + '"/></svg>';
    const live = segs.map((x, i) => Object.assign({ i }, x)).filter(x => x.v > 0);
    const room = w - 2 * (live.length - 1);
    const id = 'st' + Math.random().toString(36).slice(2, 7);
    s += '<defs><clipPath id="' + id + '"><rect x="0" y="0" width="' + w + '" height="' + h + '" rx="8"/></clipPath></defs><g clip-path="url(#' + id + ')">';
    let x = 0;
    live.forEach(seg => {
      const sw = room * seg.v / total, pct = Math.round(100 * seg.v / total);
      s += '<rect class="mark" data-i="' + seg.i + '" x="' + x.toFixed(1) + '" y="0" width="' + Math.max(0.5, sw).toFixed(1) + '" height="' + h + '" fill="' + seg.c + '"' + tip(seg.v + ' · ' + pct + '%', seg.name) + '/>';
      if (sw >= 44) s += '<text x="' + (x + sw / 2).toFixed(1) + '" y="' + (h / 2 + 5) + '" text-anchor="middle" class="ch-in" fill="' + (seg.text || COL.ink) + '" pointer-events="none">' + pct + '%</text>';
      x += sw + 2;
    });
    return s + '</g></svg>';
  }

  /* ---------------- the tooltip ---------------- */
  let tipEl = null, cur = null, hideT = null;
  function tipBox() {
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.className = 'chart-tip'; tipEl.setAttribute('role', 'tooltip'); tipEl.hidden = true;
      tipEl.innerHTML = '<b></b><span></span>';
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }
  function hot(t, on) {
    const svg = t.ownerSVGElement || t.closest('svg'); if (!svg || t.dataset.i == null) return;
    svg.querySelectorAll('.mark[data-i="' + t.dataset.i + '"]').forEach(m => m.classList.toggle('hot', on));
  }
  function place(x, y) {
    const b = tipBox(), r = b.getBoundingClientRect();
    let left = x - r.width / 2, top = y - r.height - 14;
    left = Math.max(6, Math.min(window.innerWidth - r.width - 6, left));
    if (top < 6) top = y + 18;
    b.style.left = left + 'px'; b.style.top = top + 'px';
  }
  function show(t, x, y) {
    clearTimeout(hideT);
    if (cur && cur !== t) hot(cur, false);
    cur = t; hot(t, true);
    const b = tipBox();
    b.firstChild.textContent = t.dataset.tv || '';
    b.lastChild.textContent = t.dataset.tl || '';
    b.hidden = false;
    place(x, y);
  }
  function hide() { clearTimeout(hideT); if (cur) hot(cur, false); cur = null; if (tipEl) tipEl.hidden = true; }
  const target = e => e.target && e.target.closest ? e.target.closest('[data-tv]') : null;
  document.addEventListener('pointerover', e => { if (e.pointerType === 'touch') return; const t = target(e); if (t) show(t, e.clientX, e.clientY); });
  document.addEventListener('pointermove', e => { if (cur && e.pointerType !== 'touch' && target(e) === cur) place(e.clientX, e.clientY); });
  document.addEventListener('pointerout', e => { if (e.pointerType === 'touch') return; const t = target(e); if (t && t === cur && !(e.relatedTarget && t.contains(e.relatedTarget))) hide(); });
  // a finger: the tap shows it for a moment
  document.addEventListener('pointerdown', e => {
    const t = target(e);
    if (!t) { if (cur) hide(); return; }
    if (e.pointerType !== 'touch') return;
    show(t, e.clientX, e.clientY);
    hideT = setTimeout(hide, 2600);
  }, true);
  window.addEventListener('scroll', hide, true);

  RR.Charts = { COL, TIERS, TIER_TEXT, HEAT, niceMax, bars, line, heat, stack, hideTip: hide };
})();

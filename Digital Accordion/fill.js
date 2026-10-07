/* Digital Accordion — fill.js: the touch layout of the round buttons ("Fill the screen").

   window.fillRound(input) -> { circles: [{ id, cx, cy, d }], mods: { placement, rect }, variant, face, rows }
     (face: a regular button's face in px; rows: the ids, bottom row first, each left to right)
   input: { items: [{ id, big }]   in order: the first goes at the bottom, the last at the top
            refX: { id: number }   optional: inside a row, members go left to right by this
                                   (else in the order of items)
            bigK: [k, ...]         padded radii to try for the big buttons (a regular one's is 1)
            W, H, mods: { count }, RING, MIN_GAP, prev (this side's last out.variant) }

   The standard board (standard-board.js) puts the buttons where the keys are on a computer
   keyboard. A phone or a tablet has no keyboard, so there the buttons are free to fill the space.
   They are cut into rows (bottom to top, each read left to right, in the order given: the notes by
   pitch, the chords by importance), and the rows nest into each other's dimples like an
   accordion's. Every way of cutting the rows (1 to 9 a row, equal or alternating k / k−1, the big
   tonic alone at the bottom) is built in units, flat or rising at 30°, tight or spread, and kept.
   Fitting a box then only picks the one with the biggest buttons, which costs almost nothing, so
   a resize, or trying another split of the screen, is cheap.

   Units: a regular button's padded radius (face / 2 + ring + half the gap) = 1. Positions never
   depend on labels. */
(function () {
  'use strict';
  const SQ3 = Math.sqrt(3);
  const SPREADS = [1, 1.12, 1.25];   // flat rows: neighbours' centre pitch, x 2 (wider and the rows interleave: the reading order is lost)
  const CLIMB = 0.3;                                       // a row starts at least this far above the one below
  const TAB_MIN = 40, TAB_SIDE_MAX = 60, TAB_BOTTOM_MAX = 52;
  const FLAT_BONUS = 1.04, HYST = 0.03, STRETCH_MAX = 1.22;
  const bigBonus = k => 1 + 0.3 * (k - 1);                 // a bigger tonic may cost the others a little (1.3: up to 9%)
  const cache = new Map();

  /* the row lengths, bottom to top */
  function patterns(n, firstBig) {
    const out = [], seen = new Set();
    for (let k = 1; k <= Math.min(n, 9); k++) {
      for (const first of firstBig ? [0, 1] : [0]) {
        for (const alt of k > 1 ? [0, 1, -1] : [0]) {
          const a = []; let t = 0, j = 0;
          if (first) { a.push(1); t = 1; }
          while (t < n) {
            const len = alt === 0 ? k : ((j % 2 === 0) === (alt === 1) ? k : k - 1);
            a.push(Math.min(len, n - t)); t += len; j++;
          }
          const key = a.join(',');
          if (!seen.has(key)) { seen.add(key); out.push(a); }
        }
      }
    }
    return out;
  }

  /* one row: centres along the row line (flat, or rising at 30°), relative to the row's middle */
  function rowShape(rads, tilt, s) {
    const ca = Math.cos(tilt), sa = Math.sin(tilt), xs = [0], ys = [0];
    for (let j = 1; j < rads.length; j++) {
      const step = (rads[j - 1] + rads[j]) * (tilt ? 1 : s);
      xs.push(xs[j - 1] + step * ca); ys.push(ys[j - 1] + step * sa);
    }
    let lo = Infinity, hi = -Infinity;
    xs.forEach((x, j) => { lo = Math.min(lo, x - rads[j]); hi = Math.max(hi, x + rads[j]); });
    const mid = (lo + hi) / 2;
    return { xs: xs.map(x => x - mid), ys };
  }

  /* the rows stacked: each drops as low as it can, resting on what is below, with the sideways
     shift that lets it drop lowest (the nesting) and, between equals, the one nearest the middle */
  function stack(rowRads, tilt, s) {
    const placed = [], rows = [];
    let prevC = 0, prevY = 0;
    const shifts = [0.5, -0.5, 1, -1, 2, -2].map(m => m * s).concat([SQ3, -SQ3, SQ3 / 2, -SQ3 / 2]);
    rowRads.forEach((rads, ri) => {
      const sh = rowShape(rads, tilt, s);
      let best = null;
      const tried = new Set();
      // only what reaches up past the lowest this row can sit can touch it (rows climb)
      const floor = ri ? prevY + CLIMB : 0, rmax = Math.max(...rads);
      const near = placed.filter(p => p.y + p.r + rmax > floor);
      for (const d of [0, prevC].concat(shifts.map(x => prevC + x))) {
        const c = Math.round(d * 1e6) / 1e6;
        if (tried.has(c)) continue; tried.add(c);
        let y = floor;
        for (const p of near) {
          for (let j = 0; j < rads.length; j++) {
            const dx = p.x - (c + sh.xs[j]), rr = p.r + rads[j];
            if (Math.abs(dx) < rr) { const need = p.y + Math.sqrt(rr * rr - dx * dx) - sh.ys[j]; if (need > y) y = need; }
          }
        }
        if (!best || y < best.y - 1e-6 || (Math.abs(y - best.y) <= 1e-6 && Math.abs(c) < Math.abs(best.c) - 1e-6)) best = { y, c };
      }
      const pts = rads.map((r, j) => ({ x: best.c + sh.xs[j], y: best.y + sh.ys[j], r }));
      pts.forEach(p => placed.push(p));
      rows.push(pts);
      prevC = best.c; prevY = best.y;
    });
    return rows;
  }
  function bounds(rows) {
    const b = { x0: Infinity, x1: -Infinity, y0: Infinity, y1: -Infinity, cx0: Infinity, cx1: -Infinity, cy0: Infinity, cy1: -Infinity };
    rows.forEach(r => r.forEach(p => {
      b.x0 = Math.min(b.x0, p.x - p.r); b.x1 = Math.max(b.x1, p.x + p.r); b.y0 = Math.min(b.y0, p.y - p.r); b.y1 = Math.max(b.y1, p.y + p.r);
      b.cx0 = Math.min(b.cx0, p.x); b.cx1 = Math.max(b.cx1, p.x); b.cy0 = Math.min(b.cy0, p.y); b.cy1 = Math.max(b.cy1, p.y);
    }));
    return b;
  }

  /* every candidate board for these items, in units; kept per structure (ids, order, big ones, sizes) */
  function candidates(items, refX, bigK) {
    const n = items.length;
    const key = items.map(it => it.id + (it.big ? '*' : '') + (refX ? ':' + (refX[it.id] ?? '') : '')).join(',') + '|' + bigK.join(',');
    let list = cache.get(key);
    if (list) return list;
    list = [];
    const ks = items.some(it => it.big) ? bigK : [1];
    for (const pat of patterns(n, !!items[0].big)) {
      // cut the rows, then read each one left to right by refX
      let i = 0;
      const rows = pat.map(len => {
        const r = items.slice(i, i + len); i += len;
        return refX ? r.map((it, j) => ({ it, j })).sort((p, q) => ((refX[p.it.id] ?? 1e9) - (refX[q.it.id] ?? 1e9)) || p.j - q.j).map(o => o.it) : r;
      });
      const single = pat.every(len => len === 1);
      for (const k of ks) {
        const rowRads = rows.map(r => r.map(it => it.big ? k : 1));
        for (const tilt of single ? [0] : [0, Math.PI / 6]) {
          for (const s of tilt || single ? [1] : SPREADS) {
            const placed = stack(rowRads, tilt, s);
            const b = bounds(placed);
            list.push({ key: pat.join('.') + '/' + (tilt ? 30 : 0) + '/' + s + '/' + k, rows, placed, tilt, s, k, b, Wb: b.x1 - b.x0, Hb: b.y1 - b.y0 });
          }
        }
      }
    }
    if (cache.size > 40) cache.clear();
    cache.set(key, list);
    return list;
  }

  function fillRound(input) {
    const items = (input.items || []).filter(it => it && it.id != null);
    const W = Math.max(0, +input.W || 0), H = Math.max(0, +input.H || 0);
    const RING = input.RING != null ? +input.RING : 4, GAP = input.MIN_GAP != null ? +input.MIN_GAP : 2;
    const nMods = Math.max(0, (input.mods && +input.mods.count) || 0);
    const bigK = input.bigK && input.bigK.length ? input.bigK.slice() : [1];
    const TG = Math.max(4, Math.min(6, Math.min(W, H) / 50));
    if (!items.length || !W || !H) return { circles: [], mods: { placement: 'none' }, variant: undefined, face: 0 };

    // where the Z X C V B tabs can go (a narrow side squeezes them to 32 px each along the bottom)
    const places = [];
    if (!nMods) places.push({ pl: 'none', aw: W, ah: H });
    else {
      if (H >= 40 * nMods) places.push({ pl: 'side', aw: W - TAB_MIN - TG, ah: H });
      if (W >= 32 * nMods || !places.length) places.push({ pl: 'bottom', aw: W, ah: H - TAB_MIN - TG });
    }
    places.forEach(P => { P.aw = Math.max(1, P.aw); P.ah = Math.max(1, P.ah); });

    const faceOf = u => 2 * u - 2 * RING - GAP;
    let best = null, prev = null;
    for (const c of candidates(items, input.refX || null, bigK)) {
      for (const P of places) {
        const u = Math.min((P.aw + GAP) / c.Wb, (P.ah + GAP) / c.Hb);
        const e = { c, P, u, key: c.key + '/' + P.pl, score: faceOf(u) * (c.tilt ? 1 : FLAT_BONUS) * bigBonus(c.k) };
        if (!best || e.score > best.score + 1e-9) best = e;
        if (input.prev && e.key === input.prev) prev = e;
      }
    }
    // a resize keeps the arrangement while it stays within 3% of the best
    const { c, P, u } = prev && prev.score >= best.score * (1 - HYST) ? prev : best;

    // slack in the free direction spreads the centres a little (rows apart, or along the rows)
    const b = c.b;
    const fx = b.cx1 > b.cx0 ? Math.min(STRETCH_MAX, 1 + Math.max(0, (P.aw + GAP) / u - c.Wb) / (b.cx1 - b.cx0)) : 1;
    const fy = b.cy1 > b.cy0 ? Math.min(STRETCH_MAX, 1 + Math.max(0, (P.ah + GAP) / u - c.Hb) / (b.cy1 - b.cy0)) : 1;
    const mx = (b.cx0 + b.cx1) / 2, my = (b.cy0 + b.cy1) / 2;
    const pts = c.placed.map(r => r.map(p => ({ x: mx + (p.x - mx) * fx, y: my + (p.y - my) * fy, r: p.r })));
    const sb = bounds(pts);
    const bw = (sb.x1 - sb.x0) * u - GAP, bh = (sb.y1 - sb.y0) * u - GAP;

    // the tabs: their strip grows into the slack, grouped and centred with the buttons
    let ox = (P.aw - bw) / 2, oy = (P.ah - bh) / 2, rect = null;
    if (P.pl === 'side') {
      const tw = Math.max(TAB_MIN, Math.min(TAB_SIDE_MAX, TAB_MIN + Math.max(0, W - bw - TG - TAB_MIN) / 2));
      ox = Math.max(0, (W - (bw + TG + tw)) / 2);
      const th = Math.min(H, Math.max(44 * nMods, Math.min(96 * nMods, bh)));
      rect = { x: Math.min(W - tw, ox + bw + TG), y: Math.max(0, Math.min(H - th, oy + bh / 2 - th / 2)), w: tw, h: th };
    } else if (P.pl === 'bottom') {
      const th = Math.max(TAB_MIN, Math.min(TAB_BOTTOM_MAX, TAB_MIN + Math.max(0, H - bh - TG - TAB_MIN) / 2));
      oy = Math.max(0, (H - (bh + TG + th)) / 2);
      const tw = Math.min(W, Math.max(56 * nMods, Math.min(120 * nMods, bw)));
      rect = { x: Math.max(0, Math.min(W - tw, ox + bw / 2 - tw / 2)), y: Math.min(H - th, oy + bh + TG), w: tw, h: th };
    }

    const circles = [];
    c.rows.forEach((r, ri) => r.forEach((it, j) => {
      const p = pts[ri][j];
      circles.push({ id: it.id, cx: ox - GAP / 2 + (p.x - sb.x0) * u, cy: oy - GAP / 2 + (sb.y1 - p.y) * u, d: Math.max(2, 2 * p.r * u - 2 * RING - GAP) });
    }));
    return { circles, mods: rect ? { placement: P.pl, rect } : { placement: 'none' }, variant: c.key + '/' + P.pl, face: faceOf(u), rows: c.rows.map(r => r.map(it => it.id)) };
  }

  window.fillRound = fillRound;
})();

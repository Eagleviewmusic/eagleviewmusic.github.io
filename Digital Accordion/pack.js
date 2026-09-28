/* Digital Accordion — round-button packer (final).

   window.packRound(input) -> { circles: [{ id, cx, cy, d }], mods: { placement, rect }, variant }
   input: { side: 'chords'|'melody', rows (bottom to top; a member is an id or a stack of ids),
            blocks: { id: { size, w } }, W, H, mods: { count }, RING, MIN_GAP, prev, partner }
     prev    = this side's previous out.variant (or undefined). While that arrangement is still
               possible and within 3% of the best (in score AND in regular-button size), it is kept
               (same tab placement, row tilt, stack angle, pairing, folding, big-button size AND row
               shifts), so a resize only rescales the board. Failing that, the tabs stay on their side
               while that side is within 3%.
     partner = the other side's latest out.variant (optional). Its row tilt is matched while that
               costs this side less than 3%; a match is entered only within 1.5% (no ping-pong).
   out.variant = { key, sig, xq, score }: a small plain object (key: the variant; sig: the tower's
   structure; xq: each line's shift in quarter pitches). Positions depend only on rows, sizes, W,
   H, the tab count (and prev / partner), never on label text. Deterministic.

   The board is built like an accordion's: every tower row becomes a straight line of equal round
   buttons and each row drops into the dimples of the rows below, so buttons nest and line up on
   diagonals. Units: a regular button's padded radius (face/2 + ring + half the minimum gap) = 1,
   so two circles are legal when their centres are at least rho_a + rho_b apart and a layout of
   padded size Wb x Hb fits a w x h area at scale u = min((w+2)/Wb, (h+2)/Hb) px per unit.

   Families searched (the biggest regular button wins, with small preferences for tidy patterns):
     tower     horizontal rows, each shifted a half (or, for two equal rows, a quarter) pitch from
               the row below, never stacked square; a stack stands on the row line, or sinks onto
               the shelf of the row's biggest button (its bottom edge level with it), never lower;
     tilted    every row tilted by the same angle (20..80 deg, never downhill) for narrow boxes;
               30 deg gives the garmon's vertical columns; on 30 deg rows a stack may also run along
               the row line (Do Re Mi Fa as one diagonal); in a wide box a steep tilt (40 deg and
               more) must buy 8%, since there it reads as stripes;
     honeycomb (chords, wide boxes) neighbours in a row spread to 2.4 .. 2*sqrt(3) units, so the
               next row drops fully into the gaps: a Stradella bass board;
     paired    (wide boxes, melody only, when it buys 3%) two consecutive rows share one line, the
               right one stepped up (Mi | Fa So La, Ti Do Re Mi | Fa So La). Chord rows mirror the
               keyboard rows, so they never share a line (except in the tiny regime below);
     folded    (width-bound boxes) a long row folds into a two-line zig-zag.
   Boxes too small for a good board (face under 24 px) drop the gates and preferences and may also
   use 20 deg stacks and stacks centred on the row, so extreme towers still fit.
   Row shifts come from a small beam search (bounding size for the box's shape, with the height the
   rows still to come will need, then balance and a symmetric stagger as tie-breakers); a row must
   rest on the row below and overlap it; stacks climb at least half a pitch per step. Every variant
   is tried: first with greedy row shifts, then with the full beam for all within 10% of the best.
   A variant that can no longer come within the 3% band of the best is abandoned as soon as its
   partial board is too wide or too tall, and the drop heights between two row shapes are kept on
   the shapes, so beam states, tab placements and later calls (a resize) share them.
   Tie-breakers between variants: near-miss gaps that read as scatter, isolated buttons, square-grid
   pairs, repeated rows (Fa So La) out of their column (lined up for the few best boards), single
   buttons stacked square, and small bonuses for flat rows, 30 deg garmon columns and the full
   big-button size. Big buttons: 0.72 of their extra size first, then full / 0.55 / 0.85 around the
   best few (the tonic stays at least ~1.3x a regular face). Tabs (Z X C V B) are searched at their
   minimum strip, then grow into the slack and are grouped and centred with the buttons. */
(function () {
  'use strict';
  const DEG = Math.PI / 180, SQ3 = Math.sqrt(3);
  // builtins held in closure constants: the hot loops then never look a global up (cheaper in the
  // interpreter, and much cheaper in sandboxed contexts such as node's vm)
  const { abs, max, min, sqrt, cos, sin, hypot, round, ceil, imul } = Math;
  const INF = Infinity, F64 = Float64Array, U8 = Uint8Array, I32 = Int32Array, MapC = Map, SetC = Set, Arr = Array;
  const assign = Object.assign, isArray = Array.isArray, arrFrom = Array.from, isInteger = Number.isInteger;
  const DEFAULTS = {
    alphas: [0, 20, 30, 40, 50, 60, 70, 80], // row tilt (deg); never negative, so rows never run downhill
    betas: [60, 90, 35],                     // stack chain angle (deg): each step climbs >= half a pitch
    alongBeta: true,                         // on 20 / 30 deg rows a stack may also run along the row line
    spreads: [2.4, 2.8, 2 * SQ3],            // chord honeycomb: centre pitch of neighbours in a row
    spreadGate: 1.05,                        // a spread must buy 5%
    pairGate: 1.03,                          // paired lines (melody) must buy 3%
    wideTilt: 1.08, wideTiltMin: 40, wideAspect: 1.15,   // a steep tilt in a wide box must buy 8% (it reads as stripes)
    chordPairGate: Infinity,                 // never on the chord side, whose rows mirror the keyboard rows (tiny boxes excepted)
    pairTop: 6,                              // paired lines: tried for the n best height-bound flat variants
    shelfTol: 0,                             // 'm': a stack may sink this much (units) below the shelf
    tinyFace: 24,                            // below this face (px) only size counts: no gates, no preferences
    pairPhaseGate: 1.03,                     // the other pairing phase must beat the default by 3%
    pairStep: 0.5, pairGap: 0.3,
    foldGate: 1.02, foldMin: 4, foldTop: 4,  // folding: tried from the n best flat variants
    kmuls: [0.72, 0.55, 0.85],               // smaller big buttons (share of their extra size), middle first
    kTop: 4, kTopBig: 8, kStep: 0.002,      // tried around the n best (8 when the tonic chord I is aboard)
    screenK: 0.72,                           // big-button size stage 1 is run with
    tiltAllB: true, tiltRefine: 3,           // every stack angle for every tilt (very big towers: for the 3 best tilts)
    alignTop: 3,                             // repeated rows are lined up for the n best boards
    kFloor: 1.32,                            // a big button's padded radius never goes below this (face ~1.3x+)
    bonus: { a0: 0.03, a30: 0.025, a60: 0.01, a80: -0.02, b60: 0.01, along: 0.02, kFull: 0.02, k85: 0.012, k72: 0.006 },
    climb: 0.4,                              // rows climb at least this much (units)
    restGap: 0.4, overlap: 0.6,              // a row rests on the row below and overlaps it by 0.3 pitch
    minStep: 1, orderGap: 0.3,               // members advance along the row / read left to right
    lambda: 0.03,                            // cost of drifting sideways from the first row's centre
    align: 0.015,                            // cost per half pitch of a repeated row out of its column
    wideTopChords: 3,                        // honeycomb: tried around the n best height-bound flat variants
    beam: 3, heavy: 40,                      // beam width for the row shifts (1 for towers above 40 buttons)
    screenBeam: 1, refineCut: 0.9,           // greedy row shifts first; the full beam for all within 10% of the best
    messW: 0.04,                             // near-miss (scatter) tie-breaker
    isoW: 0.12,                              // each button that touches nothing costs 12%
    gridW: 0.18,                             // square-grid pairs (share of the buttons) cost up to 18%
    alignW: 0.02,                            // a repeated row out of its column costs 2%
    badW: 0.5,                               // a row not resting on / overlapping the one below: only when nothing else works
    squareW: 0.2,                            // cost of single buttons stacked square (straight on top of each other)
    futureH: 0.7,                            // beam: expected rise of each row still to come, per unit of its height
    hyst: 0.03, hystFace: 0.03,              // keep the previous variant while within 3% of the best (score and size)
    shapeCap: 6000,                          // row-shape cache size (evicted only between calls)
    tabMin: 40, sideMax: 60, bottomMax: 52,
    colPerTab: [44, 96], rowPerTab: [56, 120],
    safety: 0.02,
    ds: [0, -1, 1, -2, 2], dsBig: [0, -1, 1, -2, 2, -3, 3, -4, 4], dsPlain: [0, -2, 2], dsPlainSame: [0, -1, 1, -2, 2],   // row shifts (quarter pitches)
    dsLat: [0, -1, 1, -2, 2], dsBigLat: [0, -2, 2, -4, 4]
  };
  let CFG = assign({}, DEFAULTS);

  /* how big a block's circle is (padded radius, regular = 1): small or skinny blocks join the
     regular family; the tonic chord I (2x3) gets 1.75, the tonic note Do (2x1.45) 1.45 */
  function kappa(b) {
    const size = (b && +b.size) || 1, w = (b && +b.w) || 1;
    if (size < 0.95 || w < 0.95) return 1;
    const area = size * w;
    if (area < 1.4) return 1;
    return max(1.2, min(2.0, 0.765 + 0.402 * sqrt(area)));
  }
  function kScaled(kap, k) { return kap <= 1 ? 1 : k === 1 ? kap : max(1 + (kap - 1) * k, min(kap, CFG.kFloor)); }

  /* ---------- structure: memoised by row structure (sizes only), never by ids or labels ---------- */
  const STRUCTS = new MapC(), SHAPES = new MapC();
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = imul(h, 16777619); } return (h >>> 0).toString(36); }
  function prep(input) {
    const blocks = input.blocks || {};
    const mems = [], ids = [];
    for (const r of (input.rows || [])) {
      if (!r || !r.length) continue;
      const mem = [], rid = [];
      for (const m of r) {
        const list = isArray(m) ? m : [m];
        if (!list.length) continue;
        mem.push(list.map(id => kappa(blocks[id])));
        for (const id of list) rid.push(id);
      }
      if (mem.length) { mems.push(mem); ids.push(rid); }
    }
    const rowSigs = mems.map(mem => mem.map(m => m.map(k => k.toFixed(3)).join(',')).join(';'));
    const sig = rowSigs.join('|');
    let S = STRUCTS.get(sig);
    if (!S) {
      const rows = mems.map((mem, i) => {
        let n = 0, stack = false, big = false;
        mem.forEach(m => { n += m.length; if (m.length > 1) stack = true; if (m.some(k => k > 1)) big = true; });
        return { sig: rowSigs[i], mem, n, nm: mem.length, stack, big, foldable: mem.length >= CFG.foldMin };
      });
      let n = 0; rows.forEach(r => { n += r.n; });
      const kaps = [];
      mems.forEach(mem => mem.forEach(m => m.forEach(k => { if (k > 1 && !kaps.includes(k)) kaps.push(k); })));
      // does sinking a stack onto the shelf of a bigger single button change anything?
      const shelf = rows.some(r => { if (!r.stack) return false; let big = 0, lo = INF; r.mem.forEach(m => { if (m.length === 1) big = max(big, m[0]); else lo = min(lo, m[0]); }); return big > lo || (CFG.shelfTol > 0 && r.nm > 1); });
      S = { sig, hash: hashStr(sig), rows, n, lc: new MapC(), hasStack: rows.some(r => r.stack), hasBig: rows.some(r => r.big), anyFold: rows.some(r => r.foldable), kaps, shelf };
      if (STRUCTS.size > 48) STRUCTS.clear();
      STRUCTS.set(sig, S);
    }
    return { S, ids };
  }

  /* ---------- shapes ---------- */
  /* a member: one circle, or a stack climbing at beta from its bottom button (a zigzag for 3+, the
     garmon's two offset columns) */
  function memberShape(rh, beta) {
    const n = rh.length, xs = new Arr(n), ys = new Arr(n);
    xs[0] = 0; ys[0] = 0;
    for (let i = 1; i < n; i++) {
      const s = rh[i - 1] + rh[i];
      const tries = beta === 90 ? [90] : [i % 2 ? beta : 180 - beta, beta, 90];
      let ok = false;
      for (const a of tries) {
        const x = xs[i - 1] + s * cos(a * DEG), y = ys[i - 1] + s * sin(a * DEG);
        let clear = true;
        for (let j = 0; j < i - 1 && clear; j++) if (hypot(xs[j] - x, ys[j] - y) < rh[j] + rh[i] - 1e-9) clear = false;
        if (clear) { xs[i] = x; ys[i] = y; ok = true; break; }
      }
      if (!ok) { let top = -INF; for (let j = 0; j < i; j++) top = max(top, ys[j] + rh[j]); xs[i] = xs[i - 1]; ys[i] = top + rh[i]; }
    }
    return { xs, ys };
  }

  /* a row: members slid along the row line (tilt a) until each clears the ones before it; plain
     regular neighbours keep a centre pitch s (2 = touching, more = honeycomb). A fold puts a row
     of plain buttons on two lines, neighbours touching diagonally. */
  function rowShape(R, a, b, an, k, s, fold) {
    const key = R.sig + '#' + a + '#' + (R.stack ? b + an : '') + '#' + (R.big ? k : '') + '#' + s + '#' + (fold ? 'f' : '');
    let sh = SHAPES.get(key);
    if (sh) return sh;
    sh = buildRow(R, a, b, an, k, s, fold);
    sh.key = key;
    SHAPES.set(key, sh);
    return sh;
  }
  function buildRow(R, a, b, an, k, s, fold) {
    const n = R.n, nm = R.nm;
    const xs = new F64(n), ys = new F64(n), rs = new F64(n), plain = new U8(n);
    const mmx = new F64(nm), mmy = new F64(nm);
    let c = 0;
    {
      // a fold lifts every other member onto a second line (sqrt(3) up: plain neighbours touch
      // diagonally, members still run left to right); the slide below does the rest
      const ca = cos(a * DEG), sa = sin(a * DEG);
      const ms = R.mem.map(mem => { const rh = mem.map(x => kScaled(x, k)); return { rh, m: memberShape(rh, b) }; });
      // 'm' (a shelf): a stack sinks until its bottom button's lower edge is level with the lower edge of
      // the row's biggest single button (never lower, and never below its own centroid anchoring)
      if (an === 'm') {
        let shelf = 0;
        for (const { rh } of ms) if (rh.length === 1 && rh[0] > shelf) shelf = rh[0];
        for (const { rh, m } of ms) if (rh.length > 1) {
          let my = 0; for (let i = 0; i < rh.length; i++) my += m.ys[i];
          const sink = max(0, min(my / rh.length, max(0, shelf - rh[0]) + CFG.shelfTol));
          for (let i = 0; i < rh.length; i++) m.ys[i] -= sink;
        }
      } else if (an === 'c') {
        // 'c' (only for boxes too small for a good board): every stack centred on the row line
        for (const { rh, m } of ms) if (rh.length > 1) {
          let my = 0; for (let i = 0; i < rh.length; i++) my += m.ys[i];
          for (let i = 0; i < rh.length; i++) m.ys[i] -= my / rh.length;
        }
      }
      let lift = SQ3;                                   // the fold's second line clears the tallest stack
      if (fold) for (const { m } of ms) { let lo = INF, hi = -INF; for (const y of m.ys) { if (y < lo) lo = y; if (y > hi) hi = y; } if (SQ3 + hi - lo > lift) lift = SQ3 + hi - lo; }
      let tPrev = 0, prevMX = 0;
      for (let j = 0; j < nm; j++) {
        const { rh, m } = ms[j];
        if (fold && (j & 1)) for (let i = 0; i < rh.length; i++) m.ys[i] += lift;
        const pl = rh.length === 1 && rh[0] === 1;
        let mx = 0, my = 0; for (let i = 0; i < rh.length; i++) { mx += m.xs[i]; my += m.ys[i]; }
        mx /= rh.length; my /= rh.length;
        let t = 0;
        if (j) {
          t = max(tPrev + CFG.minStep, (prevMX + CFG.orderGap - mx) / ca);
          for (let guard = 0; guard < 200; guard++) {
            let moved = false;
            for (let i = 0; i < rh.length; i++) for (let q = 0; q < c; q++) {
              const need = pl && (plain[q] & 1) ? s : rh[i] + rs[q];
              const vx = m.xs[i] - xs[q], vy = m.ys[i] - ys[q];
              const bb = vx * ca + vy * sa, disc = bb * bb - (vx * vx + vy * vy - need * need);
              if (disc <= 0) continue;
              const sq = sqrt(disc), t1 = -bb - sq, t2 = -bb + sq;
              if (t > t1 + 1e-9 && t < t2 - 1e-9) { t = t2 + 1e-9; moved = true; }
            }
            if (!moved) break;
          }
        }
        for (let i = 0; i < rh.length; i++) { xs[c] = m.xs[i] + t * ca; ys[c] = m.ys[i] + t * sa; rs[c] = rh[i]; plain[c] = (pl ? 1 : 0) | (rh.length === 1 ? 2 : 0); c++; }
        mmx[j] = mx + t * ca; mmy[j] = my + t * sa;
        tPrev = t; prevMX = mmx[j];
      }
    }
    return finishShape(xs, ys, rs, plain, mmy, nm);
  }
  function allOnes(a) { for (let i = 0; i < a.length; i++) if (!(a[i] & 1)) return false; return true; }   // every member a plain regular button
  const BETA_ALL = [60, 90, 35, 20, 30];   // stack angles (20 / 30: a stack running along a 20 / 30 deg row)
  let PRUNED_H = false;                    // the last pruned variant was cut by its height
  function finishShape(xs, ys, rs, plain, mmy, nm) {
    const n = xs.length;
    let x0 = INF, x1 = -INF, y0 = INF, y1 = -INF, big = false, sw = 0, swx = 0;
    for (let i = 0; i < n; i++) {
      if (xs[i] - rs[i] < x0) x0 = xs[i] - rs[i];
      if (xs[i] + rs[i] > x1) x1 = xs[i] + rs[i];
      if (ys[i] - rs[i] < y0) y0 = ys[i] - rs[i];
      if (ys[i] + rs[i] > y1) y1 = ys[i] + rs[i];
      if (rs[i] > 1.001) big = true;
    }
    const cx = (x0 + x1) / 2;
    for (let i = 0; i < n; i++) { xs[i] -= cx; sw += rs[i] * rs[i]; swx += rs[i] * rs[i] * xs[i]; }
    let meanY = 0; for (let j = 0; j < nm; j++) meanY += mmy[j];
    meanY /= nm;
    let singles = false; for (let i = 0; i < n; i++) if (plain[i] & 2) singles = true;
    return { sid: ++SID, dc: null, singles, n, x: xs, y: ys, r: rs, plain, x0: x0 - cx, x1: x1 - cx, y0, y1, meanLo: meanY, meanHi: meanY, big, stack: nm < n, nm, allPlain: allOnes(plain), sw, swx };
  }
  /* wide melody boxes: two consecutive rows on one line, the right one stepped up a little */
  function pairLine(L, R) {
    const key = L.key + '+' + R.key;
    let sh = SHAPES.get(key);
    if (sh) return sh;
    const dyR = L.meanLo + CFG.pairStep - R.meanLo;
    let X = -INF;
    for (let i = 0; i < R.n; i++) for (let j = 0; j < L.n; j++) {
      const s = R.r[i] + L.r[j] + CFG.pairGap, dy = R.y[i] + dyR - L.y[j];
      const need = abs(dy) < s ? L.x[j] - R.x[i] + sqrt(s * s - dy * dy) : L.x[j] - R.x[i];
      if (need > X) X = need;
    }
    const n = L.n + R.n;
    const xs = new F64(n), ys = new F64(n), rs = new F64(n), pl = new U8(n);
    for (let i = 0; i < L.n; i++) { xs[i] = L.x[i]; ys[i] = L.y[i]; rs[i] = L.r[i]; pl[i] = L.plain[i]; }
    for (let i = 0; i < R.n; i++) { xs[L.n + i] = R.x[i] + X; ys[L.n + i] = R.y[i] + dyR; rs[L.n + i] = R.r[i]; pl[L.n + i] = R.plain[i]; }
    sh = finishShape(xs, ys, rs, pl, [L.meanLo], 1);
    sh.meanLo = L.meanLo; sh.meanHi = L.meanLo + CFG.pairStep; sh.key = key;
    SHAPES.set(key, sh);
    return sh;
  }

  /* ---------- stacking: rows dropped bottom to top into the dimples of the rows below ----------
     Row k may shift sideways from row k-1 by a quarter or half pitch (up to a pitch beside a big
     button). A small beam keeps the few best partial boards, ranked by the size of the bounding box
     for the box's aspect A, then (as tie-breakers) height, balance and a symmetric stagger. A row
     must rest on the row below it and overlap it sideways; rows climb. Scratch typed arrays keep
     this allocation-free (it runs dozens of times per call). */
  let SX = new F64(64), SY = new F64(64), NX = new F64(64), NY = new F64(64);
  const ST = { x0: new F64(4), x1: new F64(4), y1: new F64(4), dr: new F64(4), sw: new F64(4), swx: new F64(4), sg: new F64(4), sq: new F64(4), cost: new F64(4) };
  const NS = { x0: new F64(4), x1: new F64(4), y1: new F64(4), dr: new F64(4), sw: new F64(4), swx: new F64(4), sg: new F64(4), sq: new F64(4), cost: new F64(4) };
  const CH = { p: new I32(64), X: new F64(64), Y: new F64(64), x0: new F64(64), x1: new F64(64), y1: new F64(64), dr: new F64(64), sw: new F64(64), swx: new F64(64), sg: new F64(64), sq: new F64(64), cost: new F64(64), bad: new U8(64) };
  const DSH = [-2, 2], DSH0 = [0, -4, 4];
  function ensure(m) {
    if (SX.length < m) { const z = m * 2; SX = new F64(z); SY = new F64(z); NX = new F64(z); NY = new F64(z); }
  }
  let HF = new F64(16);
  const RES = { X: null, Y: null, x0: 0, x1: 0, y1: 0, bad: 0, sq: 0, q: 1 };
  const ONE = [0];
  let LB = new F64(48);
  function stackLines(lines, A, pitch, alpha, calm, B, forced, wMax, hMax) {
    // wMax / hMax: a partial board wider or taller than this can no longer compete (its box only grows as
    // rows are added), so that child is dropped; when no child is left the variant is abandoned (null)
    // (hot: runs dozens of times per call, and the first calls run before the JIT has warmed up,
    // so config values, scratch arrays and per-line data are read into locals once)
    const climb = CFG.climb, overlap = CFG.overlap, lambda = CFG.lambda, align = CFG.align, squareW = CFG.squareW;
    const cP = CH.p, cX = CH.X, cY = CH.Y, cx0 = CH.x0, cx1 = CH.x1, cy1 = CH.y1, cdr = CH.dr, csw = CH.sw, cswx = CH.swx, csg = CH.sg, csq = CH.sq, ccost = CH.cost, cbad = CH.bad;
    // the shift quantum: a quarter of the pitch as the row runs across (so 30 deg rows keep columns)
    const NL = lines.length, q = pitch * (alpha <= 30 ? cos(alpha * DEG) : 1) / 4, TB = 1e-3, honey = pitch > 2;
    ensure(B * NL + 4);
    const ca = cos(alpha * DEG), sa = sin(alpha * DEG);
    let NT = 0; for (let k = 0; k < NL; k++) NT += lines[k].n;
    // each line's extent (x0, x1, y1), for the quick rejections in the drop
    if (LB.length < 3 * NL) LB = new F64(6 * NL);
    for (let k = 0; k < NL; k++) { const l = lines[k]; LB[3 * k] = l.x0; LB[3 * k + 1] = l.x1; LB[3 * k + 2] = l.y1; }
    // the height the rows still to come will need at least (nested rows rise ~0.87 of their height),
    // so an early row is not judged by its width alone
    if (HF.length < NL + 1) HF = new F64(2 * NL + 2);
    HF[NL - 1] = 0;
    for (let k = NL - 2; k >= 0; k--) HF[k] = HF[k + 1] + CFG.futureH * (lines[k + 1].y1 - lines[k + 1].y0);
    const L0 = lines[0];
    if (L0.x1 - L0.x0 > wMax || L0.y1 - L0.y0 > hMax) { ABORT_W = L0.x1 - L0.x0 > wMax; return null; }
    let skipW = 0;
    let ns = 1;
    SX[0] = 0; SY[0] = -L0.y0;
    ST.x0[0] = L0.x0; ST.x1[0] = L0.x1; ST.y1[0] = L0.y1 - L0.y0; ST.dr[0] = 0; ST.sw[0] = L0.sw; ST.swx[0] = L0.swx; ST.sg[0] = 0; ST.sq[0] = 0; ST.cost[0] = 0;
    let anyBad = 0;
    const sqOn = !calm && squareW > 0, rg = CFG.restGap + 1e-9;
    const lat = alpha === 0 || alpha === 30;
    for (let k = 1; k < NL; k++) {
      const sh = lines[k], pv = lines[k - 1];
      const shx = sh.x, shy = sh.y, shr = sh.r, shn = sh.n, shPl = sh.plain, pvx = pv.x, pvy = pv.y, pvr = pv.r, pvn = pv.n, pvPl = pv.plain;
      const shx0 = sh.x0, shx1 = sh.x1, shy0 = sh.y0, shy1 = sh.y1, shLo = sh.meanLo, shSw = sh.sw, shSwx = sh.swx, pvx0 = pv.x0, pvx1 = pv.x1;
      const ovMin = min(overlap, shx1 - shx0, pvx1 - pvx0) - 1e-9, hfk = HF[k];
      const sx0 = ST.x0, sx1 = ST.x1, sy1 = ST.y1, sdr = ST.dr, ssw = ST.sw, sswx = ST.swx, ssg = ST.sg, ssq = ST.sq;
      // honeycomb rows of plain buttons always drop half a pitch over, into the gaps
      // (rows of plain buttons are centred, so rows of the same parity interleave at half a pitch)
      // on the lattice angles (0 and 30 deg) plain rows shift by whole half-pitches only, so they
      // keep hex nesting / garmon columns instead of drifting a quarter button
      const plainPair = pv.allPlain && sh.allPlain, sqPair = sqOn && sh.singles && pv.singles;
      const ds = forced ? ONE : !calm && (pv.big || sh.big) ? (lat ? CFG.dsBigLat : CFG.dsBig) : honey && plainPair ? ((sh.nm - pv.nm) % 2 ? DSH0 : DSH) :
        plainPair && lat ? (sh.nm === pv.nm && sh.nm > 1 ? CFG.dsPlainSame : CFG.dsPlain) : lat ? CFG.dsLat : CFG.ds;
      const nds = ds.length;
      let nc = 0;
      for (let s = 0; s < ns; s++) {
        const base = s * NL, Xp = SX[base + k - 1], Yp = SY[base + k - 1];
        const prevHi = pv.meanHi + Yp;
        for (let di = 0; di < nds; di++) {
          const X = forced ? forced[k] * q : Xp + ds[di] * q;
          const x0 = min(sx0[s], shx0 + X), x1 = max(sx1[s], shx1 + X);
          if (x1 - x0 > wMax) { skipW = 1; continue; }
          // drop: the lowest height that clears the floor and every placed circle, and climbs (rows
          // climb: starting from that height lets the rows wholly below be skipped)
          let y = max(-shy0, prevHi + climb - shLo);
          if (y + shy1 > hMax) continue;
          WORK++;
          for (let r = k - 1; r >= 0; r--) {
            const Xr = SX[base + r], Yr = SY[base + r];
            if (Yr + LB[3 * r + 2] <= y + shy0) continue;       // that row lies wholly below the new row
            if (shx1 + X <= LB[3 * r] + Xr || shx0 + X >= LB[3 * r + 1] + Xr) continue;   // or wholly beside it
            const v = Yr + dropOn(sh, lines[r], round((X - Xr) / q), q);
            if (v > y) y = v;
          }
          // tidiness: rest on the row below, overlap it sideways
          const ov = min(shx1 + X, pvx1 + Xp) - max(shx0 + X, pvx0 + Xp);
          // one pass over the pairs with the row below: does the new row rest on it (a button within
          // restGap of one below), and does a single button sit straight on top of an equal one
          // (square packing, not the accordion's diagonal nesting)?
          const wide = ov < ovMin;
          const mp = round((X - Xp) / q);
          const rest = y - Yp <= restOn(sh, pv, mp, q) + 1e-9 ? 1 : 0;
          let sqc = ssq[s];
          if (rest && sqPair) for (let i = 0; i < shn; i++) {
            if (!(shPl[i] & 2)) continue;
            const cx = shx[i] + X - Xp, cy = shy[i] + y - Yp, ri = shr[i];
            for (let j = 0; j < pvn; j++) {
              if (!(pvPl[j] & 2) || abs(pvr[j] - ri) > 0.01) continue;
              const dx = cx - pvx[j], dy = cy - pvy[j], d2 = dx * dx + dy * dy;
              if (d2 < (2 * ri + 0.2) * (2 * ri + 0.2) && abs(dx * ca + dy * sa) < 0.15 * ri) sqc++;
            }
          }
          const bad = wide || !rest ? 1 : 0;
          const y1 = max(sy1[s], shy1 + y);
          if (y1 > hMax) continue;
          let drift = max(sdr[s], lambda * max(0, 2 * abs(X) / pitch - 0.5));
          // repeated rows line up: the nearest match among earlier (non-adjacent) rows of the same shape
          let mis = INF;
          for (let j = k - 2; j >= 0; j--) if (lines[j] === sh) { const m = abs(X - SX[base + j]); if (m < mis) mis = m; }
          if (mis !== INF) drift += align * 2 * mis / pitch;
          const sw = ssw[s] + shSw, swx = sswx[s] + shSwx + shSw * X;
          const bal = abs(swx / sw - (x0 + x1) / 2);
          const dd = ds[di], sg = dd === 0 ? 0 : dd > 0 ? 1 : -1;
          const same = sg !== 0 && sg === ssg[s] ? 1 : 0;
          const E = max(x1 - x0, (y1 + hfk) * A);
          const cost = E * (1 + drift + squareW * sqc / NT) + TB * (y1 + 0.5 * (x1 - x0) + 2 * bal + abs(X) + same);
          cP[nc] = s; cX[nc] = X; cY[nc] = y; cx0[nc] = x0; cx1[nc] = x1; cy1[nc] = y1; cdr[nc] = drift;
          csw[nc] = sw; cswx[nc] = swx; csg[nc] = sg; csq[nc] = sqc; ccost[nc] = cost; cbad[nc] = bad;
          nc++;
        }
      }
      if (!nc) { ABORT_W = !!skipW; return null; }
      // keep the B best children, well-formed ones first
      let nn = 0;
      const taken = TAKEN; for (let i = 0; i < nc; i++) taken[i] = 0;
      const nx0 = NS.x0, nx1 = NS.x1, ny1 = NS.y1, ndr = NS.dr, nsw = NS.sw, nswx = NS.swx, nsg = NS.sg, nsq = NS.sq, ncost = NS.cost;
      for (let pick = 0; pick < B; pick++) {
        let bi = -1;
        for (let i = 0; i < nc; i++) {
          if (taken[i]) continue;
          if (bi < 0 || cbad[i] < cbad[bi] || (cbad[i] === cbad[bi] && ccost[i] < ccost[bi] - 1e-12)) bi = i;
        }
        if (bi < 0) break;
        if (pick > 0 && cbad[bi]) break;
        taken[bi] = 1;
        const p = cP[bi], ob = p * NL, nb = nn * NL;
        for (let r = 0; r < k; r++) { NX[nb + r] = SX[ob + r]; NY[nb + r] = SY[ob + r]; }
        NX[nb + k] = cX[bi]; NY[nb + k] = cY[bi];
        nx0[nn] = cx0[bi]; nx1[nn] = cx1[bi]; ny1[nn] = cy1[bi]; ndr[nn] = cdr[bi];
        nsw[nn] = csw[bi]; nswx[nn] = cswx[bi]; nsg[nn] = csg[bi]; nsq[nn] = csq[bi]; ncost[nn] = ccost[bi];
        if (pick === 0 && cbad[bi]) anyBad = 1;
        nn++;
      }
      let t = SX; SX = NX; NX = t; t = SY; SY = NY; NY = t;
      let a = ST.x0; ST.x0 = NS.x0; NS.x0 = a; a = ST.x1; ST.x1 = NS.x1; NS.x1 = a; a = ST.y1; ST.y1 = NS.y1; NS.y1 = a; a = ST.dr; ST.dr = NS.dr; NS.dr = a;
      a = ST.sw; ST.sw = NS.sw; NS.sw = a; a = ST.swx; ST.swx = NS.swx; NS.swx = a; a = ST.sg; ST.sg = NS.sg; NS.sg = a; a = ST.sq; ST.sq = NS.sq; NS.sq = a; a = ST.cost; ST.cost = NS.cost; NS.cost = a;
      ns = nn;
    }
    // state 0 is the best (children were picked best first)
    RES.q = q;
    RES.X = SX; RES.Y = SY; RES.x0 = ST.x0[0]; RES.x1 = ST.x1[0]; RES.y1 = ST.y1[0]; RES.bad = anyBad; RES.sq = ST.sq[0];
    return RES;
  }
  const TAKEN = new U8(64);
  /* how high line `sh` must sit above line `lr` (their row origins) when it is shifted m quanta sideways
     from it: a pure function of the two shapes and m (all row shifts are whole quanta), so it is kept on
     the shape and shared by beam states, tab placements and later calls (a resize reuses it all) */
  function dropOn(sh, lr, m, q) {
    const key = lr.sid * 1024 + m + 512;
    let dc = sh.dc;
    if (m > -512 && m < 512) { if (!dc) dc = sh.dc = new MapC(); const d = dc.get(key); if (d !== undefined) return d; }
    DROPS++;
    const X = m * q, shx = sh.x, shy = sh.y, shr = sh.r, shn = sh.n, lx = lr.x, ly = lr.y, lrr = lr.r, ln = lr.n;
    let D = -INF;
    for (let i = 0; i < shn; i++) {
      const cx = shx[i] + X, ci = shr[i], cy = shy[i];
      for (let j = 0; j < ln; j++) {
        const dx = cx - lx[j], ss = ci + lrr[j];
        if (dx < ss && dx > -ss) { const v = ly[j] - cy + sqrt(ss * ss - dx * dx); if (v > D) D = v; }
      }
    }
    if (m > -512 && m < 512) dc.set(key, D);
    return D;
  }
  /* the same for resting: the highest the line may sit and still have a button within restGap of one in
     the line below */
  function restOn(sh, pv, m, q) {
    const key = pv.sid * 1024 + m + 512 + 500000000;
    let dc = sh.dc;
    if (m > -512 && m < 512) { if (!dc) dc = sh.dc = new MapC(); const d = dc.get(key); if (d !== undefined) return d; }
    const X = m * q, rg = CFG.restGap, shx = sh.x, shy = sh.y, shr = sh.r, shn = sh.n, lx = pv.x, ly = pv.y, lrr = pv.r, ln = pv.n;
    let D = -INF;
    for (let i = 0; i < shn; i++) {
      const cx = shx[i] + X, cy = shy[i], ci = shr[i] + rg;
      for (let j = 0; j < ln; j++) {
        const dx = cx - lx[j], ss = ci + lrr[j];
        if (dx <= ss && dx >= -ss) { const v = ly[j] - cy + sqrt(ss * ss - dx * dx); if (v > D) D = v; }
      }
    }
    if (m > -512 && m < 512) dc.set(key, D);
    return D;
  }
  let DROPS = 0, SID = 0;                  // (tests: pair drops computed; shape ids)
  let WORK = 0;                            // row drops computed (tests: work counter)
  let ABORT_W = false;                     // the last abandoned board had grown too wide (else too tall)

  /* repeated rows (the same shape, e.g. every Fa So La row) should stand in one column: how many
     rows sit off the column of every earlier row of their shape */
  function misaligned(lines, X) {
    let m = 0;
    for (let k = 2; k < lines.length; k++) {
      let seen = false, off = true;
      for (let j = k - 2; j >= 0 && off; j--) if (lines[j] === lines[k]) { seen = true; if (abs(X[k] - X[j]) < 1e-6) off = false; }
      if (seen && off) m++;
    }
    return m;
  }
  /* the look of a finished board, in one pass over the pairs of buttons that are close:
     mess     pairs that ALMOST touch read as a scatter (a lattice has neighbours that touch and others
              clearly apart): mean awkwardness per button;
     isolated buttons that touch nothing (no neighbour within 0.3 pitch): a scatter, not a board;
     grid     buttons standing straight above one in the next line down with a gap between (a square,
              calculator-keypad grid instead of the accordion's diagonal nesting). */
  let MX = new F64(64), MY = new F64(64), MR = new F64(64), MG = new F64(64), ML = new I32(64);
  const LOOK = { mess: 0, iso: 0, grid: 0 };
  let MO = new I32(64);
  function lookOf(lines, X, Y) {
    let n = 0;
    for (let k = 0; k < lines.length; k++) n += lines[k].n;
    if (MX.length < n) { MX = new F64(n * 2); MY = new F64(n * 2); MR = new F64(n * 2); MG = new F64(n * 2); ML = new I32(n * 2); }
    n = 0;
    for (let k = 0; k < lines.length; k++) { const l = lines[k]; for (let i = 0; i < l.n; i++) { MX[n] = l.x[i] + X[k]; MY[n] = l.y[i] + Y[k]; MR[n] = l.r[i]; MG[n] = INF; ML[n] = k; n++; } }
    let w = 0, grid = 0, rmax = 0;
    for (let i = 0; i < n; i++) if (MR[i] > rmax) rmax = MR[i];
    // (big towers: buttons taken in order of x, so only neighbours in x are paired)
    const big = n > 40;
    if (big) { if (MO.length < n) MO = new I32(n * 2); for (let i = 0; i < n; i++) MO[i] = i; MO.subarray(0, n).sort((a, b) => MX[a] - MX[b] || a - b); }
    const reach = 2 * rmax + 1.6;
    for (let ii = 0; ii < n; ii++) for (let jj = ii + 1; jj < n; jj++) {
      const i = big ? MO[ii] : ii, j = big ? MO[jj] : jj;
      if (big && MX[j] - MX[i] > reach) break;
      const dx = MX[i] - MX[j], dy = MY[i] - MY[j], s = MR[i] + MR[j];
      if (dx > s + 1.6 || dx < -s - 1.6 || dy > s + 1.6 || dy < -s - 1.6) continue;
      const g = sqrt(dx * dx + dy * dy) - s;
      if (g < MG[i]) MG[i] = g;
      if (g < MG[j]) MG[j] = g;
      if (g > 0.06 && g < 0.8) w += g < 0.3 ? (g - 0.06) / 0.24 : (0.8 - g) / 0.5;
      if (g >= 0.3 && g < 1.6 && dx < 0.4 && dx > -0.4 && (dy > 1.8 || dy < -1.8) && (ML[i] - ML[j] === 1 || ML[j] - ML[i] === 1)) {
        const lo = min(MY[i], MY[j]) + 0.4, hi = max(MY[i], MY[j]) - 0.4, mx = (MX[i] + MX[j]) / 2;
        let between = false;
        for (let c = 0; c < n && !between; c++) if (c !== i && c !== j && MY[c] > lo && MY[c] < hi && abs(MX[c] - mx) < 1.5) between = true;
        if (!between) grid++;
      }
    }
    let iso = 0;
    if (n > 1) for (let i = 0; i < n; i++) if (MG[i] > 0.6) iso++;
    LOOK.mess = w / max(1, n); LOOK.iso = iso; LOOK.grid = grid / max(1, n);
    return LOOK;
  }

  /* ---------- the packer ---------- */
  function packRound(input) {
    const WORK0 = WORK;
    // caches are evicted only here, between calls: within a call every row shape is one object, so
    // repeated rows (Fa So La) are recognised by identity
    if (SHAPES.size > CFG.shapeCap || SID > 400000) { SHAPES.clear(); STRUCTS.forEach(x => x.lc.clear()); SID = 0; }
    const W = min(1e5, max(0, +input.W || 0)), H = min(1e5, max(0, +input.H || 0));   // (a non-finite box is capped: no NaN)
    const RING = input.RING != null ? +input.RING : 4, GAP = input.MIN_GAP != null ? +input.MIN_GAP : 2;
    const nMods = max(0, (input.mods && +input.mods.count) || 0);
    const melody = input.side === 'melody';
    const TG = max(4, min(6, min(W, H) / 50));      // air between tabs and buttons
    const trace = input.trace || null;                                // tests only: an array that collects every variant tried

    // where the tabs can go, searched at their minimum strip
    const places = [];
    if (!nMods) places.push({ pl: 'none', aw: W, ah: H });
    else {
      if (H >= 40 * nMods) places.push({ pl: 'side', aw: W - CFG.tabMin - TG, ah: H });
      if (W >= 44 * nMods) places.push({ pl: 'bottom', aw: W, ah: H - CFG.tabMin - TG });
      if (!places.length) places.push({ pl: 'side', aw: W - CFG.tabMin - TG, ah: H });
    }
    places.forEach(P => { P.aw = max(1, P.aw); P.ah = max(1, P.ah); P.A = P.aw / P.ah; });

    const { S, ids } = prep(input);
    if (!S.rows.length) {
      const P = places[0];
      return { circles: [], mods: P.pl === 'none' ? { placement: 'none' } : { placement: P.pl, rect: P.pl === 'side' ? { x: W - CFG.tabMin, y: 0, w: CFG.tabMin, h: H } : { x: 0, y: H - CFG.tabMin, w: W, h: CFG.tabMin } }, variant: undefined };
    }
    const NR = S.rows.length;
    // row shifts: greedy (beam 1) for a first pass over the variants, then the full beam (1 for
    // towers above 40 buttons) for every variant within refineCut of the best
    const heavy = S.n > CFG.heavy;
    const BS = CFG.screenBeam, BF = heavy ? 1 : CFG.beam, TWO = BF > BS;
    // how many of the best variants each later stage starts from (fewer for very big towers)
    // (the tonic chord I, 1.75x, binds more often than the tonic note Do: more variants get other sizes)
    let kmax = 1; for (const x of S.kaps) if (x > kmax) kmax = x;
    const nFold = heavy ? 2 : CFG.foldTop, nK = heavy ? 1 : kmax >= 1.6 ? CFG.kTopBig : CFG.kTop;

    /* a variant's lines depend on the structure only, so they are kept on it (numeric code, no strings) */
    function codeOf(v) {
      const ai = CFG.alphas.indexOf(v.a), bi = BETA_ALL.indexOf(v.b), ki = v.k === 1 ? 0 : 1 + CFG.kmuls.indexOf(v.k), si = v.s === 2 ? 0 : 1 + CFG.spreads.indexOf(v.s);
      return (((((ai * 5 + bi) * 3 + (v.an === 'm' ? 1 : v.an === 'c' ? 2 : 0)) * 5 + ki) * 5 + si) * 3 + v.pr) + 16384 * (v.f || 0);
    }
    const PLI = { none: 0, side: 1, bottom: 2 };
    function linesOf(v, code) {
      let lines = S.lc.get(code);
      if (!lines) { lines = buildLines(v); if (S.lc.size > 400) S.lc.clear(); S.lc.set(code, lines); }
      return lines;
    }
    function buildLines(v) {
      const shapes = new Arr(NR);
      for (let i = 0; i < NR; i++) shapes[i] = rowShape(S.rows[i], v.a, v.b, v.an, v.k, v.s, !!(v.f && (v.f & (1 << i))) && S.rows[i].foldable);
      if (!v.pr) return shapes;
      const lines = [];
      let i = 0;
      if (v.pr === 2) lines.push(shapes[i++]);
      for (; i < NR; i += 2) lines.push(i + 1 < NR ? pairLine(shapes[i], shapes[i + 1]) : shapes[i]);
      return lines;
    }
    function bonusOf(v) {
      if (tiny) return 1;
      const Bn = CFG.bonus;
      let b = 1 + (v.a === 0 ? Bn.a0 : v.a === 30 ? Bn.a30 : v.a === 60 ? Bn.a60 : v.a === 80 ? Bn.a80 : 0) + (S.hasStack && v.b === 60 ? Bn.b60 : 0) + (v.b === v.a && v.a < 30 ? Bn.along || 0 : 0) +
        (S.hasBig ? (v.k === 1 ? Bn.kFull : v.k === 0.85 ? Bn.k85 : v.k === 0.72 ? Bn.k72 : 0) : 0);
      if (v.s !== 2) b /= CFG.spreadGate;
      if (v.pr) b /= melody ? CFG.pairGate : CFG.chordPairGate;
      if (v.a >= CFG.wideTiltMin) { const P = places.find(p => p.pl === v.pl); if (P && P.A >= CFG.wideAspect) b /= CFG.wideTilt; }
      if (v.f) b /= CFG.foldGate;
      return b;
    }
    function keyOf(v) { return [v.pl, v.a, v.b, v.an, v.k, +v.s.toFixed(3), v.pr, v.f].join('|'); }

    let best = null, nEval = 0, nPruned = 0, nFine = 0, nAbort = 0, tiny = false;
    const faceOf = e => 2 * (e.u - CFG.safety) - 2 * RING - GAP;
    const CUT = 1 - CFG.hyst;                 // a variant below CUT x the best can never be chosen (see near below)
    /* every variant tried in this call, with the best layout found for it (greedy row shifts, or the full
       beam: fine). An entry keeps its layout and its look terms only while it could still be chosen. */
    const seen = new MapC();
    /* evaluate one variant: build, stack, scale in closed form.
         fine    the full beam for the row shifts (else greedy);  forced: exact row shifts (xq, tests / prev);
         prune   give up as soon as the variant cannot come within CUT of the best so far;
         compete let it become the best (paired lines: only through the phase rule).
       The look terms (they can only lower a score) are computed only when the variant could be chosen. */
    function evalV(v, fine, forced, prune, compete, full) {
      const code = codeOf(v), sk = code * 4 + PLI[v.pl];
      fine = !!fine || !TWO;
      const o = forced ? null : seen.get(sk);
      if (o && (o.fine || !fine) && !(full && !o.lines)) return o.ab ? null : done(o, compete);
      let P = places[0]; for (let i = 1; i < places.length; i++) if (places[i].pl === v.pl) P = places[i];
      const lines = linesOf(v, code);
      // the board may not grow past wMax x hMax (units): no layout is narrower than its widest line or
      // lower than its tallest one, and a partial board only grows as rows are added
      let wMax = INF, hMax = INF;
      if (prune && best) {
        const uMin = !tiny && faceOf(best) < 1.3 * CFG.tinyFace ? best.u * CUT * 0.9 : best.score * CUT / bonusOf(v);
        wMax = (P.aw + GAP) / uMin; hMax = (P.ah + GAP) / uMin;
        let mw = 0, mh = 0;
        for (let i = 0; i < lines.length; i++) { const l = lines[i]; if (l.x1 - l.x0 > mw) mw = l.x1 - l.x0; if (l.y1 - l.y0 > mh) mh = l.y1 - l.y0; }
        if (mw > wMax || mh > hMax) { nPruned++; PRUNED_H = mh > hMax; return null; }
      }
      nEval++; if (fine && TWO) nFine++;
      const L = stackLines(lines, P.A, v.s, v.a, !!v.pr, forced ? 1 : fine ? BF : BS, forced, wMax, hMax);
      let e;
      if (!L) {
        nAbort++; PRUNED_H = !ABORT_W;
        e = { v, sk, ab: true, abW: ABORT_W, fine, u: 0, bon: 1, raw: 0, score: 0, hb: !ABORT_W, lines: null };
        if (trace) trace.push([keyOf(v), 0, 0, ABORT_W ? 'W' : 'H', '', 'ABORT', '', '', '', '', fine ? 'F' : 'G']);
        if (o) { o.fine = true; return o.ab ? null : done(o, compete); }   // the greedy layout stands
        if (!forced) seen.set(sk, e);
        return null;
      }
      const Wb = L.x1 - L.x0, Hb = L.y1;
      const u = min((P.aw + GAP) / Wb, (P.ah + GAP) / Hb);
      const bon = bonusOf(v), raw = u * bon * (1 - CFG.squareW * L.sq / S.n);
      e = { v, sk, fine, u, bon, raw, score: raw, Wb, Hb, hb: Hb * P.A >= Wb, bad: L.bad, sq: L.sq, mess: -1, iso: 0, grid: 0, mis: 0, lines: null, X: null, Y: null, x0: 0, q: 1 };
      if (forced || full || !best || raw >= best.score * CUT) {
        const lk = lookOf(lines, L.X, L.Y);
        e.mess = lk.mess; e.iso = lk.iso; e.grid = lk.grid;
        e.mis = misaligned(lines, L.X);
        e.score = raw * (1 - CFG.messW * min(e.mess, 2)) * (1 - CFG.alignW * e.mis) * (e.bad ? CFG.badW : 1) *   // a row that cannot rest on (and overlap) the one below
          (1 - CFG.isoW * min(e.iso, 4)) * (1 - CFG.gridW * min(e.grid, 1));
        if (forced || full || !best || e.score >= best.score * CUT) {
          const nl = lines.length, EX = new Arr(nl), EY = new Arr(nl);
          for (let i = 0; i < nl; i++) { EX[i] = L.X[i]; EY[i] = L.Y[i]; }
          e.lines = lines; e.X = EX; e.Y = EY; e.x0 = L.x0; e.q = L.q;
        }
      }
      if (trace) trace.push([keyOf(v), +(2 * u - 10).toFixed(1), +e.score.toFixed(2), e.hb ? 'H' : 'W', e.mess >= 0 ? +e.mess.toFixed(2) : '', e.bad ? 'BAD' : '', e.sq ? 'SQ' + e.sq : '', 'iso' + e.iso, 'grid' + e.grid.toFixed(2), 'mis' + e.mis, forced ? 'X' : fine ? 'F' : 'G']);
      if (forced) return e;
      if (o && !o.ab && o.lines && o.score >= e.score) { o.fine = true; return done(o, compete); }   // the greedy layout was better
      seen.set(sk, e);
      return done(e, compete);
    }
    function done(e, compete) {
      if (compete !== false && e.lines && (!best || e.score > best.score + 1e-9)) best = e;
      return e;
    }

    /* fold the widest foldable row that is still flat (all of them when several are equally wide),
       then the next, while the width binds; a fold that does not help on its own may still help
       with the next one (two long rows) */
    function foldFrom(e, v) {
      let hb = e.hb, top = e.raw, mask = 0;
      for (let guard = 0; guard < NR && !hb; guard++) {
        let ww = -1, add = 0;
        for (let i = 0; i < NR && i < 31; i++) {
          if (!S.rows[i].foldable || (mask & (1 << i))) continue;
          const w = rowShape(S.rows[i], 0, v.b, v.an, 1, 2, false), wd = w.x1 - w.x0;
          if (wd > ww + 1e-6) { ww = wd; add = 1 << i; } else if (wd > ww - 1e-6) add |= 1 << i;
        }
        if (!add) break;
        mask |= add;
        let cur = evalV(assign({}, v, { f: mask }), true, null, true);
        // (a folded row changes which anchoring of the stacks nests best: both are tried)
        if (S.shelf) { const alt = evalV(assign({}, v, { f: mask, an: v.an === 'b' ? 'm' : 'b' }), true, null, true); if (alt && (!cur || alt.raw > cur.raw)) cur = alt; }
        if (!cur) { if (PRUNED_H) break; continue; }   // given up: too tall (more folds only add height), or still too wide
        hb = cur.hb;
        if (cur.raw > top) top = cur.raw; else if (cur.raw < top * 0.97) break;
      }
    }
    /* the n best variants that pass a test, as seeds for a later stage. A twin that differs only in where
       its stacks are anchored and came out the same size adds nothing; with 'every', each tab placement
       gets a seed even when the other placement crowds it out. */
    function seeds(test, n, every) {
      const fl = [];
      seen.forEach(x => { if (!x.ab && test(x.v, x)) fl.push(x); });
      fl.sort((x, y) => y.raw - x.raw || x.sk - y.sk);
      const out = [];
      for (let i = 0; i < fl.length && out.length < n; i++) {
        const x = fl[i];
        let twin = false;
        for (const o of out) if (o.v.pl === x.v.pl && o.v.a === x.v.a && o.v.b === x.v.b && o.v.s === x.v.s && o.v.pr === x.v.pr && o.v.f === x.v.f && abs(o.raw - x.raw) < 1e-9) twin = true;
        if (!twin) out.push(x);
      }
      if (every) for (const P of places) if (!out.some(o => o.v.pl === P.pl)) { const x = fl.find(o => o.v.pl === P.pl); if (x) out.push(x); }
      return out;
    }
    /* a flat board given up for its width (folds) or its height (paired lines, honeycomb) is a seed too,
       for a tab placement that has none: those families exist to cure exactly that */
    function withGivenUp(fl, wide) {
      for (const P of places) if (!fl.some(o => o.v.pl === P.pl)) {
        let w = null; seen.forEach(x => { if (!w && x.ab && x.abW === wide && x.v.pl === P.pl && x.v.a === 0 && x.v.s === 2 && !x.v.f && !x.v.pr) w = x; });
        if (w) fl.push(w);
      }
      return fl;
    }
    // stage 1: every tab placement, row tilt, stack angle and (flat rows) stack anchoring. A quick pass
    // with greedy row shifts finds a good board to measure the others against; then every variant within
    // refineCut of it, the most promising first, gets the full beam (greedy shifts can be 10-15% off),
    // and is given up as soon as it can no longer come within the 3% band of the best.
    const betas = S.hasStack ? CFG.betas : [60];
    const anchors = S.shelf ? ['b', 'm'] : ['b'];
    const k0 = S.hasBig ? CFG.screenK : 1;
    const tiltAll = CFG.tiltAllB && !heavy;   // (very big towers: the other stack angles only for the best few tilts)
    const s1 = [];
    for (const P of places) {
      for (const b of betas) for (const an of anchors) s1.push({ pl: P.pl, a: 0, b, an, k: k0, s: 2, pr: 0, f: 0 });
      for (const a of CFG.alphas) if (a > 0) {
        for (const b of (tiltAll ? betas : [betas[0]])) s1.push({ pl: P.pl, a, b, an: 'b', k: k0, s: 2, pr: 0, f: 0 });
        if (S.hasStack && CFG.alongBeta && a === 30) s1.push({ pl: P.pl, a, b: a, an: 'b', k: k0, s: 2, pr: 0, f: 0 });   // a stack running along a 30 deg row (each step climbs half a pitch)
      }
    }
    if (TWO) {
      for (let i = 0; i < s1.length; i++) evalV(s1[i], false, null, true);
      const rank = v => { const x = seen.get(codeOf(v) * 4 + PLI[v.pl]); return x ? (x.ab ? -1 : x.score) : -2; };
      const order = s1.map((v, i) => [rank(v), i]).filter(r => r[0] > -2).sort((p, q) => q[0] - p[0] || p[1] - q[1]);
      const gTop = order.length ? order[0][0] : 0;
      for (let i = 0; i < order.length; i++) if (order[i][0] >= gTop * CFG.refineCut) evalV(s1[order[i][1]], true, null, true);
    } else for (let i = 0; i < s1.length; i++) evalV(s1[i], true, null, true);
    // (the other stack angles, for the few best tilts)
    if (!tiltAll && betas.length > 1) {
      const tl = seeds(v => v.a > 0 && v.b !== v.a && !v.pr && !v.f, CFG.tiltRefine);
      for (let i = 0; i < tl.length; i++) for (const b of betas) if (b !== tl[i].v.b) evalV(assign({}, tl[i].v, { b }), true, null, true);
    }
    const stw = trace ? [WORK] : null;
    // a box too small for a good board: size is all that counts (no gates, no preferences)
    if (best && faceOf(best) < CFG.tinyFace) {
      tiny = true;
      seen.forEach(x => { const f = 1 / x.bon; x.raw *= f; x.score *= f; x.bon = 1; });
      best = null; seen.forEach(x => { if (x.lines && (!best || x.score > best.score + 1e-9)) best = x; });
      // (a variant whose look was not measured may now be in reach: measure it)
      const redo = []; seen.forEach(x => { if (!x.ab && !x.lines && best && x.raw >= best.score * CUT) redo.push(x.v); });
      for (const v of redo) { seen.delete(codeOf(v) * 4 + PLI[v.pl]); evalV(v, true, null, true); }
      // and the tighter stacks the look rules otherwise forbid: shallow 20 deg stacks, stacks centred on the row
      if (S.hasStack) for (const P of places) {
        for (const an of anchors) evalV({ pl: P.pl, a: 0, b: 20, an, k: k0, s: 2, pr: 0, f: 0 }, true, null, true);
        for (const b of [60, 20]) evalV({ pl: P.pl, a: 0, b, an: 'c', k: k0, s: 2, pr: 0, f: 0 }, true, null, true);
      }
    }
    if (stw) stw.push(WORK);
    // width-bound boxes: fold long rows, starting from the few best flat variants
    if (S.anyFold) {
      const fl = withGivenUp(seeds((v, x) => v.a === 0 && v.s === 2 && !v.f && !v.pr && !x.hb, nFold, true), true);
      for (let i = 0; i < fl.length; i++) foldFrom(fl[i], fl[i].v);
    }
    if (stw) stw.push(WORK);
    // wide, height-bound boxes: paired lines (every stack angle and anchoring of the flat variants
    // whose height binds; chords only when they buy a lot) and the chord honeycomb
    const pairOK = new SetC();
    if (NR > 1) {
      const fl = withGivenUp(seeds((v, x) => v.a === 0 && v.s === 2 && !v.f && !v.pr && x.hb, CFG.pairTop), false);
      for (let i = 0; i < fl.length; i++) {
        const v = fl[i].v;
        // a fixed rule for the phase: pairs start at the bottom row unless the other phase is 3% bigger
        const p1 = evalV(assign({}, v, { pr: 1 }), true, null, true, false);
        const p2 = NR > 2 ? evalV(assign({}, v, { pr: 2 }), true, null, true, false) : null;
        const pc = !p1 ? p2 : !p2 ? p1 : p2.score >= p1.score * CFG.pairPhaseGate ? p2 : p1;
        if (!pc) continue;
        pairOK.add(pc.sk);
        done(pc, true);
      }
      if (!melody) {
        const hl = withGivenUp(seeds((v, x) => v.a === 0 && v.s === 2 && !v.f && !v.pr && x.hb, CFG.wideTopChords), false);
        // spreads in increasing order; once a spread makes the width bind, more spread only adds width
        for (let i = 0; i < hl.length; i++) for (const sp of CFG.spreads) { const e = evalV(assign({}, hl[i].v, { s: sp }), true, null, true); if (e ? !e.hb : !PRUNED_H) break; }
      }
    }
    if (stw) stw.push(WORK);
    /* other big-button sizes around the n best (regular size comes first). The first step tells whether
       the big buttons bind at all: the full size that does not make the regular buttons smaller (or,
       from full size, the middle size that does not make them bigger) ends the search for that variant */
    if (S.hasBig && nK) {
      const top = [];
      seen.forEach(e => { if (!e.ab && (!e.v.pr || pairOK.has(e.sk))) top.push(e); });
      top.sort((x, y) => y.score - x.score || x.sk - y.sk);
      const doneK = [];
      for (let i = 0; i < top.length && doneK.length < nK; i++) {
        const x = top[i], kc = x.v.k, tried = [kc];
        if (doneK.some(o => o.v.pl === x.v.pl && o.v.a === x.v.a && o.v.b === x.v.b && o.v.an === x.v.an && o.v.s === x.v.s && o.v.pr === x.v.pr && o.v.f === x.v.f)) continue;
        doneK.push(x);
        const order = kc === 1 ? CFG.kmuls : [1].concat(CFG.kmuls.filter(k => k !== kc));
        for (let j = 0; j < order.length; j++) {
          const k = order[j];
          // (skip a size that leaves every big button within 1% of a size already tried)
          let fresh = true;
          for (const t of tried) { let moved = false; for (const y of S.kaps) if (abs(kScaled(y, k) - kScaled(y, t)) > 0.01 * y) moved = true; if (!moved) fresh = false; }
          if (!fresh) continue;
          tried.push(k);
          const e = evalV(assign({}, x.v, { k }), true, null, true, !x.v.pr || pairOK.has(x.sk));
          if (e && e.v.pr) pairOK.add(e.sk);
          if (j === 0 && (kc === 1 ? (!e || e.u <= x.u * (1 + CFG.kStep)) : (e && e.u >= x.u * (1 - CFG.kStep)))) break;
        }
      }
    }
    if (stw) stw.push(WORK);
    // repeated rows into their columns, for the few best boards (the beam can lose that on a tie): an
    // aligned board is tidier and may overtake the best
    {
      const top = [];
      seen.forEach(e => { if (!e.ab && e.lines && (!e.v.pr || pairOK.has(e.sk)) && e.mis > 0 && e.score >= best.score * CUT) top.push(e); });
      top.sort((x, y) => y.score - x.score || x.sk - y.sk);
      for (let i = 0; i < top.length && i < CFG.alignTop; i++) {
        const a = alignRepeats(top[i]);
        if (a !== top[i]) { a.fine = true; seen.set(a.sk, a); done(a, true); }
      }
    }
    if (stw) stw.push(WORK);
    // the best finished variant among those that pass a test (for the preferences below)
    function bestWhere(test) {
      let bp = null;
      seen.forEach(x => { if (!x.ab && x.lines && test(x.v) && (!x.v.pr || pairOK.has(x.sk)) && (!bp || x.score > bp.score + 1e-9 || (abs(x.score - bp.score) <= 1e-9 && x.sk < bp.sk))) bp = x; });
      return bp;
    }
    /* an alternative to the best is acceptable while it is within 3% of it in score AND its regular
       buttons are within 3% of the best's in size. (Scores carry the families' entry gates, e.g. paired
       lines must buy 15%, so a score band alone could keep a board ~18% smaller than a fresh layout.) */
    const bf = faceOf(best);
    const near = (e, f) => { if (!e) return false; f = f || 1; return e.score >= best.score * (1 - CFG.hyst * f) && faceOf(e) >= bf - abs(bf) * CFG.hystFace * f; };
    const prev = input.force ? { key: input.force, sig: S.hash, force: true } : input.prev;   // input.force: tests only
    const prevOK = !!prev && prev.sig === S.hash && typeof prev.key === 'string';
    const prevA = prevOK ? +prev.key.split('|')[1] : NaN;
    // the other side's slant (input.partner = its last out.variant), while matching it is that close. The
    // match has its own hysteresis: kept within the full band, entered only within half of it
    let target = best, pa = null;
    const partner = input.partner;
    if (partner && typeof partner.key === 'string') {
      const a = +partner.key.split('|')[1];
      if (a !== best.v.a && CFG.alphas.includes(a)) {
        const bp = bestWhere(x => x.a === a);
        if (near(bp, prevA === a ? 1 : 0.5)) { target = bp; pa = a; }
      }
    }
    // hysteresis: keep the previous arrangement (variant and row shifts) while it is within 3% of
    // the best; failing that, keep the tabs where they were while that placement is within 3%
    let chosen = target, kept = false;
    if (prevOK) {
      const p = prev.key.split('|');
      const v = { pl: p[0], a: +p[1], b: +p[2], an: p[3], k: +p[4], s: +p[5], pr: +p[6], f: +p[7] };
      const sp = CFG.spreads.find(s => abs(s - v.s) < 1e-3); if (sp) v.s = sp;
      const ok = places.some(P => P.pl === v.pl) && CFG.alphas.includes(v.a) && (CFG.betas.includes(v.b) || (CFG.alongBeta && v.b === v.a && v.a === 30) || (v.b === 20 && v.a === 0 && tiny)) && (v.an === 'b' || v.an === 'm' || (v.an === 'c' && tiny)) &&
        (v.k === 1 || CFG.kmuls.includes(v.k)) && (v.s === 2 || !!sp) && (v.pr === 0 || v.pr === 1 || (v.pr === 2 && NR > 2)) &&
        v.f >= 0 && v.f < 2147483648 && (!v.pr || v.a === 0) && (v.an === 'b' || v.a === 0);
      if (ok) {
        if (!S.shelf && v.an === 'm') v.an = 'b';
        const nl = !v.pr ? NR : v.pr === 1 ? ceil(NR / 2) : 1 + ceil((NR - 1) / 2);
        const xq = isArray(prev.xq) && prev.xq.length === nl && prev.xq.every(x => isInteger(x) && abs(x) < 4096) ? prev.xq : null;
        const pe = xq ? evalV(v, false, xq, false, false) : evalV(v, true, null, false, false, !!prev.force);
        if (prev.force || (near(pe) && (pa === null || v.a === pa))) { chosen = pe; kept = true; }
        else if (v.pl !== target.v.pl) {
          const bp = bestWhere(x => x.pl === v.pl && (pa === null || x.a === pa));
          if (near(bp)) chosen = bp;
        }
      }
    }

    /* repeated rows (the same shape, e.g. every Fa So La row) should sit in one column. The beam can
       lose that on a tie, so try moving each group of equal rows onto a shift one of them uses, and
       keep it when the board is no bigger and no worse. */
    function alignRepeats(e) {
      const lines = e.lines, NL = lines.length;
      if (NL < 3) return e;
      let cur = e, xq = arrFrom(e.X, x => round(x / e.q));
      for (let a = 1; a < NL; a++) {
        let first = true, differ = false;
        for (let b = 0; b < a; b++) if (lines[b] === lines[a]) first = false;
        if (!first) continue;
        const grp = [a];
        for (let b = a + 1; b < NL; b++) if (lines[b] === lines[a]) { grp.push(b); if (xq[b] !== xq[a]) differ = true; }
        if (!differ) continue;
        const cand = [];
        for (const g of grp) if (!cand.includes(xq[g])) cand.push(xq[g]);
        let bestTry = null;
        for (const t of cand) {
          const q2 = xq.slice(); for (const g of grp) q2[g] = t;
          const e2 = evalV(cur.v, false, q2, false, false);
          if (e2.score >= cur.score - 1e-9 && faceOf(e2) >= faceOf(cur) * 0.99 && !e2.bad && e2.sq <= cur.sq && (!bestTry || e2.score > bestTry.score + 1e-9)) bestTry = e2;
        }
        if (bestTry) { cur = bestTry; xq = arrFrom(cur.X, x => round(x / cur.q)); }
      }
      return cur;
    }
    if (!kept) chosen = alignRepeats(chosen);
    if (stw) { stw.push(WORK); trace.push(['stageWork', stw.map((w, i) => i ? w - stw[i - 1] : w - WORK0)]); }

    /* ---------- realise in px ---------- */
    const e = chosen, v = e.v;
    const u = max(0.01, e.u - CFG.safety);
    const bw = max(0, e.Wb * u - GAP), bh = max(0, e.Hb * u - GAP);    // the rings' bounding box
    let fx, fy, rect = null;
    if (v.pl === 'side') {
      const slack = max(0, W - bw - TG - CFG.tabMin);
      const tw = max(CFG.tabMin, min(CFG.sideMax, CFG.tabMin + slack / 2));
      const gw = bw + TG + tw;
      fx = max(0, (W - gw) / 2); fy = (H - bh) / 2;
      const th = min(H, max(CFG.colPerTab[0] * nMods, min(CFG.colPerTab[1] * nMods, bh)));
      const ty = max(0, min(H - th, fy + bh / 2 - th / 2));
      rect = { x: min(W - tw, fx + bw + TG), y: ty, w: tw, h: th };
    } else if (v.pl === 'bottom') {
      const slack = max(0, H - bh - TG - CFG.tabMin);
      const th = max(CFG.tabMin, min(CFG.bottomMax, CFG.tabMin + slack / 2));
      const gh = bh + TG + th;
      fx = (W - bw) / 2; fy = max(0, (H - gh) / 2);
      const tw = min(W, max(CFG.rowPerTab[0] * nMods, min(CFG.rowPerTab[1] * nMods, bw)));
      const tx = max(0, min(W - tw, fx + bw / 2 - tw / 2));
      rect = { x: tx, y: min(H - th, fy + bh + TG), w: tw, h: th };
    } else { fx = (W - bw) / 2; fy = (H - bh) / 2; }

    const circles = [];
    const lines = e.lines;
    // ids per line, in the circles' order
    const lineIds = [];
    if (!v.pr) for (let i = 0; i < NR; i++) lineIds.push(ids[i]);
    else {
      let i = 0;
      if (v.pr === 2) lineIds.push(ids[i++]);
      for (; i < NR; i += 2) lineIds.push(i + 1 < NR ? ids[i].concat(ids[i + 1]) : ids[i]);
    }
    for (let k = 0; k < lines.length; k++) {
      const l = lines[k], li = lineIds[k];
      for (let i = 0; i < l.n; i++) {
        const x = l.x[i] + e.X[k], y = l.y[i] + e.Y[k];
        circles.push({ id: li[i], cx: fx + (x - e.x0) * u - GAP / 2, cy: fy + (e.Hb - y) * u - GAP / 2, d: max(2, 2 * l.r[i] * u - 2 * RING - GAP) });
      }
    }
    const vkey = keyOf(e.v);
    if (trace) trace.push(['chosen', vkey, 'evals', nEval, 'pruned', nPruned, 'fine', nFine, 'prevKept', chosen !== best, 'bad', e.bad, 'sq', e.sq, 'abort', nAbort, 'drops', DROPS, 'work', WORK]);
    return {
      circles,
      mods: v.pl === 'none' ? { placement: 'none' } : { placement: v.pl, rect },
      variant: { key: vkey, sig: S.hash, xq: arrFrom(e.X, x => round(x / e.q)), score: +e.score.toFixed(3) }
    };
  }

  /* tests only: packRound.configure({ ...overrides }) swaps the config and clears the caches */
  packRound.configure = function (o) { CFG = assign({}, DEFAULTS, o || {}); STRUCTS.clear(); SHAPES.clear(); };

  /* Prime the packer at load with two small towers (a chord side with tabs, a narrow melody side; about
     7 ms in a fresh Chrome page; results discarded and caches cleared, so no output changes). The search
     tries every variant with the full beam, and until V8 has optimised the hot loops a call runs ~10x
     slower: unprimed, the first two layouts after page load take ~6-8 ms each, primed ~2-3 ms. */
  {
    const R = (n, p) => Array.from({ length: n }, (_, i) => p + i);
    packRound({ side: 'chords', rows: [['I', ['a', 'b']], R(3, 'c'), R(3, 'd'), R(2, 'e')], blocks: { I: { size: 2, w: 3 } }, W: 600, H: 700, mods: { count: 5 } });
    packRound({ side: 'melody', rows: [['m'], R(3, 'f'), ['t', 'D', ['g', 'h']], R(3, 'i'), ['u', 'E', ['j', 'k']], R(3, 'l')],
      blocks: { m: { size: 0.6 }, t: { size: 2, w: 0.55 }, D: { size: 2, w: 1.45 }, u: { size: 2, w: 0.55 }, E: { size: 2, w: 1.45 } }, W: 300, H: 700, mods: { count: 0 } });
    STRUCTS.clear(); SHAPES.clear(); SID = 0;
  }

  window.packRound = packRound;
})();

/* PNG Creator — plain JavaScript, no AI, nothing uploaded.
 *
 * The picture is two canvases of the same size:
 *   base — the picture's own pixels (only crop / turn / flip / resize replace it)
 *   mask — how much of each pixel is kept, in its alpha channel (255 kept, 0 removed)
 * What you see and what you download is base × mask (the `comp` canvas).
 * Removal tools only ever change the mask, so the Restore brush can bring anything back.
 */
(() => {
'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const MAX_SIDE = 6000;          // bigger pictures are scaled down on open
const MAX_RESIZE = 8000;        // largest side the Resize box allows
const HISTORY_BYTES = 500e6;    // memory budget for undo steps
const MAX_D = Math.sqrt(65025 * (8 + 255 / 256)); // largest possible color distance

/* ---------------- settings (remembered on this device) ---------------- */
const OPT_KEY = 'png_creator_opts_v1';
const DEFAULTS = {
  brushSize: 40, brushSoft: 25,
  wandTol: 20, wandSoft: 8, wandContig: true, wandMode: 'remove',
  autoTol: 18, autoSoft: 10, autoTop: true, autoBottom: true, autoLeft: true, autoRight: true, autoHoles: false,
  lassoShape: 'free', lassoMode: 'inside',
  cropRatio: 'free',
  bg: 'checker', bgColor: '#3cb371', ghost: false,
  lockRatio: true,
};
const opts = Object.assign({}, DEFAULTS, (() => {
  try { return JSON.parse(localStorage.getItem(OPT_KEY)) || {}; } catch (e) { return {}; }
})());
function saveOpts() { try { localStorage.setItem(OPT_KEY, JSON.stringify(opts)); } catch (e) {} }

/* ---------------- picture state ---------------- */
let W = 0, H = 0, N = 0;
let base = null, mask = null, maskCtx = null, comp = null, compCtx = null;
let compDirty = true;
let fileName = 'picture';
let dirty = false;              // changed since the last download
let maskVer = 0;                // bumps on every mask change
let maskCache = { ver: -1, a: null };
let baseCache = { ref: null, data: null };
let pdCache = { ref: null, key: '', pd: null, pal: null };
let wandCache = { ref: null, key: '', pd: null };

let undoStack = [], redoStack = [];
let lastOp = null;              // the last wand click / auto removal, which the sliders can re-tune

/* ---------------- view / interaction state ---------------- */
let tool = 'wand';
const view = { s: 1, x: 0, y: 0, fitted: true };
let previewAngle = 0;
let comparing = false;
let spaceDown = false;
const pointer = { x: 0, y: 0, inside: false };
let drag = null;
let lasso = null;               // { pts: [{x,y}], poly: bool }
let crop = null;                // { x, y, w, h } in picture pixels
let cropCursor = 'crosshair';
let lastStrokeEnd = null;
const touches = new Map();
let pinch = null;

/* ---------------- elements ---------------- */
const stage = $('#stage');
const sctx = stage.getContext('2d');
const wrap = $('#stageWrap');
const fileInput = $('#fileInput');
let CW = 0, CH = 0, dpr = window.devicePixelRatio || 1, checker = null;

function newCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0);
  return c;
}

/* ======================================================================
   Loading
   ====================================================================== */
function loadImageEl(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = () => rej(new Error('decode'));
    i.src = src;
  });
}

async function openFile(file) {
  if (!file) return;
  if (base && dirty && !confirm('Open a new picture? Changes to this one will be lost unless you downloaded it.')) return;
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImageEl(url);
    setImage(img, file.name || 'picture');
  } catch (e) {
    toast("That file couldn't be opened. Try a JPG, PNG, WEBP or GIF.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function setImage(src, name) {
  let w = src.naturalWidth || src.width, h = src.naturalHeight || src.height;
  if (!w || !h) { w = 1024; h = 1024; }
  let scale = 1;
  if (Math.max(w, h) > MAX_SIDE) scale = MAX_SIDE / Math.max(w, h);
  const nw = Math.max(1, Math.round(w * scale)), nh = Math.max(1, Math.round(h * scale));
  let b;
  if (scale < 1) {
    const full = newCanvas(w, h);
    full.getContext('2d').drawImage(src, 0, 0, w, h);
    b = resizeCanvas(full, nw, nh);
    toast(`Large picture scaled to ${nw} × ${nh} to keep things fast.`);
  } else {
    b = newCanvas(nw, nh);
    b.getContext('2d').drawImage(src, 0, 0, nw, nh);
  }
  const m = newCanvas(nw, nh);
  const mc = m.getContext('2d');
  mc.fillStyle = '#fff'; mc.fillRect(0, 0, nw, nh);

  fileName = String(name).replace(/\.[^.]+$/, '') || 'picture';
  undoStack = []; redoStack = []; lastOp = null;
  lasso = null; drag = null; previewAngle = 0; lastStrokeEnd = null;
  setCanvases(b, m);
  dirty = false;
  $('#angle').value = 0;
  if (tool === 'crop') resetCrop();
  fitView();
  updateUI();
}

function setCanvases(b, m) {
  base = b; mask = m;
  W = b.width; H = b.height; N = W * H;
  maskCtx = mask.getContext('2d');
  if (!comp || comp.width !== W || comp.height !== H) { comp = newCanvas(W, H); compCtx = comp.getContext('2d'); }
  maskVer++;
  compDirty = true;
  requestRender();
}

/* ======================================================================
   Mask helpers
   ====================================================================== */
function readMaskAlpha() {
  if (maskCache.ver === maskVer && maskCache.a && maskCache.a.length === N) return maskCache.a;
  const d = maskCtx.getImageData(0, 0, W, H).data;
  const a = new Uint8Array(N);
  for (let i = 0, k = 3; i < N; i++, k += 4) a[i] = d[k];
  maskCache = { ver: maskVer, a };
  return a;
}

function writeMaskAlpha(a) {
  const img = maskCtx.createImageData(W, H);
  const u = new Uint32Array(img.data.buffer);
  for (let i = 0; i < N; i++) u[i] = (a[i] << 24) | 0xffffff;
  maskCtx.putImageData(img, 0, 0);
  maskVer++;
  maskCache = { ver: maskVer, a };
  compDirty = true; dirty = true;
  requestRender();
}

function markMaskChanged() { maskVer++; compDirty = true; dirty = true; }

let preReadTimer = 0;
function preReadMaskSoon() {
  clearTimeout(preReadTimer);
  preReadTimer = setTimeout(() => { if (base && !drag) readMaskAlpha(); }, 350);
}

function getBasePixels() {
  if (baseCache.ref !== base) {
    baseCache = { ref: base, data: base.getContext('2d').getImageData(0, 0, W, H).data };
  }
  return baseCache.data;
}

function rebuildComp() {
  compCtx.globalCompositeOperation = 'copy';
  compCtx.drawImage(base, 0, 0);
  compCtx.globalCompositeOperation = 'destination-in';
  compCtx.drawImage(mask, 0, 0);
  compCtx.globalCompositeOperation = 'source-over';
  compDirty = false;
}

/* ======================================================================
   History
   ====================================================================== */
function snapshot() { return { base, w: W, h: H, maskA: readMaskAlpha() }; }

function pushHistory() {
  const s = snapshot();
  undoStack.push(s);
  redoStack = [];
  lastOp = null;
  trimHistory();
  dirty = true;
  updateUI();
  return s;
}

function historyBytes() {
  let bytes = 0;
  const seen = new Set([base]);
  for (const s of undoStack.concat(redoStack)) {
    bytes += s.maskA.length;
    if (!seen.has(s.base)) { seen.add(s.base); bytes += s.w * s.h * 4; }
  }
  return bytes;
}
function trimHistory() {
  while (undoStack.length > 2 && historyBytes() > HISTORY_BYTES) undoStack.shift();
}

function restoreSnap(s) {
  if (s.base !== base || s.w !== W || s.h !== H) setCanvases(s.base, newCanvas(s.w, s.h));
  writeMaskAlpha(s.maskA);
  if (tool === 'crop') resetCrop();
}

function cancelPending() {
  lasso = null; drag = null;
  if (previewAngle) { previewAngle = 0; $('#angle').value = 0; updateAngleUI(); }
}

function undo() {
  if (!undoStack.length) return;
  cancelPending();
  redoStack.push(snapshot());
  restoreSnap(undoStack.pop());
  lastOp = null; dirty = true;
  updateUI();
}
function redo() {
  if (!redoStack.length) return;
  cancelPending();
  undoStack.push(snapshot());
  restoreSnap(redoStack.pop());
  lastOp = null; dirty = true;
  updateUI();
}

/* ======================================================================
   Color distance + region selection (Magic Wand and automatic removal)
   Distances are stored as 0–1000 (tenths of a percent of the largest possible difference).
   ====================================================================== */
function dist2(r1, g1, b1, r2, g2, b2) {
  const rm = (r1 + r2) * 0.5, dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
}

/* Grows a selection from the seed pixels through every pixel whose distance is within tolerance.
   Pixels just outside the selection that are nearly within tolerance become partly selected,
   which gives the cut a soft, anti-aliased edge. Returns 0–255 strength per pixel. */
function selectRegion(pd, seeds, tolV, softV, contiguous) {
  const sel = new Uint8Array(N);
  if (contiguous) {
    const q = new Int32Array(N);
    let qh = 0, qt = 0;
    for (let s = 0; s < seeds.length; s++) {
      const i = seeds[s];
      if (!sel[i] && pd[i] <= tolV) { sel[i] = 255; q[qt++] = i; }
    }
    while (qh < qt) {
      const i = q[qh++], x = i % W;
      let j;
      if (x > 0 && !sel[j = i - 1] && pd[j] <= tolV) { sel[j] = 255; q[qt++] = j; }
      if (x < W - 1 && !sel[j = i + 1] && pd[j] <= tolV) { sel[j] = 255; q[qt++] = j; }
      if (i >= W && !sel[j = i - W] && pd[j] <= tolV) { sel[j] = 255; q[qt++] = j; }
      if (i < N - W && !sel[j = i + W] && pd[j] <= tolV) { sel[j] = 255; q[qt++] = j; }
    }
  } else {
    for (let i = 0; i < N; i++) if (pd[i] <= tolV) sel[i] = 255;
  }
  if (softV > 0) {
    const lim = tolV + softV;
    for (let y = 0, i = 0; y < H; y++) {
      for (let x = 0; x < W; x++, i++) {
        if (sel[i] || pd[i] > lim) continue;
        if ((x > 0 && sel[i - 1] === 255) || (x < W - 1 && sel[i + 1] === 255) ||
            (y > 0 && sel[i - W] === 255) || (y < H - 1 && sel[i + W] === 255)) {
          const t = 1 - (pd[i] - tolV) / softV;
          sel[i] = clamp(Math.round(255 * t), 1, 254);
        }
      }
    }
  }
  return sel;
}

function applySelection(before, sel, mode) {
  const out = new Uint8Array(N);
  if (mode === 'remove') {
    for (let i = 0; i < N; i++) {
      const s = sel[i];
      out[i] = s ? ((before[i] * (255 - s) + 127) / 255) | 0 : before[i];
    }
  } else {
    for (let i = 0; i < N; i++) out[i] = sel[i] > before[i] ? sel[i] : before[i];
  }
  writeMaskAlpha(out);
}

/* ---- Magic Wand ---- */
function wandDistances(x, y) {
  const d = getBasePixels();
  const k0 = (y * W + x) * 4;
  const key = x + ',' + y;
  if (wandCache.ref === base && wandCache.key === key) return wandCache.pd;
  const pd = new Uint16Array(N);
  const sr = d[k0], sg = d[k0 + 1], sb = d[k0 + 2], seedClear = d[k0 + 3] < 16;
  for (let i = 0, k = 0; i < N; i++, k += 4) {
    const clear = d[k + 3] < 16;
    if (seedClear || clear) { pd[i] = seedClear === clear ? 0 : 1000; continue; }
    pd[i] = Math.min(1000, Math.round(Math.sqrt(dist2(d[k], d[k + 1], d[k + 2], sr, sg, sb)) / MAX_D * 1000));
  }
  wandCache = { ref: base, key, pd };
  return pd;
}

function runWand(x, y, opposite) {
  const snap = pushHistory();
  let mode = opts.wandMode;
  if (opposite) mode = mode === 'remove' ? 'restore' : 'remove';
  lastOp = { kind: 'wand', before: snap.maskA, x, y, mode };
  busy(() => wandCompute(), 'Selecting…', N > 4e6);
}

function wandCompute() {
  if (!lastOp || lastOp.kind !== 'wand') return;
  const { x, y, mode, before } = lastOp;
  const pd = wandDistances(x, y);
  const sel = selectRegion(pd, [y * W + x], opts.wandTol * 10, opts.wandSoft * 10, opts.wandContig);
  applySelection(before, sel, mode);
  updateLiveNotes();
}

/* ---- Automatic background removal ---- */
function edgesKey() { return [opts.autoTop, opts.autoBottom, opts.autoLeft, opts.autoRight].map(Number).join(''); }

/* The background's colors = the most common colors in a thin band along the chosen edges. */
function borderPalette(d) {
  const bw = clamp(Math.round(Math.min(W, H) / 150), 1, 4);
  const bins = new Map();
  let total = 0;
  const add = (x, y) => {
    const k = (y * W + x) * 4;
    if (d[k + 3] < 16) return;
    const key = ((d[k] >> 4) << 8) | ((d[k + 1] >> 4) << 4) | (d[k + 2] >> 4);
    let b = bins.get(key);
    if (!b) { b = [0, 0, 0, 0]; bins.set(key, b); }
    b[0]++; b[1] += d[k]; b[2] += d[k + 1]; b[3] += d[k + 2];
    total++;
  };
  if (opts.autoTop) for (let y = 0; y < Math.min(bw, H); y++) for (let x = 0; x < W; x++) add(x, y);
  if (opts.autoBottom) for (let y = Math.max(0, H - bw); y < H; y++) for (let x = 0; x < W; x++) add(x, y);
  if (opts.autoLeft) for (let x = 0; x < Math.min(bw, W); x++) for (let y = 0; y < H; y++) add(x, y);
  if (opts.autoRight) for (let x = Math.max(0, W - bw); x < W; x++) for (let y = 0; y < H; y++) add(x, y);

  const arr = Array.from(bins.values()).sort((a, b) => b[0] - a[0]);
  const merge2 = (0.08 * MAX_D) ** 2;
  const clusters = [];
  for (const b of arr) {
    const r = b[1] / b[0], g = b[2] / b[0], bl = b[3] / b[0];
    let hit = null;
    for (const c of clusters) if (dist2(r, g, bl, c.r, c.g, c.b) <= merge2) { hit = c; break; }
    if (hit) {
      const n = hit.n + b[0];
      hit.r = (hit.r * hit.n + b[1]) / n; hit.g = (hit.g * hit.n + b[2]) / n; hit.b = (hit.b * hit.n + b[3]) / n;
      hit.n = n;
    } else clusters.push({ r, g, b: bl, n: b[0] });
  }
  clusters.sort((a, b) => b.n - a.n);
  let pal = clusters.filter((c) => c.n >= total * 0.04).slice(0, 8);
  if (!pal.length && clusters.length) pal = [clusters[0]];
  return pal;
}

function paletteDistances() {
  const key = edgesKey();
  if (pdCache.ref === base && pdCache.key === key) return pdCache;
  const d = getBasePixels();
  const pal = borderPalette(d);
  const P = pal.length;
  const pr = pal.map((c) => c.r), pg = pal.map((c) => c.g), pb = pal.map((c) => c.b);
  const pd = new Uint16Array(N);
  for (let i = 0, k = 0; i < N; i++, k += 4) {
    if (d[k + 3] < 16) { pd[i] = 0; continue; }
    if (!P) { pd[i] = 1000; continue; }
    const r = d[k], g = d[k + 1], b = d[k + 2];
    let best = Infinity;
    for (let p = 0; p < P; p++) {
      const v = dist2(r, g, b, pr[p], pg[p], pb[p]);
      if (v < best) best = v;
    }
    pd[i] = Math.min(1000, Math.round(Math.sqrt(best) / MAX_D * 1000));
  }
  pdCache = { ref: base, key, pd, pal };
  return pdCache;
}

function borderSeeds() {
  const s = [];
  if (opts.autoTop) for (let x = 0; x < W; x++) s.push(x);
  if (opts.autoBottom) for (let x = 0; x < W; x++) s.push((H - 1) * W + x);
  if (opts.autoLeft) for (let y = 0; y < H; y++) s.push(y * W);
  if (opts.autoRight) for (let y = 0; y < H; y++) s.push(y * W + W - 1);
  return s;
}

function runAuto() {
  if (!base) return;
  if (!(opts.autoTop || opts.autoBottom || opts.autoLeft || opts.autoRight)) {
    toast('Turn on at least one edge to start from.');
    return;
  }
  cancelPending();
  const snap = pushHistory();
  lastOp = { kind: 'auto', before: snap.maskA };
  busy(() => autoCompute(true), 'Removing background…', true);
}

function autoCompute(report) {
  if (!lastOp || lastOp.kind !== 'auto') return;
  if (!(opts.autoTop || opts.autoBottom || opts.autoLeft || opts.autoRight)) return;
  const { pd, pal } = paletteDistances();
  const sel = selectRegion(pd, borderSeeds(), opts.autoTol * 10, opts.autoSoft * 10, !opts.autoHoles);
  applySelection(lastOp.before, sel, 'remove');

  let removed = 0;
  for (let i = 0; i < N; i++) if (sel[i] === 255) removed++;
  const pct = removed / N * 100;
  const info = $('#autoInfo');
  info.hidden = false;
  info.innerHTML = '';
  const lab = document.createElement('span');
  lab.textContent = 'Background colors:';
  info.appendChild(lab);
  for (const c of pal.slice(0, 6)) {
    const sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = `rgb(${c.r | 0},${c.g | 0},${c.b | 0})`;
    info.appendChild(sw);
  }
  const p = document.createElement('span');
  p.textContent = `· removed ${pct < 1 && pct > 0 ? '<1' : Math.round(pct)}% of the picture`;
  info.appendChild(p);
  updateLiveNotes();

  if (report) {
    if (removed === 0) toast('Nothing matched the edge colors. Try a higher Tolerance.');
    else if (pct > 97) toast('Almost everything was removed. Lower the Tolerance, or turn off an edge.');
  }
}

/* Re-tune the last wand click / auto removal while its sliders move. */
let retuneTimer = 0;
function scheduleRetune(kind) {
  if (!lastOp || lastOp.kind !== kind) return;
  clearTimeout(retuneTimer);
  retuneTimer = setTimeout(() => {
    if (!lastOp || lastOp.kind !== kind) return;
    if (kind === 'auto') autoCompute(false); else wandCompute();
  }, N > 6e6 ? 120 : 30);
}

function updateLiveNotes() {
  $('#autoLive').hidden = !(lastOp && lastOp.kind === 'auto');
  $('#wandLive').hidden = !(lastOp && lastOp.kind === 'wand');
}

/* ======================================================================
   Edge clean-up (works on the mask)
   ====================================================================== */
function maskOp(kind) {
  if (!base) return;
  cancelPending();
  const a = pushHistory().maskA;
  const out = new Uint8Array(N);
  if (kind === 'shrink' || kind === 'grow') {
    const isMin = kind === 'shrink';
    for (let y = 0, i = 0; y < H; y++) {
      for (let x = 0; x < W; x++, i++) {
        let v = a[i];
        const l = x > 0 ? a[i - 1] : v, r = x < W - 1 ? a[i + 1] : v;
        const u = y > 0 ? a[i - W] : v, dn = y < H - 1 ? a[i + W] : v;
        if (isMin) v = Math.min(v, l, r, u, dn); else v = Math.max(v, l, r, u, dn);
        out[i] = v;
      }
    }
  } else if (kind === 'soften') {
    const tmp = new Uint16Array(N);
    for (let y = 0, i = 0; y < H; y++) {
      for (let x = 0; x < W; x++, i++) {
        const l = x > 0 ? a[i - 1] : a[i], r = x < W - 1 ? a[i + 1] : a[i];
        tmp[i] = l + 2 * a[i] + r;
      }
    }
    for (let y = 0, i = 0; y < H; y++) {
      for (let x = 0; x < W; x++, i++) {
        const u = y > 0 ? tmp[i - W] : tmp[i], dn = y < H - 1 ? tmp[i + W] : tmp[i];
        out[i] = ((u + 2 * tmp[i] + dn) / 16 + 0.5) | 0;
      }
    }
  } else if (kind === 'invert') {
    for (let i = 0; i < N; i++) out[i] = 255 - a[i];
  } else if (kind === 'reset') {
    out.fill(255);
  }
  writeMaskAlpha(out);
}

/* ======================================================================
   Transforms: crop, turn, flip, straighten, resize
   ====================================================================== */
function transformAll(nw, nh, draw) {
  pushHistory();
  const nb = newCanvas(nw, nh), nm = newCanvas(nw, nh);
  for (const [dst, src] of [[nb, base], [nm, mask]]) {
    const c = dst.getContext('2d');
    c.imageSmoothingEnabled = true;
    c.imageSmoothingQuality = 'high';
    draw(c, src);
  }
  setCanvases(nb, nm);
  if (tool === 'crop') resetCrop();
  view.fitted ? fitView() : clampView();
  updateUI();
}

function rotate90(dir) {
  if (!base) return;
  cancelPending();
  const w = W, h = H;
  transformAll(h, w, (c, src) => {
    if (dir > 0) { c.translate(h, 0); c.rotate(Math.PI / 2); }
    else { c.translate(0, w); c.rotate(-Math.PI / 2); }
    c.drawImage(src, 0, 0);
  });
}

function flip(horizontal) {
  if (!base) return;
  cancelPending();
  const w = W, h = H;
  transformAll(w, h, (c, src) => {
    if (horizontal) { c.translate(w, 0); c.scale(-1, 1); } else { c.translate(0, h); c.scale(1, -1); }
    c.drawImage(src, 0, 0);
  });
}

function rotateFree(deg) {
  if (!base || !deg) return;
  const rad = deg * Math.PI / 180, cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
  const w = W, h = H;
  const nw = Math.ceil(w * cos + h * sin - 1e-6), nh = Math.ceil(w * sin + h * cos - 1e-6);
  transformAll(nw, nh, (c, src) => {
    c.translate(nw / 2, nh / 2);
    c.rotate(rad);
    c.drawImage(src, -w / 2, -h / 2);
  });
}

/* High-quality resize: halve in steps when shrinking a lot, so detail isn't lost. */
function resizeCanvas(src, nw, nh) {
  let cur = src;
  while (cur.width / 2 >= nw && cur.height / 2 >= nh && cur.width > 2 && cur.height > 2) {
    const t = newCanvas(Math.round(cur.width / 2), Math.round(cur.height / 2));
    const c = t.getContext('2d');
    c.imageSmoothingQuality = 'high';
    c.drawImage(cur, 0, 0, t.width, t.height);
    cur = t;
  }
  const out = newCanvas(nw, nh);
  const c = out.getContext('2d');
  c.imageSmoothingQuality = 'high';
  c.drawImage(cur, 0, 0, nw, nh);
  return out;
}

function resizeTo(nw, nh) {
  if (!base) return;
  nw = Math.round(nw); nh = Math.round(nh);
  if (!(nw >= 1 && nh >= 1)) { toast('Type a width and height first.'); return; }
  if (nw > MAX_RESIZE || nh > MAX_RESIZE) { toast(`The largest size is ${MAX_RESIZE} pixels on a side.`); return; }
  if (nw === W && nh === H) { toast('That is already its size.'); return; }
  cancelPending();
  pushHistory();
  const nb = resizeCanvas(base, nw, nh), nm = resizeCanvas(mask, nw, nh);
  setCanvases(nb, nm);
  if (tool === 'crop') resetCrop();
  view.fitted ? fitView() : clampView();
  updateUI();
  toast(`Resized to ${nw} × ${nh}`);
}

function applyCrop() {
  if (!base || !crop) return;
  const x = clamp(Math.round(crop.x), 0, W - 1), y = clamp(Math.round(crop.y), 0, H - 1);
  const w = clamp(Math.round(crop.w), 0, W - x), h = clamp(Math.round(crop.h), 0, H - y);
  if (w < 1 || h < 1) { toast('Draw a bigger crop box first.'); return; }
  if (x === 0 && y === 0 && w === W && h === H) { toast('Drag the box smaller first.'); return; }
  cancelPending();
  transformAll(w, h, (c, src) => c.drawImage(src, -x, -y));
  fitView();
  toast(`Cropped to ${w} × ${h}`);
}

function trimEmpty() {
  if (!base) return;
  if (compDirty) rebuildComp();
  const d = compCtx.getImageData(0, 0, W, H).data;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0, k = 3; y < H; y++) {
    for (let x = 0; x < W; x++, k += 4) {
      if (d[k] > 8) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  if (x1 < 0) { toast('Nothing is left in the picture to keep.'); return; }
  const w = x1 - x0 + 1, h = y1 - y0 + 1;
  if (w === W && h === H) { toast('There is no empty space around the edges.'); return; }
  cancelPending();
  transformAll(w, h, (c, src) => c.drawImage(src, -x0, -y0));
  fitView();
  toast(`Trimmed to ${w} × ${h}`);
}

/* ======================================================================
   Brushes (Eraser / Restore)
   ====================================================================== */
let stampCache = { key: '', c: null };
function getStamp(r, soft) {
  const key = r.toFixed(2) + '/' + soft;
  if (stampCache.key === key) return stampCache.c;
  const R = Math.ceil(r) + 1, size = R * 2;
  const c = newCanvas(size, size), x = c.getContext('2d');
  x.beginPath();
  x.arc(R, R, r, 0, Math.PI * 2);
  if (soft <= 0 || r < 1.5) {
    x.fillStyle = '#fff';
  } else {
    const g = x.createRadialGradient(R, R, Math.max(0, r * (1 - soft / 100)), R, R, r);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g;
  }
  x.fill();
  stampCache = { key, c };
  return c;
}

function stampAt(p) {
  const st = getStamp(drag.r, opts.brushSoft);
  maskCtx.globalCompositeOperation = drag.mode === 'erase' ? 'destination-out' : 'source-over';
  maskCtx.drawImage(st, p.x - st.width / 2, p.y - st.height / 2);
  maskCtx.globalCompositeOperation = 'source-over';
  markMaskChanged();
}

function strokeTo(p) {
  const a = drag.last, dx = p.x - a.x, dy = p.y - a.y, d = Math.hypot(dx, dy);
  if (d === 0) return;
  const step = Math.max(0.5, drag.r * 0.18);
  let t = step - drag.acc;
  while (t <= d) { stampAt({ x: a.x + dx * t / d, y: a.y + dy * t / d }); t += step; }
  drag.acc = d - (t - step);
  drag.last = p;
}

function startStroke(ip, e) {
  pushHistory();
  drag = {
    kind: 'stroke', mode: tool === 'erase' ? 'erase' : 'restore',
    r: Math.max(0.5, opts.brushSize / 2 / view.s), last: ip, acc: 0, t0: performance.now(),
  };
  if (e.shiftKey && lastStrokeEnd) { drag.last = lastStrokeEnd; stampAt(lastStrokeEnd); strokeTo(ip); }
  else stampAt(ip);
  requestRender();
}

function endStroke() {
  lastStrokeEnd = drag.last;
  preReadMaskSoon();
}

/* ======================================================================
   Lasso
   ====================================================================== */
function applyLasso(pts) {
  // drop points that sit on top of each other (a double-click adds two)
  const clean = [];
  for (const p of pts) {
    const q = clean[clean.length - 1];
    if (!q || Math.hypot(p.x - q.x, p.y - q.y) * view.s > 0.75) clean.push(p);
  }
  lasso = null;
  if (clean.length < 3) { requestRender(); return; }
  pushHistory();
  const c = maskCtx;
  c.save();
  c.beginPath();
  c.moveTo(clean[0].x, clean[0].y);
  for (let i = 1; i < clean.length; i++) c.lineTo(clean[i].x, clean[i].y);
  c.closePath();
  c.fillStyle = '#fff';
  if (opts.lassoMode === 'inside') c.globalCompositeOperation = 'destination-out';
  else if (opts.lassoMode === 'outside') c.globalCompositeOperation = 'destination-in';
  else c.globalCompositeOperation = 'source-over';
  c.fill();
  c.restore();
  markMaskChanged();
  preReadMaskSoon();
  requestRender();
}

function finishPoly() {
  if (lasso && lasso.poly) applyLasso(lasso.pts);
}

/* ======================================================================
   Crop box
   ====================================================================== */
const RATIOS = { free: 0, '1:1': 1, '4:3': 4 / 3, '3:4': 3 / 4, '16:9': 16 / 9, '9:16': 9 / 16 };
function cropRatio() { return RATIOS[opts.cropRatio] || 0; }

function resetCrop() {
  crop = { x: 0, y: 0, w: W, h: H };
  fitCropToRatio();
  updateCropUI();
}

function fitCropToRatio() {
  const r = cropRatio();
  if (!r || !crop) return;
  let w, h;
  if (W / H > r) { h = H; w = H * r; } else { w = W; h = W / r; }
  const cx = crop.x + crop.w / 2, cy = crop.y + crop.h / 2;
  crop = { x: clamp(cx - w / 2, 0, W - w), y: clamp(cy - h / 2, 0, H - h), w, h };
}

function cropHandles() {
  const a = toScreen(crop.x, crop.y), b = toScreen(crop.x + crop.w, crop.y + crop.h);
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const hs = { nw: [a.x, a.y], ne: [b.x, a.y], sw: [a.x, b.y], se: [b.x, b.y] };
  if (!cropRatio()) Object.assign(hs, { n: [mx, a.y], s: [mx, b.y], w: [a.x, my], e: [b.x, my] });
  return { hs, a, b };
}

function hitCrop(p) {
  if (!crop) return 'new';
  const { hs, a, b } = cropHandles();
  for (const k of ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e']) {
    if (hs[k] && Math.abs(p.x - hs[k][0]) <= 11 && Math.abs(p.y - hs[k][1]) <= 11) return k;
  }
  if (p.x > a.x && p.x < b.x && p.y > a.y && p.y < b.y) return 'move';
  return 'new';
}

const CROP_CURSORS = { nw: 'nwse-resize', se: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize',
  n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize', move: 'move', new: 'crosshair' };

function cornerDrag(anchor, ip) {
  const r = cropRatio();
  let w = Math.abs(ip.x - anchor.x), h = Math.abs(ip.y - anchor.y);
  const dx = ip.x >= anchor.x ? 1 : -1, dy = ip.y >= anchor.y ? 1 : -1;
  if (r) {
    if (w / h > r) h = w / r; else w = h * r;
    const maxW = dx > 0 ? W - anchor.x : anchor.x, maxH = dy > 0 ? H - anchor.y : anchor.y;
    if (w > maxW) { w = maxW; h = w / r; }
    if (h > maxH) { h = maxH; w = h * r; }
  }
  crop = { x: dx > 0 ? anchor.x : anchor.x - w, y: dy > 0 ? anchor.y : anchor.y - h, w, h };
}

function cropDown(ip, p) {
  const h = hitCrop(p);
  const o = crop ? { ...crop } : { x: 0, y: 0, w: 0, h: 0 };
  drag = { kind: 'crop', h, start: ip, o };
  const cl = { x: clamp(ip.x, 0, W), y: clamp(ip.y, 0, H) };
  if (h === 'new') { drag.anchor = cl; crop = { x: cl.x, y: cl.y, w: 0, h: 0 }; }
  else if (h.length === 2) {
    drag.anchor = { x: h.includes('w') ? o.x + o.w : o.x, y: h.includes('n') ? o.y + o.h : o.y };
  }
}

function cropMove(ip) {
  const o = drag.o, h = drag.h;
  const cl = { x: clamp(ip.x, 0, W), y: clamp(ip.y, 0, H) };
  if (h === 'move') {
    crop.x = clamp(o.x + ip.x - drag.start.x, 0, W - o.w);
    crop.y = clamp(o.y + ip.y - drag.start.y, 0, H - o.h);
  } else if (h === 'new' || h.length === 2) {
    cornerDrag(drag.anchor, cl);
  } else if (h === 'n' || h === 's') {
    const fixed = h === 'n' ? o.y + o.h : o.y;
    crop.y = Math.min(fixed, cl.y); crop.h = Math.abs(cl.y - fixed);
  } else {
    const fixed = h === 'w' ? o.x + o.w : o.x;
    crop.x = Math.min(fixed, cl.x); crop.w = Math.abs(cl.x - fixed);
  }
  updateCropUI();
}

function updateCropUI() {
  const el = $('#cropSize');
  if (!crop || !base) { el.textContent = '—'; return; }
  el.textContent = `Crop box: ${Math.round(crop.w)} × ${Math.round(crop.h)} px`;
}

/* ======================================================================
   View: zoom, pan, fit
   ====================================================================== */
function fitView() {
  if (!base || !CW) return;
  const pad = CW < 500 ? 12 : 32;
  const s = Math.min((CW - pad * 2) / W, (CH - pad * 2) / H);
  view.s = clamp(s, 0.01, 8);
  view.x = (CW - W * view.s) / 2;
  view.y = (CH - H * view.s) / 2;
  view.fitted = true;
  updateZoomLabel();
  requestRender();
}

function zoomAt(f, sx, sy) {
  if (!base) return;
  const ns = clamp(view.s * f, 0.01, 32);
  const k = ns / view.s;
  view.x = sx - (sx - view.x) * k;
  view.y = sy - (sy - view.y) * k;
  view.s = ns;
  view.fitted = false;
  clampView();
  updateZoomLabel();
  requestRender();
}

function setZoom(s) { zoomAt(s / view.s, CW / 2, CH / 2); }

/* keep at least a bit of the picture on screen */
function clampView() {
  const m = 60;
  view.x = clamp(view.x, m - W * view.s, CW - m);
  view.y = clamp(view.y, m - H * view.s, CH - m);
}

function updateZoomLabel() {
  const z = view.s * 100;
  $('#zoomLabel').textContent = (z < 10 ? z.toFixed(1) : Math.round(z)) + '%';
}

const toImage = (sx, sy) => ({ x: (sx - view.x) / view.s, y: (sy - view.y) / view.s });
const toScreen = (ix, iy) => ({ x: ix * view.s + view.x, y: iy * view.s + view.y });

/* ======================================================================
   Drawing the stage
   ====================================================================== */
let renderQueued = false;
function requestRender() {
  if (!renderQueued) { renderQueued = true; requestAnimationFrame(render); }
}

function makeChecker() {
  const n = Math.max(4, Math.round(8 * dpr));
  const c = newCanvas(n * 2, n * 2), x = c.getContext('2d');
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, n * 2, n * 2);
  x.fillStyle = '#d6dae1'; x.fillRect(0, 0, n, n); x.fillRect(n, n, n, n);
  return sctx.createPattern(c, 'repeat');
}

function imageMatrix() {
  let m = new DOMMatrix().scale(dpr).translate(view.x, view.y).scale(view.s);
  if (previewAngle) m = m.translate(W / 2, H / 2).rotate(previewAngle).translate(-W / 2, -H / 2);
  return m;
}

function render() {
  renderQueued = false;
  const ctx = sctx;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, stage.width, stage.height);
  if (!base) return;
  if (compDirty) rebuildComp();

  const m = imageMatrix();
  // preview background behind the picture
  ctx.setTransform(m);
  ctx.beginPath();
  ctx.rect(0, 0, W, H);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 18 * dpr;
  ctx.fillStyle = opts.bg === 'white' ? '#ffffff' : opts.bg === 'black' ? '#000000'
    : opts.bg === 'color' ? opts.bgColor : (checker || (checker = makeChecker()));
  ctx.fill();
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;

  // the picture
  ctx.setTransform(m);
  ctx.imageSmoothingEnabled = view.s < 2.5;
  ctx.imageSmoothingQuality = 'high';
  if (comparing) {
    ctx.drawImage(base, 0, 0);
  } else {
    if (opts.ghost || tool === 'restore') {
      ctx.globalAlpha = 0.3; ctx.drawImage(base, 0, 0); ctx.globalAlpha = 1;
    }
    ctx.drawImage(comp, 0, 0);
  }

  // overlays in CSS pixels
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (previewAngle) drawGrid(ctx);
  if (tool === 'crop' && crop && !comparing) drawCrop(ctx);
  if (lasso) drawLasso(ctx);
  if ((tool === 'erase' || tool === 'restore') && pointer.inside && !spaceDown && !pinch && !(drag && drag.kind === 'pan')) {
    const r = opts.brushSize / 2;
    ctx.beginPath(); ctx.arc(pointer.x, pointer.y, r, 0, Math.PI * 2);
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.stroke();
    ctx.lineWidth = 1.5; ctx.strokeStyle = tool === 'erase' ? '#fff' : '#7ef0b8'; ctx.stroke();
    if (opts.brushSoft > 0 && r > 6) {
      ctx.beginPath(); ctx.arc(pointer.x, pointer.y, r * (1 - opts.brushSoft / 100), 0, Math.PI * 2);
      ctx.setLineDash([3, 3]); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.stroke(); ctx.setLineDash([]);
    }
  }
}

function drawGrid(ctx) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(255,255,255,.22)';
  ctx.beginPath();
  for (let x = 40; x < CW; x += 40) { ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, CH); }
  for (let y = 40; y < CH; y += 40) { ctx.moveTo(0, y + 0.5); ctx.lineTo(CW, y + 0.5); }
  ctx.stroke();
}

function drawCrop(ctx) {
  const { hs, a, b } = cropHandles();
  const ia = toScreen(0, 0), ib = toScreen(W, H);
  ctx.fillStyle = 'rgba(0,0,0,.55)';
  ctx.beginPath();
  ctx.rect(ia.x, ia.y, ib.x - ia.x, ib.y - ia.y);
  ctx.rect(a.x, a.y, b.x - a.x, b.y - a.y);
  ctx.fill('evenodd');
  // thirds
  ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 1; i < 3; i++) {
    const x = a.x + (b.x - a.x) * i / 3, y = a.y + (b.y - a.y) * i / 3;
    ctx.moveTo(x, a.y); ctx.lineTo(x, b.y); ctx.moveTo(a.x, y); ctx.lineTo(b.x, y);
  }
  ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
  ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
  for (const k in hs) {
    const [x, y] = hs[k];
    ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.rect(x - 5, y - 5, 10, 10); ctx.fill(); ctx.stroke();
  }
  // size label
  const label = `${Math.round(crop.w)} × ${Math.round(crop.h)}`;
  ctx.font = '600 12px system-ui, sans-serif';
  const tw = ctx.measureText(label).width + 12;
  const lx = clamp((a.x + b.x) / 2 - tw / 2, 4, CW - tw - 4), ly = clamp(b.y + 8, 4, CH - 26);
  ctx.fillStyle = 'rgba(0,0,0,.75)';
  ctx.beginPath(); ctx.rect(lx, ly, tw, 20); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillText(label, lx + 6, ly + 14);
}

function drawLasso(ctx) {
  const pts = lasso.pts.map((p) => toScreen(p.x, p.y));
  if (!pts.length) return;
  const live = lasso.poly && pointer.inside ? pts.concat([{ x: pointer.x, y: pointer.y }]) : pts;
  const tint = opts.lassoMode === 'restore' ? 'rgba(62,207,142,.22)' : 'rgba(255,80,80,.22)';
  ctx.beginPath();
  if (opts.lassoMode === 'outside') {
    const ia = toScreen(0, 0), ib = toScreen(W, H);
    ctx.rect(ia.x, ia.y, ib.x - ia.x, ib.y - ia.y);
  }
  ctx.moveTo(live[0].x, live[0].y);
  for (let i = 1; i < live.length; i++) ctx.lineTo(live[i].x, live[i].y);
  ctx.closePath();
  ctx.fillStyle = tint;
  ctx.fill('evenodd');

  ctx.beginPath();
  ctx.moveTo(live[0].x, live[0].y);
  for (let i = 1; i < live.length; i++) ctx.lineTo(live[i].x, live[i].y);
  if (!lasso.poly) ctx.closePath();
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(0,0,0,.8)'; ctx.stroke();
  ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.setLineDash([]);

  if (lasso.poly) {
    for (let i = 0; i < pts.length; i++) {
      ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, i === 0 ? 6 : 3, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#4f8cff' : '#fff'; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,.7)'; ctx.stroke();
    }
  }
}

/* ======================================================================
   Pointer input
   ====================================================================== */
function localPt(e) {
  const r = stage.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}
const inImage = (ip) => ip.x >= 0 && ip.y >= 0 && ip.x < W && ip.y < H;

stage.addEventListener('pointerdown', (e) => {
  if (!base) return;
  const p = localPt(e);
  Object.assign(pointer, p, { inside: true });
  try { stage.setPointerCapture(e.pointerId); } catch (err) {}

  if (e.pointerType === 'touch') {
    touches.set(e.pointerId, p);
    if (touches.size === 2) { startPinch(); return; }
    if (touches.size > 2) return;
  }
  if (e.button === 1 || spaceDown || tool === 'pan') {
    e.preventDefault();
    drag = { kind: 'pan', sx: p.x, sy: p.y, vx: view.x, vy: view.y };
    updateCursor();
    return;
  }
  if (e.button !== 0) return;
  if (previewAngle) { toast('Apply or reset the Straighten turn first.'); return; }

  const ip = toImage(p.x, p.y);
  if (tool === 'wand') {
    if (inImage(ip)) runWand(Math.floor(ip.x), Math.floor(ip.y), e.shiftKey || e.altKey);
  } else if (tool === 'erase' || tool === 'restore') {
    startStroke(ip, e);
  } else if (tool === 'lasso') {
    if (opts.lassoShape === 'poly') {
      if (!lasso) lasso = { pts: [ip], poly: true };
      else {
        const f = toScreen(lasso.pts[0].x, lasso.pts[0].y);
        if (lasso.pts.length >= 3 && Math.hypot(p.x - f.x, p.y - f.y) < 10) finishPoly();
        else lasso.pts.push(ip);
      }
    } else {
      lasso = { pts: [ip], poly: false };
      drag = { kind: 'lasso' };
    }
  } else if (tool === 'crop') {
    cropDown(ip, p);
  }
  requestRender();
});

stage.addEventListener('pointermove', (e) => {
  const p = localPt(e);
  Object.assign(pointer, p, { inside: true });
  if (touches.has(e.pointerId)) {
    touches.set(e.pointerId, p);
    if (pinch) { updatePinch(); return; }
  }
  if (drag) {
    if (drag.kind === 'pan') {
      view.x = drag.vx + p.x - drag.sx;
      view.y = drag.vy + p.y - drag.sy;
      view.fitted = false;
      clampView();
    } else if (drag.kind === 'stroke') {
      let evs = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
      if (!evs || !evs.length) evs = [e];
      for (const ev of evs) { const q = localPt(ev); strokeTo(toImage(q.x, q.y)); }
    } else if (drag.kind === 'lasso' && lasso) {
      const last = toScreen(lasso.pts[lasso.pts.length - 1].x, lasso.pts[lasso.pts.length - 1].y);
      if (Math.hypot(p.x - last.x, p.y - last.y) > 2) lasso.pts.push(toImage(p.x, p.y));
    } else if (drag.kind === 'crop') {
      cropMove(toImage(p.x, p.y));
    }
  } else if (tool === 'crop' && base) {
    const c = CROP_CURSORS[hitCrop(p)];
    if (c !== cropCursor) { cropCursor = c; updateCursor(); }
  }
  requestRender();
});

function endPointer(e) {
  touches.delete(e.pointerId);
  if (pinch) { if (touches.size < 2) pinch = null; return; }
  if (!drag) return;
  if (drag.kind === 'stroke') endStroke();
  else if (drag.kind === 'lasso' && lasso) applyLasso(lasso.pts);
  else if (drag.kind === 'crop') {
    if (crop && (crop.w < 2 || crop.h < 2)) crop = { ...drag.o };
    updateCropUI();
  }
  drag = null;
  updateCursor();
  updateUI();
  requestRender();
}
stage.addEventListener('pointerup', endPointer);
stage.addEventListener('pointercancel', endPointer);
stage.addEventListener('pointerleave', () => { pointer.inside = false; requestRender(); });
stage.addEventListener('dblclick', (e) => {
  if (!base) return;
  if (tool === 'lasso' && lasso && lasso.poly) { finishPoly(); return; }
  if (tool === 'crop' && crop && hitCrop(localPt(e)) === 'move') applyCrop();
});
stage.addEventListener('contextmenu', (e) => { if (base) e.preventDefault(); });

stage.addEventListener('wheel', (e) => {
  if (!base) return;
  e.preventDefault();
  const p = localPt(e);
  let dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
  const f = Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.002));
  zoomAt(clamp(f, 0.5, 2), p.x, p.y);
}, { passive: false });

function startPinch() {
  const [a, b] = Array.from(touches.values());
  // a two-finger touch that began as a short brush stroke shouldn't leave a mark
  if (drag && drag.kind === 'stroke' && performance.now() - drag.t0 < 300 && undoStack.length) {
    const s = undoStack.pop();
    restoreSnap(s);
  } else if (drag && drag.kind === 'stroke') endStroke();
  if (drag && drag.kind === 'lasso') lasso = null;
  drag = null;
  pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, s: view.s, vx: view.x, vy: view.y };
}
function updatePinch() {
  const [a, b] = Array.from(touches.values());
  const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const ns = clamp(pinch.s * d / pinch.d, 0.01, 32);
  const ix = (pinch.mx - pinch.vx) / pinch.s, iy = (pinch.my - pinch.vy) / pinch.s;
  view.s = ns; view.x = mx - ix * ns; view.y = my - iy * ns; view.fitted = false;
  updateZoomLabel();
  requestRender();
}

function updateCursor() {
  let c = 'default';
  if (base) {
    if (drag && drag.kind === 'pan') c = 'grabbing';
    else if (spaceDown || tool === 'pan') c = 'grab';
    else if (tool === 'erase' || tool === 'restore') c = 'none';
    else if (tool === 'crop') c = drag && drag.kind === 'crop' ? CROP_CURSORS[drag.h] : cropCursor;
    else c = 'crosshair';
  }
  stage.style.cursor = c;
}

/* ======================================================================
   Tools + settings UI
   ====================================================================== */
const TOOL_TITLES = { pan: 'Move', wand: 'Magic Wand', erase: 'Eraser', restore: 'Restore brush', lasso: 'Lasso', crop: 'Crop' };

function setTool(t) {
  if (lasso) lasso = null;
  if (drag) return;
  tool = t;
  $$('.tool').forEach((b) => b.classList.toggle('active', b.dataset.tool === t));
  $$('[data-for]').forEach((el) => { el.hidden = !el.dataset.for.split(' ').includes(t); });
  $$('[data-only]').forEach((el) => { el.hidden = el.dataset.only !== t; });
  $('#toolTitle').textContent = TOOL_TITLES[t];
  if (t === 'crop' && base) resetCrop(); else crop = null;
  cropCursor = 'crosshair';
  updateCursor();
  updateHint();
  requestRender();
}

function updateHint() {
  let h = '';
  if (!base) h = 'Open a picture to begin.';
  else if (tool === 'pan') h = 'Drag to move around · scroll to zoom';
  else if (tool === 'wand') h = 'Click a color to remove it · Shift-click to do the opposite';
  else if (tool === 'erase') h = 'Paint to remove · [ ] brush size · Space-drag to move';
  else if (tool === 'restore') h = 'Paint to bring parts back · removed parts show faintly';
  else if (tool === 'lasso') h = opts.lassoShape === 'poly' ? 'Click corners · click the first corner or press Enter to finish' : 'Draw around an area and let go';
  else if (tool === 'crop') h = 'Drag the box or its corners · Enter to crop · Esc to reset';
  $('#stHint').textContent = h;
  $$('[data-shape]').forEach((el) => { el.hidden = el.dataset.shape !== opts.lassoShape; });
}

function setOpt(name, val) {
  opts[name] = val;
  saveOpts();
  syncControl(name);
  onOptChange(name);
}

function syncControl(name) {
  $$(`[data-opt="${name}"]`).forEach((el) => {
    if (el.classList.contains('seg')) {
      el.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.val === String(opts[name])));
    } else if (el.type === 'checkbox') el.checked = !!opts[name];
    else el.value = opts[name];
  });
  const out = $(`[data-out="${name}"]`);
  if (out) out.textContent = name === 'brushSize' ? opts[name] + ' px' : name === 'brushSoft' ? opts[name] + '%' : opts[name];
}

function onOptChange(name) {
  if (['autoTol', 'autoSoft', 'autoTop', 'autoBottom', 'autoLeft', 'autoRight', 'autoHoles'].includes(name)) scheduleRetune('auto');
  if (['wandTol', 'wandSoft', 'wandContig'].includes(name)) scheduleRetune('wand');
  if (name === 'cropRatio' && crop) { fitCropToRatio(); updateCropUI(); }
  if (name === 'lassoShape') { lasso = null; updateHint(); }
  if (name === 'bgColor' && opts.bg !== 'color') { setOpt('bg', 'color'); return; }
  requestRender();
}

function bindControls() {
  $$('[data-opt]').forEach((el) => {
    const name = el.dataset.opt;
    if (el.classList.contains('seg')) {
      el.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (b) setOpt(name, b.dataset.val);
      });
    } else if (el.type === 'checkbox') {
      el.addEventListener('change', () => setOpt(name, el.checked));
    } else if (el.type === 'range') {
      el.addEventListener('input', () => setOpt(name, +el.value));
    } else {
      el.addEventListener('input', () => setOpt(name, el.value));
    }
    syncControl(name);
  });
}

/* Explaining notes end in a circled i that folds them away (remembered per note). */
const NOTE_KEY = 'png_creator_notes_v1';
function setupNotes() {
  let folded = {};
  try { folded = JSON.parse(localStorage.getItem(NOTE_KEY)) || {}; } catch (e) {}
  $$('.note').forEach((n) => {
    const text = document.createElement('span');
    text.className = 'note-text';
    while (n.firstChild) text.appendChild(n.firstChild);
    const btn = document.createElement('button');
    btn.className = 'i-btn';
    btn.type = 'button';
    btn.textContent = 'i';
    n.append(text, btn);
    const id = n.dataset.note;
    const apply = () => {
      const f = !!folded[id];
      n.classList.toggle('folded', f);
      btn.title = f ? text.textContent.trim() : 'Hide this tip';
      btn.setAttribute('aria-label', f ? 'Show tip' : 'Hide tip');
    };
    btn.addEventListener('click', () => {
      folded[id] = !folded[id];
      try { localStorage.setItem(NOTE_KEY, JSON.stringify(folded)); } catch (e) {}
      apply();
    });
    apply();
  });
}

function updateAngleUI() {
  $('#angleOut').textContent = (previewAngle > 0 ? '+' : '') + previewAngle + '°';
  $('#angleApply').disabled = !previewAngle;
  $('#angleReset').disabled = !previewAngle;
}

function updateUI() {
  const has = !!base;
  $('#empty').hidden = has;
  $('#zoombar').hidden = !has;
  ['#downloadBtn', '#copyBtn', '#compareBtn', '#autoBtn', '#rotL', '#rotR', '#flipH', '#flipV', '#angle',
    '#rsW', '#rsH', '#rsApply', '#shrinkBtn', '#growBtn', '#softenBtn', '#invertBtn', '#trimBtn', '#trimBtn2',
    '#resetMaskBtn', '#cropApply', '#cropReset'].forEach((s) => { $(s).disabled = !has; });
  $$('[data-pct]').forEach((b) => { b.disabled = !has; });
  $('#undoBtn').disabled = !undoStack.length;
  $('#redoBtn').disabled = !redoStack.length;
  $('#stInfo').textContent = has ? `${fileName} · ${W} × ${H} px` : 'No picture open';
  if (has && document.activeElement !== $('#rsW') && document.activeElement !== $('#rsH')) {
    $('#rsW').value = W; $('#rsH').value = H;
  }
  updateAngleUI();
  updateLiveNotes();
  updateCropUI();
  updateHint();
  updateCursor();
}

/* ======================================================================
   Save / copy
   ====================================================================== */
function readyToExport() {
  if (!base) return false;
  if (previewAngle) { toast('Apply or reset the Straighten turn first.'); return false; }
  if (tool === 'crop' && crop && (Math.round(crop.w) !== W || Math.round(crop.h) !== H)) {
    toast('Press Apply crop first, or pick another tool to skip it.');
    return false;
  }
  if (compDirty) rebuildComp();
  return true;
}

function download() {
  if (!readyToExport()) return;
  comp.toBlob((blob) => {
    if (!blob) { toast('Sorry, the PNG could not be made.'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName + '-no-background.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    dirty = false;
    toast('Saved ' + a.download);
  }, 'image/png');
}

async function copyImage() {
  if (!readyToExport()) return;
  try {
    const blob = await new Promise((res) => comp.toBlob(res, 'image/png'));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    toast('Copied — paste it into a document or slide.');
  } catch (e) {
    toast("This browser wouldn't copy pictures. Use Download PNG instead.");
  }
}

/* ======================================================================
   Little helpers: toast, busy overlay, sample picture
   ====================================================================== */
let toastTimer = 0;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

function busy(fn, label, show) {
  if (!show) { fn(); return; }
  $('#busyText').textContent = label || 'Working…';
  $('#busy').hidden = false;
  setTimeout(() => {
    try { fn(); } finally { $('#busy').hidden = true; updateUI(); }
  }, 30);
}

function roundRectPath(x, l, t, w, h, r) {
  x.beginPath();
  x.moveTo(l + r, t); x.lineTo(l + w - r, t); x.quadraticCurveTo(l + w, t, l + w, t + r);
  x.lineTo(l + w, t + h - r); x.quadraticCurveTo(l + w, t + h, l + w - r, t + h);
  x.lineTo(l + r, t + h); x.quadraticCurveTo(l, t + h, l, t + h - r);
  x.lineTo(l, t + r); x.quadraticCurveTo(l, t, l + r, t);
  x.closePath();
}

function makeSample() {
  const w = 960, h = 720;
  const c = newCanvas(w, h), x = c.getContext('2d');
  // plain studio-like background with a little grain
  x.fillStyle = '#d5e4f0'; x.fillRect(0, 0, w, h);
  const id = x.getImageData(0, 0, w, h);
  for (let i = 0; i < id.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 9;
    id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n;
  }
  x.putImageData(id, 0, 0);
  // handle (leaves a see-through hole the Magic Wand can click)
  x.lineWidth = 40; x.strokeStyle = '#1d8079';
  x.beginPath(); x.ellipse(596, 380, 84, 92, 0, -Math.PI / 2, Math.PI / 2); x.stroke();
  // mug body
  const g = x.createLinearGradient(330, 0, 610, 0);
  g.addColorStop(0, '#1f8e86'); g.addColorStop(0.45, '#35b5aa'); g.addColorStop(1, '#16736d');
  x.fillStyle = g;
  roundRectPath(x, 330, 230, 280, 320, 34); x.fill();
  // rim + coffee
  x.fillStyle = '#e8f6f3'; x.beginPath(); x.ellipse(470, 232, 140, 28, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#5a3420'; x.beginPath(); x.ellipse(470, 236, 120, 19, 0, 0, Math.PI * 2); x.fill();
  // star
  x.fillStyle = '#ffd34d';
  x.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 26 : 62;
    x.lineTo(470 + Math.cos(a) * r, 400 + Math.sin(a) * r);
  }
  x.closePath(); x.fill();
  // steam
  x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 9; x.lineCap = 'round';
  for (const sx of [420, 470, 520]) {
    x.beginPath(); x.moveTo(sx, 190);
    x.bezierCurveTo(sx - 25, 160, sx + 25, 130, sx, 95); x.stroke();
  }
  return c;
}

/* ======================================================================
   Wiring
   ====================================================================== */
function resizeStage() {
  const r = wrap.getBoundingClientRect();
  const ndpr = window.devicePixelRatio || 1;
  if (ndpr !== dpr) checker = null;
  dpr = ndpr;
  CW = r.width; CH = r.height;
  stage.width = Math.max(1, Math.round(CW * dpr));
  stage.height = Math.max(1, Math.round(CH * dpr));
  if (base) { view.fitted ? fitView() : clampView(); }
  requestRender();
}
new ResizeObserver(resizeStage).observe(wrap);
window.addEventListener('resize', resizeStage);
resizeStage();

$$('.tool').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
$('#openBtn').addEventListener('click', () => fileInput.click());
$('#emptyOpen').addEventListener('click', () => fileInput.click());
$('#sampleBtn').addEventListener('click', () => setImage(makeSample(), 'sample-mug'));
fileInput.addEventListener('change', () => { openFile(fileInput.files[0]); fileInput.value = ''; });
$('#undoBtn').addEventListener('click', undo);
$('#redoBtn').addEventListener('click', redo);
$('#downloadBtn').addEventListener('click', download);
$('#copyBtn').addEventListener('click', copyImage);

const cmp = $('#compareBtn');
const cmpOn = (e) => { if (!base) return; e.preventDefault(); comparing = true; requestRender(); };
const cmpOff = () => { if (comparing) { comparing = false; requestRender(); } };
cmp.addEventListener('pointerdown', cmpOn);
cmp.addEventListener('pointerup', cmpOff);
cmp.addEventListener('pointerleave', cmpOff);
cmp.addEventListener('pointercancel', cmpOff);

$('#autoBtn').addEventListener('click', runAuto);
$('#rotL').addEventListener('click', () => rotate90(-1));
$('#rotR').addEventListener('click', () => rotate90(1));
$('#flipH').addEventListener('click', () => flip(true));
$('#flipV').addEventListener('click', () => flip(false));
$('#angle').addEventListener('input', (e) => {
  previewAngle = +e.target.value;
  lasso = null;
  updateAngleUI();
  requestRender();
});
$('#angleApply').addEventListener('click', () => {
  const a = previewAngle;
  previewAngle = 0; $('#angle').value = 0;
  rotateFree(a);
  updateAngleUI();
});
$('#angleReset').addEventListener('click', () => { previewAngle = 0; $('#angle').value = 0; updateAngleUI(); requestRender(); });

$('#rsW').addEventListener('input', () => {
  if (opts.lockRatio && base) { const v = +$('#rsW').value; if (v > 0) $('#rsH').value = Math.max(1, Math.round(v * H / W)); }
});
$('#rsH').addEventListener('input', () => {
  if (opts.lockRatio && base) { const v = +$('#rsH').value; if (v > 0) $('#rsW').value = Math.max(1, Math.round(v * W / H)); }
});
for (const id of ['#rsW', '#rsH']) {
  $(id).addEventListener('keydown', (e) => { if (e.key === 'Enter') resizeTo(+$('#rsW').value, +$('#rsH').value); });
}
$$('[data-pct]').forEach((b) => b.addEventListener('click', () => {
  const p = +b.dataset.pct / 100;
  $('#rsW').value = Math.max(1, Math.round(W * p));
  $('#rsH').value = Math.max(1, Math.round(H * p));
}));
$('#rsApply').addEventListener('click', () => resizeTo(+$('#rsW').value, +$('#rsH').value));

$('#shrinkBtn').addEventListener('click', () => maskOp('shrink'));
$('#growBtn').addEventListener('click', () => maskOp('grow'));
$('#softenBtn').addEventListener('click', () => maskOp('soften'));
$('#invertBtn').addEventListener('click', () => maskOp('invert'));
$('#resetMaskBtn').addEventListener('click', () => maskOp('reset'));
$('#trimBtn').addEventListener('click', trimEmpty);
$('#trimBtn2').addEventListener('click', trimEmpty);
$('#cropApply').addEventListener('click', applyCrop);
$('#cropReset').addEventListener('click', () => { resetCrop(); requestRender(); });

$('#zoomIn').addEventListener('click', () => setZoom(view.s * 1.25));
$('#zoomOut').addEventListener('click', () => setZoom(view.s / 1.25));
$('#zoomFit').addEventListener('click', fitView);
$('#zoom100').addEventListener('click', () => setZoom(1));

/* keyboard */
window.addEventListener('keydown', (e) => {
  const t = e.target;
  const typing = t.matches && t.matches('input[type=number], input[type=text], textarea, select');
  const onControl = t.matches && t.matches('button, input, select');
  const mod = e.metaKey || e.ctrlKey;
  const k = e.key.toLowerCase();
  if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if (mod && k === 'y') { e.preventDefault(); redo(); return; }
  if (mod && k === 's') { e.preventDefault(); download(); return; }
  if (mod && k === 'o') { e.preventDefault(); fileInput.click(); return; }
  if (mod && k === '0') { e.preventDefault(); fitView(); return; }
  if (mod && (k === '=' || k === '+')) { e.preventDefault(); setZoom(view.s * 1.25); return; }
  if (mod && k === '-') { e.preventDefault(); setZoom(view.s / 1.25); return; }
  if (typing || mod || e.altKey) return;
  if (e.key === ' ') {
    if (base) { e.preventDefault(); if (!spaceDown) { spaceDown = true; updateCursor(); requestRender(); } }
    return;
  }
  const toolKeys = { v: 'pan', h: 'pan', w: 'wand', e: 'erase', b: 'erase', r: 'restore', l: 'lasso', c: 'crop' };
  if (toolKeys[k]) { setTool(toolKeys[k]); return; }
  if (e.key === '[' || e.key === ']') {
    const f = e.key === '[' ? 1 / 1.2 : 1.2;
    setOpt('brushSize', clamp(Math.round(opts.brushSize * f + (f > 1 ? 1 : -1)), 2, 300));
    return;
  }
  if (onControl) return;
  if (e.key === 'Enter') {
    if (lasso && lasso.poly) finishPoly();
    else if (tool === 'crop') applyCrop();
    else if (previewAngle) $('#angleApply').click();
  } else if (e.key === 'Escape') {
    if (lasso) { lasso = null; requestRender(); }
    else if (previewAngle) $('#angleReset').click();
    else if (tool === 'crop') { resetCrop(); requestRender(); }
  } else if (e.key === 'Backspace' || e.key === 'Delete') {
    if (lasso && lasso.poly) { e.preventDefault(); lasso.pts.pop(); if (!lasso.pts.length) lasso = null; requestRender(); }
  }
});
window.addEventListener('keyup', (e) => {
  if (e.key === ' ') {
    if (spaceDown) e.preventDefault();
    spaceDown = false; updateCursor(); requestRender();
  }
});
window.addEventListener('blur', () => { spaceDown = false; comparing = false; updateCursor(); requestRender(); });

/* paste + drag and drop */
window.addEventListener('paste', (e) => {
  const items = e.clipboardData ? Array.from(e.clipboardData.items) : [];
  const it = items.find((i) => i.kind === 'file' && i.type.startsWith('image/'));
  if (it) { e.preventDefault(); openFile(it.getAsFile()); }
});
let dragDepth = 0;
window.addEventListener('dragenter', (e) => {
  if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) { dragDepth++; $('#dropHint').hidden = false; }
});
window.addEventListener('dragleave', () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) $('#dropHint').hidden = true; });
window.addEventListener('dragover', (e) => { e.preventDefault(); });
window.addEventListener('drop', (e) => {
  e.preventDefault();
  dragDepth = 0; $('#dropHint').hidden = true;
  const f = e.dataTransfer && e.dataTransfer.files[0];
  if (f) openFile(f);
});

window.addEventListener('beforeunload', (e) => {
  if (base && dirty) { e.preventDefault(); e.returnValue = ''; }
});

bindControls();
setupNotes();
setTool('wand');
updateUI();

// for testing from the console
window.__bgr = { get state() { return { W, H, tool, view: { ...view }, undo: undoStack.length, redo: redoStack.length, lastOp: lastOp && lastOp.kind, crop }; },
  setImage, makeSample, readMaskAlpha, runAuto, runWand, applyLasso, applyCrop, rotate90, flip, rotateFree, resizeTo, trimEmpty, maskOp,
  setTool, setOpt, undo, redo, get comp() { if (compDirty) rebuildComp(); return comp; }, toImage, toScreen };
})();

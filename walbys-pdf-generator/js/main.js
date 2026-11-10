/* Walby's PDF Generator — the editor: stage, tools, pages, properties, files. */

import { PAPERS, MARGIN, pageSize, uid, clamp, rotatePt, deepCopy, debounce, downloadBlob,
  safeFileName, blobToBase64, base64ToBlob } from './util.js';
import { initText, layoutText, cssFont, LINE } from './text.js';
import { center, bounds, moveItem, refitText, corners } from './shapes.js';
import { itemTransform, itemInner, itemOpacity, pageSvg } from './render.js';
import { assets, importFile, onPreviewReady, forgetAssetCaches, pdfjs } from './assets.js';
import * as store from './store.js';
import { buildPdf } from './export.js';

const NS = 'http://www.w3.org/2000/svg';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const PX_PER_PT = 96 / 72;                         // 100% zoom = real size on screen
const ZOOMS = [25, 33, 50, 67, 75, 90, 100, 125, 150, 200, 300, 400];
const SWATCHES = ['#1f1f1f', '#6b6b6b', '#c4c4c4', '#ffffff', '#d92d20', '#f08c00', '#f5c400',
  '#2f9e44', '#1c9bd6', '#2f55d4', '#7b4fd6', '#d6336c', '#8a5a2b'];
const CLIP_MARK = 'walbys-pdf-generator:items:';
const PREF_KEY = 'walbys-pdf-generator:prefs';
const TYPE_NAMES = { image: 'Photo', pdfpage: 'PDF page', text: 'Text', line: 'Line', rect: 'Rectangle',
  ellipse: 'Ellipse', pen: 'Drawing' };
const TOOL_NAMES = { pen: 'Freehand', line: 'Line', arrow: 'Arrow', rect: 'Rectangle', ellipse: 'Ellipse', text: 'Text' };

const S = {
  doc: null,
  page: 0,
  sel: [],
  hover: null,
  tool: 'select',
  zoom: 1,           // screen pixels per point
  fit: true,
  guides: true,
  snap: [],
  editing: null,     // id of the text box being typed in
  style: {
    stroke: '#1f1f1f', fill: 'none', width: 2, dash: 'solid', radius: 0,
    font: 'sans', size: 24, bold: false, italic: false, align: 'left', color: '#1f1f1f',
  },
};

/* ---------------- small helpers ---------------- */
const newPage = (orient = 'portrait') => ({ id: uid(), orient, items: [] });
const newDoc = () => ({ v: 1, name: 'Untitled', paper: 'letter', pages: [newPage()] });
const curPage = () => S.doc.pages[S.page];
const pageWH = (pg = curPage()) => pageSize(S.doc, pg);
const findItem = (id) => curPage().items.find((i) => i.id === id);
const selItems = () => S.sel.map(findItem).filter(Boolean);
const isPicture = (it) => it.type === 'image' || it.type === 'pdfpage';
const docHasContent = () => S.doc.pages.length > 1 || S.doc.pages.some((p) => p.items.length);
const isTyping = () => {
  const a = document.activeElement;
  return a && (a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || (a.tagName === 'INPUT' && !['range', 'button', 'checkbox', 'color'].includes(a.type)));
};

function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
    if (p.style) Object.assign(S.style, p.style);
    if (typeof p.guides === 'boolean') S.guides = p.guides;
  } catch { /* private window: defaults */ }
}
const savePrefs = debounce(() => {
  try { localStorage.setItem(PREF_KEY, JSON.stringify({ style: S.style, guides: S.guides })); } catch { /* ignore */ }
}, 300);

let toastTimer;
function toast(msg, ms = 3400) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

/* A small dialog. buttons: [{ label, value, primary, now }] — `now` runs inside
   the click itself (needed to open a browser tab without a pop-up block). */
function modal({ title, body = '', buttons = [], dismiss = true, onOpen }) {
  return new Promise((resolve) => {
    const m = $('#modal');
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = body;
    const box = $('#modalBtns');
    box.innerHTML = '';
    const done = (v) => { m.hidden = true; window.removeEventListener('keydown', key, true); resolve(v); };
    for (const b of buttons) {
      const el = document.createElement('button');
      el.textContent = b.label;
      if (b.primary) el.className = 'primary';
      el.onclick = () => { if (b.now) b.now(); done(b.value); };
      box.appendChild(el);
    }
    const key = (e) => {
      if (e.key === 'Escape' && dismiss) { e.preventDefault(); e.stopPropagation(); done(null); }
      if (e.key === 'Enter') {
        const p = buttons.find((b) => b.primary);
        if (p) { e.preventDefault(); e.stopPropagation(); if (p.now) p.now(); done(p.value); }
      }
    };
    window.addEventListener('keydown', key, true);
    m.hidden = false;
    m._close = () => done(null);
    if (onOpen) onOpen(m);
    else (box.querySelector('.primary') || box.lastChild)?.focus();
  });
}
const closeModal = () => { const m = $('#modal'); if (!m.hidden && m._close) m._close(); };

/* ---------------- history & saving ---------------- */
const past = [], future = [];
let coalesceKey = null, coalesceAt = 0;
const snapshot = () => JSON.stringify({ doc: S.doc, page: S.page, sel: S.sel });

/* Call BEFORE changing the document. Repeats with the same key within a
   moment (a slider being dragged, arrow-key nudges) make one undo step. */
function checkpoint(key = null) {
  const now = performance.now();
  if (key && key === coalesceKey && now - coalesceAt < 1500) { coalesceAt = now; return; }
  coalesceKey = key; coalesceAt = now;
  past.push(snapshot());
  if (past.length > 200) past.shift();
  future.length = 0;
}
function restore(snap) {
  const o = JSON.parse(snap);
  S.doc = o.doc;
  S.page = clamp(o.page, 0, S.doc.pages.length - 1);
  S.sel = o.sel.filter((id) => findItem(id));
  coalesceKey = null;
  changed();
}
function undo() { commitText(); if (!past.length) return; future.push(snapshot()); restore(past.pop()); }
function redo() { commitText(); if (!future.length) return; past.push(snapshot()); restore(future.pop()); }

const saveSoon = debounce(() => store.saveDoc(S.doc).catch((e) => console.warn('autosave failed', e)), 400);
function saveNow() { store.saveDoc(S.doc).catch(() => {}); }

function changed() { renderAll(); saveSoon(); }
function renderAll() { renderStage(); renderInspector(); renderTopbar(); thumbsSoon(); }

/* ---------------- stage ---------------- */
const svg = $('#stage'), gItems = $('#items'), gOver = $('#overlay');
const elCache = new Map();

function toPage(e) {
  const r = svg.getBoundingClientRect();
  return { x: (e.clientX - r.left) / S.zoom, y: (e.clientY - r.top) / S.zoom };
}

function fitZoom() {
  const wrap = $('#stageWrap');
  const [W, H] = pageWH();
  return clamp(Math.min((wrap.clientWidth - 72) / W, (wrap.clientHeight - 72) / H), 0.1, 8);
}

function renderStage() {
  const [W, H] = pageWH();
  if (S.fit) S.zoom = fitZoom();
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', Math.round(W * S.zoom));
  svg.setAttribute('height', Math.round(H * S.zoom));
  for (const id of ['paperBg', 'stageClipRect']) { $('#' + id).setAttribute('width', W); $('#' + id).setAttribute('height', H); }
  svg.setAttribute('class', S.tool === 'select' ? 'tool-select' : S.tool === 'text' ? 'tool-text' : 'tool-draw');
  $('#zoomLabel').textContent = Math.round((S.zoom / PX_PER_PT) * 100) + '%';
  renderItems();
  renderOverlay();
  $('#emptyHint').hidden = curPage().items.length > 0 || !!S.editing;
  if (S.editing) placeEditor();
}

function renderItems() {
  const seen = new Set();
  let prev = null;
  for (const it of curPage().items) {
    let g = elCache.get(it.id);
    if (!g) { g = document.createElementNS(NS, 'g'); g.dataset.id = it.id; elCache.set(it.id, g); }
    const tf = itemTransform(it);
    if (g.getAttribute('transform') !== tf) g.setAttribute('transform', tf);
    const op = itemOpacity(it);
    if (op) g.setAttribute('opacity', op); else g.removeAttribute('opacity');
    const inner = it.id === S.editing ? '' : itemInner(it, { hit: true, zoom: S.zoom });
    if (g._inner !== inner) { g.innerHTML = inner; g._inner = inner; }
    g.setAttribute('class', 'item' + (it.locked ? ' locked' : ''));
    const want = prev ? prev.nextSibling : gItems.firstChild;
    if (want !== g) gItems.insertBefore(g, want);
    prev = g;
    seen.add(it.id);
  }
  for (const [id, g] of elCache) if (!seen.has(id)) { g.remove(); elCache.delete(id); }
}

const DIRS = { nw: [-1, -1], n: [0, -1], ne: [1, -1], e: [1, 0], se: [1, 1], s: [0, 1], sw: [-1, 1], w: [-1, 0] };
const CURSORS = ['ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize'];
function handleCursor(hx, hy, rot) {
  const a = (Math.atan2(hy, hx) * 180) / Math.PI + (rot || 0);
  return CURSORS[Math.round((((a % 180) + 180) % 180) / 45) % 4];
}

function outline(it, px, cls = 'sel') {
  const pts = corners(it).map((p) => `${p.x},${p.y}`).join(' ');
  const col = cls === 'hover' ? '#7fa2ff' : '#2f6bff';
  if (it.type === 'line') {
    return `<line x1="${it.x1}" y1="${it.y1}" x2="${it.x2}" y2="${it.y2}" stroke="${col}" stroke-width="${px}" stroke-dasharray="${cls === 'locked' ? `${4 * px} ${3 * px}` : 'none'}"/>`;
  }
  return `<polygon points="${pts}" fill="none" stroke="${col}" stroke-width="${cls === 'hover' ? 1.5 * px : px}"${cls === 'locked' ? ` stroke-dasharray="${4 * px} ${3 * px}"` : ''}/>`;
}

function renderOverlay() {
  const z = S.zoom, px = 1 / z;
  const [W, H] = pageWH();
  let s = '';
  if (S.guides) {
    s += `<rect x="${MARGIN}" y="${MARGIN}" width="${W - 2 * MARGIN}" height="${H - 2 * MARGIN}" fill="none" stroke="#9db4f5" stroke-width="${px}" stroke-dasharray="${5 * px} ${4 * px}" opacity=".8"/>`;
  }
  for (const g of S.snap) {
    s += g.x != null
      ? `<line x1="${g.x}" y1="0" x2="${g.x}" y2="${H}" stroke="#e8467c" stroke-width="${px}"/>`
      : `<line x1="0" y1="${g.y}" x2="${W}" y2="${g.y}" stroke="#e8467c" stroke-width="${px}"/>`;
  }
  const sel = selItems();
  const hov = S.hover && !S.sel.includes(S.hover) && !drag ? findItem(S.hover) : null;
  if (hov && S.tool === 'select') s += outline(hov, px, 'hover');
  if (!S.editing) {
    if (sel.length === 1) s += handlesFor(sel[0], px);
    else if (sel.length > 1) {
      for (const it of sel) s += outline(it, px, it.locked ? 'locked' : 'sel');
      const b = bounds(sel);
      s += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="none" stroke="#2f6bff" stroke-width="${px}" stroke-dasharray="${3 * px} ${3 * px}"/>`;
    }
  }
  if (drag && drag.kind === 'marquee' && drag.moved) {
    const a = drag.start, b = drag.cur;
    s += `<rect x="${Math.min(a.x, b.x)}" y="${Math.min(a.y, b.y)}" width="${Math.abs(b.x - a.x)}" height="${Math.abs(b.y - a.y)}" fill="rgba(47,107,255,.08)" stroke="#2f6bff" stroke-width="${px}"/>`;
  }
  gOver.innerHTML = s;
}

function handlesFor(it, px) {
  const hs = 9 * px;
  const handle = (x, y, name, cursor, round) => round
    ? `<circle data-h="${name}" cx="${x}" cy="${y}" r="${hs * 0.62}" fill="#fff" stroke="#2f6bff" stroke-width="${1.5 * px}" style="cursor:${cursor}" pointer-events="all"/>`
    : `<rect data-h="${name}" x="${x - hs / 2}" y="${y - hs / 2}" width="${hs}" height="${hs}" rx="${1.5 * px}" fill="#fff" stroke="#2f6bff" stroke-width="${1.5 * px}" style="cursor:${cursor}" pointer-events="all"/>`;
  if (it.locked) {
    const b = bounds([it]);
    return outline(it, px, 'locked') +
      `<g transform="translate(${b.x + b.w} ${b.y}) scale(${px})"><circle r="11" fill="#2f6bff"/><rect x="-5" y="-1" width="10" height="7" rx="1.5" fill="#fff"/><path d="M-3 -1v-2.5a3 3 0 016 0V-1" fill="none" stroke="#fff" stroke-width="1.8"/></g>`;
  }
  if (it.type === 'line') {
    return outline(it, px) + handle(it.x1, it.y1, 'p1', 'move', true) + handle(it.x2, it.y2, 'p2', 'move', true);
  }
  const c = center(it), rot = it.rot || 0, w = it.w, h = it.h;
  let names = Object.keys(DIRS);
  if (isPicture(it)) names = ['nw', 'ne', 'se', 'sw'];
  if (it.type === 'text') names = ['nw', 'ne', 'se', 'sw', 'e', 'w'];
  let s = `<g transform="translate(${c.x} ${c.y}) rotate(${rot})">`;
  s += `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="none" stroke="#2f6bff" stroke-width="${px}"/>`;
  const rotY = -h / 2 - 26 * px;
  s += `<line x1="0" y1="${-h / 2}" x2="0" y2="${rotY}" stroke="#2f6bff" stroke-width="${px}"/>`;
  for (const n of names) {
    const [hx, hy] = DIRS[n];
    s += handle((hx * w) / 2, (hy * h) / 2, n, handleCursor(hx, hy, rot));
  }
  s += handle(0, rotY, 'rot', 'grab', true);
  return s + '</g>';
}

/* ---------------- text editing ---------------- */
const ta = $('#textEditor');
let editStart = null;   // { snap, text, isNew }

function startEdit(it, isNew = false, snap = null) {
  S.editing = it.id;
  S.sel = [it.id];
  editStart = { snap: snap || snapshot(), text: it.text, isNew };
  ta.value = it.text || '';
  ta.hidden = false;
  renderAll();
  placeEditor();
  ta.focus();
  if (isNew) ta.select(); else ta.setSelectionRange(ta.value.length, ta.value.length);
}

function placeEditor() {
  const it = findItem(S.editing);
  if (!it) return;
  const z = S.zoom, pad = 36;
  const extra = it.autoW ? it.size * 1.5 : 0;  // room for the caret; the browser's text is a hair wider
  let left = pad + it.x * z, w = (it.w + extra) * z;
  if (it.autoW && it.align === 'center') left -= (extra * z) / 2;
  if (it.autoW && it.align === 'right') left -= extra * z;
  const ox = pad + (it.x + it.w / 2) * z - left;   // turn about the box's centre
  Object.assign(ta.style, {
    left: left + 'px', top: pad + it.y * z + 'px', width: Math.max(w, 20) + 'px',
    height: Math.max(it.h, it.size * LINE) * z + it.size * z * 0.3 + 'px',
    font: cssFont(it, it.size * z), lineHeight: String(LINE), color: it.color, textAlign: it.align,
    whiteSpace: it.autoW ? 'pre' : 'pre-wrap',
    transform: it.rot ? `rotate(${it.rot}deg)` : '',
    transformOrigin: `${ox}px ${(it.h * z) / 2}px`,
  });
}

ta.addEventListener('input', () => {
  const it = findItem(S.editing);
  if (!it) return;
  it.text = ta.value;
  refitText(it);
  placeEditor();
  renderOverlay();
});
ta.addEventListener('blur', () => commitText());
ta.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { e.preventDefault(); ta.blur(); }
  const mod = e.metaKey || e.ctrlKey;
  if (mod && (e.key === 'b' || e.key === 'i')) {
    e.preventDefault();
    const it = findItem(S.editing);
    if (it) { const k = e.key === 'b' ? 'bold' : 'italic'; it[k] = !it[k]; S.style[k] = it[k]; refitText(it); placeEditor(); renderInspector(); }
  }
  e.stopPropagation();
});

function commitText() {
  if (!S.editing) return;
  const id = S.editing, start = editStart;
  S.editing = null;
  editStart = null;
  ta.hidden = true;
  const pg = curPage(), it = pg.items.find((i) => i.id === id);
  if (it) {
    it.text = ta.value.replace(/\s+$/, '');
    if (!it.text.trim()) {
      pg.items.splice(pg.items.indexOf(it), 1);
      S.sel = S.sel.filter((s) => s !== id);
    } else refitText(it);
    const removedNew = start && start.isNew && !pg.items.includes(it);
    if (start && !removedNew && (it.text !== start.text || start.isNew)) {
      past.push(start.snap);
      future.length = 0;
      coalesceKey = null;
    }
  }
  changed();
}

/* ---------------- pointer: select, move, resize, draw ---------------- */
let drag = null;
let lastClick = {};

function itemAt(e) {
  const el = e.target && e.target.closest ? e.target.closest('.item') : null;
  return el ? findItem(el.dataset.id) : null;
}

svg.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  if (S.editing) ta.blur();
  closeMenus();
  const p = toPage(e);
  svg.setPointerCapture(e.pointerId);
  const h = e.target.closest && e.target.closest('[data-h]');
  if (h && S.sel.length === 1) {
    const it = findItem(S.sel[0]);
    if (it && !it.locked) { drag = { kind: 'handle', h: h.dataset.h, id: it.id, start: p, orig: deepCopy(it), moved: false }; return; }
  }
  if (S.tool === 'select') {
    const it = itemAt(e);
    if (it && !it.locked) {
      if (e.shiftKey && S.sel.includes(it.id)) { S.sel = S.sel.filter((i) => i !== it.id); renderAll(); return; }
      const wasSelected = S.sel.includes(it.id);
      if (e.shiftKey) S.sel = [...S.sel, it.id];
      else if (!wasSelected) S.sel = [it.id];
      const moving = selItems().filter((i) => !i.locked);
      drag = { kind: 'move', start: p, orig: moving.map(deepCopy), bb: bounds(moving), moved: false,
        clicked: it.id, wasSelected: wasSelected && !e.shiftKey };
      renderAll();
      return;
    }
    // Empty paper, or something locked: a selection box. (A click on a locked
    // item still selects it, so it can be unlocked.)
    if (!e.shiftKey) S.sel = it ? [it.id] : [];
    drag = { kind: 'marquee', start: p, cur: p, base: e.shiftKey ? [...S.sel] : [], moved: false };
    renderAll();
    return;
  }
  if (S.tool === 'pen') {
    checkpoint();
    const it = { id: uid(), type: 'pen', x: 0, y: 0, w: 1, h: 1, rot: 0, pts: [p.x, p.y],
      stroke: S.style.stroke === 'none' ? '#1f1f1f' : S.style.stroke, width: S.style.width, dash: S.style.dash };
    curPage().items.push(it);
    S.sel = [];
    drag = { kind: 'pen', it, last: p, moved: true };
    renderStage();
    return;
  }
  drag = { kind: 'create', tool: S.tool, start: p, it: null, moved: false, snap: snapshot() };
});

svg.addEventListener('pointermove', (e) => {
  if (!drag) {
    if (S.tool !== 'select') return;
    const it = itemAt(e), id = it ? it.id : null;
    if (id !== S.hover) { S.hover = id; renderOverlay(); }
    return;
  }
  if (drag.kind === 'pen') {
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    for (const ev of evs.length ? evs : [e]) addPenPoint(drag, toPage(ev));
    renderItems();
    return;
  }
  const p = toPage(e);
  if (!drag.moved) {
    if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) * S.zoom < 3) return;
    drag.moved = true;
    if (drag.kind === 'move' || drag.kind === 'handle') checkpoint();
  }
  if (drag.kind === 'move') dragMove(p, e);
  else if (drag.kind === 'handle') dragHandle(p, e);
  else if (drag.kind === 'marquee') { drag.cur = p; renderOverlay(); }
  else if (drag.kind === 'create') dragCreate(p, e);
});

svg.addEventListener('pointerup', (e) => endDrag(e));
svg.addEventListener('pointercancel', (e) => endDrag(e));

function endDrag(e) {
  const d = drag;
  drag = null;
  S.snap = [];
  if (!d) return;
  if (d.kind === 'move') {
    if (d.moved) { lastClick = {}; changed(); return; }
    // Double-click on text = type in it. (Counted here, on release, because a
    // captured pointer's dblclick lands on the <svg>, not on the text.)
    const now = performance.now(), it = findItem(d.clicked);
    if (it && it.type === 'text' && lastClick.id === it.id && now - lastClick.t < 450) {
      lastClick = {};
      startEdit(it);
      return;
    }
    lastClick = { id: d.clicked, t: now };
    if (d.wasSelected && S.sel.length > 1) { S.sel = [d.clicked]; renderAll(); }
    else renderOverlay();
  } else if (d.kind === 'handle') {
    if (d.moved) changed(); else renderOverlay();
  } else if (d.kind === 'marquee') {
    if (d.moved) {
      const a = d.start, b = d.cur;
      const r = { x0: Math.min(a.x, b.x), y0: Math.min(a.y, b.y), x1: Math.max(a.x, b.x), y1: Math.max(a.y, b.y) };
      const inside = curPage().items.filter((it) => {
        if (it.locked) return false;
        const bb = bounds([it]);
        return bb.x >= r.x0 && bb.y >= r.y0 && bb.x + bb.w <= r.x1 && bb.y + bb.h <= r.y1;
      }).map((it) => it.id);
      S.sel = [...new Set([...d.base, ...inside])];
    }
    renderAll();
  } else if (d.kind === 'pen') {
    finishPen(d.it);
    changed();
  } else if (d.kind === 'create') {
    finishCreate(d, e ? toPage(e) : d.start);
  }
}

function dragMove(p, e) {
  let dx = p.x - drag.start.x, dy = p.y - drag.start.y;
  if (e.shiftKey) { if (Math.abs(dx) > Math.abs(dy)) dy = 0; else dx = 0; }
  S.snap = [];
  if (S.guides && !e.altKey) ({ dx, dy } = snapDelta(drag.bb, dx, dy));
  for (const o of drag.orig) {
    const it = findItem(o.id);
    if (!it) continue;
    if (it.type === 'line') Object.assign(it, { x1: o.x1, y1: o.y1, x2: o.x2, y2: o.y2 });
    else Object.assign(it, { x: o.x, y: o.y });
    moveItem(it, dx, dy);
  }
  renderStage();
}

/* Snap the moving selection's edges / middle to the page's edges, middle and
   half-inch margin. Alt (Option) turns snapping off for one drag. */
function snapDelta(bb, dx, dy) {
  const [W, H] = pageWH(), tol = 6 / S.zoom;
  const best = (targets, edges, d) => {
    let b = null;
    for (const t of targets) for (const ed of edges) {
      const off = t - (ed + d);
      if (Math.abs(off) < tol && (!b || Math.abs(off) < Math.abs(b.off))) b = { off, t };
    }
    return b;
  };
  const bx = best([0, MARGIN, W / 2, W - MARGIN, W], [bb.x, bb.x + bb.w / 2, bb.x + bb.w], dx);
  const by = best([0, MARGIN, H / 2, H - MARGIN, H], [bb.y, bb.y + bb.h / 2, bb.y + bb.h], dy);
  if (bx) { dx += bx.off; S.snap.push({ x: bx.t }); }
  if (by) { dy += by.off; S.snap.push({ y: by.t }); }
  return { dx, dy };
}

function snapAngle(o, p) {
  const a = Math.atan2(p.y - o.y, p.x - o.x), step = Math.PI / 12;
  const s = Math.round(a / step) * step, len = Math.hypot(p.x - o.x, p.y - o.y);
  return { x: o.x + Math.cos(s) * len, y: o.y + Math.sin(s) * len };
}

function dragHandle(p, e) {
  const o = drag.orig, it = findItem(drag.id), h = drag.h;
  if (!it) return;
  if (h === 'rot') {
    const c = center(o);
    let a = (Math.atan2(p.y - c.y, p.x - c.x) * 180) / Math.PI + 90;
    if (e.shiftKey) a = Math.round(a / 15) * 15;
    else { const r = Math.round(a / 90) * 90; if (Math.abs(a - r) < 4) a = r; }
    it.rot = Math.round((((a % 360) + 360) % 360) * 10) / 10;
  } else if (h === 'p1' || h === 'p2') {
    const other = h === 'p1' ? { x: o.x2, y: o.y2 } : { x: o.x1, y: o.y1 };
    const q = e.shiftKey ? snapAngle(other, p) : p;
    if (h === 'p1') { it.x1 = q.x; it.y1 = q.y; } else { it.x2 = q.x; it.y2 = q.y; }
  } else resizeBox(it, o, h, p, e.shiftKey);
  renderStage();
}

/* Resize from a handle while the opposite side stays put — in the item's own
   turned frame, so a rotated photo resizes the way it looks. */
function resizeBox(it, o, h, p, shift) {
  const [hx, hy] = DIRS[h];
  const rot = o.rot || 0, c0 = center(o);
  const textEdge = o.type === 'text' && !hy;
  const ay = textEdge ? -o.h / 2 : (-hy * o.h) / 2;     // text keeps its top edge
  const ar = rotatePt((-hx * o.w) / 2, ay, rot);
  const A = { x: c0.x + ar.x, y: c0.y + ar.y };
  const d = rotatePt(p.x - A.x, p.y - A.y, -rot);
  let nw = hx ? Math.max(4, hx * d.x) : o.w;
  let nh = hy ? Math.max(4, hy * d.y) : o.h;
  const corner = hx && hy;
  const keep = isPicture(o) ? !shift : o.type === 'text' ? true : shift;
  if (corner && keep) {
    const s = Math.max(nw / o.w, nh / o.h);
    nw = Math.max(4, o.w * s); nh = Math.max(4, o.h * s);
  }
  if (o.type === 'text') {
    if (corner) { it.size = clamp(o.size * (nw / o.w), 4, 400); it.w = o.w * (it.size / o.size); }
    else { it.autoW = false; it.w = Math.max(nw, it.size * 0.6); }
    const lay = layoutText(it);
    if (it.autoW) it.w = lay.width + 2;
    nw = it.w; nh = Math.max(lay.height, it.size * LINE);
  }
  const cy = textEdge ? nh / 2 : (hy * nh) / 2;
  const off = rotatePt((hx * nw) / 2, cy, rot);
  const C = { x: A.x + off.x, y: A.y + off.y };
  it.w = nw; it.h = nh; it.x = C.x - nw / 2; it.y = C.y - nh / 2;
}

function addPenPoint(d, p) {
  if (Math.hypot(p.x - d.last.x, p.y - d.last.y) * S.zoom < 1.2) return;
  d.it.pts.push(p.x, p.y);
  d.last = p;
}

/* Fewer points, same shape (Ramer–Douglas–Peucker). */
function simplify(pts, tol) {
  const n = pts.length / 2;
  if (n < 3) return pts.slice();
  const keep = new Uint8Array(n); keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const ax = pts[a * 2], ay = pts[a * 2 + 1], bx = pts[b * 2], by = pts[b * 2 + 1];
    const len = Math.hypot(bx - ax, by - ay) || 1e-9;
    let md = 0, mi = -1;
    for (let i = a + 1; i < b; i++) {
      const dd = Math.abs((bx - ax) * (ay - pts[i * 2 + 1]) - (ax - pts[i * 2]) * (by - ay)) / len;
      if (dd > md) { md = dd; mi = i; }
    }
    if (md > tol && mi > 0) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i * 2], pts[i * 2 + 1]);
  return out;
}

function finishPen(it) {
  const pts = simplify(it.pts, 0.35);
  const xs = pts.filter((_, i) => i % 2 === 0), ys = pts.filter((_, i) => i % 2 === 1);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const w = Math.max(x1 - x0, 1), h = Math.max(y1 - y0, 1);
  it.x = (x0 + x1) / 2 - w / 2; it.y = (y0 + y1) / 2 - h / 2; it.w = w; it.h = h;
  it.pts = pts.map((v, i) => Math.round(((i % 2 === 0 ? (v - it.x) / w : (v - it.y) / h)) * 10000) / 10000);
}

function makeItem(tool, p) {
  const st = S.style, base = { id: uid(), rot: 0 };
  if (tool === 'rect' || tool === 'ellipse') {
    return { ...base, type: tool, x: p.x, y: p.y, w: 1, h: 1, stroke: st.stroke, fill: st.fill, width: st.width,
      dash: st.dash, ...(tool === 'rect' ? { radius: st.radius } : {}) };
  }
  if (tool === 'line' || tool === 'arrow') {
    return { id: base.id, type: 'line', x1: p.x, y1: p.y, x2: p.x, y2: p.y,
      stroke: st.stroke === 'none' ? '#1f1f1f' : st.stroke, width: st.width, dash: st.dash, arrow: tool === 'arrow' ? 'end' : 'none' };
  }
  return { ...base, type: 'text', x: p.x, y: p.y, w: 40, h: st.size * LINE, text: '', font: st.font, size: st.size,
    bold: st.bold, italic: st.italic, align: st.align, color: st.color, autoW: true };
}

function sizeCreate(it, tool, s, p, shift) {
  let dx = p.x - s.x, dy = p.y - s.y;
  if (tool === 'rect' || tool === 'ellipse') {
    if (shift) { const m = Math.max(Math.abs(dx), Math.abs(dy)); dx = Math.sign(dx || 1) * m; dy = Math.sign(dy || 1) * m; }
    it.x = Math.min(s.x, s.x + dx); it.y = Math.min(s.y, s.y + dy);
    it.w = Math.max(1, Math.abs(dx)); it.h = Math.max(1, Math.abs(dy));
  } else if (tool === 'line' || tool === 'arrow') {
    const q = shift ? snapAngle(s, p) : p;
    it.x2 = q.x; it.y2 = q.y;
  } else if (tool === 'text') {
    it.autoW = false;
    it.x = Math.min(s.x, p.x); it.y = s.y; it.w = Math.max(40, Math.abs(dx));
    refitText(it);
  }
}

function dragCreate(p, e) {
  if (!drag.it) {
    checkpoint();
    drag.it = makeItem(drag.tool, drag.start);
    curPage().items.push(drag.it);
    S.sel = [drag.it.id];
  }
  sizeCreate(drag.it, drag.tool, drag.start, p, e.shiftKey);
  renderStage();
}

function finishCreate(d, p) {
  let it = d.it;
  if (!it) {
    // A click without a drag: a sensibly sized shape right there.
    if (d.tool !== 'text') checkpoint();
    it = makeItem(d.tool, d.start);
    const s = d.start;
    if (d.tool === 'rect') Object.assign(it, { x: s.x - 72, y: s.y - 48, w: 144, h: 96 });
    else if (d.tool === 'ellipse') Object.assign(it, { x: s.x - 54, y: s.y - 54, w: 108, h: 108 });
    else if (d.tool === 'line' || d.tool === 'arrow') Object.assign(it, { x1: s.x - 72, x2: s.x + 72 });
    else { it.y = s.y - it.h / 2; }
    curPage().items.push(it);
  }
  S.sel = [it.id];
  if (d.tool === 'text') {
    // The undo step for a new text box is made when typing ends (commitText).
    if (d.it) past.pop();
    setTool('select', false);
    startEdit(it, true, d.snap);
    return;
  }
  setTool('select', false);
  changed();
}

svg.addEventListener('pointerleave', () => { if (!drag && S.hover) { S.hover = null; renderOverlay(); } });

/* ---------------- tools ---------------- */
function setTool(t, render = true) {
  if (S.editing && t !== 'select') commitText();
  S.tool = t;
  S.hover = null;
  if (t !== 'select') S.sel = [];
  $$('#tools [data-tool]').forEach((b) => b.classList.toggle('on', b.dataset.tool === t));
  if (render) renderAll();
}

/* ---------------- properties panel ---------------- */
const SUPPORT = {
  stroke: ['rect', 'ellipse', 'line', 'pen'], width: ['rect', 'ellipse', 'line', 'pen'],
  dash: ['rect', 'ellipse', 'line', 'pen'], fill: ['rect', 'ellipse'], radius: ['rect'], arrow: ['line'],
  font: ['text'], size: ['text'], bold: ['text'], italic: ['text'], align: ['text'], color: ['text'],
};
const supports = (it, key) => key === 'opacity' || (SUPPORT[key] || []).includes(it.type);

function context() {
  const items = selItems();
  if (items.length) return { mode: 'sel', items, types: new Set(items.map((i) => i.type)) };
  if (S.tool !== 'select') return { mode: 'tool', items: [], types: new Set([S.tool === 'arrow' ? 'line' : S.tool]) };
  return { mode: 'page', items: [], types: new Set() };
}

function valueOf(ctx, key) {
  const it = ctx.items.find((i) => supports(i, key));
  if (it) return it[key] == null ? (key === 'opacity' ? 1 : S.style[key]) : it[key];
  return key === 'opacity' ? 1 : S.style[key];
}

function setProp(key, value, coalesce = false) {
  if (key in S.style) { S.style[key] = value; savePrefs(); }
  const targets = selItems().filter((it) => supports(it, key));
  if (!targets.length) { renderInspector(); return; }
  checkpoint(coalesce ? 'prop:' + key : null);
  for (const it of targets) {
    it[key] = value;
    if (it.type === 'text') refitText(it);
  }
  changed();
}

function buildSwatches() {
  for (const box of $$('.swatches')) {
    const group = box.dataset.for;
    let html = '';
    if (group !== 'color') html += `<button class="sw none" data-c="none" title="None"></button>`;
    html += SWATCHES.map((c) => `<button class="sw" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('');
    html += `<label class="sw custom" title="Pick any colour"><input type="color" value="#2f55d4"></label>`;
    box.innerHTML = html;
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-c]');
      if (b) setProp(group, b.dataset.c);
    });
    box.querySelector('input').addEventListener('input', (e) => setProp(group, e.target.value, true));
  }
}

function renderInspector() {
  const ctx = context(), T = ctx.types;
  const has = (...ts) => ts.some((t) => T.has(t));
  const show = {
    page: ctx.mode === 'page',
    picture: ctx.mode === 'sel' && ctx.items.every(isPicture),
    stroke: has('rect', 'ellipse', 'line', 'pen'),
    arrows: has('line'),
    fill: has('rect', 'ellipse'),
    corner: has('rect'),
    text: has('text'),
    common: ctx.mode === 'sel',
  };
  $$('#inspector [data-show]').forEach((el) => { el.hidden = !show[el.dataset.show]; });

  let title = `Page ${S.page + 1}`;
  if (ctx.mode === 'tool') title = TOOL_NAMES[S.tool] || 'Tool';
  if (ctx.mode === 'sel') {
    const one = ctx.items[0];
    title = ctx.items.length > 1 ? `${ctx.items.length} items`
      : one.type === 'line' && one.arrow && one.arrow !== 'none' ? 'Arrow' : TYPE_NAMES[one.type];
  }
  $('#inspTitle').textContent = title;
  $('#strokeTitle').textContent = has('line', 'pen') ? 'Line' : 'Outline';

  const mark = (group, v) => {
    const box = $(`.swatches[data-for="${group}"]`);
    let found = false;
    box.querySelectorAll('[data-c]').forEach((b) => {
      const on = String(b.dataset.c).toLowerCase() === String(v).toLowerCase();
      b.classList.toggle('on', on); found ||= on;
    });
    const custom = box.querySelector('.custom');
    custom.classList.toggle('on', !found && v !== 'none');
    if (!found && v !== 'none' && /^#[0-9a-f]{6}$/i.test(v)) { custom.style.background = v; custom.querySelector('input').value = v; }
    else custom.style.background = '';
    const none = box.querySelector('.none');
    // Lines and freehand must keep a colour; only shapes can drop their outline.
    if (none && group === 'stroke') none.hidden = has('line', 'pen');
  };
  if (show.stroke) {
    mark('stroke', valueOf(ctx, 'stroke'));
    const w = valueOf(ctx, 'width');
    $('#widthRange').value = w; $('#widthVal').textContent = `${w} pt`;
    const dash = valueOf(ctx, 'dash');
    $$('#dashSeg button').forEach((b) => b.classList.toggle('on', b.dataset.dash === dash));
    const arrow = ctx.mode === 'tool' ? (S.tool === 'arrow' ? 'end' : 'none') : valueOf(ctx, 'arrow');
    $$('#arrowSeg button').forEach((b) => b.classList.toggle('on', b.dataset.arrow === arrow));
  }
  if (show.fill) {
    mark('fill', valueOf(ctx, 'fill'));
    const r = valueOf(ctx, 'radius') || 0;
    $('#radiusRange').value = r; $('#radiusVal').textContent = `${r} pt`;
  }
  if (show.text) {
    $('#fontSel').value = valueOf(ctx, 'font');
    if (document.activeElement !== $('#sizeNum')) $('#sizeNum').value = Math.round(valueOf(ctx, 'size') * 10) / 10;
    $$('#styleSeg button').forEach((b) => b.classList.toggle('on', !!valueOf(ctx, b.dataset.style)));
    const al = valueOf(ctx, 'align');
    $$('#alignSeg button').forEach((b) => b.classList.toggle('on', b.dataset.align === al));
    mark('color', valueOf(ctx, 'color'));
  }
  if (show.common) {
    const op = valueOf(ctx, 'opacity');
    $('#opacityRange').value = op; $('#opacityVal').textContent = Math.round(op * 100) + '%';
    const locked = ctx.items.every((i) => i.locked);
    $('#lockBtn').classList.toggle('on', locked);
    $('#lockBtn span').textContent = locked ? 'Unlock' : 'Lock';
  }
}

function bindInspector() {
  $('#widthRange').addEventListener('input', (e) => setProp('width', +e.target.value, true));
  $('#radiusRange').addEventListener('input', (e) => setProp('radius', +e.target.value, true));
  $('#opacityRange').addEventListener('input', (e) => setProp('opacity', +e.target.value, true));
  $('#dashSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-dash]'); if (b) setProp('dash', b.dataset.dash); });
  $('#arrowSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-arrow]'); if (b) setProp('arrow', b.dataset.arrow); });
  $('#fontSel').addEventListener('change', (e) => setProp('font', e.target.value));
  $('#sizeNum').addEventListener('input', (e) => { const v = +e.target.value; if (v >= 4 && v <= 400) setProp('size', v, true); });
  $('#sizeNum').addEventListener('change', () => renderInspector());
  $('#styleSeg').addEventListener('click', (e) => {
    const b = e.target.closest('[data-style]');
    if (b) setProp(b.dataset.style, !valueOf(context(), b.dataset.style));
  });
  $('#alignSeg').addEventListener('click', (e) => { const b = e.target.closest('[data-align]'); if (b) setProp('align', b.dataset.align); });
  $('#inspector').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b) act(b.dataset.act);
  });
}

/* ---------------- actions ---------------- */
function natural(it) {
  const a = assets.get(it.asset);
  if (!a) return { w: it.w, h: it.h };
  if (it.type === 'image') return { w: a.w, h: a.h };
  const p = a.pages[it.page] || { w: it.w, h: it.h };
  return { w: p.w, h: p.h };
}

function placePicture(it, how) {
  const [W, H] = pageWH();
  const r = Math.round((it.rot || 0) / 90) * 90 % 360;
  it.rot = r;
  const nat = natural(it), side = r === 90 || r === 270;
  const fw = side ? nat.h : nat.w, fh = side ? nat.w : nat.h;   // footprint on the page
  const m = how === 'fitMargins' ? MARGIN : 0;
  const AW = W - 2 * m, AH = H - 2 * m;
  const s = how === 'fillPage' ? Math.max(AW / fw, AH / fh) : Math.min(AW / fw, AH / fh);
  it.w = nat.w * s; it.h = nat.h * s;
  it.x = W / 2 - it.w / 2; it.y = H / 2 - it.h / 2;
}

function act(a) {
  const sel = selItems(), pg = curPage();
  const unlocked = sel.filter((i) => !i.locked);
  switch (a) {
    case 'delete': {
      if (!sel.length) return;
      if (!unlocked.length) { toast('That’s locked — click Unlock first.'); return; }
      checkpoint();
      pg.items = pg.items.filter((i) => !unlocked.includes(i));
      S.sel = S.sel.filter((id) => findItem(id));
      changed();
      break;
    }
    case 'duplicate': {
      if (!sel.length) return;
      checkpoint();
      const copies = sel.map((it) => { const c = deepCopy(it); c.id = uid(); c.locked = false; moveItem(c, 12, 12); return c; });
      const last = Math.max(...sel.map((i) => pg.items.indexOf(i)));
      pg.items.splice(last + 1, 0, ...copies);
      S.sel = copies.map((c) => c.id);
      changed();
      break;
    }
    case 'front': case 'back': {
      if (!sel.length) return;
      checkpoint();
      const rest = pg.items.filter((i) => !sel.includes(i));
      const moving = pg.items.filter((i) => sel.includes(i));
      pg.items = a === 'front' ? [...rest, ...moving] : [...moving, ...rest];
      changed();
      break;
    }
    case 'lock': {
      if (!sel.length) return;
      checkpoint();
      const lock = !sel.every((i) => i.locked);
      sel.forEach((i) => { i.locked = lock; });
      changed();
      if (lock) toast('Locked. Clicks and drags now go to what’s on top of it.');
      break;
    }
    case 'fitPage': case 'fillPage': case 'fitMargins': {
      const pics = unlocked.filter(isPicture);
      if (!pics.length) return;
      checkpoint();
      pics.forEach((it) => placePicture(it, a));
      changed();
      break;
    }
    case 'rotate90': {
      const pics = unlocked.filter((i) => i.type !== 'line');
      if (!pics.length) return;
      checkpoint();
      pics.forEach((it) => { it.rot = ((it.rot || 0) + 90) % 360; });
      changed();
      break;
    }
    case 'dupPage': duplicatePage(S.page); break;
    case 'delPage': deletePage(S.page); break;
    default: break;
  }
}

/* ---------------- pages ---------------- */
function goPage(i) {
  commitText();
  i = clamp(i, 0, S.doc.pages.length - 1);
  if (i === S.page) return;
  S.page = i; S.sel = []; S.hover = null;
  renderAll();
  renderThumbs();
  const el = $('#thumbs').children[i];
  if (el) el.scrollIntoView({ block: 'nearest' });
}

function addPage(after = S.page) {
  commitText();
  checkpoint();
  const pg = newPage(curPage().orient);
  S.doc.pages.splice(after + 1, 0, pg);
  S.page = after + 1; S.sel = [];
  changed();
  renderThumbs();
  $('#thumbs').children[S.page]?.scrollIntoView({ block: 'nearest' });
}

function duplicatePage(i) {
  commitText();
  checkpoint();
  const pg = deepCopy(S.doc.pages[i]);
  pg.id = uid();
  pg.items.forEach((it) => { it.id = uid(); });
  S.doc.pages.splice(i + 1, 0, pg);
  S.page = i + 1; S.sel = [];
  changed();
}

function deletePage(i) {
  commitText();
  checkpoint();
  if (S.doc.pages.length === 1) {
    S.doc.pages[0].items = [];
    toast('Page cleared. ⌘Z brings it back.');
  } else {
    S.doc.pages.splice(i, 1);
    if (S.page >= S.doc.pages.length) S.page = S.doc.pages.length - 1;
    else if (i < S.page) S.page--;
    toast(`Page ${i + 1} deleted. ⌘Z brings it back.`);
  }
  S.sel = [];
  changed();
}

function movePage(from, to) {
  if (to === from || to === from + 1) return;
  checkpoint();
  const cur = S.doc.pages[S.page];
  const [pg] = S.doc.pages.splice(from, 1);
  S.doc.pages.splice(to > from ? to - 1 : to, 0, pg);
  S.page = S.doc.pages.indexOf(cur);
  changed();
}

function setOrientation(o) {
  const pg = curPage();
  if (pg.orient === o) return;
  commitText();
  checkpoint();
  const [W0, H0] = pageWH(pg);
  pg.orient = o;
  const [W1, H1] = pageWH(pg);
  pg.items.forEach((it) => {
    const b0 = bounds([it]);
    // A photo / PDF page that filled the old sheet is fitted to the new one…
    if (isPicture(it) && !it.locked && (b0.w >= W0 - 2 || b0.h >= H0 - 2)) { placePicture(it, 'fitPage'); return; }
    // …everything else keeps its place relative to the middle, nudged back
    // onto the paper if the turn pushed it off an edge.
    moveItem(it, (W1 - W0) / 2, (H1 - H0) / 2);
    const b = bounds([it]);
    let dx = 0, dy = 0;
    if (b.w <= W1) dx = b.x < 0 ? -b.x : b.x + b.w > W1 ? W1 - (b.x + b.w) : 0;
    if (b.h <= H1) dy = b.y < 0 ? -b.y : b.y + b.h > H1 ? H1 - (b.y + b.h) : 0;
    moveItem(it, dx, dy);
  });
  changed();
}

let thumbTimer = 0;
function thumbsSoon() { clearTimeout(thumbTimer); thumbTimer = setTimeout(renderThumbs, 120); }

function renderThumbs() {
  const box = $('#thumbs'), pages = S.doc.pages;
  box.querySelectorAll('.insert-line').forEach((l) => l.remove());
  while (box.children.length > pages.length) box.lastChild.remove();
  pages.forEach((pg, i) => {
    let el = box.children[i];
    if (!el) {
      el = document.createElement('div');
      el.draggable = true;
      el.innerHTML = `<span class="num"></span><div class="sheet"></div>
        <div class="t-acts"><button data-tact="dup" title="Duplicate page"><svg><use href="#i-dup"/></svg></button><button data-tact="del" class="del" title="Delete page"><svg><use href="#i-trash"/></svg></button></div>`;
      box.appendChild(el);
    }
    el.dataset.i = i;
    el.className = `thumb ${pg.orient}${i === S.page ? ' on' : ''}`;
    el.querySelector('.num').textContent = i + 1;
    const markup = pageSvg(S.doc, pg);
    if (el._sig !== markup) { el.querySelector('.sheet').innerHTML = markup; el._sig = markup; }
  });
  $('#pageCount').textContent = pages.length > 1 ? `· ${pages.length}` : '';
  $('#pageLabel').textContent = `Page ${S.page + 1} of ${pages.length}`;
}

function bindThumbs() {
  const box = $('#thumbs');
  box.addEventListener('click', (e) => {
    const t = e.target.closest('.thumb');
    if (!t) return;
    const i = +t.dataset.i, b = e.target.closest('[data-tact]');
    if (b) { if (b.dataset.tact === 'dup') duplicatePage(i); else deletePage(i); return; }
    goPage(i);
  });
  let from = -1, line = null;
  const where = (e) => {
    const thumbs = [...box.querySelectorAll('.thumb')];
    for (let i = 0; i < thumbs.length; i++) {
      const r = thumbs[i].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) return i;
    }
    return thumbs.length;
  };
  box.addEventListener('dragstart', (e) => {
    const t = e.target.closest('.thumb');
    if (!t) return;
    from = +t.dataset.i;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/x-wpg-page', String(from));
  });
  box.addEventListener('dragover', (e) => {
    if (from < 0) return;
    e.preventDefault();
    const at = where(e), thumbs = box.querySelectorAll('.thumb');
    line = line || Object.assign(document.createElement('div'), { className: 'insert-line' });
    if (at < thumbs.length) box.insertBefore(line, thumbs[at]); else box.appendChild(line);
  });
  box.addEventListener('drop', (e) => {
    if (from < 0) return;
    e.preventDefault();
    e.stopPropagation();
    const to = where(e);
    line?.remove();
    const f = from; from = -1;
    movePage(f, to);
  });
  box.addEventListener('dragend', () => { from = -1; line?.remove(); });
}

/* ---------------- adding photos & PDFs ---------------- */
const orientFor = (p) => (p.w > p.h ? 'landscape' : 'portrait');

function placeImages(list, pi, at) {
  const pg = S.doc.pages[pi], [W, H] = pageSize(S.doc, pg);
  const n = list.length, gap = 12;
  const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
  const cw = (W - 2 * MARGIN - gap * (cols - 1)) / cols, ch = (H - 2 * MARGIN - gap * (rows - 1)) / rows;
  const out = [];
  list.forEach((a, k) => {
    const s = Math.min(1, cw / a.ptW, ch / a.ptH);
    const w = a.ptW * s, h = a.ptH * s;
    let cx, cy;
    if (n === 1 && at) {
      cx = clamp(at.x, w / 2, W - w / 2); cy = clamp(at.y, h / 2, H - h / 2);
      if (w > W) cx = W / 2;
      if (h > H) cy = H / 2;
    } else if (n === 1) { cx = W / 2; cy = H / 2; }
    else {
      const c = k % cols, r = Math.floor(k / cols);
      cx = MARGIN + c * (cw + gap) + cw / 2; cy = MARGIN + r * (ch + gap) + ch / 2;
    }
    const it = { id: uid(), type: 'image', asset: a.id, x: cx - w / 2, y: cy - h / 2, w, h, rot: 0 };
    pg.items.push(it);
    out.push(it.id);
  });
  return out;
}

/* A PDF's pages: the first goes onto the target page when that page is empty
   (or when asked to), the rest become new pages right after it. Each page of
   the app turns to match its PDF page. Returns the last page index used. */
function placePdf(a, pi, here) {
  let idx = pi;
  a.pages.forEach((info, k) => {
    let pg;
    if (k === 0 && here) {
      pg = S.doc.pages[pi];
      if (!pg.items.length) pg.orient = orientFor(info);
    } else {
      pg = newPage(orientFor(info));
      S.doc.pages.splice(++idx, 0, pg);
    }
    const [W, H] = pageSize(S.doc, pg);
    const s = Math.min(W / info.w, H / info.h);
    const w = info.w * s, h = info.h * s;
    pg.items.push({ id: uid(), type: 'pdfpage', asset: a.id, page: k, x: (W - w) / 2, y: (H - h) / 2, w, h, rot: 0 });
  });
  return idx;
}

let busy = 0;
async function addFiles(files, pi = S.page, at = null) {
  commitText();
  files = [...files];
  if (!files.length) return;
  busy++;
  const slow = setTimeout(() => toast(`Adding ${files.length > 1 ? files.length + ' files' : 'file'}…`, 60000), 400);
  const imgs = [], pdfs = [], errors = [];
  for (const f of files) {
    try {
      const a = await importFile(f);
      (a.kind === 'pdf' ? pdfs : imgs).push(a);
    } catch (e) {
      console.warn(e);
      errors.push(e.message || String(e));
    }
  }
  clearTimeout(slow);
  busy--;
  if (!imgs.length && !pdfs.length) { toast(errors[0] || 'Nothing could be added.', 6000); return; }
  pi = clamp(pi, 0, S.doc.pages.length - 1);

  let here = true;
  if (pdfs.length && (S.doc.pages[pi].items.length || imgs.length)) {
    const total = pdfs.reduce((n, a) => n + a.pages.length, 0);
    const v = await modal({
      title: total > 1 ? `Add ${total} PDF pages` : 'Add the PDF page',
      body: `<p>Page ${pi + 1} already has things on it. Where should the PDF go?</p>`,
      buttons: [
        { label: 'Cancel', value: null },
        { label: 'On top of this page', value: 'here' },
        { label: total > 1 ? 'As new pages after it' : 'As a new page after it', value: 'new', primary: true },
      ],
    });
    if (!v) return;
    here = v === 'here';
  }
  checkpoint();
  let ids = [];
  if (imgs.length) ids = placeImages(imgs, pi, at);
  let idx = pi;
  pdfs.forEach((a, k) => { idx = placePdf(a, idx, k === 0 && here); });
  if (pdfs.length) {
    const first = here ? pi : pi + 1;
    S.page = clamp(first, 0, S.doc.pages.length - 1);
    S.sel = [];
    const added = pdfs.reduce((n, a) => n + a.pages.length, 0);
    toast(added > 1 ? `Added ${added} PDF pages.` : 'Added the PDF page.');
  } else {
    S.page = pi;
    S.sel = ids;
  }
  if (errors.length) setTimeout(() => toast(errors.join(' '), 7000), pdfs.length ? 2600 : 0);
  changed();
  renderThumbs();
}

function bindDrops() {
  const hint = $('#dropHint');
  let depth = 0;
  const hasFiles = (e) => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
  window.addEventListener('dragenter', (e) => { if (!hasFiles(e)) return; depth++; hint.hidden = false; });
  window.addEventListener('dragleave', (e) => { if (!hasFiles(e)) return; depth = Math.max(0, depth - 1); if (!depth) hint.hidden = true; });
  window.addEventListener('dragover', (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    $$('.thumb').forEach((t) => t.classList.toggle('drop-target', t.contains(e.target)));
  });
  window.addEventListener('drop', (e) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    depth = 0; hint.hidden = true;
    $$('.thumb.drop-target').forEach((t) => t.classList.remove('drop-target'));
    const files = [...e.dataTransfer.files];
    const thumb = e.target.closest && e.target.closest('.thumb');
    if (thumb) { addFiles(files, +thumb.dataset.i, null); return; }
    const r = svg.getBoundingClientRect();
    const onPaper = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    addFiles(files, S.page, onPaper ? toPage(e) : null);
  });
  $('#addFileBtn').addEventListener('click', () => $('#fileInput').click());
  $('#fileInput').addEventListener('change', (e) => { addFiles(e.target.files); e.target.value = ''; });
}

/* ---------------- copy / paste ---------------- */
let clip = null;   // { id, items, pageId, pastes }

function copySelection(cut) {
  const its = selItems();
  if (!its.length) return null;
  clip = { id: uid(), items: deepCopy(its), pageId: curPage().id, pastes: 0 };
  if (cut) {
    const unlocked = its.filter((i) => !i.locked);
    if (unlocked.length) {
      checkpoint();
      curPage().items = curPage().items.filter((i) => !unlocked.includes(i));
      S.sel = [];
      changed();
    }
  }
  return CLIP_MARK + clip.id;
}

function pasteItems() {
  if (!clip) return;
  checkpoint();
  const samePage = clip.pageId === curPage().id;
  if (samePage) clip.pastes++;
  const off = samePage ? 12 * clip.pastes : 0;
  const copies = clip.items.map((it) => { const c = deepCopy(it); c.id = uid(); moveItem(c, off, off); return c; });
  curPage().items.push(...copies);
  S.sel = copies.map((c) => c.id);
  setTool('select', false);
  changed();
}

function pasteText(text) {
  const [W, H] = pageWH();
  checkpoint();
  const long = text.length > 60 || text.includes('\n');
  const it = { id: uid(), type: 'text', x: MARGIN, y: H / 3, w: long ? W - 2 * MARGIN : 40, h: 20, rot: 0,
    text: text.replace(/\s+$/, ''), font: S.style.font, size: long ? Math.min(S.style.size, 14) : S.style.size,
    bold: S.style.bold, italic: S.style.italic, align: S.style.align, color: S.style.color, autoW: !long };
  refitText(it);
  if (!long) it.x = W / 2 - it.w / 2;
  curPage().items.push(it);
  S.sel = [it.id];
  setTool('select', false);
  changed();
}

function bindClipboard() {
  document.addEventListener('copy', (e) => {
    if (isTyping()) return;
    const mark = copySelection(false);
    if (mark) { e.clipboardData.setData('text/plain', mark); e.preventDefault(); }
  });
  document.addEventListener('cut', (e) => {
    if (isTyping()) return;
    const mark = copySelection(true);
    if (mark) { e.clipboardData.setData('text/plain', mark); e.preventDefault(); }
  });
  document.addEventListener('paste', (e) => {
    if (isTyping() || !$('#modal').hidden) return;
    const dt = e.clipboardData;
    const text = dt.getData('text/plain');
    if (clip && text === CLIP_MARK + clip.id) { e.preventDefault(); pasteItems(); return; }
    const files = [...dt.files].filter((f) => /^image\/|^application\/pdf$/.test(f.type));
    if (files.length) { e.preventDefault(); addFiles(files); return; }
    if (text && text.trim() && !text.startsWith(CLIP_MARK)) { e.preventDefault(); pasteText(text); }
  });
}

/* ---------------- keyboard ---------------- */
const TOOL_KEYS = { v: 'select', p: 'pen', l: 'line', a: 'arrow', r: 'rect', o: 'ellipse', t: 'text' };

function bindKeys() {
  window.addEventListener('keydown', (e) => {
    if (!$('#modal').hidden) return;
    const mod = e.metaKey || e.ctrlKey, k = e.key.toLowerCase();
    if (mod && k === 's') { e.preventDefault(); saveProject(); return; }
    if (mod && k === 'e') { e.preventDefault(); exportFlow(); return; }
    if (mod && (k === '=' || k === '+')) { e.preventDefault(); zoomStep(1); return; }
    if (mod && k === '-') { e.preventDefault(); zoomStep(-1); return; }
    if (mod && k === '0') { e.preventDefault(); zoomFit(); return; }
    if (isTyping()) return;
    if (mod && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); redo(); return; }
    if (mod && k === 'd') { e.preventDefault(); act('duplicate'); return; }
    if (mod && k === 'a') { e.preventDefault(); setTool('select', false); S.sel = curPage().items.filter((i) => !i.locked).map((i) => i.id); renderAll(); return; }
    if (mod) return;
    if (k === 'delete' || k === 'backspace') { e.preventDefault(); act('delete'); return; }
    if (k === 'escape') {
      if (drag) return;
      if (S.tool !== 'select') setTool('select');
      else if (S.sel.length) { S.sel = []; renderAll(); }
      closeMenus();
      return;
    }
    if (k === 'enter') {
      const sel = selItems();
      if (sel.length === 1 && sel[0].type === 'text' && !sel[0].locked) { e.preventDefault(); startEdit(sel[0]); }
      return;
    }
    if (e.key === 'PageDown') { e.preventDefault(); goPage(S.page + 1); return; }
    if (e.key === 'PageUp') { e.preventDefault(); goPage(S.page - 1); return; }
    if (k.startsWith('arrow')) {
      const its = selItems().filter((i) => !i.locked);
      if (!its.length) {
        if (k === 'arrowdown' || k === 'arrowright') goPage(S.page + 1); else goPage(S.page - 1);
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const step = e.shiftKey ? 10 : 1;
      const dx = k === 'arrowleft' ? -step : k === 'arrowright' ? step : 0;
      const dy = k === 'arrowup' ? -step : k === 'arrowdown' ? step : 0;
      checkpoint('nudge');
      its.forEach((it) => moveItem(it, dx, dy));
      changed();
      return;
    }
    if (TOOL_KEYS[k] && !e.altKey) { setTool(TOOL_KEYS[k]); }
  });
}

/* ---------------- zoom ---------------- */
function zoomTo(z, focus) {
  const wrap = $('#stageWrap');
  const old = S.zoom;
  z = clamp(z, 0.1, 8);
  const r = wrap.getBoundingClientRect();
  const fx = focus ? focus.x - r.left : wrap.clientWidth / 2, fy = focus ? focus.y - r.top : wrap.clientHeight / 2;
  const px = (wrap.scrollLeft + fx) / old, py = (wrap.scrollTop + fy) / old;
  S.fit = false; S.zoom = z;
  renderStage();
  wrap.scrollLeft = px * z - fx; wrap.scrollTop = py * z - fy;
}
function zoomStep(dir) {
  const pct = (S.zoom / PX_PER_PT) * 100;
  const next = dir > 0 ? ZOOMS.find((z) => z > pct + 0.5) : [...ZOOMS].reverse().find((z) => z < pct - 0.5);
  zoomTo(((next || pct) / 100) * PX_PER_PT);
}
function zoomFit() { S.fit = true; renderStage(); }

/* ---------------- top bar & File menu ---------------- */
function renderTopbar() {
  $('#paper').value = S.doc.paper;
  $$('#orient button').forEach((b) => b.classList.toggle('on', b.dataset.o === curPage().orient));
  $('#undoBtn').disabled = !past.length;
  $('#redoBtn').disabled = !future.length;
  if (document.activeElement !== $('#docName')) $('#docName').value = S.doc.name;
  $('#guidesBtn').setAttribute('aria-pressed', String(S.guides));
  $('#pageLabel').textContent = `Page ${S.page + 1} of ${S.doc.pages.length}`;
}

function closeMenus() { $('#fileMenu').hidden = true; $('#fileBtn').setAttribute('aria-expanded', 'false'); }

function bindTopbar() {
  const sel = $('#paper');
  sel.innerHTML = Object.entries(PAPERS).map(([k, p]) => `<option value="${k}">${p.label}</option>`).join('');
  sel.addEventListener('change', () => { commitText(); checkpoint(); S.doc.paper = sel.value; changed(); });
  $('#orient').addEventListener('click', (e) => { const b = e.target.closest('[data-o]'); if (b) setOrientation(b.dataset.o); });
  $('#undoBtn').addEventListener('click', undo);
  $('#redoBtn').addEventListener('click', redo);
  $('#docName').addEventListener('input', (e) => { S.doc.name = e.target.value; saveSoon(); });
  $('#docName').addEventListener('change', (e) => { S.doc.name = e.target.value.trim() || 'Untitled'; e.target.value = S.doc.name; saveSoon(); });
  $('#docName').addEventListener('keydown', (e) => { if (e.key === 'Enter') e.target.blur(); });
  $('#exportBtn').addEventListener('click', () => exportFlow());
  $('#fileBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const m = $('#fileMenu'); m.hidden = !m.hidden;
    $('#fileBtn').setAttribute('aria-expanded', String(!m.hidden));
  });
  $('#fileMenu').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    closeMenus();
    if (b.dataset.act === 'new') newDocument();
    if (b.dataset.act === 'open') $('#projectInput').click();
    if (b.dataset.act === 'save') saveProject();
    if (b.dataset.act === 'preview') previewPdf();
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.menu-wrap')) closeMenus(); });
  $('#projectInput').addEventListener('change', (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) openProject(f); });
  $('#addPageBtn').addEventListener('click', () => addPage(S.page));
  $$('#tools [data-tool]').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
  $('#guidesBtn').addEventListener('click', () => { S.guides = !S.guides; savePrefs(); renderAll(); });
  $('#zoomIn').addEventListener('click', () => zoomStep(1));
  $('#zoomOut').addEventListener('click', () => zoomStep(-1));
  $('#zoomLabel').addEventListener('click', zoomFit);
  $('#stageWrap').addEventListener('wheel', (e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    zoomTo(S.zoom * Math.exp(-e.deltaY * 0.01), { x: e.clientX, y: e.clientY });
  }, { passive: false });
  // The grey desk around the paper: a click clears the selection, a drag
  // draws a selection box (so it can start beside the page).
  $('#stageWrap').addEventListener('pointerdown', (e) => {
    if (e.target.closest('#stage') || e.target === ta || e.button !== 0) return;
    const wrap = $('#stageWrap');
    if (e.target === wrap && (e.offsetX > wrap.clientWidth || e.offsetY > wrap.clientHeight)) return; // scrollbar
    if (S.editing) ta.blur();
    if (S.tool !== 'select') { if (S.sel.length) { S.sel = []; renderAll(); } return; }
    if (!e.shiftKey) S.sel = [];
    svg.setPointerCapture(e.pointerId);
    const p = toPage(e);
    drag = { kind: 'marquee', start: p, cur: p, base: e.shiftKey ? [...S.sel] : [], moved: false };
    renderAll();
  });
  window.addEventListener('resize', () => { if (S.fit) renderStage(); });
}

/* ---------------- export ---------------- */
function exportSummary() {
  const n = S.doc.pages.length, p = PAPERS[S.doc.paper];
  return `${n} page${n > 1 ? 's' : ''} · ${p.label.split(' · ')[0]}`;
}

async function makePdf() {
  const m = modal({
    title: 'Making your PDF…',
    body: `<p id="expMsg">Starting…</p><div class="progress"><div id="expBar"></div></div>`,
    dismiss: false, onOpen: () => {},
  });
  void m;
  try {
    const bytes = await buildPdf(S.doc, (i, n) => {
      $('#expMsg').textContent = `Page ${i} of ${n}`;
      $('#expBar').style.width = `${Math.round((i / n) * 100)}%`;
    });
    return new Blob([bytes], { type: 'application/pdf' });
  } finally {
    closeModal();
  }
}

const sizeText = (b) => (b.size > 1e6 ? (b.size / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b.size / 1e3)) + ' KB');

async function exportFlow() {
  commitText();
  if (busy) { toast('Still adding files — one moment.'); return; }
  let tab = null;
  const v = await modal({
    title: 'Export PDF',
    body: `<p>${exportSummary()}</p><input type="text" id="expName" aria-label="File name" spellcheck="false">`,
    buttons: [
      { label: 'Cancel', value: null },
      { label: 'Open in new tab', value: 'tab', now: () => { tab = window.open('', '_blank'); } },
      { label: 'Download PDF', value: 'download', primary: true },
    ],
    onOpen: () => { const i = $('#expName'); i.value = safeFileName(S.doc.name) + '.pdf'; i.focus(); i.setSelectionRange(0, i.value.length - 4); },
  });
  if (!v) return;
  const name = safeFileName(($('#expName').value || '').replace(/\.pdf$/i, ''), 'Untitled') + '.pdf';
  try {
    const blob = await makePdf();
    if (v === 'tab' && tab) {
      tab.location.href = URL.createObjectURL(blob);
    } else {
      downloadBlob(blob, name);
      toast(`Saved “${name}” (${sizeText(blob)}).`);
    }
  } catch (e) {
    console.error(e);
    if (tab) tab.close();
    toast('Sorry — the PDF could not be made. ' + (e.message || ''), 7000);
  }
}

async function previewPdf() {
  commitText();
  const tab = window.open('', '_blank');
  try {
    const blob = await makePdf();
    if (tab) tab.location.href = URL.createObjectURL(blob);
    else downloadBlob(blob, safeFileName(S.doc.name) + '.pdf');
  } catch (e) {
    console.error(e);
    if (tab) tab.close();
    toast('Sorry — the PDF could not be made. ' + (e.message || ''), 7000);
  }
}

/* ---------------- projects (.wpdf files) ---------------- */
const usedAssetIds = (doc = S.doc) => new Set(doc.pages.flatMap((p) => p.items.filter((i) => i.asset).map((i) => i.asset)));

async function saveProject() {
  commitText();
  const out = {};
  for (const id of usedAssetIds()) {
    const a = assets.get(id);
    if (!a) continue;
    const { blob, ...meta } = a;
    out[id] = { ...meta, data: await blobToBase64(blob) };
  }
  const json = JSON.stringify({ format: 'walbys-pdf-generator', v: 1, doc: S.doc, assets: out });
  const name = safeFileName(S.doc.name) + '.wpdf';
  downloadBlob(new Blob([json], { type: 'application/json' }), name);
  toast(`Saved the project as “${name}”. Open it again from File › Open project.`);
}

async function replaceDocument(doc, assetList) {
  await store.clearAssets();
  forgetAssetCaches();
  assets.clear();
  for (const a of assetList) { assets.set(a.id, a); await store.putAsset(a); }
  S.doc = doc; S.page = 0; S.sel = []; S.editing = null;
  past.length = 0; future.length = 0;
  elCache.forEach((g) => g.remove()); elCache.clear();
  $('#thumbs').innerHTML = '';
  saveNow();
  renderAll();
  renderThumbs();
}

async function openProject(file) {
  commitText();
  let data;
  try {
    data = JSON.parse(await file.text());
    if (data.format !== 'walbys-pdf-generator' || !data.doc || !Array.isArray(data.doc.pages)) throw new Error('format');
  } catch {
    toast(`“${file.name}” isn’t a Walby's PDF Generator project.`, 6000);
    return;
  }
  if (docHasContent()) {
    const v = await modal({ title: 'Open this project?', body: '<p>It replaces what’s on the pages now. (Save the current one first if you want to keep it.)</p>',
      buttons: [{ label: 'Cancel', value: null }, { label: 'Open', value: 'ok', primary: true }] });
    if (!v) return;
  }
  const list = Object.entries(data.assets || {}).map(([id, a]) => {
    const { data: b64, ...meta } = a;
    return { ...meta, id, blob: base64ToBlob(b64, a.mime) };
  });
  if (!data.doc.pages.length) data.doc.pages.push(newPage());
  await replaceDocument(data.doc, list);
  toast(`Opened “${data.doc.name || file.name}”.`);
}

async function newDocument() {
  commitText();
  if (docHasContent()) {
    const v = await modal({ title: 'Start a new document?', body: '<p>This clears every page. Save the project first (File › Save project) if you want to come back to it.</p>',
      buttons: [{ label: 'Cancel', value: null }, { label: 'Start new', value: 'ok', primary: true }] });
    if (!v) return;
  }
  await replaceDocument(newDoc(), []);
}

/* ---------------- start ---------------- */
function validDoc(d) {
  return d && Array.isArray(d.pages) && d.pages.length && d.pages.every((p) => p && Array.isArray(p.items));
}

async function boot() {
  await initText();
  loadPrefs();
  const [saved, list] = await Promise.all([store.loadDoc(), store.allAssets()]);
  for (const a of list) assets.set(a.id, a);
  S.doc = validDoc(saved) ? saved : newDoc();
  if (!PAPERS[S.doc.paper]) S.doc.paper = 'letter';
  // Drop files no page uses any more (left over from deleted photos).
  const used = usedAssetIds();
  const unused = list.filter((a) => !used.has(a.id)).map((a) => a.id);
  if (unused.length) { unused.forEach((id) => assets.delete(id)); store.deleteAssets(unused).catch(() => {}); }
  for (const pg of S.doc.pages) pg.items = pg.items.filter((it) => !it.asset || assets.has(it.asset));

  buildSwatches();
  bindInspector();
  bindTopbar();
  bindThumbs();
  bindDrops();
  bindClipboard();
  bindKeys();
  setTool('select', false);
  onPreviewReady(() => { renderItems(); thumbsSoon(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); });
  window.addEventListener('pagehide', saveNow);
  renderAll();
  renderThumbs();
  if (!saved) saveNow();
  // Warm up the PDF reader so the first dropped PDF shows sooner.
  (window.requestIdleCallback || setTimeout)(() => pdfjs().catch(() => {}));
  window.__wpg = { S, assets };   // for poking at from the console
}

boot().catch((e) => {
  console.error(e);
  document.body.insertAdjacentHTML('beforeend', `<div class="toast show">Couldn’t start: ${e.message}</div>`);
});

/* Geometry shared by the screen and the PDF export.
   Every drawn item becomes one or more SVG path strings in the item's LOCAL
   frame: origin at the item's centre, y down, before rotation. The stage draws
   them inside translate(centre) rotate(rot); the export draws the very same
   strings inside the matching PDF transform. */

import { n2, rotatePt } from './util.js';
import { layoutText } from './text.js';

const K = 0.5522847498; // circle → cubic Bézier

export const isBox = (it) => it.type !== 'line';

export function center(it) {
  return it.type === 'line'
    ? { x: (it.x1 + it.x2) / 2, y: (it.y1 + it.y2) / 2 }
    : { x: it.x + it.w / 2, y: it.y + it.h / 2 };
}

export function dashArray(dash, w) {
  if (dash === 'dashed') return [Math.max(w * 3, 5), Math.max(w * 2, 4)];
  if (dash === 'dotted') return [0.01, Math.max(w * 2, 3)];
  return null;
}

function rectPath(x, y, w, h, r) {
  r = Math.max(0, Math.min(r || 0, w / 2, h / 2));
  if (!r) return `M${n2(x)} ${n2(y)}L${n2(x + w)} ${n2(y)}L${n2(x + w)} ${n2(y + h)}L${n2(x)} ${n2(y + h)}Z`;
  const k = r * (1 - K);
  return [
    `M${n2(x + r)} ${n2(y)}`, `L${n2(x + w - r)} ${n2(y)}`,
    `C${n2(x + w - k)} ${n2(y)} ${n2(x + w)} ${n2(y + k)} ${n2(x + w)} ${n2(y + r)}`,
    `L${n2(x + w)} ${n2(y + h - r)}`,
    `C${n2(x + w)} ${n2(y + h - k)} ${n2(x + w - k)} ${n2(y + h)} ${n2(x + w - r)} ${n2(y + h)}`,
    `L${n2(x + r)} ${n2(y + h)}`,
    `C${n2(x + k)} ${n2(y + h)} ${n2(x)} ${n2(y + h - k)} ${n2(x)} ${n2(y + h - r)}`,
    `L${n2(x)} ${n2(y + r)}`,
    `C${n2(x)} ${n2(y + k)} ${n2(x + k)} ${n2(y)} ${n2(x + r)} ${n2(y)}Z`,
  ].join('');
}

function ellipsePath(rx, ry) {
  const kx = rx * K, ky = ry * K;
  return [
    `M${n2(rx)} 0`,
    `C${n2(rx)} ${n2(ky)} ${n2(kx)} ${n2(ry)} 0 ${n2(ry)}`,
    `C${n2(-kx)} ${n2(ry)} ${n2(-rx)} ${n2(ky)} ${n2(-rx)} 0`,
    `C${n2(-rx)} ${n2(-ky)} ${n2(-kx)} ${n2(-ry)} 0 ${n2(-ry)}`,
    `C${n2(kx)} ${n2(-ry)} ${n2(rx)} ${n2(-ky)} ${n2(rx)} 0Z`,
  ].join('');
}

/* Freehand: the points are stored 0..1 inside the box, so resizing the box
   resizes the drawing. Smoothed with quadratic curves through midpoints. */
function penPath(it) {
  const p = it.pts, w = it.w, h = it.h;
  const X = (i) => p[i] * w - w / 2, Y = (i) => p[i + 1] * h - h / 2;
  const n = p.length / 2;
  if (n === 0) return '';
  if (n === 1) return `M${n2(X(0))} ${n2(Y(0))}L${n2(X(0) + 0.01)} ${n2(Y(0))}`;
  let d = `M${n2(X(0))} ${n2(Y(0))}`;
  if (n === 2) return d + `L${n2(X(2))} ${n2(Y(2))}`;
  for (let i = 1; i < n - 1; i++) {
    const a = i * 2, b = a + 2;
    d += `Q${n2(X(a))} ${n2(Y(a))} ${n2((X(a) + X(b)) / 2)} ${n2((Y(a) + Y(b)) / 2)}`;
  }
  const L = (n - 1) * 2;
  return d + `L${n2(X(L))} ${n2(Y(L))}`;
}

export const arrowSize = (w) => 7 + w * 3;

/* → [{ d, stroke, fill, width, dash, cap, join }] for the vector types. */
export function vectorParts(it) {
  const common = { stroke: it.stroke, fill: it.fill, width: it.width, dash: it.dash };
  if (it.type === 'rect') {
    return [{ ...common, d: rectPath(-it.w / 2, -it.h / 2, it.w, it.h, it.radius),
      cap: it.dash === 'dotted' ? 'round' : 'butt', join: it.radius ? 'round' : 'miter' }];
  }
  if (it.type === 'ellipse') {
    return [{ ...common, d: ellipsePath(it.w / 2, it.h / 2), cap: 'round', join: 'round' }];
  }
  if (it.type === 'pen') {
    return [{ ...common, fill: 'none', d: penPath(it), cap: 'round', join: 'round' }];
  }
  if (it.type === 'line') {
    const c = center(it);
    let ax = it.x1 - c.x, ay = it.y1 - c.y, bx = it.x2 - c.x, by = it.y2 - c.y;
    const len = Math.hypot(bx - ax, by - ay) || 0.001;
    const ux = (bx - ax) / len, uy = (by - ay) / len;
    const L = Math.min(arrowSize(it.width), len * 0.45), hw = L * 0.42;
    const heads = [];
    const head = (tx, ty, dx, dy) => {
      const bx0 = tx - dx * L, by0 = ty - dy * L;
      heads.push({ stroke: 'none', fill: it.stroke, width: 0, dash: 'solid', cap: 'round', join: 'round',
        d: `M${n2(tx)} ${n2(ty)}L${n2(bx0 - dy * hw)} ${n2(by0 + dx * hw)}L${n2(bx0 + dy * hw)} ${n2(by0 - dx * hw)}Z` });
    };
    const startArrow = it.arrow === 'both', endArrow = it.arrow === 'end' || it.arrow === 'both';
    // Pull the line back inside each arrowhead so its end never pokes past the tip.
    if (endArrow) { head(bx, by, ux, uy); bx -= ux * L * 0.8; by -= uy * L * 0.8; }
    if (startArrow) { head(ax, ay, -ux, -uy); ax += ux * L * 0.8; ay += uy * L * 0.8; }
    return [{ ...common, fill: 'none', d: `M${n2(ax)} ${n2(ay)}L${n2(bx)} ${n2(by)}`, cap: 'round', join: 'round' }, ...heads];
  }
  return [];
}

/* The four corners of an item in page coordinates (rotation included). */
export function corners(it) {
  if (it.type === 'line') return [{ x: it.x1, y: it.y1 }, { x: it.x2, y: it.y2 }];
  const c = center(it), hw = it.w / 2, hh = it.h / 2;
  return [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([x, y]) => {
    const p = rotatePt(x, y, it.rot || 0);
    return { x: c.x + p.x, y: c.y + p.y };
  });
}

/* Axis-aligned bounds, page coordinates. */
export function bounds(items) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const it of items) for (const p of corners(it)) {
    x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

export function moveItem(it, dx, dy) {
  if (it.type === 'line') { it.x1 += dx; it.x2 += dx; it.y1 += dy; it.y2 += dy; }
  else { it.x += dx; it.y += dy; }
}

/* After a text box's words, font or size change, re-measure it and keep the
   edge it is aligned to where it was (left edge for left-aligned text…), even
   when the box is turned. */
export function refitText(it) {
  const lay = layoutText(it);
  const ow = it.w, oh = it.h;
  const nw = it.autoW ? lay.width + 2 : it.w;
  const nh = Math.max(lay.height, it.size * 1.2);
  if (Math.abs(nw - ow) < 0.01 && Math.abs(nh - oh) < 0.01) return;
  const ax = it.align === 'center' ? 0 : it.align === 'right' ? 1 : -1;
  const c = center(it);
  const a0 = rotatePt((ax * ow) / 2, -oh / 2, it.rot || 0);
  const a1 = rotatePt((ax * nw) / 2, -nh / 2, it.rot || 0);
  const cx = c.x + a0.x - a1.x, cy = c.y + a0.y - a1.y;
  it.w = nw; it.h = nh; it.x = cx - nw / 2; it.y = cy - nh / 2;
}

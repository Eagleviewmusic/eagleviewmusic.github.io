/* SVG for the stage and the page thumbnails. */

import { n2, esc, pageSize } from './util.js';
import { center, vectorParts, dashArray } from './shapes.js';
import { layoutText, cssFont, FONT_CSS, LINE, BASE } from './text.js';
import { imageUrl, previewUrl } from './assets.js';

const isPicture = (it) => it.type === 'image' || it.type === 'pdfpage';

/* Pictures are drawn in a 1 × 1 box scaled to size, so moving or resizing one
   only changes its transform — the <image> itself is never rebuilt (no flicker). */
export function itemTransform(it) {
  const c = center(it);
  let t = `translate(${n2(c.x)} ${n2(c.y)})`;
  if (it.rot) t += ` rotate(${n2(it.rot)})`;
  if (isPicture(it)) t += ` scale(${Math.max(it.w, 0.01).toFixed(3)} ${Math.max(it.h, 0.01).toFixed(3)})`;
  return t;
}

function pathEl(p, extra = '') {
  const dash = p.stroke !== 'none' ? dashArray(p.dash, p.width) : null;
  return `<path d="${p.d}" fill="${p.fill && p.fill !== 'none' ? p.fill : 'none'}"` +
    (p.stroke && p.stroke !== 'none' && p.width > 0
      ? ` stroke="${p.stroke}" stroke-width="${n2(p.width)}" stroke-linecap="${p.cap}" stroke-linejoin="${p.join}"` +
        (dash ? ` stroke-dasharray="${dash.map(n2).join(' ')}"` : '')
      : ' stroke="none"') + `${extra}/>`;
}

/* The item's content in its own frame (centre = 0,0). `hit` adds invisible
   wide strokes so thin lines are easy to click. */
export function itemInner(it, { hit = false, zoom = 1 } = {}) {
  if (it.type === 'image') {
    const url = imageUrl(it.asset);
    return url ? `<image href="${url}" x="-0.5" y="-0.5" width="1" height="1" preserveAspectRatio="none"/>`
      : `<rect x="-0.5" y="-0.5" width="1" height="1" fill="#eee"/>`;
  }
  if (it.type === 'pdfpage') {
    const url = previewUrl(it.asset, it.page);
    return url ? `<image href="${url}" x="-0.5" y="-0.5" width="1" height="1" preserveAspectRatio="none"/>`
      : `<rect x="-0.5" y="-0.5" width="1" height="1" fill="#f1efeb"/>`;
  }
  if (it.type === 'text') {
    const lay = layoutText(it);
    const lh = it.size * LINE;
    const ax = it.align === 'center' ? 0 : it.align === 'right' ? it.w / 2 : -it.w / 2;
    const anchor = it.align === 'center' ? 'middle' : it.align === 'right' ? 'end' : 'start';
    const spans = lay.lines.map((l, i) =>
      `<tspan x="${n2(ax)}" y="${n2(-it.h / 2 + i * lh + BASE * it.size)}">${esc(l.text) || ' '}</tspan>`).join('');
    const back = hit ? `<rect x="${n2(-it.w / 2)}" y="${n2(-it.h / 2)}" width="${n2(it.w)}" height="${n2(it.h)}" fill="transparent"/>` : '';
    return back + `<text xml:space="preserve" font-family='${FONT_CSS[it.font] || FONT_CSS.sans}' font-size="${n2(it.size)}"` +
      `${it.bold ? ' font-weight="bold"' : ''}${it.italic ? ' font-style="italic"' : ''} fill="${it.color}" text-anchor="${anchor}">${spans}</text>`;
  }
  const parts = vectorParts(it);
  let s = parts.map((p) => pathEl(p)).join('');
  if (hit) {
    const hw = Math.max((parts[0] && parts[0].width) || 0, 14 / zoom);
    s += `<path d="${parts[0] ? parts[0].d : ''}" fill="none" stroke="transparent" stroke-width="${n2(hw)}" stroke-linecap="round" stroke-linejoin="round" pointer-events="stroke"/>`;
  }
  return s;
}

export const itemOpacity = (it) => (it.opacity == null || it.opacity >= 1 ? '' : String(it.opacity));

export function pageSvg(doc, page, cls = '') {
  const [W, H] = pageSize(doc, page);
  const items = page.items.map((it) => {
    const op = itemOpacity(it);
    return `<g transform="${itemTransform(it)}"${op ? ` opacity="${op}"` : ''}>${itemInner(it)}</g>`;
  }).join('');
  return `<svg class="${cls}" viewBox="0 0 ${n2(W)} ${n2(H)}" xmlns="http://www.w3.org/2000/svg">` +
    `<rect width="${n2(W)}" height="${n2(H)}" fill="#fff"/>` +
    `<defs><clipPath id="clip-${page.id}"><rect width="${n2(W)}" height="${n2(H)}"/></clipPath></defs>` +
    `<g clip-path="url(#clip-${page.id})">${items}</g></svg>`;
}

export { cssFont };

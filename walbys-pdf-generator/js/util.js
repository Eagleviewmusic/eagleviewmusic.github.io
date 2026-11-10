/* Shared constants and small helpers.
   Every coordinate in the app is in PDF points (72 per inch), measured from the
   page's top-left corner with y pointing down — the same numbers the export
   uses, so what you see is what prints. */

export const PAPERS = {
  letter:  { label: 'Letter · 8.5 × 11 in',  w: 612,    h: 792 },
  legal:   { label: 'Legal · 8.5 × 14 in',   w: 612,    h: 1008 },
  tabloid: { label: 'Tabloid · 11 × 17 in',  w: 792,    h: 1224 },
  a4:      { label: 'A4 · 210 × 297 mm',     w: 595.28, h: 841.89 },
  a5:      { label: 'A5 · 148 × 210 mm',     w: 419.53, h: 595.28 },
};

/* The faint guide box: half an inch in from every edge, where most printers
   can still print. */
export const MARGIN = 36;

export function pageSize(doc, page) {
  const p = PAPERS[doc.paper] || PAPERS.letter;
  return page.orient === 'landscape' ? [p.h, p.w] : [p.w, p.h];
}

export const uid = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-5);

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const rad = (deg) => (deg * Math.PI) / 180;

/* Short numbers for SVG path strings (and pdf-lib's path parser). */
export const n2 = (v) => {
  const s = (Math.round(v * 100) / 100).toString();
  return s === '-0' ? '0' : s;
};

export function rotatePt(x, y, deg) {
  const r = rad(deg), c = Math.cos(r), s = Math.sin(r);
  return { x: x * c - y * s, y: x * s + y * c };
}

export function hexToRgb01(hex) {
  let h = String(hex || '#000').replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const v = parseInt(h.slice(0, 6), 16) || 0;
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const deepCopy = (o) => JSON.parse(JSON.stringify(o));

export function debounce(fn, ms) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

export function blobToBase64(blob) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] || '');
    r.onerror = () => rej(r.error);
    r.readAsDataURL(blob);
  });
}

export function base64ToBlob(b64, type) {
  const bin = atob(b64), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type });
}

export function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60000);
}

/* A file name that every operating system accepts. */
export function safeFileName(name, fallback = 'Untitled') {
  const s = String(name || '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim();
  return s || fallback;
}

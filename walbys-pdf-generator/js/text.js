/* Text boxes: fonts and line layout.
   The screen and the PDF share ONE layout: lines are broken here, with the
   widths of the PDF's own standard fonts (Helvetica, Times, Courier), so a
   line that wraps on screen wraps at the same word in the exported file. */

export const FONT_CSS = {
  sans: 'Helvetica, Arial, "Liberation Sans", sans-serif',
  serif: '"Times New Roman", Times, "Liberation Serif", serif',
  mono: '"Courier New", Courier, "Liberation Mono", monospace',
};

const STD = {
  sans: ['Helvetica', 'Helvetica-Bold', 'Helvetica-Oblique', 'Helvetica-BoldOblique'],
  serif: ['Times-Roman', 'Times-Bold', 'Times-Italic', 'Times-BoldItalic'],
  mono: ['Courier', 'Courier-Bold', 'Courier-Oblique', 'Courier-BoldOblique'],
};

export const LINE = 1.2;      // line height, × font size
export const BASE = 0.88;     // baseline below a line's top, × font size

export const stdFontName = (it) => (STD[it.font] || STD.sans)[(it.bold ? 1 : 0) + (it.italic ? 2 : 0)];
export const cssFont = (it, px) =>
  `${it.italic ? 'italic ' : ''}${it.bold ? 'bold ' : ''}${px}px ${FONT_CSS[it.font] || FONT_CSS.sans}`;

let fonts = null;              // std name → pdf-lib PDFFont (for widths only)
const widths = {};             // std name → { char: width at size 1000 | -w for canvas-measured }
let ctx2d = null;

export async function initText() {
  const doc = await PDFLib.PDFDocument.create();
  fonts = {};
  for (const list of Object.values(STD)) for (const n of list) fonts[n] = doc.embedStandardFont(n);
}

/* Width of one character at size 1000. Characters the PDF fonts cannot
   write (Chinese, emoji…) are measured by the browser instead; their text box
   is later exported as a picture (see canEncode). */
function charW(name, it, ch) {
  const tbl = widths[name] || (widths[name] = {});
  let w = tbl[ch];
  if (w !== undefined) return Math.abs(w);
  try {
    w = fonts[name].widthOfTextAtSize(ch, 1000);
  } catch {
    ctx2d = ctx2d || document.createElement('canvas').getContext('2d');
    ctx2d.font = cssFont(it, 100);
    w = -(ctx2d.measureText(ch).width * 10 || 500);
  }
  tbl[ch] = w;
  return Math.abs(w);
}

export function canEncode(it) {
  const name = stdFontName(it), tbl = widths[name] || {};
  for (const ch of it.text || '') {
    if (ch === '\n') continue;
    if (tbl[ch] === undefined) charW(name, it, ch);
    if (tbl[ch] < 0) return false;
  }
  return true;
}

export function textWidth(it, s) {
  const name = stdFontName(it);
  let w = 0;
  for (const ch of s) w += charW(name, it, ch);
  return (w * it.size) / 1000;
}

const clean = (t) => String(t || '').replace(/\r\n?/g, '\n').replace(/\t/g, '    ');

/* → { lines: [{ text, width }], width (of the widest line), height } */
export function layoutText(it) {
  const paras = clean(it.text).split('\n');
  const lines = [];
  const maxW = it.autoW ? Infinity : Math.max(it.w, it.size * 0.6);
  for (const para of paras) {
    if (maxW === Infinity || textWidth(it, para) <= maxW) { lines.push(para); continue; }
    // Greedy word wrap; a word longer than the box breaks between letters
    // (which is also how Chinese text, with no spaces, wraps).
    const words = para.match(/\S+\s*|\s+/g) || [''];
    let cur = '';
    for (const word of words) {
      if (textWidth(it, cur + word.trimEnd()) <= maxW) { cur += word; continue; }
      if (cur) { lines.push(cur.trimEnd()); cur = ''; }
      if (textWidth(it, word.trimEnd()) <= maxW) { cur = word; continue; }
      for (const ch of word) {
        if (cur && textWidth(it, cur + ch) > maxW) { lines.push(cur); cur = ''; }
        cur += ch;
      }
    }
    lines.push(cur.trimEnd());
  }
  const out = lines.map((t) => ({ text: t, width: textWidth(it, t) }));
  const width = Math.max(it.size * 0.5, ...out.map((l) => l.width));
  return { lines: out, width, height: out.length * it.size * LINE };
}

/* x of a line's start inside a box of width w (local, box's left edge = 0). */
export function lineX(it, line, w) {
  if (it.align === 'center') return (w - line.width) / 2;
  if (it.align === 'right') return w - line.width;
  return 0;
}

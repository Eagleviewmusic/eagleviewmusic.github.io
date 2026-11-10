/* Building the PDF with pdf-lib.
   - Pages from dropped PDFs are copied in as vector pages (sharp text, small
     files). Notes and drawings made on them in Preview / Acrobat are
     flattened into the page first so they come along.
   - Locked (encrypted) PDFs can't be copied that way; their pages are drawn
     as high-resolution pictures instead.
   - Lines, shapes and freehand are real vector paths; text uses the PDF's
     built-in fonts (text in characters those fonts lack becomes a picture). */

import { pageSize, hexToRgb01, rad } from './util.js';
import { center, vectorParts, dashArray } from './shapes.js';
import { layoutText, stdFontName, canEncode, cssFont, lineX, LINE, BASE } from './text.js';
import { assets, renderPdfPage } from './assets.js';

const RASTER_DPI = 250;

const color = (hex) => { const [r, g, b] = hexToRgb01(hex); return PDFLib.rgb(r, g, b); };

/* Run `fn` with the origin at the item's centre and its turn applied, y UP
   (PDF space). Matches the stage's translate(centre) rotate(rot). */
function inFrame(page, H, cx, cy, deg, fn) {
  const { pushGraphicsState, popGraphicsState, concatTransformationMatrix } = PDFLib;
  const r = rad(-(deg || 0)), c = Math.cos(r), s = Math.sin(r);
  page.pushOperators(pushGraphicsState(), concatTransformationMatrix(c, s, -s, c, cx, H - cy));
  fn();
  page.pushOperators(popGraphicsState());
}

function rotateHere(page, deg) {
  const r = rad(-deg), c = Math.cos(r), s = Math.sin(r);
  page.pushOperators(PDFLib.concatTransformationMatrix(c, s, -s, c, 0, 0));
}

/* Draw every annotation that has an appearance (Preview's pen marks, text
   boxes, stamps, filled form fields…) into the page itself, then drop the
   annotations — an embedded page only carries the page's own drawing. */
function flattenAnnotations(src) {
  const { PDFName, PDFDict, PDFArray, PDFNumber, PDFRef, pushGraphicsState, popGraphicsState, concatTransformationMatrix, drawObject } = PDFLib;
  try { src.getForm().flatten(); } catch { /* no form, or one pdf-lib can't redraw */ }
  const ctx = src.context;
  const num = (o) => (o instanceof PDFNumber ? o.asNumber() : 0);
  const arr = (o) => { o = ctx.lookup(o); return o instanceof PDFArray ? o.asArray().map((x) => num(ctx.lookup(x))) : null; };
  for (const page of src.getPages()) {
    const annots = page.node.Annots();
    if (!annots) continue;
    for (let i = 0; i < annots.size(); i++) {
      try {
        const ref = annots.get(i), a = ctx.lookup(ref);
        if (!(a instanceof PDFDict)) continue;
        const sub = a.get(PDFName.of('Subtype'));
        if (sub === PDFName.of('Link') || sub === PDFName.of('Popup')) continue;
        const flags = num(ctx.lookup(a.get(PDFName.of('F'))));
        if (flags & 2 || flags & 32) continue; // hidden / no-view
        const ap = ctx.lookup(a.get(PDFName.of('AP')));
        if (!(ap instanceof PDFDict)) continue;
        let n = ap.get(PDFName.of('N'));
        let nObj = ctx.lookup(n);
        if (nObj instanceof PDFDict && !(nObj.get(PDFName.of('BBox')))) {
          // A dictionary of states (check boxes): use the one it's set to.
          const as = a.get(PDFName.of('AS'));
          n = as ? nObj.get(as) : null;
          nObj = ctx.lookup(n);
        }
        if (!n || !(n instanceof PDFRef) || !nObj) continue;
        const dict = nObj.dict || nObj;
        const bbox = arr(dict.get(PDFName.of('BBox')));
        const rect = arr(a.get(PDFName.of('Rect')));
        if (!bbox || !rect) continue;
        const m = arr(dict.get(PDFName.of('Matrix'))) || [1, 0, 0, 1, 0, 0];
        const pts = [[bbox[0], bbox[1]], [bbox[2], bbox[1]], [bbox[2], bbox[3]], [bbox[0], bbox[3]]]
          .map(([x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]);
        const tx0 = Math.min(...pts.map((p) => p[0])), tx1 = Math.max(...pts.map((p) => p[0]));
        const ty0 = Math.min(...pts.map((p) => p[1])), ty1 = Math.max(...pts.map((p) => p[1]));
        const rx0 = Math.min(rect[0], rect[2]), rx1 = Math.max(rect[0], rect[2]);
        const ry0 = Math.min(rect[1], rect[3]), ry1 = Math.max(rect[1], rect[3]);
        if (tx1 - tx0 <= 0 || ty1 - ty0 <= 0) continue;
        const sx = (rx1 - rx0) / (tx1 - tx0), sy = (ry1 - ry0) / (ty1 - ty0);
        const name = page.node.newXObject('Annot', n);
        page.pushOperators(pushGraphicsState(),
          concatTransformationMatrix(sx, 0, 0, sy, rx0 - sx * tx0, ry0 - sy * ty0),
          drawObject(name), popGraphicsState());
      } catch (e) { console.warn('annotation skipped', e); }
    }
    page.node.delete(PDFName.of('Annots'));
  }
}

async function canvasBytes(canvas, type, q) {
  const b = await new Promise((r) => canvas.toBlob(r, type, q));
  return new Uint8Array(await b.arrayBuffer());
}

export async function buildPdf(doc, progress = () => {}) {
  const { PDFDocument, LineCapStyle, LineJoinStyle, setLineJoin } = PDFLib;
  const out = await PDFDocument.create();
  out.setTitle(doc.name || 'Untitled');
  out.setCreator("Walby's PDF Generator");
  out.setProducer("Walby's PDF Generator (pdf-lib)");

  const fonts = {}, images = {}, sources = {}, embedded = {}, rasters = {};
  const font = (name) => (fonts[name] ||= out.embedStandardFont(name));

  async function image(id) {
    if (!images[id]) {
      const a = assets.get(id);
      const bytes = new Uint8Array(await a.blob.arrayBuffer());
      images[id] = a.mime === 'image/jpeg' ? await out.embedJpg(bytes) : await out.embedPng(bytes);
    }
    return images[id];
  }

  async function source(id) {
    if (!(id in sources)) {
      const a = assets.get(id);
      try {
        const src = await PDFDocument.load(new Uint8Array(await a.blob.arrayBuffer()), { ignoreEncryption: true, updateMetadata: false });
        if (src.isEncrypted) sources[id] = null;
        else { flattenAnnotations(src); sources[id] = src; }
      } catch (e) {
        console.warn('PDF could not be copied as vectors; using pictures', e);
        sources[id] = null;
      }
    }
    return sources[id];
  }

  async function pdfPage(id, index) {
    const key = id + ':' + index;
    if (key in embedded) return embedded[key];
    let emb = null;
    const src = await source(id);
    if (src) {
      try {
        const sp = src.getPage(index);
        const cb = sp.getCropBox(), mb = sp.getMediaBox();
        // Same visible area pdf.js shows: the crop box, kept inside the media box.
        const left = Math.max(cb.x, mb.x), bottom = Math.max(cb.y, mb.y);
        const right = Math.min(cb.x + cb.width, mb.x + mb.width), top = Math.min(cb.y + cb.height, mb.y + mb.height);
        emb = await out.embedPage(sp, right > left && top > bottom ? { left, bottom, right, top } : undefined);
      } catch (e) { console.warn('page could not be copied as vectors; using a picture', e); }
    }
    embedded[key] = emb;
    return emb;
  }

  async function rasterPage(id, index) {
    const key = id + ':' + index;
    if (!rasters[key]) {
      const canvas = await renderPdfPage(assets.get(id), index, RASTER_DPI / 72, '#ffffff');
      rasters[key] = await out.embedJpg(await canvasBytes(canvas, 'image/jpeg', 0.92));
    }
    return rasters[key];
  }

  async function textPicture(it) {
    const lay = layoutText(it), k = 4, pad = it.size * 0.4;
    const c = document.createElement('canvas');
    c.width = Math.ceil((it.w + pad * 2) * k); c.height = Math.ceil((it.h + pad * 2) * k);
    const g = c.getContext('2d');
    g.scale(k, k); g.translate(pad, pad);
    g.font = cssFont(it, it.size); g.fillStyle = it.color; g.textBaseline = 'alphabetic';
    g.textAlign = it.align === 'center' ? 'center' : it.align === 'right' ? 'right' : 'left';
    const ax = it.align === 'center' ? it.w / 2 : it.align === 'right' ? it.w : 0;
    lay.lines.forEach((l, i) => g.fillText(l.text, ax, i * it.size * LINE + BASE * it.size));
    return { img: await out.embedPng(await canvasBytes(c, 'image/png')), pad };
  }

  const total = doc.pages.length;
  for (let pi = 0; pi < total; pi++) {
    progress(pi + 1, total);
    const pg = doc.pages[pi];
    const [W, H] = pageSize(doc, pg);
    const page = out.addPage([W, H]);
    for (const it of pg.items) {
      const op = it.opacity == null ? 1 : it.opacity;
      const c = center(it);
      if (it.type === 'image') {
        if (!assets.has(it.asset)) continue;
        const img = await image(it.asset);
        inFrame(page, H, c.x, c.y, it.rot, () =>
          page.drawImage(img, { x: -it.w / 2, y: -it.h / 2, width: it.w, height: it.h, opacity: op }));
      } else if (it.type === 'pdfpage') {
        const a = assets.get(it.asset);
        if (!a) continue;
        const emb = await pdfPage(it.asset, it.page);
        if (emb) {
          // The source page's own /Rotate: pdf.js showed it turned, so turn it here too.
          const srot = (a.pages[it.page] && a.pages[it.page].rot) || 0;
          const side = srot === 90 || srot === 270;
          const uw = side ? it.h : it.w, uh = side ? it.w : it.h;
          inFrame(page, H, c.x, c.y, it.rot, () => {
            if (srot) rotateHere(page, srot);
            page.drawPage(emb, { x: -uw / 2, y: -uh / 2, width: uw, height: uh, opacity: op });
          });
        } else {
          const img = await rasterPage(it.asset, it.page);
          inFrame(page, H, c.x, c.y, it.rot, () =>
            page.drawImage(img, { x: -it.w / 2, y: -it.h / 2, width: it.w, height: it.h, opacity: op }));
        }
      } else if (it.type === 'text') {
        if (!String(it.text || '').trim()) continue;
        if (!canEncode(it)) {
          const { img, pad } = await textPicture(it);
          inFrame(page, H, c.x, c.y, it.rot, () =>
            page.drawImage(img, { x: -it.w / 2 - pad, y: -it.h / 2 - pad, width: it.w + pad * 2, height: it.h + pad * 2, opacity: op }));
          continue;
        }
        const lay = layoutText(it), f = font(stdFontName(it)), col = color(it.color);
        inFrame(page, H, c.x, c.y, it.rot, () => {
          lay.lines.forEach((l, i) => {
            if (!l.text) return;
            page.drawText(l.text, { x: -it.w / 2 + lineX(it, l, it.w), y: it.h / 2 - i * it.size * LINE - BASE * it.size,
              size: it.size, font: f, color: col, opacity: op });
          });
        });
      } else {
        const parts = vectorParts(it);
        inFrame(page, H, c.x, c.y, it.type === 'line' ? 0 : it.rot, () => {
          for (const p of parts) {
            const hasStroke = p.stroke && p.stroke !== 'none' && p.width > 0;
            const hasFill = p.fill && p.fill !== 'none';
            if (!hasStroke && !hasFill || !p.d) continue;
            page.pushOperators(PDFLib.pushGraphicsState(),
              setLineJoin(p.join === 'round' ? LineJoinStyle.Round : LineJoinStyle.Miter));
            const opts = { x: 0, y: 0, opacity: op, borderOpacity: op };
            if (hasFill) opts.color = color(p.fill);
            if (hasStroke) {
              opts.borderColor = color(p.stroke);
              opts.borderWidth = p.width;
              opts.borderLineCap = p.cap === 'round' ? LineCapStyle.Round : LineCapStyle.Butt;
              const dash = dashArray(p.dash, p.width);
              if (dash) opts.borderDashArray = dash;
            }
            page.drawSvgPath(p.d, opts);
            page.pushOperators(PDFLib.popGraphicsState());
          }
        });
      }
    }
  }
  return out.save();
}

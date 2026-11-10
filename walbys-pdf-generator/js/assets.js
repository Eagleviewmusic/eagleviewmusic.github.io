/* Photos and PDFs: reading dropped files, keeping them, and drawing PDF pages
   for the screen (pdf.js). The export never uses those screen pictures — it
   copies the original PDF pages in as real vector pages (see export.js). */

import { putAsset } from './store.js';
import { uid } from './util.js';

export const assets = new Map();          // id → asset record (also in IndexedDB)
const imgUrls = new Map();                // asset id → object URL
const previews = new Map();               // 'id:page' → object URL | 'pending'
let onReady = () => {};
export const onPreviewReady = (fn) => { onReady = fn; };

/* Photos larger than this (long side, in pixels) are scaled down on the way
   in: 3600 px across 11 inches is still ~330 dpi on paper, and a stack of
   12-megapixel phone photos would otherwise make a huge PDF. */
const MAX_PX = 3600;
const PREVIEW_PX = 1700;

/* ---------- pdf.js ---------- */
let pdfjsP = null;
export function pdfjs() {
  return (pdfjsP ||= import('../lib/pdfjs/pdf.min.mjs').then((m) => {
    m.GlobalWorkerOptions.workerSrc = new URL('../lib/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
    return m;
  }));
}

const pdfDocs = new Map();
function pdfDoc(asset) {
  if (!pdfDocs.has(asset.id)) {
    pdfDocs.set(asset.id, (async () => {
      const lib = await pdfjs();
      // pdf.js hands its buffer to a worker, so it always gets a fresh copy.
      const data = new Uint8Array(await asset.blob.arrayBuffer());
      return lib.getDocument({
        data,
        cMapUrl: new URL('../lib/pdfjs/cmaps/', import.meta.url).href,
        cMapPacked: true,
        standardFontDataUrl: new URL('../lib/pdfjs/standard_fonts/', import.meta.url).href,
        isEvalSupported: false,
      }).promise;
    })());
  }
  return pdfDocs.get(asset.id);
}

/* One PDF page drawn onto a canvas. Transparent, like the page itself — the
   exported vector page has no white sheet behind it either. */
export async function renderPdfPage(asset, index, scale, background = 'rgba(0,0,0,0)') {
  const doc = await pdfDoc(asset);
  const page = await doc.getPage(index + 1);
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.ceil(vp.width));
  canvas.height = Math.max(1, Math.ceil(vp.height));
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp, background }).promise;
  page.cleanup();
  return canvas;
}

/* ---------- screen pictures ---------- */
export function imageUrl(id) {
  if (!imgUrls.has(id)) {
    const a = assets.get(id);
    if (!a) return null;
    imgUrls.set(id, URL.createObjectURL(a.blob));
  }
  return imgUrls.get(id);
}

const queue = [];
let running = 0;
export function previewUrl(id, index) {
  const key = id + ':' + index, p = previews.get(key);
  if (p && p !== 'pending') return p;
  if (!p && assets.has(id)) {
    previews.set(key, 'pending');
    queue.push({ id, index, key });
    pump();
  }
  return null;
}

function pump() {
  while (running < 2 && queue.length) {
    const job = queue.shift();
    running++;
    (async () => {
      const a = assets.get(job.id), info = a.pages[job.index];
      const scale = Math.min(4, PREVIEW_PX / Math.max(info.w, info.h));
      const canvas = await renderPdfPage(a, job.index, scale);
      const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
      previews.set(job.key, URL.createObjectURL(blob));
    })().catch((e) => {
      console.warn('preview failed', e);
      previews.delete(job.key);
    }).finally(() => { running--; onReady(); pump(); });
  }
}

/* ---------- reading files ---------- */
function sniff(u8, name = '') {
  const s = (a, b) => String.fromCharCode(...u8.slice(a, b));
  if (s(0, 5) === '%PDF-' || (u8.length > 1024 && new TextDecoder().decode(u8.slice(0, 1024)).includes('%PDF-'))) return 'application/pdf';
  if (u8[0] === 0xff && u8[1] === 0xd8 && u8[2] === 0xff) return 'image/jpeg';
  if (u8[0] === 0x89 && s(1, 4) === 'PNG') return 'image/png';
  if (s(0, 4) === 'GIF8') return 'image/gif';
  if (s(0, 4) === 'RIFF' && s(8, 12) === 'WEBP') return 'image/webp';
  if (s(0, 2) === 'BM') return 'image/bmp';
  if (s(4, 8) === 'ftyp' && /hei|hev|mif1|msf1|avif/.test(s(8, 12))) return s(8, 12) === 'avif' ? 'image/avif' : 'image/heic';
  const head = new TextDecoder().decode(u8.slice(0, 512)).trimStart();
  if (/^(<\?xml|<svg|<!DOCTYPE svg)/i.test(head) || /\.svg$/i.test(name)) return 'image/svg+xml';
  return '';
}

/* JPEG orientation flag (phones store sideways pixels + "turn me" in EXIF).
   PDF viewers ignore EXIF, so a turned photo is re-drawn upright on import. */
function exifOrientation(u8) {
  const v = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return 1;
  let off = 2;
  while (off + 4 <= v.byteLength) {
    const marker = v.getUint16(off);
    if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) break;
    const len = v.getUint16(off + 2);
    if (marker === 0xffe1 && off + 10 < v.byteLength && v.getUint32(off + 4) === 0x45786966) {
      const t = off + 10, le = v.getUint16(t) === 0x4949;
      const ifd = t + v.getUint32(t + 4, le);
      if (ifd + 2 > v.byteLength) return 1;
      const count = v.getUint16(ifd, le);
      for (let i = 0; i < count; i++) {
        const e = ifd + 2 + i * 12;
        if (e + 10 > v.byteLength) break;
        if (v.getUint16(e, le) === 0x0112) return v.getUint16(e + 8, le) || 1;
      }
      return 1;
    }
    off += 2 + len;
  }
  return 1;
}

async function decode(blob) {
  try {
    const bmp = await createImageBitmap(blob);
    return { src: bmp, w: bmp.width, h: bmp.height };
  } catch {
    // SVG (and a few others) only decode through an <img>.
    const url = URL.createObjectURL(blob);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      let w = img.naturalWidth, h = img.naturalHeight;
      if (!w || !h) { w = 1200; h = 900; }
      return { src: img, w, h, url };
    } catch {
      URL.revokeObjectURL(url);
      return null;
    }
  }
}

function toBlob(src, w, h, type) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  if (type === 'image/jpeg') { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); }
  g.imageSmoothingQuality = 'high';
  g.drawImage(src, 0, 0, w, h);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Could not convert the picture.'))), type, 0.9));
}

async function importImage(file, u8, mime) {
  const dec = await decode(new Blob([u8], { type: mime || file.type }));
  if (!dec) {
    if (mime === 'image/heic') throw new Error(`“${file.name}” is an iPhone HEIC photo, which this browser can’t open. Save it as JPEG first (in Photos: File › Export).`);
    throw new Error(`“${file.name}” isn’t a picture this browser can open.`);
  }
  const orient = mime === 'image/jpeg' ? exifOrientation(u8) : 1;
  const long = Math.max(dec.w, dec.h);
  const ok = (mime === 'image/jpeg' || mime === 'image/png') && orient === 1 && long <= MAX_PX;
  let blob = new Blob([u8], { type: mime }), w = dec.w, h = dec.h, outMime = mime;
  if (!ok) {
    const k = Math.min(1, MAX_PX / long);
    w = Math.max(1, Math.round(dec.w * k)); h = Math.max(1, Math.round(dec.h * k));
    outMime = mime === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    // A PDF page is ~600 points wide, so an SVG gets drawn big enough to stay sharp.
    if (mime === 'image/svg+xml' && long < 2400) {
      const s = 2400 / long; w = Math.round(dec.w * s); h = Math.round(dec.h * s);
    }
    blob = await toBlob(dec.src, w, h, outMime);
  }
  if (dec.src.close) dec.src.close();
  if (dec.url) URL.revokeObjectURL(dec.url);
  const vector = mime === 'image/svg+xml';
  return { id: uid(), kind: 'image', mime: outMime, name: file.name || 'Picture', blob, w, h,
    // Points at 96 px per inch — the size a screenshot "looks" on screen.
    ptW: vector ? dec.w * 0.75 : w * 0.75, ptH: vector ? dec.h * 0.75 : h * 0.75 };
}

async function importPdf(file, u8) {
  const asset = { id: uid(), kind: 'pdf', mime: 'application/pdf', name: file.name || 'Document.pdf',
    blob: new Blob([u8], { type: 'application/pdf' }), pages: [] };
  let doc;
  try {
    doc = await pdfDoc(asset);
  } catch (e) {
    pdfDocs.delete(asset.id);
    if (e && e.name === 'PasswordException') throw new Error(`“${file.name}” is locked with a password, so it can’t be opened here.`);
    throw new Error(`“${file.name}” couldn’t be read as a PDF.`);
  }
  for (let i = 1; i <= doc.numPages; i++) {
    const p = await doc.getPage(i);
    const vp = p.getViewport({ scale: 1 });
    asset.pages.push({ w: vp.width, h: vp.height, rot: ((p.rotate % 360) + 360) % 360 });
  }
  return asset;
}

/* → asset (already saved) — throws an Error with a friendly message. */
export async function importFile(file) {
  const u8 = new Uint8Array(await file.arrayBuffer());
  const mime = sniff(u8, file.name) || file.type;
  let asset;
  if (mime === 'application/pdf') asset = await importPdf(file, u8);
  else if (mime.startsWith('image/')) asset = await importImage(file, u8, mime);
  else throw new Error(`“${file.name}” isn’t a photo or a PDF.`);
  assets.set(asset.id, asset);
  await putAsset(asset);
  return asset;
}

export function forgetAssetCaches() {
  for (const u of imgUrls.values()) URL.revokeObjectURL(u);
  for (const u of previews.values()) if (u !== 'pending') URL.revokeObjectURL(u);
  imgUrls.clear(); previews.clear(); queue.length = 0;
  for (const p of pdfDocs.values()) p.then((d) => d.destroy()).catch(() => {});
  pdfDocs.clear();
}

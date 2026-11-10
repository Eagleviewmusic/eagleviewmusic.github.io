/* ==========================================================================
   Walby's Basic Video Editor — js/media.js
   Bringing pictures and sound into a project, and loading them to use.

   VE.Media.add(files) → the new assets (each file is copied into Media/)
   VE.Media.load(asset) → fills VE.assets.get(id) = { bitmap, url } or { buffer, peaks }
   VE.Media.loadAll()
   Pictures are kept at most 4096 px on the long side in memory (the copy in Media/
   is the original); crops are parts of the picture, so that never changes a crop.
   Sound is decoded at 48 kHz; peaks = the loudest/quietest sample in each 256.
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const M = VE.Media = { RATE: 48000, PEAK: 256, MAX_SIDE: 4096 };
  const AUDIO_EXT = /\.(mp3|wav|m4a|aac|ogg|oga|opus|flac|aif|aiff|caf|webm)$/i;
  const IMAGE_EXT = /\.(png|jpe?g|gif|webp|bmp|svg|avif|tiff?|heic|heif)$/i;
  M.kindOf = f => (f.type || '').startsWith('audio/') || AUDIO_EXT.test(f.name) ? 'audio'
    : (f.type || '').startsWith('image/') || IMAGE_EXT.test(f.name) ? 'image' : null;

  let decoder = null;
  const ctx = () => decoder || (decoder = new OfflineAudioContext(2, 1, M.RATE));

  async function picture(blob) {
    let bmp;
    try { bmp = await createImageBitmap(blob, { imageOrientation: 'from-image' }); }
    catch (e) {
      // SVGs and a few others only decode through an <img>
      const url = URL.createObjectURL(blob);
      try {
        const img = new Image(); img.src = url; await img.decode();
        const w = img.naturalWidth || 1000, h = img.naturalHeight || 1000;
        const c = new OffscreenCanvas(w, h); c.getContext('2d').drawImage(img, 0, 0, w, h);
        bmp = c.transferToImageBitmap();
      } finally { URL.revokeObjectURL(url); }
    }
    const w = bmp.width, h = bmp.height, k = Math.min(1, M.MAX_SIDE / Math.max(w, h));
    if (k < 1) {
      const small = await createImageBitmap(bmp, { resizeWidth: Math.round(w * k), resizeHeight: Math.round(h * k), resizeQuality: 'high' });
      bmp.close(); return { bitmap: small, w, h };
    }
    return { bitmap: bmp, w, h };
  }

  M.peaks = function (buffer) {
    const n = Math.ceil(buffer.length / M.PEAK), lo = new Float32Array(n), hi = new Float32Array(n);
    const chans = [];
    for (let c = 0; c < buffer.numberOfChannels; c++) chans.push(buffer.getChannelData(c));
    for (let i = 0; i < n; i++) {
      let mn = 0, mx = 0;
      const a = i * M.PEAK, b = Math.min(buffer.length, a + M.PEAK);
      for (const d of chans) for (let j = a; j < b; j++) { const v = d[j]; if (v < mn) mn = v; else if (v > mx) mx = v; }
      lo[i] = mn; hi[i] = mx;
    }
    return { lo, hi, per: M.PEAK / buffer.sampleRate };
  };

  /* decode one file into its runtime form */
  M.decode = async function (kind, file) {
    if (kind === 'image') {
      const p = await picture(file);
      return { bitmap: p.bitmap, url: URL.createObjectURL(file), w: p.w, h: p.h };
    }
    const buffer = await ctx().decodeAudioData(await file.arrayBuffer());
    return { buffer, peaks: M.peaks(buffer), duration: buffer.duration };
  };

  M.load = async function (asset) {
    const old = VE.assets.get(asset.id);
    if (old && !old.missing) return old;
    const file = await VE.Store.read(VE.dir, asset.file);
    let r;
    if (!file) r = { missing: true, why: 'not in the project folder' };
    else { try { r = await M.decode(asset.kind, file); } catch (e) { r = { missing: true, why: 'could not be read' }; } }
    VE.assets.set(asset.id, r);
    return r;
  };
  M.loadAll = async function () {
    await Promise.all(VE.P.assets.map(a => M.load(a)));
    VE.emit('project');
  };
  M.forget = function () {
    for (const r of VE.assets.values()) { if (r.bitmap) r.bitmap.close(); if (r.url) URL.revokeObjectURL(r.url); }
    VE.assets.clear();
  };

  /* bring files into the project: copy into Media/, decode, add to the bin → [asset] */
  M.add = async function (files) {
    const out = [], bad = [];
    for (const f of files) {
      const kind = M.kindOf(f);
      if (!kind) { bad.push(f.name + ' (not a picture or sound file)'); continue; }
      let r;
      try { r = await M.decode(kind, f); }
      catch (e) {
        bad.push(f.name + (/heic|heif/i.test(f.name) ? ' (HEIC photos: export them as JPEG from Photos first)' : ' (could not be read)'));
        continue;
      }
      const name = await VE.Store.writeInto(VE.dir, 'Media', f.name || (kind + (kind === 'image' ? '.png' : '.wav')), f);
      const a = { id: VE.uid(), kind, file: 'Media/' + name, name: (f.name || name).replace(/\.[^.]+$/, '') };
      if (kind === 'image') { a.w = r.w; a.h = r.h; } else a.duration = VE.round(r.duration);
      VE.assets.set(a.id, r);
      out.push(a);
    }
    if (out.length) VE.change(P => { P.assets.push(...out); });
    if (bad.length) VE.toast('Not added: ' + bad.map(VE.esc).join(', '), 6000);
    return out;
  };

  /* a new clip for an asset at time t on a free track of its kind (prefer = a track id) */
  M.clipFor = function (a, t, prefer) {
    const P = VE.P;
    if (a.kind === 'audio') {
      const dur = a.duration || 1;
      return { id: VE.uid(), kind: 'audio', asset: a.id, track: VE.freeTrack('audio', t, dur, prefer),
        start: VE.round(t), dur, offset: 0, gain: 1, fadeIn: 0, fadeOut: 0 };
    }
    const dur = 5;
    // fit inside the canvas, centred
    const k = Math.min(P.w / a.w, P.h / a.h), w = Math.round(a.w * k), h = Math.round(a.h * k);
    return { id: VE.uid(), kind: 'image', asset: a.id, track: VE.freeTrack('image', t, dur, prefer),
      start: VE.round(t), dur, x: Math.round((P.w - w) / 2), y: Math.round((P.h - h) / 2), w, h,
      crop: { l: 0, t: 0, r: 0, b: 0 }, opacity: 1, fadeIn: 0, fadeOut: 0 };
  };
  M.place = function (a, t, prefer) {
    let c;
    VE.change(P => { c = M.clipFor(a, Math.max(0, t), prefer); P.clips.push(c); });
    VE.select(c.id);
    return c;
  };
})();

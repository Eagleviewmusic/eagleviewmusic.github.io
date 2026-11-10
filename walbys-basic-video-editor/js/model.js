/* ==========================================================================
   Walby's Basic Video Editor — js/model.js
   The project (what project.json holds), selection, playhead, undo, events.

   project = {
     app, version, title, w, h, bg, fps,
     assets: [{ id, kind:'image'|'audio', file:'Media/…', name, w, h, duration }],
     tracks: [{ id, kind:'image'|'audio', name, hidden, muted, volume }]   (first picture track = in front)
     clips:  [{ id, track, kind:'image'|'text'|'audio', start, dur, … }]
   }
   picture clip: asset, x, y, w, h (canvas px), crop {l,t,r,b} (parts of the picture cut off), opacity, fadeIn, fadeOut
   text clip:    text, font, size, bold, color, align, box (bool), boxColor, boxOpacity, x, y, w, h, opacity, fadeIn, fadeOut
   audio clip:   asset, offset (seconds into the file), gain, fadeIn, fadeOut
   Times are seconds. Clips on one track never overlap (the timeline refuses it).
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE = { P: null, sel: null, time: 0, assets: new Map(), cropping: false };

  /* ---- events ---- */
  const subs = {};
  VE.on = (ev, fn) => (subs[ev] = subs[ev] || []).push(fn);
  VE.emit = (ev, a) => (subs[ev] || []).forEach(fn => { try { fn(a); } catch (e) { console.error(e); } });

  VE.uid = () => Math.random().toString(36).slice(2, 10);
  VE.round = v => Math.round(v * 1000) / 1000;
  VE.clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  VE.newProject = (title, w, h) => ({
    app: 'walbys-basic-video-editor', version: 1, title: title || 'Untitled', w: w || 1920, h: h || 1080,
    bg: '#000000', fps: 30, assets: [], clips: [],
    tracks: [VE.newTrack('image', 'Pictures 1'), VE.newTrack('audio', 'Audio 1')]
  });
  VE.newTrack = (kind, name) => ({ id: VE.uid(), kind, name, hidden: false, muted: false, volume: 1 });

  /* fill in anything an older or hand-made project.json leaves out */
  VE.normalize = function (p) {
    p.assets = p.assets || []; p.tracks = p.tracks || []; p.clips = p.clips || [];
    p.w = p.w || 1920; p.h = p.h || 1080; p.fps = p.fps || 30; p.bg = p.bg || '#000000';
    p.tracks.forEach(t => { if (t.volume == null) t.volume = 1; });
    p.clips.forEach(c => {
      if (c.fadeIn == null) c.fadeIn = 0; if (c.fadeOut == null) c.fadeOut = 0;
      if (c.kind !== 'audio' && c.opacity == null) c.opacity = 1;
      if (c.kind === 'image' && !c.crop) c.crop = { l: 0, t: 0, r: 0, b: 0 };
      if (c.kind === 'audio') { if (c.gain == null) c.gain = 1; if (c.offset == null) c.offset = 0; }
    });
    const ids = new Set(p.tracks.map(t => t.id));
    p.clips = p.clips.filter(c => ids.has(c.track));
    return p;
  };

  /* ---- finding things ---- */
  VE.clip = id => VE.P && VE.P.clips.find(c => c.id === id) || null;
  VE.track = id => VE.P && VE.P.tracks.find(t => t.id === id) || null;
  VE.asset = id => VE.P && VE.P.assets.find(a => a.id === id) || null;
  VE.selected = () => VE.clip(VE.sel);
  VE.clipsOn = tid => VE.P.clips.filter(c => c.track === tid).sort((a, b) => a.start - b.start);
  VE.end = c => c.start + c.dur;
  VE.length = () => VE.P ? VE.P.clips.reduce((m, c) => Math.max(m, VE.end(c)), 0) : 0;
  VE.kindOfTrack = c => c.kind === 'audio' ? 'audio' : 'image';
  /* does [start, start+dur) on track tid hit another clip (ignoring the ids in skip)? */
  VE.overlaps = function (tid, start, dur, skip) {
    const eps = 1e-6;
    return VE.P.clips.some(c => c.track === tid && !(skip && skip.includes(c.id)) &&
      start < VE.end(c) - eps && start + dur > c.start + eps);
  };
  /* a track of this kind where [start, start+dur) is free — or a new one */
  VE.freeTrack = function (kind, start, dur, prefer) {
    const list = VE.P.tracks.filter(t => t.kind === kind);
    if (prefer && list.some(t => t.id === prefer) && !VE.overlaps(prefer, start, dur)) return prefer;
    for (const t of list) if (!VE.overlaps(t.id, start, dur)) return t.id;
    return VE.addTrack(kind).id;
  };
  VE.addTrack = function (kind) {
    const n = VE.P.tracks.filter(t => t.kind === kind).length + 1;
    const t = VE.newTrack(kind, (kind === 'audio' ? 'Audio ' : 'Pictures ') + n);
    if (kind === 'image') {
      // a new picture track goes in front of the others (top of the list)
      const i = VE.P.tracks.findIndex(x => x.kind === 'image');
      VE.P.tracks.splice(i < 0 ? 0 : i, 0, t);
    } else VE.P.tracks.push(t);
    return t;
  };
  /* picture tracks first (front → back), then audio tracks */
  VE.sortTracks = function () {
    const img = VE.P.tracks.filter(t => t.kind === 'image'), aud = VE.P.tracks.filter(t => t.kind === 'audio');
    VE.P.tracks = img.concat(aud);
  };

  /* how bright/loud a clip is at time t from its fades (0…1) */
  VE.fade = function (c, t) {
    let f = 1;
    if (c.fadeIn > 0) f = Math.min(f, (t - c.start) / c.fadeIn);
    if (c.fadeOut > 0) f = Math.min(f, (VE.end(c) - t) / c.fadeOut);
    return VE.clamp(f, 0, 1);
  };

  /* ---- undo ---- */
  const H = VE.history = { undo: [], redo: [], max: 200 };
  VE.snap = () => JSON.stringify({ p: VE.P, sel: VE.sel });
  VE.commit = function (before) {
    if (before == null) return;
    if (JSON.stringify(JSON.parse(before).p) !== JSON.stringify(VE.P)) {
      H.undo.push(before); if (H.undo.length > H.max) H.undo.shift();
      H.redo.length = 0;
    }
    VE.emit('project');
  };
  /* change(fn): one undo step around fn */
  VE.change = function (fn) {
    if (!VE.P) return;
    const b = VE.snap();
    fn(VE.P);
    VE.commit(b);
  };
  /* live(): a change while dragging/sliding — redraw, no undo step (the drag's start snap makes it one) */
  VE.live = () => VE.emit('live');
  function restore(s) {
    const o = JSON.parse(s);
    VE.P = o.p; VE.sel = VE.clip(o.sel) ? o.sel : null; VE.cropping = false;
    VE.emit('project'); VE.emit('select');
  }
  VE.undo = function () { if (!H.undo.length) return; H.redo.push(VE.snap()); restore(H.undo.pop()); };
  VE.redo = function () { if (!H.redo.length) return; H.undo.push(VE.snap()); restore(H.redo.pop()); };

  VE.select = function (id) {
    if (VE.sel === id) return;
    VE.sel = id; if (!id) VE.cropping = false;
    if (VE.cropping && (!VE.selected() || VE.selected().kind !== 'image')) VE.cropping = false;
    VE.emit('select');
  };
  VE.seek = function (t) {
    VE.time = Math.max(0, t);
    VE.emit('time');
  };

  /* ---- time as text: 83.5 ↔ "1:23.50" ---- */
  VE.fmt = function (s, short) {
    s = Math.max(0, s || 0);
    const m = Math.floor(s / 60), r = s - m * 60;
    const sec = short ? r.toFixed(r % 1 ? 1 : 0) : r.toFixed(2);
    return m + ':' + (r < 10 ? '0' : '') + sec;
  };
  VE.parseTime = function (txt) {
    txt = String(txt).trim();
    if (!txt) return NaN;
    const parts = txt.split(':').map(Number);
    if (parts.some(isNaN)) return NaN;
    return parts.reduce((a, v) => a * 60 + v, 0);
  };

  VE.toast = function (msg, ms) {
    const el = document.getElementById('toast');
    el.innerHTML = msg; el.hidden = false;
    clearTimeout(VE.toast.t);
    VE.toast.t = setTimeout(() => { el.hidden = true; }, ms || 3200);
  };
  VE.esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
})();

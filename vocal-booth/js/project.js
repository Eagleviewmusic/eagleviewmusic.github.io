/* ==========================================================================
   Vocal Booth — project.js
   The model: tracks and clips, in whole samples so nothing ever drifts.

   A clip is a window on a source: { sourceId, pos, offset, len, muted }.
   Editing never touches the audio itself, so every edit can be undone.

   Clips on one track may overlap. The clip that was placed last lies on top,
   and only the top one sounds (visible() works this out). A new take over an
   old one simply covers it, and pulling the new one away brings the old back.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB = window.VB || {};

  VB.uid = p => p + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);

  /* -------- Waveform summary: min and max per 256 samples -------- */
  const BLOCK = 256;
  class Peaks {
    constructor(capacity) {
      this.mins = new Float32Array(capacity || 1024);
      this.maxs = new Float32Array(capacity || 1024);
      this.count = 0;      // finished blocks
      this.fill = 0;       // samples into the unfinished block
      this.lo = 0; this.hi = 0;
    }
    grow() {
      const m = new Float32Array(this.mins.length * 2), x = new Float32Array(this.maxs.length * 2);
      m.set(this.mins); x.set(this.maxs);
      this.mins = m; this.maxs = x;
    }
    /* Adds samples; a second channel (same length) widens the same blocks. */
    add(a, b, n) {
      for (let i = 0; i < n; i++) {
        let v = a[i];
        if (v < this.lo) this.lo = v;
        if (v > this.hi) this.hi = v;
        if (b) {
          v = b[i];
          if (v < this.lo) this.lo = v;
          if (v > this.hi) this.hi = v;
        }
        if (++this.fill === BLOCK) {
          if (this.count === this.mins.length) this.grow();
          this.mins[this.count] = this.lo;
          this.maxs[this.count] = this.hi;
          this.count++;
          this.fill = 0; this.lo = 0; this.hi = 0;
        }
      }
    }
    /* The block in progress, as a last block, so the end of a clip draws. */
    finish() {
      if (this.fill) {
        if (this.count === this.mins.length) this.grow();
        this.mins[this.count] = this.lo;
        this.maxs[this.count] = this.hi;
        this.count++;
        this.fill = 0; this.lo = 0; this.hi = 0;
      }
      return this;
    }
  }
  VB.Peaks = Peaks;
  VB.PEAK_BLOCK = BLOCK;

  VB.peaksOf = function (buffer) {
    const p = new Peaks(Math.ceil(buffer.length / BLOCK) + 2);
    const a = buffer.getChannelData(0);
    const b = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
    p.add(a, b, buffer.length);
    return p.finish();
  };

  /* -------- The project -------- */
  function blank() {
    const id = VB.uid('tr');
    return {
      v: 1, rate: 0, takeNo: 1, voiceNo: 2, playhead: 0, armedId: id, currentId: id,
      tracks: [{ id, name: 'Voice 1', volume: 1, muted: false }],
      clips: []
    };
  }

  const P = VB.Project = {
    data: blank(),
    sources: new Map(),     // id → { id, kind, name, rate, channels, length, buffer, peaks }
    sel: { clipId: null, range: null },   // range: { trackId, a, b }
    clipboard: null,
    undoStack: [],
    redoStack: [],
    listeners: []
  };

  P.on = fn => P.listeners.push(fn);
  P.emit = what => { for (const fn of P.listeners) fn(what); };

  P.track = id => P.data.tracks.find(t => t.id === id) || null;
  P.clip = id => P.data.clips.find(c => c.id === id) || null;
  P.clipsOn = id => P.data.clips.filter(c => c.trackId === id);
  P.selectedClip = () => (P.sel.clipId ? P.clip(P.sel.clipId) : null);
  P.source = id => P.sources.get(id) || null;

  P.end = function () {
    let e = 0;
    for (const c of P.data.clips) e = Math.max(e, c.pos + c.len);
    return e;
  };

  P.isFileTrack = function (id) {
    return P.clipsOn(id).some(c => { const s = P.source(c.sourceId); return s && s.kind === 'file'; });
  };
  P.isEmptyTrack = id => !P.clipsOn(id).length;

  /* Where a new recording goes: the armed track, but never over an added file. */
  P.recordTarget = function () {
    const armed = P.track(P.data.armedId);
    if (armed && !P.isFileTrack(armed.id)) return armed;
    for (let i = P.data.tracks.length - 1; i >= 0; i--) {
      if (!P.isFileTrack(P.data.tracks[i].id)) return P.data.tracks[i];
    }
    return null;
  };

  /* -------- What sounds: the top clip at every moment -------- */
  P.visible = function (trackId) {
    let out = [];
    for (const c of P.clipsOn(trackId)) {
      const s = c.pos, e = c.pos + c.len;
      const next = [];
      for (const seg of out) {
        if (seg.end <= s || seg.start >= e) { next.push(seg); continue; }
        if (seg.start < s) next.push({ start: seg.start, end: s, clip: seg.clip });
        if (seg.end > e) next.push({ start: e, end: seg.end, clip: seg.clip });
      }
      next.push({ start: s, end: e, clip: c });
      next.sort((x, y) => x.start - y.start);
      out = next;
    }
    return out;
  };

  /* The list of sounding pieces, used by both playback and export so that they
     cannot disagree. Pieces that continue the same recording exactly are joined,
     so a split that was never moved stays bit-for-bit seamless. An edge that cuts
     into a recording gets a tiny fade (see FADE) so the cut cannot click. */
  VB.FADE = 128;   // samples: under 3 ms
  P.plan = function (trackId) {
    const merged = [];
    for (const v of P.visible(trackId)) {
      const off = v.clip.offset + (v.start - v.clip.pos);
      const last = merged[merged.length - 1];
      if (last && last.end === v.start && last.sourceId === v.clip.sourceId &&
          last.muted === !!v.clip.muted && last.off + (last.end - last.start) === off) {
        last.end = v.end;
      } else {
        merged.push({ start: v.start, end: v.end, off, sourceId: v.clip.sourceId, muted: !!v.clip.muted });
      }
    }
    const out = [];
    for (const s of merged) {
      const src = P.source(s.sourceId);
      if (s.muted || !src) continue;
      s.fadeIn = s.off > 0;
      s.fadeOut = s.off + (s.end - s.start) < src.length;
      out.push(s);
    }
    return out;
  };

  /* -------- Undo -------- */
  const snapshot = () => JSON.stringify({
    tracks: P.data.tracks, clips: P.data.clips, takeNo: P.data.takeNo, voiceNo: P.data.voiceNo,
    armedId: P.data.armedId, currentId: P.data.currentId
  });
  function restore(json) {
    Object.assign(P.data, JSON.parse(json));
    if (P.sel.clipId && !P.clip(P.sel.clipId)) P.sel.clipId = null;
    P.sel.range = null;
  }
  P.edit = function (label, fn) {
    const before = snapshot();
    const r = fn();
    if (r === false) return false;
    P.undoStack.push({ label, json: before });
    if (P.undoStack.length > 200) P.undoStack.shift();
    P.redoStack.length = 0;
    P.emit('edit');
    return r === undefined ? true : r;
  };
  P.undo = function () {
    const u = P.undoStack.pop();
    if (!u) return null;
    P.redoStack.push({ label: u.label, json: snapshot() });
    restore(u.json);
    P.emit('edit');
    return u.label;
  };
  P.redo = function () {
    const u = P.redoStack.pop();
    if (!u) return null;
    P.undoStack.push({ label: u.label, json: snapshot() });
    restore(u.json);
    P.emit('edit');
    return u.label;
  };

  /* -------- Tracks -------- */
  P.addTrack = function (name) {
    let track = null;
    P.edit('adding a track', () => {
      track = { id: VB.uid('tr'), name: name || ('Voice ' + P.data.voiceNo++), volume: 1, muted: false };
      P.data.tracks.push(track);
      P.data.armedId = track.id;
      P.data.currentId = track.id;
    });
    return track;
  };
  P.removeTrack = function (id) {
    P.edit('deleting a track', () => {
      P.data.tracks = P.data.tracks.filter(t => t.id !== id);
      P.data.clips = P.data.clips.filter(c => c.trackId !== id);
      if (!P.data.tracks.length) {
        const t = { id: VB.uid('tr'), name: 'Voice ' + P.data.voiceNo++, volume: 1, muted: false };
        P.data.tracks.push(t);
      }
      if (!P.track(P.data.armedId)) P.data.armedId = P.data.tracks[0].id;
      if (!P.track(P.data.currentId)) P.data.currentId = P.data.armedId;
      P.sel.range = null;
      if (P.sel.clipId && !P.clip(P.sel.clipId)) P.sel.clipId = null;
    });
  };
  P.chooseTrack = function (id) {
    P.data.currentId = id;
    if (!P.isFileTrack(id)) P.data.armedId = id;
    P.emit('select');
  };

  /* -------- Clips -------- */
  const raise = c => {
    P.data.clips = P.data.clips.filter(x => x !== c);
    P.data.clips.push(c);
  };
  const MIN_LEN = () => Math.round((P.data.rate || 48000) * 0.02);

  P.moveClip = function (id, pos, trackId) {
    P.edit('moving a clip', () => {
      const c = P.clip(id);
      if (!c) return false;
      c.pos = Math.max(0, Math.round(pos));
      c.trackId = trackId;
      raise(c);
      P.data.currentId = trackId;
      if (!P.isFileTrack(trackId)) P.data.armedId = trackId;
    });
  };

  P.trimLimits = function (c) {
    const src = P.source(c.sourceId);
    const srcLen = src ? src.length : c.offset + c.len;
    return { minPos: Math.max(0, c.pos - c.offset), maxEnd: c.pos + (srcLen - c.offset), minLen: MIN_LEN() };
  };
  P.trimClip = function (id, pos, len) {
    P.edit('trimming a clip', () => {
      const c = P.clip(id);
      if (!c) return false;
      c.offset += pos - c.pos;
      c.pos = pos;
      c.len = len;
      raise(c);
    });
  };

  /* One clip becomes two at `at`, with nothing else changing. */
  function cutClip(c, at) {
    if (at <= c.pos || at >= c.pos + c.len) return null;
    const left = at - c.pos;
    const right = Object.assign({}, c, { id: VB.uid('c'), pos: at, offset: c.offset + left, len: c.len - left });
    c.len = left;
    P.data.clips.splice(P.data.clips.indexOf(c) + 1, 0, right);
    return right;
  }
  function cutAllAt(trackId, at) {
    for (const c of P.clipsOn(trackId)) cutClip(c, at);
  }

  /* The clip you can see at a moment on a track (the top one). */
  P.clipAt = function (trackId, pos) {
    const list = P.clipsOn(trackId);
    for (let i = list.length - 1; i >= 0; i--) {
      const c = list[i];
      if (pos >= c.pos && pos < c.pos + c.len) return c;
    }
    return null;
  };

  P.canSplit = function () {
    if (P.sel.range) return true;
    const head = P.data.playhead;
    const c = P.selectedClip();
    if (c && head > c.pos && head < c.pos + c.len) return true;
    const v = P.clipAt(P.data.currentId, head);
    return !!(v && head > v.pos);
  };
  P.split = function () {
    const r = P.sel.range;
    if (r) {
      return P.edit('splitting', () => {
        cutAllAt(r.trackId, r.a);
        cutAllAt(r.trackId, r.b);
        P.sel.range = null;
        const mid = P.clipAt(r.trackId, r.a);
        P.sel.clipId = mid ? mid.id : null;
      });
    }
    const head = P.data.playhead;
    let c = P.selectedClip();
    if (!(c && head > c.pos && head < c.pos + c.len)) c = P.clipAt(P.data.currentId, head);
    if (!c || head <= c.pos) return false;
    return P.edit('splitting', () => {
      const right = cutClip(c, head);
      if (!right) return false;
      P.sel.clipId = right.id;
    });
  };

  /* -------- Copy and paste -------- */
  P.copyRangeItems = function (r) {
    const items = [];
    for (const v of P.visible(r.trackId)) {
      const s = Math.max(v.start, r.a), e = Math.min(v.end, r.b);
      if (e <= s) continue;
      items.push({
        sourceId: v.clip.sourceId, name: v.clip.name, muted: !!v.clip.muted,
        offset: v.clip.offset + (s - v.clip.pos), len: e - s, rel: s - r.a
      });
    }
    return items;
  };
  const clipItem = c => ({ sourceId: c.sourceId, name: c.name, muted: !!c.muted, offset: c.offset, len: c.len, rel: 0 });

  P.canCopy = () => !!(P.sel.range || P.sel.clipId);
  P.copy = function () {
    let span = 0, items = null;
    if (P.sel.range) {
      items = P.copyRangeItems(P.sel.range);
      span = P.sel.range.b - P.sel.range.a;
    } else if (P.selectedClip()) {
      const c = P.selectedClip();
      items = [clipItem(c)];
      span = c.len;
    }
    if (!items || !items.length) return false;
    P.clipboard = { items, span };
    P.emit('select');
    return true;
  };

  function placeItems(items, trackId, pos) {
    const made = [];
    for (const it of items) {
      const c = {
        id: VB.uid('c'), trackId, sourceId: it.sourceId, name: it.name, muted: it.muted,
        pos: pos + it.rel, offset: it.offset, len: it.len
      };
      P.data.clips.push(c);
      made.push(c);
    }
    return made;
  }

  P.canPaste = () => !!P.clipboard;
  P.paste = function () {
    const cb = P.clipboard;
    if (!cb) return false;
    return P.edit('pasting', () => {
      const trackId = P.data.currentId;
      const at = P.data.playhead;
      const made = placeItems(cb.items, trackId, at);
      P.sel.range = null;
      P.sel.clipId = made.length === 1 ? made[0].id : null;
      P.data.playhead = at + cb.span;
    });
  };

  P.canDuplicate = () => P.canCopy();
  P.duplicate = function () {
    const r = P.sel.range;
    if (r) {
      const items = P.copyRangeItems(r);
      if (!items.length) return false;
      return P.edit('duplicating', () => {
        const span = r.b - r.a;
        placeItems(items, r.trackId, r.b);
        P.sel.range = { trackId: r.trackId, a: r.b, b: r.b + span };
      });
    }
    const c = P.selectedClip();
    if (!c) return false;
    return P.edit('duplicating', () => {
      const made = placeItems([clipItem(c)], c.trackId, c.pos + c.len);
      P.sel.clipId = made[0].id;
    });
  };

  /* -------- Mute and delete -------- */
  P.canMute = () => P.canCopy();
  P.selectionMuted = function () {
    const r = P.sel.range;
    if (r) {
      const items = P.copyRangeItems(r);
      return !!items.length && items.every(i => i.muted);
    }
    const c = P.selectedClip();
    return !!(c && c.muted);
  };
  P.toggleMute = function (clipId) {
    const c = clipId ? P.clip(clipId) : P.selectedClip();
    const r = clipId ? null : P.sel.range;
    if (r) {
      const to = !P.selectionMuted();
      return P.edit(to ? 'muting' : 'unmuting', () => {
        cutAllAt(r.trackId, r.a);
        cutAllAt(r.trackId, r.b);
        for (const x of P.clipsOn(r.trackId)) {
          if (x.pos >= r.a && x.pos + x.len <= r.b) x.muted = to;
        }
      });
    }
    if (!c) return false;
    return P.edit(c.muted ? 'unmuting a clip' : 'muting a clip', () => { c.muted = !c.muted; });
  };

  P.canDelete = () => P.canCopy();
  function clearRange(r) {
    cutAllAt(r.trackId, r.a);
    cutAllAt(r.trackId, r.b);
    P.data.clips = P.data.clips.filter(x => !(x.trackId === r.trackId && x.pos >= r.a && x.pos + x.len <= r.b));
  }
  P.remove = function () {
    const r = P.sel.range;
    if (r) {
      return P.edit('deleting', () => {
        clearRange(r);
        P.sel.range = null;
        if (P.sel.clipId && !P.clip(P.sel.clipId)) P.sel.clipId = null;
      });
    }
    const c = P.selectedClip();
    if (!c) return false;
    return P.edit('deleting a clip', () => {
      P.data.clips = P.data.clips.filter(x => x !== c);
      P.sel.clipId = null;
    });
  };

  /* -------- Nudge: tiny moves for lining up by ear -------- */
  P.nudge = function (samples) {
    const c = P.selectedClip();
    if (!c) return false;
    return P.edit('nudging a clip', () => {
      c.pos = Math.max(0, c.pos + samples);
    });
  };

  /* -------- Saved and loaded -------- */
  P.serialize = () => JSON.stringify(P.data);
  P.load = function (json) {
    const d = JSON.parse(json);
    if (!d || !Array.isArray(d.tracks) || !d.tracks.length || !Array.isArray(d.clips)) return false;
    P.data = Object.assign(blank(), d);
    return true;
  };
  P.reset = function () {
    P.data = blank();
    P.sources.clear();
    P.sel = { clipId: null, range: null };
    P.clipboard = null;
    P.undoStack.length = 0;
    P.redoStack.length = 0;
    P.emit('edit');
  };
})();

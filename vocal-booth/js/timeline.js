/* ==========================================================================
   Vocal Booth — timeline.js
   The tracks as one canvas the size of the view, redrawn on change; native
   scrollbars from a large spacer behind it. Positions are whole samples.

   Pointer rules: a click puts the playhead there and selects the clip. Dragging
   a clip moves it (to another track too). Dragging a clip's edge trims it. With
   Select part on (or Shift held), a drag marks a portion of the track instead.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB;
  const P = VB.Project;
  const RULER = 26, STRIP = 18, MUTE_W = 22, SNAP_PX = 8, MIN_PPS = 1, MAX_PPS = 4000;

  const T = VB.Timeline = { pps: 16, tool: 'move', userZoomed: false, drag: null };

  let scroll, content, canvas, g, phEl, heads, W = 0, H = 0, dpr = 1, TH = 96;
  let queued = false, colors = {};

  const rate = () => VB.Engine.rate();
  const posToX = p => p / rate() * T.pps;
  const xToPos = x => Math.round(x / T.pps * rate());
  const trackY = i => RULER + i * TH - scroll.scrollTop;
  const E = () => VB.Engine;

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const get = n => s.getPropertyValue(n).trim();
    colors = {
      lane: get('--lane'), laneAlt: get('--lane-alt'), laneCur: get('--lane-current'), line: get('--line'), lineStrong: get('--line-strong'),
      text: get('--text'), text2: get('--text-2'), text3: get('--text-3'), bg2: get('--bg-2'),
      voice: get('--clip-voice'), voiceStrip: get('--clip-voice-strip'), voiceWave: get('--clip-voice-wave'),
      file: get('--clip-file'), fileStrip: get('--clip-file-strip'), fileWave: get('--clip-file-wave'),
      muted: get('--clip-muted'), mutedStrip: get('--clip-muted-strip'), mutedWave: get('--clip-muted-wave'),
      rec: get('--rec'), accent: get('--accent'), range: get('--range')
    };
  }

  /* -------- Layout -------- */
  T.mount = function () {
    scroll = document.getElementById('tl-scroll');
    content = document.getElementById('tl-content');
    canvas = document.getElementById('tl-canvas');
    phEl = document.getElementById('playhead');
    heads = document.getElementById('heads-inner');
    g = canvas.getContext('2d', { alpha: false });
    readColors();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { readColors(); T.draw(); });
    new ResizeObserver(() => T.layout()).observe(scroll);
    scroll.addEventListener('scroll', () => {
      heads.style.transform = 'translateY(' + (-scroll.scrollTop) + 'px)';
      T.draw();
      T.placeHead();
    }, { passive: true });
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onCancel);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    T.layout();
  };

  T.layout = function () {
    if (!scroll) return;
    TH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--track-h'), 10) || 96;
    W = scroll.clientWidth;
    H = scroll.clientHeight;
    dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    }
    if (!T.userZoomed) T.fit(true);
    sizeContent();
    T.draw();
    T.placeHead();
  };

  function endSamples() {
    let e = P.end();
    const take = E().take;
    if (take) e = Math.max(e, take.pos + take.n);
    const d = T.drag;
    if (d && d.preview) e = Math.max(e, d.preview.pos + d.preview.len);
    return Math.max(e, E().state === 'stopped' ? P.data.playhead : E().position());
  }

  function sizeContent() {
    const secs = endSamples() / rate();
    const pad = Math.max(30, W / T.pps * 0.5);
    const wide = Math.max(W, (secs + pad) * T.pps);
    const tall = Math.max(H, RULER + P.data.tracks.length * TH + 60);   // room to scroll past the buttons under the last track
    content.style.width = Math.ceil(wide) + 'px';
    content.style.height = Math.ceil(tall) + 'px';
  }
  T.sizeContent = sizeContent;

  /* -------- Zoom -------- */
  const minPps = () => MIN_PPS;
  T.fit = function (quiet) {
    const secs = Math.max(P.end() / rate(), 45);
    if (W) T.pps = Math.min(MAX_PPS, Math.max(minPps(), (W - 24) / (secs * 1.08)));
    if (!quiet) {
      T.userZoomed = false;
      sizeContent();
      scroll.scrollLeft = 0;
      T.draw();
      T.placeHead();
    }
  };
  /* Does the project run off the view at the zoom that was fitted to it? */
  T.overflows = function () {
    return posToX(P.end()) > W - 24;
  };
  T.zoomBy = function (factor, anchorViewX) {
    const anchor = anchorViewX == null ? W / 2 : anchorViewX;
    const at = (scroll.scrollLeft + anchor) / T.pps;
    T.pps = Math.min(MAX_PPS, Math.max(minPps(), T.pps * factor));
    T.userZoomed = true;
    sizeContent();
    scroll.scrollLeft = at * T.pps - anchor;
    T.draw();
    T.placeHead();
  };

  /* -------- Drawing -------- */
  T.draw = function () {
    if (queued || !g) return;
    queued = true;
    requestAnimationFrame(render);
  };
  T.drawNow = function () { render(); };

  let mmLo = 0, mmHi = 0;
  function minMax(peaks, buffer, s0, s1) {
    mmLo = 0; mmHi = 0;
    if (s1 <= 0) return;
    s0 = Math.max(0, s0);
    const span = s1 - s0;
    if (!buffer || span >= VB.PEAK_BLOCK) {
      let b0 = Math.floor(s0 / VB.PEAK_BLOCK), b1 = Math.ceil(s1 / VB.PEAK_BLOCK);
      if (b1 <= b0) b1 = b0 + 1;
      b1 = Math.min(b1, peaks.count);
      for (let b = b0; b < b1; b++) {
        if (peaks.mins[b] < mmLo) mmLo = peaks.mins[b];
        if (peaks.maxs[b] > mmHi) mmHi = peaks.maxs[b];
      }
    } else {
      const i0 = Math.floor(s0), i1 = Math.min(Math.ceil(s1), buffer.length);
      for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
        const d = buffer.getChannelData(ch);
        for (let i = i0; i < i1; i++) {
          const v = d[i];
          if (v < mmLo) mmLo = v;
          if (v > mmHi) mmHi = v;
        }
      }
    }
  }

  function drawWave(peaks, buffer, offset, x, w, top, height, color, hot) {
    const spp = rate() / T.pps;
    const step = 1 / dpr;
    const from = Math.max(0, x), to = Math.min(W, x + w);
    const mid = top + height / 2, half = height / 2 - 1;
    g.fillStyle = color;
    g.fillRect(from, mid - step / 2, to - from, step);
    let current = color;
    for (let px = from; px < to; px += step) {
      const s0 = offset + (px - x) * spp;
      minMax(peaks, buffer, s0, s0 + spp * step);
      const isHot = mmHi >= 0.99 || mmLo <= -0.99;
      const c = isHot ? hot : color;
      if (c !== current) { g.fillStyle = c; current = c; }
      const yT = mid - Math.min(1, mmHi) * half, yB = mid - Math.max(-1, mmLo) * half;
      g.fillRect(px, yT, step, Math.max(step, yB - yT));
    }
  }

  function rounded(x, y, w, h, r) {
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h);
  }

  function drawClip(c, y, opts) {
    opts = opts || {};
    const src = P.source(c.sourceId);
    const sx = scroll.scrollLeft;
    const x = posToX(c.pos) - sx, w = Math.max(2, posToX(c.len));
    if (x > W || x + w < 0) return;
    const h = TH - 6, top = y + 3;
    const kind = c.muted ? 'muted' : (src && src.kind === 'file' ? 'file' : 'voice');
    const bodyColor = colors[kind], stripColor = colors[kind + 'Strip'], waveColor = colors[kind + 'Wave'];

    g.save();
    if (opts.ghost) g.globalAlpha = 0.85;
    rounded(x, top, w, h, 6);
    g.fillStyle = bodyColor;
    g.fill();
    g.save();
    g.clip();
    g.fillStyle = stripColor;
    g.fillRect(x, top, w, STRIP);
    if (src) drawWave(src.peaks, src.buffer, c.offset, x, w, top + STRIP + 1, h - STRIP - 3, waveColor, colors.rec);
    if (c.muted) {
      g.strokeStyle = colors.line;
      g.lineWidth = 1;
      g.beginPath();
      const from = Math.max(x, -20), to = Math.min(x + w, W + 20);
      for (let sx2 = from - h; sx2 < to; sx2 += 12) { g.moveTo(sx2, top + h); g.lineTo(sx2 + h, top); }
      g.stroke();
    }
    // the name, and the clip's mute button
    if (w > 28) {
      g.font = '700 11px Nunito, system-ui, sans-serif';
      g.textBaseline = 'middle';
      g.fillStyle = c.muted ? colors.text3 : colors.text;
      const room = w - 14 - (w > 60 ? MUTE_W : 0);
      // the name stays in view while a long clip is scrolled past its start
      const tx = Math.max(x + 7, Math.min(6, x + w - 14 - (w > 60 ? MUTE_W : 0) - Math.min(room, g.measureText(c.name || '').width)));
      g.fillText(fit(c.name || '', room), tx, top + STRIP / 2 + 0.5);
    }
    if (w > 60) drawMuteIcon(x + w - MUTE_W, top, !!c.muted);
    g.restore();

    if (opts.selected) {
      rounded(x + 0.75, top + 0.75, w - 1.5, h - 1.5, 5.5);
      g.lineWidth = 1.5;
      g.strokeStyle = colors.accent;
      g.stroke();
    } else {
      rounded(x + 0.5, top + 0.5, w - 1, h - 1, 5.5);
      g.lineWidth = 1;
      g.strokeStyle = colors.line;
      g.stroke();
    }
    g.restore();
  }

  const fitCache = new Map();
  function fit(text, room) {
    if (g.measureText(text).width <= room) return text;
    const key = text + '|' + Math.round(room);
    if (fitCache.has(key)) return fitCache.get(key);
    let s = text;
    while (s.length > 1 && g.measureText(s + '…').width > room) s = s.slice(0, -1);
    const out = s + '…';
    if (fitCache.size > 500) fitCache.clear();
    fitCache.set(key, out);
    return out;
  }

  function drawMuteIcon(x, top, on) {
    const cx = x + MUTE_W / 2, cy = top + STRIP / 2;
    g.save();
    g.strokeStyle = on ? colors.rec : colors.text2;
    g.fillStyle = on ? colors.rec : colors.text2;
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(cx - 5, cy - 2); g.lineTo(cx - 3, cy - 2); g.lineTo(cx, cy - 4.5);
    g.lineTo(cx, cy + 4.5); g.lineTo(cx - 3, cy + 2); g.lineTo(cx - 5, cy + 2);
    g.closePath();
    g.fill();
    g.beginPath();
    if (on) {
      g.moveTo(cx + 2, cy - 2.5); g.lineTo(cx + 6, cy + 2.5);
      g.moveTo(cx + 6, cy - 2.5); g.lineTo(cx + 2, cy + 2.5);
    } else {
      g.arc(cx + 1, cy, 3.5, -0.8, 0.8);
      g.moveTo(cx + 3.8, cy - 3.6);
      g.arc(cx + 1, cy, 5.6, -0.8, 0.8);
    }
    g.stroke();
    g.restore();
  }

  function niceStep() {
    const list = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600];
    for (const s of list) if (s * T.pps >= 70) return s;
    return 1200;
  }
  VB.fmtRuler = function (sec, step) {
    const neg = sec < 0;
    sec = Math.abs(sec);
    const m = Math.floor(sec / 60);
    const s = sec - m * 60;
    if (step < 1) {
      const places = step < 0.01 ? 3 : step < 0.1 ? 2 : 1;
      return (neg ? '-' : '') + m + ':' + (s < 10 ? '0' : '') + s.toFixed(places);
    }
    return (neg ? '-' : '') + m + ':' + String(Math.round(s)).padStart(2, '0');
  };

  function render() {
    queued = false;
    if (!g || !W) return;
    const sx = scroll.scrollLeft;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = colors.bg2;
    g.fillRect(0, 0, W, H);

    const tracks = P.data.tracks;
    const step = niceStep();
    const startSec = Math.floor(sx / T.pps / step) * step;

    // lanes
    tracks.forEach((t, i) => {
      const y = trackY(i);
      if (y > H || y + TH < RULER) return;
      g.fillStyle = t.id === P.data.currentId ? colors.laneCur : (i % 2 ? colors.laneAlt : colors.lane);
      g.fillRect(0, y, W, TH);
      g.fillStyle = colors.line;
      g.fillRect(0, y + TH - 1, W, 1);
    });

    // time lines
    g.fillStyle = colors.line;
    const lanesBottom = Math.min(H, trackY(tracks.length));
    for (let s = startSec; s * T.pps - sx < W; s += step) {
      const x = Math.round(s * T.pps - sx);
      if (x >= 0) g.fillRect(x, RULER, 1, lanesBottom - RULER);
    }

    // clips, bottom one first, so what lies on top covers what is under it
    const drag = T.drag;
    tracks.forEach((t, i) => {
      const y = trackY(i);
      if (y > H || y + TH < RULER) return;
      g.save();
      g.beginPath();
      g.rect(0, y, W, TH);
      g.clip();
      for (const c of P.data.clips) {
        if (c.trackId !== t.id) continue;
        if (drag && drag.preview && drag.clipId === c.id) continue;
        drawClip(c, y, { selected: c.id === P.sel.clipId });
      }
      const take = E().take;
      if (take && take.trackId === t.id) drawLive(take, y);
      const r = drag && drag.range ? drag.range : P.sel.range;
      if (r && r.trackId === t.id) drawRange(r, y);
      g.restore();
    });

    // a clip being moved floats above everything
    if (drag && drag.preview) {
      const i = tracks.findIndex(t => t.id === drag.preview.trackId);
      if (i >= 0) {
        const y = trackY(i);
        const c = P.clip(drag.clipId);
        if (c) {
          g.save();
          g.beginPath();
          g.rect(0, RULER, W, H - RULER);
          g.clip();
          drawClip(Object.assign({}, c, drag.preview), y, { selected: true, ghost: drag.kind === 'move' });
          g.restore();
        }
      }
    }

    if (drag && drag.snapAt != null) {
      const x = Math.round(posToX(drag.snapAt) - sx);
      g.fillStyle = colors.accent;
      g.fillRect(x, RULER, 1, lanesBottom - RULER);
    }

    // the ruler stays on top
    g.fillStyle = colors.bg2;
    g.fillRect(0, 0, W, RULER);
    g.fillStyle = colors.lineStrong;
    g.fillRect(0, RULER - 1, W, 1);
    g.font = '700 11px Nunito, system-ui, sans-serif';
    g.textBaseline = 'middle';
    for (let s = startSec; s * T.pps - sx < W; s += step) {
      const x = Math.round(s * T.pps - sx);
      g.fillStyle = colors.lineStrong;
      g.fillRect(x, RULER - 7, 1, 6);
      g.fillStyle = colors.text2;
      g.fillText(VB.fmtRuler(s, step), x + 4, RULER / 2 - 2);
    }
  }

  function drawLive(take, y) {
    const sx = scroll.scrollLeft;
    const x = posToX(take.pos) - sx, w = Math.max(2, posToX(take.n));
    const top = y + 3, h = TH - 6;
    rounded(x, top, w, h, 6);
    g.fillStyle = colors.bg2;
    g.fill();
    g.save();
    rounded(x, top, w, h, 6);
    g.clip();
    g.fillStyle = colors.rec;
    g.fillRect(x, top, w, STRIP);
    g.font = '800 11px Nunito, system-ui, sans-serif';
    g.textBaseline = 'middle';
    g.fillStyle = '#fff';
    g.fillText('Recording…', Math.max(x + 7, 6), top + STRIP / 2 + 0.5);
    drawWave(take.peaks, null, 0, x, w, top + STRIP + 1, h - STRIP - 3, colors.text, colors.rec);
    g.restore();
  }

  function drawRange(r, y) {
    const sx = scroll.scrollLeft;
    const x0 = posToX(r.a) - sx, x1 = posToX(r.b) - sx;
    g.fillStyle = colors.range;
    g.fillRect(x0, y, x1 - x0, TH - 1);
    g.fillStyle = colors.accent;
    g.fillRect(x0, y, 1.5, TH - 1);
    g.fillRect(x1 - 1.5, y, 1.5, TH - 1);
  }

  /* -------- The playhead -------- */
  T.placeHead = function () {
    if (!phEl) return;
    const pos = E().state === 'stopped' ? P.data.playhead : E().position();
    const x = posToX(pos) - scroll.scrollLeft;
    if (x < -2 || x > W + 2) { phEl.style.display = 'none'; return; }
    phEl.style.display = '';
    phEl.style.transform = 'translateX(' + x + 'px)';
  };

  /* Keep the playhead in view while the music runs. */
  T.follow = function () {
    const pos = E().position();
    const x = posToX(pos);
    if (x > scroll.scrollLeft + W * 0.9 || x < scroll.scrollLeft) {
      sizeContent();
      scroll.scrollLeft = Math.max(0, x - W * 0.1);
    }
  };

  T.reveal = function (pos) {
    const x = posToX(pos);
    if (x < scroll.scrollLeft || x > scroll.scrollLeft + W - 20) scroll.scrollLeft = Math.max(0, x - W * 0.2);
  };

  /* -------- Pointer -------- */
  const pointers = new Map();
  let pinch = null;

  function localXY(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function hit(x, y, touch) {
    const pos = xToPos(x + scroll.scrollLeft);
    if (y < RULER) return { zone: 'ruler', pos };
    const i = Math.floor((y - RULER + scroll.scrollTop) / TH);
    const track = P.data.tracks[i];
    if (!track) return { zone: 'none', pos };
    const list = P.clipsOn(track.id);
    const edge = touch ? 12 : 6;
    const laneY = trackY(i);
    for (let k = list.length - 1; k >= 0; k--) {
      const c = list[k];
      const cx = posToX(c.pos) - scroll.scrollLeft, cw = posToX(c.len);
      if (x < cx - (cw > 20 ? edge / 2 : 0) || x > cx + cw + (cw > 20 ? edge / 2 : 0)) continue;
      const inStrip = y - laneY - 3 < STRIP;
      if (inStrip && cw > 60 && x >= cx + cw - MUTE_W - 2 && x < cx + cw - 4) return { zone: 'clipmute', pos, track, clip: c };
      if (cw > 16) {
        if (Math.abs(x - cx) <= edge) return { zone: 'trimL', pos, track, clip: c };
        if (Math.abs(x - (cx + cw)) <= edge) return { zone: 'trimR', pos, track, clip: c };
      }
      return { zone: 'clip', pos, track, clip: c };
    }
    return { zone: 'lane', pos, track };
  }

  function snapTargets(exceptId) {
    const out = [0, P.data.playhead];
    for (const c of P.data.clips) {
      if (c.id === exceptId) continue;
      out.push(c.pos, c.pos + c.len);
    }
    return out;
  }
  function nearest(values, targets) {
    const limit = SNAP_PX / T.pps * rate();
    let best = null, bestD = limit;
    for (const v of values) {
      for (const t of targets) {
        const d = Math.abs(t - v);
        if (d < bestD) { bestD = d; best = { delta: t - v, at: t }; }
      }
    }
    return best;
  }

  function onDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointers.set(e.pointerId, localXY(e));
    canvas.setPointerCapture(e.pointerId);
    if (pointers.size === 2) {
      T.drag = null;
      const [a, b] = [...pointers.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
      T.draw();
      return;
    }
    if (E().state === 'recording') return;

    const { x, y } = localXY(e);
    const touch = e.pointerType === 'touch';
    const h = hit(x, y, touch);
    const partTool = T.tool === 'part' || e.shiftKey;
    const d = T.drag = { id: e.pointerId, kind: 'none', sx: x, sy: y, moved: false, h, touch, alt: e.altKey };

    if (h.zone === 'ruler') {
      d.kind = 'ruler';
      seekTo(h.pos);
    } else if (h.zone === 'clipmute') {
      d.kind = 'clipmute';
    } else if (partTool && (h.zone === 'clip' || h.zone === 'lane' || h.zone === 'trimL' || h.zone === 'trimR')) {
      d.kind = 'part';
      d.anchor = h.pos;
    } else if (h.zone === 'trimL' || h.zone === 'trimR') {
      d.kind = h.zone;
      d.clipId = h.clip.id;
      d.orig = { pos: h.clip.pos, len: h.clip.len };
      d.limits = P.trimLimits(h.clip);
      d.targets = snapTargets(h.clip.id);
    } else if (h.zone === 'clip') {
      d.kind = 'move';
      d.clipId = h.clip.id;
      d.grab = h.pos - h.clip.pos;
      d.targets = snapTargets(h.clip.id);
    } else if (h.zone === 'lane') {
      d.kind = touch ? 'pan' : 'lane';
      d.panX = scroll.scrollLeft;
      d.panY = scroll.scrollTop;
    } else if (touch) {
      d.kind = 'pan';
      d.panX = scroll.scrollLeft;
      d.panY = scroll.scrollTop;
    }
  }

  function seekTo(pos) {
    E().seek(pos);
    T.placeHead();
    VB.App && VB.App.refreshTools();
    VB.App && VB.App.saveSoon();
  }

  function onMove(e) {
    const here = localXY(e);
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, here);

    if (pinch && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.dist > 0) T.zoomBy(dist / pinch.dist, (a.x + b.x) / 2);
      pinch.dist = dist;
      return;
    }

    const d = T.drag;
    if (!d || d.id !== e.pointerId) {
      if (!e.buttons && E().state !== 'recording') hover(here.x, here.y, e);
      return;
    }
    const dx = here.x - d.sx, dy = here.y - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < (d.touch ? 8 : 4)) return;
    d.moved = true;
    const useSnap = !e.altKey;

    // scroll along when dragging near the sides
    if (d.kind === 'move' || d.kind === 'part' || d.kind === 'trimL' || d.kind === 'trimR') {
      if (here.x > W - 30) scroll.scrollLeft += 18;
      else if (here.x < 30) scroll.scrollLeft -= 18;
    }
    const pos = xToPos(here.x + scroll.scrollLeft);

    if (d.kind === 'ruler') {
      seekTo(Math.max(0, pos));
    } else if (d.kind === 'pan') {
      scroll.scrollLeft = d.panX - dx;
      scroll.scrollTop = d.panY - dy;
    } else if (d.kind === 'move') {
      const c = P.clip(d.clipId);
      if (!c) return;
      let at = Math.max(0, pos - d.grab);
      d.snapAt = null;
      if (useSnap) {
        const s = nearest([at, at + c.len], d.targets);
        if (s) { at = Math.max(0, at + s.delta); d.snapAt = s.at; }
      }
      const idx = Math.max(0, Math.min(P.data.tracks.length - 1, Math.floor((here.y - RULER + scroll.scrollTop) / TH)));
      d.preview = { pos: Math.round(at), len: c.len, offset: c.offset, trackId: P.data.tracks[idx].id };
      T.draw();
    } else if (d.kind === 'trimL') {
      const c = P.clip(d.clipId);
      if (!c) return;
      let at = pos;
      d.snapAt = null;
      if (useSnap) {
        const s = nearest([at], d.targets);
        if (s) { at += s.delta; d.snapAt = s.at; }
      }
      const end = d.orig.pos + d.orig.len;
      at = Math.min(end - d.limits.minLen, Math.max(d.limits.minPos, at));
      d.preview = { pos: at, len: end - at, offset: c.offset + (at - c.pos), trackId: c.trackId };
      T.draw();
    } else if (d.kind === 'trimR') {
      const c = P.clip(d.clipId);
      if (!c) return;
      let at = pos;
      d.snapAt = null;
      if (useSnap) {
        const s = nearest([at], d.targets);
        if (s) { at += s.delta; d.snapAt = s.at; }
      }
      at = Math.max(d.orig.pos + d.limits.minLen, Math.min(d.limits.maxEnd, at));
      d.preview = { pos: d.orig.pos, len: at - d.orig.pos, offset: c.offset, trackId: c.trackId };
      T.draw();
    } else if (d.kind === 'part') {
      let b = pos, a = d.anchor;
      d.snapAt = null;
      if (useSnap) {
        const s = nearest([b], snapTargets(null));
        if (s) { b += s.delta; d.snapAt = s.at; }
      }
      const trackId = d.h.track ? d.h.track.id : P.data.currentId;
      d.range = { trackId, a: Math.max(0, Math.min(a, b)), b: Math.max(a, b) };
      T.draw();
    }
  }

  function onUp(e) {
    pointers.delete(e.pointerId);
    if (pinch && pointers.size < 2) { pinch = null; T.drag = null; return; }
    const d = T.drag;
    if (!d || d.id !== e.pointerId) return;
    T.drag = null;

    if (d.kind === 'ruler') { T.draw(); return; }

    if (d.kind === 'clipmute') {
      P.toggleMute(d.h.clip.id);
      return;
    }

    if (d.moved) {
      if (d.kind === 'move' && d.preview) {
        P.sel.clipId = d.clipId;
        P.sel.range = null;
        P.moveClip(d.clipId, d.preview.pos, d.preview.trackId);
        return;
      }
      if ((d.kind === 'trimL' || d.kind === 'trimR') && d.preview) {
        P.sel.clipId = d.clipId;
        P.sel.range = null;
        P.trimClip(d.clipId, d.preview.pos, d.preview.len);
        return;
      }
      if (d.kind === 'part' && d.range) {
        const len = d.range.b - d.range.a;
        if (len > rate() * 0.005) {
          P.sel.range = d.range;
          P.sel.clipId = null;
          P.data.currentId = d.range.trackId;
          seekTo(d.range.a);
        }
        P.emit('select');
        return;
      }
      T.draw();
      return;
    }

    // a click
    const h = d.h;
    if (h.track) {
      P.sel.range = null;
      P.sel.clipId = h.clip ? h.clip.id : null;
      P.chooseTrack(h.track.id);
      seekTo(Math.max(0, h.pos));
    } else if (h.zone === 'none') {
      P.sel.range = null;
      P.sel.clipId = null;
      P.emit('select');
    }
    T.draw();
  }

  function onCancel(e) {
    pointers.delete(e.pointerId);
    pinch = null;
    if (T.drag && T.drag.id === e.pointerId) { T.drag = null; T.draw(); }
  }

  function hover(x, y, e) {
    const h = hit(x, y, false);
    let cursor = 'default';
    const partTool = T.tool === 'part' || e.shiftKey;
    if (h.zone === 'ruler') cursor = 'pointer';
    else if (h.zone === 'clipmute') cursor = 'pointer';
    else if (partTool && h.zone !== 'none') cursor = 'text';
    else if (h.zone === 'trimL' || h.zone === 'trimR') cursor = 'ew-resize';
    else if (h.zone === 'clip') cursor = 'grab';
    canvas.style.cursor = cursor;
  }

  function onWheel(e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const { x } = localXY(e);
      T.zoomBy(Math.exp(-e.deltaY * 0.01), x);
    }
  }

  T.trackHeight = () => TH;
  T.rulerHeight = RULER;
})();

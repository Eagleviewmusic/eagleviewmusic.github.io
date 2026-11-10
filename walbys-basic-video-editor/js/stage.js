/* ==========================================================================
   Walby's Basic Video Editor — js/stage.js
   The canvas on screen: shows the playhead's moment, and lets you click a
   picture or text box to select it, drag it, size it from its corners, and
   crop it (double-click, C, or the Crop button).

   Sizing a picture keeps its shape; hold Shift to stretch it. Text boxes have
   edge handles too. Dragging snaps to the canvas edges and middle and to the
   other things showing (hold Option/Alt, or untick Snap, to place freely).
   While cropping, the cut-off parts show faintly; drag an edge to crop, drag
   inside to slide the picture within the crop.
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const S = VE.Stage = { s: 1, ox: 0, oy: 0, guides: [], tag: null };
  let stage, view, overlay, drag = null, queued = false;

  S.init = function () {
    stage = document.getElementById('stage');
    view = document.getElementById('view');
    overlay = document.getElementById('overlay');
    new ResizeObserver(() => S.draw()).observe(stage);
    overlay.addEventListener('pointerdown', down);
    overlay.addEventListener('dblclick', dbl);
    document.getElementById('b-crop-done').onclick = () => S.crop(false);
    ['project', 'live', 'time', 'select'].forEach(ev => VE.on(ev, S.draw));
  };

  S.fit = function () {
    const r = stage.getBoundingClientRect(), P = VE.P, m = 28;
    S.s = Math.max(0.01, Math.min((r.width - m * 2) / P.w, (r.height - m * 2) / P.h));
    S.ox = Math.round((r.width - P.w * S.s) / 2);
    S.oy = Math.round((r.height - P.h * S.s) / 2);
    return r;
  };
  const toCanvas = e => {
    const r = stage.getBoundingClientRect();
    return { x: (e.clientX - r.left - S.ox) / S.s, y: (e.clientY - r.top - S.oy) / S.s };
  };
  /* the selected picture/text clip, if it shows at the playhead */
  S.active = function () {
    const c = VE.selected();
    return c && c.kind !== 'audio' && VE.time >= c.start && VE.time < VE.end(c) && !VE.track(c.track).hidden ? c : null;
  };

  S.draw = function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; paint(); });
  };
  S.drawNow = paint;

  function fullRect(c) {      // where the whole (uncropped) picture would be
    const cr = c.crop, iw = c.w / (1 - cr.l - cr.r), ih = c.h / (1 - cr.t - cr.b);
    return { x: c.x - cr.l * iw, y: c.y - cr.t * ih, w: iw, h: ih };
  }

  function paint() {
    if (!VE.P || !stage) return;
    const r = S.fit(), dpr = window.devicePixelRatio || 1;
    const W = Math.round(r.width * dpr), H = Math.round(r.height * dpr);
    if (view.width !== W || view.height !== H) { view.width = W; view.height = H; }
    const g = view.getContext('2d'), P = VE.P, s = S.s, t = VE.time;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#0e0f12'; g.fillRect(0, 0, r.width, r.height);
    const a = S.active();
    // the parts of the selected thing outside the canvas, faintly
    if (a) {
      g.save(); g.translate(S.ox, S.oy); g.scale(s, s);
      if (VE.cropping && a.kind === 'image') {
        const bmp = VE.assets.get(a.asset) && VE.assets.get(a.asset).bitmap, f = fullRect(a);
        if (bmp) { g.globalAlpha = 0.3; g.drawImage(bmp, f.x, f.y, f.w, f.h); }
      } else VE.Render.drawClip(g, a, 0.22);
      g.restore();
    }
    g.save();
    g.translate(S.ox, S.oy);
    g.beginPath(); g.rect(0, 0, P.w * s, P.h * s); g.clip();
    VE.Render.frame(g, P, t, { scale: s });
    if (VE.cropping && a && a.kind === 'image') {
      // the cut-off parts over the canvas, dimmed, so the crop reads clearly
      const bmp = VE.assets.get(a.asset) && VE.assets.get(a.asset).bitmap, f = fullRect(a);
      if (bmp) {
        g.scale(s, s);
        g.globalAlpha = 0.35; g.drawImage(bmp, f.x, f.y, f.w, f.h);
        g.globalAlpha = 1; VE.Render.drawClip(g, a, 1);
      }
    }
    g.restore();
    g.strokeStyle = '#3a3f4b'; g.lineWidth = 1;
    g.strokeRect(S.ox - 0.5, S.oy - 0.5, P.w * s + 1, P.h * s + 1);
    handles(a);
    document.getElementById('crop-bar').hidden = !(VE.cropping && a);
  }

  function handles(a) {
    let html = '';
    const s = S.s;
    if (a) {
      const x = S.ox + a.x * s, y = S.oy + a.y * s, w = a.w * s, h = a.h * s;
      const crop = VE.cropping && a.kind === 'image';
      const list = crop || a.kind === 'text' ? ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] : ['nw', 'ne', 'se', 'sw'];
      const pos = { nw: [0, 0], n: [.5, 0], ne: [1, 0], e: [1, .5], se: [1, 1], s: [.5, 1], sw: [0, 1], w: [0, .5] };
      html += `<div class="box${crop ? ' crop' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">` +
        list.map(k => `<div class="h ${k}" data-h="${k}" style="left:${pos[k][0] * 100}%;top:${pos[k][1] * 100}%;cursor:${k.length === 1 ? (k === 'n' || k === 's' ? 'ns' : 'ew') : (k === 'nw' || k === 'se' ? 'nwse' : 'nesw')}-resize"></div>`).join('') +
        '</div>';
      if (S.tag) html += `<div class="size-tag" style="left:${x}px;top:${y + h + 6}px">${S.tag}</div>`;
    }
    for (const gd of S.guides) {
      html += gd.x != null
        ? `<div class="guide" style="left:${S.ox + gd.x * s}px;top:0;bottom:0;width:1px"></div>`
        : `<div class="guide" style="top:${S.oy + gd.y * s}px;left:0;right:0;height:1px"></div>`;
    }
    overlay.innerHTML = html;
  }

  /* ---- picking ---- */
  S.hit = function (pt) {
    const vis = VE.Render.visible(VE.P, VE.time).map(v => v.clip).reverse();   // front first
    const a = S.active();
    if (a && !vis.includes(a)) vis.unshift(a);
    return vis.find(c => pt.x >= c.x && pt.x <= c.x + c.w && pt.y >= c.y && pt.y <= c.y + c.h) || null;
  };

  function down(e) {
    if (e.button !== 0 || !VE.P) return;
    if (VE.Player.playing) VE.Player.pause();
    const pt = toCanvas(e), hk = e.target.dataset && e.target.dataset.h;
    let c = S.active();
    let mode;
    if (hk && c) mode = VE.cropping ? 'crop' : 'resize';
    else {
      const hit = S.hit(pt);
      if (VE.cropping) {
        if (hit && c && hit.id === c.id) mode = 'pan';
        else { S.crop(false); if (!hit) { VE.select(null); return; } }
      }
      if (!mode) {
        if (!hit) { VE.select(null); return; }
        VE.select(hit.id); c = hit; mode = 'move';
      }
    }
    e.preventDefault();
    overlay.setPointerCapture(e.pointerId);
    drag = { mode, h: hk, p0: pt, o: JSON.parse(JSON.stringify(c)), id: c.id, before: VE.snap() };
    overlay.onpointermove = move;
    overlay.onpointerup = overlay.onpointercancel = up;
  }
  function dbl(e) {
    const c = S.hit(toCanvas(e));
    if (!c) return;
    VE.select(c.id);
    if (c.kind === 'image') S.crop(true);
    else if (c.kind === 'text') VE.Inspector.focusText();
  }

  /* snap a set of x (or y) values to the targets → the shift to apply, and the guide */
  function snapAxis(vals, targets, thr) {
    let best = null;
    for (const v of vals) for (const t of targets) {
      const d = t - v;
      if (Math.abs(d) <= thr && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, at: t };
    }
    return best;
  }
  function targets(id) {
    const P = VE.P, xs = [0, P.w / 2, P.w], ys = [0, P.h / 2, P.h];
    for (const v of VE.Render.visible(P, VE.time)) {
      const c = v.clip; if (c.id === id) continue;
      xs.push(c.x, c.x + c.w / 2, c.x + c.w); ys.push(c.y, c.y + c.h / 2, c.y + c.h);
    }
    return { xs, ys };
  }

  function move(e) {
    if (!drag) return;
    const c = VE.clip(drag.id); if (!c) return;
    const pt = toCanvas(e), o = drag.o, dx = pt.x - drag.p0.x, dy = pt.y - drag.p0.y;
    const snapOn = document.getElementById('snap-on').checked && !e.altKey, thr = 8 / S.s;
    const T = snapOn ? targets(c.id) : { xs: [], ys: [] };
    S.guides = []; S.tag = null;
    if (drag.mode === 'move') {
      let nx = o.x + dx, ny = o.y + dy;
      const sx = snapAxis([nx, nx + o.w / 2, nx + o.w], T.xs, thr), sy = snapAxis([ny, ny + o.h / 2, ny + o.h], T.ys, thr);
      if (sx) { nx += sx.d; S.guides.push({ x: sx.at }); }
      if (sy) { ny += sy.d; S.guides.push({ y: sy.at }); }
      c.x = Math.round(nx); c.y = Math.round(ny);
      S.tag = `x ${c.x}  y ${c.y}`;
    } else if (drag.mode === 'resize') resize(c, o, drag.h, pt, e.shiftKey, T, thr);
    else if (drag.mode === 'crop') cropEdge(c, o, drag.h, dx, dy);
    else if (drag.mode === 'pan') cropPan(c, o, dx, dy);
    VE.live();
  }

  function resize(c, o, h, pt, shift, T, thr) {
    const keep = c.kind === 'image' ? !shift : shift && h.length === 2;
    const ax = h.includes('w') ? o.x + o.w : o.x, ay = h.includes('n') ? o.y + o.h : o.y;   // the corner that stays
    let px = pt.x, py = pt.y;
    const sx = snapAxis([px], T.xs, thr), sy = snapAxis([py], T.ys, thr);
    if (h.includes('e') || h.includes('w')) { if (sx) { px += sx.d; S.guides.push({ x: sx.at }); } } else px = h.includes('w') ? o.x : o.x + o.w;
    if (h.includes('n') || h.includes('s')) { if (sy) { py += sy.d; S.guides.push({ y: sy.at }); } } else py = h.includes('n') ? o.y : o.y + o.h;
    let w = h.includes('e') || h.includes('w') ? Math.abs(px - ax) : o.w;
    let hh = h.includes('n') || h.includes('s') ? Math.abs(py - ay) : o.h;
    if (keep) {
      const asp = o.w / o.h;
      if (h.length === 2) { if (w / asp > hh) hh = w / asp; else w = hh * asp; }
      else if (h === 'e' || h === 'w') hh = w / asp; else w = hh * asp;
      if (sx && sy) S.guides.pop();
    }
    w = Math.max(8, w); hh = Math.max(8, hh);
    let x = h.includes('w') ? ax - w : h.includes('e') ? ax : o.x + (o.w - w) / 2;
    let y = h.includes('n') ? ay - hh : h.includes('s') ? ay : o.y + (o.h - hh) / 2;
    if (h.length === 2) { x = h.includes('w') ? ax - w : ax; y = h.includes('n') ? ay - hh : ay; }
    c.x = Math.round(x); c.y = Math.round(y); c.w = Math.round(w); c.h = Math.round(hh);
    S.tag = `${c.w} × ${c.h}`;
  }

  const MIN = 0.02;
  function cropEdge(c, o, h, dx, dy) {
    const cr = o.crop, iw = o.w / (1 - cr.l - cr.r), ih = o.h / (1 - cr.t - cr.b);
    const n = { ...cr };
    let x = o.x, y = o.y, w = o.w, hh = o.h;
    if (h.includes('w')) { n.l = VE.clamp(cr.l + dx / iw, 0, 1 - cr.r - MIN); const d = (n.l - cr.l) * iw; x = o.x + d; w = o.w - d; }
    if (h.includes('e')) { n.r = VE.clamp(cr.r - dx / iw, 0, 1 - cr.l - MIN); w = (1 - cr.l - n.r) * iw; }
    if (h.includes('n')) { n.t = VE.clamp(cr.t + dy / ih, 0, 1 - cr.b - MIN); const d = (n.t - cr.t) * ih; y = o.y + d; hh = o.h - d; }
    if (h.includes('s')) { n.b = VE.clamp(cr.b - dy / ih, 0, 1 - cr.t - MIN); hh = (1 - cr.t - n.b) * ih; }
    c.crop = n; c.x = Math.round(x); c.y = Math.round(y); c.w = Math.round(w); c.h = Math.round(hh);
    const a = VE.asset(c.asset);
    S.tag = a ? `${Math.round((1 - n.l - n.r) * a.w)} × ${Math.round((1 - n.t - n.b) * a.h)} of the picture` : '';
  }
  function cropPan(c, o, dx, dy) {
    const cr = o.crop, iw = o.w / (1 - cr.l - cr.r), ih = o.h / (1 - cr.t - cr.b);
    const fw = 1 - cr.l - cr.r, fh = 1 - cr.t - cr.b;
    const l = VE.clamp(cr.l - dx / iw, 0, 1 - fw), t = VE.clamp(cr.t - dy / ih, 0, 1 - fh);
    c.crop = { l, r: Math.max(0, 1 - fw - l), t, b: Math.max(0, 1 - fh - t) };
  }

  function up() {
    overlay.onpointermove = overlay.onpointerup = overlay.onpointercancel = null;
    if (!drag) return;
    const b = drag.before; drag = null;
    S.guides = []; S.tag = null;
    VE.commit(b);
  }

  S.crop = function (on) {
    const c = VE.selected();
    VE.cropping = !!on && !!c && c.kind === 'image';
    VE.emit('select');
  };
  S.nudge = function (dx, dy) {
    const c = S.active(); if (!c) return false;
    VE.change(() => { c.x += dx; c.y += dy; });
    return true;
  };

  /* ---- placing helpers (inspector buttons) ---- */
  S.fitClip = function (c, mode) {
    const P = VE.P;
    if (c.kind !== 'image') { c.x = 0; c.y = 0; c.w = P.w; c.h = P.h; return; }
    const a = VE.asset(c.asset);
    if (mode === 'fill') {
      // cover the canvas: crop what sticks out, centred
      const asp = a.w / a.h, casp = P.w / P.h;
      if (asp > casp) { const keep = casp / asp; c.crop = { l: (1 - keep) / 2, r: (1 - keep) / 2, t: 0, b: 0 }; }
      else { const keep = asp / casp; c.crop = { l: 0, r: 0, t: (1 - keep) / 2, b: (1 - keep) / 2 }; }
      c.x = 0; c.y = 0; c.w = P.w; c.h = P.h;
    } else {
      const cr = c.crop, sw = (1 - cr.l - cr.r) * a.w, sh = (1 - cr.t - cr.b) * a.h;
      const k = Math.min(P.w / sw, P.h / sh);
      c.w = Math.round(sw * k); c.h = Math.round(sh * k);
      c.x = Math.round((P.w - c.w) / 2); c.y = Math.round((P.h - c.h) / 2);
    }
  };
  S.cropTo = function (c, ratio) {      // crop the picture to a shape (w/h), centred, keeping its width on screen
    const a = VE.asset(c.asset); if (!a) return;
    const asp = a.w / a.h;
    if (!ratio) c.crop = { l: 0, t: 0, r: 0, b: 0 };
    else if (ratio < asp) { const keep = ratio / asp; c.crop = { l: (1 - keep) / 2, r: (1 - keep) / 2, t: 0, b: 0 }; }
    else { const keep = asp / ratio; c.crop = { l: 0, r: 0, t: (1 - keep) / 2, b: (1 - keep) / 2 }; }
    const cr = c.crop, sw = (1 - cr.l - cr.r) * a.w, sh = (1 - cr.t - cr.b) * a.h, cx = c.x + c.w / 2, cy = c.y + c.h / 2;
    const w = c.w; c.h = Math.round(w * sh / sw); c.y = Math.round(cy - c.h / 2); c.x = Math.round(cx - w / 2);
  };
})();

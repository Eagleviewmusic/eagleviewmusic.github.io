/* ==========================================================================
   Walby's Basic Video Editor — js/render.js
   Drawing one moment of the canvas. The stage, the 📷 screenshot and the MP4
   all use VE.Render.frame, so what you see is what you get.

   frame(g, P, t, { scale })   g = a 2D context; the canvas origin at (0,0), scale = px per canvas px
   visible(P, t)  → [{ clip, alpha }] back → front
   drawClip(g, clip, alpha)    in canvas px (the caller scales)
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const R = VE.Render = {};
  R.FONTS = ['Helvetica Neue', 'Avenir Next', 'Futura', 'Gill Sans', 'Georgia', 'Times New Roman', 'Baskerville',
    'American Typewriter', 'Chalkboard SE', 'Marker Felt', 'Noteworthy', 'Courier New'];

  R.visible = function (P, t) {
    const out = [];
    const tracks = P.tracks.filter(tr => tr.kind === 'image' && !tr.hidden);
    for (let i = tracks.length - 1; i >= 0; i--) {             // last picture track = furthest back
      for (const c of P.clips) {
        if (c.track !== tracks[i].id || c.kind === 'audio') continue;
        if (t >= c.start && t < VE.end(c)) {
          const a = (c.opacity == null ? 1 : c.opacity) * VE.fade(c, t);
          if (a > 0.001) out.push({ clip: c, alpha: a });
        }
      }
    }
    return out;
  };

  R.frame = function (g, P, t, opt) {
    const s = (opt && opt.scale) || 1;
    g.save();
    g.scale(s, s);
    g.fillStyle = P.bg || '#000';
    g.fillRect(0, 0, P.w, P.h);
    for (const v of R.visible(P, t)) R.drawClip(g, v.clip, v.alpha);
    g.restore();
  };

  /* the part of the picture a clip shows, in the bitmap's own pixels */
  R.source = function (c, bmp) {
    const cr = c.crop || { l: 0, t: 0, r: 0, b: 0 };
    return { sx: cr.l * bmp.width, sy: cr.t * bmp.height,
      sw: Math.max(1, (1 - cr.l - cr.r) * bmp.width), sh: Math.max(1, (1 - cr.t - cr.b) * bmp.height) };
  };

  R.drawClip = function (g, c, alpha) {
    g.save();
    g.globalAlpha = alpha;
    if (c.kind === 'image') {
      const r = VE.assets.get(c.asset);
      if (r && r.bitmap) {
        const s = R.source(c, r.bitmap);
        g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
        g.drawImage(r.bitmap, s.sx, s.sy, s.sw, s.sh, c.x, c.y, c.w, c.h);
      } else {
        g.fillStyle = '#5a2020'; g.fillRect(c.x, c.y, c.w, c.h);
      }
    } else if (c.kind === 'text') R.drawText(g, c);
    g.restore();
  };

  R.font = c => (c.bold ? '700 ' : '400 ') + (c.size || 72) + 'px "' + (c.font || 'Helvetica Neue') + '", sans-serif';
  /* break the text into lines that fit the box (keeps the person's own line breaks) */
  R.lines = function (g, c) {
    const pad = R.pad(c), maxW = Math.max(10, c.w - pad * 2), out = [];
    g.font = R.font(c);
    for (const para of String(c.text || '').split('\n')) {
      const words = para.split(/(\s+)/);
      let line = '';
      for (const w of words) {
        const test = line + w;
        if (line && g.measureText(test.trimEnd()).width > maxW && w.trim()) { out.push(line.trimEnd()); line = w.trimStart(); }
        else line = test;
      }
      out.push(line.trimEnd());
    }
    return out;
  };
  R.pad = c => Math.round((c.size || 72) * 0.3);
  R.drawText = function (g, c) {
    if (c.box) {
      g.save();
      g.globalAlpha *= c.boxOpacity == null ? 0.6 : c.boxOpacity;
      g.fillStyle = c.boxColor || '#000000';
      const rad = Math.min(c.w, c.h, (c.size || 72)) * 0.25;
      g.beginPath(); g.roundRect(c.x, c.y, c.w, c.h, rad); g.fill();
      g.restore();
    }
    const lines = R.lines(g, c), lh = (c.size || 72) * 1.2, pad = R.pad(c);
    g.font = R.font(c);
    g.fillStyle = c.color || '#ffffff';
    g.textBaseline = 'middle';
    g.textAlign = c.align || 'center';
    const x = c.align === 'left' ? c.x + pad : c.align === 'right' ? c.x + c.w - pad : c.x + c.w / 2;
    let y = c.y + c.h / 2 - (lines.length - 1) * lh / 2;
    if (c.shadow !== false) { g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = (c.size || 72) * 0.12; g.shadowOffsetY = (c.size || 72) * 0.04; }
    for (const ln of lines) { g.fillText(ln, x, y); y += lh; }
  };
  /* the height a text box needs for its lines */
  R.textHeight = function (c) {
    const g = new OffscreenCanvas(4, 4).getContext('2d');
    return Math.ceil(R.lines(g, c).length * (c.size || 72) * 1.2 + R.pad(c) * 2);
  };
})();

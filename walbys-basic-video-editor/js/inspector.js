/* ==========================================================================
   Walby's Basic Video Editor — js/inspector.js
   The right-hand panel: the project's settings when nothing is selected,
   otherwise the selected clip's — timing, place and size, crop, opacity,
   fades, text, volume. Typing a value and pressing Return (or leaving the
   box) is one undo step; sliders are one step per drag.
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const I = VE.Inspector = {};
  let box;

  I.init = function () {
    box = document.getElementById('inspector');
    VE.on('select', I.render);
    VE.on('project', () => {
      const f = document.activeElement;
      if (f && box.contains(f) && /^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName)) I.refresh(); else I.render();
    });
    VE.on('live', I.refresh);
  };

  const sec = (title, body) => `<div class="insp-sec"><h3>${title}</h3>${body}</div>`;
  const num = (k, label, step) => `<label><span>${label}</span><input type="number" data-k="${k}" step="${step || 1}"></label>`;
  const field = (k, label, html) => `<div class="f"><span>${label}</span>${html || `<input data-k="${k}">`}</div>`;
  const slider = (k, label, min, max, step) =>
    `<div class="f"><span>${label}</span><div class="slider"><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}"><output data-o="${k}"></output></div></div>`;

  /* each key: how to read it, write it, and show it */
  const KEYS = {
    start: { get: c => VE.fmt(c.start), set: (c, v) => { const t = VE.parseTime(v); if (!isNaN(t)) moveTo(c, Math.max(0, t)); } },
    dur: { get: c => VE.fmt(c.dur), set: (c, v) => { const t = VE.parseTime(v); if (!isNaN(t) && t > 0) setDur(c, t); } },
    end: { get: c => VE.fmt(VE.end(c)), set: (c, v) => { const t = VE.parseTime(v); if (!isNaN(t) && t > c.start) setDur(c, t - c.start); } },
    offset: { get: c => VE.fmt(c.offset), set: (c, v) => {
      const t = VE.parseTime(v), a = VE.asset(c.asset);
      if (!isNaN(t)) { c.offset = VE.round(VE.clamp(t, 0, Math.max(0, (a.duration || 0) - 0.05))); c.dur = Math.min(c.dur, VE.round(a.duration - c.offset)); }
    } },
    x: { get: c => c.x, set: (c, v) => { c.x = Math.round(+v || 0); } },
    y: { get: c => c.y, set: (c, v) => { c.y = Math.round(+v || 0); } },
    w: { get: c => c.w, set: (c, v) => { v = Math.max(8, Math.round(+v || 0)); if (lock(c)) { c.h = Math.round(c.h * v / c.w); } c.w = v; } },
    h: { get: c => c.h, set: (c, v) => { v = Math.max(8, Math.round(+v || 0)); if (lock(c)) { c.w = Math.round(c.w * v / c.h); } c.h = v; } },
    opacity: { get: c => c.opacity, set: (c, v) => { c.opacity = +v; }, show: c => Math.round(c.opacity * 100) + '%' },
    fadeIn: { get: c => c.fadeIn, set: (c, v) => { c.fadeIn = VE.round(VE.clamp(+v || 0, 0, c.dur - c.fadeOut)); } },
    fadeOut: { get: c => c.fadeOut, set: (c, v) => { c.fadeOut = VE.round(VE.clamp(+v || 0, 0, c.dur - c.fadeIn)); } },
    gain: { get: c => c.gain, set: (c, v) => { c.gain = +v; }, show: c => Math.round(c.gain * 100) + '%' },
    text: { get: c => c.text, set: (c, v) => { c.text = v; } },
    font: { get: c => c.font, set: (c, v) => { c.font = v; } },
    size: { get: c => c.size, set: (c, v) => { c.size = VE.clamp(Math.round(+v || 72), 6, 1000); } },
    color: { get: c => c.color, set: (c, v) => { c.color = v; } },
    boxColor: { get: c => c.boxColor, set: (c, v) => { c.boxColor = v; } },
    boxOpacity: { get: c => c.boxOpacity, set: (c, v) => { c.boxOpacity = +v; }, show: c => Math.round(c.boxOpacity * 100) + '%' },
    box: { get: c => !!c.box, set: (c, v) => { c.box = v; } },
    bold: { get: c => !!c.bold, set: (c, v) => { c.bold = v; } },
    shadow: { get: c => c.shadow !== false, set: (c, v) => { c.shadow = v; } },
    align: { get: c => c.align || 'center', set: (c, v) => { c.align = v; } },
    // the project
    'p.title': { get: () => VE.P.title, set: (c, v) => { VE.P.title = v.trim() || VE.P.title; } },
    'p.bg': { get: () => VE.P.bg, set: (c, v) => { VE.P.bg = v; } },
    'p.size': { get: () => VE.P.w + 'x' + VE.P.h, set: (c, v) => {
      const [w, h] = v.split('x').map(Number); if (!(w > 0 && h > 0)) return;
      resizeCanvas(w, h);
    } },
  };
  let aspectLock = true;
  const lock = c => c.kind === 'image' && aspectLock;

  function moveTo(c, t) {
    if (!VE.overlaps(c.track, t, c.dur, [c.id])) { c.start = VE.round(t); return; }
    const tid = VE.freeTrack(VE.kindOfTrack(c), t, c.dur);
    c.start = VE.round(t); c.track = tid;
    VE.toast('Moved to “' + VE.track(tid).name + '” — that time was taken on its track.');
  }
  function setDur(c, d) {
    let hi = Infinity;
    for (const x of VE.clipsOn(c.track)) if (x.id !== c.id && x.start >= VE.end(c) - 1e-6) hi = Math.min(hi, x.start);
    if (c.kind === 'audio') { const a = VE.asset(c.asset); if (a && a.duration) hi = Math.min(hi, c.start + a.duration - c.offset); }
    const want = c.start + d;
    c.dur = VE.round(Math.max(1 / VE.P.fps, Math.min(want, hi) - c.start));
    if (want > hi + 1e-6) VE.toast('It stops where the next clip on its track starts' + (c.kind === 'audio' ? ', or where the sound file ends' : '') + '.');
    c.fadeIn = Math.min(c.fadeIn, c.dur); c.fadeOut = Math.min(c.fadeOut, c.dur - c.fadeIn);
  }
  /* a new canvas size: everything keeps its place relative to the canvas */
  function resizeCanvas(w, h) {
    const P = VE.P, kx = w / P.w, ky = h / P.h, k = Math.min(kx, ky);
    for (const c of P.clips) {
      if (c.kind === 'audio') continue;
      const cx = (c.x + c.w / 2) * kx, cy = (c.y + c.h / 2) * ky;
      c.w = Math.round(c.w * k); c.h = Math.round(c.h * k);
      c.x = Math.round(cx - c.w / 2); c.y = Math.round(cy - c.h / 2);
      if (c.kind === 'text') c.size = Math.max(6, Math.round(c.size * k));
    }
    P.w = w; P.h = h;
  }

  I.render = function () {
    if (!box || !VE.P) return;
    const c = VE.selected();
    let html;
    if (!c) {
      const P = VE.P, sizes = [['1920x1080', '1920 × 1080 (HD wide)'], ['1280x720', '1280 × 720'], ['3840x2160', '3840 × 2160 (4K)'], ['1080x1920', '1080 × 1920 (tall)'], ['1080x1080', '1080 × 1080 (square)']];
      if (!sizes.some(s => s[0] === P.w + 'x' + P.h)) sizes.push([P.w + 'x' + P.h, P.w + ' × ' + P.h]);
      html = `<div class="insp-title">Project</div>` +
        sec('Project', field('p.title', 'Name') +
          field('p.size', 'Canvas', `<select data-k="p.size">${sizes.map(s => `<option value="${s[0]}">${s[1]}</option>`).join('')}</select>`) +
          field('p.bg', 'Background', '<input type="color" data-k="p.bg">') +
          `<div class="f"><span>Length</span><b>${VE.fmt(VE.length())}</b></div>`) +
        `<div class="insp-note">Click a picture on the canvas or a clip on the timeline to change it.<br><br>
          <b>Keys</b><br>Space play/pause · S split · ⌘D duplicate · ⌫ delete · ⌘C/⌘V copy/paste · C crop ·
          T text · arrows move (⇧ ×10) · ←/→ step a frame when nothing is selected · ⌘Z undo · ⇧⌘S screenshot · ⌘E export</div>`;
    } else {
      const a = c.asset ? VE.asset(c.asset) : null, r = c.asset ? VE.assets.get(c.asset) : null;
      const kindName = { image: 'Picture', text: 'Text', audio: 'Audio' }[c.kind];
      html = `<div class="insp-title"><span class="tag ${c.kind}">${kindName}</span><span class="nm">${VE.esc(a ? a.name : (c.text || '').split('\n')[0])}</span></div>`;
      if (r && r.missing) html += `<div class="insp-note" style="color:#ffb4ae">This file is missing (${r.why}): ${VE.esc(a.file)}</div>`;
      if (c.kind === 'text') {
        html += sec('Text', `<textarea data-k="text" rows="3"></textarea>` +
          field('font', 'Font', `<select data-k="font">${VE.Render.FONTS.map(f => `<option style="font-family:'${f}'">${f}</option>`).join('')}</select>`) +
          `<div class="f2">${num('size', 'Aa', 1)}<label><span></span><input type="color" data-k="color" title="Text colour"></label></div>` +
          `<div class="row"><button data-act="align" data-v="left" class="small">⯇ Left</button><button data-act="align" data-v="center" class="small">Centre</button><button data-act="align" data-v="right" class="small">Right ⯈</button></div>` +
          `<label class="check"><input type="checkbox" data-k="bold"> Bold</label>` +
          `<label class="check"><input type="checkbox" data-k="shadow"> Soft shadow</label>` +
          `<label class="check"><input type="checkbox" data-k="box"> Box behind the text</label>` +
          `<div class="f2"><label><span></span><input type="color" data-k="boxColor" title="Box colour"></label><div class="slider"><input type="range" data-k="boxOpacity" min="0" max="1" step="0.01" title="Box opacity"><output data-o="boxOpacity"></output></div></div>` +
          `<div class="row"><button data-act="fit-text" class="small">Fit box to text</button></div>`);
      }
      html += sec('Timing', field('start', 'Starts') + field('dur', 'Length') + field('end', 'Ends') +
        (c.kind === 'audio' ? field('offset', 'From file at') : '') +
        `<div class="row"><button data-act="to-playhead" class="small">Start at playhead</button><button data-act="end-playhead" class="small">End at playhead</button></div>`);
      if (c.kind !== 'audio') {
        html += sec('Place & size',
          `<div class="f2">${num('x', 'X')}${num('y', 'Y')}</div><div class="f2">${num('w', 'W')}${num('h', 'H')}</div>` +
          (c.kind === 'image' ? `<label class="check"><input type="checkbox" id="aspect" ${aspectLock ? 'checked' : ''}> Keep the picture's shape</label>` : '') +
          `<div class="row"><button data-act="fit" class="small" title="Whole picture inside the canvas">Fit</button><button data-act="fill" class="small" title="Cover the whole canvas (crops what sticks out)">Fill</button><button data-act="center" class="small">Centre</button></div>` +
          `<div class="row"><button data-act="center-h" class="small">↔ Middle</button><button data-act="center-v" class="small">↕ Middle</button>${c.kind === 'image' ? '<button data-act="natural" class="small" title="The picture\'s own pixel size">1:1</button>' : ''}</div>`);
        if (c.kind === 'image') {
          html += sec('Crop',
            `<div class="row"><button data-act="crop" class="small ${VE.cropping ? 'on' : ''}">✂ ${VE.cropping ? 'Cropping… (Done)' : 'Crop on the canvas'}</button></div>` +
            `<div class="row"><button data-act="ratio" data-v="1.7778" class="small">16:9</button><button data-act="ratio" data-v="1.3333" class="small">4:3</button><button data-act="ratio" data-v="1" class="small">1:1</button><button data-act="ratio" data-v="0.5625" class="small">9:16</button></div>` +
            `<div class="row"><button data-act="ratio" data-v="0" class="small">Reset crop</button></div>`);
        }
        html += sec('Look', slider('opacity', 'Opacity', 0, 1, 0.01) + `<div class="f2">${num('fadeIn', 'In', 0.1)}${num('fadeOut', 'Out', 0.1)}</div><div class="dim small">Fades, in seconds</div>`);
        html += sec('Layer', field('track', 'Track', `<select data-act="track">${VE.P.tracks.filter(t => t.kind === 'image').map(t => `<option value="${t.id}"${t.id === c.track ? ' selected' : ''}>${VE.esc(t.name)}</option>`).join('')}</select>`) +
          `<div class="row"><button data-act="front" class="small">Bring to front</button><button data-act="back" class="small">Send to back</button></div>`);
      } else {
        html += sec('Sound', slider('gain', 'Volume', 0, 2, 0.01) + `<div class="f2">${num('fadeIn', 'In', 0.1)}${num('fadeOut', 'Out', 0.1)}</div><div class="dim small">Fades, in seconds</div>`);
      }
      html += sec('Clip', `<div class="row"><button data-act="split" class="small">✂ Split at playhead</button><button data-act="dup" class="small">⧉ Duplicate</button></div><div class="row"><button data-act="del" class="small danger">🗑 Delete clip</button></div>`);
    }
    box.innerHTML = html;
    bind(c);
    I.refresh();
  };

  /* put the current values in (without rebuilding, so typing isn't lost) */
  I.refresh = function () {
    if (!box || !VE.P) return;
    const c = VE.selected();
    box.querySelectorAll('[data-k]').forEach(el => {
      if (el === document.activeElement && el.type !== 'range') return;
      const K = KEYS[el.dataset.k]; if (!K) return;
      const v = K.get(c);
      if (el.type === 'checkbox') el.checked = !!v; else el.value = v == null ? '' : v;
    });
    box.querySelectorAll('[data-o]').forEach(o => { const K = KEYS[o.dataset.o]; o.textContent = K.show ? K.show(c) : ''; });
    if (c && c.kind === 'text') box.querySelectorAll('[data-act="align"]').forEach(b => b.classList.toggle('on', (c.align || 'center') === b.dataset.v));
  };

  function bind(c) {
    box.querySelectorAll('[data-k]').forEach(el => {
      const K = KEYS[el.dataset.k];
      let before = null;
      const start = () => { if (before == null) before = VE.snap(); };
      const live = () => { start(); K.set(c, el.type === 'checkbox' ? el.checked : el.value); if (el.dataset.k === 'text' || el.dataset.k === 'size') growText(c); VE.live(); I.refresh(); };
      const done = () => { const b = before; before = null; if (b) VE.commit(b); };
      el.addEventListener('focus', start);
      el.addEventListener('pointerdown', start);
      if (el.type === 'range' || el.type === 'color' || el.tagName === 'TEXTAREA') el.addEventListener('input', live);
      el.addEventListener('change', () => { live(); done(); });
      el.addEventListener('blur', done);
      el.addEventListener('keydown', e => {
        e.stopPropagation();
        if (e.key === 'Enter' && el.tagName !== 'TEXTAREA') el.blur();
        if (e.key === 'Escape') { el.blur(); }
      });
    });
    const asp = box.querySelector('#aspect');
    if (asp) asp.onchange = () => { aspectLock = asp.checked; };
    box.querySelectorAll('[data-act]').forEach(el => {
      const act = el.dataset.act;
      if (el.tagName === 'SELECT') { el.onchange = () => VE.change(() => { if (act === 'track') moveTrack(c, el.value); }); return; }
      el.onclick = () => run(act, c, el.dataset.v);
    });
  }

  function moveTrack(c, tid) {
    if (VE.overlaps(tid, c.start, c.dur, [c.id])) { VE.toast('That track already has something at this time.'); return; }
    c.track = tid;
  }
  function growText(c) {
    if (c.kind !== 'text') return;
    const need = VE.Render.textHeight(c);
    if (need > c.h) { c.y -= Math.round((need - c.h) / 2); c.h = need; }
  }

  function run(act, c, v) {
    const P = VE.P;
    switch (act) {
      case 'split': return VE.App.split();
      case 'dup': return VE.App.duplicate();
      case 'del': return VE.App.remove();
      case 'crop': return VE.Stage.crop(!VE.cropping);
      case 'align': return VE.change(() => { c.align = v; });
    }
    VE.change(() => {
      switch (act) {
        case 'to-playhead': moveTo(c, VE.time); break;
        case 'end-playhead': if (VE.time > c.start) setDur(c, VE.time - c.start); else VE.toast('The playhead is before this clip starts.'); break;
        case 'fit': VE.Stage.fitClip(c, 'fit'); break;
        case 'fill': VE.Stage.fitClip(c, 'fill'); break;
        case 'center': c.x = Math.round((P.w - c.w) / 2); c.y = Math.round((P.h - c.h) / 2); break;
        case 'center-h': c.x = Math.round((P.w - c.w) / 2); break;
        case 'center-v': c.y = Math.round((P.h - c.h) / 2); break;
        case 'natural': {
          const a = VE.asset(c.asset), cr = c.crop, cx = c.x + c.w / 2, cy = c.y + c.h / 2;
          c.w = Math.round((1 - cr.l - cr.r) * a.w); c.h = Math.round((1 - cr.t - cr.b) * a.h);
          c.x = Math.round(cx - c.w / 2); c.y = Math.round(cy - c.h / 2); break;
        }
        case 'ratio': VE.Stage.cropTo(c, +v); break;
        case 'fit-text': { const need = VE.Render.textHeight(c), cy = c.y + c.h / 2; c.h = need; c.y = Math.round(cy - need / 2); break; }
        case 'front': case 'back': {
          const list = P.tracks.filter(t => t.kind === 'image');
          const order = act === 'front' ? list : list.slice().reverse();
          const free = order.find(t => t.id !== c.track && !VE.overlaps(t.id, c.start, c.dur, [c.id]));
          const idx = list.findIndex(t => t.id === c.track);
          if (act === 'front' && idx === 0 || act === 'back' && idx === list.length - 1) { VE.toast('It is already ' + (act === 'front' ? 'in front.' : 'at the back.')); break; }
          if (free && (act === 'front' ? list.indexOf(free) < idx : list.indexOf(free) > idx)) c.track = free.id;
          else { const t = VE.newTrack('image', 'Pictures ' + (list.length + 1)); const i = P.tracks.indexOf(list[act === 'front' ? 0 : list.length - 1]); P.tracks.splice(act === 'front' ? i : i + 1, 0, t); c.track = t.id; }
          break;
        }
      }
    });
  }

  I.focusText = function () {
    const t = box.querySelector('textarea[data-k="text"]');
    if (t) { t.focus(); t.select(); }
  };
})();

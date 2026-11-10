/* ==========================================================================
   Walby's Basic Video Editor — js/timeline.js
   Tracks and clips. Picture tracks first (the top one is in front on the
   canvas), then audio tracks with their waveforms.

   - drag a clip to move it in time or to another track of its kind
     (a clip can't sit on top of another on the same track — it goes red and
     springs back; use another track for overlapping moments)
   - drag a clip's ends to make it longer/shorter (audio: trims the sound)
   - the round dots at a clip's top corners are its fade in / fade out
   - click the ruler or an empty spot to move the playhead; drag to scrub
   - ⌘/Ctrl + scroll (or pinch) zooms around the pointer; the slider and Fit too
   Edges snap to other clips, the playhead and 0 (hold Option/Alt to stop it).
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const T = VE.Timeline = { pps: 40, MIN_PPS: 0.5, MAX_PPS: 1000 };
  const HEAD = 196;
  let scroll, content, rows, ruler, rulerLane, playhead, snapline, timeEl, zoom, drag = null, queued = false;

  T.init = function () {
    scroll = document.getElementById('tl-scroll');
    content = document.getElementById('tl-content');
    rows = document.getElementById('tl-rows');
    ruler = document.getElementById('ruler');
    rulerLane = document.getElementById('tl-ruler-lane');
    playhead = document.getElementById('playhead');
    snapline = document.getElementById('snapline');
    timeEl = document.getElementById('tl-time');
    zoom = document.getElementById('zoom');

    scroll.addEventListener('scroll', () => T.paint());
    new ResizeObserver(() => T.layout()).observe(scroll);
    scroll.addEventListener('wheel', e => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      T.setZoom(T.pps * Math.exp(-e.deltaY * 0.01), e.clientX);
    }, { passive: false });
    zoom.addEventListener('input', () => T.setZoom(T.MIN_PPS * Math.pow(T.MAX_PPS / T.MIN_PPS, zoom.value / 1000)));
    document.getElementById('b-zoom-in').onclick = () => T.setZoom(T.pps * 1.5);
    document.getElementById('b-zoom-out').onclick = () => T.setZoom(T.pps / 1.5);
    document.getElementById('b-zoom-fit').onclick = () => T.fit();
    document.getElementById('b-add-img-track').onclick = () => VE.change(() => VE.addTrack('image'));
    document.getElementById('b-add-aud-track').onclick = () => VE.change(() => VE.addTrack('audio'));

    rulerLane.addEventListener('pointerdown', scrubStart);
    rows.addEventListener('pointerdown', rowDown);
    rows.addEventListener('dragover', dragOver);
    rows.addEventListener('dragleave', () => mark(null));
    rows.addEventListener('drop', dropOn);

    VE.on('project', T.render);
    VE.on('select', T.render);
    VE.on('live', () => { updateClips(); T.paint(); });
    VE.on('time', () => { T.playhead(); });
  };

  const laneW = () => Math.max(50, scroll.clientWidth - HEAD);
  const tOf = clientX => (clientX - rulerLane.getBoundingClientRect().left) / T.pps;

  /* ---- zoom ---- */
  T.setZoom = function (pps, anchorX) {
    pps = VE.clamp(pps, T.MIN_PPS, T.MAX_PPS);
    const r = scroll.getBoundingClientRect();
    const ax = anchorX != null ? anchorX - r.left - HEAD : Math.min(laneW(), Math.max(0, VE.time * T.pps - scroll.scrollLeft));
    const t = (scroll.scrollLeft + ax) / T.pps;
    T.pps = pps;
    zoom.value = Math.round(1000 * Math.log(pps / T.MIN_PPS) / Math.log(T.MAX_PPS / T.MIN_PPS));
    T.layout();
    scroll.scrollLeft = Math.max(0, t * pps - ax);
    T.paint();
  };
  T.fit = function () {
    const len = Math.max(10, VE.length());
    T.setZoom((laneW() - 30) / len);
    scroll.scrollLeft = 0;
  };

  /* ---- building the rows ---- */
  T.render = function () {
    if (!VE.P) return;
    const P = VE.P;
    const imgT = P.tracks.filter(t => t.kind === 'image'), audT = P.tracks.filter(t => t.kind === 'audio');
    let html = '';
    if (!P.tracks.length) html = '<div class="empty-tracks">No tracks — add one above.</div>';
    P.tracks.forEach(t => {
      const same = t.kind === 'image' ? imgT : audT, i = same.indexOf(t);
      const role = t.kind === 'image' ? (same.length > 1 ? (i === 0 ? 'in front' : i === same.length - 1 ? 'at the back' : '') : '') : '';
      html += `<div class="trow ${t.kind}${t.hidden ? ' hidden' : ''}${t.muted ? ' muted' : ''}" data-t="${t.id}">
        <div class="head">
          <div class="top">
            <input class="tname" value="${VE.esc(t.name)}" title="Track name">
            ${t.kind === 'image'
              ? `<button class="ico tog${t.hidden ? ' off' : ''}" title="${t.hidden ? 'Show' : 'Hide'} this track">${t.hidden ? '◌' : '👁'}</button>`
              : `<button class="ico tog${t.muted ? ' off' : ''}" title="${t.muted ? 'Unmute' : 'Mute'} this track">${t.muted ? '🔇' : '🔊'}</button>`}
            <button class="ico up" title="Move up"${i === 0 ? ' disabled' : ''}>▲</button>
            <button class="ico dn" title="Move down"${i === same.length - 1 ? ' disabled' : ''}>▼</button>
            <button class="ico del" title="Delete this track">✕</button>
          </div>
          ${t.kind === 'audio'
            ? `<div class="sub"><span>Vol</span><input type="range" class="vol" min="0" max="1.5" step="0.01" value="${t.volume}"><span class="vo">${Math.round(t.volume * 100)}%</span></div>`
            : `<div class="sub">${role ? 'Pictures ' + role : '&nbsp;'}</div>`}
        </div>
        <div class="lane">${VE.clipsOn(t.id).map(clipHTML).join('')}</div>
      </div>`;
    });
    rows.innerHTML = html;
    rows.querySelectorAll('.trow').forEach(bindHead);
    T.layout();
  };

  function clipHTML(c) {
    const a = c.asset ? VE.asset(c.asset) : null, r = c.asset ? VE.assets.get(c.asset) : null;
    const name = c.kind === 'text' ? '“' + (c.text || '').split('\n')[0].slice(0, 40) + '”' : a ? a.name : '?';
    const bg = c.kind === 'image' && r && r.url ? ` background-image:url('${r.url}');` : '';
    return `<div class="clip ${c.kind}${c.id === VE.sel ? ' sel' : ''}${r && r.missing ? ' missing' : ''}" data-c="${c.id}" style="${bg}">
      ${c.kind === 'audio' ? '<canvas class="wave"></canvas>' : '<div class="fades"></div>'}
      <span class="lbl">${VE.esc(name)}</span>
      <div class="fh in" data-f="in" title="Fade in"></div><div class="fh out" data-f="out" title="Fade out"></div>
      <div class="trim l" data-trim="l"></div><div class="trim r" data-trim="r"></div>
    </div>`;
  }

  function bindHead(row) {
    const t = VE.track(row.dataset.t);
    const nm = row.querySelector('.tname');
    nm.onchange = () => VE.change(() => { t.name = nm.value.trim() || t.name; });
    nm.onkeydown = e => { if (e.key === 'Enter') nm.blur(); e.stopPropagation(); };
    row.querySelector('.tog').onclick = () => VE.change(() => { if (t.kind === 'image') t.hidden = !t.hidden; else t.muted = !t.muted; });
    const move = d => VE.change(P => {
      const same = P.tracks.filter(x => x.kind === t.kind), i = same.indexOf(t), j = i + d;
      if (j < 0 || j >= same.length) return;
      [same[i], same[j]] = [same[j], same[i]];
      P.tracks = t.kind === 'image' ? same.concat(P.tracks.filter(x => x.kind !== 'image')) : P.tracks.filter(x => x.kind !== 'audio').concat(same);
    });
    row.querySelector('.up').onclick = () => move(-1);
    row.querySelector('.dn').onclick = () => move(1);
    row.querySelector('.del').onclick = () => {
      const n = VE.clipsOn(t.id).length;
      if (n && !confirm(`Delete “${t.name}” and its ${n} clip${n > 1 ? 's' : ''}?`)) return;
      VE.change(P => { P.tracks = P.tracks.filter(x => x !== t); P.clips = P.clips.filter(c => c.track !== t.id); });
      if (!VE.clip(VE.sel)) VE.select(null);
    };
    const vol = row.querySelector('.vol');
    if (vol) {
      let before = null;
      vol.onpointerdown = vol.onfocus = () => { if (before == null) before = VE.snap(); };
      vol.oninput = () => { t.volume = +vol.value; row.querySelector('.vo').textContent = Math.round(t.volume * 100) + '%'; VE.Player.retune(); T.paint(); };
      vol.onchange = () => { const b = before || VE.snap(); before = null; VE.commit(b); };
    }
  }

  /* ---- positions (zoom/scroll changes them; no rebuild) ---- */
  T.layout = function () {
    if (!VE.P || !scroll) return;
    const w = Math.max(VE.length() + 30, laneW() / T.pps) * T.pps;
    content.style.width = (HEAD + w) + 'px';
    rulerLane.style.width = w + 'px';
    rows.querySelectorAll('.lane').forEach(l => { l.style.width = w + 'px'; });
    updateClips();
    T.paint();
  };
  function updateClips() {
    rows.querySelectorAll('.clip').forEach(el => {
      const c = VE.clip(el.dataset.c); if (!c) return;
      el.style.left = (c.start * T.pps) + 'px';
      el.style.width = Math.max(2, c.dur * T.pps) + 'px';
      el.classList.toggle('sel', c.id === VE.sel);
      const fi = el.querySelector('.fh.in'), fo = el.querySelector('.fh.out');
      fi.style.left = Math.max(5, c.fadeIn * T.pps) + 'px';
      fo.style.left = Math.min(c.dur * T.pps - 5, (c.dur - c.fadeOut) * T.pps) + 'px';
      const f = el.querySelector('.fades');
      if (f) {
        const a = c.fadeIn * T.pps, b = c.fadeOut * T.pps, list = [];
        if (a > 0) list.push(`linear-gradient(to right, rgba(0,0,0,.65), rgba(0,0,0,0) ${a}px)`);
        if (b > 0) list.push(`linear-gradient(to left, rgba(0,0,0,.65), rgba(0,0,0,0) ${b}px)`);
        f.style.background = list.join(', ') || 'none';
      }
      const lbl = el.querySelector('.lbl');
      lbl.style.display = c.dur * T.pps < 24 ? 'none' : '';
    });
  }

  /* ruler, waveforms and playhead for what's on screen (called on scroll, zoom, edits) */
  T.paint = function () {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; paintNow(); });
  };
  function paintNow() {
    if (!VE.P) return;
    const sl = scroll.scrollLeft, w = laneW(), dpr = window.devicePixelRatio || 1;
    // ruler
    ruler.style.left = sl + 'px'; ruler.style.width = w + 'px';
    ruler.width = Math.round(w * dpr); ruler.height = Math.round(28 * dpr);
    const g = ruler.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, 28);
    const steps = [0.1, 0.2, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 1200];
    const major = steps.find(s => s * T.pps >= 70) || 1200;
    const minor = major / (major === 15 || major === 30 || major === 60 ? 3 : major >= 1 && String(major)[0] === '2' ? 4 : 5);
    const t0 = sl / T.pps, t1 = (sl + w) / T.pps;
    g.font = '11px -apple-system, sans-serif'; g.fillStyle = '#9aa0ad'; g.strokeStyle = '#555b68';
    g.beginPath();
    for (let t = Math.floor(t0 / minor) * minor; t <= t1; t += minor) {
      const x = Math.round(t * T.pps - sl) + 0.5, isMajor = Math.abs(t / major - Math.round(t / major)) < 1e-6;
      g.moveTo(x, isMajor ? 12 : 21); g.lineTo(x, 28);
      if (isMajor) g.fillText(VE.fmt(Math.round(t * 1000) / 1000, true), x + 3, 11);
    }
    g.stroke();
    // project end
    const len = VE.length();
    if (len > 0) { const x = len * T.pps - sl; g.fillStyle = 'rgba(255,255,255,.08)'; if (x < w) g.fillRect(Math.max(0, x), 0, w - Math.max(0, x), 28); }
    rows.querySelectorAll('.clip.audio').forEach(el => wave(el, sl, w, dpr));
    T.playhead();
  }

  function wave(el, sl, w, dpr) {
    const c = VE.clip(el.dataset.c), cv = el.querySelector('canvas.wave');
    if (!c || !cv) return;
    const r = VE.assets.get(c.asset), L = c.start * T.pps, R = VE.end(c) * T.pps;
    const a = Math.max(L, sl), b = Math.min(R, sl + w);
    if (!r || !r.peaks || b <= a) { cv.style.display = 'none'; return; }
    cv.style.display = ''; cv.style.left = (a - L) + 'px'; cv.style.width = (b - a) + 'px';
    const H = el.clientHeight || 56, pw = Math.round((b - a) * dpr), ph = Math.round(H * dpr);
    if (cv.width !== pw) cv.width = pw;
    if (cv.height !== ph) cv.height = ph;
    const g = cv.getContext('2d'), pk = r.peaks, mid = ph / 2, tr = VE.track(c.track);
    const vol = c.gain * (tr ? tr.volume : 1);
    g.clearRect(0, 0, pw, ph);
    g.fillStyle = '#bfe0ff';
    const secPerPx = 1 / (T.pps * dpr);
    for (let i = 0; i < pw; i++) {
      const tc = (a - L) / T.pps + i * secPerPx;               // seconds into the clip
      const tf = c.offset + tc;                                 // seconds into the file
      let i0 = Math.floor(tf / pk.per), i1 = Math.max(i0 + 1, Math.floor((tf + secPerPx) / pk.per));
      i1 = Math.min(i1, pk.lo.length);
      let mn = 0, mx = 0;
      for (let k = Math.max(0, i0); k < i1; k++) { if (pk.lo[k] < mn) mn = pk.lo[k]; if (pk.hi[k] > mx) mx = pk.hi[k]; }
      const f = vol * VE.fade(c, c.start + tc);
      const y0 = mid - Math.min(1, mx * f) * (mid - 2), y1 = mid - Math.max(-1, mn * f) * (mid - 2);
      g.fillRect(i, y0, 1, Math.max(1, y1 - y0));
    }
    // the fade lines
    if (c.fadeIn > 0 || c.fadeOut > 0) {
      g.strokeStyle = '#ffd34d'; g.lineWidth = 1.5 * dpr; g.beginPath();
      const X = t => ((c.start + t) * T.pps - a) * dpr;
      g.moveTo(X(0), c.fadeIn > 0 ? ph - 2 : 2); g.lineTo(X(c.fadeIn), 2);
      g.lineTo(X(c.dur - c.fadeOut), 2); g.lineTo(X(c.dur), c.fadeOut > 0 ? ph - 2 : 2);
      g.stroke();
    }
  }

  T.playhead = function () {
    if (!VE.P) return;
    playhead.style.left = (HEAD + VE.time * T.pps) + 'px';
    timeEl.textContent = VE.fmt(VE.time);
    if (VE.Player && VE.Player.playing) {
      const x = VE.time * T.pps, sl = scroll.scrollLeft, w = laneW();
      if (x > sl + w - 30 || x < sl) scroll.scrollLeft = Math.max(0, x - 30);
    }
  };
  T.reveal = function (t) {
    const x = t * T.pps, sl = scroll.scrollLeft, w = laneW();
    if (x < sl || x > sl + w - 20) scroll.scrollLeft = Math.max(0, x - w / 3);
  };

  /* ---- snapping ---- */
  function snapPoints(skipId) {
    const pts = [0, VE.time];
    for (const c of VE.P.clips) if (c.id !== skipId) pts.push(c.start, VE.end(c));
    return pts;
  }
  function snapT(t, pts, e) {
    if (!document.getElementById('snap-on').checked || (e && e.altKey)) return { t, at: null };
    const thr = 8 / T.pps;
    let best = null;
    for (const p of pts) { const d = Math.abs(p - t); if (d <= thr && (!best || d < best.d)) best = { d, p }; }
    return best ? { t: best.p, at: best.p } : { t, at: null };
  }
  function showSnap(at) {
    snapline.hidden = at == null;
    if (at != null) snapline.style.left = (HEAD + at * T.pps) + 'px';
  }

  /* ---- scrubbing ---- */
  function scrubStart(e) {
    if (e.button !== 0) return;
    if (VE.Player.playing) VE.Player.pause();
    const pts = [0].concat(VE.P.clips.flatMap(c => [c.start, VE.end(c)]));
    const go = ev => VE.seek(snapT(Math.max(0, tOf(ev.clientX)), pts, ev).t);
    go(e);
    const el = rulerLane;
    el.setPointerCapture(e.pointerId);
    el.onpointermove = go;
    el.onpointerup = el.onpointercancel = () => { el.onpointermove = el.onpointerup = el.onpointercancel = null; };
  }

  /* ---- clip dragging ---- */
  function rowDown(e) {
    if (e.button !== 0 || e.target.closest('.head')) return;
    const el = e.target.closest('.clip');
    if (!el) {
      if (e.target.closest('.lane')) { VE.select(null); scrubStart(e); }
      return;
    }
    if (VE.Player.playing) VE.Player.pause();
    const c = VE.clip(el.dataset.c); if (!c) return;
    e.preventDefault();
    VE.select(c.id);
    const mode = e.target.dataset.trim ? 'trim-' + e.target.dataset.trim : e.target.dataset.f ? 'fade-' + e.target.dataset.f : 'move';
    drag = { mode, id: c.id, o: JSON.parse(JSON.stringify(c)), x0: e.clientX, y0: e.clientY, before: VE.snap(), moved: false,
      pts: snapPoints(c.id), clipLeft: el.getBoundingClientRect().left };
    rows.setPointerCapture(e.pointerId);
    rows.onpointermove = dragMove;
    rows.onpointerup = rows.onpointercancel = dragEnd;
  }

  function dragMove(e) {
    if (!drag) return;
    const c = VE.clip(drag.id), o = drag.o;
    if (!c) return;
    if (!drag.moved && Math.abs(e.clientX - drag.x0) < 3 && Math.abs(e.clientY - drag.y0) < 3) return;
    drag.moved = true;
    const dt = (e.clientX - drag.x0) / T.pps, minDur = 1 / VE.P.fps;
    let at = null;
    if (drag.mode === 'move') {
      let ns = Math.max(0, o.start + dt);
      const a = snapT(ns, drag.pts, e), b = snapT(ns + o.dur, drag.pts, e);
      if (a.at != null && (b.at == null || Math.abs(a.t - ns) <= Math.abs(b.t - ns - o.dur))) { ns = a.t; at = a.at; }
      else if (b.at != null) { ns = b.t - o.dur; at = b.at; }
      ns = Math.max(0, ns);
      // which track is under the pointer (same kind only)
      const under = document.elementFromPoint(e.clientX, e.clientY), row = under && under.closest('.trow');
      const tr = row && VE.track(row.dataset.t);
      const tid = tr && tr.kind === VE.kindOfTrack(c) ? tr.id : c.track;
      const changed = tid !== c.track;
      c.start = VE.round(ns); c.track = tid;
      if (changed) T.render();
      const bad = VE.overlaps(c.track, c.start, c.dur, [c.id]);
      const el = rows.querySelector(`.clip[data-c="${c.id}"]`);
      if (el) { el.classList.add('dragging'); el.classList.toggle('bad', bad); }
      drag.bad = bad;
    } else if (drag.mode === 'trim-l') {
      const oEnd = o.start + o.dur;
      let ns = o.start + dt;
      const s = snapT(ns, drag.pts, e); ns = s.t; at = s.at;
      let lo = 0;
      for (const x of VE.clipsOn(c.track)) if (x.id !== c.id && VE.end(x) <= o.start + 1e-6) lo = Math.max(lo, VE.end(x));
      if (c.kind === 'audio') lo = Math.max(lo, o.start - o.offset);
      ns = VE.clamp(ns, lo, oEnd - minDur);
      if (ns !== s.t) at = null;
      c.start = VE.round(ns); c.dur = VE.round(oEnd - ns);
      if (c.kind === 'audio') c.offset = VE.round(Math.max(0, o.offset + (ns - o.start)));
      c.fadeIn = Math.min(c.fadeIn, c.dur); c.fadeOut = Math.min(c.fadeOut, c.dur - c.fadeIn);
    } else if (drag.mode === 'trim-r') {
      let ne = o.start + o.dur + dt;
      const s = snapT(ne, drag.pts, e); ne = s.t; at = s.at;
      let hi = Infinity;
      for (const x of VE.clipsOn(c.track)) if (x.id !== c.id && x.start >= o.start + o.dur - 1e-6) hi = Math.min(hi, x.start);
      if (c.kind === 'audio') { const a = VE.asset(c.asset); if (a && a.duration) hi = Math.min(hi, o.start + a.duration - o.offset); }
      ne = VE.clamp(ne, o.start + minDur, hi);
      if (ne !== s.t) at = null;
      c.dur = VE.round(ne - o.start);
      c.fadeOut = Math.min(c.fadeOut, c.dur); c.fadeIn = Math.min(c.fadeIn, c.dur - c.fadeOut);
    } else if (drag.mode === 'fade-in') {
      c.fadeIn = VE.round(VE.clamp((e.clientX - drag.clipLeft) / T.pps, 0, c.dur - c.fadeOut));
      VE.toast('Fade in: ' + c.fadeIn.toFixed(2) + ' s', 900);
    } else if (drag.mode === 'fade-out') {
      c.fadeOut = VE.round(VE.clamp(c.dur - (e.clientX - drag.clipLeft) / T.pps, 0, c.dur - c.fadeIn));
      VE.toast('Fade out: ' + c.fadeOut.toFixed(2) + ' s', 900);
    }
    showSnap(at);
    VE.live();
  }

  function dragEnd() {
    rows.onpointermove = rows.onpointerup = rows.onpointercancel = null;
    showSnap(null);
    if (!drag) return;
    const d = drag; drag = null;
    if (!d.moved) { T.render(); return; }
    const c = VE.clip(d.id);
    if (c && d.bad) {
      c.start = d.o.start; c.track = d.o.track;
      VE.toast('That spot is taken on that track — put overlapping clips on different tracks.');
    }
    VE.commit(d.before);
  }

  /* ---- dropping media from the bin or from Finder ---- */
  let marked = null;
  function mark(row) {
    if (marked && marked !== row) marked.classList.remove('drop-ok');
    marked = row; if (row) row.classList.add('drop-ok');
  }
  function dragOver(e) {
    const types = e.dataTransfer.types;
    if (!types.includes('application/x-ve-asset') && !types.includes('Files')) return;
    e.preventDefault(); e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    mark(e.target.closest('.trow'));
    const t = Math.max(0, tOf(e.clientX)), s = snapT(t, snapPoints(null), e);
    showSnap(s.at != null ? s.at : t);
  }
  async function dropOn(e) {
    e.preventDefault(); e.stopPropagation();
    const row = e.target.closest('.trow'); mark(null); showSnap(null);
    let t = Math.max(0, tOf(e.clientX));
    t = snapT(t, snapPoints(null), e).t;
    const tid = row && row.dataset.t;
    const id = e.dataTransfer.getData('application/x-ve-asset');
    let list = [];
    if (id) list = [VE.asset(id)].filter(Boolean);
    else if (e.dataTransfer.files.length) list = await VE.Media.add([...e.dataTransfer.files]);
    for (const a of list) {
      const tr = VE.track(tid);
      const c = VE.Media.place(a, t, tr && tr.kind === a.kind ? tid : null);
      t = VE.end(c);
    }
  }
})();

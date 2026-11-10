/* ==========================================================================
   Walby's Basic Video Editor — js/app.js
   Start-up, the projects screen, the media bin, the top bar, keys, dropping
   files, and saving (project.json is written by itself after every change).
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE, St = VE.Store;
  const A = VE.App = { copied: null };
  const $ = id => document.getElementById(id);

  /* ================= saving ================= */
  let saveTimer = 0, saving = null;
  function scheduleSave() {
    if (!VE.P || !VE.dir) return;
    $('save-state').textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(A.saveNow, 400);
  }
  A.saveNow = async function () {
    clearTimeout(saveTimer);
    if (!VE.P || !VE.dir) return;
    const p = VE.P, dir = VE.dir;
    await saving;
    saving = St.save(dir, p).then(
      () => { if (VE.P === p || VE.dir === dir) $('save-state').textContent = 'Saved'; },
      e => { console.error(e); $('save-state').textContent = '⚠ Not saved — ' + (e.message || e); });
    return saving;
  };

  /* ================= projects screen ================= */
  async function home(msg) {
    VE.Player.pause();
    if (VE.P) await A.saveNow();
    $('home').hidden = false;
    const body = $('home-body');
    if (!St.supported) {
      body.innerHTML = `<p>This editor needs <b>Google Chrome</b> (it saves into folders on your Mac). Open it with the
        <b>Walby's Basic Video Editor</b> app in Documents › Walby's Basic Video Editor.</p>`;
      return;
    }
    const root = await St.root();
    if (!root) {
      body.innerHTML = `<p>First, show the editor where its projects live: choose the folder
        <b>Documents › Walby's Basic Video Editor</b> and press <i>Open</i>, then let Chrome edit it.</p>
        <p>Each project gets its own folder in there, with its pictures and sounds, its MP4s and its screenshots.</p>
        <div class="home-actions"><button class="primary" id="h-pick">Choose the projects folder…</button></div>`;
      $('h-pick').onclick = () => pickRoot();
      return;
    }
    if (!(await St.allowed(root, false))) {
      body.innerHTML = `<p>Chrome needs your OK to open the projects folder <b>${VE.esc(root.name)}</b> again
        (it asks each time it restarts).</p>
        <div class="home-actions"><button class="primary" id="h-allow">Open my projects</button><button id="h-pick">Use another folder…</button></div>`;
      $('h-allow').onclick = async () => { if (await St.allowed(root, true)) home(); };
      $('h-pick').onclick = () => pickRoot();
      return;
    }
    const list = await St.list(root);
    body.innerHTML = (msg ? `<p>${msg}</p>` : '') +
      `<div class="home-actions"><button class="primary" id="h-new">＋ New project</button></div>` +
      (list.length ? `<div class="plist">${list.map((p, i) => `<div class="pitem" data-i="${i}"><span class="pn">${VE.esc(p.title)}</span>
        <span class="pm">${p.w}×${p.h} · ${new Date(p.modified).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span></div>`).join('')}</div>`
        : '<p>No projects yet.</p>') +
      `<p class="small">Projects folder: <b>${VE.esc(root.name)}</b> <button class="small ghost" id="h-pick">Change…</button></p>`;
    $('h-new').onclick = newProject;
    $('h-pick').onclick = () => pickRoot();
    body.querySelectorAll('.pitem').forEach(el => { el.onclick = () => openProject(list[+el.dataset.i].handle); });
  }
  async function pickRoot() {
    try { await St.pickRoot(); } catch (e) { if (e.name !== 'AbortError') VE.toast('Could not use that folder: ' + e.message); return; }
    home();
  }

  function newProject() {
    const d = $('dlg-new');
    $('n-title').value = 'My video';
    d.returnValue = '';
    d.showModal();
    $('n-title').select();
    d.onclose = async () => {
      if (d.returnValue !== 'ok') return;
      const [w, h] = $('n-size').value.split('x').map(Number);
      const p = VE.newProject($('n-title').value.trim() || 'My video', w, h);
      const root = await St.root();
      try { await openProject(await St.create(root, p)); }
      catch (e) { VE.toast('Could not make the project folder: ' + e.message, 6000); }
    };
  }

  async function openProject(dir) {
    let p;
    try { p = VE.normalize(await St.load(dir)); }
    catch (e) { VE.toast('That project could not be opened: ' + e.message, 6000); return; }
    VE.Media.forget();
    VE.dir = dir; VE.P = p; VE.sel = null; VE.time = 0; VE.cropping = false;
    VE.history.undo.length = 0; VE.history.redo.length = 0;
    $('home').hidden = true;
    St.set('last', dir.name);
    VE.emit('project'); VE.emit('select'); VE.emit('time');
    $('save-state').textContent = 'Loading media…';
    await VE.Media.loadAll();
    $('save-state').textContent = 'Saved';
    VE.Timeline.fit();
  }

  /* ================= the media bin ================= */
  function renderBin() {
    const list = $('bin-list');
    if (!VE.P) { list.innerHTML = ''; return; }
    const used = new Set(VE.P.clips.map(c => c.asset));
    list.innerHTML = VE.P.assets.map(a => {
      const r = VE.assets.get(a.id) || {};
      const meta = a.kind === 'image' ? `${a.w}×${a.h}` : VE.fmt(a.duration, true);
      return `<div class="asset ${a.kind}${used.has(a.id) ? ' used' : ''}${r.missing ? ' missing' : ''}" draggable="true" data-a="${a.id}" title="${VE.esc(a.name)} — drag onto the timeline, or double-click to add at the playhead">
        <div class="thumb" style="${a.kind === 'image' && r.url ? `background-image:url('${r.url}')` : ''}">${a.kind === 'audio' ? '<canvas></canvas>' : ''}</div>
        <div class="name">${a.kind === 'audio' ? '♪ ' : ''}${VE.esc(a.name)}</div><div class="meta">${r.missing ? 'missing' : meta}</div>
        <button class="x" title="Take out of this project">✕</button></div>`;
    }).join('');
    $('bin-empty').hidden = VE.P.assets.length > 0;
    list.querySelectorAll('.asset').forEach(el => {
      const a = VE.asset(el.dataset.a), r = VE.assets.get(a.id);
      el.ondragstart = e => { e.dataTransfer.setData('application/x-ve-asset', a.id); e.dataTransfer.effectAllowed = 'copy'; };
      el.ondblclick = () => VE.Media.place(a, VE.time);
      el.querySelector('.x').onclick = e => {
        e.stopPropagation();
        const n = VE.P.clips.filter(c => c.asset === a.id).length;
        if (n && !confirm(`“${a.name}” is used ${n} time${n > 1 ? 's' : ''} on the timeline. Take it and those clips out? (The file stays in the project's Media folder.)`)) return;
        VE.change(P => { P.assets = P.assets.filter(x => x !== a); P.clips = P.clips.filter(c => c.asset !== a.id); });
        if (!VE.clip(VE.sel)) VE.select(null);
      };
      const cv = el.querySelector('canvas');
      if (cv && r && r.peaks) miniWave(cv, r.peaks);
    });
  }
  function miniWave(cv, pk) {
    const w = cv.width = 200, h = cv.height = 64, g = cv.getContext('2d'), n = pk.lo.length;
    g.fillStyle = '#6fb3f0';
    for (let x = 0; x < w; x++) {
      const a = Math.floor(x * n / w), b = Math.max(a + 1, Math.floor((x + 1) * n / w));
      let mn = 0, mx = 0;
      for (let i = a; i < b; i++) { if (pk.lo[i] < mn) mn = pk.lo[i]; if (pk.hi[i] > mx) mx = pk.hi[i]; }
      g.fillRect(x, h / 2 - mx * h / 2, 1, Math.max(1, (mx - mn) * h / 2));
    }
  }

  /* ================= clip actions ================= */
  A.split = function () {
    const t = VE.time, sel = VE.selected();
    const list = sel ? [sel] : VE.P.clips.filter(c => t > c.start && t < VE.end(c));
    const cut = list.filter(c => t > c.start + 1e-3 && t < VE.end(c) - 1e-3);
    if (!cut.length) { VE.toast(sel ? 'Put the playhead inside the selected clip to split it.' : 'Put the playhead over a clip to split it.'); return; }
    let last = null;
    VE.change(P => {
      for (const c of cut) {
        const b = JSON.parse(JSON.stringify(c));
        b.id = VE.uid(); b.start = VE.round(t); b.dur = VE.round(VE.end(c) - t); b.fadeIn = 0;
        if (c.kind === 'audio') b.offset = VE.round(c.offset + (t - c.start));
        c.dur = VE.round(t - c.start); c.fadeOut = 0;
        c.fadeIn = Math.min(c.fadeIn, c.dur); b.fadeOut = Math.min(b.fadeOut, b.dur);
        P.clips.push(b); last = b;
      }
    });
    if (sel && last) VE.select(last.id);
  };
  A.duplicate = function () {
    const c = VE.selected(); if (!c) return;
    let d;
    VE.change(P => {
      d = JSON.parse(JSON.stringify(c)); d.id = VE.uid(); d.start = VE.end(c);
      d.track = VE.freeTrack(VE.kindOfTrack(c), d.start, d.dur, c.track);
      P.clips.push(d);
    });
    VE.select(d.id);
  };
  A.remove = function () {
    const c = VE.selected(); if (!c) return;
    VE.change(P => { P.clips = P.clips.filter(x => x !== c); });
    VE.select(null);
  };
  A.copy = function () { const c = VE.selected(); if (c) { A.copied = JSON.parse(JSON.stringify(c)); VE.toast('Copied — ⌘V puts it at the playhead.', 1500); } };
  A.paste = function () {
    if (!A.copied) return;
    let d;
    VE.change(P => {
      d = JSON.parse(JSON.stringify(A.copied)); d.id = VE.uid(); d.start = VE.round(VE.time);
      if (d.asset && !VE.asset(d.asset)) return;
      d.track = VE.freeTrack(VE.kindOfTrack(d), d.start, d.dur, VE.track(d.track) ? d.track : null);
      P.clips.push(d);
    });
    if (VE.clip(d.id)) VE.select(d.id);
  };
  A.addText = function () {
    if (!VE.P) return;
    const P = VE.P, size = Math.round(Math.min(P.w, P.h) * 0.08);
    let c;
    VE.change(() => {
      c = { id: VE.uid(), kind: 'text', text: 'Your words here', font: 'Helvetica Neue', size, bold: true, color: '#ffffff',
        align: 'center', box: false, boxColor: '#000000', boxOpacity: 0.55, shadow: true,
        start: VE.round(VE.time), dur: 5, opacity: 1, fadeIn: 0, fadeOut: 0, w: Math.round(P.w * 0.7) };
      c.h = VE.Render.textHeight(c);
      c.x = Math.round((P.w - c.w) / 2); c.y = Math.round((P.h - c.h) / 2);
      c.track = VE.freeTrack('image', c.start, c.dur);
      P.clips.push(c);
    });
    VE.select(c.id);
    setTimeout(() => VE.Inspector.focusText(), 50);
  };

  /* ================= files from Finder / the clipboard ================= */
  async function addFiles(files, where) {
    if (!VE.P) { VE.toast('Open or make a project first.'); return; }
    const list = await VE.Media.add(files);
    if (where === 'stage') {
      let t = VE.time;
      for (const a of list) { const c = VE.Media.place(a, t); if (a.kind === 'image') t = VE.end(c); }
    } else if (list.length) VE.toast(`Added ${list.length} file${list.length > 1 ? 's' : ''} to the media list — drag onto the timeline.`);
  }
  function initDrop() {
    const cover = $('drop-cover');
    let depth = 0;
    const isFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
    document.addEventListener('dragenter', e => { if (isFiles(e) && VE.P) { depth++; cover.hidden = false; } });
    document.addEventListener('dragleave', e => { if (isFiles(e)) { depth = Math.max(0, depth - 1); if (!depth) cover.hidden = true; } });
    document.addEventListener('dragover', e => { if (isFiles(e)) e.preventDefault(); });
    document.addEventListener('drop', e => {
      depth = 0; cover.hidden = true;
      if (!isFiles(e)) return;
      e.preventDefault();
      addFiles([...e.dataTransfer.files], e.target.closest && e.target.closest('#stage') ? 'stage' : 'bin');
    });
    // the timeline handles its own drops; just hide the cover
    $('tl-rows').addEventListener('drop', () => { depth = 0; cover.hidden = true; }, true);
    document.addEventListener('paste', e => {
      if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
      const files = [...(e.clipboardData && e.clipboardData.files || [])];
      if (files.length) { e.preventDefault(); addFiles(files.map((f, i) => f.name && f.name !== 'image.png' ? f : new File([f], `Pasted ${new Date().toTimeString().slice(0, 8).replace(/:/g, '.')}${i ? ' ' + i : ''}.png`, { type: f.type })), 'stage'); }
      else if (A.copied) { e.preventDefault(); A.paste(); }
    });
  }

  /* ================= keys ================= */
  function keys(e) {
    if (!VE.P || !$('home').hidden || document.querySelector('dialog[open]')) return;
    const tag = document.activeElement && document.activeElement.tagName;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) && document.activeElement.type !== 'range' && document.activeElement.type !== 'checkbox') return;
    const cmd = e.metaKey || e.ctrlKey, k = e.key;
    const stop = () => { e.preventDefault(); e.stopPropagation(); };
    if (cmd && k.toLowerCase() === 'z') { stop(); e.shiftKey ? VE.redo() : VE.undo(); return; }
    if (cmd && k.toLowerCase() === 'y') { stop(); VE.redo(); return; }
    if (cmd && k.toLowerCase() === 'd') { stop(); A.duplicate(); return; }
    if (cmd && k.toLowerCase() === 'c') { if (VE.selected()) { stop(); A.copy(); } return; }
    if (cmd && k.toLowerCase() === 'e') { stop(); VE.Export.open(); return; }
    if (cmd && k.toLowerCase() === 's') { stop(); if (e.shiftKey) VE.Export.screenshot(); else { A.saveNow(); VE.toast('It saves by itself as you work.', 1500); } return; }
    if (cmd) return;
    if (k === ' ') { stop(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); VE.Player.toggle(); return; }
    if (k === 'Delete' || k === 'Backspace') { stop(); A.remove(); return; }
    if (k === 's' || k === 'S') { stop(); A.split(); return; }
    if (k === 'c' || k === 'C') { const c = VE.selected(); if (c && c.kind === 'image') { stop(); VE.Stage.crop(!VE.cropping); } return; }
    if (k === 't' || k === 'T') { stop(); A.addText(); return; }
    if (k === 'Escape') { stop(); if (VE.cropping) VE.Stage.crop(false); else VE.select(null); return; }
    if (k === 'Enter' && VE.cropping) { stop(); VE.Stage.crop(false); return; }
    if (k === 'Home') { stop(); VE.seek(0); VE.Timeline.reveal(0); return; }
    if (k === 'End') { stop(); VE.seek(VE.length()); VE.Timeline.reveal(VE.time); return; }
    if (k === '=' || k === '+') { stop(); VE.Timeline.setZoom(VE.Timeline.pps * 1.5); return; }
    if (k === '-' || k === '_') { stop(); VE.Timeline.setZoom(VE.Timeline.pps / 1.5); return; }
    if (k.startsWith('Arrow')) {
      const d = e.shiftKey ? 10 : 1;
      if (VE.Stage.active()) {
        stop();
        VE.Stage.nudge(k === 'ArrowLeft' ? -d : k === 'ArrowRight' ? d : 0, k === 'ArrowUp' ? -d : k === 'ArrowDown' ? d : 0);
      } else if (k === 'ArrowLeft' || k === 'ArrowRight') {
        stop(); VE.Player.pause();
        const step = e.shiftKey ? 1 : 1 / VE.P.fps;
        VE.seek(Math.max(0, Math.round((VE.time + (k === 'ArrowLeft' ? -step : step)) * VE.P.fps) / VE.P.fps));
        VE.Timeline.reveal(VE.time);
      }
    }
  }

  /* ================= the timeline's height ================= */
  function initSplitter() {
    const sp = $('splitter'), root = document.documentElement;
    let h = 300;
    try { h = +localStorage.getItem('wbve_timeline_h') || 300; } catch (e) { /* none */ }
    const set = v => { h = VE.clamp(v, 130, window.innerHeight - 260); root.style.setProperty('--timeline-h', h + 'px'); };
    set(h);
    sp.onpointerdown = e => {
      sp.setPointerCapture(e.pointerId);
      const y0 = e.clientY, h0 = h;
      sp.onpointermove = ev => set(h0 + (y0 - ev.clientY));
      sp.onpointerup = () => { sp.onpointermove = sp.onpointerup = null; try { localStorage.setItem('wbve_timeline_h', h); } catch (e2) { /* fine */ } };
    };
    window.addEventListener('resize', () => set(h));
  }

  /* ================= start ================= */
  function boot() {
    if (location.protocol === 'file:') { $('file-warning').hidden = false; document.body.style.overflow = 'auto'; return; }
    VE.Stage.init(); VE.Timeline.init(); VE.Inspector.init();
    initDrop(); initSplitter();
    document.addEventListener('keydown', keys);

    $('b-home').onclick = () => home();
    $('b-undo').onclick = VE.undo;
    $('b-redo').onclick = VE.redo;
    $('b-add').onclick = () => $('file-in').click();
    $('file-in').onchange = () => { const f = [...$('file-in').files]; $('file-in').value = ''; addFiles(f, 'bin'); };
    $('b-text').onclick = A.addText;
    $('b-shot').onclick = () => VE.Export.screenshot().catch(e => VE.toast('No screenshot: ' + e.message));
    $('b-export').onclick = VE.Export.open;
    $('b-play').onclick = VE.Player.toggle;
    $('b-start').onclick = () => { VE.seek(0); VE.Timeline.reveal(0); };
    $('b-end').onclick = () => { VE.seek(VE.length()); VE.Timeline.reveal(VE.time); };
    $('b-split').onclick = A.split;
    $('b-dup').onclick = A.duplicate;
    $('b-del').onclick = A.remove;

    VE.on('project', () => {
      scheduleSave(); renderBin();
      $('p-title').textContent = VE.P.title; document.title = VE.P.title + " — Walby's Basic Video Editor";
      $('t-len').textContent = VE.fmt(VE.length());
      $('b-undo').disabled = !VE.history.undo.length; $('b-redo').disabled = !VE.history.redo.length;
    });
    VE.on('select', () => { const c = VE.selected(); ['b-split', 'b-dup', 'b-del'].forEach(id => { $(id).disabled = id !== 'b-split' && !c; }); });
    VE.on('time', () => { $('t-now').textContent = VE.fmt(VE.time); });
    VE.on('playstate', () => { $('b-play').textContent = VE.Player.playing ? '⏸' : '▶'; });
    window.addEventListener('beforeunload', () => { if (VE.P) A.saveNow(); });

    start();
  }
  async function start() {
    if (!St.supported) return home();
    const root = await St.root();
    if (root && await St.allowed(root, false)) {
      const last = await St.get('last');
      if (last) { try { return await openProject(await root.getDirectoryHandle(last)); } catch (e) { /* gone */ } }
    }
    home();
  }
  A.home = home; A.open = openProject;
  boot();
})();

/* ==========================================================================
   Sound Booth-ACCF Edition — app.js
   Starts everything up, keeps the buttons honest, draws the meters.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB;
  const P = VB.Project, E = VB.Engine, T = VB.Timeline, Store = VB.Store;
  const $ = id => document.getElementById(id);
  const db = x => 20 * Math.log10(Math.max(x, 1e-6));
  const A = VB.App = {};

  /* -------- Messages -------- */
  VB.say = function (text, kind) {
    const box = $('toasts');
    const t = document.createElement('div');
    t.className = 'toast' + (kind ? ' ' + kind : '');
    t.textContent = text;
    box.append(t);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, kind === 'warn' ? 7000 : 3200);
  };

  function cover(text) {
    $('cover').hidden = !text;
    if (text) $('cover-text').textContent = text;
  }
  A.cover = cover;

  /* -------- Saving -------- */
  let saveTimer = 0;
  A.saveSoon = function () {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => Store.putProject(P.serialize()), 300);
  };

  /* -------- Time -------- */
  function fmtClock(samples) {
    const sec = samples / E.rate();
    const m = Math.floor(sec / 60);
    const s = sec - m * 60;
    return m + ':' + (s < 10 ? '0' : '') + s.toFixed(3);
  }

  /* -------- Volume: slider positions are in decibels -------- */
  const SLIDE_MIN_DB = -48, SLIDE_MAX_DB = 6;
  const UNITY = 100 * (0 - SLIDE_MIN_DB) / (SLIDE_MAX_DB - SLIDE_MIN_DB);
  function sliderToGain(v) {
    if (v <= 0) return 0;
    if (Math.abs(v - UNITY) < 1.5) return 1;
    return Math.pow(10, (SLIDE_MIN_DB + (v / 100) * (SLIDE_MAX_DB - SLIDE_MIN_DB)) / 20);
  }
  function gainToSlider(g) {
    if (g <= 0) return 0;
    return Math.max(0, Math.min(100, 100 * (20 * Math.log10(g) - SLIDE_MIN_DB) / (SLIDE_MAX_DB - SLIDE_MIN_DB)));
  }
  function gainText(g) {
    if (g <= 0) return 'Off';
    const d = 20 * Math.log10(g);
    const r = Math.abs(d) < 0.05 ? 0 : d;
    return (r > 0 ? '+' : r < 0 ? '−' : '') + Math.abs(r).toFixed(1) + ' dB';
  }

  /* -------- Track headers -------- */
  const ICON_FILE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/></svg>';
  const ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';

  function renderHeads() {
    const box = $('heads-inner');
    const target = P.recordTarget();
    box.innerHTML = '';
    for (const t of P.data.tracks) {
      const isFile = P.isFileTrack(t.id);
      const div = document.createElement('div');
      div.className = 'head' + (t.id === P.data.currentId ? ' current' : '') + (t.muted ? ' muted' : '');
      div.dataset.id = t.id;

      const top = document.createElement('div');
      top.className = 'head-top';

      if (isFile) {
        const icon = document.createElement('span');
        icon.className = 'head-kind';
        icon.title = 'An added audio file';
        icon.innerHTML = ICON_FILE;
        top.append(icon);
      } else {
        const arm = document.createElement('button');
        arm.type = 'button';
        arm.className = 'arm' + (target && target.id === t.id ? ' on' : '');
        arm.title = 'Record onto this track';
        arm.setAttribute('aria-label', 'Record onto ' + t.name);
        arm.setAttribute('aria-pressed', String(!!target && target.id === t.id));
        arm.addEventListener('click', () => P.chooseTrack(t.id));
        top.append(arm);
      }

      const name = document.createElement('input');
      name.className = 'tname';
      name.value = t.name;
      name.title = t.name;   // song names run longer than the box
      name.maxLength = 40;
      name.spellcheck = false;
      name.setAttribute('aria-label', 'Track name');
      name.addEventListener('change', () => {
        const v = name.value.trim();
        if (!v) { name.value = t.name; return; }
        P.edit('renaming a track', () => { t.name = v; });
      });
      name.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === 'Escape') name.blur();
      });
      top.append(name);

      const mute = document.createElement('button');
      mute.type = 'button';
      mute.className = 'mini mute-btn' + (t.muted ? ' on' : '');
      mute.textContent = 'M';
      mute.title = 'Mute this track';
      mute.setAttribute('aria-label', 'Mute ' + t.name);
      mute.setAttribute('aria-pressed', String(!!t.muted));
      mute.addEventListener('click', () => {
        P.edit(t.muted ? 'unmuting a track' : 'muting a track', () => { t.muted = !t.muted; });
      });
      top.append(mute);

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'mini del-btn';
      del.innerHTML = ICON_X;
      del.title = 'Delete this track';
      del.setAttribute('aria-label', 'Delete ' + t.name);
      del.addEventListener('click', () => {
        if (E.state === 'recording') return;
        const had = P.clipsOn(t.id).length;
        P.removeTrack(t.id);
        if (had) VB.say('Track deleted. Undo brings it back.');
      });
      top.append(del);

      const low = document.createElement('div');
      low.className = 'head-low';
      const vol = document.createElement('input');
      vol.type = 'range';
      vol.className = 'vol';
      vol.min = 0; vol.max = 100; vol.step = 0.5;
      vol.value = gainToSlider(t.volume);
      vol.title = 'Volume of this track. Double-click for 0 dB.';
      vol.setAttribute('aria-label', 'Volume of ' + t.name);
      const out = document.createElement('output');
      out.className = 'vol-out';
      out.textContent = gainText(t.volume);
      const start = t.volume;
      vol.addEventListener('input', () => {
        t.volume = sliderToGain(+vol.value);
        out.textContent = gainText(t.volume);
        E.syncGains();
      });
      vol.addEventListener('change', () => {
        const now = t.volume;
        t.volume = start;
        P.edit('changing a volume', () => { t.volume = now; });
      });
      vol.addEventListener('dblclick', () => {
        t.volume = start;
        P.edit('changing a volume', () => { t.volume = 1; });
      });
      low.append(vol, out);

      // this edition's own button: an ACCF song, onto this track
      const accf = document.createElement('button');
      accf.type = 'button';
      accf.className = 'btn small accf-btn';
      accf.innerHTML = ICON_FILE + '<span>Load ACCF Song</span>';
      accf.title = 'Put one of the ACCF songs on this track';
      accf.setAttribute('aria-label', 'Load an ACCF Song onto ' + t.name);
      accf.addEventListener('click', () => VB.Accf.open(t.id));

      div.addEventListener('pointerdown', () => {
        if (P.data.currentId !== t.id && E.state !== 'recording') {
          P.data.currentId = t.id;
          if (!isFile) P.data.armedId = t.id;
          // not a re-render here: the press may be on the slider or name beneath it
          for (const h of box.children) h.classList.toggle('current', h.dataset.id === t.id);
          for (const h of box.querySelectorAll('.arm')) {
            const on = h.closest('.head').dataset.id === (P.recordTarget() || {}).id;
            h.classList.toggle('on', on);
            h.setAttribute('aria-pressed', String(on));
          }
          T.draw();
          A.refreshTools();
          A.saveSoon();
        }
      });

      div.append(top, accf, low);
      box.append(div);
    }
  }

  /* -------- Buttons -------- */
  A.refreshTools = function () {
    const rec = E.state === 'recording';
    const set = (id, on) => { $(id).disabled = rec || !on; };
    set('t-split', P.canSplit());
    set('t-dup', P.canDuplicate());
    set('t-copy', P.canCopy());
    set('t-paste', P.canPaste());
    set('t-mute', P.canMute());
    set('t-del', P.canDelete());
    set('t-undo', P.undoStack.length > 0);
    set('t-redo', P.redoStack.length > 0);
    $('t-mute').classList.toggle('active', P.canMute() && P.selectionMuted());
    $('tool-move').classList.toggle('active', T.tool === 'move');
    $('tool-part').classList.toggle('active', T.tool === 'part');
    $('tool-move').disabled = rec;
    $('tool-part').disabled = rec;
    $('add-track').disabled = rec;
    $('add-file').disabled = rec;
    $('export').disabled = rec || !P.data.clips.length;
    $('mic-check').disabled = rec;
    $('delete-all').disabled = rec;
    $('to-start').disabled = rec;
    $('play').disabled = rec || !P.data.clips.length;
  };

  function refreshTransport() {
    const rec = E.state === 'recording', playing = E.state === 'playing';
    document.body.classList.toggle('recording', rec);
    document.body.classList.toggle('playing', playing);
    $('rec-word').textContent = rec ? 'Stop' : 'Record';
    $('play').setAttribute('aria-label', playing ? 'Stop' : 'Play');
    $('mic-name').textContent = E.mic ? E.mic.label.replace(/^Default\s*-\s*/i, '') : 'Microphone off';
    $('level').classList.toggle('off', !E.mic);
    $('foot-rate').textContent = P.data.rate || E.ctx ? 'Recording at ' + (E.rate() / 1000).toLocaleString() + ' kHz' : '';
    const showEmpty = !P.data.clips.length && !E.take;
    $('empty').hidden = !showEmpty;
    $('mic-check').classList.toggle('nudge', !VB.MicCheck.checkedBefore() && !E.mic);
  }

  A.refreshAll = function () {
    renderHeads();
    A.refreshTools();
    refreshTransport();
    T.layout();
  };

  /* After an edit made from the Select part tool, go back to moving things. */
  function doneWithPart() {
    if (T.tool === 'part') { T.tool = 'move'; A.refreshTools(); }
  }

  /* -------- Actions -------- */
  const act = {
    split() { if (P.split()) doneWithPart(); },
    duplicate() { if (P.duplicate()) doneWithPart(); },
    copy() {
      if (P.copy()) {
        const secs = P.clipboard.span / E.rate();
        VB.say('Copied ' + secs.toFixed(secs < 10 ? 1 : 0) + ' s. Click where it should go, then Paste.');
        doneWithPart();
      }
    },
    paste() { if (P.paste()) T.reveal(P.data.playhead); },
    cut() { if (P.copy()) { P.remove(); doneWithPart(); } },
    mute() { if (P.toggleMute()) doneWithPart(); },
    del() { if (P.remove()) doneWithPart(); },
    undo() { const l = P.undo(); if (l) VB.say('Undid ' + l + '.'); },
    redo() { const l = P.redo(); if (l) VB.say('Redid ' + l + '.'); }
  };

  async function pressRecord() {
    if (E.state === 'recording') { await E.stop(); return; }
    if (!VB.MicCheck.checkedBefore()) {
      VB.say('First, a quick mic check. Then press Record.');
      VB.MicCheck.open();
      return;
    }
    $('rec').disabled = true;
    if (!E.mic) VB.say('If your browser asks, allow the microphone.');
    try {
      await E.startRecord();
      warnIfSpeakers();
    } catch (err) {
      console.error(err);
      VB.say(E.micErrorText(err), 'warn');
    }
    $('rec').disabled = false;
  }

  /* The accompaniment coming out of speakers ends up in the take. */
  async function warnIfSpeakers() {
    const take = E.take;
    if (!take) return;
    const others = P.data.tracks.some(t => t.id !== take.trackId && !t.muted && P.clipsOn(t.id).length);
    if (!others) return;
    const label = await E.outputLabel();
    if (/speaker|built-?in output/i.test(label)) {
      VB.say('Your sound is playing out of your speakers, so the microphone will pick up the music. Headphones keep your vocal clean.', 'warn');
    }
  }

  async function pressPlay() {
    if (E.state === 'playing') await E.stop();
    else if (E.state === 'stopped') await E.play();
    T.placeHead();
  }

  /* There must always be somewhere to sing, and the armed track must be one of them. */
  A.keepRoomToSing = function (reuse) {
    if (!P.data.tracks.some(x => !P.isFileTrack(x.id))) {
      const v = { id: VB.uid('tr'), name: reuse || 'Voice ' + P.data.voiceNo++, volume: 1, muted: false };
      P.data.tracks.push(v);
      P.data.armedId = v.id;
      P.data.currentId = v.id;
    } else if (P.isFileTrack(P.data.armedId)) {
      const v = P.recordTarget();
      P.data.armedId = v.id;
      P.data.currentId = v.id;
    }
  };

  async function addFiles(files) {
    const list = [...files].filter(f => f && (/^audio\//.test(f.type) || /\.(mp3|wav|m4a|aac|ogg|flac|aiff?)$/i.test(f.name)));
    if (!list.length) { VB.say('That isn’t an audio file.', 'warn'); return; }
    if (E.state !== 'stopped') await E.stop();
    for (const file of list) {
      cover('Loading ' + file.name + '…');
      try {
        const src = await E.importFile(file);
        P.edit('adding a file', () => {
          // onto an empty track: the one in use if it is empty, else the first empty one, else a new one
          let t = P.track(P.data.currentId);
          if (!t || P.clipsOn(t.id).length) t = P.data.tracks.find(x => !P.clipsOn(x.id).length) || null;
          const reuse = t && /^Voice \d+$/.test(t.name) ? t.name : null;
          if (!t) {
            t = { id: VB.uid('tr'), name: src.name, volume: 1, muted: false };
            P.data.tracks.push(t);
          }
          t.name = src.name;
          P.data.clips.push({
            id: VB.uid('c'), trackId: t.id, sourceId: src.id, name: src.name, muted: false,
            pos: 0, offset: 0, len: src.length
          });
          A.keepRoomToSing(reuse);
        });
        T.userZoomed = false;
      } catch (err) {
        console.error(err);
        VB.say('“' + file.name + '” couldn’t be read as audio.', 'warn');
      }
    }
    cover(null);
  }

  async function deleteAll() {
    if (!confirm('Delete all? This deletes every track and recording from this browser, and it can’t be undone. Files you already exported are safe.')) return;
    if (E.state !== 'stopped') await E.stop();
    await Store.clearAll();
    P.reset();
    T.userZoomed = false;
    A.refreshAll();
    VB.say('Everything was deleted from this browser.');
  }

  /* -------- Keys -------- */
  function onKey(e) {
    const el = e.target;
    if (document.querySelector('dialog[open]')) return;
    if (el && (el.tagName === 'INPUT' && el.type !== 'range' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA')) return;
    // a button reached with Tab keeps its own Space and Enter; a slider keeps its arrows
    if (el && el.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;
    if (el && el.type === 'range' && e.key.startsWith('Arrow')) return;
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    const rec = E.state === 'recording';
    const stopIt = fn => { e.preventDefault(); fn(); };

    if (e.key === ' ') {
      stopIt(() => { if (rec) E.stop(); else pressPlay(); });
      return;
    }
    if (rec) {
      if (key === 'r' && !mod) stopIt(() => E.stop());
      return;
    }
    if (mod && key === 'z') return stopIt(e.shiftKey ? act.redo : act.undo);
    if (mod && key === 'y') return stopIt(act.redo);
    if (mod && key === 'c') return stopIt(act.copy);
    if (mod && key === 'x') return stopIt(act.cut);
    if (mod && key === 'v') return stopIt(act.paste);
    if (mod && key === 'd') return stopIt(act.duplicate);
    if (mod) return;
    if (key === 'r') return stopIt(pressRecord);
    if (key === 's') return stopIt(act.split);
    if (key === 'd') return stopIt(act.duplicate);
    if (key === 'm') return stopIt(act.mute);
    if (e.key === 'Delete' || e.key === 'Backspace') return stopIt(act.del);
    if (e.key === 'Home' || e.key === 'Enter') return stopIt(toStart);
    if (e.key === 'Escape') {
      return stopIt(() => {
        P.sel.range = null;
        P.sel.clipId = null;
        T.tool = 'move';
        P.emit('select');
      });
    }
    if (key === '=' || key === '+') return stopIt(() => T.zoomBy(1.4));
    if (key === '-') return stopIt(() => T.zoomBy(1 / 1.4));
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && P.selectedClip()) {
      const step = Math.round(E.rate() * (e.shiftKey ? 0.1 : 0.01));
      return stopIt(() => P.nudge(e.key === 'ArrowLeft' ? -step : step));
    }
  }

  function toStart() {
    E.seek(0);
    T.placeHead();
    A.refreshTools();
    A.saveSoon();
    $('tl-scroll').scrollLeft = 0;
  }

  /* -------- Meters -------- */
  const meters = [];
  let shownPeak = 0, holdPeak = 0, holdAt = 0, lastFrame = 0, lastWord = '';
  function dbToFrac(d) { return Math.max(0, Math.min(1, (d + 60) / 60)); }

  function drawMeters(now) {
    const dt = Math.min(100, now - lastFrame) / 1000;
    lastFrame = now;
    const L = E.level;
    // the worklet raises L.peak; here it falls at 26 dB a second
    const falling = shownPeak * Math.pow(10, -26 * dt / 20);
    shownPeak = Math.max(L.peak, falling);
    L.peak = 0;
    if (shownPeak >= holdPeak || now - holdAt > 1600) {
      holdPeak = shownPeak;
      holdAt = now;
    }
    const frac = E.mic ? dbToFrac(db(shownPeak)) : 0;
    const hold = E.mic ? dbToFrac(db(holdPeak)) : 0;
    for (const m of meters) {
      m.cover.style.transform = 'scaleX(' + (1 - frac).toFixed(4) + ')';
      m.hold.style.left = (hold * 100).toFixed(2) + '%';
      m.hold.style.opacity = hold > 0.02 ? '1' : '0';
    }
    const clip = $('clip-light');
    clip.classList.toggle('lit', !!L.clipped);

    let word = '';
    if (E.mic) {
      const d = db(holdPeak);
      word = L.clipped ? 'Too loud' : d > -6 ? 'Loud' : d >= -18 ? 'Good' : d >= -30 ? 'A little quiet' : d >= -50 ? 'Quiet' : '';
    }
    if (word !== lastWord) {
      lastWord = word;
      const w = $('level-word');
      w.textContent = word;
      w.dataset.kind = word === 'Good' ? 'good' : word === 'Too loud' ? 'bad' : word === 'Loud' ? 'warn' : '';
    }
  }

  /* -------- The frame -------- */
  let lastClock = '';
  function frame(now) {
    E.tick();
    drawMeters(now);
    if (E.state !== 'stopped') {
      T.placeHead();
      T.follow();
      if (E.state === 'recording') {
        T.sizeContent();
        T.draw();
      }
    }
    const text = fmtClock(E.state === 'stopped' ? P.data.playhead : E.position());
    if (text !== lastClock) { $('clock').textContent = text; lastClock = text; }
    requestAnimationFrame(frame);
  }

  /* -------- Explaining notes fold into a circled i -------- */
  function foldNotes() {
    for (const note of document.querySelectorAll('.fold-note')) {
      const key = 'sound_booth_accf_fold_' + note.dataset.key;
      const body = document.createElement('span');
      body.className = 'fold-body';
      while (note.firstChild) body.append(note.firstChild);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fold-i';
      btn.textContent = 'i';
      btn.setAttribute('aria-label', 'Show or hide this note');
      note.append(body, btn);
      const apply = folded => {
        note.classList.toggle('folded', folded);
        btn.setAttribute('aria-expanded', String(!folded));
        btn.title = folded ? body.textContent.trim() : '';
      };
      let folded = false;
      try { folded = localStorage.getItem(key) === '1'; } catch (e) {}
      apply(folded);
      btn.addEventListener('click', () => {
        folded = !note.classList.contains('folded');
        apply(folded);
        try { localStorage.setItem(key, folded ? '1' : '0'); } catch (e) {}
      });
    }
  }

  /* -------- Start -------- */
  async function loadSaved() {
    const json = await Store.getProject();
    if (json) P.load(json);
    const metas = await Store.allMeta();
    const used = new Set(P.data.clips.map(c => c.sourceId));

    let recovered = 0;
    for (const m of metas) {
      if (m.state === 'recording') {
        if (await E.recover(m)) recovered++;
        continue;
      }
      if (!used.has(m.id)) { await Store.dropSource(m.id); continue; }
      const channels = [];
      if (m.kind === 'take') {
        channels.push(await Store.readChannel(m.id, m.ch || 0));
      } else {
        for (let c = 0; c < (m.channels || 1); c++) channels.push(await Store.readChannel(m.id, c));
      }
      const len = channels[0] ? channels[0].length : 0;
      if (!len) continue;
      const buffer = new AudioBuffer({ numberOfChannels: channels.length, length: len, sampleRate: m.rate });
      channels.forEach((d, c) => buffer.copyToChannel(d, c));
      P.sources.set(m.id, {
        id: m.id, kind: m.kind, name: m.name, rate: m.rate, channels: channels.length, length: len, buffer, peaks: VB.peaksOf(buffer)
      });
    }
    // a clip whose audio is gone cannot be shown or played
    P.data.clips = P.data.clips.filter(c => P.sources.has(c.sourceId));
    if (recovered) {
      VB.say('Your last take was cut off, but it was saved. It’s back on its track.', 'warn');
      A.saveSoon();
    }
  }

  function oneTabOnly() {
    if (!navigator.locks) return Promise.resolve(true);
    return new Promise(resolve => {
      navigator.locks.request('sound-booth-accf-one-tab', { ifAvailable: true }, lock => {
        resolve(!!lock);
        return lock ? new Promise(() => {}) : undefined;   // held for as long as this tab lives
      }).catch(() => resolve(true));
    });
  }

  function wire() {
    $('play').addEventListener('click', pressPlay);
    $('rec').addEventListener('click', pressRecord);
    $('to-start').addEventListener('click', toStart);
    // the name at the top: what this app is, and who made it
    $('about-open').addEventListener('click', () => $('dlg-about').showModal());
    $('ab-close').addEventListener('click', () => $('dlg-about').close());
    $('ab-done').addEventListener('click', () => $('dlg-about').close());
    $('mic-check').addEventListener('click', () => VB.MicCheck.open());
    $('empty-mic').addEventListener('click', () => VB.MicCheck.open());
    $('export').addEventListener('click', () => VB.Export.open());
    $('clip-light').addEventListener('click', () => { E.level.clipped = false; });
    $('t-split').addEventListener('click', act.split);
    $('t-dup').addEventListener('click', act.duplicate);
    $('t-copy').addEventListener('click', act.copy);
    $('t-paste').addEventListener('click', act.paste);
    $('t-mute').addEventListener('click', act.mute);
    $('t-del').addEventListener('click', act.del);
    $('t-undo').addEventListener('click', act.undo);
    $('t-redo').addEventListener('click', act.redo);
    $('tool-move').addEventListener('click', () => { T.tool = 'move'; A.refreshTools(); });
    $('tool-part').addEventListener('click', () => { T.tool = 'part'; A.refreshTools(); });
    $('z-in').addEventListener('click', () => T.zoomBy(1.5));
    $('z-out').addEventListener('click', () => T.zoomBy(1 / 1.5));
    $('z-fit').addEventListener('click', () => T.fit());
    $('add-track').addEventListener('click', () => { P.addTrack(); });
    const input = $('file-input');
    const pick = () => input.click();
    $('add-file').addEventListener('click', pick);
    $('empty-file').addEventListener('click', pick);
    input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
    $('delete-all').addEventListener('click', deleteAll);
    document.addEventListener('keydown', onKey);
    // A clicked button must not keep the focus, or Space would press it again.
    document.addEventListener('click', e => {
      const b = e.target.closest && e.target.closest('button');
      if (b && e.detail > 0 && !b.closest('dialog')) b.blur();
    });

    // dropping a file anywhere on the page
    const veil = $('drop-veil');
    let depth = 0;
    const hasFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes('Files');
    window.addEventListener('dragenter', e => { if (hasFiles(e)) { depth++; veil.hidden = false; } });
    window.addEventListener('dragleave', e => { if (hasFiles(e) && --depth <= 0) { depth = 0; veil.hidden = true; } });
    window.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
    window.addEventListener('drop', e => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      veil.hidden = true;
      if (E.state !== 'recording') addFiles(e.dataTransfer.files);
    });

    window.addEventListener('beforeunload', e => {
      Store.putProject(P.serialize());
      if (E.state === 'recording') { e.preventDefault(); e.returnValue = ''; }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') Store.putProject(P.serialize());
    });

    for (const m of document.querySelectorAll('.meter')) {
      meters.push({ cover: m.querySelector('[data-meter="cover"]'), hold: m.querySelector('[data-meter="hold"]') });
    }
    foldNotes();
  }

  /* A phone or tablet: its own words, before the notes are folded. */
  function deviceWords() {
    const dev = VB.device;
    if (!dev.mobile) return;
    document.documentElement.classList.add('is-mobile');
    for (const w of document.querySelectorAll('.device-word')) w.textContent = dev.kind;
    $('mc-level-tip').textContent = 'This app can’t change your microphone’s level, and a ' + dev.kind +
      ' has no setting for it, so if it’s too loud or too quiet, move closer or further away. Use wired headphones:' +
      ' Bluetooth ones (AirPods and the like) drop to phone-call quality while the microphone is on.';
    if (dev.kind === 'phone') for (const h of document.querySelectorAll('.drop-hint')) h.hidden = true;
  }

  async function boot() {
    deviceWords();
    wire();
    VB.Export.mount();
    VB.MicCheck.mount();
    VB.Accf.mount();
    T.mount();

    P.on(what => {
      if (what === 'edit') {
        A.saveSoon();
        E.syncGains();
        E.refresh();
        renderHeads();
        if (!T.userZoomed && T.overflows()) T.fit(true);
        T.sizeContent();
      } else {
        A.saveSoon();
        renderHeads();
      }
      A.refreshTools();
      refreshTransport();
      T.draw();
      T.placeHead();
    });
    E.onstate = () => {
      refreshTransport();
      A.refreshTools();
      if (E.state === 'stopped') T.reveal(P.data.playhead);
      T.draw();
      T.placeHead();
    };
    Store.onfail = () => {
      VB.say('This ' + VB.device.kind + ' ran out of room to save, so export soon: your work is only safe while this tab stays open.', 'warn');
      $('foot-status').textContent = 'Not saving: out of room on this ' + VB.device.kind + '. Export soon.';
    };

    if (!(await oneTabOnly())) {
      cover('Sound Booth-ACCF Edition is already open in another tab. Use that one, or close it and reload this page.');
      return;
    }

    cover('Loading your tracks…');
    const opened = await Store.open();
    if (!opened) {
      $('foot-status').textContent = 'This browser won’t save between visits (private mode?). Export before you close the tab.';
    } else {
      try { await loadSaved(); } catch (err) { console.error(err); }
    }
    cover(null);
    A.refreshAll();
    requestAnimationFrame(frame);
    A.ready = true;
  }

  boot();
})();

/* ==========================================================================
   COMPONENT — the Chords window                                 #prog-sheet
   --------------------------------------------------------------------------
   The shell of the Chords window (../Song Writer Chords Redesign/, built in
   six phases, 2026-10-28 → 10-29). It holds the pages; each page is its own
   file:

     CHORD CHART ('chart', the first tab) — components/chord-chart.js +
       song-wave.js: the song's chords along the top, the song as a sound
       wave under them (play, loop, jump), every chord to try on the board.
     TIME LINE ('song', the second tab) — components/chord-timeline.js:
       the song in bars, its sections and their chords, a draft until
       Apply (a dot on the tab while one waits).
     FOCUS ('focus', no tab) — components/chord-focus.js: one chord's notes
       on a grand staff, gone into from a card, More chords…, a double-click
       on the music or on the Time Line — and come back out of.

   Here: the tabs, ↶ ↷ (Focus undoes its notes, the Time Line its draft, the
   chart the song), the keys (app.js hands them over while the window is on
   top), listen-only lessons (D19: the window opens to look and listen —
   one guard on the sheet stops every other control), and the ways in and
   out. Every way out (×, Esc, a tap outside) asks first when Focus has
   changes (Save · Save as New · Don't save) or the Time Line a draft
   (Apply · Not now).

   (Until 2026-10-29 this file was the whole window: the progressions'
   Chord Charts page, its chord editor #pchord-sheet, Hear it, the old
   Time Line of groups and the old Individual Focus. Progressions retired
   with the redesign — Y1; old songs are still read, track.js.)

   API  SW.progWin.open(_, 'chart' | 'song' | 'focus') · openHere(tick) · close() · isOpen() · onTop() ·
        keyDown(e) · render() · tab() · setTab(t)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const ui = SW.ui;
  const sheet = document.getElementById('prog-sheet');
  if (!sheet || !C || !T) return;
  const body = document.getElementById('pw-body');
  const foot = document.getElementById('pw-foot');
  const songEl = document.getElementById('pw-song');
  const undoBtn = document.getElementById('pw-undo');
  const redoBtn = document.getElementById('pw-redo');
  const tabsEl = document.getElementById('pw-tabs');

  let tab = 'chart';         // 'chart' (Chord Chart) | 'song' (Time Line) | 'focus' (Focus, no tab)
  let drawn = null;          // the tab last drawn
  let renderTimer = 0;

  const isOpen = () => sheet.classList.contains('show');
  function onTop() {
    const open = Array.from(document.querySelectorAll('.sheet-backdrop.show'));
    return !!open.length && open[open.length - 1] === sheet;
  }
  const readOnly = () => !SW.settings.can('chords');

  /* ================= DRAWING ================= */
  function render() {
    clearTimeout(renderTimer);
    if (!isOpen()) return;
    const label = document.getElementById('song-chip-label');
    songEl.textContent = label ? '· ' + label.textContent : '';
    if (tab === 'focus' && (readOnly() || !SW.chordFocus.isOpen())) tab = 'chart';   // listen only: no chord to change
    const bodyTop = drawn === tab ? body.scrollTop : 0;          // the tab drawn again keeps its place
    drawn = tab;
    sheet.classList.toggle('readonly', readOnly());
    body.classList.toggle('chart', tab === 'chart');
    body.classList.toggle('tline', tab === 'song');
    body.classList.toggle('focus', tab === 'focus');
    body.classList.toggle('fx', tab === 'focus');
    if (tab === 'focus') SW.chordFocus.render(body, foot);
    else {
      foot.innerHTML = '';
      if (tab === 'song') SW.chordTimeline.render(body); else SW.chordChart.render(body);
      body.scrollTop = bodyTop;
    }
    syncTabs();
    syncUndo();
  }
  function schedule() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 0);
  }
  function syncTabs() {
    if (!tabsEl) return;
    const wait = !!SW.chordTimeline && SW.chordTimeline.waiting();       // a draft waits on the Time Line (D13)
    tabsEl.querySelectorAll('[data-tab]').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
      if (b.dataset.tab === 'song') b.classList.toggle('pw-dot', wait);
    });
  }
  function setTab(t, asked) {
    if (t === tab) return;
    if (t === 'focus' && (readOnly() || !SW.chordFocus.isOpen())) return;
    // out of Focus with changes: its question first (Save · Save as New · Don't save), then here
    if (tab === 'focus' && SW.chordFocus.dirty()) { SW.chordFocus.leave(() => setTab(t)); return; }
    // out of the Time Line with a draft: Apply · Not now first (D14) — into Focus never asks
    if (tab === 'song' && t !== 'focus' && !asked && SW.chordTimeline.mustAsk()) { SW.chordTimeline.leave(() => setTab(t, true)); return; }
    if (tab === 'focus') SW.chordFocus.closed();
    if (tab === 'song' && t !== 'focus') SW.chordTimeline.closed();
    if (tab === 'chart' && SW.songWave) SW.songWave.stop();      // the wave's music stays with the wave
    tab = t;
    render();
  }
  if (tabsEl) tabsEl.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) setTab(b.dataset.tab); });

  /* ↶ ↷: Focus undoes its notes, the Time Line its draft, the chart the song */
  const undoer = () => (tab === 'focus' ? SW.chordFocus : tab === 'song' ? SW.chordTimeline : SW.history);
  function syncUndo() {
    const H = undoer();
    if (!H) return;
    undoBtn.disabled = !H.canUndo();
    redoBtn.disabled = !H.canRedo();
  }
  undoBtn.addEventListener('click', () => { const H = undoer(); if (H) { H.undo(); syncUndo(); } });
  redoBtn.addEventListener('click', () => { const H = undoer(); if (H) { H.redo(); syncUndo(); } });

  /* the board's blocks relabel in place while a button is held (a re-render would drop the pointer holding it) */
  function relabelBoard(board) {
    if (!board) return;
    board.querySelectorAll('.cblock').forEach(b => {
      const e = C.entry(b.dataset.place);
      if (!e) return;
      const tmp = document.createElement('div');
      tmp.innerHTML = SW.chordStrip.blockHtml(e, 1, { noEdit: true });
      const nb = tmp.firstChild;
      b.innerHTML = nb.innerHTML;
      b.className = nb.className;
      b.style.setProperty('--c', nb.style.getPropertyValue('--c'));
      b.style.setProperty('--ink', nb.style.getPropertyValue('--ink'));
    });
    board.querySelectorAll('.cmod[data-mod]').forEach(t => t.classList.toggle('on', C.heldMods.has(t.dataset.mod)));
    SW.chordStrip.fitLabels(board);
  }

  /* ================= KEYS (app.js hands them over while the window is on top) ================= */
  function keyDown(e) {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return false;
    const k = e.key || '';
    if ((e.metaKey || e.ctrlKey) && !e.altKey && /^[zy]$/i.test(k)) {
      e.preventDefault();
      const H = undoer();
      if (H) { if (k.toLowerCase() === 'y' || e.shiftKey) H.redo(); else H.undo(); }
      syncUndo();
      return true;
    }
    if (tab === 'focus') return SW.chordFocus.keyDown(e);
    if (tab === 'song') return SW.chordTimeline.keyDown(e);
    return SW.chordChart.keyDown(e);
  }

  /* ================= LISTEN ONLY =================
     A lesson with Chords: listen only (lessons.js), or a task that keeps
     the melody: the window opens to look and to listen — play, loop, jump,
     the chords tried on the board — and nothing in it changes the song. */
  const RO_OK = '[data-tab], .sheet-close, .cc-board, .cc-play, .cc-loop, .cc-layer, .cc-wtab';   // the Time Line's ▶ ⟲ are .cc-play .cc-loop too
  function roGuard(e) {
    if (!isOpen() || !readOnly()) return;
    const t = e.target;
    if (!t || !t.closest) return;
    const c = t.closest('button, input, select, textarea, label');
    if (!c || c.matches(RO_OK) || c.closest(RO_OK)) return;
    e.stopPropagation();
    e.preventDefault();
  }
  ['pointerdown', 'click', 'dblclick', 'change', 'input'].forEach(type => sheet.addEventListener(type, roGuard, true));

  /* ================= OPEN / CLOSE =================
     The Chord Chart button under the panel opens it on the Chord Chart (or
     the Time Line, if that was last); a double-click on a chord over the
     music — openHere — on Focus. */
  function open(_, which) {
    if (!SW.settings.can('chords') && !SW.settings.can('chordsListen')) return;
    drawn = null;
    if (which === 'song' || which === 'chart') tab = which;
    else if (tab === 'focus') tab = 'chart';
    if (SW.player && SW.player.playing) SW.player.stop();
    ui.openSheet('prog-sheet');
    render();
  }
  /* a double-click on the music: Focus on that chord (Save closes the window again); on empty time, the Chord Chart */
  function openHere(tick) {
    if (!SW.settings.can('chords')) return;
    if (SW.player && SW.player.playing) SW.player.stop();
    if (isOpen() && tab === 'focus' && SW.chordFocus.dirty()) return;     // a chord in Focus, unsaved: it stays
    const on = SW.chordFocus.atSpot(tick, 'music');
    if (!isOpen()) { drawn = null; ui.openSheet('prog-sheet'); }
    tab = on ? 'focus' : 'chart';
    render();
  }
  function close() { ui.closeSheet('prog-sheet'); }
  ui.guardSheet('prog-sheet', closeNow => {
    if (tab === 'focus' && SW.chordFocus && SW.chordFocus.isOpen() && SW.chordFocus.dirty()) { SW.chordFocus.leave(closeNow); return false; }
    if (tab === 'song' && SW.chordTimeline && SW.chordTimeline.mustAsk()) { SW.chordTimeline.leave(closeNow); return false; }
    return true;
  });

  SW.bus.on('sheet:closed', d => {
    if (d.id !== 'prog-sheet') return;
    C.clearMods();
    if (SW.chordChart) SW.chordChart.closed();
    if (SW.chordFocus) SW.chordFocus.closed();
    if (SW.chordTimeline) SW.chordTimeline.closed();
    if (tab === 'focus') tab = 'chart';
  });
  // the song changed (a step, Undo, another song), or how chords are named: draw it again
  ['score:changed', 'score:loaded', 'chords:changed', 'names:changed', 'meter:changed', 'key:changed', 'layout:changed'].forEach(evt => SW.bus.on(evt, () => { if (isOpen()) schedule(); }));
  SW.bus.on('history:changed', () => { if (isOpen()) syncUndo(); });
  SW.bus.on('mods:changed', () => { relabelBoard(isOpen() ? body.querySelector('.pw-board') : null); });
  SW.bus.on('policy:changed', () => {
    if (!isOpen()) return;
    if (!SW.settings.can('chords') && !SW.settings.can('chordsListen')) close(); else render();   // listen only: the same window, read-only
  });
  window.addEventListener('resize', () => {
    if (!isOpen()) return;
    if (tab === 'song') schedule(); else SW.chordStrip.fitLabels(body.querySelector('.pw-board'));
  });

  SW.progWin = { open, openHere, close, isOpen, onTop, keyDown, render, tab: () => tab, setTab };
})();

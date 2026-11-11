/* ==========================================================================
   Song Writer — app.js
   --------------------------------------------------------------------------
   Start-up order and the controls that belong to no one module: Setup
   (the key, the time signature, the scale, the tempo — the toolbar's tile,
   menu and BPM chip until 2026-10-31), Play and the step pad, Present
   mode, and the keyboard.

   THE KEYBOARD, both hands (1.0's keys are all kept):
     Space          play / stop (both modes)
     ← →            step through the song, each note sounding (1.0; wraps
                    past either end)
     ⇧↑ ⇧↓          pick a note inside a harmony (both modes)
     ↑ ↓            Edit: raise / lower the note (1.0)
     letters and    one of four keyboards, by what is out (js/keymap.js):
     numbers        · chord panel out (keyboard or not): Digital Accordion's
                      two hands — LEFT F D S A G R E Q W and 1–5 play the
                      chords, Z X C V B held change them (in Edit, written
                      over a chord selected in the chord track); RIGHT the melody by
                      scale step, J = do, K L ; U I O P up, N M , . / down,
                      7 8 9 0 - on up; ⇧ / Caps Lock an octave up
                    · locked, the Edit box shut: the same hands swapped,
                      only to play — LEFT the melody, A = do; RIGHT the
                      chords, J H U ; L K P O I and 0 9 8 7 6
                    · keyboard alone: the Virtual Keyboard's Flex — rows
                      Z A Q 1 each climb the scale from do, an octave apart;
                      ⇧ / Caps Lock: Z row down, number row up an octave
                    · neither: Edit, 1.0's solfège keys (A S D F G H J K,
                      Q W E R T Y, Z X C V); Perform, nothing
                    A melody key is the keyboard's key: it rings while held,
                    lights on the keyboard, and in Edit sets the block.
     [ ]            Edit: a shorter / longer note value
     Delete ⌫       Edit: delete the syllable, pressed twice (1.0)
     Esc            closes a sheet, else a popover, else leaves Present,
                    else stops (the family's order)
   No shortcut acts while a word or a field is being typed in, while a
   sheet, popover or the Teacher Library is open, or with ⌘ Ctrl Alt.
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const ui = SW.ui;
  const $ = id => document.getElementById(id);

  /* ==================================================================
     SETUP (2026-10-31, the user): one popover from the toolbar's Setup
     for what the song is set up in — the key, the time signature, the
     scale, the tempo, its swing (2026-11-01), and whether Play starts
     with a count-in (that
     switch is settings.js's, with the other sounds). Each stays open as
     it is changed, so a song is set up in one visit. A lesson that fixes
     the key, the meter or the tempo leaves it as plain text here (you
     have to be able to read them to play the song). The button reads back
     the key, in its colour, and the tempo — C | 100 (2026-11-01, the user;
     a metronome and "Setup" until then); its tooltip reads back the rest.
     ================================================================== */
  const setupBtn = $('setup-btn');
  // the key where the selection is (KEY CHANGES, js/keys.js) — the song's opening key in a song that never changes key
  function keyName() { return M.displayKey(M.spelledKey(SW.keys.here())); }
  function syncSetupBtn() {
    if (!setupBtn) return;
    const sc = SW.chords.scale();
    const name = keyName();
    $('setup-key').textContent = name;
    $('setup-key').style.color = M.keySignatureColors[M.spelledKey(SW.keys.here())] || '';
    $('setup-bpm').textContent = S.bpm;
    setupBtn.setAttribute('aria-label', 'Setup — key of ' + name + ', ' + S.bpm + ' BPM');
    setupBtn.title = 'Setup — ' + name + (sc ? ' ' + sc.name : '') + ' · ' + S.meter + ' · ' + S.bpm + ' BPM' +
      (S.swing && SW.timing.swingPlays() ? ' · swing ' + S.swing + 'ths' : '');
  }

  /* ---------------- the key ---------------- */
  function buildKeyGrid() {
    const grid = $('key-grid');
    const fixed = !SW.settings.can('key');
    grid.classList.toggle('policy-off', fixed);
    $('key-fixed').classList.toggle('policy-off', !fixed);
    $('key-fixed').textContent = fixed ? keyName() + ' — the key stays as written in this lesson' : '';
    grid.innerHTML = '';
    $('setup-key-title').textContent = keyTitle();
    if (fixed) return;
    // named as this scale spells it (D♭ is offered as C♯ in minor); where
    // F♯ and G♭ come out as one name, one chip — the chosen key's if it is one
    const now = SW.keys.here();
    const keys = SW.settings.allowedKeys();
    const byName = {};
    keys.forEach(k => {
      const n = M.spelledKey(k);
      if (!byName[n] || k === now) byName[n] = k;
    });
    keys.filter(k => byName[M.spelledKey(k)] === k).forEach(k => {
      const b = document.createElement('button');
      const shown = M.spelledKey(k);
      b.className = 'key-chip' + (k === now ? ' active' : '');
      b.dataset.key = k;
      b.textContent = M.displayKey(shown);
      b.title = 'Key of ' + M.displayKey(shown);
      b.style.setProperty('--kc', M.keySignatureColors[shown]);
      grid.appendChild(b);
    });
  }
  /* the Key heading says what a chip will do (KEY CHANGES, js/keys.js): where
     Create Key Change would start the new key, or which stretch Transpose moves */
  function keyTitle() {
    const sel = SW.score.getActiveNote();
    const stack = sel ? sel.closest('.harmony-stack') : null;
    const first = document.querySelector('#score .harmony-stack');
    const from = st => (st === first ? 'from the start' : 'from bar ' + SW.keys.startBar(st));
    if (SW.keys.mode() === 'change') return stack ? 'Key — new key ' + from(SW.keys.barStart(stack)) : 'Key — select a note first';
    if (!SW.keys.changes().length) return 'Key';
    if (!stack) return 'Key — the whole song';
    const r = SW.keys.regionOf(stack);
    return 'Key — ' + (r.start ? from(r.start) : 'from the start') + (r.end ? ' to bar ' + (SW.keys.startBar(r.end) - 1) : '');
  }
  $('key-grid').addEventListener('click', e => {
    const b = e.target.closest('.key-chip');
    if (!b || !SW.settings.can('key')) return;
    SW.keys.choose(b.dataset.key);                // Transpose, or Create Key Change (Look) — the pop-up may ask first
    if ($('setup-popover').classList.contains('show')) buildKeyGrid();
  });

  /* ---------------- the scale: the menu under the time signature ----------------
     Digital Accordion's scales (lib/theory.js), grouped as its menu is.
     The scale is the song's (score.scale): it decides the chords the
     panel offers and the notes the keyboard colours; the melody's
     solfège blocks are untouched. */
  const scaleSel = $('scale-select');
  function buildScaleSelect() {
    if (!scaleSel || scaleSel.options.length) return;
    SW.chords.scaleGroups().forEach(g => {
      const og = document.createElement('optgroup');
      og.label = g.label;
      g.scales.forEach(sc => {
        const o = document.createElement('option');
        o.value = sc.id;
        o.textContent = sc.name;
        og.appendChild(o);
      });
      scaleSel.appendChild(og);
    });
  }
  function syncScale() {
    if (!scaleSel) return;
    buildScaleSelect();
    scaleSel.value = SW.chords.scaleId();
    const fixed = !SW.settings.can('scale');
    scaleSel.classList.toggle('fixed', fixed);
    scaleSel.disabled = fixed;
    scaleSel.title = fixed ? 'The scale stays as written in this lesson' : 'Scale — the chords on the panel, and the notes the keyboard colours (' + (SW.chords.scale() || {}).name + ')';
  }
  if (scaleSel) {
    scaleSel.addEventListener('change', () => {
      if (!SW.settings.can('scale')) { syncScale(); return; }
      SW.score.setScale(scaleSel.value);
      scaleSel.blur();                       // hand the keys back to the song
    });
    scaleSel.addEventListener('keydown', e => e.stopPropagation());
    SW.bus.on('scale:changed', syncScale);
    SW.bus.on('score:loaded', syncScale);
    SW.bus.on('policy:changed', syncScale);
  }

  /* ---------------- the time signature ----------------
     The six meters, each as its two numerals, in a row: 2/4 3/4 4/4 and
     the compound 6/8 9/8 12/8 — the beat a dotted quarter of three
     eighths, the number of beats kept by its twin (4/4 ↔ 12/8 …). Until
     2026-10-31 the toolbar's tile: tap the top numeral for 4 → 3 → 2, the
     bottom one for the other family. Nothing written is changed (blocks
     count one beat of the new kind; notes keep their values and the bar
     lines fall where they fall). */
  function syncMeter() {
    const seg = $('meter-seg');
    if (!seg.children.length) {
      SW.meters.LIST.forEach(m => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'seg-btn meter-btn' + (m.compound ? ' compound' : '');
        b.dataset.meter = m.id;
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-label', m.id);
        b.title = m.compound ? m.id + ' — ' + m.beats + ' beats of three eighths' : m.id + ' — ' + m.beats + ' quarter-note beats';
        b.innerHTML = '<span class="ms-top">' + m.top + '</span><span class="ms-bot">' + m.bottom + '</span>';
        seg.appendChild(b);
      });
    }
    seg.querySelectorAll('.meter-btn').forEach(b => {
      const on = b.dataset.meter === S.meter;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', String(on));
    });
    const fixed = !SW.settings.can('meter');
    seg.classList.toggle('policy-off', fixed);
    $('meter-fixed').classList.toggle('policy-off', !fixed);
    $('meter-fixed').textContent = fixed ? S.meter + ' — the time signature stays as written in this lesson' : '';
  }
  $('meter-seg').addEventListener('click', e => {
    const b = e.target.closest('.meter-btn');
    if (!b || b.dataset.meter === S.meter || !SW.settings.can('meter')) return;
    const was = SW.meters.byId(S.meter), to = SW.meters.byId(b.dataset.meter);
    SW.score.setMeter(to.id);
    syncSetup();
    if (was.compound !== to.compound) ui.toast(to.compound ? to.id + ' — each beat is a dotted quarter: three eighths' : to.id + ' — each beat is a quarter note');
  });

  /* ---------------- the tempo: − BPM + and a slider ----------------
     The BPM chip is Rhythm Poetry's typed tempo, built to survive a smart
     board: a tap in the box is also a click on the chip around it, and an
     on-screen keyboard's Done often never leaves the box. So a number is
     taken as soon as it is a real tempo, the box closes on Enter, on blur
     or on a tap anywhere else, and closing only ever happens once. − and +
     move it a beat a minute; the slider (the toolbar's hover gauge until
     2026-10-31) any way at all — inside a lesson's range. */
  const bpmButton = $('bpm-button');
  const bpmValue = $('bpm-value');
  const bpmUnit = bpmButton.querySelector('.bpm-unit');
  function typedTempo(raw) {
    const n = parseInt(raw, 10);
    const r = SW.settings.tempoRange();
    if (isNaN(n) || n < r[0] || n > r[1]) return null;
    return n;
  }
  bpmButton.addEventListener('click', () => {
    if (!SW.settings.can('tempo')) return;
    if (bpmButton.querySelector('.bpm-input')) return;     // already typing
    const before = S.bpm;
    const r = SW.settings.tempoRange();
    const input = document.createElement('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.min = String(r[0]);
    input.max = String(r[1]);
    input.value = before;
    input.className = 'bpm-input';
    input.setAttribute('aria-label', 'Tempo in beats per minute');
    bpmButton.innerHTML = '';
    bpmButton.appendChild(input);
    input.focus();
    input.select();
    let closed = false;
    const close = keep => {
      if (closed) return;
      closed = true;
      document.removeEventListener('pointerdown', onOutside, true);
      const typed = keep ? typedTempo(input.value) : null;
      if (typed !== null) SW.score.setTempo(typed);
      else if (!keep) SW.score.setTempo(before);
      else if (String(input.value).trim() !== '' && String(input.value) !== String(before)) {
        ui.toast('A tempo from ' + r[0] + ' to ' + r[1] + ' BPM');
      }
      bpmButton.innerHTML = '';
      bpmButton.appendChild(bpmValue);
      bpmButton.appendChild(bpmUnit);
      bpmValue.textContent = S.bpm;
    };
    const onOutside = ev => { if (ev.target !== input) close(true); };
    input.addEventListener('input', () => { const t = typedTempo(input.value); if (t !== null) SW.score.setTempo(t); });
    input.addEventListener('blur', () => close(true));
    input.addEventListener('click', ev => ev.stopPropagation());
    input.addEventListener('keydown', ev => {
      ev.stopPropagation();
      if (ev.key === 'Enter' || ev.keyCode === 13) { ev.preventDefault(); close(true); }
      else if (ev.key === 'Escape') { ev.preventDefault(); close(false); }
    });
    // after this tap has finished, so the tap that opened the box cannot close it
    setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
  });
  const bpmSlider = $('bpm-slider');
  const nudgeTempo = d => { if (SW.settings.can('tempo')) SW.score.setTempo(S.bpm + d); };
  $('bpm-down').addEventListener('click', () => nudgeTempo(-1));
  $('bpm-up').addEventListener('click', () => nudgeTempo(1));
  bpmSlider.addEventListener('input', () => { if (SW.settings.can('tempo')) SW.score.setTempo(parseInt(bpmSlider.value, 10)); });
  bpmSlider.addEventListener('keydown', e => e.stopPropagation());   // its arrows move it, not the song
  function syncTempo() {
    const fixed = !SW.settings.can('tempo');
    const r = SW.settings.tempoRange();
    bpmButton.classList.toggle('fixed', fixed);
    bpmButton.title = fixed ? 'The tempo stays as written in this lesson' : 'Tap to type a tempo';
    if (!bpmButton.querySelector('.bpm-input')) bpmValue.textContent = S.bpm;
    showHide($('bpm-down'), !fixed);
    showHide($('bpm-up'), !fixed);
    showHide($('tempo-slide'), !fixed);
    $('bpm-down').disabled = S.bpm <= r[0];
    $('bpm-up').disabled = S.bpm >= r[1];
    bpmSlider.min = r[0];
    bpmSlider.max = r[1];
    bpmSlider.value = S.bpm;
    bpmSlider.style.setProperty('--fill', ((S.bpm - r[0]) / Math.max(1, r[1] - r[0]) * 100).toFixed(1) + '%');
  }
  function showHide(el, on) { if (el) el.classList.toggle('policy-off', !on); }

  /* ---------------- swing: None · 8th · 16th ----------------
     How the song is played, never how it is written (timing.js SWING);
     saved with the song, as the tempo is, and fixed with it by a lesson
     that fixes the tempo. In compound time the eighths already go in
     threes, so 8th is greyed there (the song keeps it for 2/4–4/4). */
  const SWING_NAMES = { '': 'None', '8': '8th', '16': '16th' };
  function syncSwing() {
    const fixed = !SW.settings.can('tempo');
    const compound = SW.meters.byId(S.meter).compound;
    const seg = $('swing-seg');
    seg.querySelectorAll('.seg-btn').forEach(b => {
      const on = b.dataset.swing === S.swing;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', String(on));
      b.disabled = compound && b.dataset.swing === '8';
    });
    seg.title = compound ? S.meter + ' already swings its eighths in threes — 8th swing plays straight here' : '';
    showHide(seg, !fixed);
    showHide($('swing-fixed'), fixed);
    $('swing-fixed').textContent = fixed ? 'Swing: ' + SWING_NAMES[S.swing] + ' — as written in this lesson' : '';
  }
  $('swing-seg').addEventListener('click', e => {
    const b = e.target.closest('.seg-btn');
    if (!b || b.disabled || !SW.settings.can('tempo')) return;
    SW.score.setSwing(b.dataset.swing);
  });

  function syncSetup() {
    if ($('setup-popover').classList.contains('show')) buildKeyGrid();
    syncMeter();
    syncScale();
    syncTempo();
    syncSwing();
    syncSetupBtn();
  }
  ui.registerPopover('setup-btn', 'setup-popover', () => { buildKeyGrid(); syncSetup(); SW.settings.syncSoundControls(); });
  ['meter:changed', 'swing:changed', 'score:loaded', 'policy:changed', 'key:changed', 'keyhere:changed', 'selection', 'scale:changed', 'layout:changed', 'view:changed']
    .forEach(evt => SW.bus.on(evt, syncSetup));

  /* ---------------- Play, the step pad ---------------- */
  const playBtn = $('playBtn');
  const presentPlay = $('present-play-btn');
  playBtn.addEventListener('click', () => SW.player.toggle());
  presentPlay.addEventListener('click', e => { e.stopPropagation(); SW.player.toggle(); });
  SW.bus.on('play:changed', d => {
    [playBtn, presentPlay].forEach(b => {
      b.classList.toggle('is-playing', d.playing);
      b.setAttribute('aria-pressed', String(d.playing));
      b.setAttribute('aria-label', d.playing ? 'Stop' : 'Play');
    });
    playBtn.title = d.playing ? 'Stop (Space)' : 'Play from the selected note (Space)';
    presentPlay.title = d.playing ? 'Stop (Space)' : 'Play (Space)';
  });
  $('leftArrow').addEventListener('click', () => SW.score.navigateLeft());
  $('rightArrow').addEventListener('click', () => SW.score.navigateRight());
  $('present-left').addEventListener('click', e => { e.stopPropagation(); SW.score.navigateLeft(); });
  $('present-right').addEventListener('click', e => { e.stopPropagation(); SW.score.navigateRight(); });

  /* ---------------- Present mode ----------------
     The family's: true full screen (never from inside a frame — the page
     around it owns the screen), the bars and the edit layer gone, and a
     floating pill — Play · ‹ › · Exit (Song Writer keeps its step arrows:
     stepping in time is how a song is performed here). Leaving full
     screen with the browser's own Esc leaves Present too. */
  function presentFullScreen(on) {
    if (document.documentElement.classList.contains('in-iframe')) return;
    const root = document.documentElement;
    const current = document.fullscreenElement || document.webkitFullscreenElement;
    try {
      if (on && !current) {
        const go = root.requestFullscreen || root.webkitRequestFullscreen;
        const p = go && go.call(root);
        if (p && p.catch) p.catch(() => {});
      } else if (!on && current) {
        const leave = document.exitFullscreen || document.webkitExitFullscreen;
        const p = leave && leave.call(document);
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) {}
  }
  function setPresent(on) {
    on = !!on;
    if (on && SW.lessons && !SW.lessons.shellAllows('present')) return;
    if (S.present === on) return;
    S.present = on;
    if (on) {
      ui.closeAllPopovers();
      document.querySelectorAll('.sheet-backdrop.show').forEach(sh => ui.closeSheet(sh.id));
    }
    document.body.classList.toggle('present-mode', on);
    presentFullScreen(on);
    SW.bus.emit('present:changed', { present: on });
    // the stage changed size: re-seat the keyboard and redraw the staff
    setTimeout(() => { SW.settings.applyView(); }, 60);
  }
  $('present-btn').addEventListener('click', () => setPresent(true));
  $('present-exit-btn').addEventListener('click', e => { e.stopPropagation(); setPresent(false); });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(type => {
    document.addEventListener(type, () => {
      const current = document.fullscreenElement || document.webkitFullscreenElement;
      if (!current && S.present) setPresent(false);
    });
  });
  // Present is never for editing: the Edit box and the editing layer go while it is up
  // (edit-box.js sync, on present:changed), and anything that turns editing on ends it
  SW.bus.on('mode:changed', d => { if (d.editing && S.present) setPresent(false); });

  /* ---------------- About and How this works ---------------- */
  $('about-link').addEventListener('click', () => { ui.closeSheet('help-sheet'); ui.openSheet('aboutModal'); });
  $('about-help-link').addEventListener('click', () => { ui.closeSheet('aboutModal'); ui.openSheet('help-sheet'); });

  /* ---------------- the keyboard ---------------- */
  function shelfOpen() { return !!document.querySelector('.evm-shelf.show'); }
  function isPopupOpen() {
    return ui.isSheetOpen() || ui.isPopoverOpen() || shelfOpen();
  }
  function topSheet() {
    const open = Array.from(document.querySelectorAll('.sheet-backdrop.show'));
    return open.length ? open[open.length - 1] : null;
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (shelfOpen()) return;                            // the shelf steps back on its own
      const sheet = topSheet();
      if (sheet) { ui.closeSheet(sheet.id); event.preventDefault(); return; }
      if (ui.isPopoverOpen()) { ui.closeAllPopovers(); return; }
      if (S.present) { setPresent(false); return; }
      if (S.playing) SW.player.stop();
      return;
    }
    // the Chord Progression window, on top: chord keys build the progression,
    // ← → walk its chords, Space hears it, ⌘Z undoes (progression-window.js)
    if (SW.progWin && SW.progWin.onTop() && SW.progWin.keyDown(event)) return;
    if (isPopupOpen() || SW.score.isTyping()) return;
    const t = event.target;
    if (t && (t.classList && t.classList.contains('line-label') || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    // Undo / Redo (history.js): ⌘Z · ⇧⌘Z (Ctrl-Z · Ctrl-Y / Ctrl-⇧Z) — as the rail's buttons: with the
    // score locked, none; in the locked Chords tab, only a step that leaves the melody (edit-box.js undoRedo)
    if ((event.metaKey || event.ctrlKey) && !event.altKey && SW.history) {
      const k = event.key.toLowerCase();
      if (k === 'z' || k === 'y') {
        event.preventDefault();
        SW.editBox.undoRedo(k === 'y' || event.shiftKey);
        return;
      }
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    // the letters and numbers: one of four keyboards (js/keymap.js) —
    // chords out: Digital Accordion's two hands; locked with the Edit box
    // shut: the same hands swapped, only to play; the keyboard alone: the
    // Virtual Keyboard's Flex rows; neither: 1.0's solfège letters in Edit
    if (SW.keymap.keyDown(event)) return;
    if (S.editing && SW.keymap.layout() === 'letters' && SW.score.handleSolfegeKeyInput(event.key)) { event.preventDefault(); return; }

    if (event.key === ' ') {
      event.preventDefault();
      if (!event.repeat) SW.player.toggle();
      return;
    }

    if (S.editing && (event.key === '[' || event.key === ']')) {
      event.preventDefault();
      SW.rhythm.step(event.key === ']' ? 1 : -1);
      return;
    }

    // a chord selected in the chord track: Delete silences it, Enter opens Just here, ← → walk the chords
    if (SW.ctrack && SW.ctrack.keyDown(event)) return;
    switch (event.key) {
      case 'ArrowLeft': event.preventDefault(); SW.score.navigateLeft(); break;
      case 'ArrowRight': event.preventDefault(); SW.score.navigateRight(); break;
      case 'ArrowUp':
        event.preventDefault();
        if (event.shiftKey) SW.score.selectHarmonyNote('up'); else SW.score.editCurrentNote('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (event.shiftKey) SW.score.selectHarmonyNote('down'); else SW.score.editCurrentNote('down');
        break;
      case 'Delete':
      case 'Backspace':
        if (S.editing && SW.score.getActiveNote()) { event.preventDefault(); SW.score.handleDeleteClick(); }
        break;
    }
  });

  /* Touch screens: a finger going down is not a "user activation", only its
     lift is, so the browser keeps audio asleep through the first press. The
     panel's chords are scheduled, so they still sound the moment audio
     wakes on the lift (verified by the touch test); this makes sure it does. */
  const wakeOnLift = e => {
    if (e.pointerType === 'mouse') return;
    try { const c = SW.audio.context(); if (c.state === 'running') window.removeEventListener('pointerup', wakeOnLift, true); } catch (err) {}
  };
  window.addEventListener('pointerup', wakeOnLift, true);

  // a held Z X C V B, or a held note, lets go with the key, whatever else is going on — but on the
  // Chord Chart Z X C V B are toggles (chord-chart.js): they stay on until pressed again
  document.addEventListener('keyup', event => {
    SW.keymap.keyUp(event);
    if (event.key && event.key.length === 1 && SW.chords.isModKey(event.key) && !(SW.chordChart && SW.chordChart.latches())) SW.chords.setMod(event.key.toUpperCase(), false);
  });

  /* ---------------- start ---------------- */
  function start() {
    document.body.setAttribute('tabindex', '0');
    ui.wireSheets();
    ui.trackToolbar();
    SW.settings.init();
    SW.score.init();
    SW.library.init();
    SW.lessons.init();
    SW.score.changeKey(S.key);
    SW.library.boot();
    SW.settings.applyPolicyToShell();
    SW.editBox.init();          // the rail: the Edit box out or away, the lock — and from them, editing
    SW.chordStrip.render();
    SW.lane.render();
    SW.rhythm.render();
    SW.dock.render();
    SW.dock.align();
    syncSetup();
    SW.staff.render();
    // fonts change widths; re-seat the keyboard once they have arrived
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => SW.dock.align());
  }

  // a short link (#song=~… / #lesson=~…) is unpacked first (core.js SHORT LINKS)
  if (ui.needsUnpack()) ui.unpackLinks().then(start, start);
  else start();
  SW.app = { setPresent };
})();

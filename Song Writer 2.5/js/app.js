/* ==========================================================================
   Song Writer — app.js
   --------------------------------------------------------------------------
   Start-up order and the controls that belong to no one module: the
   toolbar's key + time tile and BPM chip, Play and the step pad, Present
   mode, and the keyboard.

   THE KEYBOARD, both hands (1.0's keys are all kept):
     Space          play / stop (both modes)
     ← →            step through the song, each note sounding (1.0; wraps
                    past either end)
     ⇧↑ ⇧↓          pick a note inside a harmony (both modes)
     ↑ ↓            Edit: raise / lower the note (1.0)
     letters and    one of three keyboards, by what is out (js/keymap.js):
     numbers        · chord panel out (keyboard or not): Digital Accordion's
                      two hands — LEFT F D S A G R E Q W and 1–5 play the
                      chords, Z X C V B held change them (in Edit, written
                      over a chord selected in the chord track); RIGHT the melody by
                      scale step, J = do, K L ; U I O P up, N M , . / down,
                      7 8 9 0 - on up; ⇧ / Caps Lock an octave up
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

  /* ---------------- the key (the tile's letter) ---------------- */
  function buildKeyGrid() {
    const grid = $('key-grid');
    grid.innerHTML = '';
    // named as this scale spells it (D♭ is offered as C♯ in minor); where
    // F♯ and G♭ come out as one name, one chip — the chosen key's if it is one
    const keys = SW.settings.allowedKeys();
    const byName = {};
    keys.forEach(k => {
      const n = M.spelledKey(k);
      if (!byName[n] || k === S.key) byName[n] = k;
    });
    keys.filter(k => byName[M.spelledKey(k)] === k).forEach(k => {
      const b = document.createElement('button');
      const shown = M.spelledKey(k);
      b.className = 'key-chip' + (k === S.key ? ' active' : '');
      b.dataset.key = k;
      b.textContent = M.displayKey(shown);
      b.title = 'Key of ' + M.displayKey(shown);
      b.style.setProperty('--kc', M.keySignatureColors[shown]);
      grid.appendChild(b);
    });
  }
  ui.registerPopover('keySignatureDisplay', 'key-popover', buildKeyGrid, {
    guard: () => {
      if (SW.settings.can('key')) return true;
      ui.toast('The key stays as written in this lesson');
      return false;
    }
  });
  $('key-grid').addEventListener('click', e => {
    const b = e.target.closest('.key-chip');
    if (!b) return;
    if (b.dataset.key !== S.key) {
      SW.score.changeKey(b.dataset.key);
      SW.score.changed('key');
    }
    ui.closeAllPopovers();
  });

  /* ---------------- the scale: the menu beside the key ----------------
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

  /* ---------------- the meter: the two numerals ----------------
     The top numeral: how many in a bar, 4 → 3 → 2 → 4 (the family's
     gesture), or in compound time 12 → 9 → 6 → 12. The bottom numeral
     (2.5): the kind of beat — /4 a quarter, /8 a dotted quarter of three
     eighths — keeping the number of beats: 4/4 ↔ 12/8, 3/4 ↔ 9/8,
     2/4 ↔ 6/8. Nothing written is changed by either (blocks count one
     beat of the new kind; notes keep their values and the bar lines
     fall where they fall). */
  const METER_CYCLE = { simple: ['4/4', '3/4', '2/4'], compound: ['12/8', '9/8', '6/8'] };
  function syncTile() {
    const m = SW.meters.byId(S.meter);
    $('ts-top').textContent = m.top;
    $('ts-bottom').textContent = m.bottom;
    $('ts-top').classList.toggle('two', String(m.top).length > 1);
    $('ts-top').setAttribute('aria-label', m.compound ? m.beats + ' dotted-quarter beats in a bar (' + m.top + ' eighths)' : m.top + ' beats in a bar');
    $('ts-bottom').setAttribute('aria-label', m.compound ? 'The beat is a dotted quarter note' : 'The beat is a quarter note');
    const fixed = !SW.settings.can('meter');
    $('ts-top').title = fixed ? '' : 'Tap to change the meter (' + m.id + ')';
    $('ts-bottom').title = fixed ? '' : m.compound
      ? 'Tap for ' + SW.meters.twin(m.id) + ' — back to quarter-note beats'
      : 'Tap for ' + SW.meters.twin(m.id) + ' — beats of three eighths';
    if (!$('bpm-button').querySelector('.bpm-input')) $('bpm-value').textContent = S.bpm;
  }
  $('ts-top').addEventListener('click', e => {
    e.stopPropagation();
    if (!SW.settings.can('meter')) return;
    const cycle = METER_CYCLE[SW.meters.byId(S.meter).compound ? 'compound' : 'simple'];
    const i = cycle.indexOf(S.meter);
    SW.score.setMeter(cycle[(i + 1) % cycle.length]);
    syncTile();
  });
  $('ts-bottom').addEventListener('click', e => {
    e.stopPropagation();
    if (!SW.settings.can('meter')) return;
    const to = SW.meters.twin(S.meter);
    SW.score.setMeter(to);
    syncTile();
    ui.toast(SW.meters.byId(to).compound ? to + ' — each beat is a dotted quarter: three eighths' : to + ' — each beat is a quarter note');
  });

  /* ---------------- the tempo: the BPM chip ----------------
     Rhythm Poetry's typed tempo, built to survive a smart board: a tap in
     the box is also a click on the chip around it, an on-screen
     keyboard's Done often never leaves the box, and the hover slider
     could open under the same tap. So a number is taken as soon as it is
     a real tempo, the box closes on Enter, on blur or on a tap anywhere
     else, and closing only ever happens once. */
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
    $('bpm-gauge-wrap').classList.remove('show');
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
  // a mouse resting on the chip: the tempo slider, over what typing allows
  ui.setupHoverGauge({
    trigger: bpmButton,
    wrap: $('bpm-gauge-wrap'),
    slider: $('bpm-gauge'),
    label: $('bpm-gauge-label'),
    getValue: () => S.bpm,
    getRange: () => SW.settings.tempoRange(),
    format: v => v + ' BPM',
    isDisabled: () => !SW.settings.can('tempo') || !!bpmButton.querySelector('.bpm-input'),
    onInput: v => { SW.score.setTempo(v); bpmValue.textContent = S.bpm; }
  });
  SW.bus.on('meter:changed', syncTile);
  SW.bus.on('score:loaded', syncTile);
  SW.bus.on('policy:changed', syncTile);

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
      SW.score.setEditing(false);
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
  // the hat cannot go on in Present (it has no toolbar to show it)
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
    // Undo / Redo (history.js): ⌘Z · ⇧⌘Z (Ctrl-Z · Ctrl-Y / Ctrl-⇧Z)
    if ((event.metaKey || event.ctrlKey) && !event.altKey && SW.history) {
      const k = event.key.toLowerCase();
      if (k === 'z' || k === 'y') {
        event.preventDefault();
        if (S.playing) SW.player.stop();
        if (k === 'y' || event.shiftKey) SW.history.redo(); else SW.history.undo();
        return;
      }
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    // the letters and numbers: one of three keyboards (js/keymap.js) —
    // chords out: Digital Accordion's two hands; the keyboard alone: the
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

  // a held Z X C V B, or a held note, lets go with the key, whatever else is going on
  document.addEventListener('keyup', event => {
    SW.keymap.keyUp(event);
    if (event.key && event.key.length === 1 && SW.chords.isModKey(event.key)) SW.chords.setMod(event.key.toUpperCase(), false);
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
    SW.chordStrip.render();
    SW.lane.render();
    SW.rhythm.render();
    SW.dock.render();
    SW.dock.align();
    syncTile();
    syncScale();
    SW.staff.render();
    SW.bus.on('layout:changed', () => { if ($('key-popover').classList.contains('show')) buildKeyGrid(); });
    // fonts change widths; re-seat the keyboard once they have arrived
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => SW.dock.align());
  }

  start();
  SW.app = { setPresent };
})();

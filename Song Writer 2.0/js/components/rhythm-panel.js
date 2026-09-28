/* ==========================================================================
   COMPONENT — the value circles                                 #rhythm-panel
   --------------------------------------------------------------------------
   Where a block becomes a note. The top section of the Edit box
   (edit-box.js), out while the construction hat is on — so it STAYS
   STILL while the selection steps along, and a phrase can be written one
   tap per note, left to right, without the target moving under your
   finger (DECISIONS D3).

      RHYTHM
      caption: "Block · G4 — tap a value"
      [block] [𝅝] [𝅗𝅥]
      [♩]     [♪] [𝅘𝅥𝅯]
      [• Dotted] [‿ Tie]
      [⋯ All notes      ]

     • tap a value on a BLOCK    the block is written on the staff with
                                 that value (js/staff.js), plays, and the
                                 selection steps to the next column
     • tap a value on a NOTE     the note's value changes; it stays
                                 selected (editing, not entering)
     • tap the lit value again   the note becomes a rest of that length,
                                 and back (RP's EASY rule — there is no
                                 rest button of its own, DECISIONS D10)
     • tap the block circle      a note goes back to being a block; on a
                                 block it is the block's rest
     • the dot                   dotted, half as long again. On a note it
                                 dots that note; on a block (or a value with
                                 no dotted form) it lights and WAITS: the next
                                 value tapped is written dotted, and the
                                 circles show the dotted shapes meanwhile
     • Tie                       holds the note over into a new eighth note
                                 (score.js TIES); on a tied note, unties
     • ⋯                         Every note at once: write or unwrite this
                                 line, or the whole song
     • [ ]                       a shorter / longer value (a block starts
                                 at a quarter)

   Colours are RP's EASY_COLOURS, one per base value, so a colour means
   one length everywhere it appears (here, the chips in Layout settings,
   the dots on the syllable pill, the mark under a block when the staff
   is switched off). The caption is 2.0's staff card in the family's
   kicker style; the note itself is drawn in place on the real staff.

   API
     SW.rhythm.render()         redraw for the selected column
     SW.rhythm.step(dir)        shorter (-1) / longer (+1) — the [ ] keys
     SW.rhythm.setValue(id)     write the selected column
     SW.rhythm.unwrite()        back to a block
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const V = SW.values;
  const el = document.getElementById('rhythm-panel');
  if (!el) return;

  /* The section's frame is built once, so the ⋯ button keeps its popover
     wiring; only the circles, the caption and the dot are redrawn. */
  el.innerHTML =
    '<div class="eb-kicker">Rhythm</div>' +
    '<span class="vd-caption" aria-live="polite"></span>' +
    '<div class="vd-row" role="group" aria-label="Note values"></div>' +
    '<div class="eb-row">' +
      '<button class="eb-btn vd-mini" id="value-dot-btn" title="Dotted — half as long again" aria-label="Dotted">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></svg><span>Dotted</span>' +
      '</button>' +
      '<button class="eb-btn vd-mini" id="tie-btn" title="Tie" aria-label="Tie">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2.6"><path d="M3.5 9.5c4.5 6.5 12.5 6.5 17 0"/></svg><span>Tie</span>' +
      '</button>' +
    '</div>' +
    '<div class="eb-row">' +
      '<button class="eb-btn vd-mini" id="every-btn" title="Every note at once…" aria-label="Every note at once" data-popover-anchor>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="2" fill="currentColor" stroke="none"/></svg><span>All notes</span>' +
      '</button>' +
    '</div>';
  const row = el.querySelector('.vd-row');
  const caption = el.querySelector('.vd-caption');
  const dotBtn = el.querySelector('#value-dot-btn');
  const tieBtn = el.querySelector('#tie-btn');
  /* The dot, pressed before the value: waits for the next value tapped. */
  let dotPending = false;

  function activeStack() {
    const note = SW.score && SW.score.getActiveNote();
    return note ? { note, stack: note.closest('.harmony-stack') } : { note: null, stack: null };
  }

  function offeredBases() {
    const vals = SW.settings.allowedValues();
    return V.BASES.filter(b => vals.some(id => V.byId(id).base === b));
  }
  function dotOffered(base) {
    const id = V.withDot(base, true);
    return !!id && SW.settings.allowedValues().indexOf(id) !== -1;
  }
  function circleSize() {
    const v = parseFloat(getComputedStyle(el).getPropertyValue('--eb-circle'));
    return isFinite(v) && v > 0 ? v : 38;
  }

  function render() {
    const { note, stack } = activeStack();
    const notated = !!stack && SW.score.isNotated(stack);
    const cur = stack ? SW.score.getStackValue(stack) : V.DEFAULT;
    const cv = V.byId(cur);
    const allRest = !!stack && Array.from(stack.querySelectorAll('.note')).every(n => n.classList.contains('rest-note'));
    const bases = offeredBases();
    const anyDot = bases.some(dotOffered);
    const blockColour = note && !allRest ? (note.style.backgroundColor || '#9487A2') : '#9487A2';
    const glyphH = Math.round(circleSize() * 0.66);

    let html = '<button class="value-choice value-block' + (stack && !notated ? ' on' : '') + (stack && !notated && allRest ? ' is-rest' : '') +
      '" data-block="1" style="--c:' + blockColour + '" title="' +
      (notated ? 'Back to a block — its rhythm undecided' : 'A block: pitch only, its rhythm still to be decided — tap again for a rest') +
      '" aria-label="Block"' + (stack ? '' : ' disabled') + '><span class="blk-glyph"></span></button>';
    const preview = dotPending && !notated;      // the circles show what a tap will write
    bases.forEach(b => {
      const plain = V.withDot(b, false) || V.withDot(b, true);
      const shown = preview && dotOffered(b) ? V.withDot(b, true) : plain;
      const on = notated && cv.base === b;
      html += '<button class="value-choice' + (on ? ' on' : '') + (on && allRest ? ' is-rest' : '') + '" data-base="' + b + '" style="--c:' + V.colour(plain) +
        '" title="' + V.byId(plain).name + (on ? ' — tap again for a rest' : notated ? '' : ' — writes this block on the staff') +
        '" aria-label="' + V.byId(plain).name + '"' + (stack ? '' : ' disabled') + '>' +
        SW.engrave.value(on ? cur : shown, { height: glyphH, rest: on && allRest }) + '</button>';
    });
    row.innerHTML = html;

    dotBtn.hidden = !anyDot;
    const dotsNote = !!stack && notated && dotOffered(cv.base);   // else it waits for the next value
    if (dotsNote && dotPending) dotPending = false;
    dotBtn.classList.toggle('on', dotsNote ? !!cv.dotted : dotPending);
    dotBtn.disabled = !stack;
    dotBtn.title = dotsNote ? (cv.dotted ? 'Dotted — tap for plain' : 'Dotted — half as long again')
      : dotPending ? 'The next value you tap is written dotted — tap to cancel' : 'Dotted — tap, then a value, for a dotted note';

    // the tie (score.js TIES)
    const ts = SW.score.tieState ? SW.score.tieState() : { can: false, tied: false, why: '' };
    tieBtn.disabled = !ts.can;
    tieBtn.classList.toggle('on', ts.tied);
    tieBtn.title = ts.tied ? 'Tied to the next note — tap to untie'
      : ts.why === 'block' ? 'Tie — give this note a rhythm first'
      : ts.why === 'rest' ? 'A rest has nothing to hold over'
      : 'Tie — hold this note over into a new eighth note (tap a value to change it)';
    tieBtn.setAttribute('aria-pressed', String(ts.tied));

    // the caption: 2.0's staff card, in words
    let text = 'Select a block';
    if (stack) {
      const spelled = Array.from(stack.querySelectorAll('.note'))
        .filter(n => !n.classList.contains('rest-note'))
        .map(n => SW.music.spellNote(SW.music.noteClassOf(n), SW.score.getAccidentalFromNote(n)));
      const pitch = spelled.map(SW.engrave.pitchName).join(' ');
      if (!notated) text = (allRest ? 'Rest block' : 'Block · ' + pitch) + (dotPending ? ' — tap a value (dotted)' : ' — tap a value');
      else text = (allRest || !spelled.length) ? cv.name.replace(' note', ' rest') : cv.name + ' · ' + pitch;
    }
    caption.textContent = text;
    el.classList.toggle('no-selection', !stack);
  }

  /* Write (or rewrite) the selected column. A block that is written
     steps the selection on to the next column, silently. */
  function setValue(v) {
    const { note, stack } = activeStack();
    if (!stack || !S.editing || !SW.settings.can('values')) return;
    if (SW.settings.allowedValues().indexOf(v) === -1) return;
    const wasBlock = !SW.score.isNotated(stack);
    SW.score.applyStackValue(stack, v);
    if (note && !note.classList.contains('rest-note')) SW.score.soundNote(note);   // silent on a tie's held note
    SW.score.changed('value');
    if (wasBlock && !SW.score.selectNextStack(stack)) SW.score.emitSelection(false);
    else if (!wasBlock) SW.score.emitSelection(false);
    render();
  }

  function unwrite() {
    const { stack } = activeStack();
    if (!stack || !S.editing || !SW.settings.can('values')) return;
    if (!SW.score.isNotated(stack)) {
      // the block circle again: the block's rest (and back)
      if (SW.settings.can('rest')) SW.score.toggleRestOnCurrentNote();
      else SW.ui.toast('Rests are switched off in Layout settings');
      render();
      return;
    }
    SW.score.applyStackValue(stack, null);
    SW.score.emitSelection(false);
    SW.score.changed('value');
    render();
  }

  function step(dir) {
    const { stack } = activeStack();
    if (!stack || !S.editing || !SW.settings.can('values')) return;
    const vals = SW.settings.allowedValues().slice().sort((a, b) => V.byId(a).ticks - V.byId(b).ticks);
    if (!SW.score.isNotated(stack)) {
      // a block is written as a quarter first (or the nearest value offered)
      let q = vals.indexOf('q') !== -1 ? 'q' : vals[Math.floor(vals.length / 2)];
      if (q && dotPending) { q = withWaitingDot(V.byId(q).base) || q; dotPending = false; }
      if (q) setValue(q);
      return;
    }
    const at = vals.indexOf(SW.score.getStackValue(stack));
    const next = vals[Math.max(0, Math.min(vals.length - 1, (at === -1 ? vals.indexOf('q') : at) + dir))];
    if (next) setValue(next);
  }

  row.addEventListener('click', e => {
    if (e.target.closest('.value-block')) { unwrite(); return; }
    const c = e.target.closest('.value-choice');
    if (!c) return;
    const { stack } = activeStack();
    if (!stack) return;
    const notated = SW.score.isNotated(stack);
    const cur = V.byId(SW.score.getStackValue(stack));
    const base = c.dataset.base;
    if (notated && cur.base === base) {
      // RP's EASY rule: the lit one again makes the same-length rest
      if (SW.settings.can('rest')) SW.score.toggleRestOnCurrentNote();
      else SW.ui.toast('Rests are switched off in Layout settings');
      render();
      return;
    }
    let id = null;
    if (dotPending) {
      id = withWaitingDot(base);
      dotPending = false;
      if (!id) SW.ui.toast('There is no dotted ' + V.byId(V.withDot(base, false)).name.toLowerCase() + ' — written plain');
    }
    const dotted = notated && cur.dotted && dotOffered(base);
    setValue(id || V.withDot(base, dotted) || V.withDot(base, false) || V.withDot(base, true));
  });
  /* The waiting dot on `base`, if that value has a dotted form on offer. */
  function withWaitingDot(base) {
    return dotOffered(base) ? V.withDot(base, true) : null;
  }
  dotBtn.addEventListener('click', () => {
    const { stack } = activeStack();
    if (!stack) return;
    const cur = V.byId(SW.score.getStackValue(stack));
    if (SW.score.isNotated(stack) && dotOffered(cur.base)) {
      const flip = V.withDot(cur.base, !cur.dotted);
      if (flip) setValue(flip);
      return;
    }
    dotPending = !dotPending;                  // a block: the dot waits for the value
    render();
  });
  tieBtn.addEventListener('click', e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    SW.score.toggleTie();
    render();
  });

  /* ---- ⋯ Every note at once: this line, or the whole song ---- */
  function lineOfSelection() {
    const note = SW.score.getActiveNote();
    return note ? note.closest('.notation-line') : document.querySelector('#score .notation-line');
  }
  function said(n, write) {
    if (write) SW.ui.toast(n ? n + (n === 1 ? ' block written' : ' blocks written') + ' as quarter notes' : 'Every block is already written');
    else SW.ui.toast(n ? n + (n === 1 ? ' note is' : ' notes are') + ' blocks again' : 'Nothing is written yet');
    SW.ui.closeAllPopovers();
    render();
  }
  SW.ui.registerPopover('every-btn', 'every-popover');
  const on = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener('click', fn); };
  on('line-write-all', () => said(SW.score.notateLine(lineOfSelection(), 'q'), true));
  on('line-clear-all', () => said(SW.score.clearLineValues(lineOfSelection()), false));
  on('song-write-all', () => said(SW.score.notateAll('q'), true));
  on('song-clear-all', () => said(SW.score.clearAllValues(), false));

  ['selection', 'score:loaded', 'score:changed', 'key:changed', 'layout:changed', 'mode:changed', 'view:changed'].forEach(evt => SW.bus.on(evt, render));
  SW.bus.on('mode:changed', () => { if (!S.editing && dotPending) { dotPending = false; render(); } });
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(render, 120); });
  render();
  SW.rhythm = { render, step, setValue, unwrite };
})();

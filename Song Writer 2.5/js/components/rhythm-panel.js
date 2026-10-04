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
    /* Dotted · Tie · Rest (2.5): the picture over the word */
    '<div class="eb-row vd-trio">' +
      '<button class="eb-btn vd-mini vd-tall" id="value-dot-btn" title="Dotted — half as long again" aria-label="Dotted">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/></svg><span>Dotted</span>' +
      '</button>' +
      '<button class="eb-btn vd-mini vd-tall" id="tie-btn" title="Tie" aria-label="Tie">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2.6"><path d="M3.5 9.5c4.5 6.5 12.5 6.5 17 0"/></svg><span>Tie</span>' +
      '</button>' +
      '<button class="eb-btn vd-mini vd-tall" id="rest-btn" title="Rest — then tap a value: a rest that long goes in after this note" aria-label="Rest" aria-pressed="false">' +
        '<span class="vd-rest-pic" aria-hidden="true"></span><span>Rest</span>' +
      '</button>' +
    '</div>' +
    '<div class="eb-row">' +
      '<button class="eb-btn vd-mini" id="fill-bar-btn" title="Fill the bar — this note runs on to the bar line" aria-label="Fill the bar">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h13"/><path d="m12 8 4 4-4 4"/><path d="M20 5v14"/></svg><span>Fill bar</span>' +
      '</button>' +
      '<button class="eb-btn vd-mini" id="every-btn" title="Every note at once…" aria-label="Every note at once" data-popover-anchor>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="2" fill="currentColor" stroke="none"/></svg><span>All notes</span>' +
      '</button>' +
    '</div>' +
    /* 2.5: Tap it in and the beat strip (js/flow.js, beat-strip.js) */
    '<div class="eb-row">' +
      '<button class="eb-btn vd-mini" id="tap-btn" title="Tap the rhythm — play this line with → in your own rhythm" aria-label="Tap the rhythm">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6" fill="currentColor" stroke="none"/></svg><span>Tap in</span>' +
      '</button>' +
      '<button class="eb-btn vd-mini" id="beats-btn" title="Beats — the selected bar\'s beats, to tap a rhythm into" aria-label="Beats" aria-pressed="false">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="8" width="8" height="8" rx="4"/><rect x="13.5" y="8" width="8" height="8" rx="4"/><circle cx="6.5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="17.5" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg><span>Beats</span>' +
      '</button>' +
    '</div>';
  const row = el.querySelector('.vd-row');
  const caption = el.querySelector('.vd-caption');
  const dotBtn = el.querySelector('#value-dot-btn');
  const tieBtn = el.querySelector('#tie-btn');
  const restBtn = el.querySelector('#rest-btn');
  restBtn.querySelector('.vd-rest-pic').innerHTML = SW.engrave.value('q', { height: 18, rest: true });
  const fillBtn = el.querySelector('#fill-bar-btn');
  const tapBtn = el.querySelector('#tap-btn');
  const beatsBtn = el.querySelector('#beats-btn');
  const place = document.createElement('span');
  place.className = 'vd-place';
  caption.after(place);
  /* how much of a bar, in the meter's own beats: 1½, ¾, 2 … — or in
     6/8 9/8 12/8, where a beat is three eighths: ⅓, 1⅔ … */
  const FRACT = { 0: '', 6: '¼', 12: '½', 18: '¾' };
  const FRACT_C = { 0: '', 6: '⅙', 12: '⅓', 18: '½', 24: '⅔', 30: '⅚' };
  function beatParts(ticks) {
    const mt = SW.meters.byId(S.meter);
    const whole = Math.floor(ticks / mt.beatTicks), frac = ticks % mt.beatTicks;
    const f = (mt.compound ? FRACT_C : FRACT)[frac];
    return { whole, f: f !== undefined ? f : '', beat: mt.beatTicks };
  }
  function beatsText(ticks) {
    const b = beatParts(ticks);
    const n = (b.whole ? String(b.whole) : '') + b.f || '0';
    return n + (ticks === b.beat || (b.whole === 0 && b.f) ? ' beat' : ' beats');
  }
  /* The dot, pressed before the value: waits for the next value tapped. */
  let dotPending = false;
  /* The Rest button (2.5): armed, it waits for the next value tapped —
     a rest that long goes in AFTER the selected note or rest (score.js
     insertRestAfterCurrent). The circles show rests meanwhile; Dotted
     makes it a dotted rest. */
  let restPending = false;

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

    if (restPending && (!stack || !SW.settings.can('rest'))) restPending = false;
    let html = '<button class="value-choice value-block' + (stack && !notated && !restPending ? ' on' : '') + (stack && !notated && allRest && !restPending ? ' is-rest' : '') +
      '" data-block="1" style="--c:' + blockColour + '" title="' +
      (notated ? 'Back to a block — its rhythm undecided' : 'A block: pitch only, its rhythm still to be decided — tap again for a rest') +
      '" aria-label="Block"' + (stack && !restPending ? '' : ' disabled') + '><span class="blk-glyph"></span></button>';
    const preview = dotPending && (!notated || restPending);      // the circles show what a tap will write
    bases.forEach(b => {
      const plain = V.withDot(b, false) || V.withDot(b, true);
      const shown = preview && dotOffered(b) ? V.withDot(b, true) : plain;
      const on = notated && cv.base === b && !restPending;
      const restName = V.byId(shown).name.replace(' note', ' rest');
      html += '<button class="value-choice' + (on ? ' on' : '') + (on && allRest ? ' is-rest' : '') + (restPending ? ' rest-preview' : '') + '" data-base="' + b + '" style="--c:' + V.colour(plain) +
        '" title="' + (restPending ? restName + ' — goes in after this note'
          : V.byId(plain).name + (on ? ' — tap again for a rest' : notated ? '' : ' — writes this block on the staff')) +
        '" aria-label="' + (restPending ? restName : V.byId(plain).name) + '"' + (stack ? '' : ' disabled') + '>' +
        SW.engrave.value(on ? cur : shown, { height: glyphH, rest: (on && allRest) || restPending }) + '</button>';
    });
    row.innerHTML = html;

    dotBtn.hidden = !anyDot;
    const dotsNote = !!stack && notated && dotOffered(cv.base);   // else it waits for the next value
    if (dotsNote && dotPending && !restPending) dotPending = false;
    dotBtn.classList.toggle('on', dotsNote && !restPending ? !!cv.dotted : dotPending);
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

    // the rest (2.5): removed where Layout settings switch rests off
    restBtn.hidden = !SW.settings.can('rest');
    restBtn.disabled = !stack;
    restBtn.classList.toggle('on', restPending);
    restBtn.setAttribute('aria-pressed', String(restPending));
    restBtn.title = restPending ? 'Tap a value: a rest that long goes in after this note — tap Rest again to cancel'
      : 'Rest — then tap a value: a rest that long goes in after this note';

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
    if (stack && restPending) text = 'A rest after this — tap a value' + (dotPending ? ' (dotted)' : '');
    caption.textContent = text;
    el.classList.toggle('no-selection', !stack);

    // 2.5: where the note sits in its bar, and how much of the bar is left
    const at = stack && SW.timing.placeOf ? SW.timing.placeOf(stack) : null;
    if (at) {
      const into = beatParts(Math.round((at.beat - 1) * at.le.meter.beatTicks));
      const b = into.whole + 1, fr = into.f;
      const bar = at.bar === 0 ? 'Pick-up' : 'Bar ' + at.bar;
      const left = at.crosses ? 'runs over the bar line'
        : at.left === 0 ? 'the bar is full' : beatsText(at.left) + ' left';
      place.textContent = bar + ' · beat ' + b + fr + ' · ' + left;
      place.classList.toggle('over', at.crosses);
    } else place.textContent = '';
    // Fill bar, Tap rhythm, Beats
    const fs = SW.flow ? SW.flow.fillState() : { can: false };
    fillBtn.disabled = !fs.can;
    fillBtn.title = fs.why === 'fits' ? 'This note already ends on the bar line'
      : fs.why === 'shrink' ? 'Fill the bar — this note stops at the bar line (it runs over it now)'
      : fs.why === 'rhythm' ? 'Fill the bar — select a note (a rest made by the rhythm moves with it)'
      : 'Fill the bar — this note runs on to the bar line';
    tapBtn.disabled = !stack;
    const beatsOn = !!(SW.settings.view && SW.settings.view.showBeats);
    beatsBtn.classList.toggle('on', beatsOn);
    beatsBtn.setAttribute('aria-pressed', String(beatsOn));
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
      const beatV = SW.meters.beat().value;                 // a quarter, or a dotted quarter in 6/8
      let q = vals.indexOf(beatV) !== -1 ? beatV : vals.indexOf('q') !== -1 ? 'q' : vals[Math.floor(vals.length / 2)];
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
    if (restPending) {
      // 2.5: the armed Rest — a rest this long goes in after the selection
      let id = V.withDot(base, false) || V.withDot(base, true);
      if (dotPending) {
        const d = withWaitingDot(base);
        if (d) id = d;
        else SW.ui.toast('There is no dotted ' + V.byId(id).name.toLowerCase().replace(' note', ' rest') + ' — written plain');
      }
      restPending = false;
      dotPending = false;
      if (SW.settings.allowedValues().indexOf(id) === -1) { SW.ui.toast('That value is switched off in Layout settings'); render(); return; }
      SW.score.insertRestAfterCurrent(id);
      render();
      return;
    }
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
    if (restPending) { dotPending = !dotPending; render(); return; }    // a dotted rest is on its way
    const cur = V.byId(SW.score.getStackValue(stack));
    if (SW.score.isNotated(stack) && dotOffered(cur.base)) {
      const flip = V.withDot(cur.base, !cur.dotted);
      if (flip) setValue(flip);
      return;
    }
    dotPending = !dotPending;                  // a block: the dot waits for the value
    render();
  });
  restBtn.addEventListener('click', e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    if (!SW.settings.can('rest')) return;
    restPending = !restPending;
    if (!restPending) dotPending = false;
    render();
  });
  fillBtn.addEventListener('click', e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    if (SW.flow) SW.flow.fillBar();
    render();
  });
  tapBtn.addEventListener('click', e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    if (SW.flow) SW.flow.tap.start();
  });
  beatsBtn.addEventListener('click', e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    SW.settings.setView({ showBeats: !SW.settings.view.showBeats });
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
    const name = SW.meters.beat().compound ? ' as dotted quarter notes' : ' as quarter notes';
    if (write) SW.ui.toast(n ? n + (n === 1 ? ' block written' : ' blocks written') + name : 'Every block is already written');
    else SW.ui.toast(n ? n + (n === 1 ? ' note is' : ' notes are') + ' blocks again' : 'Nothing is written yet');
    SW.ui.closeAllPopovers();
    render();
  }
  SW.ui.registerPopover('every-btn', 'every-popover');
  const on = (id, fn) => { const b = document.getElementById(id); if (b) b.addEventListener('click', fn); };
  const beatValue = () => SW.settings.allowedValues().indexOf(SW.meters.beat().value) !== -1 ? SW.meters.beat().value : 'q';
  on('line-write-all', () => said(SW.score.notateLine(lineOfSelection(), beatValue()), true));
  on('line-clear-all', () => said(SW.score.clearLineValues(lineOfSelection()), false));
  on('song-write-all', () => said(SW.score.notateAll(beatValue()), true));
  on('song-clear-all', () => said(SW.score.clearAllValues(), false));

  ['selection', 'score:loaded', 'score:changed', 'key:changed', 'layout:changed', 'mode:changed', 'view:changed'].forEach(evt => SW.bus.on(evt, render));
  SW.bus.on('mode:changed', () => { if (!S.editing && (dotPending || restPending)) { dotPending = false; restPending = false; render(); } });
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(render, 120); });
  render();
  SW.rhythm = { render, step, setValue, unwrite };
})();

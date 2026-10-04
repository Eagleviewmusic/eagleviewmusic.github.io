/* ==========================================================================
   COMPONENT — the Edit box                                       #edit-box
   --------------------------------------------------------------------------
   Every note tool in one box, out while the construction hat is on (it
   replaced the tools drawn around the selected note, and the value
   drawer in the toolbar):

        ┌─────────────────────┐
        │ ⛑ Edit              │   the title
        ├─────────────────────┤
        │ RHYTHM              │   the value circles (rhythm-panel.js)
        │ ▮  𝅝  𝅗𝅥             │
        │ ♩  ♪  𝅘𝅥𝅯             │
        │ • Dotted  ⋯ All     │
        │ NOTE                │
        │ ♯ Sharp   ♭ Flat    │   act on the selected note
        │ ⧉ Harmony       −   │   a note two steps above / take it away
        │ SYLLABLE            │
        │ (  ● ● ●        − ) │   a dot per note on this word (tap one
        │ + Note     + Note   │   to select it); − takes the selected one
        │  /Syllable   Only   │   away. The two ways to add a note, side
        │ WORDS & LINES       │   by side: with a syllable of its own
        │ ↰ Join up ↵ New line│   after this one, or on this same
        │ ♪| Pick-up          │   syllable (connected). New line and
        │ 𝅘𝅥𝅯 ♪  ♩  𝅗𝅥 /  ♪. ♩. 𝅗𝅥.│   Pick-up start a line AT the selected
        │ ×      Delete       │   word (see below). Delete: two taps
        │ Staff notation  ◯━  │   the View switch, the same setting
        └─────────────────────┘

   It stays out for as long as the hat is on, and nothing is drawn around
   the note, so the song does not move when the hat goes on. Every button
   calls score.js — the same functions the keys call.

   PICK-UP (2026-10-01, the user's design; score.js PICK-UPS). On a word
   that is not in a pick-up, Pick-up starts a new line there (as New
   line does) opening with a pick-up worth the word's own length. In a
   pick-up the button is lit and reads Remove pick-up (the line joins
   back onto the one above), and the value chips appear under it, the lit
   one its value — tap another to change it. Out of a pick-up the chips
   are away (the user's call: less clutter), the one exception to the
   box's "still targets" rule.

   STAFF NOTATION. The switch at the foot is View → Staff notation itself
   (settings.js view.showStaff, through setView): turn it off in either
   place and both show off; off, every column is a block with its value
   marked under it.

   STILL TARGETS. What Layout settings or a lesson take away is removed
   (the family's rule); a tool that cannot act on the selection just now
   is only greyed, so the box never changes shape as the selection steps
   along and no button moves under a finger.

   WHERE IT SITS (2026-09-28, the user's call). No longer floating: it
   is the workspace's left column, from the top of the stage to the
   toolbar — the chord panel's place and the corner under it, beside the
   keyboard when that is out (style.css WORKSPACE). With the chords on,
   the chord panel itself (#chord-strip, the same element and all its
   wiring) moves to the END of the box's scroll (#eb-chords, under the
   Staff notation switch) while the hat is on, pencils and all — in Edit
   chords play a minor part, so they wait below the tools until scrolled
   to (the user's call) — and goes back beside the stage when the hat
   comes off (seatChords). The corner under it is away while editing.
   (Until then it floated and was dragged by its title bar; its old
   place, song_writer_25_edit_box_v1, is no longer read.)

   FOCUS. The box never takes the focus (mousedown is cancelled on its
   buttons), so a word being typed stays open and the keys keep working
   after a tap in the box; its own clicks stop at the box, except the
   value circles', which finish a word being typed as they always have.

   API
     SW.editBox.render()     update every tool for the selection
     SW.editBox.schedule()   the same, coalesced
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const box = document.getElementById('edit-box');
  const score = document.getElementById('score');
  if (!box || !score) return;
  const secValues = document.getElementById('rhythm-panel');
  const secNote = document.getElementById('eb-note');
  const secSyl = document.getElementById('eb-syllable');
  const secWords = document.getElementById('eb-words');
  const empty = document.getElementById('eb-empty');
  const staffSlot = document.getElementById('eb-staff');
  const can = what => SW.settings.can(what);


  const ICON = {
    harmony: '<svg viewBox="0 0 18 20" aria-hidden="true"><rect x="5.5" y="1" width="10" height="18" rx="2" fill="currentColor" stroke="none" opacity=".55"/><rect x="1.5" y="7" width="10" height="12" rx="2" fill="currentColor" stroke="none"/></svg>',
    pickup: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="7.5" cy="17" rx="3.4" ry="2.5" transform="rotate(-20 7.5 17)" fill="currentColor" stroke="none"/><path d="M10.6 16.2V4.5l3.6 3"/><path d="M19.5 3.5v17"/></svg>',
    newline: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 10 4 15 9 20"/><path d="M20 5v10H4"/></svg>',
    join: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a4 4 0 0 1 0 8h-1"/></svg>',
    add: '<svg viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2.6"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
    del: '<svg viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2.6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
  };

  function button(cls, html, title, act, onClick) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.innerHTML = html;
    b.title = title;
    b.setAttribute('aria-label', title);
    if (act) b.dataset.tool = act;
    b.addEventListener('click', e => {
      e.stopPropagation();
      SW.ui.closeAllPopovers();
      onClick(e);
    });
    return b;
  }
  function div(cls, parent) {
    const d = document.createElement('div');
    d.className = cls;
    if (parent) parent.appendChild(d);
    return d;
  }
  function kicker(text, parent) {
    div('eb-kicker', parent).textContent = text;
  }
  function setTitle(b, title) {
    if (b.title === title) return;
    b.title = title;
    b.setAttribute('aria-label', title);
  }

  /* ---- the sections, built once (the value circles build their own) ---- */
  kicker('Note', secNote);
  const accRow = div('eb-row', secNote);
  const sharp = button('eb-btn', '<span class="eb-glyph">♯</span><span>Sharp</span>', 'Sharp', 'sharp', () => SW.score.handleAccidentalClick('sharp'));
  const flat = button('eb-btn', '<span class="eb-glyph">♭</span><span>Flat</span>', 'Flat', 'flat', () => SW.score.handleAccidentalClick('flat'));
  accRow.append(sharp, flat);
  const harmRow = div('eb-row', secNote);
  const harmAdd = button('eb-btn eb-harmony', ICON.harmony + '<span>Harmony</span>', 'Harmony — add a note two steps above', 'harmony+', () => SW.score.addHarmonyNote());
  const harmRemove = button('eb-btn eb-square', '−', 'Take the selected harmony note away', 'harmony-', () => SW.score.removeHarmonyNote());
  harmRow.append(harmAdd, harmRemove);

  kicker('Syllable', secSyl);
  const pill = div('eb-pill', secSyl);
  const dots = div('eb-dots');
  const sylRemove = button('eb-pm', '−', 'One note fewer on this syllable (takes the selected one away)', 'connected-', () => SW.score.removeCurrentConnectedNote());
  pill.append(dots, sylRemove);
  // the two ways to add a note, side by side
  const addRow = div('eb-row', secSyl);
  const addSyl = button('eb-btn eb-add', '<span class="eb-add-main">+ Note</span><span class="eb-add-sub">/ Syllable</span>',
    '+ Note/Syllable — a new note with a syllable of its own, after this one', 'add', () => SW.score.addSyllableAfterCurrent());
  const addNote = button('eb-btn eb-add', '<span class="eb-add-main">+ Note</span><span class="eb-add-sub">Only</span>',
    '+ Note Only — another note on this same syllable (connected)', 'connected+', () => SW.score.duplicateCurrentNote());
  addRow.append(addSyl, addNote);

  kicker('Words & lines', secWords);
  const grid = div('eb-grid', secWords);
  const join = button('eb-btn', ICON.join + '<span>Join up</span>', 'Join this line to the one above', 'join', () => SW.score.joinUp());
  const newline = button('eb-btn', ICON.newline + '<span>New line</span>', 'Start a new line at this word', 'newline', () => SW.score.newLineAfterCurrent());
  const pick = button('eb-btn eb-wide', ICON.pickup + '<span class="eb-pick-label">Pick-up</span>', 'Pick-up', 'pickup', () => SW.score.togglePickup());
  const pickLabel = pick.querySelector('.eb-pick-label');
  const chips = div('eb-chips eb-wide');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'What the pick-up is worth');
  const del = button('eb-btn danger eb-wide', ICON.del + '<span>Delete</span>', 'Delete this syllable (tap twice)', 'delete', () => SW.score.handleDeleteClick());
  grid.append(join, newline, pick, chips, del);

  /* the pick-up's values: the plain ones over their dotted ones (a value
     a bar long or more in this time is greyed, never taken away) */
  ['s', 'e', 'q', 'h', null, 'e.', 'q.', 'h.'].forEach(id => {
    if (!id) { div('eb-chip-gap', chips); return; }
    const c = button('eb-chip', SW.engrave.value(id, { height: 20 }), SW.values.byId(id).name, null, () => SW.score.makePickup(id));
    c.dataset.v = id;
    chips.appendChild(c);
  });

  /* ---- Staff notation: View's switch, the same setting ---- */
  const staffSwitch = SW.ui.switchRow('Staff notation', '', false, e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    SW.settings.setView({ showStaff: !SW.settings.view.showStaff });
  });
  staffSwitch.classList.add('eb-switch');
  staffSwitch.dataset.tool = 'staff';
  staffSlot.appendChild(staffSwitch);
  function syncStaffSwitch() {
    const on = !!SW.settings.view.showStaff;
    staffSwitch.classList.toggle('active', on);
    staffSwitch.setAttribute('aria-pressed', String(on));
    staffSwitch.querySelector('.switch-desc').textContent = on ? 'Written notes on the staff' : 'Off: rhythms under the blocks';
    setTitle(staffSwitch, on ? 'Staff notation is on — tap to show the rhythms under the blocks instead' : 'Staff notation is off — tap to write the notes on the staff');
  }

  /* ---- the dots: one per note on the selected syllable ---- */
  function renderDots(syl, stack) {
    dots.innerHTML = '';
    if (!syl) return;
    syl.querySelectorAll('.harmony-stack').forEach(st => {
      const n = st.querySelector('.note');
      const allRest = Array.from(st.querySelectorAll('.note')).every(x => x.classList.contains('rest-note'));
      const written = SW.score.isNotated(st);
      const label = written ? SW.values.byId(st.dataset.v).name + (allRest ? ' (rest)' : '') : 'Block — rhythm not written yet';
      const d = button('vdot' + (!written ? ' is-block' : '') + (allRest ? ' is-rest' : '') + (st === stack ? ' cur' : ''), '', label, null, () => {
        const t = st.querySelector('.note');
        if (t) SW.score.setNoteAsActive(t, true);
      });
      d.style.setProperty('--c', written ? SW.values.colour(st.dataset.v) : (allRest ? '#525b64' : (n && n.style.backgroundColor) || '#9487A2'));
      dots.appendChild(d);
    });
  }

  /* ================= every tool, for the selection ================= */
  function render() {
    if (!S.editing) return;
    const note = SW.score.getActiveNote();
    const syl = note && note.closest('.syllable');
    const stack = note && note.closest('.harmony-stack');
    const rest = !!note && note.classList.contains('rest-note');
    const typing = !!score.querySelector('.syllable.editing');     // a word open for typing (not always the selected one)

    // Note: ♯ ♭, harmony
    const accOn = can('accidentals'), harmOn = can('harmony');
    secNote.hidden = !accOn && !harmOn;
    accRow.hidden = !accOn;
    harmRow.hidden = !harmOn;
    const acc = note && !rest ? SW.score.getAccidentalFromNote(note) : null;
    sharp.disabled = flat.disabled = !note || rest;
    sharp.classList.toggle('on', acc === 'sharp');
    flat.classList.toggle('on', acc === 'flat');
    setTitle(sharp, acc === 'sharp' ? 'Sharp — tap again for natural' : 'Sharp');
    setTitle(flat, acc === 'flat' ? 'Flat — tap again for natural' : 'Flat');
    const harm = SW.score.harmonyState();
    harmAdd.disabled = !harm.canAdd;
    harmRemove.disabled = !harm.canRemove;

    // Syllable: its notes, and the two ways to add one (a new syllable's
    // is a word tool, so it rests while a word is being typed)
    const connOn = can('pitch') && can('connected'), structOn = can('structure');
    secSyl.hidden = !connOn && !structOn;
    pill.hidden = !connOn;
    addNote.hidden = !connOn;
    addSyl.hidden = !structOn;
    const conn = SW.score.connectedState();
    sylRemove.disabled = !conn.canRemove;
    addNote.disabled = !conn.canAdd;
    addSyl.disabled = !syl || typing;
    renderDots(syl, stack);

    // Words & lines (not while a word is being typed: Space and ⌫ do that)
    secWords.hidden = !structOn;
    join.disabled = typing || !SW.score.joinState().can;
    const nl = SW.score.newLineState();
    newline.disabled = typing || !nl.can;
    setTitle(newline, syl && !nl.can ? 'This word already starts a line' : 'Start a new line at this word');
    // the pick-up (score.js PICK-UPS)
    const pk = SW.score.pickupState();
    pick.disabled = typing || !pk.can;
    pick.classList.toggle('on', pk.on);
    pickLabel.textContent = pk.on ? 'Remove pick-up' : 'Pick-up';
    setTitle(pick, pk.on
      ? (pk.first ? 'Take the pick-up away — the song starts on the downbeat' : 'Take the pick-up away — this line joins back onto the line above')
      : 'Pick-up — a new line starts at this word, with a pick-up into its first bar');
    chips.hidden = !pk.on;
    chips.querySelectorAll('.eb-chip').forEach(c => {
      const id = c.dataset.v, name = SW.values.byId(id).name.toLowerCase();
      const fits = pk.values.indexOf(id) !== -1;
      c.disabled = typing || !pk.can || !fits;
      c.classList.toggle('on', pk.value === id);
      setTitle(c, !fits ? 'A ' + name + ' is a bar or more in this time'
        : pk.value === id ? 'The pick-up is worth a ' + name : 'Make the pick-up worth a ' + name);
    });
    del.disabled = !syl || typing;
    const armed = SW.score.isDeleteArmed();
    del.classList.toggle('armed', armed && !del.disabled);
    setTitle(del, armed ? 'Tap again to delete this syllable' : 'Delete this syllable (tap twice)');

    // the first section shown draws no rule above it; with none, a hint
    const shown = [secValues, secNote, secSyl, secWords].filter(s => !s.hidden && !s.classList.contains('policy-off'));
    [secValues, secNote, secSyl, secWords].forEach(s => s.classList.toggle('eb-first', s === shown[0]));
    empty.hidden = shown.length > 0;
    syncStaffSwitch();
  }

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 24);
  }

  // the box never takes the focus from a word being typed, or from the page's keys
  box.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });

  /* ================= the chord panel in the foot ================= */
  const chordsSlot = document.getElementById('eb-chords');
  function seatChords() {
    const strip = document.getElementById('chord-strip');
    const stage = document.getElementById('stage');
    if (!strip || !chordsSlot || !stage) return;
    if (S.editing) { if (strip.parentNode !== chordsSlot) chordsSlot.appendChild(strip); }
    else if (strip.parentNode !== stage.parentNode) stage.parentNode.insertBefore(strip, stage);
  }

  /* ================= Undo / Redo (2.5, history.js) ================= */
  const undoBtn = document.getElementById('eb-undo');
  const redoBtn = document.getElementById('eb-redo');
  function syncUndo() {
    if (!undoBtn || !SW.history) return;
    undoBtn.disabled = !SW.history.canUndo();
    redoBtn.disabled = !SW.history.canRedo();
  }
  if (undoBtn) {
    undoBtn.addEventListener('click', e => { e.stopPropagation(); if (S.playing) SW.player.stop(); SW.history.undo(); });
    redoBtn.addEventListener('click', e => { e.stopPropagation(); if (S.playing) SW.player.stop(); SW.history.redo(); });
    SW.bus.on('history:changed', syncUndo);
  }

  /* ================= Edit ↔ Chords (2.5) =================
     With the chords out and the hat on, the switch in the title bar
     turns the box into the chord panel for PLAYING: the panel fills the
     box, without its pencils (chord-strip.js asks `editable()`), and the
     left hand's keys (F D S A G R E Q W, Z X C V B) play chords instead of
     writing solfège (app.js). Everything else stays in Edit: the
     selection, the lane (tap above a word, then a chord, writes it),
     Undo. The hat coming off puts the box back to Edit for next time. */
  const paneSeg = document.getElementById('eb-pane');
  const titleEl = document.getElementById('eb-title');
  S.editPane = 'edit';
  const chordsOut = () => !!(SW.settings && SW.settings.shows('strip'));
  function pane() { return S.editing && chordsOut() && S.editPane === 'chords' ? 'chords' : 'edit'; }
  function syncPane() {
    const out = chordsOut();
    if (paneSeg) {
      paneSeg.hidden = !out;
      paneSeg.querySelectorAll('[data-pane]').forEach(b => {
        const on = b.dataset.pane === pane();
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    }
    if (titleEl) titleEl.hidden = out;
    document.body.classList.toggle('pane-chords', pane() === 'chords');
  }
  function setPane(p) {
    const was = pane();
    S.editPane = p === 'chords' ? 'chords' : 'edit';
    syncPane();
    if (pane() !== was) SW.bus.emit('editpane:changed', { pane: pane() });
  }
  if (paneSeg) paneSeg.addEventListener('click', e => {
    const b = e.target.closest('[data-pane]');
    if (!b) return;
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    setPane(b.dataset.pane);
    if (pane() === 'edit') render();
  });
  SW.bus.on('mode:changed', () => { if (!S.editing && S.editPane !== 'edit') { S.editPane = 'edit'; SW.bus.emit('editpane:changed', { pane: 'edit' }); } syncPane(); });
  ['view:changed', 'policy:changed'].forEach(evt => SW.bus.on(evt, () => {
    const was = document.body.classList.contains('pane-chords');
    syncPane();
    if (was !== (pane() === 'chords')) SW.bus.emit('editpane:changed', { pane: pane() });
  }));

  /* ================= wiring ================= */
  SW.bus.on('mode:changed', () => { seatChords(); if (S.editing) render(); });
  ['selection', 'score:changed', 'score:loaded', 'layout:changed', 'policy:changed', 'key:changed', 'meter:changed',
   'edit:armed', 'staff:drawn', 'view:changed', 'words:typing'].forEach(evt => SW.bus.on(evt, schedule));

  syncPane();
  SW.editBox = { render, schedule, pane, setPane };
})();

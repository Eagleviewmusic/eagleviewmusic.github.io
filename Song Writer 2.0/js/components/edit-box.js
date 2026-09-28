/* ==========================================================================
   COMPONENT — the Edit box                                       #edit-box
   --------------------------------------------------------------------------
   Every note tool in one box that floats over the stage while the
   construction hat is on (it replaced the tools drawn around the
   selected note, and the value drawer in the toolbar):

        ┌─────────────────────┐
        │ ⠿ ⛑ Edit          ⌃ │   the title bar: drag it to move the box;
        ├─────────────────────┤   ⌃ folds the box up to this bar
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
        │ ×      Delete       │   syllable (connected). Delete: two taps
        │ Staff notation  ◯━  │   the View switch, the same setting
        └─────────────────────┘

   It stays out for as long as the hat is on, and nothing is drawn around
   the note, so the song does not move when the hat goes on. Every button
   calls score.js — the same functions the keys call.

   STAFF NOTATION. The switch at the foot is View → Staff notation itself
   (settings.js view.showStaff, through setView): turn it off in either
   place and both show off; off, every column is a block with its value
   marked under it.

   STILL TARGETS. What Layout settings or a lesson take away is removed
   (the family's rule); a tool that cannot act on the selection just now
   is only greyed, so the box never changes shape as the selection steps
   along and no button moves under a finger.

   WHERE IT SITS. Dragged by its title bar (mouse, finger or pen), kept
   inside the window, and remembered on this browser with whether it is
   folded (song_writer_2_edit_box_v1): as a fraction of the room the
   window leaves it across and down, so a box parked at an edge stays at
   that edge when the window changes size. Until it has been moved it
   sits at the stage's top right, clear of the chord strip on the left.

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
  const head = document.getElementById('edit-box-head');
  const foldBtn = document.getElementById('edit-box-fold');
  const secValues = document.getElementById('rhythm-panel');
  const secNote = document.getElementById('eb-note');
  const secSyl = document.getElementById('eb-syllable');
  const secWords = document.getElementById('eb-words');
  const empty = document.getElementById('eb-empty');
  const staffSlot = document.getElementById('eb-staff');
  const can = what => SW.settings.can(what);

  const STORE_KEY = 'song_writer_2_edit_box_v1';
  const EDGE = 8;                                   // the least gap to the window's edge

  const ICON = {
    harmony: '<svg viewBox="0 0 18 20" aria-hidden="true"><rect x="5.5" y="1" width="10" height="18" rx="2" fill="currentColor" stroke="none" opacity=".55"/><rect x="1.5" y="7" width="10" height="12" rx="2" fill="currentColor" stroke="none"/></svg>',
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
  const newline = button('eb-btn', ICON.newline + '<span>New line</span>', 'Start a new line after this word', 'newline', () => SW.score.newLineAfterCurrent());
  const del = button('eb-btn danger eb-wide', ICON.del + '<span>Delete</span>', 'Delete this syllable (tap twice)', 'delete', () => SW.score.handleDeleteClick());
  grid.append(join, newline, del);

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
    // on a line's pick-up (Layout settings → 1-beat pick-up), Join up and
    // Delete act on that one beat (score.js PICK-UPS)
    const js = SW.score.joinState();
    join.disabled = typing || !js.can;
    setTitle(join, js.pickup ? 'Join the pick-up to the line above (the rest of this line stays)' : 'Join this line to the one above');
    newline.disabled = del.disabled = !syl || typing;
    const armed = SW.score.isDeleteArmed();
    const onPickup = SW.score.pickupSelected();
    del.classList.toggle('armed', armed && !del.disabled);
    setTitle(del, onPickup
      ? (armed ? 'Tap again to delete the pick-up' : 'Delete the pick-up (tap twice) — a rest fills the bar above')
      : (armed ? 'Tap again to delete this syllable' : 'Delete this syllable (tap twice)'));

    // the first section shown draws no rule above it; with none, a hint
    const shown = [secValues, secNote, secSyl, secWords].filter(s => !s.hidden && !s.classList.contains('policy-off'));
    [secValues, secNote, secSyl, secWords].forEach(s => s.classList.toggle('eb-first', s === shown[0]));
    empty.hidden = shown.length > 0;
    syncStaffSwitch();
    keepInView();
  }

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 24);
  }

  /* ================= where it sits ================= */
  let spot = null;                                  // { fx, fy } once moved; null = its home
  let folded = false;
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved && isFinite(saved.fx) && isFinite(saved.fy)) spot = { fx: saved.fx, fy: saved.fy };
    folded = !!(saved && saved.folded);
  } catch (e) {}
  function remember() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign({ folded }, spot || {}))); } catch (e) {}
  }

  const room = () => ({
    x: Math.max(0, window.innerWidth - box.offsetWidth - 2 * EDGE),
    y: Math.max(0, window.innerHeight - box.offsetHeight - 2 * EDGE)
  });
  function moveTo(left, top) {
    const r = room();
    left = Math.round(Math.min(Math.max(left, EDGE), EDGE + r.x));
    top = Math.round(Math.min(Math.max(top, EDGE), EDGE + r.y));
    box.style.left = left + 'px';
    box.style.top = top + 'px';
  }
  /* From the remembered spot, or home: the stage's top right. */
  function place() {
    if (!S.editing || !box.offsetWidth) return;
    const r = room();
    if (spot) { moveTo(EDGE + spot.fx * r.x, EDGE + spot.fy * r.y); return; }
    const stage = document.getElementById('stage');
    const top = stage ? stage.getBoundingClientRect().top + 12 : 72;
    moveTo(window.innerWidth - box.offsetWidth - 16, top);
  }
  /* After its size changes: where it is, but still inside the window. */
  function keepInView() {
    if (!S.editing || !box.offsetWidth) return;
    if (!box.style.left) { place(); return; }
    moveTo(parseFloat(box.style.left), parseFloat(box.style.top));
  }
  function spotFromBox() {
    const r = room();
    spot = {
      fx: r.x ? Math.round((parseFloat(box.style.left) - EDGE) / r.x * 1000) / 1000 : 1,
      fy: r.y ? Math.round((parseFloat(box.style.top) - EDGE) / r.y * 1000) / 1000 : 0
    };
  }

  /* ---- dragging by the title bar ---- */
  let drag = null;
  head.addEventListener('pointerdown', e => {
    if (e.target.closest('.eb-fold')) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    SW.ui.closeAllPopovers();
    const r = box.getBoundingClientRect();
    drag = { id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top };
    try { head.setPointerCapture(e.pointerId); } catch (err) {}
    box.classList.add('dragging');
  });
  head.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    moveTo(e.clientX - drag.dx, e.clientY - drag.dy);
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag = null;
    box.classList.remove('dragging');
    spotFromBox();
    remember();
  }
  head.addEventListener('pointerup', endDrag);
  head.addEventListener('pointercancel', endDrag);
  // a drag's click is not a tap on the song: a word being typed stays open
  head.addEventListener('click', e => e.stopPropagation());

  /* ---- folding up to the title bar ---- */
  function applyFold() {
    box.classList.toggle('folded', folded);
    foldBtn.setAttribute('aria-expanded', String(!folded));
    setTitle(foldBtn, folded ? 'Open the box' : 'Fold the box up');
  }
  foldBtn.addEventListener('click', e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    folded = !folded;
    applyFold();
    keepInView();
    if (box.style.left) spotFromBox();
    remember();
  });
  applyFold();

  // the box never takes the focus from a word being typed, or from the page's keys
  box.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });

  /* ================= wiring ================= */
  SW.bus.on('mode:changed', () => { if (S.editing) { render(); place(); } });
  ['selection', 'score:changed', 'score:loaded', 'layout:changed', 'policy:changed', 'key:changed',
   'edit:armed', 'staff:drawn', 'view:changed', 'words:typing'].forEach(evt => SW.bus.on(evt, schedule));
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(place, 60); });

  SW.editBox = { render, schedule };
})();

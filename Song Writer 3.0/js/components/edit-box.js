/* ==========================================================================
   COMPONENT — the Edit box                                       #edit-box
   --------------------------------------------------------------------------
   Every note tool in one box (it replaced the tools drawn around the
   selected note, and the value drawer in the toolbar), opened and closed
   from the rail beside it — THE RAIL below (the lock beside Play, and the
   construction hat before it, put it out until 2026-10-31):

     ┌──┬─────────────────────┐
     │‹ │ Edit|Chords   Piano │   the rail: the box's circle, the lock,
     │🔒├─────────────────────┤   Undo / Redo; the title: the panes and
     │  │ ✎ Lyrics            │   the keyboard on and off; Lyrics opens the
     │  ├─────────────────────┤   words window (index.html, score.js)
     │  │ RHYTHM     ◎ Colors │
     │↶ │ 𝅝   𝅗𝅥   ♩           │   the value circles (rhythm-panel.js),
     │↷ │   ♪   𝅘𝅥𝅯             │   the page's view toggle on the kicker
     │  │ • Dotted ‿ Tie 𝄽 Rest│   (the Notation page's box: BY PAGE below)
     │  │ NOTE                │
     │  │ ♯ Sharp   ♭ Flat    │   act on the selected note
     │  │ ⧉ Harmony       −   │   a note two steps above / take it away
     │  │                     │   (then ● ● + −: a circle a note, HARMONY)
     │  │ LINES               │
     │  │ ↰ Join up ↵ New line│   New line and Pick-up start a line AT
     │  │ ♪| Pick-up          │   the selected word (see below)
     │  │ 𝅘𝅥𝅯 ♪  ♩  𝅗𝅥 /  ♪. ♩. 𝅗𝅥.│
     └──┴─────────────────────┘

   2026-10-26 (the user: not needed any more): the Syllable section — its
   pill of dots with −, + Note/Syllable and + Note Only — and the Delete
   button are gone. The × and + on the selected note (note-tools.js) take
   a note away and add one; Delete / Backspace still delete the syllable
   in two presses (score.js handleDeleteClick, which says so in a toast).

   Nothing is drawn around the note, so the song does not move when the
   editing layer comes on (2026-10-08:
   except the × and + on the selected note's box — note-tools.js — which
   sit over the song and move nothing). Every button calls score.js — the
   same functions the keys call.

   PICK-UP (2026-10-01, the user's design; score.js PICK-UPS). On a word
   that is not in a pick-up, Pick-up starts a new line there (as New
   line does) opening with a pick-up worth the word's own length. In a
   pick-up the button is lit and reads Remove pick-up (the line joins
   back onto the one above), and the value chips appear under it, the lit
   one its value — tap another to change it. Out of a pick-up the chips
   are away (the user's call: less clutter), the one exception to the
   box's "still targets" rule.

   (The Staff notation switch that sat at the foot left on 2026-10-25,
   user: the Pitch · Notation · Rhythm switch at the top is the one place
   the staff goes on and off.)

   STILL TARGETS. What Layout settings or a lesson take away is removed
   (the family's rule); a tool that cannot act on the selection just now
   is only greyed, so the box never changes shape as the selection steps
   along and no button moves under a finger.

   WHERE IT SITS (2026-09-28, the user's call). No longer floating: it
   is the workspace's left column, from the top of the stage to the
   toolbar — the chord panel's place and the corner under it, beside the
   keyboard when that is out (style.css WORKSPACE). While the box is out,
   the chord panel itself (#chord-strip, the same element and all its
   wiring) sits in the box (#eb-chords), shown only when the title's
   switch says Chords (to play), and goes back beside the stage when the
   box closes (seatChords). The corner under it is away while it is out.
   (Until 2026-10-30 the panel also sat at the END of the Edit pane's
   scroll, pencils and all, to re-chord its places — the user took that
   section away: the Chord Chart and Focus change chords now.)
   (Until then it floated and was dragged by its title bar; its old
   place, song_writer_30_edit_box_v1, is no longer read.)

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
  const secWords = document.getElementById('eb-words');
  const empty = document.getElementById('eb-empty');
  // Lyrics (2026-10-31, the user): the toolbar's Write, moved to the top of the Edit pane on every
  // page — the same button (#textEditorBtn), so score.js opens the words window as it always did
  const lyricsBtn = document.getElementById('textEditorBtn');
  const can = what => SW.settings.can(what);


  const ICON = {
    harmony: '<svg viewBox="0 0 18 20" aria-hidden="true"><rect x="5.5" y="1" width="10" height="18" rx="2" fill="currentColor" stroke="none" opacity=".55"/><rect x="1.5" y="7" width="10" height="12" rx="2" fill="currentColor" stroke="none"/></svg>',
    pickup: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="7.5" cy="17" rx="3.4" ry="2.5" transform="rotate(-20 7.5 17)" fill="currentColor" stroke="none"/><path d="M10.6 16.2V4.5l3.6 3"/><path d="M19.5 3.5v17"/></svg>',
    newline: '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 10 4 15 9 20"/><path d="M20 5v10H4"/></svg>',
    join: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a4 4 0 0 1 0 8h-1"/></svg>'
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
  // the Note kicker is a row: on the Pitch page the page's Beats toggle sits on it (BY PAGE below)
  const noteKick = div('eb-kicker-row', secNote);
  kicker('Note', noteKick);
  const accRow = div('eb-row', secNote);
  const sharp = button('eb-btn', '<span class="eb-glyph">♯</span><span>Sharp</span>', 'Sharp', 'sharp', () => SW.score.handleAccidentalClick('sharp'));
  const flat = button('eb-btn', '<span class="eb-glyph">♭</span><span>Flat</span>', 'Flat', 'flat', () => SW.score.handleAccidentalClick('flat'));
  accRow.append(sharp, flat);
  // the Pitch page's Rest: the selected block goes quiet (grey), and back
  const restRow = div('eb-row', secNote);
  const pitchRest = button('eb-btn eb-rest', '<span class="eb-rest-pic" aria-hidden="true">' + SW.engrave.value('q', { height: 17, rest: true }) + '</span><span>Rest</span>', 'Rest', 'rest', () => SW.score.toggleRestOnCurrentNote());
  restRow.appendChild(pitchRest);
  /* HARMONY (2026-10-30, the user's design): the button reads Harmony
     until it is pressed; then, in its place, one circle per note of the
     harmony in that note's colour, low to high — tap one to pick it — and
     a small + for another note. The − takes the picked one away; with one
     note left the button is back. */
  const harmRow = div('eb-row', secNote);
  const harmAdd = button('eb-btn eb-harmony', ICON.harmony + '<span>Harmony</span>', 'Harmony — add a note two steps above', 'harmony+', () => SW.score.addHarmonyNote());
  const harmNotes = div('eb-harm-notes');
  harmNotes.setAttribute('role', 'group');
  harmNotes.setAttribute('aria-label', 'The notes of the harmony');
  const harmRemove = button('eb-btn eb-square', '−', 'Take the selected harmony note away', 'harmony-', () => SW.score.removeHarmonyNote());
  harmRow.append(harmAdd, harmNotes, harmRemove);
  let harmList = [];                 // the harmony's notes as drawn, low to high
  harmNotes.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    if (b.dataset.add) { SW.score.addHarmonyNote(); return; }
    const n = harmList[Number(b.dataset.i)];
    if (!n || !document.contains(n)) return;
    SW.score.setNoteAsActive(n, false);
    if (!n.classList.contains('rest-note')) SW.score.soundNote(n);
  });
  function harmCircles(stack, note, canAdd) {
    const M = SW.music;
    const midi = n => M.noteMidi(M.noteClassOf(n) || 'do', SW.score.getAccidentalFromNote(n));
    harmList = Array.from(stack.querySelectorAll('.note')).sort((a, b) => midi(a) - midi(b));
    let html = '';
    harmList.forEach((n, i) => {
      const rest = n.classList.contains('rest-note');
      const nc = M.noteClassOf(n) || 'do', acc = SW.score.getAccidentalFromNote(n);
      const name = M.solfegeOf(nc, acc) + ' · ' + SW.engrave.pitchName(M.spellNote(nc, acc)) + (rest ? ' (a rest)' : '');
      const c = rest ? '#525b64' : (n.style.backgroundColor || M.noteColour(nc) || '#9487A2');
      const on = n === note;
      const title = on ? name + ' — picked: − takes it away' : name + ' — tap to pick this note';
      html += '<button type="button" class="eb-harm-note' + (on ? ' on' : '') + '" data-i="' + i + '" style="--c:' + c + '" title="' + title + '" aria-label="' + title + '" aria-pressed="' + on + '"></button>';
    });
    if (canAdd) html += '<button type="button" class="eb-harm-add" data-add="1" title="Add another note to the harmony, two steps above the picked one" aria-label="Add another harmony note">+</button>';
    if (harmNotes.innerHTML !== html) harmNotes.innerHTML = html;
  }

  kicker('Lines', secWords);
  const grid = div('eb-grid', secWords);
  const join = button('eb-btn', ICON.join + '<span>Join up</span>', 'Join this line to the one above', 'join', () => SW.score.joinUp());
  const newline = button('eb-btn', ICON.newline + '<span>New line</span>', 'Start a new line at this word', 'newline', () => SW.score.newLineAfterCurrent());
  const pick = button('eb-btn eb-wide', ICON.pickup + '<span class="eb-pick-label">Pick-up</span>', 'Pick-up', 'pickup', () => SW.score.togglePickup());
  const pickLabel = pick.querySelector('.eb-pick-label');
  const chips = div('eb-chips eb-wide');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-label', 'What the pick-up is worth');
  grid.append(join, newline, pick, chips);

  /* the pick-up's values: the plain ones over their dotted ones (a value
     a bar long or more in this time is greyed, never taken away) */
  ['s', 'e', 'q', 'h', null, 'e.', 'q.', 'h.'].forEach(id => {
    if (!id) { div('eb-chip-gap', chips); return; }
    const c = button('eb-chip', SW.engrave.value(id, { height: 20 }), SW.values.byId(id).name, null, () => SW.score.makePickup(id));
    c.dataset.v = id;
    chips.appendChild(c);
  });

  /* ================= BY PAGE (2026-10-30, the user's call) =================
     Each page's box holds only what that page is for:

       PITCH      Note: ♯ ♭, Rest (the block goes grey), Harmony;
                  Lines: Join up, New line. No value circles, Dotted,
                  Tie or Pick-up — the page's Beats toggle moves onto
                  the Note kicker, since the Rhythm section is away.
       NOTATION   Rhythm (the value circles — no block circle — Dotted,
                  Tie, Rest), Note, Lines: as before.
       RHYTHM     Rhythm and Lines; no Note section. (No Chords tab
                  either until 2026-10-31: now it, and Piano, are on
                  every page.)

     The chords on the music are only edited in the Chords pane (the
     title's switch), and not while locked: in Edit they show, but no
     empty boxes and no cursor (chord-track.js canEdit). */
  const beatsHome = secValues.querySelector('.eb-kicker-row');
  function seatBeats(pg) {
    const b = document.getElementById('beats-btn');
    const home = pg === 'pitch' ? noteKick : beatsHome;
    if (b && home && b.parentNode !== home) home.appendChild(b);
  }

  /* ================= every tool, for the selection ================= */
  function render() {
    if (!isOpen()) return;
    const pg = SW.settings.page ? SW.settings.page() : 'notation';
    const note = SW.score.getActiveNote();
    const syl = note && note.closest('.syllable');
    const rest = !!note && note.classList.contains('rest-note');
    const typing = !!score.querySelector('.syllable.editing');     // a word open for typing (not always the selected one)

    secValues.hidden = pg === 'pitch';
    seatBeats(pg);

    // Note: ♯ ♭, the Pitch page's Rest, harmony (none of it on the Rhythm page)
    const accOn = can('accidentals'), harmOn = can('harmony'), restOn = pg === 'pitch' && can('rest');
    secNote.hidden = pg === 'rhythm' || (!accOn && !harmOn && !restOn);
    accRow.hidden = !accOn;
    restRow.hidden = !restOn;
    harmRow.hidden = !harmOn;
    const acc = note && !rest ? SW.score.getAccidentalFromNote(note) : null;
    sharp.disabled = flat.disabled = !note || rest;
    sharp.classList.toggle('on', acc === 'sharp');
    flat.classList.toggle('on', acc === 'flat');
    setTitle(sharp, acc === 'sharp' ? 'Sharp — tap again for natural' : 'Sharp');
    setTitle(flat, acc === 'flat' ? 'Flat — tap again for natural' : 'Flat');
    pitchRest.disabled = !note;
    pitchRest.classList.toggle('on', rest);
    pitchRest.setAttribute('aria-pressed', String(rest));
    setTitle(pitchRest, rest ? 'A rest — tap for the note again' : 'Rest — this block goes quiet (grey)');
    const harm = SW.score.harmonyState();
    const stack = note && note.closest('.harmony-stack');
    const many = harmOn && !!stack && harm.count > 1;
    harmAdd.hidden = many;
    harmNotes.hidden = !many;
    if (many) harmCircles(stack, note, harm.canAdd);
    else harmList = [];
    harmAdd.disabled = !harm.canAdd;
    harmRemove.disabled = !harm.canRemove;

    // Lines (not while a word is being typed: Space and ⌫ do that). No pick-up on the Pitch page.
    secWords.hidden = !can('structure');
    pick.hidden = pg === 'pitch';
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
    chips.hidden = !pk.on || pg === 'pitch';
    chips.querySelectorAll('.eb-chip').forEach(c => {
      const id = c.dataset.v, name = SW.values.byId(id).name.toLowerCase();
      const fits = pk.values.indexOf(id) !== -1;
      c.disabled = typing || !pk.can || !fits;
      c.classList.toggle('on', pk.value === id);
      setTitle(c, !fits ? 'A ' + name + ' is a bar or more in this time'
        : pk.value === id ? 'The pick-up is worth a ' + name : 'Make the pick-up worth a ' + name);
    });

    // the first section shown draws no rule above it — unless Lyrics is over it; with none, a hint
    const lyricsOn = !!lyricsBtn && !lyricsBtn.classList.contains('policy-off');
    const shown = [secValues, secNote, secWords].filter(s => !s.hidden && !s.classList.contains('policy-off'));
    [secValues, secNote, secWords].forEach(s => s.classList.toggle('eb-first', !lyricsOn && s === shown[0]));
    empty.hidden = shown.length > 0;
  }

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 24);
  }

  // the box never takes the focus from a word being typed, or from the page's keys
  box.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });

  /* ================= the chord panel's seat (the Chords pane) ================= */
  const chordsSlot = document.getElementById('eb-chords');
  function seatChords() {
    const strip = document.getElementById('chord-strip');
    const stage = document.getElementById('stage');
    if (!strip || !chordsSlot || !stage) return;
    if (isOpen()) { if (strip.parentNode !== chordsSlot) chordsSlot.appendChild(strip); }
    else if (strip.parentNode !== stage.parentNode) stage.parentNode.insertBefore(strip, stage);
  }

  /* ================= THE RAIL (2026-10-31, the user's design) =================
     The box is an accordion. A slim rail at the workspace's left edge
     holds its circle (› opens it, ‹ closes it) and, under it, a smaller
     circle: the lock. Then Undo and Redo (in the box's title until now:
     the title is Edit · Chords · Piano). Nothing on the rail moves when
     the box opens. The lock replaced the one beside Play.

         box out          view.editOpen     remembered
         lock             view.lockScore    off to start; View → Lock the score too

     From them, whether the NOTES can be changed (S.editing — every note
     and word tool asks it; score.js setEditing), and the CHORDS on the
     music (chordsEditable — chord-track.js canEdit):

                                   notes     chords on the music
         lock off                  yes       in the Chords tab
         lock on, Edit tab         yes       no (they show)
         lock on, Chords tab       NO        yes
         lock on, box away         no        no: click about, nothing changes

     The Chords tab with the lock on is for trying chords against a melody
     that must not move (2026-10-31, the user: "very important") — on the
     Pitch and Notation pages alike. The notes locked, the Rhythm page's
     circles go (body.notes-locked, style.css; rhythm-page.js draws them
     frozen), and Undo / Redo there only take back a step that leaves the
     melody as it is (history.js keepMelody). The Chords window — a
     double-click on a chord opens it — changes chords as ever, and the
     Piano plays either way. Present and a lesson that changes nothing put
     the rail away, and with it the box and editing. */
  const body = document.body;
  const foldBtn = document.getElementById('eb-fold');
  const lockBtn = document.getElementById('eb-lock-btn');
  const pianoBtn = document.getElementById('eb-piano');
  const view = () => SW.settings.view;
  let ready = false;                 // app.js start() calls init(), once the settings are read
  let wasOpen = false;
  const railOn = () => can('edit') && !S.present;
  function isOpen() { return ready && railOn() && !!view().editOpen; }
  function locked() { return !!view().lockScore; }
  function chordsEditable() { return pane() === 'chords' && can('chords'); }
  function sync() {
    if (!ready) return;
    const on = railOn(), open = isOpen(), lock = locked();
    body.classList.toggle('has-rail', on);
    body.classList.toggle('box-open', open);
    if (foldBtn) {
      foldBtn.setAttribute('aria-expanded', String(open));
      setTitle(foldBtn, open ? 'Close the Edit box' : 'Open the Edit box');
    }
    if (lockBtn) {
      lockBtn.classList.toggle('on', lock);
      lockBtn.setAttribute('aria-pressed', String(lock));
      setTitle(lockBtn, lock
        ? 'Locked — the notes only change in the Edit box’s Edit tab, the chords in its Chords tab. Tap to unlock'
        : 'Lock the score — then the notes only change in the Edit box’s Edit tab, the chords in its Chords tab');
    }
    seatChords();
    syncPane();
    syncPiano();
    const opened = open !== wasOpen;
    wasOpen = open;
    SW.score.setEditing(on && (!lock || (open && pane() === 'edit')));
    body.classList.toggle('notes-locked', on && lock && !S.editing);
    syncUndo();
    if (opened) SW.bus.emit('editbox:changed', { open });
    if (open) schedule();
  }
  function setOpen(on) {
    if (!railOn() || !!view().editOpen === !!on) { sync(); return; }
    SW.settings.setView({ editOpen: !!on });             // view:changed → sync
  }
  function setLocked(on) {
    if (locked() === !!on) return;
    SW.settings.setView({ lockScore: !!on });
    SW.ui.toast(on ? 'Locked: the notes change only in the Edit box’s Edit tab' : 'Unlocked: tap a note to change it');
  }
  if (foldBtn) foldBtn.addEventListener('click', e => { e.stopPropagation(); SW.ui.closeAllPopovers(); setOpen(!isOpen()); });
  if (lockBtn) lockBtn.addEventListener('click', e => { e.stopPropagation(); SW.ui.closeAllPopovers(); setLocked(!locked()); });
  // the rail never takes the focus from a word being typed either
  const railEl = document.getElementById('eb-rail');
  if (railEl) railEl.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });

  /* ---- Piano: the keyboard under the music, on and off (the only switch for it since 2026-11-01).
     It is the room's, not the box's: closing the box leaves it as it is. ---- */
  const dockAllowed = () => !SW.lessons || SW.lessons.shellAllows('dock');
  function syncPiano() {
    if (!pianoBtn) return;
    pianoBtn.hidden = !dockAllowed();
    const on = SW.settings.shows('dock');
    pianoBtn.classList.toggle('on', on);
    pianoBtn.setAttribute('aria-pressed', String(on));
    setTitle(pianoBtn, on ? 'Piano — tap to put the keyboard away' : 'Piano — the keyboard under the music');
  }
  if (pianoBtn) pianoBtn.addEventListener('click', e => {
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    if (dockAllowed()) SW.settings.setView({ showDock: !view().showDock });
  });

  /* ================= Undo / Redo (2.5, history.js) — on the rail =================
     While the notes can change, as ever. With only the chords changing
     (the locked Chords tab), only a step that leaves the melody as it is;
     the notes and the chords both locked, neither. ⌘Z comes here too (app.js). */
  const undoBtn = document.getElementById('eb-undo');
  const redoBtn = document.getElementById('eb-redo');
  function undoScope() { return S.editing ? {} : chordsEditable() ? { keepMelody: true } : null; }
  function syncUndo() {
    if (!undoBtn || !SW.history) return;
    const sc = undoScope();
    undoBtn.disabled = !sc || !SW.history.canUndo(sc);
    redoBtn.disabled = !sc || !SW.history.canRedo(sc);
  }
  function undoRedo(redo) {
    const sc = undoScope();
    if (!sc || !SW.history) return false;
    if (!(redo ? SW.history.canRedo(sc) : SW.history.canUndo(sc))) {
      if (sc.keepMelody && (redo ? SW.history.canRedo() : SW.history.canUndo())) SW.ui.toast('Locked: that ' + (redo ? 'Redo' : 'Undo') + ' would change the notes');
      return false;
    }
    if (S.playing) SW.player.stop();
    return redo ? SW.history.redo(sc) : SW.history.undo(sc);
  }
  if (undoBtn) {
    undoBtn.addEventListener('click', e => { e.stopPropagation(); undoRedo(false); });
    redoBtn.addEventListener('click', e => { e.stopPropagation(); undoRedo(true); });
    SW.bus.on('history:changed', syncUndo);
  }

  /* ================= Edit ↔ Chords (2.5) =================
     The switch in the title turns the box into the chord panel for
     PLAYING: the panel fills the box, without its pencils (chord-strip.js
     asks `editable()`), and the left hand's keys (F D S A G R E Q W,
     Z X C V B) play chords instead of writing solfège (settings.js
     panelOut, keymap.js). Everything else stays in Edit: the selection,
     the lane, Undo. */
  /* 2026-10-30 (the user): the Chords pane is also where the chords ON
     THE MUSIC are edited — the empty boxes, the cursor, dragging — and
     the Edit pane only shows them (chord-track.js canEdit); locked, the
     Chords pane changes them and the notes stay put (THE RAIL). 2026-10-31: on every page (the Rhythm page
     too: its panel plays, though that page draws no chord row), and
     the pane brings the panel with it (and since 2026-11-01, when Display
     Chord Panel left Options, it is the only way the panel comes out). Which pane is up is kept while the box is shut. */
  const paneSeg = document.getElementById('eb-pane');
  const titleEl = document.getElementById('eb-title');
  S.editPane = 'edit';
  let shownPane = 'edit';
  const chordsAvail = () => can('chordsListen');
  function pane() { return isOpen() && chordsAvail() && S.editPane === 'chords' ? 'chords' : 'edit'; }
  function syncPane() {
    const avail = chordsAvail(), p = pane();
    if (paneSeg) {
      paneSeg.hidden = !avail;
      paneSeg.querySelectorAll('[data-pane]').forEach(b => {
        const on = b.dataset.pane === p;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    }
    if (titleEl) titleEl.hidden = avail;
    body.classList.toggle('pane-chords', p === 'chords');
    if (p !== shownPane) { shownPane = p; SW.bus.emit('editpane:changed', { pane: p }); }
  }
  function setPane(p) {
    S.editPane = p === 'chords' ? 'chords' : 'edit';
    sync();                          // locked, the pane decides whether the notes can change
  }
  if (paneSeg) paneSeg.addEventListener('click', e => {
    const b = e.target.closest('[data-pane]');
    if (!b) return;
    e.stopPropagation();
    SW.ui.closeAllPopovers();
    setPane(b.dataset.pane);
    if (pane() === 'edit') render();
  });

  /* ================= wiring ================= */
  ['view:changed', 'policy:changed', 'present:changed', 'layout:changed'].forEach(evt => SW.bus.on(evt, sync));
  SW.bus.on('mode:changed', syncUndo);
  ['selection', 'score:changed', 'score:loaded', 'layout:changed', 'policy:changed', 'key:changed', 'meter:changed',
   'staff:drawn', 'view:changed', 'words:typing'].forEach(evt => SW.bus.on(evt, schedule));

  function init() { ready = true; sync(); }
  SW.editBox = { render, schedule, pane, setPane, isOpen, setOpen, setLocked, locked, chordsEditable, undoRedo, sync, init };
})();

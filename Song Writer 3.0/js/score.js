/* ==========================================================================
   Song Writer — score.js
   --------------------------------------------------------------------------
   The score editor: Song Writer 1.0's editing engine, ported function for
   function. The 1.0 names are kept (setNoteAsActive, duplicateCurrentNote,
   finishTextEditAndAdvance …) so the two can be read side by side.

   What changed, and why:

   • THE DOM IS THE WORKING COPY, THE MODEL IS THE RECORD. As in 1.0,
     editing works directly on the elements. What is stored is no longer a
     text string but a JSON score (see MODEL below) read back from the
     elements after each edit; the 1.0 text format lives on in Your words
     ("Words and notes") and as the import format for 1.0 songs.

   • ONE CLICK LISTENER. 1.0 hung listeners on every note, syllable and
     word. A section copied with the ABA "duplicate" button (now ⧉ on the
     section head) was cloned, and
     its notes lost their listeners — so a note in a copied section could
     not be clicked on its own. One delegated listener on the score reads
     the target instead, and copies behave like originals.

   • SIZE COMES FROM CSS. Bars are `calc(height * var(--bs))`, so the
     View popover's block size needs no JavaScript; a harmony stack's height
     travels as `--stack-h` for the same reason.

   • NEW 2026-09-27: the song's `scale` and its chord `board` (js/chords.js)
     — the scale beside the key, the re-chorded places on the panel.
   • NEW, per the 2.0 scaffold: a chord symbol per syllable (data-chord,
     drawn in the .chord-slot above it by chord-lane.js), and the
     Layout-settings / lesson gates in can().

   • BLOCKS AND NOTES. A column (.harmony-stack) is either a BLOCK — pitch
     only, its length still to be decided — or a NOTE: a block that has
     been given a value (data-v, the model's `v`, the text format's `:q`)
     and is written on the staff in its place (js/staff.js). A 1.0 song
     has no values, so every column of it is a block. For bar lines and
     playback a block counts as one beat until it is written
     (js/timing.js). The staff panel's Value circles write a block;
     its "block" choice unwrites a note.

   MODEL
     { v: 2, key: 'C', meter: '3/4', bpm: 96,             // both omitted when 4/4 · 100
       lines: [ { label: 'A',
                  syllables: [ { text: 'Twin', chord: 'I',
                                 hy: true,                     // the word goes on in the next syllable (WORDS IN SYLLABLES)
                                 cols: [ { v: 'h',             // omitted = a block
                                           notes: [ { n: 'do', acc: 'sharp', rest: true } ] } ] } ] } ] }

   TEXT FORMAT (1.0's, extended; a 1.0 song parses unchanged)
     [Key of C]
     [Time 3/4]                                            (optional; [Tempo 96] likewise)
     [A]
     {I}Twin-[D1] kle[D1:q] {V}twin-[S1,S1:e] kle[S1+M1:h] rest[D1~]
                                                           (a - after the word: it goes on in the next one)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const A = SW.audio;
  const { noteOrder, noteToSolfege, noteToShorthandMap, shorthandToNoteMap, NOTE_HEIGHTS, LINE_COLORS } = M;

  const $ = id => document.getElementById(id);

  /* ---- elements ----
     There is no edit ribbon. The hat (#editToggle) beside Play is the
     editing layer's switch; the tools that act on the selected note are
     in the floating Edit box (js/components/edit-box.js), which calls the
     functions below; the section tools are on each line's head. */
  const notationContainer = $('score');
  const stageEl = $('stage');
  const textEditorBtn = $('textEditorBtn');
  const editToggleBtn = $('editToggle');
  const textEditorText = $('textEditorText');

  /* ---- 1.0's editing state ---- */
  let currentNoteIndex = -1;
  let currentSyllableIndex = -1;
  let currentRowTop = null;
  let navigationOffEndState = null;
  let currentlyEditingText = null;
  let currentEditingIndex = -1;
  let isAdvancingToNext = false;
  let deleteConfirmationState = false;   // × (or Delete) pressed once: the next press deletes
  let deleteTimer = null;
  let pendingSectionToDelete = null;
  let wordsView = 'words';                 // the Your words sheet: 'words' | 'notes'
  let noteClickAudioTimer = null;

  const DONT_ASK_DELETE_SECTION_KEY = 'song_writer_30_skip_delete_section_confirm';

  /* ------------------------------------------------------------------
     GATES — what the room lets you build (Layout settings) and what the
     lesson lets you change. Asked at the moment of the edit, so a key
     press and a button press obey the same rule. The buttons themselves
     are removed by settings.js, not disabled (Rhythm Poetry's rule 2).
     ------------------------------------------------------------------ */
  function can(what) { return !SW.settings || SW.settings.can(what); }
  function allowedNotes() {
    return (SW.settings && SW.settings.allowedNotes) ? SW.settings.allowedNotes() : noteOrder;
  }

  /* After every edit: tell the components, then save (the library decides
     whether auto-save lets it through). 1.0 called saveCurrentSongToLibrary
     at exactly these points; this is that call. */
  function changed(reason) {
    // on the Pitch page a word's syllables sit together (WORDS IN SYLLABLES) — once the typing is done
    if (!currentlyEditingText && !isAdvancingToNext) joinWords();
    SW.bus.emit('score:changed', { reason: reason || 'edit' });
    if (SW.library) SW.library.save();
  }

  /* ================= UTILITY ================= */
  function getAllSyllables() { return notationContainer.querySelectorAll('.syllable'); }
  function getAllHarmonyStacks() {
    const stacks = Array.from(notationContainer.querySelectorAll('.harmony-stack'));
    if (stacks.length > 0) return stacks;
    return Array.from(notationContainer.querySelectorAll('.note'));
  }
  function getAllNotes() { return notationContainer.querySelectorAll('.note'); }

  function getActiveNote() {
    const selected = notationContainer.querySelector('.note.selected-note');
    if (selected) {
      const idx = Array.from(getAllNotes()).indexOf(selected);
      if (idx >= 0) currentNoteIndex = idx;
      return selected;
    }
    const notes = getAllNotes();
    if (currentNoteIndex >= 0 && currentNoteIndex < notes.length) return notes[currentNoteIndex];
    return null;
  }

  /* 1.0 scrolled the window so a syllable on a new visual row sat just
     under the middle of the screen. The score now scrolls inside the
     stage, so the same idea is measured against the stage. */
  function scrollToSyllable(syllable) {
    if (!syllable || !stageEl) return;
    if (SW.settings && SW.settings.view && SW.settings.view.followScroll === false) return;
    if (document.body.classList.contains('page-rhythm')) return;     // the Rhythm page follows on its own (rhythm-page.js)
    const r = syllable.getBoundingClientRect();
    if (currentRowTop === null || Math.abs(r.top - currentRowTop) > 10) {
      currentRowTop = r.top;
      const sr = stageEl.getBoundingClientRect();
      const bottomInStage = stageEl.scrollTop + (r.bottom - sr.top);
      stageEl.scrollTo({ top: bottomInStage - stageEl.clientHeight * 0.58, behavior: 'smooth' });
    }
  }

  function resetAccidentalToggleVisuals() {
    S.accidentalMode = 'natural';
  }
  /* The Edit box's ♯ ♭ buttons show the selected block's own accidental, so
     they read as the note's state rather than a mode left over. */
  function syncAccidentalToggle(note) {
    S.accidentalMode = note ? getAccidentalFromNote(note) : 'natural';
  }
  /* Two presses to delete a syllable (1.0's rule): the first arms it for
     three seconds and says so in a toast (the Edit box's red Delete button
     that showed it is gone, 2026-10-26). */
  function resetDeleteConfirmation() {
    clearTimeout(deleteTimer);
    if (!deleteConfirmationState) return;
    deleteConfirmationState = false;
    SW.bus.emit('edit:armed', { armed: false });
  }

  /* ================= LINES ================= */
  /* 1.0 set a min-height from the tallest bar. Headroom for the letter
     names is now padding on each syllable, so only an empty line needs a
     height of its own. Kept as a function because 1.0 called it after
     every structural edit, and those calls are where a future
     measure-based layout will hook in. */
  function updateLineHeight(line) {
    if (!line) return;
    line.classList.toggle('is-empty', line.querySelectorAll('.note').length === 0);
  }
  function updateAllLineHeights() { notationContainer.querySelectorAll('.notation-line').forEach(updateLineHeight); }

  function updateLineBackgrounds() {
    notationContainer.querySelectorAll('.notation-line').forEach((line, index) => {
      line.style.backgroundColor = S.colorScheme ? LINE_COLORS[index % LINE_COLORS.length] : '#ffffff';
    });
  }

  /* ================= PITCH =================
     Every way of choosing a pitch follows the song's scale (core.js THE
     SCALE): ↑ ↓ walk the scale's notes, a letter key writes its step the
     way the scale has it (in C minor D is me), a harmony note is two
     scale steps up. The ♯ ♭ buttons stay 1.0's, counted from major. */

  /* Put a block on a rung with an accidental, and redraw what shows it. */
  function setNotePitch(noteElement, noteClass, accidental) {
    const current = M.noteClassOf(noteElement);
    if (current && current !== noteClass) noteElement.classList.remove(current);
    noteElement.classList.add(noteClass);
    addAccidentalToNote(noteElement, accidental || 'natural');
    updateNoteDisplay(noteElement, noteClass);
  }
  /* the scale's notes on the allowed rungs; the whole eighteen when the
     range holds none of them (a lesson range built for another scale) */
  function ladder(id) {
    const l = M.scaleLadder(allowedNotes(), id);
    return l.length ? l : M.scaleLadder(noteOrder, id);
  }

  /* ---- each scale's own version of a note ----
     A note is its STEP — the rung the melody puts it on (fa, so′) — plus,
     for any scale where it was fine-tuned with ♯ or ♭, that scale's own
     pitch. Everywhere else the scale decides (defaultPitch). So the Star-
     Spangled Banner's raised fa (fi) belongs to major only: in minor that
     note is minor's fa, and back in major it is fi again.
       data-step   the step, when the block shows another rung (fa shown
                   as mi in major pentatonic, which has no fa)
       data-alt    {"major":"fa|sharp"} — the fine-tuned versions, the
                   current scale's included
     Moving a note (↑ ↓, a letter key, the keyboard) rewrites the melody:
     the new pitch is the note in every scale. ♯ ♭ fine-tune it in the
     current scale only. Changing scale shows each note's version for the
     new scale (morphToScale). */
  function stepOf(note) { return note.dataset.step || M.noteClassOf(note) || 'do'; }
  function altsOf(note) {
    try { return note.dataset.alt ? JSON.parse(note.dataset.alt) : {}; } catch (e) { return {}; }
  }
  function setAlts(note, alts) {
    if (Object.keys(alts).length) note.dataset.alt = JSON.stringify(alts);
    else delete note.dataset.alt;
  }
  const packPitch = p => p.nc + '|' + p.acc;
  function unpackPitch(str) {
    const [nc, acc] = String(str).split('|');
    return noteOrder.indexOf(nc) !== -1 ? { nc, acc: acc === 'sharp' || acc === 'flat' ? acc : 'natural' } : null;
  }
  /* What a scale does with a step: its own alteration of it; a step it
     skips lands on its nearest note (the lower of two as near), found from
     the step as the scale's parent would have it (MORPH below). */
  function defaultPitch(step, id) {
    const num = M.STEP_OF[noteToSolfege[step]];
    const alter = M.stepAlters(id)[num];
    if (alter !== undefined) return { nc: step, acc: M.accOf(Math.max(-1, Math.min(1, alter))) };
    const midi = M.noteMidi(step, M.accOf(frameOf(id)[num]));
    const near = ladder(id).reduce((best, n) => {
      if (!best) return n;
      const d = Math.abs(n.midi - midi), bd = Math.abs(best.midi - midi);
      return d < bd || (d === bd && n.midi < best.midi) ? n : best;
    }, null);
    return near ? { nc: near.nc, acc: near.acc } : { nc: step, acc: 'natural' };
  }
  /* the note in a scale: its fine-tuned version there, or the scale's own */
  function pitchIn(note, id) {
    return unpackPitch(altsOf(note)[id]) || defaultPitch(stepOf(note), id);
  }
  /* After ♯ ♭ (or loading): the block's pitch is the current scale's
     version — kept as a fine-tuning if it is not what the scale would give. */
  function remember(note) {
    const nc = M.noteClassOf(note);
    if (!nc) return;
    const cur = { nc, acc: getAccidentalFromNote(note) };
    const def = defaultPitch(stepOf(note), S.scale);
    const alts = altsOf(note);
    if (def.nc === cur.nc && def.acc === cur.acc) delete alts[S.scale];
    else alts[S.scale] = packPitch(cur);
    setAlts(note, alts);
    if (note.dataset.step === nc) delete note.dataset.step;
  }
  /* After a move: this pitch is the note now, in every scale. */
  function rewrite(note) {
    delete note.dataset.step;
    delete note.dataset.alt;
    remember(note);
  }
  function memoryOf(note) { return { step: stepOf(note), alt: altsOf(note) }; }
  function playPitch(noteElement, noteClass, accidental) {
    if (noteElement.classList.contains('rest-note')) return;
    const frequency = A.getModifiedFrequency(noteClass, accidental || 'natural', S.key);
    if (frequency !== null) A.playNote(frequency);
  }

  function handleSolfegeKeyInput(key) {
    if (!S.editing || currentNoteIndex < 0) return false;
    const noteClass = M.solfegeKeyMap[String(key).toLowerCase()];
    if (!noteClass) return false;
    if (!can('pitch')) return false;
    if (allowedNotes().indexOf(noteClass) === -1) {
      SW.ui.toast('That note is outside the range in Layout settings');
      return true;
    }
    const activeNote = getActiveNote();
    if (!activeNote) return false;
    // the step as the scale has it (the one nearest natural if it has two);
    // a step the scale skips is written as major has it, outside the scale
    const num = M.STEP_OF[noteToSolfege[noteClass]];
    const alter = M.stepAlters()[num];
    const acc = alter === undefined ? 'natural' : M.accOf(Math.max(-1, Math.min(1, alter)));
    if (alter === undefined) {
      const sc = M.scaleOf();
      SW.ui.toast(noteToSolfege[noteClass] + ' is not in ' + (sc ? sc.name : 'this scale') + ' — written as an outside note');
    }
    setNotePitch(activeNote, noteClass, acc);
    rewrite(activeNote);
    syncAccidentalToggle(activeNote);
    playPitch(activeNote, noteClass, acc);
    const harmonyStack = activeNote.closest('.harmony-stack');
    if (harmonyStack) updateHarmonyStackVisuals(harmonyStack);
    const idx = Array.from(getAllNotes()).indexOf(activeNote);
    if (idx >= 0) currentNoteIndex = idx;
    updateLineHeight(activeNote.closest('.notation-line'));
    emitSelection(false);
    changed('pitch');
    return true;
  }

  /* 1.0: changeNote. Up and down walk the scale's notes inside the allowed
     range and wrap round, as 1.0 wrapped over all eighteen. A note outside
     the scale steps to the nearest scale note that way. */
  function changeNote(noteElement, direction, playSound) {
    if (!can('pitch')) return;
    const currentNoteClass = M.noteClassOf(noteElement);
    if (!currentNoteClass) return;
    const up = direction !== 'down';
    const steps = ladder();
    if (!steps.length) return;
    const cur = M.noteMidi(currentNoteClass, getAccidentalFromNote(noteElement));
    const next = up
      ? (steps.find(n => n.midi > cur) || steps[0])
      : (steps.slice().reverse().find(n => n.midi < cur) || steps[steps.length - 1]);
    setNotePitch(noteElement, next.nc, next.acc);
    rewrite(noteElement);
    syncAccidentalToggle(noteElement);
    const harmonyStack = noteElement.closest('.harmony-stack');
    if (harmonyStack) updateHarmonyStackVisuals(harmonyStack);
    const idx = Array.from(getAllNotes()).indexOf(noteElement);
    if (idx >= 0) currentNoteIndex = idx;
    if (playSound !== false) playPitch(noteElement, next.nc, next.acc);
    updateLineHeight(noteElement.closest('.notation-line'));
    emitSelection(false);
    changed('pitch');
  }

  /* Set a block to a pitch given as MIDI — the keyboard dock uses this.
     Finds the rung (and ♯/♭, within 1.0's accidental rules) that sounds
     that pitch in the current key, spelled as the scale spells it (fi in
     Lydian, se in Locrian and blues, si in whole tone); a pitch outside
     the scale takes the usual chromatic name (ra me le te, fi). Returns
     false if no allowed rung can sound it. */
  function setActiveNoteMidi(midi) {
    if (!S.editing || !can('pitch')) return false;
    const note = getActiveNote();
    if (!note) return false;
    const allowed = allowedNotes();
    const tonic = M.KEY_SIGNATURES_CHROMATIC_INDEX[S.key] || 0;
    const rel = ((midi - tonic) % 12 + 12) % 12;
    const sc = M.scaleOf();
    const wanted = (typeof Theory !== 'undefined') ? Theory.parseDegree(Theory.semisToDegree(rel, sc ? sc.degrees : [])) : null;
    const tries = [];
    if (wanted && (can('accidentals') || wanted.alter === 0)) tries.push({ num: wanted.num, acc: M.accOf(wanted.alter) });
    (!can('accidentals') ? ['natural'] : rel === 6 ? ['natural', 'sharp', 'flat'] : ['natural', 'flat', 'sharp'])
      .forEach(acc => tries.push({ num: null, acc }));
    let found = null;
    for (const t of tries) {
      for (const nc of allowed) {
        const sol = noteToSolfege[nc];
        if (t.num !== null && M.STEP_OF[sol] !== t.num) continue;
        if (M.noteMidi(nc, t.acc) !== midi) continue;
        if (t.acc === 'flat' && (sol === 'Do' || sol === 'Fa')) continue;
        if (t.acc === 'sharp' && (sol === 'Mi' || sol === 'Ti')) continue;
        found = { nc, acc: t.acc };
        break;
      }
      if (found) break;
    }
    if (!found) return false;
    setNotePitch(note, found.nc, found.acc);
    rewrite(note);
    syncAccidentalToggle(note);
    const stack = note.closest('.harmony-stack');
    if (stack) updateHarmonyStackVisuals(stack);
    emitSelection(false);
    changed('pitch');
    return true;
  }

  /* ================= ACCIDENTALS ================= */
  function addAccidentalToNote(noteElement, accidentalType) {
    const existing = noteElement.querySelector('.accidental-symbol');
    if (existing) existing.remove();
    if (accidentalType === 'sharp' || accidentalType === 'flat') {
      const span = document.createElement('span');
      span.className = 'accidental-symbol';
      span.textContent = accidentalType === 'sharp' ? '♯' : '♭';
      noteElement.appendChild(span);
    }
    paintNoteNames(noteElement);
  }
  function removeAccidentalFromNote(noteElement) { addAccidentalToNote(noteElement, 'natural'); }
  function getAccidentalFromNote(noteElement) {
    const sym = noteElement.querySelector('.accidental-symbol');
    if (!sym) return 'natural';
    return sym.textContent === '♯' ? 'sharp' : 'flat';
  }
  function applyActiveAccidentalToCurrentNote() {
    if (!S.editing || currentNoteIndex < 0) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    addAccidentalToNote(activeNote, S.accidentalMode);
    remember(activeNote);                      // this scale's version only
    const noteClass = M.noteClassOf(activeNote);
    if (noteClass && !activeNote.classList.contains('rest-note')) {
      const frequency = A.getModifiedFrequency(noteClass, S.accidentalMode, S.key);
      if (frequency !== null) A.playNote(frequency);
    }
    emitSelection(false);
    changed('accidental');
  }
  /* 1.0's click handler for the ♭/♯ toggle, rules included: do and fa
     cannot be flat, mi and ti cannot be sharp. */
  function handleAccidentalClick(intended) {
    if ((intended !== 'sharp' && intended !== 'flat') || !S.editing || currentNoteIndex < 0 || !can('accidentals')) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    syncAccidentalToggle(activeNote);
    const sol = noteToSolfege[M.noteClassOf(activeNote)];
    if (S.accidentalMode !== intended) {
      if (intended === 'flat' && (sol === 'Do' || sol === 'Fa')) { SW.ui.toast(sol + ' cannot be flat'); return; }
      if (intended === 'sharp' && (sol === 'Mi' || sol === 'Ti')) { SW.ui.toast(sol + ' cannot be sharp'); return; }
    }
    S.accidentalMode = S.accidentalMode === intended ? 'natural' : intended;
    applyActiveAccidentalToCurrentNote();
  }

  /* ================= COLOUR & NAMES =================
     A block's colour is its letter's (1.0's palette); its names are its
     own pitch: the letter spelled with its ♯/♭ (B♭, not B) and solfège
     with Do on the tonic (ra me fi se le te — core.js solfegeOf). */
  function paintNoteNames(noteElement) {
    const noteClass = M.noteClassOf(noteElement);
    if (!noteClass) return;
    const acc = getAccidentalFromNote(noteElement);
    const letterEl = noteElement.querySelector('.letter-name');
    if (letterEl) letterEl.textContent = M.noteLetter(noteClass, acc);
    const solEl = noteElement.querySelector('.solfege-name');
    if (solEl) solEl.textContent = M.solfegeOf(noteClass, acc).toLowerCase();
  }
  function updateNoteDisplay(noteElement, noteClass) {
    noteClass = noteClass || M.noteClassOf(noteElement);
    if (!noteClass) return;
    const color = M.noteColour(noteClass);
    const isRest = noteElement.classList.contains('rest-note');
    if (!isRest && color) noteElement.style.backgroundColor = color;
    const letterEl = noteElement.querySelector('.letter-name');
    if (letterEl && !isRest) letterEl.style.color = color;
    paintNoteNames(noteElement);
  }
  function applyNoteColors() {
    notationContainer.querySelectorAll('.note').forEach(n => updateNoteDisplay(n));
  }

  /* ================= SECTIONS =================
     1.0's ABA section manager, without its mode: each line's section
     head (the name in the corner) carries Ostinato Builder's track-head
     tools in Edit — ▲ ▼ move the line, ⧉ copies it below, × deletes it
     (1.0's window, with "Don't show this message again"). The CSS shows
     them on the line you point at, or the one holding the selection. */
  const HEAD_ICONS = {
    up: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
    del: '<svg viewBox="0 0 24 24" aria-hidden="true" style="stroke-width:2.6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
  };
  function headTool(kind, title, lineElement, onClick, extra) {
    const b = document.createElement('button');
    b.className = 'head-tool' + (extra ? ' ' + extra : '');
    b.type = 'button';
    b.dataset.head = kind;
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = HEAD_ICONS[kind];
    b.addEventListener('click', e => { e.stopPropagation(); onClick(lineElement); });
    return b;
  }
  function createLineHead(lineElement) {
    const head = document.createElement('div');
    head.className = 'line-head';
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.className = 'line-label';
    labelInput.placeholder = 'Name';
    labelInput.maxLength = 15;
    labelInput.setAttribute('aria-label', 'Section name');
    labelInput.readOnly = !labelEditable();
    labelInput.addEventListener('click', e => e.stopPropagation());
    labelInput.addEventListener('input', () => { sizeLabel(labelInput); changed('label'); });
    labelInput.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); labelInput.blur(); } });
    head.appendChild(headTool('up', 'Move this line up', lineElement, l => moveSection(l, 'up')));
    head.appendChild(headTool('down', 'Move this line down', lineElement, l => moveSection(l, 'down')));
    head.appendChild(labelInput);
    head.appendChild(headTool('copy', 'Copy this line below', lineElement, duplicateSection));
    head.appendChild(headTool('del', 'Delete this line', lineElement, requestDeleteSection, 'danger'));
    return head;
  }
  /* The name chip is as wide as its name. */
  function sizeLabel(input) {
    if (!input) return;
    const n = Math.max(input.value.length, input.value ? 1 : 4);
    input.style.width = 'calc(' + (n + 1.2) + 'ch + 16px)';
  }
  /* D16: a section's name is typed into in Edit only. */
  function labelEditable() { return S.editing && can('words'); }

  function moveSection(lineElement, direction) {
    if (!S.editing || !can('sections')) return;
    const lines = Array.from(notationContainer.querySelectorAll('.notation-line'));
    const index = lines.indexOf(lineElement);
    if (index < 0) return;
    if (!(direction === 'up' && index > 0) && !(direction === 'down' && index < lines.length - 1)) return;
    // a word that ran on over the line's edges is cut there (its hyphen goes)
    endWordAt(lines[index - 1]);
    endWordAt(lineElement);
    if (direction === 'up') notationContainer.insertBefore(lineElement, lines[index - 1]);
    else lines[index + 1].after(lineElement);
    const before = lineElement.previousElementSibling;
    if (before && before.classList.contains('notation-line')) endWordAt(before);
    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    changed('section');
    const active = getActiveNote();
    if (active) emitSelection(false);
  }

  function duplicateSection(lineElement) {
    if (!lineElement || !S.editing || !can('sections')) return;
    const labelInput = lineElement.querySelector('.line-label');
    const newLine = createNewLineElement(true);
    const newLabel = newLine.querySelector('.line-label');
    if (newLabel && labelInput) { newLabel.value = labelInput.value; sizeLabel(newLabel); }
    if (lineElement.dataset.pickup) newLine.dataset.pickup = lineElement.dataset.pickup;
    lineElement.querySelectorAll(':scope > .syllable').forEach(syllable => {
      const clone = syllable.cloneNode(true);
      clone.classList.remove('highlighted', 'editing', 'sounding');
      clone.querySelectorAll('.chord-slot.chosen').forEach(c => c.classList.remove('chosen'));
      clone.querySelectorAll('.note').forEach(n => n.classList.remove('highlighted', 'selected-note'));
      newLine.appendChild(clone);
    });
    lineElement.after(newLine);
    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    changed('section');
    const first = newLine.querySelector('.note');
    if (first) setNoteAsActive(first, true);
  }

  function requestDeleteSection(lineElement) {
    if (!lineElement || !S.editing || !can('sections')) return;
    let skip = false;
    try { skip = localStorage.getItem(DONT_ASK_DELETE_SECTION_KEY) === 'true'; } catch (e) {}
    if (skip) { executeDeleteSection(lineElement); return; }
    pendingSectionToDelete = lineElement;
    const labelInput = lineElement.querySelector('.line-label');
    const label = labelInput && labelInput.value.trim();
    const prompt = $('deleteSectionPromptText');
    if (prompt) prompt.textContent = label ? 'Delete section “' + label + '”?' : 'Delete this section?';
    const box = $('dontAskDeleteSectionCheckbox');
    if (box) box.checked = false;
    SW.ui.openSheet('deleteSectionModal');
  }
  function hideDeleteSectionModal() {
    SW.ui.closeSheet('deleteSectionModal');
    pendingSectionToDelete = null;
  }
  function confirmDeleteSection() {
    const box = $('dontAskDeleteSectionCheckbox');
    if (box && box.checked) {
      try { localStorage.setItem(DONT_ASK_DELETE_SECTION_KEY, 'true'); } catch (e) {}
    }
    if (pendingSectionToDelete) executeDeleteSection(pendingSectionToDelete);
    hideDeleteSectionModal();
  }

  function executeDeleteSection(lineElement) {
    if (!lineElement) return;
    const lines = notationContainer.querySelectorAll('.notation-line');
    if (lines.length <= 1) {
      // the only line empties instead (2.0)
      lineElement.querySelectorAll(':scope > .syllable, :scope > .row-break').forEach(s => s.remove());
      const newSyllable = createNewSyllable();
      lineElement.appendChild(newSyllable);
      const labelInput = lineElement.querySelector('.line-label');
      if (labelInput) { labelInput.value = ''; sizeLabel(labelInput); }
      setSyllableAsActive(newSyllable);
    } else {
      const own = lineElement.querySelectorAll(':scope > .syllable');
      const runsOn = own.length && own[own.length - 1].dataset.hy;
      const before = lineElement.previousElementSibling;
      if (!runsOn && before && before.classList.contains('notation-line')) endWordAt(before);
      lineElement.remove();
      const remaining = getAllNotes();
      if (remaining.length > 0) {
        if (currentNoteIndex >= remaining.length) currentNoteIndex = remaining.length - 1;
        setNoteAsActive(remaining[Math.max(0, currentNoteIndex)], true);
      } else {
        currentNoteIndex = -1;
        currentSyllableIndex = -1;
        emitSelection(false);
      }
    }
    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    changed('section');
  }

  /* ▲ on the first line and ▼ on the last do nothing, so they fade. */
  function updateSectionActionButtonsState() {
    const lines = Array.from(notationContainer.querySelectorAll('.notation-line'));
    lines.forEach((line, index) => {
      if (!line.querySelector(':scope > .line-head')) line.insertBefore(createLineHead(line), line.firstChild);
      const up = line.querySelector('.head-tool[data-head="up"]');
      const down = line.querySelector('.head-tool[data-head="down"]');
      if (up) up.disabled = index === 0;
      if (down) down.disabled = index === lines.length - 1;
    });
  }

  /* ---- lines made and joined (new) ---- */

  /* "Add a line" at the end of the song (Ostinato Builder's Add row):
     an untitled line holding one "-" syllable on do, selected. */
  function appendEmptyLine() {
    if (!S.editing || !can('structure')) return null;
    const line = createNewLineElement(true);
    const syl = createNewSyllable();
    line.appendChild(syl);
    notationContainer.appendChild(line);
    updateLineBackgrounds();
    updateLineHeight(line);
    updateSectionActionButtonsState();
    setSyllableAsActive(syl);
    changed('line');
    return line;
  }

  /* ↰ on the first word of a line: Rhythm Poetry's rejoin, so a stray ↵
     can be undone. The words move to the end of the line above, which
     keeps its own name. */
  function joinLineWithPrevious(line) {
    if (!S.editing || !can('structure') || !line) return false;
    const prev = line.previousElementSibling;
    if (!prev || !prev.classList.contains('notation-line')) return false;
    const active = getActiveNote();
    line.querySelectorAll(':scope > .syllable').forEach(s => prev.appendChild(s));
    line.remove();
    prev.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    if (active && document.contains(active)) setNoteAsActive(active, false);
    changed('line');
    return true;
  }

  /* ================= PICK-UPS =================
     A pick-up is a line's own (2026-10-01, the user's design; timing.js
     PICK-UP): the line's `data-pickup` is the value it is worth ('e',
     'q.', …), `lines[].pickup` in the model.
       • Pick-up in the Edit box (Words & lines), on a selected note: like
         New line, a new line starts at that note's word — and opens with
         a pick-up. On a line's first word the line itself takes one.
         It is worth that word's own length when that is a value (one
         eighth note: an eighth), else a beat; the rhythm chips under the
         button choose another — or make one straight away at that value.
         The notes are not touched: the bar line falls after that much.
       • With the selection in a pick-up (a word that starts inside it)
         the button is lit, the chips show its value and change it, and
         the button takes it away: the line joins back onto the line
         above, as Join up does (the first line just starts on the
         downbeat). The × on its bar line (staff.js, Edit) does the same.
       • Layout settings → Pick-up switches the FIRST line's.
     (Until 2026-10-01 the song had one switch, a beat on every line, and
     Join up / Delete on a pick-up moved or deleted just that beat.) */
  function previousLine(line) {
    const prev = line && line.previousElementSibling;
    return prev && prev.classList.contains('notation-line') ? prev : null;
  }
  function selectedSyllable() {
    const note = (S.editing && currentNoteIndex >= 0) ? getActiveNote() : null;
    return note ? note.closest('.syllable') : null;
  }
  const barTicks = () => SW.meters.byId(S.meter).barTicks;
  /* The values a pick-up can be worth in this time: shorter than a bar,
     shortest first. */
  function pickupValues() {
    return SW.values.LIST.filter(v => v.ticks < barTicks()).map(v => v.id).reverse();
  }
  /* The line whose pick-up the syllable starts in, or null. */
  function pickupAt(syl) {
    const line = syl && syl.closest('.notation-line');
    if (!line || !SW.timing.linePickup(line)) return null;
    const le = SW.timing.lineEvents(line);
    const ev = le.events.find(e => e.syllable === syl);
    return ev && ev.start < le.pickup ? line : null;
  }
  /* What a new pick-up on this word is worth: the word's own length when
     that is a value shorter than a bar, else a beat. */
  function pickupValueFor(syl) {
    let t = 0;
    if (syl) syl.querySelectorAll('.harmony-stack').forEach(st => { t += SW.timing.column(st).ticks; });
    const v = SW.values.LIST.find(x => x.ticks === t && x.ticks < barTicks());
    return v ? v.id : SW.meters.beat().value;          // a beat: a quarter, or a dotted quarter in 6/8
  }
  /* For the Edit box: can the selection take a pick-up, is it in one
     (`on`, `value`), and is that the first line's. */
  function pickupState() {
    const syl = selectedSyllable();
    const line = pickupAt(syl);
    return {
      can: !!syl && can('structure'),
      on: !!line,
      value: line ? line.dataset.pickup : null,
      first: !!line && !previousLine(line),
      values: pickupValues()
    };
  }
  /* Pick-up on the selection: a new line from its word, opening with a
     pick-up worth `id` (or the word's own length). In a pick-up already,
     `id` re-values it. */
  function makePickup(id) {
    const syl = selectedSyllable();
    if (!syl || !can('structure')) return false;
    if (id && pickupValues().indexOf(id) === -1) return false;
    const inPk = pickupAt(syl);
    if (inPk) return id ? setPickupValue(id) : false;
    const active = getActiveNote();
    let line = syl.closest('.notation-line');
    if (line.querySelector(':scope > .syllable') !== syl) line = splitLineAt(syl);
    if (!line) return false;
    line.dataset.pickup = id || pickupValueFor(syl);
    line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    updateLineHeight(line);
    if (active && document.contains(active)) setNoteAsActive(active, false);
    SW.ui.toast('Pick-up: ' + SW.values.byId(line.dataset.pickup).name.toLowerCase() + ' — the chips change it');
    changed('line');
    return true;
  }
  /* The selected pick-up's value. */
  function setPickupValue(id) {
    const line = pickupAt(selectedSyllable());
    if (!line || !can('structure') || pickupValues().indexOf(id) === -1) return false;
    if (line.dataset.pickup === id) return true;
    line.dataset.pickup = id;
    line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    updateLineHeight(line);
    changed('line');
    return true;
  }
  /* Take a line's pick-up away (the selection's when no line is given):
     it joins back onto the line above, or, the first line, starts on the
     downbeat. */
  function removePickup(line) {
    line = line || pickupAt(selectedSyllable());
    if (!line || !S.editing || !can('structure') || !line.dataset.pickup) return false;
    delete line.dataset.pickup;
    if (previousLine(line)) {
      joinLineWithPrevious(line);
      SW.ui.toast('Pick-up taken away — the line joined the one above');
    } else {
      line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
      updateLineHeight(line);
      SW.ui.toast('Pick-up taken away — the song starts on the downbeat');
      changed('line');
    }
    return true;
  }
  function togglePickup() { return pickupState().on ? removePickup() : makePickup(); }
  /* The × on a pick-up's bar line (staff.js syncCut). */
  function cutPickupBar(line) { return removePickup(line); }

  /* Layout settings → Pick-up: the first line's. */
  function firstPickup() {
    const first = notationContainer.querySelector('.notation-line');
    return first && SW.timing.linePickup(first) ? first.dataset.pickup : null;
  }
  function setFirstPickup(on) {
    const first = notationContainer.querySelector('.notation-line');
    if (!first || !!firstPickup() === !!on) return;
    if (on) first.dataset.pickup = pickupValueFor(first.querySelector(':scope > .syllable'));
    else delete first.dataset.pickup;
    first.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    updateLineHeight(first);
    changed('line');
  }

  /* Join up: the selected line's first word joins it to the line above. */
  function joinState() {
    const syl = selectedSyllable();
    const line = syl && syl.closest('.notation-line');
    return { can: !!line && !!previousLine(line) && can('structure') && line.querySelector(':scope > .syllable') === syl };
  }
  function joinUp() {
    if (!joinState().can) return false;
    return joinLineWithPrevious(selectedSyllable().closest('.notation-line'));
  }

  /* Write every block of one line as `v`, or unwrite every note of it —
     the Edit box's ⋯ → This line (the whole-song pair is notateAll /
     clearAllValues). */
  function notateLine(line, v) {
    if (!S.editing || !can('values') || !line) return 0;
    const id = SW.values.isValid(v) ? v : SW.values.DEFAULT;
    let n = 0;
    line.querySelectorAll('.harmony-stack').forEach(st => {
      if (isNotated(st)) return;
      applyStackValue(st, id);
      n++;
    });
    if (n) { emitSelection(false); changed('value'); }
    return n;
  }
  function clearLineValues(line) {
    if (!S.editing || !can('values') || !line) return 0;
    let n = 0;
    line.querySelectorAll('.harmony-stack.notated').forEach(st => { applyStackValue(st, null); n++; });
    if (n) { emitSelection(false); changed('value'); }
    return n;
  }

  /* ================= ELEMENTS ================= */
  function createNewLineElement(isSectionBreak) {
    const line = document.createElement('div');
    line.className = 'notation-line';
    if (isSectionBreak) line.classList.add('section-break');
    line.appendChild(createLineHead(line));
    return line;
  }

  function createNoteElement(noteClass, accidental, isRest, memory) {
    noteClass = noteClass || 'do';
    const color = M.noteColour(noteClass);
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note ' + noteClass;
    if (isRest) noteDiv.classList.add('rest-note');
    else if (color) noteDiv.style.backgroundColor = color;
    const letterDiv = document.createElement('div');
    letterDiv.className = 'letter-name';
    if (!isRest && color) letterDiv.style.color = color;
    const solDiv = document.createElement('div');
    solDiv.className = 'solfege-name';
    noteDiv.appendChild(letterDiv);
    noteDiv.appendChild(solDiv);
    addAccidentalToNote(noteDiv, accidental || 'natural');     // and names it
    // each scale's version (SCALE MEMORY above): from the song, or copied
    if (memory) {
      if (memory.step && noteOrder.indexOf(memory.step) !== -1) noteDiv.dataset.step = memory.step;
      const alts = {};
      Object.keys(memory.alt || {}).forEach(id => { if (unpackPitch(memory.alt[id])) alts[id] = memory.alt[id]; });
      setAlts(noteDiv, alts);
    }
    remember(noteDiv);
    return noteDiv;
  }

  function getNotePitchIndex(noteEl) {
    return noteOrder.indexOf(M.noteClassOf(noteEl) || 'do');
  }

  /* 1.0: several notes on one beat overlap, tallest at the back, and the
     stack keeps the tallest one's height so the line never collapses. */
  function updateHarmonyStackVisuals(harmonyStack) {
    if (!harmonyStack) return;
    const notes = Array.from(harmonyStack.querySelectorAll('.note'));
    if (notes.length > 1) {
      harmonyStack.classList.add('has-multiple-notes');
      const sortedDescending = notes.slice().sort((a, b) => getNotePitchIndex(b) - getNotePitchIndex(a));
      let maxNoteHeight = 60;
      sortedDescending.forEach((noteEl, rank) => {
        harmonyStack.appendChild(noteEl);
        noteEl.style.zIndex = rank + 1;
        const h = NOTE_HEIGHTS[M.noteClassOf(noteEl)];
        if (h && h > maxNoteHeight) maxNoteHeight = h;
      });
      harmonyStack.style.setProperty('--stack-h', maxNoteHeight);
    } else {
      harmonyStack.classList.remove('has-multiple-notes');
      harmonyStack.style.removeProperty('--stack-h');
      notes.forEach(n => { n.style.zIndex = ''; });
    }
    const mark = harmonyStack.querySelector('.value-mark');
    if (mark) harmonyStack.appendChild(mark);
  }

  /* A column's note value. A BLOCK has none (data-v absent) and reads as
     the default, a quarter — one beat until it is written. isNotated()
     tells the two apart. */
  function getStackValue(stack) {
    return (stack && stack.dataset.v && SW.values.isValid(stack.dataset.v)) ? stack.dataset.v : SW.values.DEFAULT;
  }
  function isNotated(stack) {
    return !!(stack && stack.dataset.v && SW.values.isValid(stack.dataset.v));
  }
  /* Write a column (v = a value id, 'q' included) or unwrite it (v = null).
     The .notated class is what the CSS and the staff read; the value mark
     inside the block is only shown when the staff is switched off. */
  function applyStackValue(stack, v) {
    if (!stack) return;
    let mark = stack.querySelector('.value-mark');
    if (!v || !SW.values.isValid(v)) {
      delete stack.dataset.v;
      delete stack.dataset.tie;
      stack.classList.remove('notated');
      if (mark) mark.remove();
      return;
    }
    stack.dataset.v = v;
    stack.classList.add('notated');
    if (!mark) {
      mark = document.createElement('span');
      mark.className = 'value-mark';
      mark.setAttribute('aria-hidden', 'true');
      stack.appendChild(mark);
    }
    const allRest = Array.from(stack.querySelectorAll('.note')).every(n => n.classList.contains('rest-note'));
    mark.innerHTML = SW.engrave.value(v, { height: 18, rest: allRest });
    mark.title = SW.values.byId(v).name;
  }

  /* 1.0's createNewSyllable, with the columns also accepting the 2.0 column
     shape { v, notes }. Kept tolerant of every shape 1.0 accepted. */
  /* a note spec's other-scale versions → createNoteElement's memory */
  function memoryFromSpec(n) {
    if (!n || (!n.step && !n.alt)) return null;
    const alt = {};
    Object.keys(n.alt || {}).forEach(id => {
      const a = n.alt[id];
      if (a && a.n) alt[id] = packPitch({ nc: a.n, acc: a.acc === 'sharp' || a.acc === 'flat' ? a.acc : 'natural' });
    });
    return { step: n.step, alt };
  }
  function normalizeColumns(columns) {
    const spec = n => (typeof n === 'string')
      ? { n, acc: 'natural', rest: false }
      : { n: n.n || n.noteClass || 'do', acc: n.acc || n.accidental || 'natural', rest: !!(n.rest || n.isRest), mem: memoryFromSpec(n) };
    if (typeof columns === 'string') return [{ notes: [spec(columns)] }];
    if (!Array.isArray(columns) || columns.length === 0) return [{ notes: [spec('do')] }];
    return columns.map(col => {
      if (col && !Array.isArray(col) && Array.isArray(col.notes)) {
        return { v: col.v, tie: col.tie === true, notes: col.notes.length ? col.notes.map(spec) : [spec('do')] };
      }
      if (Array.isArray(col)) return { notes: col.map(spec) };
      return { notes: [spec(col)] };
    });
  }

  /* ---- writing and unwriting in bulk (the Rhythm popup) ---- */
  function notateAll(v) {
    if (!S.editing || !can('values')) return 0;
    const id = SW.values.isValid(v) ? v : SW.values.DEFAULT;
    let n = 0;
    notationContainer.querySelectorAll('.harmony-stack').forEach(st => {
      if (isNotated(st)) return;
      applyStackValue(st, id);
      n++;
    });
    if (n) { emitSelection(false); changed('value'); }
    return n;
  }
  /* The Rhythm page opening (2026-10-25, user): a block is a beat on the
     Rhythm page, so once that page has seen the song its blocks ARE
     quarter notes (dotted quarters in 6/8 9/8 12/8) — on every page —
     until changed. Hat or no hat; one edit. */
  function writeAllBlocks(v) {
    if (!can('values')) return 0;
    const id = SW.values.isValid(v) ? v : SW.values.DEFAULT;
    let n = 0;
    notationContainer.querySelectorAll('.harmony-stack').forEach(st => {
      if (isNotated(st)) return;
      applyStackValue(st, id);
      n++;
    });
    if (n) { emitSelection(false); changed('value'); }
    return n;
  }
  function clearAllValues() {
    if (!S.editing || !can('values')) return 0;
    let n = 0;
    notationContainer.querySelectorAll('.harmony-stack.notated').forEach(st => { applyStackValue(st, null); n++; });
    if (n) { emitSelection(false); changed('value'); }
    return n;
  }

  /* Step to the column after this one, silently — how the staff panel
     moves on after writing a note. Stays put at the end of the song. */
  function selectNextStack(stack) {
    const stacks = getAllHarmonyStacks();
    const i = stacks.indexOf(stack);
    if (i === -1 || i >= stacks.length - 1) return false;
    const t = stacks[i + 1];
    setNoteAsActive(t.querySelector('.note') || t, false);
    return true;
  }

  /* ---- the song's meter and tempo (stored in the score) ---- */
  function setMeter(id, quiet) {
    if (!SW.meters.isValid(id) || S.meter === id) return;
    if (!quiet && SW.track) SW.track.followMeter(S.meter, id);   // the chords' rhythms go over to the new meter (track.js)
    S.meter = id;
    SW.bus.emit('meter:changed', { meter: S.meter, bpm: S.bpm, what: 'meter' });
    if (!quiet) changed('meter');
    if (!quiet && SW.track) SW.bus.emit('track:changed', { why: 'meter' });
  }
  /* 30–300 BPM (the family's), narrowed by a lesson's tempo rule. A
     change while playing re-times the music rather than stopping it. */
  function setTempo(bpm, quiet) {
    const b = SW.settings && SW.settings.clampTempo ? SW.settings.clampTempo(bpm) : SW.meters.clampBpm(bpm);
    if (S.bpm === b) return;
    S.bpm = b;
    SW.bus.emit('meter:changed', { meter: S.meter, bpm: S.bpm, what: 'tempo' });
    if (!quiet) changed('tempo');
  }

  function createNewSyllable(syllableText, columns, chord, hy) {
    const cols = normalizeColumns(columns === undefined ? [[{ n: 'do' }]] : columns);
    const syllableDiv = document.createElement('div');
    syllableDiv.className = 'syllable';
    if (chord) syllableDiv.dataset.chord = chord;
    if (hy) syllableDiv.dataset.hy = '1';               // its word goes on in the next syllable

    // CHORD LANE — component slot, filled by js/components/chord-lane.js
    const slot = document.createElement('div');
    slot.className = 'chord-slot';
    syllableDiv.appendChild(slot);

    const body = document.createElement('div');
    body.className = 'syl-body';
    const notesContainer = document.createElement('div');
    notesContainer.className = 'notes-container';
    cols.forEach(col => {
      const stack = document.createElement('div');
      stack.className = 'harmony-stack';
      col.notes.forEach(n => stack.appendChild(createNoteElement(n.n, n.acc, n.rest, n.mem)));
      updateHarmonyStackVisuals(stack);
      applyStackValue(stack, col.v);
      if (col.tie && col.v) stack.dataset.tie = '1';
      notesContainer.appendChild(stack);
    });
    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = syllableText === undefined ? '-' : syllableText;
    body.appendChild(notesContainer);
    body.appendChild(textDiv);
    syllableDiv.appendChild(body);
    return syllableDiv;
  }

  /* ================= CONNECTED NOTES (several on one syllable) ================= */
  function duplicateCurrentNote() {
    if (!S.editing || !can('connected')) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    const parentSyllable = activeNote.closest('.syllable');
    if (!parentSyllable) return;
    // a whole word on the Pitch page counts its syllable's notes, not the word's
    const held = isJoined(parentSyllable) ? pieceOfStack(activeNote.closest('.harmony-stack')).stacks.length : parentSyllable.querySelectorAll('.note').length;
    if (held >= 8) {
      SW.ui.toast('Eight connected notes is the most one syllable can hold');
      return;
    }
    let notesContainer = parentSyllable.querySelector('.notes-container');
    if (!notesContainer) {
      notesContainer = document.createElement('div');
      notesContainer.className = 'notes-container';
      const text = parentSyllable.querySelector('.text');
      text.parentNode.insertBefore(notesContainer, text);
    }
    const currentStack = activeNote.closest('.harmony-stack');
    const newStack = document.createElement('div');
    newStack.className = 'harmony-stack';
    const newNote = createNoteElement(M.noteClassOf(activeNote) || 'do', getAccidentalFromNote(activeNote), activeNote.classList.contains('rest-note'), memoryOf(activeNote));
    newStack.appendChild(newNote);
    applyStackValue(newStack, currentStack ? currentStack.dataset.v : null);
    if (currentStack && currentStack.parentNode === notesContainer) currentStack.insertAdjacentElement('afterend', newStack);
    else notesContainer.appendChild(newStack);
    updateLineHeight(parentSyllable.closest('.notation-line'));
    setNoteAsActive(newNote, true);
    changed('connected');
  }

  function removeCurrentConnectedNote() {
    if (!S.editing || !can('connected')) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    const parentSyllable = activeNote.closest('.syllable');
    if (!parentSyllable) return;
    const stacks = Array.from(parentSyllable.querySelectorAll('.harmony-stack'));
    if (stacks.length <= 1) return;
    const currentStack = activeNote.closest('.harmony-stack');
    if (!currentStack) return;
    const i = stacks.indexOf(currentStack);
    const nextStack = i > 0 ? stacks[i - 1] : stacks[i + 1];
    if (i > 0) delete stacks[i - 1].dataset.tie;
    foldWord(currentStack);
    currentStack.remove();
    refreshJoined(parentSyllable);
    updateLineHeight(parentSyllable.closest('.notation-line'));
    if (nextStack) {
      const nextNote = nextStack.querySelector('.note');
      if (nextNote) setNoteAsActive(nextNote, true);
    }
    changed('connected');
  }

  /* The × on the selected note's box (note-tools.js, the user's design
     2026-10-08): that note goes in one tap — Undo brings it back. On a
     syllable with other notes, the column alone (its word stays, on the
     syllable's notes that are left); a syllable's only note goes with
     its word (deleteSyllable). A tie into it from the column before is
     let go. The note after it is selected, so × again goes on. */
  function deleteNoteState() {
    const note = (S.editing && currentNoteIndex >= 0) ? getActiveNote() : null;
    const syl = note && note.closest('.syllable');
    if (!syl) return { can: false, whole: false };
    const whole = syl.querySelectorAll('.harmony-stack').length <= 1;
    return { can: whole ? can('structure') : can('connected'), whole };
  }
  function deleteCurrentNote() {
    const st = deleteNoteState();
    if (!st.can) return;
    const stack = getActiveNote().closest('.harmony-stack');
    const line = stack && stack.closest('.notation-line');
    if (!line) return;
    const cols = Array.from(line.querySelectorAll('.harmony-stack'));
    const before = cols[cols.indexOf(stack) - 1];
    if (before) delete before.dataset.tie;
    if (st.whole) { deleteSyllable(); return; }
    const syl = stack.closest('.syllable');
    const stacks = Array.from(syl.querySelectorAll('.harmony-stack'));
    const i = stacks.indexOf(stack);
    const next = stacks[i + 1] || stacks[i - 1];
    foldWord(stack);
    stack.remove();
    refreshJoined(syl);
    updateLineHeight(line);
    const nextNote = next && next.querySelector('.note');
    if (nextNote) setNoteAsActive(nextNote, true);
    changed('connected');
  }

  /* ================= TIES =================
     Tie (the Edit box's Rhythm section): the selected note goes on for an
     eighth more, written as a tie — its chain, the last column tied into
     a new eighth on the same syllable — the circles' way (flow.js THE
     EDIT BOX, 2026-10-26): the beats after it stay where they are, what
     the eighth cuts into starts anew after it, and the melody pours. On a
     bar's last beat the eighth lands over the bar line and the tie
     crosses it. The first column carries the tie (data-tie, `tie` in the
     model); timing.js pairs it with the next column's matching pitches,
     the staff draws the arc and the player sounds it once. Tie on a tied
     note parts them: the held part after it goes quiet, as ⛓ parts two
     beats. A block has no length to hold, and a rest nothing to hold, so
     neither can be tied. (Until 2026-10-26 Tie put a new column in and
     slid every column after it.) */
  function tieState() {
    const note = (S.editing && currentNoteIndex >= 0) ? getActiveNote() : null;
    const stack = note && note.closest('.harmony-stack');
    if (!stack || !can('values')) return { can: false, tied: false, why: '' };
    if (!isNotated(stack)) return { can: false, tied: false, why: 'block' };
    if (Array.from(stack.querySelectorAll('.note')).every(n => n.classList.contains('rest-note'))) return { can: false, tied: false, why: 'rest' };
    return { can: true, tied: !!stack.dataset.tie, why: '' };
  }
  function toggleTie() {
    const st = tieState();
    if (!st.can) {
      if (st.why === 'block') SW.ui.toast('Give this note a rhythm first, then tie it');
      else if (st.why === 'rest') SW.ui.toast('A rest has nothing to hold over');
      return;
    }
    const note = getActiveNote();
    const stack = note.closest('.harmony-stack');
    if (!SW.flow) return;
    if (st.tied) {
      // the held part goes quiet; a tie mark with nothing held after it is simply dropped
      if (!SW.flow.untie(stack)) { delete stack.dataset.tie; changed('tie'); emitSelection(false); }
      return;
    }
    const syl = stack.closest('.syllable');
    if (syl.querySelectorAll('.harmony-stack').length >= 8) {
      SW.ui.toast('Eight notes is the most one syllable can hold');
      return;
    }
    SW.flow.tie(stack);
  }

  /* ================= HARMONY (stacked notes) ================= */
  function addHarmonyNote() {
    if (!S.editing || !can('harmony')) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    let harmonyStack = activeNote.closest('.harmony-stack');
    if (!harmonyStack) {
      if (!activeNote.closest('.notes-container')) return;
      harmonyStack = document.createElement('div');
      harmonyStack.className = 'harmony-stack';
      activeNote.parentNode.insertBefore(harmonyStack, activeNote);
      harmonyStack.appendChild(activeNote);
    }
    if (harmonyStack.querySelectorAll('.note').length >= 6) {
      SW.ui.toast('Six notes is the most one harmony can hold');
      return;
    }
    // 1.0: two steps above, wrapping round — two steps of the scale now
    // (a third in the seven-note scales: me over do in minor), inside the
    // allowed range. A note outside the scale counts from the scale note
    // just below it.
    const steps = ladder();
    const cur = M.noteMidi(M.noteClassOf(activeNote) || 'do', getAccidentalFromNote(activeNote));
    let at = steps.findIndex(n => n.midi >= cur);
    if (at === -1) at = steps.length;
    else if (steps[at].midi > cur) at -= 1;          // outside the scale: count from just below
    const target = steps[at + 2] || steps[0];
    const newNote = createNoteElement(target.nc, target.acc, false);   // a scale note: nothing to remember
    harmonyStack.appendChild(newNote);
    updateHarmonyStackVisuals(harmonyStack);
    updateLineHeight(harmonyStack.closest('.notation-line'));
    setNoteAsActive(newNote, false);
    soundColumn(harmonyStack.querySelector(".note"));
    changed('harmony');
  }

  function removeHarmonyNote() {
    if (!S.editing || !can('harmony')) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    const harmonyStack = activeNote.closest('.harmony-stack');
    if (!harmonyStack) return;
    const notes = Array.from(harmonyStack.querySelectorAll('.note'));
    if (notes.length <= 1) return;
    const i = notes.indexOf(activeNote);
    const nextActive = i > 0 ? notes[i - 1] : notes[i + 1];
    activeNote.remove();
    updateHarmonyStackVisuals(harmonyStack);
    updateLineHeight(harmonyStack.closest('.notation-line'));
    if (nextActive) {
      setNoteAsActive(nextActive, false);
      soundColumn(harmonyStack.querySelector(".note"));
    }
    changed('harmony');
  }

  /* ================= WHAT THE EDIT TOOLS MAY DO =================
     Asked by the Edit box (edit-box.js) and by the keys alike, so a
     button is only live when it would act. */
  function connectedState() {
    const active = (S.editing && currentNoteIndex >= 0) ? getActiveNote() : null;
    const syl = active && active.closest('.syllable');
    if (!syl) return { canAdd: false, canRemove: false, count: 0 };
    const stacks = syl.querySelectorAll('.harmony-stack').length;
    const total = syl.querySelectorAll('.note').length;
    return { canAdd: can('connected') && total < 8 && stacks < 8, canRemove: can('connected') && stacks > 1, count: stacks };
  }
  function harmonyState() {
    const active = (S.editing && currentNoteIndex >= 0) ? getActiveNote() : null;
    const stack = active && active.closest('.harmony-stack');
    const n = stack ? stack.querySelectorAll('.note').length : 0;
    return { canAdd: !!active && can('harmony') && n < 6, canRemove: !!active && can('harmony') && n > 1, count: n };
  }

  function toggleRestOnCurrentNote() {
    if (!S.editing || currentNoteIndex < 0 || !can('rest')) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    const isRest = activeNote.classList.toggle('rest-note');
    const noteClass = M.noteClassOf(activeNote) || 'do';
    if (isRest) {
      activeNote.style.backgroundColor = '';
      const letterEl = activeNote.querySelector('.letter-name');
      if (letterEl) letterEl.style.color = '';
    } else {
      updateNoteDisplay(activeNote, noteClass);
      soundNote(activeNote);
    }
    const stack = activeNote.closest('.harmony-stack');
    if (stack && stack.dataset.v) applyStackValue(stack, stack.dataset.v);
    emitSelection(false);
    changed('rest');
  }
  /* A rest column made a note again (the Rhythm page and the beat strip,
     2026-10-26: the grey circle where a word's rest begins, tapped —
     "silence: tap for a note"). Its pitch is the one the rest kept. Not
     gated on the hat, as the page's circles are not; one Undo step. */
  function unrestColumn(stack) {
    if (!stack || !can('rest')) return false;
    const rests = Array.from(stack.querySelectorAll('.note')).filter(n => n.classList.contains('rest-note'));
    if (!rests.length) return false;
    rests.forEach(n => { n.classList.remove('rest-note'); updateNoteDisplay(n, M.noteClassOf(n) || 'do'); });
    if (stack.dataset.v) applyStackValue(stack, stack.dataset.v);
    setNoteAsActive(rests[0], false);
    soundNote(rests[0]);
    changed('rest');
    return true;
  }
  /* 2.5: a REST put in after the selected column (note, rest or block),
     worth `v` — the Rest button in the Edit box, then a value circle.
     The circles' way (flow.js THE EDIT BOX, 2026-10-26): the rest takes
     its time from the beats after the note, which stay where they are —
     what it cuts into starts anew after it — and the melody pours. It
     joins the selected note's word (a wordless column after it, as
     rhythm-made rests do — flow.js D3), keeps that note's pitch (as every
     rest does, so it can be made a note again), and is selected. (Until
     2026-10-26 the rest was a new column that slid everything after it.) */
  function insertRestAfterCurrent(v) {
    if (!S.editing || !can('rest') || !can('values') || !SW.values.isValid(v) || !SW.flow) return null;
    const active = getActiveNote();
    const stack = active && active.closest('.harmony-stack');
    if (!stack) return null;
    if (!SW.flow.insertRest(stack, v)) return null;
    const now = getActiveNote();
    return now ? now.closest('.harmony-stack') : null;
  }

  /* Which line holds the selection: its section tools show on a touch
     screen (no hover), and on a computer as well as the one pointed at. */
  function markSelectedLine() {
    const note = currentNoteIndex >= 0 ? getActiveNote() : null;
    const line = note && note.closest('.notation-line');
    notationContainer.querySelectorAll('.notation-line.has-selection').forEach(l => { if (l !== line) l.classList.remove('has-selection'); });
    if (line) line.classList.add('has-selection');
  }
  function updateAllButtonStates() {
    markSelectedLine();
  }

  /* ================= SYLLABLES ================= */
  /* A note-and-syllable put in after the selected one. Inside a word
     (the selected syllable's `hy`) it is a syllable of that word too;
     opts.fresh (typing on past the song's end): a word of its own. */
  function addSyllableAfterCurrent(opts) {
    if (!S.editing || !can('structure')) return;
    const syllables = getAllSyllables();
    let targetSyllable, targetLine;
    if (currentSyllableIndex >= 0 && currentSyllableIndex < syllables.length) {
      targetSyllable = syllables[currentSyllableIndex];
      targetLine = targetSyllable.closest('.notation-line');
    } else {
      const lines = notationContainer.querySelectorAll('.notation-line');
      if (lines.length > 0) {
        targetLine = lines[lines.length - 1];
        const own = targetLine.querySelectorAll('.syllable');
        targetSyllable = own.length ? own[own.length - 1] : null;
      } else {
        targetLine = createNewLineElement(true);
        notationContainer.appendChild(targetLine);
        updateLineBackgrounds();
        updateLineHeight(targetLine);
        updateSectionActionButtonsState();
      }
    }
    if (!targetLine) return;
    const newSyllable = createNewSyllable();
    if (targetSyllable && targetSyllable.dataset.hy && !isJoined(targetSyllable) && !(opts && opts.fresh)) newSyllable.dataset.hy = '1';
    if (targetSyllable) targetSyllable.insertAdjacentElement('afterend', newSyllable);
    else targetLine.appendChild(newSyllable);
    updateLineHeight(targetLine);
    setSyllableAsActive(newSyllable);
    changed('syllable');
    return newSyllable;
  }

  function deleteSyllable() {
    if (!S.editing || currentSyllableIndex < 0 || !can('structure')) return;
    const syllables = getAllSyllables();
    if (currentSyllableIndex >= syllables.length) return;
    const doomed = syllables[currentSyllableIndex];
    const parentLine = doomed.closest('.notation-line');
    clearTimeout(deleteTimer);
    deleteConfirmationState = false;
    // a word's last syllable gone: the one before it ends the word now
    const before = syllables[currentSyllableIndex - 1];
    if (before && before.dataset.hy && !doomed.dataset.hy) delete before.dataset.hy;
    doomed.remove();
    if (parentLine && parentLine.querySelectorAll('.syllable').length === 0) {
      parentLine.remove();
      updateLineBackgrounds();
      updateSectionActionButtonsState();
    } else if (parentLine) {
      updateLineHeight(parentLine);
    }
    const remaining = getAllNotes();
    if (remaining.length === 0) {
      currentNoteIndex = -1;
      currentSyllableIndex = -1;
      navigationOffEndState = null;
      updateAllButtonStates();
      emitSelection(false);
    } else {
      if (currentNoteIndex >= remaining.length) currentNoteIndex = remaining.length - 1;
      setNoteAsActive(remaining[currentNoteIndex], true);
    }
    SW.bus.emit('edit:armed', { armed: false });
    changed('syllable');
  }

  /* ================= TYPING WORDS ================= */
  /* Removing the focused input blurs it; its blur must not close the word
     a second time (that threw, and made Esc keep what was typed). */
  let droppingInput = false;
  function dropInput(input) {
    droppingInput = true;
    try { input.remove(); } finally { droppingInput = false; }
  }
  function startTextEdit(textElement) {
    if (!can('words')) return;
    if (currentlyEditingText && currentlyEditingText !== textElement) finishTextEdit();
    currentlyEditingText = textElement;
    const syllable = textElement.closest('.syllable');
    syllable.classList.add('editing');
    currentEditingIndex = Array.from(getAllSyllables()).indexOf(syllable);
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'text-input';
    // a whole word on the Pitch page is typed with its hyphens (wa-ter-mel-on): they say where its syllables go
    input.value = isJoined(syllable) ? piecesOf(syllable).map(p => shown(p.text)).join('-') : textElement.textContent;
    textElement.style.display = 'none';
    textElement.parentNode.insertBefore(input, textElement);
    input.focus();
    input.select();
    SW.bus.emit('words:typing', { on: true });      // the Edit box greys its word tools
    input.addEventListener('blur', () => { if (!isAdvancingToNext && !droppingInput) finishTextEdit(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') finishTextEdit();
      else if (e.key === 'Escape') cancelTextEdit();
      else if (e.key === ' ' && e.target.selectionStart === e.target.value.length) { e.preventDefault(); finishTextEditAndAdvance(); }
      else if (e.key === ' ' && e.target.selectionStart === e.target.selectionEnd && (isJoined(syllable) || /-/.test(e.target.value)) && midWord(e.target)) {
        // a whole word (Pitch), or one typed with hyphens: Space inside it is one more —
        // a syllable break, put on its note when the word is closed
        e.preventDefault();
        const at = e.target.selectionStart, v = e.target.value;
        e.target.value = v.slice(0, at) + '-' + v.slice(at);
        e.target.setSelectionRange(at + 1, at + 1);
      }
      else if (e.key === ' ' && e.target.selectionStart === e.target.selectionEnd && splittable(syllable, e.target)) {
        // 2.5: inside a word with connected notes, Space sends the rest of
        // the word to the next of them (HEL|LO → HEL · LO)
        e.preventDefault();
        splitWordAtCaret(syllable, e.target.selectionStart);
      }
      else if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        e.preventDefault();
        finishTextEditAndGoBack();
      }
    });
    input.addEventListener('click', e => e.stopPropagation());
  }

  /* ================= SYLLABLES ON CONNECTED NOTES (2.5) =================
     A word is often written whole on one note, with + Note Only notes
     after it for its other syllables (a melisma, as far as the song can
     tell). When the words are formalized they move onto those notes:
       • Space INSIDE the word (HEL|LO) keeps HEL on the first note and
         sends LO to the next connected note, which becomes a syllable of
         its own (any notes after it stay connected to LO) — and typing
         goes on in LO, the caret at its start, so beau|ti|ful splits one
         Space at a time
       • a double-click UNDER a connected note (in the words' row) gives
         it a word of its own: it and the notes after it become a new
         syllable, and the word is typed there; leaving it with no word
         puts it back on the word it came from (nothing is broken by a
         stray double-click)
     One way only: nothing here turns a syllable back into a connected
     note. A tie into the note that gains a word is let go (a new
     syllable is a new attack).
     2026-10-26 (user): the two halves of a word split by Space are joined
     by a hyphen (`hy` — WORDS IN SYLLABLES), and Space splits a word onto
     the next note too when that note is a wordless syllable of its own
     ("-"), not only onto a connected note. */
  let freshSplit = null;                    // a syllable made by a double-click, until it has a word
  const ownStacks = syl => Array.from(syl.querySelectorAll('.notes-container > .harmony-stack'));
  function midWord(input) {
    const at = input.selectionStart;
    return at > 0 && at < input.value.length && input.value.slice(0, at).trim() !== '' && input.value.slice(at).trim() !== '';
  }
  function splittable(syllable, input) {
    return midWord(input) && (ownStacks(syllable).length > 1 || !!wordlessNext(syllable));
  }
  /* the syllable after this one in its line, when it has no word ("-") */
  function wordlessNext(syl) {
    const nx = syl.nextElementSibling;
    if (!nx || !nx.classList.contains('syllable') || isJoined(nx)) return null;
    const t = nx.querySelector('.text');
    return t && (t.textContent.trim() === '-' || !t.textContent.trim()) ? nx : null;
  }
  /* Columns `from`… of a syllable become a new syllable after it. */
  function splitSyllableAt(syllable, from, text) {
    const stacks = ownStacks(syllable);
    if (from <= 0 || from >= stacks.length) return null;
    const created = createNewSyllable(text || '-');
    const box = created.querySelector('.notes-container');
    box.innerHTML = '';
    stacks.slice(from).forEach(st => box.appendChild(st));
    const before = stacks[from - 1];
    created._tieWas = !!before.dataset.tie;
    delete before.dataset.tie;
    syllable.after(created);
    const line = syllable.closest('.notation-line');
    if (line) line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    return created;
  }
  /* A double-click's syllable left with no word goes back where it came from. */
  function mergeBack(created) {
    const prev = created.previousElementSibling;
    if (!prev || !prev.classList.contains('syllable')) return false;
    const box = prev.querySelector('.notes-container');
    const own = ownStacks(prev);
    if (created._tieWas && own.length) own[own.length - 1].dataset.tie = '1';
    ownStacks(created).forEach(st => box.appendChild(st));
    created.remove();
    return true;
  }
  function splitWordAtCaret(syllable, at) {
    const input = syllable.querySelector('.text-input');
    if (!input || !currentlyEditingText) return;
    const left = input.value.slice(0, at).trim(), right = input.value.slice(at).trim();
    input.value = left;
    isAdvancingToNext = true;
    const host = closeInput(syllable);
    syllable.classList.remove('editing');
    currentlyEditingText = null;
    currentEditingIndex = -1;
    // onto the next connected note (it becomes a syllable of its own), or the wordless note after
    let created = null;
    if (ownStacks(host).length > 1) {
      const goesOn = !!host.dataset.hy;
      created = splitSyllableAt(host, 1, right);
      if (created && goesOn) created.dataset.hy = '1';
    } else {
      created = wordlessNext(host);
      if (created) created.querySelector('.text').textContent = right;
    }
    if (!created) { isAdvancingToNext = false; changed('words'); return; }
    host.dataset.hy = '1';                     // the hyphen between the two halves
    const first = created.querySelector('.note');
    if (first) setNoteAsActive(first, false);
    changed('words');
    setTimeout(() => {
      isAdvancingToNext = false;
      const t = created.querySelector('.text');
      if (!t || !document.contains(t)) return;
      startTextEdit(t);
      const inp = created.querySelector('.text-input');
      if (inp) inp.setSelectionRange(0, 0);
    }, 50);
  }
  /* A double-click in the words' row under one of a word's connected notes. */
  function wordUnderColumn(e) {
    if (!S.editing || !can('words')) return false;
    const t = e.target;
    if (t.closest('.text, .text-input, .chord-slot, .line-head')) return false;
    const syl = t.closest('.syllable');
    if (!syl) return false;
    const stacks = ownStacks(syl);
    const text = syl.querySelector('.text');
    if (stacks.length < 2 || !text) return false;
    const tr = text.getBoundingClientRect();
    const notesBottom = Math.max(...stacks.map(st => st.getBoundingClientRect().bottom));
    const inWords = (e.clientY >= tr.top - 6 && e.clientY <= tr.bottom + 12) || e.clientY > notesBottom;
    if (!inWords) return false;
    let best = 0, bd = Infinity;
    stacks.forEach((st, i) => {
      const r = st.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.right) / 2);
      if (d < bd) { bd = d; best = i; }
    });
    return openWordAt(syl, best);
  }
  /* The word of a syllable's column `i` opened for typing: the first
     column's is the syllable's own; a connected note becomes a syllable
     of its own first (and goes back if it is left with no word). */
  function openWordAt(syl, i) {
    const text = syl.querySelector('.text');
    if (!text) return false;
    // a whole word on the Pitch page opens whole, its hyphens showing where its syllables go
    if (i <= 0 || isJoined(syl)) { startTextEdit(text); return true; }
    if (currentlyEditingText) finishTextEdit();
    const created = splitSyllableAt(syl, i, '-');
    if (!created) return false;
    freshSplit = created;
    const first = created.querySelector('.note');
    if (first) setNoteAsActive(first, false);
    startTextEdit(created.querySelector('.text'));
    return true;
  }
  /* A word typed on another page (the Rhythm page, 2026-10-26) for the
     column `stack`: on a syllable's first column it is the syllable's
     word; on a connected note it makes that note a syllable of its own
     (nothing typed: nothing happens). One Undo step, none when nothing
     changed. Returns the syllable the word is on (or the column's own). */
  function setWordAt(stack, text) {
    const syl = stack && stack.closest('.syllable');
    if (!syl || !can('words')) return null;
    const t = String(text || '').trim();
    if (ownStacks(syl).indexOf(stack) > 0) {
      if (!t || t === '-') return syl;
      const created = splitSyllableAt(syl, ownStacks(syl).indexOf(stack), '-');
      if (!created) return syl;
      const last = applyTyped(created, t);
      changed('words');
      return last;
    }
    const el = syl.querySelector('.text');
    // hyphens typed say where the word's syllables go (WORDS IN SYLLABLES)
    if (el && (el.textContent !== (t || '-') || /.-|-./.test(t))) { const last = applyTyped(syl, t); changed('words'); return last; }
    return syl;
  }
  /* after a word is closed: a double-click's syllable with no word goes back */
  function settleFresh(syllable) {
    if (!freshSplit || syllable !== freshSplit) return false;
    freshSplit = null;
    const t = syllable.querySelector('.text');
    if (t && t.textContent.trim() !== '-' && t.textContent.trim() !== '') return false;
    return mergeBack(syllable);
  }

  /* The word typed goes in (applyTyped: its hyphens place its syllables).
     Returns the last syllable it now spans. */
  function closeInput(syllable) {
    const input = syllable.querySelector('.text-input');
    let last = syllable;
    if (input) {
      const value = input.value;
      dropInput(input);
      currentlyEditingText.style.display = '';
      last = applyTyped(syllable, value);
    }
    settleFresh(syllable);
    return document.contains(last) ? last : syllable;
  }

  function finishTextEdit() {
    if (!currentlyEditingText) return;
    const syllable = currentlyEditingText.closest('.syllable');
    closeInput(syllable);
    syllable.classList.remove('editing');
    currentlyEditingText = null;
    currentEditingIndex = -1;
    isAdvancingToNext = false;
    changed('words');
  }

  function finishTextEditAndAdvance() {
    if (!currentlyEditingText) return;
    const syllables = getAllSyllables();
    isAdvancingToNext = true;
    const syllable = currentlyEditingText.closest('.syllable');
    // the word may now span several syllables (wa-ter-mel-on typed): go on after the last of them
    const last = closeInput(syllable);
    syllable.classList.remove('editing');
    const now = Array.from(getAllSyllables());
    const at = document.contains(last) ? now.indexOf(last) : currentEditingIndex;
    const currentSyllable = now[at] || syllables[currentEditingIndex];
    const nextIndex = at + 1;
    currentlyEditingText = null;
    currentEditingIndex = -1;
    changed('words');

    if (nextIndex < now.length) {
      const next = now[nextIndex];
      const nextText = next.querySelector('.text');
      if (nextText) {
        scrollToSyllable(next);
        setTimeout(() => { isAdvancingToNext = false; startTextEdit(nextText); }, 50);
      } else isAdvancingToNext = false;
    } else if (S.editing && can('structure')) {
      setSyllableAsActive(currentSyllable);
      const created = addSyllableAfterCurrent({ fresh: true });
      const createdText = created && created.querySelector('.text');
      if (createdText) {
        scrollToSyllable(created);
        setTimeout(() => { isAdvancingToNext = false; startTextEdit(createdText); }, 50);
      } else isAdvancingToNext = false;
    } else {
      isAdvancingToNext = false;
    }
  }

  function finishTextEditAndGoBack() {
    if (!currentlyEditingText) return;
    const syllables = getAllSyllables();
    const previousIndex = currentEditingIndex - 1;
    isAdvancingToNext = true;
    const syllable = currentlyEditingText.closest('.syllable');
    const input = syllable.querySelector('.text-input');

    // 1.0: backspace on a bare "-" removes the syllable itself (but a
    // syllable just split off by a double-click goes back, notes and all)
    if (input && input.value.trim() === '-' && syllable === freshSplit) {
      dropInput(input);
      currentlyEditingText.style.display = '';
      syllable.classList.remove('editing');
      currentlyEditingText = null;
      currentEditingIndex = -1;
      isAdvancingToNext = false;
      const prev = syllable.previousElementSibling;
      settleFresh(syllable);
      if (prev && prev.querySelector('.note')) setNoteAsActive(prev.querySelector('.note'), false);
      SW.bus.emit('score:changed', { reason: 'history' });
      SW.bus.emit('words:typing', { on: false });
      return;
    }
    if (input && input.value.trim() === '-' && can('structure')) {
      syllable.classList.remove('editing');
      currentlyEditingText = null;
      currentEditingIndex = -1;
      isAdvancingToNext = false;
      setSyllableAsActive(syllable);
      deleteSyllable();
      return;
    }
    closeInput(syllable);
    syllable.classList.remove('editing');
    currentlyEditingText = null;
    currentEditingIndex = -1;
    changed('words');

    if (previousIndex >= 0 && previousIndex < syllables.length) {
      const prev = syllables[previousIndex];
      const prevText = prev.querySelector('.text');
      if (prevText) {
        scrollToSyllable(prev);
        setTimeout(() => {
          isAdvancingToNext = false;
          startTextEdit(prevText);
          const newInput = prev.querySelector('.text-input');
          if (newInput) newInput.select();
        }, 50);
      } else isAdvancingToNext = false;
    } else {
      isAdvancingToNext = false;
    }
  }

  function cancelTextEdit() {
    if (!currentlyEditingText) return;
    const syllable = currentlyEditingText.closest('.syllable');
    const input = syllable.querySelector('.text-input');
    if (input) { dropInput(input); currentlyEditingText.style.display = ''; }
    syllable.classList.remove('editing');
    currentlyEditingText = null;
    currentEditingIndex = -1;
    isAdvancingToNext = false;
    if (settleFresh(syllable)) SW.bus.emit('score:changed', { reason: 'history' });   // redraw only: the song is as it was
    SW.bus.emit('words:typing', { on: false });
  }

  /* ================= WORDS IN SYLLABLES (2026-10-26) =================
     A word sung on several notes is several syllables, each on a note of
     its own: wa · ter · mel · on. The song keeps them as syllables (that
     is what Notation, Rhythm, playback and saving read), every one but a
     word's last with `hy` — "this word goes on in the next syllable", the
     hyphen (data-hy on the element; the text format's trailing -).
       • Notation and Rhythm show the syllables, a hyphen centred in the
         white between them (components/lyric-hyphens.js, rhythm-page.js).
         The hyphen is never typed into a word: Wa -ter put it against one
         side and spoiled the spacing (the user, 2026-10-26).
       • Pitch shows the WORD, whole, on connected notes: a word's
         syllables are gathered into one .syllable.joined (joinWords) —
         each syllable's text kept on the column it starts on (data-w; an
         old lane chord rides along as data-pchord) — and taken apart
         again when the page changes (splitJoined). readLine reads a
         joined word as the syllables it holds, so nothing else ever sees
         the difference. Only within a line: a word that runs on into the
         next line keeps its hyphen at the line's end.
     Ways in: the Write window's Split into syllables (syllable-review.js
     → wordsToScore); a hyphen typed in a word (wa-ter puts each syllable
     on a note, adding notes like + Note Only when the word has too few;
     -ter joins the word before, wa- the word after, so the old habit
     Wa -ter -me -lon comes out right); Space inside a word with a note
     free after it (SYLLABLES ON CONNECTED NOTES). */
  const pitchJoined = () => !!(SW.settings && SW.settings.page && SW.settings.page() === 'pitch');
  const isJoined = syl => !!syl && syl.classList.contains('joined');
  const shown = t => (t && t !== '-' ? t : '');
  let joinedPage = null;                    // the page the words were last laid out for

  /* a joined word's syllables: [{ text, chord, stacks }] */
  function piecesOf(syl) {
    const out = [];
    ownStacks(syl).forEach((st, i) => {
      if (i === 0 || st.dataset.w !== undefined) {
        out.push({ text: st.dataset.w !== undefined ? st.dataset.w : '-', chord: (i === 0 ? syl.dataset.chord : st.dataset.pchord) || null, stacks: [] });
      }
      out[out.length - 1].stacks.push(st);
    });
    return out;
  }
  function pieceOfStack(stack) {
    const syl = stack.closest('.syllable');
    return piecesOf(syl).find(p => p.stacks.indexOf(stack) !== -1) || { stacks: [stack] };
  }
  function joinedText(syl) { return piecesOf(syl).map(p => shown(p.text)).join('') || '-'; }
  function previousSyllable(syl) {
    const all = Array.from(getAllSyllables());
    return all[all.indexOf(syl) - 1] || null;
  }

  /* Pitch: every run of syllables joined by hyphens in a line becomes one word */
  function joinWords(lines) {
    if (!pitchJoined()) return false;
    let any = false;
    Array.from(lines || notationContainer.querySelectorAll('.notation-line')).forEach(line => {
      const syls = Array.from(line.querySelectorAll(':scope > .syllable'));
      for (let i = 0; i < syls.length - 1; i++) {
        if (!syls[i].dataset.hy || syls[i].classList.contains('editing')) continue;
        const rest = [];
        let j = i;
        while (j + 1 < syls.length && syls[j].dataset.hy && !syls[j + 1].classList.contains('editing')) rest.push(syls[++j]);
        if (!rest.length) continue;
        mergeWord(syls[i], rest);
        any = true;
        i = j;
      }
    });
    if (any) resyncSelection();
    return any;
  }
  function mergeWord(head, rest) {
    const mark = (syl, isHead) => {
      const st = ownStacks(syl)[0];
      if (!st) return;
      if (!isJoined(syl)) { const t = syl.querySelector('.text'); st.dataset.w = t ? t.textContent : '-'; }
      if (!isHead && syl.dataset.chord) st.dataset.pchord = syl.dataset.chord;
    };
    mark(head, true);
    const box = head.querySelector('.notes-container');
    rest.forEach(r => { mark(r, false); ownStacks(r).forEach(st => box.appendChild(st)); r.remove(); });
    if (rest[rest.length - 1].dataset.hy) head.dataset.hy = '1'; else delete head.dataset.hy;
    head.classList.add('joined');
    head.querySelector('.text').textContent = joinedText(head);
    const line = head.closest('.notation-line');
    if (line) line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
  }
  /* A joined word as its syllables again (any page but Pitch). Returns its last syllable. */
  function splitJoined(syl) {
    if (!isJoined(syl)) return syl;
    const pieces = piecesOf(syl);
    const goesOn = !!syl.dataset.hy;
    syl.classList.remove('joined');
    ownStacks(syl).forEach(st => { delete st.dataset.w; delete st.dataset.pchord; });
    syl.querySelector('.text').textContent = pieces[0].text;
    let at = syl;
    pieces.slice(1).forEach(p => {
      const s = createNewSyllable(p.text, undefined, p.chord);
      const box = s.querySelector('.notes-container');
      box.innerHTML = '';
      p.stacks.forEach(st => box.appendChild(st));
      at.dataset.hy = '1';
      at.after(s);
      at = s;
    });
    if (at !== syl) { if (goesOn) at.dataset.hy = '1'; else delete at.dataset.hy; }
    const line = syl.closest('.notation-line');
    if (line) line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    return at;
  }
  function splitWords() {
    const joined = notationContainer.querySelectorAll('.syllable.joined');
    if (!joined.length) return false;
    joined.forEach(splitJoined);
    resyncSelection();
    return true;
  }
  /* the page changed: lay the words out for it */
  function fitWordsToPage() {
    const pg = SW.settings && SW.settings.page ? SW.settings.page() : 'notation';
    if (pg === joinedPage) return;
    joinedPage = pg;
    if (currentlyEditingText) finishTextEdit();
    if (pg === 'pitch') joinWords(); else splitWords();
  }
  /* syllables were gathered or parted: the selected note is the same, its syllable may not be */
  function resyncSelection() {
    const a = currentNoteIndex >= 0 ? getActiveNote() : null;
    const syls = Array.from(getAllSyllables());
    syls.forEach(s => s.classList.remove('highlighted', 'sel-own'));
    if (a && document.contains(a)) {
      const syl = a.closest('.syllable');
      currentSyllableIndex = syls.indexOf(syl);
      if (syl) {
        syl.classList.add('highlighted');
        syl.classList.toggle('sel-own', ownStacks(syl)[0] === a.closest('.harmony-stack'));
      }
    }
    updateAllLineHeights();
    updateAllButtonStates();
  }
  /* a joined word's text after its notes changed; one syllable left: a plain word again */
  function refreshJoined(syl) {
    if (!isJoined(syl) || !document.contains(syl)) return;
    const pieces = piecesOf(syl);
    if (pieces.length > 1) { syl.querySelector('.text').textContent = joinedText(syl); return; }
    unjoin(syl, pieces[0].text);
  }
  function unjoin(syl, text) {
    ownStacks(syl).forEach(st => { delete st.dataset.w; delete st.dataset.pchord; });
    syl.classList.remove('joined');
    if (text !== undefined) syl.querySelector('.text').textContent = text || '-';
  }
  /* A joined word loses a note: the syllable that started on it moves to
     the note after it, if that note is still its own (a held syllable);
     else its letters join the syllable before (the first's, the one after). */
  function foldWord(stack) {
    const syl = stack.closest('.syllable');
    if (!isJoined(syl) || stack.dataset.w === undefined) return;
    const stacks = ownStacks(syl);
    const i = stacks.indexOf(stack);
    const next = stacks[i + 1];
    if (next && next.dataset.w === undefined) {
      next.dataset.w = stack.dataset.w;
      if (stack.dataset.pchord) next.dataset.pchord = stack.dataset.pchord;
      return;
    }
    if (i > 0) {
      let p = i - 1;
      while (p > 0 && stacks[p].dataset.w === undefined) p--;
      stacks[p].dataset.w = (shown(stacks[p].dataset.w) + shown(stack.dataset.w)) || '-';
    } else if (next) {
      next.dataset.w = (shown(stack.dataset.w) + shown(next.dataset.w)) || '-';
    }
  }
  /* a copy of a column (a note for a syllable that had none — + Note Only's way) */
  function copyStack(st) {
    const copy = document.createElement('div');
    copy.className = 'harmony-stack';
    st.querySelectorAll('.note').forEach(n => copy.appendChild(createNoteElement(M.noteClassOf(n) || 'do', getAccidentalFromNote(n), n.classList.contains('rest-note'), memoryOf(n))));
    updateHarmonyStackVisuals(copy);
    applyStackValue(copy, st.dataset.v);
    return copy;
  }

  /* A word as typed, put on its syllable (TYPING WORDS). Hyphens say
     where its syllables go:  wa-ter-mel-on  one syllable a note (the word's
     connected notes first, new ones like its last after them);  -ter  the
     word before goes on into this one;  wa-  this one goes on into the
     next. Returns the last syllable the word now spans. */
  function applyTyped(syl, raw) {
    const textEl = syl.querySelector('.text');
    let v = String(raw || '').trim();
    if (v === '--') { syl.dataset.hy = '1'; v = '-'; }
    if (v.length > 1 && v[0] === '-' && /[^-]/.test(v)) {
      const prev = previousSyllable(syl);
      if (prev) prev.dataset.hy = '1';
      v = v.replace(/^-+\s*/, '');
    }
    if (v.length > 1 && /-$/.test(v) && /[^-]/.test(v)) {
      syl.dataset.hy = '1';
      v = v.replace(/\s*-+$/, '');
    }
    const pieces = /[^-]/.test(v) ? v.split('-').map(p => p.trim() || '-') : ['-'];
    if (pieces.length === 1) {
      if (isJoined(syl)) unjoin(syl);
      textEl.textContent = pieces[0];
      return syl;
    }
    return setPieces(syl, pieces);
  }
  /* Put a word's syllables on its notes: the first on its first note, each
     next one on the next note (a joined word whose count is unchanged
     keeps the notes they were on), the last with every note left. */
  function setPieces(syl, pieces) {
    const old = isJoined(syl) ? piecesOf(syl) : null;
    let stacks = ownStacks(syl);
    while (stacks.length < pieces.length && can('connected')) {
      stacks[stacks.length - 1].after(copyStack(stacks[stacks.length - 1]));
      stacks = ownStacks(syl);
    }
    // no notes to be had (a lesson holds the melody): the last note keeps the rest of the word
    if (stacks.length < pieces.length) pieces = pieces.slice(0, stacks.length - 1).concat([pieces.slice(stacks.length - 1).join('-')]);
    if (pieces.length === 1) { unjoin(syl, pieces[0]); return syl; }
    const starts = old && old.length === pieces.length ? old.map(p => stacks.indexOf(p.stacks[0])) : pieces.map((p, i) => i);
    stacks.forEach(st => { delete st.dataset.w; });
    pieces.forEach((p, i) => {
      stacks[starts[i]].dataset.w = p;
      if (i > 0 && stacks[starts[i] - 1]) delete stacks[starts[i] - 1].dataset.tie;    // a new syllable is a new attack
    });
    syl.classList.add('joined');
    syl.querySelector('.text').textContent = joinedText(syl);
    updateLineHeight(syl.closest('.notation-line'));
    return pitchJoined() ? syl : splitJoined(syl);
  }
  /* a line's last syllable no longer runs on into the line after it (lines moved or deleted) */
  function endWordAt(line) {
    const syls = line ? line.querySelectorAll(':scope > .syllable') : [];
    if (syls.length) delete syls[syls.length - 1].dataset.hy;
  }

  /* ================= MODES & TOGGLES ================= */
  /* The hat is a toggle again, as in 1.0: one press on, one press off.
     Its tooltip names what the next press does. */
  function setEditing(on) {
    on = !!on && can('edit');
    if (S.editing === on) return;
    if (!on) finishTextEdit();
    S.editing = on;
    document.body.classList.toggle('editing', on);
    if (editToggleBtn) {
      editToggleBtn.classList.toggle('active', on);
      editToggleBtn.setAttribute('aria-pressed', String(on));
      editToggleBtn.title = on ? 'Lock — back to performing' : 'Unlock to edit';
    }
    notationContainer.querySelectorAll('.line-label').forEach(l => { l.readOnly = !labelEditable(); });
    if (!on) {
      resetAccidentalToggleVisuals();
      resetDeleteConfirmation();
      SW.ui.closeSheet('textEditorPopup');
      navigationOffEndState = null;
      if (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('line-label')) document.activeElement.blur();
    } else {
      syncAccidentalToggle(getActiveNote());
    }
    updateAllButtonStates();
    SW.bus.emit('mode:changed', { editing: on });
  }
  function toggleEditMode() { setEditing(!S.editing); }

  function setNames(on) {
    S.showNames = !!on;
    notationContainer.classList.toggle('show-names', S.showNames);
    document.body.classList.toggle('show-names', S.showNames);
    const btn = $('nameToggle');
    if (btn) {
      btn.classList.toggle('active', S.showNames);
      btn.setAttribute('aria-pressed', String(S.showNames));
      btn.title = S.showNames ? 'Hide the note names' : 'Show the note names';
    }
    SW.bus.emit('names:changed', { on: S.showNames });
  }
  function toggleNames() { setNames(!S.showNames); }

  /* Section colours: a View choice now (View → On the page), remembered. */
  function setColours(on) {
    S.colorScheme = !!on;
    document.body.classList.toggle('colors-inactive', !S.colorScheme);
    updateLineBackgrounds();
  }
  function toggleColorScheme() { setColours(!S.colorScheme); }

  /* The key letter on the key + time tile: the tonic's colour, a small
     ♭ or ♯ after it (B♭). */
  function paintKeyLetter() {
    const el = $('keySignatureDisplay');
    if (!el) return;
    const k = M.spelledKey();                  // D♭ minor reads C♯ (core.js spelledKey)
    const letter = k.charAt(0);
    const acc = k.slice(1).replace('b', '♭').replace('#', '♯');
    el.innerHTML = '';
    el.appendChild(document.createTextNode(letter));
    if (acc) {
      const small = document.createElement('small');
      small.textContent = acc;
      el.appendChild(small);
    }
    const color = M.keySignatureColors[k];
    if (color) el.style.setProperty('--kc', color);
    el.setAttribute('aria-label', 'Key: ' + M.displayKey(k));
  }

  function changeKey(newKey) {
    if (!Object.prototype.hasOwnProperty.call(M.KEY_SIGNATURES_CHROMATIC_INDEX, newKey)) {
      console.warn('Attempted to change to invalid key: ' + newKey);
      return;
    }
    S.key = newKey;
    paintKeyLetter();
    applyNoteColors();
    notationContainer.querySelectorAll('.harmony-stack[data-v]').forEach(st => applyStackValue(st, st.dataset.v));
    resetAccidentalToggleVisuals();
    SW.bus.emit('key:changed', { key: newKey });
  }

  /* The song's scale (major, natural minor, Dorian, blues …): what ↑ ↓,
     the letter keys and the harmony button write (PITCH above), what
     each block is called, the chord panel, the keyboard's colours and
     the staff's key signature — and, with Layout settings → Keys →
     "Melody follows the scale" on (the default), the melody itself:
     choosing a scale MOVES the notes into it (morphToScale), so C major
     → C minor turns every mi into me. Off, the notes already written stay
     as they are. Loading a song (quiet) never moves anything. */
  function setScale(id, quiet) {
    const valid = typeof Theory !== 'undefined' && Theory.SCALE_BY_ID[id] ? id : 'major';
    const was = S.scale;
    S.scale = valid;
    // the key's spelling can change with the scale (D♭ major, C♯ minor)
    paintKeyLetter();
    if (was === valid && quiet) return;
    let moved = null;
    if (!quiet && was !== valid) {
      if (SW.settings.layout.scaleMorph !== false) {
        moved = morphToScale(was, valid);
        if (SW.track) SW.track.followScale();       // the panel's chords in the progressions follow too (track.js, D16)
      }
      else getAllNotes().forEach(remember);       // the notes stay: they are this scale's version now
    }
    applyNoteColors();
    SW.bus.emit('scale:changed', { scale: valid, moved: moved ? moved.count : 0 });
    if (!quiet) changed('scale');
    if (moved && moved.count) {
      const sc = Theory.SCALE_BY_ID[valid];
      const steps = moved.steps.length > 6 ? moved.steps.slice(0, 6).concat('…') : moved.steps;
      SW.ui.toast(moved.count + (moved.count === 1 ? ' note' : ' notes') + ' moved into ' + sc.name + ': ' + steps.join(', '));
    }
  }

  /* MORPH — the melody shown in another scale. Each note becomes its
     version for the new scale (pitchIn, SCALE MEMORY above): the version
     fine-tuned there with ♯ or ♭ if there is one; otherwise the scale's
     own form of the note's step —
       • each scale gives each step of do re mi fa so la ti an alteration
         (mi in major, me in minor), so mi → me → mi;
       • a ♯ or ♭ put in for another scale is not carried over (the Star-
         Spangled Banner's fi in major is plain fa in minor, and fi again
         back in major);
       • a scale that skips steps borrows them from its parent — major
         pentatonic from major, minor pentatonic and blues from natural
         minor — and a note on a skipped step moves to the nearest note
         the scale has, the lower of two as near: fa → mi and ti → do′
         into major pentatonic, re → me and le → so into minor pentatonic.
     Nothing is lost on the way: every note keeps its step and every
     scale's fine-tuning, so any scale can be shown again as it was.
     Returns what moved (count, and "mi → me" steps). */
  const MORPH_PARENT = { 'major-pentatonic': 'major', 'minor-pentatonic': 'natural-minor', blues: 'natural-minor' };
  function frameOf(id) {
    const own = M.stepAlters(id);
    const parent = MORPH_PARENT[id] ? M.stepAlters(MORPH_PARENT[id]) : {};
    const out = {};
    for (let num = 1; num <= 7; num++) {
      const a = own[num] !== undefined ? own[num] : parent[num] !== undefined ? parent[num] : 0;
      out[num] = Math.max(-1, Math.min(1, a));
    }
    return out;
  }
  function morphToScale(fromId, toId) {
    if (typeof Theory === 'undefined') return null;
    const steps = {};
    let count = 0, any = false;
    getAllNotes().forEach(n => {
      const was = { nc: M.noteClassOf(n), acc: getAccidentalFromNote(n) };
      if (!was.nc) return;
      const now = pitchIn(n, toId);
      if (was.nc === now.nc && was.acc === now.acc) return;
      n.dataset.step = stepOf(n);                    // the melody's rung stays, whatever is shown
      setNotePitch(n, now.nc, now.acc);
      if (n.dataset.step === now.nc) delete n.dataset.step;
      any = true;
      if (n.classList.contains('rest-note')) return;          // a rest moves silently
      count++;
      const label = M.solfegeOf(was.nc, was.acc).toLowerCase() + ' → ' + M.solfegeOf(now.nc, now.acc).toLowerCase();
      steps[label] = (M.noteMidi(was.nc, was.acc) % 12 + 12) % 12;
    });
    if (any) {
      notationContainer.querySelectorAll('.harmony-stack').forEach(updateHarmonyStackVisuals);
      updateAllLineHeights();
      const active = getActiveNote();
      if (active) syncAccidentalToggle(active); else resetAccidentalToggleVisuals();
    }
    return { count, steps: Object.keys(steps).sort((x, y) => steps[x] - steps[y]) };
  }

  /* ================= SELECTION & NAVIGATION ================= */
  function selectionDetail(sounded) {
    const note = currentNoteIndex >= 0 ? getActiveNote() : null;
    return {
      note,
      stack: note ? note.closest('.harmony-stack') : null,
      syllable: note ? note.closest('.syllable') : null,
      line: note ? note.closest('.notation-line') : null,
      sounded: !!sounded
    };
  }
  function emitSelection(sounded) { SW.bus.emit('selection', selectionDetail(sounded)); }

  function enterDeselectedState(boundary) {
    getAllSyllables().forEach(s => s.classList.remove('highlighted'));
    getAllNotes().forEach(n => n.classList.remove('selected-note'));
    currentNoteIndex = -1;
    currentSyllableIndex = -1;
    currentRowTop = null;
    navigationOffEndState = boundary;
    resetAccidentalToggleVisuals();
    resetDeleteConfirmation();
    updateAllButtonStates();
    emitSelection(false);
  }

  /* ================= SOUNDING A SELECTED COLUMN =================
     A pitch a tie holds over into this column (timing.js TIES) is still
     sounding from the note before, so stepping onto, clicking or writing
     the column does not strike it again — as in playback. The column's
     other notes still sound. */
  function heldIn(stack) {
    const line = stack && stack.closest('.notation-line');
    if (!line) return null;
    const ev = SW.timing.lineEvents(line).events.find(e => e.stack === stack);
    return ev && ev.tiedIn && ev.tiedIn.size ? ev.tiedIn : null;
  }
  const struck = (note, held) => !held || !held.has(M.noteMidi(M.noteClassOf(note) || 'do', getAccidentalFromNote(note)));
  function soundColumn(noteElement) {
    const stack = noteElement.closest('.harmony-stack');
    const held = heldIn(stack);
    if (stack && stack.querySelectorAll('.note').length > 1) {
      stack.querySelectorAll('.note').forEach(n => { if (struck(n, held)) A.playNoteElement(n); });
    } else if (struck(noteElement, held)) A.playNoteElement(noteElement);
  }
  function soundNote(noteElement) {
    if (noteElement && struck(noteElement, heldIn(noteElement.closest('.harmony-stack')))) A.playNoteElement(noteElement);
  }

  function setNoteAsActive(noteElement, playSound) {
    if (!noteElement) return;
    const notes = Array.from(getAllNotes());
    const newIndex = notes.indexOf(noteElement);
    if (newIndex < 0) return;
    if (newIndex !== currentNoteIndex || navigationOffEndState !== null) {
      resetAccidentalToggleVisuals();
      resetDeleteConfirmation();
    }
    currentNoteIndex = newIndex;
    navigationOffEndState = null;
    notes.forEach(n => n.classList.remove('selected-note'));
    noteElement.classList.add('selected-note');
    const parentSyllable = noteElement.closest('.syllable');
    const syllables = Array.from(getAllSyllables());
    currentSyllableIndex = syllables.indexOf(parentSyllable);
    syllables.forEach(s => s.classList.remove('highlighted', 'sel-own'));
    if (parentSyllable) {
      parentSyllable.classList.add('highlighted');
      // 2.5: is the selected column the one the word belongs to (its first)?
      const stack = noteElement.closest('.harmony-stack');
      parentSyllable.classList.toggle('sel-own', !!stack && parentSyllable.querySelector('.notes-container > .harmony-stack') === stack);
      scrollToSyllable(parentSyllable);
    }
    if (playSound !== false) soundColumn(noteElement);
    if (S.editing) syncAccidentalToggle(noteElement);
    updateAllButtonStates();
    emitSelection(playSound !== false);
  }

  function setSyllableAsActive(syllable) {
    if (!syllable) return;
    const notes = syllable.querySelectorAll('.note');
    if (notes.length > 0) setNoteAsActive(notes[0], true);
  }

  function navigateLeft() {
    const stacks = getAllHarmonyStacks();
    if (stacks.length === 0) return;
    const activeNote = getActiveNote();
    const currentStack = activeNote ? (activeNote.closest('.harmony-stack') || activeNote) : null;
    // 2.5: in Edit, the piece of a tied note drawn before this one is a step too (flow.js stepPiece)
    const piece = SW.flow && navigationOffEndState === null ? SW.flow.stepPiece(currentStack, -1) : null;
    if (piece) { setNoteAsActive(piece.querySelector('.note') || piece, true); return; }
    const idx = currentStack ? stacks.indexOf(currentStack) : -1;
    if (idx === 0) {
      enterDeselectedState('beforeStart');
    } else if (navigationOffEndState === 'beforeStart') {
      const t = stacks[stacks.length - 1];
      setNoteAsActive(t.querySelector('.note') || t, true);
    } else {
      const ni = idx === -1 ? stacks.length - 1 : (idx - 1 + stacks.length) % stacks.length;
      const t = stacks[ni];
      setNoteAsActive(t.querySelector('.note') || t, true);
    }
  }

  function navigateRight() {
    let stacks = getAllHarmonyStacks();
    if (stacks.length === 0) return;
    const activeNote = getActiveNote();
    const currentStack = activeNote ? (activeNote.closest('.harmony-stack') || activeNote) : null;
    // 2.5: in Edit, a note's drawn pieces (tied over a bar line, or the
    // rests that finish the line) are steps of their own (flow.js stepPiece)
    const piece = SW.flow && navigationOffEndState === null ? SW.flow.stepPiece(currentStack, 1) : null;
    if (piece) { setNoteAsActive(piece.querySelector('.note') || piece, true); return; }
    const idx = currentStack ? stacks.indexOf(currentStack) : -1;
    if (idx === stacks.length - 1) {
      enterDeselectedState('afterEnd');
    } else if (navigationOffEndState === 'afterEnd') {
      const t = stacks[0];
      setNoteAsActive(t.querySelector('.note') || t, true);
    } else {
      const ni = idx === -1 ? 0 : (idx + 1) % stacks.length;
      const t = stacks[ni];
      setNoteAsActive(t.querySelector('.note') || t, true);
    }
  }

  function editCurrentNote(direction) {
    if (S.editing && currentNoteIndex >= 0) {
      const activeNote = getActiveNote();
      if (activeNote) changeNote(activeNote, direction, true);
    }
  }

  function selectHarmonyNote(direction) {
    if (currentNoteIndex < 0) return;
    const activeNote = getActiveNote();
    if (!activeNote) return;
    const stack = activeNote.closest('.harmony-stack');
    if (!stack) return;
    const notes = Array.from(stack.querySelectorAll('.note'));
    if (notes.length <= 1) return;
    const asc = notes.slice().sort((a, b) => getNotePitchIndex(a) - getNotePitchIndex(b));
    const i = asc.indexOf(activeNote);
    if (i === -1) return;
    const t = direction === 'up' ? (i + 1) % asc.length : (i - 1 + asc.length) % asc.length;
    setNoteAsActive(asc[t], false);
    soundNote(asc[t]);
  }

  /* ================= CLICKS ================= */
  function handleNoteClick(noteElement) {
    if (noteClickAudioTimer) { clearTimeout(noteClickAudioTimer); noteClickAudioTimer = null; }
    setNoteAsActive(noteElement, false);
    const sound = () => soundColumn(noteElement);
    if (S.editing) {
      // a double-click (to type its word) cancels this before it sounds (1.0: 190 ms)
      noteClickAudioTimer = setTimeout(() => { sound(); noteClickAudioTimer = null; }, 190);
    } else {
      sound();
    }
  }

  /* A double-click (a double tap) on a note opens the word under it for
     typing; a connected note gets a word of its own, as a double-click in
     the words' row under it does. (It used to move the note a step — 1.0's
     halves of the block; gone, user 2026-10-26: ↑ ↓ and the keys do that.) */
  function handleNoteDblClick(noteElement) {
    if (!S.editing || !can('words')) return;
    if (noteClickAudioTimer) { clearTimeout(noteClickAudioTimer); noteClickAudioTimer = null; }
    const syl = noteElement.closest('.syllable');
    if (!syl) return;
    openWordAt(syl, ownStacks(syl).indexOf(noteElement.closest('.harmony-stack')));
  }

  function handleSyllableClick(syllable) {
    const activeNote = getActiveNote();
    if (activeNote && activeNote.closest('.syllable') === syllable) return;
    const notes = syllable.querySelectorAll('.note');
    if (notes.length > 0) setNoteAsActive(notes[0], true);
  }

  /* Delete / Backspace: two presses (1.0). */
  function handleDeleteClick() {
    if (!S.editing || currentSyllableIndex < 0 || !can('structure')) return;
    if (!deleteConfirmationState) {
      deleteConfirmationState = true;
      SW.ui.toast('Press again to delete this syllable', 3000);
      SW.bus.emit('edit:armed', { armed: true });
      clearTimeout(deleteTimer);
      deleteTimer = setTimeout(resetDeleteConfirmation, 3000);
    } else {
      deleteSyllable();
    }
  }
  function isDeleteArmed() { return deleteConfirmationState; }

  /* New line in the Edit box: the selected word starts a new line (the
     user's fix, 2026-10-01 — it used to be the word after it), so Join up
     on it joins it straight back (DECISIONS D12). A line's first word
     already starts one: greyed there (newLineState). */
  function splitLineAt(syl) {
    const line = syl && syl.closest('.notation-line');
    if (!line) return null;
    const own = Array.from(line.querySelectorAll(':scope > .syllable'));
    const at = own.indexOf(syl);
    if (at <= 0) return null;
    const newLine = createNewLineElement(true);
    own.slice(at).forEach(s => newLine.appendChild(s));
    line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    line.after(newLine);
    updateLineBackgrounds();
    updateLineHeight(line);
    updateLineHeight(newLine);
    updateSectionActionButtonsState();
    return newLine;
  }
  function currentSyllable() {
    return currentSyllableIndex >= 0 ? getAllSyllables()[currentSyllableIndex] || null : null;
  }
  function newLineState() {
    const syl = currentSyllable();
    const line = syl && syl.closest('.notation-line');
    return { can: S.editing && can('structure') && !!line && line.querySelector(':scope > .syllable') !== syl };
  }
  function newLineAfterCurrent() {
    if (!newLineState().can) return;
    const syl = currentSyllable();
    const active = getActiveNote();
    if (!splitLineAt(syl)) return;
    if (active && document.contains(active) && syl.contains(active)) setNoteAsActive(active, false);
    else setSyllableAsActive(syl);
    changed('line');
  }
  function handleEnterKeyClick() { newLineAfterCurrent(); }

  /* A double tap on a finger or a pen. The browser's dblclick is not sent
     for touches everywhere (an iPad sends none), so on touch screens and
     smart boards two taps on the same block, close in time and place, are
     taken as the double-click here; the click the second tap makes is
     swallowed, and a dblclick the browser does send is not acted on twice. */
  let lastTap = null;
  let tapDoubleAt = 0;
  let lastWordTap = null, wordTapAt = 0;
  function onScorePointerUp(e) {
    if (e.pointerType === 'mouse') return;
    const note = noteAt(e);
    // 2.5: a double tap in the words' row under a connected note gives it a word
    if (!note && S.editing) {
      const now = performance.now();
      if (lastWordTap && now - lastWordTap.t < 420 && Math.hypot(e.clientX - lastWordTap.x, e.clientY - lastWordTap.y) < 28) {
        lastWordTap = null;
        if (wordUnderColumn(e)) { tapDoubleAt = now; wordTapAt = now; return; }
      } else lastWordTap = { t: now, x: e.clientX, y: e.clientY };
    }
    if (!note || !S.editing) { lastTap = null; return; }
    const now = performance.now();
    if (lastTap && lastTap.note === note && now - lastTap.t < 420 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 28) {
      lastTap = null;
      tapDoubleAt = now;
      wordTapAt = now;                    // the click after it must not close the word it opens
      handleNoteDblClick(note);
    } else {
      lastTap = { note, t: now, x: e.clientX, y: e.clientY };
    }
  }

  /* One listener for the whole score (see the note at the top). */
  function onScoreClick(e) {
    const t = e.target;
    // the click that follows a double tap that opened a word (touch): it must not close it again
    if (performance.now() - wordTapAt < 450) { e.stopPropagation(); return; }
    if (performance.now() - tapDoubleAt < 400 && t.closest('.note')) return;   // the second tap of a double tap
    if (t.closest('.text-input') || t.closest('.line-head')) return;
    const slot = t.closest('.chord-slot');
    if (slot) {
      if (SW.lane && SW.lane.slotClicked) SW.lane.slotClicked(slot, e);
      return;
    }
    // 2.5: on a written line, the head, rest or piece DRAWN nearest the tap
    // (staff.js hitAt) — not the clear block under it, nor its word
    if (!t.closest('.text')) {
      const hit = staffHit(t, e);
      if (hit) { e.stopPropagation(); handleNoteClick(hit, e); return; }
    }
    const note = t.closest('.note');
    if (note) { e.stopPropagation(); handleNoteClick(note, e); return; }
    const text = t.closest('.text');
    if (text && S.editing && !currentlyEditingText && can('words')) {
      e.stopPropagation();
      startTextEdit(text);
      return;
    }
    const syllable = t.closest('.syllable');
    if (syllable) { e.stopPropagation(); handleSyllableClick(syllable); }
  }
  /* The note element for a tap on a written line's drawing, or null.
     A piece or filler is made real first (flow.js realize, Edit only;
     in Perform its note is simply the one it belongs to). */
  function staffHit(t, e) {
    const line = t.closest('.notation-line.has-staff');
    if (!line || !SW.staff || !SW.staff.hitAt || t.closest('.chord-slot') || t.closest('.line-head')) return null;
    const hit = SW.staff.hitAt(line, e.clientX, e.clientY);
    if (!hit) return null;
    let stack = hit.stack;
    if (hit.kind !== 'col' && S.editing && SW.flow) stack = SW.flow.realize(hit.stack, hit.index) || hit.stack;
    const notes = stack.querySelectorAll('.note');
    return notes[hit.noteIdx] || notes[0] || null;
  }
  function onScoreDblClick(e) {
    if (e.target.closest('.line-head')) return;
    if (performance.now() - tapDoubleAt < 600) return;                          // already taken as a double tap
    if (wordUnderColumn(e)) { e.stopPropagation(); return; }                     // 2.5: a word for a connected note
    const note = noteAt(e);
    if (note) { e.stopPropagation(); handleNoteDblClick(note); }
  }
  /* The note a double-click (a double tap) is on: on a written line the
     column drawn nearest (staff.js hitAt), else the block under it. */
  function noteAt(e) {
    const t = e.target;
    if (t.closest('.text, .text-input, .chord-slot, .line-head')) return null;
    const line = t.closest('.notation-line.has-staff');
    const hit = line && SW.staff && SW.staff.hitAt ? SW.staff.hitAt(line, e.clientX, e.clientY) : null;
    if (hit) {
      const notes = hit.stack.querySelectorAll('.note');
      return notes[hit.noteIdx] || notes[0] || null;
    }
    return t.closest('.note');
  }

  /* ================= THE MODEL ================= */
  function readScore() {
    const out = { v: 2, key: S.key };
    if (S.scale && S.scale !== 'major') out.scale = S.scale;                  // the chord panel's scale (chords.js)
    if (S.meter !== SW.meters.DEFAULT) out.meter = S.meter;
    if (S.bpm !== SW.meters.DEFAULT_BPM) out.bpm = S.bpm;
    const board = SW.chords ? SW.chords.boardModel() : {};
    if (Object.keys(board).length) out.board = board;                        // re-chorded places on the panel
    if (SW.track) Object.assign(out, SW.track.model());                       // progressions + the chord track (js/track.js), when there are any
    out.lines = Array.from(notationContainer.querySelectorAll('.notation-line')).map(readLine);
    return out;
  }
  /* One line of the model (also SW.score.readLine, for the flow engine). */
  function readLine(line) {
    const label = line.querySelector('.line-label');
    const syllables = [];
    line.querySelectorAll('.syllable').forEach(syl => {
      // a whole word on the Pitch page is read as the syllables it holds (WORDS IN SYLLABLES)
      if (isJoined(syl)) {
        const pieces = piecesOf(syl);
        pieces.forEach((p, k) => {
          const sy = { text: p.text };
          if (p.chord) sy.chord = p.chord;
          if (k < pieces.length - 1 || syl.dataset.hy) sy.hy = true;
          sy.cols = p.stacks.map(readColumn);
          syllables.push(sy);
        });
        return;
      }
      const text = syl.querySelector('.text');
      const sy = { text: text ? text.textContent : '-' };
      if (syl.dataset.chord) sy.chord = syl.dataset.chord;
      if (syl.dataset.hy) sy.hy = true;                      // the word goes on in the next syllable
      sy.cols = Array.from(syl.querySelectorAll('.harmony-stack')).map(readColumn);
      syllables.push(sy);
    });
    const lineOut = { label: label ? label.value.trim() : '', syllables };
    if (line.dataset.pickup && SW.values.isValid(line.dataset.pickup)) lineOut.pickup = line.dataset.pickup;   // it opens with a pick-up (PICK-UPS)
    return lineOut;
  }
  function readColumn(stack) {
    const col = {
      notes: Array.from(stack.querySelectorAll('.note')).map(n => {
        const spec = { n: M.noteClassOf(n) || 'do' };
        const acc = getAccidentalFromNote(n);
        if (acc !== 'natural') spec.acc = acc;
        if (n.classList.contains('rest-note')) spec.rest = true;
        // the other scales' versions (SCALE MEMORY): the step when
        // another rung is shown, and each fine-tuned scale's pitch
        if (stepOf(n) !== spec.n) spec.step = stepOf(n);
        const alts = altsOf(n), alt = {};
        Object.keys(alts).forEach(id => {
          if (id === S.scale) return;
          const p = unpackPitch(alts[id]);
          if (p) alt[id] = p.acc === 'natural' ? { n: p.nc } : { n: p.nc, acc: p.acc };
        });
        if (Object.keys(alt).length) spec.alt = alt;
        return spec;
      })
    };
    if (isNotated(stack)) col.v = stack.dataset.v;
    if (stack.dataset.tie) col.tie = true;
    return col;
  }

  /* Swap a line's syllables for a model's (2.5, the flow engine): the line
     element, its head, name and pick-up stay; every syllable is drawn new
     from `lineModel.syllables` (normalized first, as render does). The
     caller puts the selection back. Not an edit by itself — no changed(). */
  function replaceLine(line, lineModel) {
    if (!line || !lineModel) return;
    finishTextEdit();
    const norm = normalizeScore({ v: 2, key: S.key, scale: S.scale, meter: S.meter, lines: [lineModel] }).lines[0];
    line.querySelectorAll(':scope > .syllable, :scope > .row-break').forEach(el => el.remove());
    norm.syllables.forEach(sy => line.appendChild(createNewSyllable(sy.text, sy.cols, sy.chord, sy.hy)));
    if (norm.pickup) line.dataset.pickup = norm.pickup; else delete line.dataset.pickup;
    currentNoteIndex = -1;
    currentSyllableIndex = -1;
    joinWords([line]);
    updateLineHeight(line);
  }

  /* Draw a score from scratch. Like 1.0's createNewLineFromText 'replace',
     it ends with the first note selected and silent. */
  function renderScore(model) {
    const score = normalizeScore(model);
    if (SW.player && SW.player.stop) SW.player.stop();
    if (score.key !== S.key) changeKey(score.key);
    setScale(score.scale, true);
    S.board = JSON.parse(JSON.stringify(score.board || {}));
    if (SW.track) SW.track.load(score);                                        // progressions + the chord track
    setMeter(score.meter, true);
    setTempo(score.bpm, true);
    finishTextEdit();
    notationContainer.innerHTML = '';
    currentNoteIndex = -1;
    currentSyllableIndex = -1;
    currentRowTop = null;
    navigationOffEndState = null;
    score.lines.forEach(l => {
      const line = createNewLineElement(true);
      const label = line.querySelector('.line-label');
      label.value = l.label || '';
      sizeLabel(label);
      if (l.pickup) line.dataset.pickup = l.pickup;
      l.syllables.forEach(s => line.appendChild(createNewSyllable(s.text, s.cols, s.chord, s.hy)));
      notationContainer.appendChild(line);
    });
    joinedPage = SW.settings && SW.settings.page ? SW.settings.page() : null;
    joinWords();
    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    updateAllButtonStates();
    SW.bus.emit('score:loaded', {});
    const first = notationContainer.querySelector('.note');
    if (first) setNoteAsActive(first, false);
    else emitSelection(false);
    if (stageEl) stageEl.scrollTop = 0;
  }

  /* Anything read from storage, a file or a link comes through here, so
     nothing downstream has to guess what it is holding. */
  function normalizeScore(raw) {
    const out = { v: 2, key: 'C', scale: 'major', board: {}, meter: SW.meters.DEFAULT, bpm: SW.meters.DEFAULT_BPM, lines: [] };
    if (!raw || typeof raw !== 'object') return out;
    if (raw.key && M.KEY_SIGNATURES_CHROMATIC_INDEX[raw.key] !== undefined) out.key = raw.key;
    if (typeof raw.scale === 'string' && typeof Theory !== 'undefined' && Theory.SCALE_BY_ID[raw.scale]) out.scale = raw.scale;
    // the chord panel's re-chorded places: { place: { root, q, mods, label? } } — only what the engine can read
    if (raw.board && typeof raw.board === 'object' && SW.chords) {
      SW.chords.PLACES.forEach(place => {
        const sp = SW.chords.parse(raw.board[place]);
        if (!sp) return;
        const keep = { root: sp.root, q: sp.q, mods: sp.mods };
        if (sp.label) keep.label = sp.label;
        out.board[place] = keep;
      });
    }
    if (SW.meters.isValid(raw.meter)) out.meter = raw.meter;
    if (raw.bpm !== undefined && raw.bpm !== null) out.bpm = SW.meters.clampBpm(raw.bpm);
    // a line's pick-up (PICK-UPS): a value shorter than a bar. Until
    // 2026-10-01 `pickup: 1` gave every line a beat — each line that had not
    // had its own taken away (`pickup: false`) keeps it, as a quarter.
    const legacyPickup = raw.pickup === 1 || raw.pickup === true;
    const pickupOk = id => typeof id === 'string' && SW.values.isValid(id) && SW.values.byId(id).ticks < SW.meters.byId(out.meter).barTicks;
    (Array.isArray(raw.lines) ? raw.lines : []).forEach(l => {
      if (!l || typeof l !== 'object') return;
      const line = { label: typeof l.label === 'string' ? l.label.slice(0, 15) : '', syllables: [] };
      if (pickupOk(l.pickup)) line.pickup = l.pickup;
      else if (legacyPickup && l.pickup !== false) line.pickup = SW.values.DEFAULT;
      (Array.isArray(l.syllables) ? l.syllables : []).forEach(s => {
        if (!s || typeof s !== 'object') return;
        const syl = { text: typeof s.text === 'string' && s.text.length ? s.text : '-', cols: [] };
        if (typeof s.chord === 'string' && s.chord) syl.chord = s.chord;
        if (s.hy === true) syl.hy = true;
        (Array.isArray(s.cols) ? s.cols : []).forEach((c, ci) => {
          const notes = (c && Array.isArray(c.notes) ? c.notes : []).filter(n => n && noteOrder.indexOf(n.n) !== -1).map(n => {
            const spec = { n: n.n };
            if (n.acc === 'sharp' || n.acc === 'flat') spec.acc = n.acc;
            if (n.rest) spec.rest = true;
            if (typeof n.step === 'string' && noteOrder.indexOf(n.step) !== -1 && n.step !== n.n) spec.step = n.step;
            if (n.alt && typeof n.alt === 'object') {
              const alt = {};
              Object.keys(n.alt).forEach(id => {
                const a = n.alt[id];
                if (id === out.scale || typeof Theory === 'undefined' || !Theory.SCALE_BY_ID[id]) return;
                if (!a || noteOrder.indexOf(a.n) === -1) return;
                alt[id] = (a.acc === 'sharp' || a.acc === 'flat') ? { n: a.n, acc: a.acc } : { n: a.n };
              });
              if (Object.keys(alt).length) spec.alt = alt;
            }
            return spec;
          });
          if (!notes.length) notes.push({ n: 'do' });
          // a GHOST (2.5, 2026-10-01 → 10-26: a note the rhythm made past the melody,
          // `cols[].ghost`) is read as the silence it stood in for — a rest on its
          // word; one that was given a word of its own is simply a note (flow.js R2)
          if (c && c.ghost === true && !(ci === 0 && (syl.text !== '-' || syl.chord))) notes.forEach(n => { n.rest = true; delete n.alt; delete n.step; });
          const col = { notes };
          if (c && SW.values.isValid(c.v)) col.v = c.v;
          if (c && c.tie === true && col.v) col.tie = true;
          syl.cols.push(col);
        });
        if (!syl.cols.length) syl.cols.push({ notes: [{ n: 'do' }] });
        line.syllables.push(syl);
      });
      // a tie holds only onto a written note right after it that shares a
      // pitch (timing.js TIES); any other tie mark is dropped here, so the
      // flow never takes two different notes for one sound
      const flat = [];
      line.syllables.forEach(sy => sy.cols.forEach(c => flat.push(c)));
      const allRest = c => c.notes.every(n => n.rest);
      flat.forEach((c, i) => {
        if (!c.tie) return;
        const nx = flat[i + 1];
        const ok = nx && c.v && nx.v && !allRest(c) && !allRest(nx) &&
          c.notes.some(a => !a.rest && nx.notes.some(b => !b.rest && b.n === a.n && (b.acc || 'natural') === (a.acc || 'natural')));
        if (!ok) delete c.tie;
      });
      out.lines.push(line);
    });
    // progressions and the chord track (js/track.js) — added only when there
    // are some, so every song saved before reads exactly as it did
    if (SW.track) SW.track.normalizeInto(raw, out);
    return out;
  }

  /* ---- 1.0's text format ---- */
  function pitchToken(n, acc) {
    let sh = noteToShorthandMap[n] || 'D1';
    if (acc === 'sharp') sh = sh.replace(/([A-Z])/, '$1#');
    else if (acc === 'flat') sh = sh.replace(/([A-Z])/, '$1b');
    return sh;
  }
  /* A note's other-scale versions ride after it (SCALE MEMORY):
     `F1^step=F1` the step when another rung is shown, `^major=F#1` a
     scale's fine-tuned pitch — so R1^major=R#1 is re here, ri in major. */
  function noteToken(spec) {
    let sh = pitchToken(spec.n, spec.acc);
    if (spec.rest) sh += '~';
    if (spec.step) sh += '^step=' + pitchToken(spec.step);
    Object.keys(spec.alt || {}).forEach(id => { sh += '^' + id + '=' + pitchToken(spec.alt[id].n, spec.alt[id].acc); });
    return sh;
  }
  function scoreToText(model) {
    const score = normalizeScore(model || readScore());
    let body = '';
    score.lines.forEach(line => {
      body += `[${line.label || 'New Line'}]\n`;
      if (line.pickup) body += `[Pickup ${line.pickup}]\n`;
      body += line.syllables.map(s => {
        const cols = s.cols.map(c => c.notes.map(noteToken).join('+') + (c.v ? ':' + c.v : '') + (c.tie ? '_' : '')).join(',');
        return (s.chord ? `{${s.chord}}` : '') + `${s.text}${s.hy ? '-' : ''}[${cols}]`;
      }).join(' ') + '\n';
    });
    let head = `[Key of ${score.key}]\n`;
    if (score.scale && score.scale !== 'major') head += `[Scale ${score.scale}]\n`;
    if (score.meter !== SW.meters.DEFAULT) head += `[Time ${score.meter}]\n`;
    if (score.bpm !== SW.meters.DEFAULT_BPM) head += `[Tempo ${score.bpm}]\n`;
    return head + body.trim();
  }

  /* 1.0's parseNoteShorthand, extended with the `:value` suffix. A rest
     mark may sit either side of the value (`S1~:h` or `S1:h~`). */
  function parseNoteShorthand(shorthand) {
    let noteClass = 'do', accidentalType = 'natural', isRest = false, value = null;
    let clean = String(shorthand).trim();
    // the other scales' versions (noteToken): ^step=F1 ^major=F#1
    let step = null;
    const alt = {};
    clean = clean.replace(/\^[^:~*]+/g, m => {
      m.slice(1).split('^').forEach(pair => {
        const eq = pair.indexOf('=');
        if (eq < 1) return;
        const k = pair.slice(0, eq).trim().toLowerCase();
        const p = parseNoteShorthand(pair.slice(eq + 1));
        if (k === 'step') step = p.noteClass;
        else alt[k] = p.accidentalType === 'natural' ? { n: p.noteClass } : { n: p.noteClass, acc: p.accidentalType };
      });
      return '';
    });
    const restMark = s => (s.endsWith('~') || s.endsWith('*'));
    if (restMark(clean)) { isRest = true; clean = clean.slice(0, -1); }
    const vm = clean.match(/:(w\.|w|h\.|h|q\.|q|e\.|e|s)$/i);
    if (vm) { value = vm[1].toLowerCase(); clean = clean.slice(0, -vm[0].length); }
    if (restMark(clean)) { isRest = true; clean = clean.slice(0, -1); }
    const m = clean.match(/^([A-Z])([#b]?)?(-?\d+)$/i);
    if (m) {
      const mapped = shorthandToNoteMap[m[1].toUpperCase() + m[3]];
      if (mapped) {
        noteClass = mapped;
        const acc = m[2] || '';
        if (acc === '#') accidentalType = 'sharp';
        else if (acc.toLowerCase() === 'b') accidentalType = 'flat';
      }
    }
    return { noteClass, accidentalType, isRest, value, step, alt };
  }

  function textToScore(text) {
    let songText = String(text || '');
    let key = S.key;
    const keyMatch = songText.match(/^\s*\[Key of (.*?)\]\n?/);
    if (keyMatch) {
      if (M.KEY_SIGNATURES_CHROMATIC_INDEX[keyMatch[1]] !== undefined) key = keyMatch[1];
      songText = songText.substring(keyMatch[0].length);
    }
    let meter = SW.meters.DEFAULT, bpm = SW.meters.DEFAULT_BPM, scale = 'major', pickup = 0;
    songText = songText.replace(/^\s*\[Scale ([^\]]+)\]\n?/i, (m, t) => { scale = t.trim(); return ''; });
    songText = songText.replace(/^\s*\[Time ([^\]]+)\]\n?/i, (m, t) => { if (SW.meters.isValid(t.trim())) meter = t.trim(); return ''; });
    songText = songText.replace(/^\s*\[Tempo ([^\]]+)\]\n?/i, (m, t) => { bpm = SW.meters.clampBpm(t); return ''; });
    songText = songText.replace(/^\s*\[Pickup ([^\]]+)\]\n?/i, (m, t) => { pickup = parseInt(t, 10) === 1 ? 1 : 0; return ''; });
    if (songText.trim() && !songText.trim().startsWith('[')) songText = '[New Line]\n' + songText;

    const score = { v: 2, key, scale, meter, bpm, pickup, lines: [] };
    let current = null;
    songText.trim().split('\n').forEach(raw => {
      const lineText = raw.trim();
      // a line's pick-up: [Pickup e] under its name (a song-wide [Pickup 1] is read off the head above)
      const pk = lineText.match(/^\[Pickup ([^\]]+)\]$/i);
      if (pk) { if (current && SW.values.isValid(pk[1].trim())) current.pickup = pk[1].trim(); return; }
      if (lineText.startsWith('[Key of') || /^\[(Time|Tempo|Scale) /i.test(lineText)) return;
      const label = lineText.match(/^\[(.*)\]$/);
      if (label) {
        current = { label: label[1] !== 'New Line' ? label[1] : '', syllables: [] };
        score.lines.push(current);
        return;
      }
      if (!lineText.length || !current) return;
      lineText.split(/\s+/).filter(Boolean).forEach(token => {
        let chord = null;
        const cm = token.match(/^\{([^}]*)\}(.+)$/);
        if (cm) { chord = cm[1].trim() || null; token = cm[2]; }
        let lyric = token;
        let cols = [{ notes: [{ n: 'do' }] }];
        const mm = token.match(/(.+)\[(.*)\]$/i);
        if (mm) {
          lyric = mm[1];
          const colStrings = mm[2].split(',').map(s => s.trim()).filter(Boolean);
          if (colStrings.length) {
            cols = [];
            colStrings.forEach(cs => {
              const col = { notes: [] };
              if (cs.endsWith('_')) { col.tie = true; cs = cs.slice(0, -1); }   // tied to the next column
              cs.split('+').map(s => s.trim()).filter(Boolean).forEach(sh => {
                const p = parseNoteShorthand(sh);
                const spec = { n: p.noteClass };
                if (p.accidentalType !== 'natural') spec.acc = p.accidentalType;
                if (p.isRest) spec.rest = true;
                if (p.step) spec.step = p.step;
                if (Object.keys(p.alt).length) spec.alt = p.alt;
                col.notes.push(spec);
                if (p.value) col.v = p.value;
              });
              if (col.notes.length) cols.push(col);
            });
            if (!cols.length) cols = [{ notes: [{ n: 'do' }] }];
          }
        }
        // a - after the word: it goes on in the next syllable; a - before it: the word
        // before goes on into it (the old way of writing Wa -ter) — WORDS IN SYLLABLES
        let hy = false;
        if (lyric === '--') { lyric = '-'; hy = true; }
        else if (lyric.length > 1 && /-$/.test(lyric) && /[^-]/.test(lyric)) { lyric = lyric.replace(/-+$/, ''); hy = true; }
        if (lyric.length > 1 && lyric[0] === '-' && /[^-]/.test(lyric)) {
          lyric = lyric.replace(/^-+/, '');
          const prevLine = current.syllables.length ? current : score.lines[score.lines.length - 2];
          const prev = prevLine && prevLine.syllables[prevLine.syllables.length - 1];
          if (prev) prev.hy = true;
        }
        const syl = { text: lyric, cols };
        if (chord) syl.chord = chord;
        if (hy) syl.hy = true;
        current.syllables.push(syl);
      });
    });
    return normalizeScore(score);
  }

  /* ================= SONG WORDS (1.0's text editor, words only) =================
     1.0's editor showed the whole song in its save format, a bracket of
     pitches after every word. The editor now shows only the words —
     syllables separated by spaces, an EMPTY line between song lines (a
     line of text that just wraps on carries on in the same song line: the
     user, 2026-10-26 — one song line per text line made a new line of
     music at every line break of a pasted lyric) — and applying puts the
     edited words back onto the notes already there, in order:
       • a line keeps its title, notes, values and chords;
       • extra words get a new note (do, as 1.0's + did); fewer words drop
         the notes at the end of that line;
       • extra paragraphs become new lines; missing ones are removed.
     Text pasted in 1.0's bracketed format is still understood (and read
     as a whole song), so an old song can be pasted straight in. */
  /* The words view writes a word's syllables joined by hyphens (wa-ter-
     mel-on) — a hyphen there IS a syllable break, one note each (WORDS IN
     SYLLABLES). A hyphen inside one syllable's own text (ice-cream sung on
     one note) is written as a non-breaking hyphen (‑), which looks the
     same and is not a break. An old song's Wa -ter -me -lon is shown as
     the one word it meant (Set to the notes stores it that way). */
  const NB_HYPHEN = '‑';
  function scoreToWords(model) {
    return normalizeScore(model || readScore()).lines.map(l => {
      return wordsOfLine(l.syllables).map(w => w.map(sy => {
        const t = legacyBare(sy.text);
        if (t === '-') return w.length > 1 ? '' : '-';
        return t.replace(/-/g, NB_HYPHEN);
      }).join('-') + (w.open ? '-' : '')).join(' ');
    }).join('\n\n');
  }
  /* The words view's song lines: paragraphs (an empty line between), each
     one line of words however many lines of text it was typed on. */
  function wordParagraphs(text) {
    return String(text || '').replace(/\r\n?/g, '\n').split(/\n[ \t]*\n/)
      .map(p => p.split('\n').map(r => r.trim()).filter(Boolean).join(' '))
      .filter(p => p.length);
  }
  /* a syllable's text without the dash an old song put against it (-ter, Wa-) */
  function legacyBare(t) {
    if (!t || t === '-' || !/[^-]/.test(t)) return t || '-';
    return t.replace(/^-+/, '').replace(/-+$/, '') || '-';
  }
  /* a line's syllables as words: runs joined by `hy` (or an old song's dashes) */
  function wordsOfLine(syls) {
    const words = [];
    syls.forEach((sy, i) => {
      const prev = syls[i - 1];
      const legacy = prev && ((/^-[^-]/.test(sy.text)) || (/[^-]-$/.test(prev.text)));
      if (prev && (prev.hy || legacy)) words[words.length - 1].push(sy);
      else words.push([sy]);
      words[words.length - 1].open = !!sy.hy && i === syls.length - 1;
    });
    return words;
  }
  function looksBracketed(text) {
    return /^\s*\[Key of /.test(text) || /\S\[[^\]]*\]/.test(text);
  }
  /* One text line of the words view → its words, each a list of syllable
     texts. A hyphen inside a token breaks it (wa-ter); a token that starts
     with one joins the word before (-ter, the old way); one that ends with
     one runs on into the next token, or the next line (wa-). A lone - is a
     syllable with no word. */
  function parseWordsLine(row) {
    const words = [];
    let open = false;
    row.split(/\s+/).filter(Boolean).forEach(tok => {
      let t = tok, joinPrev = false, joinNext = false;
      if (/[^-]/.test(t)) {
        if (t[0] === '-') { joinPrev = true; t = t.replace(/^-+/, ''); }
        if (/-$/.test(t)) { joinNext = true; t = t.replace(/-+$/, ''); }
      }
      const pieces = /[^-]/.test(t) ? t.split('-').map(p => (p || '-').replace(/‑/g, '-')) : ['-'];
      if ((joinPrev || open) && words.length) words[words.length - 1].push(...pieces);
      else words.push(pieces);
      open = joinNext;
    });
    return { words, open };
  }
  /* A word's notes for its new syllables: as many syllables as before, each
     keeps its own notes; else the notes are dealt out in order — one a
     syllable, the last keeps any left over (a held syllable), and a word
     short of notes gets copies of its last (+ Note Only's way). A
     syllable's lane chord stays with its first note. */
  function dealWord(oldSyls, pieces) {
    if (oldSyls.length === pieces.length) return oldSyls.map((sy, j) => Object.assign({}, sy, { text: pieces[j] }));
    const cols = [];
    oldSyls.forEach(sy => sy.cols.forEach((c, k) => cols.push({ c, chord: k === 0 ? sy.chord : null })));
    const out = pieces.map(p => ({ text: p, cols: [] }));
    cols.forEach((o, k) => {
      const owner = out[Math.min(k, out.length - 1)];
      owner.cols.push(o.c);
      if (o.chord && !owner.chord) owner.chord = o.chord;
    });
    for (let j = 1; j < out.length; j++) {
      if (out[j].cols.length) continue;
      const last = out[j - 1].cols[out[j - 1].cols.length - 1];
      const copy = JSON.parse(JSON.stringify(last));
      delete copy.tie;
      out[j].cols.push(copy);
    }
    // a new syllable is a new attack: no tie runs into it
    out.forEach((sy, j) => {
      if (j === out.length - 1) return;
      const end = sy.cols[sy.cols.length - 1];
      if (end && end.tie) { const c = Object.assign({}, end); delete c.tie; sy.cols[sy.cols.length - 1] = c; }
    });
    return out;
  }
  /* Your words back onto the song. The notes stay where they are and the
     words land on them in order, a WORD at a time (2026-10-26): a word now
     split into syllables (watermelon → wa-ter-mel-on) spreads over its own
     notes, one a syllable, and the words after it keep theirs. When the
     number of words changed, syllables land in order as before (so wa ter
     → wa-ter just joins them); extra words get a new note (do), fewer
     drop the notes at the end of the line. */
  function wordsToScore(text, model) {
    const score = normalizeScore(model || readScore());
    const rows = wordParagraphs(text);
    const lines = rows.map((row, i) => {
      const old = score.lines[i] || { label: '', syllables: [] };
      const parsed = parseWordsLine(row);
      const neu = parsed.words;
      const oldWords = wordsOfLine(old.syllables).map(w => w.slice());
      const flatNew = [].concat(...neu);
      let syllables = [];
      if (neu.length === oldWords.length) {
        neu.forEach((pieces, k) => { syllables = syllables.concat(dealWord(oldWords[k], pieces)); });
      } else if (flatNew.length === old.syllables.length) {
        syllables = flatNew.map((p, j) => Object.assign({}, old.syllables[j], { text: p }));
      } else {
        neu.forEach((pieces, k) => {
          syllables = syllables.concat(oldWords[k] ? dealWord(oldWords[k], pieces) : pieces.map(p => ({ text: p, cols: [{ notes: [{ n: 'do' }] }] })));
        });
      }
      // the hyphens are the ones typed now
      let at = 0;
      neu.forEach((pieces, k) => {
        pieces.forEach((p, j) => {
          const sy = syllables[at++];
          if (!sy) return;
          delete sy.hy;
          if (j < pieces.length - 1 || (k === neu.length - 1 && parsed.open)) sy.hy = true;
        });
      });
      return { label: old.label, pickup: old.pickup, syllables };
    });
    // the song keeps its key, scale, panel and time (2.0 dropped meter and tempo here)
    return normalizeScore(Object.assign({}, score, { lines }));
  }

  /* Your words (the Write button). Two views: the words alone, fitted
     back onto the notes; or 1.0's whole song text with its brackets, for
     copying and pasting whole songs (DECISIONS D14). */
  const WORDS_SUB = {
    words: 'Leave an empty line between the lines of the song — lines of text with no gap between them stay together in one line of music. Each syllable gets a note: a hyphen between the syllables of a word (twin-kle, twin-kle), a space between words. The notes stay where they are and the words land on them in order. Extra words get a new note; words you delete take their note with them.',
    notes: 'The whole song as text, the way Song Writer 1.0 wrote it: each word with its notes in brackets — Twin[D1] kle[D1:q] — and {I} for a chord. Copy it to keep or send; paste one in and Set to the notes replaces the song.'
  };
  function fillTextEditor(view) {
    wordsView = view === 'notes' ? 'notes' : 'words';
    const score = readScore();
    textEditorText.value = wordsView === 'notes' ? scoreToText(score) : scoreToWords(score);
    textEditorText.classList.toggle('mono', wordsView === 'notes');
    const sub = $('text-editor-sub');
    if (sub) sub.textContent = WORDS_SUB[wordsView];
    document.querySelectorAll('#words-view-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.wordsView === wordsView));
  }
  function showTextEditorPopup() {
    if (!S.editing || !can('textEditor')) return;
    if (SW.library) SW.library.save();
    fillTextEditor('words');
    SW.ui.openSheet('textEditorPopup');
    setTimeout(() => { textEditorText.focus(); textEditorText.select(); }, 60);
  }
  function hideTextEditorPopup() {
    SW.ui.closeSheet('textEditorPopup');
    textEditorText.value = '';
  }
  function handleTextEditorSubmit() {
    const text = textEditorText.value;
    let next = looksBracketed(text) ? textToScore(text) : wordsToScore(text);
    // the 1.0 text has no chord track: the song keeps its own (track.js — the
    // chords keep their bars whatever the melody does)
    if (looksBracketed(text) && SW.track) next = Object.assign({}, next, SW.track.model());
    renderScore(next);
    changed('text-editor');
    hideTextEditorPopup();
  }

  /* ================= WIRING ================= */
  function init() {
    notationContainer.addEventListener('click', onScoreClick);
    // a tap on the manuscript itself — a line's background, the space under
    // the last line — takes the chord's notes off the keyboard (a note, a
    // word, a slot or a section head handles its own tap; user, 2026-09-27)
    if (stageEl) stageEl.addEventListener('click', e => {
      if (e.target.closest('.note, .syllable, .chord-slot, .line-head, .text-input, .add-line-row, .edit-box')) return;
      if (SW.chords && SW.chords.clearSounding) SW.chords.clearSounding();
    });
    notationContainer.addEventListener('dblclick', onScoreDblClick);
    notationContainer.addEventListener('pointerup', onScorePointerUp);
    // the mousedown a touch sends after a double tap that opened a word would blur it shut
    notationContainer.addEventListener('mousedown', e => { if (performance.now() - wordTapAt < 500) e.preventDefault(); });

    if (editToggleBtn) editToggleBtn.addEventListener('click', () => setEditing(!S.editing));

    if (textEditorBtn) textEditorBtn.addEventListener('click', showTextEditorPopup);
    $('cancelTextEditor').addEventListener('click', hideTextEditorPopup);
    $('submitTextEditor').addEventListener('click', handleTextEditorSubmit);
    textEditorText.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); hideTextEditorPopup(); } });
    const seg = $('words-view-seg');
    if (seg) seg.addEventListener('click', e => {
      const b = e.target.closest('.seg-btn');
      if (b && b.dataset.wordsView !== wordsView) fillTextEditor(b.dataset.wordsView);
    });
    $('copyLyricsBtn').addEventListener('click', () => {
      SW.ui.copyText(textEditorText.value).then(ok => {
        const label = $('copyLyricsBtnText');
        if (label) label.textContent = ok ? 'Copied' : 'Select and copy';
        setTimeout(() => { if (label) label.textContent = 'Copy'; }, 2000);
      });
    });

    $('cancelDeleteSectionBtn').addEventListener('click', hideDeleteSectionModal);
    $('confirmDeleteSectionBtn').addEventListener('click', confirmDeleteSection);

    $('nameToggle').addEventListener('click', toggleNames);
    const addLine = $('add-line-btn');
    if (addLine) addLine.addEventListener('click', e => { e.stopPropagation(); appendEmptyLine(); });

    // 1.0's document-level housekeeping
    document.addEventListener('click', e => {
      if (currentlyEditingText && !e.target.closest('.syllable.editing') && !isAdvancingToNext) finishTextEdit();
      if (deleteConfirmationState) resetDeleteConfirmation();
    });

    setNames(false);
    updateAllButtonStates();
    // Pitch shows each word whole; Notation and Rhythm its syllables (WORDS IN SYLLABLES)
    SW.bus.on('view:changed', fitWordsToPage);
  }

  SW.score = {
    init,
    // model
    read: readScore, render: renderScore, normalize: normalizeScore, readLine, replaceLine,
    toText: scoreToText, fromText: textToScore, toWords: scoreToWords, fromWords: wordsToScore,
    // selection & navigation
    getActiveNote, getAllNotes, getAllSyllables, getAllHarmonyStacks,
    setNoteAsActive, setSyllableAsActive, navigateLeft, navigateRight,
    deselect: enterDeselectedState,
    editCurrentNote, selectHarmonyNote, emitSelection,
    // editing
    handleSolfegeKeyInput, handleDeleteClick, isDeleteArmed, setActiveNoteMidi,
    getAccidentalFromNote, getStackValue, isNotated, applyStackValue,
    notateAll, writeAllBlocks, clearAllValues, notateLine, clearLineValues, selectNextStack,
    toggleRestOnCurrentNote, insertRestAfterCurrent, unrestColumn,
    // the Edit box's note, syllable and word tools (edit-box.js)
    handleAccidentalClick, duplicateCurrentNote, removeCurrentConnectedNote, deleteCurrentNote, deleteNoteState,
    addHarmonyNote, removeHarmonyNote, connectedState, harmonyState,
    addSyllableAfterCurrent, newLineAfterCurrent, handleEnterKeyClick, joinLineWithPrevious,
    joinUp, joinState, newLineState, toggleTie, tieState, soundNote,
    // pick-ups (PICK-UPS)
    pickupState, makePickup, setPickupValue, removePickup, togglePickup, firstPickup, setFirstPickup, cutPickupBar,
    // lines and sections
    appendEmptyLine, moveSection, duplicateSection, requestDeleteSection,
    // the song's time
    setMeter, setTempo,
    // modes
    setEditing, toggleEditMode, setNames, toggleNames, setColours, toggleColorScheme, changeKey, setScale,
    isTyping: () => !!currentlyEditingText,
    finishTextEdit,
    setWordAt,          // a word typed on the Rhythm page
    submitWords: handleTextEditorSubmit,   // the Write window's Set to the notes (syllable-review.js)
    isJoined,
    // refresh after settings change
    refreshGates() {
      if (!can('edit') && S.editing) setEditing(false);
      notationContainer.querySelectorAll('.line-label').forEach(l => { l.readOnly = !labelEditable(); });
      updateAllButtonStates();
    },
    changed
  };
})();

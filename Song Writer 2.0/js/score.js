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
                                 cols: [ { v: 'h',             // omitted = a block
                                           notes: [ { n: 'do', acc: 'sharp', rest: true } ] } ] } ] } ] }

   TEXT FORMAT (1.0's, extended; a 1.0 song parses unchanged)
     [Key of C]
     [Time 3/4]                                            (optional; [Tempo 96] likewise)
     [A]
     {I}Twin[D1] kle[D1:q] {V}twin[S1,S1:e] kle[S1+M1:h] rest[D1~]
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

  const DONT_ASK_DELETE_SECTION_KEY = 'song_writer_2_skip_delete_section_confirm';

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
  /* Two taps to delete a syllable (1.0's rule): the first arms Delete in
     the Edit box — it turns red and pulses for three seconds. */
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

  /* ================= PITCH ================= */
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
    const currentNoteClass = M.noteClassOf(activeNote);
    if (currentNoteClass) activeNote.classList.remove(currentNoteClass);
    activeNote.classList.add(noteClass);
    removeAccidentalFromNote(activeNote);
    resetAccidentalToggleVisuals();
    updateNoteDisplay(activeNote, noteClass);
    if (!activeNote.classList.contains('rest-note')) {
      const frequency = A.getFrequencyForNote(noteClass);
      if (frequency !== null) A.playNote(frequency);
    }
    const harmonyStack = activeNote.closest('.harmony-stack');
    if (harmonyStack) updateHarmonyStackVisuals(harmonyStack);
    const idx = Array.from(getAllNotes()).indexOf(activeNote);
    if (idx >= 0) currentNoteIndex = idx;
    updateLineHeight(activeNote.closest('.notation-line'));
    emitSelection(false);
    changed('pitch');
    return true;
  }

  /* 1.0: changeNote. Up and down walk the allowed notes and wrap, as 1.0
     wrapped over all eighteen. */
  function changeNote(noteElement, direction, playSound) {
    if (!can('pitch')) return;
    const currentNoteClass = M.noteClassOf(noteElement);
    if (!currentNoteClass) return;
    const allowed = allowedNotes();
    const up = direction !== 'down';
    const cur = noteOrder.indexOf(currentNoteClass);
    let nextNote;
    if (allowed.length === noteOrder.length) {
      const i = up ? (cur + 1) % noteOrder.length : (cur - 1 + noteOrder.length) % noteOrder.length;
      nextNote = noteOrder[i];
    } else {
      const idxs = allowed.map(n => noteOrder.indexOf(n));
      const next = up ? idxs.find(i => i > cur) : idxs.slice().reverse().find(i => i < cur);
      nextNote = noteOrder[next !== undefined ? next : (up ? idxs[0] : idxs[idxs.length - 1])];
    }
    noteElement.classList.remove(currentNoteClass);
    noteElement.classList.add(nextNote);
    removeAccidentalFromNote(noteElement);
    resetAccidentalToggleVisuals();
    updateNoteDisplay(noteElement, nextNote);
    const harmonyStack = noteElement.closest('.harmony-stack');
    if (harmonyStack) updateHarmonyStackVisuals(harmonyStack);
    const idx = Array.from(getAllNotes()).indexOf(noteElement);
    if (idx >= 0) currentNoteIndex = idx;
    if (playSound !== false && !noteElement.classList.contains('rest-note')) {
      const frequency = A.getFrequencyForNote(nextNote);
      if (frequency !== null) A.playNote(frequency);
    }
    updateLineHeight(noteElement.closest('.notation-line'));
    emitSelection(false);
    changed('pitch');
  }

  /* Set a block to a pitch given as MIDI — the keyboard dock uses this.
     Finds the note class (and ♯/♭, within 1.0's accidental rules) that
     sounds that pitch in the current key. Returns false if none does. */
  function setActiveNoteMidi(midi) {
    if (!S.editing || !can('pitch')) return false;
    const note = getActiveNote();
    if (!note) return false;
    const allowed = allowedNotes();
    // the usual chromatic spellings: ra me le te are flats, fi is a sharp
    const tonic = M.KEY_SIGNATURES_CHROMATIC_INDEX[S.key] || 0;
    const rel = ((midi - tonic) % 12 + 12) % 12;
    const accs = !can('accidentals') ? ['natural'] : rel === 6 ? ['natural', 'sharp', 'flat'] : ['natural', 'flat', 'sharp'];
    let found = null;
    for (const acc of accs) {
      for (const nc of allowed) {
        if (M.noteMidi(nc, acc) !== midi) continue;
        const sol = noteToSolfege[nc];
        if (acc === 'flat' && (sol === 'Do' || sol === 'Fa')) continue;
        if (acc === 'sharp' && (sol === 'Mi' || sol === 'Ti')) continue;
        found = { nc, acc };
        break;
      }
      if (found) break;
    }
    if (!found) return false;
    const current = M.noteClassOf(note);
    if (current) note.classList.remove(current);
    note.classList.add(found.nc);
    addAccidentalToNote(note, found.acc);
    updateNoteDisplay(note, found.nc);
    syncAccidentalToggle(note);
    const stack = note.closest('.harmony-stack');
    if (stack) updateHarmonyStackVisuals(stack);
    emitSelection(false);
    changed('pitch');
    return true;
  }

  /* ================= ACCIDENTALS ================= */
  function addAccidentalToNote(noteElement, accidentalType) {
    removeAccidentalFromNote(noteElement);
    if (accidentalType === 'natural') return;
    const span = document.createElement('span');
    span.className = 'accidental-symbol';
    span.textContent = accidentalType === 'sharp' ? '♯' : '♭';
    noteElement.appendChild(span);
  }
  function removeAccidentalFromNote(noteElement) {
    const existing = noteElement.querySelector('.accidental-symbol');
    if (existing) existing.remove();
  }
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

  /* ================= COLOUR & NAMES ================= */
  function applyNoteColors() {
    const colors = M.noteColorsByKey[S.key];
    const letters = M.letterNamesByKey[S.key];
    notationContainer.querySelectorAll('.note').forEach(noteElement => {
      const noteClass = Array.from(noteElement.classList).find(c => noteToSolfege[c]);
      if (!noteClass) return;
      const sol = noteToSolfege[noteClass];
      const color = colors[sol];
      const letterName = letters[sol];
      if (!noteElement.classList.contains('rest-note') && color) noteElement.style.backgroundColor = color;
      const letterEl = noteElement.querySelector('.letter-name');
      if (letterEl && letterName) {
        letterEl.textContent = letterName;
        if (!noteElement.classList.contains('rest-note')) letterEl.style.color = color;
      }
    });
  }

  function updateNoteDisplay(noteElement, noteClass) {
    const sol = noteToSolfege[noteClass];
    const color = M.noteColorsByKey[S.key][sol];
    const letterName = M.letterNamesByKey[S.key][sol];
    if (!noteElement.classList.contains('rest-note') && color) noteElement.style.backgroundColor = color;
    const letterEl = noteElement.querySelector('.letter-name');
    if (letterEl && letterName) {
      letterEl.textContent = letterName;
      if (!noteElement.classList.contains('rest-note')) letterEl.style.color = color;
    }
    const solEl = noteElement.querySelector('.solfege-name');
    if (solEl) solEl.textContent = sol ? sol.toLowerCase() : '';
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
    if (direction === 'up' && index > 0) notationContainer.insertBefore(lineElement, lines[index - 1]);
    else if (direction === 'down' && index < lines.length - 1) lines[index + 1].after(lineElement);
    else return;
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
     With Layout settings → 1-beat pick-up on, every line opens with a
     one-beat pick-up (timing.js PICK-UP) — until it is taken away, on
     that line only (data-pickup="off"; `pickup: false` in the model):
       • Join up on the pick-up takes just that beat up to the end of the
         line above; the rest of the line stays where it is and starts on
         a downbeat. Join up again (its first word is selected for it)
         joins the whole line, as ever.
       • Delete on the pick-up deletes that beat, and a rest in the line
         above fills the bar the pick-up used to finish.
     A new line (↵ New line) opens with a pick-up again. Only a pick-up
     that is a beat of its own counts (timing.pickupSyllables): one whose
     note runs on past the beat, or that is the whole line, is an ordinary
     word to these buttons. */
  function previousLine(line) {
    const prev = line && line.previousElementSibling;
    return prev && prev.classList.contains('notation-line') ? prev : null;
  }
  /* The selected syllable's line pick-up, when the selection is in it. */
  function pickupAt(syl) {
    const line = syl && syl.closest('.notation-line');
    const pk = line ? SW.timing.pickupSyllables(line) : null;
    return pk && !pk.whole && pk.syllables.indexOf(syl) !== -1 ? Object.assign({ line }, pk) : null;
  }
  function selectedSyllable() {
    const note = (S.editing && currentNoteIndex >= 0) ? getActiveNote() : null;
    return note ? note.closest('.syllable') : null;
  }
  function pickupSelected() { return !!pickupAt(selectedSyllable()); }

  /* What Join up would do for the selection: the pick-up alone, the whole
     line (its first word), or nothing (the first line, or mid-line). */
  function joinState() {
    const syl = selectedSyllable();
    const line = syl && syl.closest('.notation-line');
    if (!line || !previousLine(line) || !can('structure')) return { can: false, pickup: false };
    if (pickupAt(syl)) return { can: true, pickup: true };
    return { can: line.querySelector(':scope > .syllable') === syl, pickup: false };
  }
  function joinUp() {
    const st = joinState();
    if (!st.can) return false;
    const syl = selectedSyllable();
    const line = syl.closest('.notation-line');
    if (!st.pickup) return joinLineWithPrevious(line);
    const pk = pickupAt(syl);
    const prev = previousLine(line);
    pk.syllables.forEach(s => prev.appendChild(s));
    line.dataset.pickup = 'off';
    [prev, line].forEach(l => { l.querySelectorAll(':scope > .row-break').forEach(b => b.remove()); updateLineHeight(l); });
    updateSectionActionButtonsState();
    // the line's first word is selected, so Join up again joins the whole line
    const first = line.querySelector('.note');
    if (first) setNoteAsActive(first, false);
    SW.ui.toast('The pick-up joined the line above — Join up again joins the whole line');
    changed('line');
    return true;
  }

  /* Delete on a pick-up: the beat goes, and rests fill what it left open
     of the bar above (in the line above's own values: a rest block when
     that line ends in a block and a beat is all there is to fill). */
  function deletePickup(pk) {
    const line = pk.line, prev = previousLine(line);
    let rests = [];
    if (prev && can('rest')) {
      const pe = SW.timing.lineEvents(prev);
      const B = pe.meter.barTicks;
      let open = (B - (pe.total + pe.shift) % B) % B;
      const last = pe.events[pe.events.length - 1];
      const n = last && last.pitches.length ? last.pitches[0].nc : (last && last.notes[0] ? M.noteClassOf(last.notes[0]) : 'do') || 'do';
      if (open && last && !last.notated && open === pe.meter.beatTicks) {
        rests = [{ notes: [{ n, rest: true }] }];
      } else if (open) {
        const vals = SW.settings.allowedValues().map(id => SW.values.byId(id)).sort((a, b) => b.ticks - a.ticks);
        vals.forEach(v => { while (open >= v.ticks) { rests.push({ v: v.id, notes: [{ n, rest: true }] }); open -= v.ticks; } });
        if (open) rests = [];                 // the values offered cannot fill it: the silence does
      }
    }
    clearTimeout(deleteTimer);
    deleteConfirmationState = false;
    rests.forEach(col => prev.appendChild(createNewSyllable('-', [col])));
    pk.syllables.forEach(s => s.remove());
    line.dataset.pickup = 'off';
    [prev, line].forEach(l => { if (l) { l.querySelectorAll(':scope > .row-break').forEach(b => b.remove()); updateLineHeight(l); } });
    updateSectionActionButtonsState();
    const first = line.querySelector('.note');
    if (first) setNoteAsActive(first, false);
    SW.bus.emit('edit:armed', { armed: false });
    SW.ui.toast(rests.length ? 'Pick-up deleted — a rest fills the bar above' : 'Pick-up deleted');
    changed('syllable');
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

  function createNoteElement(noteClass, accidental, isRest) {
    noteClass = noteClass || 'do';
    const sol = noteToSolfege[noteClass] || 'Do';
    const color = M.noteColorsByKey[S.key][sol];
    const letterName = M.letterNamesByKey[S.key][sol];
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note ' + noteClass;
    if (isRest) noteDiv.classList.add('rest-note');
    else if (color) noteDiv.style.backgroundColor = color;
    const letterDiv = document.createElement('div');
    letterDiv.className = 'letter-name';
    letterDiv.textContent = letterName || 'C';
    if (!isRest && color) letterDiv.style.color = color;
    const solDiv = document.createElement('div');
    solDiv.className = 'solfege-name';
    solDiv.textContent = sol.toLowerCase();
    noteDiv.appendChild(letterDiv);
    noteDiv.appendChild(solDiv);
    if (accidental && accidental !== 'natural') addAccidentalToNote(noteDiv, accidental);
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
     under the block is only shown when the staff is switched off. */
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
    mark.style.setProperty('--c', SW.values.colour(v));
    mark.innerHTML = SW.engrave.value(v, { height: 18, rest: allRest });
    mark.title = SW.values.byId(v).name;
  }

  /* 1.0's createNewSyllable, with the columns also accepting the 2.0 column
     shape { v, notes }. Kept tolerant of every shape 1.0 accepted. */
  function normalizeColumns(columns) {
    const spec = n => (typeof n === 'string')
      ? { n, acc: 'natural', rest: false }
      : { n: n.n || n.noteClass || 'do', acc: n.acc || n.accidental || 'natural', rest: !!(n.rest || n.isRest) };
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
    S.meter = id;
    SW.bus.emit('meter:changed', { meter: S.meter, bpm: S.bpm, what: 'meter' });
    if (!quiet) changed('meter');
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

  function createNewSyllable(syllableText, columns, chord) {
    const cols = normalizeColumns(columns === undefined ? [[{ n: 'do' }]] : columns);
    const syllableDiv = document.createElement('div');
    syllableDiv.className = 'syllable';
    if (chord) syllableDiv.dataset.chord = chord;

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
      col.notes.forEach(n => stack.appendChild(createNoteElement(n.n, n.acc, n.rest)));
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
    if (parentSyllable.querySelectorAll('.note').length >= 8) {
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
    const newNote = createNoteElement(M.noteClassOf(activeNote) || 'do', getAccidentalFromNote(activeNote), activeNote.classList.contains('rest-note'));
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
    currentStack.remove();
    updateLineHeight(parentSyllable.closest('.notation-line'));
    if (nextStack) {
      const nextNote = nextStack.querySelector('.note');
      if (nextNote) setNoteAsActive(nextNote, true);
    }
    changed('connected');
  }

  /* ================= TIES =================
     Tie (the Edit box's Rhythm section) holds the selected note over into
     a NEW note: the same pitches, an eighth (the value circles change it),
     right after it on the same syllable — a note with no syllable of its
     own, as + Note Only makes, tied to the one before. The new note is
     selected. On a bar's last beat it simply lands over the bar line, and
     the tie crosses it. The first column carries the tie (data-tie, `tie`
     in the model); timing.js pairs it with the next column's matching
     pitches, the staff draws the arc and the player sounds it once. Tie
     on a tied note unties it (both notes stay). A block has no length to
     hold, and a rest nothing to hold, so neither can be tied. */
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
    if (st.tied) {
      delete stack.dataset.tie;
      changed('tie');
      emitSelection(false);
      return;
    }
    const syl = stack.closest('.syllable');
    if (syl.querySelectorAll('.harmony-stack').length >= 8) {
      SW.ui.toast('Eight notes is the most one syllable can hold');
      return;
    }
    const held = document.createElement('div');
    held.className = 'harmony-stack';
    const notes = Array.from(stack.querySelectorAll('.note'));
    notes.forEach(n => held.appendChild(createNoteElement(M.noteClassOf(n) || 'do', getAccidentalFromNote(n), n.classList.contains('rest-note'))));
    updateHarmonyStackVisuals(held);
    stack.insertAdjacentElement('afterend', held);
    // an eighth, or the nearest length Layout settings offer
    const vals = SW.settings.allowedValues();
    const v = vals.indexOf('e') !== -1 ? 'e'
      : vals.slice().sort((a, b) => Math.abs(SW.values.byId(a).ticks - 12) - Math.abs(SW.values.byId(b).ticks - 12))[0];
    applyStackValue(held, v);
    stack.dataset.tie = '1';
    updateLineHeight(syl.closest('.notation-line'));
    const same = held.querySelectorAll('.note')[notes.indexOf(note)] || held.querySelector('.note');
    setNoteAsActive(same, false);
    changed('tie');
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
    // 1.0: two steps above, wrapping round the eighteen. Inside a
    // narrowed range: the first allowed note two or more steps up.
    const cur = noteOrder.indexOf(M.noteClassOf(activeNote) || 'do');
    const allowed = allowedNotes();
    let newNoteClass;
    if (allowed.length === noteOrder.length) {
      newNoteClass = noteOrder[(cur + 2) % noteOrder.length];
    } else {
      const idxs = allowed.map(n => noteOrder.indexOf(n));
      const up = idxs.find(i => i >= cur + 2);
      newNoteClass = noteOrder[up !== undefined ? up : idxs[0]];
    }
    const newNote = createNoteElement(newNoteClass, 'natural', false);
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
  function addSyllableAfterCurrent() {
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
    const pk = pickupAt(doomed);
    if (pk) { deletePickup(pk); return; }            // a pick-up goes as one beat (PICK-UPS)
    const parentLine = doomed.closest('.notation-line');
    clearTimeout(deleteTimer);
    deleteConfirmationState = false;
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
    input.value = textElement.textContent;
    textElement.style.display = 'none';
    textElement.parentNode.insertBefore(input, textElement);
    input.focus();
    input.select();
    SW.bus.emit('words:typing', { on: true });      // the Edit box greys its word tools
    input.addEventListener('blur', () => { if (!isAdvancingToNext) finishTextEdit(); });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') finishTextEdit();
      else if (e.key === 'Escape') cancelTextEdit();
      else if (e.key === ' ' && e.target.selectionStart === e.target.value.length) { e.preventDefault(); finishTextEditAndAdvance(); }
      else if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        e.preventDefault();
        finishTextEditAndGoBack();
      }
    });
    input.addEventListener('click', e => e.stopPropagation());
  }

  function closeInput(syllable) {
    const input = syllable.querySelector('.text-input');
    if (input) {
      currentlyEditingText.textContent = input.value.trim() || '-';
      input.remove();
      currentlyEditingText.style.display = '';
    }
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
    const currentSyllable = syllables[currentEditingIndex];
    const nextIndex = currentEditingIndex + 1;
    isAdvancingToNext = true;
    const syllable = currentlyEditingText.closest('.syllable');
    closeInput(syllable);
    syllable.classList.remove('editing');
    currentlyEditingText = null;
    currentEditingIndex = -1;
    changed('words');

    if (nextIndex < syllables.length) {
      const next = syllables[nextIndex];
      const nextText = next.querySelector('.text');
      if (nextText) {
        scrollToSyllable(next);
        setTimeout(() => { isAdvancingToNext = false; startTextEdit(nextText); }, 50);
      } else isAdvancingToNext = false;
    } else if (S.editing && can('structure')) {
      setSyllableAsActive(currentSyllable);
      const created = addSyllableAfterCurrent();
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

    // 1.0: backspace on a bare "-" removes the syllable itself
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
    if (input) { input.remove(); currentlyEditingText.style.display = ''; }
    syllable.classList.remove('editing');
    currentlyEditingText = null;
    currentEditingIndex = -1;
    isAdvancingToNext = false;
    SW.bus.emit('words:typing', { on: false });
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
      editToggleBtn.title = on ? 'Take off the construction hat (back to performing)' : 'Edit — put on the construction hat';
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
    const k = S.key;
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

  /* The song's scale (major, natural minor, Dorian …): what the chord
     panel offers and what the keyboard colours as "in the key" — and,
     with Layout settings → Keys → "Melody follows the scale" on (the
     default), what the melody is written in: choosing a scale MOVES the
     notes into it (morphToScale), so C major → C minor turns every mi
     into me and the whole feel changes. Off, the blocks stay 1.0's
     major-key blocks whatever the scale says. Loading a song (quiet)
     never moves anything. */
  function setScale(id, quiet) {
    const valid = typeof Theory !== 'undefined' && Theory.SCALE_BY_ID[id] ? id : 'major';
    const was = S.scale;
    S.scale = valid;
    if (was === valid && quiet) return;
    let moved = null;
    if (!quiet && was !== valid && SW.settings.layout.scaleMorph !== false) moved = morphToScale(was, valid);
    SW.bus.emit('scale:changed', { scale: valid, moved: moved ? moved.count : 0 });
    if (!quiet) changed('scale');
    if (moved && moved.count) {
      const sc = Theory.SCALE_BY_ID[valid];
      SW.ui.toast(moved.count + (moved.count === 1 ? ' note' : ' notes') + ' moved into ' + sc.name + ': ' + moved.steps.join(', '));
    }
  }

  /* MORPH — the melody re-written from one scale into another, degree by
     degree. A scale is a list of degrees relative to major ('b3', '#4'),
     so each solfège step has a "main" alteration in each scale (the one
     nearest natural, when a scale has two forms of a step, as blues has
     of the 5th). The rule:
       • a note on the old scale's step (mi in major, me in minor) moves
         to the new scale's step of that degree (mi → me → mi);
       • a note that was a deliberate accidental in the old scale (a fi in
         major, a mi in minor) is kept as it is;
       • a step the new scale does not have (fa in major pentatonic)
         keeps the note as it is;
       • a step the old scale did not have counts as natural, so re, la
         in minor pentatonic become re, le on the way to natural minor.
     Every alteration a scale asks for is a single ♯ or ♭, so 1.0's
     one-accidental blocks can always write it. Returns what moved. */
  const DEGREE_OF = { Do: 1, Re: 2, Mi: 3, Fa: 4, So: 5, La: 6, Ti: 7 };
  function scaleMainAlters(id) {
    const out = {};
    const sc = Theory.SCALE_BY_ID[id];
    if (!sc) return out;
    sc.degrees.forEach(d => {
      const p = Theory.parseDegree(d);
      if (out[p.num] === undefined || Math.abs(p.alter) < Math.abs(out[p.num])) out[p.num] = p.alter;
    });
    return out;
  }
  const accOf = alter => alter > 0 ? 'sharp' : alter < 0 ? 'flat' : 'natural';
  const alterOf = acc => acc === 'sharp' ? 1 : acc === 'flat' ? -1 : 0;
  function morphToScale(fromId, toId) {
    if (typeof Theory === 'undefined') return null;
    const from = scaleMainAlters(fromId), to = scaleMainAlters(toId);
    const steps = {};
    let count = 0;
    getAllNotes().forEach(n => {
      const nc = M.noteClassOf(n);
      if (!nc) return;
      const num = DEGREE_OF[noteToSolfege[nc]];
      const a = alterOf(getAccidentalFromNote(n));
      const oldAlt = from[num] === undefined ? 0 : from[num];
      if (a !== oldAlt) return;                        // a deliberate accidental: kept
      if (to[num] === undefined) return;               // no such step in the new scale: kept
      const newAlt = Math.max(-1, Math.min(1, to[num]));
      if (newAlt === a) return;
      addAccidentalToNote(n, accOf(newAlt));
      count++;
      const acc = x => x > 0 ? '#' : x < 0 ? 'b' : '';
      steps[num] = Theory.solfegeFor(acc(a) + num).toLowerCase() + ' → ' + Theory.solfegeFor(acc(newAlt) + num).toLowerCase();
    });
    if (count) {
      notationContainer.querySelectorAll('.harmony-stack').forEach(updateHarmonyStackVisuals);
      const active = getActiveNote();
      if (active) syncAccidentalToggle(active); else resetAccidentalToggleVisuals();
    }
    return { count, steps: Object.keys(steps).sort().map(k => steps[k]) };
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
    syllables.forEach(s => s.classList.remove('highlighted'));
    if (parentSyllable) {
      parentSyllable.classList.add('highlighted');
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
    const stacks = getAllHarmonyStacks();
    if (stacks.length === 0) return;
    const activeNote = getActiveNote();
    const currentStack = activeNote ? (activeNote.closest('.harmony-stack') || activeNote) : null;
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
      // a double-click cancels this before it sounds (1.0: 190 ms)
      noteClickAudioTimer = setTimeout(() => { sound(); noteClickAudioTimer = null; }, 190);
    } else {
      sound();
    }
  }

  function handleNoteDblClick(noteElement, event) {
    if (!S.editing) return;
    if (noteClickAudioTimer) { clearTimeout(noteClickAudioTimer); noteClickAudioTimer = null; }
    setNoteAsActive(noteElement, false);
    const rect = noteElement.getBoundingClientRect();
    const clickY = (event && typeof event.clientY === 'number') ? (event.clientY - rect.top) : rect.height / 2;
    changeNote(noteElement, clickY < rect.height / 2 ? 'up' : 'down', true);
  }

  function handleSyllableClick(syllable) {
    const activeNote = getActiveNote();
    if (activeNote && activeNote.closest('.syllable') === syllable) return;
    const notes = syllable.querySelectorAll('.note');
    if (notes.length > 0) setNoteAsActive(notes[0], true);
  }

  /* Delete in the Edit box, or Delete / Backspace: two presses (1.0). */
  function handleDeleteClick() {
    if (!S.editing || currentSyllableIndex < 0 || !can('structure')) return;
    if (!deleteConfirmationState) {
      deleteConfirmationState = true;
      SW.bus.emit('edit:armed', { armed: true });
      clearTimeout(deleteTimer);
      deleteTimer = setTimeout(resetDeleteConfirmation, 3000);
    } else {
      deleteSyllable();
    }
  }
  function isDeleteArmed() { return deleteConfirmationState; }

  /* New line in the Edit box: a new line starts after this word — one press
     (DECISIONS D12), because Join up on the new line's first word joins it straight
     back. On a line's last word the new line holds one "-" on do, so
     no line is ever left empty. */
  function newLineAfterCurrent() {
    if (!S.editing || currentSyllableIndex < 0 || !can('structure')) return;
    const syllables = getAllSyllables();
    const currentSyllable = syllables[currentSyllableIndex];
    if (!currentSyllable) return;
    const currentLine = currentSyllable.closest('.notation-line');
    const own = Array.from(currentLine.querySelectorAll(':scope > .syllable'));
    const at = own.indexOf(currentSyllable);
    if (at < 0) return;
    const newLine = createNewLineElement(true);
    const moved = own.slice(at + 1);
    if (moved.length) moved.forEach(s => newLine.appendChild(s));
    else newLine.appendChild(createNewSyllable());
    currentLine.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    currentLine.after(newLine);
    updateLineBackgrounds();
    updateLineHeight(currentLine);
    updateLineHeight(newLine);
    updateSectionActionButtonsState();
    setSyllableAsActive(newLine.querySelector('.syllable'));
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
  function onScorePointerUp(e) {
    if (e.pointerType === 'mouse') return;
    const note = e.target.closest('.note');
    if (!note || !S.editing) { lastTap = null; return; }
    const now = performance.now();
    if (lastTap && lastTap.note === note && now - lastTap.t < 420 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 28) {
      lastTap = null;
      tapDoubleAt = now;
      handleNoteDblClick(note, e);
    } else {
      lastTap = { note, t: now, x: e.clientX, y: e.clientY };
    }
  }

  /* One listener for the whole score (see the note at the top). */
  function onScoreClick(e) {
    const t = e.target;
    if (performance.now() - tapDoubleAt < 400 && t.closest('.note')) return;   // the second tap of a double tap
    if (t.closest('.text-input') || t.closest('.line-head')) return;
    const slot = t.closest('.chord-slot');
    if (slot) {
      if (SW.lane && SW.lane.slotClicked) SW.lane.slotClicked(slot, e);
      return;
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
  function onScoreDblClick(e) {
    if (e.target.closest('.line-head')) return;
    if (performance.now() - tapDoubleAt < 600) return;                          // already taken as a double tap
    const note = e.target.closest('.note');
    if (note) { e.stopPropagation(); handleNoteDblClick(note, e); }
  }

  /* ================= THE MODEL ================= */
  function readScore() {
    const out = { v: 2, key: S.key };
    if (S.scale && S.scale !== 'major') out.scale = S.scale;                  // the chord panel's scale (chords.js)
    if (S.meter !== SW.meters.DEFAULT) out.meter = S.meter;
    if (S.bpm !== SW.meters.DEFAULT_BPM) out.bpm = S.bpm;
    const board = SW.chords ? SW.chords.boardModel() : {};
    if (Object.keys(board).length) out.board = board;                        // re-chorded places on the panel
    out.lines = Array.from(notationContainer.querySelectorAll('.notation-line')).map(line => {
        const label = line.querySelector('.line-label');
        const lineOut = {
          label: label ? label.value.trim() : '',
          syllables: Array.from(line.querySelectorAll('.syllable')).map(syl => {
            const text = syl.querySelector('.text');
            const sy = { text: text ? text.textContent : '-' };
            if (syl.dataset.chord) sy.chord = syl.dataset.chord;
            sy.cols = Array.from(syl.querySelectorAll('.harmony-stack')).map(stack => {
              const col = {
                notes: Array.from(stack.querySelectorAll('.note')).map(n => {
                  const spec = { n: M.noteClassOf(n) || 'do' };
                  const acc = getAccidentalFromNote(n);
                  if (acc !== 'natural') spec.acc = acc;
                  if (n.classList.contains('rest-note')) spec.rest = true;
                  return spec;
                })
              };
              if (isNotated(stack)) col.v = stack.dataset.v;
              if (stack.dataset.tie) col.tie = true;
              return col;
            });
            return sy;
          })
        };
        if (line.dataset.pickup === 'off') lineOut.pickup = false;   // its pick-up was taken away (PICK-UPS)
        return lineOut;
      });
    return out;
  }

  /* Draw a score from scratch. Like 1.0's createNewLineFromText 'replace',
     it ends with the first note selected and silent. */
  function renderScore(model) {
    const score = normalizeScore(model);
    if (SW.player && SW.player.stop) SW.player.stop();
    if (score.key !== S.key) changeKey(score.key);
    setScale(score.scale, true);
    S.board = JSON.parse(JSON.stringify(score.board || {}));
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
      if (l.pickup === false) line.dataset.pickup = 'off';
      l.syllables.forEach(s => line.appendChild(createNewSyllable(s.text, s.cols, s.chord)));
      notationContainer.appendChild(line);
    });
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
    (Array.isArray(raw.lines) ? raw.lines : []).forEach(l => {
      if (!l || typeof l !== 'object') return;
      const line = { label: typeof l.label === 'string' ? l.label.slice(0, 15) : '', syllables: [] };
      if (l.pickup === false) line.pickup = false;
      (Array.isArray(l.syllables) ? l.syllables : []).forEach(s => {
        if (!s || typeof s !== 'object') return;
        const syl = { text: typeof s.text === 'string' && s.text.length ? s.text : '-', cols: [] };
        if (typeof s.chord === 'string' && s.chord) syl.chord = s.chord;
        (Array.isArray(s.cols) ? s.cols : []).forEach(c => {
          const notes = (c && Array.isArray(c.notes) ? c.notes : []).filter(n => n && noteOrder.indexOf(n.n) !== -1).map(n => {
            const spec = { n: n.n };
            if (n.acc === 'sharp' || n.acc === 'flat') spec.acc = n.acc;
            if (n.rest) spec.rest = true;
            return spec;
          });
          if (!notes.length) notes.push({ n: 'do' });
          const col = { notes };
          if (c && SW.values.isValid(c.v)) col.v = c.v;
          if (c && c.tie === true && col.v) col.tie = true;
          syl.cols.push(col);
        });
        if (!syl.cols.length) syl.cols.push({ notes: [{ n: 'do' }] });
        line.syllables.push(syl);
      });
      out.lines.push(line);
    });
    return out;
  }

  /* ---- 1.0's text format ---- */
  function noteToken(spec) {
    let sh = noteToShorthandMap[spec.n] || 'D1';
    if (spec.acc === 'sharp') sh = sh.replace(/([A-Z])/, '$1#');
    else if (spec.acc === 'flat') sh = sh.replace(/([A-Z])/, '$1b');
    if (spec.rest) sh += '~';
    return sh;
  }
  function scoreToText(model) {
    const score = normalizeScore(model || readScore());
    let body = '';
    score.lines.forEach(line => {
      body += `[${line.label || 'New Line'}]\n`;
      body += line.syllables.map(s => {
        const cols = s.cols.map(c => c.notes.map(noteToken).join('+') + (c.v ? ':' + c.v : '') + (c.tie ? '_' : '')).join(',');
        return (s.chord ? `{${s.chord}}` : '') + `${s.text}[${cols}]`;
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
    const restMark = s => (s.endsWith('~') || s.endsWith('*'));
    if (restMark(clean)) { isRest = true; clean = clean.slice(0, -1); }
    const vm = clean.match(/:(w|h\.|h|q\.|q|e\.|e|s)$/i);
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
    return { noteClass, accidentalType, isRest, value };
  }

  function textToScore(text) {
    let songText = String(text || '');
    let key = S.key;
    const keyMatch = songText.match(/^\s*\[Key of (.*?)\]\n?/);
    if (keyMatch) {
      if (M.KEY_SIGNATURES_CHROMATIC_INDEX[keyMatch[1]] !== undefined) key = keyMatch[1];
      songText = songText.substring(keyMatch[0].length);
    }
    let meter = SW.meters.DEFAULT, bpm = SW.meters.DEFAULT_BPM, scale = 'major';
    songText = songText.replace(/^\s*\[Scale ([^\]]+)\]\n?/i, (m, t) => { scale = t.trim(); return ''; });
    songText = songText.replace(/^\s*\[Time ([^\]]+)\]\n?/i, (m, t) => { if (SW.meters.isValid(t.trim())) meter = t.trim(); return ''; });
    songText = songText.replace(/^\s*\[Tempo ([^\]]+)\]\n?/i, (m, t) => { bpm = SW.meters.clampBpm(t); return ''; });
    if (songText.trim() && !songText.trim().startsWith('[')) songText = '[New Line]\n' + songText;

    const score = { v: 2, key, scale, meter, bpm, lines: [] };
    let current = null;
    songText.trim().split('\n').forEach(raw => {
      const lineText = raw.trim();
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
                col.notes.push(spec);
                if (p.value) col.v = p.value;
              });
              if (col.notes.length) cols.push(col);
            });
            if (!cols.length) cols = [{ notes: [{ n: 'do' }] }];
          }
        }
        const syl = { text: lyric, cols };
        if (chord) syl.chord = chord;
        current.syllables.push(syl);
      });
    });
    return normalizeScore(score);
  }

  /* ================= SONG WORDS (1.0's text editor, words only) =================
     1.0's editor showed the whole song in its save format, a bracket of
     pitches after every word. The editor now shows only the words — one
     text line per song line, syllables separated by spaces — and applying
     puts the edited words back onto the notes already there, in order:
       • a line keeps its title, notes, values and chords;
       • extra words get a new note (do, as 1.0's + did); fewer words drop
         the notes at the end of that line;
       • extra text lines become new lines; missing ones are removed.
     Text pasted in 1.0's bracketed format is still understood (and read
     as a whole song), so an old song can be pasted straight in. */
  function scoreToWords(model) {
    return normalizeScore(model || readScore()).lines
      .map(l => l.syllables.map(s => s.text).join(' ')).join('\n');
  }
  function looksBracketed(text) {
    return /^\s*\[Key of /.test(text) || /\S\[[^\]]*\]/.test(text);
  }
  function wordsToScore(text, model) {
    const score = normalizeScore(model || readScore());
    const rows = String(text || '').split('\n').map(r => r.trim()).filter(r => r.length);
    const lines = rows.map((row, i) => {
      const old = score.lines[i] || { label: '', syllables: [] };
      const words = row.split(/\s+/).filter(Boolean);
      return {
        label: old.label,
        pickup: old.pickup,
        syllables: words.map((w, j) => {
          const prev = old.syllables[j];
          return prev ? Object.assign({}, prev, { text: w }) : { text: w, cols: [{ notes: [{ n: 'do' }] }] };
        })
      };
    });
    // the song keeps its time (2.0 dropped meter and tempo here)
    return normalizeScore({ v: 2, key: score.key, meter: score.meter, bpm: score.bpm, lines });
  }

  /* Your words (the Write button). Two views: the words alone, fitted
     back onto the notes; or 1.0's whole song text with its brackets, for
     copying and pasting whole songs (DECISIONS D14). */
  const WORDS_SUB = {
    words: 'One line of text for each line of the song, with a space between syllables (Twin kle, twin kle). The notes stay where they are and the words land on them in order. Extra words get a new note; words you delete take their note with them.',
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
    renderScore(looksBracketed(text) ? textToScore(text) : wordsToScore(text));
    changed('text-editor');
    hideTextEditorPopup();
  }

  /* ================= WIRING ================= */
  function init() {
    notationContainer.addEventListener('click', onScoreClick);
    notationContainer.addEventListener('dblclick', onScoreDblClick);
    notationContainer.addEventListener('pointerup', onScorePointerUp);

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
      if (!e.target.closest('[data-tool="delete"]') && deleteConfirmationState) resetDeleteConfirmation();
    });

    setNames(false);
    updateAllButtonStates();
  }

  SW.score = {
    init,
    // model
    read: readScore, render: renderScore, normalize: normalizeScore,
    toText: scoreToText, fromText: textToScore, toWords: scoreToWords, fromWords: wordsToScore,
    // selection & navigation
    getActiveNote, getAllNotes, getAllSyllables, getAllHarmonyStacks,
    setNoteAsActive, setSyllableAsActive, navigateLeft, navigateRight,
    deselect: enterDeselectedState,
    editCurrentNote, selectHarmonyNote, emitSelection,
    // editing
    handleSolfegeKeyInput, handleDeleteClick, isDeleteArmed, setActiveNoteMidi,
    getAccidentalFromNote, getStackValue, isNotated, applyStackValue,
    notateAll, clearAllValues, notateLine, clearLineValues, selectNextStack,
    toggleRestOnCurrentNote,
    // the Edit box's note, syllable and word tools (edit-box.js)
    handleAccidentalClick, duplicateCurrentNote, removeCurrentConnectedNote,
    addHarmonyNote, removeHarmonyNote, connectedState, harmonyState,
    addSyllableAfterCurrent, newLineAfterCurrent, handleEnterKeyClick, joinLineWithPrevious,
    joinUp, joinState, pickupSelected, toggleTie, tieState, soundNote,
    // lines and sections
    appendEmptyLine, moveSection, duplicateSection, requestDeleteSection,
    // the song's time
    setMeter, setTempo,
    // modes
    setEditing, toggleEditMode, setNames, toggleNames, setColours, toggleColorScheme, changeKey, setScale,
    isTyping: () => !!currentlyEditingText,
    finishTextEdit,
    // refresh after settings change
    refreshGates() {
      if (!can('edit') && S.editing) setEditing(false);
      notationContainer.querySelectorAll('.line-label').forEach(l => { l.readOnly = !labelEditable(); });
      updateAllButtonStates();
    },
    changed
  };
})();

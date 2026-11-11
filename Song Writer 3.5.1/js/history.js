/* ==========================================================================
   Song Writer 3.5.1 — history.js
   --------------------------------------------------------------------------
   SW.history   Undo and Redo (SONG-WRITER-RHYTHM-PLAN.md, phase P0).

   The rhythm tools pour a whole line in one tap, so trying things must be
   free: every edit can be taken back. The history keeps whole scores (the
   model from SW.score.read()), never DOM: a step is the song as it stood
   after an edit, plus where the selection was.

     • every 'score:changed' is one step; a run of the same quick edit
       (tempo slider, ↑↓ on one note) within 700 ms folds into one —
       the same note only, so a fast run across notes stays separate
     • 'score:loaded' (a song opened) starts a fresh history
     • Undo / Redo draw the stored score with SW.score.render, put the
       selection back by position, and save through the library as any
       edit does (auto-save decides whether it reaches storage)
     • 100 steps per song

   Keys: ⌘Z / Ctrl-Z undo, ⇧⌘Z / Ctrl-Y redo (app.js). Buttons: the Edit
   box's rail (edit-box.js; its title bar until 2026-10-31).

   PARTS (2026-11-03, js/parts.js): a step is the whole song, every part;
   it also keeps which part was on the page, so Undo and Redo put that part
   back. A change of part alone is no step (the song is the same).

   KEEP THE MELODY (2026-10-31): with the score locked, the Edit box's
   Chords tab still changes chords, and its Undo / Redo may only take back
   a step whose melody — the lines' notes and words, without their chords
   or the chords-only lines (`bars`) — is the one on screen. A step's
   melody is worked out once, when first asked (melodyOf).

   API
     SW.history.undo(o) / redo(o)      true when something changed; o.keepMelody: only a chords-only step
     SW.history.canUndo(o) / canRedo(o)
     SW.history.reset()                this song becomes the first step
     SW.history.hold(fn)               fn redraws the song as part of an edit (no fresh history)
   Event: 'history:changed' { canUndo, canRedo }
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const LIMIT = 100;
  const FOLD_MS = 700;
  const FOLD = { tempo: 1, pitch: 1, label: 1, 'part-name': 1, 'part-volume': 1 };

  let past = [];          // steps before the current one
  let future = [];        // steps undone
  let current = null;     // { json, sel, reason, at }
  let restoring = false;
  let holding = false;    // hold(fn): a song drawn again as part of one edit (the Time Line's Apply all)

  function selIndex() {
    const a = SW.score.getActiveNote();
    if (!a) return -1;
    return Array.prototype.indexOf.call(SW.score.getAllNotes(), a);
  }
  function snap(reason) {
    return { json: JSON.stringify(SW.score.read()), sel: selIndex(), part: SW.parts.focused(), reason: reason || 'edit', at: Date.now() };
  }
  function melodyOf(step) {
    if (step.mel === undefined) {
      try {
        // every part's lines (PARTS), each without its chords
        const model = JSON.parse(step.json);
        const parts = SW.parts.everyLine(model).map(lines => lines.filter(l => !l.bars).map(l => {
          if (!Array.isArray(l.syllables)) return l;
          return Object.assign({}, l, { syllables: l.syllables.map(sy => { const c = Object.assign({}, sy); delete c.chord; return c; }) });
        }));
        step.mel = JSON.stringify([parts, parts.map((_, i) => SW.parts.metaOf(model, i).clef)]);   // a clef moves the notes an octave
      } catch (e) { step.mel = step.json; }
    }
    return step.mel;
  }
  const keeps = (o, step) => !(o && o.keepMelody) || melodyOf(step) === melodyOf(current);
  function canUndo(o) { return past.length > 0 && !!current && keeps(o, past[past.length - 1]); }
  function canRedo(o) { return future.length > 0 && !!current && keeps(o, future[future.length - 1]); }

  function announce() {
    SW.bus.emit('history:changed', { canUndo: past.length > 0, canRedo: future.length > 0 });
  }

  function reset() {
    past = [];
    future = [];
    current = snap('load');
    announce();
  }

  function record(reason) {
    if (restoring) return;
    const next = snap(reason);
    if (!current) { current = next; announce(); return; }
    if (next.json === current.json) { current.sel = next.sel; current.part = next.part; return; }
    // fold only a run on the same note: ↑↑↑ on one note is one step, but
    // a fast ↑ → ↑ → ↑ across three notes is three
    const fold = FOLD[reason] && current.reason === reason && next.sel === current.sel &&
      next.at - current.at < FOLD_MS && past.length;
    if (!fold) {
      past.push(current);
      if (past.length > LIMIT) past.shift();
    }
    current = next;
    future = [];
    announce();
  }

  function restore(step) {
    restoring = true;
    try {
      SW.score.render(JSON.parse(step.json), { part: step.part });
      const notes = SW.score.getAllNotes();
      if (step.sel >= 0 && notes.length) SW.score.setNoteAsActive(notes[Math.min(step.sel, notes.length - 1)], false);
      SW.bus.emit('score:changed', { reason: 'history' });
      if (SW.library) SW.library.save();
    } finally {
      restoring = false;
    }
  }

  function undo(o) {
    if (!canUndo(o)) return false;
    if (SW.score.isTyping()) SW.score.finishTextEdit();
    future.push(current);
    current = past.pop();
    restore(current);
    announce();
    return true;
  }
  function redo(o) {
    if (!canRedo(o)) return false;
    if (SW.score.isTyping()) SW.score.finishTextEdit();
    past.push(current);
    current = future.pop();
    restore(current);
    announce();
    return true;
  }

  SW.bus.on('score:changed', d => { if (!d || d.reason !== 'history') record(d && d.reason); });
  SW.bus.on('score:loaded', () => { if (!restoring && !holding) reset(); });
  /* fn draws the song again (SW.score.render) as part of an edit: the history goes on, and the
     score:changed that follows is its one step; listeners take the redraw as Undo's (isRestoring) */
  function hold(fn) {
    const was = holding;
    holding = true;
    try { fn(); } finally { holding = was; }
  }

  /* the Chords window's Undo / Redo (progression-window.js, chord-timeline.js): it changes chords
     whatever the lock, so while the notes are locked its song steps keep the melody */
  const forChords = () => (SW.state.editing ? undefined : { keepMelody: true });

  SW.history = {
    undo, redo, reset, hold, forChords,
    isRestoring: () => restoring || holding,
    canUndo, canRedo
  };
})();

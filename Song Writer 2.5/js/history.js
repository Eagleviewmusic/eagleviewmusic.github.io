/* ==========================================================================
   Song Writer 2.5 — history.js
   --------------------------------------------------------------------------
   SW.history   Undo and Redo (SONG-WRITER-RHYTHM-PLAN.md, phase P0).

   The rhythm tools pour a whole line in one tap, so trying things must be
   free: every edit can be taken back. The history keeps whole scores (the
   model from SW.score.read()), never DOM: a step is the song as it stood
   after an edit, plus where the selection was.

     • every 'score:changed' is one step; a run of the same quick edit
       (tempo slider, ↑↓ on one note) within 700 ms folds into one
     • 'score:loaded' (a song opened) starts a fresh history
     • Undo / Redo draw the stored score with SW.score.render, put the
       selection back by position, and save through the library as any
       edit does (auto-save decides whether it reaches storage)
     • 100 steps per song

   Keys: ⌘Z / Ctrl-Z undo, ⇧⌘Z / Ctrl-Y redo (app.js). Buttons: the Edit
   box title bar (edit-box.js).

   API
     SW.history.undo() / redo()        true when something changed
     SW.history.canUndo() / canRedo()
     SW.history.reset()                this song becomes the first step
   Event: 'history:changed' { canUndo, canRedo }
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const LIMIT = 100;
  const FOLD_MS = 700;
  const FOLD = { tempo: 1, pitch: 1, label: 1 };

  let past = [];          // steps before the current one
  let future = [];        // steps undone
  let current = null;     // { json, sel, reason, at }
  let restoring = false;

  function selIndex() {
    const a = SW.score.getActiveNote();
    if (!a) return -1;
    return Array.prototype.indexOf.call(SW.score.getAllNotes(), a);
  }
  function snap(reason) {
    return { json: JSON.stringify(SW.score.read()), sel: selIndex(), reason: reason || 'edit', at: Date.now() };
  }
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
    if (next.json === current.json) { current.sel = next.sel; return; }
    const fold = FOLD[reason] && current.reason === reason && next.at - current.at < FOLD_MS && past.length;
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
      SW.score.render(JSON.parse(step.json));
      const notes = SW.score.getAllNotes();
      if (step.sel >= 0 && notes.length) SW.score.setNoteAsActive(notes[Math.min(step.sel, notes.length - 1)], false);
      SW.bus.emit('score:changed', { reason: 'history' });
      if (SW.library) SW.library.save();
    } finally {
      restoring = false;
    }
  }

  function undo() {
    if (!past.length || !current) return false;
    if (SW.score.isTyping()) SW.score.finishTextEdit();
    future.push(current);
    current = past.pop();
    restore(current);
    announce();
    return true;
  }
  function redo() {
    if (!future.length || !current) return false;
    if (SW.score.isTyping()) SW.score.finishTextEdit();
    past.push(current);
    current = future.pop();
    restore(current);
    announce();
    return true;
  }

  SW.bus.on('score:changed', d => { if (!d || d.reason !== 'history') record(d && d.reason); });
  SW.bus.on('score:loaded', () => { if (!restoring) reset(); });

  SW.history = {
    undo, redo, reset,
    isRestoring: () => restoring,
    canUndo: () => past.length > 0,
    canRedo: () => future.length > 0
  };
})();

/* ==========================================================================
   COMPONENT — the selected note's × and +                     .note-tools
   --------------------------------------------------------------------------
   In Edit (2026-10-08, the user's design), on the box round the selected
   note — the box View → Light up selected/played → Box lights:

                    (×)            the top: delete this note
              ┌──────┴─────┐
              │     ●      │
              │     |     (+)      the right side: a new note after it
              │    twin    │
              └────────────┘

   × = score.js deleteCurrentNote: one tap (Undo brings it back) — the
   column alone when its syllable has other notes, the syllable and its
   word when it is the only one; the note after it is selected next.
   + = + Note Only (duplicateCurrentNote): a note after it on the same
   syllable, with no word of its own — a double-tap under it gives it one
   (score.js wordUnderColumn). Where a lesson leaves connected notes out
   but words in, + adds a syllable instead (+ Note/Syllable).

   On a written line (2026-10-26, the user: on the word's whole box they
   were far from the note, and a tap meant for a note above or beside it
   pressed them) they sit on the note's own ink, as staff.js drew it
   (SW.staff.inkOf):
                     (×)           above its highest ink — the stem's end
                      |  (+)       (on the stem), the beam, the top head —
                      |            by half a staff space, so a head on a
                     ●             line keeps the line above it clear (a D
                                   on the 4th line: the × sits on the F
                                   line, not across it); it climbs with the
                                   note. The + at 3 o'clock to the ×'s 12
                                   (the user, same day): below it, right.
                    (×) (+)        But where the head is the top (stem down,
                     ●|            a whole note, a rest) 3 o'clock would sit
                      |            on the head and its dot: the + goes
                                   beside the ×, on its row.
   On a line of blocks they keep the box: the word's .syl-body (grown 1.05
   when the Box light is on, as style.css scales it) — the × on its top,
   the + on its right side.
   They are a child of the selected line (absolute, z 26), so they scroll
   with it, and are away while it plays, while a word is being typed and
   in a saved picture. They never take the focus (Space would press them).
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const score = document.getElementById('score');
  if (!score) return;
  const can = what => SW.settings.can(what);

  const el = document.createElement('div');
  el.className = 'note-tools';
  el.innerHTML =
    '<button type="button" class="nt-btn nt-del" tabindex="-1">'
    + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 7 7 17"/><path d="m7 7 10 10"/></svg></button>'
    + '<button type="button" class="nt-btn nt-add" tabindex="-1">'
    + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg></button>';
  const del = el.querySelector('.nt-del');
  const add = el.querySelector('.nt-add');
  label(del, 'Delete this note');

  function label(b, text) {
    if (b.title === text) return;
    b.title = text;
    b.setAttribute('aria-label', text);
  }

  /* + : a note after this one, without a word (or a syllable, where only that is allowed) */
  function addMode() {
    if (can('pitch') && can('connected')) return 'note';
    if (can('structure')) return 'syllable';
    return null;
  }

  // never take the focus or the selection; the score's own handlers never see these taps
  el.addEventListener('mousedown', e => e.preventDefault());
  ['pointerdown', 'pointerup', 'dblclick'].forEach(t => el.addEventListener(t, e => e.stopPropagation()));   // (pointerup: the score's double-tap-for-a-word)
  el.addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('.nt-btn');
    if (!b) return;
    SW.ui.closeAllPopovers();
    if (b === del) SW.score.deleteCurrentNote();
    else if (addMode() === 'note') SW.score.duplicateCurrentNote();
    else if (addMode() === 'syllable') SW.score.addSyllableAfterCurrent();
  });

  /* where the box is, in the line's coordinates */
  function offsetIn(node, ancestor) {
    let x = 0, y = 0, e = node;
    while (e && e !== ancestor) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y };
  }
  function boxOf(stack, line) {
    const drawn = SW.staff && SW.staff.boxOf ? SW.staff.boxOf(stack) : null;
    if (drawn) return drawn;
    const body = stack.closest('.syl-body');
    if (!body) return null;
    const o = offsetIn(body, line);
    const w = body.offsetWidth, h = body.offsetHeight;
    const grow = document.body.classList.contains('light-box') ? 0.025 : 0;   // style.css: scale(1.05)
    return { x: o.x - w * grow, y: o.y - h * grow, w: w * (1 + 2 * grow), h: h * (1 + 2 * grow) };
  }

  function hide() { if (el.parentNode) el.remove(); }

  function sync() {
    const note = S.editing && !S.playing ? SW.score.getActiveNote() : null;
    const stack = note && note.closest('.harmony-stack');
    const line = stack && stack.closest('.notation-line');
    const typing = !!score.querySelector('.syllable.editing');
    if (!line || typing) { hide(); return; }
    const st = SW.score.deleteNoteState();
    const mode = addMode();
    if (!st.can && !mode) { hide(); return; }
    const ink = SW.staff && SW.staff.inkOf ? SW.staff.inkOf(stack) : null;
    const R = ink ? null : boxOf(stack, line);
    if (!ink && (!R || !R.w)) { hide(); return; }
    if (el.parentNode !== line) line.appendChild(el);
    const bs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bs')) || 1;
    el.style.setProperty('--nt', Math.round(Math.max(26, Math.min(34, 28 * bs))) + 'px');
    del.hidden = !st.can;
    add.hidden = !mode;
    let dx, dy, ax, ay;
    if (ink) {
      const size = del.offsetWidth || add.offsetWidth || 28;           // the buttons are placed by their centres
      const sp = 20 * bs;                                                // a staff space (staff.js SS_PX × --bs)
      dx = ink.stemCx !== null ? ink.stemCx : ink.cx;                    // on the stem, or over the head
      dy = ink.top - (sp * 0.5 + 2) - size / 2;                          // half a space clear of the top
      if (ink.stemCx !== null) {
        const r = size * 0.85;                                           // the clock's radius: a few px between the two
        ax = dx + r;                                                     // 3 o'clock to the ×'s 12
        ay = dy + r;
      } else {
        ax = dx + size + 6;                                              // the head is the top: beside the ×
        ay = dy;
      }
    } else {
      dx = R.x + R.w / 2; dy = R.y;
      ax = R.x + R.w; ay = R.y + R.h / 2;
    }
    del.style.left = dx.toFixed(1) + 'px';
    del.style.top = dy.toFixed(1) + 'px';
    add.style.left = ax.toFixed(1) + 'px';
    add.style.top = ay.toFixed(1) + 'px';
    label(del, st.whole ? 'Delete this note and its word' : 'Delete this note');
    const full = mode === 'note' && !SW.score.connectedState().canAdd;
    label(add, mode === 'syllable' ? 'Add a note after this one, with a syllable of its own'
      : full ? 'This syllable has as many notes as it can hold' : 'Add a note after this one');
    add.classList.toggle('is-full', full);
  }

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(sync, 30);
  }
  ['selection', 'staff:drawn', 'mode:changed', 'view:changed', 'words:typing', 'play:changed',
   'policy:changed', 'layout:changed', 'score:loaded', 'score:changed'].forEach(evt => SW.bus.on(evt, schedule));
  window.addEventListener('resize', schedule);

  SW.noteTools = { sync, schedule };
})();

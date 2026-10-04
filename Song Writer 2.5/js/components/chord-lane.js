/* ==========================================================================
   COMPONENT SLOT — the row above the words                 .syllable > .chord-slot
   --------------------------------------------------------------------------
   Every syllable keeps an empty .chord-slot at its top (score.js makes
   it); with the chords out the slots line up into one row per visual
   row, and the CHORD TRACK (chord-track.js) draws the song's chords in
   that row. The row lives inside the syllables rather than in a strip of
   its own because 1.0's lines wrap: a separate row could never stay over
   the word it belongs to once a line breaks.

   2.5 (2026-10-03): this was the chord lane — a chord written on a word
   (data-chord) that held until the next. The chord progressions replace
   it (DESIGN.md §11): an old song's lane chords are read by the track as
   loose chords "From the lane" (track.js), and its first change writes
   them into the track. The lane's picker is gone; a slot only keeps its
   room, and a tap in it — between the track's chords — is the track's.

   API
     SW.lane.render()                 empty every slot (it keeps its room)
     SW.lane.slotClicked(slot, e)     called by score.js's click handler
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const score = document.getElementById('score');

  function render() {
    score.querySelectorAll('.chord-slot').forEach(slot => {
      if (slot.className !== 'chord-slot') slot.className = 'chord-slot';
      if (slot.innerHTML) slot.innerHTML = '';
      slot.removeAttribute('title');
      slot.style.removeProperty('--c');
    });
  }
  /* the tick a syllable starts on (its first column) */
  function tickOf(syl) {
    const st = syl.querySelector('.harmony-stack');
    let at = null;
    SW.timing.song().lines.some(le => le.events.some(ev => { if (ev.stack === st) { at = le.at + ev.start; return true; } return false; }));
    return at;
  }

  /* a tap in the row between the track's chords: select there in Edit, hear the chord in Perform */
  function slotClicked(slot, e) {
    e.stopPropagation();
    const syl = slot.closest('.syllable');
    if (!syl || !SW.ctrack) return;
    const tick = tickOf(syl);
    if (tick === null) return;
    if (S.editing && SW.settings.can('chords')) SW.ctrack.selectAtTick(tick);
    else SW.ctrack.playAtTick(tick);
  }

  SW.bus.on('mode:changed', render);
  ['score:loaded', 'score:changed', 'names:changed', 'key:changed', 'layout:changed', 'chords:changed'].forEach(evt => SW.bus.on(evt, render));

  SW.lane = { render, slotClicked };
})();

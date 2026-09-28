/* ==========================================================================
   COMPONENT SLOT — the chord lane (above the melody)       .syllable > .chord-slot
   --------------------------------------------------------------------------
   A row reserved above every line's blocks for the chord progression.
   It lives INSIDE each syllable (the empty .chord-slot score.js makes)
   rather than in a strip of its own, because 1.0's lines wrap: a separate
   row could never stay over the word it belongs to once a line breaks.
   Every syllable in a visual row is stretched to the row's height, so the
   slots line up into one lane per row.

   HOW A PROGRESSION IS READ — as on a lead sheet: a chord is written where
   it changes (data-chord on the syllable) and holds until the next one.
   Syllables it holds over show a thin continuation line; a line that
   starts under a held chord repeats it in brackets.

   WHAT WORKS NOW
     • Edit: tap a slot to choose a chord (or clear it). The tapped slot
       stays CHOSEN — it glows orange — and while it does, a chord played
       on the strip (or 1–9) is written into it. Otherwise the strip only
       sounds, so a chord can be tried while editing (DECISIONS D11; in
       2.0 every chord pressed in Edit wrote itself over the selected
       word). Selecting another word or leaving Edit lets it go.
     • Perform: stepping onto a word where a chord changes plays it
       ("chords that trigger as the score scrolls"); tapping a slot plays
       the chord that holds there
     • stored in the song (score model `chord`, text format `{V7}word[…]`):
       the engine's roman-numeral id (js/chords.js) — `V7`, `bVI`,
       `V:inv64`; the ids written before 2026-09-27 (`V/V`…) still read

   NOT YET (the hooks are here): chord durations of their own, chords
   between syllables, playing a whole progression back in time.

   API
     SW.lane.render()                 redraw every slot
     SW.lane.assign(syl, id|null)     write / clear a chord change
     SW.lane.chordAt(syl)             the chord sounding at a syllable
     SW.lane.slotClicked(slot, e)     called by score.js's click handler
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const score = document.getElementById('score');
  const picker = document.getElementById('lane-picker');
  const pickerGrid = document.getElementById('lane-picker-grid');
  const pickerTitle = document.getElementById('lane-picker-title');
  let pickerFor = null;
  let chosen = null;          // the syllable whose slot is chosen (Edit)

  function label(id) {
    const d = SW.chords.describe(id);
    return { text: d.known ? SW.chords.nameOf(d) : d.roman, color: d.color, known: d.known };
  }

  /* The chord in force at a syllable: its own, or the last one before it. */
  function chordAt(syl) {
    const all = Array.from(score.querySelectorAll('.syllable'));
    for (let i = all.indexOf(syl); i >= 0; i--) {
      if (all[i].dataset.chord) return all[i].dataset.chord;
    }
    return null;
  }

  function render() {
    let held = null;
    score.querySelectorAll('.notation-line').forEach(line => {
      line.querySelectorAll('.syllable').forEach((syl, i) => {
        const slot = syl.querySelector('.chord-slot');
        if (!slot) return;
        const own = syl.dataset.chord || null;
        slot.className = 'chord-slot' + (syl === chosen ? ' chosen' : '');
        if (own) {
          held = own;
          const l = label(own);
          slot.classList.add('has-chord');
          if (!l.known) slot.classList.add('unknown');
          slot.style.setProperty('--c', l.color);
          slot.style.setProperty('--c-soft', SW.ui.tint(l.color, 0.16));
          slot.innerHTML = '<span class="chord-sym">' + SW.chords.labelHTML(l.text) + '</span>';
          slot.title = 'Chord: ' + l.text;
        } else if (held) {
          const l = label(held);
          slot.classList.add('holds');
          slot.style.setProperty('--c', l.color);
          slot.style.setProperty('--c-line', SW.ui.tint(l.color, 0.45));
          slot.innerHTML = i === 0 ? '<span class="chord-sym held">(' + SW.chords.labelHTML(l.text) + ')</span>' : '<span class="chord-hold"></span>';
          slot.title = l.text + ' continues';
        } else {
          slot.style.removeProperty('--c');
          slot.innerHTML = '<span class="chord-add">+</span>';
          slot.title = S.editing ? 'Tap to put a chord here' : 'No chord yet';
        }
      });
    });
  }

  function assign(syl, id, opts) {
    if (!syl || !SW.settings.can('chords')) return;
    const before = syl.dataset.chord || null;
    if (id) id = SW.chords.toId(id) || id;                 // written in the engine's own spelling
    if (id) syl.dataset.chord = id; else delete syl.dataset.chord;
    if (before === (id || null)) return;
    render();
    SW.score.changed('chord');
    if (!(opts && opts.silent) && id) SW.chords.play(id, 'lane');
  }

  /* ---- the picker popover ---- */
  function openPicker(slot, syl) {
    pickerFor = syl;
    const text = syl.querySelector('.text');
    pickerTitle.textContent = 'Chord on “' + (text ? text.textContent : '') + '”';
    pickerGrid.innerHTML = '';
    const current = SW.chords.toId(syl.dataset.chord || '') || syl.dataset.chord || null;
    // the panel's chords, as the held Z X C V B buttons make them
    SW.chords.offered().forEach(place => {
      const e = SW.chords.entry(place);
      if (!e) return;
      const id = SW.chords.toId(SW.chords.withHeld(e.spec));
      const d = SW.chords.describe(id);
      const b = document.createElement('button');
      b.className = 'lane-choice' + (current === id ? ' active' : '') + (d.inScale ? '' : ' out-of-scale');
      b.style.setProperty('--c', d.color);
      b.innerHTML = SW.chords.labelHTML(SW.chords.nameOf(d)) + '<small>' + SW.chords.keyOf(place) + '</small>';
      b.title = d.roman + ' — ' + d.letter + ' · ' + d.tones.map(t => t.name).join(' ');
      b.addEventListener('click', ev => {
        ev.stopPropagation();
        assign(pickerFor, id);
        SW.ui.closeAllPopovers();
      });
      pickerGrid.appendChild(b);
    });
    SW.ui.closeAllPopovers();
    picker.classList.add('show');
    SW.ui.positionPopover(slot, picker);
  }

  function choose(syl) {
    if (chosen === syl) return;
    chosen = syl;
    score.querySelectorAll('.chord-slot.chosen').forEach(s => s.classList.remove('chosen'));
    if (syl) {
      const slot = syl.querySelector('.chord-slot');
      if (slot) slot.classList.add('chosen');
    }
  }

  function slotClicked(slot, e) {
    e.stopPropagation();
    const syl = slot.closest('.syllable');
    if (!syl) return;
    if (S.editing && SW.settings.can('chords')) {
      const first = syl.querySelector('.note');
      const note = SW.score.getActiveNote();
      if (first && (!note || note.closest('.syllable') !== syl)) SW.score.setNoteAsActive(first, false);
      choose(syl);
      openPicker(slot, syl);
      return;
    }
    const id = chordAt(syl);
    if (id) SW.chords.play(id, 'lane');
    else {
      const first = syl.querySelector('.note');
      if (first) SW.score.setNoteAsActive(first, true);
    }
  }

  if (picker) picker.addEventListener('click', e => e.stopPropagation());
  const clearBtn = document.getElementById('lane-picker-clear');
  if (clearBtn) clearBtn.addEventListener('click', e => {
    e.stopPropagation();
    assign(pickerFor, null);
    SW.ui.closeAllPopovers();
  });

  /* Stepping onto a chord change plays it — only when the step lands on
     the syllable's first column, so connected notes on one word do not
     retrigger it. */
  SW.bus.on('selection', d => {
    // a chosen slot lets go when the selection leaves its word
    if (chosen && d.syllable !== chosen) choose(null);
    if (!d.sounded || !d.syllable || !d.stack) return;
    if (!SW.settings.shows('lane') || !SW.settings.view.laneChordsPlay) return;
    const firstStack = d.syllable.querySelector('.harmony-stack');
    if (firstStack !== d.stack) return;
    const id = d.syllable.dataset.chord;
    if (id && SW.chords.isKnown(id)) SW.chords.play(id, 'lane');
  });

  SW.bus.on('mode:changed', d => { if (!d.editing) choose(null); render(); });
  SW.bus.on('score:loaded', () => { chosen = null; });
  ['score:loaded', 'score:changed', 'names:changed', 'key:changed', 'layout:changed', 'chords:changed'].forEach(evt => SW.bus.on(evt, render));

  /* The syllable the strip writes into: only a chosen slot, in Edit,
     with the lane out and chords allowed. */
  function chosenSyllable() {
    if (!chosen || !document.contains(chosen) || !S.editing || !SW.settings.shows('lane') || !SW.settings.can('chords')) return null;
    return chosen;
  }

  SW.lane = { render, assign, chordAt, slotClicked, chosenSyllable, choose };
})();

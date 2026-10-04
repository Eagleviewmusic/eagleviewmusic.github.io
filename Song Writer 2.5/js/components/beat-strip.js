/* ==========================================================================
   COMPONENT — the beat strip (2.5)                               #beat-bar
   --------------------------------------------------------------------------
   Rhythm Poetry's beat pills, for one bar of a Song Writer line at a time
   (SONG-WRITER-RHYTHM-PLAN.md §6C, P4). Out in Edit with Beats on (the
   Edit box's Rhythm section), at the foot of the stage, so it stays put
   while the song scrolls. It shows the bar the selected note starts in.

      BEATS   Line A · bar 3   ‹ ›          ( Dots | Easy )        ×
      ┌─────────┐ ⛓ ┌─────────┐ ⛓ ┌─────────┐ ⛓ ┌─────────┐
      │ ●   ○   │   │ ●   ●   │   │ ● ━━━━━ │   │  block  │
      └─────────┘   └─────────┘   └─────────┘   └─────────┘
        −   +         −   +         −   +         −   +
        Twin          kle  twin     kle

   • a dot is a slot of the beat (two eighths, or four sixteenths after
     +). Lit = a note starts there, in the colour of the pitch that lands
     on it; a bar = the note before goes on; a ring = silence; dashed = a
     ghost (the rhythm ran past the melody). Tap one: a note starts there
     (the next pitch-and-word comes in) or stops (the line's melody
     moves along). A block is one grey square: tap it to write it.
   • ⛓ joins a beat to the next: the sound goes on over the beat line.
   • + / − : sixteenths in that beat, or back to eighths (sixteenths
     move onto the eighth before them).
   • Easy: each beat shows Rhythm Poetry's EASY circles instead — a whole
     rhythm in one tap (♩ ♫ ♬, and 𝅗𝅥 𝅝 where they fit in the bar; in
     6/8 9/8 12/8 ♩. ♪♪♪ ♩♪ 𝄽♪ and 𝅗𝅥. 𝅝.); the lit one again makes a
     rest as long.
   • the words that start in each beat are written under it, so the flow
     can be seen as it happens.

   Every gesture changes only its own beat (or the two it joins) and pours
   the line's melody into the result (js/flow.js) — one Undo step.

   API  SW.beats.render()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const F = SW.flow;
  const el = document.getElementById('beat-bar');
  if (!el || !F) return;

  /* cells (sixteenths) in a beat: 4 in simple time, 6 in compound (a
     dotted quarter: three eighths, or six sixteenths after +) */
  const perBeat = () => SW.meters.byId(S.meter).beatTicks / F.CELL;
  let mode = 'dots';                        // 'dots' | 'easy'
  let view = null;                          // { lineIndex, bar } — the bar on show
  const fine = new Set();                   // beats shown in sixteenths: 'line:cell'

  /* Rhythm Poetry's EASY circles (its default sets), as cell patterns:
     X a note starts, O it is held, R silence */
  const O = n => 'O'.repeat(n);
  const EASY_SIMPLE = [
    { id: 'q', beats: 1, pattern: 'XOOO', glyph: ['q'], name: 'A quarter note', colour: 'q' },
    { id: 'ee', beats: 1, pattern: 'XOXO', glyph: ['e', 'e'], name: 'Two eighths', colour: 'e' },
    { id: 'ssss', beats: 1, pattern: 'XXXX', four: true, name: 'Four sixteenths', colour: 's' },
    { id: 'h', beats: 2, pattern: 'X' + O(7), glyph: ['h'], name: 'A half note (two beats)', colour: 'h' },
    { id: 'w', beats: 4, pattern: 'X' + O(15), glyph: ['w'], name: 'A whole note (four beats)', colour: 'w' }
  ];
  const EASY_COMPOUND = [
    { id: 'dq', beats: 1, pattern: 'X' + O(5), glyph: ['q.'], name: 'A dotted quarter note', colour: 'q' },
    { id: 'eee', beats: 1, pattern: 'XOXOXO', glyph: ['e', 'e', 'e'], name: 'Three eighths', colour: 'e' },
    { id: 'qe', beats: 1, pattern: 'XOOOXO', glyph: ['q', 'e'], name: 'A quarter and an eighth', colour: 's' },
    { id: 'qre', beats: 1, pattern: 'RRRRXO', glyph: ['q', 'e'], restFirst: true, name: 'A quarter rest and an eighth', colour: 'w' },
    { id: 'dh', beats: 2, pattern: 'X' + O(11), glyph: ['h.'], name: 'A dotted half note (two beats)', colour: 'h' },
    { id: 'dw', beats: 4, pattern: 'X' + O(23), glyph: ['w.'], name: 'A dotted whole note (four beats)', colour: 'w' }
  ];
  const easyList = () => SW.meters.byId(S.meter).compound ? EASY_COMPOUND : EASY_SIMPLE;

  const lines = () => Array.from(document.querySelectorAll('#score .notation-line'));
  const shown = () => S.editing && !!(SW.settings.view && SW.settings.view.showBeats) && SW.settings.can('values');

  function esc(t) { return String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }

  /* the bar the selection starts in */
  function followSelection() {
    const note = SW.score.getActiveNote();
    const stack = note && note.closest('.harmony-stack');
    const line = stack && stack.closest('.notation-line');
    if (!line) return;
    const le = SW.timing.lineEvents(line);
    const ev = le.events.find(e => e.stack === stack);
    if (!ev) return;
    view = { lineIndex: lines().indexOf(line), bar: ev.bar };
  }

  function colourOf(item) {
    if (!item) return '#9487A2';
    const n = item.cols[0].notes.find(x => !x.rest);
    return (n && SW.music.noteColour(n.n)) || '#9487A2';
  }

  /* ================= drawing ================= */
  function render() {
    const on = shown();
    el.hidden = !on;
    document.body.classList.toggle('show-beats', on);
    if (!on) return;
    if (!view) followSelection();
    const all = lines();
    const line = view ? all[view.lineIndex] : null;
    if (!line) {
      el.innerHTML = '<div class="bb-empty">Select a note to see its bar\'s beats</div>';
      return;
    }
    const model = SW.score.readLine(line);
    const cs = F.cellsOf(model);
    const { cells, mt, shift } = cs;
    const lastBar = Math.max(0, Math.floor((cs.end - 1 + shift) / mt.barTicks));
    const firstBar = 0;
    view.bar = Math.max(firstBar, Math.min(lastBar, view.bar));
    const bar = view.bar;
    const barStart = bar * mt.barTicks - shift;          // in ticks from the line's start (may be < 0: a pick-up)
    const label = model.label ? 'Line ' + esc(model.label) : 'Line ' + (view.lineIndex + 1);
    const hasPickup = shift > 0;
    const barName = hasPickup && bar === 0 ? 'pick-up' : 'bar ' + (bar + (hasPickup ? 0 : 1));

    // the selected note's cell, to ring its beat
    const note = SW.score.getActiveNote();
    const selStack = note && note.closest('.harmony-stack');
    let selCell = -1;
    if (selStack && selStack.closest('.notation-line') === line) {
      const ev = SW.timing.lineEvents(line).events.find(e => e.stack === selStack);
      if (ev) selCell = ev.start / F.CELL;
    }

    let html = '<div class="bb-head">' +
      '<span class="bb-kicker">Beats</span>' +
      '<span class="bb-where">' + label + ' · ' + barName + '</span>' +
      '<span class="bb-navs"><button type="button" class="bb-nav" data-nav="-1" title="The bar before" aria-label="The bar before"' + (bar <= firstBar && view.lineIndex === 0 ? ' disabled' : '') + '>‹</button>' +
      '<button type="button" class="bb-nav" data-nav="1" title="The next bar" aria-label="The next bar"' + (bar >= lastBar && view.lineIndex === all.length - 1 ? ' disabled' : '') + '>›</button></span>' +
      '<span class="bb-gap"></span>' +
      '<div class="bb-mode seg" role="group" aria-label="Show">' +
        '<button type="button" class="seg-btn' + (mode === 'dots' ? ' active' : '') + '" data-mode="dots">Dots</button>' +
        '<button type="button" class="seg-btn' + (mode === 'easy' ? ' active' : '') + '" data-mode="easy">Easy</button>' +
      '</div>' +
      '<button type="button" class="bb-close" title="Put the beats away" aria-label="Put the beats away">×</button>' +
    '</div><div class="bb-beats">';

    for (let b = 0; b < mt.beats; b++) {
      const t0 = barStart + b * mt.beatTicks;
      const PER_BEAT = perBeat();
      const c0 = t0 / F.CELL, c1 = c0 + PER_BEAT;
      const before = c0 < 0;                               // a beat (or part) before the line starts: the pick-up's open part
      const key = view.lineIndex + ':' + c0;
      const sixteenths = !before && (fine.has(key) || F.needsSixteenths(cells, c0, Math.min(c1, cells.length)));
      const d = sixteenths ? PER_BEAT : PER_BEAT / 2;      // eighths (2, or 3 in compound) or sixteenths
      const span = PER_BEAT / d;
      const sel = selCell >= c0 && selCell < c1;
      // words starting in this beat
      const words = [];
      for (let c = Math.max(0, c0); c < c1 && c < cells.length; c++) {
        const cell = cells[c];
        if (!cell || !cell.item || cell.on.start !== c * F.CELL) continue;
        const sy = model.syllables[cell.item.si];
        if (sy && sy.cols[0] === cell.item.cols[0] && sy.text !== '-') words.push(sy.text);
      }
      if (b > 0) {
        const j = F.joined(cells, c0), can = j || (c0 > 0 && F.canJoin(cells, c0));
        html += '<button type="button" class="bb-chain' + (j ? ' on' : '') + '" data-join="' + c0 + '" data-end="' + c1 + '"' +
          (can && !before ? '' : ' disabled') + ' title="' + (j ? 'Joined — the note goes on over the beat line; tap to part them' : 'Join to the beat before — the note goes on over the beat line') + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></button>';
      }
      html += '<div class="bb-beat' + (sel ? ' sel' : '') + (before ? ' before' : '') + '">';
      html += '<div class="bb-num">' + (b + 1) + '</div>';
      if (mode === 'easy' && !before) html += easyPill(cells, c0, b, mt);
      else html += dotPill(cells, c0, d, span, before, model);
      html += '<div class="bb-words">' + (words.length ? words.map(esc).join(' ') : '&nbsp;') + '</div>';
      if (mode === 'dots' && !before) {
        html += '<div class="bb-pm">' +
          '<button type="button" class="bb-fine" data-coarse="' + c0 + '"' + (sixteenths ? '' : ' disabled') + ' title="Eighths — sixteenths move onto the eighth before them" aria-label="Eighths">−</button>' +
          '<button type="button" class="bb-fine" data-fine="' + c0 + '"' + (sixteenths ? ' disabled' : '') + ' title="Sixteenths in this beat" aria-label="Sixteenths">+</button>' +
        '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function dotPill(cells, c0, d, span, before, model) {
    let html = '<div class="bb-pill d' + d + '">';
    // a block that fills this beat: one square
    const first = c0 >= 0 ? cells[c0] : null;
    if (first && first.t === 'bon') {
      return html + '<button type="button" class="bb-block" data-cell="' + c0 + '" data-span="' + perBeat() + '" style="--c:' + colourOf(first.item) + '" title="A block — its rhythm not decided yet; tap to write it as a ' + (SW.meters.byId(S.meter).compound ? 'dotted quarter' : 'quarter') + '"></button></div>';
    }
    for (let i = 0; i < d; i++) {
      const c = c0 + i * span;
      if (c < 0) { html += '<span class="bb-dot off" aria-hidden="true"></span>'; continue; }
      const cell = cells[c] || { t: 'fill' };
      let cls = 'bb-dot', title, colour = '';
      switch (cell.t) {
        case 'on': case 'bon':
          cls += cell.ghost ? ' ghost' : cell.silent ? ' silent' : ' on';
          colour = colourOf(cell.item);
          title = cell.ghost ? 'A ghost note (the rhythm ran past the melody) — tap to take it away' : 'A note starts here — tap to stop it';
          break;
        case 'hold': case 'bhold':
          cls += ' hold';
          colour = colourOf(prevItem(cells, c));
          title = 'The note goes on — tap to start a new note here';
          break;
        case 'reston': case 'rest':
          cls += ' rest';
          title = 'Silence — tap for a note';
          break;
        default:
          cls += ' fill';
          title = 'After the end of the line — tap for a note';
      }
      html += '<button type="button" class="' + cls + '" data-cell="' + c + '" data-span="' + span + '"' +
        (colour ? ' style="--c:' + colour + '"' : '') + ' title="' + title + '"></button>';
    }
    return html + '</div>';
  }
  function prevItem(cells, c) {
    for (let i = c; i >= 0; i--) if (cells[i] && cells[i].item && (cells[i].t === 'on' || cells[i].t === 'bon')) return cells[i].item;
    return null;
  }

  /* EASY circles: the choices that fit at this beat (inside the bar, on a
     beat the length divides — any fitting beat when the bar does not) */
  function easyFits(choice, b, mt) {
    if (b + choice.beats > mt.beats) return false;
    if (mt.beats % choice.beats === 0) return b % choice.beats === 0;
    return true;
  }
  /* Is this choice what the beat holds now? 'note' (as written), 'rest'
     (all of it silent: the lit one tapped again), or null. */
  function easyLit(cells, c0, choice) {
    const n = choice.pattern.length;
    let restAll = true, match = true;
    for (let j = 0; j < n; j++) {
      const cell = cells[c0 + j];
      if (!cell) return null;
      const t = cell.t;
      const ch = choice.pattern[j];
      const isStart = t === 'on' || t === 'bon';
      const isHold = t === 'hold' || t === 'bhold';
      const isRest = t === 'rest' || t === 'reston';
      if (ch === 'X' ? !isStart : ch === 'O' ? !isHold : !isRest) match = false;
      if (!((j === 0 && t === 'reston') || (j > 0 && t === 'rest'))) restAll = false;
    }
    const after = cells[c0 + n];
    if (after && (after.t === 'hold' || after.t === 'bhold') && match) match = false;      // it goes on past: not this one
    if (after && after.t === 'rest' && restAll) restAll = false;
    return match ? 'note' : restAll ? 'rest' : null;
  }
  function easyGlyph(ch, lit) {
    if (ch.four) return '<span class="bb-four">' + SW.engrave.value('s', { height: 16 }) + '×4</span>';
    return '<span class="bb-glyphs">' + ch.glyph.map((id, i) =>
      SW.engrave.value(id, { height: 18, rest: lit === 'rest' || (ch.restFirst && i === 0) })).join('') + '</span>';
  }
  function easyPill(cells, c0, b, mt) {
    let html = '<div class="bb-pill easy">';
    easyList().forEach(ch => {
      if (!easyFits(ch, b, mt)) return;
      const lit = easyLit(cells, c0, ch);
      html += '<button type="button" class="bb-easy' + (lit ? ' on' : '') + (lit === 'rest' ? ' is-rest' : '') + '" data-easy="' + ch.id + '" data-cell="' + c0 + '"' +
        ' style="--c:' + SW.values.colour(ch.colour) + '" title="' + ch.name + (lit === 'note' ? ' — tap again for a rest as long' : '') + '">' +
        easyGlyph(ch, lit) + '</button>';
    });
    return html + '</div>';
  }

  /* ================= gestures ================= */
  function current() {
    const line = view ? lines()[view.lineIndex] : null;
    if (!line) return null;
    const model = SW.score.readLine(line);
    return { line, model, cs: F.cellsOf(model) };
  }
  function pourCells(ctx, cells, focus) {
    const changedIt = F.applyCells(ctx.line, cells, focus);
    // sound the note now at the tapped place
    const note = SW.score.getActiveNote();
    if (changedIt && note && !note.classList.contains('rest-note')) SW.score.soundNote(note);
    render();
  }
  function beatOf(cell, ctx) {
    const mt = ctx.cs.mt;
    const t = cell * F.CELL + ctx.cs.shift;
    const b0 = Math.floor(t / mt.beatTicks) * mt.beatTicks - ctx.cs.shift;
    return { c0: b0 / F.CELL, c1: b0 / F.CELL + perBeat() };
  }

  el.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  el.addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('button');
    if (!b || b.disabled) return;
    SW.ui.closeAllPopovers();
    if (b.classList.contains('bb-close')) { SW.settings.setView({ showBeats: false }); return; }
    if (b.dataset.mode) { mode = b.dataset.mode; render(); return; }
    if (b.dataset.nav) { nav(Number(b.dataset.nav)); return; }
    const ctx = current();
    if (!ctx) return;
    const cells = ctx.cs.cells;
    if (b.dataset.fine !== undefined) { fine.add(view.lineIndex + ':' + b.dataset.fine); render(); return; }
    if (b.dataset.coarse !== undefined) {
      const c0 = Number(b.dataset.coarse);
      fine.delete(view.lineIndex + ':' + c0);
      const n = perBeat();
      if (F.needsSixteenths(cells, c0, c0 + n)) pourCells(ctx, F.coarsen(cells, c0, c0 + n), c0);
      else render();
      return;
    }
    if (b.dataset.join !== undefined) {
      const c1 = Number(b.dataset.join);
      pourCells(ctx, F.toggleJoin(cells, c1, Number(b.dataset.end)), c1 - 1);
      return;
    }
    if (b.dataset.easy) {
      const ch = easyList().find(x => x.id === b.dataset.easy);
      const c0 = Number(b.dataset.cell);
      const lit = easyLit(cells, c0, ch);
      pourCells(ctx, F.writePattern(cells, c0, ch.pattern, lit === 'note'), c0);
      return;
    }
    if (b.dataset.cell !== undefined) {
      const c = Number(b.dataset.cell), span = Number(b.dataset.span) || 1;
      const { c0, c1 } = beatOf(c, ctx);
      pourCells(ctx, F.tapSlot(cells, c, span, Math.max(0, c0), c1), c);
    }
  });

  /* ‹ ›: the bar before / after; past a line's end, the next line */
  function nav(dir) {
    const all = lines();
    const ctx = current();
    if (!ctx) return;
    const mt = ctx.cs.mt;
    const lastBar = Math.max(0, Math.floor((ctx.cs.end - 1 + ctx.cs.shift) / mt.barTicks));
    let { lineIndex, bar } = view;
    bar += dir;
    if (bar < 0) {
      if (lineIndex === 0) return;
      lineIndex--;
      const m = SW.score.readLine(all[lineIndex]);
      const cs = F.cellsOf(m);
      bar = Math.max(0, Math.floor((cs.end - 1 + cs.shift) / mt.barTicks));
    } else if (bar > lastBar) {
      if (lineIndex >= all.length - 1) return;
      lineIndex++;
      bar = 0;
    }
    view = { lineIndex, bar };
    // the selection follows to the first note that starts in the bar, if any
    const line = all[lineIndex];
    const le = SW.timing.lineEvents(line);
    const ev = le.events.find(x => x.bar === bar);
    if (ev) {
      holding = true;
      SW.score.setNoteAsActive(ev.stack.querySelector('.note'), false);
      holding = false;
    }
    render();
  }

  let holding = false;
  SW.bus.on('selection', () => { if (!holding) { followSelection(); schedule(); } });
  ['score:changed', 'score:loaded', 'mode:changed', 'view:changed', 'layout:changed', 'meter:changed', 'policy:changed'].forEach(evt => SW.bus.on(evt, schedule));
  SW.bus.on('score:loaded', () => { view = null; fine.clear(); });
  let timer = 0;
  function schedule() { clearTimeout(timer); timer = setTimeout(render, 20); }

  render();
  SW.beats = { render, easy: easyList };      // easy: the Easy circles' rhythms (the Chord Progression window uses them too)
})();

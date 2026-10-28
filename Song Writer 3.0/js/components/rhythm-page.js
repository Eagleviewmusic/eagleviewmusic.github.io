/* ==========================================================================
   COMPONENT — the Rhythm page (2026-10-25)                     #rhythm-stage
   --------------------------------------------------------------------------
   Rhythm Poetry's circle system over the song (RHYTHM-PAGE.md). Out while
   the top switch says Rhythm; the score (#score) stays laid out but unseen
   under it, and is still the song: this page only READS it (score.readLine
   → flow.cellsOf) and writes back through the flow engine (flow.applyCells
   → pour → replaceLine → changed), so the melody, the words and the chord
   track are untouched and every gesture is one Undo step.

      1 ┌ ● ○ ┐⛓┌ ● ● ┐ ┌ ● ○ ┐ ┌ ● ● ┐ │ 2 ┌ ● ○ ┐ …
        ♩      ♫      ♩      ♫                  ♩
        Twin   kle twin kle   lit  tle         star

   One Rhythm Poetry line = one song line (each song line starts a new bar).
   A bar is a measure of `mt.beats` pills; each pill is one beat's slots:
   2 (eighths) or 4 (sixteenths, after +) in simple time, 3 or 6 in
   compound. A slot wears the cell at its start: orange a note starts,
   yellow it goes on, grey silence (a word's own rest is grey with a ring,
   its word under it: tap it and the word sounds). The melody never grows
   here (flow.js R2): a tap past the line's last note lengthens that note
   when it sits right before, and otherwise says that every note is
   placed. The bar's rhythm is engraved once
   under its pills (SW.engrave.rhythm, placed on the circles' centres) and
   the words sit under their start slot.

   API  SW.rhythmPage.render()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const F = SW.flow;
  const el = document.getElementById('rhythm-stage');
  if (!el || !F) return;
  const CELL = F.CELL;
  const meter = () => SW.meters.byId(S.meter);
  const perBeat = () => meter().beatTicks / CELL;
  const fine = new Set();                   // beats shown in sixteenths: 'line:c0'
  let typing = null;                        // a word being typed: { stack, value, sel } (TYPING A WORD)
  let redrawing = false;                    // its box is being taken out by a redraw: the blur keeps nothing
  let tapOpenAt = 0;                        // when a double tap opened it: the tap's own mousedown and click are not for the page
  const stage = document.getElementById('stage');

  const lines = () => Array.from(document.querySelectorAll('#score .notation-line'));
  const shown = () => !!(SW.settings.view && SW.settings.view.rhythmPage);
  const live = () => SW.settings.can('values');
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const bs = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bs')) || 1;

  const NO_NOTE_MSG = 'Every note of this line is placed — to go on, add a note in Edit (+ Note)';
  const CHAIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>';

  /* ================= reading a line ================= */
  function lineData(line) {
    const model = SW.score.readLine(line);
    const cs = F.cellsOf(model);
    const mt = cs.mt;
    const shiftC = cs.shift / CELL;
    const BAR = mt.barTicks / CELL;
    const nBars = Math.max(1, Math.round((cs.end + cs.shift) / mt.barTicks));
    // the word that starts on a cell (a syllable's first column), and the pitch colour of each onset
    const wordAt = new Map();
    cs.ons.forEach(o => {
      if (!o.item) return;
      const sy = model.syllables[o.item.si];
      if (sy && sy.cols[0] === o.item.cols[0] && sy.text && sy.text !== '-') wordAt.set(o.start / CELL, { text: sy.text, hy: !!sy.hy });
    });
    return { line, model, cs, cells: cs.cells, mt, shiftC, BAR, nBars, wordAt };
  }
  function colourOf(cell) {
    const item = cell && cell.item;
    if (!item) return null;
    const n = item.cols[0].notes.find(x => !x.rest);
    return (n && SW.music.noteColour(n.n)) || null;
  }
  /* the cell where a word's own rest begins (a silent item — flow.js CELLS) */
  const silentStart = (cell, c) => !!(cell && cell.silent && cell.item && cell.on && cell.on.start === c * CELL);
  const SILENCE = { rest: 1, reston: 1, fill: 1 };

  /* ================= drawing ================= */
  function render() {
    const on = shown();
    el.hidden = !on;
    if (!on) { typing = null; return; }
    // a block is a beat here, so the page's opening makes it one for good (score.js writeAllBlocks):
    // the edit redraws everything through score:changed, and this render comes round again
    if (live() && SW.score.writeAllBlocks(meter().beatValue)) return;
    const sg = SW.timing.song();
    const mt = sg.meter;
    const PB = perBeat();
    const liveNow = live();
    // no head row: the RHYTHM title, its hint and Dots | Easy went (user, 2026-10-26)
    let html = '';
    if (!sg.lines.length) html += '<div class="rp-empty">Add a line to the song to shape its rhythm</div>';
    sg.lines.forEach((le, li) => {
      const d = lineData(le.line);
      const label = d.model.label;
      const bg = le.line.style.backgroundColor;
      html += '<div class="rp-line" data-line="' + li + '"' + (bg ? ' style="--line-bg:' + bg + '"' : '') + '>';
      if (label) html += '<div class="rp-label">' + esc(label) + '</div>';
      for (let k = 0; k < d.nBars; k++) {
        const pickup = d.cs.shift > 0 && k === 0;
        const barC0 = k * d.BAR - d.shiftC;
        const songBar = pickup ? 0 : Math.round((le.at + le.barStart(k) - sg.pickup) / mt.barTicks) + 1;
        let beats = '', words = '', n = 0;
        for (let b = 0; b < mt.beats; b++) {
          const c0 = barC0 + b * PB, c1 = c0 + PB;
          if (c1 <= 0) continue;                           // wholly before the line starts (a short pick-up)
          beats += beatHtml(d, li, c0, c1, b, n, liveNow);
          words += wordsHtml(d, li, c0, c1, n);
          n++;
        }
        html += '<div class="rp-bar"><div class="rp-measure' + (pickup ? ' rp-pickup' : '') + '" data-line="' + li + '" data-bar="' + k + '" data-c0="' + barC0 + '" style="--beats:' + n + '">' +
          (pickup ? '' : '<span class="rp-measure-number">' + songBar + '</span>') +
          beats + '<div class="rp-notes" data-line="' + li + '" data-bar="' + k + '"></div>' + words +
        '</div>';
        // the bar line after it: + a bar after, × this bar
        const last = k === d.nBars - 1;
        html += '<div class="rp-divider' + (last ? ' final' : '') + '">' +
          (liveNow ? '<button type="button" class="rp-bar-btn rp-add" data-line="' + li + '" data-bar="' + k + '" title="Add an empty bar after this one" aria-label="Add a bar">+</button>' +
                     '<button type="button" class="rp-bar-btn rp-del" data-line="' + li + '" data-bar="' + k + '" title="Take this bar out" aria-label="Take this bar out">×</button>' : '') +
        '</div></div>';
      }
      html += '</div>';
    });
    // a word being typed lives through the redraw (its box is put back, as it was)
    const box = el.querySelector('.rp-word-input');
    if (typing && box) { typing.value = box.value; typing.sel = [box.selectionStart, box.selectionEnd]; }
    redrawing = true;
    el.innerHTML = html;
    redrawing = false;
    layout();
    mark();
    if (typing) openBox();
    hyphens();
  }

  /* The hyphens between a word's syllables (score.js WORDS IN SYLLABLES):
     halfway across the white to the next word on the same row, or just
     after the word when it runs on to the next row or line — as
     components/lyric-hyphens.js does on the Notation page. */
  function hyphens() {
    el.querySelectorAll('.rp-hyphen').forEach(h => h.remove());
    el.querySelectorAll('.rp-line').forEach(line => {
      const words = Array.from(line.querySelectorAll('.rp-word'));
      if (!words.some(w => w.dataset.hy)) return;
      const lr = line.getBoundingClientRect();
      words.forEach((a, i) => {
        if (!a.dataset.hy || a.hidden || !a.offsetWidth) return;
        const b = words[i + 1];
        if (b && (b.hidden || !b.offsetWidth)) return;
        const ar = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        const pad = parseFloat(cs.paddingRight) || 0;
        const br = b ? b.getBoundingClientRect() : null;
        const sameRow = br && Math.abs(br.top - ar.top) < ar.height / 2 && br.left >= ar.right - 2 * pad;
        const x = sameRow ? (ar.right + br.left) / 2 : ar.right - pad + parseFloat(cs.fontSize) * 0.45;
        const h = document.createElement('span');
        h.className = 'rp-hyphen';
        h.setAttribute('aria-hidden', 'true');
        h.textContent = '-';
        h.style.cssText = 'left:' + (x - lr.left).toFixed(1) + 'px;top:' + (ar.top - lr.top).toFixed(1) + 'px;height:' + ar.height.toFixed(1) + 'px';
        line.appendChild(h);
      });
    });
  }

  function beatHtml(d, li, c0, c1, b, n, liveNow) {
    const cells = d.cells, PB = perBeat();
    const key = li + ':' + c0;
    const before = c0 < 0;
    const sixteenths = !before && (fine.has(key) || F.needsSixteenths(cells, c0, Math.min(c1, cells.length)));
    const slots = sixteenths ? PB : PB / 2;
    const span = PB / slots;
    const first = c0 >= 0 ? cells[c0] : null;
    const block = !!(first && (first.t === 'bon' || first.t === 'bhold'));
    let h = '<div class="rp-circles' + (block ? ' block' : '') + (liveNow ? '' : ' frozen') + (before ? ' before' : '') +
      '" data-line="' + li + '" data-c0="' + c0 + '" data-c1="' + c1 + '" data-b="' + n + '" style="--slots:' + slots + ';grid-column:' + (n + 1) + '">';
    if (liveNow && !before) {
      h += '<div class="rp-sub"><button type="button" class="rp-plus' + (sixteenths ? ' active' : '') + '" data-fine="' + c0 + '" title="' +
        (sixteenths ? 'Back to eighths — sixteenths move onto the eighth before them' : 'Split this beat into sixteenths') + '" aria-label="Sixteenths">+</button></div>';
    }
    if (liveNow && !before && b < d.mt.beats - 1 && c1 < cells.length) {
      const j = F.joined(cells, c1), can = j || F.canJoin(cells, c1);
      if (can) h += '<button type="button" class="rp-link' + (j ? ' active' : '') + '" data-join="' + c1 + '" data-end="' + (c1 + PB) + '" title="' +
        (j ? 'Joined — the note goes on over the beat line; tap to part them' : 'Join to the next beat — the note goes on over the beat line') + '">' + CHAIN + '</button>';
    }
    for (let i = 0; i < slots; i++) {
      const c = c0 + i * span;
      if (c < 0) { h += '<span class="rp-circle off" aria-hidden="true"></span>'; continue; }
      const cell = cells[c] || { t: 'fill' };
      let cls = 'rp-circle', title;
      switch (cell.t) {
        case 'on': case 'bon': cls += ' active'; title = 'A note starts here — tap to stop it'; break;
        case 'hold': case 'bhold': cls += ' sustain'; title = 'The note goes on — tap to start a new note here'; break;
        default:
          if (silentStart(cell, c)) { cls += ' silent'; title = 'This word rests — tap and it sounds'; }
          else title = 'Silence — tap for a note';
      }
      if (liveNow) h += '<button type="button" class="' + cls + '" data-cell="' + c + '" data-span="' + span + '" title="' + title + '"></button>';
      else h += '<span class="' + cls + '"></span>';
    }
    return h + '</div>';
  }

  function wordsHtml(d, li, c0, c1, n) {
    const PB = perBeat();
    const key = li + ':' + c0;
    const sixteenths = c0 >= 0 && (fine.has(key) || F.needsSixteenths(d.cells, c0, Math.min(c1, d.cells.length)));
    const slots = sixteenths ? PB : PB / 2;
    const span = PB / slots;
    let h = '<div class="rp-words" data-b="' + n + '" style="--slots:' + slots + ';grid-column:' + (n + 1) + '">';
    for (let i = 0; i < slots; i++) {
      const c = c0 + i * span;
      let text = null;
      for (let j = c; j < c + span && j < c1; j++) if (d.wordAt.has(j)) { text = d.wordAt.get(j); break; }
      if (text !== null) h += '<span class="rp-word" data-col="' + (i + 1) + '"' + (text.hy ? ' data-hy="1"' : '') + ' style="grid-column:' + (i + 1) + '">' + esc(text.text) + '</span>';
    }
    return h + '</div>';
  }

  /* ================= layout: columns, then the notation on the circles ================= */
  /* Only the room the music needs (the user, 2026-10-26: one bar a row,
     because every beat's pill was as wide as its widest word in EVERY
     slot, plus a broad gutter). Now a pill hugs its circles — a slot is a
     circle and a breath — and the words take what they need from there:
       • two words in one pill: that pill's slots widen (its circles stay
         evenly spaced);
       • two words in different pills: the space BETWEEN the pills grows,
         shared evenly by the bar lines of the beats between them (a held
         beat stretches with them);
       • the bar's first and last words: the bar is padded at its ends.
     A word hangs past its slot freely when nothing is beside it. Worked
     on the model of the pills (their gutters, borders and margins read
     from the CSS), so it is one pass, then one write. */
  function layout() {
    const k = bs();
    const GAP = 5 * k;                       // between two words (each word's box has 3 px of its own each side)
    const HY_GAP = 22 * k;                   // a syllable whose word goes on keeps room for its hyphen
    const WALL = 4 * k;                      // how far a bar's first / last word may hang over the bar's end
    const measures = Array.from(el.querySelectorAll('.rp-measure'));
    const dot = el.querySelector('.rp-circle');
    const U = ((dot && dot.offsetWidth) || 26 * k) + 4 * k;     // a slot: a circle and a breath
    const pillCs = el.querySelector('.rp-circles');
    const px = (cs, p) => parseFloat(cs.getPropertyValue(p)) || 0;
    const ch = pillCs ? getComputedStyle(pillCs) : null;
    const GL = ch ? px(ch, 'padding-left') : 18, GR = ch ? px(ch, 'padding-right') : 6;
    const BW = ch ? px(ch, 'border-left-width') : 1.5;
    const ML = ch ? px(ch, 'margin-left') : 2, MR = ML;   // --gap not yet written: the base margins
    // a pill at its smallest is 15% wider than its circles alone would make it (the user, same day):
    // the extra goes to its slots (the circles spread a little; the + keeps its gutter)
    const uMin = n => (1.15 * (2 * BW + GL + GR + n * U) - (2 * BW + GL + GR)) / n;
    // 1. per bar: the pills, their words, and the room each needs
    const plans = measures.map(m => {
      const pills = Array.from(m.querySelectorAll('.rp-circles')).map(c => {
        const w = m.querySelector('.rp-words[data-b="' + c.dataset.b + '"]');
        const slots = Number(getComputedStyle(c).getPropertyValue('--slots')) || 2;
        return { c, w, slots, u: uMin(slots), gap: 0 };
      });
      const words = [];
      pills.forEach((p, b) => {
        if (p.w) p.w.querySelectorAll('.rp-word').forEach(x => words.push({ b, j: Number(x.dataset.col) - 1, w: x.offsetWidth, hy: !!x.dataset.hy }));
      });
      words.sort((a, z) => a.b - z.b || a.j - z.j);
      const outer = p => ML + 2 * BW + GL + GR + p.slots * p.u + MR + p.gap;
      const centre = (b, j) => {
        let x = 0;
        for (let i = 0; i < b; i++) x += outer(pills[i]);
        return x + ML + BW + GL + (j + 0.5) * pills[b].u;
      };
      const room = (a, z) => a.w / 2 + z.w / 2 + (a.hy ? HY_GAP : GAP);
      // words in the same pill: its slots widen
      for (let i = 1; i < words.length; i++) {
        const a = words[i - 1], z = words[i];
        if (a.b === z.b) pills[z.b].u = Math.max(pills[z.b].u, room(a, z) / (z.j - a.j));
      }
      // words in different pills: the bar lines of the beats between them part
      for (let i = 1; i < words.length; i++) {
        const a = words[i - 1], z = words[i];
        if (a.b === z.b) continue;
        const short = room(a, z) - (centre(z.b, z.j) - centre(a.b, a.j));
        if (short > 0) for (let b = a.b; b < z.b; b++) pills[b].gap += short / (z.b - a.b);
      }
      // the bar's ends
      let padL = 0, padR = 0;
      if (words.length) {
        const f = words[0], l = words[words.length - 1];
        padL = Math.max(0, f.w / 2 - WALL - centre(f.b, f.j));
        const width = pills.reduce((s, p) => s + outer(p), 0);
        padR = Math.max(0, centre(l.b, l.j) + l.w / 2 + (l.hy ? HY_GAP / 2 : 0) - WALL - width);
      }
      return { m, pills, padL, padR };
    });
    // 2. write them
    plans.forEach(({ m, pills, padL, padR }) => {
      m.style.paddingLeft = padL ? padL.toFixed(1) + 'px' : '';
      m.style.paddingRight = padR ? padR.toFixed(1) + 'px' : '';
      pills.forEach(p => [p.c, p.w].forEach(x => {
        if (!x) return;
        x.style.setProperty('--slot-w', p.u.toFixed(1) + 'px');
        x.style.setProperty('--gap', p.gap.toFixed(1) + 'px');
      }));
    });
    // 3. read the circles' centres and engrave each bar on them
    const mt = meter(), PB = perBeat(), BAR = mt.barTicks / CELL;
    // the notes box's own height (--rp-note-h is a calc(), which parseFloat cannot read)
    const firstBox = el.querySelector('.rp-notes');
    const noteH = (firstBox && firstBox.offsetHeight) || 104 * k;
    // the engraver's picture is 6.9 staff spaces tall (room for flags above, ties below);
    // the box is 5.2 of them, so the picture overflows it a little. --rp-note-h makes the
    // staff space the Notation page's (20 px × --bs): the notes read as big there as here
    const ss = noteH / 5.2;
    // the ink ring round every head, the Notation page's too (staff.js E.outline: 0.055 S, never under 1 px), in glyph units
    const ring = Math.max(1, ss * 0.055) * 360 / ss;
    const picH = ss * 6.9;
    const all = lines();
    const dataCache = new Map();
    measures.forEach(m => {
      const li = Number(m.dataset.line);
      const line = all[li];
      if (!line) return;
      if (!dataCache.has(li)) dataCache.set(li, lineData(line));
      const d = dataCache.get(li);
      const barC0 = Number(m.dataset.c0);
      const box = m.querySelector('.rp-notes');
      if (!box) return;
      const br = box.getBoundingClientRect();
      // centre x of the slot holding each cell
      const centres = new Map();
      m.querySelectorAll('.rp-circles').forEach(c => {
        const c0 = Number(c.dataset.c0);
        const circles = Array.from(c.querySelectorAll('.rp-circle'));
        const span = PB / circles.length;
        circles.forEach((circ, i) => {
          const r = circ.getBoundingClientRect();
          const x = r.left + r.width / 2 - br.left;
          for (let j = 0; j < span; j++) centres.set(c0 + i * span + j, x);
        });
      });
      let str = '';
      for (let a = barC0; a < barC0 + BAR; a++) {
        const cell = a >= 0 ? d.cells[a] : null;
        const t = cell ? cell.t : 'fill';
        str += (t === 'on' || t === 'bon') ? 'X' : (t === 'hold' || t === 'bhold') ? 'O' : 'R';
      }
      const xAt = a => { const v = centres.get(barC0 + a); return v === undefined ? 0 : v; };
      const held = c => { const t = c && c.t; return t === 'hold' || t === 'bhold'; };
      box.innerHTML = SW.engrave.rhythm(str, {
        perBeat: PB, barCells: BAR, compound: mt.compound, ss, xAt, width: br.width, from: Math.max(0, -barC0),
        tiedIn: barC0 > 0 && held(d.cells[barC0]),                 // the note before the bar line goes on into this bar
        tiedOut: held(d.cells[barC0 + BAR])                         // the bar's last note goes on into the next
      });
      const svg = box.firstElementChild;
      if (!svg) return;
      svg.setAttribute('width', br.width);
      svg.setAttribute('height', picH);
      svg.style.top = ((noteH - picH) / 2) + 'px';
      svg.style.setProperty('--ring', ring.toFixed(1));
      svg.querySelectorAll('g[data-a]').forEach(g => {
        const a = barC0 + Number(g.dataset.a);
        const cell = d.cells[a];
        const col = colourOf(cell);
        if (col) g.style.setProperty('--c', col);
        if (cell && (cell.t === 'bon' || cell.t === 'bhold')) g.classList.add('block');
      });
    });
  }

  /* ================= selection and playback ================= */
  function beatElFor(stack) {
    const line = stack && stack.closest('.notation-line');
    if (!line) return null;
    const li = lines().indexOf(line);
    const ev = SW.timing.lineEvents(line).events.find(e => e.stack === stack);
    if (!ev) return null;
    const c = ev.start / CELL;
    return Array.from(el.querySelectorAll('.rp-circles[data-line="' + li + '"]')).find(b => c >= Number(b.dataset.c0) && c < Number(b.dataset.c1)) || null;
  }
  /* The glow behind the selected (or sounding) note itself — a beat's
     pill often holds several notes, so the ring on the pill alone does
     not say which (the user, 2026-10-26). Drawn as the Notation page
     draws it (staff.js: two soft discs of Do's colour under the ink),
     and under the same switch, View → Light up selected/played: Note or
     Both; Box and Off leave only the pill's ring. */
  function glowNote(beat, stack) {
    const light = SW.settings.view ? SW.settings.view.playLight : 'note';
    if (light !== 'note' && light !== 'both') return;
    const m = beat.closest('.rp-measure');
    const svg = m && m.querySelector('.rp-notes svg');
    if (!svg) return;
    const line = stack.closest('.notation-line');
    const ev = SW.timing.lineEvents(line).events.find(e => e.stack === stack);
    if (!ev) return;
    const c = ev.start / CELL - Number(m.dataset.c0);
    // the piece drawn at the column's start, or the one it is inside (a tie chain drawn as one sound)
    const pieces = Array.from(svg.querySelectorAll('g[data-a]'));
    let g = pieces.find(p => Number(p.dataset.a) === c);
    if (!g) g = pieces.filter(p => Number(p.dataset.a) < c).pop();
    if (!g) return;
    const ink = g.querySelector('.head') || g;
    const r = ink.getBoundingClientRect();
    if (!r.width) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const pt = new DOMPoint(r.left + r.width / 2, r.top + r.height / 2).matrixTransform(ctm.inverse());
    const vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.height;
    const ss = (vb || parseFloat(svg.getAttribute('height')) || 0) / 6.9;        // the picture is 6.9 staff spaces tall
    if (!ss) return;
    const colour = SW.settings.lightColour ? SW.settings.lightColour() : '#9C168E';
    const NS = 'http://www.w3.org/2000/svg';
    [[1.7, 0.2], [1.15, 0.45]].forEach(([k, op]) => {
      const disc = document.createElementNS(NS, 'circle');
      disc.setAttribute('class', 'rp-glow');
      disc.setAttribute('cx', pt.x.toFixed(1));
      disc.setAttribute('cy', pt.y.toFixed(1));
      disc.setAttribute('r', (ss * k).toFixed(1));
      disc.setAttribute('fill', colour);
      disc.setAttribute('opacity', String(op));
      svg.insertBefore(disc, svg.firstChild);                                   // behind every piece of ink
    });
  }
  function mark() {
    if (el.hidden) return;
    el.querySelectorAll('.rp-circles.sel, .rp-circles.playing').forEach(b => b.classList.remove('sel', 'playing'));
    el.querySelectorAll('.rp-notes .rp-glow').forEach(d => d.remove());
    const note = SW.score.getActiveNote();
    const stack = note && note.closest('.harmony-stack');
    const beat = beatElFor(stack);
    if (!beat) return;
    beat.classList.add(S.playing ? 'playing' : 'sel');
    glowNote(beat, stack);
    if (S.playing && stage && SW.settings.view && SW.settings.view.followScroll !== false) {
      const r = beat.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      if (r.top < sr.top + 8 || r.bottom > sr.bottom - 8) {
        stage.scrollTo({ top: stage.scrollTop + (r.top - sr.top) - sr.height * 0.3, behavior: 'smooth' });
      }
    }
  }

  /* ================= gestures ================= */
  function current(li) {
    const line = lines()[li];
    return line ? lineData(line) : null;
  }
  function pour(d, cells, focus) {
    const changedIt = F.applyCells(d.line, cells, focus);
    const note = SW.score.getActiveNote();
    if (changedIt && note && !note.classList.contains('rest-note')) SW.score.soundNote(note);
    if (!changedIt) render();
  }
  /* an empty bar (a bar of rests) put in at cell `at`; a sound held into there is cut cleanly */
  function insertBar(cells, at, BAR) {
    cells = cells.slice();
    while (cells.length < at) cells.push({ t: 'fill' });
    const bar = [];
    for (let i = 0; i < BAR; i++) bar.push({ t: i ? 'rest' : 'reston' });
    cells.splice(at, 0, ...bar);
    const after = at + BAR;
    if (after < cells.length && cells[after].t === 'hold') cells[after] = Object.assign({}, cells[after], { t: 'on' });
    if (after < cells.length && cells[after].t === 'bhold') cells[after] = Object.assign({}, cells[after], { t: 'bon' });
    return cells;
  }
  function deleteBar(cells, at, BAR) {
    cells = cells.slice();
    const a = Math.max(0, at);                // a pick-up bar begins before the line: only its own cells go
    cells.splice(a, BAR - (a - at));
    at = a;
    if (at < cells.length && cells[at] && cells[at].t === 'hold') cells[at] = Object.assign({}, cells[at], { t: 'on' });
    if (at < cells.length && cells[at] && cells[at].t === 'bhold') cells[at] = Object.assign({}, cells[at], { t: 'bon' });
    if (at < cells.length && cells[at] && cells[at].t === 'rest') cells[at] = Object.assign({}, cells[at], { t: 'reston' });
    return cells;
  }

  /* ================= typing a word (2026-10-26) =================
     A double-click (a double tap) on a note, or in the words' row under
     it, opens its word in a box under it, as on the Notation page: Enter
     or a click elsewhere keeps it, Esc lets it go, Space at its end keeps
     it and opens the next word. The words are the song's (score.js
     setWordAt), so a word given to a connected note makes it a syllable
     of its own. Live whenever the words may change, hat or not, like the
     circles. */
  const ownWord = stack => {
    const syl = stack.closest('.syllable');
    const first = syl && syl.querySelector('.notes-container > .harmony-stack') === stack;
    const t = first ? ((syl.querySelector('.text') || {}).textContent || '').trim() : '';
    return t === '-' ? '' : t;
  };
  /* the column (harmony-stack) of the note drawn nearest x in a bar, or null
     (none within `reach` px, 40 × bs if not given); a tied piece belongs to the
     note it goes on from; `rests`: a rest counts too (its rest column) */
  function stackNear(m, clientX, rests, reach) {
    const line = lines()[Number(m.dataset.line)];
    if (!line) return null;
    let best = null, bd = Infinity;
    m.querySelectorAll('.rp-notes g[data-a]' + (rests ? '' : ':not(.is-rest)')).forEach(g => {
      const r = (g.querySelector('.head') || g).getBoundingClientRect();
      const d = Math.abs(clientX - (r.left + r.width / 2));
      if (d < bd) { bd = d; best = g; }
    });
    if (!best || bd > (reach || 40 * bs())) return null;
    const at = (Number(m.dataset.c0) + Number(best.dataset.a)) * CELL;
    const rest = best.classList.contains('is-rest');
    const evs = SW.timing.lineEvents(line).events.filter(ev => ev.start <= at && (rest || !ev.rest));
    const ev = evs[evs.length - 1];
    return ev && !!ev.rest === rest ? ev.stack : null;          // a rest after the line's music has no column
  }
  /* where a column's word goes: the words' row and grid column of the slot its note starts on */
  function wordSlot(stack) {
    const line = stack.closest('.notation-line');
    const li = lines().indexOf(line);
    const ev = li >= 0 && SW.timing.lineEvents(line).events.find(x => x.stack === stack);
    if (!ev) return null;
    const c = ev.start / CELL;
    const circ = Array.from(el.querySelectorAll('.rp-circles[data-line="' + li + '"]')).find(b => c >= Number(b.dataset.c0) && c < Number(b.dataset.c1));
    const row = circ && circ.parentElement.querySelector('.rp-words[data-b="' + circ.dataset.b + '"]');
    if (!row) return null;
    const span = perBeat() / (Number(circ.style.getPropertyValue('--slots')) || 2);
    return { row, col: Math.floor((c - Number(circ.dataset.c0)) / span) + 1 };
  }
  function openWord(e) {
    if (!SW.settings.can('words')) return false;
    const t = document.elementFromPoint(e.clientX, e.clientY) || e.target;     // the page may have been redrawn under the pointer
    const m = t.closest('.rp-measure');
    if (!m || !t.closest('.rp-notes, .rp-words') || t.closest('.rp-word-input')) return false;
    const stack = stackNear(m, e.clientX);
    if (!stack) return false;
    if (typing) keepWord(false);
    typing = { stack, value: ownWord(stack) };
    SW.bus.emit('words:typing', { on: true });
    openBox();
    return true;
  }
  function openBox() {
    const slot = typing && document.contains(typing.stack) && wordSlot(typing.stack);
    if (!slot) { typing = null; SW.bus.emit('words:typing', { on: false }); return; }   // its note is gone
    const word = slot.row.querySelector('.rp-word[data-col="' + slot.col + '"]');
    if (word) word.hidden = true;
    const box = document.createElement('input');
    box.type = 'text';
    box.className = 'rp-word-input';
    box.style.gridColumn = String(slot.col);
    box.value = typing.value;
    box.setAttribute('aria-label', 'The word for this note');
    const fit = () => { box.size = Math.max(3, box.value.length + 1); };
    fit();
    slot.row.appendChild(box);
    box.focus();
    if (typing.sel) box.setSelectionRange(typing.sel[0], typing.sel[1]);
    else box.select();
    box.addEventListener('input', fit);
    box.addEventListener('blur', () => { if (!redrawing) keepWord(false); });
    box.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); keepWord(false); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); dropWord(); }
      else if (e.key === ' ' && box.selectionStart === box.value.length && box.selectionEnd === box.value.length) { e.preventDefault(); keepWord(true); }
    });
  }
  /* the box taken out (its blur keeps nothing): what was typed in it */
  function takeBox(t) {
    const box = el.querySelector('.rp-word-input');
    if (!box) return t.value;
    redrawing = true;
    box.remove();
    redrawing = false;
    return box.value;
  }
  /* the word goes into the song; `next`: the next word opens */
  function keepWord(next) {
    const t = typing;
    if (!t) return;
    typing = null;
    const value = takeBox(t);
    const syl = SW.score.setWordAt(t.stack, value);
    if (next && syl) {
      const all = Array.from(SW.score.getAllSyllables());
      const after = all[all.indexOf(syl) + 1];
      const stack = after && after.querySelector('.notes-container > .harmony-stack');
      if (stack) typing = { stack, value: ownWord(stack) };
    }
    if (!typing) SW.bus.emit('words:typing', { on: false });
    render();
  }
  function dropWord() {
    if (!typing) return;
    takeBox(typing);
    typing = null;
    SW.bus.emit('words:typing', { on: false });
    render();
  }

  el.addEventListener('dblclick', e => {
    if (performance.now() - tapOpenAt < 600) return;           // already opened by the double tap
    if (openWord(e)) e.stopPropagation();
  });
  /* a double tap (a finger, a pen): the browser sends no dblclick for touches everywhere */
  let lastTap = null;
  el.addEventListener('pointerup', e => {
    if (e.pointerType === 'mouse') return;
    if (!e.target.closest('.rp-notes, .rp-words') || e.target.closest('.rp-word-input')) { lastTap = null; return; }
    const now = performance.now();
    if (lastTap && now - lastTap.t < 420 && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < 28) {
      lastTap = null;
      if (openWord(e)) tapOpenAt = now;
    } else lastTap = { t: now, x: e.clientX, y: e.clientY };
  });

  el.addEventListener('mousedown', e => {
    // a button keeps the focus where it is; so does the tap that just opened a word (its mousedown would close it)
    if (e.target.closest('button') || performance.now() - tapOpenAt < 500) e.preventDefault();
  });
  el.addEventListener('click', e => {
    e.stopPropagation();
    if (performance.now() - tapOpenAt < 500 || e.target.closest('.rp-word-input')) return;
    if (typing) keepWord(false);                               // a button does not take the focus: the word is kept here
    SW.ui.closeAllPopovers();
    const b = e.target.closest('button');
    if (!b) {
      // a note, or the word under it: that note is selected and sounds, as on the
      // other pages (it used to be the bar's first note — user, 2026-10-26); Play starts there
      const m = e.target.closest('.rp-measure');
      if (m && e.target.closest('.rp-notes, .rp-words')) {
        const stack = stackNear(m, e.clientX, true, Infinity);
        const note = stack && stack.querySelector('.note');
        if (note) SW.score.setNoteAsActive(note, true);
      }
      return;
    }
    if (b.disabled) return;
    if (!live()) return;
    const holder = b.closest('[data-line]');
    const li = Number(holder ? holder.dataset.line : -1);
    const d = current(li);
    if (!d) return;
    const cells = d.cells, PB = perBeat();
    if (b.dataset.fine !== undefined) {
      const c0 = Number(b.dataset.fine), key = li + ':' + c0;
      if (fine.has(key) || F.needsSixteenths(cells, c0, c0 + PB)) {
        fine.delete(key);
        if (F.needsSixteenths(cells, c0, c0 + PB)) pour(d, F.coarsen(cells, c0, c0 + PB), c0);
        else render();
      } else { fine.add(key); render(); }
      return;
    }
    if (b.dataset.join !== undefined) {
      const c1 = Number(b.dataset.join);
      pour(d, F.toggleJoin(cells, c1, Number(b.dataset.end)), c1 - 1);
      return;
    }
    if (b.dataset.cell !== undefined) {
      const c = Number(b.dataset.cell), span = Number(b.dataset.span) || 1;
      const circ = b.closest('.rp-circles');
      const c0 = Math.max(0, Number(circ.dataset.c0)), c1 = Number(circ.dataset.c1);
      const cell = cells[c] || { t: 'fill' };
      // where a word's own rest begins: the word sounds again (the pitch its rest kept)
      if (silentStart(cell, c)) {
        const stack = F.stackAt(d.line, d.model, cell.item.cols[0]);
        if (stack && SW.score.unrestColumn(stack)) return;
      }
      const wasBlock = cell.t === 'bon' || cell.t === 'bhold';
      let next = F.tapSlot(cells, c, span, c0, c1);
      if (wasBlock && c === c0) next = F.tapSlot(next, c, span, c0, c1);     // written, then the tap itself: one tap does both
      // silence tapped past the melody's last note, with nothing to lengthen: no note can start (flow.js R2)
      if (SILENCE[cell.t] && next.every((x, i) => x.t === cells[i].t)) { SW.ui.toast(NO_NOTE_MSG); return; }
      pour(d, next, c);
      return;
    }
    if (b.classList.contains('rp-add') || b.classList.contains('rp-del')) {
      const k = Number(b.dataset.bar);
      const at = k * d.BAR - d.shiftC;
      if (b.classList.contains('rp-add')) pour(d, insertBar(cells, Math.max(0, at + d.BAR), d.BAR), Math.max(0, at + d.BAR));
      else {
        if (d.nBars <= 1 && k === 0 && !cells.some(c => c.item)) { SW.ui.toast('This is the line\'s only bar — delete the line in Edit instead'); return; }
        pour(d, deleteBar(cells, at, d.BAR), Math.max(0, at));
      }
    }
  });

  /* ================= when to redraw ================= */
  let timer = 0;
  function schedule() { clearTimeout(timer); timer = setTimeout(render, 20); }
  ['score:changed', 'score:loaded', 'view:changed', 'layout:changed', 'meter:changed', 'policy:changed', 'key:changed', 'scale:changed', 'present:changed'].forEach(evt => SW.bus.on(evt, schedule));
  SW.bus.on('score:loaded', () => fine.clear());
  SW.bus.on('selection', mark);
  SW.bus.on('play:changed', mark);
  window.addEventListener('resize', () => { if (!el.hidden) schedule(); });

  render();
  SW.rhythmPage = { render };
})();

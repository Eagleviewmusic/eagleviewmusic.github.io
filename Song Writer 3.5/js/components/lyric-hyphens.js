/* ==========================================================================
   Song Writer 3.5 — components/lyric-hyphens.js
   --------------------------------------------------------------------------
   The hyphens between the syllables of a word (2026-10-26, the user's
   ask): Wa - ter - mel - on, each hyphen halfway between the end of one
   syllable and the start of the next — where an engraver puts it, and
   where no one typing a dash into the words could (Wa -ter put it against
   one side and spoiled the spacing).

   A syllable whose word goes on (`hy`, data-hy — score.js WORDS IN
   SYLLABLES) gets a hyphen after its word:
     • the next syllable on the same row: halfway across the white between;
     • the next one on another row or line (the word runs on): just after
       the word, as a line-end hyphen is printed;
     • none when either side has no word ("-" already shows a dash), or
       while a word is being typed there.
   The Pitch page shows words whole (score.js joins their syllables), so
   only a word that runs on into the next line gets one there. The Rhythm
   page draws its own (rhythm-page.js).

   Drawn after the staff (every 'staff:drawn' — any change, selection,
   size or page), measured from where the words actually landed, into one
   .hy-layer per line: absolutely placed, pointer-events off, the lyric's
   own font — so the hyphen sits at exactly the height a hyphen in the
   word would. staff.js leaves a little more white between the words of a
   syllable pair so that there is room for it.
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const score = document.getElementById('score');
  if (!score) return;

  const blank = el => !el || !el.offsetWidth || !el.textContent.trim() || el.textContent.trim() === '-';
  const textOf = syl => syl && syl.querySelector(':scope > .syl-body > .text');

  /* WORDLESS NOTES (2026-11-22, bug report 1a): a note with no word is
     held on a "-" syllable (score.js), and that "-" was printed under it,
     so Oh - say read like a hyphenated word and a part copied as rhythm
     had a dash under every note. The "-" stays (it is the model's, and
     what Lyrics shows) but is not printed: the note is sung on the word
     before, which an extender line shows (below). staff.js gives it no room. */
  function markWordless() {
    score.querySelectorAll('.syllable > .syl-body > .text').forEach(t => {
      const w = t.textContent.trim() === '-';
      if (t.classList.contains('wordless') !== w) t.classList.toggle('wordless', w);
      const c = w ? 'transparent' : '';
      if (t.style.color !== c) t.style.color = c;
    });
  }
  const isRestStack = st => !!st.querySelector('.note.rest-note') && !st.querySelector('.note:not(.rest-note)');

  function draw() {
    markWordless();
    const lines = Array.from(score.querySelectorAll('.notation-line'));
    const marks = new Map(lines.map(l => [l, []]));
    const extenders = new Map(lines.map(l => [l, []]));
    if (!document.body.classList.contains('page-rhythm')) {
      const syls = Array.from(score.querySelectorAll('.syllable'));
      const boxes = new Map();
      const boxOf = l => { if (!boxes.has(l)) boxes.set(l, l.getBoundingClientRect()); return boxes.get(l); };
      /* THE EXTENDER LINE (bug report 1b): a word sung over several notes —
         its own connected notes, then the wordless notes after it — gets a
         line from its end to the last of them, Here______, as printed music
         has it; on Notation only, and only after a word's last syllable (a
         syllable in the middle of a word has its hyphen instead). A rest
         ends it; on the next row it starts again at the row's first note. */
      syls.forEach((syl, i) => {
        if (syl.dataset.hy || syl.classList.contains('editing')) return;
        const line = syl.closest('.notation-line.has-staff');
        const a = textOf(syl);
        if (!line || blank(a) || !SW.staff || !SW.staff.inkOf) return;
        const run = Array.from(syl.querySelectorAll('.harmony-stack')).slice(1);
        for (let j = i + 1; j < syls.length; j++) {
          const nx = syls[j];
          if (nx.closest('.notation-line') !== line || nx.classList.contains('editing') || !blank(textOf(nx))) break;
          run.push(...nx.querySelectorAll('.harmony-stack'));
        }
        const held = [];
        for (const st of run) { if (isRestStack(st)) break; held.push(st); }
        if (!held.length) return;
        const lr = boxOf(line);
        const ar = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        const fs = parseFloat(cs.fontSize) || 22;
        const pad = parseFloat(cs.paddingRight) || 0;
        // the held notes by row: a row's columns share a bottom edge (its bar base — a column's
        // top is as high as its note, so it can't tell rows apart)
        const baseOf = st => st.getBoundingClientRect().bottom;
        const rows = [];
        held.forEach(st => {
          const ink = SW.staff.inkOf(st);
          if (!ink) return;
          const base = baseOf(st);
          let row = rows.find(r => Math.abs(r.base - base) < fs);
          if (!row) rows.push(row = { base, list: [] });
          row.list.push({ st, ink });
        });
        rows.forEach((row, ri) => {
          const first = row.list[0], last = row.list[row.list.length - 1];
          // the row the word is on starts after the word; a later row at its first note's left
          const onWordRow = ri === 0 && Math.abs(baseOf(first.st) - baseOf(syl.querySelector('.harmony-stack'))) < fs;
          const tRect = onWordRow ? ar : (textOf(first.st.closest('.syllable')) || a).getBoundingClientRect();
          const x0 = onWordRow ? ar.right - pad - lr.left + fs * 0.12 : first.ink.cx - (first.ink.right - first.ink.cx);
          const x1 = last.ink.right;
          if (x1 - x0 < fs * 0.4) return;
          extenders.get(line).push({ x: x0, w: x1 - x0, y: tRect.top - lr.top + tRect.height / 2 + fs * 0.34, t: Math.max(1, fs * 0.06), color: cs.color });
        });
      });
      syls.forEach((syl, i) => {
        if (!syl.dataset.hy) return;
        const a = syl.querySelector(':scope > .syl-body > .text');
        // the word goes on in the next syllable with a word: the wordless notes between are sung on this one
        let k = i + 1;
        while (k < syls.length && blank(textOf(syls[k])) && !syls[k].classList.contains('editing') && textOf(syls[k]) && textOf(syls[k]).offsetWidth) k++;
        const next = syls[k];
        const b = next && next.querySelector(':scope > .syl-body > .text');
        if (blank(a) || (next && blank(b) && !next.classList.contains('editing'))) return;
        if (next && next.classList.contains('editing')) return;
        const line = syl.closest('.notation-line');
        const lr = boxOf(line);
        const ar = a.getBoundingClientRect();
        const cs = getComputedStyle(a);
        const pad = parseFloat(cs.paddingRight) || 0;
        let x;
        const br = b && next.closest('.notation-line') === line ? b.getBoundingClientRect() : null;
        if (br && Math.abs((br.top + br.bottom) / 2 - (ar.top + ar.bottom) / 2) < ar.height / 2 && br.left >= ar.right - 2 * pad) {
          x = (ar.right + br.left) / 2;                          // halfway across the white
        } else {
          x = ar.right - pad + parseFloat(cs.fontSize) * 0.45;   // the word runs on: just after it
        }
        marks.get(line).push({ x: x - lr.left, y: ar.top - lr.top, h: ar.height, cs });
      });
    }
    lines.forEach(line => {
      let layer = line.querySelector(':scope > .hy-layer');
      const list = marks.get(line);
      const ext = extenders.get(line);
      if (!list.length && !ext.length) { if (layer) layer.remove(); return; }
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'hy-layer';
        layer.setAttribute('aria-hidden', 'true');
        line.insertBefore(layer, line.firstChild);
      }
      if (list.length) {
        const cs = list[0].cs;
        layer.style.fontFamily = cs.fontFamily;
        layer.style.fontSize = cs.fontSize;
        layer.style.fontWeight = cs.fontWeight;
        layer.style.lineHeight = cs.lineHeight;
        layer.style.color = cs.color;
      }
      layer.innerHTML = list.map(m =>
        '<span class="lyric-hyphen" style="left:' + m.x.toFixed(1) + 'px;top:' + m.y.toFixed(1) + 'px;height:' + m.h.toFixed(1) + 'px">-</span>').join('') +
        ext.map(e => '<span class="lyric-extender" style="position:absolute;pointer-events:none;left:' + e.x.toFixed(1) + 'px;top:' + (e.y - e.t / 2).toFixed(1) +
          'px;width:' + e.w.toFixed(1) + 'px;height:' + e.t.toFixed(1) + 'px;background:' + e.color + '"></span>').join('');
    });
  }

  let timer = 0;
  function schedule() { clearTimeout(timer); timer = setTimeout(draw, 20); }
  SW.bus.on('staff:drawn', draw);
  SW.bus.on('words:typing', schedule);
  // the words move without a redraw when the room around them changes (the Edit box
  // folding away, a bar easing to its new height): measure again once it has settled
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(schedule).observe(score);
  score.addEventListener('transitionend', schedule);

  SW.hyphens = { draw };
})();

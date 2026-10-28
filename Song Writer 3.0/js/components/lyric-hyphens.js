/* ==========================================================================
   Song Writer 3.0 — components/lyric-hyphens.js
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

  function draw() {
    const lines = Array.from(score.querySelectorAll('.notation-line'));
    const marks = new Map(lines.map(l => [l, []]));
    if (!document.body.classList.contains('page-rhythm')) {
      const syls = Array.from(score.querySelectorAll('.syllable'));
      const boxes = new Map();
      const boxOf = l => { if (!boxes.has(l)) boxes.set(l, l.getBoundingClientRect()); return boxes.get(l); };
      syls.forEach((syl, i) => {
        if (!syl.dataset.hy) return;
        const a = syl.querySelector(':scope > .syl-body > .text');
        const next = syls[i + 1];
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
      if (!list.length) { if (layer) layer.remove(); return; }
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'hy-layer';
        layer.setAttribute('aria-hidden', 'true');
        line.insertBefore(layer, line.firstChild);
      }
      const cs = list[0].cs;
      layer.style.fontFamily = cs.fontFamily;
      layer.style.fontSize = cs.fontSize;
      layer.style.fontWeight = cs.fontWeight;
      layer.style.lineHeight = cs.lineHeight;
      layer.style.color = cs.color;
      layer.innerHTML = list.map(m =>
        '<span class="lyric-hyphen" style="left:' + m.x.toFixed(1) + 'px;top:' + m.y.toFixed(1) + 'px;height:' + m.h.toFixed(1) + 'px">-</span>').join('');
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

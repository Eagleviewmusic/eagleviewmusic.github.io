/* ==========================================================================
   Song Writer — engrave.js
   --------------------------------------------------------------------------
   SW.engrave draws the two pictures the note-value preview needs:

     value(id)      one note value on its own — the picture on a Value
                    circle and the little mark under a block
     staff(spec)    a treble staff with one block written on it: the right
                    letter on the right line, ledger lines, accidental,
                    stem, flag, dot or rest — "a quarter-note G"

   Both use the Leland glyphs every Eagle View notation app uses
   (lib/notation/glyphs-leland.js, copied from notation assets/). The
   rhythm engine in that folder draws rhythm on a single line; pitch on a
   staff is new here, so it gets its own small drawing code instead of
   bending the rhythm engine to a job it was not built for.

   Glyph outlines are in font units, 360 to a staff space, y pointing down,
   with the glyph's own origin at (0, 0). `at()` puts that origin at a
   point; `boxAt()` puts the top-left of the outline's box there.
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const G = (typeof GLYPHS_LELAND !== 'undefined') ? GLYPHS_LELAND : null;
  const UNITS = 360;
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const n2 = v => Number(Number(v).toFixed(2));

  function at(name, x, y, k, cls) {
    const g = G && G[name];
    if (!g) return '';
    return '<path class="' + (cls || name) + '" transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + n2(k * 1000) / 1000 + ')" d="' + g.d + '"/>';
  }
  function boxAt(name, x, y, k, cls, vScale) {
    const g = G && G[name];
    if (!g) return '';
    const sy = vScale === undefined ? k : k * vScale;
    return '<path class="' + (cls || name) + '" transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + n2(k * 1e5) / 1e5 + ' ' + n2(sy * 1e5) / 1e5 + ') translate(' + n2(-g.x0) + ' ' + n2(-g.y0) + ')" d="' + g.d + '"/>';
  }
  const gw = (name, k) => (G && G[name] ? G[name].w * k : 0);
  const gh = (name, k) => (G && G[name] ? G[name].h * k : 0);

  function headFor(v) {
    return v.base === 'w' ? 'noteheadWhole' : v.base === 'h' ? 'noteheadHalf' : 'noteheadBlack';
  }
  function flagsFor(v) { return v.base === 'e' ? 1 : v.base === 's' ? 2 : 0; }
  function restFor(v) {
    return { w: 'restWhole', h: 'restHalf', q: 'restQuarter', e: 'rest8th', s: 'rest16th' }[v.base];
  }

  function svg(w, h, body, cls) {
    return '<svg class="' + (cls || 'engraving') + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n2(w) + ' ' + n2(h) +
      '" width="' + n2(w) + '" height="' + n2(h) + '" fill="currentColor" stroke="none" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  /* ---------------------------------------------------------------
     value(id, { height, rest }) — a note value with an up-stem, or its
     rest, standing alone. Height is the whole picture's height in px.
     --------------------------------------------------------------- */
  function value(id, opts) {
    if (!G) return '';
    const o = opts || {};
    const v = SW.values.byId(id);
    const H = o.height || 30;
    const SS = H / 4.6;
    const k = SS / UNITS;
    const parts = [];
    let W;

    if (o.rest) {
      const name = restFor(v);
      const rw = gw(name, k), rh = gh(name, k);
      const cy = H * 0.55;
      W = rw + (v.dotted ? SS * 1.1 : 0) + 4;
      parts.push(boxAt(name, 2, cy - rh / 2, k));
      if (v.dotted) parts.push(boxAt('augmentationDot', 2 + rw + SS * 0.35, cy - SS * 0.55 - gh('augmentationDot', k) / 2, k));
      return svg(W, H, parts.join(''), 'engraving value-pic');
    }

    const head = headFor(v);
    const hw = gw(head, k);
    const noteY = H - SS * 0.62;
    const x = 2;
    parts.push(at(head, x, noteY, k));
    const flags = flagsFor(v);
    W = hw + 4;
    if (v.base !== 'w') {
      const stemW = Math.max(1.3, SS * 0.16);
      const stemTop = noteY - SS * 3.2;
      const stemX = x + hw - stemW;
      parts.push('<rect x="' + n2(stemX) + '" y="' + n2(stemTop) + '" width="' + n2(stemW) + '" height="' + n2(noteY - stemTop) + '"/>');
      if (flags) {
        const fname = flags === 2 ? 'flag16thUp' : 'flag8thUp';
        const room = (noteY - SS * 0.5) - stemTop;
        const vs = Math.min(1, room / gh(fname, k));
        parts.push(boxAt(fname, stemX, stemTop, k, 'flag', vs));
        W = Math.max(W, stemX + gw(fname, k) + 2);
      }
    }
    if (v.dotted) {
      const dx = x + hw + SS * 0.35;
      parts.push(boxAt('augmentationDot', dx, noteY - SS * 0.12 - gh('augmentationDot', k) / 2, k));
      W = Math.max(W, dx + gw('augmentationDot', k) + 2);
    }
    return svg(W, H, parts.join(''), 'engraving value-pic');
  }

  /* ---------------------------------------------------------------
     staff({ notes: [{letter, alter, octave}], value, rest, ss })

     A treble staff wide enough for the clef and one chord. `notes` are
     spelled pitches (SW.music.spellNote) — several make a harmony stack
     on one stem. Accidentals are written on every altered note: the
     preview has no key signature, so it spells each pitch in full.
     --------------------------------------------------------------- */
  function step(letter, octave) { return LETTERS.indexOf(letter) + 7 * octave; }
  const E4 = step('E', 4);          // bottom line
  const B4 = step('B', 4);          // middle line
  const ACC = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };

  function staff(spec) {
    if (!G) return '';
    const s = spec || {};
    const SS = s.ss || 6;
    const k = SS / UNITS;
    const v = SW.values.byId(s.value || 'q');
    const notes = (s.notes || []).slice().sort((a, b) => step(a.letter, a.octave) - step(b.letter, b.octave));

    const steps = notes.map(n => step(n.letter, n.octave));
    const lo = steps.length ? Math.min.apply(null, steps) : B4;
    const hi = steps.length ? Math.max.apply(null, steps) : B4;
    const stemDown = !s.rest && steps.length && ((lo + hi) / 2) >= B4;

    // room above and below the staff for ledger lines and stems
    const above = Math.max(4.2, (hi - (E4 + 8)) / 2 + (stemDown ? 1.5 : 4.2));
    const below = Math.max(2.4, (E4 - lo) / 2 + (stemDown ? 4.2 : 1.6));
    const H = (above + 4 + below) * SS;
    const bottomLine = (above + 4) * SS;
    const yOf = st => bottomLine - (st - E4) * SS / 2;

    const clefX = SS * 0.6;
    const clefW = gw('gClef', k);
    const accW = notes.some(n => n.alter) ? SS * 1.5 : 0;
    const noteX = clefX + clefW + SS * 1.2 + accW;
    const head = s.rest ? null : headFor(v);
    const hw = head ? gw(head, k) : gw(restFor(v), k);
    const W = s.width || (noteX + hw + SS * 4.2);

    const parts = [];
    // staff lines
    const lineW = Math.max(0.8, SS * 0.13);
    for (let i = 0; i < 5; i++) {
      const y = bottomLine - i * SS;
      parts.push('<rect class="staff-line" x="0" y="' + n2(y - lineW / 2) + '" width="' + n2(W) + '" height="' + n2(lineW) + '"/>');
    }
    // clef: its origin sits on the G line
    parts.push(at('gClef', clefX, yOf(step('G', 4)), k, 'clef'));

    if (s.rest || !notes.length) {
      const name = restFor(v);
      const originY = name === 'restWhole' ? yOf(step('D', 5)) : yOf(B4);
      parts.push(at(name, noteX, originY, k, 'rest'));
      if (v.dotted) parts.push(boxAt('augmentationDot', noteX + gw(name, k) + SS * 0.4, yOf(B4) - SS * 0.5 - gh('augmentationDot', k) / 2, k));
      return svg(W, H, parts.join(''), 'engraving staff-pic');
    }

    // ledger lines
    const ledgerW = hw + SS * 0.9;
    const ledgerAt = st => '<rect class="ledger" x="' + n2(noteX - SS * 0.45) + '" y="' + n2(yOf(st) - lineW / 2) + '" width="' + n2(ledgerW) + '" height="' + n2(lineW) + '"/>';
    for (let st = E4 - 2; st >= lo; st -= 2) parts.push(ledgerAt(st));
    for (let st = E4 + 10; st <= hi; st += 2) parts.push(ledgerAt(st));

    // noteheads — a second in a stack steps aside so both heads show
    let prev = null;
    const heads = notes.map((n, i) => {
      const st = steps[i];
      let dx = 0;
      if (prev !== null && st - prev.st === 1 && !prev.moved) dx = stemDown ? -hw + SS * 0.1 : hw - SS * 0.1;
      const h = { st, dx, moved: dx !== 0, n };
      prev = h;
      return h;
    });
    heads.forEach(h => {
      parts.push(at(head, noteX + h.dx, yOf(h.st), k, 'head'));
      const acc = ACC[String(h.n.alter)] || '';
      if (acc) {
        parts.push('<text class="acc" x="' + n2(noteX - SS * 0.35) + '" y="' + n2(yOf(h.st) + SS * 0.62) +
          '" font-size="' + n2(SS * 2.3) + '" text-anchor="end" font-family="\'Noto Serif\', \'Times New Roman\', serif">' + acc + '</text>');
      }
      if (v.dotted) {
        const dotY = (h.st % 2 === E4 % 2) ? yOf(h.st) - SS * 0.5 : yOf(h.st);
        parts.push(boxAt('augmentationDot', noteX + hw + SS * 0.45 + Math.max(0, h.dx), dotY - gh('augmentationDot', k) / 2, k));
      }
    });

    // stem and flag
    if (v.base !== 'w') {
      const stemW = Math.max(1.2, SS * 0.14);
      const flags = flagsFor(v);
      if (stemDown) {
        const stemX = noteX;
        const top = yOf(hi);
        const bottom = yOf(lo) + SS * 3.4;
        parts.push('<rect class="stem" x="' + n2(stemX) + '" y="' + n2(top) + '" width="' + n2(stemW) + '" height="' + n2(bottom - top) + '"/>');
        if (flags) {
          const fname = flags === 2 ? 'flag16thDown' : 'flag8thDown';
          parts.push(boxAt(fname, stemX, bottom - gh(fname, k), k, 'flag'));
        }
      } else {
        const stemX = noteX + hw - stemW;
        const bottom = yOf(lo);
        const top = yOf(hi) - SS * 3.4;
        parts.push('<rect class="stem" x="' + n2(stemX) + '" y="' + n2(top) + '" width="' + n2(stemW) + '" height="' + n2(bottom - top) + '"/>');
        if (flags) {
          const fname = flags === 2 ? 'flag16thUp' : 'flag8thUp';
          parts.push(boxAt(fname, stemX, top, k, 'flag'));
        }
      }
    }
    return svg(W, H, parts.join(''), 'engraving staff-pic');
  }

  /* The pitch a spelled note reads as, for captions: "G4", "F♯5". */
  function pitchName(n) {
    return n.letter + (ACC[String(n.alter)] || '') + n.octave;
  }

  SW.engrave = { value, staff, pitchName, available: !!G };
})();

/* ==========================================================================
   Song Writer — engrave.js
   --------------------------------------------------------------------------
   SW.engrave draws the two pictures the note-value preview needs:

     value(id)      one note value on its own — the picture on a Value
                    circle and the little mark under a block
     staff(spec)    a treble staff with one block written on it: the right
                    letter on the right line, ledger lines, accidental,
                    stem, flag, dot or rest — "a quarter-note G"

   and (2.5) the Chord Progression window's Pre-built rhythms:

     rhythm(cells, opts)   a rhythm on one line, beamed and tied
     spellBeats(n, comp)   n whole beats in the meter family's values

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

  /* ---------------------------------------------------------------
     rhythm(cells, { perBeat, barCells, compound, top, bottom, ss })

     A rhythm on one line, as a percussion part is written. `cells` is
     track.js's string, a sixteenth to a cell: X a strike, O ringing on,
     R silence. It is written the way a reader expects — a note from a
     beat that lasts whole beats is one value (𝅗𝅥, 𝅗𝅥., ♩. in compound),
     ♩. ♪ in simple time stays dotted, the off-beat quarter of ti-ta-ti
     stays one note, anything else over a beat line is tied; a beat's
     eighths and sixteenths are beamed together; a silent bar is a whole
     rest. Beats are spaced evenly, so the lines of a list line up beat
     under beat. `top`/`bottom`: the time signature at its start.
     --------------------------------------------------------------- */
  const CELL_TICKS = 6;
  const ORDER = ['w.', 'w', 'h.', 'h', 'q.', 'q', 'e.', 'e', 's'];
  const cellsOf = id => SW.values.byId(id).ticks / CELL_TICKS;
  function spellCells(n) {
    const out = [];
    let t = n * CELL_TICKS;
    while (t >= CELL_TICKS) {
      const id = ORDER.find(v => SW.values.byId(v).ticks <= t);
      out.push(id);
      t -= SW.values.byId(id).ticks;
    }
    return out;
  }
  /* whole beats, in the values a beat family has: 3 beats of 9/8 are 𝅗𝅥. ⁀ ♩., never 𝅝 ⁀ ♪ */
  const BEAT_VALUES = { simple: [[4, 'w'], [3, 'h.'], [2, 'h'], [1, 'q']], compound: [[4, 'w.'], [2, 'h.'], [1, 'q.']] };
  function spellBeats(n, comp) {
    const list = BEAT_VALUES[comp ? 'compound' : 'simple'];
    const out = [];
    while (n > 0) {
      const [b, id] = list.find(x => x[0] <= n);
      out.push(id);
      n -= b;
    }
    return out;
  }
  /* the written values: [{ a (cell), id, rest, tie (to the next), bar (a whole-bar rest) }] */
  function rhythmPieces(cells, pb, bar, comp) {
    const n = cells.length;
    const pieces = [];
    const put = (a, ids, rest) => { ids.forEach(id => { pieces.push({ a, id, rest }); a += cellsOf(id); }); return a; };
    for (let i = 0; i < n;) {
      const rest = cells[i] === 'R';
      let j = i + 1;
      while (j < n && (rest ? cells[j] === 'R' : cells[j] === 'O')) j++;
      const first = pieces.length;
      let a = i;
      while (a < j) {
        const z = Math.min(j, (Math.floor(a / bar) + 1) * bar);          // never over a bar line
        const off = a % pb, len = z - a;
        if (rest && a % bar === 0 && len === bar) { pieces.push({ a, id: 'w', rest, bar: true }); a = z; continue; }
        if (off === 0) {
          const one = spellCells(len);
          if (!comp && !rest && one.length === 1 && len > pb && len < 2 * pb) { a = put(a, one, rest); continue; }   // ♩.
          const whole = Math.floor(len / pb);
          a = put(a, whole ? spellBeats(whole, comp) : spellCells(len), rest);
          continue;
        }
        if (!comp && !rest && off === pb / 2 && len === pb) { a = put(a, ['q'], rest); continue; }       // ti-ta-ti
        a = put(a, spellCells(Math.min(z, a - off + pb) - a), rest);       // to the end of its beat
      }
      if (!rest) for (let q = first; q < pieces.length - 1; q++) pieces[q].tie = true;
      i = j;
    }
    return pieces;
  }
  function timeSigAt(top, bottom, x, lineY, SS, k) {
    const digits = s => String(s).split('').map(ch => 'timeSig' + ch);
    const widthOf = list => list.reduce((w, name) => w + gw(name, k), 0);
    const t = digits(top), b = digits(bottom);
    const W = Math.max(widthOf(t), widthOf(b));
    const row = (list, y) => {
      let xx = x + (W - widthOf(list)) / 2;
      return list.map(name => { const s = at(name, xx, y, k, 'timesig'); xx += gw(name, k); return s; }).join('');
    };
    return { svg: row(t, lineY - SS) + row(b, lineY + SS), w: W };
  }
  function rhythm(cells, opts) {
    if (!G) return '';
    const o = opts || {};
    const str = String(cells || '');
    const pb = o.perBeat || 4, bar = o.barCells || pb * 4, comp = !!o.compound;
    const SS = o.ss || 7, k = SS / UNITS;
    const pieces = rhythmPieces(str, pb, bar, comp);
    const nBeats = Math.max(1, Math.ceil(str.length / pb));
    const nBars = Math.ceil(str.length / bar);
    let dense = 0;
    for (let b = 0; b < nBeats; b++) dense = Math.max(dense, pieces.filter(p => !p.bar && p.a >= b * pb && p.a < (b + 1) * pb).length);
    const Wb = Math.max(SS * (comp ? 7.6 : 6.2), dense * SS * 2.1 + SS * 1.2);
    const lineY = SS * 4.6, H = lineY + SS * 2.3;
    const lineW = Math.max(0.9, SS * 0.13);
    const parts = [];

    let x0 = SS * 0.5;
    if (o.top && o.bottom) {
      const ts = timeSigAt(o.top, o.bottom, SS * 0.4, lineY, SS, k);
      parts.push(ts.svg);
      x0 = SS * 0.4 + ts.w + SS * 1.1;
    }
    const pad = SS * 0.9, barGap = SS * 0.6;
    const beatX = beat => x0 + Math.floor(beat * pb / bar) * barGap + beat * Wb;     // where a beat's room starts
    const barEnd = bi => x0 + bi * barGap + ((bi + 1) * bar / pb) * Wb;
    const hw = gw('noteheadBlack', k);
    // where each sits: by its time in the beat, but never nearer than a head and a little to the one before it or the next beat
    const minGap = hw + SS * 0.9;
    const inBeat = new Map();
    pieces.forEach(p => { if (p.bar) return; const b = Math.floor(p.a / pb); if (!inBeat.has(b)) inBeat.set(b, []); inBeat.get(b).push(p); });
    inBeat.forEach((list, b) => {
      const off = list.map(p => (p.a % pb) / pb * Wb);
      for (let i = 1; i < off.length; i++) off[i] = Math.max(off[i], off[i - 1] + minGap);
      for (let i = off.length - 1; i >= 0; i--) off[i] = Math.max(0, Math.min(off[i], (i + 1 < off.length ? off[i + 1] : Wb) - minGap));
      list.forEach((p, i) => { p.x = beatX(b) + pad + off[i]; });
    });
    const W = barEnd(nBars - 1) + SS * 0.3 + lineW + SS * 0.3;

    // the line, and a bar line after each bar
    parts.push('<rect class="rl-line" x="0" y="' + n2(lineY - lineW / 2) + '" width="' + n2(W - SS * 0.3) + '" height="' + n2(lineW) + '"/>');
    for (let bi = 0; bi < nBars; bi++) {
      parts.push('<rect class="rl-bar" x="' + n2(barEnd(bi) + SS * 0.3) + '" y="' + n2(lineY - SS * 2) + '" width="' + n2(lineW * 1.2) + '" height="' + n2(SS * 4) + '"/>');
    }

    const stemW = Math.max(1.2, SS * 0.14);
    const stemTop = lineY - SS * 3.4;
    const dotH = gh('augmentationDot', k);
    const beamH = SS * 0.5;
    // beam groups: a beat's flagged notes, side by side (a rest or a beat line ends one)
    const flagged = p => !p.rest && !p.bar && (SW.values.byId(p.id).base === 'e' || SW.values.byId(p.id).base === 's');
    const groups = [];
    pieces.forEach((p, i) => {
      if (!flagged(p)) return;
      const prev = pieces[i - 1];
      const g = groups[groups.length - 1];
      if (g && prev && g[g.length - 1] === prev && flagged(prev) && Math.floor(prev.a / pb) === Math.floor(p.a / pb)) g.push(p);
      else groups.push([p]);
    });
    const beamed = new Set();
    groups.forEach(g => { if (g.length > 1) g.forEach(p => beamed.add(p)); });

    pieces.forEach((p, i) => {
      const v = SW.values.byId(p.id);
      const x = p.x;
      if (p.rest) {
        const name = restFor(v);
        if (p.bar) {
          const bi = Math.floor(p.a / bar);
          const a0 = beatX(bi * bar / pb), a1 = barEnd(bi);
          parts.push(at(name, (a0 + a1) / 2 - gw(name, k) / 2, lineY, k, 'rest'));
          return;
        }
        parts.push(at(name, x, lineY, k, 'rest'));
        if (v.dotted) parts.push(boxAt('augmentationDot', x + gw(name, k) + SS * 0.35, lineY - SS * 0.5 - dotH / 2, k));
        return;
      }
      const head = headFor(v);
      parts.push(at(head, x, lineY, k, 'head'));
      if (v.dotted) parts.push(boxAt('augmentationDot', x + gw(head, k) + SS * 0.3, lineY - SS * 0.5 - dotH / 2, k));
      if (v.base !== 'w') {
        const sx = x + hw - stemW;
        parts.push('<rect class="stem" x="' + n2(sx) + '" y="' + n2(stemTop) + '" width="' + n2(stemW) + '" height="' + n2(lineY - stemTop) + '"/>');
        const flags = flagsFor(v);
        if (flags && !beamed.has(p)) parts.push(boxAt(flags === 2 ? 'flag16thUp' : 'flag8thUp', sx, stemTop, k, 'flag'));
      }
      if (p.tie && pieces[i + 1]) {
        const x2 = pieces[i + 1].x;
        const sx = x + hw * 0.8, ex = x2 + hw * 0.2, sy = lineY + SS * 0.55, mx = (sx + ex) / 2;
        parts.push('<path class="tie" d="M' + n2(sx) + ' ' + n2(sy) + ' Q' + n2(mx) + ' ' + n2(sy + SS * 1.05) + ' ' + n2(ex) + ' ' + n2(sy) +
          ' Q' + n2(mx) + ' ' + n2(sy + SS * 0.75) + ' ' + n2(sx) + ' ' + n2(sy) + 'Z"/>');
      }
    });
    // the beams: one across the group, a second over its sixteenths (a lone one gets a stub)
    const stemX = p => p.x + hw - stemW;
    groups.forEach(g => {
      if (g.length < 2) return;
      const a = stemX(g[0]), z = stemX(g[g.length - 1]) + stemW;
      parts.push('<rect class="beam" x="' + n2(a) + '" y="' + n2(stemTop) + '" width="' + n2(z - a) + '" height="' + n2(beamH) + '"/>');
      const y2 = stemTop + beamH + SS * 0.28;
      const sixteenth = p => SW.values.byId(p.id).base === 's';
      g.forEach((p, i) => {
        if (!sixteenth(p)) return;
        const next = g[i + 1], prev = g[i - 1];
        if (next && sixteenth(next)) {
          parts.push('<rect class="beam" x="' + n2(stemX(p)) + '" y="' + n2(y2) + '" width="' + n2(stemX(next) + stemW - stemX(p)) + '" height="' + n2(beamH) + '"/>');
        } else if (!(prev && sixteenth(prev))) {
          const stub = SS * 1.1;
          const sx = next ? stemX(p) : stemX(p) + stemW - stub;
          parts.push('<rect class="beam" x="' + n2(sx) + '" y="' + n2(y2) + '" width="' + n2(stub) + '" height="' + n2(beamH) + '"/>');
        }
      });
    });
    return svg(W, H, parts.join(''), 'engraving rhythm-line');
  }

  SW.engrave = { value, staff, rhythm, spellBeats, pitchName, available: !!G };
})();

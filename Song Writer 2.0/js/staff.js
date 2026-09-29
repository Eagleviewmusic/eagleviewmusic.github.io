/* ==========================================================================
   Song Writer — staff.js
   --------------------------------------------------------------------------
   SW.staff   Writes the notes on a treble staff, in the score itself.

   THE IDEA
   A block is a note whose length has not been decided. Once it has one
   (a value — see score.js "BLOCKS AND NOTES"), the block is written: its
   bar fades and a notehead takes its place on a five-line staff that runs
   behind the whole line. The other columns of the line stay as blocks,
   standing on the staff, until they are written too. A line with nothing
   written on it has no staff at all, so an untouched song looks exactly
   as it did in 1.0.

   WHERE THE NOTEHEAD GOES — the alignment that makes the transition read
   1.0's bar heights are ten pixels a scale step (do 60, re 70, mi 80 …).
   A staff whose space is TWENTY pixels puts its line-to-space steps ten
   pixels apart too, so a staff can be placed on the line such that a
   notehead sits exactly where the top edge of its block was. The bars
   are keyed to solfège, the staff to letters, so the staff shifts with
   the key (in C the bottom line is 80 px above the bar base; in G, 40):
   `yOf()` below is that placement, and it is the whole trick. Everything
   scales with the View popover's block size through --bs.

   WHERE THE NOTES GO ACROSS — engraved spacing (since 2026-09-25)
   Vertically the browser still decides (the blocks' heights), but across
   a written line this file is the engraver: `planLine()` works out where
   every notehead goes, the way printed music is spaced, and hands the
   answer to the layout as CSS variables (see "REALISING A PLAN").
     • A note's space grows with its length — a quarter gets 3½ staff
       spaces from head to head, and each doubling of length ×√2 more
       (an eighth ≈ 2½, a half ≈ 5, a whole 7). Blocks count as quarters.
     • Nothing collides: an accidental, a dot, a flag or a second's
       displaced head widens the column that carries it.
     • Words never touch: each lyric is centred under its note (a word
       on several blocks under its blocks) and pushes the notes apart
       when it needs more room than the rhythm gives; a chord symbol in
       the lane likewise.
     • Bar lines get room of their own — a bar's last note keeps most of
       its space before the line, and a fixed gap follows it — and words
       stay inside their bars.
     • Rows are packed a whole bar at a time (a row only ever breaks on a
       bar line; a bar too wide for any row breaks between its words),
       then JUSTIFIED: every row but a line's last is stretched to the full
       width, spreading the extra room by length as an engraver does; the
       last row stretches too, but no more than half again its natural
       spacing, so a short phrase stays a short phrase.

   REALISING A PLAN. No syllable is ever moved or rebuilt (the 1.0 editing
   code, and a word being typed, stay untouched): the plan only sets
   custom properties that the has-staff CSS reads — each syllable's width
   and left margin (syllables tile a row edge to edge), where its columns
   start, the room after each column, where its word and chord are
   centred — and puts zero-height .row-break siblings where rows end.

   HOW HIGH THE WORDS SIT. A block stands on the bar base, so a row with a
   block keeps its words under the blocks' feet. A row of notes only has
   nothing there but clear bars, so its words come up to just under the
   row's lowest ink (`inkFloor`, the beam's own line, the clef's tail) —
   close under the staff for most tunes, lower for a low note. Each visual
   row gets its own (--sx-drop).

   HOW IT IS DRAWN — the notation README's method (§5): let the browser
   lay the blocks out, measure where each column landed, engrave onto the
   measured centres. One <svg> per line, absolutely positioned behind the
   syllables; each visual row of a wrapped line gets its own staff, clef
   and key signature, and the first row of the first line the time
   signature. Bar lines and beams are computed by js/timing.js and drawn
   only within runs of written notes.

   ENGRAVING, in staff spaces (S = 20 × --bs px), Leland's defaults where
   it has one: stems 3½ S from the notehead, reaching the middle line;
   stems of flagged notes a little longer so a down flag clears its head;
   stems and beams a little heavier than print (0.16 S and 0.6 S — asked
   for, so they read from the back of a room), beams ¼ S apart, SLANTED with the melody (a second ¼ S up to
   1 S, level for a repeated note or a dip or peak in the middle), the
   shortest stem at least 3¼ S, beam ends on quarter spaces; accidentals
   are Leland glyphs, carried through the bar as in print (a sharpened F
   stays sharp to the bar line; the next plain F gets a natural), stacked
   in columns in a chord; seconds put a head on the other side of the stem;
   dots sit in a space. Noteheads keep their block's colour (the colour is
   the pitch, as it is on the keyboard dock) inside an ink outline; stems,
   beams, rests and the staff are ink.

   API
     SW.staff.render()     plan and redraw every line (cheap; called on
                           every change, selection, view or size change)
     SW.staff.geometry(base, bs) — the y of a step, for tests
     SW.staff.plan(lineEl) the last plan for a line, for tests
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const G = (typeof GLYPHS_LELAND !== 'undefined') ? GLYPHS_LELAND : null;
  const UNITS = 360;
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const score = document.getElementById('score');

  const STEP = 10;                       // px per scale step at --bs 1 (1.0's bar heights)
  const SS_PX = STEP * 2;                // one staff space

  /* ---- engraving, in staff spaces ---- */
  const E = {
    staffLine: 0.11, stemW: 0.16, ledger: 0.16, ledgerExt: 0.35,
    thinBar: 0.16, thickBar: 0.5, barSep: 0.4,
    beam: 0.6, beamGap: 0.25,
    stem: 3.5, stemBeamed: 3.25, stemAttach: 0.168,
    outline: 0.055,                     // the ink ring round every notehead
    accGap: 0.2, accColGap: 0.12,       // accidental → head, and between stacked columns
    dotGap: 0.3
  };
  /* ---- spacing, in staff spaces ---- */
  const SP = {
    quarter: 3.5,      // head to head, a quarter note
    min: 1.9,          // the least space a note is given (a sixteenth)
    inkGap: 0.45,      // the least white between two columns' ink
    sylGap: 0.2,       // between the blocks of two words
    lead: 0.45,        // after the clef and signatures, before the first ink
    barBefore: 1.0,    // the least white from a note to the bar line after it
    barTrim: 0.6,      // a bar's last note gives this much of its space to the bar line
    barAfter: 1.2,     // bar line to the next note's ink
    barText: 0.3,      // a word stays this far inside its bar
    fMin: 0.75,        // the tightest a row may be squeezed …
    fPack: 0.85,       // … the squeeze allowed when deciding what fits …
    fLast: 1.5,        // … how far a line's last row may stretch …
    fInner: 4          // … and any other row (they always fill the width)
  };

  const INK = '#2B1D38';
  const GOLD = '#FFD700';
  const ACC_GLYPH = { '-2': 'accidentalDoubleFlat', '-1': 'accidentalFlat', '0': 'accidentalNatural', '1': 'accidentalSharp', '2': 'accidentalDoubleSharp' };

  const n2 = v => Number(Number(v).toFixed(2));
  const step = (letter, octave) => LETTERS.indexOf(letter) + 7 * octave;
  const E4 = step('E', 4), B4 = step('B', 4), D5 = step('D', 5), F5 = step('F', 5);

  /* ---- glyph helpers (as engrave.js) ---- */
  function at(name, x, y, k, extra, vScale) {
    const g = G && G[name];
    if (!g) return '';
    const sy = vScale === undefined ? k : k * vScale;
    return '<path ' + (extra || 'fill="' + INK + '"') + ' transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + n2(k * 1e5) / 1e5 + ' ' + n2(sy * 1e5) / 1e5 + ')" d="' + g.d + '"/>';
  }
  function boxAt(name, x, y, k, extra) {
    const g = G && G[name];
    if (!g) return '';
    return '<path ' + (extra || 'fill="' + INK + '"') + ' transform="translate(' + n2(x) + ' ' + n2(y) + ') scale(' + n2(k * 1e5) / 1e5 + ') translate(' + n2(-g.x0) + ' ' + n2(-g.y0) + ')" d="' + g.d + '"/>';
  }
  const gw = (name, k) => (G && G[name] ? G[name].w * k : 0);
  const gh = (name, k) => (G && G[name] ? G[name].h * k : 0);
  const gx0 = (name, k) => (G && G[name] ? G[name].x0 * k : 0);
  const gb = (name, k) => (G && G[name] ? (G[name].y0 + G[name].h) * k : 0);   // how far a glyph hangs below its origin
  const headFor = v => v.base === 'w' ? 'noteheadWhole' : v.base === 'h' ? 'noteheadHalf' : 'noteheadBlack';
  const restFor = v => ({ w: 'restWhole', h: 'restHalf', q: 'restQuarter', e: 'rest8th', s: 'rest16th' })[v.base];
  const flagsFor = v => v.base === 'e' ? 1 : v.base === 's' ? 2 : 0;
  const rect = (x, y, w, h, fill, extra) => '<rect x="' + n2(x) + '" y="' + n2(y) + '" width="' + n2(w) + '" height="' + n2(h) + '" fill="' + (fill || INK) + '"' + (extra || '') + '/>';
  const text = (x, y, size, str, extra) => '<text x="' + n2(x) + '" y="' + n2(y) + '" font-size="' + n2(size) + '" ' + (extra || '') + '>' + str + '</text>';
  const poly = pts => '<polygon fill="' + INK + '" points="' + pts.map(p => n2(p[0]) + ',' + n2(p[1])).join(' ') + '"/>';

  function blockScale() {
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bs'));
    return isFinite(v) && v > 0 ? v : 1;
  }

  /* The key signature: the alteration each letter carries in this key,
     read from 1.0's spelling table. A key spelled with a double sharp
     (D♯ major's F𝄪) has no standard signature; then nothing is written
     at the clef and every note carries its own accidental. */
  function keySignature(key) {
    const names = M.letterNamesByKey[key] || M.letterNamesByKey.C;
    const sig = {};
    let ok = true, sharps = 0, flats = 0;
    Object.keys(names).forEach(sol => {
      const n = names[sol];
      let alter = 0;
      for (const ch of n.slice(1)) alter += ch === '#' ? 1 : -1;
      if (Math.abs(alter) > 1) ok = false;
      if (alter > 0) sharps++; else if (alter < 0) flats++;
      sig[n.charAt(0)] = alter;
    });
    if (!ok || (sharps && flats)) return { sig: {}, order: [], kind: 0 };
    const ORDER_SHARP = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
    const ORDER_FLAT = ['B', 'E', 'A', 'D', 'G', 'C', 'F'];
    const order = (sharps ? ORDER_SHARP : ORDER_FLAT).filter(l => sig[l]);
    return { sig, order, kind: sharps ? 1 : flats ? -1 : 0 };
  }
  // treble-clef positions of the signature accidentals, as steps
  const SIG_POS = {
    1: { F: step('F', 5), C: step('C', 5), G: step('G', 5), D: step('D', 5), A: step('A', 4), E: step('E', 5), B: step('B', 4) },
    '-1': { B: step('B', 4), E: step('E', 5), A: step('A', 4), D: step('D', 5), G: step('G', 4), C: step('C', 5), F: step('F', 4) }
  };

  /* ---- offsets inside the line, ignoring transforms (the highlighted
     syllable is scaled, and the SVG is not) ---- */
  function offsetIn(el, ancestor) {
    let x = 0, y = 0, e = el;
    while (e && e !== ancestor) {
      x += e.offsetLeft;
      y += e.offsetTop;
      e = e.offsetParent;
    }
    return { x, y };
  }

  /* The vertical placement: `yOf(step)` for a row whose bar base is at
     `base` px from the line's top. do's notehead sits at do's bar top. */
  function geometry(base, bs) {
    const doSp = M.spellNote('do', 'natural', S.key);
    const doStep = step(doSp.letter, doSp.octave);
    const s = SS_PX * bs;
    const doY = base - M.NOTE_HEIGHTS.do * bs;
    return { S: s, k: s / UNITS, yOf: st => doY - (st - doStep) * (s / 2), doStep, base };
  }

  /* How far above the bar base the row must reach to hold the staff: the
     top line plus room for a name over a down-stemmed note. Set on the
     line as --staff-top; the CSS makes every column at least that tall,
     so a wrapped row never lets its staff run up into the row above. */
  function staffTop(bs) {
    const doSp = M.spellNote('do', 'natural', S.key);
    const doStep = step(doSp.letter, doSp.octave);
    return (M.NOTE_HEIGHTS.do + (F5 - doStep) * STEP + 14) * bs;
  }

  /* The clef, key signature and (on the song's first row) time
     signature: where each piece goes from the staff's left edge, and the
     width the line keeps for them (--staff-prefix). One function, so the
     room kept and the room drawn in can never disagree. */
  function prefix(s, withTime) {
    const k = s / UNITS;
    const ks = keySignature(S.key);
    let x = s * 0.5;
    const clefX = x;
    x += gw('gClef', k) + s * 0.55;
    const sig = ks.order.map(l => {
      const name = ACC_GLYPH[String(ks.sig[l])];
      const at_ = { letter: l, name, x, st: SIG_POS[String(ks.kind)][l] };
      x += gw(name, k) + s * 0.1;
      return at_;
    });
    if (sig.length) x += s * 0.35;
    let time = null;
    if (withTime) {
      const mt = SW.meters.byId(S.meter);
      const top = 'timeSig' + mt.top, bot = 'timeSig' + mt.bottom;
      const tw = Math.max(gw(top, k), gw(bot, k));
      x += s * 0.25;
      time = { x, top, bot, w: tw };
      x += tw + s * 0.25;
    }
    return { clefX, sig, time, width: x + s * 0.5 };
  }

  /* ==================================================================
     THE COLUMN'S INK — everything about a written column that decides
     how much room it needs: stem direction, which heads sit on the other
     side of the stem, which carry accidentals (and in which column),
     dots, flags. Extents are measured from the notehead's centre.
     ================================================================== */
  function stemDir(pitches) {
    const lo = pitches[0].step, hi = pitches[pitches.length - 1].step;
    return (B4 - lo) > (hi - B4) ? 'up' : 'down';
  }
  /* A beamed group: the note farthest from the middle line decides; if
     two are as far, the majority; if that ties too, down. */
  function groupDir(grp) {
    let lo = Infinity, hi = -Infinity, above = 0, below = 0;
    grp.forEach(ev => {
      lo = Math.min(lo, ev.pitches[0].step);
      hi = Math.max(hi, ev.pitches[ev.pitches.length - 1].step);
      ev.pitches.forEach(p => { if (p.step > B4) above++; else if (p.step < B4) below++; });
    });
    if (B4 - lo !== hi - B4) return (B4 - lo) > (hi - B4) ? 'up' : 'down';
    return below > above ? 'up' : 'down';
  }

  function columnInk(ev, s, k) {
    const v = ev.value;
    const bwHalf = ev.bw / 2;
    if (!ev.notated) return { L: bwHalf, R: bwHalf };
    if (ev.rest) {
      const name = restFor(v);
      const w = gw(name, k);
      let R = w / 2;
      if (v.dotted) R += s * E.dotGap + gw('augmentationDot', k);
      return { L: w / 2, R, restW: w };
    }
    const head = headFor(v);
    const hw = gw(head, k);
    const stemW = Math.max(1.2, s * E.stemW);
    const dir = v.base === 'w' ? 'up' : (ev.groupDir || stemDir(ev.pitches));
    const beamed = ev.beam !== null && ev.beam !== undefined;

    // seconds: a head a step from an undisplaced one goes to the other side
    const shift = hw - stemW;
    const heads = ev.pitches.map(pt => ({ pt, dx: 0 }));
    const order = dir === 'up' ? heads : heads.slice().reverse();
    let prev = null;
    order.forEach(h => {
      if (prev && Math.abs(h.pt.step - prev.pt.step) === 1 && prev.dx === 0) h.dx = dir === 'up' ? shift : -shift;
      prev = h;
    });
    const leftMost = Math.min(0, ...heads.map(h => h.dx));
    const rightMost = Math.max(0, ...heads.map(h => h.dx));
    let L = hw / 2 - leftMost, R = hw / 2 + rightMost;

    // accidentals (ev.accs was decided by the bar's reading), stacked in
    // columns from the heads outwards: two may share a column a seventh apart
    const accs = heads.filter(h => ev.accSet && ev.accSet.has(h.pt)).map(h => ({ h, st: h.pt.step, name: ACC_GLYPH[String(h.pt.alter)] }));
    accs.sort((a, b) => b.st - a.st);
    const cols = [];
    accs.forEach(a => {
      let c = cols.find(col => col.every(m => Math.abs(m.st - a.st) >= 6));
      if (!c) { c = []; cols.push(c); }
      c.push(a);
    });
    let edge = -hw / 2 + leftMost - s * E.accGap;       // right edge of the next column
    cols.forEach(c => {
      const w = Math.max(...c.map(a => gw(a.name, k)));
      c.forEach(a => { a.x = edge - gw(a.name, k); });   // each glyph's left, right-aligned in its column
      edge -= w + s * E.accColGap;
    });
    if (cols.length) L = -(edge + s * E.accColGap);

    // stem and flag
    const flags = beamed ? 0 : flagsFor(v);
    const stemX = v.base === 'w' ? null : dir === 'up' ? hw / 2 - stemW : -hw / 2;
    if (flags && dir === 'up') {
      const fname = flags === 2 ? 'flag16thUp' : 'flag8thUp';
      R = Math.max(R, stemX + gw(fname, k));
    }

    // dots: in the space (a note on a line puts its dot in the space above),
    // clear of an up-flag's tip
    let dotX = null;
    const dots = [];
    if (v.dotted) {
      dotX = hw / 2 + rightMost + s * E.dotGap;
      if (flags && dir === 'up') dotX = Math.max(dotX, stemX + s * 0.98);
      const seen = new Set();
      heads.forEach(h => {
        const onLine = (h.pt.step - E4) % 2 === 0;
        const st = onLine ? h.pt.step + 1 : h.pt.step;
        if (seen.has(st)) return;
        seen.add(st);
        dots.push(st);
      });
      R = Math.max(R, dotX + gw('augmentationDot', k));
    }
    return { L: Math.max(L, 0), R, dir, heads, accs, hw, stemW, stemX, flags, dotX, dots, head };
  }

  /* Which heads carry an accidental: as in print, an accidental holds to
     the bar line, so the second F♯ in a bar needs none and a plain F after
     it needs a natural. Blocks are not on the staff and do not count. */
  function readAccidentals(events, ks) {
    let bar = -1, held = {};
    events.forEach(ev => {
      ev.accSet = new Set();
      if (!ev.notated || ev.rest) return;
      if (ev.bar !== bar) { bar = ev.bar; held = {}; }
      ev.pitches.forEach(pt => {
        const key = pt.letter + pt.octave;
        const now = held[key] !== undefined ? held[key] : (ks.sig[pt.letter] || 0);
        if (pt.alter !== now) ev.accSet.add(pt);
        held[key] = pt.alter;
      });
    });
  }

  /* How far a written column's ink reaches above the bar base (its stem,
     the beam's likely slant, ledger notes, names). */
  function inkTop(ev, g, s) {
    const { yOf } = g;
    if (ev.rest) return yOf(D5) - s * 0.5;
    const hi = ev.pitches[ev.pitches.length - 1].step;
    let top = yOf(hi) - s * 0.6;
    const beamed = ev.beam !== null && ev.beam !== undefined;
    if (ev.value.base !== 'w' && ev.dir === 'up') top = Math.min(top, Math.min(yOf(hi) - s * (E.stem + 0.25), yOf(B4)) - (beamed ? s : 0));
    if (S.showNames && (ev.dir === 'down' || ev.value.base === 'w')) top = Math.min(top, Math.min(yOf(hi), yOf(F5 + 1)) - s * 2.4);
    return top;
  }

  /* The lowest ink of a written column, from the bar base (y grows down,
     so a column above the base gives a negative number): its lowest head,
     a sharp or natural hanging under a head, a rest, a down stem and its
     flag, a name under an up stem. A beamed stem ends on its beam, which
     the row measures itself (beamLine). The words go just under this. */
  function inkFloor(ev, g, s, k) {
    const { yOf } = g;
    if (ev.rest) {
      const name = restFor(ev.value);
      return (name === 'restWhole' ? yOf(D5) : yOf(B4)) + gb(name, k);
    }
    const v = ev.value;
    const lo = ev.pitches[0].step;
    let bottom = yOf(lo) + gb(ev.head, k) + s * E.outline;
    (ev.accs || []).forEach(a => { bottom = Math.max(bottom, yOf(a.st) + gb(a.name, k)); });
    const beamed = ev.beam !== null && ev.beam !== undefined;
    if (v.base !== 'w' && ev.dir === 'down' && !beamed) {
      const flags = flagsFor(v);
      const to = Math.max(yOf(lo) + s * (E.stem + flags * 0.25), yOf(B4));
      bottom = Math.max(bottom, to + (flags ? gb(flags === 2 ? 'flag16thDown' : 'flag8thDown', k) : 0));
    }
    if (S.showNames && ev.dir === 'up' && v.base !== 'w') bottom = Math.max(bottom, yOf(lo) + s * 2.35);
    return bottom;
  }

  /* A TIE (timing.js TIES): which side its arc bows to — away from the
     stem (+1 below, −1 above); a whole note by where it sits; in a chord
     the top note's goes up and the rest down — and how far, for the
     distance between the two heads. The planner (to keep the words clear)
     and the drawing both ask. */
  function tieSide(tied, pt, dir, value) {
    if (tied.length > 1) return pt === tied[tied.length - 1] ? -1 : 1;
    if (value.base === 'w') return pt.step >= B4 ? -1 : 1;
    return dir === 'down' ? -1 : 1;
  }
  const tieBow = (dist, s) => Math.max(s * 0.35, Math.min(s * 0.9, dist * 0.12));
  const TIE_OFF = 0.62;                  // from the head's centre to the tie's end, in S

  /* A note's space, head to head, before justification: 3½ S for a
     quarter, ×√2 for each doubling. */
  function idealSpace(ticks, s) {
    return s * Math.max(SP.min, SP.quarter * Math.sqrt(ticks / SW.values.TICKS_PER_QUARTER));
  }

  /* ==================================================================
     PLACING A ROW — where each notehead goes, from the row's left edge
     (the line's content box, after the clef and signatures), for a
     spacing factor f (1 = natural; the justifier searches f). Returns the
     heads' x, the bar lines, and where the row ends.
     ================================================================== */
  function placeRow(cols, f, ctx) {
    const s = ctx.s;
    const x = [];
    const bars = [];                     // { after: i, x }
    let textR = -Infinity, chordR = -Infinity;
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i];
      let xi, barX = null;
      if (i === 0) {
        xi = s * SP.lead + Math.max(c.L, c.bw / 2);
      } else {
        const p = cols[i - 1];
        if (p.notated && c.notated && c.bar > p.bar) {
          barX = x[i - 1] + Math.max(p.R + s * SP.barBefore, f * p.ideal - s * SP.barTrim, p.bw / 2 + 2);
          barX = Math.max(barX, textR + s * SP.barText, chordR + 2);
          bars.push({ after: i - 1, x: barX });
          xi = barX + Math.max(s * SP.barAfter + c.L, c.bw / 2 + 2);
        } else {
          const sameWord = !c.sylStart;
          const gap = (!p.notated && !c.notated) ? (sameWord ? 0 : s * SP.sylGap) : s * SP.inkGap;
          xi = x[i - 1] + Math.max(f * p.ideal, p.R + c.L + gap, (p.bw + c.bw) / 2 + (sameWord ? 0 : 2));
        }
      }
      if (c.sylStart) {
        // the word: centred under its anchor, clear of the last word and of a bar line
        const half = c.textW / 2 - c.anchorOff;
        xi = Math.max(xi, textR + ctx.lyricGap + half);
        if (barX !== null) xi = Math.max(xi, barX + s * SP.barText + half);
        if (i === 0) xi = Math.max(xi, half - ctx.textAllowance);
        if (c.chordW) {
          xi = Math.max(xi, chordR + 6 + c.chordOff);
          if (barX !== null) xi = Math.max(xi, barX + 4 + c.chordOff);
          chordR = xi - c.chordOff + c.chordW;
        }
        textR = xi + c.anchorOff + c.textW / 2;
      }
      x.push(xi);
    }
    // the row's end: a bar line after a written bar, or just past the last ink
    const n = cols.length;
    const last = cols[n - 1];
    let end, endBar = false;
    if (last.notated && last.endsBar) {
      end = x[n - 1] + Math.max(last.R + s * SP.barBefore, f * last.ideal - s * SP.barTrim, last.bw / 2 + 2);
      end = Math.max(end, textR + s * SP.barText, chordR + 2);
      endBar = true;
      if (last.final) end += s * (E.barSep + E.thickBar);
    } else {
      end = Math.max(x[n - 1] + Math.max(last.R, last.bw / 2) + s * 0.5, textR + 2, chordR + 2);
    }
    return { x, bars, end, endBar };
  }

  /* Justify: the spacing factor that makes the row end at `target`,
     no tighter than fMin and no looser than fMax. */
  function fitRow(cols, ctx, fMax) {
    const target = ctx.avail - 1;
    const hiP = placeRow(cols, fMax, ctx);
    if (hiP.end <= target) return { f: fMax, p: hiP };
    let lo = SP.fMin, hi = fMax;
    let loP = placeRow(cols, lo, ctx);
    if (loP.end >= target) return { f: lo, p: loP };
    for (let it = 0; it < 22; it++) {
      const mid = (lo + hi) / 2;
      const mp = placeRow(cols, mid, ctx);
      if (mp.end <= target) { lo = mid; loP = mp; } else hi = mid;
    }
    return { f: lo, p: loP };
  }

  /* ==================================================================
     PLANNING A LINE — measure, space, pack, justify. Reads only.
     ================================================================== */
  function planLine(line, lineIndex, lastLine, bs) {
    const s = SS_PX * bs, k = s / UNITS;
    const le = SW.timing.lineEvents(line);
    const ks = keySignature(S.key);
    const cs = getComputedStyle(line);
    const avail = line.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    const pre = prefix(s, lineIndex === 0);
    const firstText = line.querySelector('.text');
    const lyricPx = firstText ? parseFloat(getComputedStyle(firstText).fontSize) || 22 : 22;
    const gRel = geometry(0, bs);            // y from the bar base (negative: above it)
    const staffTopPx = staffTop(bs);
    const ctx = { s, avail, lyricGap: Math.max(8, lyricPx * 0.5), textAllowance: Math.max(0, pre.width - s * 1.2) };

    // beam groups decide their direction together
    const groups = {};
    le.events.forEach(ev => {
      ev.bw = ev.stack.offsetWidth;
      if (ev.notated && !ev.rest && ev.beam !== null) (groups[ev.beam] = groups[ev.beam] || []).push(ev);
    });
    Object.keys(groups).forEach(id => { const d = groupDir(groups[id]); groups[id].forEach(ev => { ev.groupDir = d; }); });
    readAccidentals(le.events, ks);

    // the syllables, and each column's ink and space
    const syls = Array.from(line.querySelectorAll(':scope > .syllable'));
    const bySyl = new Map(syls.map(syl => [syl, []]));
    le.events.forEach(ev => { if (bySyl.has(ev.syllable)) bySyl.get(ev.syllable).push(ev); });
    const cols = [];
    const sylInfo = [];
    syls.forEach((syl, si) => {
      const evs = bySyl.get(syl);
      if (!evs.length) return;
      const tEl = syl.querySelector('.text-input') || syl.querySelector('.text');
      const chordEl = syl.querySelector('.chord-slot .chord-sym');
      const allBlocks = evs.every(ev => !ev.notated);
      let span = 0;
      for (let j = 1; j < evs.length; j++) span += (evs[j - 1].bw + evs[j].bw) / 2;
      const info = { syl, si, evs, allBlocks, textW: tEl ? tEl.offsetWidth : 0, chordW: chordEl ? chordEl.offsetWidth : 0 };
      sylInfo.push(info);
      evs.forEach((ev, j) => {
        Object.assign(ev, columnInk(ev, s, k));
        ev.sylStart = j === 0;
        ev.sylEnd = j === evs.length - 1;
        ev.syl = info;
        ev.ideal = ev.notated ? idealSpace(ev.ticks, s)
          : (ev.sylEnd ? idealSpace(SW.values.TICKS_PER_QUARTER, s) : 0);
        if (j === 0) {
          ev.textW = info.textW;
          ev.anchorOff = allBlocks ? span / 2 : 0;
          ev.chordW = info.chordW;
          const headLeft = ev.notated && !ev.rest ? ev.hw / 2 : ev.bw / 2;
          ev.chordOff = headLeft + 7;      // chord symbol's box starts 7 px before the head (its padding)
        }
        cols.push(ev);
      });
    });
    cols.forEach((ev, i) => {
      const nx = cols[i + 1];
      // a line ends on a bar line — unless, with a pick-up, it stops inside
      // a bar the next line's pick-up finishes (the song's end always has one)
      ev.endsBar = nx ? nx.bar > ev.bar : (le.endsOnBar || !le.opensNext || lastLine);
      ev.final = !nx && lastLine;
    });

    // pack. A unit is a bar — the syllables that start in it stay together
    // — or, for a bar too wide for any row, each of its words.
    const colsOf = infos => infos.reduce((a, info) => a.concat(info.evs), []);
    const target = ctx.avail - 1;
    const endAt = (infos, f) => placeRow(colsOf(infos), f, ctx).end;
    let units = [];
    let cur = null, curBar = null;
    sylInfo.forEach(info => {
      const bar = info.evs[0].bar;
      if (!cur || bar !== curBar) { cur = []; units.push(cur); curBar = bar; }
      cur.push(info);
    });
    // (words joined by a beam stay together: a beam never breaks across rows)
    const byWords = u => u.reduce((a, info) => {
      const prev = a.length ? a[a.length - 1] : null;
      const tail = prev && prev[prev.length - 1].evs[prev[prev.length - 1].evs.length - 1];
      if (tail && tail.beam !== null && tail.beam === info.evs[0].beam) prev.push(info);
      else a.push([info]);
      return a;
    }, []);
    units = units.reduce((a, u) => a.concat(u.length > 1 && endAt(u, SP.fMin) > target ? byWords(u) : [u]), []);

    // the fewest rows (greedy, a little squeeze allowed) …
    const n = units.length;
    const span = (i, j) => units.slice(i, j).reduce((a, u) => a.concat(u), []);
    const fitsSpan = (i, j) => j - i === 1 || endAt(span(i, j), SP.fPack) <= target;
    let count = 0;
    for (let i = 0; i < n; count++) {
      let j = i + 1;
      while (j < n && fitsSpan(i, j + 1)) j++;
      i = j;
    }
    // … then, among the ways to fill that many rows, the most even — no
    // lone bar left on a row of its own after full ones
    const natural = new Map();
    const cost = (i, j) => {
      const key = i + ':' + j;
      if (!natural.has(key)) natural.set(key, endAt(span(i, j), 1));
      const d = (target - natural.get(key)) / target;
      return d >= 0 ? d * d : 2 * d * d;
    };
    const best = [[0].concat(new Array(n).fill(Infinity))];
    const from = [[]];
    for (let r = 1; r <= count; r++) {
      best[r] = new Array(n + 1).fill(Infinity);
      from[r] = new Array(n + 1).fill(-1);
      for (let j = 1; j <= n; j++) {
        for (let i = r - 1; i < j; i++) {
          if (best[r - 1][i] === Infinity || !fitsSpan(i, j)) continue;
          const c = best[r - 1][i] + cost(i, j);
          if (c < best[r][j]) { best[r][j] = c; from[r][j] = i; }
        }
      }
    }
    const rows = [];                      // arrays of syllable infos
    if (count && best[count][n] < Infinity) {
      for (let r = count, j = n; r > 0; r--) {
        const i = from[r][j];
        rows.unshift(span(i, j));
        j = i;
      }
    } else if (n) rows.push(span(0, n));
    // a wrapped line fills every row; a line's last row may stay short
    // (only half again its natural spacing) when it holds little
    const lastFull = rows.length > 1 && endAt(rows[rows.length - 1], 1) >= target * 0.6;

    // justify each row, then turn the heads' x into the layout's numbers
    const info = new Map();                // stack → what the drawing needs
    const vars = [];                       // [el, name, value]
    const breaks = [];                     // syllables that start a row (after the first)
    rows.forEach((infos, ri) => {
      const rc = colsOf(infos);
      const { f, p } = fitRow(rc, ctx, ri === rows.length - 1 && !lastFull ? SP.fLast : SP.fInner);
      if (ri > 0) breaks.push(infos[0].syl);
      // each column: bar lines and the row's end, as offsets from its head
      rc.forEach((ev, i) => {
        info.set(ev.stack, {
          dir: ev.dir, heads: ev.heads, accs: ev.accs, hw: ev.hw, stemW: ev.stemW, dotX: ev.dotX, dots: ev.dots,
          restW: ev.restW, f, x: p.x[i], L: ev.L, R: ev.R
        });
      });
      p.bars.forEach(b => {
        info.get(rc[b.after].stack).barDx = b.x - p.x[b.after];
        info.get(rc[b.after + 1].stack).barBeforeDx = b.x - p.x[b.after + 1];
      });
      const lastI = info.get(rc[rc.length - 1].stack);
      lastI.endDx = p.end - p.x[rc.length - 1];
      lastI.endBar = p.endBar;
      lastI.final = p.endBar && rc[rc.length - 1].final;

      // syllable boxes tile the row: each boundary halfway between two
      // words' outermost ink, words or chords, but never inside a column
      const ext = infos.map(si => {
        const evs = si.evs;
        const a = rc.indexOf(evs[0]);
        const xs = evs.map((ev, j) => p.x[a + j]);
        const colL = xs[0] - evs[0].bw / 2, colR = xs[xs.length - 1] + evs[evs.length - 1].bw / 2;
        let l = colL, r = colR;
        evs.forEach((ev, j) => { l = Math.min(l, xs[j] - ev.L); r = Math.max(r, xs[j] + ev.R); });
        const anchor = si.allBlocks ? (xs[0] + xs[xs.length - 1]) / 2 : xs[0];
        l = Math.min(l, anchor - si.textW / 2); r = Math.max(r, anchor + si.textW / 2);
        let chordL = null;
        if (si.chordW) {
          chordL = xs[0] - evs[0].chordOff;
          l = Math.min(l, chordL); r = Math.max(r, chordL + si.chordW);
        }
        const bar = p.bars.find(bb => bb.after === a - 1);
        return { si, xs, colL, colR, l, r, anchor, chordL, barX: bar ? bar.x : null };
      });
      // … and a word that opens a bar starts at the bar line
      const B = ext.map((e, i) => {
        if (i === 0) return Math.min(e.colL, e.l - 2);
        const prev = ext[i - 1];
        const at_ = e.barX !== null ? e.barX : (prev.r + e.l) / 2;
        return Math.min(Math.max(at_, prev.colR), e.colL);
      });
      // room above the row: stems, beams, ledger notes and names must not
      // reach the row above. Every syllable of the row gets the same, so
      // the bars still share a base.
      let top = 0, blockTop = 0;
      rc.forEach(ev => {
        blockTop = Math.max(blockTop, ev.stack.offsetHeight);
        if (!ev.notated) return;
        top = Math.min(top, inkTop(ev, gRel, s));
      });
      const rise = Math.max(0, -top - (Math.max(staffTopPx, blockTop) + 20 * bs));
      // … and the words fit under the row's lowest ink: a block stands on
      // the bar base, so while a row has one the words stay under the
      // blocks' feet; a row of notes only lets them come up under the staff
      // (its bottom line, the lowest head, stem, beam, sharp or name), and a
      // low note takes them down again. The CSS keeps 8·bs under the base,
      // so --sx-drop is the difference, lifting (−) or lowering (+) them.
      let floor = gRel.yOf(E4) + Math.max(1, s * E.staffLine) / 2;
      let blocks = false;
      rc.forEach(ev => {
        if (ev.notated) floor = Math.max(floor, inkFloor(ev, gRel, s, k));
        else blocks = true;
      });
      const downBeams = {};
      rc.forEach((ev, i) => {
        if (ev.notated && !ev.rest && ev.beam !== null && ev.dir === 'down') (downBeams[ev.beam] = downBeams[ev.beam] || []).push(i);
      });
      // a tie under a low note bows down towards the words
      rc.forEach((ev, i) => {
        if (!ev.tieNext || !rc[i + 1]) return;
        const bow = tieBow(p.x[i + 1] - p.x[i], s);
        ev.tiePitches.forEach(pt => {
          if (tieSide(ev.tiePitches, pt, ev.dir, ev.value) > 0) floor = Math.max(floor, gRel.yOf(pt.step) + s * (TIE_OFF + 0.05) + bow);
        });
      });
      Object.keys(downBeams).forEach(id => {
        const idx = downBeams[id];
        if (idx.length < 2) return;
        const stemL = i => p.x[i] - rc[i].hw / 2;               // a down stem's left edge
        const edge = beamLine(idx.map(i => rc[i]), false, idx.map(i => stemL(i) + rc[i].stemW / 2), gRel.yOf, s);
        const first = idx[0], last = idx[idx.length - 1];
        floor = Math.max(floor, edge(stemL(first)), edge(stemL(last) + rc[last].stemW));
      });
      // a long first word may reach back under the clef and key signature
      const wordL = ext[0].anchor - infos[0].textW / 2;
      const clefL = pre.clefX - pre.width;                     // in the row's frame, where x = 0 is after the prefix
      if (wordL < clefL + gw('gClef', k) + s * 0.3) floor = Math.max(floor, gRel.yOf(step('G', 4)) + gb('gClef', k));
      pre.sig.forEach(a => {
        if (wordL < a.x - pre.width + gw(a.name, k) + s * 0.3) floor = Math.max(floor, gRel.yOf(a.st) + gb(a.name, k));
      });
      let words = floor + Math.max(6, 8 * bs);
      if (blocks) words = Math.max(words, 8 * bs);
      const drop = Math.round(words - 8 * bs);
      const endB = Math.min(Math.max(ext[ext.length - 1].r + 2, ext[ext.length - 1].colR), Math.max(p.end, ext[ext.length - 1].colR));
      ext.forEach((e, i) => {
        const left = B[i], right = i + 1 < B.length ? B[i + 1] : endB;
        const el = e.si.syl;
        vars.push([el, '--sx-w', n2(right - left) + 'px']);
        vars.push([el, '--sx-ml', n2(i === 0 ? left : 0) + 'px']);
        vars.push([el, '--sx-nl', n2(e.colL - left) + 'px']);
        vars.push([el, '--sx-ta', n2(e.anchor - left) + 'px']);
        if (e.chordL !== null) vars.push([el, '--sx-ca', n2(e.chordL - left) + 'px']);
        else vars.push([el, '--sx-ca', null]);
        vars.push([el, '--sx-rise', rise ? n2(rise) + 'px' : null]);
        vars.push([el, '--sx-drop', drop ? n2(drop) + 'px' : null]);
        e.si.evs.forEach((ev, j) => {
          const nx = e.si.evs[j + 1];
          const mr = nx ? (e.xs[j + 1] - nx.bw / 2) - (e.xs[j] + ev.bw / 2) : 0;
          vars.push([ev.stack, '--sx-mr', mr ? n2(mr) + 'px' : null]);
        });
      });
    });
    return { line, vars, breaks, info, rows: rows.length, avail, prefix: pre };
  }

  /* ---- realising a plan: custom properties and row breaks (writes only) ---- */
  const SX = ['--sx-w', '--sx-ml', '--sx-nl', '--sx-ta', '--sx-ca', '--sx-rise', '--sx-drop'];
  function clearLayout(line) {
    line.querySelectorAll(':scope > .row-break').forEach(b => b.remove());
    line.querySelectorAll(':scope > .syllable').forEach(syl => SX.forEach(p => syl.style.removeProperty(p)));
    line.querySelectorAll('.harmony-stack').forEach(st => st.style.removeProperty('--sx-mr'));
    plans.delete(line);
  }
  function applyPlan(plan) {
    plan.vars.forEach(([el, name, value]) => {
      if (value === null) el.style.removeProperty(name);
      else if (el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value);
    });
    // row breaks: only touched when they change
    const line = plan.line;
    const have = Array.from(line.querySelectorAll(':scope > .row-break'));
    const same = have.length === plan.breaks.length && have.every((b, i) => b.nextElementSibling === plan.breaks[i]);
    if (!same) {
      have.forEach(b => b.remove());
      plan.breaks.forEach(syl => {
        const br = document.createElement('div');
        br.className = 'row-break';
        br.setAttribute('aria-hidden', 'true');
        syl.before(br);
      });
    }
    plans.set(line, plan);
  }
  const plans = new WeakMap();

  /* ================= drawing one line =================
     clock: { at, p0 } — where this line starts in the song, in ticks, and
     the first line's pick-up (the song's bar grid), so the bar numbers
     count through the whole song whatever the lines' pick-ups. */
  function renderLine(line, lineIndex, lastLine, clock) {
    let svg = line.querySelector(':scope > svg.staff-svg');
    const plan = plans.get(line);
    const wantStaff = line.classList.contains('has-staff') && !!plan;
    if (!wantStaff) {
      if (svg) svg.remove();
      syncCut(line, null);
      line.style.removeProperty('--staff-prefix');
      line.style.removeProperty('--staff-top');
      return;
    }
    const le = SW.timing.lineEvents(line);
    const bs = blockScale();
    const withTime = lineIndex === 0;

    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'staff-svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      line.insertBefore(svg, line.firstChild);
    }
    // the SVG covers the line
    const W = line.clientWidth, H = line.clientHeight;
    svg.setAttribute('width', W);
    svg.setAttribute('height', H);
    const cs = getComputedStyle(line);
    const padL = parseFloat(cs.paddingLeft) || 0;
    const prefixW = parseFloat(line.style.getPropertyValue('--staff-prefix')) || 0;
    const left = padL - prefixW;                // where the staff starts

    // rows: columns that share a bar base
    const rows = [];
    le.events.forEach(ev => {
      const o = offsetIn(ev.stack, line);
      ev.x = o.x + ev.stack.offsetWidth / 2;
      ev.base = Math.round(o.y + ev.stack.offsetHeight);
      ev.info = plan.info.get(ev.stack) || null;
      let row = rows.find(r => Math.abs(r.base - ev.base) <= 2);
      if (!row) { row = { base: ev.base, events: [] }; rows.push(row); }
      row.events.push(ev);
    });
    rows.sort((a, b) => a.base - b.base);

    const active = SW.score.getActiveNote();
    // a saved picture shows the music, not the selection
    const activeStack = active && !document.body.classList.contains('capturing') ? active.closest('.harmony-stack') : null;
    const barNumbers = !SW.settings || !SW.settings.layout || !SW.settings.layout.show || SW.settings.layout.show.barNumbers !== false;
    const parts = [];
    const cuts = [];
    rows.forEach((row, ri) => {
      parts.push(renderRow(row, {
        bs, left, withTime: withTime && ri === 0, lastRow: ri === rows.length - 1,
        lastLine, le, activeStack, showNames: S.showNames, barNumbers, clock: clock || { at: 0, p0: 0 }, W, cuts
      }));
    });
    svg.innerHTML = parts.join('');
    syncCut(line, cuts[0] || null);
  }

  /* ================= the pick-up's bar line: the × =================
     In Edit, the bar line that closes a line's pick-up can be taken out
     (score.js cutPickupBar): a mouse over it shows it lit, with a × above
     the staff; on a touch screen the × is always there, faintly. An HTML
     button over the SVG (which takes no pointer), a child of the line. */
  function syncCut(line, cut) {
    let el = line.querySelector(':scope > .pickup-cut');
    const want = cut && S.editing && SW.settings && SW.settings.can('structure');
    if (!want) { if (el) el.remove(); return; }
    if (!el) {
      el = document.createElement('div');
      el.className = 'pickup-cut';
      el.innerHTML = '<button type="button" class="pickup-cut-btn" title="Take out this bar line — the pick-up joins the bar after it" aria-label="Take out the pick-up’s bar line">'
        + '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3l-6 6"/></svg></button>'
        + '<span class="pickup-cut-bar" aria-hidden="true"></span>';
      // never take the selection or a word being typed away (Edit box rule)
      el.addEventListener('mousedown', e => e.preventDefault());
      el.addEventListener('pointerdown', e => e.stopPropagation());
      el.addEventListener('click', e => {
        e.stopPropagation();
        if (e.target.closest('.pickup-cut-btn')) SW.score.cutPickupBar(line);
      });
      line.appendChild(el);
    }
    const btn = Math.max(20, Math.min(30, cut.s * 1.4));
    const top = cut.top - btn - Math.max(4, cut.s * 0.3);
    el.style.left = n2(cut.x) + 'px';
    el.style.top = n2(top) + 'px';
    el.style.height = n2(cut.bottom - top) + 'px';
    el.style.setProperty('--cut-btn', n2(btn) + 'px');
    el.style.setProperty('--cut-bar', n2(cut.bottom - cut.top) + 'px');
  }

  /* ================= one visual row ================= */
  function renderRow(row, o) {
    const g = geometry(row.base, o.bs);
    const { S: s, k, yOf } = g;
    const lineW = Math.max(1, s * E.staffLine);
    const p = [];
    const evs = row.events;
    const last = evs[evs.length - 1];

    // where the staff ends: the row's closing bar line, or past its last ink
    let staffEnd = o.W - 4;
    if (last && last.info && last.info.endDx !== undefined) staffEnd = last.x + last.info.endDx;
    else if (last) staffEnd = last.x + last.stack.offsetWidth / 2 + s * 0.5;

    // staff lines
    for (let i = 0; i < 5; i++) {
      const y = yOf(E4 + 2 * i);
      p.push(rect(o.left, y - lineW / 2, staffEnd - o.left, lineW, INK, ' class="sl"'));
    }

    // clef, key signature, time signature
    const pre = prefix(s, o.withTime);
    p.push(at('gClef', o.left + pre.clefX, yOf(step('G', 4)), k));
    pre.sig.forEach(a => p.push(at(a.name, o.left + a.x, yOf(a.st), k)));
    if (pre.time) {
      const t = pre.time, tx = o.left + t.x;
      p.push(boxAt(t.top, tx + (t.w - gw(t.top, k)) / 2, yOf(B4) - gh(t.top, k), k));
      p.push(boxAt(t.bot, tx + (t.w - gw(t.bot, k)) / 2, yOf(B4), k));
    }

    // beam groups of this row (a group cut by a row break is no group)
    const beamGroups = {};
    evs.forEach(ev => { if (ev.notated && !ev.rest && ev.beam !== null) (beamGroups[ev.beam] = beamGroups[ev.beam] || []).push(ev); });
    Object.keys(beamGroups).forEach(id => {
      if (beamGroups[id].length < 2) { beamGroups[id][0].beam = null; delete beamGroups[id]; }
    });

    const barLine = bx => rect(bx - s * E.thinBar / 2, yOf(F5) - lineW / 2, s * E.thinBar, yOf(E4) - yOf(F5) + lineW, INK);
    evs.forEach((ev, i) => {
      if (!ev.notated || !ev.info) return;
      if (ev.rest) p.push(drawRest(ev, g, o));
      else p.push(drawNote(ev, g, o));
      if (ev.info.barDx !== undefined && evs[i + 1]) {
        p.push(barLine(ev.x + ev.info.barDx));
        // the bar line that closes the line's pick-up (see syncCut)
        if (o.cuts && o.le.pickup && ev.bar === 0 && evs[i + 1].bar > 0) {
          o.cuts.push({ x: ev.x + ev.info.barDx, top: yOf(F5) - lineW / 2, bottom: yOf(E4) + lineW / 2, s });
        }
      }
    });
    Object.keys(beamGroups).forEach(id => p.push(drawBeam(beamGroups[id], g)));
    // ties, to the next note in this row (a tie is inside one syllable, so
    // a row never breaks inside one)
    evs.forEach((ev, i) => { if (ev.tieNext && ev.info && evs[i + 1] && evs[i + 1].info) p.push(drawTies(ev, evs[i + 1], g)); });
    // heads go over stems and beams' ends
    evs.forEach(ev => { if (ev.notated && !ev.rest && ev.info) p.push(drawHeads(ev, g, o)); });

    // bar numbers (Layout settings → Bar numbers): over the bar line, clear
    // of the first note's ink; the song's first bar goes unnumbered, as in print
    if (o.barNumbers) {
      evs.forEach((ev, i) => {
        const prev = evs[i - 1];
        if (!ev.notated || !ev.info) return;
        if (prev && !(ev.bar > prev.bar)) return;
        if (o.le.pickup && ev.bar === 0) return;          // a pick-up ends the bar before; it has no number
        if (ev.start !== o.le.barStart(ev.bar)) return;
        // counted on the song's grid: bar 1 is the first whole bar (a pick-up is bar 0)
        const n = Math.round((o.clock.at + ev.start - o.clock.p0) / o.le.meter.barTicks) + 1;
        if (n === 1) return;
        const centred = ev.info.barBeforeDx !== undefined;
        const nx = centred ? ev.x + ev.info.barBeforeDx : ev.x - ev.info.L;
        // it rises over the note only if the note (or its name) is under it
        const numW = String(n).length * s * 0.4;
        const inkL = ev.x - Math.max(ev.info.hw ? ev.info.hw / 2 + s * E.ledgerExt : ev.stack.offsetWidth / 2, o.showNames ? s * 0.8 : 0);
        let top = yOf(F5) - s * 0.9;
        if ((!centred || nx + numW / 2 + s * 0.15 > inkL) && ev.topY !== undefined) top = Math.min(top, ev.topY - s * 0.45);
        p.push(text(nx, top, Math.max(9, s * 0.62), String(n),
          'class="bar-num" fill="#9487A2" font-weight="800"' + (centred ? ' text-anchor="middle"' : '')));
      });
    }

    // the row's closing bar line; the song's last is a final bar line
    if (last && last.info && last.info.endBar) {
      if (last.info.final && o.lastRow && o.lastLine) {
        const thick = s * E.thickBar;
        p.push(rect(staffEnd - thick, yOf(F5) - lineW / 2, thick, yOf(E4) - yOf(F5) + lineW, INK));
        p.push(barLine(staffEnd - thick - s * E.barSep - s * E.thinBar / 2));
      } else {
        p.push(barLine(staffEnd - s * E.thinBar / 2));
      }
    }
    return p.join('');
  }

  /* The ledger lines, accidentals, stem, flag and dots of one written
     column (its heads are drawn afterwards, over the stems). Stems of
     beamed notes are drawn by drawBeam, which knows the beam's slope. */
  function drawNote(ev, g, o) {
    const { S: s, k, yOf } = g;
    const I = ev.info;
    const v = ev.value;
    const cx = ev.x;
    const lo = ev.pitches[0].step, hi = ev.pitches[ev.pitches.length - 1].step;
    const p = [];
    const dir = I.dir;

    // ledger lines, as wide as the heads beside them
    const ledgerW = Math.max(1.2, s * E.ledger);
    const ledger = (st, heads) => {
      const l = Math.min(...heads.map(h => h.dx)) - I.hw / 2 - s * E.ledgerExt;
      const r = Math.max(...heads.map(h => h.dx)) + I.hw / 2 + s * E.ledgerExt;
      p.push(rect(cx + l, yOf(st) - ledgerW / 2, r - l, ledgerW, INK));
    };
    for (let st = E4 - 2; st >= lo; st -= 2) ledger(st, I.heads.filter(h => h.pt.step <= st + 1));
    for (let st = F5 + 2; st <= hi; st += 2) ledger(st, I.heads.filter(h => h.pt.step >= st - 1));

    // accidentals
    I.accs.forEach(a => p.push(at(a.name, cx + a.x, yOf(a.st), k)));

    // dots
    if (I.dotX !== null && I.dots) I.dots.forEach(st => {
      p.push(boxAt('augmentationDot', cx + I.dotX, yOf(st) - gh('augmentationDot', k) / 2, k));
    });

    ev.topY = yOf(hi) - s * 0.55;
    // stem and flag
    if (v.base !== 'w' && (ev.beam === null)) {
      const stemW = I.stemW;
      const flags = flagsFor(v);
      if (dir === 'up') {
        const x0 = cx + I.hw / 2 - stemW;
        const from = yOf(lo) - s * E.stemAttach;
        let to = yOf(hi) - s * (E.stem + (flags === 2 ? 0.25 : 0));
        to = Math.min(to, yOf(B4));                         // reaches the middle line
        p.push(rect(x0, to, stemW, from - to, INK));
        if (flags) p.push(at(flags === 2 ? 'flag16thUp' : 'flag8thUp', x0, to, k));
        ev.topY = Math.min(ev.topY, to);
      } else {
        const x0 = cx - I.hw / 2;
        const from = yOf(hi) + s * E.stemAttach;
        const len = E.stem + (flags === 1 ? 0.25 : flags === 2 ? 0.5 : 0);
        let to = yOf(lo) + s * len;
        to = Math.max(to, yOf(B4));
        p.push(rect(x0, from, stemW, to - from, INK));
        if (flags) {
          // a down flag curls back towards its own head: keep its tip clear
          const fname = flags === 2 ? 'flag16thDown' : 'flag8thDown';
          const room = (to - yOf(lo)) - s * 0.8;
          const vs = Math.min(1, room / gh(fname, k));
          p.push(at(fname, x0, to, k, null, vs));
        }
      }
    }

    // names (the glasses): opposite the stem
    if (o.showNames) {
      const above = dir === 'down' || v.base === 'w';
      const pt = above ? ev.pitches[ev.pitches.length - 1] : ev.pitches[0];
      const nm = pt.name.replace('#', '♯').replace('b', '♭');
      const halo = ' paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round"';
      if (above) {
        const yTop = Math.min(yOf(hi), yOf(F5 + 1)) - s * 0.75;
        p.push(text(cx, yTop, s * 0.9, nm, 'text-anchor="middle" font-weight="800" fill="' + pt.color + '"' + halo));
        p.push(text(cx, yTop - s * 0.95, s * 0.7, pt.sol.toLowerCase(), 'text-anchor="middle" font-weight="700" fill="#5C4E6B"' + halo));
        ev.topY = Math.min(ev.topY, yTop - s * 1.7);
      } else {
        const yBot = yOf(lo) + s * 1.35;
        p.push(text(cx, yBot, s * 0.9, nm, 'text-anchor="middle" font-weight="800" fill="' + pt.color + '"' + halo));
        p.push(text(cx, yBot + s * 0.8, s * 0.7, pt.sol.toLowerCase(), 'text-anchor="middle" font-weight="700" fill="#5C4E6B"' + halo));
      }
    }
    return p.join('');
  }

  /* Ties: a crescent from under (or over) one head to the next, thick in
     the middle and fine at the ends, as engraved. */
  function drawTies(ev, nx, g) {
    const { S: s, yOf } = g;
    const out = [];
    ev.tiePitches.forEach(pt => {
      // (the heads are the plan's, read in another pass: match by pitch)
      const h1 = ev.info.heads && ev.info.heads.find(h => h.pt.midi === pt.midi);
      const h2 = nx.info.heads && nx.info.heads.find(h => h.pt.midi === pt.midi);
      if (!h1 || !h2) return;
      const side = tieSide(ev.tiePitches, pt, ev.info.dir, ev.value);
      const x1 = ev.x + h1.dx + ev.info.hw * 0.3;
      const x2 = Math.max(x1 + s * 0.6, nx.x + h2.dx - nx.info.hw * 0.3);
      const len = x2 - x1;
      const y0 = yOf(pt.step) + side * s * TIE_OFF;
      const bow = tieBow(nx.x - ev.x, s), thick = s * 0.17;
      const c1 = x1 + len * 0.28, c2 = x2 - len * 0.28;
      const yo = y0 + side * bow / 0.75, yi = y0 + side * (bow - thick) / 0.75;
      out.push('<path class="tie" fill="' + INK + '" stroke="' + INK + '" stroke-width="' + n2(s * 0.035) + '" stroke-linejoin="round" d="M' +
        n2(x1) + ' ' + n2(y0) + 'C' + n2(c1) + ' ' + n2(yo) + ' ' + n2(c2) + ' ' + n2(yo) + ' ' + n2(x2) + ' ' + n2(y0) +
        'C' + n2(c2) + ' ' + n2(yi) + ' ' + n2(c1) + ' ' + n2(yi) + ' ' + n2(x1) + ' ' + n2(y0) + 'Z"/>');
    });
    return out.join('');
  }

  /* The heads: the block's colour inside an ink outline, a displaced
     second on the other side of the stem; then the selection ring. */
  function drawHeads(ev, g, o) {
    const { S: s, k, yOf } = g;
    const I = ev.info;
    const head = headFor(ev.value);
    const hx0 = gx0(head, k);
    const ring = n2(Math.max(1, s * E.outline) / k);
    const p = [];
    I.heads.forEach(h => {
      const x = ev.x - I.hw / 2 - hx0 + h.dx, y = yOf(h.pt.step);
      p.push(at(head, x, y, k, 'fill="' + h.pt.color + '" stroke="' + INK + '" stroke-width="' + ring + '" stroke-linejoin="round"'));
    });
    if (o.activeStack === ev.stack) {
      const sel = ev.pitches.find(pt => pt.el.classList.contains('selected-note')) || ev.pitches[0];
      const h = I.heads.find(x => x.pt === sel);
      const cx = ev.x + (h ? h.dx : 0);
      p.push('<circle cx="' + n2(cx) + '" cy="' + n2(yOf(sel.step)) + '" r="' + n2(s * 0.95) + '" fill="none" stroke="' + GOLD + '" stroke-width="' + n2(Math.max(2, s * 0.14)) + '" opacity=".95"/>');
      p.push('<circle cx="' + n2(cx) + '" cy="' + n2(yOf(sel.step)) + '" r="' + n2(s * 1.25) + '" fill="none" stroke="' + GOLD + '" stroke-width="' + n2(s * 0.3) + '" opacity=".28"/>');
    }
    return p.join('');
  }

  /* A rest, on the middle line (a whole rest hangs from the fourth, and a
     whole rest alone in its bar sits in the middle of the bar). */
  function drawRest(ev, g, o) {
    const { S: s, k, yOf } = g;
    const v = ev.value;
    const I = ev.info;
    const name = restFor(v);
    const originY = name === 'restWhole' ? yOf(D5) : yOf(B4);
    const w = gw(name, k);
    let cx = ev.x;
    if (name === 'restWhole' && I.barDx !== undefined && I.barBeforeDx !== undefined) cx = ev.x + (I.barDx + I.barBeforeDx) / 2;
    else if (name === 'restWhole' && I.endDx !== undefined && I.barBeforeDx !== undefined && I.endBar) cx = ev.x + (I.endDx + I.barBeforeDx) / 2;
    const x = cx - w / 2 - gx0(name, k);
    const p = [at(name, x, originY, k, 'fill="' + INK + '"')];
    if (v.dotted) p.push(boxAt('augmentationDot', cx + w / 2 + s * E.dotGap, yOf(B4 + 1) - gh('augmentationDot', k) / 2, k));
    ev.topY = yOf(D5) - s * 0.5;
    if (o.activeStack === ev.stack) {
      p.push('<circle cx="' + n2(cx) + '" cy="' + n2(yOf(B4)) + '" r="' + n2(s * 1.15) + '" fill="none" stroke="' + GOLD + '" stroke-width="' + n2(Math.max(2, s * 0.14)) + '" opacity=".95"/>');
    }
    return p.join('');
  }

  /* A beamed group. One stem direction for all; the beam slants with the
     melody — from the first note to the last, a second ¼ S, a third ½ S,
     a fourth ¾ S, wider 1 S, never steeper than a quarter space per staff
     space across — and lies level when the notes repeat or the middle
     notes reach past both ends towards the beam. It sits so the note
     nearest it keeps a full stem (3½ S; the shortest stem never under
     3¼ S), reaches the middle line, and its ends fall on quarter spaces
     so no sliver of white is left between beam and staff line. A second
     beam runs over the sixteenths (a stub where one stands alone).
     `beamLine` is the placement alone, so the planner can see where a
     beam under the notes will reach before anything is drawn. */
  function beamLine(grp, up, stemMids, yOf, s) {
    const nearStep = ev => up ? ev.pitches[ev.pitches.length - 1].step : ev.pitches[0].step;   // the head nearest the beam
    const steps = grp.map(nearStep);
    const n = steps.length;
    const dx = stemMids[n - 1] - stemMids[0];

    // slant
    const interval = steps[n - 1] - steps[0];
    const inner = steps.slice(1, -1);
    const concave = up ? inner.some(st => st > Math.max(steps[0], steps[n - 1])) : inner.some(st => st < Math.min(steps[0], steps[n - 1]));
    let slant = 0;
    if (interval !== 0 && !concave) {
      const m = Math.abs(interval);
      slant = s * Math.min(m <= 3 ? m * 0.25 : 1, (dx / s) * 0.25);
      slant = Math.round(slant / (s * 0.25)) * s * 0.25;
      if (slant === 0 && m > 0) slant = s * 0.25;
      if (dx < s * 1.2) slant = 0;
      slant *= interval > 0 ? -1 : 1;                      // rising notes, rising beam (y goes down the page)
    }
    const slope = dx ? slant / dx : 0;

    // height: the nearest note keeps a full stem, no stem is short, the middle line is reached
    const full = s * E.stem;
    let y0 = up ? Infinity : -Infinity;
    steps.forEach((st, i) => {
      const near = yOf(st);
      const want = up ? near - full : near + full;
      const c = want - slope * (stemMids[i] - stemMids[0]);
      y0 = up ? Math.min(y0, c) : Math.max(y0, c);
    });
    steps.forEach((st, i) => {
      const near = yOf(st);
      const need = up ? Math.min(near - s * E.stemBeamed, yOf(B4)) : Math.max(near + s * E.stemBeamed, yOf(B4));
      const c = need - slope * (stemMids[i] - stemMids[0]);
      y0 = up ? Math.min(y0, c) : Math.max(y0, c);
    });
    // ends on quarter spaces, moved away from the heads
    const q = s * 0.25;
    const ref = yOf(E4);
    const snap = y => ref + (up ? Math.floor((y - ref) / q + 1e-6) : Math.ceil((y - ref) / q - 1e-6)) * q;
    y0 = snap(y0);
    return x => y0 + slope * (x - stemMids[0]);           // the beam's outer edge at x
  }

  function drawBeam(grp, g) {
    const { S: s, yOf } = g;
    const dir = groupDir(grp);
    const up = dir === 'up';
    const beamT = s * E.beam, gap = s * E.beamGap;
    const p = [];
    grp.forEach(ev => {
      const I = ev.info;
      ev.stemX = up ? ev.x + I.hw / 2 - I.stemW : ev.x - I.hw / 2;
      ev.stemMid = ev.stemX + I.stemW / 2;
      const lo = ev.pitches[0].step, hi = ev.pitches[ev.pitches.length - 1].step;
      ev.near = up ? yOf(hi) : yOf(lo);                    // the head nearest the beam
      ev.far = up ? yOf(lo) - s * E.stemAttach : yOf(hi) + s * E.stemAttach;   // where the stem leaves
    });
    const a = grp[0], b = grp[grp.length - 1];
    const edge = beamLine(grp, up, grp.map(ev => ev.stemMid), yOf, s);

    // stems, to the beam's outer edge
    grp.forEach(ev => {
      const yb = edge(ev.stemMid);
      const top = Math.min(ev.far, yb), bot = Math.max(ev.far, yb);
      p.push(rect(ev.stemX, top, ev.info.stemW, bot - top, INK));
      ev.topY = Math.min(ev.near - s * 0.55, up ? yb : Infinity);
    });
    const xa = a.stemX, xb = b.stemX + b.info.stemW;
    const band = (x1, x2, off) => {
      // a parallelogram along the beam, `off` from its outer edge towards the heads
      const t1 = edge(x1) + (up ? off : -off), t2 = edge(x2) + (up ? off : -off);
      return up ? poly([[x1, t1], [x2, t2], [x2, t2 + beamT], [x1, t1 + beamT]])
                : poly([[x1, t1 - beamT], [x2, t2 - beamT], [x2, t2], [x1, t1]]);
    };
    p.push(band(xa, xb, 0));

    // the second beam: sixteenths side by side share it; a lone one gets a stub
    const need = grp.map(ev => flagsFor(ev.value) >= 2);
    let i = 0;
    while (i < grp.length) {
      if (!need[i]) { i++; continue; }
      let j = i;
      while (j + 1 < grp.length && need[j + 1]) j++;
      if (j > i) p.push(band(grp[i].stemX, grp[j].stemX + grp[j].info.stemW, beamT + gap));
      else {
        const stub = Math.max(s * 1.1, grp[i].info.hw * 0.95);
        const ev = grp[i];
        if (i > 0) p.push(band(ev.stemX + ev.info.stemW - stub, ev.stemX + ev.info.stemW, beamT + gap));
        else p.push(band(ev.stemX, ev.stemX + stub, beamT + gap));
      }
      i = j + 1;
    }
    return p.join('');
  }

  /* ================= render all ================= */
  let timer = 0;
  function render() {
    if (!G || !score) return;
    const lines = Array.from(score.querySelectorAll('.notation-line'));
    const on = document.body.classList.contains('show-staff');
    const bs = blockScale();
    const s = SS_PX * bs;
    // 1 · which lines have a staff, and the room each keeps for its clef
    const staffLines = [];
    lines.forEach((line, i) => {
      const wants = on && !!line.querySelector('.harmony-stack.notated');
      line.classList.toggle('has-staff', wants);
      if (wants) {
        line.style.setProperty('--staff-prefix', n2(prefix(s, i === 0).width) + 'px');
        line.style.setProperty('--staff-top', n2(staffTop(bs)) + 'px');
        staffLines.push({ line, i });
      } else {
        clearLayout(line);
      }
    });
    // 2 · plan every line (reads), 3 · realise the plans (writes)
    const planned = staffLines.map(o => planLine(o.line, o.i, o.i === lines.length - 1, bs));
    planned.forEach(applyPlan);
    // 4 · draw
    const clock = { at: 0, p0: lines.length ? SW.timing.linePickup(lines[0]) : 0 };
    lines.forEach((line, i) => {
      renderLine(line, i, i === lines.length - 1, { at: clock.at, p0: clock.p0 });
      clock.at += SW.timing.lineEvents(line).padded;
    });
    if (SW.dock) SW.dock.align();
    SW.bus.emit('staff:drawn', {});
  }
  /* Coalesce a burst of events into one redraw. A timeout rather than
     requestAnimationFrame: the frame callback is throttled whenever the
     page is not the front window, and the staff must still follow. */
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(render, 16);
  }

  ['score:changed', 'score:loaded', 'selection', 'key:changed', 'names:changed', 'meter:changed',
   'view:changed', 'policy:changed', 'mode:changed', 'layout:changed', 'present:changed'].forEach(evt => SW.bus.on(evt, schedule));
  window.addEventListener('resize', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  /* A bar's height eases (.2s, style.css .note) when its pitch or the
     block size changes, and the staff is drawn on the bars' measured feet:
     draw again once they have settled, or a row whose words sit close
     under the staff is left with its notes over them. */
  if (score) score.addEventListener('transitionend', e => {
    if (e.propertyName === 'height' && e.target.classList && e.target.classList.contains('note')) schedule();
  });

  SW.staff = { render, schedule, geometry, keySignature, plan: line => plans.get(line), available: !!G };
})();

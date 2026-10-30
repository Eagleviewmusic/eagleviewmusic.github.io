/* ==========================================================================
   COMPONENT — the circle of fifths in blocks (the Chord Chart, 2026-10-29)
   --------------------------------------------------------------------------
   The user's design: the circle of fifths, every major chord and every
   minor one, laid out flat — the window is wide and short — as two ovals
   of blocks, each in its root's colour. The majors are the outer oval,
   each one's relative minor the inner one beside it:

            B♭    F    [C]    G    D               top arch: major over minor,
      E♭    Gm    Dm   [Am]   Em   Bm    A          a step out a little lower
      Cm                                 F♯m       the ends: half way down,
            Fm   B♭m   E♭m   G♯m  C♯m              across the two arches
            A♭    D♭    G♭    B    E               bottom arch: minor over major

   The key's home pair is at the top in the middle (C over Am), and the
   key's own chords gather round it; G♭ is straight under C at the bottom.
   A minor key keeps the same picture (its relative major over it: C over
   Am), so the tonic is always in the middle. A new key turns it: the
   blocks are worked out from the song's key and scale every time it is
   drawn.

   Names: letters (C, Am, B♭) to start, or the numerals the rest of the app
   uses (I, vi, ♭VII, V/V) — the C · I switch in the middle, remembered
   (View pref circleNames; the panel's own I/C button is separate). Out
   of the scale: striped, as on the panel. A held Z X C V B button names
   and sounds every block as it would play (G → G7).

   Playing, holding, dragging onto the chart and listening are the chart's
   (chord-chart.js), as for the panel's blocks. The circle shows only when
   Layout settings allow every chord (a lesson that limits them keeps the
   panel).

   API  SW.chordCircle.html() · relabel(root) · allowed() · names() · setNames(m)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  if (!C) return;
  const Th = window.Theory || (typeof Theory !== 'undefined' ? Theory : null);
  if (!Th) return;
  const esc = C.escapeHtml;

  /* ---------------- the ring, from the home major ----------------
     Round the circle clockwise from the top: the majors as degrees of the
     home major — sharps to the right, flats to the left, the tritone at
     the bottom — each with its relative minor a major 6th above. */
  const MAJ = ['1', '5', '2', '6', '3', '7', 'b5', 'b2', 'b6', 'b3', 'b7', '4'];
  // where each spot sits: its column (−3 … 3) and its arch
  const COL = [0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1];
  const ARCH = ['top', 'top', 'top', 'end', 'low', 'low', 'low', 'low', 'low', 'end', 'top', 'top'];
  /* the geometry, in units (a px on a wide screen, less on a phone — style.css --u):
     a major block 46 high, a minor 40, 4 between; a step out drops the top arch 14,
     then 26 more (an oval, not a ramp); the arches meet the ends half way down */
  const HM = 46, HN = 40, GAP = 4, PAIR = HM + GAP + HN;
  const DROP = [0, 14, 40];
  const H = 2 * PAIR + 2 * DROP[2] + 8;
  const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];

  const view = () => (SW.settings && SW.settings.view) || {};
  const names = () => (view().circleNames === 'roman' ? 'roman' : 'letter');
  function setNames(m) { SW.settings.setView({ circleNames: m === 'roman' ? 'roman' : 'letter' }, { quiet: true }); }
  /* the circle needs every chord: a lesson that limits the panel keeps the panel */
  const allowed = () => C.PLACES.every(C.placeAllowed);

  function accs(alter) { return alter > 0 ? '#'.repeat(alter) : 'b'.repeat(-alter); }
  /* degree a, then degree b above it: 'b3' + '5' = 'b7' */
  function addDeg(a, b) {
    const A = Th.parseDegree(a), B = Th.parseDegree(b);
    const num = (A.num - 1 + B.num - 1) % 7 + 1;
    let alter = ((Th.degreeSemis(a) + Th.degreeSemis(b) - MAJOR_SEMIS[num - 1]) % 12 + 12) % 12;
    if (alter > 6) alter -= 12;
    return accs(alter) + num;
  }
  /* a major and its relative minor, spelled together the plainest way in this key: E♭'s C♭ is
     written B (with G♯m), F♯'s A♯ B♭ (with Gm); a tie keeps the fifths' own spelling (C's G♭ with
     E♭m, not F♯ with D♯m). A flat on C or F, a sharp on E or B, counts as one more. */
  function pairAt(deg) {
    const tonic = SW.music.spelledKey();
    const semis = Th.degreeSemis(deg);
    const cost = d => {
      const sp = Th.spellDegree(tonic, d);
      return Math.abs(sp.alter) + ((sp.alter === -1 && (sp.letter === 'C' || sp.letter === 'F')) || (sp.alter === 1 && (sp.letter === 'E' || sp.letter === 'B')) ? 1 : 0);
    };
    const both = d => cost(d) + cost(addDeg(d, '6'));
    let best = deg, bestCost = both(deg);
    for (let num = 1; num <= 7; num++) {
      let alter = ((semis - MAJOR_SEMIS[num - 1]) % 12 + 12) % 12;
      if (alter > 6) alter -= 12;
      if (Math.abs(alter) > 2) continue;
      const d = accs(alter) + num, c = both(d);
      if (c < bestCost) { best = d; bestCost = c; }
    }
    return { major: best, minor: addDeg(best, '6') };
  }
  /* the home major: the tonic, or — a scale with a minor 3rd — its relative major (A minor: C) */
  function home() {
    const sc = C.scale();
    const minor = sc && sc.degrees.indexOf('b3') !== -1 && sc.degrees.indexOf('3') === -1;
    return { deg: minor ? 'b3' : '1', minor };
  }
  function ring() {
    const h = home();
    return MAJ.map((d, i) => {
      const p = pairAt(addDeg(h.deg, d));
      return { i, major: { root: p.major, q: 'maj', mods: [] }, minor: { root: p.minor, q: 'min', mods: [] }, tonic: h.minor ? 'minor' : 'major' };
    });
  }

  /* ---------------- drawing ---------------- */
  const text = d => (names() === 'roman' ? d.roman : d.letter);
  const label = d => C.labelHTML(text(d));
  // a long name shrinks: on a phone by its length, on a wide screen only past eight characters
  const fit = d => { const t = text(d), n = Array.from(t).length; return '--ns:' + C.nameScale(t) + ';--nsw:' + (n > 8 ? 0.8 : 1); };
  function blockHtml(spec, kind, n, y, isHome) {
    const id = C.toId(spec);
    const d = C.describe(id, { held: true });
    const plain = C.describe(id);
    return '<div class="cc-cb ' + kind + (plain.inScale ? '' : ' out-of-scale') + (isHome ? ' home' : '') + '" data-chord="' + id + '"' +
      ' role="button" aria-label="' + esc(plain.letter + ' — ' + plain.roman) + '" title="' + esc(plain.letter + ' · ' + plain.roman) + '"' +
      ' style="--n:' + n + ';--y:' + y + ';--c:' + d.color + ';--cink:' + SW.chordStrip.inkOn(d.color) + '">' +
      '<span class="cc-cbn" style="' + fit(d) + '">' + label(d) + '</span></div>';
  }
  function html() {
    const out = [];
    ring().forEach(p => {
      const n = COL[p.i] + 3, k = Math.abs(COL[p.i]);
      let yMaj, yMin;
      if (ARCH[p.i] === 'top') { yMaj = DROP[k]; yMin = yMaj + HM + GAP; }
      else if (ARCH[p.i] === 'low') { yMin = H - PAIR - DROP[k]; yMaj = yMin + HN + GAP; }
      else { yMaj = (H - PAIR) / 2; yMin = yMaj + HM + GAP; }
      const homeMaj = p.tonic === 'major' && p.major.root === '1', homeMin = p.tonic === 'minor' && p.minor.root === '1';
      out.push(blockHtml(p.major, 'maj', n, yMaj, homeMaj), blockHtml(p.minor, 'min', n, yMin, homeMin));
    });
    const sc = C.scale();
    const key = SW.music.spelledKey() + ' ' + (sc ? sc.name.toLowerCase() : 'major');
    const tonicLetter = Th.spellDegree(SW.music.spelledKey(), '1').name;
    const r = names() === 'roman';
    return '<div class="cc-circle" style="--h:' + H + '">' + out.join('') +
      '<div class="cc-ccenter">' +
        '<span class="cc-ckey">' + esc(key) + '</span>' +
        '<div class="seg cc-cnames" role="group" aria-label="Chord names">' +
          '<button type="button" class="seg-btn' + (r ? '' : ' active') + '" data-cnames="letter" aria-pressed="' + !r + '" title="Chord names as letters (' + esc(tonicLetter) + ' F G)">' + esc(tonicLetter) + '</button>' +
          '<button type="button" class="seg-btn' + (r ? ' active' : '') + '" data-cnames="roman" aria-pressed="' + r + '" title="Chord names as roman numerals (I IV V)">I</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  /* a Z X C V B button held or let go: every block says what it would play now */
  function relabel(root) {
    if (!root) return;
    root.querySelectorAll('.cc-circle .cc-cb[data-chord]').forEach(b => {
      const n = b.querySelector('.cc-cbn');
      if (!n) return;
      const d = C.describe(b.dataset.chord, { held: true });
      n.innerHTML = label(d);
      n.setAttribute('style', fit(d));
    });
  }

  SW.chordCircle = { html, relabel, allowed, names, setNames, H };
})();

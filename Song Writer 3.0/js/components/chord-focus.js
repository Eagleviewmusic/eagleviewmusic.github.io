/* ==========================================================================
   COMPONENT — Focus: one chord's own notes (the Chords window, 2026-10-28)
   --------------------------------------------------------------------------
   Phase 3 of ../Song Writer Chords Redesign/ (README §3.2, D9–D12, Y2). A
   page you go INTO from a chord and come back out of — not a tab:

     from the Chord Chart   a double-tap on a card, its tune button, Enter
     from the music         a double-click on a chord (it was Individual Focus)
     from the Time Line     a double-click on a chord, Enter
     Create Chord           a new chord to build (unlocked), Put it on the chart

   The chord on a treble and a bass staff, in the song's key signature,
   with the same notes on a keyboard under it; its name above follows its
   notes (chords.js nameVoice: C E G is I, E to F is Isus4, E in the bass
   is I⁶; notes no chord has, their letters).

   COMPARING (2026-10-30, user): every chart card with its gold toggle on
   (chord-chart.js) stands beside the chord in Focus, whichever it is — in
   the chart's order, a light bar line between them, each named over its
   notes — so the voice leading from one to the next can be made smooth.
   A tap on a chord (its name, a note, the staff by it) makes it the one
   being changed: its notes are dark, the keyboard shows it, the lock and
   every key below work on it. Each keeps its own changes; ↶ ↷ go back
   through all of them in order. ▶ In order plays them one after another.
   With more than one chord the buttons are Save All (every changed chord
   saved to its card) and Let me Decide (a small question: Save or Save
   as New for each chord that changed).

     • LOCKED (🔒, to start): a note moves only to the chord's own notes —
       ↑ ↓ the next one up or down, in any octave, past a pitch the chord
       already has; faint ghost noteheads show every place it can go, and
       a tap on one adds a note there (doubling the root, opening it out)
     • UNLOCKED (🔓): ↑ ↓ a half step (spelled for the key: the scale's
       letter, else ♯ going up and ♭ going down), ⇧↑ ⇧↓ an octave, ♭ ♮ ♯
       an accidental; a tap on any line or space adds a note there
     • ← → choose the note below / above (past the last, on into the chord
       beside it); Delete takes it out (a chord keeps two); the keyboard: a
       tap on a key selects its note, or adds one (locked: the chord's
       notes only)
     • ▶ the chord (held, it rings) · ▶ In the song — a chord from the
       song: that spot with a bar either side, the chords as they are now
     • Save to Chord Chart — the card's notes change, and every chord in
       the song from it (Y2) · Save as New — a card of its own beside it;
       from the song, that spot alone takes it (it takes the card's rhythm)
     • ⌘Z ⇧⌘Z (↶ ↷) undo the notes here, one step at a time
   Any other way out with changes (‹ back, a tab, ×, Esc, a tap outside)
   asks: Save · Save as New · Don't save (comparing: Save All · Let me
   Decide · Don't save) — or Keep editing (D12). ×, Esc and a tap outside
   go back like ‹ (2026-10-29, user): to the Chord Chart or the Time Line,
   whichever it was opened from — from the music, the window closes.

   API  SW.chordFocus.openCard(k) · atSpot(tick, origin) · atDraft(piece, hooks) · openNew() · render(body, foot) ·
        keyDown(e) · dirty() · origin() · leave(then) · undo() · redo() · canUndo() · canRedo() · closed() · columns()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const M = SW.music;
  const ui = SW.ui;
  const G = (typeof GLYPHS_LELAND !== 'undefined') ? GLYPHS_LELAND : null;
  const bodyEl = document.getElementById('pw-body');
  const footEl = document.getElementById('pw-foot');
  if (!C || !T || !bodyEl || !footEl) return;
  const esc = C.escapeHtml;
  const clone = x => JSON.parse(JSON.stringify(x));

  const LO = 36, HI = 84;                     // C2 … C6: the notes a chord may take here
  let F = null;                               // Focus: { origin, spot, spotEnd, hooks, isNew, locked, cols, cur, sel, hist, fut }

  /* ---------------- going in ---------------- */
  const cardsNow = () => (T.isChartShape() ? T.chart() : T.chartFrom().chart);
  const t0 = () => C.voiceMidis([[0, 0]])[0];                 // the tonic's MIDI (a voice's 0)
  const pcRel = m => ((m - t0()) % 12 + 12) % 12;
  /* a chord in Focus: its card, its notes as they came in (orig) and as they are */
  function column(o) {
    const notes = C.cleanVoice(o.notes) || C.voiceOf(o.chord) || [[0, 0], [4, 7]];
    return { k: o.k || null, chord: o.chord, place: o.place, notes, orig: JSON.stringify(notes), tones: C.describe(o.chord).tones, main: !!o.main };
  }
  /* the chord gone into, and beside it every gold card (the chart's order; the chord first when it has no card) */
  function begin(o) {
    const main = column(Object.assign({}, o, { main: true }));
    const golds = SW.chordChart && SW.chordChart.golds ? SW.chordChart.golds() : [];
    const cols = [];
    let placed = false;
    cardsNow().filter(e => !e.hidden).forEach(e => {
      if (e.id === main.k) { cols.push(main); placed = true; return; }
      if (golds.indexOf(e.id) !== -1) cols.push(column({ k: e.id, chord: e.chord, place: e.place, notes: e.voice || C.voiceOf(e.chord) }));
    });
    if (!placed) cols.unshift(main);
    F = { origin: o.origin, spot: o.spot === undefined ? null : o.spot, spotEnd: o.spotEnd, hooks: o.hooks || null, isNew: !!o.isNew,
      locked: o.locked !== false, cols, cur: cols.indexOf(main), sel: null, hist: [], fut: [] };
  }
  function openCard(k) {
    const e = cardsNow().find(x => x.id === k);
    if (!e) return false;
    begin({ origin: 'chart', k, chord: e.chord, place: e.place, notes: e.voice || C.voiceOf(e.chord), locked: true });
    return true;
  }
  /* a chord of the song (the music, the Time Line): its card — on an old song, the card its chart would give it */
  function atSpot(tick, origin) {
    const ev = T.events().find(e => e.id && C.isKnown(e.id) && e.at <= tick && tick < e.end);
    if (!ev) return false;
    let k = ev.k || null;
    if (!T.isChartShape()) { const pc = T.chartFrom().pieces.find(p => p.at === ev.at); k = pc ? pc.k : null; }
    begin({ origin, k, chord: ev.id, place: ev.place || undefined, spot: ev.at, spotEnd: ev.end, notes: ev.voice || C.voiceOf(ev.id), locked: true });
    return true;
  }
  function openNew() {
    begin({ origin: 'chart', chord: 'I', notes: C.voiceOf('I'), locked: false, isNew: true });
  }
  /* a chord of the Time Line's draft (chord-timeline.js, Phase 4): `hooks` — swap(k): Save as New's
     card takes that spot in the draft (the song is not touched); play(a, z, preview): ▶ In the song,
     the draft playing */
  function atDraft(pc, hooks) {
    if (!pc || !C.isKnown(pc.chord)) return false;
    const card = pc.k ? cardsNow().find(x => x.id === pc.k) : null;
    begin({ origin: 'song', k: card ? pc.k : null, chord: pc.chord, place: pc.place || undefined, spot: pc.at, spotEnd: pc.end,
      notes: (card ? card.voice : pc.voice) || C.voiceOf(pc.chord), locked: true, hooks });
    return true;
  }
  const col = () => F.cols[F.cur];
  const mainCol = () => F.cols.find(c => c.main);
  const many = () => !!F && F.cols.length > 1;
  const dirtyCol = c => JSON.stringify(c.notes) !== c.orig;
  const dirty = () => !!F && F.cols.some(dirtyCol);

  /* ---------------- the notes ---------------- */
  const notesOf = c => C.voiceNotes(c.notes);
  const notesNow = () => notesOf(col());
  const snap = () => JSON.stringify({ cur: F.cur, n: F.cols.map(c => c.notes) });
  function restore(str) {
    const v = JSON.parse(str);
    v.n.forEach((n, i) => { if (F.cols[i]) F.cols[i].notes = n; });
    F.cur = Math.max(0, Math.min(v.cur, F.cols.length - 1));
    F.sel = null;
  }
  function change(next, selMidi) {
    const v = C.cleanVoice(next);
    if (!v) return false;
    F.hist.push(snap());
    if (F.hist.length > 100) F.hist.shift();
    F.fut = [];
    col().notes = v;
    if (selMidi !== undefined) { const i = notesNow().findIndex(n => n.midi === selMidi); F.sel = i < 0 ? null : i; }
    return true;
  }
  const inChord = m => col().tones.some(t => t.pc === pcRel(m));
  function move(dir, octave) {
    const ns = notesNow();
    if (F.sel === null || !ns[F.sel]) { F.sel = dir > 0 ? ns.length - 1 : 0; redraw(); return; }
    const n = ns[F.sel];
    const taken = new Set(ns.map(x => x.midi));
    let to = null;
    if (F.locked) {
      for (let m = n.midi + dir; m >= LO && m <= HI; m += dir) if (inChord(m) && !taken.has(m)) { to = m; break; }
    } else if (octave) {
      const m = n.midi + 12 * dir;
      if (m >= LO && m <= HI && !taken.has(m)) to = m;
    } else {
      let m = n.midi + dir;
      while (taken.has(m)) m += dir;
      if (m >= LO && m <= HI) to = m;
    }
    if (to === null) { nudge(); return; }
    const pair = octave && !F.locked ? [n.step + 7 * dir, n.semi + 12 * dir] : C.spellMidi(to, dir, col().tones);
    const next = col().notes.slice();
    next[F.sel] = pair;
    if (change(next, to)) { hear(); redraw(); }
  }
  function addAt(pair) {
    const m = t0() + pair[1];
    if (m < LO || m > HI || notesNow().some(n => n.midi === m)) return;
    if (col().notes.length >= 8) { ui.toast('A chord here holds up to eight notes'); return; }
    if (change(col().notes.concat([pair]), m)) { hear(); redraw(); }
  }
  function removeSel() {
    if (F.sel === null) return;
    if (col().notes.length <= 2) { ui.toast('A chord keeps at least two notes'); nudge(); return; }
    const next = col().notes.slice();
    next.splice(F.sel, 1);
    if (change(next)) { F.sel = null; hear(); redraw(); }
  }
  function setAcc(a) {
    if (F.sel === null || F.locked) return;
    const n = notesNow()[F.sel];
    const pair = C.pairOf(n.d, a), m = t0() + pair[1];
    if (m < LO || m > HI || notesNow().some((x, i) => i !== F.sel && x.midi === m)) { nudge(); return; }
    const next = col().notes.slice();
    next[F.sel] = pair;
    if (change(next, m)) { hear(); redraw(); }
  }
  /* the chord changed is the one tapped */
  function toCol(ci) { if (ci >= 0 && ci < F.cols.length && ci !== F.cur) { F.cur = ci; F.sel = null; } }
  function select(i) { F.sel = i; const n = notesNow()[i]; if (n) SW.audio.playChordFrequencies([M.midiToFreq(n.midi)], undefined, 0.5); redraw(); }
  function undo() { if (!F || !F.hist.length) return; F.fut.push(snap()); restore(F.hist.pop()); hear(); redraw(); }
  function redo() { if (!F || !F.fut.length) return; F.hist.push(snap()); restore(F.fut.pop()); hear(); redraw(); }
  function nudge() { const s = bodyEl.querySelector('.fx-staff'); if (s) { s.classList.remove('nudge'); void s.offsetWidth; s.classList.add('nudge'); } }

  /* ---------------- sound ---------------- */
  const freqsOf = c => notesOf(c).map(n => M.midiToFreq(n.midi));
  function hear() { SW.audio.playChordFrequencies(freqsOf(col())); }
  let held = null;
  function holdOn() { holdOff(); held = SW.audio.holdChord(freqsOf(col())); }
  function holdOff() { if (held) { held.release(); held = null; } }
  /* comparing: each chord in turn, two beats each (its name lights while it sounds) */
  let orderTimers = [];
  function inOrder() {
    orderTimers.forEach(clearTimeout);
    orderTimers = [];
    const mt = SW.meters.byId(S.meter);
    const len = Math.max(0.6, Math.min(1.5, SW.timing.tickMs() / 1000 * mt.beatTicks * 2));
    const now = SW.audio.now() + 0.05;
    const light = ci => bodyEl.querySelectorAll('.fx-col').forEach((b, i) => b.classList.toggle('sounding', i === ci));
    F.cols.forEach((c, i) => {
      SW.audio.playChordFrequencies(freqsOf(c), now + i * len, len * 0.92);
      orderTimers.push(setTimeout(() => light(i), 50 + i * len * 1000));
    });
    orderTimers.push(setTimeout(() => light(-1), 50 + F.cols.length * len * 1000));
  }
  function inSong() {
    if (F.spot === null) return;
    if (SW.player.playing) { SW.player.stop(); return; }
    const g = T.grid();
    const a = Math.max(0, g.T(g.barAt(F.spot) - 1)), z = g.T(g.barAt(F.spotEnd - 1) + 2);
    // every chord here as it is now: the one gone into at its spot (and its card's), the others by their cards
    const preview = F.cols.map(c => (c.main ? { k: c.k, at: F.spot, voice: c.notes } : { k: c.k, voice: c.notes }));
    if (F.hooks && F.hooks.play) { F.hooks.play(a, z, preview); return; }
    SW.player.playFrom(a, { loop: [a, z], once: true, countIn: false, beat: false, preview });
  }
  SW.bus.on('play:changed', () => { const b = footEl.querySelector('[data-fx="in-song"]'); if (b) b.classList.toggle('on', !!SW.player.playing); });

  /* ---------------- the grand staff ----------------
     Steps (d) as staff.js counts them: C4 = 28. Middle C and up on the
     treble, the rest on the bass. Leland's glyphs: 360 units a space. */
  const SP = 14;                                    // a staff space, in the drawing's units
  const KS = SP / 360;
  const TOP = 46;                                   // the treble's top line (F5, step 38)
  const yT = d => TOP + (38 - d) * SP / 2;
  const BTOP = yT(30) + 5.5 * SP;                   // the bass's top line (A3, step 26)
  const yB = d => BTOP + (26 - d) * SP / 2;
  const onTreble = d => d >= 28;
  const yOf = d => (onTreble(d) ? yT(d) : yB(d));
  const SIG_STEPS = { 1: { F: 38, C: 35, G: 39, D: 36, A: 33, E: 37, B: 34 }, '-1': { B: 34, E: 37, A: 33, D: 36, G: 32, C: 35, F: 31 } };
  const ACC_GLYPH = { '-2': 'accidentalDoubleFlat', '-1': 'accidentalFlat', 0: 'accidentalNatural', 1: 'accidentalSharp', 2: 'accidentalDoubleSharp' };
  const INK = '#2B1D38', SEL = '#F08A00', GHOST = '#9C168E', DIM = '#8C7E9C', BAR = '#CDBFD9';
  const NW = 537 * KS;                              // a whole note's width
  const CW = 180;                                   // comparing: from one chord to the next
  const PX = 560 / 386;                             // px a unit, as one chord in C major has always been drawn (560 px)
  function glyph(name, x, y, fill, extra) {
    const g = G && G[name];
    if (!g) return '';
    return '<path ' + (extra || '') + ' fill="' + fill + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + KS.toFixed(5) + ')" d="' + g.d + '"/>';
  }
  function ledgers(d, x, w, col) {
    const L = dd => '<line x1="' + (x - 6) + '" x2="' + (x + w + 6) + '" y1="' + yOf(dd).toFixed(1) + '" y2="' + yOf(dd).toFixed(1) + '" stroke="' + col + '" stroke-width="1.6"/>';
    let s = '';
    if (onTreble(d)) { if (d <= 28) s += L(28); for (let dd = 40; dd <= d; dd += 2) s += L(dd); }
    else for (let dd = 16; dd >= d; dd -= 2) s += L(dd);
    return s;
  }
  const keySig = () => (SW.staff && SW.staff.keySignature ? SW.staff.keySignature(SW.music.keyNow(), C.scaleId()) : { sig: {}, order: [], kind: 0 });
  /* → { svg, W, xs } — xs: each chord's column (where its noteheads start) */
  function staffSvg() {
    const key = keySig();
    const sig = key.sig || {};
    const X0 = 50, KX = X0 + 54;                          // the clefs; the signature (clear of the clef)
    const NX0 = KX + key.order.length * 12 + 74;          // the first chord's column
    const xs = F.cols.map((c, ci) => NX0 + ci * CW);
    const RIGHT = xs[xs.length - 1] + 190, W = RIGHT + 18, H = Math.round(yB(14) + 22);
    let s = '<svg class="fx-staff" id="fx-staff" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (many() ? 'The chords' : 'The chord') + ' on a treble and a bass staff">';
    s += '<rect class="fx-hit" data-staff="1" x="0" y="0" width="' + W + '" height="' + H + '"/>';
    // comparing: a soft band behind the chord being changed
    if (many()) s += '<rect class="fx-band" x="' + (xs[F.cur] - 30).toFixed(1) + '" y="' + (TOP - 34) + '" width="' + (NW + 150).toFixed(1) + '" height="' + (BTOP + 4 * SP - TOP + 68) + '" rx="14" pointer-events="none"/>';
    s += '<g pointer-events="none">';
    for (let i = 0; i < 5; i++) {
      s += '<line x1="' + X0 + '" x2="' + RIGHT + '" y1="' + (TOP + i * SP) + '" y2="' + (TOP + i * SP) + '" stroke="' + INK + '" stroke-width="1.3"/>';
      s += '<line x1="' + X0 + '" x2="' + RIGHT + '" y1="' + (BTOP + i * SP) + '" y2="' + (BTOP + i * SP) + '" stroke="' + INK + '" stroke-width="1.3"/>';
    }
    s += '<line x1="' + X0 + '" x2="' + X0 + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<line x1="' + RIGHT + '" x2="' + RIGHT + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + INK + '" stroke-width="1.5"/>';
    // a light bar line between the chords compared
    for (let ci = 0; ci + 1 < xs.length; ci++) s += '<line x1="' + (xs[ci] + CW - 40) + '" x2="' + (xs[ci] + CW - 40) + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + BAR + '" stroke-width="1.3"/>';
    // the brace
    const bt = TOP, bb = BTOP + 4 * SP, bm = (bt + bb) / 2, bx = X0 - 7;
    s += '<path fill="' + INK + '" d="M' + bx + ' ' + bt + ' C' + (bx - 13) + ' ' + (bt + 16) + ' ' + (bx - 3) + ' ' + (bm - 28) + ' ' + (bx - 11) + ' ' + bm +
      ' C' + (bx - 3) + ' ' + (bm + 28) + ' ' + (bx - 13) + ' ' + (bb - 16) + ' ' + bx + ' ' + bb + ' C' + (bx - 8) + ' ' + (bb - 20) + ' ' + bx + ' ' + (bm + 24) + ' ' + (bx - 8) + ' ' + bm +
      ' C' + bx + ' ' + (bm - 24) + ' ' + (bx - 8) + ' ' + (bt + 20) + ' ' + bx + ' ' + bt + 'Z"/>';
    s += glyph('gClef', X0 + 6, yT(32), INK) + glyph('fClef', X0 + 6, yB(24), INK);
    // the key signature, on both staves
    key.order.forEach((L, i) => {
      const st = SIG_STEPS[key.kind][L];
      const gname = key.kind > 0 ? 'accidentalSharp' : 'accidentalFlat';
      s += glyph(gname, KX + i * 12, yT(st), INK) + glyph(gname, KX + i * 12, yB(st - 14), INK);
    });
    s += '</g>';
    F.cols.forEach((c, ci) => { s += chordSvg(c, ci, xs[ci], sig); });
    // the selected note's arrows, and ×
    const ns = notesNow();
    if (F.sel !== null && ns[F.sel]) {
      const y = yOf(ns[F.sel].d), x = xs[F.cur] + NW + 52;
      const btn = (data, cy, path, r) => '<g class="fx-btn" ' + data + '><circle cx="' + x + '" cy="' + cy + '" r="' + (r || 17) + '"/><path d="' + path + '"/></g>';
      s += btn('data-move="1"', y - 21, 'M' + (x - 6) + ' ' + (y - 18) + ' l6 -6 l6 6');
      s += btn('data-move="-1"', y + 21, 'M' + (x - 6) + ' ' + (y + 18) + ' l6 6 l6 -6');
      s += '<g class="fx-btn fx-x" data-fx="remove"><circle cx="' + (x + 44) + '" cy="' + y + '" r="14"/><path d="M' + (x + 39) + ' ' + (y - 5) + ' l10 10 M' + (x + 49) + ' ' + (y - 5) + ' l-10 10"/></g>';
    }
    return { svg: s + '</svg>', W, xs };
  }
  /* one chord's column: its ghosts (the one being changed, locked), its notes */
  function chordSvg(c, ci, NX, sig) {
    const cur = ci === F.cur;
    const ns = notesOf(c);
    let s = '';
    // a note a step above the one below it sits to the right
    let lastD = null, shifted = false;
    const xs = ns.map(n => { const sh = lastD !== null && n.d - lastD === 1 && !shifted; shifted = sh; lastD = n.d; return sh ? NX + NW + 1 : NX; });
    // the ghosts (locked): every place the chord's notes may go
    if (cur && F.locked) {
      const taken = new Set(ns.map(n => n.midi));
      for (let m = LO; m <= HI; m++) {
        if (!inChord(m) || taken.has(m)) continue;
        const [step, semi] = C.spellMidi(m, 1, c.tones);
        const g = C.voiceNotes([[step, semi]])[0];
        const x = ns.some(n => Math.abs(n.d - g.d) === 1) ? NX + NW + 1 : NX, y = yOf(g.d);
        const showAcc = g.acc !== (sig[g.letter] || 0);
        s += '<g class="fx-ghost" data-ghost="' + step + ',' + semi + '"><g pointer-events="none">' + ledgers(g.d, x, NW, '#E3D8EA') + '</g>' +
          '<rect x="' + (x - 6) + '" y="' + (y - SP / 2) + '" width="' + (NW + 12) + '" height="' + SP + '" fill="transparent"/>' +
          glyph('noteheadWhole', x, y, GHOST, 'fill-opacity=".2" pointer-events="none"') +
          (showAcc ? glyph(ACC_GLYPH[g.acc], x - 15, y, GHOST, 'fill-opacity=".2" pointer-events="none"') : '') + '</g>';
      }
    }
    // the chord
    let accCol = 0, lastAccD = null;
    ns.forEach((n, i) => {
      const x = xs[i], y = yOf(n.d), col = cur && F.sel === i ? SEL : cur || !many() ? INK : DIM;
      s += '<g class="fx-note' + (cur && F.sel === i ? ' sel' : '') + '" data-note="' + ci + ',' + i + '"><g pointer-events="none">' + ledgers(n.d, x, NW, col) + '</g>' +
        '<rect x="' + (x - 6) + '" y="' + (y - SP / 1.6) + '" width="' + (NW + 12) + '" height="' + (SP * 1.25) + '" fill="transparent"/>' +
        glyph('noteheadWhole', x, y, col, 'pointer-events="none"');
      if (n.acc !== (sig[n.letter] || 0)) {
        accCol = lastAccD !== null && n.d - lastAccD < 6 ? accCol + 1 : 0;
        lastAccD = n.d;
        s += glyph(ACC_GLYPH[n.acc], NX - 16 - accCol * 13, y, col, 'pointer-events="none"');
      }
      s += '</g>';
    });
    return s;
  }
  /* comparing: each chord's name over its notes — a tap makes it the one being changed */
  function colsHtml(st) {
    return '<div class="fx-cols">' + F.cols.map((c, ci) => {
      const d = C.describeVoiced(c.chord, c.notes);
      const nv = F.isNew && c.main ? C.nameVoice(c.notes) : null;
      const color = C.describe(nv && !nv.unnamed ? nv.id : c.chord).color;
      return '<button type="button" class="fx-col' + (ci === F.cur ? ' cur' : '') + (c.main ? ' main' : ' gold') + (dirtyCol(c) ? ' changed' : '') + '" data-col="' + ci + '"' +
        ' style="left:' + ((st.xs[ci] + NW / 2) / st.W * 100).toFixed(2) + '%;--c:' + color + ';--cink:' + SW.chordStrip.inkOn(color) + '"' +
        ' title="' + (ci === F.cur ? 'The chord being changed' : 'Change this chord') + (c.main ? '' : ' — shown here by its gold toggle') + '">' +
        '<span class="fx-cname' + (d.unnamed ? ' notes' : '') + '">' + C.labelHTML(C.nameOf(d)) + '</span>' + (dirtyCol(c) ? '<i class="fx-cdot" aria-label="changed"></i>' : '') + '</button>';
    }).join('') + '</div>';
  }
  /* the keyboard: C2 … C6, the chord's notes lit in their letters' colours */
  function keysHtml() {
    const lit = new Map(notesNow().map(n => [n.midi, n]));
    const whites = [], blacks = [];
    const nW = 29;
    let wi = 0;
    for (let m = LO; m <= HI; m++) {
      const white = [0, 2, 4, 5, 7, 9, 11].indexOf(((m % 12) + 12) % 12) !== -1;
      const n = lit.get(m), dot = F.locked && !n && inChord(m);
      const inner = (n ? '<span class="fx-kname">' + esc(n.name) + '</span>' : '') + (dot ? '<i class="fx-kdot"></i>' : '');
      const col = n ? M.LETTER_COLORS[n.letter] || '#9C168E' : '';
      if (white) { whites.push('<button type="button" class="fx-wk' + (n ? ' lit' : '') + '" data-key="' + m + '" style="--kc:' + col + '" tabindex="-1" aria-label="' + (n ? n.name : 'key') + '">' + inner + (m % 12 === 0 ? '<b class="fx-c">C' + (Math.floor(m / 12) - 1) + '</b>' : '') + '</button>'); wi++; }
      else blacks.push('<button type="button" class="fx-bk' + (n ? ' lit' : '') + '" data-key="' + m + '" style="left:calc(' + (wi / nW * 100) + '% - ' + (100 / nW * 0.31).toFixed(3) + '%);width:' + (100 / nW * 0.62).toFixed(3) + '%;--kc:' + col + '" tabindex="-1" aria-label="key">' + inner + '</button>');
    }
    return '<div class="fx-keys" id="fx-keys">' + whites.join('') + blacks.join('') + '</div>';
  }
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const ICON_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const ICON_LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
  const ICON_OPEN = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7"/></svg>';
  const backLabel = () => (F.origin === 'song' ? 'Time Line' : F.origin === 'music' ? 'The music' : 'Chord Chart');
  function render(body, foot) {
    if (!F) { body.innerHTML = '<p class="fx-none">No chord here</p>'; foot.innerHTML = ''; return; }
    const c = col();
    if (F.sel !== null && F.sel >= c.notes.length) F.sel = null;
    const d = C.describeVoiced(c.chord, c.notes);
    const big = C.labelHTML(C.nameOf(d)), small = d.unnamed ? '' : C.labelHTML(C.otherNameOf(d));
    const nv = F.isNew && c.main ? C.nameVoice(c.notes) : null;           // Create Chord: the colour of the chord being built
    const color = C.describe(nv && !nv.unnamed ? nv.id : c.chord).color;
    const selN = F.sel !== null ? notesNow()[F.sel] : null;
    const st = staffSvg();
    const width = many() ? Math.round(st.W * PX) : 560;          // comparing: wider, at one chord's scale (as far as the window allows)
    body.innerHTML =
      '<div class="fx-head">' +
        '<button type="button" class="fx-back" data-fx="back">' + ICON_BACK + esc(backLabel()) + '</button>' +
        '<span class="fx-chip" style="--c:' + color + '" aria-hidden="true"></span>' +
        '<div class="fx-name"><span class="fx-big' + (d.unnamed ? ' notes' : '') + '">' + big + '</span>' + (small ? '<span class="fx-small">' + small + '</span>' : '') + '</div>' +
        (many() ? '<span class="fx-comparing">Comparing ' + F.cols.length + ' chords</span>' : '') +
        '<div class="fx-lock seg" role="group" aria-label="Chord notes only, or any note">' +
          '<button type="button" class="seg-btn' + (F.locked ? ' active' : '') + '" data-lock="1" aria-pressed="' + F.locked + '">' + ICON_LOCK + '<span>Chord notes</span></button>' +
          '<button type="button" class="seg-btn' + (F.locked ? '' : ' active') + '" data-lock="0" aria-pressed="' + !F.locked + '">' + ICON_OPEN + '<span>Any note</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="fx-main"><div class="fx-stage' + (many() ? ' many' : '') + '" style="width:min(' + width + 'px, 100%)">' + (many() ? colsHtml(st) : '') + st.svg + '</div>' + keysHtml() + '</div>';
    const accs = !F.locked && selN ? '<span class="fx-accs" role="group" aria-label="Accidental">' +
      [[-1, '♭'], [0, '♮'], [1, '♯']].map(([a, t]) => '<button type="button" class="fx-acc' + (selN.acc === a ? ' on' : '') + '" data-acc="' + a + '">' + t + '</button>').join('') + '</span>' : '';
    let saves;
    if (many()) saves = '<button type="button" class="btn" data-fx="decide">Let me Decide</button><button type="button" class="btn btn-primary" data-fx="save">Save All</button>';
    else if (F.isNew) saves = '<button type="button" class="btn btn-primary" data-fx="save-new">Put it on the chart</button>';
    else saves = '<button type="button" class="btn" data-fx="save-new">Save as New</button><button type="button" class="btn btn-primary" data-fx="save">Save to Chord Chart</button>';
    foot.innerHTML =
      '<button type="button" class="fx-hear" data-fx="hear" title="Hear it — hold to keep it ringing (Space)" aria-label="Hear it">' + ICON_PLAY + '</button>' +
      (many() ? '<button type="button" class="btn fx-inorder" data-fx="in-order" title="Every chord here, one after another">' + ICON_PLAY + 'In order</button>' : '') +
      (F.spot !== null ? '<button type="button" class="btn fx-insong' + (SW.player.playing ? ' on' : '') + '" data-fx="in-song">' + ICON_PLAY + 'In the song</button>' : '') +
      accs + '<span class="pw-gap"></span>' + saves;
  }
  function redraw() { if (SW.progWin && SW.progWin.isOpen()) SW.progWin.render(); }

  /* ---------------- coming out ---------------- */
  /* where Focus was opened from: the chart, the Time Line, or the music (the window closes) */
  function goBack(origin) {
    const o = origin || (F ? F.origin : 'chart');
    F = null;
    if (o === 'music') { ui.closeSheet('prog-sheet', true); return; }
    SW.progWin.setTab(o === 'song' ? 'song' : 'chart');
  }
  const tidy = (chord, notes) => { const eng = C.voiceOf(chord); return eng && JSON.stringify(eng) === JSON.stringify(notes) ? null : clone(notes); };
  const rhythmFrom = e => { const o = {}; if (e) ['rhythm', 'arp', 'by'].forEach(f => { if (e[f]) o[f] = e[f]; }); return o; };
  /* the chord gone into — Save: its card's notes, everywhere it is in the song (Y2); no card: a new one (that spot takes it) */
  function saveMain(c) {
    let k = c.k;
    if (!dirtyCol(c)) return k;
    if (k) T.chartSet(k, { voice: tidy(c.chord, c.notes) });
    else if (F.hooks) { k = T.chartAdd({ chord: c.chord, place: c.place, voice: tidy(c.chord, c.notes) }); if (k) F.hooks.swap(k); }
    else k = T.chartAdd({ chord: c.chord, place: c.place, voice: tidy(c.chord, c.notes) }, undefined, F.spot === null ? undefined : F.spot);
    return k;
  }
  /* … Save as New: a card of its own, right after the one it came from (its rhythm too); from the song, that spot alone takes it */
  function saveNewMain(c) {
    const named = C.nameVoice(c.notes);
    const chord = F.isNew && !named.unnamed ? named.id : c.chord;
    const cards = cardsNow();
    const i = c.k ? cards.findIndex(x => x.id === c.k) : -1;
    const before = i >= 0 && cards[i + 1] ? cards[i + 1].id : undefined;
    const spot = !F.isNew && F.spot !== null && !F.hooks ? F.spot : undefined;      // the draft's spot: the Time Line swaps it (hooks)
    const k = T.chartAdd(Object.assign({ chord, place: F.isNew ? undefined : c.place, voice: tidy(chord, c.notes) }, rhythmFrom(i >= 0 ? cards[i] : null)), before, spot);
    if (k && F.hooks) F.hooks.swap(k);
    return k;
  }
  /* a gold chord: Save — its card's notes everywhere; Save as New — a card of its own beside it */
  function saveCol(c, how) {
    if (c.main) return F.isNew || how === 'new' ? saveNewMain(c) : saveMain(c);
    if (!dirtyCol(c)) return c.k;
    if (how !== 'new') { T.chartSet(c.k, { voice: tidy(c.chord, c.notes) }); return c.k; }
    const cards = cardsNow();
    const i = cards.findIndex(x => x.id === c.k);
    return T.chartAdd(Object.assign({ chord: c.chord, place: c.place, voice: tidy(c.chord, c.notes) }, rhythmFrom(cards[i])), i >= 0 && cards[i + 1] ? cards[i + 1].id : undefined);
  }
  /* every chord here, each as `how(c)` says — one Undo step — then back (or `then`) */
  function saveEach(how, then) {
    const o = F.origin;
    let k = null;
    T.batch(() => F.cols.forEach((c, i) => { const id = saveCol(c, how(c, i)); if (c.main) k = id; }));
    if (SW.chordChart && k) SW.chordChart.select(k);
    (then || (() => goBack(o)))();
  }
  /* Save to Chord Chart (one chord) · Save All (comparing) — Create Chord: on the chart */
  function save(then) { saveEach(() => 'save', then); }
  /* Save as New: the chord gone into gets a card of its own (comparing: the others are saved) */
  function saveNew(then) { saveEach(c => (c.main ? 'new' : 'save'), then); }
  /* Let me Decide (comparing): Save or Save as New for each chord that changed */
  function decide(then) {
    const list = F.cols.map((c, i) => ({ c, i })).filter(x => dirtyCol(x.c) || (x.c.main && F.isNew));
    if (!list.length) { save(then); return; }
    const pick = {};
    list.forEach(x => { pick[x.i] = x.c.main && F.isNew ? 'new' : 'save'; });
    const row = x => {
      const d = C.describeVoiced(x.c.chord, x.c.notes);
      const nv = F.isNew && x.c.main ? C.nameVoice(x.c.notes) : null;
      const color = C.describe(nv && !nv.unnamed ? nv.id : x.c.chord).color;
      return '<div class="fx-drow" data-di="' + x.i + '"><span class="fx-dchip" style="--c:' + color + ';--cink:' + SW.chordStrip.inkOn(color) + '">' + C.labelHTML(C.nameOf(d)) + '</span>' +
        (F.isNew && x.c.main ? '<span class="fx-dnew">A new chord — it goes on the chart</span>'
          : '<div class="seg fx-dseg" role="group" aria-label="How to save it">' +
              '<button type="button" class="seg-btn active" data-dpick="save" aria-pressed="true">Save</button>' +
              '<button type="button" class="seg-btn" data-dpick="new" aria-pressed="false">Save as New</button></div>') + '</div>';
    };
    SW.chordChart.ask({
      title: 'How should each chord be saved?',
      wide: true,
      body: list.map(row).join('') + '<p class="fx-dsay"><b>Save</b> changes the chord on the chart and everywhere the song plays it. <b>Save as New</b> puts a card of its own beside it' +
        (F.spot !== null ? ' (the chord you opened: just that spot in the song takes it)' : '') + '.</p>',
      onClick: e => {
        const b = e.target.closest('[data-dpick]');
        if (!b) return;
        const r = b.closest('[data-di]');
        pick[r.dataset.di] = b.dataset.dpick;
        r.querySelectorAll('[data-dpick]').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', x === b); });
      },
      buttons: [{ label: 'Save them', primary: true, act: () => saveEach((c, i) => pick[i] || 'save', then) }]
    });
  }
  /* any other way out: with changes, the question first (D12) */
  function leave(then) {
    const o = F.origin;
    const go = then || (() => goBack(o));
    if (!dirty()) { if (then) F = null; go(); return; }
    const done = () => { F = null; go(); };
    const after = fn => () => { fn(done); };
    if (many()) {
      SW.chordChart.ask({
        title: 'Save your changes to these chords?',
        buttons: [{ label: 'Save All', primary: true, act: after(save) }, { label: 'Let me Decide', act: () => decide(done) }, { label: 'Don’t save', act: done }]
      });
      return;
    }
    const c = mainCol();
    const was = C.nameOf(C.describeVoiced(c.chord, JSON.parse(c.orig)));
    SW.chordChart.ask(F.isNew ? {
      title: 'Put this chord on the chart?',
      buttons: [{ label: 'Put it on the chart', primary: true, act: after(saveNew) }, { label: 'Don’t', act: done }]
    } : {
      title: 'Save your changes to ' + C.labelHTML(was) + '?',
      buttons: [{ label: 'Save', primary: true, act: after(save) }, { label: 'Save as New', act: after(saveNew) }, { label: 'Don’t save', act: done }]
    });
  }
  // the window's ways out (×, a tap outside, Esc) come here through progression-window.js's guard
  function closed() { holdOff(); orderTimers.forEach(clearTimeout); orderTimers = []; F = null; }

  /* ---------------- gestures ---------------- */
  const active = () => !!F && SW.progWin && SW.progWin.isOpen() && SW.progWin.tab() === 'focus';
  function stepAt(clientY) {
    const svg = bodyEl.querySelector('#fx-staff');
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const y = (clientY - r.top) / r.height * vb.height;
    const mid = (yT(28) + yB(26)) / 2;
    const d = y < mid ? Math.round(38 - (y - TOP) / (SP / 2)) : Math.round(26 - (y - BTOP) / (SP / 2));
    return Math.max(14, Math.min(42, d));
  }
  /* the chord nearest a tap on the staff (comparing) */
  function colAt(clientX) {
    if (!many()) return F.cur;
    const svg = bodyEl.querySelector('#fx-staff');
    const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const x = (clientX - r.left) / r.width * vb.width;
    const st = staffSvg();
    let best = 0;
    st.xs.forEach((cx, i) => { if (Math.abs(cx + NW / 2 - x) < Math.abs(st.xs[best] + NW / 2 - x)) best = i; });
    return best;
  }
  bodyEl.addEventListener('click', e => {
    if (!active()) return;
    const t = e.target;
    const b = t.closest('[data-fx], [data-lock], [data-move], [data-note], [data-ghost], [data-key], [data-staff], [data-col]');
    if (!b) return;
    if (b.dataset.fx === 'back') { leave(); return; }
    if (b.dataset.fx === 'remove') { removeSel(); return; }
    if (b.dataset.lock !== undefined) { F.locked = b.dataset.lock === '1'; redraw(); return; }
    if (b.dataset.col !== undefined) { toCol(Number(b.dataset.col)); hear(); redraw(); return; }
    if (b.dataset.move !== undefined) { move(Number(b.dataset.move), false); return; }
    if (b.dataset.note !== undefined) { const [ci, i] = b.dataset.note.split(',').map(Number); toCol(ci); select(i); return; }
    if (b.dataset.ghost !== undefined) { addAt(b.dataset.ghost.split(',').map(Number)); return; }
    if (b.dataset.key !== undefined) {
      const m = Number(b.dataset.key);
      const i = notesNow().findIndex(n => n.midi === m);
      if (i >= 0) { select(i); return; }
      if (F.locked && !inChord(m)) { ui.toast('Locked to the chord’s own notes — unlock for any note'); nudge(); return; }
      addAt(C.spellMidi(m, 1, col().tones));
      return;
    }
    if (b.dataset.staff !== undefined) {
      const ci = colAt(e.clientX);
      if (ci !== F.cur) { toCol(ci); hear(); redraw(); return; }     // comparing: a tap by another chord makes it the one changed
      if (F.locked) { F.sel = null; redraw(); return; }       // locked: a new note goes on a ghost
      const d = stepAt(e.clientY);
      addAt(C.pairOf(d, keySig().sig['CDEFGAB'[((d % 7) + 7) % 7]] || 0));
    }
  });
  bodyEl.addEventListener('contextmenu', e => { if (active() && e.target.closest('.fx-keys, .fx-staff')) e.preventDefault(); });
  footEl.addEventListener('pointerdown', e => {
    if (!active() || !e.target.closest('[data-fx="hear"]')) return;
    e.preventDefault();
    holdOn();
  });
  window.addEventListener('pointerup', holdOff);
  window.addEventListener('pointercancel', holdOff);
  footEl.addEventListener('click', e => {
    if (!active()) return;
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.acc !== undefined) { setAcc(Number(b.dataset.acc)); return; }
    if (b.dataset.fx === 'in-song') { inSong(); return; }
    if (b.dataset.fx === 'in-order') { inOrder(); return; }
    if (b.dataset.fx === 'save') { save(); return; }
    if (b.dataset.fx === 'save-new') { saveNew(); return; }
    if (b.dataset.fx === 'decide') { decide(); return; }
  });

  /* ---------------- keys (the window hands them over while Focus is open) ---------------- */
  function keyDown(e) {
    if (!F) return true;
    if (e.metaKey || e.ctrlKey) return false;
    const k = e.key || '';
    switch (k) {
      case 'ArrowUp': case 'ArrowDown': e.preventDefault(); move(k === 'ArrowUp' ? 1 : -1, e.shiftKey); return true;
      case 'ArrowLeft': case 'ArrowRight': {
        e.preventDefault();
        const dir = k === 'ArrowLeft' ? -1 : 1, n = col().notes.length;
        if (F.sel === null) { select(dir < 0 ? 0 : n - 1); return true; }
        let i = F.sel + dir;
        // past the last note: on into the chord beside it
        if (i < 0 && F.cur > 0) { toCol(F.cur - 1); i = col().notes.length - 1; }
        else if (i >= n && F.cur < F.cols.length - 1) { toCol(F.cur + 1); i = 0; }
        select(Math.max(0, Math.min(col().notes.length - 1, i)));
        return true;
      }
      case 'Delete': case 'Backspace': e.preventDefault(); removeSel(); return true;
      case ' ': e.preventDefault(); if (!e.repeat) hear(); return true;
      case 'Enter': e.preventDefault(); save(); return true;
    }
    return true;                 // the melody keys are quiet in here
  }

  SW.chordFocus = {
    openCard, atSpot, atDraft, openNew, render, keyDown, dirty, leave, closed, origin: () => (F ? F.origin : null),
    undo, redo, canUndo: () => !!F && F.hist.length > 0, canRedo: () => !!F && F.fut.length > 0, isOpen: () => !!F,
    columns: () => (F ? F.cols.map(c => ({ k: c.k, chord: c.chord, notes: clone(c.notes), main: c.main, changed: dirtyCol(c) })) : [])
  };
})();

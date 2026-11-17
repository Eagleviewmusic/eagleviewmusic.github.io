/* ==========================================================================
   COMPONENT — chords' notes on a grand staff (2026-11-16)       SW.chordNotes
   --------------------------------------------------------------------------
   What the chord editor (chord-focus.js) and Compare (chord-compare.js)
   share: one or more chords on a treble and a bass staff, in the song's
   key signature, a keyboard under them, and the ways a note is changed.
   (Until 2026-11-16 this was inside chord-focus.js, where Focus also
   compared the gold chords.)

   The user (2026-11-16): "don't show shadow notes (of other possible
   options) unless a note in that chord is highlighted — visually, it's
   confusing". So:
     • a tap on a note selects it (orange) — a tap on it again lets go;
       then, and only then, the ghosts show: every place the chord's notes
       (as they were when it was picked) may go, faint, with a dot on
       their keys
     • ↑ ↓ move it — along the KEY (the scale's notes, and the chord's own
       even when the scale has not got them) or CHROMATIC (half steps),
       the switch every page shows ("Key · Chromatic", remembered: View
       pref chordMove); ⇧↑ ⇧↓ an octave either way; it may rest on a ghost
     • a tap on the staff — a ghost, or any line or space — PUTS the
       selected note there (the user's choice: pick it up, put it down);
       with nothing selected a tap ADDS a note there (it is then the one
       selected). A line or space takes the ghost's spelling there, else a
       chord note's on that letter, else the key signature's
     • ← → the note below / above (comparing: on into the chord beside it);
       Delete takes it out (a chord keeps two); ♭ ♮ ♯ (Chromatic) respell
       it; Esc lets go of it
     • the keyboard: a lit key selects its note; another key puts the
       selected note there, or adds one (Key: the scale's and the chord's
       notes only)
   Every change can be undone (↶ ↷ / ⌘Z), all the chords' together.

   API  SW.chordNotes.create({ cols, cur, onChange }) → an editor:
          cols · cur() · col() · notes(c?) · dirtyCol(c) · dirty() · change(next, selMidi, why) · select(i) ·
          deselect() · toCol(ci) · move(dir, octave) · removeSel() · setAcc(a) · undo() · redo() · canUndo() ·
          canRedo() · staff({ many }) → { svg, W, xs } · keysHtml() · click(target, event) · keyDown(e) ·
          hear() · freqs(c) · moveBarHtml() · isKey()
        SW.chordNotes.mode() · setMode('key' | 'chromatic') · LO · HI · onLetter(midi, letter) · pcRel(midi) ·
        rootOf(chordId) · scalePcs()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const C = SW.chords;
  const M = SW.music;
  const ui = SW.ui;
  const G = (typeof GLYPHS_LELAND !== 'undefined') ? GLYPHS_LELAND : null;
  if (!C) return;
  const esc = C.escapeHtml;

  const LO = 36, HI = 84;                     // C2 … C6: the notes a chord may take here
  const NATPC = [0, 2, 4, 5, 7, 9, 11];
  const LETTERS = 'CDEFGAB';
  const natMidi = d => 12 * (Math.floor(d / 7) + 1) + NATPC[((d % 7) + 7) % 7];
  const t0 = () => C.voiceMidis([[0, 0]])[0];                 // the tonic's MIDI (a voice's 0)
  const pcRel = m => ((m - t0()) % 12 + 12) % 12;
  const scalePcs = () => new Set(C.scale().degrees.map(d => Theory.degreeSemis(d)));
  /* a MIDI note written on a letter → [step, semi] (null: more than a double accidental away) */
  function onLetter(m, letter) {
    const L = LETTERS.indexOf(letter);
    for (let oct = Math.floor(m / 12) - 2; oct <= Math.floor(m / 12); oct++) {
      const d = oct * 7 + L, acc = m - natMidi(d);
      if (acc >= -2 && acc <= 2) return C.pairOf(d, acc);
    }
    return null;
  }
  /* a chord's root: its pitch (above the tonic) and its letter */
  function rootOf(id) {
    const d = C.describe(id);
    const t = d.tones && d.tones[0];
    return t ? { pc: t.pc, letter: t.letter } : { pc: 0, letter: (M.spelledKey() || 'C')[0] };
  }

  /* KEY · CHROMATIC — remembered (View pref chordMove) */
  const mode = () => (SW.settings.view.chordMove === 'chromatic' ? 'chromatic' : 'key');
  function setMode(m) { SW.settings.setView({ chordMove: m === 'chromatic' ? 'chromatic' : 'key' }, { quiet: true }); }

  /* ---------------- the grand staff: steps (d) as staff.js counts them, C4 = 28; Leland, 360 units a space ---------------- */
  const SP = 14;
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
  const CW = 190;                                   // comparing: from one chord to the next
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
  const keySig = () => (SW.staff && SW.staff.keySignature ? SW.staff.keySignature(M.keyNow(), C.scaleId()) : { sig: {}, order: [], kind: 0 });
  const H = Math.round(yB(14) + 22);
  const STAFF_H = H;

  /* ================= AN EDITOR ================= */
  function create(o) {
    const column = c => {
      const notes = C.cleanVoice(c.notes) || C.voiceOf(c.chord) || [[0, 0], [4, 7]];
      return Object.assign({}, c, { notes, orig: JSON.stringify(notes), tones: C.describe(c.chord).tones });
    };
    const E = { cols: o.cols.map(column), cur: Math.max(0, o.cur || 0), sel: null, ghosts: null, hist: [], fut: [] };
    const onChange = o.onChange || (() => {});
    const col = () => E.cols[E.cur];
    const notesOf = c => C.voiceNotes((c || col()).notes);
    const dirtyCol = c => JSON.stringify(c.notes) !== c.orig;
    const many = () => E.cols.length > 1;

    /* ---- the ghosts: the chord's notes when the note was picked, every octave ---- */
    function freeze() {
      const m = new Map();
      notesOf().forEach(n => { if (!m.has(pcRel(n.midi))) m.set(pcRel(n.midi), n.letter); });
      E.ghosts = m;
    }
    const ghostPc = m => !!E.ghosts && E.ghosts.has(pcRel(m));
    const ghostPair = m => (E.ghosts && E.ghosts.has(pcRel(m)) ? onLetter(m, E.ghosts.get(pcRel(m))) : null);

    /* ---- changes, undo ---- */
    const snap = () => JSON.stringify({ cur: E.cur, n: E.cols.map(c => c.notes) });
    function restore(str) {
      const v = JSON.parse(str);
      v.n.forEach((n, i) => { if (E.cols[i]) E.cols[i].notes = n; });
      E.cur = Math.max(0, Math.min(v.cur, E.cols.length - 1));
      E.sel = null;
      E.ghosts = null;
    }
    /* the chord being changed takes `next`; the note at selMidi is then the one selected (undefined: none) */
    function change(next, selMidi, why) {
      const v = C.cleanVoice(next);
      if (!v) return false;
      E.hist.push(snap());
      if (E.hist.length > 100) E.hist.shift();
      E.fut = [];
      col().notes = v;
      if (selMidi !== undefined && selMidi !== null) {
        const i = notesOf().findIndex(n => n.midi === selMidi);
        E.sel = i < 0 ? null : i;
        if (E.sel === null) E.ghosts = null;
        else if (!E.ghosts) freeze();
      } else { E.sel = null; E.ghosts = null; }
      onChange(why || 'notes');
      return true;
    }
    function undo() { if (!E.hist.length) return; E.fut.push(snap()); restore(E.hist.pop()); onChange('undo'); hear(); }
    function redo() { if (!E.fut.length) return; E.hist.push(snap()); restore(E.fut.pop()); onChange('undo'); hear(); }

    /* ---- selecting ---- */
    function select(i) {
      const n = notesOf()[i];
      if (!n) return;
      E.sel = i;
      freeze();
      SW.audio.playChordFrequencies([M.midiToFreq(n.midi)], undefined, 0.5);
    }
    function deselect() { E.sel = null; E.ghosts = null; }
    function toCol(ci) { if (ci >= 0 && ci < E.cols.length && ci !== E.cur) { E.cur = ci; deselect(); } }

    /* ---- moving ---- */
    const isKey = () => mode() === 'key';
    const keyOk = m => scalePcs().has(pcRel(m)) || ghostPc(m) || col().tones.some(t => t.pc === pcRel(m));
    function nudge(el) { const s = el || document.querySelector('.pw-body .fx-staff'); if (s) { s.classList.remove('nudge'); void s.offsetWidth; s.classList.add('nudge'); } }
    /* ↑ ↓: along the key or a half step; ⇧ an octave */
    function move(dir, octave) {
      const ns = notesOf();
      if (E.sel === null || !ns[E.sel]) { select(dir > 0 ? ns.length - 1 : 0); return true; }
      const n = ns[E.sel];
      const taken = new Set(ns.map(x => x.midi));
      let to = null, pair = null;
      if (octave) {
        const m = n.midi + 12 * dir;
        if (m >= LO && m <= HI && !taken.has(m)) { to = m; pair = [n.step + 7 * dir, n.semi + 12 * dir]; }
      } else {
        for (let m = n.midi + dir; m >= LO && m <= HI; m += dir) {
          if (taken.has(m)) continue;
          if (isKey() && !keyOk(m)) continue;
          to = m;
          break;
        }
        if (to !== null) pair = ghostPair(to) || C.spellMidi(to, dir, col().tones);
      }
      if (to === null) { nudge(); return false; }
      const next = col().notes.slice();
      next[E.sel] = pair;
      if (change(next, to, 'move')) hear();
      return true;
    }
    /* a pitch put on the staff: the selected note goes there — or, none selected, a new note */
    function placeAt(pair) {
      const m = t0() + pair[1];
      if (m < LO || m > HI) { nudge(); return; }
      const ns = notesOf();
      const at = ns.findIndex(n => n.midi === m);
      if (at >= 0) { if (at === E.sel) deselect(); else select(at); return; }       // a note there already: it is picked
      if (E.sel !== null && ns[E.sel]) {
        const next = col().notes.slice();
        next[E.sel] = pair;
        if (change(next, m, 'move')) hear();
        return;
      }
      if (col().notes.length >= 8) { ui.toast('A chord here holds up to eight notes'); return; }
      E.ghosts = null;
      if (change(col().notes.concat([pair]), m, 'add')) hear();
    }
    /* a tap on a line or space: the pitch it means there */
    function pairAtStep(d) {
      const letter = LETTERS[((d % 7) + 7) % 7];
      if (E.ghosts) for (const [pc, L] of E.ghosts) {
        if (L !== letter) continue;
        for (let acc = -2; acc <= 2; acc++) if (pcRel(natMidi(d) + acc) === pc) return C.pairOf(d, acc);
      }
      const same = notesOf().find(n => n.letter === letter);
      return C.pairOf(d, same ? same.acc : (keySig().sig[letter] || 0));
    }
    function removeSel() {
      if (E.sel === null) return;
      if (col().notes.length <= 2) { ui.toast('A chord keeps at least two notes'); nudge(); return; }
      const next = col().notes.slice();
      next.splice(E.sel, 1);
      if (change(next, undefined, 'remove')) hear();
    }
    function setAcc(a) {
      if (E.sel === null) return;
      const n = notesOf()[E.sel];
      const pair = C.pairOf(n.d, a), m = t0() + pair[1];
      if (m < LO || m > HI || notesOf().some((x, i) => i !== E.sel && x.midi === m)) { nudge(); return; }
      const next = col().notes.slice();
      next[E.sel] = pair;
      if (change(next, m, 'move')) hear();
    }

    /* ---- sound ---- */
    const freqs = c => notesOf(c).map(n => M.midiToFreq(n.midi));
    function hear() { SW.audio.playChordFrequencies(freqs(col())); }

    /* ---- drawing ---- */
    /* → { svg, W, xs } — xs: each chord's column (where its noteheads start) */
    function staff() {
      const key = keySig();
      const sig = key.sig || {};
      const X0 = 50, KX = X0 + 54;
      const NX0 = KX + key.order.length * 12 + (many() ? 84 : 74);
      const xs = E.cols.map((c, ci) => NX0 + ci * CW);
      const RIGHT = xs[xs.length - 1] + (many() ? NW / 2 + CW / 2 : 190), W = RIGHT + 18;
      let s = '<svg class="fx-staff" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (many() ? 'The chords' : 'The chord') + ' on a treble and a bass staff">';
      s += '<rect class="fx-hit" data-staff="1" x="0" y="0" width="' + W + '" height="' + H + '"/>';
      if (many()) s += '<rect class="fx-band" x="' + (xs[E.cur] + NW / 2 - (CW - 36) / 2).toFixed(1) + '" y="' + (TOP - 40) + '" width="' + (CW - 36).toFixed(1) + '" height="' + (BTOP + 4 * SP - TOP + 80) + '" rx="14" pointer-events="none"/>';
      s += '<g pointer-events="none">';
      for (let i = 0; i < 5; i++) {
        s += '<line x1="' + X0 + '" x2="' + RIGHT + '" y1="' + (TOP + i * SP) + '" y2="' + (TOP + i * SP) + '" stroke="' + INK + '" stroke-width="1.3"/>';
        s += '<line x1="' + X0 + '" x2="' + RIGHT + '" y1="' + (BTOP + i * SP) + '" y2="' + (BTOP + i * SP) + '" stroke="' + INK + '" stroke-width="1.3"/>';
      }
      s += '<line x1="' + X0 + '" x2="' + X0 + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + INK + '" stroke-width="2.4"/>';
      s += '<line x1="' + RIGHT + '" x2="' + RIGHT + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + INK + '" stroke-width="1.5"/>';
      // comparing: a light bar line between the chords
      for (let ci = 0; ci + 1 < xs.length; ci++) {
        const bx = xs[ci] + NW / 2 + CW / 2;                         // half way from one chord to the next
        s += '<line x1="' + bx + '" x2="' + bx + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + BAR + '" stroke-width="1.3"/>';
      }
      const bt = TOP, bb = BTOP + 4 * SP, bm = (bt + bb) / 2, bx = X0 - 7;
      s += '<path fill="' + INK + '" d="M' + bx + ' ' + bt + ' C' + (bx - 13) + ' ' + (bt + 16) + ' ' + (bx - 3) + ' ' + (bm - 28) + ' ' + (bx - 11) + ' ' + bm +
        ' C' + (bx - 3) + ' ' + (bm + 28) + ' ' + (bx - 13) + ' ' + (bb - 16) + ' ' + bx + ' ' + bb + ' C' + (bx - 8) + ' ' + (bb - 20) + ' ' + bx + ' ' + (bm + 24) + ' ' + (bx - 8) + ' ' + bm +
        ' C' + bx + ' ' + (bm - 24) + ' ' + (bx - 8) + ' ' + (bt + 20) + ' ' + bx + ' ' + bt + 'Z"/>';
      s += glyph('gClef', X0 + 6, yT(32), INK) + glyph('fClef', X0 + 6, yB(24), INK);
      key.order.forEach((L, i) => {
        const st = SIG_STEPS[key.kind][L];
        const gname = key.kind > 0 ? 'accidentalSharp' : 'accidentalFlat';
        s += glyph(gname, KX + i * 12, yT(st), INK) + glyph(gname, KX + i * 12, yB(st - 14), INK);
      });
      s += '</g>';
      E.cols.forEach((c, ci) => { s += chordSvg(c, ci, xs[ci], sig); });
      // the selected note's arrows, and ×
      const ns = notesOf();
      if (E.sel !== null && ns[E.sel]) {
        const y = yOf(ns[E.sel].d), x = xs[E.cur] + NW + 52;
        const btn = (data, cy, path, label) => '<g class="fx-btn" ' + data + ' role="button" aria-label="' + label + '"><circle cx="' + x + '" cy="' + cy + '" r="17"/><path d="' + path + '"/></g>';
        s += btn('data-move="1"', y - 21, 'M' + (x - 6) + ' ' + (y - 18) + ' l6 -6 l6 6', 'Up');
        s += btn('data-move="-1"', y + 21, 'M' + (x - 6) + ' ' + (y + 18) + ' l6 6 l6 -6', 'Down');
        s += '<g class="fx-btn fx-x" data-fxn="remove" role="button" aria-label="Take it out"><circle cx="' + (x + 44) + '" cy="' + y + '" r="14"/><path d="M' + (x + 39) + ' ' + (y - 5) + ' l10 10 M' + (x + 49) + ' ' + (y - 5) + ' l-10 10"/></g>';
      }
      return { svg: s + '</svg>', W, H, xs, NW, style: '--sw:' + Math.round(W * (many() ? 1.45 : 1.2)) + 'px;--ar:' + (W / H).toFixed(3) };
    }
    /* one chord's column: its ghosts (a note of it selected), its notes */
    function chordSvg(c, ci, NX, sig) {
      const cur = ci === E.cur;
      const ns = notesOf(c);
      let s = '';
      let lastD = null, shifted = false;
      const xs = ns.map(n => { const sh = lastD !== null && n.d - lastD === 1 && !shifted; shifted = sh; lastD = n.d; return sh ? NX + NW + 1 : NX; });
      if (cur && E.sel !== null && E.ghosts) {
        const taken = new Set(ns.map(n => n.midi));
        for (let m = LO; m <= HI; m++) {
          if (!ghostPc(m) || taken.has(m)) continue;
          const pair = ghostPair(m);
          if (!pair) continue;
          const g = C.voiceNotes([pair])[0];
          const x = ns.some(n => Math.abs(n.d - g.d) === 1) ? NX + NW + 1 : NX, y = yOf(g.d);
          const showAcc = g.acc !== (sig[g.letter] || 0);
          s += '<g class="fx-ghost" data-ghost="' + pair[0] + ',' + pair[1] + '"><g pointer-events="none">' + ledgers(g.d, x, NW, '#E3D8EA') + '</g>' +
            '<rect x="' + (x - 6) + '" y="' + (y - SP / 2) + '" width="' + (NW + 12) + '" height="' + SP + '" fill="transparent"/>' +
            glyph('noteheadWhole', x, y, GHOST, 'fill-opacity=".22" pointer-events="none"') +
            (showAcc ? glyph(ACC_GLYPH[g.acc], x - 15, y, GHOST, 'fill-opacity=".22" pointer-events="none"') : '') + '</g>';
        }
      }
      let accCol = 0, lastAccD = null;
      ns.forEach((n, i) => {
        const x = xs[i], y = yOf(n.d), colr = cur && E.sel === i ? SEL : cur || !many() ? INK : DIM;
        s += '<g class="fx-note' + (cur && E.sel === i ? ' sel' : '') + '" data-note="' + ci + ',' + i + '"><g pointer-events="none">' + ledgers(n.d, x, NW, colr) + '</g>' +
          '<rect x="' + (x - 6) + '" y="' + (y - SP / 1.6) + '" width="' + (NW + 12) + '" height="' + (SP * 1.25) + '" fill="transparent"/>' +
          glyph('noteheadWhole', x, y, colr, 'pointer-events="none"');
        if (n.acc !== (sig[n.letter] || 0)) {
          accCol = lastAccD !== null && n.d - lastAccD < 6 ? accCol + 1 : 0;
          lastAccD = n.d;
          s += glyph(ACC_GLYPH[n.acc], NX - 16 - accCol * 13, y, colr, 'pointer-events="none"');
        }
        s += '</g>';
      });
      return s;
    }
    /* the keyboard: C2 … C6, the chord's notes lit in their letters' colours; a dot where a ghost is */
    function keysHtml() {
      const lit = new Map(notesOf().map(n => [n.midi, n]));
      const whites = [], blacks = [];
      const nW = 29;
      let wi = 0;
      for (let m = LO; m <= HI; m++) {
        const white = NATPC.indexOf(((m % 12) + 12) % 12) !== -1;
        const n = lit.get(m), dot = !n && E.sel !== null && ghostPc(m);
        const inner = (n ? '<span class="fx-kname">' + esc(n.name) + '</span>' : '') + (dot ? '<i class="fx-kdot"></i>' : '');
        const kc = n ? M.LETTER_COLORS[n.letter] || '#9C168E' : '';
        const sel = n && E.sel !== null && notesOf()[E.sel] && notesOf()[E.sel].midi === m;
        if (white) { whites.push('<button type="button" class="fx-wk' + (n ? ' lit' : '') + (sel ? ' sel' : '') + '" data-key="' + m + '" style="--kc:' + kc + '" tabindex="-1" aria-label="' + (n ? n.name : 'key') + '">' + inner + (m % 12 === 0 ? '<b class="fx-c">C' + (Math.floor(m / 12) - 1) + '</b>' : '') + '</button>'); wi++; }
        else blacks.push('<button type="button" class="fx-bk' + (n ? ' lit' : '') + (sel ? ' sel' : '') + '" data-key="' + m + '" style="left:calc(' + (wi / nW * 100) + '% - ' + (100 / nW * 0.31).toFixed(3) + '%);width:' + (100 / nW * 0.62).toFixed(3) + '%;--kc:' + kc + '" tabindex="-1" aria-label="key">' + inner + '</button>');
      }
      return '<div class="fx-keys">' + whites.join('') + blacks.join('') + '</div>';
    }
    /* under the staff: how ↑ ↓ move a note — and, Chromatic with a note picked, ♭ ♮ ♯ */
    function moveBarHtml() {
      const key = isKey();
      const selN = E.sel !== null ? notesOf()[E.sel] : null;
      return '<div class="fx-movebar">' +
        '<span class="fx-movesay">' + (selN ? '↑ ↓ move it' : 'Tap a note to move it') + '</span>' +
        '<div class="seg fx-mode" role="group" aria-label="↑ ↓ move a note along the key, or by half steps">' +
          '<button type="button" class="seg-btn' + (key ? ' active' : '') + '" data-fxmode="key" aria-pressed="' + key + '" title="↑ ↓ move along the scale (the chord’s own notes too) — ⇧ an octave">Key</button>' +
          '<button type="button" class="seg-btn' + (key ? '' : ' active') + '" data-fxmode="chromatic" aria-pressed="' + !key + '" title="↑ ↓ move a half step — ⇧ an octave">Chromatic</button>' +
        '</div>' +
        (!key && selN ? '<span class="fx-accs" role="group" aria-label="Accidental">' +
          [[-1, '♭'], [0, '♮'], [1, '♯']].map(([a, t]) => '<button type="button" class="fx-acc' + (selN.acc === a ? ' on' : '') + '" data-acc="' + a + '">' + t + '</button>').join('') + '</span>' : '') +
      '</div>';
    }

    /* ---- gestures (the page hands them over) ---- */
    function stepAt(svg, clientY) {
      const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      const y = (clientY - r.top) / r.height * vb.height;
      const mid = (yT(28) + yB(26)) / 2;
      const d = y < mid ? Math.round(38 - (y - TOP) / (SP / 2)) : Math.round(26 - (y - BTOP) / (SP / 2));
      return Math.max(14, Math.min(42, d));
    }
    function colAt(svg, clientX) {
      if (!many()) return E.cur;
      const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
      const x = (clientX - r.left) / r.width * vb.width;
      const xs = staff().xs;
      let best = 0;
      xs.forEach((cx, i) => { if (Math.abs(cx + NW / 2 - x) < Math.abs(xs[best] + NW / 2 - x)) best = i; });
      return best;
    }
    /* a click in the page → true when it was ours (the page redraws after) */
    function click(target, ev) {
      const b = target.closest('[data-fxmode], [data-acc], [data-move], [data-fxn], [data-note], [data-ghost], [data-key], [data-staff]');
      if (!b) return false;
      const d = b.dataset;
      if (d.fxmode) { setMode(d.fxmode); return true; }
      if (d.acc !== undefined) { setAcc(Number(d.acc)); return true; }
      if (d.move !== undefined) { move(Number(d.move), false); return true; }
      if (d.fxn === 'remove') { removeSel(); return true; }
      if (d.note !== undefined) {
        const [ci, i] = d.note.split(',').map(Number);
        if (ci !== E.cur) { toCol(ci); select(i); return true; }
        if (E.sel === i) deselect(); else select(i);
        return true;
      }
      if (d.ghost !== undefined) { placeAt(d.ghost.split(',').map(Number)); return true; }
      if (d.key !== undefined) {
        const m = Number(d.key);
        const i = notesOf().findIndex(n => n.midi === m);
        if (i >= 0) { if (E.sel === i) deselect(); else select(i); return true; }
        if (isKey() && !keyOk(m)) { ui.toast('Key: the scale’s notes only — Chromatic for any note'); nudge(); return true; }
        placeAt(ghostPair(m) || C.spellMidi(m, 1, col().tones));
        return true;
      }
      if (d.staff !== undefined) {
        const svg = b.closest('svg');
        const ci = colAt(svg, ev.clientX);
        if (ci !== E.cur) { toCol(ci); hear(); return true; }          // comparing: a tap by another chord makes it the one changed
        placeAt(pairAtStep(stepAt(svg, ev.clientY)));
        return true;
      }
      return false;
    }
    /* ↑ ↓ (⇧ an octave), ← → (comparing: on into the chord beside it), Delete — true when used */
    function keyDown(e) {
      const k = e.key || '';
      switch (k) {
        case 'ArrowUp': case 'ArrowDown': e.preventDefault(); move(k === 'ArrowUp' ? 1 : -1, e.shiftKey); return true;
        case 'ArrowLeft': case 'ArrowRight': {
          e.preventDefault();
          const dir = k === 'ArrowLeft' ? -1 : 1, n = col().notes.length;
          if (E.sel === null) { select(dir < 0 ? 0 : n - 1); return true; }
          let i = E.sel + dir;
          if (i < 0 && E.cur > 0) { toCol(E.cur - 1); i = col().notes.length - 1; }
          else if (i >= n && E.cur < E.cols.length - 1) { toCol(E.cur + 1); i = 0; }
          select(Math.max(0, Math.min(col().notes.length - 1, i)));
          return true;
        }
        case 'Delete': case 'Backspace': e.preventDefault(); removeSel(); return true;
      }
      return false;
    }

    return {
      cols: E.cols, cur: () => E.cur, col, notes: notesOf, sel: () => E.sel, dirtyCol, dirty: () => E.cols.some(dirtyCol), many,
      change, select, deselect, toCol, move, removeSel, setAcc, placeAt, undo, redo,
      canUndo: () => E.hist.length > 0, canRedo: () => E.fut.length > 0,
      staff, keysHtml, moveBarHtml, click, keyDown, hear, freqs, isKey, nudge
    };
  }

  SW.chordNotes = { create, mode, setMode, LO, HI, onLetter, pcRel, rootOf, scalePcs, STAFF_H, natMidi };
})();

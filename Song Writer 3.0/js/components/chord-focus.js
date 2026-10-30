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

     • LOCKED (🔒, to start): a note moves only to the chord's own notes —
       ↑ ↓ the next one up or down, in any octave, past a pitch the chord
       already has; faint ghost noteheads show every place it can go, and
       a tap on one adds a note there (doubling the root, opening it out)
     • UNLOCKED (🔓): ↑ ↓ a half step (spelled for the key: the scale's
       letter, else ♯ going up and ♭ going down), ⇧↑ ⇧↓ an octave, ♭ ♮ ♯
       an accidental; a tap on any line or space adds a note there
     • ← → choose the note below / above; Delete takes it out (a chord
       keeps two); the keyboard: a tap on a key selects its note, or adds
       one (locked: the chord's notes only)
     • ▶ the chord (held, it rings) · ▶ In the song — a chord from the
       song: that spot with a bar either side, the chord as it is now
     • Save to Chord Chart — the card's notes change, and every chord in
       the song from it (Y2) · Save as New — a card of its own beside it;
       from the song, that spot alone takes it
     • ⌘Z ⇧⌘Z (↶ ↷) undo the notes here, one step at a time
   Any other way out with changes (‹ back, a tab, ×, Esc, a tap outside)
   asks: Save · Save as New · Don't save — or Keep editing (D12). ×, Esc
   and a tap outside go back like ‹ (2026-10-29, user): to the Chord
   Chart or the Time Line, whichever it was opened from — from the music,
   the window closes.

   API  SW.chordFocus.openCard(k) · atSpot(tick, origin) · atDraft(piece, hooks) · openNew() · render(body, foot) ·
        keyDown(e) · dirty() · origin() · leave(then) · undo() · redo() · canUndo() · canRedo() · closed()
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
  let F = null;                               // the chord in Focus (begin)

  /* ---------------- going in ---------------- */
  const cardsNow = () => (T.isChartShape() ? T.chart() : T.chartFrom().chart);
  const t0 = () => C.voiceMidis([[0, 0]])[0];                 // the tonic's MIDI (a voice's 0)
  const pcRel = m => ((m - t0()) % 12 + 12) % 12;
  function begin(o) {
    const notes = C.cleanVoice(o.notes) || C.voiceOf(o.chord) || [[0, 0], [4, 7]];
    F = Object.assign({ sel: null, hist: [], fut: [], spot: null, k: null }, o, { notes });
    F.orig = JSON.stringify(notes);
    F.tones = C.describe(o.chord).tones;
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
  const dirty = () => !!F && JSON.stringify(F.notes) !== F.orig;

  /* ---------------- the notes ---------------- */
  const notesNow = () => C.voiceNotes(F.notes);
  function change(next, selMidi) {
    const v = C.cleanVoice(next);
    if (!v) return false;
    F.hist.push(JSON.stringify(F.notes));
    if (F.hist.length > 100) F.hist.shift();
    F.fut = [];
    F.notes = v;
    if (selMidi !== undefined) { const i = notesNow().findIndex(n => n.midi === selMidi); F.sel = i < 0 ? null : i; }
    return true;
  }
  const inChord = m => F.tones.some(t => t.pc === pcRel(m));
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
    const pair = octave && !F.locked ? [n.step + 7 * dir, n.semi + 12 * dir] : C.spellMidi(to, dir, F.tones);
    const next = F.notes.slice();
    next[F.sel] = pair;
    if (change(next, to)) { hear(); redraw(); }
  }
  function addAt(pair) {
    const m = t0() + pair[1];
    if (m < LO || m > HI || notesNow().some(n => n.midi === m)) return;
    if (F.notes.length >= 8) { ui.toast('A chord here holds up to eight notes'); return; }
    if (change(F.notes.concat([pair]), m)) { hear(); redraw(); }
  }
  function removeSel() {
    if (F.sel === null) return;
    if (F.notes.length <= 2) { ui.toast('A chord keeps at least two notes'); nudge(); return; }
    const next = F.notes.slice();
    next.splice(F.sel, 1);
    if (change(next)) { F.sel = null; hear(); redraw(); }
  }
  function setAcc(a) {
    if (F.sel === null || F.locked) return;
    const n = notesNow()[F.sel];
    const pair = C.pairOf(n.d, a), m = t0() + pair[1];
    if (m < LO || m > HI || notesNow().some((x, i) => i !== F.sel && x.midi === m)) { nudge(); return; }
    const next = F.notes.slice();
    next[F.sel] = pair;
    if (change(next, m)) { hear(); redraw(); }
  }
  function select(i) { F.sel = i; const n = notesNow()[i]; if (n) SW.audio.playChordFrequencies([M.midiToFreq(n.midi)], undefined, 0.5); redraw(); }
  function undo() { if (!F || !F.hist.length) return; F.fut.push(JSON.stringify(F.notes)); F.notes = JSON.parse(F.hist.pop()); F.sel = null; hear(); redraw(); }
  function redo() { if (!F || !F.fut.length) return; F.hist.push(JSON.stringify(F.notes)); F.notes = JSON.parse(F.fut.pop()); F.sel = null; hear(); redraw(); }
  function nudge() { const s = bodyEl.querySelector('.fx-staff'); if (s) { s.classList.remove('nudge'); void s.offsetWidth; s.classList.add('nudge'); } }

  /* ---------------- sound ---------------- */
  const freqs = () => notesNow().map(n => M.midiToFreq(n.midi));
  function hear() { SW.audio.playChordFrequencies(freqs()); }
  let held = null;
  function holdOn() { holdOff(); held = SW.audio.holdChord(freqs()); }
  function holdOff() { if (held) { held.release(); held = null; } }
  function inSong() {
    if (F.spot === null) return;
    if (SW.player.playing) { SW.player.stop(); return; }
    const g = T.grid();
    const a = Math.max(0, g.T(g.barAt(F.spot) - 1)), z = g.T(g.barAt(F.spotEnd - 1) + 2);
    const preview = { k: F.k, at: F.spot, voice: F.notes };
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
  const INK = '#2B1D38', SEL = '#F08A00', GHOST = '#9C168E';
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
  function staffSvg() {
    const key = SW.staff && SW.staff.keySignature ? SW.staff.keySignature(S.key, C.scaleId()) : { sig: {}, order: [], kind: 0 };
    const sig = key.sig || {};
    const X0 = 50, KX = X0 + 54, NW = 537 * KS;           // the clefs; the signature (clear of the clef); a whole note's width
    const NX = KX + key.order.length * 12 + 74;           // the chord's column
    const RIGHT = NX + 190, W = RIGHT + 18, H = Math.round(yB(14) + 22);
    let s = '<svg class="fx-staff" id="fx-staff" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="The chord on a treble and a bass staff">';
    s += '<rect class="fx-hit" data-staff="1" x="0" y="0" width="' + W + '" height="' + H + '"/>';
    s += '<g pointer-events="none">';
    for (let i = 0; i < 5; i++) {
      s += '<line x1="' + X0 + '" x2="' + RIGHT + '" y1="' + (TOP + i * SP) + '" y2="' + (TOP + i * SP) + '" stroke="' + INK + '" stroke-width="1.3"/>';
      s += '<line x1="' + X0 + '" x2="' + RIGHT + '" y1="' + (BTOP + i * SP) + '" y2="' + (BTOP + i * SP) + '" stroke="' + INK + '" stroke-width="1.3"/>';
    }
    s += '<line x1="' + X0 + '" x2="' + X0 + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + INK + '" stroke-width="2.4"/>';
    s += '<line x1="' + RIGHT + '" x2="' + RIGHT + '" y1="' + TOP + '" y2="' + (BTOP + 4 * SP) + '" stroke="' + INK + '" stroke-width="1.5"/>';
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
    const ns = notesNow();
    // a note a step above the one below it sits to the right
    let lastD = null, shifted = false;
    const xs = ns.map(n => { const sh = lastD !== null && n.d - lastD === 1 && !shifted; shifted = sh; lastD = n.d; return sh ? NX + NW + 1 : NX; });
    // the ghosts (locked): every place the chord's notes may go
    if (F.locked) {
      const taken = new Set(ns.map(n => n.midi));
      for (let m = LO; m <= HI; m++) {
        if (!inChord(m) || taken.has(m)) continue;
        const [step, semi] = C.spellMidi(m, 1, F.tones);
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
      const x = xs[i], y = yOf(n.d), col = F.sel === i ? SEL : INK;
      s += '<g class="fx-note' + (F.sel === i ? ' sel' : '') + '" data-note="' + i + '"><g pointer-events="none">' + ledgers(n.d, x, NW, col) + '</g>' +
        '<rect x="' + (x - 6) + '" y="' + (y - SP / 1.6) + '" width="' + (NW + 12) + '" height="' + (SP * 1.25) + '" fill="transparent"/>' +
        glyph('noteheadWhole', x, y, col, 'pointer-events="none"');
      if (n.acc !== (sig[n.letter] || 0)) {
        accCol = lastAccD !== null && n.d - lastAccD < 6 ? accCol + 1 : 0;
        lastAccD = n.d;
        s += glyph(ACC_GLYPH[n.acc], NX - 16 - accCol * 13, y, col, 'pointer-events="none"');
      }
      s += '</g>';
    });
    // the selected note's arrows, and ×
    if (F.sel !== null && ns[F.sel]) {
      const y = yOf(ns[F.sel].d), x = NX + NW + 52;
      const btn = (data, cy, path, r) => '<g class="fx-btn" ' + data + '><circle cx="' + x + '" cy="' + cy + '" r="' + (r || 17) + '"/><path d="' + path + '"/></g>';
      s += btn('data-move="1"', y - 21, 'M' + (x - 6) + ' ' + (y - 18) + ' l6 -6 l6 6');
      s += btn('data-move="-1"', y + 21, 'M' + (x - 6) + ' ' + (y + 18) + ' l6 6 l6 -6');
      s += '<g class="fx-btn fx-x" data-fx="remove"><circle cx="' + (x + 44) + '" cy="' + y + '" r="14"/><path d="M' + (x + 39) + ' ' + (y - 5) + ' l10 10 M' + (x + 49) + ' ' + (y - 5) + ' l-10 10"/></g>';
    }
    return s + '</svg>';
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
    if (F.sel !== null && F.sel >= F.notes.length) F.sel = null;
    const d = C.describeVoiced(F.chord, F.notes);
    const big = C.labelHTML(C.nameOf(d)), small = d.unnamed ? '' : C.labelHTML(C.otherNameOf(d));
    const nv = F.isNew ? C.nameVoice(F.notes) : null;                 // Create Chord: the colour of the chord being built
    const color = C.describe(nv && !nv.unnamed ? nv.id : F.chord).color;
    const selN = F.sel !== null ? notesNow()[F.sel] : null;
    body.innerHTML =
      '<div class="fx-head">' +
        '<button type="button" class="fx-back" data-fx="back">' + ICON_BACK + esc(backLabel()) + '</button>' +
        '<span class="fx-chip" style="--c:' + color + '" aria-hidden="true"></span>' +
        '<div class="fx-name"><span class="fx-big' + (d.unnamed ? ' notes' : '') + '">' + big + '</span>' + (small ? '<span class="fx-small">' + small + '</span>' : '') + '</div>' +
        '<div class="fx-lock seg" role="group" aria-label="Chord notes only, or any note">' +
          '<button type="button" class="seg-btn' + (F.locked ? ' active' : '') + '" data-lock="1" aria-pressed="' + F.locked + '">' + ICON_LOCK + '<span>Chord notes</span></button>' +
          '<button type="button" class="seg-btn' + (F.locked ? '' : ' active') + '" data-lock="0" aria-pressed="' + !F.locked + '">' + ICON_OPEN + '<span>Any note</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="fx-main">' + staffSvg() + keysHtml() + '</div>';
    const accs = !F.locked && selN ? '<span class="fx-accs" role="group" aria-label="Accidental">' +
      [[-1, '♭'], [0, '♮'], [1, '♯']].map(([a, t]) => '<button type="button" class="fx-acc' + (selN.acc === a ? ' on' : '') + '" data-acc="' + a + '">' + t + '</button>').join('') + '</span>' : '';
    foot.innerHTML =
      '<button type="button" class="fx-hear" data-fx="hear" title="Hear it — hold to keep it ringing (Space)" aria-label="Hear it">' + ICON_PLAY + '</button>' +
      (F.spot !== null ? '<button type="button" class="btn fx-insong' + (SW.player.playing ? ' on' : '') + '" data-fx="in-song">' + ICON_PLAY + 'In the song</button>' : '') +
      accs + '<span class="pw-gap"></span>' +
      (F.isNew
        ? '<button type="button" class="btn btn-primary" data-fx="save-new">Put it on the chart</button>'
        : '<button type="button" class="btn" data-fx="save-new">Save as New</button><button type="button" class="btn btn-primary" data-fx="save">Save to Chord Chart</button>');
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
  /* Save: the card's notes, everywhere it is in the song (Y2) — Create Chord: on the chart */
  function save(then) {
    if (F.isNew) { saveNew(then); return; }
    const o = F.origin;
    let k = F.k;
    if (dirty()) {
      if (k) T.chartSet(k, { voice: tidy(F.chord, F.notes) });
      else if (F.hooks) { k = T.chartAdd({ chord: F.chord, place: F.place, voice: tidy(F.chord, F.notes) }); if (k) F.hooks.swap(k); }
      else k = T.chartAdd({ chord: F.chord, place: F.place, voice: tidy(F.chord, F.notes) }, undefined, F.spot === null ? undefined : F.spot);
    }
    if (SW.chordChart && k) SW.chordChart.select(k);
    (then || (() => goBack(o)))();
  }
  /* Save as New: a card of its own, right after the one it came from; from the song, that spot alone takes it */
  function saveNew(then) {
    const o = F.origin;
    const named = C.nameVoice(F.notes);
    const chord = F.isNew && !named.unnamed ? named.id : F.chord;
    const cards = cardsNow();
    const i = F.k ? cards.findIndex(x => x.id === F.k) : -1;
    const before = i >= 0 && cards[i + 1] ? cards[i + 1].id : undefined;
    const spot = !F.isNew && F.spot !== null && !F.hooks ? F.spot : undefined;      // the draft's spot: the Time Line swaps it (hooks)
    const k = T.chartAdd({ chord, place: F.isNew ? undefined : F.place, voice: tidy(chord, F.notes) }, before, spot);
    if (k && F.hooks) F.hooks.swap(k);
    if (SW.chordChart && k) SW.chordChart.select(k);
    (then || (() => goBack(o)))();
  }
  /* any other way out: with changes, the question first (D12) */
  function leave(then) {
    const o = F.origin;
    const go = then || (() => goBack(o));
    if (!dirty()) { if (then) F = null; go(); return; }
    const was = C.nameOf(C.describeVoiced(F.chord, JSON.parse(F.orig)));
    const after = fn => () => { fn(() => { F = null; go(); }); };
    SW.chordChart.ask(F.isNew ? {
      title: 'Put this chord on the chart?',
      buttons: [{ label: 'Put it on the chart', primary: true, act: after(saveNew) }, { label: 'Don’t', act: () => { F = null; go(); } }]
    } : {
      title: 'Save your changes to ' + C.labelHTML(was) + '?',
      buttons: [{ label: 'Save', primary: true, act: after(save) }, { label: 'Save as New', act: after(saveNew) }, { label: 'Don’t save', act: () => { F = null; go(); } }]
    });
  }
  // the window's ways out (×, a tap outside, Esc) come here through progression-window.js's guard
  function closed() { holdOff(); F = null; }

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
  bodyEl.addEventListener('click', e => {
    if (!active()) return;
    const t = e.target;
    const b = t.closest('[data-fx], [data-lock], [data-move], [data-note], [data-ghost], [data-key], [data-staff]');
    if (!b) return;
    if (b.dataset.fx === 'back') { leave(); return; }
    if (b.dataset.fx === 'remove') { removeSel(); return; }
    if (b.dataset.lock !== undefined) { F.locked = b.dataset.lock === '1'; redraw(); return; }
    if (b.dataset.move !== undefined) { move(Number(b.dataset.move), false); return; }
    if (b.dataset.note !== undefined) { select(Number(b.dataset.note)); return; }
    if (b.dataset.ghost !== undefined) { addAt(b.dataset.ghost.split(',').map(Number)); return; }
    if (b.dataset.key !== undefined) {
      const m = Number(b.dataset.key);
      const i = notesNow().findIndex(n => n.midi === m);
      if (i >= 0) { select(i); return; }
      if (F.locked && !inChord(m)) { ui.toast('Locked to the chord’s own notes — unlock for any note'); nudge(); return; }
      addAt(C.spellMidi(m, 1, F.tones));
      return;
    }
    if (b.dataset.staff !== undefined) {
      if (F.locked) { F.sel = null; redraw(); return; }       // locked: a new note goes on a ghost
      const d = stepAt(e.clientY);
      const key = SW.staff && SW.staff.keySignature ? SW.staff.keySignature(S.key, C.scaleId()) : { sig: {} };
      addAt(C.pairOf(d, key.sig['CDEFGAB'[((d % 7) + 7) % 7]] || 0));
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
    if (b.dataset.fx === 'save') { save(); return; }
    if (b.dataset.fx === 'save-new') { saveNew(); return; }
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
        const n = F.notes.length;
        F.sel = F.sel === null ? (k === 'ArrowLeft' ? 0 : n - 1) : Math.max(0, Math.min(n - 1, F.sel + (k === 'ArrowLeft' ? -1 : 1)));
        select(F.sel);
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
    undo, redo, canUndo: () => !!F && F.hist.length > 0, canRedo: () => !!F && F.fut.length > 0, isOpen: () => !!F
  };
})();

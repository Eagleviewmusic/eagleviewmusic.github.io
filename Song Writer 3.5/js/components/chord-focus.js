/* ==========================================================================
   COMPONENT — the chord editor: one chord's own notes (the Chords window)
   --------------------------------------------------------------------------
   Phase 3 of ../Song Writer Chords Redesign/ (README §3.2, D9–D12, Y2) made
   it as "Focus"; 2026-11-16 (user) it became the CHORD EDITOR — one chord,
   changed in depth (comparing the gold chords moved to chord-compare.js):

     from the Chord Chart   a double-tap on a card, its tune button, Enter
     from the Time Line     a double-click on a chord, Enter
     Create Chord           a new chord to build, Put it on the chart
     from the music         a double-click on a chord — a SMALLER WINDOW of
                            its own (the Chords window, `compact`): its name,
                            NOTES · RHYTHM, ↶ ↷ and × along the top

   NOTES — the chord on a treble and a bass staff (chord-notes.js: tap a
   note, then ↑ ↓ along the Key or Chromatic, ⇧ an octave, or tap where it
   goes; the ghosts show only while a note is picked), a keyboard under it,
   and beside the staff THE CHORD'S BUTTONS (the user: "these buttons should
   be available here … treat them like toggles"):
       sus2 · sus4 · add9 · ♭7 · maj7          its colour
       6 · 6/4 · 6/5 · 4/3 · 4/2              its bass (inversions)
   Each is lit while the notes make it — whichever way they got there — and
   a tap turns it on or off by moving, adding or taking out notes: sus4 on,
   the 3rd rises to the 4th (and stays until sus4 is turned off, or a note
   moves so the chord is no longer sus4); 6/5 on, a 7th is added if there
   is none and the 3rd goes to the bass. What the tap did is said under
   them (E → F). The buttons work from the chord's root (as its name says;
   the chord it started as until its notes make another).
   RHYTHM (from the music only) — chord-rhythm.js's Block Chords ·
   Arpeggios · Build Your Own for this chord alone, at once (track.js
   spotRhythm), or the Chord Chart's again.

     • ▶ the chord (held, it rings) · ▶ In the song — a chord from the
       song: that spot with a bar either side, the chords as they are now
     • Save to Chord Chart — the card's notes change, and every chord in
       the song from it (Y2) · Save as New — a card of its own beside it;
       from the song, that spot alone takes it (it takes the card's rhythm)
     • ⌘Z ⇧⌘Z (↶ ↷) undo the notes here (on Rhythm: the song's steps)
   Any other way out with changes (‹ back, a tab, ×, Esc, a tap outside)
   asks: Save · Save as New · Don't save — or Keep editing (D12). Esc with
   a note picked lets go of it first. ×, Esc and a tap outside go back to
   the Chord Chart or the Time Line, whichever it was opened from — from the
   music, the window closes.

   API  SW.chordFocus.openCard(k) · atSpot(tick, origin) · atDraft(piece, hooks) · openNew() · render(body, foot, slot) ·
        keyDown(e) · dirty() · origin() · leave(then) · undo() · redo() · canUndo() · canRedo() · closed() · tab() ·
        compact() · escape()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const ui = SW.ui;
  const N = SW.chordNotes;
  const bodyEl = document.getElementById('pw-body');
  const footEl = document.getElementById('pw-foot');
  if (!C || !T || !N || !bodyEl || !footEl) return;
  const esc = C.escapeHtml;
  const clone = x => JSON.parse(JSON.stringify(x));
  const LETTERS = 'CDEFGAB';

  let F = null;          // { origin, spot, spotEnd, hooks, isNew, ed, root, tab, say, key }
  const M = SW.music;
  /* A CHORD OF THE SONG IS IN ITS BAR'S KEY (KEY CHANGES, js/keys.js): its notes (a voice is kept above the
     tonic), the staff's key signature, the keyboard and ▶ — as "In the song" plays it (2026-11-22, bug report
     M17: they followed the key of the selected note, so a chord after a key change, opened with a note before
     it selected, showed and sounded in the old key). A card from the chart, or a new chord: the key where the
     selection is, as before. Everything here that reads a chord's notes runs inside inKey. */
  const inKey = fn => (F && F.key ? M.withKey(F.key, fn) : fn());
  const keyAt = tick => (SW.keys && tick !== null && tick !== undefined ? SW.keys.atTick(tick) : null);

  /* ---------------- going in ---------------- */
  const cardsNow = () => (T.isChartShape() ? T.chart() : T.chartFrom().chart);
  /* the root the buttons work from: as the notes name it, else the chord it is */
  function rootFor(chord, notes) {
    const nv = C.nameVoice(notes);
    return N.rootOf(nv && !nv.unnamed ? nv.id : chord);
  }
  function begin(o) {
    F = { origin: o.origin, spot: o.spot === undefined ? null : o.spot, spotEnd: o.spotEnd, hooks: o.hooks || null, isNew: !!o.isNew,
      tab: 'notes', say: '', key: keyAt(o.spot) };
    inKey(() => {
      const notes = C.cleanVoice(o.notes) || C.voiceOf(o.chord) || [[0, 0], [4, 7]];
      F.root = rootFor(o.chord, notes);
      F.ed = N.create({ cols: [{ k: o.k || null, chord: o.chord, place: o.place, notes, main: true }], onChange: changed });
    });
  }
  function openCard(k) {
    const e = cardsNow().find(x => x.id === k);
    if (!e) return false;
    begin({ origin: 'chart', k, chord: e.chord, place: e.place, notes: e.voice || C.voiceOf(e.chord) });
    return true;
  }
  /* a chord of the song (the music, the Time Line): its card — on an old song, the card its chart would give it */
  function atSpot(tick, origin) {
    const ev = T.events().find(e => e.id && C.isKnown(e.id) && e.at <= tick && tick < e.end);
    if (!ev) return false;
    let k = ev.k || null;
    if (!T.isChartShape()) { const pc = T.chartFrom().pieces.find(p => p.at === ev.at); k = pc ? pc.k : null; }
    begin({ origin, k, chord: ev.id, place: ev.place || undefined, spot: ev.at, spotEnd: ev.end, notes: ev.voice || null });   // none: the engine's, in its key (begin)
    return true;
  }
  function openNew() { begin({ origin: 'chart', chord: 'I', notes: C.voiceOf('I'), isNew: true }); }
  /* a chord of the Time Line's draft (chord-timeline.js): `hooks` — swap(k): Save as New's card takes that
     spot in the draft (the song is not touched); play(a, z, preview): ▶ In the song, the draft playing */
  function atDraft(pc, hooks) {
    if (!pc || !C.isKnown(pc.chord)) return false;
    const card = pc.k ? cardsNow().find(x => x.id === pc.k) : null;
    begin({ origin: 'song', k: card ? pc.k : null, chord: pc.chord, place: pc.place || undefined, spot: pc.at, spotEnd: pc.end,
      notes: (card ? card.voice : pc.voice) || null, hooks });
    return true;
  }
  const col = () => F.ed.col();
  const dirty = () => !!F && F.ed.dirty();
  const compact = () => !!F && F.origin === 'music';
  /* a note moved, added, taken out, undone: the buttons follow the root the notes now name */
  function changed(why) {
    if (!F) return;
    if (why !== 'mod') { F.say = ''; const nv = C.nameVoice(col().notes); if (nv && !nv.unnamed) F.root = N.rootOf(nv.id); }
  }

  /* ================= THE CHORD'S BUTTONS (2026-11-16, user) =================
     On the notes as they are, from the root: `rel` the semitones a note is above it. */
  const LOFF = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 4, 8: 4, 9: 5, 10: 6, 11: 6 };   // a tone's letters above the root
  const relOf = p => (((p[1] - F.root.pc) % 12) + 12) % 12;
  const nm = p => C.voiceNotes([p])[0].name;
  const scaleHas = x => N.scalePcs().has((F.root.pc + x) % 12);
  const thirdRel = () => (scaleHas(4) ? 4 : scaleHas(3) ? 3 : 4);
  const seventhRel = () => (scaleHas(10) ? 10 : scaleHas(11) ? 11 : 10);
  function shapeOf(notes) {
    const set = new Set(notes.map(relOf));
    const has = x => set.has(x);
    const third = has(3) || has(4), fourth = has(5), second = has(2), sev = has(10) || has(11);
    const lit = new Set();
    if (fourth && !third) lit.add('sus4');
    if (second && !third && !fourth) lit.add('sus2');
    if (second && (third || fourth)) lit.add('add9');
    if (has(10)) lit.add('b7');
    if (has(11)) lit.add('maj7');
    const bass = notes.length ? relOf(notes[0]) : 0;
    const role = bass === 3 || bass === 4 || (!third && (bass === 2 || bass === 5)) ? 'third'
      : bass >= 6 && bass <= 8 ? 'fifth' : bass === 10 || bass === 11 ? 'seventh' : null;
    if (role === 'third') lit.add(sev ? 'inv65' : 'inv6');
    if (role === 'fifth') lit.add(sev ? 'inv43' : 'inv64');
    if (role === 'seventh') lit.add('inv42');
    return { lit, third, fourth, second, sev, has };
  }
  /* every note `rel` in `from` → `to` (its letter with it) */
  function moveRel(ns, from, to) {
    const said = [];
    const out = ns.map(p => {
      const r = relOf(p);
      if (from.indexOf(r) === -1) return p;
      const q = [p[0] + LOFF[to] - LOFF[r], p[1] + (to - r)];
      said.push(nm(p) + ' → ' + nm(q));
      return q;
    });
    return said.length ? { notes: out, say: said } : null;
  }
  /* one new note `rel` above the root: the octave nearest the middle of the chord, over its bass (a 9th: an
     octave and more over the root) */
  function addRel(ns, r, nine) {
    const vn = C.voiceNotes(ns);
    const mids = vn.map(n => n.midi), taken = new Set(mids);
    const low = Math.min.apply(null, mids);
    const inner = mids.filter(m => m !== low);
    const mid = (inner.length ? inner : mids).reduce((a, b) => a + b, 0) / (inner.length || mids.length);
    const pc = (F.root.pc + r) % 12;
    const letter = LETTERS[(LETTERS.indexOf(F.root.letter) + LOFF[r]) % 7];
    const pick = floor => {
      let best = null;
      for (let m = floor; m <= N.HI; m++) if (N.pcRel(m) === pc && !taken.has(m) && (best === null || Math.abs(m - mid) <= Math.abs(best - mid))) best = m;
      return best;
    };
    let m = null;
    if (nine) { const roots = vn.filter(n => relOf([n.step, n.semi]) === 0).map(n => n.midi); m = pick((roots.length ? roots[0] : low) + 13); }
    if (m === null) m = pick(low + 1);
    if (m === null) return null;
    const q = N.onLetter(m, letter) || C.spellMidi(m, 1, col().tones);
    return { notes: ns.concat([q]), say: ['+ ' + nm(q)] };
  }
  function dropRel(ns, rels) {
    const gone = ns.filter(p => rels.indexOf(relOf(p)) !== -1);
    if (!gone.length) return { notes: ns, say: [] };
    const out = ns.filter(p => rels.indexOf(relOf(p)) === -1);
    if (out.length < 2) return null;
    return { notes: out, say: gone.map(p => '− ' + nm(p)) };
  }
  /* a tone (the first of `rels` the chord has; none: `make` added under the bass) to the bass: down by
     octaves under the lowest note — or, too low for that, the notes under it go up */
  function toBass(ns, rels, make) {
    const vn = C.voiceNotes(C.cleanVoice(ns) || ns);
    const sorted = vn.map(n => [n.step, n.semi]);
    if (rels.indexOf(relOf(sorted[0])) !== -1) return { notes: sorted, say: [] };
    let j = -1;
    for (const r of rels) { j = sorted.findIndex(p => relOf(p) === r); if (j >= 0) break; }
    const lowM = vn[0].midi;
    if (j < 0) {
      const pc = (F.root.pc + make) % 12;
      let m = null;
      for (let x = lowM - 1; x >= N.LO; x--) if (N.pcRel(x) === pc) { m = x; break; }
      if (m === null) return null;
      const q = N.onLetter(m, LETTERS[(LETTERS.indexOf(F.root.letter) + LOFF[make]) % 7]) || C.spellMidi(m, -1, col().tones);
      return { notes: [q].concat(sorted), say: ['+ ' + nm(q) + ' in the bass'] };
    }
    const tgt = vn[j];
    const k = Math.ceil((tgt.midi - lowM + 1) / 12);
    if (tgt.midi - 12 * k >= N.LO) {
      const out = sorted.slice();
      out[j] = [tgt.step - 7 * k, tgt.semi - 12 * k];
      return { notes: out, say: [nm(sorted[j]) + ' to the bass'] };
    }
    // too low: the notes under it go up over it
    const out = [];
    const said = [];
    sorted.forEach((p, i) => {
      if (i >= j) { out.push(p); return; }
      const n = vn[i], up = Math.ceil((tgt.midi - n.midi + 1) / 12);
      if (n.midi + 12 * up <= N.HI) { out.push([p[0] + 7 * up, p[1] + 12 * up]); said.push(nm(p) + ' up an octave'); }
      else said.push('− ' + nm(p));
    });
    return out.length >= 2 ? { notes: out, say: said.concat([nm(sorted[j]) + ' in the bass']) } : null;
  }
  const join = (a, b) => (a && b ? { notes: b.notes, say: a.say.concat(b.say) } : null);
  const thirdRole = sh => (sh.has(4) ? [4, 3] : sh.has(3) ? [3] : sh.has(5) ? [5] : sh.has(2) ? [2] : [thirdRel()]);
  const fifthRole = sh => (sh.has(7) ? [7] : sh.has(6) ? [6] : sh.has(8) ? [8] : [7]);
  function withSeventh(ns, sh) { return sh.sev ? { notes: ns, say: [] } : addRel(ns, seventhRel()); }
  /* a button pressed → { notes, say } (null: it cannot be done here) */
  function apply(id, on) {
    const ns = col().notes.slice();
    const sh = shapeOf(ns);
    switch (id) {
      case 'sus4':
        if (on) return moveRel(ns, [5], thirdRel());
        return sh.third ? moveRel(ns, [3, 4], 5) : sh.second ? moveRel(ns, [2], 5) : addRel(ns, 5);
      case 'sus2':
        if (on) return moveRel(ns, [2], thirdRel());
        return sh.third ? moveRel(ns, [3, 4], 2) : sh.fourth ? moveRel(ns, [5], 2) : addRel(ns, 2);
      case 'add9':
        if (on) return dropRel(ns, [2]);
        return !sh.third && !sh.fourth ? addRel(ns, thirdRel()) : addRel(ns, 2, true);
      case 'b7':
        if (on) return dropRel(ns, [10]);
        return sh.has(11) ? moveRel(ns, [11], 10) : addRel(ns, 10);
      case 'maj7':
        if (on) return dropRel(ns, [11]);
        return sh.has(10) ? moveRel(ns, [10], 11) : addRel(ns, 11);
    }
    // the bass: lit, the root goes back to the bass; else that tone, as a triad (6, 6/4) or a 7th chord (6/5 4/3 4/2)
    if (on) return toBass(ns, [0], 0);
    const triad = id === 'inv6' || id === 'inv64';
    const base = triad ? dropRel(ns, [10, 11]) : withSeventh(ns, sh);
    if (!base) return null;
    const sh2 = shapeOf(base.notes);
    const rels = id === 'inv6' || id === 'inv65' ? thirdRole(sh2) : id === 'inv64' || id === 'inv43' ? fifthRole(sh2) : (sh2.has(10) ? [10] : [11]);
    return join(base, toBass(base.notes, rels, rels[0]));
  }
  const MODS_COLOUR = ['sus2', 'sus4', 'add9', 'b7', 'maj7'];
  const MODS_BASS = ['inv6', 'inv64', 'inv65', 'inv43', 'inv42'];
  function press(id) {
    const f = C.MOD_BY_ID[id];
    if (!f) return;
    const on = shapeOf(col().notes).lit.has(id);
    const res = apply(id, on);
    if (!res) { ui.toast(on ? 'A chord keeps at least two notes' : 'No room for that note here'); F.ed.nudge(); return; }
    const was = JSON.stringify(col().notes);
    if (!F.ed.change(res.notes, undefined, 'mod')) { F.ed.nudge(); return; }
    if (JSON.stringify(col().notes) === was) { F.say = '<b>' + C.modLabelHTML(f) + '</b> ' + esc(f.does.charAt(0).toLowerCase() + f.does.slice(1)); return; }
    F.say = '<b>' + C.modLabelHTML(f) + '</b> ' + (on ? 'off' : 'on') + (res.say.length ? ' — ' + esc(res.say.join(', ')) : '');
    F.ed.hear();
  }
  function modsHtml() {
    const lit = shapeOf(col().notes).lit;
    const btn = id => {
      const f = C.MOD_BY_ID[id], on = lit.has(id);
      return '<button type="button" class="fx-mod' + (on ? ' on' : '') + (f.figs ? ' figs' : '') + '" data-mod="' + id + '" aria-pressed="' + on + '" title="' + esc(f.does) + (on ? ' — in the chord now; tap to take it off' : '') + '">' + C.modLabelHTML(f) + '</button>';
    };
    return '<div class="fx-mods" role="group" aria-label="The chord’s buttons">' +
      '<div class="fx-mgroup"><span class="fx-mlabel">Colour</span><div class="fx-mrow">' + MODS_COLOUR.map(btn).join('') + '</div></div>' +
      '<div class="fx-mgroup"><span class="fx-mlabel">Bass</span><div class="fx-mrow">' + MODS_BASS.map(btn).join('') + '</div></div>' +
      '<p class="fx-msay">' + (F.say || 'Lit: in the chord now. Tap one and watch the notes change.') + '</p>' +
    '</div>';
  }

  /* ---------------- sound ---------------- */
  let held = null;
  function holdOn() { holdOff(); held = SW.audio.holdChord(inKey(() => F.ed.freqs(col()))); }
  function holdOff() { if (held) { held.release(); held = null; } }
  function inSong() {
    if (F.spot === null) return;
    if (SW.player.playing) { SW.player.stop(); return; }
    const g = T.grid();
    const a = Math.max(0, g.T(g.barAt(F.spot) - 1)), z = g.T(g.barAt(F.spotEnd - 1) + 2);
    const c = col();
    const preview = [{ k: c.k, at: F.spot, voice: c.notes }];
    if (F.hooks && F.hooks.play) { F.hooks.play(a, z, preview); return; }
    SW.player.playFrom(a, { loop: [a, z], once: true, countIn: false, beat: false, preview });
  }
  SW.bus.on('play:changed', () => { const b = footEl.querySelector('[data-fx="in-song"]'); if (b) b.classList.toggle('on', !!SW.player.playing); });

  /* ---------------- drawing ---------------- */
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const ICON_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const backLabel = () => (F.origin === 'song' ? 'Time Line' : 'Chord Chart');
  function nameHtml() {
    const c = col();
    const d = C.describeVoiced(c.chord, c.notes);
    const nv = F.isNew ? C.nameVoice(c.notes) : null;           // Create Chord: the colour of the chord being built
    const color = C.describe(nv && !nv.unnamed ? nv.id : c.chord).color;
    const small = d.unnamed ? '' : C.labelHTML(C.otherNameOf(d));
    return '<span class="fx-chip" style="--c:' + color + '" aria-hidden="true"></span>' +
      '<div class="fx-name"><span class="fx-big' + (d.unnamed ? ' notes' : '') + '">' + C.labelHTML(C.nameOf(d)) + '</span>' + (small ? '<span class="fx-small">' + small + '</span>' : '') +
      (F.ed.dirty() ? '<i class="fx-cdot" title="Changed — not saved yet" aria-label="changed"></i>' : '') + '</div>';
  }
  function tabsHtml() {
    const t = F.tab;
    return '<div class="seg fx-tabs" role="tablist" aria-label="Its notes, or its rhythm">' +
      '<button type="button" class="seg-btn' + (t === 'notes' ? ' active' : '') + '" data-fxtab="notes" role="tab" aria-selected="' + (t === 'notes') + '">Notes</button>' +
      '<button type="button" class="seg-btn' + (t === 'rhythm' ? ' active' : '') + '" data-fxtab="rhythm" role="tab" aria-selected="' + (t === 'rhythm') + '">Rhythm</button></div>';
  }
  function notesHtml() {
    const st = F.ed.staff();
    return '<div class="fx-main"><div class="fx-edit">' +
        '<div class="fx-left" style="' + st.style + '"><div class="fx-stage">' + st.svg + '</div>' + F.ed.moveBarHtml() + '</div>' +
        modsHtml() +
      '</div>' + F.ed.keysHtml() + '</div>';
  }
  function render(body, foot, slot) { inKey(() => draw(body, foot, slot)); }
  function draw(body, foot, slot) {
    if (!F) { body.innerHTML = '<p class="fx-none">No chord here</p>'; foot.innerHTML = ''; if (slot) slot.innerHTML = ''; return; }
    if (F.ed.sel() !== null && F.ed.sel() >= col().notes.length) F.ed.deselect();
    if (compact()) {
      // the smaller window (a chord in the music): its name, Notes · Rhythm along the window's top
      if (slot) slot.innerHTML = '<div class="fx-slot">' + nameHtml() + tabsHtml() + '</div>';
      if (F.tab === 'rhythm' && SW.chordRhythm) {
        body.innerHTML = '<div class="fx-rhythm">' + SW.chordRhythm.spotHtml(F.spot, col().notes) + '</div>';
        SW.chordRhythm.spotAttach(body);
      } else body.innerHTML = notesHtml();
    } else {
      if (slot) slot.innerHTML = '';
      body.innerHTML = '<div class="fx-head"><button type="button" class="fx-back" data-fx="back">' + ICON_BACK + esc(backLabel()) + '</button>' + nameHtml() + '</div>' + notesHtml();
    }
    let saves;
    if (F.isNew) saves = '<button type="button" class="btn btn-primary" data-fx="save-new">Put it on the chart</button>';
    else saves = '<button type="button" class="btn" data-fx="save-new" title="A card of its own on the Chord Chart' + (F.spot !== null && !F.hooks ? ' — just this chord in the song takes it' : '') + '">Save as New</button>' +
      '<button type="button" class="btn btn-primary" data-fx="save" title="Every chord in the song from this card changes">' + (compact() ? 'Save' : 'Save to Chord Chart') + '</button>';
    foot.innerHTML =
      '<button type="button" class="fx-hear" data-fx="hear" title="Hear it — hold to keep it ringing (Space)" aria-label="Hear it">' + ICON_PLAY + '</button>' +
      (F.spot !== null ? '<button type="button" class="btn fx-insong' + (SW.player.playing ? ' on' : '') + '" data-fx="in-song">' + ICON_PLAY + 'In the song</button>' : '') +
      (compact() ? '<button type="button" class="fx-tochart" data-fx="to-chart" title="The whole Chords window: the Chord Chart">Chord Chart</button>' : '') +
      '<span class="pw-gap"></span>' + saves;
  }
  function redraw() { if (SW.progWin && SW.progWin.isOpen()) SW.progWin.render(); }

  /* ---------------- coming out ---------------- */
  function goBack(origin) {
    const o = origin || (F ? F.origin : 'chart');
    F = null;
    if (SW.chordRhythm) SW.chordRhythm.spotDone();
    if (o === 'music') { ui.closeSheet('prog-sheet', true); return; }
    SW.progWin.setTab(o === 'song' ? 'song' : 'chart');
  }
  const tidy = (chord, notes) => { const eng = C.voiceOf(chord); return eng && JSON.stringify(eng) === JSON.stringify(notes) ? null : clone(notes); };
  const rhythmFrom = e => { const o = {}; if (e) ['rhythm', 'arp', 'by', 'all'].forEach(f => { if (e[f]) o[f] = e[f]; }); return o; };
  /* Save: its card's notes, everywhere it is in the song (Y2); no card: a new one (that spot takes it) */
  function saveMain(c) {
    let k = c.k;
    if (!F.ed.dirtyCol(c)) return k;
    if (k) T.chartSet(k, { voice: tidy(c.chord, c.notes) });
    else if (F.hooks) { k = T.chartAdd({ chord: c.chord, place: c.place, voice: tidy(c.chord, c.notes) }); if (k) F.hooks.swap(k); }
    else k = T.chartAdd({ chord: c.chord, place: c.place, voice: tidy(c.chord, c.notes) }, undefined, F.spot === null ? undefined : F.spot);
    return k;
  }
  /* Save as New: a card of its own, right after the one it came from (its rhythm too); from the song, that spot alone takes it */
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
  function save(then) {
    const o = F.origin, c = col();
    const k = inKey(() => (F.isNew ? saveNewMain(c) : saveMain(c)));
    if (SW.chordChart && k) SW.chordChart.select(k);
    (then || (() => goBack(o)))();
  }
  function saveNew(then) {
    const o = F.origin;
    const k = inKey(() => saveNewMain(col()));
    if (SW.chordChart && k) SW.chordChart.select(k);
    (then || (() => goBack(o)))();
  }
  /* any other way out: with changes, the question first (D12) */
  function leave(then) {
    const o = F.origin;
    const go = then || (() => goBack(o));
    if (!dirty()) { if (then) { F = null; if (SW.chordRhythm) SW.chordRhythm.spotDone(); } go(); return; }
    const done = () => { F = null; if (SW.chordRhythm) SW.chordRhythm.spotDone(); go(); };
    const after = fn => () => { fn(done); };
    const c = col();
    const was = inKey(() => C.nameOf(C.describeVoiced(c.chord, JSON.parse(c.orig))));
    SW.chordChart.ask(F.isNew ? {
      title: 'Put this chord on the chart?',
      buttons: [{ label: 'Put it on the chart', primary: true, act: after(saveNew) }, { label: 'Don’t', act: done }]
    } : {
      title: 'Save your changes to ' + C.labelHTML(was) + '?',
      buttons: [{ label: 'Save', primary: true, act: after(save) }, { label: 'Save as New', act: after(saveNew) }, { label: 'Don’t save', act: done }]
    });
  }
  // the window's ways out (×, a tap outside, Esc) come here through progression-window.js's guard
  function closed() { holdOff(); F = null; if (SW.chordRhythm) SW.chordRhythm.spotDone(); }
  /* Esc: a picked note is let go of first (true: that was all) */
  function escape() { if (F && F.tab === 'notes' && F.ed.sel() !== null) { F.ed.deselect(); redraw(); return true; } return false; }

  /* ---------------- gestures ---------------- */
  const active = () => !!F && SW.progWin && SW.progWin.isOpen() && SW.progWin.tab() === 'focus';
  function onClick(e) {
    if (!active()) return;
    inKey(() => clickHere(e));
  }
  function clickHere(e) {
    const t = e.target;
    const tb = t.closest('[data-fxtab]');
    if (tb) { setTabHere(tb.dataset.fxtab); return; }
    if (t.closest('.cr-panel')) return;                                  // the Rhythm tab: chord-rhythm.js
    const b = t.closest('[data-fx], [data-mod]');
    if (b && b.dataset.fx === 'back') { leave(); return; }
    if (b && b.dataset.mod) { press(b.dataset.mod); redraw(); return; }
    if (F.ed.click(t, e)) redraw();
  }
  function setTabHere(t) {
    if (!F || F.tab === t || !compact()) return;
    F.tab = t;
    if (t === 'rhythm') F.ed.deselect();
    holdOff();
    redraw();
  }
  bodyEl.addEventListener('click', onClick);
  const slotEl = document.getElementById('pw-slot');
  if (slotEl) slotEl.addEventListener('click', onClick);
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
    if (b.dataset.fx === 'in-song') { inSong(); return; }
    if (b.dataset.fx === 'save') { save(); return; }
    if (b.dataset.fx === 'save-new') { saveNew(); return; }
    if (b.dataset.fx === 'to-chart') { SW.progWin.setTab('chart'); return; }
  });

  /* ---------------- keys (the window hands them over while the editor is open) ---------------- */
  function keyDown(e) { return inKey(() => keyHere(e)); }
  function keyHere(e) {
    if (!F) return true;
    if (e.metaKey || e.ctrlKey) return false;
    const k = e.key || '';
    if (F.tab === 'rhythm') { if (k === ' ') { e.preventDefault(); } return true; }
    if (F.ed.keyDown(e)) { redraw(); return true; }
    switch (k) {
      case ' ': e.preventDefault(); if (!e.repeat) F.ed.hear(); return true;
      case 'Enter': e.preventDefault(); save(); return true;
    }
    return true;                 // the melody keys are quiet in here
  }

  SW.chordFocus = {
    openCard, atSpot, atDraft, openNew, render, keyDown, dirty, leave, closed, escape, compact,
    origin: () => (F ? F.origin : null), tab: () => (F ? F.tab : null),
    undo: () => { if (F) { inKey(() => F.ed.undo()); redraw(); } }, redo: () => { if (F) { inKey(() => F.ed.redo()); redraw(); } },
    canUndo: () => !!F && F.ed.canUndo(), canRedo: () => !!F && F.ed.canRedo(), isOpen: () => !!F,
    // for tests: the chord's buttons
    press: id => { if (F) { inKey(() => press(id)); redraw(); } }, lit: () => (F ? inKey(() => [...shapeOf(col().notes).lit]) : []), notes: () => (F ? clone(col().notes) : null),
    key: () => (F ? F.key : null)
  };
})();

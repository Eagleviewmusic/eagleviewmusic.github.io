/* ==========================================================================
   COMPONENT — Compare: the gold chords side by side (the Chords window)
   --------------------------------------------------------------------------
   2026-11-16, the user: the little gold light on a chart card says
   "compare" while it is on, and while any is on a COMPARE button sits at
   the top of the window, left of Chord Chart · Time Line. It opens this
   page (tab-less, like the chord editor): every gold chord in the chart's
   order on one grand staff — each named over its notes, a light bar line
   between them — so the voice leading from one to the next can be made
   smooth. (Until then the gold chords stood beside the chord in Focus,
   whose layout broke on smaller windows: the names rode up into the
   window's head.)

     • a tap on a chord (its name, a note, the staff by it) makes it the one
       being changed: its notes dark, a soft band behind it, the keyboard
       showing it; the others grey
     • its notes change as in the chord editor (chord-notes.js): tap a note,
       ↑ ↓ along the Key or Chromatic (⇧ an octave), or tap where it goes;
       ghosts only while a note is picked; ← → on into the chord beside it.
       No chord buttons here (sus4, 6/4 …): those are the editor's
     • ▶ the chord being changed (held, it rings) · ▶ In order — each in
       turn, two beats each, its name lighting
     • Save All (every changed chord saved to its card, everywhere in the
       song) · Let me Decide (Save or Save as New for each one changed)
     • ↶ ↷ undo the notes here; leaving with changes asks Save All · Let me
       Decide · Don't save (or Keep editing)

   API  SW.chordCompare.open() · render(body, foot) · keyDown(e) · dirty() · leave(then) · closed() · escape() ·
        undo() · redo() · canUndo() · canRedo() · isOpen()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const N = SW.chordNotes;
  const bodyEl = document.getElementById('pw-body');
  const footEl = document.getElementById('pw-foot');
  if (!C || !T || !N || !bodyEl || !footEl) return;
  const esc = C.escapeHtml;
  const clone = x => JSON.parse(JSON.stringify(x));

  let P = null;          // { ed }
  const cardsNow = () => (T.isChartShape() ? T.chart() : T.chartFrom().chart).filter(e => !e.hidden);

  /* the gold cards, in the chart's order (false: none) */
  function open() {
    const golds = SW.chordChart && SW.chordChart.golds ? SW.chordChart.golds() : [];
    const cards = cardsNow().filter(e => golds.indexOf(e.id) !== -1);
    if (!cards.length) return false;
    P = { ed: N.create({ cols: cards.map(e => ({ k: e.id, chord: e.chord, place: e.place, notes: e.voice || C.voiceOf(e.chord) })) }) };
    return true;
  }
  const dirty = () => !!P && P.ed.dirty();

  /* ---------------- sound ---------------- */
  let held = null;
  function holdOn() { holdOff(); held = SW.audio.holdChord(P.ed.freqs(P.ed.col())); }
  function holdOff() { if (held) { held.release(); held = null; } }
  let orderTimers = [];
  function inOrder() {
    orderTimers.forEach(clearTimeout);
    orderTimers = [];
    const mt = SW.meters.byId(S.meter);
    const len = Math.max(0.6, Math.min(1.5, SW.timing.tickMs() / 1000 * mt.beatTicks * 2));
    const now = SW.audio.now() + 0.05;
    const light = ci => bodyEl.querySelectorAll('.cx-name').forEach((b, i) => b.classList.toggle('sounding', i === ci));
    P.ed.cols.forEach((c, i) => {
      SW.audio.playChordFrequencies(P.ed.freqs(c), now + i * len, len * 0.92);
      orderTimers.push(setTimeout(() => light(i), 50 + i * len * 1000));
    });
    orderTimers.push(setTimeout(() => light(-1), 50 + P.ed.cols.length * len * 1000));
  }

  /* ---------------- drawing ---------------- */
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const ICON_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  /* each chord's name over its column — placed by the staff's own numbers, so they stay over their notes at any width */
  function namesHtml(st) {
    return '<div class="cx-names">' + P.ed.cols.map((c, ci) => {
      const d = C.describeVoiced(c.chord, c.notes);
      const color = C.describe(c.chord).color;
      return '<button type="button" class="cx-name' + (ci === P.ed.cur() ? ' cur' : '') + (P.ed.dirtyCol(c) ? ' changed' : '') + '" data-cxcol="' + ci + '"' +
        ' style="left:' + ((st.xs[ci] + st.NW / 2) / st.W * 100).toFixed(2) + '%;--c:' + color + ';--cink:' + SW.chordStrip.inkOn(color) + '"' +
        ' title="' + (ci === P.ed.cur() ? 'The chord being changed' : 'Change this chord') + '">' +
        '<span class="cx-cname' + (d.unnamed ? ' notes' : '') + '">' + C.labelHTML(C.nameOf(d)) + '</span>' + (P.ed.dirtyCol(c) ? '<i class="fx-cdot" aria-label="changed"></i>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function render(body, foot) {
    if (!P) { body.innerHTML = '<p class="fx-none">Light a chord’s gold circle on the Chord Chart to compare it</p>'; foot.innerHTML = ''; return; }
    const st = P.ed.staff();
    body.innerHTML =
      '<div class="fx-head cx-head"><button type="button" class="fx-back" data-cx="back">' + ICON_BACK + 'Chord Chart</button>' +
        '<h3 class="cx-title">Compare</h3><span class="cx-count">' + P.ed.cols.length + (P.ed.cols.length === 1 ? ' chord' : ' chords') + '</span></div>' +
      '<div class="fx-main cx-main">' +
        '<div class="cx-stage" style="' + st.style + '">' + namesHtml(st) + st.svg + '</div>' +
        P.ed.moveBarHtml() + P.ed.keysHtml() +
      '</div>';
    foot.innerHTML =
      '<button type="button" class="fx-hear" data-cx="hear" title="Hear the chord being changed — hold to keep it ringing (Space)" aria-label="Hear it">' + ICON_PLAY + '</button>' +
      (P.ed.cols.length > 1 ? '<button type="button" class="btn fx-inorder" data-cx="in-order" title="Every chord here, one after another">' + ICON_PLAY + 'In order</button>' : '') +
      '<span class="pw-gap"></span>' +
      '<button type="button" class="btn" data-cx="decide">Let me Decide</button><button type="button" class="btn btn-primary" data-cx="save">Save All</button>';
  }
  function redraw() { if (SW.progWin && SW.progWin.isOpen()) SW.progWin.render(); }

  /* ---------------- saving ---------------- */
  const tidy = (chord, notes) => { const eng = C.voiceOf(chord); return eng && JSON.stringify(eng) === JSON.stringify(notes) ? null : clone(notes); };
  const rhythmFrom = e => { const o = {}; if (e) ['rhythm', 'arp', 'by', 'all'].forEach(f => { if (e[f]) o[f] = e[f]; }); return o; };
  /* Save — its card's notes everywhere; Save as New — a card of its own beside it */
  function saveCol(c, how) {
    if (!P.ed.dirtyCol(c)) return c.k;
    if (how !== 'new') { T.chartSet(c.k, { voice: tidy(c.chord, c.notes) }); return c.k; }
    const cards = cardsNow();
    const i = cards.findIndex(x => x.id === c.k);
    return T.chartAdd(Object.assign({ chord: c.chord, place: c.place, voice: tidy(c.chord, c.notes) }, rhythmFrom(cards[i])), i >= 0 && cards[i + 1] ? cards[i + 1].id : undefined);
  }
  function goBack() { P = null; holdOff(); SW.progWin.setTab('chart'); }
  /* every chord, each as `how(c, i)` says — one Undo step — then back (or `then`) */
  function saveEach(how, then) {
    T.batch(() => P.ed.cols.forEach((c, i) => saveCol(c, how(c, i))));
    (then || goBack)();
  }
  function save(then) { saveEach(() => 'save', then); }
  /* Let me Decide: Save or Save as New for each chord that changed */
  function decide(then) {
    const list = P.ed.cols.map((c, i) => ({ c, i })).filter(x => P.ed.dirtyCol(x.c));
    if (!list.length) { save(then); return; }
    const pick = {};
    list.forEach(x => { pick[x.i] = 'save'; });
    const row = x => {
      const d = C.describeVoiced(x.c.chord, x.c.notes);
      const color = C.describe(x.c.chord).color;
      return '<div class="fx-drow" data-di="' + x.i + '"><span class="fx-dchip" style="--c:' + color + ';--cink:' + SW.chordStrip.inkOn(color) + '">' + C.labelHTML(C.nameOf(d)) + '</span>' +
        '<div class="seg fx-dseg" role="group" aria-label="How to save it">' +
          '<button type="button" class="seg-btn active" data-dpick="save" aria-pressed="true">Save</button>' +
          '<button type="button" class="seg-btn" data-dpick="new" aria-pressed="false">Save as New</button></div></div>';
    };
    SW.chordChart.ask({
      title: 'How should each chord be saved?',
      wide: true,
      body: list.map(row).join('') + '<p class="fx-dsay"><b>Save</b> changes the chord on the chart and everywhere the song plays it. <b>Save as New</b> puts a card of its own beside it.</p>',
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
  /* any way out: with changes, the question first */
  function leave(then) {
    const go = then || goBack;
    if (!dirty()) { if (then) { P = null; holdOff(); } go(); return; }
    const done = () => { P = null; holdOff(); go(); };
    SW.chordChart.ask({
      title: 'Save your changes to these chords?',
      buttons: [{ label: 'Save All', primary: true, act: () => save(done) }, { label: 'Let me Decide', act: () => decide(done) }, { label: 'Don’t save', act: done }]
    });
  }
  function closed() { holdOff(); orderTimers.forEach(clearTimeout); orderTimers = []; P = null; }
  function escape() { if (P && P.ed.sel() !== null) { P.ed.deselect(); redraw(); return true; } return false; }

  /* ---------------- gestures ---------------- */
  const active = () => !!P && SW.progWin && SW.progWin.isOpen() && SW.progWin.tab() === 'compare';
  bodyEl.addEventListener('click', e => {
    if (!active()) return;
    const t = e.target;
    if (t.closest('[data-cx="back"]')) { leave(); return; }
    const nb = t.closest('[data-cxcol]');
    if (nb) { P.ed.toCol(Number(nb.dataset.cxcol)); P.ed.hear(); redraw(); return; }
    if (P.ed.click(t, e)) redraw();
  });
  bodyEl.addEventListener('contextmenu', e => { if (active() && e.target.closest('.fx-keys, .fx-staff')) e.preventDefault(); });
  footEl.addEventListener('pointerdown', e => {
    if (!active() || !e.target.closest('[data-cx="hear"]')) return;
    e.preventDefault();
    holdOn();
  });
  window.addEventListener('pointerup', holdOff);
  window.addEventListener('pointercancel', holdOff);
  footEl.addEventListener('click', e => {
    if (!active()) return;
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.cx === 'in-order') { inOrder(); return; }
    if (b.dataset.cx === 'save') { save(); return; }
    if (b.dataset.cx === 'decide') { decide(); return; }
  });

  /* ---------------- keys ---------------- */
  function keyDown(e) {
    if (!P) return true;
    if (e.metaKey || e.ctrlKey) return false;
    if (P.ed.keyDown(e)) { redraw(); return true; }
    switch (e.key) {
      case ' ': e.preventDefault(); if (!e.repeat) P.ed.hear(); return true;
      case 'Enter': e.preventDefault(); save(); return true;
    }
    return true;
  }

  SW.chordCompare = {
    open, render, keyDown, dirty, leave, closed, escape, isOpen: () => !!P,
    undo: () => { if (P) { P.ed.undo(); redraw(); } }, redo: () => { if (P) { P.ed.redo(); redraw(); } },
    canUndo: () => !!P && P.ed.canUndo(), canRedo: () => !!P && P.ed.canRedo(),
    count: () => (P ? P.ed.cols.length : 0)
  };
})();

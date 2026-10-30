/* ==========================================================================
   COMPONENT — the Chord Chart: the Chords window's hub (2026-10-28)
   --------------------------------------------------------------------------
   Phase 2 of ../Song Writer Chords Redesign/ (README §3.1, D2–D8). The
   song's chords, chosen to fit it, top to bottom:

     THE CHART   the song's chords as big cards (track.js THE CHORD CHART):
                 colour = its root, the dots = its notes, low to high, the
                 badge = how many times the song uses it (none: not yet)
     THE WAVE    the song as it sounds (song-wave.js): play it, loop it,
                 jump about in it — and press any chord over it
     THE BOARD   every chord: the circle of fifths in blocks (chord-circle.js,
                 2026-10-29 — all 24 majors and minors round the song's key,
                 the default) or the panel's blocks (Circle · Panel, under
                 it); keys and Z X C V B held as on the panel; a dot on a
                 block whose chord is on the chart

     • a card: pressed, its chord rings (as long as it is held); a tap
       selects it (gold), ← → walk the cards; a double-tap, its tune button
       (on the selected card) or Enter opens FOCUS on it — its own notes
       (chord-focus.js), its name then following them; dragged along the chart it
       moves there; dragged off it (down, away), it leaves the chart —
       a chord the song uses asks first: take it out of the song too, or
       keep those spots (D5)
     • a block (or its key): pressed, it rings over whatever plays;
       dragged up onto the chart, it goes on there
     • Z X C V B (the tabs under the board, or the keys): TOGGLES here
       (2026-10-29, user) — a press turns one on, the next press off; the
       blocks are named, sound and go on the chart with every one that is
       on (G with ♭7 on: G7). The window closing turns them all off.
     • ? BOXES (2026-10-29, user — they replace the faded I IV V vi): a
       chart with fewer than four chords is topped up to four with empty
       ? boxes. Tap one and it waits (it pulses): the next chord played —
       a block, a circle block, a key — fills it, then the next box waits,
       until the boxes are full or a tap lands anywhere else (no drag and
       drop needed). Dragging a chord up still works, anywhere on the chart.
       The round + after them opens one more ? box, waiting. Extra boxes
       last until they are filled or another song opens. To their right,
       while the chart is empty: "Drag your favorite chords onto the Chord
       Chart" (user's words) — gone once the first chord is on.
     • Create Chord (was More chords…) — any chord, built note by note in
       Focus, Put it on the chart
     • An old song shows the chart it would make (its chords, in
       the order they sound — nothing is written until something changes
       here: then it goes over to the new shape, one Undo step with that
       change, every strike where it was)
   Listen only (a lesson): play, loop, jump, press chords — nothing moves.
   API  SW.chordChart.render(body) · keyDown(e) · closed() · count() · select(k) · ask({ title, buttons })
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const ui = SW.ui;
  const sheetEl = document.getElementById('prog-sheet');
  const bodyEl = document.getElementById('pw-body');
  if (!C || !T || !sheetEl || !bodyEl) return;
  const esc = C.escapeHtml;

  let armed = false;            // a ? box waits: the next chord played fills it (then the next box)
  let extra = 0;                // ? boxes the round + opened, beyond the four
  const SLOTS = 4;              // a chart is topped up to four with ? boxes
  let selK = null;              // the card selected
  let shown = null;             // { cards, uses } as last drawn
  let flashK = null, flashAt = 0;   // a card just put on (or found there): it flashes, through a redraw
  const readOnly = () => !SW.settings.can('chords');
  const active = () => SW.progWin && SW.progWin.isOpen() && SW.progWin.tab() === 'chart';

  /* ---------------- the chart, as it is (or as an old song would make it) ---------------- */
  function chartNow() {
    if (T.isChartShape()) {
      const uses = {};
      T.events().forEach(e => { if (e.id && e.k) uses[e.k] = (uses[e.k] || 0) + 1; });
      return { cards: T.chart().filter(e => !e.hidden), uses };
    }
    const f = T.chartFrom();
    const uses = {};
    f.pieces.forEach(pc => { uses[pc.k] = (uses[pc.k] || 0) + 1; });
    return { cards: f.chart, uses };
  }
  const count = () => chartNow().cards.length;

  /* ---------------- drawing ---------------- */
  const LO = 36, HI = 84;       // the dots: C2 … C6
  function cardHtml(e, n, tray) {
    const d = C.describeVoiced(e.chord, e.voice);                   // its own notes: named by them (D10)
    const notes = C.midis(e.chord, { voice: e.voice });
    const dots = notes.map(m => '<i style="bottom:' + Math.max(0, Math.min(100, (m - LO) / (HI - LO) * 100)).toFixed(1) + '%"></i>').join('');
    const title = d.roman + ' — ' + d.letter + ' · ' + d.tones.map(t => t.name).join(' ');
    const fl = flashK === e.id && Date.now() - flashAt < 700;
    if (tray) return '<div class="cc-card tl-card' + (d.inScale ? '' : ' out-of-scale') + '" data-tk="' + e.id + '" style="--c:' + d.color + ';--cink:' + SW.chordStrip.inkOn(d.color) + '" title="' + esc(title) + '">' +
      '<span class="cc-name" style="--ns:' + C.nameScale(C.nameOf(d)) + '">' + C.labelHTML(C.nameOf(d)) + '</span><span class="cc-other">' + C.labelHTML(C.otherNameOf(d)) + '</span></div>';   // the Time Line's tray
    return '<div class="cc-card' + (selK === e.id ? ' sel' : '') + (d.inScale ? '' : ' out-of-scale') + (fl ? ' flash' : '') + '" data-k="' + e.id + '" style="--c:' + d.color + ';--cink:' + SW.chordStrip.inkOn(d.color) + '" title="' + esc(title) + '">' +
      '<span class="cc-dots" aria-hidden="true">' + dots + '</span>' +
      '<span class="cc-name" style="--ns:' + C.nameScale(C.nameOf(d)) + '">' + C.labelHTML(C.nameOf(d)) + '</span>' +
      '<span class="cc-other">' + C.labelHTML(C.otherNameOf(d)) + '</span>' +
      (n ? '<span class="cc-uses" title="In the song ' + n + (n > 1 ? ' times' : ' time') + '">' + n + '</span>' : '') +
      (selK === e.id && !readOnly() ? '<button type="button" class="cc-tune" data-tune="' + e.id + '" title="Its notes (Enter)" aria-label="Its notes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2.5"/><circle cx="10" cy="17" r="2.5"/></svg></button>' : '') +
    '</div>';
  }
  /* Focus on a card (its notes) — Save brings you back here */
  function focusCard(k) {
    if (readOnly() || !SW.chordFocus || !SW.chordFocus.openCard(k)) return;
    releaseAll();
    SW.progWin.setTab('focus');
  }
  /* a chart just begun: the scale's I IV V vi (the panel's F S D A), faded — a tap puts one on */
  const STARTERS = ['f', 's', 'd', 'a'];
  const starters = cards => (cards.length < 4 ? STARTERS.filter(place => { const e = C.entry(place); return e && !cards.some(x => x.chord === C.toId(e.spec)); }) : []);
  function starterHtml(place, tray) {
    const e = C.entry(place);
    if (!e) return '';
    const d = C.describe(e.spec);
    return '<button type="button" class="cc-card cc-starter' + (tray ? ' tl-card' : '') + '" data-' + (tray ? 'tstarter' : 'starter') + '="' + place + '" style="--c:' + d.color + ';--cink:' + SW.chordStrip.inkOn(d.color) + '" title="Put ' + esc(d.roman) + ' on the chart">' +
      '<span class="cc-name" style="--ns:' + C.nameScale(C.nameOf(d)) + '">' + C.labelHTML(C.nameOf(d)) + '</span><span class="cc-other">' + C.labelHTML(C.otherNameOf(d)) + '</span></button>';
  }
  /* the ? boxes: the chart topped up to four, and any the round + opened */
  const blanks = n => (readOnly() ? 0 : Math.max(0, SLOTS - n) + extra);
  function blankHtml(i) {
    return '<button type="button" class="cc-card cc-blank' + (armed ? ' waiting' : '') + (armed && i === 0 ? ' armed' : '') + '" data-blank="' + i + '"' +
      ' aria-pressed="' + armed + '" title="' + (armed ? 'Play a chord and it goes here — a tap anywhere else stops' : 'Tap, then play a chord to put it here — or drag one here') + '">?</button>';
  }

  /* the board: the circle of fifths (every major and minor chord — the default, 2026-10-29) or the panel's
     blocks; a lesson that limits the chords keeps the panel (chord-circle.js allowed) */
  const circleOk = () => !!SW.chordCircle && SW.chordCircle.allowed();
  const circleOn = () => circleOk() && SW.settings.view.chartBoard !== 'panel';
  function boardHtml() {
    const circle = circleOn();
    let top;
    if (circle) top = SW.chordCircle.html();
    else {
      const offered = C.offered();
      let rows = '';
      C.SHAPE.forEach(row => {
        const cells = row.filter(cell => offered.indexOf(cell.place) !== -1).map(cell => SW.chordStrip.blockHtml(C.entry(cell.place), cell.w, { noEdit: true })).join('');
        if (cells) rows += '<div class="crow">' + cells + '</div>';
      });
      top = '<div class="strip-tower">' + (rows || '<p class="strip-empty">No chords in this set are switched on in Layout settings</p>') + '</div>';
    }
    const pick = circleOk() ? '<div class="seg cc-boardpick" role="group" aria-label="The chords as">' +
      '<button type="button" class="seg-btn' + (circle ? ' active' : '') + '" data-cboard="circle" aria-pressed="' + circle + '" title="Every major and minor chord, round the circle of fifths">Circle</button>' +
      '<button type="button" class="seg-btn' + (circle ? '' : ' active') + '" data-cboard="panel" aria-pressed="' + !circle + '" title="The chord panel’s blocks and keys">Panel</button></div>' : '';
    return '<div class="pw-board cc-board' + (circle ? ' circle' : '') + '">' + top +
      '<div class="cc-under"><div class="strip-mods" role="group" aria-label="Chord buttons Z X C V B">' + C.SLOT_KEYS.map(Mk => SW.chordStrip.modTabHtml(Mk, { toggle: true })).join('') + '</div>' +
        pick + (readOnly() ? '' : '<button type="button" class="cc-more">Create Chord</button>') + '</div>' +
    '</div>';
  }
  function render(body) {
    shown = chartNow();
    if (selK && !shown.cards.some(e => e.id === selK)) selK = null;
    const ro = readOnly();
    if (ro) armed = false;
    const n = blanks(shown.cards.length);
    if (!n) armed = false;
    const shelf = shown.cards.map(e => cardHtml(e, shown.uses[e.id] || 0)).join('') +
      Array.from({ length: n }, (x, i) => blankHtml(i)).join('') +
      (ro ? '' : '<button type="button" class="cc-addbox" title="Another box to fill" aria-label="Another box to fill">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>' +
        (shown.cards.length ? '' : '<p class="cc-hint">Drag your favorite chords onto the Chord Chart</p>'));      // the user's words (2026-10-29); gone once a chord is on
    body.innerHTML = '<div class="cc-hub' + (ro ? ' ro' : '') + '">' +
      '<div class="cc-shelf" id="cc-shelf">' + (shelf || '<p class="cc-none">No chords yet</p>') + '</div>' +
      '<div class="cc-mid">' + SW.songWave.html() + '</div>' +
      '<div class="cc-play-area">' + boardHtml() + '</div>' +
    '</div>';
    SW.chordStrip.fitLabels(body.querySelector('.cc-board'));
    markBoard();
    relight();
    SW.songWave.attach(body.querySelector('.cc-wave'));
  }
  /* a dot on a block whose chord (as the held buttons make it now) is on the chart */
  function markBoard() {
    if (!active() || !shown) return;
    const on = new Set(shown.cards.map(e => e.chord));
    bodyEl.querySelectorAll('.cc-board .cblock').forEach(b => {
      const e = C.entry(b.dataset.place);
      b.classList.toggle('cc-on', !!e && on.has(C.toId(C.withHeld(e.spec))));
    });
    bodyEl.querySelectorAll('.cc-circle .cc-cb[data-chord]').forEach(b => {
      const sp = C.parse(b.dataset.chord);
      b.classList.toggle('cc-on', !!sp && on.has(C.toId(C.withHeld(sp))));
    });
  }
  // the window relabels the blocks when a button is held (progression-window.js relabelBoard): the dots again after it
  SW.bus.on('mods:changed', () => { if (active()) { if (SW.chordCircle) SW.chordCircle.relabel(bodyEl); markBoard(); } });
  function flash(k) {
    flashK = k;
    flashAt = Date.now();
    const c = bodyEl.querySelector('.cc-card[data-k="' + k + '"]');
    if (!c) return;
    c.classList.remove('flash');
    void c.offsetWidth;
    c.classList.add('flash');
  }

  /* ---------------- changing the chart ---------------- */
  /* a chord played (a block, a key) goes on — unless it is there already (that card flashes) */
  function addPlace(place, beforeK) {
    if (readOnly()) return;
    const e = C.entry(place);
    if (!e) return;
    const id = C.toId(C.withHeld(e.spec));
    const spec = { chord: id };
    if (!C.heldMods.size) spec.place = place;     // the panel's own chord: it follows the scale (D16)
    addSpec(spec, beforeK);
  }
  function addSpec(spec, beforeK) {
    const cards = chartNow().cards;
    const have = cards.find(x => x.chord === spec.chord && !x.voice);
    if (have) { selK = have.id; SW.progWin.render(); flash(have.id); return; }
    const k = T.chartAdd(spec, beforeK || undefined);
    if (!k) return;
    if (cards.length >= SLOTS && extra > 0) extra--;     // it filled a box the + opened (below four, the four shrink by themselves)
    selK = k;
    SW.progWin.render();
    flash(k);
  }
  /* a circle block's chord, as the held buttons make it (no place: it is that chord, in any scale) */
  function addChord(id, beforeK) {
    if (readOnly()) return;
    const sp = C.parse(id);
    if (sp) addSpec({ chord: C.toId(C.withHeld(sp)) }, beforeK);
  }
  function removeCard(k) {
    if (readOnly()) return;
    const now = chartNow();
    const e = now.cards.find(x => x.id === k);
    if (!e) return;
    const n = now.uses[k] || 0;
    const go = keep => { if (selK === k) selK = null; T.chartRemove(k, keep); };
    if (!n) { go(false); return; }
    const name = C.nameOf(C.describeVoiced(e.chord, e.voice));
    ask({
      title: C.labelHTML(name) + ' is in the song ' + (n === 1 ? 'once' : n + ' times'),
      buttons: [
        { label: 'Take it out of the song too', primary: true, act: () => go(false) },
        { label: 'Keep those spots', act: () => go(true) }
      ]
    });
  }
  /* Create Chord: any chord, built note by note in Focus — Put it on the chart */
  function moreChords() {
    if (readOnly() || !SW.chordFocus) return;
    releaseAll();
    SW.chordFocus.openNew();
    SW.progWin.setTab('focus');
  }

  /* ---------------- sound ---------------- */
  const holds = new Map();      // holder → { voice } a card · { held, els } a block, a circle block or a key held down
  function holdCard(k, holder) {
    const e = chartNow().cards.find(x => x.id === k);
    if (!e) return;
    release(holder);
    const list = C.midis(e.chord, { voice: e.voice });
    if (!list.length) return;
    holds.set(holder, { voice: SW.audio.holdChord(list.map(SW.music.midiToFreq)) });
    C.announce(e.chord, list, 'chart');
  }
  function holdPlace(place, holder) {
    if (C.offered().indexOf(place) === -1) {
      ui.toast(C.placeShown(place) ? 'That chord is switched off in Layout settings' : 'That chord is outside the ' + C.CHORD_SETS[C.setIndex()].name + ' set — the set button on the panel shows more');
      return false;
    }
    release(holder);
    C.holdPlace(place, holder, 'chart');
    const e = C.entry(place);
    lightHold(holder, place, e && e.spec);
    return true;
  }
  /* a circle block: its chord, held */
  function holdChord(id, holder) {
    release(holder);
    if (!C.holdSpec(id, holder, 'chart')) return false;
    lightHold(holder, null, C.parse(id));
    return true;
  }
  /* what lights while a chord is held: the panel's block for its place, and the circle's block for the same chord */
  const samePitch = (a, b) => !!(a && b) && a.q === b.q && Theory.degreeSemis(a.root) === Theory.degreeSemis(b.root);
  function blocksFor(place, spec) {
    const els = place ? [...bodyEl.querySelectorAll('.cc-board .cblock[data-place="' + place + '"]')] : [];
    if (spec) bodyEl.querySelectorAll('.cc-circle .cc-cb[data-chord]').forEach(b => { if (samePitch(C.parse(b.dataset.chord), spec)) els.push(b); });
    return els;
  }
  function lightHold(holder, place, spec) {
    const els = blocksFor(place, spec);
    els.forEach(b => b.classList.add('is-on'));
    holds.set(holder, { held: true, place, spec, els });
  }
  /* drawn again while chords are held (a chord put in a waiting ? box): they light again */
  function relight() {
    holds.forEach(h => {
      if (!h.held) return;
      h.els = blocksFor(h.place, h.spec);
      h.els.forEach(b => b.classList.add('is-on'));
    });
  }
  function release(holder) {
    const h = holds.get(holder);
    if (!h) return;
    holds.delete(holder);
    if (h.voice) h.voice.release();
    if (h.held) C.releaseHold(holder);
    (h.els || []).forEach(b => { if (![...holds.values()].some(x => x.els && x.els.indexOf(b) !== -1)) b.classList.remove('is-on'); });
  }
  function releaseAll() { [...holds.keys()].forEach(release); }

  /* ---------------- gestures ---------------- */
  let press = null;             // { kind: 'card' | 'block', k | place, x, y, el, moved, ghost, id }
  bodyEl.addEventListener('pointerdown', e => {
    if (!active() || e.button > 0) return;
    const modTab = e.target.closest('.cc-board .cmod');
    if (modTab) {                                      // a toggle here: on, and off at the next press
      e.preventDefault();
      if (modTab.classList.contains('empty')) return;
      toggleMod(modTab.dataset.mod);
      return;
    }
    const block = e.target.closest('.cc-board .cblock');
    if (block) {
      e.preventDefault();
      const holder = 'p' + e.pointerId;
      if (!holdPlace(block.dataset.place, holder)) return;
      press = { kind: 'block', place: block.dataset.place, x: e.clientX, y: e.clientY, el: block, moved: false, id: e.pointerId, holder };
      return;
    }
    const cb = e.target.closest('.cc-circle .cc-cb[data-chord]');
    if (cb) {
      e.preventDefault();
      const holder = 'p' + e.pointerId;
      if (!holdChord(cb.dataset.chord, holder)) return;
      press = { kind: 'circle', chord: cb.dataset.chord, x: e.clientX, y: e.clientY, el: cb, moved: false, id: e.pointerId, holder };
      return;
    }
    if (e.target.closest('.cc-tune')) return;                   // its button: a click opens Focus
    const card = e.target.closest('.cc-card[data-k]');
    if (card) {
      e.preventDefault();
      const k = card.dataset.k, holder = 'p' + e.pointerId;
      holdCard(k, holder);
      if (selK !== k) { selK = k; bodyEl.querySelectorAll('.cc-card.sel').forEach(c => c.classList.remove('sel')); card.classList.add('sel'); }
      press = { kind: 'card', k, x: e.clientX, y: e.clientY, el: card, moved: false, id: e.pointerId, holder };
    }
  });
  const shelfEl = () => bodyEl.querySelector('#cc-shelf');
  const overShelf = (x, y) => { const s = shelfEl(); if (!s) return false; const r = s.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top - 12 && y <= r.bottom + 12; };
  /* the card a drop goes in before (null: at the end) */
  function beforeAt(x, skip) {
    const cards = [...bodyEl.querySelectorAll('#cc-shelf .cc-card[data-k]')].filter(c => c !== skip);
    const c = cards.find(el => { const r = el.getBoundingClientRect(); return x < r.left + r.width / 2; });
    return c ? c.dataset.k : null;
  }
  function showGap(beforeK) {
    const s = shelfEl();
    if (!s) return;
    let gap = s.querySelector('.cc-gap');
    if (beforeK === undefined) { if (gap) gap.remove(); return; }
    if (!gap) { gap = document.createElement('span'); gap.className = 'cc-gap'; }
    const ref = beforeK ? s.querySelector('.cc-card[data-k="' + beforeK + '"]') : (s.querySelector('.cc-blank') || s.querySelector('.cc-addbox'));
    if (ref) s.insertBefore(gap, ref); else s.appendChild(gap);
  }
  window.addEventListener('pointermove', e => {
    if (!press || e.pointerId !== press.id) return;
    if (!press.moved) {
      if (readOnly() || Math.hypot(e.clientX - press.x, e.clientY - press.y) < 8) return;
      press.moved = true;
      release(press.holder);                           // a drag is not a chord held
      const g = press.el.cloneNode(true);
      g.classList.remove('sel', 'is-on', 'flash');
      g.classList.add('cc-ghost');
      g.style.width = press.el.offsetWidth + 'px';
      g.style.height = press.el.offsetHeight + 'px';
      document.body.appendChild(g);
      press.ghost = g;
      if (press.kind === 'card') press.el.classList.add('cc-lifted');
    }
    press.ghost.style.left = e.clientX + 'px';
    press.ghost.style.top = e.clientY + 'px';
    const over = overShelf(e.clientX, e.clientY);
    shelfEl() && shelfEl().classList.toggle('drop', over);
    press.ghost.classList.toggle('cc-leaving', press.kind === 'card' && !over);
    showGap(over ? beforeAt(e.clientX, press.el) : undefined);
  });
  function endPress(e, cancelled) {
    if (!press || e.pointerId !== press.id) return;
    const p = press;
    press = null;
    release(p.holder);
    if (p.ghost) p.ghost.remove();
    showGap(undefined);
    if (shelfEl()) shelfEl().classList.remove('drop');
    if (p.kind === 'card') p.el.classList.remove('cc-lifted');
    if (cancelled) return;
    if (p.moved) {
      const over = overShelf(e.clientX, e.clientY);
      if (p.kind === 'block') { if (over) addPlace(p.place, beforeAt(e.clientX)); return; }
      if (p.kind === 'circle') { if (over) addChord(p.chord, beforeAt(e.clientX)); return; }
      if (over) {
        const before = beforeAt(e.clientX, p.el);
        if (before !== p.k) T.chartMove(p.k, before === null ? undefined : before);
      } else removeCard(p.k);                         // dragged off the chart
      return;
    }
    if (p.kind === 'block' && armed) addPlace(p.place);
    if (p.kind === 'circle' && armed) addChord(p.chord);
    if (p.kind === 'card') {                                       // a second tap soon after: Focus
      const now = Date.now();
      if (lastTap && lastTap.k === p.k && now - lastTap.t < 450) { lastTap = null; focusCard(p.k); return; }
      lastTap = { k: p.k, t: now };
      SW.progWin.render();                                           // its tune button shows
    }
  }
  let lastTap = null;           // { k, t }: a card tapped — a second tap soon after opens Focus
  window.addEventListener('pointerup', e => endPress(e, false));
  window.addEventListener('pointercancel', e => endPress(e, true));
  bodyEl.addEventListener('contextmenu', e => { if (active() && e.target.closest('.cc-card, .cblock, .cc-cb, .cmod')) e.preventDefault(); });

  bodyEl.addEventListener('click', e => {
    if (!active()) return;
    const t = e.target;
    if (t.closest('.cc-blank')) { armed = !armed; SW.progWin.render(); return; }
    if (t.closest('.cc-addbox')) { extra++; armed = true; SW.progWin.render(); return; }
    const tune = t.closest('.cc-tune');
    if (tune) { focusCard(tune.dataset.tune); return; }
    if (t.closest('.cc-more')) { armed = false; moreChords(); return; }
    const nm = t.closest('[data-cnames]');
    if (nm) { SW.chordCircle.setNames(nm.dataset.cnames); SW.progWin.render(); return; }
    const bp = t.closest('[data-cboard]');
    if (bp) { SW.settings.setView({ chartBoard: bp.dataset.cboard }, { quiet: true }); SW.progWin.render(); return; }
  });
  /* a waiting ? box stops waiting at a click anywhere else in the window (the board, its buttons, the boxes, + and Create Chord aside) */
  sheetEl.addEventListener('click', e => {
    if (!armed || !active()) return;
    if (e.target.closest && e.target.closest('.cc-board, .cc-blank, .cc-addbox, .cc-more')) return;
    armed = false;
    bodyEl.querySelectorAll('.cc-blank').forEach(b => { b.classList.remove('waiting', 'armed'); b.setAttribute('aria-pressed', 'false'); });
  }, true);

  /* ---------------- keys (the window hands them over while the hub is on top) ---------------- */
  function keyDown(e) {
    const k = e.key || '';
    if (e.metaKey || e.ctrlKey) return false;
    const key1 = k.length === 1 ? k.toLowerCase() : null;
    if (key1 && C.isModKey(key1)) { e.preventDefault(); if (!e.repeat) toggleMod(key1.toUpperCase()); return true; }   // app.js leaves it on at keyup (latches)
    const place = key1 && !e.altKey ? C.placeForKey(key1) : null;
    if (place) {
      e.preventDefault();
      if (!e.repeat && holdPlace(place, 'k' + e.code) && armed) addPlace(place);
      return true;
    }
    switch (k) {
      case ' ': e.preventDefault(); if (!e.repeat) SW.songWave.toggle(); return true;
      case 'ArrowLeft': case 'ArrowRight': {
        e.preventDefault();
        const cards = chartNow().cards;
        if (!cards.length) return true;
        const i = cards.findIndex(x => x.id === selK);
        const n = cards[i < 0 ? (k === 'ArrowLeft' ? cards.length - 1 : 0) : Math.max(0, Math.min(cards.length - 1, i + (k === 'ArrowLeft' ? -1 : 1)))];
        selK = n.id;
        SW.progWin.render();
        const list = C.midis(n.chord, { voice: n.voice });
        if (list.length) { SW.audio.playChordFrequencies(list.map(SW.music.midiToFreq)); C.announce(n.chord, list, 'chart'); }
        return true;
      }
      case 'Delete': case 'Backspace':
        if (selK && !readOnly()) { e.preventDefault(); removeCard(selK); }
        return true;
      case 'Enter':
        if (selK) { e.preventDefault(); focusCard(selK); }
        return true;
    }
    return true;                 // the melody keys are quiet while the window is open
  }
  document.addEventListener('keyup', e => release('k' + e.code));
  window.addEventListener('blur', releaseAll);

  /* ---------------- a question (D5 now; Focus and the Time Line later) ----------------
     Over the window: a title, its answers, and Keep editing (Esc, or a tap
     outside) — which answers nothing. */
  let askEl = null;
  function ask(o) {
    closeAsk();
    askEl = document.createElement('div');
    askEl.className = 'cc-ask';
    askEl.innerHTML = '<div class="cc-ask-card" role="alertdialog" aria-modal="true"><h3>' + o.title + '</h3>' +
      '<div class="cc-ask-btns">' + o.buttons.map((b, i) => '<button type="button" class="btn' + (b.primary ? ' btn-primary' : '') + '" data-ask="' + i + '">' + esc(b.label) + '</button>').join('') + '</div>' +
      '<button type="button" class="cc-keep" data-ask="keep">Keep editing</button></div>';
    askEl.addEventListener('click', e => {
      const b = e.target.closest('[data-ask]');
      if (!b && e.target !== askEl) return;
      const pick = b && b.dataset.ask !== 'keep' ? o.buttons[Number(b.dataset.ask)] : null;
      closeAsk();
      if (pick) pick.act();
    });
    sheetEl.querySelector('.sheet').appendChild(askEl);
    const first = askEl.querySelector('.btn-primary, .btn');
    if (first) first.focus();
  }
  function closeAsk() { if (askEl) { askEl.remove(); askEl = null; } }
  // Esc answers the question, not the window (before app.js closes the sheet)
  window.addEventListener('keydown', e => { if (askEl && e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); closeAsk(); } }, true);

  function closed() {
    armed = false;
    releaseAll();
    closeAsk();
    SW.songWave.stop();
  }

  /* Z X C V B on the Chord Chart: toggles — on, then off at the next press (the tab's look follows: progression-window
     relabelBoard on mods:changed); app.js's keyup lets go of a held button everywhere else */
  function toggleMod(Mk) { C.setMod(Mk, !C.heldMods.has(Mk)); }
  const latches = () => active() && SW.progWin.onTop();

  // another song: the four boxes again, none extra
  SW.bus.on('song:opened', () => { extra = 0; armed = false; });

  /* a card chosen from elsewhere (Focus saved it): selected, and it flashes */
  function select(k) { selK = k; flash(k); }

  const asking = () => !!askEl;

  SW.chordChart = { render, keyDown, closed, count, select, ask, asking, chartNow, cardHtml, starterHtml, starters, latches };
})();

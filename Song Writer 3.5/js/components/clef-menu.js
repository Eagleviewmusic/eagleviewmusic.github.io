/* ==========================================================================
   COMPONENT — treble or bass, from the clef itself (2026-11-04)
                                                              #clef-popover
   --------------------------------------------------------------------------
   The user: on the Notation page, double-click the treble clef for the
   choice of the bass clef. The notes go down an octave and sit correctly on
   it, and the Pitch page plays that octave too (core.js THE CLEF IN EFFECT;
   the clef is a part's, parts.js `clef`, so Part 1 can stay on treble over a
   Part 2 on bass).

   The clef is drawn in an SVG the pointer goes straight through, so it is
   found by where it is drawn (.clef-ink, staff.js clefInk): the page's and
   the other parts'. Everything here runs in the capture phase on the
   document, before the score's own listeners, and a press that lands on a
   clef goes no further: a double click on a clef next to the first note
   must not select that note or open its word, and on another part's staff
   must not bring that part onto the page.

   Only where the song may be edited (the same rule as Options → Parts);
   elsewhere a clef is only a clef and presses go where they always did.

   API  SW.clefMenu.open(el) · at(x, y)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const ui = SW.ui;
  const score = document.getElementById('score');
  const pop = document.getElementById('clef-popover');
  if (!score || !pop) return;

  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const PAD = 4;                     // px round the glyph that still count as on it
  const DOUBLE_TAP = { ms: 420, px: 28 };   // as score.js takes a double tap
  let part = 0;                      // the part the menu is open for
  let openedAt = 0;

  const editable = () => !!S.editing && !S.present && SW.settings.can('structure');

  /* the clef drawn at this point of the window, the nearest if two reach it */
  function at(x, y) {
    let best = null, bestD = Infinity;
    score.querySelectorAll('.clef-ink').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || x < r.left - PAD || x > r.right + PAD || y < r.top - PAD || y > r.bottom + PAD) return;
      const d = Math.abs(y - (r.top + r.bottom) / 2);
      if (d < bestD) { bestD = d; best = el; }
    });
    return best;
  }
  /* the clef this event is on, if the choice is the user's to make here */
  function hit(e) {
    if (document.body.dataset.page !== 'notation' || !editable()) return null;
    const t = e.target;
    if (!t || !t.closest || !t.closest('#score') || t.closest('.line-head, input, button')) return null;
    return at(e.clientX, e.clientY);
  }

  /* a clef on its five lines, for the button */
  function picture(id) {
    const K = SW.staff.kit;
    const sp = 8, k = sp / K.UNITS, W = 52, H = 62, top = 15;
    const y = i => top + i * sp;                       // the lines, from the top
    let ink = '';
    for (let i = 0; i < 5; i++) ink += K.rect(0, y(i) - 0.4, W, 0.8, 'currentColor');
    ink += K.at(M.CLEFS[id].glyph, 12, y(id === 'bass' ? 1 : 3), k, 'fill="currentColor"');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + ink + '</svg>';
  }
  function fill() {
    const now = SW.parts.clef(part);
    const title = SW.parts.count() > 1 ? SW.parts.label(part) + ' clef' : 'Clef';
    pop.innerHTML = '<div class="popover-title">' + esc(title) + '</div>' +
      '<div class="clef-choices" role="radiogroup" aria-label="' + esc(title) + '">' +
      Object.keys(M.CLEFS).map(id => {
        const on = id === now;
        return '<button type="button" class="clef-choice' + (on ? ' active' : '') + '" role="radio" aria-checked="' + on + '" data-clef="' + id + '">' + picture(id) + esc(M.CLEFS[id].name) + '</button>';
      }).join('') + '</div>' +
      '<div class="clef-note">' + ui.note('clef.octave', 'The bass clef sounds an octave lower than the treble clef, on the Pitch page too. Its notes run from A1 to A4.') + '</div>';
  }
  function open(el) {
    part = Number(el.dataset.part) || 0;
    ui.closeAllPopovers();
    fill();
    pop.classList.add('show');
    openedAt = performance.now();
    const r = el.getBoundingClientRect();
    ui.positionPopover({ getBoundingClientRect: () => r }, pop);
  }

  // the second press of a double click would select the nearest word's text
  document.addEventListener('mousedown', e => { if (e.detail > 1 && hit(e)) e.preventDefault(); }, true);
  document.addEventListener('dblclick', e => {
    const el = hit(e);
    if (!el) return;
    e.stopPropagation();
    open(el);
  }, true);
  /* A press on a clef stops there. It still shuts an open popover, which its
     click would have done on the way up (core.js) — but not the one a double
     tap has just opened: the click that tap makes comes after it. */
  document.addEventListener('click', e => {
    if (!hit(e)) return;
    e.stopPropagation();
    if (performance.now() - openedAt > 500) ui.closeAllPopovers();
  }, true);
  /* a double tap on a finger or a pen (an iPad sends no dblclick) */
  let lastTap = null;
  document.addEventListener('pointerup', e => {
    if (e.pointerType === 'mouse') return;
    const el = hit(e);
    if (!el) { lastTap = null; return; }
    e.stopPropagation();
    const now = performance.now();
    if (lastTap && now - lastTap.t < DOUBLE_TAP.ms && Math.hypot(e.clientX - lastTap.x, e.clientY - lastTap.y) < DOUBLE_TAP.px) {
      lastTap = null;
      open(el);
    } else lastTap = { t: now, x: e.clientX, y: e.clientY };
  }, true);

  pop.addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest ? e.target.closest('[data-clef]') : null;
    if (!b) return;
    SW.parts.setMeta(part, { clef: b.dataset.clef });
    ui.closeAllPopovers();
    sayFolded();
  });
  /* Notes that would land beyond the clef's range sound and are drawn an
     octave nearer (core.js): a change the song's writer should hear about. */
  function sayFolded() {
    let n = 0;
    SW.parts.song(part).lines.forEach(le => le.events.forEach(ev => { (ev.pitches || []).forEach(p => { if (p.folded) n++; }); }));
    if (n) ui.toast(n + (n === 1 ? ' note was' : ' notes were') + ' outside A1 to A4, so ' + (n === 1 ? 'it moved' : 'they moved') + ' an octave to fit. Choosing Treble puts ' + (n === 1 ? 'it' : 'them') + ' back.', 5000);
  }
  SW.bus.on('score:loaded', () => pop.classList.remove('show'));   // another song, or another part drawn: its number no longer means this one

  SW.clefMenu = { open, at };
})();

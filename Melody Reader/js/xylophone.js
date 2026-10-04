/* ==========================================================================
   Melody Reader — xylophone.js
   --------------------------------------------------------------------------
   RR.Xylo — the Rainbow Xylophone (App Projects/rainbow-xylophone,
   components/Xylophone.tsx and Bar.tsx), ported to plain JS (ENGINE §6):
   the dark-brown frame and its rails, rainbow bars 4 % shorter each, white
   bolts, Fredoka letters, and the key number at each bar's foot.

   Input. Pointer events on the frame, with pointer capture and
   elementFromPoint on every move, so a finger — or a held mouse button, of
   either side, as smartboards send — sliding across the bars rings each one
   it enters. Several pointers at once. Keys come from app.js (press()).

   States (classes on a bar): struck · right · demo · glow · greyed.
   A greyed bar is silent and its key does nothing.

   RR.Xylo.onHit(id, event) is set by the game.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const el = RR.$('#xylo');
  let count = 0;

  function build(n) {
    count = n;
    el.classList.toggle('twelve', n > 10);
    const shortest = 100 - (n - 1) * 4;
    const topR = Math.round(50 - shortest / 2 + 6), botR = Math.round(50 + shortest / 2 - 6);
    el.innerHTML =
      '<svg class="rails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="3" y1="13" x2="97" y2="' + topR + '"/><line x1="3" y1="87" x2="97" y2="' + botR + '"/></svg>' +
      '<div class="bars">' + RR.BARS.slice(0, n).map(b =>
        '<div class="bar" data-id="' + b.id + '" style="--c:' + b.colour + ';--len:' + b.len + '%" role="button" tabindex="' + (b.i === 0 ? 0 : -1) + '" aria-label="' + b.letter + b.octave + ', key ' + (b.key === '-' ? 'minus' : b.key === '=' ? 'equals' : b.key) + '">' +
        '<i class="bolt top"></i><b class="letter">' + b.letter + '</b><span class="num">' + (b.key === '-' ? '−' : b.key) + '</span><i class="bolt bottom"></i></div>').join('') + '</div>' +
      '<div class="frame-end left"></div><div class="frame-end right"></div>';
  }
  const barEl = id => el.querySelector('.bar[data-id="' + id + '"]');

  function flash(id, cls, ms) {
    const b = barEl(id); if (!b) return;
    b.classList.remove(cls); void b.offsetWidth; b.classList.add(cls);
    clearTimeout(b['_t' + cls]);
    b['_t' + cls] = setTimeout(() => b.classList.remove(cls), ms);
  }
  function setGlow(id) {
    el.querySelectorAll('.bar.glow').forEach(b => { if (b.dataset.id !== id) b.classList.remove('glow'); });
    const b = id && barEl(id); if (b) b.classList.add('glow');
  }
  function setGreyed(live) {
    el.querySelectorAll('.bar').forEach(b => {
      const off = !!live && !live.has(b.dataset.id);
      b.classList.toggle('greyed', off);
      b.setAttribute('aria-disabled', off ? 'true' : 'false');
    });
    // the tab stop must be a live bar
    const stop = el.querySelector('.bar[tabindex="0"]');
    if (!stop || stop.classList.contains('greyed')) {
      const first = el.querySelector('.bar:not(.greyed)');
      el.querySelectorAll('.bar').forEach(x => { x.tabIndex = x === first ? 0 : -1; });
    }
  }
  function setLabels(letters, nums) {
    el.classList.toggle('no-letters', !letters);
    el.classList.toggle('no-nums', !nums);
  }
  const live = id => { const b = barEl(id); return !!b && !b.classList.contains('greyed'); };

  /* a bar played — by a finger, the mouse, a pen or a key */
  function press(id, e) {
    if (!live(id)) return;
    RR.Sound.strike(id);
    flash(id, 'struck', 120);
    if (RR.Xylo.onHit) RR.Xylo.onHit(id, e);
  }

  const held = new Map();
  function barAt(x, y) {
    const t = document.elementFromPoint(x, y);
    const b = t && t.closest ? t.closest('.bar') : null;
    return b && el.contains(b) && !b.classList.contains('greyed') ? b.dataset.id : null;
  }
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    try { el.setPointerCapture(e.pointerId); } catch (_) { /* not every pointer can be captured */ }
    const id = barAt(e.clientX, e.clientY);
    held.set(e.pointerId, id);
    if (id) press(id, e);
  });
  el.addEventListener('pointermove', e => {
    if (!held.has(e.pointerId)) return;
    const id = barAt(e.clientX, e.clientY);
    if (id !== held.get(e.pointerId)) { held.set(e.pointerId, id); if (id) press(id, e); }
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.addEventListener(t, e => held.delete(e.pointerId)));
  el.addEventListener('contextmenu', e => e.preventDefault());

  /* Keyboard and switch users (the number keys work from anywhere): the
     xylophone is one stop in the Tab order — one bar has tabindex 0, the
     rest -1 (a "roving" tab stop). The arrow keys move along the bars,
     Home and End go to the ends, Enter or Space strikes the bar. */
  function liveBars() { return Array.from(el.querySelectorAll('.bar')).filter(b => !b.classList.contains('greyed')); }
  function focusBar(b) {
    if (!b) return;
    el.querySelectorAll('.bar').forEach(x => { x.tabIndex = x === b ? 0 : -1; });
    b.focus();
  }
  el.addEventListener('keydown', e => {
    const b = e.target.closest && e.target.closest('.bar');
    if (!b) return;
    const bars = liveBars(), i = bars.indexOf(b);
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); focusBar(bars[Math.min(bars.length - 1, i + 1)]); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); focusBar(bars[Math.max(0, i - 1)]); }
    else if (e.key === 'Home') { e.preventDefault(); focusBar(bars[0]); }
    else if (e.key === 'End') { e.preventDefault(); focusBar(bars[bars.length - 1]); }
    else if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
      e.preventDefault(); e.stopPropagation();          // the bar's, not Play's or Next's
      press(b.dataset.id, e);
    }
  });
  el.addEventListener('focusin', e => {
    const b = e.target.closest && e.target.closest('.bar');
    if (b) el.querySelectorAll('.bar').forEach(x => { x.tabIndex = x === b ? 0 : -1; });
  });

  RR.Xylo = {
    build, flash, setGlow, setGreyed, setLabels, live, press,
    count: () => count,
    centre(id) { const b = barEl(id); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height * 0.22 }; },
    onHit: null
  };
})();

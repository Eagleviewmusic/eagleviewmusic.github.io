/* ==========================================================================
   Melody Reader — app.js
   --------------------------------------------------------------------------
   RR.App — starts everything and wires the page:

     the keys       1 2 3 4 5 6 7 8 9 0 − = (and the number pad) play the
                    bars; Space is Hear it (Practice, or a try done) or
                    Count me in (the game); Enter is I'm ready (Practice)
                    or Next (a try done); Escape closes a window
     the buttons    Hear it · Count me in · the pace pill · I'm ready ·
                    Again · Next · the level chip · the score chip · Settings
     the start      a lesson link if the address has one; else the practice
                    or level this browser was last on
     the sound      woken on the first touch or key (the family's priming)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game;

  const shelfOpen = () => !!document.querySelector('.evm-shelf.show');
  function anyWindow() { return RR.Settings.isOpen() || RR.Board.isOpen() || RR.Melodies.isOpen() || shelfOpen() || !!document.querySelector('.modal.ask'); }
  function closeWindows() {
    if (shelfOpen()) return;                     // the shelf closes itself on Escape
    if (RR.Settings.isOpen()) RR.Settings.close();
    if (RR.Board.isOpen()) RR.Board.close();
    if (RR.Melodies.isOpen()) RR.Melodies.close();
  }

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target && e.target.tagName;
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
    if (e.key === 'Escape') { if (RR.Maker.active && !anyWindow()) RR.Maker.cancel(); else closeWindows(); return; }
    if (anyWindow()) return;
    if (RR.Maker.active) {                       // Make a melody: ⌫ takes back, Space hears it
      if (e.key === 'Backspace') { e.preventDefault(); RR.Maker.undo(); return; }
      if (e.key === ' ' && tag !== 'BUTTON') { e.preventDefault(); RR.Maker.hear(); return; }
      if ((e.key === 'r' || e.key === 'R') && !e.repeat) { e.preventDefault(); RR.Maker.add(null); return; }
    }
    let k = e.key;
    if (/^Numpad\d$/.test(e.code)) k = e.code.slice(6);
    const i = RR.KEYS.indexOf(k);
    if (i >= 0) {
      e.preventDefault();
      if (!e.repeat && i < RR.Xylo.count()) RR.Xylo.press(RR.BARS[i].id, e);
      return;
    }
    if (e.repeat || RR.Maker.active) return;
    // Space and Enter on a focused button belong to the button
    if ((e.key === ' ' || e.key === 'Enter') && tag === 'BUTTON') return;
    if (e.key === ' ') {
      e.preventDefault();
      if (G.canHear() || G.hearing) G.hearIt();
      else if (G.stage === 'game' && G.phase === 'ready' && !G.started) RR.Beat.start();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (G.overlay) { const b = $('#rounddone .pill-btn.go') || $('#rounddone .pill-btn'); if (b) b.click(); }
      else if (G.stage === 'practice') G.toGame();
      else if (G.phase === 'done') G.next();          // never mid-try: Enter, Enter would skip the melody
    }
  });

  $('#btn-play').addEventListener('click', () => G.hearIt());
  $('#btn-count').addEventListener('click', () => RR.Beat.start());
  $('#btn-ready').addEventListener('click', () => G.toGame());
  // Slow → Moderate → Fast: the player's, kept with the browser (it never makes a practice Custom)
  $('#pace').addEventListener('click', () => {
    const P = RR.Points.PACES, i = P.findIndex(p => p.id === RR.device.pace);
    RR.device.pace = P[(i + 1) % P.length].id; RR.saveDevice();
    G.drawSides();
  });
  $('#btn-again').addEventListener('click', () => G.again());
  $('#btn-next').addEventListener('click', () => G.next());
  $('#gear').addEventListener('click', () => { if (!RR.Maker.active) RR.Settings.open(); });
  $('#mel-btn').addEventListener('click', () => { if (!RR.Maker.active) RR.Melodies.open(); });
  $('#level-chip').addEventListener('click', () => { if (!RR.Maker.active) RR.Settings.open(G.mode.kind === 'lesson' ? 'leave' : 'level'); });
  $('#score-chip').addEventListener('click', () => { if (!RR.Maker.active) RR.Board.open(); });
  $('#settings').addEventListener('click', e => { if (e.target === $('#settings') || e.target.closest('[data-close]')) RR.Settings.close(); });
  $('#board').addEventListener('click', e => { if (e.target === $('#board') || e.target.closest('[data-close]')) RR.Board.close(); });

  // the first touch or key wakes the sound, and a sleeping speaker with it
  let primed = false;
  const wake = () => { if (primed) return; primed = true; RR.Sound.prime(0.3); };
  document.addEventListener('pointerdown', wake, { capture: true });
  document.addEventListener('keydown', wake, { capture: true });

  /* the practice this browser was last on (or a lesson link's) */
  function restore() {
    const d = RR.device.practice;
    if (d && d.practice && (d.kind === 'custom' || d.kind === 'mine')) {
      G.usePractice(d.practice, d.kind === 'mine' ? { kind: 'mine', name: String(d.name || 'Mine') } : { kind: 'custom', from: d.from || null });
    } else {
      G.selectLevel(Math.max(1, Math.min(RR.LEVELS.length, RR.device.level | 0 || 1)));
    }
  }
  RR.App = { restore };

  /* a melody set that arrived by link: say what happened, and show it */
  function arrived(result) {
    const rec = result && result.id && RR.Sets.get(result.id);
    if (!rec) return;
    const t = '“' + rec.title + '”';
    RR.toast({ added: t + ' is in My melodies — play it, or Save my copy to change it', same: t + ' is already in My melodies',
      matched: t + ' is already in My melodies', updated: 'Updated to the newer ' + t, kept: 'You have a newer copy of ' + t }[result.action] || t + ' is in My melodies');
    RR.Melodies.open(rec.id);
  }
  /* the shelf took a set away (a book put back) that was being played: play the level again */
  function shelfChanged() {
    if (G.setup.set && G.setup.set !== 'lesson' && !RR.Sets.get(G.setup.set)) {
      RR.device.set = null; RR.saveDevice(); G.setup.set = null; G.queue = []; G.applyInstrument(); G.newRound();
    }
    RR.Melodies.render(); G.drawChips();
  }

  function start() {
    RR.Xylo.build(10);
    const lesson = RR.Lesson.fromUrl();
    let got = null;
    if (lesson) {
      G.usePractice(lesson.practice, { kind: 'lesson', name: lesson.name });
      document.title = lesson.name + ' · Melody Reader';
    } else {
      got = RR.Sets.receiveFromUrl();
      restore();
    }
    RR.Sets.startShelf(shelfChanged);
    if (got) arrived(got);
    if (window.self !== window.top) document.documentElement.classList.add('in-iframe');
  }
  start();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => G.draw());
})();

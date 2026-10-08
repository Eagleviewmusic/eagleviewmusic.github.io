/* ==========================================================================
   Melody Reader — app.js
   --------------------------------------------------------------------------
   RR.App — starts everything and wires the page:

     the keys       1 2 3 4 5 6 7 8 9 0 − = (and the number pad) play the
                    bars; Space is Listen (Practice, or a try done) or, in
                    a Test with the metronome on, the count-in; Enter is
                    Test (from Practice) or Next (a try done); Escape
                    closes a window, or stops a count-in (as tapping its
                    Get ready card does: back to Practice)
     the buttons    Listen · Practice / Test · the metronome · Start over ·
                    Next · the level chip · the score chip · Settings ·
                    ‹ Home · the Melody Reader name (the home page)
     the start      a lesson link if the address has one (straight to the
                    music); else the practice or level this browser was
                    last on, and the home page (home.js, 2026-10-07)
     the views      the keys above belong to the music; on the home page
                    and My stats they do nothing (Escape on My stats goes
                    back)
     the sound      woken on the first touch or key (the family's priming)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game;

  const shelfOpen = () => !!document.querySelector('.evm-shelf.show');
  function anyWindow() { return RR.Settings.isOpen() || RR.Board.isOpen() || RR.Melodies.isOpen() || RR.View.songsOpen() || shelfOpen() || !!document.querySelector('.modal.ask'); }
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
    if (e.key === 'Escape') {
      if (RR.View.current !== 'play') { if (!anyWindow() && RR.View.current === 'stats') RR.View.back(); else closeWindows(); return; }
      if (G.pickOpen()) { G.closePick(); $('#btn-metro').focus(); }
      else if (RR.Maker.active && !anyWindow()) RR.Maker.cancel();
      else if (G.phase === 'countin' && !anyWindow()) G.stopCountIn();
      else closeWindows();
      return;
    }
    if (anyWindow() || RR.View.current !== 'play') return;
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
      else G.roll();                               // a Test with the metronome on, waiting: count in
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (G.overlay) { const b = $('#rounddone .pill-btn.go') || $('#rounddone .pill-btn'); if (b) b.click(); }
      else if (G.stage === 'practice') G.toGame();   // Practice → Test
      else if (G.phase === 'done') G.next();          // never mid-try: Enter, Enter would skip the melody
    }
  });

  $('#btn-play').addEventListener('click', () => G.hearIt());
  $('#btn-mode').addEventListener('click', () => G.toggleMode());
  // Off → Slow → Moderate → Fast: the player's, for this visit (it never makes a practice Custom)
  $('#btn-metro').addEventListener('click', () => G.metroTap());
  // Battle Mode's choice of tempo: a pick counts in; a tap anywhere else closes it
  $('#metro-pick').addEventListener('click', e => { const b = e.target.closest('[data-metro]'); if (b) G.setMetro(b.dataset.metro); });
  document.addEventListener('pointerdown', e => {
    if (G.pickOpen() && !e.target.closest('#metro-pick') && !e.target.closest('#btn-metro')) G.closePick();
  }, true);
  $('#btn-restart').addEventListener('click', () => G.restart());
  $('#btn-next').addEventListener('click', () => G.next());
  // the Get ready card tapped while it counts: stop, back to Practice (the user's wish, 2026-10-05)
  document.addEventListener('pointerdown', e => {
    if (G.phase === 'countin' && e.target.closest && e.target.closest('.evm-count-card')) { e.preventDefault(); G.stopCountIn(); }
  });
  $('#gear').addEventListener('click', () => { if (!RR.Maker.active) RR.Settings.open(); });
  $('#mel-btn').addEventListener('click', () => { if (!RR.Maker.active) RR.Melodies.open(); });
  $('#level-chip').addEventListener('click', () => { if (!RR.Maker.active) RR.Settings.open(G.mode.kind === 'lesson' ? 'leave' : 'level'); });
  $('#score-chip').addEventListener('click', () => { if (!RR.Maker.active) RR.Board.open(); });
  $('#settings').addEventListener('click', e => {
    if (e.target === $('#settings') || e.target.closest('[data-close]')) RR.Settings.close();
    if (e.target.closest('[data-play]')) RR.View.go('play');          // ▶ Play: from the home page too
  });
  // ‹ Home (‹ Back on My stats opened from the music); writing a melody, Cancel comes first
  $('#app-home').addEventListener('click', () => { if (RR.Maker.active) RR.Maker.cancel(); else RR.View.back(); });
  // the name (and the logo): the home page, from anywhere — already there, back to its top
  $('#brand').addEventListener('click', () => {
    if (RR.Maker.active) RR.Maker.cancel();
    else if (RR.View.current === 'home') $('#home').scrollTo({ top: 0, behavior: 'smooth' });
    else RR.View.go('home');
  });
  $('#board').addEventListener('click', e => { if (e.target === $('#board') || e.target.closest('[data-close]')) RR.Board.close(); });

  // the first touch or key wakes the sound, and a sleeping speaker with it
  let primed = false;
  const wake = () => { if (primed) return; primed = true; RR.Sound.prime(0.3); };
  document.addEventListener('pointerdown', wake, { capture: true });
  document.addEventListener('keydown', wake, { capture: true });

  /* the practice this browser was last on (or a lesson link's) */
  function restore() {
    const d = RR.device.practice;
    // a session: as it is saved now (an old Mine practice: the session it became)
    const ses = d && (d.kind === 'session' ? RR.Sessions.get(d.id) : d.kind === 'mine' ? RR.Sessions.list().find(x => x.name === String(d.name || '').trim().slice(0, 40)) : null);
    if (ses) G.selectSession(ses.id);
    else if (d && d.practice && (d.kind === 'custom' || d.kind === 'mine' || d.kind === 'session')) {
      G.usePractice(d.practice, { kind: 'custom', from: d.kind === 'custom' ? d.from || null : d.name || null });
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
    RR.Melodies.render(); G.drawChips(); RR.View.render();
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
    RR.View.init(lesson ? 'play' : 'home');
    RR.Sets.startShelf(shelfChanged);
    if (got) arrived(got);
    if (window.self !== window.top) document.documentElement.classList.add('in-iframe');
  }
  start();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => G.draw());
})();

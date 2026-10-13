/* ==========================================================================
   Melody Reader — teach.js
   --------------------------------------------------------------------------
   RR.Teach — Practice (called Teach Me to Read until 2026-10-12, when the
   user renamed it: its window has Lessons · Songs · Exercises) and Songs
   (the landing page's Songs card: a song straight through, no points —
   G.mode.song; songMode, songAdvance, songEnd, the Songs window below).
   The data is teach-data.js; 2026-10-11, the user's design. A level is played on the music card like any other
   (G.mode = { kind: 'teach', id }), with these differences:

     the staff     its notes' lines lit in their bars' colours, the rest
                   greyed (the green F line too in Advanced)
     the bars      only the level's own are live; letters under the notes
     no Test       no Practice / Test button and no score: play the
                   exercise on your own and it gets a green check
     Tools         (2026-10-12, the user's) — beside Listen: the metronome,
                   the computer keyboard, Auto-Next Slide, Note Colors,
                   Staff Color, Text Below the Notes. Since the same day in
                   every mode (tools.js); here the look is kept for every
                   level and unit (RR.teachLook), and Auto-Next goes on to
                   the next exercise — with the metronome, the click
                   carrying on into it (G.swapCard)
     metronome     Slow or Moderate (no Fast). Picking one counts in at
                   once, then the exercise goes round and round with the
                   click until it is turned off (2026-10-11, the user's: a
                   class can play along on real xylophones); each time
                   round played through — every note, no wrong bar — gives
                   a gold star instead. ↻ counts in again; Off goes back
                   to playing on your own
     Listen        round and round too, until pressed again (with the
                   metronome on: with its clicks — playing along stops)
     Next          any time (2026-10-11, the user's: teachers move freely);
                   it lights once the exercise has its check, and the dots
                   at the top go to any exercise. After the last: a card
                   with the marks — the ones left (if any), or Try again
                   for gold stars (unless all are gold), the Advanced
                   level, the next level (or unit), Home
     the keyboard  (in Tools) the music card shows a computer keyboard,
                   the level's keys lit in their bars' colours (3 E · 5 G;
                   Advanced 0 and = for the high E and G). They play — so
                   do the real keys and the bars — but nothing counts: just
                   to learn where the notes are. ♪ Back to the music (or
                   Tools again, or Escape) returns

   YOUR UNITS (2026-10-12, the user's): any My melodies set can be a unit
   of Teach Me to Read — played this way, listed in its window and its
   drop-down after the six levels (RR.TeachUnits, teach-data.js). The
   window's + Make a unit takes a set you have or starts a new one; its
   melodies are written in My melodies (the set's page has ▶ Teach Me to
   Read too).

   Each player's marks are kept (RR.TeachMarks, the best of each). The
   home page has a card for it in Make your own, beside A new session
   (2026-10-11); its ▶ Play opens a window — which level, where to start
   (openWindow). The level box's drop-down lists them (dropHtml).
   From a tablet up its music card has the controls in columns either
   side of the staff (style.css), and game.js draws the staff tighter.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game, esc = RR.esc;
  const T = RR.Teach = { id: 'L1', at: 0 };
  const lv = () => RR.teachLevel(T.id) || RR.TEACH[0];
  T.level = lv;
  const on = () => G.mode.kind === 'teach';
  /* Songs (2026-10-12, the user's): a song played straight through — no points, no marks, the slides handing on so
     the beat is kept — the whole song or a section of it (G.mode.song, from, to, practice, auto) */
  const songMode = () => on() && !!G.mode.song;
  T.songMode = songMode;
  function range() {
    const n = lv().ex.length;
    if (!songMode()) return [0, n - 1];
    const a = Math.max(0, Math.min(n - 1, G.mode.from | 0));
    return [a, Math.max(a, Math.min(n - 1, G.mode.to == null ? n - 1 : G.mode.to | 0))];
  }
  T.range = range;
  const whole = () => { const r = range(); return r[0] === 0 && r[1] === lv().ex.length - 1; };
  const songPractice = () => songMode() && !!G.mode.practice;
  const marks = () => RR.TeachMarks.get(T.id);
  /* what comes after each level, on its last card (the user's: the Advanced level, or the next level);
     a unit: the next unit */
  const NEXT = { L1: ['A1', 'L2'], A1: ['L2'], L2: ['A2', 'L3'], A2: ['L3'], L3: ['A3'], A3: [] };
  function nextsOf(L) {
    if (!L.unit) return NEXT[L.id].map(RR.teachLevel);
    if (L.kind === 'song') { const all = RR.teachSongs(), i = all.findIndex(x => x.id === L.id); return i >= 0 && all[i + 1] ? [all[i + 1]] : []; }
    if (L.kind !== 'unit') return [];
    const us = RR.TeachUnits.levels().filter(x => x.ex.length), i = us.findIndex(x => x.id === L.id);
    return i >= 0 && us[i + 1] ? [us[i + 1]] : [];
  }
  const andList = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const numWord = n => WORDS[n] || String(n);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many || one + 's');
  // a unit's name in a sentence: “Week 3”
  const named = L => L.unit ? '“' + L.title + '”' : L.long;

  /* the practice a level is played with: its notes, quarters and eighths, two bars of 4/4, every help —
     the look as the Tools panel has it */
  function practiceOf(L) {
    const look = RR.teachLook(), first = L.unit && L.ex[0];
    return Object.assign(RR.clone(RR.DEFAULTS), {
      notes: L.notes.slice(), rhythms: ['q', 'ee'], time: first ? first.time.slice() : [4, 4], times: [first ? first.time.slice() : [4, 4]], bars: 2, moves: 'skips', endDo: false,
      grey: true, colour: look.colour, letters: true, nums: true, glow: 'after2', labels: look.labels,
      practice: true, practiceStart: 'on', from: 'made', game: 'round5', auto: false, playHidden: false, playLights: true
    });
  }

  /* a level at an exercise (a reload, the window's Start at) — or at the first not yet played. A unit with
     no melodies can't be started (false) */
  /* `extra`: { session: { id, name } } — a session of yours played this way (2026-10-12: its Format is Practice
     or Songs); it names what plays, and its ✎ page is the session's */
  T.start = function (id, at, song, extra) {
    const L = RR.teachLevel(id) || RR.TEACH[0];
    if (!L.ex.length) return false;
    RR.Tools.kbd(false); RR.Tools.close(); cancelAuto();
    T.id = L.id;
    const mode = Object.assign({ kind: 'teach', id: L.id }, extra && extra.session ? { session: extra.session } : {});
    if (song) {
      // Songs: its section (the whole song unless picked), Practice and Auto-Next as chosen (Off and On to begin with)
      const n = L.ex.length, a = Math.max(0, Math.min(n - 1, song.from | 0)), b = Math.max(a, Math.min(n - 1, song.to == null ? n - 1 : song.to | 0));
      Object.assign(mode, { song: true, from: a, to: b, practice: !!song.practice, auto: song.auto !== false });
      T.at = typeof at === 'number' && at >= a && at <= b ? at | 0 : a;
      T.songStats = { slides: 0, slips: 0, metro: true };
    } else {
      const m = marks();
      T.at = typeof at === 'number' && at >= 0 ? Math.min(at | 0, m.length - 1) : Math.max(0, m.indexOf(0));
    }
    G.usePractice(practiceOf(L), mode);
    return true;
  };
  T.card = function () {
    const cards = RR.teachCards(lv());
    T.at = Math.max(0, Math.min(T.at, cards.length - 1));
    return cards[T.at] ? RR.clone(cards[T.at]) : null;
  };
  /* any exercise, played or not (2026-10-11, the user's: "teachers need to move more freely with it") */
  T.go = function (i) {
    if (!on() || i < 0 || i >= lv().ex.length) return;
    if (songMode()) { const r = range(); if (i < r[0] || i > r[1]) return; }
    cancelAuto();
    RR.Board.hideRound();
    T.at = i; G.remember();
    // Songs with the metronome going: the click carries on into the slide (another meter counts in again)
    if (songMode() && RR.Beat.running() && !G.overlay) {
      const card = T.card();
      if (G.swapCard(card)) return;
      const m = G.metro; G.nextCard(card); G.setMetro(m); return;
    }
    G.nextCard(T.card());
  };
  T.marked = () => !songMode() && marks()[T.at] > 0;
  /* the staff as the look has it: its notes' lines, all five, or plain (game.js draw) */
  T.staff = () => RR.teachStaff(lv(), RR.teachLook().staff);

  /* a unit's set changed in My melodies (or went) while it plays: the exercise it is on, again — or
     Level 1, if the unit has no melodies left */
  T.refresh = function () {
    if (!on() || !/^[UM]:/.test(T.id)) return;
    const L = RR.teachLevel(T.id);
    if (!L || !L.ex.length) {
      T.start('L1');
      RR.toast(L ? '“' + L.title + '” has no melodies yet — Level 1 for now' : 'That unit isn’t in Practice any more — Level 1 for now');
      return;
    }
    const was = G.card ? JSON.stringify([G.card.time, G.card.notes, G.card.of]) : '';
    const now = T.card();
    if (now && JSON.stringify([now.time, now.notes, now.of]) !== was) { G.remember(); G.nextCard(now); }
    else G.draw();
  };
  /* ▶ Teach Me to Read on a set's page (melodies.js): into the units if it isn't, and played */
  T.playSet = function (setId) {
    RR.TeachUnits.add(setId);
    if (RR.Melodies && RR.Melodies.isOpen()) RR.Melodies.close();
    if (!T.start('U:' + setId)) { RR.toast('Write a melody in it first'); return; }
    RR.View.go('play');
    G.announce('Practice · ' + lv().title);
  };

  /* ---- a play done ---- */
  /* Auto-Next Slide (Tools, 2026-10-12): once an exercise is played through, the next comes by itself — on your
     own a moment after the check; with the metronome straight away, the click carrying on into it (a class
     playing along goes from one to the next). After the last: the end card */
  let autoT = null;
  function cancelAuto() { clearTimeout(autoT); autoT = null; }
  T.cancelAuto = cancelAuto;
  const autoOn = () => songMode() ? G.mode.auto !== false : !!RR.teachLook().auto;
  function autoNext(running) {
    if (!autoOn() || RR.Tools.kbdOn()) return;
    cancelAuto();
    if (T.at >= lv().ex.length - 1) { autoT = setTimeout(() => { if (on() && !G.overlay) end(); }, running ? 900 : 1600); return; }
    if (!running) { autoT = setTimeout(() => { if (on() && !G.overlay && G.stage === 'practice') T.go(T.at + 1); }, 1600); return; }
    // with the metronome: the next exercise in the same run — the click goes on (a new meter counts in again)
    T.at++; G.remember();
    const card = T.card();
    if (!G.swapCard(card)) { const m = G.metro; T.go(T.at); G.setMetro(m); }
    G.announce('Exercise ' + (T.at + 1) + '.');
  }
  /* Songs: a slide played through hands on to the next — at once (Practice off: the beat goes on), or after a moment
     to see it (Practice on); with no Auto-Next, Next lights. The section's end goes round to its first slide again;
     the whole song's: its end card (2026-10-12, the user's: "no good job animations until the end of the song") */
  function songAdvance(running) {
    const r = range(), st = T.songStats || (T.songStats = { slides: 0, slips: 0, metro: true });
    st.slides++; st.slips += G.slips; if (!running) st.metro = false;
    if (!autoOn()) { $('#btn-next').classList.add('ready'); return; }
    if (T.at >= r[1] && whole()) { autoT = setTimeout(() => { if (songMode() && !G.overlay) songEnd(); }, 650); return; }
    const to = T.at >= r[1] ? r[0] : T.at + 1;            // a section: round again from its first slide
    if (songPractice() && !running) { autoT = setTimeout(() => { if (songMode() && !G.overlay && G.stage === 'practice') T.go(to); }, 1200); return; }
    T.go(to);
    if (to === r[0]) G.announce('Again from slide ' + (to + 1) + '.');
  }
  /* on your own, every note found (game.js practiceFound): a check — false: the music isn't to go round again */
  T.found = function () {
    if (songMode()) {
      const keep = songPractice();                         // Practice: the slide goes round until it moves on
      songAdvance(false);
      return keep && G.card && G.phase === 'review';
    }
    const first = !T.marked();
    RR.TeachMarks.set(T.id, T.at, 1);
    float(false);
    if (first && RR.device.celebrate) RR.Sound.celebrate(2);
    const last = T.at === lv().ex.length - 1;
    G.announce(first ? 'You played it! Play it again, or press ' + (last ? 'Finish.' : 'Next.') : 'You played it again!');
    G.draw();
    if (first) $('#btn-next').classList.add('ready');
    autoNext(false);
  };
  /* with the metronome: a gold star — every note, no wrong bar, at about the metronome's tempo (wherever the
     player came in: 2026-10-12, the user's) — else a check. Round and round (`looping`): each time it is
     played through, the music going on — the sound and the words only when the mark goes up (a class playing
     along on real xylophones isn't interrupted every time round) */
  T.runDone = function (looping) {
    if (songMode()) { songAdvance(true); return; }        // Songs: no marks — on to the next slide, the click going on
    const idx = G.evs.map((e, i) => e.rest ? -1 : i).filter(i => i >= 0);
    const wrong = G.slips;
    const tc = RR.Points.tempoCheck(idx.map(i => G.evs[i].start), idx.map(i => G.times[i]), G.run ? G.run.tempo : 80);
    const was = T.marked();
    const mark = RR.teachMark({ run: !!G.run, missed: 0, wrong, inTempo: tc.ok });
    const better = RR.TeachMarks.set(T.id, T.at, mark);
    if (mark) float(mark === 2);
    if (mark && better && RR.device.celebrate) RR.Sound.celebrate(mark === 2 ? 3 : 2);
    if (!looping || better) G.announce(mark === 2 ? 'A gold star! Every note, with the metronome.' :
      wrong ? 'Every note — with a wrong bar on the way. Again for a gold star.' :
        'Every note — ' + (tc.ratio < 1 ? 'a little slower' : 'a little faster') + ' than the metronome. Again with it for a gold star.');
    G.draw();
    if (!looping) $('#btn-restart').classList.add('ready');
    if (!was && mark && !looping) $('#btn-next').classList.add('ready');
    if (looping) autoNext(true);
  };
  /* ↻: this exercise again — counted in, with the metronome on */
  T.again = function () {
    if (RR.Tools.kbdOn()) return;
    G.stopHear(true); RR.Beat.stop(); clearTimeout(G.practiceT);
    const metro = G.metroOn();
    G.resetCard(metro ? 'game' : 'practice'); G.draw();
    if (metro) RR.Beat.start();
    G.announce(metro ? 'Again, with the metronome.' : 'From the top.');
  };
  T.next = function () {
    if (RR.Tools.kbdOn()) return;
    if (songMode()) { const r = range(); if (T.at < r[1]) T.go(T.at + 1); else if (whole()) songEnd(); else T.go(r[0]); return; }
    if (T.at < lv().ex.length - 1) T.go(T.at + 1); else end();
  };
  /* Songs: the Practice button — on, each slide goes round until it moves on (Listen, the hints); off, straight
     through (the user's default: off) */
  T.togglePractice = function () {
    if (!songMode()) return;
    G.mode.practice = !G.mode.practice;
    G.remember(); G.drawSides();
    G.announce(G.mode.practice ? 'Practice on: each slide goes round until you move on.' : 'Practice off: straight through, slide to slide.');
  };

  /* the controls in Teach Me to Read (after game.js drawSides) */
  T.drawSides = function () {
    const kb = RR.Tools.kbdOn(), done = T.marked(), last = T.at === lv().ex.length - 1;
    const nx = $('#btn-next');
    nx.disabled = kb;
    nx.classList.toggle('teach-ok', done);             // lit once it is played through — but never in the way
    const sm = songMode(), rg = range(), lastHere = sm ? T.at >= rg[1] && whole() : last;
    nx.title = lastHere ? 'Finish ' + (lv().unit ? lv().title : lv().long) : sm ? (T.at >= rg[1] ? 'Back to slide ' + (rg[0] + 1) : 'The next slide') : 'The next exercise';
    nx.setAttribute('aria-label', nx.title);
    $('.next-label').textContent = lastHere ? 'Finish' : 'Next';
    if (sm) {
      // the Practice button: a song's own on / off (pause = on, the red ball = straight through)
      const mb = $('#btn-mode'), pr = !!G.mode.practice;
      mb.disabled = kb; mb.classList.toggle('test', !pr); mb.classList.remove('recording');
      mb.setAttribute('aria-pressed', String(!pr));
      mb.title = pr ? 'Practice on — each slide goes round until you move on. Press to play straight through' : 'Practice off — straight through, slide to slide. Press to practise';
      mb.setAttribute('aria-label', mb.title);
    }
    const r = $('#btn-restart');
    r.disabled = kb;
    r.title = G.metroOn() ? 'Again, with the metronome' : 'Start this one over';
    r.setAttribute('aria-label', r.title);
    const play = $('#btn-play');
    if (kb) play.disabled = true;
    else if (!G.hearing) play.title = 'Listen — round and round until you press it again' + (G.metroOn() ? ', with the metronome' : '');
  };

  /* the exercises at the top: a gold star, a check, or not yet — a tap goes to any one. More than twelve
     (a long unit): ‹ 3 of 20 › and what is done */
  T.dotsHtml = function () {
    if (songMode()) {
      // Songs: where you are — no marks; the slides outside the section faded
      const r = range(), n = lv().ex.length;
      if (n > 12) return '<button type="button" class="dot-step" data-tx="' + (T.at - 1) + '"' + (T.at > r[0] ? '' : ' disabled') + ' aria-label="The slide before">‹</button>' +
        '<span class="dots-count"><i class="dot now"></i>Slide ' + (T.at + 1) + ' of ' + n + (whole() ? '' : '<small>slides ' + (r[0] + 1) + '–' + (r[1] + 1) + '</small>') + '</span>' +
        '<button type="button" class="dot-step" data-tx="' + (T.at + 1) + '"' + (T.at < r[1] ? '' : ' disabled') + ' aria-label="The next slide">›</button>';
      return lv().ex.map((_, i) => { const out = i < r[0] || i > r[1];
        return '<button type="button" class="dot' + (!out && i < T.at ? ' seen' : '') + (i === T.at ? ' now' : '') + (out ? ' out' : '') + '" data-tx="' + i + '"' + (out ? ' disabled' : '') +
          ' aria-label="Slide ' + (i + 1) + (i === T.at ? ', this one' : '') + '"></button>'; }).join('');
    }
    const m = marks();
    if (m.length > 12) {
      const done = m.filter(Boolean).length, gold = m.filter(x => x === 2).length, x = m[T.at];
      return '<button type="button" class="dot-step" data-tx="' + (T.at - 1) + '"' + (T.at ? '' : ' disabled') + ' aria-label="The exercise before">‹</button>' +
        '<span class="dots-count"><i class="dot' + (x ? ' done ' + (x === 2 ? 'gold' : 'made') : '') + ' now"></i>' + (T.at + 1) + ' of ' + m.length +
        '<small>' + done + ' played' + (gold ? ' · ★ ' + gold : '') + '</small></span>' +
        '<button type="button" class="dot-step" data-tx="' + (T.at + 1) + '"' + (T.at < m.length - 1 ? '' : ' disabled') + ' aria-label="The next exercise">›</button>';
    }
    return m.map((x, i) => '<button type="button" class="dot' + (x ? ' done ' + (x === 2 ? 'gold' : 'made') : '') + (i === T.at ? ' now' : '') + '" data-tx="' + i + '"' +
      ' aria-label="Exercise ' + (i + 1) + (x === 2 ? ', a gold star' : x ? ', played' : '') + (i === T.at ? ', this one' : '') + '"></button>').join('');
  };
  $('#dots').addEventListener('click', e => {
    const b = e.target.closest('[data-tx]');
    if (b && !b.disabled && on() && !RR.Tools.kbdOn() && !G.overlay) T.go(+b.dataset.tx);
  });

  /* a check or a gold star floating up (game.js showMark's, without points; shown whatever Settings
     says about gold stars — here they are the point of the metronome) */
  function float(gold) {
    const el = $('#praise');
    el.innerHTML = gold ? RR.STAR_SVG : RR.CHECK_SVG;
    el.className = 'praise mark'; void el.offsetWidth; el.className = 'praise mark show';
    const r = el.querySelector('svg').getBoundingClientRect();
    G.sparkAt(r.left + r.width / 2, r.top + r.height / 2, gold ? '#fbbf24' : '#22c55e', gold ? 16 : 8, gold);
  }

  /* ---- after the last: the marks, and where next ---- */
  function end() {
    G.stopHear(true); RR.Beat.stop(); clearTimeout(G.practiceT); RR.Tools.close(); cancelAuto();
    const L = lv(), m = marks(), n = m.length, gold = m.filter(x => x === 2).length, all = gold === n;
    const played = m.filter(Boolean).length, left = n - played;
    const nexts = nextsOf(L);
    // moved on before playing them all (free to, since 2026-10-11): which are left, and a way back to them
    const leftNums = m.map((x, i) => x ? 0 : i + 1).filter(Boolean).map(String);
    const leftWords = leftNums.length > 6 ? numWord(left) : andList(leftNums);
    const say = all ? cap(numWord(n)) + (n === 1 ? ' gold star' : ' gold stars') + ' — every one with the metronome!' :
      left ? (leftNums.length > 6 ? cap(leftWords) + ' exercises are' : left === 1 ? 'Exercise ' + leftWords + ' is' : 'Exercises ' + leftWords + ' are') + ' still to play — go back for ' + (left === 1 ? 'it' : 'them') + ', or move on.' :
      gold ? gold + (gold === 1 ? ' gold star' : ' gold stars') + ' with the metronome. Play the others with it for all ' + numWord(n) + '!' :
        'You played all ' + numWord(n) + '! Now play them with the metronome for gold stars.';
    const btns = (left ? '<button type="button" class="pill-btn primary" data-teach="left">▶ ' + (left === 1 ? 'The one left' : 'The ones left') + '</button>' :
        all ? '' : '<button type="button" class="pill-btn primary" data-teach="gold">' + RR.STAR_SVG + 'Try again for gold stars</button>') +
      nexts.map(x => '<button type="button" class="pill-btn go" data-teach="go" data-id="' + esc(x.id) + '">' + esc(x.unit ? x.title : x.long) + ' ▸</button>').join('') +
      '<button type="button" class="pill-btn' + (all && !nexts.length ? ' go' : '') + '" data-teach="home">' + RR.HOME_SVG + 'Home</button>';
    const el = $('#rounddone');
    el.innerHTML = '<div class="rd-card te-card"><div class="te-kicker">Practice · ' + esc(L.unit ? L.title : L.long) + '</div>' +
      '<h3>' + (all ? (n === 1 ? 'A gold star!' : cap(numWord(n)) + ' gold stars!') : left ? played + ' of ' + n + ' played' : (n === 1 ? 'Done!' : 'All ' + numWord(n) + ' done!')) + '</h3>' +
      '<div class="te-marks' + (n > 8 ? ' many' : '') + '">' + m.map((x, i) => '<span class="te-mk' + (x === 2 ? ' g' : '') + '">' + (x === 2 ? RR.STAR_SVG : x ? RR.CHECK_SVG : '<i class="te-none"></i>') + '<small>' + (i + 1) + '</small></span>').join('') + '</div>' +
      '<p class="te-say">' + say + '</p>' +
      (!nexts.length && all && !L.unit ? '<p class="te-say small">You can read ' + esc(L.sub.replace(', A low', ' — and A')) + '.</p>' : '') +
      '<div class="rd-btns">' + btns + '</div></div>';
    el.hidden = false;
    G.overlay = true;
    const f = el.querySelector('.pill-btn.go') || el.querySelector('.pill-btn'); if (f) f.focus();
    G.announce((L.unit ? L.title : L.long) + ' done. ' + say);
    if (RR.device.celebrate) RR.Sound.celebrate(all ? 3 : 2);
  }
  T.end = end;
  /* Songs: the end of the whole song — now the celebration (the user's: none until the end) */
  function songEnd() {
    G.stopHear(true); RR.Beat.stop(); clearTimeout(G.practiceT); RR.Tools.close(); cancelAuto();
    const L = lv(), st = T.songStats || { slides: 0, slips: 0, metro: false };
    const say = (st.slips ? st.slips + (st.slips === 1 ? ' slip' : ' slips') + ' on the way' : 'Every note right first time') +
      (st.metro && st.slides ? ' — with the metronome all the way through!' : '.');
    const el = $('#rounddone');
    el.innerHTML = '<div class="rd-card te-card song-card"><div class="te-kicker">Songs</div>' +
      '<h3>You played ' + esc(L.title) + '!</h3><p class="te-say">' + say + '</p>' +
      '<div class="rd-btns"><button type="button" class="pill-btn go" data-songend="hear" data-label="▶ Hear your song">▶ Hear your song</button>' +
        '<button type="button" class="pill-btn primary" data-songend="again">↻ Play it again</button>' +
        '<button type="button" class="pill-btn" data-songend="other">Another song</button>' +
        '<button type="button" class="pill-btn" data-songend="home">' + RR.HOME_SVG + 'Home</button></div></div>';
    el.hidden = false;
    G.overlay = true;
    float(true);
    if (RR.device.celebrate) RR.Sound.celebrate(3);
    const f = el.querySelector('[data-songend="again"]'); if (f) f.focus();
    G.announce('You played ' + L.title + '! ' + say);
  }
  T.songEnd = songEnd;
  $('#rounddone').addEventListener('click', e => {
    const b = e.target.closest('[data-songend]'); if (!b || !songMode()) return;
    const a = b.dataset.songend, r = range();
    if (a === 'hear') {
      if (G.songPlaying) { G.stopSong(); b.textContent = b.dataset.label; return; }
      b.textContent = '■ Stop';
      G.hearSong(() => { b.textContent = b.dataset.label; }, RR.teachCards(lv()).slice(r[0], r[1] + 1));
    } else if (a === 'again') { RR.Board.hideRound(); T.songStats = { slides: 0, slips: 0, metro: true }; T.go(r[0]); }
    else if (a === 'other') { RR.Board.hideRound(); T.openSongs(); }
    else if (a === 'home') { RR.Board.hideRound(); T.songStats = { slides: 0, slips: 0, metro: true }; T.go(r[0]); RR.View.go('home'); }
  });
  /* Try again for gold stars: the first exercise without one, the metronome pointed out in Tools */
  function goldTry() {
    const m = marks(), i = Math.max(0, m.findIndex(x => x < 2));
    T.go(i);
    RR.Tools.open(true, 'metro');
    G.announce('Pick Slow or Moderate on the metronome, and play along for a gold star.');
  }
  $('#rounddone').addEventListener('click', e => {
    const b = e.target.closest('[data-teach]'); if (!b || !on()) return;
    const a = b.dataset.teach;
    if (a === 'gold') goldTry();
    else if (a === 'left') T.go(Math.max(0, marks().indexOf(0)));
    else if (a === 'go') { if (T.start(b.dataset.id)) G.announce('Practice · ' + lv().long); }
    else if (a === 'home') { RR.Board.hideRound(); T.go(0); RR.View.go('home'); }
  });

  /* ---- the levels and units as tiles, each with its marks: the window (below) and the drop-down ---- */
  const GL = typeof GLYPHS_LELAND !== 'undefined' ? GLYPHS_LELAND : null;
  function staffSvg(L) {
    const yOf = st => 34 - (st - 30) * 3.5;                 // E4 on the bottom line, 7 units to a space
    const lines = L.lines.map((c, i) => {
      const y = 34 - i * 7;
      return c === 'dim' ? '<line x1="0" x2="100" y1="' + y + '" y2="' + y + '" stroke="#d9cfbf" stroke-width="1.3"/>'
        : '<line x1="0" x2="100" y1="' + y + '" y2="' + y + '" stroke="' + c + '" stroke-width="3.2"/>';
    }).join('');
    const ns = L.notes.slice().sort((a, b) => RR.BAR[a].step - RR.BAR[b].step);
    const x0 = ns.length > 6 ? 26 : 34, span = ns.length > 6 ? 70 : 60;
    const heads = ns.map((id, i) => {
      const x = ns.length === 1 ? 62 : x0 + i * (span / (ns.length - 1)), st = RR.BAR[id].step, y = yOf(st);
      // a ledger line for high A above, low C below — lit like the staff's when the level lights it
      const ledY = st >= 40 ? 40 : st <= 28 ? 28 : 0;
      const led = ledY ? '<line x1="' + (x - 7).toFixed(1) + '" x2="' + (x + 7).toFixed(1) + '" y1="' + yOf(ledY) + '" y2="' + yOf(ledY) + '" stroke="' + ((L.ledgers && L.ledgers[ledY]) || '#2b1d16') + '" stroke-width="2.6"/>' : '';
      return led + '<ellipse cx="' + x.toFixed(1) + '" cy="' + y + '" rx="4.3" ry="3.2" transform="rotate(-20 ' + x.toFixed(1) + ' ' + y + ')" fill="' + RR.BAR[id].colour + '" stroke="#2b1d16" stroke-width="1"/>';
    }).join('');
    const clef = GL ? '<path transform="translate(3 ' + yOf(32) + ') scale(0.0194)" fill="#2b1d16" d="' + GL.gClef.d + '"/>' : '';
    return '<svg viewBox="0 -8 100 56" aria-hidden="true">' + lines + clef + heads + '</svg>';
  }
  /* `picked`: the window's choice (else the level playing is the one ringed) */
  function tileHtml(L, a, picked) {
    const m = RR.TeachMarks.get(L.id), cur = picked !== undefined ? picked === L.id : on() && T.id === L.id;
    const done = m.filter(Boolean).length, gold = m.filter(x => x === 2).length;
    const title = L.unit ? L.title : L.adv ? L.title : L.title + ' · ' + L.name;
    // a long unit's marks in words; up to twelve, a dot each
    const mk = !m.length ? '' : m.length > 12 ? '<span class="tt-count">' + done + ' of ' + m.length + ' played' + (gold ? ' · ★ ' + gold : '') + '</span>'
      : '<span class="tt-marks" aria-hidden="true">' + m.map(x => '<i class="' + (x === 2 ? 'g' : x ? 'c' : '') + '"></i>').join('') + '</span>';
    return '<button type="button" class="tt' + (L.adv ? ' adv' : '') + (L.unit ? ' unit' : '') + (L.kind === 'song' ? ' song' : '') + (cur ? ' on' : '') + '" data-' + a + '="teach" data-id="' + esc(L.id) + '" aria-pressed="' + cur + '" ' +
      'aria-label="' + esc((L.kind === 'song' ? 'The song ' + L.title : L.unit ? 'Your unit ' + L.title : L.long + (L.adv ? '' : ', ' + L.name)) + ': ' + L.sub + '. ' + done + ' of ' + m.length + ' played, ' + gold + (gold === 1 ? ' gold star' : ' gold stars')) + '">' +
      '<span class="tt-staff">' + staffSvg(L) + '</span>' +
      '<span class="tt-txt"><b>' + esc(title) + '</b><small>' + esc(L.sub) + '</small>' + mk + '</span></button>';
  }
  T.tileHtml = tileHtml;                      // a session's page picks its lesson, song or exercise with them (2026-10-12)
  T.dropHtml = function () {
    if (songMode()) {
      const all = songChoices();
      return '<h3 class="dd-h">Choose a different song</h3><div class="mc-list dd-songs">' + all.map(x => '<button type="button" class="mc-row' + (x.id === T.id ? ' on' : '') + '" data-d="tsong" data-id="' + esc(x.id) + '">' +
        '<b>' + (x.kind === 'song' ? '♪ ' : '♫ ') + esc(x.title) + '</b><span class="mc-n">' + plural(x.ex.length, 'slide') + '</span></button>').join('') + '</div>' +
        '<p class="dd-teach-make"><button type="button" class="h-link" data-d="tsongs">A section, Practice, Auto-Next…</button></p>';
    }
    const us = RR.TeachUnits.levels();
    return '<h3 class="dd-h">Choose a different level</h3><div class="teach-grid in-drop">' + RR.TEACH.map(L => tileHtml(L, 'd')).join('') + '</div>' +
      (us.length ? '<h3 class="dd-h">Your units</h3><div class="teach-grid in-drop units">' + us.map(L => tileHtml(L, 'd')).join('') + '</div>' : '') +
      '<p class="dd-teach-make"><button type="button" class="h-link" data-d="teach-make">+ Make a unit from your melodies…</button></p>';
  };
  /* where it is, in words (the home page's Carry on, the drop-down's head) */
  T.where = () => songMode() ? 'slide ' + (T.at + 1) + ' of ' + lv().ex.length          // the section is in the title (G.modeLabel)
    : 'exercise ' + (T.at + 1) + ' of ' + lv().ex.length + ' · ' + marks().filter(Boolean).length + ' played';
  /* the home page card's foot: how far this player has come — the six lessons and the units together */
  T.progressWords = function () {
    const all = [].concat.apply([], RR.TEACH.concat(RR.TeachUnits.levels()).map(L => RR.TeachMarks.get(L.id)));
    const done = all.filter(Boolean).length, gold = all.filter(x => x === 2).length;
    return done ? '<b>' + done + '</b> of ' + all.length + ' played' + (gold ? ' · <b>★ ' + gold + '</b>' : '') : '';
  };

  /* ---- the window (2026-10-11, the user's: "open a window similar to the other sections that will let the
     user choose what to do") — the home page card's ▶ Play opens it; nothing starts until its own ▶ Play.
     Which level (the six tiles, with their marks) or which of your units (2026-10-12), then where to start
     — any exercise, the first not yet played to begin with — and, once it has marks, clearing them for a
     new start. + Make a unit: a set you have, or a new one (its melodies written in My melodies) ---- */
  const W = { id: 'L1', at: 0, view: 'pick', tab: 'lessons' };
  let win = null;
  T.windowOpen = () => !!(win && !win.hidden);
  const firstTodo = id => Math.max(0, RR.TeachMarks.get(id).indexOf(0));
  const LINE_NAME = { E4: 'yellow', G4: 'turquoise', B4: 'purple', D5: 'orange', F5: 'green' };
  function nowHtml(L) {
    const m = RR.TeachMarks.get(L.id);
    const lit = ['E4', 'G4', 'B4', 'D5', 'F5'].filter((id, i) => L.lines[i] !== 'dim').map(id => LINE_NAME[id])
      .concat(L.ledgers && L.ledgers[40] ? ['blue (high A)'] : []).concat(L.ledgers && L.ledgers[28] ? ['red (low C)'] : []);
    const keys = RR.BARS.filter(b => L.notes.includes(b.id)).map(b => b.key);
    const word = L.kind === 'song' ? 'Slide ' : 'Exercise ';
    const ex = m.map((x, i) => '<button type="button" class="tw-ex' + (i === W.at ? ' on' : '') + '" data-tw="at" data-i="' + i + '"' +
      ' aria-pressed="' + (i === W.at) + '" aria-label="' + word + (i + 1) + (x === 2 ? ', a gold star' : x ? ', played' : ', not played yet') + '">' +
      (x === 2 ? RR.STAR_SVG : x ? RR.CHECK_SVG : '<i class="tw-none"></i>') + '<small>' + (i + 1) + '</small></button>').join('');
    const what = L.unit
      ? '<b>' + esc(L.title) + '</b><span>' + (L.ex.length ? esc(L.sub) + (lit.length ? ' · the ' + andList(lit) + ' lines lit' : '') + ' · keys ' + andList(keys.map(k => k === '+' ? '+ (Shift and =)' : k)) : 'No melodies in it yet — write them in My melodies.') +
        (L.shared ? ' · ' + (L.book ? 'from the Teacher Library' : 'shared with you') : '') + '</span>'
      : '<b>' + esc(L.long + ' · ' + L.name) + '</b><span>' + esc(L.sub) + ' · the ' + andList(lit) + ' lines lit · keys ' + andList(keys.map(k => k === '+' ? '+ (Shift and =)' : k)) + '</span>';
    return '<div class="tw-now"><div class="tw-what">' + what + '</div>' +
      (m.length ? '<div class="tw-start"><span class="lbl">Start at</span><div class="tw-exs" role="group" aria-label="Start at">' + ex + '</div></div>' : '') +
      '<div class="tw-acts">' +
        (L.kind === 'unit' ? '<button type="button" class="h-link" data-tw="edit">✎ ' + (L.shared ? 'See its melodies' : L.ex.length ? 'Write and change its melodies' : 'Write its melodies') + '</button>' +
          '<button type="button" class="h-link" data-tw="out">Take it out of Practice</button>' : '') +
        (m.some(Boolean) ? '<button type="button" class="h-link tw-clear" data-tw="clear">↺ Clear its checks and stars</button>' : '') +
      '</div></div>';
  }
  /* Practice (2026-10-12, the user's: "'Teach Me to Read' to 'Practice' and within the Practice settings will be
     Lessons, Songs, Exercises to practice"): Lessons — the six levels; Songs — the Songbook's, slide by slide;
     Exercises — your own units (and + Make a unit) */
  const TABS = [['lessons', 'Lessons', 'The very first notes, a step at a time'], ['songs', 'Songs', 'Songbook songs, slide by slide'], ['exercises', 'Exercises', 'Your own melodies, made into units']];
  const tabOf = id => /^S:/.test(id) ? 'songs' : /^[UM]:/.test(id) ? 'exercises' : 'lessons';
  function pickHtml() {
    const L = RR.teachLevel(W.id) || RR.TEACH[0], us = RR.TeachUnits.levels();
    const tabs = '<div class="src-tabs tw-tabs" role="radiogroup" aria-label="What to practise">' + TABS.map(x => '<button type="button" role="radio" data-tw="tab" data-v="' + x[0] + '" class="' + (W.tab === x[0] ? 'on' : '') + '" aria-checked="' + (W.tab === x[0]) + '">' +
      '<b>' + x[1] + '</b><small>' + x[2] + '</small></button>').join('') + '</div>';
    let pane;
    if (W.tab === 'lessons') pane = '<div class="tw-levels"><div class="teach-grid">' + RR.TEACH.map(x => tileHtml(x, 'tw', W.id)).join('') + '</div></div>';
    else if (W.tab === 'songs') pane = '<div class="tw-levels"><div class="teach-grid units">' + RR.teachSongs().map(x => tileHtml(x, 'tw', W.id)).join('') + '</div></div>';
    else pane = '<div class="tw-levels"><div class="teach-grid units">' + us.map(x => tileHtml(x, 'tw', W.id)).join('') +
      '<button type="button" class="tt tt-new" data-tw="make"><span class="tt-plus" aria-hidden="true">+</span><span class="tt-txt"><b>Make a unit</b><small>' +
        (us.length ? 'From another melody set' : 'Your own melodies, played this way — a set you have, or new ones') + '</small></span></button></div></div>';
    return RR.note('tw', 'Their own lines lit on the staff, the music round and round. Play each one all the way through for a green check — then along with the metronome (in Tools) for a gold star. Tools also shows which computer keys play the bars, and takes the colors off when they’re ready.') +
      tabs + pane + (tabOf(W.id) === W.tab ? nowHtml(L) : '');
  }
  function makeHtml() {
    const sets = RR.Sets.list().filter(x => !/^lesson/.test(x.id));
    const rows = sets.map(x => {
      const isIn = RR.TeachUnits.has(x.id), n = x.melodies.length;
      const notes = Array.from(RR.Sets.notesOf(x)).filter(p => RR.BAR[p]).sort((a, b) => RR.BAR[a].step - RR.BAR[b].step);
      return '<div class="tw-set"><span class="tw-set-txt"><b>♫ ' + esc(x.title) + '</b><small>' + (n ? plural(n, 'melody', 'melodies') + ' · ' + esc(RR.teachNotesWords(notes)) : 'no melodies yet') +
        (x.received ? ' · ' + (RR.Sets.isShelf(x) ? 'Teacher Library' : 'shared with you') : '') + '</small></span>' +
        (isIn ? '<span class="tw-in">In Practice ✓</span>' : '<button type="button" class="pill-btn go" data-tw="use" data-id="' + esc(x.id) + '">Use it</button>') + '</div>';
    }).join('');
    return RR.note('twu', 'A unit is one of your melody sets played the Practice way: big, round and round, the lines of its notes lit, a check and a gold star for each melody. Its melodies live in My melodies — write them there, a bar or two each, with any notes and rhythms.') +
      '<h3 class="w-q">From a melody set you have</h3>' +
      (rows ? '<div class="tw-sets">' + rows + '</div>' : '<p class="note">No melody sets yet — start a new one below.</p>') +
      '<h3 class="w-q">Or start a new one</h3>' +
      '<div class="tw-newrow"><input type="text" id="tw-name" maxlength="60" placeholder="Its name — Unit 1: Mi, So and La, say" aria-label="The new unit’s name">' +
        '<button type="button" class="pill-btn primary" data-tw="new">+ Make it, then write its melodies</button></div>';
  }
  function windowHtml() {
    const make = W.view === 'make', L = RR.teachLevel(W.id) || RR.TEACH[0], here = tabOf(W.id) === W.tab;
    const foot = make
      ? '<button type="button" class="pill-btn" data-tw="back">‹ Back</button><button type="button" class="pill-btn" data-tw="close">Cancel</button>'
      : '<button type="button" class="pill-btn" data-tw="close">Cancel</button>' +
        '<button type="button" class="pill-btn go" data-tw="play"' + (here && L.ex.length ? '' : ' disabled') + '>▶ Play' + (here ? ' ' + esc(L.unit ? '“' + L.title + '”' : L.title) : '') + '</button>';
    return '<div class="sheet pick-sheet teach-sheet" role="dialog" aria-modal="true" aria-labelledby="tw-title" style="--mc:' + RR.TEACH_COLOUR + '">' +
      '<header class="sheet-head"><span class="mc-ico light">' + RR.TEACH_ICON + '</span><h2 id="tw-title">' + (make ? 'Make a unit' : 'Practice') + '</h2>' +
      '<button class="icon-btn close" data-tw="close" type="button" aria-label="Close">×</button></header>' +
      '<div class="pick-body">' + (make ? makeHtml() : pickHtml()) + '</div>' +
      '<footer class="sheet-foot">' + foot + '</footer></div>';
  }
  function drawWindow(focusSel, top) {
    const body = win.querySelector('.pick-body'), y = body && !top ? body.scrollTop : 0;
    win.innerHTML = windowHtml();
    win.querySelector('.pick-body').scrollTop = y;
    const f = focusSel && win.querySelector(focusSel); if (f) f.focus();
  }
  /* `view` 'make': straight to Make a unit (the drop-down's link) */
  T.openWindow = function (view) {
    if (!win) {
      win = document.createElement('div');
      win.className = 'modal pick-modal teach-modal'; win.hidden = true;
      document.body.appendChild(win);
      win.addEventListener('click', onWindowClick);
      win.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.stopPropagation(); T.closeWindow(); }
        if (e.key === 'Enter' && e.target.id === 'tw-name') { e.preventDefault(); win.querySelector('[data-tw="new"]').click(); }
      });
    }
    RR.Tools.close();
    W.view = view === 'make' ? 'make' : 'pick';
    // where it opens: the level playing (at its exercise), or the first lesson not yet played through
    if (on() && !songMode()) { W.id = T.id; W.at = T.at; }
    else {
      const next = RR.TEACH.find(x => RR.TeachMarks.get(x.id).includes(0));
      W.id = next ? next.id : 'L1'; W.at = firstTodo(W.id);
    }
    W.tab = view === 'make' ? 'exercises' : tabOf(W.id);
    win.innerHTML = windowHtml();
    RR.windowOpened(win);
    win.hidden = false;
    const f = win.querySelector(W.view === 'make' ? '[data-tw="use"], #tw-name' : '.tt.on'); if (f) f.focus();
  };
  T.closeWindow = function () {
    if (!T.windowOpen()) return;
    win.hidden = true;
    RR.windowClosed(win);
    if (RR.View.current === 'home') RR.View.render();      // the card's foot, if marks were cleared
  };
  async function onWindowClick(e) {
    if (e.target === win) { T.closeWindow(); return; }
    if (RR.foldClick(e)) return;
    const b = e.target.closest('[data-tw]'); if (!b) return;
    const a = b.dataset.tw;
    if (a === 'close') T.closeWindow();
    else if (a === 'teach') { W.id = b.dataset.id; W.at = on() && !songMode() && T.id === W.id ? T.at : firstTodo(W.id); drawWindow('.tt.on'); }
    else if (a === 'tab') {
      // another tab: the first of it picked (an exercise tab with no units yet: nothing — + Make a unit)
      W.tab = b.dataset.v;
      if (tabOf(W.id) !== W.tab) {
        const first = W.tab === 'lessons' ? (RR.TEACH.find(x => RR.TeachMarks.get(x.id).includes(0)) || RR.TEACH[0]) : W.tab === 'songs' ? RR.teachSongs()[0] : RR.TeachUnits.levels()[0];
        if (first) { W.id = first.id; W.at = firstTodo(W.id); }
      }
      drawWindow('.tw-tabs .on');
    }
    else if (a === 'at') { W.at = +b.dataset.i; drawWindow('.tw-ex.on'); }
    else if (a === 'make') { W.view = 'make'; drawWindow('[data-tw="use"], #tw-name', true); }
    else if (a === 'back') { W.view = 'pick'; W.tab = tabOf(W.id); drawWindow('.tt.on', true); }
    else if (a === 'use') {
      // a set you have: a unit now, picked in the window
      RR.TeachUnits.add(b.dataset.id);
      W.view = 'pick'; W.tab = 'exercises'; W.id = 'U:' + b.dataset.id; W.at = firstTodo(W.id);
      drawWindow('.tt.on', true);
      const L = RR.teachLevel(W.id);
      G.announce((L ? L.title : 'The set') + ' is a unit of Practice now.');
    } else if (a === 'new') {
      const box = win.querySelector('#tw-name'), name = (box.value || '').trim();
      if (!name) { RR.toast('Give the unit a name first'); box.focus(); return; }
      const rec = RR.Sets.create(name);
      RR.TeachUnits.add(rec.id);
      T.closeWindow();
      RR.Melodies.open(rec.id);
      RR.toast('Write its melodies here — + Add a melody. Then ▶ Practice');
    } else if (a === 'edit') {
      const L = RR.teachLevel(W.id); if (!L) return;
      T.closeWindow();
      RR.Melodies.open(L.set);
    } else if (a === 'out') {
      const L = RR.teachLevel(W.id); if (!L) return;
      const yes = await RR.ask('Take “' + L.title + '” out of Practice? The melody set stays in My melodies; its checks and stars here go.', 'Take it out');
      if (!yes) return;
      RR.TeachUnits.remove(L.set);
      if (on() && T.id === L.id) T.start('L1');
      W.id = on() ? T.id : 'L1'; W.at = firstTodo(W.id);
      drawWindow('.tt.on');
    } else if (a === 'clear') {
      const L = RR.teachLevel(W.id), who = RR.Players ? RR.Players.current() : '';
      const yes = await RR.ask('Clear the checks and gold stars of ' + named(L) + (who ? ' for ' + who : '') + '? It starts again from exercise 1.', 'Clear them');
      if (!yes) return;
      RR.TeachMarks.reset(W.id); W.at = 0;
      if (on() && T.id === W.id) { T.at = 0; G.draw(); }
      drawWindow('.tt.on');
    } else if (a === 'play') {
      const id = W.id, at = W.at;
      T.closeWindow();
      if (T.start(id, at)) RR.View.go('play');
    }
  }
  /* ---- the Songs card's window (2026-10-12, the user's: "Songs will not have points and will focus on changing
     from one slide to the next in a fashion that the user can maintain the steady beat … playing the whole thing
     or working on a particular section. By default, practice is off and auto-advancing is on") — which song (the
     Songbook's, or a melody set of yours), the whole song or a section of its slides, Practice and Auto-Next ---- */
  const SW = { id: 'S:hot-cross-buns', part: false, from: 0, to: 0, practice: false, auto: true };
  let songWin = null;
  T.songsOpen = () => !!(songWin && !songWin.hidden);
  function songChoices() {
    const sets = RR.Sets.list().filter(x => x.melodies.length && !/^lesson/.test(x.id)).map(x => RR.teachLevel('M:' + x.id)).filter(Boolean);
    return RR.teachSongs().concat(sets);
  }
  function songsHtml() {
    const all = songChoices(), L = RR.teachLevel(SW.id) || all[0];
    if (L) SW.id = L.id;
    const n = L ? L.ex.length : 0;
    SW.from = Math.max(0, Math.min(n - 1, SW.from)); SW.to = Math.max(SW.from, Math.min(n - 1, SW.to));
    const row = x => '<button type="button" class="mc-row' + (x.id === SW.id ? ' on' : '') + '" data-sw="song" data-id="' + esc(x.id) + '" aria-pressed="' + (x.id === SW.id) + '">' +
      '<b>' + (x.kind === 'song' ? '♪ ' : '♫ ') + esc(x.title) + '</b><span class="mc-n">' + plural(x.ex.length, 'slide') + '</span></button>';
    const songs = all.filter(x => x.kind === 'song'), sets = all.filter(x => x.kind !== 'song');
    const opts = v => Array.from({ length: n }, (_, i) => '<option value="' + i + '"' + (i === v ? ' selected' : '') + '>' + (i + 1) + '</option>').join('');
    const seg = (k, list, cur) => '<div class="seg" role="group">' + list.map(([v, w]) => '<button type="button" data-sw="' + k + '" data-v="' + v + '" class="' + (cur === v ? 'on' : '') + '" aria-pressed="' + (cur === v) + '">' + w + '</button>').join('') + '</div>';
    const pics = L ? RR.teachCards(L).map((c, i) => {
      const inPart = !SW.part || (i >= SW.from && i <= SW.to);
      return '<button type="button" class="sw-slide' + (inPart ? ' in' : '') + '" data-sw="slide" data-i="' + i + '" aria-label="Slide ' + (i + 1) + (inPart ? ', played' : '') + '">' +
        '<span class="sw-pic">' + RR.Eng.render(c, { ss: 5, maxW: 170, colour: 'solid', labels: 'none', states: c.notes.map(() => 'lit'), noHalo: true }).svg + '</span><small>' + (i + 1) + '</small></button>';
    }).join('') : '';
    return '<div class="sheet pick-sheet songs-play" role="dialog" aria-modal="true" aria-labelledby="sw-title" style="--mc:#7c3aed">' +
      '<header class="sheet-head"><span class="mc-ico">' + SONG_ICON + '</span><h2 id="sw-title">Songs</h2>' +
      '<button class="icon-btn close" data-sw="close" type="button" aria-label="Close">×</button></header>' +
      '<div class="pick-body">' +
        RR.note('sw', 'A song, all the way through: each slide hands on to the next the moment you finish it, so you can keep a steady beat — with the metronome (in Tools) too. No points: the celebration comes at the end. To work on one part, pick a section and turn Practice on.') +
        '<h3 class="w-q">Which song?</h3><div class="mc-list sw-list">' + songs.map(row).join('') + '</div>' +
        (sets.length ? '<h4 class="sw-sub">My melodies</h4><div class="mc-list sw-list">' + sets.map(row).join('') + '</div>' : '') +
        '<h3 class="w-q">What to play</h3><div class="sw-what">' + seg('part', [['whole', 'The whole song'], ['part', 'A section']], SW.part ? 'part' : 'whole') +
          (SW.part ? '<span class="sw-range"><label>Slide <select id="sw-from" aria-label="From slide">' + opts(SW.from) + '</select></label>' +
            '<label>to <select id="sw-to" aria-label="To slide">' + opts(SW.to) + '</select></label></span>' : '') + '</div>' +
        '<div class="sw-slides" role="group" aria-label="The slides">' + pics + '</div>' +
        '<h3 class="w-q">How</h3><table class="helps sw-how"><tbody>' +
          '<tr><td>Practice</td><td>' + seg('practice', [['false', 'Off'], ['true', 'On']], String(SW.practice)) + '<small>' + (SW.practice ? 'Each slide goes round until you move on — Listen and the hints there.' : 'Straight through, slide to slide.') + '</small></td></tr>' +
          '<tr><td>Auto-Next Slide</td><td>' + seg('auto', [['true', 'On'], ['false', 'Off']], String(SW.auto)) + '<small>' + (SW.auto ? 'The next slide comes by itself.' : 'Next moves on.') + '</small></td></tr>' +
        '</tbody></table>' +
      '</div>' +
      '<footer class="sheet-foot"><button type="button" class="pill-btn" data-sw="close">Cancel</button>' +
        '<button type="button" class="pill-btn go" data-sw="play"' + (L ? '' : ' disabled') + '>▶ Play' + (L ? ' ' + esc(L.title) : '') + '</button></footer></div>';
  }
  const SONG_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 34V12l20-5v22" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/><path d="M18 17.5l20-5" stroke="#fff" stroke-width="3.4"/><ellipse cx="13.5" cy="34.5" rx="5.6" ry="4.4" fill="#fff"/><ellipse cx="33.5" cy="29.5" rx="5.6" ry="4.4" fill="#fff"/></svg>';
  function drawSongs(focusSel) {
    const body = songWin.querySelector('.pick-body'), y = body ? body.scrollTop : 0;
    songWin.innerHTML = songsHtml();
    songWin.querySelector('.pick-body').scrollTop = y;
    const f = focusSel && songWin.querySelector(focusSel); if (f) f.focus();
  }
  T.openSongs = function () {
    if (!songWin) {
      songWin = document.createElement('div');
      songWin.className = 'modal pick-modal songs-play-modal'; songWin.hidden = true;
      document.body.appendChild(songWin);
      songWin.addEventListener('click', onSongsClick);
      songWin.addEventListener('change', e => {
        if (e.target.id === 'sw-from') { SW.from = +e.target.value; SW.to = Math.max(SW.to, SW.from); drawSongs('#sw-from'); }
        else if (e.target.id === 'sw-to') { SW.to = +e.target.value; SW.from = Math.min(SW.from, SW.to); drawSongs('#sw-to'); }
      });
      songWin.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); T.closeSongs(); } });
    }
    RR.Tools.close();
    // where it opens: the song playing, as it plays; else the last song picked here — Practice off, Auto-Next on
    if (songMode()) Object.assign(SW, { id: T.id, part: !whole(), from: range()[0], to: range()[1], practice: !!G.mode.practice, auto: G.mode.auto !== false });
    else {
      const last = RR.device.songPick && typeof RR.device.songPick === 'string' && RR.teachLevel(RR.device.songPick) ? RR.device.songPick : 'S:hot-cross-buns';
      Object.assign(SW, { id: last, part: false, from: 0, to: 0, practice: false, auto: true });
    }
    songWin.innerHTML = songsHtml();
    RR.windowOpened(songWin);
    songWin.hidden = false;
    const f = songWin.querySelector('.sw-list .on') || songWin.querySelector('[data-sw="song"]'); if (f) f.focus();
  };
  T.closeSongs = function () {
    if (!T.songsOpen()) return;
    songWin.hidden = true;
    RR.windowClosed(songWin);
    if (RR.View.current === 'home') RR.View.render();
  };
  function onSongsClick(e) {
    if (e.target === songWin) { T.closeSongs(); return; }
    if (RR.foldClick(e)) return;
    const b = e.target.closest('[data-sw]'); if (!b) return;
    const a = b.dataset.sw, L = RR.teachLevel(SW.id), n = L ? L.ex.length : 1;
    if (a === 'close') T.closeSongs();
    else if (a === 'song') { SW.id = b.dataset.id; SW.from = 0; SW.to = Math.max(0, (RR.teachLevel(SW.id) || { ex: [0] }).ex.length - 1); drawSongs('.sw-list .on'); }
    else if (a === 'part') {
      SW.part = b.dataset.v === 'part';
      if (SW.part && (SW.to <= SW.from || (SW.from === 0 && SW.to >= n - 1))) SW.to = Math.min(n - 1, SW.from + 1);   // a section to begin with: two slides
      drawSongs('[data-sw="part"].on');
    }
    else if (a === 'slide') {
      // a slide tapped: a section starting there — or, inside one, its end moved out to it
      const i = +b.dataset.i;
      if (!SW.part) { SW.part = true; SW.from = SW.to = i; }
      else if (i < SW.from) SW.from = i;
      else if (i > SW.to) SW.to = i;
      else SW.from = SW.to = i;
      drawSongs('[data-sw="slide"][data-i="' + i + '"]');
    }
    else if (a === 'practice') { SW.practice = b.dataset.v === 'true'; drawSongs('[data-sw="practice"].on'); }
    else if (a === 'auto') { SW.auto = b.dataset.v === 'true'; drawSongs('[data-sw="auto"].on'); }
    else if (a === 'play') {
      const id = SW.id, opt = { from: SW.part ? SW.from : 0, to: SW.part ? SW.to : n - 1, practice: SW.practice, auto: SW.auto };
      RR.device.songPick = id; RR.saveDevice();
      T.closeSongs();
      if (T.start(id, opt.from, opt)) { RR.View.go('play'); G.announce('Songs · ' + RR.teachLevel(id).title); }
    }
  }
  /* the drop-down's songs: another one, from its start, the same way */
  T.startSong = function (id) {
    const L = RR.teachLevel(id); if (!L) return false;
    const was = songMode() ? { practice: !!G.mode.practice, auto: G.mode.auto !== false } : { practice: false, auto: true };
    RR.device.songPick = id; RR.saveDevice();
    return T.start(id, 0, Object.assign({ from: 0, to: L.ex.length - 1 }, was));
  };
})();

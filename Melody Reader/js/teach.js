/* ==========================================================================
   Melody Reader — teach.js
   --------------------------------------------------------------------------
   RR.Teach — Teach Me to Read (2026-10-11, the user's design; the data is
   teach-data.js). A level is played on the music card like any other
   (G.mode = { kind: 'teach', id }), with these differences:

     the staff     its notes' lines lit in their bars' colours, the rest
                   greyed (the green F line too in Advanced)
     the bars      only the level's own are live; letters under the notes
     no Test       no Practice / Test button and no score: play the
                   exercise on your own and it gets a green check
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
                   at the top go to any exercise. After the fifth: a card
                   with the five marks — the ones left (if any), or Try
                   again for gold stars (unless all five are gold), the
                   Advanced level, the next level, Home
     ⌨ Keyboard    the music card shows a computer keyboard, the level's
                   keys lit in their bars' colours (3 E · 5 G; Advanced
                   0 and = for the high E and G). They play — so do the
                   real keys and the bars — but nothing counts: just to
                   learn where the notes are. ♪ Back to the music (or the
                   button again, or Escape) returns

   Each player's marks are kept (RR.TeachMarks, the best of each). The
   home page has a card for it in Make your own, beside A new session
   (2026-10-11); its ▶ Play opens a window — which level, where to start
   (openWindow). The level box's drop-down lists the six (dropHtml).
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
  const marks = () => RR.TeachMarks.get(T.id);
  /* what comes after each level, on its last card (the user's: the Advanced level, or the next level) */
  const NEXT = { L1: ['A1', 'L2'], A1: ['L2'], L2: ['A2', 'L3'], A2: ['L3'], L3: ['A3'], A3: [] };
  const andList = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];

  /* the practice a level is played with: its notes, quarters and eighths, two bars of 4/4, every help */
  function practiceOf(L) {
    return Object.assign(RR.clone(RR.DEFAULTS), {
      notes: L.notes.slice(), rhythms: ['q', 'ee'], time: [4, 4], times: [[4, 4]], bars: 2, moves: 'skips', endDo: false,
      grey: true, colour: 'solid', letters: true, nums: true, glow: 'after2', labels: 'letters',
      practice: true, practiceStart: 'on', from: 'made', game: 'round5', auto: false, playHidden: false, playLights: true
    });
  }

  /* a level at an exercise (a reload, the window's Start at) — or at the first not yet played */
  T.start = function (id, at) {
    const L = RR.teachLevel(id) || RR.TEACH[0];
    kbd(false);
    $('#btn-metro').classList.remove('hint');
    T.id = L.id;
    const m = marks();
    T.at = typeof at === 'number' && at >= 0 ? Math.min(at | 0, m.length - 1) : Math.max(0, m.indexOf(0));
    G.usePractice(practiceOf(L), { kind: 'teach', id: L.id });
  };
  T.card = () => RR.clone(RR.teachCards(lv())[T.at]);
  /* any exercise, played or not (2026-10-11, the user's: "teachers need to move more freely with it") */
  T.go = function (i) {
    if (!on() || i < 0 || i >= lv().ex.length) return;
    RR.Board.hideRound();
    T.at = i; G.remember();
    G.nextCard(T.card());
  };
  T.marked = () => marks()[T.at] > 0;

  /* ---- a play done ---- */
  /* on your own, every note found (game.js practiceFound): a check */
  T.found = function () {
    const first = !T.marked();
    RR.TeachMarks.set(T.id, T.at, 1);
    float(false);
    if (first && RR.device.celebrate) RR.Sound.celebrate(2);
    const last = T.at === lv().ex.length - 1;
    G.announce(first ? 'You played it! Play it again, or press ' + (last ? 'Finish.' : 'Next.') : 'You played it again!');
    G.draw();
    if (first) $('#btn-next').classList.add('ready');
  };
  /* with the metronome: a gold star — every note, no wrong bar — or a check, or nothing for a time round
     with notes missed. Round and round (`looping`, beat.js): each time round, the music going on — the
     sound and the words only when the mark goes up (a class playing along on real xylophones isn't
     interrupted every time round) */
  T.runDone = function (looping) {
    const idx = G.evs.map((e, i) => e.rest ? -1 : i).filter(i => i >= 0);
    const missed = idx.filter(i => G.judge[i] === 'Missed').length, wrong = G.run ? G.run.wrong : 0;
    const was = T.marked();
    const mark = RR.teachMark({ run: !!G.run, missed, wrong });
    const better = RR.TeachMarks.set(T.id, T.at, mark);
    if (mark) float(mark === 2);
    if (mark && better && RR.device.celebrate) RR.Sound.celebrate(mark === 2 ? 3 : 2);
    if (!looping || better) G.announce(mark === 2 ? 'A gold star! Every note, with the metronome.' :
      mark === 1 ? 'Every note — with a wrong bar on the way. Again for a gold star.' :
        missed + (missed === 1 ? ' note' : ' notes') + ' missed. Start over to go again.');
    G.draw();
    if (!looping) $('#btn-restart').classList.add('ready');
    if (!was && mark && !looping) $('#btn-next').classList.add('ready');
  };
  /* ↻: this exercise again — counted in, with the metronome on */
  T.again = function () {
    if (T.kbdOn()) return;
    G.stopHear(true); RR.Beat.stop(); clearTimeout(G.practiceT);
    const metro = G.metroOn();
    G.resetCard(metro ? 'game' : 'practice'); G.draw();
    if (metro) RR.Beat.start();
    G.announce(metro ? 'Again, with the metronome.' : 'From the top.');
  };
  T.next = function () {
    if (T.kbdOn()) return;
    if (T.at < lv().ex.length - 1) T.go(T.at + 1); else end();
  };

  /* the controls in Teach Me to Read (after game.js drawSides) */
  T.drawSides = function () {
    const kb = T.kbdOn(), done = T.marked(), last = T.at === lv().ex.length - 1;
    const nx = $('#btn-next');
    nx.disabled = kb;
    nx.classList.toggle('teach-ok', done);             // lit once it is played through — but never in the way
    nx.title = last ? 'Finish ' + lv().long : 'The next exercise';
    nx.setAttribute('aria-label', nx.title);
    $('.next-label').textContent = last ? 'Finish' : 'Next';
    const r = $('#btn-restart');
    r.disabled = kb;
    r.title = G.metroOn() ? 'Again, with the metronome' : 'Start this one over';
    r.setAttribute('aria-label', r.title);
    const m = $('#btn-metro');
    m.disabled = kb;
    m.title = G.metroOn() ? 'Metronome: ' + RR.Points.paceOf(G.metro).name + ' (' + RR.beatTempo(G.setup, G.metro, G.card.time) + ' BPM) — play along for a gold star. Tap to change.' :
      'Metronome off. Tap it, pick Slow or Moderate, and play along for a gold star';
    m.setAttribute('aria-label', m.title);
    const play = $('#btn-play');
    if (kb) play.disabled = true;
    else if (!G.hearing) play.title = 'Listen — round and round until you press it again' + (G.metroOn() ? ', with the metronome' : '');
    const k = $('#btn-kbd');
    k.classList.toggle('on', kb);
    k.setAttribute('aria-pressed', String(kb));
  };

  /* the five exercises at the top: a gold star, a check, or not yet — a tap goes to any one */
  T.dotsHtml = function () {
    const m = marks();
    return m.map((x, i) => '<button type="button" class="dot' + (x ? ' done ' + (x === 2 ? 'gold' : 'made') : '') + (i === T.at ? ' now' : '') + '" data-tx="' + i + '"' +
      ' aria-label="Exercise ' + (i + 1) + (x === 2 ? ', a gold star' : x ? ', played' : '') + (i === T.at ? ', this one' : '') + '"></button>').join('');
  };
  $('#dots').addEventListener('click', e => {
    const b = e.target.closest('[data-tx]');
    if (b && on() && !T.kbdOn() && !G.overlay) T.go(+b.dataset.tx);
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

  /* ---- after the fifth: the marks, and where next ---- */
  function end() {
    G.stopHear(true); RR.Beat.stop(); clearTimeout(G.practiceT);
    const L = lv(), m = marks(), gold = m.filter(x => x === 2).length, all = gold === m.length;
    const played = m.filter(Boolean).length, left = m.length - played;
    const nexts = NEXT[L.id].map(RR.teachLevel);
    // moved on before playing them all (free to, since 2026-10-11): which are left, and a way back to them
    const leftWords = andList(m.map((x, i) => x ? 0 : i + 1).filter(Boolean).map(String));
    const say = all ? 'Five gold stars — every one with the metronome!' :
      left ? (left === 1 ? 'Exercise ' + leftWords + ' is' : 'Exercises ' + leftWords + ' are') + ' still to play — go back for ' + (left === 1 ? 'it' : 'them') + ', or move on.' :
      gold ? gold + (gold === 1 ? ' gold star' : ' gold stars') + ' with the metronome. Play the others with it for all five!' :
        'You played all five! Now play them with the metronome for gold stars.';
    const btns = (left ? '<button type="button" class="pill-btn primary" data-teach="left">▶ ' + (left === 1 ? 'The one left' : 'The ones left') + '</button>' :
        all ? '' : '<button type="button" class="pill-btn primary" data-teach="gold">' + RR.STAR_SVG + 'Try again for gold stars</button>') +
      nexts.map(x => '<button type="button" class="pill-btn go" data-teach="go" data-id="' + x.id + '">' + esc(x.long) + ' ▸</button>').join('') +
      '<button type="button" class="pill-btn' + (all && !nexts.length ? ' go' : '') + '" data-teach="home">' + RR.HOME_SVG + 'Home</button>';
    const el = $('#rounddone');
    el.innerHTML = '<div class="rd-card te-card"><div class="te-kicker">Teach Me to Read · ' + esc(L.long) + '</div>' +
      '<h3>' + (all ? 'Five gold stars!' : left ? played + ' of ' + m.length + ' played' : 'All five done!') + '</h3>' +
      '<div class="te-marks">' + m.map((x, i) => '<span class="te-mk' + (x === 2 ? ' g' : '') + '">' + (x === 2 ? RR.STAR_SVG : x ? RR.CHECK_SVG : '<i class="te-none"></i>') + '<small>' + (i + 1) + '</small></span>').join('') + '</div>' +
      '<p class="te-say">' + say + '</p>' +
      (!nexts.length && all ? '<p class="te-say small">You can read ' + esc(L.sub.replace(', A low', ' — and A')) + '.</p>' : '') +
      '<div class="rd-btns">' + btns + '</div></div>';
    el.hidden = false;
    G.overlay = true;
    const f = el.querySelector('.pill-btn.go') || el.querySelector('.pill-btn'); if (f) f.focus();
    G.announce(L.long + ' done. ' + say);
    if (RR.device.celebrate) RR.Sound.celebrate(all ? 3 : 2);
  }
  T.end = end;
  /* Try again for gold stars: the first exercise without one, the metronome pointed out */
  function goldTry() {
    const m = marks(), i = Math.max(0, m.findIndex(x => x < 2));
    T.go(i);
    $('#btn-metro').classList.add('hint');
    RR.toast('Tap the metronome — Slow or Moderate — and play along for a gold star');
  }
  $('#rounddone').addEventListener('click', e => {
    const b = e.target.closest('[data-teach]'); if (!b || !on()) return;
    const a = b.dataset.teach;
    if (a === 'gold') goldTry();
    else if (a === 'left') T.go(Math.max(0, marks().indexOf(0)));
    else if (a === 'go') { T.start(b.dataset.id); G.announce('Teach Me to Read · ' + RR.teachLevel(b.dataset.id).long); }
    else if (a === 'home') { RR.Board.hideRound(); T.go(0); RR.View.go('home'); }
  });

  /* ---- the computer keyboard (the user's: "just to play with it to understand the computer keyboard
     layout") — the number row, the level's keys lit in their bars' colours and playable; the letters
     row under it, greyed, so it looks like the keyboard in front of them ---- */
  const ROW1 = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
  const ROW2 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'];
  T.kbdOn = () => $('#app').classList.contains('kbd-on');
  // both octaves of a letter in the level: say which is which
  const octWord = b => lv().notes.filter(id => id[0] === b.letter).length > 1 ? (b.octave === 4 ? 'low ' : 'high ') : '';
  function keyHtml(k) {
    const i = RR.KEYS.indexOf(k), b = i >= 0 ? RR.BARS[i] : null, L = lv();
    // = and + are one key (+ is Shift and =): with high A in the level, the key shows both, + over = as printed
    if (k === '=' && L.notes.includes('A5')) {
      const half = (bar, sym, cls) => L.notes.includes(bar.id)
        ? '<button type="button" class="kk-half lit ' + cls + '" data-bar="' + bar.id + '" style="--c:' + bar.colour + '" aria-label="' + (sym === '+' ? 'Shift and equals (plus)' : 'Equals') + ' plays ' + octWord(bar) + bar.letter + '">' +
          '<b>' + sym + '</b><small><span class="oct">' + octWord(bar) + '</span>' + bar.letter + '</small></button>'
        : '<span class="kk-half ' + cls + '"><b>' + sym + '</b></span>';
      return '<span class="kk split">' + half(RR.BAR.A5, '+', 'top') + half(RR.BAR.G5, '=', 'bottom') + '</span>';
    }
    if (!b || !L.notes.includes(b.id)) return '<span class="kk' + (i >= 0 ? ' num' : ' edge') + '">' + esc(RR.keyShow(k)) + '</span>';
    const oct = octWord(b);
    return '<button type="button" class="kk lit" data-bar="' + b.id + '" style="--c:' + b.colour + '" aria-label="Key ' + RR.keyName(k) + ' plays ' + oct + b.letter + '">' +
      '<b>' + RR.keyShow(k) + '</b><small>' + (oct ? '<span class="oct">' + oct + '</span>' : '') + b.letter + '</small></button>';
  }
  function kbdHtml() {
    const L = lv(), lit = RR.KEYS.map((k, i) => RR.BARS[i]).filter(b => L.notes.includes(b.id));
    return '<div class="kbd-head"><b>Your computer’s keyboard plays the bars too</b>' +
      '<span>' + lit.map(b => '<em><i style="--c:' + b.colour + '">' + RR.keyShow(b.key) + '</i>' + octWord(b) + b.letter + (b.key === '+' ? ' <small>(Shift and =)</small>' : '') + '</em>').join('') + '</span></div>' +
      '<div class="kbd-board" role="group" aria-label="The number keys">' +
        '<div class="kbd-row">' + ROW1.map(keyHtml).join('') + '<span class="kk wide edge">delete</span></div>' +
        '<div class="kbd-row r2"><span class="kk wide">tab</span>' + ROW2.map(k => '<span class="kk">' + esc(k) + '</span>').join('') + '<span class="kk">\\</span></div>' +
      '</div>' +
      '<div class="kbd-foot"><span class="kbd-note">Press them, or tap them — just for playing: the music waits.</span>' +
        '<button type="button" class="pill-btn go" data-kb="back">♪ Back to the music</button></div>';
  }
  function kbd(want) {
    const app = $('#app');
    if (!!want === T.kbdOn()) return;
    if (want) {
      // nothing goes on underneath: the sound stops, a play with the metronome is called off, the exercise starts afresh
      G.pause(); clearTimeout(G.practiceT);
      G.metro = 'off'; G.closePick();
      G.resetCard('practice');
      $('#kbd-view').innerHTML = kbdHtml();
    }
    app.classList.toggle('kbd-on', !!want);
    if (!want) $('#kbd-view').innerHTML = '';
    G.draw();
    G.announce(want ? 'The computer keyboard: ' + lv().notes.map(id => RR.BAR[id].key + ' plays ' + RR.BAR[id].letter).join(', ') + '.' : 'Back to the music.');
    const f = want ? $('#kbd-view .kk.lit') : $('#btn-kbd'); if (f) f.focus();
  }
  T.kbd = kbd;
  /* a bar played while the keyboard shows — its key, its bar and its sound; nothing counts */
  T.kbdHit = function (id) {
    const k = $('#kbd-view [data-bar="' + id + '"]');
    if (k) {
      k.classList.remove('hit'); void k.offsetWidth; k.classList.add('hit');
      clearTimeout(k._t); k._t = setTimeout(() => k.classList.remove('hit'), 240);
    }
    RR.Xylo.flash(id, 'right', 420);
  };
  $('#btn-kbd').addEventListener('click', () => { if (on() && !G.overlay) kbd(!T.kbdOn()); });
  const kv = $('#kbd-view');
  kv.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-bar]'); if (!b) return;
    e.preventDefault();
    RR.Xylo.press(b.dataset.bar, e);
  });
  kv.addEventListener('click', e => {
    if (e.target.closest('[data-kb="back"]')) { kbd(false); return; }
    // Enter or Space on a focused key (a pointer has already played it)
    const b = e.target.closest('[data-bar]');
    if (b && e.detail === 0) RR.Xylo.press(b.dataset.bar, e);
  });

  /* ---- the six as tiles, each with its five marks: the window (below) and the drop-down ---- */
  const GL = typeof GLYPHS_LELAND !== 'undefined' ? GLYPHS_LELAND : null;
  function staffSvg(L) {
    const yOf = st => 34 - (st - 30) * 3.5;                 // E4 on the bottom line, 7 units to a space
    const lines = L.lines.map((c, i) => {
      const y = 34 - i * 7;
      return c === 'dim' ? '<line x1="0" x2="100" y1="' + y + '" y2="' + y + '" stroke="#d9cfbf" stroke-width="1.3"/>'
        : '<line x1="0" x2="100" y1="' + y + '" y2="' + y + '" stroke="' + c + '" stroke-width="3.2"/>';
    }).join('');
    const ns = L.notes.slice().sort((a, b) => RR.BAR[a].step - RR.BAR[b].step);
    const heads = ns.map((id, i) => {
      const x = ns.length === 1 ? 62 : 34 + i * (60 / (ns.length - 1)), y = yOf(RR.BAR[id].step);
      const led = RR.BAR[id].step >= 40 ? '<line x1="' + (x - 7).toFixed(1) + '" x2="' + (x + 7).toFixed(1) + '" y1="' + yOf(40) + '" y2="' + yOf(40) + '" stroke="' + ((L.ledgers && L.ledgers[40]) || '#2b1d16') + '" stroke-width="2.6"/>' : '';
      return led + '<ellipse cx="' + x.toFixed(1) + '" cy="' + y + '" rx="4.3" ry="3.2" transform="rotate(-20 ' + x.toFixed(1) + ' ' + y + ')" fill="' + RR.BAR[id].colour + '" stroke="#2b1d16" stroke-width="1"/>';
    }).join('');
    const clef = GL ? '<path transform="translate(3 ' + yOf(32) + ') scale(0.0194)" fill="#2b1d16" d="' + GL.gClef.d + '"/>' : '';
    return '<svg viewBox="0 -8 100 56" aria-hidden="true">' + lines + clef + heads + '</svg>';
  }
  /* `picked`: the window's choice (else the level playing is the one ringed) */
  function tileHtml(L, a, picked) {
    const m = RR.TeachMarks.get(L.id), cur = picked !== undefined ? picked === L.id : on() && T.id === L.id;
    const done = m.filter(Boolean).length, gold = m.filter(x => x === 2).length;
    return '<button type="button" class="tt' + (L.adv ? ' adv' : '') + (cur ? ' on' : '') + '" data-' + a + '="teach" data-id="' + L.id + '" aria-pressed="' + cur + '" ' +
      'aria-label="' + esc(L.long + (L.adv ? '' : ', ' + L.name) + ': ' + L.sub + '. ' + done + ' of ' + m.length + ' played, ' + gold + (gold === 1 ? ' gold star' : ' gold stars')) + '">' +
      '<span class="tt-staff">' + staffSvg(L) + '</span>' +
      '<span class="tt-txt"><b>' + esc(L.adv ? L.title : L.title + ' · ' + L.name) + '</b><small>' + esc(L.sub) + '</small>' +
      '<span class="tt-marks" aria-hidden="true">' + m.map(x => '<i class="' + (x === 2 ? 'g' : x ? 'c' : '') + '"></i>').join('') + '</span></span></button>';
  }
  T.dropHtml = () => '<h3 class="dd-h">Choose a different level</h3><div class="teach-grid in-drop">' + RR.TEACH.map(L => tileHtml(L, 'd')).join('') + '</div>';
  /* where it is, in words (the home page's Carry on, the drop-down's head) */
  T.where = () => 'exercise ' + (T.at + 1) + ' of ' + lv().ex.length + ' · ' + marks().filter(Boolean).length + ' played';
  /* the home page card's foot: how far this player has come, all six together */
  T.progressWords = function () {
    const all = [].concat.apply([], RR.TEACH.map(L => RR.TeachMarks.get(L.id)));
    const done = all.filter(Boolean).length, gold = all.filter(x => x === 2).length;
    return done ? '<b>' + done + '</b> of ' + all.length + ' played' + (gold ? ' · <b>★ ' + gold + '</b>' : '') : '';
  };

  /* ---- the window (2026-10-11, the user's: "open a window similar to the other sections that will let the
     user choose what to do") — the home page card's ▶ Play opens it; nothing starts until its own ▶ Play.
     Which level (the six tiles, with their marks), then where to start — any exercise, the first not yet
     played to begin with — and, once a level has marks, clearing them for a new start ---- */
  const W = { id: 'L1', at: 0 };
  let win = null;
  T.windowOpen = () => !!(win && !win.hidden);
  const firstTodo = id => Math.max(0, RR.TeachMarks.get(id).indexOf(0));
  const LINE_NAME = { E4: 'yellow', G4: 'turquoise', B4: 'purple', D5: 'orange', F5: 'green' };
  function windowHtml() {
    const L = RR.teachLevel(W.id), m = RR.TeachMarks.get(L.id);
    const lit = ['E4', 'G4', 'B4', 'D5', 'F5'].filter((id, i) => L.lines[i] !== 'dim').map(id => LINE_NAME[id]).concat(L.ledgers ? ['blue (high A)'] : []);
    const keys = RR.BARS.filter(b => L.notes.includes(b.id)).map(b => b.key);
    const ex = m.map((x, i) => '<button type="button" class="tw-ex' + (i === W.at ? ' on' : '') + '" data-tw="at" data-i="' + i + '"' +
      ' aria-pressed="' + (i === W.at) + '" aria-label="Exercise ' + (i + 1) + (x === 2 ? ', a gold star' : x ? ', played' : ', not played yet') + '">' +
      (x === 2 ? RR.STAR_SVG : x ? RR.CHECK_SVG : '<i class="tw-none"></i>') + '<small>' + (i + 1) + '</small></button>').join('');
    return '<div class="sheet pick-sheet teach-sheet" role="dialog" aria-modal="true" aria-labelledby="tw-title" style="--mc:' + RR.TEACH_COLOUR + '">' +
      '<header class="sheet-head"><span class="mc-ico light">' + RR.TEACH_ICON + '</span><h2 id="tw-title">Teach Me to Read</h2>' +
      '<button class="icon-btn close" data-tw="close" type="button" aria-label="Close">×</button></header>' +
      '<div class="pick-body">' +
        RR.note('tw', 'The very first notes, their own lines lit on the staff. Play each exercise all the way through for a green check — then along with the metronome for a gold star. ⌨ Keyboard shows which computer keys play the bars.') +
        '<h3 class="w-q">Which level?</h3><div class="tw-levels"><div class="teach-grid">' + RR.TEACH.map(x => tileHtml(x, 'tw', W.id)).join('') + '</div></div>' +
        '<div class="tw-now"><div class="tw-what"><b>' + esc(L.long + ' · ' + L.name) + '</b>' +
          '<span>' + esc(L.sub) + ' · the ' + andList(lit) + ' lines lit · keys ' + andList(keys.map(k => k === '+' ? '+ (Shift and =)' : k)) + '</span></div>' +
          '<div class="tw-start"><span class="lbl">Start at</span><div class="tw-exs" role="group" aria-label="Start at exercise">' + ex + '</div></div>' +
          (m.some(Boolean) ? '<button type="button" class="h-link tw-clear" data-tw="clear">↺ Clear its checks and stars</button>' : '') + '</div>' +
      '</div>' +
      '<footer class="sheet-foot"><button type="button" class="pill-btn" data-tw="close">Cancel</button>' +
      '<button type="button" class="pill-btn go" data-tw="play">▶ Play ' + esc(L.title) + '</button></footer></div>';
  }
  function drawWindow(focusSel) {
    const body = win.querySelector('.pick-body'), y = body ? body.scrollTop : 0;
    win.innerHTML = windowHtml();
    win.querySelector('.pick-body').scrollTop = y;
    const f = focusSel && win.querySelector(focusSel); if (f) f.focus();
  }
  T.openWindow = function () {
    if (!win) {
      win = document.createElement('div');
      win.className = 'modal pick-modal teach-modal'; win.hidden = true;
      document.body.appendChild(win);
      win.addEventListener('click', onWindowClick);
      win.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); T.closeWindow(); } });
    }
    // where it opens: the level playing (at its exercise), or the first level not yet played through
    if (on()) { W.id = T.id; W.at = T.at; }
    else {
      const next = RR.TEACH.find(x => RR.TeachMarks.get(x.id).includes(0));
      W.id = next ? next.id : 'L1'; W.at = firstTodo(W.id);
    }
    win.innerHTML = windowHtml();
    RR.windowOpened(win);
    win.hidden = false;
    const f = win.querySelector('.tt.on'); if (f) f.focus();
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
    else if (a === 'teach') { W.id = b.dataset.id; W.at = on() && T.id === W.id ? T.at : firstTodo(W.id); drawWindow('.tt.on'); }
    else if (a === 'at') { W.at = +b.dataset.i; drawWindow('.tw-ex.on'); }
    else if (a === 'clear') {
      const L = RR.teachLevel(W.id), who = RR.Players ? RR.Players.current() : '';
      const yes = await RR.ask('Clear the checks and gold stars of ' + L.long + (who ? ' for ' + who : '') + '? It starts again from exercise 1.', 'Clear them');
      if (!yes) return;
      RR.TeachMarks.reset(W.id); W.at = 0;
      if (on() && T.id === W.id) T.at = 0;
      drawWindow('.tt.on');
    } else if (a === 'play') {
      const id = W.id, at = W.at;
      T.closeWindow();
      T.start(id, at);
      RR.View.go('play');
    }
  }
})();

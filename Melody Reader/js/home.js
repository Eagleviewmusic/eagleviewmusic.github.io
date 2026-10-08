/* ==========================================================================
   Melody Reader — home.js
   --------------------------------------------------------------------------
   The home page (2026-10-07, the user's ask: "a neutral page", not always
   mid-game) and the three views the app moves between:

     home    where the app opens. Carry on (or Play) what was playing ·
             What to read: the fifteen levels and My sessions · How to
             play: Rounds, Songs, Beat the Clock, Endless, Battle · Make
             your own: My melodies, a new session, a lesson link · My
             stats, in brief
     play    the music and the xylophone (as before)
     stats   My stats (stats.js)

   RR.View.go(v) moves, keeping the browser's Back button in step (one
   history entry above home, so Back from the music or My stats comes
   home and Back from home leaves the app). Leaving the music pauses it
   (G.leave): a count-in stops, a Beat the clock under way is over. A
   lesson link opens straight on the music.

   The format cards keep their choices (how many melodies, the clock's
   length, the songs) here until ▶ Play; then RR.Settings.setFormat saves
   them as the Format tab would — the browser's for a level, its own for
   a session — and a new round starts. A battle is chosen from its card;
   the other cards then play the level this browser was last on.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game, esc = RR.esc;

  /* ================= the views ================= */
  const VIEWS = ['home', 'play', 'stats'];
  const View = RR.View = { current: null, prev: 'home', pushed: false };
  function closeWindows() {
    if (RR.Settings.isOpen()) RR.Settings.close();
    if (RR.Board.isOpen()) RR.Board.close();
    if (RR.Melodies.isOpen()) RR.Melodies.close();
    if (songsOpen()) closeSongs();
  }
  /* a round that is over (Round done, Time's up, a battle won) or a clock left part-way: a new one */
  const roundOver = () => G.needNew || (isFinite(G.roundN) && G.round.length >= G.roundN);
  function show(v) {
    if (!VIEWS.includes(v)) v = 'home';
    const was = View.current;
    if (was === 'play' && v !== 'play') G.leave();
    if (was !== v) View.prev = was || 'home';
    View.current = v;
    const root = document.documentElement;
    VIEWS.forEach(x => root.classList.toggle('view-' + x, x === v));
    const back = v === 'stats' && View.prev === 'play', hb = $('#app-home');
    hb.querySelector('span').textContent = back ? 'Back' : 'Home';
    hb.setAttribute('aria-label', back ? 'Back to the music' : 'Home');
    hb.classList.toggle('is-back', back);
    if (RR.Charts) RR.Charts.hideTip();
    if (v === 'home') { if (was !== 'home') resetPicks(); render(); }
    else if (v === 'stats') { RR.Stats.render(); if (was !== 'stats') $('#stats').scrollTop = 0; }
    else { if (roundOver()) G.newRound(); G.draw(); G.syncTick(); }
    if (was && was !== v) {
      const f = v === 'home' ? $('#home .big-play') : v === 'stats' ? $('#stats h2') : null;
      if (f) f.focus({ preventScroll: true });
      G.announce(v === 'home' ? 'Home' : v === 'stats' ? 'My stats' : 'The music');
    }
  }
  function go(v) {
    const st = history.state, mine = st && st.mr;
    if (v === 'home') {
      // back down to the home entry, if this page put one above it
      if (mine && st.v !== 'home' && View.pushed) { history.back(); return; }
      show('home'); return;
    }
    try {
      if (!mine || st.v === 'home') { history.pushState({ mr: 1, v }, ''); View.pushed = true; }
      else history.replaceState({ mr: 1, v }, '');
    } catch (_) { /* no history here: just move */ }
    show(v);
  }
  window.addEventListener('popstate', e => {
    const v = e.state && e.state.mr ? e.state.v : 'home';
    // writing a melody: Back is Cancel (it asks first when there is something to lose)
    if (RR.Maker && RR.Maker.active && v !== 'play') { try { history.pushState({ mr: 1, v: 'play' }, ''); } catch (_) {} RR.Maker.cancel(); return; }
    if (v === 'home') View.pushed = false;
    if (v !== 'play') closeWindows();
    show(v);
  });
  function init(v) {
    try { history.replaceState({ mr: 1, v: 'home' }, ''); } catch (_) {}
    if (v === 'play') go('play'); else show('home');
  }
  /* the page's own back: My stats goes back where it came from */
  View.back = () => { if (View.current === 'stats' && View.prev === 'play') go('play'); else go('home'); };
  Object.assign(View, { go, show, init });

  /* ================= the home page ================= */
  // each card's colour; white text on every one passes WCAG AA (4.5:1)
  const MODE_COL = { round: '#2563eb', song: '#7c3aed', clock: '#c2410c', endless: '#0f766e', battle: '#dc2626', mel: '#15803d', ses: '#0f766e', link: '#6d28d9' };
  const ICON = {
    round: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="9" cy="24" r="5" fill="#ef4444"/><circle cx="24" cy="24" r="5" fill="#facc15"/><circle cx="39" cy="24" r="5" fill="#22c55e"/><circle cx="16.5" cy="24" r="5" fill="#f97316"/><circle cx="31.5" cy="24" r="5" fill="#2dd4bf"/></svg>',
    song: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 34V12l20-5v22" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/><path d="M18 17.5l20-5" stroke="#fff" stroke-width="3.4"/><ellipse cx="13.5" cy="34.5" rx="5.6" ry="4.4" fill="#fff"/><ellipse cx="33.5" cy="29.5" rx="5.6" ry="4.4" fill="#fff"/></svg>',
    clock: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="27" r="15" fill="none" stroke="#fff" stroke-width="3.6"/><path d="M24 27V18.5M24 27l6 4" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><path d="M19.5 6.5h9M24 6.5V12M36 11.5l3 3" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/></svg>',
    endless: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 24c-4.6-5.8-7.6-8.4-11.4-8.4a8.4 8.4 0 0 0 0 16.8c3.8 0 6.8-2.6 11.4-8.4zm0 0c4.6 5.8 7.6 8.4 11.4 8.4a8.4 8.4 0 0 0 0-16.8c-3.8 0-6.8 2.6-11.4 8.4z" fill="none" stroke="#fff" stroke-width="3.6" stroke-linejoin="round"/></svg>',
    battle: '<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="#fff" stroke-linecap="round" fill="none"><path d="M9 9l22 22M39 9L17 31" stroke-width="3.8"/><path d="M26.5 35.5l9-9M21.5 35.5l-9-9" stroke-width="3.6"/><path d="M31 31l6.5 6.5M17 31l-6.5 6.5" stroke-width="4.4"/></g><circle cx="39.4" cy="39.4" r="2.6" fill="#fff"/><circle cx="8.6" cy="39.4" r="2.6" fill="#fff"/></svg>',
    mel: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M9 39l2.4-8.6L31 10.8a3 3 0 0 1 4.2 0l2 2a3 3 0 0 1 0 4.2L17.6 36.6z" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/><path d="M27.5 14.3l6.2 6.2" stroke="#fff" stroke-width="3.4"/></svg>',
    ses: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 14h20M8 24h14M8 34h20" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><circle cx="34" cy="14" r="4.4" fill="#fff"/><circle cx="28" cy="24" r="4.4" fill="#fff"/><circle cx="34" cy="34" r="4.4" fill="#fff"/><path d="M38.5 14H41M32.5 24H41M38.5 34H41" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/></svg>',
    link: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M21 27a7 7 0 0 0 10 0l6.5-6.5a7 7 0 0 0-10-10L24 14" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><path d="M27 21a7 7 0 0 0-10 0l-6.5 6.5a7 7 0 0 0 10 10L24 34" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/></svg>'
  };

  /* the format cards' choices, kept here until ▶ Play */
  const P = { len: 5, secs: 60, picks: [] };
  function resetPicks() {
    const s = G.setup;
    P.len = RR.roundLen(s.game) || RR.roundLen(RR.device.game) || 5;
    P.secs = s.clockSecs || 60;
    P.picks = G.songPicks().slice();
  }

  /* what the format cards play: the selection, or (a battle chosen) the level this browser was last on */
  const readingKey = () => G.battle ? RR.levelKey(RR.device.level || 1) : RR.Scores.key();
  function bestRound(len) {
    const e = RR.Scores.me().levels[readingKey()];
    const b = e && Array.isArray(e.bests) ? e.bests.filter(x => x.game === 'round' + len) : [];
    return b[0] || null;
  }
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));
  function gameWords(s) {
    const n = RR.roundLen(s.game);
    if (n) return 'a round of ' + n;
    if (s.game === 'song') { const items = G.songItems(); return items.length === 1 ? 'the song ' + items[0].title : plural(items.length, 'song'); }
    if (s.game === 'clock') return 'Beat the clock · ' + (s.clockSecs === 120 ? '2 min' : s.clockSecs + ' s');
    return 'Endless';
  }
  function timeWords(secs) {
    const m = Math.round(secs / 60);
    return secs < 30 ? '0 min' : m < 1 ? 'under a minute' : m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : '');
  }

  /* ---- the top: hello, Play / Carry on, the totals ---- */
  function heroHtml() {
    const who = RR.Players.current(), lesson = G.mode.kind === 'lesson';
    const me = RR.History.me(), streak = RR.History.dayStreak(me.days);
    const over = roundOver();
    let go = '▶ Play', sub = '';
    if (G.battle) {
      const part = G.round.length > 0 && !over;
      go = part ? '▶ Carry on the battle' : '▶ Start the battle';
      sub = '⚔️ ' + esc(G.mode.name) + (part ? ' · round ' + (G.battleNow().round + 1) + ' of ' + G.battle.rounds : '');
    } else {
      const done = G.round.length;
      const going = !over && done > 0;
      if (going) go = '▶ Carry on';
      sub = esc(G.modeLabel()) + ' · ' + esc(gameWords(G.setup)) +
        (going ? ' · <b>' + (isFinite(G.roundN) ? done + ' of ' + G.roundN + ' played' : plural(done, 'melody', 'melodies') + ' so far') + '</b>' : '');
      if (lesson) go = '▶ Play the lesson';
    }
    const bubbles = [];
    if (RR.device.points) bubbles.push('<div class="bub"><b>' + (me.totals.points || 0).toLocaleString() + '</b><span>points</span></div>');
    if (RR.device.stars) bubbles.push('<div class="bub gold"><b>' + RR.STAR_SVG + (me.totals.gold || 0) + '</b><span>gold stars</span></div>');
    bubbles.push('<div class="bub fire"><b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.6 2c.4 3.2 3.9 5 4.9 8.6 1.2 4.3-1.6 9.4-5.6 9.4-3.7 0-6.4-3-5.9-6.8.3-2.3 1.7-3.6 2.6-4.9.2 1.5.9 2.7 2 3.2-.6-3.6.4-6.9 2-9.5z"/></svg>' + streak.current + '</b><span>' + (streak.current === 1 ? 'day' : 'days') + ' in a row</span></div>');
    const players = RR.Players.list();
    return '<section class="h-hero" aria-label="Play">' +
      '<div class="hero-main">' +
        '<h2 class="hello">' + (who ? 'Hi, ' + esc(who) + '!' : 'Ready to read some music?') + '</h2>' +
        '<p class="hero-what"><i class="band-dot" style="--band:' + (G.battle ? MODE_COL.battle : G.modeColour()) + '"></i><span>' + sub + '</span></p>' +
        '<div class="hero-btns"><button type="button" class="big-play" data-h="carry">' + go + '</button>' +
          (lesson ? '<button type="button" class="pill-btn" data-h="leave-lesson">Leave the lesson</button>' : '') + '</div>' +
      '</div>' +
      '<div class="hero-side"><div class="bubs">' + bubbles.join('') + '</div>' +
        (players.length ? '<div class="hero-players"><span class="h-lab">Who’s playing?</span>' + RR.Players.chipsHtml(false) + '</div>' : '') + '</div>' +
      '</section>';
  }

  /* ---- What to read: the ladder and My sessions ---- */
  function whatHtml() {
    const m = G.mode, lvOn = n => !G.battle && m.kind === 'level' && m.n === n;
    const ladder = RR.BANDS.map(b => '<div class="lad-band" style="--bc:' + b.colour + '"><span class="lad-name">' + b.name + '</span><div class="lad-row">' +
      RR.LEVELS.filter(l => l.band === b.id).map(l => {
        const st = RR.Scores.levelStars(RR.levelKey(l.n));
        return '<button type="button" class="lad-lv' + (lvOn(l.n) ? ' on' : '') + '" data-h="level" data-n="' + l.n + '" aria-pressed="' + lvOn(l.n) + '" aria-label="Level ' + l.n + ': ' + esc(l.name) + ', ' + st + ' of 3 stars" title="Level ' + l.n + ' · ' + esc(l.name) + '">' +
          '<b>' + l.n + '</b><span class="lad-st" aria-hidden="true">' + RR.starsHtml(st, 3) + '</span></button>';
      }).join('') + '</div></div>').join('');
    const sessions = RR.Sessions.list().filter(x => x.kind !== 'battle');
    const sesOn = x => !G.battle && m.kind === 'session' && m.id === x.id;
    const set = G.playingSet();
    let now;
    if (G.battle) now = '<b>Pick a level or a session to read</b><span>A battle is chosen — carry it on above, or pick something here for the cards below.</span>';
    else {
      const head = m.kind === 'level' ? 'Level ' + m.n + ' · ' + esc(RR.LEVELS[m.n - 1].name) : esc(G.modeLabel());
      now = '<b>' + head + '</b><span>' + esc(RR.summary(G.setup)) + ' · ' + (G.setup.bars === 2 ? '2 bars' : '1 bar') + '</span>';
    }
    return '<section class="h-sec" aria-labelledby="h-what"><div class="h-head"><h2 id="h-what">What to read</h2>' +
      (m.kind === 'lesson' ? '' : '<button type="button" class="h-link" data-h="customise">✎ Choose the notes and rhythms</button>') + '</div>' +
      '<div class="h-card"><div class="ladder" role="group" aria-label="The levels">' + ladder + '</div>' +
      '<div class="h-ses"><span class="h-lab">My sessions</span>' +
        sessions.map(x => '<button type="button" class="ses-chip' + (sesOn(x) ? ' on' : '') + '" data-h="session" data-id="' + esc(x.id) + '" aria-pressed="' + sesOn(x) + '">♪ ' + esc(x.name) +
          '<span class="lad-st" aria-hidden="true">' + RR.starsHtml(RR.Scores.levelStars('session:' + x.id), 3) + '</span></button>').join('') +
        '<button type="button" class="ses-chip add" data-h="new-session">+ New session</button></div>' +
      '<div class="h-now"><i class="band-dot" style="--band:' + (G.battle ? '#b8a48c' : G.modeColour()) + '"></i><div>' + now +
        (set && !G.battle && m.kind !== 'lesson' ? '<span class="set-chip">♫ Playing your melodies: <b>' + esc(set.title) + '</b><button type="button" data-h="stop-set" aria-label="Stop playing ' + esc(set.title) + '">×</button></span>' : '') +
      '</div></div></div></section>';
  }

  /* ---- How to play: the format cards ---- */
  function card(id, title, about, opt, foot, btn) {
    return '<article class="mode-card" style="--mc:' + MODE_COL[id] + '"><div class="mc-top"><span class="mc-ico' + (id === 'round' ? ' light' : '') + '">' + ICON[id] + '</span><h3>' + title + '</h3></div>' +
      '<p class="mc-about">' + about + '</p>' + (opt ? '<div class="mc-opt">' + opt + '</div>' : '') +
      '<div class="mc-foot">' + (foot ? '<span class="mc-best">' + foot + '</span>' : '<span></span>') + (btn || '') + '</div></article>';
  }
  const playBtn = (fmt, label) => '<button type="button" class="mc-play" data-h="play" data-fmt="' + fmt + '">' + (label || '▶ Play') + '</button>';
  function howHtml() {
    const me = RR.History.me(), R = me.rec || {};
    const b = bestRound(P.len);
    const roundBest = b ? 'Best: ' + (RR.device.points ? '<b>' + b.pts + '</b> points' : RR.device.stars && typeof b.gold === 'number' ? '<b>★ ' + b.gold + '</b>' : '<b>' + plural(b.cards || P.len, 'melody', 'melodies') + '</b>') : '';
    const stepper = '<div class="stepper" role="group" aria-label="How many melodies">' +
      '<button type="button" data-h="len" data-v="-1" aria-label="One melody fewer"' + (P.len <= 1 ? ' disabled' : '') + '>−</button>' +
      '<input type="number" id="h-len" min="1" max="' + RR.ROUND_MAX + '" step="1" inputmode="numeric" value="' + P.len + '" aria-label="How many melodies">' +
      '<button type="button" data-h="len" data-v="1" aria-label="One melody more"' + (P.len >= RR.ROUND_MAX ? ' disabled' : '') + '>+</button></div><span class="mc-unit">' + (P.len === 1 ? 'melody' : 'melodies') + '</span>';
    const titles = P.picks.map(id => id.indexOf('set:') === 0 ? (RR.Sets.get(id.slice(4)) || {}).title : RR.SONGS[id] && RR.SONGS[id].title).filter(Boolean);
    const songs = '<span class="mc-songs">' + (titles.length ? titles.map(t => '<b>' + esc(t) + '</b>').join(', ') : 'No songs picked') + '</span>' +
      '<button type="button" class="h-link" data-h="choose-songs">Choose…</button>';
    const secs = '<div class="seg" role="group" aria-label="How long">' + [[30, '30 s'], [60, '60 s'], [120, '2 min']].map(o =>
      '<button type="button" data-h="secs" data-v="' + o[0] + '" class="' + (P.secs === o[0] ? 'on' : '') + '" aria-pressed="' + (P.secs === o[0]) + '">' + o[1] + '</button>').join('') + '</div>';
    const ck = R.clock && R.clock[P.secs];
    const battles = RR.Sessions.list().filter(x => x.kind === 'battle');
    const part = RR.device.battle && RR.device.battle.id;
    const battleList = battles.length ? '<div class="mc-list">' + battles.map(x => '<button type="button" class="mc-row' + (G.battle && G.mode.id === x.id ? ' on' : '') + '" data-h="battle" data-id="' + esc(x.id) + '">' +
      '<b>' + esc(x.name) + '</b><span class="bt-dots">' + x.battle.teams.map(t => '<i style="--tc:' + t.colour + '" title="' + esc(t.name) + '"></i>').join('') + '</span>' +
      '<small>' + plural(x.battle.teams.length, 'team') + ' · ' + plural(x.battle.rounds, 'round') + (part === x.id ? ' · <em>part-way</em>' : '') + '</small></button>').join('') + '</div>' : '';
    return '<section class="h-sec" aria-labelledby="h-how"><div class="h-head"><h2 id="h-how">How to play</h2></div><div class="mode-grid">' +
      card('round', 'Rounds', 'Read a round of melodies, then see how you did.', stepper, roundBest, playBtn('round')) +
      card('song', 'Songs', 'Play a real song, a little at a time — then hear the whole thing.', songs, '', playBtn('song')) +
      card('clock', 'Beat the Clock', 'How many notes can you read before the time runs out?', secs, ck ? 'Record: <b>' + plural(ck.notes, 'note') + '</b>' : '', playBtn('clock')) +
      card('endless', 'Endless', 'No end and no clock — read as many as you like.', '', R.endless ? 'Longest run: <b>' + plural(R.endless.n, 'melody', 'melodies') + '</b>' : '', playBtn('endless')) +
      card('battle', 'Battle', 'Teams take turns at the xylophone, for points — a class or a family.', battleList, '', '<button type="button" class="mc-play outline" data-h="new-battle">+ New battle</button>') +
      '</div></section>';
  }

  /* ---- Make your own ---- */
  function makeHtml() {
    const sets = RR.Sets.list().filter(x => !x.received), mel = sets.reduce((a, x) => a + x.melodies.length, 0);
    return '<section class="h-sec" aria-labelledby="h-make"><div class="h-head"><h2 id="h-make">Make your own</h2></div><div class="mode-grid make">' +
      card('mel', 'My melodies', 'Write your own melodies on the xylophone, in sets — then play them.', '', sets.length ? plural(sets.length, 'set') + ' · ' + plural(mel, 'melody', 'melodies') : '', '<button type="button" class="mc-play" data-h="melodies">Open</button>') +
      card('ses', 'A new session', 'Choose your own notes, rhythms and helps — new melodies every time.', '', '', '<button type="button" class="mc-play" data-h="new-session">+ New session</button>') +
      card('link', 'A lesson link', 'Send what you’re playing to a class or a family as a link.', '', '', '<button type="button" class="mc-play" data-h="share">Make a link</button>') +
      '</div></section>';
  }

  /* ---- My stats, in brief ---- */
  function statsHtml() {
    const H = RR.History, me = H.me();
    const week = H.series(me.days, '7d'), today = week[week.length - 1], wk = H.total(week);
    const pts = RR.device.points;
    const acc = wk.n ? Math.round(100 * wk.f / wk.n) + '%' : '–';
    const fig = (v, l) => '<div class="fig"><b>' + v + '</b><span>' + l + '</span></div>';
    return '<section class="h-sec" aria-labelledby="h-stats"><div class="h-head"><h2 id="h-stats">My stats</h2><button type="button" class="h-link" data-h="stats">See them all ▸</button></div>' +
      '<div class="h-card h-stats"><div class="hs-chart"><div class="hs-cap">' + (pts ? 'Points' : 'Melodies') + ', the last 7 days</div><div class="chart" id="h-week" role="img" aria-label="' +
        esc(week.map(b => H.parseDay(b.key).toLocaleDateString(undefined, { weekday: 'long' }) + ' ' + (pts ? b.p + ' points' : b.m + ' melodies')).join(', ')) + '"></div></div>' +
      '<div class="hs-figs">' + fig(today.m, 'melodies today') + (pts ? fig(today.p.toLocaleString(), 'points today') : '') + fig(wk.m, 'melodies this week') +
        fig(acc, 'first try this week') + fig(timeWords(wk.s), 'playing this week') + '</div>' +
      '</div></section>';
  }
  function fillCharts() {
    const host = $('#h-week'); if (!host) return;
    const H = RR.History, me = H.me(), pts = RR.device.points;
    const week = H.series(me.days, '7d');
    host.innerHTML = RR.Charts.bars(Math.max(160, host.clientWidth), week.map((b, i) => {
      const d = H.parseDay(b.key);
      return { v: pts ? b.p : b.m, x: i === week.length - 1 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short' }),
        tv: pts ? b.p.toLocaleString() + ' points' : plural(b.m, 'melody', 'melodies'), tl: d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }) + (pts ? ' · ' + plural(b.m, 'melody', 'melodies') : '') };
    }), { h: 120, mini: true, labelEvery: 1 });
  }

  function render() {
    const el = $('#home'); if (!el || View.current !== 'home') return;
    const y = el.scrollTop, lesson = G.mode.kind === 'lesson';
    el.innerHTML = '<div class="h-wrap">' + heroHtml() + (lesson ? '' : whatHtml() + howHtml() + makeHtml()) + statsHtml() + '</div>';
    el.scrollTop = y;
    fillCharts();
  }
  new ResizeObserver(() => { if (View.current === 'home') fillCharts(); }).observe($('#home'));

  /* ---- the song chooser (Songs ▸ Choose…) ---- */
  let songsEl = null;
  const songsOpen = () => !!(songsEl && !songsEl.hidden);
  function songsHtml() {
    const at = id => P.picks.indexOf(id);
    const btn = (id, title) => '<button type="button" data-pick="' + esc(id) + '" class="' + (at(id) >= 0 ? 'on' : '') + '" aria-pressed="' + (at(id) >= 0) + '">' +
      (at(id) >= 0 ? '<b class="ord">' + (at(id) + 1) + '</b>' : '') + esc(title) + '</button>';
    const sets = RR.Sets.list().filter(x => x.melodies.length);
    return '<div class="sheet songs-sheet" role="dialog" aria-modal="true" aria-labelledby="songs-title"><header class="sheet-head"><h2 id="songs-title">Choose the songs</h2>' +
      '<button class="icon-btn close" data-songs="close" type="button" aria-label="Close">×</button></header><div class="songs-body">' +
      '<p class="note">Tap the songs to play, in the order you want them.</p>' +
      '<div class="picks-head">The Songbook</div><div class="picks song-picks">' + Object.keys(RR.SONGS).map(id => btn(id, RR.SONGS[id].title)).join('') + '</div>' +
      (sets.length ? '<div class="picks-head">My melodies</div><div class="picks song-picks">' + sets.map(x => btn('set:' + x.id, x.title)).join('') + '</div>' : '') +
      '</div><footer class="sheet-foot"><button type="button" class="pill-btn" data-songs="close">Done</button><button type="button" class="pill-btn go" data-songs="play"' + (P.picks.length ? '' : ' disabled') + '>▶ Play ' + (P.picks.length === 1 ? 'it' : 'them') + '</button></footer></div>';
  }
  function openSongs() {
    if (!songsEl) {
      songsEl = document.createElement('div');
      songsEl.className = 'modal songs-modal'; songsEl.hidden = true;
      document.body.appendChild(songsEl);
      songsEl.addEventListener('click', e => {
        if (e.target === songsEl) { closeSongs(); return; }
        const p = e.target.closest('[data-pick]');
        if (p) {
          const id = p.dataset.pick, i = P.picks.indexOf(id);
          if (i >= 0) P.picks.splice(i, 1); else P.picks.push(id);
          const y = songsEl.querySelector('.songs-body').scrollTop;
          songsEl.innerHTML = songsHtml(); songsEl.querySelector('.songs-body').scrollTop = y;
          const again = songsEl.querySelector('[data-pick="' + CSS.escape(id) + '"]'); if (again) again.focus();
          return;
        }
        const a = e.target.closest('[data-songs]'); if (!a) return;
        closeSongs();
        if (a.dataset.songs === 'play') start('song');
        else render();
      });
      songsEl.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); closeSongs(); render(); } });
    }
    songsEl.innerHTML = songsHtml();
    RR.windowOpened(songsEl);
    songsEl.hidden = false;
    const f = songsEl.querySelector('[data-pick]'); if (f) f.focus();
  }
  function closeSongs() { if (!songsOpen()) return; songsEl.hidden = true; RR.windowClosed(songsEl); }
  View.songsOpen = songsOpen;

  /* ---- starting things ---- */
  /* a format card's ▶ Play: the choices saved, a new round, the music */
  function start(fmt) {
    if (G.mode.kind === 'lesson') { go('play'); return; }
    if (G.battle) G.selectLevel(RR.device.level || 1);
    if (fmt === 'round') RR.Settings.setFormat({ len: P.len });
    else if (fmt === 'song') { if (!P.picks.length) { openSongs(); return; } RR.Settings.setFormat({ game: 'song', songPicks: P.picks }); }
    else if (fmt === 'clock') RR.Settings.setFormat({ game: 'clock', clockSecs: P.secs });
    else RR.Settings.setFormat({ game: 'endless' });
    G.queue = []; G.fresh = true; G.newRound();
    go('play');
  }
  /* a name not yet used: "My session 2", "Battle 3" */
  function freshName(base) {
    const names = RR.Sessions.list().map(x => x.name.toLowerCase());
    for (let i = 1; ; i++) { const n = base + ' ' + i; if (!names.includes(n.toLowerCase())) return n; }
  }
  const readingPractice = () => G.battle ? RR.practiceOfLevel(RR.device.level || 1) : G.setup;
  function newSession() {
    const rec = RR.Sessions.add(freshName('My session'), readingPractice());
    G.selectSession(rec.id);
    RR.Settings.open('session');
    const f = $('#session-name'); if (f) { f.focus(); f.select(); }
    RR.toast('Name it, then choose its notes, rhythms and helps');
  }
  function newBattle() {
    const p = RR.clone(readingPractice()); p.practice = false;     // a battle is for points: straight to the Test
    const rec = RR.Sessions.add(freshName('Battle'), p, { teams: [], per: 1, rounds: 3 });
    G.selectSession(rec.id);
    RR.Settings.open('session');
    const f = $('#session-name'); if (f) { f.focus(); f.select(); }
    RR.toast('Name the battle and the teams, then ▶ Play Battle');
  }

  const home = $('#home');
  home.addEventListener('click', e => {
    if (RR.foldClick(e)) return;
    const pl = e.target.closest('[data-player]');
    if (pl) { RR.Players.use(pl.dataset.player); render(); return; }
    const b = e.target.closest('[data-h]'); if (!b) return;
    const a = b.dataset.h;
    if (a === 'carry') go('play');
    else if (a === 'level') { G.selectLevel(+b.dataset.n); resetPicks(); render(); }
    else if (a === 'session') { G.selectSession(b.dataset.id); resetPicks(); render(); }
    else if (a === 'new-session') newSession();
    else if (a === 'customise') {
      if (G.battle) G.selectLevel(RR.device.level || 1);
      RR.Settings.open(G.mode.kind === 'session' ? 'session' : 'notes');
    }
    else if (a === 'stop-set') { RR.Melodies.stop(); render(); }
    else if (a === 'len') { P.len = Math.max(1, Math.min(RR.ROUND_MAX, P.len + (+b.dataset.v || 0))); render(); const f = home.querySelector('[data-h="len"][data-v="' + b.dataset.v + '"]'); if (f && !f.disabled) f.focus(); }
    else if (a === 'secs') { P.secs = +b.dataset.v; render(); const f = home.querySelector('[data-h="secs"][data-v="' + b.dataset.v + '"]'); if (f) f.focus(); }
    else if (a === 'choose-songs') openSongs();
    else if (a === 'play') start(b.dataset.fmt);
    else if (a === 'battle') { if (G.selectSession(b.dataset.id)) go('play'); }
    else if (a === 'new-battle') newBattle();
    else if (a === 'melodies') RR.Melodies.open();
    else if (a === 'share') { if (G.battle) G.selectLevel(RR.device.level || 1); RR.Settings.open('share'); }
    else if (a === 'stats') go('stats');
    else if (a === 'leave-lesson') { RR.Lesson.leave(); resetPicks(); render(); }
  });
  home.addEventListener('change', e => {
    if (e.target.id !== 'h-len') return;
    const n = parseInt(e.target.value, 10);
    P.len = Math.max(1, Math.min(RR.ROUND_MAX, isFinite(n) ? n : P.len));
    render();
  });
  home.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'h-len') { e.preventDefault(); e.target.blur(); } });

  /* the windows change what the home page shows: draw it again when one closes */
  ['#settings', '#melodies', '#board'].forEach(sel => new MutationObserver(() => {
    if (View.current === 'home' && $(sel).hidden) { resetPicks(); render(); }
  }).observe($(sel), { attributes: true, attributeFilter: ['hidden'] }));

  View.render = render;
  RR.Home = { render, start };
})();

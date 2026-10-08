/* ==========================================================================
   Melody Reader — home.js
   --------------------------------------------------------------------------
   The home page (2026-10-07, the user's ask: "a neutral page", not always
   mid-game) and the three views the app moves between:

     home    where the app opens. Carry on (or Play) what was playing ·
             How to play: Rounds, Songs, Beat the Clock, Endless, Battle ·
             Make your own: My melodies, a new session, a lesson link · My
             stats, in brief
     play    the music and the xylophone (as before)
     stats   My stats (stats.js)

   RR.View.go(v) moves, keeping the browser's Back button in step (one
   history entry above home, so Back from the music or My stats comes
   home and Back from home leaves the app). Leaving the music pauses it
   (G.leave): a count-in stops, a Beat the clock under way is over. A
   lesson link opens straight on the music.

   How to play comes straight after the top since 2026-10-08 (What to read
   — the ladder and the session chips — is gone; the levels are in the
   windows below, the sessions in Settings → Level). A card's ▶ Play opens
   a window and nothing starts until the window's own ▶ Play (the user:
   "ask first"): Songs — the songs, in order; Rounds, Beat the Clock and
   Endless — Generate · Leveled Challenges · My Melodies (pickBody). A
   level is played that way just this time (G.over); Generated and a set
   are played as themselves. A battle is chosen from its card, as before.
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
    if (RR.Drop && RR.Drop.isOpen()) RR.Drop.close();
    if (songsOpen()) closeSongs();
    if (pickOpen()) closePick();
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
    P.len = RR.roundLen(s.game) || 5;
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
    const songs = '<span class="mc-songs">' + (titles.length ? titles.map(t => '<b>' + esc(t) + '</b>').join(', ') : 'Pick the songs when you press Play') + '</span>';
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
    el.innerHTML = '<div class="h-wrap">' + heroHtml() + (lesson ? '' : howHtml() + makeHtml()) + statsHtml() + '</div>';
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
  View.songsOpen = () => songsOpen() || pickOpen();

  /* ---- the Rounds, Beat the Clock and Endless windows (2026-10-08, the user's design) ----
     A card's ▶ Play opens its window — it never starts what happens to be loaded (the user: "ask
     first"). The window asks what to read:
       Generate             the notes and the rhythms (Settings' own two sections, on a practice of
                            the window's — RR.device.gen, the last one played, so it starts there)
       Leveled Challenges   which of the fifteen levels (your own version of it, if you changed it)
       My Melodies          which of your sets, with + Write a new set
     with the round's length or the clock's (kept in step with the card), and its own ▶ Play. A level
     is played that way just this time (its own format stays as its page says); Generated and a set
     are played as themselves (Custom, named "Generated" / "♫ Week 3", with their own scores). */
  const W = { fmt: 'round', src: 'level', level: 1, set: null, gen: null };
  const FMT_TITLE = { round: 'Rounds', clock: 'Beat the Clock', endless: 'Endless' };
  const SOURCES = [
    ['gen', 'Generate', 'Choose the notes and rhythms — new melodies every time'],
    ['level', 'Leveled Challenges', 'The fifteen levels, a step at a time'],
    ['mel', 'My Melodies', 'Melodies you wrote, in sets']
  ];
  let pickEl = null, reopen = null;
  const pickOpen = () => !!(pickEl && !pickEl.hidden);
  /* the practice Generate starts from: the last one played (or the usual one) — made-up melodies */
  function genBase() {
    const g = RR.device.gen;
    const p = RR.sanitize(g && typeof g === 'object' ? g : Object.assign(RR.clone(RR.DEFAULTS), { from: 'made' }));
    p.from = 'made'; p.set = null; p.tricky = false;
    return p;
  }
  const playableSets = () => RR.Sets.list().filter(x => x.melodies.length);
  function pickBody() {
    let opt = '';
    if (W.fmt === 'round') opt = '<div class="row count-row"><span class="lbl">How many melodies</span><div class="stepper" role="group" aria-label="How many melodies">' +
      '<button type="button" data-w="len" data-v="-1" aria-label="One melody fewer"' + (P.len <= 1 ? ' disabled' : '') + '>−</button>' +
      '<input type="number" id="w-len" min="1" max="' + RR.ROUND_MAX + '" step="1" inputmode="numeric" value="' + P.len + '" aria-label="How many melodies">' +
      '<button type="button" data-w="len" data-v="1" aria-label="One melody more"' + (P.len >= RR.ROUND_MAX ? ' disabled' : '') + '>+</button></div></div>';
    else if (W.fmt === 'clock') opt = '<div class="row"><span class="lbl">How long</span><div class="seg" role="group" aria-label="How long">' + [[30, '30 s'], [60, '60 s'], [120, '2 min']].map(o =>
      '<button type="button" data-w="secs" data-v="' + o[0] + '" class="' + (P.secs === o[0] ? 'on' : '') + '" aria-pressed="' + (P.secs === o[0]) + '">' + o[1] + '</button>').join('') + '</div></div>';
    const tabs = '<div class="src-tabs" role="radiogroup" aria-label="What to read">' + SOURCES.map(x =>
      '<button type="button" role="radio" data-w="src" data-v="' + x[0] + '" class="' + (W.src === x[0] ? 'on' : '') + '" aria-checked="' + (W.src === x[0]) + '">' +
      '<b>' + x[1] + '</b><small>' + x[2] + '</small></button>').join('') + '</div>';
    let pane = '';
    if (W.src === 'gen') pane = RR.Settings.draftHtml(W.gen);
    else if (W.src === 'level') {
      const ladder = RR.BANDS.map(b => '<div class="lad-band" style="--bc:' + b.colour + '"><span class="lad-name">' + b.name + '</span><div class="lad-row">' +
        RR.LEVELS.filter(l => l.band === b.id).map(l => {
          const st = RR.Scores.levelStars(RR.levelKey(l.n)), ed = RR.LevelEdits.edited(l.n), on = W.level === l.n;
          return '<button type="button" class="lad-lv' + (on ? ' on' : '') + (ed ? ' edited' : '') + '" data-w="level" data-n="' + l.n + '" aria-pressed="' + on + '" aria-label="Level ' + l.n + ': ' + esc(l.name) + (ed ? ' (your own)' : '') + ', ' + st + ' of 3 stars" title="Level ' + l.n + ' · ' + esc(l.name) + '">' +
            '<b>' + l.n + (ed ? '<i class="lad-ed" aria-hidden="true">✎</i>' : '') + '</b><span class="lad-st" aria-hidden="true">' + RR.starsHtml(st, 3) + '</span></button>';
        }).join('') + '</div></div>').join('');
      const l = RR.LEVELS[W.level - 1], lp = RR.practiceOfLevel(W.level), ed = RR.LevelEdits.edited(W.level);
      pane = '<div class="ladder" role="group" aria-label="The levels">' + ladder + '</div>' +
        '<div class="h-now"><i class="band-dot" style="--band:' + RR.bandOf(W.level).colour + '"></i><div><b>Level ' + l.n + ' · ' + esc(l.name) + (ed ? ' <span class="ses-tag ed-tag">Yours</span>' : '') + '</b>' +
        '<span>' + esc(RR.summary(lp)) + ' · ' + (lp.bars === 2 ? '2 bars' : '1 bar') + '</span>' +
        '<button type="button" class="h-link" data-w="edit-level">✎ Change Level ' + l.n + '</button></div></div>';
    } else {
      const sets = playableSets();
      pane = sets.length ? '<div class="mc-list w-sets">' + sets.map(x => '<button type="button" class="mc-row' + (W.set === x.id ? ' on' : '') + '" data-w="set" data-id="' + esc(x.id) + '" aria-pressed="' + (W.set === x.id) + '">' +
          '<b>♫ ' + esc(x.title) + '</b><span class="mc-n">' + plural(x.melodies.length, 'melody', 'melodies') + '</span>' + (x.received ? '<small>' + (RR.Sets.isShelf(x) ? 'Teacher Library · ' + esc(x.book) : 'Shared with you') + '</small>' : '') + '</button>').join('') + '</div>'
        : '<p class="note">You haven’t written any melodies yet. Write a set of them on the xylophone, then play them here.</p>';
      pane += '<div class="row w-mel-btns"><button type="button" class="pill-btn primary" data-w="new-set">+ Write a new set</button>' +
        (sets.length ? '<button type="button" class="pill-btn" data-w="melodies">Open My Melodies…</button>' : '') + '</div>';
    }
    const can = W.src !== 'mel' || !!RR.Sets.get(W.set);
    return '<div class="sheet pick-sheet" role="dialog" aria-modal="true" aria-labelledby="pick-title" style="--mc:' + MODE_COL[W.fmt] + '">' +
      '<header class="sheet-head"><span class="mc-ico' + (W.fmt === 'round' ? ' light' : '') + '">' + ICON[W.fmt] + '</span><h2 id="pick-title">' + FMT_TITLE[W.fmt] + '</h2>' +
      '<button class="icon-btn close" data-w="close" type="button" aria-label="Close">×</button></header>' +
      '<div class="pick-body">' + opt + '<h3 class="w-q">What do you want to read?</h3>' + tabs + '<div class="src-pane">' + pane + '</div></div>' +
      '<footer class="sheet-foot"><button type="button" class="pill-btn" data-w="close">Cancel</button>' +
      '<button type="button" class="pill-btn go" data-w="play"' + (can ? '' : ' disabled') + '>▶ Play</button></footer></div>';
  }
  function drawPick(focusSel) {
    const body = pickEl.querySelector('.pick-body'), y = body ? body.scrollTop : 0;
    pickEl.innerHTML = pickBody();
    pickEl.querySelector('.pick-body').scrollTop = y;
    const f = focusSel && pickEl.querySelector(focusSel); if (f) f.focus();
  }
  function openPick(fmt) {
    if (G.mode.kind === 'lesson') { go('play'); return; }
    if (!pickEl) {
      pickEl = document.createElement('div');
      pickEl.className = 'modal pick-modal'; pickEl.hidden = true;
      document.body.appendChild(pickEl);
      pickEl.addEventListener('click', onPickClick);
      pickEl.addEventListener('change', e => {
        if (e.target.id !== 'w-len') return;
        const n = parseInt(e.target.value, 10);
        P.len = Math.max(1, Math.min(RR.ROUND_MAX, isFinite(n) ? n : P.len)); drawPick();
      });
      pickEl.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.stopPropagation(); closePick(); render(); }
        if (e.key === 'Enter' && e.target.id === 'w-len') { e.preventDefault(); e.target.blur(); }
      });
    }
    // where it starts: what was picked here last (still asked — nothing starts until ▶ Play)
    const last = RR.device.homePick && typeof RR.device.homePick === 'object' ? RR.device.homePick : {};
    const m = G.mode;
    W.fmt = fmt;
    W.src = ['gen', 'level', 'mel'].includes(last.src) ? last.src : m.kind === 'custom' && m.gen ? 'gen' : 'level';
    W.level = m.kind === 'level' ? m.n : Math.max(1, Math.min(RR.LEVELS.length, RR.device.level | 0 || 1));
    const sets = playableSets();
    W.set = sets.some(x => x.id === last.set) ? last.set : sets.length ? sets[0].id : null;
    W.gen = genBase();
    pickEl.innerHTML = pickBody();
    RR.windowOpened(pickEl);
    pickEl.hidden = false;
    const f = pickEl.querySelector('.src-tabs .on'); if (f) f.focus();
  }
  function closePick() { if (!pickOpen()) return; pickEl.hidden = true; RR.windowClosed(pickEl); }
  function onPickClick(e) {
    if (e.target === pickEl) { closePick(); render(); return; }
    // Generate: the notes and rhythm sections are Settings' own
    if (W.src === 'gen' && e.target.closest('.src-pane')) { if (RR.Settings.draftClick(e.target, W.gen)) drawPick(); return; }
    const b = e.target.closest('[data-w]'); if (!b) return;
    const a = b.dataset.w;
    if (a === 'close') { closePick(); render(); }
    else if (a === 'src') { W.src = b.dataset.v; drawPick('.src-tabs .on'); }
    else if (a === 'len') { P.len = Math.max(1, Math.min(RR.ROUND_MAX, P.len + (+b.dataset.v || 0))); drawPick('[data-w="len"][data-v="' + b.dataset.v + '"]:not([disabled])'); }
    else if (a === 'secs') { P.secs = +b.dataset.v; drawPick('[data-w="secs"].on'); }
    else if (a === 'level') { W.level = +b.dataset.n; drawPick('[data-w="level"].on'); }
    else if (a === 'set') { W.set = b.dataset.id; drawPick('[data-w="set"].on'); }
    else if (a === 'edit-level') {
      // its page, then back here: changing a level picks it
      reopen = { fmt: W.fmt, src: 'level' };
      closePick(); G.selectLevel(W.level); RR.Settings.open('session');
    }
    else if (a === 'new-set' || a === 'melodies') {
      reopen = { fmt: W.fmt, src: 'mel' };
      closePick(); RR.Melodies.open();
      if (a === 'new-set') { const nb = document.querySelector('#melodies [data-act="new"]'); if (nb) nb.click(); }
    }
    else if (a === 'play') playPick();
  }
  function playPick() {
    const g = W.fmt === 'round' ? { game: 'round' + P.len } : W.fmt === 'clock' ? { game: 'clock', clockSecs: P.secs } : { game: 'endless' };
    if (W.src === 'level') G.selectLevel(W.level, { game: g });
    else if (W.src === 'gen') {
      RR.device.gen = RR.clone(W.gen);
      G.usePractice(Object.assign(RR.clone(W.gen), g), { kind: 'custom', label: 'Generated', gen: true });
    } else {
      const set = RR.Sets.get(W.set); if (!set) return;
      G.usePractice(Object.assign(genBase(), { from: 'set', set: set.id }, g), { kind: 'custom', label: '♫ ' + set.title });
    }
    RR.device.homePick = { src: W.src, set: W.set }; RR.saveDevice();
    closePick();
    go('play');
  }
  /* back from a level's page or My melodies to the window that sent them there */
  function reopenPick() {
    const r = reopen; reopen = null;
    if (!r || View.current !== 'home') return;
    const keep = { level: W.level, set: W.set, gen: W.gen };
    openPick(r.fmt);
    W.src = r.src; W.gen = keep.gen;
    if (r.src === 'level') W.level = G.mode.kind === 'level' ? G.mode.n : keep.level;
    const sets = playableSets();
    if (r.src === 'mel') W.set = sets.some(x => x.id === keep.set) ? keep.set : sets.length ? sets[0].id : null;
    drawPick('.src-tabs .on');
  }

  /* ---- starting things ---- */
  /* the Songs window's ▶ Play: the songs picked, played with what is chosen (just this time) */
  function start(fmt) {
    if (G.mode.kind === 'lesson') { go('play'); return; }
    if (fmt === 'song' && !P.picks.length) { openSongs(); return; }
    if (G.battle) G.selectLevel(RR.device.level || 1);
    G.playOnce('game', { game: 'song', songPicks: P.picks.slice() });
    go('play');
  }
  /* a name not yet used: "My session 2", "Battle 3" */
  function freshName(base) {
    const names = RR.Sessions.list().map(x => x.name.toLowerCase());
    for (let i = 1; ; i++) { const n = base + ' ' + i; if (!names.includes(n.toLowerCase())) return n; }
  }
  function newSession() {
    const rec = RR.Sessions.add(freshName('My session'), G.readingPractice());
    G.selectSession(rec.id);
    RR.Settings.open('session');
    const f = $('#session-name'); if (f) { f.focus(); f.select(); }
    RR.toast('Name it, then choose its notes, rhythms and helps');
  }
  function newBattle() {
    const p = G.readingPractice(); p.practice = false;     // a battle is for points: straight to the Test
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
    else if (a === 'new-session') newSession();
    else if (a === 'len') { P.len = Math.max(1, Math.min(RR.ROUND_MAX, P.len + (+b.dataset.v || 0))); render(); const f = home.querySelector('[data-h="len"][data-v="' + b.dataset.v + '"]'); if (f && !f.disabled) f.focus(); }
    else if (a === 'secs') { P.secs = +b.dataset.v; render(); const f = home.querySelector('[data-h="secs"][data-v="' + b.dataset.v + '"]'); if (f) f.focus(); }
    else if (a === 'play') { if (b.dataset.fmt === 'song') openSongs(); else openPick(b.dataset.fmt); }   // a window first: nothing starts until its ▶ Play
    else if (a === 'battle') { if (G.selectSession(b.dataset.id)) go('play'); }
    else if (a === 'new-battle') newBattle();
    else if (a === 'melodies') RR.Melodies.open();
    else if (a === 'share') RR.Settings.open('share');      // a battle's link carries its teams too (2026-10-08)
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
    if (!$(sel).hidden) return;
    if (View.current === 'home') { resetPicks(); render(); }
    if (sel !== '#board') reopenPick();           // back to the Play window that sent them (not if they went on to the music)
  }).observe($(sel), { attributes: true, attributeFilter: ['hidden'] }));

  View.render = render;
  RR.Home = { render, start };
})();

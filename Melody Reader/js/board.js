/* ==========================================================================
   Melody Reader — board.js
   --------------------------------------------------------------------------
   RR.Board — the Score board window (the score chip opens it), and the
   cards over the music at the end of a round:

     Round done   the round's stars and points (each melody 1–20), best
                  streak, the tricky note, Play again · Settings ·
                  Level n+1 ▸ (four in five ★★ or better — every note
                  first time; the count-in is for points, not the climb)
                  — for a Song: "You played all of …" and Hear your song
     Time's up    Beat the clock's notes, melodies and clean melodies

   A finished round is saved as a best for this player, practice and game,
   and the level's stars (the best round's average) go on the ladder.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game, BAR = RR.BAR;

  function today() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function when(iso) {
    if (iso === today()) return 'Today';
    const d = new Date(iso + 'T12:00:00');
    return isNaN(d) ? '' : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }
  function trickyOf(st) {
    let worst = null, wr = 1;
    Object.keys(st).forEach(id => { const x = st[id]; if (BAR[id] && x && x.n >= 2 && x.first / x.n < wr) { wr = x.first / x.n; worst = id; } });
    return wr < 0.8 ? worst : null;
  }
  function saveBest(pts, stars, cards) {
    const key = RR.Scores.key(), e = RR.Scores.entry(key);
    const best = { pts, stars, cards, date: today(), game: G.setup.game };
    e.bests.push(best);
    e.bests.sort((a, b) => b.pts - a.pts || b.stars - a.stars);
    const mine = e.bests.filter(b => b.game === best.game);
    e.bests = e.bests.filter(b => b.game !== best.game).concat(mine.slice(0, 10));
    // the ladder's stars come from rounds (a Song or the clock is its own thing)
    if (cards && (best.game === 'round5' || best.game === 'round10')) e.stars = Math.max(e.stars, Math.round(stars / cards));
    RR.Scores.save();
    return mine.slice(0, 5).indexOf(best);
  }

  function show(html) {
    const el = $('#rounddone');
    el.innerHTML = html;
    el.hidden = false;
    G.overlay = true;
    const b = el.querySelector('.pill-btn'); if (b) b.focus();
  }
  function hideRound() { G.stopSong(); $('#rounddone').hidden = true; G.overlay = false; }

  function roundDone() {
    G.stopHear(true); RR.Beat.stop();
    const r = G.round, s = G.setup;
    const total = r.reduce((a, c) => a + c.pts, 0), stars = r.reduce((a, c) => a + c.stars, 0);
    const twos = r.filter(c => c.stars >= 2).length;
    const rank = saveBest(total, stars, r.length);
    const tricky = trickyOf(G.rstats);
    const isLevel = G.mode.kind === 'level';
    const ready = isLevel && !G.playingSet() && r.length && twos >= Math.ceil(r.length * 0.8) && G.mode.n < RR.LEVELS.length;
    const set = G.playingSet();
    const song = s.game === 'song' ? (s.song || s.songs[0] || 'hot-cross-buns') : null;
    const whole = s.game === 'song' ? (set ? set.title : RR.SONGS[song].title) : null;
    show('<div class="rd-card"><h3>' + (whole ? 'You played all of ' + RR.esc(whole) + '!' : 'Round done!') + '</h3>' +
      '<div class="rd-sub">' + RR.esc(G.modeLabel()) + (rank === 0 && RR.device.points ? ' · <b class="new-best">a new best!</b>' : '') + '</div>' +
      (RR.device.stars ? '<div class="rd-rows">' + r.map(c => '<div class="rd-c"><b>' + RR.esc(c.label) + '</b><span>' + RR.starsHtml(c.stars, 3) + '</span>' + (RR.device.points ? '<i>' + c.pts + '</i>' : '') + '</div>').join('') + '</div>' : '') +
      '<div class="rd-stats">' + (RR.device.points ? '<div><b>' + total + '</b>points</div>' : '') + (RR.device.stars ? '<div><b>' + stars + '</b>stars</div>' : '') +
      '<div><b>' + G.bestStreak + '</b>best streak</div></div>' +
      (tricky ? '<div class="rd-tricky">Your tricky note: <b class="lpill" style="--c:' + BAR[tricky].colour + '">' + tricky[0] + '</b> — it shows on the Score board</div>' : '<div class="rd-tricky">No tricky notes this round.</div>') +
      (ready ? '<div class="rd-ready">Ready for the next level!</div>' : '') +
      '<div class="rd-btns">' + (whole ? '<button type="button" class="pill-btn go" data-rd="song" data-label="' + (set ? '▶ Hear the whole set' : '▶ Hear your song') + '">' + (set ? '▶ Hear the whole set' : '▶ Hear your song') + '</button>' : '') +
      '<button type="button" class="pill-btn" data-rd="again">Play again</button>' +
      (G.mode.kind === 'lesson' ? '' : '<button type="button" class="pill-btn" data-rd="settings">Settings</button>') +
      (ready ? '<button type="button" class="pill-btn go" data-rd="next">Level ' + (G.mode.n + 1) + ' ▸</button>' : '') + '</div></div>');
    G.announce((whole ? 'You played all of ' + whole + '. ' : 'Round done. ') + (RR.device.stars ? stars + ' stars. ' : '') + (RR.device.points ? total + ' points. ' : '') + (ready ? 'Ready for the next level.' : ''));
  }
  function timeUp() {
    const c = G.clock;
    const pts = c.pts;
    const rank = saveBest(RR.device.points ? pts : c.notes, 0, 0);
    show('<div class="rd-card"><h3>Time’s up!</h3><div class="rd-sub">Beat the clock · ' + c.secs + ' s · ' + RR.esc(G.modeLabel()) + (rank === 0 ? ' · <b class="new-best">a new best!</b>' : '') + '</div>' +
      '<div class="rd-stats"><div><b>' + c.notes + '</b>notes</div><div><b>' + c.melodies + '</b>melodies</div><div><b>' + c.clean + '</b>clean</div>' +
      (RR.device.points ? '<div><b>' + pts + '</b>points</div>' : '') + '</div>' +
      '<div class="rd-btns"><button type="button" class="pill-btn go" data-rd="again">Go again</button>' +
      (G.mode.kind === 'lesson' ? '' : '<button type="button" class="pill-btn" data-rd="settings">Settings</button>') + '</div></div>');
    G.announce('Time’s up. ' + c.notes + ' notes, ' + c.melodies + ' melodies, ' + c.clean + ' clean.');
  }

  $('#rounddone').addEventListener('click', e => {
    const b = e.target.closest('[data-rd]'); if (!b) return;
    const a = b.dataset.rd;
    if (a === 'song') {
      if (G.songPlaying) { G.stopSong(); b.textContent = b.dataset.label; return; }
      const s = G.setup;
      b.textContent = '■ Stop';
      G.hearSong(s.song || s.songs[0] || 'hot-cross-buns', () => { b.textContent = b.dataset.label; });
      return;
    }
    if (a === 'again') G.newRound();
    else if (a === 'next') G.selectLevel(G.mode.n + 1);
    else if (a === 'settings') { G.newRound(); RR.Settings.open('level'); }
  });

  /* ---- the Score board window ---- */
  function html() {
    const r = G.round, me = RR.Scores.me();
    const rstars = r.reduce((a, c) => a + c.stars, 0), clean = r.filter(c => c.stars >= 2).length;
    const e = me.levels[RR.Scores.key()];
    const bests = e && Array.isArray(e.bests) ? e.bests.filter(b => b.game === G.setup.game).slice(0, 5) : [];
    const mix = Object.keys(me.mix).filter(k => k.includes('>')).map(k => [k, me.mix[k] | 0]).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const tot = me.totals;
    const acc = tot.notes ? Math.round(100 * tot.first / tot.notes) : 0;
    const pill = id => BAR[id] ? '<b class="lpill" style="--c:' + BAR[id].colour + '">' + id[0] + '</b>' : '';
    const used = RR.BARS.slice(0, RR.Xylo.count());
    const players = RR.Players.list().length ? '<div class="panel wide"><h3>Who’s playing?</h3>' + RR.Players.chipsHtml(false) + '</div>' : '';
    return players + '<div class="panel wide"><h3>' + (G.clock ? 'This game' : 'This round') + (RR.Players.current() ? ' · ' + RR.esc(RR.Players.current()) : '') + '</h3><div class="tiles">' +
      (RR.device.points ? '<div class="tile"><b>' + G.points + '</b><span>points</span></div>' : '') +
      (RR.device.stars ? '<div class="tile"><b class="t-star">★ ' + rstars + '</b><span>stars</span></div>' : '') +
      '<div class="tile"><b>' + clean + '</b><span>clean melodies</span></div><div class="tile"><b>🔥 ' + G.bestStreak + '</b><span>best streak</span></div></div>' +
      (RR.device.stars ? '<div class="cards-row">' + (r.length ? r.map(c => '<div class="rc">' + RR.esc(c.label) + '<span>' + RR.starsHtml(c.stars, 3) + '</span></div>').join('') : '<span class="note">No melodies yet this round.</span>') + '</div>' : '') + '</div>' +
      '<div class="panel"><h3>Best scores · ' + RR.esc(G.modeLabel()) + '</h3>' +
      (bests.length ? '<ul class="best">' + bests.map((b, i) => '<li class="' + (b.date === today() && i === 0 ? 'new' : '') + '"><span>' + (i + 1) + '</span><b>' + b.pts + '</b><span class="st">' + (b.cards ? '★ ' + b.stars : '') + '</span><span class="when">' + when(b.date) + '</span></li>').join('') + '</ul>'
        : '<p class="note">Finish a round to set a best score.</p>') + '</div>' +
      '<div class="panel"><h3>Tricky notes</h3>' + RR.note('tk', 'A full bar is a note you read first time; a short one is a note you slip on.') +
      '<div class="tricky-xylo">' + used.map(b => {
        const st = me.stats[b.id]; const pc = st && st.n ? Math.round(100 * (st.first | 0) / st.n) : null;
        return '<div class="tb' + (pc === null ? ' none' : '') + '" style="--c:' + b.colour + '" title="' + b.id + (pc === null ? ' — not played yet' : ' — ' + pc + '% first time') + '"><em>' + (pc === null ? '' : pc + '%') + '</em><i style="height:' + (pc === null ? 8 : Math.max(8, pc * 0.7)) + '%"></i><span>' + b.letter + '</span></div>';
      }).join('') + '</div>' +
      (mix.length ? '<ul class="mixups">' + mix.map(m => { const [a, b] = m[0].split('>'); return '<li>You played ' + pill(b) + ' for ' + pill(a) + ' ' + m[1] + (m[1] === 1 ? ' time' : ' times') + '</li>'; }).join('') + '</ul>' : '') +
      (G.mode.kind === 'lesson' ? '' : '<button type="button" class="pill-btn' + (G.setup.tricky ? ' go' : ' primary') + '" data-board="tricky">' + (G.setup.tricky ? '✓ Practising these' : 'Practise these') + '</button>') + '</div>' +
      '<div class="panel wide"><h3>Totals</h3><div class="tiles"><div class="tile"><b>' + (tot.melodies | 0) + '</b><span>melodies read</span></div><div class="tile"><b>' + (tot.notes | 0) + '</b><span>notes read</span></div>' +
      '<div class="tile"><b>' + acc + '%</b><span>first try</span></div><div class="tile tile-btn"><button type="button" class="pill-btn" data-board="reset">Reset scores…</button></div></div></div>';
  }
  function open() {
    G.pause();
    $('#board-level').textContent = G.modeLabel();
    $('#board-body').innerHTML = html();
    RR.windowOpened($('#board'));
    $('#board').hidden = false;
    const b = $('#board .close'); if (b) b.focus();
  }
  function close() { if ($('#board').hidden) return; $('#board').hidden = true; RR.windowClosed($('#board')); }
  $('#board-body').addEventListener('click', async e => {
    if (RR.foldClick(e)) return;
    const pl = e.target.closest('[data-player]');
    if (pl) { RR.Players.use(pl.dataset.player); open(); return; }
    const b = e.target.closest('[data-board]'); if (!b) return;
    if (b.dataset.board === 'tricky') {
      G.setup.tricky = !G.setup.tricky;
      RR.device.tricky = G.setup.tricky; RR.saveDevice();
      G.queue = []; G.drawChips();
      RR.toast(G.setup.tricky ? 'Made-up melodies will use your tricky notes more' : 'Tricky notes: back to normal');
    }
    if (b.dataset.board === 'reset') {
      if (!(await RR.ask('Reset all the scores' + (RR.device.player ? ' for ' + RR.device.player : '') + '? Best scores, stars on the levels and tricky notes all go.', 'Reset'))) return;
      RR.Scores.reset(); G.points = 0; G.streak = 0; G.bestStreak = 0; G.drawChips();
    }
    open();
  });

  RR.Board = { open, close, roundDone, timeUp, hideRound, isOpen: () => !$('#board').hidden };
})();

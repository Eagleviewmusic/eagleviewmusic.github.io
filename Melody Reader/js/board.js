/* ==========================================================================
   Melody Reader — board.js
   --------------------------------------------------------------------------
   RR.Board — the Score board window (the score chip opens it), and the
   cards over the music at the end of a round:

     Round done   each melody's check or gold star (2026-10-05) and points
                  (each melody 1–20), the round's gold stars, best
                  streak, the tricky note, Play again · Settings ·
                  Level n+1 ▸ (four in five ★★ or better — every note
                  first time; the count-in is for points, not the climb)
                  — for a Song: "You played all of …" and Hear your song
     Time's up    Beat the clock's notes, melodies and clean melodies
     Battle Mode  (2026-10-05) the start (the teams, who goes first) or
                  Carry on a battle left part-way; each team's turn
                  (Go ▸); between rounds, the standings; Battle over! —
                  the winner and the table. The Score board window shows
                  the standings and each round's points per team.

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
  function saveBest(pts, stars, cards, gold) {
    const key = RR.Scores.key(), e = RR.Scores.entry(key);
    const best = { pts, stars, cards, gold, date: today(), game: G.setup.game };
    e.bests.push(best);
    e.bests.sort((a, b) => b.pts - a.pts || b.stars - a.stars);
    const mine = e.bests.filter(b => b.game === best.game);
    e.bests = e.bests.filter(b => b.game !== best.game).concat(mine.slice(0, 10));
    // the ladder's stars come from rounds (a Song or the clock is its own thing)
    // a level's stars on the ladder count only from rounds of 5 or more
    if (cards && RR.roundLen(best.game) && (G.mode.kind !== 'level' || cards >= 5)) e.stars = Math.max(e.stars, Math.round(stars / cards));
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

  /* ---------------- Battle Mode ---------------- */
  const teamName = t => '<b class="tm" style="--tc:' + t.colour + '"><i></i>' + RR.esc(t.name) + '</b>';
  const scoreText = t => RR.device.points ? t.pts + (t.pts === 1 ? ' point' : ' points') : '★ ' + t.gold;
  /* the teams, best first (shared places for a tie) */
  function standings() {
    const list = G.teamScores().slice().sort((a, b) => b.score - a.score || b.gold - a.gold || a.i - b.i);
    let place = 0;
    list.forEach((t, k) => { if (k === 0 || t.score !== list[k - 1].score || t.gold !== list[k - 1].gold) place = k + 1; t.place = place; });
    return list;
  }
  function tableHtml(list) {
    return '<ol class="bt-table">' + list.map(t => '<li style="--tc:' + t.colour + '"><span class="pl">' + t.place + '</span>' + teamName(t) +
      (RR.device.stars ? '<span class="gs">★ ' + t.gold + '</span>' : '') + (RR.device.points ? '<span class="pt">' + t.pts + '</span>' : '') + '</li>').join('') + '</ol>';
  }
  /* a card at a turn's start: the battle's start (or Carry on), between rounds, or a team's turn */
  function battleCard() {
    const b = G.battle; if (!b) return;
    const k = G.round.length; if (k >= G.roundN) return;
    const at = RR.battleAt(b, k), t = b.teams[at.team];
    const each = b.per + (b.per === 1 ? ' melody' : ' melodies');
    const go = '<button type="button" class="pill-btn go bt-go" data-rd="battle-go" style="--tc:' + t.colour + '">' + RR.esc(t.name) + ' — Go ▸</button>';
    if (G.battleResume) {
      G.battleResume = false;
      show('<div class="rd-card bt-card"><div class="bt-kicker">⚔️ Battle</div><h3>Carry on the battle?</h3>' +
        '<div class="rd-sub">Round ' + (at.round + 1) + ' of ' + b.rounds + ' · ' + RR.esc(t.name) + '’s turn next</div>' + tableHtml(standings()) +
        '<div class="rd-btns">' + go.replace('— Go ▸', '— Carry on ▸') + '<button type="button" class="pill-btn" data-rd="battle-new">New battle</button></div></div>');
      G.announce('Carry on the battle? ' + t.name + '’s turn next.');
      return;
    }
    if (at.q !== 0) return;                                    // the middle of a turn: no card
    if (k === 0) {
      show('<div class="rd-card bt-card"><div class="bt-kicker">⚔️ Battle</div><h3>' + RR.esc(G.mode.name) + '</h3>' +
        '<div class="rd-sub">' + b.rounds + (b.rounds === 1 ? ' round' : ' rounds') + ' · ' + each + ' a turn · ' + b.teams.length + ' teams</div>' +
        '<div class="bt-teams">' + b.teams.map(teamName).join('') + '</div>' +
        '<div class="rd-btns">' + go.replace('— Go ▸', 'first — Go ▸') + '<button type="button" class="pill-btn" data-rd="battle-edit">Change the teams</button></div></div>');
      G.announce('Battle! ' + b.teams.map(x => x.name).join(', ') + '. ' + t.name + ' goes first.');
    } else if (at.team === 0) {
      show('<div class="rd-card bt-card"><div class="bt-kicker">⚔️ Round ' + at.round + ' of ' + b.rounds + ' done</div><h3>Round ' + (at.round + 1) + '</h3>' +
        tableHtml(standings()) + '<div class="rd-btns">' + go + '</div></div>');
      G.announce('Round ' + at.round + ' done. ' + standings().map(x => x.name + ' ' + x.score).join(', ') + '. Round ' + (at.round + 1) + ': ' + t.name + '.');
    } else {
      show('<div class="rd-card bt-card bt-turn" style="--tc:' + t.colour + '"><div class="bt-kicker">Round ' + (at.round + 1) + ' of ' + b.rounds + '</div>' +
        '<h3 class="bt-who"><i></i>' + RR.esc(t.name) + '</h3><div class="rd-sub">It’s your turn · ' + each + '</div>' +
        '<div class="rd-btns">' + go + '</div></div>');
      G.announce(t.name + '’s turn.');
    }
  }
  function battleDone() {
    G.stopHear(true); RR.Beat.stop();
    const b = G.battle, list = standings();
    const top = list.filter(t => t.place === 1);
    G.clearBattle();
    show('<div class="rd-card bt-card bt-over"><div class="bt-kicker">⚔️ Battle over — ' + (top.length === 1 ? 'the winner' : 'a tie!') + '</div>' +
      (top.length === 1 ? '<h3 class="bt-who" style="--tc:' + top[0].colour + '">🏆 ' + RR.esc(top[0].name) + '</h3>' : '<h3>🏆 ' + top.map(t => RR.esc(t.name)).join(' and ') + '</h3>') +
      '<div class="rd-sub">' + RR.esc(G.mode.name) + ' · ' + b.rounds + (b.rounds === 1 ? ' round' : ' rounds') + '</div>' + tableHtml(list) +
      '<div class="rd-btns"><button type="button" class="pill-btn go" data-rd="battle-new">Battle again</button><button type="button" class="pill-btn" data-rd="battle-edit">Change the battle</button></div></div>');
    G.announce('Battle over. ' + (top.length === 1 ? 'The winner: ' + top[0].name + '. ' : 'A tie: ' + top.map(t => t.name).join(' and ') + '. ') + list.map(t => t.name + ' ' + scoreText(t)).join(', ') + '.');
    if (RR.device.celebrate) RR.Sound.celebrate(3);
  }

  function roundDone() {
    if (G.battle) { battleDone(); return; }
    G.stopHear(true); RR.Beat.stop();
    const r = G.round, s = G.setup;
    const total = r.reduce((a, c) => a + c.pts, 0), stars = r.reduce((a, c) => a + c.stars, 0);
    const golds = r.filter(c => c.gold).length;
    const twos = r.filter(c => c.stars >= 2).length;
    const rank = saveBest(total, stars, r.length, golds);
    const tricky = trickyOf(G.rstats);
    const isLevel = G.mode.kind === 'level';
    const ready = isLevel && !G.playingSet() && r.length >= 5 && twos >= Math.ceil(r.length * 0.8) && G.mode.n < RR.LEVELS.length;
    const set = G.playingSet();
    const song = s.game === 'song' ? (s.song || s.songs[0] || 'hot-cross-buns') : null;
    const whole = s.game === 'song' ? (set ? set.title : RR.SONGS[song].title) : null;
    show('<div class="rd-card"><h3>' + (whole ? 'You played all of ' + RR.esc(whole) + '!' : 'Round done!') + '</h3>' +
      '<div class="rd-sub">' + RR.esc(G.modeLabel()) + (rank === 0 && RR.device.points ? ' · <b class="new-best">a new best!</b>' : '') + '</div>' +
      '<div class="rd-rows">' + r.map(c => '<div class="rd-c"><b>' + RR.esc(c.label) + '</b><span>' + RR.markHtml(c) + '</span>' + (RR.device.points ? '<i>' + c.pts + '</i>' : '') + '</div>').join('') + '</div>' +
      '<div class="rd-stats">' + (RR.device.points ? '<div><b>' + total + '</b>points</div>' : '') + (RR.device.stars ? '<div><b class="t-star">★ ' + golds + '</b>gold stars</div>' : '') +
      '<div><b>' + G.bestStreak + '</b>best streak</div></div>' +
      (tricky ? '<div class="rd-tricky">Your tricky note: <b class="lpill" style="--c:' + BAR[tricky].colour + '">' + tricky[0] + '</b> — it shows on the Score board</div>' : '<div class="rd-tricky">No tricky notes this round.</div>') +
      (ready ? '<div class="rd-ready">Ready for the next level!</div>' : '') +
      '<div class="rd-btns">' + (whole ? '<button type="button" class="pill-btn go" data-rd="song" data-label="' + (set ? '▶ Hear the whole set' : '▶ Hear your song') + '">' + (set ? '▶ Hear the whole set' : '▶ Hear your song') + '</button>' : '') +
      '<button type="button" class="pill-btn" data-rd="again">Play again</button>' +
      (G.mode.kind === 'lesson' ? '' : '<button type="button" class="pill-btn" data-rd="settings">Settings</button>') +
      (ready ? '<button type="button" class="pill-btn go" data-rd="next">Level ' + (G.mode.n + 1) + ' ▸</button>' : '') + '</div></div>');
    G.announce((whole ? 'You played all of ' + whole + '. ' : 'Round done. ') + (RR.device.stars ? golds + (golds === 1 ? ' gold star. ' : ' gold stars. ') : '') + (RR.device.points ? total + ' points. ' : '') + (ready ? 'Ready for the next level.' : ''));
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
    else if (a === 'battle-go') { hideRound(); G.draw(); G.roll(); }
    else if (a === 'battle-new') { G.clearBattle(); G.newRound(); }
    else if (a === 'battle-edit') { G.clearBattle(); G.newRound(); RR.Settings.open('session'); }
  });

  /* ---- the Score board window ---- */
  /* the Score board in a battle: the standings, and each round's points per team */
  function battleHtml() {
    const b = G.battle, bn = G.battleNow(), done = G.round.length >= G.roundN;
    const cells = (i, rd) => G.round.filter((e, k) => e.team === i && RR.battleAt(b, k).round === rd);
    return '<div class="panel wide"><h3>⚔️ ' + RR.esc(G.mode.name) + ' · ' + (done ? 'Battle over' : 'Round ' + (bn.round + 1) + ' of ' + b.rounds) + '</h3>' +
      tableHtml(standings()) +
      '<div class="bt-grid-wrap"><table class="bt-grid"><thead><tr><th></th>' + Array.from({ length: b.rounds }, (_, rd) => '<th>R' + (rd + 1) + '</th>').join('') + '<th>Total</th></tr></thead><tbody>' +
      G.teamScores().map(t => '<tr><th>' + teamName(t) + '</th>' + Array.from({ length: b.rounds }, (_, rd) => {
        const c = cells(t.i, rd);
        return '<td>' + (c.length ? (RR.device.points ? c.reduce((a, e) => a + e.pts, 0) : '★ ' + c.filter(e => e.gold).length) : '') + '</td>';
      }).join('') + '<td class="tot">' + (RR.device.points ? t.pts : '★ ' + t.gold) + '</td></tr>').join('') +
      '</tbody></table></div></div>';
  }
  function html() {
    const r = G.round, me = RR.Scores.me();
    const golds = r.filter(c => c.gold).length, clean = r.filter(c => c.stars >= 2).length;
    const e = me.levels[RR.Scores.key()];
    const bests = e && Array.isArray(e.bests) ? e.bests.filter(b => b.game === G.setup.game).slice(0, 5) : [];
    const mix = Object.keys(me.mix).filter(k => k.includes('>')).map(k => [k, me.mix[k] | 0]).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const tot = me.totals;
    const acc = tot.notes ? Math.round(100 * tot.first / tot.notes) : 0;
    const pill = id => BAR[id] ? '<b class="lpill" style="--c:' + BAR[id].colour + '">' + id[0] + '</b>' : '';
    const used = RR.BARS.slice(0, RR.Xylo.count());
    const players = RR.Players.list().length ? '<div class="panel wide"><h3>Who’s playing?</h3>' + RR.Players.chipsHtml(false) + '</div>' : '';
    return (G.battle ? battleHtml() : players + '<div class="panel wide"><h3>' + (G.clock ? 'This game' : 'This round') + (RR.Players.current() ? ' · ' + RR.esc(RR.Players.current()) : '') + '</h3><div class="tiles">' +
      (RR.device.points ? '<div class="tile"><b>' + G.points + '</b><span>points</span></div>' : '') +
      (RR.device.stars ? '<div class="tile"><b class="t-star">★ ' + golds + '</b><span>gold stars</span></div>' : '') +
      '<div class="tile"><b>' + clean + '</b><span>clean melodies</span></div><div class="tile"><b>🔥 ' + G.bestStreak + '</b><span>best streak</span></div></div>' +
      '<div class="cards-row">' + (r.length ? r.map(c => '<div class="rc">' + RR.esc(c.label) + '<span>' + RR.markHtml(c) + '</span></div>').join('') : '<span class="note">No melodies yet this round.</span>') + '</div></div>' +
      '<div class="panel"><h3>Best scores · ' + RR.esc(G.modeLabel()) + '</h3>' +
      (bests.length ? '<ul class="best">' + bests.map((b, i) => '<li class="' + (b.date === today() && i === 0 ? 'new' : '') + '"><span>' + (i + 1) + '</span><b>' + b.pts + '</b><span class="st">' + (b.cards && typeof b.gold === 'number' && RR.device.stars ? '★ ' + b.gold : '') + '</span><span class="when">' + when(b.date) + '</span></li>').join('') + '</ul>'
        : '<p class="note">Finish a round to set a best score.</p>') + '</div>') +
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
    $('#board-level').textContent = G.battle ? '⚔️ Battle' : G.modeLabel();
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

  RR.Board = { open, close, roundDone, timeUp, hideRound, battleCard, isOpen: () => !$('#board').hidden };
})();

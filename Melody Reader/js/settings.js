/* ==========================================================================
   Melody Reader — settings.js
   --------------------------------------------------------------------------
   RR.Settings — one window, tabs down the side (across the top on a phone):
   Level · Notes · Rhythms · How to play · Helps · Points · Sound · Share.

   Changing anything in a practice tab makes the practice Custom (from the
   level it started as). Helps change the card at once; notes, rhythms and
   the rest take effect on the next card, which comes when the window
   closes; a new game starts a new round.

   In a lesson (a lesson link) only Sound and Points show, with Leave the
   lesson. Explaining notes fold into their ⓘ (RR.note).
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game;
  const C = () => RR.Melody.CELL;
  let tab = 'level';

  const seg = (k, opts, cur) => '<div class="seg" role="group">' + opts.map(o =>
    '<button type="button" data-k="' + k + '" data-v="' + o[0] + '" class="' + (String(cur) === String(o[0]) ? 'on' : '') + '" aria-pressed="' + (String(cur) === String(o[0])) + '">' + o[1] + '</button>').join('') + '</div>';
  const sw = (k, on, label) => '<button type="button" class="switch' + (on ? ' on' : '') + '" data-toggle="' + k + '" role="switch" aria-checked="' + !!on + '" aria-label="' + RR.esc(label || k) + '"></button>';
  const row = (label, ctl) => '<div class="row"><span class="lbl">' + label + '</span>' + ctl + '</div>';
  const swRow = (label, k, on) => row(label, sw(k, on, label));

  const PICKS = [
    ['E D C', ['C4', 'D4', 'E4']], ['Do Re Mi So', ['C4', 'D4', 'E4', 'G4']], ['Do to So', ['C4', 'D4', 'E4', 'F4', 'G4']],
    ['Do to Do', ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']], ['Lines', ['E4', 'G4', 'B4', 'D5', 'F5']],
    ['Spaces', ['F4', 'A4', 'C5', 'E5']], ['All ten', RR.TEN], ['All twelve', RR.TWELVE]
  ];

  /* Melodies from: made up, the Songbook — or a set from My melodies, which
     belongs to the browser like the game (melodies.js) */
  function fromHtml(s) {
    const lesson = G.mode.kind === 'lesson';
    const playingSet = G.playingSet();
    const cur = playingSet ? 'set' : s.from;
    const opts = [['both', 'Made up + Songbook'], ['made', 'Made up'], ['songbook', 'Songbook']];
    if (lesson) return playingSet ? '<p class="note">This lesson plays its own melodies: <b>' + RR.esc(playingSet.title) + '</b>.</p>' : seg('from', opts, cur);
    const sets = RR.Sets.list().filter(x => x.melodies.length);
    let h = seg('from', opts.concat([['set', 'My melodies']]), cur);
    if (cur === 'set' || sets.length) {
      h += '<div class="picks">' + sets.map(x => '<button type="button" data-k="@set" data-v="' + x.id + '" class="' + (playingSet && playingSet.id === x.id ? 'on' : '') + '">' + RR.esc(x.title) + (x.received ? ' ·  shared' : '') + '</button>').join('') + '</div>';
    }
    h += '<div class="row"><button type="button" class="pill-btn" data-act="melodies">Open My melodies…</button></div>' +
      RR.note('mf', 'A set from My melodies is played with this level’s helps and tempos. Write sets in My melodies (the ♫ button at the top).');
    return h;
  }

  const TAB = {
    level() {
      const cur = G.mode;
      const mine = RR.Mine.list();
      return RR.note('lv', 'Pick a level to play it. Each one is a ready-made practice — the other tabs show what is in it, and changing them makes a Custom practice.') +
        RR.BANDS.map(b => '<div class="band" style="--bc:' + b.colour + '"><div class="band-head"><b>' + b.name + ' · ' + b.title + '</b><span>' + b.about + '</span></div>' +
          RR.LEVELS.filter(l => l.band === b.id).map(l => '<button type="button" class="lvl' + (cur.kind === 'level' && l.n === cur.n ? ' on' : '') + '" data-level="' + l.n + '">' +
            '<span class="n">' + l.n + '</span><span class="t"><b>' + l.name + '</b><span>' + RR.summary(l) + '</span></span>' +
            '<span class="s" aria-label="best ' + RR.Scores.levelStars(String(l.n)) + ' stars">' + RR.starsHtml(RR.Scores.levelStars(String(l.n)), 3) + '</span></button>').join('') +
          '</div>').join('') +
        '<div class="band" style="--bc:' + RR.MINE_COLOUR + '"><div class="band-head"><b>Mine</b><span>Practices you have saved</span></div>' +
        mine.map(m => '<div class="lvl-wrap"><button type="button" class="lvl' + (cur.kind === 'mine' && cur.name === m.name ? ' on' : '') + '" data-mine="' + RR.esc(m.name) + '">' +
          '<span class="n">♪</span><span class="t"><b>' + RR.esc(m.name) + '</b><span>' + RR.summary(m.practice) + '</span></span>' +
          '<span class="s">' + RR.starsHtml(RR.Scores.levelStars('mine:' + m.name), 3) + '</span></button>' +
          '<button type="button" class="x-btn" data-unmine="' + RR.esc(m.name) + '" aria-label="Delete ' + RR.esc(m.name) + '">×</button></div>').join('') +
        '<div class="save-mine"><input type="text" id="mine-name" maxlength="40" placeholder="A name for this practice" value="' + RR.esc(cur.kind === 'mine' ? cur.name : '') + '">' +
        '<button type="button" class="pill-btn" data-act="save-mine">Save this practice</button></div></div>';
    },
    notes() {
      const s = G.setup, cur = s.notes.slice().sort().join();
      return '<div class="sec"><h3>The notes to read</h3>' + RR.note('nt', 'Tap a note on the staff, or a bar, to put it in the practice or take it out. The two show the same choice.') +
        '<div class="notes-pick">' + RR.Eng.picker(s.notes) +
        '<div class="pick-xylo">' + RR.BARS.map(b => '<button type="button" data-note="' + b.id + '" class="' + (s.notes.includes(b.id) ? '' : 'off') + '" style="--c:' + b.colour + ';--len:' + (b.len * 0.8) + '%" aria-pressed="' + s.notes.includes(b.id) + '" aria-label="' + b.id + '">' + b.letter + '</button>').join('') + '</div></div>' +
        '<div class="picks">' + PICKS.map(p => '<button type="button" data-pick="' + p[1].join(',') + '" class="' + (p[1].slice().sort().join() === cur ? 'on' : '') + '">' + p[0] + '</button>').join('') + '</div></div>' +
        '<div class="sec"><h3>How it moves</h3>' + seg('moves', [['steps', 'Steps'], ['skips', 'Steps and skips'], ['leaps', 'Leaps too']], s.moves) +
        RR.note('mv', 'A step is to the next note in the practice — in Lines, E to G is a step.') + '</div>' +
        '<div class="sec">' + swRow('End on Do', 'endDo', s.endDo) + swRow('Practise my tricky notes', 'tricky', s.tricky) +
        swRow('Grey out the bars not in the music', 'grey', s.grey) + '</div>';
    },
    rhythms() {
      const s = G.setup;
      return '<div class="sec"><h3>The rhythms to use</h3>' + RR.note('rh', 'Tap a card to put it in or take it out, and to hear it. Made-up melodies are built from these, bar by bar.') +
        '<div class="cells">' + RR.Melody.CELLS.map(c => {
          const pic = RR.Eng.render({ time: [Math.max(1, c.len / 4), 4], notes: c.ticks.map(t => t < 0 ? { p: null, t: -t } : { p: 'A4', t }) }, { ss: 6.5, bare: true, colour: 'black', labels: 'none', maxStretch: 1 }).svg;
          return '<button type="button" class="cell' + (s.rhythms.includes(c.id) ? ' on' : '') + '" data-cell="' + c.id + '" aria-pressed="' + s.rhythms.includes(c.id) + '"><span class="pic">' + pic + '</span><b>' + c.name + '</b><small>' + c.about + '</small></button>';
        }).join('') + '</div></div>' +
        '<div class="sec">' + row('Time', seg('time', [['2', '2/4'], ['3', '3/4'], ['4', '4/4']], s.time[0])) +
        row('Length', seg('bars', [['1', '1 bar'], ['2', '2 bars']], s.bars)) + swRow('End on a long note', 'endLong', s.endLong) + '</div>';
    },
    play() {
      const s = G.setup;
      return '<div class="sec"><h3>Count me in</h3>' +
        RR.note('ci', 'A 1 2 3 4 count-in, then a metronome through the melody — nothing shows but the notes lighting as they are played. The player picks Slow, Moderate or Fast under Count me in; these are the three tempos.') +
        RR.Points.PACES.map((p, i) => '<div class="row"><span class="lbl">' + p.name + ' <small class="pts-range">' + p.lo + '–' + p.hi + ' points</small></span>' +
          '<input type="range" min="40" max="160" step="2" value="' + s.tempos[i] + '" data-range="tempo' + i + '" aria-label="' + p.name + ' tempo"><b id="tempo' + i + '-v">' + s.tempos[i] + ' BPM</b></div>').join('') +
        row('Flash (the notes fade after the count-in)', seg('flash', [['0', 'Off'], ['2', '2 s'], ['3', '3 s'], ['4', '4 s'], ['6', '6 s']], s.flash)) +
        swRow('One go (no Again)', 'oneGo', s.oneGo) + '</div>' +
        '<div class="sec"><h3>Game</h3>' + seg('game', [['round5', 'Round of 5'], ['round10', 'Round of 10'], ['song', 'Song'], ['clock', 'Beat the clock'], ['endless', 'Endless']], s.game) +
        (s.game === 'song' ? '<div class="picks">' + Object.keys(RR.SONGS).map(id => '<button type="button" data-song="' + id + '" class="' + ((s.song || s.songs[0] || 'hot-cross-buns') === id ? 'on' : '') + '">' + RR.esc(RR.SONGS[id].title) + '</button>').join('') + '</div>' +
          RR.note('sg', 'The song, card by card — and at the end, Hear your song.') : '') +
        (s.game === 'clock' ? '<div class="row">' + seg('clockSecs', [['30', '30 s'], ['60', '60 s'], ['120', '2 min']], s.clockSecs) + '</div>' +
          RR.note('ck', 'As many melodies as you can — no Practice, no count-in. The clock starts with your first note; each melody scores 1–12.') : '') + '</div>' +
        '<div class="sec"><h3>Melodies from</h3>' + fromHtml(s) +
        row('Next melody', seg('auto', [['true', 'Comes by itself'], ['false', 'When I press Next']], s.auto)) + '</div>';
    },
    helps() {
      const s = G.setup;
      return RR.note('hp', 'Every help, so they can be taken away one at a time. The levels turn them off as the bands go up.') +
        '<table class="helps"><tbody>' +
        '<tr><td>Coloured notes</td><td>' + seg('colour', [['always', 'Always'], ['lit', 'Lit when played'], ['black', 'Black']], s.colour) + '</td></tr>' +
        '<tr><td>Letters on the bars</td><td>' + sw('letters', s.letters, 'Letters on the bars') + '</td></tr>' +
        '<tr><td>Numbers on the bars</td><td>' + sw('nums', s.nums, 'Numbers on the bars') + '</td></tr>' +
        '<tr><td>The bar glows</td><td>' + seg('glow', [['never', 'Never'], ['after2', 'After 2 slips'], ['always', 'Always']], s.glow) + '</td></tr>' +
        '<tr><td>Ghost notes (where a slip landed)</td><td>' + sw('ghost', s.ghost, 'Ghost notes') + '</td></tr>' +
        '<tr><td>Under the notes</td><td>' + seg('labels', [['none', 'Nothing'], ['letters', 'Letter names'], ['syllables', 'Rhythm syllables']], s.labels) + '</td></tr>' +
        '<tr><td>Practice first (hear it, try it, then I’m ready)</td><td>' + sw('practice', s.practice, 'Practice first') + '</td></tr>' +
        '<tr><td>Hear it (▶ in Practice)</td><td>' + seg('play', [['shown', 'Yes'], ['hidden', 'No']], s.playHidden ? 'hidden' : 'shown') + '</td></tr>' +
        '<tr><td>Hearing it lights the bars</td><td>' + sw('playLights', s.playLights, 'Hearing it lights the bars') + '</td></tr>' +
        '<tr><td>Grey out the bars not in the music</td><td>' + sw('grey', s.grey, 'Grey out the bars not in the music') + '</td></tr>' +
        '</tbody></table>';
    },
    points() {
      return '<div class="sec">' + swRow('Points', '@points', RR.device.points) +
        RR.note('pt-how', 'Each melody earns 1 to 20. Find the notes: 1–8 (a note right first time counts 1, second time ½). Every note first time, in your own steady beat: 9–12. Count me in, every note right and in time: Slow 13–15, Moderate 16–18, Fast 19–20 — but a wrong or missed note in a count-in drops it to 1–8. Stars: ★ 1–7 · ★★ 8–12 · ★★★ 13–20.') +
        RR.note('pt', 'With points off there are no numbers anywhere. The lights, sparkles and stars stay.') +
        swRow('Stars', '@stars', RR.device.stars) +
        swRow('Celebration sounds', '@celebrate', RR.device.celebrate) + '</div>' +
        '<div class="sec"><h3>Players</h3>' + RR.note('pl', 'For a shared computer or smartboard: add first names. Each player has their own scores, stars and tricky notes; tap a name to play as them. The scores kept so far go to the first name added.') +
        RR.Players.chipsHtml(true) +
        '<div class="save-mine"><input type="text" id="player-name" maxlength="20" placeholder="A first name"><button type="button" class="pill-btn" data-act="add-player">Add</button></div></div>' +
        '<div class="sec"><button type="button" class="pill-btn" data-act="reset">Reset scores' + (RR.Players.current() ? ' for ' + RR.esc(RR.Players.current()) : '') + '…</button></div>';
    },
    sound() {
      return '<div class="sec">' + row('Sound', seg('@voice', [['vibraphone', 'Vibraphone'], ['marimba', 'Marimba']], RR.Sound.voice)) +
        '<div class="row"><span class="lbl">Volume</span><input type="range" min="0" max="1" step="0.05" value="' + RR.Sound.volume + '" data-range="@volume" aria-label="Volume"></div>' +
        '<div class="row"><span class="lbl"></span><button type="button" class="pill-btn" data-act="test">Test the sound</button></div>' +
        RR.note('sd', 'Test the sound also wakes up a Bluetooth or projector speaker that has gone to sleep, so the first note is never lost.') + '</div>';
    },
    share() {
      const name = G.mode.kind === 'mine' ? G.mode.name : G.mode.kind === 'level' ? 'Level ' + G.mode.n : '';
      return '<div class="sec"><h3>Lesson link</h3>' + RR.note('sh', 'A link that opens Melody Reader with this exact practice, as a lesson: the chip says Lesson, and Settings shows only Sound, Points and Leave the lesson. Post it for a class, or put it in a Google Site.') +
        '<div class="row"><span class="lbl">The lesson’s name</span><input type="text" id="lesson-name" maxlength="40" value="' + RR.esc(name) + '" placeholder="Week 3"></div>' +
        '<div class="row"><span class="lbl"></span><button type="button" class="pill-btn primary" data-act="copy-link">Copy the lesson link</button></div>' +
        '<div class="row"><input type="text" id="lesson-link" readonly aria-label="The lesson link" value="' + RR.esc(RR.Lesson.link(name || 'Lesson', G.setup, G.playingSet())) + '"></div></div>';
    },
    leave() {
      return '<div class="sec"><h3>' + RR.esc(G.modeLabel()) + '</h3>' + RR.note('lsn', 'This practice came from a lesson link. Leave the lesson to choose your own levels again.') +
        '<button type="button" class="pill-btn primary" data-act="leave">Leave the lesson</button></div>';
    }
  };
  const TABS_ALL = [['level', 'Level'], ['notes', 'Notes'], ['rhythms', 'Rhythms'], ['play', 'How to play'], ['helps', 'Helps'], ['points', 'Points'], ['sound', 'Sound'], ['share', 'Share']];
  const TABS_LESSON = [['leave', 'Lesson'], ['points', 'Points'], ['sound', 'Sound']];
  const tabs = () => G.mode.kind === 'lesson' ? TABS_LESSON : TABS_ALL;

  function render() {
    const list = tabs();
    if (!list.some(t => t[0] === tab)) tab = list[0][0];
    $('#tabs').innerHTML = list.map(t => '<button type="button" class="tab' + (t[0] === tab ? ' on' : '') + '" data-tab="' + t[0] + '" role="tab" aria-selected="' + (t[0] === tab) + '">' + t[1] + '</button>').join('');
    const body = $('#tab-body'), y = body.scrollTop;
    body.innerHTML = TAB[tab]();
    body.scrollTop = y;
    $('#custom-tag').textContent = G.modeLabel();
  }
  function open(which) {
    if (which) tab = which;
    G.pause();
    render();
    RR.windowOpened($('#settings'));
    $('#settings').hidden = false;
    const b = $('#tabs .tab.on'); if (b) b.focus();
  }
  function close() {
    if ($('#settings').hidden) return;
    $('#settings').hidden = true;
    RR.windowClosed($('#settings'));
    if (G.roundChanged) { G.roundChanged = false; G.contentChanged = false; G.queue = []; G.newRound(); }
    else if (G.contentChanged) { G.contentChanged = false; G.queue = []; G.nextCard(); }
  }

  const CONTENT = ['notes', 'rhythms', 'time', 'bars', 'moves', 'endDo', 'endLong', 'from', 'tricky'];
  const ROUND = ['game', 'clockSecs', 'song'];
  function change(k, v) {
    const s = G.setup;
    if (k[0] === '@') {
      if (k === '@points') RR.device.points = v;
      else if (k === '@stars') RR.device.stars = v;
      else if (k === '@celebrate') RR.device.celebrate = v;
      else if (k === '@voice') RR.Sound.voice = v;
      else if (k === '@volume') RR.Sound.volume = +v;
      else if (k === '@set') {                // a set from My melodies: the browser's, like the game
        RR.device.set = v || null; s.set = v || null;
        G.roundChanged = true; G.applyInstrument();
      }
      RR.saveDevice(); G.drawChips(); return;
    }
    if (k === 'from' && v === 'set') {
      const first = RR.Sets.list().find(x => x.melodies.length);
      if (first) change('@set', first.id);
      else { close(); RR.Melodies.open(); RR.toast('Write a melody set first — + New set'); }
      return;
    }
    if (k === 'from' && (s.set || RR.device.set)) {     // other melodies: the set stops
      RR.device.set = null; s.set = null; RR.saveDevice(); G.roundChanged = true;
      if (v === s.from) { G.applyInstrument(); G.drawChips(); return; }
    }
    if (k === 'time') s.time = [+v, 4];
    else if (['bars', 'flash', 'clockSecs'].includes(k)) s[k] = +v;
    else if (/^tempo\d$/.test(k)) {        // Slow ≤ Moderate ≤ Fast: dragging one past another pushes it along
      const i = +k[5], tp = s.tempos.slice();
      tp[i] = +v;
      for (let j = i + 1; j < 3; j++) tp[j] = Math.max(tp[j], tp[j - 1]);
      for (let j = i - 1; j >= 0; j--) tp[j] = Math.min(tp[j], tp[j + 1]);
      s.tempos = tp;
    }
    else if (k === 'auto') s.auto = v === 'true' || v === true;
    else if (k === 'play') s.playHidden = v === 'hidden';
    else s[k] = v;
    // the game is how a practice is played, not part of it: it stays with this
    // browser and never makes a level Custom (a lesson link can still set it)
    if (ROUND.includes(k)) {
      G.roundChanged = true;
      if (G.mode.kind !== 'lesson') { RR.device.game = s.game; RR.device.clockSecs = s.clockSecs; RR.device.song = s.song; RR.saveDevice(); }
    } else if (k === 'tricky') {             // a personal help: kept with the browser, the level stays the level
      if (G.mode.kind !== 'lesson') { RR.device.tricky = s.tricky; RR.saveDevice(); }
    } else G.markCustom();
    if (CONTENT.includes(k)) G.contentChanged = true;
    if (k === 'practice' || k === 'play' || k === 'labels' || k === 'oneGo') { RR.Beat.stop(); G.resetCard(k === 'practice' ? (s.practice && !G.clock ? 'practice' : 'game') : undefined); }
    G.applyInstrument();
    G.draw();
  }

  const body = $('#tab-body');
  body.addEventListener('click', async e => {
    if (RR.foldClick(e)) return;
    const t = e.target;
    const lv = t.closest('[data-level]');
    if (lv) { G.selectLevel(+lv.dataset.level); render(); return; }
    const mn = t.closest('[data-mine]');
    if (mn) { const m = RR.Mine.list().find(x => x.name === mn.dataset.mine); if (m) { G.usePractice(m.practice, { kind: 'mine', name: m.name }); render(); } return; }
    const um = t.closest('[data-unmine]');
    if (um) {
      const name = um.dataset.unmine;
      if (await RR.ask('Delete "' + name + '"?', 'Delete')) { RR.Mine.remove(name); render(); }
      return;
    }
    const sg = t.closest('[data-k]');
    if (sg) { change(sg.dataset.k, sg.dataset.v); render(); return; }
    const tg = t.closest('[data-toggle]');
    if (tg) {
      const k = tg.dataset.toggle;
      const cur = k === '@points' ? RR.device.points : k === '@stars' ? RR.device.stars : k === '@celebrate' ? RR.device.celebrate : G.setup[k];
      change(k, !cur); render(); return;
    }
    const nt = t.closest('[data-note]');
    if (nt) {
      const id = nt.dataset.note, s = G.setup;
      let notes = s.notes.slice();
      if (notes.includes(id)) { if (notes.length > 1) notes = notes.filter(x => x !== id); } else notes.push(id);
      change('notes', notes); render(); return;
    }
    const pk = t.closest('[data-pick]');
    if (pk) { change('notes', pk.dataset.pick.split(',')); render(); return; }
    const so = t.closest('[data-song]');
    if (so) { change('song', so.dataset.song); render(); return; }
    const cl = t.closest('[data-cell]');
    if (cl) {
      const id = cl.dataset.cell, s = G.setup, CELL = C();
      let r = s.rhythms.slice();
      const notes = r.filter(x => !CELL[x].rest);
      if (r.includes(id)) { if (!(notes.length === 1 && notes[0] === id)) r = r.filter(x => x !== id); } else r.push(id);
      change('rhythms', r); render();
      // hear it: on G, at the Moderate tempo
      const spt = 60 / RR.paceTempo(s, 'moderate') / 4; let tt = RR.Sound.now() + 0.05;
      CELL[id].ticks.forEach(x => { if (x > 0) RR.Sound.playAt('G4', tt, 0.7); tt += Math.abs(x) * spt; });
      return;
    }
    const pl = t.closest('[data-player]');
    if (pl) { RR.Players.use(pl.dataset.player); render(); return; }
    const up = t.closest('[data-unplayer]');
    if (up) {
      const name = up.dataset.unplayer;
      if (await RR.ask('Remove ' + name + ' and ' + name + '’s scores?', 'Remove')) { RR.Players.remove(name); render(); }
      return;
    }
    const act = t.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'melodies') { close(); RR.Melodies.open(); return; }
    if (a === 'add-player') {
      const r = RR.Players.add($('#player-name').value);
      if (!r.ok) { RR.toast(r.why); $('#player-name').focus(); return; }
      render(); RR.toast(r.name + ' is playing'); return;
    }
    if (a === 'test') {
      await RR.Sound.prime(0.3);
      const tt = RR.Sound.now() + 0.05;
      ['C4', 'E4', 'G4', 'C5'].forEach((id, i) => RR.Sound.playAt(id, tt + i * 0.18));
    } else if (a === 'reset') {
      if (await RR.ask('Reset all the scores' + (RR.device.player ? ' for ' + RR.device.player : '') + '? Best scores, stars on the levels and tricky notes all go.', 'Reset')) {
        RR.Scores.reset(); G.points = 0; G.streak = 0; G.bestStreak = 0; G.drawChips(); render(); RR.toast('Scores reset');
      }
    } else if (a === 'save-mine') {
      const name = ($('#mine-name').value || '').trim().slice(0, 40);
      if (!name) { $('#mine-name').focus(); RR.toast('Give the practice a name first'); return; }
      if (RR.Mine.list().some(m => m.name === name) && !(await RR.ask('Replace "' + name + '" with this practice?', 'Replace'))) return;
      RR.Mine.add(name, G.setup);
      G.mode = { kind: 'mine', name };
      RR.device.practice = { kind: 'mine', name, practice: G.setup }; RR.saveDevice();
      G.drawChips(); render(); RR.toast('Saved in Mine');
    } else if (a === 'copy-link') {
      const name = ($('#lesson-name').value || '').trim() || 'Lesson';
      const link = RR.Lesson.link(name, G.setup, G.playingSet());
      $('#lesson-link').value = link;
      try { await navigator.clipboard.writeText(link); RR.toast('Lesson link copied'); }
      catch (_) { $('#lesson-link').select(); RR.toast('Select the link and copy it'); }
    } else if (a === 'leave') {
      RR.Lesson.leave(); close();
    }
  });
  body.addEventListener('input', e => {
    const r = e.target.closest('[data-range]');
    if (r) {
      change(r.dataset.range, r.value);
      if (/^tempo\d$/.test(r.dataset.range)) G.setup.tempos.forEach((v, i) => {
        const b = $('#tempo' + i + '-v'), inp = body.querySelector('[data-range="tempo' + i + '"]');
        if (b) b.textContent = v + ' BPM';
        if (inp && inp !== r) inp.value = v;
      });
      return;
    }
    if (e.target.id === 'lesson-name') $('#lesson-link').value = RR.Lesson.link(e.target.value.trim() || 'Lesson', G.setup, G.playingSet());
  });
  body.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'mine-name') { e.preventDefault(); body.querySelector('[data-act="save-mine"]').click(); }
    if (e.key === 'Enter' && e.target.id === 'player-name') { e.preventDefault(); body.querySelector('[data-act="add-player"]').click(); }
  });
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; body.scrollTop = 0; render(); } });

  RR.Settings = { open, close, render, isOpen: () => !$('#settings').hidden };
})();

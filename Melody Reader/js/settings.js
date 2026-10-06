/* ==========================================================================
   Melody Reader — settings.js
   --------------------------------------------------------------------------
   RR.Settings — one window, tabs down the side (across the top on a phone):
   Level · Notes · Rhythms · How to play · Helps · Points · Sound · Share.

   Changing anything in a practice tab makes the practice Custom (from the
   level it started as). Helps change the card at once; notes, rhythms and
   the rest take effect on the next card, which comes when the window
   closes; a new game starts a new round.

   My sessions (2026-10-05) head the Level tab: + New session names one
   (a copy of what is playing) and opens its page — every choice on one
   page: name, notes, rhythms, the look and helps, the gold star, the
   metronome and the game. A session saves as you go (never Custom), and
   keeps its own game. While a session plays, its tabs are Level · the
   session · Points · Sound · Share.

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
      RR.note('mf', 'A set from My melodies is played with these helps and tempos. Write sets in My melodies (the ♫ button at the top).');
    return h;
  }

  /* ---- Battle Mode: the teams, and turns and rounds (2026-10-05) ---- */
  const battleText = b => b.teams.length + ' teams · ' + b.rounds + (b.rounds === 1 ? ' round' : ' rounds') + ' · ' + b.per + (b.per === 1 ? ' melody' : ' melodies') + ' a turn';
  function battlePage() {
    const b = G.battle, total = RR.battleTotal(b);
    return '<div class="sec"><h3>The teams</h3>' + RR.note('bt-teams', 'Who’s battling? Two to four teams — give each one a name and a colour. They take turns at the xylophone.') +
      '<div class="bt-edit">' + b.teams.map((t, i) => '<div class="bt-row" style="--tc:' + t.colour + '">' +
        '<span class="bt-dot" aria-hidden="true"></span>' +
        '<input type="text" class="bt-name" data-team-name="' + i + '" maxlength="24" value="' + RR.esc(t.name) + '" aria-label="Team ' + (i + 1) + '’s name">' +
        '<span class="bt-sw" role="group" aria-label="Team ' + (i + 1) + '’s colour">' + RR.TEAM_COLOURS.map(c => '<button type="button" data-team-colour="' + i + ':' + c[0] + '"' +
          ' class="' + (c[0] === t.colour ? 'on' : '') + '" style="--c:' + c[0] + '" aria-label="' + c[1] + '" aria-pressed="' + (c[0] === t.colour) + '" title="' + c[1] + '"></button>').join('') + '</span>' +
        (b.teams.length > 2 ? '<button type="button" class="x-btn bt-x" data-team-remove="' + i + '" aria-label="Take ' + RR.esc(t.name) + ' out" title="Take this team out">×</button>' : '') +
        '</div>').join('') + '</div>' +
      (b.teams.length < 4 ? '<div class="row"><button type="button" class="pill-btn" data-act="add-team">+ Add a team</button></div>' : '') + '</div>' +
      '<div class="sec"><h3>Turns and rounds</h3>' +
      row('Melodies a turn', '<div class="seg" role="group">' + [1, 2, 3].map(n => '<button type="button" data-bt="per" data-v="' + n + '" class="' + (b.per === n ? 'on' : '') + '" aria-pressed="' + (b.per === n) + '">' + n + '</button>').join('') + '</div>') +
      '<div class="row count-row"><span class="lbl">Rounds</span><div class="stepper" role="group" aria-label="Rounds">' +
        '<button type="button" data-bt="rounds" data-v="-1" aria-label="One round fewer"' + (b.rounds <= 1 ? ' disabled' : '') + '>−</button>' +
        '<input type="number" id="battle-rounds" min="1" max="' + RR.BATTLE_ROUNDS_MAX + '" step="1" inputmode="numeric" value="' + b.rounds + '" aria-label="Rounds">' +
        '<button type="button" data-bt="rounds" data-v="1" aria-label="One round more"' + (b.rounds >= RR.BATTLE_ROUNDS_MAX ? ' disabled' : '') + '>+</button></div></div>' +
      '<p class="note bt-sum">' + b.teams.length + ' teams × ' + b.per + (b.per === 1 ? ' melody' : ' melodies') + ' × ' + b.rounds + (b.rounds === 1 ? ' round' : ' rounds') + ' = <b>' + total + ' melodies</b></p>' +
      RR.note('bt-how', 'Each team plays its melodies, then the next team has a turn; when every team has had one, that is a round. Points go to the team playing. Changing the teams, the melodies a turn or the rounds starts the battle again.') + '</div>';
  }
  /* change the battle being played: saved at once; the names and colours show at once */
  function changeBattle(fn) {
    if (!G.battle || G.mode.kind !== 'session') return;
    const b = RR.clone(G.battle);
    fn(b);
    const saved = RR.Sessions.updateBattle(G.mode.id, b);
    if (saved) G.setBattle(saved);
  }

  const TAB = {
    level() {
      const cur = G.mode;
      const list = RR.Sessions.list();
      // My sessions first: your own, then the ladder
      return '<div class="band ses-band" style="--bc:' + RR.SESSION_COLOUR + '"><div class="band-head"><b>My sessions</b><span>Your own practices — new melodies made from your choices every time</span></div>' +
        list.map(x => '<div class="lvl-wrap two' + (x.kind === 'battle' ? ' bt' : '') + '"><button type="button" class="lvl' + (cur.kind === 'session' && cur.id === x.id ? ' on' : '') + '" data-session="' + x.id + '">' +
          (x.kind === 'battle'
            ? '<span class="n">⚔️</span><span class="t"><b>' + RR.esc(x.name) + ' <span class="ses-tag">Battle</span></b><span>' + battleText(x.battle) + ' · ' + RR.notesText(x.practice.notes) + '</span>' +
              '<span class="bt-dots">' + x.battle.teams.map(t => '<i style="--tc:' + t.colour + '" title="' + RR.esc(t.name) + '"></i>').join('') + '</span></span>'
            : '<span class="n">♪</span><span class="t"><b>' + RR.esc(x.name) + '</b><span>' + RR.summary(x.practice) + ' · ' + RR.gameText(x.practice) + '</span></span>') +
          '<span class="s" aria-label="best ' + RR.Scores.levelStars('session:' + x.id) + ' stars">' + RR.starsHtml(RR.Scores.levelStars('session:' + x.id), 3) + '</span></button>' +
          '<button type="button" class="x-btn ed-btn" data-edit-session="' + x.id + '" aria-label="Change ' + RR.esc(x.name) + '" title="Change this session">✎</button>' +
          '<button type="button" class="x-btn" data-unsession="' + x.id + '" aria-label="Delete ' + RR.esc(x.name) + '" title="Delete this session">×</button></div>').join('') +
        '<div class="save-mine"><input type="text" id="new-session" maxlength="40" placeholder="A name for a new session — Week 3, Lines and spaces…">' +
        '<button type="button" class="pill-btn primary" data-act="new-session">+ New session</button>' +
        '<button type="button" class="pill-btn bt-new" data-act="new-battle">⚔️ + New battle</button></div>' +
        (list.length ? '' : RR.note('ses-new', 'Name a session, then choose its notes, rhythms, colours, letters, helps and gold star. It starts as a copy of what is playing now. A battle is a session that teams play in turns, for points.')) + '</div>' +
        RR.note('lv', 'Or pick a level to play it. Each one is a ready-made practice — the other tabs show what is in it, and changing them makes a Custom practice.') +
        RR.BANDS.map(b => '<div class="band" style="--bc:' + b.colour + '"><div class="band-head"><b>' + b.name + ' · ' + b.title + '</b><span>' + b.about + '</span></div>' +
          RR.LEVELS.filter(l => l.band === b.id).map(l => '<button type="button" class="lvl' + (cur.kind === 'level' && l.n === cur.n ? ' on' : '') + '" data-level="' + l.n + '">' +
            '<span class="n">' + l.n + '</span><span class="t"><b>' + l.name + '</b><span>' + RR.summary(l) + '</span></span>' +
            '<span class="s" aria-label="best ' + RR.Scores.levelStars(String(l.n)) + ' stars">' + RR.starsHtml(RR.Scores.levelStars(String(l.n)), 3) + '</span></button>').join('') +
          '</div>').join('');
    },
    /* a session's page: every choice, one page, saved as you go */
    session() {
      const x = G.mode.kind === 'session' && RR.Sessions.get(G.mode.id);
      if (!x) return '';
      const battle = x.kind === 'battle';
      return '<div class="sec ses-head"><h3>' + (battle ? '⚔️ Battle' : 'Session') + '</h3>' +
        '<div class="save-mine"><input type="text" id="session-name" maxlength="40" value="' + RR.esc(x.name) + '" aria-label="The ' + (battle ? 'battle' : 'session') + '’s name" placeholder="A name for this ' + (battle ? 'battle' : 'session') + '">' +
        '<button type="button" class="pill-btn primary" data-act="play-session">▶ Play it</button></div>' +
        RR.note('ses', 'Every melody in this session is made up from what you choose below — new ones each time it is played. Changes save as you go.') + '</div>' +
        (battle ? battlePage() : '') +
        TAB.notes() + TAB.rhythms() +
        '<div class="sec"><h3>How it looks, and the helps</h3>' + TAB.helps() + '</div>' +
        TAB.play() +
        '<div class="sec"><button type="button" class="pill-btn danger" data-act="delete-session">Delete this session…</button></div>';
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
      const s = G.setup, len = RR.roundLen(s.game);
      return '<div class="sec"><h3>The gold star</h3>' +
        RR.note('gold', 'After each melody: a green check when it is played all the way through, and a gold star for a high score. Each melody is worth 1–20 points: 1–8 finding the notes, 9–12 every note first time in a steady beat, 13–20 in time with the metronome.') +
        row('A gold star for', seg('gold', RR.GOLDS.map(g => [g[0], g[1]]), s.gold)) +
        '<p class="note gold-means">' + RR.esc((RR.GOLDS.find(g => g[0] === s.gold) || RR.GOLDS[1])[2]) + '</p></div>' +
        '<div class="sec"><h3>The metronome</h3>' +
        RR.note('ci', 'With the metronome on, a Test starts with a 1 2 3 4 count-in, then the metronome through the melody — nothing shows but the notes lighting as they are played — and rolls on to the next melody, counting in again. The player taps the metronome under the music for Slow, Moderate or Fast; these are the three tempos (Listen plays at them too).') +
        RR.Points.PACES.map((p, i) => '<div class="row"><span class="lbl">' + p.name + ' <small class="pts-range">' + p.lo + '–' + p.hi + ' points</small></span>' +
          '<input type="range" min="40" max="160" step="2" value="' + s.tempos[i] + '" data-range="tempo' + i + '" aria-label="' + p.name + ' tempo"><b id="tempo' + i + '-v">' + s.tempos[i] + ' BPM</b></div>').join('') +
        row('Flash (the notes fade after the count-in)', seg('flash', [['0', 'Off'], ['2', '2 s'], ['3', '3 s'], ['4', '4 s'], ['6', '6 s']], s.flash)) +
        swRow('One go (no starting a Test over)', 'oneGo', s.oneGo) + '</div>' +
        (G.battle ? '' : '<div class="sec"><h3>Game</h3>' + seg('game', [['round', len ? 'Round of ' + len : 'A round'], ['song', 'Song'], ['clock', 'Beat the clock'], ['endless', 'Endless']], len ? 'round' : s.game) +
        (len ? '<div class="row count-row"><span class="lbl">How many melodies</span><div class="stepper" role="group" aria-label="How many melodies">' +
          '<button type="button" data-k="count" data-v="-1" aria-label="One melody fewer"' + (len <= 1 ? ' disabled' : '') + '>−</button>' +
          '<input type="number" id="round-count" min="1" max="' + RR.ROUND_MAX + '" step="1" inputmode="numeric" value="' + len + '" aria-label="How many melodies">' +
          '<button type="button" data-k="count" data-v="1" aria-label="One melody more"' + (len >= RR.ROUND_MAX ? ' disabled' : '') + '>+</button></div></div>' +
          RR.note('cnt', 'Any number from 1 to ' + RR.ROUND_MAX + '. Round done comes after the last one. A level’s stars on the list, and Level n+1 ▸, count rounds of 5 or more.') : '') +
        (s.game === 'song' ? '<div class="picks">' + Object.keys(RR.SONGS).map(id => '<button type="button" data-song="' + id + '" class="' + ((s.song || s.songs[0] || 'hot-cross-buns') === id ? 'on' : '') + '">' + RR.esc(RR.SONGS[id].title) + '</button>').join('') + '</div>' +
          RR.note('sg', 'The song, card by card — and at the end, Hear your song.') : '') +
        (s.game === 'clock' ? '<div class="row">' + seg('clockSecs', [['30', '30 s'], ['60', '60 s'], ['120', '2 min']], s.clockSecs) + '</div>' +
          RR.note('ck', 'As many melodies as you can — no Practice, no metronome. The clock starts with your first note; each melody scores 1–12.') : '') + '</div>') +
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
        '<tr><td>Practice first (Listen, try it, then Test)</td><td>' + sw('practice', s.practice, 'Practice first') + '</td></tr>' +
        '<tr><td>Listen (▶ in Practice)</td><td>' + seg('play', [['shown', 'Yes'], ['hidden', 'No']], s.playHidden ? 'hidden' : 'shown') + '</td></tr>' +
        '<tr><td>Hearing it lights the bars</td><td>' + sw('playLights', s.playLights, 'Hearing it lights the bars') + '</td></tr>' +
        '<tr><td>Grey out the bars not in the music</td><td>' + sw('grey', s.grey, 'Grey out the bars not in the music') + '</td></tr>' +
        '</tbody></table>';
    },
    points() {
      return '<div class="sec">' + swRow('Points', '@points', RR.device.points) +
        RR.note('pt-how', 'Each melody earns 1 to 20. Find the notes: 1–8 (a note right first time counts 1, second time ½). Every note first time, in your own steady beat: 9–12. A Test with the metronome, every note right and in time: Slow 13–15, Moderate 16–18, Fast 19–20 — but a wrong or missed note with the metronome drops it to 1–8. Stars: ★ 1–7 · ★★ 8–12 · ★★★ 13–20.') +
        RR.note('pt', 'With points off there are no numbers anywhere. The lights, sparkles and stars stay.') +
        swRow('Gold stars', '@stars', RR.device.stars) +
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
      const name = G.mode.kind === 'session' ? G.mode.name : G.mode.kind === 'level' ? 'Level ' + G.mode.n : '';
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
  const TABS_SESSION = [['level', 'Level'], ['session', '✎ Session'], ['points', 'Points'], ['sound', 'Sound'], ['share', 'Share']];
  const TABS_BATTLE = [['level', 'Level'], ['session', '⚔️ Battle'], ['points', 'Points'], ['sound', 'Sound']];
  const tabs = () => G.mode.kind === 'lesson' ? TABS_LESSON : G.mode.kind === 'session' ? (G.battle ? TABS_BATTLE : TABS_SESSION) : TABS_ALL;

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
    // a round's length: the Round button keeps the length there was (or 5); − / + and the box set it
    if (k === 'game' && v === 'round') v = 'round' + (RR.roundLen(s.game) || RR.roundLen(RR.device.game) || 5);
    if (k === 'count' || k === 'countSet') {
      const n = k === 'count' ? (RR.roundLen(s.game) || 5) + (+v || 0) : parseInt(v, 10);
      k = 'game'; v = 'round' + Math.max(1, Math.min(RR.ROUND_MAX, isFinite(n) ? n : 5));
    }
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
    else if (['bars', 'flash', 'clockSecs', 'gold'].includes(k)) s[k] = +v;
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
      if (G.mode.kind === 'session') G.markCustom();           // a session keeps its own game
      else if (G.mode.kind !== 'lesson') { RR.device.game = s.game; RR.device.clockSecs = s.clockSecs; RR.device.song = s.song; RR.saveDevice(); }
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
    const tc = t.closest('[data-team-colour]');
    if (tc) {
      const [i, c] = tc.dataset.teamColour.split(':');
      // a colour another team has: the two swap. A name still its colour's ("Blue team") follows the colour
      const recolour = (t, to) => {
        const was = RR.TEAM_COLOURS.find(x => x[0] === t.colour), now = RR.TEAM_COLOURS.find(x => x[0] === to);
        if (was && now && t.name === was[1] + ' team') t.name = now[1] + ' team';
        t.colour = to;
      };
      changeBattle(b => { const j = b.teams.findIndex(x => x.colour === c), mine = b.teams[+i].colour; if (j >= 0 && j !== +i) recolour(b.teams[j], mine); recolour(b.teams[+i], c); });
      render(); return;
    }
    const tr = t.closest('[data-team-remove]');
    if (tr) { changeBattle(b => { if (b.teams.length > 2) b.teams.splice(+tr.dataset.teamRemove, 1); }); render(); return; }
    const bt = t.closest('[data-bt]');
    if (bt) {
      changeBattle(b => {
        if (bt.dataset.bt === 'per') b.per = +bt.dataset.v;
        else b.rounds = Math.max(1, Math.min(RR.BATTLE_ROUNDS_MAX, b.rounds + (+bt.dataset.v || 0)));
      });
      render(); return;
    }
    const ss = t.closest('[data-session]');
    if (ss) { G.selectSession(ss.dataset.session); render(); return; }
    const es = t.closest('[data-edit-session]');
    if (es) { if (G.selectSession(es.dataset.editSession)) { tab = 'session'; render(); $('#tab-body').scrollTop = 0; } return; }
    const us = t.closest('[data-unsession]');
    if (us) { await deleteSession(us.dataset.unsession); return; }
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
    } else if (a === 'new-session') {
      const name = ($('#new-session').value || '').trim().slice(0, 40);
      if (!name) { $('#new-session').focus(); RR.toast('Give the session a name first'); return; }
      // a copy of what is playing (a melody set laid over it, and tricky notes, stay the browser's)
      const rec = RR.Sessions.add(name, G.setup);
      G.selectSession(rec.id);
      tab = 'session'; render(); $('#tab-body').scrollTop = 0;
      RR.toast('“' + rec.name + '” is in My sessions');
    } else if (a === 'new-battle') {
      const name = ($('#new-session').value || '').trim().slice(0, 40);
      if (!name) { $('#new-session').focus(); RR.toast('Give the battle a name first'); return; }
      // a copy of what is playing — straight to the Test (a battle is for points), two teams to start
      const p = RR.clone(G.setup); p.practice = false;
      const rec = RR.Sessions.add(name, p, { teams: [], per: 1, rounds: 3 });
      G.selectSession(rec.id);
      tab = 'session'; render(); $('#tab-body').scrollTop = 0;
      const f = body.querySelector('.bt-name'); if (f) { f.focus(); f.select(); }
      RR.toast('Name the teams and pick their colours');
    } else if (a === 'add-team') {
      changeBattle(b => { if (b.teams.length < 4) { const c = RR.freeColour(b.teams); b.teams.push({ name: c[1] + ' team', colour: c[0] }); } });
      render();
      const all = body.querySelectorAll('.bt-name'), f = all[all.length - 1]; if (f) { f.focus(); f.select(); }
    } else if (a === 'play-session') {
      close();
    } else if (a === 'delete-session') {
      await deleteSession(G.mode.id);
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
  /* a session deleted: if it was playing, what it was carries on as Custom */
  async function deleteSession(id) {
    const x = RR.Sessions.get(id); if (!x) return;
    if (!(await RR.ask('Delete the session “' + x.name + '”? Its best scores go too.', 'Delete'))) return;
    RR.Sessions.remove(id);
    if (G.mode.kind === 'session' && G.mode.id === id) {
      G.mode = { kind: 'custom', from: x.name };
      RR.device.practice = { kind: 'custom', from: x.name, practice: G.setup }; RR.saveDevice();
      tab = 'level';
    }
    G.drawChips(); render();
  }

  // the number of melodies, typed: taken when the box is left (or Enter)
  body.addEventListener('change', e => {
    if (e.target.id === 'round-count') { change('countSet', e.target.value); render(); }
    if (e.target.id === 'battle-rounds') {
      const n = parseInt(e.target.value, 10);
      changeBattle(b => { b.rounds = Math.max(1, Math.min(RR.BATTLE_ROUNDS_MAX, isFinite(n) ? n : b.rounds)); });
      render();
    }
    if (e.target.matches('.bt-name')) render();         // a name left empty becomes its colour's name
  });
  body.addEventListener('input', e => {
    if (e.target.matches('.bt-name')) { const i = +e.target.dataset.teamName; changeBattle(b => { b.teams[i].name = e.target.value; }); return; }
    if (e.target.id === 'session-name' && G.mode.kind === 'session') {     // renamed as you type
      if (RR.Sessions.rename(G.mode.id, e.target.value)) { G.mode.name = e.target.value.trim().slice(0, 40); G.drawChips(); $('#custom-tag').textContent = G.modeLabel(); }
      return;
    }
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
    if (e.key === 'Enter' && e.target.id === 'new-session') { e.preventDefault(); body.querySelector('[data-act="new-session"]').click(); }
    if (e.key === 'Enter' && e.target.id === 'session-name') { e.preventDefault(); e.target.blur(); }
    if (e.key === 'Enter' && (e.target.id === 'round-count' || e.target.id === 'battle-rounds' || e.target.matches('.bt-name'))) { e.preventDefault(); e.target.blur(); }
    if (e.key === 'Enter' && e.target.id === 'player-name') { e.preventDefault(); body.querySelector('[data-act="add-player"]').click(); }
  });
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; body.scrollTop = 0; render(); } });

  RR.Settings = { open, close, render, isOpen: () => !$('#settings').hidden };
})();

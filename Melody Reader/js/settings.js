/* ==========================================================================
   Melody Reader — settings.js
   --------------------------------------------------------------------------
   RR.Settings — one window, tabs down the side (across the top on a phone):
   ✎ (the page of what is chosen) · Points · Sound (the Level and Share
   tabs went into the Library on 2026-10-12).

   The ✎ page (2026-10-06 for sessions; 2026-10-08 for the levels too —
   the user's ask) — every choice on one page: Choose the Notes · Choose
   the Rhythm · Look & Feel · Format · Melody Source. It saves as you go
   into what is chosen: a session itself, or a level as your own Level n
   (Reset gives it back as made) — never Custom any more. Helps change the
   card at once; notes, rhythms and the rest take effect on the next card,
   which comes when the window closes; a new format or source starts a new
   round. The page shows the level's or session's own settings; anything
   played just this time on top (a format card, a set from My melodies,
   tricky notes) is said at its top, with Play its own.

   My sessions (2026-10-05) head the Level tab: + New session names one
   (a copy of what is chosen) and opens its page; a level's ✎ opens its.

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


  /* the practice the ✎ page shows and changes: the level's, session's (…) own — never what is played just this time.
     Or a draft: the home page's Generate window (2026-10-08) shows the same Choose the Notes and Choose the
     Rhythm sections on a practice of its own, which nothing saves until its ▶ Play */
  let draft = null;
  const P = () => draft || G.base || G.setup;

  /* Melody Source: Generated · My Melodies (one of your sets — the level's or session's own since 2026-10-08,
     saved with it) · Songbook (the songs whose notes are all in the practice). A battle: Generated or My
     Melodies only (its melodies are planned fair for every team). Levels' old "made up + Songbook" shows as
     Generated */
  function sourceHtml(s) {
    const cur = s.from === 'set' ? 'set' : s.from === 'songbook' && !G.battle ? 'songbook' : 'made';
    const opts = [['made', 'Generated'], ['set', 'My Melodies']].concat(G.battle ? [] : [['songbook', 'Songbook']]);
    const sets = RR.Sets.list().filter(x => x.melodies.length);
    let h = seg('from', opts, cur);
    if (cur === 'set') {
      const gone = !s.set || !sets.some(x => x.id === s.set);
      if (gone) h += '<p class="note warn">' + (s.set ? 'That set isn’t here any more — pick one. ' : 'Pick a set. ') + 'Until then the melodies are made up.</p>';
      if (sets.length) h += '<div class="picks">' + sets.map(x => '<button type="button" data-k="set" data-v="' + x.id + '" class="' + (s.set === x.id ? 'on' : '') + '" aria-pressed="' + (s.set === x.id) + '">' + RR.esc(x.title) + (x.received ? ' ·  shared' : '') + '</button>').join('') + '</div>';
    }
    return h + '<div class="row"><button type="button" class="pill-btn" data-act="melodies">Open My Melodies…</button></div>';
  }
  /* Format: Song — the Songbook's songs and the My melodies sets, any number, played in the order picked */
  function songPicksHtml(s) {
    const picks = G.songPicks(s), at = id => picks.indexOf(id);
    const btn = (id, title) => '<button type="button" data-songpick="' + RR.esc(id) + '" class="' + (at(id) >= 0 ? 'on' : '') + '" aria-pressed="' + (at(id) >= 0) + '">' +
      (at(id) >= 0 ? '<b class="ord">' + (at(id) + 1) + '</b>' : '') + RR.esc(title) + '</button>';
    const sets = RR.Sets.list().filter(x => x.melodies.length);
    return '<div class="picks song-picks">' + Object.keys(RR.SONGS).map(id => btn(id, RR.SONGS[id].title)).join('') + '</div>' +
      (sets.length ? '<div class="picks-head">My Melodies</div><div class="picks song-picks">' + sets.map(x => btn('set:' + x.id, x.title)).join('') + '</div>' : '');
  }

  /* ---- three questions that each set two of a practice's fields (2026-10-06, the user's wording) ---- */
  const barText = s => s.letters && s.nums ? 'both' : s.letters ? 'letters' : s.nums ? 'numbers' : 'neither';
  const practiceMode = s => !s.practice ? 'disabled' : s.practiceStart === 'off' ? 'off' : 'on';
  const playMode = s => s.playHidden ? 'off' : s.playLights ? 'anim' : 'sound';

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
      row('Tools', '<div class="seg" role="group">' + [[true, 'On'], [false, 'Off']].map(([v, w]) => '<button type="button" data-bt="tools" data-v="' + v + '" class="' + (b.tools === v ? 'on' : '') + '" aria-pressed="' + (b.tools === v) + '">' + w + '</button>').join('') + '</div>') +
      '<p class="note bt-sum">' + b.teams.length + ' teams × ' + b.per + (b.per === 1 ? ' melody' : ' melodies') + ' × ' + b.rounds + (b.rounds === 1 ? ' round' : ' rounds') + ' = <b>' + total + ' melodies</b></p>' +
      RR.note('bt-how', 'Each team plays its melodies, then the next team has a turn; when every team has had one, that is a round. Points go to the team playing. Changing the teams, the melodies a turn or the rounds starts the battle again. Tools Off takes the Tools button away while the battle plays (the colours, names under the notes, the computer keyboard); the metronome stays beside the music.') + '</div>';
  }
  /* change the battle being played: saved at once; the names and colours show at once */
  function changeBattle(fn) {
    if (!G.battle || G.mode.kind !== 'session') return;
    const b = RR.clone(G.battle);
    fn(b);
    const saved = RR.Sessions.updateBattle(G.mode.id, b);
    if (saved) G.setBattle(saved);
  }

  /* ---- a session's Format (2026-10-12, the user's: "under format it will include practice, rounds, songs, games,
     and Battle — and depending on what they pick, more appropriate choices will be given"). It comes first on
     the page now, since it decides what the rest is: Practice — which lesson, song or exercise; Rounds — how
     many melodies; Songs — which song, the whole of it or a section; Games — Beat the Clock or Endless; Battle
     — the teams, turns and rounds. Then Points, which the format sets (off for Practice and Songs, on for the
     rest) and can be changed any time. Rounds, Games and Battle go on to the notes, rhythms, look and source;
     Practice and Songs play what they picked, the way their home cards do ---- */
  const FORMAT_ABOUT = {
    practice: 'One of Practice’s lessons, songs or exercises — big, round and round, its lines lit. A check for each melody, a gold star with the metronome.',
    rounds: 'A round of new melodies made from the notes and rhythms below, for points.',
    songs: 'A song, slide after slide — the whole of it or a section — keeping a steady beat all the way through.',
    games: 'How many melodies can you read? Beat the Clock, or Endless.',
    battle: 'Teams take turns at the xylophone, for points.'
  };
  let ptab = null;                            // Practice's pick: the tab showing (Lessons · Songs · Exercises)
  const teachTab = id => RR.teachTabOf(id);
  function practicePick(x) {
    const tab = ptab || teachTab(x.teach.id), us = RR.teachExercises();
    const tabs = [['lessons', 'Lessons'], ['songs', 'Songs'], ['exercises', 'Exercises']];
    const list = tab === 'lessons' ? RR.teachLessons() : tab === 'songs' ? RR.teachSongs() : us;
    return '<h4 class="sf-q">What to practise</h4><div class="seg sf-tabs" role="group" aria-label="What to practise">' + tabs.map(t => '<button type="button" data-stab="' + t[0] + '" class="' + (tab === t[0] ? 'on' : '') + '" aria-pressed="' + (tab === t[0]) + '">' + t[1] + '</button>').join('') + '</div>' +
      '<div class="tw-levels"><div class="teach-grid in-ses' + (tab === 'lessons' ? '' : ' units') + '">' + list.map(L => RR.Teach.tileHtml(L, 'st', x.teach.id)).join('') + '</div></div>' +
      (tab === 'exercises' && !us.length ? '<p class="note">No exercises yet — a melody set of yours becomes one: Library → My melodies → a set → ▶ Practice.</p>' : '');
  }
  function songPick(x) {
    const s = x.song, all = RR.teachSongs().concat(RR.Sets.list().filter(y => y.melodies.length && !/^lesson/.test(y.id) && !RR.Sets.copyOf(y)).map(y => RR.teachLevel('M:' + y.id)).filter(Boolean));
    const L = RR.teachLevel(s.id), n = L ? L.ex.length : 0;
    const row = y => '<button type="button" class="mc-row' + (y.id === s.id ? ' on' : '') + '" data-ss="song" data-id="' + RR.esc(y.id) + '" aria-pressed="' + (y.id === s.id) + '">' +
      '<b>' + (y.kind === 'song' ? '♪ ' : '♫ ') + RR.esc(y.title) + '</b><span class="mc-n">' + y.ex.length + (y.ex.length === 1 ? ' slide' : ' slides') + '</span></button>';
    const opts = v => Array.from({ length: n }, (_, i) => '<option value="' + i + '"' + (i === v ? ' selected' : '') + '>' + (i + 1) + '</option>').join('');
    const ssg = (k, list, cur) => '<div class="seg" role="group">' + list.map(([v, w]) => '<button type="button" data-ss="' + k + '" data-v="' + v + '" class="' + (cur === v ? 'on' : '') + '" aria-pressed="' + (cur === v) + '">' + w + '</button>').join('') + '</div>';
    const what = !L ? '' : '<div class="row"><span class="lbl">What to play</span>' + ssg('part', [['whole', 'The whole song'], ['part', 'A section']], s.part ? 'part' : 'whole') +
      (s.part ? '<span class="sw-range"><label>Slide <select id="ses-from" aria-label="From slide">' + opts(Math.min(s.from, n - 1)) + '</select></label>' +
        '<label>to <select id="ses-to" aria-label="To slide">' + opts(Math.min(s.to, n - 1)) + '</select></label></span>' : '') + '</div>';
    return '<h4 class="sf-q">Which song</h4><div class="mc-list sf-songs">' + all.map(row).join('') + '</div>' + what +
      '<div class="row"><span class="lbl">Practice</span>' + ssg('practice', [['false', 'Off'], ['true', 'On']], String(s.practice)) + '</div>' +
      '<div class="row"><span class="lbl">Auto-Next Slide</span>' + ssg('auto', [['true', 'On'], ['false', 'Off']], String(s.auto)) + '</div>';
  }
  function formatHtml(x) {
    const f = x.format, s = P(), len = RR.roundLen(s.game);
    let h = '<div class="sec ses-format"><h3>Format</h3><div class="seg sf-seg" role="group" aria-label="Format">' + RR.SESSION_FORMATS.map(o =>
      '<button type="button" data-sf="' + o[0] + '" class="' + (f === o[0] ? 'on' : '') + '" aria-pressed="' + (f === o[0]) + '">' + (o[0] === 'battle' ? '⚔️ ' : '') + o[1] + '</button>').join('') + '</div>' +
      '<p class="note sf-about">' + FORMAT_ABOUT[f] + '</p>';
    if (f === 'practice') h += practicePick(x);
    else if (f === 'songs') h += songPick(x);
    else if (f === 'rounds') h += '<div class="row count-row"><span class="lbl">How many melodies</span><div class="stepper" role="group" aria-label="How many melodies">' +
      '<button type="button" data-k="count" data-v="-1" aria-label="One melody fewer"' + (len <= 1 ? ' disabled' : '') + '>−</button>' +
      '<input type="number" id="round-count" min="1" max="' + RR.ROUND_MAX + '" step="1" inputmode="numeric" value="' + (len || 5) + '" aria-label="How many melodies">' +
      '<button type="button" data-k="count" data-v="1" aria-label="One melody more"' + (len >= RR.ROUND_MAX ? ' disabled' : '') + '>+</button></div></div>';
    else if (f === 'games') h += row('Which game', seg('game', [['clock', 'Beat the Clock'], ['endless', 'Endless']], s.game === 'endless' ? 'endless' : 'clock')) +
      (s.game !== 'endless' ? row('How long', seg('clockSecs', [['30', '30 s'], ['60', '60 s'], ['120', '2 min']], s.clockSecs)) : '');
    h += '<div class="row sf-points"><span class="lbl">Points</span><div class="seg" role="group" aria-label="Points">' + [[true, 'On'], [false, 'Off']].map(([v, w]) =>
      '<button type="button" data-spts="' + v + '" class="' + (x.points === v ? 'on' : '') + '" aria-pressed="' + (x.points === v) + '">' + w + '</button>').join('') + '</div></div>' +
      RR.note('sf-pts', 'Choosing a format sets the points: off for Practice and Songs, on for Rounds, Games and Battles. Change it any time — the session keeps what you choose.' +
        (f === 'practice' || f === 'songs' ? ' (Practice and Songs don’t count points yet, so On shows nothing there.)' : '')) + '</div>';
    if (f === 'battle') h += battlePage();
    return h;
  }

  const TAB = {
    /* a session's (or a battle's) page — every choice on one page, saved as you go; laid out by the user (2026-10-06):
       Name + Play · Choose the Notes · Choose the Rhythm · Look & Feel · Format · Melody Source.
       2026-10-12: Format first (above), with Points; Melody Source after Look & Feel */
    /* …and a level's (2026-10-08, the user's ask): the same page, its changes kept for that level */
    session() {
      const m = G.mode, sid = G.sessionId();
      let head;
      if (sid) {
        const x = RR.Sessions.get(sid);
        if (!x) return '';
        const what = x.format === 'battle' ? 'Battle' : 'Session';
        head = '<div class="ses-row"><label for="session-name">' + what + ' Name:</label>' +
          '<input type="text" id="session-name" maxlength="40" value="' + RR.esc(x.name) + '" placeholder="A name for this ' + what.toLowerCase() + '">' +
          '<button type="button" class="pill-btn primary" data-act="play-session">▶ Play ' + what + '</button></div>';
        const over = G.overWords();
        const overHtml = m.kind === 'session' && over.length ? '<div class="over-note"><span>Playing just this time: ' + over.map(o => '<b>' + RR.esc(o.text) + '</b>').join(' · ') +
          '. Below are its own settings.</span><button type="button" class="h-link" data-act="over-off">Play its own</button></div>' : '';
        const own = x.format === 'rounds' || x.format === 'games' || x.format === 'battle';
        return '<div class="sec ses-head">' + head + overHtml + '</div>' + formatHtml(x) +
          (own && m.kind === 'session' ? TAB.notes() + TAB.rhythms() + TAB.helps() + '<div class="sec"><h3>Melody Source</h3>' + sourceHtml(P()) + '</div>' : '');
      } else if (m.kind === 'level') {
        const ed = RR.LevelEdits.edited(m.n);
        head = '<div class="ses-row"><span class="lv-title"><i class="band-dot" style="--band:' + RR.bandOf(m.n).colour + '"></i>Level ' + m.n + ' · ' + RR.esc(RR.LEVELS[m.n - 1].name) +
          (ed ? ' <span class="ses-tag ed-tag">Yours</span>' : '') + '</span>' +
          '<button type="button" class="pill-btn primary" data-act="play-session">▶ Play Level ' + m.n + '</button></div>' +
          '<p class="note lv-about">' + (ed ? 'Your own Level ' + m.n + ': it plays this way every time you pick it. ' : 'Change anything below and Level ' + m.n + ' keeps it — it plays your way every time you pick it. ') +
          (ed ? '<button type="button" class="h-link" data-act="reset-level">↺ Reset to the original Level ' + m.n + '</button>' : '') + '</p>';
      } else if (m.kind === 'custom') {
        head = '<div class="ses-row"><span class="lv-title">' + RR.esc(G.modeLabel()) + '</span>' +
          '<button type="button" class="pill-btn primary" data-act="play-session">▶ Play</button></div>';
      } else return '';
      // what is played just this time, on top of these settings — said, with a way to stop it
      const over = G.overWords();
      const overHtml = over.length ? '<div class="over-note"><span>Playing just this time: ' + over.map(o => '<b>' + RR.esc(o.text) + '</b>').join(' · ') +
        '. Below are ' + (m.kind === 'level' ? 'Level ' + m.n + '’s' : 'its') + ' own settings.</span><button type="button" class="h-link" data-act="over-off">Play its own</button></div>' : '';
      return '<div class="sec ses-head">' + head + overHtml + '</div>' +
        (G.battle ? battlePage() : '') +
        TAB.notes() + TAB.rhythms() + TAB.helps() + TAB.play();
    },
    notes() {
      const s = P();
      return '<div class="sec"><h3>Choose the Notes</h3>' +
        '<div class="notes-pick">' + RR.Eng.picker(s.notes) +
        '<div class="pick-xylo">' + RR.BARS.map(b => '<button type="button" data-note="' + b.id + '" class="' + (s.notes.includes(b.id) ? '' : 'off') + '" style="--c:' + b.colour + ';--len:' + (b.len * 0.8) + '%" aria-pressed="' + s.notes.includes(b.id) + '" aria-label="' + b.id + '">' + b.letter + '</button>').join('') + '</div></div>' +
        row('Melodic Difficulty', seg('moves', [['steps', 'Steps'], ['skips', 'Steps and skips'], ['leaps', 'Leaps too']], s.moves)) +
        // which leaps (2026-10-07): a 4th, a 5th, a major 6th — any two of them in one melody
        (s.moves === 'leaps' ? row('Leaps of a', '<div class="seg" role="group" aria-label="Which leaps">' + [['P4', '4th'], ['P5', '5th'], ['M6', 'Major 6th']].map(o =>
          '<button type="button" data-leap="' + o[0] + '" class="' + (s.leaps.includes(o[0]) ? 'on' : '') + '" aria-pressed="' + s.leaps.includes(o[0]) + '">' + o[1] + '</button>').join('') + '</div>') : '') + '</div>';
    },
    /* the cells for the meters chosen (2/4 3/4 4/4 share theirs; 6/8 has its own), the meters — any of them:
       each melody uses one — Pick-ups, the length */
    rhythms() {
      const s = P(), kinds = s.times.map(t => RR.meter(t).compound ? 'compound' : 'simple');
      const cellBtn = c => {
        const time = c.meter === 'compound' ? [c.len / 2, 8] : [Math.max(1, c.len / 4), 4];   // beamed as its meter beams it
        const pic = RR.Eng.render({ time, notes: c.ticks.map(t => t < 0 ? { p: null, t: -t } : { p: 'A4', t }) }, { ss: 6.5, bare: true, colour: 'black', labels: 'none', maxStretch: 1 }).svg;
        return '<button type="button" class="cell' + (s.rhythms.includes(c.id) ? ' on' : '') + '" data-cell="' + c.id + '" aria-pressed="' + s.rhythms.includes(c.id) + '"><span class="pic">' + pic + '</span><b>' + c.name + '</b><small>' + c.about + '</small></button>';
      };
      const has = t => s.times.some(x => x[0] === t[0] && x[1] === t[1]);
      return '<div class="sec"><h3>Choose the Rhythm</h3>' +
        (kinds.includes('simple') ? '<div class="cells">' + RR.Melody.CELLS.filter(c => c.meter === 'simple').map(cellBtn).join('') + '</div>' : '') +
        (kinds.includes('compound') ? '<div class="picks-head">In 6/8</div><div class="cells">' + RR.Melody.CELLS.filter(c => c.meter === 'compound').map(cellBtn).join('') + '</div>' : '') +
        row('Time', '<div class="seg" role="group" aria-label="Time (each melody uses one)">' + RR.METERS.map(t => '<button type="button" data-meter="' + RR.meterText(t) + '" class="' + (has(t) ? 'on' : '') + '" aria-pressed="' + has(t) + '">' + RR.meterText(t) + '</button>').join('') + '</div>') +
        swRow('Pick-ups (some melodies start before the first beat)', 'pickup', s.pickup) +
        row('Length', seg('bars', [['1', '1 bar'], ['2', '2 bars']], s.bars)) + swRow('End on a long note', 'endLong', s.endLong) + '</div>';
    },
    /* Format: Rounds (how many) · Song (the songs and My melodies sets to play, any number of them) · Beat the Clock · Endless;
       then — not for a Song — Melody Source */
    play() {
      const s = P(), len = RR.roundLen(s.game);
      return (G.battle ? '' : '<div class="sec"><h3>Format</h3>' + seg('game', [['round', 'Rounds'], ['song', 'Song'], ['clock', 'Beat the Clock'], ['endless', 'Endless']], len ? 'round' : s.game) +
        (len ? '<div class="row count-row"><span class="lbl">How many melodies</span><div class="stepper" role="group" aria-label="How many melodies">' +
          '<button type="button" data-k="count" data-v="-1" aria-label="One melody fewer"' + (len <= 1 ? ' disabled' : '') + '>−</button>' +
          '<input type="number" id="round-count" min="1" max="' + RR.ROUND_MAX + '" step="1" inputmode="numeric" value="' + len + '" aria-label="How many melodies">' +
          '<button type="button" data-k="count" data-v="1" aria-label="One melody more"' + (len >= RR.ROUND_MAX ? ' disabled' : '') + '>+</button></div></div>' : '') +
        (s.game === 'song' ? songPicksHtml(s) : '') +
        (s.game === 'clock' ? '<div class="row">' + seg('clockSecs', [['30', '30 s'], ['60', '60 s'], ['120', '2 min']], s.clockSecs) + '</div>' : '') + '</div>') +
        (s.game === 'song' && !G.battle ? '' : '<div class="sec"><h3>Melody Source</h3>' + sourceHtml(s) + '</div>');
    },
    helps() {
      const s = P();
      return '<div class="sec"><h3>Look &amp; Feel</h3><table class="helps"><tbody>' +
        '<tr><td>Note Colors</td><td>' + seg('colour', [['solid', 'Solid Color'], ['always', 'Transparent Color'], ['lit', 'When Played'], ['black', 'Black']], s.colour) + '</td></tr>' +
        '<tr><td>Staff Color</td><td>' + seg('staff', [['notes', 'Its Notes’ Lines'], ['all', 'All Lines'], ['plain', 'Black']], s.staff || 'plain') + '</td></tr>' +
        '<tr><td>Xylophone Bar</td><td>' + seg('barText', [['letters', 'Letter Name'], ['numbers', 'Number'], ['both', 'Both'], ['neither', 'Neither']], barText(s)) + '</td></tr>' +
        '<tr><td>Xylophone hint</td><td>' + seg('glow', [['never', 'Never'], ['after2', 'After 2 slips'], ['always', 'Always']], s.glow) + '</td></tr>' +
        '<tr><td>Grey out unused bars</td><td>' + seg('grey', [['true', 'On'], ['false', 'Off']], String(!!s.grey)) + '</td></tr>' +
        '<tr><td>Text below the notes</td><td>' + seg('labels', [['letters', 'Letter Name'], ['solfege', 'Solfege Name'], ['none', 'Nothing']], s.labels) + '</td></tr>' +
        '<tr><td>Practice</td><td>' + seg('practiceMode', [['on', 'On (default)'], ['off', 'Off (default)'], ['disabled', 'Disabled']], practiceMode(s)) + '</td></tr>' +
        '<tr><td>Play button</td><td>' + seg('playMode', [['anim', 'Animates music and bars'], ['sound', 'Plays sounds only'], ['off', 'Disabled']], playMode(s)) + '</td></tr>' +
        // the metronome's sound (2026-10-13, the user's: "the metronome choice of click or drum beat") — Tools has it too
        '<tr><td>Metronome</td><td>' + seg('beat', [['click', 'Click'], ['drums', 'Drum beat']], s.beat === 'drums' ? 'drums' : 'click') +
          (s.beat === 'drums' && RR.METERS.some(t => !RR.Drums.has(t)) ? '<p class="note">No drum beat yet for ' + RR.METERS.filter(t => !RR.Drums.has(t)).map(RR.meterText).join(', ') + ' — those click.</p>' : '') + '</td></tr>' +
        '<tr><td>Auto-Progress to next melody</td><td>' + seg('auto', [['true', 'On'], ['false', 'Off']], String(!!s.auto)) + '</td></tr>' +
        '</tbody></table></div>';
    },
    points() {
      return '<div class="sec">' + swRow('Points', '@points', RR.device.points) +
        RR.note('pt-how', 'Each melody earns 1 to 20 — the same with the metronome or without it. Every note right first time, in rhythm: by your tempo — about 100 BPM or faster up to 20, 70 to 100 up to 17, slower than 70 up to 15 (a point or two less when the rhythm is looser). In rhythm with a wrong bar: 2 points off for each. Every note right but not in rhythm: 8. Not in rhythm, with wrong bars: the notes — a note right first time counts 1, second time ½ (1–8). Stars: ★ 1–7 · ★★ 8–12 · ★★★ 13–20.') +
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
    leave() {
      return '<div class="sec"><h3>' + RR.esc(G.modeLabel()) + '</h3>' + RR.note('lsn', 'This came from a lesson link. Leave the lesson to choose your own levels, lessons and songs again.') +
        '<button type="button" class="pill-btn primary" data-act="leave">Leave the lesson</button></div>';
    }
  };
  /* a level has a ✎ page like a session's now (2026-10-08) — the old Notes · Rhythm · Format · Look & Feel
     tabs were the same sections, and changing them made a Custom practice */
  const TABS_LESSON = [['leave', 'Lesson'], ['points', 'Points'], ['sound', 'Sound']];
  const pageName = () => G.battle ? '⚔️ Battle' : G.sessionId() ? '✎ Session' : G.mode.kind === 'level' ? '✎ Level ' + G.mode.n : G.mode.gen ? '✎ Generated' : G.mode.label ? '✎ My Melodies' : '✎ Custom';
  /* the Level tab (the sessions and the levels) and the Share tab moved into the Library on 2026-10-12 (the user's:
     the ♫ and the gear became one Library). Practice and Songs have nothing of their own to change — unless a
     session plays that way: then its page */
  const tabs = () => G.inLesson() ? TABS_LESSON
    : (G.mode.kind !== 'teach' || G.sessionId() ? [['session', pageName()]] : []).concat([['points', 'Points'], ['sound', 'Sound']]);
  const OLD_TABS = ['notes', 'rhythms', 'play', 'helps'];

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
    if (which) tab = OLD_TABS.includes(which) ? 'session' : which;
    ptab = null;
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
    settle();
  }
  /* what was changed takes effect: a new round, or the next melody (also when the top drop-down closes) */
  function settle() {
    if (G.roundChanged) { G.roundChanged = false; G.contentChanged = false; G.queue = []; G.newRound(); }
    else if (G.contentChanged) { G.contentChanged = false; G.queue = []; if (G.battle) G.replanBattle(); G.nextCard(); }
  }

  const CONTENT = ['notes', 'rhythms', 'time', 'times', 'pickup', 'leaps', 'bars', 'moves', 'endDo', 'endLong', 'from', 'set'];
  const ROUND = ['game', 'clockSecs', 'song', 'songPicks'];
  /* a change on the ✎ page goes into the level's or session's own settings (G.base) and is saved there
     (G.saveSetup) — a level keeps it as your Level n, a session as itself (2026-10-08). Anything played
     just this time that the change is about (a format card's format, a set from My melodies) ends, so
     what plays is what the page says */
  function change(k, v) {
    const s = P();
    // a round's length: the Round button keeps the length there was (or 5); − / + and the box set it
    if (k === 'game' && v === 'round') v = 'round' + (RR.roundLen(s.game) || 5);
    if (k === 'count' || k === 'countSet') {
      const n = k === 'count' ? (RR.roundLen(s.game) || 5) + (+v || 0) : parseInt(v, 10);
      k = 'game'; v = 'round' + Math.max(1, Math.min(RR.ROUND_MAX, isFinite(n) ? n : 5));
    }
    if (k[0] === '@') {                        // the browser's own: points, stars, celebrations, the sound
      if (k === '@points') { RR.device.points = v; const sid = G.sessionId(); if (sid) RR.Sessions.setPoints(sid, v); }   // a session keeps its own (2026-10-12)
      else if (k === '@stars') RR.device.stars = v;
      else if (k === '@celebrate') RR.device.celebrate = v;
      else if (k === '@voice') RR.Sound.voice = v;
      else if (k === '@volume') RR.Sound.volume = +v;
      RR.saveDevice(); G.drawChips(); return;
    }
    // Song: the songs to play, any number (at least one), in the order picked
    if (k === 'songPick') {
      const list = G.songPicks(s).slice(), i = list.indexOf(v);
      if (i >= 0) { if (list.length > 1) list.splice(i, 1); } else list.push(v);
      k = 'songPicks'; v = list;
    }
    // My Melodies as the source: the set picked (or the first there is); none yet — write one first
    if (k === 'from' && v === 'set') {
      const sets = RR.Sets.list().filter(x => x.melodies.length);
      if (!sets.length) { close(); RR.Melodies.open(); RR.toast('Write a melody set first — + New set'); return; }
      if (!sets.some(x => x.id === s.set)) s.set = sets[0].id;
    }
    if (k === 'set') { s.from = 'set'; s.set = v; }
    else if (k === 'time') { s.time = [+v, 4]; s.times = [s.time.slice()]; }
    else if (k === 'times') { s.times = v; s.time = v[0].slice(); }
    else if (['bars', 'flash', 'clockSecs', 'gold'].includes(k)) s[k] = +v;
    else if (k === 'auto') s.auto = v === 'true' || v === true;
    else if (k === 'grey') s.grey = v === 'true' || v === true;
    else if (k === 'barText') { s.letters = v === 'letters' || v === 'both'; s.nums = v === 'numbers' || v === 'both'; }
    else if (k === 'practiceMode') { s.practice = v !== 'disabled'; s.practiceStart = v === 'off' ? 'off' : 'on'; }
    else if (k === 'playMode') { s.playHidden = v === 'off'; s.playLights = v === 'anim'; }
    else s[k] = v;
    if (draft) return;                       // the Generate window's: nothing is playing it yet
    // what was played just this time and is now the page's to say
    if (ROUND.includes(k)) { delete G.over.game; if (s.game === 'song') delete G.over.set; }
    if (k === 'from' || k === 'set') delete G.over.set;
    G.compose();
    G.saveSetup();
    if (ROUND.includes(k) || k === 'from' || k === 'set') G.roundChanged = true;
    if (CONTENT.includes(k)) G.contentChanged = true;
    if (k === 'practiceMode' || k === 'playMode' || k === 'labels') {
      RR.Beat.stop(); G.stopHear(true);
      const p = G.setup;
      G.resetCard(k === 'practiceMode' ? (p.practice && !G.clock && p.practiceStart !== 'off' ? 'practice' : 'game') : undefined);
    }
    G.applyInstrument();
    G.draw();
  }


  /* a click on one of the practice's own controls (the notes, the rhythms, the segments and switches):
     true when it was one — the caller draws the page again */
  function editClick(t) {
    const sg = t.closest('[data-k]');
    if (sg) { change(sg.dataset.k, sg.dataset.v); return true; }
    const tg = t.closest('[data-toggle]');
    if (tg) {
      const k = tg.dataset.toggle;
      const cur = k === '@points' ? RR.device.points : k === '@stars' ? RR.device.stars : k === '@celebrate' ? RR.device.celebrate : P()[k];
      change(k, !cur); return true;
    }
    const nt = t.closest('[data-note]');
    if (nt) {
      const id = nt.dataset.note, s = P();
      let notes = s.notes.slice();
      if (notes.includes(id)) { if (notes.length > 1) notes = notes.filter(x => x !== id); } else notes.push(id);
      change('notes', notes); return true;
    }
    // a meter on or off (at least one stays on); a leap on or off (at least one stays on)
    const mt = t.closest('[data-meter]');
    if (mt) {
      const [a, b] = mt.dataset.meter.split('/').map(Number), s = P();
      const on = s.times.some(x => x[0] === a && x[1] === b);
      let ts = on ? s.times.filter(x => !(x[0] === a && x[1] === b)) : s.times.concat([[a, b]]);
      if (!ts.length) return true;
      ts = RR.METERS.filter(m => ts.some(x => x[0] === m[0] && x[1] === m[1])).map(m => m.slice());
      // 6/8 turned on with none of its rhythms yet: its two plainest come with it
      if (a === 6 && !on && !s.rhythms.some(id => RR.Melody.CELL[id].meter === 'compound' && !RR.Melody.CELL[id].rest)) s.rhythms = s.rhythms.concat(['c3', 'cdq']);
      if (!(a === 6) && !on && !s.rhythms.some(id => RR.Melody.CELL[id].meter === 'simple' && !RR.Melody.CELL[id].rest)) s.rhythms = s.rhythms.concat(['q', 'ee']);
      change('times', ts); return true;
    }
    const lp = t.closest('[data-leap]');
    if (lp) {
      const s = P(), id = lp.dataset.leap;
      const list = s.leaps.includes(id) ? s.leaps.filter(x => x !== id) : Object.keys(RR.Melody.LEAPS).filter(x => x === id || s.leaps.includes(x));
      if (list.length) change('leaps', list);
      return true;
    }
    const pk = t.closest('[data-pick]');
    if (pk) { change('notes', pk.dataset.pick.split(',')); return true; }
    const so = t.closest('[data-songpick]');
    if (so) { change('songPick', so.dataset.songpick); return true; }
    const cl = t.closest('[data-cell]');
    if (cl) {
      const id = cl.dataset.cell, s = P(), CELL = C();
      let r = s.rhythms.slice();
      const notes = r.filter(x => !CELL[x].rest && CELL[x].meter === CELL[id].meter);
      if (r.includes(id)) { if (!(notes.length === 1 && notes[0] === id)) r = r.filter(x => x !== id); } else r.push(id);
      change('rhythms', r);
      // hear it: on G, at the tempo dial's tempo
      const spt = 60 / RR.listenTempo() / 4; let tt = RR.Sound.now() + 0.05;
      CELL[id].ticks.forEach(x => { if (x > 0) RR.Sound.playAt('G4', tt, 0.7); tt += Math.abs(x) * spt; });
      return true;
    }
    return false;
  }
  /* the Generate window's draft: its Notes and Rhythm sections, and a click on them (true: draw it again) */
  const withDraft = (p, fn) => { draft = p; try { return fn(); } finally { draft = null; } };
  const draftHtml = p => withDraft(p, () => TAB.notes() + TAB.rhythms());
  const draftClick = (t, p) => withDraft(p, () => editClick(t));

  /* a click on the battle's own controls (its teams, turns and rounds): the action's name, or false */
  function battleClick(t) {
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
      return 'colour';
    }
    const tr = t.closest('[data-team-remove]');
    if (tr) { changeBattle(b => { if (b.teams.length > 2) b.teams.splice(+tr.dataset.teamRemove, 1); }); return 'remove'; }
    const bt = t.closest('[data-bt]');
    if (bt) {
      changeBattle(b => {
        if (bt.dataset.bt === 'per') b.per = +bt.dataset.v;
        else if (bt.dataset.bt === 'tools') b.tools = bt.dataset.v === 'true';       // the colours, letters and keyboard: on or off for everyone
        else b.rounds = Math.max(1, Math.min(RR.BATTLE_ROUNDS_MAX, b.rounds + (+bt.dataset.v || 0)));
      });
      return 'turns';
    }
    const ad = t.closest('[data-act="add-team"]');
    if (ad) { changeBattle(b => { if (b.teams.length < 4) { const c = RR.freeColour(b.teams); b.teams.push({ name: c[1] + ' team', colour: c[0] }); } }); return 'add-team'; }
    return false;
  }
  const focusLastTeam = root => { const all = root.querySelectorAll('.bt-name'), f = all[all.length - 1]; if (f) { f.focus(); f.select(); } };
  /* typing a team's name (saved as you type); the rounds typed (taken when the box is left) */
  function battleInput(e) {
    if (!e.target.matches('.bt-name')) return false;
    const i = +e.target.dataset.teamName; changeBattle(b => { b.teams[i].name = e.target.value; });
    return true;
  }
  function battleChange(e) {
    if (e.target.id === 'battle-rounds') {
      const n = parseInt(e.target.value, 10);
      changeBattle(b => { b.rounds = Math.max(1, Math.min(RR.BATTLE_ROUNDS_MAX, isFinite(n) ? n : b.rounds)); });
      return true;
    }
    return e.target.matches('.bt-name');          // a name left empty becomes its colour's name
  }

  const body = $('#tab-body');
  body.addEventListener('click', async e => {
    if (RR.foldClick(e)) return;
    const t = e.target;
    const bc = battleClick(t);
    if (bc) { render(); if (bc === 'add-team') focusLastTeam(body); return; }
    if (formatClick(t)) { render(); return; }
    if (editClick(t)) { render(); return; }
    if (prefsClick(t, render)) return;
    const act = t.closest('[data-act]');
    if (!act) return;
    const a = act.dataset.act;
    if (a === 'melodies') { close(); RR.Melodies.open(); return; }
    if (a === 'play-session') {
      close(); RR.View.go('play');
    } else if (a === 'reset-level') {
      const n = G.mode.n;
      if (!(await RR.ask('Reset Level ' + n + ' to how it was made? Your changes to it go (its scores stay).', 'Reset'))) return;
      G.resetLevel(); render(); RR.toast('Level ' + n + ' is back as it was made');
    } else if (a === 'over-off') {
      G.over = {}; G.compose(); G.remember(); G.roundChanged = true; G.applyInstrument();
      render(); RR.toast('Playing its own settings');
    } else if (a === 'delete-session') {
      await deleteSession(G.sessionId());
    } else if (a === 'leave') {
      RR.Lesson.leave(); close();
    }
  });
  /* a session deleted: if it was playing, what it was carries on as Custom (played the Practice or Songs way:
     carries on as that lesson or song). True when it went */
  async function deleteSession(id) {
    const x = RR.Sessions.get(id); if (!x) return false;
    if (!(await RR.ask('Delete the session “' + x.name + '”? Its best scores go too.', 'Delete'))) return false;
    RR.Sessions.remove(id);
    if (G.mode.kind === 'session' && G.mode.id === id) {
      G.mode = { kind: 'custom', from: x.name };
      G.battle = null; G.compose(); G.remember(); G.roundChanged = true;
    } else if (G.mode.kind === 'teach' && G.mode.session && G.mode.session.id === id) { delete G.mode.session; G.remember(); }
    G.drawChips(); if (isOpen()) render();
    return true;
  }
  const isOpen = () => !$('#settings').hidden;

  /* ---- the Format's own controls (the session page, 2026-10-12): true when the click was one ---- */
  function formatClick(t) {
    const sid = G.sessionId(), x = sid && RR.Sessions.get(sid);
    if (!x) return false;
    const replay = () => { G.selectSession(sid); };
    const f = t.closest('[data-sf]');
    if (f) {
      if (f.dataset.sf === x.format) return true;
      ptab = null;
      RR.Sessions.setFormat(sid, f.dataset.sf);
      replay();                                   // played its new way at once (a new round, a new lesson…)
      $('#tab-body').scrollTop = 0;
      return true;
    }
    const pt = t.closest('[data-spts]');
    if (pt) {
      const on = pt.dataset.spts === 'true';
      RR.Sessions.setPoints(sid, on); RR.device.points = on; RR.saveDevice(); G.drawChips(); G.draw();
      return true;
    }
    const tb = t.closest('[data-stab]');
    if (tb) { ptab = tb.dataset.stab; return true; }
    const st = t.closest('[data-st]');
    if (st) { RR.Sessions.setTeach(sid, { id: st.dataset.id }); replay(); return true; }
    const ss = t.closest('[data-ss]');
    if (ss) {
      const s = RR.clone(x.song), k = ss.dataset.ss, v = ss.dataset.v;
      const n = (id => { const L = RR.teachLevel(id); return L ? L.ex.length : 1; });
      if (k === 'song') { s.id = ss.dataset.id; s.from = 0; s.to = n(s.id) - 1; s.part = false; }
      else if (k === 'part') {
        // a section to begin with: two slides (the Songs window's way); the whole song: all of them
        const len = n(s.id); s.part = v === 'part';
        if (s.part && (s.to <= s.from || (s.from === 0 && s.to >= len - 1))) s.to = Math.min(len - 1, s.from + 1);
        if (!s.part) { s.from = 0; s.to = len - 1; }
      }
      else if (k === 'practice') s.practice = v === 'true';
      else if (k === 'auto') s.auto = v === 'true';
      RR.Sessions.setSong(sid, s); replay();
      return true;
    }
    return false;
  }
  /* a song's section, picked from its two boxes */
  function sectionChange(e) {
    if (e.target.id !== 'ses-from' && e.target.id !== 'ses-to') return false;
    const sid = G.sessionId(), x = sid && RR.Sessions.get(sid); if (!x) return true;
    const s = RR.clone(x.song), v = +e.target.value;
    if (e.target.id === 'ses-from') { s.from = v; s.to = Math.max(s.to, v); } else { s.to = v; s.from = Math.min(s.from, v); }
    RR.Sessions.setSong(sid, s); G.selectSession(sid);
    return true;
  }

  /* ---- Points · Players · Sound: the window's tabs, and the Library's Settings (2026-10-12) — the actions on
     them, true when `a` was one; `redraw` after a change ---- */
  function prefsAct(a, redraw) {
    if (a === 'add-player') {
      const box = $('#player-name'), r = RR.Players.add(box ? box.value : '');
      if (!r.ok) { RR.toast(r.why); if (box) box.focus(); return true; }
      redraw(); RR.toast(r.name + ' is playing'); return true;
    }
    if (a === 'test') {
      RR.Sound.prime(0.3).then(() => {
        const tt = RR.Sound.now() + 0.05;
        ['C4', 'E4', 'G4', 'C5'].forEach((id, i) => RR.Sound.playAt(id, tt + i * 0.18));
      });
      return true;
    }
    if (a === 'reset') {
      RR.ask('Reset all the scores' + (RR.device.player ? ' for ' + RR.device.player : '') + '? Best scores, stars on the levels and tricky notes all go.', 'Reset').then(yes => {
        if (!yes) return;
        RR.Scores.reset(); G.points = 0; G.streak = 0; G.bestStreak = 0; G.drawChips(); redraw(); RR.toast('Scores reset');
      });
      return true;
    }
    return false;
  }
  /* a click in Points or Sound anywhere (the Library's Settings): the switches and choices of this browser, the
     players — true when it was one */
  function prefsClick(t, redraw) {
    const sg = t.closest('[data-k]');
    if (sg && sg.dataset.k[0] === '@') { change(sg.dataset.k, sg.dataset.v); redraw(); return true; }
    const tg = t.closest('[data-toggle]');
    if (tg && tg.dataset.toggle[0] === '@') {
      const k = tg.dataset.toggle;
      change(k, !(k === '@points' ? RR.device.points : k === '@stars' ? RR.device.stars : RR.device.celebrate)); redraw(); return true;
    }
    const pl = t.closest('[data-player]');
    if (pl) { RR.Players.use(pl.dataset.player); redraw(); return true; }
    const up = t.closest('[data-unplayer]');
    if (up) {
      const name = up.dataset.unplayer;
      RR.ask('Remove ' + name + ' and ' + name + '’s scores?', 'Remove').then(yes => { if (yes) { RR.Players.remove(name); redraw(); } });
      return true;
    }
    const act = t.closest('[data-act]');
    return !!(act && prefsAct(act.dataset.act, redraw));
  }

  // the number of melodies, typed: taken when the box is left (or Enter)
  body.addEventListener('change', e => {
    if (e.target.id === 'round-count') { change('countSet', e.target.value); render(); }
    if (sectionChange(e)) { render(); return; }
    if (battleChange(e)) render();
  });
  body.addEventListener('input', e => {
    if (battleInput(e)) return;
    if (e.target.id === 'session-name' && G.sessionId()) {     // renamed as you type
      const nm = e.target.value.trim().slice(0, 40), m = G.mode;
      if (RR.Sessions.rename(G.sessionId(), e.target.value)) { if (m.kind === 'session') m.name = nm; else m.session.name = nm; G.remember(); G.drawChips(); $('#custom-tag').textContent = G.modeLabel(); }
      return;
    }
    const r = e.target.closest('[data-range]');
    if (r) {
      change(r.dataset.range, r.value);
      return;
    }
  });
  body.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'session-name') { e.preventDefault(); e.target.blur(); }
    if (e.key === 'Enter' && (e.target.id === 'round-count' || e.target.id === 'battle-rounds' || e.target.matches('.bt-name'))) { e.preventDefault(); e.target.blur(); }
    if (e.key === 'Enter' && e.target.id === 'player-name') { e.preventDefault(); body.querySelector('[data-act="add-player"]').click(); }
  });
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) { tab = b.dataset.tab; body.scrollTop = 0; render(); } });

  /* for the top drop-down (drop.js, 2026-10-08): a section of the ✎ page on what is playing, and its controls */
  const sectionHtml = name => name === 'battle' ? (G.battle ? battlePage() : '') : TAB[name] ? TAB[name]() : '';
  /* the Library (2026-10-12): its Settings folder is Points and Sound; its Share & backup has the lesson link */
  const prefsHtml = () => '<h4 class="lb-sub">Points, stars and players</h4>' + TAB.points() + '<h4 class="lb-sub">Sound</h4>' + TAB.sound();
  function prefsInput(e) {
    const r = e.target.closest('[data-range]');
    if (!r || r.dataset.range[0] !== '@') return false;
    change(r.dataset.range, r.value); return true;
  }
  RR.Settings = { open, close, render, settle, draftHtml, draftClick, sectionHtml, liveClick: editClick, battleClick, battleInput, battleChange, focusLastTeam,
    deleteSession, prefsHtml, prefsClick, prefsInput,
    isOpen };
})();

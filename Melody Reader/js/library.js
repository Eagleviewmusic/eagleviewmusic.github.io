/* ==========================================================================
   Melody Reader — library.js
   --------------------------------------------------------------------------
   RR.Library — the Library (2026-10-12, the user's: "combine the My
   Melodies button with the Setting Button and call it 'Library'", laid
   out like Song Writer 2.5's Library — "this will make this folder the go
   to place to find anything"). One button in the top bar opens it:

     Now playing     what is on the music, ✎ its page
     the buttons     + New melody · Teacher Library · Share & backup · Set
                     up for students · Save picture — Song Writer's row, no
                     Save as; New melody (not New song) asks which set it
                     goes in; Set up for students and Save picture are to
                     come (the user: "we'll discuss that later")
     + New session   a name, or none — then "Tuesday's Xylo Workout"
                     (RR.sessionName: the day and one of five titles); it
                     opens the session's page, Format first (no Battle
                     button here: Battle is one of the formats)
     the folders     My sessions · My melodies · Songs · Practice · Levels ·
                     Settings (Points, Players, Sound) — each folds, and
                     which are open is kept (device.libOpen)

   Everything in it can be changed (2026-10-13, the user's: "I want to be
   able to edit any and everything from the Library"): a song, a lesson,
   an exercise has ✎ like a session or a level — a set's page (melodies.js)
   on it. The Songbook's songs and the six lessons are the app's own: the
   page shows them as they are, and the first change makes your copy
   ("Hot Cross Buns (my copy)", sets.js) — listed right after its original
   in Songs or Practice, not in My melodies or My sessions.

   It lives in the window that was My melodies (#melodies — melodies.js
   keeps the window and a set's page); its list is this now. Two pages of
   its own, with ‹ back: Share & backup (the lesson link, which was
   Settings' Share tab, and the backups) and New melody (the set). In a
   lesson: what plays, Leave the lesson, and Settings.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game, esc = RR.esc;
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));
  const Lib = RR.Library = {};
  let sub = null;           // null: the Library · 'share': Share & backup · 'newmel': New melody
  let hint = '';            // the name a session left unnamed gets (shown in its box)
  let into = null;          // New melody: the set it goes in ('' = a new one)

  const svg = (d, cls) => '<svg class="' + (cls || 'lb-i') + '" viewBox="0 0 24 24" aria-hidden="true">' + d + '</svg>';
  const IC = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    shelf: '<path d="M4 19V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v14"/><path d="M9 19V8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11"/><path d="m14.5 8.6 2.9-.8a1 1 0 0 1 1.2.7l2.7 10.1"/><path d="M3 19h18"/>',
    share: '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v13"/>',
    students: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c.6-3.3 2.8-5.2 5.5-5.2s4.9 1.9 5.5 5.2"/><circle cx="17" cy="9" r="2.5"/><path d="M16.4 14.3c2.2.2 3.7 1.8 4.2 4.6"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    ses: '<path d="M4 6h9M4 12h5M4 18h9"/><circle cx="16" cy="6" r="2.4"/><circle cx="12" cy="12" r="2.4"/><circle cx="16" cy="18" r="2.4"/><path d="M18.4 6H21M14.4 12H21M18.4 18H21"/>',
    mel: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    song: '<path d="M4 4.5h16v15H4z"/><path d="M4 9.5h16"/><path d="M10 17v-4.6l5-1v3.8"/><circle cx="8.8" cy="17" r="1.3"/><circle cx="13.8" cy="15.4" r="1.3"/>',
    practice: '<path d="M3 6h18M3 10h18M3 14h9"/><path d="m14 17.5 2.6 2.6L21.5 15"/>',
    levels: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
    prefs: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    chev: '<path d="m9 6 6 6-6 6"/>'
  };
  /* each format's colour and the home page's card picture (home.js) */
  const FMT = {
    practice: { col: RR.TEACH_COLOUR, icon: 'teach', light: true },
    rounds: { col: '#2563eb', icon: 'round', light: true },
    songs: { col: '#7c3aed', icon: 'song' },
    games: { col: '#c2410c', icon: 'games' },
    battle: { col: '#dc2626', icon: 'battle' }
  };
  const badge = (f, cls) => '<span class="lb-badge' + (FMT[f].light ? ' light' : '') + (cls ? ' ' + cls : '') + '" style="--bc:' + FMT[f].col + '">' + ((RR.Home && RR.Home.ICON[FMT[f].icon]) || '') + '</span>';
  const textBadge = (text, colour, cls) => '<span class="lb-badge txt' + (cls ? ' ' + cls : '') + '" style="--bc:' + colour + '">' + text + '</span>';

  /* a row: its badge, its name and a quiet line under it, and its buttons on the right (Song Writer's rows) */
  function row(o) {
    return '<div class="lb-row' + (o.on ? ' on' : '') + '">' + o.badge + '<span class="lb-txt"><b>' + o.title + (o.on ? ' <span class="mel-tag now">Playing now</span>' : '') + (o.tags || '') + '</b>' +
      (o.sub ? '<small>' + o.sub + '</small>' : '') + '</span>' + (o.extra || '') + '<span class="lb-acts">' + o.acts + '</span></div>';
  }
  const act = (lb, text, attrs, cls, label) => '<button type="button" class="lb-act' + (cls ? ' ' + cls : '') + '" data-lb="' + lb + '"' + (attrs || '') +
    (label ? ' aria-label="' + esc(label) + '" title="' + esc(label) + '"' : '') + '>' + text + '</button>';
  const dataId = id => ' data-id="' + esc(id) + '"';
  const starsOf = key => { const n = RR.Scores.levelStars(key); return n > 0 ? '<span class="lb-stars" aria-label="best ' + n + ' stars">' + RR.starsHtml(n, 3) + '</span>' : ''; };

  /* ---- the folders: open or folded, kept on this browser ---- */
  const OPEN0 = { ses: true, mel: true, songs: false, practice: false, levels: false, prefs: false };
  const isOpen = f => { const o = RR.device.libOpen; return o && typeof o[f] === 'boolean' ? o[f] : OPEN0[f]; };
  function setOpen(f, on) {
    RR.device.libOpen = Object.assign({}, OPEN0, RR.device.libOpen && typeof RR.device.libOpen === 'object' ? RR.device.libOpen : {}, { [f]: !!on });
    RR.saveDevice();
  }
  function folder(f, icon, title, count, body) {
    const open = isOpen(f);
    return '<section class="lb-folder' + (open ? ' open' : '') + '" data-folder="' + f + '"><button type="button" class="lb-fold" data-lb="fold" data-f="' + f + '" aria-expanded="' + open + '">' +
      svg(icon) + '<span class="lb-fold-t">' + title + '</span>' + (count !== '' ? '<span class="lb-count">' + count + '</span>' : '') +
      '<span class="lb-rule"></span>' + svg(IC.chev, 'lb-chev') + '</button>' + (open ? '<div class="lb-fold-body">' + body() + '</div>' : '') + '</section>';
  }

  /* ---- what is playing ---- */
  function nowHtml() {
    const m = G.mode, lesson = m.kind === 'lesson', page = !lesson && (m.kind !== 'teach' || !!G.sessionId());
    const words = m.kind === 'teach' ? RR.Teach.where() : G.battle ? plural(G.battle.teams.length, 'team') + ' · ' + plural(G.battle.rounds, 'round') : RR.gameText(G.setup);
    const away = RR.View && RR.View.current !== 'play';
    return '<div class="lb-now" style="--band:' + (G.battle ? FMT.battle.col : G.modeColour()) + '"><i class="band-dot" aria-hidden="true"></i>' +
      '<span class="lb-now-txt"><span class="lb-now-k">Now playing</span><b>' + esc(G.modeLabel()) + '</b><small>' + esc(words) + '</small></span>' +
      '<span class="lb-now-btns">' + (page ? act('page', '✎ Change it', '', 'soft') : '') + (away ? act('music', '▶ To the music', '', 'go') : '') + '</span></div>';
  }

  /* ---- the buttons (Song Writer 2.5's row) ---- */
  function btnsHtml() {
    const shelf = !!window.EVMShelf && G.mode.kind !== 'lesson';
    const soon = '<span class="lb-soon">soon</span>';
    return '<div class="lb-btns">' +
      '<button type="button" class="pill-btn primary lb-btn" data-lb="newmel">' + svg(IC.plus) + 'New melody</button>' +
      (shelf ? '<button type="button" class="pill-btn lb-btn" data-lb="shelf" title="Books your teacher has put on the shelf">' + svg(IC.shelf) + 'Teacher Library</button>' : '') +
      '<button type="button" class="pill-btn lb-btn" data-lb="share">' + svg(IC.share) + 'Share &amp; backup</button>' +
      '<button type="button" class="pill-btn lb-btn" data-lb="students" title="Coming soon">' + svg(IC.students) + 'Set up for students' + soon + '</button>' +
      '<button type="button" class="pill-btn lb-btn" data-lb="picture" title="Coming soon">' + svg(IC.camera) + 'Save picture' + soon + '</button></div>';
  }

  /* ---- + New session: a name, or one made up from the day ---- */
  function newSesHtml() {
    return '<div class="lb-newses"><label class="sr-only" for="lb-ses-name">The new session’s name — or leave it empty</label>' +
      '<input type="text" id="lb-ses-name" maxlength="40" autocomplete="off" placeholder="' + esc(hint) + '">' +
      '<button type="button" class="pill-btn go lb-ses-btn" data-lb="new-session">' + svg(IC.plus) + 'New session</button></div>' +
      RR.note('lb-ses', 'Name it — or leave the box empty and it’s “' + esc(hint) + '”. Then pick its format: Practice, Rounds, Songs, Games or Battle.');
  }

  /* ---- My sessions ---- */
  function sessionWords(x) {
    const p = x.practice, T = id => RR.teachLevel(id);
    let w;
    if (x.format === 'practice') { const L = T(x.teach.id); w = 'Practice · ' + (L ? (L.unit || L.adv ? L.title : L.title + ' · ' + L.name) : 'its exercise isn’t here any more'); }
    else if (x.format === 'songs') { const L = T(x.song.id); w = 'Songs · ' + (L ? L.title + (x.song.part ? ' · slides ' + (x.song.from + 1) + '–' + (x.song.to + 1) : '') : 'its song isn’t here any more'); }
    else if (x.format === 'battle') w = 'Battle · ' + plural(x.battle.teams.length, 'team') + ' · ' + plural(x.battle.rounds, 'round') + ' · ' + RR.notesText(p.notes);
    else if (x.format === 'games') w = (p.game === 'endless' ? 'Endless' : 'Beat the Clock · ' + (p.clockSecs === 120 ? '2 min' : p.clockSecs + ' s')) + ' · ' + RR.notesText(p.notes);
    else w = 'Rounds of ' + (RR.roundLen(p.game) || 5) + ' · ' + RR.summary(p);
    // the points, when not the format's own
    return w + (x.points !== RR.formatPoints(x.format) ? ' · points ' + (x.points ? 'on' : 'off') : '');
  }
  function sessionsHtml() {
    const list = RR.Sessions.list(), cur = G.sessionId();
    if (!list.length) return '<div class="lb-empty">No sessions yet — + New session makes one.</div>';
    return list.map(x => row({
      on: cur === x.id, badge: badge(x.format), title: esc(x.name),
      tags: x.format === 'battle' ? '<span class="bt-dots">' + x.battle.teams.map(t => '<i style="--tc:' + t.colour + '" title="' + esc(t.name) + '"></i>').join('') + '</span>' : '',
      sub: esc(sessionWords(x)), extra: ['rounds', 'games', 'battle'].includes(x.format) ? starsOf('session:' + x.id) : '',
      acts: act('ses-play', '▶ Play', dataId(x.id), 'go', 'Play ' + x.name) + act('ses-edit', '✎', dataId(x.id), 'ic', 'Change ' + x.name) + act('ses-del', '×', dataId(x.id), 'ic x', 'Delete ' + x.name)
    })).join('');
  }

  /* ---- My melodies: the Teacher Library's books, shared with you, your own ---- */
  function setRow(set) {
    const playing = G.over && G.over.set === set.id && G.mode.kind !== 'lesson';
    const n = set.melodies.length, times = Array.from(new Set(set.melodies.map(m => m.time[0] + '/4')));
    const tags = (RR.Sets.isShelf(set) ? '<span class="mel-tag book">Teacher Library</span>' : set.received ? '<span class="mel-tag">Shared</span>' : '') +
      (RR.TeachUnits.has(set.id) ? '<span class="mel-tag teach">Practice</span>' : '');
    return row({
      on: playing, badge: textBadge('♫', '#15803d'), title: esc(set.title), tags,
      sub: plural(n, 'melody', 'melodies') + (times.length ? ' · ' + times.join(', ') : ''),
      acts: (n ? '<button type="button" class="lb-act go" data-play="' + esc(set.id) + '" aria-label="Play ' + esc(set.title) + '">▶ Play</button>' : '') +
        '<button type="button" class="lb-act" data-open="' + esc(set.id) + '" aria-label="Open ' + esc(set.title) + '">Open</button>'
    });
  }
  /* the sets My melodies lists: not a lesson's, and not your copies of the app's songs and lessons (they're in Songs
     and Practice, after their originals) */
  const mySets = () => RR.Sets.list().filter(s => !/^lesson/.test(s.id) && !RR.Sets.copyOf(s));
  function melodiesHtml() {
    const books = new Map(), shared = [], own = [];
    mySets().forEach(s => {
      if (RR.Sets.isShelf(s)) { if (!books.has(s.book)) books.set(s.book, []); books.get(s.book).push(s); }
      else if (s.received) shared.push(s);
      else own.push(s);
    });
    let h = '';
    [...books.keys()].sort().forEach(b => { h += '<h4 class="lb-sub">' + svg(IC.book) + esc(b) + '</h4>' + books.get(b).map(setRow).join(''); });
    if (shared.length) h += '<h4 class="lb-sub">Shared with you</h4>' + shared.map(setRow).join('');
    if (books.size || shared.length) h += '<h4 class="lb-sub">Your sets</h4>';
    h += own.length ? own.map(setRow).join('') : '<div class="lb-empty">No sets of your own yet — + New melody writes the first one.</div>';
    return h + '<div class="lb-inline"><input type="text" id="lb-set-name" maxlength="60" placeholder="A name for a new, empty set — Week 3, say" aria-label="A name for a new set">' +
      '<button type="button" class="pill-btn" data-lb="new-set">+ New set</button></div>';
  }

  /* ---- Songs (the Songbook's, and your copies), Practice (its lessons, your copies, your exercises), the levels ---- */
  /* ✎ on a song, a lesson or an exercise: its set's page — the app's own ('songbook:…', 'practice:…'), or yours */
  const setIdOf = L => L.set || (L.kind === 'song' ? 'songbook:' + L.songId : 'practice:' + L.id);
  const editAct = (L, name) => '<button type="button" class="lb-act ic" data-open="' + esc(setIdOf(L)) + '" aria-label="' + esc('Change ' + name) + '" title="' + esc('Change ' + name) + '">✎</button>';
  const copyTag = L => L.copyOf ? ' <span class="mel-tag mine">My copy</span>' : '';
  function songsHtml() {
    const cur = G.mode.kind === 'teach' && G.mode.song && !G.mode.session ? G.mode.id : null;
    return RR.teachSongs().map(L => row({
      on: cur === L.id, badge: badge('songs', L.copyOf ? 'copy' : ''), title: esc(L.title), tags: copyTag(L), sub: esc(L.sub),
      acts: act('song-play', '▶ Play', dataId(L.id), 'go', 'Play ' + L.title) + act('song-more', 'A section…', dataId(L.id), '', 'A section of ' + L.title + ', Practice, Auto-Next') + editAct(L, L.title)
    })).join('') + RR.note('lb-songs', 'A song, slide after slide, keeping a steady beat — your own melody sets can be played as songs too (Songs on the home page). ✎ changes a song: the Songbook’s stay as they are, and your change becomes your own copy, right under it.');
  }
  function teachRow(L) {
    const m = RR.TeachMarks.get(L.id), done = m.filter(Boolean).length, gold = m.filter(x => x === 2).length;
    const on = G.mode.kind === 'teach' && !G.mode.song && !G.mode.session && RR.Teach.id === L.id;
    // your copy of a lesson wears its lesson's number
    const orig = L.copyOf ? RR.TEACH.find(x => 'practice:' + x.id === L.copyOf) : null, num = orig || (L.unit ? null : L);
    return row({
      on, badge: textBadge(num ? (num.adv ? 'A' : '') + num.n : '♫', RR.TEACH_COLOUR, orig ? 'copy' : ''), title: esc(L.unit || L.adv ? L.title : L.title + ' · ' + L.name), tags: copyTag(L),
      sub: esc(L.sub) + (m.length ? ' · ' + done + ' of ' + m.length + ' played' + (gold ? ' · ★ ' + gold : '') : ''),
      acts: act('teach-play', '▶ Play', dataId(L.id), 'go', 'Play ' + (L.unit ? L.title : L.long)) + editAct(L, L.unit ? L.title : L.long)
    });
  }
  function practiceHtml() {
    const us = RR.teachExercises();
    return '<h4 class="lb-sub">Lessons</h4>' + RR.teachLessons().map(teachRow).join('') +
      RR.note('lb-pr', '✎ changes a lesson: the app’s six stay as they are, and your change becomes your own copy, right under it.') +
      '<h4 class="lb-sub">Your exercises</h4>' + (us.length ? us.map(teachRow).join('') : '<div class="lb-empty">None yet — a melody set of yours becomes one.</div>') +
      '<div class="lb-more"><button type="button" class="h-link" data-lb="make-unit">+ Make an exercise from your melodies…</button></div>';
  }
  function levelsHtml() {
    const cur = G.mode.kind === 'level' ? G.mode.n : 0;
    return RR.note('lb-lv', 'Fifteen levels, a step at a time. ✎ changes one to suit you — it plays your way every time (Reset gives it back as it was).') +
      RR.BANDS.map(b => '<h4 class="lb-sub"><i class="band-dot" style="--band:' + b.colour + '"></i>' + b.name + ' · ' + b.title + '</h4>' +
        RR.LEVELS.filter(l => l.band === b.id).map(l => row({
          on: cur === l.n, badge: textBadge(String(l.n), b.colour, 'ring'), title: esc(l.name) + (RR.LevelEdits.edited(l.n) ? ' <span class="ses-tag ed-tag">Yours</span>' : ''),
          sub: esc(RR.summary(RR.practiceOfLevel(l.n))), extra: starsOf(RR.levelKey(l.n)),
          acts: act('lv-play', '▶ Play', ' data-n="' + l.n + '"', 'go', 'Play Level ' + l.n) + act('lv-edit', '✎', ' data-n="' + l.n + '"', 'ic', 'Change Level ' + l.n)
        })).join('')).join('');
  }

  /* ---- the Library ---- */
  function homeHtml() {
    if (G.mode.kind === 'lesson') {
      return nowHtml() + '<div class="lb-lesson">' + RR.note('lb-lsn', 'This practice came from a lesson link. Leave the lesson to choose your own sessions, melodies and levels again.') +
        '<button type="button" class="pill-btn primary" data-lb="leave">Leave the lesson</button></div>' +
        '<div class="lb-prefs lb-prefs-open">' + RR.Settings.prefsHtml() + '</div>';
    }
    return nowHtml() + btnsHtml() + newSesHtml() +
      folder('ses', IC.ses, 'My sessions', RR.Sessions.list().length, sessionsHtml) +
      folder('mel', IC.mel, 'My melodies', mySets().length, melodiesHtml) +
      folder('songs', IC.song, 'Songs', RR.teachSongs().length, songsHtml) +
      folder('practice', IC.practice, 'Practice', RR.teachLessons().length + RR.teachExercises().length, practiceHtml) +
      folder('levels', IC.levels, 'Levels', RR.LEVELS.length, levelsHtml) +
      folder('prefs', IC.prefs, 'Settings', '', () => '<div class="lb-prefs">' + RR.Settings.prefsHtml() + '</div>');
  }

  /* ---- Share & backup: the lesson link (Settings' Share tab, 2026-10-08), the melody sets' backups ---- */
  function shareHtml() {
    const teach = G.mode.kind === 'teach';
    return (teach ? '<div class="sec"><h3>Lesson link</h3><p class="note">A lesson link carries a level, a session of Rounds, Games or Battle, or melodies you generated — not Practice or Songs yet. Play one of those, then come back here for its link.</p></div>'
      : RR.Settings.shareHtml()) +
      '<div class="sec"><h3>Back up your melodies</h3>' + RR.note('lb-bk', 'All your melody sets in one file — keep it safe, or open it on another computer with Restore. Restoring adds what isn’t here, and never makes a second copy of a set.') +
      '<div class="lb-btns"><button type="button" class="pill-btn lb-btn" data-lb="backup">Download a backup</button>' +
      '<button type="button" class="pill-btn lb-btn" data-lb="restore">Restore from a backup</button></div></div>';
  }

  /* ---- New melody: which set it goes in, then Make a melody ---- */
  const ownSets = () => RR.Sets.list().filter(x => !x.received && !/^lesson/.test(x.id));
  function freeSetName() {
    const names = RR.Sets.list().map(x => x.title.toLowerCase());
    if (!names.includes('my melodies')) return 'My melodies';
    for (let i = 2; ; i++) if (!names.includes('my melodies ' + i)) return 'My melodies ' + i;
  }
  function newMelHtml() {
    const own = ownSets();
    if (into === null || (into && !own.some(x => x.id === into))) into = own.some(x => x.id === RR.device.lastSet) ? RR.device.lastSet : own.length ? own[0].id : '';
    const pick = (id, inner) => '<button type="button" role="radio" class="mc-row' + (into === id ? ' on' : '') + '" data-lb="into"' + dataId(id) + ' aria-checked="' + (into === id) + '">' + inner + '</button>';
    return '<p class="note">Which set does it go in? A set is a group of melodies — Week 3, say. You write the melody on the xylophone; each one is a slide of the set.</p>' +
      '<div class="mc-list lb-into" role="radiogroup" aria-label="The set it goes in">' +
        own.map(x => pick(x.id, '<b>♫ ' + esc(x.title) + '</b><span class="mc-n">' + plural(x.melodies.length, 'melody', 'melodies') + '</span>')).join('') +
        pick('', '<b>+ A new set</b><span class="mc-n"></span>') + '</div>' +
      (into === '' ? '<div class="lb-inline lb-narrow"><input type="text" id="lb-newmel-set" maxlength="60" placeholder="Its name — or leave it empty for “' + esc(freeSetName()) + '”" aria-label="The new set’s name"></div>' : '') +
      '<div class="lb-foot"><button type="button" class="pill-btn" data-lb="back">Cancel</button><button type="button" class="pill-btn go" data-lb="write">✎ Write the melody</button></div>';
  }

  /* ================= for melodies.js: the window's list, its title, its ‹ ================= */
  Lib.html = () => sub === 'share' ? shareHtml() : sub === 'newmel' ? newMelHtml() : homeHtml();
  Lib.title = () => sub === 'share' ? 'Share & backup' : sub === 'newmel' ? 'New melody' : 'Library';
  Lib.sub = () => sub;
  Lib.back = () => { if (!sub) return false; sub = null; return true; };
  /* each time the Library opens: its first page, a fresh name for a session left unnamed */
  Lib.reset = function () {
    sub = null; into = null;
    hint = RR.sessionName(RR.Sessions.list().map(x => x.name));
  };
  const draw = () => RR.Melodies.render();
  const scrollTop = () => { const b = $('#mel-body'); if (b) b.scrollTop = 0; };
  /* open the Library — at a folder (opened, and shown), or at one of its pages ('share', 'newmel') */
  Lib.open = function (folderId, page) {
    if (folderId) setOpen(folderId, true);
    RR.Melodies.open();
    if (page) { sub = page; draw(); }
    if (folderId) { const f = document.querySelector('#mel-body [data-folder="' + folderId + '"]'); if (f) f.scrollIntoView({ block: 'start' }); }
    const b = document.querySelector('#mel-body .lb-fold[data-f="' + folderId + '"]') || document.querySelector('#mel-body [data-lb]'); if (b) b.focus({ preventScroll: true });
  };
  Lib.newMelody = () => Lib.open(null, 'newmel');

  /* a session, from + New session (here or on the home page): a copy of what is playing — its own settings,
     not what is played just this time; from Practice or a song, a session of that — then its page */
  Lib.newSession = function (typed) {
    const name = String(typed || '').trim().slice(0, 40) || hint || RR.sessionName(RR.Sessions.list().map(x => x.name));
    const m = G.mode, sid = G.sessionId(), was = sid && RR.Sessions.get(sid);
    let p = G.readingPractice(), extra = {};
    if (was && was.format !== 'battle') { p = RR.clone(was.practice); extra = { format: was.format, teach: was.teach, song: was.song }; }
    else if (m.kind === 'teach') {
      const L = RR.teachLevel(m.id), n = L ? L.ex.length : 1;
      extra = m.song ? { format: 'songs', song: { id: m.id, part: !(m.from === 0 && m.to >= n - 1), from: m.from, to: m.to, practice: !!m.practice, auto: m.auto !== false } }
        : { format: 'practice', teach: { id: m.id } };
    }
    const rec = RR.Sessions.add(name, p, null, extra);
    if (RR.Melodies.isOpen()) RR.Melodies.close();
    G.selectSession(rec.id);
    RR.Settings.open('session');
    RR.toast('“' + rec.name + '” is in My sessions — pick its format, then ▶ Play');
    hint = RR.sessionName(RR.Sessions.list().map(x => x.name));
  };

  async function copyLink() {
    const box = $('#lesson-name'), name = (box && box.value || '').trim() || 'Lesson', link = RR.Settings.lessonLink(name);
    $('#lesson-link').value = link;
    try { await navigator.clipboard.writeText(link); RR.toast('Lesson link copied'); }
    catch (_) { $('#lesson-link').select(); RR.toast('Select the link and copy it'); }
  }
  function close() { if (RR.Melodies.isOpen()) RR.Melodies.close(); }
  const toMusic = () => RR.View.go('play');

  /* a click in the Library's own pages: true when it was one (the sets' ▶ Play and Open are melodies.js's) */
  Lib.click = function (t) {
    const b = t.closest('[data-lb]');
    if (!b) {
      if (sub === 'share' && t.closest('[data-act="copy-link"]')) { copyLink(); return true; }
      if (!sub && t.closest('.lb-prefs') && RR.Settings.prefsClick(t, draw)) return true;
      return false;
    }
    const a = b.dataset.lb, id = b.dataset.id, n = +b.dataset.n;
    if (a === 'fold') {
      const f = b.dataset.f; setOpen(f, !isOpen(f)); draw();
      const again = document.querySelector('#mel-body .lb-fold[data-f="' + f + '"]'); if (again) again.focus();
    }
    else if (a === 'newmel') { sub = 'newmel'; into = null; draw(); scrollTop(); }
    else if (a === 'share') { sub = 'share'; draw(); scrollTop(); }
    else if (a === 'back') { sub = null; draw(); }
    else if (a === 'shelf') { if (window.EVMShelf) EVMShelf.openSheet(); }
    else if (a === 'students') RR.toast('Set up for students is coming soon');
    else if (a === 'picture') RR.toast('Save picture is coming soon');
    else if (a === 'new-session') Lib.newSession(($('#lb-ses-name') || {}).value);
    else if (a === 'ses-play') { close(); if (G.selectSession(id)) toMusic(); }
    else if (a === 'ses-edit') { close(); if (G.selectSession(id)) RR.Settings.open('session'); }
    else if (a === 'ses-del') RR.Settings.deleteSession(id).then(gone => { if (gone) { RR.Settings.settle(); draw(); } });   // playing it: what it was carries on, a new round
    else if (a === 'song-play') { close(); if (RR.Teach.startSong(id)) { toMusic(); G.announce('Songs · ' + RR.teachLevel(id).title); } }
    else if (a === 'song-more') { RR.device.songPick = id; RR.saveDevice(); close(); RR.Teach.openSongs(); }
    else if (a === 'teach-play') {
      if (RR.Teach.start(id)) { close(); toMusic(); G.announce('Practice · ' + RR.teachLevel(id).long); }
      else RR.toast('No melodies in it yet — write them in My melodies');
    }
    else if (a === 'make-unit') { close(); RR.Teach.openWindow('make'); }
    else if (a === 'lv-play') { close(); G.selectLevel(n); toMusic(); }
    else if (a === 'lv-edit') { close(); G.selectLevel(n); RR.Settings.open('session'); }
    else if (a === 'page') { close(); RR.Settings.open('session'); }
    else if (a === 'music') { close(); toMusic(); }
    else if (a === 'leave') { RR.Lesson.leave(); draw(); }
    else if (a === 'new-set') {
      const box = $('#lb-set-name'), name = (box && box.value || '').trim();
      if (!name) { RR.toast('Give the set a name first'); if (box) box.focus(); return true; }
      const rec = RR.Sets.create(name.slice(0, 60));
      RR.Melodies.open(rec.id);
    }
    else if (a === 'into') { into = id || ''; draw(); const f = document.querySelector(into === '' ? '#lb-newmel-set' : '#mel-body [data-lb="into"].on'); if (f) f.focus(); }
    else if (a === 'write') {
      let setId = into;
      if (!setId) {
        const box = $('#lb-newmel-set');
        setId = RR.Sets.create(((box && box.value || '').trim() || freeSetName()).slice(0, 60)).id;
      }
      if (!RR.Sets.get(setId)) return true;
      RR.device.lastSet = setId; RR.saveDevice();
      sub = null;
      RR.Maker.enter(setId, null);
    }
    else if (a === 'backup') RR.Sets.download();
    else if (a === 'restore') $('#mel-file').click();
    return true;
  };
  /* typing in it: the lesson's name (its link follows), the volume */
  Lib.input = function (e) {
    if (e.target.id === 'lesson-name') { $('#lesson-link').value = RR.Settings.lessonLink(e.target.value.trim() || 'Lesson'); return true; }
    return RR.Settings.prefsInput(e);
  };
  /* Enter in a box does its button */
  Lib.keydown = function (e) {
    if (e.key !== 'Enter') return false;
    const go = { 'lb-ses-name': '[data-lb="new-session"]', 'lb-set-name': '[data-lb="new-set"]', 'lb-newmel-set': '[data-lb="write"]', 'player-name': '[data-act="add-player"]', 'lesson-name': '[data-act="copy-link"]' }[e.target.id];
    if (!go) return false;
    e.preventDefault();
    const b = $('#mel-body').querySelector(go); if (b) b.click();
    return true;
  };
  Lib.reset();
})();

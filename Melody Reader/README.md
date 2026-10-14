# Melody Reader

*Renamed from Rainbow Reader on 2026-10-03, with a new logo: a treble clef on
five lines coloured as the xylophone’s E G B D F, bottom to top (yellow,
turquoise, purple, orange, green). The folder, the design folder
(`../Melody Reader Design/`) and the launch entries were renamed too (same
ports, so saved scores carry over). The storage keys
(`rainbow_reader_*`), the EVM slug `rainbow-reader`, the `?set=` and lesson
links and the `RR` namespace keep the old name, so saved scores, melody sets
and shared links all still work.*

A treble-clef reading game on the Rainbow Xylophone. One or two bars of
music on the top half, the xylophone on the bottom half: read the notes,
ring the bars — with **1 2 3 4 5 6 7 8 9 0** (and **− =** for F5 and G5,
**+** — Shift and = — for high A) or a finger.

The design is in `../Melody Reader Design/` (README → DECISIONS → DESIGN →
LEVELS → ENGINE → IMPLEMENTATION). Every decision there was taken as
recommended (2026-10-03).

## Running it

Through the Claude Apps server (`../.claude/serve.js`; python's
`http.server` can't run from the launcher here):

| Launch entry | Port | For |
|---|---|---|
| `melody-reader` | 8815 | playing — your own scores live here |
| `melody-reader-test` | 8816 | testing — a separate origin, so tests never touch real scores |

`http://localhost:8816/tests/` runs the engine checks (generator, Songbook,
levels, engraver, practices, lesson links, melody sets under the library
rules, the points, My sessions (and, 2026-10-12, their formats, points and unnamed names), the gold star, round lengths, Battle
Mode and its fair plan, the Helps' choices, the session page's rules, My
stats' history and charts, the new ladder: 300 melodies a level against
its notes, moves, leaps, meters and pick-ups; metronome runs played in
time, slow, fast, late in, with a note skipped or a wrong bar; level changes kept and reset, a
session's own melody set, lesson links carrying every setting, Song sets and a battle) — 107 of
them, all passing as of 2026-10-08; with Teach Me to Read's 11 (its six levels' exercises, the
staff's lines, the gold-star rule, the saved marks, Solid Color, the tighter staff, high A) 121, all passing on 2026-10-11;
with Your units and the Tools panel's look (2026-10-12: a set as a unit, marks that follow a melody, low C's red
ledger line, a set gone and back, the look kept) 126, all passing on 2026-10-12; then the metronome's click-matching
checks (the follower's) were replaced by the tempo rule's (2026-10-12) — 122; with Staff Color and a battle's Tools
switch, 124; with the song levels (a Songbook song, any set as a song) 126, all passing on 2026-10-12; with a session's
Format (old sessions taking one, the points each format sets, Battle kept, the picks made safe, a session from Practice)
and the names for an unnamed session, 133, all passing on 2026-10-12. The tempo dial and the new score (2026-10-13:
the points by the player's tempo, wrong bars 2 off each, a few notes judged a little harder, the dial's marks and
colours, 6/8's click; the old three tempos dropped from practices) — 140, all passing on 2026-10-13. The drum beat
(the 4/4 beat's hits and gaps, the user's Ostinato Builder file read as it is, the meters still to come, `beat` in
practices and the Practice look, compound and triplet slots) — 146, all passing on 2026-10-13; with 3/4, 2/4 and 6/8
(each against the user's files — the newest beat for a meter wins — a beat of more than a bar going round, a resting
bar) — 149, all passing on 2026-10-13. Everything editable from the Library (the app's songs and lessons read as sets,
a change makes "(my copy)", "(my copy 2)", copies after their originals in Songs and Practice, a lesson's copy kept one
of Practice's, your exercises left alone) — 157, all passing on 2026-10-13 (with a copy saved or not).

The Teacher Library shelf reads `../Teacher Library/index.json`, which only
exists on the live site; served from its own folder (8815/8816) it can't be
reached, so the shelf says it is offline. To test the shelf, serve all of
Claude Apps (launch entry `song-writer-test`, 8805, at `/Melody%20Reader/`)
with a temporary `Claude Apps/Teacher Library/` — envelopes plus an index
built by `EVM Library/teacher-library/.github/scripts/build-teacher-index.js`
— and delete it afterwards.

## What's built (all six phases)

- **Everything editable from the Library** (2026-10-13, the user's: "I
  notice that from the library, I cannot edit any of the songs or Practice
  Songs. I want to be able to edit any and everything from the Library. If
  I change a song that is hard-coded into the app, make my own copy of
  that song — put it with the rest of them — not with my sessions — and
  call it 'my copy'"). Every row in Songs and Practice has **✎** now (as
  sessions and levels had), opening a set's page — the same editor My
  melodies uses (✎ a melody in Make a melody, ↑ ↓ ×, + Add a melody, ⧉
  Copy melodies in, the name).
  - **The app's own** — the Songbook's songs and Practice's six lessons —
    read as sets of their own (`RR.Sets.get('songbook:<id>')`,
    `'practice:<L1>'`), never stored. Their page says so, with ▶ Play the
    song / ▶ Practice it to play them as they are. **The first change**
    (`RR.Sets.update` on one of them: a melody written, moved or taken out,
    the name) **makes your copy** — "Hot Cross Buns (my copy)", then "(my
    copy 2)" — with the change in it, `derivedFrom` the original (the
    family's field: it travels in backups and envelopes); the page and
    Make a melody go on in the copy (`RR.Sets.onCopied`), and a toast says
    where it is. Opening one and looking makes nothing.
  - **Where copies live**: right under their original — in the Library's
    Songs and Practice folders (tucked in, tagged *My copy*), Practice's
    window and drop-down, the Songs window and a session's picks
    (`RR.teachSongs`, `RR.teachLessons`, `RR.teachTabOf`). Not in My
    melodies, not in My sessions. A song's copy plays as a song
    (`'M:<set>'`); a lesson's copy is one of Practice's units from the start
    (`'U:<set>'`, no Take it out — one that comes back from a backup is
    made one again), not listed with your exercises (`RR.teachExercises`).
  - **Your exercises** (your own sets as units) have ✎ too — changed in
    place: they're yours.

- **The drum beat** (2026-10-13, the user's: "To help the players feel the
  beat, I'd like to add a simple drum beat as an alternative to the
  metronome. This would work just like the metronome, playing the assigned
  BPM — and it would be for 4/4 time … put this option in the tools next
  to the metronome — click or drum beat, and find the best place in the
  Session settings menu"). The metronome's sound is **Click** or **Drum
  beat**: two buttons above the tempo dial in Tools and in a battle's
  metronome pop-up (`RR.Dial.soundHtml`, → `G.setBeatSound`), and a
  **Metronome** row on the ✎ page's **Look & Feel** (my pick for "the best
  place": it is a help, like Practice and the Play button, and it sits
  with them). It is the practice's own field `beat` (`'click'` default —
  every level, old session and link clicks; a lesson link carries it);
  Practice's lessons keep it in the look (`RR.teachLook().beat`), like
  their colours. Changed with the metronome going, it starts again.
  - **The beats** (`js/drums.js`, `RR.DRUM_BEATS`) are the user's, written
    in Ostinato Builder 2.0 — one for **every meter Melody Reader plays,
    4/4 · 3/4 · 2/4 · 6/8** (`RR.METERS` — Songbook songs are all 4/4; Make
    a melody does 2/4, 3/4, 4/4; 6/8 only in Levels 14–15), each drum a
    line of beats (`x-|--|x-|-x`: | between beats, a character a slot; 6/8
    has two beats of three eighths). 4/4: bass 1, 3 and the and of 4 ·
    snare 2 and 4 · tom the last sixteenth of 1 and 2, the and of 3 and 4 ·
    hi-hat every eighth. 3/4 (the user sent a two-bar one, then shortened
    it to a bar the same day): bass 1 and the and of 3 · snare 2 and 3 ·
    tom the last sixteenth of 2 and 3 · hi-hat sixteenths and eighths. 2/4:
    bass 1 · snare 2 · tom the last sixteenth of 1, the and of 2. 6/8: bass
    1 · snare 4 · tom 3, 5, 6 · hi-hat every eighth. A beat may be **more
    than a bar** (`RR.Drums.bars` gives its bars; it goes round from its
    first bar at the music's first full bar, Listen's round and round
    carrying the count on); an empty bar holds a rest's place. The user's
    Ostinato Builder backups are kept as they came in `tests/drum-beats/`,
    and `RR.Drums.fromOstinato` reads one — only the bars the song plays
    (Ostinato Builder keeps beats past a song's end that it doesn't play:
    the 6/8 file carries the 2/4's leftovers) — and a test checks every
    beat against its file, the newest file for a meter winning: **a new or
    changed beat = the user's backup → that folder → its lines into
    `RR.DRUM_BEATS`**. A meter with no beat (none now) clicks, and Tools
    says so.
  - **The sounds** are Ostinato Builder's: the shared kit,
    `lib/instruments/js/virtual-instruments.js` (vendored — see its README;
    keep it byte-identical with `Virtual Instrument Assets`). `RR.Sound.drum`
    plays it on Melody Reader's own context through `EVMCountIn.timed`, as
    Ostinato Builder does, so each hit lands on the audio clock; at
    `DRUM_LEVEL` 0.22 × volume, beside the xylophone's compressor (the kit
    soft-clips itself). Measured offline the same day: the snare ~5 dB
    under a low C struck (A-weighted, 150 ms), ~12 under a high E; tom and
    bass well under — so the melody stays on top. (The click is much
    quieter still — that was already so.)
  - **How it plays** (beat.js `pulse` / `pump`, `span` for Listen): a bar at
    a time on the music's bar lines. **The count-in is still clicked** —
    "Get ready 1 2 3 4" — and the drums come in on the music's first full
    bar, as a band's would after the drummer's count (a pick-up plays over
    the last clicks); Listen with the metronome on is the same (a bar of
    clicks, the drums from the first note's bar); Practice's click has no
    count, so its drums start at once; Practice's lessons' round and round
    keep the groove going. Each hit is told how far it is to its drum's
    next one (the kit's fast-repeat sound).

- **The tempo dial and one score for every Test** (2026-10-13, the user's:
  "Instead of having preset tempos, lets give the user a dial from easy to
  hard, going from 56 to 132 bpm. This dial will effect the playback too.
  Lets make the default 72 unless the user changes it, and then let the
  change only apply to that session … if they play the rhythms mostly
  correct — whether with the metronome or not — give them the points they
  would have gotten if played with the metronome").
  - **The dial** (`js/dial.js`, `RR.Dial`) replaced Slow · Moderate · Fast
    — in Tools, and in a battle's metronome pop-up (now `position: fixed`
    beside the button, out of the music card, which clips; a phone: over
    the xylophone). A half circle, **Easy** left, **Hard** right, coloured
    as the points go: green under 70 BPM (up to 15), amber 70–99 (17), red
    100 and up (20), with "Moderate · up to 17 points" under it (no points
    line in Practice or with Points off). It stops on **a classic
    metronome's marks** — 56 58 60 63 66 69 **72** 76 80 84 88 92 96 100
    104 108 112 116 120 126 132 (`RR.TEMPO`, my call: steps a teacher
    knows, and − / + mean something). Drag the knob round the arc or tap
    it (the number in the middle takes no tap); − / + a mark at a time;
    arrows, Page Up / Down, Home / End. Dragging moves only the picture —
    the tempo is set when the finger lifts (keys and − / + half a second
    after the last), so a count-in restarts once. Under it **▶ Start the
    metronome / ■ Stop the metronome** (Start closes the panel and counts
    in, as picking a tempo did). In 6/8 a line says the dotted quarter's
    rate (72 → 48).
  - **The tempo** is `G.tempo`, 72 when anything is picked (`usePractice`
    — a level, a session, a battle, a lesson link, a Practice lesson,
    unit or song — and a set or format played just this time, or the
    set switched): turned, it stays for that until something else starts.
    Not saved; the metronome itself is still Off on every new melody.
    Turning it with the metronome going starts it again at the new tempo
    (a Test or Practice lesson counts in again; Practice's click changes
    step). **Listen, Hear your song, Make a melody and My melodies play at
    it** (`RR.listenTempo`) — the metronome on or off. Practice lessons
    may go up to 132 too (they stopped at Moderate before).
  - **The score** (`RR.Points.score`) is the same with the metronome or
    without it: **every note right first time and in rhythm** — by the
    player's own tempo, about **100 or faster up to 20**, **70–99 up to
    17**, **under 70 up to 15** (the top for a rhythm within 0.06 of a
    beat, one under within 0.10, two under to 0.21 — the old "in rhythm");
    **in rhythm with wrong bars: 2 points off each** (never under what the
    notes alone are worth); **the notes right, the rhythm not: 8**; **not
    in rhythm with wrong bars: the notes as before** (first try 1, second
    ½). The tempo is the least-squares line's; with the metronome on and
    the player within 6% of it, the metronome's when that is faster (so
    playing along at 100 is "about 100"); 98 rounds up to Fast ("around
    100"). A note with a slip is timed by **the first bar struck for it**
    (`G.firstAt`), right or wrong — a wrong bar on its beat is the rhythm
    kept — but not a stray in the count-in. Three to five notes are judged
    a little harder (the leftover ×1.41 for three, ×1.15 for four, ×1.05
    for five): with the rhythm worth up to 20, three quarters played
    short-long counted as in rhythm. Six and up are as they were.
  - **Kinds of score** (My stats): Found the notes · In rhythm, with wrong
    bars · Every note, in rhythm. **With the metronome** became **Your
    tempo** — the melodies played in rhythm by the player's tempo, Slow ·
    Moderate · Fast, darker = every note right first time too (the days'
    `pc` / `pk` keep their shape; the history before today counted Tests
    with the metronome there). The gold star's marks read 8 · over 10 ·
    13 (every note in rhythm) · 16 (in rhythm at 70 or faster).
  - **Practice's gold star is still "with the metronome"** (teach.js,
    `RR.Points.tempoCheck`): no points there, and the gold star is what the
    metronome is for.
  - The practice field `tempos` (Slow · Moderate · Fast's BPMs, hidden
    since 2026-10-06) is gone — `sanitize` drops it from old practices and
    links.

- **The Library** (2026-10-12, the user's: "combine the My Melodies button
  with the Setting Button and call it 'Library'", laid out like Song Writer
  2.5's Library — "the go to place to find anything"). The top bar's ♫ and
  gear are one **Library** button (icon only on a phone). It opens in the
  window that was My melodies (`#melodies`; `js/library.js` draws its list,
  `js/melodies.js` keeps the window and a set's page):
  - **Now playing** — what is on the music, ✎ Change it (its page), ▶ To
    the music (from the home page).
  - **The buttons**, Song Writer's row: **+ New melody** (not New song —
    asks which set it goes in, or a new one, blank = "My melodies", then
    Make a melody) · **Teacher Library** · **Share & backup** (a page of
    its own: the lesson link that was Settings' Share tab — not for
    Practice or Songs, which links can't carry yet — and the melody sets'
    Download / Restore) · **Set up for students** and **Save picture**,
    both marked *soon* and only saying so when pressed (the user: "we'll
    discuss that later"). No Save as.
  - **+ New session** under them — no name needed: left empty it's
    called "Monday's Xylo Workout", "Friday's Xylo Bootcamp"… (today's day
    and one of five titles — Xylo Workout, Xylo Bootcamp, Mallet Madness,
    Note Safari, Rainbow Jam — one not taken; `RR.sessionName`, the name
    shown in the empty box). It's a copy of what is playing (from Practice
    or a song: a session of that) and opens its page. No Battle button
    here: Battle is one of the formats.
  - **The folders**, each a Song Writer group head that folds (which are
    open is kept: `device.libOpen`; My sessions and My melodies open to
    begin with): **My sessions** (▶ Play · ✎ · ×, the format's picture,
    what it plays, its stars) · **My melodies** (the Teacher Library's
    books, Shared with you, Your sets — ▶ Play, Open — and + New set for
    an empty one) · **Songs** (the Songbook: ▶ Play straight through, A
    section… opens the Songs window) · **Practice** (the six lessons and
    your exercises, ▶ Play; + Make an exercise) · **Levels** (the fifteen
    by band, ▶ Play · ✎) · **Settings** (Points, gold stars, celebrations,
    Players, Reset scores, Sound — the Settings window's own sections).
  - In a lesson: Now playing, Leave the lesson, and Settings only.
  The Settings window stays as the **✎ page** of what is playing (opened
  from the Library, the level box's drop-down, the home page's windows),
  with Points and Sound beside it; its Level and Share tabs went into the
  Library. Round done's Settings button is a Library button.
- **A session's Format** (2026-10-12, the user's: "under format it will
  include practice, rounds, songs, games, and Battle — and depending on
  what they pick, more appropriate choices will be given"). On the
  session's page **Format comes first** now (it decides the rest — my
  call; it was below Look & Feel), with the home page's five:
  **Practice** — which lesson, song or exercise (Practice's tiles, tabs
  Lessons · Songs · Exercises) · **Rounds** — how many melodies ·
  **Songs** — which song (the Songbook's or a set of yours), the whole of
  it or a section, Practice, Auto-Next · **Games** — Beat the Clock (30 s
  / 60 s / 2 min) or Endless · **Battle** — the teams, turns and rounds.
  The user chose (asked 2026-10-12) that Practice and Songs play **the way
  their home cards do** (teach.js: `G.mode = { kind: 'teach', …, session:
  { id, name } }`, the chip showing the session's name), the session
  remembering the pick; Rounds, Games and Battle play the session's own
  notes, rhythms, look and source as before (those sections show only for
  them). Changing the format plays it the new way at once.
  **Points** sit under the format: choosing a format sets them — **off
  for Practice and Songs, on for Rounds, Games and Battles** — and they
  can be changed any time (there, or the Points switch in the Library's
  Settings while the session plays); the session keeps what was chosen
  (`points`) and sets the browser's Points switch whenever it is picked.
  Practice and Songs count no points yet, so On shows nothing there (the
  page says so). A session saved before formats takes one from what it
  was: a battle → Battle, a Song → Songs (its first song), Beat the Clock
  or Endless → Games, else Rounds. Leaving Battle keeps the teams for
  coming back.

- **Teach Me to Read** (2026-10-11, the user's design for Level 1; Levels 2
  and 3 made the same way at their ask) — a card on the home page like the
  others, in Make your own to the right of A new session (2026-10-11, the
  user's; it began as a section of its own under the top). Its ▶ Play opens
  a window, as the other cards do — **which level** (the six tiles, each
  with its five marks), **Start at** (any exercise reached; the first not
  yet played to begin with), **↺ Clear its checks and stars** (asked first),
  then ▶ Play Level n. The card's foot says how far this player has come
  ("8 of 30 played · ★ 3"). Three levels, each with an Advanced level, five
  written exercises each (`js/teach-data.js`: the same five every time, two
  bars of 4/4, quarters and eighths only; written as tokens, `GG` a pair of
  eighths, `G'` the octave up).

  **The music card** (2026-10-11, the user's: the notation had become the
  smallest thing on it): from a tablet up, Listen · the metronome ·
  Keyboard stood in a column on the left — since 2026-10-12 Listen ·
  Tools (below) — and ↻ · Next on the right, so the staff has the card's
  whole height; the staff is drawn tighter (`tight`: 1.8 spaces above the
  top line, the letters 2.35 below the bottom — its notes never leave D4 to
  G5), the notes a little closer (fitted at 0.8 of their width, not 0.95),
  and on one row or two, whichever draws it bigger. About 40% bigger at
  1280×800. A phone keeps its row of buttons under the music. The notes are
  in Solid Color.

  | | Notes | The staff's lines lit | Keys lit |
  |---|---|---|---|
  | Level 1 · Mi and So | E G | E yellow, G turquoise | 3 5 |
  | Advanced 1 | E G, low and high | + F green (the high pair sits either side of it) | 3 5 0 = |
  | Level 2 · Add La | E G A | E, G | 3 5 6 |
  | Advanced 2 | E G A, low and high (high A since 2026-10-11 — the low A stood in before) | E, G, F + A's ledger line blue | 3 5 6 0 = + |
  | Level 3 · Add Re | D E G A | E, G | 2 3 5 6 |
  | Advanced 3 | D E G A, low and high | E, G, D orange, F + A's ledger line blue | 2 3 5 6 9 0 = + |

  The other lines are greyed (`RR.teachLines`: a line is lit when its
  note is in the level, F too when the high E or G is; the engraver's
  `lines` option draws them thicker, with a deeper edge so yellow reads on
  the paper). Only the level's bars are live, letter names under the
  notes, the next-bar hint after two slips. **No Practice / Test and no
  score** (the score chip is hidden): play an exercise on your own and it
  gets a **green check**; start the **metronome** (in Tools since 2026-10-12; at the tempo dial's tempo, any of
  56–132, since 2026-10-13 — Slow or Moderate before) — and it counts in at once, then **goes round and round**
  (2026-10-11, the user's: "do not stop it after 1 round, let it repeat" —
  a class can read the board and play along on real xylophones): the
  melody comes back straight after its last bar, the click going on, until
  the metronome is turned Off (or Escape, ↻ to count in again, Listen,
  another exercise, a window). Each time it is played through it is marked
  on its own: every note, no wrong bar and at about the metronome's tempo
  — wherever the player came in — a **gold star** (a slip, or too fast or
  slow for it: a check); the notes stay lit until the next bar is struck,
  which starts the next time round as its first note (2026-10-12: it used
  to be closed by the clock, a note not played in its window missed) —
  the mark floats up each time, the sound and the words only when it goes
  up. **▶ Listen goes round and round too** until pressed
  again — with the metronome on, with its clicks (playing along stops for
  it; ↻ goes back to it). **Free to move** (2026-10-11, the user's:
  "teachers need to move more freely"): **Next** works any time (it lights
  gold once the exercise has its check), every dot at the top goes to its
  exercise, and the window's Start at offers all five. After the fifth, a
  card with the five marks (a dashed circle for one not played): **▶ The
  ones left** if any, else **Try again for gold stars** (unless all five
  are gold — it goes to the first without one and points out the
  metronome), **Advanced Level n ▸** and/or **Level n+1 ▸**, Home. **The computer keyboard** (in Tools since 2026-10-12; a button beside the metronome before) puts a computer
  keyboard in the music's place — the number row, the level's keys lit in
  their bars' colours with the letter (low/high in Advanced), the letters
  row greyed under it when there's room; they play (tapped, or the real
  keys, or the bars — key and bar light together) but nothing counts.
  ♪ Back to the music, the button again or Escape. Marks are kept per
  player, the best of each (`rainbow_reader_teach_v1`); a reload comes
  back to the exercise it was on. The level box's drop-down lists the six;
  Settings shows only Level · Points · Sound. Nothing here goes into
  scores, the ladder or My stats.

- **The landing page, redesigned** (2026-10-12, the user's: "change 'Teach
  Me to Read' to 'Practice' and within the Practice settings will be
  Lessons, Songs, Exercises … Next to it will be Rounds … Songs … Games …
  and finally Battle Mode. Do not include all the battle mode sessions on
  the landing button"). How to play is now **Practice · Rounds · Songs ·
  Games · Battle Mode**; Make your own is My melodies · A new session · A
  lesson link.
  - **Practice** — Teach Me to Read renamed (everywhere it shows: the card,
    the window, the level box "Practice · Level 1", the end card, My
    melodies' strip "▶ Practice"). Its window has three tabs: **Lessons**
    (the six levels) · **Songs** (every Songbook song, slide by slide —
    `RR.teachLevel('S:<song>')`, `RR.teachSongs`; a check and a gold star
    per slide, kept by the slide's content like a unit's) · **Exercises**
    (your units and + Make a unit). It plays exactly as Teach Me to Read did.
  - **Rounds** — as before, with points.
  - **Songs** — new: a song straight through, **no points and no checks or
    stars on the way** — the celebration at the end. Its window: which song
    (the Songbook's, or any melody set of yours — `'M:<set id>'`, no need to
    be an exercise), **The whole song / A section** (Slide _ to _, or tap
    the slide pictures; a new section starts as two slides), **Practice
    Off** (the default) / On and **Auto-Next Slide On** (the default) / Off.
    It plays on the Practice machinery (`G.mode = { kind: 'teach', id, song:
    true, from, to, practice, auto }`, `songAdvance` in teach.js): Practice
    off + Auto-Next — a slide played through hands on to the next **the
    moment its last note is struck**; with the metronome (Tools) the
    click carries on across the slides (`G.swapCard`), so the
    beat is kept all through. Practice on — the slide goes round (Listen,
    the hints), and with Auto-Next moves on after a moment; Auto-Next off —
    Next lights and moves on. A section goes round again from its first
    slide; the whole song ends on **You played …!** (slips counted, "with
    the metronome all the way through!" when it was) — ▶ Hear your song ·
    ↻ Play it again · Another song · Home. On the music card Songs keeps
    the Practice button (pause = on, the red ball = straight through); the
    dots show where you are (a section's outside faded). The level box's
    drop-down lists the songs, and *A section, Practice, Auto-Next…* opens
    the window. Nothing goes into scores or My stats.
  - **Games** — Beat the Clock and Endless: the window opens with the two
    side by side (each with its record), How long for the clock, then what
    to read (Generate · Leveled Challenges · My Melodies, as before).
  - **Battle Mode** — the card no longer lists the battles: its ▶ Play opens
    a window with **Your battles** (teams' colours, part-way, ✎ to change)
    and ⚔️ + New battle.
  The old home Songs chooser (several songs in order) is gone from the home
  page; the Song *format* (with points) is still a session's choice on its
  ✎ page.

- **Every mode has Teach Me to Read's music card, and Tools** (2026-10-12,
  the user's: "I really like the way the Teach Me to Read section looks …
  implement it in the other sections … include a practice button between
  the play and tools button … Remove the text for all three buttons … all
  sections should be able to choose color notes, color lines, names under
  notes … allow Battles to turn off all tools, and for battles put the
  metronome on the outside"). From a tablet up the buttons stand in a
  column left of the staff — **▶ Listen · Practice · Tools** (Teach Me to
  Read: no Practice; a practice with Practice Disabled, Levels 14–15 and
  Beat the clock: none either; a battle: **▶ · Practice · the metronome ·
  Tools**) — with **no words under them** anywhere; ↻ and Next (its word
  kept: it says Finish at the end) on the right; the staff drawn tight and
  as big as it fits, one row or two (game.js draw, `big`). A phone keeps
  the row under the music. **Tools** (`js/tools.js`, `RR.Tools`, moved out
  of teach.js) is the same everywhere: the metronome (the tempo dial and
  ▶ Start / ■ Stop since 2026-10-13 — Off · Slow · Moderate · Fast before;
  not in a battle — beside the music there — nor Beat the clock), then side by side **Computer /
  Keyboard** (with a little keyboard; the picture lights the bars live
  here) and **Auto-Next Slide On/Off**, then Note Colors · Staff Color ·
  Text Below the Notes. **Where a change goes:** Teach Me to Read — the
  browser's, for every level and unit (`RR.teachLook`, now with `auto`);
  anywhere else — the level or session playing, as its ✎ page would
  (`G.base` → `G.saveSetup`: a level becomes *your* Level n, Reset gives it
  back; a lesson's are just for it). **Staff Color** is a new practice
  field `staff`: `'plain'` (the default — every level, session and old
  link looks as it did) · `'notes'` · `'all'`, also on the ✎ page's Look &
  Feel. **Auto-Next Slide** is the practice's `auto` (the ✎ page's
  Auto-Progress); in Teach Me to Read on your own it goes on 1.6 s after
  the check (a strike first cancels it), with the metronome straight away
  into the next exercise, **the click carrying on** (`G.swapCard`; a new
  meter counts in again), and after the last to the end card. **Battles:**
  the battle page's Turns and rounds has **Tools On / Off** (`battle.tools`,
  `RR.cleanBattle`; off hides the Tools button — the metronome stays).

- **Teach Me to Read: Tools and Your units** (2026-10-12, the user's asks).
  - **Tools** — "the metronome and keyboard display … on an extendable
    menu that pops up when needed. With them … change the note color,
    change the staff color". The music card's left column is now ▶ Listen
    and **Tools** (sliders); the metronome and Keyboard buttons are gone
    from it. Tools opens a panel beside the button (over the xylophone on
    a phone, `#teach-tools`, `position: fixed` so it can hang outside the
    music card): **Metronome** Off · Slow · Moderate (a tempo counts in at
    once and the panel closes so the music shows — since 2026-10-13 the
    tempo dial and ▶ Start, which does the same) · **Computer Keyboard**
    (show / back to the music; closes the panel) · **Note Colors** Solid
    Color / Transparent Color / When Played / Black · **Staff Color** Its
    Notes' Lines / All Lines / Black · **Text Below the Notes** Letter
    Name / Solfège / Nothing (my addition — the letters are scaffolding
    too) · **↺ All the colors and letters back** once anything is changed.
    The look changes the music at once, stays open while you try things,
    and is **kept by the browser for every level and unit**
    (`device.teachLook`, `RR.teachLook`) until changed back. While the
    metronome plays, the Tools button turns green with a ticking dot and
    the tempo's name under it (the panel is usually closed); with the
    keyboard showing it says Keyboard in pink. Escape or a tap anywhere
    else closes it. *Try again for gold stars* now opens Tools with the
    metronome pulsing.
  - **Your units** — "take the melodies I've created or create new ones,
    and build a unit that will show up in the Teach Me to Read section".
    A unit is **a My melodies set played the Teach Me to Read way**: big,
    the tight staff, its notes' lines lit (low C's ledger line red, high
    A's blue), round and round with the metronome, a check and a gold star
    for each melody, the keyboard picture with its keys. Any set can be one
    — yours, shared, the Teacher Library's — and stays in My melodies,
    where its melodies are written and changed (any notes C4–A5, any
    rhythm, 2/4 3/4 4/4, one or two bars, up to 60). Three ways in:
    - the Teach Me to Read window: **Your units** under the six levels,
      then **+ Make a unit** — *From a melody set you have* (Use it) or
      *Or start a new one* (a name → a new set, a unit at once, its page
      in My melodies opens to + Add a melody);
    - a set's page in My melodies: a pink **Teach Me to Read** strip —
      **▶ Teach Me to Read** makes it a unit (if it isn't) and plays it;
      Take it out;
    - the level box's drop-down: the units under the six, and **+ Make a
      unit from your melodies…**.
    A unit picked in the window shows its notes, the lines lit, its keys,
    Start at (every melody), **✎ Write and change its melodies** (My
    melodies), **Take it out of Teach Me to Read** (the set stays; its
    marks here go) and ↺ Clear. **⧉ Copy melodies in** (a card beside +
    Add a melody on your own sets) copies melodies from your other sets,
    shared ones and the **Songbook** into this one — so a unit can be
    built from melodies you already have; each source folds open, tap the
    melodies, *Copy n melodies in* (they're copies). The end card counts
    the unit's melodies (*3 of 4 played*, *Four gold stars!*), offers the
    next unit if there is one, and Home. More than twelve melodies: the
    dots become **‹ 5 of 14 ›** with how many are played, the tile says
    "3 of 14 played". The home card's foot counts the units too. Deleting
    a set takes it out of the units; a Teacher Library book put back is
    hidden and comes back with the book.

- **Each level and session is its own** (2026-10-08, the user's report:
  settings "over lapping each other", a battle's score carrying into a
  session until a refresh, a My melodies session playing generated
  melodies and the other way round). The rule: *all of a session's rules
  apply to that session, and the new rules to the new one.*
  - **Picking anything starts clean** (`G.usePractice`): a level, a
    session, a battle or a lesson plays its own saved settings exactly —
    a new round, the score chip and streak at 0, no battle unless it is
    one, the metronome Off, Practice as it says. Nothing from what played
    before comes along.
  - **The levels can be changed** — ✎ on a level's row (Settings → Level)
    or ✎ Edit Level n on the home page opens its page (the session page:
    notes, rhythm, look and feel, format, melody source). It saves as you
    go into *your* Level n (`rainbow_reader_levels_v1`, `RR.LevelEdits`),
    which plays that way every time it is picked; **↺ Reset to the
    original Level n** gives it back. Its badge gets a little ✎ and its
    row a YOURS tag; its scores and place on the ladder stay. "Custom" is
    no longer made by changing a level (an old Custom, or a deleted
    session that was playing, still plays as Custom with its own page).
  - **Melody Source is saved with the session or level**, the set too
    (`from: 'set'`, `set: <id>`): a session made for My melodies always
    plays them; a Generated one never does. A set deleted or not on this
    computer: the page says so and the melodies are made up until one is
    picked.
  - **Just this time** (`G.over`) — things played on top that are never
    saved into the level or session: the home page's **format cards**
    (Rounds · Songs · Beat the Clock · Endless — "Level 3, just this time
    — its own way stays as it is"), **▶ Play this set** in My melodies,
    and **Practise these** (tricky notes) on the Score board. The home
    page lists them under what is chosen, *Just this time:* chips with ×;
    the ✎ page says so at its top, with **Play its own**. A reload keeps
    them; picking anything ends them. Changing the format on the page
    ends a format played just this time; changing the source ends a set
    played just this time.
  - **The browser no longer shapes what is played**: the old browser-wide
    game, set and tricky notes are gone from the device (a set that was
    playing carries on once, just this time, over what was playing).
    The browser keeps only its own: the sound, the volume, Points / Gold
    stars / celebrations shown, the players.
  - **Lesson links carry everything** — the whole practice (every field,
    so a default changed later can't change an old link), the source set
    (`&m=`), the Song format's My melodies sets (`&ss=`, played as
    `set:lesson_1` …) and a battle's teams, turns and rounds (`&b=`; a
    battle has a Share tab now). Older links still open as before.

- **The home page** (2026-10-07, the user's ask: "a neutral page", not
  always mid-game) — the app opens here (a lesson link still opens on the
  music). From the top:
  - **Play / Carry on** — what was playing (the level or session and its
    game, "1 of 5 played" while a round is under way), the player's points
    and gold stars (all time) and days in a row; the players' names to
    switch, when there are any. A round that is over, or a Beat the clock
    left part-way, starts afresh.
  - **How to play** — straight after the top since 2026-10-08 (the
    *What to read* section — the ladder, the session chips — was taken
    out at the user's ask; sessions are in Settings → Level). A card each:
    **Rounds** (− n +, the best), **Songs** (the songs picked, in order),
    **Beat the Clock** (30 s · 60 s · 2 min, the record), **Endless** (the
    longest run), **Battle** (the battles, + New battle — as before).
    **A card's ▶ Play never starts anything** (the user: "ask first"): it
    opens a window with its own ▶ Play. **Songs** — the song chooser (the
    card's Choose… is gone). **Rounds, Beat the Clock, Endless** — the
    round's length or the clock's (in step with the card), then *What do
    you want to read?*:
    - **Generate** — only Choose the Notes and Choose the Rhythm (the ✎
      page's two sections, `RR.Settings.draftHtml/draftClick` on a draft);
      it starts from the last one played (`device.gen`). Plays as Custom
      "Generated" (scores under `gen`; its ✎ page changes `device.gen`).
    - **Leveled Challenges** — the fifteen badges with their stars (✎ on
      your own), the one picked described, **✎ Change Level n** (its page,
      then back to the window). Plays the level with that format just this
      time.
    - **My Melodies** — your sets (Teacher Library and shared ones too),
      **+ Write a new set** / Open My Melodies… (then back to the window).
      Plays the set as Custom "♫ Week 3" with Generate's helps (scores
      under `set:<id>`). ▶ Play is greyed until there is a set.
    The window opens on what was picked there last (`device.homePick`) —
    still asked, never started.
  - **Make your own** — My melodies, a new session ("My session 2", its
    page opens to name it), a lesson link (Settings → Share).
  - **My stats, in brief** — the last 7 days as columns, today's and this
    week's melodies, points, first try and time, and See them all ▸.
  - Getting about: the **Melody Reader name** (and its logo) is a button
    to the home page from anywhere (2026-10-07; on the home page, back to
    its top). **‹ Home** at the top left of the music (where ‹ Eagle
    View is on the home page; it shows inside a frame too), **Home** on
    Round done, Time's up and Battle over, and the browser's Back — one
    history entry above home, so Back from the music or My stats comes
    home and Back from home leaves. Leaving the music pauses it (a
    count-in stops; Beat the clock is over). Settings' ▶ Play goes to the
    music from anywhere.
- **The level box at the top: a drop-down for *how*** (2026-10-08, the
  user's design — "when the user clicks the drop down, they want to change
  an aspect of what they are already doing, not to do something
  different"; the Melody Reader name is for choosing something else). The
  box sits at the centre of the top bar (three columns from 481 px: the
  way home · the box · the scores; on a narrow phone it fills the room
  between them). A tap drops a panel under it (`js/drop.js`, `RR.Drop`)
  showing only what fits what is playing: **a level** — the other levels
  (the same format: a round of 7 stays a round of 7) · **a session** — the
  other sessions · **Generated** — Choose the Notes and Choose the Rhythm,
  changed in place · **a Song** — the songs, in order · **My melodies** —
  the other sets, ✎ Edit this set, + Write a new set · **a battle** — its
  teams, turns and rounds · a lesson — the Lesson tab, as before. Its foot
  opens the ✎ page of what is playing (✎ Change Level n, ✎ Change <the
  session>, ✎ Look & Feel and more, ✎ Notes, rhythms and more); the gear
  still has everything. Picking another level, session or set starts it;
  the rest takes effect when it closes (`RR.Settings.settle`). The panel
  uses Settings' own sections and controls (`sectionHtml`, `liveClick`,
  `battleClick/Input/Change`).
- **My stats** (2026-10-07, the user's ask: "beef up the statistics") — a
  page of its own (the home page, or 📊 All my stats on the Score board,
  which then has ‹ Back), for the player playing:
  - **The totals** — points earned, melodies read, gold stars, notes
    read, right first time, time playing, rounds finished, days in a row
    (and the best run).
  - **Over time**, one range above it all (7 days · 30 days · 12 weeks ·
    All time — by the day, the week, or after two years the month):
    **Activity** (points, melodies or minutes) · **Right first time** (a
    line) · **Average score** (points a melody, a line — the volume can't
    hide whether they're getting better) · **Note by note** (a little
    xylophone, each bar as tall as its first-try share, ▲▼ against the
    range before, the trickiest ringed) · **How your melodies scored** (one
    bar: found the notes / in rhythm, with wrong bars / every note, in
    rhythm — 2026-10-13; it was own steady beat / with the metronome —
    then checks and gold stars) · **Your tempo** (2026-10-13, was With
    the metronome: the melodies in rhythm, Slow · Moderate · Fast by the
    player's tempo, darker = every note too).
  - **Recent** — the last 50 melodies (a column each by kind of score, the
    average of ten as a line, ▲ up from the ten before) and **Every day
    you played** (a calendar, 26 weeks, fewer on a phone).
  - **All time** — the levels' stars (and the sessions'), **Records** (best
    round, Beat the clock per length in notes, longest Endless run,
    longest streak, busiest day), **Mix-ups**, **Last games**, **Best
    rounds** from every level and session; Reset scores.
  - Every chart has a tooltip (hover, or a tap) and a **Table** button
    with the same numbers. With Points off no points show anywhere (the
    charts that are only points go); with Gold stars off, no gold stars.
    Colours checked with the dataviz validator: amber `#d97706` for
    amounts, teal `#0d9488` for first try, one amber ramp for the three
    kinds of score (`#e59a3a · #c06a10 · #7c3f0a`) and the calendar.
  - **What it counts** (`js/history.js`): a melody finished in a Test,
    once — a try again replaces it, Start over on an untouched card takes
    the round's back, as the round does; points before Points off; notes
    as they're read; time in 5-second steps while the music is on screen,
    the page visible and someone has touched it in the last minute (not
    while writing a melody). Practice never counts; battles are the
    teams', not here. Points, gold stars and time count from the day this
    version first opened (`since`, said under the totals) — melodies,
    notes and first try were counted before and carry on.

- **The xylophone** — Rainbow Xylophone's look and both sounds (Vibraphone,
  Marimba), touch with glissando, mouse and pen (either button), keys 1–0
  − = + and the number pad; ten bars, twelve when a practice uses F5 or G5,
  **thirteen with high A** (2026-10-11, the user's: most school xylophones
  go up to high A — its key is **+**, Shift and =; blue, on a ledger line
  above the staff; Make a melody has all thirteen; the Notes picker offers
  it; `RR.ALL` is all thirteen, `RR.TWELVE` stays C4–G5 so the fifteen
  levels keep their range, `RR.barsFor` picks 10/12/13); bars not in the
  music greyed out at the first levels.
- **The music** — Leland engraving of one or two bars. **Stems and beams
  (2026-10-12, the user's):** a stem is twice the usual thickness (0.26 of a
  staff space, `STEM` in engrave.js) and sits **behind** its head — stems,
  flags and beams are drawn first, the heads over them; under a see-through
  head (Transparent Color, not yet played) the paper hides the stem, just in
  the stem's column, so the staff line still shows through the rest. Beams
  are half what they were: 0.75 of a space (`BEAM`; three times the usual
  1.5 from 2026-10-11, halved now); a sixteenth's second beam sits 0.4
  clear of the first, its stems no longer than an eighth's unless it needs
  them; a flag sits on the far edge of the thicker stem. Coloured notes (pale
  until played), lit when played, or black; the next note's glow; ghost
  notes where a slip landed; letter names or rhythm syllables under the
  notes; two rows on a phone held upright.
- **The controls** (2026-10-05, the user's layout) — under the middle of
  the music: **▶ Listen** · **Practice / Test** · **the metronome**; beside
  Next, **↻ Start over** (no word); the round's dots top centre; the melody's
  name ("Hot Cross Buns · 1 of 4") in the level box at the top (one line from
  1180 px, two lines below). The Practice tag, I'm ready, Again, the drum
  (Count me in) and the pace pill are gone.
  - **Practice / Test** — Practice is on by default: a blue pause sign. Pressed,
    it becomes Test: a red ball in a red ring (record), pulsing while a try is
    under way. Practice: Listen, try the bars (the notes light, nothing counts).
    Test: with the metronome Off the notes are simply live — the first bar
    struck starts a try on your own; with the metronome on, the count-in
    starts at once. Back to Practice at any point calls the try off (it
    never counts). Levels 14–15 (no Practice) and Beat the clock show Test,
    greyed; One go locks it once a Test has begun.
  - **Which stage a card opens in** (the user's rule): Practice — unless the
    player went to Test on the last card *before striking a bar in Practice
    there*; then the next card opens in Test (they want to play without the
    practice). Practised, then tested → Practice again. Kept for the visit;
    a new level, set or player starts with Practice on (`G.fresh`).
  - **The metronome** (one way everywhere since 2026-10-06 — Battle Mode's;
    since 2026-10-13 **the tempo dial** and ▶ Start / ■ Stop — see *The
    tempo dial* at the top; until then a choice of **Slow · Moderate ·
    Fast**). Starting it in a Test **counts in at once**; in
    **Practice it starts clicking at once — no count-in** (2026-10-07, the
    user's): the card's beats, the bar's first higher, a nod of the button
    on each, for as long as the card is in Practice with the metronome on
    (a window or the home page stops it; closing the window brings it
    back). Listen joins the click, coming in on its next bar line. Test
    stops the click and counts in, as before (`syncTick`, game.js; the
    click itself is beat.js's `tickStart`). The
    label under it says which, it lights green, and its weight sits higher
    on the arm for slower, as on a real one. It is **Off again on every new
    melody** — nothing counts in by itself: no rolling on to the next
    melody, no count-in after a window closes (only Start over, Space, or
    picking a tempo start one). Off each time the page opens (not saved).
    Changing it mid-Test starts the try again at the new tempo. Listen plays
    at the dial's tempo, with the metronome's clicks when it is on (a bar of
    them first); Off: no clicks.
  - **Stopping a count-in** — tapping the *Get ready 1 2 3 4* card while it
    counts (or Escape) stops it and goes back to Practice, the pause; the
    metronome stays on. (No Practice here: the Test waits.) The family card
    takes no clicks; `style.css` lets it here, only while the phase is
    `countin` (`html.ci-tap`) — not in the last half beat, when a bar under
    it may be struck early for the first note.
  - **↻ Start over** — a card with anything played (or a try under way, or
    done) starts that card again, same stage; an untouched card starts the
    whole round again from its first melody (the same melodies, the round's
    points taken back, the streak as it was). A card counts once in the
    round: tried again, the new try replaces its entry. One go: no starting a
    begun Test over.
- **My sessions** (2026-10-05, the user's ask) — the top of the level list
  (the level box opens it). Type a name, **+ New session**: a copy of what is
  playing becomes a session and its page opens — every choice on one page:
  the name, the notes (and how they move, End on Do), the rhythms (time,
  length), how it looks and the helps (coloured notes, letters and numbers on
  the bars, the glow, ghost notes, under the notes, Practice first, Listen),
  the gold star, the metronome's tempos, One go, Flash, the game (Round of
  5/10, Song, Beat the clock, Endless) and where the melodies come from. The
  app makes up new melodies from it every time. A session saves as you go —
  it never turns Custom — and keeps its own game (a level plays the
  browser's). While one plays, Settings shows Level · ✎ Session · Points ·
  Sound · Share. ✎ on a row opens its page, × deletes it (its scores too; if
  it was playing, what it was carries on as Custom). Each session has its own
  best scores. The old Mine band's practices became sessions the first time
  this version opened (`rainbow_reader_sessions_v1`), their scores with them.
- **Battle Mode** (2026-10-05, the user's ask) — a kind of session that teams
  play in turns. **⚔️ + New battle** (beside + New session) names it and opens
  its page with **the teams first**: 2–4, each a name and one of 8 colours (a
  colour another team has swaps; a name still its colour's, "Blue team",
  follows the colour), + Add a team, × to take one out. Then **Turns and
  rounds**: 1, 2 or 3 melodies a turn, and 1–20 rounds (− / + or type) — the
  sum shows ("3 teams × 2 melodies × 2 rounds = 12 melodies") — then the
  usual notes, rhythms, look, gold star, metronome (no Game: the battle is
  the game). New battles start with Practice first off (a Test for points;
  it can be turned on). Playing: a card starts the battle (the teams, who
  goes first) or offers to **Carry on** one left part-way (kept in
  `device.battle`, so a reload resumes); each team's turn is a card in its
  colour (*Blue team — Go ▸*; Enter works); between rounds the standings;
  at the end *Battle over — the winner* 🏆, the table, Battle again · Change
  the battle. **The metronome** works as everywhere: each team picks a tempo
  for each melody. **Fair melodies** (2026-10-06, the user's): every melody of
  the battle is planned when it starts (`RR.Melody.battlePlan`). A sample of
  what the session can make is scored for difficulty (`RR.Melody.difficulty`:
  sixteenths, dotted notes, rests, leaps, the ledger line, the range); each
  round takes a target — easier early, harder late, wobbling a little — and
  a rhythm focus it didn't have last round (more variety); its first melody
  is the one nearest the target, and **every other team gets the same
  rhythms in another order with other notes of matching difficulty** (in
  testing, within about 1 point of each other on a scale where a battle runs
  ~15 → ~40). Battles make up their melodies (no Songbook cards) unless a My
  melodies set is played. The plan is saved with the battle, so Carry on
  after a reload stays fair; changing the notes or rhythms part-way re-plans
  only the rounds still to come. While it runs the music card wears the team's colour, its name
  sits with the turn's dots at the top, the level box says "Round 2 of 5",
  and the **score chip becomes the teams' scores** (the team playing
  ringed; a phone shows dots and numbers). The **Score board** shows the
  standings and each round's points per team, then tricky notes. Points go
  to the team (not the player's total); with points off a battle counts
  gold stars. Next skips (0 for that team); ↻ on an untouched melody asks
  before starting the whole battle over. Listed with the sessions, marked
  **Battle**, with the teams' colours. Changing the teams, melodies a turn
  or rounds starts the battle again; names and colours change at once.
- **After each melody: a check and a gold star** (2026-10-05) — no words: a
  green check when the melody was played through (with the metronome: no
  note missed), or — in its place, never both — a gold star when it scored
  **over 10** of 20 —
  a practice's own mark can be 8+, over 10, 13+ or 16+ (How to play → The
  gold star). They float up and fade as the words did; the points still fly
  to the score chip, and the words still go to a screen reader. Practice's
  "Got it!" is a check too. The round's dots, Round done and the Score board
  show each melody's check, star or a grey dash (missed notes, skipped); the
  score chip's ★ counts the round's gold stars. The ladder (the level list's
  ★★★ and Level n+1 ▸) still runs on the 1–3 stars inside (`starsFor`).
- **Count me in** (the count-in run, `beat.js`) — the family count-in (*Get
  ready 1 2 3 4*), then the metronome at the tempo dial's tempo (2026-10-13;
  it was **Slow 60 · Moderate 80 · Fast 100**), **for as long as the player
  takes** — it stops when the melody is played through (or Off, ↻,
  Practice, Next, a window). **The notes are followed in order, as on your
  own** (2026-10-12, the user's: "it wants the user to play exactly at the
  correct moment in the metronome — so if it's on beat three and you're on
  beat one, it will consider what you're playing as on beat three even if
  that's the first note you've played. I don't want it that strong — I
  just want it to click and to light the notes up in order"): the next note
  lights when its bar is struck, whenever that is — during the count-in too
  — any other bar is a slip with its ghost note, the next note's glow shows,
  and nothing is ever Missed by the clock. (Until then each strike was
  matched to the note its click said was due — `RR.Points.follower`, gone —
  so coming in two beats late made the first strike note 3.) Practice has no
  count-in run (it had a "That would be 14 points" one until 2026-10-05).
- **Points: 1–20 a melody** (`js/points.js`) — *since 2026-10-13 one score
  for every Test, by the player's own tempo: see* The tempo dial and one
  score for every Test *at the top. What follows is how it was:* **1–8** finding the notes
  (first try 1, second ½); **9–12** every note first time in your own steady
  beat (a least-squares fit finds your tempo; the leftover, in beats, is the
  grade — 12 ≤ 0.06, 11 ≤ 0.10, 10 ≤ 0.15, 9 ≤ 0.21, else 8); **13–20** a
  Test with the metronome, every note first time **at about its tempo**:
  Slow 13–15, Moderate 16–18, Fast 19–20. **Where the player came in doesn't
  matter** (2026-10-12, the user's: "if the user played the melody at
  basically the correct tempo — even if they started on beat 3 instead of
  beat 1 — count that as correct"): `RR.Points.tempoCheck` takes the
  player's own tempo from the spacing of their notes (tier 2's least-squares
  line) and compares it with the metronome's — within 15% and steady (≤ 0.21
  beat) is with the metronome; the top of the pace for ≤ 0.06 beat and
  within 4%, one under for ≤ 0.10 and 6%, else the bottom (Fast: 20 / 19).
  Faster or slower than that scores as on your own, 9–12, and says which
  ("a little slower than the metronome"); a wrong bar drops it to 1–8 (a
  note found second time ½). Stars: ★ 1–7 · ★★ 8–12 · ★★★ 13–20;
  next level at ★★ or better in 4 of 5. The streak counts 8+ in a row (no
  bonus). Points and stars can each be turned off.
- **Games** — a round of any 1–99 melodies (− / + or type it; 2026-10-05 —
  there were only 5 and 10; more than 12 show "3 of 30" and a bar instead of
  dots; the ladder counts rounds of 5 or more), Song (card by card, then *Hear your song*),
  Beat the clock (30 s · 60 s · 2 min), Endless. Since 2026-10-08 the
  game belongs to each level and session (its page's Format); it used to
  be the browser's, laid over every level.
- **Fifteen levels** in six rainbow bands — **redone 2026-10-07 in a music
  teacher's order** (the user's two sequences; this supersedes the design
  folder's LEVELS.md). Every level is made-up melodies only (no Songbook
  cards; the Songbook stays for Song and for sessions). Solfège with C =
  Do (the xylophone has nothing below C, so there is no low La or So —
  the user chose high Do for Level 5):

  | Level | Notes | Moves | Rhythm (new) |
  |---|---|---|---|
  | 1 Mi and So | E G | Steps | ta, ti-ti |
  | 2 Add La | E G A | Steps | — |
  | 3 Add Do | C E G A | Steps | sh (quarter rest) |
  | 4 Add Re | C D E G A (pentatonic) | Steps | — |
  | 5 High Do | + C5 | Steps | ta-a |
  | 6 Add Fa | + F (no B) | Steps | — |
  | 7 Add Ti | C to high C | Steps | ti-ri-ti-ri |
  | 8 The whole octave | C to high C, half the melodies La-based (end on A) | Skips | — |
  | 9 Up to high E | C4–E5 | Skips | sh-sh, ta-a-a-a |
  | 10 Up to high F | C4–F5 | Skips | — |
  | 11 Up to high G | E4–G5 | Skips | syn-co-pa, tam-ti |
  | 12 Leaps of a 4th | two-octave pentatonic | 4ths | — |
  | 13 Leaps of a 5th | D4–G5 | 5ths | ti-ti-ri, ti-ri-ti |
  | 14 Six-eight time | C4–F5 | 4ths, 5ths | 6/8, pick-ups |
  | 15 Everything | all twelve | 4ths, 5ths, major 6ths | 4/4 or 6/8 each melody, pick-ups |

  Every level before 15 leaves some bars out; major 6ths only at 15, and
  never all three kinds of leap in one melody. Each level's new note and
  new rhythm come up more often (`focus`, hidden from Settings). The helps
  climb as before (colours → lit → black, letters off from 12), except
  that Level 14 keeps Practice and Listen (6/8 is new there) — Level 15
  is the one sight-reading level (no Practice, one go, Flash).
  **The ladder started fresh** (the user's choice): level scores are kept
  under `lv2:<n>` (`RR.levelKey`); the old ladder's `'1'…'15'` stay in the
  scores file, unused (My stats hides their best rounds).
- **Meters and pick-ups** (2026-10-07) — 2/4 3/4 4/4 and **6/8**, as many
  as a practice likes (`times`; each melody uses one; `time` is the first).
  6/8 has its own cells (ti-ti-ti, ta ti, ti ta, tam, tam-a, a dotted
  quarter rest, ti-ri ti ti), beamed in threes, counted in 1 2 · 1 2 on the
  dotted quarter at 2/3 of the tempo (the eighths move as fast as in 4/4).
  **Pick-ups**: half the melodies start before the first bar line — a beat
  (ta or ti-ti) in 2/4 3/4 4/4, an eighth in 6/8 — and the last bar is that
  much short, as in print; the count-in brings them in on time (a beat's
  pick-up in 4/4 is counted 1 2 3, played on 4), Listen's bar of clicks
  too. Settings → Rhythm: the Time row takes any of the four, a Pick-ups
  switch, and the 6/8 cells under the others when 6/8 is on. **Leaps**:
  Melodic Difficulty → Leaps too now asks which — a 4th, a 5th, a major
  6th — by interval (never a tritone), with seconds and thirds; an older
  practice's Leaps too reads as 4ths and 5ths (it used to allow anything
  up to an octave). The rhythm names are the Kodály ones (ti-ri-ti-ri,
  tam-ti, ti-ti-ri, ti-ri-ti, syn-co-pa).
- **Settings** — Level (My sessions on top, then the levels with their best
  stars and ✎), ✎ the page of what is chosen (✎ Level n · ✎ Session ·
  ⚔️ Battle · ✎ Custom), Points, Sound, Share (2026-10-08: the levels'
  Notes · Rhythm · Format · Look & Feel tabs became their ✎ page).
  *2026-10-12: no gear any more — the Level tab (sessions, levels) and the
  Share tab moved into the Library; the window is the ✎ page, Points and
  Sound.*
- **The session page, laid out by the user** (2026-10-06; a battle's the
  same, with its teams first): **Session Name:** [the name] **▶ Play
  Session** on one row (Battle Name / Play Battle) · **Choose the Notes** —
  the staff and the bars (the quick-pick buttons, End on Do and Practise my
  tricky notes are gone; a session never ends on Do by itself, tricky notes
  live on the Score board) and **Melodic Difficulty** Steps / Steps and
  skips / Leaps too · **Choose the Rhythm** · **Look & Feel** (the Helps,
  then **Auto-Progress to next melody** On / Off) · **Format** Rounds (how
  many) / Song / Beat the Clock / Endless — **Song** lists every Songbook
  song and every My melodies set; pick any number (numbered in the order
  they'll play; `songPicks`, e.g. 'ode', 'set:<id>') · **Melody Source**
  (not for Song) Generated / My Melodies / Songbook, then Open My
  Melodies… (a battle: Generated / My Melodies). No explaining notes, no
  Delete (× on the session's row). The level tabs are the same sections and
  were renamed to match: Notes · Rhythm · Format · Look & Feel. A level's
  old "made up + Songbook" shows as Generated (it still mixes the level's
  own songs in); a session's is saved as Generated. Songbook as a source
  with no songs of its own plays every song that fits the notes.
- **The Helps, in the user's words** (2026-10-06; the same table on a
  session's and a battle's page): **Note Colors** Solid Color / Transparent
  Color / When Played / Black (2026-10-11: Solid Color is new — full colour
  from the start, a halo when played; Transparent Color is the old Always,
  see-through until played; Levels 1–3 and Teach Me to Read are solid, the
  default for anything else stays Transparent) · **Xylophone Bar** Letter Name / Number / Both / Neither (sets
  `letters` + `nums`) · **Xylophone hint** Never / After 2 slips / Always ·
  **Grey out unused bars** On / Off (moved here from Notes) · **Text below
  the notes** Letter Name / Solfege Name (C = Do, tinted like the letters) /
  Nothing · **Practice** On (default) — each melody starts in Practice / Off
  (default) — starts in Test, Practice a tap away (`practiceStart: 'off'`) /
  Disabled · **Play button** Animates music and bars / Plays sounds only (no
  note glow, no bar lights) / Disabled (no Listen at all, not even after a
  Test). Gone: Ghost notes (always on now, the sight-reading levels too),
  Hearing it lights the bars (in Play button), and from How to play the gold
  star, the metronome's tempos, Flash and One go — their values stay as they
  are (Level 15 still flashes, 14–15 are still one go, tempos 60/80/100 —
  gone 2026-10-13 with the dial — the star over 10). Rhythm syllables went with Under the notes: Levels 7–8 now
  show nothing below the notes, and an old practice or link with rhythm
  syllables reads as Nothing (the engraver can still draw them).
- **Score board** — this round, best scores per practice and game, tricky
  notes on a little xylophone and the mix-ups (*You played F for E*),
  *Practise these*, totals, Reset.
- **Lesson links** — Share → a link that opens the practice as a lesson,
  with every setting, its melody sets (as melodies) and a battle's teams
  (2026-10-08).
- **My melodies** (the ♫ button until 2026-10-12; now the Library's My
  melodies folder) — melody **sets** kept by the family's EVM
  Library rules: + New set, rename, reorder, delete; ▶ Play this set (with
  the chosen level's judging, helps and tempo — the chip reads "Week 3 ·
  Level 4"); Copy a link (`?set=` — opening it files the set once, read-only,
  as in the other apps; a newer version replaces it; Save my copy makes the
  student's own); Download a backup / Restore from a backup (also reads
  Librarian files); the **Teacher Library** shelf (books taken out arrive as
  shared sets; Put back removes them).
- **Make a melody** — the music card becomes the editor: pick a value (ta-a-a-a
  … ka), strike bars (or keys) to write notes, Rest, ⌫ (Backspace), ▶ (Space),
  2/4 · 3/4 · 4/4, 1 or 2 bars; values that don't fit what's left of the bar
  grey out; the empty beats show faintly; Save asks to fill a half-written
  melody with rests.
  **Slides** (2026-10-12, the user's: "it only lets me make one slide … make
  many slides under the same file"): every melody of the set is a numbered
  slide along the top of the maker. **+ New slide** (or **Enter**) saves this
  one and starts a blank one after the last, in the same time and length; a
  number goes to that slide, saving this one first; **Delete this slide**
  (asked). A half-written slide is filled with rests when it is left (asked,
  as Save does); an untouched blank one is dropped. Save saves this slide and
  goes back to the set; Cancel leaves only this slide's changes unsaved.
  **Relaid the same day** (the user's: "you simply make the staff get smaller
  and smaller as we add more and more rows to the already vertically small
  window"): at 1000×560 the maker's three rows of controls had left the staff
  27 px. Now the music card holds the staff and ONE slim line — the set, the
  slides, + New slide, what is left of the bar, Cancel, Save. The writing
  tools (the values, Rest, ⌫, ▶) are one bar between the card and the
  xylophone (`#maker-dock`, the stage's middle row while making: 60 / auto /
  40), so their height comes out of the xylophone — which gets a slimmer
  frame, no bolts, bars nearer one length and the number under the letter, so
  nothing collides. The slide's name, time and length (set once a slide) and
  Delete this slide are behind its **✎ 4/4 · 1 bar** button, in a little
  window that pops up over the music (Done, Escape or a tap elsewhere). The
  staff is drawn in Teach Me to Read's tight row and up to a smartboard's size
  (ss 46; it was capped at 30), and a two-bar slide draws as two rows when
  that is bigger (a phone). Staff height, 5 lines: 1000×560 27 → 81 px,
  820×600 → 81 px, 1280×800 ~65 → 148 px; a phone's two-bar slide fills the
  card in two rows. On a phone the set's name goes, the dock wraps (values a
  row of their own, "2 beats left" beside ✎) and the window drops from the
  top.
- **Players** — first names (Settings → Points, or the Score board's "Who's
  playing?"); each has their own scores, stars, tricky notes and session
  points; the first name takes over the scores kept so far; removing a name
  removes that player's scores (asked first).
- **Publishing** — the Librarian lists Melody Reader sets and publishes them
  as `rainbow-reader--<id>.json` (`data: { melodies }`).

- **Phase 6 — accessibility and the site** (2026-10-03):
  - *Keyboard*: the xylophone is one stop in the Tab order (arrow keys move
    along the bars, Home/End, Enter or Space strikes); the number keys still
    work from anywhere. Tab stays inside an open window, and closing it puts
    the focus back where it was. Focus rings show on wood, paper and frame.
  - *Contrast* (WCAG AA, every pair measured): dark text on the gold
    buttons, a deeper green, deeper judgement colours, dark key numbers on
    light pills, white bar letters with a dark edge, level numbers dark in
    a ring of the band's colour. The white "Melody Reader" on the wood is
    the logotype (exempt) and keeps Rainbow Xylophone's look.
  - *Screen readers*: the music is described (title, meter, bars, notes,
    how many played — never the note names, which would read it for them);
    results, Round done and Time's up are announced; every control is named.
  - *Reduced motion*: no pops, sparkles, pulses, nudges or sliding toasts.
  - *Sizes*: a narrow phone gives the logo's place to the home link; a
    smartboard (≥1500 px) gets a bigger staff (staff space up to 46 px) and
    bigger bars.
  - *The site*: a back-to-hub link (‹ Eagle View, `../index.html`, hidden in
    a frame — Rhythm Poetry's), `assets/MA4A-rainbow-reader-cover.jpg`
    (400×400), and the hub card in the landing area's *Read Music* group.
  - *Sessions played through*: a phone (375×812, taps) and a smartboard
    (1920×1080, clicks and a slide) — a card, a level change, a With the
    beat run, a melody written and saved.

## Where it is

- Sandbox: here. Landing area: `../Eagle View Music/Rainbow Reader/` (copied
  2026-10-03, with its hub card). **Not** in the GitHub folder
  (`App Projects/Eagle View Music/`) and **not** live — that push is the
  user's call. The landing area's other apps still carry the older
  `evm-shelf.js` (it only lacks the words "melody set" and "Rainbow
  Reader"), and its Librarian lacks the Rainbow Reader source, until those
  folders are promoted too.
- The rename to Melody Reader (2026-10-03) is in the sandbox only: the
  landing area's copy is still the folder `Rainbow Reader/`, and it, its hub
  card and its cover still say Rainbow Reader. Promoting it means copying
  this folder to `../Eagle View Music/Melody Reader/`, pointing the hub card
  at `./Melody%20Reader/index.html` (and its new name), and removing the old
  `Rainbow Reader/` copy there. `assets/MA4A-rainbow-reader-cover.jpg` here
  was retaken with the new name and logo (the file name is kept).

## Files

| File | What |
|---|---|
| `index.html`, `style.css` | the page |
| `js/core.js` | the RR namespace, the bars, storage, the device's settings, toast, the yes/no window, foldable ⓘ notes |
| `js/sound.js` | the two voices, the click, the audio-clock helpers (`heardNow`, `eventTime`, `heardAt`) |
| `js/xylophone.js` | the bars and their input |
| `js/engrave.js` | the staff |
| `js/songbook.js`, `js/melody.js` | the Songbook; rhythm cells and the generator |
| `js/levels.js` | the ladder, the defaults, `sanitize`, the gold star's marks, My sessions (their Format, points, picks — `RR.SESSION_FORMATS`, `RR.formatPoints`, `setFormat`; `RR.sessionName`) |
| `js/game.js` | the card, Find the notes / No slips, scoring, rounds, games, Play; `RR.Scores` |
| `js/beat.js` | Count me in: the count-in, the metronome (at `G.tempo`) |
| `js/points.js` | what a try is worth (1–20, `score`: the notes, the rhythm and the player's tempo), the stars, the paces (Slow · Moderate · Fast by tempo), the dial's marks (`RR.TEMPO`, `RR.snapTempo`, `RR.beatTempo`) |
| `js/dial.js` | the metronome's tempo dial (2026-10-13): drawn in Tools and the battle's pop-up, its pointer, keys and − / + (`RR.Dial.html/bind`) → `G.setTempo`; Click · Drum beat above it (`RR.Dial.soundHtml`) → `G.setBeatSound` |
| `js/drums.js` | the drum beat (2026-10-13): the user's beats per meter (`RR.DRUM_BEATS`), a meter's bar of hits (`RR.Drums.bar`), an Ostinato Builder song read as lines (`fromOstinato`) |
| `lib/instruments/` | Ostinato Builder's drum kit (the shared `virtual-instruments.js`, vendored 2026-10-13) |
| `tests/drum-beats/` | each drum beat's Ostinato Builder backup, as the user made it |
| `js/settings.js`, `js/board.js` | the ✎ page window (a session's Format first, 2026-10-12) with Points and Sound — their sections also drawn in the Library; the Score board, Round done, Time's up |
| `js/library.js` | the Library (2026-10-12): Now playing, the buttons, + New session, the folders, Share & backup, New melody; `RR.Library.open/newSession/newMelody` |
| `js/lesson.js`, `js/app.js` | lesson links; the keys, the buttons, the start |
| `js/sets.js` | My melodies' data: melody sets by the EVM Library rules, links, backups, the shelf; the app's own songs and lessons as sets (`songbook:`/`practice:`) and your copies of them (copy on the first change, `copyOf`, `onCopied`, 2026-10-13) |
| `js/melodies.js`, `js/maker.js` | the Library's window (`#melodies`, was My melodies) and a melody set's page in it; Make a melody |
| `js/players.js` | names on a shared computer |
| `js/history.js` | My stats' history: the days, the last 200 melodies, the last 60 games, records, time playing; ranges and streaks (pure, tested) |
| `js/charts.js` | the SVG charts (columns, line, calendar, one split bar) and their tooltip |
| `js/stats.js` | the My stats page |
| `js/home.js` | the home page, and the three views (`RR.View`: home · play · stats) with the browser's Back |
| `js/drop.js` | the level box's drop-down: what can be changed about what is playing (2026-10-08) |
| `js/teach-data.js` | Teach Me to Read's six levels and their exercises, the staff's lit lines, the gold-star rule, each player's marks; your units (`RR.TeachUnits`, a unit built from its set); the look (`RR.teachLook`, `RR.teachStaff`) (pure, tested) |
| `js/tools.js` | Tools, in every mode: the panel (metronome, Computer Keyboard, Auto-Next Slide, Note Colors, Staff Color, Text Below the Notes), where its changes are kept, the staff's lines (`RR.Tools.staff`), the computer keyboard picture (2026-10-12) |
| `js/teach.js` | Teach Me to Read on the music card: checks and gold stars, Next, Auto-Next, the end card, the home card's window (levels, your units, Make a unit) and the drop-down |
| `lib/` | vendored copies — see `lib/README.md` |
| `assets/MA4A-rainbow-reader-cover.jpg` | the hub card's cover (400×400) |
| `tests/index.html` | the engine checks |

## Storage

`rainbow_reader_device_v1` (sound, points/stars, folded notes, what is
playing — `practice: { kind: 'level', n | 'session', id | 'custom', practice,
from, over }` with `over` = what is played just this time; since 2026-10-08
no game, set or tricky notes of its own), `rainbow_reader_levels_v1` (your
changes to the levels, `{ n: practice }`, 2026-10-08), `rainbow_reader_scores_v1` (per player: best
rounds, the ladder's stars, first-try counts per note, mix-ups, totals —
and since 2026-10-07 My stats' `days`, `log`, `games`, `rec`, `since`, with
totals `points` `gold` `made` `rounds` `secs` beside the old three; an
older file just lacks them and gains them on first use, so no new key),
`rainbow_reader_teach_v1` (Teach Me to Read's marks per player, `{ L1: [0|1|2 × 5] … }`, 2026-10-11; a unit's
as `{ 'U:<set id>': { <melody key>: 1|2 } }`, 2026-10-12), `rainbow_reader_teach_units_v1` (your units: `{ v: 1,
units: [{ set, at }] }`, this browser's, 2026-10-12; the device keeps `teachLook` beside it),
`rainbow_reader_sessions_v1` (My sessions: `[{ id, name, practice, format, points, teach: { id },
song: { id, part, from, to, practice, auto }, kind?: 'battle', battle? }]` — format, points, teach and song since
2026-10-12, filled in on read for older records; `battle` is kept when the format moves off Battle;
`rainbow_reader_mine_v1`, the old Mine band, is read once into it and left alone), `rainbow_reader_sets_v1` (My
melodies, an id map of EVM items). The device also keeps the set being
played and the player names, and (2026-10-12) `libOpen` — which Library folders are open — and `lastSet`,
the set New melody last wrote into; `practice` may carry `session` (a session played the Practice or Songs
way). Every read is checked and
falls back to defaults; a change of shape gets a new `_v2` key.

## Traps (found while building)

- **The Library and session formats (2026-10-12).** "Is a session
  playing?" is `G.sessionId()`, not `G.mode.kind === 'session'`: a
  Practice or Songs session plays as `kind: 'teach'` with `mode.session`.
  Anything that restarts a teach level (`RR.Teach.start`) drops the
  session unless it passes `{ session }` as the fourth argument
  (`G.selectSession` does; `G.switchPlayer` and the reload go through it).
  A session sets `RR.device.points` when picked, so the switch stays as
  the last session left it for levels played after — the Points switch
  is still the browser's. The Library lives in `#melodies` and is drawn
  by `RR.Library.html()` whenever melodies.js has no set open; its
  actions are `data-lb` (melodies.js keeps `data-open` / `data-play` /
  `data-act` for sets). Its Settings folder is Settings' own Points and
  Sound sections: `RR.Settings.prefsClick` takes only `@` keys from
  `data-k` / `data-toggle` — anything else there would change the
  practice. Deleting a playing session from the Library calls
  `RR.Settings.settle()` itself (the Settings window used to on close).

- **Your units and Tools (2026-10-12).** A unit is `RR.teachLevel('U:<set
  id>')`, built from the set every time a set or the unit list changes
  (`RR.Sets.rev` — every save in sets.js moves it — and
  `RR.TeachUnits.rev`), so nothing keeps a stale copy; anything that saves
  sets must go through sets.js's `save`. Its `ex` is the set's melodies
  (not token strings: `RR.teachCards` checks `lv.unit`) and `keys` their
  content keys (`RR.teachMelKey`: notes and meter, not the title) — a
  unit's marks are kept by key, so they follow a melody that moves and
  start afresh for one that changes. `RR.Teach.start` returns false for a
  unit with no melodies — callers (restore, the drop-down, a player
  switch) fall back. A unit's set changed while it plays: My melodies'
  `close()` calls `RR.Teach.refresh()`, which re-deals the exercise if it
  changed and goes to Level 1 if the unit is empty or gone. The Tools
  panel sits outside the music card (fixed, placed by `placeTools` beside
  `#btn-tools`; a phone's CSS pins it to the bottom) because the card
  clips; game.js draws on every note, so `drawTools` skips an unchanged
  panel. The look lives in the practice for colour and labels (`G.base`
  and `G.setup`, set by `applyLook`) and in `RR.Teach.staff()` for the
  lines (game.js asks it in `draw`). In the built-in browser pane, a
  screenshot taken right after a change often shows the page before it —
  check the DOM, then take another.

- **Teach Me to Read rides on the card machinery (2026-10-11).** Playing on
  your own is the `practice` stage (its "found" is the check); a play with
  the metronome is the `game` stage with a count-in run, and `finish()`
  hands it to `RR.Teach.runDone` before anything is scored. game.js asks
  `G.mode.kind === 'teach'` in a handful of places — record/mixup (no
  scores), leaveCard (never opens in Test), syncTick (no free-running
  click), setMetro/stopCountIn/pause (Off = back to playing on your own),
  next/restart/drawSides/dots. `drawSides` resets Next's label and
  `teach-ok` for every other mode, so nothing leaks out of it. While the
  computer keyboard shows, every strike goes to `RR.Teach.kbdHit` first
  (`strike`), so nothing can count. **Round and round** (2026-10-11;
  followed in order since 2026-10-12): the run's click goes on; when the
  last note is found in a Teach run, judgeFind calls `G.passDone` instead
  of `finish` (the mark, `G.passOver` — the notes stay lit) and the next
  strike calls `newPass` (dark again) before it is followed as note 1.
  The run, `G.phase = 'running'` and the click carry on. Listen's loop schedules each time round 0.6 s before the
  last ends and keeps only the timers of the last two in `G.hearTimers`
  (every earlier one has gone off). The main game still plays and runs
  once. The keyboard picture's sizes come from container queries on
  `.kbd-view` (a short music card: the number row alone).

- **Each level and session is its own (2026-10-08).** `G.base` is the
  saved settings (the ✎ page reads and changes it, through `P()` in
  settings.js), `G.over` what is played just this time, `G.setup =
  compose()` what is played. Never write into `G.setup` from a page —
  change `G.base`, then `G.compose()` and `G.saveSetup()`. Anything new
  that is per-visit state (scores, a battle, a plan, the metronome) must
  be reset in `usePractice`, or it leaks into the next choice — that was
  the bug. A session's own set scores as the session; only a set played
  just this time keeps `set:<id>` scores. The staff picker on the ✎ page
  also carries `data-note` (SVG): a test clicking a bar must select
  `button[data-note]`.
- **Practice goes straight round again (2026-10-08, the user's report).**
  After a melody is found in Practice the card shows it (phase `review`)
  and clears 1.5 s later — but strikes used to be ignored until then, so a
  player keeping the beat with the practice metronome lost the next
  downbeat and the clear landed mid-melody. Now the first bar struck in
  `review` clears the card at once and counts as note 1 (`strike`), and
  the floating check carries on to its end (`resetCard(stage, keepMark)`).
  Nothing here may restart the practice metronome: it keeps its own grid.
- **The top bar's three columns (2026-10-08).** Each part has its own
  `grid-column`: with the level box hidden (the home page, My stats) the
  icons otherwise slid into the empty middle column. **The home page's
  cards** are flex rows, centred (the user's: a short row sits in the
  middle), each card one column of a container-query grid (`@container`
  on `.mode-grid`: columns of at least 205 px, 158 on a phone, five across
  a computer); Make your own's three take the same width, under the middle
  three. Its phone rule uses `:where(.make)` so it adds no weight — a
  heavier selector there kept every row at two.
- **The battle's team scores stayed in the score chip after a battle**
  (the user's screenshots, 2026-10-08): `.score-chip > span` sets
  `inline-flex`, which outranks a plain `.sc-teams { display: none }`, so
  the last battle's teams showed beside the points until a reload. Now
  `.score-chip:not(.battle) .sc-teams` hides them and `drawChips` empties
  them. Check what is *visible* (computed display), not just the state.

- **A metronome run follows the player in order (2026-10-12).** Don't go
  back to matching strikes to notes by the click — neither the clock alone
  (2026-10-07: drift is cumulative, a slightly slow player's later notes
  dropped) nor the follower that replaced it (it still expected the first
  note on beat 1: coming in late made the first strike note 3). In a run,
  `strike` sends every bar to `judgeFind`, as on your own; `finish` stops
  the click; since 2026-10-13 the metronome judges nothing in a Test (the
  score is the player's own rhythm and tempo — its tempo only counts when
  they were with it and it is faster) and in Practice only the gold star's
  tempo (`RR.Points.tempoCheck`) — never where the player came in. Tests that
  press bars in the real app must use a level whose bars are live — the
  new Level 1 greys out everything but E and G, and a greyed bar ignores
  `RR.Xylo.press`.

- **Your copy of the app's own (2026-10-13).** Never store a `songbook:`
  or `practice:` id — `RR.Sets.update` on one makes a new set and returns
  it with a **new id**; anything holding the old id (the set's page, Make
  a melody, Copy melodies in) must follow `RR.Sets.onCopied`. Lists that
  show "your sets" must leave copies out where their original's list
  already shows them (`RR.Sets.copyOf`), or a copy appears twice (the
  Songs window and a session's song picks did, until filtered). A test
  that counts the Songbook's songs counts `kind === 'song'`: a teacher's
  copies sit among them.

- **The drum beat (2026-10-13).** The kit's voices read the clock once, at
  `currentTime` — there is no "play at" in the library. Never call
  `kit.play` straight from a timer: `RR.Sound.drum` wraps it in
  `EVMCountIn.timed(ctx).soundAt(t, …)`, which hands the kit a clock that
  reads `t`. A sound placed is not stoppable, so Listen makes each hit just
  before it is due (as it did its clicks), and runs place them 120 ms
  ahead. A new beat goes in `RR.DRUM_BEATS` by its meter's text (`'3/4'`),
  its lines as many beats as the meter has (6/8: two, of three or six
  slots); Ostinato Builder links (held notes) aren't read — a beat with
  links needs them looked at first.

- **The tempo dial (2026-10-13).** The dial only *shows* a new tempo while
  it is dragged; `G.setTempo` runs when the finger lifts (keys and − / +
  after half a second). Setting it on every mark passed would restart a
  count-in at each one. The Tools panel redraws whenever its HTML changes
  (game.js draws it on every note), so the dial keeps no state of its own
  beyond `data-i` on the svg, and its listeners are bound once on the
  panel (`RR.Dial.bind`), never on the svg. `G.tempo` goes back to 72 in
  `usePractice` and the just-this-time changes (`playOnce` set / game,
  `switchSet`) — not in `nextCard` or `newRound`: the user wants a tempo
  kept for what is being played. The battle pop-up lives outside the
  music card (it clips): `#metro-pick` is fixed, placed by `placePick`.

- **The new ladder (2026-10-07).** Anything that needs a bar's or a beat's
  length goes through `RR.meter(card.time)` (never `time[0] * 4`), and
  anything that counts bars from tick 0 subtracts `card.pickup` first (the
  engraver's bar lines and beams, the phone's two rows, the count-in,
  Listen). A lone up-stem eighth before a bar line (a pick-up) hid the bar
  line under its flag — the engraver now leaves the flag room. Ending on
  Do used to jump there from anywhere (a 6th in a Steps level); the last
  note now goes home only by an allowed move, and `make()` tries again
  otherwise.

- **The home page and My stats (2026-10-07).** The three views are classes
  on `<html>` (`view-home` · `view-play` · `view-stats`); the music's card
  is still dealt while hidden (its draw waits for a width, and the
  ResizeObserver draws it when it shows). Keys 1–0 and Space/Enter belong
  to the music only. `.ghost` is the ghost notes' class (it fades to
  opacity 0) — the outlined card button is `.mc-play.outline`. Charts are
  drawn at their host's width after the page is laid out (`charts` list,
  `fill()`), again on a resize. In the browser pane, a page scrolled from
  script may not repaint until a real scroll — the screenshot lags, not
  the page.

- `[hidden]` loses to any `display:` rule — `style.css` puts
  `[hidden] { display: none !important; }` first.
- Animation frames stop when the tab or pane is hidden: Count me in times
  everything on a 25 ms timer (it no longer has a playhead to move).
- A strike is judged by `eventTime(e)` (the event's timeStamp through
  `getOutputTimestamp`), and the notes by the same clock — so early and late
  are symmetric. Don't mix it with `currentTime`.
- A CSS animation on an element with a `transform` attribute replaces it —
  the lit pop animates a wrapping `<g>`; redraws restart animations, so they
  carry a negative `animation-delay` by age.
- A level's Songbook songs are mixed in only when every note of the song is
  in the practice — otherwise a Custom practice of line notes got *Ode to
  Joy*.
- `GLYPHS_LELAND` is a top-level `const`, not on `window`.
- The engraver's little pictures can be any length — a dotted quarter's
  picture asked for a "1.5/4" time signature, which has no glyph, and took the
  whole maker palette down with it. Bare pictures skip the time signature.
- Melody sets follow the family rules exactly (README in `EVM Library/`): ids
  made once, `updatedAt` only on real change (`EVM.stamp`), links filed with
  `EVM.file`, shared sets never saved into, lessons carry no ids.
- Changing `evm-shelf.js` means copying it to every app that carries it —
  `EVM Library/check-copies.sh` lists them (Rainbow Reader included).
- A focused bar's Enter/Space must stop there (`stopPropagation`), or the
  page-wide Space = Play and Enter = Next fire too.
- Adding the home link squeezed the level chip to "L…" on a 375 px phone;
  ≤480 px hides the logo, the chip's dot and caret.
- The Round done / Time's up card used to live inside the music card, which
  clips (`overflow: hidden`) — on a short window (about 600 px tall) it cut
  off "Round done!" (2026-10-03). It is now `#rounddone`, a layer in the
  stage grid sharing the music card's cell (so `.stand` and `.xylo-wrap`
  carry explicit `grid-row`s — auto-placement would push them down a row).
  `margin: auto` centres the card when it fits and keeps its top at the
  music card's top when it doesn't (it hangs over the xylophone instead);
  `min-width: 0` on the layer stops the card's widest row from widening the
  page on a phone, where the star chips and buttons now wrap.
- **Points and the count-in (2026-10-04).** A try on your own is timed by
  the page clock (`event.timeStamp`), not the audio clock — only the spacing
  matters, and a suspended AudioContext would freeze every time at 0. A
  count-in run is timed by the audio clock (`eventTime`), as before.
- A count-in run ends at the later of the melody's end and the last note's
  window — a short last note (a sixteenth at Fast) would otherwise be
  marked Missed before its window closed.
- A card is counted only when the *game* stage finishes; Next from Practice
  or mid-try is a skip (0). Enter acts only on a finished try (I'm ready in
  Practice) — Enter, Enter used to skip the melody it had just opened.
- **The controls (2026-10-05).** The music card's middle is a grid: an
  empty left column as wide as the right one (↻ + Next) keeps the music
  centred over Listen · Practice/Test · the metronome. On a phone they
  share one row under the music. The dots are absolutely placed in the
  card's top padding, so they cost the staff no height.
- Clicks can't be stopped once made (`Sound.click` isn't in `played`), so
  Listen makes each just before it is due, on `G.hearTimers`.
- Nothing counts in by itself (2026-10-06): `nextCard` sets `G.metro`
  back to 'off', `roll()` is only for Start over and Space, and the
  window-closed hook that used to count in again is gone.
- The scores became `v: 2`: loading a `v: 1` file clears the best rounds
  (old scale) and keeps the ladder's stars, tricky notes, mix-ups, totals.
- **My sessions (2026-10-05).** The session page is the other tabs' renderers
  joined (`TAB.notes() + rhythms() + helps() + play()`), so every control
  goes through the one click handler. `G.saveSetup()` is where a session
  (or, since 2026-10-08, a level) saves (`RR.Sessions.update`,
  `RR.LevelEdits.save`); nothing is laid over either by the browser any
  more. Score keys are `session:<id>`, so a
  rename keeps the scores; a Mine practice's old `mine:<name>` scores are
  copied across once (`legacy`, game.js), then the marker is dropped.
- **The check and the star** come from `finish()`: `made` = not a metronome
  run with a Missed note; `gold` = made and points ≥ `setup.gold` (raw
  points, before Points off zeroes them). Round entries carry `made`,
  `gold`, `skip` beside the old `stars`.
- **A round's length lives in the game's name** (`'round7'`, `RR.roundLen`):
  the best scores are kept per game, so each length has its own, and the
  old `round5` / `round10` (device, sessions, lesson links, bests) read on
  unchanged. `sanitize` takes 1–99; anything else falls back to round5.
- **Battle Mode (2026-10-05).** A battle is one long round (`G.roundN =
  rounds × teams × per`) whose entries carry `team`; `RR.battleAt(b, k)`
  says whose turn melody k is; `G.battlePlan[k]` is its melody (the plan
  is laid out in that same order: round, then team, then the turn's
  melodies). A variant keeps a long last note last and checks the bar
  rules again (`cellsOk`) before it is used. The battle's own `G.setup.game` is forced to a
  round (never Song or the clock). Progress is saved after every finish or
  skip and cleared at the end; `newRound` resumes it only when the session
  id and the shape (teams-per-rounds) still match. Plain ⚔ draws as a thin
  "x" in Fredoka — use the emoji form ⚔️ (with U+FE0F).

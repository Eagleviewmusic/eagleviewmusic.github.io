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
ring the bars — with **1 2 3 4 5 6 7 8 9 0** (and **− =** for F5 and G5) or
a finger.

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
rules, the points, My sessions, the gold star, round lengths, Battle
Mode and its fair plan, the Helps' choices, the session page's rules, My
stats' history and charts, the new ladder: 300 melodies a level against
its notes, moves, leaps, meters and pick-ups) — 96 of them, all passing as
of 2026-10-07.

The Teacher Library shelf reads `../Teacher Library/index.json`, which only
exists on the live site; served from its own folder (8815/8816) it can't be
reached, so the shelf says it is offline. To test the shelf, serve all of
Claude Apps (launch entry `song-writer-test`, 8805, at `/Melody%20Reader/`)
with a temporary `Claude Apps/Teacher Library/` — envelopes plus an index
built by `EVM Library/teacher-library/.github/scripts/build-teacher-index.js`
— and delete it afterwards.

## What's built (all six phases)

- **The home page** (2026-10-07, the user's ask: "a neutral page", not
  always mid-game) — the app opens here (a lesson link still opens on the
  music). From the top:
  - **Play / Carry on** — what was playing (the level or session and its
    game, "1 of 5 played" while a round is under way), the player's points
    and gold stars (all time) and days in a row; the players' names to
    switch, when there are any. A round that is over, or a Beat the clock
    left part-way, starts afresh.
  - **What to read** — the fifteen levels as rainbow badges with their
    stars, My sessions as chips (+ New session), and what the chosen one
    is ("C to G · ta ta-a · 1 bar"; a My melodies set laid over it, with ×
    to stop it). ✎ Choose the notes and rhythms opens Settings.
  - **How to play** — a card each: **Rounds** (− n +, the best for this
    level and length), **Songs** (Choose… the Songbook songs and My
    melodies sets, in order), **Beat the Clock** (30 s · 60 s · 2 min, the
    record), **Endless** (the longest run), **Battle** (the battles, +
    New battle). The card's choices are kept on the page until ▶ Play,
    then saved as the Format tab saves them (`RR.Settings.setFormat`: the
    browser's for a level, the session's own for a session). With a
    battle chosen, the other cards play the level this browser was last on.
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
    bar: found the notes / own steady beat / with the metronome, then
    checks and gold stars) · **With the metronome** (Tests at Slow ·
    Moderate · Fast, darker = in time all through).
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
  − = and the number pad; ten bars, twelve when a practice uses F5 or G5;
  bars not in the music greyed out at the first levels.
- **The music** — Leland engraving of one or two bars; coloured notes (pale
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
  - **The metronome** (one way everywhere since 2026-10-06 — Battle Mode's) —
    a tap opens a choice: **Slow · Moderate · Fast** (each with its BPM; Off
    too while it is on). Picking one in a Test **counts in at once**; in
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
    Changing it mid-Test starts the try again at the new pace. Listen plays
    at its pace with its clicks (a bar of them first); Off = Slow, no clicks.
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
  ready 1 2 3 4*), then the metronome through the melody at **Slow 60 ·
  Moderate 80 · Fast 100** (the three tempos are in How to play). Nothing
  shows but the notes lighting when struck in time — no playhead, no words,
  no ghosts; the missed notes show at the end. Judged by the time the child
  *heard* (Perfect · Good · Early/Late · Missed windows, never shown).
  Practice has no count-in run any more (it had a "That would be 14 points"
  one until 2026-10-05).
- **Points: 1–20 a melody** (`js/points.js`) — **1–8** finding the notes
  (first try 1, second ½); **9–12** every note first time in your own steady
  beat (a least-squares fit finds your tempo; the leftover, in beats, is the
  grade — 12 ≤ 0.06, 11 ≤ 0.10, 10 ≤ 0.15, 9 ≤ 0.21, else 8); **13–20** a
  clean Test with the metronome: Slow 13–15, Moderate 16–18, Fast 19–20. A count-in
  with every bar right but some early/late drops to 9–12; a wrong or missed
  note drops it to 1–8 (−½ a wrong bar). Stars: ★ 1–7 · ★★ 8–12 · ★★★ 13–20;
  next level at ★★ or better in 4 of 5. The streak counts 8+ in a row (no
  bonus). Points and stars can each be turned off.
- **Games** — a round of any 1–99 melodies (− / + or type it; 2026-10-05 —
  there were only 5 and 10; more than 12 show "3 of 30" and a bar instead of
  dots; the ladder counts rounds of 5 or more), Song (card by card, then *Hear your song*),
  Beat the clock (30 s · 60 s · 2 min), Endless. The game belongs to the
  browser, not the practice, so changing it never makes a level Custom.
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
  stars), Notes, Rhythms, How to play, Helps, Points, Sound, Share.
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
  session's and a battle's page): **Note Colors** Always / When Played /
  Black · **Xylophone Bar** Letter Name / Number / Both / Neither (sets
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
  are (Level 15 still flashes, 14–15 are still one go, tempos 60/80/100, the
  star over 10). Rhythm syllables went with Under the notes: Levels 7–8 now
  show nothing below the notes, and an old practice or link with rhythm
  syllables reads as Nothing (the engraver can still draw them).
- **Score board** — this round, best scores per practice and game, tricky
  notes on a little xylophone and the mix-ups (*You played F for E*),
  *Practise these*, totals, Reset.
- **Lesson links** — Share → a link that opens the practice as a lesson; a
  lesson playing a melody set carries the melodies with it.
- **My melodies** (the ♫ button) — melody **sets** kept by the family's EVM
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
| `js/levels.js` | the ladder, the defaults, `sanitize`, the gold star's marks, My sessions |
| `js/game.js` | the card, Find the notes / No slips, scoring, rounds, games, Play; `RR.Scores` |
| `js/beat.js` | Count me in: the count-in, the metronome, judging a run |
| `js/points.js` | what a try is worth (1–20), the stars, the paces' tempos |
| `js/settings.js`, `js/board.js` | the two windows, Round done, Time's up |
| `js/lesson.js`, `js/app.js` | lesson links; the keys, the buttons, the start |
| `js/sets.js` | My melodies' data: melody sets by the EVM Library rules, links, backups, the shelf |
| `js/melodies.js`, `js/maker.js` | the My melodies window; Make a melody |
| `js/players.js` | names on a shared computer |
| `js/history.js` | My stats' history: the days, the last 200 melodies, the last 60 games, records, time playing; ranges and streaks (pure, tested) |
| `js/charts.js` | the SVG charts (columns, line, calendar, one split bar) and their tooltip |
| `js/stats.js` | the My stats page |
| `js/home.js` | the home page, and the three views (`RR.View`: home · play · stats) with the browser's Back |
| `lib/` | vendored copies — see `lib/README.md` |
| `assets/MA4A-rainbow-reader-cover.jpg` | the hub card's cover (400×400) |
| `tests/index.html` | the engine checks |

## Storage

`rainbow_reader_device_v1` (sound, points/stars, folded notes, the current
level or practice, the game), `rainbow_reader_scores_v1` (per player: best
rounds, the ladder's stars, first-try counts per note, mix-ups, totals —
and since 2026-10-07 My stats' `days`, `log`, `games`, `rec`, `since`, with
totals `points` `gold` `made` `rounds` `secs` beside the old three; an
older file just lacks them and gains them on first use, so no new key),
`rainbow_reader_sessions_v1` (My sessions; `rainbow_reader_mine_v1`, the old
Mine band, is read once into it and left alone), `rainbow_reader_sets_v1` (My
melodies, an id map of EVM items). The device also keeps the set being
played and the player names. Every read is checked and
falls back to defaults; a change of shape gets a new `_v2` key.

## Traps (found while building)

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
  goes through the one click handler. `G.markCustom()` is where a session
  saves (`RR.Sessions.update`); the game keys save there too for a session,
  to the browser for anything else. `usePractice` lays the browser's game
  over a level but not over a session. Score keys are `session:<id>`, so a
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

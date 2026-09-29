# Song Writer (folder: Song Writer 2.0)

Song Writer 1.0's melody-first song writing — solfège blocks rising over the
words — rebuilt as the fourth member of the Eagle View Music family beside
**Rhythm Poetry 2.0, Ostinato Builder 2.0 and the Music Stand**: the same
frame, the same controls in the same places, the same windows and wording,
with every 1.0 and 2.0 function kept. Song Writer 1.0 stays untouched beside it.

The redesign (2026-09-25) followed `../Song Writer Redesign/` (DESIGN.md,
FEATURE-MAP.md, DECISIONS.md — every recommendation taken). The folder keeps
its name and its storage keys (`song_writer_2_*`), so saved songs carry on;
on screen the app is simply "Song Writer".

Preview: `.claude/launch.json` entry **song-writer** (port 8797), or the
`music-stand` server at `http://localhost:8795/Song%20Writer%202.0/`.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The shell: top bar · task strip · workspace grid · toolbar, and every sheet/popover. |
| `style.css` | Rhythm Poetry 2.0's design system in Song Writer's plum; 1.0's blocks scaled by `--bs`; the edit layer in the hat's orange; phone / tablet / short-screen / smartboard / touch rules. |
| `songs.js` | 1.0's three examples and the new-song text, unchanged. |
| `js/core.js` | `SW` namespace, **event bus**, session state (incl. Sound), 1.0's music tables (verbatim), note values, meters (30–300 BPM), UI helpers (popovers, hover gauges, toolbar height). |
| `js/audio.js` | Every sound, played by Key Blocks' engine (`lib/audio.js` — the Virtual Keyboard's sounds): a Melody side and a Chords side, each with its own sound and volume, and Room (reverb); 1.0's frequencies, voicings and lengths; the count-in click; chords on the audio clock. |
| `js/chords.js` | **The chord engine** (`SW.chords`, 2026-09-27) — Digital Accordion's chord side, ported: the song's scale decides the fourteen chords of the **board** (places F D S A G R E Q W, 1–5), Z X C V B functions (sus2 add9 sus4 ♭7 maj7 and the inversions 6 6/4 6/5 4/3 4/2), Core · Full · Extended · Extreme, voicings (inversions, Digital Accordion's, or 1.0's nine), names and notes in the song's own key spelling, and the chord id every part of the app stores (`V7`, `bVI`, `V:inv64`). |
| `js/engrave.js` | Note-value pictures from the Leland glyphs. |
| `js/score.js` | The score editor — 1.0's engine, function for function — plus the JSON model, 1.0's text format, the section heads, and the functions the edit layer calls. |
| `js/timing.js` | The one reading of the song's time: ticks per column, bars, beats, beam groups — shared by the staff and the player. |
| `js/staff.js` | **Staff notation in the score.** The engraver: spaces each written line (by note length, accidentals, words, bar lines), packs and justifies its rows, then draws one SVG per line behind the blocks: staff, clef, key and time signatures, coloured noteheads, stems, flags, beams, rests, bar lines, **bar numbers**, names, the selection ring. |
| `js/player.js` | Play: count-in, steady beat, Melody/Chords, At the end (Stop · Go round · This line), light-up, tempo changes while playing — all on the audio clock. |
| `js/library.js` | Library window, sandbox, auto-save, the name window (New · Save as · Rename), share links, backup/restore, Start over, Save picture. |
| `js/settings.js` | View preferences (the workspace switch, sizes, colours), the Sound popover, Layout settings, `can()` gates, the lesson tempo rule, the policy pass. |
| `js/lessons.js` | Set up for students: tasks, key & tempo, exercises, `#lesson=` links, preview, Start again. |
| `js/components/*.js` | Chord panel (+ the corner, the chord editor and the Z X C V B chooser), chord lane, keyboard dock, the value circles, and the Edit box (below). |
| `js/app.js` | Start-up order, the key + time tile, BPM chip, Play, step pad, Present, the keyboard map. |
| `lib/theory.js`, `lib/keyblocks-layers.js` | **Vendored** copies of `Digital Accordion/theory.js` and its `lib/keyblocks-layers.js` (the chord-modifier engine) — see `lib/README.md`. |
| `lib/notation/glyphs-leland.js` | **Vendored** copy of `notation assets/glyphs-leland.js`. |
| `lib/evm-library.js`, `lib/evm-shelf.*`, `lib/evm-count-in.*` | **Shared** EVM Library modules — byte-identical copies, checked by `../EVM Library/check-copies.sh`. |

Scripts are classic (no build step); each is an IIFE that registers on `window.SW`
and calls the others through `SW` at call time.

## Layout — one row at the top, one at the bottom

```
┌ topbar ─ ‹ Eagle View ▮▮▮ Song Writer │ ( Song | Keyboard | Chords ) │ Clear · Auto-save · Library chip ┐
├ task strip (lesson only) ─────────────────────────────────────────────────────────────────────────┤
├ workspace grid ───────────────────────────────────────────────────────────────────────────────────┤
│  chord panel  │  score: lines → [section head] [staff svg] syllables → [chord slot] [blocks] [word]   │
│  (left hand)  │  (+ Add a line, in Edit)     with the hat on, the Edit box takes the whole left column │
├───────────────┼──────────────────────────────────────────────────────────────────────────────────────┤
│ chord in hand │  keyboard dock: rainbow keys in a black frame, the whole width  (grip on top: height)  │
│ 1 2 3 4 Focus │  (with the panel away, [1 2 3 4 · Focus] sits at the dock's left end as before)        │
├ toolbar ─ ▶ ⛑ │ C 4/4 [Major ▾]  100 BPM  Sound │ Write Names View │ Present ……………………………… ‹ › ┤
```

- **Top centre — Song · Keyboard · Chords** (Rhythm Poetry's side switch; the
  Stand's Poem · Both · Ostinato): what is on the stage. Song = the song alone
  (1.0's look); Keyboard = + a keyboard that lights the melody; Chords = + the
  chord panel, the chord lane and the keyboard. View → On the stage sets the
  parts one by one (a mix that matches no tab lights none).
- **The name** opens About at every width (1.0's rule); below 720 px only the
  three-block mark shows.
- **The toolbar** is a three-column grid: an empty left column that gives way
  first, the family's centred cluster, and the step pad pinned right.
  **Play** first; **the construction hat** in the family's beat-dot place — a
  toggle, as in 1.0; while it is on the **Edit box** is out (below);
  the **key + time tile** (tap the letter for the key, tap the top numeral for
  4 → 3 → 2); **the scale menu** beside it (Digital Accordion's nineteen scales,
  grouped as its menu is — the song's, saved with it; it rebuilds the chord
  panel, recolours the keyboard and, with Layout settings → Keys → **Melody
  follows the scale** on (the default), moves the melody into the scale:
  C major → C minor turns every mi into me, la into le, ti into te, and the
  whole feel changes — `morphToScale` in score.js, degree by degree: a note on
  the old scale's step moves to the new scale's step, a deliberate accidental
  (a fi in major) is kept, a step the new scale lacks (fa in major pentatonic)
  stays. Off, the scale leaves the melody as written and only the key
  transposes it. Loading a song never moves anything);
  the **BPM chip** (tap to type 30–300; a mouse resting on it shows
  the slider); **Sound**; **Write** (Edit only); **Names** (1.0's glasses);
  **View** (a mouse resting on it shows the Scale slider); **Present**; and at
  the right the **step arrows** (the right hand, opposite the chord strip).

Widths (checked): one row top and bottom at 1920, 1366, 1280 and 1024 in
Perform and Edit, Chords included (labels give way to icons from 1100); the
toolbar is the same in Edit, since the tools are in the Edit box. ≤ 720
(phones): the family's two-row toolbar; popovers pin above the toolbar and
windows become bottom sheets.
≤ 560 tall: smaller bars. ≥ 1500 wide (smartboards): bigger bars, and Justify
width enlarges the music (to 160%). Touch and smartboards: a bigger Edit box,
hit collars on small targets, no latched hover, section tools on the selected line,
press-and-hold for a button's name, and double-tap on a block moves it a step.

## The Edit box — no ribbon

2.0's edit ribbon is gone. With the hat on, every tool that acts on the
selected note is in **one box** (`js/components/edit-box.js`, 2026-09-25 — it
replaced the tools drawn around the note and the value drawer in the toolbar).
Since 2026-09-28 it no longer floats: it is the workspace's **left column**,
from the stage's top to the toolbar — the chord panel's place and the corner
under it, beside the keyboard when that is out. With the chords on, the chord
panel itself moves into the box's foot (`#eb-chords`, `edit-box.js seatChords`)
while the hat is on — a fixed share of the column (clamp 230 px, 44%, 420 px),
with small ✎ pencils so the names stay readable — so chords are edited there;
the tools above scroll. The corner under the panel is away while editing (the
keyboard's 1–4 / Focus go back to the dock). It stays out for as long as the
hat is on; nothing is drawn around the note, so the song does not move when the
hat goes on.

```
┌─────────────────────┐
│ ⛑ Edit              │   the title
├─────────────────────┤
│ RHYTHM              │   the value circles (rhythm-panel.js) and caption
│ ▮  𝅝  𝅗𝅥             │
│ ♩  ♪  𝅘𝅥𝅯             │
│ • Dotted  ⋯ All     │   ⋯ writes / unwrites a line or the song
│ NOTE                │
│ ♯ Sharp   ♭ Flat    │   1.0's rules (no mi♯, no do♭ …)
│ ⧉ Harmony       −   │   a note two steps above / take the selected away
│ SYLLABLE            │
│ (  ● ● ●        − ) │   a dot per note on this word; − takes one away
│ + Note     + Note   │   the two ways to add a note, side by side: with a
│  /Syllable   Only   │   syllable of its own after this one, or connected
│ WORDS & LINES       │
│ ↰ Join up ↵ New line│   Join up on a line's first word only
│ ×      Delete       │   delete takes two taps
│ Staff notation  ◯━  │   View → Staff notation, the same setting
└─────────────────────┘
```

- **Its column**: `--eb-w` wide (200 px; 204 touch, 172 phone, 228 from
  1500 px); its body scrolls when the window is short. Until 2026-09-28 it was
  dragged by its title bar and folded (`song_writer_2_edit_box_v1`, no longer
  read).
- **Still targets**: what Layout settings or a lesson take away is removed
  (a words-only lesson leaves just "Tap a word to type it"); a tool that
  cannot act on the selection just now is greyed, so no button moves. The word
  tools grey while a word is being typed (`words:typing` from score.js).
- **Staff notation** at its foot is View → Staff notation itself
  (`view.showStaff` through `setView`): off in either place is off in both,
  and every column shows as a block with its value marked underneath.
- **Focus**: the box never takes the focus, so a word being typed stays open
  and the keys keep working after a tap in it.

- **Rest** has no button: tap the lit value circle again (or the block circle
  on a block) — RP's EASY rule.
- **Section heads**: each line's name sits in its corner; in Edit it is typed
  into, with ▲ ▼ ⧉ × beside it (on the line you point at, or the selected
  one). ABA mode is gone. **Add a line** ends the song in Edit.
- **Chords in the lane** (Chords tab, Edit): tap the space above a word — it
  glows — and the panel, its letter keys and 1–5 write into it (with any
  Z X C V B held, the changed chord); otherwise they only sound.
- Everything that edits is one layer under `body.editing`, hidden in Present
  and in a saved picture.

## Every 2.0 function, and where it went

The full checklist is `../Song Writer Redesign/FEATURE-MAP.md`. In short:

| 2.0 | Now |
| --- | --- |
| Perform / Edit tabs (top centre) | The hat beside Play — a toggle again |
| Ribbon → Note (rest, ♭ ♯, connected, harmony) | The Edit box's Note and Syllable sections; rest = the lit circle again |
| Ribbon → Value (circles, dot, staff card) | The Edit box's Rhythm section; the card is its caption; ⋯ writes/unwrites a line or the song |
| Ribbon → Syllables (+ ↵ trash) | The Edit box: + Note/Syllable beside + Note Only; Words & lines (New line, Delete) and the new Join up |
| Ribbon → Song (Text, ABA) | **Write** on the toolbar; section heads |
| Key button, 4/4 popover (meter, tempo 40–200) | The key + time tile; the BPM chip (30–300) |
| Names, Colours, Chords, Songs buttons | Names (glasses icon); View → Section colours; the Chords tab; the Library chip |
| ▼ minimize | **Present** (Play · ‹ › · Exit, full screen) |
| View → Workspace / Sound | Top centre / the **Sound** popover |
| Songs sheet, Copy picture | **Library** window; **Save picture** (download, and copied where allowed) |
| Song words | **Your words**: Words, or Words and notes (1.0's bracketed text) |

New from the family: Present, count-in and the shared "Get ready" card, steady
beat, At the end (Stop · Go round · This line), Melody on/off, Light up the
notes, bar numbers, the hover sliders, tap-the-numeral meter, the Library
groups (Sandbox · books · Shared with you · Your songs · Examples) with
"4/4 · 100 BPM · 3 lines" sublines, the name window for Rename, `Delete "X"?`,
a blank New for a fresh sandbox, lesson tempo rules, Sound options and Present
mode in the lesson's "What else comes with it".

Fixed: Your words keeps the meter and tempo; no empty line from ↵; Preview as
a student never writes to the teacher's songs, and Start again works in it; a
reload keeps a lesson (sessionStorage); two lessons with one title no longer
share exercises; leaving unsaved changes (auto-save off, or a shared song)
asks first; Esc closes windows; no shortcuts while the Teacher Library is
open; 1–9 pass through when the strip is hidden; About at every width; the
keyboard never slides past its ends; the toast, preview bar and popovers sit
above the toolbar's real height.

## Blocks and notes — the staff

The idea of the app is melody first: blocks carry pitch, and the rhythm is
whatever the performer's arrows make it. **Writing** a block gives it a note
value, and from then on it is drawn as a note on a treble staff, in its
place; the other blocks on the line stay blocks — standing on the staff —
until they are written too.

- A column is a **block** (no `v`) or a **note** (`v`, `'q'` included). A
  1.0 song is all blocks.
- **Dotted before or after** (2026-09-25): the dot on a written note dots it; on a
  block (or a value with no dotted form) it lights and waits, and the next value
  tapped (or `]` / `[` on a block) is written dotted — the circles show the dotted
  shapes while it waits, and a whole or sixteenth says it is written plain.
- **Tie** (the Edit box's Rhythm section, `score.js` TIES, 2026-09-25): holds the
  selected note over into a NEW eighth note (editable like any other) right after
  it on the same syllable — a note with no syllable of its own, as + Note Only
  makes — and selects it; on a bar's last beat the eighth lands over the bar line
  and the tie crosses it. The first column carries `tie` (`data-tie`); timing.js
  pairs it with the next column's matching pitches: the staff draws a crescent
  under the heads (over them for a down stem; in a chord the top one goes up),
  the words are kept clear of it, the player strikes the pitch once for the whole
  chain — and so does selecting: stepping onto, clicking or rewriting the held
  note does not sound the tied pitch again (score.js `soundColumn`; a harmony
  note added to it still sounds) — and with the staff off a small arc joins the
  two marks. Tie on a tied note
  unties it; a block or a rest cannot be tied; − on the held note drops the tie.
- **Value circles** (the Edit box): tap a circle on a block to write it, and the selection
  steps to the next column, so a phrase is written one tap per note — the
  circles never move. On a note, a tap just changes the value. The lit circle
  again makes a rest; the block circle unwrites a note. `[` `]` step the value.
- **The staff** appears behind a line as soon as one of its columns is
  written: left-aligned, clef and key signature on every wrapped row, the time
  signature on the first, **bar numbers** over the bar lines (Layout
  settings; bar 1 unnumbered, as in print). Noteheads keep their block colours
  inside an ink outline; a notehead sits exactly where its block's top was
  (`geometry()`; the staff shifts with the key).
- **Engraved spacing** (`staff.js` `planLine`, 2026-09-25): each note gets
  room by its length (quarter 3½ staff spaces head to head, ×√2 per doubling),
  widened for accidentals, dots, flags, seconds, the word under it and the
  lane's chord; bar lines get room of their own; words stay inside their bars.
  Rows break only on bar lines (a bar too wide for any row breaks between
  words, never inside a beam), the fewest rows, balanced so no bar is left
  alone; every row of a wrapped line is justified, a line's last row stretches
  at most 1.5×. The plan reaches the layout as `--sx-*` custom properties
  (style.css "ENGRAVED SPACING") — no syllable is ever moved. A row whose
  stems, beams or ledger notes reach past the usual room gets more above it
  (`--sx-rise`).
- **The words fit each row** (`--sx-drop`, 2026-09-25): while a row still
  has a block in it, its words stay under the blocks' feet, as before; a
  row of notes only brings them up to just under its lowest ink — the
  bottom staff line, the lowest head, a down stem or beam, a sharp hanging
  under a head, a name, or the clef's tail when a long first word reaches
  under it — and a low note takes them down again. Per visual row, so a
  wrapped line can have a lifted row under a row of blocks. The staff
  redraws when the bars' height transition ends (a block-size change at a
  new width used to leave it drawn on the bars' old feet).
- **Engraving:** Leland glyphs throughout, accidentals included (they were
  Noto Serif text before); accidentals hold to the bar line (a second F♯ in
  the bar gets none, a plain F after it a natural) and stack in columns in a
  chord; stems 3½ S reaching the middle line, flagged notes a little longer so
  a down flag clears its head; stems 0.16 S and beams 0.6 S thick (a little heavier than print, by request), slanted with the melody (level
  for repeats and dips/peaks), ends on quarter spaces; stubs for a lone
  sixteenth; dots in spaces, clear of an up flag; whole rest centred in its bar.
- **Time:** a block counts as one beat until it is written; each line starts a
  new bar; bar lines and beams only inside runs of written notes.
- **1-beat pick-up** (switched in Layout settings → On the page, 2026-09-25;
  since 2026-09-28 the SONG's own — `score.pickup: 1`, `S.pickup`,
  `SW.score.setPickup`, `[Pickup 1]` in the text format — so share links,
  backups and the text carry it whatever the layout; a song saved or sent
  with the old `layout.show.pickup` on takes it as its own in
  `normalizeSong`): every line opens with a one-beat
  pick-up, so its bar lines fall a beat later (`timing.js` PICK-UP). Lines are
  still padded to whole bars, so each line's pick-up finishes the bar the line
  before left open: that line ends without a closing bar line, the song's last
  bar is a beat short with the final bar line, and bar numbers count from the
  first whole bar. The steady beat's accent moves with the bars, and a
  count-in into a pick-up leaves it the last beat (1 2 3 · pick-up on 4).
  **Per line** (score.js PICK-UPS): Join up on a line's pick-up moves just
  that beat to the end of the line above and the line keeps the rest, now
  starting on a downbeat (its first word is selected, so Join up again joins
  the whole line); Delete on a pick-up removes the beat and rests fill the
  bar above (a rest block when that line ends in a block and one beat is
  open). The line then carries `data-pickup="off"` / `pickup: false`; a new
  line opens with a pick-up again. A line pads on until the next line's
  pick-up lands on its bar line, so every downbeat stays on one grid and
  bar numbers are counted on it. A first note longer than the beat is not a
  pick-up of its own, and the buttons treat it as an ordinary word.
  **The × on the bar line** (2026-09-28, Edit only; staff.js `syncCut`,
  score.js `cutPickupBar`): a mouse over the bar line that closes a line's
  pick-up lights it red with a × over the staff (always faintly shown on
  touch screens); the × takes that bar line out — the line's pick-up is off
  and its beat is part of the first bar. Nothing else changes: the bar above
  is left open (silence), so no stray rests whatever order lines are cut in.
  Switching the pick-up off or on gives every line a fresh start.
- View → **Staff notation** off shows every column as a block again.

Not yet: pick-ups longer than a beat (or on the first line only), 6/8, cross-staff (kneed) beams for very wide leaps.

## Touch screens and smart boards (tested 2026-09-27)

`../.claude/sw-touch-test.mjs` (run with the Bash sandbox off: `node .claude/sw-touch-test.mjs
http://localhost:8808/`) drives headless Chrome with **real touch events**, a strict autoplay
policy (audio needs a user activation, as on a real board) and an AnalyserNode spliced onto
the output to measure what actually sounds. Five profiles — a 1080p board, a 4K board at
150 %, iPad landscape and portrait, a phone — × 13 checks: the very first touch on a chord
sounds; a second chord; a Z X C V B tab held with one finger while another taps a chord (V⁷,
let go on the lift); no press-and-hold label while a tab is held; the names, ♪ notes and set
buttons; in Edit the pencils open the editor and the chooser and a slot tap writes a chord;
the corner's Octaves and Focus; a keyboard key sounding under a finger and releasing; a long
press (no menu, no selection, the chord still plays); a volume slider under a finger; eight
fingers at once letting go cleanly; a drag across the panel never scrolls the page; a real
two-finger pinch on the panel or the score and a double tap never zoom.

Two fixes came out of it:

- **Holding a tab popped up its label.** The family's press-and-hold labels (a title arrives
  in the toast after 450 ms on a touch screen) fired on the Z X C V B tabs, which are meant to
  be held. Anything with `data-hold` is left alone now (`core.js`).
- **A pinch zoomed the page** (the same smart-board trap Digital Accordion hit): `html` had
  `touch-action: manipulation`, which allows pinch zoom; it is `pan-x pan-y` now, as in
  Digital Accordion — scrolling and panning stay, pinch and double-tap zoom go.

Also added: the audio engine is woken on the first lift of a finger (`app.js wakeOnLift`) —
the panel's chords are scheduled and already sounded the moment audio woke, but a board's
browser may differ. (On a phone the floating Edit box used to cover the first line's
right-hand slots; since 2026-09-28 it is a column of its own.)
CDP's `Input.synthesizePinchGesture` ignores `touch-action` entirely (it zooms even over
`touch-action: none`), so the test pinches with two real touch points. Not covered: Safari on
iPad (the test drives Chrome).

## Playing

Play (or Space) plays from the selected note: notes for their length, blocks
for a beat, rests silent, lines padded to the bar, the lane's chords where
they change (Chords tab). Stop leaves the selection where the music was, so
the next Play carries on; a run that reaches the end lets the selection go,
so the next Play starts from the top. **Sound**: Melody, Chords, Steady beat
(off), Count-in (on — `EVMCountIn`: primed, one bar, two for a bar of two);
then **How it sounds** (2026-09-26) — a card for **Melody** and for **Chords**,
each a sound menu (the Virtual Keyboard's 13 sounds, grouped as it groups
them) and a volume, and **Room** (the reverb, 0–100 %, 35 % as in Key Blocks
and the Virtual Keyboard); picking a sound or letting go of a slider plays a
taste (Do, or the I chord). Then At the end (Stop · Go round from where Play
began · This line), Chord voicing (Song Writer 1.0 / Digital Accordion). The Melody
sound is every melody note — tapped blocks, the arrows, Play, the keyboard dock
(where a key now rings for as long as it is held); the Chords sound is the
strip and the lane. View prefs `melodySound` `melodyVolume` `chordSound`
`chordVolume` `room` (remembered; the Chords card follows the lesson's strip gate).
The clicks stay Song Writer's own dry triangle ticks. One AudioContext: the
engine's (`SW.audio.context()`), made on the first sound. A tempo change while playing carries on from
the exact point. Stepping with the arrows sounds each column (and its chord).

## The model

```js
score = { v: 2, key: 'C', scale: 'dorian',                   // scale omitted when major
  board: { d: { root: '5', q: 'dom7', mods: [] } },          // re-chorded places on the panel (omitted when none)
  meter: '3/4', bpm: 96,                                     // both omitted when 4/4 · 100
  lines: [ { label: 'A',
    syllables: [ { text: 'Twin', chord: 'V7',               // chord: where it changes (lane) — the engine's id
      cols: [ { v: 'h',                                     // note value; omitted = a block
                notes: [ { n: 'do', acc: 'sharp', rest: true } ] } ] } ] } ] }
```

The DOM is still the working copy (as in 1.0); `SW.score.read()` builds the model
after each edit and `SW.score.render(model)` draws one. Everything from storage,
a file or a link goes through `SW.score.normalize()`. Full formats:
`JSON-FORMAT.md`.

**Text format** (1.0 songs, links and backups, and Your words → Words and
notes): `{I}Twin[D1] kle[D1,S1:e] star[S1+M1:h] rest[D1~]` — `{…}` a lane chord
(`V7`, `bVI`, `V:inv64`; the ids written before 2026-09-27, `V/V` and the
like, still read), `:w :h. :h :q. :q :e. :e :s` a value, `,` a connected note,
`+` harmony, `~` a rest. Optional headers after `[Key of C]`: `[Scale dorian]`,
`[Time 3/4]`, `[Tempo 96]`. The board does not travel in the text.

## Storage (1.0's keys are read once, never written)

| Key | What |
| --- | --- |
| `song_writer_2_library_v1` | `{ id: record }` — the sandbox lives in it under `sandbox` but every list skips it |
| `song_writer_2_active_song_v1` | the song on screen last visit |
| `song_writer_2_view_prefs_v1` | View (and Sound's Chords, voicing, the two sounds and volumes, Room; the panel's chord set and what Z X C V B do); never travels in a link |
| `song_writer_2_layout_v1` | Layout settings (travels, locked, in student links) |
| `song_writer_2_lessons_v1`, `song_writer_2_lesson_sources_v1` | the teacher's lessons; pristine exercises for Start again |
| `song_writer_2_skip_delete_section_confirm` | 1.0's "don't show this again" |
| sessionStorage `song_writer_2_open_lesson_v1` | the lesson open in this tab (a reload keeps it) |

Rules carried over from Rhythm Poetry: the sandbox is where you land and only
**Save as…** files it; a library song opens with **auto-save off**, a new /
saved-as song with it on; `save(force)` only overrides with `force === true`;
dirtiness is a `stableStringify` fingerprint; a forbidden control is
**removed** (`.policy-off`), never greyed; a lesson link is one-way.

## Component slots — what works now, what comes next

Each file's header comment is the full contract.

- **Chord panel** (`chord-strip.js`, rebuilt 2026-09-27 on `js/chords.js`) —
  Digital Accordion's chord side, in the Panels shape: the scale's fourteen
  chords on the keys they answer to in every scale (bottom row first: **F**
  wide beside **G**; **A S D**; **Q W E R**; **1 2 3 4 5** — in major I ii /
  vi IV V / V/vi IV/IV V/V iii / ♭VI iv vii°7/V V/iii V/ii), rows sharing the
  height, names fitted to their blocks (a slash chord on two lines). Tap a
  chord, or press its key in Perform (in Edit the letters stay 1.0's solfège
  keys unless a lane slot is chosen — then the left hand takes them back);
  1–5 work in both modes. Two small buttons in the panel's top row (later on
  2026-09-27, from Digital Accordion): **names** — roman numerals (I IV V) or
  letters (C F G), one or the other; the button shows the other way, the key's
  letter while numerals are on, "I" while letters are (View pref `chordNames`;
  the lane, the corner and Layout settings follow it, and the glasses no longer
  change chord names) — and **♪ notes**, which stacks every chord's notes
  inside its block, root at the bottom, as Digital Accordion's column does:
  letters with letters, solfège with numerals (`chordTones`; the pills size
  themselves to the block, `fitLabels`). The **set button** cycles **Core** (F D
  S A) · **Full** (+ G R) · **Extended** (+ E Q W) · **Extreme** (everything);
  chords outside the set leave the panel, the lane's picker and the keys (View
  pref `chordSet`). **Z X C V B** along the bottom: hold a tab (or its key)
  and every chord relabels to what it would become; the chord played — and
  written into the lane — is that one. Each button holds a function of the
  room's choosing (View pref `modSlots`; sus2 add9 sus4 ♭7 maj7 to start,
  or the inversions 6, 6/4, 6/5, 4/3, 4/2 — the last three make a 7th chord
  first, with the scale's own 7th). **Editing** (the hat on): the pencil on a
  chord opens the **chord editor** (`#chord-sheet`: hear it, root — the twelve
  notes spelled for the scale — quality, the functions stuck to it, a name,
  *Back to the scale's chord*); the pencil after the tabs opens the **Chord
  buttons** chooser (`#mods-sheet`). Re-chorded places are the song's
  (`score.board`, a white corner on the block). Colours are the root
  letter's; out-of-scale chords are striped; a changed chord wears a white
  inner ring. Layout settings → Chords on the panel picks the *places* that
  are offered (a list saved before this named the chords; it still reads).
  *Next:* ♪ notes inside the blocks, chords bending the keyboard.
- **The corner** (`chord-strip.js` + `keyboard-dock.js`) — under the panel,
  beside the keyboard. Top: the chord in hand (the tonic chord until one is
  played), its key, its other name and quality (or "outside the scale", or
  what is being held), and its notes as coloured pills — solfège, letters with
  the glasses on. Bottom: the keyboard's own **Octaves 1–4** and **Focus**
  rows, seated here while the corner is out (`seatPanel`), so the keys take the
  dock's whole width; with the panel away they sit at the dock's left end as
  before. A container query drops the small print in a short dock.
- **Chord lane** (`chord-lane.js`) — lead-sheet lane; the chosen-slot rule in Edit;
  the picker offers the panel's chords (as any held button makes them) with
  their keys. *Next:* chord durations, chords between syllables.
- **Keyboard dock** (`keyboard-dock.js`) — dressed as the Virtual Keyboard app
  (2026-09-26): a black frame, rainbow keys (a key's top half wears its letter's
  colour, the blocks' colours; a black key in the key wears its colour as a cap,
  from its top to halfway down to that line — 25% of the key height), and a panel at the left end: **Octaves 1–4** (sets the width as in
  Virtual Keyboard — 7 keys an octave plus 3, growing to fill the dock, then the keys
  thin; a key is never wider than about half its height allows) and **Focus**
  (keys outside the key go grey and silent, except any pitch the song itself uses —
  a D♮ in A♭ unlocks D). Height: drag the grip on the dock's top edge (snaps to
  Short/Medium/Tall, measured against the window; any px is kept; double-click →
  Medium). Octaves and height are no longer in View (user, 2026-09-26) — the dock's
  own panel and grip set them.
  Which keys show: the whole song if it fits, starting on the key's letter where
  it can (C…E in C, G…B in A♭); otherwise the keys stay put until the selected note
  leaves them, then move to hold its line. "In the key" is the song's scale
  (2026-09-27): in C natural minor E♭ A♭ B♭ wear their colours and E A B go
  grey under Focus; the song's own pitches still unlock their keys. The selected note's key takes its block's
  colour and a white lamp in one row along the top of the keys (no gold); a chord's keys light the same way, without the lamp, and stay lit while you step with the arrows or change a pitch — a tap on the manuscript (a line's background, not a note) or putting the chord panel away takes them off (`chord:cleared`, 2026-09-27). Tap to
  hear a key, slide across to play each, in Edit tap to set the pitch.
  Preferences `kbOctaves`, `kbFocus`, `dockHeight` (View, remembered);
  `SW.settings.setKeyboard(patch)` emits `keyboard:changed`. The old key-under-the-
  block slide and its guide line were retired with this. *Next:* play-along, MIDI,
  more of Virtual Keyboard's settings (sound, name modes, key colour modes).
- **Value circles** (`rhythm-panel.js`) and **the Edit box** (`edit-box.js`) — above.

## Settings

- **View**: On the stage (panel, lane, keyboard) · On the page
  (staff notation, section colours) · Scale (Justify width / Fixed) · Text size ·
  Lyric font · Keyboard & strip (**Key colours** — Rainbow /
  Colours when played / One colour + 10 swatches and a colour picker; `kbColors`,
  `kbColor` — Chord panel S/M/L) · While it plays (Light up the notes,
  Follow along) · Layout settings… · How this works. Also remembered, set from
  the panel itself: `chordSet`, `modSlots`, `chordNames` and `chordTones`.
- **Sound**: see Playing.
- **Layout settings**: On the page (section titles, the panel's letter keys,
  bar numbers, 1-beat pick-up); notes that can be written; sharps and flats,
  rests, harmony, connected notes; chords on the panel (by place); note values;
  keys, and **Melody follows the scale** (`scaleMorph`, default on — travels
  with a lesson or a locked link like the rest). (1.0's chord numbers 1–9 went
  with the panel: 1–5 are the number row.)
- **Set up for students** (Library): the task · notes, chords and values · Key &
  tempo (key stays; tempo Any / Between / Locked) · the exercises · What else
  comes with it (Sound options, View options, Chord strip & lane, Keyboard,
  Section tools, Words editor, Save a picture, Present mode, Move between the
  exercises) · the link · lessons you have made.

As in Rhythm Poetry, opening a lesson link locks Layout settings on that
browser until **Share & backup → Start over**.

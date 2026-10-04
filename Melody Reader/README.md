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
rules, the points) — 60 of them, all passing as of 2026-10-04.

The Teacher Library shelf reads `../Teacher Library/index.json`, which only
exists on the live site; served from its own folder (8815/8816) it can't be
reached, so the shelf says it is offline. To test the shelf, serve all of
Claude Apps (launch entry `song-writer-test`, 8805, at `/Melody%20Reader/`)
with a temporary `Claude Apps/Teacher Library/` — envelopes plus an index
built by `EVM Library/teacher-library/.github/scripts/build-teacher-index.js`
— and delete it afterwards.

## What's built (all six phases)

- **The xylophone** — Rainbow Xylophone's look and both sounds (Vibraphone,
  Marimba), touch with glissando, mouse and pen (either button), keys 1–0
  − = and the number pad; ten bars, twelve when a practice uses F5 or G5;
  bars not in the music greyed out at the first levels.
- **The music** — Leland engraving of one or two bars; coloured notes (pale
  until played), lit when played, or black; the next note's glow; ghost
  notes where a slip landed; letter names or rhythm syllables under the
  notes; two rows on a phone held upright.
- **Practice, then the game** (2026-10-04, `../Melody Reader Design/POINTS-AND-COUNT-IN.md`)
  — each melody opens in **Practice**: ▶ Hear it, try the bars (the notes
  light as they're found, nothing counts), or a practice count-in that ends
  with *That would be 14 points*; **I'm ready ▸** goes to the game, where
  the notes are dark again and ▶ is gone. The first bar struck starts a try
  on your own; **Count me in** starts a run. Once started, the try is the
  score (Again waits). Levels 14–15 (sight-reading) have no Practice; it is
  a switch in Helps, as is *Hear it in Practice*. Beat the clock has neither
  Practice nor the count-in.
- **Count me in** — the family count-in (*Get ready 1 2 3 4*), then a
  metronome through the melody at **Slow 60 · Moderate 80 · Fast 100** (the
  pace pill under the button; the three tempos are in How to play). Nothing
  shows but the notes lighting when struck in time — no playhead, no words,
  no ghosts; the missed notes show at the end. Judged by the time the child
  *heard* (Perfect · Good · Early/Late · Missed windows, never shown).
- **Points: 1–20 a melody** (`js/points.js`) — **1–8** finding the notes
  (first try 1, second ½); **9–12** every note first time in your own steady
  beat (a least-squares fit finds your tempo; the leftover, in beats, is the
  grade — 12 ≤ 0.06, 11 ≤ 0.10, 10 ≤ 0.15, 9 ≤ 0.21, else 8); **13–20** a
  clean count-in run: Slow 13–15, Moderate 16–18, Fast 19–20. A count-in
  with every bar right but some early/late drops to 9–12; a wrong or missed
  note drops it to 1–8 (−½ a wrong bar). Stars: ★ 1–7 · ★★ 8–12 · ★★★ 13–20;
  next level at ★★ or better in 4 of 5. The streak counts 8+ in a row (no
  bonus). Points and stars can each be turned off.
- **Games** — Round of 5 or 10, Song (card by card, then *Hear your song*),
  Beat the clock (30 s · 60 s · 2 min), Endless. The game belongs to the
  browser, not the practice, so changing it never makes a level Custom.
- **Fifteen levels** in six rainbow bands, a Songbook of twelve songs, and
  made-up melodies for every card.
- **Settings** — Level (with best stars, and a *Mine* band for saved
  practices), Notes, Rhythms, How to play, Helps, Points, Sound, Share.
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
| `js/levels.js` | the ladder, the defaults, `sanitize`, the Mine band |
| `js/game.js` | the card, Find the notes / No slips, scoring, rounds, games, Play; `RR.Scores` |
| `js/beat.js` | Count me in: the count-in, the metronome, judging a run |
| `js/points.js` | what a try is worth (1–20), the stars, the paces' tempos |
| `js/settings.js`, `js/board.js` | the two windows, Round done, Time's up |
| `js/lesson.js`, `js/app.js` | lesson links; the keys, the buttons, the start |
| `js/sets.js` | My melodies' data: melody sets by the EVM Library rules, links, backups, the shelf |
| `js/melodies.js`, `js/maker.js` | the My melodies window; Make a melody |
| `js/players.js` | names on a shared computer |
| `lib/` | vendored copies — see `lib/README.md` |
| `assets/MA4A-rainbow-reader-cover.jpg` | the hub card's cover (400×400) |
| `tests/index.html` | the engine checks |

## Storage

`rainbow_reader_device_v1` (sound, points/stars, folded notes, the current
level or practice, the game), `rainbow_reader_scores_v1` (per player: best
rounds, the ladder's stars, first-try counts per note, mix-ups, totals),
`rainbow_reader_mine_v1` (saved practices), `rainbow_reader_sets_v1` (My
melodies, an id map of EVM items). The device also keeps the set being
played and the player names. Every read is checked and
falls back to defaults; a change of shape gets a new `_v2` key.

## Traps (found while building)

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
- The Practice / For points tag sits in the line under the music: at the
  top-right it covered I'm ready on a 600 px-tall window. On a phone the
  round's dots move to the top-left — the bottom row (Hear it, Count me in,
  the pace pill, I'm ready, Next) is full.
- The scores became `v: 2`: loading a `v: 1` file clears the best rounds
  (old scale) and keeps the ladder's stars, tricky notes, mix-ups, totals.

# The Rhythm page — design note (2026-10-25)

The top switch is now **Pitch · Notation · Rhythm** (was Song · Keyboard · Chords).

| Tab | What it is | How it is stored |
| --- | --- | --- |
| Pitch | the coloured note blocks (the song as 1.0 showed it): decide the notes | `view.showStaff = false`, `view.rhythmPage = false` |
| Notation | the treble staff: fine-tune, add chords, see what the song has become | `view.showStaff = true`, `view.rhythmPage = false` |
| Rhythm | NEW — Rhythm Poetry's circle system over the same song: shape the rhythm | `view.rhythmPage = true` (showStaff untouched) |

Keyboard and the chord panel, which the old switch put out, live on as the two
View → Staging switches (**Display Chord Panel**, **Display Keyboard**) — they
already existed and are unchanged. The old `view.workspace` key is still read
and written (nothing depends on it now), so saved preferences load as before.
`setView({ showStaff })` from anywhere (View popover, the Edit box's switch)
also clears `rhythmPage`, so the three tabs always agree with the page.

Intended flow: **Pitch** (choose the notes; every column is a block, one beat
long) → **Rhythm** (tap the circles; each tap writes the beat) → **Notation**
(fine-tune, chords, the result).

## The song model and the circle editor

Nothing new is stored. The Rhythm page is a view of the same `.notation-line`s
through `js/flow.js`:

```
line (DOM)  --readLine-->  lineModel  --F.cellsOf-->  cells[]   (one per sixteenth, 6 ticks)
                                                        │
             gesture on a beat → new cells[] → F.applyCells(line, cells, focus)
                                                        │
                                           onsetsFromCells → pour → replaceLine → changed('rhythm')
```

* A **cell** is `on` / `hold` (a sound starts / goes on), `bon` / `bhold` (a
  block: one beat, rhythm undecided), `reston` / `rest` (silence — a word's own
  rest too, marked `silent` and carrying its item) or `fill` (after the line's
  music, to the end of its bar). `cs.shift` is the pick-up's open part; `cs.end`
  is the line padded to whole bars.
* A **beat** is `perBeat` cells: 4 in 2/4 3/4 4/4, 6 in 6/8 9/8 12/8. A bar
  is `mt.beats` beats; bar *k* of a line is cells `[k·bar − shift, (k+1)·bar − shift)`.
  Each Song Writer line is a phrase that starts a new bar, so one Rhythm Poetry
  "line" = one song line; a line with a pick-up opens with a pick-up measure
  (dashed, as in Rhythm Poetry) holding only the beats from the pick-up on.
* A beat's **circles** are its slots: 2 (eighths) or 4 (sixteenths) in simple
  time, 3 or 6 in compound — `+` on the beat switches, exactly as Rhythm
  Poetry's `+`. A slot shows the cell at its start: `on`/`bon` → orange (a
  note starts), `hold`/`bhold` → yellow (it goes on), anything else → grey
  (silence). Those are Rhythm Poetry's three colours and the same reading.
* **Tap a circle** (Rhythm Poetry's toggle, in cell terms — `F.tapSlot`):
  orange → off (it becomes a hold of the note before inside the beat, else a
  rest, and holds after it go silent); yellow → a new note starts; grey → a
  note that is held to the end of its beat. A block beat is written as it was
  (a quarter / dotted quarter) and then the tap applies, so one tap does both.
* **A note needs no word** (flow.js R2, 2026-11-04 — the user: "lets allow notes
  to be added even when there are no words to place under them"). A circle makes
  what it shows: an onset past the melody's last pitch is a new note, the pitch
  before it on a `-` syllable of its own, ready for a word. So a grey circle past
  the last note, or a yellow one inside it, starts a note; tapped again it goes
  (at a beat's start to silence, off the beat back into the note before). A
  wordless note goes when its own time has gone or when it only repeats the pitch
  before it; a note with a word, or its own pitch elsewhere in the line, waits at
  the end, and takes its time back when a tap makes room (THE WAITING NOTES).
  **A circle tapped twice gives the line back** (2026-11-22, bug report 1e —
  `flow.js` A CIRCLE TAPPED TWICE): the page remembers the line as it was before
  the last gesture, for as long as nothing else has changed it, and a gesture
  that brings the circles back to just what they showed then brings that line
  back, pitches and words too (a wordless last note tapped off and on had come
  back as the pitch before it: do re mi fa → do re mi mi). × on a bar takes its
  wordless notes with it; × never leaves a line empty (its only bar, or its only
  note, says to delete the line in Edit). Silence runs together (two rests that
  each began are one), and the silence after the last note inside its bar is never
  written (whole empty bars from + stay, and so does a rest the line already had
  there — a Rest put in at the line's end). A lesson that locks the melody or the words keeps the rule of
  10-26: an onset the melody cannot fill is silence, a yellow circle inside the
  last note ends it, a grey one right after it lengthens it, and any other says
  every note is placed. History: a hollow **ghost** note (10-01), a tie from the
  note before (10-25), silence for everyone (10-26: taps made ties no tap could
  undo); a saved ghost still reads as the rest it stood in for.
* **A word's own rest** (a word rested in Edit) is a grey circle with a ring,
  its word under it, and reads `R` in the notation box; a tap on that circle
  makes the word sound again (`score.unrestColumn`, one Undo step). Its later
  cells are plain silence (grey). It is ONE onset, from where it begins: once a
  tap, a value or a bar line has cut into it, what is left of it is plain
  silence (2026-11-22, bug report H7 — as an onset of its own it took the next
  word, and every later word slid).
* **⛓ between two beats** of one bar = `F.toggleJoin`: the sound goes on over
  the beat line (a half note is two joined beats). Offered wherever the beat
  before ends in a sound, simple and compound time alike.
* **No Easy, no head row** (2026-10-26, the user): the page's Dots | Easy
  switch, its Easy circles and the whole row above the music (the RHYTHM title
  and its hint) are gone — the circles are the only way in. (The beat strip's
  Easy circles, beat-strip.js, are a different place and stay.)
* **Bar lines**: `+` inserts an empty bar (a bar of rests) after that bar,
  `×` removes the bar. The melody pours into what is left (Rhythm Poetry's
  words re-flow): a removed bar's notes wait at the line's end as blocks (R1 —
  no word is ever deleted). `×` on a **pick-up's bar** takes the pick-up away
  too, as the staff's × does (`flow.applyCells` opts.unpick): the line starts on
  the downbeat and its beats stay on the beat (2026-11-22, bug report H8 — the
  pick-up stayed marked and every note moved onto the "and"). The beats shown
  in sixteenths move with the bars a `+` or `×` moves. The end-of-song double
  bar closes only the song's last bar (M1: it closed every line).
* **A line before a pick-up line** runs on, in silence, into the bar that
  pick-up finishes (timing.js PADDING): that bar is drawn, numbered, up to where
  the pick-up begins — its beats after that are left out, its circles there
  `off` — as the pick-up's own bar is drawn only from where it begins. The same
  for the song's last line when line 1 has a pick-up (the song goes round).
  (2026-11-22, bug report M2: the length was rounded to whole bars — a bar of
  grey circles in the next line's time, which threw when tapped, or one bar too
  few, and the numbers jumped.)
* **Sixteenths** show in a beat when `+` asked for them or a note (or rest)
  starts on one — in the page's part, or in another part shown with it (its
  pills take these widths, bug report M7), and in a pick-up's open beat too (a
  sixteenth or dotted-eighth pick-up had no circle on its note, M3). The other
  parts' words take room in the layout as the page's own do (M7: they overlapped).
* The **notation box** under each bar is `SW.engrave.rhythm` (the single-line
  rhythm engraver already used for Pre-built chord rhythms) placed on the
  circles' measured centres (`opts.xAt`, new), one SVG per bar; noteheads keep
  their pitch's colour, block beats are drawn faint. The **words** sit under
  their start slot, as on Rhythm Poetry's Poetry side. A syllable typed with its
  dash in the old way ("ear-" "-ly") is drawn as `hy` is: one hyphen, centred
  (bug report L14); with parts, each part's hyphens look to that part's own next
  word (L15). A chord's strike dots sit on their circles, or at their time
  between two (a chord from a sixteenth lost its first dot).
* **Typing a word** (2026-10-26): a double-click (double tap) on a note, or in
  the words' row under it, opens its word in a box under the note — Enter or a
  click elsewhere keeps it, Esc lets it go, Space at its end keeps it and opens
  the next word. The word goes into the song through `score.setWordAt(stack,
  text)` (one Undo step); on a connected note it makes that note a syllable of
  its own, as on the Notation page. The box lives through redraws (`typing`
  remembers the column). Live in Edit while the words may change
  (`S.editing && can('words')`), as on the Notation page — the lock with the box
  shut, and Present, end Edit (2026-11-22, bug report M9: the word was saved
  past both; until then it was "hat or not").
* **The Edit box's rhythm tools work this page's way** (2026-10-26, the user: a
  half note from the Edit box moved bar 2's eighths, the same half note from the
  circles did not): the value circles, Dotted, Tie, Rest and Fill bar are cell
  gestures too (`flow.js` THE EDIT BOX, THE CIRCLES' WAY) — the note takes its
  length from where it starts, the grid of beats after it stays (what it covers
  is absorbed, what it cuts into starts anew where it ends), and the melody
  pours. Tie = the note goes on an eighth, written as a tie; Tie again = the
  held part goes quiet (as ⛓ apart); Rest = a rest cut out of the beats after
  the note. So whichever page a rhythm is made on, the other two show the
  same thing, and nothing ever slides onto the off-beat. (Tap in, which laid
  its take on the cells the same way, lost its button on 2026-10-26; its
  engine was taken out of flow.js on 2026-11-22, bug report L17.)
* **Ties hold only the same pitches**: a tie mark onto a note of another pitch
  is dropped when a song is read (`score.normalizeScore`), as timing.js never
  tied it anyway — so the flow never takes two different notes for one sound.
* **Colors (the Edit box) — a cycle of three** (2026-10-26, the user): a tap
  takes the notes' pitch colours away (`body.rp-mono`: heads in ink), the next
  takes the circles away too (`body.rp-no-circles`; the circles only go once
  the notes are black), the third brings colours and circles back. Both
  remembered (`rhythmColours`, `rhythmCircles`, the Rhythm page's own — the
  Notation page's Colors is a separate switch). Unlocking always brings the
  circles back; the colours stay as chosen. Switched off and then locked, the
  circles stay off — a locked page reads as notation and words alone. The
  pills keep their width at no height, so the notes stay on the circles'
  centres and every gesture on the notes still works.
* **Selection / playback**: the beat holding the selected column wears the
  selected ring, and the note itself has a glow behind it — the pill often
  holds several notes (the user, 2026-10-26) — drawn as the Notation page
  draws its own (two soft discs of Do's colour under the ink) and under the
  same View → Light up setting (Note / Both); while playing, the beat that
  is sounding is washed and the sounding note glows (the
  player's `selection` events, the stack's `.sounding`). Tapping a note, or
  the word under it, selects (and sounds) THAT note — the piece drawn nearest
  the tap (`stackNear`; a tied piece is the note it goes on from, a written
  rest its rest column) — so Play starts from it. (Until 2026-10-26 it was
  the bar's / beat's first note, whatever was tapped.)
* **Editing is live** whenever a lesson allows note values (`can('values')`),
  hat or no hat — Rhythm Poetry's way. Every gesture is one `changed()` = one
  Undo step (⌘Z, or the Edit box's Undo).

What Rhythm Poetry has that the song model cannot hold: **triplets / tuplets**
(ticks are 24 to a quarter, values go down to a sixteenth, no tuplet value
exists), so the `−` button is not offered; and a rest *after* a note inside a
beat (𝅘𝅥𝅯. 𝄿) which the circles show truthfully (orange, yellow, grey) but which
Rhythm Poetry's per-beat vocabulary never writes — Notation can still write it.

## Where things live

* `js/settings.js` — `rhythmPage` pref, `setPage`, tab sync, `body.page-rhythm`
* `js/components/rhythm-page.js` — the page (`SW.rhythmPage.render()`), `#rhythm-stage` in `index.html`
* `js/engrave.js` — `rhythm(cells, { xAt, width })`: pieces on given centres, each piece in a `<g data-a>`
* `style.css` — "THE RHYTHM PAGE" block (Rhythm Poetry's pill / circle / notes-box / words / divider CSS, in Song Writer's palette); `#score` stays laid out but invisible under `body.page-rhythm` so the staff, timing and the player keep working from it

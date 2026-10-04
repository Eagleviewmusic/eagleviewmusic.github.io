# Song Writer 2.0 / 2.5 — JSON formats

(2.5 writes the same shapes under its own keys, `song_writer_25_*`, and adds
`cols[].ghost` and — 2026-10-03 — `progressions` and `track` (the chord
progressions and where they play, §2); everything else here is unchanged.)

Every shape Song Writer 2.0 writes down or sends somewhere, in one place, so
they stay steady while the app is still changing. **If you change any of these,
change this file in the same edit** — and keep reading what older versions
wrote (old links and backups live on in Google Sites and on students' laptops
for years).

The library header (`id`, `createdAt`, `updatedAt`, `received`, …) and the
import rule are shared by every Eagle View Music app and are defined in
`../EVM Library/README.md`. This file covers what is Song Writer's own.

| Where | Key / carrier | Shape | Section |
| --- | --- | --- | --- |
| Library | `localStorage.song_writer_2_library_v1` | `{ [id]: record }` | 1 |
| A song's music | `record.score` | the **score model** | 2 |
| 1.0 text | `record.content` (1.0), text editor, envelopes | the **text format** | 3 |
| Share link | `#song=<base64 JSON>` (`?song=` before 2026-09-28) | link payload | 4 |
| Backup file | *Share & backup → Download* | `{ app, version: 2, songs }` | 5 |
| Lesson link | `#lesson=<base64 JSON>` | lesson payload | 6 |
| Layout settings | `localStorage.song_writer_2_layout_v1`, `record.layout`, links, lessons | layout | 7 |
| Teacher Library shelf | `localStorage.evm_shelf_out_v1`, `…evm_shelf_index_v1` | books out; last index | 8 |
| Everything else | `…_active_song_v1`, `…_view_prefs_v1`, lesson keys, sessionStorage `…_open_lesson_v1` | this device only; never travels | — |

Base64 in links is UTF-8 bytes → `btoa` (see `ui.encodeJson` / `ui.decodeJson`
in `js/core.js`).

## 1. Library record

```json
{
  "id": "song_1790115314073_krre",
  "title": "Rain on the Roof",
  "score": { "v": 2, "key": "C", "lines": [ … ] },
  "isCustom": true,
  "createdAt": 1790115314073,
  "updatedAt": 1790115399000,
  "layout": { …§7… },
  "received": true,
  "receivedAt": 1790115314100,
  "derivedFrom": "song_1789512614629",
  "book": "Winter Songs"
}
```

- `title` is trimmed and at most 60 characters.
- `isCustom: false` only for the three built-ins: `twinkle`, `mary`,
  `starspangledbanner`.
- `received`, `receivedAt`, `derivedFrom` are optional (see the EVM Library
  README, §1 and §3). A received song is never saved into.
- `book` is optional: the Teacher Library book this shared song was taken out
  in (only on received songs; set by `lib/evm-shelf.js`, see §8). A Save my
  copy of it never carries `book` — the copy is the student's own.
- `layout` is optional: the Layout Settings (§7, a `layoutSnapshot()`, so
  `locked: false`) the piece was saved with. Every piece keeps the Layout
  Settings it was saved with; opening it brings them back — a shared piece's
  only for that piece, locked; your own become the settings in use. Save my
  copy keeps them, unlocked. Lesson songs never carry `layout`. It is not part
  of what makes two songs the same (matching is by `score` alone), but a
  change to it moves `updatedAt`.
- The sandbox lives in the same object under the id `sandbox`; it is not a
  library song and never travels by id.
- `normalizeSong(raw, idHint)` in `js/library.js` turns anything —
  a 1.0 record `{ id, title, content }` included — into this shape. It must
  keep the header fields (`EVM.carry`) and `layout`, or the next save drops
  them.

## 2. The score model (`score`, `v: 2`)

```json
{
  "v": 2,
  "key": "G",
  "scale": "dorian",
  "board": { "d": { "root": "5", "q": "dom7", "mods": [] } },
  "progressions": [
    { "id": "p1", "name": "Verse", "rhythm": "q q e e q",
      "chords": [ { "chord": "I", "place": "f" }, { "chord": "IV" }, { "chord": "V" }, { "chord": "vi", "rhythm": "h h" } ] }
  ],
  "track": [
    { "prog": "p1", "from": 1, "to": 8,
      "here": [ { "bar": 8, "beat": 1, "beats": 4, "chords": [ { "chord": "IV", "beats": 2 }, { "chord": "V", "beats": 2 } ] } ] },
    { "from": 9, "to": 9, "chords": [ { "chord": "bVII", "beats": 4 } ] }
  ],
  "meter": "3/4",
  "bpm": 96,
  "lines": [
    { "label": "A",
      "syllables": [
        { "text": "Twin", "chord": "V7",
          "cols": [ { "v": "q", "notes": [ { "n": "do" } ] } ] },
        { "text": "kle",
          "cols": [ { "notes": [ { "n": "so", "acc": "sharp" }, { "n": "mi" } ] } ] },
        { "text": "-",
          "cols": [ { "v": "q", "notes": [ { "n": "do", "rest": true } ] } ] }
      ] }
  ]
}
```

| Field | Values | Notes |
| --- | --- | --- |
| `v` | `2` | The model's version. |
| `key` | `C Db D Eb E F F# Gb G Ab A Bb B` | |
| `scale` | a scale id from Digital Accordion's `theory.js` (`major`, `minor`, `natural-minor`, `harmonic-minor`, `melodic-minor`, `dorian`, `phrygian`, `lydian`, `mixolydian`, `locrian`, `major-pentatonic`, `minor-pentatonic`, `blues`, `whole-tone`, `octatonic-hw`, `octatonic-wh`, `double-harmonic`, `hungarian-minor`, `phrygian-dominant`) | Optional (2026-09-27). **Omitted when `major`.** Decides the chords on the panel and the notes the keyboard colours; the melody's solfège is untouched. |
| `board` | `{ place: { root, q, mods, label? } }` — place one of `f d s a g r e q w 1 2 3 4 5`; `root` a degree relative to the tonic (`5`, `b6`, `#4`); `q` a quality id from `theory.js` (`maj min dim aug sus2 sus4 pow dom7 maj7 min7 m7b5 dim7 mmaj7 aug7 dom7b5 six min6 add9 madd9 six9 dom9sus4 dom7s9 dom7b9 dom9s5 dom13b9 majb5`); `mods` function ids (`sus2 add9 sus4 b7 maj7 inv6 inv64 inv65 inv43 inv42`); `label` ≤ 12 chars | Optional (2026-09-27). The places on the chord panel the song has re-chorded; a place left out shows the scale's own chord. **Omitted when empty.** |
| `progressions` | `[ { id, name, beats?, bars?, rhythm?, chords: [ { chord, place?, beats?, rhythm? } ] } ]` | **2.5, 2026-10-03** (`js/track.js`). The song's chord progressions. `id` `p1`, `p2` … (unique; never reused). `name` ≤ 24 characters (default *Progression n*). `beats` how long a chord lasts when it does not say (omitted = one bar of the meter). `bars` `2` for a two-bar rhythm (omitted = 1). `rhythm` what every bar plays (omitted = one strike a beat). `chords[].chord` a chord id as `syllables[].chord`, or `null` (no chord); `place` the panel key it was picked from (`f d s a g r e q w 1–5`); `beats` its own length (any number of sixteenths); `rhythm` its own, as long as the chord. **Omitted when empty.** |
| `track` | `[ { prog?, from, to, phase?, here?, chords? } ]` | **2.5, 2026-10-03.** Where the progressions play, in bars as the staff numbers them (bar 1 = the first whole bar; 0 = a first-line pick-up). `prog` a progression's `id`; `from` / `to` the first and last bar (`to` may be `"melody"`: the melody's last bar, whatever it is now); `phase` beats into the progression at `from`; `here` changes made just there — `{ bar, beat, beats, chords }`, the chords' `beats` summing to `beats`. Without `prog`, `chords` are **loose chords** laid end to end once from `from` (struck once and held unless given a rhythm). Stretches are kept in bar order and never overlap (a later one loses the bars an earlier one has). The melody never moves them; a new scale or time signature changes them as the app does (`track.js` followScale / followMeter, Song Writer Chord Progressions DESIGN §10). **Omitted when empty.** A song with lane chords (`syllables[].chord`) and no `track` plays them as one stretch of loose chords; the first change to the track writes that in and drops the syllables' chords. |
| *rhythm strings* | value ids, space-separated: `q q e e q`; `~` after one = silence (`q~`); `_` joins values into one strike (`h_e`) | Read for `progressions[].rhythm`, `chords[].rhythm`, `here[].chords[].rhythm`; written back as the fewest values. One too short is filled out with silence, one too long is cut. |
| `meter` | `2/4`, `3/4`, `4/4`; 2.5 also `6/8`, `9/8`, `12/8` | **Omitted when `4/4`.** In the compound meters a beat is a dotted quarter: a block (no `v`) lasts 36 ticks and `bpm` counts dotted quarters. 2.0 reads a compound meter as 4/4. |
| `bpm` | 30–300 (the family's range; songs saved when it was 40–200 read unchanged) | **Omitted when 100.** |
| `pickup` | `1` | **No longer written** (2026-09-28 to 2026-10-01: every line opened with a one-beat pick-up). Still read: each line without `pickup: false` gets `pickup: "q"`. Before 2026-09-28 it was the Layout setting `show.pickup` (§7); a record, link or lesson whose `layout.show.pickup` is `true` and whose score has no `pickup` is read as `pickup: 1` (`normalizeSong`). |
| `lines[].label` | string, ≤ 15 chars | Section name (`A`, `Verse`…); may be empty. |
| `lines[].pickup` | a value id shorter than a bar: `s`, `e`, `e.`, `q`, `q.`, `h`, `h.` | Optional (2026-10-01). The line opens with a pick-up worth that value; its first bar line falls that far in. **Omitted = none.** A value a bar long or more is dropped on reading. (`false` — the older "this line's pick-up was taken away" — is still read, with the song's old `pickup: 1`.) |
| `syllables[].text` | string | `-` means no word under these notes. Never empty. |
| `syllables[].chord` | *(2.5: still read; the chord track replaces the lane — see `track`)* a chord id (`I`, `V7`, `ii`, `bVI`, `#iv°7`, `Imaj7`, `V:inv64`, `I:sus4,add9`) | Optional; one per syllable, drawn in the chord lane. The id is a roman numeral the engine (`js/chords.js`) reads back in any key: ♭/♯ + numeral (lower case = the minor family) + Theory's quality suffix, then `:` and the functions applied, comma-separated. The fourteen ids written before 2026-09-27 (`I ii iii IV V vi V/V V/vi IV/IV bVI iv vii°7/V V/iii V/ii`) still read (`V/V` → `II`, `vii°7/V` → `#iv°7`). An id the engine cannot read is kept and drawn grey. |
| `syllables[].cols` | ≥ 1 column | One column per note in time; a syllable can hold several (a melisma). |
| `cols[].v` | `w h. h q. q e. e s`; 2.5 also `w.` (dotted whole, 144 ticks) | The note value. **Omitted = a block**: pitch only, length undecided, counted as a quarter until written. |
| `cols[].tie` | `true` | Optional (2026-09-25). Tied to the next column: every pitch the two share sounds once, held for both. Only on a written column (`v`), never a rest. |
| `cols[].ghost` | `true` | Optional (2.5, 2026-10-01). A note the rhythm made (`js/flow.js`) when a rhythm had more notes than the melody had pitches: it repeats the pitch before it, has no word, is drawn hollow and dashed, and a later rhythm change may take it away again. Giving it a pitch of its own (↑↓, a letter, ♯♭, harmony) clears the mark. Older readers ignore it (an ordinary note). Not carried by the text format. |
| `cols[].notes` | ≥ 1 note | Several notes in one column = harmony, sounded together. |
| `notes[].n` | `mi-low fa-low so-low la-low ti-low do re mi fa so la ti do-high re-high mi-high fa-high so-high la-high` | Solfège in the key, movable do. |
| `notes[].acc` | `sharp`, `flat` | **Omitted = natural.** |
| `notes[].rest` | `true` | Optional. A rest keeps a pitch so it can be turned back into a note. |
| `notes[].step` | a rung, as `n` | Optional (2026-09-29). The melody's rung when the song's scale shows the note on another one — a fa shown as mi because major pentatonic has no fa. Omitted = `n`. |
| `notes[].alt` | `{ "<scale id>": { "n": "fa", "acc": "sharp" } }` | Optional (2026-09-29). **Each scale's fine-tuning.** `n`/`acc` are the note in the song's `scale`; `alt` holds the pitch it was given with ♯/♭ in *other* scales. A scale not listed plays the note as that scale has its step (minor's me for a mi), so an accidental made for one scale never reaches another. Text format: `F1^major=F#1^step=F1`. |

Rules that keep two identical songs identical (the library matches songs by
content, so this matters): `SW.score.normalize` (`normalizeScore` in
`js/score.js`) fills in the omitted defaults, drops unknown notes, gives every
syllable at least one column and every column at least one note. Always
compare or fingerprint the **normalized** score, never the raw one.
`readScore()` writes the compact form (defaults omitted).

## 3. The 1.0 text format

Still read everywhere a score is (1.0 songs, 1.0 links and backups, the text
editor) and written by `SW.score.toText`:

```
[Key of C]
[Scale dorian]      (optional; omitted for major — 2026-09-27)
[Time 3/4]          (optional; omitted for 4/4)
[Tempo 96]          (optional; omitted for 100)
[A]
[Pickup e]          (optional, under a line's name: its pick-up — 2026-10-01)
{I}Twin[D1] kle[D1:q] {V7}twin[S1,S1:e] kle[S1+M1:h] rest[D1~]
```

The `board` does not travel in the text (the JSON carries it). A `[Pickup 1]`
in the head (2026-09-28 to 2026-10-01) is still read: a quarter on every line.

`[X1]` note shorthand, `,` next column, `+` harmony, `:q` a value, `~` a rest,
`_` at a column's end a tie to the next (`D1:q_,D1:e`),
`#`/`b` after the letter an accidental, `{…}` a chord before the syllable.
A 1.0 song is this text with no values, chords, time or tempo.

## 4. Share link — `#song=`

Written in the hash since 2026-09-28: the part after `#` is never sent to the
server, so a long song cannot hit GitHub Pages' limit on an address (~8 KB —
past it the server answers "URI too long" and the app never loads). Links
made before, with `?song=`, are still read.

```json
{ "v": 2, "title": "Rain on the Roof", "score": { … },
  "id": "song_1789512614629", "createdAt": 1789512614629, "updatedAt": 1789600000000,
  "sandbox": true,
  "layout": { … }, "layoutLocked": true }
```

- `id` / `createdAt` / `updatedAt` are present **only** when the link holds
  exactly what is saved under that id (`EVM.shareHeader`); never for the sandbox
  or a built-in.
- `sandbox: true` — the link opens in the receiver's sandbox, not the library.
- `layout` + `layoutLocked` — sent when *Lock layout on share* was ticked.
  The receiver's settings take it, locked; and since a record's own `layout`
  (§1) has the same name, the shared song is filed carrying it too. Without
  the tick the link carries no `layout`, and the song opens with the
  receiver's own settings.
- Also read: 2.0 links made before 2026-09-28 (`?song=`), and 1.0 links, `#song=` with `{ "title", "content" }`.
- On arrival: `EVM.file` (EVM Library README §2) — filed once, as a shared song.

## 5. Backup file

```json
{ "app": "Eagle View Music Song Writer 2.0", "version": 2,
  "exportedAt": "2026-09-22T18:00:00.000Z", "count": 3,
  "songs": [ record, … ] }
```

Also read: 1.0 backups (`songs` of `{ id, title, content }`), a bare array of
records, 1.0's raw library object `{ id: { title, content } }`, and EVM
envelopes / bundles for `app: "song-writer"` (whose `data` holds `score`
and/or `content`).

## 6. Lesson payload — `#lesson=`

```json
{ "lesson": 1, "v": 1, "id": "lsn_1790115314073", "title": "Write a melody",
  "policy": { "v": 1,
              "task": { "melodyLocked": false, "wordsLocked": true, "chordsLocked": false, "note": "" },
              "key": { "locked": false },
              "tempo": { "mode": "range", "min": 60, "max": 120 },
              "shell": { "sound": true, "view": true, "strip": true, "dock": true, "sections": true,
                         "textEditor": true, "picture": true, "present": true, "library": "lesson" } },
  "layout": { … },
  "songs": [ { "id": "…", "title": "…", "score": { … }, "isCustom": true } ] }
```

Lesson songs carry **no** `createdAt`, `updatedAt`, `received`, `receivedAt`,
`derivedFrom`, `book` or `layout` (the lesson's own `layout` rules them
all): the exercises are the student's to work in, not shared songs that
refuse to save. They are filed under ids made from the lesson — the title,
and (since 2026-09-25) the last characters of the lesson's own `id` — so
the same lesson opened twice is not two copies, and two lessons that share
a title never share exercises: `lesson_<slug>_<id-tail>_<i>`.

Added 2026-09-25 (all optional; a lesson without them opens exactly as before):

| Field | Values | Missing means |
| --- | --- | --- |
| `id` | the teacher's saved lesson id | the old ids, `lesson_<slug>_<i>` |
| `policy.tempo.mode` | `any` · `range` · `locked` | `any` |
| `policy.tempo.min`, `.max` | 30–300 BPM (`min ≤ max`) | 60, 120 |
| `policy.shell.sound` | the Sound button | `true` |
| `policy.shell.present` | the Present button | `true` |
| `policy.task.chordsLocked` | **2.5, 2026-10-03.** `true`: *Chords: listen only* — the chord progressions and the chord track can be seen and heard, not changed | `false` |

`range` narrows the BPM chip and its slider to `min`–`max` (a song saved
outside them starts at the nearest); `locked` leaves the BPM as plain text
at each exercise's own tempo.

The lesson open in a tab is also kept in **sessionStorage**
(`song_writer_2_open_lesson_v1`: `{ title, songIds, policy, current }`), so a
reload does not end it. It never leaves the device.

## 7. Layout settings

```json
{ "v": 1, "notes": null, "accidentals": true, "rests": true, "harmony": true,
  "connected": true, "chords": null, "values": null, "keys": null, "scaleMorph": true,
  "show": { "sectionTitles": true, "keycaps": true, "barNumbers": true },
  "locked": false }
```

`show.barNumbers` (added 2026-09-25): a small number over the first note of
each bar on written lines. Missing means `true`.

`show.pickup` (2026-09-25 to 2026-09-28, no longer written): the 1-beat
pick-up, now the score's own `pickup` (§2). Still read once, to carry an older
song's pick-up over.

`null` in a list means "all of them". `values`, when a list, always includes
`q` (a block counts as a quarter). `locked` is set when the layout arrived in
a link or lesson; `layoutSnapshot()` always sends it as `false` and the
receiver locks it. A record's own `layout` (§1) is the same shape; a shared
piece's is locked in memory only, never written to this key.

## 8. Teacher Library shelf

`lib/evm-shelf.js` (the shared component; see `../EVM Library/README.md`,
§8) keeps two keys of its own, not Song Writer's:

| Key | Holds |
| --- | --- |
| `evm_shelf_out_v1` | `["Winter Songs", …]` — the books a student has out. Shared by every app on the site, so a book taken out in one app is out in all of them. |
| `evm_shelf_index_v1` | the Teacher Library `index.json` last read, so the shelf still shows offline. |

A book's songs for `app: "song-writer"` are filed in the library (§1) as
received records with `book` set; their envelopes' `data` holds `score` and/or
`content`, which `normalizeSong` reads either way. Putting the book back
removes every received record with that `book`. The shelf is off in a lesson.

## 9. View preferences (this device only)

`localStorage.song_writer_2_view_prefs_v1` never travels, but old values
must still read:

| Key | Values | Notes |
| --- | --- | --- |
| `workspace` | `song` · `keyboard` · `chords` · `custom` | 2.0 stored `classic` / `melody`; they are read as `song` / `keyboard`. |
| `colours` | boolean, default `true` | Section colours (was an unremembered toolbar button). |
| `playLight` | `note` · `box` · `both` · `off`, default `note` | While it plays → Light up (2026-10-01): the sounding note glows, a box behind its word, both, or nothing. Every light is behind the note. Replaces `lightNotes` (boolean): a stored `false` reads as `off`. |
| `colourPictures` | boolean, default `true` | Library → Keep the section colours in saved pictures. |
| `voicing`, `laneChordsPlay` | as before | Now shown in the Sound popover. |

Sound's Melody, Steady beat, Count-in and At the end are not stored (reset
each visit, as Rhythm Poetry's switches are).

## When you change a shape

1. Add, don't rename. Readers ignore fields they don't know, so adding is safe.
2. A renamed or re-meant field needs the reader to accept **both** forever —
   and a bump of that shape's `v`.
3. Update `normalizeSong` / `normalizeScore` / `normalizeLayout` so the old
   shape still comes in, and add the old shape to this file under "Also read".
4. If the change affects what counts as "the same song" (§2's normalization),
   remember that the library matches by it: two copies that used to match
   must still match.

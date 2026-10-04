# Virtual Keyboard — the Library, phase two

Phase one (2026-09-26) gave Virtual Keyboard the Key Blocks look and a
**Library** button. Phase two makes the Library a real save system — your own
layouts, your own scales — following the Eagle View Music rules in
`Claude Apps/EVM Library/README.md`, so the Librarian and the Teacher Library
shelf can carry Virtual Keyboard items like every other app's.

## What phase one already does

**The Library window** (Library button in the top bar):

- *Now playing* — the layout on screen, e.g. "E♭ Dorian · Piano · Flex · 1 octave".
- *Send this layout* — **Create a link** (copied for you), **Download as JSON**,
  **Open a JSON file…**.
- *Starters* — eight built-in layouts (C Major, G Major with note names,
  A Minor Pentatonic, D Dorian, E Phrygian, C Blues with Focus, C Whole Tone,
  F Lydian on the computer keys). **Open** puts one on screen.

Nothing is **saved** yet. A link or file is opened, not filed; a reload starts
at C Major.

**A layout** is exactly what `getLayout()` returns in `script.js`:

| Field | Values | Default |
| --- | --- | --- |
| `key` | `C Db D Eb E F Gb G Ab A Bb B` (sharps are read too) | `C` |
| `scale` | a `Theory.SCALES` id (Key Blocks' `minor` opens as `natural-minor`) | `major` |
| `layout` | `flex` · `chromatic` | `flex` |
| `octaves` | 1–4 | 1 |
| `sound` | an `Audio.PRESETS` id | `piano` |
| `colors` | `always` (Rainbow keys) · `played` · `off` | `always` |
| `names` | `none` · `scale` · `white` · `black` · `all` | `none` |
| `focus` | `true` · `false` | `false` |
| `view` | `piano` · `keys` | `piano` |
| `room` | 0–1, the reverb ("Room" in Settings) | 0.35 |

Volume is the listener's own and never travels. `normalizeLayout()` fills
anything missing or unknown with the default, so every link opens.

**On the wire** it is an EVM envelope *without an id* (nothing is saved, so
there is nothing to identify — README §4):

```json
{ "format": "evm-item", "formatVersion": 1, "app": "virtual-keyboard",
  "kind": "layout", "title": "C Blues",
  "data": { "key": "C", "scale": "blues", "layout": "chromatic", "octaves": 2,
            "sound": "organ", "colors": "always", "names": "scale",
            "focus": true, "view": "keys" } }
```

A link is `?layout=` + that envelope as base64url JSON (Key Blocks'
`encodeLayout`). `readLayout()` accepts an envelope, an `evm-bundle` holding
one, or a bare layout, and turns away other apps' items.

## Phase two — what to build

### 1. Join the family rules
- Copy `EVM Library/evm-library.js` to `virtual-keyboard/lib/evm-library.js`,
  load it before `script.js`, and add the copy to `check-copies.sh`.
- Add Virtual Keyboard to README §5: slug `virtual-keyboard`, kinds `layout`
  and `scale`, the storage keys below, built-ins = the starters, and "blank":
  a layout is never blank (every one plays); a scale is blank with fewer than
  two notes.

### 2. Storage
- `virtual_keyboard_library_v1` — id map of layouts (starters kept in code,
  `isCustom: false`, never stored or published).
- `virtual_keyboard_scales_v1` — id map of your scales.
- `virtual_keyboard_current_v1` — the working layout, so a reload keeps what
  was on screen (Key Blocks does this). Volume kept separately, per device.

Every item carries the §1 header (`id` from `EVMLibrary.newId('layout')` /
`newId('scale')`, `title`, `createdAt`, `updatedAt` via `stamp`, `isCustom`,
and `received` / `receivedAt` / `derivedFrom` / `book` through `carry`). The
content `key()` is `stableStringify(data)`.

### 3. The Library window
Same family look as Key Blocks and Song Writer 2.0:
- *Now playing* with **Save**, **Save as…**, **Rename**, and the unsaved dot.
- Groups: **Sandbox** (a scale being made) · **Shared with you** (received,
  read-only) · **My layouts** · **My scales** · **Starters**.
- A shared layout is never saved into; its save button reads **Save my copy**
  (`derivedFrom` = the shared id). Delete asks `Delete "X"?`.
- *Send this layout* stays; links carry the id only when the screen matches
  what is saved (`EVMLibrary.shareHeader`).
- *Backup*: **Download my library** (a bundle of my layouts and scales) and
  **Open a backup…** (`EVMLibrary.readItems`).

### 4. Arriving: links and files
`?layout=` links and opened files go through `EVMLibrary.file`, so a page
embedded in a Google Site, which reloads its link on every visit, never piles up
copies. Phase-one links (no id) still open and are matched by content.

### 5. Custom scales — the reason for all of this
The Flex keys, Focus, the in-scale names and the computer-keyboard labels are
all built from a scale's **degree list** (`['1', 'b3', '4', '#4', '5', 'b7']`),
never from tables. So a custom scale drops in wherever
`Theory.SCALE_BY_ID[scaleId]` is read today: `scaleSemitones`,
`getNotesForScale`, `spellMidi`, `normalizeLayout`, `layoutTitle`, and the scale
menu (a **My scales** group on top, as in Key Blocks).

- **Shape:** `{ title, degrees: [...] }` — ascending degree strings, `1` first,
  2 to 12 notes.
- **Spelling:** `Theory.tonicName` looks a scale up by id; custom scales need a
  small helper that runs the same "fewest accidentals, tie → flat" rule on
  their own degrees. (`semisToDegree` and `spellDegree` already take any list.)
- **Making one:** a Scale editor window with twelve degree chips
  (1 ♭2 2 ♭3 3 4 ♯4 5 ♭6 6 ♭7 7) that switch on and off, starting from any
  built-in scale. As in Key Blocks, the first change moves the work into the
  **Sandbox** — a built-in or saved scale is never changed in place — and
  **Save scale…** names it.
- **Sending:** a layout that uses a custom scale carries the scale inside its
  link or file (Key Blocks' `scaleRecord`), and the scale is filed as its own
  `scale` item on arrival.

### 6. Decisions to make before building
1. Keep the working layout on reload, as Key Blocks does? *(Recommended: yes.)*
2. How to make a scale: degree chips, tapping piano keys in an edit mode, or
   both?
3. Should a Virtual Keyboard scale open in Key Blocks, and the other way round?
   Key Blocks' `scale` is a set of blocks, not a degree list, so this needs a
   shared degree-set shape. Decide before either app's scale format settles.
4. Keep the eight starters as they are?
5. Books on the Teacher Library shelf (`evm-shelf.js`) for Virtual Keyboard
   layouts, and a Virtual Keyboard source in the Librarian — now or later?

### 7. How to check it
The same way the other apps were checked: a link opened twice gives one item;
a received layout is read-only and *Save my copy* makes one of your own; a
newer copy from the teacher (same id) replaces the shared one and leaves your
copies alone; a backup round-trips; phase-one links still open; and the
scale sweeps (every key × scale × Flex/Chromatic × Focus × octaves) pass for
custom scales as well as built-in ones.

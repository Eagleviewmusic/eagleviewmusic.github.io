# Digital Accordion (formerly Key Blocks)

A dynamic instrument that plays chords and melodies together in any key. It grows out
of Melody Tower and Chord Tower: one tower of notes, one tower of chords, both in the
same key, both playable from one computer keyboard — but every block can now be
resized, re-pitched, re-keyed, removed or added to, and the whole thing can be viewed
three ways. Like an accordion, the left hand plays chord buttons and the right hand the
melody, with a pair of bellows between them.

Renamed from Key Blocks on 2026-09-26, and the folder with it (`Key Blocks/` →
`Digital Accordion/`, the same evening). What kept the old name on purpose: the
`localStorage` keys (`key_blocks_*`), the EVM Library app id (`key-blocks`),
`window.KeyBlocks` (now also `window.DigitalAccordion`) and share links — so saved
layouts, scales and old links all still open. Backups now download as
`digital-accordion-layouts.json` with `app: 'Digital Accordion'`; old Key Blocks
backups still import.

## The look

The Accordion style, and only that (2026-09-27): a classic Italian piano accordion — red
marbled celluloid, a brass mesh grille in a chrome frame, pearloid buttons in the note colours,
ivory switches and register tabs, raised capitals (Cinzel) and Fraunces text; details below.
The 1970s lab look the app was redesigned into on 2026-09-26 (the "Digital" style: Michroma and
Saira, walnut cheeks, lamp buttons, LED readouts, an Edit button) was retired on 2026-09-27 at
the user's request: Settings → Style is gone, `html[data-style="accordion"]` is always set, and
the old rules remain in `style.css` only as the base layer under the `[data-style="accordion"]`
section at its end. The wordmark still reads Digital Accordion — that is the instrument's name.

## The look, in detail

A classic Italian piano accordion (red celluloid, after the Titano look). One palette whatever
the system's light/dark setting.

- **Red marbled celluloid** for the case and top bar: `assets/marble.svg`, a 600px SVG
  whose stitched noise is tiled before it is swirled, so it repeats without seams.
- **Brass mesh grille** inside each panel (CSS dots), in a **chrome frame** with rivets.
- **Pearloid note buttons**: the note colours, with `assets/pearl.svg` (a grey swirl)
  laid over them with `soft-light`, a gloss and a chrome ring. Chord tones become round
  bass buttons. Legends follow the same dark/cream rule.
- **No lamps.** Tower/Panels/Keys, the toggles (♪ notes, 8va) and the Z X C V B tabs are
  ivory tabs; one that is on is *pushed in*, the way a register tab is. (Until 2026-09-26
  they carried a red circle that lit — the user did not want red lights.) The Z X C V B
  key letters sit on little chrome plates.
- **The Tower view is called Buttons (2026-09-27).** The view switch reads Buttons / Panels /
  Keys (the view id stays `tower`).
- **Round buttons in the Buttons view (2026-09-27).** Every note and chord is a round pearloid
  button in a chrome ring, placed by the standard board or a designed one (see "The standard
  board" and "Designed boards" below); a side those cannot place is *packed*, not put in cells:
  `pack.js` (`window.packRound`) turns each tower row into a straight line of equal buttons and
  drops each row into the dimples of the rows below, so rows nest half a button apart and the
  buttons line up on diagonals, like a Stradella bass or a garmon. It searches, and keeps the
  arrangement with the biggest regular button (small preferences for tidy patterns):
  - flat rows for normal boxes; every row tilted the same (20–80°, never downhill) for narrow
    ones — 30° gives the garmon's vertical columns (iPad portrait);
  - a honeycomb for the chords in wide boxes (a row's buttons spread so the next row drops into
    the gaps: V/vi IV/IV V/V sit diagonally over vi IV V);
  - paired lines for the melody in wide boxes (Ti Do Re Mi | Fa So La on one line). Chord rows
    mirror the keyboard rows and never share a line;
  - a long row folds into a two-line zig-zag when width binds.
  Big blocks (I, Do) stay bigger (at least ~1.3× a regular face) but give way first; the 0.6 Mi
  and the skinny Ti join the regular family. Stacks climb at least half a button per step. The
  Z X C V B tabs go down the side or along the bottom — whichever leaves bigger buttons — then
  grow into the leftover space and are centred with the buttons. Positions depend only on the
  rows, sizes, the space and the tab count — never on label text, so holding a modifier (IV →
  IV⁷) never moves a button. `fitRoundSide()` passes the last arrangement back in (`prev`): a
  resize keeps it while it is within 3% of the best, so the board doesn't jump; the other side's
  slant is matched when it costs little (`partner`). Typical cost 0.2 ms per side, 1.4 ms worst
  in a live resize.
  The button element *is* the circle (absolute left/top, `--d`), so presses and glides only count
  inside it. Labels (`fitRoundLabel`): the biggest Fraunces size whose lines fit the circle at
  their own height (measured at the real size — Fraunces changes shape with size), above the key
  letter (bottom centre) and below the octave mark (top centre). Long names break into two tight
  lines (0.78 pitch) when that is bigger: before a slash (vii°7 / /V), root over quality (F♯ / °7).
  On faces under ~72 px the key letter and the octave mark slide out onto the chrome rim, a
  little at a time, so a bigger button never gets smaller text. ♪ notes sit in a row across the
  top (faces ≥ 58 px). Panels and Keys views keep their rectangles.
  How it was chosen: four packers (hex lattice, gravity nesting, garmon templates, an optimiser)
  were built against a harness of the real towers at nine screen sizes and judged for size, look
  and robustness; the garmon one won and took the others' best ideas. **That harness is kept in
  `../Digital Accordion Packing Lab/`** (a dev tool beside this folder, not part of the app — don't
  promote it): run its metrics and tests after any change to `pack.js` or to `fitRoundLabel()`,
  whose label rule its `harness.js` mirrors. Against the old circles-in-
  cells (measured over 414 cases): regular buttons about +35% on desktop and iPad, +40–85% on
  phones; label fonts about +37%, and no button runs off the edge on a phone held sideways.
- **A lock switch on each side** replaces the Edit button: a vertical slide switch in a
  chrome plate on the outer edge of each side's header — up locked (play), down unlocked
  (edit). Each side unlocks on its own (`editSides` in script.js); an unlocked side's blocks
  open the editor and do not play from the keyboard, while the other side plays on. Keys
  view has one switch (top left) for both hands.
- **Registers: the sound, from the main page.** Each side's header has a marbled register
  plate showing its sound; it opens a drawer of ivory register tabs under chrome name plates,
  in three rails — Struck & plucked, Held, Pure waves — with a Volume slider and Close
  (Escape closes it too). Tapping a tab plays a preview; the keyboard still plays while the
  drawer is open. Each tab carries an accordion register mark: a circle in three bands
  (high, middle, low reeds) with a dot per reed (`REG_REEDS` — organ is low + high and
  strings two middles, as on a real accordion); the pure waves draw their wave. The same
  sounds are still in Settings.
- **Raised ivory capitals** (Cinzel) for the wordmark and headings; Fraunces for
  labels and text (`labelWidth()` measures with it). The key is a round pearloid button in
  the tonic's colour; the scale an ivory plaque. Sheets are cream celluloid under a marbled head.
- Narrow sides (a container query on `.side`) hide the side title under 560px and tighten
  the controls under 300px; short screens get a slimmer header and a compact drawer.

Everything lives at the end of `style.css` under `[data-style="accordion"]`, which now always
applies.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | The page: one-row top bar (logo · key · scale · views · Library Settings), stage, and the sheets (library, settings, block editor, add-chord, key binding, key picker, name). |
| `style.css` | The look (above). Dark by default, light when the system asks. |
| `icon.svg`, `icon-180.png` | Favicon and home-screen icon. |
| `theory.js` | Scales, spelling, chord qualities, roman numerals and voicings — all derived from degrees, no per-key tables. |
| `audio.js` | The synth: 13 voices, one master chain, a synthesized room. `play`/`stop` for keys held now; `schedule` for notes laid on the audio clock ahead of time (added for Song Writer). Copied byte-identical to `virtual-keyboard/audio.js` and `Song Writer 2.0/lib/audio.js` — change it here, then copy. |
| `script.js` | State, layout building, key presets, the three views, playing, editing, library, share links. |
| `standard-board.js` | The standard board: where the Buttons view puts every chord and note by default (designed in Accordion Builder; see "The standard board"). |
| `pack.js` | The fallback packer for the Buttons view (`window.packRound`), for a side the standard board or a designed board cannot place: rows nested on diagonals, tab placement, hysteresis. Pure — no DOM. Tested by `../Digital Accordion Packing Lab/`. |

## The model

A **layout** is the unit of everything: one JSON object holding the key, the scale, the
view, the sounds, the naming, the keyboard preset and two **sides** (`chords`, `melody`).
Each side is a list of **rows** (bottom row first) of **block ids**, plus the blocks.

- A melody block is a degree relative to the major scale (`'1'`, `'b3'`, `'#4'`…), an
  octave offset, a height weight (`size`), a width weight (`w`), its keys and an
  optional label. A row member that is an array is a vertical stack (2 under 3).
- A chord block is a root degree, a quality (`maj`, `min`, `dom7`, `m7b5`…), a register
  offset, a size, its keys and an optional label (the presets use Chord Tower's labels:
  `V/V`, `IV/IV`, `vi°7`).

Because pitches are degrees, a layout transposes to any key and re-spells itself.
Out-of-scale blocks are drawn striped so borrowed chords (V/V, ♭II…) stay honest.

Three views draw the same blocks:

- **Buttons** — round buttons where the standard board puts them (`standard-board.js`, designed
  in Accordion Builder), or where a layout's own board puts them; `pack.js` packs a side the
  boards cannot place. See "The standard board" and "Designed boards" below.
- **Panels** — the blocks stretched to fill the side, for thumbs on a phone: rows share the
  height evenly, and a block's width weight still counts. The chord side takes one shape in
  every scale and key (`panelChordRows`): F (3/4 wide) beside G at the bottom, then A S D, then
  Q W E R, then 1 2 3 4 5 — each chord in the place of the key it answers to; chords outside
  the set leave, and chords the preset does not know get a row of their own at the top. The
  melody side has three layouts (the button on its header, or Settings → Layout → Panels:
  notes): the **Grid**, a solid 4-wide grid, bottom to top 4̣5̣6̣7̣ / 1234 / 567 1′ / 2′3′4′5′ in
  any scale, whose cells reuse the tower's blocks where the pitch exists (keys, highlight and
  chord bending carry over) and fill in notes where it does not; or **Design A** and
  **Design B**, the two tower designs (below), stretched.
- **Keys** — the blocks laid over a QWERTY keyboard, coloured by their bindings. Unlock to
  choose what a key plays.

A layout's rows still exist (they are what `pack.js` packs when it must, and what Design A / B
draw), but every view now places a block by what it is, so the block editor's move pad and
Stack went with the Digital tower (2026-09-27).

## Scales and their chord hierarchies

`theory.js` lists every scale with its chords in order of importance (the first nine fill
the default tower, keys F D S A G R E Q W), a `top` row of five for the number keys
1–5 (from the Chord Layers hand-off of 2026-09-21; in major ♭VI iv vii°7/V V/iii V/ii), and a
**More chords** bank. Six qualities were added for the number row: 6/9, 9sus4, 7♯9, 7♭9,
9♯5 and 13♭9; five- and six-note chords voice root-in-the-bass with the rest close above
(the fifth dropped when there are six). The ten scales that existed
in Chord Tower carry its exact nine chords and labels. The new ones:

| Scale | Chords, most important first |
| --- | --- |
| Major Pentatonic | I V IV vi ii Isus2 Vsus4 iii ♭VII |
| Minor Pentatonic | i iv ♭VII ♭III ♭VI v IV i7 V |
| Blues | I7 IV7 V7 ♭III ♭VII iv ♭VI iiø7 ♭v°7 |
| Whole Tone | I+ II+ III+ ♯IV+ ♯V+ ♭VII+ I7♯5 II7♯5 I7♭5 |
| Octatonic (half–whole) | I7 ♭III7 VI7 ♯IV7 i°7 ♭ii°7 I ♭III VI |
| Octatonic (whole–half) | i°7 ii°7 iv IV ii II ♭VI ♭vi VII |
| Double Harmonic | I ♭II iv iii ♭VI+ Imaj7 ♭IImaj7 ♭II7 iv(maj7) |
| Hungarian Minor | i V ♭VI ♭III+ vii i(maj7) ♭VImaj7 ♭VI7 |
| Phrygian Dominant | I ♭II iv ♭vii ♭VI+ I7 ♭IImaj7 ♭vii° ♭VI |

Tonic spelling: fewest accidentals wins, a tie goes to the flat, and the minor family
keeps its conventional names (C♯ minor, G♯ minor). This reproduces every enharmonic
choice Melody Tower made; the two differences from Chord Tower's tables were errors in
those tables (D♭ Locrian's fourth, E♭ Harmonic Minor's leading tone).

## Chord modifiers (Z X C V B)

Five held modifiers change whatever chord is pressed, the same way in every scale:
**Z** sus2, **X** add9, **C** sus4, **V** ♭7, **B** maj7; **V + B** adds a 6th instead
(the °7 on a diminished triad). Combinations apply 7th → sus → 9th, so C + V is 7sus4 and
V + X is a 9th chord. They live on the keyboard, in the tabs by the chord tower — a
column beside it in Extreme, a row along its bottom in the smaller chord sets — (hold
with one finger, tap chords with another) and as dashed caps in the Keys view.
While held, every chord block relabels live, sounding chords re-voice, and the melody
bends to the modified chord. In the block editor the same five are toggles that stick to
that chord permanently; held modifiers stack on top. The transform itself is the
hand-off's own engine, `lib/keyblocks-layers.js`, and `theory.js` spells, names and
voices the result; all 2,660 fixture cases in `keyblocks-layout-C.json` match.

## Choosing what Z X C V B do (2026-09-26)

The five chord buttons stay on Z X C V B, but each holds a function of the layout's
choosing (`layout.modSlots`, saved and shared; default sus2 add9 sus4 ♭7 maj7). In Edit mode
tap a button (beside the tower, or its cap in the Keys view) — or Settings → *Choose what
Z X C V B do…* — to open **Chord buttons**: pick a slot, then its function, or leave it
empty (an empty slot has no button outside Edit mode). The pool (`MOD_FUNCS` in
`script.js`):

- **sus2 add9 sus4 ♭7 maj7** — the hand-off's engine, by its letters, as before
  (♭7 + maj7 still gives a 6th).
- **6, 6/4** — first and second inversion; **6/5, 4/3, 4/2** — first, second and third
  inversion of a 7th chord. These three add the scale's own 7th above the root
  (`withSeventh`: V → V7, I → Imaj7, ii → ii7, vii° → viiø7; a ♭7 where the scale has
  neither) unless the chord has one. With a 7th already there, 6 and 6/4 read as 6/5 and 4/3.

Voicing (`chordVoicing`): the bass tone at the bottom, no higher than B3, the other chord
tones close above it, the bass doubled on top when that leaves three notes — I⁶ = E G C E,
I⁶₄ = G C E G, V⁶₅ = B D F G, V⁴₃ = D F G B, V⁴₂ = F G B D. Names: figured bass on the
numeral, before any slash (V⁶₅/V, vii°⁴₃/V), stacked on the page by `setLabel`; letter
names become slash chords (G7/B, D7/F♯). The block editor's *Modify* chips offer the whole
pool, one inversion at a time. Chord blocks' permanent `mods` are now function ids;
layouts saved with the old letters (`['Z', 'B']`) open as sus2 and maj7. `theory.js` is
unchanged (it is copied into other apps).

## The chord shape, and the keys

Fourteen chords, each with its own key in the split preset, by rank of importance: **F** the
tonic chord (I), **D S A** ranks 2–4 (V IV vi), **G R** ranks 5–6 (ii iii), **E Q W** ranks 7–9
(V/V V/vi IV/IV), and **1 2 3 4 5** the five of the number row (♭VI iv vii°7/V V/iii V/ii) — so
the same finger holds the same relationship in every scale (`CHORD_ROLE`: `scale.chords[i]` →
its key; `top[i]` → the number i + 1; `chordRole()`). The Panels view shows them as F (3/4 wide)
beside G; A S D; Q W E R; 1 2 3 4 5, and `buildChordSide` builds new layouts' rows in that shape.
All 14 chords per scale come from the Chord Layers hand-off (`keyblocks-layout-C.json`).

**Changed 2026-09-27 (user's requests):** the shape used to be F | G/R stacked, A S D, Q W E,
2 4, 1 3 5, and keys followed the rows' reading order (`CHORD_HANDS`); earlier that day rank 5
had moved from T to G and the number row from 4 5 / 1 2 3 to 2 4 / 1 3 5 (`upgradeLayout`,
layouts `v` < 3). Since v4 a key follows the chord itself (`applyKeyPreset` by role;
`panelChordRows` and the standard board by role too), so old rows need no upgrading; a chord the
preset does not know (an added one) gets the spare key T (Y on the right hand).

## Chord sets: Core, Full, Extended, Extreme

The button beside **♪ notes** on the chord side (and Settings → Layout → Chord set)
chooses how much of the chord tower is out, the way **Design** switches the melody tower:

| Set | Chords (split preset keys) | In major |
| --- | --- | --- |
| Core | F D S A | I V IV vi |
| Full | + G R | + ii iii |
| Extended | + E Q W | + V/V V/vi IV/IV |
| Extreme | + 1 2 3 4 5, T, and anything added | everything |

A chord belongs to a set by the key it answers to — its own keys, with the right-hand
keys of the mirrored and both-hands presets read through `CHORD_HANDS` as the same places
(J K L ; = F D S A). A chord with no chord key (melody on both hands, a fresh duplicate)
goes by its spot in the tower. Chords outside the set leave the tower, the Keys view and
the computer keyboard alike (`chordRowsInSet()`, `playable(k)`); the editor's key maps
still show every binding. Below Extreme the Z X C V B tabs lie in a row along the bottom
of the chord side (in keyboard order, lined up under the tower); in Extreme they are the
column beside it. `layout.chordSet` is saved and shared; layouts without it open in
Extreme, as before. Adding or duplicating a chord that would be hidden opens up to Extreme.

## The Panels layouts for the notes

`layout.melodyDesign` is `'grid'`, `'A'` or `'B'` (`MELODY_DESIGNS`), chosen with the button on
the melody header in Panels view or in Settings → Layout → Panels: notes. All three hold the same
eighteen notes (Mi an octave down to La an octave up), so the Buttons view — the standard board —
does not change with it.

- **Grid** (the default, and what layouts saved before v4 open on): the solid 4-wide grid
  described above, drawn from pitch, with fill-in notes where the tower has none.
- **Design A**, bottom to top for a seven-note scale: a long short 3̣ (key n); 4̣ 5̣ 6̣; a tall row of
  skinny 7̣, big 1 and a 2/3 stack; 4 5 6; the same tall row an octave up; 4′ 5′ 6′ on 9 0 -.
  Tall-row widths are 0.55 / 1.45 / 1 so the 2/3 stack lines up under the 6 above it.
- **Design B**: 3̣ 4̣ 5̣ 6̣ 7̣ across the bottom (n m , . /); a big 1 beside a 2·3·4 stack;
  a 5·6·7 stack beside a big 1′; then 2′ 3′ 4′ 5′ 6′ on 7 8 9 0 -.

Choosing Design A or B rebuilds the melody blocks from the scale in that shape (as the Digital
tower's Design button did); the Grid keeps the blocks as they are. Until 2026-09-27 A and B were
the Digital style's Tower view and the Grid was the only Panels layout.

## The Sandbox and My scales

Picking a built-in scale always rebuilds both sides from that scale's presets. The
first edit to any scale's blocks (pitch, chord, move, size, add, remove) moves the
work into the **Sandbox**: the scale menu shows "Sandbox · from Major", the base scale
still drives spelling and the chord bank, and the Sandbox is kept in `localStorage`
(`key_blocks_sandbox_v1`) so you can leave and come back. There is one Sandbox; starting
to edit another scale replaces it (a toast says so). **Save scale…** in the Library
names it and files it under **My scales** (`key_blocks_scales_v1`), available in every
key from the scale menu and the Library, included in backups, and embedded in share
links. `layout.scale` is a built-in id, `'sandbox'` or `'custom:<id>'`; `scaleBase`
records the built-in scale underneath.

## Notes inside chords

Optional (the **♪ notes** button on the chord side, or Settings): each chord block
shows a column of small note squares on its inner left, root at the bottom, coloured
by letter. With chord names they show letters (C E G); with roman numerals they show
scale degrees (1 3 5, or 5 7 2 for V, ♭2 4 ♭6 for Phrygian's ♭II). A tone that belongs
to the scale takes the scale's own spelling, so the names always agree with the
melody blocks; a tone outside the scale is spelled by its interval from the root.
`chordTones()` in `theory.js` was checked across all 19 scales and 12 keys.

## Chords bend the scale

On by default (Settings → Layout): while a chord is held, each of its notes that lies
outside the scale takes over the melody block on the same letter, in sound and in
name — IV/IV in C major turns Ti (B) into Te (B♭, ♭7) for as long as the chord
sounds, with a white ring on the bent block. Matching by letter keeps pentatonic and
symmetric scales honest: a scale with no B has nothing to bend when a B♭ is played.
Blocks relabel in place so the pointer holding the chord is never dropped.

## Keyboard presets

- **Split** (default): chords on the left hand by what each chord is — `f d s a g r e q w` for
  the scale's nine (in major, I V IV vi ii iii V/V V/vi IV/IV), the number row `1 2 3 4 5` for
  its five extra chords (`top` in `theory.js`, from the Chord Layers hand-off) and `t` for a
  chord the preset does not know; melody on the right hand by scale degree from `j`: `n m , . /`
  are 3 4 5 6 7 below the tonic, `k l ; u i o p 7 8 9 0 -` climb above it.
- **Split, mirrored**: the same, hands swapped (`RIGHT_OF`: F↔J, G↔H, R↔U, A↔;, S↔L, D↔K, Q↔P,
  W↔O, E↔I, 1↔0, 2↔9, 3↔8, 4↔7, 5↔6, T↔Y).
- **Melody on both hands** / **Chords on both hands**: the original single-app layouts.
- **Custom**: whatever was bound in Edit mode. Binding any key switches to Custom.

The 8va button sits in the melody header (Shift / Caps Lock hold it). The ♭ ♯ controls were
removed on 2026-09-21. `Shift` / `Caps Lock` lift the melody an octave; with melody on both hands
the left hand stays low, as in Melody Tower.

**Show key bindings** (Settings → Layout) turns the key letters on the buttons and panels on or
off (`layout.showKeys`, `.stage.hide-keys`). The Z X C V B tabs lose their letters too
(`.mod-key`). The Keys view always shows them, and phone widths hide the block letters anyway.

## Touch screens and smart boards (tested 2026-09-27)

A headless-Chrome test with real touch events (no mouse) ran every check at 1080p and
4K smart-board sizes, iPad landscape/portrait and a phone, in both styles: 10 fingers at
once, chord + melody together, sliding between notes, holding a Z X C V B tab while
playing, long press (no menu, no text selection), no zoom from double tap or pinch, no
page scrolling, Settings → Show key bindings by touch (sheet scrolled by finger), Panels
and Keys views, and Edit by touch. Two fixes came out of it:

- **The first touch was silent.** On a touch screen a finger going *down* is not a user
  activation (only lifting it is), so the browser keeps Web Audio asleep through the
  first press. `start()` now wakes the audio on the first lift (`wake`, pointerup/touchend,
  touch only) and plays that first press as a short note as the finger lifts; every press
  after that sounds on the press.
- **Pinching the top bar zoomed the page 3×** (a smart board's desktop browser ignores
  `user-scalable=no`). `html { touch-action: pan-x pan-y }` stops pinch and double-tap
  zoom everywhere; sheets still scroll, the stage stays `touch-action: none`.

Not covered: Safari/iPadOS (the test drives Chrome; Edge and most boards' browsers are
Chromium). Smallest targets: the key arrows (26×34 px) and lock switches (22×52); on a
4K board left at 100% scaling the top bar is small (use 150–200% display scaling).

## Saving

- **Share link**: `?layout=<base64url JSON>` carries the whole layout. Opening one adds
  a copy to the library, as Ostinato Builder does. `?key=Eb&scale=phrygian&timbre=…`
  still works as a quick link.
- **Library**: `localStorage` key `key_blocks_library_v1`, starters plus the user's own,
  with JSON backup export/import. The working layout autosaves to
  `key_blocks_current_v1`.

## The standard board (2026-09-27)

In the Buttons view the round buttons no longer come from the packer by default: they go where
**`standard-board.js`** puts them — a board designed by hand in Accordion Builder ("Accordion
Layout 4", the user's, for the space each side gets on a 1440 × 900 laptop) and scaled to fit any
screen by `placeBoard()`, rings kept. To make a new one the default: export it from the builder
and run `node "../Digital Accordion Packing Lab/standard-from-file.mjs" <that file>`, which
rewrites this file and the builder's copy. A chord finds its place by which of the preset's fourteen it
is (`standardBoardFor()`: `scale.chords[i]` → the key it sits on, F D S A G R E Q W; `top[i]` → 1–5),
so every scale's own fourteen chords take the same fourteen places in every key; a note finds its
by scale step and octave, so Design A and Design B land on the same board (the Design button is
hidden in the Accordion style; it still shapes the Digital tower). **A chord set below Extreme
just leaves its places empty** — the shape stays. The Z X C V B tabs lie along the bottom. The
packer (`pack.js`) is now the fallback: a side with a block the standard does not know — an added
or duplicated chord, a note off the seven steps, an eight-note scale — is packed as before, and so
is anything the Packing Lab still measures. `standard-board.js` is copied byte-identical into
`../Accordion Builder/` (its Standard presets): change it here, then copy.

## Designed boards (from Accordion Builder, 2026-09-27)

`../Accordion Builder/` is a drawing board for the round buttons — a board of chords and a
board of notes, as the two sides here: how many, how big, exactly where, which chord or note
and which key. It exports an ordinary layout (C major, keys kept with `keyPreset: 'custom'`,
`show` as designed) whose sides carry one extra field each:

```js
chords.board = { w, h,                          // the area it was designed in, px (the side's space minus the tab strip)
                 tabs: 'bottom' | 'side' | 'none',
                 buttons: { c1: { cx, cy, d }, … } }   // each block's centre and face in that area
melody.board = { … }                            // the same, tabs 'none'; a side left empty there arrives as this app's own tower, without a board
```

It arrives as a share link (`?layout=…`, which also switches this device to the Accordion
style, since the board is meant for the round buttons) or as a backup file (Library → Share &
backup → Open a backup…). `normalizeLayout` validates it (numbers only, circles only for
blocks that exist) and drops it if it is unusable; the library card says "designed board".

In the Buttons view a side with a board (either side) is placed by `placeBoard()` instead of `pack.js`
(`fitRoundSide` checks that every block in the rows has a circle): the area is scaled to fit
the side's body as a whole and centred, so the design keeps its proportions on every screen
(the 4 px rings and the 2 px air between them keep their pixels, so faces scale a little more
than centres do and buttons that touched still touch, never overlap), and the tabs take the strip the board reserved (bottom or side; at least 40 px, growing into
the slack up to 52 / 60 px, as the packer's do; `'none'` means the five slots are empty).
Panels and Keys views use the rows as usual (the builder derives them from the positions).

Editing a side that has a board: **moving a block to another row, adding a block or duplicating
one releases the board** (`releaseBoard()`, with a toast) and the packer takes over; removing
a block only removes its circle; rebuilding a side replaces it. Nothing else changed, and
`pack.js` is untouched, so the Packing Lab's numbers still stand.

## Preview

`.claude/launch.json` has a `digital-accordion` entry (port 8796, as before, so layouts
saved at `localhost:8796` are still there) serving this folder with `.claude/serve.js`.

# Vendored libraries — not the authoritative copies

| File here | Authoritative copy | Used for |
| --- | --- | --- |
| `keyblocks-layers.js` | `Claude Apps/Digital Accordion/lib/keyblocks-layers.js` | the chord-modifier engine (Z X C V B: sus2 add9 sus4 ♭7 maj7, chord-symbol suffixes) that `theory.js` calls; loaded before it (2026-09-27) |
| `theory.js` | `Claude Apps/Digital Accordion/theory.js` | scales, degrees, spelling, chord qualities, names, voicings — everything `js/chords.js` builds the chord panel from |
| `audio.js` | `Claude Apps/virtual-keyboard/audio.js` (since 2026-11-18; before that Digital Accordion's, which it still is plus one voice) | every sound: the 13 voices, the two sides' levels, Room (reverb); `schedule()` lays notes on the audio clock for the player (added 2026-09-26 in Key Blocks for Song Writer); the `'sample'` voice — the recorded instruments |
| `samples.js` | `Claude Apps/virtual-keyboard/samples.js` (also copied to `Recording Studio/lib/samples.js`) | the Virtual Keyboard's recorded instruments (2026-11-18): adds them to the sounds and loads their notes when wanted. The notes are NOT copied here: index.html loads `../virtual-keyboard/samples/manifest.js`, and the `data-base` on this file's tag points at `../virtual-keyboard/samples/` for the MP3s — so the keyboard's folder must sit beside this one (it does on the site and in the sandbox) |
| `notation/glyphs-leland.js` | `Claude Apps/notation assets/glyphs-leland.js` | the note-value pictures and the staff card (`js/engrave.js`) |

All are byte-identical copies (theory and glyphs taken 2026-09-21, audio
2026-09-26, keyblocks-layers 2026-09-27). Change the authoritative file, then copy it here and `diff` to confirm
(audio.js and samples.js also go to the Recording Studio: `audio.js` there
is the keyboard's plus `restart()`).

Each declares a `const` at the top level of a classic script (`Theory`,
`GLYPHS_LELAND`, `Audio` — which hides the browser's own `Audio`), so they are global bindings but **not** properties of
`window` — test them with `typeof Theory !== 'undefined'`, never `window.Theory`.

`theory.js` looks for `KeyBlocksLayers` (from `keyblocks-layers.js`) when it loads: without it
the Z X C V B functions would do nothing and chord suffixes would fall back to the plain
qualities — keep the two together.

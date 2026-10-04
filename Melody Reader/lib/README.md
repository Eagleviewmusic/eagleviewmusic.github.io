# Vendored libraries — not the authoritative copies

| File here | Authoritative copy | Used for |
| --- | --- | --- |
| `notation/glyphs-leland.js` | `Claude Apps/notation assets/glyphs-leland.js` | every notehead, rest, flag, clef and time-signature digit the engraver (`js/engrave.js`) draws |
| `evm-count-in.js`, `evm-count-in.css` | `Claude Apps/EVM Library/evm-count-in.js` (+ `.css`) | With the beat's count-in: priming the sound, the "Get ready 1 2 3 4" card |
| `evm-library.js` | `Claude Apps/EVM Library/evm-library.js` | the family library rules for My melodies (ids, stamps, the import rule, envelopes) |
| `evm-shelf.js`, `evm-shelf.css` | `Claude Apps/EVM Library/evm-shelf.js` (+ `.css`) | the Teacher Library shelf in My melodies |

Byte-identical copies, taken 2026-10-03. Change the authoritative file, then
copy it here and `cmp` to confirm. (`EVM Library/check-copies.sh` lists the
apps that carry the count-in; Melody Reader is one of them.)

`glyphs-leland.js` declares `const GLYPHS_LELAND` at the top level of a
classic script, so it is a global binding but **not** a property of
`window` — test it with `typeof GLYPHS_LELAND !== 'undefined'`.

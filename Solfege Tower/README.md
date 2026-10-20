# Solfege Tower

Melody Tower and Chord Tower in one app. The menu (the round button, top left)
picks **Melody**, **Chord** or **Both**; with both up, a **swap** button decides
which tower is on the left. Key and scale are shared by the two towers; each has its own timbre.

Built for embedding: the towers always fit the frame, as large as the frame
allows, and the menu is an overlay that takes no space from them.

## Links

`?tower=both&left=chord&key=G&scale=major&timbre=triangle&chordTimbre=voice`

- `tower` — `melody` (default), `chord`, `both`
- `left` — `melody` or `chord`, the tower on the left when `tower=both`
- `key`, `scale`, `timbre` — as in the Melody Tower / Chord Tower links; the old links still open
- `timbre` is the melody's sound, `chordTimbre` the chords' (sine, triangle, square, sawtooth, voice)

## Computer keys

- One tower up: that tower's own keys, both hands (as in its original app).
- Both up: the **left half** of the keyboard (`1`–`5`, `q`–`t`, `a`–`g`, `z`–`b`)
  plays the left tower, the **right half** plays the right tower.
- `=` / `-` (and `↑` / `↓`): sharp / flat. With both towers up they act on the melody.
- `Shift` or `Option/Alt` with a chord key: sharp / flat chord.
- `Shift` or `Caps Lock`: the melody's right hand plays an octave higher (as before).
- Chord Tower's old `c` (names) and `m` (menu) hotkeys are gone: `c` and `m` are melody notes.

## Files

`js/data-melody.js` and `js/data-chords.js` are the two apps' theory tables, copied as
they were. `js/audio.js` is one AudioContext with each tower's own voice and output chain.
`js/tower.js` is the shared grid (the pair's 4×11 cell map, each tower showing only its rows: melody 1–9, chord 2–8, one cell size for both); `js/melody-tower.js` and `js/chord-tower.js` fill it;
`js/app.js` is the shell (menu, key routing, layout, links).

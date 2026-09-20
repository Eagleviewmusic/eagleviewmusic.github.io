# Vendored: Virtual Instruments

A copy of the shared percussion engine, so the Music Stand has its own sound
library and does not have to borrow one from a frame.

* Authoritative copy: `Virtual Instrument Assets/js/virtual-instruments.js`
* Other copies: `Ostinato Builder 2.0/lib/instruments/`, `Rhythm Poetry 2.0/lib/instruments/`
  (`virtual-drum-kit/index.html` holds an older, deliberately divergent one —
  never sync from it.)

Change the authoritative copy first, then `cp` it over every vendored copy and
`diff` to confirm.

`instrument-icons.js` holds 200x200 data URIs for the artwork, so the Music
Stand's picker needs no image files. The 1024x1024 PNGs stay in
`Virtual Instrument Assets/images/`.

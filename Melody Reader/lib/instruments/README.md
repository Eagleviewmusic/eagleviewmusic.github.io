# Vendored: Virtual Instruments

A copy of the shared percussion engine, so Melody Reader's drum beat (2026-10-13 — the
metronome's Drum beat, `js/drums.js`) plays the same kit Ostinato Builder plays.

* Authoritative copy: `Virtual Instrument Assets/js/virtual-instruments.js`
* Other copies: `Ostinato Builder 2.0/lib/instruments/`, `Music Stand/lib/instruments/`,
  `Rhythm Poetry 2.0/lib/instruments/`
  (`virtual-drum-kit/index.html` holds an older, deliberately divergent one —
  never sync from it.)

Change the authoritative copy first, then `cp` it over every vendored copy and
`diff` to confirm.

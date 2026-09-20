# Vendored: Virtual Instruments

A copy of the shared percussion engine, so Rhythm Poetry can sound its rhythm on real percussion
voices rather than a homemade bass drum.

* Authoritative copy: `Virtual Instrument Assets/js/virtual-instruments.js`
* Other copies: `Ostinato Builder 2.0/lib/instruments/`, `Music Stand/lib/instruments/`
  (`virtual-drum-kit/index.html` holds an older, deliberately divergent one —
  never sync from it.)

Change the authoritative copy first, then `cp` it over every vendored copy and
`diff` to confirm.


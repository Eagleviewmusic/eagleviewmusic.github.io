/* ==========================================================================
   Melody Reader — songbook.js
   --------------------------------------------------------------------------
   RR.SONGS — traditional songs, written in C between C4 and E5, each cut
   into one- or two-bar cards (Melody Reader Design/LEVELS.md §4).
   A note is its bar and its length in sixteenths: E4:4 is a quarter E,
   C4:8 a half C, E4:6 D4:2 is ta-i ti; r is a rest; | is a bar line.
   ========================================================================== */
(function () {
  'use strict';
  window.RR.SONGS = {
    'hot-cross-buns': { title: 'Hot Cross Buns', cards: ['E4:4 D4:4 C4:8', 'E4:4 D4:4 C4:8', 'C4:2 C4:2 C4:2 C4:2 D4:2 D4:2 D4:2 D4:2', 'E4:4 D4:4 C4:8'] },
    'mary': { title: 'Mary Had a Little Lamb', cards: ['E4:4 D4:4 C4:4 D4:4 | E4:4 E4:4 E4:8', 'D4:4 D4:4 D4:8 | E4:4 G4:4 G4:8', 'E4:4 D4:4 C4:4 D4:4 | E4:4 E4:4 E4:4 E4:4', 'D4:4 D4:4 E4:4 D4:4 | C4:16'] },
    'rain': { title: 'Rain, Rain, Go Away', cards: ['G4:4 E4:4 G4:2 G4:2 E4:4', 'G4:2 G4:2 E4:2 E4:2 G4:2 G4:2 E4:4'] },
    'au-clair': { title: 'Au Clair de la Lune', cards: ['C4:4 C4:4 C4:4 D4:4 | E4:8 D4:8', 'C4:4 E4:4 D4:4 D4:4 | C4:16'] },
    'frere': { title: 'Frère Jacques', cards: ['C4:4 D4:4 E4:4 C4:4 | C4:4 D4:4 E4:4 C4:4', 'E4:4 F4:4 G4:8 | E4:4 F4:4 G4:8'] },
    'jingle': { title: 'Jingle Bells', cards: ['E4:4 E4:4 E4:8 | E4:4 E4:4 E4:8', 'E4:4 G4:4 C4:6 D4:2 | E4:16'] },
    'lightly-row': { title: 'Lightly Row', cards: ['G4:4 E4:4 E4:8 | F4:4 D4:4 D4:8', 'C4:4 D4:4 E4:4 F4:4 | G4:4 G4:4 G4:8', 'G4:4 E4:4 E4:8 | F4:4 D4:4 D4:8', 'C4:4 E4:4 G4:4 G4:4 | C4:16'] },
    'ode': { title: 'Ode to Joy', cards: ['E4:4 E4:4 F4:4 G4:4 | G4:4 F4:4 E4:4 D4:4', 'C4:4 C4:4 D4:4 E4:4 | E4:6 D4:2 D4:8', 'E4:4 E4:4 F4:4 G4:4 | G4:4 F4:4 E4:4 D4:4', 'C4:4 C4:4 D4:4 E4:4 | D4:6 C4:2 C4:8'] },
    'twinkle': { title: 'Twinkle, Twinkle, Little Star', cards: ['C4:4 C4:4 G4:4 G4:4 | A4:4 A4:4 G4:8', 'F4:4 F4:4 E4:4 E4:4 | D4:4 D4:4 C4:8', 'G4:4 G4:4 F4:4 F4:4 | E4:4 E4:4 D4:8'] },
    'london': { title: 'London Bridge', cards: ['G4:6 A4:2 G4:4 F4:4 | E4:4 F4:4 G4:8', 'D4:4 E4:4 F4:8 | E4:4 F4:4 G4:8', 'G4:6 A4:2 G4:4 F4:4 | E4:4 F4:4 G4:8', 'D4:8 G4:8 | E4:4 C4:12'] },
    'saints': { title: 'When the Saints', cards: ['r:4 C4:4 E4:4 F4:4 | G4:16', 'r:4 C4:4 E4:4 F4:4 | G4:8 E4:8', 'C4:8 E4:8 | D4:16'] },
    'old-macdonald': { title: 'Old MacDonald', cards: ['C5:4 C5:4 C5:4 G4:4 | A4:4 A4:4 G4:8', 'E5:4 E5:4 D5:4 D5:4 | C5:16'] }
  };
})();

/* ==================================================================
   EMBEDDED IN THE MUSIC STAND
   ------------------------------------------------------------------
   The Music Stand opens this app in a frame (?embed=music-stand) to
   show and play a poem beside an ostinato. There the app is a guest: it
   may read its library and settings, but nothing it does may write
   them. Opening a song in the Music Stand must not change which song is open
   the next time this app is opened on its own, let alone overwrite one.

   Rather than guard every write (there are a dozen, and the next one
   added would be missed), localStorage itself is swapped for a layer
   that reads through to the real thing and keeps every write in memory.
   It runs before the app, so the app never sees the real object.

   Ostinato Builder 2.0 carries the same block; keep the two in step.
   See `Music Stand/README.md` for the bridge they serve.
   ================================================================== */
(function () {
  let embedded = false;
  try {
    embedded = new URLSearchParams(window.location.search).get('embed') === 'music-stand'
      && window.parent !== window;
  } catch (e) {}
  if (!embedded) return;

  const real = window.localStorage;
  const writes = new Map();             // key -> value, or null once removed
  const layer = {
    getItem(k) {
      k = String(k);
      if (writes.has(k)) return writes.get(k);
      try { return real.getItem(k); } catch (e) { return null; }
    },
    setItem(k, v) { writes.set(String(k), String(v)); },
    removeItem(k) { writes.set(String(k), null); },
    clear() { writes.clear(); },
    key(i) { try { return real.key(i); } catch (e) { return null; } },
    get length() { try { return real.length; } catch (e) { return 0; } }
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: layer, configurable: true });
  } catch (e) {}

  /* If the swap did not take, this is not a safe guest: run as the plain
     app, and the Music Stand will find no bridge and say so. */
  if (window.localStorage !== layer) return;
  window.MUSIC_STAND_EMBED = {
    /* Drop what this frame wrote for a key, so the next read is the real,
       current value — the Music Stand's song picker wants the live library. */
    forget(k) { writes.delete(String(k)); }
  };
})();

(function() {
  // Shared library rules (ids, updatedAt, the import rule): lib/evm-library.js
  const EVM = window.EVMLibrary;
  const container = document.getElementById('poem');
  const EMBEDDED = !!window.MUSIC_STAND_EMBED;

  const DEFAULT_SONGS = {
    'instructions': {
      id: 'instructions',
      title: 'Instructions',
      mode: 'poetry',
      poetryState: {
        words: [
          'Press', 'the', 'lyrics', 'to', 'edit.', 'Spacebar', 'moves', 'foward,', 'backspace', 'moves', 'back.', '-', '-', '-', '-', '-'
        ],
        rawLyrics: [
          'Press', 'the', 'lyrics', 'to', 'edit.', 'Spacebar', 'moves', 'foward,', 'backspace', 'moves', 'back.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      },
      rhythmState: {
        beats: [
          [true, true],
          [true, true],
          [true, true],
          [true, true],
          [true, true],
          [true, false],
          [false, false],
          [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'hickory-dickory-dock': {
      id: 'hickory-dickory-dock',
      title: 'Hickory Dickory Dock',
      mode: 'poetry',
      poetryState: {
        words: [
          'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock,', '-', '-', '-', '-', 'The', 'mouse', '-', 'ran', 'up', '-', 'the', 'clock.', '-', '-', '-', '-', 'The', 'clock', '-', 'struck', 'one,', '-', 'The', 'mouse', '-', 'ran', 'down,', '-', '-', 'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock.', '-', '-', '-', '-', '-'
        ],
        rawLyrics: [
          'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock,', 'The', 'mouse', 'ran', 'up', 'the', 'clock.', 'The', 'clock', 'struck', 'one,', 'The', 'mouse', 'ran', 'down,', 'Hick-', 'o-', 'ry', 'dick-', 'o-', 'ry', 'dock.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 6,
        timeSignatureDenominator: 8
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'humpty-dumpty': {
      id: 'humpty-dumpty',
      title: 'Humpty Dumpty',
      mode: 'poetry',
      poetryState: {
        words: [
          'Hump-', '-', 'ty', 'Dump-', '-', 'ty', 'sat', 'on', 'a', 'wall,', '-', '-', 'Hump-', '-', 'ty', 'Dump-', '-', 'ty', 'had', 'a', 'great', 'fall.', '-', '-', 'All', 'the', "king's", 'hors-', 'es', 'and', 'all', 'the', "king's", 'men', '-', '-', 'Could-', "n't", 'put', 'Hump-', 'ty', 'to-', 'geth-', 'er', 'a-', 'gain.', '-', '-'
        ],
        rawLyrics: [
          'Hump-', 'ty', 'Dump-', 'ty', 'sat', 'on', 'a', 'wall,', 'Hump-', 'ty', 'Dump-', 'ty', 'had', 'a', 'great', 'fall.', 'All', 'the', "king's", 'hors-', 'es', 'and', 'all', 'the', "king's", 'men', 'Could-', "n't", 'put', 'Hump-', 'ty', 'to-', 'geth-', 'er', 'a-', 'gain.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 6,
        timeSignatureDenominator: 8
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'twinkle-twinkle-little-star': {
      id: 'twinkle-twinkle-little-star',
      title: 'Twinkle Twinkle Little Star',
      mode: 'poetry',
      poetryState: {
        words: [
          'Twin-', 'kle,', 'twin-', 'kle,', 'lit-', 'tle', 'star,', '-', 'How', 'I', 'won-', 'der', 'what', 'you', 'are!', '-', 'Up', 'a-', 'bove', 'the', 'world', 'so', 'high,', '-', 'Like', 'a', 'dia-', 'mond', 'in', 'the', 'sky.', '-'
        ],
        rawLyrics: [
          'Twin-', 'kle,', 'twin-', 'kle,', 'lit-', 'tle', 'star,', 'How', 'I', 'won-', 'der', 'what', 'you', 'are!', 'Up', 'a-', 'bove', 'the', 'world', 'so', 'high,', 'Like', 'a', 'dia-', 'mond', 'in', 'the', 'sky.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'little-miss-muffet': {
      id: 'little-miss-muffet',
      title: 'Little Miss Muffet',
      mode: 'poetry',
      poetryState: {
        words: [
          'Lit-', 'tle', 'Miss', '-', 'Muf-', 'fet', 'Sat', '-', 'on', 'a', 'tuf-', 'fet,', 'Eat-', 'ing', 'her', '-', 'curds', 'and', 'whey;', '-', '-', 'There', 'came', 'a', 'big', '-', 'spi-', '-', 'der,', 'Who', 'sat', 'down', 'be-', '-', 'side', '-', 'her,', 'And', 'fright-', 'ened', 'Miss', '-', 'Muf-', '-', 'fet', 'a-', 'way.', '-', '-', '-'
        ],
        rawLyrics: [
          'Lit-', 'tle', 'Miss', 'Muf-', 'fet', 'Sat', 'on', 'a', 'tuf-', 'fet,', 'Eat-', 'ing', 'her', 'curds', 'and', 'whey;', 'There', 'came', 'a', 'big', 'spi-', 'der,', 'Who', 'sat', 'down', 'be-', 'side', 'her,', 'And', 'fright-', 'ened', 'Miss', 'Muf-', 'fet', 'a-', 'way.'
        ],
        beatSubdivisions: {
          '0': 4,
          '2': 4,
          '4': 4,
          '8': 4,
          '9': 4,
          '10': 4,
          '11': 4,
          '12': 4,
          '13': 4
        },
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4
      },
      rhythmState: {
        beats: [
          [true, true, true, false], [true, true], [true, false, true, true], [true, true],
          [true, true, true, false], [true, true], [true, false], [false, false],
          [true, true, true, true], [false, true, false, true], [true, true, true, true], [false, true, false, true],
          [true, true, true, true], [false, true, false, true], [true, true], [false, false]
        ],
        beatSubdivisions: {
          '0': 4,
          '2': 4,
          '4': 4,
          '8': 4,
          '9': 4,
          '10': 4,
          '11': 4,
          '12': 4,
          '13': 4
        },
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'row-row-row-your-boat': {
      id: 'row-row-row-your-boat',
      title: 'Row Row Row Your Boat',
      mode: 'poetry',
      poetryState: {
        words: [
          'Row,', '-', '-', 'row,', '-', '-', 'row', '-', 'your', 'boat,', '-', '-', 'Gent-', '-', 'ly', 'down', '-', 'the', 'stream,', '-', '-', '-', '-', '-', 'Mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'Life', '-', 'is', 'but', '-', 'a', 'dream.', '-', '-', '-', '-', '-'
        ],
        rawLyrics: [
          'Row,', 'row,', 'row', 'your', 'boat,', 'Gent-', 'ly', 'down', 'the', 'stream,', 'Mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'mer-', 'ri-', 'ly,', 'Life', 'is', 'but', 'a', 'dream.'
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        syncopation: [],
        syncopationStates: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 6,
        timeSignatureDenominator: 8
      },
      rhythmState: {
        beats: [
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, true], [true, true], [true, true],
          [true, true], [true, false], [false, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'rhythm-ta-and-ti-ti': {
      id: 'rhythm-ta-and-ti-ti',
      title: 'Ta and Ti-Ti',
      side: 'rhythm',
      rhythmState: {
        beats: [
          [true, false], [true, true], [true, false], [true, false],
          [true, true], [true, true], [true, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 88,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'rhythm-quarter-rests': {
      id: 'rhythm-quarter-rests',
      title: 'Meeting the Rest',
      side: 'rhythm',
      rhythmState: {
        beats: [
          [true, false], [true, false], [false, false], [true, false],
          [true, true], [false, false], [true, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 84,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'rhythm-sixteenths': {
      id: 'rhythm-sixteenths',
      title: 'Sixteenth Notes',
      side: 'rhythm',
      rhythmState: {
        beats: [
          [true, true, true, true], [true, false], [true, true, true, true], [true, false],
          [true, true], [true, true, true, true], [true, false], [false, false]
        ],
        beatSubdivisions: { 0: 4, 2: 4, 5: 4 },
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 76,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'rhythm-tied-and-dotted': {
      id: 'rhythm-tied-and-dotted',
      title: 'Tied and Dotted',
      side: 'rhythm',
      rhythmState: {
        beats: [
          [true, false], [false, true], [true, false], [true, false],
          [true, true], [false, true], [true, false], [false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: { 0: true, 4: true },
        hasPickupMeasure: false,
        BPM: 80,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: 'Simplified Kodály'
      }
    },
    'rhythm-six-eight': {
      id: 'rhythm-six-eight',
      title: 'Six-Eight Feel',
      side: 'rhythm',
      rhythmState: {
        beats: [
          [true, true, true], [true, false, false],
          [true, true, true], [true, false, false]
        ],
        beatSubdivisions: {},
        linkedBeats: {},
        hasPickupMeasure: false,
        BPM: 96,
        timeSignatureNumerator: 6,
        timeSignatureDenominator: 8,
        currentRhythmSystem: 'Simplified Kodály'
      }
    }
  };

  const rhythmSystems = {
    "Simplified Kodály": {
      six: { main: ["Ti", "ti", "ti"], filler: ["ki", "ki", "ki"] },
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ti", "ti"], "G/B": ["-", "ti"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ti", "ti", "ti"], "B/B/G": ["Ti", "ti", "-"], "B/G/B": ["Ti", "-", "ti"], "G/B/G": ["-", "ti", "-"], "G/B/B": ["-", "ti", "ti"], "G/G/B": ["-", "-", "ti"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ti", "-", "ti", "-"], "B/B/B/B": ["Ti", "ki", "ti", "ki"], "G/B/B/B": ["-", "ki", "ti", "ki"], "B/B/B/G": ["Ti", "ki", "ti", "-"], "B/B/G/B": ["Ti", "ki", "-", "ki"], "B/G/B/B": ["Ti", "-", "ti", "ki"], "B/B/G/G": ["Ti", "ki", "-", "-"], "G/B/B/G": ["-", "ki", "ti", "-"], "G/G/B/B": ["-", "-", "ti", "ki"], "G/B/G/B": ["-", "ki", "-", "ki"], "B/G/G/B": ["Ti", "-", "-", "ki"], "G/B/G/G": ["-", "ki", "-", "-"], "G/G/B/G": ["-", "-", "ti", "-"], "G/G/G/B": ["-", "-", "-", "ki"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Beat Centered Kodály": {
      six: { main: ["Ti", "da", "di"], filler: ["ri", "ri", "ri"] },
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ti", "ti"], "G/B": ["-", "ti"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ti", "da", "di"], "B/B/G": ["Ti", "da", "-"], "B/G/B": ["Ti", "-", "di"], "G/B/G": ["-", "da", "-"], "G/B/B": ["-", "da", "di"], "G/G/B": ["-", "-", "di"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ti", "-", "ti", "-"], "B/B/B/B": ["Ti", "ri", "ti", "ri"], "G/B/B/B": ["-", "ri", "ti", "ri"], "B/B/B/G": ["Ti", "ri", "ti", "-"], "B/B/G/B": ["Ti", "ri", "-", "ri"], "B/G/B/B": ["Ti", "-", "ti", "ri"], "B/B/G/G": ["Ti", "ri", "-", "-"], "G/B/B/G": ["-", "ri", "ti", "-"], "G/G/B/B": ["-", "-", "ti", "ri"], "G/B/G/B": ["-", "ri", "-", "ri"], "B/G/G/B": ["Ti", "-", "-", "ri"], "G/B/G/G": ["-", "ri", "-", "-"], "G/G/B/G": ["-", "-", "ti", "-"], "G/G/G/B": ["-", "-", "-", "ri"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Gordon System": {
      six: { main: ["Du", "da", "di"], filler: ["ta", "ta", "ta"] },
      "2": { "B/G": ["Du", "-"], "B/B": ["Du", "de"], "G/B": ["-", "de"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Du", "-", "-"], "B/B/B": ["Du", "da", "di"], "B/B/G": ["Du", "da", "-"], "B/G/B": ["Du", "-", "di"], "G/B/G": ["-", "da", "-"], "G/B/B": ["-", "da", "di"], "G/G/B": ["-", "-", "di"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Du", "-", "-", "-"], "B/G/B/G": ["Du", "-", "de", "-"], "B/B/B/B": ["Du", "ta", "de", "ta"], "G/B/B/B": ["-", "ta", "de", "ta"], "B/B/B/G": ["Du", "ta", "de", "-"], "B/B/G/B": ["Du", "ta", "-", "ta"], "B/G/B/B": ["Du", "-", "de", "ta"], "B/B/G/G": ["Du", "ta", "-", "-"], "G/B/B/G": ["-", "ta", "de", "-"], "G/G/B/B": ["-", "-", "de", "ta"], "G/B/G/B": ["-", "ta", "-", "ta"], "B/G/G/B": ["Du", "-", "-", "ta"], "G/B/G/G": ["-", "ta", "-", "-"], "G/G/B/G": ["-", "-", "de", "-"], "G/G/G/B": ["-", "-", "-", "ta"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Takadimi System": {
      six: { main: ["Ta", "ki", "da"], filler: ["va", "di", "ma"] },
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ta", "di"], "G/B": ["-", "di"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ta", "ki", "da"], "B/B/G": ["Ta", "ki", "-"], "B/G/B": ["Ta", "-", "da"], "G/B/G": ["-", "ki", "-"], "G/B/B": ["-", "ki", "da"], "G/G/B": ["-", "-", "da"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ta", "-", "di", "-"], "B/B/B/B": ["Ta", "ka", "di", "mi"], "G/B/B/B": ["-", "ka", "di", "mi"], "B/B/B/G": ["Ta", "ka", "di", "-"], "B/B/G/B": ["Ta", "ka", "-", "mi"], "B/G/B/B": ["Ta", "-", "di", "mi"], "B/B/G/G": ["Ta", "ka", "-", "-"], "G/B/B/G": ["-", "ka", "di", "-"], "G/G/B/B": ["-", "-", "di", "mi"], "G/B/G/B": ["-", "ka", "-", "mi"], "B/G/G/B": ["Ta", "-", "-", "mi"], "G/B/G/G": ["-", "ka", "-", "-"], "G/G/B/G": ["-", "-", "di", "-"], "G/G/G/B": ["-", "-", "-", "mi"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Fruit Rhythms": {
      six: { main: ["Ap", "Cher", "Lem"], filler: ["ple", "ry", "on"] },
      "2": { "B/G": ["Pie", "-"], "B/B": ["Ap", "ple"], "G/B": ["-", "Sweet"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Pie", "-", "-"], "B/B/B": ["Pine", "ap", "ple"], "B/B/G": ["Yo", "gurt", "-"], "B/G/B": ["Le", "-", "mon"], "G/B/G": ["-", "Peas", "-"], "G/B/B": ["-", "Spi", "cy"], "G/G/B": ["-", "-", "Sweet"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Pie", "-", "-", "-"], "B/G/B/G": ["Ap", "-", "ple", "-"], "B/B/B/B": ["Wa", "ter", "me", "lon"], "G/B/B/B": ["-", "To", "ma", "to"], "B/B/B/G": ["Co", "co", "nut", "-"], "B/B/G/B": ["Ba", "na", "-", "na"], "B/G/B/B": ["Blue", "-", "ber", "ry"], "B/B/G/G": ["Ki", "wi", "-", "-"], "G/B/B/G": ["-", "Fi", "let", "-"], "G/G/B/B": ["-", "-", "Ber", "ry"], "G/B/G/B": ["-", "Sal", "-", "sa"], "B/G/G/B": ["Cher", "-", "-", "ry"], "G/B/G/G": ["-", "Peas", "-", "-"], "G/G/B/G": ["-", "-", "Sweet", "-"], "G/G/G/B": ["-", "-", "-", "&"], "G/G/G/G": ["-", "-", "-", "-"] }
    }
  };

  let currentMode = 'rhythm'; // 'rhythm' (default) or 'poetry'

  // A song belongs to exactly one side. Older records used `mode` and carried
  // both states; `side` is authoritative from v3 onward.
  function songSide(song) {
    if (!song) return 'poetry';
    return song.side === 'rhythm' || song.mode === 'rhythm' ? 'rhythm' : 'poetry';
  }

  const DEFAULT_LANDING = { rhythm: 'rhythm-ta-and-ti-ti', poetry: 'instructions' };

  /* The sandbox: one scratch song per side, for work that is not meant to
     become anything. It persists from visit to visit like every other
     song, but it is not in the library — getSortedSongIds() leaves it
     out, so no list, backup, lesson or Music Stand picker ever shows it. The only
     way into the library is Save as…. It is also where a side with no
     current song lands. */
  const SANDBOX_IDS = { rhythm: 'sandbox-rhythm', poetry: 'sandbox-poetry' };
  const SANDBOX_TITLE = 'Sandbox';
  function isSandboxId(id) { return id === SANDBOX_IDS.rhythm || id === SANDBOX_IDS.poetry; }

  const poetryState = {
    words: DEFAULT_SONGS['instructions'].poetryState.words.slice(),
    rawLyrics: DEFAULT_SONGS['instructions'].poetryState.rawLyrics.slice(),
    canonical12: [],
    beatSubdivisions: { ...DEFAULT_SONGS['instructions'].poetryState.beatSubdivisions },
    linkedBeats: { ...DEFAULT_SONGS['instructions'].poetryState.linkedBeats },
    syncopation: DEFAULT_SONGS['instructions'].poetryState.syncopation.slice(),
    syncopationStates: { ...DEFAULT_SONGS['instructions'].poetryState.syncopationStates },
    lineOverrides: {},
    hasPickupMeasure: false,
    BPM: 82,
    timeSignatureNumerator: 4,
    timeSignatureDenominator: 4,
    selectedPlayStartPosition: null
  };

  const rhythmState = {
    beats: JSON.parse(JSON.stringify(DEFAULT_SONGS['rhythm-ta-and-ti-ti'].rhythmState.beats)),
    beatSubdivisions: { ...DEFAULT_SONGS['rhythm-ta-and-ti-ti'].rhythmState.beatSubdivisions },
    linkedBeats: { ...DEFAULT_SONGS['rhythm-ta-and-ti-ti'].rhythmState.linkedBeats },
    tuplets: {},        // run tuplets, keyed by the beat the run starts on
    tupletCells: {},    // their circles, keyed the same way
    lineOverrides: {},
    hasPickupMeasure: false,
    BPM: 82,
    timeSignatureNumerator: 4,
    timeSignatureDenominator: 4,
    currentRhythmSystem: 'Simplified Kodály',
    selectedPlayStartPosition: null
  };

  let editingIndex = null;
  let isFirstPlay = true;
  let isPlaying = false;
  let isPaused = false;
  let playTimeouts = [];
  let currentPlayPosition = 0;
  let notesBoxElements = []; // Store references to notes boxes for highlighting
  let pendingNotation = [];  // notes boxes waiting to be engraved after layout

  /* Set by the Music Stand bridge while a pane is being edited, and null
     at every other time. Every edit in this app ends in render(), which
     makes render() the one place the host can be told without a new kind
     of edit being able to forget to say so. */
  let standAfterRender = null;
  let beatEnabled = true; // Beat toggle state
  let rhythmEnabled = true; // Rhythm toggle state
  let introEnabled = true; // Intro count-in state
  let textImportMode = 'replace'; // 'add' or 'replace'
  let savedTextInput = ''; // Store the text from the modal
  let pitchMode = 'pitch'; // 'pitch' or 'drum'

  /* How full the rhythm sound is: 1, 2 or 3 voices deep. A pitch gains the
     octave above it, then the one above that; percussion gains another
     instrument from the kit. It answers a complaint about the room rather
     than about the piece — next to an ostinato a single voice can sound
     thin — so unlike the switches around it, it is remembered. */
  const SOUND_PREFS_KEY = 'rhythm_poetry_sound_prefs_v1';
  let soundStrength = 1;
  try {
    const raw = JSON.parse(localStorage.getItem(SOUND_PREFS_KEY) || 'null');
    if (raw && (raw.strength === 1 || raw.strength === 2 || raw.strength === 3)) {
      soundStrength = raw.strength;
    }
  } catch (e) {}
  function saveSoundPrefs() {
    try { localStorage.setItem(SOUND_PREFS_KEY, JSON.stringify({ strength: soundStrength })); }
    catch (e) {}
  }
  let presentMode = false;

  /*
   * How the staff is sized and broken into lines. These are the user's
   * settings — nothing here changes on its own.
   *
   *   sizeMode 'fit'   the staff is scaled so the widest line fills the width
   *            'fixed' the staff is drawn at exactly `zoomPct`
   *   overflow 'scroll' a line wider than the screen scrolls sideways
   *            'wrap'   the edges are walls; over-wide lines break instead
   *   measuresPerLine  'auto' (from screen width) or a hard maximum
   */
  const VIEW_PREFS_KEY = 'rhythm_poetry_view_prefs_v1';
  const view = {
    sizeMode: 'fit',
    zoomPct: 100,
    textPct: 100,       // lyrics and counts only, on top of the staff's size
    lyricFont: 'rounded',   // a key of LYRIC_FONTS
    overflow: 'scroll',
    measuresPerLine: 'auto',
    showDots: true,
    /* With the dots showing, whether they are the ordinary circles or the
       EASY ones. The beat-dot button beside Play walks both. */
    easyMode: false,
    showMeasureNumbers: true,
    showBeatNumbers: false,
    showLineTools: true,
    followPlayback: true,
    colorDotsInPicture: false
  };

  function loadViewPrefs() {
    try {
      const raw = JSON.parse(localStorage.getItem(VIEW_PREFS_KEY) || 'null');
      if (raw && typeof raw === 'object') Object.keys(view).forEach(k => {
        if (raw[k] !== undefined) view[k] = raw[k];
      });
    } catch (e) {}
  }
  function saveViewPrefs() {
    /* While a shared piece's settings are on screen, what it shows (dots,
       EASY, numbers) is the piece's; the student's own are what is stored.
       Everything else in View (zoom, fonts…) is theirs and saves as usual. */
    const out = pieceOwnShow ? Object.assign({}, view, pieceOwnShow) : view;
    try { localStorage.setItem(VIEW_PREFS_KEY, JSON.stringify(out)); } catch (e) {}
  }
  loadViewPrefs();

  /* ==================================================================
     LAYOUT SETTINGS — what is on the page, and what can be written on it
     ------------------------------------------------------------------
     One object, always present, deciding two separate things:

       what the staff SHOWS   beat dots, measure numbers, beat numbers
       what can be BUILT      which meters, how a beat may divide, which
                              shapes each division may take

     This is deliberately not the same question as the View popover, which
     is about how big the staff is and how it scrolls — how you see it,
     rather than what there is to see.

     It governs the primary user as much as anyone, and that is the point:
     a student link is a copy of the room the teacher is already working
     in, not a second set of switches that apply to someone else. Narrow
     the vocabulary here and every link you send is narrowed with it.

     Defaults are everything-on, so an untouched app is the app that
     shipped before any of this existed.
     ================================================================== */

  const LAYOUT_KEY = 'rhythm_poetry_layout_v1';
  const LESSON_KEY = 'rhythm_poetry_lessons_v1';
  const POLICY_VERSION = 2;

  /* Which divisions a beat can take, in the order the − and + buttons walk
     them. Simple time counts a beat in two; compound counts it in three. */
  const DIVISIONS = {
    simple:   [2, 4, 3, 6],
    compound: [3, 6, 2, 4]
  };

  /* The meters each denominator offers, in the order the numeral cycles. */
  const METER_ORDER = { 4: [4, 3, 2, 6, 5], 8: [6, 9, 12] };

  const METERS = {
    simple:   METER_ORDER[4].map(n => n + '/4'),
    compound: METER_ORDER[8].map(n => n + '/8')
  };

  /* The three rungs past a beat's natural division. Simple time counts in
     two and borrows three; compound counts in three and borrows two — so
     one switch serves both families, which is why the sheet asks about
     "triplets / duplets" rather than about a number of slots. */
  const DIVIDE_SLOTS = {
    sixteenths: { simple: 4, compound: 6 },
    tuplets:    { simple: 3, compound: 2 },
    subTuplets: { simple: 6, compound: 4 }
  };

  let layout = null;        // filled in below; never null after that
  let layoutLocked = false; // a lesson, or a link sent with the layout locked
  let pieceLayoutInMemory = false; // a shared piece's own settings are on screen (A PIECE'S OWN LAYOUT)
  let pieceOwnShow = null;          // …and the student's own dots/EASY/numbers, kept meanwhile
  let policy = null;        // the student task, or null outside a lesson
  let lessonMeta = null;    // { title, songIds } while a lesson is open

  /* Every on/off pattern of a beat in that many slots, sound-first: XX
     before XO before OX before OO. This is also the order a dot-tap walks
     when the vocabulary is too small to honour the tap directly, so it
     wants to be musical rather than arbitrary — all sound first, silence
     last. */
  /* Declared up here with the other caches rather than beside the function
     that fills it: loadLayout() runs at the bottom of this block and clears
     it, which a const declared further down would not yet exist for. */
  const offersCache = {};

  const patternCache = {};
  function patternsFor(slots) {
    if (patternCache[slots]) return patternCache[slots];
    const out = [];
    for (let i = (1 << slots) - 1; i >= 0; i--) {
      let p = '';
      for (let b = slots - 1; b >= 0; b--) p += (i & (1 << b)) ? 'X' : 'O';
      out.push(p);
    }
    patternCache[slots] = out;
    return out;
  }

  function flagsToPattern(flags) {
    let p = '';
    for (let i = 0; i < flags.length; i++) p += flags[i] ? 'X' : 'O';
    return p;
  }

  function patternToFlags(pattern) {
    const out = [];
    for (let i = 0; i < pattern.length; i++) out.push(pattern[i] === 'X');
    return out;
  }

  /* Shapes are only worth choosing one at a time while there are few
     enough to take in at a glance. Six to a beat is sixty-four of them,
     well past where a grid helps anyone, so those divisions are offered
     whole or not at all. */
  const CELL_PICK_MAX = 4;
  function cellsArePickable(slots) { return slots <= CELL_PICK_MAX; }

  /* ------------------------------------------------------------------
     The vocabulary, in the groups a musician thinks in.

     Every shape a beat can take is named once, and only once, by the
     group it belongs to — the lists below partition each division rather
     than overlapping it, so a group switch can turn its whole family on
     or off without touching anything else.

     What each four-slot pattern actually engraves, since the names are
     not obvious from the Xs and Os: an X starts a note that runs until
     the next X, so XXOO is a sixteenth then a dotted eighth, and XXOX is
     the sixteenth–eighth–sixteenth that syncopates the beat.
     ------------------------------------------------------------------ */
  const VOCAB_GROUPS = [
    {
      id: 'basic',
      label: 'Quarters, eighths & rests',
      blurb: 'The plain divisions of a beat, and silence.',
      cells: {
        simple:   { 2: ['XX', 'XO', 'OO'], 4: ['XOXO', 'XOOO', 'OOOO'] },
        compound: { 3: 'all' }
      }
    },
    {
      id: 'sixteenths',
      label: 'Sixteenths',
      blurb: 'The four a beat of sixteenths is usually taught with.',
      needs: 'sixteenths',
      cells: {
        simple:   { 4: ['XXXX', 'XOXX', 'XXXO', 'XXOX'] },
        compound: { 6: 'all' }
      }
    },
    {
      id: 'sixteenthsAdvanced',
      label: 'Advanced sixteenths',
      blurb: 'The rest of them \u2014 the ones that start on a rest or carry a dot.',
      needs: 'sixteenths',
      cells: {
        simple: { 4: ['XXOO', 'XOOX', 'OXXX', 'OXXO', 'OXOX', 'OXOO', 'OOXX', 'OOOX'] }
      }
    },
    {
      id: 'dotted',
      label: 'Dotted & syncopated rhythms',
      blurb: 'Notes that lean across the beat line, and the rest that lets them.',
      cells: { simple: { 2: ['OX'] } },
      spans: { simple: { 2: ['XXOX', 'XOOX', 'XXOO'], 3: ['XOOOOO'] } }
    },
    {
      id: 'sustained',
      label: 'Halves & wholes',
      blurb: 'One note filling two beats, or four.',
      spans: { simple: { 2: ['XOOO'], 4: ['XOOOOOOO'] } }
    },
    {
      id: 'triplets',
      label: 'Triplets & duplets',
      blurb: 'The other way to divide a beat \u2014 and the same idea stretched over two beats or four.',
      needs: 'tuplets',
      cells: { simple: { 3: 'all' }, compound: { 2: 'all' } },
      runs: { simple: [2, 4] }
    },
    {
      id: 'subTriplets',
      label: 'Subdivided triplets & duplets',
      blurb: 'Those borrowed divisions split again.',
      needs: 'subTuplets',
      cells: { simple: { 6: 'all' }, compound: { 4: 'all' } }
    }
  ];

  /* ------------------------------------------------------------------
     Spans: what a run of linked beats is allowed to add up to.

     A single beat cannot hold a dotted quarter or a syncopation — those
     need a note to carry over the beat line, which is what the chain
     button is for. So the vocabulary has a second half: flag patterns
     covering two, three or four beats, read the same way as one beat's.

     Inside a linked run the per-beat shapes do not apply. An `O` there is
     a hold, not a rest, so asking whether `OX` is an allowed *beat* would
     be answering a different question entirely.

     Only runs sitting at the natural division are checked. That covers
     every shape named above, and a run that mixes a half note with a beat
     of sixteenths is left to its beats.
     ------------------------------------------------------------------ */
  function naturalSlots(fam) { return DIVISIONS[fam][0]; }

  /* Every span any group names, per family and beat count. */
  const namedSpanCache = {};
  function namedSpans(fam, beats) {
    const key = fam + ':' + beats;
    if (namedSpanCache[key]) return namedSpanCache[key];
    const out = [];
    VOCAB_GROUPS.forEach(g => {
      const spec = g.spans && g.spans[fam] && g.spans[fam][beats];
      if (spec) spec.forEach(p => { if (out.indexOf(p) === -1) out.push(p); });
    });
    namedSpanCache[key] = out;
    return out;
  }

  /* The shapes a group covers for one family, expanded from 'all'. */
  function groupCells(group, family) {
    const spec = group.cells && group.cells[family];
    if (!spec) return [];
    const out = [];
    Object.keys(spec).forEach(k => {
      const slots = parseInt(k, 10);
      const list = spec[k] === 'all' ? patternsFor(slots) : spec[k];
      out.push({ slots: slots, patterns: list });
    });
    return out;
  }

  /* Which group owns a given shape — the inverse of the table above, so
     the two can never disagree. */
  const groupOfCache = {};
  function groupOfCell(family, slots, pattern) {
    const key = family + ':' + slots;
    if (!groupOfCache[key]) {
      const map = {};
      VOCAB_GROUPS.forEach(g => {
        groupCells(g, family).forEach(entry => {
          if (entry.slots !== slots) return;
          entry.patterns.forEach(p => { map[p] = g.id; });
        });
      });
      groupOfCache[key] = map;
    }
    return groupOfCache[key][pattern] || null;
  }

  /* ------------------------------------------------------------------
     EASY mode's circles.

     Instead of one circle per slot, every beat offers a short row of
     coloured circles, and each one writes a whole rhythm in one tap. A
     child can build something that reads and sounds right without
     knowing what a subdivision is.

     A choice is a list of beats in X/O spelling. More than one beat means
     the beats are linked — that is how a half or a whole note gets
     written — so those circles only appear on beats where the note fits:
     inside the measure, and starting on a beat the note would normally
     start on (see easyFits).

     Layout Settings picks up to five of these per family, in order; the
     order is the colour. Ostinato Builder 2.0 carries the same catalogue
     under the same ids, so a teacher's choices mean the same thing in
     both apps.
     ------------------------------------------------------------------ */
  const EASY_MAX = 5;
  const EASY_COLOURS = ['#E5484D', '#F59E0B', '#22A55B', '#2E90D9', '#8E4EC6'];

  const EASY_CHOICES = {
    simple: [
      { id: 'q',    name: 'Quarter note',                   beats: ['XO'] },
      { id: 'ee',   name: 'Two eighths',                    beats: ['XX'] },
      { id: 'ssss', name: 'Four sixteenths',                beats: ['XXXX'] },
      { id: 'h',    name: 'Half note',                      beats: ['XO', 'OO'] },
      { id: 'w',    name: 'Whole note',                     beats: ['XO', 'OO', 'OO', 'OO'] },
      { id: 'dh',   name: 'Dotted half note',               beats: ['XO', 'OO', 'OO'] },
      { id: 'qr',   name: 'Quarter rest',                   beats: ['OO'] },
      { id: 're',   name: 'Eighth rest and eighth',         beats: ['OX'] },
      { id: 'ess',  name: 'Eighth and two sixteenths',      beats: ['XOXX'] },
      { id: 'sse',  name: 'Two sixteenths and an eighth',   beats: ['XXXO'] },
      { id: 'ses',  name: 'Sixteenth, eighth, sixteenth',   beats: ['XXOX'] },
      { id: 'trip', name: 'Triplet',                        beats: ['XXX'] },
      { id: 'dqe',  name: 'Dotted quarter and eighth',      beats: ['XO', 'OX'] },
      { id: 'syn',  name: 'Eighth, quarter, eighth',        beats: ['XX', 'OX'] }
    ],
    compound: [
      { id: 'dq',   name: 'Dotted quarter note',            beats: ['XOO'] },
      { id: 'eee',  name: 'Three eighths',                  beats: ['XXX'] },
      { id: 'six',  name: 'Six sixteenths',                 beats: ['XXXXXX'] },
      { id: 'dh',   name: 'Dotted half note',               beats: ['XOO', 'OOO'] },
      { id: 'dw',   name: 'Dotted whole note',              beats: ['XOO', 'OOO', 'OOO', 'OOO'] },
      { id: 'dqr',  name: 'Dotted quarter rest',            beats: ['OOO'] },
      { id: 'qe',   name: 'Quarter and eighth',             beats: ['XOX'] },
      { id: 'eq',   name: 'Eighth and quarter',             beats: ['XXO'] },
      { id: 'ree',  name: 'Eighth rest and two eighths',    beats: ['OXX'] },
      { id: 'qre',  name: 'Quarter rest and eighth',        beats: ['OOX'] },
      { id: 'duo',  name: 'Duplet',                         beats: ['XX'] }
    ]
  };

  const EASY_DEFAULT = {
    simple:   ['q', 'ee', 'ssss', 'h', 'w'],
    compound: ['dq', 'eee', 'qe', 'qre', 'dh']
  };

  /* The compound set as it first shipped. A layout still holding exactly
     that was never chosen by anyone, so it moves to the default above. */
  const EASY_FIRST_COMPOUND = ['dq', 'eee', 'six', 'dh', 'dw'];

  function easyChoice(fam, id) {
    return EASY_CHOICES[fam].find(c => c.id === id) || null;
  }

  function blankLayout() {
    return {
      v: 1,
      /* The EASY circles, per family, in order. Always one to five. */
      easy: { simple: EASY_DEFAULT.simple.slice(), compound: EASY_DEFAULT.compound.slice() },
      meters: { simple: METERS.simple.slice(), compound: METERS.compound.slice() },
      divide: { sixteenths: true, tuplets: true, subTuplets: true },
      // {} for a division means nothing has been narrowed there.
      cells: { simple: {}, compound: {} },
      /* Absent for a beat count means every named span is on. An empty
         array is different, and means every one has been switched off —
         which is also what takes the chain button away. */
      spans: { simple: {}, compound: {} }
    };
  }

  /* A stored or received layout is filled out rather than rejected, so a
     link that predates a setting still opens. */
  function normalizeLayout(raw) {
    const L = blankLayout();
    if (!raw || typeof raw !== 'object') return L;

    ['simple', 'compound'].forEach(fam => {
      const list = raw.meters && raw.meters[fam];
      if (Array.isArray(list)) {
        L.meters[fam] = METERS[fam].filter(m => list.indexOf(m) !== -1);
      }
    });
    // Somebody has to be able to count something.
    if (!L.meters.simple.length && !L.meters.compound.length) {
      L.meters.simple = METERS.simple.slice();
    }

    if (raw.divide) {
      Object.keys(L.divide).forEach(k => { L.divide[k] = raw.divide[k] !== false; });
    }

    ['simple', 'compound'].forEach(fam => {
      L.cells[fam] = {};
      const src = raw.cells && raw.cells[fam];
      if (!src || typeof src !== 'object') return;
      Object.keys(src).forEach(k => {
        const slots = parseInt(k, 10);
        const all = patternsFor(slots);
        const list = (src[k] || []).filter(x => all.indexOf(x) !== -1);
        // Canonical order whatever order it arrived in, so the tap-cycle
        // is the same for everyone who opens the link.
        if (list.length && list.length < all.length) {
          L.cells[fam][slots] = all.filter(x => list.indexOf(x) !== -1);
        }
      });
    });

    ['simple', 'compound'].forEach(fam => {
      L.spans[fam] = {};
      const src = raw.spans && raw.spans[fam];
      if (!src || typeof src !== 'object') return;
      Object.keys(src).forEach(k => {
        const beats = parseInt(k, 10);
        const named = namedSpans(fam, beats);
        if (!named.length || !Array.isArray(src[k])) return;
        const list = named.filter(x => src[k].indexOf(x) !== -1);
        if (list.length < named.length) L.spans[fam][beats] = list;
      });
    });

    /* A layout written before spans existed carried joins.sustained. False
       there meant no linking at all, which is now every named span off. */
    if (raw.joins && raw.joins.sustained === false) {
      ['simple', 'compound'].forEach(fam => {
        [2, 3, 4].forEach(beats => {
          if (namedSpans(fam, beats).length) L.spans[fam][beats] = [];
        });
      });
    }

    if (raw.easy && typeof raw.easy === 'object') {
      ['simple', 'compound'].forEach(fam => {
        const src = raw.easy[fam];
        if (!Array.isArray(src)) return;
        const keep = [];
        src.forEach(id => {
          if (easyChoice(fam, id) && keep.indexOf(id) === -1 && keep.length < EASY_MAX) keep.push(id);
        });
        if (fam === 'compound' && keep.join() === EASY_FIRST_COMPOUND.join()) return;
        if (keep.length) L.easy[fam] = keep;
      });
    }
    return L;
  }

  function loadLayout() {
    forgetDivisionOffers();
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null'); } catch (e) {}
    layout = normalizeLayout(raw);
    layoutLocked = !!(raw && raw.locked);
  }

  function saveLayout() {
    forgetDivisionOffers();
    /* A shared piece's settings are on screen for that piece only; the
       student's own are what is stored (see A PIECE'S OWN LAYOUT). */
    if (pieceLayoutInMemory) return;
    try {
      pruneLayoutCells(layout);
      const out = JSON.parse(JSON.stringify(layout));
      out.locked = layoutLocked;
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(out));
    } catch (e) {}
  }

  loadLayout();

  /* What travels in a link: the build rules, plus the three on-screen
     switches, which live in the view preferences because that is where
     the rest of the app already reads them. */
  function layoutSnapshot() {
    return {
      layout: JSON.parse(JSON.stringify(layout)),
      show: {
        dots: view.showDots,
        easy: !!view.easyMode,
        measureNumbers: view.showMeasureNumbers,
        beatNumbers: view.showBeatNumbers
      }
    };
  }

  function applyLayoutSnapshot(snap, lock) {
    if (!snap) return;
    forgetDivisionOffers();
    layout = normalizeLayout(snap.layout || snap);
    if (snap.show) {
      if (snap.show.dots !== undefined) view.showDots = !!snap.show.dots;
      if (snap.show.easy !== undefined) view.easyMode = !!snap.show.easy;
      if (snap.show.measureNumbers !== undefined) view.showMeasureNumbers = !!snap.show.measureNumbers;
      if (snap.show.beatNumbers !== undefined) view.showBeatNumbers = !!snap.show.beatNumbers;
      saveViewPrefs();
    }
    if (lock) layoutLocked = true;
    saveLayout();
  }

  /* ------------------------------------------------------------------
     A PIECE'S OWN LAYOUT

     Every piece remembers the Layout Settings it was saved with —
     `record.layout`, a layoutSnapshot(): the build rules (EASY's rhythms
     among them) and whether it shows dots or EASY. Opening it brings
     them back:
       • a shared piece (a teacher's, from a book or a link): on screen for
         that piece only and LOCKED — the student's own settings are left
         stored and come back as soon as anything else is opened;
       • one of your own: becomes the settings in use, and is stored as the
         app's, so a new piece starts from where you are. Unlocked.
     A Save my copy keeps the piece's settings, unlocked (it is theirs).
     Not in a lesson (its layout rules), and never over settings a lesson
     or a locked link has locked. In the Music Stand, see
     embeddedPieceLayout().
     ------------------------------------------------------------------ */
  function storedLayoutLocked() {
    try { return !!(JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null') || {}).locked; }
    catch (e) { return false; }
  }

  const PIECE_SHOW_KEYS = ['showDots', 'easyMode', 'showMeasureNumbers', 'showBeatNumbers'];

  /* Back from a shared piece's settings to the student's own. */
  function leavePieceLayout() {
    if (!pieceLayoutInMemory) return;
    pieceLayoutInMemory = false;
    if (pieceOwnShow) Object.assign(view, pieceOwnShow);
    pieceOwnShow = null;
    loadLayout();
  }

  /* In the Music Stand a piece is shown with its OWN build rules — EASY's
     rhythm choices among them — whatever this browser's stored settings
     are: the stand is showing that piece, and a student's stand must show
     what the teacher's did (the stand keeps them with the piece; see the
     bridge's snapshot()). In memory only — the frame cannot write storage
     — and without `show`: dots or EASY is the stand's to choose, per pane.
     A piece with no settings of its own shows the stored ones. */
  function embeddedPieceLayout(snap) {
    forgetDivisionOffers();
    if (snap) {
      layout = normalizeLayout(snap.layout || snap);
      pieceLayoutInMemory = true;
    } else {
      pieceLayoutInMemory = false;
      loadLayout();
    }
  }

  function usePieceLayout(song) {
    if (lessonMeta) return;
    const snap = song && song.layout && typeof song.layout === 'object' ? song.layout : null;
    if (EMBEDDED) { embeddedPieceLayout(snap); return; }
    if (snap && song.received) {
      if (!pieceOwnShow) {
        pieceOwnShow = {};
        PIECE_SHOW_KEYS.forEach(k => { pieceOwnShow[k] = view[k]; });
      }
      forgetDivisionOffers();
      layout = normalizeLayout(snap.layout || snap);
      if (snap.show) {
        if (snap.show.dots !== undefined) view.showDots = !!snap.show.dots;
        if (snap.show.easy !== undefined) view.easyMode = !!snap.show.easy;
        if (snap.show.measureNumbers !== undefined) view.showMeasureNumbers = !!snap.show.measureNumbers;
        if (snap.show.beatNumbers !== undefined) view.showBeatNumbers = !!snap.show.beatNumbers;
      }
      layoutLocked = true;
      pieceLayoutInMemory = true;
    } else {
      leavePieceLayout();                  // back from a shared piece: the student's own
      if (snap && !song.received && !storedLayoutLocked()) applyLayoutSnapshot(snap, false);
    }
    if (typeof syncViewControls === 'function') syncViewControls();
  }

  /* What a save compares: the build rules count as part of the piece (so a
     changed setting is a changed piece, and is published as one); the
     dots/EASY view is carried along but is not a change on its own — the
     dots button is pressed constantly. */
  function pieceLayoutKey(rec) {
    const l = rec && rec.layout;
    return stableStringify(l ? (l.layout || l) : null);
  }

  /* ---- the questions the rest of the app asks ---------------------- */

  /* Locked means the Layout Settings sheet cannot be opened — not that
     nothing on it can move. The beat-dot button is deliberately outside
     this: going back and forth with the dots is something a class does
     constantly, and no lesson has a reason to stop it. */
  function layoutEditable() { return !layoutLocked; }

  function familyOf(state) { return isCompoundTime(state) ? 'compound' : 'simple'; }

  function divisionEnabledIn(fam, slots) {
    if (slots === DIVISIONS[fam][0]) return true;   // a beat has to divide somehow
    const names = Object.keys(DIVIDE_SLOTS);
    for (const name of names) {
      if (DIVIDE_SLOTS[name][fam] === slots) return layout.divide[name] !== false;
    }
    return false;
  }

  /* A division that is switched off has no shapes to narrow, so whatever
     was stored for it is noise — and expensive noise, since six to a beat
     is sixty-four patterns that would otherwise ride along in every link.
     Turning a division back on hands back all of it; narrow it again if
     that is what you want. */
  function pruneLayoutCells(L) {
    ['simple', 'compound'].forEach(fam => {
      Object.keys(L.cells[fam]).forEach(k => {
        if (!divisionEnabledIn(fam, parseInt(k, 10))) delete L.cells[fam][k];
      });
    });
  }

  function divisionAllowed(slots, state) {
    const fam = familyOf(state);
    if (slots === DIVISIONS[fam][0]) return true;   // a beat has to divide somehow
    const names = Object.keys(DIVIDE_SLOTS);
    for (const name of names) {
      if (DIVIDE_SLOTS[name][fam] === slots) return layout.divide[name] !== false;
    }
    return false;
  }

  /* The shapes a beat of this many slots may take, or null for all of
     them. A division with no stored list has not been narrowed. */
  function cellsFor(slots, state) {
    const list = layout.cells[familyOf(state)][slots];
    return (Array.isArray(list) && list.length) ? list : null;
  }

  function cellAllowed(flags, slots, state) {
    const list = cellsFor(slots, state);
    return !list || list.indexOf(flagsToPattern(flags)) !== -1;
  }

  /* Tapping a dot proposes a new shape for the beat. When the vocabulary
     forbids that shape the beat moves to the next one that is allowed,
     rather than the tap being swallowed — a dead dot is the one thing
     that would make a narrowed app feel broken instead of simple.

     With a full vocabulary the proposal always stands and this is the
     plain toggle it has always been. With a two-shape vocabulary it turns
     into exactly what a first-grade lesson wants: tap the beat, it flips
     between ta and ti-ti. */
  function resolveCell(currentFlags, proposedFlags, slots, state) {
    if (cellAllowed(proposedFlags, slots, state)) return proposedFlags;
    const list = cellsFor(slots, state);
    if (!list || !list.length) return currentFlags.slice();
    const here = list.indexOf(flagsToPattern(currentFlags));
    return patternToFlags(list[(here + 1) % list.length]);
  }

  /* Which named spans of this length are switched on. */
  function spansOn(fam, beats) {
    const stored = layout.spans[fam] && layout.spans[fam][beats];
    return Array.isArray(stored) ? stored : namedSpans(fam, beats);
  }

  function spanAllowed(flags, beats, state) {
    const fam = familyOf(state);
    const named = namedSpans(fam, beats);
    if (!named.length) return true;
    const pattern = flagsToPattern(flags);
    // A shape nobody named is not the vocabulary's business.
    if (named.indexOf(pattern) === -1) return true;
    return spansOn(fam, beats).indexOf(pattern) !== -1;
  }

  /* Same bargain as resolveCell: a tap that lands on a switched-off span
     moves to the next one that is on, rather than doing nothing. */
  function resolveSpan(currentFlags, proposedFlags, beats, state) {
    if (spanAllowed(proposedFlags, beats, state)) return proposedFlags;
    const list = spansOn(familyOf(state), beats);
    if (!list.length) return currentFlags.slice();
    const here = list.indexOf(flagsToPattern(currentFlags));
    return patternToFlags(list[(here + 1) % list.length]);
  }

  /* The chain button is there while there is still something to chain two
     beats into. */
  function linkingOffered(state) {
    const fam = familyOf(state);
    return namedSpans(fam, 2).length > 0 && spansOn(fam, 2).length > 0;
  }

  /* Triplets spread across a run of beats are not asked about separately:
     if the layout has triplets at all, a quarter-note triplet is the same
     idea at a larger size. */
  function joinAllowed(kind) {
    if (kind === 'sustained' || kind === 'link') return linkingOffered();
    if (kind === 'runTriplet') return layout.divide.tuplets !== false;
    if (kind === 'pickup') return layoutEditable();
    return true;
  }

  /* Is there anything at this division you cannot already write at the
     beat's natural one?

     This is the question the + and − buttons actually answer, and it is
     not the same as "is this division switched on". Turning off the
     Sixteenths, Dotted and Syncopation groups leaves the sixteenth grid
     technically enabled and holding four shapes — but they are the plain
     quarter, the two eighths and the rests, which are already there at
     two to a beat. A + that leads only to what you had is a button that
     does nothing, so it goes.

     A picture counts if it can be written here and cannot be written on
     the natural division. That is exactly the set of rhythms the button
     exists to reach. */
  function divisionOffersSomethingNew(fam, slots) {
    const natural = DIVISIONS[fam][0];
    if (slots === natural) return true;
    const key = fam + ':' + slots;
    if (offersCache[key] !== undefined) return offersCache[key];
    const answer = familyPictures(fam).some(pic =>
      pictureIsOn(pic, fam) &&
      pic.members.some(m => m.slots === slots) &&
      !pic.members.some(m => m.slots === natural));
    offersCache[key] = answer;
    return answer;
  }

  function forgetDivisionOffers() {
    Object.keys(offersCache).forEach(k => delete offersCache[k]);
  }

  function divisionIsReachable(slots, state) {
    const fam = familyOf(state);
    return divisionAllowed(slots, state) && divisionOffersSomethingNew(fam, slots);
  }

  /* Only the rungs of a − ladder that are both switched on and worth
     walking to. */
  function allowedLadder(ladder, state) {
    if (!ladder) return ladder;
    const keep = ladder.filter(s => divisionIsReachable(s, state));
    return keep.length ? keep : null;
  }

  /* The numerals this denominator offers, in cycling order. */
  function meterCycle(denominator) {
    const fam = denominator === 8 ? 'compound' : 'simple';
    const list = layout.meters[fam];
    return (METER_ORDER[denominator] || [4]).filter(n => list.indexOf(n + '/' + denominator) !== -1);
  }

  function meterIsFixed() {
    if (!rhythmEditable()) return true;
    return meterCycle(4).length + meterCycle(8).length <= 1;
  }

  function denominatorsOffered() {
    return [4, 8].filter(d => meterCycle(d).length > 0);
  }

  /* ---- the student task, which only a lesson sets ------------------ */

  function sideAllowed(side) { return !policy || policy.sides[side] !== false; }
  function onlySide() {
    if (!policy) return null;
    if (policy.sides.rhythm && !policy.sides.poetry) return 'rhythm';
    if (policy.sides.poetry && !policy.sides.rhythm) return 'poetry';
    return null;
  }

  /* The two locks the four task types are built from. Everything that can
     change how the piece sounds asks rhythmEditable(); everything that can
     change what is sung asks wordsEditable(). */
  function rhythmEditable() { return !policy || !policy.task.rhythmLocked; }
  function wordsEditable()  { return !policy || !policy.task.wordsLocked; }

  /* Which circles a lesson hands over: 'easy', 'regular' or 'both'. Read
     only is not a fourth value here — it is the rhythm lock above, and
     both answers below already follow it. */
  function circlesAllowed() { return (policy && policy.task.circles) || 'both'; }

  /* EASY writes, so it goes wherever writing does. In the Music Stand
     there is no button here to leave EASY by, so the stand switches it
     from the pane's View menu (`easyMode` in the bridge's VIEW_KEYS), and
     the circles only take a tap while the stand is editing. */
  function easyOffered() {
    return rhythmEditable() && circlesAllowed() !== 'regular';
  }
  function regularOffered() { return !easyOffered() || circlesAllowed() !== 'easy'; }

  /* A lesson that only offers EASY shows EASY whenever the dots are up,
     whatever this browser last had. */
  function easyOn() {
    return view.showDots && easyOffered() && (view.easyMode || !regularOffered());
  }

  function tempoLocked() { return !!policy && policy.tempo.locked; }
  function tempoMin() { return policy ? policy.tempo.min : 21; }
  function tempoMax() { return policy ? policy.tempo.max : 600; }
  function clampTempo(v) { return Math.max(tempoMin(), Math.min(tempoMax(), v)); }

  /* Adding or removing a measure changes how the piece sounds, so both ask
     the rhythm lock before they ask their own setting. */
  function canAddMeasures() {
    return rhythmEditable() && (!policy || policy.structure.canAdd !== false);
  }
  function canRemoveMeasures() {
    return rhythmEditable() && (!policy || policy.structure.canRemove !== false);
  }
  function maxMeasuresAllowed() {
    return (policy && policy.structure.maxMeasures) ? policy.structure.maxMeasures : Infinity;
  }

  function shellAllows(key) { return !policy || policy.shell[key] !== false; }
  function libraryMode() { return policy ? policy.shell.library : 'full'; }

  function systemsOffered() {
    const all = Object.keys(rhythmSystems);
    if (!policy || !policy.shell.systems || !policy.shell.systems.length) return all;
    return all.filter(s => policy.shell.systems.indexOf(s) !== -1);
  }

  const CIRCLE_MODES = ['easy', 'regular', 'both'];

  function blankPolicy() {
    return {
      v: POLICY_VERSION,
      sides: { rhythm: true, poetry: true },
      tempo: { min: 40, max: 240, locked: false },
      structure: { maxMeasures: null, canAdd: true, canRemove: true },
      /* circles: which dots the beat-dot button offers — 'easy',
         'regular' or 'both'. */
      task: { rhythmLocked: false, wordsLocked: false, circles: 'both', note: '' },
      shell: {
        sound: true, view: true, present: true, picture: true,
        systems: null,                   // null = every syllable system
        library: 'lesson'                // 'lesson' | 'none'
      }
    };
  }

  function normalizePolicy(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const p = blankPolicy();
    const src = raw;

    if (src.sides) {
      p.sides.rhythm = src.sides.rhythm !== false;
      p.sides.poetry = src.sides.poetry !== false;
      if (!p.sides.rhythm && !p.sides.poetry) p.sides.rhythm = true;
    }

    if (src.tempo) {
      const lo = parseInt(src.tempo.min, 10);
      const hi = parseInt(src.tempo.max, 10);
      if (!isNaN(lo)) p.tempo.min = Math.max(21, Math.min(600, lo));
      if (!isNaN(hi)) p.tempo.max = Math.max(21, Math.min(600, hi));
      if (p.tempo.min > p.tempo.max) { const t = p.tempo.min; p.tempo.min = p.tempo.max; p.tempo.max = t; }
      p.tempo.locked = !!src.tempo.locked;
    }

    if (src.structure) {
      const mx = parseInt(src.structure.maxMeasures, 10);
      p.structure.maxMeasures = isNaN(mx) || mx < 1 ? null : mx;
      p.structure.canAdd = src.structure.canAdd !== false;
      p.structure.canRemove = src.structure.canRemove !== false;
    }

    if (src.task) {
      p.task.rhythmLocked = !!src.task.rhythmLocked;
      p.task.wordsLocked = !!src.task.wordsLocked;
      p.task.circles = CIRCLE_MODES.indexOf(src.task.circles) !== -1 ? src.task.circles : 'both';
      p.task.note = typeof src.task.note === 'string' ? src.task.note.slice(0, 160) : '';
    }

    if (src.shell) {
      ['sound', 'view', 'present', 'picture'].forEach(k => {
        p.shell[k] = src.shell[k] !== false;
      });
      if (Array.isArray(src.shell.systems) && src.shell.systems.length) {
        const known = Object.keys(rhythmSystems);
        const keep = src.shell.systems.filter(s => known.indexOf(s) !== -1);
        p.shell.systems = keep.length ? keep : null;
      }
      p.shell.library = src.shell.library === 'none' ? 'none' : 'lesson';
    }

    return p;
  }

  /* One sentence naming the task, for the strip above the staff. The
     teacher's own wording wins; these are only the fallback. */
  const TASK_BLURB = {
    'free':   'Build whatever you like.',
    'words':  'The rhythm is set — write words that fit it.',
    'rhythm': 'The words are set — find a rhythm that fits them.',
    'read':   'Read and play this one.'
  };

  function taskKind() {
    if (!policy) return 'free';
    const r = policy.task.rhythmLocked, w = policy.task.wordsLocked;
    if (r && w) return 'read';
    if (r) return 'words';
    if (w) return 'rhythm';
    return 'free';
  }

  function taskBlurb() {
    if (policy && policy.task.note) return policy.task.note;
    return TASK_BLURB[taskKind()];
  }


  let fitScale = 1;        // the scale that would make the widest line fill the width
  let appliedScale = 1;    // what is actually on screen right now
  let lineIsCramped = [];  // per line: would splitting it make the whole staff bigger?

  // Audio context for generating sounds
  let audioContext = null;
  /* Where the sounds go. Left null, that is the speakers; embedded in the
     Music Stand it is its own gain for this side, on its own context,
     so both apps sound on one clock and each side has its own volume. */
  let audioOut = null;
  function audioDestination(ctx) { return audioOut || ctx.destination; }

  function getActiveState() {
    return currentMode === 'rhythm' ? rhythmState : poetryState;
  }

  /* On its own the app keeps its context behind a timed view (see
     lib/evm-count-in.js): every voice reads currentTime once, so playback
     can hand a note over a moment early and have it placed on the audio
     clock exactly when it is due. Embedded, the Music Stand hands over
     its own context, already timed, and does the placing itself. */
  let timedAudio = null;

  function initAudioContext() {
    if (!audioContext) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      timedAudio = EVMCountIn.timed(new Ctor({ latencyHint: 'interactive' }));
      audioContext = timedAudio.ctx;
    }
    return audioContext;
  }

  // Convert the current words array to clean plain text
  function wordsToText() {
    if (poetryState.rawLyrics && poetryState.rawLyrics.length > 0) {
      return poetryState.rawLyrics.join(' ');
    }
    return poetryState.words
      .filter(word => word && word !== '-' && word.trim() !== '')
      .join(' ');
  }

  // Copy text to clipboard
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        textArea.remove();
        return true;
      } catch (err) {
        textArea.remove();
        return false;
      }
    }
  }

  // Copy canvas to clipboard
  async function copyCanvasToClipboard(canvas) {
    try {
      // Convert canvas to blob
      return new Promise(resolve => {
        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve(true);
          } catch (err) {
            console.error('Failed to copy image to clipboard:', err);
            resolve(false);
          }
        }, 'image/png');
      });
    } catch (err) {
      console.error('Clipboard API not supported:', err);
      return false;
    }
  }

  // Capture the notation as a JPEG in Downloads
  async function captureVisual() {
    const btn = document.getElementById("copy-visual-btn");
    const target = document.getElementById("poem") || container;
    if (!target) return;

    // html2canvas cannot read a CSS transform reliably, so capture unscaled.
    const savedTransform = target.style.transform;

    try {
      document.body.classList.add("capturing");
      document.body.classList.toggle("capture-color", view.colorDotsInPicture);
      if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }
      target.style.transform = "none";

      await new Promise(resolve => setTimeout(resolve, 120));

      const canvas = await html2canvas(target, {
        backgroundColor: "#FFFFFF",
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: (element) => {
          return element.classList && (
            element.classList.contains("delete-measure-btn") ||
            element.classList.contains("add-measure-btn") ||
            element.classList.contains("beat-subdivision-controls") ||
            element.classList.contains("beat-link-btn") ||
            element.classList.contains("easy-row") ||
            element.classList.contains("line-tool")
          );
        }
      });

      const songName = (getCurrentSongTitle() || "music-score")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

      const link = document.createElement("a");
      link.download = `${songName || "music-score"}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast("Picture saved to your downloads");
    } catch (error) {
      console.error("Failed to capture visual:", error);
      toast("Could not save the picture");
    } finally {
      target.style.transform = savedTransform;
      document.body.classList.remove("capturing");
      document.body.classList.remove("capture-color");
      if (btn) { btn.disabled = false; btn.textContent = "Save picture"; }
      applyZoom();
    }
  }

  // Get the first circle position of the next beat after a syncopated position
  function getNextBeatFirstCircle(syncopatedPosition) {
    return syncopatedPosition + 1;
  }

  // Check if a position is affected by syncopation
  function isAffectedBySyncopation(position) {
    if (currentMode === 'rhythm') return false;
    for (const syncPos of poetryState.syncopation) {
      const nextBeatFirstCircle = getNextBeatFirstCircle(syncPos);
      const nextBeatSecondCircle = nextBeatFirstCircle + 1;
      if (position === nextBeatFirstCircle || position === nextBeatSecondCircle) {
        return true;
      }
    }
    return false;
  }

  // Check if a position can be syncopated (not on last beat of measure)
  function canSyncopate(position) {
    const config = getLayoutConfig();
    const positionInMeasure = position % (config.beatsPerMeasure * 2);
    const beatInMeasure = Math.floor(positionInMeasure / 2);
    const lastBeatOfMeasure = config.beatsPerMeasure - 1;
    return beatInMeasure !== lastBeatOfMeasure;
  }

  // Check if syncopation conditions are met for a position
  function canCreateSyncopation(position) {
    if (poetryState.timeSignatureDenominator === 8) return false;
    if (position % 2 === 0) return false;
    if (position === 0 || poetryState.words[position - 1] === '-' || poetryState.words[position - 1] === '') return false;
    return canSyncopate(position);
  }


  function applyIsolatedRhythmChange(position) {
    if (poetryState.syncopation.length > 0) return false;

    while (poetryState.words.length <= position) {
      poetryState.words.push('-');
    }

    // Ensure rawLyrics is populated
    if (!poetryState.rawLyrics || poetryState.rawLyrics.length === 0) {
      poetryState.rawLyrics = poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
    }

    const wasActive = poetryState.words[position] !== '-' && poetryState.words[position] !== '' && poetryState.words[position] !== undefined;

    if (wasActive) {
      // Turning this note into a rest
      poetryState.words[position] = '-';
    } else {
      // Turning this rest into a note
      poetryState.words[position] = ' ';
    }

    redistributeLyrics();
    return true;
  }

  /* Lyrics are a pool, not a fixed address: the words sit on whichever
     notes exist, in order, and reshaping the rhythm re-flows them rather
     than losing any. Everything that changes which slots sound calls this
     afterwards. */
  function redistributeLyrics() {
    if (!poetryState.rawLyrics) poetryState.rawLyrics = [];
    const activeIndices = [];
    for (let i = 0; i < poetryState.words.length; i++) {
      if (poetryState.words[i] !== '-' && poetryState.words[i] !== '') {
        activeIndices.push(i);
      }
    }

    for (let k = 0; k < activeIndices.length; k++) {
      const slot = activeIndices[k];
      if (k < poetryState.rawLyrics.length) {
        poetryState.words[slot] = poetryState.rawLyrics[k];
      } else {
        poetryState.words[slot] = ' ';
      }
    }
  }

  /* Write one beat's shape into the lyric grid, then let the words re-flow
     across whatever notes are left. Used when the vocabulary has to
     override what a tap asked for. */
  function writePoetryBeatRaw(startPosition, flags) {
    for (let i = 0; i < flags.length; i++) {
      const at = startPosition + i;
      while (poetryState.words.length <= at) poetryState.words.push('-');
      poetryState.words[at] = flags[i] ? ' ' : '-';
    }
  }

  function writePoetryBeat(startPosition, flags) {
    writePoetryBeatRaw(startPosition, flags);
    redistributeLyrics();
  }

  /* The flags of one beat as the app currently reads them, on either side. */
  function beatFlags(beatIndex, startPosition) {
    const state = getActiveState();
    const slots = getBeatSubdivision(beatIndex, state);
    const out = [];
    if (currentMode === 'rhythm') {
      const cells = rhythmState.beats[beatIndex] || [];
      for (let i = 0; i < slots; i++) out.push(!!cells[i]);
    } else {
      for (let i = 0; i < slots; i++) out.push(isPositionActive(startPosition + i, poetryState.words));
    }
    return out;
  }

  /* After a subdivision change the remapped notes may land on a shape the
     lesson does not allow. Nudge the beat onto the nearest legal one. */
  function snapBeatToVocabulary(beatIndex) {
    if (!policy) return;
    const state = getActiveState();
    if (findTupletRun(beatIndex, state)) return;
    const slots = getBeatSubdivision(beatIndex, state);
    if (!cellsFor(slots, state)) return;

    if (currentMode === 'rhythm') {
      const cur = beatFlags(beatIndex, 0);
      if (cellAllowed(cur, slots, state)) return;
      rhythmState.beats[beatIndex] = resolveCell(cur, cur, slots, state);
    } else {
      if (poetryState.syncopation.length > 0) return;
      const start = getBeatStartIndex(beatIndex, state);
      const cur = beatFlags(beatIndex, start);
      if (cellAllowed(cur, slots, state)) return;
      writePoetryBeat(start, resolveCell(cur, cur, slots, state));
    }
  }

  // Check if a position should be considered active (for rhythm and display)
  function isPositionActive(position, wordArray) {
    if (isAffectedBySyncopation(position)) {
      return poetryState.syncopationStates[position] || false;
    } else {
      const word = wordArray[position];
      return word !== '-' && word !== '' && word !== undefined;
    }
  }

  // Generate brush drum sound using white noise
  function createBrushDrumSound() {
    const ctx = initAudioContext();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const envelope = Math.pow(0.01, i / bufferSize);
      output[i] = (Math.random() * 2 - 1) * envelope * 0.3;
    }
    return buffer;
  }

  /* Every voice reads the clock once and starts from that reading, never
     with a bare start(). On its own that is the same thing; embedded in
     the Music Stand, the clock it reads is the moment the note is due, so the
     note is scheduled to the sample rather than to a timer. */
  /* `always` is the count-in's: it is heard whether or not the steady
     beat is on — a count that goes silent when the beat is switched off
     is no count at all. */
  function playBrushDrum(always) {
    if (!beatEnabled && !always) return;
    const ctx = initAudioContext();
    const time = ctx.currentTime;
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    source.buffer = createBrushDrumSound();
    source.connect(gainNode);
    gainNode.connect(audioDestination(ctx));
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.5, time + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    source.start(time);
    source.stop(time + 0.1);
  }

  /* ---- the kit ------------------------------------------------------
     The same percussion engine Ostinato Builder plays, so a rhythm here
     and an ostinato there are the same instruments in the same room.
     That is the point of it: beside an ostinato, this app's homemade
     bass drum was the thing that sounded thin.

     Built on whichever context the app is using — its own, or the Music
     Stand's when it is embedded — so attachAudio drops it and the next
     note builds it again on the shared clock. */
  const VI = window.VirtualInstruments || null;
  let kit = null;

  function getKit() {
    if (!VI) return null;
    if (!kit) {
      kit = VI.createKit({
        audioContext: initAudioContext(),
        destination: audioOut || undefined,
        volume: 0.9
      });
      kit.unlock();
    }
    return kit;
  }
  function dropKit() { kit = null; }

  /* How the rhythm is voiced at each strength. A pitch gains the octave
     above it and then the one above that; percussion gains another
     instrument. Both read the same 1/2/3, so one switch answers for both
     and the piece sounds the same shape either way.

     The percussion stack starts as a pair on purpose: a tom carries the
     weight and the shaker puts an edge on the front of it, which is what
     a single drum was missing. */
  const PERCUSSION_STACK = ['tom', 'shaker', 'snare', 'claves'];

  function percussionVoices(strength) {
    /* one more instrument than the pitch stack has octaves — the extra
       one is the shaker, which is colour rather than another note */
    return PERCUSSION_STACK.slice(0, Math.max(1, Math.min(3, strength)) + 1);
  }

  /* The rhythm, as percussion. Every voice in the stack is struck at the
     same reading of the clock, so embedded in the Music Stand the whole
     stack lands on the one moment the note is due rather than smearing
     across the callback. */
  function playPercussion() {
    if (!rhythmEnabled) return;
    const k = getKit();
    /* No kit means the library did not load. A rhythm that cannot be
       heard is worse than one heard on the wrong instrument, so the
       pitch takes over rather than the beat going missing. */
    if (!k) { playTriangleTone(0.12); return; }
    percussionVoices(soundStrength).forEach(id => k.play(id, {}));
  }

  /* The rhythm, as a pitch. At full strength it is three of the same
     note an octave apart — a single 110 Hz triangle is a weak thing to
     put under an ostinato, and an octave doubling is the oldest way of
     making one line sound like more of one without changing the note.
     The doublings are quieter the higher they go, so what is added is
     brightness rather than a second melody. */
  const OCTAVE_LEVELS = [1, 0.55, 0.3];   // how loud each octave is, relative

  function playTriangleTone(duration = 0.2) {
    if (!rhythmEnabled) return;
    const ctx = initAudioContext();
    const time = ctx.currentTime;
    const layers = Math.max(1, Math.min(3, soundStrength));
    const out = audioDestination(ctx);
    for (let i = 0; i < layers; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const peak = 0.3 * OCTAVE_LEVELS[i];
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(110 * Math.pow(2, i), time);
      oscillator.connect(gainNode);
      gainNode.connect(out);
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(peak, time + 0.02);
      gainNode.gain.linearRampToValueAtTime(peak / 3, time + duration - 0.05);
      gainNode.gain.linearRampToValueAtTime(0, time + duration);
      oscillator.start(time);
      oscillator.stop(time + duration);
    }
  }

  /*
   * Keep the sounding beat in view while the music plays — the way a
   * teleprompter or a follow-score does it: the page holds still and the
   * highlight travels across it. Only once the beat would run past a
   * threshold near the edge does the page itself slide, in one clean motion,
   * to bring it back near the start. Scrolling on every beat (an earlier
   * version of this did) reads as constant background jitter; scrolling only
   * at the edge reads as turning a page.
   *
   * The two thresholds matter more than the two landing spots:
   *   RESET_X_AT / RESET_Y_AT   how far the beat is allowed to travel before
   *                             the page slides — the width of the "window"
   *   FOLLOW_X / FOLLOW_Y       where it lands after that slide
   *
   * Both axes are handled, and independently: a zoomed-in score can overflow
   * sideways, downwards, or both, and sliding one must not disturb the other.
   */
  const FOLLOW_X = 0.25;     // lands a quarter in from the left after a slide
  const FOLLOW_Y = 0.35;     // lands a little above centre after dropping a line
  const RESET_X_AT = 0.78;   // slide once the beat travels past this far across
  const RESET_Y_AT = 0.72;   // drop once the beat travels past this far down
  const BEHIND_MARGIN = 0.04; // also correct if the beat is now behind the window
                              // (a new line starting back at the left edge, or
                              // the loop back to the top of the piece)

  // Cancels an in-flight smooth scroll — called on pause/stop so a slide that
  // was underway doesn't keep drifting after the music has stopped.
  function stopFollowing() {
    if (!stage) return;
    stage.scrollTo({ left: stage.scrollLeft, top: stage.scrollTop, behavior: 'auto' });
  }

  function scrollToElement(element) {
    if (!element || !stage || !view.followPlayback) return;

    const el = element.getBoundingClientRect();
    const box = stage.getBoundingClientRect();

    const maxX = stage.scrollWidth - stage.clientWidth;
    const maxY = stage.scrollHeight - stage.clientHeight;
    const canScrollX = maxX > 4;
    const canScrollY = maxY > 4;
    if (!canScrollX && !canScrollY) return;

    const relX = (el.left - box.left) / stage.clientWidth;
    const relY = (el.top - box.top) / stage.clientHeight;

    const opts = {};

    if (canScrollX && (relX > RESET_X_AT || relX < -BEHIND_MARGIN)) {
      const delta = (el.left - box.left) - (stage.clientWidth * FOLLOW_X);
      opts.left = Math.max(0, Math.min(stage.scrollLeft + delta, maxX));
    }

    if (canScrollY && (relY > RESET_Y_AT || relY < -BEHIND_MARGIN)) {
      const wanted = (stage.clientHeight * FOLLOW_Y) - (el.height / 2);
      const delta = (el.top - box.top) - wanted;
      opts.top = Math.max(0, Math.min(stage.scrollTop + delta, maxY));
    }

    if (opts.left === undefined && opts.top === undefined) return;

    // An ordinary page turn glides, so it reads as one deliberate motion.
    // But if the beat is not even partly visible right now — looping back to
    // the start, or jumping to a tapped start position far from here — land
    // at once instead of visibly sweeping across everything in between.
    // (A pixel-distance heuristic isn't reliable here: whether a jump "looks
    // big" depends on the current scroll position, not just the beat's own
    // travel distance — so this checks actual on-screen visibility instead.)
    const visible = el.right > box.left && el.left < box.right &&
                    el.bottom > box.top && el.top < box.bottom;
    opts.behavior = visible ? 'smooth' : 'auto';
    stage.scrollTo(opts);
  }

  function highlightNotesBox(position) {
    notesBoxElements.forEach(box => { if (box) box.classList.remove('playing'); });
    if (position < notesBoxElements.length) {
      const currentElement = notesBoxElements[position];
      currentElement.classList.add('playing');
      scrollToElement(currentElement);
    }
  }

  function clearHighlights() {
    notesBoxElements.forEach(box => { if (box) box.classList.remove('playing'); });
  }

  /* ==================================================================
     THE RHYTHM MODEL

     Everything is counted in ticks, 24 to a quarter note. That number is
     chosen so every division this app can draw lands on a whole tick:

       quarter 24 · eighth 12 · sixteenth 6 · thirty-second 3
       triplet eighth 8 · sextuplet sixteenth 4
       dotted quarter 36 · compound duplet 18 · quadruplet 9
       quarter-note triplet 16 · half-note triplet 32

     A beat is divided two ways. Its own subdivision splits just that beat
     and always lands on the beat line. A run tuplet spreads a number of
     even notes across several linked beats, so its notes fall between the
     beats - three notes across two beats, say - and it therefore belongs
     to the run rather than to any one beat.
     ================================================================== */
  const TICKS_PER_QUARTER = 24;

  function isCompoundTime(state = null) {
    return (state || getActiveState()).timeSignatureDenominator === 8;
  }

  /* How long one beat lasts: a quarter in simple time, a dotted quarter
     in compound. */
  function beatTicks(state = null) {
    return isCompoundTime(state) ? 36 : TICKS_PER_QUARTER;
  }

  function defaultSubdivision(state = null) { return isCompoundTime(state) ? 3 : 2; }

  /* What the + button toggles to: the sixteenth-note level of this beat. */
  function sixteenthSubdivision(state = null) { return isCompoundTime(state) ? 6 : 4; }

  /* What the - button walks through on a single beat: the opposite feel,
     then its subdivision, then back off. */
  function beatTupletLadder(state = null) {
    return isCompoundTime(state) ? [2, 4] : [3, 6];
  }

  /* What the - button walks through on a run of linked beats. Only two and
     four beat runs have a sensible triplet; three beats is already three. */
  function runTupletLadder(beats, state = null) {
    if (isCompoundTime(state)) return null;
    if (beats === 2) return [3, 6];
    if (beats === 4) return [3, 6, 12];
    return null;
  }

  /* Does this many slots in one beat mean a tuplet, and if so, how many
     notes is it standing in for? Three eighths in the time of two, four
     sixteenths in the time of six, and so on. */
  /* The number over a tuplet names the grouping it puts the beat into, not
     how many notes are in it: a beat divided in three reads 3 whether it is
     three eighths or six sixteenths, and a compound beat borrowed into two
     reads 2 whether it is two eighths or four sixteenths. The ratio used to
     work out what to draw is unaffected. */
  /* Split from beatSlotTuplet so the vocabulary grid in the lesson setup
     can engrave a beat that is not the one on screen. */
  function beatSlotTupletIn(slots, compound) {
    if (compound) {
      if (slots === 2) return { count: 2, inSpaceOf: 3, show: 2 };
      if (slots === 4) return { count: 4, inSpaceOf: 6, show: 2 };
      return null;
    }
    if (slots === 3) return { count: 3, inSpaceOf: 2, show: 3 };
    if (slots === 6) return { count: 6, inSpaceOf: 4, show: 3 };
    return null;
  }

  function beatSlotTuplet(slots, state = null) {
    return beatSlotTupletIn(slots, isCompoundTime(state));
  }

  /* A run tuplet is always three in the time of two at its top level - a
     quarter-note triplet, a half-note triplet - however finely it is then
     subdivided, so the bracket always reads 3. */
  function runSlotTuplet() { return { count: 3, inSpaceOf: 2, show: 3 }; }

  function getRunTuplets(state = null) {
    const s = state || getActiveState();
    if (!s.tuplets) s.tuplets = {};
    return s.tuplets;
  }

  /* The run tuplet covering this beat, if any, with the beat it starts on. */
  function findTupletRun(beatIndex, state = null) {
    const s = state || getActiveState();
    if (!s.tuplets) return null;
    for (let start = beatIndex; start >= 0 && start > beatIndex - 8; start--) {
      const t = s.tuplets[start];
      if (t && t.beats && beatIndex < start + t.beats) {
        return { start: start, beats: t.beats, slots: t.slots };
      }
    }
    return null;
  }

  function isTupletRunStart(beatIndex, state = null) {
    const run = findTupletRun(beatIndex, state);
    return !!run && run.start === beatIndex;
  }

  /* Beats swallowed by a run tuplet have no circles of their own - the run
     draws them all - so they are skipped when the staff is laid out. */
  function isTupletRunContinuation(beatIndex, state = null) {
    const run = findTupletRun(beatIndex, state);
    return !!run && run.start !== beatIndex;
  }

  function getBeatSubdivision(beatIndex, state = null) {
    const s = state || getActiveState();
    const stored = s.beatSubdivisions && s.beatSubdivisions[beatIndex];
    return stored || defaultSubdivision(s);
  }

  function setBeatSubdivision(beatIndex, subdivision, state = null) {
    const s = state || getActiveState();
    if (!s.beatSubdivisions) s.beatSubdivisions = {};
    if (subdivision === defaultSubdivision(s)) {
      delete s.beatSubdivisions[beatIndex];
    } else {
      s.beatSubdivisions[beatIndex] = subdivision;
    }
  }

  /* How many circles this beat shows, and what each one is worth. For a
     beat inside a run tuplet the answer belongs to the run, so callers
     that care about runs should ask findTupletRun first. */
  function getBeatSlotTicks(beatIndex, state = null) {
    const s = state || getActiveState();
    return beatTicks(s) / getBeatSubdivision(beatIndex, s);
  }

  function getBeatStartIndex(targetBeat, state = null) {
    let idx = 0;
    for (let b = 0; b < targetBeat; b++) {
      idx += getBeatSubdivision(b, state);
    }
    return idx;
  }

  function getTotalBeatsFromWords(viewWords, state = null) {
    if (!viewWords || viewWords.length === 0) return 0;
    const targetState = state || poetryState;
    let count = 0;
    let b = 0;
    while (count < viewWords.length) {
      count += getBeatSubdivision(b, targetState);
      b++;
    }
    return b;
  }

  // Convert current poetry view to 12-grid canonical
  function toCanonical12(viewWords, state = null) {
    const targetState = state || poetryState;
    const totalBeats = Math.max(1, getTotalBeatsFromWords(viewWords, targetState));
    const out = new Array(totalBeats * 12).fill('-');
    let wordIdx = 0;
    for (let b = 0; b < totalBeats; b++) {
      const S = getBeatSubdivision(b, targetState);
      const win = 12 / S;
      for (let s = 0; s < S; s++) {
        const token = (viewWords[wordIdx] !== undefined) ? viewWords[wordIdx] : '-';
        wordIdx++;
        const wStart = b * 12 + s * win;
        out[wStart] = (token && token !== '-') ? token : '-';
        for (let t = 1; t < win; t++) {
          out[wStart + t] = '-';
        }
      }
    }
    return out;
  }

  // Project 12-grid canonical to current per-beat subdivision view
  function fromCanonical12(canon12, state = null) {
    const targetState = state || poetryState;
    const totalBeats = Math.max(1, Math.ceil((canon12.length || 0) / 12));
    const out = [];

    for (let b = 0; b < totalBeats; b++) {
      const S = getBeatSubdivision(b, targetState);
      const win = 12 / S;
      for (let s = 0; s < S; s++) {
        const wStart = b * 12 + s * win;
        const wEnd = wStart + win;
        let placed = '-';
        for (let k = wStart; k < wEnd && k < canon12.length; k++) {
          const tok = canon12[k];
          if (tok && tok !== '-') { placed = tok; break; }
        }
        out.push(placed);
      }
    }
    return out;
  }

  // Merge an edited view into canonical 12-grid, beat-by-beat
  function mergeViewIntoCanonical(canon12, viewWords, state = null) {
    const targetState = state || poetryState;
    const totalBeats = Math.max(Math.ceil((canon12.length || 0) / 12), getTotalBeatsFromWords(viewWords, targetState));
    const next = canon12.slice();
    while (next.length < totalBeats * 12) next.push('-');

    let wordIdx = 0;
    for (let b = 0; b < totalBeats; b++) {
      const S = getBeatSubdivision(b, targetState);
      const win = 12 / S;

      const editedBeat = [];
      for (let s = 0; s < S; s++) {
        editedBeat.push(viewWords[wordIdx++] ?? '-');
      }

      const derivedBeat = [];
      for (let s = 0; s < S; s++) {
        const wStart = b * 12 + s * win;
        const wEnd = wStart + win;
        let placed = '-';
        for (let k = wStart; k < wEnd && k < next.length; k++) {
          const tok = next[k];
          if (tok && tok !== '-') { placed = tok; break; }
        }
        derivedBeat.push(placed);
      }

      let equal = true;
      for (let s = 0; s < S; s++) {
        if ((editedBeat[s] || '-') !== (derivedBeat[s] || '-')) { equal = false; break; }
      }
      if (!equal) {
        for (let s = 0; s < S; s++) {
          const token = editedBeat[s] && editedBeat[s] !== '' ? editedBeat[s] : '-';
          const wStart = b * 12 + s * win;
          const wEnd = wStart + win;
          for (let k = wStart; k < wEnd && k < next.length; k++) next[k] = '-';
          if (token !== '-') next[wStart] = token;
        }
      }
    }
    return next;
  }

  function sanitizeWordsArray(arr) {
    return arr.map(w => (w === undefined || w === null || w === '' ? '-' : w));
  }

  function getLastWordBeat(viewWords, state = null) {
    if (!viewWords || viewWords.length === 0) return -1;
    const targetState = state || poetryState;
    let lastWordIndex = -1;
    for (let i = viewWords.length - 1; i >= 0; i--) {
      const w = viewWords[i];
      if (w && w !== '-' && w.trim() !== '') {
        lastWordIndex = i;
        break;
      }
    }
    if (lastWordIndex === -1) return -1;

    let count = 0;
    let b = 0;
    while (count <= lastWordIndex) {
      count += getBeatSubdivision(b, targetState);
      b++;
    }
    return Math.max(0, b - 1);
  }

  function trimExcessTrailingMeasures() {
    const config = getLayoutConfig();
    const beatsPerMeasure = config.beatsPerMeasure;
    
    // Find the last beat containing an actual word
    const lastWordBeat = getLastWordBeat(poetryState.words, poetryState);
    
    if (lastWordBeat === -1) {
      // Empty piece: keep exactly 1 measure
      const minBeats = poetryState.hasPickupMeasure ? (1 + beatsPerMeasure) : beatsPerMeasure;
      if (poetryState.canonical12.length > minBeats * 12) {
        poetryState.canonical12.length = minBeats * 12;
      }
      while (poetryState.canonical12.length < minBeats * 12) {
        poetryState.canonical12.push('-');
      }
      poetryState.words = fromCanonical12(poetryState.canonical12, poetryState);
      return;
    }

    let lastWordMeasure = 0;
    if (poetryState.hasPickupMeasure) {
      lastWordMeasure = (lastWordBeat === 0) ? 0 : Math.floor((lastWordBeat - 1) / beatsPerMeasure) + 1;
    } else {
      lastWordMeasure = Math.floor(lastWordBeat / beatsPerMeasure);
    }

    // Cap at no more than 1 full measure of rest after the last word's measure
    const maxAllowedMeasures = lastWordMeasure + 1 + 1;
    
    let maxAllowedBeats = 0;
    if (poetryState.hasPickupMeasure) {
      maxAllowedBeats = 1 + (maxAllowedMeasures - 1) * beatsPerMeasure;
    } else {
      maxAllowedBeats = maxAllowedMeasures * beatsPerMeasure;
    }

    const currentTotalBeats = Math.ceil((poetryState.canonical12.length || 0) / 12);
    if (currentTotalBeats > maxAllowedBeats) {
      poetryState.canonical12.length = maxAllowedBeats * 12;
      for (const k in poetryState.beatSubdivisions) {
        if (parseInt(k, 10) >= maxAllowedBeats) delete poetryState.beatSubdivisions[k];
      }
      for (const k in poetryState.linkedBeats) {
        if (parseInt(k, 10) >= maxAllowedBeats - 1) delete poetryState.linkedBeats[k];
      }
      poetryState.words = fromCanonical12(poetryState.canonical12, poetryState);
    }
  }

  function syncRawLyricsFromWords() {
    const displayedWords = poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
    if (!poetryState.rawLyrics || poetryState.rawLyrics.length <= displayedWords.length) {
      poetryState.rawLyrics = displayedWords.slice();
    } else {
      const tail = poetryState.rawLyrics.slice(displayedWords.length);
      poetryState.rawLyrics = displayedWords.concat(tail);
    }
  }

  function commitAndUpdateView() {
    poetryState.words = sanitizeWordsArray(poetryState.words);
    poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words, poetryState);
    poetryState.words = fromCanonical12(poetryState.canonical12, poetryState);
    trimExcessTrailingMeasures();
    render();
  }

  // Rhythm and Poetry are independent. Nothing crosses between them.

  /* ==================================================================
     NOTATION ENGINE

     Rhythms are engraved from the beat pattern rather than picked from
     a set of fixed images, so a notehead always lands on the exact
     centre of the circle that triggers it and the word sung on it, and
     any duration can be written - including ones we have no picture for.

     Glyph outlines are from Leland (Steinberg, SIL Open Font Licence),
     stored as plain SVG paths. Each glyph's box is the true extent of its
     curves, and 360 of those units make one staff space.
     ================================================================== */

  const GLYPHS = {
    noteheadWhole: { w: 537, h: 389, x0: 0, y0: -196,
      d: 'M 269 -196 C 71 -196 0 -95 0 -1 C 0 92 71 193 269 193 C 468 193 537 92 537 -1 C 537 -95 468 -196 269 -196 Z M 343 138 C 325 144 302 147 281 147 C 240 147 213 135 194 99 C 176 63 150 -29 148 -68 C 145 -107 160 -130 194 -141 C 212 -147 235 -150 256 -150 C 297 -150 323 -141 343 -102 C 363 -63 389 29 389 65 C 389 102 377 128 343 138 Z' },
    noteheadHalf: { w: 468, h: 382, x0: 0, y0: -190,
      d: 'M 307 -190 C 167 -190 0 -73 0 60 C 0 122 45 192 161 192 C 311 192 468 69 468 -58 C 468 -143 396 -190 307 -190 Z M 268 63 C 264 66 158 124 108 124 C 60 124 50 85 50 72 C 50 12 194 -59 200 -62 C 206 -65 308 -122 360 -122 C 395 -122 418 -102 418 -71 C 418 -9 272 60 268 63 Z' },
    noteheadBlack: { w: 468, h: 382, x0: 0, y0: -190,
      d: 'M 0 60 C 0 122 45 192 161 192 C 311 192 468 69 468 -58 C 468 -143 396 -190 307 -190 C 167 -190 0 -72 0 60 Z' },
    augmentationDot: { w: 144, h: 144, x0: 0, y0: -72,
      d: 'M 0 -0 C 0 40 32 72 72 72 C 112 72 144 40 144 -0 C 144 -40 112 -72 72 -72 C 32 -72 0 -40 0 -0 Z' },
    flag8thUp: { w: 416, h: 1193, x0: 0, y0: -17,
      d: 'M 0 327 C 0 331 1 338 12 343 C 73 363 197 441 291 600 C 317 645 359 707 359 827 C 359 930 331 1037 294 1140 C 291 1149 288 1156 289 1162 C 289 1168 291 1172 297 1175 C 300 1176 302 1176 304 1176 C 314 1176 321 1171 327 1161 C 395 1041 418 888 416 798 C 416 791 416 786 416 780 C 409 595 302 458 302 458 C 307 458 170 281 131 220 C 78 138 53 56 50 50 C 49 46 36 -6 36 -6 C 35 -12 27 -17 19 -17 C 9 -17 0 -9 0 1 Z' },
    flag16thUp: { w: 402, h: 1198, x0: 0, y0: -17,
      d: 'M 301 681 C 262 631 219 585 148 514 C 92 458 66 409 56 372 C 55 364 53 354 52 343 C 125 343 219 442 271 510 C 327 583 340 641 340 696 C 340 710 338 724 337 739 C 325 716 312 697 301 681 Z M 0 549 C 0 553 12 559 22 563 C 59 576 171 648 258 776 C 307 850 318 901 318 950 C 318 959 318 966 317 975 C 317 1009 307 1083 285 1140 C 284 1148 279 1156 279 1164 C 279 1169 282 1175 289 1179 C 292 1181 294 1181 297 1181 C 307 1181 312 1169 318 1161 C 344 1120 382 1043 382 962 C 382 920 379 886 374 855 C 389 802 402 749 402 678 C 402 603 382 536 333 471 C 265 382 192 307 137 228 C 82 148 42 -0 42 -0 C 39 -10 37 -17 22 -17 C 4 -17 0 -10 0 -0 Z' },
    restWhole: { w: 468, h: 196, x0: 0, y0: -7,
      d: 'M 20 -7 C 9 -7 0 1 0 13 L 0 168 C 0 180 9 189 20 189 L 448 189 C 459 189 468 180 468 168 L 468 13 C 468 1 459 -7 448 -7 Z' },
    restHalf: { w: 468, h: 196, x0: 0, y0: -190,
      d: 'M 0 -14 C 0 6 0 6 20 6 L 448 6 C 468 6 468 6 468 -14 L 468 -170 C 468 -190 468 -190 448 -190 L 20 -190 C 0 -190 0 -190 0 -170 Z' },
    restQuarter: { w: 338, h: 1054, x0: 0, y0: -577,
      d: 'M 331 239 C 330 238 327 235 323 229 L 157 24 C 156 23 154 19 154 16 C 154 12 156 6 157 3 L 304 -219 C 305 -222 307 -226 307 -229 L 307 -242 C 307 -246 305 -251 302 -253 L 69 -569 C 69 -569 63 -577 55 -577 C 50 -577 48 -576 43 -573 C 37 -569 36 -563 36 -559 C 36 -550 40 -543 40 -543 L 150 -393 C 153 -389 154 -383 154 -376 C 154 -370 153 -363 150 -359 L 4 -137 C 3 -134 1 -128 1 -125 L 1 -112 C 1 -108 3 -104 6 -101 L 167 99 C 161 98 148 95 131 95 C 107 95 75 101 49 124 C 17 153 0 193 0 229 C 0 249 4 269 16 285 C 46 331 154 468 154 468 C 154 468 161 477 171 477 C 174 477 177 477 180 474 C 187 468 190 462 190 456 C 190 451 187 446 186 444 C 181 436 135 353 135 353 C 135 353 125 333 125 307 C 125 288 131 265 150 246 C 167 229 187 223 206 223 C 225 223 240 229 252 236 L 308 272 C 308 272 314 275 320 275 C 325 275 330 274 334 268 C 337 262 338 259 338 255 C 338 251 337 248 334 243 Z' },
    rest8th: { w: 397, h: 661, x0: 0, y0: -294,
      d: 'M 384 -292 C 383 -292 380 -294 379 -294 C 370 -294 363 -289 360 -282 C 354 -274 310 -189 245 -141 C 226 -127 203 -117 180 -112 C 196 -131 206 -154 206 -181 C 206 -238 160 -284 104 -284 C 46 -284 0 -238 0 -181 C 0 -137 27 -101 65 -85 C 86 -75 115 -68 144 -68 C 186 -68 230 -81 269 -109 C 287 -122 304 -140 320 -157 L 156 356 L 194 367 L 396 -268 C 397 -269 397 -272 397 -275 C 397 -282 393 -288 384 -292 Z' },
    rest16th: { w: 494, h: 1024, x0: 1, y0: -294,
      d: 'M 494 -268 C 495 -271 495 -272 495 -275 C 495 -282 491 -289 482 -292 C 480 -294 477 -294 475 -294 C 467 -294 461 -289 456 -282 C 422 -213 364 -135 285 -115 C 302 -135 310 -158 310 -184 C 310 -240 259 -284 203 -284 C 145 -281 104 -233 104 -177 C 105 -134 134 -98 171 -84 C 197 -72 225 -69 252 -69 C 324 -72 380 -108 423 -164 L 423 -164 L 359 65 C 338 132 256 226 183 245 C 199 225 207 200 207 176 C 207 118 158 76 102 76 C 45 76 1 125 1 183 C 1 226 32 262 69 275 C 96 287 121 289 150 289 C 222 287 278 251 321 194 L 174 720 L 213 730 Z' },
    timeSig2: { w: 521, h: 703, x0: 22, y0: -353,
      d: 'M 492 56 C 481 88 452 192 382 192 C 288 192 268 134 190 134 C 179 134 167 135 153 138 C 153 138 189 84 341 36 C 494 -12 533 -86 533 -173 C 533 -233 505 -353 288 -353 C 71 -353 30 -222 30 -156 C 30 -96 79 -49 138 -49 C 197 -49 245 -96 245 -156 C 245 -196 216 -240 179 -255 C 174 -256 168 -264 168 -271 C 168 -279 176 -289 202 -297 C 209 -300 229 -304 251 -304 C 271 -304 294 -300 311 -288 C 338 -271 348 -245 348 -180 C 348 -12 148 24 65 150 C 65 150 22 210 22 278 C 22 346 56 350 73 350 C 96 350 121 331 121 305 C 121 300 120 294 117 287 C 108 266 105 251 105 239 C 105 235 105 230 107 226 C 108 217 120 203 154 203 C 196 203 212 252 238 289 C 264 327 304 350 350 350 C 396 350 458 317 484 264 C 510 210 543 102 543 63 C 543 45 531 36 518 36 C 508 36 498 42 492 56 Z' },
    timeSig4: { w: 616, h: 716, x0: 20, y0: -359,
      d: 'M 300 183 L 300 289 L 180 289 C 170 289 160 298 160 310 L 160 337 C 160 348 170 357 180 357 L 616 357 C 628 357 636 348 636 337 L 636 310 C 636 298 628 289 616 289 L 487 289 L 487 183 L 616 183 C 628 183 636 173 636 161 L 636 134 C 636 124 628 114 616 114 L 487 114 L 487 -115 C 487 -124 482 -131 477 -134 L 459 -143 C 456 -144 455 -144 452 -144 C 451 -144 451 -144 449 -144 C 445 -144 439 -143 436 -140 L 305 -20 C 301 -16 300 -10 300 -4 L 300 114 L 132 114 C 132 114 294 -59 464 -287 C 469 -294 471 -301 471 -307 C 471 -314 468 -320 467 -321 L 435 -353 C 431 -356 426 -359 420 -359 C 412 -359 217 -359 206 -359 C 196 -359 189 -350 187 -341 C 187 -341 180 -235 143 -118 C 105 -1 62 71 24 124 C 24 124 20 131 20 140 C 20 143 20 145 22 148 C 26 158 36 174 36 174 C 36 174 39 183 52 183 Z' },
    timeSig6: { w: 535, h: 704, x0: 22, y0: -353,
      d: 'M 356 -69 C 268 -69 236 -43 216 -22 C 212 -52 209 -75 209 -98 C 209 -121 212 -141 216 -167 C 225 -220 261 -287 338 -287 C 374 -287 396 -275 410 -259 C 380 -246 356 -207 356 -174 C 356 -122 396 -82 448 -82 C 500 -82 541 -122 541 -174 L 541 -177 C 541 -177 541 -177 541 -179 C 541 -192 539 -213 533 -225 C 514 -276 454 -353 310 -353 C 180 -353 86 -229 58 -163 C 43 -128 22 -58 22 23 C 22 111 46 210 131 285 C 215 348 268 351 318 351 C 369 351 557 292 557 125 C 557 -16 446 -69 356 -69 Z M 302 291 C 255 291 216 226 216 145 C 216 65 255 -1 302 -1 C 350 -1 390 65 390 145 C 390 226 350 291 302 291 Z' },
    timeSig3: { w: 502, h: 702, x0: 22, y0: -351,
      d: 'M 392 -23 C 507 -68 514 -143 514 -168 C 514 -171 514 -174 514 -176 C 514 -189 510 -351 262 -351 C 14 -351 22 -176 22 -176 L 23 -176 L 22 -173 C 22 -121 63 -81 115 -81 C 167 -81 207 -121 207 -173 C 207 -215 176 -255 135 -264 C 137 -265 138 -266 140 -268 C 160 -282 187 -289 215 -289 C 275 -289 340 -253 340 -176 C 340 -85 272 -72 255 -69 C 238 -66 157 -60 140 -60 C 122 -60 121 -40 121 -40 L 121 -12 C 121 -12 124 4 140 6 C 164 7 197 7 243 14 C 307 23 340 66 340 167 C 340 264 275 289 215 289 C 174 289 137 278 121 266 C 168 264 207 222 207 174 C 207 122 167 81 115 81 C 63 81 22 122 22 174 C 22 174 22 177 22 180 C 22 199 26 251 78 298 C 134 350 204 351 236 351 C 374 351 524 304 524 147 C 524 42 452 -3 389 -23 Z' },
  };

  const FONT_UNITS = 360;           // outline units in one staff space

  /* One staff space in px, for a given note-box height. Constant for the
     whole score - engraving varies the spacing, never the note size. */
  const SS_OF_BOX  = 0.285;
  const NOTE_Y_SS  = 0.70;          // notehead centre, measured up from the floor
  const STEM_SS    = 2.62;          // stem length, in staff spaces
  const BEAM_SS    = 0.72;          // beam thickness
  const BEAMGAP_SS = 0.22;          // gap between beams
  const STEMW_SS   = 0.163;         // stem thickness

  /* Horizontal room a note needs before the next one, in staff spaces.
     A flagged note needs extra room for the flag to curl into. */
  const ROOM_PLAIN   = 1.45;
  const ROOM_FLAGGED = 3.05;

  /* Where each rest glyph's bounding box sits, in staff spaces above the
     note line - rests have no stem, so they need placing explicitly. */
  const REST_CENTRE = {
    restWhole: -1.30, restHalf: -0.90, restQuarter: -1.00,
    rest8th: -0.90, rest16th: -1.00
  };

  function staffSpaceFor(boxH) { return (boxH || 84) * SS_OF_BOX; }

  /* ---- duration model ----
     Durations are counted in the app's ticks, 24 to a quarter note, and
     written durations are what actually gets printed: inside a tuplet a
     note is written as the value it stands in for, so a triplet eighth -
     eight ticks long - is drawn as an eighth and bracketed. */
  const NOTE_VALUES = [
    { ticks: 96, head: 'whole', stem: false, beams: 0, dots: 0, name: 'whole' },
    { ticks: 72, head: 'half',  stem: true,  beams: 0, dots: 1, name: 'dotted half' },
    { ticks: 48, head: 'half',  stem: true,  beams: 0, dots: 0, name: 'half' },
    { ticks: 36, head: 'black', stem: true,  beams: 0, dots: 1, name: 'dotted quarter' },
    { ticks: 24, head: 'black', stem: true,  beams: 0, dots: 0, name: 'quarter' },
    { ticks: 18, head: 'black', stem: true,  beams: 1, dots: 1, name: 'dotted eighth' },
    { ticks: 12, head: 'black', stem: true,  beams: 1, dots: 0, name: 'eighth' },
    { ticks:  9, head: 'black', stem: true,  beams: 2, dots: 1, name: 'dotted sixteenth' },
    { ticks:  6, head: 'black', stem: true,  beams: 2, dots: 0, name: 'sixteenth' }
  ];
  const REST_VALUES = [
    { ticks: 96, glyph: 'restWhole',   dots: 0, name: 'whole rest' },
    { ticks: 72, glyph: 'restHalf',    dots: 1, name: 'dotted half rest' },
    { ticks: 48, glyph: 'restHalf',    dots: 0, name: 'half rest' },
    { ticks: 36, glyph: 'restQuarter', dots: 1, name: 'dotted quarter rest' },
    { ticks: 24, glyph: 'restQuarter', dots: 0, name: 'quarter rest' },
    { ticks: 18, glyph: 'rest8th',     dots: 1, name: 'dotted eighth rest' },
    { ticks: 12, glyph: 'rest8th',     dots: 0, name: 'eighth rest' },
    { ticks:  9, glyph: 'rest16th',    dots: 1, name: 'dotted sixteenth rest' },
    { ticks:  6, glyph: 'rest16th',    dots: 0, name: 'sixteenth rest' }
  ];

  function splitDuration(ticks, table) {
    const out = [];
    let left = ticks;
    while (left > 0.0001) {
      const v = table.find(x => x.ticks <= left + 0.0001);
      if (!v) break;
      out.push(v);
      left -= v.ticks;
    }
    return out;
  }

  /* A slot map describes everything the engraver needs about one beat, or
     one run of beats read together:

       roles      note / hold / rest, one per circle
       slotTicks  how long each circle lasts
       slotBeat   which beat each circle belongs to, so beams break on the
                  beat rather than running through it
       tuplets    circle ranges that are tuplets, with the ratio between
                  what is played and what is written

     Because the ticks are carried per slot rather than assumed, one run
     can mix divisions freely - a half note, then a beat of sixteenths. */

  /* Where each circle starts, and the whole span's length. */
  function slotStarts(slotTicks) {
    const starts = [];
    let t = 0;
    for (let i = 0; i < slotTicks.length; i++) { starts.push(t); t += slotTicks[i]; }
    return { starts: starts, total: t };
  }

  /* A stretch marked as a tuplet only really is one when more than one note
     falls inside it. Three circles holding a single sustained note simply
     last four beats, and that is a whole note - not a triplet of anything -
     so the ratio and the bracket both drop away. */
  function tupletIsSounding(map, tp, starts) {
    const from = starts[tp.from];
    const to = starts[tp.to] + map.slotTicks[tp.to];
    let onsets = 0;
    for (let i = tp.from; i <= tp.to; i++) if (map.roles[i] === 'note') onsets++;
    if (onsets >= 2) return true;
    if (onsets === 0) return false;                 // a rest across the whole span
    return map.roles[tp.from] !== 'note' ? true : false;
  }

  function activeTuplets(map, starts) {
    return (map.tuplets || []).filter(tp => tupletIsSounding(map, tp, starts));
  }

  /* Split the span into stretches that are written at a single ratio, so a
     note running out of a triplet and into plain beats is tied at the
     boundary instead of being written as something unplayable. */
  function writtenRegions(map, starts, total) {
    const regions = [];
    const tups = activeTuplets(map, starts).slice().sort((a, b) => a.from - b.from);
    let cursor = 0;
    for (const tp of tups) {
      const from = starts[tp.from];
      const to = starts[tp.to] + map.slotTicks[tp.to];
      if (from > cursor) regions.push({ from: cursor, to: from, ratio: 1, tuplet: null });
      regions.push({ from: from, to: to, ratio: tp.count / tp.inSpaceOf, tuplet: tp });
      cursor = to;
    }
    if (cursor < total) regions.push({ from: cursor, to: total, ratio: 1, tuplet: null });
    if (!regions.length) regions.push({ from: 0, to: total, ratio: 1, tuplet: null });
    return regions;
  }

  function planNotation(map) {
    const roles = map.roles;
    const n = roles.length;
    if (!n) return [];
    const { starts, total } = slotStarts(map.slotTicks);
    const regions = writtenRegions(map, starts, total);

    const nearestSlot = tick => {
      let best = 0, bestD = Infinity;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(starts[i] - tick);
        if (d < bestD) { bestD = d; best = i; }
      }
      return best;
    };

    /* a note runs until the next note starts; silence runs until then too */
    const events = [];
    let i = 0;
    while (i < n) {
      if (roles[i] === 'note') {
        let j = i + 1;
        while (j < n && roles[j] === 'hold') j++;
        events.push({ type: 'note', from: starts[i], to: j < n ? starts[j] : total });
        i = j;
      } else {
        let j = i + 1;
        while (j < n && roles[j] !== 'note') j++;
        events.push({ type: 'rest', from: starts[i], to: j < n ? starts[j] : total });
        i = j;
      }
    }

    const items = [];
    for (const ev of events) {
      const table = ev.type === 'note' ? NOTE_VALUES : REST_VALUES;
      const pieces = [];
      for (const rg of regions) {
        const from = Math.max(ev.from, rg.from);
        const to = Math.min(ev.to, rg.to);
        if (to - from < 0.0001) continue;
        let at = from;
        for (const v of splitDuration((to - from) * rg.ratio, table)) {
          pieces.push({ value: v, tick: at });
          at += v.ticks / rg.ratio;
        }
      }
      pieces.forEach((p, k) => {
        const slot = nearestSlot(p.tick);
        items.push({
          kind: ev.type,
          value: p.value,
          slot: slot,
          tick: p.tick,
          tiedTo: ev.type === 'note' && k < pieces.length - 1,
          beat: map.slotBeat ? map.slotBeat[slot] : 0
        });
      });
    }

    /* beam runs of short notes that share a beat */
    let run = [];
    const closeRun = () => {
      if (run.length > 1) run.forEach(it => { it.beamed = true; });
      run = [];
    };
    for (const it of items) {
      if (it.kind === 'note' && it.value.beams > 0) {
        if (run.length && run[0].beat === it.beat) run.push(it);
        else { closeRun(); run = [it]; }
      } else closeRun();
    }
    closeRun();
    return items;
  }

  /* The narrowest slot width, in px, at which this span engraves cleanly. */
  function minSlotWidth(map, boxH) {
    const items = planNotation(map);
    let worst = ROOM_PLAIN;
    for (let i = 0; i < items.length; i++) {
      const it = items[i], next = items[i + 1];
      if (!next) continue;
      const gap = next.slot - it.slot;
      if (gap <= 0) continue;
      const flagged = it.kind === 'note' && it.value.beams > 0 && !it.beamed;
      worst = Math.max(worst, (flagged ? ROOM_FLAGGED : ROOM_PLAIN) / gap);
    }
    return Math.ceil(worst * staffSpaceFor(boxH));
  }

  const TUPLET_NUM_SCALE = 0.42;   // tuplet numeral size, against a notehead
  const TUPLET_GAP_SS   = 0.22;    // clearance between the number and the beam

  function tupletNumHalf(SS) {
    return (GLYPHS.timeSig3.h * (SS / FONT_UNITS) * TUPLET_NUM_SCALE) / 2;
  }

  /* The number is centred on the bracket line, which sits its own half-height
     plus a little clearance above the beam - so the room it needs above the
     stems is twice that half-height plus the gap. */
  function tupletNumTop(SS) {
    return 2 * tupletNumHalf(SS) + SS * TUPLET_GAP_SS + 1;
  }

  /* How much taller a note box has to be for a tuplet's number to sit above
     the notes without squashing them. Zero when nothing needs it. */
  function notationHeadroom(sizeH) {
    const SS = staffSpaceFor(sizeH);
    const stemTopAt = sizeH - SS * NOTE_Y_SS - STEM_SS * SS;
    return Math.max(0, Math.ceil(tupletNumTop(SS) - stemTopAt));
  }

  const nz = (n, p) => Number(Number(n).toFixed(p === undefined ? 2 : p));

  function glyphNode(name, x, y, k, cls, vScale) {
    const g = GLYPHS[name];
    if (!g) return '';
    const sy = vScale === undefined ? k : k * vScale;
    return '<path class="' + cls + '" transform="translate(' + nz(x) + ' ' + nz(y) + ') '
         + 'scale(' + nz(k, 5) + ' ' + nz(sy, 5) + ') '
         + 'translate(' + nz(-g.x0) + ' ' + nz(-g.y0) + ')" d="' + g.d + '"/>';
  }

  /**
   * Engrave one beat, or one linked run of beats, as a single SVG.
   *   roles         'note' | 'hold' | 'rest' for each circle in the run
   *   slotsPerBeat  2, 3 or 4
   *   slotCentres   x centre of each circle, in px, inside this svg
   *   width,height  the drawing box in px
   *   triplet       draw a bracket and a 3
   */
  function engraveRhythm(opts) {
    const boxH = opts.height || 84;
    const sizeH = opts.sizeHeight || boxH;   // note size, independent of headroom
    const cx = opts.slotCentres;
    const slotW = cx.length > 1 ? cx[1] - cx[0] : opts.width;
    const SS = staffSpaceFor(sizeH);
    const k = SS / FONT_UNITS;
    const noteY = boxH - SS * NOTE_Y_SS;
    const stemW = Math.max(1.8, SS * STEMW_SS);

    /* The notes keep their full length. It is the box that grows to hold a
       tuplet's number - see notationHeadroom - and because everything is
       measured up from the floor, the extra height lands above the notes
       exactly where the number goes. */
    let stemLen = STEM_SS * SS;
    if (noteY - stemLen < 2) stemLen = noteY - 2;
    const stemTop = noteY - stemLen;
    const beamT = BEAM_SS * SS;
    const beamGap = BEAMGAP_SS * SS;
    const dotGap = SS * 0.42;

    const parts = [];
    const items = planNotation(opts);
    const drawn = [];

    for (const it of items) {
      const x = cx[Math.min(Math.round(it.slot), cx.length - 1)];

      if (it.kind === 'rest') {
        const g = GLYPHS[it.value.glyph];
        const cyr = noteY + (REST_CENTRE[it.value.glyph] || -1) * SS;
        parts.push(glyphNode(it.value.glyph, x - (g.w * k) / 2, cyr - (g.h * k) / 2, k, 'rest'));
        for (let d = 0; d < it.value.dots; d++)
          parts.push(dotNode(x + (g.w * k) / 2 + dotGap + d * dotGap * 1.8, cyr, k));
        continue;
      }

      const v = it.value;
      const headName = v.head === 'whole' ? 'noteheadWhole'
                     : v.head === 'half'  ? 'noteheadHalf' : 'noteheadBlack';
      const w = GLYPHS[headName].w * k;
      const hx = x - w / 2;
      parts.push(glyphNode(headName, hx, noteY - (GLYPHS[headName].h * k) / 2, k, 'head'));
      it.x = x; it.headW = w;

      if (v.stem) {
        it.stemX = hx + w - stemW;
        parts.push('<rect class="stem" x="' + nz(it.stemX) + '" y="' + nz(stemTop)
                 + '" width="' + nz(stemW) + '" height="' + nz(stemLen) + '"/>');
      }
      if (v.beams > 0 && !it.beamed) {
        const fname = v.beams === 2 ? 'flag16thUp' : 'flag8thUp';
        const room = (noteY - SS * 0.35) - stemTop;
        const vs = Math.min(1, room / (GLYPHS[fname].h * k));
        parts.push(glyphNode(fname, it.stemX, stemTop, k, 'flag', vs));
      }
      for (let d = 0; d < v.dots; d++)
        parts.push(dotNode(x + w / 2 + dotGap + d * dotGap * 1.8, noteY - SS * 0.12, k));

      drawn.push(it);
    }

    /* ---- beams ---- */
    let grp = [];
    const drawBeams = () => {
      if (grp.length < 2) { grp = []; return; }
      parts.push(beamNode(grp[0].stemX, grp[grp.length - 1].stemX + stemW, stemTop, beamT));
      const need = grp.map(n => n.value.beams);
      /* six notes to a beat read in twos, so the second beam breaks between
         the pairs while the first beam runs the length of the group */
      const sub = it2 => (opts.slotSubGroup ? opts.slotSubGroup[it2.slot] : 0);
      const y2 = stemTop + beamT + beamGap;
      let i = 0;
      while (i < grp.length) {
        if (need[i] < 2) { i++; continue; }
        let j = i;
        while (j + 1 < grp.length && need[j + 1] >= 2 && sub(grp[j + 1]) === sub(grp[i])) j++;
        if (j > i) parts.push(beamNode(grp[i].stemX, grp[j].stemX + stemW, y2, beamT));
        else {
          const stub = Math.min(slotW * 0.45, SS * 1.1);
          const sx = i > 0 ? grp[i].stemX + stemW - stub : grp[i].stemX;
          parts.push(beamNode(sx, sx + stub, y2, beamT));
        }
        i = j + 1;
      }
      grp = [];
    };
    for (const it of drawn) {
      if (it.beamed) {
        if (grp.length && grp[0].beat === it.beat) grp.push(it);
        else { drawBeams(); grp = [it]; }
      } else drawBeams();
    }
    drawBeams();

    /* ---- ties ---- */
    for (let i = 0; i < drawn.length - 1; i++)
      if (drawn[i].tiedTo) parts.push(tieNode(drawn[i], drawn[i + 1], noteY + SS * 0.52, SS));

    /* A number over every stretch that really is a tuplet - and a bracket
       only when the notes are not already gathered under a single beam,
       since the beam itself already shows how far the group reaches. */
    const bracketStarts = slotStarts(opts.slotTicks).starts;
    for (const tp of activeTuplets(opts, bracketStarts)) {
      const inside = drawn.filter(it => it.slot >= tp.from && it.slot <= tp.to);
      const restsInside = items.some(it => it.kind === 'rest' && it.slot >= tp.from && it.slot <= tp.to);
      const oneBeam = inside.length > 1 && !restsInside &&
        inside.every(it => it.beamed && it.beat === inside[0].beat);
      const x0 = cx[Math.min(tp.from, cx.length - 1)];
      const x1 = cx[Math.min(tp.to, cx.length - 1)];
      parts.push(tupletNode(x0, x1, stemTop - (tupletNumHalf(SS) + SS * TUPLET_GAP_SS), SS, k, tp.show, !oneBeam));
    }

    /* fill and stroke are set as attributes as well as in the stylesheet:
       the image export serialises this node on its own, without the page's
       CSS, and the notation has to survive that. */
    return '<svg class="rhythm-svg" xmlns="http://www.w3.org/2000/svg" '
         + 'viewBox="0 0 ' + nz(opts.width) + ' ' + nz(boxH) + '" '
         + 'width="' + nz(opts.width) + '" height="' + nz(boxH) + '" '
         + 'fill="#000" stroke="none" aria-hidden="true" focusable="false">'
         + parts.join('') + '</svg>';
  }

  function dotNode(x, y, k) {
    const g = GLYPHS.augmentationDot;
    return glyphNode('augmentationDot', x, y - (g.h * k) / 2, k, 'dot');
  }
  function beamNode(x0, x1, y, t) {
    return '<rect class="beam" x="' + nz(x0) + '" y="' + nz(y)
         + '" width="' + nz(x1 - x0) + '" height="' + nz(t) + '"/>';
  }
  /* thin at the tips, thicker in the middle, arching below the notes */
  function tieNode(a, b, y, SS) {
    const x0 = a.x + a.headW * 0.30, x1 = b.x - b.headW * 0.30;
    if (x1 - x0 < SS * 0.5) return '';
    const mid = (x0 + x1) / 2;
    const depth = Math.max(SS * 0.34, Math.min(SS * 0.62, (x1 - x0) * 0.13));
    const thick = SS * 0.16;
    return '<path class="tie" d="M ' + nz(x0) + ' ' + nz(y)
         + ' Q ' + nz(mid) + ' ' + nz(y + depth) + ' ' + nz(x1) + ' ' + nz(y)
         + ' Q ' + nz(mid) + ' ' + nz(y + depth - thick) + ' ' + nz(x0) + ' ' + nz(y) + ' Z"/>';
  }
  function tupletNode(x0, x1, bracketY, SS, k, show, withBracket) {
    const g = GLYPHS['timeSig' + (show || 3)] || GLYPHS.timeSig3;
    const s = k * TUPLET_NUM_SCALE, w = g.w * s;
    const y = Math.max((g.h * s) / 2 + 1, bracketY);
    const mid = (x0 + x1) / 2, lw = Math.max(1.3, SS * 0.085);
    const num = glyphNode('timeSig' + (show || 3), mid - w / 2, y - (g.h * s) / 2, s, 'tuplet');
    if (!withBracket) return num;
    return '<path class="bracket" fill="none" stroke="#000" stroke-width="' + nz(lw)
         + '" d="M ' + nz(x0) + ' ' + nz(y + SS * 0.32) + ' L ' + nz(x0) + ' ' + nz(y)
         + ' L ' + nz(mid - w * 0.95) + ' ' + nz(y)
         + ' M ' + nz(mid + w * 0.95) + ' ' + nz(y) + ' L ' + nz(x1) + ' ' + nz(y)
         + ' L ' + nz(x1) + ' ' + nz(y + SS * 0.32) + '"/>' + num;
  }

  function getLayoutConfig() {
    const activeState = getActiveState();
    const screenWidth = window.innerWidth;
    const num = activeState.timeSignatureNumerator;
    const den = activeState.timeSignatureDenominator;
  
    const beatsPerMeasure = (den === 8) ? num / 3 : num;
  
    let measuresPerLine = 1;
    if (den === 4) { // Simple Time
      switch(num) {
        case 4:
          if (screenWidth >= 1500) measuresPerLine = 4;
          else if (screenWidth > 750) measuresPerLine = 2;
          break;
        case 3:
          if (screenWidth >= 1400) measuresPerLine = 4;
          else if (screenWidth > 600) measuresPerLine = 2;
          break;
        case 2:
          if (screenWidth >= 1200) measuresPerLine = 6;
          else if (screenWidth > 900) measuresPerLine = 4;
          else if (screenWidth > 700) measuresPerLine = 3;
          else if (screenWidth > 500) measuresPerLine = 2;
          break;
        case 5: case 6:
          if (screenWidth >= 1400) measuresPerLine = 2;
          break;
      }
    } else { // Compound Time
      if (num === 6) {
        if (screenWidth >= 1400) measuresPerLine = 4;
        else if (screenWidth > 600) measuresPerLine = 2;
      } else if (num === 9) {
        if (screenWidth >= 1300) measuresPerLine = 2;
      }
    }
    
    const autoMeasuresPerLine = measuresPerLine;
    if (view.measuresPerLine !== 'auto') {
      measuresPerLine = Math.max(1, parseInt(view.measuresPerLine, 10) || 1);
    }

    return {
      beatsPerMeasure,
      measuresPerLine,
      autoMeasuresPerLine
    };
  }

  // --- UI ELEMENT SETUP ---

  // --- UI ELEMENT SETUP & SONG STORAGE SYSTEM ---
  const STORAGE_KEY = 'rhythm_poetry_song_library_v3';
  const LEGACY_STORAGE_KEY = 'rhythm_poetry_song_library_v2';
  const ACTIVE_SONG_ID_KEY = 'rhythm_poetry_active_song_ids_v3';

  // Each side remembers its own song, so switching sides never reinterprets
  // (or overwrites) the piece you were working on.
  const currentSongIds = { rhythm: null, poetry: null };
  const currentSongTitles = { rhythm: '', poetry: '' };

  function getCurrentSongId() { return currentSongIds[currentMode]; }
  function setCurrentSongId(v) { currentSongIds[currentMode] = v; }
  function getCurrentSongTitle() { return currentSongTitles[currentMode]; }
  function setCurrentSongTitle(v) { currentSongTitles[currentMode] = v; }

  function persistActiveIds() {
    try { localStorage.setItem(ACTIVE_SONG_ID_KEY, JSON.stringify(currentSongIds)); } catch (e) {}
  }

  const stage = document.getElementById('stage');
  const toastEl = document.getElementById('toast');

  let toastTimer = null;
  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  /* ------------------------------------------------------------------
     Labels on a board

     `title` is a mouse tooltip and nothing else: it needs a cursor to
     rest on the control, so on a touch board every icon-only button here
     — the +/- pair, the link, the mute badge — is simply unexplained.
     Press and hold one and its label arrives in the toast instead.

     Coarse pointers only; a mouse already has the real tooltip. The
     click that follows the release is swallowed, so holding a button to
     read what it does never also does it. Registered in the capture
     phase, and early enough in the file to run ahead of the other
     document-level capture handlers for the same reason.
     ------------------------------------------------------------------ */
  (function labelsOnHold() {
    if (window.matchMedia('(pointer: fine)').matches) return;

    const HOLD_MS = 450;
    const SLOP = 10;          // a finger never holds perfectly still
    let timer = null, startX = 0, startY = 0, labelled = null;

    function cancel() {
      clearTimeout(timer);
      timer = null;
    }

    document.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      const el = e.target.closest('[title], [aria-label]');
      if (!el) return;
      const text = el.getAttribute('title') || el.getAttribute('aria-label');
      if (!text) return;
      startX = e.clientX;
      startY = e.clientY;
      cancel();
      timer = setTimeout(() => {
        timer = null;
        labelled = el;
        toast(text);
      }, HOLD_MS);
    }, true);

    document.addEventListener('pointermove', e => {
      if (!timer) return;
      if (Math.abs(e.clientX - startX) > SLOP || Math.abs(e.clientY - startY) > SLOP) cancel();
    }, true);

    document.addEventListener('pointerup', cancel, true);
    document.addEventListener('pointercancel', cancel, true);

    document.addEventListener('click', e => {
      if (labelled && (e.target === labelled || labelled.contains(e.target))) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      labelled = null;
    }, true);
  })();

  // --- sheets (modal dialogs) ---
  function openSheet(id) {
    if (isPlaying || isPaused) stopPlayback();
    closeAllPopovers();
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
  }
  function closeSheet(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  }
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeSheet(btn.getAttribute('data-close')));
  });
  /* Press and release both have to land on the backdrop itself, so a drag
     that starts inside the sheet and ends outside it doesn't dismiss the
     sheet. Pointer events rather than mouse events: a touch only gets
     mousedown/mouseup as compatibility events, and the browser withholds
     those whenever it decides the gesture was a scroll — which on a board
     is often enough that tapping the backdrop would stop closing sheets. */
  document.querySelectorAll('.sheet-backdrop').forEach(bd => {
    let downOnBackdrop = false;
    bd.addEventListener('pointerdown', e => { downOnBackdrop = (e.target === bd); });
    bd.addEventListener('pointerup', e => {
      if (e.target === bd && downOnBackdrop) bd.classList.remove('show');
      downOnBackdrop = false;
    });
    bd.addEventListener('pointercancel', () => { downOnBackdrop = false; });
  });

  // --- popovers ---
  const popoverPairs = [
    { btn: 'sound-btn', pop: 'sound-popover' },
    { btn: 'view-btn',  pop: 'view-popover'  }
  ];

  function closeAllPopovers() {
    popoverPairs.forEach(({ btn, pop }) => {
      const b = document.getElementById(btn), p = document.getElementById(pop);
      if (p) p.classList.remove('show');
      if (b) b.classList.remove('open');
    });
  }

  function positionPopover(btnEl, popEl) {
    if (window.innerWidth <= 720) return; // CSS pins it to the bottom on phones
    const r = btnEl.getBoundingClientRect();
    popEl.style.top = 'auto';
    popEl.style.bottom = (window.innerHeight - r.top + 10) + 'px';
    const width = popEl.offsetWidth || 290;
    let left = r.left + r.width / 2 - width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    popEl.style.left = left + 'px';
    popEl.style.right = 'auto';
  }

  popoverPairs.forEach(({ btn, pop }) => {
    const b = document.getElementById(btn), p = document.getElementById(pop);
    if (!b || !p) return;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = p.classList.contains('show');
      closeAllPopovers();
      if (!wasOpen) {
        p.classList.add('show');
        b.classList.add('open');
        positionPopover(b, p);
      }
    });
    p.addEventListener('click', e => e.stopPropagation());
  });

  document.addEventListener('click', () => closeAllPopovers());

  /*
   * Hover gauges: a quick-scrub alternative to the typed BPM editor and the
   * View popover, for a mouse or trackpad. The gauge is a separate floating
   * element (positioned above the button, never on top of it), so hovering
   * and dragging it never competes with the button's own click — clicking
   * the button always still opens the full editor/popover, exactly as
   * before. CSS hard-hides these on touch; this check keeps the JS from
   * bothering to show one there even if that ever drifted out of sync.
   */
  function canHoverPrecisely() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  // Unlike positionPopover(), this never skips positioning at narrow widths —
  // there's no phone-specific CSS fallback for these (they're hidden on touch
  // entirely), so a hover-capable but narrow browser window still needs it.
  function positionAbove(triggerEl, floatEl) {
    const r = triggerEl.getBoundingClientRect();
    floatEl.style.top = 'auto';
    floatEl.style.bottom = (window.innerHeight - r.top + 10) + 'px';
    const width = floatEl.offsetWidth || 250;
    let left = r.left + r.width / 2 - width / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - width - 10));
    floatEl.style.left = left + 'px';
    floatEl.style.right = 'auto';
  }

  function setupHoverGauge({ trigger, wrap, slider, label, getValue, format, onInput, onChange, isDisabled }) {
    if (!trigger || !wrap || !slider) return;

    let hideTimer = null;
    let dragging = false;

    function show() {
      if (!canHoverPrecisely()) return;
      if (isDisabled && isDisabled()) return;
      clearTimeout(hideTimer);
      const v = getValue();
      slider.value = v;
      if (label) label.textContent = format(v);
      wrap.classList.add('show');
      positionAbove(trigger, wrap);
    }

    function scheduleHide() {
      clearTimeout(hideTimer);
      // A short grace period so moving the mouse from the button up into the
      // gauge (there's a gap between them) doesn't make it vanish underneath
      // the cursor before it arrives.
      hideTimer = setTimeout(() => { if (!dragging) wrap.classList.remove('show'); }, 150);
    }

    /* A real mouse only. A smart board or a touch laptop can claim to hover
       precisely, and then a finger's tap would open the gauge on top of
       the tap's own action (the typed tempo, for one). */
    trigger.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') show(); });
    trigger.addEventListener('mouseleave', scheduleHide);
    wrap.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    wrap.addEventListener('mouseleave', scheduleHide);

    slider.addEventListener('pointerdown', () => { dragging = true; });
    window.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      scheduleHide();
    });

    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10);
      if (label) label.textContent = format(v);
      onInput(v);
    });
    if (onChange) {
      slider.addEventListener('change', () => onChange(parseInt(slider.value, 10)));
    }
  }

  // Base Controls
  const timeSignatureTopBtn = document.getElementById('time-signature-top-btn');
  const timeSignatureBottomBtn = document.getElementById('time-signature-bottom-btn');
  const timeSignatureButton = timeSignatureTopBtn ? timeSignatureTopBtn.parentElement : null;
  const bpmButton = document.getElementById('bpm-button');
  const bpmValueSpan = document.getElementById('bpm-value');
  const bpmUnitSpan = document.querySelector('.bpm-unit');
  const rhythmSystemsDropdown = document.getElementById('rhythm-systems-dropdown');
  const rhythmModeBtn = document.getElementById('rhythm-mode-btn');
  const poetryModeBtn = document.getElementById('poetry-mode-btn');

  function updateTimeSignatureDisplay() {
    const activeState = getActiveState();
    if (timeSignatureTopBtn) timeSignatureTopBtn.textContent = activeState.timeSignatureNumerator;
    if (timeSignatureBottomBtn) timeSignatureBottomBtn.textContent = activeState.timeSignatureDenominator;
    if (timeSignatureButton) timeSignatureButton.classList.toggle('compound', activeState.timeSignatureDenominator === 8);
    if (bpmValueSpan) bpmValueSpan.textContent = activeState.BPM;

    /* The meter and the tempo are the two controls a lesson never simply
       removes — you have to be able to read them to play the thing. When
       there is nothing left to choose they stop being buttons instead. */
    const meterFixed = meterIsFixed();
    if (timeSignatureButton) timeSignatureButton.classList.toggle('fixed', meterFixed);
    if (timeSignatureTopBtn) timeSignatureTopBtn.disabled = meterFixed;
    if (timeSignatureBottomBtn) {
      timeSignatureBottomBtn.disabled = meterFixed || denominatorsOffered().length < 2;
    }
    if (bpmButton) bpmButton.classList.toggle('fixed', tempoLocked());
  }

  // Song Library & Modal Elements
  const newSongBtn = document.getElementById('newSongBtn');
  const newSongBtnLabel = document.getElementById('newSongBtnLabel');
  const saveAsBtn = document.getElementById('saveAsBtn');
  const shelfBtn = document.getElementById('shelfBtn');
  const libraryBtn = document.getElementById('library-btn');
  const songChip = document.getElementById('song-chip');
  const songChipKicker = document.getElementById('song-chip-kicker');
  const songChipLabel = document.getElementById('song-chip-label');
  const nowEditingNote = document.getElementById('now-editing-note');
  const nowEditingTitle = document.getElementById('now-editing-title');
  const nowEditingBadge = document.getElementById('now-editing-badge');
  const importExportBtn = document.getElementById('importExportBtn');
  const copyVisualBtn = document.getElementById('copy-visual-btn');
  const textEditorBtn = document.getElementById('textEditorBtn');

  const newSongModal = document.getElementById('newSongModal');
  const newSongTitleInput = document.getElementById('newSongTitleInput');
  const confirmNewSongBtn = document.getElementById('confirmNewSongBtn');
  let titlePromptIntent = 'new'; // 'new' | 'saveAs'

  const librarySongList = document.getElementById('librarySongList');

  const generateShareLinkBtn = document.getElementById('generateShareLinkBtn');
  const shareLinkContainer = document.getElementById('shareLinkContainer');
  const shareLinkInput = document.getElementById('shareLinkInput');
  const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
  const copyShareLinkBtnText = document.getElementById('copyShareLinkBtnText');
  const shareLinkFeedback = document.getElementById('shareLinkFeedback');

  const selectAllExportBtn = document.getElementById('selectAllExportBtn');
  const deselectAllExportBtn = document.getElementById('deselectAllExportBtn');
  const exportSongList = document.getElementById('exportSongList');
  const exportFilenameInput = document.getElementById('exportFilenameInput');
  const confirmExportBtn = document.getElementById('confirmExportBtn');

  const uploadJsonBtn = document.getElementById('uploadJsonBtn');
  const jsonFileInput = document.getElementById('jsonFileInput');
  const uploadStatusMsg = document.getElementById('uploadStatusMsg');
  const resetAllDataBtn = document.getElementById('resetAllDataBtn');
  const resetStatusMsg = document.getElementById('resetStatusMsg');

  // --- fit the notation to whatever screen it lands on ---
  const MIN_SCALE = 0.2;
  const MAX_SCALE = 4;

  // How large "fit width" is allowed to grow on its own. Without a ceiling a
  // two-measure exercise on a wide screen leaps to an alarming size the moment
  // you split a line. Past this the user has to ask, with the slider.
  const FIT_MAX = 1.8;

  function effectiveScale(naturalW, availableW, naturalH, availableH) {
    if (view.sizeMode === 'fixed') return view.zoomPct / 100;
    fitScale = Math.min(FIT_MAX, availableW / naturalW);
    /* 'page' is only ever set by the Music Stand: the whole poem fits its pane
       both ways, so it stays on screen beside the ostinato. */
    if (view.sizeMode === 'page' && naturalH > 0 && availableH > 0) {
      fitScale = Math.min(fitScale, availableH / naturalH);
    }
    return fitScale * (view.zoomPct / 100);
  }

  function stageMetrics() {
    const styles = getComputedStyle(stage);
    return {
      availW: stage.clientWidth
        - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight) - 4,
      availH: stage.clientHeight
        - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom) - 4
    };
  }

  function applyZoom(preservedScroll) {
    if (!container || !stage) return;

    const previousScale = appliedScale;
    // A caller mid-render passes the scroll position it captured before
    // touching the DOM — see the comment on this in render(). Anyone calling
    // applyZoom() on its own (zoom controls, resize) just reads it live.
    const previousScrollTop  = preservedScroll ? preservedScroll.top  : stage.scrollTop;
    const previousScrollLeft = preservedScroll ? preservedScroll.left : stage.scrollLeft;

    const naturalW = container.offsetWidth;
    const naturalH = container.offsetHeight;
    if (!naturalW || !naturalH) return;

    const { availW, availH } = stageMetrics();

    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, effectiveScale(naturalW, availW, naturalH, availH)));
    appliedScale = scale;

    container.style.transform = scale === 1 ? 'none' : `scale(${scale})`;

    // A transform is painted, not laid out: the element keeps its natural
    // footprint, which leaves a phantom scrollbar when scaling down and
    // clipped content when scaling up. Correct the footprint with margins.
    // transform-origin is `top center`, so width spills evenly to both sides
    // and height spills downward only.
    const dx = (naturalW * (scale - 1)) / 2;
    const dy = naturalH * (scale - 1);
    container.style.marginLeft = dx + 'px';
    container.style.marginRight = dx + 'px';
    container.style.marginBottom = dy + 'px';

    // Keep the reader where they were. Editing a beat used to throw the page
    // back to the top (or the start), because rebuilding the staff collapses
    // the scroll extent before the new content is measured — see render().
    if (previousScale > 0) {
      if (previousScrollTop  > 0) stage.scrollTop  = previousScrollTop  * (scale / previousScale);
      if (previousScrollLeft > 0) stage.scrollLeft = previousScrollLeft * (scale / previousScale);
    }

    updateZoomReadout();
  }


  // --- SONG STORAGE & LIBRARY FUNCTIONS ---
  // Strip a record down to the one side it belongs to.
  function normalizeSong(song) {
    const side = songSide(song);
    const out = {
      id: song.id,
      title: song.title || 'Untitled',
      side: side,
      isCustom: song.isCustom !== undefined ? song.isCustom : !DEFAULT_SONGS[song.id],
      createdAt: song.createdAt || Date.now()
    };

    if (side === 'rhythm') {
      const r = song.rhythmState || {};
      out.rhythmState = {
        beats: Array.isArray(r.beats) && r.beats.length
          ? JSON.parse(JSON.stringify(r.beats))
          : Array.from({ length: 4 }, () => [true, true]),
        beatSubdivisions: r.beatSubdivisions ? { ...r.beatSubdivisions } : {},
        tuplets: r.tuplets ? JSON.parse(JSON.stringify(r.tuplets)) : {},
        tupletCells: r.tupletCells ? JSON.parse(JSON.stringify(r.tupletCells)) : {},
        linkedBeats: r.linkedBeats ? { ...r.linkedBeats } : {},
        lineOverrides: r.lineOverrides ? { ...r.lineOverrides } : {},
        hasPickupMeasure: !!r.hasPickupMeasure,
        BPM: r.BPM || 82,
        timeSignatureNumerator: r.timeSignatureNumerator || 4,
        timeSignatureDenominator: r.timeSignatureDenominator || 4,
        currentRhythmSystem: r.currentRhythmSystem || 'Simplified Kodály'
      };
    } else {
      const p = song.poetryState || {};
      const words = (p.words && p.words.length) ? p.words.slice()
        : (Array.isArray(song.words) ? song.words.slice() : ['Start', 'Here']);
      out.poetryState = {
        words: words,
        rawLyrics: (p.rawLyrics && p.rawLyrics.length)
          ? p.rawLyrics.slice()
          : words.filter(w => w && w !== '-' && String(w).trim() !== ''),
        beatSubdivisions: p.beatSubdivisions ? { ...p.beatSubdivisions } : {},
        linkedBeats: p.linkedBeats ? { ...p.linkedBeats } : {},
        syncopation: p.syncopation ? p.syncopation.slice() : [],
        syncopationStates: p.syncopationStates ? { ...p.syncopationStates } : {},
        lineOverrides: p.lineOverrides ? { ...p.lineOverrides } : {},
        hasPickupMeasure: !!p.hasPickupMeasure,
        BPM: p.BPM || 82,
        timeSignatureNumerator: p.timeSignatureNumerator || 4,
        timeSignatureDenominator: p.timeSignatureDenominator || 4
      };
    }
    // updatedAt, received, receivedAt, derivedFrom — see lib/evm-library.js
    EVM.carry(song, out);
    // the Layout Settings it was saved with (A PIECE'S OWN LAYOUT)
    if (song.layout && typeof song.layout === 'object') out.layout = JSON.parse(JSON.stringify(song.layout));
    return out;
  }

  /* ------------------------------------------------------------------
     WHAT A SONG IS, FOR MATCHING (lib/evm-library.js)

     songKey() is the song's content with its name, id and dates left out:
     two records with the same key are the same piece. It is how a link
     made before ids travelled finds the copy already here instead of
     filing another, and how a save tells whether anything changed.
     Null means blank — a blank song is never filed from a link or file.
     ------------------------------------------------------------------ */
  function songKey(song) {
    if (!song || typeof song !== 'object') return null;
    const n = normalizeSong(Object.assign({}, song, { id: song.id || 'x' }));
    return isBlankSong(n) ? null : rawSongKey(n);
  }

  // The same, blank or not — what a save compares.
  function rawSongKey(song) {
    const n = normalizeSong(Object.assign({}, song, { id: song.id || 'x' }));
    const st = n.side === 'rhythm' ? Object.assign({}, n.rhythmState) : Object.assign({}, n.poetryState);
    // The syllable system is how the reader likes to say it, not the rhythm.
    delete st.currentRhythmSystem;
    /* Poems are padded out to whole bars when they are drawn, and the
       padding was written back by older saves: trailing rests are not
       content. */
    if (Array.isArray(st.words)) {
      const w = st.words.slice();
      while (w.length && (w[w.length - 1] === '-' || w[w.length - 1] === '')) w.pop();
      st.words = w;
    }
    return n.side + ':' + EVM.stableStringify(st);
  }

  /* Blank: a poem with no words but the ones New starts with, or a rhythm
     with no note in it. */
  function isBlankSong(n) {
    if (n.side === 'rhythm') {
      const beats = (n.rhythmState && n.rhythmState.beats) || [];
      return !beats.some(b => Array.isArray(b) ? b.some(Boolean) : !!b);
    }
    const p = n.poetryState || {};
    const words = (p.rawLyrics && p.rawLyrics.length ? p.rawLyrics : (p.words || []))
      .filter(w => w && w !== '-' && String(w).trim() !== '');
    if (!words.length) return true;
    const said = words.join(' ').toLowerCase();
    return said === 'start here' || said === 'press the words to edit.';
  }

  /* Links made before ids travelled all say id 'shared' — a placeholder,
     not an id, so they are matched by content like any other old link. */
  const fileOpts = received => ({
    key: songKey,
    /* nor may anything arriving take a lesson's id, or it could overwrite
       a student's lesson work */
    reserved: id => isSandboxId(id) || id === 'shared' || String(id).indexOf('lesson_') === 0,
    newId: () => EVM.newId('song'),
    received: received
  });

  function isReceived(id) {
    const song = id ? getStoredLibrary()[id] : null;
    return !!(song && song.received);
  }

  function defaultLibrary() {
    const lib = {};
    Object.keys(DEFAULT_SONGS).forEach(id => {
      lib[id] = normalizeSong(JSON.parse(JSON.stringify(DEFAULT_SONGS[id])));
    });
    return lib;
  }

  function getStoredLibrary() {
    let library = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) library = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading library from localStorage:', e);
    }

    // First run on v3: carry songs over from the older two-sided format.
    // The v2 key is deliberately left in place so nothing is destroyed.
    if (!library || typeof library !== 'object' || Object.keys(library).length === 0) {
      let legacy = null;
      try {
        const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (raw) legacy = JSON.parse(raw);
      } catch (e) {}

      library = defaultLibrary();

      if (legacy && typeof legacy === 'object') {
        Object.keys(legacy).forEach(id => {
          const song = legacy[id];
          if (!song || typeof song !== 'object') return;
          const isDefault = DEFAULT_SONGS[id] !== undefined && !song.isCustom;
          if (isDefault) return;
          library[id] = normalizeSong({ ...song, id: id });
        });
      }
      saveStoredLibrary(library);
    }

    return library;
  }

  function saveStoredLibrary(library) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch (e) {
      console.error('Error saving library to localStorage:', e);
    }
  }

  function getSortedSongIds(library) {
    if (!library) return [];
    const allIds = Object.keys(library);
    const userIds = [];
    const defaultIds = [];

    allIds.forEach(id => {
      if (isSandboxId(id)) return;     // scratch work, never a library song
      const song = library[id];
      const isDefault = DEFAULT_SONGS[id] !== undefined && !song.isCustom;
      if (isDefault) {
        defaultIds.push(id);
      } else {
        userIds.push(id);
      }
    });

    // Sort user-created songs newest first
    userIds.sort((a, b) => {
      // a shared song is new here when it arrived, not when it was written
      const timeA = (library[a] && (library[a].receivedAt || library[a].createdAt)) || 0;
      const timeB = (library[b] && (library[b].receivedAt || library[b].createdAt)) || 0;
      return timeB - timeA;
    });

    // Keep default songs in standard defined order
    const defaultOrder = Object.keys(DEFAULT_SONGS);
    defaultIds.sort((a, b) => {
      const idxA = defaultOrder.indexOf(a);
      const idxB = defaultOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return 0;
    });

    return [...userIds, ...defaultIds];
  }

  function getSongIdsBySide(library, side) {
    const ids = getSortedSongIds(library).filter(id => songSide(library[id]) === side);
    /* Inside a lesson the library *is* the lesson: the teacher's exercises,
       in the order they set them, and nothing else the student has made. */
    if (lessonMeta) return lessonMeta.songIds.filter(id => ids.indexOf(id) !== -1);
    return ids;
  }

  // Snapshot only the side we are actually on.
  function buildSongSnapshot(id, title, side) {
    const snapshot = { id: id, title: title || 'Untitled', side: side };

    if (side === 'rhythm') {
      snapshot.rhythmState = {
        beats: JSON.parse(JSON.stringify(rhythmState.beats)),
        beatSubdivisions: { ...rhythmState.beatSubdivisions },
        tuplets: JSON.parse(JSON.stringify(rhythmState.tuplets || {})),
        tupletCells: JSON.parse(JSON.stringify(rhythmState.tupletCells || {})),
        linkedBeats: { ...rhythmState.linkedBeats },
        lineOverrides: { ...rhythmState.lineOverrides },
        hasPickupMeasure: !!rhythmState.hasPickupMeasure,
        BPM: rhythmState.BPM,
        timeSignatureNumerator: rhythmState.timeSignatureNumerator,
        timeSignatureDenominator: rhythmState.timeSignatureDenominator,
        currentRhythmSystem: rhythmState.currentRhythmSystem || 'Simplified Kodály'
      };
    } else {
      snapshot.poetryState = {
        words: poetryState.words.slice(),
        rawLyrics: poetryState.rawLyrics ? poetryState.rawLyrics.slice() : [],
        beatSubdivisions: { ...poetryState.beatSubdivisions },
        linkedBeats: { ...poetryState.linkedBeats },
        syncopation: poetryState.syncopation ? poetryState.syncopation.slice() : [],
        syncopationStates: poetryState.syncopationStates ? { ...poetryState.syncopationStates } : {},
        lineOverrides: { ...poetryState.lineOverrides },
        hasPickupMeasure: !!poetryState.hasPickupMeasure,
        BPM: poetryState.BPM,
        timeSignatureNumerator: poetryState.timeSignatureNumerator,
        timeSignatureDenominator: poetryState.timeSignatureDenominator
      };
    }
    return snapshot;
  }

  /* ------------------------------------------------------------------
     AUTO-SAVE

     A library song is sometimes a thing you are building, and sometimes
     a thing you are taking apart to show a class what is inside it. The
     toggle beside the song chip says which: with it on, every edit is
     written to the library as it always was; with it off, nothing on
     screen reaches storage until you say so, and the library keeps the
     version you opened.

     It is off when a library song is opened, on for a song you have just
     made or just saved, and it does not appear at all where the question
     does not arise: the sandbox keeps itself, a lesson always keeps a
     student's work, and the Music Stand is not editing a library.
     ------------------------------------------------------------------ */
  let autoSave = true;
  let savedFingerprint = null;
  /* The song on screen arrived from someone else (a link, a file from the
     Librarian): it is never saved into, and the toggle offers Save my
     copy instead of auto-save. */
  let openedReceived = false;
  // …and, if it came from a book taken off the Teacher Library shelf, which one
  let openedBook = '';

  /* Key order is not promised anywhere, so a plain stringify would call
     two identical songs different. */
  function stableStringify(value) {
    if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
    if (value && typeof value === 'object') {
      return '{' + Object.keys(value).sort()
        .map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
    }
    return JSON.stringify(value === undefined ? null : value);
  }

  function stateFingerprint() {
    const id = getCurrentSongId();
    if (!id) return null;
    const snap = buildSongSnapshot(id, getCurrentSongTitle() || 'Untitled', currentMode);
    return stableStringify(currentMode === 'rhythm' ? snap.rhythmState : snap.poetryState) +
      '|' + stableStringify(layout);
  }

  function markSaved() { savedFingerprint = stateFingerprint(); }

  /* Whether the toggle is anyone's business on this song. */
  function autoSaveOffered() {
    return !EMBEDDED && !lessonMeta && !isSandboxId(getCurrentSongId()) && !!getCurrentSongId();
  }
  function autoSaveOn() { return !autoSaveOffered() || (autoSave && !openedReceived); }

  function hasUnsavedChanges() {
    if (autoSaveOn() || savedFingerprint === null) return false;
    return stateFingerprint() !== savedFingerprint;
  }

  function saveCurrentSongToLibrary(force) {
    const id = getCurrentSongId();
    if (!id) return;
    /* Auto-save off: the edit stays on screen and nowhere else. Every
       save in the app comes through here, so this one gate covers the
       lot — including the ones on the way out of the page. */
    /* `force === true`, not merely truthy: this function is handed
       straight to addEventListener in places, and an Event object would
       otherwise force a save the user has switched off. */
    if (force !== true && !autoSaveOn()) return;
    const library = getStoredLibrary();
    const existing = library[id] || {};

    // Never let one side overwrite a song that belongs to the other.
    if (existing.id && songSide(existing) !== currentMode) return;
    /* A shared song stays exactly as it was sent — that is what lets a
       student always go back to it. Their changes become theirs only
       through Save my copy (Save as…). */
    if (existing.received) return;

    const snapshot = buildSongSnapshot(id, getCurrentSongTitle() || 'Untitled', currentMode);
    snapshot.isCustom = existing.isCustom !== undefined ? existing.isCustom : !DEFAULT_SONGS[id];
    snapshot.createdAt = existing.createdAt || Date.now();
    // updatedAt moves only if something actually changed
    if (!lessonMeta && !EMBEDDED) snapshot.layout = layoutSnapshot();
    EVM.stamp(snapshot, existing.id ? existing : null, r => rawSongKey(r) + '|' + pieceLayoutKey(r));
    if (!snapshot.layout) delete snapshot.layout;

    library[id] = snapshot;
    saveStoredLibrary(library);
    markSaved();
  }

  const autoSaveToggle = document.getElementById('autosave-toggle');
  const autoSaveLabel = document.getElementById('autosave-label');
  const ICON_SAVING = '<path d="M20 6 9 17l-5-5"/>';
  const ICON_NOT_SAVING = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  // Save my copy, on a shared song: two sheets, one on the other
  const ICON_COPY = '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>';

  function updateAutoSaveToggle() {
    if (!autoSaveToggle) return;
    const offered = autoSaveOffered();
    autoSaveToggle.hidden = !offered;
    if (!offered) return;
    const on = autoSaveOn();
    autoSaveToggle.classList.toggle('is-off', !on);
    autoSaveToggle.classList.toggle('is-shared', openedReceived);
    autoSaveToggle.setAttribute('aria-pressed', String(on));
    autoSaveToggle.title = openedReceived
      ? 'A shared song stays exactly as it was sent, so you can always go back to it. Press to save your own copy and keep your changes.'
      : on
      ? 'Auto-save is on: every change is saved to this song. Press to stop saving.'
      : 'Auto-save is off: your changes are not being saved. Press to save them and start saving again.';
    if (autoSaveLabel) autoSaveLabel.textContent = openedReceived ? 'Save my copy' : (on ? 'Auto-save' : 'Not saving');
    const svg = autoSaveToggle.querySelector('.autosave-icon');
    if (svg) svg.innerHTML = openedReceived ? ICON_COPY : (on ? ICON_SAVING : ICON_NOT_SAVING);
  }

  /* Turning it back on is the moment to ask about the work done while it
     was off: save it, or leave it on screen only and stay off. */
  function setAutoSave(on) {
    if (!autoSaveOffered()) return;
    if (on && openedReceived) { showNewSongModal('saveAs'); return; }
    if (on && hasUnsavedChanges()) {
      const title = getCurrentSongTitle() || 'this song';
      const ok = confirm('Save the changes you have made to “' + title + '”?\n\n'
        + 'OK saves them and turns auto-save on.\n'
        + 'Cancel leaves auto-save off, and “' + title + '” stays as it was saved.');
      if (!ok) { updateAutoSaveToggle(); return; }
      autoSave = true;
      saveCurrentSongToLibrary(true);
      toast('Saved — auto-save on');
    } else {
      autoSave = !!on;
      if (autoSave) markSaved();
    }
    updateAutoSaveToggle();
    renderLibrarySongList();
  }

  if (autoSaveToggle) {
    autoSaveToggle.addEventListener('click', () => setAutoSave(!autoSaveOn()));
  }

  /* The chip says where your work is going: into the sandbox, or into a
     library song (a lesson's exercise, inside a lesson). */
  function updateSongChip() {
    const sandbox = isSandboxId(getCurrentSongId());
    const title = sandbox ? SANDBOX_TITLE : (getCurrentSongTitle() || 'Untitled');
    const where = sandbox ? 'Sandbox' : (lessonMeta ? 'Lesson' : (openedReceived ? (openedBook || 'Shared') : 'Library'));
    if (songChip) {
      songChip.classList.toggle('is-sandbox', sandbox);
      songChip.title = sandbox
        ? 'Sandbox — scratch work, not saved to your library'
        : `${where}: ${title}`;
    }
    // the sandbox needs no second line: the word and the dashed edge say it
    if (songChipKicker) { songChipKicker.textContent = where; songChipKicker.hidden = sandbox; }
    if (songChipLabel) songChipLabel.textContent = title;
    const clearBtn = document.getElementById('sandbox-clear-btn');
    if (clearBtn) {
      clearBtn.hidden = !sandbox;
      clearBtn.title = 'Clear the ' + (currentMode === 'rhythm' ? 'rhythm' : 'poetry')
        + ' sandbox and start over';
    }
    if (nowEditingTitle) nowEditingTitle.textContent = sandbox
      ? (currentMode === 'rhythm' ? 'Rhythm sandbox' : 'Poetry sandbox')
      : title;
    if (nowEditingNote) {
      nowEditingNote.textContent = sandbox
        ? 'Scratch work. It stays here between visits but is not in your library — use Save as… to keep it there.'
        : openedReceived
        ? 'Shared with you. It stays exactly as it was sent, so you can always come back to it — use Save as… to keep your own copy with your changes.'
        : '';
      nowEditingNote.hidden = !sandbox && !openedReceived;
    }
    if (nowEditingBadge) {
      nowEditingBadge.textContent = currentMode === 'rhythm' ? 'Rhythm' : 'Poetry';
      nowEditingBadge.className = 'side-badge ' + (currentMode === 'rhythm' ? 'badge-rhythm' : 'badge-poetry');
    }
    if (newSongBtnLabel) newSongBtnLabel.textContent = currentMode === 'rhythm' ? 'New rhythm' : 'New poem';
    updateAutoSaveToggle();
  }

  /* `options.autoSave` is for a song this very moment made or saved —
     New, Save as…, a song that arrived in a link. Opening anything else
     from the library starts with auto-save off, which is the point of
     the whole thing. */
  function loadSongById(songId, options) {
    if (isPlaying || isPaused) stopPlayback();
    const library = getStoredLibrary();
    let song = library[songId];
    if (!song && DEFAULT_SONGS[songId]) {
      song = normalizeSong(JSON.parse(JSON.stringify(DEFAULT_SONGS[songId])));
      library[songId] = song;
      saveStoredLibrary(library);
    }
    if (!song) return;

    // The song decides which side we end up on, not the other way round.
    const side = songSide(song);
    currentMode = side;

    currentSongIds[side] = songId;
    currentSongTitles[side] = song.title;
    persistActiveIds();

    poetryState.selectedPlayStartPosition = null;
    rhythmState.selectedPlayStartPosition = null;

    if (side === 'poetry') {
      const p = song.poetryState || {};
      poetryState.words = (p.words && p.words.length > 0)
        ? p.words.slice()
        : ['Press', 'the', 'words', 'to', 'edit.'];
      poetryState.rawLyrics = (p.rawLyrics && p.rawLyrics.length > 0)
        ? p.rawLyrics.slice()
        : poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
      poetryState.beatSubdivisions = p.beatSubdivisions ? { ...p.beatSubdivisions } : {};
      poetryState.linkedBeats = p.linkedBeats ? { ...p.linkedBeats } : {};
      poetryState.syncopation = p.syncopation ? p.syncopation.slice() : [];
      poetryState.syncopationStates = p.syncopationStates ? { ...p.syncopationStates } : {};
      poetryState.lineOverrides = p.lineOverrides ? { ...p.lineOverrides } : {};
      poetryState.hasPickupMeasure = !!p.hasPickupMeasure;
      poetryState.BPM = p.BPM || 82;
      poetryState.timeSignatureNumerator = p.timeSignatureNumerator || 4;
      poetryState.timeSignatureDenominator = p.timeSignatureDenominator || 4;

      const config = getLayoutConfig();
      const beatsPerMeasure = config.beatsPerMeasure;
      const beatsNeeded = Math.max(1, getTotalBeatsFromWords(poetryState.words, poetryState));
      const totalBeats = Math.max(beatsPerMeasure, Math.ceil(beatsNeeded / beatsPerMeasure) * beatsPerMeasure);

      poetryState.canonical12 = toCanonical12(poetryState.words, poetryState);
      while (poetryState.canonical12.length < totalBeats * 12) poetryState.canonical12.push('-');
      poetryState.words = fromCanonical12(poetryState.canonical12, poetryState);
    } else {
      const r = song.rhythmState || {};
      rhythmState.beats = (r.beats && r.beats.length)
        ? JSON.parse(JSON.stringify(r.beats))
        : Array.from({ length: 4 }, () => [true, true]);
      rhythmState.beatSubdivisions = r.beatSubdivisions ? { ...r.beatSubdivisions } : {};
      rhythmState.tuplets = r.tuplets ? JSON.parse(JSON.stringify(r.tuplets)) : {};
      rhythmState.tupletCells = r.tupletCells ? JSON.parse(JSON.stringify(r.tupletCells)) : {};
      rhythmState.linkedBeats = r.linkedBeats ? { ...r.linkedBeats } : {};
      rhythmState.lineOverrides = r.lineOverrides ? { ...r.lineOverrides } : {};
      rhythmState.hasPickupMeasure = !!r.hasPickupMeasure;
      rhythmState.BPM = r.BPM || 82;
      rhythmState.timeSignatureNumerator = r.timeSignatureNumerator || 4;
      rhythmState.timeSignatureDenominator = r.timeSignatureDenominator || 4;
      rhythmState.currentRhythmSystem = r.currentRhythmSystem || 'Simplified Kodály';

      if (rhythmSystemsDropdown) rhythmSystemsDropdown.value = rhythmState.currentRhythmSystem;
    }

    openedReceived = !!song.received;
    openedBook = openedReceived && song.book ? String(song.book) : '';
    autoSave = (options && options.autoSave && !openedReceived) ? true : false;
    usePieceLayout(song);
    setMode(side);
    markSaved();
    updateAutoSaveToggle();
  }

  if (rhythmSystemsDropdown) {
    rhythmSystemsDropdown.addEventListener('change', (e) => {
      rhythmState.currentRhythmSystem = e.target.value;
      saveCurrentSongToLibrary();
      render();
    });
  }

  // --- TITLE PROMPT (used for both "new" and "save as") ---
  function updateNewSongModalTexts() {
    const isRhythm = currentMode === 'rhythm';
    const noun = isRhythm ? 'rhythm' : 'poem';
    const heading = document.getElementById('newSongModalHeading');
    const subtext = document.getElementById('newSongModalSubtext');

    if (titlePromptIntent === 'saveAs' && isSandboxId(getCurrentSongId())) {
      if (heading) heading.textContent = 'Save to your library';
      if (subtext) subtext.textContent = `Your sandbox stays as it is. This adds a copy to your library as a new ${noun}, and you carry on in that copy.`;
      if (confirmNewSongBtn) confirmNewSongBtn.textContent = 'Save to library';
    } else if (titlePromptIntent === 'saveAs' && openedReceived) {
      if (heading) heading.textContent = 'Save my copy';
      if (subtext) subtext.textContent = `The shared ${noun} stays as it was sent, so you can always go back to it. Your copy is yours to change, and you carry on in it.`;
      if (confirmNewSongBtn) confirmNewSongBtn.textContent = 'Save my copy';
    } else if (titlePromptIntent === 'saveAs') {
      if (heading) heading.textContent = 'Save as…';
      if (subtext) subtext.textContent = `This keeps the original and starts a new ${noun} from where you are.`;
      if (confirmNewSongBtn) confirmNewSongBtn.textContent = 'Save';
    } else {
      if (heading) heading.textContent = isRhythm ? 'Create a new rhythm' : 'Create a new poem';
      if (subtext) subtext.textContent = 'Give it a name so you can find it later.';
      if (confirmNewSongBtn) confirmNewSongBtn.textContent = 'Create';
    }

    if (newSongTitleInput) {
      newSongTitleInput.placeholder = isRhythm ? 'e.g. Ta and Ti-Ti warm-up' : 'e.g. My spring poem';
    }
  }

  function showNewSongModal(intent) {
    if (isPlaying || isPaused) stopPlayback();
    if (!newSongModal) return;
    titlePromptIntent = intent || 'new';
    updateNewSongModalTexts();
    newSongTitleInput.value = titlePromptIntent === 'saveAs' && !isSandboxId(getCurrentSongId())
      ? `${getCurrentSongTitle() || 'Untitled'} ${openedReceived ? '(my copy)' : 'copy'}`
      : '';
    newSongTitleInput.classList.remove('input-error');
    const sheet = newSongModal.querySelector('.sheet');
    if (sheet) sheet.classList.remove('shake');
    newSongModal.classList.add('show');
    setTimeout(() => { newSongTitleInput.focus(); newSongTitleInput.select(); }, 60);
  }

  function hideNewSongModal() {
    if (!newSongModal) return;
    newSongModal.classList.remove('show');
    newSongTitleInput.value = '';
    newSongTitleInput.classList.remove('input-error');
  }

  function rejectEmptyTitle() {
    if (newSongTitleInput) {
      newSongTitleInput.classList.add('input-error');
      newSongTitleInput.focus();
    }
    const sheet = newSongModal ? newSongModal.querySelector('.sheet') : null;
    if (sheet) {
      sheet.classList.remove('shake');
      void sheet.offsetWidth;
      sheet.classList.add('shake');
      setTimeout(() => sheet.classList.remove('shake'), 500);
    }
  }

  function blankStateForSide(side) {
    if (side === 'rhythm') {
      return {
        beats: Array.from({ length: 4 }, () => [true, true]),
        beatSubdivisions: {},
        linkedBeats: {},
        lineOverrides: {},
        hasPickupMeasure: false,
        BPM: 82,
        timeSignatureNumerator: 4,
        timeSignatureDenominator: 4,
        currentRhythmSystem: rhythmState.currentRhythmSystem || 'Simplified Kodály'
      };
    }
    return {
      words: ['Start', 'here', '-', '-', '-', '-', '-', '-'],
      rawLyrics: ['Start', 'here'],
      beatSubdivisions: {},
      linkedBeats: {},
      syncopation: [],
      syncopationStates: {},
      lineOverrides: {},
      hasPickupMeasure: false,
      BPM: 82,
      timeSignatureNumerator: 4,
      timeSignatureDenominator: 4
    };
  }

  function createNewSong(title) {
    const trimmed = (title && title.trim()) ? title.trim() : '';
    if (!trimmed) { rejectEmptyTitle(); return; }

    saveCurrentSongToLibrary();
    // a new piece starts from your own settings, not a shared piece's
    leavePieceLayout();

    const side = currentMode;
    const id = EVM.newId('song');
    const record = {
      id: id,
      title: trimmed,
      side: side,
      isCustom: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    if (!lessonMeta && !EMBEDDED) record.layout = layoutSnapshot();
    if (side === 'rhythm') record.rhythmState = blankStateForSide('rhythm');
    else record.poetryState = blankStateForSide('poetry');

    const library = getStoredLibrary();
    library[id] = record;
    saveStoredLibrary(library);

    hideNewSongModal();
    closeSheet('library-sheet');
    loadSongById(id, { autoSave: true });
    toast(side === 'rhythm' ? 'New rhythm created' : 'New poem created');
  }

  function saveCurrentSongAs(title) {
    const trimmed = (title && title.trim()) ? title.trim() : '';
    if (!trimmed) { rejectEmptyTitle(); return; }

    saveCurrentSongToLibrary();   // the original — or the sandbox — keeps what is on screen

    const side = currentMode;
    const from = getCurrentSongId();
    const id = EVM.newId('song');
    const record = buildSongSnapshot(id, trimmed, side);
    record.isCustom = true;
    record.createdAt = Date.now();
    record.updatedAt = record.createdAt;
    // the settings on screen travel with the copy — a shared piece's too, unlocked now it is theirs
    if (!lessonMeta && !EMBEDDED) record.layout = layoutSnapshot();
    // The way back to what it was made from — a shared song, most often.
    if (from && !isSandboxId(from)) record.derivedFrom = from;

    const library = getStoredLibrary();
    library[id] = record;
    saveStoredLibrary(library);

    hideNewSongModal();
    closeSheet('library-sheet');
    loadSongById(id, { autoSave: true });
    toast('Saved as “' + trimmed + '”');
  }

  // --- LIBRARY SHEET ---
  const librarySheetTitle = document.getElementById('library-sheet-title');

  function showManageLibraryModal() {
    if (librarySheetTitle) {
      librarySheetTitle.textContent = lessonMeta ? lessonMeta.title : 'Songs';
    }
    saveCurrentSongToLibrary();
    updateSongChip();
    renderLibrarySongList();
    openSheet('library-sheet');
  }

  function hideManageLibraryModal() {
    closeSheet('library-sheet');
  }

  const SIDE_META = {
    rhythm: {
      label: 'Rhythms',
      icon: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
      empty: 'No rhythms yet. Make one with “New rhythm”.'
    },
    poetry: {
      label: 'Poems',
      icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
      empty: 'No poems yet. Make one with “New poem”.'
    }
  };

  const SANDBOX_ICON = '<path d="M4 20h16"/><path d="M6 20l1.5-6h9L18 20"/><path d="M12 14V4"/><path d="M12 4l5 3-5 3"/>';

  function buildSandboxRow(side) {
    const id = SANDBOX_IDS[side];
    const isCurrent = currentSongIds[side] === id;
    const song = getStoredLibrary()[id];
    const st = song ? (side === 'rhythm' ? song.rhythmState : song.poetryState) || {} : {};

    const row = document.createElement('div');
    row.className = 'library-song-item sandbox-item sandbox-' + side + (isCurrent ? ' active-song' : '');

    const badge = document.createElement('span');
    badge.className = 'side-badge ' + (side === 'rhythm' ? 'badge-rhythm' : 'badge-poetry');
    badge.textContent = side === 'rhythm' ? 'Rhythm' : 'Poetry';

    const text = document.createElement('span');
    text.className = 'library-song-title sandbox-title';
    text.innerHTML = '<span></span><small>Scratch work — not in your library</small>';
    text.firstChild.textContent = song
      ? `${st.timeSignatureNumerator || 4}/${st.timeSignatureDenominator || 4} · ${side === 'rhythm' ? 'Rhythm' : 'Poetry'} sandbox`
      : `${side === 'rhythm' ? 'Rhythm' : 'Poetry'} sandbox`;

    const actions = document.createElement('div');
    actions.className = 'library-song-actions';

    const openBtn = document.createElement('button');
    if (isCurrent && side === currentMode) {
      openBtn.className = 'lib-action-btn is-active';
      openBtn.textContent = 'Open now';
      openBtn.disabled = true;
    } else {
      openBtn.className = 'lib-action-btn load-btn';
      openBtn.textContent = 'Open';
      openBtn.addEventListener('click', () => {
        saveCurrentSongToLibrary();
        loadSongById(ensureSandbox(side));
        hideManageLibraryModal();
      });
    }

    const clearBtn = document.createElement('button');
    clearBtn.className = 'lib-action-btn';
    clearBtn.textContent = 'Clear';
    clearBtn.title = 'Start this sandbox over with a blank page';
    clearBtn.addEventListener('click', () => {
      const name = side === 'rhythm' ? 'rhythm' : 'poetry';
      if (!confirm(`Clear the ${name} sandbox and start with a blank page? This can’t be undone.`)) return;
      clearSandbox(side);
      renderLibrarySongList();
      toast('Sandbox cleared');
    });

    actions.appendChild(openBtn);
    actions.appendChild(clearBtn);
    row.appendChild(badge);
    row.appendChild(text);
    row.appendChild(actions);
    return row;
  }

  function buildSongRow(id, song, library) {
    const side = songSide(song);
    const isCurrent = id === currentSongIds[side];
    const st = side === 'rhythm' ? (song.rhythmState || {}) : (song.poetryState || {});
    const timeSig = `${st.timeSignatureNumerator || 4}/${st.timeSignatureDenominator || 4}`;

    const row = document.createElement('div');
    row.className = 'library-song-item' + (isCurrent ? ' active-song' : '');

    const meter = document.createElement('span');
    meter.className = 'meter-badge';
    meter.textContent = timeSig;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'library-song-title';
    titleSpan.textContent = song.title;
    if (song.received) {
      const tag = document.createElement('span');
      tag.className = 'shared-tag';
      tag.textContent = 'Shared';
      tag.title = 'Shared with you: it stays as it was sent. Save as… keeps your own copy.';
      titleSpan.appendChild(tag);
    }

    const actions = document.createElement('div');
    actions.className = 'library-song-actions';

    const loadBtn = document.createElement('button');
    /* With auto-save off, the song on screen and the song in the
       library are two different things — so the button that would say
       "Open now" offers the saved one back instead. */
    const canReopen = isCurrent && side === currentMode && !autoSaveOn();
    if (canReopen) {
      loadBtn.className = 'lib-action-btn load-btn';
      loadBtn.textContent = 'Reopen';
      loadBtn.title = 'Open the saved version again, losing the changes on screen';
      loadBtn.addEventListener('click', () => {
        if (hasUnsavedChanges() &&
            !confirm('Reopen “' + song.title + '” as it was saved?\n\n'
                   + 'The changes you have made since opening it are lost.')) return;
        loadSongById(id);
        hideManageLibraryModal();
        toast('Reopened as saved');
      });
    } else if (isCurrent) {
      loadBtn.className = 'lib-action-btn is-active';
      loadBtn.textContent = 'Open now';
      loadBtn.disabled = true;
    } else {
      loadBtn.className = 'lib-action-btn load-btn';
      loadBtn.textContent = 'Open';
      loadBtn.addEventListener('click', () => {
        saveCurrentSongToLibrary();
        loadSongById(id);
        hideManageLibraryModal();
      });
    }

    if (lessonMeta) {
      const againBtn = document.createElement('button');
      againBtn.className = 'lib-action-btn';
      againBtn.textContent = 'Start again';
      againBtn.title = 'Put this exercise back the way your teacher sent it';
      againBtn.addEventListener('click', () => {
        if (!confirm('Put \u201c' + song.title + '\u201d back the way your teacher sent it?')) return;
        if (restoreLessonSong(id)) {
          renderLibrarySongList();
          toast('Back to the original');
        }
      });
      actions.appendChild(loadBtn);
      actions.appendChild(againBtn);
      row.appendChild(meter);
      row.appendChild(titleSpan);
      row.appendChild(actions);
      return row;
    }

    const renameBtn = document.createElement('button');
    renameBtn.className = 'lib-action-btn';
    renameBtn.textContent = 'Rename';
    renameBtn.addEventListener('click', () => {
      const newTitle = prompt('New name:', song.title);
      if (newTitle && newTitle.trim()) {
        const lib = getStoredLibrary();
        if (!lib[id]) return;
        lib[id].title = newTitle.trim();
        lib[id].updatedAt = Date.now();
        saveStoredLibrary(lib);
        if (id === currentSongIds[side]) {
          currentSongTitles[side] = newTitle.trim();
          updateSongChip();
        }
        renderLibrarySongList();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'lib-action-btn delete-btn-item';
    deleteBtn.innerHTML = '&times;';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', () => {
      if (!confirm(`Delete “${song.title}”?`)) return;
      const lib = getStoredLibrary();
      delete lib[id];
      saveStoredLibrary(lib);

      /* Deleting the song you had open drops you into that side's
         sandbox rather than into some other library song. */
      if (id === currentSongIds[side]) {
        currentSongIds[side] = null;
        currentSongTitles[side] = '';
        const next = ensureSongForSide(side);
        if (side === currentMode) {
          loadSongById(next);
        } else {
          currentSongIds[side] = next;
          currentSongTitles[side] = (getStoredLibrary()[next] || {}).title || '';
        }
      }
      persistActiveIds();
      renderLibrarySongList();
      updateSongChip();
    });

    actions.appendChild(loadBtn);
    // A shared song keeps the name it was sent with; a copy can be renamed.
    if (!song.received) actions.appendChild(renameBtn);
    /* A song from a book leaves with its book (Put back): deleted on its
       own it would only come back at the next visit while the book is out. */
    if (!isShelfSong(song)) actions.appendChild(deleteBtn);

    row.appendChild(meter);
    row.appendChild(titleSpan);
    row.appendChild(actions);
    return row;
  }

  /* ------------------------------------------------------------------
     BOOKS FROM THE TEACHER LIBRARY (lib/evm-shelf.js)

     A book taken off the shelf puts its songs in the library as shared
     songs marked with `book`. They are listed under their book, above the
     student's own, with the way to put the book back. Putting it back
     removes them; a Save my copy of one is the student's own and stays.
     ------------------------------------------------------------------ */
  const BOOK_ICON = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>';
  const isShelfSong = rec => !!(window.EVMShelf && EVMShelf.isShelfSong(rec));

  function renderBookGroups(library, order) {
    const byBook = {};
    Object.keys(library).forEach(id => {
      const rec = library[id];
      if (!isShelfSong(rec) || !sideAllowed(songSide(rec))) return;
      (byBook[rec.book] = byBook[rec.book] || []).push(id);
    });
    Object.keys(byBook).sort((a, b) => a.localeCompare(b)).forEach(book => {
      const group = document.createElement('section');
      group.className = 'library-group library-group-book';
      const head = document.createElement('div');
      head.className = 'library-group-head';
      head.innerHTML =
        `<svg viewBox="0 0 24 24" aria-hidden="true">${BOOK_ICON}</svg>` +
        `<span class="library-group-title"></span>` +
        `<span class="library-group-rule"></span>`;
      head.querySelector('.library-group-title').textContent = book;
      const back = document.createElement('button');
      back.className = 'evm-book-head-btn';
      back.textContent = 'Put back';
      back.title = 'Put this book back on the Teacher Library shelf';
      back.addEventListener('click', () => EVMShelf.putBack(book));
      head.appendChild(back);
      group.appendChild(head);
      byBook[book]
        .sort((a, b) => (order.indexOf(songSide(library[a])) - order.indexOf(songSide(library[b]))) ||
                        String(library[a].title).localeCompare(String(library[b].title)))
        .forEach(id => group.appendChild(buildSongRow(id, library[id], library)));
      librarySongList.appendChild(group);
    });
  }

  /* After the shelf filed or removed songs: move off anything that left,
     show a newer version of the song on screen, and redraw. */
  function shelfChanged(summary) {
    const library = getStoredLibrary();
    ['rhythm', 'poetry'].forEach(side => {
      const id = currentSongIds[side];
      if (!id || library[id]) return;
      currentSongIds[side] = null;
      currentSongTitles[side] = '';
      const next = ensureSongForSide(side);
      if (side === currentMode) loadSongById(next);
      else {
        currentSongIds[side] = next;
        currentSongTitles[side] = (getStoredLibrary()[next] || {}).title || '';
      }
    });
    const cur = getCurrentSongId();
    if (cur && openedReceived && summary.updated.indexOf(cur) !== -1) loadSongById(cur);
    persistActiveIds();
    renderLibrarySongList();
    updateSongChip();
    const n = summary.added.length, up = summary.updated.length, gone = summary.removed.length;
    if (n) toast(n === 1 ? 'A song from your books is in your library' : n + ' songs from your books are in your library');
    else if (up) toast(up === 1 ? 'Your teacher updated a song in your books' : 'Your teacher updated ' + up + ' songs in your books');
    else if (gone) toast(gone === 1 ? 'A song from your books left your library' : gone + ' songs from your books left your library');
  }

  function renderLibrarySongList() {
    if (!librarySongList) return;
    const library = getStoredLibrary();
    librarySongList.innerHTML = '';

    // The side you are on is listed first.
    const order = currentMode === 'rhythm' ? ['rhythm', 'poetry'] : ['poetry', 'rhythm'];

    /* The sandboxes come first, in a group of their own: not library
       songs, so they are not listed with them. A lesson has none — there
       the library is the lesson. */
    if (!lessonMeta) {
      const group = document.createElement('section');
      group.className = 'library-group library-group-sandbox';
      const head = document.createElement('div');
      head.className = 'library-group-head';
      head.innerHTML =
        `<svg viewBox="0 0 24 24" aria-hidden="true">${SANDBOX_ICON}</svg>` +
        `<span class="library-group-title">Sandbox</span>` +
        `<span class="library-group-rule"></span>`;
      group.appendChild(head);
      order.forEach(side => {
        if (sideAllowed(side)) group.appendChild(buildSandboxRow(side));
      });
      librarySongList.appendChild(group);
    }

    if (!lessonMeta) renderBookGroups(library, order);

    order.forEach(side => {
      if (!sideAllowed(side)) return;
      const meta = SIDE_META[side];
      // songs from a book are listed under their book, above
      const ids = getSongIdsBySide(library, side).filter(id => !isShelfSong(library[id]));
      if (lessonMeta && !ids.length) return;

      const group = document.createElement('section');
      group.className = 'library-group library-group-' + side;

      const head = document.createElement('div');
      head.className = 'library-group-head';
      head.innerHTML =
        `<svg viewBox="0 0 24 24" aria-hidden="true">${meta.icon}</svg>` +
        `<span class="library-group-title">${meta.label}</span>` +
        `<span class="library-group-rule"></span>`;
      group.appendChild(head);

      if (ids.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'library-empty';
        empty.textContent = meta.empty;
        group.appendChild(empty);
      } else {
        ids.forEach(id => group.appendChild(buildSongRow(id, library[id], library)));
      }

      librarySongList.appendChild(group);
    });
  }

  // --- DOWNLOAD & UPLOAD (JSON IMPORT/EXPORT) & SHARE LINK ---
  function encodeSongToUrl(songData) {
    const jsonStr = JSON.stringify(songData);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const len = utf8Bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    return btoa(binary);
  }

  function decodeSongFromUrl(base64Str) {
    try {
      const binary = atob(base64Str);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const jsonStr = new TextDecoder().decode(bytes);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Error decoding song from URL:', e);
      return null;
    }
  }

  function generateShareLink(songData) {
    const encoded = encodeSongToUrl(songData);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?song=${encodeURIComponent(encoded)}`;
  }

  /* Through copyToClipboard(), not navigator.clipboard directly. Served
     over plain http on a school network — anything but localhost — the
     Clipboard API is absent rather than merely refused, so writeText
     throws before there is a promise to hang .catch() on and the button
     would do nothing at all, silently. The helper's try/catch covers that
     and falls back to execCommand. */
  function copyShareLink() {
    if (!shareLinkInput || !shareLinkInput.value) return;
    copyToClipboard(shareLinkInput.value).then(ok => {
      if (ok) {
        if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copied';
        if (shareLinkFeedback) shareLinkFeedback.textContent = 'Link copied to your clipboard.';
        setTimeout(() => {
          if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copy';
        }, 2500);
      } else {
        shareLinkInput.focus();
        shareLinkInput.select();
        if (shareLinkFeedback) shareLinkFeedback.textContent = 'Select and copy the link above.';
      }
    });
  }

  const lockLayoutOnShare = document.getElementById('lock-layout-on-share');

  /* A song lives on one side, but a link should hand over what the sender
     sees on both: the rhythm they were building alongside their poem, or
     the other way round. The other side's current song rides along as a
     partner, unless it is a built-in song left exactly as it came — the
     recipient has that already. */
  /* From a sandbox, the partner is the other sandbox, whatever that side
     has open: a sandbox link is both sandboxes as they are right now.
     Either way a sandbox travels marked as one, so it lands in the
     recipient's sandbox rather than their library. */
  function partnerForShare() {
    const other = currentMode === 'rhythm' ? 'poetry' : 'rhythm';
    const id = isSandboxId(getCurrentSongId()) ? SANDBOX_IDS[other] : currentSongIds[other];
    const song = id ? getStoredLibrary()[id] : null;
    if (!song || songSide(song) !== other) return null;
    const stateKey = other === 'rhythm' ? 'rhythmState' : 'poetryState';
    const mine = normalizeSong(song);
    if (isSandboxId(id)) {
      return { title: SANDBOX_TITLE, side: other, sandbox: true, [stateKey]: mine[stateKey] };
    }
    if (DEFAULT_SONGS[id]) {
      const stock = normalizeSong(JSON.parse(JSON.stringify(DEFAULT_SONGS[id])));
      if (JSON.stringify(stock[stateKey]) === JSON.stringify(mine[stateKey])) return null;
    }
    return Object.assign({ title: mine.title, side: other, [stateKey]: mine[stateKey] },
                         EVM.shareHeader(song, rawSongKey));
  }

  function handleShareCurrentSong() {
    saveCurrentSongToLibrary();
    const songData = buildSongSnapshot(
      'shared', getCurrentSongTitle() || 'Shared Song', currentMode
    );
    delete songData.id;
    /* The song's own id and dates travel with it, so opening the link
       again finds the copy already filed instead of adding another, and a
       newer version replaces an older one. Only when the link holds what
       is saved under that id (see EVM.shareHeader). */
    if (isSandboxId(getCurrentSongId())) songData.sandbox = true;
    else Object.assign(songData, EVM.shareHeader(
      getStoredLibrary()[getCurrentSongId()], rawSongKey, rawSongKey(songData)));

    /* The short way to hand out a controlled copy: one song, plus the room
       it was written in, without going near Set up for students. There is
       no task and no exercise list — just the same vocabulary the sender
       has, and no way to widen it. */
    if (lockLayoutOnShare && lockLayoutOnShare.checked) {
      songData.layout = layoutSnapshot();
      songData.layoutLocked = true;
    }

    const partner = partnerForShare();
    if (partner) songData.partner = partner;

    const link = generateShareLink(songData);
    if (shareLinkInput) shareLinkInput.value = link;
    if (shareLinkContainer) shareLinkContainer.hidden = false;

    copyToClipboard(link).then(ok => {
      if (ok) {
        if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copied';
        if (shareLinkFeedback) shareLinkFeedback.textContent = 'Link copied to your clipboard.';
        setTimeout(() => {
          if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copy';
        }, 2500);
      } else {
        shareLinkInput.focus();
        shareLinkInput.select();
        if (shareLinkFeedback) shareLinkFeedback.textContent = 'Select and copy the link above.';
      }
    });
  }

  function showImportExportModal() {
    if (isPlaying || isPaused) stopPlayback();
    saveCurrentSongToLibrary();
    if (uploadStatusMsg) {
      uploadStatusMsg.textContent = '';
      uploadStatusMsg.className = 'status-msg';
    }
    if (shareLinkContainer) shareLinkContainer.hidden = true;
    if (shareLinkFeedback) shareLinkFeedback.textContent = '';
    if (exportFilenameInput) {
      const cleanTitle = (getCurrentSongTitle() || 'rhythm-poetry-library').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      exportFilenameInput.value = cleanTitle ? `${cleanTitle}-backup` : 'rhythm-poetry-backup';
    }
    renderExportSongList();
    openSheet('importExportModal');
  }

  function hideImportExportModal() {
    closeSheet('importExportModal');
    if (jsonFileInput) jsonFileInput.value = '';
    if (shareLinkContainer) shareLinkContainer.hidden = true;
  }

  function renderExportSongList() {
    if (!exportSongList) return;
    const library = getStoredLibrary();
    exportSongList.innerHTML = '';

    const songIds = getSortedSongIds(library);
    if (songIds.length === 0) {
      exportSongList.innerHTML = '<div style="padding: 10px; color: #888; font-size: 13px; text-align: center;">No songs available to export.</div>';
      return;
    }

    songIds.forEach(id => {
      const song = library[id];
      const side = songSide(song);
      const isRhythmSong = side === 'rhythm';
      const targetState = isRhythmSong ? (song.rhythmState || {}) : (song.poetryState || {});
      const num = targetState.timeSignatureNumerator || 4;
      const den = targetState.timeSignatureDenominator || 4;
      const timeSig = `${num}/${den}`;

      const label = document.createElement('label');
      label.className = 'export-song-item';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = id;
      checkbox.checked = true;

      const infoDiv = document.createElement('div');
      infoDiv.className = 'export-song-item-info';

      const badge = document.createElement('span');
      badge.className = 'side-badge ' + (isRhythmSong ? 'badge-rhythm' : 'badge-poetry');
      badge.textContent = isRhythmSong ? 'Rhythm' : 'Poetry';
      badge.title = timeSig;

      const title = document.createElement('span');
      title.className = 'export-song-title';
      title.textContent = song.title;

      infoDiv.appendChild(badge);
      infoDiv.appendChild(title);

      label.appendChild(checkbox);
      label.appendChild(infoDiv);
      exportSongList.appendChild(label);
    });
  }

  function setAllExportCheckboxes(checked) {
    if (!exportSongList) return;
    const checkboxes = exportSongList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checked);
  }

  function handleExportDownload() {
    if (!exportSongList) return;
    const library = getStoredLibrary();
    const checkboxes = exportSongList.querySelectorAll('input[type="checkbox"]:checked');
    
    if (checkboxes.length === 0) {
      alert('Please select at least one song to download.');
      return;
    }

    const selectedSongs = [];
    checkboxes.forEach(cb => {
      const songId = cb.value;
      if (library[songId]) {
        selectedSongs.push(library[songId]);
      }
    });

    const exportData = {
      app: "Eagle View Music Rhythm Poetry 1.0",
      version: 1,
      exportedAt: new Date().toISOString(),
      count: selectedSongs.length,
      songs: selectedSongs
    };

    let filename = exportFilenameInput ? exportFilenameInput.value.trim() : 'rhythm-poetry-library';
    if (!filename) filename = 'rhythm-poetry-library';
    if (!filename.endsWith('.json')) filename += '.json';

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const json = JSON.parse(e.target.result);
        /* A backup, an old export, a raw library, or a Librarian file —
           see EVM.readItems. */
        const importedSongs = EVM.readItems(json, {
          app: 'rhythm-poetry',
          looksLike: v => !!(v.poetryState || v.rhythmState || v.words || v.title)
        }).filter(song => song && (song.title || song.poetryState || song.rhythmState || song.words));

        if (importedSongs.length === 0) {
          if (uploadStatusMsg) {
            uploadStatusMsg.textContent = 'No valid songs found in file.';
            uploadStatusMsg.className = 'status-msg error';
          }
          return;
        }

        /* Songs keep their ids and dates, so importing the same file twice
           adds nothing, and a newer copy of a song replaces the older one.
           A file keeps each song as it was there — yours stay yours, shared
           ones stay shared. Blank songs are left out. */
        const library = getStoredLibrary();
        const counts = { added: 0, updated: 0, same: 0, matched: 0, kept: 0, blank: 0 };
        importedSongs.forEach(song => {
          const title = (song.title && String(song.title).trim()) ? String(song.title).trim() : 'Imported Song';
          const incoming = normalizeSong(Object.assign({}, song, {
            id: song.id || 'incoming', title: title, side: songSide(song), isCustom: true
          }));
          if (!song.id || isSandboxId(song.id)) delete incoming.id;
          const result = EVM.file(library, incoming, fileOpts(false));
          counts[result.action] = (counts[result.action] || 0) + 1;
        });
        const parts = [];
        if (counts.added) parts.push(`added ${counts.added}`);
        if (counts.updated) parts.push(`updated ${counts.updated}`);
        if (counts.same + counts.matched) parts.push(`${counts.same + counts.matched} already here`);
        if (counts.kept) parts.push(`kept your newer copy of ${counts.kept}`);
        if (counts.blank) parts.push(`skipped ${counts.blank} blank`);

        saveStoredLibrary(library);
        renderExportSongList();
        renderLibrarySongList();

        if (uploadStatusMsg) {
          const said = parts.join(', ');
          uploadStatusMsg.textContent = '✓ ' + said.charAt(0).toUpperCase() + said.slice(1) + '.';
          uploadStatusMsg.className = 'status-msg';
        }

        jsonFileInput.value = '';
      } catch (err) {
        console.error('Error parsing JSON file:', err);
        if (uploadStatusMsg) {
          uploadStatusMsg.textContent = 'Invalid JSON file format.';
          uploadStatusMsg.className = 'status-msg error';
        }
      }
    };
    reader.readAsText(file);
  }

  function handleResetAllUserData() {
    const confirmed = confirm("Are you sure you want to delete all user data and restore the app to its default settings? This will delete all custom songs and cannot be undone.");
    if (!confirmed) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_SONG_ID_KEY);

      /* Layout settings go back to everything-on as well, which is also the
         one way out of a link that arrived with them locked. Reaching this
         at all means Share & backup is available, so a student inside a
         lesson cannot — that sheet is not theirs. */
      localStorage.removeItem(LAYOUT_KEY);
      loadLayout();
      view.showDots = true;
      view.showMeasureNumbers = true;
      view.showBeatNumbers = false;
      saveViewPrefs();
      syncViewControls();
      applyPolicyToShell();

      currentSongIds.rhythm = null;
      currentSongIds.poetry = null;
      currentSongTitles.rhythm = '';
      currentSongTitles.poetry = '';
      getStoredLibrary();

      loadSongById(ensureSongForSide(currentMode));
      renderLibrarySongList();
      renderExportSongList();

      if (resetStatusMsg) {
        resetStatusMsg.textContent = '✓ Songs and layout settings restored to defaults!';
        resetStatusMsg.className = 'status-msg';
        setTimeout(() => {
          resetStatusMsg.textContent = '';
          hideImportExportModal();
        }, 1200);
      } else {
        hideImportExportModal();
      }
    } catch (err) {
      console.error('Error resetting user data:', err);
      if (resetStatusMsg) {
        resetStatusMsg.textContent = 'Failed to reset user data.';
        resetStatusMsg.className = 'status-msg error';
      }
    }
  }

  function checkUrlForSharedSong() {
    let sharedSong = null;
    if (window.location.hash) {
      const hashStr = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
      const hashParams = new URLSearchParams(hashStr);
      if (hashParams.has('song')) {
        sharedSong = decodeSongFromUrl(hashParams.get('song'));
      }
    }
    if (!sharedSong) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('song')) {
        sharedSong = decodeSongFromUrl(urlParams.get('song'));
      }
    }
    return sharedSong;
  }

  // Mode Toggle: Left is Rhythm, Right is Poetry
  function setMode(mode) {
    if (isPlaying || isPaused) stopPlayback();
    currentMode = mode;
    const isRhythm = mode === 'rhythm';

    document.body.setAttribute('data-side', mode);

    if (rhythmModeBtn) {
      rhythmModeBtn.classList.toggle('active', isRhythm);
      rhythmModeBtn.setAttribute('aria-selected', String(isRhythm));
    }
    if (poetryModeBtn) {
      poetryModeBtn.classList.toggle('active', !isRhythm);
      poetryModeBtn.setAttribute('aria-selected', String(!isRhythm));
    }
    if (rhythmSystemsDropdown && isRhythm) {
      rhythmSystemsDropdown.value = rhythmState.currentRhythmSystem || 'Simplified Kodály';
    }

    updateTimeSignatureDisplay();
    updatePickupToggle();
    updateSongChip();
    applyPolicyToShell();
    render();
  }

  // Give a side something to open when it has no current song.
  function ensureSongForSide(side) {
    const library = getStoredLibrary();
    if (currentSongIds[side] && library[currentSongIds[side]] &&
        songSide(library[currentSongIds[side]]) === side) {
      return currentSongIds[side];
    }
    // Outside a lesson, a side with nothing open opens its sandbox — not
    // a library song that the first edit would quietly change.
    if (!lessonMeta) return ensureSandbox(side);
    const landing = DEFAULT_LANDING[side];
    if (library[landing] && songSide(library[landing]) === side) return landing;

    const ids = getSongIdsBySide(library, side);
    if (ids.length > 0) return ids[0];

    // Nothing on this side at all — seed it from the built-in default.
    const seed = normalizeSong(JSON.parse(JSON.stringify(DEFAULT_SONGS[landing])));
    library[landing] = seed;
    saveStoredLibrary(library);
    return landing;
  }

  /* The side's sandbox, made on first use: a blank page, the same one
     Clear gives back. */
  function ensureSandbox(side) {
    const id = SANDBOX_IDS[side];
    const library = getStoredLibrary();
    if (!library[id] || songSide(library[id]) !== side) {
      library[id] = freshSandbox(side);
      saveStoredLibrary(library);
    }
    return id;
  }

  function freshSandbox(side) {
    const id = SANDBOX_IDS[side];
    return normalizeSong({
      id: id, title: SANDBOX_TITLE, side: side, isCustom: true, createdAt: Date.now(),
      [side === 'rhythm' ? 'rhythmState' : 'poetryState']: blankStateForSide(side)
    });
  }

  function clearSandbox(side) {
    const library = getStoredLibrary();
    library[SANDBOX_IDS[side]] = freshSandbox(side);
    saveStoredLibrary(library);
    if (currentSongIds[currentMode] === SANDBOX_IDS[side]) loadSongById(SANDBOX_IDS[side]);
  }

  /* The Clear pill beside the chip. It clears the side on screen and only
     that one: the other side's sandbox is separate work. */
  const sandboxClearBtn = document.getElementById('sandbox-clear-btn');
  if (sandboxClearBtn) {
    sandboxClearBtn.addEventListener('click', () => {
      const side = currentMode;
      if (getCurrentSongId() !== SANDBOX_IDS[side]) return;
      if (!confirm(`Clear the ${side} sandbox and start with a blank page? This can\u2019t be undone.`)) return;
      if (isPlaying || isPaused) stopPlayback();
      clearSandbox(side);
      toast('Sandbox cleared');
    });
  }

  function switchSide(side) {
    if (!sideAllowed(side)) return;
    if (isPlaying || isPaused) stopPlayback();
    saveCurrentSongToLibrary();
    const targetId = ensureSongForSide(side);
    loadSongById(targetId);
  }

  if (rhythmModeBtn) {
    rhythmModeBtn.addEventListener('click', () => {
      if (currentMode !== 'rhythm') switchSide('rhythm');
    });
  }

  if (poetryModeBtn) {
    poetryModeBtn.addEventListener('click', () => {
      if (currentMode !== 'poetry') switchSide('poetry');
    });
  }

  /* Beat dots, measure numbers, beat numbers and the pickup measure used
     to live in the View popover. They are about what is on the page rather
     than how big it is, so they belong to Layout Settings now; View keeps
     size, scrolling and line length. The dots also have a button of their
     own in the toolbar, because a class turns those on and off constantly.

     This is the only hook left here: the sheet redraws the pickup row when
     the active song changes underneath it. */
  function updatePickupToggle() {
    renderLayoutPickup();
  }

  const startClearBtn = document.getElementById('start-clear-btn');
  if (startClearBtn) {
    startClearBtn.addEventListener('click', () => {
      const st = getActiveState();
      if (st.selectedPlayStartPosition === null) {
        toast('No start marker set');
      } else {
        st.selectedPlayStartPosition = null;
        render();
        toast('Start marker cleared');
      }
      closeAllPopovers();
    });
  }

  // --- Size, overflow and line-length controls ---
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  const zoomSlider = document.getElementById('zoom-slider');
  const zoomReadoutValue = document.getElementById('zoom-readout-value');
  const fitModeBtn = document.getElementById('fit-mode-btn');
  const fixedModeBtn = document.getElementById('fixed-mode-btn');
  const sizeModeNote = document.getElementById('size-mode-note');
  const overflowScrollBtn = document.getElementById('overflow-scroll-btn');
  const overflowWrapBtn = document.getElementById('overflow-wrap-btn');
  const mplRow = document.getElementById('mpl-row');
  const lineToolsToggle = document.getElementById('line-tools-toggle');
  const layoutResetBtn = document.getElementById('layout-reset-btn');
  const pictureColorDots = document.getElementById('picture-color-dots');

  const ZOOM_MIN = 40, ZOOM_MAX = 300, ZOOM_STEP = 10;

  function updateZoomReadout() {
    if (zoomSlider) zoomSlider.value = view.zoomPct;
    if (zoomReadoutValue) {
      zoomReadoutValue.textContent = view.sizeMode === 'fit'
        ? `${view.zoomPct}% of fit  ·  ${Math.round(appliedScale * 100)}% actual`
        : `${view.zoomPct}%`;
    }
    if (zoomOutBtn) zoomOutBtn.disabled = view.zoomPct <= ZOOM_MIN;
    if (zoomInBtn) zoomInBtn.disabled = view.zoomPct >= ZOOM_MAX;
  }

  function setZoom(pct) {
    view.zoomPct = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.round(pct)));
    saveViewPrefs();
    // wrap mode changes the line breaks as you zoom, so it needs a full render
    if (view.overflow === 'wrap') render();
    else applyZoom();
  }

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => setZoom(view.zoomPct + ZOOM_STEP));
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => setZoom(view.zoomPct - ZOOM_STEP));
  if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => setZoom(100));
  if (zoomSlider) zoomSlider.addEventListener('input', () => setZoom(parseInt(zoomSlider.value, 10)));

  // Hover-scrub the size, right from the toolbar — the same view.zoomPct the
  // popover's own slider controls, so the two always agree with each other.
  const viewBtn = document.getElementById('view-btn');
  setupHoverGauge({
    trigger: viewBtn,
    wrap: document.getElementById('size-gauge-wrap'),
    slider: document.getElementById('size-gauge'),
    label: document.getElementById('size-gauge-label'),
    getValue: () => view.zoomPct,
    format: v => `${v}%`,
    onInput: (v) => setZoom(v)
  });

  function setSizeMode(mode) {
    view.sizeMode = mode;
    // Carry the size across instead of jumping: entering fixed mode keeps
    // whatever is currently on screen.
    if (mode === 'fixed') view.zoomPct = Math.round(appliedScale * 100);
    else view.zoomPct = 100;
    saveViewPrefs();
    syncViewControls();
    render();
  }

  /* Text size is the words alone. The staff's size is untouched; the layout
     pass measures every word, so a bigger word widens its beat and the
     notes are redrawn on the new dot positions — a full render, always. */
  const textSmallerBtn = document.getElementById('text-smaller-btn');
  const textBiggerBtn = document.getElementById('text-bigger-btn');
  const textSizeSlider = document.getElementById('text-size-slider');
  const textSizeValue = document.getElementById('text-size-value');
  const textSizeResetBtn = document.getElementById('text-size-reset-btn');
  const TEXT_MIN = 60, TEXT_MAX = 250, TEXT_STEP = 10;

  function applyTextSize() {
    // from storage or the Music Stand, so never trusted to be in range
    view.textPct = Math.max(TEXT_MIN, Math.min(TEXT_MAX, Math.round(Number(view.textPct)) || 100));
    document.documentElement.style.setProperty('--text-scale', view.textPct / 100);
    if (textSizeSlider) textSizeSlider.value = view.textPct;
    if (textSizeValue) textSizeValue.textContent = `${view.textPct}%`;
    if (textSmallerBtn) textSmallerBtn.disabled = view.textPct <= TEXT_MIN;
    if (textBiggerBtn) textBiggerBtn.disabled = view.textPct >= TEXT_MAX;
  }

  function setTextSize(pct) {
    const next = Math.max(TEXT_MIN, Math.min(TEXT_MAX, Math.round(pct) || 100));
    if (next === view.textPct) return;
    view.textPct = next;
    saveViewPrefs();
    applyTextSize();
    render();
  }

  if (textSmallerBtn) textSmallerBtn.addEventListener('click', () => setTextSize(view.textPct - TEXT_STEP));
  if (textBiggerBtn) textBiggerBtn.addEventListener('click', () => setTextSize(view.textPct + TEXT_STEP));
  if (textSizeResetBtn) textSizeResetBtn.addEventListener('click', () => setTextSize(100));
  if (textSizeSlider) textSizeSlider.addEventListener('input', () => setTextSize(parseInt(textSizeSlider.value, 10)));

  /* Lyric font: the face of the words on the staff, nothing else. Each is
     strong in a different way. A face that has not downloaded yet is
     drawn in its fallback first, so the words are measured again once it
     arrives — otherwise the beats keep the fallback's widths. */
  const LYRIC_FONTS = {
    rounded: { family: "'Nunito', sans-serif",
               note: 'Friendly and round — the app’s own font.' },
    reader:  { family: "'Andika', 'Nunito', sans-serif",
               note: 'Made for beginning readers: the a and g children learn to write, and no letter mistaken for another.' },
    clear:   { family: "'Atkinson Hyperlegible', 'Nunito', sans-serif",
               note: 'Built so every letter stays distinct from across the room — good on a projector.' },
    story:   { family: "'Literata', Georgia, serif",
               note: 'A storybook serif, for words that should read like a poem on the page.' }
  };
  const lyricFontRow = document.getElementById('lyric-font-row');
  const lyricFontNote = document.getElementById('lyric-font-note');

  function applyLyricFont() {
    if (!LYRIC_FONTS[view.lyricFont]) view.lyricFont = 'rounded';
    const font = LYRIC_FONTS[view.lyricFont];
    document.documentElement.style.setProperty('--lyric-font', font.family);
    if (lyricFontRow) {
      lyricFontRow.querySelectorAll('.font-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.font === view.lyricFont);
      });
    }
    if (lyricFontNote) lyricFontNote.textContent = font.note;
  }

  /* `after` runs once the words have been measured again — the Music Stand's
     line-fitting needs the new widths, not the fallback font's. */
  function relayoutWhenLyricFontLoads(after) {
    if (!document.fonts || !document.fonts.load) return;
    const family = LYRIC_FONTS[view.lyricFont].family;
    const wanted = view.lyricFont;
    Promise.all(['600', '700'].map(w => document.fonts.load(`${w} 21px ${family}`)))
      .then(() => {
        if (view.lyricFont !== wanted) return;
        render();
        if (typeof after === 'function') after();
      })
      .catch(() => {});
  }

  if (lyricFontRow) {
    lyricFontRow.addEventListener('click', (e) => {
      const chip = e.target.closest('.font-chip');
      if (!chip || chip.dataset.font === view.lyricFont) return;
      view.lyricFont = chip.dataset.font;
      saveViewPrefs();
      applyLyricFont();
      render();
      relayoutWhenLyricFontLoads();
    });
  }

  if (fitModeBtn) fitModeBtn.addEventListener('click', () => setSizeMode('fit'));
  if (fixedModeBtn) fixedModeBtn.addEventListener('click', () => setSizeMode('fixed'));

  function setOverflow(mode) {
    view.overflow = mode;
    saveViewPrefs();
    syncViewControls();
    render();
  }
  if (overflowScrollBtn) overflowScrollBtn.addEventListener('click', () => setOverflow('scroll'));
  if (overflowWrapBtn) overflowWrapBtn.addEventListener('click', () => setOverflow('wrap'));

  if (mplRow) {
    mplRow.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const value = chip.getAttribute('data-mpl');
      view.measuresPerLine = value === 'auto' ? 'auto' : parseInt(value, 10);
      saveViewPrefs();
      syncViewControls();
      render();
    });
  }

  const followToggle = document.getElementById('follow-toggle');
  if (followToggle) {
    followToggle.addEventListener('click', () => {
      view.followPlayback = !view.followPlayback;
      followToggle.classList.toggle('active', view.followPlayback);
      saveViewPrefs();
    });
  }

  if (lineToolsToggle) {
    lineToolsToggle.addEventListener('click', () => {
      view.showLineTools = !view.showLineTools;
      lineToolsToggle.classList.toggle('active', view.showLineTools);
      document.body.classList.toggle('hide-line-tools', !view.showLineTools);
      saveViewPrefs();
    });
  }

  if (layoutResetBtn) {
    layoutResetBtn.addEventListener('click', () => {
      clearLineOverrides();
      closeAllPopovers();
    });
  }

  if (pictureColorDots) {
    pictureColorDots.addEventListener('change', () => {
      view.colorDotsInPicture = pictureColorDots.checked;
      saveViewPrefs();
    });
  }

  // Push the stored preferences onto the controls and the page.
  function syncViewControls() {
    if (fitModeBtn) fitModeBtn.classList.toggle('active', view.sizeMode === 'fit');
    if (fixedModeBtn) fixedModeBtn.classList.toggle('active', view.sizeMode === 'fixed');
    if (sizeModeNote) {
      sizeModeNote.textContent = view.sizeMode === 'fit'
        ? 'The staff resizes itself to fill the screen.'
        : 'The staff stays exactly this size, whatever the screen.';
    }

    if (overflowScrollBtn) overflowScrollBtn.classList.toggle('active', view.overflow === 'scroll');
    if (overflowWrapBtn) overflowWrapBtn.classList.toggle('active', view.overflow === 'wrap');

    if (mplRow) {
      mplRow.querySelectorAll('.chip').forEach(chip => {
        chip.classList.toggle('active', String(view.measuresPerLine) === chip.getAttribute('data-mpl'));
      });
    }

    if (lineToolsToggle) lineToolsToggle.classList.toggle('active', view.showLineTools);
    if (followToggle) followToggle.classList.toggle('active', view.followPlayback);
    if (pictureColorDots) pictureColorDots.checked = view.colorDotsInPicture;

    document.body.classList.toggle('hide-measure-numbers', !view.showMeasureNumbers);
    document.body.classList.toggle('hide-line-tools', !view.showLineTools);
    syncDotsToggle();
    updateCircleVisibility();

    applyTextSize();
    applyLyricFont();
    updateZoomReadout();
  }

  // --- Present mode ---
  const presentBtn = document.getElementById('present-btn');
  const presentExitBtn = document.getElementById('present-exit-btn');
  const presentPlayBtn = document.getElementById('present-play-btn');

  function setPresentMode(on) {
    if (on && !shellAllows('present')) return;
    presentMode = !!on;
    // present mode shows the layout the user built — it does not invent one
    document.body.classList.toggle('present-mode', presentMode);
    closeAllPopovers();
    requestAnimationFrame(() => render());
  }

  if (presentBtn) presentBtn.addEventListener('click', () => setPresentMode(true));
  if (presentExitBtn) presentExitBtn.addEventListener('click', () => setPresentMode(false));
  if (presentPlayBtn) {
    presentPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) stopPlayback();
      else if (isPaused) resumePlayback();
      else startPlayback();
    });
  }

  // --- Help ---
  const helpBtn = document.getElementById('help-btn');
  if (helpBtn) {
    helpBtn.addEventListener('click', () => {
      const note = document.getElementById('help-side-note');
      if (note) {
        note.innerHTML = currentMode === 'rhythm'
          ? '<b>You are on the Rhythm side.</b> Build a pattern from the dots and the app prints the notation and the counting syllables underneath. Rhythms and poems are saved separately.'
          : '<b>You are on the Poetry side.</b> Write your words, then tap the dots to place each syllable on the beat. Rhythms and poems are saved separately.';
      }
      openSheet('help-sheet');
    });
  }

  // Time Signature Controls
  /* The numeral walks the meters this denominator offers, in the order it
     always has. Without a lesson that is every meter the app knows; with
     one it is the teacher's subset of the same list, so the button never
     stops somewhere the lesson does not allow. */
  if (timeSignatureTopBtn) {
    timeSignatureTopBtn.addEventListener('click', () => {
      if (meterIsFixed()) return;
      const activeState = getActiveState();
      const cycle = meterCycle(activeState.timeSignatureDenominator);
      if (!cycle.length) return;
      const here = cycle.indexOf(activeState.timeSignatureNumerator);
      activeState.timeSignatureNumerator = cycle[(here + 1) % cycle.length];
      updateTimeSignatureDisplay();
      render();
    });
  }

  if (timeSignatureBottomBtn) {
    timeSignatureBottomBtn.addEventListener('click', () => {
      if (meterIsFixed() || denominatorsOffered().length < 2) return;
      const activeState = getActiveState();
      // The numeral the other family lands on is the first one it offers,
      // which without a lesson is the 6/8 and 4/4 it has always been.
      const landOn = d => (meterCycle(d)[0] || (d === 8 ? 6 : 4));
      if (currentMode === 'poetry') {
        poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
        if (poetryState.timeSignatureDenominator === 4) {
          poetryState.timeSignatureDenominator = 8;
          poetryState.timeSignatureNumerator = landOn(8);
          poetryState.linkedBeats = {};
        } else {
          poetryState.timeSignatureDenominator = 4;
          poetryState.timeSignatureNumerator = landOn(4);
          poetryState.linkedBeats = {};
        }
        poetryState.words = fromCanonical12(poetryState.canonical12);
      } else {
        if (rhythmState.timeSignatureDenominator === 4) {
          rhythmState.timeSignatureDenominator = 8;
          rhythmState.timeSignatureNumerator = landOn(8);
          rhythmState.beatSubdivisions = {};
          rhythmState.linkedBeats = {};
          rhythmState.beats = rhythmState.beats.map(b => [b[0] ?? true, b[1] ?? true, false]);
        } else {
          rhythmState.timeSignatureDenominator = 4;
          rhythmState.timeSignatureNumerator = landOn(4);
          rhythmState.beatSubdivisions = {};
          rhythmState.linkedBeats = {};
          rhythmState.beats = rhythmState.beats.map(b => [b[0] ?? true, b[1] ?? true]);
        }
      }

      updateTimeSignatureDisplay();
      render();
    });
  }

  // BPM Control
  /* The typed tempo. Built to survive a touch screen — a smart board
     especially — where three things went wrong:
       - a tap inside the box is also a click on the button around it,
         which used to throw the box away and open a fresh one;
       - an on-screen keyboard's Done often hides the keyboard without
         ever leaving the box, so a tempo applied only on blur never landed;
       - the hover slider could open under the same tap and fight it.
     So a number is taken as soon as it is a real tempo, the box closes on
     Enter, on blur, or on a tap anywhere else, and closing only ever
     happens once. */
  let bpmSaveTimer = null;

  function typedTempo(raw) {
    const n = parseInt(raw, 10);
    if (isNaN(n) || n <= 20 || n > 600) return null;
    // A lesson can narrow this to a range; without one it is the 21-600
    // the field has always accepted.
    return clampTempo(n);
  }

  if (bpmButton) {
    bpmButton.addEventListener('click', (e) => {
      if (tempoLocked()) return;
      if (bpmButton.querySelector('.bpm-input')) return;   // already typing
      const gaugeWrap = document.getElementById('bpm-gauge-wrap');
      if (gaugeWrap) gaugeWrap.classList.remove('show');

      const activeState = getActiveState();
      const currentBPM = activeState.BPM;
      const input = document.createElement('input');
      input.type = 'number';
      input.inputMode = 'numeric';
      input.min = String(Math.max(21, tempoMin()));
      input.max = String(Math.min(600, tempoMax()));
      input.value = currentBPM;
      input.className = 'bpm-input';
      input.setAttribute('aria-label', 'Tempo in beats per minute');

      bpmButton.innerHTML = '';
      bpmButton.appendChild(input);
      input.focus();
      input.select();

      let closed = false;
      const close = (keep) => {
        if (closed) return;
        closed = true;
        document.removeEventListener('pointerdown', onOutside, true);
        const typed = keep ? typedTempo(input.value) : null;
        activeState.BPM = typed !== null ? typed : (keep ? activeState.BPM : currentBPM);
        bpmValueSpan.textContent = activeState.BPM;

        // rebuild with both spans so the styled unit label survives editing
        bpmButton.innerHTML = '';
        bpmButton.appendChild(bpmValueSpan);
        bpmButton.appendChild(bpmUnitSpan);
        saveCurrentSongToLibrary();
      };
      const onOutside = (ev) => { if (ev.target !== input) close(true); };

      // taken as it is typed, so a keyboard that never leaves the box still sets it
      input.addEventListener('input', () => {
        const typed = typedTempo(input.value);
        if (typed !== null) activeState.BPM = typed;
      });
      input.addEventListener('change', () => {
        const typed = typedTempo(input.value);
        if (typed !== null) activeState.BPM = typed;
      });
      input.addEventListener('blur', () => close(true));
      input.addEventListener('click', (ev) => ev.stopPropagation());
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.keyCode === 13) {
          ev.preventDefault();
          close(true);
        } else if (ev.key === 'Escape') {
          ev.preventDefault();
          close(false);
        }
      });
      // after this tap has finished, so the tap that opened the box can't close it
      setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
    });
  }

  // Hover-scrub the tempo. Range covers the practical classroom span (Grave
  // to Prestissimo); anything further out is still reachable by typing.
  setupHoverGauge({
    trigger: bpmButton,
    wrap: document.getElementById('bpm-gauge-wrap'),
    slider: document.getElementById('bpm-gauge'),
    label: document.getElementById('bpm-gauge-label'),
    getValue: () => getActiveState().BPM,
    format: v => `${v} BPM`,
    isDisabled: () => tempoLocked() || !!bpmButton.querySelector('.bpm-input'), // locked, or the typed editor is open
    onInput: (v) => {
      const bpm = clampTempo(v);
      getActiveState().BPM = bpm;
      if (bpmValueSpan) bpmValueSpan.textContent = bpm;
      // saved as it moves as well: a touch drag doesn't always end in 'change'
      clearTimeout(bpmSaveTimer);
      bpmSaveTimer = setTimeout(saveCurrentSongToLibrary, 250);
    },
    onChange: () => { clearTimeout(bpmSaveTimer); saveCurrentSongToLibrary(); }
  });

  // Play button
  const playButton = document.getElementById('play-button');
  const playGlyph = document.getElementById('play-glyph');
  const presentPlay = document.getElementById('present-play-btn');

  // Both transports show the same state.
  function setPlayGlyph(glyph, cls) {
    if (playGlyph) playGlyph.textContent = glyph;
    if (playButton) {
      playButton.classList.remove('playing', 'paused');
      if (cls) playButton.classList.add(cls);
    }
    if (presentPlay) {
      presentPlay.textContent = glyph;
      presentPlay.classList.remove('playing', 'paused');
      if (cls) presentPlay.classList.add(cls);
    }
  }

  playButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) stopPlayback();
    else if (isPaused) resumePlayback();
    else startPlayback();
  });

  // Sound Toggle Buttons
  const beatToggle = document.getElementById('beat-toggle');
  const rhythmToggle = document.getElementById('rhythm-toggle');
  const introToggle = document.getElementById('intro-toggle');
  const pitchModeBtn = document.getElementById('pitch-mode-btn');
  const drumModeBtn = document.getElementById('drum-mode-btn');

  beatToggle.addEventListener('click', () => {
    beatEnabled = !beatEnabled;
    beatToggle.classList.toggle('active', beatEnabled);
  });

  rhythmToggle.addEventListener('click', () => {
    rhythmEnabled = !rhythmEnabled;
    rhythmToggle.classList.toggle('active', rhythmEnabled);
  });

  introToggle.addEventListener('click', () => {
    introEnabled = !introEnabled;
    introToggle.classList.toggle('active', introEnabled);
  });

  function setPitchMode(mode) {
    pitchMode = mode;
    if (pitchModeBtn) pitchModeBtn.classList.toggle('active', mode === 'pitch');
    if (drumModeBtn) drumModeBtn.classList.toggle('active', mode === 'drum');
    syncStrengthControl();
  }
  if (pitchModeBtn) pitchModeBtn.addEventListener('click', () => setPitchMode('pitch'));
  if (drumModeBtn) drumModeBtn.addEventListener('click', () => setPitchMode('drum'));

  /* ---- strength ----
     Written out rather than left as a number, because what x2 means
     depends on which sound is playing and the answer should not be a
     thing you have to try. */
  const strengthNote = document.getElementById('strength-note');
  const STRENGTH_WORDS = {
    pitch: ['One voice on every note.',
            'The note, and the octave above it.',
            'The note, and the two octaves above it.'],
    drum:  ['Tom and shaker together.',
            'Tom, shaker and snare.',
            'Tom, shaker, snare and claves.']
  };

  function syncStrengthControl() {
    for (let i = 1; i <= 3; i++) {
      const btn = document.getElementById('strength-' + i + '-btn');
      if (btn) btn.classList.toggle('active', soundStrength === i);
    }
    if (strengthNote) strengthNote.textContent = STRENGTH_WORDS[pitchMode][soundStrength - 1];
  }

  function setSoundStrength(n, opts) {
    n = Math.max(1, Math.min(3, Number(n) || 1));
    if (n === soundStrength) return;
    soundStrength = n;
    syncStrengthControl();
    if (!(opts && opts.quiet)) saveSoundPrefs();
  }

  for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById('strength-' + i + '-btn');
    if (btn) btn.addEventListener('click', () => setSoundStrength(i));
  }
  syncStrengthControl();

  // Copy Visual button
  if (copyVisualBtn) copyVisualBtn.addEventListener('click', captureVisual);

  // Text Editor modal setup
  const textInputModal = document.getElementById('text-input-modal');
  const multiLineInput = document.getElementById('multi-line-input');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalSubmitBtn = document.getElementById('modal-submit-btn');
  const modalCopyBtn = document.getElementById('modal-copy-btn');
  const toggleAddBtn = document.getElementById('toggle-add-btn');
  const toggleReplaceBtn = document.getElementById('toggle-replace-btn');

  function openTextInputModal() {
    multiLineInput.value = wordsToText();
    openSheet('text-input-modal');
    setTimeout(() => multiLineInput.focus(), 60);
  }

  function closeTextInputModal() {
    closeSheet('text-input-modal');
  }

  if (textEditorBtn) textEditorBtn.addEventListener('click', openTextInputModal);


  if (toggleAddBtn) {
    toggleAddBtn.addEventListener('click', () => {
      textImportMode = 'add';
      toggleAddBtn.classList.add('active');
      toggleReplaceBtn.classList.remove('active');
    });
  }

  if (toggleReplaceBtn) {
    toggleReplaceBtn.addEventListener('click', () => {
      textImportMode = 'replace';
      toggleReplaceBtn.classList.add('active');
      toggleAddBtn.classList.remove('active');
    });
  }

  // Copy button functionality
  if (modalCopyBtn) {
    modalCopyBtn.addEventListener('click', async () => {
      const textToCopy = multiLineInput.value;
      const success = await copyToClipboard(textToCopy);
      
      toast(success ? 'Copied to your clipboard' : 'Could not copy');
    });
  }
  
  // Drop a block of text onto the notes that already exist, leaving
  // subdivisions, links and syncopations untouched.
  function applyLyricsText(text, mode) {
    const trimmed = (text || '').trim();
    if (!trimmed) return false;

    const inputWords = trimmed.split(/\s+/).filter(w => w.length > 0 && w !== '\\');
    if (inputWords.length === 0) return false;

    if (mode === 'add') {
      const existing = (poetryState.rawLyrics && poetryState.rawLyrics.length > 0)
        ? poetryState.rawLyrics.slice()
        : poetryState.words.filter(w => w && w !== '-' && w.trim() !== '');
      poetryState.rawLyrics = existing.concat(inputWords);
    } else {
      poetryState.rawLyrics = inputWords.slice();
    }

    const targetLyrics = poetryState.rawLyrics;

    const activeWordIndices = [];
    for (let i = 0; i < poetryState.words.length; i++) {
      const w = poetryState.words[i];
      if (w && w !== '-' && w.trim() !== '') activeWordIndices.push(i);
    }

    if (activeWordIndices.length > 0) {
      for (let k = 0; k < activeWordIndices.length; k++) {
        const slotIdx = activeWordIndices[k];
        poetryState.words[slotIdx] = (k < targetLyrics.length) ? targetLyrics[k] : '-';
      }
    } else {
      for (let i = 0; i < poetryState.words.length && i < targetLyrics.length; i++) {
        poetryState.words[i] = targetLyrics[i];
      }
    }

    poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
    poetryState.words = fromCanonical12(poetryState.canonical12);
    saveCurrentSongToLibrary();
    render();
    return true;
  }

  if (modalSubmitBtn) {
    modalSubmitBtn.addEventListener('click', () => {
      applyLyricsText(multiLineInput.value, textImportMode);
      closeTextInputModal();
    });
  }

  // --- PHONE WRITE PANEL ---
  const writePanel = document.getElementById('write-panel');
  const writePanelToggle = document.getElementById('write-panel-toggle');
  const quickWrite = document.getElementById('quick-write');
  const quickAddBtn = document.getElementById('quick-add-btn');
  const quickReplaceBtn = document.getElementById('quick-replace-btn');
  const quickApplyBtn = document.getElementById('quick-apply-btn');
  let quickMode = 'replace';

  function syncQuickWrite() {
    if (quickWrite && document.activeElement !== quickWrite) {
      quickWrite.value = wordsToText();
    }
  }

  if (writePanelToggle && writePanel) {
    writePanelToggle.addEventListener('click', () => {
      const collapsed = writePanel.classList.toggle('collapsed');
      writePanelToggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  if (quickAddBtn && quickReplaceBtn) {
    quickAddBtn.addEventListener('click', () => {
      quickMode = 'add';
      quickAddBtn.classList.add('active');
      quickReplaceBtn.classList.remove('active');
    });
    quickReplaceBtn.addEventListener('click', () => {
      quickMode = 'replace';
      quickReplaceBtn.classList.add('active');
      quickAddBtn.classList.remove('active');
    });
  }

  if (quickApplyBtn) {
    quickApplyBtn.addEventListener('click', () => {
      if (applyLyricsText(quickWrite.value, quickMode)) {
        quickWrite.blur();
        if (quickMode === 'add') { quickMode = 'replace'; quickReplaceBtn.classList.add('active'); quickAddBtn.classList.remove('active'); }
        syncQuickWrite();
        toast('Words set to the beat');
      }
    });
  }

  // --- MODAL EVENT LISTENERS ---
  if (newSongBtn) newSongBtn.addEventListener('click', () => showNewSongModal('new'));
  if (saveAsBtn) saveAsBtn.addEventListener('click', () => showNewSongModal('saveAs'));
  if (shelfBtn) shelfBtn.addEventListener('click', () => window.EVMShelf && EVMShelf.openSheet());

  function submitTitlePrompt() {
    const value = newSongTitleInput ? newSongTitleInput.value : '';
    if (titlePromptIntent === 'saveAs') saveCurrentSongAs(value);
    else createNewSong(value);
  }

  if (confirmNewSongBtn) confirmNewSongBtn.addEventListener('click', submitTitlePrompt);
  if (newSongTitleInput) {
    newSongTitleInput.addEventListener('input', () => {
      if (newSongTitleInput.value.trim().length > 0) newSongTitleInput.classList.remove('input-error');
    });
    newSongTitleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); submitTitlePrompt(); }
      else if (e.key === 'Escape') hideNewSongModal();
    });
  }

  if (libraryBtn) libraryBtn.addEventListener('click', showManageLibraryModal);
  if (songChip) songChip.addEventListener('click', showManageLibraryModal);

  if (importExportBtn) importExportBtn.addEventListener('click', () => {
    closeSheet('library-sheet');
    showImportExportModal();
  });
  if (uploadJsonBtn && jsonFileInput) {
    uploadJsonBtn.addEventListener('click', () => jsonFileInput.click());
    jsonFileInput.addEventListener('change', handleFileUpload);
  }
  if (selectAllExportBtn) selectAllExportBtn.addEventListener('click', () => setAllExportCheckboxes(true));
  if (deselectAllExportBtn) deselectAllExportBtn.addEventListener('click', () => setAllExportCheckboxes(false));
  if (confirmExportBtn) confirmExportBtn.addEventListener('click', handleExportDownload);
  if (generateShareLinkBtn) generateShareLinkBtn.addEventListener('click', handleShareCurrentSong);
  if (copyShareLinkBtn) copyShareLinkBtn.addEventListener('click', copyShareLink);
  if (resetAllDataBtn) resetAllDataBtn.addEventListener('click', handleResetAllUserData);

  // --- PLAYBACK LOGIC ---

  /* Time is the audio clock. Each sound has a moment on it, worked out
     from one anchor; a timer hands it over a little ahead (LOOKAHEAD) and
     the timed view places it on that moment to the sample. A long poem is
     a lot of timers, and the page is busy while it plays — following the
     words, turning lines — so a note left to fire when its timer did would
     come in late whenever the page was. The lights are timers too, set for
     when each beat is heard.

     Play does not start the instant it is pressed. The sound is made ready
     first (EVMCountIn.prime), and only then is anything counted: on a cold
     start the first click or two used to go out while the sound was still
     waking, and the count stumbled in. */
  const LOOKAHEAD = 0.08;   // seconds: how early a sound is handed to the clock
  const START_GAP = 0.1;    // seconds between the sound being ready and beat one
  let playToken = 0;        // a start still getting ready is dropped if this moves

  function audioNow() { return timedAudio ? timedAudio.raw.currentTime : performance.now() / 1000; }
  function soundAt(time, fn) {
    if (timedAudio && audioContext === timedAudio.ctx) timedAudio.soundAt(time, fn);
    else fn();
  }
  function heard(time) { return timedAudio ? EVMCountIn.heardAt(timedAudio.raw, time) : time * 1000; }

  /* A timer for audio `time`, fired LOOKAHEAD before it so what it sounds
     can be placed exactly; and one for when `time` is heard. */
  function handOver(time, fn) {
    playTimeouts.push(setTimeout(fn, Math.max(0, (time - LOOKAHEAD - audioNow()) * 1000)));
  }
  function whenHeard(time, fn) {
    playTimeouts.push(setTimeout(fn, Math.max(0, heard(time) - performance.now())));
  }

  /* One pass, from `startBeat`, with that beat at audio time `anchor`. The
     next pass is laid down a moment before this one ends and starts
     exactly where it does, so a loop never gains or loses a hair. */
  function schedulePlayback(anchor, startBeat = 0) {
    const activeState = getActiveState();
    const isRhythm = currentMode === 'rhythm';
    const beatSec = 60 / activeState.BPM;
    const totalBeats = notesBoxElements.length;
    if (totalBeats === 0) return;

    if (startBeat >= totalBeats) {
      startBeat = 0;
    }

    const passSec = (totalBeats - startBeat) * beatSec;

    // Schedule BEAT track
    for (let beat = startBeat; beat < totalBeats; beat++) {
      const time = anchor + (beat - startBeat) * beatSec;
      whenHeard(time, () => {
        if (isPlaying) {
          currentPlayPosition = beat;
          highlightNotesBox(beat);
        }
      });
      handOver(time, () => {
        if (isPlaying && beatEnabled) soundAt(time, () => playBrushDrum());
      });
    }

    /* Schedule the RHYTHM track.

       Onsets are read off the same slot maps the notation is drawn from,
       so what is heard and what is printed can never drift apart. Working
       in ticks is what lets a triplet land on thirds of a beat, and it is
       also how a note learns how long it should ring: a half note holds
       for two beats rather than clicking once and stopping. */
    const tickSec = beatSec / beatTicks(activeState);
    const words = isRhythm ? [] : poetryState.words;

    for (const grp of enumerateRhythmGroups(totalBeats)) {
      if (grp.end < startBeat) continue;
      const map = buildSlotMap(grp.start, grp.end, words);
      const groupStartTicks = (grp.start - startBeat) * beatTicks(activeState);
      let offset = 0;

      for (let i = 0; i < map.roles.length; i++) {
        const slotTicks = map.slotTicks[i];
        const at = groupStartTicks + offset;
        offset += slotTicks;
        if (map.roles[i] !== 'note') continue;
        if (at < 0) continue;

        // how long this note rings: on through every slot that holds it
        let heldTicks = slotTicks;
        for (let j = i + 1; j < map.roles.length && map.roles[j] === 'hold'; j++) {
          heldTicks += map.slotTicks[j];
        }

        const time = anchor + at * tickSec;
        const holdSec = heldTicks * tickSec;
        handOver(time, () => {
          if (!isPlaying || !rhythmEnabled) return;
          soundAt(time, () => {
            if (pitchMode === 'pitch') playTriangleTone(Math.min(holdSec * 0.92, 3));
            else playPercussion();
          });
        });
      }
    }

    handOver(anchor + passSec - 0.2, () => {
      if (isPlaying) {
        isFirstPlay = false;
        schedulePlayback(anchor + passSec, 0);
      }
    });
  }

  /* The count-in, from audio time `from`: the brush on every beat, with
     the card lighting each number as it is heard. Returns when the music
     now begins. */
  function scheduleCountIn(from, beatSec, n) {
    const times = [];
    for (let i = 0; i < n; i++) {
      const time = from + i * beatSec;
      handOver(time, () => { if (isPlaying) soundAt(time, () => playBrushDrum(true)); });
      times.push(heard(time));
    }
    const end = from + n * beatSec;
    EVMCountIn.run(times, heard(end));
    return end;
  }

  async function startPlayback() {
    initAudioContext();
    const activeState = getActiveState();
    const token = ++playToken;

    isPlaying = true;
    isPaused = false;
    currentPlayPosition = activeState.selectedPlayStartPosition || 0;
    setPlayGlyph('■', 'playing');
    document.body.classList.add('playback-active');
    document.body.classList.remove('playback-paused');

    /* One bar of the meter (two of a bar of two), less the pickup when it
       starts from the top: the pickup comes in on the count's last beat. */
    const fromTop = activeState.selectedPlayStartPosition === null;
    const perBar = getLayoutConfig().beatsPerMeasure;
    let count = 0;
    if (introEnabled && (isFirstPlay || !fromTop)) {
      count = EVMCountIn.beats(perBar);
      if (isFirstPlay && activeState.hasPickupMeasure && fromTop) count -= 1;
    }
    /* The card is up at once, so the room knows a count is coming while
       the sound is still being made ready. */
    if (count > 0) EVMCountIn.open(count, perBar);

    /* With a count-in, a moment longer to get ready: the count has to be
       right from its first click, and a second's wait is worth that. */
    const ready = timedAudio ? await EVMCountIn.prime(timedAudio.raw, { warm: count > 0 ? 0.35 : 0.12 }) : true;
    if (token !== playToken || !isPlaying) return;   // stopped or paused while getting ready
    if (!ready) {
      stopPlayback();
      toast('The sound would not start — press Play again');
      return;
    }
    if (pitchMode !== 'pitch') getKit();   // built now, not on the first note

    let t = audioNow() + START_GAP;
    if (count > 0) t = scheduleCountIn(t, 60 / activeState.BPM, count);
    schedulePlayback(t, currentPlayPosition);
  }

  function pausePlayback() {
    if (!isPlaying) return;
    playToken++;
    isPlaying = false;
    isPaused = true;
    stopFollowing();
    playTimeouts.forEach(timeout => clearTimeout(timeout));
    playTimeouts = [];
    EVMCountIn.close();
    setPlayGlyph('▶', 'paused');
    document.body.classList.add('playback-paused');
  }

  async function resumePlayback() {
    if (!isPaused) return;
    initAudioContext();
    const token = ++playToken;

    isPlaying = true;
    isPaused = false;
    setPlayGlyph('■', 'playing');
    document.body.classList.add('playback-active');
    document.body.classList.remove('playback-paused');

    const ready = timedAudio ? await EVMCountIn.prime(timedAudio.raw, { warm: 0.12 }) : true;
    if (token !== playToken || !isPlaying) return;
    if (!ready) {
      stopPlayback();
      toast('The sound would not start — press Play again');
      return;
    }
    schedulePlayback(audioNow() + START_GAP, currentPlayPosition);
  }

  function stopPlayback() {
    playToken++;
    EVMCountIn.close();
    isPlaying = false;
    isPaused = false;
    stopFollowing();
    currentPlayPosition = 0;
    isFirstPlay = true;
    setPlayGlyph('▶', null);
    document.body.classList.remove('playback-active');
    document.body.classList.remove('playback-paused');
    clearHighlights();
    playTimeouts.forEach(timeout => clearTimeout(timeout));
    playTimeouts = [];
    const activeState = getActiveState();
    activeState.selectedPlayStartPosition = null;
    render();
  }

  /*
   * Tapping the background pauses and resumes. Deciding what counts as
   * "background" is the whole trick: this runs on the capture phase, so
   * anything it wrongly claims never reaches its own click handler.
   *
   * Controls that sit on the barlines — add/remove measure, split, rejoin —
   * live outside .group, so listing the chrome and the beat groups was not
   * enough. Anything interactive is excluded outright.
   */
  function isMainScreenClick(target) {
    if (!target) return false;
    if (target.closest('.toolbar, .topbar, .write-panel, .popover, .sheet-backdrop, .present-bar')) {
      return false;
    }
    if (target.closest('.group')) {
      return false;
    }
    if (target.closest('button, a, input, select, textarea, label, [role="button"]')) {
      return false;
    }
    return true;
  }

  // Tap / click anywhere on the main screen to pause or resume playback
  document.addEventListener('click', (e) => {
    if ((isPlaying || isPaused) && isMainScreenClick(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (isPlaying) {
        pausePlayback();
      } else if (isPaused) {
        resumePlayback();
      }
    }
  }, true);

  // Prevent double-click actions on the main screen during playback or pause
  document.addEventListener('dblclick', (e) => {
    if ((isPlaying || isPaused) && isMainScreenClick(e.target)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);

  // Keyboard: space toggles playback, Esc backs out of whatever is open
  function isTypingPlace(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
  }

  document.addEventListener('keydown', (e) => {
    /* Anything that is being edited keeps Space for itself. Checking only
       the focused element was not enough: Space in a lyric box moves on to
       the next word, which redraws the staff and removes that box before
       the key reaches here — so focus had already fallen to the page, and
       the next word started the music. The event's own target, a lyric box
       on screen, an open sheet, and a key a field has already claimed all
       count as editing too. */
    const inField = isTypingPlace(e.target) || isTypingPlace(document.activeElement)
      || !!document.querySelector('.word-input') || e.defaultPrevented
      || !!document.querySelector('.sheet-backdrop.show');

    if (e.key === 'Escape') {
      const openSheetEl = document.querySelector('.sheet-backdrop.show');
      if (openSheetEl) { openSheetEl.classList.remove('show'); return; }
      if (document.querySelector('.popover.show')) { closeAllPopovers(); return; }
      if (presentMode) { setPresentMode(false); return; }
      return;
    }

    if ((e.code === 'Space' || e.key === ' ') && !inField) {
      e.preventDefault();
      if (isPlaying) pausePlayback();
      else if (isPaused) resumePlayback();
      else startPlayback();
    }
  });

  function updateCircleVisibility() {
    document.querySelectorAll('.circles').forEach(box => {
      box.classList.toggle('circles-hidden', !view.showDots);
    });
  }

  /* Move a beat's circles to a new subdivision, keeping the notes where
     they fall in time rather than by index, so a beat keeps its shape as
     it is split finer or folded back. */
  function remapCells(cells, oldSlots, newSlots) {
    const out = new Array(newSlots).fill(false);
    if (!cells || !cells.length) { out[0] = true; return out; }
    for (let i = 0; i < oldSlots && i < cells.length; i++) {
      if (!cells[i]) continue;
      const j = Math.floor((i / oldSlots) * newSlots);
      if (j < newSlots) out[j] = true;
    }
    return out;
  }

  function reshapeBeatCells(beatIndex, oldSlots, newSlots) {
    if (currentMode === 'rhythm') {
      rhythmState.beats[beatIndex] = remapCells(rhythmState.beats[beatIndex], oldSlots, newSlots);
    } else {
      poetryState.words = sanitizeWordsArray(poetryState.words);
      poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
      poetryState.words = fromCanonical12(poetryState.canonical12);
    }
  }

  /* ---- the + button: this beat's sixteenths, on or off ----
     It only ever touches the one beat, even when that beat is linked to
     others, which is what lets a run hold a dotted quarter and two
     sixteenths. It never makes triplets - that is the - button's job. */
  function toggleBeatSixteenths(beatIndex) {
    if (findTupletRun(beatIndex)) return;            // the run owns the circles
    if (!rhythmEditable()) return;
    const state = getActiveState();
    const current = getBeatSubdivision(beatIndex);
    if (beatSlotTuplet(current, state)) return;      // in a triplet: - is the way out

    const sixteenths = sixteenthSubdivision(state);
    const next = current === sixteenths ? defaultSubdivision(state) : sixteenths;
    // Coming back to the natural division is always available; going out to
    // the sixteenths is only there if they are switched on and hold a shape
    // you cannot already write without them.
    if (next === sixteenths && !divisionIsReachable(sixteenths, state)) return;
    setBeatSubdivision(beatIndex, next);
    reshapeBeatCells(beatIndex, current, next);
    snapBeatToVocabulary(beatIndex);
    render();
  }

  /* ---- the - button: the opposite feel ----
     On a lone beat it walks that beat through the other grouping and its
     subdivision. On a run of linked beats it spreads a tuplet across the
     whole run instead, so three notes can sit across two beats. One more
     press after the last rung turns it off again. */
  function tripletContextFor(beatIndex) {
    const state = getActiveState();
    if (!rhythmEditable()) return null;
    const existingRun = findTupletRun(beatIndex, state);
    if (existingRun) {
      const full = runTupletLadder(existingRun.beats, state);
      if (!full) return null;
      /* A run the teacher wrote stays escapable even in a lesson that no
         longer offers run triplets: an empty ladder simply means the next
         press is the one that turns it off. */
      const ladder = allowedLadder(full, state) || [];
      return { kind: 'run', start: existingRun.start, beats: existingRun.beats, ladder: ladder, level: ladder.indexOf(existingRun.slots) };
    }
    const group = getLinkGroup(beatIndex);
    if (group.length > 1) {
      /* Spreading a tuplet across beats puts notes between the beat lines,
         which the lyric grid has no way to hold, so it stays in Rhythm. */
      if (currentMode !== 'rhythm') return null;
      if (!joinAllowed('runTriplet')) return null;
      const ladder = allowedLadder(runTupletLadder(group.length, state), state);
      if (!ladder) return null;
      return { kind: 'run', start: group.start, beats: group.length, ladder: ladder, level: -1 };
    }
    const ladder = allowedLadder(beatTupletLadder(state), state);
    const current = getBeatSubdivision(beatIndex, state);
    if (!ladder) {
      /* Nothing left to walk to — but a beat already sitting on a borrowed
         division still needs the way back, or turning a group off would
         strand every beat that was using it. An empty ladder means the
         next press is the one that returns it to the natural division. */
      if (current === defaultSubdivision(state)) return null;
      return { kind: 'beat', start: beatIndex, beats: 1, ladder: [], level: -1 };
    }
    return { kind: 'beat', start: beatIndex, beats: 1, ladder: ladder, level: ladder.indexOf(current) };
  }

  function cycleBeatTriplet(beatIndex) {
    const ctx = tripletContextFor(beatIndex);
    if (!ctx) return;
    const state = getActiveState();
    const nextLevel = ctx.level + 1;               // -1 means "not on the ladder yet"
    const turningOff = nextLevel >= ctx.ladder.length;

    if (ctx.kind === 'beat') {
      const current = getBeatSubdivision(beatIndex, state);
      const next = turningOff ? defaultSubdivision(state) : ctx.ladder[nextLevel];
      setBeatSubdivision(beatIndex, next);
      reshapeBeatCells(beatIndex, current, next);
      snapBeatToVocabulary(beatIndex);
    } else {
      const tuplets = getRunTuplets(state);
      if (!state.tupletCells) state.tupletCells = {};
      if (turningOff) {
        delete tuplets[ctx.start];
        delete state.tupletCells[ctx.start];
      } else {
        const slots = ctx.ladder[nextLevel];
        const previous = state.tupletCells[ctx.start];
        const oldSlots = ctx.level >= 0 ? ctx.ladder[ctx.level] : 0;
        tuplets[ctx.start] = { beats: ctx.beats, slots: slots };
        state.tupletCells[ctx.start] = oldSlots
          ? remapCells(previous, oldSlots, slots)
          : new Array(slots).fill(true);
      }
    }
    render();
  }

  /* The circles of a run tuplet, and the switch for one of them. */
  function getTupletCells(startBeat, slots, state = null) {
    const s = state || getActiveState();
    if (!s.tupletCells) s.tupletCells = {};
    let cells = s.tupletCells[startBeat];
    if (!Array.isArray(cells)) { cells = new Array(slots).fill(false); cells[0] = true; }
    while (cells.length < slots) cells.push(false);
    if (cells.length > slots) cells.length = slots;
    s.tupletCells[startBeat] = cells;
    return cells;
  }

  // --- RENDERING LOGIC ---

  function areBeatsInSameMeasure(b1, b2) {
    const activeState = getActiveState();
    const config = getLayoutConfig();
    const beatsPerMeasure = config.beatsPerMeasure;
    if (activeState.hasPickupMeasure) {
      if (b1 === 0 || b2 === 0) return b1 === b2;
      const m1 = Math.floor((b1 - 1) / beatsPerMeasure);
      const m2 = Math.floor((b2 - 1) / beatsPerMeasure);
      return m1 === m2;
    } else {
      const m1 = Math.floor(b1 / beatsPerMeasure);
      const m2 = Math.floor(b2 / beatsPerMeasure);
      return m1 === m2;
    }
  }

  /* Two beats may be joined when they are both plain eighth beats sitting
     in the same measure of simple time. */
  /* Beats may be joined whatever they are divided into - that is what lets
     a run carry a half note and then a beat of sixteenths - as long as they
     share a measure. A run tuplet already owns its beats, so it is left out. */
  function canLinkBeats(leftBeatIndex) {
    if (findTupletRun(leftBeatIndex) || findTupletRun(leftBeatIndex + 1)) return false;
    return areBeatsInSameMeasure(leftBeatIndex, leftBeatIndex + 1);
  }

  function isBeatLinked(leftBeatIndex) {
    const activeState = getActiveState();
    if (!activeState.linkedBeats || !activeState.linkedBeats[leftBeatIndex]) return false;
    return canLinkBeats(leftBeatIndex);
  }

  function isBeatInLinkedPair(beatIndex) {
    return isBeatLinked(beatIndex) || isBeatLinked(beatIndex - 1);
  }

  /* A syncopation in Lyrics mode carries a note over the beat line, which
     joins those two beats exactly the way the chain button does. */
  function syncopationJoinsBeat(beatIndex) {
    if (currentMode === 'rhythm') return false;
    if (getBeatSubdivision(beatIndex) !== 2) return false;
    if (!areBeatsInSameMeasure(beatIndex, beatIndex + 1)) return false;
    const start = getBeatStartIndex(beatIndex);
    return poetryState.syncopation.indexOf(start + 1) !== -1;
  }

  /* Beats read as one span, whether they were chained by hand or carried
     over by a syncopation. */
  function isBeatJoined(beatIndex) {
    return isBeatLinked(beatIndex) || syncopationJoinsBeat(beatIndex);
  }

  /* Joins chain: 1-2 and then 2-3 makes one three beat group, so a run is
     treated as a single span for both the dots and the printed rhythm.
     Returns the first and last beat of the run. */
  function getLinkGroup(beatIndex) {
    let start = beatIndex;
    while (isBeatJoined(start - 1)) start--;
    let end = beatIndex;
    while (isBeatJoined(end)) end++;
    return { start: start, end: end, length: end - start + 1 };
  }

  function isLinkGroupStart(beatIndex) {
    return isBeatJoined(beatIndex) && !isBeatJoined(beatIndex - 1);
  }

  function isBeatInJoinedRun(beatIndex) {
    return isBeatJoined(beatIndex) || isBeatJoined(beatIndex - 1);
  }

  /* The reading every part of the app shares: an active circle starts a
     note, the inactive circles after it hold that note, and inactive
     circles before any note are silence. */
  function rolesFromFlags(flags) {
    const roles = [];
    let started = false;
    for (const on of flags) {
      if (on) { roles.push('note'); started = true; }
      else roles.push(started ? 'hold' : 'rest');
    }
    return roles;
  }

  /* Walk the piece the way it is drawn: a run tuplet is one group, a run
     of linked beats is one group, and anything else is a beat on its own. */
  function enumerateRhythmGroups(totalBeats) {
    const groups = [];
    let b = 0;
    while (b < totalBeats) {
      const run = findTupletRun(b);
      if (run && run.start === b) {
        groups.push({ start: b, end: Math.min(b + run.beats - 1, totalBeats - 1) });
        b += run.beats;
        continue;
      }
      const linked = getLinkGroup(b);
      const end = Math.min(Math.max(linked.end, b), totalBeats - 1);
      groups.push({ start: b, end: end });
      b = end + 1;
    }
    return groups;
  }

  /* Describe a beat, or a run of beats read together, for the engraver:
     what each circle is worth, which beat it belongs to, and which
     stretches are tuplets. This is the one place that knows how the
     circles on screen translate into time. */
  function buildSlotMap(startBeat, endBeat, displayWords) {
    const state = getActiveState();
    const bt = beatTicks(state);
    const roles = [], slotTicks = [], slotBeat = [], slotSubGroup = [], tuplets = [];

    const run = findTupletRun(startBeat, state);
    if (run && run.start === startBeat) {
      const T = (run.beats * bt) / run.slots;
      const cells = currentMode === 'rhythm'
        ? getTupletCells(run.start, run.slots, rhythmState) : [];
      const flags = [];
      for (let i = 0; i < run.slots; i++) flags.push(!!cells[i]);
      const r = rolesFromFlags(flags);
      for (let i = 0; i < run.slots; i++) {
        roles.push(r[i]);
        slotTicks.push(T);
        const beatOf = Math.floor((i * T) / bt);
        slotBeat.push(beatOf);
        slotSubGroup.push(beatOf);
      }
      tuplets.push({ from: 0, to: run.slots - 1, count: 3, inSpaceOf: 2, show: 3 });
      return { roles, slotTicks, slotBeat, slotSubGroup, tuplets, span: run.beats, totalSlots: run.slots };
    }

    const flags = [];
    let idx = 0;
    for (let b = startBeat; b <= endBeat; b++) {
      const S = getBeatSubdivision(b, state);
      const T = bt / S;
      const tup = beatSlotTuplet(S, state);
      if (tup) tuplets.push({ from: idx, to: idx + S - 1, count: tup.count, inSpaceOf: tup.inSpaceOf, show: tup.show });
      const states = getBeatActiveStates(b, displayWords);
      for (let i = 0; i < S; i++) {
        flags.push(!!states[i]);
        slotTicks.push(T);
        slotBeat.push(b - startBeat);
        // six circles to a beat are read in twos
        slotSubGroup.push((b - startBeat) * 100 + (S === 6 ? Math.floor(i / 2) : 0));
        idx++;
      }
    }
    for (const r of rolesFromFlags(flags)) roles.push(r);
    return { roles, slotTicks, slotBeat, slotSubGroup, tuplets, span: endBeat - startBeat + 1, totalSlots: idx };
  }

  /* Every circle across a linked run, as one array. */
  function getLinkGroupFlags(group, displayWords) {
    const flags = [];
    for (let b = group.start; b <= group.end; b++) {
      const states = getBeatActiveStates(b, displayWords);
      for (const st of states) flags.push(!!st);
    }
    return flags;
  }

  /* A linked run whose every beat sits at the natural division — the only
     shape the span vocabulary knows how to talk about. Anything finer, or
     anything a run tuplet owns, is left to its beats. */
  function uniformLinkRun(beatIndex) {
    const state = getActiveState();
    if (!isBeatInJoinedRun(beatIndex)) return null;
    const group = getLinkGroup(beatIndex);
    if (group.length < 2) return null;
    const slots = naturalSlots(familyOf(state));
    for (let b = group.start; b <= group.end; b++) {
      if (getBeatSubdivision(b, state) !== slots) return null;
      if (findTupletRun(b, state)) return null;
    }
    return { start: group.start, end: group.end, length: group.length, slots: slots };
  }

  function linkRunFlags(run) {
    const words = currentMode === 'rhythm' ? [] : poetryState.words;
    const flags = [];
    for (let b = run.start; b <= run.end; b++) {
      for (const st of getBeatActiveStates(b, words)) flags.push(!!st);
    }
    return flags;
  }

  function writeLinkRunFlags(run, flags) {
    let i = 0;
    for (let b = run.start; b <= run.end; b++) {
      const cells = [];
      for (let k = 0; k < run.slots; k++) cells.push(!!flags[i++]);
      if (currentMode === 'rhythm') rhythmState.beats[b] = cells;
      else writePoetryBeatRaw(getBeatStartIndex(b, poetryState), cells);
    }
    if (currentMode !== 'rhythm') redistributeLyrics();
  }

  function toggleBeatLink(leftBeatIndex) {
    if (!rhythmEditable()) return;
    if (!joinAllowed('link') && !isBeatLinked(leftBeatIndex)) return;
    const activeState = getActiveState();
    if (!activeState.linkedBeats) activeState.linkedBeats = {};
    if (activeState.linkedBeats[leftBeatIndex]) {
      delete activeState.linkedBeats[leftBeatIndex];
    } else {
      activeState.linkedBeats[leftBeatIndex] = true;
    }
    render();
  }

  function getBeatActiveStates(beatIndex, displayWords) {
    const S = getBeatSubdivision(beatIndex);
    const states = [];
    if (currentMode === 'rhythm') {
      if (!rhythmState.beats[beatIndex]) {
        rhythmState.beats[beatIndex] = new Array(S).fill(true);
      }
      while (rhythmState.beats[beatIndex].length < S) {
        rhythmState.beats[beatIndex].push(false);
      }
      if (rhythmState.beats[beatIndex].length > S) {
        rhythmState.beats[beatIndex].length = S;
      }
      for (let s = 0; s < S; s++) {
        states.push(!!rhythmState.beats[beatIndex][s]);
      }
    } else {
      const startCircle = getBeatStartIndex(beatIndex);
      for (let s = 0; s < S; s++) {
        states.push(isPositionActive(startCircle + s, displayWords));
      }
    }
    return states;
  }

  function dismantleSyncopation(syncStartIndex) {
      if (currentMode === 'rhythm') return;
      const syncTriggerPos = syncStartIndex + 1;
      const syncopationIndex = poetryState.syncopation.indexOf(syncTriggerPos);
  
      if (syncopationIndex === -1) return;
  
      if (syncStartIndex + 3 < poetryState.words.length && poetryState.words[syncStartIndex + 2] === '-') {
          const w1 = poetryState.words[syncStartIndex];
          const w2 = poetryState.words[syncStartIndex + 1];
          const w3 = poetryState.words[syncStartIndex + 3];
  
          const replacement = [];
          if (w1 !== '-') replacement.push(w1);
          if (w2 !== '-') replacement.push(w2);
          if (w3 !== '-') replacement.push(w3);
  
          poetryState.words.splice(syncStartIndex, 4, ...replacement);
  
          const affectedBeatStart = syncStartIndex + 2;
          delete poetryState.syncopationStates[affectedBeatStart];
          delete poetryState.syncopationStates[affectedBeatStart + 1];
          poetryState.syncopation.splice(syncopationIndex, 1);
  
          const lengthChange = replacement.length - 4;
          for (let i = 0; i < poetryState.syncopation.length; i++) {
              if (poetryState.syncopation[i] > syncTriggerPos) {
                  poetryState.syncopation[i] += lengthChange;
              }
          }
      }
  }

  function getChantText(activeStates, system, circlesPerBeat) {
    const pattern = activeStates.map(a => a ? 'B' : 'G').join('/');
    const systemData = rhythmSystems[system];
    if (systemData && systemData[circlesPerBeat] && systemData[circlesPerBeat][pattern]) {
      return systemData[circlesPerBeat][pattern];
    }

    /* The finer divisions are spoken rather than tabulated: six to a beat
       reads as three pairs, taking the main syllable from the system's own
       three-to-a-beat set and its filler on the second of each pair, which
       is how Gordon and Takadimi name them. Twelve across a linked run is
       four such groups of three. */
    if (systemData && circlesPerBeat === 6 && systemData.six) {
      const { main, filler } = systemData.six;
      return activeStates.map((on, i) =>
        on ? (i % 2 === 0 ? main[(i / 2) | 0] : filler[((i - 1) / 2) | 0]) : '-');
    }
    if (systemData && circlesPerBeat === 12 && systemData.six) {
      const main = systemData.six.main;
      return activeStates.map((on, i) => on ? main[i % 3] : '-');
    }
    if (systemData && systemData['3'] && circlesPerBeat === 3) {
      const row = systemData['3']['B/B/B'];
      if (row) return activeStates.map((on, i) => on ? row[i] : '-');
    }
    return activeStates.map(a => a ? '?' : '-');
  }

  function getCircleColor(circlesInThisBeat, activeStates, circleIndex, beatIndex, displayWords) {
    const isActive = activeStates[circleIndex];

    /* A run tuplet's circles belong to the run, not to any one beat, so
       they are read straight off what was passed in. */
    if (beatIndex !== undefined && findTupletRun(beatIndex)) {
      const role = rolesFromFlags(activeStates)[circleIndex];
      return role === 'note' ? 'active' : role === 'hold' ? 'sustain' : 'inactive';
    }
    if (circlesInThisBeat === 2) {
      // A linked run is read as one span: the first active circle starts a
      // note, later inactive circles hold it, leading ones are silence.
      if (beatIndex !== undefined && isBeatInJoinedRun(beatIndex)) {
        const group = getLinkGroup(beatIndex);
        const roles = rolesFromFlags(getLinkGroupFlags(group, displayWords));
        let offset = 0;
        for (let b = group.start; b < beatIndex; b++) offset += getBeatSubdivision(b);
        const role = roles[offset + circleIndex];
        if (role === 'note') return 'active';
        if (role === 'hold') return 'sustain';
        return 'inactive';
      }

      // Unlinked 2-circle simple time:
      if (activeStates[0] && !activeStates[1]) {
        if (circleIndex === 0) return 'active';
        if (circleIndex === 1) return 'sustain'; // light blue
      }
      return isActive ? 'active' : 'inactive';
    } else if (circlesInThisBeat === 3) {
      /* Compound beats are only ever linked by EASY (a dotted half, a
         dotted whole), and a link is read as one span, as above. */
      if (beatIndex !== undefined && isCompoundTime() && isBeatInJoinedRun(beatIndex)) {
        const group = getLinkGroup(beatIndex);
        const roles = rolesFromFlags(getLinkGroupFlags(group, displayWords));
        let offset = 0;
        for (let b = group.start; b < beatIndex; b++) offset += getBeatSubdivision(b);
        const role = roles[offset + circleIndex];
        return role === 'note' ? 'active' : role === 'hold' ? 'sustain' : 'inactive';
      }
      // 3-circle compound time (light blue for sustains):
      // XOO: Dotted quarter note [true, false, false]
      if (activeStates[0] && !activeStates[1] && !activeStates[2]) {
        if (circleIndex === 0) return 'active';
        return 'sustain';
      }
      // XXO: 8th note + Quarter note [true, true, false]
      if (activeStates[0] && activeStates[1] && !activeStates[2]) {
        if (circleIndex === 0) return 'active';
        if (circleIndex === 1) return 'active';
        if (circleIndex === 2) return 'sustain';
      }
      // XOX: Quarter note + 8th note [true, false, true]
      if (activeStates[0] && !activeStates[1] && activeStates[2]) {
        if (circleIndex === 0) return 'active';
        if (circleIndex === 1) return 'sustain';
        if (circleIndex === 2) return 'active';
      }
      // OXO: 8th rest + Quarter note [false, true, false]
      if (!activeStates[0] && activeStates[1] && !activeStates[2]) {
        if (circleIndex === 0) return 'inactive';
        if (circleIndex === 1) return 'active';
        if (circleIndex === 2) return 'sustain';
      }
      return isActive ? 'active' : 'inactive';
    } else if (circlesInThisBeat === 4) {
      // 16th note blocks (4 circles) -> use sustain-green for held durations
      const pat = (activeStates[0] ? 'X' : 'O') +
                  (activeStates[1] ? 'X' : 'O') +
                  (activeStates[2] ? 'X' : 'O') +
                  (activeStates[3] ? 'X' : 'O');

      const patternColorMap = {
        'XXXX': ['active', 'active', 'active', 'active'],
        'OOOO': ['inactive', 'inactive', 'inactive', 'inactive'],
        'XOOO': ['active', 'sustain-green', 'sustain-green', 'sustain-green'],
        'XOXO': ['active', 'sustain-green', 'active', 'sustain-green'],
        'XOOX': ['active', 'sustain-green', 'sustain-green', 'active'],
        'OXOX': ['inactive', 'active', 'sustain-green', 'active'],
        'OOXO': ['inactive', 'inactive', 'active', 'sustain-green'],
        'XXOO': ['active', 'active', 'inactive', 'inactive'],
        'XXOX': ['active', 'active', 'sustain-green', 'active'],
        'XXXO': ['active', 'active', 'active', 'sustain-green'],
        'XOXX': ['active', 'sustain-green', 'active', 'active'],
        'OOXX': ['inactive', 'inactive', 'active', 'active'],
        'OOOX': ['inactive', 'inactive', 'inactive', 'active'],
        'OXOO': ['inactive', 'active', 'sustain-green', 'sustain-green'],
        'OXXO': ['inactive', 'active', 'active', 'sustain-green'],
        'OXXX': ['inactive', 'active', 'active', 'active']
      };

      if (patternColorMap[pat]) {
        return patternColorMap[pat][circleIndex];
      }
      return isActive ? 'active' : 'inactive';
    }
    /* everything else - sextuplets and the like - reads by the general rule */
    const role = rolesFromFlags(activeStates)[circleIndex];
    return role === 'note' ? 'active' : role === 'hold' ? 'sustain' : 'inactive';
  }

  /* ---- EASY ----------------------------------------------------------
     The circles write whole shapes, but what is stored is exactly what the
     ordinary circles would have stored — subdivisions, flags and links —
     so the notation, playback, sharing and the Music Stand need to know
     nothing about it, and a piece written in EASY opens in the ordinary
     circles as the same rhythm. Ostinato Builder 2.0 carries the same
     block, written against its own model. */

  /* This family's circles, in colour order. */
  function easySet(fam) {
    fam = fam || familyOf();
    return layout.easy[fam].map(id => easyChoice(fam, id)).filter(Boolean);
  }

  /* Can a choice this many beats long start here? It has to stay inside
     the measure — links never cross a barline — and start where that note
     normally starts: a half note on 1 or 3 in 4/4, a whole note on 1. A
     measure that does not divide by the note's length (a half in 3/4, a
     dotted half in 4/4) takes it wherever it fits. A pickup is too short
     to hold anything longer than a beat. */
  function easyFits(beatIndex, span) {
    if (span <= 1) return true;
    const per = getLayoutConfig().beatsPerMeasure;
    let offset = beatIndex;
    if (getActiveState().hasPickupMeasure) {
      if (beatIndex === 0) return false;
      offset = beatIndex - 1;
    }
    offset = offset % per;
    if (offset + span > per) return false;
    return per % span !== 0 || offset % span === 0;
  }

  /* What a run of beats sounds like, as a key: how many beats, and the
     tick each note starts on. XOOO on sixteenths and XO on eighths are the
     same quarter note and get the same key, so the right circle lights
     whichever grid the rhythm happens to be written on. */
  function easyKey(beats) {
    const bt = beatTicks();
    const onsets = [];
    beats.forEach((beat, b) => {
      const per = bt / beat.slots;
      beat.cells.forEach((on, i) => { if (on) onsets.push(Math.round(b * bt + i * per)); });
    });
    return beats.length + ':' + onsets.join(',');
  }

  function easyChoiceKey(choice) {
    return easyKey(choice.beats.map(p => ({ slots: p.length, cells: patternToFlags(p) })));
  }

  function easyBeatsOf(start, end) {
    const words = currentMode === 'rhythm' ? [] : poetryState.words;
    const out = [];
    for (let b = start; b <= end; b++) {
      out.push({ slots: getBeatSubdivision(b), cells: getBeatActiveStates(b, words) });
    }
    return out;
  }

  /* The run a beat belongs to as EASY sees it. A run tuplet is a group of
     its own that no circle ever matches. */
  function easyGroup(beatIndex) {
    const run = findTupletRun(beatIndex);
    if (run) return { start: run.start, end: run.start + run.beats - 1, tuplet: true };
    const g = getLinkGroup(beatIndex);
    return { start: g.start, end: g.end, tuplet: false };
  }

  /* Which circle this group is, as an index into easySet(), or -1. */
  function easyLit(group) {
    if (group.tuplet) return -1;
    const key = easyKey(easyBeatsOf(group.start, group.end));
    return easySet().findIndex(c => easyChoiceKey(c) === key);
  }

  /* The lyric grid's two copies — the words on screen and the canonical
     grid under them — agree before anything moves. */
  function easySyncPoetry() {
    poetryState.words = sanitizeWordsArray(poetryState.words);
    poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words, poetryState);
    poetryState.words = fromCanonical12(poetryState.canonical12, poetryState);
  }

  /* Write flags into a beat on whichever side is showing. On the Poetry
     side the beat's circles are positions in the lyric grid, and the
     words re-flow afterwards (see redistributeLyrics). */
  function easyWriteBeat(beatIndex, flags) {
    if (currentMode === 'rhythm') rhythmState.beats[beatIndex] = flags.slice();
    else writePoetryBeatRaw(getBeatStartIndex(beatIndex, poetryState), flags);
  }

  /* A tap on a circle. The lit one goes silent — the same length of rest,
     so a half note becomes a half rest. Any other writes its rhythm here,
     taking apart whatever links, run triplets or syncopations it lands
     across: a half note losing its second beat becomes a quarter, and a
     beat freed from under a longer note is left as a rest. */
  function easyTap(beatIndex, choice) {
    if (!rhythmEditable()) return;
    const state = getActiveState();
    const isRhythm = currentMode === 'rhythm';
    if (!state.linkedBeats) state.linkedBeats = {};
    if (!isRhythm) easySyncPoetry();

    const group = easyGroup(beatIndex);
    const lit = group.start === beatIndex && !group.tuplet
      && easyKey(easyBeatsOf(group.start, group.end)) === easyChoiceKey(choice);

    if (lit) {
      for (let b = group.start; b <= group.end; b++) {
        easyWriteBeat(b, new Array(getBeatSubdivision(b)).fill(false));
      }
    } else {
      const span = choice.beats.length;
      if (!easyFits(beatIndex, span)) return;
      const last = beatIndex + span - 1;

      for (let b = beatIndex; b <= last; b++) {
        const run = findTupletRun(b, state);
        if (run) {
          delete state.tuplets[run.start];
          if (state.tupletCells) delete state.tupletCells[run.start];
        }
      }
      /* A syncopation from an older piece joins beats the way a link does,
         and is taken apart the same way. It reshapes the lyric grid, so
         the two copies are made to agree again after it. */
      if (!isRhythm && poetryState.syncopation.length) {
        for (let b = Math.max(0, beatIndex - 1); b <= last; b++) {
          if (syncopationJoinsBeat(b)) dismantleSyncopation(getBeatStartIndex(b));
        }
        easySyncPoetry();
      }
      for (let b = beatIndex; b <= last; b++) {
        const g = getLinkGroup(b);
        for (let j = g.start; j < g.end; j++) delete state.linkedBeats[j];
      }

      choice.beats.forEach((pattern, k) => setBeatSubdivision(beatIndex + k, pattern.length, state));
      if (!isRhythm) poetryState.words = fromCanonical12(poetryState.canonical12, poetryState);
      choice.beats.forEach((pattern, k) => easyWriteBeat(beatIndex + k, patternToFlags(pattern)));
      for (let k = 0; k < span - 1; k++) state.linkedBeats[beatIndex + k] = true;
    }

    if (isRhythm) {
      render();
    } else {
      redistributeLyrics();
      commitAndUpdateView();
    }
  }

  function buildEasyRow(beatIndex) {
    const row = document.createElement('div');
    row.className = 'easy-row';
    const set = easySet();
    const group = easyGroup(beatIndex);
    const lit = easyLit(group);

    /* A beat under a note that started earlier shows it is taken: the row
       is washed in that note's colour. Its circles still work, and tapping
       one cuts the long note short. */
    if (group.start !== beatIndex) {
      row.classList.add('held');
      if (lit >= 0) row.style.setProperty('--held', EASY_COLOURS[lit]);
    }

    set.forEach((choice, i) => {
      if (!easyFits(beatIndex, choice.beats.length)) return;
      const on = group.start === beatIndex && lit === i;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'easy-choice' + (on ? ' on' : '');
      btn.style.setProperty('--c', EASY_COLOURS[i]);
      btn.title = on ? choice.name + ' — tap again for a rest' : choice.name;
      btn.setAttribute('aria-label', choice.name);
      btn.setAttribute('aria-pressed', String(on));
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        easyTap(beatIndex, choice);
      });
      row.appendChild(btn);
    });
    return row;
  }

  /* How wide a row of n circles is, border to border — read off the same
     --dot the stylesheet draws them at, so the two cannot disagree. */
  const EASY_GAP = 6;
  const EASY_PAD = 8;
  function easyRowWidth(n) {
    if (!n) return 0;
    const dot = parseFloat(getComputedStyle(container).getPropertyValue('--dot')) || 26;
    return n * dot + (n - 1) * EASY_GAP + EASY_PAD * 2 + 3;
  }

  function createBeatGroup(beatIndex, beatStartPosition, config, displayWords) {
    const group = document.createElement('div');
    group.className = 'group';

    const activeState = getActiveState();
    const isRhythm = currentMode === 'rhythm';

    /* A run tuplet spreads its notes across several beats, so the run's
       first beat draws all of them and the beats it covers step aside. */
    const tupletRun = findTupletRun(beatIndex, activeState);
    if (tupletRun && tupletRun.start !== beatIndex) {
      group.classList.add('swallowed');
      group.dataset.beatIndex = String(beatIndex);
      // the beat still counts for playback; it is lit through the run's box
      notesBoxElements[beatIndex] = notesBoxElements[tupletRun.start] || null;
      return group;
    }

    /* Double-click the first beat to toggle the pickup measure — a mouse
       shortcut for what the View popover's Pickup switch also does.
       Two guards, both learned the hard way:
       - Not on a coarse pointer. On a board, tapping a circle twice to
         turn a note on and then off again is a double-tap, and the piece
         would silently re-lay itself out underneath the class.
       - Not when the second click landed on a circle. The circle's own
         click handler calls stopPropagation(), but dblclick is a separate
         event and bubbles regardless, so correcting a note in beat one
         used to flip the pickup on a mouse too. */
    if (beatIndex === 0 && rhythmEditable() && joinAllowed('pickup')) {
        group.addEventListener('dblclick', (e) => {
            if (!canHoverPrecisely()) return;
            if (e.target.closest('.circle, .easy-choice')) return;
            e.preventDefault();
            activeState.hasPickupMeasure = !activeState.hasPickupMeasure;
            render();
        });
    }

    /* In EASY the circles are still laid out, only unseen: the notation is
       placed on their centres, so they are what keeps it on its grid. The
       coloured circles sit over the same pill. */
    const easy = easyOn();
    const circlesDiv = document.createElement('div');
    circlesDiv.className = 'circles';
    if (easy) circlesDiv.classList.add('easy');
    if (!view.showDots) circlesDiv.classList.add('circles-hidden');
    if (!rhythmEditable()) circlesDiv.classList.add('frozen');
    
    if (beatIndex === 0 && activeState.hasPickupMeasure) {
        circlesDiv.classList.add('pickup');
    }
    if (isBeatInLinkedPair(beatIndex)) {
        circlesDiv.classList.add('linked');
    }

    const circlesInThisBeat = tupletRun ? tupletRun.slots : getBeatSubdivision(beatIndex);
    // the column grid every row of this beat shares
    group.style.setProperty('--slots', String(circlesInThisBeat));
    group.dataset.beatIndex = String(beatIndex);
    if (tupletRun) {
      group.classList.add('tuplet-run');
      group.dataset.tupletBeats = String(tupletRun.beats);
    }

    /* + splits this one beat into its sixteenths and back, even when the
       beat is linked to others. - is a different control entirely: it
       walks the opposite grouping, across the whole run when beats are
       linked. */
    /* In a lesson these two are the first things to go. A division the
       teacher did not offer means no button at all rather than a dead one
       — except where the beat is already there, which always stays
       escapable so a student can never be stranded inside a shape the
       lesson cannot reach. */
    const sixteenths = sixteenthSubdivision(activeState);
    const minusCtx = easy ? null : tripletContextFor(beatIndex);
    const showPlus = rhythmEditable() && !easy &&
      (divisionIsReachable(sixteenths, activeState) || circlesInThisBeat === sixteenths);
    const showMinus = !!minusCtx;

    if (showPlus || showMinus) {
      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'beat-subdivision-controls';

      const inTuplet = !!tupletRun || !!beatSlotTuplet(circlesInThisBeat, activeState);

      if (showPlus) {
      const plusBtn = document.createElement('button');
      plusBtn.className = 'subdivision-btn plus-btn';
      plusBtn.textContent = '+';
      plusBtn.title = inTuplet
        ? 'Leave the triplet first, with the − button'
        : (circlesInThisBeat === sixteenths ? 'Back to this beat\u2019s normal division' : 'Split this beat into sixteenths');
      if (!inTuplet && circlesInThisBeat === sixteenths) plusBtn.classList.add('active');
      plusBtn.disabled = inTuplet;
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBeatSixteenths(beatIndex);
      });
      controlsDiv.appendChild(plusBtn);
      }

      if (showMinus) {
      const ctx = minusCtx;
      const minusBtn = document.createElement('button');
      minusBtn.className = 'subdivision-btn minus-btn';
      minusBtn.textContent = '−';
      if (ctx.level >= 0) minusBtn.classList.add('active');
      minusBtn.title = !ctx.ladder.length
        ? 'Back to this beat\u2019s normal division'
        : ctx.kind === 'run'
          ? (ctx.level < 0 ? 'Spread a triplet across these ' + ctx.beats + ' beats' : 'Divide the triplet further, then off')
          : (ctx.level < 0 ? (isCompoundTime(activeState) ? 'Two in the time of three' : 'Triplet') : 'Divide it further, then off');
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleBeatTriplet(beatIndex);
      });
      controlsDiv.appendChild(minusBtn);
      }

      // One control on its own sits where the pair would, not centred.
      if (showPlus !== showMinus) controlsDiv.classList.add('single');
      circlesDiv.appendChild(controlsDiv);
    }

    /* The chain between this beat and the next, when both sit at the plain
       division in one measure. Compound time does not offer one — except
       where EASY has already linked two beats for a dotted half, which
       must stay undoable once the ordinary circles are back. No chains at
       all in EASY: its circles make and break links themselves. */
    const plain = defaultSubdivision(activeState);
    if (rhythmEditable() && !easy && (joinAllowed('link') || isBeatLinked(beatIndex)) &&
        (activeState.timeSignatureDenominator !== 8 || isBeatLinked(beatIndex)) &&
        circlesInThisBeat === plain && areBeatsInSameMeasure(beatIndex, beatIndex + 1) &&
        getBeatSubdivision(beatIndex + 1) === plain) {
      const linkBtn = document.createElement('button');
      linkBtn.className = 'beat-link-btn';
      if (isBeatLinked(beatIndex)) {
        linkBtn.classList.add('active');
      }
      linkBtn.title = 'Link beat boxes';
      linkBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
      </svg>`;
      linkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBeatLink(beatIndex);
      });
      circlesDiv.appendChild(linkBtn);
    }

    const activeStates = [];
    if (isRhythm && tupletRun) {
      const cells = getTupletCells(tupletRun.start, tupletRun.slots, rhythmState);
      for (let s2 = 0; s2 < circlesInThisBeat; s2++) activeStates.push(!!cells[s2]);
    } else if (isRhythm) {
      if (!rhythmState.beats[beatIndex]) {
        rhythmState.beats[beatIndex] = new Array(circlesInThisBeat).fill(true);
      }
      while (rhythmState.beats[beatIndex].length < circlesInThisBeat) {
        rhythmState.beats[beatIndex].push(false);
      }
      if (rhythmState.beats[beatIndex].length > circlesInThisBeat) {
        rhythmState.beats[beatIndex].length = circlesInThisBeat;
      }
      for (let s = 0; s < circlesInThisBeat; s++) {
        activeStates.push(!!rhythmState.beats[beatIndex][s]);
      }
    } else {
      for (let s = 0; s < circlesInThisBeat; s++) {
        const idx = beatStartPosition + s;
        activeStates.push(isPositionActive(idx, displayWords));
      }
    }

    for (let circleIndex = 0; circleIndex < circlesInThisBeat; circleIndex++) {
        const circle = document.createElement('span');
        circle.className = 'circle';
        const idx = beatStartPosition + circleIndex;

        if (!isRhythm && poetryState.syncopation.includes(idx)) {
            circle.classList.add('syncopated');
        } else {
            const color = getCircleColor(circlesInThisBeat, activeStates, circleIndex, beatIndex, displayWords);
            if (color === 'active') {
                circle.classList.add('active');
            } else if (color === 'sustain' || color === 'light-blue') {
                circle.classList.add('sustain');
            } else if (color === 'sustain-green' || color === 'light-green') {
                circle.classList.add('sustain-green');
            }
        }

        /* A dot the lesson has frozen carries no handler at all, so it also
           loses its hover and its pointer — nothing looks tappable and then
           refuses. Under EASY the circles are only there to be measured. */
        if (rhythmEditable() && !easy) {
        circle.addEventListener('click', (e) => {
            e.stopPropagation();

            /* Inside a linked run the span vocabulary governs and the
               per-beat one does not: an O following a note is a hold
               there, not a rest, so asking whether this beat's shape is
               an allowed *beat* would answer a different question. */
            const run = (!isRhythm && poetryState.syncopation.length > 0)
              ? null : uniformLinkRun(beatIndex);
            if (run) {
                const before = linkRunFlags(run);
                const after = before.slice();
                const at = (beatIndex - run.start) * run.slots + circleIndex;
                after[at] = !after[at];
                writeLinkRunFlags(run, resolveSpan(before, after, run.length, activeState));
                if (isRhythm) render(); else commitAndUpdateView();
                return;
            }

            if (isRhythm && tupletRun) {
              const cells = getTupletCells(tupletRun.start, tupletRun.slots, rhythmState);
              const before = [];
              for (let i = 0; i < tupletRun.slots; i++) before.push(!!cells[i]);
              const after = before.slice();
              after[circleIndex] = !after[circleIndex];
              const settled = resolveCell(before, after, tupletRun.slots, activeState);
              for (let i = 0; i < tupletRun.slots; i++) cells[i] = settled[i];
              render();
              return;
            }
            if (isRhythm) {
              const before = beatFlags(beatIndex, beatStartPosition);
              const after = before.slice();
              after[circleIndex] = !after[circleIndex];
              rhythmState.beats[beatIndex] = resolveCell(before, after, circlesInThisBeat, activeState);
              render();
              return;
            }

            // Lyric mode behavior
            for (let i = poetryState.syncopation.length - 1; i >= 0; i--) {
                const syncTriggerPos = poetryState.syncopation[i];
                const syncStartIndex = syncTriggerPos - 1;
                if (idx === syncStartIndex - 1 || idx === syncStartIndex) {
                    dismantleSyncopation(syncStartIndex);
                }
            }

            while (poetryState.words.length <= idx) {
                poetryState.words.push('-');
            }

            if (poetryState.syncopation.includes(idx)) {
                dismantleSyncopation(idx - 1);
                commitAndUpdateView();
                return;
            }

            if (isAffectedBySyncopation(idx)) {
                poetryState.syncopationStates[idx] = !poetryState.syncopationStates[idx];
            } else {
                const before = beatFlags(beatIndex, beatStartPosition);
                applyIsolatedRhythmChange(idx);
                /* Same rule as the Rhythm side, applied to the lyric grid:
                   the words re-flow across whatever notes end up sounding,
                   so settling a beat onto a legal shape never costs one. */
                if (policy && poetryState.syncopation.length === 0) {
                    const after = beatFlags(beatIndex, beatStartPosition);
                    if (!cellAllowed(after, circlesInThisBeat, activeState)) {
                        writePoetryBeat(beatStartPosition,
                            resolveCell(before, after, circlesInThisBeat, activeState));
                    }
                }
            }
            commitAndUpdateView();
        });
        }
        circlesDiv.appendChild(circle);
    }
    if (easy) circlesDiv.appendChild(buildEasyRow(beatIndex));
    group.appendChild(circlesDiv);

    const notesBox = document.createElement('div');
    notesBox.className = 'notes-box';
    if (beatIndex < notesBoxElements.length) {
        notesBoxElements[beatIndex] = notesBox;
    } else {
        notesBoxElements.push(notesBox);
    }
    
    if (beatIndex === activeState.selectedPlayStartPosition) {
        notesBox.classList.add('selected');
    }
    if ((isPlaying || isPaused) && beatIndex === currentPlayPosition) {
        notesBox.classList.add('playing');
    }

    notesBox.addEventListener('click', () => {
        if (activeState.selectedPlayStartPosition === beatIndex) {
            activeState.selectedPlayStartPosition = null;
        } else {
            activeState.selectedPlayStartPosition = beatIndex;
        }
        render();
    });

    /* ---- the printed rhythm ----------------------------------------
       A beat draws itself, unless it is part of a linked run, in which
       case the first beat of the run draws the whole span and the rest
       leave their box empty. The drawing is placed after layout, once
       the real circle positions are known, so the notes line up with the
       dots and the words no matter how the grid has been sized. */
    if (circlesInThisBeat === 4) notesBox.classList.add('sixteenth');
    else if (circlesInThisBeat === 3) notesBox.classList.add('compound');

    // Hoisted so the chant text below can also tell whether this beat
    // starts a linked run, and what the run's full pattern is - a half,
    // dotted half or whole note reads as one sustained syllable, not the
    // per-beat word a plain quarter would get.
    const beatIsJoined = isBeatInJoinedRun(beatIndex);
    const isJoinStart = isLinkGroupStart(beatIndex);
    const linkGroup = isJoinStart ? getLinkGroup(beatIndex) : { start: beatIndex, end: beatIndex, length: 1 };
    let fullRunRoles = null;

    if (beatIsJoined && !isJoinStart) {
      notesBox.classList.add('continues');       // drawn by the run's first beat
    } else {
      const map = buildSlotMap(linkGroup.start, linkGroup.end, displayWords);
      /* A lone beat keeps the app's own reading of its circles, which has
         deliberate exceptions - two sixteenths and a rest, say - that the
         general rule would flatten. */
      if (!tupletRun && linkGroup.length === 1) {
        map.roles = activeStates.map((on, i) => {
          if (!isRhythm && poetryState.syncopation.includes(beatStartPosition + i)) return 'note';
          const colour = getCircleColor(circlesInThisBeat, activeStates, i, beatIndex, displayWords);
          if (colour === 'active') return 'note';
          if (colour === 'inactive') return 'rest';
          return 'hold';
        });
      }
      fullRunRoles = map.span > 1 ? map.roles : null;
      notesBox._slotMap = map;
      notesBox.dataset.roles = map.roles.join(',');
      notesBox.dataset.span = String(map.span);
      pendingNotation.push(notesBox);
    }

    group.appendChild(notesBox);

    // Fruit Rhythms names a held note that spans a whole linked run of
    // beats - a half, dotted half or whole note - with one word of its
    // own, instead of the per-beat fruit word a plain quarter would use.
    const FRUIT_SPAN_WORDS = { 2: 'Orange', 3: 'Oreo', 4: 'Baha honey' };
    const fruitSpanWord =
      rhythmState.currentRhythmSystem === 'Fruit Rhythms' &&
      isJoinStart && linkGroup.length > 1 && fullRunRoles &&
      fullRunRoles[0] === 'note' && fullRunRoles.slice(1).every(r => r === 'hold')
        ? FRUIT_SPAN_WORDS[linkGroup.length]
        : null;

    if (isRhythm) {
        const chantSyllables = getChantText(activeStates, rhythmState.currentRhythmSystem, circlesInThisBeat);
        const chantDiv = document.createElement('div');
        chantDiv.className = 'words';
        if (circlesInThisBeat === 4) {
            chantDiv.classList.add('sixteenth-chant');
        } else if (circlesInThisBeat === 3) {
            chantDiv.classList.add('triplet-chant');
        } else if (circlesInThisBeat === 2) {
            chantDiv.classList.add('eighth-chant');
        }

        const pattern = activeStates.map(a => a ? 'B' : 'G').join('/');

        if (fruitSpanWord) {
            // Starts under the notehead (the run's first slot), not
            // centred, and never widens the measure - see the CSS.
            chantDiv.classList.add('span-word');
            const wc = document.createElement('span');
            wc.className = 'word-container';

            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = fruitSpanWord;
            wc.appendChild(span);
            chantDiv.appendChild(wc);
        } else if ((pattern === 'B/G/G/G' && circlesInThisBeat === 4) || (pattern === 'B/G/G' && circlesInThisBeat === 3)) {
            chantDiv.classList.add('single-syllable-whole');
            const wc = document.createElement('span');
            wc.className = 'word-container';

            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = chantSyllables[0];
            wc.appendChild(span);
            chantDiv.appendChild(wc);
        } else {
            chantSyllables.forEach((syllable, i) => {
                const wc = document.createElement('span');
                wc.className = 'word-container';

                const span = document.createElement('span');
                span.className = 'word';
                if (syllable === '-') {
                    span.classList.add('rest');
                }
                span.textContent = syllable;
                wc.appendChild(span);
                chantDiv.appendChild(wc);
            });
        }
        group.appendChild(chantDiv);
    } else {
        const wordsDiv = document.createElement('div');
        wordsDiv.className = 'words';
        for (let circleIndex = 0; circleIndex < circlesInThisBeat; circleIndex++) {
            const idx = beatStartPosition + circleIndex;
            const wc = document.createElement('span');
            wc.className = 'word-container';
            if (idx === editingIndex && wordsEditable()) {
                const input = document.createElement('input');
                input.type = 'text';
                input.value = displayWords[idx];
                input.className = 'word-input';
                wc.appendChild(input);
                wordsDiv.appendChild(wc);
                setTimeout(() => { input.focus(); input.select(); });
                function cleanup() { input.removeEventListener('keydown', onKey); input.removeEventListener('blur', onBlur); }
                function onKey(e) {
                    if (e.key === 'Enter') { 
                      e.preventDefault(); 
                      poetryState.words[idx] = input.value; 
                      editingIndex = null; 
                      cleanup(); 
                      syncRawLyricsFromWords();
                      commitAndUpdateView(); 
                    }
                    else if (e.key === 'Escape') { e.preventDefault(); editingIndex = null; cleanup(); render(); }
                    else if (e.key === ' ' || e.code === 'Space') { 
                        e.preventDefault(); 
                        poetryState.words[idx] = input.value === '' ? '-' : input.value;
                        editingIndex = idx + 1; 
                        if (editingIndex >= poetryState.words.length) {
                            poetryState.words.push('-');
                        }
                        cleanup(); 
                        syncRawLyricsFromWords();
                        commitAndUpdateView();
                    }
                    else if ((e.key === 'Backspace' || e.key === 'Delete') && input.value === '') { 
                      e.preventDefault(); 
                      poetryState.words[idx] = '-'; 
                      editingIndex = Math.max(idx - 1, 0); 
                      cleanup(); 
                      syncRawLyricsFromWords();
                      commitAndUpdateView(); 
                    }
                }
                function onBlur() { 
                  poetryState.words[idx] = input.value; 
                  editingIndex = null; 
                  cleanup(); 
                  syncRawLyricsFromWords();
                  commitAndUpdateView(); 
                }
                input.addEventListener('keydown', onKey);
                input.addEventListener('blur', onBlur);
            } else {
                const span = document.createElement('span');
                const word = displayWords[idx];
                if (isAffectedBySyncopation(idx) && !isPositionActive(idx, displayWords)) {
                    span.textContent = '';
                    span.className = 'word rest';
                } else {
                    span.textContent = (word === ' ' ? '' : (word || ''));
                    span.className = 'word';
                    if (word === '-' || word === '' || word === undefined) span.classList.add('rest');
                }
                if (wordsEditable()) {
                    span.addEventListener('click', () => {
                        while (poetryState.words.length <= idx) {
                            poetryState.words.push('-');
                        }
                        editingIndex = idx;
                        render();
                    });
                } else {
                    span.classList.add('frozen');
                }
                wc.appendChild(span);
                wordsDiv.appendChild(wc);
            }
        }
        group.appendChild(wordsDiv);
    }

    /* The count line: which beat of the measure this is. It sits at the
       bottom, under the syllables or the lyrics, which is where a class
       reads its counting. Beats swallowed by a run tuplet never get here —
       they return early — so the numbers stay one per column. */
    if (view.showBeatNumbers) {
      const count = document.createElement('div');
      count.className = 'beat-number';
      const perMeasure = Math.max(1, config.beatsPerMeasure);
      // With a pickup, beat one is the first beat of the first full measure,
      // so the partial measure counts backwards from the barline.
      const offset = activeState.hasPickupMeasure ? perMeasure - 1 : 0;
      count.textContent = String(((beatIndex + offset) % perMeasure) + 1);
      group.appendChild(count);
    }

    return group;
  }

  const SPLIT_ICON = '<svg viewBox="0 0 24 24"><path d="M20 5v6a3 3 0 0 1-3 3H5"/><path d="m9 10-4 4 4 4"/></svg>';
  const JOIN_ICON  = '<svg viewBox="0 0 24 24"><path d="M4 19v-6a3 3 0 0 1 3-3h12"/><path d="m15 6 4 4-4 4"/></svg>';

  function createDivider(opts) {
    const o = opts || {};
    const isFinal = !!o.final;

    const divider = document.createElement('div');
    divider.className = isFinal ? 'final-measure-divider' : 'measure-divider';

    // Break this line in two, right here.
    if (o.splitAt != null) {
      const split = document.createElement('button');
      split.className = 'line-tool split';
      split.innerHTML = SPLIT_ICON;
      split.title = 'Start a new line here';
      split.addEventListener('click', (e) => {
        e.stopPropagation();
        setLineOverride(o.splitAt, 'break');
      });
      divider.appendChild(split);
    }

    // Pull the next line's first measure back up onto this one.
    if (o.joinAt != null) {
      const join = document.createElement('button');
      join.className = 'line-tool join';
      join.innerHTML = JOIN_ICON;
      join.title = 'Bring the next measure up onto this line';
      join.addEventListener('click', (e) => {
        e.stopPropagation();
        setLineOverride(o.joinAt, 'join');
      });
      divider.appendChild(join);
    }

    /* How long the piece is counts as rhythm: a lesson that has frozen the
       rhythm, or capped the length, simply does not offer these. */
    const measureCount = Math.ceil(
      notesBoxElements.length / Math.max(1, getLayoutConfig().beatsPerMeasure));

    if (isFinal && notesBoxElements.length > 0 && canRemoveMeasures()) {
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'delete-measure-btn';
      deleteBtn.textContent = 'X';
      deleteBtn.title = 'Delete last measure';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const config = getLayoutConfig();
        const beatsToRemove = config.beatsPerMeasure;

        if (currentMode === 'rhythm') {
          const minBeats = config.beatsPerMeasure;
          const newLength = Math.max(minBeats, rhythmState.beats.length - beatsToRemove);
          rhythmState.beats.length = newLength;
          for (const k in rhythmState.beatSubdivisions) {
            if (parseInt(k, 10) >= newLength) delete rhythmState.beatSubdivisions[k];
          }
          for (const k in rhythmState.linkedBeats) {
            if (parseInt(k, 10) >= newLength - 1) delete rhythmState.linkedBeats[k];
          }
        } else {
          const ticksToRemove = beatsToRemove * 12;
          const newLength = Math.max(12, poetryState.canonical12.length - ticksToRemove);
          poetryState.canonical12.length = newLength;
          const newTotalBeats = Math.ceil(newLength / 12);
          for (const k in poetryState.beatSubdivisions) {
            if (parseInt(k, 10) >= newTotalBeats) delete poetryState.beatSubdivisions[k];
          }
          for (const k in poetryState.linkedBeats) {
            if (parseInt(k, 10) >= newTotalBeats - 1) delete poetryState.linkedBeats[k];
          }
          poetryState.words = fromCanonical12(poetryState.canonical12);
        }
        render();
      });
      divider.appendChild(deleteBtn);
    }

    if (isFinal && notesBoxElements.length > 0 && canAddMeasures() &&
        measureCount < maxMeasuresAllowed()) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'add-measure-btn';
      addBtn.textContent = '+';
      addBtn.title = 'Add a new measure';
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const config = getLayoutConfig();
        const beatsToAdd = config.beatsPerMeasure;

        if (currentMode === 'rhythm') {
          const sub = rhythmState.timeSignatureDenominator === 8 ? 3 : 2;
          for (let i = 0; i < beatsToAdd; i++) {
            rhythmState.beats.push(new Array(sub).fill(true));
          }
        } else {
          const ticksToAdd = beatsToAdd * 12;
          const sub = (poetryState.timeSignatureDenominator === 8) ? 3 : 2;
          const win = 12 / sub;
          const startBeat = Math.ceil(poetryState.canonical12.length / 12);
          const endBeat = startBeat + beatsToAdd;
          
          let usedCount = poetryState.words.filter(w => w && w !== '-' && w.trim() !== '').length;

          for (let i = 0; i < ticksToAdd; i++) {
            poetryState.canonical12.push('-');
          }
          poetryState.words = fromCanonical12(poetryState.canonical12);

          if (poetryState.rawLyrics && usedCount < poetryState.rawLyrics.length) {
            for (let b = startBeat; b < endBeat; b++) {
              for (let s = 0; s < sub; s++) {
                if (usedCount < poetryState.rawLyrics.length) {
                  poetryState.canonical12[b * 12 + s * win] = poetryState.rawLyrics[usedCount++];
                }
              }
            }
            poetryState.words = fromCanonical12(poetryState.canonical12);
          }
        }
        render();
      });
      divider.appendChild(addBtn);
    }

    return divider;
  }

  // A split or a join is an editorial choice, so it is remembered with the song.
  function setLineOverride(measureIndex, kind) {
    const st = getActiveState();
    if (!st.lineOverrides) st.lineOverrides = {};

    const perLine = Math.max(1, getLayoutConfig().measuresPerLine);
    const naturalBreak = isNaturalBreak(measureIndex, perLine, !!st.hasPickupMeasure);

    // Matching the natural layout means we can just forget the override.
    if ((kind === 'break' && naturalBreak) || (kind === 'join' && !naturalBreak)) {
      delete st.lineOverrides[measureIndex];
    } else {
      st.lineOverrides[measureIndex] = kind;
    }

    saveCurrentSongToLibrary();
    render();
  }

  function clearLineOverrides() {
    const st = getActiveState();
    const had = st.lineOverrides && Object.keys(st.lineOverrides).length > 0;
    st.lineOverrides = {};
    saveCurrentSongToLibrary();
    render();
    toast(had ? 'Line splits undone' : 'No line splits to undo');
  }

  function revalidateSyncopations() {
      if (poetryState.timeSignatureDenominator === 8) {
          poetryState.syncopation = [];
          poetryState.syncopationStates = {};
          return;
      }
  
      for (let i = poetryState.syncopation.length - 1; i >= 0; i--) {
          const syncTriggerPos = poetryState.syncopation[i];
          const syncStartIndex = syncTriggerPos - 1;

          const beatIndex = Math.floor(syncStartIndex / 2);
          if (getBeatSubdivision(beatIndex) !== 2 || getBeatSubdivision(beatIndex + 1) !== 2) {
              dismantleSyncopation(syncStartIndex);
              continue;
          }
  
          const isEvenPosition = syncStartIndex % 2 === 0;
          const isGroupIntact = syncStartIndex + 3 < poetryState.words.length && poetryState.words[syncStartIndex + 2] === '-';
  
          if (!isEvenPosition || !isGroupIntact) {
              dismantleSyncopation(syncStartIndex);
          }
      }
  }

  /* ------------------------------------------------------------------
     Sizing the grid, then printing the rhythm.

     Each beat's circles, notation and words sit on one column grid, so a
     column is as wide as the widest thing that has to fit in it: the dot,
     the word sung on it, or the notation the beat needs (a lone eighth,
     for instance, needs room for its flag before the next note).

     Widths have to be settled before the notes are drawn, because the
     notes are placed on the circles' measured positions.
     ------------------------------------------------------------------ */
  const COLUMN_MIN = 35;      // a dot plus its breathing room
  const WORD_PAD   = 8;       // space either side of a lyric

  function absOffsetX(el) {
    let x = 0;
    while (el) { x += el.offsetLeft; el = el.offsetParent; }
    return x;
  }

  function noteBoxHeight() {
    const v = parseFloat(getComputedStyle(container).getPropertyValue('--note-h'));
    return v || 84;
  }

  function layoutBeatsAndEngrave() {
    const groups = Array.from(container.querySelectorAll('.group'));
    if (!groups.length) return;
    const sizeH = noteBoxHeight();

    /* If anything on the page carries a tuplet number, every note box grows
       by the same amount so the number has room above the notes. The notes
       themselves do not change size, and giving every box the same height
       keeps the lyrics on one baseline across the line. */
    let extra = 0;
    for (const box of pendingNotation) {
      const m = box._slotMap;
      if (m && m.tuplets && m.tuplets.length) { extra = notationHeadroom(sizeH); break; }
    }
    container.style.setProperty('--note-extra', extra + 'px');
    const boxH = sizeH + extra;

    /* ---- read: what does each beat need? ---- */
    const needs = groups.map(g => {
      let need = COLUMN_MIN;
      // a span-word (Orange/Oreo/Baha honey for a linked half/dotted-half/
      // whole note) never widens the beat - it overflows past its box
      // instead, same as a beam or tie does.
      g.querySelectorAll('.words:not(.span-word) .word').forEach(w => {
        need = Math.max(need, w.offsetWidth + WORD_PAD);
      });
      const box = g.querySelector('.notes-box');
      if (box && box._slotMap) {
        need = Math.max(need, minSlotWidth(box._slotMap, boxH));
      }
      /* a tuplet spread across several beats should take up about the room
         those beats would have taken, so the bar still reads evenly */
      if (g.classList.contains('tuplet-run')) {
        const runBeats = Number(g.dataset.tupletBeats || 1);
        const slots = Number(g.style.getPropertyValue('--slots')) || 1;
        need = Math.max(need, (runBeats * defaultSubdivision() * COLUMN_MIN) / slots);
      }
      return need;
    });

    /* EASY's circles sit in a row however few slots the beat has, so the
       slots widen until the row fits inside the pill. */
    if (easyOn()) {
      const cs = getComputedStyle(groups[0]);
      const gutters = (parseFloat(cs.getPropertyValue('--gutter-l')) || 26)
                    + (parseFloat(cs.getPropertyValue('--gutter-r')) || 12) + 3;
      groups.forEach((g, i) => {
        const n = g.querySelectorAll('.easy-choice').length;
        const slots = Number(g.style.getPropertyValue('--slots')) || 1;
        if (n) needs[i] = Math.max(needs[i], (easyRowWidth(n) - gutters) / slots);
      });
    }

    /* a linked run shares one column width across all its beats */
    for (let i = 0; i < groups.length; i++) {
      const box = groups[i].querySelector('.notes-box');
      const span = box ? Number(box.dataset.span || 1) : 1;
      if (span > 1) {
        let widest = 0;
        for (let k = i; k < i + span && k < groups.length; k++) widest = Math.max(widest, needs[k]);
        for (let k = i; k < i + span && k < groups.length; k++) needs[k] = widest;
      }
    }

    /* ---- write: commit the column widths ---- */
    groups.forEach((g, i) => { g.style.setProperty('--slot-w', needs[i] + 'px'); });

    /* ---- read again, now that the grid is final, and draw ---- */
    for (const box of pendingNotation) {
      const group = box.closest('.group');
      if (!group) continue;
      const span = Number(box.dataset.span || 1);

      const centres = [];
      let g = group;
      for (let k = 0; k < span && g; k++) {
        g.querySelectorAll('.circles .circle').forEach(c => {
          centres.push(absOffsetX(c) + c.offsetWidth / 2);
        });
        g = g.nextElementSibling && g.nextElementSibling.classList.contains('group')
          ? g.nextElementSibling : null;
      }
      if (!centres.length) continue;

      const colW = centres.length > 1 ? centres[1] - centres[0] : COLUMN_MIN;
      const left = centres[0] - colW / 2;
      const width = (centres[centres.length - 1] + colW / 2) - left;
      const boxLeft = absOffsetX(box);

      const map = box._slotMap;
      const svg = engraveRhythm({
        sizeHeight: sizeH,
        roles: map.roles,
        slotTicks: map.slotTicks,
        slotBeat: map.slotBeat,
        slotSubGroup: map.slotSubGroup,
        tuplets: map.tuplets,
        slotCentres: centres.map(c => c - left),
        width: width,
        height: boxH
      });

      box.insertAdjacentHTML('beforeend', svg);
      const el = box.lastElementChild;
      el.style.left = (left - boxLeft) + 'px';
    }
  }

  function render() {
    // Captured now, before a beat: in 'Wrap to fit' mode, measuring the
    // layout below empties #poem for a moment to lay measures out flat and
    // read their widths. A scrollable ancestor whose content has momentarily
    // vanished gets its scroll position clamped by the browser right then —
    // not after render() returns — so reading it fresh inside applyZoom(),
    // once the real content is back, is already too late; it reads the
    // clamped value, and the page has, in effect, already jumped. Only a
    // snapshot taken before any of this starts is trustworthy.
    const preservedScroll = stage ? { top: stage.scrollTop, left: stage.scrollLeft } : null;

    container.innerHTML = '';
    notesBoxElements = [];
    pendingNotation = [];
    const config = getLayoutConfig();
    const activeState = getActiveState();
    const isRhythm = currentMode === 'rhythm';

    let totalBeatsNeeded = 0;

    if (isRhythm) {
      let numBeats = Math.max(1, rhythmState.beats.length);
      if (rhythmState.hasPickupMeasure) {
        const bodyBeats = numBeats > 1 ? numBeats - 1 : 0;
        const beatsInLastMeasure = bodyBeats % config.beatsPerMeasure;
        const paddedBodyBeats = (beatsInLastMeasure === 0 && bodyBeats > 0) ? bodyBeats : bodyBeats + (config.beatsPerMeasure - beatsInLastMeasure);
        totalBeatsNeeded = 1 + paddedBodyBeats;
      } else {
        const beatsInLastMeasure = numBeats % config.beatsPerMeasure;
        totalBeatsNeeded = (beatsInLastMeasure === 0 && numBeats > 0) ? numBeats : numBeats + (config.beatsPerMeasure - beatsInLastMeasure);
      }

      while (rhythmState.beats.length < totalBeatsNeeded) {
        const sub = rhythmState.timeSignatureDenominator === 8 ? 3 : 2;
        rhythmState.beats.push(new Array(sub).fill(true));
      }
    } else {
      revalidateSyncopations();
      trimExcessTrailingMeasures();

      let numBeats = Math.max(1, getTotalBeatsFromWords(poetryState.words));
      if (poetryState.hasPickupMeasure) {
        const bodyBeats = numBeats > 1 ? numBeats - 1 : 0;
        const beatsInLastMeasure = bodyBeats % config.beatsPerMeasure;
        const paddedBodyBeats = (beatsInLastMeasure === 0 && bodyBeats > 0) ? bodyBeats : bodyBeats + (config.beatsPerMeasure - beatsInLastMeasure);
        totalBeatsNeeded = 1 + paddedBodyBeats;
      } else {
        const beatsInLastMeasure = numBeats % config.beatsPerMeasure;
        totalBeatsNeeded = (beatsInLastMeasure === 0 && numBeats > 0) ? numBeats : numBeats + (config.beatsPerMeasure - beatsInLastMeasure);
      }

      while (poetryState.canonical12.length < totalBeatsNeeded * 12) {
        poetryState.canonical12.push('-');
      }

      poetryState.words = fromCanonical12(poetryState.canonical12);
    }

    const displayWords = isRhythm ? [] : poetryState.words;

    const allBeatGroups = [];
    let wordCursor = 0;
    for (let b = 0; b < totalBeatsNeeded; b++) {
      const beatStartPos = wordCursor;
      const S = getBeatSubdivision(b);
      allBeatGroups.push(createBeatGroup(b, beatStartPos, config, displayWords));
      wordCursor += S;
    }

    if (allBeatGroups.length === 0) return;

    // --- gather the beats into measures ---
    const measureEls = [];
    let cursor = 0;
    let measureCounter = 1;

    if (activeState.hasPickupMeasure) {
      const pickup = document.createElement('div');
      pickup.className = 'measure measure-pickup';
      pickup.appendChild(allBeatGroups[cursor++]);
      measureEls.push(pickup);
    }

    while (cursor < allBeatGroups.length) {
      const measure = document.createElement('div');
      measure.className = 'measure';

      const label = document.createElement('span');
      label.className = 'measure-number';
      label.textContent = measureCounter++;
      measure.appendChild(label);

      for (let i = 0; i < config.beatsPerMeasure && cursor < allBeatGroups.length; i++) {
        measure.appendChild(allBeatGroups[cursor++]);
      }
      measureEls.push(measure);
    }

    const grouped = buildLines(measureEls, config.measuresPerLine, activeState.lineOverrides || {});

    grouped.forEach((group, li) => {
      const line = document.createElement('div');
      line.className = 'line';
      const isLastLine = li === grouped.length - 1;

      group.forEach((entry, mi) => {
        line.appendChild(entry.el);
        if (mi < group.length - 1) {
          // between two measures on the same line: offer to break here
          line.appendChild(createDivider({
            splitAt: group[mi + 1].index,
            cramped: lineIsCramped[li]
          }));
        }
      });

      // the barline that ends the line: offer to pull the next measure back up
      const next = grouped[li + 1];
      line.appendChild(createDivider({
        final: isLastLine,
        joinAt: next ? next[0].index : null
      }));

      container.appendChild(line);
    });

    layoutBeatsAndEngrave();
    applyZoom(preservedScroll);
    markCrampedLines(grouped);

    if (!isRhythm) syncQuickWrite();
    watchImagesForRelayout();
    if (standAfterRender) standAfterRender();
  }

  /*
   * Line breaking is deliberate, not clever.
   *
   * Lines hold `perLine` measures. The user can override any individual break
   * with the handles on the barlines — 'break' forces a new line, 'join' pulls
   * the next measure back up. Nothing here reacts to how dense the music is;
   * when a line is too tight the app *offers* a split rather than taking one.
   *
   * The one automatic case is 'wrap', which the user opts into: there the
   * screen edges are walls and an over-wide line is split until it fits.
   */
  function buildLines(measureEls, perLine, overrides) {
    const N = Math.max(1, perLine);
    const hasPickup = !!getActiveState().hasPickupMeasure;
    const lines = [];
    let current = [];

    for (let i = 0; i < measureEls.length; i++) {
      if (i > 0) {
        const ov = overrides[i];
        const natural = isNaturalBreak(i, N, hasPickup);
        const isBreak = ov === 'break' ? true : ov === 'join' ? false : natural;
        if (isBreak) { lines.push(current); current = []; }
      }
      current.push({ el: measureEls[i], index: i });
    }
    if (current.length) lines.push(current);

    return view.overflow === 'wrap' ? enforceWalls(lines) : lines;
  }

  /*
   * Where a line would break if nobody had touched it.
   *
   * This is keyed to the measure's absolute position, not to how full the
   * current line happens to be. That matters: it keeps a split LOCAL. Pulling
   * one dense measure onto its own line leaves every later measure paired up
   * exactly where it was, instead of shunting the whole score along by one.
   *
   * A pickup shares the opening line with the first full measures.
   */
  function isNaturalBreak(i, N, hasPickup) {
    const offset = hasPickup ? 1 : 0;
    return i > offset && ((i - offset) % N === 0);
  }

  // 'Wrap to fit': split any line that would run past the edge of the screen.
  function enforceWalls(lines) {
    if (!stage || lines.length === 0) return lines;

    const widths = measureNaturalWidths(lines);
    if (!widths) return lines;

    const { availW } = stageMetrics();
    const scale = view.sizeMode === 'fixed'
      ? view.zoomPct / 100
      : (appliedScale || 1);
    const cap = availW / Math.max(0.05, scale);

    const out = [];
    lines.forEach(line => {
      let run = [], runW = 0;
      line.forEach(entry => {
        const w = widths.get(entry.el) || 0;
        if (run.length && runW + w > cap) { out.push(run); run = []; runW = 0; }
        run.push(entry);
        runW += w;
      });
      if (run.length) out.push(run);
    });
    return out;
  }

  // Lay the measures out off-screen for a moment so we can read their widths.
  function measureNaturalWidths(lines) {
    const all = [];
    lines.forEach(l => l.forEach(e => all.push(e.el)));
    if (all.length === 0) return null;

    const probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;' +
      'display:flex;align-items:flex-start;';
    all.forEach(el => probe.appendChild(el));

    const sample = createDivider({});
    probe.appendChild(sample);
    // Deliberately NOT appended to #poem: while #poem is between renders it
    // has no real children, and forcing layout on it here (offsetWidth does)
    // would collapse it and clamp the scrollable stage's scroll position —
    // the exact bug this measurement pass must not cause. Every class used
    // below is styled globally, not scoped to #poem, so measuring in body
    // gives identical sizes.
    document.body.appendChild(probe);

    const ds = getComputedStyle(sample);
    const dividerW = sample.offsetWidth
      + parseFloat(ds.marginLeft) + parseFloat(ds.marginRight);

    const widths = new Map();
    all.forEach(el => widths.set(el, el.offsetWidth + dividerW));

    document.body.removeChild(probe);
    return widths;
  }

  /*
   * Flag the line (or lines) that are holding the whole staff back, so the
   * barline handle on them can invite a split. A line only counts as cramped
   * when it is both the widest thing on the page AND small enough to be hard
   * to read — splitting anything else would not make the notation bigger.
   */
  const COMFORT_SCALE = 0.85;

  function markCrampedLines(grouped) {
    const lineEls = container.querySelectorAll('.line');
    const widths = Array.from(lineEls).map(l => l.getBoundingClientRect().width);
    const widest = Math.max.apply(null, widths.concat([0]));

    const tooSmall = view.sizeMode === 'fit'
      ? appliedScale < COMFORT_SCALE
      : false;

    let changed = false;
    lineIsCramped = widths.map((w, i) => {
      const multi = grouped[i] && grouped[i].length > 1;
      const flag = !!(tooSmall && multi && widest > 0 && w >= widest * 0.98);
      if (flag) changed = true;
      return flag;
    });

    // the flags are read while building, so paint them on directly here
    Array.from(lineEls).forEach((lineEl, i) => {
      lineEl.querySelectorAll('.line-tool.split').forEach(btn => {
        btn.classList.toggle('suggested', !!lineIsCramped[i]);
        btn.title = lineIsCramped[i]
          ? 'This line is what keeps the notation small — split it here'
          : 'Start a new line here';
      });
    });
    return changed;
  }

  // Measure widths depend on the note images, which decode asynchronously the
  // first time they are used. Re-run the layout once they have real dimensions.
  let awaitingImages = false;
  function watchImagesForRelayout() {
    if (awaitingImages) return;
    const pending = Array.from(container.querySelectorAll('img')).filter(img => !img.complete);
    if (pending.length === 0) return;

    awaitingImages = true;
    let remaining = pending.length;
    const done = () => {
      if (--remaining > 0) return;
      awaitingImages = false;
      render();
    };
    pending.forEach(img => {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }

  /* ==================================================================
     LESSONS
     ------------------------------------------------------------------
     Two halves that never meet. The first is the shell: one pass that
     puts the chrome into whatever state the policy asks for, so no
     individual control has to remember it is in a lesson. The second is
     the teacher's setup sheet, which only ever writes a draft policy and
     turns it into a link.

     The link carries the policy and the teacher's exercises, and it is
     one-way on purpose: there is nothing in it to unlock, and a teacher
     keeps working in their own library, which the link never touches.
     ================================================================== */

  const soundBtn = document.getElementById('sound-btn');
  const sideSwitchEl = document.querySelector('.side-switch');
  const lessonSetupBtn = document.getElementById('lessonSetupBtn');
  const taskStrip = document.getElementById('task-strip');
  const taskStripTitle = document.getElementById('task-strip-title');
  const taskStripNote = document.getElementById('task-strip-note');
  const previewBar = document.getElementById('preview-bar');
  const previewExitBtn = document.getElementById('preview-exit-btn');

  /* A class rather than the hidden attribute: the side-switching rules
     already set display on some of these, and a policy has to win. */
  function showHide(el, on) { if (el) el.classList.toggle('policy-off', !on); }

  function applyPolicyToShell() {
    const inLesson = !!policy;
    document.body.classList.toggle('in-lesson', inLesson);
    document.body.classList.toggle('rhythm-frozen', !rhythmEditable());
    document.body.classList.toggle('words-frozen', !wordsEditable());

    showHide(sideSwitchEl, !onlySide());
    showHide(rhythmModeBtn, sideAllowed('rhythm'));
    showHide(poetryModeBtn, sideAllowed('poetry'));

    showHide(soundBtn, shellAllows('sound'));
    showHide(viewBtn, shellAllows('view'));
    showHide(presentBtn, shellAllows('present'));
    showHide(copyVisualBtn, shellAllows('picture'));
    showHide(pictureColorDots ? pictureColorDots.closest('.inline-check') : null, shellAllows('picture'));

    showHide(libraryBtn, libraryMode() !== 'none');
    showHide(songChip, libraryMode() !== 'none');

    // Writing words is the one editor a lesson can take away outright.
    showHide(textEditorBtn, wordsEditable());
    showHide(writePanel, wordsEditable());

    // A student's library is the lesson; none of the authoring lives there.
    showHide(newSongBtn, !inLesson);
    showHide(saveAsBtn, !inLesson);
    showHide(shelfBtn, !inLesson);
    showHide(importExportBtn, !inLesson);
    showHide(lessonSetupBtn, !inLesson);

    /* The way in to Layout Settings goes when the layout is locked; the
       beat-dot button never goes at all, which is why it is not listed
       anywhere above. */
    showHide(layoutSheetBtn, layoutEditable());
    document.body.classList.toggle('layout-locked', !layoutEditable());
    syncDotsToggle();

    /* Syllable systems: a single system is not a choice, so the dropdown
       goes and the syllables simply appear in it. */
    if (rhythmSystemsDropdown) {
      const offered = systemsOffered();
      const want = offered.join(' ');
      if (rhythmSystemsDropdown.dataset.offered !== want) {
        rhythmSystemsDropdown.dataset.offered = want;
        rhythmSystemsDropdown.innerHTML = '';
        offered.forEach(name => {
          const opt = document.createElement('option');
          opt.textContent = name;
          rhythmSystemsDropdown.appendChild(opt);
        });
      }
      if (offered.length && offered.indexOf(rhythmState.currentRhythmSystem) === -1) {
        rhythmState.currentRhythmSystem = offered[0];
      }
      rhythmSystemsDropdown.value = rhythmState.currentRhythmSystem;
      showHide(rhythmSystemsDropdown, offered.length > 1);
    }

    const gauge = document.getElementById('bpm-gauge');
    if (gauge) {
      gauge.min = String(Math.max(40, tempoMin()));
      gauge.max = String(Math.min(240, tempoMax()));
    }

    /* Close the toolbar over whatever has gone: a group with nothing left
       in it would still draw its divider, and the group after it would
       carry a border with nothing to its left. */
    const groups = Array.from(document.querySelectorAll('.toolbar .tool-group'));
    /* Cleared first so the widths below are read with nothing hidden from a
       previous pass. A child can also be hidden by the side-switching CSS
       rather than by the policy — the rhythm syllable dropdown on the
       Poetry side — so this measures instead of trusting the class. */
    groups.forEach(g => g.classList.remove('policy-off', 'is-first'));
    let seenFirst = false;
    groups.forEach(group => {
      const live = Array.from(group.children).some(el => el.offsetWidth > 0);
      group.classList.toggle('policy-off', !live);
      if (live && !seenFirst) { group.classList.add('is-first'); seenFirst = true; }
    });

    if (taskStrip) {
      taskStrip.hidden = !inLesson;
      if (inLesson) {
        taskStripTitle.textContent = (lessonMeta && lessonMeta.title) || 'Lesson';
        taskStripNote.textContent = taskBlurb();
      }
    }

    updateTimeSignatureDisplay();
  }

  /* ---- opening a lesson link -------------------------------------- */

  const LESSON_SOURCE_KEY = 'rhythm_poetry_lesson_sources_v1';

  function slugify(text) {
    return String(text || 'lesson').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '').slice(0, 32) || 'lesson';
  }

  function checkUrlForLesson() {
    let raw = null;
    if (window.location.hash) {
      const hashStr = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hashStr);
      if (params.has('lesson')) raw = params.get('lesson');
    }
    if (!raw) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('lesson')) raw = params.get('lesson');
    }
    if (!raw) return null;
    const payload = decodeSongFromUrl(raw);
    return (payload && payload.lesson) ? payload : null;
  }

  function readLessonSources() {
    try { return JSON.parse(localStorage.getItem(LESSON_SOURCE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  function writeLessonSources(map) {
    try { localStorage.setItem(LESSON_SOURCE_KEY, JSON.stringify(map)); } catch (e) {}
  }

  /* The exercises land in the student's own library under ids derived from
     the lesson, so opening the same link twice is not two copies — and,
     more to the point, a student who comes back tomorrow finds yesterday's
     work rather than a blank sheet. The teacher's untouched original is
     kept alongside, which is what "Start this one again" restores. */
  function openLesson(payload) {
    const p = normalizePolicy(payload.policy);
    if (!p) return null;

    const title = (payload.title && String(payload.title).trim()) || 'Lesson';
    const stem = 'lesson_' + slugify(title) + '_';
    const library = getStoredLibrary();
    const sources = readLessonSources();
    const ids = [];

    (payload.songs || []).forEach((song, i) => {
      const id = stem + i;
      const fresh = normalizeSong({ ...song, id: id, isCustom: true, createdAt: Date.now() + i });
      // (a lesson made before exercises were stripped of it could carry this)
      delete fresh.received; delete fresh.receivedAt; delete fresh.book; delete fresh.layout;
      sources[id] = fresh;
      if (!library[id]) library[id] = JSON.parse(JSON.stringify(fresh));
      ids.push(id);
    });

    if (!ids.length) return null;

    saveStoredLibrary(library);
    writeLessonSources(sources);

    policy = p;
    lessonMeta = { title: title, songIds: ids };

    /* The lesson brings the teacher's layout with it, and locks it. There
       would be no point narrowing the vocabulary in Layout Settings if the
       first thing a student could do was open that sheet and widen it
       again. The beat-dot button is deliberately not part of this. */
    applyLayoutSnapshot(payload.layout, true);

    // Land on a side the lesson actually offers.
    const wanted = onlySide() || (songSide(library[ids[0]]) === 'poetry' ? 'poetry' : 'rhythm');
    ['rhythm', 'poetry'].forEach(side => {
      const first = ids.find(id => songSide(library[id]) === side);
      currentSongIds[side] = first || null;
      currentSongTitles[side] = first ? library[first].title : '';
    });

    try { window.history.replaceState(null, document.title, window.location.pathname); } catch (e) {}
    return currentSongIds[wanted] || ids[0];
  }

  /* Put one exercise back the way the teacher sent it. */
  function restoreLessonSong(id) {
    const sources = readLessonSources();
    if (!sources[id]) return false;
    const library = getStoredLibrary();
    library[id] = JSON.parse(JSON.stringify(sources[id]));
    saveStoredLibrary(library);
    if (id === getCurrentSongId()) loadSongById(id);
    return true;
  }

  /* ==================================================================
     LAYOUT SETTINGS — the sheet
     ------------------------------------------------------------------
     Everything here writes to `layout` (or to the three on-screen flags
     in `view`) and takes effect immediately, for whoever is using the
     app. There is no draft and no apply button: you are arranging the
     room you are standing in, and a student link is a photograph of it.
     ================================================================== */

  const layoutSheetBtn = document.getElementById('layout-settings-btn');
  const layoutShowList = document.getElementById('layout-show');
  const layoutMeterSimple = document.getElementById('layout-meter-simple');
  const layoutMeterCompound = document.getElementById('layout-meter-compound');
  const layoutMeterNote = document.getElementById('layout-meter-note');
  const layoutPickupList = document.getElementById('layout-pickup');
  const layoutDivideList = document.getElementById('layout-divide');
  const layoutFamSeg = document.getElementById('layout-fam-seg');
  const layoutFamNote = document.getElementById('layout-fam-note');
  const layoutVocabBox = document.getElementById('layout-vocab');
  const layoutJoinsList = document.getElementById('layout-joins');
  const dotsToggleBtn = document.getElementById('dots-toggle-btn');

  let layoutFamily = 'simple';

  const FAMILY_LABEL = {
    simple:   'A beat counted in two — 2/4, 3/4, 4/4, 5/4, 6/4.',
    compound: 'A beat counted in three — 6/8, 9/8, 12/8.'
  };

  const DIVIDE_SWITCHES = [
    { key: 'sixteenths', name: 'Sixteenth notes',
      desc: 'The + button, splitting a beat into four' },
    { key: 'tuplets', name: 'Triplets / duplets',
      desc: 'The − button, borrowing the other division' },
    { key: 'subTuplets', name: 'Subdivided triplets / duplets',
      desc: 'Pressing − again to split the borrowed division' }
  ];

  const SHOW_SWITCHES = [
    { key: 'showDots', name: 'Beat dots',
      desc: 'The tappable circles above each note' },
    { key: 'showMeasureNumbers', name: 'Measure numbers',
      desc: 'Small numbers above each measure' },
    { key: 'showBeatNumbers', name: 'Beat numbers',
      desc: 'A count line under the staff — 1, 2, 3, 4' }
  ];

  function switchRow(name, desc, on, onClick, opts) {
    const o = opts || {};
    const btn = document.createElement('button');
    btn.className = 'switch-row' + (on ? ' active' : '') + (o.soon ? ' soon' : '');
    btn.innerHTML =
      '<span class="switch-name"></span>' +
      '<span class="switch-desc"></span>' +
      '<span class="switch-pill"></span>';
    btn.querySelector('.switch-name').textContent = name;
    btn.querySelector('.switch-desc').textContent = desc;
    if (o.soon) {
      btn.disabled = true;
      const tag = document.createElement('span');
      tag.className = 'soon-tag';
      tag.textContent = 'Coming soon';
      btn.appendChild(tag);
    } else {
      btn.addEventListener('click', onClick);
    }
    return btn;
  }

  /* ---- drawing one shape of the vocabulary -------------------------
     Straight through the engraver the staff itself uses, so a picture in
     this sheet can never drift from what it turns into on the page. */

  const CELL_SLOT_W = 15;
  const CELL_SIZE_H = 40;

  function engraveCell(pattern, slots, compound) {
    const beat = compound ? 36 : 24;
    const per = beat / slots;
    const flags = patternToFlags(pattern);
    const tup = beatSlotTupletIn(slots, compound);
    const tuplets = tup
      ? [{ from: 0, to: slots - 1, count: tup.count, inSpaceOf: tup.inSpaceOf, show: tup.show }]
      : [];
    const centres = [];
    for (let i = 0; i < slots; i++) centres.push(CELL_SLOT_W / 2 + i * CELL_SLOT_W);
    const sizeH = CELL_SIZE_H;
    const boxH = sizeH + (tup ? notationHeadroom(sizeH) : 0);

    return engraveRhythm({
      roles: rolesFromFlags(flags),
      slotTicks: new Array(slots).fill(per),
      slotBeat: new Array(slots).fill(0),
      slotSubGroup: new Array(slots).fill(0),
      tuplets: tuplets,
      slotCentres: centres,
      width: CELL_SLOT_W * slots,
      height: boxH,
      sizeHeight: sizeH
    });
  }

  /* A run of linked beats, drawn the way the staff would draw it. The box
     is only as wide as the drawing needs — a whole note has one notehead
     and seven silent slots after it, and a cell padded out to the full
     four beats would be mostly empty space. */
  function engraveSpanCell(pattern, beats, compound) {
    const perBeat = compound ? 3 : 2;
    const slots = beats * perBeat;
    const per = (compound ? 36 : 24) / perBeat;
    const flags = patternToFlags(pattern);
    const slotBeat = [];
    for (let i = 0; i < slots; i++) slotBeat.push(Math.floor(i / perBeat));

    let lastOnset = 0;
    for (let i = 0; i < slots; i++) if (flags[i]) lastOnset = i;

    const centres = [];
    for (let i = 0; i < slots; i++) centres.push(CELL_SLOT_W / 2 + i * CELL_SLOT_W);

    return engraveRhythm({
      roles: rolesFromFlags(flags),
      slotTicks: new Array(slots).fill(per),
      slotBeat: slotBeat,
      slotSubGroup: slotBeat.slice(),
      tuplets: [],
      slotCentres: centres,
      width: (lastOnset + 1.4) * CELL_SLOT_W,
      height: CELL_SIZE_H,
      sizeHeight: CELL_SIZE_H
    });
  }

  /* Three notes in the time of two beats, or of four: the quarter-note and
     half-note triplets. Shown inside the triplet group rather than switched
     separately — they are the same idea at a larger size. */
  function engraveRunTriplet(beats) {
    const slots = 3;
    const per = (beats * 24) / slots;
    const sizeH = CELL_SIZE_H;
    const boxH = sizeH + notationHeadroom(sizeH);
    const centres = [];
    for (let i = 0; i < slots; i++) centres.push(CELL_SLOT_W / 2 + i * CELL_SLOT_W);
    return engraveRhythm({
      roles: ['note', 'note', 'note'],
      slotTicks: new Array(slots).fill(per),
      slotBeat: [0, 0, 0],
      slotSubGroup: [0, 0, 0],
      tuplets: [{ from: 0, to: slots - 1, count: 3, inSpaceOf: 2, show: 3 }],
      slotCentres: centres,
      width: CELL_SLOT_W * slots,
      height: boxH,
      sizeHeight: sizeH
    });
  }

  /* ---- reading and writing the layout's vocabulary ----------------- */

  function layoutCells(fam, slots) {
    const stored = layout.cells[fam][slots];
    return (Array.isArray(stored) && stored.length) ? stored : patternsFor(slots);
  }

  function setLayoutCells(fam, slots, list) {
    const all = patternsFor(slots);
    const ordered = all.filter(x => list.indexOf(x) !== -1);
    if (ordered.length >= all.length) delete layout.cells[fam][slots];
    else layout.cells[fam][slots] = ordered;
  }

  /* What a shape sounds like, independent of the grid it is stored on: a
     run of notes and rests with their lengths, holds folded into the note
     before them and neighbouring rests folded together — exactly what the
     engraver does when it turns slots into noteheads.

     This matters because a quarter note can be written as XO on the
     eighth grid or XOOO on the sixteenth one, and those engrave to the
     same picture. A teacher should be asked about "ta" once. */
  /* Engrave the shape once at a fixed width, with the notes at their real
     positions in the beat rather than one per column, and use the drawing
     itself as the signature. Nothing else is as trustworthy: two shapes
     are the same picture exactly when they draw the same picture, and
     that stays true however the engraver's own rules change.

     It settles the awkward cases correctly and for the right reason. A
     quarter written on the triplet grid loses its bracket — the engraver
     drops a tuplet that only has one note in it — so it folds into the
     plain quarter. A duplet in compound time keeps its 2, so it does not
     fold into the two dotted eighths that last exactly as long.

     The width is generous so the one length that depends on column width,
     a partial beam's stub, clamps to the same value at every division. */
  const SIG_W = 240;
  function soundSignature(pattern, slots, compound) {
    const beat = compound ? 36 : 24;
    const per = beat / slots;
    const tup = beatSlotTupletIn(slots, compound);
    const centres = [];
    for (let i = 0; i < slots; i++) centres.push((i * per / beat) * SIG_W);
    return engraveRhythm({
      roles: rolesFromFlags(patternToFlags(pattern)),
      slotTicks: new Array(slots).fill(per),
      slotBeat: new Array(slots).fill(0),
      slotSubGroup: new Array(slots).fill(0),
      tuplets: tup
        ? [{ from: 0, to: slots - 1, count: tup.count, inSpaceOf: tup.inSpaceOf, show: tup.show }]
        : [],
      slotCentres: centres,
      width: SIG_W,
      height: CELL_SIZE_H,
      sizeHeight: CELL_SIZE_H
    });
  }

  /* Every shape the app can write in one family, folded down to one entry
     per distinct sound and drawn from the sparsest grid it fits on, which
     is the simplest picture.

     The fold runs across the whole family, not group by group, so a
     quarter note held across a triplet grid is the same quarter note that
     is already in Quarters, eighths & rests — it is offered once, in the
     group a musician would look for it in, and switching it off there
     switches it off everywhere it could have been written. */
  const pictureCache = {};
  function familyPictures(fam) {
    if (pictureCache[fam]) return pictureCache[fam];
    const compound = fam === 'compound';
    const bySig = {};
    const order = [];
    VOCAB_GROUPS.forEach(group => {
      groupCells(group, fam).forEach(entry => {
        entry.patterns.forEach(pattern => {
          const sig = soundSignature(pattern, entry.slots, compound);
          if (!bySig[sig]) {
            bySig[sig] = { group: group.id, slots: entry.slots, pattern: pattern, members: [] };
            order.push(bySig[sig]);
          }
          bySig[sig].members.push({ slots: entry.slots, pattern: pattern });
          if (entry.slots < bySig[sig].slots) {
            bySig[sig].slots = entry.slots;
            bySig[sig].pattern = pattern;
          }
        });
      });
    });
    pictureCache[fam] = order;
    return order;
  }

  /* Spans are pictures too, and the sheet treats them the same way — but
     they are stored separately, so every read and write branches on kind.
     A span picture names one run length; a cell picture names one sound
     that may live on several grids. */
  function groupSpanPictures(group, fam) {
    const spec = group.spans && group.spans[fam];
    if (!spec) return [];
    const out = [];
    Object.keys(spec).forEach(k => {
      const beats = parseInt(k, 10);
      spec[k].forEach(pattern => out.push({ kind: 'span', group: group.id, beats: beats, pattern: pattern }));
    });
    return out;
  }

  function groupPictures(group, fam) {
    return familyPictures(fam)
      .filter(p => p.group === group.id)
      .concat(groupSpanPictures(group, fam));
  }

  function pictureIsOn(pic, fam) {
    if (pic.kind === 'span') return spansOn(fam, pic.beats).indexOf(pic.pattern) !== -1;
    return pic.members.some(m => divisionEnabledIn(fam, m.slots)
      && layoutCells(fam, m.slots).indexOf(m.pattern) !== -1);
  }

  function toggleSpanPicture(pic, fam) {
    const named = namedSpans(fam, pic.beats);
    const live = spansOn(fam, pic.beats).slice();
    const at = live.indexOf(pic.pattern);
    if (at === -1) live.push(pic.pattern); else live.splice(at, 1);
    const ordered = named.filter(x => live.indexOf(x) !== -1);
    /* Unlike a division, a run length may legitimately end up with nothing
       on it — that is how a teacher takes the chain button away. */
    if (ordered.length >= named.length) delete layout.spans[fam][pic.beats];
    else layout.spans[fam][pic.beats] = ordered;
    saveLayout();
  }

  function togglePicture(pic, fam) {
    if (pic.kind === 'span') return toggleSpanPicture(pic, fam);
    const turningOff = pictureIsOn(pic, fam);
    /* Never leave a division with nothing at all: a beat would have no
       legal shape to fall back to. */
    if (turningOff) {
      const blocked = pic.members.some(m =>
        divisionEnabledIn(fam, m.slots) && layoutCells(fam, m.slots).length <= 1);
      if (blocked) return;
    }
    pic.members.forEach(m => {
      if (!divisionEnabledIn(fam, m.slots)) return;   // nothing to narrow there
      const list = layoutCells(fam, m.slots).slice();
      const at = list.indexOf(m.pattern);
      if (!turningOff && at === -1) list.push(m.pattern);
      else if (turningOff && at !== -1) list.splice(at, 1);
      if (list.length) setLayoutCells(fam, m.slots, list);
    });
    saveLayout();
  }

  /* How much of a group is switched on: 'all', 'none' or 'some'. */
  function groupState(group, fam) {
    const pics = groupPictures(group, fam);
    if (!pics.length) return 'none';
    let on = 0;
    pics.forEach(p => { if (pictureIsOn(p, fam)) on++; });
    return on === 0 ? 'none' : on === pics.length ? 'all' : 'some';
  }

  function setGroup(group, fam, on) {
    groupPictures(group, fam).forEach(pic => {
      if (pictureIsOn(pic, fam) !== on) togglePicture(pic, fam);
    });
  }

  /* A group only appears when the division it needs is switched on — a
     question about dotted sixteenths is meaningless with the sixteenths
     turned off — and when it has something of its own left to ask about
     after the family-wide fold. */
  function groupIsOffered(group, fam) {
    if (group.needs && layout.divide[group.needs] === false) return false;
    return groupPictures(group, fam).length > 0;
  }

  /* ---- rendering --------------------------------------------------- */

  function renderLayoutShow() {
    if (!layoutShowList) return;
    layoutShowList.innerHTML = '';
    SHOW_SWITCHES.forEach(item => {
      layoutShowList.appendChild(switchRow(item.name, item.desc, view[item.key], () => {
        view[item.key] = !view[item.key];
        saveViewPrefs();
        if (item.key === 'showDots') updateCircleVisibility();
        syncViewControls();
        renderLayoutShow();
        render();
      }));
    });
  }

  function renderLayoutMeters() {
    [['simple', layoutMeterSimple], ['compound', layoutMeterCompound]].forEach(([fam, row]) => {
      if (!row) return;
      row.innerHTML = '';
      METERS[fam].forEach(key => {
        const on = layout.meters[fam].indexOf(key) !== -1;
        const chip = document.createElement('button');
        chip.className = 'chip' + (on ? ' active' : '');
        chip.textContent = key;
        chip.addEventListener('click', () => {
          const list = layout.meters[fam].slice();
          const at = list.indexOf(key);
          if (at === -1) list.push(key);
          else list.splice(at, 1);
          const next = METERS[fam].filter(m => list.indexOf(m) !== -1);
          // Between the two families there has to be at least one meter.
          const other = fam === 'simple' ? 'compound' : 'simple';
          if (!next.length && !layout.meters[other].length) return;
          layout.meters[fam] = next;
          saveLayout();
          renderLayoutMeters();
          updateTimeSignatureDisplay();
          render();
        });
        row.appendChild(chip);
      });
    });
    renderLayoutMeterNote();
  }

  function renderLayoutMeterNote() {
    if (!layoutMeterNote) return;
    const total = layout.meters.simple.length + layout.meters.compound.length;
    layoutMeterNote.textContent = total === METERS.simple.length + METERS.compound.length
      ? 'Every meter. Tap the numbers on the staff to change between them.'
      : total === 1
        ? 'One meter only, so the numbers on the staff stop being a button and just read '
          + layout.meters.simple.concat(layout.meters.compound)[0] + '.'
        : 'Tapping the numbers on the staff walks these ' + total + '.';
  }

  function renderLayoutPickup() {
    if (!layoutPickupList) return;
    layoutPickupList.innerHTML = '';
    const st = getActiveState();
    layoutPickupList.appendChild(switchRow(
      'Pickup measure',
      'This piece starts on a partial measure',
      !!st.hasPickupMeasure,
      () => {
        st.hasPickupMeasure = !st.hasPickupMeasure;
        saveCurrentSongToLibrary();
        renderLayoutPickup();
        syncViewControls();
        render();
      }
    ));
  }

  function renderLayoutDivide() {
    if (!layoutDivideList) return;
    layoutDivideList.innerHTML = '';
    DIVIDE_SWITCHES.forEach(item => {
      const on = layout.divide[item.key] !== false;
      /* A division can be switched on and still have nothing to offer, if
         every group that lives there has been turned off below. The button
         it controls is hidden in that case, so say why rather than leaving
         a switch that looks live and does nothing. */
      const barren = on && !['simple', 'compound'].some(fam =>
        divisionOffersSomethingNew(fam, DIVIDE_SLOTS[item.key][fam]));
      layoutDivideList.appendChild(switchRow(
        item.name,
        barren ? 'Nothing under Rhythms available uses this, so the button stays hidden' : item.desc,
        on,
        () => {
          layout.divide[item.key] = layout.divide[item.key] === false;
          saveLayout();
          renderLayoutDivide();
          renderLayoutVocab();
          render();
        }
      ));
    });
  }

  function renderLayoutFamily() {
    if (!layoutFamSeg) return;
    layoutFamSeg.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.fam === layoutFamily);
    });
    if (layoutFamNote) layoutFamNote.textContent = FAMILY_LABEL[layoutFamily];
  }

  function renderLayoutVocab() {
    if (!layoutVocabBox) return;
    layoutVocabBox.innerHTML = '';
    const fam = layoutFamily;
    const compound = fam === 'compound';

    VOCAB_GROUPS.forEach(group => {
      if (!groupIsOffered(group, fam)) return;
      const state = groupState(group, fam);
      const block = document.createElement('div');
      block.className = 'vocab-block' + (state === 'none' ? ' off' : '');

      const head = document.createElement('button');
      head.className = 'vocab-head' + (state === 'all' ? ' active' : state === 'some' ? ' partial' : '');
      head.innerHTML =
        '<span class="vocab-head-text">' +
          '<span class="vocab-head-name"></span>' +
          '<span class="vocab-head-blurb"></span>' +
        '</span><span class="switch-pill"></span>';
      head.querySelector('.vocab-head-name').textContent = group.label;
      head.querySelector('.vocab-head-blurb').textContent = group.blurb;
      head.addEventListener('click', () => {
        setGroup(group, fam, state !== 'all');
        renderLayoutVocab();
        renderLayoutDivide();
        render();
      });
      block.appendChild(head);

      /* A division with more shapes than a grid can show is all or
         nothing. Spans never hit that — there are only ever a handful of
         them — so the test is about the group's cells alone. */
      const entries = groupCells(group, fam);
      const pickable = !entries.length || entries.every(e => cellsArePickable(e.slots));

      if (!pickable) {
        const widest = entries.reduce((a, e) => Math.max(a, e.patterns.length), 0);
        const note = document.createElement('p');
        note.className = 'card-desc lesson-hint';
        note.textContent = 'That division has ' + widest +
          ' different shapes \u2014 too many to pick between, so this group is all or nothing.';
        block.appendChild(note);
      } else {
        const grid = document.createElement('div');
        grid.className = 'vocab-grid';
        groupPictures(group, fam).forEach(pic => {
          const cell = document.createElement('button');
          cell.className = 'vocab-cell' + (pictureIsOn(pic, fam) ? ' picked' : '');
          if (pic.kind === 'span') {
            cell.classList.add('vocab-cell-span');
            cell.title = pic.pattern + ' \u00b7 ' + pic.beats + ' beats';
            cell.innerHTML = engraveSpanCell(pic.pattern, pic.beats, compound);
          } else {
            cell.title = pic.members.map(m => m.pattern).join(' / ');
            cell.innerHTML = engraveCell(pic.pattern, pic.slots, compound);
          }
          cell.addEventListener('click', () => {
            togglePicture(pic, fam);
            renderLayoutVocab();
            renderLayoutDivide();
            render();
          });
          grid.appendChild(cell);
        });
        block.appendChild(grid);
      }

      /* Illustrations, not switches: the same triplet spread over two beats
         or four, which the group's own switch already governs. */
      const runs = group.runs && group.runs[fam];
      if (runs && runs.length) {
        const extra = document.createElement('div');
        extra.className = 'vocab-grid vocab-grid-extra';
        const caption = document.createElement('span');
        caption.className = 'vocab-extra-note';
        caption.textContent = 'and across beats:';
        extra.appendChild(caption);
        runs.forEach(beats => {
          const cell = document.createElement('div');
          cell.className = 'vocab-cell static' + (state === 'none' ? '' : ' picked');
          cell.title = beats + '-beat triplet';
          cell.innerHTML = engraveRunTriplet(beats);
          extra.appendChild(cell);
        });
        block.appendChild(extra);
      }

      layoutVocabBox.appendChild(block);
    });
  }

  function renderLayoutJoins() {
    if (!layoutJoinsList) return;
    layoutJoinsList.innerHTML = '';
    layoutJoinsList.appendChild(switchRow(
      'Tied beats within and between measures',
      'Carrying a note over a barline',
      false,
      null,
      { soon: true }
    ));
  }

  /* ---- EASY mode's circles ----------------------------------------- */

  const layoutEasyBox = document.getElementById('layout-easy');

  /* One EASY choice drawn the way the staff would draw it. Every choice
     longer than a beat sits at the plain division and is read across the
     run, as engraveSpanCell reads it — but cut to the width the drawing
     actually uses, asked of the planner rather than guessed: a dotted
     whole is a whole note tied to a half, and a box sized for one
     notehead drops the tie and the half over the side. */
  const EASY_PIC_W = 80;
  function engraveEasyChoice(choice, compound) {
    if (choice.beats.length === 1) {
      return engraveCell(choice.beats[0], choice.beats[0].length, compound);
    }
    const perBeat = choice.beats[0].length;
    const flags = patternToFlags(choice.beats.join(''));
    const per = (compound ? 36 : 24) / perBeat;
    const slotBeat = flags.map((f, i) => Math.floor(i / perBeat));
    const map = {
      roles: rolesFromFlags(flags),
      slotTicks: new Array(flags.length).fill(per),
      slotBeat: slotBeat,
      slotSubGroup: slotBeat.slice(),
      tuplets: []
    };
    let last = 0;
    planNotation(map).forEach(it => { if (it.slot > last) last = it.slot; });
    const span = last + 1.5;
    const slotW = Math.max(4, Math.min(CELL_SLOT_W, EASY_PIC_W / span));
    const centres = flags.map((f, i) => slotW / 2 + i * slotW);
    return engraveRhythm(Object.assign({}, map, {
      slotCentres: centres,
      width: span * slotW,
      height: CELL_SIZE_H,
      sizeHeight: CELL_SIZE_H
    }));
  }

  function setEasyCount(fam, n) {
    const list = layout.easy[fam].slice();
    n = Math.max(1, Math.min(EASY_MAX, n));
    while (list.length > n) list.pop();
    // a new circle arrives holding the first rhythm not already on one
    while (list.length < n) {
      const spare = EASY_CHOICES[fam].find(c => list.indexOf(c.id) === -1);
      if (!spare) break;
      list.push(spare.id);
    }
    layout.easy[fam] = list;
    saveLayout();
  }

  function renderLayoutEasy() {
    if (!layoutEasyBox) return;
    layoutEasyBox.innerHTML = '';

    ['simple', 'compound'].forEach(fam => {
      const compound = fam === 'compound';
      const list = layout.easy[fam];

      const head = document.createElement('div');
      head.className = 'easy-set-head';
      const sub = document.createElement('div');
      sub.className = 'lesson-sub';
      sub.textContent = compound ? 'Compound time' : 'Simple time';
      head.appendChild(sub);

      const count = document.createElement('div');
      count.className = 'easy-count';
      count.setAttribute('role', 'group');
      count.setAttribute('aria-label', 'How many circles');
      const less = document.createElement('button');
      less.type = 'button';
      less.className = 'easy-count-btn';
      less.textContent = '−';
      less.title = 'One circle fewer';
      less.disabled = list.length <= 1;
      const value = document.createElement('span');
      value.className = 'easy-count-value';
      value.textContent = list.length + (list.length === 1 ? ' circle' : ' circles');
      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'easy-count-btn';
      more.textContent = '+';
      more.title = 'One circle more';
      more.disabled = list.length >= EASY_MAX;
      [[less, -1], [more, 1]].forEach(([btn, d]) => {
        btn.addEventListener('click', () => {
          setEasyCount(fam, list.length + d);
          renderLayoutEasy();
          render();
        });
      });
      count.appendChild(less);
      count.appendChild(value);
      count.appendChild(more);
      head.appendChild(count);
      layoutEasyBox.appendChild(head);

      const rows = document.createElement('div');
      rows.className = 'easy-set';
      list.forEach((id, i) => {
        const choice = easyChoice(fam, id);
        if (!choice) return;
        const row = document.createElement('div');
        row.className = 'easy-set-row';

        const swatch = document.createElement('span');
        swatch.className = 'easy-swatch';
        swatch.style.setProperty('--c', EASY_COLOURS[i]);

        const pic = document.createElement('span');
        pic.className = 'easy-pic';
        pic.innerHTML = engraveEasyChoice(choice, compound);

        const select = document.createElement('select');
        select.className = 'tool-select easy-select';
        select.setAttribute('aria-label', 'What circle ' + (i + 1) + ' writes');
        EASY_CHOICES[fam].forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name + (c.beats.length > 1 ? ' (' + c.beats.length + ' beats)' : '');
          // one rhythm, one circle
          opt.disabled = c.id !== id && list.indexOf(c.id) !== -1;
          select.appendChild(opt);
        });
        select.value = id;
        select.addEventListener('change', () => {
          layout.easy[fam][i] = select.value;
          saveLayout();
          renderLayoutEasy();
          render();
        });

        row.appendChild(swatch);
        row.appendChild(pic);
        row.appendChild(select);
        rows.appendChild(row);
      });
      layoutEasyBox.appendChild(rows);
    });
  }

  function renderLayoutSheet() {
    renderLayoutShow();
    renderLayoutMeters();
    renderLayoutPickup();
    renderLayoutDivide();
    renderLayoutFamily();
    renderLayoutVocab();
    renderLayoutJoins();
    renderLayoutEasy();
  }

  function openLayoutSheet() {
    if (!layoutEditable()) {
      toast(pieceLayoutInMemory
        ? 'This piece comes with its own settings — Save my copy to change them'
        : 'Your layout settings were set by whoever sent this');
      return;
    }
    closeAllPopovers();
    /* The vocabulary is per family, and the family you are working in is
       almost always the one you want to see first. */
    layoutFamily = isCompoundTime() ? 'compound' : 'simple';
    openSheet('layout-sheet');
    renderLayoutSheet();
  }

  if (layoutSheetBtn) layoutSheetBtn.addEventListener('click', openLayoutSheet);

  if (layoutFamSeg) {
    layoutFamSeg.addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      layoutFamily = btn.dataset.fam;
      renderLayoutFamily();
      renderLayoutVocab();
    });
  }

  /* ---- the beat-dot button ----------------------------------------
     Deliberately its own control rather than a line in a popover, and
     deliberately outside everything a lesson can switch off. Turning the
     dots off to read the notation, and back on to edit it, is something a
     class does every few minutes. */
  /* Three states now, walked in the order the user asked for: the dots,
     then nothing, then EASY, then the dots again — so from the usual
     screen the first press still hides the dots as it always has, and the
     second brings up EASY. A lesson that offers only one kind of circle
     makes it a plain on/off again. */
  function dotsState() {
    return !view.showDots ? 'off' : easyOn() ? 'easy' : 'regular';
  }

  function dotsCycle() {
    const states = [];
    if (regularOffered()) states.push('regular');
    states.push('off');
    if (easyOffered()) states.push('easy');
    return states;
  }

  const DOTS_TITLES = {
    regular: 'Show the beat dots',
    off:     'Hide the beat dots',
    easy:    'EASY — one tap, one rhythm'
  };

  function nextDotsState() {
    const states = dotsCycle();
    return states[(states.indexOf(dotsState()) + 1) % states.length];
  }

  function syncDotsToggle() {
    if (!dotsToggleBtn) return;
    const state = dotsState();
    dotsToggleBtn.classList.toggle('active', state !== 'off');
    dotsToggleBtn.classList.toggle('easy', state === 'easy');
    dotsToggleBtn.setAttribute('aria-pressed', String(state !== 'off'));
    dotsToggleBtn.title = DOTS_TITLES[nextDotsState()];
  }

  if (dotsToggleBtn) {
    dotsToggleBtn.addEventListener('click', () => {
      const wasEasy = easyOn();
      const next = nextDotsState();
      view.showDots = next !== 'off';
      if (next === 'easy') view.easyMode = true;
      else if (next === 'regular') view.easyMode = false;
      saveViewPrefs();
      /* Showing or hiding is only a fade; going into or out of EASY
         changes what is in every beat box. */
      if (easyOn() !== wasEasy) render();
      else updateCircleVisibility();
      syncDotsToggle();
      syncViewControls();
      if (layoutShowList && layoutShowList.children.length) renderLayoutShow();
    });
    syncDotsToggle();
  }

  /* ==================================================================
     SET UP FOR STUDENTS
     ------------------------------------------------------------------
     What is left once Layout Settings owns the vocabulary: who the
     lesson is for, what they are being asked to do with it, and how much
     of the app comes along. The rhythms themselves are whatever the
     teacher has already set up for their own work.
     ================================================================== */

  const TASK_TYPES = [
    { id: 'free',   label: 'Explore',          desc: 'The rhythm and the words are both theirs.',        r: false, w: false },
    { id: 'words',  label: 'Write the words',  desc: 'Your rhythm is fixed. They fit words to it.',      r: true,  w: false },
    { id: 'rhythm', label: 'Find the rhythm',  desc: 'Your words are fixed. They try rhythms for them.', r: false, w: true  },
    { id: 'read',   label: 'Read and play',    desc: 'Nothing changes — for reading and performing.',    r: true,  w: true  }
  ];

  const SHELL_SWITCHES = [
    { key: 'sound',   name: 'Sound options',  desc: 'Steady beat, count-in, pitch or drum, strength' },
    { key: 'view',    name: 'View options',   desc: 'Size, line length, how it scrolls' },
    { key: 'present', name: 'Present mode',   desc: 'Fills the screen for performing' },
    { key: 'picture', name: 'Save a picture', desc: 'Downloads the notation as an image' }
  ];

  const LENGTH_SWITCHES = [
    { key: 'canAdd',    name: 'Add measures',    desc: 'The + at the end of the last line' },
    { key: 'canRemove', name: 'Remove measures', desc: 'The × at the end of the last line' }
  ];

  let draft = null;         // { title, policy, songIds }
  let previewing = false;
  let previewLayoutLock = false;

  function newDraft() {
    return { title: '', policy: blankPolicy(), songIds: [] };
  }

  const sidesList = document.getElementById('lesson-sides');
  const taskGrid = document.getElementById('lesson-task-grid');
  const taskNoteInput = document.getElementById('lesson-task-note');
  const circlesSeg = document.getElementById('lesson-circles-seg');
  const circlesNote = document.getElementById('lesson-circles-note');
  const tempoSeg = document.getElementById('lesson-tempo-seg');
  const tempoRangeBox = document.getElementById('lesson-tempo-range');
  const tempoMinInput = document.getElementById('lesson-tempo-min');
  const tempoMaxInput = document.getElementById('lesson-tempo-max');
  const tempoNote = document.getElementById('lesson-tempo-note');
  const lengthList = document.getElementById('lesson-length');
  const maxMeasuresInput = document.getElementById('lesson-max-measures');
  const lessonSongList = document.getElementById('lesson-song-list');
  const lessonSongsAll = document.getElementById('lesson-songs-all');
  const lessonSongsNone = document.getElementById('lesson-songs-none');
  const shellList = document.getElementById('lesson-shell');
  const lessonTitleInput = document.getElementById('lesson-title-input');
  const lessonPreviewBtn = document.getElementById('lesson-preview-btn');
  const lessonLinkBtn = document.getElementById('lesson-link-btn');
  const lessonLinkRow = document.getElementById('lesson-link-row');
  const lessonLinkInput = document.getElementById('lesson-link-input');
  const lessonLinkCopy = document.getElementById('lesson-link-copy');
  const lessonLinkCopyText = document.getElementById('lesson-link-copy-text');
  const lessonLinkFeedback = document.getElementById('lesson-link-feedback');
  const lessonSavedList = document.getElementById('lesson-saved-list');
  const lessonSavedCard = document.getElementById('lesson-saved-card');
  const lessonLayoutSummary = document.getElementById('lesson-layout-summary');

  function renderSides() {
    if (!sidesList) return;
    sidesList.innerHTML = '';
    [['rhythm', 'Rhythm', 'Reading and writing rhythms with syllables'],
     ['poetry', 'Poetry', 'Setting words to a beat']].forEach(([key, name, desc]) => {
      sidesList.appendChild(switchRow(name, desc, draft.policy.sides[key], () => {
        const other = key === 'rhythm' ? 'poetry' : 'rhythm';
        if (draft.policy.sides[key] && !draft.policy.sides[other]) return;  // one must stay
        draft.policy.sides[key] = !draft.policy.sides[key];
        renderSetupSheet();
      }));
    });
  }

  /* A short, honest account of what the link will carry from Layout
     Settings, so nobody has to remember what they set up in there. */
  function renderLayoutSummary() {
    if (!lessonLayoutSummary) return;
    const meters = layout.meters.simple.concat(layout.meters.compound);
    const allMeters = METERS.simple.length + METERS.compound.length;
    const bits = [];

    bits.push(meters.length === allMeters ? 'every meter'
      : meters.length === 1 ? meters[0] + ' only'
      : meters.join(', '));

    const divides = [];
    if (layout.divide.sixteenths !== false) divides.push('sixteenths');
    if (layout.divide.tuplets !== false) divides.push('triplets');
    if (layout.divide.subTuplets !== false) divides.push('subdivided triplets');
    bits.push(divides.length ? divides.join(', ') : 'no beat splitting');
    if (!linkingOffered()) bits.push('no joining beats');
    const easyN = layout.easy.simple.length;
    bits.push(easyN + ' EASY circle' + (easyN === 1 ? '' : 's'));

    const narrowed = [];
    ['simple', 'compound'].forEach(fam => {
      Object.keys(layout.cells[fam]).forEach(slots => {
        narrowed.push(layout.cells[fam][slots].length + ' of ' + patternsFor(+slots).length
          + ' shapes at ' + slots + ' to a beat');
      });
      [2, 3, 4].forEach(beats => {
        const named = namedSpans(fam, beats);
        if (named.length && spansOn(fam, beats).length < named.length) {
          narrowed.push(spansOn(fam, beats).length + ' of ' + named.length
            + ' shapes across ' + beats + ' beats');
        }
      });
    });

    lessonLayoutSummary.innerHTML = '';
    const line = document.createElement('p');
    line.className = 'card-desc';
    line.textContent = 'Students get what you have set up: ' + bits.join(' · ') + '.'
      + (narrowed.length ? ' Narrowed to ' + narrowed.join(', ') + '.' : '');
    lessonLayoutSummary.appendChild(line);

    const open = document.createElement('button');
    open.className = 'text-tool';
    open.textContent = 'Change in Layout settings';
    open.addEventListener('click', () => {
      closeSheet('lesson-setup-sheet');
      openLayoutSheet();
    });
    lessonLayoutSummary.appendChild(open);
  }

  function renderTask() {
    if (!taskGrid) return;
    taskGrid.innerHTML = '';
    const current = TASK_TYPES.find(t =>
      t.r === draft.policy.task.rhythmLocked && t.w === draft.policy.task.wordsLocked);

    TASK_TYPES.forEach(type => {
      const card = document.createElement('button');
      card.className = 'task-card' + (current && current.id === type.id ? ' active' : '');
      card.innerHTML = '<span class="task-card-label"></span><span class="task-card-desc"></span>';
      card.querySelector('.task-card-label').textContent = type.label;
      card.querySelector('.task-card-desc').textContent = type.desc;
      card.addEventListener('click', () => {
        draft.policy.task.rhythmLocked = type.r;
        draft.policy.task.wordsLocked = type.w;
        /* Words only exist on the Poetry side, so a task about words takes
           the lesson there rather than leaving a Rhythm tab that cannot do
           what the task asks. */
        if (type.id === 'words' || type.id === 'rhythm') {
          draft.policy.sides.rhythm = false;
          draft.policy.sides.poetry = true;
        }
        renderSetupSheet();
      });
      taskGrid.appendChild(card);
    });

    if (taskNoteInput) {
      taskNoteInput.placeholder = TASK_BLURB[current ? current.id : 'free'];
      taskNoteInput.value = draft.policy.task.note || '';
    }
  }

  /* Easy, Regular, Both or Read only. Read only is the rhythm lock the
     task cards above already set — the two are one switch seen twice, so
     choosing either one moves the other. */
  function renderCircles() {
    if (!circlesSeg) return;
    const task = draft.policy.task;
    const mode = task.rhythmLocked ? 'read' : task.circles;
    circlesSeg.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.circles === mode);
    });
    if (!circlesNote) return;
    const names = easySet('simple').map(c => c.name.toLowerCase()).join(', ');
    circlesNote.textContent = mode === 'easy'
      ? 'The beat-dot button gives them the EASY circles and nothing else — one tap, one rhythm: '
        + names + '. Change these in Layout settings.'
      : mode === 'regular'
        ? 'The ordinary circles, one to a slot, with the + and − buttons and the chains. No EASY.'
        : mode === 'both'
          ? 'The beat-dot button walks the dots, then nothing, then EASY, so they can use either.'
          : 'The rhythm stays as you wrote it. The beat-dot button still shows and hides the dots.';
  }

  function renderTempo() {
    if (!tempoSeg) return;
    const t = draft.policy.tempo;
    const mode = t.locked ? 'locked'
      : (t.min > 40 || t.max < 240) ? 'range' : 'any';
    tempoSeg.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tempo === mode);
    });
    if (tempoRangeBox) tempoRangeBox.hidden = mode !== 'range';
    if (tempoMinInput) tempoMinInput.value = t.min;
    if (tempoMaxInput) tempoMaxInput.value = t.max;
    if (tempoNote) {
      tempoNote.textContent = mode === 'locked'
        ? 'The tempo reads as plain text at whatever each exercise was saved at.'
        : mode === 'range'
          ? 'Typing or dragging outside ' + t.min + '–' + t.max + ' is pulled back into it.'
          : 'They can set any tempo.';
    }
  }

  function renderLength() {
    if (!lengthList) return;
    lengthList.innerHTML = '';
    LENGTH_SWITCHES.forEach(item => {
      lengthList.appendChild(switchRow(item.name, item.desc, draft.policy.structure[item.key], () => {
        draft.policy.structure[item.key] = !draft.policy.structure[item.key];
        renderLength();
      }));
    });
    if (maxMeasuresInput) maxMeasuresInput.value = draft.policy.structure.maxMeasures || '';
  }

  function renderShell() {
    if (!shellList) return;
    shellList.innerHTML = '';
    SHELL_SWITCHES.forEach(item => {
      shellList.appendChild(switchRow(item.name, item.desc, draft.policy.shell[item.key], () => {
        draft.policy.shell[item.key] = !draft.policy.shell[item.key];
        renderShell();
      }));
    });
    shellList.appendChild(switchRow(
      'Move between the exercises',
      draft.songIds.length > 1
        ? 'The Songs button, holding this lesson’s ' + draft.songIds.length + ' exercises'
        : 'The Songs button — with one exercise there is nothing to move to',
      draft.policy.shell.library !== 'none',
      () => {
        draft.policy.shell.library = draft.policy.shell.library === 'none' ? 'lesson' : 'none';
        renderShell();
      }
    ));

    if (draft.policy.sides.rhythm) {
      const sub = document.createElement('div');
      sub.className = 'lesson-sub';
      sub.textContent = 'Syllable systems';
      shellList.appendChild(sub);

      const row = document.createElement('div');
      row.className = 'chip-row';
      const all = Object.keys(rhythmSystems);
      const chosen = draft.policy.shell.systems || all;
      all.forEach(name => {
        const on = chosen.indexOf(name) !== -1;
        const chip = document.createElement('button');
        chip.className = 'chip' + (on ? ' active' : '');
        chip.textContent = name;
        chip.addEventListener('click', () => {
          let list = chosen.slice();
          const at = list.indexOf(name);
          if (at === -1) list.push(name);
          else if (list.length > 1) list.splice(at, 1);
          else return;
          list = all.filter(x => list.indexOf(x) !== -1);
          draft.policy.shell.systems = list.length === all.length ? null : list;
          renderShell();
        });
        row.appendChild(chip);
      });
      shellList.appendChild(row);
    }
  }

  function renderLessonSongs() {
    if (!lessonSongList) return;
    const library = getStoredLibrary();
    lessonSongList.innerHTML = '';

    const ids = getSortedSongIds(library).filter(id => draft.policy.sides[songSide(library[id])]);

    if (!ids.length) {
      const empty = document.createElement('div');
      empty.className = 'library-empty';
      empty.textContent = 'Nothing on the sides you have chosen.';
      lessonSongList.appendChild(empty);
      return;
    }

    ids.forEach(id => {
      const song = library[id];
      const side = songSide(song);
      const st = side === 'rhythm' ? (song.rhythmState || {}) : (song.poetryState || {});
      const label = document.createElement('label');
      label.className = 'inline-check';
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = draft.songIds.indexOf(id) !== -1;
      box.addEventListener('change', () => {
        const at = draft.songIds.indexOf(id);
        if (box.checked && at === -1) draft.songIds.push(id);
        else if (!box.checked && at !== -1) draft.songIds.splice(at, 1);
        renderLessonSongs();
        renderShell();
      });
      const text = document.createElement('span');
      text.innerHTML = '<b></b> <em></em>';
      text.querySelector('b').textContent = song.title;
      text.querySelector('em').textContent =
        (side === 'rhythm' ? 'Rhythm' : 'Poetry') + ' · ' +
        (st.timeSignatureNumerator || 4) + '/' + (st.timeSignatureDenominator || 4);
      label.appendChild(box);
      label.appendChild(text);
      lessonSongList.appendChild(label);
    });

    renderMeterMismatch(library);
  }

  /* An exercise keeps the meter it was written in, whatever the layout
     allows — nothing here rewrites content. That is right, but it makes
     it easy to tick a 6/8 piece into a lesson set up entirely in simple
     time and not notice that none of the vocabulary applies to it,
     because a beat in three is governed by the compound settings. Say so
     here rather than letting it be discovered in a classroom. */
  function renderMeterMismatch(library) {
    const allowed = layout.meters.simple.concat(layout.meters.compound);
    const stray = draft.songIds.filter(id => {
      const song = library[id];
      if (!song) return false;
      const side = songSide(song);
      const st = side === 'rhythm' ? (song.rhythmState || {}) : (song.poetryState || {});
      const key = (st.timeSignatureNumerator || 4) + '/' + (st.timeSignatureDenominator || 4);
      return allowed.indexOf(key) === -1;
    });
    if (!stray.length) return;

    const anyCompound = stray.some(id => {
      const song = library[id];
      const side = songSide(song);
      const st = side === 'rhythm' ? (song.rhythmState || {}) : (song.poetryState || {});
      return st.timeSignatureDenominator === 8;
    });

    const warn = document.createElement('p');
    warn.className = 'card-desc lesson-warn';
    warn.textContent =
      stray.map(id => '“' + library[id].title + '”').join(', ') +
      (stray.length > 1 ? ' are' : ' is') +
      ' in a meter your layout settings do not list. ' +
      (anyCompound
        ? 'It opens as written, and a beat counted in three follows your Compound time settings — check those too.'
        : 'It opens as written, and its meter simply cannot be changed.');
    lessonSongList.appendChild(warn);
  }

  function renderSavedLessons() {
    if (!lessonSavedList) return;
    const saved = getStoredLessons();
    const ids = Object.keys(saved).sort((a, b) => (saved[b].savedAt || 0) - (saved[a].savedAt || 0));
    if (lessonSavedCard) lessonSavedCard.classList.toggle('policy-off', ids.length === 0);
    lessonSavedList.innerHTML = '';
    ids.forEach(id => {
      const item = saved[id];
      const row = document.createElement('div');
      row.className = 'library-song-item';

      const title = document.createElement('span');
      title.className = 'library-song-title';
      title.textContent = item.title || 'Untitled lesson';

      const actions = document.createElement('div');
      actions.className = 'library-song-actions';

      const openBtn = document.createElement('button');
      openBtn.className = 'lib-action-btn load-btn';
      openBtn.textContent = 'Edit';
      openBtn.addEventListener('click', () => {
        draft = {
          id: id,
          title: item.title || '',
          policy: normalizePolicy(item.policy) || blankPolicy(),
          songIds: (item.songIds || []).slice()
        };
        renderSetupSheet();
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'lib-action-btn delete-btn-item';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Delete this lesson';
      delBtn.addEventListener('click', () => {
        if (!confirm('Delete the lesson “' + (item.title || 'Untitled') + '”?')) return;
        const all = getStoredLessons();
        delete all[id];
        try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
        renderSavedLessons();
      });

      actions.appendChild(openBtn);
      actions.appendChild(delBtn);
      row.appendChild(title);
      row.appendChild(actions);
      lessonSavedList.appendChild(row);
    });
  }

  /* Turning a side off, or picking a task that only one side can carry,
     leaves exercises in the draft the lesson could never open. Drop them
     rather than shipping a link with a dead entry in it. */
  function pruneDraftSongs() {
    const library = getStoredLibrary();
    draft.songIds = draft.songIds.filter(id =>
      library[id] && draft.policy.sides[songSide(library[id])]);
  }

  function renderSetupSheet() {
    if (!draft) draft = newDraft();
    pruneDraftSongs();
    renderSides();
    renderLayoutSummary();
    renderTask();
    renderCircles();
    renderTempo();
    renderLength();
    renderLessonSongs();
    renderShell();
    renderSavedLessons();
    if (lessonTitleInput) lessonTitleInput.value = draft.title || '';
    if (lessonLinkRow) lessonLinkRow.hidden = true;
  }

  function getStoredLessons() {
    try { return JSON.parse(localStorage.getItem(LESSON_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  function storeLesson() {
    const all = getStoredLessons();
    const id = draft.id || ('lsn_' + Date.now());
    draft.id = id;
    all[id] = {
      id: id,
      title: draft.title,
      policy: draft.policy,
      songIds: draft.songIds.slice(),
      savedAt: Date.now()
    };
    try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
  }

  function buildLessonPayload() {
    const library = getStoredLibrary();
    const songs = draft.songIds
      .filter(id => library[id])
      .map(id => {
        const snapshot = normalizeSong(JSON.parse(JSON.stringify(library[id])));
        delete snapshot.createdAt;
        /* A lesson's exercises are the student's to work in, never shared
           songs that refuse to save — so the library header stays home. */
        ['updatedAt', 'received', 'receivedAt', 'derivedFrom', 'book', 'layout'].forEach(k => delete snapshot[k]);
        return snapshot;
      });
    return {
      lesson: 1,
      v: POLICY_VERSION,
      title: draft.title || 'Lesson',
      policy: draft.policy,
      layout: layoutSnapshot(),
      songs: songs
    };
  }

  /* ---- preview ----------------------------------------------------- */

  function startPreview() {
    leavePieceLayout();   // a lesson is built on your own settings
    if (!draft.songIds.length) { toast('Tick at least one exercise first'); return; }
    saveCurrentSongToLibrary();
    policy = normalizePolicy(draft.policy);
    lessonMeta = { title: draft.title || 'Lesson preview', songIds: draft.songIds.slice() };
    previewing = true;
    previewLayoutLock = layoutLocked;
    layoutLocked = true;
    if (previewBar) previewBar.hidden = false;
    closeSheet('lesson-setup-sheet');
    closeSheet('library-sheet');

    const side = onlySide() || currentMode;
    const library = getStoredLibrary();
    const target = draft.songIds.find(id => library[id] && songSide(library[id]) === side)
      || draft.songIds[0];

    applyPolicyToShell();
    loadSongById(target);
  }

  function endPreview() {
    previewing = false;
    policy = null;
    lessonMeta = null;
    layoutLocked = previewLayoutLock;
    if (previewBar) previewBar.hidden = true;
    applyPolicyToShell();
    render();
    showManageLibraryModal();
    openSheet('lesson-setup-sheet');
    renderSetupSheet();
  }

  if (previewExitBtn) previewExitBtn.addEventListener('click', endPreview);

  /* ---- wiring ------------------------------------------------------ */

  if (lessonSetupBtn) {
    lessonSetupBtn.addEventListener('click', () => {
      saveCurrentSongToLibrary();
      if (!draft) {
        draft = newDraft();
        const id = getCurrentSongId();
        if (id) draft.songIds = [id];
        draft.title = getCurrentSongTitle() || '';
      }
      closeSheet('library-sheet');
      openSheet('lesson-setup-sheet');
      renderSetupSheet();
    });
  }

  if (circlesSeg) {
    circlesSeg.addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      const task = draft.policy.task;
      if (btn.dataset.circles === 'read') {
        task.rhythmLocked = true;
      } else {
        task.rhythmLocked = false;
        task.circles = btn.dataset.circles;
      }
      renderSetupSheet();
    });
  }

  if (tempoSeg) {
    tempoSeg.addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      const t = draft.policy.tempo;
      if (btn.dataset.tempo === 'any') { t.locked = false; t.min = 40; t.max = 240; }
      else if (btn.dataset.tempo === 'locked') { t.locked = true; }
      else { t.locked = false; if (t.min === 40 && t.max === 240) { t.min = 60; t.max = 120; } }
      renderTempo();
    });
  }

  [[tempoMinInput, 'min'], [tempoMaxInput, 'max']].forEach(([input, key]) => {
    if (!input) return;
    input.addEventListener('change', () => {
      const v = parseInt(input.value, 10);
      if (!isNaN(v)) draft.policy.tempo[key] = Math.max(21, Math.min(600, v));
      if (draft.policy.tempo.min > draft.policy.tempo.max) {
        const t = draft.policy.tempo.min;
        draft.policy.tempo.min = draft.policy.tempo.max;
        draft.policy.tempo.max = t;
      }
      renderTempo();
    });
  });

  if (maxMeasuresInput) {
    maxMeasuresInput.addEventListener('change', () => {
      const v = parseInt(maxMeasuresInput.value, 10);
      draft.policy.structure.maxMeasures = (isNaN(v) || v < 1) ? null : Math.min(64, v);
      renderLength();
    });
  }

  if (taskNoteInput) {
    taskNoteInput.addEventListener('input', () => {
      draft.policy.task.note = taskNoteInput.value.slice(0, 160);
    });
  }

  if (lessonTitleInput) {
    lessonTitleInput.addEventListener('input', () => { draft.title = lessonTitleInput.value; });
  }

  if (lessonSongsAll) {
    lessonSongsAll.addEventListener('click', () => {
      const library = getStoredLibrary();
      draft.songIds = getSortedSongIds(library).filter(id => draft.policy.sides[songSide(library[id])]);
      renderLessonSongs();
      renderShell();
    });
  }

  if (lessonSongsNone) {
    lessonSongsNone.addEventListener('click', () => {
      draft.songIds = [];
      renderLessonSongs();
      renderShell();
    });
  }

  if (lessonPreviewBtn) lessonPreviewBtn.addEventListener('click', startPreview);

  function offerLink(link, input, row, textEl, feedbackEl) {
    if (input) input.value = link;
    if (row) row.hidden = false;
    copyToClipboard(link).then(ok => {
      if (ok) {
        if (textEl) textEl.textContent = 'Copied';
        if (feedbackEl) feedbackEl.textContent = 'Link copied to your clipboard.';
        setTimeout(() => { if (textEl) textEl.textContent = 'Copy'; }, 2500);
      } else if (input) {
        input.focus();
        input.select();
        if (feedbackEl) feedbackEl.textContent = 'Select and copy the link above.';
      }
    });
  }

  if (lessonLinkBtn) {
    lessonLinkBtn.addEventListener('click', () => {
      if (!draft.songIds.length) { toast('Tick at least one exercise first'); return; }
      if (!draft.title.trim()) draft.title = getCurrentSongTitle() || 'Lesson';
      if (lessonTitleInput) lessonTitleInput.value = draft.title;

      storeLesson();
      renderSavedLessons();

      /* In the hash, not the query: the payload carries whole songs and has
         no business being sent to a server, or landing in its logs. */
      const encoded = encodeSongToUrl(buildLessonPayload());
      const link = window.location.origin + window.location.pathname
        + '#lesson=' + encodeURIComponent(encoded);
      offerLink(link, lessonLinkInput, lessonLinkRow, lessonLinkCopyText, lessonLinkFeedback);
    });
  }

  if (lessonLinkCopy) {
    lessonLinkCopy.addEventListener('click', () => {
      if (!lessonLinkInput || !lessonLinkInput.value) return;
      copyToClipboard(lessonLinkInput.value).then(ok => {
        if (ok) {
          if (lessonLinkCopyText) lessonLinkCopyText.textContent = 'Copied';
          setTimeout(() => { if (lessonLinkCopyText) lessonLinkCopyText.textContent = 'Copy'; }, 2500);
        } else {
          lessonLinkInput.focus();
          lessonLinkInput.select();
        }
      });
    });
  }


  /* ==================================================================
     THE MUSIC STAND BRIDGE
     ------------------------------------------------------------------
     Embedded in the Music Stand, this app draws the poem and
     makes its sounds, and the Music Stand does everything else: it keeps the one
     clock both sides play to, owns the tempo and the mutes, and tells
     this frame which beat to light. So the bridge is small — read the
     piece, hand over its timeline, sound one voice now, light one beat.

     Nothing here runs outside the Music Stand, and nothing the Music Stand asks for can
     reach this app's own storage (see the block at the top of the file).
     The contract is written up in `Music Stand/README.md`;
     Ostinato Builder 2.0 exposes the same one.
     ================================================================== */
  if (EMBEDDED) {
    document.body.classList.add('embedded', 'present-mode');

    /* A guest shows the score and, until the Music Stand says otherwise,
       takes no input: the Music Stand is a player. Everything is stopped at
       the window, ahead of every handler in the app, except scrolling,
       which the browser does on its own. Keys are passed up, so Space
       still starts the Music Stand while this frame has focus.

       `bridge.editable` opens the score to the pointer. It does not open
       the app: the chrome stays away and the stylesheet decides what may
       be touched. Every touch is noted, because an edit is only reported
       when something was reached for — see afterRender().

       Ostinato Builder 2.0 carries the same block; keep the two in step. */
    let hostEditable = false;
    let touched = false;
    let toldHost = null;

    const swallow = e => {
      if (hostEditable) { touched = true; return; }
      e.stopImmediatePropagation();
      if (e.type === 'click' || e.type === 'dblclick' || e.type === 'contextmenu') e.preventDefault();
    };
    ['click', 'dblclick', 'contextmenu', 'pointerdown', 'mousedown', 'touchstart']
      .forEach(type => window.addEventListener(type, swallow, { capture: true, passive: false }));
    window.addEventListener('keydown', e => {
      if (hostEditable) {
        touched = true;
        /* A word being typed keeps its own keys, Space included — Space in
           a lyric box moves on to the next word, and the Music Stand must
           not start playing instead. */
        const t = e.target;
        if ((t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName || '')))
            || document.querySelector('.word-input')) return;
      }
      e.stopImmediatePropagation();
      if (e.code === 'Space' || e.key === ' ') e.preventDefault();
      if (typeof bridge.onHostKey === 'function') {
        bridge.onHostKey({ key: e.key, code: e.code, shiftKey: e.shiftKey,
                           metaKey: e.metaKey, ctrlKey: e.ctrlKey, altKey: e.altKey });
      }
    }, true);

    function fingerprint() {
      try { return stableStringify(bridge.snapshot()); } catch (e) { return null; }
    }

    /* render() is the end of every edit — and of every re-fit and every
       change of view, which are not edits. render() also pads the piece
       out to whole bars as it draws, so the poem can differ from the one
       that was loaded without anybody having touched it. Two gates keep
       all of that out: the pane must have been reached for since the last
       word to the host, and the piece must actually have come out
       different. */
    function afterRender() {
      if (!hostEditable || !touched || typeof bridge.onEdit !== 'function') return;
      const now = fingerprint();
      if (now === null || now === toldHost) return;
      toldHost = now;
      touched = false;
      bridge.onEdit();
    }

    /* A poem the Music Stand has just put here is where it meant to put
       it: this is the version to measure the next edit against, and
       nothing has been reached for yet. */
    function settled() {
      touched = false;
      toldHost = fingerprint();
    }

    const VIEW_KEYS = ['sizeMode', 'zoomPct', 'textPct', 'lyricFont', 'overflow',
                       'showDots', 'easyMode', 'showMeasureNumbers', 'followPlayback'];

    /* Bars on a line, chosen for the pane. This app's own 'auto' reads the
       width of the screen, which in a pane beside an ostinato is the wrong
       question: a short, wide pane wants long lines, a tall narrow one
       short lines. When the Music Stand leaves it to us and the whole poem is to
       fit, each choice is tried on paper — how big would the poem be with
       n bars to a line? — and the biggest wins. The sizes come from the
       poem as it is drawn now, so it costs one extra render at most. */
    let linesAuto = false;

    /* Every sensible way to set the poem, as its natural size at scale 1 —
       estimated from the poem as it is drawn now: the widest bar, and the
       height of a line. Only balanced settings count: for each number of
       lines, the shortest line that holds every bar. Eight bars are 8,
       4+4, 3+3+2 or 2+2+2+2 — never 7+1, which is no shorter than 4+4
       and a great deal wider. */
    function lineLayouts() {
      const lines = [...container.querySelectorAll('.line')];
      const measures = container.querySelectorAll('.measure').length;
      if (!lines.length || !measures) return [];

      let barW = 0;
      lines.forEach(line => {
        const n = line.querySelectorAll('.measure').length;
        if (n) barW = Math.max(barW, line.offsetWidth / n);
      });
      const cs = getComputedStyle(container);
      const padW = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      const padH = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      const rowH = (container.offsetHeight - padH) / lines.length;
      const zoom = view.zoomPct / 100;
      const out = [];
      for (let rows = Math.ceil(measures / 8); rows <= measures; rows++) {
        const n = Math.ceil(measures / rows);
        if (out.length && out[out.length - 1].n === n) continue;
        out.push({ n: n,
                   w: (n * barW + padW) * zoom,
                   h: (Math.ceil(measures / n) * rowH + padH) * zoom });
      }
      return out.reverse();     // shortest lines first, as the tie-breaks expect
    }

    function fitLines() {
      if (!linesAuto) return;
      if (view.sizeMode !== 'page') {
        if (view.measuresPerLine !== 'auto') { view.measuresPerLine = 'auto'; render(); }
        return;
      }
      const { availW, availH } = stageMetrics();
      let best = null;
      lineLayouts().forEach(L => {
        const scale = Math.min(FIT_MAX, availW / L.w, availH / L.h);
        /* a near-tie goes to the longer line: it reads more like verse */
        if (!best || scale >= best.scale * 0.98) best = { n: L.n, scale: scale };
      });
      if (best && best.n !== view.measuresPerLine) {
        view.measuresPerLine = best.n;
        render();
      }
    }

    let fitLinesTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(fitLinesTimer);
      fitLinesTimer = setTimeout(fitLines, 200);   // after the app's own re-render
    });

    function songSummary(id, song) {
      const side = songSide(song);
      const st = (side === 'rhythm' ? song.rhythmState : song.poetryState) || {};
      const words = side === 'poetry'
        ? (st.rawLyrics && st.rawLyrics.length ? st.rawLyrics
           : (st.words || []).filter(w => w && w !== '-' && String(w).trim()))
        : [];
      return {
        id: id,
        title: song.title || 'Untitled',
        kind: side,
        meter: [st.timeSignatureNumerator || 4, st.timeSignatureDenominator || 4],
        bpm: st.BPM || 82,
        isCustom: !!song.isCustom,
        createdAt: song.createdAt || 0,
        updatedAt: song.updatedAt || song.createdAt || 0,
        // shared with this browser, and the Teacher Library book it came in
        received: !!song.received,
        book: song.received && song.book ? String(song.book) : '',
        preview: words.slice(0, 14).join(' ')
      };
    }

    /* The live library, read past anything this frame has written. */
    function liveLibrary() {
      window.MUSIC_STAND_EMBED.forget(STORAGE_KEY);
      return getStoredLibrary();
    }

    const bridge = {
      app: 'rhythm-poetry',
      version: 1,
      onHostKey: null,
      onEdit: null,

      /* Editing in a pane. The app's own storage is already out of reach
         (see the block at the top of the file), so an edit here changes
         what is on this stand and nothing else — the poem in the library
         is not touched, and cannot be. The Music Stand keeps the result
         and saves it with the pairing. */
      get editable() { return hostEditable; },
      set editable(on) {
        on = !!on;
        if (on === hostEditable) return;
        hostEditable = on;
        document.body.classList.toggle('editing', on);
        touched = false;
        toldHost = fingerprint();
        standAfterRender = on ? afterRender : null;
        render();
      },
      /* where this app keeps its library, so the Music Stand can tell when a song
         it is showing has been edited in the app in another tab */
      libraryKey: STORAGE_KEY,

      /* The library, then the two sandboxes flagged `sandbox: true`. They
         are not library songs — getSortedSongIds() leaves them out on
         purpose — so the Music Stand is given them separately and shows them as
         scratch work rather than among the songs. One that has never been
         made (the app was never opened) is not offered. */
      listSongs() {
        const lib = liveLibrary();
        const out = getSortedSongIds(lib).map(id => songSummary(id, lib[id]));
        ['poetry', 'rhythm'].forEach(side => {
          const id = SANDBOX_IDS[side];
          if (!lib[id] || songSide(lib[id]) !== side) return;
          const entry = songSummary(id, lib[id]);
          entry.sandbox = true;
          entry.title = side === 'rhythm' ? 'Rhythm sandbox' : 'Poetry sandbox';
          out.unshift(entry);
        });
        return out;
      },

      openLibrarySong(id) {
        const lib = liveLibrary();
        if (!lib[id]) return null;
        loadSongById(id);
        fitLines();
        settled();
        return bridge.info();
      },

      /* A song that is not in the library — from a share link, or kept
         by the Music Stand. Filed in this frame's in-memory library under a
         throwaway id and opened the ordinary way, so it goes through
         exactly the path a song opened in the app itself does. */
      loadSong(raw) {
        if (!raw || typeof raw !== 'object' ||
            !(raw.poetryState || raw.rhythmState || Array.isArray(raw.words))) return null;
        const id = 'stand_' + Date.now();
        const lib = getStoredLibrary();
        lib[id] = normalizeSong({
          id: id,
          title: (typeof raw.title === 'string' && raw.title.trim()) ? raw.title.trim() : 'Shared poem',
          side: songSide(raw),
          isCustom: true,
          createdAt: Date.now(),
          poetryState: raw.poetryState,
          rhythmState: raw.rhythmState,
          words: raw.words,
          // its own Layout Settings (EASY's rhythms among them), if it came with them
          layout: raw.layout && typeof raw.layout === 'object' ? raw.layout : undefined
        });
        saveStoredLibrary(lib);
        loadSongById(id);
        fitLines();
        settled();
        return bridge.info();
      },

      /* The piece as the stand keeps it — with the build rules it is shown
         with (EASY's rhythm choices among them), so the copy the stand
         keeps, and so what the Librarian publishes, looks the same on a
         student's stand. The rules only, not the dots/EASY switch: that is
         the stand's own view, and not part of the piece. */
      snapshot() {
        const snap = buildSongSnapshot(getCurrentSongId(), getCurrentSongTitle() || 'Untitled', currentMode);
        snap.layout = { layout: JSON.parse(JSON.stringify(layout)) };
        return snap;
      },

      info() {
        const st = getActiveState();
        return {
          app: 'rhythm-poetry',
          kind: currentMode,
          title: isSandboxId(getCurrentSongId())
            ? (currentMode === 'rhythm' ? 'Rhythm sandbox' : 'Poetry sandbox')
            : (getCurrentSongTitle() || 'Untitled'),
          meter: [st.timeSignatureNumerator, st.timeSignatureDenominator],
          bpm: st.BPM,
          beatsPerMeasure: getLayoutConfig().beatsPerMeasure,
          beatTicks: beatTicks(st),
          pickupBeats: st.hasPickupMeasure ? 1 : 0,
          totalBeats: notesBoxElements.length,
          voices: [
            { id: 'rhythm', label: currentMode === 'poetry' ? 'Words' : 'Rhythm' },
            { id: 'beat', label: 'Steady beat' }
          ]
        };
      },

      /* Every sound in one pass, in ticks from the first beat — read off
         the same slot maps schedulePlayback() plays from, so the Music Stand hears
         exactly what this app would. The steady beat is a voice like any
         other, one event on every beat. */
      timeline() {
        const st = getActiveState();
        const bt = beatTicks(st);
        const total = notesBoxElements.length;
        const words = currentMode === 'rhythm' ? [] : poetryState.words;
        const notes = [];
        for (let b = 0; b < total; b++) notes.push({ tick: b * bt, voice: 'beat' });

        for (const grp of enumerateRhythmGroups(total)) {
          const map = buildSlotMap(grp.start, grp.end, words);
          let offset = 0;
          for (let i = 0; i < map.roles.length; i++) {
            const at = grp.start * bt + offset;
            offset += map.slotTicks[i];
            if (map.roles[i] !== 'note') continue;
            let held = map.slotTicks[i];
            for (let j = i + 1; j < map.roles.length && map.roles[j] === 'hold'; j++) {
              held += map.slotTicks[j];
            }
            notes.push({ tick: at, voice: 'rhythm', holdTicks: held });
          }
        }
        notes.sort((a, b) => a.tick - b.tick);
        return { beatTicks: bt, totalBeats: total, notes: notes };
      },

      attachAudio(ctx, out) {
        audioContext = ctx;
        audioOut = out || null;
        /* The kit is built around a context and a destination, so one made
           before this would be playing to the speakers on its own clock. */
        dropKit();
      },

      /* Sounds one voice now. `style` is the Music Stand's choice of tone or drum
         for the words, and `strength` how many voices deep to play it —
         this app's own two sound switches, made from there. */
      sound(voice, opts) {
        const o = opts || {};
        if (voice === 'beat') { playBrushDrum(); return; }
        if (o.strength) setSoundStrength(o.strength, { quiet: true });
        if (o.style === 'drum') playPercussion();
        else playTriangleTone(Math.max(0.06, Math.min((o.holdMs || 300) * 0.92, 3000) / 1000));
      },

      highlight(beat) {
        if (beat == null || beat < 0) { clearHighlights(); return; }
        highlightNotesBox(beat);
      },

      stop() {
        clearHighlights();
        stopFollowing();
      },

      getView() {
        const out = {};
        VIEW_KEYS.forEach(k => { out[k] = view[k]; });
        out.measuresPerLine = linesAuto ? 'auto' : view.measuresPerLine;
        return out;
      },

      /* `measuresPerLine: 'auto'` here means fitLines(), not the app's own
         screen-width rule. */
      setView(partial) {
        if (!partial) return;
        VIEW_KEYS.forEach(k => { if (partial[k] !== undefined) view[k] = partial[k]; });
        if (partial.measuresPerLine !== undefined) {
          linesAuto = partial.measuresPerLine === 'auto';
          if (!linesAuto) view.measuresPerLine = partial.measuresPerLine;
        }
        syncViewControls();
        render();
        fitLines();
        /* A face that has not arrived yet is measured in its fallback, so
           once it has, the words are measured again and the bars re-fitted. */
        if (partial.lyricFont !== undefined) relayoutWhenLyricFontLoads(fitLines);
      },

      /* What the Music Stand needs to share the room out fairly: the poem's size
         at scale 1, the padding around it, and how it scales —
           'page'  shrinks to fit both ways (the Music Stand's default)
           'fit'   always fills the width, and scrolls down if it must
           'fixed' one size, whatever the room */
      sizing() {
        const cs = getComputedStyle(stage);
        const zoom = view.sizeMode === 'fixed' ? 1 : view.zoomPct / 100;
        return {
          w: container.offsetWidth * zoom,
          h: container.offsetHeight * zoom,
          padW: parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + 4,
          padH: parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + 4,
          maxScale: FIT_MAX,
          mode: view.sizeMode === 'fixed' || view.sizeMode === 'fit' ? view.sizeMode : 'page',
          fixedScale: view.zoomPct / 100,
          /* Every way the bars could be set on a line, so the Music Stand
             can weigh them against the ostinato. It is a list of what
             this poem *could* look like, not of what it currently does,
             so it must not depend on whether the stand has already
             chosen one — a menu that empties as soon as something is
             ordered from it leaves the stand with the first shape it
             happened to pick, for good. */
          layouts: view.sizeMode === 'page' ? lineLayouts() : null
        };
      },

      refit() { render(); }
    };

    window.MusicStandBridge = bridge;
  }

  // --- INITIALIZATION ---
  /* A lesson link wins over everything else: it is the reason the page was
     opened at all, and it decides which songs the rest of this can see.
     Embedded in the Music Stand there is no link to read — the Music Stand sends the song. */
  let songIdToLoad = null;
  const lessonPayload = EMBEDDED ? null : checkUrlForLesson();
  if (lessonPayload) songIdToLoad = openLesson(lessonPayload);

  const library = getStoredLibrary();
  const sharedSong = (songIdToLoad || EMBEDDED) ? null : checkUrlForSharedSong();

  // What was open on each side last time.
  function restoreActiveIds() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(ACTIVE_SONG_ID_KEY) || 'null'); } catch (e) {}
    if (!saved || typeof saved !== 'object') return;
    ['rhythm', 'poetry'].forEach(side => {
      const id = saved[side];
      if (id && library[id] && songSide(library[id]) === side) {
        currentSongIds[side] = id;
        currentSongTitles[side] = library[id].title;
      }
    });
  }
  let sharedFiled = null;
  if (sharedSong && (sharedSong.poetryState || sharedSong.rhythmState || sharedSong.words || sharedSong.title)) {
    /* Each part lands where it came from: a sandbox into this person's
       sandbox on that side (it is scratch work — that is what the sandbox
       is for), anything else into the library as a shared song — once.

       A page embedded in a Google Site opens with its link every time it
       is visited, so filing it is not "add a song" but "make sure it is
       here": the same id, or (for links made before ids travelled) the
       same content, finds the copy already filed. A newer version of it
       replaces the old one. A blank song is not filed at all. See
       EVM.file in lib/evm-library.js. */
    restoreActiveIds();   // the side a link doesn't cover stays as it was
    const fileShared = (song) => {
      const side = songSide(song);
      const record = {
        id: song.id, title: (song.title && song.title.trim()) ? song.title.trim() : 'Shared Song',
        side: side, createdAt: song.createdAt, updatedAt: song.updatedAt,
        poetryState: song.poetryState, rhythmState: song.rhythmState, words: song.words
      };
      if (song.sandbox) {
        const id = SANDBOX_IDS[side];
        library[id] = normalizeSong(Object.assign(record, {
          id: id, title: SANDBOX_TITLE, isCustom: true, createdAt: Date.now(), updatedAt: undefined }));
        return { action: 'sandbox', id: id };
      }
      const incoming = normalizeSong(Object.assign({}, record, { id: record.id || 'incoming' }));
      if (!record.id) delete incoming.id;     // a link from before ids travelled
      return EVM.file(library, incoming, fileOpts(true));
    };
    const result = fileShared(sharedSong);
    const sharedId = result.id;
    sharedFiled = result;
    /* The other side's song, if the sender sent one: filed beside it and
       made that side's current song, so switching sides finds it. */
    const partner = sharedSong.partner;
    const partnerSide = partner ? songSide(partner) : null;
    if (partner && partnerSide !== songSide(sharedSong) &&
        (partner.rhythmState || partner.poetryState)) {
      const partnerResult = fileShared(
        { id: partner.id, createdAt: partner.createdAt, updatedAt: partner.updatedAt,
          title: partner.title, side: partnerSide, sandbox: !!partner.sandbox,
          poetryState: partner.poetryState, rhythmState: partner.rhythmState });
      if (partnerResult.id) {
        currentSongIds[partnerSide] = partnerResult.id;
        currentSongTitles[partnerSide] = library[partnerResult.id].title;
      }
    }
    saveStoredLibrary(library);
    songIdToLoad = sharedId;
    if (!songIdToLoad) songIdToLoad = currentSongIds[songSide(sharedSong)] || ensureSongForSide(songSide(sharedSong));
    // A song sent with its layout locked carries the sender's settings and
    // closes the sheet that would let them be changed.
    if (sharedSong.layout) applyLayoutSnapshot(sharedSong.layout, !!sharedSong.layoutLocked);
    try {
      window.history.replaceState(null, document.title, window.location.pathname);
    } catch (e) {}
  } else if (!songIdToLoad) {
    restoreActiveIds();
    songIdToLoad = currentSongIds.rhythm || ensureSongForSide('rhythm');
  }

  /* A song that arrived in a link is filed as shared, which never
     auto-saves; a sandbox link keeps itself as a sandbox always does. */
  if (songIdToLoad) loadSongById(songIdToLoad, { autoSave: !!sharedSong });
  if (sharedFiled) {
    const t = (getStoredLibrary()[sharedFiled.id] || {}).title || 'the song';
    const said = {
      added: 'Added “' + t + '” to your library',
      same: 'Opened “' + t + '” from your library',
      matched: 'Opened “' + t + '” from your library',
      updated: 'Updated “' + t + '” to the newest version',
      kept: 'Opened “' + t + '” — you already have a newer version',
      blank: 'That link holds an empty song, so nothing was added'
    }[sharedFiled.action];
    if (said) toast(said);
  }
  applyPolicyToShell();

  if (toggleReplaceBtn) toggleReplaceBtn.classList.add('active');
  if (toggleAddBtn) toggleAddBtn.classList.remove('active');

  syncViewControls();
  updateCircleVisibility();
  render();
  relayoutWhenLyricFontLoads();

  /* The Teacher Library shelf: books out are kept in step every visit
     (new songs arrive, put-back and deleted ones leave). Not in the Music
     Stand, which must not write this app's library, and not in a lesson. */
  if (window.EVMShelf) {
    EVMShelf.init({
      app: 'rhythm-poetry',
      disabled: EMBEDDED || !!lessonMeta,
      load: getStoredLibrary,
      save: saveStoredLibrary,
      incoming: rec => normalizeSong(Object.assign({}, rec, { id: rec.id || 'incoming' })),
      key: songKey,
      changed: shelfChanged,
      openSong: id => {
        saveCurrentSongToLibrary();
        loadSongById(id);
        hideManageLibraryModal();
      }
    });
    EVMShelf.sync();
  }

  // --- keep the staff fitted as things change ---
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { render(); }, 120);
  });

  if (window.ResizeObserver && stage) {
    let firstObservation = true;
    new ResizeObserver(() => {
      if (firstObservation) { firstObservation = false; return; }
      applyZoom();
    }).observe(stage);
  }

  // SVGs decode after the first paint, so refit once they have real dimensions.
  window.addEventListener('load', () => requestAnimationFrame(applyZoom));


  window.addEventListener('beforeunload', () => saveCurrentSongToLibrary());
})();
(function() {
  const container = document.getElementById('poem');

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
  let beatEnabled = true; // Beat toggle state
  let rhythmEnabled = true; // Rhythm toggle state
  let introEnabled = true; // Intro count-in state
  let textImportMode = 'replace'; // 'add' or 'replace'
  let savedTextInput = ''; // Store the text from the modal
  let pitchMode = 'pitch'; // 'pitch' or 'drum'
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
    overflow: 'scroll',
    measuresPerLine: 'auto',
    showDots: true,
    showMeasureNumbers: true,
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
    try { localStorage.setItem(VIEW_PREFS_KEY, JSON.stringify(view)); } catch (e) {}
  }
  loadViewPrefs();

  let fitScale = 1;        // the scale that would make the widest line fill the width
  let appliedScale = 1;    // what is actually on screen right now
  let lineIsCramped = [];  // per line: would splitting it make the whole staff bigger?

  // Audio context for generating sounds
  let audioContext = null;

  function getActiveState() {
    return currentMode === 'rhythm' ? rhythmState : poetryState;
  }

  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

    // Distribute words from rawLyrics into all active note positions in order
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

    return true;
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

  function playBrushDrum() {
    if (!beatEnabled) return;
    const ctx = initAudioContext();
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    source.buffer = createBrushDrumSound();
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    source.start();
    source.stop(ctx.currentTime + 0.1);
  }

  function playBassDrum() {
    if (!rhythmEnabled) return;
    const ctx = initAudioContext();
    const time = ctx.currentTime;

    const bodyOsc = ctx.createOscillator();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(150, time);
    bodyOsc.frequency.exponentialRampToValueAtTime(40, time + 0.15);

    const attackOsc = ctx.createOscillator();
    attackOsc.type = 'triangle';
    attackOsc.frequency.setValueAtTime(200, time);
    attackOsc.frequency.exponentialRampToValueAtTime(50, time + 0.03);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
        noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

    const attackGain = ctx.createGain();
    attackGain.gain.setValueAtTime(0.6, time);
    attackGain.gain.exponentialRampToValueAtTime(0.01, time + 0.04);

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, time);
    mainGain.gain.linearRampToValueAtTime(0.8, time + 0.005);
    mainGain.gain.exponentialRampToValueAtTime(0.3, time + 0.1);
    mainGain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
    mainGain.gain.linearRampToValueAtTime(0, time + 0.45);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.Q.setValueAtTime(1, time);

    bodyOsc.connect(filter);
    attackOsc.connect(attackGain);
    noiseSource.connect(noiseGain);
    
    attackGain.connect(mainGain);
    noiseGain.connect(mainGain);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    bodyOsc.start(time);
    attackOsc.start(time);
    noiseSource.start(time);
    
    bodyOsc.stop(time + 0.45);
    attackOsc.stop(time + 0.45);
    noiseSource.stop(time + 0.45);
  }

  function playTriangleTone(duration = 0.2) {
    if (!rhythmEnabled) return;
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(110, ctx.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + duration - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
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
  function beatSlotTuplet(slots, state = null) {
    if (isCompoundTime(state)) {
      if (slots === 2) return { count: 2, inSpaceOf: 3, show: 2 };
      if (slots === 4) return { count: 4, inSpaceOf: 6, show: 2 };
      return null;
    }
    if (slots === 3) return { count: 3, inSpaceOf: 2, show: 3 };
    if (slots === 6) return { count: 6, inSpaceOf: 4, show: 3 };
    return null;
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

    trigger.addEventListener('mouseenter', show);
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
  }

  // Song Library & Modal Elements
  const newSongBtn = document.getElementById('newSongBtn');
  const newSongBtnLabel = document.getElementById('newSongBtnLabel');
  const saveAsBtn = document.getElementById('saveAsBtn');
  const libraryBtn = document.getElementById('library-btn');
  const songChip = document.getElementById('song-chip');
  const songChipLabel = document.getElementById('song-chip-label');
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

  function effectiveScale(naturalW, availableW) {
    if (view.sizeMode === 'fixed') return view.zoomPct / 100;
    fitScale = Math.min(FIT_MAX, availableW / naturalW);
    return fitScale * (view.zoomPct / 100);
  }

  function stageMetrics() {
    const styles = getComputedStyle(stage);
    return {
      availW: stage.clientWidth
        - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight) - 4
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

    const { availW } = stageMetrics();

    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, effectiveScale(naturalW, availW)));
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
    return out;
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
      const timeA = (library[a] && library[a].createdAt) || 0;
      const timeB = (library[b] && library[b].createdAt) || 0;
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
    return getSortedSongIds(library).filter(id => songSide(library[id]) === side);
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

  function saveCurrentSongToLibrary() {
    const id = getCurrentSongId();
    if (!id) return;
    const library = getStoredLibrary();
    const existing = library[id] || {};

    // Never let one side overwrite a song that belongs to the other.
    if (existing.id && songSide(existing) !== currentMode) return;

    const snapshot = buildSongSnapshot(id, getCurrentSongTitle() || 'Untitled', currentMode);
    snapshot.isCustom = existing.isCustom !== undefined ? existing.isCustom : !DEFAULT_SONGS[id];
    snapshot.createdAt = existing.createdAt || Date.now();

    library[id] = snapshot;
    saveStoredLibrary(library);
  }

  function updateSongChip() {
    const title = getCurrentSongTitle() || 'Untitled';
    if (songChipLabel) songChipLabel.textContent = title;
    if (nowEditingTitle) nowEditingTitle.textContent = title;
    if (nowEditingBadge) {
      nowEditingBadge.textContent = currentMode === 'rhythm' ? 'Rhythm' : 'Poetry';
      nowEditingBadge.className = 'side-badge ' + (currentMode === 'rhythm' ? 'badge-rhythm' : 'badge-poetry');
    }
    if (newSongBtnLabel) newSongBtnLabel.textContent = currentMode === 'rhythm' ? 'New rhythm' : 'New poem';
  }

  function loadSongById(songId) {
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

    setMode(side);
  }

  if (rhythmSystemsDropdown) {
    rhythmSystemsDropdown.addEventListener('change', (e) => {
      rhythmState.currentRhythmSystem = e.target.value;
      saveCurrentSongToLibrary();
      render();
    });
  }

  // --- TITLE PROMPT (used for both "new" and "save a copy") ---
  function updateNewSongModalTexts() {
    const isRhythm = currentMode === 'rhythm';
    const noun = isRhythm ? 'rhythm' : 'poem';
    const heading = document.getElementById('newSongModalHeading');
    const subtext = document.getElementById('newSongModalSubtext');

    if (titlePromptIntent === 'saveAs') {
      if (heading) heading.textContent = 'Save a copy';
      if (subtext) subtext.textContent = `This keeps the original and starts a new ${noun} from where you are.`;
      if (confirmNewSongBtn) confirmNewSongBtn.textContent = 'Save the copy';
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
    newSongTitleInput.value = titlePromptIntent === 'saveAs'
      ? `${getCurrentSongTitle() || 'Untitled'} copy`
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

    const side = currentMode;
    const id = 'song_' + Date.now();
    const record = {
      id: id,
      title: trimmed,
      side: side,
      isCustom: true,
      createdAt: Date.now()
    };
    if (side === 'rhythm') record.rhythmState = blankStateForSide('rhythm');
    else record.poetryState = blankStateForSide('poetry');

    const library = getStoredLibrary();
    library[id] = record;
    saveStoredLibrary(library);

    hideNewSongModal();
    closeSheet('library-sheet');
    loadSongById(id);
    toast(side === 'rhythm' ? 'New rhythm created' : 'New poem created');
  }

  function saveCurrentSongAs(title) {
    const trimmed = (title && title.trim()) ? title.trim() : '';
    if (!trimmed) { rejectEmptyTitle(); return; }

    const side = currentMode;
    const id = 'song_' + Date.now();
    const record = buildSongSnapshot(id, trimmed, side);
    record.isCustom = true;
    record.createdAt = Date.now();

    const library = getStoredLibrary();
    library[id] = record;
    saveStoredLibrary(library);

    hideNewSongModal();
    closeSheet('library-sheet');
    loadSongById(id);
    toast('Saved as “' + trimmed + '”');
  }

  // --- LIBRARY SHEET ---
  function showManageLibraryModal() {
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

    const actions = document.createElement('div');
    actions.className = 'library-song-actions';

    const loadBtn = document.createElement('button');
    if (isCurrent) {
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

    const renameBtn = document.createElement('button');
    renameBtn.className = 'lib-action-btn';
    renameBtn.textContent = 'Rename';
    renameBtn.addEventListener('click', () => {
      const newTitle = prompt('New name:', song.title);
      if (newTitle && newTitle.trim()) {
        const lib = getStoredLibrary();
        if (!lib[id]) return;
        lib[id].title = newTitle.trim();
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

      if (id === currentSongIds[side]) {
        currentSongIds[side] = null;
        currentSongTitles[side] = '';
        const remaining = getSongIdsBySide(lib, side);
        if (remaining.length > 0) {
          loadSongById(remaining[0]);
        } else {
          ensureSongForSide(side);
        }
      }
      persistActiveIds();
      renderLibrarySongList();
      updateSongChip();
    });

    actions.appendChild(loadBtn);
    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    row.appendChild(meter);
    row.appendChild(titleSpan);
    row.appendChild(actions);
    return row;
  }

  function renderLibrarySongList() {
    if (!librarySongList) return;
    const library = getStoredLibrary();
    librarySongList.innerHTML = '';

    // The side you are on is listed first.
    const order = currentMode === 'rhythm' ? ['rhythm', 'poetry'] : ['poetry', 'rhythm'];

    order.forEach(side => {
      const meta = SIDE_META[side];
      const ids = getSongIdsBySide(library, side);

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

  function handleShareCurrentSong() {
    saveCurrentSongToLibrary();
    const songData = buildSongSnapshot(
      'shared', getCurrentSongTitle() || 'Shared Song', currentMode
    );

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
        let importedSongs = [];

        if (Array.isArray(json)) {
          importedSongs = json;
        } else if (json && Array.isArray(json.songs)) {
          importedSongs = json.songs;
        } else if (json && typeof json === 'object') {
          Object.keys(json).forEach(k => {
            if (json[k] && typeof json[k] === 'object' && (json[k].poetryState || json[k].rhythmState || json[k].words || json[k].title)) {
              importedSongs.push(json[k]);
            }
          });
        }

        if (importedSongs.length === 0) {
          if (uploadStatusMsg) {
            uploadStatusMsg.textContent = 'No valid songs found in file.';
            uploadStatusMsg.className = 'status-msg error';
          }
          return;
        }

        const library = getStoredLibrary();
        let addedCount = 0;

        importedSongs.forEach(song => {
          if (song && (song.title || song.poetryState || song.rhythmState || song.words)) {
            const title = (song.title && song.title.trim()) ? song.title.trim() : 'Imported Song';
            let id = song.id || ('song_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
            if (library[id]) {
              id = 'song_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            }

            library[id] = normalizeSong({
              id: id,
              title: title,
              side: songSide(song),
              isCustom: true,
              createdAt: Date.now(),
              poetryState: song.poetryState,
              rhythmState: song.rhythmState,
              words: song.words
            });
            addedCount++;
          }
        });

        saveStoredLibrary(library);
        renderExportSongList();
        renderLibrarySongList();

        if (uploadStatusMsg) {
          uploadStatusMsg.textContent = `✓ Successfully imported ${addedCount} song${addedCount > 1 ? 's' : ''}!`;
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

      currentSongIds.rhythm = null;
      currentSongIds.poetry = null;
      currentSongTitles.rhythm = '';
      currentSongTitles.poetry = '';
      getStoredLibrary();

      loadSongById(ensureSongForSide(currentMode));
      renderLibrarySongList();
      renderExportSongList();

      if (resetStatusMsg) {
        resetStatusMsg.textContent = '✓ All user data deleted. Restored to defaults!';
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
    render();
  }

  // Give a side something to open when it has no current song.
  function ensureSongForSide(side) {
    const library = getStoredLibrary();
    if (currentSongIds[side] && library[currentSongIds[side]] &&
        songSide(library[currentSongIds[side]]) === side) {
      return currentSongIds[side];
    }
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

  function switchSide(side) {
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

  // --- View switches ---
  const circleIcon = document.getElementById('circle-icon');
  if (circleIcon) {
    circleIcon.addEventListener('click', () => {
      view.showDots = !view.showDots;
      circleIcon.classList.toggle('active', view.showDots);
      updateCircleVisibility();
      saveViewPrefs();
      applyZoom();
    });
  }

  const measureNumToggle = document.getElementById('measure-num-toggle');
  if (measureNumToggle) {
    measureNumToggle.addEventListener('click', () => {
      view.showMeasureNumbers = !view.showMeasureNumbers;
      measureNumToggle.classList.toggle('active', view.showMeasureNumbers);
      document.body.classList.toggle('hide-measure-numbers', !view.showMeasureNumbers);
      saveViewPrefs();
    });
  }

  // Pickup measure — previously only reachable by double-clicking beat one.
  const pickupToggle = document.getElementById('pickup-toggle');

  function updatePickupToggle() {
    if (!pickupToggle) return;
    pickupToggle.classList.toggle('active', !!getActiveState().hasPickupMeasure);
  }

  if (pickupToggle) {
    pickupToggle.addEventListener('click', () => {
      const st = getActiveState();
      st.hasPickupMeasure = !st.hasPickupMeasure;
      updatePickupToggle();
      render();
    });
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

    if (circleIcon) circleIcon.classList.toggle('active', view.showDots);
    if (measureNumToggle) measureNumToggle.classList.toggle('active', view.showMeasureNumbers);
    if (lineToolsToggle) lineToolsToggle.classList.toggle('active', view.showLineTools);
    if (followToggle) followToggle.classList.toggle('active', view.followPlayback);
    if (pictureColorDots) pictureColorDots.checked = view.colorDotsInPicture;

    document.body.classList.toggle('hide-measure-numbers', !view.showMeasureNumbers);
    document.body.classList.toggle('hide-line-tools', !view.showLineTools);

    updateZoomReadout();
  }

  // --- Present mode ---
  const presentBtn = document.getElementById('present-btn');
  const presentExitBtn = document.getElementById('present-exit-btn');
  const presentPlayBtn = document.getElementById('present-play-btn');

  function setPresentMode(on) {
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
  if (timeSignatureTopBtn) {
    timeSignatureTopBtn.addEventListener('click', () => {
      const activeState = getActiveState();
      if (activeState.timeSignatureDenominator === 4) {
        switch(activeState.timeSignatureNumerator) {
          case 4: activeState.timeSignatureNumerator = 3; break;
          case 3: activeState.timeSignatureNumerator = 2; break;
          case 2: activeState.timeSignatureNumerator = 6; break;
          case 6: activeState.timeSignatureNumerator = 5; break;
          case 5: activeState.timeSignatureNumerator = 4; break;
          default: activeState.timeSignatureNumerator = 4;
        }
      } else {
        switch(activeState.timeSignatureNumerator) {
          case 6: activeState.timeSignatureNumerator = 9; break;
          case 9: activeState.timeSignatureNumerator = 12; break;
          case 12: activeState.timeSignatureNumerator = 6; break;
          default: activeState.timeSignatureNumerator = 6;
        }
      }
      updateTimeSignatureDisplay();
      render();
    });
  }

  if (timeSignatureBottomBtn) {
    timeSignatureBottomBtn.addEventListener('click', () => {
      const activeState = getActiveState();
      if (currentMode === 'poetry') {
        poetryState.canonical12 = mergeViewIntoCanonical(poetryState.canonical12, poetryState.words);
        if (poetryState.timeSignatureDenominator === 4) {
          poetryState.timeSignatureDenominator = 8;
          poetryState.timeSignatureNumerator = 6;
          poetryState.linkedBeats = {};
        } else {
          poetryState.timeSignatureDenominator = 4;
          poetryState.timeSignatureNumerator = 4;
          poetryState.linkedBeats = {};
        }
        poetryState.words = fromCanonical12(poetryState.canonical12);
      } else {
        if (rhythmState.timeSignatureDenominator === 4) {
          rhythmState.timeSignatureDenominator = 8;
          rhythmState.timeSignatureNumerator = 6;
          rhythmState.beatSubdivisions = {};
          rhythmState.linkedBeats = {};
          rhythmState.beats = rhythmState.beats.map(b => [b[0] ?? true, b[1] ?? true, false]);
        } else {
          rhythmState.timeSignatureDenominator = 4;
          rhythmState.timeSignatureNumerator = 4;
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
  if (bpmButton) {
    bpmButton.addEventListener('click', () => {
      const activeState = getActiveState();
      const currentBPM = activeState.BPM;
      const input = document.createElement('input');
      input.type = 'number';
      input.value = currentBPM;
      input.className = 'bpm-input';
      
      bpmButton.innerHTML = '';
      bpmButton.appendChild(input);
      input.focus();
      input.select();

      const onUpdate = () => {
        let newValue = parseInt(input.value, 10);
        if (isNaN(newValue) || newValue <= 20) newValue = 82;
        if (newValue > 600) newValue = 600;

        activeState.BPM = newValue;
        bpmValueSpan.textContent = activeState.BPM;

        // rebuild with both spans so the styled unit label survives editing
        bpmButton.innerHTML = '';
        bpmButton.appendChild(bpmValueSpan);
        bpmButton.appendChild(bpmUnitSpan);
        saveCurrentSongToLibrary();
      };

      input.addEventListener('blur', onUpdate);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        } else if (e.key === 'Escape') {
          input.value = currentBPM;
          input.blur();
        }
      });
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
    isDisabled: () => !!bpmButton.querySelector('.bpm-input'), // typed editor is open
    onInput: (v) => {
      getActiveState().BPM = v;
      if (bpmValueSpan) bpmValueSpan.textContent = v;
    },
    onChange: () => saveCurrentSongToLibrary()
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
  }
  if (pitchModeBtn) pitchModeBtn.addEventListener('click', () => setPitchMode('pitch'));
  if (drumModeBtn) drumModeBtn.addEventListener('click', () => setPitchMode('drum'));

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

  function schedulePlayback(delay = 0, startBeat = 0) {
    const activeState = getActiveState();
    const isRhythm = currentMode === 'rhythm';
    const BPM = activeState.BPM;
    const beatInterval = 60000 / BPM;
    const totalBeats = notesBoxElements.length;
    if (totalBeats === 0) return;

    if (startBeat >= totalBeats) {
      startBeat = 0;
    }

    const totalDuration = (totalBeats - startBeat) * beatInterval;

    // Schedule BEAT track
    for (let beat = startBeat; beat < totalBeats; beat++) {
      const timeDelay = delay + ((beat - startBeat) * beatInterval);
      const beatTimeout = setTimeout(() => {
        if (isPlaying) {
          currentPlayPosition = beat;
          highlightNotesBox(beat);
          if (beatEnabled) playBrushDrum();
        }
      }, timeDelay);
      playTimeouts.push(beatTimeout);
    }

    /* Schedule the RHYTHM track.

       Onsets are read off the same slot maps the notation is drawn from,
       so what is heard and what is printed can never drift apart. Working
       in ticks is what lets a triplet land on thirds of a beat, and it is
       also how a note learns how long it should ring: a half note holds
       for two beats rather than clicking once and stopping. */
    const tickMs = beatInterval / beatTicks(activeState);
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

        const timeDelay = delay + at * tickMs;
        const holdMs = heldTicks * tickMs;
        const rhythmTimeout = setTimeout(() => {
          if (isPlaying && rhythmEnabled) {
            if (pitchMode === 'pitch') {
              playTriangleTone(Math.min(holdMs * 0.92, 3000) / 1000);
            } else {
              playBassDrum();
            }
          }
        }, timeDelay);
        playTimeouts.push(rhythmTimeout);
      }
    }

    const loopTimeout = setTimeout(() => {
      if (isPlaying) {
        isFirstPlay = false;
        currentPlayPosition = 0;
        schedulePlayback(0, 0);
      }
    }, delay + totalDuration);
    playTimeouts.push(loopTimeout);
  }

  function startPlayback() {
    initAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const activeState = getActiveState();
    const BPM = activeState.BPM;
    const beatInterval = 60000 / BPM;

    isPlaying = true;
    isPaused = false;
    currentPlayPosition = activeState.selectedPlayStartPosition || 0;
    setPlayGlyph('■', 'playing');
    document.body.classList.add('playback-active');
    document.body.classList.remove('playback-paused');

    const shouldPlayCountIn = introEnabled && (isFirstPlay || activeState.selectedPlayStartPosition !== null);

    if (shouldPlayCountIn) {
      let countInBeats = 4;
      if (isFirstPlay && activeState.hasPickupMeasure && activeState.selectedPlayStartPosition === null) {
        countInBeats = 3;
      }
      
      for (let i = 0; i < countInBeats; i++) {
        const timeDelay = i * beatInterval;
        const countInTimeout = setTimeout(() => { 
          if (isPlaying) playBrushDrum(); 
        }, timeDelay);
        playTimeouts.push(countInTimeout);
      }
      
      schedulePlayback(countInBeats * beatInterval, currentPlayPosition);
    } else {
      schedulePlayback(0, currentPlayPosition);
    }
  }

  function pausePlayback() {
    if (!isPlaying) return;
    isPlaying = false;
    isPaused = true;
    stopFollowing();
    playTimeouts.forEach(timeout => clearTimeout(timeout));
    playTimeouts = [];
    setPlayGlyph('▶', 'paused');
    document.body.classList.add('playback-paused');
  }

  function resumePlayback() {
    if (!isPaused) return;
    initAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    isPlaying = true;
    isPaused = false;
    setPlayGlyph('■', 'playing');
    document.body.classList.add('playback-active');
    document.body.classList.remove('playback-paused');

    schedulePlayback(0, currentPlayPosition);
  }

  function stopPlayback() {
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
  document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    const inField = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

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
    const state = getActiveState();
    const current = getBeatSubdivision(beatIndex);
    if (beatSlotTuplet(current, state)) return;      // in a triplet: - is the way out

    const sixteenths = sixteenthSubdivision(state);
    const next = current === sixteenths ? defaultSubdivision(state) : sixteenths;
    setBeatSubdivision(beatIndex, next);
    reshapeBeatCells(beatIndex, current, next);
    render();
  }

  /* ---- the - button: the opposite feel ----
     On a lone beat it walks that beat through the other grouping and its
     subdivision. On a run of linked beats it spreads a tuplet across the
     whole run instead, so three notes can sit across two beats. One more
     press after the last rung turns it off again. */
  function tripletContextFor(beatIndex) {
    const state = getActiveState();
    const existingRun = findTupletRun(beatIndex, state);
    if (existingRun) {
      const ladder = runTupletLadder(existingRun.beats, state);
      return ladder ? { kind: 'run', start: existingRun.start, beats: existingRun.beats, ladder: ladder, level: ladder.indexOf(existingRun.slots) } : null;
    }
    const group = getLinkGroup(beatIndex);
    if (group.length > 1) {
      /* Spreading a tuplet across beats puts notes between the beat lines,
         which the lyric grid has no way to hold, so it stays in Rhythm. */
      if (currentMode !== 'rhythm') return null;
      const ladder = runTupletLadder(group.length, state);
      if (!ladder) return null;
      return { kind: 'run', start: group.start, beats: group.length, ladder: ladder, level: -1 };
    }
    const ladder = beatTupletLadder(state);
    const current = getBeatSubdivision(beatIndex, state);
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

  function toggleBeatLink(leftBeatIndex) {
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
    if (beatIndex === 0) {
        group.addEventListener('dblclick', (e) => {
            if (!canHoverPrecisely()) return;
            if (e.target.closest('.circle')) return;
            e.preventDefault();
            activeState.hasPickupMeasure = !activeState.hasPickupMeasure;
            render();
        });
    }

    const circlesDiv = document.createElement('div');
    circlesDiv.className = 'circles';
    if (!view.showDots) circlesDiv.classList.add('circles-hidden');
    
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
    {
      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'beat-subdivision-controls';

      const sixteenths = sixteenthSubdivision(activeState);
      const inTuplet = !!tupletRun || !!beatSlotTuplet(circlesInThisBeat, activeState);

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

      const ctx = tripletContextFor(beatIndex);
      const minusBtn = document.createElement('button');
      minusBtn.className = 'subdivision-btn minus-btn';
      minusBtn.textContent = '−';
      minusBtn.disabled = !ctx;
      if (ctx && ctx.level >= 0) minusBtn.classList.add('active');
      minusBtn.title = !ctx
        ? 'No triplet fits here'
        : ctx.kind === 'run'
          ? (ctx.level < 0 ? 'Spread a triplet across these ' + ctx.beats + ' beats' : 'Divide the triplet further, then off')
          : (ctx.level < 0 ? (isCompoundTime(activeState) ? 'Two in the time of three' : 'Triplet') : 'Divide it further, then off');
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cycleBeatTriplet(beatIndex);
      });

      controlsDiv.appendChild(plusBtn);
      controlsDiv.appendChild(minusBtn);
      circlesDiv.appendChild(controlsDiv);
    }

    // Add chain link button between this beat and the next beat if both are 2-circle boxes in the same measure
    if (activeState.timeSignatureDenominator !== 8 && circlesInThisBeat === 2 && areBeatsInSameMeasure(beatIndex, beatIndex + 1) && getBeatSubdivision(beatIndex + 1) === 2) {
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

        circle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isRhythm && tupletRun) {
              const cells = getTupletCells(tupletRun.start, tupletRun.slots, rhythmState);
              cells[circleIndex] = !cells[circleIndex];
              render();
              return;
            }
            if (isRhythm) {
              rhythmState.beats[beatIndex][circleIndex] = !rhythmState.beats[beatIndex][circleIndex];
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
                applyIsolatedRhythmChange(idx);
            }
            commitAndUpdateView();
        });
        circlesDiv.appendChild(circle);
    }
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
            if (idx === editingIndex) {
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
                span.addEventListener('click', () => {
                    while (poetryState.words.length <= idx) {
                        poetryState.words.push('-');
                    }
                    editingIndex = idx;
                    render();
                });
                wc.appendChild(span);
                wordsDiv.appendChild(wc);
            }
        }
        group.appendChild(wordsDiv);
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

    if (isFinal && notesBoxElements.length > 0) {
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

  // --- INITIALIZATION ---
  const library = getStoredLibrary();
  let songIdToLoad = null;

  const sharedSong = checkUrlForSharedSong();
  if (sharedSong && (sharedSong.poetryState || sharedSong.rhythmState || sharedSong.words || sharedSong.title)) {
    const title = (sharedSong.title && sharedSong.title.trim()) ? sharedSong.title.trim() : 'Shared Song';
    const sharedId = 'shared_' + Date.now();
    library[sharedId] = normalizeSong({
      id: sharedId,
      title: title,
      side: songSide(sharedSong),
      isCustom: true,
      createdAt: Date.now(),
      poetryState: sharedSong.poetryState,
      rhythmState: sharedSong.rhythmState,
      words: sharedSong.words
    });
    saveStoredLibrary(library);
    songIdToLoad = sharedId;
    try {
      window.history.replaceState(null, document.title, window.location.pathname);
    } catch (e) {}
  } else {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(ACTIVE_SONG_ID_KEY) || 'null'); } catch (e) {}
    if (saved && typeof saved === 'object') {
      ['rhythm', 'poetry'].forEach(side => {
        const id = saved[side];
        if (id && library[id] && songSide(library[id]) === side) {
          currentSongIds[side] = id;
          currentSongTitles[side] = library[id].title;
        }
      });
    }
    songIdToLoad = currentSongIds.rhythm || ensureSongForSide('rhythm');
  }

  if (songIdToLoad) loadSongById(songIdToLoad);

  if (toggleReplaceBtn) toggleReplaceBtn.classList.add('active');
  if (toggleAddBtn) toggleAddBtn.classList.remove('active');

  syncViewControls();
  updateCircleVisibility();
  render();

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


  window.addEventListener('beforeunload', saveCurrentSongToLibrary);
})();
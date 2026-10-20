// Solfege Tower — melody data, copied from Melody Tower (scales, spellings, enharmonic key names).
window.ST = window.ST || {};
ST.melody = (function () {
const keyNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Base color mapping for keys, tied to the 7 note letters
const KEY_COLORS = {
  'C': '#FF3B30', // Red
  'D': '#FF9500', // Orange
  'E': '#FFCC00', // Yellow
  'F': '#34C759', // Green
  'G': '#30c0c6', // Turquoise
  'A': '#007AFF', // Blue
  'B': '#AF52DE'  // Purple
};

// Scale definitions with interval patterns and solfege mappings
const scaleDefinitions = {
  'major': {
    name: 'Major',
    intervals: [0, 2, 4, 5, 7, 9, 11], // W-W-H-W-W-W-H
    solfege: ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti']
  },
  'natural-minor': {
    name: 'Natural Minor',
    intervals: [0, 2, 3, 5, 7, 8, 10], // W-H-W-W-H-W-W
    solfege: ['Do', 'Re', 'Me', 'Fa', 'So', 'Le', 'Te']
  },
  'harmonic-minor': {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11], // W-H-W-W-H-W+H-H
    solfege: ['Do', 'Re', 'Me', 'Fa', 'So', 'Le', 'Ti']
  },
  'melodic-minor': {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11], // W-H-W-W-W-W-H
    solfege: ['Do', 'Re', 'Me', 'Fa', 'So', 'La', 'Ti']
  },
  'dorian': {
    name: 'Dorian Mode',
    intervals: [0, 2, 3, 5, 7, 9, 10], // W-H-W-W-W-H-W
    solfege: ['Do', 'Re', 'Me', 'Fa', 'So', 'La', 'Te']
  },
  'phrygian': {
    name: 'Phrygian Mode',
    intervals: [0, 1, 3, 5, 7, 8, 10], // H-W-W-W-H-W-W
    solfege: ['Do', 'Ra', 'Me', 'Fa', 'So', 'Le', 'Te']
  },
  'lydian': {
    name: 'Lydian Mode',
    intervals: [0, 2, 4, 6, 7, 9, 11], // W-W-W-H-W-W-H
    solfege: ['Do', 'Re', 'Mi', 'Fi', 'So', 'La', 'Ti']
  },
  'mixolydian': {
    name: 'Mixolydian Mode',
    intervals: [0, 2, 4, 5, 7, 9, 10], // W-W-H-W-W-H-W
    solfege: ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Te']
  },
  'locrian': {
    name: 'Locrian Mode',
    intervals: [0, 1, 3, 5, 6, 8, 10], // H-W-W-H-W-W-W
    solfege: ['Do', 'Ra', 'Me', 'Fa', 'Se', 'Le', 'Te']
  }
};

const scaleSpellings = {
    'C': {
        'major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        'dorian': ['C', 'D', 'E♭', 'F', 'G', 'A', 'B♭'],
        'phrygian': ['C', 'D♭', 'E♭', 'F', 'G', 'A♭', 'B♭'],
        'lydian': ['C', 'D', 'E', 'F♯', 'G', 'A', 'B'],
        'mixolydian': ['C', 'D', 'E', 'F', 'G', 'A', 'B♭'],
        'natural-minor': ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B♭'],
        'harmonic-minor': ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B'],
        'melodic-minor': ['C', 'D', 'E♭', 'F', 'G', 'A', 'B'],
        'locrian': ['C', 'D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭']
    },
    'Db': {
        'major': ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'],
        'dorian': ['D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭', 'C♭'],
        'phrygian': ['D♭', 'E𝄫', 'F♭', 'G♭', 'A♭', 'B𝄫', 'C♭'],
        'lydian': ['D♭', 'E♭', 'F', 'G', 'A♭', 'B♭', 'C'],
        'mixolydian': ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭'],
        'natural-minor': ['D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B𝄫', 'C♭'],
        'harmonic-minor': ['D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B𝄫', 'C'],
        'melodic-minor': ['D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭', 'C'],
        'locrian': ['D♭', 'E𝄫', 'F♭', 'G𝄫', 'A𝄫', 'B𝄫', 'C♭']
    },
    'C#': {
        'major': ['C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯'],
        'dorian': ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯', 'B'],
        'phrygian': ['C♯', 'D', 'E', 'F♯', 'G♯', 'A', 'B'],
        'lydian': ['C♯', 'D♯', 'E♯', 'F♯♯', 'G♯', 'A♯', 'B♯'],
        'mixolydian': ['C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B'],
        'natural-minor': ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A', 'B'],
        'harmonic-minor': ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A', 'B♯'],
        'melodic-minor': ['C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯', 'B♯'],
        'locrian': ['C♯', 'D', 'E', 'F♯', 'G', 'A', 'B']
    },
    'D': {
        'major': ['D', 'E', 'F♯', 'G', 'A', 'B', 'C♯'],
        'dorian': ['D', 'E', 'F', 'G', 'A', 'B', 'C'],
        'phrygian': ['D', 'E♭', 'F', 'G', 'A', 'B♭', 'C'],
        'lydian': ['D', 'E', 'F♯', 'G♯', 'A', 'B', 'C♯'],
        'mixolydian': ['D', 'E', 'F♯', 'G', 'A', 'B', 'C'],
        'natural-minor': ['D', 'E', 'F', 'G', 'A', 'B♭', 'C'],
        'harmonic-minor': ['D', 'E', 'F', 'G', 'A', 'B♭', 'C♯'],
        'melodic-minor': ['D', 'E', 'F', 'G', 'A', 'B', 'C♯'],
        'locrian': ['D', 'E♭', 'F', 'G', 'A♭', 'B♭', 'C']
    },
    'Eb': {
        'major': ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'],
        'dorian': ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C', 'D♭'],
        'phrygian': ['E♭', 'F♭', 'G♭', 'A♭', 'B♭', 'C♭', 'D♭'],
        'lydian': ['E♭', 'F', 'G', 'A', 'B♭', 'C', 'D'],
        'mixolydian': ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D♭'],
        'natural-minor': ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭', 'D♭'],
        'harmonic-minor': ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭', 'D'],
        'melodic-minor': ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C', 'D'],
        'locrian': ['E♭', 'F♭', 'G♭', 'A♭', 'B𝄫', 'C♭', 'D♭']
    },
    'D#': {
        'major': ['D♯', 'E♯', 'F♯♯', 'G♯', 'A♯', 'B♯', 'C♯♯'],
        'dorian': ['D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯', 'C♯'],
        'phrygian': ['D♯', 'E', 'F♯', 'G♯', 'A♯', 'B', 'C♯'],
        'lydian': ['D♯', 'E♯', 'F♯♯', 'G♯♯', 'A♯', 'B♯', 'C♯♯'],
        'mixolydian': ['D♯', 'E♯', 'F♯♯', 'G♯', 'A♯', 'B♯', 'C♯'],
        'natural-minor': ['D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B', 'C♯'],
        'harmonic-minor': ['D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B', 'C♯♯'],
        'melodic-minor': ['D♯', 'E♯', 'F♯', 'G♯', 'A♯', 'B♯', 'C♯♯'],
        'locrian': ['D♯', 'E', 'F♯', 'G♯', 'A', 'B', 'C♯']
    },
    'E': {
        'major': ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D♯'],
        'dorian': ['E', 'F♯', 'G', 'A', 'B', 'C♯', 'D'],
        'phrygian': ['E', 'F', 'G', 'A', 'B', 'C', 'D'],
        'lydian': ['E', 'F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯'],
        'mixolydian': ['E', 'F♯', 'G♯', 'A', 'B', 'C♯', 'D'],
        'natural-minor': ['E', 'F♯', 'G', 'A', 'B', 'C', 'D'],
        'harmonic-minor': ['E', 'F♯', 'G', 'A', 'B', 'C', 'D♯'],
        'melodic-minor': ['E', 'F♯', 'G', 'A', 'B', 'C♯', 'D♯'],
        'locrian': ['E', 'F', 'G', 'A', 'B♭', 'C', 'D']
    },
    'F': {
        'major': ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'],
        'dorian': ['F', 'G', 'A♭', 'B♭', 'C', 'D', 'E♭'],
        'phrygian': ['F', 'G♭', 'A♭', 'B♭', 'C', 'D♭', 'E♭'],
        'lydian': ['F', 'G', 'A', 'B', 'C', 'D', 'E'],
        'mixolydian': ['F', 'G', 'A', 'B♭', 'C', 'D', 'E♭'],
        'natural-minor': ['F', 'G', 'A♭', 'B♭', 'C', 'D♭', 'E♭'],
        'harmonic-minor': ['F', 'G', 'A♭', 'B♭', 'C', 'D♭', 'E'],
        'melodic-minor': ['F', 'G', 'A♭', 'B♭', 'C', 'D', 'E'],
        'locrian': ['F', 'G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭']
    },
    'Gb': {
        'major': ['G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F'],
        'dorian': ['G♭', 'A♭', 'B𝄫', 'C♭', 'D♭', 'E♭', 'F♭'],
        'phrygian': ['G♭', 'A𝄫', 'B𝄫', 'C♭', 'D♭', 'E𝄫', 'F♭'],
        'lydian': ['G♭', 'A♭', 'B♭', 'C', 'D♭', 'E♭', 'F'],
        'mixolydian': ['G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F♭'],
        'natural-minor': ['G♭', 'A♭', 'B𝄫', 'C♭', 'D♭', 'E𝄫', 'F♭'],
        'harmonic-minor': ['G♭', 'A♭', 'B𝄫', 'C♭', 'D♭', 'E𝄫', 'F'],
        'melodic-minor': ['G♭', 'A♭', 'B𝄫', 'C♭', 'D♭', 'E♭', 'F'],
        'locrian': ['G♭', 'A𝄫', 'B𝄫', 'C♭', 'D𝄫', 'E𝄫', 'F♭']
    },
    'F#': {
        'major': ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯'],
        'dorian': ['F♯', 'G♯', 'A', 'B', 'C♯', 'D♯', 'E'],
        'phrygian': ['F♯', 'G', 'A', 'B', 'C♯', 'D', 'E'],
        'lydian': ['F♯', 'G♯', 'A♯', 'B♯', 'C♯', 'D♯', 'E♯'],
        'mixolydian': ['F♯', 'G♯', 'A♯', 'B', 'C♯', 'D♯', 'E'],
        'natural-minor': ['F♯', 'G♯', 'A', 'B', 'C♯', 'D', 'E'],
        'harmonic-minor': ['F♯', 'G♯', 'A', 'B', 'C♯', 'D', 'E♯'],
        'melodic-minor': ['F♯', 'G♯', 'A', 'B', 'C♯', 'D♯', 'E♯'],
        'locrian': ['F♯', 'G', 'A', 'B', 'C', 'D', 'E']
    },
    'G': {
        'major': ['G', 'A', 'B', 'C', 'D', 'E', 'F♯'],
        'dorian': ['G', 'A', 'B♭', 'C', 'D', 'E', 'F'],
        'phrygian': ['G', 'A♭', 'B♭', 'C', 'D', 'E♭', 'F'],
        'lydian': ['G', 'A', 'B', 'C♯', 'D', 'E', 'F♯'],
        'mixolydian': ['G', 'A', 'B', 'C', 'D', 'E', 'F'],
        'natural-minor': ['G', 'A', 'B♭', 'C', 'D', 'E♭', 'F'],
        'harmonic-minor': ['G', 'A', 'B♭', 'C', 'D', 'E♭', 'F♯'],
        'melodic-minor': ['G', 'A', 'B♭', 'C', 'D', 'E', 'F♯'],
        'locrian': ['G', 'A♭', 'B♭', 'C', 'D♭', 'E♭', 'F']
    },
    'Ab': {
        'major': ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'],
        'dorian': ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F', 'G♭'],
        'phrygian': ['A♭', 'B𝄫', 'C♭', 'D♭', 'E♭', 'F♭', 'G♭'],
        'lydian': ['A♭', 'B♭', 'C', 'D', 'E♭', 'F', 'G'],
        'mixolydian': ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G♭'],
        'natural-minor': ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F♭', 'G♭'],
        'harmonic-minor': ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F♭', 'G'],
        'melodic-minor': ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F', 'G'],
        'locrian': ['A♭', 'B𝄫', 'C♭', 'D♭', 'E𝄫', 'F♭', 'G♭']
    },
    'G#': {
        'major': ['G♯', 'A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯♯'],
        'dorian': ['G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯', 'F♯'],
        'phrygian': ['G♯', 'A', 'B', 'C♯', 'D♯', 'E', 'F♯'],
        'lydian': ['G♯', 'A♯', 'B♯', 'C♯♯', 'D♯', 'E♯', 'F♯♯'],
        'mixolydian': ['G♯', 'A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯'],
        'natural-minor': ['G♯', 'A♯', 'B', 'C♯', 'D♯', 'E', 'F♯'],
        'harmonic-minor': ['G♯', 'A♯', 'B', 'C♯', 'D♯', 'E', 'F♯♯'],
        'melodic-minor': ['G♯', 'A♯', 'B', 'C♯', 'D♯', 'E♯', 'F♯♯'],
        'locrian': ['G♯', 'A', 'B', 'C♯', 'D', 'E', 'F♯']
    },
    'A': {
        'major': ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'],
        'dorian': ['A', 'B', 'C', 'D', 'E', 'F♯', 'G'],
        'phrygian': ['A', 'B♭', 'C', 'D', 'E', 'F', 'G'],
        'lydian': ['A', 'B', 'C♯', 'D♯', 'E', 'F♯', 'G♯'],
        'mixolydian': ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G'],
        'natural-minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        'harmonic-minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G♯'],
        'melodic-minor': ['A', 'B', 'C', 'D', 'E', 'F♯', 'G♯'],
        'locrian': ['A', 'B♭', 'C', 'D', 'E♭', 'F', 'G']
    },
    'Bb': {
        'major': ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'],
        'dorian': ['B♭', 'C', 'D♭', 'E♭', 'F', 'G', 'A♭'],
        'phrygian': ['B♭', 'C♭', 'D♭', 'E♭', 'F', 'G♭', 'A♭'],
        'lydian': ['B♭', 'C', 'D', 'E', 'F', 'G', 'A'],
        'mixolydian': ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A♭'],
        'natural-minor': ['B♭', 'C', 'D♭', 'E♭', 'F', 'G♭', 'A♭'],
        'harmonic-minor': ['B♭', 'C', 'D♭', 'E♭', 'F', 'G♭', 'A'],
        'melodic-minor': ['B♭', 'C', 'D♭', 'E♭', 'F', 'G', 'A'],
        'locrian': ['B♭', 'C♭', 'D♭', 'E♭', 'F♭', 'G♭', 'A♭']
    },
    'A#': {
        'major': ['A♯', 'B♯', 'C♯♯', 'D♯', 'E♯', 'F♯♯', 'G♯♯'],
        'dorian': ['A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯♯', 'G♯'],
        'phrygian': ['A♯', 'B', 'C♯', 'D♯', 'E♯', 'F♯', 'G♯'],
        'lydian': ['A♯', 'B♯', 'C♯♯', 'D♯♯', 'E♯', 'F♯♯', 'G♯♯'],
        'mixolydian': ['A♯', 'B♯', 'C♯♯', 'D♯', 'E♯', 'F♯♯', 'G♯'],
        'natural-minor': ['A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯', 'G♯'],
        'harmonic-minor': ['A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯', 'G♯♯'],
        'melodic-minor': ['A♯', 'B♯', 'C♯', 'D♯', 'E♯', 'F♯♯', 'G♯♯'],
        'locrian': ['A♯', 'B', 'C♯', 'D♯', 'E', 'F♯', 'G♯']
    },
    'B': {
        'major': ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A♯'],
        'dorian': ['B', 'C♯', 'D', 'E', 'F♯', 'G♯', 'A'],
        'phrygian': ['B', 'C', 'D', 'E', 'F♯', 'G', 'A'],
        'lydian': ['B', 'C♯', 'D♯', 'E♯', 'F♯', 'G♯', 'A♯'],
        'mixolydian': ['B', 'C♯', 'D♯', 'E', 'F♯', 'G♯', 'A'],
        'natural-minor': ['B', 'C♯', 'D', 'E', 'F♯', 'G', 'A'],
        'harmonic-minor': ['B', 'C♯', 'D', 'E', 'F♯', 'G', 'A♯'],
        'melodic-minor': ['B', 'C♯', 'D', 'E', 'F♯', 'G♯', 'A♯'],
        'locrian': ['B', 'C', 'D', 'E', 'F', 'G', 'A']
    }
};

// Define colors for sharp and flat notes
const DARK_RED = '#990000';
const DARK_BLUE = '#000099';

// --- NEW FUNCTION ---
// Get the enharmonically correct key name based on the selected scale
function getEffectiveKeyName(keyIndex, scaleName) {
    const baseKeyName = keyNames[keyIndex];

    // Logic for Db/C# at index 1
    if (keyIndex === 1) {
        switch (scaleName) {
            case 'major':
            case 'lydian':
            case 'mixolydian':
                return 'Db';
            default: // minor scales, dorian, phrygian, locrian
                return 'C#';
        }
    }

    // Logic for Eb/D# at index 3
    if (keyIndex === 3) {
        switch (scaleName) {
            case 'phrygian':
            case 'locrian':
                return 'D#';
            default: // All other scales
                return 'Eb';
        }
    }
    
    // Logic for Gb/F# at index 6
    if (keyIndex === 6) {
        switch (scaleName) {
            case 'major':
            case 'lydian':
                return 'Gb';
            default: // All other scales
                return 'F#';
        }
    }

    // Logic for Ab/G# at index 8
    if (keyIndex === 8) {
        switch (scaleName) {
            case 'natural-minor':
            case 'harmonic-minor':
            case 'melodic-minor':
            case 'phrygian':
            case 'locrian':
                return 'G#';
            default: // Major, dorian, lydian, mixolydian
                return 'Ab';
        }
    }
    
    // Logic for Bb/A# at index 10
    if (keyIndex === 10) {
        switch (scaleName) {
            case 'locrian':
                return 'A#';
            default: // All other scales
                return 'Bb';
        }
    }

    // Return the default key name for all other keys
    return baseKeyName;
}

// Generate letter names for a specific key and scale using the new lookup table
function generateLetterNamesForScale(keyName, scaleName) {
    const scale = scaleDefinitions[scaleName];
    if (!scale) return {};

    // Use the hardcoded spellings
    const notes = scaleSpellings[keyName]?.[scaleName] || [];
    const letterNames = {};

    scale.solfege.forEach((solfege, index) => {
        if (notes[index]) {
            letterNames[solfege] = notes[index];
        }
    });

    return letterNames;
}


// Generate color mappings for a specific key (colors stay tied to letter names)
function generateColorsForScale(keyName, scaleName) {
    const scale = scaleDefinitions[scaleName];
    if (!scale) return {};

    const letterNames = generateLetterNamesForScale(keyName, scaleName);
    const colors = {};

    for (const solfege in letterNames) {
        const noteName = letterNames[solfege];
        const noteLetter = noteName.charAt(0);
        colors[solfege] = KEY_COLORS[noteLetter];
    }

    return colors;
}

// Map to identify if a note is flat or sharp
const noteAccidentalMap = {
  'C': false, 'C#': 'sharp', 'C♯': 'sharp', 'Db': 'flat', 'D♭': 'flat',
  'D': false, 'D#': 'sharp', 'D♯': 'sharp', 'Eb': 'flat', 'E♭': 'flat',
  'E': false, 'E#': 'sharp', 'E♯': 'sharp', 'Fb': 'flat', 'F♭': 'flat',
  'F': false, 'F#': 'sharp', 'F♯': 'sharp', 'Gb': 'flat', 'G♭': 'flat',
  'G': false, 'G#': 'sharp', 'G♯': 'sharp', 'Ab': 'flat', 'A♭': 'flat',
  'A': false, 'A#': 'sharp', 'A♯': 'sharp', 'Bb': 'flat', 'B♭': 'flat',
  'B': false, 'B#': 'sharp', 'B♯': 'sharp', 'Cb': 'flat', 'C♭': 'flat',
  // Double flats and sharps
  'Cbb': 'double-flat', 'Dbb': 'double-flat', 'Ebb': 'double-flat', 'Fbb': 'double-flat', 'Gbb': 'double-flat', 'Abb': 'double-flat', 'Bbb': 'double-flat',
  'C𝄫': 'double-flat', 'D𝄫': 'double-flat', 'E𝄫': 'double-flat', 'F𝄫': 'double-flat', 'G𝄫': 'double-flat', 'A𝄫': 'double-flat', 'B𝄫': 'double-flat',
  'Cx': 'double-sharp', 'Dx': 'double-sharp', 'Ex': 'double-sharp', 'Fx': 'double-sharp', 'Gx': 'double-sharp', 'Ax': 'double-sharp', 'Bx': 'double-sharp',
  'C♯♯': 'double-sharp', 'D♯♯': 'double-sharp', 'E♯♯': 'double-sharp', 'F♯♯': 'double-sharp', 'G♯♯': 'double-sharp', 'A♯♯': 'double-sharp', 'B♯♯': 'double-sharp',
};

return { keyNames, KEY_COLORS, scaleDefinitions, scaleSpellings, DARK_RED, DARK_BLUE,
         getEffectiveKeyName, generateLetterNamesForScale, generateColorsForScale, noteAccidentalMap };
})();

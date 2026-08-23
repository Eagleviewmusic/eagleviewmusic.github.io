// ===== AUDIO CONTEXT =====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ===== COLOR SYSTEM =====
const colorSchemeRed = { 'Do': '#FF3B30', 'Re': '#FF9500', 'Mi': '#FFCC00', 'Fa': '#34C759', 'So': '#48C4C8', 'La': '#007AFF', 'Ti': '#AF52DE' };
const colorSchemeOrange = { 'Do': '#FF9500', 'Re': '#FFCC00', 'Mi': '#34C759', 'Fa': '#48C4C8', 'So': '#007AFF', 'La': '#AF52DE', 'Ti': '#FF3B30' };
const colorSchemeYellow = { 'Do': '#FFCC00', 'Re': '#34C759', 'Mi': '#48C4C8', 'Fa': '#007AFF', 'So': '#AF52DE', 'La': '#FF3B30', 'Ti': '#FF9500' };
const colorSchemeGreen = { 'Do': '#34C759', 'Re': '#48C4C8', 'Mi': '#007AFF', 'Fa': '#AF52DE', 'So': '#FF3B30', 'La': '#FF9500', 'Ti': '#FFCC00' };
const colorSchemeTurquoise = { 'Do': '#48C4C8', 'Re': '#007AFF', 'Mi': '#AF52DE', 'Fa': '#FF3B30', 'So': '#FF9500', 'La': '#FFCC00', 'Ti': '#34C759' };
const colorSchemeBlue = { 'Do': '#007AFF', 'Re': '#AF52DE', 'Mi': '#FF3B30', 'Fa': '#FF9500', 'So': '#FFCC00', 'La': '#34C759', 'Ti': '#48C4C8' };
const colorSchemePurple = { 'Do': '#AF52DE', 'Re': '#FF3B30', 'Mi': '#FF9500', 'Fa': '#FFCC00', 'So': '#34C759', 'La': '#48C4C8', 'Ti': '#007AFF' };

const noteColorsByKey = {
  // Red
  'C': colorSchemeRed, 'C#': colorSchemeRed,
  // Orange
  'Db': colorSchemeOrange, 'D': colorSchemeOrange, 'D#': colorSchemeOrange,
  // Yellow
  'Eb': colorSchemeYellow, 'E': colorSchemeYellow,
  // Green
  'F': colorSchemeGreen, 'F#': colorSchemeGreen,
  // Turquoise
  'Gb': colorSchemeTurquoise, 'G': colorSchemeTurquoise, 'G#': colorSchemeTurquoise,
  // Blue
  'Ab': colorSchemeBlue, 'A': colorSchemeBlue, 'A#': colorSchemeBlue,
  // Purple
  'Bb': colorSchemePurple, 'B': colorSchemePurple,
};

const keySignatureColors = {
    'C': '#FF3B30', 'C#': '#FF3B30',
    'Db': '#FF9500', 'D': '#FF9500', 'D#': '#FF9500',
    'Eb': '#FFCC00', 'E': '#FFCC00',
    'F': '#34C759', 'F#': '#34C759',
    'Gb': '#48C4C8', 'G': '#48C4C8', 'G#': '#48C4C8',
    'Ab': '#007AFF', 'A': '#007AFF', 'A#': '#007AFF',
    'Bb': '#AF52DE', 'B': '#AF52DE'
};


const letterNamesByKey = {
  'C': { 'Do': 'C', 'Re': 'D', 'Mi': 'E', 'Fa': 'F', 'So': 'G', 'La': 'A', 'Ti': 'B' },
  'Db': { 'Do': 'Db', 'Re': 'Eb', 'Mi': 'F', 'Fa': 'Gb', 'So': 'Ab', 'La': 'Bb', 'Ti': 'C' },
  'D': { 'Do': 'D', 'Re': 'E', 'Mi': 'F#', 'Fa': 'G', 'So': 'A', 'La': 'B', 'Ti': 'C#' },
  'Eb': { 'Do': 'Eb', 'Re': 'F', 'Mi': 'G', 'Fa': 'Ab', 'So': 'Bb', 'La': 'C', 'Ti': 'D' },
  'E': { 'Do': 'E', 'Re': 'F#', 'Mi': 'G#', 'Fa': 'A', 'So': 'B', 'La': 'C#', 'Ti': 'D#' },
  'F': { 'Do': 'F', 'Re': 'G', 'Mi': 'A', 'Fa': 'Bb', 'So': 'C', 'La': 'D', 'Ti': 'E' },
  'Gb': { 'Do': 'Gb', 'Re': 'Ab', 'Mi': 'Bb', 'Fa': 'Cb', 'So': 'Db', 'La': 'Eb', 'Ti': 'F' },
  'G': { 'Do': 'G', 'Re': 'A', 'Mi': 'B', 'Fa': 'C', 'So': 'D', 'La': 'E', 'Ti': 'F#' },
  'Ab': { 'Do': 'Ab', 'Re': 'Bb', 'Mi': 'C', 'Fa': 'Db', 'So': 'Eb', 'La': 'F', 'Ti': 'G' },
  'A': { 'Do': 'A', 'Re': 'B', 'Mi': 'C#', 'Fa': 'D', 'So': 'E', 'La': 'F#', 'Ti': 'G#' },
  'Bb': { 'Do': 'Bb', 'Re': 'C', 'Mi': 'D', 'Fa': 'Eb', 'So': 'F', 'La': 'G', 'Ti': 'A' },
  'B': { 'Do': 'B', 'Re': 'C#', 'Mi': 'D#', 'Fa': 'E', 'So': 'F#', 'La': 'G#', 'Ti': 'A#' },
  // Enharmonic Sharp Keys
  'C#': { 'Do': 'C#', 'Re': 'D#', 'Mi': 'E#', 'Fa': 'F#', 'So': 'G#', 'La': 'A#', 'Ti': 'B#' },
  'D#': { 'Do': 'D#', 'Re': 'E#', 'Mi': 'F##', 'Fa': 'G#', 'So': 'A#', 'La': 'B#', 'Ti': 'C##' },
  'F#': { 'Do': 'F#', 'Re': 'G#', 'Mi': 'A#', 'Fa': 'B', 'So': 'C#', 'La': 'D#', 'Ti': 'E#' },
  'G#': { 'Do': 'G#', 'Re': 'A#', 'Mi': 'B#', 'Fa': 'C#', 'So': 'D#', 'La': 'E#', 'Ti': 'F##' },
  'A#': { 'Do': 'A#', 'Re': 'B#', 'Mi': 'C##', 'Fa': 'D#', 'So': 'E#', 'La': 'F##', 'Ti': 'G##' },
};

// ===== CHORD COLOR MAPPING =====
const chordColorMapping = {
  'I': 'Do',      'ii': 'Re',     'iii': 'Mi',    'IV': 'Fa',     'V': 'So',      'vi': 'La',     
  'V/V': 'Re',    'V/vi': 'Mi',   'IV/IV': 'Ti'
};

// ===== CHORD NAME MAPPING =====
const chordNamesByKey = {
  'C': { 'I': 'C', 'ii': 'Dm', 'iii': 'Em', 'IV': 'F', 'V': 'G', 'vi': 'Am', 'V/V': 'D', 'V/vi': 'E', 'IV/IV': 'Bb' },
  'Db': { 'I': 'Db', 'ii': 'Ebm', 'iii': 'Fm', 'IV': 'Gb', 'V': 'Ab', 'vi': 'Bbm', 'V/V': 'Eb', 'V/vi': 'F', 'IV/IV': 'B' },
  'D': { 'I': 'D', 'ii': 'Em', 'iii': 'F#m', 'IV': 'G', 'V': 'A', 'vi': 'Bm', 'V/V': 'E', 'V/vi': 'F#', 'IV/IV': 'C' },
  'Eb': { 'I': 'Eb', 'ii': 'Fm', 'iii': 'Gm', 'IV': 'Ab', 'V': 'Bb', 'vi': 'Cm', 'V/V': 'F', 'V/vi': 'G', 'IV/IV': 'Db' },
  'E': { 'I': 'E', 'ii': 'F#m', 'iii': 'G#m', 'IV': 'A', 'V': 'B', 'vi': 'C#m', 'V/V': 'F#', 'V/vi': 'G#', 'IV/IV': 'D' },
  'F': { 'I': 'F', 'ii': 'Gm', 'iii': 'Am', 'IV': 'Bb', 'V': 'C', 'vi': 'Dm', 'V/V': 'G', 'V/vi': 'A', 'IV/IV': 'Eb' },
  'Gb': { 'I': 'Gb', 'ii': 'Abm', 'iii': 'Bbm', 'IV': 'B', 'V': 'Db', 'vi': 'Ebm', 'V/V': 'Ab', 'V/vi': 'Bb', 'IV/IV': 'E' },
  'G': { 'I': 'G', 'ii': 'Am', 'iii': 'Bm', 'IV': 'C', 'V': 'D', 'vi': 'Em', 'V/V': 'A', 'V/vi': 'B', 'IV/IV': 'F' },
  'Ab': { 'I': 'Ab', 'ii': 'Bbm', 'iii': 'Cm', 'IV': 'Db', 'V': 'Eb', 'vi': 'Fm', 'V/V': 'Bb', 'V/vi': 'C', 'IV/IV': 'Gb' },
  'A': { 'I': 'A', 'ii': 'Bm', 'iii': 'C#m', 'IV': 'D', 'V': 'E', 'vi': 'F#m', 'V/V': 'B', 'V/vi': 'C#', 'IV/IV': 'G' },
  'Bb': { 'I': 'Bb', 'ii': 'Cm', 'iii': 'Dm', 'IV': 'Eb', 'V': 'F', 'vi': 'Gm', 'V/V': 'C', 'V/vi': 'D', 'IV/IV': 'Ab' },
  'B': { 'I': 'B', 'ii': 'C#m', 'iii': 'D#m', 'IV': 'E', 'V': 'F#', 'vi': 'G#m', 'V/V': 'C#', 'V/vi': 'D#', 'IV/IV': 'A' }
};

// ===== CHORD FREQUENCY DEFINITIONS =====
const NOTE_FREQUENCIES = {
  'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78,
  'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83,
  'Ab2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47, 'Cb2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
  'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65,
  'Ab3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94, 'Cb3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'Ab4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88, 'Cb4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61,
  'Ab5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77, 'Cb5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51,
  'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22,
  'Ab6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53, 'Cb6': 1975.53
};

// ===== CHORD TRANSPOSITION SYSTEM =====
const BASE_CHORD_VOICINGS = {
  'I': ['C3', 'C4', 'E4', 'G4'],
  'ii': ['D3', 'D4', 'F4', 'A4'],
  'iii': ['E3', 'E4', 'G4', 'B4'],
  'IV': ['F3', 'F4', 'A4', 'C5'],
  'V': ['G3', 'D4', 'G4', 'B4'],
  'vi': ['A3', 'E4', 'A4', 'C5'],
  'V/V': ['D3', 'D4', 'F#4', 'A4'],
  'V/vi': ['E3', 'E4', 'G#4', 'B4'],
  'IV/IV': ['Bb3', 'D4', 'F4', 'Bb4']
};

const CHROMATIC_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const KEY_TRANSPOSITION = {
  'C': { semitones: 0, octaveShift: 0 },
  'Db': { semitones: 1, octaveShift: 0 },
  'D': { semitones: 2, octaveShift: 0 },
  'Eb': { semitones: 3, octaveShift: 0 },
  'E': { semitones: 4, octaveShift: 0 },
  'F': { semitones: 5, octaveShift: 0 },
  'Gb': { semitones: 6, octaveShift: 0 },
  'G': { semitones: 7, octaveShift: 0 },
  'Ab': { semitones: 8, octaveShift: -1 }, // Lowest
  'A': { semitones: 9, octaveShift: -1 },
  'Bb': { semitones: 10, octaveShift: -1 },
  'B': { semitones: 11, octaveShift: -1 },
  // Enharmonic Sharp Keys
  'C#': { semitones: 1, octaveShift: 0 },
  'D#': { semitones: 3, octaveShift: 0 },
  'F#': { semitones: 6, octaveShift: 0 },
  'G#': { semitones: 8, octaveShift: 0 }, // Kept high
  'A#': { semitones: 10, octaveShift: -1 },
};

// ===== SOLFEGE KEYBOARD MAPPING =====
const solfegeKeyMap = {
  'z': 'so-low',     // So-1
  'x': 'la-low',     // La-1
  'c': 'ti-low',     // Ti-1
  'v': 'do',         // Do1
  'a': 'do',         // Do1
  's': 're',         // Re1
  'd': 'mi',         // Mi1
  'f': 'fa',         // Fa1
  'g': 'so',         // So1
  'h': 'la',         // La1
  'j': 'ti',         // Ti1
  'k': 'do-high',    // Do2
  'q': 'do-high',    // Do2
  'w': 're-high',    // Re2
  'e': 'mi-high',    // Mi2
  'r': 'fa-high',    // Fa2
  't': 'so-high',    // So2
  'y': 'la-high'     // La2
};

function transposeNote(noteWithOctave, semitonesUp, octaveShift = 0) {
  const noteMatch = noteWithOctave.match(/^([A-G][b#]?)(\d+)$/);
  if (!noteMatch) return null;
  
  const noteName = noteMatch[1];
  const octave = parseInt(noteMatch[2]);
  
  let noteIndex = CHROMATIC_NOTES.indexOf(noteName);
  if (noteIndex === -1) {
    const enharmonics = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };
    noteIndex = CHROMATIC_NOTES.indexOf(enharmonics[noteName]);
  }
  if (noteIndex === -1) return null;
  
  let newNoteIndex = (noteIndex + semitonesUp) % 12;
  if (newNoteIndex < 0) newNoteIndex += 12;
  
  let newOctave = octave + Math.floor((noteIndex + semitonesUp) / 12) + octaveShift;
  
  const newNoteName = CHROMATIC_NOTES[newNoteIndex];
  return `${newNoteName}${newOctave}`;
}

function generateChordForKey(key, chordSymbol) {
  const transposition = KEY_TRANSPOSITION[key];
  if (!transposition) return null;
  
  const baseVoicing = BASE_CHORD_VOICINGS[chordSymbol];
  if (!baseVoicing) return null;
  
  const transposedVoicing = baseVoicing.map(note => 
    transposeNote(note, transposition.semitones, transposition.octaveShift)
  ).filter(note => note !== null);
  
  return transposedVoicing;
}

// ===== MUSICAL DATA & CONSTANTS =====
let currentKey = 'C';
let showNames = false;
let accidentalMode = 'natural'; 
let chordMode = false;
let selectedChord = null;
let colorSchemeActive = true; // Set to active by default

const A4_HZ = 440.0;
const SEMITONES_IN_OCTAVE = 12;
const C0_HZ = A4_HZ * Math.pow(2, -57 / SEMITONES_IN_OCTAVE); 

const SOLFEGE_INTERVALS = { 
  'Do': 0, 'Re': 2, 'Mi': 4, 'Fa': 5, 'So': 7, 'La': 9, 'Ti': 11
};

const DEFAULT_SOLFEGE_OCTAVE = 4; 

const KEY_SIGNATURES_CHROMATIC_INDEX = {
    'C': 0, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'Gb': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11,
    'C#': 1, 'D#': 3, 'F#': 6, 'G#': 8, 'A#': 10
};

const noteOrder = [
  'mi-low', 'fa-low', 'so-low', 'la-low', 'ti-low',
  'do', 're', 'mi', 'fa', 'so', 'la', 'ti',
  'do-high', 're-high', 'mi-high', 'fa-high', 'so-high', 'la-high'
];

const noteToSolfege = { 
  'mi-low': 'Mi', 'fa-low': 'Fa', 'so-low': 'So', 'la-low': 'La', 'ti-low': 'Ti',
  'do': 'Do', 're': 'Re', 'mi': 'Mi', 'fa': 'Fa', 
  'so': 'So', 'la': 'La', 'ti': 'Ti',
  'do-high': 'Do', 're-high': 'Re', 'mi-high': 'Mi',
  'fa-high': 'Fa', 'so-high': 'So', 'la-high': 'La'
};

const noteToShorthandMap = {
    'mi-low': 'M-1', 'fa-low': 'F-1', 'so-low': 'S-1', 'la-low': 'L-1', 'ti-low': 'T-1',
    'do': 'D1', 're': 'R1', 'mi': 'M1', 'fa': 'F1',
    'so': 'S1', 'la': 'L1', 'ti': 'T1',
    'do-high': 'D2', 're-high': 'R2', 'mi-high': 'M2',
    'fa-high': 'F2', 'so-high': 'S2', 'la-high': 'L2'
};

const shorthandToNoteMap = {
    'M-1': 'mi-low', 'F-1': 'fa-low', 'S-1': 'so-low', 'L-1': 'la-low', 'T-1': 'ti-low',
    'D1': 'do', 'R1': 're', 'M1': 'mi', 'F1': 'fa',
    'S1': 'so', 'L1': 'la', 'T1': 'ti',
    'D2': 'do-high', 'R2': 're-high', 'M2': 'mi-high',
    'F2': 'fa-high', 'S2': 'so-high', 'L2': 'la-high'
};

const NOTE_HEIGHTS = {
  'mi-low': 20, 'fa-low': 25, 'so-low': 30, 'la-low': 40, 'ti-low': 50,
  'do': 60, 're': 70, 'mi': 80, 'fa': 90, 'so': 100, 'la': 110, 'ti': 120,
  'do-high': 130, 're-high': 140, 'mi-high': 150, 'fa-high': 160, 'so-high': 170, 'la-high': 180
};

const LINE_COLORS = ['#e3f2fd', '#fff8e1', '#fce4ec', '#e8f5e9'];

// ===== ELEMENT REFERENCES =====
const controlsGroup = document.getElementById('controlsGroup') || document.querySelector('.bottom-controls-group');
const notationContainer = document.querySelector('.notation-container');
const editModeCheckbox = document.getElementById('editMode');
const editToggleBtn = document.getElementById('editToggle');
const leftArrowBtn = document.getElementById('leftArrow');
const rightArrowBtn = document.getElementById('rightArrow');
const minimizeBtn = document.getElementById('minimizeBtn');
const nameToggle = document.getElementById('nameToggle');
const addBtn = document.getElementById('addBtn');
const deleteBtn = document.getElementById('deleteBtn');
const accidentalToggle = document.getElementById('accidentalToggle');
const keySignatureDisplay = document.getElementById('keySignatureDisplay');
const keySignaturePopup = document.getElementById('keySignaturePopup');
const editOnlyControls = document.getElementById('editOnlyControls');
const chordToggle = document.getElementById('chordToggle');
const chordBoxes = document.getElementById('chordBoxes');
const copyLyricsBtn = document.getElementById('copyLyricsBtn');
const enterKeyBtn = document.getElementById('enterKeyBtn');
const copyVisualBtn = document.getElementById('copyVisualBtn');
const saveLoadBtn = document.getElementById('saveLoadBtn');
const libraryControls = document.getElementById('libraryControls');
const colorSchemeToggle = document.getElementById('colorSchemeToggle');
const restToggleBtn = document.getElementById('restToggleBtn');
const textEditorBtn = document.getElementById('textEditorBtn');
const abaToggleBtn = document.getElementById('abaToggleBtn');
const textEditorPopup = document.getElementById('textEditorPopup');
const textEditorText = document.getElementById('textEditorText');
const cancelTextEditor = document.getElementById('cancelTextEditor');
const submitTextEditor = document.getElementById('submitTextEditor');
const newSongBtn = document.getElementById('newSongBtn');
const librarySelector = document.getElementById('librarySelector');
const manageLibraryBtn = document.getElementById('manageLibraryBtn');
const newSongModal = document.getElementById('newSongModal');
const newSongTitleInput = document.getElementById('newSongTitleInput');
const cancelNewSongBtn = document.getElementById('cancelNewSongBtn');
const confirmNewSongBtn = document.getElementById('confirmNewSongBtn');
const manageLibraryModal = document.getElementById('manageLibraryModal');
const librarySongList = document.getElementById('librarySongList');
const closeLibraryModalBtn = document.getElementById('closeLibraryModalBtn');
const libraryAddNewSongBtn = document.getElementById('libraryAddNewSongBtn');
const doneLibraryBtn = document.getElementById('doneLibraryBtn');
const importExportBtn = document.getElementById('importExportBtn');
const importExportModal = document.getElementById('importExportModal');
const closeImportExportModalBtn = document.getElementById('closeImportExportModalBtn');
const closeImportExportBtn = document.getElementById('closeImportExportBtn');
const jsonFileInput = document.getElementById('jsonFileInput');
const uploadJsonBtn = document.getElementById('uploadJsonBtn');
const uploadStatusMsg = document.getElementById('uploadStatusMsg');
const selectAllExportBtn = document.getElementById('selectAllExportBtn');
const deselectAllExportBtn = document.getElementById('deselectAllExportBtn');
const exportSongList = document.getElementById('exportSongList');
const exportFilenameInput = document.getElementById('exportFilenameInput');
const confirmExportBtn = document.getElementById('confirmExportBtn');
const generateShareLinkBtn = document.getElementById('generateShareLinkBtn');
const shareLinkContainer = document.getElementById('shareLinkContainer');
const shareLinkInput = document.getElementById('shareLinkInput');
const copyShareLinkBtn = document.getElementById('copyShareLinkBtn');
const copyShareLinkBtnText = document.getElementById('copyShareLinkBtnText');
const shareLinkFeedback = document.getElementById('shareLinkFeedback');
const resetAllDataBtn = document.getElementById('resetAllDataBtn');
const resetStatusMsg = document.getElementById('resetStatusMsg');
const appTitleLink = document.getElementById('appTitleLink');
const aboutModal = document.getElementById('aboutModal');
const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');
const backToMusicBtn = document.getElementById('backToMusicBtn');
const deleteSectionModal = document.getElementById('deleteSectionModal');
const deleteSectionPromptText = document.getElementById('deleteSectionPromptText');
const dontAskDeleteSectionCheckbox = document.getElementById('dontAskDeleteSectionCheckbox');
const cancelDeleteSectionBtn = document.getElementById('cancelDeleteSectionBtn');
const confirmDeleteSectionBtn = document.getElementById('confirmDeleteSectionBtn');
const connectedBarsControl = document.getElementById('connectedBarsControl');
const connectedBarsIconWrap = document.getElementById('connectedBarsIconWrap');
const addConnectedNoteBtn = document.getElementById('addConnectedNoteBtn');
const removeConnectedNoteBtn = document.getElementById('removeConnectedNoteBtn');
const harmonyBarsControl = document.getElementById('harmonyBarsControl');
const harmonyBarsIconWrap = document.getElementById('harmonyBarsIconWrap');
const addHarmonyNoteBtn = document.getElementById('addHarmonyNoteBtn');
const removeHarmonyNoteBtn = document.getElementById('removeHarmonyNoteBtn');

// ===== STORAGE & STATE VARIABLES =====
const STORAGE_KEY = 'song_writer_library_v1';
const ACTIVE_SONG_ID_KEY = 'song_writer_active_song_id';
let currentSongId = 'twinkle';
let currentSongTitle = 'Twinkle Twinkle';
let saveLoadMode = false;
let abaMode = false;

let currentNoteIndex = -1;
let currentSyllableIndex = -1;
let currentRowTop = null; // To track the vertical position of the current visual row
let navigationOffEndState = null;
let controlsMinimized = false;
let currentlyEditingText = null;
let currentEditingIndex = -1;
let isAdvancingToNext = false;
let deleteConfirmationState = false;
let enterKeyState = 0; // 0: grey, 1: yellow (confirm), 2: green (active)
let pendingSectionToDelete = null;

// ===== UTILITY FUNCTIONS =====
function getAllSyllables() {
  return document.querySelectorAll('.syllable');
}

function getAllHarmonyStacks() {
  const stacks = Array.from(document.querySelectorAll('.notation-container .harmony-stack'));
  if (stacks.length > 0) return stacks;
  return Array.from(document.querySelectorAll('.notation-container .note'));
}

function getAllNotes() {
  return document.querySelectorAll('.notation-container .note');
}

function getActiveNote() {
  const selected = document.querySelector('.notation-container .note.selected-note');
  if (selected) {
    const notes = Array.from(getAllNotes());
    const idx = notes.indexOf(selected);
    if (idx >= 0) currentNoteIndex = idx;
    return selected;
  }
  const notes = getAllNotes();
  if (currentNoteIndex >= 0 && currentNoteIndex < notes.length) {
    return notes[currentNoteIndex];
  }
  return null;
}

function scrollToSyllable(syllable) {
  if (!syllable) return;

  const syllableRect = syllable.getBoundingClientRect();
  const newRowTop = syllableRect.top;

  // Check if the syllable is on a new visual row (with a small tolerance)
  if (currentRowTop === null || Math.abs(newRowTop - currentRowTop) > 10) {
    currentRowTop = newRowTop; // Update the current row position

    const viewportHeight = window.innerHeight;
    const scrollY = window.pageYOffset;
    const syllableBottom = scrollY + syllableRect.bottom;

    // Calculate the desired scroll position to place the bottom of the syllable
    // at 60% of the viewport height. This creates a stable anchor point.
    const targetScrollY = syllableBottom - (viewportHeight * 0.48);

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  }
}

function resetAccidentalToggleVisuals() {
    accidentalMode = 'natural';
    document.querySelectorAll('.accidental-option').forEach(option => {
        option.classList.remove('active');
    });
}

function resetDeleteConfirmation() {
    deleteConfirmationState = false;
    deleteBtn.classList.remove('confirm-delete');
}

function resetEnterKeyState() {
    enterKeyState = 0;
    enterKeyBtn.classList.remove('confirm-enter', 'active-enter');
}

function isPopupOpen() {
  return (textEditorPopup && textEditorPopup.classList.contains('show')) || 
         (newSongModal && newSongModal.classList.contains('show')) || 
         (manageLibraryModal && manageLibraryModal.classList.contains('show')) || 
         (importExportModal && importExportModal.classList.contains('show')) || 
         (deleteSectionModal && deleteSectionModal.classList.contains('show')) || 
         (aboutModal && aboutModal.classList.contains('show')) || 
         (keySignaturePopup && keySignaturePopup.classList.contains('show'));
}

// ===== VISUAL CAPTURE FUNCTIONS =====
async function copyCanvasToClipboard(canvas) {
    try {
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

async function captureVisual() {
    const originalText = copyVisualBtn.innerHTML;
    try {
        document.body.classList.add('capturing');
        copyVisualBtn.innerHTML = '⏳';
        copyVisualBtn.style.backgroundColor = '#ffc107';
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(notationContainer, {
            backgroundColor: '#fafafa',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: -window.scrollY 
        });
        
        const success = await copyCanvasToClipboard(canvas);
        
        if (success) {
            copyVisualBtn.innerHTML = '✓';
            copyVisualBtn.style.backgroundColor = '#28a745';
        } else {
            const link = document.createElement('a');
            link.download = 'notation-capture.png';
            link.href = canvas.toDataURL();
            link.click();
            copyVisualBtn.innerHTML = '💾';
            copyVisualBtn.style.backgroundColor = '#17a2b8';
        }
    } catch (error) {
        console.error('Failed to capture visual:', error);
        copyVisualBtn.innerHTML = '✗';
        copyVisualBtn.style.backgroundColor = '#dc3545';
    } finally {
        document.body.classList.remove('capturing');
        setTimeout(() => {
            copyVisualBtn.innerHTML = originalText;
            copyVisualBtn.style.backgroundColor = '';
        }, 2000);
    }
}


// ===== LINE BACKGROUNDS & HEIGHTS =====
function updateLineHeight(line) {
    if (!line) return;
    const notesInLine = line.querySelectorAll('.note');
    
    if (notesInLine.length === 0) {
        line.style.minHeight = line.classList.contains('section-break') ? '70px' : '90px';
        return;
    }

    let maxNoteHeight = 60;
    notesInLine.forEach(noteElement => {
        const noteClass = noteOrder.find(cls => noteElement.classList.contains(cls));
        if (noteClass && NOTE_HEIGHTS[noteClass]) {
            const h = NOTE_HEIGHTS[noteClass];
            if (h > maxNoteHeight) {
                maxNoteHeight = h;
            }
        }
    });

    // Note height + letter name overhead (28px) + syllable text (28px) + line top padding (44px) + bottom padding (20px) + safety buffer (16px)
    const requiredMinHeight = maxNoteHeight + 136;
    line.style.minHeight = `${requiredMinHeight}px`;
}

function updateAllLineHeights() {
    document.querySelectorAll('.notation-line').forEach(updateLineHeight);
}

function updateLineBackgrounds() {
    const lines = document.querySelectorAll('.notation-line');
    lines.forEach((line, index) => {
        if (colorSchemeActive) {
            line.style.backgroundColor = LINE_COLORS[index % LINE_COLORS.length];
        } else {
            line.style.backgroundColor = '#ffffff';
        }
    });
}

// ===== SOLFEGE INPUT FUNCTIONS =====
function handleSolfegeKeyInput(key) {
  if (!editModeCheckbox.checked || currentNoteIndex < 0) return false;
  
  const noteClass = solfegeKeyMap[key.toLowerCase()];
  if (!noteClass) return false;
  
  const activeNote = getActiveNote();
  if (activeNote) {
    const currentNoteClass = Array.from(activeNote.classList).find(c => noteOrder.includes(c));
    if (currentNoteClass) {
      activeNote.classList.remove(currentNoteClass);
    }
    activeNote.classList.add(noteClass);
    removeAccidentalFromNote(activeNote);
    resetAccidentalToggleVisuals();
    updateNoteDisplay(activeNote, noteClass);
    if (!activeNote.classList.contains('rest-note')) {
      const frequency = getFrequencyForNote(noteClass);
      if (frequency !== null) playNote(frequency);
    }
    const harmonyStack = activeNote.closest('.harmony-stack');
    if (harmonyStack) {
      updateHarmonyStackVisuals(harmonyStack);
    }
    const allNotes = Array.from(getAllNotes());
    const idx = allNotes.indexOf(activeNote);
    if (idx >= 0) currentNoteIndex = idx;

    const parentLine = activeNote.closest('.notation-line');
    if (parentLine) updateLineHeight(parentLine);
    saveCurrentSongToLibrary();
    return true;
  }
  return false;
}

// ===== EDIT MODE VISIBILITY FUNCTIONS =====
function updateEditOnlyControlsVisibility() {
  if (editModeCheckbox.checked) {
    editOnlyControls.classList.add('show');
  } else {
    editOnlyControls.classList.remove('show');
  }
}

// ===== CHORD FUNCTIONS =====
function updateChordBoxesVisibility() {
  if (chordMode) {
    chordBoxes.classList.add('show');
    document.body.classList.add('chord-mode-active');
  } else {
    chordBoxes.classList.remove('show');
    document.body.classList.remove('chord-mode-active');
    selectedChord = null;
    document.querySelectorAll('.chord-box').forEach(box => box.classList.remove('selected'));
  }
}

function applyChordColors() {
  const colors = noteColorsByKey[currentKey];
  document.querySelectorAll('.chord-box').forEach(chordBox => {
    const chordName = chordBox.getAttribute('data-chord');
    const solfegeKey = chordColorMapping[chordName];
    if (solfegeKey && colors[solfegeKey]) {
      const color = colors[solfegeKey];
      chordBox.style.backgroundColor = color;
      chordBox.style.borderColor = color;
    }
  });
}

function updateChordBoxLabels() {
  const chordNames = chordNamesByKey[currentKey];
  document.querySelectorAll('.chord-box').forEach(chordBox => {
    const romanNumeral = chordBox.getAttribute('data-chord');
    const chordName = chordNames[romanNumeral];
    if (showNames && chordName) {
      chordBox.textContent = chordName;
    } else {
      chordBox.textContent = romanNumeral;
    }
  });
}

function handleChordBoxClick(chordBox) {
  const chordName = chordBox.getAttribute('data-chord');
  document.querySelectorAll('.chord-box').forEach(box => box.classList.remove('selected'));
  chordBox.classList.add('selected');
  selectedChord = chordName;
  playChord(chordName);
  console.log(`Selected chord: ${chordName}`);
}

function selectChordByKeyNumber(keyNumber) {
  if (!chordMode) return;
  const chordBox = document.querySelector(`[data-key="${keyNumber}"]`);
  if (chordBox) {
    handleChordBoxClick(chordBox);
  }
}

function playChord(chordSymbol) {
  const noteNames = generateChordForKey(currentKey, chordSymbol);
  if (!noteNames || noteNames.length === 0) {
    console.warn(`Chord ${chordSymbol} not found for key ${currentKey}`);
    return;
  }
  const frequencies = noteNames.map(noteName => NOTE_FREQUENCIES[noteName]).filter(freq => freq);
  if (frequencies.length === 0) {
    console.warn(`No valid frequencies found for chord ${chordSymbol} in key ${currentKey}`);
    return;
  }
  console.log(`Playing chord ${chordSymbol} in key ${currentKey}:`, noteNames, 'frequencies:', frequencies);
  const now = audioCtx.currentTime;
  const chordDuration = 1.5;
  frequencies.forEach(frequency => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, now + chordDuration);
    oscillator.start(now);
    oscillator.stop(now + chordDuration);
  });
}

// ===== FREQUENCY CALCULATION FUNCTIONS =====
function calculateFrequency(key, solfegeWithOctave, accidental = 'natural') {
  const tonicChromaticIndex = KEY_SIGNATURES_CHROMATIC_INDEX[key];
  if (typeof tonicChromaticIndex === 'undefined') return null;
  let baseSolfegeLowercase = solfegeWithOctave; 
  let octaveShift = 0;
  if (solfegeWithOctave.endsWith('-low')) {
    baseSolfegeLowercase = solfegeWithOctave.replace('-low', ''); 
    octaveShift = -1;
  } else if (solfegeWithOctave.endsWith('-high')) {
    baseSolfegeLowercase = solfegeWithOctave.replace('-high', ''); 
    octaveShift = 1;
  }
  const baseSolfegeCapitalized = baseSolfegeLowercase.charAt(0).toUpperCase() + baseSolfegeLowercase.slice(1); 
  const solfegeInterval = SOLFEGE_INTERVALS[baseSolfegeCapitalized];
  if (typeof solfegeInterval === 'undefined') return null; 
  let accidentalOffset = 0;
  if (accidental === 'sharp') accidentalOffset = 1;
  else if (accidental === 'flat') accidentalOffset = -1;
  
  const keyOctaveShift = KEY_TRANSPOSITION[key] ? (KEY_TRANSPOSITION[key].octaveShift || 0) : 0;
  
  const tonicNoteInDefaultOctaveSemitonesFromC0 = tonicChromaticIndex + (DEFAULT_SOLFEGE_OCTAVE + keyOctaveShift) * SEMITONES_IN_OCTAVE;
  const targetNoteSemitonesFromC0 = tonicNoteInDefaultOctaveSemitonesFromC0 + solfegeInterval + accidentalOffset + (octaveShift * SEMITONES_IN_OCTAVE);
  const frequency = C0_HZ * Math.pow(2, targetNoteSemitonesFromC0 / SEMITONES_IN_OCTAVE);
  if (isNaN(frequency)) return null;
  return frequency;
}

function getFrequencyForNote(noteClass, key = currentKey) {
  return calculateFrequency(key, noteClass, 'natural');
}

function getModifiedFrequency(baseNote, accidental, key = currentKey) {
  return calculateFrequency(key, baseNote, accidental);
}

// ===== ACCIDENTAL FUNCTIONS =====
function addAccidentalToNote(noteElement, accidentalType) { 
  removeAccidentalFromNote(noteElement); 
  if (accidentalType === 'natural') return; 
  const accidentalSpan = document.createElement('span');
  accidentalSpan.className = 'accidental-symbol';
  accidentalSpan.textContent = accidentalType === 'sharp' ? '♯' : '♭';
  noteElement.appendChild(accidentalSpan);
}

function removeAccidentalFromNote(noteElement) {
  const existingAccidental = noteElement.querySelector('.accidental-symbol');
  if (existingAccidental) existingAccidental.remove();
}

function getAccidentalFromNote(noteElement) {
  const accidentalSymbol = noteElement.querySelector('.accidental-symbol');
  if (!accidentalSymbol) return 'natural';
  return accidentalSymbol.textContent === '♯' ? 'sharp' : 'flat';
}

function applyActiveAccidentalToCurrentNote() {
  if (!editModeCheckbox.checked || currentNoteIndex < 0) return; 
  const activeNote = getActiveNote();
  if (activeNote) {
    addAccidentalToNote(activeNote, accidentalMode); 
    const noteClass = Array.from(activeNote.classList).find(c => noteOrder.includes(c));
    if (noteClass && !activeNote.classList.contains('rest-note')) {
      const frequency = getModifiedFrequency(noteClass, accidentalMode, currentKey); 
      if (frequency !== null) playNote(frequency);
    }
    saveCurrentSongToLibrary();
  }
}

// ===== AUDIO FUNCTIONS =====
function playNote(frequency) {
  if (frequency === null || isNaN(frequency) || frequency <= 0) {
    console.warn("Attempted to play invalid frequency:", frequency);
    return;
  }
  const now = audioCtx.currentTime;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, now); 
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.5, now + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
  oscillator.start(now);
  oscillator.stop(now + 0.5);
}

function playNoteWithAccidental(noteElement) {
  if (!noteElement || noteElement.classList.contains('rest-note')) return;
  const noteClass = Array.from(noteElement.classList).find(c => noteOrder.includes(c));
  if (noteClass) {
    const accidental = getAccidentalFromNote(noteElement); 
    const frequency = getModifiedFrequency(noteClass, accidental, currentKey);
    if (frequency !== null) playNote(frequency);
  }
}

// ===== COLOR AND DISPLAY FUNCTIONS =====
function applyNoteColors() {
  const colors = noteColorsByKey[currentKey];
  const letterNamesMap = letterNamesByKey[currentKey]; 
  document.querySelectorAll('.note').forEach(noteElement => {
    const noteClass = Array.from(noteElement.classList).find(c => noteToSolfege[c]); 
    if (noteClass) {
      const solfegeKey = noteToSolfege[noteClass]; 
      const color = colors[solfegeKey];
      const letterName = letterNamesMap[solfegeKey];
      if (!noteElement.classList.contains('rest-note')) {
        if (color) noteElement.style.backgroundColor = color;
      }
      const letterNameElement = noteElement.querySelector('.letter-name');
      if (letterNameElement && letterName) {
        letterNameElement.textContent = letterName;
        if (!noteElement.classList.contains('rest-note')) {
          letterNameElement.style.color = color;
        }
      }
    }
  });
}

function updateNoteDisplay(noteElement, noteClass) { 
  const solfegeKey = noteToSolfege[noteClass]; 
  const color = noteColorsByKey[currentKey][solfegeKey];
  const letterName = letterNamesByKey[currentKey][solfegeKey];
  if (!noteElement.classList.contains('rest-note')) {
    if (color) noteElement.style.backgroundColor = color;
  }
  const letterNameElement = noteElement.querySelector('.letter-name');
  if (letterNameElement && letterName) {
    letterNameElement.textContent = letterName;
    if (!noteElement.classList.contains('rest-note')) {
      letterNameElement.style.color = color;
    }
  }
  const solfegeNameElement = noteElement.querySelector('.solfege-name');
  if (solfegeNameElement) {
    solfegeNameElement.textContent = solfegeKey ? solfegeKey.toLowerCase() : ''; 
  }
}

// ===== SYLLABLE AND LINE CREATION =====
const DONT_ASK_DELETE_SECTION_KEY = 'song_writer_skip_delete_section_confirm';

function createSectionActionsBar(lineElement) {
    // 1. Reorder Group (far left center of the section)
    const reorderGroup = document.createElement('div');
    reorderGroup.className = 'section-reorder-group';

    const moveUpBtn = document.createElement('button');
    moveUpBtn.className = 'section-reorder-btn section-move-up-btn';
    moveUpBtn.title = 'Move section up';
    moveUpBtn.textContent = '▲';
    moveUpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveSection(lineElement, 'up');
    });

    const moveDownBtn = document.createElement('button');
    moveDownBtn.className = 'section-reorder-btn section-move-down-btn';
    moveDownBtn.title = 'Move section down';
    moveDownBtn.textContent = '▼';
    moveDownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        moveSection(lineElement, 'down');
    });

    reorderGroup.appendChild(moveUpBtn);
    reorderGroup.appendChild(moveDownBtn);

    // 2. Top Actions Group (upper left of the section)
    const topActions = document.createElement('div');
    topActions.className = 'section-top-actions';

    const duplicateBtn = document.createElement('button');
    duplicateBtn.className = 'section-icon-btn section-duplicate-btn';
    duplicateBtn.title = 'Duplicate section';
    duplicateBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
    `;
    duplicateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        duplicateSection(lineElement);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'section-icon-btn section-delete-btn';
    deleteBtn.title = 'Delete section';
    deleteBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        requestDeleteSection(lineElement);
    });

    topActions.appendChild(duplicateBtn);
    topActions.appendChild(deleteBtn);

    return { reorderGroup, topActions };
}

function moveSection(lineElement, direction) {
    if (!notationContainer) return;
    const lines = Array.from(notationContainer.querySelectorAll('.notation-line'));
    const index = lines.indexOf(lineElement);
    if (index < 0) return;

    if (direction === 'up' && index > 0) {
        notationContainer.insertBefore(lineElement, lines[index - 1]);
    } else if (direction === 'down' && index < lines.length - 1) {
        lines[index + 1].after(lineElement);
    } else {
        return;
    }

    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    saveCurrentSongToLibrary();
}

function duplicateSection(lineElement) {
    if (!lineElement || !notationContainer) return;
    
    const labelInput = lineElement.querySelector('.line-label');
    const label = labelInput ? labelInput.value : '';

    const isSectionBreak = lineElement.classList.contains('section-break');
    const newLine = createNewLineElement(isSectionBreak);
    const newLabelInput = newLine.querySelector('.line-label');
    if (newLabelInput) newLabelInput.value = label;

    const syllables = lineElement.querySelectorAll('.syllable');
    syllables.forEach(syllable => {
        const clonedSyllable = syllable.cloneNode(true);
        clonedSyllable.classList.remove('highlighted', 'editing');
        clonedSyllable.querySelectorAll('.note').forEach(n => n.classList.remove('highlighted'));
        addSyllableEventListeners(clonedSyllable);
        newLine.appendChild(clonedSyllable);
    });

    lineElement.after(newLine);

    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    saveCurrentSongToLibrary();

    const firstNoteInNew = newLine.querySelector('.note');
    if (firstNoteInNew) {
        setNoteAsActive(firstNoteInNew, true);
    }
}

function requestDeleteSection(lineElement) {
    if (!lineElement || !notationContainer) return;
    const skipConfirm = localStorage.getItem(DONT_ASK_DELETE_SECTION_KEY) === 'true';
    if (skipConfirm) {
        executeDeleteSection(lineElement);
        return;
    }

    pendingSectionToDelete = lineElement;
    const labelInput = lineElement.querySelector('.line-label');
    const label = labelInput && labelInput.value.trim() ? labelInput.value.trim() : 'this section';
    if (deleteSectionPromptText) {
        deleteSectionPromptText.textContent = `Are you sure you want to delete section "${label}"?`;
    }
    if (dontAskDeleteSectionCheckbox) {
        dontAskDeleteSectionCheckbox.checked = false;
    }
    if (deleteSectionModal) {
        deleteSectionModal.classList.add('show');
    }
}

function hideDeleteSectionModal() {
    if (deleteSectionModal) {
        deleteSectionModal.classList.remove('show');
    }
    pendingSectionToDelete = null;
}

function executeDeleteSection(lineElement) {
    if (!lineElement || !notationContainer) return;
    const lines = document.querySelectorAll('.notation-line');

    if (lines.length <= 1) {
        lineElement.querySelectorAll('.syllable').forEach(s => s.remove());
        const newSyllable = createNewSyllable();
        lineElement.appendChild(newSyllable);
        addSyllableEventListeners(newSyllable);
        const labelInput = lineElement.querySelector('.line-label');
        if (labelInput) labelInput.value = '';
        setSyllableAsActive(newSyllable);
    } else {
        lineElement.remove();
        const remainingNotes = getAllNotes();
        if (remainingNotes.length > 0) {
            if (currentNoteIndex >= remainingNotes.length) {
                currentNoteIndex = remainingNotes.length - 1;
            }
            setNoteAsActive(remainingNotes[Math.max(0, currentNoteIndex)], true);
        } else {
            currentNoteIndex = -1;
            currentSyllableIndex = -1;
        }
    }

    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();
    saveCurrentSongToLibrary();
}

function updateSectionActionButtonsState() {
    const lines = Array.from(document.querySelectorAll('.notation-line'));
    lines.forEach((line, index) => {
        let reorderGroup = line.querySelector('.section-reorder-group');
        let topActions = line.querySelector('.section-top-actions');
        if (!reorderGroup || !topActions) {
            const controls = createSectionActionsBar(line);
            if (!reorderGroup) line.appendChild(controls.reorderGroup);
            if (!topActions) line.appendChild(controls.topActions);
            reorderGroup = line.querySelector('.section-reorder-group');
            topActions = line.querySelector('.section-top-actions');
        }
        const upBtn = reorderGroup ? reorderGroup.querySelector('.section-move-up-btn') : null;
        const downBtn = reorderGroup ? reorderGroup.querySelector('.section-move-down-btn') : null;
        if (upBtn) upBtn.disabled = index === 0;
        if (downBtn) downBtn.disabled = index === lines.length - 1;
    });
}

function createNewLineElement(isSectionBreak = false) {
    const newNotationLine = document.createElement('div');
    newNotationLine.className = 'notation-line';
    if (isSectionBreak) {
        newNotationLine.classList.add('section-break');
    }

    const { reorderGroup, topActions } = createSectionActionsBar(newNotationLine);
    newNotationLine.appendChild(reorderGroup);
    newNotationLine.appendChild(topActions);

    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.className = 'line-label';
    labelInput.placeholder = 'Section Title';
    labelInput.maxLength = 15;
    labelInput.addEventListener('click', (e) => e.stopPropagation());
    labelInput.addEventListener('input', () => saveCurrentSongToLibrary());

    newNotationLine.appendChild(labelInput);
    return newNotationLine;
}

function createNoteElement(noteClass = 'do', accidental = 'natural', isRest = false) {
  const solfegeKey = noteToSolfege[noteClass] || 'Do';
  const color = noteColorsByKey[currentKey][solfegeKey];
  const letterName = letterNamesByKey[currentKey][solfegeKey];

  const noteDiv = document.createElement('div');
  noteDiv.className = `note ${noteClass}`;
  if (isRest) {
    noteDiv.classList.add('rest-note');
  } else if (color) {
    noteDiv.style.backgroundColor = color;
  }
  
  const letterNameDiv = document.createElement('div');
  letterNameDiv.className = 'letter-name';
  letterNameDiv.textContent = letterName || 'C';
  if (!isRest && color) letterNameDiv.style.color = color;

  const solfegeNameDiv = document.createElement('div');
  solfegeNameDiv.className = 'solfege-name';
  solfegeNameDiv.textContent = solfegeKey.toLowerCase();
  
  noteDiv.appendChild(letterNameDiv);
  noteDiv.appendChild(solfegeNameDiv);

  if (accidental && accidental !== 'natural') {
    addAccidentalToNote(noteDiv, accidental);
  }

  noteDiv.addEventListener('click', (event) => {
    event.stopPropagation();
    handleNoteClick(noteDiv, event);
  });

  noteDiv.addEventListener('dblclick', (event) => {
    event.stopPropagation();
    handleNoteDblClick(noteDiv, event);
  });

  return noteDiv;
}

function getNotePitchIndex(noteEl) {
  const noteClass = Array.from(noteEl.classList).find(c => noteOrder.includes(c)) || 'do';
  return noteOrder.indexOf(noteClass);
}

function updateHarmonyStackVisuals(harmonyStack) {
  if (!harmonyStack) return;
  const notes = Array.from(harmonyStack.querySelectorAll('.note'));
  
  if (notes.length > 1) {
    harmonyStack.classList.add('has-multiple-notes');
    
    // Sort notes from tallest (highest pitch) to shortest (lowest pitch)
    const sortedDescending = [...notes].sort((a, b) => getNotePitchIndex(b) - getNotePitchIndex(a));
    
    let maxNoteHeight = 60;

    // Append in DOM from tallest to shortest so smallest is last in DOM and highest z-index
    sortedDescending.forEach((noteEl, rank) => {
      harmonyStack.appendChild(noteEl);
      // Tallest note (rank 0) gets zIndex 1 (in the back)
      // Smallest note gets highest zIndex (in the very front)
      noteEl.style.zIndex = rank + 1;

      const noteClass = noteOrder.find(cls => noteEl.classList.contains(cls));
      if (noteClass && NOTE_HEIGHTS[noteClass] && NOTE_HEIGHTS[noteClass] > maxNoteHeight) {
        maxNoteHeight = NOTE_HEIGHTS[noteClass];
      }
    });

    // Ensure harmonyStack maintains its true physical layout height so the section and syllable never collapse!
    harmonyStack.style.height = `${maxNoteHeight}px`;
  } else {
    harmonyStack.classList.remove('has-multiple-notes');
    harmonyStack.style.height = '';
    notes.forEach(noteEl => {
      noteEl.style.zIndex = '';
    });
  }
}

function createNewSyllable(syllableText = '-', columns = [[{ noteClass: 'do', accidental: 'natural', isRest: false }]]) {
  // Normalize columns argument
  let normalizedColumns = [];
  if (typeof columns === 'string') {
    normalizedColumns = [[{ noteClass: columns, accidental: 'natural', isRest: false }]];
  } else if (Array.isArray(columns)) {
    if (columns.length === 0) {
      normalizedColumns = [[{ noteClass: 'do', accidental: 'natural', isRest: false }]];
    } else if (typeof columns[0] === 'string') {
      normalizedColumns = columns.map(nc => [{ noteClass: nc, accidental: 'natural', isRest: false }]);
    } else if (Array.isArray(columns[0])) {
      normalizedColumns = columns.map(col => {
        if (Array.isArray(col)) {
          return col.map(n => typeof n === 'string' ? { noteClass: n, accidental: 'natural', isRest: false } : n);
        } else if (typeof col === 'string') {
          return [{ noteClass: col, accidental: 'natural', isRest: false }];
        } else {
          return [col];
        }
      });
    }
  }

  const syllableDiv = document.createElement('div');
  syllableDiv.className = 'syllable';
  
  const notesContainer = document.createElement('div');
  notesContainer.className = 'notes-container';

  normalizedColumns.forEach(colNotes => {
    const harmonyStack = document.createElement('div');
    harmonyStack.className = 'harmony-stack';
    colNotes.forEach(nSpec => {
      const noteEl = createNoteElement(nSpec.noteClass || 'do', nSpec.accidental || 'natural', nSpec.isRest || false);
      harmonyStack.appendChild(noteEl);
    });
    updateHarmonyStackVisuals(harmonyStack);
    notesContainer.appendChild(harmonyStack);
  });
  
  const textDiv = document.createElement('div');
  textDiv.className = 'text';
  textDiv.textContent = syllableText;

  syllableDiv.appendChild(notesContainer);
  syllableDiv.appendChild(textDiv);

  addSyllableEventListeners(syllableDiv);
  
  return syllableDiv;
}

function parseNoteShorthand(shorthand) {
    let noteClass = 'do';
    let accidentalType = 'natural';
    let isRest = false;

    let cleanShorthand = shorthand.trim();
    if (cleanShorthand.endsWith('~') || cleanShorthand.endsWith('*')) {
        isRest = true;
        cleanShorthand = cleanShorthand.slice(0, -1);
    }

    const noteMatch = cleanShorthand.match(/^([A-Z])([#b]?)?(-?\d+)$/i);
    if (noteMatch) {
        const baseLetter = noteMatch[1].toUpperCase();
        const accidentalChar = noteMatch[2] || '';
        const octave = noteMatch[3];
        const shorthandKey = `${baseLetter}${octave}`;
        const mappedNoteClass = shorthandToNoteMap[shorthandKey];

        if (mappedNoteClass) {
            noteClass = mappedNoteClass;
            if (accidentalChar === '#') accidentalType = 'sharp';
            else if (accidentalChar.toLowerCase() === 'b') accidentalType = 'flat';
        }
    }
    return { noteClass, accidentalType, isRest };
}

function createNewLineFromText(text, mode = 'add') {
    if (mode === 'replace') {
        notationContainer.innerHTML = '';
        currentNoteIndex = -1;
        currentSyllableIndex = -1;
        navigationOffEndState = null;
        updateDeleteButtonState();
        updateConnectedBarsControlState();
        updateHarmonyControlState();
        updateRestButtonState();
    }
    
    const lines = text.trim().split('\n');
    let currentLineElement = null;
    let lastCreatedSyllable = null;

    lines.forEach(lineText => {
        const trimmedLine = lineText.trim();
        
        // Skip the [Key of ...] line if it exists
        if (trimmedLine.startsWith('[Key of')) {
            return;
        }

        const labelMatch = trimmedLine.match(/^\[(.*)\]$/);

        if (labelMatch) {
            // This is a label line, create a new notation line
            const label = labelMatch[1];
            currentLineElement = createNewLineElement(true);
            if (label !== 'New Line') {
                currentLineElement.querySelector('.line-label').value = label;
            }
            notationContainer.appendChild(currentLineElement);
        } else if (trimmedLine.length > 0 && currentLineElement) {
            // This is a syllable line, add syllables to the current notation line
            const syllableStrings = trimmedLine.split(/\s+/).filter(s => s.length > 0);
            syllableStrings.forEach(syllableString => {
                let lyric = syllableString;
                let columns = [[{ noteClass: 'do', accidental: 'natural', isRest: false }]];

                const multiNoteMatch = syllableString.match(/(.+)\[(.*)\]$/i);
                if (multiNoteMatch) {
                    lyric = multiNoteMatch[1];
                    const columnStrings = multiNoteMatch[2].split(',').map(s => s.trim()).filter(s => s.length > 0);
                    if (columnStrings.length > 0) {
                        columns = [];
                        columnStrings.forEach(colStr => {
                          const noteShorthands = colStr.split('+').map(s => s.trim()).filter(s => s.length > 0);
                          const colNotes = [];
                          noteShorthands.forEach(sh => {
                            const parsed = parseNoteShorthand(sh);
                            colNotes.push({ noteClass: parsed.noteClass, accidental: parsed.accidentalType, isRest: parsed.isRest });
                          });
                          if (colNotes.length > 0) columns.push(colNotes);
                        });
                    }
                }
                
                const syllable = createNewSyllable(lyric, columns);
                currentLineElement.appendChild(syllable);
                lastCreatedSyllable = syllable;
            });
        }
    });

    updateLineBackgrounds();
    updateAllLineHeights();
    updateSectionActionButtonsState();

    const firstNote = notationContainer.querySelector('.note');
    if (firstNote) {
        setNoteAsActive(firstNote, false);
    }
}

function duplicateCurrentNote() {
  if (!editModeCheckbox.checked) return;
  const activeNote = getActiveNote();
  if (!activeNote) return;

  const parentSyllable = activeNote.closest('.syllable');
  if (!parentSyllable) return;

  const notesInSyllable = parentSyllable.querySelectorAll('.note');
  if (notesInSyllable.length >= 8) {
    console.warn('Maximum 8 connected bars per syllable reached.');
    return;
  }

  let notesContainer = parentSyllable.querySelector('.notes-container');
  if (!notesContainer) {
    notesContainer = document.createElement('div');
    notesContainer.className = 'notes-container';
    parentSyllable.insertBefore(notesContainer, parentSyllable.querySelector('.text'));
  }

  const currentStack = activeNote.closest('.harmony-stack');
  const currentNoteClass = Array.from(activeNote.classList).find(c => noteOrder.includes(c)) || 'do';
  const accidental = getAccidentalFromNote(activeNote);
  const isRest = activeNote.classList.contains('rest-note');

  const newStack = document.createElement('div');
  newStack.className = 'harmony-stack';
  const newNote = createNoteElement(currentNoteClass, accidental, isRest);
  newStack.appendChild(newNote);

  if (currentStack && currentStack.parentNode === notesContainer) {
    currentStack.insertAdjacentElement('afterend', newStack);
  } else {
    notesContainer.appendChild(newStack);
  }

  const line = parentSyllable.closest('.notation-line');
  if (line) updateLineHeight(line);

  setNoteAsActive(newNote, true);
  saveCurrentSongToLibrary();
}

function removeCurrentConnectedNote() {
  if (!editModeCheckbox.checked) return;
  const activeNote = getActiveNote();
  if (!activeNote) return;

  const parentSyllable = activeNote.closest('.syllable');
  if (!parentSyllable) return;

  const stacksInSyllable = Array.from(parentSyllable.querySelectorAll('.harmony-stack'));
  if (stacksInSyllable.length <= 1) {
    return;
  }

  const currentStack = activeNote.closest('.harmony-stack');
  if (!currentStack) return;

  const stackIndex = stacksInSyllable.indexOf(currentStack);
  const nextStack = stackIndex > 0 ? stacksInSyllable[stackIndex - 1] : stacksInSyllable[stackIndex + 1];

  currentStack.remove();

  const line = parentSyllable.closest('.notation-line');
  if (line) updateLineHeight(line);

  if (nextStack) {
    const nextNote = nextStack.querySelector('.note');
    if (nextNote) setNoteAsActive(nextNote, true);
  }
  saveCurrentSongToLibrary();
}

function addHarmonyNote() {
  if (!editModeCheckbox.checked) return;
  const activeNote = getActiveNote();
  if (!activeNote) return;

  let harmonyStack = activeNote.closest('.harmony-stack');
  if (!harmonyStack) {
    const parentContainer = activeNote.closest('.notes-container');
    if (parentContainer) {
      harmonyStack = document.createElement('div');
      harmonyStack.className = 'harmony-stack';
      activeNote.parentNode.insertBefore(harmonyStack, activeNote);
      harmonyStack.appendChild(activeNote);
    } else {
      return;
    }
  }

  const notesInStack = harmonyStack.querySelectorAll('.note');
  if (notesInStack.length >= 6) {
    console.warn('Maximum 6 harmony notes per stack reached.');
    return;
  }

  const currentNoteClass = Array.from(activeNote.classList).find(c => noteOrder.includes(c)) || 'do';
  const currentIndex = noteOrder.indexOf(currentNoteClass);
  let newIndex = (currentIndex + 2) % noteOrder.length;
  const newNoteClass = noteOrder[newIndex];

  const newNote = createNoteElement(newNoteClass, 'natural', false);
  harmonyStack.appendChild(newNote);

  updateHarmonyStackVisuals(harmonyStack);

  const parentLine = harmonyStack.closest('.notation-line');
  if (parentLine) updateLineHeight(parentLine);

  setNoteAsActive(newNote, false);
  playHarmony(harmonyStack);
  saveCurrentSongToLibrary();
}

function removeHarmonyNote() {
  if (!editModeCheckbox.checked) return;
  const activeNote = getActiveNote();
  if (!activeNote) return;

  const harmonyStack = activeNote.closest('.harmony-stack');
  if (!harmonyStack) return;

  const notesInStack = Array.from(harmonyStack.querySelectorAll('.note'));
  if (notesInStack.length <= 1) {
    return;
  }

  const noteIndexInStack = notesInStack.indexOf(activeNote);
  const nextActiveNote = noteIndexInStack > 0 ? notesInStack[noteIndexInStack - 1] : notesInStack[noteIndexInStack + 1];

  activeNote.remove();
  updateHarmonyStackVisuals(harmonyStack);

  const parentLine = harmonyStack.closest('.notation-line');
  if (parentLine) updateLineHeight(parentLine);

  if (nextActiveNote) {
    setNoteAsActive(nextActiveNote, false);
    playHarmony(harmonyStack);
  }
  saveCurrentSongToLibrary();
}

function updateConnectedBarsControlState() {
  if (!connectedBarsControl) return;

  if (!editModeCheckbox.checked || currentNoteIndex < 0) {
    connectedBarsControl.classList.add('disabled');
    connectedBarsControl.classList.remove('has-multiple');
    if (addConnectedNoteBtn) addConnectedNoteBtn.disabled = true;
    if (removeConnectedNoteBtn) removeConnectedNoteBtn.disabled = true;
    return;
  }

  const activeNote = getActiveNote();
  if (!activeNote) {
    connectedBarsControl.classList.add('disabled');
    connectedBarsControl.classList.remove('has-multiple');
    if (addConnectedNoteBtn) addConnectedNoteBtn.disabled = true;
    if (removeConnectedNoteBtn) removeConnectedNoteBtn.disabled = true;
    return;
  }

  connectedBarsControl.classList.remove('disabled');

  const parentSyllable = activeNote.closest('.syllable');
  const stacksCount = parentSyllable ? parentSyllable.querySelectorAll('.harmony-stack').length : 1;
  const totalNotesCount = parentSyllable ? parentSyllable.querySelectorAll('.note').length : 1;

  if (totalNotesCount >= 8 || stacksCount >= 8) {
    if (addConnectedNoteBtn) addConnectedNoteBtn.disabled = true;
  } else {
    if (addConnectedNoteBtn) addConnectedNoteBtn.disabled = false;
  }

  if (stacksCount > 1) {
    connectedBarsControl.classList.add('has-multiple');
    if (removeConnectedNoteBtn) removeConnectedNoteBtn.disabled = false;
  } else {
    connectedBarsControl.classList.remove('has-multiple');
    if (removeConnectedNoteBtn) removeConnectedNoteBtn.disabled = true;
  }
}

function updateHarmonyControlState() {
  if (!harmonyBarsControl) return;

  if (!editModeCheckbox.checked || currentNoteIndex < 0) {
    harmonyBarsControl.classList.add('disabled');
    harmonyBarsControl.classList.remove('has-multiple');
    if (addHarmonyNoteBtn) addHarmonyNoteBtn.disabled = true;
    if (removeHarmonyNoteBtn) removeHarmonyNoteBtn.disabled = true;
    return;
  }

  const activeNote = getActiveNote();
  if (!activeNote) {
    harmonyBarsControl.classList.add('disabled');
    harmonyBarsControl.classList.remove('has-multiple');
    if (addHarmonyNoteBtn) addHarmonyNoteBtn.disabled = true;
    if (removeHarmonyNoteBtn) removeHarmonyNoteBtn.disabled = true;
    return;
  }

  harmonyBarsControl.classList.remove('disabled');

  const harmonyStack = activeNote.closest('.harmony-stack');
  const notesInStack = harmonyStack ? harmonyStack.querySelectorAll('.note').length : 1;

  if (notesInStack >= 6) {
    if (addHarmonyNoteBtn) addHarmonyNoteBtn.disabled = true;
  } else {
    if (addHarmonyNoteBtn) addHarmonyNoteBtn.disabled = false;
  }

  if (notesInStack > 1) {
    harmonyBarsControl.classList.add('has-multiple');
    if (removeHarmonyNoteBtn) removeHarmonyNoteBtn.disabled = false;
  } else {
    harmonyBarsControl.classList.remove('has-multiple');
    if (removeHarmonyNoteBtn) removeHarmonyNoteBtn.disabled = true;
  }
}

function toggleRestOnCurrentNote() {
  if (!editModeCheckbox.checked || currentNoteIndex < 0) return;
  const activeNote = getActiveNote();
  if (!activeNote) return;

  const isRest = activeNote.classList.toggle('rest-note');
  const currentNoteClass = Array.from(activeNote.classList).find(c => noteOrder.includes(c)) || 'do';
  
  if (isRest) {
    activeNote.style.backgroundColor = '';
    const letterNameEl = activeNote.querySelector('.letter-name');
    if (letterNameEl) letterNameEl.style.color = '';
  } else {
    updateNoteDisplay(activeNote, currentNoteClass);
    playNoteWithAccidental(activeNote);
  }
  
  updateRestButtonState();
  saveCurrentSongToLibrary();
}

function updateRestButtonState() {
  if (!restToggleBtn) return;
  if (!editModeCheckbox.checked || currentNoteIndex < 0) {
    restToggleBtn.disabled = true;
    restToggleBtn.classList.remove('active');
    return;
  }
  const activeNote = getActiveNote();
  if (!activeNote) {
    restToggleBtn.disabled = true;
    restToggleBtn.classList.remove('active');
    return;
  }
  restToggleBtn.disabled = false;
  const isRest = activeNote.classList.contains('rest-note');
  restToggleBtn.classList.toggle('active', isRest);
}

function addSyllableAfterCurrent() {
  if (!editModeCheckbox.checked) return;
  const syllables = getAllSyllables();
  let targetSyllable, targetLine;
  if (currentSyllableIndex >= 0 && currentSyllableIndex < syllables.length) {
    targetSyllable = syllables[currentSyllableIndex];
    targetLine = targetSyllable.closest('.notation-line');
  } else {
    const lines = document.querySelectorAll('.notation-line');
    if (lines.length > 0) {
      targetLine = lines[lines.length - 1];
      const lastLineSyllables = targetLine.querySelectorAll('.syllable');
      targetSyllable = lastLineSyllables.length > 0 ? lastLineSyllables[lastLineSyllables.length - 1] : null;
    } else { 
        targetLine = createNewLineElement();
        notationContainer.appendChild(targetLine);
        updateLineBackgrounds();
        updateLineHeight(targetLine);
    }
  }
  if (!targetLine) { console.warn("Target line not found for adding syllable."); return; }
  const newSyllable = createNewSyllable();
  if (targetSyllable) targetSyllable.insertAdjacentElement('afterend', newSyllable);
  else targetLine.appendChild(newSyllable);
  updateLineHeight(targetLine);
  setSyllableAsActive(newSyllable); 
  saveCurrentSongToLibrary();
  return newSyllable;
}

function deleteSyllable() {
  if (!editModeCheckbox.checked || currentSyllableIndex < 0) return;
  
  const syllables = getAllSyllables();
  if (currentSyllableIndex >= syllables.length) return;
  
  const syllableToDelete = syllables[currentSyllableIndex];
  const parentLine = syllableToDelete.closest('.notation-line');
  syllableToDelete.remove();
  
  if (parentLine && parentLine.querySelectorAll('.syllable').length === 0) {
      parentLine.remove();
      updateLineBackgrounds();
  } else if (parentLine) {
      updateLineHeight(parentLine);
  }

  const remainingNotes = getAllNotes();
  if (remainingNotes.length === 0) {
    currentNoteIndex = -1;
    currentSyllableIndex = -1;
    navigationOffEndState = null;
    updateDeleteButtonState();
    updateEnterKeyButtonState();
    updateConnectedBarsControlState();
    updateHarmonyControlState();
  } else {
    if (currentNoteIndex >= remainingNotes.length) {
      currentNoteIndex = remainingNotes.length - 1;
    }
    setNoteAsActive(remainingNotes[currentNoteIndex], true);
  }
  
  resetDeleteConfirmation();
  saveCurrentSongToLibrary();
}

function addSyllableEventListeners(syllable) {
  syllable.addEventListener('click', (event) => { event.stopPropagation(); handleSyllableClick(syllable); });
  const textElement = syllable.querySelector('.text');
  if (textElement) textElement.addEventListener('click', (event) => handleTextClick(textElement, event));
}

// ===== TEXT EDITING FUNCTIONS =====
function startTextEdit(textElement) {
  if (currentlyEditingText && currentlyEditingText !== textElement) finishTextEdit();
  currentlyEditingText = textElement;
  const syllable = textElement.closest('.syllable');
  syllable.classList.add('editing');
  currentEditingIndex = Array.from(getAllSyllables()).indexOf(syllable);
  const input = document.createElement('input');
  input.type = 'text'; input.className = 'text-input'; input.value = textElement.textContent;
  textElement.style.display = 'none'; textElement.parentNode.insertBefore(input, textElement);
  input.focus(); input.select();
  input.addEventListener('blur', () => { if (!isAdvancingToNext) finishTextEdit(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') finishTextEdit();
    else if (e.key === 'Escape') cancelTextEdit();
    else if (e.key === ' ' && e.target.selectionStart === e.target.value.length) { e.preventDefault(); finishTextEditAndAdvance(); }
    else if ((e.key === 'Backspace' || e.key === 'Delete') && e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
      e.preventDefault(); 
      finishTextEditAndGoBack();
    }
  });
  input.addEventListener('click', (e) => e.stopPropagation());
}

function finishTextEdit() {
  if (!currentlyEditingText) return;
  const syllable = currentlyEditingText.closest('.syllable');
  const input = syllable.querySelector('.text-input');
  if (input) { 
    const inputValue = input.value.trim();
    currentlyEditingText.textContent = inputValue || '-'; 
    input.remove(); 
    currentlyEditingText.style.display = 'flex'; 
  }
  syllable.classList.remove('editing'); 
  currentlyEditingText = null; 
  currentEditingIndex = -1; 
  isAdvancingToNext = false;
  saveCurrentSongToLibrary();
}

function finishTextEditAndAdvance() {
  if (!currentlyEditingText) return;
  
  const syllables = getAllSyllables(); 
  const currentSyllable = syllables[currentEditingIndex];
  const nextIndex = currentEditingIndex + 1; 
  isAdvancingToNext = true;
  
  const syllable = currentlyEditingText.closest('.syllable'); 
  const input = syllable.querySelector('.text-input');
  if (input) { 
    const inputValue = input.value.trim();
    currentlyEditingText.textContent = inputValue || '-'; 
    input.remove(); 
    currentlyEditingText.style.display = 'flex'; 
  }
  syllable.classList.remove('editing'); 
  currentlyEditingText = null; 
  currentEditingIndex = -1;
  
  if (nextIndex < syllables.length) {
    const nextSyllable = syllables[nextIndex];
    const nextTextElement = nextSyllable.querySelector('.text');
    if (nextTextElement) { 
      scrollToSyllable(nextSyllable); 
      setTimeout(() => { 
        isAdvancingToNext = false; 
        startTextEdit(nextTextElement); 
      }, 50); 
    } else {
      isAdvancingToNext = false;
    }
  } else {
    if (editModeCheckbox.checked) {
      setSyllableAsActive(currentSyllable);
      const newSyllable = addSyllableAfterCurrent();
      if (newSyllable) {
        const newTextElement = newSyllable.querySelector('.text');
        if (newTextElement) {
          scrollToSyllable(newSyllable);
          setTimeout(() => {
            isAdvancingToNext = false;
            startTextEdit(newTextElement);
          }, 50);
        } else {
          isAdvancingToNext = false;
        }
      } else {
        isAdvancingToNext = false;
      }
    } else {
      isAdvancingToNext = false;
    }
  }
}

function finishTextEditAndGoBack() {
  if (!currentlyEditingText) return;
  
  const syllables = getAllSyllables();
  const previousIndex = currentEditingIndex - 1;
  isAdvancingToNext = true;
  
  const syllable = currentlyEditingText.closest('.syllable');
  const input = syllable.querySelector('.text-input');
  
  if (input && input.value.trim() === '-') {
    syllable.classList.remove('editing');
    currentlyEditingText = null;
    currentEditingIndex = -1;
    isAdvancingToNext = false;
    setSyllableAsActive(syllable);
    deleteSyllable();
    return;
  }
  
  if (input) {
    const inputValue = input.value.trim();
    currentlyEditingText.textContent = inputValue || '-';
    input.remove();
    currentlyEditingText.style.display = 'flex';
  }
  syllable.classList.remove('editing');
  currentlyEditingText = null;
  currentEditingIndex = -1;
  
  if (previousIndex >= 0 && previousIndex < syllables.length) {
    const previousSyllable = syllables[previousIndex];
    const previousTextElement = previousSyllable.querySelector('.text');
    
    if (previousTextElement) {
      scrollToSyllable(previousSyllable);
      setTimeout(() => {
        isAdvancingToNext = false;
        startTextEdit(previousTextElement);
        const newInput = previousSyllable.querySelector('.text-input');
        if (newInput) {
          newInput.select();
        }
      }, 50);
    } else {
      isAdvancingToNext = false;
    }
  } else {
    isAdvancingToNext = false;
  }
}

function cancelTextEdit() {
  if (!currentlyEditingText) return;
  const syllable = currentlyEditingText.closest('.syllable'); const input = syllable.querySelector('.text-input');
  if (input) { input.remove(); currentlyEditingText.style.display = 'flex'; }
  syllable.classList.remove('editing'); currentlyEditingText = null; currentEditingIndex = -1; isAdvancingToNext = false;
}

// ===== TOGGLE FUNCTIONS =====
function toggleEditMode() {
  editModeCheckbox.checked = !editModeCheckbox.checked;
  editToggleBtn.classList.toggle('active', editModeCheckbox.checked);
  updateEditOnlyControlsVisibility();
  updateAddButtonState();
  updateDeleteButtonState();
  updateEnterKeyButtonState();
  updateConnectedBarsControlState();
  updateHarmonyControlState();
  updateRestButtonState();
  updateTextEditorButtonState();
  updateAbaButtonState();
}
function toggleAbaMode() {
  if (!editModeCheckbox.checked) return;
  abaMode = !abaMode;
  document.body.classList.toggle('aba-mode-active', abaMode);
  if (abaToggleBtn) abaToggleBtn.classList.toggle('active', abaMode);
  if (abaMode) {
    updateSectionActionButtonsState();
  }
}
function updateAbaButtonState() {
  if (!abaToggleBtn) return;
  abaToggleBtn.disabled = !editModeCheckbox.checked;
  if (!editModeCheckbox.checked && abaMode) {
    abaMode = false;
    document.body.classList.remove('aba-mode-active');
    abaToggleBtn.classList.remove('active');
  }
}
function toggleSaveLoadMode() {
  saveLoadMode = !saveLoadMode;
  if (saveLoadBtn) saveLoadBtn.classList.toggle('active', saveLoadMode);
  if (libraryControls) libraryControls.classList.toggle('show', saveLoadMode);
}
function syncEditButtonState() { editToggleBtn.classList.toggle('active', editModeCheckbox.checked); }
function toggleNames() {
  showNames = !showNames;
  document.querySelector('.notation-container').classList.toggle('show-names', showNames);
  document.body.classList.toggle('show-names', showNames);
  nameToggle.classList.toggle('active', showNames);
  updateChordBoxLabels();
}
function toggleChords() {
  chordMode = !chordMode;
  chordToggle.classList.toggle('active', chordMode);
  updateChordBoxesVisibility();
  console.log(`Chord mode ${chordMode ? 'enabled' : 'disabled'}`);
}
function toggleColorScheme() {
    colorSchemeActive = !colorSchemeActive;
    colorSchemeToggle.classList.toggle('active', colorSchemeActive);
    document.body.classList.toggle('colors-inactive', !colorSchemeActive);
    updateLineBackgrounds();
    console.log(`Color scheme colors ${colorSchemeActive ? 'enabled' : 'disabled'}`);
}
function toggleMinimize() {
  controlsMinimized = !controlsMinimized;
  if (controlsGroup) {
    controlsGroup.classList.toggle('minimized', controlsMinimized);
  }
  const bottomControls = document.querySelector('.bottom-controls');
  if (bottomControls) {
    bottomControls.classList.toggle('minimized', controlsMinimized);
  }
  if (minimizeBtn) {
    minimizeBtn.textContent = controlsMinimized ? '▲' : '▼';
    minimizeBtn.title = controlsMinimized ? 'Reveal settings' : 'Hide settings';
  }
}
function updateAddButtonState() {
  addBtn.disabled = !editModeCheckbox.checked;
  addBtn.classList.toggle('active', editModeCheckbox.checked);
}
function updateDeleteButtonState() {
  deleteBtn.disabled = !editModeCheckbox.checked || currentNoteIndex < 0;
  deleteBtn.classList.toggle('active', editModeCheckbox.checked && currentNoteIndex >= 0);
}
function updateTextEditorButtonState() {
  if (!textEditorBtn) return;
  textEditorBtn.disabled = !editModeCheckbox.checked;
  textEditorBtn.classList.toggle('active', editModeCheckbox.checked);
}
function updateEnterKeyButtonState() {
    enterKeyBtn.disabled = !editModeCheckbox.checked || currentNoteIndex < 0;
    if (!editModeCheckbox.checked) {
        resetEnterKeyState();
    }
}
function changeKey(newKey) {
    if (KEY_SIGNATURES_CHROMATIC_INDEX.hasOwnProperty(newKey)) {
        currentKey = newKey;
        
        // Update display text and color
        const displayKey = newKey.includes('b') ? newKey.replace('b', '♭') : newKey;
        keySignatureDisplay.textContent = displayKey;
        const color = keySignatureColors[newKey];
        if (color) {
            keySignatureDisplay.style.borderColor = color;
            keySignatureDisplay.style.color = color;
        }

        applyNoteColors();
        applyChordColors();
        updateChordBoxLabels();
        console.log(`Key changed to: ${newKey}`);
        resetAccidentalToggleVisuals();
    } else {
        console.warn(`Attempted to change to invalid key: ${newKey}`);
    }
}

// ===== SONG STORAGE & LIBRARY FUNCTIONS =====
function getStoredLibrary() {
    let library = null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            library = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error loading library from localStorage:', e);
    }

    if (!library || typeof library !== 'object' || Object.keys(library).length === 0) {
        library = {
            'twinkle': { id: 'twinkle', title: 'Twinkle Twinkle', content: PRELOADED_SONGS['twinkle'] || '' },
            'mary': { id: 'mary', title: 'Mary Had a Little Lamb', content: PRELOADED_SONGS['mary'] || '' },
            'starspangledbanner': { id: 'starspangledbanner', title: 'Star Spangled Banner', content: PRELOADED_SONGS['starspangledbanner'] || '' }
        };
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

function generateScoreText() {
    let bodyText = '';
    const lines = document.querySelectorAll('.notation-line');

    lines.forEach(line => {
        const labelInput = line.querySelector('.line-label');
        const label = labelInput ? labelInput.value.trim() : '';
        bodyText += `[${label || 'New Line'}]\n`;

        const syllables = line.querySelectorAll('.syllable');
        const formattedSyllables = Array.from(syllables).map(syllable => {
            const text = syllable.querySelector('.text').textContent;
            const stacks = syllable.querySelectorAll('.harmony-stack');
            
            let columnShorthands = [];
            if (stacks.length > 0) {
              stacks.forEach(stack => {
                const notes = stack.querySelectorAll('.note');
                const stackNotes = Array.from(notes).map(noteElement => {
                  const noteClass = noteOrder.find(cls => noteElement.classList.contains(cls)) || 'do';
                  const accidental = getAccidentalFromNote(noteElement);
                  const isRest = noteElement.classList.contains('rest-note');
                  let shorthand = noteToShorthandMap[noteClass] || 'D1';
                  if (accidental === 'sharp') {
                      shorthand = shorthand.replace(/([A-Z])/, '$1#');
                  } else if (accidental === 'flat') {
                      shorthand = shorthand.replace(/([A-Z])/, '$1b');
                  }
                  if (isRest) {
                      shorthand += '~';
                  }
                  return shorthand;
                });
                columnShorthands.push(stackNotes.join('+'));
              });
            } else {
              const notes = syllable.querySelectorAll('.note');
              const noteShorthands = Array.from(notes).map(noteElement => {
                  const noteClass = noteOrder.find(cls => noteElement.classList.contains(cls)) || 'do';
                  const accidental = getAccidentalFromNote(noteElement);
                  const isRest = noteElement.classList.contains('rest-note');
                  let shorthand = noteToShorthandMap[noteClass] || 'D1';
                  if (accidental === 'sharp') {
                      shorthand = shorthand.replace(/([A-Z])/, '$1#');
                  } else if (accidental === 'flat') {
                      shorthand = shorthand.replace(/([A-Z])/, '$1b');
                  }
                  if (isRest) {
                      shorthand += '~';
                  }
                  return shorthand;
              });
              columnShorthands = noteShorthands;
            }
            
            return `${text}[${columnShorthands.join(',')}]`;
        }).join(' ');
        
        bodyText += formattedSyllables + '\n';
    });

    return `[Key of ${currentKey}]\n` + bodyText.trim();
}

function saveCurrentSongToLibrary() {
    if (!currentSongId) return;
    const library = getStoredLibrary();
    const scoreText = generateScoreText();
    if (!library[currentSongId]) {
        library[currentSongId] = {
            id: currentSongId,
            title: currentSongTitle || 'Untitled Song',
            content: scoreText
        };
    } else {
        library[currentSongId].content = scoreText;
    }
    saveStoredLibrary(library);
}

function populateLibraryDropdown() {
    if (!librarySelector) return;
    const library = getStoredLibrary();
    librarySelector.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.textContent = 'Library';
    librarySelector.appendChild(defaultOption);

    const songIds = Object.keys(library);
    songIds.forEach(id => {
        const song = library[id];
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = song.title;
        if (id === currentSongId) {
            opt.selected = true;
        }
        librarySelector.appendChild(opt);
    });

    if (!currentSongId && songIds.length > 0) {
        currentSongId = songIds[0];
        librarySelector.value = currentSongId;
    }
}

function loadSongById(songId) {
    const library = getStoredLibrary();
    const song = library[songId];
    if (!song) return;

    currentSongId = songId;
    currentSongTitle = song.title;
    localStorage.setItem(ACTIVE_SONG_ID_KEY, songId);

    loadSongFromText(song.content);
    populateLibraryDropdown();
}

function loadSongFromText(text) {
    let songText = text;
    let finalKey = currentKey;

    const keyMatch = songText.match(/^\[Key of (.*?)\]\n?/);
    if (keyMatch) {
        const potentialKey = keyMatch[1];
        if (KEY_SIGNATURES_CHROMATIC_INDEX.hasOwnProperty(potentialKey)) {
            finalKey = potentialKey;
        }
        songText = songText.substring(keyMatch[0].length);
    }

    if (finalKey !== currentKey) {
        changeKey(finalKey);
    }

    if (songText.trim() && !songText.trim().startsWith('[')) {
        songText = '[New Line]\n' + songText;
    }
    
    createNewLineFromText(songText, 'replace');
}

// ===== CREATE NEW SONG MODAL =====
function showNewSongModal() {
    newSongTitleInput.value = '';
    newSongModal.classList.add('show');
    setTimeout(() => newSongTitleInput.focus(), 60);
}

function hideNewSongModal() {
    newSongModal.classList.remove('show');
    newSongTitleInput.value = '';
}

function createNewSong(title) {
    const cleanTitle = (title && title.trim()) ? title.trim() : 'New Song';
    const id = 'song_' + Date.now();
    const defaultContent = `[Key of C]\n[A]\nStart[D1] Here[D1]`;
    
    const library = getStoredLibrary();
    library[id] = {
        id: id,
        title: cleanTitle,
        content: defaultContent
    };
    saveStoredLibrary(library);

    hideNewSongModal();
    hideManageLibraryModal();
    loadSongById(id);

    if (!editModeCheckbox.checked) {
        toggleEditMode();
    }
}

// ===== MANAGE LIBRARY MODAL =====
function showManageLibraryModal() {
    saveCurrentSongToLibrary();
    renderLibrarySongList();
    manageLibraryModal.classList.add('show');
}

function hideManageLibraryModal() {
    manageLibraryModal.classList.remove('show');
}

function renderLibrarySongList() {
    if (!librarySongList) return;
    const library = getStoredLibrary();
    librarySongList.innerHTML = '';

    const songIds = Object.keys(library);
    if (songIds.length === 0) {
        librarySongList.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">No saved songs in library.</div>';
        return;
    }

    songIds.forEach(id => {
        const song = library[id];
        const isCurrent = id === currentSongId;
        
        const keyMatch = (song.content || '').match(/^\[Key of (.*?)\]/);
        const songKey = keyMatch ? keyMatch[1] : 'C';

        const itemDiv = document.createElement('div');
        itemDiv.className = `library-song-item ${isCurrent ? 'active-song' : ''}`;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'library-song-info';

        const badge = document.createElement('span');
        badge.className = 'library-song-badge';
        badge.textContent = songKey;

        const titleSpan = document.createElement('span');
        titleSpan.className = 'library-song-title';
        titleSpan.textContent = song.title;

        infoDiv.appendChild(badge);
        infoDiv.appendChild(titleSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'library-song-actions';

        const loadBtn = document.createElement('button');
        loadBtn.className = 'lib-action-btn load-btn';
        loadBtn.textContent = isCurrent ? 'Active' : 'Load';
        if (!isCurrent) {
            loadBtn.addEventListener('click', () => {
                loadSongById(id);
                hideManageLibraryModal();
            });
        } else {
            loadBtn.style.opacity = '0.7';
            loadBtn.style.cursor = 'default';
        }

        const renameBtn = document.createElement('button');
        renameBtn.className = 'lib-action-btn';
        renameBtn.textContent = 'Rename';
        renameBtn.title = 'Rename song';
        renameBtn.addEventListener('click', () => {
            const newTitle = prompt('Enter new song title:', song.title);
            if (newTitle && newTitle.trim()) {
                library[id].title = newTitle.trim();
                saveStoredLibrary(library);
                if (id === currentSongId) {
                    currentSongTitle = newTitle.trim();
                }
                populateLibraryDropdown();
                renderLibrarySongList();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'lib-action-btn delete-btn-item';
        deleteBtn.textContent = 'Delete';
        deleteBtn.title = 'Delete song';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete "${song.title}" from your library?`)) {
                delete library[id];
                saveStoredLibrary(library);
                const remainingIds = Object.keys(library);
                if (id === currentSongId) {
                    if (remainingIds.length > 0) {
                        loadSongById(remainingIds[0]);
                    } else {
                        createNewSong('New Song');
                    }
                } else {
                    populateLibraryDropdown();
                    renderLibrarySongList();
                }
            }
        });

        actionsDiv.appendChild(loadBtn);
        actionsDiv.appendChild(renameBtn);
        actionsDiv.appendChild(deleteBtn);

        itemDiv.appendChild(infoDiv);
        itemDiv.appendChild(actionsDiv);
        librarySongList.appendChild(itemDiv);
    });
}

// ===== DOWNLOAD & UPLOAD (JSON IMPORT/EXPORT) & SHARE LINK =====
function encodeSongToUrl(songData) {
    const jsonStr = JSON.stringify(songData);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binaryStr = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        binaryStr += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = btoa(binaryStr);
    return encodeURIComponent(base64);
}

function decodeSongFromUrl(encodedStr) {
    try {
        const base64 = decodeURIComponent(encodedStr);
        const binaryStr = atob(base64);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }
        const jsonStr = new TextDecoder().decode(bytes);
        return JSON.parse(jsonStr);
    } catch (err) {
        console.error('Error decoding song from URL:', err);
        return null;
    }
}

function generateShareLink() {
    saveCurrentSongToLibrary();
    const songData = {
        title: currentSongTitle || 'Song',
        content: generateScoreText()
    };
    const encoded = encodeSongToUrl(songData);
    const baseUrl = window.location.origin + window.location.pathname;
    const fullUrl = `${baseUrl}#song=${encoded}`;

    if (shareLinkInput) {
        shareLinkInput.value = fullUrl;
    }
    if (shareLinkContainer) {
        shareLinkContainer.style.display = 'flex';
    }
    copyShareLink();
}

function copyShareLink() {
    if (!shareLinkInput || !shareLinkInput.value) return;
    navigator.clipboard.writeText(shareLinkInput.value).then(() => {
        if (copyShareLinkBtn) copyShareLinkBtn.classList.add('copied');
        if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copied!';
        if (shareLinkFeedback) shareLinkFeedback.textContent = '✓ Link copied to clipboard!';
        setTimeout(() => {
            if (copyShareLinkBtn) copyShareLinkBtn.classList.remove('copied');
            if (copyShareLinkBtnText) copyShareLinkBtnText.textContent = 'Copy Link';
        }, 2500);
    }).catch(err => {
        shareLinkInput.focus();
        shareLinkInput.select();
        if (shareLinkFeedback) shareLinkFeedback.textContent = 'Select and copy the link above.';
    });
}

function showImportExportModal() {
    saveCurrentSongToLibrary();
    if (uploadStatusMsg) {
        uploadStatusMsg.textContent = '';
        uploadStatusMsg.className = 'upload-status-msg';
    }
    if (shareLinkContainer) {
        shareLinkContainer.style.display = 'none';
    }
    if (shareLinkFeedback) {
        shareLinkFeedback.textContent = '';
    }
    if (exportFilenameInput) {
        const cleanTitle = (currentSongTitle || 'song-library').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        exportFilenameInput.value = cleanTitle ? `${cleanTitle}-backup` : 'song-library-backup';
    }
    renderExportSongList();
    importExportModal.classList.add('show');
}

function hideImportExportModal() {
    importExportModal.classList.remove('show');
    if (jsonFileInput) jsonFileInput.value = '';
    if (shareLinkContainer) shareLinkContainer.style.display = 'none';
}

function renderExportSongList() {
    if (!exportSongList) return;
    const library = getStoredLibrary();
    exportSongList.innerHTML = '';

    const songIds = Object.keys(library);
    if (songIds.length === 0) {
        exportSongList.innerHTML = '<div style="padding: 10px; color: #888; font-size: 13px; text-align: center;">No songs available to export.</div>';
        return;
    }

    songIds.forEach(id => {
        const song = library[id];
        const keyMatch = (song.content || '').match(/^\[Key of (.*?)\]/);
        const songKey = keyMatch ? keyMatch[1] : 'C';

        const label = document.createElement('label');
        label.className = 'export-song-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = id;
        checkbox.checked = true; // Checked by default

        const infoDiv = document.createElement('div');
        infoDiv.className = 'export-song-item-info';

        const badge = document.createElement('span');
        badge.className = 'library-song-badge';
        badge.textContent = songKey;

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
            selectedSongs.push({
                id: songId,
                title: library[songId].title,
                content: library[songId].content
            });
        }
    });

    const exportData = {
        app: "Eagle View Music Song Writer",
        version: 1,
        exportedAt: new Date().toISOString(),
        count: selectedSongs.length,
        songs: selectedSongs
    };

    let filename = exportFilenameInput ? exportFilenameInput.value.trim() : 'song-library-backup';
    if (!filename) filename = 'song-library-backup';
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
                    if (json[k] && typeof json[k] === 'object' && json[k].content) {
                        importedSongs.push(json[k]);
                    }
                });
            }

            if (importedSongs.length === 0) {
                if (uploadStatusMsg) {
                    uploadStatusMsg.textContent = 'No valid songs found in file.';
                    uploadStatusMsg.className = 'upload-status-msg error';
                }
                return;
            }

            const library = getStoredLibrary();
            let addedCount = 0;

            importedSongs.forEach(song => {
                if (song && (song.content || song.title)) {
                    const title = (song.title && song.title.trim()) ? song.title.trim() : 'Imported Song';
                    const content = song.content || `[Key of C]\n[A]\nStart[D1] Here[D1]`;
                    
                    let id = song.id || ('song_' + Date.now() + '_' + Math.floor(Math.random() * 1000));
                    if (library[id]) {
                        id = 'song_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
                    }

                    library[id] = {
                        id: id,
                        title: title,
                        content: content
                    };
                    addedCount++;
                }
            });

            saveStoredLibrary(library);
            populateLibraryDropdown();
            renderExportSongList();

            if (uploadStatusMsg) {
                uploadStatusMsg.textContent = `✓ Successfully imported ${addedCount} song${addedCount > 1 ? 's' : ''}!`;
                uploadStatusMsg.className = 'upload-status-msg';
            }

            jsonFileInput.value = '';
        } catch (err) {
            console.error('Error parsing JSON file:', err);
            if (uploadStatusMsg) {
                uploadStatusMsg.textContent = 'Invalid JSON file format.';
                uploadStatusMsg.className = 'upload-status-msg error';
            }
        }
    };
    reader.readAsText(file);
}

function handleResetAllUserData() {
    const confirmed = confirm("Are you sure you want to delete all user data and restore the app to its default settings? This will delete all custom songs and cannot be undone.");
    if (!confirmed) return;

    try {
        // Clear all storage keys
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVE_SONG_ID_KEY);
        localStorage.removeItem(DONT_ASK_DELETE_SECTION_KEY);

        // Re-create pristine default library without instructions
        const defaultLibrary = {
            'twinkle': { id: 'twinkle', title: 'Twinkle Twinkle', content: PRELOADED_SONGS['twinkle'] || '' },
            'mary': { id: 'mary', title: 'Mary Had a Little Lamb', content: PRELOADED_SONGS['mary'] || '' },
            'starspangledbanner': { id: 'starspangledbanner', title: 'Star Spangled Banner', content: PRELOADED_SONGS['starspangledbanner'] || '' }
        };
        saveStoredLibrary(defaultLibrary);

        // Reset active song ID
        currentSongId = 'twinkle';
        currentSongTitle = 'Twinkle Twinkle';
        localStorage.setItem(ACTIVE_SONG_ID_KEY, 'twinkle');

        // Populate library dropdown and load default song
        populateLibraryDropdown();
        loadSongById('twinkle');

        // Refresh export song list in modal
        renderExportSongList();

        if (resetStatusMsg) {
            resetStatusMsg.textContent = '✓ All user data deleted. Restored to defaults!';
            resetStatusMsg.className = 'reset-status-msg success';
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
            resetStatusMsg.className = 'reset-status-msg error';
        }
    }
}

// ===== ABOUT MODAL FUNCTIONS =====
function showAboutModal() {
    if (aboutModal) aboutModal.classList.add('show');
}

function hideAboutModal() {
    if (aboutModal) aboutModal.classList.remove('show');
}

// ===== SCORE TEXT EDITOR (CONSTRUCTION HAT MENU) =====
function showTextEditorPopup() {
    saveCurrentSongToLibrary();
    const fullText = generateScoreText();
    textEditorText.value = fullText;
    textEditorPopup.classList.add('show');
    setTimeout(() => {
        textEditorText.focus();
        textEditorText.select();
    }, 60);
}

function hideTextEditorPopup() {
    textEditorPopup.classList.remove('show');
    textEditorText.value = '';
}

function handleTextEditorSubmit() {
    const newText = textEditorText.value;
    loadSongFromText(newText);
    saveCurrentSongToLibrary();
    hideTextEditorPopup();
}

// ===== NOTE EDITING FUNCTIONS =====
function changeNote(noteElement, direction = 'up', playSound = true) {
  const currentNoteClass = Array.from(noteElement.classList).find(c => noteOrder.includes(c));
  if (!currentNoteClass) return;
  const currentIndex = noteOrder.indexOf(currentNoteClass);
  let nextIndex = direction === 'up' ? (currentIndex + 1) % noteOrder.length : (currentIndex - 1 + noteOrder.length) % noteOrder.length;
  const nextNote = noteOrder[nextIndex];
  noteElement.classList.remove(currentNoteClass); noteElement.classList.add(nextNote);
  removeAccidentalFromNote(noteElement); 
  resetAccidentalToggleVisuals(); 
  updateNoteDisplay(noteElement, nextNote);

  const harmonyStack = noteElement.closest('.harmony-stack');
  if (harmonyStack) {
    updateHarmonyStackVisuals(harmonyStack);
  }

  const allNotes = Array.from(getAllNotes());
  const idx = allNotes.indexOf(noteElement);
  if (idx >= 0) currentNoteIndex = idx;

  if (playSound && !noteElement.classList.contains('rest-note')) {
    const frequency = getFrequencyForNote(nextNote); 
    if (frequency !== null) playNote(frequency);
  }
  const parentLine = noteElement.closest('.notation-line');
  if (parentLine) updateLineHeight(parentLine);
  saveCurrentSongToLibrary();
}

// ===== HARMONY AUDIO FUNCTION =====
function playHarmony(harmonyStackOrNote) {
  if (!harmonyStackOrNote) return;
  let notes = [];
  if (harmonyStackOrNote.classList.contains('harmony-stack')) {
    notes = Array.from(harmonyStackOrNote.querySelectorAll('.note'));
  } else if (harmonyStackOrNote.classList.contains('note')) {
    const parentStack = harmonyStackOrNote.closest('.harmony-stack');
    if (parentStack) {
      notes = Array.from(parentStack.querySelectorAll('.note'));
    } else {
      notes = [harmonyStackOrNote];
    }
  }
  
  if (notes.length === 0) return;
  
  notes.forEach(noteElement => {
    playNoteWithAccidental(noteElement);
  });
}

// ===== NAVIGATION FUNCTIONS =====
function enterDeselectedState(boundary) {
    const syllables = getAllSyllables();
    syllables.forEach(s => s.classList.remove('highlighted'));
    const notes = getAllNotes();
    notes.forEach(n => n.classList.remove('selected-note'));
    currentNoteIndex = -1;
    currentSyllableIndex = -1;
    currentRowTop = null; // Reset current row position when deselected
    navigationOffEndState = boundary;
    resetAccidentalToggleVisuals();
    resetDeleteConfirmation();
    resetEnterKeyState();
    updateDeleteButtonState();
    updateEnterKeyButtonState();
    updateConnectedBarsControlState();
    updateHarmonyControlState();
    updateRestButtonState();
}

function setNoteAsActive(noteElement, playSound = true) {
  if (!noteElement) return;
  const notes = Array.from(getAllNotes());
  const newIndex = notes.indexOf(noteElement);

  if (newIndex >= 0) {
    const isNewNoteBeingSelected = newIndex !== currentNoteIndex;

    if (isNewNoteBeingSelected || navigationOffEndState !== null) {
      resetAccidentalToggleVisuals();
      resetDeleteConfirmation();
      resetEnterKeyState();
    }

    currentNoteIndex = newIndex;
    navigationOffEndState = null;
    
    notes.forEach(n => n.classList.remove('selected-note'));
    noteElement.classList.add('selected-note');

    const parentSyllable = noteElement.closest('.syllable');
    const syllables = Array.from(getAllSyllables());
    currentSyllableIndex = syllables.indexOf(parentSyllable);

    syllables.forEach(s => s.classList.remove('highlighted'));
    if (parentSyllable) {
      parentSyllable.classList.add('highlighted');
      scrollToSyllable(parentSyllable);
    }

    if (playSound) {
      const harmonyStack = noteElement.closest('.harmony-stack');
      if (harmonyStack && harmonyStack.querySelectorAll('.note').length > 1) {
        playHarmony(harmonyStack);
      } else {
        playNoteWithAccidental(noteElement);
      }
    }
    
    updateDeleteButtonState();
    updateEnterKeyButtonState();
    updateConnectedBarsControlState();
    updateHarmonyControlState();
    updateRestButtonState();
  }
}

function setSyllableAsActive(syllable) {
  if (!syllable) return;
  const notes = syllable.querySelectorAll('.note');
  if (notes.length > 0) {
    setNoteAsActive(notes[0], true);
  }
}

function navigateLeft() {
  const stacks = getAllHarmonyStacks();
  if (stacks.length === 0) return;

  const activeNote = getActiveNote();
  const currentStack = activeNote ? (activeNote.closest('.harmony-stack') || activeNote) : null;
  const currentStackIndex = currentStack ? stacks.indexOf(currentStack) : -1;

  if (currentStackIndex === 0) {
    enterDeselectedState('beforeStart');
  } else if (navigationOffEndState === 'beforeStart') {
    const targetStack = stacks[stacks.length - 1];
    const targetNote = targetStack.querySelector('.note') || targetStack;
    setNoteAsActive(targetNote, true);
  } else {
    let newIndex;
    if (currentStackIndex === -1) {
      newIndex = stacks.length - 1;
    } else {
      newIndex = (currentStackIndex - 1 + stacks.length) % stacks.length;
    }
    const targetStack = stacks[newIndex];
    const targetNote = targetStack.querySelector('.note') || targetStack;
    setNoteAsActive(targetNote, true);
  }
}

function navigateRight() {
  const stacks = getAllHarmonyStacks();
  if (stacks.length === 0) return;

  const activeNote = getActiveNote();
  const currentStack = activeNote ? (activeNote.closest('.harmony-stack') || activeNote) : null;
  const currentStackIndex = currentStack ? stacks.indexOf(currentStack) : -1;

  if (currentStackIndex === stacks.length - 1) {
    enterDeselectedState('afterEnd');
  } else if (navigationOffEndState === 'afterEnd') {
    const targetStack = stacks[0];
    const targetNote = targetStack.querySelector('.note') || targetStack;
    setNoteAsActive(targetNote, true);
  } else {
    let newIndex;
    if (currentStackIndex === -1) {
      newIndex = 0;
    } else {
      newIndex = (currentStackIndex + 1) % stacks.length;
    }
    const targetStack = stacks[newIndex];
    const targetNote = targetStack.querySelector('.note') || targetStack;
    setNoteAsActive(targetNote, true);
  }
}

function editCurrentNote(direction) { 
  if (editModeCheckbox.checked && currentNoteIndex >= 0) {
    const activeNote = getActiveNote();
    if (activeNote) changeNote(activeNote, direction, true);
  }
}

function selectHarmonyNote(direction = 'up') {
  if (currentNoteIndex < 0) return;
  const activeNote = getActiveNote();
  if (!activeNote) return;

  const harmonyStack = activeNote.closest('.harmony-stack');
  if (!harmonyStack) return;

  const notes = Array.from(harmonyStack.querySelectorAll('.note'));
  if (notes.length <= 1) return;

  // Sort notes by pitch index ascending (from lowest pitch/shortest to highest pitch/tallest)
  const sortedAscending = [...notes].sort((a, b) => getNotePitchIndex(a) - getNotePitchIndex(b));
  
  const currentIndex = sortedAscending.indexOf(activeNote);
  if (currentIndex === -1) return;

  let targetIndex;
  if (direction === 'up') {
    // Move up (higher pitch)
    targetIndex = (currentIndex + 1) % sortedAscending.length;
  } else {
    // Move down (lower pitch)
    targetIndex = (currentIndex - 1 + sortedAscending.length) % sortedAscending.length;
  }

  const targetNote = sortedAscending[targetIndex];
  if (targetNote) {
    setNoteAsActive(targetNote, false);
    playNoteWithAccidental(targetNote);
  }
}

// ===== EVENT HANDLERS =====
let noteClickAudioTimer = null;

function handleNoteClick(noteElement, event) {
  if (noteClickAudioTimer) {
    clearTimeout(noteClickAudioTimer);
    noteClickAudioTimer = null;
  }

  // Highlight and select the note immediately (no visual delay)
  setNoteAsActive(noteElement, false);

  if (editModeCheckbox.checked) {
    // In edit mode, delay playback slightly so a double-click cancels it before it sounds
    noteClickAudioTimer = setTimeout(() => {
      const harmonyStack = noteElement.closest('.harmony-stack');
      if (harmonyStack && harmonyStack.querySelectorAll('.note').length > 1) {
        playHarmony(harmonyStack);
      } else {
        playNoteWithAccidental(noteElement);
      }
      noteClickAudioTimer = null;
    }, 190);
  } else {
    // Outside edit mode, play note sound immediately
    const harmonyStack = noteElement.closest('.harmony-stack');
    if (harmonyStack && harmonyStack.querySelectorAll('.note').length > 1) {
      playHarmony(harmonyStack);
    } else {
      playNoteWithAccidental(noteElement);
    }
  }
}

function handleNoteDblClick(noteElement, event) {
  if (!editModeCheckbox.checked) return;

  // Cancel the single click audio so the original pitch NEVER starts
  if (noteClickAudioTimer) {
    clearTimeout(noteClickAudioTimer);
    noteClickAudioTimer = null;
  }

  // Make sure the double-clicked note is selected without playing previous pitch
  setNoteAsActive(noteElement, false);

  const rect = noteElement.getBoundingClientRect();
  const clickY = (event && typeof event.clientY === 'number') ? (event.clientY - rect.top) : (rect.height / 2);
  const isTopHalf = clickY < (rect.height / 2);

  if (isTopHalf) {
    // Double click on top portion: raise up to the next note
    changeNote(noteElement, 'up', true);
  } else {
    // Double click on bottom portion: lower it a step
    changeNote(noteElement, 'down', true);
  }
}

function handleSyllableClick(syllable) { 
  const activeNote = getActiveNote();
  if (activeNote && activeNote.closest('.syllable') === syllable) {
    return;
  }
  const notes = syllable.querySelectorAll('.note');
  if (notes.length > 0) {
    setNoteAsActive(notes[0], true);
  }
}

function handleTextClick(textElement, event) {
  if (editModeCheckbox.checked && !currentlyEditingText) { event.stopPropagation(); startTextEdit(textElement); }
}

function handleDeleteClick() {
  if (!editModeCheckbox.checked || currentSyllableIndex < 0) return;
  
  if (!deleteConfirmationState) {
    deleteConfirmationState = true;
    deleteBtn.classList.add('confirm-delete');
    
    setTimeout(() => {
      if (deleteConfirmationState) {
        resetDeleteConfirmation();
      }
    }, 3000);
  } else {
    deleteSyllable();
  }
}

function handleEnterKeyClick() {
    if (!editModeCheckbox.checked || currentSyllableIndex < 0) return;

    enterKeyState++;

    switch (enterKeyState) {
        case 1: // First click: turn yellow (confirm state)
            enterKeyBtn.classList.add('confirm-enter');
            enterKeyBtn.classList.remove('active-enter');
            break;
        case 2: // Second click: turn green, perform action
            enterKeyBtn.classList.remove('confirm-enter');
            enterKeyBtn.classList.add('active-enter');
            
            const syllables = getAllSyllables();
            const currentSyllable = syllables[currentSyllableIndex];
            const currentLine = currentSyllable.closest('.notation-line');
            
            const syllablesInLine = Array.from(currentLine.querySelectorAll('.syllable'));
            const splitIndex = syllablesInLine.indexOf(currentSyllable);

            if (splitIndex >= 0) {
                const newNotationLine = createNewLineElement(true); // true for section break
                
                const syllablesToMove = syllablesInLine.slice(splitIndex);
                syllablesToMove.forEach(syllableToMove => newNotationLine.appendChild(syllableToMove));
                
                currentLine.after(newNotationLine);
                updateLineBackgrounds();
                updateLineHeight(currentLine);
                updateLineHeight(newNotationLine);
                setSyllableAsActive(newNotationLine.querySelector('.syllable'));
                saveCurrentSongToLibrary();
            }
            break;
    }
    
    if (enterKeyState >= 2) {
        setTimeout(() => resetEnterKeyState(), 500);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  accidentalMode = 'natural'; 
  currentNoteIndex = -1;
  currentSyllableIndex = -1;
  currentRowTop = null;
  navigationOffEndState = null;
  deleteConfirmationState = false;
  enterKeyState = 0;
  chordMode = false;
  selectedChord = null;
  showNames = false;
  
  applyNoteColors(); 
  applyChordColors();
  updateChordBoxLabels();
  updateAddButtonState(); 
  updateDeleteButtonState();
  updateTextEditorButtonState();
  updateEnterKeyButtonState();
  updateConnectedBarsControlState();
  updateHarmonyControlState();
  updateRestButtonState();
  updateTextEditorButtonState();
  updateAbaButtonState();
  updateEditOnlyControlsVisibility();
  updateChordBoxesVisibility();
  syncEditButtonState();
  
  // Set color scheme toggle to active by default
  colorSchemeToggle.classList.add('active');
  updateLineBackgrounds();

  saveLoadMode = false;
  if (saveLoadBtn) saveLoadBtn.classList.remove('active');
  if (libraryControls) libraryControls.classList.remove('show');

  abaMode = false;
  document.body.classList.remove('aba-mode-active');
  if (abaToggleBtn) abaToggleBtn.classList.remove('active');

  controlsMinimized = false;
  if (controlsGroup) controlsGroup.classList.remove('minimized');
  if (minimizeBtn) {
    minimizeBtn.textContent = '▼';
    minimizeBtn.title = 'Hide settings';
  }

  changeKey(currentKey); // Set initial key display and color
  document.body.setAttribute('tabindex', '0');
  
  // Initialize and load library song (check for URL shared song first!)
  const library = getStoredLibrary();
  let songIdToLoad = null;

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

  if (sharedSong && (sharedSong.content || sharedSong.title)) {
    const title = (sharedSong.title && sharedSong.title.trim()) ? sharedSong.title.trim() : 'Shared Song';
    const content = sharedSong.content || '[Key of C]\n[A]\nStart[D1] Here[D1]';
    const sharedId = 'shared_' + Date.now();

    library[sharedId] = {
      id: sharedId,
      title: title,
      content: content
    };
    saveStoredLibrary(library);
    songIdToLoad = sharedId;
    localStorage.setItem(ACTIVE_SONG_ID_KEY, sharedId);

    try {
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    } catch (e) {}
  } else {
    const savedActiveId = localStorage.getItem(ACTIVE_SONG_ID_KEY);
    songIdToLoad = (savedActiveId && library[savedActiveId]) ? savedActiveId : (library['twinkle'] ? 'twinkle' : Object.keys(library)[0]);
  }
  
  if (songIdToLoad) {
    loadSongById(songIdToLoad);
  }
  
  document.querySelectorAll('.syllable').forEach(syllable => addSyllableEventListeners(syllable));
  document.querySelectorAll('.line-label').forEach(label => {
      label.addEventListener('click', e => e.stopPropagation());
  });
  
  document.querySelectorAll('.chord-box').forEach(chordBox => {
    chordBox.addEventListener('click', () => handleChordBoxClick(chordBox));
  });

  if (copyLyricsBtn) {
    copyLyricsBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(textEditorText.value).then(() => {
          copyLyricsBtn.classList.add('copied');
          setTimeout(() => {
              copyLyricsBtn.classList.remove('copied');
          }, 2000);
      }).catch(err => {
          console.error('Failed to copy lyrics: ', err);
      });
    });
  }

  if (copyVisualBtn) {
    copyVisualBtn.addEventListener('click', captureVisual);
  }

  document.querySelectorAll('.notation-line').forEach(line => {
    let reorderGroup = line.querySelector('.section-reorder-group');
    let topActions = line.querySelector('.section-top-actions');
    if (!reorderGroup || !topActions) {
      const controls = createSectionActionsBar(line);
      if (!reorderGroup) line.appendChild(controls.reorderGroup);
      if (!topActions) line.appendChild(controls.topActions);
    }
  });

  document.querySelectorAll('.harmony-stack').forEach(updateHarmonyStackVisuals);
  updateAllLineHeights();
});

// ===== EVENT LISTENERS =====
minimizeBtn.addEventListener('click', toggleMinimize);
nameToggle.addEventListener('click', toggleNames);
chordToggle.addEventListener('click', toggleChords);
colorSchemeToggle.addEventListener('click', toggleColorScheme);
leftArrowBtn.addEventListener('click', navigateLeft);
rightArrowBtn.addEventListener('click', navigateRight);
addBtn.addEventListener('click', addSyllableAfterCurrent);
deleteBtn.addEventListener('click', handleDeleteClick);
enterKeyBtn.addEventListener('click', handleEnterKeyClick);
editToggleBtn.addEventListener('click', toggleEditMode);

if (abaToggleBtn) {
  abaToggleBtn.addEventListener('click', toggleAbaMode);
}

if (saveLoadBtn) {
  saveLoadBtn.addEventListener('click', toggleSaveLoadMode);
}

// Library & New Song Listeners
if (newSongBtn) {
  newSongBtn.addEventListener('click', showNewSongModal);
}

if (librarySelector) {
  librarySelector.addEventListener('change', (event) => {
    const selectedId = event.target.value;
    if (selectedId) {
      loadSongById(selectedId);
    }
  });
}

if (manageLibraryBtn) {
  manageLibraryBtn.addEventListener('click', showManageLibraryModal);
}

if (closeLibraryModalBtn) {
  closeLibraryModalBtn.addEventListener('click', hideManageLibraryModal);
}

if (doneLibraryBtn) {
  doneLibraryBtn.addEventListener('click', hideManageLibraryModal);
}

if (libraryAddNewSongBtn) {
  libraryAddNewSongBtn.addEventListener('click', () => {
    hideManageLibraryModal();
    showNewSongModal();
  });
}

// New Song Modal Listeners
if (cancelNewSongBtn) {
  cancelNewSongBtn.addEventListener('click', hideNewSongModal);
}

if (confirmNewSongBtn) {
  confirmNewSongBtn.addEventListener('click', () => {
    createNewSong(newSongTitleInput.value);
  });
}

if (newSongTitleInput) {
  newSongTitleInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      createNewSong(newSongTitleInput.value);
    } else if (event.key === 'Escape') {
      hideNewSongModal();
    }
  });
}

if (newSongModal) {
  newSongModal.addEventListener('mousedown', (event) => {
    if (event.target === newSongModal) {
      hideNewSongModal();
    }
  });
}

if (manageLibraryModal) {
  manageLibraryModal.addEventListener('mousedown', (event) => {
    if (event.target === manageLibraryModal) {
      hideManageLibraryModal();
    }
  });
}

// Download / Upload Library Listeners
if (importExportBtn) {
  importExportBtn.addEventListener('click', showImportExportModal);
}

if (closeImportExportModalBtn) {
  closeImportExportModalBtn.addEventListener('click', hideImportExportModal);
}

if (closeImportExportBtn) {
  closeImportExportBtn.addEventListener('click', hideImportExportModal);
}

if (uploadJsonBtn && jsonFileInput) {
  uploadJsonBtn.addEventListener('click', () => jsonFileInput.click());
  jsonFileInput.addEventListener('change', handleFileUpload);
}

if (selectAllExportBtn) {
  selectAllExportBtn.addEventListener('click', () => setAllExportCheckboxes(true));
}

if (deselectAllExportBtn) {
  deselectAllExportBtn.addEventListener('click', () => setAllExportCheckboxes(false));
}

if (confirmExportBtn) {
  confirmExportBtn.addEventListener('click', handleExportDownload);
}

if (generateShareLinkBtn) {
  generateShareLinkBtn.addEventListener('click', generateShareLink);
}

if (copyShareLinkBtn) {
  copyShareLinkBtn.addEventListener('click', copyShareLink);
}

if (resetAllDataBtn) {
  resetAllDataBtn.addEventListener('click', handleResetAllUserData);
}

if (importExportModal) {
  importExportModal.addEventListener('mousedown', (event) => {
    if (event.target === importExportModal) {
      hideImportExportModal();
    }
  });
}

// About Modal Listeners
if (appTitleLink) {
  appTitleLink.addEventListener('click', showAboutModal);
}

if (closeAboutModalBtn) {
  closeAboutModalBtn.addEventListener('click', hideAboutModal);
}

if (backToMusicBtn) {
  backToMusicBtn.addEventListener('click', hideAboutModal);
}

if (aboutModal) {
  aboutModal.addEventListener('mousedown', (event) => {
    if (event.target === aboutModal) {
      hideAboutModal();
    }
  });
}

// Score Text Editor Listeners
if (textEditorBtn) {
  textEditorBtn.addEventListener('click', showTextEditorPopup);
}

if (cancelTextEditor) {
  cancelTextEditor.addEventListener('click', hideTextEditorPopup);
}

if (submitTextEditor) {
  submitTextEditor.addEventListener('click', handleTextEditorSubmit);
}

if (textEditorPopup) {
  textEditorPopup.addEventListener('mousedown', (event) => {
    if (event.target === textEditorPopup) {
      hideTextEditorPopup();
    }
  });
}

if (textEditorText) {
  textEditorText.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideTextEditorPopup();
    }
  });
}

// Delete Section Modal Listeners
if (cancelDeleteSectionBtn) {
  cancelDeleteSectionBtn.addEventListener('click', hideDeleteSectionModal);
}

if (confirmDeleteSectionBtn) {
  confirmDeleteSectionBtn.addEventListener('click', () => {
    if (dontAskDeleteSectionCheckbox && dontAskDeleteSectionCheckbox.checked) {
      localStorage.setItem(DONT_ASK_DELETE_SECTION_KEY, 'true');
    }
    if (pendingSectionToDelete) {
      executeDeleteSection(pendingSectionToDelete);
    }
    hideDeleteSectionModal();
  });
}

if (deleteSectionModal) {
  deleteSectionModal.addEventListener('mousedown', (event) => {
    if (event.target === deleteSectionModal) {
      hideDeleteSectionModal();
    }
  });
}

if (restToggleBtn) {
  restToggleBtn.addEventListener('click', toggleRestOnCurrentNote);
}

if (connectedBarsIconWrap) {
  connectedBarsIconWrap.addEventListener('click', duplicateCurrentNote);
}
if (addConnectedNoteBtn) {
  addConnectedNoteBtn.addEventListener('click', duplicateCurrentNote);
}
if (removeConnectedNoteBtn) {
  removeConnectedNoteBtn.addEventListener('click', removeCurrentConnectedNote);
}

if (harmonyBarsIconWrap) {
  harmonyBarsIconWrap.addEventListener('click', addHarmonyNote);
}
if (addHarmonyNoteBtn) {
  addHarmonyNoteBtn.addEventListener('click', addHarmonyNote);
}
if (removeHarmonyNoteBtn) {
  removeHarmonyNoteBtn.addEventListener('click', removeHarmonyNote);
}

keySignatureDisplay.addEventListener('click', () => {
    keySignaturePopup.classList.toggle('show');
    keySignatureDisplay.classList.toggle('active');
});

keySignaturePopup.addEventListener('click', (event) => {
    const keyOption = event.target.closest('.key-option');
    if (keyOption) {
        const newKey = keyOption.getAttribute('data-key');
        changeKey(newKey);
        saveCurrentSongToLibrary();
        keySignaturePopup.classList.remove('show');
        keySignatureDisplay.classList.remove('active');
    }
});

editModeCheckbox.addEventListener('change', () => { 
  syncEditButtonState(); 
  updateEditOnlyControlsVisibility();
  updateAddButtonState(); 
  updateDeleteButtonState();
  updateTextEditorButtonState();
  updateEnterKeyButtonState();
  updateConnectedBarsControlState();
  updateHarmonyControlState();
  updateRestButtonState();
  if (!editModeCheckbox.checked) {
    resetAccidentalToggleVisuals();
    resetDeleteConfirmation();
    resetEnterKeyState();
    hideTextEditorPopup();
    navigationOffEndState = null; 
  }
});

accidentalToggle.addEventListener('click', (event) => {
  const clickedOption = event.target.closest('.accidental-option');
  if (!clickedOption || !editModeCheckbox.checked || currentNoteIndex < 0) {
    return;
  }
  const activeNote = getActiveNote();
  if (!activeNote) return;

  const intendedAccidentalType = clickedOption.getAttribute('data-type'); 
  let actionAllowed = true;
  const noteClass = Array.from(activeNote.classList).find(c => noteOrder.includes(c));
  const baseSolfegeName = noteToSolfege[noteClass]; 
  if (accidentalMode !== intendedAccidentalType) { 
    if (intendedAccidentalType === 'flat') {
      if (baseSolfegeName === 'Do' || baseSolfegeName === 'Fa') {
        actionAllowed = false;
        console.log(`${baseSolfegeName} cannot be flat.`);
      }
    } else if (intendedAccidentalType === 'sharp') {
      if (baseSolfegeName === 'Mi' || baseSolfegeName === 'Ti') {
        actionAllowed = false;
        console.log(`${baseSolfegeName} cannot be sharp.`);
      }
    }
  }
  if (!actionAllowed) {
    return; 
  }
  if (accidentalMode === intendedAccidentalType) { 
    accidentalMode = 'natural'; 
    clickedOption.classList.remove('active'); 
  } else { 
    accidentalMode = intendedAccidentalType; 
    document.querySelectorAll('.accidental-option').forEach(opt => opt.classList.remove('active'));
    clickedOption.classList.add('active'); 
  }
  applyActiveAccidentalToCurrentNote(); 
});

document.addEventListener('click', (event) => {
  if (currentlyEditingText && !event.target.closest('.syllable.editing') && !isAdvancingToNext) finishTextEdit();
  if (!event.target.closest('#deleteBtn') && deleteConfirmationState) {
    resetDeleteConfirmation();
  }
  if (!event.target.closest('#enterKeyBtn')) {
    resetEnterKeyState();
  }
  if (!event.target.closest('.key-signature-group')) {
      keySignaturePopup.classList.remove('show');
      keySignatureDisplay.classList.remove('active');
  }
});

document.addEventListener('keydown', (event) => {
  if (isPopupOpen() || currentlyEditingText || event.target.classList.contains('line-label')) return;
  
  if (event.key >= '1' && event.key <= '9') {
    event.preventDefault();
    selectChordByKeyNumber(event.key);
    return;
  }
  
  if (editModeCheckbox.checked && handleSolfegeKeyInput(event.key)) {
    event.preventDefault();
    return;
  }
  
  switch(event.key) {
    case 'ArrowLeft': 
      event.preventDefault(); 
      navigateLeft(); 
      break;
    case 'ArrowRight': 
      event.preventDefault(); 
      navigateRight(); 
      break;
    case 'ArrowUp': 
      event.preventDefault(); 
      if (event.shiftKey) {
        selectHarmonyNote('up');
      } else {
        editCurrentNote('up'); 
      }
      break;
    case 'ArrowDown': 
      event.preventDefault(); 
      if (event.shiftKey) {
        selectHarmonyNote('down');
      } else {
        editCurrentNote('down'); 
      }
      break;
    case 'Delete':
    case 'Backspace':
      if (editModeCheckbox.checked && currentNoteIndex >= 0) {
        event.preventDefault();
        handleDeleteClick();
      }
      break;
  }
});

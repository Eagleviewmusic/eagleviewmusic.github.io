// Solfege Tower — chord data, copied from Chord Tower (chord voicings, Roman-numeral and letter names).
// Keyed by the shared scale slugs (major, natural-minor, …) so one Key/Scale setting drives both towers.
window.ST = window.ST || {};
ST.chords = (function () {
const baseFrequencies = {
    // Octave 3
    'C3': 130.81, 'B#2': 130.81, 'Dbb3': 130.81,
    'C#3': 138.59, 'Db3': 138.59,
    'D3': 146.83, 'C##3': 146.83, 'Ebb3': 146.83,
    'D#3': 155.56, 'Eb3': 155.56, 'Fb3': 155.56,
    'E3': 164.81, 'Fbb3': 164.81, 'D##3': 164.81,
    'F3': 174.61, 'E#3': 174.61,
    'F#3': 185.00, 'Gb3': 185.00,
    'G3': 196.00, 'F##3': 196.00, 'Abb3': 196.00,
    'G#3': 207.65, 'Ab3': 207.65,
    'A3': 220.00, 'G##3': 220.00, 'Bbb3': 220.00,
    'A#3': 233.08, 'Bb3': 233.08, 'Cb4': 233.08,
    'B3': 246.94, 'Cb4': 246.94, 'A##3': 246.94,
    // Octave 4
    'C4': 261.63, 'B#3': 261.63, 'Dbb4': 261.63,
    'C#4': 277.18, 'Db4': 277.18,
    'D4': 293.66, 'C##4': 293.66, 'Ebb4': 293.66,
    'D#4': 311.13, 'Eb4': 311.13, 'Fb4': 311.13,
    'E4': 329.63, 'Fbb4': 329.63, 'D##4': 329.63,
    'F4': 349.23, 'E#4': 349.23,
    'F#4': 369.99, 'Gb4': 369.99,
    'G4': 392.00, 'F##4': 392.00, 'Abb4': 392.00,
    'G#4': 415.30, 'Ab4': 415.30,
    'A4': 440.00, 'G##4': 440.00, 'Bbb4': 440.00,
    'A#4': 466.16, 'Bb4': 466.16, 'Cb5': 466.16,
    'B4': 493.88, 'Cb5': 493.88, 'A##4': 493.88,
    // Octave 5
    'C5': 523.25, 'B#4': 523.25, 'Dbb5': 523.25,
    'C#5': 554.37, 'Db5': 554.37,
    'D5': 587.33, 'C##5': 587.33, 'Ebb5': 587.33,
    'D#5': 622.25, 'Eb5': 622.25, 'Fb5': 622.25,
    'E5': 659.25, 'Fbb5': 659.25, 'D##5': 659.25,
    'F5': 698.46, 'E#5': 698.46,
    'F#5': 739.99, 'Gb5': 739.99,
    'G5': 783.99, 'F##5': 783.99, 'Abb5': 783.99,
    'G#5': 830.61, 'Ab5': 830.61,
    'A5': 880.00, 'G##5': 880.00, 'Bbb5': 880.00,
    'A#5': 932.33, 'Bb5': 932.33, 'Cb6': 932.33,
    'B5': 987.77, 'Cb6': 987.77, 'A##5': 987.77,
     // Octave 6
    'C6': 1046.50, 'B#5': 1046.50,
    'C#6': 1108.73, 'Db6': 1108.73,
    'D6': 1174.66,
    'D#6': 1244.51, 'Eb6': 1244.51
};

const semitoneShiftMap = {'C':0,'Db':1,'D':2,'Eb':3,'E':4,'F':5,'Gb':6,'G':7,'Ab':8,'A':9,'Bb':10,'B':11};

const chordNamesDefault = {
  "8": "V/V", "9": "V/vi", "u": "IV", "i": "V", "o": "vi", "l": "iii", "k": "ii", "j": "I", "n": "IV/IV"
};
const chordNamesNaturalMinor = {
  "j": "i", "i": "v", "u": "iv", "o": "bVI", "k": "bVII", "l": "bIII", "8": "bII", "9": "IV", "n": "V"
};
const chordNamesHarmonicMinor = {
  "j": "i", "i": "V", "u": "iv", "o": "bVI", "k": "vii°", "l": "bIII+", "8": "bII", "9": "bIII", "n": "IV"
};
const chordNamesMelodicMinor = {
  "j": "i", "i": "V", "u": "IV", "o": "vi°", "k": "ii", "l": "bIII+", "8": "bVI", "9": "bVII", "n": "vii°"
};
const chordNamesDorian = {
  "j": "i", "i": "IV", "u": "bIII", "o": "v", "k": "bVII", "l": "ii", "8": "bVI", "9": "vi°7", "n": "V"
};
const chordNamesPhrygian = {
  "j": "i", "i": "bII", "u": "bIII", "o": "iv", "k": "bVI", "l": "bvii", "8": "bV", "9": "v°", "n": "bVII"
};
const chordNamesLydian = {
  "j": "I", "i": "V", "u": "II", "o": "iii", "k": "vi", "l": "vii", "8": "IV", "9": "#iv°", "n": "ii°"
};
const chordNamesMixolydian = {
  "j": "I", "i": "bVII", "u": "IV", "o": "v", "k": "ii", "l": "vi", "8": "bVI", "9": "bIII", "n": "iii°"
};
const chordNamesLocrian = {
    "j": "i°", "i": "iv", "u": "biii", "o": "bvii", "k": "bII", "l": "bVI", "8": "IV", "9": "bVI+", "n": "bV"
};

const buttonOrder = ["8", "9", "u", "i", "o", "l", "k", "j", "n"];

const chordNamesAltByKey = {
  "C":  ["D",   "E",   "F",  "G",  "Am",  "Em",  "Dm",  "C",  "Bb"],
  "Db": ["Eb",  "F",   "Gb", "Ab", "Bbm", "Fm",  "Ebm", "Db", "Cb"],
  "D":  ["E",   "F#",  "G",  "A",  "Bm",  "F#m", "Em",  "D",  "C"],
  "Eb": ["F",   "G",   "Ab", "Bb", "Cm",  "Gm",  "Fm",  "Eb", "Db"],
  "E":  ["F#",  "G#",  "A",  "B",  "C#m", "G#m", "F#m", "E",  "D"],
  "F":  ["G",   "A",   "Bb", "C",  "Dm",  "Am",  "Gm",  "F",  "Eb"],
  "Gb": ["Ab",  "Bb",  "Cb", "Db", "Ebm", "Bbm", "Abm", "Gb", "Fb"],
  "G":  ["A",   "B",   "C",  "D",  "Em",  "Bm",  "Am",  "G",  "F"],
  "Ab": ["Bb",  "C",   "Db", "Eb", "Fm",  "Cm",  "Bbm", "Ab", "Gb"],
  "A":  ["B",   "C#",  "D",  "E",  "F#m", "C#m", "Bm",  "A",  "G"],
  "Bb": ["C",   "D",   "Eb", "F",  "Gm",  "Dm",  "Cm",  "Bb", "Ab"],
  "B":  ["C#",  "D#",  "E",  "F#", "G#m", "D#m", "C#m", "B",  "A"]
};

const chordNamesAltByNaturalMinorKey = {
    "C":  ["Db", "F",    "Fm", "Gm", "Ab", "Eb", "Bb", "Cm", "G"],
    "Db": ["D",  "F#",   "F#m","G#m","A",  "E",  "B",  "C#m","G#"],
    "D":  ["Eb", "G",    "Gm", "Am", "Bb", "F",  "C",  "Dm", "A"],
    "Eb": ["Fb", "Ab",   "Abm","Bbm","Cb", "Gb", "Db", "Ebm","Bb"],
    "E":  ["F",  "A",    "Am", "Bm", "C",  "G",  "D",  "Em", "B"],
    "F":  ["Gb", "Bb",   "Bbm","Cm", "Db", "Ab", "Eb", "Fm", "C"],
    "Gb": ["G",  "B",    "Bm", "C#m","D",  "A",  "E",  "F#m","C#"],
    "G":  ["Ab", "C",    "Cm", "Dm", "Eb", "Bb", "F",  "Gm", "D"],
    "Ab": ["A",  "C#",   "C#m","D#m","E",  "B",  "F#", "G#m","D#"],
    "A":  ["Bb", "D",    "Dm", "Em", "F",  "C",  "G",  "Am", "E"],
    "Bb": ["Cb", "Eb",   "Ebm","Fm", "Gb", "Db", "Ab", "Bbm","F"],
    "B":  ["C",  "E",    "Em", "F#m","G",  "D",  "A",  "Bm", "F#"]
};

const chordNamesAltByHarmonicMinorKey = {
    "C":  ["Db", "Eb",   "Fm", "G",  "Ab", "Eb+", "B°", "Cm", "F"],
    "Db": ["D",  "E",    "F#m","G#", "A",  "E+",  "B#°","C#m","F#"],
    "D":  ["Eb", "F",    "Gm", "A",  "Bb", "F+",  "C#°","Dm", "G"],
    "Eb": ["Fb", "Gb", "Abm", "Bb", "Cb", "Gb+", "Db°", "Ebm", "Ab"],
    "E":  ["F",  "G",    "Am", "B",  "C",  "G+",  "D#°","Em", "A"],
    "F":  ["Gb", "Ab",   "Bbm","C",  "Db", "Ab+", "E°", "Fm", "Bb"],
    "Gb": ["G",  "A",    "Bm", "C#", "D",  "A+",  "E#°","F#m","B"],
    "G":  ["Ab", "Bb",   "Cm", "D",  "Eb", "Bb+", "F#°","Gm", "C"],
    "Ab": ["A", "B",    "C#m","D#", "E",  "B+", "F𝄪°","G#m","C#"],
    "A":  ["Bb", "C",    "Dm", "E",  "F",  "C+",  "G#°","Am", "D"],
    "Bb": ["Cb", "Db",   "Ebm","F",  "Gb", "Db+", "A°", "Bbm","Eb"],
    "B":  ["C",  "D",    "Em", "F#", "G",  "D+",  "A#°","Bm", "E"]
};

const chordNamesAltByMelodicMinorKey = {
    "C":  ["Ab", "Bb", "F", "G", "A°",  "Eb+", "Dm",  "Cm", "B°"],
    "Db": ["A",  "B",  "F#","G#","A#°", "E+",  "D#m", "C#m","B#°"],
    "D":  ["Bb", "C",  "G", "A", "B°",  "F+",  "Em",  "Dm", "C#°"],
    "Eb": ["Cb", "Db", "Ab", "Bb", "C°", "Gb+", "Fm", "Ebm", "D°"],
    "E":  ["C",  "D",  "A", "B", "C#°", "G+",  "F#m", "Em", "D#°"],
    "F":  ["Db", "Eb", "Bb","C", "D°",  "Ab+", "Gm",  "Fm", "E°"],
    "Gb": ["D",  "E",  "B", "C#","D#°", "A+",  "G#m", "F#m","E#°"],
    "G":  ["Eb", "F",  "C", "D", "E°",  "Bb+", "Am",  "Gm", "F#°"],
    "Ab": ["E",  "F#", "C#","D#","E#°", "B+",  "A#m", "G#m","F𝄪°"],
    "A":  ["F",  "G",  "D", "E", "F#°", "C+",  "Bm",  "Am", "G#°"],
    "Bb": ["Gb", "Ab", "Eb","F", "G°",  "Db+", "Cm",  "Bbm","A°"],
    "B":  ["G",  "A",  "E", "F#","G#°", "D+",  "C#m", "Bm", "A#°"]
};

const chordNamesAltByDorianKey = {
    "C":  ["Ab", "A°7", "Eb", "F",  "Gm", "Dm", "Bb", "Cm", "G"],
    "Db": ["A",  "A#°7","E",  "F#", "G#m","D#m","B",  "C#m","G#"],
    "D":  ["Bb", "B°7", "F",  "G",  "Am", "Em", "C",  "Dm", "A"],
    "Eb": ["Cb", "C°7", "Gb", "Ab", "Bbm","Fm", "Db", "Ebm","Bb"],
    "E":  ["C",  "C#°7","G",  "A",  "Bm", "F#m","D",  "Em", "B"],
    "F":  ["Db", "D°7", "Ab", "Bb", "Cm", "Gm", "Eb", "Fm", "C"],
    "Gb": ["D",  "D#°7","A",  "B",  "C#m","G#m","E",  "F#m","C#"],
    "G":  ["Eb", "E°7", "Bb", "C",  "Dm", "Am", "F",  "Gm", "D"],
    "Ab": ["Fb", "F°7", "Cb", "Db", "Ebm","Bbm","Gb", "Abm","Eb"],
    "A":  ["F",  "F#°7","C",  "D",  "Em", "Bm", "G",  "Am", "E"],
    "Bb": ["Gb", "G°7", "Db", "Eb", "Fm", "Cm", "Ab", "Bbm","F"],
    "B":  ["G",  "G#°7","D",  "E",  "F#m","C#m","A",  "Bm", "F#"]
};

const chordNamesAltByPhrygianKey = {
    "C":  ["Gb", "G°", "Eb", "Db", "Fm", "Bbm", "Ab", "Cm", "Bb"],
    "Db": ["G",  "G#°","E",  "D",  "F#m","Bm", "A",  "C#m","B"],
    "D":  ["Ab", "A°", "F",  "Eb", "Gm", "Cm", "Bb", "Dm", "C"],
    "Eb": ["A",  "A#°","F#", "E",  "G#m","C#m","B",  "D#m","C#"],
    "E":  ["Bb", "B°", "G",  "F",  "Am", "Dm", "C",  "Em", "D"],
    "F":  ["Cb", "C°", "Ab", "Gb", "Bbm","Ebm","Db", "Fm", "Eb"],
    "Gb": ["C",  "C#°","A",  "G",  "Bm", "Em", "D",  "F#m","E"],
    "G":  ["Db", "D°", "Bb", "Ab", "Cm", "Fm", "Eb", "Gm", "F"],
    "Ab": ["D",  "D#°","B",  "A",  "C#m","F#m","E",  "G#m","F#"],
    "A":  ["Eb", "E°", "C",  "Bb", "Dm", "Gm", "F",  "Am", "G"],
    "Bb": ["Fb", "F°", "Db", "Cb", "Ebm","Abm","Gb", "Bbm","Ab"],
    "B":  ["F",  "F#°","D",  "C",  "Em", "Am", "G",  "Bm", "A"]
};

const chordNamesAltByLydianKey = {
    "C":  ["F", "F#°", "D", "G", "Em", "Bm", "Am", "C", "D°"],
    "Db": ["Gb", "G°",  "Eb", "Ab", "Fm", "Cm", "Bbm", "Db", "Eb°"],
    "D":  ["G", "G#°", "E", "A", "F#m", "C#m", "Bm", "D", "E°"],
    "Eb": ["Ab", "A°",  "F", "Bb", "Gm", "Dm", "Cm", "Eb", "F°"],
    "E":  ["A", "A#°", "F#", "B", "G#m", "D#m", "C#m", "E", "F#°"],
    "F":  ["Bb", "B°",  "G", "C", "Am", "Em", "Dm", "F", "G°"],
    "Gb": ["Cb", "C°",  "Ab", "Db", "Bbm", "Fm", "Ebm", "Gb", "Ab°"],
    "G":  ["C", "C#°", "A", "D", "Bm", "F#m", "Em", "G", "A°"],
    "Ab": ["Db", "D°",  "Bb", "Eb", "Cm", "Gm", "Fm", "Ab", "Bb°"],
    "A":  ["D", "D#°", "B", "E", "C#m", "G#m", "F#m", "A", "B°"],
    "Bb": ["Eb", "E°",  "C", "F", "Dm", "Am", "Gm", "Bb", "C°"],
    "B":  ["E", "E#°", "C#", "F#", "D#m", "A#m", "G#m", "B", "C#°"]
};

const chordNamesAltByMixolydianKey = {
    "C":  ["Ab", "Eb", "F", "Bb", "Gm", "Am", "Dm", "C", "E°"],
    "Db": ["A",  "E",  "F#","B",  "G#m","A#m","D#m","C#","E#°"],
    "D":  ["Bb", "F",  "G", "C",  "Am", "Bm", "Em", "D", "F#°"],
    "Eb": ["Cb", "Gb", "Ab","Db", "Bbm","Cm", "Fm", "Eb","G°"],
    "E":  ["C",  "G",  "A", "D",  "Bm", "C#m","F#m","E", "G#°"],
    "F":  ["Db", "Ab", "Bb","Eb", "Cm", "Dm", "Gm", "F", "A°"],
    "Gb": ["D",  "A",  "B", "E",  "C#m","D#m","G#m","F#","A#°"],
    "G":  ["Eb", "Bb", "C", "F",  "Dm", "Em", "Am", "G", "B°"],
    "Ab": ["Fb", "Cb", "Db","Gb", "Ebm","Fm", "Bbm","Ab","C°"],
    "A":  ["F",  "C",  "D", "G",  "Em", "F#m","Bm", "A", "C#°"],
    "Bb": ["Gb", "Db", "Eb","Ab", "Fm", "Gm", "Cm", "Bb","D°"],
    "B":  ["G",  "D",  "E", "A",  "F#m","G#m","C#m","B", "D#°"]
};

const chordNamesAltByLocrianKey = {
    "C":  ["F", "Ab+", "Ebm", "Fm", "Bbm", "Ab", "Db", "C°", "Gb"],
    "Db": ["F#", "A+",  "Em",  "F#m","Bm",  "A",  "D",  "C#°","G"],
    "D":  ["G", "Bb+", "Fm",  "Gm", "Cm",  "Bb", "Eb", "D°", "Ab"],
    "Eb": ["G#", "B+",  "F#m", "G#m","C#m", "B",  "E",  "D#°","A"],
    "E":  ["A", "C+",  "Gm",  "Am", "Dm",  "C",  "F",  "E°", "Bb"],
    "F":  ["Bb", "Db+", "Abm", "Bbm","Ebm", "Db", "Gb", "F°", "Cb"],
    "Gb": ["B", "D+",  "Am",  "Bm", "Em",  "D",  "G",  "F#°","C"],
    "G":  ["C", "Eb+", "Bbm", "Cm", "Fm",  "Eb", "Ab", "G°", "Db"],
    "Ab": ["C#", "E+",  "Bm",  "C#m","F#m", "E",  "A",  "G#°","D"],
    "A":  ["D", "F+",  "Cm",  "Dm", "Gm",  "F",  "Bb", "A°", "Eb"],
    "Bb": ["D#", "F#+", "C#m", "D#m","G#m", "F#", "B",  "A#°","E"],
    "B":  ["E", "G+",  "Dm",  "Em", "Am",  "G",  "C",  "B°", "F"]
};

const positions = {
  '10a':[9,0],'10b':[9,1],'10c':[9,2],'10d':[9,3],'3a':[2,0],'4a':[3,0],'3b':[2,1],'4b':[3,1],'3c':[2,2],'4c':[3,2],'5a':[4,0],'6a':[5,0],'5b':[4,1],'6b':[5,1],'7b':[6,1],'5c':[4,2],'6c':[5,2],'7c':[6,2],'8b':[7,1],'8c':[7,2],'9b':[8,1],'9c':[8,2],'2a':[1,0],'2b':[1,1],'2c':[1,2],'2d':[1,3],'3d':[2,3],'4d':[3,3],'5d':[4,3],'6d':[5,3],'7d':[6,3]
};

const majorChords = [
  { name: 'I', key: 'j', notes: {'C':['C3','G3','E4','C5']}, cells: ['5b','6b','7b','5c','6c','7c'] },
  { name: 'V', key: 'i', notes: {'C':['G3','B4','D5','G4']}, cells: ['3b','4b','3c','4c'] },
  { name: 'IV', key: 'u', notes: {'C':['F3','C4','A4','F4']}, cells: ['3a','4a'] },
  { name: 'vi', key: 'o', notes: {'C':['A3','E4','C5','A4']}, cells: ['4d','3d'] },
  { name: 'ii', key: 'k', notes: {'C':['D3','A3','F4','D4']}, cells: ['6a'] },
  { name: 'iii', key: 'l', notes: {'C':['E3','B3','G4','E4']}, cells: ['5a'] },
  { name: 'V/V', key: '8', notes: {'C':['D4','F#4','A4','D5']}, cells: ['2a', '2b'] },
  { name: 'V/vi', key: '9', notes: {'C':['E4','G#4','B4','E5']}, cells: ['2c','2d'] },
  { name: 'IV/IV', key: 'n', notes: {'C':['Bb3','D4','F4','Bb4']}, cells: ['8b','8c'] },
];

const naturalMinorChords = [
    { name: 'i',    key: 'j', notes: {'C':['C3', 'G3', 'Eb4', 'C5']},    cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'v',    key: 'i', notes: {'C':['G3', 'G4', 'Bb4', 'D5']},    cells: ['3b','4b','3c','4c'] },
    { name: 'iv',   key: 'u', notes: {'C':['F3', 'C4', 'F4', 'Ab4']},   cells: ['3a','4a'] },
    { name: 'bVI',  key: 'o', notes: {'C':['Ab3', 'Eb4', 'Ab4', 'C5']},  cells: ['4d','3d'] },
    { name: 'bVII', key: 'k', notes: {'C':['Bb3', 'D4', 'F4', 'Bb4']},   cells: ['6a'] },
    { name: 'bIII', key: 'l', notes: {'C':['Eb3', 'Bb3', 'Eb4', 'G4']},  cells: ['5a'] },
    { name: 'bII',  key: '8', notes: {'C':['Db3', 'Db4', 'F4', 'Ab4']},   cells: ['2a', '2b'] },
    { name: 'IV',   key: '9', notes: {'C':['F3', 'C4', 'A4', 'F4']},    cells: ['2c','2d'] },
    { name: 'V',    key: 'n', notes: {'C':['G3', 'G4', 'B4', 'D5']},    cells: ['8b','8c'] }
];

const harmonicMinorChords = [
    { name: 'i',     key: 'j', notes: {'C':['C3', 'G3', 'Eb4', 'C5']},    cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'V',     key: 'i', notes: {'C':['G3', 'G4', 'B4', 'D5']},    cells: ['3b','4b','3c','4c'] },
    { name: 'iv',    key: 'u', notes: {'C':['F3', 'C4', 'F4', 'Ab4']},   cells: ['3a','4a'] },
    { name: 'bVI',   key: 'o', notes: {'C':['Ab3', 'Eb4', 'Ab4', 'C5']},  cells: ['4d','3d'] },
    { name: 'vii°',  key: 'k', notes: {'C':['B3', 'D4', 'F4', 'B4']},    cells: ['6a'] },
    { name: 'bIII+', key: 'l', notes: {'C':['Eb3', 'B3', 'Eb4', 'G4']},  cells: ['5a'] },
    { name: 'bII',   key: '8', notes: {'C':['Db3', 'Db4', 'F4', 'Ab4']},   cells: ['2a', '2b'] },
    { name: 'bIII',  key: '9', notes: {'C':['Eb3', 'Bb3', 'Eb4', 'G4']},  cells: ['2c','2d'] },
    { name: 'IV',    key: 'n', notes: {'C':['F3', 'C4', 'F4', 'A4']},    cells: ['8b','8c'] }
];

const melodicMinorChords = [
    { name: 'i',     key: 'j', notes: {'C':['C3', 'G3', 'Eb4', 'C5']},    cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'V',     key: 'i', notes: {'C':['G3', 'G4', 'B4', 'D5']},    cells: ['3b','4b','3c','4c'] },
    { name: 'IV',    key: 'u', notes: {'C':['F3', 'C4', 'F4', 'A4']},    cells: ['3a','4a'] },
    { name: 'vi°',   key: 'o', notes: {'C':['A3', 'Eb4', 'A4', 'C5']},   cells: ['4d','3d'] },
    { name: 'ii',    key: 'k', notes: {'C':['D3', 'D4', 'F4', 'A4']},    cells: ['6a'] },
    { name: 'bIII+', key: 'l', notes: {'C':['Eb3', 'B3', 'Eb4', 'G4']},  cells: ['5a'] },
    { name: 'bVI',   key: '8', notes: {'C':['Ab3', 'Eb4', 'Ab4', 'C5']},  cells: ['2a', '2b'] },
    { name: 'bVII',  key: '9', notes: {'C':['Bb3', 'D4', 'F4', 'Bb4']},   cells: ['2c','2d'] },
    { name: 'vii°',  key: 'n', notes: {'C':['B3', 'D4', 'F4', 'B4']},    cells: ['8b','8c'] }
];

const dorianChords = [
    { name: 'i',     key: 'j', notes: {'C':['C3','G3','Eb4','C5']},    cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'IV',    key: 'i', notes: {'C':['F3','C4','A4','F4']},      cells: ['3b','4b','3c','4c'] },
    { name: 'bIII',  key: 'u', notes: {'C':['Eb3','Bb3','G4','Eb4']},    cells: ['3a','4a'] },
    { name: 'v',     key: 'o', notes: {'C':['G3','D4','Bb4','G4']},      cells: ['4d','3d'] },
    { name: 'bVII',  key: 'k', notes: {'C':['Bb3','F4','D5','Bb4']},     cells: ['6a'] },
    { name: 'ii',    key: 'l', notes: {'C':['D3','A3','F4','D4']},      cells: ['5a'] },
    { name: 'bVI',   key: '8', notes: {'C':['Ab3','Eb4','C5','Ab4']},    cells: ['2a', '2b'] },
    { name: 'vi°7',  key: '9', notes: {'C':['F#3','C4','Eb4','A4']},    cells: ['2c','2d'] },
    { name: 'V',     key: 'n', notes: {'C':['G3','B4','D5','G4']},      cells: ['8b','8c'] }
];

const phrygianChords = [
    { name: 'i',    key: 'j', notes: {'C':['C3', 'G3', 'Eb4', 'C5']},    cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'bII',  key: 'i', notes: {'C':['Db3', 'Ab3', 'F4', 'Db4']},  cells: ['3b','4b','3c','4c'] },
    { name: 'bIII', key: 'u', notes: {'C':['Eb3', 'Bb3', 'G4', 'Eb4']},  cells: ['3a','4a'] },
    { name: 'iv',   key: 'o', notes: {'C':['F3', 'C4', 'Ab4', 'F4']},   cells: ['4d','3d'] },
    { name: 'VI',   key: 'k', notes: {'C':['Ab3', 'Eb4', 'C5', 'Ab4']},  cells: ['6a'] },
    { name: 'bvii', key: 'l', notes: {'C':['Bb3', 'F4', 'Db5', 'Bb4']},  cells: ['5a'] },
    { name: 'bV',   key: '8', notes: {'C':['Gb3', 'Db4', 'Bb4', 'Gb4']},  cells: ['2a', '2b'] },
    { name: 'v°',   key: '9', notes: {'C':['G3', 'Db4', 'Bb4', 'G4']},   cells: ['2c','2d'] },
    { name: 'bVII', key: 'n', notes: {'C':['Bb3', 'D5', 'F4', 'Bb4']},  cells: ['8b','8c'] }
];

const lydianChords = [
    { name: 'I',    key: 'j', notes: {'C': ['C3', 'G3', 'E4', 'C5']},    cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'V',    key: 'i', notes: {'C': ['G3', 'G4', 'B4', 'D5']},    cells: ['3b','4b','3c','4c'] },
    { name: 'II',   key: 'u', notes: {'C': ['D3', 'A4', 'D4', 'F#4']},   cells: ['3a','4a'] },
    { name: 'iii',  key: 'o', notes: {'C': ['E3', 'E4', 'G4', 'B4']},    cells: ['4d','3d'] },
    { name: 'vi',   key: 'k', notes: {'C': ['A3', 'E4', 'A4', 'C5']},    cells: ['6a'] },
    { name: 'vii',  key: 'l', notes: {'C': ['B3', 'F#4', 'B4', 'D5']},   cells: ['5a'] },
    { name: 'IV',   key: '8', notes: {'C': ['F3', 'C4', 'F4', 'A4']},    cells: ['2a', '2b'] },
    { name: '#iv°', key: '9', notes: {'C': ['F#3', 'C4', 'F#4', 'A4']},  cells: ['2c','2d'] },
    { name: 'ii°',  key: 'n', notes: {'C': ['F3', 'D4', 'Ab4', 'D5']},   cells: ['8b','8c'] }
];

const mixolydianChords = [
    { name: 'I',    key: 'j', notes: {'C': ['C3', 'G3', 'E4', 'C5']},       cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'bVII', key: 'i', notes: {'C': ['Bb3', 'F4', 'Bb4', 'D5']},     cells: ['3b','4b','3c','4c'] },
    { name: 'IV',   key: 'u', notes: {'C': ['F3', 'C4', 'F4', 'A4']},       cells: ['3a','4a'] },
    { name: 'v',    key: 'o', notes: {'C': ['G3', 'G4', 'Bb4', 'D5']},     cells: ['4d','3d'] },
    { name: 'ii',   key: 'k', notes: {'C': ['D3', 'D4', 'F4', 'A4']},       cells: ['6a'] },
    { name: 'vi',   key: 'l', notes: {'C': ['A3', 'E4', 'A4', 'C5']},       cells: ['5a'] },
    { name: 'bVI',  key: '8', notes: {'C': ['Ab3', 'Eb4', 'Ab4', 'C5']},   cells: ['2a', '2b'] },
    { name: 'bIII', key: '9', notes: {'C': ['Eb3', 'Eb4', 'G4', 'Bb4']},    cells: ['2c','2d'] },
    { name: 'iii°', key: 'n', notes: {'C': ['E3', 'E4', 'G4', 'Bb4']},      cells: ['8b','8c'] }
];

const locrianChords = [
    { name: 'i°',   key: 'j', notes: {'C': ['C4', 'Gb4', 'Eb4', 'C5']},    cells: ['5b','6b','7b','5c','6c','7c'] },
    { name: 'iv',   key: 'i', notes: {'C': ['F3', 'F4', 'Ab4', 'C5']},     cells: ['3b','4b','3c','4c'] },
    { name: 'biii', key: 'u', notes: {'C': ['Eb3', 'Bb3', 'Eb4', 'Gb4']},  cells: ['3a','4a'] },
    { name: 'bvii', key: 'o', notes: {'C': ['Bb3', 'Db4', 'F4', 'Bb4']},  cells: ['4d','3d'] },
    { name: 'bII',  key: 'k', notes: {'C': ['Db3', 'Db4', 'F4', 'Ab4']},   cells: ['6a'] },
    { name: 'bVI',  key: 'l', notes: {'C': ['Ab3', 'Eb4', 'Ab4', 'C5']},   cells: ['5a'] },
    { name: 'IV',   key: '8', notes: {'C': ['F3', 'F4', 'A4', 'C5']},     cells: ['2a', '2b'] },
    { name: 'bVI+', key: '9', notes: {'C': ['Ab3', 'E4', 'Ab4', 'C5']},    cells: ['2c','2d'] },
    { name: 'bV',   key: 'n', notes: {'C': ['Gb3', 'Db4', 'Gb4', 'Bb4']},  cells: ['8b','8c'] }
];

const sets = {
  'major': majorChords, 'natural-minor': naturalMinorChords, 'harmonic-minor': harmonicMinorChords,
  'melodic-minor': melodicMinorChords, 'dorian': dorianChords, 'phrygian': phrygianChords,
  'lydian': lydianChords, 'mixolydian': mixolydianChords, 'locrian': locrianChords
};
const functionNames = {
  'major': chordNamesDefault, 'natural-minor': chordNamesNaturalMinor, 'harmonic-minor': chordNamesHarmonicMinor,
  'melodic-minor': chordNamesMelodicMinor, 'dorian': chordNamesDorian, 'phrygian': chordNamesPhrygian,
  'lydian': chordNamesLydian, 'mixolydian': chordNamesMixolydian, 'locrian': chordNamesLocrian
};
const letterNames = {
  'major': chordNamesAltByKey, 'natural-minor': chordNamesAltByNaturalMinorKey, 'harmonic-minor': chordNamesAltByHarmonicMinorKey,
  'melodic-minor': chordNamesAltByMelodicMinorKey, 'dorian': chordNamesAltByDorianKey, 'phrygian': chordNamesAltByPhrygianKey,
  'lydian': chordNamesAltByLydianKey, 'mixolydian': chordNamesAltByMixolydianKey, 'locrian': chordNamesAltByLocrianKey
};

return { baseFrequencies, semitoneShiftMap, buttonOrder, positions, sets, functionNames, letterNames };
})();

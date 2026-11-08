// -------- AUDIO --------
// The sounds come from Digital Accordion (was Key Blocks): audio.js is a copy of Digital Accordion/audio.js
// and defines the global `Audio` engine (its presets, reverb and master chain).
// Every key plays on the engine's 'keys' side; this file only tracks which
// voice belongs to which note.
const SOUND_SIDE = 'keys';
let room = 0.35;               // reverb, "Room" in Settings (Key Blocks' default)
const active = new Map();      // note -> Audio voice id
let currentSound = "piano";    // Default sound
let audioWoken = false;

// Start (or resume) audio. Call only from a click, tap or keypress.
function wakeAudio() {
  Audio.ensure();
  if (!audioWoken) {
    audioWoken = true;
    Audio.setReverb(room);
  }
}

const pitchIndex = {
  'C':0, 'C#':1, 'Db':1, 'D':2, 'D#':3, 'Eb':3, 'E':4, 'F':5, 'F#':6, 'Gb':6,
  'G':7, 'G#':8, 'Ab':8, 'A':9, 'A#':10, 'Bb':10, 'B':11
};

function freqOf(note) {
  const octave = parseInt(note.at(-1), 10);
  const pc = note.slice(0, -1);
  const idx = pitchIndex[pc];
  if (idx === undefined) {
    console.error(`Invalid note: ${note}`);
    return 0;
  }
  const noteNum = octave * 12 + idx;
  const A4num = 4 * 12 + 9;
  return 440 * Math.pow(2, (noteNum - A4num) / 12);
}

// THE RECORDING STUDIO: framed by it (?embed=studio), every note played here is
// told to the studio too, which records it onto a track (Recording Studio/README.md,
// "The instrument link"). The studio has the tracks, so this app's own recorder
// is left out (recorder.js).
function joinStudio(app) {
  try {
    if (new URLSearchParams(location.search).get('embed') !== 'studio') return null;
    if (window.parent === window || !window.parent.EVMStudio) return null;
    return window.parent.EVMStudio.join(window, app);
  } catch (e) { return null; }   // framed by another site: not the studio
}
const STUDIO = joinStudio('virtual-keyboard');
if (STUDIO) document.documentElement.classList.add('in-studio');

// Every note played also goes to the recorder (recorder.js), which keeps it
// only while a track is being recorded.
function startNote(finalNote) {
  wakeAudio();
  if (active.has(finalNote)) stopNote(finalNote); // retrigger
  active.set(finalNote, Audio.play(SOUND_SIDE, [freqOf(finalNote)], currentSound));
  if (window.Recorder) Recorder.noteOn(finalNote);
  if (STUDIO) STUDIO.on(finalNote, [freqOf(finalNote)], currentSound, BASE_LEVEL * volume);
}

function stopNote(finalNote) {
  const voice = active.get(finalNote);
  if (voice === undefined) return;
  Audio.stop(voice);
  active.delete(finalNote);
  if (window.Recorder) Recorder.noteOff(finalNote);
  if (STUDIO) STUDIO.off(finalNote);
}

const noteColors = {
  'C': '#FF3B30',
  'D': '#FF9500',
  'E': '#FFCC00',
  'F': '#34C759',
  'G': '#30c0c6',
  'A': '#007AFF',
  'B': '#AF52DE'
};

const noteLightColors = {
  'C': '#ff8780',
  'D': '#ffc266',
  'E': '#ffdd66',
  'F': '#85d99b',
  'G': '#80d8dd',
  'A': '#66b3ff',
  'B': '#d099ea'
};

const blackNoteColors = {
  'C#': '#ff6818', 'Db': '#ff6818',
  'D#': '#ffb000', 'Eb': '#ffb000',
  'F#': '#32c490', 'Gb': '#32c490',
  'G#': '#189de2', 'Ab': '#189de2',
  'A#': '#5866ee', 'Bb': '#5866ee'
};

const blackKeyDisplayMap = {
  'C#': 'C♯<br>D♭', 'Db': 'C♯<br>D♭',
  'D#': 'D♯<br>E♭', 'Eb': 'D♯<br>E♭',
  'F#': 'F♯<br>G♭', 'Gb': 'F♯<br>G♭',
  'G#': 'G♯<br>A♭', 'Ab': 'G♯<br>A♭',
  'A#': 'A♯<br>B♭', 'Bb': 'A♯<br>B♭'
};

// -------- LAYOUT --------

const sharpToFlatMap = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

const flatToSharpMap = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
};

const keyDisplayRanges = {
  'C': { startNote: 'C3', endNoteBase: 'E' },
  'Db': { startNote: 'C3', endNoteBase: 'F' },
  'D': { startNote: 'D3', endNoteBase: 'F#' },
  'Eb': { startNote: 'D3', endNoteBase: 'G' },
  'E': { startNote: 'E3', endNoteBase: 'G#' },
  'F': { startNote: 'F3', endNoteBase: 'A' },
  'Gb': { startNote: 'F3', endNoteBase: 'B' },
  'G': { startNote: 'G2', endNoteBase: 'B' },
  'Ab': { startNote: 'G2', endNoteBase: 'C' },
  'A': { startNote: 'A2', endNoteBase: 'C#' },
  'Bb': { startNote: 'A2', endNoteBase: 'D' },
  'B': { startNote: 'B2', endNoteBase: 'D#' },
}

// -------- SCALES --------
// Every scale comes from Digital Accordion: theory.js is a copy of Digital Accordion/theory.js,
// and Theory.SCALES lists each scale as degrees ('1', 'b3', '#4'...). Key Blocks'
// "Minor" has the same notes as Natural Minor (only its chords differ), so it
// is not listed here.
const HIDDEN_SCALES = new Set(['minor']);

// The name this app gives each pitch: the one the piano keys use (data-note).
const PHYSICAL_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// -------- MY SCALES (built in the Library's scale builder) --------
// Kept on this device as an id map in localStorage. A scale is its degrees
// ('1', 'b3', '#4'…, first note first, one per pitch, 1 to 12 of them) plus
// the first note as it was spelled when it was built ('Eb' or 'D#'), so in
// that key every note is named exactly as chosen; in other keys it is spelled
// the way every scale here is (fewest accidentals, a tie goes to the flat).
// It also keeps its BASE KEY ('C', 'Db'…), only a look: the key the builder's
// octave starts on, furthest to the left. The first note is the chosen key
// furthest to the right of it (or the base itself), so no chosen note lies
// between the two.
const MY_SCALES_KEY = 'virtual_keyboard_scales_v1';
const DEGREE_RE = /^(#{1,2}|b{1,2})?[1-7]$/;
const BLACK_PCS = new Set([1, 3, 6, 8, 10]);
let myScaleById = {};
// A lesson's own scale (lesson.js): used while its lesson is open, never filed
// in My scales, so a lesson always plays the scale it was sent with, even in
// the browser of the teacher who later changed their copy.
let lessonScales = {};
function customScale(scaleId) { return lessonScales[scaleId] || myScaleById[scaleId] || null; }

// The base key a scale gets when none was chosen: its first note, or for a
// black first note the white key just below, unless that key is in the scale.
function defaultBase(tonicPc, chosenPcs) {
  if (!BLACK_PCS.has(tonicPc)) return tonicPc;
  const below = (tonicPc + 11) % 12;
  return chosenPcs.has(below) ? tonicPc : below;
}

function cleanTitle(t) { return typeof t === 'string' ? t.replace(/\s+/g, ' ').trim().slice(0, 40) : ''; }
function cleanScale(s) {
  if (!s || typeof s !== 'object' || typeof s.id !== 'string' || !/^my-[a-z0-9-]{1,40}$/.test(s.id)) return null;
  const given = Array.isArray(s.degrees) ? s.degrees.filter(d => typeof d === 'string' && DEGREE_RE.test(d)) : [];
  const seen = new Set();
  const degrees = [];
  ['1', ...given].forEach(d => {
    const semis = Theory.degreeSemis(d);
    if (!seen.has(semis)) { seen.add(semis); degrees.push(d); }
  });
  degrees.sort((a, b) => Theory.degreeSemis(a) - Theory.degreeSemis(b));
  const tonic = typeof s.tonic === 'string' && /^[A-G][#b]?$/.test(s.tonic) && pitchIndex[s.tonic] !== undefined ? s.tonic : 'C';
  const tonicPc = pitchIndex[tonic];
  const chosen = new Set(degrees.map(d => (tonicPc + Theory.degreeSemis(d)) % 12));
  let base = typeof s.base === 'string' && /^[A-G][#b]?$/.test(s.base) && pitchIndex[s.base] !== undefined ? pitchIndex[s.base] : null;
  const fromBase = pc => (pc - base + 12) % 12;
  if (base === null || [...chosen].some(pc => fromBase(pc) < fromBase(tonicPc))) base = defaultBase(tonicPc, chosen);
  const when = v => (typeof v === 'string' && !isNaN(Date.parse(v))) ? v : new Date().toISOString();
  return { id: s.id, title: cleanTitle(s.title) || 'My scale', degrees, tonic, base: PHYSICAL_NAMES[base],
           createdAt: when(s.createdAt), updatedAt: when(s.updatedAt || s.createdAt), isCustom: true };
}
function loadMyScales() {
  myScaleById = {};
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(MY_SCALES_KEY) || 'null'); } catch (e) {}
  if (stored && typeof stored === 'object') {
    Object.values(stored).forEach(s => { const rec = cleanScale(s); if (rec) myScaleById[rec.id] = rec; });
  }
}
function storeMyScales() {
  try { localStorage.setItem(MY_SCALES_KEY, JSON.stringify(myScaleById)); return true; } catch (e) { return false; }
}
// Oldest first: the order of the scale menu (a new scale lands at the bottom).
function myScalesInOrder() {
  return Object.values(myScaleById).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}
function newScaleId() { return 'my-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6); }
loadMyScales();

// Any scale by id: one of mine, else one of Theory's (Major when unknown).
function scaleOf(scaleId) {
  return customScale(scaleId) || Theory.SCALE_BY_ID[scaleId] || Theory.SCALE_BY_ID.major;
}
function isKnownScale(scaleId) {
  return !!customScale(scaleId) || (!!Theory.SCALE_BY_ID[scaleId] && !HIDDEN_SCALES.has(scaleId));
}
// The first note's spelling ('Eb' or 'D#'): Theory's rule, and for one of my
// scales the same rule on its own degrees, except in the key it was built in.
function spelledTonic(keyIndex, scaleId) {
  const mine = customScale(scaleId);
  if (!mine) return Theory.tonicName(keyIndex, scaleId);
  const flat = Theory.TONIC_FLAT[keyIndex], sharp = Theory.TONIC_SHARP[keyIndex];
  if (flat === sharp) return flat;
  if (pitchIndex[mine.tonic] === keyIndex) return mine.tonic;
  const cost = t => mine.degrees.reduce((n, d) => n + Math.abs(Theory.spellDegree(t, d).alter), 0);
  return cost(sharp) < cost(flat) ? sharp : flat;
}

// Flex rows, bottom row first. Each row walks ten keys up the scale from the
// tonic, an octave above the row below it. A scale of more than ten notes
// would not fit a row, so its rows run on instead: Z X C … / climb from the
// low tonic, then A S D … carry on from there, then Q, then the number row.
const FLEX_ROWS = ['zxcvbnm,./', 'asdfghjkl;', 'qwertyuiop', '1234567890'];
const FLEX_ROW_LEN = 10;
// A scale of one to four notes climbs its rows far past the piano: its notes
// fold down by octaves to stay at or under E8, the highest note any built-in
// scale reaches (so the built-in scales are untouched).
const FLEX_CEILING = 112;

// Shift (or Caps Lock) stretches Flex a little: the Z row plays an octave
// lower, the number row an octave higher; the A and Q rows stay put.
const FLEX_SHIFT = [-1, 0, 0, 1];

let flexLayout = null; // { keyName, long, map: computer key -> { note, octave, row, pos } }
let currentKey = 'C';  // the tonic, by piano-key name: C Db D Eb E F Gb G Ab A Bb B

function scaleSemitones(scaleId) {
  return scaleOf(scaleId).degrees.map(Theory.degreeSemis);
}

function midiOf(note, octave) {
  return 12 * (octave + 1) + pitchIndex[note];
}

function noteFromMidi(midi) {
  return { note: PHYSICAL_NAMES[midi % 12], octave: Math.floor(midi / 12) - 1 };
}

function midiName(midi) {
  const n = noteFromMidi(midi);
  return n.note + n.octave;
}

// A row's tonic: the bottom row starts in octave 3 for C up to F♯/G♭, octave 2 from G up.
function rowTonicMidi(keyName, row) {
  const pc = pitchIndex[keyName];
  return 12 * (pc >= 7 ? 3 : 4) + pc + 12 * row;
}

// The highest piano key on screen (Infinity before the keyboard is drawn).
function topShownMidi() {
  const shown = whiteKeysPhysical.concat(blackKeysPhysical);
  if (!shown.length) return Infinity;
  return Math.max(...shown.map(n => midiOf(n.slice(0, -1), parseInt(n.slice(-1), 10))));
}

// A pitch moved by octaves onto the keys on screen (unchanged when it is on
// screen already, or before the keyboard is drawn).
function foldIntoView(midi) {
  const shown = whiteKeysPhysical.concat(blackKeysPhysical).map(n => midiOf(n.slice(0, -1), parseInt(n.slice(-1), 10)));
  if (!shown.length) return midi;
  const top = Math.max(...shown), bottom = Math.min(...shown);
  while (midi > top) midi -= 12;
  while (midi < bottom) midi += 12;
  return midi;
}

function buildFlexKeymap(keyName, scaleId) {
  const semis = scaleSemitones(scaleId);
  const n = semis.length;
  const long = n > FLEX_ROW_LEN;
  const map = {};
  FLEX_ROWS.forEach((keys, row) => {
    [...keys].forEach((key, pos) => {
      let midi;
      if (long) { // one run up the scale through all four rows
        const step = row * FLEX_ROW_LEN + pos;
        midi = rowTonicMidi(keyName, 0) + 12 * Math.floor(step / n) + semis[step % n];
      } else {
        midi = rowTonicMidi(keyName, row) + 12 * Math.floor(pos / n) + semis[pos % n];
      }
      while (midi > FLEX_CEILING) midi -= 12;
      map[key] = { ...noteFromMidi(midi), row, pos };
    });
  });
  return map;
}

function fillScaleSelect() {
  const select = document.querySelector('.scale-selector');
  const keep = select.value;
  const families = [];
  Theory.SCALES.filter(s => !HIDDEN_SCALES.has(s.id)).forEach(s => {
    let family = families.find(f => f.name === s.family);
    if (!family) families.push(family = { name: s.family, scales: [] });
    family.scales.push(s);
  });
  // My scales come last, oldest first, so a new one is at the very bottom.
  const mine = myScalesInOrder();
  if (mine.length) families.push({ name: 'My scales', scales: mine.map(s => ({ id: s.id, name: s.title })) });
  // an open lesson's scale (the menu only shows while its scale is not locked)
  const lessons = Object.values(lessonScales).filter(s => !myScaleById[s.id]);
  if (lessons.length) families.push({ name: 'From the link', scales: lessons.map(s => ({ id: s.id, name: s.title })) });
  select.innerHTML = '';
  families.forEach(family => {
    const og = document.createElement('optgroup');
    og.label = family.name;
    family.scales.forEach(s => {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name;
      og.appendChild(o);
    });
    select.appendChild(og);
  });
  select.value = keep && isKnownScale(keep) ? keep : 'major';
}

// The scale's notes by piano-key name, for Focus and the in-scale Names.
function getNotesForScale(keyName, scaleId) {
    const tonic = pitchIndex[keyName];
    return new Set(scaleSemitones(scaleId).map(semis => PHYSICAL_NAMES[(tonic + semis) % 12]));
}

const whitesEl = document.getElementById('whites');
const blacksEl = document.getElementById('blacks');
let whiteKeysPhysical = [];
let blackKeysPhysical = [];

// This new structure replaces the old keyNoteMap objects.
// It stores the note name and a base octave for each key, separated by layout.
// This provides the necessary data for the dynamic note calculation logic.
const keyData = {
  // Row 1 (Numbers)
  '1': { green: {}, blue: null },
  '2': { green: {}, blue: { note: 'Db', octave: 4 } },
  '3': { green: {}, blue: { note: 'Eb', octave: 4 } },
  '4': { green: {}, blue: null },
  '5': { green: {}, blue: { note: 'Gb', octave: 4 } },
  '6': { green: {}, blue: { note: 'Ab', octave: 4 } },
  '7': { green: {}, blue: { note: 'Bb', octave: 4 } },
  '8': { green: {}, blue: null },
  '9': { green: {}, blue: { note: 'Db', octave: 5 } },
  '0': { green: {}, blue: { note: 'Eb', octave: 5 } },

  // Row 2 (QWERTY)
  'q': { green: {}, blue: { note: 'C', octave: 4 } },
  'w': { green: {}, blue: { note: 'D', octave: 4 } },
  'e': { green: {}, blue: { note: 'E', octave: 4 } },
  'r': { green: {}, blue: { note: 'F', octave: 4 } },
  't': { green: {}, blue: { note: 'G', octave: 4 } },
  'y': { green: {}, blue: { note: 'A', octave: 4 } },
  'u': { green: {}, blue: { note: 'B', octave: 4 } },
  'i': { green: {}, blue: { note: 'C', octave: 5 } },
  'o': { green: {}, blue: { note: 'D', octave: 5 } },
  'p': { green: {}, blue: { note: 'E', octave: 5 } },

  // Row 3 (ASDF)
  'a': { green: {}, blue: null },
  's': { green: {}, blue: { note: 'Db', octave: 3 } },
  'd': { green: {}, blue: { note: 'Eb', octave: 3 } },
  'f': { green: {}, blue: null },
  'g': { green: {}, blue: { note: 'Gb', octave: 3 } },
  'h': { green: {}, blue: { note: 'Ab', octave: 3 } },
  'j': { green: {}, blue: { note: 'Bb', octave: 3 } },
  'k': { green: {}, blue: null },
  'l': { green: {}, blue: { note: 'Db', octave: 4 } },
  ';': { green: {}, blue: { note: 'Eb', octave: 4 } },

  // Row 4 (ZXCV)
  'z': { green: {}, blue: { note: 'C', octave: 3 } },
  'x': { green: {}, blue: { note: 'D', octave: 3 } },
  'c': { green: {}, blue: { note: 'E', octave: 3 } },
  'v': { green: {}, blue: { note: 'F', octave: 3 } },
  'b': { green: {}, blue: { note: 'G', octave: 3 } },
  'n': { green: {}, blue: { note: 'A', octave: 3 } },
  'm': { green: {}, blue: { note: 'B', octave: 3 } },
  ',': { green: {}, blue: { note: 'C', octave: 4 } },
  '.': { green: {}, blue: { note: 'D', octave: 4 } },
  '/': { green: {}, blue: { note: 'E', octave: 4 } },
};

function updateFlexLayout(keyName, scaleId) {
  flexLayout = { keyName, long: scaleSemitones(scaleId).length > FLEX_ROW_LEN, map: buildFlexKeymap(keyName, scaleId) };
  for (const key in flexLayout.map) {
    if (keyData[key]) keyData[key].green = flexLayout.map[key];
  }
}

fillScaleSelect();
updateFlexLayout('C', 'major');

// Where the Flex piano starts. One of my scales starts on its base key, the
// nearest one at or below the low first note (the Z row's), so C stays on
// the left of a D scale built on a C base; the computer keys still start on
// the first note. A black base starts on the white key just below it.
// Other scales: the usual range for the key.
function flexRange(keyName, scaleId) {
  const mine = customScale(scaleId);
  if (!mine) return keyDisplayRanges[keyName] || keyDisplayRanges['C'];
  const below = (pitchIndex[keyName] - pitchIndex[mine.base] + 12) % 12;
  // (a base on the first note, or the white key under a black one: the usual view)
  if (below === 0 || (below === 1 && BLACK_PCS.has(pitchIndex[keyName]))) return keyDisplayRanges[keyName];
  let startMidi = rowTonicMidi(keyName, 0) - below;
  if (BLACK_PCS.has(startMidi % 12)) startMidi -= 1;
  const start = noteFromMidi(startMidi);
  return { startNote: start.note + start.octave, endNoteBase: PHYSICAL_NAMES[(startMidi + 4) % 12] };
}

const KEYBOARD_GUTTER = 10; // px between the keyboard and each side of the screen

function drawKeyboard(numOctaves = 1) {
  whitesEl.innerHTML = '';
  blacksEl.innerHTML = '';
  whiteKeysPhysical = [];
  blackKeysPhysical = [];
  
  const colorMode = toggleStates.color[currentToggleStates.color];
  const letters = showHotkeys && !keysView; // the Flex button's letters stand in for the names
  const namesMode = letters ? 'deactivated' : toggleStates.names[currentToggleStates.names];
  const layoutMode = currentToggleStates.layout;
  const focusMode = toggleStates.focus[currentToggleStates.focus];

  // Get notes for the current scale, used for both Orange Names and Focus modes.
  const currentKeyName = currentKey;
  const currentScaleName = document.querySelector('.scale-selector').value;
  const notesInCurrentScale = getNotesForScale(currentKeyName, currentScaleName);

  const keyName = currentKey;
  let range;

  if (layoutMode === 't-blue') { // Chromatic mode
    range = { startNote: 'C3', endNoteBase: 'E' };
  } else { // Flex mode
    range = flexRange(keyName, currentScaleName);
  }

  let startNote = range.startNote;
  if (numOctaves === 1) {
    const noteName = startNote.slice(0, -1);
    const octave = parseInt(startNote.slice(-1), 10);
    startNote = `${noteName}${octave + 1}`;
  }
  const startOctave = parseInt(startNote.slice(-1));
  
  const noteOrder = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  const fullKeyboard = [];

  // Generate a few octaves up and down from the start octave to be safe
  for (let o = -2; o < numOctaves + 2; o++) {
      for(const noteName of noteOrder) {
          fullKeyboard.push(noteName + (startOctave + o));
      }
  }

    const startNoteName = startNote.slice(0, -1);
    let endOctave = startOctave + numOctaves;
    if (pitchIndex[range.endNoteBase] < pitchIndex[startNoteName]) {
        endOctave++;
    }
    let endNote = range.endNoteBase + endOctave;
    let endNoteName = endNote.slice(0, -1);
    const endNoteOctave = endNote.slice(-1);
    if (sharpToFlatMap[endNoteName]) {
        endNote = sharpToFlatMap[endNoteName] + endNoteOctave;
    }

    let startNoteForSearch = startNote;
    const startNoteOctave = startNoteForSearch.slice(-1);
    if (sharpToFlatMap[startNoteName]) {
        startNoteForSearch = sharpToFlatMap[startNoteName] + startNoteOctave;
    }

    const startIndex = fullKeyboard.indexOf(startNoteForSearch);
    const endIndex = fullKeyboard.indexOf(endNote);

    if (startIndex === -1 || endIndex === -1) {
      console.error("Could not find start or end notes for keyboard range.", `start: ${startNoteForSearch}`, `end: ${endNote}`);
      return;
    }

    const finalKeyboard = fullKeyboard.slice(startIndex, endIndex + 1);
    
    finalKeyboard.forEach(note => {
        if (note.includes('#') || note.includes('b')) {
            blackKeysPhysical.push(note);
        } else {
            whiteKeysPhysical.push(note);
        }
    });
  const hotkeys = letters ? hotkeyLetters() : {}; // (needs the keys on screen, just listed)

  const blackBetweenIndex = {};
  blackKeysPhysical.forEach(note => {
      const octave = parseInt(note.at(-1), 10);
      const pc = note.slice(0, -1);
      let referenceNote;
      switch(pc) {
          case 'Db': referenceNote = 'C' + octave; break;
          case 'Eb': referenceNote = 'D' + octave; break;
          case 'Gb': referenceNote = 'F' + octave; break;
          case 'Ab': referenceNote = 'G' + octave; break;
          case 'Bb': referenceNote = 'A' + octave; break;
      }
      const idx = whiteKeysPhysical.indexOf(referenceNote);
      if (idx !== -1) blackBetweenIndex[note] = idx;
  });

  const pianoContainer = document.querySelector('.piano-container');
  const totalWhiteKeys = whiteKeysPhysical.length;
  // Keep a small gap between the keyboard and the edges of the screen
  const containerWidth = Math.max(0, pianoContainer.clientWidth - 2 * KEYBOARD_GUTTER);
  // The keys sit inside the keyboard's padding (.whites/.blacks are inset by it)
  const kbPadding = 2 * parseFloat(getComputedStyle(document.getElementById('kb')).paddingLeft);

  // Set the ideal key and keyboard width
  const idealKeyWidth = 60;
  const idealKeyboardWidth = totalWhiteKeys * idealKeyWidth + kbPadding;

  // The final keyboard width is the smaller of the ideal width and the container width
  const finalKeyboardWidth = Math.min(idealKeyboardWidth, containerWidth);
  
  // The final key width is what fits inside the keyboard's padding
  const whiteKeyWidth = Math.max(0, finalKeyboardWidth - kbPadding) / totalWhiteKeys;
  let blackKeyWidth = whiteKeyWidth * 0.6;

  document.documentElement.style.setProperty('--white-w', `${whiteKeyWidth}px`);
  document.documentElement.style.setProperty('--black-w', `${blackKeyWidth}px`);
  document.getElementById('kb').style.width = `${finalKeyboardWidth}px`;

  whiteKeysPhysical.forEach((note, i) => {
      const div = document.createElement('div');
      div.className = 'white-key';
      div.style.left = `${i * whiteKeyWidth}px`;
      div.dataset.note = note;
      const noteName = note.slice(0, -1);

      let isNoteInScale = notesInCurrentScale.has(noteName);
      let isDisabled = focusMode === 't-purple' && !isNoteInScale;

      if (isDisabled) {
        div.classList.add('key-disabled');
      }

      if (colorMode === 't-green') {
        const color = noteColors[noteName] || '#fff';
        if (color !== '#fff') {
          div.style.background = `linear-gradient(to bottom, ${color} 50%, #fff 50%)`;
        } else {
          div.style.backgroundColor = '#fff';
        }
      } else {
        div.style.backgroundColor = '#fff';
      }
      
      let showLabel = false;
      if (namesMode === 't-orange') {
        showLabel = notesInCurrentScale && notesInCurrentScale.has(noteName);
      } else if (namesMode === 't-yellow' || namesMode === 't-green') {
        showLabel = true;
      }

      if (showLabel) {
        const label = document.createElement('div');
        label.className = 'key-label';
        label.textContent = noteName;
        div.appendChild(label);
      }
      if (hotkeys[note]) div.appendChild(hotkeyLabel(hotkeys[note]));

      whitesEl.appendChild(div);
      if (!isDisabled) {
        div.addEventListener('mousedown', () => onPointerDown(note));
        div.addEventListener('mouseup', () => onPointerUp(note));
        // mouseleave listener removed to allow for dragging
        div.addEventListener('touchstart', (ev) => { ev.preventDefault(); onPointerDown(note); }, {passive:false});
        div.addEventListener('touchend', () => onPointerUp(note));
      }
  });

  blackKeysPhysical.forEach((note) => {
      const div = document.createElement('div');
      div.className = 'black-key';
      const leftIndex = blackBetweenIndex[note];
      if (leftIndex === undefined) return;
      const x = (leftIndex + 1) * whiteKeyWidth - (blackKeyWidth / 2);
      div.style.left = `${x}px`;
      div.dataset.note = note;
      const pc = note.slice(0, -1);

      const sharpEquivalent = flatToSharpMap[pc];
      const isNoteInScale = notesInCurrentScale.has(pc) || (sharpEquivalent && notesInCurrentScale.has(sharpEquivalent));
      let isDisabled = focusMode === 't-purple' && !isNoteInScale;

      if (isDisabled) {
        div.classList.add('key-disabled');
      }

      let showLabel = false;
      if (namesMode === 't-orange') {
        showLabel = notesInCurrentScale && notesInCurrentScale.has(pc);
      } else if (namesMode === 't-blue' || namesMode === 't-green') {
        showLabel = true;
      }

      if (showLabel) {
        const label = document.createElement('div');
        label.className = 'key-label';
        // One of my scales names its black keys the way they were chosen (sharp
        // or flat); every other black key shows both names.
        if (customScale(currentScaleName) && isNoteInScale) {
          const name = spellMidi(midiOf(pc, parseInt(note.slice(-1), 10)), currentKeyName, currentScaleName);
          label.textContent = name.letter + name.accidental;
        } else {
          label.innerHTML = blackKeyDisplayMap[pc] || '';
        }
        div.appendChild(label);
      }
      if (hotkeys[note]) div.appendChild(hotkeyLabel(hotkeys[note]));

      blacksEl.appendChild(div);
      if (!isDisabled) {
        div.addEventListener('mousedown', () => onPointerDown(note));
        div.addEventListener('mouseup', () => onPointerUp(note));
        // mouseleave listener removed to allow for dragging
        div.addEventListener('touchstart', (ev) => { ev.preventDefault(); onPointerDown(note); }, {passive:false});
        div.addEventListener('touchend', () => onPointerUp(note));
      }
  });

  renderQwerty();
}

// -------- INTERACTION --------
let isDragging = false;
let lastDraggedNote = null;

function pressVisual(finalNote, pressed) {
  const el = document.querySelector(`[data-note="${finalNote}"]`);
  if (!el) return;

  el.classList.toggle('pressed', pressed);

  const noteName = finalNote.slice(0, -1);
  const colorMode = toggleStates.color[currentToggleStates.color];
  const isWhiteKey = el.classList.contains('white-key');

  if (isWhiteKey) {
    // === WHITE KEY LOGIC ===
    if (pressed) {
      if (colorMode === 'deactivated') {
        el.style.backgroundColor = '#d3d3d3'; // Turn grey when played
      } else if (colorMode === 't-green') {
        el.style.background = noteColors[noteName] || '#fff'; // Brighter version
      } else if (colorMode === 't-blue') {
        el.style.backgroundColor = noteColors[noteName] || '#fff'; // Assigned color
      }
    } else { // Released
      if (colorMode === 'deactivated') {
        el.style.backgroundColor = '#fff'; // Back to white
      } else if (colorMode === 't-green') {
        const color = noteColors[noteName] || '#fff';
        if (color !== '#fff') {
          el.style.background = `linear-gradient(to bottom, ${color} 50%, #fff 50%)`;
        } else {
          el.style.backgroundColor = '#fff';
        }
      } else if (colorMode === 't-blue') {
        el.style.backgroundColor = '#fff'; // Back to white
      }
    }
  } else {
    // === BLACK KEY LOGIC ===
    if (pressed) {
      if (colorMode === 'deactivated') {
        el.style.background = '#d3d3d3'; // Turn grey when played
      } else if (colorMode === 't-green' || colorMode === 't-blue') {
        el.style.background = blackNoteColors[noteName] || '#333'; // Assigned color
      }
    } else { // Released
      // In all modes, return to black.
      el.style.background = ''; // Reset to CSS gradient
    }
  }
}

const downKeys = new Map();

function getActiveOctaveCount() {
  return currentOctaves;
}

function getNoteMapping(key, layout, octaves, isShifted) {
  const keyInfo = keyData[key];
  if (!keyInfo) return null;

  const layoutKeyData = (layout === 't-green') ? keyInfo.green : keyInfo.blue;
  if (!layoutKeyData || !layoutKeyData.note) return null;

  const { note, octave } = layoutKeyData;

  // Check for Focus mode
  const focusMode = toggleStates.focus[currentToggleStates.focus];
  if (focusMode === 't-purple') {
    const currentKeyName = currentKey;
    const currentScaleName = document.querySelector('.scale-selector').value;
    const notesInCurrentScale = getNotesForScale(currentKeyName, currentScaleName);
    
    let noteToCheck = note;
    const flatEquivalent = sharpToFlatMap[noteToCheck];
    if (flatEquivalent) {
        noteToCheck = flatEquivalent;
    }

    if (!notesInCurrentScale.has(noteToCheck)) {
      return null; // Key is not in scale, disable binding
    }
  }

  let noteToPlay = `${note}${octave}`;
  let noteToLightUp = noteToPlay;

  function normalizeNoteForDisplay(noteStr) {
      const noteName = noteStr.slice(0, -1);
      const octaveNum = noteStr.slice(-1);
      const flatName = sharpToFlatMap[noteName];
      return flatName ? `${flatName}${octaveNum}` : noteStr;
  }

  if (layout === 't-green') {
    // With three or four octaves showing, each key lights the note it plays.
    // With one or two, the rows share the keys on screen. One octave: every row
    // lights what the a-row plays in that position. Two: the z and q rows light
    // the z-row's note, the a and number rows the a-row's.
    const { row, pos } = layoutKeyData;
    const shift = isShifted ? FLEX_SHIFT[row] : 0;
    if (shift) noteToPlay = `${note}${octave + shift}`;
    if (flexLayout.long) {
      // A scale of more than ten notes runs on from row to row, so the rows no
      // longer repeat each other: each key lights the note it plays, moved by
      // octaves onto the keys on screen.
      const lit = noteFromMidi(foldIntoView(midiOf(note, octave) + 12 * shift));
      return { noteToPlay, noteToLightUp: `${lit.note}${lit.octave}` };
    }
    const refRow = octaves === 1 ? 1 : octaves === 2 ? row % 2 : row;
    const ref = flexLayout.map[FLEX_ROWS[refRow][pos]];
    let midi = midiOf(ref.note, ref.octave);
    // A scale with fewer than seven notes climbs past the top of the keyboard
    // within ten keys: those notes light lower down. (With three octaves the
    // number row starts at the top edge and lights only what is on screen.)
    if (refRow < Math.max(octaves, 2)) {
      const top = topShownMidi();
      while (midi > top) midi -= 12;
    }
    // With three or four octaves a shifted note lights where it sounds, when
    // that key is on screen; otherwise its usual key lights.
    if (shift && octaves >= 3 && midi + 12 * shift <= topShownMidi() &&
        whiteKeysPhysical.concat(blackKeysPhysical).includes(midiName(midi + 12 * shift))) {
      midi += 12 * shift;
    }
    const lit = noteFromMidi(midi);
    noteToLightUp = `${lit.note}${lit.octave}`;
  } else {
    // --- Chromatic Mode Note Logic ---
    if (isShifted) {
      noteToPlay = `${note}${octave + 2}`;
    }

    if (octaves === 1) {
      const noteName = noteToPlay.slice(0, -1);
      // Default to the left-side block (octave 4)
      noteToLightUp = `${noteName}4`;
      // Override for right-side keys that are C, D, or E
      if (',./?l;:iop90)'.includes(key) && ['C', 'D', 'E', 'Db', 'Eb'].includes(noteName)) {
        noteToLightUp = `${noteName}5`;
      }
    } else if (octaves === 2) {
      noteToLightUp = `${note}${octave}`; // Default: light up the unshifted key
      // Special overrides for lighting:
      if (key === 'z') noteToLightUp = 'C3';
      if (key === 'x') noteToLightUp = 'D3';
      if (key === 'q' || key === ',') noteToLightUp = 'C4';
      if (key === 'i') noteToLightUp = 'C5';
    } else { // Settings 3 & 4
      noteToLightUp = noteToPlay;
    }
  }
  
  return { noteToPlay, noteToLightUp: normalizeNoteForDisplay(noteToLightUp) };
}

const shiftKeyMap = {
    '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    '<': ',', '>': '.', '?': '/', ':': ';'
};

document.addEventListener('keydown', (e) => {
  if (e.repeat || downKeys.has(e.code)) return;
  // typing a name (the recorder's) or a number plays nothing
  if (e.target.closest && e.target.closest('input[type="text"], input[type="number"], textarea')) return;

  const layoutMode = currentToggleStates.layout;
  const octaves = getActiveOctaveCount();
  const isShifted = e.shiftKey || e.getModifierState("CapsLock");
  
  let key = e.key;
  if (e.shiftKey && shiftKeyMap[key]) {
      key = shiftKeyMap[key];
  }
  key = key.toLowerCase();

  const mapping = getNoteMapping(key, layoutMode, octaves, isShifted);
  if (!mapping) return;
  
  pressVisual(mapping.noteToLightUp, true);
  startNote(mapping.noteToPlay);
  capVisual(key, true);
  
  downKeys.set(e.code, { ...mapping, key });
});

document.addEventListener('keyup', (e) => {
  const mapping = downKeys.get(e.code);
  if (!mapping) return;
  downKeys.delete(e.code);

  pressVisual(mapping.noteToLightUp, false);
  stopNote(mapping.noteToPlay);
  capVisual(mapping.key, false);
});

let capsLock = false;
window.addEventListener('keydown', e => { if (e.key === 'CapsLock') capsLock = !capsLock; });

function onPointerDown(note) {
  pressVisual(note, true);
  startNote(note);
  isDragging = true;
  lastDraggedNote = note;
}

function onPointerUp(note) {
  pressVisual(note, false);
  stopNote(note);
}

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (!elem) return;
    
    const isKey = elem.classList.contains('white-key') || elem.classList.contains('black-key');
    if (!isKey) return;

    const note = elem.dataset.note;
    if (note && note !== lastDraggedNote) {
        if (lastDraggedNote) {
            stopNote(lastDraggedNote);
            pressVisual(lastDraggedNote, false);
        }
        onPointerDown(note);
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        if (lastDraggedNote) {
            stopNote(lastDraggedNote);
            pressVisual(lastDraggedNote, false);
            lastDraggedNote = null;
        }
        isDragging = false;
    }
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    try { e.preventDefault(); } catch (e) {}

    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!elem) return;
    
    const isKey = elem.classList.contains('white-key') || elem.classList.contains('black-key');
    if (!isKey) return;

    const note = elem.dataset.note;
    if (note && note !== lastDraggedNote) {
        if (lastDraggedNote) {
            stopNote(lastDraggedNote);
            pressVisual(lastDraggedNote, false);
        }
        onPointerDown(note);
    }
}, { passive: false });

document.addEventListener('touchend', () => {
    if (isDragging) {
        if (lastDraggedNote) {
            stopNote(lastDraggedNote);
            pressVisual(lastDraggedNote, false);
            lastDraggedNote = null;
        }
        isDragging = false;
    }
});

// -------- SOUND --------
const soundSelect = document.getElementById('sound-select');

// Key Blocks' sounds, grouped for the menu. Anything Key Blocks adds later
// lands in "More sounds" until it is given a group here.
const soundGroups = [
  { label: 'Keyboards', ids: ['piano', 'epiano', 'organ'] },
  { label: 'Mallets & plucks', ids: ['marimba', 'bell', 'pluck'] },
  { label: 'Long tones', ids: ['pad', 'strings', 'voice'] },
  { label: 'Simple waves', ids: ['sine', 'triangle', 'square', 'sawtooth'] },
];

function fillSoundSelect() {
  const grouped = new Set(soundGroups.flatMap(g => g.ids));
  const extra = Audio.PRESET_ORDER.filter(id => !grouped.has(id));
  const groups = extra.length ? [...soundGroups, { label: 'More sounds', ids: extra }] : soundGroups;
  soundSelect.innerHTML = '';
  groups.forEach(g => {
    const og = document.createElement('optgroup');
    og.label = g.label;
    g.ids.filter(id => Audio.PRESETS[id]).forEach(id => {
      const o = document.createElement('option');
      o.value = id;
      o.textContent = Audio.PRESETS[id].name;
      og.appendChild(o);
    });
    soundSelect.appendChild(og);
  });
  soundSelect.value = currentSound;
}

// Play the key's tonic briefly so the new sound can be heard, as Key Blocks does.
function previewSound() {
  wakeAudio();
  const voice = Audio.play(SOUND_SIDE, [freqOf(currentKey + '4')], currentSound);
  setTimeout(() => Audio.stop(voice), 450);
}

soundSelect.addEventListener('change', (e) => {
  currentSound = e.target.value;
  previewSound();
  e.target.blur(); // hand the computer keyboard back to the piano
});

// -------- DISPLAY STATE --------
// What drawKeyboard and getNoteMapping read. Settings and the quick row set these.
const toggleStates = {
  color: ['deactivated', 't-green', 't-blue'],
  names: ['deactivated', 't-orange', 't-yellow', 't-green', 't-blue'],
  focus: ['deactivated', 't-purple'],
};

const currentToggleStates = {
  color: 1,
  names: 0,
  layout: 't-green', // This is for Flex/Chromatic
  focus: 0, // This is for the new Focus toggle
};
// The Flex button's lit step: the computer keys' letters on the piano keys,
// in place of the Key Names. Not kept: a look, then off again.
let showHotkeys = false;

// Which letter goes on which piano key: Flex, the A row's (a s d … climbing
// the scale from the tonic); Chromatic, the Z row's white keys and the S
// row's black ones. Each on the key it lights, one letter a key.
const HOTKEY_ROWS = { 't-green': ['asdfghjkl;'], 't-blue': ['zxcvbnm,./', 'sdfghjkl;'] };
function hotkeyLetters() {
  const layout = currentToggleStates.layout;
  const letters = {};
  // A scale of more than ten notes starts on Z and runs on into the A row.
  const rows = layout === 't-green' && flexLayout.long ? ['zxcvbnm,./', 'asdfghjkl;'] : HOTKEY_ROWS[layout];
  rows.forEach(row => [...row].forEach(key => {
    const m = getNoteMapping(key, layout, currentOctaves, false);
    if (m && !letters[m.noteToLightUp]) letters[m.noteToLightUp] = key.toUpperCase();
  }));
  return letters;
}
function hotkeyLabel(letter) {
  const label = document.createElement('div');
  label.className = 'hotkey-label';
  label.textContent = letter;
  return label;
}

// -------- KEYS VIEW (the computer keyboard, after Key Blocks) --------
const QWERTY_ROWS = ['1234567890', 'qwertyuiop', 'asdfghjkl;', 'zxcvbnm,./']; // top row first
const qwertyView = document.getElementById('qwerty-view');
const qwertyEl = document.getElementById('qwerty');
const qwertyLegend = document.getElementById('qwerty-legend');
const qwertyMore = document.getElementById('qwerty-more');
let qwertyHelpOpen = false;
qwertyMore.addEventListener('click', () => {
  qwertyHelpOpen = !qwertyHelpOpen;
  qwertyLegend.hidden = !qwertyHelpOpen;
  qwertyMore.textContent = qwertyHelpOpen ? 'Collapse' : 'Learn more';
  qwertyMore.setAttribute('aria-expanded', String(qwertyHelpOpen));
});
let keysView = false;
let shiftOn = false;        // Shift or Caps Lock: Chromatic plays two octaves up
const heldCaps = new Set(); // computer keys held down right now

// How Key Blocks would write a pitch in the chosen key and scale: scale notes
// take the scale's spelling, the others the usual ♭2 ♭3 ♯4 ♭6 ♭7. A note
// outside the scale that would come out as a double accidental, or as an
// accidental on a white key, takes its piano key's plain name instead
// (D, not E𝄫, in D♭ major), sharp or flat by the direction of the key.
// One of my scales, moved to another key, never takes a double accidental
// either: its in-scale notes then take the piano key's name the same way.
function spellMidi(midi, keyName, scaleId) {
  const keyIndex = pitchIndex[keyName];
  const scale = scaleOf(scaleId);
  const tonic = spelledTonic(keyIndex, scale.id);
  const degree = Theory.semisToDegree(midi - keyIndex, scale.degrees);
  let { letter, alter } = Theory.spellDegree(tonic, degree);
  const plain = PHYSICAL_NAMES[midi % 12];
  const inScale = scale.degrees.includes(degree);
  if ((!inScale && alter !== 0 && (Math.abs(alter) > 1 || plain.length === 1)) ||
      (inScale && scale.isCustom && Math.abs(alter) > 1)) {
    const name = plain.length > 1 && tonic.includes('#') ? flatToSharpMap[plain] : plain;
    letter = name[0];
    alter = name.length === 1 ? 0 : name[1] === '#' ? 1 : -1;
  }
  return {
    letter,
    accidental: Theory.accUnicode(alter),
    octave: Math.floor((midi - alter) / 12) - 1 // C♭5 sounds as B4
  };
}

// White text where it reads clearly on the note colour (4:1), otherwise near-black.
function inkFor(hex) {
  const channel = i => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  return 1.05 / (lum + 0.05) >= 4 ? '#fff' : '#1c1c1e';
}

function capVisual(key, on) {
  if (on) heldCaps.add(key); else heldCaps.delete(key);
  const cap = qwertyEl.querySelector(`.kcap[data-key="${key}"]`);
  if (cap) cap.classList.toggle('is-on', on);
}

// A key cap plays like its computer key.
function attachCapHandlers(cap, key) {
  cap.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    e.preventDefault();
    const mapping = getNoteMapping(key, currentToggleStates.layout, getActiveOctaveCount(), shiftOn);
    if (!mapping) return;
    pressVisual(mapping.noteToLightUp, true);
    startNote(mapping.noteToPlay);
    capVisual(key, true);
    const release = (ev) => {
      if (ev.pointerId !== e.pointerId) return;
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      pressVisual(mapping.noteToLightUp, false);
      stopNote(mapping.noteToPlay);
      capVisual(key, false);
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  });
  cap.addEventListener('contextmenu', (e) => e.preventDefault());
}

function renderQwerty() {
  if (!keysView) return;
  const layoutMode = currentToggleStates.layout;
  const chromatic = layoutMode === 't-blue';
  const octaves = getActiveOctaveCount();
  const keyName = currentKey;
  const scaleId = scaleSelector.value;
  const scaleNotes = getNotesForScale(keyName, scaleId);
  let outside = 0, off = 0;

  qwertyEl.innerHTML = '';
  QWERTY_ROWS.forEach((row, r) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'qwerty-row';
    rowEl.dataset.row = r;
    [...row].forEach(key => {
      const cap = document.createElement('button');
      cap.type = 'button';
      cap.className = 'kcap';
      cap.dataset.key = key;
      const kc = document.createElement('span');
      kc.className = 'kc';
      kc.textContent = key;
      cap.appendChild(kc);

      const info = chromatic ? keyData[key].blue : keyData[key].green;
      if (info && info.note) {
        const shifted = !shiftOn ? 0 : chromatic ? 2 : FLEX_SHIFT[info.row];
        const midi = midiOf(info.note, info.octave + shifted);
        const physical = PHYSICAL_NAMES[midi % 12];
        const color = noteColors[physical] || blackNoteColors[physical];
        const name = spellMidi(midi, keyName, scaleId);

        const note = document.createElement('span');
        note.className = 'note';
        note.append(name.letter);
        if (name.accidental) {
          const acc = document.createElement('span');
          acc.className = 'acc';
          acc.textContent = name.accidental;
          note.appendChild(acc);
        }
        const oct = document.createElement('span');
        oct.className = 'oct';
        oct.textContent = name.octave;
        note.appendChild(oct);
        cap.appendChild(note);

        const ink = inkFor(color);
        cap.classList.add('mapped', ink === '#fff' ? 'ink-light' : 'ink-dark');
        cap.style.setProperty('--c', color);
        cap.style.setProperty('--ink', ink);
        if (!scaleNotes.has(physical)) { cap.classList.add('outside'); outside++; }
        const playable = !!getNoteMapping(key, layoutMode, octaves, shiftOn);
        if (!playable) { cap.classList.add('off', physical.length === 1 ? 'off-white' : 'off-black'); off++; }
        if (heldCaps.has(key)) cap.classList.add('is-on');
        cap.setAttribute('aria-label', `${key.toUpperCase()}: ${name.letter}${name.accidental}${name.octave}${playable ? '' : ' (off)'}`);
        attachCapHandlers(cap, key);
      } else {
        cap.tabIndex = -1;
        cap.setAttribute('aria-label', `${key.toUpperCase()}: nothing`);
      }
      rowEl.appendChild(cap);
    });
    qwertyEl.appendChild(rowEl);
  });

  const legend = chromatic
    ? ['Laid out like a piano: the Z and Q rows are the white keys, the rows above them the black keys.',
       shiftOn ? 'Shift (or Caps Lock) is on: two octaves higher.' : 'Hold Shift for two octaves higher.',
       outside - off > 0 ? 'Striped keys are outside the scale.' : '',
       off ? 'Focus is on: only the colored keys play.' : '']
    : [flexLayout.long ? 'This scale has more than ten notes, so the rows run on: Z climbs the scale from its first note, then A, Q and the number row carry on.'
                       : 'Each row climbs the scale from its first key.',
       shiftOn ? 'Shift (or Caps Lock) is on: the Z row plays an octave lower, the number row an octave higher.'
               : 'Hold Shift and the Z row plays an octave lower, the number row an octave higher.'];
  legend.push('Play the keys here or on your computer keyboard.');
  qwertyLegend.textContent = legend.filter(Boolean).join(' ');
}

// Shift and Caps Lock change octaves (Chromatic: every key up two; Flex: the Z row
// down one, the number row up one), so the caps follow them.
function trackShift(e) {
  const on = e.shiftKey || e.getModifierState('CapsLock');
  if (on === shiftOn) return;
  shiftOn = on;
  renderQwerty();
}
document.addEventListener('keydown', trackShift);
document.addEventListener('keyup', trackShift);

// -------- TOP BAR, QUICK ROW, SETTINGS --------
const root = document.documentElement;
const scaleSelector = document.getElementById('scale-select');
const keyNameBtn = document.getElementById('key-name');
const focusBtn = document.getElementById('focus-btn');
const layoutBtn = document.getElementById('layout-btn');
const namesBtn = document.getElementById('names-btn');
const volumeRange = document.getElementById('volume-range');
const volumeValue = document.getElementById('volume-value');
const roomRange = document.getElementById('room-range');
const roomValue = document.getElementById('room-value');

let currentOctaves = 1;
let volume = 1; // share of the engine's usual level for the 'keys' side
const BASE_LEVEL = 0.8;

// Settings words <-> the toggle-state indexes the piano code reads
const COLOR_MODES = ['off', 'always', 'played'];              // toggleStates.color
const NAME_MODES = ['none', 'scale', 'white', 'all', 'black']; // toggleStates.names
// The quick row's button: each press moves down this list, then round again.
const NAME_CYCLE = [
  { mode: 'none', label: 'Key Names' },
  { mode: 'scale', label: 'Scale Keys' },
  { mode: 'white', label: 'White Keys' },
  { mode: 'black', label: 'Black Keys' },
  { mode: 'all', label: 'All Keys' }
];
const nameStep = () => NAME_CYCLE.findIndex(c => c.mode === NAME_MODES[currentToggleStates.names]);

function redraw() { drawKeyboard(currentOctaves); }

// -------- LESSON LOCKS --------
// A link (lesson.js, Library → Create a Link) opens the teacher's scale and
// keyboard, or the whole workspace with its recording, kept apart from the
// student's own. LESSON is null outside one; inside one (`locked` when Lock
// link was on and anything is locked) its locks say what stays as the
// teacher left it:
//   scale   the scale               key     the key
//   layout  Flex or Chromatic (the letters still show and hide)
//   record  the recorder (a scale link: students play, never record)
//   meter   the time signature      tempo   the tempo
//   quant   Quantize: { on: true, grid, feel } or { on: false }, else free
//   tracks  the recorder tracks (by index) that can be muted, sized by whole
//           loops and given another sound, but never recorded over, edited
//           or deleted
// A locked control is taken away, not greyed: what must still be read (the
// key, the scale, the time signature) shows as plain text with a lock.
let LESSON = null;
const lockOn = what => !!(LESSON && LESSON.locks[what]);
const LOCK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9.5" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/></svg>';

function renderLocks() {
  const body = document.body;
  body.classList.toggle('in-lesson', !!LESSON);
  body.classList.toggle('lesson-locked', !!(LESSON && LESSON.locked));
  ['scale', 'key', 'layout', 'record', 'meter', 'tempo', 'quant'].forEach(w => body.classList.toggle('lock-' + w, lockOn(w)));
  const lock = document.getElementById('lesson-lock');
  lock.hidden = !LESSON;
  if (LESSON) lock.title = `Lesson: ${LESSON.title}. Press to see what is locked.`;
  document.getElementById('scale-fixed').textContent = scaleName(scaleSelector.value);
  keyNameBtn.title = lockOn('key') ? 'The key is set by this lesson' : 'Choose a key';
  document.getElementById('scale-fixed').title = 'The scale is set by this lesson';
  const chromatic = currentToggleStates.layout === 't-blue';
  document.getElementById('settings-layout-locked').textContent = lockOn('layout')
    ? `This lesson keeps the computer keys on ${chromatic ? 'Chromatic' : 'Flex'}. The ${chromatic ? 'Chromatic' : 'Flex'} button still shows and hides the letters on the piano keys.`
    : '';
}

function prettyNote(name) { return name[0] + name.slice(1).replace(/#/g, '♯').replace(/b/g, '♭'); }
function tonicName(keyName = currentKey, scaleId = scaleSelector.value) {
  return prettyNote(spelledTonic(pitchIndex[keyName], scaleId));
}
function scaleName(scaleId) { const s = scaleOf(scaleId); return s.isCustom ? s.title : s.name; }
function noteColor(pc) { const n = PHYSICAL_NAMES[pc]; return noteColors[n] || blackNoteColors[n]; }

// Everything on screen that shows a setting, brought up to date at once.
function renderChrome() {
  const scaleId = scaleSelector.value;
  keyNameBtn.textContent = tonicName();
  const color = noteColor(pitchIndex[currentKey]);
  root.style.setProperty('--tonic', color);
  root.style.setProperty('--tonic-ink', inkFor(color));

  document.querySelectorAll('.seg-btn').forEach(b => {
    const on = b.dataset.view === viewChoice;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
  });
  document.querySelectorAll('.oct-btn').forEach(b => b.setAttribute('aria-checked', String(+b.dataset.octaves === currentOctaves)));
  soundSelect.value = currentSound;
  focusBtn.setAttribute('aria-pressed', String(currentToggleStates.focus === 1));
  const chromatic = currentToggleStates.layout === 't-blue';
  const letters = showHotkeys && !keysView;
  layoutBtn.textContent = chromatic ? 'Chromatic' : 'Flex';
  layoutBtn.classList.toggle('is-chromatic', chromatic);
  layoutBtn.setAttribute('aria-pressed', String(letters));
  layoutBtn.title = lockOn('layout')
    ? `${chromatic ? 'Chromatic' : 'Flex'}, kept by this lesson. Press to ${letters ? 'hide' : 'show'} the ${chromatic ? 'Z and S rows’' : 'A row’s'} letters on the keys.`
    : keysView
    ? (chromatic ? 'Chromatic: every note, laid out like a piano. Press for Flex.' : 'Flex: each row climbs the scale. Press for Chromatic.')
    : !letters
      ? (chromatic ? 'Chromatic: every note, laid out like a piano. Press to see the Z and S rows’ letters on the keys.'
                   : 'Flex: each row of computer keys climbs the scale. Press to see the A row’s letters on the keys.')
      : (chromatic ? 'Showing the Z and S rows’ letters. Press for Flex.' : 'Showing the A row’s letters. Press for Chromatic.');
  document.body.classList.toggle('chromatic', chromatic);
  namesBtn.textContent = NAME_CYCLE[nameStep()].label;
  namesBtn.classList.toggle('covered', letters);
  namesBtn.title = letters ? 'The computer keys’ letters are showing: press for the note names' : 'Note names on the keys';

  const check = (name, value) => { const r = document.querySelector(`input[name="${name}"][value="${value}"]`); if (r) r.checked = true; };
  check('layout', chromatic ? 'chromatic' : 'flex');
  check('colors', COLOR_MODES[currentToggleStates.color]);
  check('theme', currentTheme());
  volumeRange.value = Math.round(volume * 100);
  volumeValue.textContent = Math.round(volume * 100) + '%';
  roomRange.value = Math.round(room * 100);
  roomValue.textContent = Math.round(room * 100) + '%';

  renderLocks();
  if (librarySheet.classList.contains('open')) renderLibrary();
  if (window.Recorder) Recorder.syncSound(); // the track being recorded plays in the keyboard's sound
  document.title = `${tonicName()} ${scaleName(scaleId)} — Virtual Keyboard`;
  if (LESSON && window.VKLesson) VKLesson.layoutChanged(); // a lesson keeps the student's octaves, sounds and so on
}

function setKey(keyName) {
  if (lockOn('key')) return;
  currentKey = keyName;
  updateFlexLayout(currentKey, scaleSelector.value);
  redraw();
  renderChrome();
}

// The view switch's choice. Record mode (recorder.js) shows the piano
// whatever it is, and the choice comes back when the recorder closes.
let viewChoice = 'piano';
function syncView() {
  keysView = viewChoice === 'keys' && !document.body.classList.contains('rec-mode');
  document.body.classList.toggle('keys-view', keysView);
  qwertyView.hidden = !keysView;
}
function setView(view) {
  viewChoice = view === 'keys' ? 'keys' : 'piano';
  syncView();
  renderQwerty();
  renderChrome();
}

function setLayoutMode(mode) {
  if (lockOn('layout')) { renderChrome(); return; }
  currentToggleStates.layout = mode === 'chromatic' ? 't-blue' : 't-green';
  redraw();
  renderChrome();
}

// The Flex button, one step a press: Flex → Flex with letters → Chromatic →
// Chromatic with letters → Flex. The computer-keyboard view always shows
// its letters, so there it only switches Flex and Chromatic. A lesson that
// keeps the layout leaves it only the letters: on, off (and in the
// computer-keyboard view, where it would only switch, it is hidden).
function stepLayout() {
  const chromatic = currentToggleStates.layout === 't-blue';
  if (lockOn('layout')) {
    if (keysView) return;
    showHotkeys = !showHotkeys;
  } else if (keysView || showHotkeys) {
    showHotkeys = false;
    currentToggleStates.layout = chromatic ? 't-green' : 't-blue';
  } else {
    showHotkeys = true;
  }
  redraw();
  renderChrome();
}

document.getElementById('key-down').addEventListener('click', () => setKey(PHYSICAL_NAMES[(pitchIndex[currentKey] + 11) % 12]));
document.getElementById('key-up').addEventListener('click', () => setKey(PHYSICAL_NAMES[(pitchIndex[currentKey] + 1) % 12]));
keyNameBtn.addEventListener('click', () => { if (lockOn('key')) openLibrary(); else openKeySheet(); });

scaleSelector.addEventListener('change', (e) => {
  if (lockOn('scale')) { scaleSelector.value = LESSON.layout.scale; e.target.blur(); return; }
  updateFlexLayout(currentKey, scaleSelector.value);
  redraw();
  renderChrome();
  e.target.blur(); // hand the computer keyboard back to the piano
});

document.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

document.querySelectorAll('.oct-btn').forEach(b => b.addEventListener('click', () => {
  currentOctaves = +b.dataset.octaves;
  redraw();
  renderChrome();
}));

focusBtn.addEventListener('click', () => {
  currentToggleStates.focus = currentToggleStates.focus === 1 ? 0 : 1;
  redraw();
  renderChrome();
});

layoutBtn.addEventListener('click', stepLayout);

// While the Flex button's letters show, they stand in for the names: a press
// here brings the names back (the next choice when it was "Key Names", none).
namesBtn.addEventListener('click', () => {
  const covered = showHotkeys && !keysView;
  showHotkeys = false;
  if (!covered || NAME_MODES[currentToggleStates.names] === 'none') {
    currentToggleStates.names = NAME_MODES.indexOf(NAME_CYCLE[(nameStep() + 1) % NAME_CYCLE.length].mode);
  }
  redraw();
  renderChrome();
});

// Settings
document.querySelectorAll('input[name="layout"]').forEach(r => r.addEventListener('change', () => setLayoutMode(r.value)));
document.querySelectorAll('input[name="colors"]').forEach(r => r.addEventListener('change', () => {
  currentToggleStates.color = COLOR_MODES.indexOf(r.value);
  redraw();
  renderChrome();
}));
volumeRange.addEventListener('input', () => {
  volume = volumeRange.value / 100;
  wakeAudio();
  Audio.setLevel(SOUND_SIDE, BASE_LEVEL * volume);
  volumeValue.textContent = volumeRange.value + '%';
});
volumeRange.addEventListener('change', previewSound);

// Room: the reverb, as Key Blocks' Settings has it
function setRoom(value) {
  room = value;
  if (audioWoken) Audio.setReverb(room); // otherwise wakeAudio applies it
}
roomRange.addEventListener('input', () => {
  wakeAudio();
  setRoom(roomRange.value / 100);
  roomValue.textContent = roomRange.value + '%';
});
roomRange.addEventListener('change', previewSound);

// Background: dark or light. A choice is kept on this device (the <head> applies it
// before the page paints); until then the device's own setting decides.
const THEME_KEY = 'virtual_keyboard_theme_v1';
const THEME_BG = { dark: '#161a24', light: '#eef0f5' };
function currentTheme() {
  return root.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}
function showTheme() {
  document.querySelector('meta[name="theme-color"]').setAttribute('content', THEME_BG[currentTheme()]);
}
document.querySelectorAll('input[name="theme"]').forEach(r => r.addEventListener('change', () => {
  root.dataset.theme = r.value;
  try { localStorage.setItem(THEME_KEY, r.value); } catch (e) {}
  showTheme();
}));
matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { showTheme(); renderChrome(); });

// -------- SHEETS --------
const librarySheet = document.getElementById('library-sheet');

const onSheetClose = {}; // sheet id -> what to do when it closes (however it closes)
function openSheet(id) { document.getElementById(id).classList.add('open'); }
function closeSheet(id) {
  const el = document.getElementById(id);
  if (!el.classList.contains('open')) return;
  el.classList.remove('open');
  if (onSheetClose[id]) onSheetClose[id]();
}
document.querySelectorAll('.sheet-backdrop').forEach(bd => {
  bd.addEventListener('pointerdown', (e) => { if (e.target === bd) closeSheet(bd.id); });
  bd.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeSheet(bd.id)));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.sheet-backdrop.open').forEach(bd => closeSheet(bd.id));
});
document.getElementById('settings-btn').addEventListener('click', () => { renderChrome(); openSheet('settings-sheet'); });
function openLibrary() {
  libraryStatus.textContent = '';
  pendingDelete = null;
  if (window.VKLesson) VKLesson.libraryOpened(); // (a workspace's Delete or Open asking first is forgotten too)
  renderLibrary();
  openSheet('library-sheet');
}
document.getElementById('library-btn').addEventListener('click', openLibrary);

function openKeySheet() {
  const grid = document.getElementById('key-grid');
  grid.innerHTML = '';
  PHYSICAL_NAMES.forEach(name => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = tonicName(name);
    if (name === currentKey) b.classList.add('current');
    b.addEventListener('click', () => { setKey(name); closeSheet('key-sheet'); });
    grid.appendChild(b);
  });
  openSheet('key-sheet');
}

let toastTimer = null;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

// -------- LIBRARY --------
// Create a Link · Save Workspace · Build a Scale on top, then the saved
// workspaces (lesson.js), then the scales: mine, newest first, and the
// starters. A LAYOUT is the scale and keyboard a scale link or file carries,
// as an Eagle View Music envelope (EVM Library/README.md §7) without an id: a
// received layout is simply opened. Volume is the listener's own and never
// travels.
const APP_SLUG = 'virtual-keyboard';
const DEFAULT_LAYOUT = {
  key: 'C', scale: 'major', layout: 'flex', octaves: 1, sound: 'piano',
  colors: 'always', names: 'none', focus: false, view: 'piano', room: 0.35
};
const STARTERS = [
  { id: 'starter-c-major', title: 'C Major — first tunes', layout: {} },
  { id: 'starter-g-major-names', title: 'G Major — with the note names', layout: { key: 'G', names: 'scale' } },
  { id: 'starter-a-minor-pent', title: 'A Minor Pentatonic — marimba', layout: { key: 'A', scale: 'minor-pentatonic', sound: 'marimba' } },
  { id: 'starter-d-dorian', title: 'D Dorian — electric piano', layout: { key: 'D', scale: 'dorian', sound: 'epiano' } },
  { id: 'starter-e-phrygian', title: 'E Phrygian — flamenco pluck', layout: { key: 'E', scale: 'phrygian', sound: 'pluck' } },
  { id: 'starter-c-blues', title: 'C Blues — only the blue notes play', layout: { scale: 'blues', sound: 'organ', layout: 'chromatic', focus: true, names: 'scale', octaves: 2 } },
  { id: 'starter-c-whole-tone', title: 'C Whole Tone — floating bells', layout: { scale: 'whole-tone', sound: 'bell', octaves: 2, room: 0.7 } },
  { id: 'starter-f-lydian-keys', title: 'F Lydian — strings on the computer keys', layout: { key: 'F', scale: 'lydian', sound: 'strings', view: 'keys' } }
];
const libraryStatus = document.getElementById('library-status');

function getLayout() {
  return {
    key: currentKey,
    scale: scaleSelector.value,
    layout: currentToggleStates.layout === 't-blue' ? 'chromatic' : 'flex',
    octaves: currentOctaves,
    sound: currentSound,
    colors: COLOR_MODES[currentToggleStates.color],
    names: NAME_MODES[currentToggleStates.names],
    focus: currentToggleStates.focus === 1,
    view: viewChoice,
    room
  };
}

// Anything missing or unknown falls back to the default, so every link opens.
function normalizeLayout(src) {
  const d = { ...DEFAULT_LAYOUT };
  if (!src || typeof src !== 'object') return d;
  if (pitchIndex[src.key] !== undefined) d.key = PHYSICAL_NAMES[pitchIndex[src.key]];
  if (src.scale === 'minor') d.scale = 'natural-minor'; // Key Blocks' "Minor": the same notes
  else if (isKnownScale(src.scale)) d.scale = src.scale;
  if (src.layout === 'chromatic' || src.layout === 'flex') d.layout = src.layout;
  if ([1, 2, 3, 4].includes(+src.octaves)) d.octaves = +src.octaves;
  if (Audio.PRESETS[src.sound]) d.sound = src.sound;
  if (COLOR_MODES.includes(src.colors)) d.colors = src.colors;
  if (NAME_MODES.includes(src.names)) d.names = src.names;
  d.focus = src.focus === true;
  if (src.view === 'keys' || src.view === 'piano') d.view = src.view;
  const r = Number(src.room);
  if (src.room !== undefined && src.room !== null && r >= 0 && r <= 1) d.room = Math.round(r * 100) / 100;
  return d;
}

function applyLayout(src) {
  const d = normalizeLayout(src);
  if (lockOn('key')) d.key = LESSON.layout.key;       // a lesson's locks always win
  if (lockOn('scale')) d.scale = LESSON.layout.scale;
  if (lockOn('layout')) d.layout = LESSON.layout.layout;
  currentKey = d.key;
  scaleSelector.value = d.scale;
  currentToggleStates.layout = d.layout === 'chromatic' ? 't-blue' : 't-green';
  currentOctaves = d.octaves;
  currentSound = d.sound;
  currentToggleStates.color = COLOR_MODES.indexOf(d.colors);
  currentToggleStates.names = NAME_MODES.indexOf(d.names);
  currentToggleStates.focus = d.focus ? 1 : 0;
  setRoom(d.room);
  updateFlexLayout(currentKey, d.scale);
  showHotkeys = false;
  viewChoice = d.view;
  syncView();
  redraw();
  renderChrome();
}

function layoutTitle(d) { return `${tonicName(d.key, d.scale)} ${scaleName(d.scale)}`; }
function layoutNote(d) {
  return [
    Audio.PRESETS[d.sound].name,
    d.layout === 'chromatic' ? 'Chromatic' : 'Flex',
    d.octaves + (d.octaves === 1 ? ' octave' : ' octaves'),
    d.focus ? 'Focus' : '',
    d.view === 'keys' ? 'computer keyboard' : ''
  ].filter(Boolean).join(' · ');
}
function swatch(d) {
  const tonic = pitchIndex[d.key];
  return scaleSemitones(d.scale).map(semis => `<i style="background:${noteColor((tonic + semis) % 12)}"></i>`).join('');
}
const sameLayout = (a, b) => JSON.stringify(normalizeLayout(a)) === JSON.stringify(normalizeLayout(b));

// One of my scales in the key it was built in: its notes as they were chosen.
function myScaleNotes(rec) { return rec.degrees.map(d => Theory.spellDegree(rec.tonic, d).name); }

// Put one of my scales on screen: its scale in the key it was built in.
function useMyScale(rec) {
  currentKey = PHYSICAL_NAMES[pitchIndex[rec.tonic]];
  scaleSelector.value = rec.id;
  updateFlexLayout(currentKey, rec.id);
  redraw();
  renderChrome();
}

let pendingDelete = null; // the id of my scale whose Delete was pressed once
function deleteMyScale(rec) {
  delete myScaleById[rec.id];
  const stored = storeMyScales();
  const wasOn = scaleSelector.value === rec.id;
  fillScaleSelect(); // (falls back to Major when it was on screen)
  if (wasOn) { updateFlexLayout(currentKey, scaleSelector.value); redraw(); }
  pendingDelete = null;
  renderChrome();
  renderLibrary();
  toast(stored ? `Deleted “${rec.title}”` : `Deleted “${rec.title}” for now: this browser would not save the change`);
}

function smallBtn(text, cls, onClick) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'btn btn-sm' + (cls ? ' ' + cls : '');
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}

// My scales, newest on top: the top of the Library's list of scales.
function renderMyScales() {
  const list = document.getElementById('my-scales-list');
  list.innerHTML = '';
  const mine = myScalesInOrder().reverse();
  mine.forEach(rec => {
    const item = document.createElement('div');
    item.className = 'lib-item mine';
    if (scaleSelector.value === rec.id) item.classList.add('current');
    const tonicPc = pitchIndex[rec.tonic];
    const title = document.createElement('div');
    title.className = 'lib-title';
    title.innerHTML = `<span class="lib-swatch">${rec.degrees.map(d => `<i style="background:${noteColor((tonicPc + Theory.degreeSemis(d)) % 12)}"></i>`).join('')}</span>`;
    title.append(rec.title);
    const meta = document.createElement('div');
    meta.className = 'lib-meta';
    const actions = document.createElement('div');
    actions.className = 'lib-actions';
    if (pendingDelete === rec.id) {
      item.classList.add('confirming');
      meta.textContent = `Delete “${rec.title}”? It can’t be brought back.`;
      actions.append(
        smallBtn('Delete', 'btn-danger', () => deleteMyScale(rec)),
        smallBtn('Keep', '', () => { pendingDelete = null; renderLibrary(); }));
    } else {
      const notes = myScaleNotes(rec);
      const baseNote = rec.base !== PHYSICAL_NAMES[pitchIndex[rec.tonic]]
        ? ` · the piano starts on ${SB_BLACKS[pitchIndex[rec.base]] ? SB_BLACKS[pitchIndex[rec.base]].map(prettyNote).join('/') : rec.base}` : '';
      meta.textContent = `${notes.length} ${notes.length === 1 ? 'note' : 'notes'} · ${notes.join(' ')}${baseNote}`;
      actions.append(
        smallBtn('Open', 'btn-primary', () => { useMyScale(rec); closeSheet('library-sheet'); toast(`Opened “${rec.title}”`); }),
        smallBtn('Edit', '', () => openBuilder(rec)),
        smallBtn('Delete', 'btn-quiet', () => { pendingDelete = rec.id; renderLibrary(); }));
    }
    item.append(title, actions, meta);
    list.appendChild(item);
  });
}

function renderLibrary() {
  const now = getLayout();
  document.getElementById('now-title').textContent = layoutTitle(now);
  document.getElementById('now-note').textContent = layoutNote(now);
  if (window.VKLesson) VKLesson.renderLibrary(); // the link open, and the saved workspaces
  renderMyScales();
  const list = document.getElementById('library-list');
  list.innerHTML = '';
  STARTERS.forEach(st => {
    const d = normalizeLayout(st.layout);
    const item = document.createElement('div');
    item.className = 'lib-item';
    if (sameLayout(d, now)) item.classList.add('current');
    const title = document.createElement('div');
    title.className = 'lib-title';
    title.innerHTML = `<span class="lib-swatch">${swatch(d)}</span>`;
    title.append(st.title);
    const meta = document.createElement('div');
    meta.className = 'lib-meta';
    meta.textContent = layoutNote(d);
    const actions = document.createElement('div');
    actions.className = 'lib-actions';
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'btn btn-sm btn-primary';
    open.textContent = 'Open';
    open.addEventListener('click', () => { applyLayout(d); closeSheet('library-sheet'); toast('Opened “' + st.title + '”'); });
    actions.appendChild(open);
    item.append(title, actions, meta);
    list.appendChild(item);
  });
}

// A layout on one of my scales carries the scale too (scaleRecord), so it
// opens anywhere; the scale is filed in that person's My scales on arrival.
function toEnvelope(d) {
  const data = { ...d };
  const mine = customScale(d.scale);
  if (mine) data.scaleRecord = { id: mine.id, title: mine.title, degrees: mine.degrees, tonic: mine.tonic, base: mine.base, updatedAt: mine.updatedAt };
  return { format: 'evm-item', formatVersion: 1, app: APP_SLUG, kind: 'layout', title: layoutTitle(d), data };
}
const sameScale = (a, b) => a.title === b.title && a.tonic === b.tonic && a.base === b.base && a.degrees.join() === b.degrees.join();
// File a layout's scaleRecord in My scales (once: the same id, or the same
// scale under another id, is reused) and point the layout at it. Returns
// true when it was new here.
function takeScaleRecord(d) {
  if (!d || !d.scaleRecord || typeof d.scaleRecord !== 'object') return false;
  const rec = cleanScale(d.scaleRecord);
  if (!rec) return false;
  const have = myScaleById[rec.id];
  if (have) {
    if (!sameScale(have, rec) && Date.parse(rec.updatedAt) > Date.parse(have.updatedAt)) {
      myScaleById[rec.id] = { ...rec, createdAt: have.createdAt }; // a newer copy of it
      storeMyScales();
      fillScaleSelect();
    }
    d.scale = rec.id;
    return false;
  }
  const twin = Object.values(myScaleById).find(s => sameScale(s, rec));
  if (twin) { d.scale = twin.id; return false; }
  rec.createdAt = new Date().toISOString();
  myScaleById[rec.id] = rec;
  storeMyScales();
  fillScaleSelect();
  d.scale = rec.id;
  return true;
}
// A link or file: an envelope, a bundle holding one, or a bare layout.
function readLayout(obj) {
  if (!obj || typeof obj !== 'object') return null;
  if (obj.format === 'evm-bundle' && Array.isArray(obj.items)) {
    const item = obj.items.find(it => it && it.app === APP_SLUG && it.kind === 'layout');
    return item ? item.data : null;
  }
  if (obj.format === 'evm-item') return obj.app === APP_SLUG && obj.kind === 'layout' ? obj.data : null;
  return obj.key && obj.scale ? obj : null;
}

function encodeLink(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeLink(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (e) { return null; }
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true, () => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  return ok;
}

// The scale link with nothing locked (Create a Link → Scale): this layout.
const layoutLink = () => location.origin + location.pathname + '?layout=' + encodeLink(toEnvelope(getLayout()));
// …and as a file. Returns its name.
function downloadLayout() {
  const d = getLayout();
  const blob = new Blob([JSON.stringify(toEnvelope(d), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const scalePart = customScale(d.scale)
    ? (customScale(d.scale).title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'my-scale')
    : d.scale;
  a.download = `virtual-keyboard-${spelledTonic(pitchIndex[d.key], d.scale).replace('#', '-sharp').replace(/^([A-G])b/, '$1-flat').toLowerCase()}-${scalePart}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return a.download;
}

const openFileInput = document.getElementById('open-file');
document.getElementById('open-file-btn').addEventListener('click', () => openFileInput.click());
openFileInput.addEventListener('change', () => {
  const file = openFileInput.files[0];
  openFileInput.value = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let obj = null;
    try { obj = JSON.parse(reader.result); } catch (e) {}
    // the Library's own file, a workspace, a lesson (the teacher's copy, opened
    // unlocked), a scale or the recorder's tracks: lesson.js. A layout: here.
    if (window.VKLesson && VKLesson.upload(obj, file.name)) return;
    const d = readLayout(obj);
    if (!d) { libraryStatus.textContent = 'That file is not a Virtual Keyboard file.'; return; }
    const filed = takeScaleRecord(d);
    applyLayout(d);
    libraryStatus.textContent = 'Opened ' + layoutTitle(normalizeLayout(d)) + '.' + (filed ? ' Its scale is in My scales now.' : '');
    renderLibrary();
  };
  reader.readAsText(file);
});

// A ?layout= link opens that layout, then tidies the address bar.
function layoutFromUrl() {
  const params = new URLSearchParams(location.search);
  if (!params.has('layout')) return;
  const d = readLayout(decodeLink(params.get('layout')));
  if (history.replaceState) history.replaceState({}, '', location.pathname);
  if (!d) { setTimeout(() => toast('That link could not be read'), 300); return; }
  const filed = takeScaleRecord(d);
  applyLayout(d);
  setTimeout(() => toast('Opened ' + layoutTitle(normalizeLayout(d)) + (filed ? ' — its scale is in My scales now' : '')), 300);
}

// -------- SCALE BUILDER (Library → Build a scale) --------
// One octave of piano keys drawn from the BASE KEY, the one furthest to the
// left (only a look: ◀ ▶ moves it), up to the base again an octave higher.
// Nothing is locked: the chosen key furthest to the left is the scale's
// first note, where the Flex keys start. A black key carries both of its
// names: tap the one it should be written as, tap it again to take the note
// out. Saved scales are degrees counted by letter from the first note, so
// G♭ above E♭ is a ♭3 and F♯ above D a 3.
const SB_BLACKS = { 1: ['C#', 'Db'], 3: ['D#', 'Eb'], 6: ['F#', 'Gb'], 8: ['G#', 'Ab'], 10: ['A#', 'Bb'] };
const LETTER_ORDER = 'CDEFGAB';
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11];
const sb = { base: 0, on: new Map(), editId: null, from: null, saved: false };
const sbPiano = document.getElementById('sb-piano');
const sbName = document.getElementById('sb-name');
const sbStatus = document.getElementById('sb-status');
const scaleSheet = document.getElementById('scale-sheet');

function degreeOf(tonic, note) {
  const num = (LETTER_ORDER.indexOf(note[0]) - LETTER_ORDER.indexOf(tonic[0]) + 7) % 7 + 1;
  const semis = (pitchIndex[note] - pitchIndex[tonic] + 12) % 12;
  let alter = ((semis - MAJOR_STEPS[num - 1]) % 12 + 12) % 12;
  if (alter > 6) alter -= 12;
  return (alter > 0 ? '#'.repeat(alter) : 'b'.repeat(-alter)) + num;
}
// A pitch as this piano can write it: a white key by its letter, a black key
// by whichever of its two names is nearer the spelling given.
function keyNameFor(pc, spelled) {
  const pair = SB_BLACKS[pc];
  if (!pair) return PHYSICAL_NAMES[pc];
  return pair.find(n => n[0] === spelled.letter) || (spelled.alter > 0 ? pair[0] : pair[1]);
}
const sbFromBase = pc => (pc - sb.base + 12) % 12;
// The chosen notes left to right from the base: the first one is the first note.
function builderNotes() { return [...sb.on.entries()].sort((a, b) => sbFromBase(a[0]) - sbFromBase(b[0])); }
function firstNote() { const notes = builderNotes(); return notes.length ? { pc: notes[0][0], name: notes[0][1] } : null; }
function builderDegrees() {
  const first = firstNote();
  return builderNotes().map(([pc, name]) => pc === first.pc ? '1' : degreeOf(first.name, name));
}
// A black key switched on by tapping the key itself: the usual name for that
// step above the first note (♭2 ♭3 ♯4 ♭6 ♭7), or above the base while
// nothing is chosen.
function defaultKeyName(pc) {
  const first = firstNote();
  const ref = first ? first.name : (SB_BLACKS[sb.base] ? SB_BLACKS[sb.base][1] : PHYSICAL_NAMES[sb.base]);
  const degree = Theory.semisToDegree((pc - pitchIndex[ref] + 12) % 12, []);
  return keyNameFor(pc, Theory.spellDegree(ref, degree));
}
const keyLabel = pc => SB_BLACKS[pc] ? SB_BLACKS[pc].map(prettyNote).join('/') : PHYSICAL_NAMES[pc];

function builderStart(base, tonic, degrees) {
  sb.base = base;
  sb.on = new Map();
  const tonicPc = pitchIndex[tonic];
  degrees.forEach(d => {
    const pc = (tonicPc + Theory.degreeSemis(d)) % 12;
    sb.on.set(pc, keyNameFor(pc, Theory.spellDegree(tonic, d)));
  });
  sb.on.set(tonicPc, tonic);
}

function uniqueTitle(base, exceptId) {
  const taken = new Set(Object.values(myScaleById).filter(s => s.id !== exceptId).map(s => s.title.toLowerCase()));
  if (!taken.has(base.toLowerCase())) return base;
  let n = 2;
  while (taken.has(`${base} ${n}`.toLowerCase())) n++;
  return `${base} ${n}`;
}

// Sounds rise left to right as drawn: step 0 is the base (near middle C),
// step 12 the base an octave up. Play climbs the scale from its first note
// to that note an octave higher.
let sbVoices = [];
let sbTimers = [];
const sbBaseMidi = () => rowTonicMidi(PHYSICAL_NAMES[sb.base], 1);
function sbSound(midi, ms) {
  wakeAudio();
  const v = Audio.play(SOUND_SIDE, [440 * Math.pow(2, (midi - 69) / 12)], currentSound);
  sbVoices.push(v);
  sbTimers.push(setTimeout(() => Audio.stop(v), ms));
}
function previewStep(step) { sbSound(sbBaseMidi() + step, 450); }
function stopBuilderSound() {
  sbTimers.forEach(clearTimeout);
  sbTimers = [];
  sbVoices.forEach(v => Audio.stop(v));
  sbVoices = [];
  sbPiano.querySelectorAll('.sounding').forEach(el => el.classList.remove('sounding'));
}
function playBuilderScale() {
  stopBuilderSound();
  const notes = builderNotes();
  if (!notes.length) { sbStatus.textContent = 'Pick a note or two first.'; return; }
  const steps = notes.map(([pc]) => sbFromBase(pc));
  steps.push(steps[0] + 12);
  steps.forEach((s, i) => sbTimers.push(setTimeout(() => {
    sbSound(sbBaseMidi() + s, 380);
    const el = sbPiano.querySelector(`[data-step="${s}"]`);
    if (el) {
      el.classList.add('sounding');
      sbTimers.push(setTimeout(() => el.classList.remove('sounding'), 300));
    }
  }, i * 340)));
}

// The keys drawn: base … base an octave up (13 keys). A black base gets half
// a white key on each side, outside the octave, so its ends sit on something.
function builderKeys() {
  const keys = [];
  const blackBase = BLACK_PCS.has(sb.base);
  if (blackBase) keys.push({ pc: (sb.base + 11) % 12, stub: true });
  for (let s = 0; s <= 12; s++) keys.push({ pc: (sb.base + s) % 12, step: s });
  if (blackBase) keys.push({ pc: (sb.base + 1) % 12, stub: true });
  return keys;
}

function renderBuilder() {
  sbPiano.innerHTML = '';
  const first = firstNote();
  const keys = builderKeys();
  const widthOf = k => k.stub ? 0.5 : 1;
  const total = keys.filter(k => !BLACK_PCS.has(k.pc)).reduce((n, k) => n + widthOf(k), 0);
  let x = 0; // white widths so far: where the next black key's centre goes
  keys.forEach(k => {
    const black = BLACK_PCS.has(k.pc);
    const chosen = k.stub ? undefined : sb.on.get(k.pc);
    const isFirst = !!first && k.step === sbFromBase(first.pc);
    if (!black) {
      const name = PHYSICAL_NAMES[k.pc];
      const key = document.createElement(k.stub ? 'div' : 'button');
      key.className = 'sb-white' + (k.stub ? ' stub' : '') + (chosen ? ' on' : '');
      key.style.flex = String(widthOf(k));
      x += widthOf(k);
      if (!k.stub) {
        key.type = 'button';
        key.dataset.pc = k.pc;
        key.dataset.step = k.step;
        key.setAttribute('aria-pressed', String(!!chosen));
        key.setAttribute('aria-label', name + (isFirst ? ', the first note' : '') + (k.step === 0 ? ', the base key' : ''));
        if (chosen) {
          key.style.setProperty('--c', noteColors[name]);
          key.style.setProperty('--ink', inkFor(noteColors[name]));
        }
        key.innerHTML = (isFirst ? '<span class="sb-first">1st</span>' : '') + `<span class="sb-letter">${name}</span>`;
        key.addEventListener('click', () => pressBuilderKey(k.pc, k.step));
      }
      sbPiano.appendChild(key);
      return;
    }
    const pair = SB_BLACKS[k.pc];
    const wrap = document.createElement('div');
    wrap.className = 'sb-black' + (chosen ? ' on' : '');
    wrap.dataset.pc = k.pc;
    wrap.dataset.step = k.step;
    wrap.style.left = `${(x / total) * 100}%`;
    wrap.style.width = `${(0.66 / total) * 100}%`;
    if (chosen) wrap.style.setProperty('--c', blackNoteColors[PHYSICAL_NAMES[k.pc]]);
    const body = document.createElement('button');
    body.type = 'button';
    body.className = 'sb-black-body';
    body.setAttribute('aria-pressed', String(!!chosen));
    body.setAttribute('aria-label', pair.map(prettyNote).join(' or ') + (isFirst ? ', the first note' : '') + (k.step === 0 ? ', the base key' : ''));
    body.addEventListener('click', () => pressBuilderKey(k.pc, k.step));
    wrap.appendChild(body);
    if (isFirst) wrap.insertAdjacentHTML('beforeend', '<span class="sb-first">1st</span>');
    const names = document.createElement('div');
    names.className = 'sb-names';
    pair.forEach(n => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sb-acc' + (chosen === n ? ' chosen' : '');
      b.textContent = prettyNote(n);
      b.setAttribute('aria-pressed', String(chosen === n));
      b.title = chosen === n ? `Written as ${prettyNote(n)}: tap again to take it out` : `Write it as ${prettyNote(n)}`;
      b.addEventListener('click', () => pressBuilderName(k.pc, n, k.step));
      names.appendChild(b);
    });
    wrap.appendChild(names);
    sbPiano.appendChild(wrap);
  });

  document.getElementById('sb-base-name').textContent = keyLabel(sb.base);
  const notes = builderNotes();
  document.getElementById('sb-count').textContent = notes.length ? `${notes.length} ${notes.length === 1 ? 'note' : 'notes'}` : 'No notes yet';
  const list = document.getElementById('sb-notes');
  list.innerHTML = '';
  notes.forEach(([pc, name]) => {
    const chip = document.createElement('span');
    chip.className = 'sb-note';
    chip.style.setProperty('--c', noteColor(pc));
    chip.style.setProperty('--ink', inkFor(noteColor(pc)));
    chip.textContent = prettyNote(name);
    list.appendChild(chip);
  });
  const firstText = first ? prettyNote(first.name) : '';
  const firstNoteEl = document.getElementById('sb-first-note');
  firstNoteEl.hidden = !first;
  firstNoteEl.textContent = first ? `First note: ${firstText}. The Flex keys start here: Z, A, Q and 1 each play ${firstText}.` : '';
  const flexNote = document.getElementById('sb-flex');
  flexNote.hidden = notes.length <= FLEX_ROW_LEN;
  flexNote.textContent = `More than ten notes: on the computer keys (Flex) the rows run on from one to the next. Z starts on ${firstText}, and once the Z row runs out the A row carries on up the scale, then Q, then the number row.`;
  if (notes.length > FLEX_ROW_LEN) firstNoteEl.textContent = `First note: ${firstText}.`;
}

function pressBuilderKey(pc, step) {
  sbStatus.textContent = '';
  if (sb.on.has(pc)) sb.on.delete(pc);
  else { sb.on.set(pc, defaultKeyName(pc)); previewStep(step); }
  renderBuilder();
}
function pressBuilderName(pc, name, step) {
  sbStatus.textContent = '';
  if (sb.on.get(pc) === name) sb.on.delete(pc);
  else { sb.on.set(pc, name); previewStep(step); }
  renderBuilder();
}
function setBuilderBase(pc) {
  sb.base = (pc + 12) % 12;
  sbStatus.textContent = '';
  renderBuilder();
}

// rec: one of my scales to edit; none: a new scale, starting from the one on
// screen, drawn from a base key that keeps its first note first.
function openBuilder(rec) {
  sb.editId = rec ? rec.id : null;
  sb.saved = false;
  sb.from = librarySheet.classList.contains('open') ? 'library' : null;
  if (rec) builderStart(pitchIndex[rec.base], rec.tonic, rec.degrees);
  else {
    const tonic = spelledTonic(pitchIndex[currentKey], scaleSelector.value);
    builderStart(0, tonic, scaleOf(scaleSelector.value).degrees);
    sb.base = defaultBase(pitchIndex[tonic], new Set(sb.on.keys()));
  }
  sbName.value = rec ? rec.title : uniqueTitle('My scale');
  document.getElementById('sb-title').textContent = rec ? 'Edit a scale' : 'Build a scale';
  document.getElementById('sb-save').textContent = rec ? 'Save changes' : 'Save scale';
  document.getElementById('sb-save-new').hidden = !rec;
  sbStatus.textContent = '';
  renderBuilder();
  librarySheet.classList.remove('open'); // (the builder takes its place; Cancel brings it back)
  openSheet('scale-sheet');
  scaleSheet.querySelector('.sheet-scroll').scrollTop = 0;
}

function saveBuilder(asNew) {
  const first = firstNote();
  if (!first) { sbStatus.textContent = 'Pick at least one note first.'; return; }
  const typed = cleanTitle(sbName.value);
  const old = !asNew && sb.editId ? myScaleById[sb.editId] : null;
  const title = old ? (typed || old.title) : uniqueTitle(typed || 'My scale');
  const now = new Date().toISOString();
  const fields = { title, degrees: builderDegrees(), tonic: first.name, base: PHYSICAL_NAMES[sb.base], updatedAt: now };
  const rec = old ? { ...old, ...fields } : { id: newScaleId(), ...fields, createdAt: now, isCustom: true };
  myScaleById[rec.id] = rec;
  const stored = storeMyScales();
  fillScaleSelect();
  sb.saved = true;
  closeSheet('scale-sheet');
  useMyScale(rec);
  toast(stored ? `Saved “${title}”: it’s in the scale menu and the Library`
               : `“${title}” is on for now, but this browser would not save it`);
}

onSheetClose['scale-sheet'] = () => {
  stopBuilderSound();
  if (!sb.saved && sb.from === 'library') openLibrary();
};
document.getElementById('build-scale-btn').addEventListener('click', () => openBuilder(null));
document.getElementById('sb-base-down').addEventListener('click', () => setBuilderBase(sb.base - 1));
document.getElementById('sb-base-up').addEventListener('click', () => setBuilderBase(sb.base + 1));
document.getElementById('sb-play').addEventListener('click', playBuilderScale);
document.getElementById('sb-clear').addEventListener('click', () => {
  sb.on = new Map();
  sbStatus.textContent = '';
  renderBuilder();
});
document.getElementById('sb-all').addEventListener('click', () => {
  for (let pc = 0; pc < 12; pc++) if (!sb.on.has(pc)) sb.on.set(pc, defaultKeyName(pc));
  sbStatus.textContent = '';
  renderBuilder();
});
document.getElementById('sb-save').addEventListener('click', () => saveBuilder(false));
document.getElementById('sb-save-new').addEventListener('click', () => saveBuilder(true));
sbName.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveBuilder(false); } });

// Explaining notes fold into a circled i (open until folded; remembered here).
function foldNotes() {
  document.querySelectorAll('.fold-note').forEach(note => {
    const key = 'virtual_keyboard_fold_' + note.dataset.key;
    const body = document.createElement('span');
    body.className = 'fold-body';
    while (note.firstChild) body.append(note.firstChild);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fold-i';
    btn.textContent = 'i';
    btn.setAttribute('aria-label', 'Show or hide this note');
    note.append(body, btn);
    const apply = folded => {
      note.classList.toggle('folded', folded);
      btn.setAttribute('aria-expanded', String(!folded));
      btn.title = folded ? body.textContent.trim() : '';
    };
    let folded = false;
    try { folded = localStorage.getItem(key) === '1'; } catch (e) {}
    apply(folded);
    btn.addEventListener('click', () => {
      folded = !note.classList.contains('folded');
      apply(folded);
      try { localStorage.setItem(key, folded ? '1' : '0'); } catch (e) {}
    });
  });
}
foldNotes();

// -------- START --------
try { if (window.self !== window.top) root.classList.add('in-iframe'); } catch (e) { root.classList.add('in-iframe'); }
// What the studio may ask: put a track's sound back on the keyboard when that
// track is picked again, play in the project's key (pitch class 0 = C, a
// Theory scale id), and let go of every key.
if (STUDIO) STUDIO.offer({
  setSound(id) { if (Audio.PRESETS[id] && id !== currentSound) { currentSound = id; renderChrome(); } },
  setKey(pc, scaleId) {
    if (scaleId === 'minor') scaleId = 'natural-minor';   // the same notes; this menu lists it once
    if (Theory.SCALE_BY_ID[scaleId]) scaleSelector.value = scaleId;
    setKey(PHYSICAL_NAMES[((pc % 12) + 12) % 12]);       // (the function above: redraws in the new scale too)
  },
  releaseAll() { [...active.keys()].forEach(stopNote); }
});
fillSoundSelect();
drawKeyboard(currentOctaves);
showTheme();
renderChrome();
layoutFromUrl();

// Refit the keyboard whenever the page width changes: a resized window, a
// rotated tablet, or a page that was hidden when it first drew (width 0).
const pianoContainerEl = document.querySelector('.piano-container');
let fittedWidth = pianoContainerEl.clientWidth;
new ResizeObserver(() => {
  const width = pianoContainerEl.clientWidth;
  if (width === fittedWidth) return;
  fittedWidth = width;
  redraw();
}).observe(pianoContainerEl);

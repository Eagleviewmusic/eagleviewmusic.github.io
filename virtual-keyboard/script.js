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

function startNote(finalNote) {
  wakeAudio();
  if (active.has(finalNote)) stopNote(finalNote); // retrigger
  active.set(finalNote, Audio.play(SOUND_SIDE, [freqOf(finalNote)], currentSound));
}

function stopNote(finalNote) {
  const voice = active.get(finalNote);
  if (voice === undefined) return;
  Audio.stop(voice);
  active.delete(finalNote);
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

// Flex rows, bottom row first. Each row walks ten keys up the scale from the
// tonic, an octave above the row below it.
const FLEX_ROWS = ['zxcvbnm,./', 'asdfghjkl;', 'qwertyuiop', '1234567890'];

// Shift (or Caps Lock) stretches Flex a little: the Z row plays an octave
// lower, the number row an octave higher; the A and Q rows stay put.
const FLEX_SHIFT = [-1, 0, 0, 1];

let flexLayout = null; // { keyName, map: computer key -> { note, octave, row, pos } }
let currentKey = 'C';  // the tonic, by piano-key name: C Db D Eb E F Gb G Ab A Bb B

function scaleSemitones(scaleId) {
  const scale = Theory.SCALE_BY_ID[scaleId] || Theory.SCALE_BY_ID.major;
  return scale.degrees.map(Theory.degreeSemis);
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

function buildFlexKeymap(keyName, scaleId) {
  const semis = scaleSemitones(scaleId);
  const map = {};
  FLEX_ROWS.forEach((keys, row) => {
    [...keys].forEach((key, pos) => {
      const midi = rowTonicMidi(keyName, row) + 12 * Math.floor(pos / semis.length) + semis[pos % semis.length];
      map[key] = { ...noteFromMidi(midi), row, pos };
    });
  });
  return map;
}

function fillScaleSelect() {
  const select = document.querySelector('.scale-selector');
  const families = [];
  Theory.SCALES.filter(s => !HIDDEN_SCALES.has(s.id)).forEach(s => {
    let family = families.find(f => f.name === s.family);
    if (!family) families.push(family = { name: s.family, scales: [] });
    family.scales.push(s);
  });
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
  select.value = 'major';
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
  flexLayout = { keyName, map: buildFlexKeymap(keyName, scaleId) };
  for (const key in flexLayout.map) {
    if (keyData[key]) keyData[key].green = flexLayout.map[key];
  }
}

const keyBindings = {
  't-green': {
    1: {
      'C3': '1qaz', 'D3': '2wsx', 'E3': '3edc', 'F3': '4rfv', 'G3': '5tgb', 'A3': '6yhn', 'B3': '7ujm',
      'C4': '8ik,', 'D4': '9ol.', 'E4': '0p;/'
    },
    2: {
      'C3': 'zq', 'D3': 'xw', 'E3': 'ce', 'F3': 'vr', 'G3': 'bt', 'A3': 'ny', 'B3': 'mu',
      'C4': '1a,i', 'D4': '2s.o', 'E4': '3d/p', // Note: User bindings were slightly different, this is corrected based on keyData
      'F4': '4f', 'G4': '5g', 'A4': '6h', 'B4': '7j',
      'C5': '8k', 'D5': '9l', 'E5': '0;'
    },
    3: {}, 4: {}
  },
  't-blue': {
    1: {
      'C3': 'zq', 'Db3': 's2', 'D3': 'xw', 'Eb3': 'd3', 'E3': 'ce', 'F3': 'vr', 'Gb3': 'g5', 'G3': 'bt', 'Ab3': 'h6', 'A3': 'ny', 'Bb3': 'j7', 'B3': 'mu',
      'C4': ',i', 'Db4': 'l9', 'D4': '.o', 'Eb4': ';0', 'E4': '/p'
    },
    2: {
        'C3': 'z', 'Db3': 's', 'D3': 'x', 'Eb3': 'd', 'E3': 'c', 'F3': 'v', 'Gb3': 'g', 'G3': 'b', 'Ab3': 'h', 'A3': 'n', 'Bb3': 'j', 'B3': 'm',
        'C4': ',q', 'Db4': 'l2', 'D4': '.w', 'Eb4': ';3', 'E4': '/e',
        'F4': 'r', 'Gb4': '5', 'G4': 't', 'Ab4': '6', 'A4': 'y', 'Bb4': '7', 'B4': 'u',
        'C5': 'i', 'Db5': '9', 'D5': 'o', 'Eb5': '0', 'E5': 'p'
    },
    3: {}, 4: {}
  }
};

function populateDynamicBindings() {
  // Generate bindings for green 3 & 4
  for (let octaves = 3; octaves <= 4; octaves++) {
    const bindings = {};
    for (const key in keyData) {
      const keyInfo = keyData[key].green;
      if (keyInfo) {
        const note = `${keyInfo.note}${keyInfo.octave}`;
        if (!bindings[note]) bindings[note] = '';
        bindings[note] += key;
      }
    }
    keyBindings['t-green'][octaves] = bindings;
  }

  // Generate un-shifted bindings for blue 3 & 4
  for (let octaves = 3; octaves <= 4; octaves++) {
    const bindings = {};
    for (const key in keyData) {
      const keyInfo = keyData[key].blue;
      if (keyInfo) {
        const note = `${keyInfo.note}${keyInfo.octave}`;
        if (!bindings[note]) bindings[note] = '';
        bindings[note] += key;
      }
    }
    keyBindings['t-blue'][octaves] = bindings;
  }

  // Calculate shifted blue bindings just once
  const shiftedBlueBindings = {};
  for (const key in keyData) {
    const keyInfo = keyData[key].blue;
    if (keyInfo) {
      const shiftedNote = `${keyInfo.note}${keyInfo.octave + 2}`;
      const displayKey = key.toUpperCase();
      if (!shiftedBlueBindings[shiftedNote]) {
        shiftedBlueBindings[shiftedNote] = '';
      }
      shiftedBlueBindings[shiftedNote] += displayKey;
    }
  }

  // Merge the shifted bindings into all blue layouts
  for (let octaves = 1; octaves <= 4; octaves++) {
    const targetBindings = keyBindings['t-blue'][octaves];
    for (const note in shiftedBlueBindings) {
      if (targetBindings[note]) {
        targetBindings[note] += shiftedBlueBindings[note];
      } else {
        targetBindings[note] = shiftedBlueBindings[note];
      }
    }
  }
}

fillScaleSelect();
updateFlexLayout('C', 'major');
populateDynamicBindings();

function formatBinding(bindingString) {
    const chars = bindingString.split('');
    if (chars.length === 4) {
        return `${chars[0]}${chars[1]}<br>${chars[2]}${chars[3]}`;
    } else if (chars.length === 2) {
        return `${chars[0]} ${chars[1]}`;
    }
    return bindingString;
}

const KEYBOARD_GUTTER = 10; // px between the keyboard and each side of the screen

function drawKeyboard(numOctaves = 1) {
  whitesEl.innerHTML = '';
  blacksEl.innerHTML = '';
  whiteKeysPhysical = [];
  blackKeysPhysical = [];
  
  const colorMode = toggleStates.color[currentToggleStates.color];
  const namesMode = toggleStates.names[currentToggleStates.names];
  const bindingsMode = toggleStates.bindings[currentToggleStates.bindings];
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
    range = keyDisplayRanges[keyName] || keyDisplayRanges['C'];
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

      if (bindingsMode !== 'deactivated') {
        const binding = keyBindings[layoutMode]?.[numOctaves]?.[note];
        if (binding) {
          const bindingLabel = document.createElement('div');
          bindingLabel.className = 'binding-label';
          bindingLabel.innerHTML = formatBinding(binding);
          div.appendChild(bindingLabel);
          div.classList.add('bindings-active');
        }
      }

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
        label.innerHTML = blackKeyDisplayMap[pc] || '';
        div.appendChild(label);
      }

      if (bindingsMode !== 'deactivated') {
        const binding = keyBindings[layoutMode]?.[numOctaves]?.[note];
        if (binding) {
          const bindingLabel = document.createElement('div');
          bindingLabel.className = 'binding-label';
          bindingLabel.innerHTML = formatBinding(binding);
          div.appendChild(bindingLabel);
          div.classList.add('bindings-active');
        }
      }

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
      if (',./?;:iop90)'.includes(key) && ['C', 'D', 'E', 'Db', 'Eb'].includes(noteName)) {
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
  bindings: ['deactivated', 't-blue'],
  focus: ['deactivated', 't-purple'],
};

const currentToggleStates = {
  color: 1,
  names: 0,
  bindings: 0,
  layout: 't-green', // This is for Flex/Chromatic
  focus: 0, // This is for the new Focus toggle
};

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
function spellMidi(midi, keyName, scaleId) {
  const keyIndex = pitchIndex[keyName];
  const scale = Theory.SCALE_BY_ID[scaleId] || Theory.SCALE_BY_ID.major;
  const tonic = Theory.tonicName(keyIndex, scale.id);
  const degree = Theory.semisToDegree(midi - keyIndex, scale.degrees);
  let { letter, alter } = Theory.spellDegree(tonic, degree);
  const plain = PHYSICAL_NAMES[midi % 12];
  if (!scale.degrees.includes(degree) && alter !== 0 && (Math.abs(alter) > 1 || plain.length === 1)) {
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
    : ['Each row climbs the scale from its first key.',
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

function redraw() { drawKeyboard(currentOctaves); }

function prettyNote(name) { return name[0] + name.slice(1).replace(/#/g, '♯').replace(/b/g, '♭'); }
function tonicName(keyName = currentKey, scaleId = scaleSelector.value) {
  return prettyNote(Theory.tonicName(pitchIndex[keyName], scaleId));
}
function scaleName(scaleId) { return (Theory.SCALE_BY_ID[scaleId] || Theory.SCALE_BY_ID.major).name; }
function noteColor(pc) { const n = PHYSICAL_NAMES[pc]; return noteColors[n] || blackNoteColors[n]; }

// Everything on screen that shows a setting, brought up to date at once.
function renderChrome() {
  const scaleId = scaleSelector.value;
  keyNameBtn.textContent = tonicName();
  const color = noteColor(pitchIndex[currentKey]);
  root.style.setProperty('--tonic', color);
  root.style.setProperty('--tonic-ink', inkFor(color));

  document.querySelectorAll('.seg-btn').forEach(b => {
    const on = (b.dataset.view === 'keys') === keysView;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
  });
  document.querySelectorAll('.oct-btn').forEach(b => b.setAttribute('aria-checked', String(+b.dataset.octaves === currentOctaves)));
  soundSelect.value = currentSound;
  focusBtn.setAttribute('aria-pressed', String(currentToggleStates.focus === 1));
  const chromatic = currentToggleStates.layout === 't-blue';
  layoutBtn.textContent = chromatic ? 'Chromatic' : 'Flex';
  layoutBtn.classList.toggle('is-chromatic', chromatic);
  document.body.classList.toggle('chromatic', chromatic);

  const check = (name, value) => { const r = document.querySelector(`input[name="${name}"][value="${value}"]`); if (r) r.checked = true; };
  check('layout', chromatic ? 'chromatic' : 'flex');
  check('colors', COLOR_MODES[currentToggleStates.color]);
  check('names', NAME_MODES[currentToggleStates.names]);
  check('theme', currentTheme());
  volumeRange.value = Math.round(volume * 100);
  volumeValue.textContent = Math.round(volume * 100) + '%';
  roomRange.value = Math.round(room * 100);
  roomValue.textContent = Math.round(room * 100) + '%';

  if (librarySheet.classList.contains('open')) renderLibrary();
  document.title = `${tonicName()} ${scaleName(scaleId)} — Virtual Keyboard`;
}

function setKey(keyName) {
  currentKey = keyName;
  updateFlexLayout(currentKey, scaleSelector.value);
  redraw();
  renderChrome();
}

function setView(view) {
  keysView = view === 'keys';
  document.body.classList.toggle('keys-view', keysView);
  qwertyView.hidden = !keysView;
  renderQwerty();
  renderChrome();
}

function setLayoutMode(mode) {
  currentToggleStates.layout = mode === 'chromatic' ? 't-blue' : 't-green';
  redraw();
  renderChrome();
}

document.getElementById('key-down').addEventListener('click', () => setKey(PHYSICAL_NAMES[(pitchIndex[currentKey] + 11) % 12]));
document.getElementById('key-up').addEventListener('click', () => setKey(PHYSICAL_NAMES[(pitchIndex[currentKey] + 1) % 12]));
keyNameBtn.addEventListener('click', openKeySheet);

scaleSelector.addEventListener('change', (e) => {
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

layoutBtn.addEventListener('click', () => setLayoutMode(currentToggleStates.layout === 't-blue' ? 'flex' : 'chromatic'));

// Settings
document.querySelectorAll('input[name="layout"]').forEach(r => r.addEventListener('change', () => setLayoutMode(r.value)));
document.querySelectorAll('input[name="colors"]').forEach(r => r.addEventListener('change', () => {
  currentToggleStates.color = COLOR_MODES.indexOf(r.value);
  redraw();
  renderChrome();
}));
document.querySelectorAll('input[name="names"]').forEach(r => r.addEventListener('change', () => {
  currentToggleStates.names = NAME_MODES.indexOf(r.value);
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

function openSheet(id) { document.getElementById(id).classList.add('open'); }
function closeSheet(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.sheet-backdrop').forEach(bd => {
  bd.addEventListener('pointerdown', (e) => { if (e.target === bd) closeSheet(bd.id); });
  bd.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeSheet(bd.id)));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.sheet-backdrop.open').forEach(bd => closeSheet(bd.id));
});
document.getElementById('settings-btn').addEventListener('click', () => { renderChrome(); openSheet('settings-sheet'); });
document.getElementById('library-btn').addEventListener('click', () => {
  document.getElementById('share-row').hidden = true;
  libraryStatus.textContent = '';
  renderLibrary();
  openSheet('library-sheet');
});

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

// -------- LIBRARY (phase 1: send and open a layout; starters) --------
// A layout is what a link or a file carries. It travels as an Eagle View
// Music envelope (EVM Library/README.md §7) without an id: nothing is saved
// yet, so a received layout is simply opened. Saving layouts and scales of
// your own comes with phase two (LIBRARY-PLAN.md). Volume is the listener's
// own and never travels.
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
    view: keysView ? 'keys' : 'piano',
    room
  };
}

// Anything missing or unknown falls back to the default, so every link opens.
function normalizeLayout(src) {
  const d = { ...DEFAULT_LAYOUT };
  if (!src || typeof src !== 'object') return d;
  if (pitchIndex[src.key] !== undefined) d.key = PHYSICAL_NAMES[pitchIndex[src.key]];
  if (src.scale === 'minor') d.scale = 'natural-minor'; // Key Blocks' "Minor": the same notes
  else if (Theory.SCALE_BY_ID[src.scale] && !HIDDEN_SCALES.has(src.scale)) d.scale = src.scale;
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
  keysView = d.view === 'keys';
  document.body.classList.toggle('keys-view', keysView);
  qwertyView.hidden = !keysView;
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

function renderLibrary() {
  const now = getLayout();
  document.getElementById('now-title').textContent = layoutTitle(now);
  document.getElementById('now-note').textContent = layoutNote(now);
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

function toEnvelope(d) {
  return { format: 'evm-item', formatVersion: 1, app: APP_SLUG, kind: 'layout', title: layoutTitle(d), data: d };
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

const shareLinkInput = document.getElementById('share-link');
document.getElementById('make-link-btn').addEventListener('click', () => {
  const link = location.origin + location.pathname + '?layout=' + encodeLink(toEnvelope(getLayout()));
  shareLinkInput.value = link;
  document.getElementById('share-row').hidden = false;
  copyText(link).then(ok => { libraryStatus.textContent = ok ? 'Link copied. Anyone who opens it gets this layout.' : 'Copy the link above to send it.'; });
  shareLinkInput.select();
});
document.getElementById('copy-link-btn').addEventListener('click', () => {
  copyText(shareLinkInput.value).then(ok => { libraryStatus.textContent = ok ? 'Link copied.' : 'Select the link and copy it.'; });
});

document.getElementById('download-btn').addEventListener('click', () => {
  const d = getLayout();
  const blob = new Blob([JSON.stringify(toEnvelope(d), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `virtual-keyboard-${Theory.tonicName(pitchIndex[d.key], d.scale).replace('#', '-sharp').replace(/^([A-G])b/, '$1-flat').toLowerCase()}-${d.scale}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  libraryStatus.textContent = 'Downloaded ' + a.download;
});

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
    const d = readLayout(obj);
    if (!d) { libraryStatus.textContent = 'That file is not a Virtual Keyboard layout.'; return; }
    applyLayout(d);
    libraryStatus.textContent = 'Opened ' + layoutTitle(normalizeLayout(d)) + '.';
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
  applyLayout(d);
  setTimeout(() => toast('Opened ' + layoutTitle(normalizeLayout(d))), 300);
}

// -------- START --------
try { if (window.self !== window.top) root.classList.add('in-iframe'); } catch (e) { root.classList.add('in-iframe'); }
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

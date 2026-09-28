/* ==========================================================================
   Song Writer — core.js
   --------------------------------------------------------------------------
   The one global, `window.SW`, and what every other file leans on:

     SW.bus      a tiny event bus — the only way components hear about the
                 score, so a new component never has to be threaded through
                 the editing code (see EVENTS below)
     SW.state    the session state 1.0 kept in loose globals
     SW.music    1.0's colour, spelling, chord and frequency tables, verbatim
     SW.values   note values (durations) for the Value circles
     SW.ui       toast, sheets, popovers, clipboard, link encoding

   Files load in this order (see index.html): core → audio → engrave → score
   → library → settings → components → app. Each is an IIFE that adds its
   own namespace to SW and calls the others through SW at call time, so the
   order only matters for what runs at load.
   ========================================================================== */
(function () {
  'use strict';

  const SW = window.SW = window.SW || {};

  /* ------------------------------------------------------------------
     EVENT BUS

     EVENTS (detail in braces):
       'selection'      { note, stack, syllable, line }  — or all null.
                        Fired whenever the active block changes.
       'score:changed'  { reason }  after any edit that reached the DOM
       'score:loaded'   {}          a song was drawn from scratch
       'key:changed'    { key }
       'scale:changed'  { scale }                the song's scale (score.js setScale)
       'chords:changed' { why }                  the chord board, set, slots or scale changed (chords.js)
       'mods:changed'   { held }                 Z X C V B held or let go
       'names:changed'  { on }
       'mode:changed'   { editing }
       'chord:played'   { id, midis, source }  'strip' | 'lane' | 'key' | 'number' | 'editor'
       'chord:cleared'  {}                       the chord's notes leave the keyboard (chords.js clearSounding)
       'view:changed'   { view }    any View-popover setting
       'layout:changed' { layout }  Layout settings (what can be built)
       'policy:changed' { policy }  a lesson opened, closed or previewed
       'song:opened'    { id, title }
     ------------------------------------------------------------------ */
  const listeners = {};
  SW.bus = {
    on(evt, fn) {
      (listeners[evt] = listeners[evt] || []).push(fn);
      return () => SW.bus.off(evt, fn);
    },
    off(evt, fn) {
      const list = listeners[evt];
      if (!list) return;
      const at = list.indexOf(fn);
      if (at !== -1) list.splice(at, 1);
    },
    emit(evt, detail) {
      (listeners[evt] || []).slice().forEach(fn => {
        try { fn(detail || {}); } catch (e) { console.error('[SW.bus] ' + evt, e); }
      });
    }
  };

  /* ------------------------------------------------------------------
     SESSION STATE — what 1.0 held in globals. Most of it is not stored:
     1.0 opened every visit with names off and edit off, and so does this.
     The workspace (strip, dock, lane) and the section colours are View
     preferences and live in SW.settings.view instead.
     ------------------------------------------------------------------ */
  SW.state = {
    key: 'C',
    editing: false,          // the construction hat
    showNames: false,        // the glasses
    colorScheme: true,       // section colours (a View choice, remembered — settings.js)
    present: false,          // Present mode: full screen, Play · ‹ › · Exit
    accidentalMode: 'natural',
    meter: '4/4',            // the song's time signature (stored in the score)
    bpm: 100,                // the song's tempo (stored in the score)
    playing: false,          // SW.player is running the song
    scale: 'major',          // the song's scale (Theory.SCALES id; stored in the score) — drives the chord panel
    board: {},               // the song's re-chorded places on the panel: { d: { root, q, mods, label? } } (js/chords.js)
    selectedChord: null,     // { place, id } — the panel chord last pressed (1.0: selectedChord)
    soundingChord: null,     // { id, midis } — what the left hand is holding
    /* Sound (the popover): what Play lets you hear. Reset every visit,
       as Rhythm Poetry's switches are; Chords and Chord voicing are View
       preferences and are remembered (settings.js). */
    sound: { melody: true, beat: false, countIn: true, atEnd: 'stop' }
  };

  /* ------------------------------------------------------------------
     MUSIC TABLES — copied from Song Writer 1.0 without change, so every
     colour, spelling and pitch is what 1.0 drew and played.
     ------------------------------------------------------------------ */
  const colorSchemeRed = { 'Do': '#FF3B30', 'Re': '#FF9500', 'Mi': '#FFCC00', 'Fa': '#34C759', 'So': '#48C4C8', 'La': '#007AFF', 'Ti': '#AF52DE' };
  const colorSchemeOrange = { 'Do': '#FF9500', 'Re': '#FFCC00', 'Mi': '#34C759', 'Fa': '#48C4C8', 'So': '#007AFF', 'La': '#AF52DE', 'Ti': '#FF3B30' };
  const colorSchemeYellow = { 'Do': '#FFCC00', 'Re': '#34C759', 'Mi': '#48C4C8', 'Fa': '#007AFF', 'So': '#AF52DE', 'La': '#FF3B30', 'Ti': '#FF9500' };
  const colorSchemeGreen = { 'Do': '#34C759', 'Re': '#48C4C8', 'Mi': '#007AFF', 'Fa': '#AF52DE', 'So': '#FF3B30', 'La': '#FF9500', 'Ti': '#FFCC00' };
  const colorSchemeTurquoise = { 'Do': '#48C4C8', 'Re': '#007AFF', 'Mi': '#AF52DE', 'Fa': '#FF3B30', 'So': '#FF9500', 'La': '#FFCC00', 'Ti': '#34C759' };
  const colorSchemeBlue = { 'Do': '#007AFF', 'Re': '#AF52DE', 'Mi': '#FF3B30', 'Fa': '#FF9500', 'So': '#FFCC00', 'La': '#34C759', 'Ti': '#48C4C8' };
  const colorSchemePurple = { 'Do': '#AF52DE', 'Re': '#FF3B30', 'Mi': '#FF9500', 'Fa': '#FFCC00', 'So': '#34C759', 'La': '#48C4C8', 'Ti': '#007AFF' };

  const noteColorsByKey = {
    'C': colorSchemeRed, 'C#': colorSchemeRed,
    'Db': colorSchemeOrange, 'D': colorSchemeOrange, 'D#': colorSchemeOrange,
    'Eb': colorSchemeYellow, 'E': colorSchemeYellow,
    'F': colorSchemeGreen, 'F#': colorSchemeGreen,
    'Gb': colorSchemeTurquoise, 'G': colorSchemeTurquoise, 'G#': colorSchemeTurquoise,
    'Ab': colorSchemeBlue, 'A': colorSchemeBlue, 'A#': colorSchemeBlue,
    'Bb': colorSchemePurple, 'B': colorSchemePurple
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

  /* The same palette read by letter, for chords 1.0 never had (the strip's
     extended row): a chord takes the colour of its root's letter, which is
     exactly what 1.0's solfège mapping works out to for its nine. */
  const LETTER_COLORS = { C: '#FF3B30', D: '#FF9500', E: '#FFCC00', F: '#34C759', G: '#48C4C8', A: '#007AFF', B: '#AF52DE' };

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
    'C#': { 'Do': 'C#', 'Re': 'D#', 'Mi': 'E#', 'Fa': 'F#', 'So': 'G#', 'La': 'A#', 'Ti': 'B#' },
    'D#': { 'Do': 'D#', 'Re': 'E#', 'Mi': 'F##', 'Fa': 'G#', 'So': 'A#', 'La': 'B#', 'Ti': 'C##' },
    'F#': { 'Do': 'F#', 'Re': 'G#', 'Mi': 'A#', 'Fa': 'B', 'So': 'C#', 'La': 'D#', 'Ti': 'E#' },
    'G#': { 'Do': 'G#', 'Re': 'A#', 'Mi': 'B#', 'Fa': 'C#', 'So': 'D#', 'La': 'E#', 'Ti': 'F##' },
    'A#': { 'Do': 'A#', 'Re': 'B#', 'Mi': 'C##', 'Fa': 'D#', 'So': 'E#', 'La': 'F##', 'Ti': 'G##' }
  };

  const chordColorMapping = {
    'I': 'Do', 'ii': 'Re', 'iii': 'Mi', 'IV': 'Fa', 'V': 'So', 'vi': 'La',
    'V/V': 'Re', 'V/vi': 'Mi', 'IV/IV': 'Ti'
  };

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
    'Ab': { semitones: 8, octaveShift: -1 },
    'A': { semitones: 9, octaveShift: -1 },
    'Bb': { semitones: 10, octaveShift: -1 },
    'B': { semitones: 11, octaveShift: -1 },
    'C#': { semitones: 1, octaveShift: 0 },
    'D#': { semitones: 3, octaveShift: 0 },
    'F#': { semitones: 6, octaveShift: 0 },
    'G#': { semitones: 8, octaveShift: 0 },
    'A#': { semitones: 10, octaveShift: -1 }
  };

  /* Letter keys in Edit mode, as 1.0 had them. */
  const solfegeKeyMap = {
    'z': 'so-low', 'x': 'la-low', 'c': 'ti-low', 'v': 'do',
    'a': 'do', 's': 're', 'd': 'mi', 'f': 'fa', 'g': 'so', 'h': 'la', 'j': 'ti',
    'k': 'do-high', 'q': 'do-high', 'w': 're-high', 'e': 'mi-high', 'r': 'fa-high',
    't': 'so-high', 'y': 'la-high'
  };

  const SOLFEGE_INTERVALS = { 'Do': 0, 'Re': 2, 'Mi': 4, 'Fa': 5, 'So': 7, 'La': 9, 'Ti': 11 };
  const DEFAULT_SOLFEGE_OCTAVE = 4;

  const KEY_SIGNATURES_CHROMATIC_INDEX = {
    'C': 0, 'Db': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'Gb': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11,
    'C#': 1, 'D#': 3, 'F#': 6, 'G#': 8, 'A#': 10
  };

  /* The keys the key button offers, in 1.0's order. */
  const KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

  const noteOrder = [
    'mi-low', 'fa-low', 'so-low', 'la-low', 'ti-low',
    'do', 're', 'mi', 'fa', 'so', 'la', 'ti',
    'do-high', 're-high', 'mi-high', 'fa-high', 'so-high', 'la-high'
  ];

  const noteToSolfege = {
    'mi-low': 'Mi', 'fa-low': 'Fa', 'so-low': 'So', 'la-low': 'La', 'ti-low': 'Ti',
    'do': 'Do', 're': 'Re', 'mi': 'Mi', 'fa': 'Fa', 'so': 'So', 'la': 'La', 'ti': 'Ti',
    'do-high': 'Do', 're-high': 'Re', 'mi-high': 'Mi', 'fa-high': 'Fa', 'so-high': 'So', 'la-high': 'La'
  };

  const noteToShorthandMap = {
    'mi-low': 'M-1', 'fa-low': 'F-1', 'so-low': 'S-1', 'la-low': 'L-1', 'ti-low': 'T-1',
    'do': 'D1', 're': 'R1', 'mi': 'M1', 'fa': 'F1', 'so': 'S1', 'la': 'L1', 'ti': 'T1',
    'do-high': 'D2', 're-high': 'R2', 'mi-high': 'M2', 'fa-high': 'F2', 'so-high': 'S2', 'la-high': 'L2'
  };

  const shorthandToNoteMap = {
    'M-1': 'mi-low', 'F-1': 'fa-low', 'S-1': 'so-low', 'L-1': 'la-low', 'T-1': 'ti-low',
    'D1': 'do', 'R1': 're', 'M1': 'mi', 'F1': 'fa', 'S1': 'so', 'L1': 'la', 'T1': 'ti',
    'D2': 'do-high', 'R2': 're-high', 'M2': 'mi-high', 'F2': 'fa-high', 'S2': 'so-high', 'L2': 'la-high'
  };

  /* 1.0's bar heights in px at block size 100%. style.css repeats them as
     calc(N * var(--bs)); keep the two in step. */
  const NOTE_HEIGHTS = {
    'mi-low': 20, 'fa-low': 25, 'so-low': 30, 'la-low': 40, 'ti-low': 50,
    'do': 60, 're': 70, 'mi': 80, 'fa': 90, 'so': 100, 'la': 110, 'ti': 120,
    'do-high': 130, 're-high': 140, 'mi-high': 150, 'fa-high': 160, 'so-high': 170, 'la-high': 180
  };

  const LINE_COLORS = ['#e3f2fd', '#fff8e1', '#fce4ec', '#e8f5e9'];

  /* ---- small derived helpers ---- */

  function displayKey(k) {
    return String(k || '').replace('b', '♭').replace('#', '♯');
  }

  function noteClassOf(el) {
    return el ? Array.from(el.classList).find(c => noteOrder.indexOf(c) !== -1) || null : null;
  }

  /* octave offset of a note class: -1, 0 or +1 */
  function octaveOf(noteClass) {
    if (noteClass.endsWith('-low')) return -1;
    if (noteClass.endsWith('-high')) return 1;
    return 0;
  }

  /* The MIDI number a block sounds, by exactly 1.0's arithmetic
     (calculateFrequency counts semitones from C0; MIDI 12 is C0). */
  function noteMidi(noteClass, accidental, key) {
    const k = key || SW.state.key;
    const tonic = KEY_SIGNATURES_CHROMATIC_INDEX[k];
    const sol = noteToSolfege[noteClass];
    if (tonic === undefined || !sol) return null;
    const shift = KEY_TRANSPOSITION[k] ? (KEY_TRANSPOSITION[k].octaveShift || 0) : 0;
    const acc = accidental === 'sharp' ? 1 : accidental === 'flat' ? -1 : 0;
    return 12 + tonic + (DEFAULT_SOLFEGE_OCTAVE + shift) * 12 + SOLFEGE_INTERVALS[sol] + acc + octaveOf(noteClass) * 12;
  }

  /* 'C#4' / 'Bb3' → MIDI */
  const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function midiFromName(name) {
    const m = /^([A-G])([#b]*)(-?\d+)$/.exec(String(name));
    if (!m) return null;
    let pc = LETTER_PC[m[1]];
    for (const ch of m[2]) pc += ch === '#' ? 1 : -1;
    return 12 * (parseInt(m[3], 10) + 1) + pc;
  }

  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  /* Written spelling of a block: letter, alteration and octave, for the
     staff. The letter comes from 1.0's table for the key (so F♯ in D is
     F♯, not G♭); the block's own ♯/♭ is added on top. */
  function spellNote(noteClass, accidental, key) {
    const k = key || SW.state.key;
    const sol = noteToSolfege[noteClass];
    const base = (letterNamesByKey[k] || letterNamesByKey.C)[sol] || 'C';
    const letter = base.charAt(0);
    let alter = 0;
    for (const ch of base.slice(1)) alter += ch === '#' ? 1 : -1;
    alter += accidental === 'sharp' ? 1 : accidental === 'flat' ? -1 : 0;
    const midi = noteMidi(noteClass, accidental, k);
    const octave = Math.round((midi - LETTER_PC[letter] - alter) / 12) - 1;
    return { letter, alter, octave, midi };
  }

  SW.music = {
    noteColorsByKey, keySignatureColors, LETTER_COLORS, letterNamesByKey, chordColorMapping,
    chordNamesByKey, NOTE_FREQUENCIES, BASE_CHORD_VOICINGS, CHROMATIC_NOTES, KEY_TRANSPOSITION,
    solfegeKeyMap, SOLFEGE_INTERVALS, DEFAULT_SOLFEGE_OCTAVE, KEY_SIGNATURES_CHROMATIC_INDEX, KEYS,
    noteOrder, noteToSolfege, noteToShorthandMap, shorthandToNoteMap, NOTE_HEIGHTS, LINE_COLORS,
    LETTER_PC, displayKey, noteClassOf, octaveOf, noteMidi, midiFromName, midiToFreq, spellNote
  };

  /* ------------------------------------------------------------------
     NOTE VALUES

     Counted in ticks, 24 to a quarter, as every Eagle View notation app
     is (NOTATION-README.md). `q` is the value every block has until it is
     given another, and is never written into the song text, so a 1.0
     song round-trips unchanged.

     `base` is the undotted value a dotted one belongs to; the Value
     circles show the five bases (as Rhythm Poetry's EASY row shows five
     rhythms) and a dot switch beside them.
     ------------------------------------------------------------------ */
  const VALUES = [
    { id: 'w',  name: 'Whole note',          ticks: 96, base: 'w', dotted: false },
    { id: 'h.', name: 'Dotted half note',    ticks: 72, base: 'h', dotted: true },
    { id: 'h',  name: 'Half note',           ticks: 48, base: 'h', dotted: false },
    { id: 'q.', name: 'Dotted quarter note', ticks: 36, base: 'q', dotted: true },
    { id: 'q',  name: 'Quarter note',        ticks: 24, base: 'q', dotted: false },
    { id: 'e.', name: 'Dotted eighth note',  ticks: 18, base: 'e', dotted: true },
    { id: 'e',  name: 'Eighth note',         ticks: 12, base: 'e', dotted: false },
    { id: 's',  name: 'Sixteenth note',      ticks: 6,  base: 's', dotted: false }
  ];
  const VALUE_BY_ID = {};
  VALUES.forEach(v => { VALUE_BY_ID[v.id] = v; });

  /* Rhythm Poetry's EASY colours, in the same order: one colour per base
     value, so a colour means the same length wherever it is drawn. */
  const EASY_COLOURS = ['#E5484D', '#F59E0B', '#22A55B', '#2E90D9', '#8E4EC6'];
  const BASES = ['w', 'h', 'q', 'e', 's'];
  const BASE_COLOUR = {};
  BASES.forEach((b, i) => { BASE_COLOUR[b] = EASY_COLOURS[i]; });

  SW.values = {
    LIST: VALUES,
    BASES,
    /* What a BLOCK counts as. A column with no value is a block — pitch
       only, its length undecided. For bar lines and playback it is taken
       as one beat, a quarter, until it is written. */
    DEFAULT: 'q',
    TICKS_PER_QUARTER: 24,
    byId: id => VALUE_BY_ID[id] || VALUE_BY_ID.q,
    isValid: id => !!VALUE_BY_ID[id],
    colour: id => BASE_COLOUR[(VALUE_BY_ID[id] || VALUE_BY_ID.q).base],
    /* the dotted or plain version of a base, or null if there is none */
    withDot(base, dotted) {
      const v = VALUES.find(x => x.base === base && x.dotted === !!dotted);
      return v ? v.id : null;
    }
  };

  /* ------------------------------------------------------------------
     METERS — the time signatures the staff can be barred in. The beat is
     a quarter (24 ticks) in all of them; compound meters (6/8) will add a
     36-tick beat when they arrive. Each line of the song starts a new
     bar (a line is a phrase), and a bar that ends short is padded with
     silence in playback.
     ------------------------------------------------------------------ */
  const METERS = [
    { id: '2/4', beats: 2, beatTicks: 24, top: 2, bottom: 4 },
    { id: '3/4', beats: 3, beatTicks: 24, top: 3, bottom: 4 },
    { id: '4/4', beats: 4, beatTicks: 24, top: 4, bottom: 4 }
  ];
  const METER_BY_ID = {};
  METERS.forEach(m => { m.barTicks = m.beats * m.beatTicks; METER_BY_ID[m.id] = m; });
  SW.meters = {
    LIST: METERS,
    DEFAULT: '4/4',
    DEFAULT_BPM: 100,
    byId: id => METER_BY_ID[id] || METER_BY_ID['4/4'],
    isValid: id => !!METER_BY_ID[id],
    /* The family's tempo range (Rhythm Poetry, Ostinato Builder, the
       Music Stand): 30–300 BPM. Songs written when it was 40–200 read
       unchanged. */
    MIN_BPM: 30,
    MAX_BPM: 300,
    clampBpm: b => Math.max(30, Math.min(300, Math.round(Number(b)) || 100))
  };

  /* ------------------------------------------------------------------
     UI HELPERS — ported from Rhythm Poetry 2.0 so the sheets, popovers
     and toasts behave identically across the apps.
     ------------------------------------------------------------------ */
  const ui = SW.ui = {};

  let toastTimer = null;
  ui.toast = function (message) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  };

  ui.openSheet = function (id) {
    ui.closeAllPopovers();
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
  };
  ui.closeSheet = function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
    SW.bus.emit('sheet:closed', { id });
  };
  ui.isSheetOpen = function () {
    return !!document.querySelector('.sheet-backdrop.show');
  };

  /* Popovers: each is paired with the button that opens it. Registered by
     whichever module owns the popover. opts.guard() may refuse the open
     (and say why in a toast) — the key when a lesson fixes it, say. */
  const popovers = [];
  const el = x => (typeof x === 'string' ? document.getElementById(x) : x);
  ui.registerPopover = function (btnId, popId, onOpen, opts) {
    const b = el(btnId), p = el(popId);
    if (!b || !p) return;
    const o = opts || {};
    popovers.push({ b, p });
    b.addEventListener('click', e => {
      e.stopPropagation();
      if (o.guard && !o.guard()) return;
      const wasOpen = p.classList.contains('show');
      ui.closeAllPopovers();
      if (!wasOpen) ui.showPopover(b, p, onOpen);
    });
    p.addEventListener('click', e => e.stopPropagation());
  };
  ui.showPopover = function (btnEl, popEl, onOpen) {
    if (onOpen) onOpen();
    document.querySelectorAll('.hover-gauge.show').forEach(g => g.classList.remove('show'));
    popEl.classList.add('show');
    if (btnEl) btnEl.classList.add('open');
    ui.positionPopover(btnEl, popEl);
  };
  ui.closeAllPopovers = function () {
    popovers.forEach(({ b, p }) => { p.classList.remove('show'); b.classList.remove('open'); });
    document.querySelectorAll('.popover.show').forEach(p => p.classList.remove('show'));
    document.querySelectorAll('.open[data-popover-anchor]').forEach(b => b.classList.remove('open'));
  };
  ui.isPopoverOpen = function () {
    return !!document.querySelector('.popover.show');
  };
  /* Above the button (the toolbar is at the bottom), or below it when the
     button is in the upper half of the screen. On a phone every popover
     pins full width above the toolbar (the family's rule); the CSS reads
     the toolbar's real height, so a two-row toolbar is never covered. */
  ui.positionPopover = function (btnEl, popEl) {
    if (window.innerWidth <= 720 || !btnEl) {
      popEl.style.left = popEl.style.right = popEl.style.top = popEl.style.bottom = '';
      popEl.classList.add('pinned');
      return;
    }
    popEl.classList.remove('pinned');
    const r = btnEl.getBoundingClientRect();
    const width = popEl.offsetWidth || 300;
    let left = r.left + r.width / 2 - width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - width - 12));
    popEl.style.left = left + 'px';
    popEl.style.right = 'auto';
    if (r.top > window.innerHeight / 2) {
      popEl.style.top = 'auto';
      popEl.style.bottom = (window.innerHeight - r.top + 10) + 'px';
      popEl.style.maxHeight = Math.max(160, r.top - 22) + 'px';
    } else {
      popEl.style.bottom = 'auto';
      popEl.style.top = (r.bottom + 10) + 'px';
      popEl.style.maxHeight = Math.max(160, window.innerHeight - r.bottom - 22) + 'px';
    }
  };

  /* ------------------------------------------------------------------
     THE HOVER GAUGES (Rhythm Poetry's): a mouse resting on the BPM chip
     or on View shows a slider pill above it. A real mouse only — a
     smart board or a touch laptop can claim to hover precisely, and then
     a finger's tap would open the gauge on top of the tap's own action.
     ------------------------------------------------------------------ */
  ui.canHoverPrecisely = function () {
    return !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  };
  ui.positionAbove = function (triggerEl, floatEl) {
    const r = triggerEl.getBoundingClientRect();
    floatEl.style.top = 'auto';
    floatEl.style.bottom = (window.innerHeight - r.top + 10) + 'px';
    const width = floatEl.offsetWidth || 250;
    let left = r.left + r.width / 2 - width / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - width - 10));
    floatEl.style.left = left + 'px';
    floatEl.style.right = 'auto';
  };
  ui.setupHoverGauge = function ({ trigger, wrap, slider, label, getValue, getRange, format, onInput, onChange, isDisabled }) {
    if (!trigger || !wrap || !slider) return;
    let hideTimer = null;
    let dragging = false;
    function show() {
      if (!ui.canHoverPrecisely()) return;
      if (isDisabled && isDisabled()) return;
      if (ui.isPopoverOpen()) return;
      clearTimeout(hideTimer);
      if (getRange) { const r = getRange(); slider.min = r[0]; slider.max = r[1]; }
      const v = getValue();
      slider.value = v;
      if (label) label.textContent = format(v);
      wrap.classList.add('show');
      ui.positionAbove(trigger, wrap);
    }
    function scheduleHide() {
      clearTimeout(hideTimer);
      // a grace period, so moving from the button up into the gauge
      // (there is a gap between them) does not make it vanish
      hideTimer = setTimeout(() => { if (!dragging) wrap.classList.remove('show'); }, 150);
    }
    trigger.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(); });
    trigger.addEventListener('mouseleave', scheduleHide);
    trigger.addEventListener('click', () => { clearTimeout(hideTimer); wrap.classList.remove('show'); });
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
    if (onChange) slider.addEventListener('change', () => onChange(parseInt(slider.value, 10)));
  };

  /* The toolbar's real height, as --toolbar-real: the toast, the preview
     bar and a pinned popover sit above it however many rows it takes. */
  ui.trackToolbar = function () {
    const bar = document.getElementById('toolbar');
    if (!bar) return;
    const set = () => document.documentElement.style.setProperty('--toolbar-real', bar.offsetHeight + 'px');
    set();
    if (window.ResizeObserver) new ResizeObserver(set).observe(bar);
    else window.addEventListener('resize', set);
  };

  document.addEventListener('click', () => ui.closeAllPopovers());

  /* Wire [data-close] buttons and backdrop taps once the DOM is there.
     Press and release both have to land on the backdrop itself, so a drag
     that starts inside a sheet never dismisses it (Rhythm Poetry's rule). */
  ui.wireSheets = function () {
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => ui.closeSheet(btn.getAttribute('data-close')));
    });
    document.querySelectorAll('.sheet-backdrop').forEach(bd => {
      let downOnBackdrop = false;
      bd.addEventListener('pointerdown', e => { downOnBackdrop = (e.target === bd); });
      bd.addEventListener('pointerup', e => {
        if (e.target === bd && downOnBackdrop) ui.closeSheet(bd.id);
        downOnBackdrop = false;
      });
      bd.addEventListener('pointercancel', () => { downOnBackdrop = false; });
    });
  };

  /* Clipboard with the execCommand fallback: on plain http (a school
     network) navigator.clipboard is absent, not merely refused. */
  ui.copyText = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  /* Key order is not promised anywhere, so a plain stringify would call two
     identical songs different. Used for the auto-save fingerprint. */
  ui.stableStringify = function stableStringify(value) {
    if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
    if (value && typeof value === 'object') {
      return '{' + Object.keys(value).sort()
        .map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
    }
    return JSON.stringify(value === undefined ? null : value);
  };

  /* JSON <-> base64 through UTF-8, as both 1.0 and Rhythm Poetry encode links. */
  ui.encodeJson = function (data) {
    const bytes = new TextEncoder().encode(JSON.stringify(data));
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  };
  ui.decodeJson = function (b64) {
    try {
      let s = String(b64);
      try { s = decodeURIComponent(s); } catch (e) {}
      const bin = atob(s);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
      console.error('Could not read link data:', e);
      return null;
    }
  };

  ui.switchRow = function (name, desc, on, onClick, opts) {
    const o = opts || {};
    const btn = document.createElement('button');
    btn.className = 'switch-row' + (on ? ' active' : '') + (o.soon ? ' soon' : '');
    btn.innerHTML = '<span class="switch-name"></span><span class="switch-desc"></span><span class="switch-pill"></span>';
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
  };

  ui.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* '#FF3B30' + .16 → 'rgba(255, 59, 48, 0.16)'. Used instead of CSS
     color-mix() for anything inside the score: html2canvas 1.4.1 (the
     picture export) throws on the color() values color-mix computes to. */
  ui.tint = function (hex, alpha) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex || ''));
    if (!m) return 'rgba(140, 120, 150, ' + alpha + ')';
    return 'rgba(' + parseInt(m[1], 16) + ', ' + parseInt(m[2], 16) + ', ' + parseInt(m[3], 16) + ', ' + alpha + ')';
  };

  /* ------------------------------------------------------------------
     Labels on a board (Rhythm Poetry): press and hold an icon-only button
     on a touch screen and its title arrives in the toast; the click that
     follows the release is swallowed.
     ------------------------------------------------------------------ */
  (function labelsOnHold() {
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) return;
    const HOLD_MS = 450, SLOP = 10;
    let timer = null, sx = 0, sy = 0, labelled = null;
    const cancel = () => { clearTimeout(timer); timer = null; };
    document.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      const el = e.target.closest('[title]');
      if (!el) return;
      if (el.closest('[data-hold]')) return;         // a control that is MEANT to be held (the Z X C V B tabs) gets no label
      const text = el.getAttribute('title');
      if (!text) return;
      sx = e.clientX; sy = e.clientY;
      cancel();
      timer = setTimeout(() => { timer = null; labelled = el; ui.toast(text); }, HOLD_MS);
    }, true);
    document.addEventListener('pointermove', e => {
      if (timer && (Math.abs(e.clientX - sx) > SLOP || Math.abs(e.clientY - sy) > SLOP)) cancel();
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
})();

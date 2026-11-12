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

  /* SONG WRITER 3.5 (the 3.0 sandbox, renamed 2026-11-03 when it gained
     parts; its Library became song boxes 2026-11-11) keeps its own keys
     (song_writer_35_*), so on an origin it shares with 3.0, 2.5 and 2.0 —
     eagleviewmusic.com — none can harm the others' songs (3.0 would read a
     song with parts as its Part 1 alone). The first run copies the newest
     older library across, once: 3.0's (or 2.5's, or 2.0's), with its View
     and Layout settings, lessons, syllable choices and chord drafts. The
     older keys are only read, never written. (3.0 did the same with 2.5's,
     2.5 with 2.0's.)

     "SONG WRITER 3.5.1" (2026-11-11): for an evening the song boxes were
     tried out as 3.5.1, at its own address with its own keys
     (song_writer_351_*, copied from 3.5's), before they became 3.5. What
     was saved there comes home here, once (FROM_351). A device that never
     ran 3.5 takes 3.5.1's library whole, boxes and all (carryOver). Any
     other goes song by song (foldBack351): a song only 3.5.1 has joins this
     library; a song both have keeps the copy saved last, except a
     built-in, which keeps 3.5.1's (3.5.1 gave back a built-in changed in
     place as it came, the changes becoming a song of their own, and that
     song comes too, so 3.5 has nothing left to split). 3.5.1's boxes come
     along while this library has none. Book songs stay with the shelf. The
     351 keys are only read. */
  const FROM_351 = 'song_writer_35_from_351_v1';
  (function foldBack351() {
    try {
      if (localStorage.getItem(FROM_351)) return;
      const theirs = localStorage.getItem('song_writer_351_library_v1');
      const ours = localStorage.getItem('song_writer_35_library_v1');
      if (!theirs || !ours) return;   // nothing to bring home, or carryOver takes it whole
      const lib = JSON.parse(ours), got = JSON.parse(theirs);
      if (!lib || typeof lib !== 'object' || !got || typeof got !== 'object') return;
      let n = 0;
      Object.keys(got).forEach(id => {
        const r = got[id], o = lib[id];
        if (!r || typeof r !== 'object' || (r.received && r.book)) return;
        const builtin = !r.isCustom && !r.received && String(id).indexOf('lesson_') !== 0;
        if (o && !builtin && (r.updatedAt || 0) <= (o.updatedAt || 0)) return;
        if (o && JSON.stringify(o) === JSON.stringify(r)) return;
        lib[id] = r;
        n++;
      });
      if (n) localStorage.setItem('song_writer_35_library_v1', JSON.stringify(lib));
      const boxes = localStorage.getItem('song_writer_351_boxes_v1');
      if (boxes !== null && localStorage.getItem('song_writer_35_boxes_v1') === null) localStorage.setItem('song_writer_35_boxes_v1', boxes);
      localStorage.setItem(FROM_351, '1');
    } catch (e) { /* storage blocked or unreadable: 3.5's own library as it is */ }
  })();
  (function carryOver() {
    try {
      if (localStorage.getItem('song_writer_35_library_v1')) return;
      const from = ['song_writer_351_', 'song_writer_30_', 'song_writer_25_'].find(p => localStorage.getItem(p + 'library_v1')) || 'song_writer_2_';
      localStorage.setItem(FROM_351, '1');
      ['library_v1', 'active_song_v1', 'view_prefs_v1', 'layout_v1', 'lessons_v1', 'lesson_sources_v1',
       'syllable_choices_v1', 'skip_delete_section_confirm', 'chord_drafts_v1', 'boxes_v1'].forEach(k => {
        let v = localStorage.getItem(from + k);
        /* not the Teacher Library's songs: an older app's copy of one may be missing what only
           a newer app reads (2.5 drops instrumental bars and the Chord Chart, 3.0 drops parts),
           and the shelf would keep it (same date). The shelf files them fresh from the books
           out (2026-10-30). */
        if (v !== null && k === 'library_v1') {
          try {
            const lib = JSON.parse(v);
            Object.keys(lib).forEach(id => { const r = lib[id]; if (r && r.received && r.book) delete lib[id]; });
            v = JSON.stringify(lib);
          } catch (e) { /* unreadable: copied as it is, as before */ }
        }
        if (v !== null && localStorage.getItem('song_writer_35_' + k) === null) localStorage.setItem('song_writer_35_' + k, v);
      });
    } catch (e) { /* storage blocked: start fresh */ }
  })();

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
       'names:changed'  { on, mode }
       'mode:changed'   { editing }
       'chord:played'   { id, midis, source }  'strip' | 'lane' | 'key' | 'number' | 'editor' | 'mod' (a held chord struck again) | 'track' (Play)
       'chord:cleared'  {}                       the chord's notes leave the keyboard (chords.js clearSounding)
       'view:changed'   { view }    any View-popover setting
       'layout:changed' { layout }  Layout settings (what can be built)
       'policy:changed' { policy }  a lesson opened, closed or previewed
       'song:opened'    { id, title }
       'track:changed'  { why }                  progressions or the chord track changed (track.js; after score:changed)
       'track:sounding' { at, event }            Play reached a chord of the track (player.js)
       'track:bar'      { bar }                  Play reached a bar past the melody (player.js)
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
     The workspace (strip, dock, chord track) and the section colours are View
     preferences and live in SW.settings.view instead.
     ------------------------------------------------------------------ */
  SW.state = {
    key: 'C',
    editing: false,          // the construction hat
    showNames: false,        // any note names out (Look → Display Note Names; the glasses until 2026-10-31)
    names: 'off',            //   which: 'off' | 'letter' | 'sol' (score.js setNames)
    colorScheme: true,       // section colours (a View choice, remembered — settings.js)
    present: false,          // Present mode: full screen, Play · ‹ › · Exit
    accidentalMode: 'natural',
    meter: '4/4',            // the song's time signature (stored in the score)
    bpm: 100,                // the song's tempo (stored in the score)
    swing: '',               // the song's swing: '' (none) | '8' | '16' (stored in the score; timing.js SWING)
    playing: false,          // SW.player is running the song
    scale: 'major',          // the song's scale (Theory.SCALES id; stored in the score) — drives the chord panel
    board: {},               // the song's re-chorded places on the panel: { d: { root, q, mods, label? } } (js/chords.js)
    progressions: [],        // the song's chord progressions (js/track.js)
    track: [],               // where they play: stretches of bars (js/track.js)
    selectedChord: null,     // { place, id } — the panel chord last pressed (1.0: selectedChord)
    soundingChord: null,     // { id, midis } — what the left hand is holding
    /* Sound (the popover): what Play lets you hear. Reset every visit,
       as Rhythm Poetry's switches are; Chords is a View preference and
       is remembered (settings.js). */
    sound: { melody: true, beat: false, countIn: false, atEnd: 'stop' }   // count-in off to start (user, 2026-10-29)
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

  /* The rungs, low to high: 1.0's eighteen (mi, … la″) and, since
     2026-10-31 (the user), low do and re under them and ti″ and the do two
     octaves up over them — twenty-two. The top do is `do-high2`
     (octaveOf 2); older Song Writers drop the four new rungs on reading. */
  const noteOrder = [
    'do-low', 're-low',
    'mi-low', 'fa-low', 'so-low', 'la-low', 'ti-low',
    'do', 're', 'mi', 'fa', 'so', 'la', 'ti',
    'do-high', 're-high', 'mi-high', 'fa-high', 'so-high', 'la-high',
    'ti-high', 'do-high2'
  ];
  /* EVERY RUNG a note may be on (2026-10-31, KEY CHANGES — js/keys.js):
     the twenty-two above, which are each key's own range, and a further
     octave's worth at each end — do,, … ti,, under low do and re″ … ti″′
     over the top do — for Create Key Change, where the range is the
     same few octaves of real pitch in every key (A♭2, the lowest note A♭
     has, to G6, the highest G has), so a key whose do sits high reaches
     lower than its own low do, and one whose do sits low higher than its
     top do. Low to high. Older readers drop the new rungs. */
  const LOW2 = ['do-low2', 're-low2', 'mi-low2', 'fa-low2', 'so-low2', 'la-low2', 'ti-low2'];
  const HIGH2 = ['re-high2', 'mi-high2', 'fa-high2', 'so-high2', 'la-high2', 'ti-high2'];
  const RUNGS = LOW2.concat(noteOrder, HIGH2);
  const isRung = nc => RUNGS.indexOf(nc) !== -1;
  const SOL7 = ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti'];
  const SH7 = ['D', 'R', 'M', 'F', 'S', 'L', 'T'];

  const noteToSolfege = {
    'do-low': 'Do', 're-low': 'Re',
    'mi-low': 'Mi', 'fa-low': 'Fa', 'so-low': 'So', 'la-low': 'La', 'ti-low': 'Ti',
    'do': 'Do', 're': 'Re', 'mi': 'Mi', 'fa': 'Fa', 'so': 'So', 'la': 'La', 'ti': 'Ti',
    'do-high': 'Do', 're-high': 'Re', 'mi-high': 'Mi', 'fa-high': 'Fa', 'so-high': 'So', 'la-high': 'La',
    'ti-high': 'Ti', 'do-high2': 'Do'
  };
  LOW2.forEach((nc, i) => { noteToSolfege[nc] = SOL7[i]; });
  HIGH2.forEach((nc, i) => { noteToSolfege[nc] = SOL7[i + 1]; });

  const noteToShorthandMap = {
    'do-low': 'D-1', 're-low': 'R-1',
    'mi-low': 'M-1', 'fa-low': 'F-1', 'so-low': 'S-1', 'la-low': 'L-1', 'ti-low': 'T-1',
    'do': 'D1', 're': 'R1', 'mi': 'M1', 'fa': 'F1', 'so': 'S1', 'la': 'L1', 'ti': 'T1',
    'do-high': 'D2', 're-high': 'R2', 'mi-high': 'M2', 'fa-high': 'F2', 'so-high': 'S2', 'la-high': 'L2',
    'ti-high': 'T2', 'do-high2': 'D3'
  };
  LOW2.forEach((nc, i) => { noteToShorthandMap[nc] = SH7[i] + '-2'; });
  HIGH2.forEach((nc, i) => { noteToShorthandMap[nc] = SH7[i + 1] + '3'; });

  const shorthandToNoteMap = {
    'D-1': 'do-low', 'R-1': 're-low',
    'M-1': 'mi-low', 'F-1': 'fa-low', 'S-1': 'so-low', 'L-1': 'la-low', 'T-1': 'ti-low',
    'D1': 'do', 'R1': 're', 'M1': 'mi', 'F1': 'fa', 'S1': 'so', 'L1': 'la', 'T1': 'ti',
    'D2': 'do-high', 'R2': 're-high', 'M2': 'mi-high', 'F2': 'fa-high', 'S2': 'so-high', 'L2': 'la-high',
    'T2': 'ti-high', 'D3': 'do-high2'
  };
  LOW2.concat(HIGH2).forEach(nc => { shorthandToNoteMap[noteToShorthandMap[nc]] = nc; });

  /* 1.0's bar heights in px at block size 100%. style.css repeats them as
     calc(N * var(--bs)); keep the two in step. The new rungs (2026-10-31)
     carry on 1.0's steps: the low end narrowing (… 25, 20 → 16, 12), the
     top ten apart (180 → 190, 200). */
  const NOTE_HEIGHTS = {
    'do-low': 12, 're-low': 16,
    'mi-low': 20, 'fa-low': 25, 'so-low': 30, 'la-low': 40, 'ti-low': 50,
    'do': 60, 're': 70, 'mi': 80, 'fa': 90, 'so': 100, 'la': 110, 'ti': 120,
    'do-high': 130, 're-high': 140, 'mi-high': 150, 'fa-high': 160, 'so-high': 170, 'la-high': 180,
    'ti-high': 190, 'do-high2': 200,
    // KEY CHANGES' wider range (2026-10-31): under low do the bars keep narrowing a little at a
    // time (a bar can only get so short); over the top do they climb on ten apart
    'do-low2': 4, 're-low2': 5, 'mi-low2': 6, 'fa-low2': 7, 'so-low2': 8, 'la-low2': 9, 'ti-low2': 10,
    're-high2': 210, 'mi-high2': 220, 'fa-high2': 230, 'so-high2': 240, 'la-high2': 250, 'ti-high2': 260
  };

  const LINE_COLORS = ['#e3f2fd', '#fff8e1', '#fce4ec', '#e8f5e9'];

  /* ---- small derived helpers ---- */

  function displayKey(k) {
    return String(k || '').replace('b', '♭').replace('#', '♯');
  }

  function noteClassOf(el) {
    return el ? Array.from(el.classList).find(isRung) || null : null;
  }

  /* octave offset of a note class: -2 … +2 (the top do, and Create Key Change's wider rungs) */
  function octaveOf(noteClass) {
    if (noteClass.endsWith('-high2')) return 2;
    if (noteClass.endsWith('-low2')) return -2;
    if (noteClass.endsWith('-low')) return -1;
    if (noteClass.endsWith('-high')) return 1;
    return 0;
  }

  /* ------------------------------------------------------------------
     THE KEY IN EFFECT (2026-10-31, KEY CHANGES — js/keys.js). A song can
     change key part way through, so "the key" depends on where you are:
     keyNow() is the key in effect right now — inside withKey(k, fn), k
     (a note, a column or a bar being drawn, sounded or written is always
     handled inside its own key's withKey); otherwise the key where the
     selection is (SW.keys.here() — what the chord panel, the keyboard,
     the letter keys and Setup show); before keys.js is up, the song's
     opening key (S.key). Every helper below that takes a key defaults to
     keyNow(), so code that reads the key through them follows a key
     change without knowing about it.
     ------------------------------------------------------------------ */
  let keyOverride = null;
  function keyNow() {
    if (keyOverride) return keyOverride;
    return SW.keys ? SW.keys.here() : SW.state.key;
  }
  function withKey(k, fn) {
    const was = keyOverride;
    keyOverride = k || null;
    try { return fn(); } finally { keyOverride = was; }
  }

  /* ------------------------------------------------------------------
     THE CLEF IN EFFECT (2026-11-04, the user: double-click the treble
     clef on Notation and choose the bass clef; the notes go down an
     octave, sit correctly on it, and the Pitch page plays that octave
     too). A clef belongs to a part (parts.js `clef`). The song as written
     does not change — a block keeps its rung and its height — so going
     back to treble gives every note back exactly. What changes is what a
     rung means: everything that turns a rung into a pitch asks here, in
     noteMidi and spellNote (so the player, the keyboard, the letter keys,
     the Recording Studio and the note names all follow) and in audio.js
     calculateFrequency.

     clefNow() is the clef of the part on the page, unless inside
     withClef(id, fn) — a part off the page being read or drawn. clef() is
     its entry here:
       octave      what it does to the sound
       staffShift  steps from a written note to its place on the staff,
                   counted as if the staff were a treble one. The engraver
                   (staff.js) knows one staff — E4 its bottom line, B4 its
                   middle, F5 its top — and stems, ledgers, rests and dots
                   work from those; a bass staff's bottom line is G2, twelve
                   steps under E4, so a pitch's `step` is that much higher
       sigShift    a key signature sits one line lower on a bass staff
       glyph       the clef's drawing (staff.js puts it on its own line)
       range       [low, high] MIDI, the same in every key, or null for none

     THE BASS CLEF'S RANGE (later the same day, the user: an absolute range,
     from the A below C2 to the A above middle C — A1 to A4). What can be
     written stops there: the arrows, the letter keys, the piano and the ♯ / ♭
     use clefFits, and settings.js allowedNotes offers the rungs that land
     inside it in the key in effect (keys.js rungsFor, as Create Key Change
     does), low2 and high2 rungs included. A note already written beyond it —
     a song brought over from treble, or a change of key — is kept on its
     rung and sounds and is drawn the nearest octave inside (foldIntoClef),
     so nothing ever leaves the range and treble still gives it back.
     midiOnClef is the pitch before that: compare with it when asking whether
     a rung fits, or two rungs can seem to be one note.
     ------------------------------------------------------------------ */
  const CLEFS = {
    treble: { id: 'treble', name: 'Treble', octave: 0, staffShift: 0, sigShift: 0, glyph: 'gClef', range: null, rangeNote: '' },
    bass: { id: 'bass', name: 'Bass', octave: -1, staffShift: 12, sigShift: -2, glyph: 'fClef', range: [33, 69], rangeNote: 'The bass clef runs from A1 to A4' }
  };
  let clefOverride = null;
  function clefNow() {
    if (clefOverride) return clefOverride;
    return SW.parts ? SW.parts.clef() : 'treble';
  }
  function withClef(id, fn) {
    const was = clefOverride;
    clefOverride = id || null;
    try { return fn(); } finally { clefOverride = was; }
  }
  const clef = () => CLEFS[clefNow()] || CLEFS.treble;

  /* The MIDI number a block sounds, by exactly 1.0's arithmetic
     (calculateFrequency counts semitones from C0; MIDI 12 is C0), in the
     clef in effect and inside its range. */
  function noteMidi(noteClass, accidental, key) { return foldIntoClef(midiOnClef(noteClass, accidental, key)); }
  function foldIntoClef(m) {
    const r = clef().range;
    if (!r || m === null) return m;
    while (m > r[1]) m -= 12;
    while (m < r[0]) m += 12;
    return m;
  }
  function clefFits(noteClass, accidental, key) {
    const r = clef().range;
    if (!r) return true;
    const m = midiOnClef(noteClass, accidental, key);
    return m !== null && m >= r[0] && m <= r[1];
  }
  function midiOnClef(noteClass, accidental, key) {
    const k = key || keyNow();
    const tonic = KEY_SIGNATURES_CHROMATIC_INDEX[k];
    const sol = noteToSolfege[noteClass];
    if (tonic === undefined || !sol) return null;
    const shift = KEY_TRANSPOSITION[k] ? (KEY_TRANSPOSITION[k].octaveShift || 0) : 0;
    const acc = accidental === 'sharp' ? 1 : accidental === 'flat' ? -1 : 0;
    return 12 + tonic + (DEFAULT_SOLFEGE_OCTAVE + shift) * 12 + SOLFEGE_INTERVALS[sol] + acc + octaveOf(noteClass) * 12 + clef().octave * 12;
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
     staff. The letter comes from 1.0's table for the key as the scale
     spells it (spelledKey: F♯ in D is F♯, not G♭; D♭ minor is written
     C♯ minor); the block's own ♯/♭ is added on top. The pitch is always
     the chosen key's, so a respelling never moves a note. */
  function spellNote(noteClass, accidental, key) {
    const k = key || keyNow();
    const sol = noteToSolfege[noteClass];
    const base = (letterNamesByKey[spelledKey(k)] || letterNamesByKey.C)[sol] || 'C';
    const letter = base.charAt(0);
    let alter = 0;
    for (const ch of base.slice(1)) alter += ch === '#' ? 1 : -1;
    alter += accidental === 'sharp' ? 1 : accidental === 'flat' ? -1 : 0;
    const midi = noteMidi(noteClass, accidental, k);
    const octave = Math.round((midi - LETTER_PC[letter] - alter) / 12) - 1;
    return { letter, alter, octave, midi };
  }

  /* ------------------------------------------------------------------
     THE SCALE — Digital Accordion's scales (lib/theory.js) applied to
     1.0's blocks. Do is always the scale's tonic (the key), so in D
     Phrygian D is do and E♭ is ra.

     A block stays what 1.0 made it: a RUNG (the note class — a step of
     do re mi fa so la ti and its octave, which is the bar's height and
     the staff's letter) plus a ♯ or ♭ counted from the major scale. A
     scale is a list of degrees ('1', 'b3', '#4'), and each degree is
     exactly one rung with one alteration, so every note of every scale
     is a block 1.0 could already draw: C minor's me is mi with a ♭,
     blues's se is so with a ♭. Nothing about the stored song changes;
     what the scale decides is which of those blocks ↑ ↓ and the letter
     keys land on, and what each block is called.
     ------------------------------------------------------------------ */
  const STEP_OF = { Do: 1, Re: 2, Mi: 3, Fa: 4, So: 5, La: 6, Ti: 7 };
  const accOf = alter => alter > 0 ? 'sharp' : alter < 0 ? 'flat' : 'natural';
  const alterOf = acc => acc === 'sharp' ? 1 : acc === 'flat' ? -1 : 0;
  const hasTheory = () => typeof Theory !== 'undefined';

  function scaleOf(id) {
    if (!hasTheory()) return null;
    return Theory.SCALE_BY_ID[id || SW.state.scale] || Theory.SCALE_BY_ID.major;
  }
  /* the scale as rungs: [{ num 1–7, alter }] */
  function scaleSteps(id) {
    const sc = scaleOf(id);
    if (!sc) return [1, 2, 3, 4, 5, 6, 7].map(num => ({ num, alter: 0 }));
    return sc.degrees.map(d => Theory.parseDegree(d));
  }
  /* The alteration a scale gives each step, the one nearest natural when
     it has two (blues's so and se: so), or undefined for a step it
     skips (major pentatonic has no fa and no ti). */
  function stepAlters(id) {
    const out = {};
    scaleSteps(id).forEach(p => {
      if (out[p.num] === undefined || Math.abs(p.alter) < Math.abs(out[p.num])) out[p.num] = p.alter;
    });
    return out;
  }
  function inScale(noteClass, accidental, id) {
    const num = STEP_OF[noteToSolfege[noteClass]];
    const a = alterOf(accidental);
    return scaleSteps(id).some(p => p.num === num && p.alter === a);
  }

  /* The notes of the scale that fit on the given rungs (the Layout
     settings range), low to high: [{ nc, acc, midi }]. What ↑ ↓ walk. */
  function scaleLadder(rungs, id) {
    const steps = scaleSteps(id);
    const out = [];
    (rungs || noteOrder).forEach(nc => {
      const num = STEP_OF[noteToSolfege[nc]];
      steps.forEach(p => {
        if (p.num !== num) return;
        const acc = accOf(p.alter);
        const midi = noteMidi(nc, acc);
        if (midi !== null && clefFits(nc, acc)) out.push({ nc, acc, midi });
      });
    });
    return out.sort((a, b) => a.midi - b.midi);
  }

  /* Solfège with Do on the tonic: a block's name, chromatic syllables
     included — re♭ is ra, mi♭ me, fa♯ fi, so♭ se, so♯ si, la♭ le, ti♭ te. */
  function solfegeOf(noteClass, accidental) {
    const sol = noteToSolfege[noteClass] || 'Do';
    const a = alterOf(accidental);
    if (!a || !hasTheory()) return sol;
    return Theory.solfegeFor((a > 0 ? '#' : 'b') + STEP_OF[sol]);
  }

  /* The key as the scale spells it. A key the menu offers under two names
     (D♭ / C♯, G♭ / F♯) is written with whichever needs fewer accidentals
     in this scale — D♭ major stays D♭, but D♭ minor (with its F♭ and
     B𝄫) is written C♯ minor. The key chosen is kept (lessons, storage,
     pitch); only the spelling follows the scale. A tie keeps the choice. */
  const SIG_MODE = {
    major: 'major', minor: 'natural-minor', 'natural-minor': 'natural-minor',
    'harmonic-minor': 'natural-minor', 'melodic-minor': 'natural-minor',
    dorian: 'dorian', phrygian: 'phrygian', lydian: 'lydian', mixolydian: 'mixolydian', locrian: 'locrian',
    'major-pentatonic': 'major', 'minor-pentatonic': 'natural-minor', blues: 'natural-minor',
    'hungarian-minor': 'natural-minor', 'phrygian-dominant': 'phrygian'
  };
  /* The seven-note scale whose key signature a scale is written with:
     itself for the modes, natural minor for every minor and for minor
     pentatonic and blues, major for major pentatonic, Phrygian for
     Phrygian dominant, and the tonic's major for the rest. */
  function signatureScale(id) { return SIG_MODE[id || SW.state.scale] || 'major'; }
  function spelledKey(key, id) {
    const k = key || keyNow();
    const idx = KEY_SIGNATURES_CHROMATIC_INDEX[k];
    if (idx === undefined || !hasTheory()) return k;
    const flat = Theory.TONIC_FLAT[idx], sharp = Theory.TONIC_SHARP[idx];
    if (flat === sharp) return k;
    const other = k === flat ? sharp : flat;
    const sig = Theory.SCALE_BY_ID[signatureScale(id)];
    const cost = t => sig.degrees.reduce((n, d) => n + Math.abs(Theory.spellDegree(t, d).alter), 0);
    return cost(other) < cost(k) ? other : k;
  }

  /* A block's letter name, spelled (B♭, F♯, E𝄫), and its colour — the
     colour of its letter, as 1.0's tables have it. */
  function prettyAlter(alter) {
    if (!alter) return '';
    if (alter === 2) return '𝄪';
    if (alter === -2) return '𝄫';
    return alter > 0 ? '♯'.repeat(alter) : '♭'.repeat(-alter);
  }
  function noteLetter(noteClass, accidental) {
    const sp = spellNote(noteClass, accidental);
    return sp.letter + prettyAlter(sp.alter);
  }
  function noteColour(noteClass, key) {
    const base = (letterNamesByKey[spelledKey(key)] || letterNamesByKey.C)[noteToSolfege[noteClass]] || 'C';
    return LETTER_COLORS[base.charAt(0)];
  }

  SW.music = {
    noteColorsByKey, keySignatureColors, LETTER_COLORS, letterNamesByKey, chordColorMapping,
    chordNamesByKey, NOTE_FREQUENCIES, CHROMATIC_NOTES, KEY_TRANSPOSITION,
    solfegeKeyMap, SOLFEGE_INTERVALS, DEFAULT_SOLFEGE_OCTAVE, KEY_SIGNATURES_CHROMATIC_INDEX, KEYS,
    noteOrder, noteToSolfege, noteToShorthandMap, shorthandToNoteMap, NOTE_HEIGHTS, LINE_COLORS,
    RUNGS, isRung, keyNow, withKey, CLEFS, clef, clefNow, withClef, midiOnClef, foldIntoClef, clefFits,
    LETTER_PC, displayKey, noteClassOf, octaveOf, noteMidi, midiFromName, midiToFreq, spellNote,
    // the scale (Digital Accordion's, Do on the tonic)
    STEP_OF, accOf, alterOf, scaleOf, scaleSteps, stepAlters, inScale, scaleLadder, solfegeOf,
    signatureScale, spelledKey, prettyAlter, noteLetter, noteColour
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
    { id: 'w.', name: 'Dotted whole note',   ticks: 144, base: 'w', dotted: true },   // 2.5: a whole bar of 12/8
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
     METERS — the time signatures the staff can be barred in, in two
     families (Rhythm Poetry's):
       SIMPLE    2/4 3/4 4/4 — the beat is a quarter (24 ticks), heard as
                 two eighths
       COMPOUND  6/8 9/8 12/8 (2.5) — the beat is a dotted quarter (36
                 ticks), heard as three eighths: 6/8 has two beats, 9/8
                 three, 12/8 four
     A block counts as one BEAT (a dotted quarter in compound time), the
     tempo counts beats (♩. = 100 in 6/8), and so do the count-in and the
     steady beat. Each line of the song starts a new bar (a line is a
     phrase), and a bar that ends short is padded with silence.
     `beatValue` is the value one beat is written as. The tile in the
     toolbar: the top numeral cycles the family (4 → 3 → 2, 12 → 9 → 6),
     the bottom one swaps families (4/4 ↔ 12/8, 3/4 ↔ 9/8, 2/4 ↔ 6/8).
     ------------------------------------------------------------------ */
  const METERS = [
    { id: '2/4',  beats: 2, beatTicks: 24, top: 2,  bottom: 4, compound: false, beatValue: 'q' },
    { id: '3/4',  beats: 3, beatTicks: 24, top: 3,  bottom: 4, compound: false, beatValue: 'q' },
    { id: '4/4',  beats: 4, beatTicks: 24, top: 4,  bottom: 4, compound: false, beatValue: 'q' },
    { id: '6/8',  beats: 2, beatTicks: 36, top: 6,  bottom: 8, compound: true,  beatValue: 'q.' },
    { id: '9/8',  beats: 3, beatTicks: 36, top: 9,  bottom: 8, compound: true,  beatValue: 'q.' },
    { id: '12/8', beats: 4, beatTicks: 36, top: 12, bottom: 8, compound: true,  beatValue: 'q.' }
  ];
  const METER_BY_ID = {};
  METERS.forEach(m => { m.barTicks = m.beats * m.beatTicks; METER_BY_ID[m.id] = m; });
  SW.meters = {
    LIST: METERS,
    DEFAULT: '4/4',
    DEFAULT_BPM: 100,
    byId: id => METER_BY_ID[id] || METER_BY_ID['4/4'],
    isValid: id => !!METER_BY_ID[id],
    /* the meter in the other family with as many beats (4/4 ↔ 12/8 …) */
    twin: id => { const m = METER_BY_ID[id] || METER_BY_ID['4/4']; return METERS.find(x => x.compound !== m.compound && x.beats === m.beats).id; },
    /* the song's beat right now: its ticks and the value it is written as */
    beat: () => { const m = METER_BY_ID[SW.state.meter] || METER_BY_ID['4/4']; return { ticks: m.beatTicks, value: m.beatValue, compound: m.compound }; },
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
  ui.toast = function (message, ms) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms || 2200);
  };

  ui.openSheet = function (id) {
    ui.closeAllPopovers();
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
  };
  /* A sheet may ask before it closes (2026-10-28, the Chords window's Focus:
     "Save your changes?"): guardSheet(id, fn) — fn(close) returns false to
     keep it open for now, and calls close() itself once the question is
     answered. Every way out goes through here: ×, a tap outside, Esc, Done. */
  const sheetGuards = {};
  ui.guardSheet = function (id, fn) { sheetGuards[id] = fn; };
  ui.closeSheet = function (id, force) {
    const el = document.getElementById(id);
    if (!force && sheetGuards[id] && el && el.classList.contains('show') && sheetGuards[id](() => ui.closeSheet(id, true)) === false) return;
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

  /* NOTES THAT FOLD AWAY (2026-10-03, the user's design — Song Writer
     Chord Progressions/DESIGN.md §2a). An explaining note ends with a
     small ⓘ; a tap folds the note into it, and only the ⓘ stays where the
     note was; a tap on that ⓘ opens it again. A mouse resting on a folded
     ⓘ shows the note as its tooltip. Each note remembers, on this device
     (View pref foldedNotes). Only explaining notes — never headings,
     labels, values or questions.
       ui.note(id, html, { block })  → the note's HTML, open or folded
     A tap swaps the element in place: nothing around it is redrawn. */
  const noteStore = {};
  const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  ui.note = function (id, html, opts) {
    const o = opts || {};
    noteStore[id] = { html, block: !!o.block };
    const view = (SW.settings && SW.settings.view) || {};
    const folded = !!(view.foldedNotes && view.foldedNotes[id]);
    const plain = String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (folded) {
      return '<button type="button" class="note-i folded' + (o.block ? ' block' : '') + '" data-note="' + attr(id) + '" title="' + attr(plain) + '" aria-label="Show the note: ' + attr(plain) + '">i</button>';
    }
    return '<span class="fold-note' + (o.block ? ' block' : '') + '">' + html +
      ' <button type="button" class="note-i" data-note="' + attr(id) + '" title="Fold this note away" aria-label="Fold this note away">i</button></span>';
  };
  document.addEventListener('click', e => {
    const b = e.target && e.target.closest && e.target.closest('.note-i');
    if (!b || !SW.settings) return;
    e.preventDefault();
    e.stopPropagation();
    const id = b.dataset.note;
    const f = Object.assign({}, SW.settings.view.foldedNotes || {});
    if (f[id]) delete f[id]; else f[id] = true;
    SW.settings.setView({ foldedNotes: f }, { quiet: true });
    const st = noteStore[id];
    const host = b.classList.contains('folded') ? b : b.closest('.fold-note');
    if (!st || !host) return;
    const t = document.createElement('div');
    t.innerHTML = ui.note(id, st.html, { block: st.block });
    host.replaceWith(t.firstChild);
    SW.bus.emit('note:folded', { id, folded: !!f[id] });
  }, true);
  // a note's ⓘ never takes a press away from what is around it
  document.addEventListener('pointerdown', e => { if (e.target && e.target.closest && e.target.closest('.note-i')) e.stopPropagation(); }, true);

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
  /* The same, for text still being made (a short link is packed
     asynchronously): the clipboard is asked inside the click, with the
     text to follow — Safari refuses a copy made after the click is over.
     Where that is not possible, the text is copied once it is ready. */
  ui.copyTextLater = async function (text) {
    if (typeof text === 'string') return ui.copyText(text);
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': Promise.resolve(text).then(t => new Blob([t], { type: 'text/plain' })) })]);
        return true;
      } catch (e) {}
    }
    return ui.copyText(await text);
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
    if (String(b64).charAt(0) === '~') return Object.prototype.hasOwnProperty.call(unpacked, b64) ? unpacked[b64] : null;   // a short link: read before the app started
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

  /* SHORT LINKS (2026-10-13). A link's JSON in plain base64 ran to 6,000–
     16,000 characters for a real song — long enough to be cut short on its
     way into a Google Site, and a link cut short opened whatever song had
     been open last. Now the JSON is deflated first (the browser's own
     CompressionStream) and written in base64url after a '~' (#song=~…,
     #lesson=~…): about a tenth as long. Links without the '~' are read as
     before; a browser that cannot deflate still makes those.

     Deflating runs asynchronously: ui.packLink(data) → a promise of the
     text to put after `song=`; ui.unpackLinks() reads the address's short
     links before the app starts (app.js), so ui.decodeJson('~…') stays
     synchronous. */
  const unpacked = {};
  const canPack = typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';
  async function streamBytes(bytes, stream) {
    return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
  }
  function toBase64Url(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fromBase64Url(s) {
    let b = s.replace(/-/g, '+').replace(/_/g, '/');
    while (b.length % 4) b += '=';
    const bin = atob(b);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  ui.packLink = async function (data) {
    if (!canPack) return encodeURIComponent(ui.encodeJson(data));
    try {
      return '~' + toBase64Url(await streamBytes(new TextEncoder().encode(JSON.stringify(data)), new CompressionStream('deflate')));
    } catch (e) {
      return encodeURIComponent(ui.encodeJson(data));
    }
  };
  /* the address's link parameters (hash first, then the query) */
  ui.linkParam = function (name) {
    for (const part of [window.location.hash, window.location.search]) {
      const v = new URLSearchParams(part.replace(/^[#?]/, '')).get(name);
      if (v) return v;
    }
    return null;
  };
  ui.needsUnpack = () => ['song', 'lesson'].some(k => (ui.linkParam(k) || '').charAt(0) === '~');
  ui.unpackLinks = async function () {
    for (const k of ['song', 'lesson']) {
      const v = ui.linkParam(k);
      if (!v || v.charAt(0) !== '~' || !canPack) continue;
      try {
        unpacked[v] = JSON.parse(new TextDecoder().decode(await streamBytes(fromBase64Url(v.slice(1)), new DecompressionStream('deflate'))));
      } catch (e) {
        console.error('Could not read link data:', e);          // cut short, most likely: decodeJson gives null
      }
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

/* ==========================================================================
   Key Blocks — theory.js
   Scales, spelling, chords and voicings, derived from degrees rather than
   tables, so any key and any scale (pentatonic, octatonic, whole tone…)
   spells, colours and voices itself.
   ========================================================================== */
const Theory = (() => {
  /* The chord-layers engine (Z X C V B modifiers, chord-symbol suffixes). */
  const Layers = (typeof KeyBlocksLayers !== 'undefined') ? KeyBlocksLayers
    : (typeof require === 'function' ? require('./lib/keyblocks-layers.js') : null);
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];
  const KEY_COLORS = {
    C: '#FF3B30', D: '#FF9500', E: '#FFCC00', F: '#34C759',
    G: '#30c0c6', A: '#007AFF', B: '#AF52DE'
  };
  const TONIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const TONIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const SOLFEGE = {
    '1': 'Do', '#1': 'Di', 'b2': 'Ra', '2': 'Re', '#2': 'Ri', 'b3': 'Me', '3': 'Mi',
    '4': 'Fa', '#4': 'Fi', 'b5': 'Se', '5': 'So', '#5': 'Si', 'b6': 'Le', '6': 'La',
    '#6': 'Li', 'b7': 'Te', '7': 'Ti', 'bb7': 'Te', 'bb3': 'Me', 'bb6': 'Le', '##4': 'Fi'
  };

  /* ---------- degrees & notes ---------- */
  function parseDegree(d) {
    const m = /^([#b]*)([1-7])$/.exec(String(d));
    if (!m) return { num: 1, alter: 0 };
    let alter = 0;
    for (const ch of m[1]) alter += (ch === '#') ? 1 : -1;
    return { num: +m[2], alter };
  }
  function degreeSemis(d) {
    const { num, alter } = parseDegree(d);
    return ((MAJOR_SEMIS[num - 1] + alter) % 12 + 12) % 12;
  }
  function parseNote(n) {
    const s = String(n);
    const letter = s.charAt(0).toUpperCase();
    let alter = 0;
    for (const ch of s.slice(1)) {
      if (ch === '#' || ch === '♯') alter += 1;
      else if (ch === 'b' || ch === '♭') alter -= 1;
      else if (ch === 'x' || ch === '𝄪') alter += 2;
      else if (ch === '𝄫') alter -= 2;
    }
    return { letter, alter };
  }
  function notePc(n) {
    const { letter, alter } = parseNote(n);
    return (((LETTER_PC[letter] || 0) + alter) % 12 + 12) % 12;
  }
  function accUnicode(alter) {
    if (alter === 0) return '';
    if (alter === 1) return '♯';
    if (alter === -1) return '♭';
    if (alter === 2) return '𝄪';
    if (alter === -2) return '𝄫';
    return (alter > 0 ? '♯'.repeat(alter) : '♭'.repeat(-alter));
  }
  function accAscii(alter) {
    if (alter === 0) return '';
    return alter > 0 ? '#'.repeat(alter) : 'b'.repeat(-alter);
  }

  /* Spell a degree ('b3', '#4'…) relative to a spelled tonic ('Eb'). */
  function spellDegree(tonicName, d) {
    const t = parseNote(tonicName);
    const { num } = parseDegree(d);
    const li = ((LETTERS.indexOf(t.letter) + num - 1) % 7 + 7) % 7;
    const letter = LETTERS[li];
    const targetPc = (notePc(tonicName) + degreeSemis(d)) % 12;
    let acc = ((targetPc - LETTER_PC[letter]) % 12 + 12) % 12;
    if (acc > 6) acc -= 12;
    return { letter, alter: acc, name: letter + accUnicode(acc), ascii: letter + accAscii(acc), pc: targetPc };
  }

  /* The degree string a chromatic offset (0-11 above the tonic) is usually
     written as, given the scale: #4 when the scale has a 5th but no 4th,
     b5 otherwise; b2 b3 b6 b7 by default. */
  function semisToDegree(semis, scaleDegrees) {
    const s = ((semis % 12) + 12) % 12;
    const found = (scaleDegrees || []).find(d => degreeSemis(d) === s);
    if (found) return found;
    const table = { 0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7' };
    if (s === 6) {
      const has5 = (scaleDegrees || []).some(d => degreeSemis(d) === 7);
      const has4 = (scaleDegrees || []).some(d => degreeSemis(d) === 5);
      return (has5 && !has4) ? '#4' : (has4 && !has5) ? 'b5' : '#4';
    }
    return table[s];
  }

  function solfegeFor(d) {
    if (SOLFEGE[d]) return SOLFEGE[d];
    const { num, alter } = parseDegree(d);
    const base = ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti'][num - 1];
    if (alter === 0) return base;
    // reduce to the nearest chromatic solfège
    const semis = degreeSemis(d);
    const chroma = ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'So', 'Si', 'La', 'Li', 'Ti'];
    const chromaFlat = ['Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Se', 'So', 'Le', 'La', 'Te', 'Ti'];
    return alter > 0 ? chroma[semis] : chromaFlat[semis];
  }

  /* ---------- chord qualities ---------- */
  const QUALITIES = {
    maj:   { name: 'Major',            iv: [0, 4, 7], gen: [0, 2, 4],      sfx: '',        roman: 'upper', rsfx: '' },
    min:   { name: 'Minor',            iv: [0, 3, 7], gen: [0, 2, 4],      sfx: 'm',       roman: 'lower', rsfx: '' },
    dim:   { name: 'Diminished',       iv: [0, 3, 6], gen: [0, 2, 4],      sfx: '°',       roman: 'lower', rsfx: '°' },
    aug:   { name: 'Augmented',        iv: [0, 4, 8], gen: [0, 2, 4],      sfx: '+',       roman: 'upper', rsfx: '+' },
    sus2:  { name: 'Suspended 2nd',    iv: [0, 2, 7], gen: [0, 1, 4],      sfx: 'sus2',    roman: 'upper', rsfx: 'sus2' },
    sus4:  { name: 'Suspended 4th',    iv: [0, 5, 7], gen: [0, 3, 4],      sfx: 'sus4',    roman: 'upper', rsfx: 'sus4' },
    pow:   { name: 'Power chord (5)',  iv: [0, 7],         gen: [0, 4],     sfx: '5',       roman: 'upper', rsfx: '5' },
    dom7:  { name: 'Dominant 7th',     iv: [0, 4, 7, 10], gen: [0, 2, 4, 6],  sfx: '7',       roman: 'upper', rsfx: '7' },
    maj7:  { name: 'Major 7th',        iv: [0, 4, 7, 11], gen: [0, 2, 4, 6],  sfx: 'maj7',    roman: 'upper', rsfx: 'maj7' },
    min7:  { name: 'Minor 7th',        iv: [0, 3, 7, 10], gen: [0, 2, 4, 6],  sfx: 'm7',      roman: 'lower', rsfx: '7' },
    m7b5:  { name: 'Half-diminished',  iv: [0, 3, 6, 10], gen: [0, 2, 4, 6],  sfx: 'ø7',      roman: 'lower', rsfx: 'ø7' },
    dim7:  { name: 'Diminished 7th',   iv: [0, 3, 6, 9], gen: [0, 2, 4, 6],   sfx: '°7',      roman: 'lower', rsfx: '°7' },
    mmaj7: { name: 'Minor-major 7th',  iv: [0, 3, 7, 11], gen: [0, 2, 4, 6],  sfx: 'm(maj7)', roman: 'lower', rsfx: 'maj7' },
    aug7:  { name: 'Augmented 7th',    iv: [0, 4, 8, 10], gen: [0, 2, 4, 6],  sfx: '7♯5',     roman: 'upper', rsfx: '7♯5' },
    dom7b5:{ name: 'Dominant 7th ♭5',  iv: [0, 4, 6, 10], gen: [0, 2, 4, 6],  sfx: '7♭5',     roman: 'upper', rsfx: '7♭5' },
    six:   { name: 'Major 6th',        iv: [0, 4, 7, 9], gen: [0, 2, 4, 5],   sfx: '6',       roman: 'upper', rsfx: '6' },
    min6:  { name: 'Minor 6th',        iv: [0, 3, 7, 9], gen: [0, 2, 4, 5],   sfx: 'm6',      roman: 'lower', rsfx: '6' },
    add9:  { name: 'Add 9',            iv: [0, 4, 7, 14], gen: [0, 2, 4, 8],  sfx: 'add9',    roman: 'upper', rsfx: 'add9' },
    madd9: { name: 'Minor add 9',      iv: [0, 3, 7, 14], gen: [0, 2, 4, 8],  sfx: 'm(add9)', roman: 'lower', rsfx: 'add9' },
    six9:  { name: '6/9',              iv: [0, 4, 7, 9, 14],      gen: [0, 2, 4, 5, 8],     sfx: '6/9',   roman: 'upper', rsfx: '6/9' },
    dom9sus4:{ name: '9 sus4',         iv: [0, 5, 7, 10, 14],     gen: [0, 3, 4, 6, 8],     sfx: '9sus4', roman: 'upper', rsfx: '9sus4' },
    dom7s9:{ name: 'Dominant 7♯9',     iv: [0, 4, 7, 10, 15],     gen: [0, 2, 4, 6, 8],     sfx: '7♯9',   roman: 'upper', rsfx: '7♯9' },
    dom7b9:{ name: 'Dominant 7♭9',     iv: [0, 4, 7, 10, 13],     gen: [0, 2, 4, 6, 8],     sfx: '7♭9',   roman: 'upper', rsfx: '7♭9' },
    dom9s5:{ name: 'Dominant 9♯5',     iv: [0, 4, 8, 10, 14],     gen: [0, 2, 4, 6, 8],     sfx: '9♯5',   roman: 'upper', rsfx: '9♯5' },
    dom13b9:{ name: 'Dominant 13♭9',   iv: [0, 4, 7, 10, 13, 21], gen: [0, 2, 4, 6, 8, 12], sfx: '13♭9',  roman: 'upper', rsfx: '13♭9' },
    majb5: { name: 'Major ♭5',         iv: [0, 4, 6],             gen: [0, 2, 4],           sfx: '(♭5)',  roman: 'upper', rsfx: '(♭5)' }
  };
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  function qualityTones(q) {
    const Q = QUALITIES[q] || QUALITIES.maj;
    return Q.iv.map((semi, i) => [semi, (Q.gen ? Q.gen[i] : [0, 2, 4, 6][i]) + 1]);
  }
  /* Apply held/permanent modifiers (letters among Z X C V B) to a tone set. */
  function applyMods(tones, mods) {
    if (!Layers || !mods || !mods.length) return tones;
    const r = Layers.applyModifiers(null, { deg: 0, pc: 0, tones: tones.map(t => t.slice()) }, mods);
    return r.tones;
  }
  /* Chord symbol suffix ('m7', 'sus4', '6/9'…) and numeral case for a tone set. */
  function suffixFor(tones, q) {
    if (Layers) { const d = Layers.describe(tones); if (!d.unknown) return { sfx: d.suffix, lower: d.lower }; }
    const Q = QUALITIES[q] || QUALITIES.maj;
    return { sfx: Q.sfx, lower: Q.roman === 'lower' };
  }
  function romanForTones(root, tones, q) {
    const { num, alter } = parseDegree(root);
    const d = suffixFor(tones, q);
    let r = ROMAN[num - 1];
    if (d.lower) r = r.toLowerCase();
    let sfx = d.sfx;
    if (d.lower && sfx.startsWith('m') && !sfx.startsWith('maj')) sfx = sfx.slice(1);
    return accAscii(alter) + r + sfx;
  }

  function romanFor(root, q) {
    const { num, alter } = parseDegree(root);
    const Q = QUALITIES[q] || QUALITIES.maj;
    let r = ROMAN[num - 1];
    if (Q.roman === 'lower') r = r.toLowerCase();
    return accAscii(alter).replace(/#/g, '♯').replace(/b/g, '♭') + r + Q.rsfx;
  }

  /* Letter name of a chord in a spelled key: 'E♭m7' */
  function chordLetterName(tonicName, root, q) {
    const sp = spellDegree(tonicName, root);
    const Q = QUALITIES[q] || QUALITIES.maj;
    return { text: sp.name + Q.sfx, root: sp };
  }

  /* ---------- scales & their chord hierarchies ----------
     Chord order = importance (what the tower shows first, keys F D S A T R
     E Q W) and `top` the number row (keys 1 2 3 4 5) — both regenerated on
     2026-09-21 from the Chord Layers hand-off (keyblocks-layout-C.json), whose
     tags give the secondary-dominant labels (V/V, IV/bIII…). `more` is the
     bank the user can add from; anything that left a key went there. Labels follow Chord Tower where a scale
     existed there. */
  const C = (root, q, label) => ({ root, q, label: label || null });

  const SCALES = [
    { id: 'major', name: 'Major', family: 'Diatonic', degrees: ['1', '2', '3', '4', '5', '6', '7'],
      chords: [C('1', 'maj', 'I'), C('5', 'maj', 'V'), C('4', 'maj', 'IV'), C('6', 'min', 'vi'), C('2', 'min', 'ii'), C('3', 'min', 'iii'), C('2', 'maj', 'V/V'), C('3', 'maj', 'V/vi'), C('b7', 'maj', 'IV/IV')],
      top: [C('b6', 'maj', 'bVI'), C('4', 'min', 'iv'), C('#4', 'dim7', 'vii°7/V'), C('7', 'maj', 'V/iii'), C('6', 'maj', 'V/ii')],
      more: [C('b2', 'dom7', 'bII7'), C('b3', 'maj', 'bIII'), C('1', 'aug', 'I+'), C('7', 'dim'), C('5', 'dom7'), C('2', 'min7'), C('4', 'maj7'), C('1', 'maj7'), C('1', 'dom7', 'V/IV'), C('5', 'sus4'), C('1', 'add9'), C('6', 'min7'), C('1', 'six')] },

    { id: 'minor', name: 'Minor', family: 'Diatonic', degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
      chords: [C('1', 'min', 'i'), C('5', 'maj', 'V'), C('b6', 'maj', 'bVI'), C('4', 'min', 'iv'), C('b7', 'maj', 'bVII'), C('b3', 'maj', 'bIII'), C('4', 'maj', 'IV'), C('5', 'min', 'v'), C('2', 'm7b5', 'iiø7')],
      top: [C('2', 'maj', 'V/V'), C('b2', 'maj', 'bII'), C('b3', 'aug', 'bIII+'), C('1', 'maj', 'I'), C('3', 'maj', 'III')],
      more: [C('2', 'dim7', 'ii°7'), C('b6', 'dom7', 'bVI7'), C('7', 'dim7', 'vii°7'), C('5', 'dom7'), C('1', 'min7'), C('b6', 'maj7'), C('2', 'dim'), C('b7', 'dom7'), C('b3', 'maj7'), C('1', 'sus4'), C('4', 'min7')] },

    { id: 'natural-minor', name: 'Natural Minor', family: 'Diatonic', degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
      chords: [C('1', 'min', 'i'), C('5', 'min', 'v'), C('4', 'min', 'iv'), C('b6', 'maj', 'bVI'), C('b7', 'maj', 'bVII'), C('b3', 'maj', 'bIII'), C('5', 'maj', 'V'), C('4', 'maj', 'IV'), C('b2', 'maj', 'bII')],
      top: [C('2', 'maj', 'V/V'), C('2', 'm7b5', 'iiø7'), C('b3', 'aug', 'bIII+'), C('1', 'maj', 'I'), C('3', 'maj', 'III')],
      more: [C('b6', 'dom7', 'bVI7'), C('7', 'dim7', 'vii°7'), C('2', 'dim'), C('5', 'dom7'), C('1', 'min7'), C('b6', 'maj7'), C('b7', 'dom7'), C('4', 'min7'), C('b3', 'maj7'), C('5', 'min7')] },

    { id: 'harmonic-minor', name: 'Harmonic Minor', family: 'Diatonic', degrees: ['1', '2', 'b3', '4', '5', 'b6', '7'],
      chords: [C('1', 'min', 'i'), C('5', 'maj', 'V'), C('4', 'min', 'iv'), C('b6', 'maj', 'bVI'), C('7', 'dim', 'vii°'), C('b3', 'aug', 'bIII+'), C('b2', 'maj', 'bII'), C('b3', 'maj', 'V/bVI'), C('4', 'maj', 'IV')],
      top: [C('b7', 'maj', 'V/bIII'), C('2', 'm7b5', 'iiø7'), C('2', 'maj', 'V/V'), C('1', 'maj', 'I'), C('3', 'maj', 'III')],
      more: [C('b6', 'dom7', 'bVI7'), C('2', 'dim'), C('5', 'dom7'), C('7', 'dim7'), C('1', 'mmaj7'), C('b6', 'maj7'), C('4', 'min7')] },

    { id: 'melodic-minor', name: 'Melodic Minor', family: 'Diatonic', degrees: ['1', '2', 'b3', '4', '5', '6', '7'],
      chords: [C('1', 'min', 'i'), C('5', 'maj', 'V'), C('4', 'maj', 'IV'), C('6', 'dim', 'vi°'), C('2', 'min', 'ii'), C('b3', 'aug', 'bIII+'), C('b6', 'maj', 'bVI'), C('b7', 'maj', 'bVII'), C('7', 'dim', 'vii°')],
      top: [C('b2', 'maj', 'bII'), C('4', 'min', 'iv'), C('2', 'maj', 'V/V'), C('1', 'maj', 'I'), C('6', 'maj', 'V/ii')],
      more: [C('b2', 'dom7', 'bII7'), C('b3', 'maj', 'bIII'), C('7', 'dim7', 'vii°7'), C('5', 'dom7'), C('2', 'min7'), C('1', 'mmaj7'), C('4', 'dom7'), C('6', 'm7b5'), C('7', 'm7b5')] },

    { id: 'dorian', name: 'Dorian', family: 'Modes', degrees: ['1', '2', 'b3', '4', '5', '6', 'b7'],
      chords: [C('1', 'min', 'i'), C('4', 'maj', 'IV'), C('b3', 'maj', 'bIII'), C('5', 'min', 'v'), C('b7', 'maj', 'bVII'), C('2', 'min', 'ii'), C('1', 'maj', 'V/IV'), C('6', 'dim7', 'vii°7/v'), C('b6', 'maj', 'IV/bIII')],
      top: [C('2', 'maj', 'V/v'), C('4', 'min', 'iv'), C('5', 'maj', 'V'), C('6', 'maj', 'V/ii'), C('7', 'dim7', 'vii°7')],
      more: [C('2', 'dom7', 'II7'), C('3', 'maj', 'III'), C('1', 'min7'), C('4', 'dom7'), C('2', 'min7'), C('b7', 'maj7'), C('b3', 'maj7'), C('5', 'min7'), C('6', 'dim')] },

    { id: 'phrygian', name: 'Phrygian', family: 'Modes', degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
      chords: [C('1', 'min', 'i'), C('b2', 'maj', 'bII'), C('b3', 'maj', 'bIII'), C('4', 'min', 'iv'), C('b6', 'maj', 'bVI'), C('b7', 'min', 'bvii'), C('b5', 'maj', 'IV/bII'), C('5', 'dim', 'v°'), C('b7', 'maj', 'V/bIII')],
      top: [C('1', 'maj', 'V/iv'), C('4', 'maj', 'V/bVII'), C('5', 'maj', 'V'), C('5', 'min', 'v'), C('2', 'm7b5', 'iiø7')],
      more: [C('b2', 'dom7', 'bII7'), C('1', 'min7'), C('b2', 'maj7'), C('b3', 'dom7'), C('4', 'min7'), C('b7', 'min7'), C('b6', 'maj7'), C('1', 'sus4')] },

    { id: 'lydian', name: 'Lydian', family: 'Modes', degrees: ['1', '2', '3', '#4', '5', '6', '7'],
      chords: [C('1', 'maj', 'I'), C('5', 'maj', 'V'), C('2', 'maj', 'II'), C('3', 'min', 'iii'), C('6', 'min', 'vi'), C('7', 'min', 'vii'), C('4', 'maj', 'IV'), C('7', 'maj', 'V/iii'), C('6', 'maj', 'V/II')],
      top: [C('b7', 'maj', 'bVII'), C('3', 'maj', 'V/VI'), C('#4', 'dim', '#iv°'), C('b6', 'maj', 'bVI'), C('2', 'min', 'ii')],
      more: [C('2', 'dim', 'ii°'), C('5', 'dom7', 'V7'), C('1', 'aug', 'I+'), C('1', 'maj7'), C('2', 'dom7'), C('#4', 'm7b5'), C('7', 'min7'), C('5', 'maj7'), C('3', 'min7'), C('6', 'min7')] },

    { id: 'mixolydian', name: 'Mixolydian', family: 'Modes', degrees: ['1', '2', '3', '4', '5', '6', 'b7'],
      chords: [C('1', 'maj', 'I'), C('b7', 'maj', 'bVII'), C('4', 'maj', 'IV'), C('5', 'min', 'v'), C('2', 'min', 'ii'), C('6', 'min', 'vi'), C('b6', 'maj', 'bVI'), C('b3', 'maj', 'bIII'), C('3', 'dim', 'iii°')],
      top: [C('2', 'maj', 'V/v'), C('4', 'min', 'iv'), C('5', 'maj', 'V'), C('3', 'maj', 'V/vi'), C('6', 'maj', 'V/ii')],
      more: [C('3', 'min', 'iii'), C('b7', 'dom7', 'bVII7'), C('1', 'dom7'), C('b7', 'maj7'), C('2', 'min7'), C('4', 'maj7'), C('5', 'min7'), C('6', 'min7'), C('3', 'm7b5'), C('1', 'sus4')] },

    { id: 'locrian', name: 'Locrian', family: 'Modes', degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
      chords: [C('1', 'dim', 'i°'), C('4', 'min', 'iv'), C('b3', 'min', 'biii'), C('b7', 'min', 'bvii'), C('b2', 'maj', 'bII'), C('b6', 'maj', 'bVI'), C('4', 'maj', 'IV'), C('b6', 'aug', 'bVI+'), C('b5', 'maj', 'bV')],
      top: [C('b7', 'maj', 'bVII'), C('b3', 'maj', 'bIII'), C('1', 'maj', 'V/iv'), C('1', 'min', 'i'), C('5', 'maj', 'V')],
      more: [C('b2', 'dom7', 'bII7'), C('5', 'dom7', 'V7'), C('1', 'm7b5'), C('b2', 'maj7'), C('b3', 'min7'), C('4', 'min7'), C('b7', 'min7'), C('b5', 'maj7')] },

    { id: 'major-pentatonic', name: 'Major Pentatonic', family: 'Pentatonic & blues', degrees: ['1', '2', '3', '5', '6'],
      chords: [C('1', 'maj', 'I'), C('5', 'maj', 'V'), C('4', 'maj', 'IV'), C('6', 'min', 'vi'), C('2', 'min', 'ii'), C('1', 'sus2', 'Isus2'), C('2', 'maj', 'V/V'), C('3', 'min', 'iii'), C('b7', 'maj', 'IV/IV')],
      top: [C('3', 'maj', 'V/vi'), C('b3', 'maj', 'IV/bVII'), C('b6', 'maj', 'bVI'), C('4', 'min', 'iv'), C('6', 'maj', 'V/ii')],
      more: [C('5', 'sus4', 'Vsus4'), C('1', 'six9', 'I6/9'), C('5', 'dom9sus4', 'V9sus4'), C('1', 'six'), C('1', 'add9'), C('6', 'min7'), C('5', 'sus2'), C('2', 'min7'), C('4', 'maj7'), C('1', 'maj7')] },

    { id: 'minor-pentatonic', name: 'Minor Pentatonic', family: 'Pentatonic & blues', degrees: ['1', 'b3', '4', '5', 'b7'],
      chords: [C('1', 'min', 'i'), C('4', 'min', 'iv'), C('b7', 'maj', 'bVII'), C('b3', 'maj', 'bIII'), C('b6', 'maj', 'bVI'), C('5', 'min', 'v'), C('4', 'maj', 'IV'), C('1', 'pow', 'I5'), C('5', 'maj', 'V')],
      top: [C('b2', 'maj', 'bII'), C('2', 'maj', 'V/V'), C('1', 'dom7s9', 'V7/iv'), C('b5', 'maj', 'bV'), C('7', 'dim7', 'vii°7')],
      more: [C('1', 'min7', 'i7'), C('1', 'maj', 'I'), C('5', 'dom7s9', 'V7♯9'), C('1', 'sus4'), C('b3', 'six'), C('5', 'dom7'), C('4', 'min7'), C('b7', 'dom7'), C('b6', 'maj7')] },

    { id: 'blues', name: 'Blues', family: 'Pentatonic & blues', degrees: ['1', 'b3', '4', 'b5', '5', 'b7'],
      chords: [C('1', 'dom7', 'I7'), C('4', 'dom7', 'IV7'), C('5', 'dom7', 'V7'), C('b3', 'maj', 'bIII'), C('b7', 'maj', 'bVII'), C('4', 'min', 'iv'), C('b6', 'maj', 'bVI'), C('2', 'm7b5', 'iiø7'), C('b5', 'dim7', 'bv°7')],
      top: [C('6', 'dom7', 'V7/ii'), C('2', 'dom7', 'V7/V'), C('b2', 'dom7', 'bII7'), C('3', 'min7', 'iii7'), C('1', 'min7', 'i7')],
      more: [C('1', 'dom7s9', 'I7♯9'), C('1', 'six', 'I6'), C('1', 'min', 'i'), C('1', 'maj', 'I'), C('4', 'maj', 'IV'), C('5', 'maj', 'V'), C('4', 'min7'), C('b6', 'dom7'), C('b7', 'dom7'), C('1', 'pow'), C('4', 'pow'), C('5', 'pow')] },

    { id: 'whole-tone', name: 'Whole Tone', family: 'Symmetric', degrees: ['1', '2', '3', '#4', '#5', 'b7'],
      chords: [C('1', 'aug', 'I+'), C('2', 'aug', 'II+'), C('3', 'aug', 'III+'), C('#4', 'aug', '#IV+'), C('#5', 'aug', '#V+'), C('b7', 'aug', 'bVII+'), C('2', 'dom7b5', 'II7b5'), C('3', 'dom7b5', 'III7b5'), C('1', 'dom7b5', 'I7b5')],
      top: [C('1', 'maj', 'I'), C('4', 'maj', 'IV'), C('5', 'maj', 'V'), C('b6', 'maj', 'bVI'), C('1', 'min', 'i')],
      more: [C('1', 'aug7', 'I7♯5'), C('2', 'aug7', 'II7♯5'), C('5', 'aug7', 'V7♯5'), C('1', 'dom9s5', 'I9♯5'), C('3', 'aug7'), C('#4', 'aug7'), C('#5', 'aug7'), C('b7', 'aug7'), C('b7', 'dom7b5')] },

    { id: 'octatonic-hw', name: 'Octatonic (half–whole)', family: 'Symmetric', degrees: ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'],
      chords: [C('1', 'dom7', 'I7'), C('b3', 'dom7', 'bIII7'), C('6', 'dom7', 'VI7'), C('#4', 'dom7', '#IV7'), C('1', 'dim7', 'i°7'), C('b2', 'dim7', 'bii°7'), C('b3', 'maj', 'bIII'), C('#4', 'maj', '#IV'), C('6', 'maj', 'VI')],
      top: [C('#4', 'min', '#iv'), C('6', 'min', 'vi'), C('b3', 'min', 'biii'), C('1', 'maj', 'I'), C('1', 'min', 'i')],
      more: [C('4', 'maj', 'IV'), C('5', 'dom7', 'V7'), C('1', 'dom7s9', 'I7♯9'), C('1', 'dom13b9', 'I13♭9'), C('1', 'min7'), C('6', 'min7'), C('b3', 'min7')] },

    { id: 'octatonic-wh', name: 'Octatonic (whole–half)', family: 'Symmetric', degrees: ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'],
      chords: [C('1', 'dim7', 'i°7'), C('2', 'dim7', 'ii°7'), C('4', 'min', 'iv'), C('4', 'maj', 'IV'), C('2', 'min', 'ii'), C('2', 'maj', 'II'), C('b6', 'maj', 'bVI'), C('b6', 'min', 'bvi'), C('7', 'maj', 'VII')],
      top: [C('7', 'min', 'vii'), C('6', 'min', 'vi'), C('5', 'maj', 'V'), C('1', 'maj', 'I'), C('1', 'min', 'i')],
      more: [C('4', 'm7b5', 'ivø7'), C('5', 'dom7', 'V7'), C('2', 'dom7', 'II7'), C('7', 'm7b5'), C('2', 'm7b5'), C('b6', 'dom7'), C('4', 'dom7'), C('7', 'dom7')] },

    { id: 'double-harmonic', name: 'Double Harmonic', family: 'World', degrees: ['1', 'b2', '3', '4', '5', 'b6', '7'],
      chords: [C('1', 'maj', 'I'), C('b2', 'maj', 'bII'), C('4', 'min', 'iv'), C('3', 'min', 'iii'), C('b6', 'aug', 'bVI+'), C('1', 'maj7', 'Imaj7'), C('5', 'majb5', 'V(b5)'), C('b6', 'maj', 'V/bII'), C('3', 'dim7', 'iii°7')],
      top: [C('b3', 'maj', 'V/bVI'), C('4', 'maj', 'IV'), C('5', 'maj', 'V'), C('1', 'min', 'i'), C('b7', 'min', 'bvii')],
      more: [C('b2', 'maj7', 'bIImaj7'), C('b2', 'dom7', 'bII7'), C('4', 'mmaj7', 'iv(maj7)'), C('1', 'sus4'), C('b6', 'maj7'), C('3', 'min7'), C('1', 'pow')] },

    { id: 'hungarian-minor', name: 'Hungarian Minor', family: 'World', degrees: ['1', '2', 'b3', '#4', '5', 'b6', '7'],
      chords: [C('1', 'min', 'i'), C('5', 'maj', 'V'), C('b6', 'maj', 'bVI'), C('b3', 'aug', 'bIII+'), C('7', 'min', 'vii'), C('1', 'mmaj7', 'i(maj7)'), C('2', 'dom7b5', 'II7b5'), C('#4', 'dim7', '#iv°7'), C('b3', 'maj', 'V/bVI')],
      top: [C('2', 'maj', 'V/V'), C('4', 'min', 'iv'), C('7', 'dim7', 'vii°7'), C('1', 'maj', 'I'), C('b2', 'maj', 'bII')],
      more: [C('b6', 'maj7', 'bVImaj7'), C('b6', 'dom7', 'bVI7'), C('5', 'dom7b9', 'V7♭9'), C('5', 'dom7'), C('2', 'dim'), C('#4', 'dim'), C('1', 'sus4'), C('1', 'pow')] },

    { id: 'phrygian-dominant', name: 'Phrygian Dominant', family: 'World', degrees: ['1', 'b2', '3', '4', '5', 'b6', 'b7'],
      chords: [C('1', 'maj', 'I'), C('b2', 'maj', 'bII'), C('4', 'min', 'iv'), C('b7', 'min', 'bvii'), C('b6', 'aug', 'bVI+'), C('1', 'dom7', 'I7'), C('b5', 'maj', 'IV/bII'), C('b7', 'dim', 'bvii°'), C('b6', 'maj', 'V/bII')],
      top: [C('b7', 'maj', 'bVII'), C('b3', 'maj', 'bIII'), C('4', 'maj', 'IV'), C('1', 'min', 'i'), C('5', 'dim', 'v°')],
      more: [C('b2', 'maj7', 'bIImaj7'), C('b2', 'dom7', 'bII7'), C('4', 'min7'), C('b7', 'min7'), C('1', 'sus4'), C('b3', 'dim'), C('1', 'pow')] }
  ];
  const SCALE_BY_ID = {};
  SCALES.forEach(s => { SCALE_BY_ID[s.id] = s; });

  /* Fewest accidental marks wins and a tie goes to the flat spelling. The
     minor keys themselves follow convention (C♯ minor, G♯ minor) even where
     the flat spelling would be a mark or two cheaper. Together these
     reproduce every enharmonic choice Melody Tower made. */
  const MINOR_FAMILY = new Set(['minor', 'natural-minor', 'harmonic-minor', 'melodic-minor']);
  function tonicName(keyIndex, scaleId) {
    const flat = TONIC_FLAT[keyIndex], sharp = TONIC_SHARP[keyIndex];
    if (flat === sharp) return flat;
    const scale = SCALE_BY_ID[scaleId] || SCALES[0];
    if (MINOR_FAMILY.has(scaleId) && (keyIndex === 1 || keyIndex === 8)) return sharp;
    const cost = t => scale.degrees.reduce((n, d) => n + Math.abs(spellDegree(t, d).alter), 0);
    const cf = cost(flat), cs = cost(sharp);
    return cs < cf ? sharp : flat;
  }

  /* Pitch of a melody block: MIDI number. Keys Ab–B sit an octave lower
     so the tonic stays in a singable register (as the towers did). */
  function tonicMidi(keyIndex) {
    return 60 + keyIndex - (keyIndex >= 8 ? 12 : 0);
  }
  function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function melodyMidi(keyIndex, deg, oct) {
    return tonicMidi(keyIndex) + degreeSemis(deg) + 12 * (oct || 0) + (parseDegree(deg).num === 1 && degreeSemis(deg) !== 0 ? 0 : 0);
  }

  /* Chord voicing in the manner of Chord Tower's hand-made voicings:
     low roots (below B♭3) open out — root, fifth, third an octave up, root
     on top; roots from B♭3 upward sit in close position with the root
     doubled above. Root register is an octave below the melody tonic. */
  const CLOSE_FROM = 58; // MIDI B♭3
  function chordMidis(keyIndex, root, q, oct, tones) {
    const Q = QUALITIES[q] || QUALITIES.maj;
    const base = tonicMidi(keyIndex) - 12 + degreeSemis(root);
    const iv = tones ? tones.map(t => t[0]).sort((a, b) => a - b) : Q.iv;
    if (tones) return voiceIntervals(base, iv, oct);
    const third = iv[1], fifth = iv[2];
    let seventh = iv[3];
    if (seventh !== undefined && seventh > 12) seventh = seventh - 12 + 12; // add9: keep the 9th up
    let out;
    if (iv.length >= 5) {
      const upper = iv.slice(1).filter(i => !(iv.length >= 6 && i === 7)).map(i => base + 12 + (i % 12)).sort((a, b) => a - b);
      out = [base].concat(upper);
    } else if (q === 'pow') {
      out = base >= CLOSE_FROM ? [base, base + 7, base + 12] : [base, base + 7, base + 12, base + 19];
    } else if (base >= CLOSE_FROM) {
      out = [base, base + third, base + fifth, seventh !== undefined ? base + seventh : base + 12];
    } else if (seventh !== undefined) {
      out = [base, base + fifth, base + 12 + third, base + 12 + (seventh > 12 ? seventh - 12 : seventh)];
    } else {
      out = [base, base + fifth, base + 12 + third, (base + 24 <= 74) ? base + 24 : base + 12];
    }
    const shift = 12 * (oct || 0);
    return out.map(m => m + shift);
  }

  /* The notes of a chord, spelled in the key. A tone that belongs to the
     scale takes the scale's own spelling, so the names on a chord always
     match the names on the melody blocks (E♭ Phrygian's ♭II is F♭ A♭ C♭,
     never E A♭ B). A tone outside the scale sits on the letter its
     generic interval says — a third two letters up, a seventh six — with
     whatever accidental that letter needs. Returned root first. */
  function chordTones(keyIndex, scaleId, spec, tones) {
    return spellTones(keyIndex, scaleId, spec.root, tones || qualityTones(spec.q));
  }
  function spellTones(keyIndex, scaleId, root, tones) {
    const t = tonicName(keyIndex, scaleId);
    const scale = SCALE_BY_ID[scaleId];
    const rootP = parseDegree(root);
    const rootSemis = degreeSemis(root);
    const seen = new Set(), out = [];
    tones.slice().sort((a, b) => a[0] - b[0]).forEach(tone => {
      const semis = tone[0], gen = tone[1] - 1;
      const pc = (rootSemis + semis) % 12;
      if (seen.has(pc)) return;
      seen.add(pc);
      let deg = scale ? scale.degrees.find(d => degreeSemis(d) === pc) : null;
      if (!deg) {
        const num = ((rootP.num - 1 + gen) % 7) + 1;
        let alter = ((pc - MAJOR_SEMIS[num - 1]) % 12 + 12) % 12;
        if (alter > 6) alter -= 12;
        deg = accAscii(alter) + num;
      }
      const alter = parseDegree(deg).alter, num = parseDegree(deg).num;
      const sp = spellDegree(t, deg);
      out.push({ deg, degreeLabel: accUnicode(alter) + num, name: sp.name, letter: sp.letter, color: KEY_COLORS[sp.letter], pc });
    });
    return out;
  }

  /* Voicing for any interval set (modified chords): root in the bass, the
     upper voices close above it; below B♭3 the fifth stays low and the
     colour tones go up an octave, as the hand-made voicings do. */
  function voiceIntervals(base, iv, oct) {
    const rest = iv.filter(i => i !== 0);
    const fifth = rest.find(i => i === 7 || i === 6 || i === 8);
    const colour = rest.filter(i => i !== fifth);
    let out;
    if (rest.length >= 4 || base >= CLOSE_FROM) {
      const upper = rest.filter(i => !(rest.length >= 5 && i === fifth)).map(i => base + (i >= 12 ? 12 + (i % 12) : (base >= CLOSE_FROM ? i : 12 + i)));
      out = [base].concat(upper.sort((a, b) => a - b));
      if (rest.length === 2 && base >= CLOSE_FROM) out.push(base + 12);
    } else {
      out = [base];
      if (fifth !== undefined) out.push(base + fifth);
      colour.forEach(i => out.push(base + 12 + (i % 12)));
      if (colour.length <= 1) out.push((base + 24 <= 74 && fifth !== undefined) ? base + 24 : base + 12);
    }
    const seen = new Set(); out = out.filter(m => { if (seen.has(m)) return false; seen.add(m); return true; });
    return out.map(m => m + 12 * (oct || 0));
  }

  /* Names for a chord in the current key */
  function describeChord(keyIndex, scaleId, spec, tones) {
    const t = tonicName(keyIndex, scaleId);
    const sp = spellDegree(t, spec.root);
    if (!tones) {
      const letter = chordLetterName(t, spec.root, spec.q);
      return { roman: spec.label || romanFor(spec.root, spec.q), letter: letter.text, rootSpelled: sp, color: KEY_COLORS[sp.letter], inScale: chordInScale(scaleId, spec) };
    }
    const d = suffixFor(tones, spec.q);
    return { roman: romanForTones(spec.root, tones, spec.q), letter: sp.name + d.sfx, rootSpelled: sp, color: KEY_COLORS[sp.letter], inScale: chordInScale(scaleId, spec, tones) };
  }
  function chordInScale(scaleId, spec, tones) {
    const scale = SCALE_BY_ID[scaleId];
    if (!scale) return true;
    const set = new Set(scale.degrees.map(degreeSemis));
    const r = degreeSemis(spec.root);
    const iv = tones ? tones.map(t => t[0]) : (QUALITIES[spec.q] || QUALITIES.maj).iv;
    return iv.every(i => set.has((r + i) % 12));
  }

  function describeNote(keyIndex, scaleId, deg, oct) {
    const t = tonicName(keyIndex, scaleId);
    const scale = SCALE_BY_ID[scaleId];
    const sp = spellDegree(t, deg);
    const inScale = scale ? scale.degrees.some(d => degreeSemis(d) === degreeSemis(deg)) : true;
    return {
      solfege: solfegeFor(deg),
      letter: sp.name,
      degree: deg.replace(/#/g, '♯').replace(/b/g, '♭'),
      spelled: sp,
      color: KEY_COLORS[sp.letter],
      midi: melodyMidi(keyIndex, deg, oct),
      inScale
    };
  }

  /* All 12 chromatic degrees, spelled for the scale (in-scale ones use the
     scale's own spelling), for pickers. */
  function chromaticDegrees(scaleId) {
    const scale = SCALE_BY_ID[scaleId];
    const out = [];
    for (let s = 0; s < 12; s++) out.push(semisToDegree(s, scale ? scale.degrees : []));
    return out;
  }

  return {
    LETTERS, KEY_COLORS, TONIC_FLAT, TONIC_SHARP, SCALES, SCALE_BY_ID, QUALITIES,
    parseDegree, degreeSemis, spellDegree, semisToDegree, solfegeFor, romanFor,
    tonicName, tonicMidi, midiToFreq, melodyMidi, chordMidis, describeChord, describeNote,
    chordInScale, chromaticDegrees, accUnicode, chordTones, spellTones, qualityTones, applyMods, romanForTones, suffixFor,
    MODIFIERS: [
      { key: 'z', name: 'sus2', does: 'the 3rd drops to the 2nd' },
      { key: 'x', name: 'add9', does: 'adds the major 9th' },
      { key: 'c', name: 'sus4', does: 'the 3rd rises to the 4th' },
      { key: 'v', name: '♭7', does: 'adds the minor 7th' },
      { key: 'b', name: 'maj7', does: 'adds the major 7th (with ♭7: a 6th)' }
    ]
  };
})();

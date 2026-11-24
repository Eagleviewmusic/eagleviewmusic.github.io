/*
 * Key Blocks — chord layers reference implementation
 * ---------------------------------------------------
 * Drop-in reference for the chord side of Key Blocks:
 *   - SCALES: for every scale, today's layout (cur), the proposed layout (keys: home row, Q row,
 *     number row, each with the reason it earns its key) and the reasons for each change (chg)
 *   - MODIFIERS: the Z X C V B transforms (sus2, add 9, sus4, ♭7, maj7; V + B = 6th), applied to any chord key
 *   - spell(): turns any chord into note names for any tonic
 *
 * Chords are stored relative to the tonic (root token + quality), so the same
 * data works in all 12 keys. Nothing here depends on the rest of the app.
 *
 * Works in the browser (window.KeyBlocksLayers) and in Node (require()).
 */
(function (root) {
  'use strict';

  // ---------- pitch / letter basics ----------
  const NAT_PC = [0, 2, 4, 5, 7, 9, 11];            // C D E F G A B
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const ACC = { '-2': '𝄫', '-1': '♭', '0': '', '1': '♯', '2': '𝄪' };

  // Root token: optional b/# + upper-case numeral, e.g. "bVI", "#IV", "V".
  function parseRoot(token) {
    const m = /^([b#♭♯]?)(VII|VI|IV|V|III|II|I)$/.exec(token);
    if (!m) throw new Error('Bad root token ' + token);
    const deg = NUMERALS.indexOf(m[2]);
    const acc = m[1] === 'b' || m[1] === '♭' ? -1 : m[1] === '#' || m[1] === '♯' ? 1 : 0;
    return { deg, pc: (NAT_PC[deg] + acc + 12) % 12 };
  }
  function rootToken(deg, pc) {
    deg = ((deg % 7) + 7) % 7;
    let acc = (((pc - NAT_PC[deg]) % 12) + 12) % 12;
    if (acc > 6) acc -= 12;
    return (acc < 0 ? '♭'.repeat(-acc) : '♯'.repeat(acc)) + NUMERALS[deg];
  }

  // ---------- chord qualities: [semitones above root, chord degree] ----------
  const Q = {
    maj: [[0, 1], [4, 3], [7, 5]],
    min: [[0, 1], [3, 3], [7, 5]],
    dim: [[0, 1], [3, 3], [6, 5]],
    aug: [[0, 1], [4, 3], [8, 5]],
    '5': [[0, 1], [7, 5]],
    sus2: [[0, 1], [2, 2], [7, 5]],
    sus4: [[0, 1], [5, 4], [7, 5]],
    '7': [[0, 1], [4, 3], [7, 5], [10, 7]],
    maj7: [[0, 1], [4, 3], [7, 5], [11, 7]],
    m7: [[0, 1], [3, 3], [7, 5], [10, 7]],
    mmaj7: [[0, 1], [3, 3], [7, 5], [11, 7]],
    hdim7: [[0, 1], [3, 3], [6, 5], [10, 7]],
    dim7: [[0, 1], [3, 3], [6, 5], [9, 7]],
    '7s5': [[0, 1], [4, 3], [8, 5], [10, 7]],
    '7b5': [[0, 1], [4, 3], [6, 5], [10, 7]],
    '6': [[0, 1], [4, 3], [7, 5], [9, 6]],
    '69': [[0, 1], [4, 3], [7, 5], [9, 6], [14, 9]],
    '7b9': [[0, 1], [4, 3], [7, 5], [10, 7], [13, 9]],
    '7s9': [[0, 1], [4, 3], [7, 5], [10, 7], [15, 9]],
    '9s5': [[0, 1], [4, 3], [8, 5], [10, 7], [14, 9]],
    '13b9': [[0, 1], [4, 3], [7, 5], [10, 7], [13, 9], [21, 13]],
    '9sus4': [[0, 1], [5, 4], [7, 5], [10, 7], [14, 9]],
    'b5': [[0, 1], [4, 3], [6, 5]],
  };

  // Symbol suffix + whether the numeral is lower-case, keyed by the sorted semitone list.
  const NAMES = {
    '0,4,7': ['', 0], '0,3,7': ['m', 1], '0,3,6': ['°', 1], '0,4,8': ['+', 0], '0,7': ['5', 0],
    '0,5,7': ['sus4', 0], '0,2,7': ['sus2', 0],
    '0,4,7,10': ['7', 0], '0,4,7,11': ['maj7', 0], '0,3,7,10': ['m7', 1], '0,3,7,11': ['m(maj7)', 1],
    '0,3,6,10': ['ø7', 1], '0,3,6,9': ['°7', 1], '0,4,8,10': ['7♯5', 0], '0,4,8,11': ['maj7♯5', 0],
    '0,4,6,10': ['7♭5', 0], '0,4,7,9': ['6', 0], '0,3,7,9': ['m6', 1],
    '0,5,7,10': ['7sus4', 0], '0,5,7,11': ['maj7sus4', 0], '0,2,7,10': ['7sus2', 0], '0,2,7,11': ['maj7sus2', 0],
    '0,2,7,9': ['6sus2', 0], '0,5,7,14': ['sus4(add9)', 0], '0,5,7,9': ['6sus4', 0],
    '0,4,7,14': ['add9', 0], '0,3,7,14': ['m(add9)', 1], '0,3,7,17': ['m(add11)', 1],
    '0,3,6,14': ['°(add9)', 1], '0,3,6,17': ['°(add11)', 1], '0,4,8,14': ['+(add9)', 0],
    '0,4,7,13': ['(add♭9)', 0], '0,4,6,14': ['(♭5 add9)', 0], '0,7,14': ['5(add9)', 0], '0,5,7,17': ['sus4', 0],
    '0,4,7,10,14': ['9', 0], '0,4,7,11,14': ['maj9', 0], '0,3,7,10,14': ['m9', 1], '0,3,7,11,14': ['m(maj9)', 1],
    '0,4,7,10,13': ['7♭9', 0], '0,4,7,10,15': ['7♯9', 0], '0,3,6,10,14': ['ø9', 1], '0,3,6,10,17': ['ø7(add11)', 1],
    '0,3,6,9,14': ['°7(add9)', 1], '0,3,6,9,17': ['°7(add11)', 1], '0,4,8,10,14': ['9♯5', 0], '0,4,8,11,14': ['maj9♯5', 0],
    '0,4,6,10,14': ['9♭5', 0], '0,3,7,10,17': ['m11(no9)', 1], '0,4,7,9,14': ['6/9', 0], '0,3,7,9,14': ['m6/9', 1],
    '0,5,7,10,14': ['9sus4', 0], '0,5,7,11,14': ['maj9sus4', 0], '0,2,7,10,14': ['7sus2', 0],
    '0,4,7,10,13,21': ['13♭9', 0], '0,4,7,10,21': ['13', 0], '0,4,7,11,18': ['maj7♯11', 0],
    '0,4,8,10,13': ['7♯5♭9', 0], '0,4,6,10,13': ['7♭5♭9', 0], '0,3,7,11,17': ['m(maj7)(add11)', 1],
    '0,4,8,11,21': ['maj7♯5(add13)', 0], '0,4,7,9,21': ['6', 0], '0,3,6,9,21': ['°7', 1],
    '0,4,7,10,15,21': ['13♯9', 0], '0,4,7,10,13,15': ['7♭9♯9', 0], '0,4,8,10,14,21': ['9♯5', 0],
    '0,4,7,11,13': ['maj7(♭9)', 0], '0,4,7,11,21': ['maj7(add13)', 0], '0,3,7,10,21': ['m7(add13)', 1],
    '0,4,8,10,15': ['7♯5♯9', 0], '0,4,6,10,15': ['7♭5♯9', 0], '0,3,7,9,17': ['m6(add11)', 1],
    '0,2,7,14': ['sus2', 0], '0,7,17': ['5(add11)', 0], '0,5,7,10,13': ['7sus4♭9', 0],
    '0,3,6,10,13': ['ø7(♭9)', 1], '0,4,6,10,21': ['7♭5(add13)', 0], '0,5,7,10,17': ['7sus4', 0],
    '0,4,7,11,17': ['maj7(add11)', 0], '0,3,7,10,13': ['m7(♭9)', 1], '0,4,7,9,13': ['6(♭9)', 0],
    '0,4,8,11,13': ['maj7♯5(♭9)', 0], '0,4,8,11,15': ['maj7♯5(♯9)', 0],
    '0,4,7,10,14,21': ['13', 0], '0,3,7,10,14,21': ['m13', 1], '0,3,6,10,14,21': ['ø9(add13)', 1],
    '0,4,7,9,11': ['maj7(add13)', 0], '0,4,7,9,11,14': ['maj13', 0], '0,7,9,14': ['6sus2', 0],
    '0,7,10': ['7(no3)', 0], '0,7,10,14': ['9(no3)', 0], '0,5,7,10,13,21': ['13sus4(♭9)', 0],
    '0,3,7,10,13,21': ['m7(♭9,13)', 1], '0,4,8,9': ['+(add6)', 0], '0,4,8,9,11': ['maj7♯5(add6)', 0],
    '0,4,6,10,13,21': ['7♭5♭9(add13)', 0], '0,4,7,10,13,21': ['13♭9', 0],
    '0,3,7,9,10': ['m7(add13)', 1],
    '0,3,6,11,14': ['°(maj9)', 1], '0,7,11': ['maj7(no3)', 0], '0,7,9': ['6(no3)', 0], '0,7,11,14': ['maj9(no3)', 0],
    '0,4,7,11,15': ['maj7♯9', 0], '0,4,7,9,15': ['6♯9', 0], '0,4,6,11': ['maj7♭5', 0], '0,4,6,9': ['6♭5', 0], '0,4,6,11,14': ['maj9♭5', 0],
    '0,4,6': ['(♭5)', 0], '0,3,6,11': ['°(maj7)', 1], '0,2,5,7': ['sus2sus4', 0], '0,2,5,7,10': ['7sus2sus4', 0],
    '0,5,7,10,14,21': ['13sus4', 0],
  };

  function describe(tones) {
    const key = tones.map(t => t[0]).sort((a, b) => a - b).join(',');
    const n = NAMES[key];
    return n ? { suffix: n[0], lower: !!n[1] } : { suffix: '(' + key + ')', lower: false, unknown: true };
  }

  // ---------- chord object ----------
  // { deg, pc, tones:[[semi,deg],...], label?, role? }  (deg/pc of the root, relative to the tonic)
  function makeChord(rootTok, quality, role) {
    const r = parseRoot(rootTok);
    if (!Q[quality]) throw new Error('Unknown quality ' + quality);
    return { deg: r.deg, pc: r.pc, tones: Q[quality].map(t => t.slice()), role: role || null };
  }
  function numeral(ch) {
    const d = describe(ch.tones);
    let tok = rootToken(ch.deg, ch.pc);
    if (d.lower) tok = tok.toLowerCase().replace('♭', '♭').replace('♯', '♯');
    let suf = d.suffix;
    if (d.lower && suf.startsWith('m') && !suf.startsWith('maj')) suf = suf.slice(1);
    return tok + suf;
  }
  function has(ch, semi) { return ch.tones.some(t => ((t[0] % 12) === (semi % 12))); }
  function hasExact(ch, semi) { return ch.tones.some(t => t[0] === semi); }
  function withTone(ch, semi, deg) {
    const c = clone(ch);
    if (!has(c, semi)) c.tones.push([semi, deg]);
    c.tones.sort((a, b) => a[0] - b[0]);
    return c;
  }
  function without(ch, semis) { const c = clone(ch); c.tones = c.tones.filter(t => !semis.includes(t[0])); return c; }
  function clone(ch) { return { deg: ch.deg, pc: ch.pc, tones: ch.tones.map(t => t.slice()), role: ch.role }; }

  function inScale(scale, ch, semi) { return scale.pcs.includes((ch.pc + semi) % 12); }
  function isBorrowed(scale, ch) { return ch.tones.some(t => !inScale(scale, ch, t[0])); }
  function third(ch) { return hasExact(ch, 4) ? 4 : hasExact(ch, 3) ? 3 : null; }
  function fifth(ch) { return hasExact(ch, 7) ? 7 : hasExact(ch, 6) ? 6 : hasExact(ch, 8) ? 8 : null; }
  function seventh(ch) { return hasExact(ch, 10) ? 10 : hasExact(ch, 11) ? 11 : (hasExact(ch, 9) && fifth(ch) === 6 && third(ch) === 3 ? 9 : null); }
  function isDominant(ch) { return third(ch) === 4 && hasExact(ch, 10); }

  // ---------- the five modifiers ----------
  // Held keys. They change WHATEVER chord key is pressed, the same way every time, in every scale:
  //   Z  sus2     the 3rd drops to the 2nd           (5th made perfect)
  //   X  add 9    adds the major 9th                 (replaces a ♭9 / ♯9)
  //   C  sus4     the 3rd rises to the 4th           (5th made perfect)
  //   V  ♭7       adds the minor 7th                 (replaces any 7th or 6th already there)
  //   B  maj7     adds the major 7th                 (replaces any 7th or 6th already there)
  //   V + B       adds the major 6th instead of a 7th; on a diminished chord that 6th is the °7
  // Several held at once apply in this order: 7th/6th (V, B) → sus (Z, C) → 9th (X). Z + C = sus2 + sus4.
  function isDimTriad(ch) { return hasExact(ch, 3) && hasExact(ch, 6); }
  function setTop(ch, semi) {
    const dim = isDimTriad(ch);
    const c = without(ch, [9, 10, 11]);
    c.tones.push([semi, semi === 9 && !dim ? 6 : 7]);
    c.tones.sort((a, b) => a[0] - b[0]);
    return c;
  }
  function suspend(ch, two, four) {
    let c = without(ch, [3, 4, 15, 6, 8]);
    if (!hasExact(c, 7)) c.tones.push([7, 5]);
    if (two && !has(c, 2)) c.tones.push([2, 2]);
    if (four && !has(c, 5)) c.tones.push([5, 4]);
    c.tones.sort((a, b) => a[0] - b[0]);
    return c;
  }
  function addNine(ch) {
    let c = without(ch, [13, 15]);
    if (!has(c, 2)) c.tones.push([14, 9]);
    c.tones.sort((a, b) => a[0] - b[0]);
    return c;
  }
  function applyModifiers(scale, chord, heldKeys) {
    const m = new Set(heldKeys);
    let c = clone(chord);
    if (m.has('V') && m.has('B')) c = setTop(c, 9);
    else if (m.has('V')) c = setTop(c, 10);
    else if (m.has('B')) c = setTop(c, 11);
    if (m.has('Z') || m.has('C')) c = suspend(c, m.has('Z'), m.has('C'));
    if (m.has('X')) c = addNine(c);
    c.label = numeral(c);
    return c;
  }

  // ---------- spelling ----------
  // tonic: { letter: 0-6 (C=0), pc: 0-11 }   e.g. C = {letter:0,pc:0}, E♭ = {letter:2,pc:3}
  function noteName(letter, pc, simplify) {
    letter = ((letter % 7) + 7) % 7;
    let acc = (((pc - NAT_PC[letter]) % 12) + 12) % 12;
    if (acc > 6) acc -= 12;
    if (simplify && Math.abs(acc) >= 2) {            // respell 𝄫/𝄪 to the nearest simple name
      const l2 = acc > 0 ? letter + 1 : letter - 1;
      return noteName(l2, pc, false);
    }
    return LETTERS[letter] + (String(acc) in ACC ? ACC[String(acc)] : '?');
  }
  function spell(chord, tonic, simplify) {
    tonic = tonic || { letter: 0, pc: 0 };
    const rootLetter = tonic.letter + chord.deg;
    const rootPc = (tonic.pc + chord.pc) % 12;
    const tones = chord.tones.slice().sort((a, b) => a[0] - b[0]);
    const notes = tones.map(t => noteName(rootLetter + (t[1] - 1), (rootPc + t[0]) % 12, simplify !== false));
    const d = describe(chord.tones);
    return {
      symbol: noteName(rootLetter, rootPc, true) + d.suffix,
      numeral: chord.label || numeral(chord),
      notes,
      semitones: tones.map(t => (chord.pc + t[0])),   // relative to tonic; >= 12 means "an octave up" (9ths etc.)
      unknownName: !!d.unknown,
    };
  }

  // ---------- scales and layouts ----------
  // cur  = the layout today (keys F D S A T R E Q W, "-" = empty).
  // keys = the proposed layout. F D S A T R are always the original. [root, quality, "tag | why it earns its key"]
  // chg  = changes to E / W / Q and why.
  const SCALES = [
    {
      name: "Major", family: "Diatonic", pcs: [0,2,4,5,7,9,11],
      cur: "I:maj V:maj IV:maj VI:min II:min III:min II:maj III:maj bVII:maj",
      keys: {
        F: ["I","maj","tonic"],
        D: ["V","maj","dominant"],
        S: ["IV","maj","subdominant"],
        A: ["VI","min","relative minor"],
        T: ["II","min","ii → V"],
        R: ["III","min","tonic substitute"],
        E: ["II","maj","V/V → V"],
        Q: ["III","maj","V/vi → vi"],
        W: ["bVII","maj","IV/IV → IV"],
        '1': ["bVI","maj","borrowed ♭VI | The submediant borrowed from minor (vi ↔ ♭VI): the deceptive V → ♭VI and the ♭VI → ♭VII → I cadence. A♭ is on no other key."],
        '2': ["IV","min","borrowed iv | The minor subdominant: IV → iv → I. No modifier turns IV minor, so it needs its own key."],
        '3': ["#IV","dim7","vii°7/V → V | The diminished approach to V, stacked with E (V/V): IV → ♯iv°7 → I/V, the gospel and stride walk-up. Adds F♯, on no other key."],
        '4': ["VII","maj","V/iii → iii | The secondary dominant of iii, right above it (VII → iii, + V = B7). Completes the set: every diatonic chord now has its V on a key."],
        '5': ["VI","maj","V/ii → ii | The secondary dominant of ii, right above it: I → VI → ii → V. + V = A7."],
      },
      chg: [
      ],
    },
    {
      name: "Minor", family: "Diatonic", pcs: [0,2,3,5,7,8,10],
      cur: "I:min V:maj bVI:maj IV:min bVII:maj bIII:maj IV:maj V:min II:dim7",
      keys: {
        F: ["I","min","tonic"],
        D: ["V","maj","dominant (harmonic)"],
        S: ["bVI","maj","submediant"],
        A: ["IV","min","subdominant"],
        T: ["bVII","maj","subtonic"],
        R: ["bIII","maj","relative major"],
        E: ["IV","maj","IV → V"],
        Q: ["V","min","modal v"],
        W: ["II","hdim7","iiø7 → V"],
        '1': ["II","maj","V/V → V | The secondary dominant of V (+ V = D7). Also pulls into Q’s v."],
        '2': ["bII","maj","Neapolitan → V | The classic minor-key predominant, a companion to ♭VI and iiø7 on this finger. + V = ♭II7, the tritone sub."],
        '3': ["bIII","aug","V+ (as ♭III+) → i | E♭ G B is V with a raised 5th (G B E♭): a dominant with the leading tone that no modifier makes. vii°7 is already W + V + B."],
        '4': ["I","maj","Picardy / V/iv | The major tonic to end on, and V of iv (+ V = C7 → iv)."],
        '5': ["III","maj","chromatic mediant | E major, the hexatonic pole of C minor: a film-score move no other key reaches."],
      },
      chg: [
        ["W","ii°7 → iiø7","The original is spelled D F A♭ C♭: that is B°7, the leading-tone chord, not a ii chord. iiø7 (D F A♭ C) is the minor-key predominant that leads into V. The original sound is still there as W + V + B."],
      ],
    },
    {
      name: "Natural Minor", family: "Diatonic", pcs: [0,2,3,5,7,8,10],
      cur: "I:min V:min IV:min bVI:maj bVII:maj bIII:maj bII:maj IV:maj V:maj",
      keys: {
        F: ["I","min","tonic"],
        D: ["V","min","modal dominant"],
        S: ["IV","min","subdominant"],
        A: ["bVI","maj","submediant"],
        T: ["bVII","maj","subtonic"],
        R: ["bIII","maj","relative major"],
        E: ["V","maj","harmonic V (v ↔ V)"],
        Q: ["IV","maj","bright four"],
        W: ["bII","maj","Neapolitan → V"],
        '1': ["II","maj","V/V → V | The secondary dominant of V (+ V = D7), leading into E."],
        '2': ["II","hdim7","iiø7 → V | The diatonic predominant of natural minor, on no other key. iiø7 → V → i."],
        '3': ["bIII","aug","V+ (as ♭III+) → i | E♭ G B is V with a raised 5th (G B E♭), pulling into i. vii°7 is already 2 + V + B."],
        '4': ["I","maj","Picardy / V/iv | The major tonic to end on, and V of iv (+ V = C7 → iv)."],
        '5': ["III","maj","chromatic mediant | E major, the hexatonic pole of C minor."],
      },
      chg: [
        ["E","♭II → V","Middle finger = dominant: v on D and its major twin V directly above it. V was on the ring finger, over iv, which it does not lead into."],
        ["W","V → ♭II","The Neapolitan now sits over iv: it is iv with one note raised (F A♭ C → F A♭ D♭), and both are predominants."],
      ],
    },
    {
      name: "Harmonic Minor", family: "Diatonic", pcs: [0,2,3,5,7,8,11],
      cur: "I:min V:maj IV:min bVI:maj VII:dim bIII:aug bII:maj bIII:maj IV:maj",
      keys: {
        F: ["I","min","tonic"],
        D: ["V","maj","dominant"],
        S: ["IV","min","subdominant"],
        A: ["bVI","maj","submediant"],
        T: ["VII","dim","leading-tone triad"],
        R: ["bIII","aug","augmented mediant"],
        E: ["bII","maj","Neapolitan → V"],
        Q: ["bIII","maj","V/♭VI → ♭VI"],
        W: ["IV","maj","bright four"],
        '1': ["bVII","maj","V/♭III → ♭III | The natural-minor ♭VII, and V of the ♭III right below it: ♭VII → ♭III → ♭VI runs down the pinky."],
        '2': ["II","hdim7","iiø7 → V | The harmonic-minor predominant, on no other key."],
        '3': ["II","maj","V/V → V | The secondary dominant of V (+ V = D7)."],
        '4': ["I","maj","Picardy / V/iv | The major tonic to end on, and V of iv."],
        '5': ["III","maj","chromatic mediant | E major, the hexatonic pole of C minor."],
      },
      chg: [
      ],
    },
    {
      name: "Melodic Minor", family: "Diatonic", pcs: [0,2,3,5,7,9,11],
      cur: "I:min V:maj IV:maj VI:dim II:min bIII:aug bVI:maj bVII:maj VII:dim",
      keys: {
        F: ["I","min","tonic"],
        D: ["V","maj","dominant"],
        S: ["IV","maj","major subdominant"],
        A: ["VI","dim","vi°"],
        T: ["II","min","ii → V"],
        R: ["bIII","aug","augmented mediant"],
        E: ["bVI","maj","♭VI → V"],
        Q: ["bVII","maj","borrowed ♭VII"],
        W: ["VII","dim","leading-tone triad"],
        '1': ["bII","maj","Neapolitan | ♭II → V, and with + V the tritone sub ♭II7 → i that jazz minor leans on."],
        '2': ["IV","min","borrowed iv | The minor subdominant, twin of the major IV on S: IV → iv → i."],
        '3': ["II","maj","V/V → V | The secondary dominant of V (+ V = D7)."],
        '4': ["I","maj","parallel major | Melodic minor is one note from major; this is the major tonic (and V of IV)."],
        '5': ["VI","maj","V/ii → ii | The secondary dominant of ii, right above it (+ V = A7)."],
      },
      chg: [
      ],
    },
    {
      name: "Dorian", family: "Modes", pcs: [0,2,3,5,7,9,10],
      cur: "I:min IV:maj bIII:maj V:min bVII:maj II:min bVI:maj VI:dim7 V:maj",
      keys: {
        F: ["I","min","tonic"],
        D: ["IV","maj","Dorian IV"],
        S: ["bIII","maj","relative major"],
        A: ["V","min","minor v"],
        T: ["bVII","maj","subtonic"],
        R: ["II","min","ii"],
        E: ["I","maj","V/IV → IV"],
        Q: ["VI","dim7","vii°7/v → v"],
        W: ["bVI","maj","IV/♭III → ♭III"],
        '1': ["II","maj","V/v → v | The secondary dominant of the minor v on A (+ V = D7), and V/V for the harmonic V on 3."],
        '2': ["IV","min","borrowed iv | The Aeolian shadow of the Dorian IV: IV → iv → i. No modifier makes it."],
        '3': ["V","maj","harmonic V → i | The major dominant (B♮) for a strong cadence to i, and V of the I on E."],
        '4': ["VI","maj","V/ii → ii | The secondary dominant of ii, right above it (+ V = A7)."],
        '5': ["VII","dim7","vii°7 → i | The leading-tone °7, a darker cadence to i. Adds B as a root."],
      },
      chg: [
        ["E","♭VI → I","D holds the Dorian IV, so the key above it should lead into IV: I (C major) is V of IV. It is also the major tonic, the Dorian ↔ Mixolydian swing."],
        ["W","V → ♭VI","S holds ♭III, so W should lead into ♭III: ♭VI is IV of ♭III, the same job Major’s W (IV/IV) does. ♭VI moves here from E; V moves to key 3."],
      ],
    },
    {
      name: "Phrygian", family: "Modes", pcs: [0,1,3,5,7,8,10],
      cur: "I:min bII:maj bIII:maj IV:min bVI:maj bVII:min bV:maj V:dim bVII:maj",
      keys: {
        F: ["I","min","tonic"],
        D: ["bII","maj","cadence ♭II → i"],
        S: ["bIII","maj","mediant"],
        A: ["IV","min","subdominant"],
        T: ["bVI","maj","submediant"],
        R: ["bVII","min","minor subtonic"],
        E: ["bV","maj","IV/♭II → ♭II"],
        Q: ["V","dim","rootless V7/iv → iv"],
        W: ["bVII","maj","V/♭III → ♭III"],
        '1': ["I","maj","V/iv → iv | The full chord behind Q’s rootless v°, and the Spanish major tonic (+ V = C7 → iv)."],
        '2': ["IV","maj","V/♭VII → ♭VII | Leads into W: F → B♭ → E♭ runs down the ring finger in fifths. Also the bright twin of iv."],
        '3': ["V","maj","major V → i | The Andalusian landing chord (i → ♭VII → ♭VI → V) and a hard cadence to i."],
        '4': ["V","min","Aeolian v | A softer dominant; leans the mode toward natural minor."],
        '5': ["II","hdim7","iiø7 → V | With key 3 it makes the minor ii → V → i. D♮ is on no other key."],
      },
      chg: [
      ],
    },
    {
      name: "Lydian", family: "Modes", pcs: [0,2,4,6,7,9,11],
      cur: "I:maj V:maj II:maj III:min VI:min VII:min IV:maj #IV:dim II:dim",
      keys: {
        F: ["I","maj","tonic"],
        D: ["V","maj","dominant"],
        S: ["II","maj","Lydian II"],
        A: ["III","min","iii"],
        T: ["VI","min","vi"],
        R: ["VII","min","vii"],
        E: ["IV","maj","IV → V"],
        Q: ["VII","maj","V/iii → iii"],
        W: ["VI","maj","V/II → II"],
        '1': ["bVII","maj","Mixolydian ♭VII | The most common borrowed chord in Lydian rock and film; ♭VI → ♭VII → I with key 4."],
        '2': ["III","maj","V/VI → VI | Leads into W: E → A → D → G runs down the ring finger and into V, the ragtime chain."],
        '3': ["#IV","dim","♯iv° → V | The Lydian leading-tone chord to V, built on the ♯4 itself (+ V = F♯ø7)."],
        '4': ["bVI","maj","chromatic mediant | I → ♭VI, the film-Lydian move; with key 1 it makes ♭VI → ♭VII → I."],
        '5': ["II","min","Ionian ii | The minor twin of the Lydian II: flips the colour back toward major."],
      },
      chg: [
        ["W","ii° → VI","ii° (D F A♭) has two notes outside Lydian and leads nowhere. VI is V of II, so it pulls into the Lydian II below it, the same job Major’s W does."],
        ["Q","♯iv° → VII","A holds iii; VII is V of iii, so Q now leads into the chord below it, as Major’s Q (V/vi) does. ♯iv° moves to key 3, above E, where it leads into V."],
      ],
    },
    {
      name: "Mixolydian", family: "Modes", pcs: [0,2,4,5,7,9,10],
      cur: "I:maj bVII:maj IV:maj V:min II:min VI:min bVI:maj bIII:maj III:dim",
      keys: {
        F: ["I","maj","tonic"],
        D: ["bVII","maj","modal dominant"],
        S: ["IV","maj","subdominant"],
        A: ["V","min","Mixolydian v"],
        T: ["II","min","ii"],
        R: ["VI","min","vi"],
        E: ["bVI","maj","♭VI → ♭VII"],
        Q: ["bIII","maj","borrowed ♭III"],
        W: ["III","dim","rootless I7 → IV"],
        '1': ["II","maj","V/v → v | The secondary dominant of the Mixolydian v on A (+ V = D7)."],
        '2': ["IV","min","borrowed iv | IV → iv → I, the minor-subdominant shade under the ring finger."],
        '3': ["V","maj","Ionian V → I | The major dominant (B♮): a real V → I when the song leaves the mode."],
        '4': ["III","maj","V/vi → vi | The secondary dominant of vi, right above it (+ V = E7)."],
        '5': ["VI","maj","V/ii → ii | The secondary dominant of ii, right above it (+ V = A7)."],
      },
      chg: [
      ],
    },
    {
      name: "Locrian", family: "Modes", pcs: [0,1,3,5,6,8,10],
      cur: "I:dim IV:min bIII:min bVII:min bII:maj bVI:maj IV:maj bVI:aug bV:maj",
      keys: {
        F: ["I","dim","tonic"],
        D: ["IV","min","subdominant"],
        S: ["bIII","min","minor mediant"],
        A: ["bVII","min","minor subtonic"],
        T: ["bII","maj","half-step cadence"],
        R: ["bVI","maj","submediant"],
        E: ["IV","maj","bright four"],
        Q: ["bVI","aug","augmented ♭VI"],
        W: ["bV","maj","♭V"],
        '1': ["bVII","maj","major ♭VII | The bright twin of ♭vii (A): ♭VII is IV of iv and the Phrygian/Aeolian colour."],
        '2': ["bIII","maj","major ♭III | The bright twin of ♭iii (S), borrowed from Phrygian."],
        '3': ["I","maj","V/iv → iv | Leads into D (iv); also the full escape to a major tonic."],
        '4': ["I","min","minor tonic | The “rescue” from i°: the same root with a stable 5th."],
        '5': ["V","maj","V → i | A real dominant (G B D) for leaving the mode; + V = G7."],
      },
      chg: [
      ],
    },
    {
      name: "Major Pentatonic", family: "Pentatonic & blues", pcs: [0,2,4,7,9],
      cur: "I:maj V:maj IV:maj VI:min II:min I:sus2 V:sus4 III:min bVII:maj",
      keys: {
        F: ["I","maj","tonic"],
        D: ["V","maj","dominant"],
        S: ["IV","maj","subdominant"],
        A: ["VI","min","relative minor"],
        T: ["II","min","ii → V"],
        R: ["I","sus2","open tonic"],
        E: ["II","maj","V/V → V"],
        Q: ["III","min","iii → vi"],
        W: ["bVII","maj","IV/IV → IV"],
        '1': ["III","maj","V/vi → vi | The major twin of iii (Q), pulling into vi: the country/pop III → vi."],
        '2': ["bIII","maj","IV/♭VII → ♭VII | Leads into W: ♭III → ♭VII → IV → I, the rock double-plagal chain down the ring finger."],
        '3': ["bVI","maj","♭VI → V / ♭VII | Borrowed ♭VI: ♭VI → ♭VII → I, or into V (+ V = the German-sixth sound)."],
        '4': ["IV","min","borrowed iv → I | The minor subdominant: IV → iv → I."],
        '5': ["VI","maj","V/ii → ii | The secondary dominant of ii, right above it (+ V = A7)."],
      },
      chg: [
        ["E","Vsus4 → V/V","Vsus4 is now D + C. E gets V/V (D major), which leads into V below it, as in Major."],
      ],
    },
    {
      name: "Minor Pentatonic", family: "Pentatonic & blues", pcs: [0,3,5,7,10],
      cur: "I:min IV:min bVII:maj bIII:maj bVI:maj V:min IV:maj I:m7 V:maj",
      keys: {
        F: ["I","min","tonic"],
        D: ["IV","min","subdominant"],
        S: ["bVII","maj","subtonic"],
        A: ["bIII","maj","relative major"],
        T: ["bVI","maj","borrowed ♭VI"],
        R: ["V","min","minor v"],
        E: ["IV","maj","bright four"],
        Q: ["I","5","power chord"],
        W: ["V","maj","harmonic V"],
        '1': ["bII","maj","metal ♭II → i | The half-step-above chord of metal and Phrygian riffs."],
        '2': ["II","maj","V/V → V | Leads into W (V), a secondary dominant (+ V = D7)."],
        '3': ["I","7s9","V7/iv → iv | The “Hendrix” 7♯9, pulling into iv on D. The ♯9 is the point, and no modifier adds one."],
        '4': ["bV","maj","blue-note ♭V | The ♭5 of the blues as a root: i → ♭V → iv."],
        '5': ["VII","dim7","vii°7 → i | A leading-tone °7 the scale itself lacks."],
      },
      chg: [
        ["Q","i7 → I5","i7 is now F + V. The power chord cannot be made by any modifier and is the core sound of minor-pentatonic rock."],
      ],
    },
    {
      name: "Blues", family: "Pentatonic & blues", pcs: [0,3,5,6,7,10],
      cur: "I:7 IV:7 V:7 bIII:maj bVII:maj IV:min bVI:maj II:hdim7 bV:dim7",
      keys: {
        F: ["I","7","tonic"],
        D: ["IV","7","subdominant"],
        S: ["V","7","dominant"],
        A: ["bIII","maj","blues-rock ♭III"],
        T: ["bVII","maj","subtonic"],
        R: ["IV","min","minor iv"],
        E: ["bVI","maj","♭VI → V7"],
        Q: ["II","hdim7","iiø7 → V7"],
        W: ["bV","dim7","passing °7 → V7"],
        '1': ["VI","7","V7/ii → ii | The turnaround chord I → VI7 → ii → V7, pulling into Q."],
        '2': ["II","7","V7/V → V7 | Leads into V7 on S (the same pull as W’s °7, with a root)."],
        '3': ["bII","7","tritone sub → I7 | The ♭II7 → I7 ending and the tritone sub for V7."],
        '4': ["III","m7","iii7 | Starts the long turnaround iii7 → VI7 → ii → V7."],
        '5': ["I","m7","minor-blues tonic | Switches the tune to a minor blues on the same root."],
      },
      chg: [
      ],
    },
    {
      name: "Whole Tone", family: "Symmetric", pcs: [0,2,4,6,8,10],
      cur: "I:aug II:aug III:aug #IV:aug #V:aug bVII:aug I:7s5 II:7s5 I:7b5",
      keys: {
        F: ["I","aug","root C"],
        D: ["II","aug","root D"],
        S: ["III","aug","root E"],
        A: ["#IV","aug","root F♯"],
        T: ["#V","aug","root G♯"],
        R: ["bVII","aug","root B♭"],
        E: ["II","7b5","7♭5 colour on D"],
        Q: ["III","7b5","7♭5 colour on E"],
        W: ["I","7b5","7♭5 colour on C"],
        '1': ["I","maj","exit to C | Whole tone has no tonic; this lands on one."],
        '2': ["IV","maj","exit to F | Where C7♯5 (F + V) wants to resolve."],
        '3': ["V","maj","exit dominant | G major, outside the scale: + V = G7 → I."],
        '4': ["bVI","maj","mediant exit | The film “wake-up” to a distant major chord."],
        '5': ["I","min","minor exit | Lands the dream on C minor instead."],
      },
      chg: [
        ["E","I7♯5 → II7♭5","I7♯5 is now F + V (augmented + ♭7). The scale has exactly three 7♭5 colours, and the Q row now holds all three: W on C, E on D, Q on E."],
        ["Q","II7♯5 → III7♭5","II7♯5 is now D + V. See E."],
      ],
    },
    {
      name: "Octatonic (half–whole)", family: "Symmetric", pcs: [0,1,3,4,6,7,9,10],
      cur: "I:7 bIII:7 VI:7 #IV:7 I:dim7 bII:dim7 I:maj bIII:maj VI:maj",
      keys: {
        F: ["I","7","root C"],
        D: ["bIII","7","root E♭"],
        S: ["VI","7","root A"],
        A: ["#IV","7","root F♯"],
        T: ["I","dim7","tonic °7"],
        R: ["bII","dim7","the other °7"],
        E: ["bIII","maj","triad on E♭"],
        Q: ["#IV","maj","triad on F♯"],
        W: ["VI","maj","triad on A"],
        '1': ["#IV","min","minor triad on F♯ | The octatonic’s minor half: F♯7, F♯ and F♯m stack on the pinky."],
        '2': ["VI","min","minor triad on A | Completes the ring finger: A7, A, Am."],
        '3': ["bIII","min","minor triad on E♭ | Completes the middle finger: E♭7, E♭, E♭m."],
        '4': ["I","maj","major triad on C | C7 minus its 7th (moved here from E)."],
        '5': ["I","min","minor triad on C | Completes the index finger: C7, C, Cm."],
      },
      chg: [
        ["E","I → ♭III","Each finger now owns one of the scale’s four roots: the 7th chord on the home row, its major triad above it, its minor triad on the number row. D is E♭7, so E is E♭."],
        ["Q","♭III → ♯IV","A is F♯7, so Q is F♯. The C triad moves to key 4, over the index finger that holds C7."],
      ],
    },
    {
      name: "Octatonic (whole–half)", family: "Symmetric", pcs: [0,2,3,5,6,8,9,11],
      cur: "I:dim7 II:dim7 IV:min IV:maj II:min II:maj bVI:maj bVI:min VII:maj",
      keys: {
        F: ["I","dim7","tonic °7"],
        D: ["II","dim7","the other °7"],
        S: ["IV","min","triad on F"],
        A: ["IV","maj","triad on F"],
        T: ["II","min","triad on D"],
        R: ["II","maj","triad on D"],
        E: ["bVI","maj","triad on A♭"],
        Q: ["bVI","min","triad on A♭"],
        W: ["VII","maj","triad on B"],
        '1': ["VII","min","minor triad on B | The last of the scale’s eight triads."],
        '2': ["VI","min","deceptive exit | A minor: lands the diminished colour on vi."],
        '3': ["V","maj","exit dominant | G major (+ V = G7) to cadence out to C."],
        '4': ["I","maj","exit tonic | C major."],
        '5': ["I","min","minor exit | C minor."],
      },
      chg: [
      ],
    },
    {
      name: "Double Harmonic", family: "World", pcs: [0,1,4,5,7,8,11],
      cur: "I:maj bII:maj IV:min III:min bVI:aug I:maj7 bII:maj7 bII:7 IV:mmaj7",
      keys: {
        F: ["I","maj","tonic"],
        D: ["bII","maj","half-step cadence"],
        S: ["IV","min","subdominant"],
        A: ["III","min","iii"],
        T: ["bVI","aug","augmented ♭VI"],
        R: ["I","maj7","signature tonic"],
        E: ["V","b5","scale’s own V → I"],
        Q: ["bVI","maj","V/♭II → ♭II"],
        W: ["III","dim7","rootless I7♭9 → iv"],
        '1': ["bIII","maj","V/♭VI → ♭VI | Leads into Q: E♭ → A♭ → D♭ → C walks down to the tonic in fifths."],
        '2': ["IV","maj","bright four | The major twin of iv on S."],
        '3': ["V","maj","plain V → I | G major with D♮: the Western cadence next to the scale’s own G(♭5) on E."],
        '4': ["I","min","minor tonic | Hijaz ↔ minor: the same root, minor."],
        '5': ["bVII","min","Hijaz ♭vii | B♭ minor, borrowed from Phrygian Dominant, the sister scale."],
      },
      chg: [
        ["E","♭IImaj7 → V(♭5)","♭IImaj7 is now D + B. The scale had no chord on G at all; G B D♭ uses only scale notes and resolves to I (+ V = G7♭5)."],
        ["Q","♭II7 → ♭VI","♭II7 is now D + V. ♭VI is V of ♭II, so it pulls into the cadence chord on D."],
        ["W","iv(maj7) → iii°7","iv(maj7) is now S + B. E°7 (E G B♭ D♭) is C7♭9 without its root, the Hijaz dominant that resolves into iv right below it."],
      ],
    },
    {
      name: "Hungarian Minor", family: "World", pcs: [0,2,3,6,7,8,11],
      cur: "I:min V:maj bVI:maj bIII:aug VII:min I:mmaj7 bVI:maj7 bVI:7 -",
      keys: {
        F: ["I","min","tonic"],
        D: ["V","maj","dominant"],
        S: ["bVI","maj","submediant"],
        A: ["bIII","aug","augmented mediant"],
        T: ["VII","min","vii"],
        R: ["I","mmaj7","signature i(maj7)"],
        E: ["II","7b5","French +6 → V"],
        Q: ["#IV","dim7","♯iv°7 → V"],
        W: ["bIII","maj","V/♭VI → ♭VI"],
        '1': ["II","maj","V/V → V | The secondary dominant of V (+ V = D7)."],
        '2': ["IV","min","borrowed iv | The subdominant the scale lacks (it has F♯, not F)."],
        '3': ["VII","dim7","vii°7 → i | The leading-tone °7 cadence."],
        '4': ["I","maj","Picardy tonic | The major tonic to end on."],
        '5': ["bII","maj","Neapolitan → V | The classic minor predominant."],
      },
      chg: [
        ["E","♭VImaj7 → Fr+6","♭VImaj7 is now S + B, and the German sixth ♭VI7 is S + V. The French sixth (D F♯ A♭ C) uses only scale notes and resolves into V below it."],
        ["Q","♭VI7 → ♯iv°7","♭VI7 is now S + V. ♯iv°7 is built on the scale’s signature ♯4 and pulls into V."],
        ["W","(empty) → ♭III","The scale had only eight chords. ♭III is V of ♭VI, so it leads into S below it."],
      ],
    },
    {
      name: "Phrygian Dominant", family: "World", pcs: [0,1,4,5,7,8,10],
      cur: "I:maj bII:maj IV:min bVII:min bVI:aug I:7 bII:maj7 bVII:dim bVI:maj",
      keys: {
        F: ["I","maj","tonic"],
        D: ["bII","maj","half-step cadence"],
        S: ["IV","min","subdominant"],
        A: ["bVII","min","minor subtonic"],
        T: ["bVI","aug","augmented ♭VI"],
        R: ["I","7","hijaz tonic"],
        E: ["bV","maj","IV/♭II → ♭II"],
        Q: ["bVII","dim","rootless I7♭9 → iv"],
        W: ["bVI","maj","V/♭II → ♭II"],
        '1': ["bVII","maj","major ♭VII | The bright twin of ♭vii (A), and IV of iv."],
        '2': ["bIII","maj","Andalusian ♭III | iv → ♭III → ♭II → I, the flamenco descent; also V of ♭VI on W."],
        '3': ["IV","maj","bright four | The major twin of iv on S."],
        '4': ["I","min","minor tonic | Turns the hijaz back into plain Phrygian."],
        '5': ["V","dim","rootless V7 → ♭VI | G° (G B♭ D♭), the scale’s own diminished chord, pulling into ♭VI on W."],
      },
      chg: [
        ["E","♭IImaj7 → ♭V","♭IImaj7 is now D + B. ♭V is IV of ♭II and leads into it, as E does in Phrygian."],
      ],
    },
  ];

  const CUR_ORDER = ['F', 'D', 'S', 'A', 'T', 'R', 'E', 'Q', 'W'];
  // The chord that key had before this proposal (null if the key was empty).
  function currentChordFor(scale, key) {
    const tok = scale.cur.split(' ')[CUR_ORDER.indexOf(key)];
    if (!tok || tok === '-') return null;
    const [r, q] = tok.split(':');
    const c = makeChord(r, q); c.label = numeral(c); return c;
  }
  // Short tag and the reason a key holds its chord ('tag | why').
  function tagFor(scale, key) { return String(scale.keys[key][2]).split(' | ')[0]; }
  function whyFor(scale, key) { const p = String(scale.keys[key][2]).split(' | '); return p[1] || ''; }

  const KEYS = { number: ['1', '2', '3', '4', '5'], row2: ['Q', 'W', 'E', 'R', 'T'], home: ['A', 'S', 'D', 'F', 'G'], mods: ['Z', 'X', 'C', 'V', 'B'] };
  const CHORD_KEYS = ['F', 'D', 'S', 'A', 'T', 'R', 'E', 'Q', 'W', '1', '2', '3', '4', '5']; // new CHORD_HANDS order (G = first + Add slot)
  const MODIFIERS = {
    Z: { name: 'sus2', finger: 'pinky', does: 'the 3rd drops to the 2nd' },
    X: { name: 'add 9', finger: 'ring', does: 'adds the major 9th' },
    C: { name: 'sus4', finger: 'middle', does: 'the 3rd rises to the 4th' },
    V: { name: '♭7', finger: 'index', does: 'adds the minor 7th' },
    B: { name: 'maj7', finger: 'index (reach)', does: 'adds the major 7th' },
    'V+B': { name: '6', does: 'adds the major 6th instead of a 7th (°7 on a diminished chord)' },
  };

  function chordFor(scale, key) {
    const k = scale.keys[key];
    if (!k) return null;
    const c = makeChord(k[0], k[1], k[2]);
    c.label = numeral(c);
    return c;
  }

  const api = { SCALES, KEYS, CHORD_KEYS, MODIFIERS, makeChord, chordFor, currentChordFor, tagFor, whyFor, applyModifiers, spell, numeral, isBorrowed, noteName, describe, rootToken };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KeyBlocksLayers = api;
})(typeof window !== 'undefined' ? window : this);

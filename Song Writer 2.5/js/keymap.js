/* ==========================================================================
   Song Writer — keymap.js (2.5)
   --------------------------------------------------------------------------
   THREE KEYBOARDS. What the letter and number keys do depends on what is
   out (SW.settings.shows — a part a lesson keeps away counts as away):

   chords out, keyboard or not — 'accordion': Digital Accordion's split,
     both hands.
       LEFT, chords: F D S A G R E Q W and 1–5 play the panel's places,
         ringing while held; Z X C V B held change them — pressed or let
         go while a chord is held, they strike it again, changed (a
         trilled suspension). In Edit, while a lane slot glows, the chord
         is written there (chord-strip.js trigger).
       RIGHT, melody, by scale step from the tonic on J (Digital
         Accordion's MELODY_HANDS.right):
           J = do   K L ; = re mi fa   U I O P = so la ti do′
           7 8 9 0 - = re′ mi′ fa′ so′ la′
           N M , . / = mi fa so la ti below do
         In F the same keys play F G A B♭ …; in a pentatonic scale each
         key is the next of its five notes.
   keyboard out, no chords — 'flex': the Virtual Keyboard's Flex. Four
     rows, each walking ten keys up the scale from the tonic, an octave
     apart: Z X C V B N M , . / from do an octave down, A S D F G H J K L ;
     from do, Q W E R T Y U I O P from do′, 1 2 3 4 5 6 7 8 9 0 from do″.
   neither — 'letters': 1.0's solfège letters in Edit (score.js
     handleSolfegeKeyInput) and nothing in Perform, as before.

   Do is the song's own (the "do" block), so the keys sound where the
   blocks sit. That is where Digital Accordion puts its tonic in every
   key, and where the Virtual Keyboard's A row starts in every key but G
   (there it is an octave higher, with Song Writer's G blocks).

   Shift or Caps Lock, as each app has it: 'accordion' — the melody an
   octave up (Digital Accordion's 8va); 'flex' — the Z row an octave down,
   the number row an octave up, the A and Q rows unchanged.

   The chord in hand bends them (chords.js bend — Digital Accordion's
   chordBend): under V/V in C the key for fa plays F♯. A note keeps the
   pitch it was pressed with until it is let go.

   A melody key is the keyboard dock's key (SW.dock.keyDown): it rings
   while it is held, lights a key when the keyboard is out (the Flex keys
   by the Virtual Keyboard's own rule — flexLight), and in Edit
   sets the selected block, as a tap on that key does — in both of the
   Edit box's panes.

   API
     SW.keymap.layout()             'accordion' | 'flex' | 'letters'
     SW.keymap.keyDown(event)       true when the key belongs to the layout
     SW.keymap.keyUp(event)
     SW.keymap.noteFor(k, shifted)  the MIDI a key plays just now, or null
     SW.keymap.flexLight(k, shifted) the MIDI key a Flex key lights, or null
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const M = SW.music;
  const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

  /* Digital Accordion's right hand: steps from the tonic */
  const MELODY_RIGHT = { tonic: 'j', up: ['k', 'l', ';', 'u', 'i', 'o', 'p', '7', '8', '9', '0', '-'], down: ['/', '.', ',', 'm', 'n'] };
  const ACCORDION_STEP = {};
  ACCORDION_STEP[MELODY_RIGHT.tonic] = 0;
  MELODY_RIGHT.up.forEach((k, i) => { ACCORDION_STEP[k] = i + 1; });
  MELODY_RIGHT.down.forEach((k, i) => { ACCORDION_STEP[k] = -(i + 1); });

  /* the Virtual Keyboard's Flex rows, bottom row first, and what Shift does to each */
  const FLEX_ROWS = ['zxcvbnm,./', 'asdfghjkl;', 'qwertyuiop', '1234567890'];
  const FLEX_SHIFT = [-1, 0, 0, 1];
  const FLEX = {};
  FLEX_ROWS.forEach((keys, row) => keys.split('').forEach((k, pos) => { FLEX[k] = { row, pos }; }));

  /* a shifted character back to its key */
  const SHIFT_MAP = { '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    ':': ';', '<': ',', '>': '.', '?': '/', '_': '-', '+': '=', '{': '[', '}': ']', '"': "'" };

  function layout() {
    if (SW.settings.shows('strip')) return 'accordion';
    if (SW.settings.shows('dock')) return 'flex';
    return 'letters';
  }

  /* the scale's steps (the scale menu beside the key), in semitones above
     do; `bent` (chords.js bend()): the chord in hand moves the step on its
     note's letter — F to F♯ under V/V in C */
  function degrees() {
    const sc = SW.chords && SW.chords.scale();
    return sc && typeof Theory !== 'undefined' ? sc.degrees : null;
  }
  function stepMidi(step, bent) {
    const degs = degrees();
    const s = degs ? degs.map(Theory.degreeSemis) : [0, 2, 4, 5, 7, 9, 11], n = s.length;
    const i = ((step % n) + n) % n;
    return 12 * Math.floor(step / n) + s[i] + (bent && degs ? SW.chords.bendDelta(degs[i], bent) : 0);
  }
  const bentNow = () => (SW.chords && SW.chords.bend ? SW.chords.bend() : null);

  function keyOf(event) {
    const k = event.key || '';
    if (own(SHIFT_MAP, k)) return SHIFT_MAP[k];
    return k.length === 1 ? k.toLowerCase() : null;
  }
  const shifted = event => !!(event.shiftKey || (event.getModifierState && event.getModifierState('CapsLock')));

  function noteFor(k, shift, which) {
    which = which || layout();
    const tonic = M.noteMidi('do', 'natural');
    if (tonic === null) return null;
    const bent = bentNow();
    if (which === 'accordion' && own(ACCORDION_STEP, k)) return tonic + stepMidi(ACCORDION_STEP[k], bent) + (shift ? 12 : 0);
    if (which === 'flex' && own(FLEX, k)) {
      const f = FLEX[k];
      return tonic + 12 * (f.row - 1) + stepMidi(f.pos, bent) + (shift ? 12 * FLEX_SHIFT[f.row] : 0);
    }
    return null;
  }

  /* Which key a Flex key lights: the Virtual Keyboard's rule
     (getNoteMapping), on its own window (the keyboard shows that window
     with only the keyboard out — keyboard-dock.js vkWindow). Not the
     note it sounds, but its PLACE in its row:
       one octave showing — every row lights the A row's note at that
       place, so , lights the C above A's though both play the same C;
       two — the Z and Q rows light the Z row's notes (the lower run),
       the A and number rows the A row's (the upper run);
       three or four — each key lights its own note.
     A scale of fewer than seven notes climbs past the top within ten
     keys: those notes light an octave (or two) lower — except the number
     row with three octaves, which lights only what is showing. Shifted,
     with three or four octaves, a key lights where it now sounds if that
     key is in the window. A song too wide for the window moves the keys
     whole octaves (flexFrame().offset): the picture moves with them. */
  function flexLight(f, shift) {
    const fr = SW.dock.flexFrame();
    const n = fr.n;
    const refRow = n === 1 ? 1 : n === 2 ? f.row % 2 : f.row;
    let m = M.noteMidi('do', 'natural') + 12 * (refRow - 1) + stepMidi(f.pos);
    if (refRow < Math.max(n, 2)) while (m > fr.top) m -= 12;
    const sh = shift ? FLEX_SHIFT[f.row] : 0;
    if (sh && n >= 3 && m + 12 * sh >= fr.lo && m + 12 * sh <= fr.top) m += 12 * sh;
    // the chord in hand bends the note, and its light moves with it (F → F♯ at the same place)
    m += stepMidi(f.pos, bentNow()) - stepMidi(f.pos);
    // off the window: no light (the white key the keyboard adds after a black end note is not in it)
    return m < fr.lo || m > fr.top ? null : m + fr.offset;
  }

  /* ---------------- the keys ---------------- */
  const held = new Map();                    // event.code → the dock's handle for the note it holds
  const chordKeys = new Set();               // event.codes holding a chord (chord-strip.js release)
  const codeOf = event => event.code || keyOf(event);

  function keyDown(event) {
    const which = layout();
    if (which === 'letters') return false;
    const k = keyOf(event);
    if (!k) return false;
    if (which === 'accordion') {
      const place = SW.chords.placeForKey(k);
      if (place) {
        event.preventDefault();
        // held until the key comes up: Z X C V B meanwhile strike it again, changed
        if (!event.repeat) { chordKeys.add(codeOf(event)); SW.chordStrip.trigger(place, /^[1-5]$/.test(k) ? 'number' : 'key', codeOf(event)); }
        return true;
      }
      if (SW.chords.isModKey(k)) {
        event.preventDefault();
        if (!event.repeat) SW.chords.setMod(k.toUpperCase(), true);
        return true;
      }
    }
    const m = noteFor(k, shifted(event), which);
    if (m === null) return false;
    event.preventDefault();
    const code = codeOf(event);
    if (event.repeat || held.has(code)) return true;
    const sh = shifted(event);
    held.set(code, SW.dock.keyDown(m, which === 'flex' ? flexLight(FLEX[k], sh) : undefined));
    return true;
  }

  function keyUp(event) {
    const code = codeOf(event);
    if (chordKeys.delete(code)) SW.chordStrip.release(code);
    if (!held.has(code)) return;
    SW.dock.keyUp(held.get(code));
    held.delete(code);
  }

  // the window losing focus mid-note never sends the keyup
  window.addEventListener('blur', () => {
    held.forEach(h => SW.dock.keyUp(h));
    held.clear();
    chordKeys.forEach(code => SW.chordStrip.release(code));
    chordKeys.clear();
  });

  SW.keymap = { layout, keyDown, keyUp, noteFor, flexLight: (k, shift) => (own(FLEX, k) ? flexLight(FLEX[k], !!shift) : null) };
})();

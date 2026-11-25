/* ==========================================================================
   orchestra-keys.js: Key and scale, and the Flex computer keys, for the
   Virtual Orchestra's instruments (flute, clarinet, trumpet, recorder).

   MASTER COPY: virtual-orchestra/_tools/orchestra-keys.js. Edit only this one.
   `node virtual-orchestra/_tools/sync.mjs` copies it into virtual-flute/,
   virtual-clarinet/, virtual-trumpet/ and virtual-recorder/, and from there
   into the orchestra's seats.

   Ported from the Virtual Keyboard:
   - the scales are its theory.js list (a copy of Digital Accordion's), degrees
     only, without "Minor" (the same notes as Natural Minor), and the tonic is
     spelled by the same rule (fewest accidentals, a tie goes to the flat);
   - Flex is its four rows of ten keys, Z X C … /, A S D … ;, Q W E … P and
     1 2 3 … 0, each climbing the scale from the tonic, each an octave above
     the row below it; Shift plays the Z row an octave lower and the number row
     an octave higher.
   What an instrument adds: a range. The Z row starts on the tonic that leaves
   the fewest of the instrument's notes out (a note out of every row counts
   double a silent key at the start of the Z row), and a key past the range
   plays nothing.

   The page keeps its own note pad, notes and saved settings; this file draws
   the settings section and answers: which note does this key play, what label
   does this note's button get, which notes are in the scale, how is a sharp
   or flat spelled in this key. Pitches are MIDI numbers here; the pages name
   them 'C#4' (OrchestraKeys.pitchToMidi / midiToPitch convert).
   ========================================================================== */
window.OrchestraKeys = (() => {
  'use strict';

  // ----- scales (Virtual Keyboard's theory.js, degrees only) -----
  const SCALES = [
    { id: 'major', name: 'Major', family: 'Diatonic', degrees: ['1', '2', '3', '4', '5', '6', '7'] },
    { id: 'natural-minor', name: 'Natural Minor', family: 'Diatonic', degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'] },
    { id: 'harmonic-minor', name: 'Harmonic Minor', family: 'Diatonic', degrees: ['1', '2', 'b3', '4', '5', 'b6', '7'] },
    { id: 'melodic-minor', name: 'Melodic Minor', family: 'Diatonic', degrees: ['1', '2', 'b3', '4', '5', '6', '7'] },
    { id: 'dorian', name: 'Dorian', family: 'Modes', degrees: ['1', '2', 'b3', '4', '5', '6', 'b7'] },
    { id: 'phrygian', name: 'Phrygian', family: 'Modes', degrees: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'] },
    { id: 'lydian', name: 'Lydian', family: 'Modes', degrees: ['1', '2', '3', '#4', '5', '6', '7'] },
    { id: 'mixolydian', name: 'Mixolydian', family: 'Modes', degrees: ['1', '2', '3', '4', '5', '6', 'b7'] },
    { id: 'locrian', name: 'Locrian', family: 'Modes', degrees: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'] },
    { id: 'major-pentatonic', name: 'Major Pentatonic', family: 'Pentatonic & blues', degrees: ['1', '2', '3', '5', '6'] },
    { id: 'minor-pentatonic', name: 'Minor Pentatonic', family: 'Pentatonic & blues', degrees: ['1', 'b3', '4', '5', 'b7'] },
    { id: 'blues', name: 'Blues', family: 'Pentatonic & blues', degrees: ['1', 'b3', '4', 'b5', '5', 'b7'] },
    { id: 'whole-tone', name: 'Whole Tone', family: 'Symmetric', degrees: ['1', '2', '3', '#4', '#5', 'b7'] },
    { id: 'octatonic-hw', name: 'Octatonic (half–whole)', family: 'Symmetric', degrees: ['1', 'b2', 'b3', '3', '#4', '5', '6', 'b7'] },
    { id: 'octatonic-wh', name: 'Octatonic (whole–half)', family: 'Symmetric', degrees: ['1', '2', 'b3', '4', 'b5', 'b6', '6', '7'] },
    { id: 'double-harmonic', name: 'Double Harmonic', family: 'World', degrees: ['1', 'b2', '3', '4', '5', 'b6', '7'] },
    { id: 'hungarian-minor', name: 'Hungarian Minor', family: 'World', degrees: ['1', '2', 'b3', '#4', '5', 'b6', '7'] },
    { id: 'phrygian-dominant', name: 'Phrygian Dominant', family: 'World', degrees: ['1', 'b2', '3', '4', '5', 'b6', 'b7'] },
  ];
  const SCALE_BY_ID = Object.fromEntries(SCALES.map(s => [s.id, s]));

  // ----- spelling (theory.js) -----
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];
  const TONIC_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
  const TONIC_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const PITCHES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];   // the pages' own pitch names
  const BLACK = new Set([1, 3, 6, 8, 10]);
  const MINOR_FAMILY = new Set(['natural-minor', 'harmonic-minor', 'melodic-minor']);

  function parseDegree(d) {
    const m = /^([#b]*)([1-7])$/.exec(String(d));
    if (!m) return { num: 1, alter: 0 };
    let alter = 0;
    for (const ch of m[1]) alter += ch === '#' ? 1 : -1;
    return { num: +m[2], alter };
  }
  function degreeSemis(d) {
    const { num, alter } = parseDegree(d);
    return ((MAJOR_SEMIS[num - 1] + alter) % 12 + 12) % 12;
  }
  function parseNote(n) {
    const s = String(n);
    let alter = 0;
    for (const ch of s.slice(1)) alter += ch === '♯' || ch === '#' ? 1 : ch === '♭' || ch === 'b' ? -1 : 0;
    return { letter: s[0], alter };
  }
  function notePc(n) {
    const { letter, alter } = parseNote(n);
    return ((LETTER_PC[letter] + alter) % 12 + 12) % 12;
  }
  function accidental(alter) {
    return alter === 0 ? '' : alter > 0 ? '♯'.repeat(alter) : '♭'.repeat(-alter);
  }
  // A degree ('b3', '#4' …) spelled from a spelled tonic ('E♭')
  function spellDegree(tonic, d) {
    const t = parseNote(tonic);
    const { num } = parseDegree(d);
    const letter = LETTERS[(LETTERS.indexOf(t.letter) + num - 1) % 7];
    const pc = (notePc(tonic) + degreeSemis(d)) % 12;
    let alter = ((pc - LETTER_PC[letter]) % 12 + 12) % 12;
    if (alter > 6) alter -= 12;
    return { letter, alter, name: letter + accidental(alter), pc };
  }
  // The tonic's name: fewest accidental marks in the scale wins, a tie goes to the flat;
  // C♯ and G♯ minor keep their usual sharp names
  function tonicName(pc, scaleId) {
    const flat = TONIC_FLAT[pc], sharp = TONIC_SHARP[pc];
    if (flat === sharp) return flat;
    if (MINOR_FAMILY.has(scaleId) && (pc === 1 || pc === 8)) return sharp;
    const scale = SCALE_BY_ID[scaleId] || SCALES[0];
    const cost = t => scale.degrees.reduce((n, d) => n + Math.abs(spellDegree(t, d).alter), 0);
    return cost(sharp) < cost(flat) ? sharp : flat;
  }

  function pitchToMidi(pitch) {
    const m = /^([A-G])(#?)(-?\d)$/.exec(pitch);
    return m ? (Number(m[3]) + 1) * 12 + LETTER_PC[m[1]] + (m[2] ? 1 : 0) : null;
  }
  function midiToPitch(midi) {
    return PITCHES[midi % 12] + (Math.floor(midi / 12) - 1);
  }

  // ----- Flex (Virtual Keyboard's FLEX_ROWS), by e.code so any keyboard layout works -----
  const ROWS = [
    ['KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash'],
    ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'],
    ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
    ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'],
  ];
  const ROW_LABELS = ['zxcvbnm,./', 'asdfghjkl;', 'qwertyuiop', '1234567890'];
  const ROW_LEN = 10;
  const SHIFT = [-1, 0, 0, 1];   // Shift: the Z row an octave lower, the number row an octave higher
  const CODE_AT = {};
  ROWS.forEach((codes, row) => codes.forEach((code, pos) => { CODE_AT[code] = { row, pos }; }));

  // ----- colours for the little keyboard map (the pages' LETTER_COLORS) -----
  function hexRgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function luminance(hex) {
    const [r, g, b] = hexRgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function midColor(a, b) {
    const x = hexRgb(a), y = hexRgb(b);
    return '#' + x.map((v, i) => Math.round((v + y[i]) / 2).toString(16).padStart(2, '0')).join('');
  }

  const FOLD_KEY = 'virtual-orchestra-flex-note';   // the explaining note folded into its ⓘ (this device)

  let styled = false;
  function addStyles(accent) {
    if (styled) return;
    styled = true;
    const css = `
      .ok-pick { display: flex; align-items: center; gap: 6px; }
      .ok-arrow {
        flex: none; width: 32px; height: 34px; padding: 0;
        border: 1.5px solid #d1d5db; border-radius: 9px; background: #fff;
        font: 13px system-ui, -apple-system, sans-serif; color: #374151; cursor: pointer;
      }
      .ok-arrow:hover { border-color: ${accent}; color: ${accent}; }
      .ok-pick select {
        height: 34px; padding: 0 8px; border: 1.5px solid #d1d5db; border-radius: 9px; background: #fff;
        font: 700 15px system-ui, -apple-system, sans-serif; color: #1f2937; cursor: pointer;
      }
      .ok-pick select:focus-visible, .ok-arrow:focus-visible { outline: 3px solid ${accent}; outline-offset: 1px; }
      .ok-key { width: 62px; text-align: center; }
      .ok-scale { flex: 1; min-width: 0; }
      .ok-concert { margin-top: 6px; font-size: 12.5px; color: #4b5563; }
      .ok-concert[hidden] { display: none; }
      .ok-sub { margin: 12px 0 6px; font-weight: 700; font-size: 13.5px; }
      .ok-map { margin-top: 10px; display: grid; gap: 3px; }
      .ok-map[hidden] { display: none; }
      .ok-row { display: flex; gap: 3px; }
      .ok-cell {
        position: relative; box-sizing: border-box; flex: none; width: 26px; height: 30px;
        display: flex; align-items: flex-end; justify-content: center; padding-bottom: 3px;
        border-radius: 5px; border: 1px solid rgba(0, 0, 0, 0.22);
        font: 700 11px system-ui, -apple-system, sans-serif; line-height: 1;
      }
      .ok-cell i { position: absolute; top: 2px; left: 3px; font: normal 8.5px monospace; opacity: 0.7; text-transform: uppercase; }
      .ok-cell.tonic { box-shadow: inset 0 0 0 2px rgba(31, 41, 55, 0.75); }
      .ok-cell.silent { background: #fff; border: 1px dashed #cbd5e1; color: #9ca3af; }
      .ok-note { margin-top: 8px; font-size: 11.5px; color: #6b7280; }
      .ok-note .ok-i {
        display: inline-flex; align-items: center; justify-content: center; width: 17px; height: 17px;
        margin-left: 3px; padding: 0; vertical-align: -3px; border: 1.3px solid #9ca3af; border-radius: 50%;
        background: #fff; font: italic 700 10.5px Georgia, serif; color: #6b7280; cursor: pointer;
      }
      .ok-note .ok-i:hover { border-color: ${accent}; color: ${accent}; }
      .ok-note.folded .ok-text { display: none; }
      .ok-note.folded .ok-i { margin-left: 0; }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* opts:
       mount       the settings section to draw into (emptied)
       low, high   the instrument's range (MIDI, as the page names its notes)
       saved       { key, scale, keys } as state() gave it, or nothing
       defaults    { key: 0–11, scale: id, keys: 'flex' | 'chromatic' }
       instrument  'the flute': for "keys past the flute's range"
       firstNotes  what the page's own small view is called ('First notes', 'G major'), for the note
       concert     () => ({ offset, on }) for a transposing instrument ('on a B♭ trumpet'), else nothing
       colors      the page's LETTER_COLORS
       accent      the page's colour
       onChange    () => …  after the key, the scale or the computer keys change */
  function create(opts) {
    const d = opts.defaults || {};
    const s = opts.saved || {};
    let key = Number.isInteger(s.key) && s.key >= 0 && s.key < 12 ? s.key : (d.key || 0);
    let scaleId = SCALE_BY_ID[s.scale] ? s.scale : (SCALE_BY_ID[d.scale] ? d.scale : 'major');
    let keys = s.keys === 'chromatic' || s.keys === 'flex' ? s.keys : (d.keys || 'flex');
    let low = opts.low, high = opts.high;
    let semis = [], base = 0;
    const colors = opts.colors || {};

    function scale() { return SCALE_BY_ID[scaleId]; }
    function tonic() { return tonicName(key, scaleId); }
    function inRange(m) { return m >= low && m <= high; }

    // What a key plays with no Shift
    function rowMidi(row, pos) {
      const n = semis.length;
      return base + 12 * row + 12 * Math.floor(pos / n) + semis[pos % n];
    }
    // The Z row's tonic: of the tonics from two octaves under the range up, the one whose rows leave the
    // fewest of the instrument's scale notes out (each counts 2) and start the Z row on the fewest
    // silent keys (each counts 1); the lower one on a tie
    function chooseBase() {
      const n = semis.length;
      const scaleNotes = [];
      for (let m = low; m <= high; m++) if (semis.includes(((m - key) % 12 + 12) % 12)) scaleNotes.push(m);
      let best = null;
      for (let t = key + 12 * Math.floor((low - 24 - key) / 12); t <= high; t += 12) {
        const reach = new Set();
        let silent = 0, counting = true, plays = false;
        for (let row = 0; row < 4; row++) for (let pos = 0; pos < ROW_LEN; pos++) {
          const m = t + 12 * row + 12 * Math.floor(pos / n) + semis[pos % n];
          reach.add(m);
          if (row === 0) {
            if (inRange(m)) plays = true;
            if (counting && m < low) silent++; else counting = false;
          }
        }
        if (!plays) continue;
        const cost = 2 * scaleNotes.filter(m => !reach.has(m)).length + silent;
        if (!best || cost < best.cost) best = { t, cost };
      }
      return best ? best.t : key + 12 * Math.ceil((low - key) / 12);
    }
    function rebuild() {
      semis = scale().degrees.map(degreeSemis);
      base = chooseBase();
    }

    // ----- what the page asks -----
    function midiForCode(code, shift) {
      const at = CODE_AT[code];
      if (!at) return null;
      const m = rowMidi(at.row, at.pos) + (shift ? 12 * SHIFT[at.row] : 0);
      return inRange(m) ? m : null;
    }
    // A note's key: the plain key furthest left in its row, else Shift and one
    function labelFor(midi) {
      let found = null;
      for (let row = 0; row < 4; row++) for (let pos = 0; pos < ROW_LEN; pos++) {
        if (rowMidi(row, pos) === midi && (!found || pos < found.pos)) found = { row, pos };
      }
      if (found) return ROW_LABELS[found.row][found.pos];
      for (let row = 0; row < 4; row++) {
        if (!SHIFT[row]) continue;
        for (let pos = 0; pos < ROW_LEN; pos++) {
          if (rowMidi(row, pos) + 12 * SHIFT[row] === midi && (!found || pos < found.pos)) found = { row, pos };
        }
      }
      return found ? '⇧' + ROW_LABELS[found.row][found.pos] : '';
    }
    function inScale(midi) { return semis.includes(((midi - key) % 12 + 12) % 12); }
    function scaleMidis() {
      const out = [];
      for (let m = low; m <= high; m++) if (inScale(m)) out.push(m);
      return out;
    }
    // pitch class -> the scale's name for it ('D♯'), for its sharps and flats only
    function spelling() {
      const t = tonic(), out = {};
      scale().degrees.forEach(dg => {
        const sp = spellDegree(t, dg);
        if (BLACK.has(sp.pc) && Math.abs(sp.alter) === 1) out[sp.pc] = sp.name;
      });
      return out;
    }
    // A sharp or flat in the scale takes the scale's name first (D♯ in E major, not E♭); the rest keep
    // the page's own first name. Changes each note's name, otherName, step and accidental in place.
    function respell(notes) {
      const names = spelling();
      notes.forEach(note => {
        if (!note.sharp) return;
        if (!note.ownNames) note.ownNames = [note.name, note.otherName];
        let [a, b] = note.ownNames;
        const want = names[pitchToMidi(note.pitch) % 12];
        if (want && want === b) [a, b] = [b, a];
        note.name = a;
        note.otherName = b;
        note.step = (Number(note.pitch.slice(-1)) - 4) * 7 + LETTERS.indexOf(a[0]);
        note.accidental = a[1] || '';
      });
    }

    // ----- the settings section -----
    const mount = opts.mount;
    addStyles(opts.accent || '#2563eb');
    mount.innerHTML = `
      <h3>Key and scale</h3>
      <div class="ok-pick">
        <button type="button" class="ok-arrow" data-step="-1" aria-label="Key down" title="Key down">◀</button>
        <select class="ok-key" aria-label="Key"></select>
        <button type="button" class="ok-arrow" data-step="1" aria-label="Key up" title="Key up">▶</button>
        <select class="ok-scale" aria-label="Scale"></select>
      </div>
      <div class="ok-concert" hidden></div>
      <div class="ok-sub">Computer keys</div>
      <div class="view-choice" role="radiogroup" aria-label="Computer keys">
        <button type="button" role="radio" data-keys="flex"><b>Flex</b><small>Only the scale, the same keys in every key</small></button>
        <button type="button" role="radio" data-keys="chromatic"><b>Chromatic</b><small>Every note, laid out like a piano</small></button>
      </div>
      <div class="ok-map" aria-hidden="true"></div>
      <p class="ok-note"><span class="ok-text"></span><button type="button" class="ok-i" aria-label="Fold this note" title="Fold this note">i</button></p>`;
    const keySelect = mount.querySelector('.ok-key');
    const scaleSelect = mount.querySelector('.ok-scale');
    const concertLine = mount.querySelector('.ok-concert');
    const map = mount.querySelector('.ok-map');
    const note = mount.querySelector('.ok-note');
    const noteText = mount.querySelector('.ok-text');
    const foldBtn = mount.querySelector('.ok-i');

    let family = null, group = null;
    SCALES.forEach(sc => {
      if (sc.family !== family) {
        family = sc.family;
        group = document.createElement('optgroup');
        group.label = family;
        scaleSelect.appendChild(group);
      }
      const o = document.createElement('option');
      o.value = sc.id;
      o.textContent = sc.name;
      group.appendChild(o);
    });

    function cellMarkup(m, label, isTonic) {
      if (m == null) return `<span class="ok-cell silent"><i>${label}</i></span>`;
      const pc = m % 12;
      const lower = PITCHES[pc][0];
      const name = BLACK.has(pc) ? (spelling()[pc] || TONIC_FLAT[pc]) : lower;
      let bg = colors[lower] || '#e5e7eb', ink;
      if (BLACK.has(pc)) {
        const upper = LETTERS[(LETTERS.indexOf(lower) + 1) % 7];
        const top = colors[upper] || bg;
        ink = luminance(midColor(bg, top)) > 0.3 ? '#1f2937' : '#fff';
        bg = `linear-gradient(to right, ${bg}, ${top})`;
      } else ink = luminance(bg) > 0.3 ? '#1f2937' : '#fff';
      return `<span class="ok-cell${isTonic ? ' tonic' : ''}" style="background:${bg};color:${ink}"><i>${label}</i>${name}</span>`;
    }
    function drawMap() {
      const cell = 29;   // 26 px and the gap
      const stagger = [1.25, 0.75, 0.5, 0];   // how far each row sits in, as on a keyboard
      let html = '';
      for (let row = 3; row >= 0; row--) {
        html += `<div class="ok-row" style="padding-left:${Math.round(stagger[row] * cell)}px">`;
        for (let pos = 0; pos < ROW_LEN; pos++) {
          const m = rowMidi(row, pos);
          html += cellMarkup(inRange(m) ? m : null, ROW_LABELS[row][pos], pos % semis.length === 0);
        }
        html += '</div>';
      }
      map.innerHTML = html;
    }

    function render() {
      keySelect.innerHTML = TONIC_FLAT.map((_, pc) => `<option value="${pc}">${tonicName(pc, scaleId)}</option>`).join('');
      keySelect.value = String(key);
      scaleSelect.value = scaleId;
      const c = opts.concert && opts.concert();
      concertLine.hidden = !c;
      if (c) concertLine.textContent = `Sounds in concert ${tonicName(((key + c.offset) % 12 + 12) % 12, scaleId)} ${scale().name} ${c.on}.`;
      mount.querySelectorAll('[data-keys]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.keys === keys)));
      map.hidden = keys !== 'flex';
      if (keys === 'flex') drawMap();
      const own = opts.firstNotes ? ` ${opts.firstNotes} keeps its own keys, 1 to 0.` : '';
      noteText.textContent = keys === 'flex'
        ? `Each row climbs the scale from the tonic (the ringed keys): Z low, A an octave higher, then Q and 1. ` +
          `Hold Shift and the Z row plays an octave lower, the 1 row an octave higher. The same keys work in every ` +
          `key and scale. Dashed keys are past ${opts.instrument || 'the instrument'}'s range.${own}`
        : `Every note on its own key, as each note's button shows.${own}`;
      foldBtn.title = note.classList.contains('folded') ? noteText.textContent : 'Fold this note';
    }

    function changed() {
      rebuild();
      render();
      if (opts.onChange) opts.onChange();
    }
    function setKey(pc) { key = ((pc % 12) + 12) % 12; changed(); }

    mount.querySelectorAll('.ok-arrow').forEach(b => b.addEventListener('click', () => setKey(key + Number(b.dataset.step))));
    // A chosen option lets go of the menu, so the letter keys play notes again instead of picking another key
    keySelect.addEventListener('change', () => { setKey(Number(keySelect.value)); keySelect.blur(); });
    scaleSelect.addEventListener('change', () => { scaleId = scaleSelect.value; changed(); scaleSelect.blur(); });
    mount.querySelectorAll('[data-keys]').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.keys === keys) return;
      keys = b.dataset.keys;
      changed();
    }));

    let folded = false;
    try { folded = localStorage.getItem(FOLD_KEY) === 'folded'; } catch (e) { /* private window */ }
    note.classList.toggle('folded', folded);
    foldBtn.addEventListener('click', () => {
      const now = !note.classList.contains('folded');
      note.classList.toggle('folded', now);
      foldBtn.setAttribute('aria-label', now ? 'Show this note' : 'Fold this note');
      foldBtn.title = now ? noteText.textContent : 'Fold this note';
      try { now ? localStorage.setItem(FOLD_KEY, 'folded') : localStorage.removeItem(FOLD_KEY); } catch (e) { /* private window */ }
    });
    if (folded) foldBtn.setAttribute('aria-label', 'Show this note');

    rebuild();
    render();

    return {
      get key() { return key; },
      get scaleId() { return scaleId; },
      get flex() { return keys === 'flex'; },
      get base() { return base; },
      title: () => `${tonic()} ${scale().name}`,
      state: () => ({ key, scale: scaleId, keys }),
      midiForCode, labelFor, inScale, scaleMidis, respell,
      // The clarinet's dial changes the range (and what it sounds in): no onChange, the page is redrawing anyway
      setRange(lo, hi) { low = lo; high = hi; rebuild(); render(); },
      refresh: render,
    };
  }

  return { create, SCALES, tonicName, spellDegree, pitchToMidi, midiToPitch, ROWS, ROW_LABELS };
})();

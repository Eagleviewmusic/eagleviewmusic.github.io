/* ==========================================================================
   COMPONENT SLOT — the keyboard dock (bottom)                  #keyboard-dock
   --------------------------------------------------------------------------
   A piano under the score, dressed as the Virtual Keyboard app is: a black
   frame, rainbow keys (the top half of every key wears its letter's
   colour — the same colours as the blocks), and a small panel at its left
   end with the two controls Virtual Keyboard puts in its quick row:

     1 2 3 4   how many octaves are showing. This sets the keyboard's width
               as it does in Virtual Keyboard: each octave adds seven keys
               (plus the three above the top octave), the keyboard grows
               until it fills the dock, and after that the keys get thinner.
     Focus     keys outside the song's key go grey and stop playing —
               except the notes the song itself uses: an accidental in the
               music (a D natural in A♭) unlocks that key everywhere.
               "The key" is the scale beside the key letter on the toolbar
               (SW.chords.scale(), 2026-09-27): in C natural minor E♭ A♭
               B♭ wear their colours and E A B go grey.
   With the chord panel out, these two rows sit in the corner under it
   (#corner-panel, seatPanel) and the keys take the dock's whole width.

   WHICH KEYS SHOW. The keyboard stays still while you play along, as
   Virtual Keyboard's does. If the whole song fits, the keys are placed to
   hold all of it, starting on the key's own letter where they can (C…E
   for a song in C, G…B for one in A♭ — Virtual Keyboard's ranges); if it
   does not fit (one octave, a wide tune), the keys move only when the
   selected note leaves them, to hold that note's line.

   HOW TALL. Drag the grip on the dock's top edge to any height; it snaps
   to Short, Medium and Tall on the way (double-click: Medium). The presets
   are measured against the window, so a phone, a laptop and a smartboard each
   get a keyboard of a sensible size. A key is never wider than about half
   its height allows, so a short keyboard stays a keyboard.

   LIT KEYS. The selected note's key is filled with its block's colour and
   shows a white lamp, in one row along the top of the keys (a harmony
   stack lights every note); nothing gold (the user's call). A chord from
   the panel or the lane lights its keys as background, without the lamp:
   a pale wash and a coloured lip (paint(), user 2026-10-02), so the
   melody's own keys — full colour — always show over it. The chord's keys stay lit while
   you step with the arrows or change a pitch (user, 2026-09-27); a tap on
   the manuscript — not on a note — or putting the chord panel away
   clears them (chord:cleared). View → Chords light the keys (kbChordLights)
   turns the chord's lights off; the chord is still followed, so turning
   it back on lights a chord that is already sounding. A key rings for as long as it is held, in the
   Sound popover's Melody sound; sliding a finger across the keys plays
   each one in turn; in Edit, a tap sets the selected block to that pitch
   (SW.score.setActiveNoteMidi).

   THE CHORD IN HAND BENDS THE KEYS (Digital Accordion's chordBend,
   chords.js bend): while a chord with a note outside the scale is in hand
   — V/V in C — that note takes the place of the scale's note on its
   letter: the F♯ keys wear F's colour and their name, carry a white ring
   (Digital Accordion's mark for a bent note) and play under Focus; F is
   no longer the key's (Focus greys it, unless the song uses it). It lasts
   as long as the chord's lit keys do.

   Preferences (SW.settings.view, remembered): kbOctaves 1–4, kbFocus, kbChordLights,
   dockHeight 'sm' | 'md' | 'lg' | a number of px.

   API
     SW.dock.render()   rebuild the keys (the key changed)
     SW.dock.align()    re-read the song and selection, place the keys
     SW.dock.keyDown(midi, light?) → handle · SW.dock.keyUp(handle)
                        a computer key playing a pitch (js/keymap.js)
     SW.dock.flexFrame() the Virtual Keyboard's window, for the Flex lights
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const dock = document.getElementById('keyboard-dock');
  if (!dock) return;

  const LOW = 36, HIGH = 108;                // C2 … C8 (the Virtual Keyboard's four octaves in G reach B7)
  const IS_BLACK = [false, true, false, true, false, false, true, false, true, false, true, false];
  const WHITE_LETTER = { 0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B' };
  // a real piano's black keys are not centred on the crack: C♯ and F♯ lean
  // left, D♯ and A♯ right (a fraction of the black key's width)
  const BLACK_LEAN = { 1: -0.12, 3: 0.12, 6: -0.14, 8: 0, 10: 0.14 };
  // Virtual Keyboard's colours for a black key that is not in the key
  const BLACK_PRESS = { 1: '#ff6818', 3: '#ffb000', 6: '#32c490', 8: '#189de2', 10: '#5866ee' };
  const NAMES_SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const NAMES_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
  const NAMES_C = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'];

  /* heights: [min px, share of the window's height, max px] */
  const HEIGHTS = { sm: [56, 0.085, 84], md: [84, 0.13, 140], lg: [120, 0.21, 230] };
  const MIN_H = 52;
  const FRAME_PAD = 6;                       // the black frame round the keys

  let TOTAL = 0;                             // white keys C2…C8
  for (let m = LOW; m <= HIGH; m++) if (!IS_BLACK[m % 12]) TOTAL++;

  let panel, stage, frame, viewport, strip, grip, spacer;
  let keyEls = {};                           // midi → element
  let palette = {};                          // pc → { name, color } for the key's notes and the song's
  let songMidis = [];
  let lit = { melody: [], colors: {}, primary: null, chord: [] };
  let start = null;                          // first white key showing (index from C2)
  let kw = 40, H = 100;                      // white-key width and height, px
  let dragH = null;                          // the height while the grip is dragged
  let focusHinted = false;
  let bendSig = '';                          // the chord in hand's bend, as last dressed (readSong)

  const view = () => (SW.settings && SW.settings.view) || {};
  /* Key colours (View): 'rainbow' — every key wears its note's colour on
     top; 'played' — plain keys that light in their note's colour; 'single'
     — plain keys that all light in one colour (view.kbColor). */
  const PLAIN_WHITE = '#FEFDFF';
  const colorMode = () => (['rainbow', 'played', 'single'].indexOf(view().kbColors) !== -1 ? view().kbColors : 'rainbow');
  const oneColor = () => (/^#[0-9a-f]{6}$/i.test(view().kbColor || '') ? view().kbColor : '#9C168E');
  const octaves = () => Math.min(4, Math.max(1, +view().kbOctaves || 2));
  const focusOn = () => !!view().kbFocus;
  const chordLightsOn = () => view().kbChordLights !== false;
  const whitesShown = () => (flexOn() ? vkWindow().W : 7 * octaves() + 3);

  /* THE VIRTUAL KEYBOARD'S WINDOW. With only the keyboard out, the keys
     are the Virtual Keyboard's Flex rows (js/keymap.js), and they light
     the keys the Virtual Keyboard lights — which only holds on its own
     window. So the keyboard shows that window here: from the tonic's
     white key (an octave below do; at do with one octave showing) up to
     its end note (keyDisplayRanges: the 3rd above the top tonic — B in
     G♭), the octave count's octaves apart — 17 or 18 white keys for two.
     An end note on a black key (F♯ in D) brings the white key above it,
     so it shows whole (the Virtual Keyboard hangs it over the frame). */
  const VK_END = [4, 5, 6, 7, 8, 9, 11, 11, 0, 1, 2, 3];   // the end note's pitch class, by the tonic's
  const flexOn = () => !!(SW.keymap && SW.keymap.layout() === 'flex');
  function vkWindow() {
    const n = octaves();
    const t0 = M.noteMidi('do', 'natural') - (n === 1 ? 0 : 12);
    const lo = IS_BLACK[t0 % 12] ? t0 - 1 : t0;
    const top = lo + 12 * n + ((VK_END[t0 % 12] - lo % 12) + 12) % 12;
    const first = whiteIndex(lo);
    return { n, lo, top, first, W: whiteIndex(top) - first + 1 };
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------- geometry ---------------- */
  function whiteIndex(m) {                   // white keys below m
    let n = 0;
    for (let i = LOW; i < m; i++) if (!IS_BLACK[i % 12]) n++;
    return n;
  }
  const whiteBelow = m => IS_BLACK[m % 12] ? whiteIndex(m) - 1 : whiteIndex(m);
  const whiteAbove = m => whiteIndex(m);
  function whitePc(i) {                      // pitch class of the i-th white key
    const order = [0, 2, 4, 5, 7, 9, 11];
    return order[i % 7];
  }

  /* The middle of the part of a white key's top the black keys leave
     showing (a fraction of its width) — where its lamp goes. A black key
     is 0.6 of a white key wide and leans (BLACK_LEAN) off the crack. */
  function lampCentre(pc) {
    const left = IS_BLACK[(pc + 11) % 12] ? 0.3 + 0.6 * BLACK_LEAN[(pc + 11) % 12] : 0;
    const right = IS_BLACK[(pc + 1) % 12] ? 0.7 + 0.6 * BLACK_LEAN[(pc + 1) % 12] : 1;
    return (left + right) / 2;
  }

  function heightPx() {
    if (dragH !== null) return dragH;
    const pref = view().dockHeight;
    const vh = window.innerHeight || 800;
    if (typeof pref === 'number') return clamp(pref, MIN_H, maxHeight());
    const h = HEIGHTS[pref] || HEIGHTS.md;
    return Math.round(clamp(vh * h[1], h[0], h[2]));
  }
  function presetPx(id) {
    const h = HEIGHTS[id], vh = window.innerHeight || 800;
    return Math.round(clamp(vh * h[1], h[0], h[2]));
  }
  function maxHeight() { return Math.max(140, Math.round((window.innerHeight || 800) * 0.5)); }
  // the widest a white key may be for a keyboard this tall
  const keyCap = h => clamp(h * 0.5 + 16, 40, 96);

  /* ---------------- the key's notes, and the song's ---------------- */
  function pretty(sp) {
    return sp.charAt(0) + sp.slice(1).replace(/##/g, '𝄪').replace(/#/g, '♯').replace(/b/g, '♭');
  }
  function accText(alter) { return alter > 0 ? '♯'.repeat(alter) : alter < 0 ? '♭'.repeat(-alter) : ''; }

  function readSong() {
    const key = S.key;
    const tonic = M.KEY_SIGNATURES_CHROMATIC_INDEX[key] || 0;
    palette = {};
    // the notes of the song's scale (the key's major scale unless the scale
    // menu says otherwise), spelled in Song Writer's key — for major this
    // is exactly 1.0's letterNamesByKey
    const sc = SW.chords ? SW.chords.scale() : null;
    if (sc && typeof Theory !== 'undefined') {
      // the chord in hand bends the scale (chords.js bend): under V/V in C
      // the keys have F♯ where F was — its colour, its name, Focus lets it play
      const bent = SW.chords.bend ? SW.chords.bend() : {};
      bendSig = JSON.stringify(bent);
      sc.degrees.forEach(deg => {
        const sp = Theory.spellDegree(M.spelledKey(), deg);   // C♯ minor, not D♭ minor
        const alt = bent[sp.letter];
        if (alt && alt.abs !== sp.pc) palette[alt.abs] = { name: alt.name, color: M.LETTER_COLORS[sp.letter], bent: true };
        else palette[sp.pc] = { name: sp.name, color: M.LETTER_COLORS[sp.letter] };
      });
    } else {
      const names = M.letterNamesByKey[M.spelledKey()] || M.letterNamesByKey.C;
      Object.keys(M.SOLFEGE_INTERVALS).forEach(sol => {
        const pc = (tonic + M.SOLFEGE_INTERVALS[sol]) % 12;
        const sp = names[sol];
        palette[pc] = { name: pretty(sp), color: M.LETTER_COLORS[sp.charAt(0)] };
      });
    }
    songMidis = [];
    document.querySelectorAll('#score .note').forEach(n => {
      if (n.classList.contains('rest-note')) return;
      const nc = M.noteClassOf(n);
      if (!nc) return;
      const acc = SW.score.getAccidentalFromNote(n);
      const m = M.noteMidi(nc, acc);
      if (m === null) return;
      songMidis.push(m);
      const pc = m % 12;
      if (!palette[pc]) {
        // an accidental in the music: spelled, and coloured, as its block is
        const sp = M.spellNote(nc, acc);
        palette[pc] = { name: sp.letter + accText(sp.alter), color: M.LETTER_COLORS[sp.letter] };
      }
    });
  }

  function plainName(pc) {
    if (!IS_BLACK[pc]) return WHITE_LETTER[pc];
    // sharps or flats as the key signature of this key and scale has them
    // (D minor's keyboard says B♭, D major's C♯); none: C major's mix
    const ks = SW.staff && SW.staff.keySignature ? SW.staff.keySignature(S.key, S.scale) : null;
    if (ks) return ks.kind < 0 ? NAMES_FLAT[pc] : ks.kind > 0 ? NAMES_SHARP[pc] : NAMES_C[pc];
    const k = M.spelledKey();
    if (k === 'C') return NAMES_C[pc];
    return (FLAT_KEYS.indexOf(k) !== -1 ? NAMES_FLAT : NAMES_SHARP)[pc];
  }

  /* ---------------- build ---------------- */
  function render() {
    releaseAll();                            // the keys are about to be replaced
    if (panel && panel.parentNode) panel.remove();   // it may be seated in the corner, outside the dock
    dock.innerHTML =
      '<button class="kbd-grip" type="button" role="separator" aria-orientation="horizontal" aria-label="Keyboard height — drag, or use the up and down arrows" title="Drag to make the keyboard taller or shorter (double-click: back to Medium)"><span></span></button>' +
      '<div class="kbd-panel">' +
        '<div class="kbd-oct" role="radiogroup" aria-label="Octaves showing">' +
          '<span class="kbd-kicker" aria-hidden="true">Octaves</span>' +
          '<div class="kbd-oct-btns">' +
            [1, 2, 3, 4].map(n => '<button type="button" class="kbd-oct-btn" role="radio" data-oct="' + n + '" title="' + n + (n === 1 ? ' octave' : ' octaves') + '">' + n + '</button>').join('') +
          '</div>' +
        '</div>' +
        '<button type="button" class="kbd-focus" aria-pressed="false" title="Focus — only the notes of the key, and any the song adds, play">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/></svg>' +
          '<span>Focus</span>' +
        '</button>' +
      '</div>' +
      '<div class="kbd-stage">' +
        '<div class="kbd-frame">' +
          '<div class="kbd-viewport"><div class="kbd-strip"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="kbd-spacer" aria-hidden="true"></div>';
    grip = dock.querySelector('.kbd-grip');
    panel = dock.querySelector('.kbd-panel');
    stage = dock.querySelector('.kbd-stage');
    frame = dock.querySelector('.kbd-frame');
    viewport = dock.querySelector('.kbd-viewport');
    strip = dock.querySelector('.kbd-strip');
    spacer = dock.querySelector('.kbd-spacer');
    keyEls = {};

    const frag = document.createDocumentFragment();
    for (let m = LOW; m <= HIGH; m++) {
      const pc = m % 12;
      const black = IS_BLACK[pc];
      const k = document.createElement('button');
      k.type = 'button';
      k.className = 'kkey ' + (black ? 'black' : 'white');
      k.dataset.midi = m;
      k.style.setProperty('--x', whiteIndex(m));
      if (black) k.style.setProperty('--lean', BLACK_LEAN[pc]);
      else {
        k.style.setProperty('--band-c', M.LETTER_COLORS[WHITE_LETTER[pc]]);
        k.style.setProperty('--dot-x', (lampCentre(pc) * 100).toFixed(1) + '%');
      }
      if (pc === 0) k.classList.add('is-c');
      k.innerHTML = '<span class="kkey-name"></span>';
      keyEls[m] = k;
      frag.appendChild(k);
    }
    strip.appendChild(frag);
    wirePanel();
    seatPanel();
    readSong();
    dress();
    start = null;
    layout(true);
    align(true);
  }

  /* The panel (Octaves · Focus) sits at the dock's left end — unless the
     chord panel is out too, when the corner under it (#corner-panel) takes
     the panel's two rows and the keys get the whole width. */
  function seatPanel() {
    if (!panel) return;
    const slot = document.getElementById('corner-panel');
    const b = document.body.classList;
    const cornerOut = slot && b.contains('show-strip') && b.contains('show-dock') && !b.contains('editing');   // the Edit box has the corner's place
    if (cornerOut) { if (panel.parentNode !== slot) slot.appendChild(panel); }
    else if (panel.parentNode !== dock) dock.insertBefore(panel, stage);
    dock.classList.toggle('panel-away', !!cornerOut);
  }

  /* Colours, names and Focus: what depends on the key and the song. */
  function dress() {
    const focus = focusOn();
    const rainbow = colorMode() === 'rainbow';
    dock.classList.toggle('kc-plain', !rainbow);
    for (let m = LOW; m <= HIGH; m++) {
      const k = keyEls[m];
      const pc = m % 12;
      const p = palette[pc];
      const black = IS_BLACK[pc];
      if (black) {
        k.classList.toggle('in-key', rainbow && !!p);
        if (p) k.style.setProperty('--band-c', p.color); else k.style.removeProperty('--band-c');
      } else {
        // a white key keeps its own letter's colour — unless the key spells
        // it otherwise (C♭ in G♭, E♯ in F♯), when it wears its block's
        k.style.setProperty('--band-c', !rainbow ? PLAIN_WHITE : p ? p.color : M.LETTER_COLORS[WHITE_LETTER[pc]]);
      }
      const off = focus && !p;
      k.classList.toggle('off', off);
      k.classList.toggle('bent', !!(p && p.bent));
      k.setAttribute('aria-disabled', off ? 'true' : 'false');
      const name = p ? p.name : plainName(pc);
      const oct = Math.floor(m / 12) - 1;
      k.dataset.name = name;
      k.setAttribute('aria-label', name + oct + (off ? ' (not in the key)' : ''));
      const label = k.firstChild;
      label.innerHTML = pc === 0 ? name + '<small>' + oct + '</small>' : name.replace(/([♯♭𝄪]+)/, '<i>$1</i>');
    }
    if (panel) {
      const f = panel.querySelector('.kbd-focus');
      f.setAttribute('aria-pressed', String(focus));
      f.classList.toggle('on', focus);
      panel.querySelectorAll('.kbd-oct-btn').forEach(b => {
        const on = +b.dataset.oct === octaves();
        b.classList.toggle('on', on);
        b.setAttribute('aria-checked', String(on));
      });
    }
    dock.classList.toggle('focus-on', focus);
  }

  /* ---------------- size ---------------- */
  function layout(noAnim) {
    if (!viewport) return;
    const dockW = dock.clientWidth;
    if (!dockW) return;
    H = heightPx();
    const W = whitesShown();
    const narrow = dockW < 600;
    dock.classList.toggle('kb-narrow', narrow);
    dock.classList.toggle('kb-short', H < 92);
    dock.classList.toggle('kb-tall', H >= 150);
    const cs = getComputedStyle(dock);
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const gap = parseFloat(cs.columnGap) || 12;
    // the panel's own buttons follow the height
    const rows = narrow ? 3 : 2;
    const pb = clamp(Math.floor((H + 2 * FRAME_PAD - (rows - 1) * 4 - (H >= 150 && !narrow ? 20 : 0)) / rows), 20, H >= 150 ? 40 : 34);
    dock.style.setProperty('--pb', pb + 'px');
    const away = panel.parentNode !== dock;
    const panelW = away ? 0 : panel.offsetWidth;
    const room = dockW - pad - (away ? 0 : panelW + gap) - 2 * FRAME_PAD;
    kw = Math.max(6, Math.min(keyCap(H), room / W));
    kw = Math.floor(kw * 100) / 100;
    const kbW = W * kw + 2 * FRAME_PAD;
    // centre the keyboard on the dock when it is narrow enough to clear
    // the panel on both sides; otherwise it sits just right of the panel
    const centred = away || dockW - pad - 2 * (panelW + gap) >= kbW;
    spacer.style.width = centred && !away ? panelW + 'px' : '0px';
    if (noAnim) dock.classList.add('no-anim');
    dock.style.setProperty('--kw', kw + 'px');
    dock.style.setProperty('--kh', H + 'px');
    dock.style.setProperty('--nw', W);
    dock.style.setProperty('--total', TOTAL);
    dock.classList.toggle('kw-xs', kw < 17);
    dock.classList.toggle('kw-sm', kw < 26);
    if (noAnim) { void dock.offsetWidth; dock.classList.remove('no-anim'); }
    document.documentElement.style.setProperty('--dock-h', dock.offsetHeight + 'px');
  }

  /* ---------------- which keys show ---------------- */
  /* The first white key for a span [a, b] of white keys, or null when it
     does not fit: start on the key's letter where that holds the span
     (the choice nearest the middle), else centre the span. */
  function fitStart(a, b, W) {
    const lo = Math.max(0, b - W + 1), hi = Math.min(a, TOTAL - W);
    if (lo > hi) return null;
    const middle = a - (W - (b - a + 1)) / 2;
    const tonic = M.KEY_SIGNATURES_CHROMATIC_INDEX[S.key] || 0;
    const tonicWhite = IS_BLACK[tonic] ? tonic - 1 : tonic;
    let best = null;
    for (let s = lo; s <= hi; s++) {
      if (whitePc(s) === tonicWhite && (best === null || Math.abs(s - middle) < Math.abs(best - middle))) best = s;
    }
    return best !== null ? best : clamp(Math.round(middle), lo, hi);
  }
  function spanOf(midis) {
    if (!midis.length) return null;
    return [whiteBelow(Math.min.apply(null, midis)), whiteAbove(Math.max.apply(null, midis))];
  }
  function lineMidis(note) {
    const line = note && note.closest('.notation-line');
    if (!line) return [];
    const out = [];
    line.querySelectorAll('.note').forEach(n => {
      if (n.classList.contains('rest-note')) return;
      const m = noteMidi(n);
      if (m !== null) out.push(m);
    });
    return out;
  }

  /* The Flex keys' window: the Virtual Keyboard's own, whenever the whole
     song fits in it. A song too wide for it: the same window a whole
     octave or more away, moved only when the selected note leaves it —
     the Flex rows' lights move with it, as a picture (keymap.js). */
  function chooseFlexStart() {
    const vw = vkWindow(), W = vw.W;
    const fits = s => s >= 0 && s + W <= TOTAL;
    const holds = (s, sp) => sp[0] >= s && sp[1] <= s + W - 1;
    const cands = [];                        // whole octaves from the Virtual Keyboard's, nearest first
    for (let k = 0; k <= 6; k++) [k, -k].forEach(j => { const s = vw.first + 7 * j; if (fits(s) && cands.indexOf(s) === -1) cands.push(s); });
    if (!cands.length) return clamp(vw.first, 0, Math.max(0, TOTAL - W));
    const doMidi = M.noteMidi('do', 'natural');
    const span = spanOf(songMidis) || spanOf([doMidi, doMidi + 12]);
    if (holds(cands[0], span)) return cands[0];
    const here = cands.indexOf(start) !== -1 ? start : cands[0];
    const m = lit.primary !== null ? lit.primary : lit.melody.length ? lit.melody[0] : null;
    if (m === null) return here;
    const sp = [whiteBelow(m), whiteAbove(m)];
    if (holds(here, sp)) return here;
    const hit = cands.find(s => holds(s, sp));
    return hit !== undefined ? hit : here;
  }

  function chooseStart(force) {
    if (flexOn()) return chooseFlexStart();
    const W = whitesShown();
    let span = spanOf(songMidis);
    if (!span) {
      const doMidi = M.noteMidi('do', 'natural');
      span = spanOf([doMidi, doMidi + 12]);
    }
    const whole = fitStart(span[0], span[1], W);
    if (whole !== null) return whole;
    // the song is wider than the keys: hold still while the selected
    // note is showing, else move to its line (or centre the note)
    const m = lit.primary !== null ? lit.primary : lit.melody.length ? lit.melody[0] : null;
    if (m === null) return start !== null && !force ? start : clamp(Math.round((span[0] + span[1] - W) / 2), 0, TOTAL - W);
    const a = whiteBelow(m), b = whiteAbove(m);
    if (!force && start !== null && a >= start && b <= start + W - 1) return start;
    const ls = spanOf(lineMidis(SW.score.getActiveNote()));
    const byLine = ls ? fitStart(Math.min(ls[0], a), Math.max(ls[1], b), W) : null;
    if (byLine !== null) return byLine;
    return clamp(a - Math.floor((W - 1) / 2), 0, TOTAL - W);
  }

  /* ---------------- lighting ---------------- */
  function noteMidi(noteEl) {
    const nc = M.noteClassOf(noteEl);
    return nc ? M.noteMidi(nc, SW.score.getAccidentalFromNote(noteEl)) : null;
  }
  function readSelection() {
    const note = SW.score && SW.score.getActiveNote();
    lit.melody = [];
    lit.colors = {};
    lit.primary = null;
    if (note && !note.classList.contains('rest-note')) {
      const stack = note.closest('.harmony-stack');
      (stack ? Array.from(stack.querySelectorAll('.note')) : [note]).forEach(n => {
        if (n.classList.contains('rest-note')) return;
        const m = noteMidi(n);
        if (m === null) return;
        lit.melody.push(m);
        lit.colors[m] = n.style.backgroundColor || '';
      });
      lit.primary = noteMidi(note);
    }
  }

  /* dark or light writing on a colour */
  function rgbOf(color) {
    const hex = /^#([0-9a-f]{6})$/i.exec(color || '');
    const rgb = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(color || '');
    if (hex) { const n = parseInt(hex[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
    if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];
    return null;
  }
  /* `share` of a colour, the rest `base` — worked out here, not with
     color-mix() (Song Writer keeps that out of what Save picture reads) */
  function mix(color, base, share) {
    const a = rgbOf(color), b = rgbOf(base);
    if (!a || !b) return base;
    return '#' + a.map((v, i) => Math.round(v * share + b[i] * (1 - share)).toString(16).padStart(2, '0')).join('');
  }
  function inkOn(color) {
    const c = rgbOf(color);
    if (!c) return '#fff';
    const r = c[0], g = c[1], b = c[2];
    const lum = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * lum(r) + 0.7152 * lum(g) + 0.0722 * lum(b);
    return (1.05 / (L + 0.05)) >= 3.6 ? '#fff' : '#1c1a22';
  }

  function keyColor(m) {
    const pc = m % 12;
    if (palette[pc]) return palette[pc].color;
    return IS_BLACK[pc] ? BLACK_PRESS[pc] : M.LETTER_COLORS[WHITE_LETTER[pc]];
  }

  /* The colour a key lights in: its note's (its block's, when given), or
     the one colour. */
  function lightColor(m, blockColor) {
    return colorMode() === 'single' ? oneColor() : (blockColor || keyColor(m));
  }

  /* THE MELODY BEFORE THE CHORD (user, 2026-10-02). A chord's keys are
     background — where the harmony is, while the melody moves about over
     it: a pale wash of the note's colour on the key's lower half and a
     full-colour lip along its front (a black key: its colour, muted).
     The melody's keys — the selected note (with its lamp) and any key
     being played — wear their full colour, so on a chord key the melody
     always shows; let go, and the key goes back to the chord's wash. */
  const CHORD_WASH = 0.42, CHORD_BLACK = 0.5;
  function paint() {
    const melody = new Set(lit.melody);
    const chord = new Set(chordLightsOn() ? lit.chord : []);   // View → Chords light the keys
    for (let m = LOW; m <= HIGH; m++) {
      const k = keyEls[m];
      const on = melody.has(m);
      const inChord = chord.has(m) && !on;
      k.classList.toggle('lit', on);
      k.classList.toggle('chord', inChord);
      if (on || inChord) {
        const c = lightColor(m, on && lit.colors[m]);
        k.style.setProperty('--lit-c', c);
        k.style.setProperty('--lit-ink', inkOn(c));
      }
      if (inChord) {
        const wash = IS_BLACK[m % 12] ? mix(lightColor(m), '#151318', CHORD_BLACK) : mix(lightColor(m), '#FEFDFF', CHORD_WASH);
        k.style.setProperty('--chord-c', wash);
        k.style.setProperty('--chord-ink', inkOn(wash));
      }
    }
  }

  function visible() { return document.body.classList.contains('show-dock') && viewport && dock.clientWidth > 0; }

  function place(force) {
    if (!visible()) return;
    const W = whitesShown();
    // the first placement (the dock just came out) is not a slide
    if (start === null) force = true;
    const s = chooseStart(force);
    const moved = s !== start;
    start = s;
    if (force) dock.classList.add('no-anim');
    dock.style.setProperty('--s', start);
    // a black key cut in half by either end of the window is hidden
    for (let m = LOW; m <= HIGH; m++) {
      if (!IS_BLACK[m % 12]) continue;
      const wi = whiteIndex(m);
      keyEls[m].classList.toggle('clipped', wi <= start || wi >= start + W);
    }
    if (force) { void dock.offsetWidth; dock.classList.remove('no-anim'); }
    return moved;
  }

  function align(force) {
    if (!viewport) return;
    readSelection();
    paint();
    place(force);
  }

  let timer = 0;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(() => align(false), 0);
  }

  /* ---------------- the panel ---------------- */
  function setPrefs(patch) {
    SW.settings.setKeyboard(patch);
  }
  function wirePanel() {
    // a click here never takes the focus (a word being typed keeps it)
    panel.addEventListener('mousedown', e => e.preventDefault());
    panel.querySelectorAll('.kbd-oct-btn').forEach(b => {
      b.addEventListener('click', () => { if (+b.dataset.oct !== octaves()) setPrefs({ kbOctaves: +b.dataset.oct }); });
    });
    panel.querySelector('.kbd-focus').addEventListener('click', () => setPrefs({ kbFocus: !focusOn() }));
    wireGrip();
  }

  /* The grip: drag the dock's top edge. Near a preset it snaps to it. */
  function wireGrip() {
    let drag = null;
    grip.addEventListener('pointerdown', e => {
      e.preventDefault();
      try { grip.setPointerCapture(e.pointerId); } catch (err) {}
      drag = { y: e.clientY, h: H };
      dragH = H;
      document.body.classList.add('kbd-resizing');
    });
    grip.addEventListener('pointermove', e => {
      if (!drag) return;
      let h = clamp(drag.h + (drag.y - e.clientY), MIN_H, maxHeight());
      Object.keys(HEIGHTS).forEach(id => { const p = presetPx(id); if (Math.abs(h - p) < 7) h = p; });
      dragH = Math.round(h);
      layout(true);
      place(false);
    });
    const end = () => {
      if (!drag) return;
      drag = null;
      document.body.classList.remove('kbd-resizing');
      const h = dragH;
      dragH = null;
      const preset = Object.keys(HEIGHTS).find(id => presetPx(id) === h);
      setPrefs({ dockHeight: preset || h });
    };
    grip.addEventListener('pointerup', end);
    grip.addEventListener('pointercancel', end);
    grip.addEventListener('dblclick', () => setPrefs({ dockHeight: 'md' }));
    grip.addEventListener('keydown', e => {
      if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
      e.preventDefault();
      e.stopPropagation();
      setPrefs({ dockHeight: clamp(H + (e.key === 'ArrowUp' ? 12 : -12), MIN_H, maxHeight()) });
    });
  }

  /* ---------------- playing the keys ----------------
     A key rings for as long as it is held, as on the Virtual Keyboard
     (SW.audio.noteOn / noteOff — the Melody sound in the Sound popover). */
  const held = new Map();                    // pointerId → { k: key element, v: voice } (or null between keys)
  const holders = new WeakMap();             // key element → how many fingers and computer keys hold it

  /* `sound`: the pitch to ring, when it is not the key's own (a computer
     key whose note is lit an octave away, keyDown) */
  function press(k, sound) {
    k.classList.add('pressed');
    holders.set(k, (holders.get(k) || 0) + 1);
    const m = +k.dataset.midi;
    const c = lightColor(m);
    k.style.setProperty('--press-c', c);
    k.style.setProperty('--press-ink', inkOn(c));
    return { k, v: SW.audio.noteOn(sound != null ? sound : m) };
  }
  function release(h) {
    if (!h) return;
    if (h.k) {
      const n = (holders.get(h.k) || 1) - 1;
      holders.set(h.k, n);
      if (n <= 0) h.k.classList.remove('pressed');
    }
    SW.audio.noteOff(h.v);
  }

  /* In Edit, a key sets the selected block to its pitch. */
  function write(m) {
    if (!S.editing || !SW.score.getActiveNote()) return;
    if (!SW.score.setActiveNoteMidi(m) && SW.settings.can('pitch')) {
      SW.ui.toast(plainName(m % 12) + ' cannot be written as a block here — it is out of range, or needs a ♯ or ♭ the rules do not allow');
    }
  }
  function releaseAll() {
    held.forEach(release);
    held.clear();
  }

  function focusHint() {
    if (focusHinted) return;
    focusHinted = true;
    SW.ui.toast('Focus is on — only the notes of the key, and any the song uses, play');
  }

  dock.addEventListener('pointerdown', e => {
    const k = e.target.closest('.kkey');
    if (!k) return;
    e.preventDefault();
    if (k.classList.contains('off')) { focusHint(); return; }
    release(held.get(e.pointerId));
    held.set(e.pointerId, press(k));
    write(+k.dataset.midi);
  });
  // a finger (or a held mouse) sliding across the keys plays each one
  window.addEventListener('pointermove', e => {
    if (!held.has(e.pointerId) || S.editing) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const k = el && el.closest ? el.closest('.kkey') : null;
    const prev = held.get(e.pointerId);
    if (prev && k === prev.k) return;
    if (!prev && !k) return;
    release(prev);
    held.set(e.pointerId, k && dock.contains(k) && !k.classList.contains('off') ? press(k) : null);
  });
  ['pointerup', 'pointercancel'].forEach(type => window.addEventListener(type, e => {
    if (!held.has(e.pointerId)) return;
    release(held.get(e.pointerId));
    held.delete(e.pointerId);
  }));
  // the window losing focus mid-note never sends the pointerup
  window.addEventListener('blur', releaseAll);

  /* ---------------- computer keys (js/keymap.js) ----------------
     A computer key plays a pitch as a tap on its key does: it rings until
     let go and, in Edit, sets the selected block. Its key lights while
     held: the Flex keys light the key keymap.js chose (the Virtual
     Keyboard's rule — nothing, when that key is not showing); the others
     light their own key when it is showing, else the same note in the
     nearest octave that is. With the keyboard put away a key only sounds. */
  function showing(x) {
    if (start === null || x < LOW || x > HIGH) return false;
    const W = whitesShown();
    const wi = whiteIndex(x);
    return IS_BLACK[x % 12] ? wi > start && wi < start + W : wi >= start && wi < start + W;
  }
  function shownKey(m) {
    if (!visible()) return null;
    for (let d = 0; d <= 5; d++) {
      if (showing(m - 12 * d)) return keyEls[m - 12 * d];
      if (d && showing(m + 12 * d)) return keyEls[m + 12 * d];
    }
    return null;
  }
  /* For the Flex lights: the Virtual Keyboard's window, and how far the
     keys showing sit from it (whole octaves, while the song is too wide) */
  function flexFrame() {
    const vw = vkWindow();
    return { n: vw.n, lo: vw.lo, top: vw.top, offset: start === null ? 0 : 12 * Math.round((start - vw.first) / 7) };
  }
  /* `light`: the key to light, when the keymap chose it (null: none) */
  function keyDown(m, light) {
    const k = light === undefined ? shownKey(m) : light !== null && visible() && showing(light) ? keyEls[light] : null;
    if (k && k.classList.contains('off')) { focusHint(); return null; }
    const h = k ? press(k, m) : { k: null, v: SW.audio.noteOn(m) };
    write(m);
    return h;
  }

  /* ---------------- events ---------------- */
  function refreshSong() {
    if (!viewport) return;
    readSong();
    dress();
    schedule();
  }
  SW.bus.on('selection', schedule);
  SW.bus.on('score:changed', refreshSong);
  SW.bus.on('score:loaded', () => { lit.chord = []; if (!viewport) return; readSong(); dress(); readSelection(); paint(); start = null; place(true); });
  /* the chord in hand came or went: re-dress the keys if it bends the scale differently */
  function rebend() {
    if (!viewport || !SW.chords.bend || JSON.stringify(SW.chords.bend()) === bendSig) return;
    readSong();
    dress();
  }
  SW.bus.on('layout:changed', rebend);       // Layout settings → Chords bend the keyboard
  SW.bus.on('chord:played', d => { lit.chord = (d.midis || []).slice(); rebend(); if (viewport) paint(); });
  // a tap on the manuscript, or the chord panel put away (chords.js clearSounding); arrows and pitch changes leave the chord alone
  SW.bus.on('chord:cleared', () => { lit.chord = []; rebend(); if (viewport) paint(); });
  SW.bus.on('key:changed', () => { lit.chord = []; render(); });
  SW.bus.on('keyboard:changed', d => {
    if (!viewport) return;
    dress();
    layout(true);
    readSelection();
    paint();
    place(!!(d && d.octaves));
  });
  SW.bus.on('view:changed', () => { if (!viewport) return; seatPanel(); layout(true); place(false); });
  SW.bus.on('policy:changed', () => { if (viewport) { seatPanel(); layout(true); } schedule(); });
  SW.bus.on('scale:changed', () => { lit.chord = []; refreshSong(); });
  if (window.ResizeObserver) {
    new ResizeObserver(() => { if (!viewport) return; layout(true); place(false); }).observe(dock);
  }
  window.addEventListener('resize', () => { if (!viewport) return; layout(true); place(false); });

  render();
  SW.dock = { render, align: schedule, keyDown, keyUp: release, flexFrame };
})();

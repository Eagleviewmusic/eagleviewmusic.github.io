// Solfege Tower — the Melody Tower: one note per button, solfege or letter names,
// an 8va button, and Melody Tower's two-hand key layout.
window.ST = window.ST || {};
ST.MelodyTower = class MelodyTower extends ST.Tower {
  constructor(app) {
    super('melody', app, { rows: [1, 9] });   // rows 10-11 of the map were always empty
    this.synth = new ST.audio.MelodySynth();
    this.synth.onSteal = (oscKey) => {          // a 17th voice took this one: let its key go
      const id = oscKey.slice(0, oscKey.lastIndexOf('_'));
      this.held.delete(id); this.keyHeld.delete(id); this.pointerHeld.delete(id);
      this.light(id, false);
    };
    this.nameMode = 'solfege';   // 'solfege' (Do Re Mi) | 'letters' (C D E)
    this.octaveActive = false;
    this.manualOctave = false;
    this.letterNames = {};
    this.colors = {};
    this.noteFrequencies = {};
    this.harmony = {};   // degree index (0 = Do) → +1 / −1 asked by a held chord (Both mode)

    // Left-hand keys never shift up an octave; the right hand (and a finger) does when 8va is on.
    this.leftHandKeys = new Set(['z', 'x', 'c', 'v', 'a', 's', 'd', 'f', 'q', 'w', 'e', 'r', '1', '2', '3', '4']);

    this.buttons = [
      { name: 'Fa', keys: ['f', ';', 'y'], note: 'F4', cells: ['3a', '4a'] },
      { name: 'So', keys: ['z', 'm'], note: 'G3', cells: ['9b', '9c'] },
      { name: 'Mi', keys: ['d', 'l'], note: 'E4', cells: ['5a'] },
      { name: 'Re', keys: ['s', 'k'], note: 'D4', cells: ['6a'] },
      { name: 'Do', keys: ['a', 'j', '/', 'v'], note: 'C4', cells: ['5b', '6b', '7b', '5c', '6c', '7c'] },
      { name: 'La', keys: ['x', ','], note: 'A3', cells: ['8b'] },
      { name: 'Ti', keys: ['c', '.', 'h'], note: 'B3', cells: ['8c'] },
      { name: 'So', keys: ['q', 'u'], note: 'G4', cells: ['3b', '4b', '3c', '4c'] },
      { name: 'La', keys: ['w', 'i'], note: 'A4', cells: ['4d'] },
      { name: 'Ti', keys: ['e', 'o', '6'], note: 'B4', cells: ['3d'] },
      { name: 'Do', keys: ['1', '7', 'p', 'r'], note: 'C5', cells: ['2c', '2d'] },
      { name: 'Re', keys: ['2', '8'], note: 'D5', cells: ['1c'] },
      { name: 'Mi', keys: ['3', '9'], note: 'E5', cells: ['1d'] },
      { name: 'Fa', keys: ['0', '4'], note: 'F5', cells: [] },
      { name: 'Fa', keys: ['n'], note: 'F3', cells: [] }
    ];
    this.keyToId = {};        // any key → the button's first key (its id)
    this.buttonSolfege = {};  // button id → its major-scale syllable
    this.buttons.forEach(btn => {
      btn.keys.forEach(k => { this.keyToId[k] = btn.keys[0]; });
      this.buttonSolfege[btn.keys[0]] = btn.name;
      if (btn.cells.length) this.addButton(btn.keys[0], btn.cells, btn.name);
    });
    this.buildUtilityCells();
    this.renderOctaveButton();
  }

  get title() { return 'Melody Tower'; }
  get scale() { return this.app.state.scale; }
  get keyName() { return ST.melody.getEffectiveKeyName(this.app.state.keyIndex, this.app.state.scale); }
  buttonIdFor(key) { return this.keyToId[key] || key; }
  buttonFor(key) { return this.buttons.find(b => b.keys.includes(key)); }
  degreeOf(btn) { return 'CDEFGAB'.indexOf(btn.note.charAt(0)); }
  altFor(btn) { return this.harmony[this.degreeOf(btn)] || 0; }

  // ---- a chord's chromatic note, shown and heard on the melody ----
  static alterSyllable(s, alt) {
    if (!s || !alt) return s;
    const map = alt > 0 ? ST.MelodyTower.RAISE : ST.MelodyTower.LOWER;
    return map[s] || s;
  }
  static alterLetter(name, alt) {   // 'F' → 'F♯', 'B♭' → 'B', 'F♯' → 'F' …
    if (!name || !alt) return name;
    const letter = name.charAt(0);
    let acc = 0;
    for (const ch of name.slice(1)) { if (ch === '♯') acc += 1; else if (ch === '♭') acc -= 1; else if (ch === '𝄪') acc += 2; else if (ch === '𝄫') acc -= 2; }
    acc += alt;
    const sign = acc > 0 ? (acc === 1 ? '♯' : '𝄪') : acc < 0 ? (acc === -1 ? '♭' : '𝄫') : '';
    return letter + sign;
  }
  setHarmony(alts) {
    const changed = new Set();
    for (let d = 0; d < 7; d++) if ((this.harmony[d] || 0) !== (alts[d] || 0)) changed.add(d);
    if (!changed.size) return;
    this.harmony = Object.assign({}, alts);
    this.updateNames();
    for (const id of [...this.held]) {               // a held note moves with the chord
      const btn = this.buttonFor(id);
      if (!btn || !changed.has(this.degreeOf(btn))) continue;
      ['_0', '_1', '_-1'].forEach(s => this.synth.stop(id + s));
      this.play(id, { pointer: this.pointerHeld.has(id) });
    }
  }

  // ---- theory ----
  updateMappings() {
    this.letterNames = ST.melody.generateLetterNamesForScale(this.keyName, this.scale);
    this.colors = ST.melody.generateColorsForScale(this.keyName, this.scale);
    this.updateNoteFrequencies();
  }
  updateNoteFrequencies() {
    const keyIndex = this.app.state.keyIndex;
    let root = 261.63 * Math.pow(2, keyIndex / 12);      // C4 as the base
    if ([8, 9, 10, 11].includes(keyIndex)) root /= 2;     // Ab A Bb B sit an octave lower
    const scale = ST.melody.scaleDefinitions[this.scale];
    const f = {};
    scale.intervals.forEach((interval, i) => { f[scale.solfege[i]] = root * Math.pow(2, interval / 12); });
    const re = f['Re'] || f['Ra'], mi = f['Mi'] || f['Me'], fa = f['Fa'] || f['Fi'],
          so = f['So'] || f['Se'], la = f['La'] || f['Le'], ti = f['Ti'] || f['Te'];
    this.noteFrequencies = {
      'C4': f['Do'], 'D4': re, 'E4': mi, 'F4': fa, 'G4': so, 'A4': la, 'B4': ti,
      'G3': so / 2, 'A3': la / 2, 'B3': ti / 2, 'F3': fa / 2,
      'C5': f['Do'] * 2, 'D5': re * 2, 'E5': mi * 2, 'F5': fa * 2
    };
  }
  solfegeFor(key) {
    const base = this.buttonSolfege[this.keyToId[key]];
    if (!base) return null;
    const scale = ST.melody.scaleDefinitions[this.scale];
    const i = ['Do', 'Re', 'Mi', 'Fa', 'So', 'La', 'Ti'].indexOf(base);
    return (scale && i > -1 && scale.solfege[i]) || base;
  }
  textColorFor(solfege, alt) {
    const note = ST.MelodyTower.alterLetter(this.letterNames[solfege], alt || 0);
    const acc = note && ST.melody.noteAccidentalMap[note];
    if (acc === 'flat' || acc === 'double-flat') return ST.melody.DARK_BLUE;
    if (acc === 'sharp' || acc === 'double-sharp') return ST.melody.DARK_RED;
    return 'white';
  }
  updateNames() {
    this.buttons.forEach(btn => {
      const div = this.buttonRefs[btn.keys[0]];
      if (!div) return;
      const solfege = this.solfegeFor(btn.keys[0]);
      const alt = this.altFor(btn);
      const shown = ST.MelodyTower.alterSyllable(solfege, alt);
      const note = ST.MelodyTower.alterLetter(this.letterNames[solfege], alt);
      div.textContent = this.nameMode === 'solfege' ? (shown || btn.name) : (note || shown);
      div.style.color = this.textColorFor(solfege, alt);
      div.classList.toggle('altered', !!alt);
    });
    this.refitLabels();
  }
  updateColors() {
    this.buttons.forEach(btn => {
      const div = this.buttonRefs[btn.keys[0]];
      if (!div) return;
      const solfege = this.solfegeFor(btn.keys[0]);
      div.style.backgroundColor = this.colors[solfege] || '#ccc';
      div.style.color = this.textColorFor(solfege, this.altFor(btn));
    });
  }
  toggleNames() { this.nameMode = this.nameMode === 'solfege' ? 'letters' : 'solfege'; }
  toggleSpec() {
    if (this.nameMode === 'solfege') {
      return { pressed: false, label: 'Switch to letter names (C D E)',
        html: '<div class="stepped-labels stepped-letters"><span class="step step-1">C</span><span class="step step-2">D</span><span class="step step-3">E</span></div>' };
    }
    return { pressed: true, label: 'Switch to solfege names (Do Re Mi)',
      html: '<div class="stepped-labels stepped-solfege"><span class="step step-1">Do</span><span class="step step-2">Re</span><span class="step step-3">Mi</span></div>' };
  }

  // ---- 8va ----
  renderOctaveButton() {
    const btn = document.createElement('div');
    btn.className = 'octave-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Play an octave higher');
    btn.innerHTML = '8<sup class="octave-sup">va</sup>';
    btn.addEventListener('click', (e) => {
      if (e.shiftKey) return;
      this.manualOctave = !this.manualOctave;
      this.setOctave(this.manualOctave);
    });
    this.cellRefs['5d'].innerHTML = '';
    this.cellRefs['5d'].appendChild(btn);
    this.octaveBtn = btn;
  }
  setOctave(on) {
    this.octaveActive = on;
    this.octaveBtn.classList.toggle('active', on);
  }
  updateOctaveState(e) {     // Shift or Caps Lock hold the octave up; a click on 8va is the manual way
    const keyboardActive = (e.getModifierState && e.getModifierState('CapsLock')) || e.shiftKey;
    let next;
    if (keyboardActive) { next = true; this.manualOctave = false; }
    else next = this.manualOctave;
    if (this.octaveActive !== next) this.setOctave(next);
  }

  // ---- sound ----
  play(id, opts) {
    const pointer = !!(opts && opts.pointer);
    const btn = this.buttonFor(id);
    if (!btn) return;
    const base = this.noteFrequencies[btn.note];
    if (!base) return;
    this.held.add(id);
    const acc = this.getAccidentalShift(0);
    let freq = base * Math.pow(2, (acc + this.altFor(btn)) / 12);
    if (this.octaveActive && (pointer || !this.leftHandKeys.has(id))) freq *= 2;
    this.synth.start(`${id}_${acc}`, freq);
  }
  stop(id) {
    this.held.delete(id);
    ['_0', '_1', '_-1'].forEach(s => this.synth.stop(id + s));
    if (this.held.size === 0) {        // the on-screen ♯/♭ let go with the note
      if (this.sharpLatch) this.setSharpLatch(false);
      if (this.flatLatch) this.setFlatLatch(false);
    }
  }
  retrigger() {
    for (const id of this.held) {
      ['_0', '_1', '_-1'].forEach(s => this.synth.stop(id + s));
      this.play(id, { pointer: this.pointerHeld.has(id) });
    }
  }

  // ---- computer keyboard ----
  keyDown(key) {
    if (!this.keyToId[key]) return false;
    if (this.keyHeld.has(key)) return true;
    this.keyHeld.add(key);
    this.play(key, { pointer: false });
    this.light(key, true);
    return true;
  }
  keyUp(key) {
    if (!this.keyHeld.has(key)) return false;
    this.keyHeld.delete(key);
    this.stop(key);
    const bid = this.keyToId[key];
    const stillHeld = [...this.keyHeld].some(k => this.keyToId[k] === bid) || this.pointerHeld.has(bid);
    if (!stillHeld) this.light(key, false);
    return true;
  }
  keyColor(key) {
    const solfege = this.solfegeFor(key);
    if (!solfege) return null;
    const note = this.letterNames[solfege];
    if (!note) return null;
    return { bg: ST.melody.KEY_COLORS[note.charAt(0)] || '#ccc', fg: this.textColorFor(solfege) };
  }
};
ST.MelodyTower.RAISE = { Do: 'Di', Ra: 'Re', Re: 'Ri', Me: 'Mi', Fa: 'Fi', Se: 'So', So: 'Si', Le: 'La', La: 'Li', Te: 'Ti' };
ST.MelodyTower.LOWER = { Di: 'Do', Re: 'Ra', Ri: 'Re', Mi: 'Me', Fi: 'Fa', So: 'Se', Si: 'So', La: 'Le', Li: 'La', Ti: 'Te' };

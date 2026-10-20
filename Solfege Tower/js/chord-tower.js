// Solfege Tower — the Chord Tower: nine chords of the key, Roman numerals or letter
// names, and Chord Tower's two-hand key layout.
window.ST = window.ST || {};
ST.ChordTower = class ChordTower extends ST.Tower {
  constructor(app) {
    super('chord', app, { rows: [2, 8], topLeftOccupied: true });   // rows 1 and 9-11 were always empty
    this.synth = new ST.audio.ChordSynth();
    this.nameMode = 'roman';   // 'roman' (I IV V) | 'letters' (C F G)
    this.heldMods = {};        // chord id → +1 / 0 / −1 from Shift / Option held at the press
    this.keyMap = {            // physical key → chord id (the right hand's own key)
      'j': 'j', 'f': 'j', '1': 'j',
      'k': 'k', 'd': 'k', '2': 'k',
      'l': 'l', 's': 'l', '3': 'l',
      'u': 'u', 'w': 'u', '4': 'u',
      'i': 'i', 'e': 'i', '5': 'i',
      'o': 'o', 'r': 'o', '6': 'o',
      'y': '8', 'q': '8', '7': '8',
      'p': '9', 't': '9', '8': '9',
      'h': 'n', 'g': 'n', '9': 'n'
    };
    ST.chords.sets.major.forEach(btn => this.addButton(btn.key, btn.cells, ST.chords.functionNames.major[btn.key]));
    this.buildUtilityCells();
  }

  get title() { return 'Chord Tower'; }
  get scale() { return this.app.state.scale; }
  get keyName() { return ST.melody.keyNames[this.app.state.keyIndex]; }   // the tables use the flat spellings
  chordFor(id) { return ST.chords.sets[this.scale].find(b => b.key === id); }
  chordNames() { return ST.chords.letterNames[this.scale][this.keyName] || []; }
  rootOf(name) { return name ? name.charAt(0).toUpperCase() : null; }

  // ---- names and colours ----
  updateNames() {
    const names = this.chordNames();
    const funcs = ST.chords.functionNames[this.scale];
    ST.chords.buttonOrder.forEach((id, i) => {
      const div = this.buttonRefs[id];
      if (!div) return;
      const chordName = names[i] || '';
      let color = 'white';
      const m = chordName.match(/^[A-G](b|#|𝄪)*/);
      if (m) {
        if (m[0].includes('b')) color = ST.melody.DARK_BLUE;
        else if (m[0].includes('#') || m[0].includes('𝄪')) color = ST.melody.DARK_RED;
      }
      if (this.nameMode === 'letters') div.innerHTML = chordName.replace(/(#|b|𝄪)/g, '<span class="accidental">$1</span>');
      else div.textContent = funcs[id];
      div.style.color = color;
    });
    this.refitLabels();
  }
  updateColors() {
    const names = this.chordNames();
    ST.chords.buttonOrder.forEach((id, i) => {
      const div = this.buttonRefs[id];
      if (!div) return;
      const root = this.rootOf(names[i]);
      div.style.backgroundColor = (root && ST.melody.KEY_COLORS[root]) || '#ccc';
    });
  }
  toggleNames() { this.nameMode = this.nameMode === 'roman' ? 'letters' : 'roman'; }
  toggleSpec() {
    if (this.nameMode === 'roman') {
      return { pressed: false, label: 'Switch to chord letter names (C F G)',
        html: '<div class="stepped-labels stepped-letters"><span class="step step-1">C</span><span class="step step-2">F</span><span class="step step-3">G</span></div>' };
    }
    return { pressed: true, label: 'Switch to Roman numerals (I IV V)',
      html: '<div class="stepped-labels stepped-romans"><span class="step step-1">I</span><span class="step step-2">IV</span><span class="step step-3">V</span></div>' };
  }

  // ---- sound ----
  play(id, opts) {
    const mod = (opts && opts.mod) || 0;
    const btn = this.chordFor(id);
    if (!btn) return;
    this.heldMods[id] = mod;
    this.held.add(id);
    let keyShift = ST.chords.semitoneShiftMap[this.keyName];
    if (this.app.state.keyIndex >= 8) keyShift -= 12;      // Ab A Bb B sit an octave lower
    const acc = this.getAccidentalShift(mod);
    const total = keyShift + acc;
    const freqs = btn.notes['C'].map(n => {
      const f = ST.chords.baseFrequencies[n];
      return f ? f * Math.pow(2, total / 12) : 0;
    });
    this.synth.start(`${id}_${acc}`, freqs);
  }
  stop(id) {
    this.held.delete(id);
    delete this.heldMods[id];
    ['_0', '_1', '_-1'].forEach(s => this.synth.stop(id + s));
  }
  retrigger() {
    for (const id of this.held) {
      ['_0', '_1', '_-1'].forEach(s => this.synth.stop(id + s, true));
      this.play(id, { mod: this.heldMods[id] || 0 });
    }
  }

  // ---- computer keyboard ----
  keyDown(key, mods) {
    const id = this.keyMap[key];
    if (!id) return false;
    if (this.keyHeld.has(key)) return true;
    this.keyHeld.add(key);
    const mod = mods && mods.shift ? 1 : (mods && mods.alt ? -1 : 0);
    this.play(id, { mod });
    this.light(id, true);
    return true;
  }
  keyUp(key) {
    if (!this.keyHeld.has(key)) return false;
    this.keyHeld.delete(key);
    const id = this.keyMap[key];
    const stillHeld = [...this.keyHeld].some(k => this.keyMap[k] === id) || this.pointerHeld.has(id);
    if (stillHeld) return true;
    this.stop(id);
    this.light(id, false);
    return true;
  }
  keyColor(key) {
    const id = this.keyMap[key];
    if (!id) return null;
    const root = this.rootOf(this.chordNames()[ST.chords.buttonOrder.indexOf(id)]);
    const bg = root && ST.melody.KEY_COLORS[root];
    return bg ? { bg, fg: 'white' } : null;
  }
};

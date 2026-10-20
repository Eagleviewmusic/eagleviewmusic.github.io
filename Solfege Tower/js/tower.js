// Solfege Tower — the base Tower: the 4×11 proportional grid, note buttons, the naming
// toggle (cell 6d), the sharp and flat cells (7d, 8d), pointer input, label fitting.
// MelodyTower and ChordTower fill in the sound and the names.
window.ST = window.ST || {};
ST.Tower = class Tower {
  constructor(kind, app, opts) {
    this.kind = kind;
    this.app = app;
    // The towers share one 4×11 cell map, but each shows only the rows it uses:
    // rows [from, to] of that map (1-based). Cells are named by the map ('5b'), as ever.
    const rows = (opts && opts.rows) || [1, 11];
    this.rowOffset = rows[0] - 1;
    this.rowCount = rows[1] - rows[0] + 1;
    this.topLeftOccupied = !!(opts && opts.topLeftOccupied);   // a button sits in the first row's first column
    this.el = document.createElement('div');
    this.el.className = 'tower tower-' + kind;
    this.el.dataset.kind = kind;
    this.grid = document.createElement('div');
    this.grid.className = 'grid';
    this.el.appendChild(this.grid);

    this.cellRefs = {};
    this.buttonRefs = {};          // button id → div
    this.activeTouches = new Map(); // touch identifier → { id, div }
    this.held = new Set();          // ids sounding right now (keyboard or pointer)
    this.pointerHeld = new Set();   // ids held by a finger or the mouse
    this.keyHeld = new Set();       // physical keys held
    this.accidentalHeld = { sharp: false, flat: false };   // keyboard = and −
    this.sharpLatch = false;        // the on-screen ♯ and ♭ cells
    this.flatLatch = false;
    this.baseFontSize = 0;
    this.measureCtx = document.createElement('canvas').getContext('2d');

    this.buildCells();
  }

  // ---- grid ----
  buildCells() {
    const n = this.rowCount;
    for (let r = 0; r < 11; r++) {
      for (let c = 0; c < 4; c++) {
        const div = document.createElement('div');
        div.className = 'cell';
        div.style.top = ((r - this.rowOffset) * (100 / n)) + '%';
        div.style.left = (c * (100 / 4)) + '%';
        div.style.width = (100 / 4 - 0.5) + '%';
        div.style.height = (100 / n - 0.5) + '%';
        this.cellRefs[(r + 1) + String.fromCharCode(97 + c)] = div;
        if (r >= this.rowOffset && r < this.rowOffset + n) this.grid.appendChild(div);
      }
    }
  }

  static cellPos(name) {   // '5b' → [row, col]
    return [parseInt(name, 10) - 1, name.charCodeAt(name.length - 1) - 97];
  }

  addButton(id, cells, label) {
    const div = document.createElement('div');
    div.className = 'note-button';
    div.textContent = label || '';
    div.dataset.id = id;
    const rows = [...new Set(cells.map(c => ST.Tower.cellPos(c)[0]))];
    const cols = [...new Set(cells.map(c => ST.Tower.cellPos(c)[1]))];
    const n = this.rowCount;
    div.style.top = ((Math.min(...rows) - this.rowOffset) * (100 / n)) + '%';
    div.style.left = (Math.min(...cols) * (100 / 4)) + '%';
    div.style.height = (rows.length * (100 / n) - 0.5) + '%';
    div.style.width = (cols.length * (100 / 4) - 0.5) + '%';

    div.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      this.pointerDown(id);
    });
    div.addEventListener('mouseup', () => this.pointerUp(id));
    div.addEventListener('mouseleave', () => { if (this.pointerHeld.has(id)) this.pointerUp(id); });
    div.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        this.activeTouches.set(e.changedTouches[i].identifier, id);
      }
      this.pointerDown(id);
    }, { passive: false });

    this.grid.appendChild(div);
    this.buttonRefs[id] = div;
    return div;
  }

  // ---- the utility column: naming toggle, ♯, ♭ ----
  buildUtilityCells() {
    this.cellRefs['6d'].classList.add('toggle-cell-border');
    this.renderToggleButton();
    this.cellRefs['7d'].innerHTML = '<img class="solfege-img" src="https://raw.githubusercontent.com/VisualMusicalMinds/Musical-Images/refs/heads/main/MusicAppSharpSign3.png" alt="Sharp">';
    this.cellRefs['8d'].innerHTML = '<img class="solfege-img" src="https://raw.githubusercontent.com/VisualMusicalMinds/Musical-Images/refs/heads/main/MusicAppFlatSign3.png" alt="Flat">';

    const latchHandler = (which) => {
      let lastTouch = 0;
      return (e) => {
        e.preventDefault();
        const now = Date.now();
        if (e.type === 'click' && now - lastTouch < 500) return;   // the click that follows a touch
        if (e.type === 'touchstart') lastTouch = now;
        ST.audio.resume();
        if (which === 'sharp') this.setSharpLatch(!this.sharpLatch);
        else this.setFlatLatch(!this.flatLatch);
      };
    };
    const sharp = latchHandler('sharp'), flat = latchHandler('flat');
    this.cellRefs['7d'].addEventListener('click', sharp);
    this.cellRefs['7d'].addEventListener('touchstart', sharp, { passive: false });
    this.cellRefs['8d'].addEventListener('click', flat);
    this.cellRefs['8d'].addEventListener('touchstart', flat, { passive: false });
  }

  renderToggleButton() {
    const spec = this.toggleSpec();   // { html, label, pressed }
    const el = document.createElement('button');
    el.className = 'chord-toggle-btn';
    el.type = 'button';
    el.setAttribute('aria-pressed', String(spec.pressed));
    el.setAttribute('aria-label', spec.label);
    el.innerHTML = spec.html;
    const flip = () => { this.toggleNames(); this.renderToggleButton(); this.updateNames(); };
    el.addEventListener('click', flip);
    el.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); }
    });
    if (this.baseFontSize) el.style.fontSize = this.baseFontSize + 'px';
    this.cellRefs['6d'].innerHTML = '';
    this.cellRefs['6d'].appendChild(el);
  }

  // ---- accidentals ----
  // extra: +1 / −1 from a modifier held with this press (chords: Shift / Option)
  getAccidentalShift(extra) {
    const sharp = this.accidentalHeld.sharp || this.sharpLatch || extra > 0;
    const flat = this.accidentalHeld.flat || this.flatLatch || extra < 0;
    if (sharp && flat) return 0;
    if (sharp) return 1;
    if (flat) return -1;
    return 0;
  }
  paintAccidentals() {
    this.cellRefs['7d'].classList.toggle('active', this.accidentalHeld.sharp || this.sharpLatch);
    this.cellRefs['8d'].classList.toggle('active', this.accidentalHeld.flat || this.flatLatch);
  }
  setSharpLatch(v) {
    this.sharpLatch = v;
    if (v) this.flatLatch = false;
    this.paintAccidentals();
    this.retrigger();
  }
  setFlatLatch(v) {
    this.flatLatch = v;
    if (v) this.sharpLatch = false;
    this.paintAccidentals();
    this.retrigger();
  }
  setKeyboardAccidental(which, on) {
    if (this.accidentalHeld[which] === on) return;
    this.accidentalHeld[which] = on;
    this.paintAccidentals();
    this.retrigger();
  }

  // ---- pointer ----
  pointerDown(id) {
    ST.audio.resume();
    this.pointerHeld.add(id);
    this.play(id, { pointer: true });
    this.light(id, true);
  }
  pointerUp(id) {
    if (!this.pointerHeld.has(id)) return;
    this.pointerHeld.delete(id);
    this.stop(id);
    this.light(id, false);
  }
  touchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      const id = this.activeTouches.get(t.identifier);
      if (id === undefined) continue;
      this.activeTouches.delete(t.identifier);
      // keep the note while another finger is still on the same button
      if ([...this.activeTouches.values()].includes(id)) continue;
      this.pointerUp(id);
    }
  }
  mouseUpAnywhere() {
    for (const id of [...this.pointerHeld]) {
      if ([...this.activeTouches.values()].includes(id)) continue;
      this.pointerUp(id);
    }
  }
  light(id, on) {
    const div = this.buttonRefs[this.buttonIdFor(id)];
    if (div) div.classList.toggle('active', on);
  }
  buttonIdFor(id) { return id; }   // melody maps physical keys to one button

  releaseAll() {
    for (const id of [...this.held]) this.stop(id);
    this.held.clear();
    this.pointerHeld.clear();
    this.keyHeld.clear();
    this.activeTouches.clear();
    this.accidentalHeld.sharp = false;
    this.accidentalHeld.flat = false;
    this.sharpLatch = false;
    this.flatLatch = false;
    this.paintAccidentals();
    this.grid.querySelectorAll('.note-button.active').forEach(d => d.classList.remove('active'));
    if (this.synth) this.synth.stopAll();
  }

  // ---- size ----
  resize(w, h) {
    this.grid.style.width = w + 'px';
    this.grid.style.height = h + 'px';
    this.el.style.width = w + 'px';
    this.el.style.height = h + 'px';
    const fontSize = Math.min(h / this.rowCount, w / 4) * 0.5;
    this.baseFontSize = fontSize;
    this.grid.querySelectorAll('.cell').forEach(d => { d.style.fontSize = fontSize + 'px'; });
    const toggle = this.cellRefs['6d'].querySelector('.chord-toggle-btn');
    if (toggle) toggle.style.fontSize = fontSize + 'px';
    const octave = this.cellRefs['5d'].querySelector('.octave-btn');
    if (octave) octave.style.fontSize = fontSize + 'px';
    this.refitLabels();
  }
  fitLabel(div) {
    const basePx = this.baseFontSize;
    if (!div || !basePx) return;
    const style = window.getComputedStyle(div);
    this.measureCtx.font = `${style.fontStyle} ${style.fontWeight} ${basePx}px ${style.fontFamily}`;
    const textWidth = this.measureCtx.measureText(div.textContent).width;
    const maxWidth = div.clientWidth * 0.86;
    const size = (textWidth > maxWidth && textWidth > 0) ? basePx * (maxWidth / textWidth) : basePx;
    div.style.fontSize = size + 'px';
  }
  refitLabels() {
    if (!this.baseFontSize) return;
    Object.values(this.buttonRefs).forEach(div => this.fitLabel(div));
  }

  // ---- subclasses provide ----
  play(id, opts) {}
  stop(id) {}
  retrigger() {}
  updateNames() {}
  updateColors() {}
  toggleNames() {}
  toggleSpec() { return { html: '', label: '', pressed: false }; }
  keyDown(key, mods) { return false; }
  keyUp(key) {}
  keyColor(key) { return null; }
  get title() { return ''; }
};

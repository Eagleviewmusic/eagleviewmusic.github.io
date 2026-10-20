// Solfege Tower — the shell: which towers show and on which side, the shared Key /
// Scale / Timbre, the menu, the computer-keyboard router, the keyboard picture, links.
(function () {
  const ST = window.ST;
  const M = ST.melody;
  const $ = (sel) => document.querySelector(sel);

  // ---------- keys ----------
  // The keyboard's two halves. With both towers up, each half plays the tower on its side.
  const LEFT_HALF = new Set(['1', '2', '3', '4', '5', 'q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b']);
  const RIGHT_HALF = new Set(['6', '7', '8', '9', '0', 'y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', ';', 'n', 'm', ',', '.', '/']);
  const CODE_TO_KEY = { Semicolon: ';', Comma: ',', Period: '.', Slash: '/', Minus: '-', Equal: '=' };
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(ch => { CODE_TO_KEY['Key' + ch.toUpperCase()] = ch; });
  '0123456789'.split('').forEach(d => { CODE_TO_KEY['Digit' + d] = d; });
  const SHIFT_MAP = { '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
                      ':': ';', '<': ',', '>': '.', '?': '/', '_': '-', '+': '=' };
  function physicalKey(e) {     // the key by its place on the keyboard, whatever Shift / Option / Caps Lock make of it
    if (e.code && CODE_TO_KEY[e.code]) return CODE_TO_KEY[e.code];
    const k = e.key || '';
    if (SHIFT_MAP[k]) return SHIFT_MAP[k];
    return k.length === 1 ? k.toLowerCase() : k;
  }
  const KEY_ROWS = [
    [null, null, null, null, null, null, null, null, '-', '='],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  // ---------- state ----------
  const MODES = ['melody', 'chord', 'both'];
  const KINDS = ['melody', 'chord'];
  const state = { mode: 'melody', left: 'melody', keyIndex: 0, scale: 'major', timbre: { melody: 'triangle', chord: 'triangle' } };
  const app = { state, towers: {} };
  ST.app = app;   // for the console
  const towers = app.towers;
  const stage = $('#stage');
  towers.melody = new ST.MelodyTower(app);
  towers.chord = new ST.ChordTower(app);
  stage.appendChild(towers.melody.el);
  stage.appendChild(towers.chord.el);

  const other = k => (k === 'melody' ? 'chord' : 'melody');
  const visibleKinds = () => (state.mode === 'both' ? [state.left, other(state.left)] : [state.mode]);
  const visibleTowers = () => visibleKinds().map(k => towers[k]);
  const keyName = () => M.getEffectiveKeyName(state.keyIndex, state.scale);
  const inIframe = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();

  // ---------- links ----------
  function readURL() {
    try {
      const p = new URLSearchParams(window.location.search);
      const tower = (p.get('tower') || p.get('mode') || '').trim().toLowerCase();
      if (MODES.includes(tower)) state.mode = tower;
      const left = (p.get('left') || '').trim().toLowerCase();
      if (KINDS.includes(left)) state.left = left;
      const keyMap = {
        'c': 0, 'c#': 1, 'db': 1, 'c♯': 1, 'd♭': 1, 'd': 2, 'd#': 3, 'eb': 3, 'd♯': 3, 'e♭': 3,
        'e': 4, 'f': 5, 'f#': 6, 'gb': 6, 'f♯': 6, 'g♭': 6, 'g': 7, 'g#': 8, 'ab': 8, 'g♯': 8, 'a♭': 8,
        'a': 9, 'a#': 10, 'bb': 10, 'a♯': 10, 'b♭': 10, 'b': 11
      };
      const key = (p.get('key') || '').trim().toLowerCase();
      if (keyMap[key] !== undefined) state.keyIndex = keyMap[key];
      const scale = (p.get('scale') || '').trim().toLowerCase().replace(/\s+/g, '-');
      if (M.scaleDefinitions[scale]) state.scale = scale;
      const timbre = (p.get('timbre') || p.get('waveform') || '').trim().toLowerCase();   // the melody's (and the old links')
      if (ST.audio.waveforms.includes(timbre)) state.timbre.melody = timbre;
      const chordTimbre = (p.get('chordTimbre') || '').trim().toLowerCase();
      if (ST.audio.waveforms.includes(chordTimbre)) state.timbre.chord = chordTimbre;
    } catch (err) {
      console.warn('Could not read the link:', err);
    }
  }
  function shareURL() {
    const base = window.location.href.split('?')[0].split('#')[0];
    const q = new URLSearchParams();
    q.set('tower', state.mode);
    if (state.mode === 'both') q.set('left', state.left);
    q.set('key', keyName());
    q.set('scale', state.scale);
    q.set('timbre', state.timbre.melody);
    q.set('chordTimbre', state.timbre.chord);
    return base + '?' + q.toString();
  }

  // ---------- layout: the towers always fit the frame, as big as it allows ----------
  function layout() {
    const W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    const vis = visibleTowers();
    const n = vis.length;
    const rowsMax = Math.max(...vis.map(t => t.rowCount));
    const mx = Math.max(Math.min(W * 0.03, 16), 4);
    const my = Math.max(Math.min(H * 0.03, 20), 4);
    const MENU_CLEAR = 52;   // the menu button's corner: 8px + 38px + a little air

    const fit = (top) => {   // one cell size for every tower shown; the tallest one sets it
      const availW = Math.max(W - mx * 2, 20);
      const availH = Math.max(H - top - my * 2, 20);
      const gapFor = w => (n > 1 ? Math.max(6, Math.min(w * 0.1, 28)) : 0);
      let cell = availH / rowsMax, w = cell * 4, gap = gapFor(w);
      if (n * w + (n - 1) * gap > availW) {        // the frame is too narrow: width decides
        w = (availW - (n - 1) * gap) / n;
        gap = gapFor(w);
        w = (availW - (n - 1) * gap) / n;
        cell = w / 4;
      }
      const total = n * w + (n - 1) * gap;
      return { cell, w, gap, left: (W - total) / 2, top: top + (H - top - cell * rowsMax) / 2 };
    };

    let top = 0, f = fit(0);
    // A tower whose first row starts with a button (the chord tower's V/V) must not sit
    // under the menu button: push the towers down just enough, only when they would.
    const first = vis[0];
    const firstTop = f.top + (rowsMax - first.rowCount) * f.cell / 2;
    if (first.topLeftOccupied && f.left < MENU_CLEAR && firstTop < MENU_CLEAR) {
      top = MENU_CLEAR - my;
      f = fit(top);
    }
    stage.style.paddingTop = top + 'px';
    stage.style.gap = f.gap + 'px';
    vis.forEach(t => t.resize(f.w, f.cell * t.rowCount));
  }

  // A held chord with a note outside the scale bends the melody's matching degree
  // (V/V's F♯ makes Fa into Fi) — only while both towers are up.
  app.onChordsChanged = () => {
    towers.melody.setHarmony(state.mode === 'both' ? towers.chord.harmonicAlterations() : {});
  };

  // ---------- applying state ----------
  function applyMode() {
    const vis = visibleKinds();
    KINDS.forEach(k => {
      const t = towers[k];
      const on = vis.includes(k);
      if (!on && !t.el.hidden) t.releaseAll();
      t.el.hidden = !on;
      t.el.style.order = String(vis.indexOf(k));
    });
    layout();
    app.onChordsChanged();
    syncMenu();
    paintModalKeyboard();
  }
  function applyTheory() {
    towers.melody.updateMappings();
    towers.melody.harmony = {};
    KINDS.forEach(k => { towers[k].updateColors(); towers[k].updateNames(); });
    app.onChordsChanged();
    syncMenu();
    paintModalKeyboard();
  }
  function applyTimbre() {
    KINDS.forEach(k => {
      towers[k].synth.waveform = state.timbre[k];
      $('#timbre-' + k + ' .waveform-name').textContent = state.timbre[k];
    });
  }

  // ---------- the menu ----------
  const menu = $('#menu');
  const menuButton = $('#menu-button');
  const panel = $('.menu-panel');

  function darken(hex, percent) {
    const n = parseInt(hex.replace('#', ''), 16);
    const f = (1 - percent / 100);
    const r = Math.max(0, Math.floor(((n >> 16) & 255) * f));
    const g = Math.max(0, Math.floor(((n >> 8) & 255) * f));
    const b = Math.max(0, Math.floor((n & 255) * f));
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function openMenu() {
    menu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    const first = panel.querySelector('#mode-seg button[aria-pressed="true"]');
    if (first) first.focus({ preventScroll: true });
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    hideShareOutput();
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
  }
  function hideShareOutput() {
    const c = $('#share-output-container');
    if (c && c.style.display !== 'none') {
      c.style.display = 'none';
      const btn = $('#share-copy-btn');
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }
  }
  function syncMenu() {
    document.querySelectorAll('#mode-seg button').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode));
    });
    const swap = $('#swap-button');
    swap.hidden = state.mode !== 'both';
    $('#swap-left').textContent = towers[state.left].title.replace(' Tower', '');
    $('#swap-right').textContent = towers[other(state.left)].title.replace(' Tower', '');
    KINDS.forEach(k => { $('#timbre-' + k).hidden = !visibleKinds().includes(k); });
    $('#key-name').textContent = keyName();
    $('#scale-select').value = state.scale;
    const color = M.KEY_COLORS[keyName().charAt(0)] || '#001f3f';
    panel.style.backgroundColor = color;
    panel.style.borderColor = darken(color, 30);
    menuButton.style.backgroundColor = color;
    menuButton.style.borderColor = darken(color, 30);
  }
  function wireMenu() {
    if (inIframe) { const back = panel.querySelector('.back-hub-btn'); if (back) back.remove(); }
    menuButton.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
    menu.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeMenu));

    document.querySelectorAll('#mode-seg button').forEach(b => {
      b.addEventListener('click', () => { hideShareOutput(); state.mode = b.dataset.mode; applyMode(); });
    });
    $('#swap-button').addEventListener('click', () => { hideShareOutput(); state.left = other(state.left); applyMode(); });

    const sel = $('#scale-select');
    sel.innerHTML = Object.entries(M.scaleDefinitions)
      .map(([slug, s]) => `<option value="${slug}">${s.name}</option>`).join('');
    sel.addEventListener('change', (e) => { hideShareOutput(); state.scale = e.target.value; applyTheory(); e.target.blur(); });
    sel.addEventListener('keydown', (e) => { if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) e.preventDefault(); });

    $('#key-left').addEventListener('click', () => { hideShareOutput(); state.keyIndex = (state.keyIndex + 11) % 12; applyTheory(); });
    $('#key-right').addEventListener('click', () => { hideShareOutput(); state.keyIndex = (state.keyIndex + 1) % 12; applyTheory(); });
    const wf = ST.audio.waveforms;
    const stepTimbre = (kind, dir) => {
      hideShareOutput();
      state.timbre[kind] = wf[(wf.indexOf(state.timbre[kind]) + dir + wf.length) % wf.length];
      applyTimbre();
    };
    KINDS.forEach(k => {
      $('#timbre-' + k + ' .arrow-left').addEventListener('click', () => stepTimbre(k, -1));
      $('#timbre-' + k + ' .arrow-right').addEventListener('click', () => stepTimbre(k, 1));
    });

    $('#keyboard-button').addEventListener('click', () => { hideShareOutput(); closeMenu(); openModal(); });

    // Share
    const shareInput = $('#share-url-input'), shareCopy = $('#share-copy-btn'), shareBox = $('#share-output-container');
    const copied = () => {
      shareCopy.textContent = 'Copied!'; shareCopy.classList.add('copied');
      setTimeout(() => { if (shareCopy.textContent === 'Copied!') { shareCopy.textContent = 'Copy'; shareCopy.classList.remove('copied'); } }, 2500);
    };
    $('#share-button').addEventListener('click', () => {
      shareInput.value = shareURL();
      shareBox.style.display = 'flex';
      shareInput.focus(); shareInput.select();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareInput.value).then(copied).catch(() => {});
    });
    shareCopy.addEventListener('click', () => {
      shareInput.focus(); shareInput.select();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(shareInput.value).then(copied).catch(() => {});
      else { try { document.execCommand('copy'); copied(); } catch (e) {} }
    });
    shareInput.addEventListener('click', () => shareInput.select());
  }

  // ---------- computer keyboard routing ----------
  const downKeys = new Set();   // keys we handled on the way down
  const accidentalTargets = () => (state.mode === 'both' ? [towers.melody] : visibleTowers());
  function towerForKey(key) {
    if (state.mode !== 'both') return towers[state.mode];
    if (LEFT_HALF.has(key)) return towers[state.left];
    if (RIGHT_HALF.has(key)) return towers[other(state.left)];
    return null;
  }
  function isTyping() {
    const a = document.activeElement;
    return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable);
  }
  function pressKey(key, mods) {
    if (key === '=' || key === 'ArrowUp') { accidentalTargets().forEach(t => t.setKeyboardAccidental('sharp', true)); return true; }
    if (key === '-' || key === 'ArrowDown') { accidentalTargets().forEach(t => t.setKeyboardAccidental('flat', true)); return true; }
    const t = towerForKey(key);
    return !!(t && t.keyDown(key, mods));
  }
  function releaseKey(key) {
    if (key === '=' || key === 'ArrowUp') { KINDS.forEach(k => towers[k].setKeyboardAccidental('sharp', false)); return true; }
    if (key === '-' || key === 'ArrowDown') { KINDS.forEach(k => towers[k].setKeyboardAccidental('flat', false)); return true; }
    let handled = false;
    KINDS.forEach(k => { if (towers[k].keyUp(key)) handled = true; });
    return handled;
  }
  function wireKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { if (modal.classList.contains('open')) closeModal(); else closeMenu(); return; }
      if (isTyping() || e.metaKey || e.ctrlKey) return;
      const key = physicalKey(e);

      // ◀ ▶ on a focused Key or Timbre control
      const focus = document.activeElement;
      if (focus && focus.classList.contains('control-area') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        if (focus.classList.contains('key-control')) { $(e.key === 'ArrowLeft' ? '#key-left' : '#key-right').click(); e.preventDefault(); return; }
        if (focus.classList.contains('timbre-control')) { focus.querySelector(e.key === 'ArrowLeft' ? '.arrow-left' : '.arrow-right').click(); e.preventDefault(); return; }
      }

      if (!towers.melody.el.hidden) towers.melody.updateOctaveState(e);
      const pic = modalKey(key);
      if (pic) pic.classList.add('pressed');
      if (e.repeat) { if (downKeys.has(key)) e.preventDefault(); return; }
      ST.audio.resume();
      if (pressKey(key, { shift: e.shiftKey, alt: e.altKey })) { downKeys.add(key); e.preventDefault(); }
    });
    window.addEventListener('keyup', (e) => {
      const key = physicalKey(e);
      if (!towers.melody.el.hidden) towers.melody.updateOctaveState(e);
      const pic = modalKey(key);
      if (pic) pic.classList.remove('pressed');
      downKeys.delete(key);
      releaseKey(key);
    });

    document.addEventListener('mouseup', () => KINDS.forEach(k => towers[k].mouseUpAnywhere()));
    document.addEventListener('touchend', (e) => KINDS.forEach(k => towers[k].touchEnd(e)));
    document.addEventListener('touchcancel', (e) => KINDS.forEach(k => towers[k].touchEnd(e)));
    const quiet = () => { downKeys.clear(); KINDS.forEach(k => towers[k].releaseAll()); };
    window.addEventListener('blur', quiet);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') quiet(); });
  }

  // ---------- the keyboard picture ----------
  const modal = $('#keyboard-modal');
  const modalKey = key => (key ? modal.querySelector(`.key[data-key="${CSS.escape(key)}"]`) : null);
  function openModal() { paintModalKeyboard(); modal.classList.add('open'); }
  function closeModal() { modal.classList.remove('open'); }
  function buildModalKeyboard() {
    const kb = $('#simulated-keyboard');
    kb.innerHTML = '';
    KEY_ROWS.forEach(row => {
      const r = document.createElement('div');
      r.className = 'keyboard-row';
      row.forEach(key => {
        const k = document.createElement('div');
        k.className = 'key' + (key === null ? ' key-spacer' : '');
        if (key !== null) {
          k.dataset.key = key;
          k.textContent = key;
          const press = (e) => { e.preventDefault(); ST.audio.resume(); k.classList.add('pressed'); pressKey(key, {}); };
          const release = (e) => { e.preventDefault(); k.classList.remove('pressed'); releaseKey(key); };
          k.addEventListener('mousedown', press);
          k.addEventListener('mouseup', release);
          k.addEventListener('mouseleave', release);
          k.addEventListener('touchstart', press, { passive: false });
          k.addEventListener('touchend', release);
          k.addEventListener('touchcancel', release);
        }
        r.appendChild(k);
      });
      kb.appendChild(r);
    });
    modal.querySelector('.close-button').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }
  function paintModalKeyboard() {
    const kb = $('#simulated-keyboard');
    if (!kb.children.length) return;
    const both = state.mode === 'both';
    kb.classList.toggle('split', both);
    kb.querySelectorAll('.key[data-key]').forEach(k => {
      const key = k.dataset.key;
      k.classList.remove('key-sharp', 'key-flat');
      k.style.background = '';
      k.style.color = '';
      if (key === '=') { k.classList.add('key-sharp'); return; }
      if (key === '-') { k.classList.add('key-flat'); return; }
      const t = towerForKey(key);
      const c = t && t.keyColor(key);
      if (c) { k.style.background = c.bg; k.style.color = c.fg; }
    });
    const leftName = towers[state.left].title.replace(' Tower', '').toLowerCase();
    const rightName = towers[other(state.left)].title.replace(' Tower', '').toLowerCase();
    let heading, legend;
    if (state.mode === 'melody') {
      heading = 'Melody Tower keys';
      legend = ['<b>−</b> flat · <b>=</b> sharp', '<b>Shift</b> or <b>Caps Lock</b>: the right hand plays an octave higher'];
    } else if (state.mode === 'chord') {
      heading = 'Chord Tower keys';
      legend = ['<b>−</b> or <b>↓</b> flat · <b>=</b> or <b>↑</b> sharp', '<b>Shift</b> + key: sharp chord · <b>Option / Alt</b> + key: flat chord'];
    } else {
      heading = `Left half: ${leftName} · right half: ${rightName}`;
      legend = ['<b>−</b> <b>=</b> <b>↓</b> <b>↑</b>: flat / sharp the melody', '<b>Shift</b> or <b>Option / Alt</b> + chord key: sharp / flat chord',
                '<b>Shift</b> or <b>Caps Lock</b>: the melody’s right hand plays an octave higher'];
    }
    $('#modal-heading').textContent = heading;
    $('#key-legend').innerHTML = legend.map(l => `<div>${l}</div>`).join('');
  }

  // ---------- go ----------
  function init() {
    readURL();
    buildModalKeyboard();
    wireMenu();
    wireKeyboard();
    applyTimbre();
    applyTheory();
    applyMode();
    if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(stage);
    window.addEventListener('resize', layout);
    window.addEventListener('orientationchange', () => setTimeout(layout, 100));
    setTimeout(() => { layout(); applyTheory(); }, 200);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => layout()).catch(() => {});
  }
  init();
})();

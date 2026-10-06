/* ==========================================================================
   Song Writer — settings.js
   --------------------------------------------------------------------------
   Two objects, the split Rhythm Poetry 2.0 made (memory note
   rhythm-poetry-lesson-policy):

   VIEW  (song_writer_25_view_prefs_v1) — how the room looks: type, sizes,
         which workspace components are out (the Song · Keyboard · Chords
         switch), section colours, and what the Sound popover remembers
         (Chords, Chord voicing). Never travels in a link. Edited in the
         View and Sound popovers.

   LAYOUT (song_writer_25_layout_v1) — what is on the page and what can be
         BUILT on it: the note range, accidentals, rests, harmony,
         connected notes, the places the chord panel offers, the note
         values, the keys. It governs the primary user as much as anyone, and a student
         link carries a copy (locked). Edited in the Layout settings sheet.

   Defaults are everything-on, so an untouched 2.0 builds exactly what 1.0
   could. And Rhythm Poetry's five rules hold:
     1. restrictions govern what a user may build, never what they may see —
        opening a song never rewrites it;
     2. a forbidden control is removed, not disabled (.policy-off);
     3. a tap is never swallowed without a word (a toast says why);
     4. (lyrics are a pool — n/a here);
     5. the everyday toggles — names, the arrows — are never lockable.

   The lesson POLICY itself lives in lessons.js; can() below is the one
   place both are asked.
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const ui = SW.ui;
  const $ = id => document.getElementById(id);
  const root = document.documentElement;

  /* ==================================================================
     VIEW
     ================================================================== */
  const VIEW_KEY = 'song_writer_25_view_prefs_v1';
  const VIEW_DEFAULTS = {
    workspace: 'song',      // 'song' | 'keyboard' | 'chords' | 'custom' — the top-centre switch
    showStrip: false,       // the left-hand chord strip
    showLane: true,         // View → Chord track: the song's chords above the words (chord-track.js; the key keeps the old lane's name).
                            //   2026-10-05: its own switch — no workspace sets it; with it on, chords that are there show
    trackOwn: false,        //   (set once the switch was freed from the workspaces: the old stored value was the workspace's, not a choice)
    showDock: false,        // the keyboard under the score
    showStaff: true,        // notes with a rhythm are written on a treble staff
    colours: true,          // section colours: a pastel band behind each line
    blockSize: 'auto',      // 'auto' = Justify width (fit the window), or 'fixed'
    blockPct: 100,
    textPct: 100,
    lyricFont: 'rounded',
    kbOctaves: 2,           // the keyboard: octaves showing, 1–4 (its width)
    kbFocus: false,         // the keyboard: keys outside the key (and the song) greyed and silent
    kbColors: 'rainbow',    // the keyboard's key colours: 'rainbow' | 'played' | 'single'
    kbColor: '#9C168E',     //   the one colour, for 'single' (Song Writer's plum to start)
    dockHeight: 'md',       // the keyboard: 'sm' | 'md' | 'lg', or px from its grip
    stripSize: 'md',
    chordSet: 'extreme',    // the chord panel: 'core' | 'full' | 'extended' | 'extreme' (js/chords.js)
    chordNames: 'roman',    // the panel's names: 'roman' (I IV V) | 'letter' (C F G) — the I/C button on the panel
    chordTones: false,      // ♪ notes: the notes inside every chord block
    modSlots: ['sus2', 'add9', 'sus4', 'b7', 'maj7'],   // what Z X C V B do (js/chords.js MOD_FUNCS ids, or null)
    voicing: 'classic',     // Sound → Chord voicing: 'classic' (1.0) | 'keyblocks'
    melodySound: 'piano',   // Sound → Melody: a Key Blocks / Virtual Keyboard sound (lib/audio.js)
    melodyVolume: 100,      //   and its volume, %
    chordSound: 'piano',    // Sound → Chords
    chordVolume: 100,
    room: 35,               // Sound → Room: the reverb, % (Key Blocks' default)
    laneChordsPlay: true,   // Sound → Chords: the lane's chords sound where they change
    playLight: 'note',      // While it plays → Light up: 'note' | 'box' | 'both' | 'off' (was lightNotes, a switch; 'note' the default — the user's call)
    followScroll: true,     // While it plays → Follow along
    colourPictures: true,   // Library → Keep the section colours in saved pictures
    tapDetail: false,       // 2.5 Tap it in: snap the taps to eighths (false) or sixteenths (true)
    showBeats: false,       // 2.5 the beat strip over each written line, in Edit (js/components/beat-strip.js)
    foldedNotes: {},        // 2.5 the explaining notes folded into their ⓘ: { noteId: true } (core.js ui.note)
    chartFolded: false,     // 2.5 the chords after the melody folded to their title (chord-track.js)
    chordRhythm: true       // 2.5 the chord track shows its strikes as dots (chord-track.js)
  };
  const view = Object.assign({}, VIEW_DEFAULTS);
  /* View → While it plays → Light up (2026-10-01): what shows the note
     that is sounding. Every light sits behind the note (staff.js draws the
     box and the glow under the staff), so a note keeps its colour. */
  const PLAY_LIGHTS = ['note', 'box', 'both', 'off'];
  const PLAY_LIGHT_NOTES = {
    note: 'The sounding note glows',
    box: 'A box behind the word that is sounding',
    both: 'The note glows, with a box behind its word',
    off: 'Nothing lights up while it plays'
  };

  /* The three workspaces — what is on the stage — the Song · Keyboard ·
     Chords switch in the top bar. (2.0 called them Classic · Melody ·
     Chords; stored preferences are read under the old names too.) The
     chord track is not theirs (2026-10-05, user): View → Chord track
     alone decides whether the song's chords show, Sound → Chords alone
     whether they are heard — in every workspace, Edit or not. */
  const WORKSPACES = {
    song:     { showStrip: false, showDock: false },
    keyboard: { showStrip: false, showDock: true },
    chords:   { showStrip: true,  showDock: true }
  };
  const OLD_WORKSPACE = { classic: 'song', melody: 'keyboard' };

  function loadView() {
    try {
      const raw = JSON.parse(localStorage.getItem(VIEW_KEY) || 'null');
      if (raw && typeof raw === 'object') {
        Object.keys(VIEW_DEFAULTS).forEach(k => { if (raw[k] !== undefined) view[k] = raw[k]; });
        // an earlier build stored this switch as showValues
        if (raw.showStaff === undefined && raw.showValues !== undefined) view.showStaff = !!raw.showValues;
        // Light up the notes was a switch until 2026-10-01: on → the box, off → off
        if (raw.playLight === undefined && raw.lightNotes === false) view.playLight = 'off';
      }
    } catch (e) {}
    if (OLD_WORKSPACE[view.workspace]) view.workspace = OLD_WORKSPACE[view.workspace];
    if (!view.trackOwn) { view.showLane = true; view.trackOwn = true; }   // once: the stored value was the workspace's
    if (!WORKSPACES[view.workspace]) view.workspace = workspaceFor(view);
    view.blockPct = ui.clamp(Math.round(Number(view.blockPct)) || 100, 50, 160);
    view.textPct = ui.clamp(Math.round(Number(view.textPct)) || 100, 60, 250);
    view.kbOctaves = ui.clamp(Math.round(Number(view.kbOctaves)) || 2, 1, 4);
    if (!view.foldedNotes || typeof view.foldedNotes !== 'object' || Array.isArray(view.foldedNotes)) view.foldedNotes = {};
    if (KEY_COLOURS.indexOf(view.kbColors) === -1) view.kbColors = VIEW_DEFAULTS.kbColors;
    if (!/^#[0-9a-f]{6}$/i.test(String(view.kbColor))) view.kbColor = VIEW_DEFAULTS.kbColor;
    const hasSound = id => SW.audio && SW.audio.hasSound(id);
    if (!hasSound(view.melodySound)) view.melodySound = VIEW_DEFAULTS.melodySound;
    if (!hasSound(view.chordSound)) view.chordSound = VIEW_DEFAULTS.chordSound;
    ['melodyVolume', 'chordVolume', 'room'].forEach(k => {
      const n = Math.round(Number(view[k]));
      view[k] = isNaN(n) ? VIEW_DEFAULTS[k] : ui.clamp(n, 0, 100);
    });
    if (SW.chords) {
      if (!SW.chords.CHORD_SETS.some(c => c.id === view.chordSet)) view.chordSet = VIEW_DEFAULTS.chordSet;
      if (view.chordNames !== 'letter') view.chordNames = 'roman';
      view.chordTones = !!view.chordTones;
      const slots = Array.isArray(view.modSlots) && view.modSlots.length === 5 ? view.modSlots : VIEW_DEFAULTS.modSlots;
      view.modSlots = slots.map(id => (id && SW.chords.MOD_BY_ID[id]) ? id : null);
    }
    if (typeof view.dockHeight === 'number') view.dockHeight = ui.clamp(Math.round(view.dockHeight) || 100, 52, 600);
    else if (!DOCK_HEIGHTS.includes(view.dockHeight)) view.dockHeight = 'md';
    ['showStrip', 'showLane', 'showDock', 'showStaff', 'colours', 'kbFocus', 'laneChordsPlay', 'followScroll', 'colourPictures', 'tapDetail', 'showBeats']
      .forEach(k => { view[k] = !!view[k]; });
    if (PLAY_LIGHTS.indexOf(view.playLight) === -1) view.playLight = VIEW_DEFAULTS.playLight;
  }
  function saveView() {
    try { localStorage.setItem(VIEW_KEY, JSON.stringify(view)); } catch (e) {}
  }

  function workspaceFor(v) {
    const hit = Object.keys(WORKSPACES).find(id => {
      const w = WORKSPACES[id];
      return w.showStrip === !!v.showStrip && w.showDock === !!v.showDock;
    });
    return hit || 'custom';
  }

  /* What is actually out: the preference, less whatever a lesson leaves
     out. (While the hat is on, the chord panel sits in the foot of the
     Edit box — edit-box.js WHERE IT SITS.) */
  function shows(part) {
    const allow = SW.lessons ? SW.lessons.shellAllows : () => true;
    if (part === 'strip') return view.showStrip && allow('strip');
    if (part === 'lane') return view.showLane && allow('strip');
    if (part === 'dock') return view.showDock && allow('dock');
    return true;
  }

  const LYRIC_FONTS = {
    rounded: { family: "'Nunito', sans-serif", note: 'Friendly and round — the app’s own font.' },
    reader:  { family: "'Andika', 'Nunito', sans-serif", note: 'Made for beginning readers: the a and g children learn to write, and no letter mistaken for another.' },
    clear:   { family: "'Atkinson Hyperlegible', 'Nunito', sans-serif", note: 'Built so every letter stays distinct from across the room — good on a projector.' },
    story:   { family: "'Literata', Georgia, serif", note: 'A storybook serif, for words that should read like a poem on the page.' }
  };
  const DOCK_HEIGHTS = ['sm', 'md', 'lg'];   // keyboard-dock.js turns these into px

  /* View → Key colours: three ways for the keyboard to wear colour, and
     the colours offered for 'single' (any other through the picker). */
  const KEY_COLOURS = ['rainbow', 'played', 'single'];
  const KEY_COLOUR_NOTES = {
    rainbow: 'Every key wears its note’s colour on top, as the blocks do.',
    played: 'Plain keys; a key lights up in its note’s colour when it plays.',
    single: 'Plain keys; every key lights up in the one colour you pick.'
  };
  const KEY_SWATCHES = [
    { c: '#9C168E', name: 'Plum' }, { c: '#FF3B30', name: 'Red' }, { c: '#FF9500', name: 'Orange' },
    { c: '#FFCC00', name: 'Yellow' }, { c: '#34C759', name: 'Green' }, { c: '#48C4C8', name: 'Teal' },
    { c: '#007AFF', name: 'Blue' }, { c: '#AF52DE', name: 'Purple' }, { c: '#FF2D55', name: 'Pink' },
    { c: '#8E8E93', name: 'Grey' }
  ];
  /* A little keyboard (C to B) for each choice's card. */
  function miniKeys(mode, colour) {
    const W = 12, H = 34, BW = 7, BH = 21;
    const letters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const litNow = { E: M.LETTER_COLORS.E, A: M.LETTER_COLORS.A };
    let svg = '<svg viewBox="0 0 84 34" aria-hidden="true">';
    letters.forEach((L, i) => {
      const x = i * W + 0.5;
      const lit = mode !== 'rainbow' && litNow[L] ? (mode === 'single' ? colour : litNow[L]) : null;
      svg += '<rect x="' + x + '" y="0" width="' + (W - 1) + '" height="' + H + '" rx="1.6" fill="' + (lit || '#FEFDFF') + '" stroke="#ADA8B8" stroke-width=".6"/>';
      if (mode === 'rainbow') svg += '<rect x="' + x + '" y="0" width="' + (W - 1) + '" height="' + (H / 2) + '" fill="' + M.LETTER_COLORS[L] + '"/>';
    });
    [1, 2, 4, 5, 6].forEach(i => {
      svg += '<rect x="' + (i * W - BW / 2) + '" y="0" width="' + BW + '" height="' + BH + '" rx="1.2" fill="#141217"/>';
    });
    return svg + '</svg>';
  }
  const STRIP_WIDTHS = { sm: 156, md: 200, lg: 248 };   // the panel's row of five needs the room (2026-09-27)

  /* Scale → Justify width. 1.0 zoomed the whole page to fit an 800 × 550
     frame, never past 100%; that rule still shrinks the music on a small
     window. On a big screen (a smartboard) it now grows too, up to 160%
     (DECISIONS D15), measured against a laptop's 1366 × 768 so an
     ordinary computer stays at 100%. */
  function autoBlockScale() {
    const W = window.innerWidth, H = window.innerHeight;
    const shrink = Math.min(W / 800, H / 550);
    if (shrink < 1) return ui.clamp(shrink, 0.5, 1.0);
    return ui.clamp(Math.min(W / 1366, H / 768), 1.0, 1.6);
  }
  function blockScale() {
    return view.blockSize === 'auto' ? autoBlockScale() : view.blockPct / 100;
  }

  /* Push the view onto the page: CSS variables, body classes, controls. */
  function applyView(opts) {
    const o = opts || {};
    if (!LYRIC_FONTS[view.lyricFont]) view.lyricFont = 'rounded';
    root.style.setProperty('--bs', blockScale().toFixed(3));
    root.style.setProperty('--text-scale', (view.textPct / 100).toFixed(3));
    root.style.setProperty('--lyric-font', LYRIC_FONTS[view.lyricFont].family);
    root.style.setProperty('--strip-w', (STRIP_WIDTHS[view.stripSize] || STRIP_WIDTHS.md) + 'px');

    const b = document.body;
    b.dataset.workspace = view.workspace;
    b.classList.toggle('show-strip', shows('strip'));
    b.classList.toggle('show-lane', shows('lane'));
    b.classList.toggle('show-dock', shows('dock'));
    b.classList.toggle('show-staff', !!view.showStaff);
    b.classList.toggle('play-note', view.playLight === 'note' || view.playLight === 'both');
    b.classList.toggle('play-box', view.playLight === 'box' || view.playLight === 'both');
    b.classList.toggle('hide-section-titles', !layout.show.sectionTitles);
    b.classList.toggle('hide-keycaps', !layout.show.keycaps);
    if (SW.score && SW.score.setColours && S.colorScheme !== !!view.colours) SW.score.setColours(!!view.colours);

    syncWorkspaceTabs();
    syncViewControls();
    syncSoundControls();
    if (!o.quiet) SW.bus.emit('view:changed', { view });
  }

  // the hat on or off: the left column changes hands (panel ↔ Edit box, the panel in its foot)
  SW.bus.on('mode:changed', () => applyView());

  function setView(patch, opts) {
    Object.assign(view, patch);
    if (!('workspace' in patch)) view.workspace = workspaceFor(view);
    saveView();
    applyView(opts);
  }

  /* The keyboard's own preferences (octaves, Focus, height) — set from the
     dock's panel and grip, or from View. Only the keyboard redraws. */
  function setKeyboard(patch) {
    setView(patch, { quiet: true });
    SW.bus.emit('keyboard:changed', { octaves: 'kbOctaves' in patch });
  }

  function setWorkspace(id) {
    if (!WORKSPACES[id]) return;
    setView(Object.assign({ workspace: id }, WORKSPACES[id]));
  }

  /* 1.0's piano button (chord mode) lives on as the Chords tab; this is
     kept for anything that still flips the strip on its own. */
  function toggleStrip() {
    if (SW.lessons && !SW.lessons.shellAllows('strip')) return;
    setView({ showStrip: !view.showStrip });
  }

  /* ---------------- the top-centre switch ---------------- */
  function syncWorkspaceTabs() {
    document.querySelectorAll('#workspace-switch .side-tab').forEach(t => {
      const on = t.dataset.wsTab === view.workspace;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
    });
  }

  /* ---------------- the View popover ---------------- */
  const STAGE_SWITCHES = [
    { key: 'showStrip', name: 'Chord panel', desc: 'Digital Accordion’s chords for the left hand', part: 'strip' },
    { key: 'showLane', name: 'Chord track', desc: 'The song’s chords above the words, and after the melody', part: 'strip' },
    { key: 'showDock', name: 'Keyboard', desc: 'Lights the melody under the song', part: 'dock' }
  ];
  const PAGE_SWITCHES = [
    { key: 'showStaff', name: 'Staff notation', desc: 'Written notes on a treble staff; off, every column stays a block with a small value mark' },
    { key: 'colours', name: 'Section colours', desc: 'A pastel band behind each line' },
    { key: 'chordRhythm', name: 'Chord rhythm', desc: 'Dots on the chord track where each chord is played', part: 'strip' }
  ];
  const PLAY_SWITCHES = [
    { key: 'followScroll', name: 'Follow along', desc: 'Scroll to keep the sounding note in view' }
  ];
  function fillSwitches(listId, rows) {
    const list = $(listId);
    if (!list) return;
    list.innerHTML = '';
    rows.forEach(s => {
      if (s.part && SW.lessons && !SW.lessons.shellAllows(s.part)) return;
      list.appendChild(ui.switchRow(s.name, s.desc, !!view[s.key], () => setView({ [s.key]: !view[s.key] })));
    });
  }

  function syncViewControls() {
    const allow = k => !SW.lessons || SW.lessons.shellAllows(k);
    fillSwitches('stage-switches', STAGE_SWITCHES);
    const stageCount = $('stage-switches') ? $('stage-switches').children.length : 0;
    showHide($('stage-switches') && $('stage-switches').previousElementSibling, stageCount > 0);
    showHide($('stage-note'), allow('strip') && allow('dock'));
    fillSwitches('page-switches', PAGE_SWITCHES);
    fillSwitches('play-switches', PLAY_SWITCHES);
    $('block-auto-btn').classList.toggle('active', view.blockSize === 'auto');
    $('block-fixed-btn').classList.toggle('active', view.blockSize === 'fixed');
    const pct = Math.round(blockScale() * 100);
    $('block-size-slider').value = pct;
    $('block-size-value').textContent = pct + '%' + (view.blockSize === 'auto' ? ' · fits the window' : '');
    $('block-smaller-btn').disabled = pct <= 50;
    $('block-bigger-btn').disabled = pct >= 160;
    $('text-size-slider').value = view.textPct;
    $('text-size-value').textContent = view.textPct + '%';
    $('text-smaller-btn').disabled = view.textPct <= 60;
    $('text-bigger-btn').disabled = view.textPct >= 250;
    document.querySelectorAll('#lyric-font-row .font-chip').forEach(c => c.classList.toggle('active', c.dataset.font === view.lyricFont));
    $('lyric-font-note').textContent = LYRIC_FONTS[view.lyricFont].note;
    document.querySelectorAll('#strip-size-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.ss === view.stripSize));
    document.querySelectorAll('#play-light-seg .seg-btn').forEach(b => {
      const on = b.dataset.pl === view.playLight;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', String(on));
    });
    if ($('play-light-note')) $('play-light-note').textContent = PLAY_LIGHT_NOTES[view.playLight];
    // the keyboard and strip sizes go with the parts a lesson leaves in
    showHide($('kb-colors-row'), allow('dock'));
    syncKeyColours();
    showHide($('strip-size-row'), allow('strip'));
    showHide($('kbd-strip-title'), allow('dock') || allow('strip'));
  }

  /* ---------------- View → Key colours ---------------- */
  function syncKeyColours() {
    const row = $('kb-colors-row');
    if (!row) return;
    row.querySelectorAll('.kbc-choice').forEach(b => {
      const on = b.dataset.kc === view.kbColors;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', String(on));
      b.querySelector('.kbc-pic').innerHTML = miniKeys(b.dataset.kc, view.kbColor);
    });
    const sw = $('kb-color-swatches');
    if (!sw.querySelector('.kbc-swatch')) {
      KEY_SWATCHES.slice().reverse().forEach(s => {
        const b = document.createElement('button');
        b.className = 'kbc-swatch';
        b.type = 'button';
        b.dataset.c = s.c;
        b.title = s.name;
        b.setAttribute('aria-label', s.name);
        b.setAttribute('role', 'radio');
        b.style.setProperty('--sw', s.c);
        sw.insertBefore(b, sw.firstChild);
      });
    }
    showHide(sw, view.kbColors === 'single');
    const preset = KEY_SWATCHES.some(s => s.c.toLowerCase() === view.kbColor.toLowerCase());
    sw.querySelectorAll('.kbc-swatch').forEach(b => {
      const on = b.dataset.c.toLowerCase() === view.kbColor.toLowerCase();
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', String(on));
    });
    const custom = sw.querySelector('.kbc-custom');
    custom.classList.toggle('active', !preset);
    custom.style.setProperty('--sw', view.kbColor);
    $('kb-color-custom').value = view.kbColor.toLowerCase();
    $('kb-colors-note').textContent = KEY_COLOUR_NOTES[view.kbColors] || '';
  }
  function wireKeyColours() {
    const row = $('kb-colors-row');
    if (!row) return;
    row.querySelector('.kbc-choices').addEventListener('click', e => {
      const b = e.target.closest('.kbc-choice');
      if (b && b.dataset.kc !== view.kbColors) setKeyboard({ kbColors: b.dataset.kc });
    });
    $('kb-color-swatches').addEventListener('click', e => {
      const b = e.target.closest('.kbc-swatch');
      if (b) setKeyboard({ kbColors: 'single', kbColor: b.dataset.c });
    });
    // any colour: follows the picker as it moves
    $('kb-color-custom').addEventListener('input', e => setKeyboard({ kbColors: 'single', kbColor: e.target.value.toUpperCase() }));
  }

  /* ---------------- the Sound popover — what you hear ----------------
     Melody, Steady beat, Count-in and At the end are this visit's (reset
     each time, like Rhythm Poetry's switches); Chords and Chord voicing
     are View preferences and are remembered. */
  const AT_END_NOTES = {
    stop: 'Play stops at the end of the song.',
    round: 'Go round starts again from where Play began, without a count-in.',
    line: 'This line plays the selected line over and over, for practice.'
  };
  function syncSoundControls() {
    const list = $('sound-switches');
    if (!list) return;
    const snd = S.sound;
    const setSound = (k, v) => { snd[k] = v; syncSoundControls(); SW.bus.emit('sound:changed', { sound: snd }); };
    list.innerHTML = '';
    list.appendChild(ui.switchRow('Melody', 'The notes of the song', snd.melody, () => setSound('melody', !snd.melody)));
    if (!SW.lessons || SW.lessons.shellAllows('strip')) {
      list.appendChild(ui.switchRow('Chords', 'The song’s chords, in their rhythm — whatever is on the stage',
        !!view.laneChordsPlay, () => { setView({ laneChordsPlay: !view.laneChordsPlay }, { quiet: true }); SW.bus.emit('sound:changed', { sound: snd }); }));
    }
    list.appendChild(ui.switchRow('Steady beat', 'A soft tick on every beat', snd.beat, () => setSound('beat', !snd.beat)));
    list.appendChild(ui.switchRow('Count-in', 'Begin with a one-bar count-in', snd.countIn, () => setSound('countIn', !snd.countIn)));
    document.querySelectorAll('#at-end-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.end === snd.atEnd));
    const note = $('at-end-note');
    if (note) note.textContent = AT_END_NOTES[snd.atEnd] || '';
    document.querySelectorAll('#voicing-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.voicing === view.voicing));
    syncMixer();
  }

  /* ---------------- the Sound popover — how it sounds ----------------
     The Virtual Keyboard's sounds: a sound and a volume for the melody
     and for the chords, and the Room (reverb) over both. View
     preferences, remembered; js/audio.js reads them at every note. */
  function fillSoundSelect(sel) {
    if (!sel || sel.options.length) return;
    SW.audio.soundGroups().forEach(g => {
      const og = document.createElement('optgroup');
      og.label = g.label;
      g.sounds.forEach(snd => {
        const o = document.createElement('option');
        o.value = snd.id;
        o.textContent = snd.name;
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
  }
  function syncMixer() {
    if (!$('melody-sound')) return;
    fillSoundSelect($('melody-sound'));
    fillSoundSelect($('chord-sound'));
    $('melody-sound').value = view.melodySound;
    $('chord-sound').value = view.chordSound;
    [['melody-volume', 'melodyVolume'], ['chord-volume', 'chordVolume'], ['room-range', 'room']].forEach(([id, k]) => {
      $(id).value = view[k];
      $(id).style.setProperty('--fill', view[k] + '%');
    });
    $('melody-volume-value').textContent = view.melodyVolume + '%';
    $('chord-volume-value').textContent = view.chordVolume + '%';
    $('room-value').textContent = view.room + '%';
    // the chords' sound goes with the chords a lesson leaves in
    showHide($('chord-mix'), !SW.lessons || SW.lessons.shellAllows('strip'));
  }
  function setMix(patch) {
    setView(patch, { quiet: true });
    SW.audio.applyMix();
  }
  function wireMixer() {
    if (!$('melody-sound')) return;
    const pick = (id, key, preview) => $(id).addEventListener('change', e => {
      setMix({ [key]: e.target.value });
      preview();
      e.target.blur();              // hand the keys back to the song
    });
    pick('melody-sound', 'melodySound', SW.audio.previewMelody);
    pick('chord-sound', 'chordSound', SW.audio.previewChords);
    const slide = (id, key, out, preview) => {
      const el = $(id);
      el.addEventListener('input', () => {
        SW.audio.context();         // a gesture: wake the sound so the level lands now
        setMix({ [key]: parseInt(el.value, 10) });
        $(out).textContent = el.value + '%';
        el.style.setProperty('--fill', el.value + '%');
      });
      el.addEventListener('change', preview);   // let go: hear it
    };
    slide('melody-volume', 'melodyVolume', 'melody-volume-value', SW.audio.previewMelody);
    slide('chord-volume', 'chordVolume', 'chord-volume-value', SW.audio.previewChords);
    slide('room-range', 'room', 'room-value', SW.audio.previewMelody);
  }

  function setBlockPct(pct) {
    setView({ blockSize: 'fixed', blockPct: ui.clamp(Math.round(pct), 50, 160) });
  }
  function setTextPct(pct) {
    setView({ textPct: ui.clamp(Math.round(pct) || 100, 60, 250) });
  }

  function wireViewPopover() {
    ui.registerPopover('view-btn', 'view-popover', syncViewControls);
    ui.registerPopover('sound-btn', 'sound-popover', syncSoundControls);
    document.querySelectorAll('#workspace-switch .side-tab').forEach(t => {
      t.addEventListener('click', () => setWorkspace(t.dataset.wsTab));
    });
    $('block-auto-btn').addEventListener('click', () => setView({ blockSize: 'auto' }));
    $('block-fixed-btn').addEventListener('click', () => setView({ blockSize: 'fixed', blockPct: Math.round(blockScale() * 100) }));
    $('block-smaller-btn').addEventListener('click', () => setBlockPct(blockScale() * 100 - 10));
    $('block-bigger-btn').addEventListener('click', () => setBlockPct(blockScale() * 100 + 10));
    $('block-size-reset-btn').addEventListener('click', () => setView({ blockSize: 'auto', blockPct: 100 }));
    $('block-size-slider').addEventListener('input', e => setBlockPct(parseInt(e.target.value, 10)));
    $('text-smaller-btn').addEventListener('click', () => setTextPct(view.textPct - 10));
    $('text-bigger-btn').addEventListener('click', () => setTextPct(view.textPct + 10));
    $('text-size-reset-btn').addEventListener('click', () => setTextPct(100));
    $('text-size-slider').addEventListener('input', e => setTextPct(parseInt(e.target.value, 10)));
    $('lyric-font-row').addEventListener('click', e => {
      const c = e.target.closest('.font-chip');
      if (!c || c.dataset.font === view.lyricFont) return;
      setView({ lyricFont: c.dataset.font });
    });
    wireKeyColours();
    $('strip-size-seg').addEventListener('click', e => { const b = e.target.closest('.seg-btn'); if (b) setView({ stripSize: b.dataset.ss }); });
    $('play-light-seg').addEventListener('click', e => { const b = e.target.closest('.seg-btn'); if (b) setView({ playLight: b.dataset.pl }); });
    wireMixer();
    $('voicing-seg').addEventListener('click', e => { const b = e.target.closest('.seg-btn'); if (b) setView({ voicing: b.dataset.voicing }, { quiet: true }); });
    $('at-end-seg').addEventListener('click', e => {
      const b = e.target.closest('.seg-btn');
      if (!b) return;
      S.sound.atEnd = b.dataset.end;
      syncSoundControls();
      SW.bus.emit('sound:changed', { sound: S.sound });
    });
    $('layout-settings-btn').addEventListener('click', openLayoutSheet);
    $('help-btn').addEventListener('click', () => ui.openSheet('help-sheet'));

    // a mouse resting on View: the Scale slider (Rhythm Poetry's size gauge)
    ui.setupHoverGauge({
      trigger: $('view-btn'),
      wrap: $('size-gauge-wrap'),
      slider: $('size-gauge'),
      label: $('size-gauge-label'),
      getValue: () => Math.round(blockScale() * 100),
      format: v => v + '%',
      onInput: v => setBlockPct(v)
    });

    let t = null;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => { if (view.blockSize === 'auto') applyView(); else SW.bus.emit('view:changed', { view }); }, 80);
    });
  }

  /* ==================================================================
     LAYOUT
     ================================================================== */
  const LAYOUT_KEY = 'song_writer_25_layout_v1';
  function blankLayout() {
    return {
      v: 1,
      notes: null,        // null = all eighteen; else the note classes allowed
      accidentals: true,
      rests: true,
      harmony: true,
      connected: true,
      chords: null,       // null = all fourteen places on the chord panel (f d s a g r e q w 1 2 3 4 5)
      values: null,       // null = all eight note values
      keys: null,         // null = all thirteen keys
      scaleMorph: true,   // choosing a scale shows each note's version for it (score.js morphToScale, SCALE MEMORY); off, the notes stay and become that scale's version
      chordBend: true,    // the chord in hand bends the keyboard (chords.js bend — Digital Accordion's chordBend): V/V in C puts F♯ where F was
      show: { sectionTitles: true, keycaps: true, barNumbers: true },
      // (the 1-beat pick-up was `show.pickup` until 2026-09-28; it is the song's own now — score.pickup)
      locked: false       // arrived locked in a link or a lesson
    };
  }
  let layout = blankLayout();
  let pieceLayoutInMemory = false; // a shared piece's own settings are on screen (A PIECE'S OWN LAYOUT)

  function normalizeLayout(raw) {
    const out = blankLayout();
    if (!raw || typeof raw !== 'object') return out;
    const listOf = (arr, known) => {
      if (!Array.isArray(arr)) return null;
      const keep = known.filter(x => arr.indexOf(x) !== -1);
      return keep.length && keep.length < known.length ? keep : (keep.length ? null : null);
    };
    out.notes = listOf(raw.notes, M.noteOrder);
    ['accidentals', 'rests', 'harmony', 'connected'].forEach(k => { out[k] = raw[k] !== false; });
    // the chord places; a list saved before 2026-09-27 named the chords themselves (I, V/V …)
    const places = Array.isArray(raw.chords) ? raw.chords.map(x => SW.chords.LEGACY_PLACE[x] || x) : null;
    out.chords = listOf(places, SW.chords.PLACES);
    out.values = listOf(raw.values, SW.values.LIST.map(v => v.id));
    out.keys = listOf(raw.keys, M.KEYS);
    out.scaleMorph = raw.scaleMorph !== false;
    out.chordBend = raw.chordBend !== false;
    if (raw.show && typeof raw.show === 'object') {
      Object.keys(out.show).forEach(k => { if (raw.show[k] !== undefined) out.show[k] = !!raw.show[k]; });
    }
    out.locked = !!raw.locked;
    // a block counts as a quarter until it is written, so the quarter stays
    if (out.values && out.values.indexOf('q') === -1) out.values.push('q');
    return out;
  }
  function loadLayout() {
    try { layout = normalizeLayout(JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null')); }
    catch (e) { layout = blankLayout(); }
  }
  function saveLayout() {
    /* A shared piece's settings are on screen for that piece only; the
       student's own are what is stored (see A PIECE'S OWN LAYOUT). */
    if (pieceLayoutInMemory) return;
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout)); } catch (e) {}
  }
  function layoutChanged() {
    saveLayout();
    announceLayout();
  }
  // tell the page — the view, everything drawn from the layout, the chrome
  function announceLayout() {
    applyView({ quiet: true });
    SW.bus.emit('layout:changed', { layout });
    applyPolicyToShell();
  }

  function layoutSnapshot() { return JSON.parse(JSON.stringify(Object.assign({}, layout, { locked: false }))); }
  function applyLayoutSnapshot(snap, lock) {
    if (!snap) return;
    layout = normalizeLayout(snap);
    if (lock) layout.locked = true;
    layoutChanged();
  }
  function resetLayout() {
    try { localStorage.removeItem(LAYOUT_KEY); } catch (e) {}
    pieceLayoutInMemory = false;
    layout = blankLayout();
    layoutChanged();
  }
  function layoutEditable() { return !layout.locked && !(SW.lessons && SW.lessons.meta()); }

  /* ------------------------------------------------------------------
     A PIECE'S OWN LAYOUT

     Every piece remembers the Layout Settings it was saved with —
     `record.layout`, a layoutSnapshot() (the layout only: there is no
     separate "show" part here; the section titles, keycaps and chord
     numbers are in the layout already, and the View is the room's, never
     the piece's). library.js opens a piece through usePieceLayout(),
     before it draws it:
       • a shared piece (a teacher's, from a book or a link): on screen for
         that piece only and LOCKED — the student's own settings are left
         stored and come back as soon as anything else is opened;
       • one of your own: becomes the settings in use, and is stored as the
         app's, so a new piece starts from where you are. Unlocked.
     A Save my copy keeps the piece's settings, unlocked (it is theirs).
     Not in a lesson (its layout rules), and never over settings a lesson
     or a locked link has locked in storage.
     ------------------------------------------------------------------ */
  function storedLayoutLocked() {
    try { return !!(JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null') || {}).locked; }
    catch (e) { return false; }
  }

  /* snap: the piece's `layout` (or nothing); received: it is a shared
     piece. Called with no snap on the way to anything that has none — New,
     the sandbox, an old song — which is what brings the student's own
     settings back. The page hears about it only if something changed. */
  function usePieceLayout(snap, received) {
    if (SW.lessons && SW.lessons.meta()) return;
    const piece = snap && typeof snap === 'object' ? snap : null;
    const before = ui.stableStringify(layout);
    if (piece && received) {
      layout = normalizeLayout(piece);
      layout.locked = true;
      pieceLayoutInMemory = true;
    } else {
      if (pieceLayoutInMemory) {           // back from a shared piece: the student's own
        pieceLayoutInMemory = false;
        loadLayout();
      }
      if (piece && !received && !storedLayoutLocked()) {
        layout = normalizeLayout(piece);
        layout.locked = false;
        saveLayout();
      }
    }
    if (ui.stableStringify(layout) !== before) announceLayout();
  }

  /* ---- the questions the rest of the app asks ---- */
  function allowedNotes() { return layout.notes || M.noteOrder; }
  function allowedValues() {
    const all = SW.values.LIST.map(v => v.id);
    return layout.values ? all.filter(id => layout.values.indexOf(id) !== -1) : all;
  }
  function allowedKeys() { return layout.keys || M.KEYS; }

  function can(what) {
    const L = SW.lessons;
    const p = L && L.policy();
    const melody = !p || !p.task.melodyLocked;
    const words = !p || !p.task.wordsLocked;
    const shell = k => !L || L.shellAllows(k);
    switch (what) {
      case 'edit': return melody || words;
      case 'pitch': return melody;
      case 'accidentals': return melody && layout.accidentals;
      case 'rest': return melody && layout.rests;
      case 'harmony': return melody && layout.harmony;
      case 'connected': return melody && layout.connected;
      case 'values': return melody;
      case 'meter': return melody;
      case 'chords': return melody && shell('strip') && !(p && p.task.chordsLocked);
      case 'chordsListen': return shell('strip');                    // the chord progressions, to look at and hear (listen only)
      case 'words': return words;
      case 'structure': return melody && words;
      case 'sections': return melody && words && shell('sections');
      case 'textEditor': return melody && words && shell('textEditor');
      case 'key': return !p || !p.key.locked;
      case 'scale': return !p || !p.key.locked;                      // the scale goes with the key
      case 'tempo': return !p || !p.tempo || p.tempo.mode !== 'locked';
      default: return true;
    }
  }

  /* ---- the lesson's tempo rule (Rhythm Poetry's Any · Between · Locked).
     Outside a lesson, the family's 30–300. ---- */
  function tempoRange() {
    const p = SW.lessons && SW.lessons.policy();
    if (p && p.tempo && p.tempo.mode === 'range') return [p.tempo.min, p.tempo.max];
    return [SW.meters.MIN_BPM, SW.meters.MAX_BPM];
  }
  function clampTempo(b) {
    const r = tempoRange();
    return ui.clamp(SW.meters.clampBpm(b), r[0], r[1]);
  }

  /* ==================================================================
     THE POLICY PASS — put the chrome into whatever state the lesson and
     the layout ask for. A class rather than `hidden`, so it always wins.
     Removed, never greyed: only the key, the meter and the tempo turn
     into plain text when they cannot change (you have to be able to
     read them to play the song).
     ================================================================== */
  function showHide(el, on) { if (el) el.classList.toggle('policy-off', !on); }

  function applyPolicyToShell() {
    const L = SW.lessons;
    const inLesson = !!(L && L.meta());
    const shell = k => !L || L.shellAllows(k);
    document.body.classList.toggle('in-lesson', inLesson);

    // the hat and the editing layer
    showHide($('editToggle'), can('edit'));
    showHide($('rhythm-panel'), can('values'));
    showHide($('textEditorBtn'), can('textEditor'));
    showHide($('add-line-row'), can('structure'));
    document.body.classList.toggle('chords-locked', !can('chords'));
    document.body.classList.toggle('sections-locked', !can('sections'));

    // key + time + tempo: plain text when they cannot change
    const keyFixed = !can('key'), meterFixed = !can('meter'), tempoFixed = !can('tempo');
    const keyBtn = $('keySignatureDisplay');
    if (keyBtn) {
      keyBtn.classList.toggle('fixed', keyFixed);
      keyBtn.title = keyFixed ? 'The key stays as written in this lesson' : 'Key — tap to choose';
    }
    const ts = $('time-sig');
    if (ts) {
      ts.classList.toggle('fixed', meterFixed);
      ts.title = meterFixed ? 'The time signature' : 'Tap the top number for the beats in a bar, the bottom one for 6/8-style time';
    }
    const tsTop = $('ts-top');
    if (tsTop) tsTop.disabled = meterFixed;
    const tsBottom = $('ts-bottom');
    if (tsBottom) tsBottom.disabled = meterFixed;
    const sig = $('signature');
    if (sig) sig.classList.toggle('all-fixed', keyFixed && meterFixed);
    const bpm = $('bpm-button');
    if (bpm) {
      bpm.classList.toggle('fixed', tempoFixed);
      bpm.title = tempoFixed ? 'The tempo stays as written in this lesson' : 'Tap to type a tempo';
    }

    // the stage: a tab goes when the lesson removes its part; with only
    // Song left, the whole switch goes (as Rhythm Poetry's one-side lesson)
    const kbTab = document.querySelector('.side-tab[data-ws-tab="keyboard"]');
    const chTab = document.querySelector('.side-tab[data-ws-tab="chords"]');
    showHide(kbTab, shell('dock'));
    showHide(chTab, shell('strip'));
    showHide($('workspace-switch'), shell('dock') || shell('strip'));

    showHide($('sound-btn'), shell('sound'));
    showHide($('view-btn'), shell('view'));
    showHide($('tg-present'), shell('present'));
    showHide($('song-chip'), !L || L.libraryMode() !== 'none');
    showHide($('copyVisualBtn'), shell('picture'));
    showHide($('picture-colours-row'), shell('picture'));

    showHide($('newSongBtn'), !inLesson);
    showHide($('saveAsBtn'), !inLesson);
    showHide($('shelfBtn'), !inLesson);
    showHide($('importExportBtn'), !inLesson);
    showHide($('lessonSetupBtn'), !inLesson);
    showHide($('layout-settings-btn'), layoutEditable());
    showHide($('layout-settings-note'), layoutEditable());
    showHide($('layout-settings-divider'), layoutEditable());

    const strip = $('task-strip');
    if (strip) {
      strip.hidden = !inLesson;
      if (inLesson) {
        $('task-strip-title').textContent = L.meta().title || 'Lesson';
        $('task-strip-note').textContent = L.taskBlurb();
      }
    }
    // a lesson whose tempo is ranged or locked holds the song to it
    if (SW.score && inLesson) {
      const r = tempoRange();
      if (S.bpm < r[0] || S.bpm > r[1]) SW.score.setTempo(clampTempo(S.bpm), true);
    }
    applyView({ quiet: true });
    if (SW.score) SW.score.refreshGates();
    SW.bus.emit('policy:changed', {});
  }

  /* ==================================================================
     THE LAYOUT SETTINGS SHEET
     ================================================================== */
  const RANGE_PRESETS = [
    { id: 'all', name: 'All eighteen', notes: null },
    { id: 'octave', name: 'Do to do′', notes: ['do', 're', 'mi', 'fa', 'so', 'la', 'ti', 'do-high'] },
    { id: 'five', name: 'Do to so', notes: ['do', 're', 'mi', 'fa', 'so'] },
    { id: 'penta', name: 'Pentatonic', notes: M.noteOrder.filter(n => ['Do', 'Re', 'Mi', 'So', 'La'].indexOf(M.noteToSolfege[n]) !== -1) }
  ];

  function renderLayoutShow() {
    const list = $('layout-show');
    list.innerHTML = '';
    [
      ['sectionTitles', 'Section titles', 'The A, B … name at the top of each line'],
      ['keycaps', 'Letter keys on the chord panel', 'The F D S A … and Z X C V B each chord and button is played with'],
      ['barNumbers', 'Bar numbers', 'A small number over the first note of each bar, on written lines'],
    ].forEach(([k, name, desc]) => {
      list.appendChild(ui.switchRow(name, desc, layout.show[k], () => { layout.show[k] = !layout.show[k]; layoutChanged(); renderLayoutShow(); }));
    });
    /* The first line's pick-up (the song's own — lines[0].pickup, saved,
       shared and sent with it; score.js PICK-UPS). Any other line takes
       one from Pick-up in the Edit box. */
    list.appendChild(ui.switchRow('Pick-up (first line)',
      'The song starts with a pick-up into its first bar. In Edit, select a note in it to choose its rhythm or take it away; Pick-up in the Edit box gives any line one',
      !!SW.score.firstPickup(), () => { SW.score.setFirstPickup(!SW.score.firstPickup()); renderLayoutShow(); }));
  }
  SW.bus.on('score:loaded', () => { if ($('layout-show')) renderLayoutShow(); });
  // the first line's pick-up can change in Edit (or its line move up)
  SW.bus.on('score:changed', e => { if (e && (e.reason === 'line' || e.reason === 'section') && $('layout-show')) renderLayoutShow(); });

  function renderLayoutNotes() {
    const presets = $('layout-range-presets');
    presets.innerHTML = '';
    const cur = allowedNotes();
    RANGE_PRESETS.forEach(p => {
      const on = (p.notes || M.noteOrder).join() === cur.join();
      const chip = document.createElement('button');
      chip.className = 'chip' + (on ? ' active' : '');
      chip.textContent = p.name;
      chip.addEventListener('click', () => { layout.notes = p.notes ? p.notes.slice() : null; layoutChanged(); renderLayoutNotes(); });
      presets.appendChild(chip);
    });

    const box = $('layout-notes');
    box.innerHTML = '';
    // each rung named as the song's scale has it (me in minor); a rung the
    // scale skips (fa in pentatonic) keeps its major name
    const alters = M.stepAlters();
    M.noteOrder.forEach(n => {
      const on = cur.indexOf(n) !== -1;
      const a = alters[M.STEP_OF[M.noteToSolfege[n]]];
      const sol = M.solfegeOf(n, M.accOf(a === undefined ? 0 : Math.max(-1, Math.min(1, a))));
      const b = document.createElement('button');
      b.className = 'range-block' + (on ? ' on' : '');
      b.style.setProperty('--h', M.NOTE_HEIGHTS[n]);
      b.style.setProperty('--c', M.noteColour(n));
      b.title = sol + (M.octaveOf(n) < 0 ? ' (low)' : M.octaveOf(n) > 0 ? ' (high)' : '');
      b.innerHTML = '<span class="range-bar"></span><span class="range-name"></span>';
      b.querySelector('.range-name').textContent = sol.toLowerCase() + (M.octaveOf(n) < 0 ? ',' : M.octaveOf(n) > 0 ? '′' : '');
      b.addEventListener('click', () => {
        let list = allowedNotes().slice();
        const at = list.indexOf(n);
        if (at === -1) list.push(n);
        else if (list.length > 1) list.splice(at, 1);
        else { ui.toast('At least one note has to stay'); return; }
        list = M.noteOrder.filter(x => list.indexOf(x) !== -1);
        layout.notes = list.length === M.noteOrder.length ? null : list;
        layoutChanged();
        renderLayoutNotes();
      });
      box.appendChild(b);
    });

    const build = $('layout-build');
    build.innerHTML = '';
    [
      ['accidentals', 'Sharps and flats', 'The ♯ ♭ buttons in the Edit box'],
      ['rests', 'Rests', 'A second tap on the lit value circle'],
      ['harmony', 'Harmony', 'Stacking notes on the same beat'],
      ['connected', 'Connected notes', 'Several notes on one syllable']
    ].forEach(([k, name, desc]) => {
      build.appendChild(ui.switchRow(name, desc, layout[k], () => { layout[k] = !layout[k]; layoutChanged(); renderLayoutNotes(); }));
    });
  }

  function chipToggleList(boxId, all, current, label, onSet, opts) {
    const box = $(boxId);
    box.innerHTML = '';
    const o = opts || {};
    all.forEach(id => {
      const on = current.indexOf(id) !== -1;
      const chip = document.createElement('button');
      chip.className = 'chip' + (on ? ' active' : '') + (o.cls ? ' ' + o.cls : '');
      if (o.render) o.render(chip, id); else chip.textContent = label(id);
      chip.addEventListener('click', () => {
        if (o.locked && o.locked(id)) { ui.toast(o.lockedMsg || 'That one stays'); return; }
        let list = current.slice();
        const at = list.indexOf(id);
        if (at === -1) list.push(id);
        else if (list.length > 1) list.splice(at, 1);
        else { ui.toast('At least one has to stay'); return; }
        list = all.filter(x => list.indexOf(x) !== -1);
        onSet(list.length === all.length ? null : list);
        layoutChanged();
        renderLayoutSheet();
      });
      box.appendChild(chip);
    });
  }

  function renderLayoutSheet() {
    renderLayoutShow();
    renderLayoutNotes();
    // the fourteen places, each showing the scale's chord on it right now
    const allowedPlaces = layout.chords || SW.chords.PLACES;
    chipToggleList('layout-chords', SW.chords.PLACES, allowedPlaces, p => p.toUpperCase(), v => { layout.chords = v; }, {
      render: (chip, place) => {
        const e = SW.chords.entry(place);
        const d = e ? SW.chords.describe(e.spec) : null;
        chip.innerHTML = '<span class="chip-swatch"></span><span></span><small class="chip-key"></small>';
        chip.querySelector('.chip-swatch').style.background = d ? d.color : '#8A8A8A';
        chip.children[1].innerHTML = d ? SW.chords.labelHTML(SW.chords.nameOf(d)) : '—';
        chip.lastChild.textContent = place.toUpperCase();
        chip.title = d ? d.roman + ' — ' + d.letter + ' (key ' + place.toUpperCase() + ')' : '';
      }
    });
    chipToggleList('layout-values', SW.values.LIST.map(v => v.id), allowedValues(), id => SW.values.byId(id).name, v => { layout.values = v; }, {
      cls: 'value-chip',
      locked: id => id === 'q',
      lockedMsg: 'Quarter notes stay — a block counts as one beat until it is written',
      render: (chip, id) => {
        chip.innerHTML = SW.engrave.value(id, { height: 26 }) + '<span></span>';
        chip.lastChild.textContent = SW.values.byId(id).name.replace(' note', '');
        chip.title = SW.values.byId(id).name;
      }
    });
    chipToggleList('layout-keys', M.KEYS, allowedKeys(), k => M.displayKey(k), v => { layout.keys = v; });
    const bendRow = $('layout-bend');
    if (bendRow) {
      bendRow.innerHTML = '';
      bendRow.appendChild(ui.switchRow('Chords bend the keyboard',
        'As in Digital Accordion: while a chord is in hand, its notes outside the scale take the place of the scale’s note on the same letter — after V/V in C, the melody keys’ fa plays F♯, and the keyboard’s F♯ keys take F’s colour and a white ring, until the chord changes or is cleared. Off, the keyboard keeps to the scale. The song’s notes are never changed',
        layout.chordBend !== false, () => { layout.chordBend = layout.chordBend === false; layoutChanged(); renderLayoutSheet(); }));
    }
    const sc = $('layout-scale');
    if (sc) {
      sc.innerHTML = '';
      sc.appendChild(ui.switchRow('Melody follows the scale',
        'Choosing a scale shows the song in it — C major to C minor turns mi into me, la into le, ti into te; a note the new scale has no place for (fa in pentatonic) moves to its nearest neighbour. A ♯ or ♭ belongs to the scale it was added in: each scale keeps its own, and comes back as it was. Off, the notes stay as they are and become this scale’s version. Either way ↑ ↓ and the letter keys write the scale’s notes. The progressions’ chords follow too: a chord picked from the panel becomes that key’s chord in the new scale',
        layout.scaleMorph !== false, () => { layout.scaleMorph = layout.scaleMorph === false; layoutChanged(); renderLayoutSheet(); }));
    }
  }

  function openLayoutSheet() {
    if (!layoutEditable()) {
      // rule 3: never swallowed without a word
      ui.toast(pieceLayoutInMemory
        ? 'This song comes with its own settings — Save my copy to change them'
        : 'Your layout settings were set by whoever sent this');
      return;
    }
    ui.closeAllPopovers();
    renderLayoutSheet();
    ui.openSheet('layout-sheet');
  }

  /* One line each, for the Set up for students sheet. */
  function layoutSummary() {
    const notes = allowedNotes();
    const lo = M.noteToSolfege[notes[0]].toLowerCase(), hi = M.noteToSolfege[notes[notes.length - 1]].toLowerCase();
    const off = ['accidentals', 'rests', 'harmony', 'connected'].filter(k => !layout[k]);
    return [
      notes.length === M.noteOrder.length ? 'All eighteen notes' : `${notes.length} notes, ${lo} to ${hi}`,
      off.length ? 'No ' + off.join(', ').replace('accidentals', 'sharps or flats') : 'Sharps, flats, rests, harmony and connected notes',
      `${SW.chords.offered().length} chords on the panel`,
      `${allowedValues().length} note values`,
      `${allowedKeys().length} key${allowedKeys().length === 1 ? '' : 's'}`
    ];
  }

  /* ---------------- boot ---------------- */
  function init() {
    loadView();
    loadLayout();
    wireViewPopover();
    applyView({ quiet: true });
  }

  SW.settings = {
    init, view, get layout() { return layout; },
    VIEW_DEFAULTS, WORKSPACES,
    setView, setKeyboard, setWorkspace, toggleStrip, applyView, shows, blockScale, syncSoundControls,
    can, allowedNotes, allowedValues, allowedKeys, tempoRange, clampTempo,
    layoutSnapshot, applyLayoutSnapshot, resetLayout, layoutEditable, layoutSummary,
    usePieceLayout,
    applyPolicyToShell, openLayoutSheet
  };
})();

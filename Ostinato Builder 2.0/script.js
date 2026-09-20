/* ============================================================
   Ostinato Builder 2.0
   ------------------------------------------------------------
   Several instruments, each with its own rhythm, read down the
   page as one grid and played together as a loop.

   Three ideas carry the whole app:

   1. Time is counted in ticks, 24 to a quarter note, exactly as
      the notation engine counts it. Every division the app can
      draw lands on a whole tick, so what is printed and what is
      heard are built from the same numbers and cannot drift.

   2. A beat's width is shared by every track, but the number of
      slots inside it is not. That is what lets a shaker play
      sixteenths against a bass drum's quarters and still have
      the bar lines fall in a straight line down the page.

   3. Which inactive slots are held notes and which are silence
      is decided once, by beatRoles(), and both the dots and the
      notation read from it. The printed rhythm can therefore
      never contradict the colours a student is looking at.
   ============================================================ */

/* ==================================================================
   EMBEDDED IN THE MUSIC STAND
   ------------------------------------------------------------------
   The Music Stand opens this app in a frame (?embed=music-stand) to
   play an ostinato under a poem. There the app is a guest: it may read
   its library and settings, but nothing it does may write them. Opening a song in the Music Stand must not change which song is open
   the next time this app is opened on its own, let alone overwrite one.

   Rather than guard every write (there are a dozen, and the next one
   added would be missed), localStorage itself is swapped for a layer
   that reads through to the real thing and keeps every write in memory.
   It runs before the app, so the app never sees the real object.

   Rhythm Poetry 2.0 carries the same block; keep the two in step.
   See `Music Stand/README.md` for the bridge they serve.
   ================================================================== */
(function () {
  let embedded = false;
  try {
    embedded = new URLSearchParams(window.location.search).get('embed') === 'music-stand'
      && window.parent !== window;
  } catch (e) {}
  if (!embedded) return;

  const real = window.localStorage;
  const writes = new Map();             // key -> value, or null once removed
  const layer = {
    getItem(k) {
      k = String(k);
      if (writes.has(k)) return writes.get(k);
      try { return real.getItem(k); } catch (e) { return null; }
    },
    setItem(k, v) { writes.set(String(k), String(v)); },
    removeItem(k) { writes.set(String(k), null); },
    clear() { writes.clear(); },
    key(i) { try { return real.key(i); } catch (e) { return null; } },
    get length() { try { return real.length; } catch (e) { return 0; } }
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: layer, configurable: true });
  } catch (e) {}

  /* If the swap did not take, this is not a safe guest: run as the plain
     app, and the Music Stand will find no bridge and say so. */
  if (window.localStorage !== layer) return;
  window.MUSIC_STAND_EMBED = {
    /* Drop what this frame wrote for a key, so the next read is the real,
       current value — the Music Stand's song picker wants the live library. */
    forget(k) { writes.delete(String(k)); }
  };
})();

(function () {
  'use strict';

  const EMBEDDED = !!window.MUSIC_STAND_EMBED;
  const RN = window.RhythmNotation;
  const VI = window.VirtualInstruments;
  /* The glyph file declares `const GLYPHS_LELAND` at the top level of a
     classic script, which is a lexical binding — it is reachable by name
     but never becomes a property of `window`. */
  RN.useGlyphs(GLYPHS_LELAND);


  /* ==================================================================
     METER AND TICKS
     ================================================================== */

  const SIMPLE_BEAT   = 24;   // a quarter note, the engine's TICKS_PER_QUARTER
  const COMPOUND_BEAT = 36;   // a dotted quarter

  /* On a board the +/− pair has to grow to a finger-sized target, and the
     gutter that houses it has to grow with it. This is read once: a beat's
     width is computed from GUTTER_L here and the padding is set from the
     matching CSS var below, so the one value has to drive both. */
  const COARSE_POINTER = window.matchMedia('(pointer: coarse)').matches;

  /* Layout constants. The gutters are also written into CSS below so the
     two can never disagree. */
  const COLUMN_MIN = 30;   // a dot plus its breathing room
  const WORD_PAD   = 8;    // space either side of a syllable
  const GUTTER_L   = COARSE_POINTER ? 32 : 22;   // room for the +/− controls inside the pill
  const GUTTER_R   = 10;
  const BORDER_PAD = 3;    // the pill's 1.5px border, both sides

  function isCompound() { return song.timeSignatureDenominator === 8; }
  function beatTicks()  { return isCompound() ? COMPOUND_BEAT : SIMPLE_BEAT; }

  /* How finely a beat may be divided, stated per family rather than for
     the piece in hand. The three functions under these are the same
     answers for whichever family is playing; Layout settings has to ask
     about both at once, so it reads the tables. Keeping the numbers in
     one place is what stops the switches in that sheet drifting from the
     buttons on the page. */
  const NATURAL_SLOTS   = { simple: 2, compound: 3 };   // the plain division
  const SIXTEENTH_SLOTS = { simple: 4, compound: 6 };   // what + reaches for
  const TUPLET_LADDER   = { simple: [3, 6], compound: [2, 4] };  // what − walks

  /* The plain division of one beat: two eighths, or three in compound. */
  function defaultSubdivision() { return NATURAL_SLOTS[familyOf()]; }

  /* What the + button reaches for: this beat's sixteenth-note level. */
  function sixteenthSubdivision() { return SIXTEENTH_SLOTS[familyOf()]; }

  /* What the − button walks through: the opposite feel, then its own
     subdivision, then back off again. */
  function tupletLadder() { return TUPLET_LADDER[familyOf()].slice(); }

  /* The numerator is what gets printed; the app counts beats. In compound
     time the numerator counts eighths while a beat is a dotted quarter, so
     6/8 is two beats, 9/8 three, 12/8 four. */
  function beatsPerMeasure() {
    return isCompound() ? song.timeSignatureNumerator / 3 : song.timeSignatureNumerator;
  }
  function totalBeats()      { return song.measures * beatsPerMeasure(); }
  function totalTicks()      { return totalBeats() * beatTicks(); }


  /* ==================================================================
     THE SONG
     ------------------------------------------------------------------
     One flat array of beats per track. Each beat carries its own slot
     count, so subdivision is a property of a beat on a track rather
     than of the bar — which is the whole point of the app.
     ================================================================== */

  function makeBeat(slots, cells) {
    return {
      slots: slots,
      cells: Array.from({ length: slots }, (_, i) => !!(cells && cells[i]))
    };
  }

  /* Spell a track's rhythm as a string, one character per slot, beats
     separated by spaces:  'X.  ..  X.  ..'  — far easier to read and to
     edit than nested arrays. A digit prefix sets the beat's division. */
  function beatsFromPattern(pattern) {
    const text = (pattern || '').trim();
    if (!text) return [];
    return text.split(/\s+/).map(tok => {
      const cells = tok.split('').map(ch => ch === 'X' || ch === 'x');
      return makeBeat(cells.length, cells);
    });
  }

  let nextTrackId = 1;

  function makeTrack(instrumentId, pattern) {
    return {
      id: nextTrackId++,
      instrument: instrumentId,
      muted: false,
      beats: beatsFromPattern(pattern),
      /* Beats joined to the one after them, keyed by the left beat's index.
         Joins chain, so 1-2 and 2-3 read as one three-beat span. */
      links: {}
    };
  }

  /* The starters. Each one is here to show something the app can do that
     a single-line rhythm editor cannot, so a teacher opening the library
     for the first time has a reason to try each. */
  const DEFAULT_SONGS = {
    'rock-beat': {
      title: 'Rock beat',
      bpm: 92, meter: [4, 4], measures: 1,
      tracks: [
        ['bass',   'X. .. X. ..'],
        ['snare',  '.. X. .. X.'],
        ['hihat',  'XX XX XX XX'],
        ['shaker', 'XXXX XXXX XXXX XXXX']
      ]
    },
    'son-clave': {
      title: 'Son clave (3-2)',
      bpm: 100, meter: [4, 4], measures: 2,
      tracks: [
        /* the clave itself: 1, the and of 2, and 4 — then 2 and 3 */
        ['claves',    'X. .X .. X.  .. X. X. ..'],
        ['conga-low', 'X. .. X. ..  X. .. X. ..'],
        ['shaker',    'XX XX XX XX  XX XX XX XX']
      ]
    },
    'layered-quarters': {
      title: 'Three layers',
      bpm: 84, meter: [4, 4], measures: 1,
      tracks: [
        ['bass',   'X. .. .. ..'],
        ['claves', 'X. X. X. X.'],
        ['shaker', 'XX XX XX XX']
      ]
    },
    'six-eight': {
      title: 'Six-eight groove',
      bpm: 108, meter: [6, 8], measures: 1,
      tracks: [
        ['cowbell',    'X.. X..'],
        ['conga-high', '..X ..X'],
        ['tambourine', 'XXX XXX']
      ]
    }
  };

  const LANDING_SONG = 'rock-beat';

  function songFromDefault(id) {
    const d = DEFAULT_SONGS[id];
    return {
      id: id,
      title: d.title,
      bpm: d.bpm,
      timeSignatureNumerator: d.meter[0],
      timeSignatureDenominator: d.meter[1],
      measures: d.measures,
      tracks: d.tracks.map(([instrument, pattern]) => ({
        instrument: instrument,
        muted: false,
        beats: beatsFromPattern(pattern).map(b => ({ slots: b.slots, cells: b.cells })),
        links: {}
      }))
    };
  }

  /* The piece on screen. Everything about it is replaced wholesale when a
     song is opened, so nothing from the last one can leak into the next. */
  const song = {
    id: null,
    title: '',
    bpm: 92,
    timeSignatureNumerator: 4,
    timeSignatureDenominator: 4,
    measures: 1,
    tracks: []
  };

  let metronomeOn = false;


  /* ==================================================================
     KEEPING TRACKS THE RIGHT LENGTH

     Adding a measure, or changing the meter, changes how many beats a
     track should hold. Beats that already exist keep what the user put
     in them; new ones arrive empty.
     ================================================================== */

  /* Make sure a track has at least as many beats as the piece now needs.

     It never takes any away. Six-eight counts two beats to a bar where
     four-four counts four, so looking at two bars of 4/4 in 6/8 shows half
     as many beats — and if the surplus were thrown out, going back to 4/4
     would find the second half of the piece gone. Beats past the end are
     simply not drawn and not played; they are waiting, not deleted.

     Joins are left alone for the same reason: isLinked() already ignores
     any that would reach over a bar line under the current meter, so one
     that stops making sense goes quiet rather than being destroyed. */
  function conformTrack(track) {
    const want = totalBeats();
    const plain = defaultSubdivision();
    while (track.beats.length < want) track.beats.push(makeBeat(plain, []));
    if (!track.links) track.links = {};

    /* A division the app cannot draw — from an edited file, say — falls
       back to the plain one. Only the beats in view are checked: a beat
       waiting offstage keeps whatever the meter it was written in gave it. */
    const allowed = [plain, sixteenthSubdivision()].concat(tupletLadder());
    for (let i = 0; i < want; i++) {
      const b = track.beats[i];
      if (allowed.indexOf(b.slots) === -1) {
        b.slots = plain;
        b.cells = Array.from({ length: plain }, (_, k) => !!b.cells[k]);
      }
    }
  }

  function conformAllTracks() { song.tracks.forEach(conformTrack); }

  /* Moving a beat to a different division: keep each sound at the point
     in the beat where it already was, as near as the new grid allows. */
  function remapCells(cells, oldSlots, newSlots) {
    const out = Array.from({ length: newSlots }, () => false);
    for (let i = 0; i < oldSlots; i++) {
      if (!cells[i]) continue;
      const j = Math.round((i / oldSlots) * newSlots);
      if (j >= 0 && j < newSlots) out[j] = true;
    }
    return out;
  }

  function setBeatSlots(track, beatIndex, slots) {
    const beat = track.beats[beatIndex];
    if (!beat || beat.slots === slots) return;
    beat.cells = remapCells(beat.cells, beat.slots, slots);
    beat.slots = slots;
  }


  /* ==================================================================
     LINKED BEATS
     ------------------------------------------------------------------
     Joining two beats is what makes a half note, a dotted half or a whole
     note reachable: the run is read as one span, so a sound on the first
     beat holds through the beats joined to it instead of stopping at the
     beat line.

     Joins belong to a track, not to the bar. A bass drum can hold a whole
     note through four beats while the shaker above it plays sixteenths,
     which is exactly the case this app exists for.
     ================================================================== */

  /* Beats may be joined whatever they are divided into — that is what lets
     a span carry a half note and then a beat of sixteenths — as long as
     they share a measure. Ties across a bar line are a separate idea and
     are not offered here. */
  function canLinkBeats(leftBeatIndex) {
    const right = leftBeatIndex + 1;
    if (leftBeatIndex < 0 || right >= totalBeats()) return false;
    const per = beatsPerMeasure();
    return Math.floor(leftBeatIndex / per) === Math.floor(right / per);
  }

  function isLinked(track, leftBeatIndex) {
    return !!(track.links && track.links[leftBeatIndex]) && canLinkBeats(leftBeatIndex);
  }

  function toggleLink(track, leftBeatIndex) {
    if (!rhythmEditable()) return;
    if (!track.links) track.links = {};
    if (track.links[leftBeatIndex]) delete track.links[leftBeatIndex];
    else track.links[leftBeatIndex] = true;
  }

  /* The whole run this beat belongs to: joins chain, so 1-2 and then 2-3
     make one three-beat span. */
  function linkGroup(track, beatIndex) {
    let start = beatIndex;
    while (isLinked(track, start - 1)) start--;
    let end = beatIndex;
    while (isLinked(track, end)) end++;
    return { start: start, end: end, span: end - start + 1 };
  }

  /* Walk a track the way it is drawn: a run of joined beats is one group,
     anything else is a beat on its own. */
  function trackGroups(track) {
    const groups = [];
    const n = totalBeats();
    let b = 0;
    while (b < n) {
      const g = linkGroup(track, b);
      groups.push(g);
      b = g.end + 1;
    }
    return groups;
  }

  /* Dot colours for a whole group.

     A single beat keeps its own reading, exceptions and all. A joined run
     cannot: its whole point is that a sound carries over the beat line, so
     it is read by the general rule across the run. Feeding the engraver
     from this is what keeps a printed tie from contradicting the dots. */
  function groupColours(track, group) {
    if (group.span === 1) return beatRoles(track.beats[group.start]);

    const flags = [];
    for (let b = group.start; b <= group.end; b++) {
      track.beats[b].cells.forEach(c => flags.push(!!c));
    }
    return RN.rolesFromFlags(flags).map(r =>
      r === 'note' ? 'active' : r === 'hold' ? 'sustain' : 'inactive');
  }

  /* The engraver's description of a group: each beat keeps its own slot
     count, which is how one span can hold a half note and then a beat of
     sixteenths. Roles are passed in rather than re-derived, so the print
     and the dots stay the same rhythm. */
  function groupSlotMap(track, group, colours) {
    const beats = [];
    let at = 0;
    for (let b = group.start; b <= group.end; b++) {
      const slots = track.beats[b].slots;
      beats.push({ slots: slots, roles: rolesToNotation(colours.slice(at, at + slots)) });
      at += slots;
    }
    return RN.buildMap({ compound: isCompound(), beats: beats });
  }


  /* ==================================================================
     THE LIBRARY
     ------------------------------------------------------------------
     Every ostinato the user has, kept in localStorage. The one on screen
     is written back after each change, so there is no Save button to
     forget: opening another song, or coming back tomorrow, finds the
     work where it was left.

     A record is the whole piece — meter, tempo, length, and every track
     with its beats and joins. Nothing is derived on load, so an old file
     opens as the piece it was rather than as whatever the app now
     defaults to.
     ================================================================== */

  const LIBRARY_KEY   = 'ostinato_builder_library_v1';
  const ACTIVE_ID_KEY = 'ostinato_builder_active_song_v1';

  /* The sandbox: one scratch ostinato for work that is not meant to
     become anything. It is kept from visit to visit like any other song,
     but it is not in the library — sortedSongIds() leaves it out, so no
     list, backup, lesson picker or Music Stand listing ever shows it. Save as…
     is the only way from here into the library. */
  const SANDBOX_ID = 'sandbox';
  const SANDBOX_TITLE = 'Sandbox';
  function isSandbox(id) { return id === SANDBOX_ID; }

  function newSongId() {
    return 'song_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
  }

  /* Anything read from storage, a file or a link goes through here first,
     so the rest of the app never has to wonder what it is holding. */
  function normalizeSong(raw) {
    const src = raw && typeof raw === 'object' ? raw : {};
    const denominator = src.timeSignatureDenominator === 8 ? 8 : 4;
    let numerator = Number(src.timeSignatureNumerator);
    const allowedTop = denominator === 8 ? [6, 9, 12] : [2, 3, 4, 5, 6];
    if (allowedTop.indexOf(numerator) === -1) numerator = denominator === 8 ? 6 : 4;

    const measures = Math.max(1, Math.min(MAX_MEASURES, Math.round(Number(src.measures) || 1)));
    const bpm = Math.max(30, Math.min(260, Math.round(Number(src.bpm) || 92)));

    const tracks = (Array.isArray(src.tracks) ? src.tracks : []).slice(0, MAX_TRACKS).map(t => {
      const source = t && typeof t === 'object' ? t : {};
      const instrument = VI.INSTRUMENT_MAP[source.instrument] ? source.instrument : VI.INSTRUMENT_IDS[0];
      const beats = (Array.isArray(source.beats) ? source.beats : []).map(b => {
        const slots = Math.max(1, Math.min(12, Math.round(Number(b && b.slots) || 2)));
        const cells = Array.isArray(b && b.cells) ? b.cells : [];
        return makeBeat(slots, cells);
      });
      const links = {};
      if (source.links && typeof source.links === 'object') {
        Object.keys(source.links).forEach(k => { if (source.links[k]) links[k] = true; });
      }
      return { id: nextTrackId++, instrument: instrument, muted: !!source.muted,
               beats: beats, links: links };
    });

    return {
      id: src.id || newSongId(),
      title: (typeof src.title === 'string' && src.title.trim()) ? src.title.trim() : 'Untitled ostinato',
      createdAt: Number(src.createdAt) || Date.now(),
      isCustom: src.isCustom !== undefined ? !!src.isCustom : !DEFAULT_SONGS[src.id],
      bpm: bpm,
      timeSignatureNumerator: numerator,
      timeSignatureDenominator: denominator,
      measures: measures,
      tracks: tracks
    };
  }

  function defaultLibrary() {
    const lib = {};
    Object.keys(DEFAULT_SONGS).forEach(id => {
      lib[id] = normalizeSong(Object.assign(songFromDefault(id), { isCustom: false }));
    });
    return lib;
  }

  function getStoredLibrary() {
    let lib = null;
    try {
      const raw = localStorage.getItem(LIBRARY_KEY);
      if (raw) lib = JSON.parse(raw);
    } catch (e) {
      console.error('Could not read the library:', e);
    }
    if (!lib || typeof lib !== 'object' || !Object.keys(lib).length) {
      lib = defaultLibrary();
      saveStoredLibrary(lib);
    }
    return lib;
  }

  function saveStoredLibrary(lib) {
    try {
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(lib));
    } catch (e) {
      console.error('Could not save the library:', e);
      toast('There was no room to save — the browser storage is full');
    }
  }

  /* The user's own work first, newest at the top; the starters keep the
     order they are written in. */
  function sortedSongIds(lib) {
    const mine = [], starters = [];
    Object.keys(lib).forEach(id => {
      if (isSandbox(id)) return;              // scratch work, never a library song
      (DEFAULT_SONGS[id] && !lib[id].isCustom ? starters : mine).push(id);
    });
    mine.sort((a, b) => (lib[b].createdAt || 0) - (lib[a].createdAt || 0));
    const order = Object.keys(DEFAULT_SONGS);
    starters.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    return { mine: mine, starters: starters, all: mine.concat(starters) };
  }

  /* What gets written down: a deep copy, so later edits on screen cannot
     reach back into a record already saved. */
  function snapshot() {
    return {
      id: song.id,
      title: song.title || 'Untitled ostinato',
      bpm: song.bpm,
      timeSignatureNumerator: song.timeSignatureNumerator,
      timeSignatureDenominator: song.timeSignatureDenominator,
      measures: song.measures,
      tracks: song.tracks.map(t => ({
        instrument: t.instrument,
        muted: !!t.muted,
        beats: t.beats.map(b => ({ slots: b.slots, cells: b.cells.slice() })),
        links: Object.assign({}, t.links)
      }))
    };
  }

  function adoptSong(record) {
    song.id = record.id;
    song.title = record.title;
    song.bpm = record.bpm;
    song.timeSignatureNumerator = record.timeSignatureNumerator;
    song.timeSignatureDenominator = record.timeSignatureDenominator;
    song.measures = record.measures;
    song.tracks = record.tracks;
  }

  /* ------------------------------------------------------------------
     AUTO-SAVE

     A library ostinato is sometimes a thing you are building and
     sometimes a thing you are taking apart in front of a class. The
     toggle beside the song chip says which: on, every edit is written
     to the library as it always was; off, nothing on screen reaches
     storage until you say so, and the library keeps the version you
     opened.

     Off when a library ostinato is opened, on for one just made or just
     saved, and absent where the question does not arise: the sandbox
     keeps itself, a lesson always keeps a student's work, and the Music Stand
     is not editing a library.
     ------------------------------------------------------------------ */
  let autoSave = true;
  let savedFingerprint = null;

  /* Key order is not promised anywhere, so a plain stringify would call
     two identical ostinatos different. */
  function stableStringify(value) {
    if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
    if (value && typeof value === 'object') {
      return '{' + Object.keys(value).sort()
        .map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
    }
    return JSON.stringify(value === undefined ? null : value);
  }

  function stateFingerprint() {
    if (!song.id) return null;
    const snap = snapshot();
    delete snap.id;
    delete snap.title;
    return stableStringify(snap);
  }
  function markSaved() { savedFingerprint = stateFingerprint(); }

  function autoSaveOffered() {
    return !EMBEDDED && !lessonMeta && !!song.id && !isSandbox(song.id);
  }
  function autoSaveOn() { return !autoSaveOffered() || autoSave; }

  function hasUnsavedChanges() {
    if (autoSaveOn() || savedFingerprint === null) return false;
    return stateFingerprint() !== savedFingerprint;
  }

  function saveCurrentSong(force) {
    if (!song.id) return;
    /* Auto-save off: the edit stays on screen and nowhere else. Every
       save comes through here — the debounce after an edit, the flush on
       the way out of the page — so this one gate covers the lot.
       `force === true`, not merely truthy: this function is handed
       straight to timers and listeners, whose argument would otherwise
       force a save the user has switched off. */
    if (force !== true && !autoSaveOn()) return;
    const lib = getStoredLibrary();
    const existing = lib[song.id];
    const record = snapshot();
    record.isCustom = existing ? existing.isCustom : !DEFAULT_SONGS[song.id];
    record.createdAt = existing ? existing.createdAt : Date.now();
    lib[song.id] = record;
    saveStoredLibrary(lib);
    markSaved();
  }

  /* Saving on a timer rather than at a dozen call sites: every edit ends
     in render(), so one debounce there covers all of them and cannot be
     forgotten when a new kind of edit is added. */
  let autosaveTimer = null;
  function scheduleAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveCurrentSong, 400);
  }
  function flushAutosave() {
    clearTimeout(autosaveTimer);
    saveCurrentSong();
  }

  const autoSaveToggle = document.getElementById('autosave-toggle');
  const autoSaveLabel  = document.getElementById('autosave-label');
  const ICON_SAVING     = '<path d="M20 6 9 17l-5-5"/>';
  const ICON_NOT_SAVING = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';

  function updateAutoSaveToggle() {
    if (!autoSaveToggle) return;
    const offered = autoSaveOffered();
    autoSaveToggle.hidden = !offered;
    if (!offered) return;
    const on = autoSaveOn();
    autoSaveToggle.classList.toggle('is-off', !on);
    autoSaveToggle.setAttribute('aria-pressed', String(on));
    autoSaveToggle.title = on
      ? 'Auto-save is on: every change is saved to this ostinato. Press to stop saving.'
      : 'Auto-save is off: your changes are not being saved. Press to save them and start saving again.';
    if (autoSaveLabel) autoSaveLabel.textContent = on ? 'Auto-save' : 'Not saving';
    const svg = autoSaveToggle.querySelector('.autosave-icon');
    if (svg) svg.innerHTML = on ? ICON_SAVING : ICON_NOT_SAVING;
  }

  /* Turning it back on is the moment to ask about the work done while it
     was off: save it, or leave it on screen only and stay off. */
  function setAutoSave(on) {
    if (!autoSaveOffered()) return;
    if (on && hasUnsavedChanges()) {
      const title = song.title || 'this ostinato';
      const ok = confirm('Save the changes you have made to \u201c' + title + '\u201d?\n\n'
        + 'OK saves them and turns auto-save on.\n'
        + 'Cancel leaves auto-save off, and \u201c' + title + '\u201d stays as it was saved.');
      if (!ok) { updateAutoSaveToggle(); return; }
      autoSave = true;
      saveCurrentSong(true);
      toast('Saved — auto-save on');
    } else {
      autoSave = !!on;
      if (autoSave) markSaved();
    }
    updateAutoSaveToggle();
    renderLibraryList();
  }

  if (autoSaveToggle) {
    autoSaveToggle.addEventListener('click', () => setAutoSave(!autoSaveOn()));
  }
  window.addEventListener('beforeunload', flushAutosave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushAutosave();
  });

  function rememberActiveSong() {
    try { localStorage.setItem(ACTIVE_ID_KEY, song.id || ''); } catch (e) {}
  }

  /* `options.autoSave` is for an ostinato this very moment made or
     saved — New, Save as…, one that arrived in a link. Opening anything
     else from the library starts with auto-save off, which is the point
     of the whole thing. */
  function openSong(id, options) {
    if (isPlaying) stopPlayback();
    const lib = getStoredLibrary();
    const record = lib[id];
    if (!record) return false;
    adoptSong(normalizeSong(record));
    autoSave = !!(options && options.autoSave);
    rememberActiveSong();
    afterSongChange();
    return true;
  }

  /* Everything the toolbar shows belongs to the song, so all of it is
     refreshed together whenever the song underneath changes. */
  function afterSongChange() {
    seedHostMutes();
    conformAllTracks();
    updateMeterDisplay();
    updateMeasureDisplay();
    closeBpmEditor();
    const readout = document.getElementById('bpm-value');
    if (readout) readout.textContent = String(song.bpm);
    updateSongChip();
    currentPage = 0;
    render();
    syncSettings();
    applyPolicyToShell();
    /* After conforming and drawing, so the baseline is the song as it
       actually sits on screen rather than as it came out of storage. */
    markSaved();
    updateAutoSaveToggle();
  }

  /* The chip says where the work is going: into the sandbox, or into a
     library ostinato (a lesson's exercise, inside a lesson). */
  function updateSongChip() {
    const sandbox = isSandbox(song.id);
    const title = sandbox ? SANDBOX_TITLE : (song.title || 'Untitled ostinato');
    const where = sandbox ? SANDBOX_TITLE : (lessonMeta ? 'Lesson' : 'Library');
    songChipLabel.textContent = title;
    if (songChip) {
      songChip.classList.toggle('is-sandbox', sandbox);
      songChip.title = sandbox
        ? 'Sandbox — scratch work, not saved to your library'
        : where + ': ' + title;
    }
    // the sandbox needs no second line: the word and the dashed edge say it
    if (songChipKicker) { songChipKicker.textContent = where; songChipKicker.hidden = sandbox; }
    updateAutoSaveToggle();
    nowEditingTitle.textContent = sandbox ? SANDBOX_TITLE : title;
    if (nowEditingNote) {
      nowEditingNote.textContent = sandbox
        ? 'Scratch work. It stays here between visits but is not in your library — use Save as… to keep it there.'
        : '';
      nowEditingNote.hidden = !sandbox;
    }
  }

  /* A blank page, not an empty one: two tracks waiting for a rhythm are
     far easier to start from than a bare screen. */
  function blankTracks() {
    return [
      { instrument: 'bass',   beats: [], links: {} },
      { instrument: 'claves', beats: [], links: {} }
    ];
  }

  function freshSandbox() {
    return normalizeSong({
      id: SANDBOX_ID,
      title: SANDBOX_TITLE,
      bpm: 92,
      timeSignatureNumerator: 4,
      timeSignatureDenominator: 4,
      measures: 1,
      isCustom: true,
      createdAt: Date.now(),
      tracks: blankTracks()
    });
  }

  function ensureSandbox() {
    const lib = getStoredLibrary();
    if (!lib[SANDBOX_ID]) {
      lib[SANDBOX_ID] = freshSandbox();
      saveStoredLibrary(lib);
    }
    return SANDBOX_ID;
  }

  function clearSandbox() {
    const lib = getStoredLibrary();
    lib[SANDBOX_ID] = freshSandbox();
    saveStoredLibrary(lib);
    if (song.id === SANDBOX_ID) {
      clearTimeout(autosaveTimer);          // the old one must not be written back
      adoptSong(normalizeSong(lib[SANDBOX_ID]));
      afterSongChange();
    }
  }

  function createSong(title) {
    flushAutosave();
    const record = normalizeSong({
      id: newSongId(),
      title: title,
      bpm: song.bpm,
      timeSignatureNumerator: song.timeSignatureNumerator,
      timeSignatureDenominator: song.timeSignatureDenominator,
      measures: 1,
      isCustom: true,
      createdAt: Date.now(),
      tracks: blankTracks()
    });
    adoptSong(record);
    autoSave = true;
    rememberActiveSong();
    afterSongChange();
    saveCurrentSong(true);
  }

  function saveCopy(title) {
    flushAutosave();
    const copy = snapshot();
    copy.id = newSongId();
    copy.title = title;
    copy.isCustom = true;
    copy.createdAt = Date.now();
    const lib = getStoredLibrary();
    lib[copy.id] = copy;
    saveStoredLibrary(lib);
    adoptSong(normalizeSong(copy));
    autoSave = true;
    rememberActiveSong();
    afterSongChange();
    toast('Saved as “' + title + '”');
  }

  /* The song to land on: what was open last time, else a shared link,
     else the starter. */
  function restoreLastSong() {
    const lib = getStoredLibrary();
    let id = null;
    try { id = localStorage.getItem(ACTIVE_ID_KEY); } catch (e) {}
    if (id && lib[id]) return openSong(id);
    /* Nothing open: the sandbox, not a library ostinato that the first
       edit would quietly change. */
    return openSong(ensureSandbox());
  }


  /* ==================================================================
     SOUND
     ------------------------------------------------------------------
     The kit creates no AudioContext until it is unlocked from a real
     gesture: a context made before one starts suspended, and every
     sound queued up while it is suspended fires at once on resume.
     ================================================================== */

  /* Replaced when the Music Stand embeds this app: it hands over its own context
     and a gain for this side (see the Music Stand BRIDGE below). */
  let kit = VI.createKit();
  let audioUnlocked = false;

  function unlockAudio() {
    if (audioUnlocked) return;
    kit.unlock();
    audioUnlocked = true;
  }
  document.addEventListener('pointerdown', unlockAudio, { once: true });
  document.addEventListener('keydown', unlockAudio, { once: true });

  /* `repeatInterval` lets the kit pick its fast-repeat envelope when hits
     land close together — without it, sixteenths at any speed turn to
     mush. The guiro also needs its stroke choosing from the same figure. */
  function playInstrument(id, intervalMs) {
    const opts = intervalMs > 0 ? kit.optionsForRepeat(id, intervalMs) : {};
    kit.play(id, opts);
  }

  /* The count, when it is switched on. Kept deliberately plain and quiet
     so it sits under the instruments rather than in front of them. */
  function playClick(strong) {
    const ctx = kit.audioContext;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    osc.type = 'square';
    osc.frequency.setValueAtTime(strong ? 1600 : 1050, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(strong ? 0.16 : 0.09, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    osc.connect(gain);
    gain.connect(kit.masterGain || ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  }


  /* ==================================================================
     ROLES — what an inactive slot means

     Ported from Rhythm Poetry's getCircleColor, so the two apps colour
     an identical rhythm identically. The exceptions are deliberate:
     XXOO in a beat of sixteenths is two sixteenths and an eighth REST,
     while XOOO sustains through the whole beat.

     The notation is built from the answer, so a printed rest can never
     appear under a dot coloured as a held note.
     ================================================================== */

  const SIXTEENTH_ROLES = {
    'XXXX': ['active', 'active', 'active', 'active'],
    'OOOO': ['inactive', 'inactive', 'inactive', 'inactive'],
    'XOOO': ['active', 'sustain-16', 'sustain-16', 'sustain-16'],
    'XOXO': ['active', 'sustain-16', 'active', 'sustain-16'],
    'XOOX': ['active', 'sustain-16', 'sustain-16', 'active'],
    'OXOX': ['inactive', 'active', 'sustain-16', 'active'],
    'OOXO': ['inactive', 'inactive', 'active', 'sustain-16'],
    'XXOO': ['active', 'active', 'inactive', 'inactive'],
    'XXOX': ['active', 'active', 'sustain-16', 'active'],
    'XXXO': ['active', 'active', 'active', 'sustain-16'],
    'XOXX': ['active', 'sustain-16', 'active', 'active'],
    'OOXX': ['inactive', 'inactive', 'active', 'active'],
    'OOOX': ['inactive', 'inactive', 'inactive', 'active'],
    'OXOO': ['inactive', 'active', 'sustain-16', 'sustain-16'],
    'OXXO': ['inactive', 'active', 'active', 'sustain-16'],
    'OXXX': ['inactive', 'active', 'active', 'active']
  };

  const COMPOUND_ROLES = {
    'XOO': ['active', 'sustain', 'sustain'],      // dotted quarter
    'XXO': ['active', 'active', 'sustain'],       // eighth + quarter
    'XOX': ['active', 'sustain', 'active'],       // quarter + eighth
    'OXO': ['inactive', 'active', 'sustain']      // eighth rest + quarter
  };

  /* One beat's dot colours, in order. */
  function beatRoles(beat) {
    const n = beat.slots;
    const flags = beat.cells;
    const pat = flags.map(f => f ? 'X' : 'O').join('');

    if (n === 2) {
      // a lone sound on the beat rings on through the second half
      if (flags[0] && !flags[1]) return ['active', 'sustain'];
      return flags.map(f => f ? 'active' : 'inactive');
    }
    if (n === 3 && COMPOUND_ROLES[pat]) return COMPOUND_ROLES[pat].slice();
    if (n === 4 && SIXTEENTH_ROLES[pat]) return SIXTEENTH_ROLES[pat].slice();

    // sextuplets and the like read by the general rule
    return RN.rolesFromFlags(flags).map(r =>
      r === 'note' ? 'active' : r === 'hold' ? 'sustain' : 'inactive');
  }

  function rolesToNotation(colours) {
    return colours.map(c =>
      c === 'active' ? 'note' : c === 'inactive' ? 'rest' : 'hold');
  }


  /* ==================================================================
     SYLLABLES
     ------------------------------------------------------------------
     The counting systems, copied unchanged from Rhythm Poetry 2.0 so an
     identical rhythm is spoken identically in both apps.

     Off by default here. One line of syllables under one rhythm reads
     easily; four tracks of them at once is a wall of text, so the user
     turns them on in Settings when they want them and picks the system
     there too.
     ================================================================== */

  const rhythmSystems = {
    "Simplified Kodály": {
      six: { main: ["Ti", "ti", "ti"], filler: ["ki", "ki", "ki"] },
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ti", "ti"], "G/B": ["-", "ti"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ti", "ti", "ti"], "B/B/G": ["Ti", "ti", "-"], "B/G/B": ["Ti", "-", "ti"], "G/B/G": ["-", "ti", "-"], "G/B/B": ["-", "ti", "ti"], "G/G/B": ["-", "-", "ti"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ti", "-", "ti", "-"], "B/B/B/B": ["Ti", "ki", "ti", "ki"], "G/B/B/B": ["-", "ki", "ti", "ki"], "B/B/B/G": ["Ti", "ki", "ti", "-"], "B/B/G/B": ["Ti", "ki", "-", "ki"], "B/G/B/B": ["Ti", "-", "ti", "ki"], "B/B/G/G": ["Ti", "ki", "-", "-"], "G/B/B/G": ["-", "ki", "ti", "-"], "G/G/B/B": ["-", "-", "ti", "ki"], "G/B/G/B": ["-", "ki", "-", "ki"], "B/G/G/B": ["Ti", "-", "-", "ki"], "G/B/G/G": ["-", "ki", "-", "-"], "G/G/B/G": ["-", "-", "ti", "-"], "G/G/G/B": ["-", "-", "-", "ki"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Beat Centered Kodály": {
      six: { main: ["Ti", "da", "di"], filler: ["ri", "ri", "ri"] },
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ti", "ti"], "G/B": ["-", "ti"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ti", "da", "di"], "B/B/G": ["Ti", "da", "-"], "B/G/B": ["Ti", "-", "di"], "G/B/G": ["-", "da", "-"], "G/B/B": ["-", "da", "di"], "G/G/B": ["-", "-", "di"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ti", "-", "ti", "-"], "B/B/B/B": ["Ti", "ri", "ti", "ri"], "G/B/B/B": ["-", "ri", "ti", "ri"], "B/B/B/G": ["Ti", "ri", "ti", "-"], "B/B/G/B": ["Ti", "ri", "-", "ri"], "B/G/B/B": ["Ti", "-", "ti", "ri"], "B/B/G/G": ["Ti", "ri", "-", "-"], "G/B/B/G": ["-", "ri", "ti", "-"], "G/G/B/B": ["-", "-", "ti", "ri"], "G/B/G/B": ["-", "ri", "-", "ri"], "B/G/G/B": ["Ti", "-", "-", "ri"], "G/B/G/G": ["-", "ri", "-", "-"], "G/G/B/G": ["-", "-", "ti", "-"], "G/G/G/B": ["-", "-", "-", "ri"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Gordon System": {
      six: { main: ["Du", "da", "di"], filler: ["ta", "ta", "ta"] },
      "2": { "B/G": ["Du", "-"], "B/B": ["Du", "de"], "G/B": ["-", "de"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Du", "-", "-"], "B/B/B": ["Du", "da", "di"], "B/B/G": ["Du", "da", "-"], "B/G/B": ["Du", "-", "di"], "G/B/G": ["-", "da", "-"], "G/B/B": ["-", "da", "di"], "G/G/B": ["-", "-", "di"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Du", "-", "-", "-"], "B/G/B/G": ["Du", "-", "de", "-"], "B/B/B/B": ["Du", "ta", "de", "ta"], "G/B/B/B": ["-", "ta", "de", "ta"], "B/B/B/G": ["Du", "ta", "de", "-"], "B/B/G/B": ["Du", "ta", "-", "ta"], "B/G/B/B": ["Du", "-", "de", "ta"], "B/B/G/G": ["Du", "ta", "-", "-"], "G/B/B/G": ["-", "ta", "de", "-"], "G/G/B/B": ["-", "-", "de", "ta"], "G/B/G/B": ["-", "ta", "-", "ta"], "B/G/G/B": ["Du", "-", "-", "ta"], "G/B/G/G": ["-", "ta", "-", "-"], "G/G/B/G": ["-", "-", "de", "-"], "G/G/G/B": ["-", "-", "-", "ta"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Takadimi System": {
      six: { main: ["Ta", "ki", "da"], filler: ["va", "di", "ma"] },
      "2": { "B/G": ["Ta", "-"], "B/B": ["Ta", "di"], "G/B": ["-", "di"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Ta", "-", "-"], "B/B/B": ["Ta", "ki", "da"], "B/B/G": ["Ta", "ki", "-"], "B/G/B": ["Ta", "-", "da"], "G/B/G": ["-", "ki", "-"], "G/B/B": ["-", "ki", "da"], "G/G/B": ["-", "-", "da"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Ta", "-", "-", "-"], "B/G/B/G": ["Ta", "-", "di", "-"], "B/B/B/B": ["Ta", "ka", "di", "mi"], "G/B/B/B": ["-", "ka", "di", "mi"], "B/B/B/G": ["Ta", "ka", "di", "-"], "B/B/G/B": ["Ta", "ka", "-", "mi"], "B/G/B/B": ["Ta", "-", "di", "mi"], "B/B/G/G": ["Ta", "ka", "-", "-"], "G/B/B/G": ["-", "ka", "di", "-"], "G/G/B/B": ["-", "-", "di", "mi"], "G/B/G/B": ["-", "ka", "-", "mi"], "B/G/G/B": ["Ta", "-", "-", "mi"], "G/B/G/G": ["-", "ka", "-", "-"], "G/G/B/G": ["-", "-", "di", "-"], "G/G/G/B": ["-", "-", "-", "mi"], "G/G/G/G": ["-", "-", "-", "-"] }
    },
    "Fruit Rhythms": {
      six: { main: ["Ap", "Cher", "Lem"], filler: ["ple", "ry", "on"] },
      "2": { "B/G": ["Pie", "-"], "B/B": ["Ap", "ple"], "G/B": ["-", "Sweet"], "G/G": ["-", "-"] },
      "3": { "B/G/G": ["Pie", "-", "-"], "B/B/B": ["Pine", "ap", "ple"], "B/B/G": ["Yo", "gurt", "-"], "B/G/B": ["Le", "-", "mon"], "G/B/G": ["-", "Peas", "-"], "G/B/B": ["-", "Spi", "cy"], "G/G/B": ["-", "-", "Sweet"], "G/G/G": ["-", "-", "-"] },
      "4": { "B/G/G/G": ["Pie", "-", "-", "-"], "B/G/B/G": ["Ap", "-", "ple", "-"], "B/B/B/B": ["Wa", "ter", "me", "lon"], "G/B/B/B": ["-", "To", "ma", "to"], "B/B/B/G": ["Co", "co", "nut", "-"], "B/B/G/B": ["Ba", "na", "-", "na"], "B/G/B/B": ["Blue", "-", "ber", "ry"], "B/B/G/G": ["Ki", "wi", "-", "-"], "G/B/B/G": ["-", "Fi", "let", "-"], "G/G/B/B": ["-", "-", "Ber", "ry"], "G/B/G/B": ["-", "Sal", "-", "sa"], "B/G/G/B": ["Cher", "-", "-", "ry"], "G/B/G/G": ["-", "Peas", "-", "-"], "G/G/B/G": ["-", "-", "Sweet", "-"], "G/G/G/B": ["-", "-", "-", "&"], "G/G/G/G": ["-", "-", "-", "-"] }
    }
  };

  const SYLLABLE_SYSTEMS = Object.keys(rhythmSystems);

  /* What is spoken on each slot of one beat. */
  function getChantText(activeStates, system, slots) {
    const pattern = activeStates.map(a => a ? 'B' : 'G').join('/');
    const data = rhythmSystems[system];
    if (!data) return activeStates.map(() => '-');
    if (data[slots] && data[slots][pattern]) return data[slots][pattern].slice();

    /* The finer divisions are spoken rather than tabulated: six to a beat
       reads as three pairs, taking the main syllable from the system's own
       three-to-a-beat set and its filler on the second of each pair, which
       is how Gordon and Takadimi name them. */
    if (slots === 6 && data.six) {
      const main = data.six.main, filler = data.six.filler;
      return activeStates.map((on, i) =>
        on ? (i % 2 === 0 ? main[(i / 2) | 0] : filler[((i - 1) / 2) | 0]) : '-');
    }
    if (data['3'] && slots === 3) {
      const row = data['3']['B/B/B'];
      if (row) return activeStates.map((on, i) => on ? row[i] : '-');
    }
    return activeStates.map(a => a ? '?' : '-');
  }


  /* ==================================================================
     WHAT THE USER HAS ASKED TO SEE

     Kept apart from the song: these follow the person, not the piece, so
     they are remembered across songs and across sessions.
     ================================================================== */

  const VIEW_PREFS_KEY = 'ostinato_builder_view_prefs_v1';

  const view = {
    showSyllables: false,
    syllableSystem: 'Simplified Kodály',
    /* The dots and the chains that join beats are one switch: both are
       the editing layer over the notation, so reading the score means
       putting both away and writing it means bringing both back. */
    showDots: true,
    showBarNumbers: true,
    showBeatNumbers: true,

    /* The dots row lighting up is the quiet way to watch playback, and
       turning the dots off leaves only the sound. This is the other
       option: the beat that is sounding lights under the notation, which
       is the only thing left to look at once the dots are gone. */
    lightNotes: false,

    /* 'pages'  a fixed number of bars at a time, each page scaled to fill
                the screen — a concert score, turned a page at a time
        'scroll' the whole piece on one line at a size you choose */
    layout: 'pages',
    measuresPerPage: 4,
    zoomPct: 100
  };

  const PER_PAGE_CHOICES = [1, 2, 4, 8];
  /* Three ways to read a long ostinato — see LAYING THE SCORE OUT. */
  const LAYOUT_MODES = ['pages', 'systems', 'scroll'];

  function loadViewPrefs() {
    try {
      const raw = JSON.parse(localStorage.getItem(VIEW_PREFS_KEY) || 'null');
      if (raw && typeof raw === 'object') {
        Object.keys(view).forEach(k => { if (raw[k] !== undefined) view[k] = raw[k]; });
        /* Bar and beat numbers used to be one switch, stored as
           showBeatNumbers. Someone who had it off wants both off. */
        if (raw.showBarNumbers === undefined && raw.showBeatNumbers === false) {
          view.showBarNumbers = false;
        }
      }
    } catch (e) {}
    if (SYLLABLE_SYSTEMS.indexOf(view.syllableSystem) === -1) {
      view.syllableSystem = SYLLABLE_SYSTEMS[0];
    }
    if (LAYOUT_MODES.indexOf(view.layout) === -1) view.layout = 'pages';
    if (PER_PAGE_CHOICES.indexOf(view.measuresPerPage) === -1) view.measuresPerPage = 4;
    view.zoomPct = Math.max(40, Math.min(220, Math.round(Number(view.zoomPct) || 100)));
  }

  function saveViewPrefs() {
    try { localStorage.setItem(VIEW_PREFS_KEY, JSON.stringify(view)); } catch (e) {}
  }

  loadViewPrefs();

  /* ==================================================================
     LAYOUT SETTINGS — what is on the page, and what can be written on it
     ------------------------------------------------------------------
     One object, always present, deciding two separate things:

       what the score SHOWS   tappable dots, join buttons, bar and beat
                              numbers, syllables
       what can be BUILT      which meters, how a beat may divide, which
                              shapes each division may take, how far a
                              note may be joined across beats, and which
                              instruments the kit offers

     This is deliberately not the same question as the Layout section of
     Settings, which is about how big the score is drawn and whether it
     turns pages — how you see it, rather than what there is to see.

     It governs the primary user as much as anyone, and that is the
     point: a student link is a copy of the room the teacher is already
     working in, not a second set of switches that apply to someone else.
     Narrow the vocabulary here and every link you send is narrowed with
     it.

     Defaults are everything-on, so an untouched app is the app that
     shipped before any of this existed.
     ================================================================== */

  const LAYOUT_KEY = 'ostinato_builder_layout_v1';
  const LESSON_KEY = 'ostinato_builder_lessons_v1';
  const POLICY_VERSION = 1;

  /* The meters each denominator offers, in the order the numeral cycles —
     the same list the time signature has always walked. */
  const METER_ORDER = { 4: [2, 3, 4, 5, 6], 8: [6, 9, 12] };

  const METERS = {
    simple:   METER_ORDER[4].map(n => n + '/4'),
    compound: METER_ORDER[8].map(n => n + '/8')
  };

  /* The three rungs past a beat's natural division, named the way the
     sheet asks about them and read straight off the tables the +/− pair
     walks. Simple time counts in two and borrows three; compound counts
     in three and borrows two — so one switch serves both families, which
     is why the sheet says "triplets / duplets" rather than a number of
     slots. */
  const DIVIDE_SLOTS = {
    sixteenths: SIXTEENTH_SLOTS,
    tuplets:    { simple: TUPLET_LADDER.simple[0], compound: TUPLET_LADDER.compound[0] },
    subTuplets: { simple: TUPLET_LADDER.simple[1], compound: TUPLET_LADDER.compound[1] }
  };

  /* How far a join may reach. A cap rather than a set of lengths: joins
     are made one beat at a time, so "3 beats but not 2" is a state the
     chain button could never walk to, and offering it would be offering a
     dead switch. 1 means no joining at all. */
  const JOIN_CAP_MAX = 8;          // past any meter this app can count
  const JOIN_LENGTHS = [2, 3, 4];  // the lengths the sheet draws a picture of

  let layout = null;        // filled in below; never null after that
  let layoutLocked = false; // a lesson, or a link sent with the layout locked
  let policy = null;        // the student task, or null outside a lesson
  let lessonMeta = null;    // { title, songIds } while a lesson is open

  /* Declared up here with the other caches rather than beside the code
     that fills them: loadLayout() runs at the bottom of this block and
     clears them. */
  const offersCache = {};
  const patternCache = {};

  /* Every on/off pattern of a beat in that many slots, sound-first: XX
     before XO before OX before OO. This is also the order a dot-tap walks
     when the vocabulary is too small to honour the tap directly, so it
     wants to be musical rather than arbitrary — all sound first, silence
     last. */
  function patternsFor(slots) {
    if (patternCache[slots]) return patternCache[slots];
    const out = [];
    for (let i = (1 << slots) - 1; i >= 0; i--) {
      let p = '';
      for (let b = slots - 1; b >= 0; b--) p += (i & (1 << b)) ? 'X' : 'O';
      out.push(p);
    }
    patternCache[slots] = out;
    return out;
  }

  function flagsToPattern(flags) {
    let p = '';
    for (let i = 0; i < flags.length; i++) p += flags[i] ? 'X' : 'O';
    return p;
  }

  function patternToFlags(pattern) {
    const out = [];
    for (let i = 0; i < pattern.length; i++) out.push(pattern[i] === 'X');
    return out;
  }

  /* Shapes are only worth choosing one at a time while there are few
     enough to take in at a glance. Six to a beat is sixty-four of them,
     well past where a grid helps anyone, so those divisions are offered
     whole or not at all. */
  const CELL_PICK_MAX = 4;
  function cellsArePickable(slots) { return slots <= CELL_PICK_MAX; }

  /* ------------------------------------------------------------------
     The vocabulary, in the groups a musician thinks in.

     Every shape a beat can take is named once, and only once, by the
     group it belongs to — the lists below partition each division rather
     than overlapping it, so a group switch can turn its whole family on
     or off without touching anything else.

     What each four-slot pattern actually engraves, since the names are
     not obvious from the Xs and Os: an X starts a note that runs until
     the next X, so XXOO is a sixteenth then a dotted eighth, and XXOX is
     the sixteenth–eighth–sixteenth that syncopates the beat.

     Longer notes are not here. A half note is not a shape a beat can
     take — it is two beats joined — so it lives in its own group, keyed
     by how many beats the join reaches rather than by slots.
     ------------------------------------------------------------------ */
  const VOCAB_GROUPS = [
    {
      id: 'basic',
      label: 'Quarters, eighths & rests',
      blurb: 'The plain divisions of a beat, and silence.',
      cells: {
        simple:   { 2: ['XX', 'XO', 'OO'], 4: ['XOXO', 'XOOO', 'OOOO'] },
        compound: { 3: 'all' }
      }
    },
    {
      id: 'sixteenths',
      label: 'Sixteenths',
      blurb: 'The four a beat of sixteenths is usually taught with.',
      needs: 'sixteenths',
      cells: {
        simple:   { 4: ['XXXX', 'XOXX', 'XXXO', 'XXOX'] },
        compound: { 6: 'all' }
      }
    },
    {
      id: 'sixteenthsAdvanced',
      label: 'Advanced sixteenths',
      blurb: 'The rest of them — the ones that start on a rest or carry a dot.',
      needs: 'sixteenths',
      cells: {
        simple: { 4: ['XXOO', 'XOOX', 'OXXX', 'OXXO', 'OXOX', 'OXOO', 'OOXX', 'OOOX'] }
      }
    },
    {
      id: 'offbeat',
      label: 'Off-beat eighths',
      blurb: 'A rest on the beat, and the sound after it — what a backbeat is made of.',
      cells: { simple: { 2: ['OX'] } }
    },
    {
      id: 'joins',
      label: 'Halves, dotted halves & wholes',
      blurb: 'Notes made by joining beats together with the chain button.',
      joins: true
    },
    {
      id: 'triplets',
      label: 'Triplets & duplets',
      blurb: 'The other way to divide a beat — three where the beat counts two, or two where it counts three.',
      needs: 'tuplets',
      cells: { simple: { 3: 'all' }, compound: { 2: 'all' } }
    },
    {
      id: 'subTriplets',
      label: 'Subdivided triplets & duplets',
      blurb: 'Those borrowed divisions split again.',
      needs: 'subTuplets',
      cells: { simple: { 6: 'all' }, compound: { 4: 'all' } }
    }
  ];

  /* The shapes a group covers for one family, expanded from 'all'. */
  function groupCells(group, family) {
    const spec = group.cells && group.cells[family];
    if (!spec) return [];
    const out = [];
    Object.keys(spec).forEach(k => {
      const slots = parseInt(k, 10);
      const list = spec[k] === 'all' ? patternsFor(slots) : spec[k];
      out.push({ slots: slots, patterns: list });
    });
    return out;
  }

  function blankLayout() {
    return {
      v: 1,
      meters: { simple: METERS.simple.slice(), compound: METERS.compound.slice() },
      divide: { sixteenths: true, tuplets: true, subTuplets: true },
      /* {} for a division means nothing has been narrowed there. A stored
         list is always shorter than the full one; see pruneLayoutCells. */
      cells: { simple: {}, compound: {} },
      /* How many beats a join may reach across, per family. JOIN_CAP_MAX
         is past any meter this app counts, so it is the unnarrowed
         value; 1 takes the chain button away entirely. */
      joins: { simple: JOIN_CAP_MAX, compound: JOIN_CAP_MAX },
      /* Which instruments the kit offers. null means every one of them —
         an explicit list is always a narrowing. */
      instruments: null
    };
  }

  /* A stored or received layout is filled out rather than rejected, so a
     link that predates a setting still opens, and a setting a future
     version adds is simply not there yet rather than a crash. */
  function normalizeLayout(raw) {
    const L = blankLayout();
    if (!raw || typeof raw !== 'object') return L;

    ['simple', 'compound'].forEach(fam => {
      const list = raw.meters && raw.meters[fam];
      if (Array.isArray(list)) {
        L.meters[fam] = METERS[fam].filter(m => list.indexOf(m) !== -1);
      }
    });
    // Somebody has to be able to count something.
    if (!L.meters.simple.length && !L.meters.compound.length) {
      L.meters.simple = METERS.simple.slice();
    }

    if (raw.divide) {
      Object.keys(L.divide).forEach(k => { L.divide[k] = raw.divide[k] !== false; });
    }

    ['simple', 'compound'].forEach(fam => {
      L.cells[fam] = {};
      const src = raw.cells && raw.cells[fam];
      if (!src || typeof src !== 'object') return;
      Object.keys(src).forEach(k => {
        const slots = parseInt(k, 10);
        const all = patternsFor(slots);
        const list = (src[k] || []).filter(x => all.indexOf(x) !== -1);
        /* Canonical order whatever order it arrived in, so the tap-cycle
           is the same for everyone who opens the link. */
        if (list.length && list.length < all.length) {
          L.cells[fam][slots] = all.filter(x => list.indexOf(x) !== -1);
        }
      });
    });

    if (raw.joins && typeof raw.joins === 'object') {
      ['simple', 'compound'].forEach(fam => {
        const n = parseInt(raw.joins[fam], 10);
        if (!isNaN(n)) L.joins[fam] = Math.max(1, Math.min(JOIN_CAP_MAX, n));
      });
    }

    if (Array.isArray(raw.instruments)) {
      const keep = VI.INSTRUMENT_IDS.filter(id => raw.instruments.indexOf(id) !== -1);
      /* An empty kit is not a narrowing, it is a broken app; and a full
         one is not a narrowing either, so it is stored as absent. */
      L.instruments = (keep.length && keep.length < VI.INSTRUMENT_IDS.length) ? keep : null;
    }

    return L;
  }

  function loadLayout() {
    forgetDivisionOffers();
    let raw = null;
    try { raw = JSON.parse(localStorage.getItem(LAYOUT_KEY) || 'null'); } catch (e) {}
    layout = normalizeLayout(raw);
    layoutLocked = !!(raw && raw.locked);
  }

  function saveLayout() {
    forgetDivisionOffers();
    try {
      pruneLayoutCells(layout);
      const out = JSON.parse(JSON.stringify(layout));
      out.locked = layoutLocked;
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(out));
    } catch (e) {}
  }

  loadLayout();

  /* What travels in a link: the build rules, plus the four on-screen
     switches, which live in the view preferences because that is where
     the rest of the app already reads them. */
  function layoutSnapshot() {
    return {
      layout: JSON.parse(JSON.stringify(layout)),
      show: {
        dots: view.showDots,
        barNumbers: view.showBarNumbers,
        beatNumbers: view.showBeatNumbers,
        syllables: view.showSyllables,
        syllableSystem: view.syllableSystem
      }
    };
  }

  function applyLayoutSnapshot(snap, lock) {
    if (!snap) {
      /* A link with no layout in it still locks, if it said to. The
         alternative is a lesson whose vocabulary is right and whose
         Layout settings sheet opens anyway. */
      if (lock) { layoutLocked = true; saveLayout(); }
      return;
    }
    forgetDivisionOffers();
    layout = normalizeLayout(snap.layout || snap);
    if (snap.show) {
      if (snap.show.dots !== undefined) view.showDots = !!snap.show.dots;
      if (snap.show.beatNumbers !== undefined) view.showBeatNumbers = !!snap.show.beatNumbers;
      /* A link from before the two were split carries one flag for both. */
      const bars = snap.show.barNumbers !== undefined ? snap.show.barNumbers : snap.show.beatNumbers;
      if (bars !== undefined) view.showBarNumbers = !!bars;
      if (snap.show.syllables !== undefined) view.showSyllables = !!snap.show.syllables;
      if (SYLLABLE_SYSTEMS.indexOf(snap.show.syllableSystem) !== -1) {
        view.syllableSystem = snap.show.syllableSystem;
      }
      saveViewPrefs();
    }
    if (lock) layoutLocked = true;
    saveLayout();
  }

  /* ---- the questions the rest of the app asks ---------------------- */

  /* Locked means the Layout Settings sheet cannot be opened — not that
     nothing on it can move. The dots button and the mute badges are
     deliberately outside this: going back and forth with the dots, and
     listening to one instrument on its own, are things a class does
     constantly, and no lesson has a reason to stop them. */
  function layoutEditable() { return !layoutLocked; }

  function familyOf() { return isCompound() ? 'compound' : 'simple'; }

  function divisionEnabledIn(fam, slots) {
    if (slots === NATURAL_SLOTS[fam]) return true;   // a beat has to divide somehow
    const names = Object.keys(DIVIDE_SLOTS);
    for (const name of names) {
      if (DIVIDE_SLOTS[name][fam] === slots) return layout.divide[name] !== false;
    }
    return false;
  }

  /* A division that is switched off has no shapes to narrow, so whatever
     was stored for it is noise — and expensive noise, since six to a beat
     is sixty-four patterns that would otherwise ride along in every link.
     Turning a division back on hands back all of it; narrow it again if
     that is what you want. */
  function pruneLayoutCells(L) {
    ['simple', 'compound'].forEach(fam => {
      Object.keys(L.cells[fam]).forEach(k => {
        if (!divisionEnabledIn(fam, parseInt(k, 10))) delete L.cells[fam][k];
      });
    });
  }

  /* The shapes a beat of this many slots may take, or null for all of
     them. A division with no stored list has not been narrowed. */
  function cellsFor(slots) {
    const list = layout.cells[familyOf()][slots];
    return (Array.isArray(list) && list.length) ? list : null;
  }

  function cellAllowed(flags, slots) {
    const list = cellsFor(slots);
    return !list || list.indexOf(flagsToPattern(flags)) !== -1;
  }

  /* Tapping a dot proposes a new shape for the beat. When the vocabulary
     forbids that shape the beat moves to the next one that is allowed,
     rather than the tap being swallowed — a dead dot is the one thing
     that would make a narrowed app feel broken instead of simple.

     With a full vocabulary the proposal always stands and this is the
     plain toggle it has always been. With a two-shape vocabulary it turns
     into exactly what a first lesson wants: tap the beat, it flips
     between ta and ti-ti. */
  function resolveCell(currentFlags, proposedFlags, slots) {
    if (cellAllowed(proposedFlags, slots)) return proposedFlags;
    const list = cellsFor(slots);
    if (!list || !list.length) return currentFlags.slice();
    const here = list.indexOf(flagsToPattern(currentFlags));
    return patternToFlags(list[(here + 1) % list.length]);
  }

  /* ---- joins ------------------------------------------------------- */

  function joinCap(fam) {
    const n = layout.joins[fam || familyOf()];
    return (typeof n === 'number' && n >= 1) ? n : JOIN_CAP_MAX;
  }

  /* The chain button is there while a join can still reach anywhere. */
  function linkingOffered() { return joinCap() > 1; }

  /* ---- instruments ------------------------------------------------- */

  /* The kit the picker offers, in the kit's own order. Never empty. */
  function instrumentsOffered() {
    if (!layout.instruments || !layout.instruments.length) return VI.INSTRUMENT_IDS.slice();
    const keep = VI.INSTRUMENT_IDS.filter(id => layout.instruments.indexOf(id) !== -1);
    return keep.length ? keep : VI.INSTRUMENT_IDS.slice();
  }

  /* Narrowing the kit never rewrites a track that is already playing
     something the kit no longer lists — see rule two of the README. The
     picker simply shows what is offered, plus whatever this track is on
     now, so its own instrument is never missing from its own picker. */
  function instrumentsOfferedFor(currentId) {
    const list = instrumentsOffered();
    if (currentId && list.indexOf(currentId) === -1) {
      return VI.INSTRUMENT_IDS.filter(id => list.indexOf(id) !== -1 || id === currentId);
    }
    return list;
  }

  function nextOfferedInstrument() {
    const used = song.tracks.map(t => t.instrument);
    const offered = instrumentsOffered();
    return offered.find(id => used.indexOf(id) === -1) || offered[0];
  }

  /* ---- meters ------------------------------------------------------ */

  /* The numerals this denominator offers, in cycling order. */
  function meterCycle(denominator) {
    const fam = denominator === 8 ? 'compound' : 'simple';
    const list = layout.meters[fam];
    return (METER_ORDER[denominator] || [4]).filter(n => list.indexOf(n + '/' + denominator) !== -1);
  }

  function denominatorsOffered() {
    return [4, 8].filter(d => meterCycle(d).length > 0);
  }

  function meterIsFixed() {
    if (!rhythmEditable()) return true;
    return meterCycle(4).length + meterCycle(8).length <= 1;
  }

  /* ---- is a finer division worth reaching? ------------------------- */

  /* Is there anything at this division you cannot already write at the
     beat's natural one?

     This is the question the + and − buttons actually answer, and it is
     not the same as "is this division switched on". Turning off the
     Sixteenths and Advanced sixteenths groups leaves the sixteenth grid
     technically enabled and holding four shapes — but they are the plain
     quarter, the two eighths and the rests, which are already there at
     two to a beat. A + that leads only to what you had is a button that
     does nothing, so it goes. */
  function divisionOffersSomethingNew(fam, slots) {
    const natural = NATURAL_SLOTS[fam];
    if (slots === natural) return true;
    const key = fam + ':' + slots;
    if (offersCache[key] !== undefined) return offersCache[key];
    const answer = familyPictures(fam).some(pic =>
      pictureIsOn(pic, fam) &&
      pic.members.some(m => m.slots === slots) &&
      !pic.members.some(m => m.slots === natural));
    offersCache[key] = answer;
    return answer;
  }

  function forgetDivisionOffers() {
    Object.keys(offersCache).forEach(k => delete offersCache[k]);
  }

  function divisionIsReachable(slots) {
    const fam = familyOf();
    return divisionEnabledIn(fam, slots) && divisionOffersSomethingNew(fam, slots);
  }

  /* Only the rungs of the − ladder that are both switched on and worth
     walking to. */
  function allowedLadder() {
    return tupletLadder().filter(s => divisionIsReachable(s));
  }

  /* ==================================================================
     THE STUDENT TASK

     Null outside a lesson, and then every question below answers the way
     the app has always answered. Nothing here duplicates anything the
     layout already decides: this is only ever about what the student is
     being asked to do with a room that is already furnished.
     ================================================================== */

  /* The two locks the four task types are built from. Everything that
     changes the rhythm asks rhythmEditable(); everything that changes
     which instruments are playing it asks instrumentsEditable(). */
  function rhythmEditable()      { return !policy || !policy.task.rhythmLocked; }
  function instrumentsEditable() { return !policy || !policy.task.instrumentsLocked; }

  function tempoLocked() { return !!policy && policy.tempo.locked; }
  function tempoMin() { return policy ? policy.tempo.min : BPM_MIN; }
  function tempoMax() { return policy ? policy.tempo.max : BPM_MAX; }
  function clampTempo(v) { return Math.max(tempoMin(), Math.min(tempoMax(), v)); }

  /* Adding or removing a bar changes how the piece sounds, so both ask
     the rhythm lock before they ask their own setting. */
  function canAddMeasures() {
    return rhythmEditable() && (!policy || policy.structure.canAdd !== false);
  }
  function canRemoveMeasures() {
    return rhythmEditable() && (!policy || policy.structure.canRemove !== false);
  }
  function maxMeasuresAllowed() {
    const n = policy && policy.structure.maxMeasures;
    return n ? Math.min(MAX_MEASURES, n) : MAX_MEASURES;
  }
  function maxTracksAllowed() {
    const n = policy && policy.structure.maxTracks;
    return n ? Math.min(MAX_TRACKS, n) : MAX_TRACKS;
  }

  function shellAllows(key) { return !policy || policy.shell[key] !== false; }
  function libraryMode() { return policy ? policy.shell.library : 'full'; }

  function systemsOffered() {
    if (!policy || !policy.shell.systems || !policy.shell.systems.length) {
      return SYLLABLE_SYSTEMS.slice();
    }
    return SYLLABLE_SYSTEMS.filter(s => policy.shell.systems.indexOf(s) !== -1);
  }

  function blankPolicy() {
    return {
      v: POLICY_VERSION,
      tempo: { min: 40, max: 240, locked: false },
      structure: { maxMeasures: null, maxTracks: null, canAdd: true, canRemove: true },
      task: { rhythmLocked: false, instrumentsLocked: false, note: '' },
      shell: {
        view: true,        // the Layout half of Settings — pages, scroll, size
        present: true,     // present mode
        picture: true,     // save a picture
        count: true,       // the metronome
        systems: null,     // null = every counting system
        library: 'lesson'  // 'lesson' | 'none'
      }
    };
  }

  function normalizePolicy(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const p = blankPolicy();
    const src = raw;

    if (src.tempo) {
      const lo = parseInt(src.tempo.min, 10);
      const hi = parseInt(src.tempo.max, 10);
      if (!isNaN(lo)) p.tempo.min = Math.max(BPM_MIN, Math.min(BPM_MAX, lo));
      if (!isNaN(hi)) p.tempo.max = Math.max(BPM_MIN, Math.min(BPM_MAX, hi));
      if (p.tempo.min > p.tempo.max) {
        const t = p.tempo.min; p.tempo.min = p.tempo.max; p.tempo.max = t;
      }
      p.tempo.locked = !!src.tempo.locked;
    }

    if (src.structure) {
      const mm = parseInt(src.structure.maxMeasures, 10);
      p.structure.maxMeasures = (isNaN(mm) || mm < 1) ? null : Math.min(MAX_MEASURES, mm);
      const mt = parseInt(src.structure.maxTracks, 10);
      p.structure.maxTracks = (isNaN(mt) || mt < 1) ? null : Math.min(MAX_TRACKS, mt);
      p.structure.canAdd = src.structure.canAdd !== false;
      p.structure.canRemove = src.structure.canRemove !== false;
    }

    if (src.task) {
      p.task.rhythmLocked = !!src.task.rhythmLocked;
      p.task.instrumentsLocked = !!src.task.instrumentsLocked;
      p.task.note = typeof src.task.note === 'string' ? src.task.note.slice(0, 160) : '';
    }

    if (src.shell) {
      ['view', 'present', 'picture', 'count'].forEach(k => {
        p.shell[k] = src.shell[k] !== false;
      });
      if (Array.isArray(src.shell.systems) && src.shell.systems.length) {
        const keep = src.shell.systems.filter(s => SYLLABLE_SYSTEMS.indexOf(s) !== -1);
        p.shell.systems = keep.length ? keep : null;
      }
      p.shell.library = src.shell.library === 'none' ? 'none' : 'lesson';
    }

    return p;
  }

  /* One sentence naming the task, for the strip above the score. The
     teacher's own wording wins; these are only the fallback. */
  const TASK_BLURB = {
    'free':        'Build whatever you like.',
    'rhythms':     'The instruments are set — write a part for each of them.',
    'instruments': 'The rhythms are set — choose which instruments play them.',
    'read':        'Read and play this one.'
  };

  function taskKind() {
    if (!policy) return 'free';
    const r = policy.task.rhythmLocked, i = policy.task.instrumentsLocked;
    if (r && i) return 'read';
    if (i) return 'rhythms';
    if (r) return 'instruments';
    return 'free';
  }

  function taskBlurb() {
    if (policy && policy.task.note) return policy.task.note;
    return TASK_BLURB[taskKind()];
  }



  /* ==================================================================
     PLAYBACK
     ------------------------------------------------------------------
     The sounding timeline is built from the same slot maps the notation
     is drawn from, so a triplet lands where it is printed without any
     special case.

     The instrument library always starts a voice at the context's
     current time — there is no `when` to schedule against — so timing
     comes from self-correcting timeouts anchored to one absolute start.
     Each loop is scheduled a moment before it is due, and every event
     inside it is measured from that loop's own anchor, so nothing
     accumulates drift however long it runs.
     ================================================================== */

  let isPlaying = false;
  let playTimers = [];
  let loopAnchor = 0;

  /* The milliseconds-per-tick the schedule now in flight was built with.
     Kept apart from tickMs() because an edit changes that the instant it is
     made, and reading where the music has got to needs the number the
     running timers were measured against, not the new one. */
  let liveTickMs = 0;

  function tickMs() { return (60000 / song.bpm) / beatTicks(); }

  /* Every sound in one pass of the loop, with how long it is until that
     track's next hit — the kit needs the figure to shape fast repeats. */
  /* Read by group, not by beat: inside a joined run a sound holds over
     the beat line, so a half note is one onset rather than two. Taking
     the onsets from the same colours the notation is built from is what
     keeps the two from ever disagreeing. Each comes with how long it is
     until the track's next hit, round the loop. */
  function trackOnsets(track) {
    const bt = beatTicks();
    const onsets = [];
    trackGroups(track).forEach(group => {
      const colours = groupColours(track, group);
      let at = 0;
      for (let b = group.start; b <= group.end; b++) {
        const beat = track.beats[b];
        const slotTicks = bt / beat.slots;
        for (let i = 0; i < beat.slots; i++) {
          if (colours[at + i] === 'active') onsets.push(b * bt + i * slotTicks);
        }
        at += beat.slots;
      }
    });
    const loopTicks = totalTicks();
    return onsets.map((t, i) => ({
      tick: t,
      gapTicks: (i + 1 < onsets.length ? onsets[i + 1] : onsets[0] + loopTicks) - t
    }));
  }

  function buildTimeline() {
    const events = [];
    const bt = beatTicks();

    song.tracks.forEach((track, ti) => {
      if (track.muted) return;
      trackOnsets(track).forEach(o => {
        events.push({ tick: o.tick, kind: 'note', track: ti, gapTicks: o.gapTicks });
      });
    });

    for (let b = 0; b < totalBeats(); b++) {
      events.push({ tick: b * bt, kind: 'beat', beat: b });
    }

    events.sort((a, b) => a.tick - b.tick);
    return events;
  }

  function fireEvent(ev) {
    if (ev.kind === 'note') {
      const track = song.tracks[ev.track];
      if (track && !track.muted) playInstrument(track.instrument, ev.gapTicks * tickMs());
    } else {
      if (metronomeOn) playClick(ev.beat % beatsPerMeasure() === 0);
      highlightBeat(ev.beat);
    }
  }

  /* `notBefore` is only passed when picking a pass up in the middle of it:
     everything already sounded is skipped and the rest of the pass keeps
     its place. A fresh pass leaves it out and schedules the lot. */
  function scheduleLoop(iteration, events, loopMs, notBefore) {
    const base = loopAnchor + iteration * loopMs;

    events.forEach(ev => {
      const due = base + ev.tick * liveTickMs;
      if (notBefore != null && due <= notBefore) return;
      playTimers.push(setTimeout(() => fireEvent(ev), Math.max(0, due - performance.now())));
    });

    // queue the next pass shortly before it is due
    const handoff = base + loopMs - 90;
    playTimers.push(setTimeout(
      () => { if (isPlaying) scheduleLoop(iteration + 1, events, loopMs); },
      Math.max(0, handoff - performance.now())
    ));
  }

  function startPlayback() {
    unlockAudio();
    stopPlayback();
    const events = buildTimeline();
    const ms = tickMs();
    const loopMs = totalTicks() * ms;
    if (!loopMs) return;

    isPlaying = true;
    liveTickMs = ms;
    loopAnchor = performance.now() + 120;   // a beat to settle before bar 1
    scheduleLoop(0, events, loopMs);
    setPlayGlyph('■', true);
  }

  /* ---- an edit made while it is playing ----

     Every edit used to call startPlayback(), which threw the schedule away
     and began again at bar 1 — so tapping one dot in bar three sent the
     class back to the beginning. This keeps the place instead: it works out
     how far into the pass the music has got, cancels only what has not
     sounded yet, and lays the rebuilt loop back down on the same clock.

     The position is read in ticks rather than milliseconds, which is what
     lets a tempo change take effect from where the music is rather than
     dragging the beat sideways, and lets a piece that just got shorter wrap
     into itself rather than run off the end. */
  function resyncPlayback() {
    if (!isPlaying) return;

    const now = performance.now();
    const newLoopTicks = totalTicks();
    const newTickMs = tickMs();
    if (!newLoopTicks || !newTickMs) { stopPlayback(); return; }

    /* where we are, measured against the clock the running timers used */
    let tick = liveTickMs > 0 ? (now - loopAnchor) / liveTickMs : 0;
    if (!isFinite(tick) || tick < 0) tick = 0;
    tick = tick % newLoopTicks;          // the piece may have changed length

    playTimers.forEach(clearTimeout);
    playTimers = [];

    liveTickMs = newTickMs;
    loopAnchor = now - tick * newTickMs; // tick 0 of the pass we are inside

    scheduleLoop(0, buildTimeline(), newLoopTicks * newTickMs, now);
  }

  function stopPlayback() {
    playTimers.forEach(clearTimeout);
    playTimers = [];
    isPlaying = false;
    liveTickMs = 0;
    clearHighlights();
    setPlayGlyph('▶', false);
  }

  function togglePlayback() {
    if (isPlaying) stopPlayback(); else startPlayback();
  }

  function setPlayGlyph(glyph, playing) {
    playGlyph.textContent = glyph;
    playButton.classList.toggle('playing', playing);
    /* the present-mode bar is the same transport in a different place, so
       it is told at the same moment rather than kept in step afterwards */
    if (presentPlayGlyph) presentPlayGlyph.textContent = glyph;
    if (presentPlayBtn) presentPlayBtn.classList.toggle('playing', playing);
  }

  /* Highlighting is cheap enough to do by class, and redrawing nothing
     means playback never fights with the layout pass. The notes box is
     lit whether or not the setting is on; `body.light-notes` decides
     whether that shows, so the switch costs nothing at play time. */
  let litBeat = -1;
  function highlightBeat(index) {
    if (index === litBeat) return;
    clearHighlights();
    litBeat = index;

    /* Follow the music across a page turn. Only the page changes — the
       score is already drawn, so this costs a transform, not a render. */
    if (isPaged()) {
      const want = pageOfBeat(index);
      if (want !== currentPage) goToPage(want);
    } else if (isSystems()) {
      followBeatDown(index);
    } else {
      followBeatAcross(index);
    }
    document.querySelectorAll('.group[data-beat="' + index + '"] .dots')
      .forEach(el => el.classList.add('playing'));
    document.querySelectorAll('.group[data-beat="' + index + '"] .notes-box')
      .forEach(el => el.classList.add('playing'));
    const r = document.querySelector('.ruler-beat[data-beat="' + index + '"]');
    if (r) r.classList.add('playing');
  }

  function clearHighlights() {
    document.querySelectorAll('.dots.playing').forEach(el => el.classList.remove('playing'));
    document.querySelectorAll('.notes-box.playing').forEach(el => el.classList.remove('playing'));
    document.querySelectorAll('.ruler-beat.playing').forEach(el => el.classList.remove('playing'));
    litBeat = -1;
  }

  /* Systems have no page to turn and nothing to slide: every bar is
     already drawn. Usually every bar is already on screen too, and this
     does nothing at all — it is only when the stack is taller than the
     stage (standalone, where the score is allowed to be too big to fit)
     that the system being played has to be brought into view. */
  function followBeatDown(index) {
    if (stage.scrollHeight <= stage.clientHeight + 2) return;
    const el = grid.querySelector('.group[data-beat="' + index + '"]');
    const system = el && el.closest('.system');
    if (!system) return;
    const top = absOffsetY(system) * gridScale;
    const bottom = top + system.offsetHeight * gridScale;
    if (top < stage.scrollTop || bottom > stage.scrollTop + stage.clientHeight) {
      stage.scrollTo({ top: Math.max(0, top - 12), behavior: 'smooth' });
    }
  }

  /* Scroll across has no pages to turn, so the window is the page: the
     music plays its way over to the right-hand edge and only then is the
     score brought along, a windowful at a time, with the beat that is
     sounding leading the new window. Nudging it by one beat at a time
     would keep the notes sliding under the eye the whole way; this way
     they stand still for a window and then move once.

     Measured off client rects rather than offsetLeft on purpose — #grid
     is transform-scaled to the size the user picked, and the scroll this
     is setting is in screen pixels, not in the grid's own. */
  const SCROLL_LEAD = 24;          // a little air before the leading beat

  function followBeatAcross(index) {
    const el = grid.querySelector('.group[data-beat="' + index + '"]');
    if (!el) return;
    const room = stage.scrollWidth - stage.clientWidth;
    if (room <= 1) return;         // the whole piece is already on screen

    const sr = stage.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    const left  = er.left  - sr.left + stage.scrollLeft;
    const right = er.right - sr.left + stage.scrollLeft;

    const windowRight = stage.scrollLeft + stage.clientWidth;
    /* past the right edge, or behind us because the loop came round */
    if (right <= windowRight && left >= stage.scrollLeft) return;

    const want = Math.max(0, Math.min(room, Math.round(left - SCROLL_LEAD)));
    if (Math.abs(want - stage.scrollLeft) < 1) return;
    stage.scrollTo({ left: want, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  function reduceMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* A single tap on a dot should sound the instrument it belongs to, so
     building a rhythm is audible without pressing play. */
  function auditionTrack(track) {
    unlockAudio();
    if (!track.muted) playInstrument(track.instrument, 0);
  }


  /* ==================================================================
     BUILDING THE PAGE
     ================================================================== */

  const stage       = document.getElementById('stage');
  const grid        = document.getElementById('grid');
  const gridFit     = document.getElementById('grid-fit');
  const emptyNote   = document.getElementById('empty-note');
  const playButton  = document.getElementById('play-button');
  const playGlyph   = document.getElementById('play-glyph');

  /* Notes boxes waiting to be engraved once the grid has been measured. */
  let pendingNotation = [];
  /* Bar-line simile marks, placed in the same pass: they sit on the
     notation's own line, which is not known until the grid is measured. */
  let pendingBarMarks = [];
  /* The + and X on the closing bar line. Placed in the same pass and for
     the same reason: they line up with the notes, so they cannot be put
     anywhere until the notes have been measured. */
  let pendingEndMarks = [];

  /* Set by the Music Stand bridge while a pane is being edited, and null
     at every other time. Every edit in this app ends in render(), which
     makes render() the one place the host can be told without a new kind
     of edit being able to forget to say so. */
  let standAfterRender = null;
  /* Set by the Music Stand bridge: told when a badge in a pane is pressed,
     so the mixer and the pane never show two different answers. */
  let standVoiceMuted = null;

  function icon(path, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 15) + '" height="' + (size || 15) + '">'
         + path + '</svg>';
  }

  const ICON_SOUND_ON  = '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>';
  const ICON_SOUND_OFF = '<path d="M11 5 6 9H2v6h4l5 4V5Z"/><path d="m17 9 4 6"/><path d="m21 9-4 6"/>';
  const ICON_REMOVE    = '<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>';
  const ICON_UP        = '<path d="m6 15 6-6 6 6"/>';
  const ICON_DOWN      = '<path d="m6 9 6 6 6-6"/>';

  function instrumentMeta(id) {
    return VI.INSTRUMENT_MAP[id] || VI.INSTRUMENTS[0];
  }

  /* ---- who is muted -------------------------------------------------
     Standalone, a track's mute is part of the piece and is saved with it.
     In a pane it is not: the Music Stand owns the mutes, because its
     mixer is already showing an answer and the ostinato on the stand is
     a performance rather than a file. So the badge in a pane reads and
     writes the stand's mute, and the piece is left exactly as it was —
     muting there never counts as an edit. The stand seeds itself from
     the piece's own mutes when it opens one, so the two still agree. */
  const hostMutes = {};

  function trackMuted(track, trackIndex) {
    return EMBEDDED ? !!hostMutes[trackIndex] : !!track.muted;
  }

  /* A piece arriving in a pane brings its own mutes with it: they are the
     answer until the stand says otherwise, and the stand reads them back
     out of info() to start its mixer from the same place. */
  function seedHostMutes() {
    if (!EMBEDDED) return;
    Object.keys(hostMutes).forEach(k => { delete hostMutes[k]; });
    song.tracks.forEach((t, i) => { if (t.muted) hostMutes[i] = true; });
  }
  function instrumentImage(id) {
    if (typeof INSTRUMENT_ICONS !== 'undefined' && INSTRUMENT_ICONS[id]) {
      return INSTRUMENT_ICONS[id];
    }
    return 'lib/instruments/' + instrumentMeta(id).image;
  }

  function render() {
    /* An edit made mid-playback rebuilds the page under the music. The beat
       that is sounding has to be lit again afterwards or the marker blinks
       out until the next beat comes round. */
    const wasLit = isPlaying ? litBeat : -1;

    grid.innerHTML = '';
    pendingNotation = [];
    pendingBarMarks = [];
    pendingEndMarks = [];
    litBeat = -1;
    conformAllTracks();

    emptyNote.hidden = song.tracks.length > 0;

    /* Systems are the whole score over again, a few bars at a time, the
       way a printed score runs a line across the page and starts another
       underneath — instrument column and all, because a line of music
       nobody can put a name to is no use. Every other layout is one
       block holding every bar, and the window on to it does the rest. */
    blockRanges().forEach(([from, to], i) => {
      const host = isSystems() ? document.createElement('div') : grid;
      if (host !== grid) {
        host.className = 'system';
        host.dataset.system = String(i);
      }
      host.appendChild(buildRuler(from, to));
      song.tracks.forEach((track, index) => host.appendChild(buildTrack(track, index, from, to)));
      if (host !== grid) grid.appendChild(host);
    });

    syncHeadColumn();
    layoutAndEngrave();
    applyFit();
    if (wasLit >= 0 && wasLit < totalBeats()) highlightBeat(wasLit);
    /* Room for another instrument is a question about the score, so it is
       asked again every time the score is rebuilt rather than only when
       the policy changes. */
    showHide(addTrackBtn, instrumentsEditable() && song.tracks.length < maxTracksAllowed());
    scheduleAutosave();
    if (standAfterRender) standAfterRender();
  }

  /* The instrument column is as wide as the widest head needs to be — a
     long instrument name, or the two small buttons under it, can push it
     past the width CSS asked for. The ruler has nothing in its own head
     to push it, so it has to be told. Measuring from the stylesheet's
     value each time keeps this from ratcheting upward. */
  function syncHeadColumn() {
    grid.style.removeProperty('--head-w');
    let widest = 0;
    grid.querySelectorAll('.track-head').forEach(h => {
      if (h.offsetWidth > widest) widest = h.offsetWidth;
    });
    if (widest) grid.style.setProperty('--head-w', widest + 'px');
  }

  function buildRuler(from, to) {
    from = from || 0;
    if (to == null) to = song.measures;
    const row = document.createElement('div');
    row.className = 'ruler';

    const head = document.createElement('div');
    head.className = 'ruler-head';
    row.appendChild(head);

    const body = document.createElement('div');
    body.className = 'ruler-body';
    const inner = document.createElement('div');
    inner.className = 'ruler-inner';
    body.appendChild(inner);

    const perMeasure = beatsPerMeasure();
    for (let m = from; m < to; m++) {
      const measure = document.createElement('div');
      measure.className = 'ruler-measure';

      const number = document.createElement('span');
      number.className = 'ruler-measure-number';
      number.textContent = String(m + 1);
      measure.appendChild(number);

      for (let b = 0; b < perMeasure; b++) {
        const beatIndex = m * perMeasure + b;
        const cell = document.createElement('div');
        cell.className = 'ruler-beat';
        cell.dataset.beat = String(beatIndex);
        cell.textContent = String(b + 1);
        measure.appendChild(cell);
      }
      inner.appendChild(measure);
      inner.appendChild(dividerSpacer(m === song.measures - 1));
    }

    row.appendChild(body);
    return row;
  }

  /* The ruler has no bar lines of its own, but it has to step over the
     space they take in the tracks below or the numbers drift left. */
  function dividerSpacer(isFinal) {
    const gap = document.createElement('div');
    gap.className = 'ruler-gap';
    gap.style.setProperty('--divider-w', (isFinal ? 19 : 14) + 'px');
    return gap;
  }

  function buildTrack(track, trackIndex, from, to) {
    from = from || 0;
    if (to == null) to = song.measures;
    const row = document.createElement('div');
    row.className = 'track' + (trackMuted(track, trackIndex) ? ' muted' : '');
    row.dataset.track = String(trackIndex);

    row.appendChild(buildTrackHead(track, trackIndex));

    const body = document.createElement('div');
    body.className = 'track-body';
    const inner = document.createElement('div');
    inner.className = 'body-inner';
    body.appendChild(inner);

    /* Worked out once for the whole track: every beat needs to know which
       group it belongs to, and only the first beat of a group carries the
       notation for it. */
    const groupOf = [];
    trackGroups(track).forEach(group => {
      const colours = groupColours(track, group);
      let at = 0;
      for (let b = group.start; b <= group.end; b++) {
        const slots = track.beats[b].slots;
        groupOf[b] = { group: group, colours: colours, offset: at };
        at += slots;
      }
    });

    const perMeasure = beatsPerMeasure();
    /* Kept by measure number, not by position in this block, so every
       lookup below reads the same whether the score is in one piece or
       cut into systems. */
    const measureEls = [], dividerEls = [];
    for (let m = from; m < to; m++) {
      const measure = document.createElement('div');
      measure.className = 'measure';
      measure.dataset.measure = String(m);
      for (let b = 0; b < perMeasure; b++) {
        const beatIndex = m * perMeasure + b;
        measure.appendChild(buildBeat(track, beatIndex, groupOf[beatIndex]));
      }
      inner.appendChild(measure);
      measureEls[m] = measure;

      const bar = document.createElement('div');
      /* The piece's closing line is the piece's, wherever it falls; a
         system that ends mid-piece closes with an ordinary bar line. */
      bar.className = m === song.measures - 1 ? 'final-divider' : 'measure-divider';
      inner.appendChild(bar);
      dividerEls[m] = bar;
    }

    /* How long the piece is belongs to the piece, not to one drum, so the
       pair that changes it is drawn once — on the top line's closing bar
       line, where a reader's eye already goes to find the end. The stepper
       in the toolbar says the same thing in words; this is the same
       control where the music is. Rhythm Poetry carries the identical
       pair on its final bar line. */
    if (trackIndex === 0 && to === song.measures) {
      const closing = dividerEls[song.measures - 1];
      const last = measureEls[song.measures - 1];
      const offer = [];
      if (canAddMeasures() && song.measures < maxMeasuresAllowed()) offer.push('add');
      if (canRemoveMeasures() && song.measures > 1) offer.push('cut');
      offer.forEach(kind => {
        const btn = buildLengthButton(kind);
        closing.appendChild(btn);
        pendingEndMarks.push({ btn: btn, divider: closing, measure: last, row: kind });
      });
    }

    /* The bar-line marks, once both bars either side of a line exist —
       and both in this block: a mark copies the bar before it across the
       line it sits on, and there is no line to sit on between systems. */
    if (rhythmEditable()) {
      for (let m = Math.max(1, from + 1); m < to; m++) {
        if (!repeatableMeasure(track, m)) continue;
        const divider = dividerEls[m - 1];
        const emptyBar = measureEls[m];
        const btn = buildMeasureRepeatButton(track, m);
        btn.addEventListener('mouseenter', () => emptyBar.classList.add('repeat-preview'));
        btn.addEventListener('mouseleave', () => emptyBar.classList.remove('repeat-preview'));
        btn.addEventListener('focus', () => emptyBar.classList.add('repeat-preview'));
        btn.addEventListener('blur', () => emptyBar.classList.remove('repeat-preview'));
        divider.appendChild(btn);
        pendingBarMarks.push({ btn: btn, divider: divider, measure: emptyBar });
      }
    }

    row.appendChild(body);
    return row;
  }

  function buildTrackHead(track, trackIndex) {
    const head = document.createElement('div');
    head.className = 'track-head';

    const meta = instrumentMeta(track.instrument);

    /* The picture carries the row, and mute rides on its corner the way a
       badge rides on an app icon — it belongs to this instrument, so it is
       drawn on it rather than filed underneath with the name. A button
       cannot be nested inside a button, hence the slot around the two. */
    const slot = document.createElement('div');
    slot.className = 'instrument-slot';

    const pick = document.createElement('button');
    pick.className = 'instrument-btn';
    pick.title = 'Change instrument';
    const img = document.createElement('img');
    img.src = instrumentImage(track.instrument);
    img.alt = meta.alt;
    pick.appendChild(img);
    if (instrumentsEditable()) {
      pick.addEventListener('click', () => openInstrumentSheet(trackIndex));
    } else {
      pick.classList.add('fixed');
      pick.title = meta.label;
    }

    const muted = trackMuted(track, trackIndex);
    const mute = document.createElement('button');
    mute.className = 'mini-btn mute-badge' + (muted ? ' muted' : '');
    mute.title = muted ? 'Unmute' : 'Mute';
    mute.setAttribute('aria-label', (muted ? 'Unmute ' : 'Mute ') + meta.label);
    mute.innerHTML = icon(muted ? ICON_SOUND_OFF : ICON_SOUND_ON);
    mute.addEventListener('click', () => {
      if (EMBEDDED) {
        hostMutes[trackIndex] = !muted;
        render();
        if (typeof standVoiceMuted === 'function') standVoiceMuted(trackIndex, !muted);
        return;
      }
      track.muted = !track.muted;
      if (isPlaying) resyncPlayback();   // rebuild the loop without it, in place
      render();
    });

    slot.appendChild(pick);
    slot.appendChild(mute);

    /* Name and bin read as one line: the label, and the one thing you can
       do to it. Centred as a pair, so a short name still sits under the
       middle of the picture. */
    const side = document.createElement('div');
    side.className = 'track-head-side';

    const name = document.createElement('div');
    name.className = 'track-name';
    name.textContent = meta.label;
    name.title = meta.label;

    const remove = document.createElement('button');
    remove.className = 'mini-btn remove';
    remove.title = 'Remove this instrument';
    remove.setAttribute('aria-label', 'Remove ' + meta.label);
    remove.innerHTML = icon(ICON_REMOVE);
    remove.addEventListener('click', () => removeTrack(trackIndex));

    side.appendChild(name);
    /* Both of these change which instruments are on the page, so both go
       when that is the thing the lesson has fixed. Mute does not, and
       stays: hearing one line on its own is how a class reads a score. */
    if (instrumentsEditable()) {
      side.appendChild(remove);
      side.appendChild(buildTrackOrderControls(trackIndex));
    }

    head.appendChild(slot);
    head.appendChild(side);
    return head;
  }

  /* Moving an instrument up or down the score.

     One control at the end of the name's line, an arrow up over an arrow
     down, stacked into a single narrow column so the instrument column
     does not grow by two more buttons' worth. It is kept out of the way
     until it is wanted: the space is always reserved, so revealing it
     cannot shift the row, but it only comes up when the pointer is on
     that instrument (or an arrow has the keyboard focus). Ten rows of
     permanent arrows would be a wall of chevrons on a page whose whole
     point is the rhythm.

     A board has no pointer to hover with, so on a coarse pointer they are
     simply always there — see the media query in the stylesheet. */
  function buildTrackOrderControls(trackIndex) {
    const wrap = document.createElement('div');
    wrap.className = 'track-move';

    const up = document.createElement('button');
    up.className = 'move-btn';
    up.disabled = trackIndex === 0;
    up.title = 'Move this instrument up';
    up.setAttribute('aria-label', 'Move this instrument up');
    up.innerHTML = icon(ICON_UP, 15);
    up.addEventListener('click', () => moveTrack(trackIndex, -1));

    const down = document.createElement('button');
    down.className = 'move-btn';
    down.disabled = trackIndex >= song.tracks.length - 1;
    down.title = 'Move this instrument down';
    down.setAttribute('aria-label', 'Move this instrument down');
    down.innerHTML = icon(ICON_DOWN, 15);
    down.addEventListener('click', () => moveTrack(trackIndex, 1));

    wrap.appendChild(up);
    wrap.appendChild(down);
    return wrap;
  }

  function buildBeat(track, beatIndex, membership) {
    const beat = track.beats[beatIndex];
    const { group, colours, offset } = membership;
    const mine = colours.slice(offset, offset + beat.slots);

    const el = document.createElement('div');
    el.className = 'group';
    el.dataset.beat = String(beatIndex);
    el.style.setProperty('--slots', String(beat.slots));

    /* ---- the dots ---- */
    const dots = document.createElement('div');
    dots.className = 'dots'
      + (group.span > 1 ? ' linked' : '')
      + (view.showDots ? '' : ' dots-hidden');

    if (rhythmEditable()) dots.appendChild(buildSubdivisionControls(track, beatIndex));

    for (let i = 0; i < beat.slots; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot ' + mine[i];
      if (rhythmEditable()) {
        dot.addEventListener('click', () => tapDot(track, beatIndex, i));
      } else {
        dot.classList.add('fixed');
      }
      dots.appendChild(dot);
    }
    el.appendChild(dots);

    if (view.showDots && rhythmEditable() && joinButtonOffered(track, beatIndex)) {
      el.appendChild(buildLinkButton(track, beatIndex));
    }

    /* ---- the notation, drawn after the grid is measured ----
       A joined run is engraved once, in its first beat's box, and spills
       sideways over the beats it covers; the rest keep an empty box so the
       syllables below them stay on the same baseline. */
    const notes = document.createElement('div');
    notes.className = 'notes-box';
    if (group.start === beatIndex) {
      notes._slotMap = groupSlotMap(track, group, colours);
      notes.dataset.span = String(group.span);
      pendingNotation.push(notes);
    }
    const isQuarterRestBeat = group.span === 1 && !beat.cells.some(Boolean);
    const repeatable = (isQuarterRestBeat && rhythmEditable())
      ? repeatableGroup(track, beatIndex) : null;
    if (repeatable) {
      notes.appendChild(buildBeatRepeatButton(track, beatIndex, repeatable.span));
    }
    el.appendChild(notes);

    /* ---- what it is called, if the user asked to see it ---- */
    if (view.showSyllables) {
      el.appendChild(buildSyllables(beat, mine));
    }

    return el;
  }

  /* Tapping a dot asks for one slot to change.

     Inside a joined run the answer is always yes. An O there is the
     sound carrying on rather than a rest, so asking whether the beat's
     shape is in the single-beat vocabulary would be answering a
     different question entirely — the run is governed by how far a join
     may reach, and that was settled when the chain went on.

     Everywhere else the vocabulary decides, and a shape it does not hold
     moves on to the next one it does. A tap that visibly does nothing is
     the one thing that would make a narrowed app feel broken rather than
     simple. */
  function tapDot(track, beatIndex, slot) {
    const beat = track.beats[beatIndex];
    const before = flagsToPattern(beat.cells);

    const proposed = beat.cells.slice();
    proposed[slot] = !proposed[slot];

    const inRun = linkGroup(track, beatIndex).span > 1;
    beat.cells = inRun ? proposed : resolveCell(beat.cells, proposed, beat.slots);

    const changed = flagsToPattern(beat.cells) !== before;
    if (changed && beat.cells.some(Boolean)) auditionTrack(track);
    if (isPlaying) resyncPlayback();
    render();
  }

  /* The chain between this beat and the next is offered while joining
     them would make a run the layout still allows — and always while
     they are already joined, so a run the settings have since outgrown
     can still be taken apart rather than being stranded on the page. */
  function joinButtonOffered(track, leftBeatIndex) {
    if (!canLinkBeats(leftBeatIndex)) return false;
    if (isLinked(track, leftBeatIndex)) return true;
    if (!linkingOffered()) return false;
    const left = linkGroup(track, leftBeatIndex);
    const right = linkGroup(track, leftBeatIndex + 1);
    return (left.span + right.span) <= joinCap();
  }

  /* Syllables are read beat by beat even inside a joined run: the run
     changes how long a note lasts, not what the beat is counted as. A slot
     the run is holding through has nothing to say, and prints a dash. */
  function buildSyllables(beat, colours) {
    const words = document.createElement('div');
    words.className = 'words';

    const spoken = getChantText(beat.cells, view.syllableSystem, beat.slots);
    colours.forEach((role, i) => {
      const container = document.createElement('div');
      container.className = 'word-container';
      const span = document.createElement('span');
      const text = role === 'active' ? (spoken[i] || '-') : '-';
      span.className = 'word' + (text === '-' ? ' rest' : '');
      span.textContent = text;
      container.appendChild(span);
      words.appendChild(container);
    });
    return words;
  }

  /* The chain between one beat and the next. Joining is what puts a half
     note, a dotted half or a whole note within reach — no single beat can
     hold one. */
  const ICON_LINK = '<path d="M9.5 14.5 14.5 9.5"/>'
    + '<path d="M11 7.5 12.4 6a3.6 3.6 0 0 1 5.1 5.1L16 12.6"/>'
    + '<path d="M13 16.5 11.6 18a3.6 3.6 0 0 1-5.1-5.1L8 11.4"/>';

  function buildLinkButton(track, leftBeatIndex) {
    const on = isLinked(track, leftBeatIndex);
    const btn = document.createElement('button');
    btn.className = 'beat-link-btn' + (on ? ' active' : '');
    btn.title = on ? 'Let these two beats read separately'
                   : 'Join these two beats — for half and whole notes';
    btn.innerHTML = icon(ICON_LINK, 14);
    btn.addEventListener('click', () => {
      toggleLink(track, leftBeatIndex);
      if (isPlaying) resyncPlayback();
      render();
    });
    return btn;
  }

  /* The beat-repeat simile mark quick-copy for quarter rests. Copies the
     rhythm that comes before an empty beat into it — the whole of it, run
     and all, not just the beat next door; see repeatableGroup below.

     It is written the way a copyist writes it: hovering the rest swaps the
     rest itself for a simile mark in the same ink, so the beat shows what it
     would say if you clicked. Nothing new appears beside the notation and
     nothing is coloured in — the rest is simply standing in for the mark it
     is about to become.

     Drawn rather than taken from the glyph table: SMuFL's repeat1Bar is not
     in the vendored Leland subset, and the mark is two dots and a slash. The
     path is written in staff spaces about its own centre, so the viewBox can
     be scaled straight off RN.staffSpace() and the mark stays in proportion
     with the notes at any fit. Vertical ends on the slash, not round caps —
     that is what makes it read as engraved rather than as an icon. */
  const SIMILE_VIEWBOX = '-1 -1.1 2 2.2';
  const ICON_SIMILE =
      '<path class="simile-slash" d="M-0.72 0.98 L-0.26 0.98 L0.72 -0.98 L0.26 -0.98 Z"/>'
    + '<circle class="simile-dot" cx="-0.58" cy="-0.62" r="0.24"/>'
    + '<circle class="simile-dot" cx="0.58" cy="0.62" r="0.24"/>';

  /* What the mark would copy, and whether there is room to put it.

     The rhythm before a beat is not always one beat long. A half note, a
     dotted half or a whole note is a run of joined beats, and copying only
     the last beat of one copies the tail of a sound rather than the sound
     itself — which is why the mark used to turn a half note into a quarter.
     So the source is the whole group ending at the beat before this one,
     and the copy needs as many beats as that group covers.

     Room means three things: the beats exist, they are all still empty, and
     they are all in this bar — a join never reaches over a bar line, so a
     run that would straddle one cannot be written. When there is no room
     no mark appears at all. A half note with a single beat left in the bar
     simply does not offer one, which is the answer a copyist would give.

     Returns the source group, or null when there is nothing to offer. */
  function repeatableGroup(track, targetBeatIndex) {
    if (targetBeatIndex <= 0 || targetBeatIndex >= totalBeats()) return null;

    const source = linkGroup(track, targetBeatIndex - 1);

    let sounds = false;
    for (let b = source.start; b <= source.end; b++) {
      if (track.beats[b] && track.beats[b].cells.some(Boolean)) sounds = true;
    }
    if (!sounds) return null;                 // a rest has nothing to repeat

    /* A run the layout would no longer let anyone build is not a run the
       mark may write either. It stays on the page where it already is;
       it just cannot be copied into a fresh beat. */
    if (source.span > joinCap()) return null;

    const last = targetBeatIndex + source.span - 1;
    if (last >= totalBeats()) return null;

    const per = beatsPerMeasure();
    if (Math.floor(last / per) !== Math.floor(targetBeatIndex / per)) return null;

    for (let b = targetBeatIndex; b <= last; b++) {
      const beat = track.beats[b];
      if (!beat || beat.cells.some(Boolean)) return null;
      if (linkGroup(track, b).span !== 1) return null;   // already in a run
    }
    return source;
  }

  function duplicateBeat(track, targetBeatIndex) {
    if (!rhythmEditable()) return;
    const source = repeatableGroup(track, targetBeatIndex);
    if (!source) return;
    if (!track.links) track.links = {};

    /* Beat by beat, because each beat in a run keeps its own division —
       that is what lets one span hold a half note and the next a beat of
       sixteenths — and then the joins go back on, so the copy reads as the
       note it came from rather than as the beats it is made of. */
    for (let k = 0; k < source.span; k++) {
      const from = track.beats[source.start + k];
      track.beats[targetBeatIndex + k] = { slots: from.slots, cells: from.cells.slice() };
      delete track.links[targetBeatIndex + k];
    }
    for (let k = 0; k < source.span - 1; k++) {
      track.links[targetBeatIndex + k] = true;
    }

    auditionTrack(track);
    if (isPlaying) resyncPlayback();
    render();
  }

  /* The same idea a bar at a time. A copyist writes the mark on the bar
     line when a whole bar repeats, so that is where this one lives: on
     the line between a bar that says something and a bar that is silent.

     It is offered per instrument, exactly as the beat mark is — each line
     has its own bar line and answers for its own bar. The rules are the
     beat mark's rules, read over a whole bar: the bar before must sound,
     this bar must be empty from end to end, and no run in the bar before
     may be longer than a join is now allowed to reach. Joins never cross
     a bar line, so a bar is always safe to copy whole. */
  function repeatableMeasure(track, measureIndex) {
    if (measureIndex <= 0 || measureIndex >= song.measures) return false;
    const per = beatsPerMeasure();
    const from = (measureIndex - 1) * per;
    const to = measureIndex * per;

    let sounds = false;
    for (let b = from; b < from + per; b++) {
      const beat = track.beats[b];
      if (!beat) return false;
      if (beat.cells.some(Boolean)) sounds = true;
    }
    if (!sounds) return false;               // a silent bar has nothing to repeat

    for (let b = from; b < from + per; b++) {
      if (linkGroup(track, b).span > joinCap()) return false;
    }

    for (let b = to; b < to + per; b++) {
      const beat = track.beats[b];
      if (!beat || beat.cells.some(Boolean)) return false;
    }
    return true;
  }

  function duplicateMeasure(track, measureIndex) {
    if (!rhythmEditable()) return;
    if (!repeatableMeasure(track, measureIndex)) return;
    if (!track.links) track.links = {};

    const per = beatsPerMeasure();
    const from = (measureIndex - 1) * per;
    const to = measureIndex * per;

    /* Beat by beat, so each keeps its own division, then the joins back
       on — and only the joins inside the bar, which is all a join can
       ever be. */
    for (let k = 0; k < per; k++) {
      const source = track.beats[from + k];
      track.beats[to + k] = { slots: source.slots, cells: source.cells.slice() };
      delete track.links[to + k];
    }
    for (let k = 0; k < per - 1; k++) {
      if (track.links[from + k]) track.links[to + k] = true;
    }

    auditionTrack(track);
    if (isPlaying) resyncPlayback();
    render();
  }

  /* The mark rides on the bar line itself, hidden until the line is
     hovered, and the empty bar's rests step aside while it shows — the
     same trick the beat mark plays with the one rest it stands in for. */
  function buildMeasureRepeatButton(track, measureIndex) {
    const what = 'Repeat the bar before this one';
    const btn = document.createElement('button');
    btn.className = 'measure-repeat-btn';
    btn.title = what;
    btn.setAttribute('aria-label', what);
    btn.innerHTML = '<svg class="simile-svg" viewBox="' + SIMILE_VIEWBOX + '" '
                  + 'aria-hidden="true" focusable="false">' + ICON_SIMILE + '</svg>';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      duplicateMeasure(track, measureIndex);
    });
    return btn;
  }

  /* A bar on, or the last bar off. The same two words the toolbar's
     stepper says, put where the music ends so the length can be changed
     without leaving the score — which is the only way to change it at all
     in the Music Stand, where the toolbar is not there. */
  function buildLengthButton(kind) {
    const add = kind === 'add';
    const what = add ? 'Add a bar' : 'Delete the last bar';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = add ? 'measure-add-btn' : 'measure-cut-btn';
    btn.textContent = add ? '+' : '×';
    btn.title = what;
    btn.setAttribute('aria-label', what);
    /* The bar about to go is shown as going, the way the simile mark shows
       the bar it is about to fill — and on every line, because a bar is
       not one instrument's: taking it away takes it from all of them. */
    if (!add) {
      const mark = on => grid.classList.toggle('cutting', on);
      ['mouseenter', 'focus'].forEach(t => btn.addEventListener(t, () => mark(true)));
      ['mouseleave', 'blur'].forEach(t => btn.addEventListener(t, () => mark(false)));
    }
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (add) {
        if (!canAddMeasures() || song.measures >= maxMeasuresAllowed()) return;
        song.measures++;
      } else {
        if (!canRemoveMeasures() || song.measures <= 1) return;
        song.measures--;
      }
      afterLengthChange();
    });
    return btn;
  }

  /* On the closing bar line, stacked: + on the line the notes sit on, ×
     under it in the room between this line and the next instrument. The
     sizes are in staff spaces, like every other mark, so the pair grows
     and shrinks with the notes instead of swelling on a small score. */
  function placeEndMarks(sizeH, boxH) {
    if (!pendingEndMarks.length) return;
    const SS = RN.staffSpace(sizeH);
    /* about the size of a link button — chrome beside the notes, not a
       third voice on the staff */
    const size = Math.round(SS * 1.3);
    pendingEndMarks.forEach(mark => {
      const box = mark.measure.querySelector('.notes-box');
      if (!box) return;
      const line = (absOffsetY(box) - absOffsetY(mark.divider)) + boxH - SS * 1.70;
      mark.btn.style.left = Math.round(mark.divider.offsetWidth / 2) + 'px';
      mark.btn.style.top = Math.round(mark.row === 'add' ? line : line + size + SS * 0.3) + 'px';
      mark.btn.style.width = size + 'px';
      mark.btn.style.height = size + 'px';
      mark.btn.style.fontSize = Math.round(size * 0.62) + 'px';
    });
  }

  const SPAN_WORDS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

  function buildBeatRepeatButton(track, beatIndex, span) {
    const what = span > 1
      ? 'Repeat the ' + (SPAN_WORDS[span] || span) + ' beats before this one'
      : 'Repeat the beat before this one';
    const btn = document.createElement('button');
    btn.className = 'beat-repeat-btn';
    btn.title = what;
    btn.setAttribute('aria-label', what);
    btn.innerHTML = '<svg class="simile-svg" viewBox="' + SIMILE_VIEWBOX + '" '
                  + 'aria-hidden="true" focusable="false">' + ICON_SIMILE + '</svg>';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      duplicateBeat(track, beatIndex);
    });
    return btn;
  }

  /* + moves this beat to its sixteenths and back; − walks the opposite
     feel — a triplet, then a sextuplet — and then off again.

     Either may be missing. A button is drawn when there is somewhere
     worth going with it: not merely when the division is switched on,
     but when something can be written there that cannot already be
     written at the plain division. Switch off Sixteenths and Advanced
     sixteenths and the four-slot grid still holds the plain quarter, the
     two eighths and the rests — all of which are already reachable at
     two to a beat — so a + leading to them leads nowhere and goes.

     The exception is the beat that is already up there. A rhythm written
     before the settings narrowed is never rewritten, so the button that
     walks it back down stays whatever the vocabulary now says; losing it
     would strand the beat at a division nothing else can reach. */
  function buildSubdivisionControls(track, beatIndex) {
    const wrap = document.createElement('div');
    wrap.className = 'subdivision-controls';

    const beat = track.beats[beatIndex];
    const plain = defaultSubdivision();
    const sixteenth = sixteenthSubdivision();
    const ladder = allowedLadder();
    const onSixteenth = beat.slots === sixteenth;
    const onLadder = tupletLadder().indexOf(beat.slots) !== -1;

    if (divisionIsReachable(sixteenth) || onSixteenth) {
      const plus = document.createElement('button');
      plus.className = 'subdivision-btn' + (onSixteenth ? ' active' : '');
      plus.textContent = '+';
      plus.title = onSixteenth ? 'Back to the plain division' : 'Divide this beat again';
      plus.addEventListener('click', () => {
        changeBeatSlots(track, beatIndex, onSixteenth ? plain : sixteenth);
      });
      wrap.appendChild(plus);
    }

    if (ladder.length || onLadder) {
      const rung = ladder.indexOf(beat.slots);
      const minus = document.createElement('button');
      minus.className = 'subdivision-btn' + (onLadder ? ' active' : '');
      minus.textContent = '−';
      minus.title = onLadder && rung === -1
        ? 'Back to the plain division'
        : 'The other feel for this beat';
      minus.addEventListener('click', () => {
        /* Off the allowed ladder altogether — either at the plain
           division or stranded on a rung nobody may reach any more —
           step on at the bottom, or home if there is no ladder left. */
        const next = rung === -1 ? (ladder.length ? ladder[0] : plain)
                   : rung + 1 < ladder.length ? ladder[rung + 1]
                   : plain;
        changeBeatSlots(track, beatIndex, next);
      });
      wrap.appendChild(minus);
    }

    return wrap;
  }

  /* Re-dividing a beat moves the sounds it holds onto a different grid,
     and where they land is not the app's choice — remapCells keeps each
     one where it was. So the shape that arrives may be one the narrowed
     vocabulary does not hold. Nudge it to the nearest one that is,
     rather than leaving a beat nobody could have built by tapping. */
  function changeBeatSlots(track, beatIndex, slots) {
    if (!rhythmEditable()) return;
    setBeatSlots(track, beatIndex, slots);

    const beat = track.beats[beatIndex];
    if (linkGroup(track, beatIndex).span === 1 && !cellAllowed(beat.cells, beat.slots)) {
      beat.cells = resolveCell(beat.cells, beat.cells, beat.slots);
    }

    if (isPlaying) resyncPlayback();
    render();
  }


  /* ==================================================================
     SIZING THE GRID, THEN PRINTING THE RHYTHM

     Widths have to be settled before the notes are drawn, because the
     notes are placed on the dots' measured positions. And because the
     tracks share a column grid, a beat is as wide as the widest any
     one track needs it to be — which is how sixteenths in one track
     push the quarters above them apart rather than sliding out of line.
     ================================================================== */

  function noteBoxHeight() {
    const v = parseFloat(getComputedStyle(grid).getPropertyValue('--note-h'));
    return v || 62;
  }

  /* offsetLeft ignores CSS transforms; getBoundingClientRect does not.
     The grid is scaled to fit, so the sum of offsets is the honest
     answer and the rect is not. */
  function absOffsetX(el) {
    let x = 0;
    while (el) { x += el.offsetLeft; el = el.offsetParent; }
    return x;
  }

  /* #grid is transform-scaled to fit, so vertical positions are walked
     the same way as horizontal ones rather than read off a rect. */
  function absOffsetY(el) {
    let y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }

  /* The next beat's box. Joins never cross a bar line, so in practice the
     next box is always the sibling; the step out of the `.measure` element
     is there so this keeps working if a run ever is allowed to. */
  function nextGroupEl(el) {
    if (el.nextElementSibling && el.nextElementSibling.classList.contains('group')) {
      return el.nextElementSibling;
    }
    const measure = el.parentElement;
    let after = measure && measure.nextElementSibling;
    while (after && !after.classList.contains('measure')) after = after.nextElementSibling;
    return after ? after.querySelector('.group') : null;
  }

  function placeBarMarks(sizeH, boxH) {
    if (!pendingBarMarks.length) return;
    const SS = RN.staffSpace(sizeH);
    for (const mark of pendingBarMarks) {
      const box = mark.measure.querySelector('.notes-box');
      if (!box) continue;
      /* the line the rests sit on, measured from the bar line's own top */
      const top = (absOffsetY(box) - absOffsetY(mark.divider)) + boxH - SS * 1.70;
      mark.btn.style.left = Math.round(mark.divider.offsetWidth / 2) + 'px';
      mark.btn.style.top = Math.round(top) + 'px';
      /* sized in staff spaces, like the beat mark, so it grows with the
         notes; the hit area is wider than the line is thin */
      mark.btn.style.width = Math.round(SS * 3.6) + 'px';
      mark.btn.style.height = Math.round(SS * 4.0) + 'px';
      const svg = mark.btn.firstElementChild;
      if (svg) {
        svg.style.width = (SS * 2.6) + 'px';
        svg.style.height = (SS * 2.86) + 'px';
      }
    }
  }

  function layoutAndEngrave() {
    if (!pendingNotation.length) return;
    const sizeH = noteBoxHeight();

    /* If any beat anywhere carries a tuplet number, every note box on the
       page grows by the same amount. The notes keep their size — the room
       is added above them, where the numeral goes — and giving every box
       the same height keeps the tracks evenly spaced. */
    let extra = 0;
    for (const box of pendingNotation) {
      const map = box._slotMap;
      if (map && map.tuplets && map.tuplets.length) { extra = RN.notationHeadroom(sizeH); break; }
    }
    grid.style.setProperty('--note-extra', extra + 'px');
    const boxH = sizeH + extra;

    /* ---- read: how wide does each beat need to be? ----
       A column is as wide as the widest thing that has to sit in it: the
       dot, the syllable spoken on it, or the room the notation asks for —
       a lone eighth needs space for its flag to curl into before the next
       notehead. A beat is then as wide as the hungriest track needs it. */
    const need = Array.from({ length: totalBeats() }, () => 0);

    /* A joined run is one piece of notation spread over several beats, so
       its slot width has to come from the run as a whole and then be shared
       out; asking each beat separately would let the run's own beats
       disagree about how wide a slot is, and the beam would not line up. */
    for (const box of pendingNotation) {
      const el = box.closest('.group');
      if (!el) continue;
      const startBeat = Number(el.dataset.beat);
      const span = Number(box.dataset.span || 1);

      let slotW = Math.max(COLUMN_MIN, RN.minSlotWidth(box._slotMap, boxH));

      /* every syllable under this run, beat by beat */
      let target = el;
      for (let k = 0; k < span && target; k++) {
        target.querySelectorAll('.words .word').forEach(w => {
          slotW = Math.max(slotW, w.offsetWidth + WORD_PAD);
        });
        target = nextGroupEl(target);
      }

      target = el;
      for (let k = 0; k < span && target; k++) {
        const slots = Number(target.style.getPropertyValue('--slots')) || 1;
        const width = slots * slotW + GUTTER_L + GUTTER_R + BORDER_PAD;
        const b = startBeat + k;
        if (width > need[b]) need[b] = width;
        target = nextGroupEl(target);
      }
    }

    /* ---- write: commit them, the same width in every track ---- */
    grid.querySelectorAll('.group').forEach(g => {
      g.style.setProperty('--beat-w', need[Number(g.dataset.beat)] + 'px');
    });
    grid.querySelectorAll('.ruler-beat').forEach(cell => {
      cell.style.width = need[Number(cell.dataset.beat)] + 'px';
    });

    /* ---- read again, now the grid is final, and draw ---- */
    for (const box of pendingNotation) {
      const el = box.closest('.group');
      if (!el) continue;
      const span = Number(box.dataset.span || 1);

      /* the dots of every beat the run covers, in order */
      const centres = [];
      let target = el;
      for (let k = 0; k < span && target; k++) {
        target.querySelectorAll('.dots .dot').forEach(d => {
          centres.push(absOffsetX(d) + d.offsetWidth / 2);
        });
        target = nextGroupEl(target);
      }
      if (!centres.length) continue;

      const colW = centres.length > 1 ? centres[1] - centres[0] : COLUMN_MIN;
      const left = centres[0] - colW / 2;
      const width = (centres[centres.length - 1] + colW / 2) - left;

      const map = box._slotMap;
      box.insertAdjacentHTML('beforeend', RN.engrave({
        roles: map.roles,
        slotTicks: map.slotTicks,
        slotBeat: map.slotBeat,
        slotSubGroup: map.slotSubGroup,
        tuplets: map.tuplets,
        slotCentres: centres.map(c => c - left),
        width: width,
        sizeHeight: sizeH,
        height: boxH
      }));
      box.lastElementChild.style.left = (left - absOffsetX(box)) + 'px';

      /* The simile mark stands exactly where the rest it replaces stands:
         on the rest's slot, at the quarter rest's own centre — noteY less
         one staff space, which is REST_CENTRE.restQuarter in the engine. */
      const repeatBtn = box.querySelector('.beat-repeat-btn');
      if (repeatBtn) {
        const cx = centres.length ? (centres[0] - absOffsetX(box)) : (box.offsetWidth / 2);
        const SS = RN.staffSpace(sizeH);
        const cy = boxH - SS * 1.70;
        repeatBtn.style.left = Math.round(cx) + 'px';
        repeatBtn.style.top = Math.round(cy) + 'px';
        /* sized in staff spaces so the mark grows and shrinks with the notes;
           the hit area is wider than the mark so the rest is easy to hover */
        repeatBtn.style.width = Math.round(SS * 3.2) + 'px';
        repeatBtn.style.height = Math.round(SS * 3.6) + 'px';
        const svg = repeatBtn.firstElementChild;
        if (svg) {
          svg.style.width = (SS * 2.2) + 'px';
          svg.style.height = (SS * 2.42) + 'px';
        }
      }
    }

    placeBarMarks(sizeH, boxH);
    placeEndMarks(sizeH, boxH);
  }


  /* ==================================================================
     LAYING THE SCORE OUT

     Two ways to read a long ostinato, and the difference is only ever
     which bars are in the window and how big they are drawn:

       Pages   a fixed number of bars at a time, the page scaled to fill
               the screen — a concert score, turned a page at a time. The
               scale comes from the widest page, not from the page being
               looked at, so turning a page does not change the note size.

       Systems a fixed number of bars to a line, and the lines stacked
               down the page — the same cut as Pages, but shown all at
               once instead of turned. A score of eight instruments is a
               tall, narrow thing and a screen is a wide, short one; this
               is how the two are made to meet. It is also the only
               layout whose shape can be chosen, which is what lets the
               Music Stand ask for a score that fits the pane it has.

       Scroll  the whole piece on one line at a size the user picks, and
               the stage scrolls sideways.

     Pages and Scroll are the same machinery: every track's bars live in
     .body-inner, .track-body is the window onto it, and a page is brought
     into view by sliding the inner element. Sliding is a transform, so it
     never moves anything the engraver measured with offsetLeft. Systems
     needs no window at all — each block is simply built, and drawn, in
     full.
     ================================================================== */

  const FIT_MIN = 0.25;
  const FIT_MAX = 1.8;

  let currentPage = 0;
  /* What applyLayout() last drew the score at. Anything measuring the
     laid-out grid against the stage has to multiply by it: #grid is
     transform-scaled, so offsets read off it are in unscaled pixels. */
  let gridScale = 1;

  /* Pages and systems are the same cut of the piece — so many bars to a
     block — and differ only in what is done with the blocks: pages show
     one and turn, systems show them all, stacked. Everything that counts
     blocks is therefore shared. */
  function isPaged()   { return view.layout === 'pages'; }
  function isSystems() { return view.layout === 'systems'; }
  function inBlocks()  { return isPaged() || isSystems(); }

  function measuresPerPage() {
    return inBlocks()
      ? Math.min(view.measuresPerPage, Math.max(1, song.measures))
      : Math.max(1, song.measures);
  }

  function pageCount() {
    return Math.max(1, Math.ceil(song.measures / measuresPerPage()));
  }

  /* The blocks as measure ranges: [from, to). One block holding the whole
     piece when the layout does not cut it up. */
  function blockRanges() {
    const per = measuresPerPage();
    const out = [];
    for (let m = 0; m < song.measures; m += per) {
      out.push([m, Math.min(song.measures, m + per)]);
    }
    return out.length ? out : [[0, song.measures]];
  }

  function pageOfMeasure(m) {
    return Math.min(pageCount() - 1, Math.floor(m / measuresPerPage()));
  }

  function pageOfBeat(beatIndex) {
    return pageOfMeasure(Math.floor(beatIndex / beatsPerMeasure()));
  }

  /* Where each page starts and how wide it is, read off the laid-out bars
     rather than added up from the widths we asked for — dividers, borders
     and the odd rounded pixel all land in here for free. */
  function pageGeometry() {
    const inner = grid.querySelector('.body-inner') || grid.querySelector('.ruler-inner');
    if (!inner) return null;

    const measures = [...inner.children].filter(el => el.classList.contains('measure'));
    if (!measures.length) return null;

    const per = measuresPerPage();
    const total = inner.scrollWidth;
    const pages = [];
    for (let p = 0; p < pageCount(); p++) {
      const first = measures[p * per];
      if (!first) break;
      const nextFirst = measures[(p + 1) * per];
      const left = first.offsetLeft;
      pages.push({ left: left, width: (nextFirst ? nextFirst.offsetLeft : total) - left });
    }
    return pages.length ? pages : null;
  }

  function applyLayout() {
    grid.style.transform = 'none';
    gridFit.style.width = '';
    gridFit.style.height = '';

    const windows = [...grid.querySelectorAll('.track-body, .ruler-body')];
    const inners  = [...grid.querySelectorAll('.body-inner, .ruler-inner')];
    windows.forEach(w => { w.style.width = ''; });
    inners.forEach(i => { i.style.transform = 'none'; });

    /* The content box of #grid-fit — clientWidth still counts the side
       padding, and fitting to that pushes the final bar line off the edge. */
    const pad = getComputedStyle(gridFit);
    const available = gridFit.clientWidth
      - parseFloat(pad.paddingLeft) - parseFloat(pad.paddingRight);
    if (available <= 0) return;

    /* A page should be a page: wide enough to read, but not so tall that
       the last instrument falls off the bottom. Below HEIGHT_FLOOR the
       cure is worse than the illness — ten tracks shrunk to fit a laptop
       would be unreadable — so past that point the stage scrolls instead. */
    /* Embedded in the Music Stand the pane is sized by the user, beside a poem,
       and the whole point is that both stay on screen — so there the
       score shrinks as far as it must rather than scrolling. */
    const HEIGHT_FLOOR = EMBEDDED ? FIT_MIN : 0.55;
    /* #grid-fit's own padding has to come off as well as the stage's.
       Left in, the score is fitted to a height it then adds 12px to, and
       the stage grows a scrollbar for those 12px — which is exactly what
       a stand promising both scores fit on one screen must not do. It is
       the height twin of the `available` note above. */
    const stagePad = getComputedStyle(stage);
    const availableH = stage.clientHeight
      - parseFloat(stagePad.paddingTop) - parseFloat(stagePad.paddingBottom)
      - parseFloat(pad.paddingTop) - parseFloat(pad.paddingBottom)
      - (pager.hidden ? 0 : 44);
    const naturalH = grid.scrollHeight;
    const heightFit = naturalH > 0 && availableH > 0
      ? Math.max(HEIGHT_FLOOR, availableH / naturalH) : Infinity;

    const headW = parseFloat(getComputedStyle(grid).getPropertyValue('--head-w')) || 0;
    const pages = isPaged() ? pageGeometry() : null;
    const paging = isPaged() && pages && pages.length > 0;

    let scale;
    if (isSystems()) {
      /* Nothing is hidden, so the whole stack has to fit: as wide as the
         widest system and as tall as all of them together. The same two
         limits as a page, read off the score as it stands. */
      scale = Math.max(FIT_MIN, Math.min(FIT_MAX, available / grid.scrollWidth, heightFit));
    } else if (paging) {
      currentPage = Math.max(0, Math.min(currentPage, pages.length - 1));
      /* The size comes from the widest page, not from the page being
         looked at, so turning to a sparser page does not blow the notes up
         — the same reason engraving keeps note size fixed and varies only
         the spacing. */
      const widest = pages.reduce((w, p) => Math.max(w, p.width), 1);
      scale = Math.max(FIT_MIN, Math.min(FIT_MAX, available / (headW + widest), heightFit));

      /* Each window is its own page wide, though. Sizing them all to the
         widest lets a narrow page show a slice of the bar after it. */
      const page = pages[currentPage];
      windows.forEach(w => { w.style.width = Math.floor(page.width) + 'px'; });
      const offset = page.left;
      inners.forEach(i => { i.style.transform = 'translateX(' + (-offset) + 'px)'; });
    } else {
      scale = Math.max(FIT_MIN, Math.min(FIT_MAX, view.zoomPct / 100));
    }

    gridScale = scale;
    grid.style.transform = 'scale(' + scale + ')';

    /* A transform does not change the box the page is laid out in, so the
       scrollable area has to be told what the grid now occupies. Everything
       here is border-box, so #grid-fit's own padding has to be added back:
       set to the bare scaled width it squeezes its content box by 36px and
       the final bar line lands outside it again. */
    gridFit.style.width = Math.ceil(grid.scrollWidth * scale
      + parseFloat(pad.paddingLeft) + parseFloat(pad.paddingRight)) + 'px';
    gridFit.style.height = Math.ceil(grid.scrollHeight * scale
      + parseFloat(pad.paddingTop) + parseFloat(pad.paddingBottom)) + 'px';

    updatePager(paging ? pages.length : 1, paging);
  }

  /* Kept for the places that only ever wanted the size settled. */
  function applyFit() { applyLayout(); }

  /* ---- what shapes this piece can be drawn in ----
     A host with a pane to fill needs to know more than how big this score
     is: it needs to know what else it could be. Every number of bars to a
     line is a different shape — four bars across is a wide, short thing
     and one bar across is a tall, narrow one — and the right one depends
     entirely on the room, which only the host can see.

     Worked out from the score as it stands rather than by drawing each
     one: a bar's width and a block's height are already on the page, and
     a bar is the same width whichever line it lands on, because widths
     are settled per beat across the whole piece. */
  const SYSTEM_GAP = 26;   /* must match `.system + .system` in the stylesheet */

  function measureAdvances() {
    const adv = [];
    for (let m = 0; m < song.measures; m++) {
      const el = grid.querySelector('.measure[data-measure="' + m + '"]');
      if (!el) { adv[m] = 0; continue; }
      const bar = el.nextElementSibling;
      adv[m] = el.offsetWidth + (bar ? bar.offsetWidth : 0);
    }
    return adv;
  }

  function shapeOptions() {
    if (!song.tracks.length || !song.measures) return [];
    const headW = parseFloat(getComputedStyle(grid).getPropertyValue('--head-w')) || 0;
    const adv = measureAdvances();
    if (!adv.length) return [];
    /* one block's height: a system when there are systems, the whole grid
       when the piece is in one piece — either way, a ruler and every track */
    const blockH = (grid.querySelector('.system') || grid).scrollHeight;
    if (!blockH) return [];

    const choices = PER_PAGE_CHOICES.filter(n => n < song.measures);
    choices.push(song.measures);

    return choices.map(per => {
      let widest = 0, blocks = 0;
      for (let m = 0; m < song.measures; m += per) {
        let w = 0;
        for (let k = m; k < Math.min(song.measures, m + per); k++) w += adv[k];
        widest = Math.max(widest, w);
        blocks++;
      }
      return {
        n: per,
        w: headW + widest,
        h: blockH * blocks + SYSTEM_GAP * (blocks - 1)
      };
    });
  }

  let fitTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(fitTimer);
    /* The head column has to be re-measured, not just re-fitted: crossing
       the small-screen breakpoint changes the size of everything in it,
       and --head-w is an inline value left over from the last render. */
    fitTimer = setTimeout(() => { syncHeadColumn(); applyLayout(); }, 90);
  });


  /* ---- turning pages ---- */

  const pager     = document.getElementById('pager');
  const pageLabel = document.getElementById('page-label');
  const pagePrev  = document.getElementById('page-prev');
  const pageNext  = document.getElementById('page-next');

  function updatePager(count, paging) {
    /* Embedded, the Music Stand turns the pages as it plays; a pager nobody can
       click would only take height from the score. */
    pager.hidden = EMBEDDED || !paging || count < 2;
    pageLabel.textContent = 'Page ' + (currentPage + 1) + ' of ' + count;
    pagePrev.disabled = currentPage <= 0;
    pageNext.disabled = currentPage >= count - 1;
  }

  function goToPage(index) {
    const count = pageCount();
    const next = Math.max(0, Math.min(index, count - 1));
    if (next === currentPage) return;
    currentPage = next;
    applyLayout();
  }

  pagePrev.addEventListener('click', () => goToPage(currentPage - 1));
  pageNext.addEventListener('click', () => goToPage(currentPage + 1));


  /* ==================================================================
     TRACKS: ADDING, REMOVING, CHANGING INSTRUMENT
     ================================================================== */

  const MAX_TRACKS = 10;

  function addTrack() {
    if (!instrumentsEditable()) return;
    if (song.tracks.length >= maxTracksAllowed()) {
      const n = maxTracksAllowed();
      toast(n === 1 ? 'One instrument is the limit here'
                    : n + ' instruments is the limit');
      return;
    }
    const track = makeTrack(nextOfferedInstrument(), '');
    conformTrack(track);
    song.tracks.push(track);
    if (isPlaying) resyncPlayback();
    render();
  }

  function removeTrack(index) {
    if (!instrumentsEditable()) return;
    song.tracks.splice(index, 1);
    if (isPlaying) resyncPlayback();
    render();
  }

  /* Swap a track with its neighbour. Only the order on the page changes —
     nothing is rebuilt — so this is safe to do while the music is playing;
     resyncPlayback() picks the tracks up again in their new order without
     the loop losing its place.

     The moved row keeps the pointer's attention: after the render the
     arrow that did the moving is put back under the cursor by focusing
     its twin in the row's new home, so a second press keeps going the
     same way instead of needing the mouse to chase the row. */
  function moveTrack(index, delta) {
    if (!instrumentsEditable()) return;
    const to = index + delta;
    if (to < 0 || to >= song.tracks.length) return;

    const moved = song.tracks[index];
    song.tracks[index] = song.tracks[to];
    song.tracks[to] = moved;

    if (isPlaying) resyncPlayback();
    render();

    const row = grid.querySelector('.track[data-track="' + to + '"]');
    const arrows = row ? row.querySelectorAll('.move-btn') : [];
    const wanted = arrows[delta < 0 ? 0 : 1];
    if (wanted && !wanted.disabled) wanted.focus();
  }

  /* ---- the picker ---- */
  const instrumentSheet = document.getElementById('instrument-sheet');
  const instrumentGrid  = document.getElementById('instrument-grid');
  let pickingTrackIndex = -1;

  function openInstrumentSheet(trackIndex) {
    if (!instrumentsEditable()) return;
    pickingTrackIndex = trackIndex;
    const current = song.tracks[trackIndex].instrument;

    /* Whatever the kit has been narrowed to, plus whatever this track is
       already playing: a rhythm written for an instrument the layout no
       longer lists keeps it, and its own picker must not be the one place
       it cannot be found. */
    const offered = instrumentsOfferedFor(current);

    instrumentGrid.innerHTML = '';
    VI.INSTRUMENTS.filter(inst => offered.indexOf(inst.id) !== -1).forEach(inst => {
      const card = document.createElement('button');
      card.className = 'instrument-card' + (inst.id === current ? ' selected' : '');
      card.innerHTML = '<img src="' + instrumentImage(inst.id) + '" alt="' + inst.alt + '">'
                     + '<span>' + inst.label + '</span>';
      card.addEventListener('click', () => {
        unlockAudio();
        playInstrument(inst.id, 0);          // hear it before committing
        song.tracks[pickingTrackIndex].instrument = inst.id;
        closeInstrumentSheet();
        if (isPlaying) resyncPlayback();
        render();
      });
      instrumentGrid.appendChild(card);
    });

    instrumentSheet.classList.add('open');
  }

  function closeInstrumentSheet() {
    instrumentSheet.classList.remove('open');
    pickingTrackIndex = -1;
  }

  document.getElementById('instrument-sheet-close')
    .addEventListener('click', closeInstrumentSheet);
  instrumentSheet.addEventListener('click', e => {
    if (e.target === instrumentSheet) closeInstrumentSheet();
  });


  /* ==================================================================
     TOOLBAR
     ================================================================== */

  playButton.addEventListener('click', togglePlayback);

  /* ---- tempo ----
     The tempo is taken as it is typed rather than only when the field is
     closed. Waiting for a blur loses the number whenever the field never
     gets one — focus can fail to land at all in a background tab, and a
     sheet opening over the toolbar takes focus with it. */
  const bpmButton = document.getElementById('bpm-button');
  const BPM_MIN = 30, BPM_MAX = 260;

  function setBpm(value) {
    let n = Math.round(Number(value));
    if (!isFinite(n) || n < BPM_MIN || n > BPM_MAX) return false;
    n = clampTempo(n);
    if (n === song.bpm) return true;
    song.bpm = n;
    if (isPlaying) resyncPlayback();
    scheduleAutosave();
    return true;
  }

  function closeBpmEditor() {
    const input = bpmButton.querySelector('input');
    if (!input) return;
    bpmButton.innerHTML = '<span class="bpm-value" id="bpm-value">' + song.bpm + '</span>'
                        + '<span class="bpm-unit">BPM</span>';
  }

  bpmButton.addEventListener('click', () => {
    /* A locked tempo still has to be readable — it is part of what the
       student is being asked to play — so the number stays and only the
       editor goes. */
    if (tempoLocked()) return;
    if (bpmButton.querySelector('input')) return;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'inline-input';
    input.min = String(BPM_MIN);
    input.max = String(BPM_MAX);
    input.value = String(song.bpm);
    input.min = String(tempoMin());
    input.max = String(tempoMax());

    const before = song.bpm;
    bpmButton.innerHTML = '';
    bpmButton.appendChild(input);
    input.focus();
    input.select();

    input.addEventListener('input', () => setBpm(input.value));
    input.addEventListener('blur', closeBpmEditor);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); setBpm(input.value); closeBpmEditor(); }
      if (e.key === 'Escape') { e.preventDefault(); setBpm(before); closeBpmEditor(); }
    });
  });

  /* ---- meter ---- */
  const timeSignature = document.getElementById('time-signature');
  const tsTop = document.getElementById('ts-top');
  const tsBottom = document.getElementById('ts-bottom');

  /* Which numerals each denominator walks is layout.meters' business
     now; meterCycle() is the same list filtered by it. With one meter
     left, or the rhythm locked, the numbers stop being a button and
     simply read what the piece is in — a student still has to be able to
     see the meter they are playing. */
  function updateMeterDisplay() {
    tsTop.textContent = String(song.timeSignatureNumerator);
    tsBottom.textContent = String(song.timeSignatureDenominator);
    const fixed = meterIsFixed();
    timeSignature.classList.toggle('fixed', fixed);
    timeSignature.title = fixed ? 'The meter of this piece'
                                : 'Tap the numbers to change the meter';
    /* The bottom numeral is its own question: there may be several
       numerators to walk and still only one denominator to walk to. */
    tsBottom.classList.toggle('fixed', fixed || denominatorsOffered().length < 2);
  }

  tsTop.addEventListener('click', () => {
    if (meterIsFixed()) return;
    const list = meterCycle(song.timeSignatureDenominator);
    if (list.length < 2) return;
    changeMeter(() => {
      const i = list.indexOf(song.timeSignatureNumerator);
      // A piece written in a meter the layout no longer lists joins the
      // cycle at its start rather than being stuck outside it.
      song.timeSignatureNumerator = i === -1 ? list[0] : list[(i + 1) % list.length];
    });
  });

  tsBottom.addEventListener('click', () => {
    if (meterIsFixed() || denominatorsOffered().length < 2) return;
    changeMeter(() => {
      const next = song.timeSignatureDenominator === 4 ? 8 : 4;
      const list = meterCycle(next);
      if (!list.length) return;
      song.timeSignatureDenominator = next;
      const preferred = next === 8 ? 6 : 4;
      song.timeSignatureNumerator = list.indexOf(preferred) !== -1 ? preferred : list[0];
    });
  });

  /* A new meter re-bars the same music rather than re-cutting it. The
     number of bars is the one thing that cannot stay put: a bar of 6/8 is
     two beats where a bar of 4/4 is four, so two bars of 4/4 are four bars
     of 6/8 — holding the bar count is what used to push half the piece
     off the end and leave it waiting offstage. So the beats on screen are
     counted first, and afterwards the song is given however many bars it
     takes to hold them all.

     It is the beats *on screen* that are counted, not everything the
     tracks are holding: a bar the user has stepped away with the − button
     is meant to be gone from view, and re-barring must not bring it back.

     A remainder is possible when the beat itself does not divide — eight
     beats need three bars of 3/4, and the ninth comes up empty — but no
     beat is ever cut, and the round trip that matters, 4/4 to 6/8 and
     back, is exact. */
  function changeMeter(apply) {
    const held = totalBeats();
    apply();
    const need = Math.ceil(held / beatsPerMeasure());
    song.measures = Math.max(1, Math.min(maxMeasuresAllowed(), need));

    updateMeterDisplay();
    updateMeasureDisplay();
    conformAllTracks();
    if (isPlaying) resyncPlayback();
    render();
    syncSettings();

    /* Eight bars is the ceiling, so a long piece in a meter that counts
       fewer beats to the bar can run past the end. Nothing is lost — the
       surplus beats are waiting, not deleted — but say so. */
    if (need > maxMeasuresAllowed()) {
      toast(maxMeasuresAllowed() === 1
        ? 'One bar is the limit here — the rest is waiting for a wider meter'
        : maxMeasuresAllowed() + ' bars is the limit — the rest is waiting for a wider meter');
    }
  }

  /* ---- how many measures ---- */
  const measuresValue = document.getElementById('measures-value');
  const measuresUnit  = document.getElementById('measures-unit');
  const measuresMinus = document.getElementById('measures-minus');
  const measuresPlus  = document.getElementById('measures-plus');
  const measureStepper = document.getElementById('measure-stepper');
  const MAX_MEASURES = 8;

  /* Disabled and absent mean different things here, and both are used.
     A greyed − at one bar is the length of the piece talking: there is
     nothing below one, and saying so is more use than the button
     vanishing every time you reach the bottom. A − that a lesson has
     taken away is not a limit but a rule, and rules are removed rather
     than greyed, so that button is not drawn at all. */
  function updateMeasureDisplay() {
    measuresValue.textContent = String(song.measures);
    measuresUnit.textContent = song.measures === 1 ? 'bar' : 'bars';
    measuresMinus.disabled = song.measures <= 1;
    measuresPlus.disabled = song.measures >= maxMeasuresAllowed();
    showHide(measuresMinus, canRemoveMeasures());
    showHide(measuresPlus, canAddMeasures());
    measureStepper.classList.toggle('fixed', !canAddMeasures() && !canRemoveMeasures());
  }

  measuresMinus.addEventListener('click', () => {
    if (!canRemoveMeasures() || song.measures <= 1) return;
    song.measures--;
    afterLengthChange();
  });
  measuresPlus.addEventListener('click', () => {
    if (!canAddMeasures() || song.measures >= maxMeasuresAllowed()) return;
    song.measures++;
    afterLengthChange();
  });

  function afterLengthChange() {
    updateMeasureDisplay();
    conformAllTracks();
    if (isPlaying) resyncPlayback();
    render();
    syncSettings();
  }

  /* ---- the count ---- */
  const metronomeBtn = document.getElementById('metronome-btn');
  metronomeBtn.addEventListener('click', () => {
    metronomeOn = !metronomeOn;
    metronomeBtn.classList.toggle('active', metronomeOn);
  });

  document.getElementById('add-track-btn').addEventListener('click', addTrack);


  /* ==================================================================
     SETTINGS
     ================================================================== */

  const settingsBtn     = document.getElementById('settings-btn');
  const settingsPopover = document.getElementById('settings-popover');
  const systemSelect    = document.getElementById('syllable-system');
  const systemField     = document.getElementById('syllable-system-field');

  SYLLABLE_SYSTEMS.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    systemSelect.appendChild(opt);
  });

  /* Each switch is one key of `view`; flipping it saves, and re-renders
     only when the page actually looks different afterwards. */
  const SWITCHES = [
    { id: 'syllables-toggle',    key: 'showSyllables' },
    { id: 'bar-numbers-toggle',  key: 'showBarNumbers' },
    { id: 'beat-numbers-toggle', key: 'showBeatNumbers' },
    /* nothing is drawn differently, only a body class — so no render,
       and flipping it mid-playback does not interrupt what is lit */
    { id: 'light-notes-toggle',  key: 'lightNotes', soft: true }
  ];

  const layoutPagesBtn  = document.getElementById('layout-pages');
  const layoutSystemsBtn = document.getElementById('layout-systems');
  const layoutScrollBtn = document.getElementById('layout-scroll');
  const perPageLabel    = document.getElementById('per-page-label');
  const perPageField    = document.getElementById('per-page-field');
  const perPageRow      = document.getElementById('per-page-row');
  const zoomField       = document.getElementById('zoom-field');
  const zoomSlider      = document.getElementById('zoom-slider');
  const zoomReadout     = document.getElementById('zoom-readout');
  const layoutNote      = document.getElementById('layout-note');

  PER_PAGE_CHOICES.forEach(n => {
    const chip = document.createElement('button');
    chip.className = 'chip-btn';
    chip.dataset.perPage = String(n);
    chip.textContent = String(n);
    chip.addEventListener('click', () => {
      view.measuresPerPage = n;
      /* The number belongs to both block layouts, so asking for one from
         Scroll lands on Pages — the layout the number first meant. */
      if (!inBlocks()) view.layout = 'pages';
      currentPage = 0;
      saveViewPrefs();
      syncSettings();
      /* Systems redraw: how many bars to a line changes what is built,
         not just what is looked at. */
      if (isSystems()) render(); else applyLayout();
    });
    perPageRow.appendChild(chip);
  });

  /* Going in or out of systems rebuilds the score — it is cut into
     blocks as it is built — where the other two only change the window. */
  function setLayout(mode) {
    const was = view.layout;
    view.layout = mode;
    currentPage = 0;
    saveViewPrefs();
    syncSettings();
    if (mode === 'systems' || was === 'systems') render(); else applyLayout();
  }
  layoutPagesBtn.addEventListener('click', () => setLayout('pages'));
  layoutSystemsBtn.addEventListener('click', () => setLayout('systems'));
  layoutScrollBtn.addEventListener('click', () => setLayout('scroll'));

  zoomSlider.addEventListener('input', () => {
    view.zoomPct = Number(zoomSlider.value);
    zoomReadout.textContent = view.zoomPct + '%';
    if (view.layout === 'scroll') applyLayout();
  });
  zoomSlider.addEventListener('change', saveViewPrefs);

  function syncSettings() {
    SWITCHES.forEach(({ id, key }) => {
      document.getElementById(id).classList.toggle('active', !!view[key]);
    });
    syncDotsButton();
    syncSystemOptions();
    systemSelect.value = view.syllableSystem;
    systemField.hidden = !view.showSyllables || systemsOffered().length < 2;
    document.body.classList.toggle('hide-bar-numbers', !view.showBarNumbers);
    document.body.classList.toggle('hide-beat-numbers', !view.showBeatNumbers);
    document.body.classList.toggle('show-syllables', !!view.showSyllables);
    document.body.classList.toggle('light-notes', !!view.lightNotes);

    const paged = isPaged(), systems = isSystems(), blocks = inBlocks();
    layoutPagesBtn.classList.toggle('active', paged);
    layoutSystemsBtn.classList.toggle('active', systems);
    layoutScrollBtn.classList.toggle('active', !blocks);
    perPageField.hidden = !blocks;
    perPageLabel.textContent = systems ? 'Bars on a line' : 'Bars on a page';
    zoomField.hidden = blocks;

    /* Every choice stays live, even one larger than the piece. The setting
       follows the person rather than the song: someone who reads four bars
       to a page wants that back when they open a longer one, and a short
       piece simply fills a single page in the meantime. */
    perPageRow.querySelectorAll('.chip-btn').forEach(chip => {
      const n = Number(chip.dataset.perPage);
      chip.classList.toggle('active', blocks && n === view.measuresPerPage);
    });

    zoomSlider.value = String(view.zoomPct);
    zoomReadout.textContent = view.zoomPct + '%';

    layoutNote.textContent = paged
      ? (pageCount() > 1
          ? 'Every page is drawn the same size, and the music turns the page as it plays.'
          : 'The whole piece fits on one page.')
      : systems
        ? (pageCount() > 1
            ? 'The piece runs across and starts again underneath, like a printed score — so a wide screen '
              + 'can hold a tall band of instruments without shrinking them.'
            : 'The whole piece fits on one line.')
        : 'The whole piece on one line — drag sideways to see the rest, and it comes along on its own while it plays.';
  }

  SWITCHES.forEach(({ id, key, soft }) => {
    document.getElementById(id).addEventListener('click', () => {
      view[key] = !view[key];
      saveViewPrefs();
      syncSettings();
      if (!soft) render();
    });
  });

  systemSelect.addEventListener('change', () => {
    view.syllableSystem = systemSelect.value;
    saveViewPrefs();
    render();
  });

  /* Anchored above the button that opened it, and nudged back on screen
     if that would hang it off an edge. */
  function positionPopover(button, popover) {
    popover.classList.add('open');
    const b = button.getBoundingClientRect();
    const p = popover.getBoundingClientRect();
    let left = b.left + b.width / 2 - p.width / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - p.width - 12));
    let top = b.top - p.height - 10;
    if (top < 12) top = Math.min(b.bottom + 10, window.innerHeight - p.height - 12);
    popover.style.left = left + 'px';
    popover.style.top = top + 'px';
  }

  function toggleSettings() {
    if (settingsPopover.classList.contains('open')) return closeSettings();
    syncSettings();
    positionPopover(settingsBtn, settingsPopover);
    settingsBtn.classList.add('active');
  }

  function closeSettings() {
    settingsPopover.classList.remove('open');
    settingsBtn.classList.remove('active');
  }

  settingsBtn.addEventListener('click', e => { e.stopPropagation(); toggleSettings(); });
  settingsPopover.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', closeSettings);
  window.addEventListener('resize', () => {
    if (settingsPopover.classList.contains('open')) positionPopover(settingsBtn, settingsPopover);
  });


  /* ==================================================================
     LAYOUT SETTINGS — the sheet
     ------------------------------------------------------------------
     Everything here writes to `layout` (or to the on-screen flags in
     `view`) and takes effect immediately, for whoever is using the app.
     There is no draft and no apply button: you are arranging the room
     you are standing in, and a student link is a photograph of it.
     ================================================================== */

  const layoutSheet     = document.getElementById('layout-sheet');
  const layoutSheetBtn  = document.getElementById('layout-settings-btn');
  const layoutShowList  = document.getElementById('layout-show');
  const layoutMeterSimple   = document.getElementById('layout-meter-simple');
  const layoutMeterCompound = document.getElementById('layout-meter-compound');
  const layoutMeterNote = document.getElementById('layout-meter-note');
  const layoutKitGrid   = document.getElementById('layout-kit');
  const layoutKitNote   = document.getElementById('layout-kit-note');
  const layoutKitAll    = document.getElementById('layout-kit-all');
  const layoutDivideList = document.getElementById('layout-divide');
  const layoutFamSeg    = document.getElementById('layout-fam-seg');
  const layoutFamNote   = document.getElementById('layout-fam-note');
  const layoutVocabBox  = document.getElementById('layout-vocab');

  let layoutFamily = 'simple';

  const FAMILY_LABEL = {
    simple:   'A beat counted in two — 2/4, 3/4, 4/4, 5/4, 6/4.',
    compound: 'A beat counted in three — 6/8, 9/8, 12/8.'
  };

  const DIVIDE_SWITCHES = [
    { key: 'sixteenths', name: 'Sixteenth notes',
      desc: 'The + button, splitting a beat into four' },
    { key: 'tuplets', name: 'Triplets / duplets',
      desc: 'The − button, borrowing the other division' },
    { key: 'subTuplets', name: 'Subdivided triplets / duplets',
      desc: 'Pressing − again to split the borrowed division' }
  ];

  const SHOW_SWITCHES = [
    { key: 'showDots', name: 'Tappable dots',
      desc: 'The circles above each beat and the chains that join them — the button beside Play flips these too' },
    { key: 'showBarNumbers', name: 'Bar numbers',
      desc: 'Which bar is which, along the top of the score' },
    { key: 'showBeatNumbers', name: 'Beat numbers',
      desc: 'The count along the top of the score — 1, 2, 3, 4' },
    { key: 'showSyllables', name: 'Syllables',
      desc: 'What each beat is counted as, under every track' }
  ];

  function switchRow(name, desc, on, onClick) {
    const btn = document.createElement('button');
    btn.className = 'switch-row' + (on ? ' active' : '');
    btn.innerHTML =
      '<span class="switch-text">' +
        '<span class="switch-name"></span>' +
        '<span class="switch-desc"></span>' +
      '</span><span class="switch" aria-hidden="true"></span>';
    btn.querySelector('.switch-name').textContent = name;
    btn.querySelector('.switch-desc').textContent = desc;
    if (onClick) btn.addEventListener('click', onClick);
    return btn;
  }

  /* ---- drawing one shape of the vocabulary -------------------------
     Straight through the engraver the score itself uses, and through
     beatRoles() on the way, so a picture in this sheet can never drift
     from what the same taps turn into on the page. */

  const CELL_SLOT_W = 15;
  const CELL_SIZE_H = 40;
  const JOIN_CELL_W = 70;   // the widest a joined-note picture may grow to

  function cellMap(pattern, slots, compound) {
    const flags = patternToFlags(pattern);
    const colours = beatRoles({ slots: slots, cells: flags });
    return RN.buildMap({
      compound: compound,
      beats: [{ slots: slots, roles: rolesToNotation(colours) }]
    });
  }

  function engraveCell(pattern, slots, compound) {
    const map = cellMap(pattern, slots, compound);
    const sizeH = CELL_SIZE_H;
    const boxH = sizeH + (map.tuplets.length ? RN.notationHeadroom(sizeH) : 0);
    const centres = [];
    for (let i = 0; i < slots; i++) centres.push(CELL_SLOT_W / 2 + i * CELL_SLOT_W);
    return RN.engrave({
      roles: map.roles, slotTicks: map.slotTicks, slotBeat: map.slotBeat,
      slotSubGroup: map.slotSubGroup, tuplets: map.tuplets,
      slotCentres: centres,
      width: CELL_SLOT_W * slots,
      height: boxH,
      sizeHeight: sizeH
    });
  }

  /* A note made by joining beats, drawn the way the score would draw it.
     The box is only as wide as the drawing needs: a whole note is one
     notehead and seven silent slots after it, and a cell padded out to
     four beats would be mostly empty paper. */
  function engraveJoin(beats, compound) {
    const plain = compound ? 3 : 2;
    const flags = [];
    for (let i = 0; i < beats * plain; i++) flags.push(i === 0);
    const colours = RN.rolesFromFlags(flags);

    const spec = [];
    for (let b = 0; b < beats; b++) {
      spec.push({ slots: plain, roles: colours.slice(b * plain, b * plain + plain) });
    }
    const map = RN.buildMap({ compound: compound, beats: spec });

    /* How much of the run the drawing actually uses, asked of the
       engraver rather than guessed. Most of these are one notehead with
       several silent slots trailing after it — a box padded out to four
       beats would be mostly empty paper — but not all: a whole note is
       the longest value there is, so three dotted-quarter beats joined
       come out as two notes tied, and a box cut to one notehead would
       drop the second one over the side. */
    let last = 0;
    RN.plan(map).forEach(it => { if (it.slot > last) last = it.slot; });
    const span = last + 1.5;
    const slotW = Math.max(4, Math.min(CELL_SLOT_W, JOIN_CELL_W / span));

    const centres = [];
    for (let i = 0; i < flags.length; i++) centres.push(slotW / 2 + i * slotW);
    return RN.engrave({
      roles: map.roles, slotTicks: map.slotTicks, slotBeat: map.slotBeat,
      slotSubGroup: map.slotSubGroup, tuplets: map.tuplets,
      slotCentres: centres,
      width: span * slotW,
      height: CELL_SIZE_H,
      sizeHeight: CELL_SIZE_H
    });
  }

  /* ---- reading and writing the layout's vocabulary ----------------- */

  function layoutCells(fam, slots) {
    const stored = layout.cells[fam][slots];
    return (Array.isArray(stored) && stored.length) ? stored : patternsFor(slots);
  }

  function setLayoutCells(fam, slots, list) {
    const all = patternsFor(slots);
    const ordered = all.filter(x => list.indexOf(x) !== -1);
    if (ordered.length >= all.length) delete layout.cells[fam][slots];
    else layout.cells[fam][slots] = ordered;
  }

  /* What a shape sounds like, independent of the grid it is stored on.

     A quarter note can be written as XO on the eighth grid or XOOO on
     the sixteenth one, and those engrave to the same picture. A teacher
     should be asked about it once.

     Engrave the shape at a fixed width, with the notes at their real
     positions in the beat rather than one per column, and use the
     drawing itself as the signature. Nothing else is as trustworthy:
     two shapes are the same picture exactly when they draw the same
     picture, and that stays true however the engraver's own rules — or
     beatRoles' deliberate exceptions — change underneath.

     It settles the awkward cases correctly and for the right reason. A
     quarter written on the triplet grid loses its bracket, because the
     engraver drops a tuplet with only one note in it, so it folds into
     the plain quarter. XXOO on sixteenths keeps its eighth rest, because
     beatRoles says that is what it is, so it does not fold into XXOX.

     The width is generous so the one length that depends on column
     width, a partial beam's stub, clamps to the same value at every
     division. */
  const SIG_W = 240;
  function soundSignature(pattern, slots, compound) {
    const beat = compound ? COMPOUND_BEAT : SIMPLE_BEAT;
    const per = beat / slots;
    const map = cellMap(pattern, slots, compound);
    const centres = [];
    for (let i = 0; i < slots; i++) centres.push((i * per / beat) * SIG_W);
    return RN.engrave({
      roles: map.roles, slotTicks: map.slotTicks, slotBeat: map.slotBeat,
      slotSubGroup: map.slotSubGroup, tuplets: map.tuplets,
      slotCentres: centres,
      width: SIG_W,
      height: CELL_SIZE_H,
      sizeHeight: CELL_SIZE_H
    });
  }

  /* Every shape the app can write in one family, folded down to one
     entry per distinct sound and drawn from the sparsest grid it fits
     on, which is the simplest picture.

     The fold runs across the whole family, not group by group, so a
     quarter note written on the sixteenth grid is the same quarter note
     that is already in Quarters, eighths & rests — it is offered once,
     in the group a musician would look for it in, and switching it off
     there switches it off everywhere it could have been written. */
  const pictureCache = {};
  function familyPictures(fam) {
    if (pictureCache[fam]) return pictureCache[fam];
    const compound = fam === 'compound';
    const bySig = {};
    const order = [];
    VOCAB_GROUPS.forEach(group => {
      groupCells(group, fam).forEach(entry => {
        entry.patterns.forEach(pattern => {
          const sig = soundSignature(pattern, entry.slots, compound);
          if (!bySig[sig]) {
            bySig[sig] = { kind: 'cell', group: group.id, slots: entry.slots,
                           pattern: pattern, members: [] };
            order.push(bySig[sig]);
          }
          bySig[sig].members.push({ slots: entry.slots, pattern: pattern });
          if (entry.slots < bySig[sig].slots) {
            bySig[sig].slots = entry.slots;
            bySig[sig].pattern = pattern;
          }
        });
      });
    });
    pictureCache[fam] = order;
    return order;
  }

  /* The join group's pictures are lengths rather than shapes, and they
     are read as a ladder: two beats, then three, then four. See the note
     on JOIN_CAP_MAX for why a cap and not a set. */
  function joinPictures() {
    return JOIN_LENGTHS.map(n => ({ kind: 'join', group: 'joins', beats: n }));
  }

  function groupPictures(group, fam) {
    if (group.joins) return joinPictures();
    return familyPictures(fam).filter(p => p.group === group.id);
  }

  function pictureIsOn(pic, fam) {
    if (pic.kind === 'join') return pic.beats <= joinCap(fam);
    return pic.members.some(m => divisionEnabledIn(fam, m.slots)
      && layoutCells(fam, m.slots).indexOf(m.pattern) !== -1);
  }

  function togglePicture(pic, fam) {
    if (pic.kind === 'join') {
      /* Turning a length off takes everything longer off with it, and
         turning one on brings everything shorter with it. A join is made
         one beat at a time, so anything else would be a picture nobody
         could reach by pressing the chain. */
      layout.joins[fam] = pictureIsOn(pic, fam) ? pic.beats - 1 : pic.beats;
      saveLayout();
      return;
    }

    const turningOff = pictureIsOn(pic, fam);
    /* Never leave a division with nothing at all: a beat would have no
       legal shape to fall back to. */
    if (turningOff) {
      const blocked = pic.members.some(m =>
        divisionEnabledIn(fam, m.slots) && layoutCells(fam, m.slots).length <= 1);
      if (blocked) return;
    }
    pic.members.forEach(m => {
      if (!divisionEnabledIn(fam, m.slots)) return;   // nothing to narrow there
      const list = layoutCells(fam, m.slots).slice();
      const at = list.indexOf(m.pattern);
      if (!turningOff && at === -1) list.push(m.pattern);
      else if (turningOff && at !== -1) list.splice(at, 1);
      if (list.length) setLayoutCells(fam, m.slots, list);
    });
    saveLayout();
  }

  /* How much of a group is switched on: 'all', 'none' or 'some'. */
  function groupState(group, fam) {
    const pics = groupPictures(group, fam);
    if (!pics.length) return 'none';
    let on = 0;
    pics.forEach(p => { if (pictureIsOn(p, fam)) on++; });
    return on === 0 ? 'none' : on === pics.length ? 'all' : 'some';
  }

  function setGroup(group, fam, on) {
    if (group.joins) {
      layout.joins[fam] = on ? JOIN_CAP_MAX : 1;
      saveLayout();
      return;
    }
    groupPictures(group, fam).forEach(pic => {
      if (pictureIsOn(pic, fam) !== on) togglePicture(pic, fam);
    });
  }

  /* A group only appears when the division it needs is switched on — a
     question about dotted sixteenths is meaningless with the sixteenths
     turned off — and when it has something of its own left to ask about
     after the family-wide fold. */
  function groupIsOffered(group, fam) {
    if (group.needs && layout.divide[group.needs] === false) return false;
    return groupPictures(group, fam).length > 0;
  }

  /* ---- rendering --------------------------------------------------- */

  function renderLayoutShow() {
    if (!layoutShowList) return;
    layoutShowList.innerHTML = '';
    SHOW_SWITCHES.forEach(item => {
      layoutShowList.appendChild(switchRow(item.name, item.desc, view[item.key], () => {
        view[item.key] = !view[item.key];
        saveViewPrefs();
        syncSettings();
        renderLayoutShow();
        render();
      }));
    });
  }

  function renderLayoutMeters() {
    [['simple', layoutMeterSimple], ['compound', layoutMeterCompound]].forEach(([fam, row]) => {
      if (!row) return;
      row.innerHTML = '';
      METERS[fam].forEach(key => {
        const on = layout.meters[fam].indexOf(key) !== -1;
        const chip = document.createElement('button');
        chip.className = 'chip-btn' + (on ? ' active' : '');
        chip.textContent = key;
        chip.addEventListener('click', () => {
          const list = layout.meters[fam].slice();
          const at = list.indexOf(key);
          if (at === -1) list.push(key);
          else list.splice(at, 1);
          const next = METERS[fam].filter(m => list.indexOf(m) !== -1);
          // Between the two families there has to be at least one meter.
          const other = fam === 'simple' ? 'compound' : 'simple';
          if (!next.length && !layout.meters[other].length) return;
          layout.meters[fam] = next;
          saveLayout();
          renderLayoutMeters();
          updateMeterDisplay();
          render();
        });
        row.appendChild(chip);
      });
    });
    renderLayoutMeterNote();
  }

  function renderLayoutMeterNote() {
    if (!layoutMeterNote) return;
    const chosen = layout.meters.simple.concat(layout.meters.compound);
    const all = METERS.simple.length + METERS.compound.length;
    layoutMeterNote.textContent = chosen.length === all
      ? 'Every meter. Tap the numbers on the toolbar to move between them.'
      : chosen.length === 1
        ? 'One meter only, so the numbers on the toolbar stop being a button and just read '
          + chosen[0] + '.'
        : 'Tapping the numbers on the toolbar walks these ' + chosen.length + '.';
  }

  function renderLayoutKit() {
    if (!layoutKitGrid) return;
    const offered = instrumentsOffered();
    const narrowed = !!(layout.instruments && layout.instruments.length);

    layoutKitGrid.innerHTML = '';
    VI.INSTRUMENTS.forEach(inst => {
      const on = offered.indexOf(inst.id) !== -1;
      const cell = document.createElement('button');
      cell.className = 'kit-cell' + (on ? ' picked' : '');
      cell.innerHTML = '<img alt=""><span></span>';
      cell.querySelector('img').src = instrumentImage(inst.id);
      cell.querySelector('span').textContent = inst.label;
      cell.title = on ? 'Take ' + inst.label + ' out of the kit'
                      : 'Put ' + inst.label + ' back in the kit';
      cell.addEventListener('click', () => {
        const list = instrumentsOffered().slice();
        const at = list.indexOf(inst.id);
        if (at === -1) list.push(inst.id);
        else if (list.length > 1) list.splice(at, 1);
        else return;                       // somebody has to be playing
        const keep = VI.INSTRUMENT_IDS.filter(id => list.indexOf(id) !== -1);
        layout.instruments = keep.length < VI.INSTRUMENT_IDS.length ? keep : null;
        saveLayout();
        renderLayoutKit();
      });
      layoutKitGrid.appendChild(cell);
    });

    if (layoutKitNote) {
      layoutKitNote.textContent = !narrowed
        ? 'Every instrument. These are what the picker and Add instrument offer.'
        : offered.length + ' of ' + VI.INSTRUMENT_IDS.length
          + ' — a track already playing one you have taken out keeps it.';
    }
    if (layoutKitAll) layoutKitAll.classList.toggle('policy-off', !narrowed);
  }

  function renderLayoutDivide() {
    if (!layoutDivideList) return;
    layoutDivideList.innerHTML = '';
    DIVIDE_SWITCHES.forEach(item => {
      const on = layout.divide[item.key] !== false;
      /* A division can be switched on and still have nothing to offer,
         if every group that lives there has been turned off below. The
         button it controls is hidden in that case, so say why rather
         than leaving a switch that looks live and does nothing. */
      const barren = on && !['simple', 'compound'].some(fam =>
        divisionOffersSomethingNew(fam, DIVIDE_SLOTS[item.key][fam]));
      layoutDivideList.appendChild(switchRow(
        item.name,
        barren ? 'Nothing under Rhythms available uses this, so the button stays hidden'
               : item.desc,
        on,
        () => {
          layout.divide[item.key] = layout.divide[item.key] === false;
          saveLayout();
          renderLayoutDivide();
          renderLayoutVocab();
          render();
        }
      ));
    });
  }

  function renderLayoutFamily() {
    if (!layoutFamSeg) return;
    layoutFamSeg.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.fam === layoutFamily);
    });
    if (layoutFamNote) layoutFamNote.textContent = FAMILY_LABEL[layoutFamily];
  }

  function renderLayoutVocab() {
    if (!layoutVocabBox) return;
    layoutVocabBox.innerHTML = '';
    const fam = layoutFamily;
    const compound = fam === 'compound';

    VOCAB_GROUPS.forEach(group => {
      if (!groupIsOffered(group, fam)) return;
      const state = groupState(group, fam);
      const block = document.createElement('div');
      block.className = 'vocab-block' + (state === 'none' ? ' off' : '');

      const head = document.createElement('button');
      head.className = 'vocab-head' + (state === 'all' ? ' active' : state === 'some' ? ' partial' : '');
      head.innerHTML =
        '<span class="vocab-head-text">' +
          '<span class="vocab-head-name"></span>' +
          '<span class="vocab-head-blurb"></span>' +
        '</span><span class="switch" aria-hidden="true"></span>';
      head.querySelector('.vocab-head-name').textContent = group.label;
      head.querySelector('.vocab-head-blurb').textContent = group.blurb;
      head.addEventListener('click', () => {
        setGroup(group, fam, state !== 'all');
        renderLayoutVocab();
        renderLayoutDivide();
        render();
      });
      block.appendChild(head);

      /* A division with more shapes than a grid can show is all or
         nothing. The join lengths never hit that — there are only ever
         three of them — so the test is about the group's cells alone. */
      const entries = groupCells(group, fam);
      const pickable = !entries.length || entries.every(e => cellsArePickable(e.slots));

      if (!pickable) {
        const widest = entries.reduce((a, e) => Math.max(a, e.patterns.length), 0);
        const note = document.createElement('p');
        note.className = 'vocab-note';
        note.textContent = 'That division has ' + widest +
          ' different shapes — too many to pick between, so this group is all or nothing.';
        block.appendChild(note);
      } else {
        const grid = document.createElement('div');
        grid.className = 'vocab-grid';
        groupPictures(group, fam).forEach(pic => {
          const cell = document.createElement('button');
          cell.className = 'vocab-cell' + (pictureIsOn(pic, fam) ? ' picked' : '');
          if (pic.kind === 'join') {
            cell.title = pic.beats + ' beats joined';
            cell.innerHTML = engraveJoin(pic.beats, compound);
          } else {
            cell.title = pic.members.map(m => m.pattern).join(' / ');
            cell.innerHTML = engraveCell(pic.pattern, pic.slots, compound);
          }
          cell.addEventListener('click', () => {
            togglePicture(pic, fam);
            renderLayoutVocab();
            renderLayoutDivide();
            render();
          });
          grid.appendChild(cell);
        });
        block.appendChild(grid);

        if (group.joins) {
          const note = document.createElement('p');
          note.className = 'vocab-note';
          note.textContent = joinCap(fam) <= 1
            ? 'No joining — the chain button between beats is not drawn.'
            : 'Joins reach up to ' + Math.min(joinCap(fam), JOIN_LENGTHS[JOIN_LENGTHS.length - 1])
              + ' beats. A run already on the page keeps its chain either way.';
          block.appendChild(note);
        }
      }

      layoutVocabBox.appendChild(block);
    });
  }

  function renderLayoutSheet() {
    renderLayoutShow();
    renderLayoutMeters();
    renderLayoutKit();
    renderLayoutDivide();
    renderLayoutFamily();
    renderLayoutVocab();
  }

  function openLayoutSheet() {
    if (!layoutEditable()) { toast('Your layout settings were set by whoever sent this'); return; }
    closeSettings();
    /* The vocabulary is per family, and the family you are working in is
       almost always the one you want to see first. */
    layoutFamily = familyOf();
    openSheet(layoutSheet);
    renderLayoutSheet();
  }

  if (layoutSheetBtn) layoutSheetBtn.addEventListener('click', openLayoutSheet);
  wireSheet(layoutSheet, 'layout-sheet-close');

  if (layoutFamSeg) {
    layoutFamSeg.addEventListener('click', e => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      layoutFamily = btn.dataset.fam;
      renderLayoutFamily();
      renderLayoutVocab();
    });
  }

  if (layoutKitAll) {
    layoutKitAll.addEventListener('click', () => {
      layout.instruments = null;
      saveLayout();
      renderLayoutKit();
    });
  }

  /* ---- the dots button --------------------------------------------
     Its own control rather than a line in a popover, and deliberately
     outside everything a lesson can switch off. Turning the dots off to
     read the notation, and back on to edit it, is something a class does
     every few minutes. */
  const dotsBtn = document.getElementById('dots-btn');

  function syncDotsButton() {
    if (!dotsBtn) return;
    dotsBtn.classList.toggle('active', view.showDots);
    dotsBtn.setAttribute('aria-pressed', String(view.showDots));
    dotsBtn.title = view.showDots ? 'Hide the tappable dots' : 'Show the tappable dots';
  }

  if (dotsBtn) {
    dotsBtn.addEventListener('click', () => {
      view.showDots = !view.showDots;
      saveViewPrefs();
      syncSettings();
      if (layoutShowList && layoutShowList.children.length) renderLayoutShow();
      render();
    });
  }

  /* ==================================================================
     PRESENT MODE

     For the board at the front of the room: the score, and nothing else.
     Everything that goes is either a control or a chrome edge, so the
     stage inherits the height the top bar and the toolbar were using and
     the fit is worked out again against it — which is the whole point,
     since a bigger stage is what makes the notes bigger.

     The layout itself is untouched. A piece set in pages still turns
     pages, a piece set to scroll across still scrolls and still follows
     the beat: present mode shows what the user built rather than
     deciding for them what a presentation ought to look like.
     ================================================================== */

  const presentBtn        = document.getElementById('present-btn');
  const presentExitBtn    = document.getElementById('present-exit-btn');
  const presentPlayBtn    = document.getElementById('present-play-btn');
  const presentPlayGlyph  = document.getElementById('present-play-glyph');
  let presentMode = false;

  function setPresentMode(on) {
    if (presentMode === !!on) return;
    presentMode = !!on;
    document.body.classList.toggle('present-mode', presentMode);
    closeSettings();
    closeInstrumentSheet();

    /* The stage has only just changed size; measuring in the same frame
       would fit the score to the height it is leaving behind. */
    requestAnimationFrame(() => { syncHeadColumn(); applyLayout(); });
    presentBtn.classList.toggle('active', presentMode);
  }

  presentBtn.addEventListener('click', e => { e.stopPropagation(); setPresentMode(true); });
  presentExitBtn.addEventListener('click', () => setPresentMode(false));
  presentPlayBtn.addEventListener('click', e => { e.stopPropagation(); togglePlayback(); });

  /* ---- keyboard ---- */
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;
    if (e.code === 'Space') { e.preventDefault(); togglePlayback(); }
    if (e.key === 'Escape') {
      /* Close the topmost thing that is open; only stop the music if
         nothing was. */
      const sheets = [pictureModal, titleModal, backupSheet,
                      layoutSheet, lessonSetupSheet, librarySheet]
        .filter(el => el && el.classList.contains('open'));
      const hadPopover = settingsPopover.classList.contains('open')
                      || instrumentSheet.classList.contains('open');
      closeInstrumentSheet();
      closeSettings();
      if (sheets.length) closeSheet(sheets[0]);
      else if (hadPopover) { /* the popover was the thing that was open */ }
      else if (presentMode) setPresentMode(false);
      else if (isPlaying) stopPlayback();
    }
  });


  /* ==================================================================
     THE LIBRARY, ON SCREEN
     ================================================================== */

  const songChip        = document.getElementById('song-chip');
  const songChipKicker  = document.getElementById('song-chip-kicker');
  const songChipLabel   = document.getElementById('song-chip-label');
  const nowEditingNote  = document.getElementById('now-editing-note');
  const librarySheet    = document.getElementById('library-sheet');
  const libraryList     = document.getElementById('library-list');
  const nowEditingTitle = document.getElementById('now-editing-title');

  function openSheet(el) { el.classList.add('open'); }
  function closeSheet(el) { el.classList.remove('open'); }

  /* Every sheet closes on its backdrop and on its own × button. */
  function wireSheet(sheet, closeBtnId) {
    sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(sheet); });
    const btn = closeBtnId && document.getElementById(closeBtnId);
    if (btn) btn.addEventListener('click', () => closeSheet(sheet));
  }

  function openLibrary() {
    closeBpmEditor();
    if (isPlaying) stopPlayback();
    flushAutosave();
    renderLibraryList();
    updateSongChip();
    openSheet(librarySheet);
  }

  songChip.addEventListener('click', openLibrary);
  wireSheet(librarySheet, 'library-close');

  function describeSong(record) {
    const bars = record.measures === 1 ? '1 bar' : record.measures + ' bars';
    const n = record.tracks.length;
    const kit = n === 1 ? '1 instrument' : n + ' instruments';
    return bars + ' · ' + kit + ' · ' + record.bpm + ' BPM';
  }

  function buildSongRow(id, record) {
    const isCurrent = id === song.id;
    const row = document.createElement('div');
    row.className = 'library-song' + (isCurrent ? ' current' : '');

    const meter = document.createElement('span');
    meter.className = 'meter-badge';
    meter.textContent = record.timeSignatureNumerator + '/' + record.timeSignatureDenominator;

    const middle = document.createElement('div');
    middle.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;gap:1px';
    const title = document.createElement('span');
    title.className = 'library-song-title';
    title.textContent = record.title;
    const sub = document.createElement('span');
    sub.className = 'library-song-sub';
    sub.textContent = describeSong(record);
    middle.appendChild(title);
    middle.appendChild(sub);

    const actions = document.createElement('div');
    actions.className = 'library-song-actions';

    /* With auto-save off, the ostinato on screen and the one in the
       library are two different things — so the button that would say
       "Open now" offers the saved one back instead. */
    const canReopen = isCurrent && !autoSaveOn();
    const open = document.createElement('button');
    open.className = 'lib-btn' + (isCurrent && !canReopen ? ' is-current' : '');
    open.textContent = canReopen ? 'Reopen' : (isCurrent ? 'Open now' : 'Open');
    open.disabled = isCurrent && !canReopen;
    if (canReopen) {
      open.title = 'Open the saved version again, losing the changes on screen';
      open.addEventListener('click', () => {
        if (hasUnsavedChanges() &&
            !confirm('Reopen \u201c' + record.title + '\u201d as it was saved?\n\n'
                   + 'The changes you have made since opening it are lost.')) return;
        openSong(id);
        closeSheet(librarySheet);
        toast('Reopened as saved');
      });
    } else if (!isCurrent) {
      open.addEventListener('click', () => {
        flushAutosave();
        openSong(id);
        closeSheet(librarySheet);
        toast('Opened “' + record.title + '”');
      });
    }

    /* Inside a lesson the only thing to do to an exercise is put it back
       the way it arrived. Renaming and deleting belong to a library the
       student does not own. */
    if (lessonMeta) {
      actions.appendChild(open);
      if (lessonHasSource(id)) {
        const again = document.createElement('button');
        again.className = 'lib-btn';
        again.textContent = 'Start again';
        again.title = 'Put this one back the way it arrived';
        again.addEventListener('click', () => {
          if (!confirm('Start \u201c' + record.title + '\u201d again? Your changes to it are lost.')) return;
          restoreLessonSong(id);
          renderLibraryList();
          toast('Back to the original');
        });
        actions.appendChild(again);
      }
      row.appendChild(meter);
      row.appendChild(middle);
      row.appendChild(actions);
      return row;
    }

    const rename = document.createElement('button');
    rename.className = 'lib-btn';
    rename.textContent = 'Rename';
    rename.addEventListener('click', () => {
      const next = prompt('New name:', record.title);
      if (!next || !next.trim()) return;
      const lib = getStoredLibrary();
      if (!lib[id]) return;
      lib[id].title = next.trim();
      saveStoredLibrary(lib);
      if (id === song.id) { song.title = next.trim(); updateSongChip(); }
      renderLibraryList();
    });

    const remove = document.createElement('button');
    remove.className = 'lib-btn danger';
    remove.innerHTML = '&times;';
    remove.title = 'Delete this ostinato';
    remove.addEventListener('click', () => {
      if (!confirm('Delete “' + record.title + '”? This cannot be undone.')) return;
      const lib = getStoredLibrary();
      delete lib[id];
      saveStoredLibrary(lib);

      /* Deleting what is on screen has to leave something on screen. */
      /* Deleting what is on screen drops you into the sandbox rather
         than into some other library ostinato. */
      if (id === song.id) {
        song.id = null;            // so the autosave cannot put it back
        openSong(ensureSandbox());
      }
      renderLibraryList();
    });

    actions.appendChild(open);
    actions.appendChild(rename);
    actions.appendChild(remove);

    row.appendChild(meter);
    row.appendChild(middle);
    row.appendChild(actions);
    return row;
  }

  function libraryGroup(label, ids, lib, emptyText) {
    const section = document.createElement('section');
    const head = document.createElement('div');
    head.className = 'library-group-head';
    head.innerHTML = '<span class="library-group-title">' + label + '</span>'
                   + '<span class="library-group-rule"></span>';
    section.appendChild(head);

    if (!ids.length) {
      const empty = document.createElement('div');
      empty.className = 'library-empty';
      empty.textContent = emptyText;
      section.appendChild(empty);
    } else {
      ids.forEach(id => section.appendChild(buildSongRow(id, normalizeSong(lib[id]))));
    }
    return section;
  }

  /* The sandbox's own row: no rename, no delete — Clear instead, which
     hands back the blank page it started as. */
  function buildSandboxRow() {
    const lib = getStoredLibrary();
    const record = lib[SANDBOX_ID] ? normalizeSong(lib[SANDBOX_ID]) : freshSandbox();
    const isCurrent = song.id === SANDBOX_ID;

    const row = document.createElement('div');
    row.className = 'library-song sandbox-song' + (isCurrent ? ' current' : '');

    const meter = document.createElement('span');
    meter.className = 'meter-badge';
    meter.textContent = record.timeSignatureNumerator + '/' + record.timeSignatureDenominator;

    const middle = document.createElement('div');
    middle.style.cssText = 'flex:1;min-width:0;display:flex;flex-direction:column;gap:1px';
    const title = document.createElement('span');
    title.className = 'library-song-title';
    title.textContent = SANDBOX_TITLE;
    const sub = document.createElement('span');
    sub.className = 'library-song-sub';
    sub.textContent = 'Scratch work — not in your library';
    middle.appendChild(title);
    middle.appendChild(sub);

    const actions = document.createElement('div');
    actions.className = 'library-song-actions';

    const open = document.createElement('button');
    open.className = 'lib-btn' + (isCurrent ? ' is-current' : '');
    open.textContent = isCurrent ? 'Open now' : 'Open';
    open.disabled = isCurrent;
    if (!isCurrent) {
      open.addEventListener('click', () => {
        flushAutosave();
        openSong(ensureSandbox());
        closeSheet(librarySheet);
        toast('Opened the sandbox');
      });
    }

    const clear = document.createElement('button');
    clear.className = 'lib-btn';
    clear.textContent = 'Clear';
    clear.title = 'Start the sandbox over with a blank page';
    clear.addEventListener('click', () => {
      if (!confirm('Clear the sandbox and start with a blank page? This cannot be undone.')) return;
      clearSandbox();
      renderLibraryList();
      toast('Sandbox cleared');
    });

    actions.appendChild(open);
    actions.appendChild(clear);
    row.appendChild(meter);
    row.appendChild(middle);
    row.appendChild(actions);
    return row;
  }

  function renderLibraryList() {
    const lib = getStoredLibrary();
    libraryList.innerHTML = '';

    /* In a lesson the library is the lesson: the exercises that came in
       the link, in the order the teacher picked them, and nothing else.
       This is a filter on the same list, not a second store — a
       student's work is saved exactly where anyone else's is. */
    if (lessonMeta) {
      const ids = lessonMeta.songIds.filter(id => lib[id]);
      libraryList.appendChild(libraryGroup(lessonMeta.title || 'This lesson', ids, lib,
        'Nothing came with this lesson.'));
      return;
    }

    /* The sandbox comes first, in a group of its own: it is not a
       library ostinato, so it is not listed with them. A lesson has no
       sandbox — there the library is the lesson. */
    const sandboxSection = document.createElement('section');
    const sandboxHead = document.createElement('div');
    sandboxHead.className = 'library-group-head';
    sandboxHead.innerHTML = '<span class="library-group-title">Sandbox</span>'
                          + '<span class="library-group-rule"></span>';
    sandboxSection.appendChild(sandboxHead);
    sandboxSection.appendChild(buildSandboxRow());
    libraryList.appendChild(sandboxSection);

    const { mine, starters } = sortedSongIds(lib);
    libraryList.appendChild(libraryGroup('Yours', mine, lib,
      'Nothing yet — press New ostinato, or save a copy of a starter.'));
    libraryList.appendChild(libraryGroup('Starters', starters, lib,
      'The starters have all been deleted.'));
  }


  /* ==================================================================
     NAMING A SONG
     ------------------------------------------------------------------
     One modal does both jobs, because they ask the same question and
     only differ in what happens to the answer.
     ================================================================== */

  const titleModal   = document.getElementById('title-modal');
  const titleInput   = document.getElementById('title-input');
  const titleStatus  = document.getElementById('title-status');
  const titleHeading = document.getElementById('title-modal-heading');
  const titleSub     = document.getElementById('title-modal-sub');
  const titleConfirm = document.getElementById('title-confirm');

  let titleIntent = 'new';   // 'new' | 'copy'

  function askForTitle(intent) {
    titleIntent = intent;
    const making = intent === 'new';
    const fromSandbox = !making && isSandbox(song.id);
    titleHeading.textContent = making ? 'Create a new ostinato'
      : (fromSandbox ? 'Save to your library' : 'Save as…');
    titleSub.textContent = making
      ? 'Give it a name so you can find it later.'
      : (fromSandbox
        ? 'Your sandbox stays as it is. This adds a copy to your library, and you carry on in that copy.'
        : 'The copy is yours to change; the original is left as it is.');
    titleConfirm.textContent = making ? 'Create' : (fromSandbox ? 'Save to library' : 'Save');
    titleInput.value = (making || fromSandbox) ? '' : (song.title || 'Untitled ostinato') + ' copy';
    titleStatus.textContent = '';
    openSheet(titleModal);
    setTimeout(() => { titleInput.focus(); titleInput.select(); }, 40);
  }

  function submitTitle() {
    const value = titleInput.value.trim();
    if (!value) {
      titleStatus.textContent = 'It needs a name.';
      titleStatus.className = 'status-msg error';
      titleInput.focus();
      return;
    }
    closeSheet(titleModal);
    closeSheet(librarySheet);
    if (titleIntent === 'new') createSong(value); else saveCopy(value);
  }

  titleConfirm.addEventListener('click', submitTitle);
  document.getElementById('title-cancel').addEventListener('click', () => closeSheet(titleModal));
  titleInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); submitTitle(); }
  });
  wireSheet(titleModal, 'title-modal-close');

  document.getElementById('new-song-btn').addEventListener('click', () => askForTitle('new'));
  document.getElementById('save-copy-btn').addEventListener('click', () => askForTitle('copy'));


  /* ==================================================================
     SHARE & BACKUP
     ================================================================== */

  const backupSheet    = document.getElementById('backup-sheet');
  const shareRow       = document.getElementById('share-row');
  const shareLinkInput = document.getElementById('share-link');
  const shareStatus    = document.getElementById('share-status');
  const copyLinkLabel  = document.getElementById('copy-link-label');
  const exportList     = document.getElementById('export-list');
  const exportFilename = document.getElementById('export-filename');
  const importStatus   = document.getElementById('import-status');
  const importFile     = document.getElementById('import-file');
  const resetStatus    = document.getElementById('reset-status');
  const lockLayoutRow  = document.getElementById('lock-layout-row');

  wireSheet(backupSheet, 'backup-close');

  document.getElementById('share-backup-btn').addEventListener('click', () => {
    flushAutosave();
    shareRow.hidden = true;
    shareStatus.textContent = '';
    importStatus.textContent = '';
    resetStatus.textContent = '';
    exportFilename.value = slugify(song.title || 'ostinatos') + '-backup';
    if (lockLayoutCheck) lockLayoutCheck.checked = false;
    showHide(lockLayoutRow, layoutEditable());
    renderExportList();
    openSheet(backupSheet);
  });

  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /* ---- a link that carries the whole piece ---- */

  function encodeSong(record) {
    const bytes = new TextEncoder().encode(JSON.stringify(record));
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function decodeSong(encoded) {
    try {
      const binary = atob(encoded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
      return null;
    }
  }

  const lockLayoutCheck = document.getElementById('lock-layout-check');

  document.getElementById('make-link-btn').addEventListener('click', () => {
    flushAutosave();
    const record = snapshot();
    const fromSandbox = isSandbox(record.id);
    delete record.id;                 // the receiver files it as their own
    /* A sandbox travels marked as one, and lands in the receiver's
       sandbox rather than in their library: scratch work stays scratch
       work on both ends. */
    if (fromSandbox) { record.sandbox = true; record.title = SANDBOX_TITLE; }

    /* The ten-per-cent version of a lesson, for the eighty-per-cent
       case: no task, no scoped library, none of that machinery — just
       the sender's own build rules travelling with the piece, locked. */
    if (lockLayoutCheck && lockLayoutCheck.checked) {
      record.layout = layoutSnapshot();
      record.layoutLocked = true;
    }
    const base = window.location.origin + window.location.pathname;
    const link = base + '?song=' + encodeURIComponent(encodeSong(record));

    shareLinkInput.value = link;
    shareRow.hidden = false;

    /* A file:// page has no origin worth sending, and the link would be
       useless to anyone else. Say so rather than handing over something
       that cannot work. */
    if (window.location.protocol === 'file:') {
      shareStatus.textContent = 'This page is open from a folder, so the link only works on this computer.';
      shareStatus.className = 'status-msg error';
    } else {
      shareStatus.className = 'status-msg';
      copyLink();
    }
  });

  /* Served over plain http on a school network — anything but localhost —
     navigator.clipboard is absent rather than merely refused, so calling
     writeText on it throws before there is a promise to hang .catch() on
     and the Copy button would do nothing at all, silently. async here so
     that throw lands in the try, with execCommand behind it. */
  async function writeToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const scratch = document.createElement('textarea');
      scratch.value = text;
      scratch.style.position = 'fixed';
      scratch.style.left = '-999999px';
      document.body.appendChild(scratch);
      scratch.focus();
      scratch.select();
      try {
        const ok = document.execCommand('copy');
        scratch.remove();
        return ok;
      } catch (err2) {
        scratch.remove();
        return false;
      }
    }
  }

  function copyLink() {
    if (!shareLinkInput.value) return;
    writeToClipboard(shareLinkInput.value).then(ok => {
      if (ok) {
        copyLinkLabel.textContent = 'Copied';
        shareStatus.textContent = 'Link copied to your clipboard.';
        shareStatus.className = 'status-msg good';
        setTimeout(() => { copyLinkLabel.textContent = 'Copy'; }, 2500);
      } else {
        shareLinkInput.focus();
        shareLinkInput.select();
        shareStatus.textContent = 'Select and copy the link above.';
        shareStatus.className = 'status-msg';
      }
    });
  }
  document.getElementById('copy-link-btn').addEventListener('click', copyLink);

  /* ---- backup files ---- */

  function renderExportList() {
    const lib = getStoredLibrary();
    const ids = sortedSongIds(lib).all;
    exportList.innerHTML = '';
    ids.forEach(id => {
      const record = normalizeSong(lib[id]);
      const row = document.createElement('label');
      row.className = 'export-row';
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.value = id;
      box.checked = true;
      const name = document.createElement('span');
      name.textContent = record.title;
      row.appendChild(box);
      row.appendChild(name);
      exportList.appendChild(row);
    });
  }

  function setAllExport(checked) {
    exportList.querySelectorAll('input[type="checkbox"]').forEach(b => { b.checked = checked; });
  }
  document.getElementById('export-all').addEventListener('click', () => setAllExport(true));
  document.getElementById('export-none').addEventListener('click', () => setAllExport(false));

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 40000);
  }

  document.getElementById('export-btn').addEventListener('click', () => {
    const lib = getStoredLibrary();
    const chosen = [...exportList.querySelectorAll('input:checked')]
      .map(b => lib[b.value]).filter(Boolean);

    if (!chosen.length) {
      importStatus.textContent = '';
      resetStatus.textContent = '';
      toast('Tick at least one ostinato first');
      return;
    }

    let name = exportFilename.value.trim() || 'ostinatos';
    if (!name.endsWith('.json')) name += '.json';

    downloadBlob(new Blob([JSON.stringify({
      app: 'Eagle View Music Ostinato Builder',
      version: 1,
      exportedAt: new Date().toISOString(),
      count: chosen.length,
      songs: chosen
    }, null, 2)], { type: 'application/json' }), name);

    toast('Backup saved to your downloads');
  });

  document.getElementById('import-btn').addEventListener('click', () => importFile.click());

  importFile.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      let incoming = [];
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed)) incoming = parsed;
        else if (parsed && Array.isArray(parsed.songs)) incoming = parsed.songs;
        else if (parsed && typeof parsed === 'object') {
          Object.keys(parsed).forEach(k => {
            const v = parsed[k];
            if (v && typeof v === 'object' && (v.tracks || v.title)) incoming.push(v);
          });
        }
      } catch (err) {
        importStatus.textContent = 'That file is not readable as JSON.';
        importStatus.className = 'status-msg error';
        importFile.value = '';
        return;
      }

      incoming = incoming.filter(x => x && typeof x === 'object' && Array.isArray(x.tracks));
      if (!incoming.length) {
        importStatus.textContent = 'No ostinatos found in that file.';
        importStatus.className = 'status-msg error';
        importFile.value = '';
        return;
      }

      /* Imports are added, never merged over: a song already in the
         library keeps its place and the arrival gets a fresh id. */
      const lib = getStoredLibrary();
      let added = 0;
      incoming.forEach(raw => {
        const record = normalizeSong(raw);
        if (!record.tracks.length) return;
        if (lib[record.id]) record.id = newSongId();
        record.isCustom = true;
        record.createdAt = Date.now();
        lib[record.id] = record;
        added++;
      });
      saveStoredLibrary(lib);
      renderExportList();
      renderLibraryList();

      importStatus.textContent = added === 1 ? 'Added 1 ostinato.' : 'Added ' + added + ' ostinatos.';
      importStatus.className = 'status-msg good';
      importFile.value = '';
    };
    reader.readAsText(file);
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm('Delete every ostinato you have made and put the starters back? This cannot be undone.')) return;
    clearTimeout(autosaveTimer);          // nothing on screen should survive this
    try {
      localStorage.removeItem(LIBRARY_KEY);
      localStorage.removeItem(ACTIVE_ID_KEY);
      /* This is deliberately also the only way out of a locked layout.
         Somebody who tried their own locked link on, or a class machine
         that needs putting back to factory, has one lever rather than a
         second unlock mechanism to find and explain. */
      localStorage.removeItem(LAYOUT_KEY);
      localStorage.removeItem(LESSON_SOURCE_KEY);
    } catch (e) {}
    policy = null;
    lessonMeta = null;
    loadLayout();
    song.id = null;
    getStoredLibrary();                   // writes the starters back
    openSong(ensureSandbox());
    renderExportList();
    renderLibraryList();
    applyPolicyToShell();
    resetStatus.textContent = 'Everything deleted, starters restored.';
    resetStatus.className = 'status-msg good';
  });


  /* ==================================================================
     A PICTURE OF THE SCORE
     ------------------------------------------------------------------
     A JPEG on solid white, and each of those words is doing work.

     JPEG, because a JPEG cannot carry transparency. The old picture was a
     PNG with an alpha channel, so every pixel the app had not painted came
     out see-through: on a white page it looked right, and pasted into a
     slide, a document or a dark-themed anything it came out as a black or
     chequered rectangle with the notes floating in it.

     Solid white, and not merely asked for. html2canvas is told a white
     background, but the canvas it hands back still has an alpha channel
     and a stray translucent pixel in it stays translucent. So white is
     painted in behind everything before the shot is encoded. Whatever it
     contained, what leaves here is opaque.

     What is in frame matters as much. #grid is normally a peephole: each
     bar strip is clipped to one page wide and slid sideways underneath,
     which is how paging works. Photographed as it stands, an eight-bar
     ostinato came out as whichever page was open, with the last bar line
     shaved off the edge. So the paging is taken off for the shot — the
     strips go back to their full width and slide home — the stylesheet
     opens the clipping and adds a margin, and the whole piece is
     photographed at its natural size. applyLayout() puts all of it back.

     Photographing the whole piece is also what put this within reach of
     the canvas size ceiling, which is what captureScale() below is for.
     ================================================================== */

  const savePictureBtn            = document.getElementById('save-picture-btn');
  const pictureModal              = document.getElementById('picture-modal');
  const pictureFilename           = document.getElementById('picture-filename');
  const picturePagesGroup         = document.getElementById('picture-pages-group');
  const pictureChoiceCurrent      = document.getElementById('picture-choice-current');
  const pictureChoiceAll          = document.getElementById('picture-choice-all');
  const pictureChoiceCurrentTitle = document.getElementById('picture-choice-current-title');
  const pictureChoiceAllTitle     = document.getElementById('picture-choice-all-title');
  const pictureScrollNote         = document.getElementById('picture-scroll-note');
  const pictureStatus             = document.getElementById('picture-status');
  const pictureCancel             = document.getElementById('picture-cancel');
  const pictureConfirm            = document.getElementById('picture-confirm');
  const pictureConfirmLabel       = document.getElementById('picture-confirm-label');

  /* ---- handing the engraving over as pictures ----

     html2canvas cannot photograph an inline <svg> where it stands. It
     rasterises one by serialising the element on its own — and it copies
     the element's computed style on to it first, so `position: absolute;
     left: 22px` travels into a little document where there is nothing to
     be 22px from, the drawing is shoved 22px right, and the far end of it
     falls off the edge. That is the sliced notehead at the end of every
     beat and the clipped beam in the old pictures.

     Two more things are lost in that little document: the stylesheet,
     which is where the notation gets its colour (a filled path, a stroked
     tuplet bracket), and the SVG's overflow, which goes back to hidden
     when it is a document's root rather than an element on a page.

     So each engraving is handed over already rasterised, as an <img> of
     exactly the same box, which html2canvas has no trouble placing. Paint
     is baked on to every shape as presentation attributes, and the box is
     bled out to whatever the drawing actually covers, so a flag or a beam
     reaching past the viewBox comes too. The <svg>s go back afterwards. */
  const PAINT = ['fill', 'stroke', 'stroke-width', 'stroke-linecap',
                 'stroke-linejoin', 'fill-opacity', 'stroke-opacity', 'opacity',
                 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor'];

  function bakePaint(live, copy) {
    const from = [live].concat([...live.querySelectorAll('*')]);
    const to   = [copy].concat([...copy.querySelectorAll('*')]);
    from.forEach((el, i) => {
      const target = to[i];
      if (!target) return;
      const cs = getComputedStyle(el);
      PAINT.forEach(prop => {
        const v = cs.getPropertyValue(prop);
        if (v) target.setAttribute(prop, v);
      });
      target.removeAttribute('style');
      target.removeAttribute('class');
    });
  }

  /* Fills `swaps` as it goes rather than returning it at the end, so a
     throw halfway through still leaves the caller holding every swap made
     so far and every <svg> goes back. */
  async function engravingsAsImages(root, swaps) {
    root.querySelectorAll('.notes-box > svg').forEach(svg => {
      const cs = getComputedStyle(svg);
      const vb = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number);
      if (vb.length !== 4 || vb.some(isNaN)) return;
      const [vx, vy, vw, vh] = vb;

      /* how far the drawing reaches outside the box it was given */
      let bb;
      try { bb = svg.getBBox(); } catch (e) { return; }
      const padL = Math.max(0, Math.ceil(vx - bb.x));
      const padT = Math.max(0, Math.ceil(vy - bb.y));
      const padR = Math.max(0, Math.ceil((bb.x + bb.width) - (vx + vw)));
      const padB = Math.max(0, Math.ceil((bb.y + bb.height) - (vy + vh)));
      const outW = vw + padL + padR;
      const outH = vh + padT + padB;

      const copy = svg.cloneNode(true);
      bakePaint(svg, copy);
      copy.setAttribute('viewBox', (vx - padL) + ' ' + (vy - padT) + ' ' + outW + ' ' + outH);
      copy.setAttribute('width', outW);
      copy.setAttribute('height', outH);

      /* The element's own box is in CSS pixels and the drawing's is in
         viewBox units; the two are the same here, but the scale is taken
         rather than assumed so a future --note-h cannot quietly break it. */
      const sx = (parseFloat(cs.width) || vw) / vw;
      const sy = (parseFloat(cs.height) || vh) / vh;

      const img = document.createElement('img');
      img.src = 'data:image/svg+xml,'
              + encodeURIComponent(new XMLSerializer().serializeToString(copy));
      img.alt = '';
      img.style.cssText = 'position:absolute;z-index:2;'
        + 'left:' + ((parseFloat(cs.left) || 0) - padL * sx) + 'px;'
        + 'top:'  + ((parseFloat(cs.top)  || 0) - padT * sy) + 'px;'
        + 'width:'  + (outW * sx) + 'px;'
        + 'height:' + (outH * sy) + 'px;';

      svg.replaceWith(img);
      swaps.push({ svg: svg, img: img });
    });

    await Promise.all(swaps.map(s =>
      s.img.decode ? s.img.decode().catch(() => {})
                   : new Promise(r => { s.img.onload = s.img.onerror = r; })));
  }

  /* Paint white behind whatever was drawn. A JPEG encoder composites
     transparency against black unless something is put underneath it
     first, which is what made the old picture paste as a black rectangle.

     Done in place with destination-over rather than on a fresh canvas:
     a second canvas the size of a big score is the allocation most likely
     to be the one a browser refuses. */
  function onWhite(shot) {
    const ctx = shot.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, shot.width, shot.height);
    ctx.restore();
    return shot;
  }

  /* ---- how big a picture the browser will actually make ----

     A canvas has a ceiling, and it is lower than anyone expects: Safari
     stops at about 16.7 million pixels of area however the sides are
     arranged, and a canvas over it comes back blank or not at all — which
     reads, several steps later, as "could not save the picture".

     The old picture never came near it because it only ever photographed
     the page that was open. Photographing the whole piece does: eight bars
     of eight instruments is 3798 x 1414, and at a flat scale of 2 that is
     21.5 million pixels. So the scale is worked out from the size of the
     score rather than fixed — a large score is drawn at a lower resolution
     instead of failing to be drawn at all, and a small one still gets the
     full 2x. */
  const MAX_CANVAS_AREA = 16000000;
  const MAX_CANVAS_SIDE = 16384;

  /* No lower bound on purpose: a floor here would be a floor the ceiling
     could not get under, and the whole job of this is that the answer is
     always small enough. Eight bars of ten instruments still lands near
     1.7x, so in practice nothing legible is given away. */
  function captureScale(w, h) {
    if (!w || !h) return 1;
    return Math.min(
      2,
      MAX_CANVAS_SIDE / w,
      MAX_CANVAS_SIDE / h,
      Math.sqrt(MAX_CANVAS_AREA / (w * h))
    );
  }

  /* toBlob is the tidy way and can still hand back nothing where
     toDataURL works, so the older road is kept open behind it. */
  async function savePictureFrom(canvas, filename) {
    const blob = canvas.toBlob
      ? await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.92))
      : null;
    if (blob) { downloadBlob(blob, filename); return; }

    const url = canvas.toDataURL('image/jpeg', 0.92);
    if (url.indexOf('data:image/jpeg') !== 0) throw new Error('the picture would not encode');
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* Some browsers treat an <img> whose source is an SVG as foreign and
     lock the canvas it is drawn on; a locked canvas cannot be saved at
     all. Two pixels is enough to find out, and the answer does not change
     within a session, so it is asked once. If the answer is no, the
     engravings are left as they are: a sliced notehead is a better
     picture than no picture. */
  let svgOnCanvas = null;

  async function svgOnCanvasIsAllowed() {
    if (svgOnCanvas !== null) return svgOnCanvas;
    try {
      const probe = new Image();
      await new Promise((res, rej) => {
        probe.onload = res;
        probe.onerror = rej;
        probe.src = 'data:image/svg+xml,' + encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2">'
          + '<rect width="2" height="2" fill="#000"/></svg>');
      });
      const c = document.createElement('canvas');
      c.width = 2;
      c.height = 2;
      const ctx = c.getContext('2d');
      ctx.drawImage(probe, 0, 0);
      ctx.getImageData(0, 0, 1, 1);     // throws if the canvas is locked
      svgOnCanvas = true;
    } catch (e) {
      console.warn('This browser locks a canvas that an SVG has been drawn on; '
                 + 'the notation will be photographed in place.', e);
      svgOnCanvas = false;
    }
    return svgOnCanvas;
  }

  function sanitizeFilename(name) {
    const cleaned = String(name || '')
      .replace(/\.jpe?g$/i, '')
      .replace(/[/\\?%*:|"<>]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || (song.title ? song.title.trim().replace(/\.jpe?g$/i, '') : '') || 'ostinato';
  }

  function openPictureModal() {
    pictureFilename.value = (song.title && song.title.trim()) ? song.title.trim() : 'ostinato';
    pictureStatus.textContent = '';
    pictureStatus.className = 'status-msg';

    const isPaged = view.layout === 'pages';
    const pages = isPaged ? pageGeometry() : null;
    const count = (pages && pages.length) || pageCount();

    if (isPaged && count > 1) {
      picturePagesGroup.hidden = false;
      pictureScrollNote.hidden = true;
      pictureChoiceCurrent.checked = true;
      const cur = Math.min(count, Math.max(1, currentPage + 1));
      pictureChoiceCurrentTitle.textContent = `Current page (Page ${cur} of ${count})`;
      pictureChoiceAllTitle.textContent = `All pages (${count} pages)`;
    } else {
      picturePagesGroup.hidden = true;
      pictureScrollNote.hidden = false;
      if (isPaged) {
        pictureScrollNote.innerHTML = '<strong>Single page:</strong> This ostinato fits on 1 page and will be saved as a picture.';
      } else {
        pictureScrollNote.innerHTML = '<strong>Scrolling view:</strong> The entire ostinato will be saved in one continuous picture.';
      }
    }

    openSheet(pictureModal);
    setTimeout(() => {
      pictureFilename.focus();
      pictureFilename.select();
    }, 40);
  }

  async function executePictureExport() {
    if (typeof html2canvas !== 'function') {
      toast('The picture tool did not load — check the connection');
      return;
    }
    if (isPlaying) stopPlayback();

    const baseName = sanitizeFilename(pictureFilename.value);
    const isPaged = view.layout === 'pages';
    const pages = isPaged ? pageGeometry() : null;
    const count = (pages && pages.length) || 1;
    const saveAll = isPaged && count > 1 && pictureChoiceAll.checked;

    pictureConfirm.disabled = true;
    pictureCancel.disabled = true;
    pictureConfirmLabel.textContent = 'Saving…';
    pictureStatus.textContent = saveAll ? `Saving page 1 of ${count}…` : 'Saving picture…';
    pictureStatus.className = 'status-msg';

    const swaps = [];
    let success = false;

    try {
      /* Defensive safeguard for file:// and cross-origin environments:
         Ensure all track instrument images inside #grid use data URIs so
         the canvas is never tainted by external local image files. */
      grid.querySelectorAll('.instrument-btn img').forEach(img => {
        if (!img.src.startsWith('data:')) {
          for (const track of song.tracks) {
            const instId = track.instrument;
            if (img.src.includes(instId + '.png') && typeof INSTRUMENT_ICONS !== 'undefined' && INSTRUMENT_ICONS[instId]) {
              const oldSrc = img.src;
              img.src = INSTRUMENT_ICONS[instId];
              swaps.push({ revert: () => { img.src = oldSrc; } });
              break;
            }
          }
        }
      });

      /* Swap SVG engravings to rendered <img> elements before photography */
      try {
        if (await svgOnCanvasIsAllowed()) await engravingsAsImages(grid, swaps);
      } catch (e) {
        console.warn('The notation is being photographed in place:', e);
      }

      if (isPaged && count > 1 && !saveAll) {
        /* Single page from a multi-page score */
        document.body.classList.add('capturing', 'capturing-page');
        grid.style.transform = 'none';
        gridFit.style.width = '';
        gridFit.style.height = '';

        const pageIdx = Math.max(0, Math.min(currentPage, count - 1));
        const page = pages[pageIdx];

        grid.querySelectorAll('.track-body, .ruler-body').forEach(w => {
          w.style.setProperty('width', Math.floor(page.width) + 'px', 'important');
        });
        grid.querySelectorAll('.body-inner, .ruler-inner').forEach(i => {
          i.style.setProperty('transform', 'translateX(' + (-page.left) + 'px)', 'important');
        });

        await new Promise(r => setTimeout(r, 120));

        const headW = parseFloat(getComputedStyle(grid).getPropertyValue('--head-w')) || 0;
        const w = Math.ceil(headW + page.width + 52);
        const h = grid.scrollHeight;
        const shot = await html2canvas(grid, {
          backgroundColor: '#FFFFFF',
          scale: captureScale(w, h),
          useCORS: true,
          logging: false,
          width: w,
          height: h,
          windowWidth: Math.max(document.documentElement.clientWidth, w + 80),
          windowHeight: Math.max(document.documentElement.clientHeight, h + 80)
        });
        if (!shot || !shot.width || !shot.height) {
          throw new Error('the picture came back empty — the score may be too large');
        }

        await savePictureFrom(onWhite(shot), baseName + '.jpg');
        toast('Picture saved to your downloads');
        success = true;

      } else if (isPaged && count > 1 && saveAll) {
        /* All pages from a multi-page score */
        document.body.classList.add('capturing', 'capturing-page');
        grid.style.transform = 'none';
        gridFit.style.width = '';
        gridFit.style.height = '';

        const headW = parseFloat(getComputedStyle(grid).getPropertyValue('--head-w')) || 0;

        for (let p = 0; p < count; p++) {
          pictureStatus.textContent = `Saving page ${p + 1} of ${count}…`;
          const page = pages[p];

          grid.querySelectorAll('.track-body, .ruler-body').forEach(w => {
            w.style.setProperty('width', Math.floor(page.width) + 'px', 'important');
          });
          grid.querySelectorAll('.body-inner, .ruler-inner').forEach(i => {
            i.style.setProperty('transform', 'translateX(' + (-page.left) + 'px)', 'important');
          });

          await new Promise(r => setTimeout(r, 120));

          const w = Math.ceil(headW + page.width + 52);
          const h = grid.scrollHeight;
          const shot = await html2canvas(grid, {
            backgroundColor: '#FFFFFF',
            scale: captureScale(w, h),
            useCORS: true,
            logging: false,
            width: w,
            height: h,
            windowWidth: Math.max(document.documentElement.clientWidth, w + 80),
            windowHeight: Math.max(document.documentElement.clientHeight, h + 80)
          });
          if (!shot || !shot.width || !shot.height) {
            throw new Error(`page ${p + 1} came back empty — the score may be too large`);
          }

          const pageFilename = `${baseName} (${p + 1} of ${count}).jpg`;
          await savePictureFrom(onWhite(shot), pageFilename);

          if (p < count - 1) {
            await new Promise(r => setTimeout(r, 300));
          }
        }

        toast(`Saved all ${count} pages to your downloads`);
        success = true;

      } else {
        /* Continuous score (scrolling view or single-page) */
        document.body.classList.add('capturing', 'capturing-full');
        grid.style.transform = 'none';
        gridFit.style.width = '';
        gridFit.style.height = '';
        grid.querySelectorAll('.track-body, .ruler-body').forEach(w => { w.style.width = ''; });
        grid.querySelectorAll('.body-inner, .ruler-inner').forEach(i => { i.style.transform = 'none'; });

        await new Promise(r => setTimeout(r, 120));

        const w = grid.scrollWidth;
        const h = grid.scrollHeight;
        const shot = await html2canvas(grid, {
          backgroundColor: '#FFFFFF',
          scale: captureScale(w, h),
          useCORS: true,
          logging: false,
          width: w,
          height: h,
          windowWidth: Math.max(document.documentElement.clientWidth, w + 80),
          windowHeight: Math.max(document.documentElement.clientHeight, h + 80)
        });
        if (!shot || !shot.width || !shot.height) {
          throw new Error('the picture came back empty — the score may be too large');
        }

        await savePictureFrom(onWhite(shot), baseName + '.jpg');
        toast('Picture saved to your downloads');
        success = true;
      }
    } catch (err) {
      console.error('Could not save the picture:', err);
      pictureStatus.textContent = 'Could not save picture: ' + (err.message || err);
      pictureStatus.className = 'status-msg error';
      toast('Could not save the picture');
    } finally {
      swaps.forEach(sw => {
        if (sw.revert) sw.revert();
        else if (sw.img && sw.svg) sw.img.replaceWith(sw.svg);
      });
      document.body.classList.remove('capturing', 'capturing-full', 'capturing-page');
      applyLayout();               // restores fit, widths, and current page view
      pictureConfirm.disabled = false;
      pictureCancel.disabled = false;
      pictureConfirmLabel.textContent = 'Save picture';
      if (success) {
        closeSheet(pictureModal);
      }
    }
  }

  savePictureBtn.addEventListener('click', () => {
    if (typeof html2canvas !== 'function') {
      toast('The picture tool did not load — check the connection');
      return;
    }
    closeSheet(librarySheet);
    openPictureModal();
  });

  pictureCancel.addEventListener('click', () => closeSheet(pictureModal));
  pictureConfirm.addEventListener('click', executePictureExport);
  pictureFilename.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executePictureExport();
    }
  });
  wireSheet(pictureModal, 'picture-modal-close');


  /* ==================================================================
     LESSONS
     ------------------------------------------------------------------
     Two halves that never meet. The first is the shell: one pass that
     puts the chrome into whatever state the policy asks for, so no
     individual control has to remember it is in a lesson. The second is
     the teacher's setup sheet, which only ever writes a draft policy and
     turns it into a link.

     The link carries the policy, a copy of the teacher's layout and the
     ostinatos they picked. It is one-way on purpose: there is nothing in
     it to unlock, and the teacher keeps working in their own library,
     which the link never touches.
     ================================================================== */

  const addTrackBtn       = document.getElementById('add-track-btn');
  const newSongBtn        = document.getElementById('new-song-btn');
  const saveCopyBtn       = document.getElementById('save-copy-btn');
  const shareBackupBtn    = document.getElementById('share-backup-btn');
  const layoutSettingsSection = document.getElementById('layout-settings-section');
  const lessonSetupBtn    = document.getElementById('lesson-setup-btn');
  const taskStrip         = document.getElementById('task-strip');
  const taskStripTitle    = document.getElementById('task-strip-title');
  const taskStripNote     = document.getElementById('task-strip-note');
  const previewBar        = document.getElementById('preview-bar');
  const previewExitBtn    = document.getElementById('preview-exit-btn');

  /* The half of the Settings popover that is about how the score is
     drawn, as opposed to the way through to Layout settings. */
  const settingsViewSections = ['settings-layout', 'settings-onpage', 'settings-play']
    .map(id => document.getElementById(id));

  /* A class rather than the hidden attribute: some of these already have
     a display set by their own rules, and a policy has to win. */
  function showHide(el, on) { if (el) el.classList.toggle('policy-off', !on); }

  /* The counting systems on offer. One system is not a choice, so the
     dropdown goes and the syllables simply appear in it. */
  function syncSystemOptions() {
    if (!systemSelect) return;
    const offered = systemsOffered();
    const want = offered.join('|');
    if (systemSelect.dataset.offered !== want) {
      systemSelect.dataset.offered = want;
      systemSelect.innerHTML = '';
      offered.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        systemSelect.appendChild(opt);
      });
    }
    if (offered.indexOf(view.syllableSystem) === -1) view.syllableSystem = offered[0];
  }

  function applyPolicyToShell() {
    const inLesson = !!policy;

    /* Add instrument is two questions at once: may this lesson change
       which instruments are playing, and is there room for another. */
    showHide(addTrackBtn, instrumentsEditable() && song.tracks.length < maxTracksAllowed());
    showHide(presentBtn, shellAllows('present'));
    showHide(metronomeBtn, shellAllows('count'));
    showHide(savePictureBtn, shellAllows('picture'));

    /* A student's library is the lesson; none of the authoring lives
       there. Share & backup goes with it — which is also the one way
       back out of a locked layout, and deliberately still reachable
       outside a lesson. */
    showHide(newSongBtn, !inLesson);
    showHide(saveCopyBtn, !inLesson);
    showHide(shareBackupBtn, !inLesson);
    showHide(lessonSetupBtn, !inLesson);
    showHide(songChip, libraryMode() !== 'none');

    /* Half the Settings popover is how the score is drawn, which a
       lesson may take away; the other half is the way in to Layout
       settings, which a locked layout takes away. The button itself only
       goes when both have. */
    settingsViewSections.forEach(el => showHide(el, shellAllows('view')));
    showHide(layoutSettingsSection, layoutEditable());
    /* The dots button appears in none of these lists, anywhere, on
       purpose — see the note on it below. */
    showHide(settingsBtn, shellAllows('view') || layoutEditable());
    if (!shellAllows('view') && !layoutEditable()) closeSettings();

    bpmButton.classList.toggle('fixed', tempoLocked());
    bpmButton.title = tempoLocked() ? 'The tempo of this piece' : 'Tap to type a tempo';

    if (taskStrip) {
      taskStrip.hidden = !inLesson;
      if (inLesson) {
        taskStripTitle.textContent = (lessonMeta && lessonMeta.title) || 'Lesson';
        taskStripNote.textContent = taskBlurb();
      }
    }

    updateMeterDisplay();
    updateMeasureDisplay();
    syncSettings();
  }

  /* ---- opening a lesson link -------------------------------------- */

  const LESSON_SOURCE_KEY = 'ostinato_builder_lesson_sources_v1';

  function lessonSlug(text) {
    return String(text || 'lesson').toLowerCase().replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '').slice(0, 32) || 'lesson';
  }

  function checkUrlForLesson() {
    let raw = null;
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      if (params.has('lesson')) raw = params.get('lesson');
    }
    if (!raw) {
      const params = new URLSearchParams(window.location.search);
      if (params.has('lesson')) raw = params.get('lesson');
    }
    if (!raw) return null;
    const payload = decodeSong(raw);
    return (payload && payload.lesson) ? payload : null;
  }

  function readLessonSources() {
    try { return JSON.parse(localStorage.getItem(LESSON_SOURCE_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  function writeLessonSources(map) {
    try { localStorage.setItem(LESSON_SOURCE_KEY, JSON.stringify(map)); } catch (e) {}
  }

  /* The exercises land in the student's own library under ids derived
     from the lesson, so opening the same link twice is not two copies —
     and, more to the point, a student who comes back tomorrow finds
     yesterday's work rather than a blank page. The teacher's untouched
     original is kept alongside under its own key, which is what "Start
     this one again" restores. */
  function openLesson(payload) {
    const p = normalizePolicy(payload.policy);
    if (!p) return null;

    const title = (payload.title && String(payload.title).trim()) || 'Lesson';
    const stem = 'lesson_' + lessonSlug(title) + '_';
    const lib = getStoredLibrary();
    const sources = readLessonSources();
    const ids = [];

    (payload.songs || []).forEach((record, i) => {
      const id = stem + i;
      const fresh = normalizeSong(Object.assign({}, record, {
        id: id, isCustom: true, createdAt: Date.now() + i
      }));
      if (!fresh.tracks.length) return;
      sources[id] = fresh;                                     // always pristine
      if (!lib[id]) lib[id] = JSON.parse(JSON.stringify(fresh)); // seeded once only
      ids.push(id);
    });

    if (!ids.length) return null;

    saveStoredLibrary(lib);
    writeLessonSources(sources);

    policy = p;
    lessonMeta = { title: title, songIds: ids };

    /* The lesson brings the teacher's layout with it, and locks it.
       There would be no point narrowing the vocabulary in Layout
       settings if the first thing a student could do was open that sheet
       and widen it again. The dots button is not part of this. */
    applyLayoutSnapshot(payload.layout, true);

    try { window.history.replaceState(null, document.title, window.location.pathname); } catch (e) {}
    return ids[0];
  }

  /* Put one exercise back the way the teacher sent it. */
  function restoreLessonSong(id) {
    const sources = readLessonSources();
    if (!sources[id]) return false;
    const lib = getStoredLibrary();
    lib[id] = JSON.parse(JSON.stringify(sources[id]));
    saveStoredLibrary(lib);
    if (id === song.id) { clearTimeout(autosaveTimer); openSong(id); }
    return true;
  }

  function lessonHasSource(id) { return !!readLessonSources()[id]; }


  /* ==================================================================
     SET UP FOR STUDENTS
     ------------------------------------------------------------------
     What is left once Layout settings owns the vocabulary: what the
     class is being asked to do, how much of the piece they may move, and
     how much of the app comes along. The rhythms themselves are whatever
     the teacher has already built.
     ================================================================== */

  const TASK_TYPES = [
    { id: 'free',        label: 'Explore',
      desc: 'The rhythms and the instruments are both theirs.',   r: false, i: false },
    { id: 'rhythms',     label: 'Write the parts',
      desc: 'Your instruments are fixed. They write a rhythm for each.', r: false, i: true },
    { id: 'instruments', label: 'Orchestrate it',
      desc: 'Your rhythms are fixed. They choose who plays them.', r: true,  i: false },
    { id: 'read',        label: 'Read and play',
      desc: 'Nothing changes — for reading and performing.',  r: true,  i: true }
  ];

  const SHELL_SWITCHES = [
    { key: 'view',    name: 'View options',   desc: 'Pages or scrolling, bars to a page, size, syllables' },
    { key: 'count',   name: 'Count the beat', desc: 'The metronome button' },
    { key: 'present', name: 'Present mode',   desc: 'Fills the screen for performing' },
    { key: 'picture', name: 'Save a picture', desc: 'Downloads the score as an image' }
  ];

  const LENGTH_SWITCHES = [
    { key: 'canAdd',    name: 'Add bars',    desc: 'The + on the bar stepper' },
    { key: 'canRemove', name: 'Remove bars', desc: 'The − on the bar stepper' }
  ];

  let draft = null;           // { id, title, policy, songIds }
  let previewing = false;
  let previewLayoutLock = false;

  function newDraft() {
    return { title: '', policy: blankPolicy(), songIds: [] };
  }

  const lessonSetupSheet  = document.getElementById('lesson-setup-sheet');
  const taskGrid          = document.getElementById('lesson-task-grid');
  const taskNoteInput     = document.getElementById('lesson-task-note');
  const tempoSeg          = document.getElementById('lesson-tempo-seg');
  const tempoRangeBox     = document.getElementById('lesson-tempo-range');
  const tempoMinInput     = document.getElementById('lesson-tempo-min');
  const tempoMaxInput     = document.getElementById('lesson-tempo-max');
  const tempoNote         = document.getElementById('lesson-tempo-note');
  const lengthList        = document.getElementById('lesson-length');
  const maxMeasuresInput  = document.getElementById('lesson-max-measures');
  const maxTracksInput    = document.getElementById('lesson-max-tracks');
  const lessonSongList    = document.getElementById('lesson-song-list');
  const lessonSongsAll    = document.getElementById('lesson-songs-all');
  const lessonSongsNone   = document.getElementById('lesson-songs-none');
  const shellList         = document.getElementById('lesson-shell');
  const lessonTitleInput  = document.getElementById('lesson-title-input');
  const lessonPreviewBtn  = document.getElementById('lesson-preview-btn');
  const lessonLinkBtn     = document.getElementById('lesson-link-btn');
  const lessonLinkRow     = document.getElementById('lesson-link-row');
  const lessonLinkInput   = document.getElementById('lesson-link-input');
  const lessonLinkCopy    = document.getElementById('lesson-link-copy');
  const lessonLinkCopyText = document.getElementById('lesson-link-copy-text');
  const lessonLinkFeedback = document.getElementById('lesson-link-feedback');
  const lessonSavedList   = document.getElementById('lesson-saved-list');
  const lessonSavedCard   = document.getElementById('lesson-saved-card');
  const lessonLayoutSummary = document.getElementById('lesson-layout-summary');

  /* A short, honest account of what the link will carry out of Layout
     settings, so nobody has to remember what they set up in there. */
  function renderLayoutSummary() {
    if (!lessonLayoutSummary) return;
    const meters = layout.meters.simple.concat(layout.meters.compound);
    const allMeters = METERS.simple.length + METERS.compound.length;
    const bits = [];

    bits.push(meters.length === allMeters ? 'every meter'
      : meters.length === 1 ? meters[0] + ' only'
      : meters.join(', '));

    const divides = [];
    if (layout.divide.sixteenths !== false) divides.push('sixteenths');
    if (layout.divide.tuplets !== false) divides.push('triplets');
    if (layout.divide.subTuplets !== false) divides.push('subdivided triplets');
    bits.push(divides.length ? divides.join(', ') : 'no beat splitting');

    const cap = joinCap();
    bits.push(cap <= 1 ? 'no joining beats' : 'joins up to ' + Math.min(cap, 4) + ' beats');

    const kit = instrumentsOffered();
    bits.push(kit.length === VI.INSTRUMENT_IDS.length
      ? 'every instrument'
      : kit.length + ' of ' + VI.INSTRUMENT_IDS.length + ' instruments');

    const narrowed = [];
    ['simple', 'compound'].forEach(fam => {
      Object.keys(layout.cells[fam]).forEach(slots => {
        narrowed.push(layout.cells[fam][slots].length + ' of ' + patternsFor(+slots).length
          + ' shapes at ' + slots + ' to a beat');
      });
    });

    lessonLayoutSummary.innerHTML = '';
    const line = document.createElement('p');
    line.className = 'card-desc';
    line.textContent = 'Students get what you have set up: ' + bits.join(' · ') + '.'
      + (narrowed.length ? ' Narrowed to ' + narrowed.join(', ') + '.' : '');
    lessonLayoutSummary.appendChild(line);

    const open = document.createElement('button');
    open.className = 'text-tool';
    open.textContent = 'Change in Layout settings';
    open.addEventListener('click', () => {
      closeSheet(lessonSetupSheet);
      openLayoutSheet();
    });
    lessonLayoutSummary.appendChild(open);
  }

  function renderTask() {
    if (!taskGrid) return;
    taskGrid.innerHTML = '';
    const current = TASK_TYPES.find(t =>
      t.r === draft.policy.task.rhythmLocked && t.i === draft.policy.task.instrumentsLocked);

    TASK_TYPES.forEach(type => {
      const card = document.createElement('button');
      card.className = 'task-card' + (current && current.id === type.id ? ' active' : '');
      card.innerHTML = '<span class="task-card-label"></span><span class="task-card-desc"></span>';
      card.querySelector('.task-card-label').textContent = type.label;
      card.querySelector('.task-card-desc').textContent = type.desc;
      card.addEventListener('click', () => {
        draft.policy.task.rhythmLocked = type.r;
        draft.policy.task.instrumentsLocked = type.i;
        renderSetupSheet();
      });
      taskGrid.appendChild(card);
    });

    if (taskNoteInput) {
      taskNoteInput.placeholder = TASK_BLURB[current ? current.id : 'free'];
      taskNoteInput.value = draft.policy.task.note || '';
    }
  }

  function renderTempo() {
    if (!tempoSeg) return;
    const t = draft.policy.tempo;
    const mode = t.locked ? 'locked' : (t.min > 40 || t.max < 240) ? 'range' : 'any';
    tempoSeg.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tempo === mode);
    });
    if (tempoRangeBox) tempoRangeBox.hidden = mode !== 'range';
    if (tempoMinInput) tempoMinInput.value = t.min;
    if (tempoMaxInput) tempoMaxInput.value = t.max;
    if (tempoNote) {
      tempoNote.textContent = mode === 'locked'
        ? 'The tempo reads as plain text at whatever each ostinato was saved at.'
        : mode === 'range'
          ? 'Typing outside ' + t.min + '–' + t.max + ' is pulled back into it.'
          : 'They can set any tempo.';
    }
  }

  function renderLength() {
    if (!lengthList) return;
    lengthList.innerHTML = '';
    LENGTH_SWITCHES.forEach(item => {
      lengthList.appendChild(switchRow(item.name, item.desc, draft.policy.structure[item.key], () => {
        draft.policy.structure[item.key] = !draft.policy.structure[item.key];
        renderLength();
      }));
    });
    if (maxMeasuresInput) maxMeasuresInput.value = draft.policy.structure.maxMeasures || '';
    if (maxTracksInput) maxTracksInput.value = draft.policy.structure.maxTracks || '';
  }

  function renderShell() {
    if (!shellList) return;
    shellList.innerHTML = '';
    SHELL_SWITCHES.forEach(item => {
      shellList.appendChild(switchRow(item.name, item.desc, draft.policy.shell[item.key], () => {
        draft.policy.shell[item.key] = !draft.policy.shell[item.key];
        renderShell();
      }));
    });
    shellList.appendChild(switchRow(
      'Move between the ostinatos',
      draft.songIds.length > 1
        ? 'The name at the top, holding this lesson’s ' + draft.songIds.length + ' ostinatos'
        : 'The name at the top — with one ostinato there is nothing to move to',
      draft.policy.shell.library !== 'none',
      () => {
        draft.policy.shell.library = draft.policy.shell.library === 'none' ? 'lesson' : 'none';
        renderShell();
      }
    ));

    const sub = document.createElement('div');
    sub.className = 'lesson-sub';
    sub.textContent = 'Counting systems';
    shellList.appendChild(sub);

    const row = document.createElement('div');
    row.className = 'chip-row';
    const chosen = draft.policy.shell.systems || SYLLABLE_SYSTEMS;
    SYLLABLE_SYSTEMS.forEach(name => {
      const on = chosen.indexOf(name) !== -1;
      const chip = document.createElement('button');
      chip.className = 'chip-btn' + (on ? ' active' : '');
      chip.textContent = name;
      chip.addEventListener('click', () => {
        let list = chosen.slice();
        const at = list.indexOf(name);
        if (at === -1) list.push(name);
        else if (list.length > 1) list.splice(at, 1);
        else return;
        list = SYLLABLE_SYSTEMS.filter(x => list.indexOf(x) !== -1);
        draft.policy.shell.systems = list.length === SYLLABLE_SYSTEMS.length ? null : list;
        renderShell();
      });
      row.appendChild(chip);
    });
    shellList.appendChild(row);
  }

  function renderLessonSongs() {
    if (!lessonSongList) return;
    const lib = getStoredLibrary();
    const ids = sortedSongIds(lib).all.filter(id => !lessonMeta || lessonMeta.songIds.indexOf(id) === -1);
    lessonSongList.innerHTML = '';

    if (!ids.length) {
      const empty = document.createElement('div');
      empty.className = 'library-empty';
      empty.textContent = 'Nothing in your library yet.';
      lessonSongList.appendChild(empty);
      return;
    }

    ids.forEach(id => {
      const record = normalizeSong(lib[id]);
      const label = document.createElement('label');
      label.className = 'inline-check';
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = draft.songIds.indexOf(id) !== -1;
      box.addEventListener('change', () => {
        const at = draft.songIds.indexOf(id);
        if (box.checked && at === -1) draft.songIds.push(id);
        else if (!box.checked && at !== -1) draft.songIds.splice(at, 1);
        renderLessonSongs();
        renderShell();
      });
      const text = document.createElement('span');
      text.innerHTML = '<b></b> <em></em>';
      text.querySelector('b').textContent = record.title;
      text.querySelector('em').textContent =
        record.timeSignatureNumerator + '/' + record.timeSignatureDenominator
        + ' · ' + describeSong(record);
      label.appendChild(box);
      label.appendChild(text);
      lessonSongList.appendChild(label);
    });

    renderLessonMismatch(lib);
  }

  /* An ostinato keeps the meter and the instruments it was written with,
     whatever the layout now allows — nothing here rewrites content. That
     is right, but it makes it easy to tick a 6/8 piece into a lesson set
     up entirely in simple time, or one full of congas after narrowing
     the kit down to hand percussion, and not notice. Say so here rather
     than letting it be discovered in a classroom. */
  function renderLessonMismatch(lib) {
    const meters = layout.meters.simple.concat(layout.meters.compound);
    const kit = instrumentsOffered();
    const strayMeter = [], strayKit = [];

    draft.songIds.forEach(id => {
      const raw = lib[id];
      if (!raw) return;
      const record = normalizeSong(raw);
      const key = record.timeSignatureNumerator + '/' + record.timeSignatureDenominator;
      if (meters.indexOf(key) === -1) strayMeter.push(record.title);
      if (record.tracks.some(t => kit.indexOf(t.instrument) === -1)) strayKit.push(record.title);
    });

    const lines = [];
    if (strayMeter.length) {
      lines.push(strayMeter.map(t => '“' + t + '”').join(', ')
        + (strayMeter.length > 1 ? ' are' : ' is')
        + ' in a meter your layout settings do not list. It opens as written, and its meter'
        + (strayMeter.length > 1 ? 's' : '') + ' simply cannot be changed.');
    }
    if (strayKit.length) {
      lines.push(strayKit.map(t => '“' + t + '”').join(', ')
        + (strayKit.length > 1 ? ' use' : ' uses')
        + ' an instrument you have taken out of the kit. It plays and prints as written,'
        + ' and stays in its own picker — but nothing else can be changed to it.');
    }
    lines.forEach(text => {
      const warn = document.createElement('p');
      warn.className = 'card-desc lesson-warn';
      warn.textContent = text;
      lessonSongList.appendChild(warn);
    });
  }

  function getStoredLessons() {
    try { return JSON.parse(localStorage.getItem(LESSON_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }

  function renderSavedLessons() {
    if (!lessonSavedList) return;
    const saved = getStoredLessons();
    const ids = Object.keys(saved).sort((a, b) => (saved[b].savedAt || 0) - (saved[a].savedAt || 0));
    if (lessonSavedCard) showHide(lessonSavedCard, ids.length > 0);
    lessonSavedList.innerHTML = '';

    ids.forEach(id => {
      const item = saved[id];
      const row = document.createElement('div');
      row.className = 'lesson-saved-row';

      const title = document.createElement('span');
      title.className = 'lesson-saved-title';
      title.textContent = item.title || 'Untitled lesson';

      const actions = document.createElement('div');
      actions.className = 'library-song-actions';

      const edit = document.createElement('button');
      edit.className = 'lib-btn';
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => {
        draft = {
          id: id,
          title: item.title || '',
          policy: normalizePolicy(item.policy) || blankPolicy(),
          songIds: (item.songIds || []).slice()
        };
        renderSetupSheet();
      });

      const del = document.createElement('button');
      del.className = 'lib-btn danger';
      del.innerHTML = '&times;';
      del.title = 'Delete this lesson';
      del.addEventListener('click', () => {
        if (!confirm('Delete the lesson “' + (item.title || 'Untitled') + '”?')) return;
        const all = getStoredLessons();
        delete all[id];
        try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
        if (draft && draft.id === id) draft.id = null;
        renderSavedLessons();
      });

      actions.appendChild(edit);
      actions.appendChild(del);
      row.appendChild(title);
      row.appendChild(actions);
      lessonSavedList.appendChild(row);
    });
  }

  /* An ostinato the teacher has since deleted must not ship as a dead
     entry in the link. */
  function pruneDraftSongs() {
    const lib = getStoredLibrary();
    draft.songIds = draft.songIds.filter(id => lib[id]);
  }

  function renderSetupSheet() {
    if (!draft) draft = newDraft();
    pruneDraftSongs();
    renderLayoutSummary();
    renderTask();
    renderTempo();
    renderLength();
    renderLessonSongs();
    renderShell();
    renderSavedLessons();
    if (lessonTitleInput) lessonTitleInput.value = draft.title || '';
    if (lessonLinkRow) lessonLinkRow.hidden = true;
    if (lessonLinkFeedback) lessonLinkFeedback.textContent = '';
  }

  function storeLesson() {
    const all = getStoredLessons();
    const id = draft.id || ('lsn_' + Date.now());
    draft.id = id;
    all[id] = {
      id: id,
      title: draft.title,
      policy: draft.policy,
      songIds: draft.songIds.slice(),
      savedAt: Date.now()
    };
    try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
  }

  function buildLessonPayload() {
    const lib = getStoredLibrary();
    const songs = draft.songIds.filter(id => lib[id]).map(id => {
      const record = normalizeSong(JSON.parse(JSON.stringify(lib[id])));
      delete record.id;
      delete record.createdAt;
      return record;
    });
    return {
      lesson: 1,
      v: POLICY_VERSION,
      title: draft.title || 'Lesson',
      policy: draft.policy,
      layout: layoutSnapshot(),
      songs: songs
    };
  }

  /* ---- preview ----------------------------------------------------- */

  function startPreview() {
    if (!draft.songIds.length) { toast('Tick at least one ostinato first'); return; }
    flushAutosave();
    policy = normalizePolicy(draft.policy);
    lessonMeta = { title: draft.title || 'Lesson preview', songIds: draft.songIds.slice() };
    previewing = true;
    previewLayoutLock = layoutLocked;
    layoutLocked = true;
    if (previewBar) previewBar.hidden = false;
    closeSheet(lessonSetupSheet);
    closeSheet(librarySheet);

    applyPolicyToShell();
    openSong(draft.songIds[0]);   // its afterSongChange sweeps the shell again
  }

  function endPreview() {
    if (!previewing) return;
    previewing = false;
    flushAutosave();
    policy = null;
    lessonMeta = null;
    layoutLocked = previewLayoutLock;
    if (previewBar) previewBar.hidden = true;
    applyPolicyToShell();
    render();
    openSheet(lessonSetupSheet);
    renderSetupSheet();
  }

  if (previewExitBtn) previewExitBtn.addEventListener('click', endPreview);

  /* ---- wiring ------------------------------------------------------ */

  wireSheet(lessonSetupSheet, 'lesson-setup-close');

  if (lessonSetupBtn) {
    lessonSetupBtn.addEventListener('click', () => {
      flushAutosave();
      closeSettings();
      if (!draft) {
        draft = newDraft();
        if (song.id) draft.songIds = [song.id];
        draft.title = song.title || '';
      }
      closeSheet(librarySheet);
      openSheet(lessonSetupSheet);
      renderSetupSheet();
    });
  }

  if (tempoSeg) {
    tempoSeg.addEventListener('click', e => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      const t = draft.policy.tempo;
      if (btn.dataset.tempo === 'any') { t.locked = false; t.min = 40; t.max = 240; }
      else if (btn.dataset.tempo === 'locked') { t.locked = true; }
      else { t.locked = false; if (t.min === 40 && t.max === 240) { t.min = 60; t.max = 120; } }
      renderTempo();
    });
  }

  [[tempoMinInput, 'min'], [tempoMaxInput, 'max']].forEach(([input, key]) => {
    if (!input) return;
    input.addEventListener('change', () => {
      const v = parseInt(input.value, 10);
      if (!isNaN(v)) draft.policy.tempo[key] = Math.max(BPM_MIN, Math.min(BPM_MAX, v));
      const t = draft.policy.tempo;
      if (t.min > t.max) { const swap = t.min; t.min = t.max; t.max = swap; }
      renderTempo();
    });
  });

  if (maxMeasuresInput) {
    maxMeasuresInput.addEventListener('change', () => {
      const v = parseInt(maxMeasuresInput.value, 10);
      draft.policy.structure.maxMeasures =
        (isNaN(v) || v < 1) ? null : Math.min(MAX_MEASURES, v);
      renderLength();
    });
  }

  if (maxTracksInput) {
    maxTracksInput.addEventListener('change', () => {
      const v = parseInt(maxTracksInput.value, 10);
      draft.policy.structure.maxTracks =
        (isNaN(v) || v < 1) ? null : Math.min(MAX_TRACKS, v);
      renderLength();
    });
  }

  if (taskNoteInput) {
    taskNoteInput.addEventListener('input', () => {
      draft.policy.task.note = taskNoteInput.value.slice(0, 160);
    });
  }

  if (lessonTitleInput) {
    lessonTitleInput.addEventListener('input', () => { draft.title = lessonTitleInput.value; });
  }

  if (lessonSongsAll) {
    lessonSongsAll.addEventListener('click', () => {
      draft.songIds = sortedSongIds(getStoredLibrary()).all.slice();
      renderLessonSongs();
      renderShell();
    });
  }

  if (lessonSongsNone) {
    lessonSongsNone.addEventListener('click', () => {
      draft.songIds = [];
      renderLessonSongs();
      renderShell();
    });
  }

  if (lessonPreviewBtn) lessonPreviewBtn.addEventListener('click', startPreview);

  function offerLink(link, input, row, textEl, feedbackEl) {
    if (input) input.value = link;
    if (row) row.hidden = false;
    if (window.location.protocol === 'file:') {
      if (feedbackEl) {
        feedbackEl.textContent = 'This page is open from a folder, so the link only works on this computer.';
        feedbackEl.className = 'status-msg error';
      }
      return;
    }
    writeToClipboard(link).then(ok => {
      if (ok) {
        if (textEl) textEl.textContent = 'Copied';
        if (feedbackEl) {
          feedbackEl.textContent = 'Link copied to your clipboard.';
          feedbackEl.className = 'status-msg good';
        }
        setTimeout(() => { if (textEl) textEl.textContent = 'Copy'; }, 2500);
      } else if (input) {
        input.focus();
        input.select();
        if (feedbackEl) {
          feedbackEl.textContent = 'Select and copy the link above.';
          feedbackEl.className = 'status-msg';
        }
      }
    });
  }

  if (lessonLinkBtn) {
    lessonLinkBtn.addEventListener('click', () => {
      if (!draft.songIds.length) { toast('Tick at least one ostinato first'); return; }
      if (!draft.title.trim()) draft.title = song.title || 'Lesson';
      if (lessonTitleInput) lessonTitleInput.value = draft.title;

      storeLesson();
      renderSavedLessons();

      /* In the hash, not the query: the payload carries whole ostinatos
         and has no business being sent to a server, or landing in its
         logs on the way past. */
      const encoded = encodeSong(buildLessonPayload());
      const link = window.location.origin + window.location.pathname
        + '#lesson=' + encodeURIComponent(encoded);
      offerLink(link, lessonLinkInput, lessonLinkRow, lessonLinkCopyText, lessonLinkFeedback);
    });
  }

  if (lessonLinkCopy) {
    lessonLinkCopy.addEventListener('click', () => {
      if (!lessonLinkInput || !lessonLinkInput.value) return;
      writeToClipboard(lessonLinkInput.value).then(ok => {
        if (ok) {
          if (lessonLinkCopyText) lessonLinkCopyText.textContent = 'Copied';
          setTimeout(() => { if (lessonLinkCopyText) lessonLinkCopyText.textContent = 'Copy'; }, 2500);
        } else {
          lessonLinkInput.focus();
          lessonLinkInput.select();
        }
      });
    });
  }


  /* ==================================================================
     A SHARED LINK
     ================================================================== */

  function offerSharedSong() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('song')) return false;

    const decoded = decodeSong(params.get('song'));
    /* Clear the address bar either way, so a reload does not ask again. */
    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (!decoded || !Array.isArray(decoded.tracks)) {
      toast('That link could not be read');
      return false;
    }

    /* Read before normalizing: the layout rides alongside the piece and
       is not part of it. */
    if (decoded.layout) applyLayoutSnapshot(decoded.layout, !!decoded.layoutLocked);

    const record = normalizeSong(decoded);
    record.id = decoded.sandbox ? SANDBOX_ID : newSongId();
    if (decoded.sandbox) record.title = SANDBOX_TITLE;
    record.isCustom = true;
    record.createdAt = Date.now();

    const lib = getStoredLibrary();
    lib[record.id] = record;
    saveStoredLibrary(lib);

    adoptSong(normalizeSong(record));
    autoSave = true;              // just filed as this person's own
    rememberActiveSong();
    afterSongChange();
    toast(decoded.sandbox ? 'Opened in your sandbox'
                          : 'Added “' + record.title + '” to your library');
    return true;
  }


  /* ==================================================================
     TOAST
     ================================================================== */

  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }



  /* ------------------------------------------------------------------
     Labels on a board

     `title` is a mouse tooltip and nothing else: it needs a cursor to
     rest on the control, so on a touch board every icon-only button here
     — the +/- pair, the link, the mute badge — is simply unexplained.
     Press and hold one and its label arrives in the toast instead.

     Coarse pointers only; a mouse already has the real tooltip. The
     click that follows the release is swallowed, so holding a button to
     read what it does never also does it. Registered in the capture
     phase, and early enough in the file to run ahead of the other
     document-level capture handlers for the same reason.
     ------------------------------------------------------------------ */
  (function labelsOnHold() {
    if (window.matchMedia('(pointer: fine)').matches) return;

    const HOLD_MS = 450;
    const SLOP = 10;          // a finger never holds perfectly still
    let timer = null, startX = 0, startY = 0, labelled = null;

    function cancel() {
      clearTimeout(timer);
      timer = null;
    }

    document.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      const el = e.target.closest('[title], [aria-label]');
      if (!el) return;
      const text = el.getAttribute('title') || el.getAttribute('aria-label');
      if (!text) return;
      startX = e.clientX;
      startY = e.clientY;
      cancel();
      timer = setTimeout(() => {
        timer = null;
        labelled = el;
        toast(text);
      }, HOLD_MS);
    }, true);

    document.addEventListener('pointermove', e => {
      if (!timer) return;
      if (Math.abs(e.clientX - startX) > SLOP || Math.abs(e.clientY - startY) > SLOP) cancel();
    }, true);

    document.addEventListener('pointerup', cancel, true);
    document.addEventListener('pointercancel', cancel, true);

    document.addEventListener('click', e => {
      if (labelled && (e.target === labelled || labelled.contains(e.target))) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
      labelled = null;
    }, true);
  })();


  /* ==================================================================
     THE MUSIC STAND BRIDGE
     ------------------------------------------------------------------
     Embedded in the Music Stand, this app draws the ostinato
     and makes its sounds, and the Music Stand does everything else: it keeps the
     one clock both sides play to, owns the tempo and the mutes, and tells
     this frame which beat to light. So the bridge is small — read the
     piece, hand over its timeline, sound one track now, light one beat.

     Nothing here runs outside the Music Stand, and nothing the Music Stand asks for can
     reach this app's own storage (see the block at the top of the file).
     The contract is written up in `Music Stand/README.md`;
     Rhythm Poetry 2.0 exposes the same one.
     ================================================================== */

  if (EMBEDDED) {
    document.body.classList.add('embedded', 'present-mode');

    /* A guest shows the score and, until the Music Stand says otherwise,
       takes no input: the Music Stand is a player. Everything is stopped at
       the window, ahead of every handler in the app, except scrolling,
       which the browser does on its own. Keys are passed up, so Space
       still starts the Music Stand while this frame has focus.

       `bridge.editable` opens the score to the pointer. It does not open
       the app: the chrome stays away and the stylesheet decides what may
       be touched. Every touch is noted, because an edit is only reported
       when something was reached for — see afterRender(). */
    let hostEditable = false;
    let touched = false;
    let toldHost = null;

    const swallow = e => {
      if (hostEditable) { touched = true; return; }
      /* One exception, and only one: the mute badge. Muting is the
         mixer's job and the mixer is live whether or not the score has
         been handed to the pointer — it changes what is heard, never the
         piece. Everything else in here stays behind the glass. */
      if (e.target && e.target.closest && e.target.closest('.mute-badge')) return;
      e.stopImmediatePropagation();
      if (e.type === 'click' || e.type === 'dblclick' || e.type === 'contextmenu') e.preventDefault();
    };
    ['click', 'dblclick', 'contextmenu', 'pointerdown', 'mousedown', 'touchstart']
      .forEach(type => window.addEventListener(type, swallow, { capture: true, passive: false }));
    window.addEventListener('keydown', e => {
      if (hostEditable) {
        touched = true;
        /* Something being typed into keeps its own keys, Space included —
           otherwise the Music Stand would start playing mid-word. */
        const t = e.target;
        if (t && (t.isContentEditable || /^(input|textarea|select)$/i.test(t.tagName || ''))) return;
      }
      e.stopImmediatePropagation();
      if (e.code === 'Space' || e.key === ' ') e.preventDefault();
      if (typeof bridge.onHostKey === 'function') {
        bridge.onHostKey({ key: e.key, code: e.code, shiftKey: e.shiftKey,
                           metaKey: e.metaKey, ctrlKey: e.ctrlKey, altKey: e.altKey });
      }
    }, true);

    function fingerprint() {
      try { return stableStringify(snapshot()); } catch (e) { return null; }
    }

    /* render() is the end of every edit — and of every re-fit and every
       change of view, which are not edits. Two gates keep those out: the
       pane must have been reached for since the last word to the host,
       and the piece must actually have come out different. */
    function afterRender() {
      if (!hostEditable || !touched || typeof bridge.onEdit !== 'function') return;
      const now = fingerprint();
      if (now === null || now === toldHost) return;
      toldHost = now;
      touched = false;
      bridge.onEdit();
    }

    /* A piece the Music Stand has just put here is where it meant to put
       it: this is the version to measure the next edit against, and
       nothing has been reached for yet. */
    function settled() {
      touched = false;
      toldHost = fingerprint();
    }

    const VIEW_KEYS = ['layout', 'measuresPerPage', 'zoomPct', 'showDots', 'showSyllables',
                       'syllableSystem', 'lightNotes', 'showBarNumbers', 'showBeatNumbers'];

    function songSummary(id, rec, starter) {
      return {
        id: id,
        title: rec.title || 'Untitled ostinato',
        kind: 'ostinato',
        meter: [rec.timeSignatureNumerator, rec.timeSignatureDenominator],
        bpm: rec.bpm,
        measures: rec.measures,
        instruments: (rec.tracks || []).map(t => t.instrument),
        isCustom: !starter,
        createdAt: rec.createdAt || 0,
        preview: (rec.tracks || []).map(t => instrumentMeta(t.instrument).label).join(' · ')
      };
    }

    /* The live library, read past anything this frame has written. */
    function liveLibrary() {
      window.MUSIC_STAND_EMBED.forget(LIBRARY_KEY);
      return getStoredLibrary();
    }

    const bridge = {
      app: 'ostinato-builder',
      version: 1,
      onHostKey: null,
      onEdit: null,

      /* Editing in a pane. The app's own storage is already out of reach
         (see the block at the top of the file), so an edit here changes
         what is on this stand and nothing else — the ostinato in the
         library is not touched, and cannot be. The Music Stand keeps the
         result and saves it with the pairing. */
      get editable() { return hostEditable; },
      set editable(on) {
        on = !!on;
        if (on === hostEditable) return;
        hostEditable = on;
        document.body.classList.toggle('editing', on);
        touched = false;
        toldHost = fingerprint();
        standAfterRender = on ? afterRender : null;
        render();
      },
      /* where this app keeps its library, so the Music Stand can tell when a song
         it is showing has been edited in the app in another tab */
      libraryKey: LIBRARY_KEY,

      /* The library, then the sandbox flagged `sandbox: true`. It is not a
         library song — sortedSongIds() leaves it out on purpose — so the
         Music Stand is given it separately and shows it as scratch work rather
         than among the ostinatos. Not offered before it has been made
         (the app was never opened). */
      listSongs() {
        const lib = liveLibrary();
        const ids = sortedSongIds(lib);
        const out = ids.all.map(id => songSummary(id, lib[id], ids.starters.indexOf(id) !== -1));
        if (lib[SANDBOX_ID]) {
          const entry = songSummary(SANDBOX_ID, normalizeSong(lib[SANDBOX_ID]), false);
          entry.sandbox = true;
          out.unshift(entry);
        }
        return out;
      },

      openLibrarySong(id) {
        const lib = liveLibrary();
        if (!lib[id]) return null;
        adoptSong(normalizeSong(lib[id]));
        afterSongChange();
        settled();
        return bridge.info();
      },

      /* A piece that is not in the library — from a share link, or kept
         by the Music Stand. normalizeSong() is the same door every file and link
         comes through in the app itself. */
      loadSong(raw) {
        if (!raw || typeof raw !== 'object' || !Array.isArray(raw.tracks)) return null;
        adoptSong(normalizeSong(raw));
        afterSongChange();
        settled();
        return bridge.info();
      },

      snapshot() { return snapshot(); },

      info() {
        return {
          app: 'ostinato-builder',
          kind: 'ostinato',
          title: song.title || 'Untitled ostinato',
          meter: [song.timeSignatureNumerator, song.timeSignatureDenominator],
          bpm: song.bpm,
          beatsPerMeasure: beatsPerMeasure(),
          beatTicks: beatTicks(),
          pickupBeats: 0,
          totalBeats: totalBeats(),
          measures: song.measures,
          voices: song.tracks.map((t, i) => ({
            id: i,
            label: instrumentMeta(t.instrument).label,
            instrument: t.instrument,
            muted: trackMuted(t, i),
            image: new URL(instrumentImage(t.instrument), window.location.href).href
          }))
        };
      },

      /* Every hit in one pass, in ticks from the first beat, muted tracks
         included — the Music Stand owns the mutes. `gapTicks` is how long until
         that track's next hit, which the kit needs to shape fast repeats. */
      timeline() {
        const notes = [];
        song.tracks.forEach((track, ti) => {
          trackOnsets(track).forEach(o => {
            notes.push({ tick: o.tick, voice: ti, gapTicks: o.gapTicks });
          });
        });
        notes.sort((a, b) => a.tick - b.tick);
        return { beatTicks: beatTicks(), totalBeats: totalBeats(), notes: notes };
      },

      attachAudio(ctx, out) {
        kit = VI.createKit({ audioContext: ctx, destination: out || undefined });
        kit.unlock();
        audioUnlocked = true;
      },

      sound(voice, opts) {
        const track = song.tracks[voice];
        if (track) playInstrument(track.instrument, (opts && opts.gapMs) || 0);
      },

      /* ---- the mixer's two jobs, done from the pane ------------------
         The badge on an instrument and the button in the stand's mixer
         are the same switch seen twice, so each has to be able to move
         the other. The stand sets them when it opens a piece (from the
         piece's own mutes) and again whenever its mixer is used;
         `onVoiceMute` is the pane answering back. A mute is not an edit
         — the piece is not touched by either path. */
      setVoiceMuted(voice, muted) {
        const i = Number(voice);
        if (!song.tracks[i]) return;
        if (!!hostMutes[i] === !!muted) return;
        hostMutes[i] = !!muted;
        render();
      },
      onVoiceMute: null,

      /* Which instruments this piece may be played on, and the picture
         for each — the stand's picker shows what the app's own picker
         would show, lesson policy and all, rather than the whole kit.
         `editable` false means a lesson has locked them. */
      instruments(voice) {
        const current = song.tracks[Number(voice)];
        const offered = instrumentsOfferedFor(current ? current.instrument : null);
        return {
          editable: instrumentsEditable(),
          current: current ? current.instrument : null,
          items: VI.INSTRUMENTS
            .filter(inst => offered.indexOf(inst.id) !== -1)
            .map(inst => ({
              id: inst.id,
              label: inst.label,
              alt: inst.alt,
              image: new URL(instrumentImage(inst.id), window.location.href).href
            }))
        };
      },

      /* Changing an instrument does change the piece, so it comes back as
         an edit — but the stand asked for it, so nothing in the pane was
         reached for and afterRender() will not speak. The stand reports
         it itself; see the Music Stand's changeInstrument(). */
      setInstrument(voice, id) {
        const i = Number(voice);
        const track = song.tracks[i];
        if (!track || !instrumentsEditable()) return null;
        if (instrumentsOfferedFor(track.instrument).indexOf(id) === -1) return null;
        track.instrument = id;
        render();
        return bridge.info();
      },

      highlight(beat) {
        if (beat == null || beat < 0) { clearHighlights(); return; }
        highlightBeat(beat);
      },

      /* Back to the top of the piece, the way a stopped score sits. */
      stop() {
        clearHighlights();
        if (currentPage !== 0) goToPage(0);
        if (stage.scrollLeft) stage.scrollTo({ left: 0 });
      },

      getView() {
        const out = {};
        VIEW_KEYS.forEach(k => { out[k] = view[k]; });
        return out;
      },

      setView(partial) {
        if (!partial) return;
        VIEW_KEYS.forEach(k => { if (partial[k] !== undefined) view[k] = partial[k]; });
        if (LAYOUT_MODES.indexOf(view.layout) === -1) view.layout = 'pages';
        /* The stand may ask for any number of bars to a line, including
           one the app's own chips do not offer (a five-bar piece, all on
           one line) — it is choosing a shape, not pressing a button. */
        const n = Number(view.measuresPerPage);
        view.measuresPerPage = n >= 1 ? Math.min(n, MAX_MEASURES) : 4;
        currentPage = 0;
        syncSettings();
        render();
      },

      /* What the Music Stand needs to share the room out fairly: the size
         of what is on show at scale 1, the padding around it, and how it
         scales — blocks shrink to fit both ways, scrolling across is one
         fixed size.

         `layouts` is the rest of the answer: every other shape this score
         could be drawn in, one per number of bars to a line. The stand
         picks one and asks for it with setView({ measuresPerPage }), and
         the shape it was promised is the shape it gets, because both are
         worked out from the same measured bars. */
      sizing() {
        const pad = getComputedStyle(gridFit);
        const sp = getComputedStyle(stage);
        const pages = isPaged() ? pageGeometry() : null;
        const headW = parseFloat(getComputedStyle(grid).getPropertyValue('--head-w')) || 0;
        return {
          w: pages ? headW + pages.reduce((w, p) => Math.max(w, p.width), 1) : grid.scrollWidth,
          h: grid.scrollHeight,
          padW: parseFloat(pad.paddingLeft) + parseFloat(pad.paddingRight),
          padH: parseFloat(pad.paddingTop) + parseFloat(pad.paddingBottom)
              + parseFloat(sp.paddingTop) + parseFloat(sp.paddingBottom) + 2,
          maxScale: FIT_MAX,
          mode: inBlocks() ? 'page' : 'fixed',
          fixedScale: Math.max(FIT_MIN, Math.min(FIT_MAX, view.zoomPct / 100)),
          layouts: shapeOptions()
        };
      },

      refit() { syncHeadColumn(); applyLayout(); }
    };

    /* The badge in a pane answers to the stand, editing or not: a mute is
       the mixer's, and the mixer is always live. */
    standVoiceMuted = (voice, muted) => {
      if (typeof bridge.onVoiceMute === 'function') bridge.onVoiceMute(voice, muted);
    };

    window.MusicStandBridge = bridge;
  }


  /* ==================================================================
     GO
     ================================================================== */

  document.documentElement.style.setProperty('--gutter-l', GUTTER_L + 'px');
  document.documentElement.style.setProperty('--gutter-r', GUTTER_R + 'px');

  syncSettings();

  /* A lesson link wins over everything else: it is the reason the page
     was opened at all, and it decides which ostinatos the rest of this
     can even see. Then a shared song, which also beats whatever was open
     last — following a link is a deliberate act, and it files the piece
     in the library on the way in. */
  let openedFromLesson = false;
  /* Embedded in the Music Stand there is no link to read — the Music Stand sends the song. */
  const lessonPayload = EMBEDDED ? null : checkUrlForLesson();
  if (lessonPayload) {
    const landing = openLesson(lessonPayload);
    if (landing) openedFromLesson = openSong(landing);
    if (!openedFromLesson) toast('That lesson link could not be read');
  }
  if (!openedFromLesson && (EMBEDDED || !offerSharedSong())) restoreLastSong();

  applyPolicyToShell();

  /* The artwork loads after the first layout; a beat's width does not
     depend on it, but the fit does, so settle again once it is in. */
  window.addEventListener('load', applyFit);
})();

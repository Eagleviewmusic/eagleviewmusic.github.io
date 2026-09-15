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

(function () {
  'use strict';

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

  /* The plain division of one beat: two eighths, or three in compound. */
  function defaultSubdivision() { return isCompound() ? 3 : 2; }

  /* What the + button reaches for: this beat's sixteenth-note level. */
  function sixteenthSubdivision() { return isCompound() ? 6 : 4; }

  /* What the − button walks through: the opposite feel, then its own
     subdivision, then back off again. */
  function tupletLadder() { return isCompound() ? [2, 4] : [3, 6]; }

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

  function saveCurrentSong() {
    if (!song.id) return;
    const lib = getStoredLibrary();
    const existing = lib[song.id];
    const record = snapshot();
    record.isCustom = existing ? existing.isCustom : !DEFAULT_SONGS[song.id];
    record.createdAt = existing ? existing.createdAt : Date.now();
    lib[song.id] = record;
    saveStoredLibrary(lib);
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
  window.addEventListener('beforeunload', flushAutosave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushAutosave();
  });

  function rememberActiveSong() {
    try { localStorage.setItem(ACTIVE_ID_KEY, song.id || ''); } catch (e) {}
  }

  function openSong(id) {
    if (isPlaying) stopPlayback();
    const lib = getStoredLibrary();
    const record = lib[id];
    if (!record) return false;
    adoptSong(normalizeSong(record));
    rememberActiveSong();
    afterSongChange();
    return true;
  }

  /* Everything the toolbar shows belongs to the song, so all of it is
     refreshed together whenever the song underneath changes. */
  function afterSongChange() {
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
  }

  function updateSongChip() {
    const title = song.title || 'Untitled ostinato';
    songChipLabel.textContent = title;
    nowEditingTitle.textContent = title;
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
      /* A blank page, not an empty one: two tracks waiting for a rhythm
         are far easier to start from than a bare screen. */
      tracks: [
        { instrument: 'bass',   beats: [], links: {} },
        { instrument: 'claves', beats: [], links: {} }
      ]
    });
    adoptSong(record);
    rememberActiveSong();
    afterSongChange();
    saveCurrentSong();
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
    if (lib[LANDING_SONG]) return openSong(LANDING_SONG);
    const first = sortedSongIds(lib).all[0];
    if (first) return openSong(first);
    createSong('Untitled ostinato');
    return true;
  }


  /* ==================================================================
     SOUND
     ------------------------------------------------------------------
     The kit creates no AudioContext until it is unlocked from a real
     gesture: a context made before one starts suspended, and every
     sound queued up while it is suspended fires at once on resume.
     ================================================================== */

  const kit = VI.createKit();
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
    showLinkButtons: true,
    showDots: true,
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

  function loadViewPrefs() {
    try {
      const raw = JSON.parse(localStorage.getItem(VIEW_PREFS_KEY) || 'null');
      if (raw && typeof raw === 'object') {
        Object.keys(view).forEach(k => { if (raw[k] !== undefined) view[k] = raw[k]; });
      }
    } catch (e) {}
    if (SYLLABLE_SYSTEMS.indexOf(view.syllableSystem) === -1) {
      view.syllableSystem = SYLLABLE_SYSTEMS[0];
    }
    if (view.layout !== 'scroll') view.layout = 'pages';
    if (PER_PAGE_CHOICES.indexOf(view.measuresPerPage) === -1) view.measuresPerPage = 4;
    view.zoomPct = Math.max(40, Math.min(220, Math.round(Number(view.zoomPct) || 100)));
  }

  function saveViewPrefs() {
    try { localStorage.setItem(VIEW_PREFS_KEY, JSON.stringify(view)); } catch (e) {}
  }

  loadViewPrefs();


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
  function buildTimeline() {
    const events = [];
    const bt = beatTicks();

    song.tracks.forEach((track, ti) => {
      if (track.muted) return;

      /* Read by group, not by beat: inside a joined run a sound holds over
         the beat line, so a half note is one onset rather than two. Taking
         the onsets from the same colours the notation is built from is what
         keeps the two from ever disagreeing. */
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

      if (!onsets.length) return;
      const loopTicks = totalTicks();
      onsets.forEach((t, i) => {
        const next = i + 1 < onsets.length ? onsets[i + 1] : onsets[0] + loopTicks;
        events.push({ tick: t, kind: 'note', track: ti, gapTicks: next - t });
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
    if (view.layout === 'pages') {
      const want = pageOfBeat(index);
      if (want !== currentPage) goToPage(want);
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
    litBeat = -1;
    conformAllTracks();

    emptyNote.hidden = song.tracks.length > 0;

    grid.appendChild(buildRuler());
    song.tracks.forEach((track, index) => grid.appendChild(buildTrack(track, index)));

    syncHeadColumn();
    layoutAndEngrave();
    applyFit();
    if (wasLit >= 0 && wasLit < totalBeats()) highlightBeat(wasLit);
    scheduleAutosave();
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

  function buildRuler() {
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
    for (let m = 0; m < song.measures; m++) {
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

  function buildTrack(track, trackIndex) {
    const row = document.createElement('div');
    row.className = 'track' + (track.muted ? ' muted' : '');
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
    for (let m = 0; m < song.measures; m++) {
      const measure = document.createElement('div');
      measure.className = 'measure';
      for (let b = 0; b < perMeasure; b++) {
        const beatIndex = m * perMeasure + b;
        measure.appendChild(buildBeat(track, beatIndex, groupOf[beatIndex]));
      }
      inner.appendChild(measure);

      const bar = document.createElement('div');
      bar.className = m === song.measures - 1 ? 'final-divider' : 'measure-divider';
      inner.appendChild(bar);
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
    pick.addEventListener('click', () => openInstrumentSheet(trackIndex));

    const mute = document.createElement('button');
    mute.className = 'mini-btn mute-badge' + (track.muted ? ' muted' : '');
    mute.title = track.muted ? 'Unmute' : 'Mute';
    mute.setAttribute('aria-label', track.muted ? 'Unmute ' + meta.label : 'Mute ' + meta.label);
    mute.innerHTML = icon(track.muted ? ICON_SOUND_OFF : ICON_SOUND_ON);
    mute.addEventListener('click', () => {
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
    side.appendChild(remove);
    side.appendChild(buildTrackOrderControls(trackIndex));

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

    dots.appendChild(buildSubdivisionControls(track, beatIndex));

    for (let i = 0; i < beat.slots; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot ' + mine[i];
      dot.addEventListener('click', () => {
        beat.cells[i] = !beat.cells[i];
        if (beat.cells[i]) auditionTrack(track);
        if (isPlaying) resyncPlayback();
        render();
      });
      dots.appendChild(dot);
    }
    el.appendChild(dots);

    if (view.showLinkButtons && canLinkBeats(beatIndex)) {
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
    const repeatable = isQuarterRestBeat ? repeatableGroup(track, beatIndex) : null;
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
     feel — a triplet, then a sextuplet — and then off again. */
  function buildSubdivisionControls(track, beatIndex) {
    const wrap = document.createElement('div');
    wrap.className = 'subdivision-controls';

    const beat = track.beats[beatIndex];
    const plain = defaultSubdivision();
    const sixteenth = sixteenthSubdivision();
    const ladder = tupletLadder();

    const plus = document.createElement('button');
    plus.className = 'subdivision-btn' + (beat.slots === sixteenth ? ' active' : '');
    plus.textContent = '+';
    plus.title = beat.slots === sixteenth ? 'Back to the plain division' : 'Divide this beat again';
    plus.addEventListener('click', () => {
      setBeatSlots(track, beatIndex, beat.slots === sixteenth ? plain : sixteenth);
      if (isPlaying) resyncPlayback();
      render();
    });

    const minus = document.createElement('button');
    const rung = ladder.indexOf(beat.slots);
    minus.className = 'subdivision-btn' + (rung !== -1 ? ' active' : '');
    minus.textContent = '−';
    minus.title = 'The other feel for this beat';
    minus.addEventListener('click', () => {
      const next = rung === -1 ? ladder[0]
                 : rung + 1 < ladder.length ? ladder[rung + 1]
                 : plain;
      setBeatSlots(track, beatIndex, next);
      if (isPlaying) resyncPlayback();
      render();
    });

    wrap.appendChild(plus);
    wrap.appendChild(minus);
    return wrap;
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
  }


  /* ==================================================================
     LAYING THE SCORE OUT

     Two ways to read a long ostinato, and the difference is only ever
     which bars are in the window and how big they are drawn:

       Pages   a fixed number of bars at a time, the page scaled to fill
               the screen — a concert score, turned a page at a time. The
               scale comes from the widest page, not from the page being
               looked at, so turning a page does not change the note size.

       Scroll  the whole piece on one line at a size the user picks, and
               the stage scrolls sideways.

     Both are the same machinery: every track's bars live in .body-inner,
     .track-body is the window onto it, and a page is brought into view by
     sliding the inner element. Sliding is a transform, so it never moves
     anything the engraver measured with offsetLeft.
     ================================================================== */

  const FIT_MIN = 0.25;
  const FIT_MAX = 1.8;

  let currentPage = 0;

  function measuresPerPage() {
    return view.layout === 'pages'
      ? Math.min(view.measuresPerPage, Math.max(1, song.measures))
      : Math.max(1, song.measures);
  }

  function pageCount() {
    return Math.max(1, Math.ceil(song.measures / measuresPerPage()));
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
    const HEIGHT_FLOOR = 0.55;
    const stagePad = getComputedStyle(stage);
    const availableH = stage.clientHeight
      - parseFloat(stagePad.paddingTop) - parseFloat(stagePad.paddingBottom)
      - (pager.hidden ? 0 : 44);
    const naturalH = grid.scrollHeight;
    const heightFit = naturalH > 0 && availableH > 0
      ? Math.max(HEIGHT_FLOOR, availableH / naturalH) : Infinity;

    const headW = parseFloat(getComputedStyle(grid).getPropertyValue('--head-w')) || 0;
    const pages = pageGeometry();
    const paging = view.layout === 'pages' && pages && pages.length > 0;

    let scale;
    if (paging) {
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
    pager.hidden = !paging || count < 2;
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

  /* Offer something that is not already on the page, walking the kit in
     its own order so the suggestions stay musically sensible. */
  function nextFreeInstrument() {
    const used = song.tracks.map(t => t.instrument);
    const free = VI.INSTRUMENT_IDS.find(id => used.indexOf(id) === -1);
    return free || VI.INSTRUMENT_IDS[0];
  }

  function addTrack() {
    if (song.tracks.length >= MAX_TRACKS) {
      toast('Ten instruments is the limit');
      return;
    }
    const track = makeTrack(nextFreeInstrument(), '');
    conformTrack(track);
    song.tracks.push(track);
    if (isPlaying) resyncPlayback();
    render();
  }

  function removeTrack(index) {
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
    pickingTrackIndex = trackIndex;
    const current = song.tracks[trackIndex].instrument;

    instrumentGrid.innerHTML = '';
    VI.INSTRUMENTS.forEach(inst => {
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
    const n = Math.round(Number(value));
    if (!isFinite(n) || n < BPM_MIN || n > BPM_MAX) return false;
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
    if (bpmButton.querySelector('input')) return;
    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'inline-input';
    input.min = String(BPM_MIN);
    input.max = String(BPM_MAX);
    input.value = String(song.bpm);

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
  const tsTop = document.getElementById('ts-top');
  const tsBottom = document.getElementById('ts-bottom');

  const TOP_VALUES = { 4: [2, 3, 4, 5, 6], 8: [6, 9, 12] };

  function updateMeterDisplay() {
    tsTop.textContent = String(song.timeSignatureNumerator);
    tsBottom.textContent = String(song.timeSignatureDenominator);
  }

  tsTop.addEventListener('click', () => changeMeter(() => {
    const list = TOP_VALUES[song.timeSignatureDenominator];
    const i = list.indexOf(song.timeSignatureNumerator);
    song.timeSignatureNumerator = list[(i + 1) % list.length];
  }));

  tsBottom.addEventListener('click', () => changeMeter(() => {
    song.timeSignatureDenominator = song.timeSignatureDenominator === 4 ? 8 : 4;
    song.timeSignatureNumerator = song.timeSignatureDenominator === 8 ? 6 : 4;
  }));

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
    song.measures = Math.max(1, Math.min(MAX_MEASURES, need));

    updateMeterDisplay();
    updateMeasureDisplay();
    conformAllTracks();
    if (isPlaying) resyncPlayback();
    render();
    syncSettings();

    /* Eight bars is the ceiling, so a long piece in a meter that counts
       fewer beats to the bar can run past the end. Nothing is lost — the
       surplus beats are waiting, not deleted — but say so. */
    if (need > MAX_MEASURES) {
      toast('Eight bars is the limit — the rest is waiting for a wider meter');
    }
  }

  /* ---- how many measures ---- */
  const measuresValue = document.getElementById('measures-value');
  const measuresUnit  = document.getElementById('measures-unit');
  const measuresMinus = document.getElementById('measures-minus');
  const measuresPlus  = document.getElementById('measures-plus');
  const MAX_MEASURES = 8;

  function updateMeasureDisplay() {
    measuresValue.textContent = String(song.measures);
    measuresUnit.textContent = song.measures === 1 ? 'bar' : 'bars';
    measuresMinus.disabled = song.measures <= 1;
    measuresPlus.disabled = song.measures >= MAX_MEASURES;
  }

  measuresMinus.addEventListener('click', () => {
    if (song.measures <= 1) return;
    song.measures--;
    afterLengthChange();
  });
  measuresPlus.addEventListener('click', () => {
    if (song.measures >= MAX_MEASURES) return;
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
    { id: 'dots-toggle',         key: 'showDots' },
    { id: 'links-toggle',        key: 'showLinkButtons' },
    { id: 'beat-numbers-toggle', key: 'showBeatNumbers' },
    /* nothing is drawn differently, only a body class — so no render,
       and flipping it mid-playback does not interrupt what is lit */
    { id: 'light-notes-toggle',  key: 'lightNotes', soft: true }
  ];

  const layoutPagesBtn  = document.getElementById('layout-pages');
  const layoutScrollBtn = document.getElementById('layout-scroll');
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
      view.layout = 'pages';
      currentPage = 0;
      saveViewPrefs();
      syncSettings();
      applyLayout();
    });
    perPageRow.appendChild(chip);
  });

  function setLayout(mode) {
    view.layout = mode;
    currentPage = 0;
    saveViewPrefs();
    syncSettings();
    applyLayout();
  }
  layoutPagesBtn.addEventListener('click', () => setLayout('pages'));
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
    systemSelect.value = view.syllableSystem;
    systemField.hidden = !view.showSyllables;
    document.body.classList.toggle('hide-beat-numbers', !view.showBeatNumbers);
    document.body.classList.toggle('show-syllables', !!view.showSyllables);
    document.body.classList.toggle('light-notes', !!view.lightNotes);

    const paged = view.layout === 'pages';
    layoutPagesBtn.classList.toggle('active', paged);
    layoutScrollBtn.classList.toggle('active', !paged);
    perPageField.hidden = !paged;
    zoomField.hidden = paged;

    /* Every choice stays live, even one larger than the piece. The setting
       follows the person rather than the song: someone who reads four bars
       to a page wants that back when they open a longer one, and a short
       piece simply fills a single page in the meantime. */
    perPageRow.querySelectorAll('.chip-btn').forEach(chip => {
      const n = Number(chip.dataset.perPage);
      chip.classList.toggle('active', paged && n === view.measuresPerPage);
    });

    zoomSlider.value = String(view.zoomPct);
    zoomReadout.textContent = view.zoomPct + '%';

    layoutNote.textContent = paged
      ? (pageCount() > 1
          ? 'Every page is drawn the same size, and the music turns the page as it plays.'
          : 'The whole piece fits on one page.')
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
      const sheets = [pictureModal, titleModal, backupSheet, librarySheet]
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
  const songChipLabel   = document.getElementById('song-chip-label');
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

    const open = document.createElement('button');
    open.className = 'lib-btn' + (isCurrent ? ' is-current' : '');
    open.textContent = isCurrent ? 'Open now' : 'Open';
    open.disabled = isCurrent;
    if (!isCurrent) {
      open.addEventListener('click', () => {
        flushAutosave();
        openSong(id);
        closeSheet(librarySheet);
        toast('Opened “' + record.title + '”');
      });
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
      if (id === song.id) {
        const next = sortedSongIds(lib).all[0];
        if (next) {
          song.id = null;          // so the autosave cannot put it back
          openSong(next);
        } else {
          song.id = null;
          createSong('Untitled ostinato');
        }
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

  function renderLibraryList() {
    const lib = getStoredLibrary();
    const { mine, starters } = sortedSongIds(lib);
    libraryList.innerHTML = '';
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
    titleHeading.textContent = making ? 'Create a new ostinato' : 'Save a copy';
    titleSub.textContent = making
      ? 'Give it a name so you can find it later.'
      : 'The copy is yours to change; the original is left as it is.';
    titleConfirm.textContent = making ? 'Create' : 'Save a copy';
    titleInput.value = making ? '' : (song.title || 'Untitled ostinato') + ' copy';
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

  wireSheet(backupSheet, 'backup-close');

  document.getElementById('share-backup-btn').addEventListener('click', () => {
    flushAutosave();
    shareRow.hidden = true;
    shareStatus.textContent = '';
    importStatus.textContent = '';
    resetStatus.textContent = '';
    exportFilename.value = slugify(song.title || 'ostinatos') + '-backup';
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

  document.getElementById('make-link-btn').addEventListener('click', () => {
    flushAutosave();
    const record = snapshot();
    delete record.id;                 // the receiver files it as their own
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
    } catch (e) {}
    song.id = null;
    getStoredLibrary();                   // writes the starters back
    openSong(LANDING_SONG);
    renderExportList();
    renderLibraryList();
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

    const record = normalizeSong(decoded);
    record.id = newSongId();
    record.isCustom = true;
    record.createdAt = Date.now();

    const lib = getStoredLibrary();
    lib[record.id] = record;
    saveStoredLibrary(lib);

    adoptSong(normalizeSong(record));
    rememberActiveSong();
    afterSongChange();
    toast('Added “' + record.title + '” to your library');
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
     GO
     ================================================================== */

  document.documentElement.style.setProperty('--gutter-l', GUTTER_L + 'px');
  document.documentElement.style.setProperty('--gutter-r', GUTTER_R + 'px');

  syncSettings();

  /* A shared link wins over whatever was open last: following one is a
     deliberate act, and it files the piece in the library on the way in. */
  if (!offerSharedSong()) restoreLastSong();

  /* The artwork loads after the first layout; a beat's width does not
     depend on it, but the fit does, so settle again once it is in. */
  window.addEventListener('load', applyFit);
})();

/* ==========================================================================
   Recording Studio — studio.js
   The project, its tracks, the transport and recording. Grown from the
   Virtual Keyboard's four-track recorder (virtual-keyboard/recorder.js):
   the same tape rules, timing and count-in, with up to sixteen tracks, an
   instrument for each, and songs brought in from the other apps.

   A track keeps what was played, not the sound: notes { m (MIDI), b (beat),
   d (beats), s (sound), v (level, 1 = as played) }, or for an ostinato hits
   { i (instrument), b, g (gain), r (beats to that line's next hit) }. Beats,
   not seconds, so a new tempo re-times the whole project.

   Timing: a note's moment is the input event behind it (link.js keeps the
   latest, from the studio's page and the instrument frames alike), put on
   the audio clock, then moved earlier by the recording delay that "Line up
   the timing" measures.

   window.Studio — link.js and bring-in.js call in (see the end).
   ========================================================================== */
(() => {
  'use strict';

  const MAX_TRACKS = 16;
  const START_TRACKS = 8;
  const TRACK_COLORS = ['#F0525A', '#F4A21C', '#2DB86A', '#3B95E6', '#9B6BF2', '#EC5FA6', '#20B8C6', '#C9A227',
                        '#E8743B', '#5FBF4A', '#5B7CF0', '#C25BD6', '#E0505F', '#2FA58C', '#8C9BB0', '#D08B5B'];
  const KINDS = {
    keyboard:  { label: 'Keyboard',  engine: 'notes',   play: true },
    accordion: { label: 'Accordion', engine: 'notes',   play: true },
    xylophone: { label: 'Xylophone', engine: 'strikes', play: true },
    voice:     { label: 'Voice',     engine: 'audio',   play: true },
    ostinato:  { label: 'Ostinato',  engine: 'hits' },
    melody:    { label: 'Melody',    engine: 'notes' },
    chords:    { label: 'Chords',    engine: 'notes' }
  };
  const INSTRUMENTS = ['keyboard', 'accordion', 'xylophone', 'voice'];
  // how the words name what is played: "record the keyboard", "record your voice"
  const PLAYED = { keyboard: 'the keyboard', accordion: 'the accordion', xylophone: 'the xylophone', voice: 'your voice' };
  const METERS = { '2/4': 2, '3/4': 3, '4/4': 4, '5/4': 5, '6/4': 6, '6/8': 2, '9/8': 3, '12/8': 4 }; // beats in a bar (x/8 counted in dotted quarters)
  const CLICKS = ['record', 'always', 'off'];
  const TEMPO_MIN = 30, TEMPO_MAX = 300;
  const LOOKAHEAD = 0.15, HIDDEN_LOOKAHEAD = 1.5, PUMP_MS = 25;
  const MIN_HOLD = 0.05;     // beats: the shortest note kept
  const EARLY = 0.125;       // beats: how early a note can come and still belong to the beat after it
  const UNDO_MAX = 40;
  const LEAD = 0.1, TAIL = 2.5; // seconds before the first note and after the last in a song file
  const BASE = Voices.BASE;

  const PROJECTS_KEY = 'evm_studio_projects_v1';
  const CURRENT_KEY = 'evm_studio_current_v1';
  const PREFS_KEY = 'evm_studio_prefs_v1';
  const DELAY_KEY = 'evm_studio_rec_delay_v1';
  const VK_DELAY_KEY = 'virtual_keyboard_rec_delay_v1';   // the Virtual Keyboard's, used until the studio measures its own
  const THEME_KEY = 'evm_studio_theme_v1';
  const APP_SLUG = 'recording-studio';

  const el = id => document.getElementById(id);
  const tracksEl = el('tracks');
  const playBtn = el('play'), recordBtn = el('record'), homeBtn = el('home');
  const posEl = el('pos');
  const tempoInput = el('tempo'), meterSelect = el('meter'), countInBtn = el('countin'), clickSelect = el('click');
  const undoBtn = el('undo'), redoBtn = el('redo');

  let P = null;               // the project
  let projects = {};          // id -> project (this device)
  const R = { armed: 0, inst: 'keyboard', state: 'idle', pos: 0 }; // state: idle | priming | playing | recording
  let run = null, runToken = 0;
  let view = { start: 0, end: 32 };
  let rows = [];              // { row, ctl, lane, canvas, ... } per track
  let ruler = null;
  let undo = [], redo = [];   // redo: what Undo took back, until something new is done
  let prefs = { volume: 1, inst: 'keyboard', split: null, folded: false };
  let audioWoken = false;
  let armedId = null;         // the armed track's id, so arming survives tracks moving

  // -------- SMALL THINGS --------
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const midiFreq = m => 440 * Math.pow(2, (m - 69) / 12);
  function freqMidi(f) {
    const m = 69 + 12 * Math.log2(f / 440);
    const r = Math.round(m);
    return Math.abs(m - r) < 0.02 ? r : Math.round(m * 100) / 100;
  }
  const byBeat = (a, b) => a.b - b.b;
  const newId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const NOTE_COLORS = ['#FF3B30', '#ff6818', '#FF9500', '#ffb000', '#FFCC00', '#34C759', '#32c490', '#30c0c6', '#189de2', '#007AFF', '#5866ee', '#AF52DE'];
  const noteColor = m => NOTE_COLORS[((Math.round(m) % 12) + 12) % 12];

  function toast(msg) {
    const t = el('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  function loadJSON(key) { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } }
  function saveJSON(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; } }

  // -------- THE PROJECT --------
  function blankTrack() {
    return { id: newId('t'), kind: null, name: '', volume: 1, muted: false, solo: false, sound: null, notes: [], hits: [], regions: [], clips: [], from: null };
  }
  function blankProject() {
    return {
      id: newId('p'), name: '', createdAt: Date.now(), updatedAt: Date.now(),
      tempo: 90, meter: '4/4', countIn: true, click: 'record', room: 0.35,
      key: 0, scale: 'major',   // what every instrument plays in: a pitch class (0 = C), a Theory scale id
      tracks: Array.from({ length: START_TRACKS }, blankTrack)
    };
  }
  const hasContent = tr => tr.notes.length > 0 || tr.hits.length > 0 || tr.regions.length > 0 || tr.clips.length > 0;
  const recordable = tr => !tr.kind || !!(KINDS[tr.kind] && KINDS[tr.kind].play);
  const engineOf = tr => (tr.kind && KINDS[tr.kind] ? KINDS[tr.kind].engine : 'notes');

  function cleanNotes(list) {
    return list
      .filter(n => n && Number.isFinite(n.m) && Number.isFinite(n.b) && Number.isFinite(n.d) && n.m >= 12 && n.m <= 120 && n.d > 0)
      .map(n => {
        const o = { m: n.m, b: n.b, d: n.d };
        if (typeof n.s === 'string') o.s = n.s;
        o.v = Number.isFinite(n.v) && n.v >= 0 && n.v <= 2 ? n.v : 1;
        return o;
      })
      .sort(byBeat);
  }
  function cleanHits(list) {
    const VI = window.VirtualInstruments;
    return list
      .filter(h => h && VI.INSTRUMENT_MAP[h.i] && Number.isFinite(h.b))
      .map(h => ({ i: h.i, b: h.b, g: Number.isFinite(h.g) ? clamp(h.g, 0, 2) : 1, r: Number.isFinite(h.r) && h.r > 0 ? h.r : 0 }))
      .sort(byBeat);
  }

  // -------- BLOCKS (note and ostinato tracks) --------
  // A keyboard, accordion, xylophone or brought-in track is kept as blocks,
  // as a voice track keeps takes: each block holds what was played (items,
  // in beats from the block's own beginning) and a window onto it — where
  // it sits (b), how far in the window opens (o), how long it is (d), how
  // long what was played is (len). Trimming narrows the window: nothing
  // played is lost. tr.notes / tr.hits are what the windows let through, in
  // the song's beats — what plays, draws and goes into a song file.
  function makeBlock(items, lo, hi) {
    return { b: lo, o: 0, d: hi - lo, len: hi - lo, items: items.map(n => ({ ...n, b: n.b - lo })) };
  }
  // A block round some notes (or hits): from the beat they start on to the
  // beat after they end. A note played a moment early still counts as on the beat.
  function blockAround(items, hits) {
    const lo = Math.floor(Math.min(...items.map(n => n.b)) + EARLY);
    const hi = Math.ceil(Math.max(...items.map(n => n.b + (hits ? (n.r || 0.25) : n.d))) - 1e-6);
    return makeBlock(items, lo, Math.max(hi, lo + 1));
  }
  function blockView(tr) {
    const hits = engineOf(tr) === 'hits', out = [];
    tr.clips.forEach(c => {
      const end = c.o + c.d;
      c.items.forEach(n => {
        if (n.b < c.o - EARLY || n.b >= end - 1e-6) return;
        const x = { ...n, b: c.b + n.b - c.o };
        if (!hits && n.b + n.d > end) x.d = Math.max(MIN_HOLD, end - n.b);   // a note held past the end stops there
        out.push(x);
      });
    });
    out.sort(byBeat);
    tr.notes = hits ? [] : out;
    tr.hits = hits ? out : [];
  }
  // What a block covers on its track goes, by the tape rules — and only
  // from view: the blocks underneath keep everything they hold.
  function cutBlocks(tr, lo, hi) {
    const out = [];
    const copy = c => c.items.map(n => ({ ...n }));
    tr.clips.forEach(c => {
      const e = c.b + c.d;
      if (e <= lo || c.b >= hi) { out.push(c); return; }
      if (c.b < lo) out.push({ ...c, d: lo - c.b, items: copy(c) });
      if (e > hi) { const cut = hi - c.b; out.push({ ...c, b: hi, o: c.o + cut, d: c.d - cut, items: copy(c) }); }
    });
    tr.clips = out;
  }

  // Anything missing or unknown falls back to the default, so every file opens.
  function normalizeTrack(src) {
    const t = blankTrack();
    if (!src || typeof src !== 'object') return t;
    if (typeof src.id === 'string' && /^[\w-]{1,40}$/.test(src.id)) t.id = src.id;
    if (KINDS[src.kind]) t.kind = src.kind;
    if (typeof src.name === 'string') t.name = src.name.slice(0, 40);
    const v = Number(src.volume);
    if (src.volume != null && v >= 0 && v <= 1.5) t.volume = v;
    t.muted = src.muted === true;
    t.solo = src.solo === true;
    if (typeof src.sound === 'string' && (Audio.PRESETS[src.sound] || src.sound === 'vibraphone' || src.sound === 'marimba')) t.sound = src.sound;
    if (Array.isArray(src.notes)) t.notes = cleanNotes(src.notes);
    if (Array.isArray(src.hits)) t.hits = cleanHits(src.hits);
    if (Array.isArray(src.regions)) {
      t.regions = src.regions
        .filter(r => r && typeof r.c === 'string' && /^[\w-]{1,40}$/.test(r.c) && Number.isFinite(r.b) && Number.isFinite(r.o) && Number.isFinite(r.d) && r.o >= 0 && r.d > 0)
        .map(r => ({ c: r.c, b: r.b, o: r.o, d: r.d }))
        .sort(byBeat);
    }
    // A note or ostinato track's blocks: as saved, or one block round what
    // an older file kept as plain notes. What plays is worked out from them.
    if (engineOf(t) !== 'audio') {
      const hits = engineOf(t) === 'hits';
      if (Array.isArray(src.clips) && src.clips.length) {
        t.clips = src.clips
          .filter(c => c && [c.b, c.o, c.d, c.len].every(Number.isFinite) && c.d > 0 && c.o >= 0 && Array.isArray(c.items))
          .map(c => ({ b: c.b, o: c.o, d: c.d, len: Math.max(c.len, c.o + c.d), items: hits ? cleanHits(c.items) : cleanNotes(c.items) }))
          .sort(byBeat);
      } else {
        const items = hits ? t.hits : t.notes;
        if (items.length) t.clips = [blockAround(items, hits)];
      }
      blockView(t);
    }
    if (src.from && typeof src.from === 'object') {
      t.from = { app: String(src.from.app || ''), title: String(src.from.title || '').slice(0, 80), id: src.from.id ? String(src.from.id) : '' };
      if (src.from.part) t.from.part = String(src.from.part);
    }
    if (!hasContent(t) && !(t.kind && !KINDS[t.kind].play)) { t.kind = null; t.from = null; }
    return t;
  }
  function normalizeProject(src) {
    const p = blankProject();
    if (!src || typeof src !== 'object') return p;
    if (typeof src.id === 'string' && /^[\w-]{1,40}$/.test(src.id)) p.id = src.id;
    if (typeof src.name === 'string') p.name = src.name.slice(0, 60);
    if (Number.isFinite(src.createdAt)) p.createdAt = src.createdAt;
    if (Number.isFinite(src.updatedAt)) p.updatedAt = src.updatedAt;
    const tempo = Math.round(Number(src.tempo));
    if (tempo >= TEMPO_MIN && tempo <= TEMPO_MAX) p.tempo = tempo;
    if (METERS[src.meter]) p.meter = src.meter;
    if (Number.isInteger(src.key) && src.key >= 0 && src.key < 12) p.key = src.key;
    if (Theory.SCALE_BY_ID[src.scale]) p.scale = src.scale === 'minor' ? 'natural-minor' : src.scale;
    if (typeof src.countIn === 'boolean') p.countIn = src.countIn;
    if (CLICKS.includes(src.click)) p.click = src.click;
    const room = Number(src.room);
    if (src.room != null && room >= 0 && room <= 1) p.room = room;
    if (Array.isArray(src.tracks) && src.tracks.length) {
      p.tracks = src.tracks.slice(0, MAX_TRACKS).map(normalizeTrack);
      const seen = new Set();
      p.tracks.forEach(t => { while (seen.has(t.id)) t.id = newId('t'); seen.add(t.id); });
    }
    return p;
  }

  // Beats to four places: a sixteenth of a millisecond at any tempo here.
  function compact(p) {
    const r = x => Math.round(x * 10000) / 10000;
    return {
      ...p,
      tracks: p.tracks.map(tr => {
        const cn = n => { const c = { m: n.m, b: r(n.b), d: r(n.d) }; if (n.s) c.s = n.s; if (n.v !== 1) c.v = r(n.v); return c; };
        const ch = h => { const c = { i: h.i, b: r(h.b) }; if (h.g !== 1) c.g = r(h.g); if (h.r) c.r = r(h.r); return c; };
        // what plays (as plain notes, which older copies of the studio read) and the blocks it comes from
        const o = { ...tr, notes: tr.notes.map(cn) };
        o.hits = tr.hits.map(ch);
        o.clips = tr.clips.map(c => ({ b: r(c.b), o: r(c.o), d: r(c.d), len: r(c.len), items: c.items.map(engineOf(tr) === 'hits' ? ch : cn) }));
        o.regions = tr.regions.map(g => ({ c: g.c, b: r(g.b), o: Math.round(g.o * 1e5) / 1e5, d: Math.round(g.d * 1e5) / 1e5 }));
        return o;
      })
    };
  }

  // -------- KEEPING IT --------
  let saveTimer = 0, saveWarned = false;
  function isBlank(p) { return !p.name && !p.tracks.some(hasContent); }
  function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 300); }
  function saveNow() {
    clearTimeout(saveTimer);
    if (!P) return;
    if (isBlank(P) && !projects[P.id]) return;   // a new, empty project is listed once it holds something
    P.updatedAt = Date.now();
    projects[P.id] = compact(P);
    const ok = saveJSON(PROJECTS_KEY, projects) && saveJSON(CURRENT_KEY, P.id);
    if (!ok && !saveWarned) { saveWarned = true; toast('This browser would not keep the project. Download a project file to keep it.'); }
    renderProjectChip();
  }
  function loadProjects() {
    const src = loadJSON(PROJECTS_KEY);
    projects = src && typeof src === 'object' ? src : {};
    const cur = loadJSON(CURRENT_KEY);
    P = normalizeProject(cur && projects[cur] ? projects[cur] : null);
  }
  function savePrefs() { saveJSON(PREFS_KEY, prefs); }
  function loadPrefs() {
    const p = loadJSON(PREFS_KEY);
    if (!p || typeof p !== 'object') return;
    if (Number.isFinite(p.volume)) prefs.volume = clamp(p.volume, 0, 1);
    if (INSTRUMENTS.includes(p.inst)) prefs.inst = p.inst;
    if (Number.isFinite(p.split)) prefs.split = p.split;
    prefs.folded = p.folded === true;
  }

  // -------- UNDO --------
  function pushUndo(label) {
    undo.push({ label, json: JSON.stringify(P) });
    if (undo.length > UNDO_MAX) undo.shift();
    redo = [];   // something new: what was undone can't come back on top of it
    renderTransport();
  }
  function doUndo() {
    if (busy()) return;
    const u = undo.pop();
    if (!u) return;
    redo.push({ label: u.label, json: JSON.stringify(P) });
    P = normalizeProject(JSON.parse(u.json));
    afterProjectChange();
    toast('Undone: ' + u.label);
  }
  function doRedo() {
    if (busy()) return;
    const r = redo.pop();
    if (!r) return;
    undo.push({ label: r.label, json: JSON.stringify(P) });
    P = normalizeProject(JSON.parse(r.json));
    afterProjectChange();
    toast('Redone: ' + r.label);
  }
  function afterProjectChange(keepPos) {
    // the armed track stays armed wherever it has moved to (a duplicate, a removal, an undo)
    const j = P.tracks.findIndex(t => t.id === armedId);
    if (j >= 0 && recordable(P.tracks[j])) R.armed = j;
    else if (R.armed >= P.tracks.length || !recordable(P.tracks[R.armed])) R.armed = firstRecordable();
    if (!keepPos) R.pos = songStart();
    applyLevels();
    if (audioWoken) Audio.setReverb(P.room);
    if (window.StudioLink) StudioLink.setKey(P.key, P.scale);
    buildTracks();
    renderAll();
    save();
  }

  // -------- TIME --------
  const barBeats = () => METERS[P.meter];
  const busy = () => R.state !== 'idle';
  function firstBeat() {
    let lo = Infinity;
    P.tracks.forEach(tr => { [tr.notes, tr.hits, tr.regions].forEach(l => { if (l.length && l[0].b < lo) lo = l[0].b; }); });
    return lo;
  }
  // The beginning: bar 1, or the bar before it when there is a pick-up — but a
  // note only a hair before a bar line was meant for the bar after it.
  function songStart() {
    const f = firstBeat();
    return Number.isFinite(f) ? Math.min(0, Math.floor((f + EARLY) / barBeats()) * barBeats()) : 0;
  }
  function songEnd() {
    let hi = 0;
    P.tracks.forEach(tr => {
      tr.notes.forEach(n => { if (n.b + n.d > hi) hi = n.b + n.d; });
      tr.hits.forEach(h => { if (h.b + 0.25 > hi) hi = h.b + 0.25; });
      tr.regions.forEach(g => { const e = g.b + g.d / (60 / P.tempo); if (e > hi) hi = e; });
    });
    return hi;
  }
  // a voice take's end, in beats at the tempo now (takes keep their own speed)
  const regionEnd = g => g.b + g.d / (60 / P.tempo);
  const listOf = tr => { const e = engineOf(tr); return e === 'hits' ? tr.hits : e === 'audio' ? tr.regions : tr.notes; };
  const clipIds = tracks => [...new Set(tracks.flatMap(t => t.regions.map(g => g.c)))];
  const isDownbeat = b => ((b % barBeats()) + barBeats()) % barBeats() === 0;
  const anyContent = () => P.tracks.some(hasContent);

  // -------- LEVELS --------
  function audible(tr) {
    if (tr.muted) return false;
    const solos = P.tracks.some(t => t.solo);
    return !solos || tr.solo;
  }
  const trackLevel = tr => (audible(tr) ? BASE * prefs.volume * tr.volume : 0);
  function applyLevels() {
    if (!run) return;
    P.tracks.forEach(tr => run.voices.level(tr, trackLevel(tr)));
  }

  // -------- THE RECORDING DELAY --------
  function storedDelay() {
    const d = loadJSON(DELAY_KEY);
    if (d && Number.isFinite(d.ms)) return d;
    const vk = loadJSON(VK_DELAY_KEY);
    if (vk && Number.isFinite(vk.ms) && vk.how === 'test') return { ms: vk.ms, how: 'keyboard' };
    return null;
  }
  function guessMs() {
    if (!audioWoken) return 0;
    const ctx = Audio.ensure();
    return Math.round((ctx.outputLatency || ctx.baseLatency || 0) * 1000);
  }
  const delayMs = () => { const d = storedDelay(); return d ? d.ms : guessMs(); };
  function setDelay(ms, how) {
    try {
      if (how) localStorage.setItem(DELAY_KEY, JSON.stringify({ ms, how }));
      else localStorage.removeItem(DELAY_KEY);
    } catch (e) {}
    renderTiming();
  }

  function wakeAudio() {
    const ctx = Audio.ensure();
    if (!audioWoken) { audioWoken = true; Audio.setReverb(P.room); }
    return ctx;
  }
  // When the input behind a call happened, on the audio clock.
  function clockOf(stamp) {
    const ctx = Audio.ensure();
    return ctx.currentTime - Math.max(0, performance.now() - stamp) / 1000;
  }
  const inputStamp = () => (window.StudioLink ? StudioLink.inputStamp() : performance.now());

  // The metronome: a short click straight to the speakers, never in a song file.
  function clickAt(ctx, t, accent) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = accent ? 1760 : 1175;
    const peak = Math.max(0.0002, 0.5 * prefs.volume * (accent ? 1 : 0.65));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g);
    g.connect(window.StudioBus ? StudioBus.out(ctx) : ctx.destination);
    o.start(t);
    o.stop(t + 0.09);
    o.onended = () => { try { o.disconnect(); g.disconnect(); } catch (e) {} };
    return o;
  }

  // -------- PLAY AND RECORD --------
  // What a track's note sounds like now: the track's own sound when it has one.
  const notePreset = (tr, n) => tr.sound || n.s || (tr.kind === 'xylophone' ? 'vibraphone' : 'piano');

  // Opened straight from its file, the browser walls the instrument frames and the
  // microphone recorder off from the page: there is nothing to record from.
  const FROM_FILE = location.protocol === 'file:';

  async function startRun(recording) {
    if (recording && FROM_FILE) { toast('Recording needs the studio opened with “Open the Recording Studio” (see the red note at the top).'); return; }
    const token = ++runToken;
    const ctx = wakeAudio();
    let from = R.pos;
    if (!recording) {
      if (!anyContent()) { toast('Nothing recorded yet. Pick a track and press ● to record.'); return; }
      if (from >= songEnd()) from = songStart();
    } else {
      const tr = P.tracks[R.armed];
      if (!tr || !recordable(tr)) { toast('Pick a track to record onto first (its round button).'); return; }
      if (tr.kind && hasContent(tr) && tr.kind !== R.inst) { toast(`Track ${R.armed + 1} is ${PLAYED[tr.kind] || 'another instrument'}'s. Pick an empty track for ${PLAYED[R.inst]}.`); return; }
      if (voiceSaving) { toast('Still keeping the last take — try again in a moment.'); return; }
      if (tr.muted) { tr.muted = false; }
    }
    const count = recording && P.countIn ? EVMCountIn.beats(barBeats()) : 0;
    R.state = 'priming';
    R.priming = recording ? 'recording' : 'playing';
    renderTransport();
    // a voice take needs the microphone; voice tracks need their takes in memory
    if (recording && R.inst === 'voice' && !(await StudioVoice.ensureMic())) {
      if (token === runToken) { R.state = 'idle'; renderTransport(); toast('The microphone is not on — see the Voice panel below.'); }
      return;
    }
    const ids = clipIds(P.tracks);
    if (ids.length) await StudioVoice.load(ids);
    if (token !== runToken) return;
    if (count) EVMCountIn.open(count, barBeats());
    const ok = await EVMCountIn.prime(ctx, { warm: count ? 0.35 : 0.12 });
    if (token !== runToken) return;
    if (!ok) {
      EVMCountIn.close();
      R.state = 'idle';
      renderTransport();
      toast('The sound did not start. Click the page, then try again.');
      return;
    }
    const spb = 60 / P.tempo;
    const anchor = ctx.currentTime + 0.1 + count * spb; // when beat `from` sounds
    run = {
      ctx, from, spb, anchor, count, recording,
      voices: Voices.start(ctx),
      delay: delayMs() / 1000,     // read once: the browser's own figure wanders a little
      armed: R.armed, inst: R.inst,
      end: songEnd(),
      next: P.tracks.map(tr => {
        const list = listOf(tr);
        // (a take already under way where this starts is joined part way in)
        const k = engineOf(tr) === 'audio' ? list.findIndex(g => regionEnd(g) > from) : list.findIndex(n => n.b >= from - count - EARLY);
        return k < 0 ? list.length : k;
      }),
      nextClick: Math.ceil(from - count - 1e-9),
      clicks: [], take: [], held: new Map(),
      timer: 0, raf: 0, drawn: 0
    };
    if (recording && R.inst === 'voice') {
      run.capture = StudioVoice.startCapture();
      run.vdelay = StudioVoice.delaySec();
      if (count) run.capture.countSpan = { from: anchor - count * spb, to: anchor - 0.03 };   // the speakers alone: the bleed is measured there
    }
    applyLevels();
    if (count) {
      const times = [];
      for (let k = count; k > 0; k--) times.push(EVMCountIn.heardAt(ctx, anchor - k * spb));
      EVMCountIn.run(times, EVMCountIn.heardAt(ctx, anchor));
    }
    R.state = recording ? 'recording' : 'playing';
    pump();
    run.timer = setInterval(pump, PUMP_MS);
    run.raf = requestAnimationFrame(frame);
    renderTransport();
    renderCtls();
    renderInstBar();
  }

  // Hand the engines every note, strike, hit and click due in the next moment.
  // A hidden page's timers run only once a second, so it looks further ahead
  // then. The end of a playback is caught here too: drawing stops while hidden.
  function pump() {
    if (!run) return;
    const ctx = run.ctx;
    if (!run.recording && heardBeat(run) > run.end + 0.05) { finishPlayback(); return; }
    const ahead = document.hidden ? HIDDEN_LOOKAHEAD : LOOKAHEAD;
    const until = run.from + (ctx.currentTime + ahead - run.anchor) / run.spb;
    P.tracks.forEach((tr, i) => {
      const eng = engineOf(tr);
      const list = listOf(tr);
      let k = run.next[i];
      if (k === undefined) return;   // a track added while it plays waits for the next run
      while (k < list.length && list[k].b < until) {
        const n = list[k++];
        if (run.recording && i === run.armed) continue; // the track being recorded over keeps its place, quiet
        const t = run.anchor + (n.b - run.from) * run.spb;
        if (eng === 'audio') {
          // a take begun before here (or before a tab woke) is joined part way in
          let at = t, offset = n.o, dur = n.d;
          const late = Math.max(run.anchor, ctx.currentTime + 0.005) - at;
          if (late > 0) { at += late; offset += late; dur -= late; }
          if (dur > 0.01) run.voices.audio(tr, { at, clip: n.c, offset, dur });
        } else if (eng === 'hits') {
          if (t < ctx.currentTime - 0.02) continue;
          run.voices.hit(tr, { at: t, inst: n.i, gain: n.g, gapMs: n.r * run.spb * 1000 });
        } else if (eng === 'strikes') {
          if (t < ctx.currentTime - 0.02) continue;
          run.voices.strike(tr, { at: t, freq: midiFreq(n.m), sound: notePreset(tr, n), level: n.v });
        } else {
          const hold = n.d * run.spb;
          if (t + hold < ctx.currentTime) continue; // long gone (a tab that slept)
          run.voices.note(tr, { at: t, hold, freq: midiFreq(n.m), preset: notePreset(tr, n), level: n.v });
        }
      }
      run.next[i] = k;
    });
    const clickOn = P.click === 'always' || (P.click === 'record' && run.recording);
    while (run.nextClick < until) {
      const b = run.nextClick++;
      const counting = b < run.from;
      if (counting ? run.count > 0 : clickOn) {
        run.clicks.push(clickAt(ctx, run.anchor + (b - run.from) * run.spb, isDownbeat(b)));
      }
    }
  }

  // The beat being heard now (the speakers are a little behind the clock).
  function heardBeat(r) {
    const latency = r.ctx.outputLatency || r.ctx.baseLatency || 0;
    return r.from + (r.ctx.currentTime - latency - r.anchor) / r.spb;
  }

  function frame(now) {
    if (!run) return;
    const beat = heardBeat(run);
    if (!run.recording && beat > run.end + 0.05) { finishPlayback(); return; }
    if (beat > view.end - barBeats() / 2) { view.end += 4 * barBeats(); drawAll(); }
    setHead(beat);
    posEl.textContent = beat < run.from && run.count ? 'Count-in' : posText(beat);
    if (run.recording && now - run.drawn > 80) { run.drawn = now; drawLane(run.armed); }
    run.raf = requestAnimationFrame(frame);
  }

  // A playback that reached the end: the last notes ring on.
  function finishPlayback() {
    const r = run;
    run = null;
    clearInterval(r.timer);
    cancelAnimationFrame(r.raf);
    R.state = 'idle';
    R.pos = r.from <= 0 ? songStart() : r.from;
    renderAll();
  }

  function stopRun() {
    runToken++; // a start still waking the sound will not go on
    EVMCountIn.close();
    const r = run;
    run = null;
    if (r) {
      clearInterval(r.timer);
      cancelAnimationFrame(r.raf);
      if (r.recording) keepTake(r);
      r.voices.stop();
      r.clicks.forEach(o => { try { o.stop(); } catch (e) {} });
      R.pos = r.from <= 0 ? songStart() : r.from;
    }
    R.state = 'idle';
    renderAll();
  }

  // Where a key went down or up, in beats, moved earlier by the recording delay.
  function beatNow(r) {
    const t = clockOf(inputStamp()) - r.delay;
    return r.from + (t - r.anchor) / r.spb;
  }

  // From the instrument link (link.js): every note the instrument plays.
  function noteOn(kind, id, freqs, sound, level) {
    if (!run || !run.recording || kind !== run.inst) return;
    const b = beatNow(run);
    if (b < run.from - run.count - 0.25) return; // before the count began
    if (run.held.has(id)) noteOff(kind, id);
    const n = freqs.length;
    const chord = n > 1 ? Math.min(1, 1.15 / Math.sqrt(n)) : 1; // the engine's share for each note of a chord
    const v = Math.round(((level == null ? BASE : level) / BASE) * chord * 1000) / 1000;
    run.held.set(id, { ms: freqs.map(freqMidi), b, s: sound, v });
  }
  function noteOff(kind, id) {
    if (!run || !run.recording || kind !== run.inst) return;
    const h = run.held.get(id);
    if (!h) return;
    run.held.delete(id);
    const d = Math.max(MIN_HOLD, beatNow(run) - h.b);
    h.ms.forEach(m => run.take.push({ m, b: h.b, d, s: h.s, v: h.v }));
  }
  // A struck note rings on its own: kept with the length it is drawn with.
  function noteHit(kind, freqs, sound, level) {
    if (!run || !run.recording || kind !== run.inst) return;
    const b = beatNow(run);
    if (b < run.from - run.count - 0.25) return;
    const d = clamp(Xylo.ring(sound) / run.spb, 0.25, 1);
    const v = Math.round((level == null ? 1 : level) * 1000) / 1000;
    freqs.forEach(f => run.take.push({ m: freqMidi(f), b, d, s: sound, v }));
  }

  // Tape rules: the take replaces what the track had from where it began to
  // where it stopped. A take with no notes changes nothing.
  function keepTake(r) {
    if (r.inst === 'voice') { keepVoiceTake(r); return; }
    const stop = beatNow(r);
    r.held.forEach(h => h.ms.forEach(m => r.take.push({ m, b: h.b, d: Math.max(MIN_HOLD, stop - h.b), s: h.s, v: h.v })));
    r.held.clear();
    if (!r.take.length) return;
    const tr = P.tracks[r.armed];
    if (!tr) return;
    pushUndo('the take on track ' + (r.armed + 1));
    const lo = Math.floor(Math.min(r.from, ...r.take.map(n => n.b)) + EARLY);   // on the beat: a note a moment early still counts
    const hi = Math.max(stop, ...r.take.map(n => n.b + n.d));
    tr.kind = r.inst;
    cutBlocks(tr, lo, hi);
    tr.clips.push(makeBlock(r.take, lo, hi));
    tr.clips.sort(byBeat);
    blockView(tr);
    save();
    if (!storedDelay() && !sessionGet('tip')) {
      sessionSet('tip');
      setTimeout(() => toast('Tip: “Line up the timing” in Settings sets the recording for these speakers or headphones.'), 600);
    } else if (P.tracks.filter(hasContent).length === 1) {
      const next = P.tracks.findIndex(t => !hasContent(t));
      if (next >= 0) setTimeout(() => toast(`Recorded. Pick track ${next + 1} to play another part over it.`), 600);
    }
  }
  /* A voice take: the microphone's sound from where Play began (or from a
     pick-up sung in the count-in) to Stop, moved back by the voice delay —
     the round trip out of the speakers and into the microphone. Kept as a
     clip of its own; the track gets a region of it, by the same tape rules. */
  let voiceSaving = false;
  async function keepVoiceTake(r) {
    const c = r.capture;
    if (!c) return;
    const stopT = r.ctx.currentTime;
    const tr = P.tracks[r.armed];
    voiceSaving = true;
    try {
      const res = await StudioVoice.endCapture(c, stopT);
      if (!res || !res.data.length || !tr) return;
      if (res.peak < 0.002) { toast('The microphone was silent, so nothing was kept. Check the meter in the Voice panel moves when you sing.'); return; }
      // Where the take sits: by its own bleed when the speakers were heard in it
      // (the round trip measured on this very take, so the backing in it lands
      // on the beat with the real tracks), else by the lined-up figure.
      const found = res.ref ? StudioVoice.measureDelay(res) : null;
      const vd = found ? found.sec : r.vdelay;
      const bleedDb = StudioVoice.bleedOf(res, vd);
      const tFrom = r.anchor + vd;                  // where beat `from` is in the take
      // The speakers' sound, taken back out: the studio knows what it sent (res.ref)
      // and, once the microphone is lined up, how the room returns it.
      let data = res.data, removedDb = null, removalFail = null, notLinedUp = false;
      if (res.ref && StudioVoice.removalReady()) {
        let out = null;
        try { out = await StudioVoice.removeBacking(res, found ? found.sec : null); } catch (e) { console.error(e); }
        if (out && (out.erle == null || (out.erle >= 6 && out.median > -1))) { data = out.clean; removedDb = out.erle == null ? null : Math.round(out.erle); }
        else if (out) removalFail = Math.round(out.erle);
      } else if (res.ref && !StudioVoice.echoFilter() && StudioVoice.removalWanted()) notLinedUp = true;
      const pick = StudioVoice.pickupOnset(Object.assign({}, res, { data }), tFrom);
      const startT = Math.max(res.t0, pick != null ? pick : tFrom);
      const endT = Math.min(stopT, res.t0 + res.data.length / res.rate);
      if (endT - startT < 0.05) return;            // stopped in the count-in
      const lo = r.from + (startT - vd - r.anchor) / r.spb;
      const hi = r.from + (endT - vd - r.anchor) / r.spb;
      const id = newId('c');
      const a = Math.round((startT - res.t0) * res.rate), b = Math.round((endT - res.t0) * res.rate);
      const take = StudioVoice.boosted(data.slice(a, b), res.boost);   // the Voice panel's boost, capped under full scale
      await StudioVoice.saveClip(id, res.rate, take.data, { gain: take.gain, clipped: take.clipped, mic: res.mic, removed: removedDb });
      pushUndo('the take on track ' + (r.armed + 1));
      cutRegions(tr, lo, hi);
      tr.regions.push({ c: id, b: lo, o: 0, d: (b - a) / res.rate });
      tr.regions.sort(byBeat);
      tr.kind = 'voice';
      save();
      renderAll();
      const bleedHot = Number.isFinite(bleedDb) && bleedDb > -6;
      const word = take.clipped ? 'That take was too loud for the microphone in places (it clipped). Move back a little for the next one.'
        : bleedHot ? `The speakers were loud at the microphone during the count-in (${Math.round(bleedDb)} dB): turn them down, or use headphones.`
          : removalFail != null ? `The backing could not be taken out of that take cleanly (${removalFail} dB), so it is kept as recorded. Line up the microphone again in the Voice panel.`
            : notLinedUp && !sessionGet('line-up-hint') ? (sessionSet('line-up-hint'), 'Line up the microphone (in the Voice panel) and the studio will take the backing back out of your voice takes.')
              : pick != null ? 'Kept the pick-up you sang in the count-in.'
                : removedDb != null ? `Backing taken out of the take: ${removedDb} dB.` : '';
      if (word) setTimeout(() => toast(word), 400);
      const notes = [];
      if (found) notes.push(`lined up by its own sound (${found.ms} ms)`);
      if (Number.isFinite(bleedDb)) notes.push(`speakers at the microphone ${Math.round(bleedDb)} dB${bleedHot ? ' (loud)' : ''}`);
      if (removedDb != null) notes.push(`backing taken out ${removedDb} dB`);
      else if (removalFail != null) notes.push(`backing left in (${removalFail} dB)`);
      else if (notLinedUp) notes.push('backing left in — line up the microphone first');
      StudioVoice.say(notes.length ? 'Last take: ' + notes.join(' · ') + '.' : '');
    } catch (e) {
      console.error(e);
      toast('The take could not be kept here (the browser’s storage may be full). Download the project file to keep your work.');
    } finally {
      voiceSaving = false;
    }
  }
  // What a take covers on a voice track goes, by tape rules: a take across
  // part of an older one leaves the rest of it.
  function cutRegions(tr, lo, hi) {
    const spb = 60 / P.tempo, out = [];
    tr.regions.forEach(g => {
      const e = regionEnd(g);
      if (e <= lo || g.b >= hi) { out.push(g); return; }
      if (g.b < lo) out.push({ c: g.c, b: g.b, o: g.o, d: (lo - g.b) * spb });
      if (e > hi) { const cut = (hi - g.b) * spb; out.push({ c: g.c, b: hi, o: g.o + cut, d: g.d - cut }); }
    });
    tr.regions = out;
  }

  function sessionGet(k) { try { return sessionStorage.getItem('evm_studio_' + k); } catch (e) { return null; } }
  function sessionSet(k) { try { sessionStorage.setItem('evm_studio_' + k, '1'); } catch (e) {} }

  function togglePlay() { if (busy()) stopRun(); else startRun(false); }
  function toggleRecord() { if (busy()) stopRun(); else startRun(true); }

  // -------- ARMING AND THE INSTRUMENT --------
  function firstRecordable() {
    const i = P.tracks.findIndex(recordable);
    return i < 0 ? -1 : i;
  }
  // The first track an instrument could record onto: one of its own, empty — or any empty one.
  function emptyFor(kind) {
    let i = P.tracks.findIndex(t => !hasContent(t) && recordable(t));
    if (i < 0 && P.tracks.length < MAX_TRACKS) { P.tracks.push(blankTrack()); i = P.tracks.length - 1; buildTracks(); }
    return i;
  }
  function arm(i) {
    if (busy()) return;
    const tr = P.tracks[i];
    if (!tr || !recordable(tr)) return;
    R.armed = i;
    if (tr.kind && hasContent(tr) && tr.kind !== R.inst) showInstrument(tr.kind, true);
    if (tr.kind && hasContent(tr) && window.StudioLink) {
      const s = tr.sound || (tr.notes[tr.notes.length - 1] || {}).s;
      if (s) StudioLink.setSound(tr.kind, s);   // so a punch-in sounds like the track
    }
    renderCtls();
    renderInstBar();
    drawAll();
  }
  function showInstrument(kind, fromArm) {
    if (!INSTRUMENTS.includes(kind)) return;
    if (busy() && R.state === 'recording') return;
    R.inst = kind;
    prefs.inst = kind;
    savePrefs();
    if (!fromArm && !busy()) {
      const tr = P.tracks[R.armed];
      if (!tr || !recordable(tr) || (hasContent(tr) && tr.kind !== kind)) {
        const j = emptyFor(kind);
        if (j >= 0) { R.armed = j; if (tr) toast(`Track ${j + 1} is ready for the ${KINDS[kind].label.toLowerCase()}.`); }
      }
    }
    if (window.StudioLink) StudioLink.show(kind);
    renderInstTabs();
    renderCtls();
    renderInstBar();
    drawAll();
  }

  // -------- THE TRACKS ON SCREEN --------
  function posText(beat) {
    const bpb = barBeats();
    const bar = Math.floor(beat / bpb + 1e-6);
    const inBar = Math.floor(beat - bar * bpb + 1e-6) + 1;
    return bar < 0 ? `Pick-up · ${inBar}` : `Bar ${bar + 1} · ${inBar}`;
  }
  // What the lanes show: the whole song, at least eight bars, and a bar to spare.
  function fitView() {
    const bpb = barBeats();
    const start = songStart();
    view = { start, end: Math.max(Math.ceil(songEnd() / bpb) * bpb + bpb, start + 8 * bpb, R.pos + bpb) };
  }
  const pxPerBeat = w => w / (view.end - view.start);

  const ICON = {
    keyboard: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M12 5v14M16 5v14"/><path class="fill" d="M6.6 5h2.8v8H6.6zM14.6 5h2.8v8h-2.8z"/></svg>',
    accordion: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="4.5" height="12" rx="1.2"/><rect x="17" y="6" width="4.5" height="12" rx="1.2"/><path d="M7 7.5l2.5 9 2.5-9 2.5 9 2.5-9"/></svg>',
    xylophone: '<svg viewBox="0 0 24 24"><path d="M5 5v14M9.5 6.5v11M14 8v8M18.5 9.5v5" stroke-width="3"/></svg>',
    ostinato: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"/><path d="M15 3.5l4-2M9 3.5 5 1.5"/></svg>',
    melody: '<svg viewBox="0 0 24 24"><path d="M9 18V5l10-2v12"/><circle class="fill" cx="6.5" cy="18" r="2.5"/><circle class="fill" cx="16.5" cy="15" r="2.5"/></svg>',
    chords: '<svg viewBox="0 0 24 24"><circle class="fill" cx="8" cy="18" r="2.4"/><circle class="fill" cx="8" cy="12.5" r="2.4"/><circle class="fill" cx="8" cy="7" r="2.4"/><path d="M10.4 18V3.5"/><path d="M14.5 8h6M14.5 12.5h6M14.5 17h6"/></svg>',
    voice: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>',
    empty: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" stroke-dasharray="2.5 2.5"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle class="fill" cx="5.5" cy="12" r="1.6"/><circle class="fill" cx="12" cy="12" r="1.6"/><circle class="fill" cx="18.5" cy="12" r="1.6"/></svg>'
  };
  const FROM_NAME = { 'ostinato-builder': 'Ostinato Builder', 'song-writer': 'Song Writer' };

  function trackName(tr) {
    if (tr.name) return tr.name;
    if (tr.from && tr.from.title) return tr.from.title + (tr.kind === 'melody' ? ' · melody' : tr.kind === 'chords' ? ' · chords' : '');
    if (tr.kind && hasContent(tr)) return KINDS[tr.kind].label;
    return 'Empty';
  }

  // A click moves the start to the nearest bar line.
  function placeStart(clientX, wrap) {
    const rect = wrap.getBoundingClientRect();
    const bpb = barBeats();
    const beat = view.start + (clientX - rect.left) / pxPerBeat(rect.width);
    R.pos = clamp(Math.round(beat / bpb) * bpb, songStart(), view.end - bpb);
    renderPos();
  }
  // grab(e): a lane's own use of a press (a voice take dragged); true = taken
  function makeLane(wrapCls, grab) {
    const wrap = document.createElement('div');
    wrap.className = 'lane ' + wrapCls;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    wrap.append(canvas);
    wrap.addEventListener('pointerdown', (e) => {
      if (busy() || e.button > 0) return;
      if (grab && grab(e)) return;
      placeStart(e.clientX, wrap);
    });
    return { wrap, canvas };
  }

  function buildTracks() {
    tracksEl.innerHTML = '';
    const rulerRow = document.createElement('div');
    rulerRow.className = 'row ruler-row';
    const corner = document.createElement('div');
    corner.className = 'ctl ctl-corner';
    corner.innerHTML = '<span>Tracks</span>';
    ruler = makeLane('ruler');
    rulerRow.append(corner, ruler.wrap);
    tracksEl.appendChild(rulerRow);

    rows = P.tracks.map((tr, i) => {
      const row = document.createElement('div');
      row.className = 'row track';
      row.style.setProperty('--tc', TRACK_COLORS[i % TRACK_COLORS.length]);
      const ctl = document.createElement('div');
      ctl.className = 'ctl';

      const arm = document.createElement('button');
      arm.type = 'button';
      arm.className = 'arm';
      arm.innerHTML = `<span class="arm-num">${i + 1}</span>`;
      arm.addEventListener('click', () => armTrack(i));

      const name = document.createElement('button');
      name.type = 'button';
      name.className = 'tname';
      name.addEventListener('pointerdown', (e) => dragTrack(e, i));
      name.addEventListener('click', () => { if (performance.now() - dragEnded > 300) armTrack(i); });

      const mute = document.createElement('button');
      mute.type = 'button';
      mute.className = 'mini mute';
      mute.textContent = 'M';
      mute.addEventListener('click', () => { P.tracks[i].muted = !P.tracks[i].muted; applyLevels(); renderCtls(); drawLane(i); save(); });

      const solo = document.createElement('button');
      solo.type = 'button';
      solo.className = 'mini solo';
      solo.textContent = 'S';
      solo.addEventListener('click', () => { P.tracks[i].solo = !P.tracks[i].solo; applyLevels(); renderCtls(); drawAll(); save(); });

      const vol = document.createElement('input');
      vol.type = 'range';
      vol.className = 'vol';
      vol.min = 0; vol.max = 100; vol.step = 1;
      vol.setAttribute('aria-label', `Track ${i + 1} volume`);
      vol.addEventListener('input', () => { P.tracks[i].volume = vol.value / 100; applyLevels(); vol.title = vol.value + '%'; save(); });

      const more = document.createElement('button');
      more.type = 'button';
      more.className = 'mini more';
      more.innerHTML = ICON.more;
      more.setAttribute('aria-label', `Track ${i + 1}: more`);
      more.setAttribute('aria-haspopup', 'menu');
      more.addEventListener('click', (e) => { e.stopPropagation(); openTrackMenu(i, more); });

      ctl.append(arm, name, mute, solo, vol, more);
      const lane = makeLane('track-lane', (e) => grabTake(e, i));
      lane.wrap.addEventListener('pointermove', (e) => { if (!e.buttons) hoverTake(e, i); });
      row.append(ctl, lane.wrap);
      tracksEl.appendChild(row);
      return { row, ctl, arm, name, mute, solo, vol, more, wrap: lane.wrap, canvas: lane.canvas };
    });

    if (P.tracks.length < MAX_TRACKS) {
      const addRow = document.createElement('div');
      addRow.className = 'row add-row';
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'add-track';
      add.innerHTML = '<span aria-hidden="true">+</span> Add a track';
      add.addEventListener('click', addTrack);
      const left = document.createElement('div');
      left.className = 'ctl';
      left.append(add);
      const note = document.createElement('div');
      note.className = 'add-note';
      note.textContent = `${P.tracks.length} of ${MAX_TRACKS} tracks`;
      addRow.append(left, note);
      tracksEl.appendChild(addRow);
    }
    const head = document.createElement('div');
    head.className = 'playhead';
    head.id = 'playhead';
    tracksEl.appendChild(head);
  }

  // Drag a track by its name, up or down, to put it somewhere else in the
  // list. The rows in between make room as it goes; a press that doesn't
  // move is still a click (it arms the track).
  let dragEnded = 0;
  function dragTrack(e, i) {
    if (busy() || e.button > 0 || P.tracks.length < 2) return;
    const btn = e.currentTarget, id = e.pointerId, startY = e.clientY;
    const mids = rows.map(r => { const b = r.row.getBoundingClientRect(); return b.top + b.height / 2; });
    const step = mids.length > 1 ? mids[1] - mids[0] : 0;
    let on = false, to = i;
    const move = (ev) => {
      if (ev.pointerId !== id) return;
      const dy = ev.clientY - startY;
      if (!on) {
        if (Math.abs(dy) < 6) return;
        on = true;
        try { btn.setPointerCapture(id); } catch (err) {}
        document.body.classList.add('dragging-track');
        rows[i].row.classList.add('lifted');
      }
      ev.preventDefault();
      const y = clamp(mids[i] + dy, mids[0], mids[mids.length - 1]);
      rows[i].row.style.transform = `translateY(${y - mids[i]}px)`;
      to = mids.filter((m, k) => k !== i && m < y).length;   // the rows it has passed
      rows.forEach((r, k) => {
        if (k === i) return;
        const shift = i < to && k > i && k <= to ? -step : i > to && k >= to && k < i ? step : 0;
        r.row.style.transform = shift ? `translateY(${shift}px)` : '';
      });
    };
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!on) return;
      dragEnded = performance.now();
      document.body.classList.remove('dragging-track');
      rows.forEach(r => { r.row.style.transform = ''; r.row.classList.remove('lifted'); });
      if (to === i || ev.type === 'pointercancel') return;
      pushUndo(`moving track ${i + 1} to place ${to + 1}`);
      const [tr] = P.tracks.splice(i, 1);
      P.tracks.splice(to, 0, tr);
      afterProjectChange(true);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  function armTrack(i) {
    const tr = P.tracks[i];
    if (!tr || busy()) return;
    if (!recordable(tr)) {
      toast(tr.from ? `Brought in from ${FROM_NAME[tr.from.app] || 'another app'} — its ⋯ menu moves or clears it.` : 'This track cannot be recorded onto.');
      return;
    }
    arm(i);
  }

  function addTrack() {
    if (busy() || P.tracks.length >= MAX_TRACKS) return;
    pushUndo('adding a track');
    P.tracks.push(blankTrack());
    R.armed = P.tracks.length - 1;
    buildTracks();
    renderAll();
    save();
    const r = rows[R.armed];
    if (r) r.row.scrollIntoView({ block: 'nearest' });
  }

  function renderCtl(i) {
    const c = rows[i], tr = P.tracks[i];
    if (!c || !tr) return;
    const armed = i === R.armed;
    const rec = recordable(tr);
    const kind = tr.kind && hasContent(tr) ? tr.kind : armed ? R.inst : null;
    c.row.classList.toggle('armed', armed && rec);
    c.row.classList.toggle('taking', armed && R.state === 'recording');
    c.row.classList.toggle('muted', !audible(tr));
    c.row.classList.toggle('brought', !rec);
    c.arm.disabled = !rec || (busy() && !armed);
    c.arm.setAttribute('aria-pressed', String(armed && rec));
    c.arm.setAttribute('aria-label', rec ? `Record onto track ${i + 1}` : `Track ${i + 1}`);
    c.arm.title = rec ? 'Record onto this track' : `From ${FROM_NAME[(tr.from || {}).app] || 'another app'}`;
    const empty = !hasContent(tr);
    const label = empty && armed && rec ? `For ${PLAYED[R.inst]}` : trackName(tr);
    c.name.innerHTML = `<span class="ticon">${ICON[kind || 'empty']}</span><span class="tlabel">${esc(label)}</span>`;
    c.name.classList.toggle('is-empty', empty);
    c.name.title = (tr.from ? `${trackName(tr)} — brought in from ${FROM_NAME[tr.from.app] || 'another app'}` : trackName(tr)) + ' · drag up or down to move it';
    c.name.disabled = busy() && !armed;
    c.mute.setAttribute('aria-pressed', String(tr.muted));
    c.mute.title = tr.muted ? 'Muted: not heard, and left out of song files' : 'Mute';
    c.mute.setAttribute('aria-label', `${tr.muted ? 'Unmute' : 'Mute'} track ${i + 1}`);
    c.solo.setAttribute('aria-pressed', String(tr.solo));
    c.solo.title = tr.solo ? 'Solo: only soloed tracks are heard' : 'Solo';
    c.solo.setAttribute('aria-label', `Solo track ${i + 1}`);
    c.vol.value = Math.round(tr.volume * 100);
    c.vol.title = c.vol.value + '%';
    c.more.disabled = busy();
  }
  function renderCtls() {
    armedId = P.tracks[R.armed] ? P.tracks[R.armed].id : null;
    P.tracks.forEach((_, i) => renderCtl(i));
  }

  function sizeLanes() {
    const dpr = window.devicePixelRatio || 1;
    const all = (ruler ? [ruler] : []).concat(rows);
    all.forEach(l => {
      const w = l.wrap.clientWidth, h = l.wrap.clientHeight;
      if (!w || !h) return;
      l.canvas.width = Math.round(w * dpr);
      l.canvas.height = Math.round(h * dpr);
      l.w = w; l.h = h; l.dpr = dpr;
    });
    // where the lanes begin inside #tracks, which holds the playhead (the
    // ruler row is sticky, so its offsetLeft leaves out the tracks' padding)
    if (ruler) ruler.x = ruler.wrap.getBoundingClientRect().left - tracksEl.getBoundingClientRect().left - tracksEl.clientLeft;
  }

  let cssCache = null;
  function cssVar(name) {
    if (!cssCache) cssCache = getComputedStyle(document.body);
    return cssCache.getPropertyValue(name).trim();
  }

  function drawRuler() {
    const l = ruler;
    if (!l || !l.w) return;
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    const ppb = pxPerBeat(l.w), bpb = barBeats();
    const every = [1, 2, 4, 8, 16, 32].find(n => n * bpb * ppb >= 26) || 64;
    g.font = '800 11px Nunito, system-ui, sans-serif';
    g.textBaseline = 'middle';
    for (let b = Math.ceil(view.start / bpb) * bpb; b < view.end; b += bpb) {
      const bar = b / bpb + 1;
      const x = (b - view.start) * ppb;
      g.fillStyle = cssVar('--line-strong');
      g.fillRect(Math.round(x), l.h - 7, 1, 7);
      if (bar >= 1 && (bar - 1) % every === 0) {
        g.fillStyle = cssVar('--text-3');
        g.fillText(String(bar), x + 4, l.h / 2 - 1);
      }
    }
    if (R.pos >= view.start) { // where Play starts
      const x = (R.pos - view.start) * ppb;
      g.fillStyle = cssVar('--accent');
      g.beginPath(); g.moveTo(x - 5, 0); g.lineTo(x + 5, 0); g.lineTo(x, 7); g.closePath(); g.fill();
    }
  }

  function gridLines(g, l, ppb) {
    g.fillStyle = cssVar('--line');
    for (let b = Math.ceil(view.start); b < view.end; b++) {
      const bar = isDownbeat(b);
      if (!bar && ppb < 9) continue;
      g.globalAlpha = bar ? 1 : 0.45;
      g.fillRect(Math.round((b - view.start) * ppb), 0, 1, l.h);
    }
    g.globalAlpha = 1;
    if (view.start < 0) { // the pick-up bar, shaded
      g.fillStyle = cssVar('--line');
      g.fillRect(0, 0, (0 - view.start) * ppb, l.h);
    }
  }

  function drawLane(i) {
    const l = rows[i], tr = P.tracks[i];
    if (!l || !l.w || !tr) return;
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    const ppb = pxPerBeat(l.w);
    gridLines(g, l, ppb);
    const base = audible(tr) ? 1 : 0.3;

    if (engineOf(tr) === 'audio') { drawTakes(i, l, g, ppb, base); return; }
    if (engineOf(tr) === 'hits') {
      // an ostinato: a row for each instrument, in the order they first play
      // (every hit the blocks hold, so trimming never reorders the rows)
      const order = [];
      tr.clips.forEach(c => c.items.forEach(h => { if (!order.includes(h.i)) order.push(h.i); }));
      const rowsN = Math.max(1, order.length);
      const rh = (l.h - 6) / rowsN;
      const col = TRACK_COLORS[i % TRACK_COLORS.length];
      drawBlocks(i, l, g, ppb, base);
      g.fillStyle = col;
      const hit = (h, alpha) => {
        const x = (h.b - view.start) * ppb;
        if (x < -4 || x > l.w + 4) return;
        const r = order.indexOf(h.i);
        g.globalAlpha = alpha * (0.55 + 0.45 * Math.min(1, h.g));
        g.fillRect(x, 3 + r * rh + rh * 0.15, Math.max(2, Math.min(ppb * 0.22, 6)), Math.max(2, rh * 0.7));
      };
      hiddenOf(i).forEach(h => hit(h, 0.25 * base));
      tr.hits.forEach(h => hit(h, base));
      g.globalAlpha = 1;
      if (rowsN > 1 && l.h / rowsN >= 9 && ppb * barBeats() > 40) {
        g.font = '700 9px Nunito, system-ui, sans-serif';
        g.textBaseline = 'middle';
        g.fillStyle = cssVar('--text-3');
        const VI = window.VirtualInstruments;
        order.forEach((id, r) => g.fillText((VI.INSTRUMENT_MAP[id] || {}).label || id, l.w - 60, 3 + r * rh + rh / 2));
      }
      return;
    }

    const taking = run && run.recording && run.armed === i;
    let fresh = [];
    if (taking) {
      const now = heardBeat(run);
      fresh = run.take.concat([...run.held.values()].flatMap(h => h.ms.map(m => ({ m, b: h.b, d: Math.max(MIN_HOLD, now - h.b) }))));
    }
    // the pitch range: every note the blocks hold, so trimming never rescales the lane
    const all = tr.clips.flatMap(c => c.items).concat(tr.notes, fresh);
    if (!all.length) {
      g.fillStyle = cssVar('--text-3');
      g.font = '700 12px Nunito, system-ui, sans-serif';
      g.textBaseline = 'middle';
      const armed = i === R.armed && recordable(tr);
      g.fillText(armed ? 'Empty — press ● to record here' : '', 10, l.h / 2);
      return;
    }
    let lo = Infinity, hi = -Infinity;
    all.forEach(n => { if (n.m < lo) lo = n.m; if (n.m > hi) hi = n.m; });
    if (hi - lo < 12) { const mid = (lo + hi) / 2; lo = mid - 6; hi = mid + 6; }
    const pad = 3, span = hi - lo;
    const nh = Math.max(2, Math.min(6, (l.h - 2 * pad) / (span + 1)));
    const y = m => pad + (hi - m) / span * (l.h - 2 * pad - nh);
    const strikes = engineOf(tr) === 'strikes';
    const paint = (n, alpha) => {
      const x = (n.b - view.start) * ppb;
      const w = Math.max(2, n.d * ppb - 1);
      if (x > l.w || x + w < 0) return;
      g.globalAlpha = alpha;
      g.fillStyle = noteColor(n.m);
      if (strikes) { // a struck note fades as it rings
        const grad = g.createLinearGradient(x, 0, x + w, 0);
        grad.addColorStop(0, noteColor(n.m));
        grad.addColorStop(1, 'transparent');
        g.fillStyle = grad;
      }
      g.fillRect(x, y(n.m), w, nh);
    };
    drawBlocks(i, l, g, ppb, base);
    hiddenOf(i).forEach(n => paint(n, 0.25 * base));   // what a block being dragged hides: an end can open it up again
    // while a take goes on, what it will replace is shown faint
    tr.notes.forEach(n => paint(n, taking && n.b >= run.from - run.count ? 0.25 : base));
    fresh.forEach(n => paint(n, 1));
    g.globalAlpha = 1;
  }

  // A note track's blocks: a faint box each, with its two ends marked (what a
  // press there trims).
  function drawBlocks(i, l, g, ppb, base) {
    const tr = P.tracks[i];
    g.fillStyle = TRACK_COLORS[i % TRACK_COLORS.length];
    tr.clips.forEach(c => {
      const x0 = (c.b - view.start) * ppb, x1 = x0 + c.d * ppb;
      if (x1 < 0 || x0 > l.w) return;
      g.globalAlpha = 0.1 * base;
      g.fillRect(x0, 3, x1 - x0, l.h - 6);
      g.globalAlpha = 0.8 * base;
      g.fillRect(Math.round(x0), 3, 2, l.h - 6);
      g.fillRect(Math.round(x1) - 2, 3, 2, l.h - 6);
    });
    g.globalAlpha = 1;
  }
  // What the window of the block being dragged leaves out, in the song's beats.
  function hiddenOf(i) {
    const tr = P.tracks[i];
    if (!takeEdit || takeEdit.i !== i || engineOf(tr) === 'audio') return [];
    const c = takeEdit.g, end = c.o + c.d;
    return c.items.filter(n => n.b < c.o - EARLY || n.b >= end - 1e-6).map(n => ({ ...n, b: c.b + n.b - c.o }));
  }

  // -------- MOVING AND TRIMMING TAKES AND BLOCKS --------
  // Drag a voice take or a note track's block left or right to move it (by
  // whole beats; Option/Alt for finer), or drag one of its ends to trim it.
  // Trimming only narrows the window ({ o, d }): the sound or notes cut off
  // are kept, and the same end dragged back out opens them up again. One
  // moved or widened over another covers it, by the tape rules (the one
  // covered keeps everything it holds too).
  const TAKE_MIN = 0.05;   // seconds: the shortest a voice take can be trimmed to
  const BLOCK_MIN = 0.25;  // beats: the shortest a block can be
  let takeEdit = null;     // { i, g } while a take or block is being dragged
  function takeAt(e, i) {
    const tr = P.tracks[i], l = rows[i];
    if (!tr || !l) return null;
    const audio = engineOf(tr) === 'audio';
    const list = audio ? tr.regions : tr.clips;
    const u = audio ? 60 / P.tempo : 1;   // a window's units in a beat: seconds for a take, beats for a block
    const rect = l.wrap.getBoundingClientRect();
    const ppb = pxPerBeat(rect.width), x = e.clientX - rect.left;
    for (let k = list.length - 1; k >= 0; k--) {
      const g = list[k];
      const x0 = (g.b - view.start) * ppb, x1 = x0 + g.d / u * ppb;
      const edge = Math.min(8, (x1 - x0) / 3);
      if (x < x0 - 4 || x > x1 + 4) continue;
      return { g, rect, ppb, u, audio, how: x <= x0 + edge ? 'start' : x >= x1 - edge ? 'end' : 'move' };
    }
    return null;
  }
  function hoverTake(e, i) {
    const hit = busy() ? null : takeAt(e, i);
    rows[i].wrap.style.cursor = !hit ? '' : hit.how === 'move' ? 'grab' : 'ew-resize';
  }
  function grabTake(e, i) {
    const hit = takeAt(e, i);
    if (!hit) return false;
    const tr = P.tracks[i], g = hit.g, u = hit.u, bpb = barBeats();
    const wrap = rows[i].wrap, id = e.pointerId, startX = e.clientX;
    const was = { b: g.b, o: g.o, d: g.d };
    const c = hit.audio ? StudioVoice.clip(g.c) : null;
    // how far the window can open: the whole recording (one not loaded yet can't
    // be opened up), or everything the block holds
    const full = hit.audio ? (c ? c.data.length / c.rate : g.o + g.d) : g.len;
    const least = hit.audio ? TAKE_MIN : BLOCK_MIN;
    const looked = () => { if (!hit.audio) blockView(tr); drawLane(i); };
    const snapPx = 6;
    // an edge lands on a beat line when it comes within a few pixels of one
    const magnet = (beat, free) => {
      if (free) return beat;
      const n = Math.round(beat);
      return Math.abs(n - beat) * hit.ppb < snapPx ? n : beat;
    };
    let on = false;
    const move = (ev) => {
      if (ev.pointerId !== id) return;
      const dx = ev.clientX - startX;
      if (!on) {
        if (Math.abs(dx) < 4) return;
        on = true;
        try { wrap.setPointerCapture(id); } catch (err) {}
        takeEdit = { i, g };
        document.body.classList.add(hit.how === 'move' ? 'dragging-take' : 'trimming-take');
      }
      ev.preventDefault();
      const beats = dx / hit.ppb;
      if (hit.how === 'move') {
        g.b = Math.max(-bpb, was.b + (ev.altKey ? beats : Math.round(beats)));
      } else if (hit.how === 'start') {
        let b = magnet(was.b + beats, ev.altKey);
        b = clamp(b, Math.max(-bpb, was.b - was.o / u), was.b + (was.d - least) / u);
        const ds = (b - was.b) * u;
        g.b = b; g.o = was.o + ds; g.d = was.d - ds;
      } else {
        const end = magnet(was.b + was.d / u + beats, ev.altKey);
        g.d = clamp((end - was.b) * u, least, full - was.o);
      }
      looked();
    };
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      wrap.removeEventListener('pointermove', move);
      wrap.removeEventListener('pointerup', up);
      wrap.removeEventListener('pointercancel', up);
      takeEdit = null;
      document.body.classList.remove('dragging-take', 'trimming-take');
      if (!on) { placeStart(ev.clientX, wrap); return; }   // a click on a take: Play starts at that bar, as anywhere
      const now = { b: g.b, o: g.o, d: g.d };
      Object.assign(g, was);
      if (ev.type === 'pointercancel' || (now.b === was.b && now.o === was.o && now.d === was.d)) { looked(); return; }
      pushUndo(`${hit.how === 'move' ? 'moving' : 'trimming'} ${hit.audio ? 'the take' : 'the part'} on track ${i + 1}`);
      Object.assign(g, now);
      if (hit.audio) {
        tr.regions = tr.regions.filter(r => r !== g);
        cutRegions(tr, g.b, regionEnd(g));
        tr.regions.push(g);
        tr.regions.sort(byBeat);
      } else {
        tr.clips = tr.clips.filter(k => k !== g);
        cutBlocks(tr, g.b, g.b + g.d);
        tr.clips.push(g);
        tr.clips.sort(byBeat);
        blockView(tr);
      }
      afterProjectChange(true);
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
    return true;
  }

  // A voice track: each take's waveform, in the track's colour.
  function drawTakes(i, l, g, ppb, base) {
    const tr = P.tracks[i];
    const spb = 60 / P.tempo, mid = l.h / 2, amp = l.h / 2 - 3, PPS = StudioVoice.peaksPerSec;
    const col = TRACK_COLORS[i % TRACK_COLORS.length];
    const taking = run && run.recording && run.armed === i && run.capture;
    const wave = (b, o, d, peaks, alpha) => {
      const x0 = (b - view.start) * ppb, x1 = x0 + d / spb * ppb;
      if (x1 < 0 || x0 > l.w) return;
      const a = Math.max(0, x0), z = Math.min(l.w, x1);
      g.fillStyle = col;
      g.globalAlpha = 0.16 * alpha;
      g.fillRect(a, 3, z - a, l.h - 6);
      g.globalAlpha = alpha;
      if (!peaks) { g.fillRect(a, mid - 0.5, z - a, 1); return; }
      const perPx = spb / ppb;                 // seconds a pixel
      for (let x = Math.floor(a); x < z; x++) {
        const t = o + (x - x0) * perPx;
        const k0 = Math.max(0, Math.floor(t * PPS)), k1 = Math.max(k0 + 1, Math.floor((t + perPx) * PPS));
        let p = 0;
        for (let k = k0; k < k1 && k < peaks.length; k++) if (peaks[k] > p) p = peaks[k];
        const h = Math.max(0.5, Math.min(1, p * 1.4) * amp);
        g.fillRect(x, mid - h, 1, 2 * h);
      }
    };
    const need = [];
    const edited = takeEdit && takeEdit.i === i ? takeEdit.g : null;
    if (edited) {   // the whole recording, faint, behind the take being trimmed or moved: what an edge can open up again
      const c = StudioVoice.clip(edited.c);
      if (c) wave(edited.b - edited.o / spb, 0, c.data.length / c.rate, c.peaks, 0.3 * base);
    }
    tr.regions.forEach(r => {
      if (r === edited) return;
      const c = StudioVoice.clip(r.c);
      if (!c && !StudioVoice.isMissing(r.c)) need.push(r.c);
      wave(r.b, r.o, r.d, c ? c.peaks : null, taking && regionEnd(r) > run.from ? 0.25 * base : base);
    });
    if (edited) { const c = StudioVoice.clip(edited.c); wave(edited.b, edited.o, edited.d, c ? c.peaks : null, base); }
    // each take's two ends: what a press there trims
    if (!taking) {
      g.fillStyle = col;
      g.globalAlpha = 0.8 * base;
      tr.regions.forEach(r => {
        const x0 = (r.b - view.start) * ppb, x1 = x0 + r.d / spb * ppb;
        if (x1 < 0 || x0 > l.w) return;
        g.fillRect(Math.round(x0), 3, 2, l.h - 6);
        g.fillRect(Math.round(x1) - 2, 3, 2, l.h - 6);
      });
    }
    if (need.length) StudioVoice.load(need).then(() => drawLane(i));
    if (taking && run.capture.t0 != null) {   // the take as it comes in
      const c = run.capture;
      wave(run.from + (c.t0 - run.vdelay - run.anchor) / run.spb, 0, c.peaks.length / PPS, c.peaks, 1);
    }
    g.globalAlpha = 1;
    if (!tr.regions.length && !taking && i === R.armed) {
      g.fillStyle = cssVar('--text-3');
      g.font = '700 12px Nunito, system-ui, sans-serif';
      g.textBaseline = 'middle';
      g.fillText('Empty — press ● to record here', 10, l.h / 2);
    }
  }

  function drawAll() {
    cssCache = null;
    drawRuler();
    P.tracks.forEach((_, i) => drawLane(i));
    setHead(run ? heardBeat(run) : R.pos);
  }

  function setHead(beat) {
    const head = el('playhead');
    const l = ruler;
    if (!head || !l || !l.w) return;
    const x = (beat - view.start) * pxPerBeat(l.w);
    head.style.transform = `translateX(${l.x + x}px)`;
    head.style.visibility = x < 0 || x > l.w ? 'hidden' : '';
  }

  function renderPos() {
    if (!run) { posEl.textContent = posText(R.pos); setHead(R.pos); drawRuler(); }
  }

  // -------- THE TRACK MENU --------
  const menu = el('track-menu');
  let menuFor = -1;
  function closeMenu() { menu.hidden = true; menuFor = -1; }
  function openTrackMenu(i, anchor) {
    if (busy()) return;
    if (menuFor === i && !menu.hidden) { closeMenu(); return; }
    const tr = P.tracks[i];
    menuFor = i;
    const eng = engineOf(tr);
    const has = hasContent(tr);
    const items = [];
    items.push(`<div class="menu-head">Track ${i + 1}</div>`);
    items.push(`<label class="menu-field"><span>Name</span><input type="text" maxlength="40" data-act="name" value="${esc(tr.name)}" placeholder="${esc(trackName({ ...tr, name: '' }))}"></label>`);
    items.push(`<label class="menu-field"><span>Volume</span><input type="range" min="0" max="100" step="1" data-act="volume" value="${Math.round(tr.volume * 100)}" style="accent-color:${TRACK_COLORS[i % TRACK_COLORS.length]}"><output>${Math.round(tr.volume * 100)}%</output></label>`);
    if (has && eng !== 'hits' && eng !== 'audio') {
      const opts = eng === 'strikes'
        ? Xylo.SOUNDS.map(([id, label]) => `<option value="${id}"${tr.sound === id ? ' selected' : ''}>${label}</option>`).join('')
        : Audio.PRESET_ORDER.map(id => `<option value="${id}"${tr.sound === id ? ' selected' : ''}>${esc(Audio.PRESETS[id].name)}</option>`).join('');
      items.push(`<label class="menu-field"><span>Sound</span><select class="select" data-act="sound"><option value=""${tr.sound ? '' : ' selected'}>As played</option>${opts}</select></label>`);
    }
    if (has) {
      items.push('<div class="menu-sep"></div>');
      items.push('<button type="button" role="menuitem" data-act="earlier">◀ Move a bar earlier</button>');
      items.push('<button type="button" role="menuitem" data-act="later">Move a bar later ▶</button>');
      if (eng !== 'hits' && eng !== 'audio') {
        items.push(`<div class="menu-field menu-row"><span>Tidy the timing</span><span class="menu-chips">
          <button type="button" data-act="tidy" data-grid="1" title="To the nearest beat">♩</button><button type="button" data-act="tidy" data-grid="0.5" title="To the nearest eighth">♪</button>
          <button type="button" data-act="tidy" data-grid="0.25" title="To the nearest sixteenth">♬</button><button type="button" data-act="tidy" data-grid="0.3333333333" title="To the nearest triplet">3</button></span></div>`);
      }
      if (P.tracks.length < MAX_TRACKS) items.push('<button type="button" role="menuitem" data-act="dup">Duplicate the track</button>');
      items.push('<button type="button" role="menuitem" data-act="clear">Clear the track</button>');
    }
    if (P.tracks.length > 1) items.push('<button type="button" role="menuitem" class="danger" data-act="remove">Remove the track</button>');
    items.push('<p class="menu-note">Undo brings back any of these.</p>');
    menu.innerHTML = items.join('');
    menu.hidden = false;
    const r = anchor.getBoundingClientRect();
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    menu.style.left = clamp(r.right - mw, 8, innerWidth - mw - 8) + 'px';
    menu.style.top = (r.bottom + mh + 8 > innerHeight ? Math.max(8, r.top - mh - 4) : r.bottom + 4) + 'px';
  }
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b || menuFor < 0) return;
    trackAction(menuFor, b.dataset.act, b.dataset.grid);
  });
  menu.addEventListener('change', (e) => {
    const t = e.target;
    if (menuFor < 0) return;
    const tr = P.tracks[menuFor];
    if (t.dataset.act === 'sound') {
      pushUndo('the sound of track ' + (menuFor + 1));
      tr.sound = t.value || null;
      save();
      toast(tr.sound ? `Track ${menuFor + 1} now plays as ${t.options[t.selectedIndex].text}.` : `Track ${menuFor + 1} plays as it was played.`);
    }
  });
  menu.addEventListener('input', (e) => {
    const t = e.target;
    if (menuFor < 0) return;
    if (t.dataset.act === 'name') {
      P.tracks[menuFor].name = t.value.slice(0, 40);
    } else if (t.dataset.act === 'volume') {
      P.tracks[menuFor].volume = t.value / 100;
      t.nextElementSibling.textContent = t.value + '%';
      applyLevels();
    } else return;
    renderCtl(menuFor);
    save();
  });
  menu.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') closeMenu(); });
  document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !menu.contains(e.target) && !e.target.closest('.more')) closeMenu(); });

  function shiftTrack(tr, beats) {
    tr.clips.forEach(c => { c.b += beats; });
    tr.regions.forEach(g => { g.b += beats; });
    if (engineOf(tr) !== 'audio') blockView(tr);
  }
  function trackAction(i, act, grid) {
    const tr = P.tracks[i];
    const bpb = barBeats();
    if (act === 'earlier' || act === 'later') {
      const d = act === 'earlier' ? -bpb : bpb;
      const first = Math.min(...[tr.notes, tr.hits, tr.regions].filter(l => l.length).map(l => l[0].b));
      if (first + d < -bpb - EARLY) { toast('It is already at the start (a pick-up bar is as early as a track goes).'); return; }
      pushUndo(`moving track ${i + 1}`);
      shiftTrack(tr, d);
    } else if (act === 'tidy') {
      const gs = Number(grid);
      pushUndo(`tidying track ${i + 1}`);
      // every note a block holds, hidden or not, put on the grid as the song counts
      if (engineOf(tr) === 'notes' || engineOf(tr) === 'strikes') tr.clips.forEach(c => {
        const at = c.b - c.o;   // the song's beat for the block's own 0
        const lo = c.b - EARLY, hi = c.b + c.d - 1e-6;   // the window, as the song counts
        c.items.forEach(n => {
          const nb = at + n.b;
          let b = Math.round(nb / gs) * gs;
          // a note heard now stays heard: never put out of its block's window
          if (nb >= lo && nb < hi) { if (b >= hi) b -= gs; else if (b < lo) b += gs; }
          const end = n.d >= gs * 0.75 ? Math.max(b + gs, Math.round((nb + n.d) / gs) * gs) : b + n.d;
          n.b = b - at; n.d = Math.max(MIN_HOLD, end - b);
        });
        c.items.sort(byBeat);
      });
      blockView(tr);
      toast(`Track ${i + 1}: every note moved to the nearest ${({ 1: 'beat', 0.5: 'eighth', 0.25: 'sixteenth' })[gs] || 'triplet'}.`);
    } else if (act === 'dup') {
      if (P.tracks.length >= MAX_TRACKS) return;
      pushUndo(`duplicating track ${i + 1}`);
      const copy = normalizeTrack(JSON.parse(JSON.stringify(tr)));
      copy.id = newId('t');
      copy.solo = false;
      P.tracks.splice(i + 1, 0, copy);
    } else if (act === 'clear') {
      pushUndo(`clearing track ${i + 1}`);
      P.tracks[i] = Object.assign(blankTrack(), { id: tr.id, volume: tr.volume });
      toast(`Track ${i + 1} cleared. Undo brings it back.`);
    } else if (act === 'remove') {
      if (P.tracks.length <= 1) return;
      pushUndo(`removing track ${i + 1}`);
      P.tracks.splice(i, 1);
      if (R.armed >= i && R.armed > 0) R.armed--;
      toast(`Track removed. Undo brings it back.`);
    }
    closeMenu();
    afterProjectChange(true);
  }

  // -------- THE TRANSPORT --------
  const PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
  const STOP_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/></svg>';
  function renderTransport() {
    const playing = R.state === 'playing' || (R.state === 'priming' && R.priming === 'playing');
    const recording = R.state === 'recording' || (R.state === 'priming' && R.priming === 'recording');
    playBtn.classList.toggle('on', busy());
    playBtn.innerHTML = busy() ? STOP_ICON : PLAY_ICON;
    playBtn.setAttribute('aria-label', busy() ? 'Stop' : 'Play');
    playBtn.title = busy() ? 'Stop (Space)' : 'Play (Space)';
    recordBtn.classList.toggle('on', recording);
    recordBtn.setAttribute('aria-pressed', String(recording));
    const label = R.armed >= 0 ? `Record onto track ${R.armed + 1}` : 'Record';
    recordBtn.setAttribute('aria-label', recording ? 'Stop recording' : label);
    recordBtn.title = recording ? 'Stop recording' : label;
    document.body.classList.toggle('is-recording', recording);
    document.body.classList.toggle('is-playing', playing);
    homeBtn.disabled = busy();
    [tempoInput, meterSelect, countInBtn, el('tempo-down'), el('tempo-up'), el('bring-btn')].forEach(c => { c.disabled = busy(); });
    undoBtn.disabled = busy() || !undo.length;
    undoBtn.title = undo.length ? 'Undo ' + undo[undo.length - 1].label : 'Nothing to undo';
    redoBtn.hidden = !redo.length;   // shows once Undo has taken something back
    redoBtn.disabled = busy();
    redoBtn.title = redo.length ? 'Redo ' + redo[redo.length - 1].label : '';
  }
  function renderSettings() {
    tempoInput.value = P.tempo;
    meterSelect.value = P.meter;
    countInBtn.setAttribute('aria-pressed', String(P.countIn));
    clickSelect.value = P.click;
    renderKey();
  }
  function renderAll() {
    if (!P) return;
    fitView();
    renderSettings();
    renderCtls();
    renderTransport();
    renderTiming();
    renderInstTabs();
    renderInstBar();
    renderProjectChip();
    sizeLanes();
    drawAll();
    renderPos();
  }

  playBtn.innerHTML = PLAY_ICON;
  playBtn.addEventListener('click', togglePlay);
  recordBtn.addEventListener('click', toggleRecord);
  homeBtn.addEventListener('click', () => { if (!busy()) { R.pos = songStart(); renderPos(); } });
  undoBtn.addEventListener('click', doUndo);
  redoBtn.addEventListener('click', doRedo);

  function setTempo(v) {
    v = Math.round(Number(v));
    if (!Number.isFinite(v)) v = P.tempo;
    const was = P.tempo;
    P.tempo = clamp(v, TEMPO_MIN, TEMPO_MAX);
    if (P.tempo !== was && P.tracks.some(t => t.regions.length) && !sessionGet('tempo-voice')) {
      sessionSet('tempo-voice');
      toast('Voice takes keep their own speed: a new tempo moves the other tracks under them.');
    }
    tempoInput.value = P.tempo;
    save();
  }
  tempoInput.addEventListener('change', () => { setTempo(tempoInput.value); tempoInput.blur(); });
  tempoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tempoInput.blur(); });
  el('tempo-down').addEventListener('click', () => setTempo(P.tempo - 1));
  el('tempo-up').addEventListener('click', () => setTempo(P.tempo + 1));
  // The key: one for the whole project, played by every instrument (link.js
  // hands it to each as it joins and whenever it changes). The scale menu is
  // the Virtual Keyboard's: Theory's scales, Minor listed once (as Natural Minor).
  const keySelect = el('key-select'), scaleSelect = el('scale-select');
  const prettyNote = n => n[0] + n.slice(1).replace(/#/g, '♯').replace(/b/g, '♭');
  (function fillScales() {
    const fams = [];
    Theory.SCALES.forEach(sc => {
      if (sc.id === 'minor') return;
      let f = fams.find(x => x.name === sc.family);
      if (!f) fams.push(f = { name: sc.family, items: [] });
      f.items.push(sc);
    });
    scaleSelect.innerHTML = fams.map(f => `<optgroup label="${esc(f.name)}">${f.items.map(sc => `<option value="${sc.id}">${esc(sc.name)}</option>`).join('')}</optgroup>`).join('');
  })();
  function renderKey() {
    // the keys spelled as this scale spells its tonic (C♯ minor, D♭ major)
    keySelect.innerHTML = Array.from({ length: 12 }, (_, pc) => `<option value="${pc}">${prettyNote(Theory.tonicName(pc, P.scale))}</option>`).join('');
    keySelect.value = String(P.key);
    scaleSelect.value = P.scale;
  }
  function setProjectKey(pc, scale) {
    P.key = pc;
    P.scale = scale;
    renderKey();
    save();
    if (window.StudioLink) StudioLink.setKey(P.key, P.scale);
  }
  keySelect.addEventListener('change', () => { setProjectKey(Number(keySelect.value), P.scale); keySelect.blur(); });
  scaleSelect.addEventListener('change', () => { setProjectKey(P.key, scaleSelect.value); scaleSelect.blur(); });
  // A key by name ('F#', 'Bb', 'E♭') → its pitch class, or -1.
  function keyPc(name) {
    const n = String(name || '').trim().replace(/♯/g, '#').replace(/♭/g, 'b');
    const k = n ? n[0].toUpperCase() + n.slice(1) : '';
    const i = Theory.TONIC_FLAT.indexOf(k);
    return i >= 0 ? i : Theory.TONIC_SHARP.indexOf(k);
  }

  meterSelect.addEventListener('change', () => { P.meter = meterSelect.value; meterSelect.blur(); R.pos = songStart(); renderAll(); save(); });
  countInBtn.addEventListener('click', () => { P.countIn = !P.countIn; renderSettings(); save(); });
  clickSelect.addEventListener('change', () => { P.click = clickSelect.value; clickSelect.blur(); save(); });

  // -------- THE INSTRUMENT AREA --------
  const instTabs = el('inst-tabs');
  INSTRUMENTS.forEach(kind => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'inst-tab';
    b.dataset.kind = kind;
    b.setAttribute('role', 'tab');
    b.innerHTML = `${ICON[kind]}<span>${KINDS[kind].label}</span>`;
    b.addEventListener('click', () => showInstrument(kind));
    instTabs.appendChild(b);
  });
  function renderInstTabs() {
    instTabs.querySelectorAll('.inst-tab').forEach(b => {
      const on = b.dataset.kind === R.inst;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
      b.disabled = R.state === 'recording' || (R.state === 'priming' && R.priming === 'recording');
    });
  }
  // Beside the tabs: the showing instrument's own sound and layout controls
  // (inst-controls.js), in the place a line of words used to take.
  function renderInstBar() {
    if (window.InstControls) InstControls.render(R.inst);
  }

  // Sharing the screen: drag the bar between the tracks and the instrument.
  const desk = el('desk'), split = el('split'), instPane = el('inst-pane'), foldBtn = el('inst-fold');
  function applySplit() {
    const h = desk.clientHeight;
    const min = 140, max = Math.max(min, h - 150);
    const want = prefs.split == null ? Math.max(300, Math.round(h * 0.5)) : prefs.split;
    instPane.style.height = prefs.folded ? '' : clamp(want, min, max) + 'px';
    document.body.classList.toggle('inst-folded', prefs.folded);
    foldBtn.setAttribute('aria-expanded', String(!prefs.folded));
    foldBtn.setAttribute('aria-label', prefs.folded ? 'Show the instrument' : 'Hide the instrument');
    foldBtn.title = prefs.folded ? 'Show the instrument' : 'Hide the instrument';
  }
  split.addEventListener('pointerdown', (e) => {
    if (prefs.folded) return;
    e.preventDefault();
    split.setPointerCapture(e.pointerId);
    document.body.classList.add('dragging');
    const startY = e.clientY, startH = instPane.offsetHeight;
    const move = (ev) => { prefs.split = startH - (ev.clientY - startY); applySplit(); };
    const up = () => {
      split.removeEventListener('pointermove', move);
      split.removeEventListener('pointerup', up);
      split.removeEventListener('pointercancel', up);
      document.body.classList.remove('dragging');
      prefs.split = instPane.offsetHeight;
      savePrefs();
    };
    split.addEventListener('pointermove', move);
    split.addEventListener('pointerup', up);
    split.addEventListener('pointercancel', up);
  });
  split.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    prefs.split = instPane.offsetHeight + (e.key === 'ArrowUp' ? 30 : -30);
    applySplit();
    savePrefs();
  });
  foldBtn.addEventListener('click', () => { prefs.folded = !prefs.folded; applySplit(); savePrefs(); });

  // -------- SHEETS --------
  function openSheet(id) {
    closeMenu();
    document.querySelectorAll('.sheet-backdrop.open').forEach(s => s.classList.remove('open'));
    el(id).classList.add('open');
  }
  function closeSheet(id) { el(id).classList.remove('open'); }
  document.querySelectorAll('.sheet-backdrop').forEach(bd => {
    bd.addEventListener('click', (e) => { if (e.target === bd || e.target.closest('[data-close]')) bd.classList.remove('open'); });
  });
  const sheetOpen = () => !!document.querySelector('.sheet-backdrop.open');

  // -------- PROJECTS --------
  function renderProjectChip() {
    el('project-title').textContent = P.name || 'Untitled project';
    el('project-kicker').textContent = projects[P.id] ? 'Project · saved here' : 'New project';
  }
  function ago(t) {
    const s = (Date.now() - t) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return Math.round(s / 60) + ' min ago';
    if (s < 86400) return Math.round(s / 3600) + ' h ago';
    const d = Math.round(s / 86400);
    return d === 1 ? 'yesterday' : d + ' days ago';
  }
  function projectSummary(p) {
    const used = (p.tracks || []).filter(t => (t.notes && t.notes.length) || (t.hits && t.hits.length)).length;
    return `${used} track${used === 1 ? '' : 's'} · ${p.tempo || 90} bpm · ${ago(p.updatedAt || 0)}`;
  }
  function renderProjectList() {
    const list = el('project-list');
    const ids = Object.keys(projects).sort((a, b) => (projects[b].updatedAt || 0) - (projects[a].updatedAt || 0));
    if (!ids.length) { list.innerHTML = '<p class="panel-note">Nothing saved yet. A project appears here once it has a track or a name.</p>'; return; }
    list.innerHTML = ids.map(id => {
      const p = projects[id];
      const cur = id === P.id;
      return `<div class="project-row${cur ? ' current' : ''}" data-id="${esc(id)}">
        <div class="project-meta"><span class="project-name">${esc(p.name || 'Untitled project')}</span><span class="project-sub">${esc(projectSummary(p))}</span></div>
        ${cur ? '<span class="project-badge">Open</span>' : '<button class="btn btn-sm" type="button" data-pact="open">Open</button>'}
        <button class="btn btn-sm btn-quiet" type="button" data-pact="delete">Delete</button>
      </div>`;
    }).join('');
  }
  el('project-list').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-pact]');
    if (!b) return;
    const row = b.closest('.project-row');
    const id = row.dataset.id;
    if (b.dataset.pact === 'open') { openProject(id); return; }
    if (b.dataset.pact === 'delete') {
      if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Delete — sure?'; b.classList.add('danger'); return; }
      const gone = clipIds(normalizeProject(projects[id]).tracks);
      delete projects[id];
      saveJSON(PROJECTS_KEY, projects);
      if (id === P.id) { P = blankProject(); undo = []; redo = []; afterProjectChange(); }
      forgetUnused(gone);
      renderProjectList();
      renderProjectChip();
    }
  });
  // Takes no project here (nor an undo step) still uses are let go.
  function usedClips() {
    const used = new Set(clipIds(P.tracks));
    Object.values(projects).forEach(p => clipIds(normalizeProject(p).tracks).forEach(c => used.add(c)));
    undo.concat(redo).forEach(u => { try { clipIds(normalizeProject(JSON.parse(u.json)).tracks).forEach(c => used.add(c)); } catch (e) {} });
    return used;
  }
  function forgetUnused(candidates) {
    const used = usedClips();
    StudioVoice.forget(candidates.filter(c => !used.has(c)));
  }
  function openProject(id) {
    if (busy()) stopRun();
    saveNow();
    P = normalizeProject(projects[id]);
    undo = []; redo = [];
    saveJSON(CURRENT_KEY, P.id);
    afterProjectChange();
    el('project-name').value = P.name;
    renderProjectList();
    el('project-status').textContent = `Opened ${P.name || 'Untitled project'}.`;
  }
  el('project-btn').addEventListener('click', () => {
    if (busy()) stopRun();
    el('project-name').value = P.name;
    el('project-status').textContent = '';
    renderProjectList();
    openSheet('projects-sheet');
  });
  el('project-name').addEventListener('input', (e) => {
    P.name = e.target.value.slice(0, 60);
    renderProjectChip();
    save();
    const row = el('project-list').querySelector(`.project-row.current .project-name`);
    if (row) row.textContent = P.name || 'Untitled project';
  });
  el('project-new').addEventListener('click', () => {
    saveNow();
    P = blankProject();
    undo = []; redo = [];
    R.armed = 0;
    afterProjectChange();
    el('project-name').value = '';
    renderProjectList();
    el('project-status').textContent = 'A new project. It is saved here once it has a track or a name.';
  });
  el('project-copy').addEventListener('click', () => {
    saveNow();
    const copy = normalizeProject(JSON.parse(JSON.stringify(P)));
    copy.id = newId('p');
    copy.name = ((P.name || 'Untitled project') + ' (copy)').slice(0, 60);
    copy.createdAt = Date.now();
    P = copy;
    undo = []; redo = [];
    saveNow();
    el('project-name').value = P.name;
    renderProjectList();
    renderProjectChip();
    el('project-status').textContent = 'This is now the copy; the first one is kept as it was.';
  });

  function fileBase() {
    const name = (P.name || 'Studio recording').trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ');
    return name || 'Studio recording';
  }
  function download(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  // A project file is an Eagle View Music envelope (EVM Library/README.md §7).
  // Voice takes travel inside it, as 16-bit samples (so a file with voices is big).
  el('project-dl').addEventListener('click', async () => {
    const data = compact(P);
    const ids = clipIds(P.tracks);
    if (ids.length) {
      el('project-status').textContent = 'Packing the voice takes…';
      data.clips = await StudioVoice.exportClips(ids);
    }
    const blob = new Blob([JSON.stringify({ format: 'evm-item', formatVersion: 1, app: APP_SLUG, kind: 'studio-project', title: fileBase(), data }, null, ids.length ? 0 : 1)], { type: 'application/json' });
    download(blob, `${fileBase()}.json`);
    el('project-status').textContent = `Saved ${fileBase()}.json (${blob.size > 1048576 ? (blob.size / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(blob.size / 1024)) + ' KB'}${ids.length ? ', voice takes included' : ''}).`;
  });
  const projectFile = el('project-file');
  el('project-open').addEventListener('click', () => projectFile.click());
  projectFile.addEventListener('change', () => {
    const file = projectFile.files[0];
    projectFile.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      let obj = null;
      try { obj = JSON.parse(reader.result); } catch (e) {}
      let data = null;
      if (obj && obj.format === 'evm-item' && obj.app === APP_SLUG && obj.kind === 'studio-project') data = obj.data;
      else if (obj && Array.isArray(obj.tracks) && obj.tracks.some(t => t && (t.kind || t.hits))) data = obj;
      if (!data) { el('project-status').textContent = 'That file is not a Recording Studio project.'; return; }
      if (busy()) stopRun();
      saveNow();
      if (data.clips) { el('project-status').textContent = 'Unpacking the voice takes…'; await StudioVoice.importClips(data.clips); }
      P = normalizeProject(data);
      if (projects[P.id]) P.id = newId('p');   // opened as a project of its own, never over one kept here
      undo = []; redo = [];
      afterProjectChange();
      saveNow();
      el('project-name').value = P.name;
      renderProjectList();
      el('project-status').textContent = 'Opened ' + file.name + '.';
    };
    reader.readAsText(file);
  });

  // -------- SAVE THE SONG (MP3 / WAV) --------
  const saveStatus = el('save-status');
  let exporting = false;
  el('save-btn').addEventListener('click', () => {
    if (busy()) stopRun();
    saveStatus.textContent = '';
    openSheet('save-sheet');
  });
  const pause = () => new Promise(resolve => setTimeout(resolve, 0));

  // The tracks that are heard, from the first note (a breath before it) to the
  // last note and its ring.
  function songForFile() {
    const tracks = P.tracks.filter(tr => audible(tr) && hasContent(tr));
    if (!tracks.length) return null;
    const spb = 60 / P.tempo;
    let lo = Infinity, hi = -Infinity;
    tracks.forEach(tr => {
      tr.notes.forEach(n => { lo = Math.min(lo, n.b); hi = Math.max(hi, n.b + n.d); });
      tr.hits.forEach(h => { lo = Math.min(lo, h.b); hi = Math.max(hi, h.b + 0.5); });
      tr.regions.forEach(g => { lo = Math.min(lo, g.b); hi = Math.max(hi, regionEnd(g)); });
    });
    const at = b => LEAD + (b - lo) * spb;
    return {
      seconds: LEAD + (hi - lo) * spb + TAIL,
      room: P.room,
      tracks: tracks.map(tr => {
        const eng = engineOf(tr);
        let events;
        if (eng === 'audio') events = tr.regions.map(g => ({ at: at(g.b), clip: g.c, offset: g.o, dur: g.d }));
        else if (eng === 'hits') events = tr.hits.map(h => ({ at: at(h.b), inst: h.i, gain: h.g, gapMs: h.r * spb * 1000 }));
        else if (eng === 'strikes') events = tr.notes.map(n => ({ at: at(n.b), freq: midiFreq(n.m), sound: notePreset(tr, n), level: n.v }));
        else events = tr.notes.map(n => ({ at: at(n.b), hold: n.d * spb, freq: midiFreq(n.m), preset: notePreset(tr, n), level: n.v }));
        return { kind: tr.kind, level: BASE * tr.volume, events };
      })
    };
  }

  const toS16 = x => (x < -1 ? -32768 : x > 1 ? 32767 : Math.round(x < 0 ? x * 32768 : x * 32767));
  async function encodeMp3(buffer, progress) {
    const enc = new lamejs.Mp3Encoder(2, buffer.sampleRate, 192);
    const L = buffer.getChannelData(0), Rt = buffer.getChannelData(1);
    const BLOCK = 1152, l16 = new Int16Array(BLOCK), r16 = new Int16Array(BLOCK);
    const out = [];
    let rested = performance.now();
    for (let i = 0; i < L.length; i += BLOCK) {
      const n = Math.min(BLOCK, L.length - i);
      for (let k = 0; k < n; k++) { l16[k] = toS16(L[i + k]); r16[k] = toS16(Rt[i + k]); }
      const chunk = n === BLOCK ? enc.encodeBuffer(l16, r16) : enc.encodeBuffer(l16.subarray(0, n), r16.subarray(0, n));
      if (chunk.length) out.push(chunk);
      if (performance.now() - rested > 40) { progress(i / L.length); await pause(); rested = performance.now(); }
    }
    const end = enc.flush();
    if (end.length) out.push(end);
    return new Blob(out, { type: 'audio/mpeg' });
  }
  function encodeWav(buffer) {
    const L = buffer.getChannelData(0), Rt = buffer.getChannelData(1);
    const len = buffer.length, rate = buffer.sampleRate;
    const dv = new DataView(new ArrayBuffer(44 + len * 4));
    const text = (at, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(at + i, s.charCodeAt(i)); };
    text(0, 'RIFF'); dv.setUint32(4, 36 + len * 4, true); text(8, 'WAVE');
    text(12, 'fmt '); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 2, true);
    dv.setUint32(24, rate, true); dv.setUint32(28, rate * 4, true); dv.setUint16(32, 4, true); dv.setUint16(34, 16, true);
    text(36, 'data'); dv.setUint32(40, len * 4, true);
    for (let i = 0, at = 44; i < len; i++, at += 4) {
      dv.setInt16(at, toS16(L[i]), true);
      dv.setInt16(at + 2, toS16(Rt[i]), true);
    }
    return new Blob([dv], { type: 'audio/wav' });
  }
  async function exportSong(kind) {
    if (exporting) return;
    const song = songForFile();
    if (!song) { saveStatus.textContent = 'Nothing to save yet. Record or bring in a track first (muted tracks are left out).'; return; }
    if (kind === 'mp3' && typeof lamejs === 'undefined') { saveStatus.textContent = 'The MP3 maker did not load. Try WAV, or reload the page.'; return; }
    exporting = true;
    document.querySelectorAll('#save-mp3, #save-wav').forEach(b => { b.disabled = true; });
    try {
      saveStatus.textContent = 'Mixing the tracks…';
      await StudioVoice.load(clipIds(P.tracks.filter(tr => audible(tr))));
      await pause();
      const buffer = await Voices.render(song);
      const blob = kind === 'mp3'
        ? await encodeMp3(buffer, p => { saveStatus.textContent = `Making the MP3… ${Math.round(p * 100)}%`; })
        : encodeWav(buffer);
      const filename = `${fileBase()}.${kind}`;
      download(blob, filename);
      const secs = Math.round(buffer.duration);
      saveStatus.textContent = `Saved ${filename} (${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}, ${(blob.size / 1048576).toFixed(1)} MB).`;
      Studio.lastExport = { kind, bytes: blob.size, seconds: buffer.duration };
    } catch (e) {
      console.error(e);
      saveStatus.textContent = 'Something went wrong making the file. Please try again.';
    } finally {
      exporting = false;
      document.querySelectorAll('#save-mp3, #save-wav').forEach(b => { b.disabled = false; });
    }
  }
  el('save-mp3').addEventListener('click', () => exportSong('mp3'));
  el('save-wav').addEventListener('click', () => exportSong('wav'));

  // -------- SETTINGS --------
  const volumeRange = el('volume-range'), roomRange = el('room-range');
  function renderVolume() {
    volumeRange.value = Math.round(prefs.volume * 100);
    el('volume-value').textContent = volumeRange.value + '%';
    roomRange.value = Math.round(P.room * 100);
    el('room-value').textContent = roomRange.value + '%';
  }
  volumeRange.addEventListener('input', () => { prefs.volume = volumeRange.value / 100; renderVolume(); applyLevels(); savePrefs(); });
  roomRange.addEventListener('input', () => { P.room = roomRange.value / 100; renderVolume(); if (audioWoken) Audio.setReverb(P.room); save(); });
  el('settings-btn').addEventListener('click', () => { renderVolume(); renderTheme(); renderTiming(); openSheet('settings-sheet'); });
  function renderTheme() {
    const t = document.documentElement.dataset.theme || 'auto';
    document.querySelectorAll('input[name="theme"]').forEach(r => { r.checked = r.value === t; });
  }
  document.querySelectorAll('input[name="theme"]').forEach(r => r.addEventListener('change', () => {
    if (r.value === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem(THEME_KEY); } catch (e) {} }
    else { document.documentElement.dataset.theme = r.value; try { localStorage.setItem(THEME_KEY, r.value); } catch (e) {} }
    drawAll();
  }));
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', drawAll);

  function renderTiming() {
    const d = storedDelay();
    const ms = delayMs();
    const s = el('set-delay');
    if (s) s.textContent = d
      ? `Recordings are moved ${Math.abs(ms)} ms ${ms >= 0 ? 'earlier' : 'later'} (${d.how === 'test' ? 'measured here' : d.how === 'keyboard' ? 'measured in the Virtual Keyboard' : 'set by hand'}).`
      : 'Not measured on this device yet — the browser’s own figure is used.';
    renderCal();
  }

  // -------- LINE UP THE TIMING (the tap-along test, from the Virtual Keyboard) --------
  // A steady click: four to listen to, then ten to tap along with. The first
  // two taps are left out while the player settles; the rest are matched to
  // their clicks, and the middle value is the delay.
  const CAL = { bpm: 80, listen: 4, taps: 10, skip: 2, need: 5, spread: 0.04 };
  const calSheet = el('cal-sheet'), calPad = el('cal-pad'), calMsg = el('cal-msg'), calDots = el('cal-dots');
  const calRange = el('cal-range'), calValue = el('cal-value');
  let cal = null, calToken = 0, calDoneAt = 0;

  function buildCalDots() {
    calDots.innerHTML = '';
    for (let i = 0; i < CAL.listen + CAL.taps; i++) {
      const d = document.createElement('span');
      d.className = 'cal-dot' + (i < CAL.listen ? ' listen' : '');
      calDots.appendChild(d);
    }
  }
  function calDot(i, cls) { const d = calDots.children[i]; if (d) d.classList.add(cls); }
  function renderCal() {
    const ms = delayMs();
    calRange.value = ms;
    calValue.textContent = `${ms > 0 ? '+' : ms < 0 ? '−' : ''}${Math.abs(ms)} ms`;
    if (!cal) { calPad.textContent = calPad.dataset.again ? 'Again' : 'Start'; calPad.classList.remove('running'); }
  }
  async function startCal() {
    stopCal();
    if (busy()) stopRun();
    const ctx = wakeAudio();
    const token = ++calToken;
    cal = { token, clicks: [], taps: new Map(), timers: [], nodes: [] };
    buildCalDots();
    calPad.textContent = 'Listen…';
    calPad.classList.add('running');
    calMsg.textContent = 'Listen to four clicks, then tap along with the rest.';
    const ok = await EVMCountIn.prime(ctx, { warm: 0.35 });
    if (!cal || cal.token !== token) return;
    if (!ok) { stopCal(); calMsg.textContent = 'The sound did not start. Click the page, then try again.'; return; }
    const spb = 60 / CAL.bpm, n = CAL.listen + CAL.taps;
    const t0 = ctx.currentTime + 0.25;
    for (let i = 0; i < n; i++) {
      const t = t0 + i * spb;
      cal.clicks.push(t);
      cal.nodes.push(clickAt(ctx, t, i % 4 === 0));
      cal.timers.push(setTimeout(() => calBeat(i), Math.max(0, EVMCountIn.heardAt(ctx, t) - performance.now())));
    }
    cal.timers.push(setTimeout(finishCal, Math.max(0, EVMCountIn.heardAt(ctx, t0 + (n - 0.2) * spb) - performance.now())));
  }
  function calBeat(i) {
    if (!cal) return;
    calDot(i, 'lit');
    if (i > 0) calDots.children[i - 1].classList.remove('lit');
    if (i === CAL.listen) calMsg.textContent = 'Now tap along with each click.';
    calPad.textContent = i < CAL.listen ? 'Listen…' : 'Tap!';
    calPad.classList.remove('beat');
    void calPad.offsetWidth;
    calPad.classList.add('beat');
  }
  // A tap belongs to the click it is nearest — up to three quarters of a beat late still counts.
  function calTap(stamp) {
    if (!cal || !cal.clicks.length) return;
    const spb = 60 / CAL.bpm;
    const t = clockOf(stamp);
    const i = Math.floor((t - cal.clicks[0] + 0.25 * spb) / spb);
    if (i < 0 || i >= cal.clicks.length) return;
    const off = t - cal.clicks[i];
    if (!cal.taps.has(i) || Math.abs(off) < Math.abs(cal.taps.get(i))) cal.taps.set(i, off);
    if (i >= CAL.listen) calDot(i, 'hit');
    calPad.classList.remove('tapped');
    void calPad.offsetWidth;
    calPad.classList.add('tapped');
  }
  function median(xs) {
    const s = xs.slice().sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }
  function finishCal() {
    if (!cal) return;
    const offs = [...cal.taps].filter(([i]) => i >= CAL.listen + CAL.skip).map(([, off]) => off);
    stopCal();
    calDoneAt = performance.now();
    calPad.dataset.again = '1';
    renderCal();
    if (offs.length < CAL.need) {
      calMsg.textContent = offs.length
        ? `Only ${offs.length} taps landed near the clicks. Try again, tapping right on each click.`
        : 'No taps were heard. Press Start, then tap the pad (or any key) with each click.';
      return;
    }
    const mid = median(offs);
    const spread = median(offs.map(o => Math.abs(o - mid)));
    if (spread > CAL.spread) {
      calMsg.textContent = `The taps were too spread out to measure (about ±${Math.round(spread * 1000)} ms). Try again, tapping right on each click.`;
      return;
    }
    const ms = Math.round(mid * 1000);
    setDelay(ms, 'test');
    calMsg.textContent = ms >= 0
      ? `Your setup is ${ms} ms behind. Recordings will be moved ${ms} ms earlier.`
      : `You tap ${-ms} ms ahead of the click. Recordings will be moved ${-ms} ms later.`;
  }
  function stopCal() {
    if (!cal) return;
    cal.timers.forEach(clearTimeout);
    cal.nodes.forEach(o => { try { o.stop(); } catch (e) {} });
    calDots.querySelectorAll('.lit').forEach(d => d.classList.remove('lit'));
    calPad.classList.remove('beat', 'tapped');
    cal = null;
    renderCal();
  }
  function openCal() {
    if (busy()) stopRun();
    buildCalDots();
    delete calPad.dataset.again;
    calMsg.textContent = 'Listen to four clicks, then tap along with the next ten: on the pad, or with any key.';
    renderCal();
    openSheet('cal-sheet');
  }
  calPad.addEventListener('pointerdown', (e) => { if (cal) { e.preventDefault(); calTap(e.timeStamp); } });
  calPad.addEventListener('click', () => { if (!cal && performance.now() - calDoneAt > 800) startCal(); });
  // While the test runs, any key is a tap and plays nothing.
  window.addEventListener('keydown', (e) => {
    if (!cal || e.key === 'Escape') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!e.repeat) calTap(e.timeStamp);
  }, true);
  new MutationObserver(() => { if (!calSheet.classList.contains('open')) stopCal(); })
    .observe(calSheet, { attributes: true, attributeFilter: ['class'] });
  calRange.addEventListener('input', () => setDelay(Number(calRange.value), 'hand'));
  el('cal-reset').addEventListener('click', () => {
    setDelay(0, null);
    calMsg.textContent = `Back to the browser's own figure (${guessMs()} ms). Press Start to measure.`;
  });
  el('settings-calibrate').addEventListener('click', () => { closeSheet('settings-sheet'); openCal(); });

  // -------- KEYS --------
  // Space plays and stops; Escape stops (or closes a sheet). Any other key goes
  // to the instrument showing, so the computer keyboard always plays it.
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    const typing = t && t.closest && t.closest('input, textarea, select, [contenteditable]');
    if (e.key === 'Escape') {
      if (!menu.hidden) { closeMenu(); return; }
      const open = document.querySelector('.sheet-backdrop.open');
      if (open) { open.classList.remove('open'); return; }
      if (busy()) stopRun();
      return;
    }
    if (typing || sheetOpen() || !menu.hidden) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) togglePlay();
      return;
    }
    if (window.StudioLink) StudioLink.forward(e);
  });
  // a focused button would click on Space as well
  document.addEventListener('keyup', (e) => { if (e.code === 'Space' && e.target && e.target.tagName === 'BUTTON') e.preventDefault(); });

  // -------- START --------
  function start() {
    if (FROM_FILE) el('file-note').hidden = false;
    loadPrefs();
    loadProjects();
    R.inst = prefs.inst;
    R.armed = firstRecordable();
    const first = P.tracks.findIndex(t => !hasContent(t) && recordable(t));
    if (first >= 0) R.armed = first;
    buildTracks();
    applySplit();
    R.pos = songStart();
    renderAll();
    if (window.StudioLink) StudioLink.show(R.inst);
    StudioVoice.keys().then(forgetUnused);   // takes from projects deleted or replaced on another visit
    new ResizeObserver(() => { sizeLanes(); drawAll(); }).observe(el('tracks-pane'));
    window.addEventListener('resize', applySplit);
    window.addEventListener('pagehide', saveNow);
    document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });
  }

  // -------- FOR link.js AND bring-in.js --------
  window.Studio = {
    KINDS, INSTRUMENTS, MAX_TRACKS, METERS, TEMPO_MIN, TEMPO_MAX,
    noteOn, noteOff, noteHit, togglePlay, stop: stopRun, busy,
    calibrating: () => !!cal, calTap,
    sheetOpen, toast, openSheet, closeSheet,
    get project() { return P; },
    get state() { return R; },
    barBeats, hasContent, recordable, blankTrack, normalizeTrack,
    get key() { return { pc: P.key, scale: P.scale }; },
    icon: k => ICON[k] || '',
    // Put brought-in tracks on the first empty tracks (adding tracks as needed).
    // Returns how many went in, or 0 when there was no room.
    bringIn(tracks, opts) {
      if (busy()) stopRun();
      const empties = P.tracks.map((t, i) => (!hasContent(t) ? i : -1)).filter(i => i >= 0);
      const room = empties.length + (MAX_TRACKS - P.tracks.length);
      if (room < tracks.length) return 0;
      pushUndo(opts && opts.label ? opts.label : 'bringing in a song');
      if (opts && opts.tempo) P.tempo = clamp(Math.round(opts.tempo), TEMPO_MIN, TEMPO_MAX);
      if (opts && opts.meter && METERS[opts.meter]) P.meter = opts.meter;
      if (opts && opts.key && keyPc(opts.key.name) >= 0) {   // a song brings its key: the instruments play in it
        P.key = keyPc(opts.key.name);
        if (Theory.SCALE_BY_ID[opts.key.scale]) P.scale = opts.key.scale === 'minor' ? 'natural-minor' : opts.key.scale;
      }
      const placed = [];
      tracks.forEach(t => {
        const nt = normalizeTrack(t);
        nt.id = newId('t');
        const i = empties.length ? empties.shift() : (P.tracks.push(blankTrack()), P.tracks.length - 1);
        nt.volume = P.tracks[i].volume;
        P.tracks[i] = nt;
        placed.push(i);
      });
      if (!recordable(P.tracks[R.armed] || {})) R.armed = firstRecordable();
      afterProjectChange();
      return placed;
    }
  };
  document.addEventListener('DOMContentLoaded', start);
})();

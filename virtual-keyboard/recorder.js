/* ==========================================================================
   Virtual Keyboard — recorder.js
   A four-track recorder, after the tape machines: record a line, then play
   it back while recording the next line on another track.

   It keeps what was played — which note, on which beat, for how long — not
   the sound itself, and plays it back through the same engine (audio.js),
   so a track sounds exactly as it did and can change its sound afterwards.
   Notes are kept in beats, so a new tempo speeds the whole song up or slows
   it down. Song files are rendered offline by Audio.render(); the MP3 is
   written by vendor/lame.min.js.

   Each take is a PART: a box on its track, after the Recording Studio's
   blocks. Drag a part's middle to move it, or an end to size it. A track
   plays straight through by default; with its loop button on, every part
   on it is a loop — one pass, going round for as long as the box is pulled.

   Timing: a key's moment is read from its event's own timestamp, put on the
   audio clock, then moved earlier by the recording delay — how late sound
   reaches this player, and their hands come back — which "Line up the
   timing" measures by tapping along with a click. Kept per device.

   window.Recorder = { noteOn, noteOff, syncSound } — script.js calls these.
   ========================================================================== */
(() => {
  // In the Recording Studio, the studio's tracks take the place of these four.
  if (typeof STUDIO !== 'undefined' && STUDIO) return;
  const TRACKS = 4;
  const TRACK_COLORS = ['#F0525A', '#F4A21C', '#2DB86A', '#3B95E6']; // the count-in card's colours
  const STORE_KEY = 'virtual_keyboard_recording_v1';
  const DELAY_KEY = 'virtual_keyboard_rec_delay_v1';
  const OPEN_KEY = 'virtual_keyboard_recorder_open_v1';
  const HEAD_KEY = 'virtual_keyboard_rec_head_v1';
  // The track controls, dragged narrower: everything / number, sound, mute and
  // loop / number, mute and loop. Their widths in px (the column, styles.css).
  const HEADS = ['full', 'name', 'small'];
  const HEAD_W = { full: 356, name: 250, small: 132 };
  const METERS = { '2/4': 2, '3/4': 3, '4/4': 4, '6/8': 2 }; // beats in a bar; 6/8 is counted in two
  const CLICKS = ['record', 'always', 'off'];
  const TEMPO_MIN = 40, TEMPO_MAX = 220;
  const LOOKAHEAD = 0.15;   // seconds of notes handed to the engine ahead of time
  const HIDDEN_LOOKAHEAD = 1.5;
  const PUMP_MS = 25;
  const MIN_HOLD = 0.05;    // beats: the shortest note kept
  const EARLY = 0.125;      // beats: how early a note can come and still belong to the beat after it
  const UNDO_MAX = 30;
  const PART_MIN = 1;       // beats: the shortest a part can be sized to
  const PART_MAX = 4000;    // beats: how far a loop can be pulled
  const GRIDS = [4, 8, 16]; // Quantize: quarter, 8th, 16th notes
  const FEELS = ['none', 'swing8', 'swing16', 'triplets'];
  const LEAD = 0.1;         // seconds before the first note in a song file
  const TAIL = 2.5;         // seconds after the last note in a song file (release and room)

  const el = id => document.getElementById(id);
  const dock = el('recorder');
  const toggleBtn = el('recorder-btn');
  const tracksEl = el('rec-tracks');
  const playBtn = el('rec-play');
  const recordBtn = el('rec-record');
  const homeBtn = el('rec-home');
  const tempoInput = el('rec-tempo');
  const meterSelect = el('rec-meter');
  const countInBtn = el('rec-countin');
  const clickSelect = el('rec-click');
  const clickWord = el('rec-click-word');          // what the click menu shows, beside its metronome
  const clickFace = clickSelect.closest('.rec-click-face');
  const CLICK_WORDS = { record: 'Recording', always: 'Always', off: 'Off' };
  const scrollEl = el('rec-scroll');
  const undoBtn = el('rec-undo');
  const timingBtn = el('rec-timing');

  let P = null;              // the project: what is saved
  const R = { open: false, armed: 0, state: 'idle', pos: 0 }; // state: idle | priming | playing | recording
  let run = null;            // the play or take under way
  let runToken = 0;
  let view = { start: 0, end: 32 }; // beats shown across the lanes
  let fit = { start: 0, end: 32 };  // the whole song, and a bar to spare: what the lanes show zoomed out
  let win = 0;               // zoomed in: the beats across the lanes; 0 = the whole song
  let viewAt = 0;            // zoomed in: the beat at the lanes' left edge
  let zoomUI = null;         // the zoom buttons and the scroll bar under the lanes
  let pinch = null;          // two fingers on the lanes, zooming
  const lanes = [];          // { wrap, canvas, head } — [0] is the ruler, then one per track
  const ctls = [];
  let undo = [];
  let saveTimer = null;
  let saveWarned = false;
  let edit = null;           // { i, c } while a part is being dragged
  let sel = null;            // { i, c }: the highlighted part, which the Quantize button speaks for
  let head = 'full';         // how much of the track controls shows (HEADS)
  let grip = null;           // the handle that drags them narrower

  // -------- PROJECT --------
  // A track keeps its PARTS (clips); tr.notes is what their boxes let
  // through, in the song's beats — what plays, draws and goes into a song
  // file — worked out again by partsView() whenever a part changes.
  function blankTracks() {
    return Array.from({ length: TRACKS }, () => ({ sound: currentSound, volume: 1, muted: false, loop: false, clips: [], notes: [] }));
  }
  // quant: the Quantize button's choices (set: confirmed once; on: new takes are quantized)
  function blankQuant() { return { set: false, on: false, grid: 8, feel: 'none', all: false }; }
  function blankProject() {
    return { name: '', tempo: 90, meter: '4/4', countIn: true, click: 'record', quant: blankQuant(), tracks: blankTracks() };
  }
  const byBeat = (a, b) => a.b - b.b;
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const mod = (x, m) => ((x % m) + m) % m;

  // -------- PARTS --------
  // A part holds what was played (items, in beats from its own beginning)
  // and a box onto it: where the box sits (b), how far in it opens (o), how
  // long it is (d), how long what was played is (len). Sizing only moves the
  // box's ends: nothing played is lost, and an end dragged back out opens it
  // up again.
  // A LOOP part (a looping track's): items are one pass, `loop` beats long,
  // and the box shows the pass going round for as long as the box is — pull
  // its end out and it keeps going. `o` is the phase: where in the pass the
  // box begins. `was` is the part as it was before it became a loop, so the
  // loop button turned straight back off gives it back unchanged.
  function makePart(items, lo, hi) {
    return { b: lo, o: 0, d: hi - lo, len: hi - lo, items: items.map(n => ({ m: n.m, b: n.b - lo, d: n.d })) };
  }
  // A part round some notes: from the beat they start on (a note a moment
  // early still counts as on it) to the beat after they end.
  function partAround(notes) {
    const lo = Math.floor(Math.min(...notes.map(n => n.b)) + EARLY);
    const hi = Math.ceil(Math.max(...notes.map(n => n.b + n.d)) - 1e-6);
    return makePart(notes, lo, Math.max(hi, lo + 1));
  }
  // Untouched since it became a loop (moved is fine): the loop button can give it back as it was.
  const pristine = c => !!(c.loop && c.was && Math.abs(c.o) < 1e-6 && Math.abs(c.d - c.loop) < 1e-6);

  // A part becomes a loop: what its box shows now is one pass. (A quantized
  // part's `raw`, the notes as played, goes the same way: see QUANTIZE.)
  function toLoop(c) {
    if (c.loop) return c;
    const L = Math.max(1, Math.round(c.d));   // in whole beats, so the passes stay on the beat
    const end = c.o + L;
    const pass = list => list
      .filter(n => n.b >= c.o - EARLY && n.b < end - 1e-6)
      .map(n => ({ m: n.m, b: n.b - c.o, d: Math.max(MIN_HOLD, Math.min(n.d, end - n.b)) })); // held into the next pass: stops there
    const p = { b: c.b, o: 0, d: L, len: L, loop: L, items: pass(c.items), was: { b: 0, o: c.o, d: c.d, len: c.len, items: c.items.map(n => ({ ...n })) } };
    if (c.q) {
      p.q = p.was.q = c.q;
      p.raw = pass(c.raw || c.items);
      p.was.raw = (c.raw || c.items).map(n => ({ ...n }));
    }
    return p;
  }
  // The notes a part's box lets through, in the song's beats (or of another
  // list in the part's own beats: its notes as played).
  function partNotes(c, items = c.items) {
    const out = [], end = c.o + c.d;
    const keep = (n, t) => {   // t: where the note falls in the part's own beats
      if (t < c.o - EARLY || t >= end - 1e-6) return;
      out.push({ m: n.m, b: c.b + t - c.o, d: t + n.d > end ? Math.max(MIN_HOLD, end - t) : n.d }); // held past the end: stops there
    };
    if (c.loop) {
      const L = c.loop;
      for (let k = Math.floor((c.o - EARLY) / L); k * L < end; k++) items.forEach(n => keep(n, k * L + n.b));
    } else {
      items.forEach(n => keep(n, n.b));
    }
    return out;
  }
  function partsView(tr) {
    tr.notes = [].concat(...tr.clips.map(c => partNotes(c))).sort(byBeat);
  }
  // The loop button turned off: a loop not touched since gives back the part it
  // was (if that still fits between its neighbours); one pulled out or sized
  // keeps its passes, written out just as they are heard.
  function unloopAll(clips) {
    return clips.map((c, k) => {
      if (!c.loop) return c;
      if (pristine(c)) {
        const w = c.was, b = c.b + w.b;
        const clash = clips.some((x, j) => j !== k && x.b < b + w.d - 1e-9 && x.b + x.d > b + 1e-9);
        if (!clash) {
          const p = { b, o: w.o, d: w.d, len: w.len, items: w.items.map(n => ({ ...n })) };
          if (w.q) { p.q = w.q; p.raw = (w.raw || w.items).map(n => ({ ...n })); }
          return p;
        }
      }
      const written = list => partNotes(c, list).map(n => ({ m: n.m, b: n.b - c.b, d: n.d }));
      const p = { b: c.b, o: 0, d: c.d, len: c.d, items: written(c.items) };
      if (c.q) { p.q = c.q; p.raw = written(c.raw || c.items); }
      return p;
    }).sort(byBeat);
  }
  // What a part covers on its track goes, by the tape rules — and only from
  // the box: the parts underneath keep everything they hold.
  function cutParts(tr, lo, hi) {
    const out = [];
    const piece = (c, x) => {
      const p = { ...c, ...x, items: c.items.map(n => ({ ...n })) };
      if (c.raw) p.raw = c.raw.map(n => ({ ...n }));
      delete p.was;
      return p;
    };
    tr.clips.forEach(c => {
      const e = c.b + c.d;
      if (e <= lo + 1e-9 || c.b >= hi - 1e-9) { out.push(c); return; }
      if (c.b < lo - 1e-9) out.push(piece(c, { d: lo - c.b }));
      if (e > hi + 1e-9) { const cut = hi - c.b; out.push(piece(c, { b: hi, o: c.o + cut, d: c.d - cut })); }
    });
    tr.clips = out;
  }

  // -------- QUANTIZE --------
  // Notes moved onto the nearest point of a rhythm: Quarter, 8th or 16th
  // notes, straight, swung (the off-beat 8th or 16th late, two-thirds of the
  // way, as in a triplet) or with triplets allowed too. Only where notes
  // start moves; each keeps its length. A quantized part keeps `raw`, its
  // notes as played, and `q`, the rhythm it was put on: quantizing it again
  // always starts from the playing, and nothing is lost on the way.
  // In 6/8 the beat is a dotted quarter: Quarter keeps to the beat, an 8th is
  // a third of it, and swing and triplets do not apply (it goes in threes).
  function feelFits(grid, feel, meter = P.meter) {
    if (meter === '6/8') return feel === 'none';
    if (feel === 'swing8') return grid >= 8;
    if (feel === 'swing16') return grid >= 16;
    return true;
  }
  // The points a note may land on, as beats into a cell `cell` beats long.
  function gridPoints(q) {
    const feel = feelFits(q.grid, q.feel) ? q.feel : 'none';
    if (P.meter === '6/8') return { cell: 1, at: q.grid === 4 ? [0] : q.grid === 8 ? [0, 1 / 3, 2 / 3] : [0, 1 / 6, 1 / 3, 1 / 2, 2 / 3, 5 / 6] };
    if (q.grid === 4) return feel === 'triplets' ? { cell: 2, at: [0, 2 / 3, 1, 4 / 3] } : { cell: 1, at: [0] }; // quarter-note triplets: three in two beats
    if (q.grid === 8) return { cell: 1, at: { none: [0, 1 / 2], swing8: [0, 2 / 3], triplets: [0, 1 / 3, 1 / 2, 2 / 3] }[feel] };
    return { cell: 1, at: { none: [0, 1 / 4, 1 / 2, 3 / 4], swing8: [0, 1 / 3, 2 / 3, 5 / 6], swing16: [0, 1 / 3, 1 / 2, 5 / 6],
      triplets: [0, 1 / 6, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 5 / 6] }[feel] };
  }
  function snapper(q) {
    const { cell, at } = gridPoints(q);
    return t => {
      const c0 = Math.floor(t / cell) * cell;
      let best = c0 + cell, gap = Math.abs(t - best);
      at.forEach(a => { const d = Math.abs(t - c0 - a); if (d < gap) { gap = d; best = c0 + a; } });
      return best;
    };
  }
  // A part's notes put on the rhythm. `origin` is the song's beat where the
  // part's own beat 0 falls, so the rhythm lines up with the bars. A loop's
  // pass goes round (a note pulled onto the pass's end is its next
  // beginning); in a straight part a note never slips into or out of the box
  // (what is heard stays what is heard): that one stays as it was played.
  function quantItems(items, origin, snap, box) {
    const L = box.loop || 0, lo = box.o - EARLY, hi = box.o + box.d - 1e-6;
    const inBox = t => t >= lo && t < hi;
    const out = [];
    items.forEach(n => {
      let b = snap(origin + n.b) - origin;
      if (L) { b = mod(b, L); if (b > L - 1e-6) b = 0; }
      else if (inBox(b) !== inBox(n.b)) b = n.b;
      b = Math.round(b * 1e6) / 1e6;
      const twin = out.find(x => x.m === n.m && Math.abs(x.b - b) < 1e-6); // two of one note on one point: the longer
      if (twin) twin.d = Math.max(twin.d, n.d); else out.push({ m: n.m, b, d: n.d });
    });
    return out.sort(byBeat);
  }
  // In place, so a highlighted part stays highlighted.
  function quantizePart(c, q) {
    const snap = snapper(q);
    const raw = c.raw || c.items;
    c.raw = raw.map(n => ({ ...n }));
    c.items = quantItems(raw, c.b - c.o, snap, c);
    c.q = { grid: q.grid, feel: q.feel };
    if (c.was) { // the part a loop was, for the loop button turned off: on the rhythm too
      const w = c.was, wraw = w.raw || w.items;
      w.raw = wraw.map(n => ({ ...n }));
      w.items = quantItems(wraw, c.b + w.b - w.o, snap, w);
      w.q = c.q;
    }
  }
  const sameQ = (a, b) => !!a && !!b && a.grid === b.grid && a.feel === b.feel;
  function quantWords(q) {
    const unit = q.grid === 4 ? (P.meter === '6/8' ? 'the beat' : 'quarter notes') : q.grid === 8 ? '8th notes' : '16th notes';
    const feel = feelFits(q.grid, q.feel) ? q.feel : 'none';
    return unit + { none: '', swing8: ', swung 8ths', swing16: ', swung 16ths', triplets: ' and triplets' }[feel];
  }

  // Anything missing or unknown falls back to the default, so every file opens.
  function cleanNotes(list) {
    return (Array.isArray(list) ? list : [])
      .filter(n => n && Number.isFinite(n.m) && Number.isFinite(n.b) && Number.isFinite(n.d) && n.m >= 12 && n.m <= 120 && n.d > 0)
      .map(n => ({ m: Math.round(n.m), b: n.b, d: n.d }))
      .sort(byBeat);
  }
  function cleanPart(c) {
    if (!c || typeof c !== 'object') return null;
    const ok = x => Number.isFinite(x);
    if (!ok(c.b) || !ok(c.o) || !ok(c.d) || !ok(c.len) || c.d <= 0 || c.len <= 0) return null;
    const p = { b: c.b, o: c.o, d: Math.min(c.d, PART_MAX), len: c.len, items: cleanNotes(c.items) };
    if (c.q && GRIDS.includes(c.q.grid) && FEELS.includes(c.q.feel)) {
      p.q = { grid: c.q.grid, feel: c.q.feel };
      const raw = cleanNotes(c.raw);
      if (raw.length) p.raw = raw;
    }
    if (ok(c.loop) && c.loop > 0) {
      p.loop = c.loop;
      const w = cleanPart(c.was);
      if (w && !w.loop) p.was = w;
    } else {
      p.o = clamp(p.o, 0, p.len - MIN_HOLD);
      p.d = Math.min(p.d, p.len - p.o);
    }
    return p;
  }
  function normalizeProject(src) {
    const p = blankProject();
    if (!src || typeof src !== 'object') return p;
    if (typeof src.name === 'string') p.name = src.name.slice(0, 60);
    const tempo = Math.round(Number(src.tempo));
    if (tempo >= TEMPO_MIN && tempo <= TEMPO_MAX) p.tempo = tempo;
    if (METERS[src.meter]) p.meter = src.meter;
    if (typeof src.countIn === 'boolean') p.countIn = src.countIn;
    if (CLICKS.includes(src.click)) p.click = src.click;
    const q = src.quant;
    if (q && typeof q === 'object') {
      p.quant.set = q.set === true;
      p.quant.on = q.on === true && p.quant.set;
      p.quant.all = q.all === true;
      if (GRIDS.includes(q.grid)) p.quant.grid = q.grid;
      if (FEELS.includes(q.feel)) p.quant.feel = q.feel;
    }
    if (Array.isArray(src.tracks)) src.tracks.slice(0, TRACKS).forEach((tr, i) => {
      if (!tr || typeof tr !== 'object') return;
      const d = p.tracks[i];
      if (Audio.PRESETS[tr.sound]) d.sound = tr.sound;
      const v = Number(tr.volume);
      if (tr.volume != null && v >= 0 && v <= 1) d.volume = v;
      d.muted = tr.muted === true;
      d.loop = tr.loop === true;
      // its parts as saved — or, from a recording made before there were
      // parts, one part round the notes it kept
      if (Array.isArray(tr.clips) && tr.clips.length) {
        d.clips = tr.clips.map(cleanPart).filter(Boolean).sort(byBeat);
      } else {
        const notes = cleanNotes(tr.notes);
        if (notes.length) d.clips = [partAround(notes)];
      }
      // a looping track's parts all loop; the others' none
      d.clips = d.loop ? d.clips.map(toLoop) : unloopAll(d.clips);
      partsView(d);
    });
    return p;
  }

  // Beats to four places: a sixteenth of a millisecond at any tempo here.
  // The notes the parts let through are kept too, for anything that reads
  // only notes (a recording from before there were parts did).
  function compact(p) {
    const r = x => Math.round(x * 10000) / 10000;
    const note = n => ({ m: n.m, b: r(n.b), d: r(n.d) });
    const part = c => {
      const out = { b: r(c.b), o: r(c.o), d: r(c.d), len: r(c.len), items: c.items.map(note) };
      if (c.q) { out.q = c.q; if (c.raw) out.raw = c.raw.map(note); }
      if (c.loop) { out.loop = r(c.loop); if (pristine(c)) out.was = part(c.was); }
      return out;
    };
    // a track open in the note editor is kept as it was until Save Changes
    const kept = (tr, i) => (ed && p === P && i === ed.i ? ed.saved : tr);
    return { ...p, quant: { ...p.quant }, tracks: p.tracks.map((tr, i) => ({ sound: tr.sound, volume: tr.volume, muted: tr.muted, loop: tr.loop, clips: kept(tr, i).clips.map(part), notes: kept(tr, i).notes.map(note) })) };
  }

  // In a lesson the recording is kept with the lesson (lesson.js hands over
  // where), so the student's own recording here is never touched.
  let saveHook = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 250);
  }
  function saveNow() {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (saveHook) { saveHook(compact(P)); return; }
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(compact(P)));
    } catch (e) {
      if (!saveWarned) { saveWarned = true; toast('This browser would not keep the recording. Save a project file to keep it.'); }
    }
  }
  function load() {
    let src = null;
    try { src = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {}
    P = normalizeProject(src);
  }

  const barBeats = () => METERS[P.meter];
  const hasNotes = () => P.tracks.some(tr => tr.notes.length);
  function firstBeat() {
    let lo = Infinity;
    P.tracks.forEach(tr => { if (tr.notes.length && tr.notes[0].b < lo) lo = tr.notes[0].b; });
    return lo;
  }
  // The beginning: bar 1, or the bar before it when there is a pick-up — but a
  // note only a hair before a bar line was meant for the bar after it.
  function songStart() {
    return Math.min(0, Math.floor((firstBeat() + EARLY) / barBeats()) * barBeats());
  }
  // The end: the last note — or the end of the last loop, whose last pass
  // plays to its end, rests and all.
  function songEnd() {
    let hi = 0;
    P.tracks.forEach(tr => {
      tr.notes.forEach(n => { if (n.b + n.d > hi) hi = n.b + n.d; });
      if (tr.loop) tr.clips.forEach(c => { if (c.b + c.d > hi) hi = c.b + c.d; });
    });
    return hi;
  }

  // -------- UNDO --------
  function pushUndo(label) {
    undo.push({ label, json: JSON.stringify(P) });
    if (undo.length > UNDO_MAX) undo.shift();
  }
  function doUndo() {
    if (busy()) return;
    const u = undo.pop();
    if (!u) return;
    const quant = P.quant; // undo brings back notes; the Quantize button keeps its choices
    P = normalizeProject(JSON.parse(u.json));
    P.quant = quant;
    afterProjectChange();
    toast('Undone: ' + u.label);
  }
  function afterProjectChange() {
    lockQuant();
    if (R.armed >= TRACKS || trackLocked(R.armed)) R.armed = armableTrack(false);
    R.pos = songStart();
    adoptSound();
    applyLevels();
    renderAll();
    save();
  }

  // -------- SOUND AND TIME --------
  const midiFreq = m => 440 * Math.pow(2, (m - 69) / 12);
  const midiOfName = name => midiOf(name.slice(0, -1), parseInt(name.slice(-1), 10));
  const busy = () => R.state !== 'idle';

  // -------- A LESSON'S LOCKED TRACKS (LESSON, script.js) --------
  // A locked track is the teacher's: it plays, mutes, takes another sound and
  // volume, and a loop on it grows or shrinks by whole passes (one at least);
  // it is never armed, recorded over, edited in the note editor, quantized,
  // un-looped, cleared or deleted.
  const trackLocked = i => !!(LESSON && LESSON.locks.tracks.includes(i));
  const allLocked = () => P.tracks.every((tr, i) => trackLocked(i));
  // The track to arm: the first empty one that is not locked (or, without
  // `preferEmpty`, any that is not locked).
  function armableTrack(preferEmpty = true) {
    const free = P.tracks.map((tr, i) => i).filter(i => !trackLocked(i));
    if (!free.length) return 0;
    if (preferEmpty) { const empty = free.find(i => !P.tracks[i].clips.length); if (empty !== undefined) return empty; }
    return free[0];
  }
  // The highlighted part, unless it is a locked track's (Quantize and Delete leave those alone).
  const selPart = () => (sel && !trackLocked(sel.i) ? sel : null);
  function lockedToast(i) {
    toast(`Track ${i + 1} is the lesson’s: mute it or pull its loop longer or shorter, and record on another track.`);
  }
  // A lesson's Quantize: locked on (its rhythm and feel) for every take, or
  // locked off; the button gives way to plain text saying which.
  const quantLock = () => (LESSON && LESSON.locks.quant) || null;
  function lockQuant() {
    const L = quantLock();
    if (!L || !P) return;
    if (L.on) Object.assign(P.quant, { set: true, on: true, grid: L.grid, feel: L.feel, all: false });
    else P.quant.on = false;
  }

  // The armed track and the keyboard share one sound: arming a track brings
  // its sound (what its menu says, notes or none) to the keyboard. (An empty
  // track used to take the keyboard's instead, which put the last track's
  // sound over the one just picked for it.)
  function adoptSound() {
    const tr = P.tracks[R.armed];
    if (tr.sound === currentSound) return;
    currentSound = tr.sound;
    renderChrome();
  }
  // renderChrome calls this: a sound picked on the keyboard is the armed track's.
  function syncSound() {
    if (holdSound || !R.open || !P) return;
    const tr = P.tracks[R.armed];
    if (tr.sound === currentSound) return;
    tr.sound = currentSound;
    renderCtl(R.armed);
    save();
  }

  function trackLevel(tr) { return tr.muted ? 0 : BASE_LEVEL * volume * tr.volume; }
  function applyLevels() {
    if (!audioWoken) return; // set when the sound starts (startRun)
    P.tracks.forEach((tr, i) => Audio.setLevel('rec' + (i + 1), trackLevel(tr)));
  }

  // When an input event happened, by its own timestamp: the capture listeners
  // note every key and touch before script.js plays it.
  let lastStamp = 0;
  ['keydown', 'keyup', 'pointerdown', 'pointerup', 'pointercancel', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove']
    .forEach(type => window.addEventListener(type, e => { lastStamp = e.timeStamp; }, { capture: true, passive: true }));
  function inputStamp() {
    const now = performance.now();
    return lastStamp > 0 && lastStamp <= now && now - lastStamp < 250 ? lastStamp : now;
  }
  // That moment on the audio clock (the clock notes are scheduled on).
  function clockOf(stamp) {
    const ctx = Audio.ensure();
    return ctx.currentTime - Math.max(0, performance.now() - stamp) / 1000;
  }

  // The recording delay, in ms: measured by the tap-along test, or set by hand;
  // until then the browser's own figure for its output.
  function storedDelay() {
    try {
      const d = JSON.parse(localStorage.getItem(DELAY_KEY));
      if (d && Number.isFinite(d.ms)) return d;
    } catch (e) {}
    return null;
  }
  function guessMs() {
    if (!audioWoken) return 0;
    const ctx = Audio.ensure();
    return Math.round((ctx.outputLatency || ctx.baseLatency || 0) * 1000);
  }
  function delayMs() {
    const d = storedDelay();
    return d ? d.ms : guessMs();
  }
  function setDelay(ms, how) {
    try {
      if (how) localStorage.setItem(DELAY_KEY, JSON.stringify({ ms, how }));
      else localStorage.removeItem(DELAY_KEY);
    } catch (e) {}
    renderTiming();
  }

  // The metronome: a short click straight to the speakers, never in a song file.
  function clickAt(ctx, t, accent) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = accent ? 1760 : 1175;
    const peak = Math.max(0.0002, 0.5 * volume * (accent ? 1 : 0.65));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.09);
    o.onended = () => { try { o.disconnect(); g.disconnect(); } catch (e) {} };
    return o;
  }
  const isDownbeat = b => ((b % barBeats()) + barBeats()) % barBeats() === 0;

  // -------- PLAYBACK LIGHTS --------
  // A note played back lights its key, or the same note an octave or more
  // away when its own key is not on screen.
  const lit = new Map();        // key name -> how many notes hold it lit
  const lightTimers = new Set();
  function shownKey(m) {
    if (keysView) return null;
    const shown = new Set(whiteKeysPhysical.concat(blackKeysPhysical));
    for (let k = 0; k <= 8; k++) {
      if (shown.has(midiName(m - 12 * k))) return midiName(m - 12 * k);
      if (shown.has(midiName(m + 12 * k))) return midiName(m + 12 * k);
    }
    return null;
  }
  function light(name, on) {
    const n = (lit.get(name) || 0) + (on ? 1 : -1);
    if (n > 0) { lit.set(name, n); if (on && n === 1) pressVisual(name, true); return; }
    lit.delete(name);
    if (!active.has(name)) pressVisual(name, false);
  }
  function lightLater(ctx, m, t, hold) {
    const name = shownKey(m);
    if (!name) return;
    const on = EVMCountIn.heardAt(ctx, t) - performance.now();
    const later = (ms, fn) => { const id = setTimeout(() => { lightTimers.delete(id); fn(); }, Math.max(0, ms)); lightTimers.add(id); };
    later(on, () => light(name, true));
    later(on + hold * 1000, () => light(name, false));
  }
  function clearLights() {
    lightTimers.forEach(clearTimeout);
    lightTimers.clear();
    lit.forEach((n, name) => { if (!active.has(name)) pressVisual(name, false); });
    lit.clear();
  }

  // -------- PLAY AND RECORD --------
  async function startRun(recording) {
    const token = ++runToken;
    wakeAudio();
    const ctx = Audio.ensure();
    applyLevels();
    let from = R.pos;
    if (!recording) {
      if (!hasNotes()) { toast('Nothing recorded yet. Press ● to record a line.'); return; }
      if (from >= songEnd()) from = songStart(); // at the end: play from the top
    } else {
      if (trackLocked(R.armed)) {
        if (allLocked()) { toast('Every track in this lesson is locked: there is none to record on.'); return; }
        R.armed = armableTrack();
        adoptSound();
        renderCtls();
      }
      const tr = P.tracks[R.armed];
      tr.sound = currentSound;
      if (tr.muted) { tr.muted = false; applyLevels(); }
      showTrack(R.armed);
      sel = null; // the take is what comes next: Quantize speaks for new recordings again
    }
    const count = recording && P.countIn ? EVMCountIn.beats(barBeats()) : 0;
    R.state = 'priming';
    R.priming = recording ? 'recording' : 'playing';
    renderTransport();
    if (count) EVMCountIn.open(count, barBeats());
    const ok = await EVMCountIn.prime(ctx, { warm: count ? 0.35 : 0.12 });
    if (token !== runToken) return;
    if (!ok) {
      EVMCountIn.close();
      R.state = 'idle';
      renderTransport();
      toast('The sound did not start. Tap a key, then try again.');
      return;
    }
    const spb = 60 / P.tempo;
    const anchor = ctx.currentTime + 0.1 + count * spb; // when beat `from` sounds
    run = {
      ctx, from, spb, anchor, count, recording,
      delay: delayMs() / 1000, // read once: the browser's own figure wanders a little
      armed: R.armed,
      end: songEnd(),
      // (a note played a hair early for where this starts is still played)
      next: P.tracks.map(tr => { const k = tr.notes.findIndex(n => n.b >= from - count - EARLY); return k < 0 ? tr.notes.length : k; }),
      nextClick: Math.ceil(from - count - 1e-9),
      ids: [], clicks: [], take: [], held: new Map(),
      timer: 0, raf: 0, drawn: 0
    };
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
  }

  // Hand the engine every note and click due in the next moment. A hidden page's
  // timers run only once a second, so it looks further ahead then. The end of a
  // playback is caught here too: drawing (frame) stops while the page is hidden.
  function pump() {
    if (!run) return;
    const ctx = run.ctx;
    if (!run.recording && heardBeat(run) > run.end + 0.05) { finishPlayback(); return; }
    const ahead = document.hidden ? HIDDEN_LOOKAHEAD : LOOKAHEAD;
    const until = run.from + (ctx.currentTime + ahead - run.anchor) / run.spb;
    P.tracks.forEach((tr, i) => {
      let k = run.next[i];
      while (k < tr.notes.length && tr.notes[k].b < until) {
        const n = tr.notes[k++];
        // a muted track, and the one being recorded over, keep their place but stay quiet
        if (tr.muted || (run.recording && i === run.armed)) continue;
        const t = run.anchor + (n.b - run.from) * run.spb;
        const hold = n.d * run.spb;
        if (t + hold < ctx.currentTime) continue; // long gone (a tab that slept)
        run.ids.push(Audio.schedule('rec' + (i + 1), [midiFreq(n.m)], tr.sound, t, hold, 1));
        lightLater(ctx, n.m, t, hold);
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
    follow(beat);
    setHeads(beat);
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
    reveal(R.pos);
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
      r.ids.forEach(id => Audio.stop(id));
      r.clicks.forEach(o => { try { o.stop(); } catch (e) {} });
      clearLights();
      R.pos = r.from <= 0 ? songStart() : r.from;
    }
    R.state = 'idle';
    renderAll();
    reveal(R.pos);
  }

  // Where a key went down or up, in beats, moved earlier by the recording delay.
  function beatNow(r) {
    const t = clockOf(inputStamp()) - r.delay;
    return r.from + (t - r.anchor) / r.spb;
  }

  function noteOn(name) {
    if (!run || !run.recording) return;
    const b = beatNow(run);
    if (b < run.from - run.count - 0.25) return; // before the count began
    if (run.held.has(name)) noteOff(name);
    run.held.set(name, { m: midiOfName(name), b });
  }
  function noteOff(name) {
    if (!run || !run.recording) return;
    const h = run.held.get(name);
    if (!h) return;
    run.held.delete(name);
    run.take.push({ m: h.m, b: h.b, d: Math.max(MIN_HOLD, beatNow(run) - h.b) });
  }

  // Tape rules: the take is a new part, replacing what the track had from
  // where it began to where it stopped (whole beats). A take with no notes
  // changes nothing.
  function keepTake(r) {
    const stop = beatNow(r);
    r.held.forEach(h => r.take.push({ m: h.m, b: h.b, d: Math.max(MIN_HOLD, stop - h.b) }));
    r.held.clear();
    if (!r.take.length) return;
    const tr = P.tracks[r.armed];
    pushUndo('the take on track ' + (r.armed + 1));
    const lo = Math.floor(Math.min(r.from, ...r.take.map(n => n.b)) + EARLY);
    const hi = Math.ceil(Math.max(stop, ...r.take.map(n => n.b + n.d)) - 1e-6);
    let part = makePart(r.take, lo, Math.max(hi, lo + 1));
    if (tr.loop) part = loopTake(r, stop, part);
    cutParts(tr, part.b, part.b + part.d);
    tr.clips.push(part);
    tr.clips.sort(byBeat);
    partsView(tr);
    // Quantize on: the take goes onto the rhythm — a step of its own, so
    // Undo first gives back the take as played, then takes it away
    if (P.quant.on) {
      pushUndo('quantizing the take on track ' + (r.armed + 1));
      quantizePart(part, P.quant);
      partsView(tr);
    }
    save();
    const others = P.tracks.filter((t, i) => i !== r.armed && t.clips.length).length;
    if (!storedDelay() && !sessionStorageGet('tip')) {
      sessionStorageSet('tip');
      setTimeout(() => toast('Tip: “Calibrate” lines up your timing for these speakers or headphones.'), 600);
    } else if (!others) {
      const next = P.tracks.findIndex(t => !t.clips.length);
      if (next >= 0) setTimeout(() => toast(`Recorded. Choose track ${next + 1} to play a line over it.`), 600);
    }
  }
  // A take on a looping track is one pass: from the bar where it began to
  // the bar line nearest where it stopped. Notes after that were the next
  // pass begun, and notes in the count-in came before the loop; the pass
  // leaves them out (`was`, the whole take, keeps them for the loop button
  // turned off).
  function loopTake(r, stop, plain) {
    const bpb = barBeats();
    const lo = r.from;
    const L = Math.max(bpb, Math.round((stop - lo) / bpb) * bpb);
    const items = r.take
      .map(n => ({ m: n.m, b: n.b - lo, d: n.d }))
      .filter(n => n.b >= -EARLY && n.b < L - EARLY)
      .map(n => ({ ...n, d: Math.max(MIN_HOLD, Math.min(n.d, L - n.b)) }));
    if (!items.length) return toLoop(plain);
    return { b: lo, o: 0, d: L, len: L, loop: L, items, was: { b: plain.b - lo, o: plain.o, d: plain.d, len: plain.len, items: plain.items } };
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem('vk_rec_' + k); } catch (e) { return null; } }
  function sessionStorageSet(k) { try { sessionStorage.setItem('vk_rec_' + k, '1'); } catch (e) {} }

  function togglePlay() { if (busy()) stopRun(); else startRun(false); }
  function toggleRecord() { if (busy()) stopRun(); else startRun(true); }

  // -------- TRACKS ON SCREEN --------
  // The whole song and every part, at least eight bars, and a bar to spare:
  // what the lanes show zoomed out.
  function fitView() {
    const bpb = barBeats();
    let start = songStart(), last = songEnd();
    P.tracks.forEach(tr => tr.clips.forEach(c => { start = Math.min(start, c.b); last = Math.max(last, c.b + c.d); }));
    start = Math.floor(start / bpb) * bpb;
    fit = { start, end: Math.max(Math.ceil(last / bpb) * bpb + bpb, start + 8 * bpb, R.pos + bpb) };
    applyView();
  }
  const pxPerBeat = w => w / (view.end - view.start);

  // -------- ZOOM (after Vocal Booth's) --------
  // Zoomed out (win = 0) the lanes show the whole song, and keep doing so as
  // it grows. Zoomed in they show `win` beats from `viewAt` — never less than
  // a bar, never past the song — and a scroll bar under the lanes slides them
  // along. Ways in: − ⤢ + by the ruler, the − and + keys, a trackpad pinch or
  // Ctrl/⌘ + scroll (round the pointer), two fingers on a touch screen. Ways
  // along: the scroll bar, two fingers sideways on a trackpad (or Shift +
  // scroll), dragging an empty part of a lane. Playing, the view keeps the
  // playhead in sight.
  const ZOOM_STEP = 1.5;
  function applyView() {
    const range = fit.end - fit.start;
    let w = range;
    if (win) {
      w = clamp(win, barBeats(), range);
      win = w >= range - 1e-9 ? 0 : w;
    }
    viewAt = win ? clamp(viewAt, fit.start, fit.end - w) : fit.start;
    view = { start: viewAt, end: viewAt + w };
    renderZoom();
  }
  // Zoom by a factor (> 1 zooms in), keeping the beat `around` where it is on screen.
  function zoomBy(factor, around) {
    const range = fit.end - fit.start, w0 = view.end - view.start;
    const w = clamp(w0 / factor, barBeats(), range);
    if (around == null) around = view.start + w0 / 2;
    viewAt = around - (around - view.start) / w0 * w;
    win = w >= range - 1e-9 ? 0 : w;
    applyView();
    queueDraw();
  }
  // The buttons and keys zoom round the playhead when it is in sight, else round the middle.
  function zoomStep(factor) {
    const at = run ? heardBeat(run) : R.pos;
    zoomBy(factor, at >= view.start && at <= view.end ? at : null);
  }
  function zoomFit() {
    win = 0;
    applyView();
    queueDraw();
  }
  function panTo(at) {
    if (!win) return;
    viewAt = at;
    applyView();
    queueDraw();
  }
  // Zoomed in, bring a beat into sight (a tenth of the way in) when it is out of it.
  function reveal(beat) {
    if (!win || (beat >= view.start && beat <= view.end - 0.02 * (view.end - view.start))) return;
    panTo(beat - 0.1 * (view.end - view.start));
  }
  // While the music runs: zoomed out the song's range grows as the playhead
  // nears the end; zoomed in the view turns a page when it passes nine tenths.
  function follow(beat) {
    const bpb = barBeats(), w = view.end - view.start;
    if (!win) {
      if (beat > view.end - bpb / 2) { fit.end += 4 * bpb; applyView(); drawAll(); }
    } else if (beat > view.start + 0.9 * w || beat < view.start) {
      fit.end = Math.max(fit.end, beat + w);
      viewAt = beat - 0.1 * w;
      applyView();
      drawAll();
    }
  }
  // The song's beat under a point on screen (the lanes line up with the ruler).
  function beatAtX(clientX) {
    const l = lanes[0], rect = l.wrap.getBoundingClientRect();
    return view.start + (clientX - rect.left) / pxPerBeat(rect.width || 1);
  }
  let drawQueued = false;
  function queueDraw() {
    if (drawQueued) return;
    drawQueued = true;
    requestAnimationFrame(() => { drawQueued = false; drawAll(); });
  }
  // How far a dragged part moves: the finest of beat, 8th and 16th that the
  // zoom spreads 14 px or more apart (a bar when even beats are cramped).
  function snapGrid(ppb) {
    if (ppb < 7) return barBeats();
    const divs = P.meter === '6/8' ? [1, 1 / 3, 1 / 6] : [1, 1 / 2, 1 / 4];
    let s = 1;
    divs.forEach(d => { if (d * ppb >= 14) s = d; });
    return s;
  }

  // The zoom buttons, and the scroll bar, for the view now.
  function renderZoom() {
    if (!zoomUI) return;
    const range = fit.end - fit.start, w = view.end - view.start;
    zoomUI.out.disabled = zoomUI.all.disabled = !win;
    zoomUI.in.disabled = w <= barBeats() + 1e-9;
    zoomUI.row.hidden = !win;
    if (!win) return;
    const bw = zoomUI.bar.clientWidth;
    const tw = Math.max(28, w / range * bw);
    const share = (view.start - fit.start) / Math.max(1e-9, range - w);
    zoomUI.thumb.style.width = tw + 'px';
    zoomUI.thumb.style.transform = `translateX(${share * Math.max(0, bw - tw)}px)`;
    zoomUI.bar.setAttribute('aria-valuenow', String(Math.round(share * 100)));
  }
  function makeZoomUI() {
    const corner = document.createElement('div');
    corner.className = 'rec-corner';
    corner.setAttribute('role', 'group');
    corner.setAttribute('aria-label', 'Zoom');
    const btn = (cls, icon, label, title) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rec-icon-btn rec-zoom-btn ' + cls;
      b.innerHTML = icon;
      b.setAttribute('aria-label', label);
      b.title = title;
      corner.appendChild(b);
      return b;
    };
    const out = btn('rec-zoom-out', ICONS.zoomOut, 'Zoom out', 'Zoom out (−)');
    const all = btn('rec-zoom-all', ICONS.zoomAll, 'Show the whole song', 'Show the whole song');
    const inn = btn('rec-zoom-in', ICONS.zoomIn, 'Zoom in', 'Zoom in (+) — pinch or Ctrl/⌘ + scroll over the lanes, too');
    out.addEventListener('click', () => zoomStep(1 / ZOOM_STEP));
    inn.addEventListener('click', () => zoomStep(ZOOM_STEP));
    all.addEventListener('click', zoomFit);

    // the scroll bar under the lanes: drag the thumb, or press beside it to go there
    const row = document.createElement('div');
    row.className = 'rec-row rec-scroll-row';
    row.hidden = true;
    const spacer = document.createElement('div');
    spacer.className = 'rec-ctl rec-ctl-spacer';
    const bar = document.createElement('div');
    bar.className = 'rec-hscroll';
    bar.setAttribute('role', 'scrollbar');
    bar.setAttribute('aria-orientation', 'horizontal');
    bar.setAttribute('aria-label', 'Which bars the lanes show');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    const thumb = document.createElement('div');
    thumb.className = 'rec-hscroll-thumb';
    thumb.title = 'Drag to move along the song';
    bar.appendChild(thumb);
    row.append(spacer, bar);
    bar.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || !win) return;
      e.preventDefault();
      const range = fit.end - fit.start, w = view.end - view.start;
      const bw = bar.clientWidth, tw = thumb.offsetWidth, room = Math.max(1, bw - tw);
      const rect = bar.getBoundingClientRect();
      if (e.target !== thumb) { // beside the thumb: the thumb jumps there, centred on the press
        panTo(fit.start + (e.clientX - rect.left - tw / 2) / room * (range - w));
      }
      const id = e.pointerId, x0 = e.clientX, at0 = viewAt;
      try { bar.setPointerCapture(id); } catch (err) {}
      thumb.classList.add('held');
      const move = (ev) => { if (ev.pointerId === id) panTo(at0 + (ev.clientX - x0) / room * (range - w)); };
      const up = (ev) => {
        if (ev.pointerId !== id) return;
        thumb.classList.remove('held');
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
        bar.removeEventListener('pointercancel', up);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    });
    zoomUI = { corner, out, all, in: inn, row, bar, thumb };
  }

  const ICONS = {
    mute: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
    muted: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>',
    loop: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 12v-1.5A4.5 4.5 0 0 1 8 6h12.5"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12v1.5A4.5 4.5 0 0 1 16 18H3.5"/></svg>',
    clear: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5"/></svg>',
    // Vocal Booth's
    zoomOut: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h6"/></svg>',
    zoomAll: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h6M10.5 7.5v6"/></svg>'
  };

  // A click on a lane moves the start to the nearest bar line.
  function placeStart(clientX, wrap) {
    const rect = wrap.getBoundingClientRect();
    const bpb = barBeats();
    const beat = view.start + (clientX - rect.left) / pxPerBeat(rect.width);
    R.pos = Math.min(Math.max(Math.round(beat / bpb) * bpb, songStart()), fit.end - bpb);
    renderPos();
  }

  // i: the track's number from 0; the ruler has none.
  function makeLane(cls, i) {
    const wrap = document.createElement('div');
    wrap.className = 'rec-lane ' + cls;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const head = document.createElement('div');
    head.className = 'rec-head';
    wrap.append(canvas, head);
    if (i != null) wrap.title = 'Double-click to open this track and edit its notes';
    wrap.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || pinch) return;
      if (i == null) { if (!busy()) scrubStart(e, wrap); return; }
      if (ed) { if (i === ed.i) editPress(e); return; } // the note editor is open
      if (doubleTap(e, i)) return; // the second press of a double-click opens the note editor
      if (!busy() && grabPart(e, i)) return; // a press on a part: dragging it, or (let go where it was) a click
      grabLane(e, wrap);
    });
    // over a part, the pointer says what a drag there does
    if (i != null) wrap.addEventListener('pointermove', (e) => {
      if (ed) { if (i === ed.i && !e.buttons) editCursor(e, wrap); return; }
      if (edit || e.buttons) return;
      const hit = busy() ? null : partAt(e, i);
      wrap.style.cursor = !hit ? (win ? 'grab' : '') : hit.how === 'fixed' ? '' : hit.how === 'move' ? 'grab' : 'ew-resize';
    });
    return { wrap, canvas, head };
  }

  // The ruler: press to put the start on the nearest bar, and drag along it to move it.
  function scrubStart(e, wrap) {
    const id = e.pointerId;
    placeStart(e.clientX, wrap);
    try { wrap.setPointerCapture(id); } catch (err) {}
    const move = (ev) => { if (ev.pointerId === id) placeStart(ev.clientX, wrap); };
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      wrap.removeEventListener('pointermove', move);
      wrap.removeEventListener('pointerup', up);
      wrap.removeEventListener('pointercancel', up);
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
  }

  // An empty part of a lane: a click puts the start on the nearest bar;
  // zoomed in, a drag slides the view along instead.
  function grabLane(e, wrap) {
    const id = e.pointerId, x0 = e.clientX, at0 = viewAt;
    let moved = false;
    const finish = () => {
      wrap.removeEventListener('pointermove', move);
      wrap.removeEventListener('pointerup', up);
      wrap.removeEventListener('pointercancel', up);
      dock.classList.remove('panning');
    };
    const move = (ev) => {
      if (ev.pointerId !== id) return;
      if (pinch) { finish(); return; } // a second finger: zooming instead
      if (!moved) {
        if (!win || Math.abs(ev.clientX - x0) < 6) return;
        moved = true;
        try { wrap.setPointerCapture(id); } catch (err) {}
        dock.classList.add('panning');
      }
      panTo(at0 - (ev.clientX - x0) / pxPerBeat(wrap.clientWidth));
    };
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      finish();
      if (!moved && ev.type === 'pointerup' && !busy() && !pinch) { placeStart(ev.clientX, wrap); select(null); }
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
  }

  // -------- MOVING AND SIZING PARTS --------
  // Drag a part's middle to move it, or one of its ends to size it — by
  // beats (by bars when the beats are too close together to aim at). A
  // loop's end pulls out as far as you like, the pass going round; a
  // straight part's ends open only as far as what was played. A part moved
  // or sized over another covers it, by the tape rules.
  function partAt(e, i) {
    const tr = P.tracks[i], l = lanes[i + 1];
    if (!tr || !l) return null;
    const rect = l.wrap.getBoundingClientRect();
    const ppb = pxPerBeat(rect.width), x = e.clientX - rect.left;
    const grab = e.pointerType === 'touch' ? 14 : 8;
    for (let k = tr.clips.length - 1; k >= 0; k--) {
      const c = tr.clips[k];
      const x0 = (c.b - view.start) * ppb, x1 = x0 + c.d * ppb;
      if (x < x0 - 4 || x > x1 + 4) continue;
      const edge = Math.min(grab, (x1 - x0) / 3);
      const how = x <= x0 + edge ? 'start' : x >= x1 - edge ? 'end' : 'move';
      // a locked track's part stays put: only a loop's end, pulled by whole passes
      if (trackLocked(i)) return { c, how: how === 'end' && c.loop ? 'end' : 'fixed' };
      return { c, how };
    }
    return null;
  }

  // A press on a part highlights it; a click on an empty part of a lane,
  // Escape, or the next take lets it go.
  function select(i, c) {
    const was = sel;
    sel = c ? { i, c } : null;
    if ((was ? was.c : null) === (c || null)) return;
    renderQuant();
    if (was) drawLane(was.i);
    if (sel && (!was || was.i !== i)) drawLane(i);
  }
  function checkSel() { if (sel && !P.tracks[sel.i].clips.includes(sel.c)) sel = null; }
  // Delete (or a Mac's delete key) takes the highlighted part away; Undo brings it back.
  function deletePart(s) {
    const tr = P.tracks[s.i];
    if (!tr.clips.includes(s.c)) return;
    if (trackLocked(s.i)) { lockedToast(s.i); return; }
    pushUndo(`deleting the part on track ${s.i + 1}`);
    tr.clips = tr.clips.filter(c => c !== s.c);
    partsView(tr);
    sel = null;
    renderAll();
    save();
    toast(`Part deleted from track ${s.i + 1}. Undo brings it back.`);
  }

  function grabPart(e, i) {
    const hit = partAt(e, i);
    if (!hit) return false;
    select(i, hit.c);
    const tr = P.tracks[i], c = hit.c, wrap = lanes[i + 1].wrap;
    const id = e.pointerId, startX = e.clientX, bpb = barBeats();
    const was = { b: c.b, o: c.o, d: c.d };
    const beatAt = (ev) => { const r = wrap.getBoundingClientRect(); return view.start + (ev.clientX - r.left) / pxPerBeat(r.width); };
    const grid = snapGrid(pxPerBeat(wrap.clientWidth)); // fixed for the drag, however the view moves
    const snap = x => Math.round(x / grid) * grid;
    const grabbed = beatAt(e);
    let on = false;
    // A locked loop's end: whole passes, one at the least, and never over the
    // next part on its track (which the tape rules would cut).
    const locked = trackLocked(i);
    const nextB = tr.clips.filter(k => k !== c && k.b >= was.b + 1e-9).reduce((lo, k) => Math.min(lo, k.b), Infinity);
    const passes = locked && c.loop ? Math.max(1, Math.floor(Math.min(PART_MAX, nextB - was.b) / c.loop + 1e-9)) : 0;
    // Zoomed in, held near a side of the lanes: the view keeps sliding along
    // (the song making room to the right), and the part goes with it.
    let last = null, timer = 0;
    const side = (ev) => {
      if (!win) return 0;
      const r = wrap.getBoundingClientRect();
      return ev.clientX > r.right - 30 ? 1 : ev.clientX < r.left + 30 ? -1 : 0;
    };
    const slide = () => {
      const s = last ? side(last) : 0;
      if (!s) { clearInterval(timer); timer = 0; return; }
      if (s > 0) fit.end = Math.max(fit.end, view.end + bpb);
      viewAt += s * 18 / pxPerBeat(wrap.clientWidth);
      applyView();
      place(last);
    };
    const move = (ev) => {
      if (ev.pointerId !== id) return;
      if (pinch) { up(Object.assign(new Event('pointercancel'), { pointerId: id })); return; } // a second finger: zooming, not dragging
      if (!on) {
        if (Math.abs(ev.clientX - startX) < 4 || hit.how === 'fixed') return; // (a locked part: a click only)
        on = true;
        try { wrap.setPointerCapture(id); } catch (err) {}
        edit = { i, c };
        dock.classList.add(hit.how === 'move' ? 'moving-part' : 'sizing-part');
      }
      ev.preventDefault();
      last = { clientX: ev.clientX };
      if (side(ev) && !timer) { timer = setInterval(slide, 40); slide(); return; }
      place(ev);
    };
    const place = (ev) => {
      const at = beatAt(ev);
      if (hit.how === 'move') {
        c.b = Math.max(-bpb, was.b + snap(at - grabbed));
      } else if (hit.how === 'start') {
        const b = clamp(snap(at), Math.max(-bpb, c.loop ? was.b + was.d - PART_MAX : was.b - was.o), was.b + was.d - PART_MIN);
        const ds = b - was.b;
        c.b = b; c.o = c.loop ? mod(was.o + ds, c.loop) : was.o + ds; c.d = was.d - ds;
      } else if (locked) {
        c.d = clamp(Math.round((at - was.b) / c.loop), 1, passes) * c.loop;
      } else {
        c.d = clamp(snap(at) - was.b, PART_MIN, c.loop ? PART_MAX : c.len - was.o);
      }
      partsView(tr);
      // zoomed out and pulled to an edge of the lanes: they make room
      if (!win && (c.b < fit.start || c.b + c.d > fit.end - 0.5)) {
        fit.start = Math.min(fit.start, Math.floor(c.b / bpb) * bpb);
        fit.end = Math.max(fit.end, Math.ceil((c.b + c.d) / bpb) * bpb + bpb);
        applyView();
      }
      queueDraw();
    };
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      clearInterval(timer);
      timer = 0;
      wrap.removeEventListener('pointermove', move);
      wrap.removeEventListener('pointerup', up);
      wrap.removeEventListener('pointercancel', up);
      edit = null;
      dock.classList.remove('moving-part', 'sizing-part');
      if (!on) { if (ev.type !== 'pointercancel') placeStart(ev.clientX, wrap); return; } // a click on a part: Play starts at that bar
      const now = { b: c.b, o: c.o, d: c.d };
      Object.assign(c, was);
      if (ev.type === 'pointercancel' || (now.b === was.b && now.o === was.o && now.d === was.d)) { partsView(tr); renderAll(); return; }
      pushUndo(`${hit.how === 'move' ? 'moving' : 'sizing'} the part on track ${i + 1}`);
      Object.assign(c, now);
      tr.clips = tr.clips.filter(k => k !== c);
      cutParts(tr, c.b, c.b + c.d);
      tr.clips.push(c);
      tr.clips.sort(byBeat);
      partsView(tr);
      renderAll();
      save();
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
    return true;
  }

  // -------- THE LOOP BUTTON --------
  function setLoop(i, on) {
    const tr = P.tracks[i];
    if (busy() || tr.loop === on) return;
    if (trackLocked(i)) { lockedToast(i); return; }
    if (tr.clips.length) pushUndo(`${on ? 'looping' : 'un-looping'} track ${i + 1}`);
    tr.loop = on;
    tr.clips = on ? tr.clips.map(toLoop) : unloopAll(tr.clips);
    partsView(tr);
    renderAll();
    save();
    toast(on
      ? `Track ${i + 1} loops: drag the end of a part out to repeat it.`
      : `Track ${i + 1} plays straight through: drag a part's ends to size it.`);
  }

  // -------- THE NOTE EDITOR --------
  // A double-click (or double-tap) on a track opens it out: the other tracks
  // step aside, the track fills their room, and its notes lie on rows of
  // pitch, with the piano's keys down the left. Drag a note along (when it
  // plays) or up and down (which note it is); drag its right end to make it
  // longer or shorter. A drag across empty space highlights every note it
  // crosses, and highlighted notes move, size, copy and delete together.
  // Paste lays the copied notes down at the dashed line: a click on an empty
  // spot puts the line there, and after Copy it waits just after what was
  // copied. Save Changes keeps it all (one step of the recorder's Undo);
  // Cancel puts the track back as it was. Either closes the editor.
  //
  // Notes stay in their parts. A part grows to take in a note moved or
  // lengthened past its ends (two parts that then overlap become one); a note
  // put down inside another part's box joins that part; notes pasted where
  // there is no part make a new one; a part left with no notes goes. A part
  // whose notes change becomes just what it shows: what its box had hidden,
  // and its notes as played (Quantize), go with the change. On a looping track
  // every pass of a part is the same notes, so one changed changes them all,
  // and a note stays inside its pass.
  const EDIT_LO = 21, EDIT_HI = 108;   // A0 to C8: the rows (wider for a note beyond them)
  const ROW_MAX = 18;                  // px a row, at most — and at least (a finger needs more):
  const rowMin = () => (matchMedia('(pointer: coarse)').matches ? 14 : 11);
  const EDIT_UNDO_MAX = 100;
  const MOD_KEY = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '') ? '⌘' : 'Ctrl+';
  const editInfo = el('rec-edit-info'), editDone = el('rec-edit-done'); // in the recorder's bar, shown while editing
  const editBtns = { copy: el('rec-edit-copy'), paste: el('rec-edit-paste'), del: el('rec-edit-delete'), save: el('rec-edit-save'), cancel: el('rec-edit-cancel') };
  let ed = null;          // the editor, open: see openEditor
  let clipboard = null;   // { notes: [{ m, b, d }] from 0, span }: kept while the page is open, for any track
  let lastTap = null;     // the last press on a track, for the double-click
  const BLACK = new Set([1, 3, 6, 8, 10]);
  const inBox = (c, b) => b >= c.b - EARLY && b < c.b + c.d - 1e-6;
  const editHeadW = () => (matchMedia('(max-width: 560px)').matches ? 60 : 104);

  // Every note the editor can grab, where it is heard: v.n is the note in its
  // part (c). A loop part's note is there once for every pass (the same n).
  function editViews(clips) {
    const out = [];
    clips.forEach(c => {
      const end = c.o + c.d;
      const add = (n, t) => {
        if (t < c.o - EARLY || t >= end - 1e-6) return;
        out.push({ c, n, m: n.m, b: c.b + t - c.o, d: t + n.d > end ? Math.max(MIN_HOLD, end - t) : n.d });
      };
      if (c.loop) {
        for (let k = Math.floor((c.o - EARLY) / c.loop); k * c.loop < end; k++) c.items.forEach(n => add(n, k * c.loop + n.b));
      } else {
        c.items.forEach(n => add(n, n.b));
      }
    });
    return out;
  }
  // The highlighted notes, each once: for a loop's note, the pass nearest `near`.
  function selViews(near) {
    const best = new Map();
    editViews(P.tracks[ed.i].clips).forEach(v => {
      if (!ed.sel.has(v.n)) return;
      const was = best.get(v.n);
      if (!was || (near != null ? Math.abs(v.b - near) < Math.abs(was.b - near) : v.b < was.b)) best.set(v.n, v);
    });
    return [...best.values()].sort(byBeat);
  }

  // A copy of the track's parts to work an edit out on; `map` takes a note to its copy.
  function cloneClips(clips) {
    const map = new Map();
    const copy = list => list.map(n => { const x = { m: n.m, b: n.b, d: n.d }; map.set(n, x); return x; });
    const out = clips.map(c => {
      const p = { ...c, items: copy(c.items) };
      if (c.raw) p.raw = c.raw.map(n => ({ ...n }));
      if (c.q) p.q = { ...c.q };
      if (c.was) p.was = JSON.parse(JSON.stringify(c.was));
      return p;
    });
    return { clips: out, map };
  }
  // Two of one note on one point: the longer stays (and stays highlighted if either was).
  function tidy(items, sel) {
    const out = [];
    items.slice().sort(byBeat).forEach(n => {
      const twin = out.find(x => x.m === n.m && Math.abs(x.b - n.b) < 1e-6);
      if (!twin) { out.push(n); return; }
      twin.d = Math.max(twin.d, n.d);
      if (sel.has(n)) { sel.delete(n); sel.add(twin); }
    });
    return out;
  }

  // An edit, worked out on a copy of the track's parts (so a drag can show it
  // before it is let go). op: { kind: 'move', dt, dm } | { kind: 'size', dd, min }
  // | { kind: 'delete' } | { kind: 'add', notes } — notes in the song's beats,
  // which become the highlighted ones. Returns { clips, sel }.
  function applyEdit(op) {
    const tr = P.tracks[ed.i];
    if ((op.kind === 'move' && Math.abs(op.dt) < 1e-9 && !op.dm) || (op.kind === 'size' && Math.abs(op.dd) < 1e-9)) {
      return { clips: tr.clips, sel: ed.sel, same: true };
    }
    const { clips, map } = cloneClips(tr.clips);
    const sel = new Set();
    ed.sel.forEach(n => { const x = map.get(n); if (x) sel.add(x); });
    return tr.loop ? editLoop(clips, sel, op) : editStraight(clips, sel, op);
  }

  // A track that plays straight through: its notes where they are heard,
  // changed, then put back into parts round them.
  function editStraight(clips, sel, op) {
    let W = editViews(clips).map(v => ({ m: v.m, b: v.b, d: v.d, home: v.c, on: sel.has(v.n), moved: false }));
    const touched = new Set();
    if (op.kind === 'move') {
      W.forEach(w => { if (w.on) { w.b += op.dt; w.m += op.dm; w.moved = true; touched.add(w.home); } });
    } else if (op.kind === 'size') {
      W.forEach(w => { if (w.on) { w.d = Math.max(MIN_HOLD, Math.min(op.min, w.d), w.d + op.dd); touched.add(w.home); } });
    } else if (op.kind === 'delete') {
      W = W.filter(w => { if (w.on) touched.add(w.home); return !w.on; });
    } else if (op.kind === 'add') { // the new notes are the highlighted ones
      sel.clear();
      W.forEach(w => { w.on = false; });
      op.notes.forEach(p => W.push({ m: p.m, b: p.b, d: p.d, home: null, on: true, moved: true }));
    } else if (op.kind === 'quant') { // the highlighted notes start on the rhythm (op.snap)
      W.forEach(w => {
        if (!w.on) return;
        const b = op.snap(w.b);
        if (Math.abs(b - w.b) < 1e-9) return;
        w.b = b; w.moved = true; touched.add(w.home);
      });
    }
    // a note put down inside another part's box joins that part
    W.forEach(w => {
      if (!w.moved) return;
      const c = clips.find(x => inBox(x, w.b));
      if (c && c !== w.home) { if (w.home) touched.add(w.home); w.home = c; touched.add(c); }
    });
    const loose = W.filter(w => !w.home);
    if (!touched.size && !loose.length) return { clips, sel };
    // The parts that changed, as boxes to fill: a part keeps its box while
    // any of its notes are still in it (all moved out, it goes with them),
    // and reaches round every note it has, from the beat a note starts on to
    // the beat after it ends. Notes pasted where there is no part make one.
    const regions = [...touched].map(c => {
      const notes = W.filter(w => w.home === c);
      const stays = notes.some(w => inBox(c, w.b));
      return { lo: stays ? c.b : Infinity, hi: stays ? c.b + c.d : -Infinity, notes };
    });
    if (loose.length) regions.push({ lo: Infinity, hi: -Infinity, notes: loose });
    regions.forEach(r => r.notes.forEach(w => {
      r.lo = Math.min(r.lo, Math.floor(w.b + EARLY));
      r.hi = Math.max(r.hi, Math.ceil(w.b + w.d - 1e-6), r.lo + 1);
    }));
    // boxes that now overlap become one part
    const open = x => (x.part ? { lo: x.lo, hi: x.hi, notes: W.filter(w => w.home === x.part) } : x);
    const boxes = clips.filter(c => !touched.has(c)).map(c => ({ lo: c.b, hi: c.b + c.d, part: c }))
      .concat(regions.filter(r => r.notes.length))
      .sort((a, b) => a.lo - b.lo);
    const merged = [];
    boxes.forEach(x => {
      const last = merged[merged.length - 1];
      if (!last || x.lo >= last.hi - 1e-9) { merged.push(x); return; }
      const a = open(last), b = open(x);
      merged[merged.length - 1] = { lo: Math.min(a.lo, b.lo), hi: Math.max(a.hi, b.hi), notes: a.notes.concat(b.notes) };
    });
    const out = [], newSel = new Set();
    merged.forEach(x => {
      if (x.part) { // untouched: just as it was, hidden notes and all
        out.push(x.part);
        x.part.items.forEach(n => { if (sel.has(n)) newSel.add(n); });
        return;
      }
      const items = x.notes.map(w => { const n = { m: w.m, b: w.b - x.lo, d: w.d }; if (w.on) newSel.add(n); return n; });
      out.push({ b: x.lo, o: 0, d: x.hi - x.lo, len: x.hi - x.lo, items: tidy(items, newSel) });
    });
    return { clips: out, sel: newSel };
  }

  // A looping track: its parts' passes are changed where they are, every pass
  // together, and each note stays inside its pass.
  function editLoop(clips, sel, op) {
    const touched = new Set();
    if (op.kind === 'move' || op.kind === 'size') {
      clips.forEach(c => {
        const mine = c.items.filter(n => sel.has(n)), L = c.loop;
        if (!mine.length) return;
        if (op.kind === 'move') {
          let dt = op.dt; // the notes keep together, whole, inside the pass
          mine.forEach(n => { dt = Math.max(dt, -n.b); });
          mine.forEach(n => { dt = Math.min(dt, Math.max(0, L - n.b - n.d)); });
          if (Math.abs(dt) < 1e-9 && !op.dm) return;
          mine.forEach(n => { n.b += dt; n.m += op.dm; n.d = Math.max(MIN_HOLD, Math.min(n.d, L - n.b)); });
        } else {
          mine.forEach(n => { n.d = clamp(n.d + op.dd, Math.max(MIN_HOLD, Math.min(op.min, n.d)), Math.max(MIN_HOLD, L - n.b)); });
        }
        touched.add(c);
      });
    } else if (op.kind === 'delete') {
      clips.forEach(c => {
        const keep = c.items.filter(n => !sel.has(n));
        if (keep.length < c.items.length) { c.items = keep; touched.add(c); }
      });
      sel.clear();
    } else if (op.kind === 'quant') { // on the rhythm, measured from the song's beats, round the pass
      clips.forEach(c => c.items.forEach(n => {
        if (!sel.has(n)) return;
        const L = c.loop, origin = c.b - c.o;
        let t = mod(op.snap(origin + n.b) - origin, L);
        if (t > L - 1e-6) t = 0;
        if (Math.abs(t - n.b) < 1e-9) return;
        n.b = t;
        n.d = Math.max(MIN_HOLD, Math.min(n.d, L - t));
        touched.add(c);
      }));
    } else if (op.kind === 'add') {
      sel.clear();
      const loose = [];
      op.notes.forEach(p => {
        const c = clips.find(x => inBox(x, p.b));
        if (!c) { loose.push(p); return; }
        const L = c.loop;
        let t = mod(p.b - (c.b - c.o), L);
        if (t > L - MIN_HOLD) t = 0;
        const n = { m: p.m, b: t, d: Math.max(MIN_HOLD, Math.min(p.d, L - t)) };
        c.items.push(n);
        sel.add(n);
        touched.add(c);
      });
      // pasted where there is no part: a new loop, in the room between the parts there
      if (loose.length) {
        let lo = Math.floor(Math.min(...loose.map(p => p.b)) + EARLY);
        let hi = Math.max(lo + 1, Math.ceil(Math.max(...loose.map(p => p.b + p.d)) - 1e-6));
        clips.forEach(c => {
          if (c.b + c.d <= lo + 1e-9 || c.b >= hi - 1e-9) return;
          if (c.b <= lo) lo = c.b + c.d; else hi = Math.min(hi, c.b);
        });
        const fits = loose.filter(p => p.b >= lo - EARLY && p.b < hi - 1e-6);
        if (hi - lo >= 1 && fits.length) {
          const part = toLoop(makePart(fits, lo, hi));
          part.items.forEach(n => sel.add(n));
          clips.push(part);
        }
      }
    }
    touched.forEach(c => {
      delete c.was; delete c.q; delete c.raw; // changed: no longer the take as played, nor as it was before it looped
      c.items = tidy(c.items, sel);
    });
    return { clips: clips.filter(c => c.items.length || !touched.has(c)).sort(byBeat), sel };
  }

  // The editor's own Undo: the track's parts, and which notes were highlighted.
  function editSnap() {
    const tr = P.tracks[ed.i], at = [];
    tr.clips.forEach((c, ci) => c.items.forEach((n, ni) => { if (ed.sel.has(n)) at.push([ci, ni]); }));
    return { clips: JSON.stringify(tr.clips), at };
  }
  function editUndo() {
    const u = ed && ed.undo.pop();
    if (!u) return;
    if (busy()) stopRun();
    const tr = P.tracks[ed.i];
    tr.clips = JSON.parse(u.clips);
    ed.sel = new Set(u.at.map(([ci, ni]) => tr.clips[ci] && tr.clips[ci].items[ni]).filter(Boolean));
    partsView(tr);
    editRange();
    renderAll();
  }
  function commitEdit(res) {
    if (!res || res.same) return;
    const tr = P.tracks[ed.i];
    if (JSON.stringify(res.clips) === JSON.stringify(tr.clips)) { ed.sel = res.sel; renderEditBar(); queueDraw(); return; }
    if (busy()) stopRun(); // (the music plays the notes as they were)
    ed.undo.push(editSnap());
    if (ed.undo.length > EDIT_UNDO_MAX) ed.undo.shift();
    tr.clips = res.clips;
    ed.sel = res.sel;
    partsView(tr);
    editRange();
    renderAll();
  }
  const editChanged = () => !!ed && JSON.stringify(P.tracks[ed.i].clips) !== ed.before;

  // -- opening and closing --
  function openEditor(i, part) {
    if (ed || !R.open || R.state === 'recording' || R.state === 'priming' || trackLocked(i)) return;
    if (busy()) stopRun();
    const tr = P.tracks[i];
    select(null);
    ed = {
      i,
      before: JSON.stringify(tr.clips),                       // Cancel's track
      saved: { clips: JSON.parse(JSON.stringify(tr.clips)), notes: tr.notes.map(n => ({ ...n })) }, // what autosave keeps meanwhile
      view0: { win, viewAt },                                 // the view to go back to
      undo: [], sel: new Set(), caret: part ? part.b : R.pos,
      top: 72, rowH: 12, h: 0, lo: EDIT_LO, hi: EDIT_HI,
      preview: null, box: null, hits: [], gesture: null, drop: null,
      ladder: ctls[i].ladder
    };
    dock.classList.add('editing');
    document.body.classList.add('rec-editing'); // the keyboard steps away too: the notes get its room
    ctls[i].row.classList.add('editing');
    lanes[i + 1].wrap.title = ''; // (its "double-click" tooltip)
    editInfo.style.setProperty('--tc', TRACK_COLORS[i]);
    tracksEl.style.setProperty('--head-w', editHeadW() + 'px');
    sizeLanes();
    // the part double-clicked fills the view (zoomed in on it, a beat to spare each side)
    if (part) {
      const w = Math.max(part.d + 2, 2 * barBeats());
      if (view.end - view.start > w * 1.25) { win = w; viewAt = part.b - (w - part.d) / 2; }
    }
    editRange();
    fitRows();
    renderAll();
    if (!sessionStorageGet('edit-tip')) {
      sessionStorageSet('edit-tip');
      toast('Drag notes to change them. Save Changes keeps them; Cancel puts the track back.');
    }
  }
  function closeEditor(keep) {
    if (!ed) return;
    if (busy()) stopRun();
    const e = ed, tr = P.tracks[e.i];
    const changed = editChanged();
    if (changed && keep) { // one step of Undo: the track as it was before the editor opened
      const after = tr.clips;
      tr.clips = JSON.parse(e.before);
      partsView(tr);
      pushUndo(`editing the notes on track ${e.i + 1}`);
      tr.clips = after;
    } else if (changed) {
      tr.clips = JSON.parse(e.before);
    }
    partsView(tr);
    ed = null;
    dock.classList.remove('editing', 'moving-note', 'sizing-note', 'boxing');
    document.body.classList.remove('rec-editing');
    ctls[e.i].row.classList.remove('editing');
    lanes[e.i + 1].wrap.style.cursor = '';
    lanes[e.i + 1].wrap.title = 'Double-click to open this track and edit its notes';
    win = e.view0.win;
    viewAt = e.view0.viewAt;
    setHead(head); // the track controls' own width again
    renderAll();
    if (changed) {
      save();
      toast(keep ? `Saved the changes to track ${e.i + 1}. Undo takes them back.` : `Cancelled: track ${e.i + 1} is as it was.`);
    }
  }
  // While the editor is open the recorder stays open: Save Changes or Cancel first.
  function nudgeEditBar() {
    editDone.classList.remove('nudge');
    void editDone.offsetWidth;
    editDone.classList.add('nudge');
    toast('Save Changes or Cancel first.');
  }

  // A second press on a track soon after the first, in the same spot: the double-click.
  function doubleTap(e, i) {
    const now = performance.now(), t = lastTap;
    lastTap = { i, at: now, x: e.clientX, y: e.clientY, pos: R.pos };
    if (!t || t.i !== i || now - t.at > 450 || Math.hypot(e.clientX - t.x, e.clientY - t.y) > 14) return false;
    lastTap = null;
    if (R.state === 'recording' || R.state === 'priming') return false;
    if (trackLocked(i)) { lockedToast(i); return false; } // the lesson's notes are not for editing
    const hit = partAt(e, i);
    e.preventDefault();
    if (!busy()) { R.pos = t.pos; renderPos(); } // the first click moved where Play starts: it was only half of this
    openEditor(i, hit ? hit.c : null);
    return true;
  }

  // -- the rows --
  // ed.top: the pitch at the lanes' top edge, counted in rows: row m spans
  // from (top − m) rows down to one row lower.
  const rowY = m => (ed.top - m) * ed.rowH;
  // The rows the track's notes need: the piano's, and further for a note beyond it.
  function editRange() {
    const notes = P.tracks[ed.i].notes;
    ed.lo = Math.min(EDIT_LO, ...notes.map(n => n.m));
    ed.hi = Math.max(EDIT_HI, ...notes.map(n => n.m));
  }
  function setTop(t) {
    const l = lanes[ed.i + 1];
    ed.top = clamp(t, ed.lo - 1 + (l.h || 0) / ed.rowH, ed.hi);
  }
  // Rows sized so the track's notes (and some room) fit, centred on them.
  function fitRows(center) {
    const l = lanes[ed.i + 1];
    if (!l.h) return;
    const notes = P.tracks[ed.i].notes;
    let lo = 60, hi = 72;
    if (notes.length) { lo = Math.min(...notes.map(n => n.m)); hi = Math.max(...notes.map(n => n.m)); }
    ed.rowH = clamp(l.h / Math.max(hi - lo + 7, 25), rowMin(), ROW_MAX);
    if ((ed.hi - ed.lo + 1) * ed.rowH < l.h) ed.rowH = l.h / (ed.hi - ed.lo + 1); // all of them fit: they stretch
    ed.h = l.h;
    setTop((center != null ? center : (lo + hi) / 2 - 0.5) + l.h / ed.rowH / 2);
  }
  // The lane changed height: the same rows in the middle, sized again.
  function keepRows() {
    const l = lanes[ed.i + 1];
    if (!l.h || Math.abs(l.h - ed.h) < 1) return;
    fitRows(ed.h ? ed.top - ed.h / ed.rowH / 2 : null);
  }
  // Bring notes into sight: along the song, and up or down the rows.
  function revealNotes(vs) {
    if (!vs.length) return;
    const l = lanes[ed.i + 1];
    reveal(vs[0].b);
    const top = Math.max(...vs.map(v => v.m)), bot = Math.min(...vs.map(v => v.m)) - 1;
    if (top > ed.top || bot < ed.top - l.h / ed.rowH) setTop((top + bot) / 2 + l.h / ed.rowH / 2);
    queueDraw();
  }

  // -- the grid notes move on --
  // the finest of beat, 8th and 16th (thirds and sixths of the beat in 6/8)
  // that the zoom spreads 12 px or more apart
  function noteGrid() {
    const ppb = pxPerBeat(lanes[ed.i + 1].w || 1);
    let s = 1;
    (P.meter === '6/8' ? [1, 1 / 3, 1 / 6] : [1, 1 / 2, 1 / 4]).forEach(d => { if (d * ppb >= 12) s = d; });
    return s;
  }
  // The highlighted notes moved together: never past the piano's rows, nor
  // before the pick-up bar.
  function clampMove(dt, dm) {
    const vs = selViews();
    if (!vs.length) return { dt: 0, dm: 0 };
    dm = clamp(dm, ed.lo - Math.min(...vs.map(v => v.m)), ed.hi - Math.max(...vs.map(v => v.m)));
    if (!P.tracks[ed.i].loop) dt = Math.max(dt, -barBeats() - Math.min(...vs.map(v => v.b)));
    return { dt, dm };
  }

  // A note heard as it is picked up or moved to another row.
  function audition(m) {
    try {
      wakeAudio();
      Audio.schedule(SOUND_SIDE, [midiFreq(m)], P.tracks[ed.i].sound, Audio.ensure().currentTime + 0.005, 0.28, 0.9);
    } catch (err) {}
  }

  // -- pressing in the editor --
  // Where a pointer is over the edited lane: px across and down its canvas,
  // the beat there, and the pitch (in rows, continuous).
  function editPoint(ev) {
    const l = lanes[ed.i + 1], r = l.canvas.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    return { x, y, beat: view.start + x / pxPerBeat(l.w || 1), p: ed.top - y / ed.rowH };
  }
  // The note under a pointer (the one drawn on top), and whether the press is
  // on its right end (sizing it) or its middle (moving it).
  function editHit(ev) {
    const pt = editPoint(ev), touch = ev.pointerType === 'touch';
    const padX = touch ? 6 : 3, padY = touch ? 4 : 0;
    for (let k = ed.hits.length - 1; k >= 0; k--) {
      const h = ed.hits[k];
      if (pt.x < h.x0 - padX || pt.x > h.x1 + padX || pt.y < h.y0 - padY || pt.y > h.y1 + padY) continue;
      const w = h.x1 - h.x0;
      const edge = w < 12 ? 1 : Math.min(touch ? 14 : 8, w / 3);
      return { v: h.v, how: pt.x >= h.x1 - edge ? 'size' : 'move' };
    }
    return null;
  }
  function editPress(e) {
    if (e.button > 0 || pinch) return;
    e.preventDefault();
    const l = lanes[ed.i + 1], wrap = l.wrap, id = e.pointerId;
    const p0 = editPoint(e), hit = editHit(e);
    const add = e.shiftKey || e.metaKey || e.ctrlKey;
    let g;
    if (hit) {
      const n = hit.v.n, was = ed.sel.has(n);
      if (add) { if (was) ed.sel.delete(n); else ed.sel.add(n); }
      else if (!was) ed.sel = new Set([n]);
      if (ed.sel.has(n)) audition(hit.v.m);
      g = { kind: ed.sel.has(n) ? hit.how : 'none', v: hit.v, was, add, copy: e.altKey, dm: 0 };
    } else {
      g = { kind: 'box', base: add ? new Set(ed.sel) : new Set(), add };
    }
    ed.gesture = g;
    renderEditBar();
    queueDraw();
    let on = false, last = null, timer = 0;
    // Where the pointer is now, in beats and rows: from how far it has gone
    // since the press, and how far the view has slid or scrolled meanwhile —
    // so nothing shifting on the page (the bar's hint, say) can move a note.
    const x0 = e.clientX, y0 = e.clientY, v0 = view.start, top0 = ed.top;
    const pointAt = (ev) => ({
      beat: p0.beat + (ev.clientX - x0) / pxPerBeat(l.w || 1) + (view.start - v0),
      p: p0.p + (y0 - ev.clientY) / ed.rowH + (ed.top - top0)
    });

    const track = (ev) => {
      // Quantize on: a note lands on the beat lines, as fine as the zoom shows
      // them (⌘ / Ctrl held: not this time). Off: just where it is put.
      const pt = pointAt(ev), snapOn = P.quant.on && !(ev.metaKey || ev.ctrlKey);
      const grid = noteGrid();
      if (g.kind === 'box') {
        const b0 = Math.min(p0.beat, pt.beat), b1 = Math.max(p0.beat, pt.beat);
        const pTop = Math.max(p0.p, pt.p), pBot = Math.min(p0.p, pt.p);
        ed.box = { b0, b1, pTop, pBot };
        const s = new Set(g.base);
        editViews(P.tracks[ed.i].clips).forEach(v => {
          if (v.b + v.d < b0 || v.b > b1 || v.m <= pBot || v.m - 1 >= pTop) return; // row m spans m − 1 to m
          s.add(v.n);
        });
        ed.sel = s;
      } else if (g.kind === 'move') {
        // on the lines: the note held goes to the nearest one (once it has moved half a step along —
        // a note only moved up or down keeps its time)
        const raw = pt.beat - p0.beat;
        const dt = !snapOn ? raw : Math.abs(raw) < grid / 2 ? 0 : Math.round((g.v.b + raw) / grid) * grid - g.v.b;
        const c = clampMove(dt, Math.round(pt.p - p0.p));
        if (g.copy) { // Option / Alt held: the copies move, the notes stay
          const from = selViews(g.v.b);
          ed.preview = applyEdit({ kind: 'add', notes: from.map(v => ({ m: v.m + c.dm, b: v.b + c.dt, d: v.d })) });
        } else {
          ed.preview = applyEdit({ kind: 'move', dt: c.dt, dm: c.dm });
        }
        if (c.dm !== g.dm) { g.dm = c.dm; audition(g.v.m + c.dm); }
      } else if (g.kind === 'size') {
        const raw = pt.beat - p0.beat, end = g.v.b + g.v.d;
        // on the lines: the end goes onto one (once pulled half a step)
        const dd = !snapOn ? raw : Math.abs(raw) < grid / 2 ? 0 : Math.round((end + raw) / grid) * grid - end;
        ed.preview = applyEdit({ kind: 'size', dd, min: snapOn ? grid : MIN_HOLD });
      }
      renderEditBar();
      queueDraw();
    };
    // Near an edge of the lane the view keeps going: along the song (zoomed
    // in, the song making room to the right) and up or down the rows.
    const edgeOf = (ev) => {
      const r = l.canvas.getBoundingClientRect();
      return {
        x: win ? (ev.clientX > r.right - 24 ? 1 : ev.clientX < r.left + 24 ? -1 : 0) : 0,
        y: ev.clientY < r.top + 12 ? 1 : ev.clientY > r.bottom - 12 ? -1 : 0
      };
    };
    const slide = () => {
      const s = last ? edgeOf(last) : { x: 0, y: 0 };
      if (!s.x && !s.y) { clearInterval(timer); timer = 0; return; }
      if (s.x) {
        if (s.x > 0) fit.end = Math.max(fit.end, view.end + barBeats());
        viewAt += s.x * 18 / pxPerBeat(l.w || 1);
        applyView();
      }
      if (s.y) setTop(ed.top + s.y * 0.5);
      track(last);
    };
    const move = (ev) => {
      if (ev.pointerId !== id) return;
      if (pinch) { finish(true); return; } // a second finger: zooming instead
      if (!on) {
        if (Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 4) return;
        if (g.kind === 'none') return;
        on = true;
        try { wrap.setPointerCapture(id); } catch (err) {}
        dock.classList.add(g.kind === 'size' ? 'sizing-note' : g.kind === 'box' ? 'boxing' : 'moving-note');
      }
      ev.preventDefault();
      last = { clientX: ev.clientX, clientY: ev.clientY, metaKey: ev.metaKey, ctrlKey: ev.ctrlKey };
      const s = edgeOf(ev);
      if ((s.x || s.y) && !timer) { timer = setInterval(slide, 40); slide(); return; }
      track(ev);
    };
    const finish = (cancelled) => {
      clearInterval(timer);
      timer = 0;
      wrap.removeEventListener('pointermove', move);
      wrap.removeEventListener('pointerup', up);
      wrap.removeEventListener('pointercancel', up);
      dock.classList.remove('moving-note', 'sizing-note', 'boxing');
      if (!ed) return;
      ed.gesture = null;
      ed.box = null;
      const res = ed.preview;
      ed.preview = null;
      if (!on) { // a click
        if (cancelled) { /* nothing */ }
        else if (g.kind === 'box') { // an empty spot: Paste goes there, and Play starts there
          if (!g.add) ed.sel = new Set();
          ed.caret = Math.max(-barBeats(), P.quant.on ? Math.round(p0.beat / noteGrid()) * noteGrid() : p0.beat);
          if (!busy()) { R.pos = Math.max(ed.caret, songStart()); renderPos(); }
        }
        else if (!g.add && g.was) ed.sel = new Set([g.v.n]); // a click on one of several highlighted: that one alone
      } else if (!cancelled && res && g.kind !== 'box') {
        commitEdit(res);
        return;
      }
      renderEditBar();
      queueDraw();
    };
    const up = (ev) => { if (ev.pointerId === id) finish(ev.type === 'pointercancel'); };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
  }
  // What a drag there would do, said by the pointer.
  function editCursor(e, wrap) {
    if (ed.gesture) return;
    const h = editHit(e);
    wrap.style.cursor = !h ? '' : h.how === 'size' ? 'ew-resize' : 'grab';
  }

  // The piano's keys down the left: press one to hear it, drag them up or down to see other rows.
  function ladderPress(e) {
    if (!ed || e.button > 0) return;
    e.preventDefault();
    const cv = ed.ladder.querySelector('canvas'), r = cv.getBoundingClientRect();
    const id = e.pointerId, y0 = e.clientY, top0 = ed.top;
    let moved = false;
    try { ed.ladder.setPointerCapture(id); } catch (err) {}
    const m = Math.ceil(ed.top - (e.clientY - r.top) / ed.rowH);
    if (m >= ed.lo && m <= ed.hi) { audition(m); ed.heard = m; drawLadder(); }
    const move = (ev) => {
      if (ev.pointerId !== id) return;
      if (!moved && Math.abs(ev.clientY - y0) < 4) return;
      moved = true;
      ed.heard = null;
      setTop(top0 + (ev.clientY - y0) / ed.rowH);
      queueDraw();
    };
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      ed.ladder.removeEventListener('pointermove', move);
      ed.ladder.removeEventListener('pointerup', up);
      ed.ladder.removeEventListener('pointercancel', up);
      if (ed) { ed.heard = null; drawLadder(); }
    };
    ed.ladder.addEventListener('pointermove', move);
    ed.ladder.addEventListener('pointerup', up);
    ed.ladder.addEventListener('pointercancel', up);
  }

  // -- the bar's buttons, and keys --
  function copyNotes(cut) {
    const vs = selViews();
    if (!vs.length) { toast('Highlight notes first: click one, or drag across several.'); return; }
    const lo = vs[0].b, hi = Math.max(...vs.map(v => v.b + v.d));
    // span: how far along the next copy goes, in whole beats (a note a hair long still fits)
    clipboard = { notes: vs.map(v => ({ m: v.m, b: v.b - lo, d: v.d })), span: Math.max(1, Math.ceil(hi - lo - EARLY)) };
    const many = vs.length === 1 ? 'the note' : `${vs.length} notes`;
    if (cut) {
      ed.caret = lo;
      commitEdit(applyEdit({ kind: 'delete' }));
      toast(`Cut ${many}. Click where ${vs.length === 1 ? 'it goes' : 'they go'}, then Paste.`);
    } else {
      ed.caret = lo + clipboard.span; // Paste right away: the copy follows on
      toast(`Copied ${many}. Paste puts ${vs.length === 1 ? 'it' : 'them'} at the dashed line (click elsewhere to move it).`);
    }
    renderEditBar();
    queueDraw();
  }
  function pasteNotes() {
    if (!clipboard) { toast('Copy some notes first.'); return; }
    const at = ed.caret;
    commitEdit(applyEdit({ kind: 'add', notes: clipboard.notes.map(n => ({ m: n.m, b: at + n.b, d: n.d })) }));
    ed.caret = at + clipboard.span;
    revealNotes(selViews());
    if (!ed.sel.size) toast('There was no room for them there.');
  }
  function deleteNotes() {
    if (!ed.sel.size) return;
    commitEdit(applyEdit({ kind: 'delete' }));
  }
  function selectAllNotes() {
    ed.sel = new Set(editViews(P.tracks[ed.i].clips).map(v => v.n));
    renderEditBar();
    queueDraw();
  }
  // The arrow keys: along by the grid, up or down a note (with Shift, an octave).
  // (Quantize on, ← → go to the line before or after the first note's start;
  // off, a step of the grid from wherever it is.)
  function nudgeNotes(key, big) {
    const grid = noteGrid(), first = selViews()[0];
    let step = grid;
    if (P.quant.on && first && (key === 'ArrowLeft' || key === 'ArrowRight')) {
      step = key === 'ArrowRight'
        ? (Math.floor(first.b / grid + 1e-6) + 1) * grid - first.b
        : first.b - (Math.ceil(first.b / grid - 1e-6) - 1) * grid;
    }
    const want = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, big ? 12 : 1], ArrowDown: [0, big ? -12 : -1] }[key];
    const c = clampMove(want[0], want[1]);
    commitEdit(applyEdit({ kind: 'move', dt: c.dt, dm: c.dm }));
    if (c.dm && first) audition(first.m + c.dm);
    revealNotes(selViews());
  }
  editBtns.copy.addEventListener('click', () => { if (ed) copyNotes(false); });
  editBtns.paste.addEventListener('click', () => { if (ed) pasteNotes(); });
  editBtns.del.addEventListener('click', () => { if (ed) deleteNotes(); });
  editBtns.save.addEventListener('click', () => closeEditor(true));
  editBtns.cancel.addEventListener('click', () => closeEditor(false));
  editBtns.copy.title = `Copy the highlighted notes (${MOD_KEY}C; ${MOD_KEY}X cuts)`;
  editBtns.paste.title = `Paste at the dashed line (${MOD_KEY}V)`;
  editBtns.del.title = 'Delete the highlighted notes (Delete)';
  ['copy', 'paste', 'del'].forEach(k => editBtns[k].setAttribute('aria-label', editBtns[k].textContent.trim())); // (phones show the icons alone)

  function renderEditBar() {
    if (!ed) return;
    const tr = P.tracks[ed.i], n = ed.sel.size;
    const sound = [...soundSelect.options].find(o => o.value === tr.sound);
    el('rec-edit-num').textContent = String(ed.i + 1);
    el('rec-edit-title').textContent = `Track ${ed.i + 1}` + (sound ? ` · ${sound.textContent}` : '');
    editBtns.copy.disabled = editBtns.del.disabled = !n;
    editBtns.paste.disabled = !clipboard;
    editBtns.save.disabled = false;
    const grid = P.quant.on ? 'Quantize on: notes land on the beat lines.' : 'Quantize off: notes go just where you put them.';
    const hint = (n
      ? `${n === 1 ? 'One note' : n + ' notes'} highlighted: drag ${n === 1 ? 'it' : 'them'}, or press ← → ↑ ↓. `
      : 'Drag a note to move it, its right end to resize it, or across empty space to highlight several. ')
      + (tr.loop ? 'Every pass of the loop changes together. ' : '') + grid;
    el('rec-edit-hint').textContent = hint;
    editInfo.title = el('rec-edit-title').textContent + ' — ' + hint; // (a narrow bar cuts it short)
  }

  // -- drawing --
  function drawEditor(l) {
    const tr = P.tracks[ed.i], col = TRACK_COLORS[ed.i];
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    if (Math.abs(l.h - ed.h) >= 1) keepRows();
    const ppb = pxPerBeat(l.w), rh = ed.rowH, bpb = barBeats();
    const line = cssVar('--line'), strong = cssVar('--line-strong'), ink = cssVar('--text');
    const mTop = Math.ceil(ed.top), mBot = Math.ceil(ed.top - l.h / rh);

    // the rows: a black key's darker, a line under each C (where an octave begins)
    g.fillStyle = line;
    for (let m = mBot; m <= mTop; m++) if (BLACK.has(mod(m, 12))) g.fillRect(0, rowY(m), l.w, rh);
    g.fillStyle = strong;
    for (let m = mBot; m <= mTop; m++) if (mod(m, 12) === 0) g.fillRect(0, Math.round(rowY(m) + rh) - 1, l.w, 1);
    // outside the piano's rows
    g.fillStyle = line;
    if (ed.hi < mTop) g.fillRect(0, 0, l.w, rowY(ed.hi));
    if (ed.lo > mBot) g.fillRect(0, rowY(ed.lo) + rh, l.w, l.h);

    // bar lines, beats, and the grid notes move on
    for (let b = Math.ceil(view.start); b < view.end; b++) {
      const bar = isDownbeat(b);
      if (!bar && ppb < 9) continue;
      g.fillStyle = bar ? strong : line;
      g.fillRect(Math.round((b - view.start) * ppb), 0, 1, l.h);
    }
    const step = noteGrid();
    if (step < 1) {
      g.fillStyle = line;
      g.globalAlpha = 0.6;
      for (let k = Math.ceil(view.start / step); k * step < view.end; k++) {
        const b = k * step;
        if (Math.abs(b - Math.round(b)) < 1e-6) continue;
        g.fillRect(Math.round((b - view.start) * ppb), 0, 1, l.h);
      }
      g.globalAlpha = 1;
    }
    if (view.start < 0) { g.fillStyle = line; g.fillRect(0, 0, (0 - view.start) * ppb, l.h); } // the pick-up bar

    const clips = ed.preview ? ed.preview.clips : tr.clips;
    const sel = ed.preview ? ed.preview.sel : ed.sel;
    // the parts: boxes the height of the lane, a loop's passes marked
    g.fillStyle = g.strokeStyle = col;
    clips.forEach(c => {
      const x0 = (c.b - view.start) * ppb, x1 = x0 + c.d * ppb;
      if (x1 < 0 || x0 > l.w) return;
      g.globalAlpha = 0.07;
      g.fillRect(x0, 0, x1 - x0, l.h);
      g.globalAlpha = 0.6;
      g.lineWidth = 1.5;
      boxPath(g, x0 + 1, 1, Math.max(2, x1 - x0 - 2), l.h - 2, 6);
      g.stroke();
      if (c.loop) {
        g.setLineDash([3, 4]);
        g.lineWidth = 1;
        g.beginPath();
        for (let t = c.loop - mod(c.o, c.loop); t < c.d - 1e-6; t += c.loop) {
          const x = Math.round(x0 + t * ppb) + 0.5;
          g.moveTo(x, 2);
          g.lineTo(x, l.h - 2);
        }
        g.stroke();
        g.setLineDash([]);
      }
    });
    g.globalAlpha = 1;

    // the notes, the highlighted ones on top
    const views = editViews(clips);
    const order = views.filter(v => !sel.has(v.n)).concat(views.filter(v => sel.has(v.n)));
    const dim = tr.muted ? 0.45 : 1;
    ed.hits = [];
    g.textBaseline = 'middle';
    g.font = `800 ${clamp(rh - 4, 8, 11)}px Nunito, system-ui, sans-serif`;
    order.forEach(v => {
      const x0 = (v.b - view.start) * ppb, x1 = x0 + Math.max(3, v.d * ppb);
      if (x1 < -2 || x0 > l.w + 2) return;
      const y0 = rowY(v.m), on = sel.has(v.n), color = noteColor(mod(v.m, 12));
      if (y0 + rh <= 0 || y0 >= l.h) { // out of sight above or below: a mark at that edge
        g.globalAlpha = 0.9 * dim;
        g.fillStyle = color;
        g.fillRect(x0, y0 < 0 ? 0 : l.h - 3, x1 - x0, 3);
        g.globalAlpha = 1;
        return;
      }
      ed.hits.push({ v, x0, x1, y0, y1: y0 + rh });
      g.globalAlpha = dim;
      g.fillStyle = color;
      boxPath(g, x0 + 0.5, y0 + 1, x1 - x0 - 1, rh - 2, Math.min(3, rh / 3));
      g.fill();
      g.globalAlpha = 1;
      g.lineWidth = on ? 2 : 1;
      g.strokeStyle = on ? ink : 'rgba(0, 0, 0, 0.35)';
      g.stroke();
      if (rh >= 12 && x1 - x0 >= 26) { // its name, when there is room
        g.fillStyle = inkFor(color);
        g.globalAlpha = 0.85 * dim;
        g.fillText(prettyNote(midiName(v.m)), x0 + 4, y0 + rh / 2 + 0.5);
        g.globalAlpha = 1;
      }
    });

    // the drag across empty space
    if (ed.box) {
      const bx0 = (ed.box.b0 - view.start) * ppb, bx1 = (ed.box.b1 - view.start) * ppb;
      const by0 = (ed.top - ed.box.pTop) * rh, by1 = (ed.top - ed.box.pBot) * rh;
      g.fillStyle = g.strokeStyle = ink;
      g.globalAlpha = 0.08;
      g.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
      g.globalAlpha = 0.7;
      g.lineWidth = 1;
      g.setLineDash([4, 3]);
      g.strokeRect(Math.round(bx0) + 0.5, Math.round(by0) + 0.5, Math.round(bx1 - bx0), Math.round(by1 - by0));
      g.setLineDash([]);
      g.globalAlpha = 1;
    }

    // where Paste goes: a dashed line, flagged at the top
    const cx = Math.round((ed.caret - view.start) * ppb) + 0.5;
    if (cx >= 0 && cx <= l.w) {
      g.strokeStyle = g.fillStyle = ink;
      g.globalAlpha = 0.65;
      g.lineWidth = 1.5;
      g.setLineDash([5, 4]);
      g.beginPath();
      g.moveTo(cx, 0);
      g.lineTo(cx, l.h);
      g.stroke();
      g.setLineDash([]);
      g.globalAlpha = 0.9;
      g.beginPath();
      g.moveTo(cx - 5, 0);
      g.lineTo(cx + 5, 0);
      g.lineTo(cx, 6);
      g.closePath();
      g.fill();
      if (clipboard) {
        g.font = '800 10px Nunito, system-ui, sans-serif';
        g.textBaseline = 'top';
        g.fillText('Paste', cx + 7, 2);
      }
      g.globalAlpha = 1;
    }
    if (!views.length && !ed.box) {
      g.fillStyle = cssVar('--text-3');
      g.font = '700 13px Nunito, system-ui, sans-serif';
      g.textBaseline = 'middle';
      g.fillText(clipboard ? 'No notes yet: Paste puts the copied ones at the dashed line.' : 'No notes on this track yet.', 12, l.h / 2);
    }
    drawLadder();
  }

  // The piano's keys along the rows: names on the Cs; the rows the
  // highlighted notes are on marked in their colours.
  function drawLadder() {
    if (!ed) return;
    const box = ed.ladder, cv = box.querySelector('canvas');
    const w = box.clientWidth, h = box.clientHeight, dpr = window.devicePixelRatio || 1;
    if (!w || !h) return;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const rh = ed.rowH, mTop = Math.ceil(ed.top), mBot = Math.ceil(ed.top - h / rh);
    const marked = new Set();
    const clips = ed.preview ? ed.preview.clips : P.tracks[ed.i].clips, sel = ed.preview ? ed.preview.sel : ed.sel;
    clips.forEach(c => c.items.forEach(n => { if (sel.has(n)) marked.add(n.m); }));
    g.fillStyle = '#eceef3';
    g.fillRect(0, 0, w, h);
    for (let m = mBot; m <= mTop; m++) {
      const y = rowY(m), pc = mod(m, 12);
      if (m < ed.lo || m > ed.hi) { g.fillStyle = '#9aa0ad'; g.fillRect(0, y, w, rh); continue; }
      if (ed.heard === m) { g.fillStyle = noteColor(pc); g.fillRect(0, y, w, rh); }
      if (BLACK.has(pc)) {
        g.fillStyle = ed.heard === m ? noteColor(pc) : '#262a33';
        g.fillRect(0, y + 0.5, w * 0.62, rh - 1);
      } else if (pc === 0 || pc === 5) { // the gap between E and F, B and C
        g.fillStyle = 'rgba(0, 0, 0, 0.28)';
        g.fillRect(0, Math.round(y + rh) - 1, w, 1);
      }
      if (marked.has(m)) { g.fillStyle = noteColor(pc); g.fillRect(w - 6, y + 1, 5, rh - 2); }
      if (pc === 0 && rh >= 8) {
        g.fillStyle = '#3a3f4b';
        g.font = `800 ${clamp(rh - 2, 8, 11)}px Nunito, system-ui, sans-serif`;
        g.textBaseline = 'middle';
        g.textAlign = 'right';
        g.fillText('C' + (m / 12 - 1), w - 9, y + rh / 2 + 0.5);
        g.textAlign = 'left';
      }
    }
  }

  // -- leaving the page with changes not saved: the browser asks first --
  window.addEventListener('beforeunload', (e) => {
    if (!editChanged()) return;
    e.preventDefault();
    e.returnValue = '';
  });

  // -------- THE QUANTIZE BUTTON --------
  // The first press asks for the choices (Confirm turns it on); after that it
  // says Quantize with a pencil beside it, which asks again. On, each take is
  // put on the rhythm as it is kept; off, takes stay as played — and what is
  // already quantized stays so (Undo takes that back). With a part
  // highlighted the button speaks for that part: off while it is as played,
  // and pressed then, it asks to quantize it. "The entire song" quantizes
  // every part on every track, whenever Quantize is turned on with it.
  const qWrap = el('rec-quant'), qBtn = el('rec-quant-btn'), qEdit = el('rec-quant-edit');
  const qOk = el('quant-ok'), qAlt = el('quant-alt'), qAll = el('quant-all');
  let qMode = null; // what the sheet asks: 'setup' (the first time), 'edit' (the pencil), 'part' (the highlighted part)
  const qRadio = (name, v) => document.querySelector(`input[name="${name}"][value="${v}"]`);

  function barOf(b) {
    const bar = Math.floor(b / barBeats() + 1e-6) + 1;
    return bar < 1 ? 'the pick-up' : 'bar ' + bar;
  }
  function renderQuant() {
    if (!P) return;
    const L = quantLock(), fixed = el('rec-quant-fixed');
    if (L) { // (short, to fit the bar: the whole of it in the title)
      const q = P.quant, feel = feelFits(q.grid, q.feel) ? q.feel : 'none';
      const unit = q.grid === 4 ? (P.meter === '6/8' ? 'beats' : 'quarters') : q.grid === 8 ? '8ths' : '16ths';
      const text = document.createElement('span');
      text.className = 'rq-text';
      text.innerHTML = '<small>Quantize</small>';
      text.append(L.on ? unit + { none: '', swing8: ' swung', swing16: ' swung', triplets: ' + triplets' }[feel] : 'Off');
      fixed.innerHTML = LOCK_SVG;
      fixed.append(text);
      fixed.title = L.on ? `Set by this lesson: every note you record lands on ${quantWords(P.quant)}.` : 'Set by this lesson: what you record stays just as you played it.';
    }
    const Q = P.quant, part = selPart() && sel.c; // (a locked track's part: as if none were highlighted)
    const lit = Q.on && (!part || !!part.q);
    qBtn.setAttribute('aria-pressed', String(lit));
    qWrap.classList.toggle('set', Q.set);
    qWrap.classList.toggle('on', lit);
    qEdit.hidden = !Q.set;
    qBtn.disabled = qEdit.disabled = busy() && !ed;
    qBtn.title = ed && Q.set ? (Q.on
        ? `On: notes you move land on the beat lines, and new recordings on ${quantWords(Q)}. Press to move notes freely.`
        : `Off: notes you move go just where you put them. Press to snap them to the beat lines (and quantize the highlighted notes to ${quantWords(Q)}).`)
      : !Q.set ? 'Quantize: recorded notes land exactly on the beat'
      : part && !part.q ? 'This part is as you played it: press to quantize it'
      : part ? `This part is quantized to ${quantWords(part.q)}. ` + (Q.on ? 'Press to stop quantizing new recordings (this part stays).' : 'Press to quantize new recordings too.')
      : Q.on ? `On: new recordings land on ${quantWords(Q)}. Press to turn it off.`
      : `Off: new recordings stay as played. Press to quantize them to ${quantWords(Q)}.`;
  }

  // The sheet: its choices, and the swing that does not fit them greyed out.
  const choice = () => ({
    grid: +(document.querySelector('input[name="quant-grid"]:checked') || { value: 8 }).value,
    feel: (document.querySelector('input[name="quant-feel"]:checked') || { value: 'none' }).value,
    all: qAll.checked
  });
  function renderQuantSheet() {
    const c = choice();
    FEELS.forEach(f => {
      const r = qRadio('quant-feel', f), fits = feelFits(c.grid, f);
      r.disabled = !fits;
      r.closest('.chip').classList.toggle('off', !fits);
    });
    if (!feelFits(c.grid, c.feel)) qRadio('quant-feel', 'none').checked = true;
    el('quant-feel-note').textContent = P.meter === '6/8'
      ? '6/8 already goes in threes: Quarter keeps to its beat (a dotted quarter), and swing and triplets stay off.'
      : c.grid === 4 ? 'Swing needs the 8th or 16th rhythm.' : c.grid === 8 ? 'Swing 16th needs the 16th rhythm.' : '';
    if (qMode === 'part') {
      qOk.textContent = c.all ? 'Quantize the entire song' : 'Quantize this part';
      qAlt.hidden = c.all;
    }
  }
  function openQuant(mode) {
    qMode = mode;
    const Q = P.quant, part = mode === 'part' && selPart();
    qRadio('quant-grid', Q.grid).checked = true;
    qRadio('quant-feel', Q.feel).checked = true;
    qAll.checked = Q.all;
    el('quant-title').textContent = part ? 'Quantize this part?' : mode === 'edit' ? 'Quantize choices' : 'Quantize';
    el('quant-intro').textContent = part
      ? `The part on track ${part.i + 1}, at ${barOf(part.c.b)}, is as you played it. Quantize puts its notes exactly on the rhythm below.`
      : 'Notes you record land exactly on the rhythm below: where each note starts moves, its length stays.';
    qOk.textContent = part ? 'Quantize this part' : 'Confirm';
    qAlt.hidden = !part;
    // in the note editor it speaks for the highlighted notes, not the whole song
    qAll.closest('.quant-all').hidden = !!ed;
    if (ed && mode === 'setup') el('quant-intro').textContent = 'With Quantize on, notes you move land on the beat lines, the highlighted notes go onto the rhythm below, and so do notes you record.';
    renderQuantSheet();
    openSheet('quant-sheet');
  }
  document.querySelectorAll('input[name="quant-grid"], input[name="quant-feel"], #quant-all')
    .forEach(r => r.addEventListener('change', renderQuantSheet));

  function quantizeSong() {
    const Q = P.quant;
    const open = P.tracks.filter((tr, i) => !trackLocked(i)); // a lesson's locked tracks stay as the teacher left them
    if (!open.some(tr => tr.clips.length)) { toast(`Quantize is on: new recordings land on ${quantWords(Q)}.`); return; }
    if (open.every(tr => tr.clips.every(c => sameQ(c.q, Q)))) { toast(`Quantize is on: the whole song is on ${quantWords(Q)}.`); return; }
    pushUndo('quantizing the whole song');
    open.forEach(tr => { tr.clips.forEach(c => quantizePart(c, Q)); partsView(tr); });
    renderAll();
    save();
    toast(`The whole song is quantized to ${quantWords(Q)}. Undo takes it back.`);
  }
  function quantizeOne(s) {
    pushUndo(`quantizing the part on track ${s.i + 1}`);
    quantizePart(s.c, P.quant);
    partsView(P.tracks[s.i]);
    renderAll();
    save();
    toast(`Quantized to ${quantWords(P.quant)}. Undo takes it back.`);
  }

  qOk.addEventListener('click', () => {
    if (quantLock()) { closeSheet('quant-sheet'); return; }
    const c = choice(), Q = P.quant, part = qMode === 'part' && selPart();
    Object.assign(Q, { grid: c.grid, feel: c.feel, all: c.all, set: true });
    if (qMode !== 'edit') Q.on = true; // the pencil only changes the choices
    closeSheet('quant-sheet');
    if (ed) { renderQuant(); renderEditBar(); queueDraw(); save(); if (qMode !== 'edit') quantizeSelected(); return; }
    if (Q.on && Q.all) quantizeSong();
    else if (part) quantizeOne(part);
    else if (qMode === 'edit' && !Q.on) toast('Saved. Quantize stays off until you turn it on.');
    else toast(`Quantize is on: new recordings land on ${quantWords(Q)}.`);
    renderQuant();
    save();
  });
  // "Not this part": Quantize on for what is recorded next, the part left as played
  qAlt.addEventListener('click', () => {
    if (quantLock()) { closeSheet('quant-sheet'); return; }
    const c = choice();
    Object.assign(P.quant, { grid: c.grid, feel: c.feel, all: false, set: true, on: true });
    closeSheet('quant-sheet');
    toast(`Quantize is on for new recordings (${quantWords(P.quant)}). This part stays as played.`);
    renderQuant();
    save();
  });

  qBtn.addEventListener('click', () => {
    if (quantLock()) return; // (hidden: the lesson keeps it)
    if (ed) { editQuantPress(); return; }
    if (busy()) return;
    const Q = P.quant, part = selPart() && sel.c;
    if (part && !part.q) { openQuant('part'); return; }
    if (!Q.set) { openQuant('setup'); return; }
    Q.on = !Q.on;
    if (Q.on && Q.all) quantizeSong();
    else if (Q.on) toast(`Quantize is on: new recordings land on ${quantWords(Q)}.`);
    else toast(P.tracks.some(tr => tr.clips.some(c => c.q))
      ? 'Quantize is off: new recordings stay as played. What is quantized stays so (Undo takes it back).'
      : 'Quantize is off: new recordings stay as played.');
    renderQuant();
    save();
  });
  qEdit.addEventListener('click', () => { if (!quantLock() && (!busy() || ed)) openQuant('edit'); });

  // In the note editor the button turns snapping on and off: on, notes moved
  // land on the beat lines; turned on with notes highlighted that are off
  // the rhythm, those go onto it (one step of the editor's Undo). It is the
  // same switch as for recording: on here, new takes are quantized too.
  function editQuantPress() {
    if (quantLock()) return;
    const Q = P.quant;
    if (!Q.set) { openQuant('setup'); return; }
    Q.on = !Q.on;
    renderQuant();
    renderEditBar();
    queueDraw();
    save();
    if (Q.on) quantizeSelected();
    else toast('Quantize off: notes you move go just where you put them.');
  }
  function quantizeSelected() {
    const Q = P.quant, snap = snapper(Q), vs = selViews();
    const off = vs.filter(v => Math.abs(snap(v.b) - v.b) > 1e-6);
    if (!off.length) {
      toast(vs.length ? `Quantize on: the highlighted notes are already on ${quantWords(Q)}.` : 'Quantize on: notes you move land on the beat lines.');
      return;
    }
    commitEdit(applyEdit({ kind: 'quant', snap }));
    toast(`Quantized ${off.length === 1 ? 'the note' : off.length + ' notes'} to ${quantWords(Q)}. Undo takes it back.`);
  }

  // -------- NARROWER TRACK CONTROLS --------
  // The handle between the controls and the lanes drags them narrower (and
  // wider again), settling on the nearest of the three; a click on it goes to
  // the next. Kept per device.
  function setHead(h) {
    if (!HEADS.includes(h)) return;
    const changed = h !== head;
    head = h;
    dock.dataset.head = h;
    tracksEl.style.setProperty('--head-w', HEAD_W[h] + 'px');
    if (grip) {
      grip.setAttribute('aria-valuenow', String(HEADS.length - HEADS.indexOf(h)));
      grip.setAttribute('aria-valuetext', { full: 'All the track controls', name: 'Number, sound, mute and loop', small: 'Number, mute and loop' }[h]);
    }
    if (!changed) return;
    try { localStorage.setItem(HEAD_KEY, h); } catch (e) {}
    if (R.open) { sizeLanes(); drawAll(); }
  }
  function makeGrip() {
    const g = document.createElement('div');
    g.className = 'rec-grip';
    g.tabIndex = 0;
    g.setAttribute('role', 'separator');
    g.setAttribute('aria-orientation', 'vertical');
    g.setAttribute('aria-label', 'Track controls: drag narrower or wider');
    g.setAttribute('aria-valuemin', '1');
    g.setAttribute('aria-valuemax', String(HEADS.length));
    g.title = 'Drag to show fewer or more track controls';
    g.innerHTML = '<span class="rec-grip-pill"></span>';
    g.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      const id = e.pointerId, x0 = e.clientX, from = HEAD_W[head];
      let moved = false;
      try { g.setPointerCapture(id); } catch (err) {}
      g.classList.add('dragging');
      const move = (ev) => {
        if (ev.pointerId !== id) return;
        if (!moved && Math.abs(ev.clientX - x0) < 4) return;
        moved = true;
        const want = from + ev.clientX - x0;
        setHead(HEADS.reduce((a, h) => Math.abs(HEAD_W[h] - want) < Math.abs(HEAD_W[a] - want) ? h : a));
      };
      const up = (ev) => {
        if (ev.pointerId !== id) return;
        g.removeEventListener('pointermove', move);
        g.removeEventListener('pointerup', up);
        g.removeEventListener('pointercancel', up);
        g.classList.remove('dragging');
        if (!moved && ev.type === 'pointerup') setHead(HEADS[(HEADS.indexOf(head) + 1) % HEADS.length]);
      };
      g.addEventListener('pointermove', move);
      g.addEventListener('pointerup', up);
      g.addEventListener('pointercancel', up);
    });
    g.addEventListener('keydown', (e) => {
      const k = HEADS.indexOf(head);
      if (e.key === 'ArrowLeft') setHead(HEADS[Math.min(HEADS.length - 1, k + 1)]);
      else if (e.key === 'ArrowRight') setHead(HEADS[Math.max(0, k - 1)]);
      else if (e.key === 'Enter' || e.key === ' ') setHead(HEADS[(k + 1) % HEADS.length]);
      else return;
      e.preventDefault();
      e.stopPropagation();
    });
    return g;
  }

  function buildTracks() {
    tracksEl.innerHTML = '';
    const rulerRow = document.createElement('div');
    rulerRow.className = 'rec-row rec-ruler-row';
    makeZoomUI();
    const ruler = makeLane('rec-ruler');
    rulerRow.append(zoomUI.corner, ruler.wrap);
    tracksEl.appendChild(rulerRow);
    lanes.length = 0;
    lanes.push(ruler);
    ctls.length = 0;

    for (let i = 0; i < TRACKS; i++) {
      const row = document.createElement('div');
      row.className = 'rec-row rec-track';
      row.style.setProperty('--tc', TRACK_COLORS[i]);
      const ctl = document.createElement('div');
      ctl.className = 'rec-ctl';

      const arm = document.createElement('button');
      arm.type = 'button';
      arm.className = 'rec-arm';
      arm.innerHTML = `<span class="rec-arm-dot"></span><span class="rec-arm-lock">${LOCK_SVG}</span><span class="rec-arm-num">${i + 1}</span>`;
      arm.setAttribute('aria-label', `Record onto track ${i + 1}`);
      arm.title = 'Record onto this track';
      arm.addEventListener('click', () => {
        if (trackLocked(i)) { lockedToast(i); return; }
        if (busy()) return;
        R.armed = i; adoptSound(); renderCtls(); renderTransport(); drawAll();
      });

      const sound = document.createElement('select');
      sound.className = 'select rec-sound';
      sound.innerHTML = soundSelect.innerHTML; // the keyboard's own list, groups and all
      sound.setAttribute('aria-label', `Track ${i + 1} sound`);
      sound.addEventListener('change', () => {
        P.tracks[i].sound = sound.value;
        if (i === R.armed) { currentSound = sound.value; renderChrome(); }
        sound.blur(); // hand the computer keyboard back to the piano
        save();
      });

      const mute = document.createElement('button');
      mute.type = 'button';
      mute.className = 'rec-icon-btn rec-mute';
      mute.addEventListener('click', () => {
        P.tracks[i].muted = !P.tracks[i].muted;
        applyLevels();
        renderCtl(i);
        drawLane(i);
        save();
      });

      const vol = document.createElement('input');
      vol.type = 'range';
      vol.className = 'rec-vol';
      vol.min = 0; vol.max = 100; vol.step = 1;
      vol.setAttribute('aria-label', `Track ${i + 1} volume`);
      vol.addEventListener('input', () => { P.tracks[i].volume = vol.value / 100; applyLevels(); save(); });

      const loop = document.createElement('button');
      loop.type = 'button';
      loop.className = 'rec-icon-btn rec-loop';
      loop.innerHTML = ICONS.loop;
      loop.addEventListener('click', () => setLoop(i, !P.tracks[i].loop));

      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'rec-icon-btn rec-clear';
      clear.innerHTML = ICONS.clear;
      clear.setAttribute('aria-label', `Clear track ${i + 1}`);
      clear.title = 'Clear this track (Undo brings it back)';
      clear.addEventListener('click', () => {
        if (busy() || !P.tracks[i].clips.length) return;
        if (trackLocked(i)) { lockedToast(i); return; }
        pushUndo('clearing track ' + (i + 1));
        P.tracks[i].clips = [];
        P.tracks[i].notes = [];
        afterProjectChange();
        toast(`Track ${i + 1} cleared. Undo brings it back.`);
      });

      // the note editor's piano keys, in the controls' place while it is open
      const ladder = document.createElement('div');
      ladder.className = 'rec-ladder';
      ladder.title = 'Press a key to hear it; drag up or down for higher or lower notes';
      ladder.appendChild(document.createElement('canvas'));
      ladder.addEventListener('pointerdown', ladderPress);

      ctl.append(arm, sound, mute, vol, loop, clear, ladder);
      const lane = makeLane('rec-track-lane', i);
      row.append(ctl, lane.wrap);
      tracksEl.appendChild(row);
      lanes.push(lane);
      ctls.push({ row, arm, sound, mute, vol, loop, clear, ladder });
    }
    tracksEl.appendChild(zoomUI.row);
    grip = makeGrip();
    tracksEl.appendChild(grip);
    setHead(head);
  }

  function renderCtl(i) {
    const c = ctls[i], tr = P.tracks[i];
    const armed = i === R.armed;
    c.row.classList.toggle('armed', armed);
    c.row.classList.toggle('taking', armed && R.state === 'recording');
    c.row.classList.toggle('muted', tr.muted);
    c.arm.setAttribute('aria-pressed', String(armed));
    c.sound.value = tr.sound;
    c.mute.innerHTML = tr.muted ? ICONS.muted : ICONS.mute;
    c.mute.setAttribute('aria-pressed', String(tr.muted));
    c.mute.setAttribute('aria-label', `${tr.muted ? 'Unmute' : 'Mute'} track ${i + 1}`);
    c.mute.title = tr.muted ? 'Muted: not heard, and left out of song files' : 'Mute';
    c.vol.value = Math.round(tr.volume * 100);
    c.loop.setAttribute('aria-pressed', String(tr.loop));
    c.loop.setAttribute('aria-label', `Loop track ${i + 1}`);
    c.loop.title = tr.loop ? 'Looping: drag the end of a part out to repeat it' : 'Loop: make this track’s parts repeat when dragged out';
    c.loop.disabled = busy();
    c.clear.disabled = !tr.clips.length || busy();
    c.arm.disabled = busy() && !armed;
    // a lesson's locked track: a lock in place of the record dot; the loop shows, but stays as it is
    const locked = trackLocked(i);
    c.row.classList.toggle('locked', locked);
    c.arm.classList.toggle('locked', locked);
    c.arm.setAttribute('aria-disabled', String(locked));
    if (locked) {
      c.arm.setAttribute('aria-label', `Track ${i + 1}, locked by the lesson`);
      c.arm.title = 'Locked by the lesson: play along with it, mute it, or pull its loop longer or shorter';
      c.loop.disabled = true;
      c.loop.title = tr.loop ? 'Loops (locked by the lesson): drag the end of a part to repeat it more or fewer times' : 'Plays straight through (locked by the lesson)';
    } else {
      c.arm.setAttribute('aria-label', `Record onto track ${i + 1}`);
      c.arm.title = 'Record onto this track';
    }
    lanes[i + 1].wrap.title = ed ? '' : locked ? 'The lesson’s track: drag the end of a loop to repeat it more or fewer times' : 'Double-click to open this track and edit its notes';
  }
  function renderCtls() { for (let i = 0; i < TRACKS; i++) renderCtl(i); }

  function sizeLanes() {
    const dpr = window.devicePixelRatio || 1;
    lanes.forEach(l => {
      const w = l.wrap.clientWidth, h = l.wrap.clientHeight;
      if (!w || !h) return;
      l.canvas.width = Math.round(w * dpr);
      l.canvas.height = Math.round(h * dpr);
      l.w = w; l.h = h; l.dpr = dpr;
    });
  }

  function cssVar(name) { return getComputedStyle(dock).getPropertyValue(name).trim(); }

  function drawRuler() {
    const l = lanes[0];
    if (!l.w) return;
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    const ppb = pxPerBeat(l.w), bpb = barBeats();
    const every = [1, 2, 4, 8, 16, 32].find(n => n * bpb * ppb >= 26) || 64;
    g.font = '800 11px Nunito, system-ui, sans-serif';
    g.textBaseline = 'middle';
    // zoomed in: a tick a beat, and (with room) each beat's number after its bar's
    if (ppb >= 14) {
      g.font = '700 10px Nunito, system-ui, sans-serif';
      for (let b = Math.ceil(view.start); b < view.end; b++) {
        if (isDownbeat(b)) continue;
        const x = (b - view.start) * ppb;
        g.fillStyle = cssVar('--line-strong');
        g.fillRect(Math.round(x), l.h - 4, 1, 4);
        const bar = Math.floor(b / bpb) + 1;
        if (ppb >= 44 && bar >= 1) {
          g.fillStyle = cssVar('--text-3');
          g.globalAlpha = 0.7;
          g.fillText(`${bar}.${b - (bar - 1) * bpb + 1}`, x + 3, l.h / 2 - 1);
          g.globalAlpha = 1;
        }
      }
      g.font = '800 11px Nunito, system-ui, sans-serif';
    }
    let first = Infinity;
    for (let b = Math.ceil(view.start / bpb) * bpb; b < view.end; b += bpb) {
      const bar = b / bpb + 1;
      const x = (b - view.start) * ppb;
      g.fillStyle = cssVar('--line-strong');
      g.fillRect(Math.round(x), l.h - 7, 1, 7);
      if (bar >= 1 && (bar - 1) % every === 0) {
        g.fillStyle = cssVar('--text-3');
        g.fillText(String(bar), x + 4, l.h / 2 - 1);
        first = Math.min(first, x);
      }
    }
    // zoomed in past a bar line: which bar this is stays in sight at the left
    const here = Math.floor(view.start / bpb) + 1;
    if (win && here >= 1 && first > 34 && ppb < 44) {
      g.fillStyle = cssVar('--text-3');
      g.globalAlpha = 0.7;
      g.fillText(String(here), 4, l.h / 2 - 1);
      g.globalAlpha = 1;
    }
  }

  function drawLane(i) {
    const l = lanes[i + 1];
    if (!l || !l.w) return;
    if (ed) { if (ed.i === i) drawEditor(l); return; } // the note editor: its track alone, opened out
    const tr = P.tracks[i];
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    const ppb = pxPerBeat(l.w), bpb = barBeats();

    // bar lines, and beats when there is room for them
    g.fillStyle = cssVar('--line');
    for (let b = Math.ceil(view.start); b < view.end; b++) {
      const bar = isDownbeat(b);
      if (!bar && ppb < 9) continue;
      g.globalAlpha = bar ? 1 : 0.45;
      g.fillRect(Math.round((b - view.start) * ppb), 0, 1, l.h);
    }
    // zoomed in further: the finer lines a dragged part snaps to, fainter still
    const step = snapGrid(ppb);
    if (step < 1) {
      g.globalAlpha = 0.2;
      for (let k = Math.ceil(view.start / step); k * step < view.end; k++) {
        const b = k * step;
        if (Math.abs(b - Math.round(b)) < 1e-6) continue;
        g.fillRect(Math.round((b - view.start) * ppb), 0, 1, l.h);
      }
    }
    g.globalAlpha = 1;
    if (view.start < 0) { // the pick-up bar, shaded
      g.fillStyle = cssVar('--line');
      g.fillRect(0, 0, (0 - view.start) * ppb, l.h);
    }

    const taking = run && run.recording && run.armed === i;
    let notes = tr.notes;
    let fresh = [];
    if (taking) {
      const now = heardBeat(run);
      fresh = run.take.concat([...run.held.values()].map(h => ({ m: h.m, b: h.b, d: Math.max(MIN_HOLD, now - h.b) })));
    }
    const base = tr.muted ? 0.3 : 1;
    drawParts(i, l, g, ppb, base);
    const hidden = hiddenOf(i);
    const all = notes.concat(fresh, hidden);
    if (!all.length) {
      if (tr.clips.length) return;
      g.fillStyle = cssVar('--text-3');
      g.font = '700 12px Nunito, system-ui, sans-serif';
      g.textBaseline = 'middle';
      g.fillText(i === R.armed ? 'Empty: press ● to record here' : 'Empty', 10, l.h / 2);
      return;
    }
    let lo = Infinity, hi = -Infinity;
    all.forEach(n => { if (n.m < lo) lo = n.m; if (n.m > hi) hi = n.m; });
    if (hi - lo < 12) { const mid = (lo + hi) / 2; lo = mid - 6; hi = mid + 6; }
    const pad = 4, span = hi - lo;
    const nh = Math.max(3, Math.min(7, (l.h - 2 * pad) / (span + 1)));
    const y = m => pad + (hi - m) / span * (l.h - 2 * pad - nh);
    const paint = (n, alpha) => {
      g.globalAlpha = alpha;
      g.fillStyle = noteColor(n.m % 12);
      const x = (n.b - view.start) * ppb;
      g.fillRect(x, y(n.m), Math.max(2, n.d * ppb - 1), nh);
    };
    hidden.forEach(n => paint(n, 0.25 * base)); // what a part being sized leaves out: its end can open it up again
    // while a take goes on, what it will replace is shown faint
    notes.forEach(n => paint(n, taking && n.b >= run.from - run.count ? 0.25 : base));
    fresh.forEach(n => paint(n, 1));
    g.globalAlpha = 1;
  }

  // Each part: a box in the track's colour, with a grip at each end (what a
  // press there sizes). A loop shows where each pass begins, and its sign.
  function boxPath(g, x, y, w, h, r) {
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
    else g.rect(x, y, w, h);
  }
  function loopSign(g, cx, cy) {
    const r = 4.2;
    g.lineWidth = 1.6;
    g.beginPath();
    g.arc(cx, cy, r, -0.15 * Math.PI, 1.55 * Math.PI);
    g.stroke();
    const a = 1.55 * Math.PI, ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a);
    g.beginPath(); // the arrow's head, pointing on round
    g.moveTo(ex + 3.2, ey);
    g.lineTo(ex - 1.2, ey - 2.6);
    g.lineTo(ex - 1.2, ey + 2.6);
    g.closePath();
    g.fill();
  }
  function drawParts(i, l, g, ppb, base) {
    const tr = P.tracks[i], col = TRACK_COLORS[i];
    const top = 3, h = l.h - 6;
    g.fillStyle = g.strokeStyle = col;
    // the part being sized (a straight one): how far its ends can open
    if (edit && edit.i === i && !edit.c.loop) {
      const c = edit.c, x0 = (c.b - c.o - view.start) * ppb;
      g.globalAlpha = 0.45 * base;
      g.lineWidth = 1;
      g.setLineDash([3, 3]);
      boxPath(g, x0 + 1.5, top + 0.5, c.len * ppb - 3, h - 1, 5);
      g.stroke();
      g.setLineDash([]);
    }
    tr.clips.forEach(c => {
      const x0 = (c.b - view.start) * ppb, x1 = x0 + c.d * ppb;
      if (x1 < 0 || x0 > l.w) return;
      const w = Math.max(4, x1 - x0);
      const picked = sel && sel.c === c;
      g.globalAlpha = (edit && edit.c === c ? 0.22 : picked ? 0.26 : 0.14) * base;
      boxPath(g, x0 + 1, top, w - 2, h, 5);
      g.fill();
      if (picked) { // highlighted: a heavier edge, ringed in the page's ink
        g.globalAlpha = 0.9;
        g.strokeStyle = cssVar('--text');
        g.lineWidth = 1;
        boxPath(g, x0 + 0.5, top - 0.5, w - 1, h + 1, 6);
        g.stroke();
        g.strokeStyle = col;
      }
      g.globalAlpha = (picked ? 1 : 0.85) * base;
      g.lineWidth = picked ? 2.5 : 1.5;
      boxPath(g, x0 + 1.75, top + 0.75, w - 3.5, h - 1.5, 5);
      g.stroke();
      if (w > 14) { // the grips (a locked part: only a loop's end, the one it can be pulled by)
        const locked = trackLocked(i);
        if (!locked) g.fillRect(Math.round(x0) + 4, l.h / 2 - 7, 2, 14);
        if (!locked || c.loop) g.fillRect(Math.round(x1) - 6, l.h / 2 - 7, 2, 14);
      }
      if (c.q && w > 26) { // quantized: a little comb, the grid it sits on
        g.globalAlpha = 0.85 * base;
        const qx = Math.round(x0) + 7, qy = top + 4;
        g.fillRect(qx, qy + 6, 11, 1.5);
        for (let k = 0; k < 4; k++) g.fillRect(qx + k * 3.2, qy, 1.5, 6);
      }
      if (c.loop) {
        g.globalAlpha = 0.6 * base;
        g.lineWidth = 1;
        g.setLineDash([3, 3]);
        g.beginPath();
        for (let t = c.loop - mod(c.o, c.loop); t < c.d - 1e-6; t += c.loop) {
          const x = Math.round(x0 + t * ppb) + 0.5;
          g.moveTo(x, top + 3);
          g.lineTo(x, top + h - 3);
        }
        g.stroke();
        g.setLineDash([]);
        if (w > 30) { g.globalAlpha = 0.9 * base; loopSign(g, x1 - 14, top + 9); }
      }
    });
    g.globalAlpha = 1;
  }
  // What the box of a straight part being sized leaves out, in the song's beats.
  function hiddenOf(i) {
    if (!edit || edit.i !== i || edit.c.loop) return [];
    const c = edit.c, end = c.o + c.d;
    return c.items.filter(n => n.b < c.o - EARLY || n.b >= end - 1e-6).map(n => ({ m: n.m, b: c.b + n.b - c.o, d: n.d }));
  }

  function drawAll() {
    renderZoom();
    drawRuler();
    for (let i = 0; i < TRACKS; i++) drawLane(i);
    setHeads(run ? heardBeat(run) : R.pos);
  }

  function setHeads(beat) {
    lanes.forEach(l => {
      if (!l.w) return;
      const x = (beat - view.start) * pxPerBeat(l.w);
      l.head.style.transform = `translateX(${x}px)`;
      l.head.style.visibility = x < 0 || x > l.w ? 'hidden' : '';
    });
  }

  function renderPos() {
    if (!run) setHeads(R.pos);
  }

  // -------- CONTROLS --------
  function renderTransport() {
    const playing = R.state === 'playing' || (R.state === 'priming' && R.priming === 'playing');
    const recording = R.state === 'recording' || (R.state === 'priming' && R.priming === 'recording');
    playBtn.classList.toggle('on', busy());
    playBtn.innerHTML = busy()
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
    playBtn.setAttribute('aria-label', busy() ? 'Stop' : 'Play');
    playBtn.title = busy() ? 'Stop (Space)' : 'Play (Space)';
    recordBtn.classList.toggle('on', recording);
    recordBtn.setAttribute('aria-pressed', String(recording));
    recordBtn.setAttribute('aria-label', recording ? 'Stop recording' : `Record onto track ${R.armed + 1}`);
    recordBtn.title = recording ? 'Stop recording' : `Record onto track ${R.armed + 1}`;
    dock.classList.toggle('is-recording', recording);
    dock.classList.toggle('is-playing', playing);
    homeBtn.disabled = busy();
    [tempoInput, meterSelect, countInBtn, el('rec-tempo-down'), el('rec-tempo-up')].forEach(c => { c.disabled = busy(); });
    recordBtn.disabled = !!ed || allLocked(); // the note editor open (or a lesson with every track locked): no recording
    if (ed) { // Undo steps back through the changes to the notes
      undoBtn.disabled = !ed.undo.length;
      undoBtn.title = ed.undo.length ? `Undo the last change to these notes (${MOD_KEY}Z)` : 'No changes to undo yet';
    } else {
      undoBtn.disabled = busy() || !undo.length;
      undoBtn.title = undo.length ? 'Undo ' + undo[undo.length - 1].label : 'Nothing to undo';
    }
    renderQuant();
  }

  function renderSettings() {
    tempoInput.value = P.tempo;
    meterSelect.value = P.meter;
    // locked by a lesson: plain text (body.lock-tempo / lock-meter, styles.css)
    el('rec-tempo-fixed').innerHTML = `${LOCK_SVG}<span>${P.tempo} bpm</span>`;
    el('rec-meter-fixed').innerHTML = `${LOCK_SVG}<span>${P.meter}</span>`;
    countInBtn.setAttribute('aria-pressed', String(P.countIn));
    clickSelect.value = P.click;
    clickWord.textContent = CLICK_WORDS[P.click];
    clickFace.classList.toggle('off', P.click === 'off');
    clickFace.title = 'Metronome: ' + clickSelect.selectedOptions[0].textContent.toLowerCase(); // (narrow screens hide the word)
  }

  // The tracks scroll in the room the keyboard leaves them: the track being
  // recorded onto is brought into sight.
  function showTrack(i) {
    const c = ctls[i];
    if (!c) return;
    const box = scrollEl.getBoundingClientRect(), r = c.row.getBoundingClientRect();
    const top = lanes[0] ? lanes[0].wrap.getBoundingClientRect().bottom : box.top; // under the ruler, which stays put
    if (r.top < top) scrollEl.scrollTop -= top - r.top + 4;
    else if (r.bottom > box.bottom) scrollEl.scrollTop += r.bottom - box.bottom + 4;
  }

  function renderTiming() {
    const d = storedDelay();
    const ms = delayMs();
    const text = d ? `${ms >= 0 ? '' : '−'}${Math.abs(ms)} ms` : 'not measured';
    timingBtn.innerHTML = `Timing: ${text} · <u>Calibrate</u>`;
    timingBtn.title = 'Headphones or speakers changed? Calibrate again.';
    const s = el('set-delay');
    if (s) s.textContent = d ? `Recordings are moved ${Math.abs(ms)} ms ${ms >= 0 ? 'earlier' : 'later'} (${d.how === 'test' ? 'measured' : 'set by hand'}).` : 'Not measured on this device yet.';
    renderCal();
  }

  function renderAll() {
    if (!P) return;
    checkSel();
    fitView();
    renderSettings();
    renderQuant();
    renderCtls();
    renderTransport();
    renderTiming();
    renderEditBar();
    sizeLanes();
    drawAll();
    renderPos();
  }

  // RECORD MODE. Open, the recorder sits on top and the keyboard at the
  // bottom of the screen; the tracks scroll in the room between. The quick
  // row's octaves, Focus, Flex and Key Names join the recorder's bar (its
  // sound menu goes: each track has its own), and the Record button takes
  // the view switch's place in the top bar — pressed again, everything goes
  // back. The piano shows while recording; a computer-keyboard view comes
  // back afterwards.
  const quickbar = el('quickbar');
  const recKeys = el('rec-keys');
  const viewSeg = document.querySelector('#topbar .view-seg');
  const octSeg = document.querySelector('.oct-seg');
  let soundOutside = DEFAULT_LAYOUT.sound; // the keyboard's sound when the recorder last shut (at first, the usual one)
  function placeControls(open) {
    if (open) {
      recKeys.append(octSeg, focusBtn, layoutBtn, namesBtn);
      viewSeg.after(toggleBtn);
    } else {
      quickbar.append(octSeg, soundSelect, focusBtn, layoutBtn, toggleBtn, namesBtn);
    }
  }

  function setOpen(open) {
    if (!open && busy()) stopRun();
    R.open = open;
    dock.hidden = !open;
    document.body.classList.toggle('rec-mode', open);
    placeControls(open);
    toggleBtn.setAttribute('aria-pressed', String(open));
    toggleBtn.title = open ? 'Close the recorder' : 'The four-track recorder';
    if (!LESSON) try { localStorage.setItem(OPEN_KEY, open ? '1' : '0'); } catch (e) {}
    if (open) {
      window.scrollTo(0, 0);
      // the first empty track is ready to record onto (never a lesson's locked one)
      const empty = P.tracks.findIndex((tr, i) => !tr.clips.length && !trackLocked(i));
      R.armed = empty >= 0 ? empty : armableTrack(false);
      if (R.pos <= 0) R.pos = songStart(); // the beginning, pick-up and all
      // a sound picked on the keyboard while the recorder was shut (or by a
      // link) is what that empty track records with; otherwise the track's own
      if (empty >= 0 && currentSound !== soundOutside) P.tracks[empty].sound = currentSound;
      adoptSound();
      renderAll();
    } else {
      soundOutside = currentSound;
    }
    // the piano in record mode, the view switch's choice otherwise (after
    // adoptSound: this redraw hands the keyboard's sound to the armed track)
    setView(viewChoice);
  }

  toggleBtn.addEventListener('click', () => {
    if (ed) nudgeEditBar();
    else if (!lockOn('record')) setOpen(!R.open); // (a scale lesson without recording hides the button)
  });
  playBtn.addEventListener('click', togglePlay);
  recordBtn.addEventListener('click', () => { if (!ed) toggleRecord(); });
  function goHome() { if (!busy()) { R.pos = songStart(); renderPos(); reveal(R.pos); } }
  homeBtn.addEventListener('click', goHome);
  undoBtn.addEventListener('click', () => { if (ed) editUndo(); else doUndo(); });

  function setTempo(v) {
    if (lockOn('tempo')) { tempoInput.value = P.tempo; return; }
    v = Math.round(Number(v));
    if (!Number.isFinite(v)) v = P.tempo;
    P.tempo = Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, v));
    tempoInput.value = P.tempo;
    save();
  }
  tempoInput.addEventListener('change', () => { setTempo(tempoInput.value); tempoInput.blur(); });
  tempoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tempoInput.blur(); });
  el('rec-tempo-down').addEventListener('click', () => setTempo(P.tempo - 1));
  el('rec-tempo-up').addEventListener('click', () => setTempo(P.tempo + 1));
  meterSelect.addEventListener('change', () => {
    if (lockOn('meter')) { meterSelect.value = P.meter; meterSelect.blur(); return; }
    P.meter = meterSelect.value; meterSelect.blur(); R.pos = songStart(); renderAll(); save();
  });
  countInBtn.addEventListener('click', () => { P.countIn = !P.countIn; renderSettings(); save(); });
  clickSelect.addEventListener('change', () => { P.click = clickSelect.value; clickSelect.blur(); renderSettings(); save(); });
  volumeRange.addEventListener('input', applyLevels); // the main volume sets every track's level too

  // Space plays and stops; Escape stops (or lets a highlighted part go);
  // Delete removes the highlighted part; − and + zoom (as in Vocal Booth);
  // Home goes back to the start. None of these keys plays a note.
  document.addEventListener('keydown', (e) => {
    if (!R.open || document.querySelector('.sheet-backdrop.open')) return;
    const t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) togglePlay();
    } else if (e.key === 'Escape' && busy()) {
      stopRun();
    } else if (e.key === 'Escape' && sel) {
      select(null);
    } else if ((e.key === 'Delete' || e.key === 'Backspace') && sel && !busy() && !e.ctrlKey && !e.altKey) {
      e.preventDefault(); // (a Mac's delete key is Backspace)
      deletePart(sel);
    } else if (e.metaKey || e.ctrlKey || e.altKey) {
      return; // ⌘/Ctrl − and + zoom the whole page, as always
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomStep(1 / ZOOM_STEP);
    } else if (e.key === '=' || e.key === '+') {
      e.preventDefault();
      zoomStep(ZOOM_STEP);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goHome();
    }
  });
  // a focused button would click on Space as well
  document.addEventListener('keyup', (e) => { if (e.code === 'Space' && R.open && e.target && e.target.tagName === 'BUTTON') e.preventDefault(); });

  // The note editor's keys, heard before the piano's (so ⌘C copies rather
  // than playing C's key): Delete; ⌘/Ctrl + C, X, V, A, Z; the arrows nudge;
  // Escape lets the highlighted notes go. Space still plays and stops.
  window.addEventListener('keydown', (e) => {
    if (!ed || document.querySelector('.sheet-backdrop.open')) return;
    const t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
    const cmd = e.metaKey || e.ctrlKey, k = (e.key || '').toLowerCase();
    if (cmd && k === 'c') { if (!e.repeat) copyNotes(false); }
    else if (cmd && k === 'x') { if (!e.repeat) copyNotes(true); }
    else if (cmd && k === 'v') { if (!e.repeat) pasteNotes(); }
    else if (cmd && k === 'a') selectAllNotes();
    else if (cmd && k === 'z' && !e.shiftKey) editUndo();
    else if (cmd || e.altKey) return; // ⌘/Ctrl − and + still zoom the page, and so on
    else if (e.key === 'Delete' || e.key === 'Backspace') { if (!e.repeat) deleteNotes(); }
    else if (e.key === 'Escape' && !busy() && ed.sel.size) { ed.sel = new Set(); renderEditBar(); queueDraw(); }
    else if (e.key.startsWith('Arrow') && ed.sel.size) nudgeNotes(e.key, e.shiftKey);
    else return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);

  new ResizeObserver(() => {
    if (!R.open) return;
    if (ed) tracksEl.style.setProperty('--head-w', editHeadW() + 'px');
    sizeLanes();
    drawAll();
  }).observe(tracksEl);

  // Over the lanes: a trackpad pinch (Ctrl + scroll; ⌘ + scroll with a mouse)
  // zooms round the pointer; two fingers sideways (or Shift + scroll) slide
  // the view along. Safari sends its pinch as gesture events. On a touch
  // screen two fingers on the lanes pinch.
  const overLanes = e => e.target && e.target.closest && e.target.closest('.rec-lane');
  tracksEl.addEventListener('wheel', (e) => {
    // the note editor: up and down go up and down the rows
    if (ed && e.target.closest && e.target.closest('.rec-track.editing') && !e.ctrlKey && !e.metaKey && !e.shiftKey
        && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      setTop(ed.top - (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / ed.rowH);
      queueDraw();
      return;
    }
    if (!overLanes(e) || !lanes[0] || !lanes[0].w) return;
    if (e.ctrlKey || e.metaKey) {
      if (e.ctrlKey && 'GestureEvent' in window) return; // Safari's pinch: the gesture events below
      e.preventDefault();
      zoomBy(Math.exp(-e.deltaY * 0.01), beatAtX(e.clientX));
      return;
    }
    if (!win) return;
    const along = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (!along) return; // up and down still scroll the page
    e.preventDefault();
    const px = e.deltaMode === 1 ? along * 16 : along;
    panTo(viewAt + px / pxPerBeat(lanes[0].w));
  }, { passive: false });
  let gestureScale = 1;
  tracksEl.addEventListener('gesturestart', (e) => { if (overLanes(e)) { e.preventDefault(); gestureScale = 1; } });
  tracksEl.addEventListener('gesturechange', (e) => {
    if (!overLanes(e)) return;
    e.preventDefault();
    zoomBy(e.scale / gestureScale, beatAtX(e.clientX));
    gestureScale = e.scale;
  });
  const fingers = new Map(); // touch pointers on the lanes: id -> x
  tracksEl.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || !overLanes(e)) return;
    fingers.set(e.pointerId, e.clientX);
    if (fingers.size === 2) {
      const [a, b] = [...fingers.values()];
      pinch = { d0: Math.max(8, Math.abs(a - b)), w0: view.end - view.start, at: beatAtX((a + b) / 2) };
      e.stopPropagation(); // the lane under the second finger doesn't take it as a press
    }
  }, true);
  tracksEl.addEventListener('pointermove', (e) => {
    if (!fingers.has(e.pointerId)) return;
    fingers.set(e.pointerId, e.clientX);
    if (!pinch || fingers.size < 2) return;
    e.preventDefault();
    const [a, b] = [...fingers.values()];
    const range = fit.end - fit.start;
    const w = clamp(pinch.w0 * pinch.d0 / Math.max(8, Math.abs(a - b)), barBeats(), range);
    const rect = lanes[0].wrap.getBoundingClientRect();
    viewAt = pinch.at - ((a + b) / 2 - rect.left) / (rect.width || 1) * w; // the beat between the fingers stays there
    win = w >= range - 1e-9 ? 0 : w;
    applyView();
    queueDraw();
  }, true);
  const liftFinger = (e) => { fingers.delete(e.pointerId); if (fingers.size < 2) pinch = null; };
  tracksEl.addEventListener('pointerup', liftFinger, true);
  tracksEl.addEventListener('pointercancel', liftFinger, true);
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (R.open) drawAll(); });
  document.querySelectorAll('input[name="theme"]').forEach(r => r.addEventListener('change', () => { if (R.open) drawAll(); }));

  // -------- SAVE: SONG FILES AND PROJECT FILES --------
  const saveSheet = el('rec-save-sheet');
  const saveStatus = el('rec-save-status');
  const nameInput = el('rec-name');
  let exporting = false;

  el('rec-save').addEventListener('click', () => {
    if (busy()) stopRun();
    nameInput.value = P.name;
    saveStatus.textContent = '';
    const kept = LESSON && LESSON.locks.tracks.length;
    el('rec-new-note').textContent = kept
      ? 'Clears the tracks you recorded on; the lesson’s locked tracks stay. Undo brings them back.'
      : 'Clears all four tracks. Undo brings them back.';
    el('rec-new').textContent = kept ? 'Clear my tracks' : 'New recording';
    openSheet('rec-save-sheet');
  });
  nameInput.addEventListener('input', () => { P.name = nameInput.value.slice(0, 60); save(); });

  function fileBase() {
    const name = (P.name || 'Keyboard recording').trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ');
    return name || 'Keyboard recording';
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
  const pause = () => new Promise(resolve => setTimeout(resolve, 0));

  // The tracks that are heard, from the first note (a breath before it) to the
  // last note and its ring.
  function songForFile() {
    const tracks = P.tracks.filter(tr => !tr.muted && tr.notes.length);
    if (!tracks.length) return null;
    const spb = 60 / P.tempo;
    let lo = Infinity, hi = -Infinity;
    tracks.forEach(tr => tr.notes.forEach(n => { lo = Math.min(lo, n.b); hi = Math.max(hi, n.b + n.d); }));
    // a loop plays to its end, rests and all
    tracks.forEach(tr => { if (tr.loop) tr.clips.forEach(c => { hi = Math.max(hi, c.b + c.d); }); });
    return {
      seconds: LEAD + (hi - lo) * spb + TAIL,
      room,
      parts: tracks.map(tr => ({
        level: BASE_LEVEL * tr.volume,
        notes: tr.notes.map(n => ({ freqs: [midiFreq(n.m)], preset: tr.sound, at: LEAD + (n.b - lo) * spb, hold: n.d * spb }))
      }))
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
    const view = new DataView(new ArrayBuffer(44 + len * 4));
    const text = (at, s) => { for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i)); };
    text(0, 'RIFF'); view.setUint32(4, 36 + len * 4, true); text(8, 'WAVE');
    text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 2, true);
    view.setUint32(24, rate, true); view.setUint32(28, rate * 4, true); view.setUint16(32, 4, true); view.setUint16(34, 16, true);
    text(36, 'data'); view.setUint32(40, len * 4, true);
    for (let i = 0, at = 44; i < len; i++, at += 4) {
      view.setInt16(at, toS16(L[i]), true);
      view.setInt16(at + 2, toS16(Rt[i]), true);
    }
    return new Blob([view], { type: 'audio/wav' });
  }

  async function exportSong(kind) {
    if (exporting) return;
    const song = songForFile();
    if (!song) { saveStatus.textContent = 'Nothing to save yet. Record a line first (muted tracks are left out).'; return; }
    if (kind === 'mp3' && typeof lamejs === 'undefined') { saveStatus.textContent = 'The MP3 maker did not load. Try WAV, or reload the page.'; return; }
    exporting = true;
    document.querySelectorAll('#rec-mp3, #rec-wav').forEach(b => { b.disabled = true; });
    try {
      saveStatus.textContent = 'Mixing the tracks…';
      await pause();
      const buffer = await Audio.render(song);
      const blob = kind === 'mp3'
        ? await encodeMp3(buffer, p => { saveStatus.textContent = `Making the MP3… ${Math.round(p * 100)}%`; })
        : encodeWav(buffer);
      const filename = `${fileBase()}.${kind}`;
      download(blob, filename);
      const secs = Math.round(buffer.duration);
      saveStatus.textContent = `Saved ${filename} (${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}, ${(blob.size / 1048576).toFixed(1)} MB).`;
    } catch (e) {
      console.error(e);
      saveStatus.textContent = 'Something went wrong making the file. Please try again.';
    } finally {
      exporting = false;
      document.querySelectorAll('#rec-mp3, #rec-wav').forEach(b => { b.disabled = false; });
    }
  }
  el('rec-mp3').addEventListener('click', () => exportSong('mp3'));
  el('rec-wav').addEventListener('click', () => exportSong('wav'));

  // A project file is an Eagle View Music envelope (EVM Library/README.md §7).
  el('rec-project-dl').addEventListener('click', () => {
    const env = { format: 'evm-item', formatVersion: 1, app: APP_SLUG, kind: 'recording', title: fileBase(), data: compact(P) };
    download(new Blob([JSON.stringify(env, null, 1)], { type: 'application/json' }), `${fileBase()}.json`);
    saveStatus.textContent = `Saved ${fileBase()}.json.`;
  });
  const projectFile = el('rec-project-file');
  el('rec-project-open').addEventListener('click', () => { if (!(LESSON && LESSON.locked)) projectFile.click(); }); // (hidden in a locked lesson)
  projectFile.addEventListener('change', () => {
    const file = projectFile.files[0];
    projectFile.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let obj = null;
      try { obj = JSON.parse(reader.result); } catch (e) {}
      let data = null;
      if (obj && obj.format === 'evm-item' && obj.app === APP_SLUG && obj.kind === 'recording') data = obj.data;
      else if (obj && Array.isArray(obj.tracks)) data = obj;
      if (!data) { saveStatus.textContent = 'That file is not a Virtual Keyboard recording.'; return; }
      pushUndo('opening ' + file.name);
      P = normalizeProject(data);
      afterProjectChange();
      nameInput.value = P.name;
      saveStatus.textContent = 'Opened ' + file.name + '. Undo brings back what was here.';
    };
    reader.readAsText(file);
  });
  el('rec-new').addEventListener('click', () => {
    const mine = P.tracks.filter((tr, i) => !trackLocked(i)); // (a lesson's locked tracks stay)
    if (!mine.some(tr => tr.clips.length)) { saveStatus.textContent = mine.length < TRACKS ? 'Your tracks are already empty.' : 'The tracks are already empty.'; return; }
    pushUndo('starting over');
    mine.forEach(tr => { tr.clips = []; tr.notes = []; });
    if (mine.length === TRACKS) { P.name = ''; nameInput.value = ''; }
    afterProjectChange();
    closeSheet('rec-save-sheet');
    toast(mine.length < TRACKS ? 'Your tracks are cleared; the lesson’s stay. Undo brings them back.' : 'All four tracks cleared. Undo brings them back.');
  });

  // -------- LINE UP THE TIMING (the tap-along test) --------
  // A steady click: four to listen to, then ten to tap along with. The first
  // two taps are left out while the player settles; the rest are matched to
  // their clicks, and the middle value is the delay — so one rushed or late
  // tap cannot throw it off. Taps that disagree too much are not trusted.
  const CAL = { bpm: 80, listen: 4, taps: 10, skip: 2, need: 5, spread: 0.04 };
  const calSheet = el('cal-sheet');
  const calPad = el('cal-pad');
  const calMsg = el('cal-msg');
  const calDots = el('cal-dots');
  const calRange = el('cal-range');
  const calValue = el('cal-value');
  let cal = null;
  let calToken = 0;
  let calDoneAt = 0;

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
    if (!calSheet) return;
    const ms = delayMs();
    calRange.value = ms;
    calValue.textContent = `${ms > 0 ? '+' : ms < 0 ? '−' : ''}${Math.abs(ms)} ms`;
    if (!cal) { calPad.textContent = calPad.dataset.again ? 'Again' : 'Start'; calPad.classList.remove('running'); }
  }

  async function startCal() {
    stopCal();
    if (busy()) stopRun();
    wakeAudio();
    const ctx = Audio.ensure();
    const token = ++calToken;
    cal = { token, clicks: [], taps: new Map(), timers: [], nodes: [], phase: 'listen' };
    buildCalDots();
    calPad.textContent = 'Listen…';
    calPad.classList.add('running');
    calMsg.textContent = 'Listen to four clicks, then tap along with the rest.';
    const ok = await EVMCountIn.prime(ctx, { warm: 0.35 });
    if (!cal || cal.token !== token) return;
    if (!ok) { stopCal(); calMsg.textContent = 'The sound did not start. Tap a key, then try again.'; return; }
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
    if (i === CAL.listen) { cal.phase = 'tap'; calMsg.textContent = 'Now tap along with each click.'; }
    calPad.textContent = i < CAL.listen ? 'Listen…' : 'Tap!';
    calPad.classList.remove('beat');
    void calPad.offsetWidth; // restart the pulse
    calPad.classList.add('beat');
  }

  // A tap belongs to the click it is nearest — allowing for a late setup, a
  // tap up to three quarters of a beat after a click still counts as that click's.
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

  calPad.addEventListener('pointerdown', (e) => {
    if (cal) { e.preventDefault(); calTap(e.timeStamp); }
  });
  // (not the release of the last tap, which can come just after the test ends)
  calPad.addEventListener('click', () => { if (!cal && performance.now() - calDoneAt > 800) startCal(); });
  // While the test runs, any key is a tap and plays nothing.
  window.addEventListener('keydown', (e) => {
    if (!cal || e.key === 'Escape') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!e.repeat) calTap(e.timeStamp);
  }, true);
  // Closing the sheet ends the test.
  new MutationObserver(() => { if (!calSheet.classList.contains('open')) stopCal(); })
    .observe(calSheet, { attributes: true, attributeFilter: ['class'] });

  calRange.addEventListener('input', () => setDelay(Number(calRange.value), 'hand'));
  el('cal-reset').addEventListener('click', () => {
    setDelay(0, null);
    calMsg.textContent = `Back to the browser's own figure (${guessMs()} ms). Press Start to measure.`;
  });
  timingBtn.addEventListener('click', openCal);
  el('settings-calibrate').addEventListener('click', () => { closeSheet('settings-sheet'); openCal(); });

  // -------- START --------
  load();
  try { const h = localStorage.getItem(HEAD_KEY); if (HEADS.includes(h)) head = h; } catch (e) {}
  buildTracks();
  renderTiming();
  let wasOpen = false;
  try { wasOpen = localStorage.getItem(OPEN_KEY) === '1'; } catch (e) {}
  setOpen(wasOpen);

  // -------- LESSONS (lesson.js) --------
  // A lesson's recording takes the place of this browser's own while the
  // lesson is open, kept wherever lesson.js says (`keep`); leaving it brings
  // the own one back untouched. `layoutFn` puts the lesson's (or the own)
  // key, scale and sound on the keyboard meanwhile: while it runs the
  // keyboard's sound is not handed to the armed track.
  let holdSound = false;
  function settle() { // nothing under way, nothing half-done
    if (ed) closeEditor(false);
    if (busy()) stopRun();
    select(null);
  }
  function swapIn(data, layoutFn) {
    P = normalizeProject(data);
    lockQuant();
    undo = [];
    win = 0; viewAt = 0;
    R.pos = songStart();
    R.armed = armableTrack();
    holdSound = true;
    try { layoutFn(); } finally { holdSound = false; }
    soundOutside = currentSound; // (setOpen gives an empty track the keyboard's sound only when it changed)
    nameInput.value = P.name;
  }
  function openLesson(data, keep, layoutFn) {
    settle();
    if (saveTimer) saveNow();    // this browser's own recording, kept first
    saveHook = keep;
    swapIn(data, layoutFn);
    if (lockOn('record')) { if (R.open) setOpen(false); } // a scale lesson with no recording
    else if (hasNotes() || R.open) setOpen(true);       // a lesson with a recording opens in record mode
    applyLevels();
    renderAll();
    save();
  }
  function leaveLesson(layoutFn) {
    settle();
    if (saveTimer) saveNow();    // the lesson's, kept with the lesson
    saveHook = null;
    let src = null;
    try { src = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {}
    swapIn(src, layoutFn);
    let wasOpen = false;
    try { wasOpen = localStorage.getItem(OPEN_KEY) === '1'; } catch (e) {}
    if (wasOpen) setOpen(true); else if (R.open) setOpen(false);
    applyLevels();
    renderAll();
  }
  // A saved workspace opened (or a lesson brought in to be changed, the
  // teacher's own): one step of Undo puts back the recording that was here.
  // The recorder opens when there is something in it (`open` 'auto') or
  // always (true).
  function adoptProject(data, label, layoutFn, open = true) {
    settle();
    pushUndo(label);
    const back = undo.pop(); // (swapIn starts a fresh Undo; this step goes back on after)
    swapIn(data, layoutFn);
    undo.push(back);
    if (open === true || (open === 'auto' && hasNotes())) setOpen(true);
    applyLevels();
    renderAll();
    save();
  }

  window.Recorder = {
    noteOn, noteOff, syncSound, openLesson, leaveLesson, adoptProject,
    snapshot: () => compact(P),                       // the recording as it is kept
    flush: () => { if (saveTimer) saveNow(); },       // keep it now (the page is closing)
    hasNotes: () => !!P && hasNotes(),
    // this browser's own recording, even while a link's is open in its place
    ownProject() {
      if (!saveHook) return compact(P);
      let src = null;
      try { src = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {}
      return compact(normalizeProject(src));
    },
    full: p => compact(normalizeProject(p)),          // a project with its parts AND the notes they play (for files)
    quantWords: q => quantWords(q),                   // 'swung 8ths'… in this time signature
    feelFits: (grid, feel) => feelFits(grid, feel)
  };
})();

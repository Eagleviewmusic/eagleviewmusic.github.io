/* ==========================================================================
   Recording Studio — studio.js
   The project, its tracks, the transport and recording. Grown from the
   Virtual Keyboard's four-track recorder (virtual-keyboard/recorder.js) and
   kept in step with it (2026-11-08): the same parts, loops, Quantize, note
   editor, zoom and track heads, with up to sixteen tracks, an instrument
   for each, voice takes, and songs brought in from the other apps.

   A track keeps what was played, not the sound: notes { m (MIDI), b (beat),
   d (beats), s (sound), v (level, 1 = as played) }, or for an ostinato hits
   { i (instrument), b, g (gain), r (beats to that line's next hit) }. Beats,
   not seconds, so a new tempo re-times the whole project.

   Each take is a PART (clip): a box on its track. Drag a part's middle to
   move it, or an end to size it. A track plays straight through by default;
   with its loop button on, every part on it is a loop — one pass, going
   round for as long as the box is pulled.

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
  const CLICK_WORDS = { record: 'Recording', always: 'Always', off: 'Off' };
  const TEMPO_MIN = 30, TEMPO_MAX = 300;
  const LOOKAHEAD = 0.15, HIDDEN_LOOKAHEAD = 1.5, PUMP_MS = 25;
  const MIN_HOLD = 0.05;     // beats: the shortest note kept
  const EARLY = 0.125;       // beats: how early a note can come and still belong to the beat after it
  const UNDO_MAX = 40;
  const PART_MIN = 1;        // beats: the shortest a part can be sized to
  const PART_MAX = 4000;     // beats: how far a loop can be pulled
  const TAKE_MIN = 0.05;     // seconds: the shortest a voice take can be trimmed to
  const GRIDS = [4, 8, 16];  // Quantize: quarter, 8th, 16th notes
  const FEELS = ['none', 'swing8', 'swing16', 'triplets'];
  const LEAD = 0.1, TAIL = 2.5; // seconds before the first note and after the last in a song file
  const BASE = Voices.BASE;
  // The track heads, dragged narrower: everything / number, sound, mute and
  // loop / number, mute and loop. Their widths in px (the column, style.css).
  const HEADS = ['full', 'name', 'small'];
  const HEAD_W = { full: 394, name: 250, small: 132 };

  const PROJECTS_KEY = 'evm_studio_projects_v1';
  const CURRENT_KEY = 'evm_studio_current_v1';
  const PREFS_KEY = 'evm_studio_prefs_v1';
  const DELAY_KEY = 'evm_studio_rec_delay_v1';
  const VK_DELAY_KEY = 'virtual_keyboard_rec_delay_v1';   // the Virtual Keyboard's, used until the studio measures its own
  const THEME_KEY = 'evm_studio_theme_v1';
  const HEAD_KEY = 'evm_studio_head_v1';
  const APP_SLUG = 'recording-studio';

  const el = id => document.getElementById(id);
  const tracksEl = el('tracks');
  const playBtn = el('play'), recordBtn = el('record'), homeBtn = el('home');
  const posEl = el('pos');
  const tempoInput = el('tempo'), meterSelect = el('meter'), countInBtn = el('countin'), clickSelect = el('click');
  const clickWord = el('rec-click-word'), clickFace = clickSelect.closest('.rec-click-face');
  const undoBtn = el('undo'), redoBtn = el('redo');

  let P = null;               // the project
  let projects = {};          // id -> project (this device)
  const R = { armed: 0, inst: 'keyboard', state: 'idle', pos: 0 }; // state: idle | priming | playing | recording
  let run = null, runToken = 0;
  let view = { start: 0, end: 32 };   // the beats across the lanes
  let fit = { start: 0, end: 32 };    // the whole song's range (zoomed out, the lanes show all of it)
  let win = 0;                        // zoom: beats across the lanes, or 0 for the whole song
  let viewAt = 0;                     // zoomed in: the beat at the lanes' left edge
  let zoomUI = null;                  // Split, − ⤢ + and the scroll bar under the lanes
  let pinch = null;                   // two fingers on the lanes, zooming
  let cutMode = false;                // the Split button is lit: the next press on a take or part cuts it in two
  let cutHover = null;                // { i, beat } where the scissors would cut, drawn on that lane
  let sel = null;                     // { tid, b } the take or part highlighted: Quantize speaks for it, Delete removes it
  let drawQueued = false;
  let rows = [];              // { row, ctl, arm, slot, ..., wrap, canvas, head, ladder } per track
  let ruler = null;           // the ruler lane { wrap, canvas, head }
  let undo = [], redo = [];   // redo: what Undo took back, until something new is done
  let prefs = { volume: 1, inst: 'keyboard', split: null, folded: false };
  let audioWoken = false;
  let armedId = null;         // the armed track's id, so arming survives tracks moving
  let head = 'full';          // how much of the track heads shows (HEADS)
  let grip = null;            // the handle that drags them narrower

  // -------- SMALL THINGS --------
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const midiFreq = m => 440 * Math.pow(2, (m - 69) / 12);
  function freqMidi(f) {
    const m = 69 + 12 * Math.log2(f / 440);
    const r = Math.round(m);
    return Math.abs(m - r) < 0.02 ? r : Math.round(m * 100) / 100;
  }
  const byBeat = (a, b) => a.b - b.b;
  const mod = (x, m) => ((x % m) + m) % m;
  const newId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const NOTE_COLORS = ['#FF3B30', '#ff6818', '#FF9500', '#ffb000', '#FFCC00', '#34C759', '#32c490', '#30c0c6', '#189de2', '#007AFF', '#5866ee', '#AF52DE'];
  const noteColor = m => NOTE_COLORS[mod(Math.round(m), 12)];
  const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const midiName = m => NAMES[mod(m, 12)] + (Math.floor(m / 12) - 1);
  const prettyNote = n => n[0] + n.slice(1).replace(/#/g, '♯').replace(/b/g, '♭');
  // dark or light writing on a colour
  function inkFor(hex) {
    const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#1c1c1e' : '#ffffff';
  }

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
    return { id: newId('t'), kind: null, name: '', volume: 1, muted: false, solo: false, loop: false, sound: null, notes: [], hits: [], regions: [], clips: [], from: null };
  }
  // quant: the Quantize button's choices (set: confirmed once; on: new takes are quantized)
  function blankQuant() { return { set: false, on: false, grid: 8, feel: 'none', all: false }; }
  function blankProject() {
    return {
      id: newId('p'), name: '', createdAt: Date.now(), updatedAt: Date.now(),
      tempo: 90, meter: '4/4', countIn: true, click: 'record', room: 0.35,
      key: 0, scale: 'major',   // what every instrument plays in: a pitch class (0 = C), a Theory scale id
      quant: blankQuant(),
      tracks: Array.from({ length: START_TRACKS }, blankTrack)
    };
  }
  const hasContent = tr => tr.notes.length > 0 || tr.hits.length > 0 || tr.regions.length > 0 || tr.clips.length > 0;
  const recordable = tr => !tr.kind || !!(KINDS[tr.kind] && KINDS[tr.kind].play);
  const engineOf = tr => (tr.kind && KINDS[tr.kind] ? KINDS[tr.kind].engine : 'notes');
  const isHits = tr => engineOf(tr) === 'hits';
  const isAudio = tr => engineOf(tr) === 'audio';
  const editable = tr => engineOf(tr) === 'notes' || engineOf(tr) === 'strikes';   // the note editor's tracks

  function cleanNotes(list) {
    return (Array.isArray(list) ? list : [])
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
    return (Array.isArray(list) ? list : [])
      .filter(h => h && VI.INSTRUMENT_MAP[h.i] && Number.isFinite(h.b))
      .map(h => ({ i: h.i, b: h.b, g: Number.isFinite(h.g) ? clamp(h.g, 0, 2) : 1, r: Number.isFinite(h.r) && h.r > 0 ? h.r : 0 }))
      .sort(byBeat);
  }
  const copyItems = list => list.map(n => ({ ...n }));

  // -------- PARTS (note and ostinato tracks) --------
  // A keyboard, accordion, xylophone or brought-in track is kept as parts
  // (clips), as a voice track keeps takes: each part holds what was played
  // (items, in beats from the part's own beginning) and a box onto it —
  // where it sits (b), how far in the box opens (o), how long it is (d),
  // how long what was played is (len). Sizing only moves the box's ends:
  // nothing played is lost, and an end dragged back out opens it up again.
  // tr.notes / tr.hits are what the boxes let through, in the song's beats
  // — what plays, draws and goes into a song file.
  // A LOOP part: `items` is one pass, `loop` beats long, and the box shows
  // the pass going round for as long as the box is — pull its end out and it
  // keeps going. `o` is the phase: where in the pass the box begins. `was`
  // is the part as it was before it became a loop, so the loop button
  // turned straight back off gives it back unchanged. A quantized part
  // keeps `raw` (its items as played) and `q` (the rhythm it was put on).
  function makePart(items, lo, hi) {
    return { b: lo, o: 0, d: hi - lo, len: hi - lo, items: items.map(n => ({ ...n, b: n.b - lo })) };
  }
  // A part round some notes (or hits): from the beat they start on (a note a
  // moment early still counts as on it) to the beat after they end.
  function partAround(items, hits) {
    const lo = Math.floor(Math.min(...items.map(n => n.b)) + EARLY);
    const hi = Math.ceil(Math.max(...items.map(n => n.b + (hits ? (n.r || 0.25) : n.d))) - 1e-6);
    return makePart(items, lo, Math.max(hi, lo + 1));
  }
  // Untouched since it became a loop (moved is fine): the loop button can give it back as it was.
  const pristine = c => !!(c.loop && c.was && Math.abs(c.o) < 1e-6 && Math.abs(c.d - c.loop) < 1e-6);
  // The pass length hidden in a block of repeated hits (an older ostinato
  // file, its hits written out): the shortest whole-beat shift that lands
  // every hit on another of its instrument; the whole block when there is none.
  function findLoop(items) {
    const key = (i, b) => i + '@' + Math.round(b * 96);
    const set = new Set(items.map(h => key(h.i, h.b)));
    const first = Math.min(...items.map(h => h.b)), last = Math.max(...items.map(h => h.b));
    const whole = Math.max(1, Math.ceil(last + 1e-6));
    for (let L = 1; L * 2 <= whole; L++) {
      const ok = items.every(h => (h.b + L > last + 1e-6 || set.has(key(h.i, h.b + L))) && (h.b - L < first - 1e-6 || set.has(key(h.i, h.b - L))));
      if (ok) return L;
    }
    return whole;
  }
  function loopify(c) {
    if (c.loop || !c.items.length) return c;
    const loop = findLoop(c.items);
    return { b: c.b, o: mod(c.o, loop), d: c.d, len: loop, loop, items: c.items.filter(h => h.b < loop - 1e-6) };
  }
  // A part becomes a loop: what its box shows now is one pass.
  function toLoop(c, hits) {
    if (c.loop) return c;
    const L = Math.max(1, Math.round(c.d));   // in whole beats, so the passes stay on the beat
    const end = c.o + L;
    const pass = list => list
      .filter(n => n.b >= c.o - EARLY && n.b < end - 1e-6)
      .map(n => hits ? { ...n, b: n.b - c.o } : { ...n, b: n.b - c.o, d: Math.max(MIN_HOLD, Math.min(n.d, end - n.b)) }); // held into the next pass: stops there
    const p = { b: c.b, o: 0, d: L, len: L, loop: L, items: pass(c.items), was: { b: 0, o: c.o, d: c.d, len: c.len, items: copyItems(c.items) } };
    if (c.q) {
      p.q = p.was.q = c.q;
      p.raw = pass(c.raw || c.items);
      p.was.raw = copyItems(c.raw || c.items);
    }
    return p;
  }
  // The items a part's box lets through, in the song's beats (or of another
  // list in the part's own beats: its items as played).
  function partNotes(c, items, hits) {
    items = items || c.items;
    const out = [], end = c.o + c.d;
    const keep = (n, t) => {   // t: where the note falls in the part's own beats
      if (t < c.o - EARLY || t >= end - 1e-6) return;
      const x = { ...n, b: c.b + t - c.o };
      if (!hits && t + n.d > end) x.d = Math.max(MIN_HOLD, end - t);   // held past the end: stops there
      out.push(x);
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
    const hits = isHits(tr);
    const out = [].concat(...tr.clips.map(c => partNotes(c, c.items, hits))).sort(byBeat);
    tr.notes = hits ? [] : out;
    tr.hits = hits ? out : [];
  }
  // The loop button turned off: a loop not touched since gives back the part it
  // was (if that still fits between its neighbours); one pulled out or sized
  // keeps its passes, written out just as they are heard.
  function unloopAll(clips, hits) {
    return clips.map((c, k) => {
      if (!c.loop) return c;
      if (pristine(c)) {
        const w = c.was, b = c.b + w.b;
        const clash = clips.some((x, j) => j !== k && x.b < b + w.d - 1e-9 && x.b + x.d > b + 1e-9);
        if (!clash) {
          const p = { b, o: w.o, d: w.d, len: w.len, items: copyItems(w.items) };
          if (w.q) { p.q = w.q; p.raw = copyItems(w.raw || w.items); }
          return p;
        }
      }
      const written = list => partNotes(c, list, hits).map(n => ({ ...n, b: n.b - c.b }));
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
      const p = { ...c, ...x, items: copyItems(c.items) };
      if (c.raw) p.raw = copyItems(c.raw);
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
  // In 6/8, 9/8 and 12/8 the beat is a dotted quarter: Quarter keeps to the
  // beat, an 8th is a third of it, and swing and triplets do not apply.
  const compound = () => P.meter.endsWith('/8');
  function feelFits(grid, feel) {
    if (compound()) return feel === 'none';
    if (feel === 'swing8') return grid >= 8;
    if (feel === 'swing16') return grid >= 16;
    return true;
  }
  // The points a note may land on, as beats into a cell `cell` beats long.
  function gridPoints(q) {
    const feel = feelFits(q.grid, q.feel) ? q.feel : 'none';
    if (compound()) return { cell: 1, at: q.grid === 4 ? [0] : q.grid === 8 ? [0, 1 / 3, 2 / 3] : [0, 1 / 6, 1 / 3, 1 / 2, 2 / 3, 5 / 6] };
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
  const sameNote = (a, b) => a.m === b.m && a.i === b.i;
  // A part's items put on the rhythm. `origin` is the song's beat where the
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
      const twin = out.find(x => sameNote(x, n) && Math.abs(x.b - b) < 1e-6); // two of one note on one point: the longer
      if (twin) { if (n.d != null) twin.d = Math.max(twin.d, n.d); } else out.push({ ...n, b });
    });
    return out.sort(byBeat);
  }
  // In place, so a highlighted part stays highlighted.
  function quantizePart(c, q) {
    const snap = snapper(q);
    const raw = c.raw || c.items;
    c.raw = copyItems(raw);
    c.items = quantItems(raw, c.b - c.o, snap, c);
    c.q = { grid: q.grid, feel: q.feel };
    if (c.was) { // the part a loop was, for the loop button turned off: on the rhythm too
      const w = c.was, wraw = w.raw || w.items;
      w.raw = copyItems(wraw);
      w.items = quantItems(wraw, c.b + w.b - w.o, snap, w);
      w.q = c.q;
    }
  }
  const sameQ = (a, b) => !!a && !!b && a.grid === b.grid && a.feel === b.feel;
  function quantWords(q) {
    const unit = q.grid === 4 ? (compound() ? 'the beat' : 'quarter notes') : q.grid === 8 ? '8th notes' : '16th notes';
    const feel = feelFits(q.grid, q.feel) ? q.feel : 'none';
    return unit + { none: '', swing8: ', swung 8ths', swing16: ', swung 16ths', triplets: ' and triplets' }[feel];
  }

  // Anything missing or unknown falls back to the default, so every file opens.
  function cleanPart(c, hits) {
    if (!c || typeof c !== 'object') return null;
    const ok = x => Number.isFinite(x);
    if (!ok(c.b) || !ok(c.o) || !ok(c.d) || !ok(c.len) || c.d <= 0 || c.len <= 0 || c.o < 0 || !Array.isArray(c.items)) return null;
    const clean = list => (hits ? cleanHits(list) : cleanNotes(list));
    const p = { b: c.b, o: c.o, d: Math.min(c.d, PART_MAX), len: c.len, items: clean(c.items) };
    if (c.q && GRIDS.includes(c.q.grid) && FEELS.includes(c.q.feel)) {
      p.q = { grid: c.q.grid, feel: c.q.feel };
      const raw = clean(c.raw);
      if (raw.length) p.raw = raw;
    }
    if (ok(c.loop) && c.loop > 0) {
      p.loop = c.loop;
      p.len = c.loop;
      p.o = mod(p.o, c.loop);
      p.items = p.items.filter(n => n.b < c.loop - 1e-6);
      if (p.raw) p.raw = p.raw.filter(n => n.b < c.loop - 1e-6);
      const w = cleanPart(c.was, hits);
      if (w && !w.loop) p.was = w;
    } else {
      p.len = Math.max(p.len, p.o + p.d);   // (an older studio file kept the box's reach loosely)
    }
    return p;
  }
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
    // A note or ostinato track's parts: as saved, or one part round what an
    // older file kept as plain notes. What plays is worked out from them.
    if (!isAudio(t)) {
      const hits = isHits(t);
      if (Array.isArray(src.clips) && src.clips.length) {
        t.clips = src.clips.map(c => cleanPart(c, hits)).filter(Boolean).sort(byBeat);
      } else {
        const items = hits ? t.hits : t.notes;
        if (items.length) t.clips = [partAround(items, hits)];
      }
      if (hits && src.from && src.from.app === 'ostinato-builder') t.clips = t.clips.map(loopify);
      // a looping track's parts all loop; the others' none (an ostinato brought in loops by nature)
      t.loop = src.loop === true || (src.loop == null && hits && t.clips.some(c => c.loop));
      t.clips = t.loop ? t.clips.map(c => toLoop(c, hits)) : unloopAll(t.clips, hits);
      partsView(t);
    }
    if (src.from && typeof src.from === 'object') {
      t.from = { app: String(src.from.app || ''), title: String(src.from.title || '').slice(0, 80), id: src.from.id ? String(src.from.id) : '' };
      if (src.from.part) t.from.part = String(src.from.part).slice(0, 40);
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
    const q = src.quant;
    if (q && typeof q === 'object') {
      p.quant.set = q.set === true;
      p.quant.on = q.on === true && p.quant.set;
      p.quant.all = q.all === true;
      if (GRIDS.includes(q.grid)) p.quant.grid = q.grid;
      if (FEELS.includes(q.feel)) p.quant.feel = q.feel;
    }
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
    const cn = n => { const c = { m: n.m, b: r(n.b), d: r(n.d) }; if (n.s) c.s = n.s; if (n.v !== 1) c.v = r(n.v); return c; };
    const ch = h => { const c = { i: h.i, b: r(h.b) }; if (h.g !== 1) c.g = r(h.g); if (h.r) c.r = r(h.r); return c; };
    const part = (c, item) => {
      const out = { b: r(c.b), o: r(c.o), d: r(c.d), len: r(c.len), items: c.items.map(item) };
      if (c.q) { out.q = c.q; if (c.raw) out.raw = c.raw.map(item); }
      if (c.loop) { out.loop = r(c.loop); if (pristine(c)) out.was = part(c.was, item); }
      return out;
    };
    // a track open in the note editor is kept as it was until Save Changes
    const kept = (tr, i) => (ed && p === P && i === ed.i ? ed.saved : tr);
    return {
      ...p,
      quant: { ...p.quant },
      tracks: p.tracks.map((tr, i) => {
        const item = isHits(tr) ? ch : cn;
        const k = kept(tr, i);
        // what plays (as plain notes, which older copies of the studio read) and the parts it comes from
        const o = { ...tr, notes: k.notes.map(cn) };
        o.hits = k.hits.map(ch);
        o.clips = k.clips.map(c => part(c, item));
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
    const quant = P.quant;   // undo brings back notes; the Quantize button keeps its choices
    P = normalizeProject(JSON.parse(u.json));
    P.quant = quant;
    afterProjectChange();
    toast('Undone: ' + u.label);
  }
  function doRedo() {
    if (busy()) return;
    const r = redo.pop();
    if (!r) return;
    undo.push({ label: r.label, json: JSON.stringify(P) });
    const quant = P.quant;
    P = normalizeProject(JSON.parse(r.json));
    P.quant = quant;
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
  // The end: the last note — or the end of the last loop, whose last pass
  // plays to its end, rests and all.
  function songEnd() {
    let hi = 0;
    P.tracks.forEach(tr => {
      tr.notes.forEach(n => { if (n.b + n.d > hi) hi = n.b + n.d; });
      tr.hits.forEach(h => { if (h.b + 0.25 > hi) hi = h.b + 0.25; });
      tr.regions.forEach(g => { const e = g.b + g.d / (60 / P.tempo); if (e > hi) hi = e; });
      if (tr.loop) tr.clips.forEach(c => { if (c.b + c.d > hi) hi = c.b + c.d; });
    });
    return hi;
  }
  // a voice take's end, in beats at the tempo now (takes keep their own speed)
  const regionEnd = g => g.b + g.d / (60 / P.tempo);
  const listOf = tr => { const e = engineOf(tr); return e === 'hits' ? tr.hits : e === 'audio' ? Voices.joined(tr.regions, 60 / P.tempo) : tr.notes; };
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

  let wokenCtx = null;      // (the context can change: voice.js runs it at the microphone's or the takes' rate)
  function wakeAudio() {
    const ctx = Audio.ensure();
    if (wokenCtx !== ctx) { wokenCtx = ctx; audioWoken = true; Audio.setReverb(P.room); }
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
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.09);
    o.onended = () => { try { o.disconnect(); g.disconnect(); } catch (e) {} };
    return o;
  }

  // -------- PLAY AND RECORD --------
  // What a track's note sounds like now: the track's own sound when it has one.
  const notePreset = (tr, n) => tr.sound || (n && n.s) || (tr.kind === 'xylophone' ? 'vibraphone' : 'piano');

  // Opened straight from its file, the browser walls the instrument frames and the
  // microphone recorder off from the page: there is nothing to record from.
  const FROM_FILE = location.protocol === 'file:';

  async function startRun(recording) {
    if (recording && FROM_FILE) { toast('Recording needs the studio opened with “Open the Recording Studio” (see the red note at the top).'); return; }
    if (StudioVoice.testing) { toast('The microphone test is still going. It ends by itself in a moment.'); return; }
    if (recording && ed) { nudgeEditBar(); return; }
    const token = ++runToken;
    let ctx = wakeAudio();
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
      showTrack(R.armed);
      select(null);   // the take is what comes next: Quantize speaks for new recordings again
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
    // the clock at the takes' own rate, so they play back untouched
    await StudioVoice.matchRate();
    if (token !== runToken) return;
    ctx = wakeAudio();
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
    if (recording && R.inst === 'voice' && !StudioVoice.on) {     // unplugged while the sound was waking
      EVMCountIn.close();
      R.state = 'idle';
      renderTransport();
      toast('The microphone is not on — see the Voice panel below.');
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
        const k = isAudio(tr) ? list.findIndex(g => regionEnd(g) > from) : list.findIndex(n => n.b >= from - count - EARLY);
        return k < 0 ? list.length : k;
      }),
      nextClick: Math.ceil(from - count - 1e-9),
      clicks: [], take: [], held: new Map(),
      timer: 0, raf: 0, drawn: 0
    };
    if (recording && R.inst === 'voice') {
      run.vdelay = StudioVoice.delaySec();
      run.capture = StudioVoice.startCapture({ id: newId('c'), project: P.id, track: P.tracks[run.armed].id, from, anchor, spb, vdelay: run.vdelay });
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
    follow(beat);
    setHeads(beat);
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
      r.voices.stop();
      r.clicks.forEach(o => { try { o.stop(); } catch (e) {} });
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

  // Tape rules: the take is a new part, replacing what the track had from
  // where it began to where it stopped. A take with no notes changes nothing.
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
    const hi = Math.ceil(Math.max(stop, ...r.take.map(n => n.b + n.d)) - 1e-6);
    tr.kind = r.inst;
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
    if (!storedDelay() && !sessionGet('tip')) {
      sessionSet('tip');
      setTimeout(() => toast('Tip: “Line up the timing” in Settings sets the recording for these speakers or headphones.'), 600);
    } else if (P.tracks.filter(hasContent).length === 1) {
      const next = P.tracks.findIndex(t => !hasContent(t));
      if (next >= 0) setTimeout(() => toast(`Recorded. Pick track ${next + 1} to play another part over it.`), 600);
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
      .map(n => ({ ...n, b: n.b - lo }))
      .filter(n => n.b >= -EARLY && n.b < L - EARLY)
      .map(n => ({ ...n, d: Math.max(MIN_HOLD, Math.min(n.d, L - n.b)) }));
    if (!items.length) return toLoop(plain, false);
    return { b: lo, o: 0, d: L, len: L, loop: L, items, was: { b: plain.b - lo, o: plain.o, d: plain.d, len: plain.len, items: plain.items } };
  }
  /* A voice take: the microphone's sound, whole, count-in and all. The track hears
     the part from where Play began (or from a pick-up sung in the count-in) to Stop,
     moved earlier by the voice delay, by the same tape rules. Nothing is done to the
     sound. A take stays as it was even when it is quiet: the words say what to change. */
  let voiceSaving = false;
  async function keepVoiceTake(r) {
    const c = r.capture;
    if (!c) return;
    const stopT = r.ctx.currentTime;
    const tr = P.tracks[r.armed];
    voiceSaving = true;
    try {
      const res = await StudioVoice.endCapture(c);
      if (!res) return;
      const vd = r.vdelay;
      const tFrom = r.anchor + vd;                  // where beat `from` is in the take
      const pick = StudioVoice.pickupOnset(res, tFrom);
      const startT = Math.max(res.t0, pick != null ? pick : tFrom);
      const endT = Math.min(stopT, res.t0 + res.data.length / res.rate);
      if (!tr || endT - startT < 0.05) { await StudioVoice.discard(res); return; }   // stopped in the count-in
      const stored = await StudioVoice.commit(res);
      const lo = r.from + (startT - vd - r.anchor) / r.spb;
      const hi = r.from + (endT - vd - r.anchor) / r.spb;
      pushUndo('the take on track ' + (r.armed + 1));
      cutRegions(tr, lo, hi);
      tr.regions.push({ c: res.id, b: lo, o: Math.round((startT - res.t0) * res.rate) / res.rate, d: endT - startT });
      tr.regions.sort(byBeat);
      tr.kind = 'voice';
      save();
      renderAll();
      const word = !stored ? 'The take could not be stored in this browser (its storage may be full). It plays for now: download the project file to keep your work.'
        : res.peak < 0.0003 ? 'That take is silent. Is the right microphone chosen in the Voice panel?'
          : res.clipped ? 'That take hit the top of the meter, so it may sound distorted. Move back a little and try again.'
            : res.peak < 0.03 ? 'That take is very quiet. Move closer to the microphone if you can.'
              : pick != null ? 'Kept the pick-up you sang in the count-in.' : '';
      if (word) setTimeout(() => toast(word), 400);
    } catch (e) {
      console.error(e);
      toast('The take could not be kept here (the browser’s storage may be full). Download the project file to keep your work.');
    } finally {
      voiceSaving = false;
    }
  }
  /* A take cut off by a closed page or a crash comes back: on its own track if nothing
     else has taken that place since, else on an empty one. It covers nothing. */
  async function recoverTakes() {
    const found = await StudioVoice.recover();
    if (!found.length) return;
    const tracksWith = [];
    found.forEach(f => {
      const vd = f.vdelay || 0;
      const startT = Math.max(f.t0, f.anchor + vd);
      const o = Math.round((startT - f.t0) * f.rate) / f.rate;
      const d = f.length / f.rate - o;
      if (d < 0.25) { StudioVoice.forget([f.id]); return; }
      const lo = f.from + (startT - vd - f.anchor) / f.spb;
      const hi = lo + d / (60 / P.tempo);
      if (!tracksWith.length) pushUndo('the recovered take');
      let i = f.project === P.id ? P.tracks.findIndex(t => t.id === f.track) : -1;
      const tr0 = P.tracks[i];
      const free = tr0 && recordable(tr0) && (!hasContent(tr0) || tr0.kind === 'voice') && !tr0.regions.some(g => regionEnd(g) > lo && g.b < hi);
      if (!free) i = emptyFor('voice');
      if (i < 0) {   // sixteen full tracks: back where it was sung
        i = Math.max(0, P.tracks.findIndex(t => t.id === f.track));
        cutRegions(P.tracks[i], lo, hi);
      }
      const tr = P.tracks[i];
      tr.kind = 'voice';
      tr.regions.push({ c: f.id, b: lo, o, d });
      tr.regions.sort(byBeat);
      tracksWith.push(i + 1);
    });
    if (!tracksWith.length) return;
    save();
    buildTracks();
    renderAll();
    toast(`A take cut off when the page closed is back on track ${tracksWith.join(', ')}.`);
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
    renderTransport();
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
  // The track being recorded onto is brought into sight.
  function showTrack(i) {
    const c = rows[i], pane = el('tracks-pane');
    if (!c) return;
    const box = pane.getBoundingClientRect(), r = c.row.getBoundingClientRect();
    const top = ruler ? ruler.wrap.getBoundingClientRect().bottom : box.top;   // under the ruler, which stays put
    if (r.top < top) pane.scrollTop -= top - r.top + 4;
    else if (r.bottom > box.bottom) pane.scrollTop += r.bottom - box.bottom + 4;
  }

  // -------- THE TRACKS ON SCREEN --------
  function posText(beat) {
    const bpb = barBeats();
    const bar = Math.floor(beat / bpb + 1e-6);
    const inBar = Math.floor(beat - bar * bpb + 1e-6) + 1;
    return bar < 0 ? `Pick-up · ${inBar}` : `Bar ${bar + 1} · ${inBar}`;
  }
  // The whole song and every part, at least eight bars, and a bar to spare:
  // what the lanes show zoomed out.
  function fitView() {
    const bpb = barBeats();
    if (!Number.isFinite(R.pos)) R.pos = songStart();   // (never let a bad number stick)
    if (!Number.isFinite(viewAt)) viewAt = 0;
    if (!Number.isFinite(win) || win < 0) win = 0;
    let start = songStart(), last = songEnd();
    P.tracks.forEach(tr => tr.clips.forEach(c => { start = Math.min(start, c.b); last = Math.max(last, c.b + c.d); }));
    start = Math.floor(start / bpb) * bpb;
    fit = { start, end: Math.max(Math.ceil(last / bpb) * bpb + bpb, start + 8 * bpb, R.pos + bpb) };
    applyView();
  }
  const pxPerBeat = w => w / (view.end - view.start);

  // -------- ZOOM (the Virtual Keyboard's, after Vocal Booth's) --------
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
  function zoomFit() { win = 0; applyView(); queueDraw(); }
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
    const rect = ruler.wrap.getBoundingClientRect();
    return view.start + (clientX - rect.left) / pxPerBeat(rect.width || 1);
  }
  function queueDraw() {
    if (drawQueued) return;
    drawQueued = true;
    requestAnimationFrame(() => { drawQueued = false; drawAll(); });
  }
  // How far a dragged part moves: the finest of beat, 8th and 16th (thirds
  // and sixths of the beat in 6/8) that the zoom spreads 14 px or more apart
  // (a bar when even beats are cramped).
  function snapGrid(ppb) {
    if (ppb < 7) return barBeats();
    const divs = compound() ? [1, 1 / 3, 1 / 6] : [1, 1 / 2, 1 / 4];
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
    corner.className = 'ctl corner';
    corner.setAttribute('role', 'group');
    corner.setAttribute('aria-label', 'Timeline tools');
    const btn = (cls, icon, label, title) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rec-icon-btn zoom-btn ' + cls;
      b.innerHTML = icon;
      b.setAttribute('aria-label', label);
      b.title = title;
      corner.appendChild(b);
      return b;
    };
    const cut = btn('cut-btn', ICON.split, 'Split a take or part in two', 'Split: press this, then press a take or part where it should be cut in two (Option/Alt: off the grid)');
    cut.setAttribute('aria-pressed', 'false');
    cut.addEventListener('click', () => setCutMode(!cutMode));
    const out = btn('zoom-out', ICON.zoomOut, 'Zoom out', 'Zoom out (−)');
    const all = btn('zoom-all', ICON.zoomAll, 'Show the whole song', 'Show the whole song');
    const inn = btn('zoom-in', ICON.zoomIn, 'Zoom in', 'Zoom in (+) — pinch or Ctrl/⌘ + scroll over the lanes, too');
    out.addEventListener('click', () => zoomStep(1 / ZOOM_STEP));
    inn.addEventListener('click', () => zoomStep(ZOOM_STEP));
    all.addEventListener('click', zoomFit);

    // the scroll bar under the lanes: drag the thumb, or press beside it to go there
    const row = document.createElement('div');
    row.className = 'row scroll-row';
    row.hidden = true;
    const spacer = document.createElement('div');
    spacer.className = 'ctl ctl-spacer';
    const bar = document.createElement('div');
    bar.className = 'hscroll';
    bar.setAttribute('role', 'scrollbar');
    bar.setAttribute('aria-orientation', 'horizontal');
    bar.setAttribute('aria-label', 'Which bars the lanes show');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    const thumb = document.createElement('div');
    thumb.className = 'hscroll-thumb';
    thumb.title = 'Drag to move along the song';
    bar.appendChild(thumb);
    row.append(spacer, bar);
    bar.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || !win) return;
      e.preventDefault();
      const range = fit.end - fit.start, w = view.end - view.start;
      const bw = bar.clientWidth, tw = thumb.offsetWidth, room = Math.max(1, bw - tw);
      const rect = bar.getBoundingClientRect();
      if (e.target !== thumb) panTo(fit.start + (e.clientX - rect.left - tw / 2) / room * (range - w));   // beside the thumb: it jumps there
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
    zoomUI = { corner, cut, out, all, in: inn, row, bar, thumb };
    renderCut();
  }

  const ICON = {
    keyboard: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 5v14M12 5v14M16 5v14"/><path class="fill" d="M6.6 5h2.8v8H6.6zM14.6 5h2.8v8h-2.8z"/></svg>',
    accordion: '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="4.5" height="12" rx="1.2"/><rect x="17" y="6" width="4.5" height="12" rx="1.2"/><path d="M7 7.5l2.5 9 2.5-9 2.5 9 2.5-9"/></svg>',
    xylophone: '<svg viewBox="0 0 24 24"><path d="M5 5v14M9.5 6.5v11M14 8v8M18.5 9.5v5" stroke-width="3"/></svg>',
    ostinato: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"/><path d="M15 3.5l4-2M9 3.5 5 1.5"/></svg>',
    melody: '<svg viewBox="0 0 24 24"><path d="M9 18V5l10-2v12"/><circle class="fill" cx="6.5" cy="18" r="2.5"/><circle class="fill" cx="16.5" cy="15" r="2.5"/></svg>',
    chords: '<svg viewBox="0 0 24 24"><circle class="fill" cx="8" cy="18" r="2.4"/><circle class="fill" cx="8" cy="12.5" r="2.4"/><circle class="fill" cx="8" cy="7" r="2.4"/><path d="M10.4 18V3.5"/><path d="M14.5 8h6M14.5 12.5h6M14.5 17h6"/></svg>',
    voice: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>',
    empty: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" stroke-dasharray="2.5 2.5"/></svg>',
    split: '<svg viewBox="0 0 24 24"><path d="M12 4v16"/><path d="M8.5 12H2.5M5.5 9l-3 3 3 3"/><path d="M15.5 12h6M18.5 9l3 3-3 3"/></svg>',
    // the Virtual Keyboard's
    mute: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
    muted: '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>',
    loop: '<svg viewBox="0 0 24 24"><path d="M17 2.5 20.5 6 17 9.5"/><path d="M3.5 12v-1.5A4.5 4.5 0 0 1 8 6h12.5"/><path d="M7 21.5 3.5 18 7 14.5"/><path d="M20.5 12v1.5A4.5 4.5 0 0 1 16 18H3.5"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h6"/></svg>',
    zoomAll: '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M7.5 10.5h6M10.5 7.5v6"/></svg>'
  };
  const FROM_NAME = { 'ostinato-builder': 'Ostinato Builder', 'song-writer': 'Song Writer' };

  function trackName(tr) {
    if (tr.name) return tr.name;
    /* a Song Writer part (from.part = its name; 'melody' for a one-part song) is named
       part first, so a narrow track column still tells Part 1 from Part 2 */
    if (tr.from && tr.from.title && tr.kind === 'melody' && tr.from.part && tr.from.part !== 'melody') return tr.from.part + ' · ' + tr.from.title;
    if (tr.from && tr.from.title) return tr.from.title + (tr.kind === 'melody' ? ' · melody' : tr.kind === 'chords' ? ' · chords' : '');
    if (tr.kind && hasContent(tr)) return KINDS[tr.kind].label;
    return 'Empty';
  }

  // A click on a lane moves the start to the nearest bar line.
  function placeStart(clientX, wrap) {
    const rect = wrap.getBoundingClientRect();
    const bpb = barBeats();
    const beat = view.start + (clientX - rect.left) / pxPerBeat(rect.width);
    R.pos = clamp(Math.round(beat / bpb) * bpb, songStart(), fit.end - bpb);
    renderPos();
  }
  // i: the track's number from 0; the ruler has none.
  function makeLane(cls, i) {
    const wrap = document.createElement('div');
    wrap.className = 'lane ' + cls;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const headEl = document.createElement('div');
    headEl.className = 'rec-head';
    wrap.append(canvas, headEl);
    wrap.addEventListener('pointerdown', (e) => {
      if (e.button > 0 || pinch) return;
      if (i == null) { if (!busy()) scrubStart(e, wrap); return; }
      if (ed) { if (i === ed.i) editPress(e); return; }   // the note editor is open
      if (doubleTap(e, i)) return;                        // the second press of a double-click opens the note editor
      if (!busy() && grabTake(e, i)) return;              // a press on a take or part: dragging it, or (let go where it was) a click
      grabLane(e, wrap);
    });
    // over a part, the pointer says what a drag there does
    if (i != null) {
      wrap.addEventListener('pointermove', (e) => {
        if (ed) { if (i === ed.i && !e.buttons) editCursor(e, wrap); return; }
        if (takeEdit || e.buttons) return;
        if (cutMode) { wrap.style.cursor = ''; hoverCut(e, i); return; }
        const hit = busy() ? null : takeAt(e, i);
        wrap.style.cursor = !hit ? (win ? 'grab' : '') : hit.how === 'move' ? 'grab' : 'ew-resize';
      });
      wrap.addEventListener('pointerleave', () => { if (cutHover && cutHover.i === i) { cutHover = null; drawLane(i); } });
    }
    return { wrap, canvas, head: headEl };
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
      document.body.classList.remove('panning');
    };
    const move = (ev) => {
      if (ev.pointerId !== id) return;
      if (pinch) { finish(); return; } // a second finger: zooming instead
      if (!moved) {
        if (!win || Math.abs(ev.clientX - x0) < 6) return;
        moved = true;
        try { wrap.setPointerCapture(id); } catch (err) {}
        document.body.classList.add('panning');
      }
      panTo(at0 - (ev.clientX - x0) / pxPerBeat(wrap.clientWidth));
    };
    const up = (ev) => {
      if (ev.pointerId !== id) return;
      finish();
      if (!moved && ev.type === 'pointerup' && !busy() && !pinch) {
        if (cutMode) { cutHere(ev, rows.findIndex(r => r.wrap === wrap)); return; }
        placeStart(ev.clientX, wrap);
        select(null);
      }
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
  }

  // -------- MOVING AND SIZING TAKES AND PARTS --------
  // Drag a voice take or a part's middle to move it, or one of its ends to
  // size it — by beats (by bars when the beats are too close together to aim
  // at; Option/Alt: freely). A loop's end pulls out as far as you like, the
  // pass going round; a straight part's ends open only as far as what was
  // played, a take's as far as its recording. One moved or widened over
  // another covers it, by the tape rules (the one covered keeps everything
  // it holds too).
  let takeEdit = null;     // { i, g } while a take or part is being dragged
  function takeAt(e, i) {
    const tr = P.tracks[i], l = rows[i];
    if (!tr || !l) return null;
    const audio = isAudio(tr);
    const list = audio ? tr.regions : tr.clips;
    const u = audio ? 60 / P.tempo : 1;   // a window's units in a beat: seconds for a take, beats for a part
    const rect = l.wrap.getBoundingClientRect();
    const ppb = pxPerBeat(rect.width), x = e.clientX - rect.left;
    const grab = e.pointerType === 'touch' ? 14 : 8;
    for (let k = list.length - 1; k >= 0; k--) {
      const g = list[k];
      const x0 = (g.b - view.start) * ppb, x1 = x0 + g.d / u * ppb;
      if (x < x0 - 4 || x > x1 + 4) continue;
      const edge = Math.min(grab, (x1 - x0) / 3);
      return { g, rect, ppb, u, audio, how: x <= x0 + edge ? 'start' : x >= x1 - edge ? 'end' : 'move' };
    }
    return null;
  }

  // -------- THE HIGHLIGHTED TAKE OR PART --------
  // A press on a take or part highlights it: ringed on its lane, the Quantize
  // button speaks for it, and Delete (or the trash) removes it. A press on
  // empty lane, Escape, or the next take lets it go. It is remembered by track
  // and start beat, so it survives the tracks being rebuilt or undone.
  function selected() {
    if (!sel) return null;
    const i = P.tracks.findIndex(t => t.id === sel.tid);
    const tr = P.tracks[i];
    if (!tr) return null;
    const audio = isAudio(tr);
    const g = (audio ? tr.regions : tr.clips).find(x => Math.abs(x.b - sel.b) < 1e-9);
    return g ? { i, tr, g, audio } : null;
  }
  function select(hit) {   // hit: { tr, g } or null
    const was = selected();
    sel = hit ? { tid: hit.tr.id, b: hit.g.b } : null;
    const now = selected();
    renderQuant();
    if (was && (!now || was.i !== now.i)) { drawLane(was.i); renderCtl(was.i); }
    if (now) { drawLane(now.i); renderCtl(now.i); }
  }
  function checkSel() { if (sel && !selected()) sel = null; }
  function deleteSelected() {
    const s = selected();
    if (!s || busy()) return;
    pushUndo(`deleting ${s.audio ? 'the take' : 'the part'} on track ${s.i + 1}`);
    if (s.audio) s.tr.regions = s.tr.regions.filter(x => x !== s.g);
    else { s.tr.clips = s.tr.clips.filter(x => x !== s.g); partsView(s.tr); }
    sel = null;
    afterProjectChange(true);
    toast(`Deleted ${s.audio ? 'the take' : 'the part'} on track ${s.i + 1} — Undo brings it back.`);
  }

  function grabTake(e, i) {
    if (cutMode) return cutHere(e, i);
    const hit = takeAt(e, i);
    if (!hit) return false;
    const tr = P.tracks[i], g = hit.g, u = hit.u, bpb = barBeats();
    select({ tr, g });
    const wrap = rows[i].wrap, id = e.pointerId, startX = e.clientX;
    const was = { b: g.b, o: g.o, d: g.d };
    const c = hit.audio ? StudioVoice.clip(g.c) : null;
    // how far the box can open: the whole recording (one not loaded yet can't
    // be opened up), or everything the part holds (a loop: as far as you like)
    const full = hit.audio ? (c ? c.data.length / c.rate : g.o + g.d) : g.loop ? PART_MAX : g.len;
    const least = hit.audio ? TAKE_MIN : PART_MIN;
    const looked = () => { if (!hit.audio) partsView(tr); queueDraw(); };
    const grid = snapGrid(hit.ppb);   // fixed for the drag, however the view moves
    const snap = (x, free) => (free ? x : Math.round(x / grid) * grid);
    const beatAt = (ev) => { const r = wrap.getBoundingClientRect(); return view.start + (ev.clientX - r.left) / pxPerBeat(r.width); };
    const grabbed = beatAt(e);
    let on = false;
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
      if (pinch) { up(Object.assign(new Event('pointercancel'), { pointerId: id })); return; }   // a second finger: zooming, not dragging
      if (!on) {
        if (Math.abs(ev.clientX - startX) < 4) return;
        on = true;
        try { wrap.setPointerCapture(id); } catch (err) {}
        takeEdit = { i, g };
        document.body.classList.add(hit.how === 'move' ? 'moving-part' : 'sizing-part');
      }
      ev.preventDefault();
      last = { clientX: ev.clientX, altKey: ev.altKey };
      if (side(ev) && !timer) { timer = setInterval(slide, 40); slide(); return; }
      place(ev);
    };
    const place = (ev) => {
      const at = beatAt(ev), free = !!ev.altKey;
      if (hit.how === 'move') {
        g.b = Math.max(-bpb, was.b + snap(at - grabbed, free));
      } else if (hit.how === 'start') {
        let b = snap(at, free);
        b = clamp(b, Math.max(-bpb, g.loop ? was.b + was.d - PART_MAX : was.b - was.o / u), was.b + (was.d - least) / u);
        const ds = (b - was.b) * u;
        g.b = b; g.o = g.loop ? mod(was.o + ds, g.loop) : was.o + ds; g.d = was.d - ds;
      } else {
        const end = snap(at, free);
        g.d = clamp((end - was.b) * u, least, g.loop ? PART_MAX : full - was.o);
      }
      if (!hit.audio) partsView(tr);
      // zoomed out and pulled to an edge of the lanes: they make room
      const e1 = g.b + g.d / u;
      if (!win && (g.b < fit.start || e1 > fit.end - 0.5)) {
        fit.start = Math.min(fit.start, Math.floor(g.b / bpb) * bpb);
        fit.end = Math.max(fit.end, Math.ceil(e1 / bpb) * bpb + bpb);
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
      takeEdit = null;
      document.body.classList.remove('moving-part', 'sizing-part');
      if (!on) { if (ev.type !== 'pointercancel') placeStart(ev.clientX, wrap); return; }   // a click on a part: Play starts at that bar, and it stays highlighted
      const now = { b: g.b, o: g.o, d: g.d };
      Object.assign(g, was);
      if (ev.type === 'pointercancel' || (now.b === was.b && now.o === was.o && now.d === was.d)) { looked(); renderAll(); return; }
      pushUndo(`${hit.how === 'move' ? 'moving' : 'sizing'} ${hit.audio ? 'the take' : 'the part'} on track ${i + 1}`);
      Object.assign(g, now);
      if (hit.audio) {
        tr.regions = tr.regions.filter(r => r !== g);
        cutRegions(tr, g.b, regionEnd(g));
        tr.regions.push(g);
        tr.regions.sort(byBeat);
      } else {
        tr.clips = tr.clips.filter(k => k !== g);
        cutParts(tr, g.b, g.b + g.d);
        tr.clips.push(g);
        tr.clips.sort(byBeat);
        partsView(tr);
      }
      sel = { tid: tr.id, b: g.b };
      afterProjectChange(true);
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerup', up);
    wrap.addEventListener('pointercancel', up);
    return true;
  }

  // -------- SPLITTING --------
  // The Split button lights up; over the lanes the pointer is a pair of
  // scissors and a line on the take or part under it shows where the cut
  // would fall (on the drag grid; Option/Alt anywhere). A press cuts it in two
  // and the button goes out again — only a cut, or the button, turns it off.
  function setCutMode(on) {
    cutMode = !!on;
    if (!cutMode && cutHover) { const i = cutHover.i; cutHover = null; drawLane(i); }
    renderCut();
  }
  function renderCut() {
    document.body.classList.toggle('cutting', cutMode);
    if (zoomUI) zoomUI.cut.setAttribute('aria-pressed', String(cutMode));
  }
  // Where the scissors would cut on track i: { g, beat, audio, u } or null
  // when there is no take or part under them (or too little on one side).
  function cutAt(e, i) {
    const tr = P.tracks[i], l = rows[i];
    if (!tr || !l || busy()) return null;
    const audio = isAudio(tr);
    const list = audio ? tr.regions : tr.clips;
    const u = audio ? 60 / P.tempo : 1, least = (audio ? TAKE_MIN : PART_MIN) / u;   // in beats
    const rect = l.wrap.getBoundingClientRect(), ppb = pxPerBeat(rect.width);
    let beat = view.start + (e.clientX - rect.left) / ppb;
    if (!e.altKey) { const grid = snapGrid(ppb); beat = Math.round(beat / grid) * grid; }
    for (let k = list.length - 1; k >= 0; k--) {
      const g = list[k];
      if (beat - g.b >= least - 1e-9 && g.b + g.d / u - beat >= least - 1e-9) return { g, beat, audio, u };
    }
    return null;
  }
  function hoverCut(e, i) {
    const hit = cutAt(e, i), was = cutHover;
    cutHover = hit ? { i, beat: hit.beat } : null;
    if (was && (!cutHover || was.i !== i)) drawLane(was.i);
    if (cutHover && (!was || was.i !== i || was.beat !== cutHover.beat)) drawLane(i);
  }
  function drawCut(i) {
    if (!cutHover || cutHover.i !== i) return;
    const l = rows[i];
    if (!l || !l.w) return;
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    const x = Math.round((cutHover.beat - view.start) * pxPerBeat(l.w));
    g.fillStyle = cssVar('--accent');
    g.fillRect(x - 1, 0, 2, l.h);
    g.beginPath(); g.moveTo(x - 5, 0); g.lineTo(x + 5, 0); g.lineTo(x, 6); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x - 5, l.h); g.lineTo(x + 5, l.h); g.lineTo(x, l.h - 6); g.closePath(); g.fill();
  }
  // A press on a lane with the scissors: cut the take or part under them in
  // two. Both halves keep the whole recording (a take) or their own notes (a
  // part: the notes before the cut go left, the rest right), so an end
  // dragged back out opens a take up again. True = the press was taken.
  function cutHere(e, i) {
    const hit = cutAt(e, i);
    if (!hit) { if (!busy()) toast('Press on a take or a part to split it there.'); return true; }
    const tr = P.tracks[i], g = hit.g, cut = (hit.beat - g.b) * hit.u;   // into the window, in its units
    pushUndo(`splitting ${hit.audio ? 'the take' : 'the part'} on track ${i + 1}`);
    const left = { ...g, d: cut }, right = { ...g, b: hit.beat, o: g.loop ? mod(g.o + cut, g.loop) : g.o + cut, d: g.d - cut };
    if (!hit.audio) {
      delete left.was; delete right.was;
      if (g.loop) { left.items = copyItems(g.items); right.items = copyItems(g.items); if (g.raw) { left.raw = copyItems(g.raw); right.raw = copyItems(g.raw); } }
      else {
        const at = g.o + cut;
        left.items = g.items.filter(n => n.b < at).map(n => ({ ...n }));
        right.items = g.items.filter(n => n.b >= at).map(n => ({ ...n }));
        if (g.raw) { left.raw = copyItems(g.raw); right.raw = copyItems(g.raw); }
      }
    }
    const list = hit.audio ? tr.regions : tr.clips;
    list.splice(list.indexOf(g), 1, left, right);
    list.sort(byBeat);
    if (!hit.audio) partsView(tr);
    sel = { tid: tr.id, b: left.b };
    cutHover = null;
    setCutMode(false);
    afterProjectChange(true);
    return true;
  }

  // -------- THE LOOP BUTTON --------
  function setLoop(i, on) {
    const tr = P.tracks[i];
    if (busy() || tr.loop === on || isAudio(tr)) return;
    if (tr.clips.length) pushUndo(`${on ? 'looping' : 'un-looping'} track ${i + 1}`);
    tr.loop = on;
    tr.clips = on ? tr.clips.map(c => toLoop(c, isHits(tr))) : unloopAll(tr.clips, isHits(tr));
    partsView(tr);
    renderAll();
    save();
    toast(on
      ? `Track ${i + 1} loops: drag the end of a part out to repeat it.`
      : `Track ${i + 1} plays straight through: drag a part's ends to size it.`);
  }

  // -------- THE TRASH --------
  // A part highlighted on this track: just that part goes. Else the track is
  // cleared; an empty track is taken away (Undo brings any of it back).
  function trashTrack(i) {
    if (busy()) return;
    const tr = P.tracks[i], s = selected();
    if (s && s.i === i) { deleteSelected(); return; }
    if (hasContent(tr)) {
      pushUndo(`clearing track ${i + 1}`);
      P.tracks[i] = Object.assign(blankTrack(), { id: tr.id, volume: tr.volume });
      afterProjectChange(true);
      toast(`Track ${i + 1} cleared. Undo brings it back.`);
      return;
    }
    if (P.tracks.length <= 1) return;
    pushUndo(`removing track ${i + 1}`);
    P.tracks.splice(i, 1);
    if (R.armed >= i && R.armed > 0) R.armed--;
    afterProjectChange(true);
    toast('Track removed. Undo brings it back.');
  }

  // -------- THE NOTE EDITOR (the Virtual Keyboard's) --------
  // A double-click (or double-tap) on a track opens it out: the other tracks
  // step aside, the track fills their room, and its notes lie on rows of
  // pitch, with the piano's keys down the left. Drag a note along (when it
  // plays) or up and down (which note it is); drag its right end to make it
  // longer or shorter. A drag across empty space highlights every note it
  // crosses, and highlighted notes move, size, copy and delete together.
  // Paste lays the copied notes down at the dashed line: a click on an empty
  // spot puts the line there, and after Copy it waits just after what was
  // copied. Save Changes keeps it all (one step of the studio's Undo);
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
  const editInfo = el('rec-edit-info'), editDone = el('rec-edit-done');
  const editBtns = { copy: el('rec-edit-copy'), paste: el('rec-edit-paste'), del: el('rec-edit-delete'), save: el('rec-edit-save'), cancel: el('rec-edit-cancel') };
  let ed = null;          // the editor, open: see openEditor
  let clipboard = null;   // { notes: [{ m, b, d, s, v }] from 0, span }: kept while the page is open, for any track
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
    const copy = list => list.map(n => { const x = { ...n }; map.set(n, x); return x; });
    const out = clips.map(c => {
      const p = { ...c, items: copy(c.items) };
      if (c.raw) p.raw = copyItems(c.raw);
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
  // a note's own sound and level travel with it (w: a view with the note's fields)
  const noteOf = (w, b, d) => { const n = { m: w.m, b, d }; if (w.s) n.s = w.s; if (w.v != null && w.v !== 1) n.v = w.v; return n; };

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
    let W = editViews(clips).map(v => ({ m: v.m, b: v.b, d: v.d, s: v.n.s, v: v.n.v, home: v.c, on: sel.has(v.n), moved: false }));
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
      op.notes.forEach(p => W.push({ m: p.m, b: p.b, d: p.d, s: p.s, v: p.v, home: null, on: true, moved: true }));
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
      const items = x.notes.map(w => { const n = noteOf(w, w.b - x.lo, w.d); if (w.on) newSel.add(n); return n; });
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
        const n = noteOf(p, t, Math.max(MIN_HOLD, Math.min(p.d, L - t)));
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
          const part = toLoop(makePart(fits, lo, hi), false);
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
    const tr = P.tracks[i];
    if (ed || R.state === 'recording' || R.state === 'priming' || !tr || !editable(tr)) return;
    if (busy()) stopRun();
    select(null);
    ed = {
      i,
      before: JSON.stringify(tr.clips),                       // Cancel's track
      saved: { clips: JSON.parse(JSON.stringify(tr.clips)), notes: tr.notes.map(n => ({ ...n })), hits: [] }, // what autosave keeps meanwhile
      view0: { win, viewAt },                                 // the view to go back to
      undo: [], sel: new Set(), caret: part ? part.b : R.pos,
      top: 72, rowH: 12, h: 0, lo: EDIT_LO, hi: EDIT_HI,
      preview: null, box: null, hits: [], gesture: null, drop: null,
      ladder: rows[i].ladder
    };
    tracksEl.classList.add('editing');
    document.body.classList.add('rec-editing');   // the instrument steps away too: the notes get its room
    rows[i].row.classList.add('editing');
    rows[i].wrap.title = '';
    editInfo.style.setProperty('--tc', TRACK_COLORS[i % TRACK_COLORS.length]);
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
    if (!sessionGet('edit-tip')) {
      sessionSet('edit-tip');
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
    tracksEl.classList.remove('editing');
    document.body.classList.remove('rec-editing', 'moving-note', 'sizing-note', 'boxing');
    rows[e.i].row.classList.remove('editing');
    rows[e.i].wrap.style.cursor = '';
    win = e.view0.win;
    viewAt = e.view0.viewAt;
    setHead(head); // the track heads' own width again
    renderAll();
    if (changed) {
      save();
      toast(keep ? `Saved the changes to track ${e.i + 1}. Undo takes them back.` : `Cancelled: track ${e.i + 1} is as it was.`);
    }
  }
  // While the editor is open: Save Changes or Cancel first.
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
    const tr = P.tracks[i];
    if (!editable(tr)) {
      if (hasContent(tr)) toast(isAudio(tr) ? 'A voice take is sound, not notes: drag its ends to trim it, or Split it.' : 'An ostinato’s hits are not edited one by one here: drag the part, or pull its end to repeat it.');
      return false;
    }
    if (cutMode) return false;
    const hit = takeAt(e, i);
    e.preventDefault();
    if (!busy()) { R.pos = t.pos; renderPos(); } // the first click moved where Play starts: it was only half of this
    openEditor(i, hit ? hit.g : null);
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
    const l = rows[ed.i];
    ed.top = clamp(t, ed.lo - 1 + (l.h || 0) / ed.rowH, ed.hi);
  }
  // Rows sized so the track's notes (and some room) fit, centred on them.
  function fitRows(center) {
    const l = rows[ed.i];
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
    const l = rows[ed.i];
    if (!l.h || Math.abs(l.h - ed.h) < 1) return;
    fitRows(ed.h ? ed.top - ed.h / ed.rowH / 2 : null);
  }
  // Bring notes into sight: along the song, and up or down the rows.
  function revealNotes(vs) {
    if (!vs.length) return;
    const l = rows[ed.i];
    reveal(vs[0].b);
    const top = Math.max(...vs.map(v => v.m)), bot = Math.min(...vs.map(v => v.m)) - 1;
    if (top > ed.top || bot < ed.top - l.h / ed.rowH) setTop((top + bot) / 2 + l.h / ed.rowH / 2);
    queueDraw();
  }

  // -- the grid notes move on --
  // the finest of beat, 8th and 16th (thirds and sixths of the beat in x/8)
  // that the zoom spreads 12 px or more apart
  function noteGrid() {
    const ppb = pxPerBeat(rows[ed.i].w || 1);
    let s = 1;
    (compound() ? [1, 1 / 3, 1 / 6] : [1, 1 / 2, 1 / 4]).forEach(d => { if (d * ppb >= 12) s = d; });
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

  // A note heard as it is picked up or moved to another row, in the track's sound.
  let auditionBus = null;
  function audition(m) {
    try {
      const ctx = wakeAudio(), tr = P.tracks[ed.i];
      const preset = notePreset(tr, tr.notes[0]);
      if (engineOf(tr) === 'strikes') {
        if (!auditionBus || auditionBus.context !== ctx) auditionBus = Xylo.bus(ctx, ctx.destination);
        Xylo.strike(auditionBus, midiFreq(m), preset, ctx.currentTime + 0.005, prefs.volume);
      } else {
        Audio.setLevel('audition', BASE * prefs.volume);
        Audio.schedule('audition', [midiFreq(m)], preset, ctx.currentTime + 0.005, 0.28, 0.9);
      }
    } catch (err) {}
  }

  // -- pressing in the editor --
  // Where a pointer is over the edited lane: px across and down its canvas,
  // the beat there, and the pitch (in rows, continuous).
  function editPoint(ev) {
    const l = rows[ed.i], r = l.canvas.getBoundingClientRect();
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
    const l = rows[ed.i], wrap = l.wrap, id = e.pointerId;
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
    // so nothing shifting on the page can move a note.
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
          ed.preview = applyEdit({ kind: 'add', notes: from.map(v => ({ m: v.m + c.dm, b: v.b + c.dt, d: v.d, s: v.n.s, v: v.n.v })) });
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
        document.body.classList.add(g.kind === 'size' ? 'sizing-note' : g.kind === 'box' ? 'boxing' : 'moving-note');
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
      document.body.classList.remove('moving-note', 'sizing-note', 'boxing');
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
    clipboard = { notes: vs.map(v => ({ m: v.m, b: v.b - lo, d: v.d, s: v.n.s, v: v.n.v })), span: Math.max(1, Math.ceil(hi - lo - EARLY)) };
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
    commitEdit(applyEdit({ kind: 'add', notes: clipboard.notes.map(n => ({ ...n, b: at + n.b })) }));
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
  ['copy', 'paste', 'del'].forEach(k => editBtns[k].setAttribute('aria-label', editBtns[k].textContent.trim()));

  function renderEditBar() {
    if (!ed) return;
    const tr = P.tracks[ed.i], n = ed.sel.size;
    el('rec-edit-num').textContent = String(ed.i + 1);
    el('rec-edit-title').textContent = `Track ${ed.i + 1} · ${trackName(tr)}` + (tr.sound ? ` · ${soundName(tr, tr.sound)}` : '');
    editBtns.copy.disabled = editBtns.del.disabled = !n;
    editBtns.paste.disabled = !clipboard;
    editBtns.save.disabled = false;
    const grid = P.quant.on ? 'Quantize on: notes land on the beat lines.' : 'Quantize off: notes go just where you put them.';
    const hint = (n
      ? `${n === 1 ? 'One note' : n + ' notes'} highlighted: drag ${n === 1 ? 'it' : 'them'}, or press ← → ↑ ↓. `
      : 'Drag a note to move it, its right end to resize it, or across empty space to highlight several. ')
      + (tr.loop ? 'Every pass of the loop changes together. ' : '') + grid;
    el('rec-edit-hint').textContent = hint;
    editInfo.title = el('rec-edit-title').textContent + ' — ' + hint;
  }

  // -------- THE QUANTIZE BUTTON --------
  // The first press asks for the choices (Confirm turns it on); after that it
  // says Quantize with a pencil beside it, which asks again. On, each take is
  // put on the rhythm as it is kept; off, takes stay as played — and what is
  // already quantized stays so (Undo takes that back). With a part
  // highlighted the button speaks for that part: off while it is as played,
  // and pressed then, it asks to quantize it. "The entire project" quantizes
  // every part on every track, whenever Quantize is turned on with it.
  const qWrap = el('rec-quant'), qBtn = el('rec-quant-btn'), qEdit = el('rec-quant-edit');
  const qOk = el('quant-ok'), qAlt = el('quant-alt'), qAll = el('quant-all');
  let qMode = null; // what the sheet asks: 'setup' (the first time), 'edit' (the pencil), 'part' (the highlighted part)
  const qRadio = (name, v) => document.querySelector(`input[name="${name}"][value="${v}"]`);
  // the highlighted part, when Quantize can speak for it (a voice take is sound)
  const selPart = () => { const s = selected(); return s && !s.audio ? s : null; };

  function barOf(b) {
    const bar = Math.floor(b / barBeats() + 1e-6) + 1;
    return bar < 1 ? 'the pick-up' : 'bar ' + bar;
  }
  function renderQuant() {
    if (!P) return;
    const Q = P.quant, s = selPart(), part = s && s.g;
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
    el('quant-feel-note').textContent = compound()
      ? `${P.meter} already goes in threes: Quarter keeps to its beat (a dotted quarter), and swing and triplets stay off.`
      : c.grid === 4 ? 'Swing needs the 8th or 16th rhythm.' : c.grid === 8 ? 'Swing 16th needs the 16th rhythm.' : '';
    if (qMode === 'part') {
      qOk.textContent = c.all ? 'Quantize the entire project' : 'Quantize this part';
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
      ? `The part on track ${part.i + 1}, at ${barOf(part.g.b)}, is as you played it. Quantize puts its notes exactly on the rhythm below.`
      : 'Notes you record land exactly on the rhythm below: where each note starts moves, its length stays.';
    qOk.textContent = part ? 'Quantize this part' : 'Confirm';
    qAlt.hidden = !part;
    // in the note editor it speaks for the highlighted notes, not the whole project
    qAll.closest('.quant-all').hidden = !!ed;
    if (ed && mode === 'setup') el('quant-intro').textContent = 'With Quantize on, notes you move land on the beat lines, the highlighted notes go onto the rhythm below, and so do notes you record.';
    renderQuantSheet();
    openSheet('quant-sheet');
  }
  document.querySelectorAll('input[name="quant-grid"], input[name="quant-feel"], #quant-all')
    .forEach(r => r.addEventListener('change', renderQuantSheet));

  const quantizable = tr => !isAudio(tr);
  function quantizeSong() {
    const Q = P.quant;
    const open = P.tracks.filter(quantizable);
    if (!open.some(tr => tr.clips.length)) { toast(`Quantize is on: new recordings land on ${quantWords(Q)}.`); return; }
    if (open.every(tr => tr.clips.every(c => sameQ(c.q, Q)))) { toast(`Quantize is on: the whole project is on ${quantWords(Q)}.`); return; }
    pushUndo('quantizing the whole project');
    open.forEach(tr => { tr.clips.forEach(c => quantizePart(c, Q)); partsView(tr); });
    renderAll();
    save();
    toast(`The whole project is quantized to ${quantWords(Q)}. Undo takes it back.`);
  }
  function quantizeOne(s) {
    pushUndo(`quantizing the part on track ${s.i + 1}`);
    quantizePart(s.g, P.quant);
    partsView(s.tr);
    renderAll();
    save();
    toast(`Quantized to ${quantWords(P.quant)}. Undo takes it back.`);
  }

  qOk.addEventListener('click', () => {
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
    const c = choice();
    Object.assign(P.quant, { grid: c.grid, feel: c.feel, all: false, set: true, on: true });
    closeSheet('quant-sheet');
    toast(`Quantize is on for new recordings (${quantWords(P.quant)}). This part stays as played.`);
    renderQuant();
    save();
  });

  qBtn.addEventListener('click', () => {
    if (ed) { editQuantPress(); return; }
    if (busy()) return;
    const Q = P.quant, s = selPart(), part = s && s.g;
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
  qEdit.addEventListener('click', () => { if (!busy() || ed) openQuant('edit'); });

  // In the note editor the button turns snapping on and off: on, notes moved
  // land on the beat lines; turned on with notes highlighted that are off
  // the rhythm, those go onto it (one step of the editor's Undo). It is the
  // same switch as for recording: on here, new takes are quantized too.
  function editQuantPress() {
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

  // -------- NARROWER TRACK HEADS --------
  // The handle between the heads and the lanes drags them narrower (and
  // wider again), settling on the nearest of the three; a click on it goes to
  // the next. Kept per device.
  function setHead(h) {
    if (!HEADS.includes(h)) return;
    const changed = h !== head;
    head = h;
    tracksEl.dataset.head = h;
    tracksEl.style.setProperty('--head-w', HEAD_W[h] + 'px');
    if (grip) {
      grip.setAttribute('aria-valuenow', String(HEADS.length - HEADS.indexOf(h)));
      grip.setAttribute('aria-valuetext', { full: 'All the track controls', name: 'Number, sound, mute and loop', small: 'Number, mute and loop' }[h]);
    }
    if (!changed) return;
    try { localStorage.setItem(HEAD_KEY, h); } catch (e) {}
    sizeLanes();
    drawAll();
  }
  function makeGrip() {
    const g = document.createElement('div');
    g.className = 'grip';
    g.tabIndex = 0;
    g.setAttribute('role', 'separator');
    g.setAttribute('aria-orientation', 'vertical');
    g.setAttribute('aria-label', 'Track controls: drag narrower or wider');
    g.setAttribute('aria-valuemin', '1');
    g.setAttribute('aria-valuemax', String(HEADS.length));
    g.title = 'Drag to show fewer or more track controls';
    g.innerHTML = '<span class="grip-pill"></span>';
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

  // -------- THE TRACK LIST --------
  function buildTracks() {
    tracksEl.innerHTML = '';
    const rulerRow = document.createElement('div');
    rulerRow.className = 'row ruler-row';
    makeZoomUI();
    ruler = makeLane('ruler', null);
    rulerRow.append(zoomUI.corner, ruler.wrap);
    tracksEl.appendChild(rulerRow);

    rows = P.tracks.map((tr, i) => {
      const row = document.createElement('div');
      row.className = 'row track';
      row.style.setProperty('--tc', TRACK_COLORS[i % TRACK_COLORS.length]);
      const ctl = document.createElement('div');
      ctl.className = 'ctl';

      // the number: press to arm the track, drag up or down to move it in the list
      const arm = document.createElement('button');
      arm.type = 'button';
      arm.className = 'arm';
      arm.innerHTML = `<span class="arm-dot"></span><span class="arm-num">${i + 1}</span>`;
      arm.addEventListener('pointerdown', (e) => dragTrack(e, i));
      arm.addEventListener('click', () => { if (performance.now() - dragEnded > 300) armTrack(i); });

      // the sound (a track that records), or the track's name
      const slot = document.createElement('div');
      slot.className = 'slot';

      const mute = document.createElement('button');
      mute.type = 'button';
      mute.className = 'rec-icon-btn mute';
      mute.addEventListener('click', () => { P.tracks[i].muted = !P.tracks[i].muted; applyLevels(); renderCtl(i); drawLane(i); save(); });

      const solo = document.createElement('button');
      solo.type = 'button';
      solo.className = 'rec-icon-btn solo';
      solo.textContent = 'S';
      solo.addEventListener('click', () => { P.tracks[i].solo = !P.tracks[i].solo; applyLevels(); renderCtls(); drawAll(); save(); });

      const vol = document.createElement('input');
      vol.type = 'range';
      vol.className = 'vol';
      vol.min = 0; vol.max = 100; vol.step = 1;
      vol.setAttribute('aria-label', `Track ${i + 1} volume`);
      vol.addEventListener('input', () => { P.tracks[i].volume = vol.value / 100; applyLevels(); vol.title = vol.value + '%'; save(); });

      const loop = document.createElement('button');
      loop.type = 'button';
      loop.className = 'rec-icon-btn loop';
      loop.innerHTML = ICON.loop;
      loop.addEventListener('click', () => setLoop(i, !P.tracks[i].loop));

      const trash = document.createElement('button');
      trash.type = 'button';
      trash.className = 'rec-icon-btn trash';
      trash.innerHTML = ICON.trash;
      trash.addEventListener('click', () => trashTrack(i));

      // the note editor's piano keys, in the head's place while it is open
      const ladder = document.createElement('div');
      ladder.className = 'ladder';
      ladder.title = 'Press a key to hear it; drag up or down for higher or lower notes';
      ladder.appendChild(document.createElement('canvas'));
      ladder.addEventListener('pointerdown', ladderPress);

      ctl.append(arm, slot, mute, solo, vol, loop, trash, ladder);
      const lane = makeLane('track-lane', i);
      row.append(ctl, lane.wrap);
      tracksEl.appendChild(row);
      return { row, ctl, arm, slot, mute, solo, vol, loop, trash, ladder, wrap: lane.wrap, canvas: lane.canvas, head: lane.head };
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
    tracksEl.appendChild(zoomUI.row);
    grip = makeGrip();
    tracksEl.appendChild(grip);
    if (ed) {   // the editor stays open through a rebuild (an undo of its own, a take recovered)
      tracksEl.classList.add('editing');
      if (rows[ed.i]) { rows[ed.i].row.classList.add('editing'); ed.ladder = rows[ed.i].ladder; }
      tracksEl.style.setProperty('--head-w', editHeadW() + 'px');
      tracksEl.dataset.head = head;
    } else {
      setHead(head);
    }
  }

  // Drag a track by its number, up or down, to put it somewhere else in the
  // list. The rows in between make room as it goes; a press that doesn't
  // move is still a click (it arms the track).
  let dragEnded = 0;
  function dragTrack(e, i) {
    if (busy() || ed || e.button > 0 || P.tracks.length < 2) return;
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
      toast(tr.from ? `Brought in from ${FROM_NAME[tr.from.app] || 'another app'}: it plays along, but is not recorded onto. Press its name to change its sound.` : 'This track cannot be recorded onto.');
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

  // -------- THE TRACK HEADS --------
  // The second slot of a head: a track that records (keyboard, accordion,
  // xylophone) has a sound menu there, as in the Virtual Keyboard; a song
  // brought in from Song Writer has its name, a button that opens a little
  // window with the sound; an ostinato or a voice has its name; an empty
  // track says what it is for.
  const soundOptions = tr => (engineOf(tr) === 'strikes'
    ? Xylo.SOUNDS.map(([id, label]) => [id, label])
    : Audio.PRESET_ORDER.map(id => [id, Audio.PRESETS[id].name]));
  function soundName(tr, id) {
    const o = soundOptions(tr).find(x => x[0] === id);
    return o ? o[1] : id;
  }
  function slotMode(i) {
    const tr = P.tracks[i];
    if (!hasContent(tr)) return 'empty';
    const eng = engineOf(tr);
    if ((eng === 'notes' && recordable(tr)) || eng === 'strikes') return 'select';
    if (tr.kind === 'melody' || tr.kind === 'chords') return 'song';
    return 'label';
  }
  function renderSlot(i) {
    const c = rows[i], tr = P.tracks[i], mode = slotMode(i);
    const armed = i === R.armed && recordable(tr);
    const kind = tr.kind && hasContent(tr) ? tr.kind : armed ? R.inst : null;
    if (c.slot.dataset.mode !== mode) {
      c.slot.dataset.mode = mode;
      c.slot.innerHTML = '';
      if (mode === 'select') {
        const s = document.createElement('select');
        s.className = 'select rec-sound';
        s.innerHTML = `<option value="">As played</option>` + soundOptions(tr).map(([id, label]) => `<option value="${id}">${esc(label)}</option>`).join('');
        s.setAttribute('aria-label', `Track ${i + 1} sound`);
        s.addEventListener('change', () => {
          const t = P.tracks[i];
          t.sound = s.value || null;
          if (i === R.armed && t.sound && window.StudioLink) StudioLink.setSound(t.kind, t.sound);
          s.blur();
          if (window.StudioLink) StudioLink.focus();   // hand the computer keyboard back to the instrument
          save();
        });
        c.slot.appendChild(s);
      } else if (mode === 'song') {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'tname';
        b.addEventListener('click', (e) => { e.stopPropagation(); openSoundPop(i, b); });
        c.slot.appendChild(b);
      } else {
        const sp = document.createElement('span');
        sp.className = 'tname' + (mode === 'empty' ? ' is-empty' : '');
        c.slot.appendChild(sp);
      }
    }
    const first = c.slot.firstElementChild;
    if (mode === 'select') {
      first.value = tr.sound || '';
      first.title = `Track ${i + 1}: ${trackName(tr)} — its sound`;
      first.disabled = busy() && i !== R.armed;
    } else {
      const label = mode === 'empty' ? (armed ? `For ${PLAYED[R.inst]}` : 'Empty') : trackName(tr);
      first.innerHTML = `<span class="ticon">${ICON[kind || 'empty']}</span><span class="tlabel">${esc(label)}</span>`;
      first.title = mode === 'song' ? `${trackName(tr)} — from ${FROM_NAME[(tr.from || {}).app] || 'another app'}. Press to change its sound.`
        : tr.from ? `${trackName(tr)} — brought in from ${FROM_NAME[tr.from.app] || 'another app'}` : label;
      if (mode === 'song') first.disabled = busy();
    }
  }
  // The little window under a song track's name: its sound.
  const soundPop = el('sound-pop');
  let popFor = -1;
  function closePop() { soundPop.hidden = true; popFor = -1; }
  function openSoundPop(i, anchor) {
    if (busy()) return;
    if (popFor === i && !soundPop.hidden) { closePop(); return; }
    const tr = P.tracks[i];
    popFor = i;
    const opts = soundOptions(tr).map(([id, label]) => `<option value="${id}"${tr.sound === id ? ' selected' : ''}>${esc(label)}</option>`).join('');
    soundPop.innerHTML = `<div class="menu-head">Track ${i + 1} · ${esc(trackName(tr))}</div>
      <label class="menu-field"><span>Sound</span><select class="select" data-act="sound"><option value=""${tr.sound ? '' : ' selected'}>As written</option>${opts}</select></label>
      <p class="menu-note">From ${esc(FROM_NAME[(tr.from || {}).app] || 'another app')}: the notes stay as they came; only the sound changes.</p>`;
    soundPop.hidden = false;
    const r = anchor.getBoundingClientRect();
    const mw = soundPop.offsetWidth, mh = soundPop.offsetHeight;
    soundPop.style.left = clamp(r.left, 8, innerWidth - mw - 8) + 'px';
    soundPop.style.top = (r.bottom + mh + 8 > innerHeight ? Math.max(8, r.top - mh - 4) : r.bottom + 4) + 'px';
  }
  soundPop.addEventListener('change', (e) => {
    const t = e.target;
    if (popFor < 0 || t.dataset.act !== 'sound') return;
    const tr = P.tracks[popFor];
    pushUndo('the sound of track ' + (popFor + 1));
    tr.sound = t.value || null;
    save();
    toast(tr.sound ? `Track ${popFor + 1} now plays as ${t.options[t.selectedIndex].text}.` : `Track ${popFor + 1} plays as it was written.`);
  });
  document.addEventListener('pointerdown', (e) => { if (!soundPop.hidden && !soundPop.contains(e.target) && !e.target.closest('.tname')) closePop(); });

  function renderCtl(i) {
    const c = rows[i], tr = P.tracks[i];
    if (!c || !tr) return;
    const armed = i === R.armed;
    const rec = recordable(tr);
    c.row.classList.toggle('armed', armed && rec);
    c.row.classList.toggle('taking', armed && R.state === 'recording');
    c.row.classList.toggle('muted', !audible(tr));
    c.row.classList.toggle('brought', !rec);
    c.arm.disabled = busy() && !armed;
    c.arm.setAttribute('aria-pressed', String(armed && rec));
    c.arm.setAttribute('aria-label', rec ? `Record onto track ${i + 1}` : `Track ${i + 1}`);
    c.arm.title = (rec ? 'Record onto this track' : `From ${FROM_NAME[(tr.from || {}).app] || 'another app'}`) + ' · drag up or down to move it';
    renderSlot(i);
    c.mute.innerHTML = tr.muted ? ICON.muted : ICON.mute;
    c.mute.setAttribute('aria-pressed', String(tr.muted));
    c.mute.title = tr.muted ? 'Muted: not heard, and left out of song files' : 'Mute';
    c.mute.setAttribute('aria-label', `${tr.muted ? 'Unmute' : 'Mute'} track ${i + 1}`);
    c.solo.setAttribute('aria-pressed', String(tr.solo));
    c.solo.title = tr.solo ? 'Solo: only soloed tracks are heard' : 'Solo';
    c.solo.setAttribute('aria-label', `Solo track ${i + 1}`);
    c.vol.value = Math.round(tr.volume * 100);
    c.vol.title = c.vol.value + '%';
    const audio = isAudio(tr);
    c.loop.setAttribute('aria-pressed', String(tr.loop));
    c.loop.setAttribute('aria-label', `Loop track ${i + 1}`);
    c.loop.disabled = busy() || audio;
    c.loop.title = audio ? 'A voice take is sound: it does not loop' : tr.loop ? 'Looping: drag the end of a part out to repeat it' : 'Loop: make this track’s parts repeat when dragged out';
    const s = selected(), forPart = !!(s && s.i === i);
    c.trash.classList.toggle('for-part', forPart);
    c.trash.disabled = busy() || (!hasContent(tr) && P.tracks.length <= 1);
    c.trash.title = forPart ? `Delete the highlighted ${s.audio ? 'take' : 'part'} (Delete)` : hasContent(tr) ? 'Clear this track (Undo brings it back)' : 'Remove this track';
    c.trash.setAttribute('aria-label', c.trash.title);
    c.wrap.title = ed ? '' : editable(tr) ? 'Double-click to open this track and edit its notes' : '';
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
  }

  let cssCache = null;
  function cssVar(name) {
    if (!cssCache) cssCache = getComputedStyle(document.body);
    return cssCache.getPropertyValue(name).trim();
  }

  // -------- DRAWING --------
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
    if (R.pos >= view.start && R.pos <= view.end) { // where Play starts
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
    const step = snapGrid(ppb);   // zoomed in further: the finer lines a dragged part snaps to, fainter still
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
  }

  function drawLane(i) {
    const l = rows[i];
    if (!l || !l.w) return;
    if (ed) { if (ed.i === i) drawEditor(l); return; }   // the note editor: its track alone, opened out
    drawLaneBody(i);
    drawCut(i);
  }
  function drawLaneBody(i) {
    const l = rows[i], tr = P.tracks[i];
    if (!l || !l.w || !tr) return;
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    const ppb = pxPerBeat(l.w);
    gridLines(g, l, ppb);
    const base = audible(tr) ? 1 : 0.3;

    if (isAudio(tr)) { drawTakes(i, l, g, ppb, base); return; }
    if (isHits(tr)) {
      // an ostinato: a row for each instrument, in the order they first play
      // (every hit the parts hold, so sizing never reorders the rows)
      const order = [];
      tr.clips.forEach(c => c.items.forEach(h => { if (!order.includes(h.i)) order.push(h.i); }));
      const rowsN = Math.max(1, order.length);
      const rh = (l.h - 8) / rowsN;
      const col = TRACK_COLORS[i % TRACK_COLORS.length];
      drawParts(i, l, g, ppb, base);
      g.fillStyle = col;
      const hit = (h, alpha) => {
        const x = (h.b - view.start) * ppb;
        if (x < -4 || x > l.w + 4) return;
        const r = order.indexOf(h.i);
        g.globalAlpha = alpha * (0.55 + 0.45 * Math.min(1, h.g));
        g.fillRect(x, 4 + r * rh + rh * 0.15, Math.max(2, Math.min(ppb * 0.22, 6)), Math.max(2, rh * 0.7));
      };
      hiddenOf(i).forEach(h => hit(h, 0.25 * base));
      tr.hits.forEach(h => hit(h, base));
      g.globalAlpha = 1;
      if (rowsN > 1 && l.h / rowsN >= 9 && ppb * barBeats() > 40) {
        g.font = '700 9px Nunito, system-ui, sans-serif';
        g.textBaseline = 'middle';
        g.fillStyle = cssVar('--text-3');
        const VI = window.VirtualInstruments;
        order.forEach((id, r) => g.fillText((VI.INSTRUMENT_MAP[id] || {}).label || id, l.w - 60, 4 + r * rh + rh / 2));
      }
      return;
    }

    const taking = run && run.recording && run.armed === i;
    let fresh = [];
    if (taking) {
      const now = heardBeat(run);
      fresh = run.take.concat([...run.held.values()].flatMap(h => h.ms.map(m => ({ m, b: h.b, d: Math.max(MIN_HOLD, now - h.b) }))));
    }
    drawParts(i, l, g, ppb, base);
    const hidden = hiddenOf(i);
    const all = tr.notes.concat(fresh, hidden);
    if (!all.length) {
      if (tr.clips.length) return;
      g.fillStyle = cssVar('--text-3');
      g.font = '700 12px Nunito, system-ui, sans-serif';
      g.textBaseline = 'middle';
      const armed = i === R.armed && recordable(tr);
      g.fillText(armed ? 'Empty — press ● to record here' : 'Empty', 10, l.h / 2);
      return;
    }
    let lo = Infinity, hi = -Infinity;
    all.forEach(n => { if (n.m < lo) lo = n.m; if (n.m > hi) hi = n.m; });
    if (hi - lo < 12) { const mid = (lo + hi) / 2; lo = mid - 6; hi = mid + 6; }
    const pad = 4, span = hi - lo;
    const nh = Math.max(3, Math.min(7, (l.h - 2 * pad) / (span + 1)));
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
    hidden.forEach(n => paint(n, 0.25 * base));   // what a part being sized leaves out: its end can open it up again
    // while a take goes on, what it will replace is shown faint
    tr.notes.forEach(n => paint(n, taking && n.b >= run.from - run.count ? 0.25 : base));
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
    const tr = P.tracks[i], col = TRACK_COLORS[i % TRACK_COLORS.length];
    const top = 3, h = l.h - 6;
    const s = selected();
    g.fillStyle = g.strokeStyle = col;
    // the part being sized (a straight one): how far its ends can open
    if (takeEdit && takeEdit.i === i && !takeEdit.g.loop) {
      const c = takeEdit.g, x0 = (c.b - c.o - view.start) * ppb;
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
      const picked = !!(s && s.i === i && s.g === c);
      g.globalAlpha = (takeEdit && takeEdit.g === c ? 0.22 : picked ? 0.26 : 0.14) * base;
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
      if (w > 14) { // the grips
        g.fillRect(Math.round(x0) + 4, l.h / 2 - 7, 2, 14);
        g.fillRect(Math.round(x1) - 6, l.h / 2 - 7, 2, 14);
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
    const tr = P.tracks[i];
    if (!takeEdit || takeEdit.i !== i || isAudio(tr) || takeEdit.g.loop) return [];
    const c = takeEdit.g, end = c.o + c.d;
    return c.items.filter(n => n.b < c.o - EARLY || n.b >= end - 1e-6).map(n => ({ ...n, b: c.b + n.b - c.o }));
  }

  // A voice track: each take's waveform, in the track's colour.
  function drawTakes(i, l, g, ppb, base) {
    const tr = P.tracks[i];
    const spb = 60 / P.tempo, mid = l.h / 2, amp = l.h / 2 - 3, PPS = StudioVoice.peaksPerSec;
    const col = TRACK_COLORS[i % TRACK_COLORS.length];
    const taking = run && run.recording && run.armed === i && run.capture;
    const s = selected();
    const wave = (b, o, d, peaks, alpha, picked) => {
      const x0 = (b - view.start) * ppb, x1 = x0 + d / spb * ppb;
      if (x1 < 0 || x0 > l.w) return;
      const a = Math.max(0, x0), z = Math.min(l.w, x1);
      g.fillStyle = col;
      g.globalAlpha = (picked ? 0.28 : 0.16) * alpha;
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
      wave(r.b, r.o, r.d, c ? c.peaks : null, taking && regionEnd(r) > run.from ? 0.25 * base : base, s && s.i === i && s.g === r);
    });
    if (edited) { const c = StudioVoice.clip(edited.c); wave(edited.b, edited.o, edited.d, c ? c.peaks : null, base, true); }
    // each take's two ends: what a press there trims; the highlighted one ringed
    if (!taking) {
      tr.regions.forEach(r => {
        const x0 = (r.b - view.start) * ppb, x1 = x0 + r.d / spb * ppb;
        if (x1 < 0 || x0 > l.w) return;
        const picked = s && s.i === i && s.g === r;
        if (picked) {
          g.globalAlpha = 0.9; g.strokeStyle = cssVar('--text'); g.lineWidth = 1;
          boxPath(g, x0 + 0.5, 2.5, Math.max(4, x1 - x0) - 1, l.h - 5, 6);
          g.stroke();
        }
        g.fillStyle = col;
        g.globalAlpha = 0.8 * base;
        g.fillRect(Math.round(x0) + 2, 3, 2, l.h - 6);
        g.fillRect(Math.round(x1) - 4, 3, 2, l.h - 6);
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

  // -- the note editor's drawing --
  function drawEditor(l) {
    const tr = P.tracks[ed.i], col = TRACK_COLORS[ed.i % TRACK_COLORS.length];
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    if (Math.abs(l.h - ed.h) >= 1) keepRows();
    const ppb = pxPerBeat(l.w), rh = ed.rowH;
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
    const dim = audible(tr) ? 1 : 0.45;
    ed.hits = [];
    g.textBaseline = 'middle';
    g.font = `800 ${clamp(rh - 4, 8, 11)}px Nunito, system-ui, sans-serif`;
    order.forEach(v => {
      const x0 = (v.b - view.start) * ppb, x1 = x0 + Math.max(3, v.d * ppb);
      if (x1 < -2 || x0 > l.w + 2) return;
      const y0 = rowY(v.m), on = sel.has(v.n), color = noteColor(v.m);
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
        g.fillText(prettyNote(midiName(Math.round(v.m))), x0 + 4, y0 + rh / 2 + 0.5);
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

  function drawAll() {
    cssCache = null;
    renderZoom();
    drawRuler();
    P.tracks.forEach((_, i) => drawLane(i));
    setHeads(run ? heardBeat(run) : R.pos);
  }
  function setHeads(beat) {
    (ruler ? [ruler] : []).concat(rows).forEach(l => {
      if (!l.w) return;
      const x = (beat - view.start) * pxPerBeat(l.w);
      l.head.style.transform = `translateX(${x}px)`;
      l.head.style.visibility = x < 0 || x > l.w ? 'hidden' : '';
    });
  }
  function renderPos() {
    if (!run) { posEl.textContent = posText(R.pos); setHeads(R.pos); drawRuler(); }
  }

  // -------- THE BAR --------
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
    recordBtn.disabled = !!ed;   // the note editor open: no recording
    document.body.classList.toggle('is-recording', recording);
    document.body.classList.toggle('is-playing', playing);
    homeBtn.disabled = busy();
    [tempoInput, meterSelect, countInBtn, el('tempo-down'), el('tempo-up'), el('bring-btn'), el('key-down'), el('key-up'), el('key-name'), scaleSelect].forEach(c => { c.disabled = busy(); });
    if (ed) { // Undo steps back through the changes to the notes
      undoBtn.disabled = !ed.undo.length;
      undoBtn.title = ed.undo.length ? `Undo the last change to these notes (${MOD_KEY}Z)` : 'No changes to undo yet';
    } else {
      undoBtn.disabled = busy() || !undo.length;
      undoBtn.title = undo.length ? 'Undo ' + undo[undo.length - 1].label : 'Nothing to undo';
    }
    redoBtn.hidden = !redo.length;   // shows once Undo has taken something back
    redoBtn.disabled = busy();
    redoBtn.title = redo.length ? 'Redo ' + redo[redo.length - 1].label : '';
    renderQuant();
  }
  function renderSettings() {
    tempoInput.value = P.tempo;
    meterSelect.value = P.meter;
    countInBtn.setAttribute('aria-pressed', String(P.countIn));
    clickSelect.value = P.click;
    clickWord.textContent = CLICK_WORDS[P.click];
    clickFace.classList.toggle('off', P.click === 'off');
    clickFace.title = 'Metronome: ' + clickSelect.selectedOptions[0].textContent.toLowerCase();
    renderKey();
  }
  function renderAll() {
    if (!P) return;
    checkSel();
    fitView();
    renderSettings();
    renderCtls();
    renderTransport();
    renderTiming();
    renderInstTabs();
    renderInstBar();
    renderProjectChip();
    renderEditBar();
    sizeLanes();
    drawAll();
    renderPos();
  }

  playBtn.innerHTML = PLAY_ICON;
  playBtn.addEventListener('click', togglePlay);
  recordBtn.addEventListener('click', () => { if (!ed) toggleRecord(); });
  function goHome() { if (!busy()) { R.pos = songStart(); renderPos(); reveal(R.pos); } }
  homeBtn.addEventListener('click', goHome);
  undoBtn.addEventListener('click', () => { if (ed) editUndo(); else doUndo(); });
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

  // -------- THE KEY (the Virtual Keyboard's: ◀ C ▶ and the scale, in the top bar) --------
  // One for the whole project, played by every instrument (link.js hands it
  // to each as it joins and whenever it changes). The scale menu is the
  // Virtual Keyboard's: Theory's scales, Minor listed once (as Natural Minor).
  const scaleSelect = el('scale-select'), keyName = el('key-name'), keyGrid = el('key-grid');
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
  const keyLabel = pc => prettyNote(Theory.tonicName(pc, P.scale));   // spelled as this scale spells its tonic (C♯ minor, D♭ major)
  function renderKey() {
    keyName.textContent = keyLabel(P.key);
    keyName.title = `${keyLabel(P.key)} ${(Theory.SCALE_BY_ID[P.scale] || {}).name || ''} — choose a key`;
    scaleSelect.value = P.scale;
    const col = noteColor(P.key);
    document.documentElement.style.setProperty('--tonic', col);
    document.documentElement.style.setProperty('--tonic-ink', inkFor(col));
    keyGrid.innerHTML = Array.from({ length: 12 }, (_, pc) => `<button type="button" data-pc="${pc}" class="${pc === P.key ? 'current' : ''}">${keyLabel(pc)}</button>`).join('');
  }
  function setProjectKey(pc, scale) {
    P.key = pc;
    P.scale = scale;
    renderKey();
    save();
    if (window.StudioLink) StudioLink.setKey(P.key, P.scale);
  }
  el('key-down').addEventListener('click', () => setProjectKey(mod(P.key - 1, 12), P.scale));
  el('key-up').addEventListener('click', () => setProjectKey(mod(P.key + 1, 12), P.scale));
  keyName.addEventListener('click', () => { renderKey(); openSheet('key-sheet'); });
  keyGrid.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-pc]');
    if (!b) return;
    setProjectKey(Number(b.dataset.pc), P.scale);
    closeSheet('key-sheet');
  });
  scaleSelect.addEventListener('change', () => { setProjectKey(P.key, scaleSelect.value); scaleSelect.blur(); if (window.StudioLink) StudioLink.focus(); });
  // A key by name ('F#', 'Bb', 'E♭') → its pitch class, or -1.
  function keyPc(name) {
    const n = String(name || '').trim().replace(/♯/g, '#').replace(/♭/g, 'b');
    const k = n ? n[0].toUpperCase() + n.slice(1) : '';
    const i = Theory.TONIC_FLAT.indexOf(k);
    return i >= 0 ? i : Theory.TONIC_SHARP.indexOf(k);
  }

  meterSelect.addEventListener('change', () => { P.meter = meterSelect.value; meterSelect.blur(); R.pos = songStart(); renderAll(); save(); });
  countInBtn.addEventListener('click', () => { P.countIn = !P.countIn; renderSettings(); save(); });
  clickSelect.addEventListener('change', () => { P.click = clickSelect.value; clickSelect.blur(); renderSettings(); save(); });

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
  // Beside the tabs: the showing instrument's own sound and layout controls (inst-controls.js).
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
    closePop();
    document.querySelectorAll('.sheet-backdrop.open').forEach(s => s.classList.remove('open'));
    el(id).classList.add('open');
  }
  function closeSheet(id) { el(id).classList.remove('open'); }
  document.querySelectorAll('.sheet-backdrop').forEach(bd => {
    bd.addEventListener('click', (e) => { if (e.target === bd || e.target.closest('[data-close]')) bd.classList.remove('open'); });
  });
  const sheetOpen = () => !!document.querySelector('.sheet-backdrop.open');

  // -------- THE LIBRARY (the projects) --------
  function renderProjectChip() {
    el('project-title').textContent = P.name || 'Untitled project';
    el('project-kicker').textContent = projects[P.id] ? 'Project · saved here' : 'New project';
    document.title = (P.name ? P.name + ' · ' : '') + 'Recording Studio';
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
    const used = (p.tracks || []).filter(t => (t.notes && t.notes.length) || (t.hits && t.hits.length) || (t.regions && t.regions.length)).length;
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
      if (id === P.id) { if (ed) closeEditor(false); P = blankProject(); undo = []; redo = []; afterProjectChange(); }
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
  // nothing under way, nothing half-done, before another project takes the place of this one
  function settle() {
    if (ed) closeEditor(false);
    if (busy()) stopRun();
    select(null);
    setCutMode(false);
  }
  function openProject(id) {
    settle();
    saveNow();
    P = normalizeProject(projects[id]);
    undo = []; redo = [];
    win = 0; viewAt = 0;
    saveJSON(CURRENT_KEY, P.id);
    afterProjectChange();
    el('project-name').value = P.name;
    renderProjectList();
    el('project-status').textContent = `Opened ${P.name || 'Untitled project'}.`;
  }
  el('library-btn').addEventListener('click', () => {
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
    settle();
    saveNow();
    P = blankProject();
    undo = []; redo = [];
    win = 0; viewAt = 0;
    R.armed = 0;
    afterProjectChange();
    el('project-name').value = '';
    renderProjectList();
    el('project-status').textContent = 'A new project. It is saved here once it has a track or a name.';
  });
  el('project-copy').addEventListener('click', () => {
    settle();
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
      settle();
      saveNow();
      if (data.clips) { el('project-status').textContent = 'Unpacking the voice takes…'; await StudioVoice.importClips(data.clips); }
      P = normalizeProject(data);
      if (projects[P.id]) P.id = newId('p');   // opened as a project of its own, never over one kept here
      undo = []; redo = [];
      win = 0; viewAt = 0;
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
  // last note and its ring (a loop plays to its end, rests and all).
  function songForFile() {
    const tracks = P.tracks.filter(tr => audible(tr) && hasContent(tr));
    if (!tracks.length) return null;
    const spb = 60 / P.tempo;
    let lo = Infinity, hi = -Infinity;
    tracks.forEach(tr => {
      tr.notes.forEach(n => { lo = Math.min(lo, n.b); hi = Math.max(hi, n.b + n.d); });
      tr.hits.forEach(h => { lo = Math.min(lo, h.b); hi = Math.max(hi, h.b + 0.5); });
      tr.regions.forEach(g => { lo = Math.min(lo, g.b); hi = Math.max(hi, regionEnd(g)); });
      if (tr.loop) tr.clips.forEach(c => { hi = Math.max(hi, c.b + c.d); });
    });
    if (!Number.isFinite(lo)) return null;
    const at = b => LEAD + (b - lo) * spb;
    return {
      seconds: LEAD + (hi - lo) * spb + TAIL,
      room: P.room,
      tracks: tracks.map(tr => {
        const eng = engineOf(tr);
        let events;
        if (eng === 'audio') events = Voices.joined(tr.regions, spb).map(g => ({ at: at(g.b), clip: g.c, offset: g.o, dur: g.d }));
        else if (eng === 'hits') events = tr.hits.map(h => ({ at: at(h.b), inst: h.i, gain: h.g, gapMs: h.r * spb * 1000 }));
        else if (eng === 'strikes') events = tr.notes.map(n => ({ at: at(n.b), freq: midiFreq(n.m), sound: notePreset(tr, n), level: n.v }));
        else events = tr.notes.map(n => ({ at: at(n.b), hold: n.d * spb, freq: midiFreq(n.m), preset: notePreset(tr, n), level: n.v }));
        return { kind: tr.kind, level: BASE * tr.volume, events };
      })
    };
  }

  const toS16 = x => (x < -1 ? -32768 : x > 1 ? 32767 : Math.round(x < 0 ? x * 32768 : x * 32767));
  async function encodeMp3(buffer, progress) {
    const enc = new lamejs.Mp3Encoder(2, buffer.sampleRate, 320);
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
  // Space plays and stops; Escape stops (or closes a sheet, or lets a
  // highlighted part go); Delete removes the highlighted part; − and + zoom;
  // Home goes back to the start. Any other key goes to the instrument
  // showing, so the computer keyboard always plays it.
  document.addEventListener('keydown', (e) => {
    const t = e.target;
    const typing = t && t.closest && t.closest('input, textarea, select, [contenteditable]');
    if (e.key === 'Escape') {
      if (!soundPop.hidden) { closePop(); return; }
      const open = document.querySelector('.sheet-backdrop.open');
      if (open) { open.classList.remove('open'); return; }
      if (busy()) { stopRun(); return; }
      if (cutMode) { setCutMode(false); return; }
      if (sel) select(null);
      return;
    }
    if (typing || sheetOpen() || !soundPop.hidden) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) togglePlay();
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && selected() && !busy() && !e.ctrlKey && !e.altKey) {
      e.preventDefault();   // (a Mac's delete key is Backspace)
      if (!e.repeat) deleteSelected();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;   // ⌘/Ctrl − and + zoom the whole page, as always
    if (e.key === '-' || e.key === '_') { e.preventDefault(); zoomStep(1 / ZOOM_STEP); return; }
    if (e.key === '=' || e.key === '+') { e.preventDefault(); zoomStep(ZOOM_STEP); return; }
    if (e.key === 'Home') { e.preventDefault(); goHome(); return; }
    if (window.StudioLink) StudioLink.forward(e);
  });
  // a focused button would click on Space as well
  document.addEventListener('keyup', (e) => { if (e.code === 'Space' && e.target && e.target.tagName === 'BUTTON') e.preventDefault(); });

  // The note editor's keys, heard first: Delete; ⌘/Ctrl + C, X, V, A, Z; the
  // arrows nudge; Escape lets the highlighted notes go. Space still plays and stops.
  window.addEventListener('keydown', (e) => {
    if (!ed || sheetOpen()) return;
    const t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
    const cmd = e.metaKey || e.ctrlKey, k = (e.key || '').toLowerCase();
    if (cmd && k === 'c') { if (!e.repeat) copyNotes(false); }
    else if (cmd && k === 'x') { if (!e.repeat) copyNotes(true); }
    else if (cmd && k === 'v') { if (!e.repeat) pasteNotes(); }
    else if (cmd && k === 'a') selectAllNotes();
    else if (cmd && k === 'z' && !e.shiftKey) editUndo();
    else if (cmd || e.altKey) return;
    else if (e.key === 'Delete' || e.key === 'Backspace') { if (!e.repeat) deleteNotes(); }
    else if (e.key === 'Escape' && !busy() && ed.sel.size) { ed.sel = new Set(); renderEditBar(); queueDraw(); }
    else if (e.key.startsWith('Arrow') && ed.sel.size) nudgeNotes(e.key, e.shiftKey);
    else return;
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);

  // Over the lanes: a trackpad pinch (Ctrl + scroll; ⌘ + scroll with a mouse)
  // zooms round the pointer; two fingers sideways (or Shift + scroll) slide
  // the view along. Safari sends its pinch as gesture events. On a touch
  // screen two fingers on the lanes pinch.
  const overLane = e => ruler && ruler.w && e.target && e.target.closest && e.target.closest('.lane');
  tracksEl.addEventListener('wheel', (e) => {
    // the note editor: up and down go up and down the rows
    if (ed && e.target.closest && e.target.closest('.track.editing') && !e.ctrlKey && !e.metaKey && !e.shiftKey
        && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      setTop(ed.top - (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / ed.rowH);
      queueDraw();
      return;
    }
    if (!overLane(e)) return;
    if (e.ctrlKey || e.metaKey) {
      if (e.ctrlKey && 'GestureEvent' in window) return;   // Safari: the gesture events below
      e.preventDefault();
      zoomBy(Math.exp(-e.deltaY * 0.01), beatAtX(e.clientX));
      return;
    }
    if (!win) return;
    const along = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (!along) return;   // up and down still scroll the tracks
    e.preventDefault();
    const px = e.deltaMode === 1 ? along * 16 : along;
    panTo(viewAt + px / pxPerBeat(ruler.w));
  }, { passive: false });
  let gestureScale = 1;
  tracksEl.addEventListener('gesturestart', (e) => { if (overLane(e)) { e.preventDefault(); gestureScale = 1; } });
  tracksEl.addEventListener('gesturechange', (e) => {
    if (!overLane(e)) return;
    e.preventDefault();
    zoomBy(e.scale / gestureScale, beatAtX(e.clientX));
    gestureScale = e.scale;
  });
  const fingers = new Map();   // touch pointers on the lanes: id -> x
  tracksEl.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || !overLane(e)) return;
    fingers.set(e.pointerId, e.clientX);
    if (fingers.size === 2) {
      const [a, b] = [...fingers.values()];
      pinch = { d0: Math.max(8, Math.abs(a - b)), w0: view.end - view.start, at: beatAtX((a + b) / 2) };
      e.stopPropagation();   // the lane under the second finger doesn't take it as a press
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
    const rect = ruler.wrap.getBoundingClientRect();
    viewAt = pinch.at - ((a + b) / 2 - rect.left) / (rect.width || 1) * w;   // the beat between the fingers stays there
    win = w >= range - 1e-9 ? 0 : w;
    applyView();
    queueDraw();
  }, true);
  const liftFinger = (e) => { fingers.delete(e.pointerId); if (fingers.size < 2) pinch = null; };
  tracksEl.addEventListener('pointerup', liftFinger, true);
  tracksEl.addEventListener('pointercancel', liftFinger, true);

  // -------- START --------
  function start() {
    if (FROM_FILE) el('file-note').hidden = false;
    loadPrefs();
    loadProjects();
    try { const h = localStorage.getItem(HEAD_KEY); if (HEADS.includes(h)) head = h; } catch (e) {}
    R.inst = prefs.inst;
    R.armed = firstRecordable();
    const first = P.tracks.findIndex(t => !hasContent(t) && recordable(t));
    if (first >= 0) R.armed = first;
    buildTracks();
    applySplit();
    R.pos = songStart();
    renderAll();
    if (window.StudioLink) StudioLink.show(R.inst);
    recoverTakes().catch(e => console.error(e))
      .then(() => StudioVoice.keys()).then(forgetUnused);   // takes from projects deleted or replaced on another visit
    setTimeout(() => recoverTakes().catch(e => console.error(e)), 5000);   // one whose page closed only moments ago
    new ResizeObserver(() => {
      if (ed) tracksEl.style.setProperty('--head-w', editHeadW() + 'px');
      sizeLanes();
      drawAll();
    }).observe(el('tracks-pane'));
    window.addEventListener('resize', applySplit);
    window.addEventListener('pagehide', saveNow);
    document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });
  }

  // -------- FOR link.js AND bring-in.js --------
  window.Studio = {
    KINDS, INSTRUMENTS, MAX_TRACKS, METERS, TEMPO_MIN, TEMPO_MAX,
    noteOn, noteOff, noteHit, togglePlay, stop: stopRun, busy,
    sounding: () => !!run,
    takeIds: () => clipIds(P.tracks),
    calibrating: () => !!cal, calTap,
    sheetOpen, toast, openSheet, closeSheet,
    get project() { return P; },
    get view() { return view; },   // the beats across the lanes (tests)
    get state() { return R; },
    get editing() { return ed ? ed.i : -1; },   // the track open in the note editor (tests)
    barBeats, hasContent, recordable, blankTrack, normalizeTrack,
    get key() { return { pc: P.key, scale: P.scale }; },
    icon: k => ICON[k] || '',
    // Put brought-in tracks on the first empty tracks (adding tracks as needed).
    // Returns how many went in, or 0 when there was no room.
    bringIn(tracks, opts) {
      settle();
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

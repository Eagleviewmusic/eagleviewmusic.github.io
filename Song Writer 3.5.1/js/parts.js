/* ==========================================================================
   Song Writer 3.5.1 — parts.js
   --------------------------------------------------------------------------
   SW.parts   PARTS (2026-11-03, the user): a song of up to four parts —
              two-, three- or four-part polyphony — each part its own
              melody with its own words, its own sound and its own
              volume. One part is on the page at a time (the FOCUSED part:
              the one the Pitch, Notation and Rhythm pages show and edit);
              the others are kept as model data, played along with it, and
              drawn under it bar for bar (components/part-rows.js, the
              Rhythm page's PARTS).

   WHY ONE PART ON THE PAGE. The page IS the working copy of a score
   (score.js: the DOM is the working copy, the model is the record) —
   selection, the staff, the flow engine, the chord track and the Rhythm
   page all read #score. Drawing every part there would make every one of
   them part-aware at once. Instead the page is always exactly one part,
   and focusing another part swaps the page: the part on it is read back
   into the model, the other is drawn. Nothing that works on the page had
   to learn about parts; only what reads the WHOLE song did (read/render,
   timing.songOf, the player, the history, the key map, the engraver's
   joint plan).

   THE LINES ARE THE SONG'S (later the same day, the user: measure 1 of
   Part 1 right over measure 1 of Part 2, the score still as you jump
   between parts). Every part has the same lines — the song's: a line's
   name, pick-up and bars (an instrumental line) belong to the song, and
   each part holds its own SYLLABLES for each line. A line is as long as
   the longest part's needs for it (js/timing.js SHARED LENGTHS); a part
   with less in it is finished with rests. Adding, splitting, joining,
   moving, copying or deleting a line on the page does the same to every
   part (mirror, called by score.js at each of those), so the parts never
   drift apart; a part's line with nothing in it holds one rest.

   THE MODEL (JSON-FORMAT.md §2)
     score.lines              the song's lines with Part 1's syllables —
                              exactly as always, so every song saved before
                              and every older reader is untouched
     score.parts[i]           { name?, sound?, volume?, clef? } for part i, and for
                              i ≥ 1 its `lines`: [{ syllables }], one for
                              each of score.lines (an instrumental line's
                              is empty). parts[0] never carries lines.
                              Omitted altogether for a one-part song with
                              nothing set.
     name     ≤ 24 characters (omitted when empty: "Part n")
     sound    a lib/audio.js preset id (omitted: Sound → Melody's sound)
     volume   0–100 (omitted when 100), a share of the melody's level
     clef     'bass' (omitted: treble). The part is written on that clef and
              sounds an octave lower (core.js THE CLEF IN EFFECT); its rungs
              are stored as they were, so going back changes nothing. A
              one-part song with a bass clef is { parts: [{ clef: 'bass' }] }.
     KEY CHANGES (js/keys.js) are the song's and live on Part 1's columns;
     a `cols[].key` on another part is dropped on reading.

   THE RULE THAT KEEPS THIS HONEST: the focused part's syllables are never
   stored here — they are the page; and the page always carries the
   song's line names, pick-ups and bars, whichever part is on it. lines(i)
   reads the page for the focused part, and for the others the page's
   lines with that part's stored syllables, so there is one source for
   every line and nothing to fall out of step.

   API — pure, on a model (any shape normalizeScore accepts)
     countOf(model)                how many parts it has (≥ 1)
     linesOf(model, i)             part i's lines, whole (the song's lines with its syllables)
     setLines(model, i, lines)     the model with part i's lines replaced (new objects; returns it)
     everyLine(model)              [[lines of part 0], [lines of part 1], …]
     metaOf(model, i)              { name, sound, volume, clef } with defaults filled
     restSyllables()               what a part's empty line holds: one rest
   API — the song on screen
     count() · focused() · MAX
     meta(i)                       { name, sound, volume, clef } (defaults filled; a copy)
     clef(i?)                      part i's clef, 'treble' or 'bass' (no i: the part on the page's)
     lines(i)                      part i's lines, whole (a copy)
     song(i, o?)                   part i read from the model, in its own clef (SW.timing.songOf)
     firstPickup()                 the song's first line's pick-up id, or ''
     focus(i, o?)                  put part i on the page (not an edit); o.at: then select its column at that song tick
     isShown(i) · shownParts()     SHOWN: the parts drawn on Notation and Rhythm (the focused one always)
     setShown(i, on)               turn a part on or off there ('parts:shown'); the focused part off → the nearest one on is focused
     add(o?) · remove(i) · setMeta(i, patch) · label(i)
                                   o = { from, notes, rhythm, words }: start the new part from another
     copySyllables(syls, what)     one line's syllables with what = { notes, rhythm, words } taken (pure)
     mirror(op)                    a line operation done on the page, done to the other parts (score.js)
     load(score, i) / write(out)   score.js render / read use these — nothing else should
     selfTest()                    the model rules, on copies
   Events: 'parts:shown' { part, on } (SHOWN — a redraw of Notation and
           Rhythm); otherwise a change to the parts is a 'score:changed'
           (reason 'part', 'part-name', 'part-sound', 'part-volume', 'part-clef') and a
           focus is a redraw ('score:loaded' then 'score:changed' 'part').
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const MAX = 4;
  const NAME_MAX = 24;
  const clone = x => JSON.parse(JSON.stringify(x));
  const restSyllables = () => [{ text: '-', cols: [{ notes: [{ n: 'do', rest: true }] }] }];

  /* ---------------- the model, pure ---------------- */
  function countOf(model) {
    const n = model && Array.isArray(model.parts) ? model.parts.length : 0;
    return Math.max(1, Math.min(MAX, n));
  }
  /* a song line's own: its name, pick-up and bars */
  function attrsOf(l) {
    const o = { label: typeof l.label === 'string' ? l.label : '' };
    if (l.bars) o.bars = l.bars;
    else if (l.pickup) o.pickup = l.pickup;
    return o;
  }
  function linesOf(model, i) {
    if (!model) return [];
    const song = Array.isArray(model.lines) ? model.lines : [];
    if (!i) return song;
    const p = Array.isArray(model.parts) ? model.parts[i] : null;
    const own = p && Array.isArray(p.lines) ? p.lines : [];
    return song.map((l, k) => {
      const a = attrsOf(l);
      if (a.bars) return a;
      const raw = own[k];
      a.syllables = raw && Array.isArray(raw.syllables) && raw.syllables.length ? raw.syllables : restSyllables();
      return a;
    });
  }
  function setLines(model, i, lines) {
    if (!i) { model.lines = lines; return model; }
    const parts = Array.isArray(model.parts) ? model.parts.slice() : [];
    while (parts.length <= i) parts.push({});
    parts[i] = Object.assign({}, parts[i], { lines: lines.map(l => ({ syllables: l.bars ? [] : (l.syllables || []) })) });
    model.parts = parts;
    return model;
  }
  function everyLine(model) {
    const out = [];
    for (let i = 0; i < countOf(model); i++) out.push(linesOf(model, i));
    return out;
  }
  function cleanMeta(raw) {
    const m = { name: '', sound: '', volume: 100, clef: 'treble' };
    if (!raw || typeof raw !== 'object') return m;
    if (typeof raw.name === 'string') m.name = raw.name.trim().slice(0, NAME_MAX);
    if (typeof raw.sound === 'string' && SW.audio && SW.audio.hasSound(raw.sound)) m.sound = raw.sound;
    const v = Number(raw.volume);
    if (raw.volume !== undefined && raw.volume !== null && !isNaN(v)) m.volume = Math.max(0, Math.min(100, Math.round(v)));
    if (raw.clef === 'bass') m.clef = 'bass';
    return m;
  }
  function metaOf(model, i) {
    return cleanMeta(model && Array.isArray(model.parts) ? model.parts[i] : null);
  }
  function compactMeta(m) {
    const out = {};
    if (m.name) out.name = m.name;
    if (m.sound) out.sound = m.sound;
    if (m.volume !== 100) out.volume = m.volume;
    if (m.clef === 'bass') out.clef = m.clef;
    return out;
  }
  const emptyMeta = m => !m.name && !m.sound && m.volume === 100 && m.clef !== 'bass';

  /* ---------------- the song on screen ---------------- */
  /* syls: for a part off the page, its syllables for each of the song's
     lines ([] for an instrumental line); null for the part on the page */
  let parts = [{ name: '', sound: '', volume: 100, clef: 'treble', syls: null }];
  let focus = 0;
  /* SHOWN (later the same day, the user: on Notation and Rhythm the part
     tabs are switches — Part 1 on, Part 2 on, or one turned off to see the
     other alone). The parts turned off; never the focused one (focusing a
     part turns it on, turning the focused part off focuses another), never
     all of them. How the room looks, not the song: not saved, not a step,
     and a part turned off still plays. */
  let hidden = new Set();

  const count = () => parts.length;
  const focused = () => focus;
  const ok = i => Number.isInteger(i) && i >= 0 && i < parts.length;
  function meta(i) {
    const p = ok(i) ? parts[i] : parts[0];
    return { name: p.name, sound: p.sound, volume: p.volume, clef: p.clef };
  }
  /* core.js clefNow asks on every pitch: no copy */
  function clefOf(i) {
    const p = parts[i === undefined ? focus : i];
    return (p && p.clef) || 'treble';
  }
  function label(i) { return meta(i).name || 'Part ' + (i + 1); }
  const page = () => SW.score.readLines();
  /* a part's lines, whole: the page's lines with that part's syllables */
  function lines(i) {
    if (!ok(i)) return [];
    const dom = page();
    if (i === focus) return dom;
    const syls = parts[i].syls;
    return dom.map((l, k) => {
      const a = attrsOf(l);
      if (a.bars) return a;
      a.syllables = clone(syls[k] && syls[k].length ? syls[k] : restSyllables());
      return a;
    });
  }
  /* a part read from the model, in its own clef */
  function partSong(i, o) { return SW.timing.songOf(lines(i), Object.assign({ clef: clefOf(i) }, o)); }
  const isShown = i => ok(i) && (i === focus || !hidden.has(i));
  const shownParts = () => parts.map((_, i) => i).filter(isShown);
  function setShown(i, on) {
    if (!ok(i) || isShown(i) === !!on) return false;
    if (on) { hidden.delete(i); SW.bus.emit('parts:shown', { part: i, on: true }); return true; }
    const rest = shownParts().filter(k => k !== i);
    if (!rest.length) return false;                     // one part always stays on
    hidden.add(i);
    if (i === focus) {
      // the nearest part still on comes onto the page
      const next = rest.slice().sort((a, b) => Math.abs(a - i) - Math.abs(b - i) || a - b)[0];
      focusPart(next);
    }
    SW.bus.emit('parts:shown', { part: i, on: false });
    return true;
  }
  function firstPickup() {
    const line = document.querySelector('#score .notation-line');
    return line && !SW.timing.barsOf(line) ? line.dataset.pickup || '' : '';
  }

  /* score.js renderScore: take the parts of a normalized score, focus part i,
     and hand back the lines to draw on the page. */
  function load(score, i) {
    const n = countOf(score);
    parts = [];
    for (let k = 0; k < n; k++) parts.push(Object.assign(metaOf(score, k), { syls: linesOf(score, k).map(l => (l.bars ? [] : clone(l.syllables || []))) }));
    focus = ok(i) ? i : 0;
    hidden = new Set(Array.from(hidden).filter(k => k < n && k !== focus));
    const draw = (score.lines || []).map((l, k) => {
      const a = attrsOf(l);
      if (!a.bars) a.syllables = parts[focus].syls[k] || [];
      return a;
    });
    parts[focus].syls = null;
    return draw;
  }
  /* score.js readScore: the song's lines and parts, in the stored form */
  function write(out) {
    const dom = page();
    const sylsOf = (i, k) => (i === focus ? dom[k].syllables || [] : parts[i].syls[k] || []);
    out.lines = dom.map((l, k) => {
      const a = attrsOf(l);
      if (!a.bars) a.syllables = sylsOf(0, k);
      return a;
    });
    if (parts.length === 1 && emptyMeta(parts[0])) return out;
    out.parts = parts.map((p, i) => {
      const o = compactMeta(p);
      if (i) o.lines = dom.map((l, k) => ({ syllables: l.bars ? [] : sylsOf(i, k) }));
      return o;
    });
    return out;
  }

  /* ---------------- line operations, mirrored ----------------
     The page did one of these to its lines; the other parts' syllables
     follow. `at`, `from`, `to` are line indexes as the page had them
     BEFORE the operation; `tick` (split) is where in the line the new
     line starts, in ticks from the line's start — a part is cut at the
     first of its syllables that starts there or later (never inside a
     syllable), and a side with nothing left holds a rest. */
  function colTicks(c) {
    return c && SW.values.isValid(c.v) ? SW.values.byId(c.v).ticks : SW.meters.byId(S.meter).beatTicks;
  }
  function splitSyllables(syls, tick) {
    let t = 0, cut = syls.length;
    for (let s = 0; s < syls.length; s++) {
      if (s > 0 && t >= tick) { cut = s; break; }
      (syls[s].cols || []).forEach(c => { t += colTicks(c); });
    }
    const head = syls.slice(0, cut), tail = syls.slice(cut);
    return [head.length ? head : restSyllables(), tail.length ? tail : restSyllables()];
  }
  function mirror(op) {
    if (!op) return;
    parts.forEach(p => {
      const L = p.syls;
      if (!L) return;
      switch (op.kind) {
        case 'insert': L.splice(op.at, 0, restSyllables()); break;
        case 'delete': L.splice(op.at, 1); break;
        case 'clear': L[op.at] = restSyllables(); break;
        case 'move': { const [x] = L.splice(op.from, 1); L.splice(op.to, 0, x); break; }
        case 'duplicate': L.splice(op.at + 1, 0, clone(L[op.at] || restSyllables())); break;
        case 'join': if (op.at > 0 && op.at < L.length) { const tail = L.splice(op.at, 1)[0] || []; L[op.at - 1] = (L[op.at - 1] || []).concat(tail); } break;
        case 'split': L.splice(op.at, 1, ...splitSyllables(L[op.at] || [], op.tick)); break;
        default: break;
      }
    });
  }

  /* the whole song as a model, then drawn again with part i on the page —
     the Time Line's way (chord-timeline.js applyAll): one redraw, and the
     'score:changed' after it is the one step the history keeps (a focus
     alone changes nothing, so it records no step) */
  function redraw(model, i, reason, o) {
    if (SW.score.isTyping()) SW.score.finishTextEdit();
    SW.history.hold(() => SW.score.render(model, { part: i }));
    if (o && typeof o.at === 'number') selectAt(o.at);
    SW.score.changed(reason);
  }
  /* the page's column at (or last before) a song tick, selected */
  function selectAt(at) {
    let best = null;
    SW.timing.song().lines.forEach(le => le.events.forEach(ev => { if (ev.at <= at && (!best || ev.at > best.at)) best = ev; }));
    const note = best && best.stack ? best.stack.querySelector('.note') : null;
    if (note) SW.score.setNoteAsActive(note, false);
  }
  function focusPart(i, o) {
    if (!ok(i) || i === focus) {
      if (ok(i) && o && typeof o.at === 'number') { selectAt(o.at); SW.score.emitSelection(false); }
      return false;
    }
    redraw(SW.score.read(), i, 'part', o);
    return true;
  }
  /* A NEW PART FROM ANOTHER (later the same day, the user: "ask if they
     want to copy the notes/rhythm/text from another part … some may only
     want the words, some the notes or just the rhythms, some all three").
     One line's syllables, with what = { notes, rhythm, words } — each
     taken or left on its own:
       rhythm  every column's value and tie, rests where the rests were;
               without it the columns are blocks (no value: a quarter until
               written) and the rests are left out
       notes   every column's pitches (harmony and accidentals too);
               without them every note is do
       words   every syllable's word and hyphen; without them '-' (no
               word), and with nothing else a word is one block on do
     Nothing left in a line → one rest, as an empty part's line. The
     syllables' chords and key changes are the song's: never copied. */
  const isRestCol = c => (c.notes || []).length > 0 && c.notes.every(n => n.rest);
  function copySyllables(syls, what) {
    const w = what || {};
    const out = [];
    (syls || []).forEach(sy => {
      const word = !!w.words && typeof sy.text === 'string' && sy.text !== '-' && sy.text !== '';
      let cols = [];
      if (w.rhythm) cols = (sy.cols || []).map(c => {
        const col = {};
        if (c.v) col.v = c.v;
        if (isRestCol(c)) col.notes = [{ n: w.notes && c.notes[0].n ? c.notes[0].n : 'do', rest: true }];
        else {
          col.notes = w.notes ? clone(c.notes || []).map(n => { delete n.rest; return n; }) : [{ n: 'do' }];
          if (c.tie && c.v) col.tie = true;
        }
        if (!col.notes.length) col.notes = [{ n: 'do' }];
        return col;
      });
      else if (w.notes) cols = (sy.cols || []).filter(c => !isRestCol(c) && (c.notes || []).length).map(c => ({ notes: clone(c.notes) }));
      if (!cols.length) {
        if (!word) return;
        cols = [{ notes: [{ n: 'do' }] }];
      }
      const o = { text: word ? sy.text : '-', cols };
      if (word && sy.hy) o.hy = true;
      out.push(o);
    });
    return out.length ? out : restSyllables();
  }
  /* o: { from, notes, rhythm, words } — start the new part from part
     `from` (copySyllables); without it (or with nothing chosen) the new
     part is a rest in every sung line. A part that takes another's notes
     takes its clef too: the same notes, sounding the same. */
  function add(o) {
    if (parts.length >= MAX) return -1;
    const model = SW.score.read();
    const i = parts.length;
    const src = o && ok(o.from) && (o.notes || o.rhythm || o.words) ? linesOf(model, o.from) : null;
    setLines(model, i, (model.lines || []).map((l, k) => (l.bars ? { bars: l.bars } : { syllables: src && src[k] ? copySyllables(src[k].syllables, o) : restSyllables() })));
    if (src && o.notes && clefOf(o.from) === 'bass') model.parts[i] = Object.assign({}, model.parts[i], { clef: 'bass' });
    redraw(model, i, 'part');
    return i;
  }
  function remove(i) {
    if (!ok(i) || parts.length < 2) return false;
    const model = SW.score.read();
    const all = parts.map((p, k) => Object.assign(compactMeta(p), { lines: linesOf(model, k) }));
    all.splice(i, 1);
    hidden = new Set(Array.from(hidden).filter(k => k !== i).map(k => (k > i ? k - 1 : k)));
    delete model.parts;
    model.lines = all[0].lines;
    if (all.length > 1 || !emptyMeta(cleanMeta(all[0]))) {
      model.parts = all.map((p, k) => compactMeta(cleanMeta(p)));
      all.forEach((p, k) => { if (k) setLines(model, k, p.lines); });
    }
    const next = focus === i ? 0 : focus > i ? focus - 1 : focus;
    redraw(model, next, 'part');
    return true;
  }
  function setMeta(i, patch) {
    if (!ok(i) || !patch) return false;
    const was = meta(i);
    const next = cleanMeta(Object.assign({}, was, patch));
    if (next.name === was.name && next.sound === was.sound && next.volume === was.volume && next.clef === was.clef) return false;
    Object.assign(parts[i], next);
    const reason = 'name' in patch ? 'part-name' : 'sound' in patch ? 'part-sound' : 'clef' in patch ? 'part-clef' : 'part-volume';
    SW.score.changed(reason);
    return true;
  }

  /* ---------------- the rules, checked on copies ---------------- */
  function selfTest() {
    const failures = [];
    let checks = 0;
    const check = (name, cond) => { checks++; if (!cond) failures.push(name); };
    const N = m => SW.score.normalize(m);
    const one = N({ v: 2, key: 'C', lines: [{ label: 'A', syllables: [{ text: 'la', cols: [{ notes: [{ n: 'do' }] }] }] }, { label: 'B', bars: 2 }] });
    check('a one-part song has no parts field', one.parts === undefined && countOf(one) === 1);
    const two = N({ v: 2, key: 'C', lines: one.lines, parts: [{ name: 'Tune' }, { sound: 'bell', volume: 60, lines: [{ label: 'X', pickup: 'e', syllables: [{ text: 'ti', cols: [{ v: 'h', key: 'G', notes: [{ n: 'so' }] }] }] }] }] });
    check('two parts read', countOf(two) === 2);
    check('part 1 keeps its name', metaOf(two, 0).name === 'Tune');
    check('part 2 keeps its sound and volume', metaOf(two, 1).sound === 'bell' && metaOf(two, 1).volume === 60);
    check('a part has one line per song line', two.parts[1].lines.length === two.lines.length);
    check('a part line holds syllables alone', Object.keys(two.parts[1].lines[0]).join() === 'syllables');
    check('a part line of an instrumental line is empty', two.parts[1].lines[1].syllables.length === 0);
    check('a key change on part 2 is dropped', two.parts[1].lines[0].syllables[0].cols[0].key === undefined);
    check('part 1 never carries lines', two.parts[0].lines === undefined);
    const whole = linesOf(two, 1);
    check("a part's whole lines take the song's names and bars", whole[0].label === 'A' && whole[1].bars === 2 && whole[0].syllables[0].text === 'ti');
    const again = N(JSON.parse(JSON.stringify(two)));
    check('normalizing is stable', JSON.stringify(again) === JSON.stringify(two));
    const five = N({ v: 2, key: 'C', lines: one.lines, parts: [{}, { lines: [] }, { lines: [] }, { lines: [] }, { lines: [] }] });
    check('at most four parts', countOf(five) === MAX);
    check('a part with nothing gets a rest on each sung line', five.parts[1].lines[0].syllables[0].cols[0].notes[0].rest === true);
    const longer = N({ v: 2, key: 'C', lines: one.lines, parts: [{}, { lines: [{ syllables: [] }, { syllables: [] }, { syllables: [{ text: 'x', cols: [{ notes: [{ n: 're' }] }] }] }] }] });
    check('a part with more lines stretches the song', longer.lines.length === 3 && longer.lines[2].syllables[0].cols[0].notes[0].rest === true && longer.parts[1].lines[2].syllables[0].text === 'x');
    const plain = N({ v: 2, key: 'C', lines: one.lines, parts: [{}] });
    check('an empty parts list is no parts', plain.parts === undefined);
    check('everyLine lists each part', everyLine(two).length === 2);
    // a clef: bass or nothing; a one-part song keeps it
    const low = N({ v: 2, key: 'C', lines: one.lines, parts: [{ clef: 'bass' }] });
    check('a one-part song keeps a bass clef', countOf(low) === 1 && low.parts[0].clef === 'bass' && metaOf(low, 0).clef === 'bass');
    check('treble is never written', N({ v: 2, key: 'C', lines: one.lines, parts: [{ clef: 'treble' }] }).parts === undefined);
    check('an unknown clef reads as treble', metaOf({ parts: [{ clef: 'alto' }] }, 0).clef === 'treble');
    check('no clef reads as treble', metaOf(two, 1).clef === 'treble');
    const lowMidi = M => M.withClef('bass', () => M.noteMidi('do', 'natural', 'C'));
    check('bass sounds an octave under treble', lowMidi(SW.music) === SW.music.withClef('treble', () => SW.music.noteMidi('do', 'natural', 'C')) - 12);
    const c3 = SW.music.withClef('bass', () => SW.music.spellNote('do', 'natural', 'C'));
    check("do in C on a bass clef is C3", c3.letter === 'C' && c3.octave === 3);
    // the bass clef's range, A1 to A4, the same in every key
    const B = fn => SW.music.withClef('bass', fn);
    check('C an octave over the range folds back', B(() => SW.music.noteMidi('do-high2', 'natural', 'C')) === 60 && !B(() => SW.music.clefFits('do-high2', 'natural', 'C')));
    check("A♭'s low do folds up", B(() => SW.music.noteMidi('do-low', 'natural', 'Ab')) === 44 && !B(() => SW.music.clefFits('do-low', 'natural', 'Ab')));
    check('both ends fit', B(() => SW.music.clefFits('la-low2', 'natural', 'C') && SW.music.clefFits('la-high', 'natural', 'C')) && B(() => SW.music.noteMidi('la-low2', 'natural', 'C')) === 33 && B(() => SW.music.noteMidi('la-high', 'natural', 'C')) === 69);
    check('a sharp over the top does not fit', !B(() => SW.music.clefFits('la-high', 'sharp', 'C')));
    check('treble has no such limit', SW.music.withClef('treble', () => SW.music.clefFits('do-high2', 'natural', 'G') && SW.music.noteMidi('do-high2', 'natural', 'G') === 91));
    // a new part from another: notes, rhythm, words — each on its own
    const src = [{ text: 'twin', hy: true, chord: 'I', cols: [{ v: 'e', tie: true, key: 'G', notes: [{ n: 'so', acc: 'sharp' }, { n: 'mi' }] }, { v: 'e', notes: [{ n: 'la' }] }] }, { text: '-', cols: [{ v: 'q', notes: [{ n: 're', rest: true }] }] }, { text: 'kle', cols: [{ notes: [{ n: 'fa' }] }] }];
    const cp = what => copySyllables(clone(src), what);
    check('copy nothing is a rest', cp({})[0].cols[0].notes[0].rest === true && cp({}).length === 1);
    check('copy all keeps notes, rhythm, words', JSON.stringify(cp({ notes: true, rhythm: true, words: true })) === JSON.stringify([{ text: 'twin', cols: [{ v: 'e', notes: [{ n: 'so', acc: 'sharp' }, { n: 'mi' }], tie: true }, { v: 'e', notes: [{ n: 'la' }] }], hy: true }, { text: '-', cols: [{ v: 'q', notes: [{ n: 're', rest: true }] }] }, { text: 'kle', cols: [{ notes: [{ n: 'fa' }] }] }]));
    const words = cp({ words: true });
    check('copy words: a block on do for each word', words.length === 2 && words[0].text === 'twin' && words[0].hy === true && words[0].cols.length === 1 && words[0].cols[0].notes[0].n === 'do' && !words[0].cols[0].v);
    const rhythm = cp({ rhythm: true });
    check('copy rhythm: values and rests on do, no words', rhythm.length === 3 && rhythm[0].text === '-' && rhythm[0].cols[0].v === 'e' && rhythm[0].cols[0].tie === true && rhythm[0].cols[0].notes.length === 1 && rhythm[0].cols[0].notes[0].n === 'do' && rhythm[1].cols[0].notes[0].rest === true);
    const notes = cp({ notes: true });
    check('copy notes: pitches as blocks, rests left out', notes.length === 2 && notes[0].text === '-' && !notes[0].cols[0].v && !notes[0].cols[0].tie && notes[0].cols[0].notes[0].acc === 'sharp' && notes[0].cols.length === 2);
    check('a copy never takes chords or key changes', !cp({ notes: true, rhythm: true, words: true })[0].chord && cp({ notes: true, rhythm: true, words: true })[0].cols[0].key === undefined);
    // mirrored line operations, on a copy of the live state
    const keep = parts, keepFocus = focus;
    try {
      parts = [{ name: '', sound: '', volume: 100, syls: null }, { name: '', sound: '', volume: 100, syls: [[{ text: 'a', cols: [{ v: 'q', notes: [{ n: 'do' }] }] }, { text: 'b', cols: [{ v: 'q', notes: [{ n: 're' }] }] }], restSyllables()] }];
      focus = 0;
      mirror({ kind: 'split', at: 0, tick: 24 });
      check('split cuts at the tick', parts[1].syls.length === 3 && parts[1].syls[0][0].text === 'a' && parts[1].syls[1][0].text === 'b');
      mirror({ kind: 'join', at: 1 });
      check('join puts it back', parts[1].syls.length === 2 && parts[1].syls[0].length === 2);
      mirror({ kind: 'duplicate', at: 0 });
      mirror({ kind: 'move', from: 0, to: 2 });
      check('duplicate and move', parts[1].syls.length === 3 && parts[1].syls[2][0].text === 'a');
      mirror({ kind: 'delete', at: 2 });
      mirror({ kind: 'insert', at: 2 });
      check('delete and insert', parts[1].syls.length === 3 && parts[1].syls[2][0].cols[0].notes[0].rest === true);
    } finally { parts = keep; focus = keepFocus; }
    return { ok: !failures.length, failures, checks };
  }

  SW.parts = {
    MAX,
    countOf, linesOf, setLines, everyLine, metaOf, cleanMeta, compactMeta, restSyllables,
    count, focused, meta, clef: clefOf, label, lines, song: partSong, firstPickup, isShown, shownParts, setShown,
    focus: focusPart, add, remove, setMeta, mirror, copySyllables,
    load, write, selfTest
  };
})();

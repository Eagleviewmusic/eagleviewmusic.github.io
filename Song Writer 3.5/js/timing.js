/* ==========================================================================
   Song Writer — timing.js
   --------------------------------------------------------------------------
   SW.timing   The one reading of the song's time, shared by the staff
               (js/staff.js) and the player (js/player.js) so what is
               printed and what is heard can never disagree — the rule
               every Eagle View notation app keeps (NOTATION-README §9).

   TICKS — 24 to a quarter note, as everywhere else.

   COLUMNS — every .harmony-stack is one event. A NOTE (a column with a
   value) lasts its value. A BLOCK (no value yet) lasts one beat, a
   quarter: the rhythm is still to be decided, and until it is the block
   stands in for a beat, so bar lines and playback always know where they
   are. A rest column is a rest of the same length.

   BARS — each line of the song starts a new bar (a line is a phrase, and
   a phrase that comes out a beat short must not throw every bar after it
   off). Bar and beat numbers are counted from the line's start in the
   song's meter (SW.state.meter). A line's last bar is padded with silence
   to the bar in playback.

   INSTRUMENTAL LINES — `lines[].bars` (3.0, 2026-10-29): a line of bars
   with no melody (restLine below).

   PICK-UP — a line's own (2026-10-01): `data-pickup` on the line holds a
   value id ('e', 'q.', …; `lines[].pickup` in the model), made with
   Pick-up in the Edit box (score.js PICK-UPS) or, for the first line,
   Layout settings → Pick-up. The line opens with a pick-up that long:
   bar 0 is the pick-up, and its bar lines fall that much later (bar k
   starts at k × bar − shift, shift = a bar less the pick-up). A pick-up
   a bar long or more (after a change of time) counts as none. Beats are
   counted from the bar lines, so beams follow the pick-up.
   (Until 2026-10-01 it was one beat on every line, switched for the
   whole song — `score.pickup: 1`; normalizeScore reads that as a
   quarter on each line that kept its pick-up.)

   PADDING — a line runs on (in silence) until the next line's pick-up
   lands on its bar line: the least length L ≥ its notes with
   L + next pick-up − own pick-up a whole number of bars. So the pick-up
   is the end of the bar the line before left open, as in print; every
   downbeat of the song sits on one grid (the first line's); and after
   the last line the next is the first (the song goes round), so with
   every line picked up the song's last bar is a beat short. With no
   pick-ups at all this is simply "padded to a whole bar".

   BEAMS — notes shorter than a beat that sit together inside one beat are
   beamed as a group; a block, a rest, a longer note or a beat boundary
   ends the group. Only NOTES beam: a block is not on the staff.

   TIES — a column tied to the next (data-tie, score.js TIES) holds over
   every pitch the next column shares, in the same line: ev.tieNext and
   ev.tiePitches for the arc (staff.js), nx.tiedIn (the midis not struck
   again) and ev.sustain (midi → ticks the pitch sounds, the whole chain)
   for the player. A block or a rest ties to nothing.

   API
     SW.timing.column(stack)          one event, no time
     SW.timing.lineEvents(lineEl)     { meter, events, total, padded, pickup,
                                        shift, barStart(bar), endsOnBar, opensNext }
     SW.timing.song(o?)               every line of the page, with absolute starts (o.pitches === false: time alone)
     SW.timing.songOf(lines, o?)      a part's model lines the same way (PARTS, js/parts.js; o.keyAt(tick))
     SW.timing.columnsOf(lines)       model columns in time, no pitches (the key map, js/keys.js)
     SW.timing.pickupTicks(id, mt)    a pick-up id's ticks (0: none, or a bar or more)
     SW.timing.linePickup(lineEl)     this line's pick-up in ticks (0: none)
     SW.timing.barsOf(lineEl)         an instrumental line's bars (0: a line of melody)
     SW.timing.tickMs()               milliseconds per tick at the tempo
     SW.timing.swing(shift, mt?)      the clock's bend for the song's swing (SWING below)
     SW.timing.swingPlays(mt?)        whether that swing is heard in this meter
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const meter = () => SW.meters.byId(S.meter);
  /* a pick-up id's ticks — none when it is a bar long or more (PICK-UP) */
  function pickupTicks(id, mt) {
    if (!id || !SW.values.isValid(id)) return 0;
    const t = SW.values.byId(id).ticks;
    return t < mt.barTicks ? t : 0;
  }
  function linePickup(line, mt) {
    if (!line || barsOf(line)) return 0;
    return pickupTicks(line.dataset.pickup, mt);
  }
  const allLines = () => Array.from(document.querySelectorAll('#score .notation-line'));
  const mod = (a, b) => ((a % b) + b) % b;

  /* ==================================================================
     ONE READING OF TIME, TWO SOURCES (PARTS, 2026-11-03 — js/parts.js)
     The part on the page is read from its columns (column, lineSource);
     the other parts are read from the model (modelColumn, modelSource).
     Both become the same LINE SOURCE —
       { bars, pickup, nextPickup (ticks), last, columns }
     — and events() works the time out once, for either: starts, bars,
     beats, beams, padding. Ties and sustain come after (ties), once the
     pitches are known: a column of the model gets its pitches only once
     its tick — and so its key (KEY CHANGES) — is known.
     ================================================================== */

  /* The sounding notes of a column, spelled for the staff in `key` and
     coloured as their blocks are. notes: [{ nc, acc, el? }], no rests. */
  function pitchesOf(notes, key) {
    const pitches = M.withKey(key, () => notes.map(n => {
      const sp = M.spellNote(n.nc, n.acc);
      const sol = M.solfegeOf(n.nc, n.acc);               // ra, me, fi … (Do on the tonic)
      return {
        el: n.el || null, nc: n.nc, acc: n.acc, sol,
        folded: !M.clefFits(n.nc, n.acc),                  // kept inside the clef's range (core.js)
        letter: sp.letter, alter: sp.alter, octave: sp.octave, midi: sp.midi,
        step: LETTERS.indexOf(sp.letter) + 7 * sp.octave + M.clef().staffShift,   // its place on the staff (core.js THE CLEF IN EFFECT)
        color: M.noteColour(n.nc) || '#888',
        name: sp.letter + M.prettyAlter(sp.alter)          // B♭, not B
      };
    }));
    pitches.sort((a, b) => a.step - b.step);
    return pitches;
  }
  /* what every column carries, from the page or the model */
  function columnOf(v, rest, tie) {
    const value = SW.values.byId(v || SW.values.DEFAULT);
    return {
      v, value, notated: !!v, rest, tie: !!tie,
      ticks: v ? value.ticks : meter().beatTicks      // a block is one beat (a dotted quarter in 6/8)
    };
  }
  /* One column, read from the page. o.pitches === false: its time alone
     (no key is asked for — js/keys.js asks this while working its key map
     out, so it must not ask back). */
  function column(stack, o) {
    const notes = Array.from(stack.querySelectorAll('.note'));
    const v = SW.score.isNotated(stack) ? stack.dataset.v : null;
    const rest = notes.length > 0 && notes.every(n => n.classList.contains('rest-note'));
    const sounding = notes.filter(n => !n.classList.contains('rest-note'))
      .map(n => ({ el: n, nc: M.noteClassOf(n) || 'do', acc: SW.score.getAccidentalFromNote(n) }));
    // in the key the column is in (KEY CHANGES, js/keys.js)
    const pitches = o && o.pitches === false ? [] : pitchesOf(sounding, SW.keys ? SW.keys.at(stack) : S.key);
    return Object.assign(columnOf(v, rest, stack.dataset.tie), {
      stack, notes, pitches, spec: null,
      syllable: stack.closest('.syllable')
    });
  }
  /* One column of the model (a `cols[]` spec, JSON-FORMAT §2); pitches
     are filled in by songOf once its tick is known. */
  function modelColumn(spec) {
    const notes = Array.isArray(spec.notes) ? spec.notes : [];
    const rest = notes.length > 0 && notes.every(n => n.rest);
    return Object.assign(columnOf(SW.values.isValid(spec.v) ? spec.v : null, rest, spec.tie), {
      stack: null, notes: [], pitches: [], spec, syllable: null
    });
  }
  const soundingOf = spec => (spec.notes || []).filter(n => !n.rest).map(n => ({ el: null, nc: n.n, acc: n.acc || 'natural' }));

  /* a line of the page as a source */
  function lineSource(line, mt, o) {
    const lines = allLines();
    const i = lines.indexOf(line);
    const next = i < 0 ? line : (lines[i + 1] || lines[0]);     // after the last line the first (the song goes round)
    const bars = barsOf(line);
    const Pn = linePickup(next, mt);
    return {
      bars,
      pickup: bars ? 0 : linePickup(line, mt),
      nextPickup: bars && next === line ? 0 : Pn,
      last: i < 0 || i === lines.length - 1,
      columns: bars ? [] : Array.from(line.querySelectorAll('.harmony-stack')).map(st => column(st, o))
    };
  }
  /* a line of the model as a source */
  function barsOfModel(l) {
    const n = l ? Number(l.bars) : 0;
    const sung = Array.isArray(l && l.syllables) && l.syllables.length > 0;
    return n > 0 && n === Math.floor(n) && !sung ? Math.min(n, 64) : 0;
  }
  function modelSource(l, next, last, mt) {
    const bars = barsOfModel(l);
    const P = x => (!x || barsOfModel(x) ? 0 : pickupTicks(x.pickup, mt));
    const columns = [];
    // a column's word (its syllable's text, on the syllable's first column — components/part-rows.js draws it)
    if (!bars) (Array.isArray(l.syllables) ? l.syllables : []).forEach((s, si) => (Array.isArray(s.cols) ? s.cols : []).forEach((c, j) => {
      const ev = modelColumn(c);
      ev.sylIndex = si;                                // its syllable (the engraver's joint plan groups by it)
      ev.sylFirst = j === 0;
      ev.word = j === 0 && s.text && s.text !== '-' ? { text: String(s.text), hy: !!s.hy } : null;
      ev.hy = !!s.hy;
      columns.push(ev);
    }));
    return { bars, pickup: bars ? 0 : P(l), nextPickup: bars && next === l ? 0 : P(next), last, columns };
  }

  /* A line's columns in time, from a source. Adds start/end, bar and
     beat, and beam groups (ev.beam = group index, or null). */
  function events(src, mt) {
    if (src.bars) return restLine(src, mt);
    const P = src.pickup;
    const shift = P ? mt.barTicks - P : 0;            // bar 0 is the pick-up's one beat
    let t = 0;
    const events = src.columns.map(ev => {
      ev.start = t;
      ev.end = t + ev.ticks;
      ev.bar = Math.floor((t + shift) / mt.barTicks);
      ev.beat = Math.floor((t + shift) / mt.beatTicks);   // beat number, counted from the bar lines
      ev.beam = null;
      ev.tiedIn = new Set();
      ev.tieNext = false;
      ev.tiePitches = [];
      ev.sustain = new Map();
      t = ev.end;
      return ev;
    });

    // beam groups: consecutive notes shorter than a beat, all inside one beat
    let group = -1, groupBeat = null, members = [];
    const close = () => {
      if (members.length < 2) members.forEach(e => { e.beam = null; });
      members = [];
      groupBeat = null;
    };
    events.forEach(ev => {
      // flagged notes beam (a quarter inside a 6/8 beat is shorter than the beat, but has no flag)
      const beamable = ev.notated && !ev.rest && (ev.value.base === 'e' || ev.value.base === 's');
      const endBeat = Math.floor((ev.end - 1 + shift) / mt.beatTicks);
      if (!beamable || endBeat !== ev.beat) { close(); return; }
      if (groupBeat !== ev.beat) { close(); group++; groupBeat = ev.beat; }
      ev.beam = group;
      members.push(ev);
    });
    close();

    // PADDING: on until the next line's pick-up lands on this line's bar line
    const Pn = src.nextPickup;
    const padded = t === 0 ? 0 : t + mod(P - Pn - t, mt.barTicks);
    return {
      meter: mt, events, total: t, padded, pickup: P, shift,
      barStart: b => b * mt.barTicks - shift,         // where bar b begins (the pick-up's bar began before the line)
      endsOnBar: (t + shift) % mt.barTicks === 0,     // the line's notes end on a bar line
      opensNext: !src.last && Pn > 0,                 // the next line's pick-up finishes this line's last bar
      notatedCount: events.filter(e => e.notated).length
    };
  }
  /* TIES, once every column has its pitches */
  function ties(events) {
    events.forEach((ev, i) => {
      const nx = events[i + 1];
      ev.tiedIn = ev.tiedIn || new Set();
      ev.tieNext = false;
      ev.tiePitches = [];
      if (!ev.tie || !nx || !ev.notated || ev.rest || !nx.notated || nx.rest) return;
      const shared = ev.pitches.filter(p => nx.pitches.some(q => q.midi === p.midi));
      if (!shared.length) return;
      ev.tieNext = true;
      ev.tiePitches = shared;
      nx.tiedIn = new Set(shared.map(p => p.midi));
    });
    for (let i = events.length - 1; i >= 0; i--) {
      const ev = events[i], nx = events[i + 1];
      ev.sustain = new Map();
      ev.pitches.forEach(p => ev.sustain.set(p.midi,
        ev.ticks + (ev.tieNext && nx.tiedIn.has(p.midi) ? nx.sustain.get(p.midi) : 0)));
    }
  }
  /* a line of the page: its events, ties and all (o.pitches === false: time
     alone; o.natural: its own length, not the song's shared one — SHARED
     LENGTHS below asks this way while working the shared ones out) */
  function lineEvents(line, o) {
    const mt = meter();
    const le = events(lineSource(line, mt, o), mt);
    if (!(o && o.pitches === false)) ties(le.events);
    le.own = le.padded;
    if (!(o && o.natural)) le.padded = sharedLength(allLines().indexOf(line), le.padded, mt);
    return le;
  }

  /* AN INSTRUMENTAL LINE (3.0, 2026-10-29 — `lines[].bars`, data-bars on
     the line): bars with no melody, an intro or an interlude, drawn as a
     row of its chords. It has no notes and no pick-up; the next line's
     pick-up sounds in its last bar (there is nothing there to collide
     with), so the song's downbeats stay on one grid. */
  function barsOf(line) {
    const n = line && line.dataset ? Number(line.dataset.bars) : 0;
    return n > 0 && n === Math.floor(n) ? Math.min(n, 64) : 0;
  }
  function restLine(src, mt) {
    const Pn = src.nextPickup;
    const padded = src.bars * mt.barTicks - Pn;
    return {
      meter: mt, events: [], total: padded, padded, pickup: 0, shift: 0, bars: src.bars,
      barStart: b => b * mt.barTicks,
      endsOnBar: Pn === 0,
      opensNext: !src.last && Pn > 0,
      notatedCount: 0
    };
  }

  /* THE SONG'S GRID (PARTS): bar 1, the swing's spans and the chords' bars
     are counted from the song's first line's pick-up (the lines are the
     song's — parts.js), so the chord track never moves when the page
     changes part. */
  function gridPickup(mt) { return SW.parts ? pickupTicks(SW.parts.firstPickup(), mt) : 0; }

  /* SHARED LENGTHS (PARTS, the lines are the song's): line k is as long as
     the longest part's needs for it — a part with less in it runs on in
     silence to that bar line (the staff finishes it with rests). The
     natural length of every part's every line is read once a song version
     (the page's part from the page, the others from the model, no pitches)
     and the longest wins. */
  let lengths = null;             // part → [natural padded ticks per line]
  ['score:changed', 'score:loaded', 'meter:changed'].forEach(evt => SW.bus.on(evt, () => { lengths = null; }));
  function naturalOf(lines, mt) {
    const list = Array.isArray(lines) ? lines.filter(l => l && typeof l === 'object') : [];
    return list.map((l, i) => events(modelSource(l, list[i + 1] || list[0], i === list.length - 1, mt), mt).padded);
  }
  function table(mt) {
    if (lengths) return lengths;
    lengths = new Map();
    const f = SW.parts.focused();
    for (let i = 0; i < SW.parts.count(); i++) {
      lengths.set(i, i === f ? allLines().map(line => lineEvents(line, { pitches: false, natural: true }).padded) : naturalOf(SW.parts.lines(i), mt));
    }
    return lengths;
  }
  function sharedLength(k, own, mt) {
    if (!SW.parts || SW.parts.count() < 2 || k < 0) return own;
    let out = own;
    table(mt).forEach(lens => { if (lens[k] !== undefined) out = Math.max(out, lens[k]); });
    return out;
  }
  function sharedLengths(own, mt) {
    return own.map((v, k) => sharedLength(k, v, mt));
  }

  /* The whole song on the page: lines in order, each starting on the bar
     after the previous one ends. Events carry `at` (absolute ticks).
     o.pitches === false: time alone (js/keys.js). */
  function song(o) {
    const lines = allLines();
    const mt = meter();
    let at = 0;
    const out = lines.map(line => { const le = lineEvents(line, o); le.line = line; return le; });   // each line's length already the song's (lineEvents)
    out.forEach(le => {
      le.at = at;
      le.events.forEach(ev => { ev.at = at + ev.start; });
      at += le.padded;
    });
    const p0 = gridPickup(mt);
    return { lines: out, total: at, meter: mt, pickup: p0, shift: p0 ? mt.barTicks - p0 : 0 };
  }
  /* A part that is not on the page, from its model lines (parts.lines(i)):
     the same shape as song(), its events without stacks (stack, syllable
     null; `spec` the column). Pitches are spelled in the key in force at
     each column's tick (o.keyAt(tick), else the song's key map) and in the
     clef o.clef (SW.parts.song(i) passes the part's own); o.pitches === false
     gives the time alone. */
  function songOf(lines, o) {
    const opt = o || {};
    const mt = meter();
    const list = Array.isArray(lines) ? lines.filter(l => l && typeof l === 'object') : [];
    const keyAt = opt.keyAt || (t => (SW.keys ? SW.keys.atTick(t) : S.key));
    let at = 0;
    const out = list.map((l, i) => {
      const le = events(modelSource(l, list[i + 1] || list[0], i === list.length - 1, mt), mt);
      le.line = null;
      le.model = l;
      return le;
    });
    const shared = sharedLengths(out.map(le => le.padded), mt);
    out.forEach((le, k) => {
      le.own = le.padded;
      le.padded = shared[k];
      le.at = at;
      le.events.forEach(ev => { ev.at = at + ev.start; });
      if (opt.pitches !== false) {
        M.withClef(opt.clef, () => le.events.forEach(ev => { ev.pitches = ev.rest ? [] : pitchesOf(soundingOf(ev.spec), keyAt(ev.at)); }));
        ties(le.events);
      }
      at += le.padded;
    });
    const p0 = gridPickup(mt);
    return { lines: out, total: at, meter: mt, pickup: p0, shift: p0 ? mt.barTicks - p0 : 0 };
  }
  /* The columns of model lines in time, no pitches asked for — what the
     key map is built from (js/keys.js): [{ at, barTick (the song tick of
     its bar's first beat), first (the first column that starts in its
     bar), spec }]. */
  function columnsOf(lines) {
    const out = [];
    songOf(lines, { pitches: false }).lines.forEach(le => {
      let bar = null;
      le.events.forEach(ev => {
        out.push({ at: ev.at, barTick: le.at + le.barStart(ev.bar), first: ev.bar !== bar, spec: ev.spec });
        bar = ev.bar;
      });
    });
    return out;
  }

  /* the tempo counts beats: quarters in 4/4, dotted quarters in 6/8 */
  function tickMs() { return 60000 / (S.bpm || 100) / meter().beatTicks; }

  /* ==================================================================
     SWING (2026-11-01, the user — Setup → Swing: None · 8th · 16th)
     The song's eighths (8th) or sixteenths (16th) are played in pairs,
     long then short — a triplet's 2 + 1. Nothing written moves: the
     staff, the bars and every tick stay straight; only the clock is
     bent. Each pair's span (a quarter for 8th swing, an eighth for
     16th) starts where it always did; its first half is stretched over
     two thirds of it and its second half squeezed into the last third,
     so the "and" lands two thirds of the way through the beat. The
     beats never move, so the steady beat and the count-in do not either.
     Spans are counted on the song's grid (the first line's bar lines —
     PICK-UP above). In compound time (6/8 9/8 12/8) the eighths already
     go in threes: 8th swing plays straight there, and 16th swing swings
     the sixteenths inside each eighth.

       swing(shift, mt)   the bend for a grid `shift` ticks along (song().shift,
                          a line's own shift, 0 from a beat) in meter mt (else
                          the song's): { on, at(t), back(x), len(t, d) } —
                          at: tick t → when it sounds, in straight ticks;
                          back: the other way; len: how long d ticks from t
                          last. With no swing, at and back give the tick back.
       swingPlays(mt)     the song's swing is heard in meter mt (else the song's)
     ================================================================== */
  const SWING_SPAN = { '8': 24, '16': 12 };
  function swingSpan(mt) {
    const u = SWING_SPAN[S.swing] || 0;
    return mt.compound && u === 24 ? 0 : u;
  }
  function swing(shift, mt) {
    const U = swingSpan(mt || meter());
    if (!U) return { on: false, at: t => t, back: x => x, len: (t, d) => d };
    const k = shift || 0, H = U / 2, L = U * 2 / 3;
    const at = t => { const p = mod(t + k, U); return t - p + (p < H ? p * 4 / 3 : L + (p - H) * 2 / 3); };
    const back = x => { const p = mod(x + k, U); return x - p + (p < L ? p * 3 / 4 : H + (p - L) * 3 / 2); };
    return { on: true, at, back, len: (t, d) => at(t + d) - at(t) };
  }

  /* ==================================================================
     SPELLING A LENGTH (2.5 — SONG-WRITER-RHYTHM-PLAN.md §5, P1)
     How a stretch of time is written as note values, the way print
     writes it. Used by the staff (a note crossing a bar line is drawn as
     tied pieces; a line that stops inside a bar is finished with rests)
     and by the flow engine (a length that is no single value is stored
     as tied columns). Nothing here changes the song.

       spell(len, pos, mt, rest)  value ids filling `len` ticks starting
                                  `pos` ticks into a bar. Notes: the
                                  largest value that fits, then the next.
                                  Rests: first to the next beat, then
                                  whole beats (a half rest only on beat 1
                                  or 3, never one longer than the bar).
       barPieces(ev, le)          a written column that crosses a bar
                                  line → [{ id, start, ticks }], one per
                                  piece (the first is the column's own
                                  look); null when it does not cross
       fillPieces(le)             the rests that finish a line's last bar
                                  (from its notes' end to `padded`)
     ================================================================== */
  const NOTE_IDS = ['w.', 'w', 'h.', 'h', 'q.', 'q', 'e.', 'e', 's'];
  const REST_IDS = ['w', 'h', 'q', 'e', 's'];
  /* compound time (6/8 9/8 12/8) is written in dotted values, so a long
     note shows where its beats fall (four eighths = ♩. ⁀ ♪, not 𝅗𝅥) and a
     beat's rest is a dotted quarter rest */
  const NOTE_IDS_C = ['w.', 'h.', 'q.', 'q', 'e.', 'e', 's'];
  const REST_IDS_C = ['h.', 'q.', 'q', 'e', 's'];
  function spell(len, pos, mt, rest, allowed) {
    const out = [];
    let guard = 0;
    pos = mod(pos, mt.barTicks);
    const ok = id => !allowed || allowed.indexOf(id) !== -1 || id === 'q' || id === mt.beatValue;
    const notes = mt.compound ? NOTE_IDS_C : NOTE_IDS;
    const rests = mt.compound ? REST_IDS_C : REST_IDS;
    while (len >= 6 && guard++ < 64) {
      let pick = null;
      if (rest) {
        const into = pos % mt.beatTicks;
        const room = into ? Math.min(len, mt.beatTicks - into) : Math.min(len, mt.barTicks - pos);
        for (const id of rests) {
          const t = SW.values.byId(id).ticks;
          if (t > room || !ok(id)) continue;
          if (!into && t > mt.beatTicks && pos % t !== 0) continue;
          pick = id;
          break;
        }
      } else {
        // in compound time a long note that starts inside a beat first fills that beat
        const into = pos % mt.beatTicks;
        const cap = mt.compound && into && len > mt.beatTicks - into ? mt.beatTicks - into : len;
        for (const id of notes) { if (SW.values.byId(id).ticks <= cap && ok(id)) { pick = id; break; } }
      }
      if (!pick) pick = 's';
      out.push(pick);
      const t = SW.values.byId(pick).ticks;
      len -= t;
      pos = mod(pos + t, mt.barTicks);
    }
    return out;
  }
  /* cut [from, to) at the bar lines of a line read by lineEvents, and
     spell each part */
  function spellSpan(from, to, le, rest, allowed) {
    const mt = le.meter;
    const out = [];
    let a = from;
    while (a < to) {
      const bar = Math.floor((a + le.shift) / mt.barTicks);
      const b = Math.min(to, le.barStart(bar + 1));
      spell(b - a, a + le.shift, mt, rest, allowed).forEach(id => {
        const t = SW.values.byId(id).ticks;
        out.push({ id, start: a, ticks: t });
        a += t;
      });
      a = b;
    }
    return out;
  }
  function barPieces(ev, le) {
    if (!ev.notated) return null;
    if (Math.floor((ev.end - 1 + le.shift) / le.meter.barTicks) === ev.bar) return null;
    const out = spellSpan(ev.start, ev.end, le, ev.rest);
    return out.length > 1 ? out : null;
  }
  function fillPieces(le) {
    if (!le.events.length || le.padded <= le.total) return [];
    return spellSpan(le.total, le.padded, le, true);
  }

  /* Where a column sits in its bar, for the Rhythm caption: the bar's
     number on the line (1 = the first whole bar), the beat it starts on
     (1-based, fractional), and how much of the bar is left after it. */
  function placeOf(stack) {
    const line = stack && stack.closest('.notation-line');
    if (!line) return null;
    const sg = song();
    const le = sg.lines.find(l => l.line === line);
    const ev = le && le.events.find(e => e.stack === stack);
    if (!ev) return null;
    const mt = le.meter;
    const endBar = Math.floor((ev.end - 1 + le.shift) / mt.barTicks);
    const left = le.barStart(endBar + 1) - ev.end;
    // numbered as the staff numbers them: through the song, the first whole bar is 1
    const p0 = sg.pickup;
    const songBar = (le.pickup && ev.bar === 0) ? 0 : Math.round((le.at + le.barStart(ev.bar) - p0) / mt.barTicks) + 1;
    return {
      bar: songBar,
      beat: 1 + ((ev.start + le.shift) % mt.barTicks) / mt.beatTicks,
      left,
      crosses: endBar !== ev.bar,
      le, ev
    };
  }

  SW.timing = {
    column, lineEvents, song, songOf, columnsOf, pickupTicks, tickMs, LETTERS, barsOf, swing,
    swingPlays: mt => swingSpan(mt || meter()) > 0,
    linePickup: line => linePickup(line, meter()),
    spell, spellSpan, barPieces, fillPieces, placeOf
  };
})();

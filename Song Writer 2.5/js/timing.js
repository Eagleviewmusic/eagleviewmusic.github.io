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
     SW.timing.song()                 every line, with absolute starts
     SW.timing.linePickup(lineEl)     this line's pick-up in ticks (0: none)
     SW.timing.tickMs()               milliseconds per tick at the tempo
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const meter = () => SW.meters.byId(S.meter);
  function linePickup(line, mt) {
    const id = line && line.dataset.pickup;
    if (!id || !SW.values.isValid(id)) return 0;
    const t = SW.values.byId(id).ticks;
    return t < mt.barTicks ? t : 0;
  }
  const allLines = () => Array.from(document.querySelectorAll('#score .notation-line'));
  const mod = (a, b) => ((a % b) + b) % b;

  /* One column, read from the DOM. `pitches` are the sounding notes,
     spelled for the staff and coloured as their blocks are. */
  function column(stack) {
    const notes = Array.from(stack.querySelectorAll('.note'));
    const v = SW.score.isNotated(stack) ? stack.dataset.v : null;
    const value = SW.values.byId(v || SW.values.DEFAULT);
    const rest = notes.length > 0 && notes.every(n => n.classList.contains('rest-note'));
    const pitches = notes.filter(n => !n.classList.contains('rest-note')).map(n => {
      const nc = M.noteClassOf(n) || 'do';
      const acc = SW.score.getAccidentalFromNote(n);
      const sp = M.spellNote(nc, acc);
      const sol = M.solfegeOf(nc, acc);               // ra, me, fi … (Do on the tonic)
      return {
        el: n, nc, acc, sol,
        letter: sp.letter, alter: sp.alter, octave: sp.octave, midi: sp.midi,
        step: LETTERS.indexOf(sp.letter) + 7 * sp.octave,
        color: M.noteColour(nc) || '#888',
        name: sp.letter + M.prettyAlter(sp.alter)          // B♭, not B
      };
    });
    pitches.sort((a, b) => a.step - b.step);
    return {
      stack, notes, v, value,
      ghost: !!stack.dataset.ghost,          // made by the rhythm (flow.js): drawn hollow until given a pitch
      notated: !!v,
      rest,
      ticks: v ? value.ticks : meter().beatTicks,     // a block is one beat (a dotted quarter in 6/8)
      pitches,
      syllable: stack.closest('.syllable')
    };
  }

  /* A line's columns in time. Adds start/end, bar and beat, and beam
     groups (ev.beam = group index, or null). */
  function lineEvents(line) {
    const mt = meter();
    const P = linePickup(line, mt);
    const shift = P ? mt.barTicks - P : 0;            // bar 0 is the pick-up's one beat
    const stacks = Array.from(line.querySelectorAll('.harmony-stack'));
    let t = 0;
    const events = stacks.map(stack => {
      const ev = column(stack);
      ev.start = t;
      ev.end = t + ev.ticks;
      ev.bar = Math.floor((t + shift) / mt.barTicks);
      ev.beat = Math.floor((t + shift) / mt.beatTicks);   // beat number, counted from the bar lines
      ev.beam = null;
      t = ev.end;
      return ev;
    });

    // beam groups: consecutive notes shorter than a beat, all inside one beat
    let group = -1, groupBeat = null, count = 0, members = [];
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
      count++;
    });
    close();

    // TIES
    events.forEach((ev, i) => {
      const nx = events[i + 1];
      ev.tiedIn = ev.tiedIn || new Set();
      ev.tieNext = false;
      ev.tiePitches = [];
      if (!ev.stack.dataset.tie || !nx || !ev.notated || ev.rest || !nx.notated || nx.rest) return;
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

    // PADDING: on until the next line's pick-up lands on this line's bar line
    const lines = allLines();
    const i = lines.indexOf(line);
    const next = i < 0 ? line : (lines[i + 1] || lines[0]);
    const Pn = linePickup(next, mt);
    const padded = t === 0 ? 0 : t + mod(P - Pn - t, mt.barTicks);
    return {
      meter: mt, events, total: t, padded, pickup: P, shift,
      barStart: b => b * mt.barTicks - shift,         // where bar b begins (the pick-up's bar began before the line)
      endsOnBar: (t + shift) % mt.barTicks === 0,     // the line's notes end on a bar line
      opensNext: i >= 0 && i < lines.length - 1 && Pn > 0,   // the next line's pick-up finishes this line's last bar
      notatedCount: events.filter(e => e.notated).length
    };
  }

  /* The whole song: lines in order, each starting on the bar after the
     previous one ends. Events carry `at` (absolute ticks). */
  function song() {
    const lines = Array.from(document.querySelectorAll('#score .notation-line'));
    let at = 0;
    const out = [];
    lines.forEach(line => {
      const le = lineEvents(line);
      le.line = line;
      le.at = at;
      le.events.forEach(ev => { ev.at = at + ev.start; });
      out.push(le);
      at += le.padded;
    });
    const mt = meter();
    const p0 = out.length ? out[0].pickup : 0;          // the song's grid is the first line's
    return { lines: out, total: at, meter: mt, pickup: p0, shift: p0 ? mt.barTicks - p0 : 0 };
  }

  /* the tempo counts beats: quarters in 4/4, dotted quarters in 6/8 */
  function tickMs() { return 60000 / (S.bpm || 100) / meter().beatTicks; }

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
    column, lineEvents, song, tickMs, LETTERS,
    linePickup: line => linePickup(line, meter()),
    spell, spellSpan, barPieces, fillPieces, placeOf
  };
})();

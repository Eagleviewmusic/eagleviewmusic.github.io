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

   PICK-UP — Layout settings → On the page → 1-beat pick-up. Every line
   then opens with a one-beat pick-up — unless that line's own was taken
   away (Join up or Delete on it, score.js; the line carries
   data-pickup="off", `pickup: false` in the model). A line with one has
   bar 0 = that one beat, and its bar lines fall a beat later (bar k
   starts at k × bar − shift, shift = a bar less the pick-up).
   Beats and beams are unmoved (the pick-up is a whole beat).

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
     SW.timing.pickup()               the song's pick-up in ticks (0 when off)
     SW.timing.linePickup(lineEl)     this line's (0 when off, or taken away)
     SW.timing.pickupSyllables(lineEl) the syllables that are its pick-up
     SW.timing.tickMs()               milliseconds per tick at the tempo
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  const meter = () => SW.meters.byId(S.meter);
  function pickup(mt) {
    const L = SW.settings && SW.settings.layout;
    return L && L.show && L.show.pickup && mt.beats > 1 ? mt.beatTicks : 0;
  }
  function linePickup(line, mt) {
    return line && line.dataset.pickup === 'off' ? 0 : pickup(mt);
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
    const colours = M.noteColorsByKey[S.key] || M.noteColorsByKey.C;
    const pitches = notes.filter(n => !n.classList.contains('rest-note')).map(n => {
      const nc = M.noteClassOf(n) || 'do';
      const acc = SW.score.getAccidentalFromNote(n);
      const sp = M.spellNote(nc, acc);
      const sol = M.noteToSolfege[nc];
      return {
        el: n, nc, acc, sol,
        letter: sp.letter, alter: sp.alter, octave: sp.octave, midi: sp.midi,
        step: LETTERS.indexOf(sp.letter) + 7 * sp.octave,
        color: colours[sol] || '#888',
        name: (M.letterNamesByKey[S.key] || M.letterNamesByKey.C)[sol] || sp.letter
      };
    });
    pitches.sort((a, b) => a.step - b.step);
    return {
      stack, notes, v, value,
      notated: !!v,
      rest,
      ticks: value.ticks,
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
      ev.beat = Math.floor(t / mt.beatTicks);       // beat number from the line's start
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
      const beamable = ev.notated && !ev.rest && ev.ticks < mt.beatTicks;
      const endBeat = Math.floor((ev.end - 1) / mt.beatTicks);
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

  /* A line's pick-up, as syllables: those whose notes lie inside its one
     beat. Null when it has none, or when a note or a syllable runs on
     past it (a first note longer than a beat) — then there is no beat of
     its own to join up or delete. `whole`: the pick-up is all the line. */
  function pickupSyllables(line) {
    const le = lineEvents(line);
    if (!le.pickup || !le.events.length) return null;
    const syls = [];
    for (const ev of le.events) {
      if (ev.start < le.pickup) {
        if (ev.end > le.pickup) return null;
        if (syls.indexOf(ev.syllable) === -1) syls.push(ev.syllable);
      } else if (syls.indexOf(ev.syllable) !== -1) return null;
    }
    const all = line.querySelectorAll(':scope > .syllable').length;
    return syls.length ? { syllables: syls, whole: syls.length >= all } : null;
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
    return { lines: out, total: at, meter: mt, pickup: pickup(mt), shift: p0 ? mt.barTicks - p0 : 0 };
  }

  function tickMs() { return 60000 / (S.bpm || 100) / SW.values.TICKS_PER_QUARTER; }

  SW.timing = {
    column, lineEvents, song, tickMs, pickupSyllables, LETTERS,
    pickup: () => pickup(meter()),
    linePickup: line => linePickup(line, meter())
  };
})();

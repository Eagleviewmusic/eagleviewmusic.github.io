/* ==========================================================================
   Song Writer 3.0 — track.js
   --------------------------------------------------------------------------
   SW.track   Chord progressions and the chord track (2026-10-03, the
              design in ../Song Writer Chord Progressions/, ENGINE.md).

   THE MODEL — two fields on the score, both omitted when empty:

     progressions: [ { id: 'p1', name: 'Verse', beats: 4, rhythm: 'q q e e q', bars: 1,
                       chords: [ { chord: 'I', place: 'f' }, { chord: 'vi', beats: 2, rhythm: 'h' } ] } ]
     track:        [ { prog: 'p1', from: 1, to: 8, phase: 4,
                       here: [ { bar: 8, beat: 1, beats: 4, chords: [ { chord: 'IV', beats: 2 }, … ] } ] },
                     { from: 30, to: 31, chords: [ { chord: 'bVII', beats: 8 } ] } ]     ← loose chords

   A PROGRESSION is a series of chords; each lasts `beats` (its own, or
   the progression's — one bar when neither says), and every bar plays
   the progression's RHYTHM (one bar, or two) unless the chord has its
   own. THE TRACK is where progressions play: stretches from bar `from`
   to bar `to` (inclusive; 'melody' = the melody's last bar, whatever it
   is now), never overlapping, `phase` beats into the progression. A
   stretch's `here` entries are changes made just there: they replace
   whatever the progression would play over their span. A stretch with
   no `prog` holds loose chords, laid end to end once.

   BARS are the staff's: bar 1 is the first whole bar, a first line's
   pick-up is bar 0. THE MELODY NEVER MOVES THE TRACK (decided
   2026-10-03, DESIGN §5.3): nothing outside this file's writers changes
   it, so a line growing or shrinking leaves every chord on its bar.

   RHYTHM STRINGS — value ids (`SW.values`), space-separated: `q q e e q`
   (ta ta ti-ti ta); `~` after one is silence (`q~`); `_` joins values
   into one strike (`h_e`). Inside, a rhythm is CELLS — sixteenths, six
   ticks (the beat strip's unit): X a strike starts, O it rings on, R
   silence. Or `held` (2026-10-27): one strike where the chord starts,
   ringing to its end, however long it is.

   MADE ON THE MUSIC (2026-10-27) — chords written straight over the
   music make a progression of their own; the stretch they were written
   in is its HOME (`home: true`): it plays the progression once, its bars
   follow the progression's length, and a change there changes the
   progression (THE CHORDS ON THE MUSIC, below).

   STRIKES — every bar of a stretch plays the rhythm, laid from the
   stretch's first bar line; each strike plays the chord in force; a
   chord always sounds where it starts (unless the rhythm is silent
   there); a strike rings to the rhythm's next strike or silence, or to
   the chord's end. A chord with its own rhythm plays that, laid from its
   own start. Loose chords with no rhythm are struck once and held.

   THE OLD LANE — a song with lane chords (`syllables[].chord`) and no
   track is read as one stretch of loose chords (`virtual()`), each from
   its word to the next change; the first change to the track writes it
   in for good and takes the chords off the words (one Undo step).

   API
     model() / load(score) / normalizeInto(raw, out)   with score.js
     grid(song?)       the bar grid: { T(bar), barAt(tick), lastBar, p0, B, b, mt, total }
     events(g?)        the chords in time: [{ at, end, id, stretch, prog, step, pass, here, hereIndex, hereStep, strikes:[{at,len}] }]
     end(g?)           the tick the track ends (0: none)
     at(tick, g?)      the event sounding at a tick
     hasChords()       anything that sounds?
     progressions() · prog(id) · stretches() · isVirtual()
     cells(str) · rhythmOf(cells) · fit(cells, n) · beatCells() · defaultRhythm()
     writers: addProg setProg removeProg duplicateProg moveProg
              setStep insertStep removeStep moveStep
              place setStretch moveStretch trimStart removeStretch
              setHere setHereSpan hereAt writeBack clear
     on the music      flat() · chordAt(tick) · putChord(tick, step) · moveChord(at, to, copy) ·
                       resizeChord(at, from, end) · removeChord(at) · setChord(at, patch) · homeOf(progId)
     the Time Line     tlBlock(ats) · tlPut(block, tick, movingAts?) · tlRemove(ats) ·
                       tlGroupTo(index, bar, stretch?) · tlGroupCopy(index) · tlPlace(progId, bar) · makeRoom(…)
     selfTest()        pure checks of the rhythm and timing rules
   Event: 'track:changed' { why } (after SW.score.changed('track'))
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const CELL = 6;                 // ticks in a cell (a sixteenth)
  const HELD = 'held';            // a rhythm: one strike, held (a progression's, or a chord's own)
  const MAX_BEATS = 64;
  const MAX_BAR = 999;
  const NAME_MAX = 24;

  if (!Array.isArray(S.progressions)) S.progressions = [];
  if (!Array.isArray(S.track)) S.track = [];

  const clone = x => JSON.parse(JSON.stringify(x));
  const mod = (a, n) => ((a % n) + n) % n;
  const meterOf = id => SW.meters.byId(id || S.meter);

  /* ================= RHYTHM STRINGS ↔ CELLS ================= */
  const SPELL = ['w.', 'w', 'h.', 'h', 'q.', 'q', 'e.', 'e', 's'];
  const ticksOf = id => SW.values.byId(id).ticks;

  /* "q q e e q" → "XOOOXOOOXOXOXOOO"; null when it cannot be read */
  function cells(str) {
    if (typeof str !== 'string') return null;
    const toks = str.trim().split(/\s+/).filter(Boolean);
    if (!toks.length) return null;
    let out = '';
    for (const tok of toks) {
      let t = tok, rest = false;
      if (/[~*]$/.test(t)) { rest = true; t = t.slice(0, -1); }
      let ticks = 0;
      for (const p of t.split('_')) {
        if (!SW.values.isValid(p)) return null;
        ticks += ticksOf(p);
      }
      const n = Math.round(ticks / CELL);
      if (n < 1) return null;
      out += rest ? 'R'.repeat(n) : 'X' + 'O'.repeat(n - 1);
    }
    return out;
  }
  function spellTicks(t) {
    const out = [];
    while (t >= CELL) {
      const id = SPELL.find(v => ticksOf(v) <= t);
      out.push(id);
      t -= ticksOf(id);
    }
    return out;
  }
  /* cells → the fewest values: "XOOOXOXO" → "q e e" */
  function rhythmOf(c) {
    const toks = [];
    let i = 0;
    while (i < c.length) {
      let j = i + 1;
      if (c[i] === 'R') {
        while (j < c.length && c[j] === 'R') j++;
        spellTicks((j - i) * CELL).forEach(v => toks.push(v + '~'));
      } else {
        while (j < c.length && c[j] === 'O') j++;
        toks.push(spellTicks((j - i) * CELL).join('_'));
      }
      i = j;
    }
    return toks.join(' ');
  }
  /* exactly n cells: cut, or filled out with silence; it cannot begin
     ringing on from nothing */
  function fit(c, n) {
    let out = String(c || '').slice(0, n);
    while (out.length < n) out += 'R';
    if (out[0] === 'O') out = 'X' + out.slice(1);
    return out;
  }
  const beatCells = mt => (mt || meterOf()).beatTicks / CELL;
  function defaultCells(mt, bars) {
    mt = mt || meterOf();
    const beat = 'X' + 'O'.repeat(beatCells(mt) - 1);
    return beat.repeat(mt.beats * (bars || 1));
  }
  const defaultRhythm = mt => rhythmOf(defaultCells(mt, 1));

  /* ================= THE MODEL ================= */
  /* beats → ticks, held to whole cells */
  const toTicks = (beats, b) => Math.round(beats * b / CELL) * CELL;
  function cleanBeats(x, mt) {
    const n = Number(x);
    if (!isFinite(n) || n <= 0 || n > MAX_BEATS) return null;
    if (Math.abs(n * mt.beatTicks - toTicks(n, mt.beatTicks)) > 0.01) return null;   // a whole number of sixteenths
    return Math.round(n * 1e4) / 1e4;
  }
  function cleanChord(id) {
    if (id === null) return null;
    if (typeof id !== 'string' || !id.trim()) return undefined;
    return (SW.chords && SW.chords.toId(id)) || id.trim().slice(0, 40);   // one the engine cannot read is kept (silent), as the lane kept one
  }
  /* 'held' (2026-10-27): struck once where the chord starts, ringing to its end */
  function cleanRhythm(str, n) {
    if (str === HELD) return HELD;
    const c = cells(str);
    return c ? rhythmOf(fit(c, n)) : null;
  }
  const progBeats = (p, mt) => (p && p.beats) || mt.beats;
  const stepBeats = (st, p, mt) => st.beats || progBeats(p, mt);
  function cycleBeats(p, mt) {
    return (p.chords || []).reduce((t, st) => t + stepBeats(st, p, mt), 0);
  }

  /* a chord of a progression, a change just here, or a loose chord */
  function cleanStep(s, mt, defBeats) {
    if (!s || typeof s !== 'object') return null;
    const chord = cleanChord(s.chord);
    if (chord === undefined) return null;
    const st = { chord };
    if (typeof s.place === 'string' && SW.chords && SW.chords.PLACES.indexOf(s.place) !== -1) st.place = s.place;
    const beats = cleanBeats(s.beats, mt);
    if (beats) st.beats = beats;
    const len = beats || defBeats;
    if (s.rhythm !== undefined && len) {
      const r = cleanRhythm(s.rhythm, toTicks(len, mt.beatTicks) / CELL);
      if (r) st.rhythm = r;
    }
    return st;
  }
  function cleanProg(p, mt, i) {
    if (!p || typeof p !== 'object') return null;
    const out = { id: typeof p.id === 'string' && /^p\d+$/.test(p.id) ? p.id : null };
    out.name = typeof p.name === 'string' && p.name.trim() ? p.name.trim().slice(0, NAME_MAX) : 'Progression ' + (i + 1);
    const beats = cleanBeats(p.beats, mt);
    if (beats) out.beats = beats;
    if (p.bars === 2) out.bars = 2;
    if (p.rhythm !== undefined) {
      const r = cleanRhythm(p.rhythm, mt.barTicks * (out.bars || 1) / CELL);
      if (r) out.rhythm = r;
    }
    out.chords = (Array.isArray(p.chords) ? p.chords : []).map(s => cleanStep(s, mt, out.beats || mt.beats)).filter(Boolean);
    return out;
  }

  /* the order of the keys a stretch is written in */
  function tidyStretch(r) {
    const o = {};
    if (r.prog) o.prog = r.prog;
    o.from = r.from;
    o.to = r.to;
    if (r.home && r.prog) o.home = true;
    if (r.phase) o.phase = r.phase;
    if (r.here && r.here.length) o.here = r.here;
    if (!r.prog) o.chords = r.chords;
    return o;
  }

  /* Cut the first `k` bars off a stretch (k < 0: grow it backwards),
     leaving every chord over the bar it was on: a progression's phase
     moves on; loose chords lose (or gain silence at) their start. */
  function shiftStart(r, k, mt, byId) {
    if (!k) return r;
    delete r.home;                                     // part of its home is not its home: it plays from inside it now
    if (r.prog) {
      const p = byId[r.prog];
      const C = p ? cycleBeats(p, mt) : 0;
      const ph = C ? mod((r.phase || 0) + k * mt.beats, C) : 0;
      r.phase = Math.round(ph * 1e4) / 1e4;
      if (!r.phase) delete r.phase;
    } else if (k > 0) {
      let drop = k * mt.barTicks;
      const out = [];
      (r.chords || []).forEach(st => {
        const len = toTicks(st.beats || mt.beats, mt.beatTicks);
        if (drop >= len) { drop -= len; return; }
        if (drop > 0) {
          const keep = Object.assign({}, st, { beats: Math.round((len - drop) / mt.beatTicks * 1e4) / 1e4 });
          if (st.rhythm && st.rhythm !== HELD) keep.rhythm = rhythmOf(fit(cells(st.rhythm).slice(drop / CELL), (len - drop) / CELL));
          drop = 0;
          out.push(keep);
          return;
        }
        out.push(st);
      });
      r.chords = out;
    } else {
      r.chords = [{ chord: null, beats: -k * mt.beats }].concat(r.chords || []);
    }
    r.from += k;
    if (r.here) {
      r.here = r.here.filter(h => h.bar >= r.from);
      if (!r.here.length) delete r.here;
    }
    return r;
  }

  /* where a stretch ends: its own bar, or the melody's last (never before
     its start) */
  const lastOf = (r, lastBar) => (r.to === 'melody' ? Math.max(r.from, lastBar) : r.to);
  /* where it really ends, as it plays (expand): never past the bar before
     the next stretch, which takes over. A stretch "to the end of the
     melody" with others after it holds only its own bars — cutting by
     lastOf instead let one such stretch wipe out every stretch after it
     (2026-10-12). */
  function reach(r, list, lastBar) {
    let last = lastOf(r, lastBar);
    list.forEach(o => { if (o !== r && o.from > r.from) last = Math.min(last, o.from - 1); });
    return Math.max(r.from, last);
  }

  /* Take bars from..to (inclusive) out of a list of stretches: one wholly
     inside goes, one across an end is trimmed, one around both is split —
     its second part carries on where it would have been. `laid`: a new
     stretch is going in there — one "to the end of the melody" that it
     starts on or inside stops where it starts, and does not carry on
     after it (the user, 2026-10-12: laying a song out section by section
     left the first one running on after the last). A stretch that only
     grows into it from before pushes its start back, as ever. */
  function cutList(list, from, to, mt, byId, lastBar, laid) {
    const out = [];
    list.forEach(r0 => {
      const rf = r0.from, rt = reach(r0, list, lastBar);
      if (rt < from || rf > to) { out.push(r0); return; }
      if (rf < from) {
        const left = clone(r0);
        left.to = from - 1;
        delete left.home;                                   // a home cut short is a home no more (its progression keeps every chord)
        if (left.here) {
          const endTick = (from - 1) * mt.barTicks;           // relative arithmetic: entries ending after bar from-1 go
          left.here = left.here.filter(h => (h.bar - 1) * mt.barTicks + (h.beat - 1) * mt.beatTicks + toTicks(h.beats, mt.beatTicks) <= endTick);
          if (!left.here.length) delete left.here;
        }
        out.push(left);
      }
      if (rt > to && !(laid && r0.to === 'melody' && rf <= from)) out.push(shiftStart(clone(r0), to + 1 - rf, mt, byId));
    });
    return out;
  }

  /* Anything read from storage, a file or a link (score.js normalizeScore
     calls this once the lines and meter are read). */
  function normalizeInto(raw, out) {
    const mt = meterOf(out.meter);
    const progs = [];
    const used = new Set();
    (Array.isArray(raw.progressions) ? raw.progressions : []).forEach((p, i) => {
      const c = cleanProg(p, mt, i);
      if (!c) return;
      if (c.id && used.has(c.id)) c.id = null;
      if (c.id) used.add(c.id);
      progs.push(c);
    });
    let next = 1;
    progs.forEach(p => {
      if (p.id) return;
      while (used.has('p' + next)) next++;
      p.id = 'p' + next;
      used.add(p.id);
    });
    // the key order a progression is written in
    const tidyProgs = progs.map(p => {
      const o = { id: p.id, name: p.name };
      if (p.beats) o.beats = p.beats;
      if (p.bars) o.bars = p.bars;
      if (p.rhythm) o.rhythm = p.rhythm;
      o.chords = p.chords;
      return o;
    });
    const byId = {};
    tidyProgs.forEach(p => { byId[p.id] = p; });

    const minBar = out.lines.length && out.lines[0].pickup ? 0 : 1;
    const homes = new Set();
    let list = [];
    (Array.isArray(raw.track) ? raw.track : []).forEach(r => {
      if (!r || typeof r !== 'object') return;
      const from = Math.round(Number(r.from));
      if (!isFinite(from) || from < minBar || from > MAX_BAR) return;
      let to;
      if (r.to === 'melody') to = 'melody';
      else {
        to = Math.round(Number(r.to));
        if (!isFinite(to) || to < from) return;
        to = Math.min(to, MAX_BAR);
      }
      const st = { from, to };
      if (typeof r.prog === 'string' && byId[r.prog]) {
        st.prog = r.prog;
        const p = byId[r.prog];
        const C = cycleBeats(p, mt);
        const ph = cleanBeats(r.phase, mt);
        if (ph && C) { const m = Math.round(mod(ph, C) * 1e4) / 1e4; if (m) st.phase = m; }
        if (r.home === true && !st.phase && !homes.has(r.prog)) { st.home = true; homes.add(r.prog); }   // one home a progression, from its start
        const here = [];
        (Array.isArray(r.here) ? r.here : []).forEach(h => {
          if (!h || typeof h !== 'object') return;
          const bar = Math.round(Number(h.bar)), beat = Number(h.beat), beats = cleanBeats(h.beats, mt);
          if (!isFinite(bar) || bar < from || (to !== 'melody' && bar > to)) return;
          if (!isFinite(beat) || beat < 1 || beat > mt.beats || !beats) return;
          if (Math.abs((beat - 1) * mt.beatTicks - toTicks(beat - 1, mt.beatTicks)) > 0.01) return;
          const raw2 = Array.isArray(h.chords) ? h.chords : [];
          const missing = raw2.filter(c => c && cleanBeats(c.beats, mt) === null).length;
          const given = raw2.reduce((t, c) => t + (cleanBeats(c && c.beats, mt) || 0), 0);
          const chords = raw2.map(c => cleanStep(c, mt, missing === 1 ? beats - given : null)).filter(Boolean);
          if (!chords.length || missing > 1) return;
          if (missing === 1) chords.forEach(c => { if (!c.beats) c.beats = Math.round((beats - given) * 1e4) / 1e4; });
          const sum = chords.reduce((t, c) => t + c.beats, 0);
          if (Math.abs(sum - beats) > 0.001 || chords.some(c => !c.beats || c.beats <= 0)) return;
          here.push({ bar, beat, beats, chords });
        });
        here.sort((a, b) => a.bar - b.bar || a.beat - b.beat);
        const startOf = h => (h.bar - 1) * mt.barTicks + (h.beat - 1) * mt.beatTicks;
        const keep = [];
        here.forEach(h => {
          const prev = keep[keep.length - 1];
          if (prev && startOf(h) < startOf(prev) + toTicks(prev.beats, mt.beatTicks)) return;   // the later one of two overlapping goes
          keep.push(h);
        });
        if (keep.length) st.here = keep;
      } else if (Array.isArray(r.chords)) {
        st.chords = r.chords.map(c => cleanStep(c, mt, mt.beats)).filter(Boolean);
        if (!st.chords.length) return;
      } else return;
      list.push(st);
    });
    list.sort((a, b) => a.from - b.from);
    // never overlapping: a later stretch loses the bars an earlier one has
    const clean = [];
    list.forEach(r => {
      const prev = clean[clean.length - 1];
      if (prev && prev.to !== 'melody' && r.from <= prev.to) {
        if (r.to !== 'melody' && r.to <= prev.to) return;
        shiftStart(r, prev.to + 1 - r.from, mt, byId);
      }
      if (prev && prev.to === 'melody' && r.from === prev.from) return;
      clean.push(r);
    });
    if (tidyProgs.length) out.progressions = tidyProgs;
    if (clean.length) out.track = clean.map(tidyStretch);
    return out;
  }

  function model() {
    const out = {};
    if (S.progressions.length) out.progressions = clone(S.progressions);
    if (S.track.length) out.track = clone(S.track);
    return out;
  }
  function load(score) {
    S.progressions = clone((score && score.progressions) || []);
    S.track = clone((score && score.track) || []);
  }

  /* ================= THE BAR GRID ================= */
  function grid(song) {
    song = song || SW.timing.song();
    const mt = song.meter;
    const p0 = song.pickup || 0;
    const B = mt.barTicks, b = mt.beatTicks;
    const total = song.total;
    return {
      mt, B, b, p0, total,
      lastBar: total > p0 ? Math.floor((total - 1 - p0) / B) + 1 : 0,
      T: bar => p0 + (bar - 1) * B,                    // where a song bar starts (bar 0, a pick-up, before 0)
      barAt: t => Math.floor((t - p0) / B) + 1,
      song
    };
  }

  /* ================= THE CHORDS IN TIME ================= */
  function strikesOf(piece, pattern, origin) {
    const out = [];
    let cur = null;
    const charAt = t => {
      if (piece.own) return piece.own[(t - piece.from) / CELL] || 'R';
      if (pattern === 'held') return t === piece.at ? 'X' : 'O';
      return pattern[mod((t - origin) / CELL, pattern.length)];
    };
    for (let t = piece.at; t < piece.end; t += CELL) {
      const ch = charAt(t);
      if (ch === 'X' || (t === piece.at && ch !== 'R')) { cur = { at: t, len: CELL }; out.push(cur); }
      else if (ch === 'O' && cur) cur.len += CELL;
      else cur = null;
    }
    return out;
  }
  function ownCells(st, len) {
    if (!st.rhythm) return null;
    if (st.rhythm === HELD) return 'X' + 'O'.repeat(Math.max(0, len / CELL - 1));
    const c = cells(st.rhythm);
    return c ? fit(c, len / CELL) : null;
  }
  /* an event's own rhythm over exactly its span: 'held', its cells, or null (it plays its stretch's) */
  function ownSpan(pc) {
    if (!pc.rhythm) return null;
    if (pc.rhythm === HELD) return HELD;
    return pc.own ? fit(pc.own.slice((pc.at - pc.from) / CELL, (pc.end - pc.from) / CELL), (pc.end - pc.at) / CELL) : null;
  }

  /* The pure expansion (testable without a song): progressions + stretches
     on a grid → events. */
  function expand(progs, track, g) {
    const byId = {};
    progs.forEach(p => { byId[p.id] = p; });
    const mt = g.mt;
    const starts = track.map(r => Math.max(0, g.T(r.from)));
    const out = [];
    let end = 0;
    track.forEach((r, si) => {
      const a = starts[si];
      const last = r.to === 'melody' ? g.lastBar : r.to;
      if (last < r.from) return;                                       // waiting for the melody
      let z = g.T(last + 1);
      starts.forEach((s, k) => { if (k !== si && s > a) z = Math.min(z, s); });   // the next stretch takes over
      if (z <= a) return;
      end = Math.max(end, z);
      const origin = g.T(r.from);                                     // the rhythm is laid from the stretch's first bar line
      let pieces = [];
      let pattern = 'held';
      const p = r.prog ? byId[r.prog] : null;
      if (r.prog) {
        if (!p) return;
        pattern = p.rhythm === HELD ? 'held' : fit(cells(p.rhythm) || defaultCells(mt, p.bars), mt.barTicks * (p.bars || 1) / CELL);
        const lens = p.chords.map(st => toTicks(stepBeats(st, p, mt), g.b));
        const C = lens.reduce((x, y) => x + y, 0);
        if (!C) return;
        const offs = [];
        lens.reduce((acc, l, i) => { offs[i] = acc; return acc + l; }, 0);
        const t0 = a - mod(toTicks(r.phase || 0, g.b), C);
        const passes = r.home ? 1 : 20000;                          // its home plays it once
        for (let n = 0; t0 + n * C < z && n < passes; n++) {
          for (let i = 0; i < p.chords.length; i++) {
            const s = t0 + n * C + offs[i], e = s + lens[i];
            if (e <= a) continue;
            if (s >= z) break;
            const st = p.chords[i];
            pieces.push({ at: Math.max(s, a), end: Math.min(e, z), from: s, id: st.chord, step: i, pass: n, own: ownCells(st, lens[i]), rhythm: st.rhythm, place: st.place });
          }
        }
        (r.here || []).forEach((h, hi) => {
          const h0 = g.T(h.bar) + toTicks(h.beat - 1, g.b), h1 = h0 + toTicks(h.beats, g.b);
          const c0 = Math.max(h0, a), c1 = Math.min(h1, z);
          if (c1 <= c0) return;
          const kept = [];
          pieces.forEach(pc => {
            if (pc.end <= c0 || pc.at >= c1) { kept.push(pc); return; }
            if (pc.at < c0) kept.push(Object.assign({}, pc, { end: c0 }));
            if (pc.end > c1) kept.push(Object.assign({}, pc, { at: c1 }));
          });
          let s = h0;
          h.chords.forEach((ch, ci) => {
            const len = toTicks(ch.beats, g.b);
            const at = Math.max(s, c0), e = Math.min(s + len, c1);
            if (e > at) kept.push({ at, end: e, from: s, id: ch.chord, step: null, pass: null, here: true, hereIndex: hi, hereStep: ci, own: ownCells(ch, len), rhythm: ch.rhythm, place: ch.place });
            s += len;
          });
          pieces = kept;
        });
      } else {
        let s = a;
        (r.chords || []).forEach((st, i) => {
          const len = toTicks(st.beats || mt.beats, g.b);
          const e = s + len;
          if (s < z && e > a) pieces.push({ at: Math.max(s, a), end: Math.min(e, z), from: s, id: st.chord, step: i, pass: 0, own: ownCells(st, len), rhythm: st.rhythm, place: st.place });
          s = e;
        });
      }
      pieces.sort((x, y) => x.at - y.at).forEach(pc => {
        out.push({
          at: pc.at, end: pc.end, id: pc.id,
          stretch: si, prog: r.prog || null, step: pc.step, pass: pc.pass, home: !!r.home,
          here: !!pc.here, hereIndex: pc.here ? pc.hereIndex : null, hereStep: pc.here ? pc.hereStep : null,
          place: pc.place || null, rhythm: ownSpan(pc),
          strikes: pc.id ? strikesOf(pc, pattern, origin) : []
        });
      });
    });
    out.sort((x, y) => x.at - y.at);
    out.end = end;
    return out;
  }

  /* ---- the old lane, read as loose chords ---- */
  function virtual(g) {
    if (S.track.length) return null;
    const changes = [];
    g.song.lines.forEach(le => le.events.forEach(ev => {
      const syl = ev.syllable;
      if (syl && syl.dataset.chord && syl.querySelector('.harmony-stack') === ev.stack) changes.push({ at: ev.at, id: syl.dataset.chord });
    }));
    if (!changes.length) return null;
    const from = Math.max(g.barAt(changes[0].at), g.p0 > 0 ? 0 : 1);
    const a = Math.max(0, g.T(from));
    const chords = [];
    const beatsOf = t => Math.round(t / g.b * 1e4) / 1e4;
    if (changes[0].at > a) chords.push({ chord: null, beats: beatsOf(changes[0].at - a) });
    changes.forEach((c, i) => {
      const e = i + 1 < changes.length ? changes[i + 1].at : g.total;
      if (e > c.at) chords.push({ chord: cleanChord(c.id) || c.id, beats: beatsOf(e - c.at) });
    });
    return { from, to: Math.max(from, g.lastBar), chords };
  }
  function current(g) {
    if (S.track.length) return S.track;
    const v = virtual(g);
    return v ? [v] : [];
  }
  const isVirtual = () => !S.track.length && !!virtual(grid());

  function events(g) {
    g = g || grid();
    return expand(S.progressions, current(g), g);
  }
  function end(g) { return events(g).end || 0; }
  function at(tick, g) { return events(g).find(e => e.at <= tick && tick < e.end) || null; }
  function hasChords() { return events().some(e => e.strikes.length && e.id && SW.chords.isKnown(e.id)); }

  /* ================= WRITERS ================= */
  /* The lane's chords become the track's the first time it changes. */
  function materialize(g) {
    if (S.track.length) return;
    const v = virtual(g || grid());
    if (!v) return;
    S.track = [tidyStretch(v)];
    document.querySelectorAll('#score .syllable[data-chord]').forEach(s => { delete s.dataset.chord; });
  }
  /* Every change ends here: one Undo step, saved as edits are. The model
     goes back through normalize, so nothing out of shape is ever kept. */
  function commit(why) {
    syncHomes(grid());
    const picked = (SW.timing.song().pickup || 0) > 0;          // bar 0 exists only with a first-line pick-up
    const norm = normalizeInto({ progressions: S.progressions, track: S.track }, { meter: S.meter, lines: picked ? [{ pickup: true }] : [] });
    S.progressions = norm.progressions || [];
    S.track = norm.track || [];
    SW.score.changed('track');
    SW.bus.emit('track:changed', { why: why || 'edit' });
  }
  const byIdNow = () => { const m = {}; S.progressions.forEach(p => { m[p.id] = p; }); return m; };
  function nextId() {
    let n = 1;
    const used = new Set(S.progressions.map(p => p.id));
    while (used.has('p' + n)) n++;
    return 'p' + n;
  }
  /* "Verse" → "Verse 2"; "Verse 2" → "Verse 3" (the next free number) */
  function freeName(name) {
    const names = new Set(S.progressions.map(p => p.name));
    const m = /^(.*\S) (\d+)$/.exec(name);
    const base = m ? m[1] : name;
    let n = m ? Number(m[2]) + 1 : 2;
    while (names.has(base + ' ' + n)) n++;
    return (base + ' ' + n).slice(0, NAME_MAX);
  }
  const findProg = id => S.progressions.find(p => p.id === id) || null;

  function addProg(spec) {
    materialize();
    const p = Object.assign({ chords: [] }, clone(spec || {}));
    p.id = nextId();
    if (!p.name) { let n = S.progressions.length + 1; while (S.progressions.some(q => q.name === 'Progression ' + n)) n++; p.name = 'Progression ' + n; }
    S.progressions.push(p);
    commit('add');
    return p.id;
  }
  function setProg(id, patch) {
    const p = findProg(id);
    if (!p) return;
    materialize();
    Object.keys(patch || {}).forEach(k => {
      if (k === 'id') return;
      if (patch[k] === null || patch[k] === undefined) delete p[k]; else p[k] = clone(patch[k]);
    });
    commit('prog');
  }
  function removeProg(id) {
    if (!findProg(id)) return;
    materialize();
    S.progressions = S.progressions.filter(p => p.id !== id);
    S.track = S.track.filter(r => r.prog !== id);
    commit('remove');
  }
  function duplicateProg(id) {
    const p = findProg(id);
    if (!p) return null;
    materialize();
    const copy = clone(p);
    copy.id = nextId();
    copy.name = freeName(p.name);
    S.progressions.splice(S.progressions.indexOf(p) + 1, 0, copy);
    commit('duplicate');
    return copy.id;
  }
  function moveProg(id, index) {
    const p = findProg(id);
    if (!p) return;
    const list = S.progressions.filter(q => q !== p);
    list.splice(Math.max(0, Math.min(index, list.length)), 0, p);
    S.progressions = list;
    commit('order');
  }
  function setStep(id, i, patch) {
    const p = findProg(id);
    if (!p || !p.chords[i]) return;
    Object.keys(patch || {}).forEach(k => {
      if (patch[k] === null && k !== 'chord') delete p.chords[i][k];
      else if (patch[k] === undefined) delete p.chords[i][k];
      else p.chords[i][k] = clone(patch[k]);
    });
    commit('step');
  }
  function insertStep(id, i, step) {
    const p = findProg(id);
    if (!p) return;
    p.chords.splice(Math.max(0, Math.min(i, p.chords.length)), 0, clone(step));
    commit('step');
  }
  function removeStep(id, i) {
    const p = findProg(id);
    if (!p || !p.chords[i]) return;
    p.chords.splice(i, 1);
    commit('step');
  }
  function moveStep(id, i, j) {
    const p = findProg(id);
    if (!p || !p.chords[i]) return;
    const [st] = p.chords.splice(i, 1);
    p.chords.splice(Math.max(0, Math.min(j, p.chords.length)), 0, st);
    commit('step');
  }

  /* put a stretch in, taking its bars from whatever had them — a stretch
     "to the end of the melody" only the bars up to the next stretch */
  function put(st, g) {
    const mt = meterOf();
    const last = st.to === 'melody' ? reach(st, S.track, g.lastBar) : st.to;
    S.track = cutList(S.track, st.from, last, mt, byIdNow(), g.lastBar, true);
    S.track.push(st);
    S.track.sort((a, b) => a.from - b.from);
  }
  /* Put a progression in: bars from..to (to: a bar, or 'melody'). Without
     `to`: to the end of the melody, or once through when the melody ends
     before `from` — but never into the next stretch already in the song:
     dropped into a gap, it fills the gap. */
  function place(progId, from, to) {
    const p = findProg(progId);
    if (!p) return;
    const g = grid();
    materialize(g);
    if (to === undefined || to === null) {
      if (g.lastBar >= from) to = 'melody';
      else to = from + Math.max(1, Math.ceil(cycleBeats(p, g.mt) / g.mt.beats)) - 1;
      const next = S.track.reduce((n, r) => (r.from > from ? Math.min(n, r.from) : n), Infinity);
      if (next - 1 < lastOf({ from, to }, g.lastBar)) to = next - 1;
    }
    put({ prog: progId, from, to }, g);
    commit('place');
  }
  function setStretch(index, patch) {
    const g = grid();
    materialize(g);
    const r = S.track[index];
    if (!r) return;
    const st = clone(r);
    S.track.splice(index, 1);
    if (patch.from !== undefined && patch.from !== st.from) shiftStart(st, patch.from - st.from, g.mt, byIdNow());
    if (patch.to !== undefined && patch.to !== st.to) { st.to = patch.to; delete st.home; }   // a home's bars are its progression's length: other bars make it an ordinary stretch
    if (patch.phase !== undefined) { if (patch.phase) st.phase = patch.phase; else delete st.phase; }
    if (patch.here === null) delete st.here;                      // every change just here, cleared
    if (st.to !== 'melody' && st.to < st.from) st.to = st.from;
    put(st, g);
    commit('stretch');
  }
  /* bars from..to with no chords: whatever had them is cut around them */
  function clearBars(from, to) {
    const g = grid();
    materialize(g);
    S.track = cutList(S.track, from, to, g.mt, byIdNow(), g.lastBar);
    commit('clear');
  }
  /* drag the middle: the whole stretch, its changes just here with it */
  function moveStretch(index, bars) {
    const g = grid();
    materialize(g);
    const r = S.track[index];
    if (!r || !bars) return;
    const st = clone(r);
    // "to the end of the melody" but stopped by the next stretch: it moves as the bars it plays
    if (st.to === 'melody' && reach(r, S.track, g.lastBar) < lastOf(r, g.lastBar)) st.to = reach(r, S.track, g.lastBar);
    S.track.splice(index, 1);
    st.from = Math.max(g.p0 > 0 ? 0 : 1, st.from + bars);
    if (st.to !== 'melody') st.to = Math.max(st.from, st.to + bars);
    if (st.here) st.here.forEach(h => { h.bar += bars; });
    put(st, g);
    commit('move');
  }
  /* drag the start: the chords stay over their bars */
  function trimStart(index, bar) {
    setStretch(index, { from: bar });
  }
  function removeStretch(index) {
    materialize();
    if (!S.track[index]) return;
    S.track.splice(index, 1);
    commit('remove');
  }
  function clear() {
    materialize();
    if (!S.track.length) return;
    S.track = [];
    commit('clear');
  }

  /* ---- changes just here ---- */
  /* The span a change just here covers when the chord at `tick` is
     double-clicked: a change already there (all its chords), or the one
     chord. { stretch, bar, beat, beats, chords, entry? } — null on an
     empty bar (then { empty: true, bar }). */
  function hereAt(tick) {
    const g = grid();
    const list = current(g);
    const evs = expand(S.progressions, list, g);
    const ev = evs.find(e => e.at <= tick && tick < e.end);
    if (!ev) return { empty: true, bar: g.barAt(tick) };
    const r = list[ev.stretch];
    if (ev.here) {
      const h = r.here[ev.hereIndex];
      return { stretch: ev.stretch, bar: h.bar, beat: h.beat, beats: h.beats, chords: clone(h.chords), entry: ev.hereIndex, event: ev };
    }
    const bar = g.barAt(ev.at);
    return {
      stretch: ev.stretch, bar, beat: 1 + (ev.at - g.T(bar)) / g.b, beats: (ev.end - ev.at) / g.b,
      chords: [{ chord: ev.id, beats: (ev.end - ev.at) / g.b }], event: ev
    };
  }
  /* Set (or with null, take away) the change just here starting at
     bar/beat for `beats` in stretch `si`. Inside a loose stretch the
     chords themselves are replaced; in an empty bar a loose stretch is
     made. */
  function setHereSpan(si, bar, beat, beats, chords) {
    const g = grid();
    materialize(g);
    const mt = g.mt;
    const r = S.track[si];
    const h0 = g.T(bar) + toTicks(beat - 1, g.b), h1 = h0 + toTicks(beats, g.b);
    if (!r) {
      if (!chords) return;
      const st = { from: bar, to: bar + Math.max(0, Math.ceil(beats / mt.beats) - 1), chords: clone(chords) };
      put(st, g);
      commit('here');
      return;
    }
    if (r.prog) {
      const overlaps = h => {
        const a = g.T(h.bar) + toTicks(h.beat - 1, g.b), b = a + toTicks(h.beats, g.b);
        return a < h1 && b > h0;
      };
      r.here = (r.here || []).filter(h => !overlaps(h));
      if (chords) r.here.push({ bar, beat, beats, chords: clone(chords) });
      r.here.sort((a, b) => a.bar - b.bar || a.beat - b.beat);
      if (!r.here.length) delete r.here;
    } else {
      // loose: lay the chords out in ticks, cut [h0, h1) out, put these in
      const a = Math.max(0, g.T(r.from));
      const laid = [];
      let s = a;
      (r.chords || []).forEach(st => { const len = toTicks(st.beats || mt.beats, g.b); laid.push({ s, e: s + len, st }); s += len; });
      const out = [];
      const piece = (st, from, to, offset) => {
        const o = Object.assign({}, st, { beats: Math.round((to - from) / g.b * 1e4) / 1e4 });
        if (st.rhythm && st.rhythm !== HELD) o.rhythm = rhythmOf(fit(cells(st.rhythm).slice(offset / CELL), (to - from) / CELL));
        return o;
      };
      let put2 = false;
      const insert = () => { if (put2) return; put2 = true; (chords || [{ chord: null, beats }]).forEach(c => out.push(clone(c))); };
      if (h0 < a) insert();
      laid.forEach(L => {
        if (L.e <= h0) { out.push(L.st); return; }
        if (L.s >= h1) { insert(); out.push(L.st); return; }
        if (L.s < h0) out.push(piece(L.st, L.s, h0, 0));
        insert();
        if (L.e > h1) out.push(piece(L.st, h1, L.e, h1 - L.s));
      });
      if (h0 >= s) {
        if (h0 > s) out.push({ chord: null, beats: Math.round((h0 - s) / g.b * 1e4) / 1e4 });
        insert();
      }
      r.chords = out;
      const endBar = g.barAt(Math.max(s, h1) - 1);
      if (r.to !== 'melody' && endBar > r.to) r.to = endBar;
    }
    commit('here');
  }
  /* the chord at `tick` becomes `chords` just here (null: back to what the
     progression plays there) */
  function setHere(tick, chords) {
    const h = hereAt(tick);
    if (h.empty) {
      if (!chords) return;
      const mt = meterOf();
      setHereSpan(-1, h.bar, 1, mt.beats, chords.map(c => Object.assign({ beats: mt.beats / chords.length }, c)));
      return;
    }
    if (!chords) {
      if (h.entry === undefined) return;               // nothing changed here
      setHereSpan(h.stretch, h.bar, h.beat, h.beats, null);
      return;
    }
    let list = chords.map(c => Object.assign({}, c));
    if (h.entry !== undefined && h.event.hereStep !== null && list.length === 1 && !list[0].beats) {
      // one chord of a split change: just that one
      const all = h.chords;
      const was = all[h.event.hereStep];
      all[h.event.hereStep] = Object.assign({}, list[0], { beats: was.beats });
      list = all;
    } else if (list.length === 1 && !list[0].beats) list[0].beats = h.beats;
    setHereSpan(h.stretch, h.bar, h.beat, h.beats, list);
  }
  /* "Change it in Verse too": a one-chord change just here that covers one
     whole chord of the progression becomes that chord, every time through */
  function writeBack(tick) {
    const h = hereAt(tick);
    if (h.empty || h.entry === undefined || h.chords.length !== 1) return false;
    const g = grid();
    const r = S.track[h.stretch];
    if (!r || !r.prog) return false;
    const p = findProg(r.prog);
    const bare = clone(r);
    delete bare.here;
    const h0 = g.T(h.bar) + toTicks(h.beat - 1, g.b), h1 = h0 + toTicks(h.beats, g.b);
    const under = expand(S.progressions, [bare], g).find(e => e.at === h0 && e.end === h1);
    if (!under || under.step === null) return false;
    const ch = h.chords[0];
    const st = p.chords[under.step];
    st.chord = ch.chord;
    if (ch.place) st.place = ch.place; else delete st.place;
    if (ch.rhythm) st.rhythm = ch.rhythm;
    r.here.splice(h.entry, 1);
    if (!r.here.length) delete r.here;
    commit('writeback');
    return true;
  }

  /* ================= THE CHORDS ON THE MUSIC (2026-10-27) =================
     The user's overhaul: a chord goes on ANY beat (it lasts to the next
     chord or the bar line, whichever is first), is dragged to another
     beat, stretched over bar lines, taken out. Every gesture works on the
     chords as they sound — FLAT: [{ at, end, chord, place?, rhythm? }] in
     ticks, silence left out; `rhythm` is the chord's own over exactly its
     span ('held' or cells), none when it plays its stretch's — and only
     what sounds different afterwards is written back, where it belongs:
       • a HOME (made on the music): the progression itself changes —
         wherever else it is placed, too;
       • a progression placed from the window: a change just here (D7);
       • an old song's loose chords: a progression of their own first;
       • bars no stretch holds: the home written on that line just before
         them (or just after, nothing between) grows over them; else a new
         progression is made there, named after the line's section.
     A home's progression with no chord left goes (when placed nowhere
     else). One gesture, one Undo step. */

  /* a hold after silence is silence; the first cell cannot hold on from nothing */
  function tidyCells(c) {
    let out = '';
    for (let i = 0; i < c.length; i++) {
      const ch = c[i];
      out += ch === 'O' && (i === 0 || out[i - 1] === 'R') ? (i === 0 ? 'X' : 'R') : ch;
    }
    return out;
  }
  function flatOf(evs) {
    return evs.filter(e => e.id).map(e => {
      const o = { at: e.at, end: e.end, chord: e.id };
      if (e.place) o.place = e.place;
      if (e.rhythm) o.rhythm = e.rhythm;
      return o;
    });
  }
  function flat(g) { return flatOf(events(g || grid())); }
  /* a piece cut down to [x, y) inside it: its own rhythm goes with it */
  function trimPiece(pc, x, y) {
    const o = Object.assign({}, pc, { at: x, end: y });
    if (pc.rhythm && pc.rhythm !== HELD) o.rhythm = tidyCells(fit(pc.rhythm.slice((x - pc.at) / CELL, (y - pc.at) / CELL), (y - x) / CELL));
    return o;
  }
  /* the chords with [x, y) taken out of them */
  function cutFlat(list, x, y) {
    const out = [];
    list.forEach(pc => {
      if (pc.end <= x || pc.at >= y) { out.push(pc); return; }
      if (pc.at < x) out.push(trimPiece(pc, pc.at, x));
      if (pc.end > y) out.push(trimPiece(pc, y, pc.end));
    });
    return out;
  }
  const clipFlat = (list, x, y) => list.filter(pc => pc.end > x && pc.at < y).map(pc => (pc.at < x || pc.end > y ? trimPiece(pc, Math.max(x, pc.at), Math.min(y, pc.end)) : pc));
  function layFlat(list, pc) {
    const out = cutFlat(list, pc.at, pc.end);
    out.push(pc);
    return out.sort((a, b) => a.at - b.at);
  }
  /* where two flat lists sound different: [[x, y], …] */
  function diffFlat(A, B) {
    const edges = new Set();
    A.concat(B).forEach(pc => { edges.add(pc.at); edges.add(pc.end); });
    const pts = Array.from(edges).sort((a, b) => a - b);
    const find = (L, t) => L.find(pc => pc.at <= t && t < pc.end) || null;
    const say = (pc, s, e) => !pc ? '' : [pc.chord, pc.place || '', pc.at === s ? 1 : 0,
      pc.rhythm === HELD ? HELD : pc.rhythm ? pc.rhythm.slice((s - pc.at) / CELL, (e - pc.at) / CELL) : ''].join('|');
    const out = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      const s = pts[i], e = pts[i + 1];
      if (say(find(A, s), s, e) === say(find(B, s), s, e)) continue;
      const last = out[out.length - 1];
      if (last && last[1] === s) last[1] = e; else out.push([s, e]);
    }
    return out;
  }
  /* a chord's own rhythm over a new span: what it played stays where it
     was; new time repeats it a bar at a time (or its own length, if shorter) */
  function refit(pc, a2, e2, g) {
    if (!pc.rhythm || pc.rhythm === HELD) return pc.rhythm || null;
    const c = pc.rhythm, n = c.length;
    const P = n * CELL >= g.B ? g.B / CELL : n;
    let out = '';
    for (let t = a2; t < e2; t += CELL) {
      let k = (t - pc.at) / CELL;
      while (k >= n) k -= P;
      while (k < 0) k += P;
      out += c[k];
    }
    return tidyCells(fit(out, (e2 - a2) / CELL));
  }

  /* the line a bar starts in (past the melody: the last line's) */
  function groupOf(bar, g) {
    const lines = g.song.lines;
    const t = Math.max(0, g.T(bar));
    const i = lines.findIndex(le => t >= le.at && t < le.at + le.padded);
    return i >= 0 ? i : lines.length - 1;
  }
  /* a new progression's name: the line's section, or After the melody */
  function nameFor(bar, g) {
    let base = '';
    if (bar > g.lastBar && g.lastBar > 0) base = 'After the melody';
    else {
      const le = g.song.lines[groupOf(bar, g)];
      const input = le && le.line && le.line.querySelector('.line-label');
      base = input && input.value.trim() ? input.value.trim().slice(0, NAME_MAX) : '';
    }
    if (!base) { let n = S.progressions.length + 1; while (S.progressions.some(q => q.name === 'Progression ' + n)) n++; return 'Progression ' + n; }
    return S.progressions.some(q => q.name === base) ? freeName(base) : base;
  }
  /* the ticks each stretch holds: its bars, up to the next stretch */
  function holdings(g) {
    const list = S.track;
    return list.map((r, i) => {
      const a = Math.max(0, g.T(r.from));
      if (r.to === 'melody' && g.lastBar < r.from) return { r, a, z: a };      // waiting for the melody
      let z = g.T(reach(r, list, g.lastBar) + 1);
      list.forEach((o, k) => { if (k !== i) { const s = Math.max(0, g.T(o.from)); if (s > a) z = Math.min(z, s); } });
      return { r, a, z: Math.max(a, z) };
    });
  }
  /* the longest a step (or a change just here) may be: whole bars, within MAX_BEATS */
  const longest = g => Math.max(g.B, Math.floor(MAX_BEATS * g.b / g.B) * g.B);
  /* steps from the chords over [a, z): silence between them is a step of no
     chord; `fill`: silence after the last too (a change just here fills its
     span). A step longer than the longest is several (MAX_BEATS: a chord
     at bar 3 and one at bar 32 of a line once lost the silence between
     them — it was read back as one bar, 2026-10-27). */
  function stepsOf(list, a, z, g, fill) {
    const beats = d => Math.round(d / g.b * 1e4) / 1e4;
    const most = longest(g);
    const steps = [];
    const silence = (x, y) => { for (let t = x; t < y; t += most) steps.push({ chord: null, beats: beats(Math.min(most, y - t)) }); };
    let t = a;
    clipFlat(list, a, z).forEach(pc => {
      if (pc.at > t) silence(t, pc.at);
      for (let s = pc.at; s < pc.end; s += most) {
        const e = Math.min(pc.end, s + most);
        const p2 = s === pc.at && e === pc.end ? pc : trimPiece(pc, s, e);
        const st = { chord: p2.chord, beats: beats(e - s) };
        if (p2.place) st.place = p2.place;
        if (p2.rhythm) st.rhythm = p2.rhythm === HELD ? HELD : rhythmOf(p2.rhythm);
        steps.push(st);
      }
      t = pc.end;
    });
    if (fill && t < z) silence(t, z);
    return steps;
  }
  /* an old song's loose chords, touched: a progression of their own, at home there */
  function adopt(r, g) {
    const id = nextId();
    S.progressions.push({ id, name: nameFor(r.from, g), rhythm: HELD, chords: clone(r.chords || []) });
    delete r.chords;
    r.prog = id;
    r.home = true;
  }
  /* bars b1..b2 (one line, held by no stretch) with chords: the home on the
     line just before them grows over them (or the one just after), with
     nothing between; else a new progression is made there */
  function homeFor(b1, b2, g) {
    const grp = groupOf(b1, g);
    const free = (x, y) => !S.track.some(o => o.from >= x && o.from <= y);
    let best = null;
    S.track.forEach(r => {
      if (r.home && r.to < b1 && groupOf(r.to, g) === grp && free(r.to + 1, b1 - 1) && (!best || r.to > best.to)) best = r;
    });
    if (best) { best.to = b2; return best; }
    S.track.forEach(r => {
      if (r.home && r.from > b2 && groupOf(r.from, g) === grp && free(b2 + 1, r.from - 1) && (!best || r.from < best.from)) best = r;
    });
    if (best) { best.from = b1; return best; }
    const id = nextId();
    S.progressions.push({ id, name: nameFor(b1, g), rhythm: HELD, chords: [] });
    const r = { prog: id, from: b1, to: b2, home: true };
    S.track.push(r);
    S.track.sort((x, y) => x.from - y.from);
    return r;
  }
  /* a home: its progression becomes what sounds over its bars */
  function rebuildHome(r, next, g) {
    const p = findProg(r.prog);
    if (!p) return;
    const each = p.beats || g.mt.beats;
    p.chords = stepsOf(next, Math.max(0, g.T(r.from)), g.T(r.to + 1), g, false).map(st => {
      if (st.beats === each) delete st.beats;                    // "each chord lasts" still says it
      return st;
    });
    delete r.here;
    delete r.phase;
  }
  /* a progression placed from the window: the change just here, over [s, e)
     widened to the changes already made there that it overlaps or meets
     (a chord stretched on from one stays one chord); none when the
     progression plays it anyway */
  function writeHereFlat(r, s, e, next, g) {
    const span = h => { const x = g.T(h.bar) + toTicks(h.beat - 1, g.b); return [x, x + toTicks(h.beats, g.b)]; };
    for (let grew = true; grew;) {
      grew = false;
      (r.here || []).forEach(h => {
        const [x, y] = span(h);
        if (x <= e && y >= s && (x < s || y > e)) { s = Math.min(s, x); e = Math.max(e, y); grew = true; }
      });
    }
    const keep = (r.here || []).filter(h => { const [x, y] = span(h); return !(x < e && y > s); });
    const bare = clone(r);
    delete bare.here;
    const under = clipFlat(flatOf(expand(S.progressions, [bare], g)), s, e);
    if (diffFlat(under, clipFlat(next, s, e)).length) {
      // a change longer than the longest step is several, end to end
      for (let x = s, most = longest(g); x < e; x += most) {
        const y = Math.min(e, x + most);
        const bar = g.barAt(x);
        keep.push({ bar, beat: 1 + Math.round((x - g.T(bar)) / g.b * 1e4) / 1e4, beats: Math.round((y - x) / g.b * 1e4) / 1e4, chords: stepsOf(next, x, y, g, true) });
      }
    }
    keep.sort((x, y) => x.bar - y.bar || x.beat - y.beat);
    if (keep.length) r.here = keep; else delete r.here;
  }
  /* a home's bars follow its progression's length (commit) */
  function syncHomes(g) {
    S.track.forEach(r => {
      if (!r.home) return;
      const p = findProg(r.prog);
      const C = p ? toTicks(cycleBeats(p, g.mt), g.b) : 0;
      if (C) r.to = Math.max(r.from, g.barAt(Math.max(0, g.T(r.from)) + C - 1));
    });
  }
  /* the chords as they should sound → the track (applyFlat: written, not yet committed) */
  function writeFlat(next, why) {
    if (!applyFlat(next)) return false;
    commit(why || 'chords');
    return true;
  }
  function applyFlat(next) {
    const g = grid();
    materialize(g);
    const ranges = diffFlat(flat(g), next);
    if (!ranges.length) return false;
    const touches = h => ranges.some(([x, y]) => x < h.z && y > h.a);
    holdings(g).forEach(h => { if (!h.r.prog && touches(h)) adopt(h.r, g); });
    const held = holdings(g).sort((p, q) => p.a - q.a);
    const homes = new Set();
    const open = [];
    ranges.forEach(([x, y]) => {
      let t = x;
      held.forEach(h => {
        const s = Math.max(x, h.a), e = Math.min(y, h.z);
        if (e <= s) return;
        if (s > t) open.push([t, s]);
        t = Math.max(t, e);
        if (h.r.home) homes.add(h.r);
        else writeHereFlat(h.r, s, e, next, g);
      });
      if (t < y) open.push([t, y]);
    });
    // chords in bars no stretch holds: a line at a time, the bars that have chords
    open.forEach(([s, e]) => {
      for (let b = g.barAt(s), bEnd = g.barAt(e - 1); b <= bEnd;) {
        const grp = groupOf(b, g);
        let b2 = b;
        while (b2 < bEnd && groupOf(b2 + 1, g) === grp) b2++;
        const there = clipFlat(next, Math.max(s, g.T(b)), Math.min(e, g.T(b2 + 1)));
        if (there.length) homes.add(homeFor(g.barAt(there[0].at), g.barAt(there[there.length - 1].end - 1), g));
        b = b2 + 1;
      }
    });
    homes.forEach(r => rebuildHome(r, next, g));
    // a home with no chord left goes — and its progression, if it is placed nowhere else
    const gone = new Set();
    S.track = S.track.filter(r => {
      if (!r.home) return true;
      const p = findProg(r.prog);
      if (p && p.chords.some(st => st.chord)) return true;
      gone.add(r.prog);
      return false;
    });
    S.progressions = S.progressions.filter(p => !gone.has(p.id) || S.track.some(r => r.prog === p.id));
    return true;
  }

  /* the chord sounding at a tick, as it sounds (a flat piece) */
  function chordAt(tick, g) { return flat(g).find(pc => pc.at <= tick && tick < pc.end) || null; }
  /* PUT a chord on a beat: on a chord's first beat it takes that chord's
     place (its length and rhythm kept); anywhere else it starts there and
     lasts to the next chord or the bar line, whichever comes first. No
     chord (null): the time there is silent. Returns the piece laid.
     putSpan(tick): where it would go — { at, end, on (the chord it replaces) } */
  function putSpan(tick, g, list) {
    g = g || grid();
    list = list || flat(g);
    const e = list.find(pc => pc.at <= tick && tick < pc.end);
    if (e && e.at === tick) return { at: e.at, end: e.end, on: e };
    let end = g.T(g.barAt(tick) + 1);
    if (e) end = Math.min(end, e.end);
    const nx = list.find(x => x.at > tick);
    if (nx) end = Math.min(end, nx.at);
    return { at: tick, end, on: null };
  }
  function putChord(tick, step) {
    const g = grid();
    const list = flat(g);
    const sp = putSpan(tick, g, list);
    let pc;
    if (sp.on) {
      pc = Object.assign({}, sp.on, { chord: step.chord });
      if (step.place) pc.place = step.place; else delete pc.place;
    } else {
      pc = { at: sp.at, end: sp.end, chord: step.chord };
      if (step.place) pc.place = step.place;
    }
    if (step.rhythm !== undefined) { if (step.rhythm) pc.rhythm = step.rhythm; else delete pc.rhythm; }
    writeFlat(step.chord ? layFlat(list, pc) : cutFlat(list, pc.at, pc.end), 'put');
    return step.chord ? pc : null;
  }
  /* DRAG a chord to start at `to` (its length kept); `copy` leaves it where it was too */
  function moveChord(at, to, copy) {
    const list = flat();
    const e = list.find(pc => pc.at === at);
    to = Math.max(0, to);
    if (!e || to === at) return null;
    const pc = Object.assign({}, e, { at: to, end: to + (e.end - e.at) });
    writeFlat(layFlat(copy ? list : cutFlat(list, e.at, e.end), pc), copy ? 'copy' : 'move');
    return pc;
  }
  /* STRETCH a chord to [a2, e2): over bar lines, over the chords beside it
     (they give way); shorter leaves silence */
  function resizeChord(at, a2, e2) {
    const g = grid();
    const list = flat(g);
    const e = list.find(pc => pc.at === at);
    a2 = Math.max(0, a2);
    if (!e || e2 <= a2 || (a2 === e.at && e2 === e.end)) return null;
    const pc = Object.assign({}, e, { at: a2, end: e2 });
    const r = refit(e, a2, e2, g);
    if (r) pc.rhythm = r; else delete pc.rhythm;
    writeFlat(layFlat(cutFlat(list, e.at, e.end), pc), 'resize');
    return pc;
  }
  function removeChord(at) {
    const list = flat();
    const e = list.find(pc => pc.at === at);
    return e ? writeFlat(cutFlat(list, e.at, e.end), 'remove') : false;
  }
  /* change a chord where it is: { chord, place, rhythm } — rhythm 'held',
     cells over its span, or null (back to its progression's) */
  function setChord(at, patch) {
    const list = flat();
    const e = list.find(pc => pc.at === at);
    if (!e) return null;
    if ('chord' in patch && !patch.chord) { removeChord(at); return null; }
    const pc = Object.assign({}, e);
    ['chord', 'place', 'rhythm'].forEach(k => {
      if (!(k in patch)) return;
      if (patch[k]) pc[k] = patch[k]; else delete pc[k];
    });
    writeFlat(layFlat(list, pc), 'set');
    return pc;
  }
  /* "Every chord of Verse plays this": the progression's rhythm becomes
     `rhythm` (a rhythm string, or 'held'), and the chord at `at` plays it
     again rather than its own — one step */
  function rhythmToAll(at, id, rhythm) {
    const p = findProg(id);
    if (!p) return;
    const list = flat();
    const e = list.find(pc => pc.at === at);
    if (rhythm === HELD || cells(rhythm)) { p.rhythm = rhythm; delete p.bars; } else delete p.rhythm;
    if (e && e.rhythm) {
      const pc = Object.assign({}, e);
      delete pc.rhythm;
      if (writeFlat(layFlat(list, pc), 'rhythm')) return;
    }
    commit('prog');
  }
  /* the stretch a progression was made in on the music (null: none) */
  const homeOf = id => S.track.find(r => r.home && r.prog === id) || null;

  /* ================= THE TIME LINE (2026-10-28) =================
     The Chords window's Time Line (progression-window.js). A progression
     in the song is a GROUP — its stretch — full of separate chords:
       • a group moves whole, a bar at a time (its corner);
       • chords moved inside their own row of chords (chords end to end)
         are a reorder: A B C D, B dropped between C and D → A C B D; the
         row keeps its bars;
       • anywhere else moved chords leave silence where they were and go
         in at the drop point; a paste goes in at the point. Between two
         chords, the chords on the side with room (silence past their row
         of chords) move over to make it — the side whose room is nearer,
         the later one on a tie; with room on neither side the later ones
         push along until there is. The group it goes into makes room a
         chord at a time; any other group in the way moves whole (a group
         never gives its own silence to another's chords);
       • a group whose chords are pushed past its bars grows to keep them;
         one all of whose chords are pushed along whole bars moves with
         them; a group left with no chord goes;
       • a group moved, pasted or put in goes in at a bar line the same
         way, a group at a time: never inside another (its nearer end),
         the groups on the side with room moving over.
     What sounds is written by writeFlat's rules (a progression placed from
     the window changes just here; one made on the music changes itself),
     so a group still follows its progression wherever it was not changed.
     One gesture, one Undo step. */

  /* Room for [t, t + L) among items ({ at, end }, in order, none
     overlapping; t never inside one) → { at: where the block goes,
     shifts: how far each item moves } */
  function makeRoom(items, t, L, min) {
    const n = items.length;
    let li = -1;
    items.forEach((it, i) => { if (it.end <= t) li = i; });
    const ri = li + 1;
    const lf = li >= 0 ? items[li].end : min;
    const rf = ri < n ? items[ri].at : Infinity;
    const shifts = items.map(() => 0);
    if (rf - lf >= L) return { at: Math.max(lf, Math.min(t, rf - L)), shifts };
    // the run of items end to end from item i, going d (+1 later, -1 earlier): how far it reaches, and the silence past it
    const run = (i, d) => {
      let k = i;
      while (k + d >= 0 && k + d < n && (d > 0 ? items[k + 1].at === items[k].end : items[k - 1].end === items[k].at)) k += d;
      if (d > 0) return { far: items[k].end - items[i].at, room: k + 1 < n ? items[k + 1].at - items[k].end : Infinity };
      return { far: items[i].end - items[k].at, room: items[k].at - (k > 0 ? items[k - 1].end : min) };
    };
    const needR = t + L - rf;                   // the later ones move this far (the block at t)
    const needL = lf - (rf - L);                // or the earlier ones this far back (the block ending where the later ones start)
    const R = ri < n ? run(ri, 1) : null, Lr = li >= 0 ? run(li, -1) : null;
    const okR = !!R && R.room >= needR, okL = !!Lr && Lr.room >= needL;
    // the side whose room is nearer (the later one on a tie); with room on neither, the later ones push along
    if (okL && (!okR || Lr.far < R.far)) {
      let lim = rf - L;
      for (let k = li; k >= 0 && items[k].end > lim; k--) { shifts[k] = lim - items[k].end; lim = items[k].at + shifts[k]; }
      return { at: rf - L, shifts };
    }
    let need = t + L;
    for (let k = ri; k < n && items[k].at < need; k++) { shifts[k] = need - items[k].at; need = items[k].end + shifts[k]; }
    return { at: t, shifts };
  }
  /* the chords as the Time Line shows them: flat pieces, each with its group (`si`: its stretch) */
  function tlPieces(g) {
    return events(g).filter(e => e.id).map(e => {
      const o = { at: e.at, end: e.end, chord: e.id, si: e.stretch };
      if (e.place) o.place = e.place;
      if (e.rhythm) o.rhythm = e.rhythm;
      return o;
    });
  }
  function bare(pc) {
    const o = { at: pc.at, end: pc.end, chord: pc.chord };
    if (pc.place) o.place = pc.place;
    if (pc.rhythm) o.rhythm = pc.rhythm;
    return o;
  }
  /* a stretch moved k bars, its changes just here with it ('melody' → the bars it plays, `last`) */
  function shiftBars(r, k, last) {
    if (r.to === 'melody') r.to = last;
    r.from += k;
    r.to += k;
    if (r.here) r.here.forEach(h => { h.bar += k; });
  }
  /* the chords starting at `ats`, as a block to put in somewhere — their places
     one to another kept: { len, chords: [{ at, end, chord, place?, rhythm? }] from 0 } */
  function tlBlock(ats) {
    const set = new Set(ats);
    const list = flat().filter(pc => set.has(pc.at));
    if (!list.length) return null;
    const a = list[0].at;
    return { len: list[list.length - 1].end - a, chords: list.map(pc => Object.assign(bare(pc), { at: pc.at - a, end: pc.end - a })) };
  }
  /* PUT IN a block at tick t — `moving`: the starts of the chords it is,
     which leave where they were (a move); none: a paste (or a copy).
     Returns the starts of the chords put in. */
  function tlPut(block, t, moving) {
    if (!block || !block.chords.length) return [];
    const g = grid();
    materialize(g);
    const all = tlPieces(g);
    const mov = new Set((moving || []).filter(at => all.some(pc => pc.at === at)));
    t = Math.max(0, t);
    // a reorder: chords end to end in one group, moved inside their own row
    if (mov.size) {
      const runs = [];
      all.forEach(pc => { const r = runs[runs.length - 1]; if (r && r[r.length - 1].end === pc.at && r[r.length - 1].si === pc.si) r.push(pc); else runs.push([pc]); });
      const run = runs.find(r => r.some(pc => mov.has(pc.at)));
      const inRun = run.filter(pc => mov.has(pc.at));
      const k0 = run.indexOf(inRun[0]);
      if (inRun.length === mov.size && run.slice(k0, k0 + inRun.length).every(pc => mov.has(pc.at)) &&
          t >= run[0].at && t <= run[run.length - 1].end) {
        const rest = run.filter(pc => !mov.has(pc.at));
        const k = rest.filter(pc => pc.end <= t).length;
        const order = rest.slice(0, k).concat(inRun, rest.slice(k));
        let s = run[0].at;
        const laid = order.map(pc => { const o = Object.assign(bare(pc), { at: s, end: s + pc.end - pc.at }); s = o.end; return o; });
        if (applyFlat(all.filter(pc => run.indexOf(pc) === -1).map(bare).concat(laid).sort((a, b) => a.at - b.at))) commit('order');
        return laid.filter((o, i) => mov.has(order[i].at)).map(o => o.at);
      }
    }
    const rest = all.filter(pc => !mov.has(pc.at));
    const inside = rest.find(pc => pc.at < t && t < pc.end);
    if (inside) t = t - inside.at <= inside.end - t ? inside.at : inside.end;
    // the group it joins: the chord it follows, or the one it comes before, or the group whose bars hold it
    const before = rest.find(pc => pc.end === t), after = rest.find(pc => pc.at === t);
    const held = holdings(g);
    const hold = held.findIndex(h => h.a <= t && t < h.z);
    const into = before ? before.si : after ? after.si : hold >= 0 ? hold : null;
    // what makes room: the chords of the group it goes into, one by one — every other group whole
    const items = rest.filter(pc => pc.si === into).map(pc => ({ at: pc.at, end: pc.end, pc }));
    held.forEach((h, i) => { if (i !== into && h.z > h.a) items.push({ at: h.a, end: h.z, si: i }); });
    items.sort((a, b) => a.at - b.at);
    const rm = makeRoom(items, t, block.len, 0);
    const dxOf = pc => { const k = items.findIndex(it => (it.pc ? it.pc === pc : it.si === pc.si)); return k >= 0 ? rm.shifts[k] : 0; };
    const moved = rest.map(pc => { const dx = dxOf(pc); return Object.assign({}, pc, { at: pc.at + dx, end: pc.end + dx, dx }); });
    const put = block.chords.map(c => Object.assign(bare(c), { at: rm.at + c.at, end: rm.at + c.end, si: into }));
    // the groups follow their chords
    const lasts = S.track.map(r => reach(r, S.track, g.lastBar));
    const gone = new Set();
    S.track.forEach((r, i) => {
      const mine = moved.filter(pc => pc.si === i);
      const now = mine.concat(put.filter(pc => pc.si === i));
      if (!now.length) { if (!r.home && all.some(pc => pc.si === i)) gone.add(r); return; }
      const d = mine.length === now.length && mine.every(pc => pc.dx === mine[0].dx) ? mine[0].dx : 0;
      if (d && d % g.B === 0) { shiftBars(r, d / g.B, lasts[i]); return; }
      const b1 = g.barAt(Math.min.apply(null, now.map(pc => pc.at)));
      const b2 = g.barAt(Math.max.apply(null, now.map(pc => pc.end)) - 1);
      if (b2 > lasts[i]) r.to = b2;
      if (b1 < r.from) { if (r.home) r.from = b1; else shiftStart(r, b1 - r.from, g.mt, byIdNow()); }
    });
    // never overlapping: a group grown into the next one takes those bars
    S.track = S.track.filter(r => !gone.has(r)).sort((x, y) => x.from - y.from);
    for (let i = 1; i < S.track.length; i++) {
      const p = S.track[i - 1], r = S.track[i];
      if (p.to === 'melody' || r.from > p.to) continue;
      const k = p.to + 1 - r.from;
      if (r.home) r.from += k; else shiftStart(r, k, g.mt, byIdNow());
      if (r.to !== 'melody' && r.to < r.from) r.to = r.from;
    }
    applyFlat(moved.map(bare).concat(put.map(bare)).sort((a, b) => a.at - b.at));
    commit(mov.size ? 'move' : 'paste');
    return put.map(pc => pc.at);
  }
  /* TAKE OUT the chords starting at `ats`: silence where they were; a group left with none goes */
  function tlRemove(ats) {
    const g = grid();
    materialize(g);
    const set = new Set(ats);
    const all = tlPieces(g);
    if (!all.some(pc => set.has(pc.at))) return false;
    const left = all.filter(pc => !set.has(pc.at));
    const gone = new Set(S.track.filter((r, i) => !r.home && all.some(pc => pc.si === i) && !left.some(pc => pc.si === i)));
    S.track = S.track.filter(r => !gone.has(r));
    applyFlat(left.map(bare));
    commit('remove');
    return true;
  }
  /* a group as it plays (its bars, not "to the end of the melody"), to paste as a placement of its progression */
  function tlGroupCopy(index) {
    const g = grid();
    const list = current(g);
    const r = list[index];
    if (!r) return null;
    const o = clone(r);
    o.to = reach(r, list, g.lastBar);
    delete o.home;
    return o;
  }
  /* A GROUP to bar `bar`: the stretch `index` moved there — or, index -1,
     `st` put in (a pasted group, a progression put in). Returns its bar. */
  function tlGroupTo(index, bar, st) {
    const g = grid();
    materialize(g);
    const minBar = g.p0 > 0 ? 0 : 1;
    const lasts = S.track.map(r => reach(r, S.track, g.lastBar));
    const r0 = index >= 0 ? S.track[index] : st;
    if (!r0) return null;
    const len = (index >= 0 ? lasts[index] : (r0.to === 'melody' ? r0.from : r0.to)) - r0.from + 1;
    const others = S.track.filter((r, i) => i !== index);
    const olasts = lasts.filter((x, i) => i !== index);
    const items = others.map((r, i) => ({ at: r.from, end: olasts[i] + 1 }));
    bar = Math.max(minBar, Math.round(bar));
    const inside = items.find(it => it.at < bar && bar < it.end);
    if (inside) bar = bar - inside.at <= inside.end - bar ? inside.at : inside.end;
    const rm = makeRoom(items, bar, len, minBar);
    if (index >= 0 && rm.at === r0.from && rm.shifts.every(x => !x)) return r0.from;
    others.forEach((r, i) => { if (rm.shifts[i]) shiftBars(r, rm.shifts[i], olasts[i]); });
    const moved = clone(r0);
    moved.to = moved.from + len - 1;                        // the bars it plays, wherever it goes
    shiftBars(moved, rm.at - moved.from);
    S.track = others.concat([moved]).sort((x, y) => x.from - y.from);
    commit(index >= 0 ? 'move' : 'place');
    return moved.from;
  }
  /* a progression put in at a bar: once through, a group of its own */
  function tlPlace(progId, bar) {
    const p = findProg(progId);
    if (!p || !p.chords.length) return null;
    const mt = meterOf();
    return tlGroupTo(-1, bar, { prog: progId, from: bar, to: bar + Math.max(1, Math.ceil(cycleBeats(p, mt) / mt.beats)) - 1 });
  }

  /* ================= WHEN THE SONG CHANGES (DESIGN §10) =================
     Called by score.js before it records the change, so the chords move in
     the same Undo step as the scale or the time signature. Nothing here
     commits. */

  /* CHORDS FOLLOW THE SCALE (D16): a chord picked from the panel
     remembers its key (`place`); with Layout settings → Melody follows the
     scale on, it becomes that key's chord in the new scale — I IV V vi in
     major, i iv v VI in natural minor. Chords from More chords… (no place)
     stay as they are. */
  function followScale() {
    const re = st => {
      if (!st || !st.place) return;
      const e = SW.chords.entry(st.place);
      const id = e ? SW.chords.toId(e.spec) : null;
      if (id) st.chord = id;
    };
    S.progressions.forEach(p => p.chords.forEach(re));
    S.track.forEach(r => {
      (r.here || []).forEach(h => h.chords.forEach(re));
      (r.chords || []).forEach(re);
    });
  }

  /* A NEW TIME SIGNATURE: lengths stay in beats ("each chord: one bar"
     stays one bar); a rhythm goes over beat by beat — between simple and
     compound time each beat to its twin (♩ ↔ ♩., ♫ ↔ ♪♪♪, ♬ ↔ ♩♪, anything
     else stretched to fit); and a bar's rhythm loses its last beats (4/4 →
     3/4) or gains copies of its last beat (3/4 → 4/4). */
  const TWIN = { XOOO: 'XOOOOO', XOXO: 'XOXOXO', XXXX: 'XOOOXO', OOOO: 'OOOOOO', RRRR: 'RRRRRR' };
  const TWIN_BACK = {};
  Object.keys(TWIN).forEach(k => { TWIN_BACK[TWIN[k]] = k; });
  /* n cells from a run of cells, each strike kept where it falls */
  function rescale(c, n) {
    const m = c.length;
    if (!m) return 'R'.repeat(n);
    let out = '';
    for (let j = 0; j < n; j++) {
      const i = Math.min(m - 1, Math.floor(j * m / n));
      const first = j === 0 || Math.min(m - 1, Math.floor((j - 1) * m / n)) !== i;
      out += c[i] === 'X' ? (first ? 'X' : 'O') : c[i];
    }
    return out;
  }
  function followMeter(fromId, toId) {
    const A = meterOf(fromId), B = meterOf(toId);
    if (A.id === B.id) return;
    const pa = A.beatTicks / CELL, pb = B.beatTicks / CELL;
    const beat = chunk => {
      if (pa === pb) return chunk;
      if (chunk.length !== pa) return rescale(chunk, Math.max(1, Math.round(chunk.length * pb / pa)));
      const t = pa === 4 ? TWIN[chunk] : TWIN_BACK[chunk];
      return t || rescale(chunk, pb);
    };
    // a chord's own rhythm: as many beats as before, each beat in the new meter
    const own = str => {
      if (str === HELD) return str;
      const c = cells(str);
      if (!c) return str;
      let out = '';
      for (let i = 0; i < c.length; i += pa) out += beat(c.slice(i, i + pa));
      if (out[0] === 'O') out = 'X' + out.slice(1);
      return rhythmOf(out);
    };
    // a progression's bar rhythm: each bar to the new bar's beats
    const barRhythm = (str, bars) => {
      const c = fit(cells(str) || '', A.barTicks * bars / CELL);
      let out = '';
      for (let b = 0; b < bars; b++) {
        const beats = [];
        for (let k = 0; k < A.beats; k++) beats.push(beat(c.slice((b * A.beats + k) * pa, (b * A.beats + k + 1) * pa)));
        while (beats.length > B.beats) beats.pop();
        while (beats.length < B.beats) beats.push(beats[beats.length - 1]);
        out += beats.join('');
      }
      if (out[0] === 'O') out = 'X' + out.slice(1);
      return rhythmOf(out);
    };
    const step = st => { if (st && st.rhythm) st.rhythm = own(st.rhythm); };
    /* chords that fill whole bars (a bar changed just here, a bar of loose
       chords) stay whole bars: their lengths shared out over the new bar.
       Returns the new length, or null to leave them as they are. */
    const wholeBars = (chords, total) => {
      const bars = total / A.beats;
      if (!chords.length || !(bars >= 1) || Math.abs(bars - Math.round(bars)) > 1e-6 || A.beats === B.beats) return null;
      const n = Math.round(bars) * B.beats * pb;          // cells in as many new bars
      const want = chords.map((c, i) => i === chords.length - 1 ? 0 : Math.max(1, Math.round((c.beats || 0) / total * n)));
      const last = n - want.reduce((t, x) => t + x, 0);
      if (last < 1) return null;
      want[want.length - 1] = last;
      chords.forEach((c, i) => { c.beats = Math.round(want[i] / pb * 1e4) / 1e4; });
      return Math.round(bars) * B.beats;
    };
    S.track.forEach(r => {
      (r.here || []).forEach(h => {
        if (h.beat !== 1) return;
        const nb = wholeBars(h.chords, h.beats);
        if (nb) h.beats = nb;
      });
      if (r.chords) wholeBars(r.chords, r.chords.reduce((t, c) => t + (c.beats || 0), 0));
    });
    S.progressions.forEach(p => {
      if (p.rhythm && p.rhythm !== HELD) p.rhythm = barRhythm(p.rhythm, p.bars || 1);
      p.chords.forEach(step);
    });
    S.track.forEach(r => {
      (r.here || []).forEach(h => h.chords.forEach(step));
      (r.chords || []).forEach(step);
    });
    // back through normalize in the new meter (a "just here" on beat 4 has no place in 3/4)
    const picked = (SW.timing.song().pickup || 0) > 0;
    const norm = normalizeInto({ progressions: S.progressions, track: S.track }, { meter: B.id, lines: picked ? [{ pickup: true }] : [] });
    S.progressions = norm.progressions || [];
    S.track = norm.track || [];
  }

  /* ================= SELF TEST ================= */
  /* Pure checks on a made-up grid (nothing on the page is touched):
     SW.track.selfTest() → { ok, failures } */
  function selfTest() {
    const failures = [];
    const eq = (name, got, want) => {
      const a = JSON.stringify(got), b = JSON.stringify(want);
      if (a !== b) failures.push(name + ': got ' + a + ', want ' + b);
    };
    const fake = (meterId, total, p0) => {
      const mt = SW.meters.byId(meterId);
      const P = p0 || 0;
      return { mt, B: mt.barTicks, b: mt.beatTicks, p0: P, total, lastBar: total > P ? Math.floor((total - 1 - P) / mt.barTicks) + 1 : 0,
        T: bar => P + (bar - 1) * mt.barTicks, barAt: t => Math.floor((t - P) / mt.barTicks) + 1 };
    };
    const strikes = evs => evs.map(e => e.id + ':' + e.strikes.map(s => (s.at - e.at) / 6 + '+' + s.len / 6).join(','));
    // rhythm strings
    eq('cells', cells('q q e e q'), 'XOOOXOOOXOXOXOOO');
    eq('round trip', rhythmOf(cells('q q e e q')), 'q q e e q');
    eq('rests and ties', cells('q~ h_e s'), 'RRRRXOOOOOOOOOX');
    eq('spelled', rhythmOf('XOOOOOOOOOOOXOOO'), 'h. q');
    eq('tied', rhythmOf('XOOOOOOOOORR'), 'h_e e~');
    eq('fit', fit('OXO', 5), 'XXORR');
    eq('default 4/4', defaultRhythm(SW.meters.byId('4/4')), 'q q q q');
    eq('default 6/8', defaultRhythm(SW.meters.byId('6/8')), 'q. q.');
    const g4 = fake('4/4', 96 * 3);
    const verse = { id: 'p1', name: 'Verse', rhythm: 'q q e e q', chords: [{ chord: 'I' }, { chord: 'IV' }, { chord: 'V' }, { chord: 'vi', rhythm: 'h h' }] };
    // I IV V vi, a bar each, ta ta ti-ti ta, vi its own ta-a ta-a
    let ev = expand([verse], [{ prog: 'p1', from: 1, to: 4 }], g4);
    eq('verse ids', ev.map(e => e.id), ['I', 'IV', 'V', 'vi']);
    eq('verse strikes', strikes(ev).slice(2), ['V:0+4,4+4,8+2,10+2,12+4', 'vi:0+8,8+8']);
    eq('verse end', ev.end, 96 * 4);
    // two-beat chords on a bar rhythm: I plays ta ta, V plays ti-ti ta
    const two = { id: 'p2', name: 'Two', beats: 2, rhythm: 'q q e e q', chords: [{ chord: 'I' }, { chord: 'V' }] };
    ev = expand([two], [{ prog: 'p2', from: 1, to: 1 }], g4);
    eq('bar rhythm over 2-beat chords', strikes(ev), ['I:0+4,4+4', 'V:0+2,2+2,4+4']);
    // per-chord rhythm (the alternative, D6) would give V ta ta — not this
    // a 3-beat chord in 4/4: struck where it starts, even inside a ringing strike
    const three = { id: 'p3', name: 'Three', beats: 3, rhythm: 'h h', chords: [{ chord: 'I' }, { chord: 'IV' }] };
    ev = expand([three], [{ prog: 'p3', from: 1, to: 2 }], g4);
    eq('3-beat chords', strikes(ev), ['I:0+8,8+4', 'IV:0+4,4+8', 'I:0+8']);
    // starting on chord 3 (phase 8 beats)
    ev = expand([verse], [{ prog: 'p1', from: 1, to: 2, phase: 8 }], g4);
    eq('phase', ev.map(e => e.id), ['V', 'vi']);
    // to the end of the melody (3 bars of melody → 3 bars)
    ev = expand([verse], [{ prog: 'p1', from: 1, to: 'melody' }], g4);
    eq('to melody', [ev.length, ev.end], [3, 96 * 3]);
    // a stretch after the melody, waiting when to:melody is before it
    eq('waiting', expand([verse], [{ prog: 'p1', from: 5, to: 'melody' }], g4).length, 0);
    // a change just here: bar 4 is IV V instead of vi, V with its own q q
    ev = expand([verse], [{ prog: 'p1', from: 1, to: 4, here: [{ bar: 4, beat: 1, beats: 4, chords: [{ chord: 'IV', beats: 2 }, { chord: 'V', beats: 2, rhythm: 'q q' }] }] }], g4);
    eq('here ids', ev.map(e => e.id + (e.here ? '*' : '')), ['I', 'IV', 'V', 'IV*', 'V*']);
    eq('here strikes', strikes(ev).slice(3), ['IV:0+4,4+4', 'V:0+4,4+4']);
    // a just-here change in the middle of a long chord: before and after it the chord sounds again
    const long = { id: 'p4', name: 'Long', beats: 8, chords: [{ chord: 'I' }] };
    ev = expand([long], [{ prog: 'p4', from: 1, to: 2, here: [{ bar: 1, beat: 3, beats: 4, chords: [{ chord: 'V', beats: 4 }] }] }], g4);
    eq('cut long chord', ev.map(e => e.id + '@' + e.at / 24), ['I@0', 'V@2', 'I@6']);
    eq('cut long strikes', strikes(ev), ['I:0+4,4+4', 'V:0+4,4+4,8+4,12+4', 'I:0+4,4+4']);
    // 6/8: a dotted-quarter beat, default ta-i ta-i
    const g68 = fake('6/8', 72 * 2);
    ev = expand([{ id: 'p1', name: 'C', chords: [{ chord: 'I' }, { chord: 'V' }] }], [{ prog: 'p1', from: 1, to: 2 }], g68);
    eq('6/8', strikes(ev), ['I:0+6,6+6', 'V:0+6,6+6']);
    // 3/4 with a quarter pick-up: bar 1 starts after it
    const g34 = fake('3/4', 24 + 72 * 2, 24);
    ev = expand([{ id: 'p1', name: 'W', chords: [{ chord: 'I' }, { chord: 'V' }] }], [{ prog: 'p1', from: 1, to: 2 }], g34);
    eq('pick-up', ev.map(e => e.at), [24, 96]);
    // loose chords: held
    ev = expand([], [{ from: 2, to: 2, chords: [{ chord: 'ii', beats: 1.5 }, { chord: 'V', beats: 2.5 }] }], g4);
    eq('loose', strikes(ev), ['ii:0+6', 'V:0+10']);
    // held (2026-10-27): one strike a chord, however long; a home plays its progression once
    ev = expand([{ id: 'p1', name: 'H', rhythm: 'held', chords: [{ chord: 'I', beats: 6 }, { chord: 'V', beats: 2 }] }], [{ prog: 'p1', from: 1, to: 3 }], g4);
    eq('held', strikes(ev), ['I:0+24', 'V:0+8', 'I:0+16']);
    ev = expand([{ id: 'p1', name: 'H', rhythm: 'held', chords: [{ chord: 'I', beats: 6 }] }], [{ prog: 'p1', from: 1, to: 2, home: true }], g4);
    eq('home once', ev.map(e => e.id + '@' + e.at / 24 + '-' + e.end / 24), ['I@0-6']);
    ev = expand([verse], [{ prog: 'p1', from: 1, to: 1, here: [{ bar: 1, beat: 2, beats: 3, chords: [{ chord: 'V', beats: 3, rhythm: 'held' }] }] }], g4);
    eq('own held', strikes(ev), ['I:0+4', 'V:0+12']);
    eq('own held is said', ev[1].rhythm, 'held');
    // the chords on the music: what sounds different, a chord's own rhythm stretched
    eq('diff', diffFlat([{ at: 0, end: 96, chord: 'I' }], [{ at: 0, end: 24, chord: 'I' }, { at: 24, end: 96, chord: 'V' }]), [[24, 96]]);
    eq('diff strike', diffFlat([{ at: 0, end: 96, chord: 'I' }], [{ at: 0, end: 48, chord: 'I' }, { at: 48, end: 96, chord: 'I' }]), [[48, 96]]);
    eq('refit', refit({ at: 0, end: 96, chord: 'I', rhythm: 'XOOOXOOOXOXOXOOO' }, 0, 192, g4), 'XOOOXOOOXOXOXOOOXOOOXOOOXOXOXOOO');
    eq('refit later start', refit({ at: 24, end: 96, chord: 'I', rhythm: 'XOOOXOXOXOOO' }, 24, 120, g4), 'XOOOXOXOXOOOXOOO');
    eq('tidy cells', tidyCells('ORRO'), 'XRRR');
    eq('long silence', stepsOf([{ at: 0, end: 24, chord: 'I' }, { at: 1920, end: 1944, chord: 'V' }], 0, 1944, g4, false).map(st => (st.chord || '-') + st.beats), ['I1', '-64', '-15', 'V1']);
    // the next stretch takes over a "to the end of the melody" one
    ev = expand([verse, two], [{ prog: 'p1', from: 1, to: 'melody' }, { prog: 'p2', from: 3, to: 3 }], g4);
    eq('takes over', ev.map(e => e.id), ['I', 'IV', 'I', 'V']);
    // cutting: Verse 1–8, Chorus over 3–4 → Verse 1–2, Chorus, Verse 5–8 carrying on (phase 4 bars = 16 beats → 0)
    const mt4 = SW.meters.byId('4/4');
    let list = cutList([{ prog: 'p1', from: 1, to: 8 }], 3, 4, mt4, { p1: verse }, 0);
    eq('cut', list, [{ prog: 'p1', from: 1, to: 2 }, { prog: 'p1', from: 5, to: 8 }]);
    list = cutList([{ prog: 'p1', from: 1, to: 8 }], 3, 3, mt4, { p1: verse }, 0);
    eq('cut phase', list[1], { prog: 'p1', from: 4, to: 8, phase: 12 });
    ev = expand([verse], list, g4);
    eq('cut keeps chords on their bars', ev.map(e => e.id + '@' + e.at / 96), ['I@0', 'IV@1', 'vi@3', 'I@4', 'IV@5', 'V@6', 'vi@7']);
    // "to the end of the melody" with stretches after it holds only its own bars (2026-10-12: it used to be cut as if it ran to bar 56)
    const later = [{ prog: 'p1', from: 1, to: 'melody' }, { prog: 'p2', from: 9, to: 16 }, { prog: 'p1', from: 17, to: 24 }];
    eq('reach', later.map(r => reach(r, later, 56)), [8, 16, 24]);
    eq('cut inside it', cutList(later, 5, 6, mt4, { p1: verse, p2: two }, 56),
      [{ prog: 'p1', from: 1, to: 4 }, { prog: 'p1', from: 7, to: 'melody', phase: 8 }, { prog: 'p2', from: 9, to: 16 }, { prog: 'p1', from: 17, to: 24 }]);
    eq('the ones after it stay', cutList(later, 9, 16, mt4, { p1: verse, p2: two }, 56), [{ prog: 'p1', from: 1, to: 'melody' }, { prog: 'p1', from: 17, to: 24 }]);
    // a stretch laid on one "to the end of the melody" ends it there (taking bars out, above, leaves the rest)
    eq('laid inside it', cutList(later, 5, 6, mt4, { p1: verse, p2: two }, 56, true),
      [{ prog: 'p1', from: 1, to: 4 }, { prog: 'p2', from: 9, to: 16 }, { prog: 'p1', from: 17, to: 24 }]);
    const toEnd = [{ prog: 'p1', from: 9, to: 'melody' }];
    eq('laid on its start', cutList(toEnd, 9, 16, mt4, { p1: verse }, 56, true), []);
    eq('grown into from before', cutList(toEnd, 1, 12, mt4, { p1: verse }, 56, true), [{ prog: 'p1', from: 13, to: 'melody' }]);
    // the Time Line's room: the later chords move into the silence after them; with none, the earlier into the silence before; with neither, the later push along
    const its = list2 => list2.map(([a, e]) => ({ at: a, end: e }));
    eq('room later', makeRoom(its([[0, 4], [4, 8], [8, 12], [12, 16], [20, 24]]), 8, 4, 0), { at: 8, shifts: [0, 0, 4, 4, 0] });
    eq('room earlier', makeRoom(its([[8, 12], [12, 16], [16, 20], [20, 24], [24, 28], [30, 34]]), 16, 4, 0), { at: 12, shifts: [-4, -4, 0, 0, 0, 0] });
    eq('room pushed', makeRoom(its([[0, 4], [4, 8], [8, 12], [14, 18]]), 4, 4, 0), { at: 4, shifts: [0, 4, 4, 2] });
    eq('room free', makeRoom(its([[0, 4], [12, 16]]), 6, 4, 0), { at: 6, shifts: [0, 0] });
    eq('room in a gap too small', makeRoom(its([[0, 4], [6, 10]]), 4, 4, 0), { at: 4, shifts: [0, 2] });
    eq('room nearer earlier', makeRoom(its([[4, 8], [8, 12], [12, 16], [16, 20], [20, 24]]), 8, 4, 0), { at: 4, shifts: [-4, 0, 0, 0, 0] });
    // a new time signature: ta ta ti-ti ta in 4/4 → 12/8 → 4/4 comes back; 4/4 → 3/4 drops the last beat
    const keep = { p: S.progressions, t: S.track };
    S.progressions = [{ id: 'p1', name: 'V', rhythm: 'q q e e q', chords: [{ chord: 'I', rhythm: 'h h' }] }];
    S.track = [];
    followMeter('4/4', '12/8');
    eq('to 12/8', [S.progressions[0].rhythm, S.progressions[0].chords[0].rhythm], ['q. q. e e e q.', 'h. h.']);
    followMeter('12/8', '4/4');
    eq('and back', [S.progressions[0].rhythm, S.progressions[0].chords[0].rhythm], ['q q e e q', 'h h']);
    followMeter('4/4', '3/4');
    eq('4/4 → 3/4', S.progressions[0].rhythm, 'q q e e');
    followMeter('3/4', '4/4');
    eq('3/4 → 4/4', S.progressions[0].rhythm, 'q q e e e e');
    S.track = [{ prog: 'p1', from: 1, to: 4, here: [{ bar: 2, beat: 1, beats: 4, chords: [{ chord: 'IV', beats: 2 }, { chord: 'V', beats: 2 }] }, { bar: 3, beat: 1, beats: 4, chords: [{ chord: null, beats: 4 }] }] }];
    followMeter('4/4', '3/4');
    eq('a bar just here stays a bar', JSON.stringify(S.track[0].here.map(h => [h.bar, h.beats, h.chords.map(c => c.beats)])), '[[2,3,[1.5,1.5]],[3,3,[3]]]');
    followMeter('3/4', '4/4');
    eq('and back', JSON.stringify(S.track[0].here.map(h => [h.bar, h.beats, h.chords.map(c => c.beats)])), '[[2,4,[2,2]],[3,4,[4]]]');
    S.progressions = keep.p;
    S.track = keep.t;
    return { ok: !failures.length, failures };
  }

  SW.track = {
    CELL,
    // the model
    model, load, normalizeInto,
    progressions: () => S.progressions, prog: findProg, stretches: () => S.track, isVirtual,
    // time
    grid, events, end, at, hasChords, expand,
    // rhythm
    cells, rhythmOf, fit, beatCells, defaultRhythm, defaultCells,
    // writers
    addProg, setProg, removeProg, duplicateProg, moveProg,
    setStep, insertStep, removeStep, moveStep,
    place, setStretch, moveStretch, trimStart, removeStretch, clear, clearBars,
    // for the Time Line (the Chords window)
    shown: g => current(g || grid()),                               // the stretches on show (an old song's lane, read as one)
    lastOf: (r, g) => { g = g || grid(); return reach(r, current(g), g.lastBar); },   // the last bar a stretch plays ('melody' resolved, up to the next stretch)
    cycleBeats: p => cycleBeats(p, meterOf()),
    // when the song changes (score.js calls these before it records the change)
    followScale, followMeter,
    hereAt, setHere, setHereSpan, writeBack,
    // the chords on the music, a beat at a time (2026-10-27)
    HELD, flat, chordAt, putSpan: tick => putSpan(tick), putChord, moveChord, resizeChord, removeChord, setChord, rhythmToAll, homeOf, tidyCells,
    // the Time Line: groups of chords (2026-10-28)
    tlBlock, tlPut, tlRemove, tlGroupTo, tlGroupCopy, tlPlace, makeRoom,
    selfTest
  };
})();

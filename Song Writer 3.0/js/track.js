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

   THE CHORD CHART (2026-10-28, ../Song Writer Chords Redesign/ §4.1) —
   the song's chords, chosen for it:
     chart: [ { id: 'k1', chord: 'IV', place: 's', voice: [[-4,-7],[3,5],[5,9],[7,12]], name: 'IV open' } ]
   `voice` the chord's own notes (chords.js VOICES; none: the engine
   voices it). Any chord on the track may say which card it came from
   (`k`) and carry a copy of its voice (`voice`): it SOUNDS with its
   card's voice while the card is there (one change to the card, every
   spot follows), with its own copy once the card has gone. A song with a
   chart is in the NEW SHAPE: its chords are loose chords only (the
   progressions retire, the design's Y1) — useChart() takes an old song
   there, every strike where it was; the chords on the music then write
   loose chords (applyLoose), never progressions.

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
     on the music      flat() · chordAt(tick) · putChord(tick, step) · moveChord(at, to, copy) ·
                       resizeChord(at, from, end) · removeChord(at) · setChord(at, patch) — an old song
                       goes over to the chart at its first change (progressions retired, 2026-10-29: their
                       writers, the old Time Line's group writers and Just here went with the old window)
     the chart         chart() · chartEntry(k) · isChartShape() · chartFrom(g?) (what useChart would make) ·
                       useChart() · chartAdd(spec, index?) · chartSet(k, patch) · chartMove(k, index) ·
                       chartRemove(k, keepSpots)
     the Time Line     draftPieces(g?) · draftEvents(list, g?) · soundSig(evs, g?, voices) · applyDraft(list) · flatOps
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
  if (!Array.isArray(S.chart)) S.chart = [];
  const CHART_MAX = 99;

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
    if (chord !== null && typeof s.k === 'string' && K_RE.test(s.k)) st.k = s.k;           // the chart card it came from
    const voice = chord !== null && SW.chords ? SW.chords.cleanVoice(s.voice) : null;      // a copy of its notes
    if (voice) st.voice = voice;
    const beats = cleanBeats(s.beats, mt);
    if (beats) st.beats = beats;
    const len = beats || defBeats;
    if (s.rhythm !== undefined && len) {
      const r = cleanRhythm(s.rhythm, toTicks(len, mt.beatTicks) / CELL);
      if (r) st.rhythm = r;
    }
    return st;
  }
  /* the chart: cards with ids k1, k2 … (unique, never reused), each a chord (never "no chord") */
  const K_RE = /^k\d+$/;
  function cleanChart(raw) {
    const out = [], used = new Set();
    (Array.isArray(raw) ? raw : []).forEach(e => {
      if (!e || typeof e !== 'object' || out.length >= CHART_MAX) return;
      const chord = cleanChord(e.chord);
      if (chord === null || chord === undefined) return;
      const o = { id: typeof e.id === 'string' && K_RE.test(e.id) && !used.has(e.id) ? e.id : null, chord };
      if (typeof e.place === 'string' && SW.chords && SW.chords.PLACES.indexOf(e.place) !== -1) o.place = e.place;
      const voice = SW.chords ? SW.chords.cleanVoice(e.voice) : null;
      if (voice) o.voice = voice;
      if (typeof e.name === 'string' && e.name.trim()) o.name = e.name.trim().slice(0, NAME_MAX);
      if (e.hidden === true) o.hidden = true;
      if (o.id) used.add(o.id);
      out.push(o);
    });
    let n = 1;
    out.forEach(o => { if (o.id) return; while (used.has('k' + n)) n++; o.id = 'k' + n; used.add(o.id); });
    // the key order a card is written in
    return out.map(o => { const t = { id: o.id, chord: o.chord }; if (o.place) t.place = o.place; if (o.voice) t.voice = o.voice; if (o.name) t.name = o.name; if (o.hidden) t.hidden = true; return t; });
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
    const chart = cleanChart(raw.chart);
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
    // a chord says which card it came from only while that card is on the chart (its copy of the voice stays)
    const cards = new Set(chart.map(e => e.id));
    const unlink = st => { if (st.k && !cards.has(st.k)) delete st.k; };
    tidyProgs.forEach(p => p.chords.forEach(unlink));
    clean.forEach(r => { (r.here || []).forEach(h => h.chords.forEach(unlink)); (r.chords || []).forEach(unlink); });
    if (chart.length) out.chart = chart;
    if (tidyProgs.length) out.progressions = tidyProgs;
    if (clean.length) out.track = clean.map(tidyStretch);
    return out;
  }

  function model() {
    const out = {};
    if (S.chart.length) out.chart = clone(S.chart);
    if (S.progressions.length) out.progressions = clone(S.progressions);
    if (S.track.length) out.track = clone(S.track);
    return out;
  }
  function load(score) {
    S.chart = clone((score && score.chart) || []);
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
     on a grid → events. `chart` (optional): the cards a chord's `k` finds
     its voice on. */
  function expand(progs, track, g, chart) {
    const byId = {};
    progs.forEach(p => { byId[p.id] = p; });
    const cards = {};
    (chart || []).forEach(e => { cards[e.id] = e; });
    // what a chord sounds with: its card's voice while the card is there (none: the engine's), else its own copy
    const voiceOf = pc => (pc.k && cards[pc.k] ? cards[pc.k].voice || null : pc.sv || null);
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
            pieces.push({ at: Math.max(s, a), end: Math.min(e, z), from: s, id: st.chord, step: i, pass: n, own: ownCells(st, lens[i]), rhythm: st.rhythm, place: st.place, k: st.k, sv: st.voice });
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
            if (e > at) kept.push({ at, end: e, from: s, id: ch.chord, step: null, pass: null, here: true, hereIndex: hi, hereStep: ci, own: ownCells(ch, len), rhythm: ch.rhythm, place: ch.place, k: ch.k, sv: ch.voice });
            s += len;
          });
          pieces = kept;
        });
      } else {
        let s = a;
        (r.chords || []).forEach((st, i) => {
          const len = toTicks(st.beats || mt.beats, g.b);
          const e = s + len;
          if (s < z && e > a) pieces.push({ at: Math.max(s, a), end: Math.min(e, z), from: s, id: st.chord, step: i, pass: 0, own: ownCells(st, len), rhythm: st.rhythm, place: st.place, k: st.k, sv: st.voice });
          s = e;
        });
      }
      pieces.sort((x, y) => x.at - y.at).forEach(pc => {
        out.push({
          at: pc.at, end: pc.end, id: pc.id,
          stretch: si, prog: r.prog || null, step: pc.step, pass: pc.pass, home: !!r.home,
          here: !!pc.here, hereIndex: pc.here ? pc.hereIndex : null, hereStep: pc.here ? pc.hereStep : null,
          place: pc.place || null, rhythm: ownSpan(pc),
          k: pc.id && pc.k ? pc.k : null, sv: pc.id && pc.sv ? pc.sv : null, voice: pc.id ? voiceOf(pc) : null,
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
    return expand(S.progressions, current(g), g, S.chart);
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
    S.chart = S.chart.filter(e => !e.hidden || usesOf(e.id));      // a card kept for its spots (chartRemove) goes with the last of them
    const picked = (SW.timing.song().pickup || 0) > 0;          // bar 0 exists only with a first-line pick-up
    const norm = normalizeInto({ chart: S.chart, progressions: S.progressions, track: S.track }, { meter: S.meter, lines: picked ? [{ pickup: true }] : [] });
    S.chart = norm.chart || [];
    S.progressions = norm.progressions || [];
    S.track = norm.track || [];
    SW.score.changed(why === 'chart' ? 'chart' : 'track');        // 'chart': the Chord Chart — the player keeps playing (replan)
    SW.bus.emit('track:changed', { why: why || 'edit' });
  }
  const byIdNow = () => { const m = {}; S.progressions.forEach(p => { m[p.id] = p; }); return m; };
  const findProg = id => S.progressions.find(p => p.id === id) || null;


  /* put a stretch in, taking its bars from whatever had them — a stretch
     "to the end of the melody" only the bars up to the next stretch */
  function put(st, g) {
    const mt = meterOf();
    const last = st.to === 'melody' ? reach(st, S.track, g.lastBar) : st.to;
    S.track = cutList(S.track, st.from, last, mt, byIdNow(), g.lastBar, true);
    S.track.push(st);
    S.track.sort((a, b) => a.from - b.from);
  }

  /* ---- changes just here ---- */

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
      if (e.k) o.k = e.k;
      if (e.sv) o.voice = e.sv;
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
    const say = (pc, s, e) => !pc ? '' : [pc.chord, pc.place || '', pc.k || '', pc.voice ? JSON.stringify(pc.voice) : '', pc.at === s ? 1 : 0,
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
        if (p2.k) st.k = p2.k;
        if (p2.voice) st.voice = p2.voice;
        if (p2.rhythm) st.rhythm = p2.rhythm === HELD ? HELD : rhythmOf(p2.rhythm);
        steps.push(st);
      }
      t = pc.end;
    });
    if (fill && t < z) silence(t, z);
    return steps;
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
    if (S.chart.length) return applyLoose(next);                 // the new shape: loose chords, never progressions
    // progressions retired (the Chords redesign, Y1, 2026-10-29): an old song goes over to the chart
    // the first time its chords change on the music — every strike where it was — and the change is
    // made there, in the same Undo step (the caller commits)
    if (!diffFlat(flat(grid()), next).length) return false;
    toChartShape();
    return applyLoose(next) || true;
  }

  /* ================= THE CHORD CHART (2026-10-28) =================
     The new shape: a chart, and loose chords only (the header's THE
     CHORD CHART). */
  const isChartShape = () => S.chart.length > 0;
  const chartEntry = k => S.chart.find(e => e.id === k) || null;
  const sameVoice = (a, b) => JSON.stringify(a || null) === JSON.stringify(b || null);
  function nextK(chart) {
    const used = new Set(chart.map(e => e.id));
    let n = 1;
    while (used.has('k' + n)) n++;
    return 'k' + n;
  }
  function eachChord(fn) {
    S.progressions.forEach(p => p.chords.forEach(fn));
    S.track.forEach(r => { (r.here || []).forEach(h => h.chords.forEach(fn)); (r.chords || []).forEach(fn); });
  }
  const usesOf = k => { let n = 0; eachChord(st => { if (st.k === k) n++; }); return n; };
  /* a sounding chord's rhythm as cells over exactly its span — every strike
     where it is (or 'held': one strike, ringing to its end) */
  function bake(e) {
    if (e.rhythm) return e.rhythm;
    const n = (e.end - e.at) / CELL;
    const c = new Array(n).fill('R');
    e.strikes.forEach(s => {
      const i = (s.at - e.at) / CELL;
      c[i] = 'X';
      for (let j = 1; j < s.len / CELL; j++) c[i + j] = 'O';
    });
    const str = c.join('');
    return str === 'X' + 'O'.repeat(n - 1) ? HELD : str;
  }
  /* flat pieces → the track: loose chords, one stretch from the first chord's bar to the last's */
  function looseTrack(list, g) {
    const pcs = list.filter(pc => pc.chord !== null && pc.end > pc.at).sort((a, b) => a.at - b.at);
    if (!pcs.length) return [];
    const from = Math.max(g.p0 > 0 ? 0 : 1, g.barAt(pcs[0].at));
    const to = Math.max(from, g.barAt(pcs[pcs.length - 1].end - 1));
    return [{ from, to, chords: stepsOf(pcs, Math.max(0, g.T(from)), g.T(to + 1), g, false) }];
  }
  /* What useChart would make of the song now (pure: nothing is written):
     its chart — the chords it uses, in the order they first sound, then
     the chords of its progressions that never sound (nothing disappears),
     ONE CARD A CHORD (two only when their notes differ) — and every chord
     as a loose one, its rhythm baked in. A card remembers the panel key
     its chord was picked from (the first that says), and every chord from
     it takes that key: a new scale changes them together (followScale). */
  function chartOf(progs, evs, chart0) {
    const chart = clone(chart0 || []);
    const card = (chord, place, voice) => {
      let e = chart.find(x => x.chord === chord && sameVoice(x.voice, voice));
      if (!e) {
        e = { id: nextK(chart), chord };
        if (voice) e.voice = clone(voice);
        chart.push(e);
      }
      if (place && !e.place) e.place = place;
      return e;
    };
    const pieces = evs.filter(e => e.id).map(e => {
      const pc = { at: e.at, end: e.end, chord: e.id };
      pc.k = card(e.id, e.place, e.voice).id;
      if (e.voice) pc.voice = clone(e.voice);
      const r = bake(e);
      if (r !== HELD) pc.rhythm = r;
      return pc;
    });
    progs.forEach(p => p.chords.forEach(st => { if (st.chord) card(st.chord, st.place, st.voice); }));
    const byK = {};
    chart.forEach(e => { byK[e.id] = e; });
    pieces.forEach(pc => { if (byK[pc.k].place) pc.place = byK[pc.k].place; });
    return { chart, pieces };
  }
  function chartFrom(g) { g = g || grid(); return chartOf(S.progressions, events(g), S.chart); }
  /* AN OLD SONG INTO THE NEW SHAPE: the chart, and every chord a loose one
     sounding exactly as before (its strikes baked into a rhythm of its
     own). A stretch "to the end of the melody" stops where the melody is
     now. One Undo step. */
  function toChartShape() {
    const g = grid();
    materialize(g);
    const { chart, pieces } = chartOf(S.progressions, events(g), []);
    S.chart = chart;
    S.track = looseTrack(pieces, g);
    S.progressions = [];
  }
  function useChart() {
    if (isChartShape()) return false;
    toChartShape();
    if (!S.chart.length) return false;
    commit('chart');
    return true;
  }
  /* the chords on the music in the new shape: the track becomes `next`; a
     chord new to the song takes its chord's card (one picked from the same
     panel key first) — its key and its notes — or a new card when there is
     none */
  function applyLoose(next) {
    const g = grid();
    materialize(g);
    if (!diffFlat(flat(g), next).length) return false;
    const pcs = next.map(pc => {
      const o = Object.assign({}, pc);
      if (!o.k || !chartEntry(o.k)) {
        const mine = S.chart.filter(x => !x.hidden && x.chord === o.chord);
        let e = mine.find(x => (x.place || '') === (o.place || '')) || mine[0];
        if (!e) {
          e = { id: nextK(S.chart), chord: o.chord };
          if (o.place) e.place = o.place;
          if (o.voice) e.voice = clone(o.voice);
          S.chart.push(e);
        }
        if (o.place && !e.place) e.place = o.place;              // its key, the first time it is picked from the panel
        o.k = e.id;
        if (e.voice) o.voice = clone(e.voice); else delete o.voice;
      }
      if (o.rhythm === HELD) delete o.rhythm;
      return o;
    });
    pcs.forEach(o => { const e = chartEntry(o.k); if (e && e.place) o.place = e.place; else delete o.place; });   // every chord from a card has its key
    S.track = looseTrack(pcs, g);
    return true;
  }
  /* the chart's writers — each one Undo step. A card added: { chord, place?, voice?, name? } → its id.
     Where (`index`): a number, or the id of the card it goes in before (an old song's
     chart is made first, its ids the ones chartFrom showed); none: at the end. `spot`
     (a tick): the chord sounding there comes from the new card — Focus's Save as New
     from a chord in the song (Y2: only that spot changes). */
  function chartIndex(index) {
    if (typeof index === 'string') { const i = S.chart.findIndex(x => x.id === index); return i < 0 ? S.chart.length : i; }
    return typeof index === 'number' ? Math.max(0, Math.min(index, S.chart.length)) : S.chart.length;
  }
  function chartAdd(spec, index, spot) {
    if (!spec || !spec.chord || S.chart.length >= CHART_MAX) return null;
    if (!isChartShape()) toChartShape();                       // the song's first card: it goes over to the new shape first
    const e = { id: nextK(S.chart), chord: spec.chord };
    if (spec.place) e.place = spec.place;
    if (spec.voice) e.voice = clone(spec.voice);
    if (spec.name) e.name = spec.name;
    S.chart.splice(chartIndex(index), 0, e);
    if (typeof spot === 'number') {
      const g = grid();
      S.track = looseTrack(flat(g).map(pc => {
        const o = Object.assign({}, pc);
        if (pc.at <= spot && spot < pc.end) {
          o.chord = e.chord;
          o.k = e.id;
          if (e.place) o.place = e.place; else delete o.place;
          if (e.voice) o.voice = clone(e.voice); else delete o.voice;
        }
        if (o.rhythm === HELD) delete o.rhythm;
        return o;
      }), g);
    }
    commit('chart');
    return e.id;
  }
  /* { voice } — a new voice reaches every chord that came from the card,
     their copies too (Y2: Save changes it everywhere, at once) · { name } */
  function chartSet(k, patch) {
    if (!isChartShape()) toChartShape();                       // an old song shows the chart it would make: the first change makes it
    const e = chartEntry(k);
    if (!e || !patch) return false;
    if ('voice' in patch) {
      const v = patch.voice ? SW.chords.cleanVoice(patch.voice) : null;
      if (v) e.voice = v; else delete e.voice;
      eachChord(st => { if (st.k === k) { if (v) st.voice = clone(v); else delete st.voice; } });
    }
    if ('name' in patch) { if (patch.name) e.name = String(patch.name); else delete e.name; }
    commit('chart');
    return true;
  }
  function chartMove(k, index) {
    if (!isChartShape()) toChartShape();
    const i = S.chart.findIndex(e => e.id === k);
    if (i < 0) return false;
    const [e] = S.chart.splice(i, 1);
    S.chart.splice(chartIndex(index), 0, e);
    commit('chart');
    return true;
  }
  /* off the chart (D5): keepSpots — the chords from it stay, sounding as
     they did (the card is kept out of sight until none is left); else they
     go too, leaving silence */
  function chartRemove(k, keepSpots) {
    if (!isChartShape()) toChartShape();
    const e = chartEntry(k);
    if (!e) return false;
    if (keepSpots && usesOf(k)) e.hidden = true;
    else {
      const g = grid();
      const next = flat(g).filter(pc => pc.k !== k);
      S.chart = S.chart.filter(x => x !== e);
      S.track = looseTrack(next.map(pc => { const o = Object.assign({}, pc); if (o.rhythm === HELD) delete o.rhythm; return o; }), g);
    }
    commit('chart');
    return true;
  }

  /* ================= THE TIME LINE'S DRAFT (2026-10-29, Phase 4) =================
     The Time Line works on a draft of the song's chords, not on the song
     (README D13): flat pieces { at, end, chord, k?, place?, voice?, rhythm? }
     — `rhythm` cells over exactly its span, none = struck once and held
     (D18). Every piece names its card (k): the chart's, or on an old song
     the card its chart would give it (chartFrom). Nothing here writes,
     except applyDraft. */
  function draftPieces(g) {
    g = g || grid();
    if (!isChartShape()) return chartFrom(g).pieces;
    return events(g).filter(e => e.id).map(e => {
      const pc = { at: e.at, end: e.end, chord: e.id };
      if (e.k) pc.k = e.k;
      if (e.place) pc.place = e.place;
      if (e.sv) pc.voice = clone(e.sv);
      const r = bake(e);
      if (r !== HELD) pc.rhythm = r;
      return pc;
    });
  }
  /* how a draft sounds: events, as the song's would be with those chords in it */
  function draftEvents(list, g) {
    g = g || grid();
    const cards = isChartShape() ? S.chart : chartFrom(g).chart;
    const pcs = (list || []).filter(pc => pc.chord && pc.end > pc.at).map(pc => Object.assign({}, pc)).sort((a, b) => a.at - b.at);
    return expand([], looseTrack(pcs, g), g, cards);
  }
  /* what a set of events sounds like, as a string — `voices`: with each chord's notes too */
  function soundSig(evs, g, voices) {
    g = g || grid();
    return g.mt.id + '|' + g.p0 + '|' + evs.filter(e => e.id).map(e => [e.at, e.end, e.id, voices && e.voice ? JSON.stringify(e.voice) : '',
      e.strikes.map(s => s.at + ':' + s.len).join(',')].join('/')).join(';');
  }
  /* APPLY: the song's chords become the draft's (D15: they keep their bars;
     the melody is untouched) — each with its card's notes and key as they
     are now. An old song goes over to the new shape. One Undo step. */
  function applyDraft(list) {
    const g = grid();
    const was = isChartShape();
    if (!was) toChartShape();
    const next = (list || []).filter(pc => pc.chord && pc.end > pc.at).map(pc => {
      const o = { at: pc.at, end: pc.end, chord: pc.chord };
      if (pc.k) o.k = pc.k;
      if (pc.place) o.place = pc.place;
      if (pc.voice) o.voice = clone(pc.voice);
      if (pc.rhythm && pc.rhythm !== HELD) o.rhythm = pc.rhythm;
      const e = o.k ? chartEntry(o.k) : null;
      if (e) {
        o.chord = e.chord;
        if (e.voice) o.voice = clone(e.voice); else delete o.voice;
        if (e.place) o.place = e.place; else delete o.place;
      }
      return o;
    }).sort((a, b) => a.at - b.at);
    const changed = applyLoose(next);
    if (!changed && was) return false;
    if (!S.chart.length && !S.track.length) return false;      // an old song with no chords, and none put in
    commit('track');
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
      if (!id || id === st.chord) return;
      if (st.voice) st.voice = SW.chords.refitVoice(st.voice, st.chord, id);   // its own notes keep their shape (IV's third → iv's third)
      st.chord = id;
    };
    S.chart.forEach(re);
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
    const norm = normalizeInto({ chart: S.chart, progressions: S.progressions, track: S.track }, { meter: B.id, lines: picked ? [{ pickup: true }] : [] });
    S.chart = norm.chart || [];
    S.progressions = norm.progressions || [];
    S.track = norm.track || [];
  }

  /* ================= SELF TEST ================= */
  /* Pure checks on a made-up grid (nothing on the page is touched):
     SW.track.selfTest() → { ok, failures, checks } */
  function selfTest() {
    const failures = [];
    let checks = 0;
    const eq = (name, got, want) => {
      checks++;
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
    // ---- THE CHORD CHART (2026-10-28) ----
    const CV = SW.chords.cleanVoice;
    eq('voice sorted', CV([[4, 7], [0, 0], [2, 4]]), [[0, 0], [2, 4], [4, 7]]);
    eq('voice: no pitch twice, a bad step respelled', CV([[0, 0], [7, 0], [9, 4], [4, 7]]), [[0, 0], [2, 4], [4, 7]]);
    eq('voice: one note is not a chord', CV([[0, 0]]), null);
    eq('voice: IV → iv keeps its shape', SW.chords.refitVoice([[-4, -7], [3, 5], [5, 9], [7, 12]], 'IV', 'iv'), [[-4, -7], [3, 5], [5, 8], [7, 12]]);
    eq('voice: an added note stays', SW.chords.refitVoice([[0, 0], [1, 2], [2, 4], [4, 7]], 'I', 'i'), [[0, 0], [1, 2], [2, 3], [4, 7]]);
    const vI = SW.chords.voiceOf('I');
    eq('the engine\'s voicing as a voice', SW.chords.voiceMidis(vI), SW.chords.midis('I').slice().sort((x, y) => x - y));
    eq('a voice wins', SW.chords.midis('I', { voice: [[0, 0], [4, 7], [9, 16]] }).map(m => m - SW.chords.voiceMidis([[0, 0], [1, 2]])[0]), [0, 7, 16]);
    // a chart, cleaned: ids made, a chord's card only while it is there, its copy kept
    let nm = normalizeInto({ chart: [{ chord: 'I' }, { id: 'k7', chord: 'IV', voice: [[3, 5], [5, 9], [7, 12]], hidden: true }, { chord: null }],
      track: [{ from: 1, to: 2, chords: [{ chord: 'I', k: 'k1' }, { chord: 'IV', k: 'k9', voice: [[3, 5], [5, 9]] }] }] }, { meter: '4/4', lines: [] });
    eq('chart cleaned', nm.chart, [{ id: 'k1', chord: 'I' }, { id: 'k7', chord: 'IV', voice: [[3, 5], [5, 9], [7, 12]], hidden: true }]);
    eq('a card that is not there', nm.track[0].chords[1], { chord: 'IV', voice: [[3, 5], [5, 9]] });
    // what a chord sounds with: its card's voice; the card gone, its own copy; no card, the engine's
    const vc = [[0, 0], [4, 7], [9, 16]], vo = [[0, 0], [2, 4]];
    ev = expand([], [{ from: 1, to: 1, chords: [{ chord: 'I', k: 'k1', voice: vo, beats: 1 }, { chord: 'V', k: 'k2', voice: vo, beats: 1 }, { chord: 'IV', beats: 1 }] }], g4, [{ id: 'k1', chord: 'I', voice: vc }]);
    eq('voices', ev.filter(e => e.id).map(e => e.voice), [vc, vo, null]);
    // AN OLD SONG INTO THE NEW SHAPE: every strike where it was
    const sound = evs => evs.filter(e => e.id).map(e => e.id + '@' + e.at + '-' + e.end + (e.voice ? JSON.stringify(e.voice) : '') + ':' + e.strikes.map(s => s.at + '+' + s.len).join(','));
    const converted = (progs, track, g) => {
      const c = chartOf(progs, expand(progs, track, g), []);
      const norm = normalizeInto({ chart: c.chart, track: looseTrack(c.pieces, g) }, { meter: g.mt.id, lines: g.p0 ? [{ pickup: true }] : [] });
      return { norm, evs: expand(norm.progressions || [], norm.track || [], g, norm.chart) };
    };
    const same = (name, progs, track, g) => { const c = converted(progs, track, g); eq('the same after: ' + name, sound(c.evs), sound(expand(progs, track, g))); return c; };
    let conv = same('verse', [verse], [{ prog: 'p1', from: 1, to: 4 }], g4);
    eq('its chart', conv.norm.chart.map(e => e.id + '=' + e.chord), ['k1=I', 'k2=IV', 'k3=V', 'k4=vi']);
    eq('its chords know their cards', conv.norm.track[0].chords.map(c => c.k), ['k1', 'k2', 'k3', 'k4']);
    same('bar rhythm over 2-beat chords', [two], [{ prog: 'p2', from: 1, to: 1 }], g4);
    same('3-beat chords', [three], [{ prog: 'p3', from: 1, to: 2 }], g4);
    same('phase', [verse], [{ prog: 'p1', from: 1, to: 2, phase: 8 }], g4);
    same('to the melody', [verse], [{ prog: 'p1', from: 1, to: 'melody' }], g4);
    same('just here', [verse], [{ prog: 'p1', from: 1, to: 4, here: [{ bar: 4, beat: 1, beats: 4, chords: [{ chord: 'IV', beats: 2 }, { chord: 'V', beats: 2, rhythm: 'q q' }] }] }], g4);
    same('a long chord cut', [long], [{ prog: 'p4', from: 1, to: 2, here: [{ bar: 1, beat: 3, beats: 4, chords: [{ chord: 'V', beats: 4 }] }] }], g4);
    same('6/8', [{ id: 'p1', name: 'C', chords: [{ chord: 'I' }, { chord: 'V' }] }], [{ prog: 'p1', from: 1, to: 2 }], g68);
    same('a pick-up', [{ id: 'p1', name: 'W', chords: [{ chord: 'I' }, { chord: 'V' }] }], [{ prog: 'p1', from: 0, to: 2 }], g34);
    same('loose', [], [{ from: 2, to: 2, chords: [{ chord: 'ii', beats: 1.5 }, { chord: null, beats: 1 }, { chord: 'V', beats: 1.5 }] }], g4);
    same('held', [{ id: 'p1', name: 'H', rhythm: 'held', chords: [{ chord: 'I', beats: 6 }, { chord: 'V', beats: 2 }] }], [{ prog: 'p1', from: 1, to: 3 }], g4);
    same('a home', [{ id: 'p1', name: 'H', rhythm: 'held', chords: [{ chord: 'I', beats: 6 }] }], [{ prog: 'p1', from: 1, to: 2, home: true }], g4);
    same('own held', [verse], [{ prog: 'p1', from: 1, to: 1, here: [{ bar: 1, beat: 2, beats: 3, chords: [{ chord: 'V', beats: 3, rhythm: 'held' }] }] }], g4);
    same('takes over', [verse, two], [{ prog: 'p1', from: 1, to: 'melody' }, { prog: 'p2', from: 3, to: 3 }], fake('4/4', 96 * 6));
    same('a two-bar rhythm', [{ id: 'p1', name: 'T', bars: 2, rhythm: 'h q~ q e e e e q. e', chords: [{ chord: 'I', place: 'f' }, { chord: null }, { chord: 'V7', beats: 6 }] }], [{ prog: 'p1', from: 1, to: 6 }], fake('4/4', 96 * 6));
    same('a long silence', [], [{ from: 1, to: 22, chords: [{ chord: 'I', beats: 1 }, { chord: null, beats: 64 }, { chord: null, beats: 15 }, { chord: 'V', beats: 1 }] }], fake('4/4', 96 * 22));
    same('12/8, changed just here mid-bar', [{ id: 'p1', name: 'C', rhythm: 'q e q e q. e e e', chords: [{ chord: 'I' }, { chord: 'vi' }] }],
      [{ prog: 'p1', from: 1, to: 3, here: [{ bar: 2, beat: 3, beats: 2, chords: [{ chord: 'IV', beats: 1 }, { chord: 'V', beats: 1, rhythm: 'e e e' }] }] }], fake('12/8', 144 * 3));
    conv = same('a chord with its own notes', [], [{ from: 1, to: 1, chords: [{ chord: 'I', voice: vc, beats: 2 }, { chord: 'I', beats: 2 }] }], g4);
    eq('two cards for one chord with two voicings', conv.norm.chart.map(e => e.chord + (e.voice ? '*' : '')), ['I*', 'I']);
    conv = same('one chord from the panel and not', [{ id: 'p1', name: 'A', chords: [{ chord: 'I', place: 'f' }, { chord: 'V' }, { chord: 'I' }] }], [{ prog: 'p1', from: 1, to: 3 }], g4);
    eq('one card for it, its key on every spot', [conv.norm.chart, conv.norm.track[0].chords.map(c => c.place || '-')], [[{ id: 'k1', chord: 'I', place: 'f' }, { id: 'k2', chord: 'V' }], ['f', '-', 'f']]);
    eq('a progression placed nowhere still on the chart', chartOf([verse, { id: 'p9', name: 'Z', chords: [{ chord: 'bVII' }] }], expand([verse], [{ prog: 'p1', from: 1, to: 1 }], g4), []).chart.map(e => e.chord), ['I', 'IV', 'V', 'vi', 'bVII']);
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
    return { ok: !failures.length, failures, checks };
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
    // the stretches on show (an old song's lane, read as one) — chord-track.js names them
    shown: g => current(g || grid()),
    // when the song changes (score.js calls these before it records the change)
    followScale, followMeter,
    // the chords on the music, a beat at a time (2026-10-27)
    HELD, flat, chordAt, putSpan: tick => putSpan(tick), putChord, moveChord, resizeChord, removeChord, setChord, tidyCells,
    // the Chord Chart (2026-10-28)
    chart: () => S.chart, chartEntry, isChartShape, chartFrom, useChart, chartAdd, chartSet, chartMove, chartRemove, usesOf, bake,
    // the Time Line's draft (2026-10-29)
    draftPieces, draftEvents, soundSig, applyDraft,
    flatOps: { cut: cutFlat, lay: layFlat, trim: trimPiece, clip: clipFlat, refit, tidy: tidyCells },
    selfTest
  };
})();

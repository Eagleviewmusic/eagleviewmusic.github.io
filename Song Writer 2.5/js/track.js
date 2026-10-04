/* ==========================================================================
   Song Writer 2.5 — track.js
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
   silence.

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
     selfTest()        pure checks of the rhythm and timing rules
   Event: 'track:changed' { why } (after SW.score.changed('track'))
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const CELL = 6;                 // ticks in a cell (a sixteenth)
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
  function cleanRhythm(str, n) {
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
          if (st.rhythm) keep.rhythm = rhythmOf(fit(cells(st.rhythm).slice(drop / CELL), (len - drop) / CELL));
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

  /* where a stretch ends for cutting and overlap: its own bar, or the
     melody's last (never before its start) */
  const lastOf = (r, lastBar) => (r.to === 'melody' ? Math.max(r.from, lastBar) : r.to);

  /* Take bars from..to (inclusive) out of a list of stretches: one wholly
     inside goes, one across an end is trimmed, one around both is split —
     its second part carries on where it would have been. */
  function cutList(list, from, to, mt, byId, lastBar) {
    const out = [];
    list.forEach(r0 => {
      const rf = r0.from, rt = lastOf(r0, lastBar);
      if (rt < from || rf > to) { out.push(r0); return; }
      if (rf < from) {
        const left = clone(r0);
        left.to = from - 1;
        if (left.here) {
          const endTick = (from - 1) * mt.barTicks;           // relative arithmetic: entries ending after bar from-1 go
          left.here = left.here.filter(h => (h.bar - 1) * mt.barTicks + (h.beat - 1) * mt.beatTicks + toTicks(h.beats, mt.beatTicks) <= endTick);
          if (!left.here.length) delete left.here;
        }
        out.push(left);
      }
      if (rt > to) out.push(shiftStart(clone(r0), to + 1 - rf, mt, byId));
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
    const c = cells(st.rhythm);
    return c ? fit(c, len / CELL) : null;
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
        pattern = fit(cells(p.rhythm) || defaultCells(mt, p.bars), mt.barTicks * (p.bars || 1) / CELL);
        const lens = p.chords.map(st => toTicks(stepBeats(st, p, mt), g.b));
        const C = lens.reduce((x, y) => x + y, 0);
        if (!C) return;
        const offs = [];
        lens.reduce((acc, l, i) => { offs[i] = acc; return acc + l; }, 0);
        const t0 = a - mod(toTicks(r.phase || 0, g.b), C);
        for (let n = 0; t0 + n * C < z && n < 20000; n++) {
          for (let i = 0; i < p.chords.length; i++) {
            const s = t0 + n * C + offs[i], e = s + lens[i];
            if (e <= a) continue;
            if (s >= z) break;
            pieces.push({ at: Math.max(s, a), end: Math.min(e, z), from: s, id: p.chords[i].chord, step: i, pass: n, own: ownCells(p.chords[i], lens[i]) });
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
            if (e > at) kept.push({ at, end: e, from: s, id: ch.chord, step: null, pass: null, here: true, hereIndex: hi, hereStep: ci, own: ownCells(ch, len) });
            s += len;
          });
          pieces = kept;
        });
      } else {
        let s = a;
        (r.chords || []).forEach((st, i) => {
          const len = toTicks(st.beats || mt.beats, g.b);
          const e = s + len;
          if (s < z && e > a) pieces.push({ at: Math.max(s, a), end: Math.min(e, z), from: s, id: st.chord, step: i, pass: 0, own: ownCells(st, len) });
          s = e;
        });
      }
      pieces.sort((x, y) => x.at - y.at).forEach(pc => {
        out.push({
          at: pc.at, end: pc.end, id: pc.id,
          stretch: si, prog: r.prog || null, step: pc.step, pass: pc.pass,
          here: !!pc.here, hereIndex: pc.here ? pc.hereIndex : null, hereStep: pc.here ? pc.hereStep : null,
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

  /* put a stretch in, taking its bars from whatever had them */
  function put(st, g) {
    const mt = meterOf();
    const last = lastOf(st, g.lastBar);
    S.track = cutList(S.track, st.from, last, mt, byIdNow(), g.lastBar);
    S.track.push(st);
    S.track.sort((a, b) => a.from - b.from);
  }
  /* Put a progression in: bars from..to (to: a bar, or 'melody'). Without
     `to`: to the end of the melody, or once through when the melody ends
     before `from`. */
  function place(progId, from, to) {
    const p = findProg(progId);
    if (!p) return;
    const g = grid();
    materialize(g);
    if (to === undefined || to === null) {
      if (g.lastBar >= from) to = 'melody';
      else to = from + Math.max(1, Math.ceil(cycleBeats(p, g.mt) / g.mt.beats)) - 1;
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
    if (patch.to !== undefined) st.to = patch.to;
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
        if (st.rhythm) o.rhythm = rhythmOf(fit(cells(st.rhythm).slice(offset / CELL), (to - from) / CELL));
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
      if (p.rhythm) p.rhythm = barRhythm(p.rhythm, p.bars || 1);
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
    // for the map (the window's In the song)
    shown: g => current(g || grid()),                               // the stretches on show (an old song's lane, read as one)
    lastOf: (r, g) => lastOf(r, (g || grid()).lastBar),             // a stretch's last bar, 'melody' resolved
    cycleBeats: p => cycleBeats(p, meterOf()),
    // when the song changes (score.js calls these before it records the change)
    followScale, followMeter,
    hereAt, setHere, setHereSpan, writeBack,
    selfTest
  };
})();

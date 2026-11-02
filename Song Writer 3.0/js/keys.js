/* ==========================================================================
   Song Writer 3.0 — keys.js
   --------------------------------------------------------------------------
   SW.keys   KEY CHANGES (2026-10-31, the user).

   Look → "When the key is changed": Transpose · Create Key Change (view
   pref keyMode; Transpose to start, as the app always was). Setup's key
   chips then do one of two things:

   TRANSPOSE — the key the selection is in moves, and its notes with it:
     every note keeps its solfège (do stays do) and sounds in the new key.
     With no key change in the song that is the whole song, as before. In a
     song that changes key, only the stretch the selection is in — from its
     key change to the next one (C, then D♭ at bar 17: selected at bar 20,
     the D♭ stretch moves). With nothing selected, the whole song moves, every
     stretch by the same interval.

   CREATE KEY CHANGE — the key changes where you are: at the START OF THE
     BAR the selected note is in (the user, 2026-10-31: key signatures sit
     at bar lines, as in print); that note is the key change's trigger. Everything from there on is written in the
     new key, everything before stays in the old one. If notes are already
     written from there to the next key change, a window asks: TRANSPOSE
     them (they keep their solfège and move into the new key) or REMAIN
     UNCHANGED (they keep their pitches, re-written in the new key — often
     with ♯ and ♭). The chords there do the same (the user's call): they
     are numerals (I, IV, V7), so they follow the key by themselves — and
     with Remain unchanged they are re-written so they sound as before (C's
     I in D♭ is VII), leaving their chart card (a card is one chord for the
     whole song) with their notes kept. In this mode the range is real
     pitch, the same in every key: from A♭2 — the lowest note any key has
     (A♭'s low do) — to G6 — the highest (G's top do) — on the wider rungs
     (core.js RUNGS). The letter keys still follow the key you are in; a
     note at the far ends may have no letter key, which is fine.

   THE MODEL — a key change is kept on its TRIGGER, the note selected
   when it was made:
     cols[].key = 'Db'           (score.js readLine / renderScore)
   In the page: .harmony-stack[data-key="Db"]. The song's `key` is its
   OPENING key (S.key). The new key starts on the FIRST BEAT of the bar
   the trigger is in — wherever a rhythm change moves the trigger, the
   key change goes with it, to the bar line of its bar (the user,
   2026-10-31: never on beat three; the two are never parted). Notes a
   rhythm change carries across that bar line, either way, are written in
   the key they land in with ♯ / ♭ as needed, so they keep their pitch
   (keepPitches). A trigger repeating the key before it changes nothing
   and is tidied away; one on the song's very first column becomes the
   opening key; two in one bar: the later one's key. The rhythm tools pour
   the trigger along with its notes (flow.js clones the column, the first
   piece of a tied sound only) — and a deleted trigger hands its key
   change to the next column (repair).

   THE KEY IN EFFECT (core.js keyNow / withKey): anything drawn, sounded or
   written for a note, a column or a bar is done in that place's key; what
   follows the selection — the chord panel, the keyboard, the letter keys,
   Setup — uses the key where the selection is (here()).

   API
     mode()                  'transpose' | 'change'
     at(el)                  the key in force at a note, column, syllable or line
     here()                  the key at the selection (the song's opening key with none)
     atTick(t)               the key in force at a song tick (the chords, the player)
     changes()               the triggers whose key is in force, in order
     starts()                [{ stack, key, mark }] — the first column of each bar where the key changes
     eachStack(fn)           fn(stack, key) for every column, in order
     choose(key)             Setup's key chips (one of the two modes above)
     range()                 [low, high] MIDI for Create Key Change (A♭2 … G6)
     inRange(midi)           inside it?
     rungsFor(key)           the rungs a key may write in Create Key Change
     startBar(stack)         the song bar a column is in
     barStart(stack)         the first column of that bar (read from the line alone — no pitches)
   Events: 'keyhere:changed' { key } — the selection is now in another key
           (no 'key:changed': that one stops the player).
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const $ = id => document.getElementById(id);
  const container = () => document.getElementById('score');
  const FOLLOWING = 4;                                // Node.DOCUMENT_POSITION_FOLLOWING
  const mod = (a, n) => ((a % n) + n) % n;

  /* ---------------- the range (Create Key Change) ---------------- */
  const LOW = M.noteMidi('do-low', 'natural', 'Ab');     // A♭2 — A♭'s low do, the lowest note any key has
  const HIGH = M.noteMidi('do-high2', 'natural', 'G');   // G6 — G's top do, the highest
  const range = () => [LOW, HIGH];
  const inRange = midi => midi >= LOW && midi <= HIGH;
  /* the rungs whose notes (natural, ♯ or ♭) can land inside the range in this key */
  function rungsFor(key) {
    return M.RUNGS.filter(nc => {
      const m = M.noteMidi(nc, 'natural', key);
      return m !== null && m >= LOW - 1 && m <= HIGH + 1;
    });
  }

  function mode() { return SW.settings && SW.settings.view.keyMode === 'change' ? 'change' : 'transpose'; }

  /* ---------------- bars, from the line alone ----------------
     Every line starts a new bar (a line is a phrase — core.js METERS), so
     a column's bar is worked out from its own line: the ticks before it
     (a written column its value, a block one beat) and the pick-up. No
     pitches are read, so this can be asked while pitches are being worked
     out (timing.js column → at). */
  function lineBars(line) {
    const mt = SW.meters.byId(S.meter);
    const P = SW.timing.linePickup(line);
    const shift = P ? mt.barTicks - P : 0;
    let t = 0;
    return Array.from(line.querySelectorAll('.harmony-stack')).map(st => {
      const v = SW.score.isNotated(st) ? st.dataset.v : null;
      const o = { stack: st, bar: Math.floor((t + shift) / mt.barTicks) };
      t += v ? SW.values.byId(v).ticks : mt.beatTicks;
      return o;
    });
  }
  /* the first column that starts in the bar this column is in */
  function barStart(stack) {
    const line = stack && stack.closest('.notation-line');
    if (!line) return stack;
    const cols = lineBars(line);
    const me = cols.find(c => c.stack === stack);
    return me ? cols.find(c => c.bar === me.bar).stack : stack;
  }

  /* ---------------- where the key is ----------------
     A KEY CHANGE is kept on the note that made it (its TRIGGER — the note
     selected when it was made: `data-key` on its column). The new key
     starts on the FIRST BEAT of the trigger's bar, wherever the rhythm
     moves the trigger (the user, 2026-10-31): never on beat three, and the
     trigger is never in another bar than its key change. Two triggers in
     one bar: the later one's key. A trigger repeating the key before it
     changes nothing. */
  function marks() {
    const c = container();
    return c ? Array.from(c.querySelectorAll('.harmony-stack[data-key]')) : [];
  }
  function stacks() {
    const c = container();
    return c ? Array.from(c.querySelectorAll('.harmony-stack')) : [];
  }
  const atOrAfter = (a, ref) => a === ref || !!(a.compareDocumentPosition(ref) & FOLLOWING);
  /* the key changes in force, in order: { mark (the trigger), start (the bar's first column), key } */
  function entries() {
    const out = [];
    marks().forEach(m => {
      const start = barStart(m);
      if (out.length && out[out.length - 1].start === start) out.pop();
      out.push({ mark: m, start, key: m.dataset.key });
    });
    let k = S.key;
    return out.filter(e => { if (e.key === k) return false; k = e.key; return true; });
  }
  /* the key in force at an element: a note or its column, or the first
     column of a syllable or a line (a line with none: the key before it) */
  function at(el) {
    const c = container();
    if (!el || !c) return S.key;
    if (!el.isConnected) return here();               // a note still being made goes in where the selection is
    if (!c.querySelector('.harmony-stack[data-key]')) return S.key;
    let ref = el.closest ? el.closest('.harmony-stack') : null;
    if (!ref && el.querySelector) ref = el.querySelector('.harmony-stack');
    ref = ref || el;
    let k = S.key;
    for (const e of entries()) {
      if (atOrAfter(e.start, ref)) k = e.key;
      else break;
    }
    return k;
  }
  function here() {
    const c = container();
    if (!c || !c.querySelector('.harmony-stack[data-key]')) return S.key;
    const sel = c.querySelector('.note.selected-note');
    return sel ? at(sel) : S.key;
  }
  /* the triggers whose key is in force */
  function changes() { return entries().map(e => e.mark); }
  /* where the key really changes: the first column of each such bar, and its key (the staff, the flags) */
  function starts() { return entries().map(e => ({ stack: e.start, key: e.key, mark: e.mark })); }
  function eachStack(fn) {
    const es = new Map(entries().map(e => [e.start, e.key]));
    let k = S.key;
    stacks().forEach(st => { if (es.has(st)) k = es.get(st); fn(st, k); });
  }
  /* a stretch: where it starts (null: the song's opening), its trigger, where the next one starts, its key */
  function regionOf(stack) {
    const es = entries();
    let i = -1;
    es.forEach((e, j) => { if (atOrAfter(e.start, stack)) i = j; });
    const e = es[i];
    return { start: e ? e.start : null, mark: e ? e.mark : null, end: es[i + 1] ? es[i + 1].start : null, key: e ? e.key : S.key };
  }
  /* the columns from `from` up to (not with) the next stretch's first column */
  function stacksFrom(from) {
    const all = stacks();
    const i = all.indexOf(from);
    if (i < 0) return [];
    const next = entries().map(e => e.start).find(st => st !== from && atOrAfter(from, st));
    const out = [];
    for (let j = i; j < all.length && all[j] !== next; j++) out.push(all[j]);
    return out;
  }

  /* ---------------- bars and ticks ---------------- */
  function eventOf(stack) {
    const sg = SW.timing.song();
    for (const le of sg.lines) {
      const ev = le.events.find(e => e.stack === stack);
      if (ev) return { sg, le, ev };
    }
    return null;
  }
  /* the song tick of the bar line a column's bar starts at */
  function barTick(stack) {
    const f = eventOf(stack);
    return f ? f.le.at + f.le.barStart(f.ev.bar) : 0;
  }
  function startBar(stack) {
    const p = SW.timing.placeOf(stack);
    return p ? p.bar : null;
  }
  /* where the key changes, in song ticks (at its bar line) — cached until the song changes */
  let tickCache = null;
  function keyTicks() {
    if (tickCache) return tickCache;
    return (tickCache = entries().map(e => ({ at: barTick(e.start), key: e.key })));
  }
  function atTick(t) {
    let k = S.key;
    keyTicks().forEach(c => { if (c.at <= t) k = c.key; });
    return k;
  }

  /* ---------------- after every edit ----------------
     Before the history records it (this file is loaded first, so its
     listeners run first):
       • REPAIR — a trigger whose column was deleted hands its key change
         to the next column after it, so the music keeps its keys;
       • TIDY — a trigger repeating the key before it is dropped, and one on
         the song's very first column becomes the opening key;
       • KEEP THE PITCH (the user, 2026-10-31) — when a rhythm change moves
         notes across a key change's bar line (into the new key's first bar,
         or back out of it), they are written in the key they are now in,
         with ♯ / ♭ as needed, so every one sounds as it did. Notes are
         matched before and after by their order (a rhythm change keeps it;
         an edit elsewhere leaves the notes before and after it in step).
         A key change made or moved on purpose (Setup) is never undone
         this way: it takes a fresh snapshot first. */
  let snap = null;
  function keyList() { return S.key + '|' + marks().map(m => m.dataset.key).join(','); }
  function notesNow() {
    const out = [];
    eachStack((st, k) => st.querySelectorAll('.note').forEach(n => {
      if (n.classList.contains('rest-note')) return;
      out.push({ el: n, nc: M.noteClassOf(n), acc: SW.score.getAccidentalFromNote(n), key: k });
    }));
    return out;
  }
  function snapshot() {
    const ms = marks();
    const all = stacks();
    snap = {
      keys: keyList(),
      notes: ms.length ? notesNow() : [],
      // each trigger and the columns after it, up to the next trigger (REPAIR)
      triggers: ms.map((m, i) => {
        const a = all.indexOf(m), b = ms[i + 1] ? all.indexOf(ms[i + 1]) : all.length;
        return { key: m.dataset.key, after: all.slice(a, b) };
      })
    };
  }
  function repair() {
    if (!snap) return;
    snap.triggers.forEach(t => {
      const head = t.after[0];
      if (head && head.isConnected && head.dataset.key) return;    // still there
      // deleted: the next column still here takes it. A line the rhythm tools drew again is all
      // new columns — its trigger came with it (flow.js clones the column)
      const keep = t.after.find(st => st.isConnected);
      if (!keep || keep.dataset.key) return;
      if (at(keep) !== t.key) keep.dataset.key = t.key;
    });
  }
  function tidy() {
    const all = stacks();
    if (all.length && all[0].dataset.key) {
      const k = all[0].dataset.key;
      delete all[0].dataset.key;
      if (k !== S.key) SW.score.changeKey(k);
    }
    // a trigger repeating the one before it (a copy, or the opening key) changes nothing
    let k = S.key;
    marks().forEach(m => { if (m.dataset.key === k) delete m.dataset.key; else k = m.dataset.key; });
  }
  function keepPitches() {
    if (!snap || !snap.notes.length || snap.keys !== keyList()) return 0;
    const was = snap.notes, now = notesNow();
    const same = (a, b) => a.nc === b.nc && a.acc === b.acc;
    let p = 0;
    while (p < was.length && p < now.length && same(was[p], now[p])) p++;
    let q = 0;
    while (q < was.length - p && q < now.length - p && same(was[was.length - 1 - q], now[now.length - 1 - q])) q++;
    const pairs = [];
    for (let i = 0; i < p; i++) pairs.push([was[i], now[i]]);
    for (let i = 1; i <= q; i++) pairs.push([was[was.length - i], now[now.length - i]]);
    let n = 0;
    pairs.forEach(([a, b]) => {
      if (a.key === b.key) return;
      const pt = respellPitch(b.nc, b.acc, a.key, b.key);
      if (pt) { SW.score.repitch(b.el, pt.nc, pt.acc, b.key); n++; }
    });
    return n;
  }
  /* the Pitch page's flag on the first column of a bar where the key changes (style.css KEY CHANGES) */
  function paint() {
    const c = container();
    if (!c) return;
    const st = starts();
    const on = new Set(st.map(e => e.stack));
    c.querySelectorAll('.harmony-stack[data-key-label]').forEach(x => { if (!on.has(x)) delete x.dataset.keyLabel; });
    st.forEach(e => {
      e.stack.dataset.keyLabel = M.displayKey(M.spelledKey(e.key));
      e.stack.style.setProperty('--kc', M.keySignatureColors[M.spelledKey(e.key)] || '#9C168E');
    });
  }
  let lastHere = null;
  function notice() {
    const k = here();
    if (k !== lastHere) { lastHere = k; SW.bus.emit('keyhere:changed', { key: k }); }
  }
  SW.bus.on('score:changed', () => {
    tickCache = null;
    if (marks().length || (snap && snap.triggers.length)) {
      repair();
      tidy();
      keepPitches();
      if (SW.score.recolour) SW.score.recolour();       // a column moved, made or deleted takes its place's key
    }
    paint();
    snapshot();
    notice();
  });
  SW.bus.on('score:loaded', () => {
    tickCache = null;
    tidy();
    if (marks().length && SW.score.recolour) SW.score.recolour();
    paint();
    snapshot();
    notice();
  });
  ['key:changed', 'meter:changed'].forEach(evt => SW.bus.on(evt, () => { tickCache = null; paint(); notice(); }));
  SW.bus.on('selection', notice);

  /* ---------------- respelling: the same pitch, written in another key ----------------
     The rung (and ♯ / ♭, never on do or fa going flat or mi or ti going
     sharp, 1.0's rule) that sounds the same pitch in the new key: in the
     scale if it can be, else on the same letter, else plain, else any. */
  function respellPitch(nc, acc, fromKey, toKey) {
    const midi = M.noteMidi(nc, acc, fromKey);
    const letter = M.spellNote(nc, acc, fromKey).letter;
    let best = null, bestScore = -1;
    M.RUNGS.forEach(r => {
      const sol = M.noteToSolfege[r];
      ['natural', 'flat', 'sharp'].forEach(a => {
        if (a === 'flat' && (sol === 'Do' || sol === 'Fa')) return;
        if (a === 'sharp' && (sol === 'Mi' || sol === 'Ti')) return;
        if (M.noteMidi(r, a, toKey) !== midi) return;
        const score = (M.withKey(toKey, () => M.inScale(r, a)) ? 4 : 0) +
          (M.spellNote(r, a, toKey).letter === letter ? 2 : 0) + (a === 'natural' ? 1 : 0);
        if (score > bestScore) { bestScore = score; best = { nc: r, acc: a }; }
      });
    });
    return best;
  }

  /* a chord re-written so it sounds where it did: its root as a numeral of
     the new key (spelled as the scale spells it), its own notes moved */
  function keepChords(t0, t1, fromKey, toKey) {
    if (!SW.track || !SW.track.hasChords() || typeof Theory === 'undefined') return 0;
    const T = Theory;
    const shift = T.tonicMidi(M.KEY_SIGNATURES_CHROMATIC_INDEX[fromKey]) - T.tonicMidi(M.KEY_SIGNATURES_CHROMATIC_INDEX[toKey]);
    const sc = M.scaleOf();
    const list = SW.track.flat().filter(pc => pc.at >= t0 && pc.at < t1 && pc.chord);
    let n = 0;
    SW.track.batch(() => list.forEach(pc => {
      const spec = SW.chords.parse(pc.chord);
      if (!spec) return;
      const semis = mod(T.degreeSemis(spec.root) + shift, 12);
      const id = SW.chords.toId({ root: T.semisToDegree(semis, sc ? sc.degrees : []), q: spec.q, mods: spec.mods });
      if (!id) return;
      const card = pc.k ? SW.track.chartEntry(pc.k) : null;
      const v = (card && card.voice) || pc.voice;
      const patch = { chord: id, place: null, k: null };
      if (v) patch.voice = SW.chords.cleanVoice(v.map(nn => [Math.round((nn[1] + shift) * 7 / 12), nn[1] + shift])) || null;
      SW.track.setChord(pc.at, patch);
      n++;
    }));
    return n;
  }

  /* ---------------- the key chips ---------------- */
  const KEY_IDX = k => M.KEY_SIGNATURES_CHROMATIC_INDEX[k];
  /* a key moved by d semitones, keeping to the flat or sharp side it was on (F♯ or G♭) */
  function shiftKey(k, d) {
    const want = mod(KEY_IDX(k) + d, 12);
    const hits = M.KEYS.filter(x => KEY_IDX(x) === want);
    if (hits.length < 2) return hits[0] || k;
    return hits.find(x => (x.indexOf('b') > 0) === (k.indexOf('b') > 0 || k === 'F')) || hits[0];
  }
  const keyName = k => M.displayKey(M.spelledKey(k));
  function selectedStack() {
    const n = SW.score.getActiveNote();
    return n ? n.closest('.harmony-stack') : null;
  }
  function done(reason) {
    tickCache = null;
    tidy();
    SW.score.recolour({ announce: true });
    paint();
    snapshot();                                       // what the key changes are now — nothing to repair
    if (reason) SW.score.changed(reason);
    notice();
  }

  function choose(k) {
    if (!SW.settings.can('key') || KEY_IDX(k) === undefined) return;
    if (mode() === 'change') createChange(k);
    else transpose(k);
  }

  /* TRANSPOSE: the stretch the selection is in (with nothing selected, the whole song) */
  function transpose(k) {
    const sel = selectedStack();
    if (!changes().length) {
      if (k === S.key) return;
      SW.score.changeKey(k);
      snapshot();                                     // moved on purpose: nothing to keep in pitch
      SW.score.changed('key');
      return;
    }
    if (!sel) {
      const d = KEY_IDX(k) - KEY_IDX(S.key);
      if (!d && k === S.key) return;
      marks().forEach(m => { m.dataset.key = shiftKey(m.dataset.key, d); });
      SW.score.changeKey(k);
      done('key');
      return;
    }
    const r = regionOf(sel);
    if (k === r.key) return;
    if (!r.mark) SW.score.changeKey(k);
    else r.mark.dataset.key = k;
    done('key');
  }

  /* CREATE KEY CHANGE: the selected note is the trigger; the key changes from its bar's first beat */
  function createChange(k) {
    const sel = selectedStack();
    if (!sel) { SW.ui.toast('Select a note — the new key starts at the start of its bar'); return; }
    const from = barStart(sel);
    const cur = at(from);
    if (k === cur) { SW.ui.toast('The music there is already in ' + keyName(k)); return; }
    const region = stacksFrom(from);
    const notes = [];
    region.forEach(st => st.querySelectorAll('.note').forEach(n => notes.push(n)));
    const written = notes.some(n => !n.classList.contains('rest-note'));
    const bar = startBar(from);
    const apply = keep => {
      const all = stacks();
      // the stretch's ticks, for its chords (from its bar line to the next key change's)
      const next = entries().map(e => e.start).find(st => st !== from && atOrAfter(from, st));
      const t0 = all[0] === from ? -Infinity : barTick(from);
      const t1 = next ? barTick(next) : Infinity;
      let moved = 0, lost = 0;
      if (keep) {
        notes.forEach(n => {
          const nc = M.noteClassOf(n);
          if (!nc) return;
          const p = respellPitch(nc, SW.score.getAccidentalFromNote(n), cur, k);
          if (p) { SW.score.repitch(n, p.nc, p.acc, k); moved++; } else lost++;
        });
      }
      // a key change already in this bar gives way to this one; the selected note is its trigger
      marks().forEach(m => { if (barStart(m) === from) delete m.dataset.key; });
      if (all[0] === from) SW.score.changeKey(k);
      else sel.dataset.key = k;
      tickCache = null;
      snapshot();
      const chords = keep ? keepChords(t0, t1, cur, k) : 0;
      done(chords ? null : 'key');                    // the chords' batch committed the change (one Undo step)
      const where = all[0] === from ? 'from the start' : 'from bar ' + bar;
      SW.ui.toast(keyName(k) + ' ' + where + (keep ? ' — the notes kept their pitches' : '') +
        (lost ? ' (' + lost + (lost === 1 ? ' note' : ' notes') + ' had no place and moved with the key)' : ''));
    };
    if (!written) { apply(false); return; }
    ask(cur, k, bar, stacks()[0] === from, apply);
  }

  /* the window: Transpose · Remain unchanged (· Cancel) */
  let pending = null;
  function ask(fromKey, toKey, bar, atStart, apply) {
    pending = apply;
    $('kc-title').textContent = 'Change to ' + keyName(toKey) + (atStart ? ' from the start?' : ' from bar ' + bar + '?');
    $('kc-sub').textContent = 'There are notes written after this point, in ' + keyName(fromKey) + '.';
    $('kc-transpose-note').textContent = 'They keep their solfège and move into ' + keyName(toKey) + '.';
    $('kc-keep-note').textContent = 'They keep their pitches, written in ' + keyName(toKey) + '.';
    SW.ui.openSheet('keychange-sheet');
  }
  function answer(keep) {
    const fn = pending;
    pending = null;
    SW.ui.closeSheet('keychange-sheet');
    if (fn) fn(keep);
  }
  function wire() {
    const t = $('kc-transpose'), k = $('kc-keep');
    if (t) t.addEventListener('click', () => answer(false));
    if (k) k.addEventListener('click', () => answer(true));
    SW.bus.on('sheet:closed', d => { if (d && d.id === 'keychange-sheet') pending = null; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();

  SW.keys = {
    mode, at, here, atTick, changes, starts, eachStack, choose, range, inRange, rungsFor, startBar,
    regionOf, barStart, respellPitch
  };
})();

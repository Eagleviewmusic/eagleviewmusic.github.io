/* ==========================================================================
   Song Writer 3.0 — flow.js
   --------------------------------------------------------------------------
   SW.flow   Rhythm Poetry's flow, for a melody (SONG-WRITER-RHYTHM-PLAN.md
             §3–§5, phases P2–P3).

   THE IDEA. A line has two things in it that Song Writer used to weld
   together inside each column:
     TIME     where the sounds begin, how long they last, where it is
              silent — ONSETS, read from the columns, always whole beats
              of the line's grid (timing.js)
     MELODY   the line's pitches in order, each carrying its word — the
              STREAM. A syllable keeps its notes together (a melisma stays
              a melisma); a word is never moved off its pitch here.
   A rhythm tool changes the onsets and then POURS the stream into them:
   the k-th sounding onset takes the k-th item of the stream, as Rhythm
   Poetry's words pour into its notes.

   THE STREAM (stream()). Walking the line's columns in time:
     • an ITEM — a column with a pitch (or a tie chain inside one
       syllable, the same pitches held on: one sound), or a rest the user
       put a word on (the first column of a worded syllable): the
       melody's own; it flows
     • a GAP — a rest with no word (any other rest): the rhythm's own;
       rhythm tools make, move and remove these
   A syllable is "worded" if it has a word or a lane chord.

   THE RULES (plan §4) this file keeps:
     R1  no word is deleted: only gaps and wordless "-" syllables are
         ever made or removed; every item is kept (at worst it waits at
         the line's end as a block)
     R2  THE MELODY NEVER GROWS (2026-10-26, the user): no rhythm tool
         makes a note. An onset the melody has no pitch left for is
         silence — a rest where something follows it, nothing at all at
         the line's end (the line ends with its last note; the staff
         finishes the bar with drawn rests). Until then such an onset made
         a GHOST note (2026-10-01: the pitch before, hollow and dashed) or
         TIED the note before into it (2026-10-25): both grew the song with
         notes nobody wrote, one yellow circle tapped in beat 1 turned the
         line's last note into a tied half note, and the tie made the
         circles unanswerable — a tap that split the held note was tied
         straight back together, so the note looked locked. A song saved
         with ghosts reads them as the silence they stood in for
         (score.js normalizeScore).
     R3  the flow stays inside the line
     R6  every tool is one changed() — one Undo step
     R8  the stream moves by identity: an item is the same column objects
         wherever it lands; nothing is matched by index
   And the CONTRACT: pour(line, onsets(line)) gives the line back exactly
   (checked in SW.flow.selfTest()).

   POUR, item by item:
     • a sounding onset takes the next item. Same length as before: its
       columns exactly as they were. A new length: written as the fewest
       values that make it (tied when it takes more than one — a sound
       stays one sound). On a BLOCK onset it becomes a block (the rhythm
       is the onset's, the pitch the item's).
     • a rest onset: the gap that was there before (same place and
       length), or a new wordless rest column on the word before it (D3) —
       at the line's start, a "-" syllable of its own.
     • a sounding onset with no item left is silence (R2): a rest where
       something follows it, nothing at the line's end.
     • items with no onset left wait at the line's end as blocks (R1).

   API
     SW.flow.stream(lineModel) · onsets(lineModel)
     SW.flow.pour(lineModel, onsets)    → { model, firstCol: Map(item → n) }
     SW.flow.apply(line, onsets, focusItem, reason)   pour into the page
     SW.flow.itemAt(line, stack)        the stream item holding a column
     SW.flow.fillState() / fillBar()    the selected note to the bar line
     SW.flow.writeValue / tie / untie / insertRest   the Edit box's rhythm
                                        tools, as cell gestures (below)
     SW.flow.tap                        Tap it in (below)
     SW.flow.selfTest()                 the contract, on every line on screen
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const V = SW.values;
  /* a block lasts one beat: a quarter, or a dotted quarter in 6/8 9/8 12/8 */
  const blockTicks = () => SW.meters.byId(S.meter).beatTicks;

  const clone = o => JSON.parse(JSON.stringify(o));
  const isRestCol = c => c.notes.every(n => n.rest);
  const worded = sy => (sy.text && sy.text !== '-') || !!sy.chord;
  const colTicks = c => c.v ? V.byId(c.v).ticks : blockTicks();
  const meter = () => SW.meters.byId(S.meter);
  function shiftOf(lineModel) {
    const mt = meter();
    const P = lineModel.pickup && V.isValid(lineModel.pickup) ? V.byId(lineModel.pickup).ticks : 0;
    return P && P < mt.barTicks ? mt.barTicks - P : 0;
  }
  function allowed() {
    return SW.settings && SW.settings.allowedValues ? SW.settings.allowedValues() : null;
  }

  /* ================= THE STREAM ================= */
  /* the same sounding pitches (a tie holds only what both columns share — timing.js TIES) */
  const pitchKey = c => c.notes.filter(n => !n.rest).map(n => n.n + '|' + (n.acc || 'natural')).sort().join(',');
  const sameNotes = (a, b) => pitchKey(a) === pitchKey(b);
  function stream(lineModel) {
    const flat = [];
    (lineModel.syllables || []).forEach((sy, si) => sy.cols.forEach((c, ci) => flat.push({ c, si, ci })));
    const items = [], gaps = [];
    let t = 0;
    for (let i = 0; i < flat.length; i++) {
      const f = flat[i];
      const sy = lineModel.syllables[f.si];
      const melody = f.ci === 0 && worded(sy);             // the first column of a worded syllable
      const rest = isRestCol(f.c);
      if (!melody && rest) { gaps.push({ col: f.c, si: f.si, start: t, ticks: colTicks(f.c) }); t += colTicks(f.c); continue; }
      const item = { cols: [f.c], si: f.si, start: t, rest, block: !f.c.v };
      let ticks = colTicks(f.c);
      // a tie chain inside the syllable — the same pitches held on — is one sound
      while (!rest && f.c.v && item.cols[item.cols.length - 1].tie && flat[i + 1] && flat[i + 1].si === f.si
             && flat[i + 1].c.v && !isRestCol(flat[i + 1].c) && sameNotes(item.cols[item.cols.length - 1], flat[i + 1].c)) {
        i++;
        item.cols.push(flat[i].c);
        ticks += colTicks(flat[i].c);
      }
      item.ticks = ticks;
      items.push(item);
      t += ticks;
    }
    return { items, gaps, total: t };
  }

  /* The line's time: every onset in order. { start, ticks, rest, block,
     silent (an item that is a rest), item } */
  function onsets(lineModel, st) {
    st = st || stream(lineModel);
    const out = [];
    st.items.forEach(it => out.push({ start: it.start, ticks: it.ticks, rest: false, block: it.block, silent: it.rest, item: it }));
    st.gaps.forEach(g => out.push({ start: g.start, ticks: g.ticks, rest: true, block: !g.col.v }));
    out.sort((a, b) => a.start - b.start);
    return out;
  }

  /* ================= POUR ================= */
  function pour(lineModel, ons, fixed) {
    const st = stream(lineModel);
    const syls = lineModel.syllables || [];
    const mt = meter();
    const shift = shiftOf(lineModel);
    const ok = allowed();
    const emitted = [];                       // { si, col }
    const firstCol = new Map();               // item → index of its first column in the line
    let k = 0;
    let lastSi = null;                        // the syllable written into last ('lead' at the start)
    let lastPitch = null;                     // the last column with a pitch, for the rests' kept pitch
    const used = new Set();

    // R2: the melody never grows. The sounding onsets past its last item are
    // silence; at the line's end they are not written at all — the line ends
    // with its last note, and the bar is finished with drawn rests.
    let sounding = 0;
    ons = ons.map(on => {
      if (on.rest) return on;
      if (sounding < st.items.length) { sounding++; return on; }
      return Object.assign({}, on, { rest: true, over: true });
    });
    while (ons.length && ons[ons.length - 1].over) ons.pop();

    const emit = (si, col) => { emitted.push({ si, col }); lastSi = si; if (!isRestCol(col)) lastPitch = col; };
    const rank = si => si === 'lead' ? -1 : si;
    // may a column go back into syllable si without breaking the order of the words?
    const canUse = si => {
      if (si === lastSi) return true;
      if (lastSi !== null && rank(si) < rank(lastSi)) return false;
      return k >= st.items.length || st.items[k].si >= si;
    };
    const pitchSource = () => lastPitch || (st.items.find(it => !it.rest) || { cols: [{ notes: [{ n: 'do' }] }] }).cols[0];
    const restNotes = () => pitchSource().notes.map(n => { const m = clone(n); m.rest = true; delete m.alt; delete m.step; return m; });
    // a stretch of time written as values (tied when a sound takes more than one)
    const spelled = (on, rest) => SW.timing.spell(on.ticks, on.start + shift, mt, rest, ok);
    // reuse the rhythm's own column (a gap) that sat exactly here before
    const reuse = (list, on) => {
      const g = list.find(x => !used.has(x) && x.start === on.start && x.ticks === on.ticks && canUse(x.si));
      if (g) used.add(g);
      return g;
    };
    const home = () => lastSi === null ? 'lead' : lastSi;

    ons.forEach(on => {
      if (on.rest) {
        const g = reuse(st.gaps, on);
        if (g) { emit(g.si, g.col); return; }
        const si = home();
        if (on.block) { emit(si, { notes: restNotes() }); return; }
        spelled(on, true).forEach(id => emit(si, { v: id, notes: restNotes() }));
        return;
      }
      if (k < st.items.length) {
        const it = st.items[k++];
        firstCol.set(it, emitted.length);
        const first = it.cols[0];
        if (on.block) {
          const c = clone(first);
          delete c.v; delete c.tie;
          emit(it.si, c);
        } else if (fixed && fixed.index === k - 1 && fixed.cols.reduce((a, c) => a + colTicks(c), 0) === on.ticks) {
          fixed.cols.forEach(c => emit(it.si, clone(c)));               // written as asked (Tie keeps its chain in view)
        } else if (!it.block && on.ticks === it.ticks) {
          it.cols.forEach(c => emit(it.si, c));                         // as it was
        } else {
          const ids = spelled(on, it.rest);
          const lastTie = !!it.cols[it.cols.length - 1].tie;
          ids.forEach((id, j) => {
            const src = it.cols[Math.min(j, it.cols.length - 1)];
            const c = clone(j < it.cols.length ? src : first);
            c.v = id;
            if (j < ids.length - 1 && !it.rest) c.tie = true; else if (lastTie && !it.rest) c.tie = true; else delete c.tie;
            emit(it.si, c);
          });
        }
      }
      // (every sounding onset past the items became a rest above — R2)
    });
    // the melody outran the onsets: what is left waits as blocks
    while (k < st.items.length) {
      const it = st.items[k++];
      firstCol.set(it, emitted.length);
      const c = clone(it.cols[0]);
      delete c.v; delete c.tie;
      emit(it.si, c);
    }

    // the syllables again, in order, each with its new columns
    const out = [];
    let cur = null, curSi = undefined;
    emitted.forEach(({ si, col }) => {
      if (si !== curSi) {
        cur = si === 'lead' ? { text: '-', cols: [] } : Object.assign({}, syls[si], { cols: [] });
        out.push(cur);
        curSi = si;
      }
      cur.cols.push(col);
    });
    const model = Object.assign({}, lineModel, { syllables: out });
    return { model, firstCol, stream: st };
  }

  /* ================= INTO THE PAGE ================= */
  const lineEl = stack => stack && stack.closest('.notation-line');
  function stacksOf(line) { return Array.from(line.querySelectorAll('.harmony-stack')); }

  const allLines = () => Array.from(document.querySelectorAll('#score .notation-line'));
  const lineIndexOf = line => allLines().indexOf(line);
  const lineAt = i => (i >= 0 ? allLines()[i] : null) || null;
  /* where a column object sits among the line's columns (-1: not there) */
  function flatIndex(model, col) {
    let n = 0, at = -1;
    model.syllables.forEach(sy => sy.cols.forEach(c => { if (c === col) at = n; n++; }));
    return at;
  }
  /* the stream item that holds a column (null for a gap) */
  function itemAt(line, stack) {
    const model = SW.score.readLine(line);
    const st = stream(model);
    const n = stacksOf(line).indexOf(stack);
    if (n < 0) return null;
    const firsts = [];
    model.syllables.forEach(sy => sy.cols.forEach(c => firsts.push(c)));
    const col = firsts[n];
    const it = st.items.find(x => x.cols.indexOf(col) !== -1) || null;
    return it ? { item: it, index: st.items.indexOf(it), model, stream: st, col } : { item: null, model, stream: st, col };
  }

  /* Pour new onsets into a line on the page, put the selection on the
     item asked for (or where it was), and make it one edit. `fixed`
     ({ index, cols }): that item's columns written as given when its
     onset is as long as they are. */
  function apply(line, ons, focusIndex, reason, fixed) {
    const model = SW.score.readLine(line);
    const res = pour(model, ons, fixed);
    const before = JSON.stringify(model.syllables);
    const after = JSON.stringify(res.model.syllables);
    if (before === after) return false;
    SW.score.replaceLine(line, res.model);
    const items = res.stream.items;
    const it = items[Math.max(0, Math.min(items.length - 1, focusIndex || 0))];
    const n = it && res.firstCol.has(it) ? res.firstCol.get(it) : 0;
    const stack = stacksOf(line)[n] || stacksOf(line)[0];
    const note = stack && stack.querySelector('.note');
    if (note) SW.score.setNoteAsActive(note, false);
    SW.score.changed(reason || 'rhythm');
    return true;
  }

  /* ================= THE EDIT BOX, THE CIRCLES' WAY (2026-10-26) =================
     The value circles, Dotted, Tie, Rest and Fill bar used to rewrite one
     column and slide every column after it — an eighth taken off a note
     put every later note on the off-beat and tied it over every bar line
     (the user: "it can destroy a simple song so quick"; a half note made
     here moved bar 2's eighths, made with the circles it did not). Now
     they are gestures on the line's cells, as the circles are: the column
     takes its length from where it starts and the grid of onsets after it
     STAYS — what it covers is absorbed, what it cuts into starts anew
     where it ends — and the melody pours (words and pitches move; the
     rhythm of the later beats does not; past the melody, R2).
       setLength(stack, ticks, block)  the column lasts `ticks` (a block: the beat)
       writeValue(stack, v)            the column's value (null: a block)
       tie(stack)                      the note goes on an eighth, written as a tie
       untie(stack)                    the held part after the column goes quiet (⛓ apart)
       insertRest(stack, v)            a rest that long right after the column
       fillBar()                       the selected note to the bar line
     One changed() each; the selection stays on the note (on the rest, for
     insertRest). Inside a tie chain a column's OWN piece is what changes. */
  function cellEdit(stack) {
    const line = lineEl(stack);
    if (!line) return null;
    const model = SW.score.readLine(line);
    const n = stacksOf(line).indexOf(stack);
    const at = n >= 0 ? flatAt(model, n) : null;
    if (!at) return null;
    const col = model.syllables[at.si].cols[at.ci];
    const cs = cellsOf(model);
    const item = cs.st.items.find(x => x.cols.indexOf(col) !== -1) || null;
    const gap = item ? null : cs.st.gaps.find(g => g.col === col) || null;
    if (!item && !gap) return null;
    let start = item ? item.start : gap.start;
    if (item) for (const c of item.cols) { if (c === col) break; start += colTicks(c); }
    return { line, model, cells: cs.cells.slice(), item, gap, n, col, st: cs.st, shift: cs.shift,
             s: start / CELL, own: colTicks(col) / CELL, chained: !!(item && item.cols[0] !== col),
             index: item ? cs.st.items.indexOf(item) : -1 };
  }
  /* cells [s, s+len) become one span of `kind` ('sound' | 'block' | 'rest' |
     'silent'; `chained`: it carries the sound before it on); at s+len what
     it cut into starts anew */
  function lay(cells, s, len, kind, chained, base) {
    while (cells.length < s + len) cells.push({ t: 'fill' });
    for (let i = s; i < s + len; i++) {
      const first = i === s && !chained;
      const t = kind === 'sound' ? (first ? 'on' : 'hold') : kind === 'block' ? (first ? 'bon' : 'bhold') : (first ? 'reston' : 'rest');
      cells[i] = { t, on: base.on, item: kind === 'rest' ? null : base.item, silent: kind === 'silent' };
    }
    const e = s + len;
    if (e < cells.length) {
      const t = cells[e].t;
      if (t === 'hold') setT(cells, e, 'on');
      else if (t === 'bhold') setT(cells, e, 'bon');
      else if (t === 'rest') setT(cells, e, 'reston');
    }
    return cells;
  }
  function pourEdit(ed, cells, reason, fixed, keepTail) {
    const ons = onsetsFromCells(cells, keepTail ? null : { bar: meter().barTicks, shift: ed.shift });
    const focus = ed.index >= 0 ? ed.index : Math.max(0, ed.st.items.filter(it => it.start < ed.s * CELL).length - 1);
    return apply(ed.line, ons, focus, reason || 'value', fixed);
  }
  function selectAt(line, n) {
    const st = stacksOf(line)[n];
    const note = st && st.querySelector('.note');
    if (note) SW.score.setNoteAsActive(note, false);
  }
  function setLength(stack, ticks, block, reason) {
    const ed = cellEdit(stack);
    if (!ed) return false;
    const len = (block ? blockTicks() : ticks) / CELL;
    if (len === ed.own && !!block === !ed.col.v) return false;               // as it is
    const kind = ed.gap ? 'rest' : ed.item.rest ? 'silent' : block ? 'block' : 'sound';
    const cells = lay(ed.cells, ed.s, len, kind, ed.chained, ed.cells[ed.s]);
    if (!pourEdit(ed, cells, reason)) return false;
    if (ed.gap) selectAt(ed.line, ed.n);                                      // the rest written, not the note before it
    return true;
  }
  function writeValue(stack, v) {
    const block = !v || !V.isValid(v);
    return setLength(stack, block ? 0 : V.byId(v).ticks, block, 'value');
  }
  /* the note goes on for an eighth (or the nearest length Layout settings
     offer), written as a tie: its chain, the last column tied into a new one */
  function tie(stack) {
    const ed = cellEdit(stack);
    if (!ed || !ed.item || ed.item.rest || ed.item.block) return false;
    const vals = allowed() || V.LIST.map(x => x.id);
    const id = vals.indexOf('e') !== -1 ? 'e'
      : vals.slice().sort((a, b) => Math.abs(V.byId(a).ticks - 12) - Math.abs(V.byId(b).ticks - 12))[0];
    if (!id) return false;
    const endCell = (ed.item.start + ed.item.ticks) / CELL;
    const cells = lay(ed.cells, endCell, V.byId(id).ticks / CELL, 'sound', true, ed.cells[ed.s]);
    const cols = ed.item.cols.map(c => clone(c));
    cols[cols.length - 1].tie = true;
    cols.push({ v: id, notes: clone(cols[cols.length - 1].notes) });
    return pourEdit(ed, cells, 'tie', { index: ed.index, cols });
  }
  /* the held part after this column goes quiet — as ⛓ parts two beats */
  function untie(stack) {
    const ed = cellEdit(stack);
    if (!ed || !ed.item) return false;
    const e = ed.s + ed.own, end = (ed.item.start + ed.item.ticks) / CELL;
    if (e >= end) return false;
    const cells = ed.cells;
    for (let i = e; i < end; i++) cells[i] = { t: i === e ? 'reston' : 'rest', on: cells[i].on, item: null, silent: false };
    return pourEdit(ed, cells, 'tie');
  }
  /* a rest `v` long right after the column: what it cuts into starts anew
     after it (kept even at the line's end — the user asked for it) */
  function insertRest(stack, v) {
    const ed = cellEdit(stack);
    if (!ed || !V.isValid(v)) return false;
    const cells = lay(ed.cells, ed.s + ed.own, V.byId(v).ticks / CELL, 'rest', false, ed.cells[ed.s]);
    if (!pourEdit(ed, cells, 'rest', null, true)) return false;
    selectAt(ed.line, ed.n + 1);
    return true;
  }

  /* ================= FILL BAR =================
     The selected note runs on to the bar line after the beat it starts
     on: longer when the bar has room left, shorter when it crosses the
     line — the later beats stay where they are (above). */
  function selected() {
    const note = SW.score.getActiveNote();
    const stack = note && note.closest('.harmony-stack');
    const line = lineEl(stack);
    return line ? { note, stack, line } : null;
  }
  function fillState() {
    const sel = selected();
    if (!sel || !S.editing) return { can: false, why: 'none' };
    const ed = cellEdit(sel.stack);
    if (!ed || !ed.item) return { can: false, why: 'rhythm' };
    const mt = meter();
    const pos = ed.s * CELL + ed.shift;
    const end = (Math.floor(pos / mt.barTicks) + 1) * mt.barTicks - ed.shift;
    const ticks = end - ed.s * CELL;
    if (ed.item.block) return { can: true, ticks, why: 'block' };
    if (ticks === ed.own * CELL) return { can: false, why: 'fits', ticks };
    return { can: true, ticks, why: ticks > ed.own * CELL ? 'grow' : 'shrink' };
  }
  function fillBar() {
    if (!S.editing || !SW.settings.can('values')) return false;
    const fs = fillState();
    if (!fs.can) {
      if (fs.why === 'fits') SW.ui.toast('This note already ends on the bar line');
      return false;
    }
    const sel = selected();
    return setLength(sel.stack, fs.ticks, false, 'value');
  }

  /* ================= TAP IT IN (P3) =================
     Play the line with → (or Space, Enter, or the big pad on a touch
     screen) in the rhythm in your head: from the selected note to the end
     of its line, one press per note, to a count-in and the steady beat.
     Key down is where the note starts, key up where it stops; a note let
     go early leaves a rest. The taps are snapped to the grid (eighths,
     or sixteenths with Detailed on) and laid on the line's cells, as
     every gesture is (2026-10-26): the take replaces the time from the
     first note to where the last tap ends, what it cuts into starts anew
     there, and the beats after it stay where they are (until then they
     slid along behind the take). The melody pours into the result — so
     the staff shows it at once; Keep it, try Again, or Cancel (Undo).
     Words and pitches are never touched: this is time only. */
  const tap = (function () {
    const panel = document.getElementById('tap-panel');
    let run = null;              // the take in progress
    let lastTake = null;         // { line, index } for Again
    let lastRun = null;          // the finished take, for Snap to (re-snapped without tapping again)
    const $ = sel => panel && panel.querySelector(sel);

    function say(kind, text) {
      if (!panel) return;
      panel.dataset.state = kind;
      const t = $('.tap-text');
      if (t) t.textContent = text;
    }
    function show(on) {
      if (!panel) return;
      panel.hidden = !on;
      document.body.classList.toggle('tapping', !!on);
    }
    function detail() {
      return !!(SW.settings && SW.settings.view && SW.settings.view.tapDetail);
    }

    async function start(again) {
      if (run) return;
      if (!S.editing || !SW.settings.can('values')) return;
      if (S.playing) SW.player.stop();
      let line, index;
      if (again && lastTake && lineAt(lastTake.lineIndex)) { line = lineAt(lastTake.lineIndex); index = lastTake.index; }
      else {
        const sel = selected();
        if (!sel) { SW.ui.toast('Select the note to start from'); return; }
        const at = itemAt(sel.line, sel.stack);
        if (!at || !at.item) { SW.ui.toast('Select a note (not a rest) to start from'); return; }
        line = sel.line;
        index = at.index;
      }
      const model = SW.score.readLine(line);
      const st = stream(model);
      const todo = st.items.slice(index).filter(it => !it.rest);
      if (!todo.length) { SW.ui.toast('Nothing to tap from here'); return; }
      lastTake = { lineIndex: lineIndexOf(line), index };

      const mt = meter();
      const shift = shiftOf(model);
      const S0 = st.items[index].start;
      const beat0 = Math.floor((S0 + shift) / mt.beatTicks) * mt.beatTicks - shift;    // the beat the take begins on
      const ac = SW.audio.context();
      const secPerTick = SW.timing.tickMs() / 1000;
      const beatSec = mt.beatTicks * secPerTick;
      const count = mt.beats;
      show(true);
      say('ready', 'Get ready…');
      if (window.EVMCountIn) EVMCountIn.open(count, mt.beats);
      const primed = window.EVMCountIn ? await EVMCountIn.prime(ac, { warm: 0.35 }) : true;
      if (!primed) { finish(false); SW.ui.toast('The sound would not start — try again'); return; }
      const from = ac.currentTime + 0.12;
      const times = [];
      for (let i = 0; i < count; i++) {
        SW.audio.click(from + i * beatSec, i === 0, false);
        if (window.EVMCountIn) times.push(EVMCountIn.heardAt(ac, from + i * beatSec));
      }
      const t0 = from + count * beatSec;                    // where beat0 is heard
      if (window.EVMCountIn) EVMCountIn.run(times, EVMCountIn.heardAt(ac, t0));
      run = { line, index, model, st, todo, shift, mt, beat0, S0, t0, secPerTick, beatSec, taps: [], held: null, voice: [], clickAt: t0, timer: 0, ac };
      // the steady beat goes on under the take (accent on each bar's 1)
      const tick = () => {
        if (!run) return;
        const ahead = run.ac.currentTime + 0.25;
        while (run.clickAt < ahead) {
          const beatTicks = run.beat0 + Math.round((run.clickAt - run.t0) / run.beatSec) * mt.beatTicks;
          const strong = ((beatTicks + run.shift) % mt.barTicks + mt.barTicks) % mt.barTicks === 0;
          SW.audio.click(run.clickAt, strong, true);
          run.clickAt += run.beatSec;
        }
        // a take that has gone quiet for two bars ends itself
        const lastAt = run.taps.length ? run.taps[run.taps.length - 1].on : run.t0;
        if (!run.held && run.ac.currentTime - lastAt > 2 * mt.beats * run.beatSec + (run.taps.length ? 0 : 2 * mt.beats * run.beatSec)) { finish(true); return; }
        run.timer = setTimeout(tick, 60);
      };
      tick();
      say('go', 'Tap → for each note (' + todo.length + ')');
      const first = firstStackOf(line, todo[0]);
      if (first) SW.score.setNoteAsActive(first.querySelector('.note'), false);
    }

    // the page's column for an item of the take (the line is untouched
    // until the take ends, so the model read at the start still matches it)
    function firstStackOf(line, item) {
      const model = run ? run.model : SW.score.readLine(line);
      const n = flatIndex(model, item.cols[0]);
      return n >= 0 ? stacksOf(line)[n] || null : null;
    }

    function down() {
      if (!run || run.held) return;
      const now = run.ac.currentTime;
      if (now < run.t0 - run.beatSec / 2) return;            // still counting in
      const n = run.taps.length;
      if (n >= run.todo.length) return;
      const it = run.todo[n];
      run.held = { on: now, off: null };
      run.taps.push(run.held);
      // sound it, as long as it is held
      const stack = firstStackOf(run.line, it);
      if (stack) {
        SW.score.setNoteAsActive(stack.querySelector('.note'), false);
        run.voice = Array.from(stack.querySelectorAll('.note')).filter(x => !x.classList.contains('rest-note'))
          .map(x => SW.audio.noteOn(SW.music.noteMidi(SW.music.noteClassOf(x) || 'do', SW.score.getAccidentalFromNote(x))));
      }
      say('go', (n + 1) + ' of ' + run.todo.length);
    }
    function up() {
      if (!run || !run.held) return;
      run.held.off = run.ac.currentTime;
      run.held = null;
      run.voice.forEach(id => SW.audio.noteOff(id));
      run.voice = [];
      if (run.taps.length >= run.todo.length) finish(true);
    }

    /* The taps → onsets for the whole line, through the cells. Before
       the take: as it was. The take: snapped to the grid; a note let go
       early by half its gap (and at least one grid step) leaves a rest;
       a rest with a word keeps its place in the stream. After the take:
       as it was — what the take cut into starts anew where it ends. */
    function onsetsFromTake(r) {
      const g = detail() ? 6 : 12;
      const cs = cellsOf(r.model);
      const cells = cs.cells.slice();
      const toTick = sec => r.beat0 + Math.round((sec - r.t0) / r.secPerTick / g) * g;
      const taps = r.taps.filter(t => t.off !== null || t === r.taps[r.taps.length - 1]);
      const q = [];
      taps.forEach((t, i) => {
        let at = Math.max(r.S0, toTick(t.on));
        if (i && at <= q[i - 1].at) at = q[i - 1].at + g;
        const off = t.off === null ? at + g * 2 : Math.max(at + g, toTick(t.off));
        // how early it was let go before the next press, in ticks, from the real times
        // (a detached note is not a rest: only a clear silence counts)
        const nx = taps[i + 1];
        const early = nx && t.off !== null ? (nx.on - t.off) / r.secPerTick : 0;
        q.push({ at, off, early });
      });
      // cells [from, to) ticks become one span: a sound, a silence, or a word's own rest
      const put = (from, to, kind, item) => {
        const a = from / CELL, b = to / CELL;
        while (cells.length < b) cells.push({ t: 'fill' });
        const on = item ? cs.ons.find(o => o.item === item) || null : null;
        for (let c = a; c < b; c++) {
          const first = c === a;
          cells[c] = { t: kind === 'sound' ? (first ? 'on' : 'hold') : (first ? 'reston' : 'rest'), on, item: item || null, silent: kind === 'silent' };
        }
      };
      let cursor = r.S0;
      let qi = 0;
      // the take's items, in the order the stream holds them (cs reads the same model as r.st)
      r.st.items.slice(r.index).forEach((it, k) => {
        if (qi >= q.length) return;
        const item = cs.st.items[r.index + k];
        if (it.rest) { put(cursor, cursor + g, 'silent', item); cursor += g; return; }
        const t = q[qi], nx = q[qi + 1];
        put(cursor, t.at, 'rest');
        const nextAt = nx ? nx.at : null;
        let len;
        if (nextAt === null) len = t.off - t.at;
        else {
          const gap = nextAt - t.at;
          len = (t.early >= Math.max(g, gap / 2) && t.off < nextAt) ? t.off - t.at : gap;
        }
        len = Math.max(g, len);
        put(t.at, t.at + len, 'sound', item);
        cursor = t.at + len;
        if (nextAt !== null) { put(cursor, nextAt, 'rest'); cursor = Math.max(cursor, nextAt); }
        qi++;
      });
      // where the take ends, what it cut into starts anew; the beats after it stay where they are
      const e = cursor / CELL;
      if (e < cells.length) {
        const t = cells[e].t;
        if (t === 'hold') setT(cells, e, 'on');
        else if (t === 'bhold') setT(cells, e, 'bon');
        else if (t === 'rest') setT(cells, e, 'reston');
      }
      return onsetsFromCells(cells, { bar: cs.mt.barTicks, shift: cs.shift });
    }

    function finish(keep) {
      if (!run) { show(false); return; }
      const r = run;
      run = null;
      clearTimeout(r.timer);
      r.voice.forEach(id => SW.audio.noteOff(id));
      if (window.EVMCountIn) EVMCountIn.close();
      if (!keep || !r.taps.length) { show(false); if (keep) SW.ui.toast('No taps — nothing changed'); return; }
      const ons = onsetsFromTake(r);
      lastRun = Object.assign(r, { lineIndex: lineIndexOf(r.line) });
      const changedIt = apply(r.line, ons, r.index, 'rhythm');
      say('done', changedIt ? 'Here it is — keep it?' : 'The same rhythm as before');
      show(true);
    }

    function keep() { if (run) finish(true); show(false); }
    function cancel() {
      if (run) { finish(false); return; }
      show(false);
      if (panel && panel.dataset.state === 'done' && SW.history && SW.history.canUndo()) SW.history.undo();
    }
    function againNow() {
      if (run) finish(false);
      if (panel && panel.dataset.state === 'done' && SW.history && SW.history.canUndo()) SW.history.undo();
      start(true);
    }

    // keys: → Space Enter tap; Esc cancels. Taken before the page's own keys.
    const TAP_KEYS = { ArrowRight: 1, ' ': 1, Enter: 1 };
    window.addEventListener('keydown', e => {
      if (!run) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); cancel(); return; }
      if (TAP_KEYS[e.key]) { e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) down(); }
      else if (!e.metaKey && !e.ctrlKey) { e.stopImmediatePropagation(); }
    }, true);
    window.addEventListener('keyup', e => {
      if (!run) return;
      if (TAP_KEYS[e.key]) { e.preventDefault(); e.stopImmediatePropagation(); up(); }
    }, true);
    if (panel) {
      const pad = $('.tap-pad');
      if (pad) {
        pad.addEventListener('pointerdown', e => { e.preventDefault(); try { pad.setPointerCapture(e.pointerId); } catch (err) {} down(); });
        pad.addEventListener('pointerup', e => { e.preventDefault(); up(); });
        pad.addEventListener('pointercancel', () => up());
      }
      panel.addEventListener('mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
      const on = (sel, fn) => { const b = $(sel); if (b) b.addEventListener('click', e => { e.stopPropagation(); fn(); }); };
      on('.tap-keep', keep);
      on('.tap-again', againNow);
      on('.tap-cancel', cancel);
      on('.tap-stop', () => finish(true));
    }
    /* Snap to: eighths or sixteenths. After a take, the same taps are
       snapped again (the take is undone and poured anew). */
    function syncSnap() {
      if (!panel) return;
      panel.querySelectorAll('[data-snap]').forEach(b => b.classList.toggle('active', (b.dataset.snap === 's') === detail()));
    }
    function setSnap(sixteenths) {
      if (sixteenths === detail()) return;
      SW.settings.setView({ tapDetail: sixteenths }, { quiet: true });
      syncSnap();
      if (!run && lastRun && panel && panel.dataset.state === 'done' && lineAt(lastRun.lineIndex)) {
        if (SW.history && SW.history.canUndo()) SW.history.undo();
        // the line is as it was before the take (Undo drew it anew): read it again for the pour
        const line = lineAt(lastRun.lineIndex);
        const r = Object.assign({}, lastRun, { line, model: SW.score.readLine(line) });
        r.st = stream(r.model);
        const changedIt = apply(r.line, onsetsFromTake(r), r.index, 'rhythm');
        say('done', changedIt ? 'Snapped to ' + (sixteenths ? 'sixteenths' : 'eighths') + ' — keep it?' : 'The same rhythm as before');
      }
    }
    if (panel) panel.querySelectorAll('[data-snap]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); setSnap(b.dataset.snap === 's'); }));
    syncSnap();
    SW.bus.on('mode:changed', () => { if (!S.editing) { if (run) finish(false); show(false); } });
    // a song opened ends a take (Undo's redraw is not a song opened)
    SW.bus.on('score:loaded', () => {
      if (SW.history && SW.history.isRestoring()) return;
      if (run) finish(false);
      show(false);
      lastTake = null;
      lastRun = null;
    });

    return { start, keep, cancel, again: againNow, active: () => !!run, onsetsFromTake, finish };
  })();

  /* ================= CELLS (the beat strip, P4) =================
     A line's time in sixteenths (6 ticks): each cell is one of
       on / hold        a sound starts here / goes on
       bon / bhold      a block (one beat, rhythm undecided) starts / goes on
       reston / rest    a silence starts here / goes on
       fill             after the line's music, to the end of its bar
     A rest the user put a WORD on (a silent item) is rest cells too
     (`silent`, carrying its item): it looks and reads as the silence it
     is, and its word sits under it; the page makes it a note again when
     its first cell is tapped (score.js unrestColumn), as a rest cannot
     be poured into.
     Every gesture is TIME-ALIGNED: it changes only the cells of its own
     beat (or the two beats it joins), so the rest of the line keeps its
     rhythm; then the melody is poured into the new onsets (Rhythm
     Poetry's EASY path — not its +/− stream shift, which moved every
     later beat). */
  const CELL = 6;
  function cellsOf(lineModel) {
    const st = stream(lineModel);
    const ons = onsets(lineModel, st);
    const mt = meter();
    const shift = shiftOf(lineModel);
    const total = ons.reduce((a, o) => Math.max(a, o.start + o.ticks), 0);
    const end = total + (((-(total + shift)) % mt.barTicks) + mt.barTicks) % mt.barTicks;
    const cells = [];
    for (let i = 0; i < end / CELL; i++) cells.push({ t: 'fill' });
    ons.forEach(o => {
      const a = o.start / CELL, m = o.ticks / CELL;
      for (let i = 0; i < m; i++) {
        const t = (o.rest || o.silent) ? (i ? 'rest' : 'reston') : o.block ? (i ? 'bhold' : 'bon') : (i ? 'hold' : 'on');
        cells[a + i] = { t, on: o, silent: !!o.silent, item: o.item || null };
      }
    });
    return { cells, ons, st, total, end, shift, mt };
  }
  const START = { on: 1, bon: 1, reston: 1 };
  const SOUND = { on: 1, hold: 1 };
  /* Cells → onsets. Silence runs together (two rest cells that each
     began are one rest — print spells it); a worded rest's cells are its
     own onset (silent, not a rest: its item is poured into it). With
     `opts` { bar, shift } (ticks), the silence after the line's last
     sound inside that sound's bar is not written — the line ends with
     its last note (R2) and the staff finishes the bar; whole bars of
     silence after it stay (an empty bar put in with +). */
  function onsetsFromCells(cells, opts) {
    let last = cells.length - 1;
    while (last >= 0 && cells[last].t === 'fill') last--;
    const out = [];
    let cur = null;
    const RESTY = { rest: 1, reston: 1, fill: 1 };
    for (let i = 0; i <= last; i++) {
      const c = cells[i];
      const t = c.t;
      const kind = (t === 'on' || t === 'hold') ? 'sound' : (t === 'bon' || t === 'bhold') ? 'block' : (c.silent && t !== 'fill') ? 'silent' : 'rest';
      const starts = START[t] && !(kind === 'rest' && cur && cur.kind === 'rest');
      const fits = cur && !starts && cur.kind === kind && !(kind === 'block' && cur.ticks >= blockTicks());
      if (fits) { cur.ticks += CELL; continue; }
      cur = { start: i * CELL, ticks: CELL, rest: kind === 'rest', block: kind === 'block', kind };
      if (kind === 'silent') { cur.silent = true; cur.blockItem = !!(c.on && c.on.block); }
      out.push(cur);
    }
    out.forEach(o => {
      // a block is a beat: a cut one is written as what is left of it
      if (o.block && o.ticks !== blockTicks()) o.block = false;
      if (o.silent && o.blockItem && o.ticks === blockTicks()) o.block = true;
      delete o.kind; delete o.blockItem;
    });
    if (opts && opts.bar) {
      let L = -1;
      out.forEach((o, i) => { if (!o.rest) L = i; });
      if (L >= 0) {
        const end = out[L].start + out[L].ticks;
        const shift = opts.shift || 0;
        const barEnd = Math.ceil((end + shift) / opts.bar) * opts.bar - shift;
        for (let i = out.length - 1; i > L; i--) {
          const o = out[i];
          if (o.start >= barEnd) continue;
          if (o.start + o.ticks <= barEnd) out.splice(i, 1);
          else { o.ticks -= barEnd - o.start; o.start = barEnd; }
        }
      }
    }
    return out;
  }
  /* Does a note of the melody start at cell i or after it — is there a
     pitch left for a note started at i? (R2: when not, a tap on silence
     cannot start one.) */
  function noteLeft(cells, i) {
    return cells.some((c, j) => j >= i && c.item && c.on && c.on.start === j * CELL);
  }
  /* a block under cell i becomes a written quarter (so a tap can cut it) */
  function writeBlockAt(cells, i) {
    if (cells[i].t !== 'bon' && cells[i].t !== 'bhold') return;
    let a = i;
    while (a > 0 && cells[a].t === 'bhold') a--;
    cells[a] = Object.assign({}, cells[a], { t: 'on' });
    for (let j = a + 1; j < cells.length && cells[j].t === 'bhold'; j++) cells[j] = Object.assign({}, cells[j], { t: 'hold' });
  }
  const setT = (cells, i, t) => { cells[i] = Object.assign({}, cells[i], { t }); };

  /* A dot tapped: cells [i, i+span) are the slot, inside the beat [b0, b1). */
  function tapSlot(cells, i, span, b0, b1) {
    cells = cells.slice();
    const wasBlock = cells[i].t === 'bon' || cells[i].t === 'bhold';
    writeBlockAt(cells, i);
    if (wasBlock && i === b0) return cells;                      // the block is written as it was: a quarter
    const t = cells[i].t;
    const prevSound = i > b0 && SOUND[cells[i - 1].t];
    if (t === 'on') {
      // off: the note before holds on (inside the beat), else a silence
      if (prevSound) setT(cells, i, 'hold');
      else {
        setT(cells, i, 'reston');
        for (let j = i + 1; j < cells.length && cells[j].t === 'hold'; j++) setT(cells, j, 'rest');
      }
    } else if (t === 'hold') {
      setT(cells, i, 'on');                                       // a new note: the next pitch comes in
    } else if (!noteLeft(cells, i)) {
      // past the melody's last note no note can start (R2). Right after
      // that note, the time is the note's: it goes on through the slot
      // to the end of its beat (the user, 2026-10-25: the extra time
      // belongs to the note before). Elsewhere nothing changes, and the
      // page says why.
      if (!(i > 0 && SOUND[cells[i - 1].t])) return cells;
      let j = i;
      for (; j < b1 && (cells[j].t === 'rest' || cells[j].t === 'reston' || cells[j].t === 'fill'); j++) setT(cells, j, 'hold');
      if (j < cells.length && cells[j].t === 'rest') setT(cells, j, 'reston');
      return cells;
    } else {
      // a silence (or the end of the line) becomes a note, held to its beat's end
      setT(cells, i, 'on');
      let j = i + 1;
      for (; j < b1 && (cells[j].t === 'rest' || cells[j].t === 'fill'); j++) setT(cells, j, 'hold');
      if (j < cells.length && cells[j].t === 'rest') setT(cells, j, 'reston');
      // a silence that had begun before it keeps its own start
    }
    for (let j = i + 1; j < i + span && j < b1; j++) {
      // a slot is one dot: anything finer inside it follows the dot
      if (cells[j].t === 'on' && cells[i].t !== 'reston') setT(cells, j, 'hold');
    }
    return cells;
  }
  /* Is the sound at the end of beat [b0,b1) carried over into the next? */
  function joined(cells, b1) {
    return b1 < cells.length && cells[b1].t === 'hold';
  }
  function canJoin(cells, b1) {
    return b1 > 0 && b1 < cells.length && (SOUND[cells[b1 - 1].t] || cells[b1 - 1].t === 'bon' || cells[b1 - 1].t === 'bhold');
  }
  function toggleJoin(cells, b1, b2) {
    cells = cells.slice();
    if (joined(cells, b1)) {
      // apart: what was carried over becomes a silence
      setT(cells, b1, 'reston');
      for (let j = b1 + 1; j < cells.length && cells[j].t === 'hold'; j++) setT(cells, j, 'rest');
      return cells;
    }
    if (!canJoin(cells, b1)) return cells;
    writeBlockAt(cells, b1 - 1);
    writeBlockAt(cells, b1);
    // together: the sound goes on through the next beat's opening (a note
    // there is taken in — its pitch moves on to the next note — and a
    // silence there is filled)
    setT(cells, b1, 'hold');
    for (let j = b1 + 1; j < b2 && (cells[j].t === 'rest' || cells[j].t === 'fill'); j++) setT(cells, j, 'hold');
    return cells;
  }
  /* − on a beat: every sixteenth boundary moves onto the eighth before it */
  function coarsen(cells, b0, b1) {
    cells = cells.slice();
    for (let o = b0 + 1; o < b1; o += 2) {
      const e = o - 1;
      const t = cells[o].t;
      if (t !== 'on' && t !== 'reston') continue;
      if (START[cells[e].t]) setT(cells, o, SOUND[cells[e].t] || cells[e].t === 'bon' ? 'hold' : 'rest');
      else { setT(cells, e, t); setT(cells, o, t === 'on' ? 'hold' : 'rest'); }
    }
    return cells;
  }
  function needsSixteenths(cells, b0, b1) {
    for (let o = b0 + 1; o < b1; o += 2) if (cells[o] && START[cells[o].t]) return true;
    return false;
  }
  /* EASY: a whole rhythm written over beats [b0, b0 + n·beat): `pattern`
     a string of X (a note starts), O (held) and R (silent), one per
     cell; or a rest of the same length when `rest` */
  function writePattern(cells, b0, pattern, rest) {
    cells = cells.slice();
    while (cells.length < b0 + pattern.length) cells.push({ t: 'fill' });
    for (let j = 0; j < pattern.length; j++) {
      const c = b0 + j;
      writeBlockAt(cells, c);
      const ch = rest ? 'R' : pattern[j];
      const restStarts = j === 0 || (rest ? false : pattern[j - 1] !== 'R');
      setT(cells, c, ch === 'X' ? 'on' : ch === 'O' ? 'hold' : restStarts ? 'reston' : 'rest');
    }
    // what comes after: a sound that was held into it from before is cut off cleanly
    const after = b0 + pattern.length;
    if (after < cells.length && cells[after].t === 'hold') setT(cells, after, 'on');
    if (after < cells.length && cells[after].t === 'rest') setT(cells, after, 'reston');
    if (after < cells.length && cells[after].t === 'bhold') writeBlockAt(cells, after);
    return cells;
  }
  /* Pour cells into a line on the page; the selection goes to the note
     that now starts at cell `focus` (or the one sounding there). */
  function applyCells(line, cells, focus) {
    const model0 = SW.score.readLine(line);
    const ons = onsetsFromCells(cells, { bar: meter().barTicks, shift: shiftOf(model0) });
    let k = 0;
    for (const o of ons) {
      if (o.start >= (focus || 0) * CELL) break;
      if (!o.rest) k++;
    }
    const st = stream(model0);
    const at = ons.find(o => o.start === (focus || 0) * CELL);
    if (!(at && !at.rest)) k = Math.max(0, k - 1);
    return apply(line, ons, Math.min(k, st.items.length - 1), 'rhythm');
  }
  /* the page's column (harmony-stack) for a column object of `model`, the
     model the line was last read as */
  function stackAt(line, model, col) {
    const n = flatIndex(model, col);
    return n >= 0 ? stacksOf(line)[n] || null : null;
  }

  /* ================= DRAWN PIECES, MADE REAL (2.5) =================
     The staff draws two things no column stands for (staff.js P1): the
     PIECES of a note that crosses a bar line (a half on beat 4 → ♩ ⁀ ♩)
     and the FILLERS, the rests that finish a line's last bar. Everything
     drawn must be selectable and changeable (the user's rule), so:
       • selecting one (a tap on it, or ← → in Edit) REALIZES it: the
         note becomes the tied columns it is drawn as (the rest, rest
         columns; the fillers, wordless rest columns after the line's
         last note) — it looks and sounds exactly the same — and the
         piece asked for is selected
       • an EDIT then keeps it (any score:changed); Undo takes the edit
         and the split back together (the split itself is not a step)
       • moving on WITHOUT an edit folds it back, so looking round never
         changes the song
     ================================================================== */
  let pending = null;            // { lineIndex, before (model JSON), after, at, added }
  let reverting = false;

  /* the pieces drawn for a column, in the staff's order: its own split
     (after the first) and then, on a line's last column, the fillers */
  function piecesOf(stack) {
    const line = lineEl(stack);
    if (!line || !line.classList.contains('has-staff')) return { list: [], split: [], fills: [] };
    const le = SW.timing.lineEvents(line);
    const ev = le.events.find(e => e.stack === stack);
    if (!ev || !ev.notated) return { list: [], split: [], fills: [] };
    const split = SW.timing.barPieces(ev, le) || [];
    const fills = ev === le.events[le.events.length - 1] ? SW.timing.fillPieces(le) : [];
    const list = split.slice(1).map(p => Object.assign({ filler: false }, p)).concat(fills.map(p => Object.assign({ filler: true }, p)));
    return { list, split, fills, ev, le, line };
  }
  function flatAt(model, n) {
    let k = 0;
    for (let si = 0; si < model.syllables.length; si++) {
      const cols = model.syllables[si].cols;
      if (n < k + cols.length) return { si, ci: n - k };
      k += cols.length;
    }
    return null;
  }

  /* Make piece `k` of a column real; returns the column now standing for it. */
  function realize(stack, k) {
    if (!S.editing) return null;
    let line = lineEl(stack);
    if (!line) return null;
    const lineIndex = lineIndexOf(line);
    let n = stacksOf(line).indexOf(stack);
    // one at a time: an earlier, unedited one folds back first
    if (pending) {
      const adj = revert();
      if (adj && adj.lineIndex === lineIndex) n = adj.map(n);
      line = lineAt(lineIndex);
      stack = stacksOf(line)[n];
      if (!stack) return null;
    }
    const pc = piecesOf(stack);
    const want = pc.list[k];
    if (!want) return null;
    const model = SW.score.readLine(line);
    const before = JSON.stringify(model);
    const at = flatAt(model, n);
    const sy = model.syllables[at.si];
    const col = sy.cols[at.ci];
    let added, target;
    if (!want.filler) {
      // the note as the tied notes it is drawn as
      const parts = pc.split.map((p, j) => {
        const c = clone(col);
        c.v = p.id;
        if (!pc.ev.rest && (j < pc.split.length - 1 || col.tie)) c.tie = true; else delete c.tie;
        return c;
      });
      sy.cols.splice(at.ci, 1, ...parts);
      added = parts.length - 1;
      target = n + 1 + k;
    } else {
      // the rests that finish the bar, as rest columns on the last word
      const pitch = col.notes.filter(x => !x.rest);
      const notes = (pitch.length ? pitch : col.notes).map(x => { const m = clone(x); m.rest = true; delete m.alt; delete m.step; return m; });
      const rests = pc.fills.map(p => ({ v: p.id, notes: clone(notes) }));
      sy.cols.splice(at.ci + 1, 0, ...rests);
      added = rests.length;
      target = n + 1 + (k - (pc.split.length ? pc.split.length - 1 : 0));
    }
    SW.score.replaceLine(line, model);
    pending = { lineIndex, before, after: JSON.stringify(SW.score.readLine(line)), at: n, added };
    return stacksOf(line)[target] || null;
  }

  /* Fold an unedited realized piece back. Returns how a column index in
     that line moves ({ lineIndex, map(n) }), or null. */
  function revert() {
    const p = pending;
    pending = null;
    if (!p) return null;
    const line = lineAt(p.lineIndex);
    if (!line || JSON.stringify(SW.score.readLine(line)) !== p.after) return null;   // edited since: it stays
    reverting = true;
    try { SW.score.replaceLine(line, JSON.parse(p.before)); } finally { reverting = false; }
    return {
      lineIndex: p.lineIndex,
      map: n => n <= p.at ? n : n <= p.at + p.added ? p.at : n - p.added
    };
  }
  const inPending = (line, n) => pending && lineIndexOf(line) === pending.lineIndex && n >= pending.at && n <= pending.at + pending.added;

  // moving the selection off a realized piece (not onto another part of it) folds it back
  SW.bus.on('selection', d => {
    if (!pending || reverting) return;
    const stack = d && d.stack;
    const line = stack && lineEl(stack);
    if (line && inPending(line, stacksOf(line).indexOf(stack))) return;
    const li = line ? lineIndexOf(line) : -1;
    const n = line ? stacksOf(line).indexOf(stack) : -1;
    const noteIdx = stack ? Array.from(stack.querySelectorAll('.note')).indexOf(d.note) : 0;
    const adj = revert();
    if (!adj || adj.lineIndex !== li) { if (adj) SW.staff.schedule(); return; }
    // the selection was in the line that was redrawn: put it back on the same column
    const st = stacksOf(lineAt(li))[adj.map(n)];
    if (st) {
      reverting = true;
      try { SW.score.setNoteAsActive(st.querySelectorAll('.note')[Math.max(0, noteIdx)] || st.querySelector('.note'), false); }
      finally { reverting = false; }
    }
  });
  SW.bus.on('score:changed', () => { pending = null; });       // an edit keeps it
  SW.bus.on('score:loaded', () => { pending = null; });
  SW.bus.on('mode:changed', () => { if (!S.editing && pending) { revert(); SW.staff.schedule(); } });

  /* ← → in Edit step onto drawn pieces too: from a column into its first
     piece (→), or from the column after into the previous one's last (←).
     Returns the column to select, or null for the ordinary step. */
  function stepPiece(stack, dir) {
    if (!S.editing || !stack) return null;
    const line = lineEl(stack);
    if (!line) return null;
    const n = stacksOf(line).indexOf(stack);
    if (inPending(line, n)) {
      // inside a realized piece the columns are real: only its end can lead on into fillers
      return null;
    }
    if (dir > 0) {
      const pc = piecesOf(stack);
      return pc.list.length ? realize(stack, 0) : null;
    }
    const prev = stacksOf(line)[n - 1];
    if (!prev) return null;
    const pc = piecesOf(prev);
    if (!pc.list.length) return null;
    // ← lands on the last piece of the split (fillers come after the column, so they are reached with →)
    const last = pc.split.length > 1 ? pc.split.length - 2 : -1;
    return last >= 0 ? realize(prev, last) : null;
  }

  /* ================= THE CONTRACT =================
     Every line poured into its own onsets comes back unchanged. */
  function selfTest() {
    const bad = [];
    document.querySelectorAll('#score .notation-line').forEach((line, i) => {
      const m = SW.score.readLine(line);
      const res = pour(m, onsets(m));
      if (JSON.stringify(res.model) !== JSON.stringify(m)) bad.push(i);
    });
    return { ok: bad.length === 0, bad };
  }

  SW.flow = {
    stream, onsets, pour, apply, itemAt, fillState, fillBar, tap, selfTest, shiftOf,
    setLength, writeValue, tie, untie, insertRest,
    CELL, cellsOf, onsetsFromCells, noteLeft, tapSlot, joined, canJoin, toggleJoin, coarsen, needsSixteenths, writePattern, applyCells, stackAt,
    piecesOf, realize, stepPiece, pendingPiece: () => pending
  };
})();

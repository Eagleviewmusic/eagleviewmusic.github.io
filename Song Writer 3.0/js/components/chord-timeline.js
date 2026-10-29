/* ==========================================================================
   COMPONENT — the Time Line (the Chords window, 2026-10-29)
   --------------------------------------------------------------------------
   Phases 4 and 5 of ../Song Writer Chords Redesign/ (README §3.3, D13–D18,
   Y3, Y4). The song laid out in bars — its sections with their words and
   the melody's shape, the chords under them — and the chart's chords in a
   tray to drag on. Information by design: colour is a chord's root (a
   section's, its label), width how long it lasts, the orange line the
   point, a dot on the tab a draft.

     • A DRAFT, not the song (D13): every change here waits until Apply
       (or the question on the way out — D14). It is kept for the song
       (song_writer_30_chord_drafts_v1, { songId: { base, chords, items?,
       shape?, starts?, p0? } }) through a reload, until applied or started
       over; the Time Line tab wears a dot while one waits. `base` is what
       the song's chords sounded like when it was made: a song changed
       under a waiting draft asks once — My Time Line · The song as it is
       now.
     • SECTIONS (Phase 5, D16, Y3): a run of lines with the same label is
       one section (a line with no label, one of its own). A tap selects
       one (the point at its start); drag it — by its tab on a touch
       screen — and it moves a bar at a time with its chords: the ones
       after it move along when it pushes into them, and past the middle
       of a neighbour the two swap. Its tools: Copy (the clipboard card)
       · Repeat (a copy right after it) · Delete (empty bars where it was).
       EMPTY BARS before or between sections are a dashed Intro or
       Interlude — chords go in them as anywhere — and become an
       instrumental line in the song (Y4: `lines[].bars`, a row of chords
       in the music); a tap selects them, Delete takes the bars out.
     • THE TRAY: the chart's cards (the faded I IV V vi while it has fewer
       than four) — a tap hears one, a drag puts it on the chord row: on a
       chord's first beat it becomes that chord (its length and rhythm
       kept); anywhere else it starts on the beat and lasts to the next
       chord or the bar line (D17), struck once and held (D18). The
       CLIPBOARD CARD at its start is what Copy took — chords, or a
       section with its chords: drag it in, or tap it (at the point).
     • A CHORD: a tap selects it (⇧ along to it), hears it, and the point
       goes to its start; a drag moves it a beat at a time (⌥: a copy) —
       all the selected ones; the grips on the selected one stretch or
       shrink it a beat at a time, the chords beside it giving way; a
       double tap (or Enter): Focus on it — Save brings you back here, and
       Save as New swaps just this spot. Under the selection: Copy ·
       Repeat (a copy right after) · Delete (silence where it was).
     • THE RULER: a tap puts the point on a bar; a drag along it selects
       the chords in those bars.
     • ▶ plays the draft from the point — its sections in their new order
       (⟲ round the whole song); ↺ Start over goes back to the song as it
       is; Apply puts the draft in the song, one Undo step. With sections
       changed the way out asks Apply all · Chords only (the chords at
       their bars, the melody as it was — D15) · Not now. ⌘Z ⇧⌘Z (↶ ↷)
       undo the draft, a step at a time.
     • Keys: Space ▶ · ← → the chord (or section) before / after (nothing
       selected: the point a beat) · ⌥← ⌥→ the selection a beat (a
       section, a bar) · Delete · Enter Focus · ⌘C ⌘X ⌘V (at the point)
       ⌘D (Repeat) ⌘A.
   Listen only (D19): play, loop, the point, the tray's chords heard —
   nothing changes.

   API  SW.chordTimeline.render(body) · keyDown(e) · mustAsk() · leave(then) · waiting() ·
        undo() · redo() · canUndo() · canRedo() · closed()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const C = SW.chords;
  const T = SW.track;
  const ui = SW.ui;
  const sheetEl = document.getElementById('prog-sheet');
  const bodyEl = document.getElementById('pw-body');
  if (!C || !T || !sheetEl || !bodyEl || !T.flatOps) return;
  const esc = C.escapeHtml;
  const clone = x => JSON.parse(JSON.stringify(x));
  const mod = (a, b) => ((a % b) + b) % b;
  const F = T.flatOps;
  const DRAFT_KEY = 'song_writer_30_chord_drafts_v1';

  let D = null;          // the draft: { id (the song), base, chords: [pieces], items (null: the song's own sections), hist, fut, edited }
  let sel = [];          // the chords selected: where they start (ticks)
  let selSec = null;     // a section or empty bars selected: its item's id
  let anchor = null;     // ⇧-tap selects along from here
  let point = 0;         // ticks: where Paste goes in and ▶ starts
  let clip = null;       // what Copy took: { kind: 'chords', len, chords } | { kind: 'sec', label, src, len, chords, shape }
  let loopOn = false;
  let mine = false;      // the player is playing the draft for the Time Line
  let geo = null;        // as last drawn
  let press = null;      // a pointer held down
  let lastTap = null;    // { key, t }: a second tap soon after is a double tap
  let askAfter = null;   // a question to put once the page is drawn
  let raf = 0;
  let scrollTo = null;   // a tick to bring into view at the next draw
  let seq = 0;           // new items' ids
  let fresh0 = true;     // the page opened again: it scrolls to the point
  let reveal = null;     // a tick to scroll to at the next draw, only when it is out of sight (a section tapped)

  const readOnly = () => !SW.settings.can('chords');
  const active = () => !!D && SW.progWin && SW.progWin.isOpen() && SW.progWin.tab() === 'song';
  const songId = () => (SW.library && SW.library.currentId()) || '';
  const noStore = () => !!(SW.lessons && SW.lessons.isPreviewing && SW.lessons.isPreviewing());

  /* ---------------- the song's shape: sections and empty bars ---------------- */
  /* the song's own: a run of lines with the same label is one section (a line with no label, one of
     its own); an instrumental line (`lines[].bars`) is empty bars — an Intro, an Interlude */
  function songItems(song) {
    song = song || SW.timing.song();
    const out = [];
    song.lines.forEach((le, i) => {
      const input = le.line && le.line.querySelector('.line-label');
      const label = input ? input.value.trim() : '';
      if (le.bars) { out.push({ id: 'L' + i, kind: 'gap', bars: le.bars, label }); return; }
      const prev = out[out.length - 1];
      if (prev && prev.kind === 'sec' && label && prev.label === label) { prev.src.push(i); return; }
      out.push({ id: 'L' + i, kind: 'sec', label, src: [i] });
    });
    return out;
  }
  const itemsSig = items => items.map(it => (it.kind === 'gap' ? 'g' + it.bars : 's' + it.src.join(','))).join('|');
  /* the lines, as the sections are made of them (a stored draft's sections are for these lines only) */
  const shapeSig = song => (song || SW.timing.song()).lines.map(le => {
    const input = le.line && le.line.querySelector('.line-label');
    return (le.bars ? 'b' + le.bars : 'l') + ':' + (input ? input.value.trim() : '');
  }).join('|');
  const curItems = () => (D && D.items) || songItems();
  const restructured = () => !!(D && D.items) && itemsSig(D.items) !== itemsSig(songItems());
  /* a new item's id: never one the draft has (a draft kept through a reload has its own n1, n2 …) */
  function nid() {
    const used = new Set(curItems().map(it => it.id));
    let id;
    do id = 'n' + (++seq); while (used.has(id));
    return id;
  }
  const newGap = bars => ({ id: nid(), kind: 'gap', bars, label: '' });

  /* where everything is: the lines of the items in order, laid out as timing.js lays the song out
     (each line padded until the next one's pick-up lands on its bar line; empty bars hold the next
     pick-up in their last bar), the grid that gives (its first line's pick-up), each item's span */
  function layout(items) {
    const song = SW.timing.song();
    const mt = song.meter, B = mt.barTicks;
    const rows = [];
    items.forEach(it => {
      if (it.kind === 'gap') rows.push({ it, bars: it.bars, P: 0 });
      else it.src.forEach(i => { const le = song.lines[i]; if (le && !le.bars) rows.push({ it, le, P: le.pickup, t: le.total }); });
    });
    let at = 0;
    rows.forEach((r, i) => {
      const nx = rows[i + 1] || rows[0];
      const Pn = nx === r ? 0 : nx.P;
      r.padded = r.le ? (r.t === 0 ? 0 : r.t + mod(r.P - Pn - r.t, B)) : r.bars * B - Pn;
      r.at = at;
      at += r.padded;
    });
    const p0 = rows.length ? rows[0].P : 0;
    const g = T.grid({ meter: mt, pickup: p0, total: at, lines: [] });
    const spans = new Map();
    rows.forEach(r => {
      let sp = spans.get(r.it.id);
      if (!sp) { sp = { it: r.it, at: r.at, end: r.at, P: r.P, rows: [] }; spans.set(r.it.id, sp); }
      sp.end = r.at + r.padded;
      sp.rows.push(r);
    });
    return { song, mt, B, rows, total: at, p0, g, spans, items };
  }
  const spanAt = (L, t) => { for (const sp of L.spans.values()) if (t >= sp.at && t < sp.end) return sp; return null; };
  /* the draft as a song the player can play: its lines in the new order, their notes moved with them */
  function draftSong() {
    const L = layout(curItems());
    const lines = L.rows.map(r => {
      if (!r.le) return { meter: L.mt, events: [], total: r.padded, padded: r.padded, pickup: 0, shift: 0, bars: r.bars, at: r.at, line: null, barStart: b => b * L.B };
      const d = r.at - r.le.at;
      return Object.assign({}, r.le, { at: r.at, padded: r.padded, events: r.le.events.map(ev => Object.assign({}, ev, { at: ev.at + d })) });
    });
    return { lines, total: L.total, meter: L.mt, pickup: L.p0, shift: L.p0 ? L.B - L.p0 : 0 };
  }
  /* empty bars merged with the empty bars beside them; `alias` says where a merged run's chords went */
  function tidyItems(items, alias) {
    const out = [];
    const B = SW.meters.byId(SW.state.meter).barTicks;
    items.forEach(it => {
      if (it.kind === 'gap') {
        if (!(it.bars > 0)) return;
        const prev = out[out.length - 1];
        if (prev && prev.kind === 'gap') {
          alias[it.id] = { from: 0, to: prev.id, add: prev.bars * B };
          prev.bars += it.bars;
          if (!prev.label) prev.label = it.label;
          return;
        }
      }
      out.push(it);
    });
    return out;
  }
  /* A CHANGE OF SHAPE: every chord goes with what it starts in — a section's with the section, empty
     bars' with their start (or their end: `ends`, bars that grow or shrink at the front), the ones
     after the song keep their distance from its end; a section gone takes its chords with it.
     `alias` { id: { from, to, add } }: chords of `id` from `from` ticks in go to `to`, `add` ticks
     further in; `extra(L)`: chords that come with it (a pasted section), laid last. */
  function reshape(next, opts) {
    const o = opts || {};
    const A = layout(curItems());
    const alias = Object.assign({}, o.alias || {});
    const items = tidyItems(next, alias);
    const keep = D.chords.map(pc => {
      const sp = spanAt(A, pc.at);
      if (!sp) return { pc, tail: pc.at - A.total };
      if (o.ends && o.ends.has(sp.it.id)) return { pc, id: sp.it.id, back: sp.end - pc.at, gap: true };
      let id = sp.it.id, off = pc.at - sp.at;
      const al = alias[id];
      if (al && off >= al.from) { id = al.to; off = off - al.from + (al.add || 0); }
      return { pc, id, off, gap: sp.it.kind === 'gap' };
    });
    D.items = items;
    const Z = layout(items);
    let list = [];
    const put = (pc, at) => { if (at < 0) return; list = F.lay(list, Object.assign({}, pc, { at, end: at + (pc.end - pc.at) })); };
    const place = k => {
      const sp = Z.spans.get(k.id);
      if (sp) put(k.pc, k.back !== undefined ? sp.end - k.back : sp.at + k.off);
    };
    keep.filter(k => k.id && k.gap).forEach(place);
    keep.filter(k => k.id && !k.gap).forEach(place);
    if (o.extra) o.extra(Z).forEach(pc => put(pc, pc.at));
    keep.filter(k => k.tail !== undefined).forEach(k => put(k.pc, Z.total + k.tail));
    D.chords = list;
    if (itemsSig(D.items) === itemsSig(songItems())) D.items = null;      // back to the song's own shape
    return Z;
  }

  /* ---------------- the draft ---------------- */
  const songBase = g => T.soundSig(T.events(g || T.grid()), g, false);
  function store() {
    try { const v = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
  }
  function cleanList(list) {
    return (Array.isArray(list) ? list : []).filter(pc => pc && typeof pc.chord === 'string' && isFinite(pc.at) && isFinite(pc.end) && pc.end > pc.at && pc.at >= 0)
      .map(pc => {
        const o = { at: Math.round(pc.at), end: Math.round(pc.end), chord: pc.chord };
        ['k', 'place', 'rhythm'].forEach(f => { if (typeof pc[f] === 'string' && pc[f]) o[f] = pc[f]; });
        if (Array.isArray(pc.voice)) o.voice = clone(pc.voice);
        return o;
      }).sort((a, b) => a.at - b.at);
  }
  function cleanItems(items, song) {
    if (!Array.isArray(items) || !items.length) return null;
    const n = song.lines.length;
    const out = [];
    for (const it of items) {
      if (!it || typeof it.id !== 'string') return null;
      if (it.kind === 'gap' && it.bars >= 1 && it.bars === Math.floor(it.bars)) out.push({ id: it.id, kind: 'gap', bars: Math.min(64, it.bars), label: typeof it.label === 'string' ? it.label.slice(0, 15) : '' });
      else if (it.kind === 'sec' && Array.isArray(it.src) && it.src.length && it.src.every(i => i >= 0 && i < n && i === Math.floor(i) && !song.lines[i].bars)) out.push({ id: it.id, kind: 'sec', label: typeof it.label === 'string' ? it.label.slice(0, 15) : '', src: it.src.slice() });
      else return null;
    }
    return out.some(it => it.kind === 'sec') ? out : null;
  }
  const fresh = (id, base) => ({ id, base, chords: cleanList(T.draftPieces()), items: null, hist: [], fut: [], edited: false });
  /* the song's chords and the draft's sound different (their notes too), or its sections changed */
  function differs() {
    if (!D) return false;
    if (restructured()) return true;
    const g = T.grid();
    return T.soundSig(T.draftEvents(D.chords, g), g, true) !== T.soundSig(T.events(g), g, true);
  }
  /* kept for the song while it differs (a reload finds it); gone once it is the song again */
  function persist() {
    if (!D || noStore() || readOnly()) return;
    const all = store();
    if (differs()) {
      const rec = { base: D.base, chords: D.chords };
      if (D.items) {
        const L = layout(D.items);
        rec.items = D.items;
        rec.shape = shapeSig(L.song);
        rec.p0 = L.p0;
        rec.starts = {};
        L.spans.forEach((sp, id) => { rec.starts[id] = sp.at; });
        rec.total = L.total;
      }
      all[D.id] = rec;
    } else delete all[D.id];
    const lib = SW.library ? SW.library.getStoredLibrary() : null;            // a song deleted takes its draft with it
    if (lib) Object.keys(all).forEach(id => { if (!lib[id]) delete all[id]; });
    try {
      if (Object.keys(all).length) localStorage.setItem(DRAFT_KEY, JSON.stringify(all));
      else localStorage.removeItem(DRAFT_KEY);
    } catch (e) { /* storage full or blocked: the draft lasts as long as the page */ }
  }
  /* a stored draft's chords where its sections are now (a line longer or shorter since: each chord
     keeps its place in its section) */
  function placeStored(left, items) {
    const chords = cleanList(left.chords);
    const starts = left.starts || {};
    const was = Object.keys(starts).map(id => ({ id, at: starts[id] })).sort((a, b) => a.at - b.at);
    const Z = layout(items);
    let list = [];
    chords.forEach(pc => {
      let k = -1;
      was.forEach((w, i) => { if (pc.at >= w.at) k = i; });
      if (k < 0 || (isFinite(left.total) && pc.at >= left.total)) { const at = Z.total + pc.at - (left.total || 0); if (at >= 0) list = F.lay(list, Object.assign({}, pc, { at, end: at + pc.end - pc.at })); return; }
      const sp = Z.spans.get(was[k].id);
      if (!sp) return;
      const at = sp.at + pc.at - was[k].at;
      list = F.lay(list, Object.assign({}, pc, { at, end: at + pc.end - pc.at }));
    });
    return list;
  }
  /* the Time Line drawn: the draft for the song on screen — the one left here, the one kept
     for it, or the song's chords; a song changed under a waiting draft asks once */
  function sync() {
    const id = songId();
    const g = T.grid();
    const base = songBase(g);
    if (D && D.id === id && D.base === base && (!D.items || D.shape === shapeSig())) return;
    const left = D && D.id === id ? (D.edited ? { base: D.base, chords: D.chords, items: D.items, shape: D.shape, p0: D.p0 } : null) : (noStore() || readOnly() ? null : store()[id] || null);
    D = fresh(id, base);
    sel = [];
    selSec = null;
    anchor = null;
    point = 0;
    if (!left || readOnly()) return;
    const song = SW.timing.song();
    let items = left.items ? cleanItems(left.items, song) : null;
    let theirs;
    if (items && left.shape === shapeSig(song)) theirs = left.starts ? placeStored(left, items) : cleanList(left.chords);
    else if (left.items) {
      // its sections were for lines the song no longer has: its chords alone, at their bars
      items = null;
      const dp = g.p0 - (left.p0 || 0);
      theirs = cleanList(left.chords).map(pc => Object.assign(pc, { at: pc.at + dp, end: pc.end + dp })).filter(pc => pc.at >= 0);
      askAfter = () => SW.chordChart.ask({
        title: 'The song’s lines changed since you left the Time Line',
        buttons: [
          { label: 'My chords', primary: true, act: () => { D.chords = theirs; D.edited = true; persist(); redraw(); } },
          { label: 'The song as it is now', act: () => { persist(); redraw(); } }
        ]
      });
      return;
    } else theirs = cleanList(left.chords);
    const take = () => { D.chords = theirs; D.items = items; shapeNow(); D.edited = true; };
    if (left.base === base) { take(); return; }
    askAfter = () => SW.chordChart.ask({
      title: 'The song’s chords changed since you left the Time Line',
      buttons: [
        { label: 'My Time Line', primary: true, act: () => { take(); persist(); redraw(); } },
        { label: 'The song as it is now', act: () => { persist(); redraw(); } }
      ]
    });
  }
  /* a draft waits for the song on screen (the dot on the tab) */
  function waiting() {
    if (readOnly()) return false;
    const id = songId();
    if (D && D.id === id) return differs();
    return !noStore() && !!store()[id];
  }
  const snap = () => JSON.stringify({ chords: D.chords, items: D.items, sel, selSec });
  /* the lines a draft's sections are made of, and its grid's pick-up (sync checks them) */
  function shapeNow() {
    D.shape = D.items ? shapeSig() : undefined;
    D.p0 = D.items ? layout(D.items).p0 : undefined;
  }
  /* a change to the draft: one step of its own undo */
  function edit(fn) {
    if (readOnly() || !D) return;
    const before = snap();
    fn();
    D.chords = cleanList(D.chords);
    shapeNow();
    if (snap() === before) { redraw(); return; }
    D.hist.push(before);
    if (D.hist.length > 100) D.hist.shift();
    D.fut = [];
    D.edited = true;
    persist();
    if (mine && SW.player.playing) SW.player.replan();         // heard at once
    redraw();
  }
  function step(from, to) {
    if (!D || !from.length) return;
    to.push(snap());
    const s = JSON.parse(from.pop());
    D.chords = cleanList(s.chords);
    D.items = s.items || null;
    shapeNow();
    sel = s.sel || [];
    selSec = s.selSec || null;
    D.edited = true;
    persist();
    if (mine && SW.player.playing) SW.player.replan();
    redraw();
  }
  /* nothing of the draft's to undo, and it is the song as it is (just applied, say): the song's own Undo */
  const songSteps = () => !!D && !D.edited && !!SW.history;
  function undo() { if (!D) return; if (D.hist.length) step(D.hist, D.fut); else if (songSteps() && SW.history.canUndo()) SW.history.undo(); }
  function redo() { if (!D) return; if (D.fut.length) step(D.fut, D.hist); else if (songSteps() && SW.history.canRedo()) SW.history.redo(); }
  function redraw() { if (SW.progWin && SW.progWin.isOpen()) SW.progWin.render(); }

  /* ---------------- the song, measured ---------------- */
  const TINTS = [['#E4EEFE', '#3A6FD8'], ['#FFF2CF', '#A67600'], ['#FBE3F1', '#C2185B'], ['#DDF2E8', '#2E8B57'], ['#ECE6FF', '#6A4FD0'], ['#FFEBD6', '#C8640A']];   // the wave's
  /* a label's colour: the song's sections first, in order, so a section keeps its colour wherever it goes */
  function tintsFor(items) {
    const colour = {};
    songItems().concat(items).forEach(it => { if (it.kind === 'sec' && !(it.label in colour)) colour[it.label] = TINTS[Object.keys(colour).length % TINTS.length]; });
    return colour;
  }
  const gapName = (it, sp) => it.label || (sp.at === 0 ? 'Intro' : 'Interlude');
  function measure() {
    const items = curItems();
    const L = layout(items);
    const g = L.g;
    const beatPx = window.innerWidth <= 640 ? 44 : 56;
    const K = beatPx / g.b;                                       // px a tick
    const dEvs = T.draftEvents(D.chords, g);
    const last = Math.max(L.total, dEvs.end || 0, point + 1, 1);
    const shownBars = Math.max(12, g.barAt(last - 1) + 4);
    const x = t => t * K;
    const width = x(g.T(shownBars + 1));
    const colour = tintsFor(items);
    const secs = [], gaps = [];
    let lo = 127, hi = 0;
    items.forEach(it => {
      const sp = L.spans.get(it.id);
      if (!sp) return;
      if (it.kind === 'gap') { gaps.push({ id: it.id, a: sp.at, z: sp.end, label: gapName(it, sp) }); return; }
      const words = [], dots = [];
      sp.rows.forEach(r => {
        const d = r.at - r.le.at;
        r.le.events.forEach(ev => {
          const at = ev.at + d;
          const top = ev.pitches && ev.pitches.length ? ev.pitches[ev.pitches.length - 1] : null;
          if (top && !ev.rest) { dots.push({ at, midi: top.midi, color: top.color }); lo = Math.min(lo, top.midi); hi = Math.max(hi, top.midi); }
          const syl = ev.syllable;
          if (syl && syl.querySelector('.harmony-stack') === ev.stack) {
            const tx = syl.querySelector('.text');
            const w = tx ? tx.textContent.trim() : '';
            if (w && w !== '-') words.push({ at, w });
          }
        });
      });
      secs.push({ id: it.id, at: sp.at, end: sp.end, label: it.label, tint: colour[it.label] || TINTS[0], words, dots });
    });
    // chords on past the song
    if ((dEvs.end || 0) > L.total) gaps.push({ id: null, a: L.total, z: Math.max(L.total + 1, g.T(g.barAt(dEvs.end - 1) + 1)), label: 'Outro' });
    gaps.forEach(gp => { gp.has = D.chords.some(pc => pc.at < gp.z && pc.end > gp.a); });
    geo = { L, g, K, x, width, shownBars, secs, gaps, lo, hi, dEvs, beatPx };
    return geo;
  }
  const tickAt = clientX => {
    const el = bodyEl.querySelector('.tl');
    if (!el || !geo) return 0;
    const r = el.getBoundingClientRect();
    return Math.max(0, (clientX - r.left) * (el.offsetWidth / (r.width || 1)) / geo.K);
  };
  const beatFloor = t => { const g = geo.g; return Math.max(0, g.p0 + Math.floor((t - g.p0) / g.b) * g.b); };
  const beatSnap = t => { const g = geo.g; return Math.max(0, g.p0 + Math.round((t - g.p0) / g.b) * g.b); };
  const barOf = t => { const g = geo.g; return Math.max(g.p0 ? 0 : 1, g.barAt(t)); };
  const barStart = b => Math.max(0, geo.g.T(b));

  /* ---------------- drawing ---------------- */
  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5"/></svg>',
    loop: '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
    restart: '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><rect x="2.5" y="7" width="8" height="10" rx="2"/><rect x="13.5" y="7" width="8" height="10" rx="2" stroke-dasharray="3 2.4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8l-1.5 6 3.5 3v2H6v-2l3.5-3z"/><rect x="11" y="14" width="2" height="7" rx="1"/></svg>',
    grip: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="1.8"/><circle cx="15" cy="7" r="1.8"/><circle cx="9" cy="12" r="1.8"/><circle cx="15" cy="12" r="1.8"/><circle cx="9" cy="17" r="1.8"/><circle cx="15" cy="17" r="1.8"/></svg>'
  };
  function look(pc) {
    const card = pc.k ? cardOf(pc.k) : null;
    const voice = card ? card.voice : pc.voice;
    const d = C.isKnown(pc.chord) ? C.describeVoiced(pc.chord, voice) : null;
    if (!d || !d.known) return { name: String(pc.chord), color: '#B9AEC4', ink: '#2B1D38', inScale: true };
    return { name: C.nameOf(d), color: d.color, ink: SW.chordStrip.inkOn(d.color), inScale: d.inScale };
  }
  const cardsNow = () => SW.chordChart.chartNow().cards;
  const cardOf = k => cardsNow().find(e => e.id === k) || null;

  function render(body) {
    sync();
    const keep = body.querySelector('.tl-scroll');
    const keepX = keep ? keep.scrollLeft : null;
    const n = measure();
    const { g, x } = n;
    const ro = readOnly();
    sel = sel.filter(at => D.chords.some(pc => pc.at === at));
    if (selSec && !n.L.spans.has(selSec)) selSec = null;
    const playing = SW.player.playing && mine;
    const changed = !ro && differs();

    let ruler = '';
    for (let b = g.p0 ? 0 : 1; b <= n.shownBars; b++) {
      const a = barStart(b), w = x(g.T(b + 1)) - x(a);
      ruler += '<div class="tl-bn" data-bar="' + b + '" style="left:' + x(a) + 'px;width:' + w + 'px">' + (b > 0 ? b : '') + '</div>';
    }
    const band = n.hi - n.lo || 1;
    const secs = n.gaps.map(gp => '<div class="tl-gap' + (gp.has ? ' has' : '') + (gp.id && gp.id === selSec ? ' sel' : '') + (gp.id ? '' : ' outro') + '"' + (gp.id ? ' data-gap="' + gp.id + '"' : '') +
        ' data-at="' + gp.a + '" style="left:' + (x(gp.a) + 2) + 'px;width:' + Math.max(8, x(gp.z) - x(gp.a) - 4) + 'px">' + gp.label + (gp.id && gp.id === selSec ? secTools(gp.id) : '') + '</div>').join('') +
      n.secs.map(s => {
        const words = s.words.map((w, i) => {
          const nx = s.words[i + 1] ? s.words[i + 1].at : s.end;
          return '<span style="left:' + (x(w.at) - x(s.at)) + 'px;max-width:' + Math.max(12, x(nx) - x(w.at)) + 'px">' + esc(w.w) + '</span>';
        }).join('');
        const dots = s.dots.map(d => '<i style="left:' + (x(d.at) - x(s.at)) + 'px;top:' + ((1 - (d.midi - n.lo) / band) * 100).toFixed(1) + '%;--nc:' + d.color + '"></i>').join('');
        return '<div class="tl-sec' + (s.id === selSec ? ' sel' : '') + '" data-sec="' + s.id + '" data-at="' + s.at + '" style="left:' + (x(s.at) + 2) + 'px;width:' + Math.max(8, x(s.end) - x(s.at) - 4) + 'px;--sb:' + s.tint[0] + ';--sbd:' + s.tint[1] + '">' +
          '<div class="tl-shead"><span class="tl-slab' + (s.label ? '' : ' blank') + '">' + (s.label ? esc(s.label) : ICON.grip) + '</span>' + (s.id === selSec ? secTools(s.id) : '') + '</div>' +
          '<div class="tl-contour">' + dots + '</div><div class="tl-words">' + words + '</div></div>';
      }).join('');

    body.innerHTML = '<div class="tl-view' + (ro ? ' ro' : '') + '">' +
      '<div class="tl-headbar">' +
        '<button type="button" class="cc-play tl-play' + (playing ? ' on' : '') + '" data-tline="play" title="' + (playing ? 'Stop (Space)' : 'Play from the point (Space)') + '" aria-label="' + (playing ? 'Stop' : 'Play') + '">' + (playing ? ICON.stop : ICON.play) + '</button>' +
        '<button type="button" class="cc-loop tl-loop' + (loopOn ? ' on' : '') + '" data-tline="loop" title="Round and round" aria-pressed="' + loopOn + '">' + ICON.loop + '</button>' +
        '<span class="pw-gap"></span>' +
        (ro ? '' : '<button type="button" class="btn tl-restart" data-tline="restart"' + (changed ? '' : ' disabled') + ' title="Back to the song as it is">' + ICON.restart + 'Start over</button>' +
          '<button type="button" class="btn btn-primary tl-apply" data-tline="apply"' + (changed ? '' : ' disabled') + ' title="Put this in the song">Apply</button>') +
      '</div>' +
      '<div class="tl-scroll"><div class="tl" style="width:' + n.width + 'px">' +
        '<div class="tl-ruler">' + ruler + '</div>' +
        '<div class="tl-secrow">' + secs + '</div>' +
        '<div class="tl-chrow" style="background-size:' + x(g.B) + 'px 100%,' + x(g.b) + 'px 100%;background-position:' + x(g.p0 % g.B) + 'px 0,' + x(g.p0 % g.b) + 'px 0">' + rowHtml() + '</div>' +
        '<div class="tl-pt" style="left:' + x(point) + 'px"></div>' +
        '<div class="tl-ph" hidden></div>' +
      '</div></div>' +
      '<div class="tl-tray">' + trayHtml() + '</div>' +
    '</div>';
    const sc = body.querySelector('.tl-scroll');
    if (fresh0) { scrollTo = point; fresh0 = false; }
    if (scrollTo !== null) { sc.scrollLeft = Math.max(0, x(scrollTo) - 120); scrollTo = null; }
    else if (keepX !== null) sc.scrollLeft = keepX;
    else sc.scrollLeft = Math.max(0, x(point) - 120);
    if (reveal !== null) {
      const rx = x(reveal);
      if (rx < sc.scrollLeft + 10 || rx > sc.scrollLeft + sc.clientWidth - 160) sc.scrollLeft = Math.max(0, rx - 120);
      reveal = null;
    }
    paintHead();
    if (askAfter) { const a = askAfter; askAfter = null; setTimeout(a, 0); }
  }
  /* the selected section's tools beside its tab (Copy · Repeat · Delete), or the selected bars' (Delete) */
  function secTools(id) {
    if (readOnly()) return '';
    const sp = geo.L.spans.get(id);
    if (!sp) return '';
    if (sp.it.kind === 'gap') return '<div class="tl-acts tl-sacts"><button type="button" data-tline="sec-delete" title="Take these bars out (Delete)" aria-label="Take these bars out">' + ICON.trash + '</button></div>';
    return '<div class="tl-acts tl-sacts">' +
      '<button type="button" data-tline="sec-copy" title="Copy (⌘C)" aria-label="Copy">' + ICON.copy + '</button>' +
      '<button type="button" data-tline="sec-repeat" title="Repeat: a copy right after (⌘D)" aria-label="Repeat">' + ICON.repeat + '</button>' +
      '<button type="button" data-tline="sec-delete" title="Delete: empty bars where it was" aria-label="Delete"' + (geo.secs.length > 1 ? '' : ' disabled') + '>' + ICON.trash + '</button></div>';
  }
  /* the chord row: every chord of the draft, the selection's grips and tools */
  function rowHtml() {
    const { x } = geo;
    const ro = readOnly();
    const one = sel.length === 1;
    let html = '';
    D.chords.forEach(pc => {
      const l = look(pc);
      const w = x(pc.end) - x(pc.at);
      const on = sel.indexOf(pc.at) !== -1;
      html += '<div class="tl-c' + (on ? ' sel' : '') + (l.inScale ? '' : ' out') + '" data-at="' + pc.at + '" style="left:' + (x(pc.at) + 2) + 'px;width:' + Math.max(6, w - 4) + 'px;--c:' + l.color + ';--ck:' + l.ink + '" title="' + esc(l.name) + '">' +
        (w >= 34 ? '<span>' + C.labelHTML(l.name) + '</span>' : '') +
        (on && one && !ro ? '<i class="tl-stretch l" data-grip="l"></i><i class="tl-stretch r" data-grip="r"></i>' : '') + '</div>';
    });
    if (sel.length && !ro) {
      const last = D.chords.filter(pc => sel.indexOf(pc.at) !== -1).pop();
      html += '<div class="tl-acts" style="left:' + (x(last.end) - 2) + 'px">' +
        '<button type="button" data-tline="copy" title="Copy (⌘C)" aria-label="Copy">' + ICON.copy + '</button>' +
        '<button type="button" data-tline="repeat" title="Repeat: a copy right after (⌘D)" aria-label="Repeat">' + ICON.repeat + '</button>' +
        '<button type="button" data-tline="delete" title="Delete" aria-label="Delete">' + ICON.trash + '</button></div>';
    }
    return html;
  }
  function clipOk() {
    if (clip && clip.kind === 'sec' && clip.shape !== shapeSig()) clip = null;      // its lines are not the song's any more
    return !!clip;
  }
  function trayHtml() {
    const ro = readOnly();
    const cards = cardsNow();
    let html = '';
    if (clipOk() && !ro) {
      const strip = clip.chords.map(pc => { const l = look(pc); return '<i style="--c:' + l.color + ';flex:' + (pc.end - pc.at) + '"></i>'; }).join('');
      if (clip.kind === 'sec') {
        const tint = tintsFor(curItems())[clip.label] || TINTS[0];
        html += '<div class="tl-clip sec" style="--sb:' + tint[0] + ';--sbd:' + tint[1] + '" title="Drag it in — or tap: at the point (⌘V)"><span class="tl-pin">' + ICON.pin + '</span>' +
          '<span class="tl-clab">' + (clip.label ? esc(clip.label) : ICON.grip) + '</span><span class="tl-strip">' + strip + '</span></div><span class="tl-sep"></span>';
      } else html += '<div class="tl-clip" title="Drag it in — or tap: at the point (⌘V)"><span class="tl-pin">' + ICON.pin + '</span><span class="tl-strip">' + strip + '</span></div><span class="tl-sep"></span>';
    }
    html += cards.map(e => SW.chordChart.cardHtml(e, 0, true)).join('');
    if (!ro) html += SW.chordChart.starters(cards).map(place => SW.chordChart.starterHtml(place, true)).join('');
    return html;
  }

  /* the playhead, while the draft plays */
  function paintHead() {
    cancelAnimationFrame(raf);
    const head = bodyEl.querySelector('.tl-ph');
    if (!head || !geo) return;
    const live = mine && SW.player.playing;
    const pos = live ? SW.player.position() : null;
    head.hidden = pos === null;
    bodyEl.querySelectorAll('.tl-c.sounding').forEach(c => c.classList.remove('sounding'));
    if (pos === null) { if (live) raf = requestAnimationFrame(paintHead); return; }   // getting ready: no position yet
    const hx = geo.x(pos);
    head.style.left = hx + 'px';
    const on = D.chords.find(pc => pc.at <= pos && pos < pc.end);
    if (on) { const c = bodyEl.querySelector('.tl-c[data-at="' + on.at + '"]'); if (c) c.classList.add('sounding'); }
    const sc = bodyEl.querySelector('.tl-scroll');
    if (sc && !press && (hx < sc.scrollLeft + 20 || hx > sc.scrollLeft + sc.clientWidth - 60)) sc.scrollLeft = Math.max(0, hx - 80);
    raf = requestAnimationFrame(paintHead);
  }

  /* ---------------- sound ---------------- */
  const draftEvents = g => T.draftEvents(D ? D.chords : [], g);
  const how = extra => Object.assign({ events: draftEvents, song: draftSong, countIn: false, beat: false }, extra);
  function hear(pc) {
    const card = pc.k ? cardOf(pc.k) : null;
    if (C.isKnown(pc.chord)) C.play(pc.chord, 'progression', { voice: card ? card.voice : pc.voice });
  }
  function play() {
    if (mine && SW.player.playing) { SW.player.stop(); return; }
    mine = true;
    SW.player.playFrom(point, how({ loop: loopOn }));
  }
  SW.bus.on('play:changed', d => {
    if (!d.playing) queueMicrotask(() => { if (!SW.player.playing) mine = false; if (active()) paintButtons(); });   // a restart (replan) keeps it
    else if (active()) { paintButtons(); paintHead(); }
  });
  function paintButtons() {
    const b = bodyEl.querySelector('.tl-play');
    if (!b) return;
    const on = mine && SW.player.playing;
    b.classList.toggle('on', on);
    b.innerHTML = on ? ICON.stop : ICON.play;
    b.title = on ? 'Stop (Space)' : 'Play from the point (Space)';
    if (!on) paintHead();
  }
  function stop() { if (mine && SW.player.playing) SW.player.stop(); mine = false; }

  /* ---------------- changing the chords ---------------- */
  const byAt = at => D.chords.find(pc => pc.at === at) || null;
  const selected = () => D.chords.filter(pc => sel.indexOf(pc.at) !== -1);
  function fromCard(e) {
    const o = { chord: e.chord, k: e.id };
    if (e.place) o.place = e.place;
    if (e.voice) o.voice = clone(e.voice);
    return o;
  }
  /* a card dropped at a tick (D17): on a chord's first beat it becomes that chord; else to the next chord or the bar line */
  function putCard(e, tick) {
    if (!e) return;
    edit(() => {
      const g = geo.g;
      const on = byAt(tick);
      let pc;
      if (on) {
        pc = Object.assign({}, on, fromCard(e));
        if (!e.place) delete pc.place;
        if (!e.voice) delete pc.voice;
        D.chords = D.chords.map(x => (x === on ? pc : x));
      } else {
        let end = g.T(g.barAt(tick) + 1);
        const inside = D.chords.find(x => x.at < tick && tick < x.end);
        if (inside) end = Math.min(end, inside.end);
        D.chords.forEach(x => { if (x.at > tick) end = Math.min(end, x.at); });
        pc = Object.assign({ at: tick, end }, fromCard(e));
        D.chords = F.lay(D.chords, pc);
      }
      sel = [tick];
      selSec = null;
      anchor = tick;
      point = tick;
      hear(pc);
    });
  }
  /* where a card dropped at a tick would go: [at, end) */
  function putSpan(tick) {
    const g = geo.g;
    const on = byAt(tick);
    if (on) return [on.at, on.end];
    let end = g.T(g.barAt(tick) + 1);
    D.chords.forEach(x => { if (x.at < tick && tick < x.end) end = Math.min(end, x.end); if (x.at > tick) end = Math.min(end, x.at); });
    return [tick, end];
  }
  function moveSel(delta, copy) {
    if (!sel.length || !delta) return;
    edit(() => {
      const moving = selected();
      delta = Math.max(delta, -moving[0].at);
      let list = copy ? D.chords.slice() : D.chords.filter(pc => sel.indexOf(pc.at) === -1);
      const placed = moving.map(pc => Object.assign({}, pc, { at: pc.at + delta, end: pc.end + delta }));
      placed.forEach(pc => { list = F.lay(list, pc); });
      D.chords = list;
      sel = placed.map(pc => pc.at);
      anchor = sel[0];
      point = sel[0];
    });
  }
  function resize(at, a2, e2) {
    const pc = byAt(at);
    if (!pc || e2 <= a2 || (a2 === pc.at && e2 === pc.end)) return;
    edit(() => {
      const np = Object.assign({}, pc, { at: a2, end: e2 });
      const r = F.refit(pc, a2, e2, geo.g);
      if (r && r !== T.HELD) np.rhythm = r; else delete np.rhythm;
      D.chords = F.lay(F.cut(D.chords, pc.at, pc.end), np);
      sel = [a2];
      anchor = a2;
    });
  }
  function removeSel() {
    if (!sel.length) return;
    edit(() => { D.chords = D.chords.filter(pc => sel.indexOf(pc.at) === -1); sel = []; });
  }
  function blockOf(list) {
    if (!list.length) return null;
    const a = list[0].at;
    return { kind: 'chords', len: list[list.length - 1].end - a, chords: list.map(pc => Object.assign(clone(pc), { at: pc.at - a, end: pc.end - a })) };
  }
  function copySel() {
    const b = blockOf(selected());
    if (!b) return false;
    clip = b;
    redraw();
    return true;
  }
  function pasteBlock(b, at) {
    if (!b) return;
    if (b.kind === 'sec') { insertSec(b, at); return; }
    edit(() => {
      let list = D.chords;
      const placed = b.chords.map(pc => Object.assign(clone(pc), { at: pc.at + at, end: pc.end + at }));
      placed.forEach(pc => { list = F.lay(list, pc); });
      D.chords = list;
      sel = placed.map(pc => pc.at);
      selSec = null;
      anchor = sel[0];
      point = at + b.len;
    });
  }
  function repeatSel() {
    const list = selected();
    const b = blockOf(list);
    if (b) pasteBlock(b, list[list.length - 1].end);
  }
  /* Focus's Save as New from a chord here: the draft's chord at `at` takes the new card */
  function swapAt(at, k) {
    const e = cardOf(k);
    const pc = byAt(at);
    if (!e || !pc) return;
    edit(() => {
      const np = Object.assign({}, pc, fromCard(e));
      if (!e.place) delete np.place;
      if (!e.voice) delete np.voice;
      D.chords = D.chords.map(x => (x === pc ? np : x));
      sel = [at];
    });
  }
  function focusOn(pc) {
    if (readOnly() || !pc || !SW.chordFocus) return;
    stop();
    const hooks = {
      swap: k => swapAt(pc.at, k),
      play: (a, z, preview) => { mine = false; SW.player.playFrom(a, how({ loop: [a, z], once: true, preview })); }
    };
    if (SW.chordFocus.atDraft(pc, hooks)) SW.progWin.setTab('focus');
  }
  function walk(d) {
    if (selSec) {
      const list = curItems();
      const i = list.findIndex(it => it.id === selSec);
      const nx = list[Math.max(0, Math.min(list.length - 1, i + d))];
      if (nx) { selSec = nx.id; point = geo.L.spans.get(nx.id).at; scrollTo = point; }
      redraw();
      return;
    }
    if (!sel.length) { point = beatSnap(point + d * geo.g.b); redraw(); return; }
    const ref = d > 0 ? Math.max.apply(null, sel) : Math.min.apply(null, sel);
    const i = D.chords.findIndex(pc => pc.at === ref);
    const n = D.chords[Math.max(0, Math.min(D.chords.length - 1, i + d))];
    if (!n) return;
    sel = [n.at];
    anchor = n.at;
    point = n.at;
    hear(n);
    redraw();
  }

  /* ---------------- changing the sections (Phase 5) ---------------- */
  function selectSec(id) {
    selSec = id;
    sel = [];
    anchor = null;
    const sp = geo && geo.L.spans.get(id);
    if (sp) { point = sp.at; reveal = sp.at; }          // its tab and tools in sight
    redraw();
  }
  /* a section moved by `d` bars (D16): past the middle of a neighbour they swap; otherwise it
     moves, the empty bars around it giving and taking, pushing the ones after it along */
  function moveSec(id, d) {
    if (!d) return;
    edit(() => {
      const items = clone(curItems());
      const L = layout(items);
      const secs = items.filter(it => it.kind === 'sec');
      const i = secs.findIndex(it => it.id === id);
      if (i < 0) return;
      const sp = it => L.spans.get(it.id);
      const me = secs[i], a = sp(me).at, len = sp(me).end - a;
      const to = a + d * L.B;
      const mid = it => (sp(it).at + sp(it).end) / 2;
      let j = i; while (j > 0 && to < mid(secs[j - 1])) j--;
      let r = i; while (r < secs.length - 1 && to + len > mid(secs[r + 1])) r++;
      const opts = {};
      let next;
      if (j < i || r > i) {
        // the last section moving up: the empty bars before it would be left at the song's end
        const k = items.indexOf(me);
        const lastSec = !items.slice(k + 1).some(it => it.kind === 'sec');
        next = items.filter(it => it !== me && !(lastSec && j < i && it === items[k - 1] && it.kind === 'gap'));
        next.splice(j < i ? next.indexOf(secs[j]) : next.indexOf(secs[r]) + 1, 0, me);
      } else {
        next = items;
        const k = next.indexOf(me);
        let gb = next[k - 1] && next[k - 1].kind === 'gap' ? next[k - 1] : null;
        let ga = next[k + 1] && next[k + 1].kind === 'gap' ? next[k + 1] : null;
        const after = next.slice(k + 1).some(it => it.kind === 'sec');
        if (d > 0) {
          if (gb) gb.bars += d; else next.splice(k, 0, newGap(d));
          if (ga) { ga.bars -= d; opts.ends = new Set([ga.id]); }
        } else {
          const m = Math.min(-d, gb ? gb.bars : 0);
          if (!m) return;
          gb.bars -= m;
          if (after) {
            if (ga) { ga.bars += m; opts.ends = new Set([ga.id]); }
            else next.splice(next.indexOf(me) + 1, 0, newGap(m));
          }
        }
      }
      const Z = reshape(next, opts);
      sel = [];
      selSec = id;
      if (!Z.spans.has(id)) selSec = null;
      else point = Z.spans.get(id).at;
      scrollTo = point;
    });
  }
  /* a section (copied) put in at a tick: before the section there, or at that bar of the empty bars there */
  function insertAt(L, t) {
    for (let k = 0; k < L.items.length; k++) {
      const it = L.items[k], s = L.spans.get(it.id);
      if (!s || t < s.at || t >= s.end) continue;
      if (it.kind === 'sec') return { k, tick: s.at };
      const kb = Math.max(0, Math.min(it.bars, Math.round((t - s.at) / L.B)));
      return { k, kb, gap: it, tick: s.at + kb * L.B };
    }
    const kb = Math.max(0, Math.round((t - L.total) / L.B));
    return { k: L.items.length, end: kb, tick: L.total + kb * L.B };
  }
  function insertSec(c, t) {
    if (!c || c.kind !== 'sec' || readOnly()) return;
    let made = null;
    edit(() => {
      const items = clone(curItems());
      const L = layout(items);
      const it = { id: nid(), kind: 'sec', label: c.label, src: c.src.slice() };
      const at = insertAt(L, t);
      const opts = {};
      let k = at.k;
      if (at.gap) {
        const g = items[k];
        if (at.kb >= g.bars) k++;
        else if (at.kb > 0) {
          const rest = newGap(g.bars - at.kb);
          opts.alias = { [g.id]: { from: at.kb * L.B, to: rest.id } };
          g.bars = at.kb;
          items.splice(k + 1, 0, rest);
          k++;
        }
      } else if (at.end) { items.push(newGap(at.end)); k = items.length; }
      items.splice(k, 0, it);
      opts.extra = Z => { const s = Z.spans.get(it.id); return s ? c.chords.map(pc => Object.assign(clone(pc), { at: s.at + pc.at, end: s.at + pc.end })) : []; };
      const Z = reshape(items, opts);
      made = Z.spans.get(it.id) ? it.id : null;
      sel = [];
      selSec = made;
      if (made) { point = Z.spans.get(made).end; scrollTo = Z.spans.get(made).at; }
    });
  }
  function copySec(id) {
    const L = layout(curItems());
    const sp = L.spans.get(id);
    if (!sp || sp.it.kind !== 'sec') return false;
    const chords = D.chords.filter(pc => pc.at >= sp.at && pc.at < sp.end).map(pc => Object.assign(clone(pc), { at: pc.at - sp.at, end: Math.min(pc.end, sp.end) - sp.at }));
    clip = { kind: 'sec', label: sp.it.label, src: sp.it.src.slice(), len: sp.end - sp.at, chords, shape: shapeSig() };
    redraw();
    return true;
  }
  function repeatSec(id) {
    const L = layout(curItems());
    const sp = L.spans.get(id);
    if (!sp || !copySec(id)) return;
    insertSec(clip, sp.end);
  }
  /* a section out: empty bars where it was (its chords go with it), so nothing after it moves —
     at the song's end it simply goes; empty bars out: the bars go, and what is after them moves up */
  function deleteItem(id) {
    if (readOnly()) return;
    edit(() => {
      const items = clone(curItems());
      const L = layout(items);
      const k = items.findIndex(it => it.id === id);
      if (k < 0) return;
      const it = items[k];
      if (it.kind === 'gap') { items.splice(k, 1); reshape(items); selSec = null; return; }
      if (items.filter(x => x.kind === 'sec').length <= 1) return;           // the song keeps one
      const nextSec = items.slice(k + 1).find(x => x.kind === 'sec');
      if (!nextSec) { items.splice(k, 1); reshape(items); selSec = null; return; }
      const keepAt = L.spans.get(nextSec.id).at;
      const sp = L.spans.get(id);
      const gap = newGap(Math.max(1, Math.round((sp.end - sp.at) / L.B)));
      items.splice(k, 1, gap);
      // as many bars as keep the next section where it was (a pick-up on either side moves a bar line)
      for (let tries = 0; tries < 3; tries++) {
        const now = layout(tidyItems(clone(items), {})).spans.get(nextSec.id);
        const diff = now ? Math.round((keepAt - now.at) / L.B) : 0;
        if (!diff || gap.bars + diff < 1) break;
        gap.bars += diff;
      }
      reshape(items);
      selSec = null;
      point = Math.min(point, layout(curItems()).total);
    });
  }

  /* ---------------- Apply, Start over, the question on the way out ---------------- */
  /* APPLY ALL: the song's lines in the draft's order (empty bars an instrumental line, Y4) and its chords, one Undo step */
  function applyAll() {
    const model = SW.score.read();
    const from = model.lines;
    const lines = [];
    const L = layout(D.items);
    D.items.forEach(it => {
      if (it.kind === 'gap') { lines.push({ label: gapName(it, L.spans.get(it.id)), bars: it.bars }); return; }
      it.src.forEach(i => lines.push(Object.assign(clone(from[i]), { _src: i })));
    });
    // a word that ran on into the next line runs on only into the line it ran into
    lines.forEach((l, n) => {
      if (l._src === undefined) return;
      const nx = lines[n + 1];
      const last = l.syllables && l.syllables[l.syllables.length - 1];
      if (last && last.hy && !(nx && nx._src === l._src + 1)) delete last.hy;
    });
    lines.forEach(l => { delete l._src; });
    model.lines = lines;
    const chords = D.chords;
    SW.history.hold(() => SW.score.render(model));
    if (!T.applyDraft(chords)) SW.score.changed('section');
    return true;
  }
  function apply(chordsOnly) {
    if (!D || readOnly()) return false;
    stop();
    const msg = restructured() && !chordsOnly ? 'The song has your changes' : 'The chords are in the song';
    let ok;
    if (restructured() && !chordsOnly) { ok = applyAll(); point = 0; scrollTo = 0; }       // a new shape: from its top
    else if (restructured()) {
      // CHORDS ONLY (D15): the chords at the bars the Time Line has them at, the melody as it is
      const dp = T.grid().p0 - layout(D.items).p0;
      ok = T.applyDraft(D.chords.map(pc => Object.assign({}, pc, { at: pc.at + dp, end: pc.end + dp })).filter(pc => pc.at >= 0));
    } else ok = T.applyDraft(D.chords);
    const id = D.id;
    D = fresh(id, songBase());
    sel = [];
    selSec = null;
    persist();
    if (ok) ui.toast(msg);
    redraw();
    return ok;
  }
  function restart() {
    SW.chordChart.ask({
      title: 'Throw away your Time Line changes?',
      buttons: [{ label: 'Start over', primary: true, act: () => { stop(); const keep = D.hist.concat([snap()]); D = fresh(D.id, songBase()); D.hist = keep; D.edited = true; sel = []; selSec = null; persist(); redraw(); } }]
    });
  }
  /* what the draft changes, as pictures: how many chords (by their place in their section: a chord that
     only travelled with its section is no change), the ones going in, the sections more or fewer, where
     the words start */
  function chips() {
    const A = layout(songItems()), Z = layout(curItems());
    const keyOf = L => pc => {
      const sp = spanAt(L, pc.at);
      const where = sp ? (sp.it.kind === 'sec' ? 's' + sp.it.src.join(',') : 'g') + '@' + (pc.at - sp.at) : 'z@' + (pc.at - L.total);
      return [where, pc.end - pc.at, pc.chord, pc.k || '', pc.rhythm || ''].join('|');
    };
    const song = cleanList(T.draftPieces());
    const KA = song.map(keyOf(A)), KZ = D.chords.map(keyOf(Z));
    const SA = new Set(KA), SZ = new Set(KZ);
    const added = D.chords.filter((pc, i) => !SA.has(KZ[i]));
    const gone = song.filter((pc, i) => !SZ.has(KA[i]));
    const n = Math.max(added.length, gone.length);
    let html = n ? '<span class="cc-chip"><span class="cc-chip-sw">♪</span>' + n + (n === 1 ? ' chord' : ' chords') + '</span>' : '';
    if (added.length) html += '<span class="cc-chip cc-chip-strip">' + added.slice(0, 6).map(pc => { const l = look(pc); return '<i style="--c:' + l.color + ';--ck:' + l.ink + '">' + C.labelHTML(l.name) + '</i>'; }).join('') + (added.length > 6 ? '<b>+' + (added.length - 6) + '</b>' : '') + '</span>';
    if (!restructured()) return html;
    const tints = tintsFor(curItems());
    const count = items => { const c = {}; items.forEach(it => { if (it.kind === 'sec') c[it.label] = (c[it.label] || 0) + 1; }); return c; };
    const ca = count(A.items), cz = count(Z.items);
    let sec = '';
    Object.keys(Object.assign({}, ca, cz)).forEach(l => {
      const t = tints[l] || TINTS[0], a = ca[l] || 0, z = cz[l] || 0;
      if (z === a) return;
      sec += '<span class="cc-chip"><span class="cc-chip-sw" style="background:' + t[1] + '">' + (l ? esc(l) : '•') + '</span>' + (z > a ? '× ' + z : '− ' + (a - z)) + '</span>';
    });
    const firstBar = L => { const s = L.items.find(it => it.kind === 'sec'); const sp = s && L.spans.get(s.id); return sp ? L.g.barAt(sp.at + sp.P) : 1; };
    const fa = firstBar(A), fz = firstBar(Z);
    if (fz !== fa) sec += '<span class="cc-chip"><span class="cc-chip-sw cc-chip-go">→</span>bar ' + fz + '</span>';
    const gaps = Z.items.filter(it => it.kind === 'gap').length - A.items.filter(it => it.kind === 'gap').length;
    if (gaps > 0) sec += '<span class="cc-chip"><span class="cc-chip-sw cc-chip-gap"></span>+ ' + gaps + '</span>';
    if (!sec) sec = '<span class="cc-chip"><span class="cc-chip-sw cc-chip-go">⇄</span>' + Z.items.filter(it => it.kind === 'sec').map(it => (it.label ? esc(it.label) : '•')).join(' ') + '</span>';
    return html + sec;
  }
  const mustAsk = () => !readOnly() && !!D && D.id === songId() && differs();
  /* leaving with differences (the chart's tab, ×, Esc, a tap outside — D14): Apply (all · Chords only) · Not now, or Keep editing */
  function leave(then) {
    stop();
    if (!mustAsk()) { then(); return; }
    const big = restructured();
    SW.chordChart.ask({
      title: 'Put these changes in the song?',
      chips: chips(),
      buttons: (big
        ? [{ label: 'Apply all', primary: true, act: () => { apply(false); then(); } },
           { label: 'Chords only', act: () => { apply(true); then(); } }]
        : [{ label: 'Apply', primary: true, act: () => { apply(false); then(); } }])
        .concat([{ label: 'Not now', act: () => then() }])
    });
  }

  /* ---------------- gestures ---------------- */
  const overEl = (sel0, x, y, pad) => { const r = bodyEl.querySelector(sel0); if (!r) return false; const b = r.getBoundingClientRect(); return x >= b.left && x <= b.right && y >= b.top - pad && y <= b.bottom + pad; };
  const overRow = (x, y) => overEl('.tl-chrow', x, y, 16);
  const overSecRow = (x, y) => overEl('.tl-secrow', x, y, 30);
  function ghostOf(el) {
    const g = el.cloneNode(true);
    g.classList.add('cc-ghost');
    g.style.width = el.offsetWidth + 'px';
    g.style.height = el.offsetHeight + 'px';
    document.body.appendChild(g);
    return g;
  }
  function markAt(a, z) {
    const row = bodyEl.querySelector('.tl-chrow');
    if (!row) return;
    let m = row.querySelector('.tl-mark');
    if (a === null) { if (m) m.remove(); row.classList.remove('drop'); return; }
    if (!m) { m = document.createElement('div'); m.className = 'tl-mark'; row.appendChild(m); }
    row.classList.add('drop');
    m.style.left = (geo.x(a) + 2) + 'px';
    m.style.width = Math.max(6, geo.x(z) - geo.x(a) - 4) + 'px';
  }
  /* where a section would go in: a bar between the blocks of the section row */
  function insMark(t) {
    const row = bodyEl.querySelector('.tl-secrow');
    if (!row) return;
    let m = row.querySelector('.tl-ins');
    if (t === null) { if (m) m.remove(); return; }
    if (!m) { m = document.createElement('div'); m.className = 'tl-ins'; row.appendChild(m); }
    m.style.left = geo.x(t) + 'px';
  }
  bodyEl.addEventListener('pointerdown', e => {
    if (!active() || (e.button && e.button !== 0) || SW.chordChart.asking()) return;
    const t = e.target;
    if (t.closest('.tl-headbar, .tl-acts, button:not(.cc-card)')) return;
    const ro = readOnly();
    const id = e.pointerId;
    const base = { x0: e.clientX, y0: e.clientY, id, moved: false };
    const grip = t.closest('.tl-stretch');
    if (grip && !ro) {
      e.preventDefault();
      const el = grip.closest('.tl-c');
      press = Object.assign(base, { kind: 'grip', side: grip.dataset.grip, at: Number(el.dataset.at), el });
      return;
    }
    const ch = t.closest('.tl-c');
    if (ch) {
      e.preventDefault();
      press = Object.assign(base, { kind: 'chord', at: Number(ch.dataset.at), shift: e.shiftKey });
      return;
    }
    const card = t.closest('[data-tk]');
    if (card) {
      e.preventDefault();
      const c = cardOf(card.dataset.tk);
      if (c) hear(fromCard(c));
      press = Object.assign(base, { kind: 'card', k: card.dataset.tk, el: card });
      return;
    }
    const st = t.closest('[data-tstarter]');
    if (st && !ro) {
      e.preventDefault();
      const en = C.entry(st.dataset.tstarter);
      if (en) C.play(en.spec, 'chart');
      press = Object.assign(base, { kind: 'starter', place: st.dataset.tstarter, el: st });
      return;
    }
    const cl = t.closest('.tl-clip');
    if (cl && !ro) { e.preventDefault(); press = Object.assign(base, { kind: 'clip', el: cl }); return; }
    const bn = t.closest('.tl-bn');
    if (bn) { e.preventDefault(); press = Object.assign(base, { kind: 'bars', anchor: Number(bn.dataset.bar) }); return; }
    const sec = t.closest('.tl-sec');
    if (sec) {
      const byTab = !!t.closest('.tl-slab') || e.pointerType === 'mouse';
      if (byTab) e.preventDefault();
      press = Object.assign(base, { kind: 'sec', sec: sec.dataset.sec, el: sec, swipe: !byTab });   // a finger on its body: a tap, or the page scrolling
      return;
    }
    const gp = t.closest('.tl-gap[data-gap]');
    if (gp) { press = Object.assign(base, { kind: 'gap', gap: gp.dataset.gap }); return; }
    if (t.closest('.tl-chrow, .tl-secrow, .tl-gap')) press = Object.assign(base, { kind: 'spot', tick: beatFloor(tickAt(e.clientX)) });
  });
  window.addEventListener('pointermove', e => {
    const p = press;
    if (!p || e.pointerId !== p.id) return;
    const far = Math.hypot(e.clientX - p.x0, e.clientY - p.y0) > 6;
    if (p.kind === 'spot' || p.kind === 'gap') { if (far) press = null; return; }      // a swipe: the page scrolls
    if (p.kind === 'bars') {
      const b = barOf(tickAt(e.clientX));
      if (b === p.anchor && !p.moved) return;
      p.moved = true;
      p.a = Math.min(p.anchor, b);
      p.b = Math.max(p.anchor, b);
      const ruler = bodyEl.querySelector('.tl-ruler');
      let band = ruler.querySelector('.tl-band');
      if (!band) { band = document.createElement('div'); band.className = 'tl-band'; ruler.prepend(band); }
      band.style.left = geo.x(barStart(p.a)) + 'px';
      band.style.width = (geo.x(geo.g.T(p.b + 1)) - geo.x(barStart(p.a))) + 'px';
      return;
    }
    if (readOnly()) return;
    if (p.kind === 'sec') {
      if (p.swipe) { if (far) press = null; return; }
      if (!p.moved && !far) return;
      const sp = geo.L.spans.get(p.sec);
      if (!sp) return;
      if (!p.moved) {
        p.moved = true;
        p.el.classList.add('dragging');
        bodyEl.querySelectorAll('.tl-sacts').forEach(x => x.remove());
        p.carried = Array.from(bodyEl.querySelectorAll('.tl-c')).filter(el => { const at = Number(el.dataset.at); return at >= sp.at && at < sp.end; });
        p.carried.forEach(el => el.classList.add('carried'));
      }
      const barPx = geo.x(geo.g.B);
      p.d = Math.round((e.clientX - p.x0) * (bodyEl.querySelector('.tl').offsetWidth / (bodyEl.querySelector('.tl').getBoundingClientRect().width || 1)) / barPx);
      if (sp.at + p.d * geo.g.B < 0) p.d = -Math.floor(sp.at / geo.g.B);
      const dx = p.d * barPx;
      p.el.style.transform = 'translateX(' + dx + 'px)';
      p.carried.forEach(el => { el.style.transform = 'translateX(' + dx + 'px)'; });
      return;
    }
    if (p.kind === 'card' || p.kind === 'starter' || p.kind === 'clip') {
      if (!p.moved && !far) return;
      if (!p.moved) { p.moved = true; p.ghost = ghostOf(p.el); }
      p.ghost.style.left = e.clientX + 'px';
      p.ghost.style.top = e.clientY + 'px';
      const secClip = p.kind === 'clip' && clip && clip.kind === 'sec';
      if (secClip) {
        const on = overSecRow(e.clientX, e.clientY) || overRow(e.clientX, e.clientY);
        p.to = on ? tickAt(e.clientX) : null;
        insMark(on ? insertAt(geo.L, p.to).tick : null);
        return;
      }
      p.to = overRow(e.clientX, e.clientY) ? beatFloor(tickAt(e.clientX)) : null;
      if (p.to === null) markAt(null);
      else if (p.kind === 'clip') markAt(p.to, p.to + clip.len);
      else { const sp = putSpan(p.to); markAt(sp[0], sp[1]); }
      return;
    }
    if (p.kind === 'chord') {
      if (!p.moved && !far) return;
      const pc = byAt(p.at);
      if (!pc) return;
      if (!p.moved) {
        p.moved = true;
        if (sel.indexOf(p.at) === -1) { sel = [p.at]; anchor = p.at; }
        selSec = null;
        bodyEl.querySelectorAll('.tl-sacts').forEach(x => x.remove());
        p.els = sel.map(at => bodyEl.querySelector('.tl-c[data-at="' + at + '"]')).filter(Boolean);
        p.els.forEach(el => { el.classList.add('sel'); el.querySelectorAll('.tl-stretch').forEach(x => x.remove()); });
        const tools = bodyEl.querySelector('.tl-chrow .tl-acts');
        if (tools) tools.remove();
        p.copies = p.els.map(el => { const c = el.cloneNode(true); c.classList.add('tl-moving'); el.parentNode.appendChild(c); return c; });
        p.els.forEach(el => el.classList.add('lifted'));
        p.first = Math.min.apply(null, sel);
      }
      p.copy = e.altKey;
      p.delta = Math.max(-p.first, beatSnap(pc.at + tickAt(e.clientX) - tickAt(p.x0)) - pc.at);
      const dx = geo.x(p.delta);
      p.copies.forEach(c => { c.style.transform = 'translateX(' + dx + 'px)'; c.classList.toggle('copying', p.copy); });
      p.els.forEach(el => el.classList.toggle('lifted', !p.copy));
      return;
    }
    if (p.kind === 'grip') {
      const pc = byAt(p.at);
      if (!pc) return;
      p.moved = true;
      const g = geo.g;
      const tk = beatSnap(tickAt(e.clientX));
      if (p.side === 'r') {
        const minEnd = Math.min(pc.end, g.p0 + (Math.floor((pc.at - g.p0) / g.b) + 1) * g.b);
        p.a2 = pc.at;
        p.e2 = Math.max(minEnd, tk, pc.at + T.CELL);
      } else {
        const maxAt = Math.max(pc.at, g.p0 + (Math.ceil((pc.end - g.p0) / g.b) - 1) * g.b);
        p.e2 = pc.end;
        p.a2 = Math.max(0, Math.min(maxAt, tk, pc.end - T.CELL));
      }
      p.el.style.left = (geo.x(p.a2) + 2) + 'px';
      p.el.style.width = Math.max(6, geo.x(p.e2) - geo.x(p.a2) - 4) + 'px';
    }
  });
  function endPress(e, cancelled) {
    const p = press;
    if (!p || (e && e.pointerId !== p.id)) return;
    press = null;
    if (p.ghost) p.ghost.remove();
    markAt(null);
    insMark(null);
    if (cancelled) { if (p.moved) redraw(); return; }           // a swipe the page took over: never redrawn under it (its scroll would stop)
    const ro = readOnly();
    switch (p.kind) {
      case 'spot': point = p.tick; sel = []; selSec = null; redraw(); return;
      case 'gap': selectSec(p.gap); return;
      case 'sec':
        if (p.moved && !ro) { if (p.d) moveSec(p.sec, p.d); else redraw(); return; }
        selectSec(p.sec);
        return;
      case 'bars': {
        if (p.moved) {
          const a = barStart(p.a), z = geo.g.T(p.b + 1);
          sel = D.chords.filter(pc => pc.at >= a && pc.at < z).map(pc => pc.at);
          anchor = sel[0] !== undefined ? sel[0] : null;
          point = a;
        } else { point = barStart(p.anchor); sel = []; }
        selSec = null;
        redraw();
        return;
      }
      case 'card':
        if (p.moved && p.to !== null && p.to !== undefined && !ro) putCard(cardOf(p.k), p.to);
        return;
      case 'starter': {
        if (ro) return;
        if (p.moved && (p.to === null || p.to === undefined)) return;
        const en = C.entry(p.place);
        if (!en) return;
        const k = T.chartAdd({ chord: C.toId(en.spec), place: p.place });   // on the chart first (the hub's own change)
        if (k && p.moved) putCard(cardOf(k), p.to);
        return;
      }
      case 'clip':
        if (!clipOk() || ro) return;
        if (!p.moved) pasteBlock(clip, point);
        else if (p.to !== null && p.to !== undefined) pasteBlock(clip, p.to);
        return;
      case 'grip':
        if (p.moved && p.a2 !== undefined) resize(p.at, p.a2, p.e2); else redraw();
        return;
      case 'chord': {
        if (p.moved && !ro) { if (p.delta) moveSel(p.delta, p.copy); else redraw(); return; }
        const pc = byAt(p.at);
        if (!pc) return;
        const now = Date.now();
        if (!p.shift && lastTap && lastTap.key === p.at && now - lastTap.t < 450) { lastTap = null; focusOn(pc); return; }
        lastTap = { key: p.at, t: now };
        if (p.shift && anchor !== null) {
          const a = Math.min(anchor, p.at), z = Math.max(anchor, p.at);
          sel = D.chords.filter(x => x.at >= a && x.at <= z).map(x => x.at);
        } else { sel = [p.at]; anchor = p.at; }
        selSec = null;
        point = pc.at;
        hear(pc);
        redraw();
      }
    }
  }
  window.addEventListener('pointerup', e => endPress(e, false));
  window.addEventListener('pointercancel', e => endPress(e, true));

  bodyEl.addEventListener('click', e => {
    if (!active()) return;
    const b = e.target.closest('[data-tline]');
    if (!b) return;
    switch (b.dataset.tline) {
      case 'play': play(); return;
      case 'loop':
        loopOn = !loopOn;
        b.classList.toggle('on', loopOn);
        b.setAttribute('aria-pressed', loopOn);
        if (mine && SW.player.playing) SW.player.playFrom(Math.floor(SW.player.position() || point), how({ loop: loopOn }));
        return;
      case 'restart': restart(); return;
      case 'apply': apply(false); return;
      case 'copy': copySel(); return;
      case 'repeat': repeatSel(); return;
      case 'delete': removeSel(); return;
      case 'sec-copy': if (selSec) copySec(selSec); return;
      case 'sec-repeat': if (selSec) repeatSec(selSec); return;
      case 'sec-delete': if (selSec) deleteItem(selSec); return;
    }
  });

  /* ---------------- keys (progression-window.js hands them over) ---------------- */
  function keyDown(e) {
    const k = e.key || '';
    const ro = readOnly();
    const secOn = selSec && geo && geo.L.spans.get(selSec);
    const isSec = secOn && secOn.it.kind === 'sec';
    if ((e.metaKey || e.ctrlKey) && !e.altKey) {
      switch (k.toLowerCase()) {
        case 'c': e.preventDefault(); if (isSec) copySec(selSec); else copySel(); return true;
        case 'x': e.preventDefault(); if (ro) return true; if (isSec) { if (copySec(selSec)) deleteItem(selSec); } else if (copySel()) removeSel(); return true;
        case 'v': e.preventDefault(); if (!ro && clipOk()) pasteBlock(clip, point); return true;
        case 'd': e.preventDefault(); if (ro) return true; if (isSec) repeatSec(selSec); else repeatSel(); return true;
        case 'a': e.preventDefault(); selSec = null; sel = D.chords.map(pc => pc.at); anchor = sel[0] !== undefined ? sel[0] : null; redraw(); return true;
      }
      return false;
    }
    switch (k) {
      case ' ': e.preventDefault(); if (!e.repeat) play(); return true;
      case 'Delete': case 'Backspace': e.preventDefault(); if (ro) return true; if (secOn) deleteItem(selSec); else removeSel(); return true;
      case 'Enter': e.preventDefault(); if (!ro && sel.length) focusOn(byAt(sel[0])); return true;
      case 'ArrowLeft': case 'ArrowRight': {
        e.preventDefault();
        const d = k === 'ArrowLeft' ? -1 : 1;
        if (e.altKey) { if (!ro) { if (isSec) moveSec(selSec, d); else moveSel(d * geo.g.b, false); } } else walk(d);
        return true;
      }
    }
    return true;                  // the chord and melody keys are quiet on the Time Line
  }

  function closed() {
    fresh0 = true;
    stop();
    cancelAnimationFrame(raf);
    if (press && press.ghost) press.ghost.remove();
    press = null;
  }
  // another song: its own draft (the one kept for it, if any)
  SW.bus.on('song:opened', () => { D = null; sel = []; selSec = null; clip = null; });

  SW.chordTimeline = {
    render, keyDown, mustAsk, leave, waiting, undo, redo, closed,
    canUndo: () => !!D && (D.hist.length > 0 || (songSteps() && SW.history.canUndo())),
    canRedo: () => !!D && (D.fut.length > 0 || (songSteps() && SW.history.canRedo()))
  };
})();

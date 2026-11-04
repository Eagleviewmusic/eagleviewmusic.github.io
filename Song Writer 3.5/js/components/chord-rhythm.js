/* ==========================================================================
   COMPONENT — a chord's Rhythm (the Chord Chart, 2026-10-30)      SW.chordRhythm
   --------------------------------------------------------------------------
   The user's ask: the round ♪ at the bottom of a chart card opens a section
   under the chart (the board moves down) about how that chord plays.

     THIS CHORD · ALL CHORDS   on the right of the tabs' row (2026-10-30, user:
       the line that explained it went, for the room). This Chord: the section
       is that card's (its colour, a pointer up to its ♪). All Chords: every
       card's ♪ lights, a pointer to each — a choice goes to every card on
       the chart (and the cards put on later from it in empty time).
     BLOCK CHORDS   Held first (struck once, ringing), then the meter's
       pre-built rhythms (rhythm-box.js PRESETS), each a line of notes.
     ARPEGGIOS      the chord's notes one by one (track.js ARPS): up, down,
       up and down, down and up, middle out, ends in, Alberti, bass and
       chord, bass then down, random — in quarters, 8ths or 16ths.
     BUILD YOUR OWN two parts —
       • Block chord rhythm: Rhythm Poetry's circles for one bar (the
         rhythm box's, bare)
       • The notes in order: a grid, the chord's notes high to low by the
         bar's quarters, 8ths or 16ths — a tap puts that note there (two or
         more in a column sound together); an empty column lets the notes
         ring on. Built on the chord it was opened from: with All Chords
         every other chord plays the same pattern by place (its bottom note
         for the bottom, its top for the top — track.js arpOrder).
       The part playing says so.
   Every choice is one Undo step (track.js chartRhythm) and reaches every
   chord from the card(s) in the song at once, laid in step with the bar;
   the wave, playing, plays it at once. ▶ plays two bars of it.

   API  SW.chordRhythm.html(cards) · attach(body) · toggle(k) · lit(k) · close() · loop(card) → { stop() } | null
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const M = SW.music;
  const bodyEl = document.getElementById('pw-body');
  if (!C || !T || !bodyEl || !T.chartRhythm) return;
  const esc = C.escapeHtml;
  const CELL = T.CELL;

  let openK = null;             // the card the section was opened from ("the initial chord")
  let all = false;              // This Chord · All Chords
  let tab = null;               // 'block' | 'arp' | 'build' — null: the one the card's rhythm is on
  let by = 'e';                 // an arpeggio's speed: q e s
  const grids = new Map();      // card → { by, n, cols: [[ranks] | null, …] } the note order being built

  const meter = () => SW.meters.byId(S.meter);
  const barCells = () => meter().barTicks / CELL;
  const perBeat = () => meter().beatTicks / CELL;
  const active = () => SW.progWin && SW.progWin.isOpen() && SW.progWin.tab() === 'chart';
  const cardsNow = () => SW.chordChart.chartNow().cards;
  const cardOf = k => cardsNow().find(e => e.id === k) || null;
  const targets = () => (all ? cardsNow().map(e => e.id) : [openK]);
  const lit = k => !!openK && (all || k === openK);
  const notesOf = e => C.midis(e.chord, { voice: e.voice }).length;

  /* ---------------- the choices ---------------- */
  const spanOf = b => (b === 'q' ? perBeat() : b === 'e' ? 2 : 1);           // a quarter is a beat (♩. in compound time)
  const colsOf = b => Math.floor(barCells() / spanOf(b));
  const speedCells = b => Array.from({ length: barCells() }, (x, i) => (i % spanOf(b) === 0 ? 'X' : 'O')).join('');
  const SPEEDS = () => [['q', meter().compound ? 'Dotted quarters' : 'Quarters'], ['e', '8ths'], ['s', '16ths']];
  const ARP_INFO = {
    up: ['Up', 'Lowest to highest'],
    down: ['Down', 'Highest to lowest'],
    updown: ['Up and down', 'Up, then back down'],
    downup: ['Down and up', 'Down, then back up'],
    out: ['Middle out', 'From the middle to the ends'],
    in: ['Ends in', 'From the ends to the middle'],
    alberti: ['Alberti', 'Low, high, middle, high'],
    oompah: ['Bass and chord', 'The bass, then the rest together'],
    bassdown: ['Bass, then down', 'The bass, then from the top down'],
    random: ['Random', 'Any note — never the same twice in a row']
  };
  function blockPresets() {
    return SW.rhythmBox.presets({ cells: 'R'.repeat(barCells()), kind: 'bar' });
  }
  const barOf = e => T.fit(T.cells(e.rhythm) || '', barCells());
  /* what the card plays now, as this section names it (null: nothing chosen — its chords keep theirs) */
  function choiceOf(e) {
    if (!e || !e.rhythm) return null;
    if (e.rhythm === T.HELD) return { tab: 'block', id: 'held' };
    const c = barOf(e);
    if (typeof e.arp === 'string') return { tab: 'arp', id: e.arp, by: e.by || 'e' };
    if (e.arp) return { tab: 'build', id: 'order', by: e.by || 'e' };
    const pre = blockPresets().find(p => p.one === c);
    return pre ? { tab: 'block', id: pre.one } : { tab: 'build', id: 'circles' };
  }

  /* ---------------- writing ---------------- */
  function write(spec, hearIt) {
    if (!openK) return;
    T.chartRhythm(targets(), spec);
    if (hearIt) setTimeout(() => hear(1), 30);
  }

  /* ---------------- the note order being built ---------------- */
  function gridOf(e) {
    const n = notesOf(e);
    let gs = grids.get(e.id);
    if (gs && gs.n === n) return gs;
    const b = e.by && e.arp ? e.by : 'e';
    gs = { by: b, n, cols: null };
    if (e.arp && typeof e.arp === 'object' && e.rhythm && e.rhythm !== T.HELD) {
      // from the card: its groups where its strikes are
      const c = barOf(e), span = spanOf(b), order = T.arpOrder(e.arp, n);
      const cols = new Array(colsOf(b)).fill(null);
      let j = 0, fits = true;
      for (let i = 0; i < c.length; i++) {
        if (c[i] !== 'X') continue;
        if (i % span) { fits = false; break; }
        cols[i / span] = order[j % order.length].slice();
        j++;
      }
      if (fits && j) gs.cols = cols;
    }
    if (!gs.cols) {
      const seq = T.arpOrder(typeof e.arp === 'string' && e.arp !== 'random' ? e.arp : 'up', n);
      gs.cols = fill(seq, colsOf(b));
    }
    grids.set(e.id, gs);
    return gs;
  }
  const fill = (seq, count) => Array.from({ length: count }, (x, i) => (seq.length ? seq[i % seq.length].slice() : null));
  function gridSpec(gs) {
    const span = spanOf(gs.by);
    let c = '', started = false;
    const o = [];
    gs.cols.forEach(gr => {
      if (gr && gr.length) { c += 'X' + 'O'.repeat(span - 1); o.push(gr.slice()); started = true; }
      else c += (started ? 'O' : 'R').repeat(span);                      // an empty column: the notes ring on
    });
    while (c.length < barCells()) c += started ? 'O' : 'R';
    return o.length ? { rhythm: c, arp: { o, n: gs.n }, by: gs.by } : null;
  }

  /* ---------------- drawing ---------------- */
  function engraved(cells, ss) {
    const m = meter();
    return SW.engrave.rhythm(cells, { perBeat: m.beatTicks / CELL, barCells: m.barTicks / CELL, compound: m.compound, ss: ss || 8 });
  }
  /* an arpeggio's picture: the notes as rows (low at the bottom), the order as dots left to right */
  function arpPic(id, n) {
    const rows = Math.max(3, Math.min(5, n));
    let order = id === 'random' ? [[1], [rows - 1], [0], [2], [rows - 1], [1]] : T.arpOrder(id, rows);
    if (order.length < 4) order = order.concat(order);
    const W = 12 + (order.length - 1) * 13 + 12, H = 10 + (rows - 1) * 9 + 10;
    const y = r => H - 10 - r * 9;
    let s = '<svg class="cr-apic" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">';
    for (let r = 0; r < rows; r++) s += '<line x1="6" x2="' + (W - 6) + '" y1="' + y(r) + '" y2="' + y(r) + '" class="cr-arow"/>';
    const pts = order.map((gr, i) => (gr.length === 1 ? (12 + i * 13) + ',' + y(gr[0]) : null));
    if (pts.every(Boolean)) s += '<polyline points="' + pts.join(' ') + '" class="cr-aline"/>';
    order.forEach((gr, i) => gr.forEach(r => { s += '<circle cx="' + (12 + i * 13) + '" cy="' + y(r) + '" r="3.6" class="cr-adot"/>'; }));
    return s + '</svg>';
  }
  function html(list) {
    const e = openK ? list.find(x => x.id === openK) : null;
    if (!e) { openK = null; return ''; }
    const ch = choiceOf(e);
    const t = tab || (ch ? ch.tab : 'block');
    const d = C.describeVoiced(e.chord, e.voice);
    const name = C.labelHTML(C.nameOf(d));
    const tabBtn = (id, label) => '<button type="button" class="cr-tab' + (t === id ? ' on' : '') + '" data-crtab="' + id + '" role="tab" aria-selected="' + (t === id) + '">' + label + '</button>';
    return '<section class="cr-panel' + (all ? ' all' : '') + '" style="--c:' + d.color + ';--cink:' + SW.chordStrip.inkOn(d.color) + '" aria-label="Rhythm">' +
      '<div class="cr-carets" aria-hidden="true"></div>' +
      // one row (2026-10-30, user): the tabs on the left, This Chord · All Chords over on the right
      '<div class="cr-head">' +
        '<div class="cr-tabs" role="tablist">' + tabBtn('block', 'Block Chords') + tabBtn('arp', 'Arpeggios') + tabBtn('build', 'Build Your Own') + '</div>' +
        '<div class="cr-headr">' +
          '<span class="cr-for">Rhythm for</span>' +
          '<div class="seg cr-scope" role="group" aria-label="This chord, or every chord">' +
            '<button type="button" class="seg-btn' + (all ? '' : ' active') + '" data-crscope="one" aria-pressed="' + !all + '"><span class="cr-chip">' + name + '</span>This Chord</button>' +
            '<button type="button" class="seg-btn' + (all ? ' active' : '') + '" data-crscope="all" aria-pressed="' + all + '" title="A choice goes to every chord on the chart">All Chords</button>' +
          '</div>' +
          '<button type="button" class="cr-hear" data-cr="hear" title="Hear two bars of it">' + ICON_PLAY + '<span>Hear it</span></button>' +
          '<button type="button" class="cr-close" data-cr="close" title="Close the rhythm" aria-label="Close the rhythm">' + ICON_X + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="cr-body" role="tabpanel">' + (t === 'block' ? blockHtml(e, ch) : t === 'arp' ? arpHtml(e, ch) : buildHtml(e, ch, d)) + '</div>' +
    '</section>';
  }
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const tick = '<i class="cr-on" aria-hidden="true">✓</i>';
  function blockHtml(e, ch) {
    const held = ch && ch.id === 'held';
    let h = '<div class="cr-tiles block">' +
      '<button type="button" class="cr-tile' + (held ? ' on' : '') + '" data-crblock="held" aria-pressed="' + held + '">' + (held ? tick : '') +
        '<span class="cr-pic">' + engraved('X' + 'O'.repeat(barCells() - 1), 9) + '</span><span class="cr-name">Held</span><span class="cr-desc">Struck once, ringing</span></button>';
    blockPresets().forEach(p => {
      const on = !!ch && ch.tab === 'block' && ch.id === p.one;
      h += '<button type="button" class="cr-tile' + (on ? ' on' : '') + '" data-crblock="' + p.one + '" aria-pressed="' + on + '" title="' + esc(p.label) + '">' + (on ? tick : '') +
        '<span class="cr-pic">' + engraved(p.one, 9) + '</span><span class="cr-name">' + esc(p.label) + '</span></button>';
    });
    return h + '</div>';
  }
  function speedHtml(cur, attr) {
    return '<div class="seg cr-speed" role="group" aria-label="How fast">' + SPEEDS().map(([b, label]) =>
      '<button type="button" class="seg-btn' + (cur === b ? ' active' : '') + '" data-' + attr + '="' + b + '" aria-pressed="' + (cur === b) + '">' + label + '</button>').join('') + '</div>';
  }
  function arpHtml(e, ch) {
    const cur = ch && ch.tab === 'arp' ? ch.by : by;
    const n = notesOf(e);
    let h = '<div class="cr-row"><span class="cr-label">Speed</span>' + speedHtml(cur, 'crby') + '</div><div class="cr-tiles arp">';
    T.ARPS.forEach(id => {
      const on = !!ch && ch.tab === 'arp' && ch.id === id;
      const [nm, desc] = ARP_INFO[id];
      h += '<button type="button" class="cr-tile' + (on ? ' on' : '') + '" data-crarp="' + id + '" aria-pressed="' + on + '">' + (on ? tick : '') +
        '<span class="cr-pic">' + arpPic(id, n) + '</span><span class="cr-name">' + nm + '</span><span class="cr-desc">' + desc + '</span></button>';
    });
    return h + '</div>';
  }
  function circleScope(e, d) {
    const c = e.rhythm && e.rhythm !== T.HELD && !e.arp ? barOf(e) : T.defaultCells(meter(), 1);
    return {
      key: 'cr:' + e.id, kind: 'bar', cells: c, held: false, bars: 1, colour: d ? d.color : '#888', readOnly: false, bare: true,
      write: v => write({ rhythm: v === T.HELD ? T.HELD : v }), redraw: () => SW.progWin.render()
    };
  }
  function buildHtml(e, ch, d) {
    const usingC = !!ch && ch.id === 'circles', usingO = !!ch && ch.id === 'order';
    const gs = gridOf(e);
    const notes = C.voiceNotes(e.voice || C.voiceOf(e.chord));
    const span = spanOf(gs.by), pb = perBeat();
    let grid = '';
    for (let r = gs.n - 1; r >= 0; r--) {
      const nt = notes[r];
      const col = nt ? M.LETTER_COLORS[nt.letter] || '#9C168E' : '#9C168E';
      grid += '<span class="cr-gname" style="--nc:' + col + '">' + (nt ? esc(nt.name) : '·') + '</span>';
      gs.cols.forEach((gr, i) => {
        const on = !!gr && gr.indexOf(r) !== -1;
        const beat = (i * span) % pb === 0;
        grid += '<button type="button" class="cr-cell' + (on ? ' on' : '') + (beat && i ? ' beat' : '') + '" data-cg="' + i + ',' + r + '" style="--nc:' + col + '" aria-pressed="' + on + '" aria-label="' + (nt ? nt.name : 'note') + ', ' + (i + 1) + '"></button>';
      });
    }
    // the count over the columns: the beat's number, + at its half (simple time), · between
    const counts = gs.cols.map((x, i) => {
      const a = i * span, inBeat = a % pb;
      const say = !inBeat ? Math.floor(a / pb) + 1 : !meter().compound && inBeat * 2 === pb ? '+' : '·';
      return '<span class="cr-gcount' + (inBeat ? '' : ' on-beat') + (i && !inBeat ? ' beat' : '') + '">' + say + '</span>';
    }).join('');
    return '<div class="cr-build">' +
      '<div class="cr-part' + (usingC ? ' using' : '') + '">' +
        '<div class="cr-part-head"><b>Block chord rhythm</b>' + (usingC ? '<span class="cr-using">Playing</span>' : '') + '</div>' +
        '<p class="cr-hint">Tap the circles: orange strikes the chord, yellow lets it ring on, grey is silence.</p>' +
        SW.rhythmBox.html(circleScope(e, d)) +
      '</div>' +
      '<div class="cr-part' + (usingO ? ' using' : '') + '">' +
        '<div class="cr-part-head"><b>The notes in order</b>' + (usingO ? '<span class="cr-using">Playing</span>' : '') + speedHtml(gs.by, 'crgby') + '</div>' +
        '<p class="cr-hint">Tap a circle and that note plays there — two or more in a column play together; an empty column lets the notes ring on.' +
          (all ? ' Built on ' + C.labelHTML(C.nameOf(d)) + '; every other chord plays the same pattern.' : '') + '</p>' +
        '<div class="cr-grid" style="--cols:' + gs.cols.length + '">' + '<span class="cr-gname"></span>' + counts + grid + '</div>' +
        '<div class="cr-row cr-gtools"><button type="button" class="btn pw-small-btn" data-crclear>Clear</button>' +
          '<button type="button" class="btn pw-small-btn" data-crfill="up">Start from Up</button>' +
          '<button type="button" class="btn pw-small-btn" data-crfill="updown">Start from Up and down</button></div>' +
      '</div>' +
    '</div>';
  }

  /* after it is in the page: a pointer up to each card it is about, the circles laid out */
  function attach(body) {
    const panel = body.querySelector('.cr-panel');
    if (!panel) return;
    SW.rhythmBox.layout(panel);
    placeCarets(panel);
  }
  function placeCarets(panel) {
    const box = panel.querySelector('.cr-carets');
    if (!box) return;
    const pr = panel.getBoundingClientRect();
    if (!pr.width) return;
    const ks = all ? cardsNow().map(e => e.id) : [openK];
    const xs = new Set();
    box.innerHTML = ks.map(k => {
      const b = bodyEl.querySelector('.cc-rhy[data-rhy="' + k + '"]');
      if (!b) return '';
      const r = b.getBoundingClientRect();
      const x = Math.round(r.left + r.width / 2 - pr.left);
      if (xs.has(x)) return '';                                   // a card on a second row, right under one on the first: one pointer
      xs.add(x);
      const c = bodyEl.querySelector('.cc-card[data-k="' + k + '"]');
      return '<i class="cr-caret" style="left:' + (r.left + r.width / 2 - pr.left).toFixed(1) + 'px' + (c ? ';--cc:' + c.style.getPropertyValue('--c') : '') + '"></i>';
    }).join('');
  }
  window.addEventListener('resize', () => { const p = active() && bodyEl.querySelector('.cr-panel'); if (p) placeCarets(p); });

  /* ---------------- hearing it ---------------- */
  /* a card's rhythm over n bars from tick 0, as the song would play it: the event (its strikes), its notes */
  function cardEvent(e, n) {
    if (!e || !C.isKnown(e.chord)) return null;
    const mt = meter(), B = mt.barTicks;
    const g = { mt, B, b: mt.beatTicks, p0: 0, total: n * B, lastBar: n, T: bar => (bar - 1) * B, barAt: t => Math.floor(t / B) + 1 };
    const sp = T.cardSpot(e, 0, n * B, g);
    const step = { chord: e.chord, beats: n * mt.beats };
    if (sp.rhythm) step.rhythm = T.rhythmOf(sp.rhythm);
    if (sp.arp) step.arp = sp.arp;
    if (e.voice) step.voice = e.voice;
    const ev = T.expand([], [{ from: 1, to: n, chords: [step] }], g, [])[0];
    const list = C.midis(e.chord, { voice: e.voice });
    return ev && list.length ? { ev, list, barSec: B * SW.timing.tickMs() / 1000 } : null;
  }
  /* one pass of it from audio time t0 → the sounds' handles, each with when it starts (none before `after`) */
  function strikeAll(x, t0, after) {
    const tickSec = SW.timing.tickMs() / 1000;
    const sw = SW.timing.swing(0);              // in the song's swing (timing.js SWING), from the bar line
    const out = [];
    x.ev.strikes.forEach(st => {
      const at = t0 + sw.at(st.at) * tickSec;
      if (after !== undefined && at < after) return;
      SW.audio.playChordFrequencies(T.strikeNotes(x.list, st).map(M.midiToFreq), at, sw.len(st.at, T.strikeHold(st)) * tickSec * 0.95).forEach(h => out.push({ h, at }));
    });
    return out;
  }
  // ▶ Hear it: two bars of the chord the section was opened from
  let sounding = [];
  function stopHear() { sounding.forEach(s => { try { s.h.stop(); } catch (x) {} }); sounding = []; }
  function hear(bars) {
    stopHear();
    const x = cardEvent(cardOf(openK), bars || 2);
    if (x) sounding = strikeAll(x, SW.audio.now() + 0.06);
  }
  /* A CARD HELD DOWN on the chart (2026-10-30, user): its rhythm, a bar at a time, round and round from now
     until stop() — what has sounded rings out, what has not is not heard. Null: it has no rhythm to play.
     o.t0 (the panel's Chord Chart set, live): the audio time the chord was pressed — the rhythm keeps that
     moment's beat, its strikes already past left out (the chord struck at the press was its first); `next`
     is when its first sound comes. */
  function loop(e, o) {
    if (!e || !e.rhythm || e.rhythm === T.HELD) return null;
    const x = cardEvent(e, 1);
    if (!x) return null;
    const late = !!(o && typeof o.t0 === 'number');
    const t0 = late ? o.t0 : SW.audio.now() + 0.03;
    let n = 0, timer = 0, live = true, list = [], next = null;
    const pump = () => {
      if (!live) return;
      const now = SW.audio.now();
      while (t0 + n * x.barSec < now + 0.4) { list = list.concat(strikeAll(x, t0 + n * x.barSec, late ? now + 0.01 : undefined)); n++; }
      if (next === null && list.length) next = Math.min.apply(null, list.map(s => s.at));
      list = list.filter(s => s.at > now - 4);                      // long gone
      timer = setTimeout(pump, 120);
    };
    pump();
    return {
      next: () => next,
      stop() {
        live = false;
        clearTimeout(timer);
        const now = SW.audio.now();
        list.forEach(s => { if (s.at > now + 0.005) { try { s.h.stop(); } catch (z) {} } });
        list = [];
      }
    };
  }

  /* ---------------- taps ---------------- */
  bodyEl.addEventListener('click', ev => {
    if (!active() || !openK) return;
    const b = ev.target.closest('.cr-panel button');
    if (!b) return;
    const d = b.dataset;
    const e = cardOf(openK);
    if (!e) return;
    if (d.cr === 'close') { close(); return; }
    if (d.cr === 'hear') { hear(2); return; }
    if (d.crscope) { all = d.crscope === 'all'; SW.progWin.render(); return; }
    if (d.crtab) { tab = d.crtab; SW.progWin.render(); return; }
    if (d.crblock) { tab = 'block'; write({ rhythm: d.crblock === 'held' ? T.HELD : d.crblock }, true); return; }
    if (d.crby) {
      by = d.crby;
      const ch = choiceOf(e);
      if (ch && ch.tab === 'arp') write({ rhythm: speedCells(by), arp: ch.id, by }, true);     // the arpeggio playing, at the new speed
      else SW.progWin.render();
      return;
    }
    if (d.crarp) {
      const ch = choiceOf(e);
      if (ch && ch.tab === 'arp') by = ch.by;
      tab = 'arp';
      write({ rhythm: speedCells(by), arp: d.crarp, by }, true);
      return;
    }
    if (d.crgby || d.cg !== undefined || d.crclear !== undefined || d.crfill) {
      const gs = gridOf(e);
      if (d.crgby) {                                       // the same order, laid at the new speed (round again to fill the bar)
        const seq = gs.cols.filter(x => x && x.length);
        gs.by = d.crgby;
        gs.cols = fill(seq, colsOf(gs.by));
      } else if (d.cg !== undefined) {
        const [i, r] = d.cg.split(',').map(Number);
        const gr = gs.cols[i] ? gs.cols[i].slice() : [];
        const at = gr.indexOf(r);
        if (at === -1) { gr.push(r); gr.sort((x, y) => x - y); } else gr.splice(at, 1);
        gs.cols[i] = gr.length ? gr : null;
        const f = M.midiToFreq(C.midis(e.chord, { voice: e.voice }).sort((x, y) => x - y)[r]);
        if (at === -1 && f) SW.audio.playChordFrequencies([f], undefined, 0.5);
      } else if (d.crclear !== undefined) gs.cols = gs.cols.map(() => null);
      else gs.cols = fill(T.arpOrder(d.crfill, gs.n), colsOf(gs.by));
      tab = 'build';
      const spec = gridSpec(gs);
      const ch = choiceOf(e);
      // the order plays once it has notes (and it changes what plays only when it is what plays, or when it was built here)
      if (spec && (d.cg !== undefined || d.crfill || (ch && ch.id === 'order'))) write(spec);
      else SW.progWin.render();
      return;
    }
    const sc = circleScope(e, C.describeVoiced(e.chord, e.voice));
    if (SW.rhythmBox.click(b, sc)) tab = 'build';
  });

  /* ---------------- opening, closing ---------------- */
  function toggle(k) {
    if (openK === k) { close(); return; }
    openK = k;
    tab = null;
    const ch = choiceOf(cardOf(k));
    if (ch && ch.tab === 'arp') by = ch.by;
    SW.progWin.render();
    // bring it into view under the chart
    requestAnimationFrame(() => {
      const p = bodyEl.querySelector('.cr-panel');
      if (!p) return;
      const br = bodyEl.getBoundingClientRect(), r = p.getBoundingClientRect();
      if (r.bottom > br.bottom) bodyEl.scrollTop += Math.min(r.bottom - br.bottom + 16, r.top - br.top - 90);
    });
  }
  function close() {
    stopHear();
    openK = null;
    tab = null;
    if (active()) SW.progWin.render();
  }
  SW.bus.on('song:opened', () => { openK = null; all = false; tab = null; grids.clear(); });
  SW.bus.on('sheet:closed', d => { if (d.id === 'prog-sheet') stopHear(); });
  // a new key, a new scale, a card's notes saved: the note order is drawn again from the card
  ['key:changed', 'chords:changed', 'meter:changed'].forEach(evt => SW.bus.on(evt, () => grids.clear()));

  SW.chordRhythm = { html, attach, toggle, lit, close, loop, isOpen: () => !!openK };
})();

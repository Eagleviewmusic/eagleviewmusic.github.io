/* ==========================================================================
   COMPONENT — the Chord Progression window: Edit Chords        #prog-sheet
   --------------------------------------------------------------------------
   Phase 2 of ../Song Writer Chord Progressions/ (DESIGN.md §4). Opened by
   the Chord Progression button at the foot of the chord panel. Its two
   tabs: Edit Chords ('build') and Chord Placement ('song', the map).

   The Edit Chords page (2026-10-05), the first time — the draft, or a
   progression made since the page was opened (`fresh`) — a guide, top
   to bottom:

     THIS SONG     CHOOSE YOUR CHORDS AND THEIR RHYTHM
     [Verse  ▶]    RHYTHM — every bar plays            CHORDS [More chords…]
     [Chorus ▶]    [Build your own][Pre-built] [1 bar|2 bars]   the panel's board
     + New         ( ● ○ )( ● ○ )( ● ● )( ● ○ )        ‹ sus2 add9 sus4 ♭7 maj7 6 6/4 … ›
     Starters ▾    BUILD YOUR CHORD PROGRESSION  [ + Add a chord ][ I ][ IV ][ V ]
                   Each chord lasts − 4 beats +
                   NAME YOUR CHORD PROGRESSION AND HEAR IT
                   [Verse____] ▶ Hear it ◌ beat        Place it in the song ▸
     ─────────────────────────────────────────────────────────────────────
     Duplicate  Delete                                              Done

   Made, and come back to (another progression tapped, + New, Chord
   Placement, the window closed and opened): its name, ▶ Hear it and
   Place it head the page with its chords; then the same Choose… and
   Build… (the listening box alone); editing there changes the top.

   • THE LIST — the song's progressions (▶ once round; again, it stops);
     + New; Starters. A song with none shows an empty progression: the
     first chord picked makes it (nothing is saved by just looking).
   • ADD A CHORD — off until pressed (chords played meanwhile are only
     heard: exploring); pressed, it listens ("Play a chord to place it
     here") and every chord played goes in at the end, until a click
     anywhere else in the window (the chords, their changes, More chords…
     aside) turns it off again.
   • CARDS — a tap selects one (heard; its custom rhythm shows on the
     left; a chord played never swaps it), a second tap soon after (a
     double-click), or Enter, opens THE CHORD EDITOR on it. A card: its
     name and notes, its length (− +
     on the selected one: its own length, or back to "Each chord"), what
     it plays as dots. × or Delete removes it; drag it, or ⌥← ⌥→, to
     move it; ← → walk the cards.
   • CHORDS (right) — the panel's board (the same blocks, the same set),
     its keys F D S A G R E Q W 1–5. Under it every change (MOD_FUNCS:
     sus2 add9 sus4 ♭7 maj7 and the inversions) in a row that scrolls
     sideways, each a SWITCH here only — on until tapped again (Z X C V B
     switch theirs); the blocks wear them. A chord HELD plays the rhythm on
     the left, round and round, until let go; a tap is just the chord.
     More chords…, beside the title, opens the chord editor on the
     selected card — with none, a chord to try, placed by Add it.
   • RHYTHM (left) — one rhythm every bar plays (or two bars), in two
     tabs: BUILD YOUR OWN draws it as the beat strip draws a bar — pills
     of dots (a tap: strike → rings on → silence), ⛓ between beats, + −
     sixteenths; the rhythm in notes above, Rhythm Poetry's Simplified
     Kodály words below. PRE-BUILT is the meter's presets, each a line of
     real notation (SW.engrave.rhythm): a tap takes that line and closes
     the list to it; the tab (or the line) opens it again. 1 bar · 2 bars
     on the tabs' row. A selected chord with a custom rhythm shows that
     one instead.
   • THE CHORD EDITOR (#pchord-sheet) — root; quality (Major · Minor ·
     Diminished · Augmented) with the changes beside it; from a
     double-click also Standard / Custom rhythm (the same builder).
   • ▶ HEAR IT — the progression round and round on the audio clock (its
     own little scheduler, the track's strikes); a change while it plays
     takes effect at once, with no gap and no strike played twice.
   • Every change is a step in the song's history (↶ ↷ in the head, ⌘Z).
   • Place it in the song — the first bar with no chords, to the end of
     the melody (or once through past it); the window turns to Chord
     Placement with it selected.
   • CHORD PLACEMENT (phase 3, was "In the song") — the map: below, before the keys.

   • JUST HERE (phase 4) — the window for one chord of the song: below,
     after Chord Placement.

   API  SW.progWin.open(progId?, 'build' | 'song') · openHere(tick) · close() · isOpen() · onTop() · keyDown(e)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const ui = SW.ui;
  const sheet = document.getElementById('prog-sheet');
  if (!sheet || !C || !T) return;
  const body = document.getElementById('pw-body');
  const foot = document.getElementById('pw-foot');
  const songEl = document.getElementById('pw-song');
  const undoBtn = document.getElementById('pw-undo');
  const redoBtn = document.getElementById('pw-redo');
  const CELL = T.CELL;
  const esc = C.escapeHtml;

  let selProg = null;        // the progression open on the right (null: a new one, not made yet)
  let sel = null;            // the selected card's index · 'plus': the Add a chord box, listening · null: nothing (exploring)
  let rtab = 'build';        // the rhythm's tab: 'build' (Build your own) | 'pre' (Pre-built)
  let preOpen = true;        // Pre-built: every line (true), or only the one chosen
  let fresh = null;          // the progression being made now: its page shows as the first time (a guide, top to bottom)
  const latched = new Set(); // the changes switched on under the board (sus2, ♭7, 6/4 …): on until tapped again
  let lastTap = null;        // { i, t }: a card tapped — a second tap on it soon after opens its editor
  const fine = new Set();    // beats shown in sixteenths: scopeKey + ':' + beat
  let showStarters = false;
  let confirmDelete = false;
  let beatOn = false;        // Hear it: the steady beat
  let renderTimer = 0;
  let tab = 'build';         // 'build' (Edit Chords) | 'song' (Chord Placement)
  let selFrom = null;        // Chord Placement: the stretch selected, by the bar it starts on
  let selBars = null;        // Chord Placement: bars selected along the numbers, { a, b }
  let playhead = 1;          // Chord Placement: where ▶ Play the song starts

  const mt = () => SW.meters.byId(S.meter);
  const perBeat = () => mt().beatTicks / CELL;                    // cells in a beat: 4, or 6 in compound time
  const barBeats = () => mt().beats;
  const toTicks = beats => Math.round(beats * mt().beatTicks / CELL) * CELL;
  const cur = () => (selProg ? T.prog(selProg) : null);
  const stepBeats = (p, st) => st.beats || p.beats || barBeats();
  const cycleTicks = p => p.chords.reduce((t, st) => t + toTicks(stepBeats(p, st)), 0);
  const isOpen = () => sheet.classList.contains('show');
  function topSheet() {
    const open = Array.from(document.querySelectorAll('.sheet-backdrop.show'));
    return open.length ? open[open.length - 1] : null;
  }
  function onTop() {
    const top = topSheet();
    return !!top && (top === sheet || top.id === 'here-sheet');
  }

  /* a chord, ready to draw */
  function look(id) {
    const d = id ? C.describe(id) : null;
    if (!d || !d.known) return { name: id ? String(id) : '—', color: '#B9AEC4', ink: '#2B1D38', tones: [], inScale: true, known: false };
    return { name: C.nameOf(d), color: d.color, ink: SW.chordStrip.inkOn(d.color), tones: d.tones, inScale: d.inScale, known: true, d };
  }
  function barText(beats) {
    const r = beats / barBeats();
    if (Math.abs(r - Math.round(r)) < 1e-6) return Math.round(r) === 1 ? '1 bar' : Math.round(r) + ' bars';
    if (Math.abs(r * 2 - Math.round(r * 2)) < 1e-6) return (Math.floor(r) ? Math.floor(r) : '') + '½ bar' + (r > 1 ? 's' : '');
    return '';
  }

  /* the progression on its own, from bar 1 (Hear it, the cards' dots) */
  function fakeGrid() {
    const m = mt();
    return { mt: m, B: m.barTicks, b: m.beatTicks, p0: 0, total: 0, lastBar: 0, T: bar => (bar - 1) * m.barTicks, barAt: t => Math.floor(t / m.barTicks) + 1 };
  }
  function firstPass(p) {
    const len = cycleTicks(p);
    if (!len) return [];
    const g = fakeGrid();
    return T.expand([p], [{ prog: p.id, from: 1, to: Math.ceil(len / g.B) }], g).filter(e => e.pass === 0 && e.at < len);
  }

  /* ================= RHYTHM CELLS ================= */
  /* a hold after silence is silence; the first cell cannot hold on from nothing */
  function sanitize(cells) {
    const a = cells.split('');
    for (let i = 0; i < a.length; i++) if (a[i] === 'O' && (i === 0 || a[i - 1] === 'R')) a[i] = i === 0 ? 'X' : 'R';
    return a.join('');
  }
  /* repeat a rhythm to fill n cells */
  function tile(cells, n) {
    let out = '';
    while (out.length < n) out += cells || 'R';
    return sanitize(out.slice(0, n));
  }
  /* what is being edited: the bar's rhythm, or the selected chord's own */
  function scope() {
    const p = cur();
    const m = mt();
    if (p && typeof sel === 'number' && p.chords[sel] && p.chords[sel].rhythm) {
      const st = p.chords[sel];
      const n = toTicks(stepBeats(p, st)) / CELL;
      return { kind: 'own', key: 'own' + sel, step: sel, st, cells: T.fit(T.cells(st.rhythm) || '', n), beats: n / perBeat(), colour: look(st.chord).color };
    }
    const bars = (p && p.bars) || 1;
    const n = m.barTicks * bars / CELL;
    const c = p && p.rhythm ? T.cells(p.rhythm) : null;
    return { kind: 'bar', key: 'bar', bars, cells: T.fit(c || T.defaultCells(m, bars), n), beats: n / perBeat(), colour: '#9C168E' };
  }
  function writeScope(sc, cells) {
    if (sc.write) { sc.write(T.rhythmOf(sanitize(cells))); return; }        // Just here: its own writer
    const r = T.rhythmOf(sanitize(cells));
    if (sc.kind === 'own') T.setStep(selProg, sc.step, { rhythm: r });
    else T.setProg(ensureProg(), { rhythm: r });
  }
  function needs16(cells, c0) {
    for (let k = c0; k < c0 + perBeat(); k += 2) {
      const cont = cells[k] === 'R' ? 'R' : 'O';
      if (cells[k + 1] !== cont) return true;
    }
    return false;
  }

  /* Simplified Kodály, as Rhythm Poetry counts a beat */
  function sayBeat(cells, c0) {
    const pb = perBeat();
    const s = cells.slice(c0, c0 + pb);
    if (s.indexOf('X') === -1) return s[0] === 'O' ? '-a' : '';
    const halves = [];
    for (let k = 0; k < pb; k += 2) {
      const x0 = s[k] === 'X', x1 = s[k + 1] === 'X';
      halves.push(x0 && x1 ? 'ti-ki' : x0 ? 'ti' : x1 ? 'ki' : '-');
    }
    if (s[0] === 'X' && s[1] !== 'X' && halves.slice(1).every(h => h === '-')) return 'ta';
    return halves.indexOf('-') === -1 ? halves.join('-') : halves.join(' ');
  }
  function sayAll(cells) {
    const words = [];
    for (let c = 0; c < cells.length; c += perBeat()) {
      const w = sayBeat(cells, c);
      if (w === '-a' && words.length) words[words.length - 1] += '-a';
      else words.push(w || '·');
    }
    return words.join(' ');
  }

  /* the rhythm in notes, above each beat */
  const VALUE_ORDER = ['w.', 'w', 'h.', 'h', 'q.', 'q', 'e.', 'e', 's'];
  function spell(nCells) {
    const out = [];
    let t = nCells * CELL;
    while (t >= CELL) {
      const id = VALUE_ORDER.find(v => SW.values.byId(v).ticks <= t);
      out.push(id);
      t -= SW.values.byId(id).ticks;
    }
    return out;
  }
  function beatNotes(cells, b, skip) {
    const pb = perBeat(), c0 = b * pb, c1 = c0 + pb;
    if (skip.until > c0) return { html: '', skip };
    const glyph = (id, rest) => SW.engrave.value(id, { height: 18, rest: !!rest });
    let html = '';
    for (let i = c0; i < c1;) {
      const ch = cells[i];
      let j = i + 1;
      if (ch === 'X') {
        while (j < cells.length && cells[j] === 'O') j++;
        const L = j - i;
        if (i === c0 && L > pb && L % pb === 0) {          // a long note from the beat: drawn once, here
          html += SW.engrave.spellBeats(L / pb, mt().compound).map(id => glyph(id)).join('');
          skip = { until: i + L };
          return { html, skip };
        }
        const end = Math.min(j, c1);
        html += spell(end - i).map(id => glyph(id)).join('');
        i = end;
      } else if (ch === 'R') {
        while (j < c1 && cells[j] === 'R') j++;
        html += spell(j - i).map(id => glyph(id, true)).join('');
        i = j;
      } else {
        while (j < c1 && cells[j] === 'O') j++;              // the end of a note from before
        i = j;
      }
    }
    return { html, skip };
  }

  /* the presets, by meter (rhythm strings), labelled by their counting words */
  const PRESETS = {
    '4/4': ['q q q q', 'h h', 'w', 'q q e e q', 'e e e e e e e e', 'q e e q e e', 'e q e e q e', 'h q q'],
    '3/4': ['q q q', 'h q', 'h.', 'q e e e e', 'e e e e e e', 'q q e e'],
    '2/4': ['q q', 'h', 'e e e e', 'q e e', 'e q e'],
    '6/8': ['q. q.', 'h.', 'e e e e e e', 'q e q e', 'q. e e e'],
    '9/8': ['q. q. q.', 'h._q.', 'h. q.', 'e e e e e e e e e', 'q e q e q e'],
    '12/8': ['q. q. q. q.', 'h. h.', 'w.', 'q e q e q e q e', 'e e e e e e e e e e e e', 'q. q. q e q e']
  };
  function presets(sc) {
    const n = sc.cells.length;
    const seen = new Set();
    return (PRESETS[S.meter] || PRESETS['4/4']).map(str => {
      const cells = tile(T.cells(str), n);
      if (seen.has(cells)) return null;
      seen.add(cells);
      return { cells, label: sayAll(cells) };
    }).filter(Boolean);
  }

  /* ================= DRAWING ================= */
  function render() {
    clearTimeout(renderTimer);
    if (!isOpen()) return;
    const keepScroll = body.querySelector('.pw-main');
    const top = keepScroll ? keepScroll.scrollTop : 0;
    const modRow = body.querySelector('.pw-modrow');
    const modOff = modRow ? modOffset(modRow) : 0;             // where the changes' row is in the list, kept over the redraw
    if (selProg && !cur()) { selProg = null; sel = null; }
    const p = cur();
    if (p && typeof sel === 'number' && sel >= p.chords.length) sel = null;
    const label = document.getElementById('song-chip-label');
    songEl.textContent = label ? '· ' + label.textContent : '';
    syncTabs();
    sheet.classList.toggle('readonly', readOnly());
    body.classList.toggle('song', tab === 'song');
    if (tab === 'song') { renderSong(); syncUndo(); return; }
    body.innerHTML = '<aside class="pw-list">' + listHtml() + '</aside><section class="pw-main">' + mainHtml(p) + '</section>';
    foot.innerHTML = footHtml(p);
    SW.chordStrip.fitLabels(body.querySelector('.pw-board'));
    const main = body.querySelector('.pw-main');
    if (main) main.scrollTop = top;
    syncModRow(modOff);
    paintHearing();
    syncUndo();
  }
  function schedule() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(render, 0);
  }
  const tabsEl = document.getElementById('pw-tabs');
  function syncTabs() {
    if (tabsEl) tabsEl.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  }
  function setTab(t) {
    if (t === tab) return;
    if (t === 'song') stopHear();
    tab = t;
    fresh = null;                // left behind: next time it shows as made
    mdrag = null;
    render();
  }
  if (tabsEl) tabsEl.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) setTab(b.dataset.tab); });

  function whereText(id) {
    const st = T.stretches().filter(r => r.prog === id);
    if (!st.length) return 'not in the song yet';
    return 'in the song: ' + st.map(r => r.to === 'melody' ? 'bar ' + r.from + ' to the end of the melody' : (r.from === r.to ? 'bar ' + r.from : 'bars ' + r.from + '–' + r.to)).join(', ');
  }
  function listHtml() {
    let html = '<p class="pw-kicker">This song</p>';
    T.progressions().forEach(p => {
      const playing = hear.on && hear.id === p.id;
      html += '<div class="pw-pcard' + (p.id === selProg ? ' on' : '') + '" data-prog="' + p.id + '" role="button" tabindex="-1" style="--bd:' + bandOf(p.id).bd + '">' +
        '<div class="pw-pcard-head"><span class="pw-pname">' + esc(p.name) + '</span>' +
        '<button type="button" class="pw-pplay' + (playing ? ' on' : '') + '" data-once="' + p.id + '" title="' + (playing ? 'Stop' : 'Hear ' + esc(p.name) + ' once round') + '" aria-label="' + (playing ? 'Stop' : 'Hear it once round') + '" aria-pressed="' + playing + '">' + (playing ? stopIcon() : playIcon()) + '</button></div>' +
        '<div class="pw-chips">' + (p.chords.length ? p.chords.map(st => { const l = look(st.chord); return '<span class="pw-chip" style="--c:' + l.color + ';--cink:' + l.ink + '">' + C.labelHTML(l.name) + '</span>'; }).join('') : '<span class="pw-none">no chords yet</span>') + '</div>' +
        '<div class="pw-where">' + esc(whereText(p.id)) + '</div></div>';
    });
    if (!selProg) html += '<div class="pw-pcard on draft"><div class="pw-pcard-head"><span class="pw-pname">New progression</span></div><div class="pw-where">its first chord makes it</div></div>';
    html += '<button type="button" class="pw-new">+ New progression</button>';
    html += '<button type="button" class="pw-starters-btn" aria-expanded="' + showStarters + '">Starters ' + (showStarters ? '▴' : '▾') + '</button>';
    if (showStarters) {
      html += '<div class="pw-starters">' + STARTERS.map((s, i) => '<button type="button" class="pw-starter" data-starter="' + i + '"><b>' + esc(s.name) + '</b><span>' + esc(s.show) + '</span></button>').join('') + '</div>';
    }
    html += ui.note('pw.list', 'Progressions keep themselves with the song as you build them. + New starts the next; this one stays in the list.');
    return html;
  }
  const playIcon = () => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>';
  const stopIcon = () => '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" stroke="none"/></svg>';

  /* The page, top to bottom. The first time (a progression being made
     now — the draft, or one made since it was opened): Choose your
     chords and their rhythm → Build your chord progression → Name it and
     hear it, Place it in the song. Made, and come back to: its name,
     ▶ and Place it at the top with its chords, then the same tools. */
  function mainHtml(p) {
    if (readOnly()) {
      if (!p) return '<p class="pw-empty">No chord progressions in this song yet.</p>';
      return headHtml(p) + '<section class="pw-sec"><div class="pw-rhythm">' + rhythmHtml(p) + '</div></section>';
    }
    const first = !p || p.id === fresh;
    let html = first ? '' : headHtml(p);
    html += '<section class="pw-sec pw-choose"><h3 class="pw-h">Choose your chords and their rhythm</h3>' +
      '<div class="pw-duo rhythm-first"><div class="pw-rhythm">' + rhythmHtml(p) + '</div>' +
        '<div class="pw-pick"><div class="pw-pick-head"><p class="pw-kicker">Chords</p><button type="button" class="btn pw-small-btn pw-more-btn">More chords…</button></div>' + boardHtml(true) + '</div></div>' +
      '</section>';
    // right under the chords: its title and Each chord stacked as one narrow block, then the chords four to a
    // row, Add a chord in the next place after them (it moves along as they come)
    html += '<section class="pw-sec pw-build"><div class="pw-build-row">' +
        '<div class="pw-build-head"><h3 class="pw-h">Build your chord progression</h3>' + eachHtml(p) + '</div>' +
        '<div class="pw-cards pw-grid">' + (first && p ? cardsHtml(p) : '') + plusHtml() + '</div>' +
      '</div>' +
      (p && p.chords.length ? ui.note('pw.build2', '<b>Double-click</b> a chord to change it or give it a rhythm of its own; drag one to move it.') : '') +
      '</section>';
    if (first) html += '<section class="pw-sec pw-finish"><h3 class="pw-h">Name your chord progression and hear it</h3>' + nameRowHtml(p) + '</section>';
    return html;
  }
  /* made, and come back to: its name, ▶ and Place it, then its chords */
  function headHtml(p) {
    return '<section class="pw-sec pw-headsec">' + nameRowHtml(p) +
      (p.chords.length ? '<div class="pw-cards">' + cardsHtml(p) + '</div>' : '<p class="pw-none">No chords yet — play one below.</p>') +
    '</section>';
  }
  function nameRowHtml(p) {
    const name = p ? p.name : 'Progression ' + (T.progressions().length + 1);
    const hearingThis = hear.on && !hear.once && p && hear.id === p.id;
    return '<div class="pw-namerow">' +
      '<input class="pw-name text-field" type="text" maxlength="24" value="' + esc(name) + '" aria-label="The progression’s name"' + (p ? '' : ' placeholder="' + esc(name) + '"') + (readOnly() ? ' readonly tabindex="-1"' : '') + '>' +
      '<button type="button" class="pw-hear' + (hearingThis ? ' on' : '') + '"' + (p && p.chords.length ? '' : ' disabled') + ' title="Hear it round and round (Space)">' + (hearingThis ? '<span class="sq"></span> Stop' : playIcon() + ' Hear it') + '</button>' +
      '<label class="pw-beat"><input type="checkbox" class="pw-beat-box"' + (beatOn ? ' checked' : '') + '> beat</label>' +
      (readOnly() ? '' : '<span class="pw-gap"></span><button type="button" class="btn pw-put"' + (p && p.chords.length ? '' : ' disabled') + ' title="Put it in the song, from the first bar with no chords — then Chord Placement shows where">Place it in the song ▸</button>') +
    '</div>';
  }
  function eachHtml(p) {
    const each = p ? (p.beats || barBeats()) : barBeats();
    return '<div class="pw-each"><span class="pw-each-label">Each chord lasts</span><span class="pw-each-row">' +
      '<span class="pw-stepper"><button type="button" data-each="-1" aria-label="Shorter"' + (each <= 1 ? ' disabled' : '') + '>−</button><b>' + each + (each === 1 ? ' beat' : ' beats') + '</b><button type="button" data-each="1" aria-label="Longer"' + (each >= 16 ? ' disabled' : '') + '>+</button></span>' +
      '<small>' + esc(barText(each)) + '</small></span></div>';
  }
  function cardsHtml(p) {
    const passes = firstPass(p);
    return p.chords.map((st, i) => cardHtml(p, st, i, passes)).join('');
  }
  /* Add a chord: nothing is placed until it is pressed (play chords freely
     till then). Pressed, it listens — "Play a chord to place it here" — and
     every chord played goes in at the end, until a press anywhere else. */
  function plusHtml() {
    const on = sel === 'plus';
    return '<div class="pw-card plus' + (on ? ' on listening' : '') + '" data-card="plus" role="button" aria-pressed="' + on + '" title="' + (on ? 'Listening: each chord you play goes in at the end. Tap anywhere else to stop.' : 'Tap, then play a chord: it goes in at the end') + '">' +
      (on ? '<span class="pw-listen" aria-hidden="true">♪</span><small>Play a chord to place it here</small>' : '<span class="pw-plus">+</span><small>Add a chord</small>') + '</div>';
  }

  function cardHtml(p, st, i, passes) {
    const l = look(st.chord);
    const on = sel === i;
    const beats = stepBeats(p, st);
    const ev = passes.find(e => e.step === i);
    const tones = l.tones.map(t => '<i style="--c:' + t.color + ';color:' + SW.chordStrip.inkOn(t.color) + '">' + esc(C.toneText(t)) + '</i>').join('');
    let dots = '';
    if (ev) {
      const W = 96, span = ev.end - ev.at || 1;
      const col = st.rhythm ? l.color : '#B8AAC6';
      dots = '<svg class="pw-mini" viewBox="0 0 ' + W + ' 12" aria-hidden="true">' + ev.strikes.map(s => {
        const x = 5 + (s.at - ev.at) / span * (W - 10), x2 = 5 + (s.at + s.len - ev.at) / span * (W - 10) - 3;
        return (x2 > x + 5 ? '<line x1="' + x.toFixed(1) + '" y1="6" x2="' + x2.toFixed(1) + '" y2="6" stroke="' + col + '" stroke-width="2" stroke-linecap="round"/>' : '') +
          '<circle cx="' + x.toFixed(1) + '" cy="6" r="3.3" fill="' + col + '"/>';
      }).join('') + '</svg>';
    }
    const ro = readOnly();
    return '<div class="pw-card' + (on ? ' on' : '') + (l.inScale ? '' : ' out') + (l.known ? '' : ' unknown') + '" data-card="' + i + '" style="--c:' + l.color + ';--cink:' + l.ink + '" role="button" title="' + esc((l.known ? l.d.roman + ' — ' + l.d.letter + ' · ' + l.tones.map(t => t.name).join(' ') : 'A chord the app cannot read') + (ro ? '' : ' — double-click to change it')) + '">' +
      '<div class="pw-card-top">' + C.labelHTML(l.name) + '</div>' +
      (on ? '<button type="button" class="pw-card-x" data-x="' + i + '" title="Take it out (Delete)" aria-label="Take this chord out">×</button>' : '') +
      '<div class="pw-card-tones">' + tones + '</div>' +
      '<div class="pw-card-len' + (st.beats ? ' own' : '') + '">' +
        (on ? '<button type="button" data-len="-1" aria-label="Shorter"' + (beats <= 1 ? ' disabled' : '') + '>−</button>' : '') +
        '<span>' + beats + (beats === 1 ? ' beat' : ' beats') + '</span>' +
        (on ? '<button type="button" data-len="1" aria-label="Longer"' + (beats >= 16 ? ' disabled' : '') + '>+</button>' : '') +
      '</div>' + dots +
      (st.rhythm ? '<span class="pw-own-tag">custom rhythm</span>' : '') +
    '</div>';
  }

  /* the panel's board; `latch` (the Edit Chords page): every change under
     it, sideways, each on until tapped again — and the blocks wear them */
  function boardHtml(latch) {
    const offered = C.offered();
    let rows = '';
    C.SHAPE.forEach(row => {
      const cells = row.filter(cell => offered.indexOf(cell.place) !== -1).map(cell => blockFor(cell.place, cell.w, latch)).join('');
      if (cells) rows += '<div class="crow">' + cells + '</div>';
    });
    return '<div class="pw-board' + (latch ? ' latch' : '') + '">' +
      '<div class="strip-tower">' + (rows || '<p class="strip-empty">No chords in this set are switched on in Layout settings</p>') + '</div>' +
      (latch ? modRowHtml() : '<div class="strip-mods" role="group" aria-label="Chord buttons Z X C V B">' + C.SLOT_KEYS.map(SW.chordStrip.modTabHtml).join('') + '</div>') +
    '</div>';
  }
  /* Just here's Pick a chord: its title with its buttons beside it, the board (tabs held), the ⓘ note under it */
  function pickHtml(buttons, note) {
    return '<div class="pw-pick"><div class="pw-pick-head"><p class="pw-kicker">Pick a chord</p>' + buttons + '</div>' +
      boardHtml(false) + '<div class="pw-pick-note">' + note + '</div></div>';
  }
  function blockFor(place, w, latch) {
    const e = C.entry(place);
    return SW.chordStrip.blockHtml(latch ? Object.assign({}, e, { spec: withLatched(e.spec) }) : e, w, { noEdit: true });
  }
  const keyOfMod = id => C.SLOT_KEYS.find(K => { const f = C.slotFunc(K); return f && f.id === id; }) || '';
  /* The changes go round and round: the row is the list five times over
     and rests in the middle copy — when a scroll settles it is put back
     there, at the same place in the list, unseen — so left or right it
     never runs out (after 4/2 comes sus2 again). The copies are only for
     the eye (aria-hidden); a list that fits whole shows once, no arrows. */
  const MOD_COPIES = 5, MOD_HOME = 2;
  function modRowHtml() {
    let chips = '';
    for (let c = 0; c < MOD_COPIES; c++) {
      chips += C.MOD_FUNCS.map(f => {
        const on = latched.has(f.id), K = keyOfMod(f.id);
        return '<button type="button" class="cmod pw-mod' + (on ? ' on' : '') + (c === MOD_HOME ? '' : ' copy') + '" data-latch="' + f.id + '" aria-pressed="' + on + '"' + (c === MOD_HOME ? '' : ' aria-hidden="true" tabindex="-1"') + ' title="' + esc(f.does + (K ? ' — or press ' + K : '') + '. On until you tap it again.') + '">' +
          '<b class="cmod-key">' + (K || '&nbsp;') + '</b><span class="cmod-name">' + C.modLabelHTML(f) + '</span></button>';
      }).join('');
    }
    return '<div class="pw-mods">' +
      '<button type="button" class="pw-modnav" data-modnav="-1" aria-label="More changes to the left">‹</button>' +
      '<div class="pw-modrow" role="group" aria-label="Changes — each stays on until you tap it again">' + chips + '</div>' +
      '<button type="button" class="pw-modnav" data-modnav="1" aria-label="More changes to the right">›</button>' +
    '</div>';
  }
  /* one turn of the list: a chip to the same chip in the next copy */
  function modPeriod(row) {
    const a = row.children[0], b = row.children[C.MOD_FUNCS.length];
    return a && b ? b.offsetLeft - a.offsetLeft : 0;
  }
  function modOffset(row) {
    const P = modPeriod(row);
    return P > 0 ? ((row.scrollLeft % P) + P) % P : 0;
  }
  /* back to the middle copy at the same place in the list */
  function homeModRow(row) {
    const P = modPeriod(row);
    if (P <= 0 || row.parentNode.classList.contains('fits')) return;
    const want = MOD_HOME * P + modOffset(row);
    if (Math.abs(row.scrollLeft - want) > 0.5) row.scrollLeft = want;
  }
  function syncModRow(offset) {
    const row = body.querySelector('.pw-modrow');
    if (!row) return;
    row.parentNode.classList.remove('fits');
    const P = modPeriod(row);
    const fits = P > 0 && P <= row.clientWidth + 2;
    row.parentNode.classList.toggle('fits', fits);
    row.scrollLeft = fits ? 0 : MOD_HOME * P + (offset || 0);
  }
  let modTimer = 0;

  /* ================= THE CHANGES, LATCHED ================= */
  /* the chord with every change switched on (one inversion at a time) */
  function withLatched(spec) {
    if (!latched.size) return spec;
    let mods = spec.mods.slice();
    C.MOD_FUNCS.forEach(f => {
      if (!latched.has(f.id) || mods.indexOf(f.id) !== -1) return;
      if (f.inv) mods = mods.filter(id => !C.MOD_BY_ID[id].inv);
      mods.push(f.id);
    });
    return Object.assign({}, spec, { mods: C.MOD_FUNCS.map(x => x.id).filter(id => mods.indexOf(id) !== -1) });
  }
  function toggleLatch(id) {
    const f = C.MOD_BY_ID[id];
    if (!f) return;
    if (latched.has(id)) latched.delete(id);
    else {
      if (f.inv) C.MOD_FUNCS.forEach(x => { if (x.inv) latched.delete(x.id); });
      latched.add(id);
    }
    const board = body.querySelector('.pw-board.latch');
    if (!board) return;
    board.querySelectorAll('[data-latch]').forEach(b => { const on = latched.has(b.dataset.latch); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    relabelBoard(board);
  }

  function rhythmHtml(p) {
    const sc = scope();
    let html = '<div class="pw-rhead">';
    if (sc.kind === 'own') {
      html += '<p class="pw-kicker">Rhythm <span class="pw-sub">— ' + C.labelHTML(look(sc.st.chord).name) + '’s custom rhythm</span></p>' +
        '<span class="pw-gap"></span>' +
        '<div class="seg"><button type="button" class="seg-btn" data-own="off">Standard rhythm</button><button type="button" class="seg-btn active">Custom rhythm</button></div>';
    } else {
      html += '<p class="pw-kicker">Rhythm <span class="pw-sub">— every bar plays</span></p>';
    }
    return html + '</div>' + rhythmTabsHtml(sc);
  }

  /* the rhythm's two tabs — Build your own (the pills) · Pre-built (lines
     of notes) — over the box that shows the one chosen. Listen only: the
     rhythm as it is, no tabs. */
  const shownTab = () => (readOnly() ? 'build' : rtab);
  function rhythmTabsHtml(sc) {
    const t = shownTab();
    const tabBtn = (id, label) => '<button type="button" class="pw-rtab' + (t === id ? ' on' : '') + '" data-rtab="' + id + '" role="tab" aria-selected="' + (t === id) + '">' + label + '</button>';
    const bars = sc.kind === 'bar'
      ? '<div class="seg pw-bars" role="group" aria-label="How long the rhythm is"><button type="button" class="seg-btn' + (sc.bars === 2 ? '' : ' active') + '" data-bars="1">1 bar</button><button type="button" class="seg-btn' + (sc.bars === 2 ? ' active' : '') + '" data-bars="2">2 bars</button></div>'
      : '';
    return (readOnly() ? '' : '<div class="pw-rtabs" role="tablist" aria-label="Build a rhythm, or pick a pre-built one">' + tabBtn('build', 'Build your own') + tabBtn('pre', 'Pre-built') + bars + '</div>') +
      '<div class="pw-rbox' + (readOnly() ? ' solo' : '') + (t === 'pre' ? ' pre' : '') + '" role="tabpanel">' + (t === 'pre' ? prebuiltHtml(sc) : stripHtml(sc)) + '</div>';
  }
  /* Pre-built: the meter's presets as lines of real notation, the one playing lit.
     A line chosen closes the list to it; the Pre-built tab (or the line) opens it again. */
  function prebuiltHtml(sc) {
    const m = mt();
    const o = { perBeat: perBeat(), barCells: m.barTicks / CELL, compound: m.compound, top: m.top, bottom: m.bottom, ss: 8 };
    const list = presets(sc);
    const chosen = list.find(pr => pr.cells === sc.cells);
    const closed = !preOpen && chosen;
    return '<div class="pw-lines' + (closed ? ' closed' : '') + '">' + (closed ? [chosen] : list).map(pr => {
      const on = pr.cells === sc.cells;
      return '<button type="button" class="pw-line' + (on ? ' on' : '') + '" data-preset="' + pr.cells + '" title="' + esc(pr.label) + (closed ? ' — tap for every rhythm' : '') + '" aria-label="' + esc(pr.label) + '" aria-pressed="' + on + '">' +
        SW.engrave.rhythm(pr.cells, o) + (closed ? '<span class="pw-line-more" aria-hidden="true">▾</span>' : '') + '</button>';
    }).join('') + '</div>';
  }

  /* the pills: the beat strip's look, on a string of cells */
  function stripHtml(sc) {
    const pb = perBeat();
    const cells = sc.cells;
    const beats = Math.round(sc.beats);
    const B = barBeats();
    const rows = beats > B;                // more than a bar: each bar on its own line, its first beat's ⛓ leading it
    let html = '<div class="pw-strip' + (rows ? ' bars' : '') + '">';
    let skip = { until: 0 };
    for (let b = 0; b < beats; b++) {
      const c0 = b * pb;
      const sixteen = fine.has(sc.key + ':' + b) || needs16(cells, c0);
      const d = sixteen ? pb : pb / 2, span = pb / d;
      if (rows && b % B === 0) html += (b ? '</div>' : '') + '<div class="pw-barrow">' + (b ? '' : '<span class="pw-chain-gap" aria-hidden="true"></span>');
      if (b > 0) {
        const joined = cells[c0] === 'O';
        const can = joined || (cells[c0 - 1] !== 'R' && cells[c0] === 'X');
        html += '<button type="button" class="bb-chain' + (joined ? ' on' : '') + '" data-join="' + b + '"' + (can ? '' : ' disabled') + ' title="' + (joined ? 'Joined — the strike rings on over the beat line; tap to strike again here' : 'Join to the beat before — the strike rings on over the beat line') + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></button>';
      }
      const notes = beatNotes(cells, b, skip);
      skip = notes.skip;
      html += '<div class="bb-beat pw-beatcol" style="--c:' + sc.colour + '">' +
        '<div class="pw-notes">' + notes.html + '</div>' +
        '<div class="bb-pill d' + d + '">';
      for (let i = 0; i < d; i++) {
        const c = c0 + i * span;
        const ch = cells[c];
        const cls = ch === 'X' ? 'on' : ch === 'O' ? 'hold' : 'rest';
        const title = ch === 'X' ? 'A strike — tap: it rings on from before' : ch === 'O' ? 'Ringing on — tap: silence' : 'Silence — tap: a strike';
        html += '<button type="button" class="bb-dot ' + cls + '" data-cell="' + c + '" data-span="' + span + '" style="--c:' + sc.colour + '" title="' + title + '"></button>';
      }
      html += '</div>' +
        '<div class="pw-say">' + esc(sayBeat(cells, c0)) + '</div>' +
        '<div class="bb-pm">' +
          '<button type="button" class="bb-fine" data-coarse="' + b + '"' + (sixteen ? '' : ' disabled') + ' title="Eighths — sixteenths move onto the eighth before them" aria-label="Eighths">−</button>' +
          '<button type="button" class="bb-fine" data-fine="' + b + '"' + (sixteen ? ' disabled' : '') + ' title="Sixteenths in this beat" aria-label="Sixteenths">+</button></div>' +
      '</div>';
    }
    return html + (rows ? '</div>' : '') + '</div>';
  }

  function footHtml(p) {
    if (confirmDelete && p) {
      const where = T.stretches().some(r => r.prog === p.id);
      return '<span class="pw-confirm">Delete ' + esc(p.name) + (where ? ' and take it out of the song' : '') + '?</span>' +
        '<button type="button" class="btn btn-danger-solid" data-act="delete-yes">Delete</button>' +
        '<button type="button" class="btn" data-act="delete-no">Keep it</button>';
    }
    return '<button type="button" class="btn" data-act="duplicate"' + (p ? '' : ' disabled') + '>Duplicate</button>' +
      '<button type="button" class="btn pw-ghost" data-act="delete"' + (p ? '' : ' disabled') + '>Delete</button>' +
      '<span class="pw-gap"></span>' +
      '<button type="button" class="btn btn-primary" data-act="done">Done</button>';
  }

  function syncUndo() {
    if (!SW.history) return;
    undoBtn.disabled = !SW.history.canUndo();
    redoBtn.disabled = !SW.history.canRedo();
  }

  /* ================= CHANGING THINGS ================= */
  /* the progression open, made now if it is new */
  function ensureProg(first) {
    if (cur()) return selProg;
    const name = (body.querySelector('.pw-name') || {}).value;
    const spec = { chords: first ? [first] : [] };
    if (name && name.trim() && name.trim() !== 'Progression ' + (T.progressions().length + 1)) spec.name = name.trim();
    selProg = T.addProg(spec);
    fresh = selProg;                                     // being made now: the first-time page
    return selProg;
  }

  /* a chord played (the board, its key): always heard — held, in the
     rhythm on the left — and placed at the end only while Add a chord
     listens. A selected card is never swapped by it: playing chords to
     explore changes nothing (double-click a card to change it). */
  function pick(place, holder) {
    const e = C.entry(place);
    if (!e) return;
    if (C.offered().indexOf(place) === -1) {
      ui.toast(C.placeShown(place) ? 'That chord is switched off in Layout settings' : 'That chord is outside the ' + C.CHORD_SETS[C.setIndex()].name + ' set — the set button on the panel shows more');
      return;
    }
    const id = C.toId(withLatched(C.withHeld(e.spec)));
    startPreview(id, place, holder);
    if (sel !== 'plus') return;
    const step = { chord: id };
    if (!C.heldMods.size && !latched.size) step.place = place;   // the panel's own chord: it follows the scale (D16)
    addChord(step);
  }
  /* a chord at the end (the progression made by its first) */
  function addChord(step) {
    const p = cur();
    if (!p) ensureProg(step);
    else T.insertStep(p.id, p.chords.length, step);
  }
  /* the block a finger or key holds: lit while it sounds */
  function lightBlock(place, on) {
    body.querySelectorAll('.pw-board .cblock').forEach(b => { if (b.dataset.place === place || !on) b.classList.toggle('is-on', on && b.dataset.place === place); });
  }
  /* Add a chord stops listening at a press anywhere else in the window —
     the chords, their changes and More chords… aside — a sign the player
     wants more time to explore. A click, not a press, so scrolling never
     counts. */
  sheet.addEventListener('click', e => {
    if (sel !== 'plus' || tab !== 'build' || !isOpen()) return;
    if (e.target.closest && e.target.closest('.pw-board, .pw-card.plus, .pw-more-btn, .note-i')) return;
    sel = null;
    schedule();
  }, true);
  function selectCard(i) {
    sel = i;
    const p = cur();
    if (p && typeof i === 'number' && p.chords[i]) {
      const id = p.chords[i].chord;
      if (id && C.isKnown(id)) C.play(id, 'progression');
    }
    render();
  }
  /* ← →: walk the chords (from nothing: the first, or the last) */
  function stepSel(d) {
    const p = cur();
    const n = p ? p.chords.length : 0;
    if (!n) return;
    const i = typeof sel === 'number' ? sel + d : (d > 0 ? 0 : n - 1);
    selectCard(Math.max(0, Math.min(n - 1, i)));
  }
  function moveSel(d) {
    const p = cur();
    if (!p || typeof sel !== 'number') return;
    const j = sel + d;
    if (j < 0 || j >= p.chords.length) return;
    T.moveStep(p.id, sel, j);
    sel = j;
  }
  function removeSel() {
    const p = cur();
    if (!p || typeof sel !== 'number') return;
    const i = sel;
    T.removeStep(p.id, i);
    const left = T.prog(p.id);
    sel = left && i < left.chords.length ? i : null;
  }
  /* a chord's own length; a chord with its own rhythm keeps it, repeated or cut to fit */
  function setLength(i, d) {
    const p = cur();
    if (!p || !p.chords[i]) return;
    const st = p.chords[i];
    const now = stepBeats(p, st);
    const next = Math.max(1, Math.min(16, now + d));
    if (next === now) return;
    const patch = { beats: next === (p.beats || barBeats()) ? null : next };
    if (st.rhythm) {
      // longer: its rhythm repeats by the bar (or as a whole, when shorter than a bar); shorter: it is cut
      const old = T.cells(st.rhythm) || '';
      const bar = mt().barTicks / CELL;
      const unit = old.length >= bar ? old.slice(0, Math.floor(old.length / bar) * bar) : old;
      patch.rhythm = T.rhythmOf(next > now ? tile(unit, toTicks(next) / CELL) : sanitize(old.slice(0, toTicks(next) / CELL)));
    }
    T.setStep(p.id, i, patch);
  }
  function setEach(d) {
    const id = ensureProg();
    const p = T.prog(id);
    const now = p.beats || barBeats();
    const next = Math.max(1, Math.min(16, now + d));
    if (next === now) return;
    T.setProg(id, { beats: next === barBeats() ? null : next });
  }
  /* a chord's own rhythm, on or off (the selected card, or the editor's): on, a copy of what it was playing */
  function giveOwnRhythm(on, progId, idx) {
    const p = T.prog(progId || selProg);
    const i = idx === undefined ? sel : idx;
    if (!p || typeof i !== 'number' || !p.chords[i]) return;
    const st = p.chords[i];
    if (!on) { T.setStep(p.id, i, { rhythm: null }); return; }
    const ev = firstPass(p).find(e => e.step === i);
    const n = toTicks(stepBeats(p, st)) / CELL;
    const a = 'R'.repeat(n).split('');
    if (ev) ev.strikes.forEach(s => {
      const k0 = (s.at - ev.at) / CELL;
      for (let k = 0; k < s.len / CELL; k++) if (k0 + k < n) a[k0 + k] = k ? 'O' : 'X';
    });
    T.setStep(p.id, i, { rhythm: T.rhythmOf(sanitize(a.join(''))) });
  }

  function tapDot(c, span, sc) {
    sc = sc || scope();
    const a = sc.cells.split('');
    const prevSounding = c > 0 && a[c - 1] !== 'R';
    const next = a[c] === 'X' ? (prevSounding ? 'O' : 'R') : a[c] === 'O' ? 'R' : 'X';
    a[c] = next;
    for (let k = 1; k < span; k++) a[c + k] = next === 'R' ? 'R' : 'O';
    writeScope(sc, a.join(''));
  }
  function toggleJoin(b, sc) {
    sc = sc || scope();
    const c0 = b * perBeat();
    const a = sc.cells.split('');
    if (a[c0] === 'O') a[c0] = 'X';
    else if (a[c0 - 1] !== 'R' && a[c0] === 'X') a[c0] = 'O';
    else return;
    writeScope(sc, a.join(''));
  }
  function coarsen(b, sc, redraw) {
    sc = sc || scope();
    fine.delete(sc.key + ':' + b);
    const pb = perBeat(), c0 = b * pb;
    const a = sc.cells.split('');
    for (let k = c0; k < c0 + pb; k += 2) {
      if (a[k] === 'R' && a[k + 1] === 'X') { a[k] = 'X'; a[k + 1] = 'O'; }
      else if (a[k] !== 'R') a[k + 1] = 'O';
      else a[k + 1] = 'R';
    }
    const out = a.join('');
    if (out !== sc.cells) writeScope(sc, out); else (redraw || render)();
  }
  /* a tap on the rhythm (its tabs, the strip, a pre-built line), whichever rhythm `sc` is */
  function rhythmClick(b, sc, redraw) {
    if (b.dataset.rtab) { rtab = b.dataset.rtab; if (rtab === 'pre') preOpen = true; redraw(); return true; }   // Pre-built, pressed: every line again
    if (b.dataset.preset) {
      if (b.dataset.preset === sc.cells) { preOpen = !preOpen; redraw(); return true; }     // the line chosen: open the list, or close it to that line
      preOpen = false;
      writeScope(sc, b.dataset.preset);
      return true;
    }
    if (b.dataset.bars) { if (sc.kind === 'bar') setTwoBars(b.dataset.bars === '2'); return true; }
    if (b.dataset.join !== undefined) { toggleJoin(Number(b.dataset.join), sc); return true; }
    if (b.dataset.fine !== undefined) { fine.add(sc.key + ':' + b.dataset.fine); redraw(); return true; }
    if (b.dataset.coarse !== undefined) { coarsen(Number(b.dataset.coarse), sc, redraw); return true; }
    if (b.dataset.cell !== undefined) { tapDot(Number(b.dataset.cell), Number(b.dataset.span) || 1, sc); return true; }
    return false;
  }
  function setTwoBars(on) {
    if (((cur() && cur().bars) || 1) === (on ? 2 : 1)) return;
    const id = ensureProg();
    const p = T.prog(id);
    const m = mt();
    const one = m.barTicks / CELL;
    const cells = T.fit(T.cells(p.rhythm) || T.defaultCells(m, p.bars || 1), one * (p.bars || 1));
    const next = on ? cells.slice(0, one) + cells.slice(0, one) : cells.slice(0, one);
    T.setProg(id, { bars: on ? 2 : null, rhythm: T.rhythmOf(sanitize(next)) });
  }

  /* the Starters (DECISIONS D19): roman numerals, so they fit every key */
  const STARTERS = [
    { name: 'Pop', show: 'I V vi IV', chords: ['I', 'V', 'vi', 'IV'] },
    { name: '’50s', show: 'I vi IV V', chords: ['I', 'vi', 'IV', 'V'] },
    { name: 'Sad pop', show: 'vi IV I V', chords: ['vi', 'IV', 'I', 'V'] },
    { name: 'Three chords', show: 'I IV V I', chords: ['I', 'IV', 'V', 'I'] },
    { name: 'Folk', show: 'I IV I V', chords: ['I', 'IV', 'I', 'V'] },
    { name: 'Pachelbel', show: 'I V vi iii IV I IV V', chords: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'], half: true },
    { name: '12-bar blues', show: 'I7 ×4 · IV7 IV7 I7 I7 · V7 IV7 I7 V7', chords: ['I7', 'I7', 'I7', 'I7', 'IV7', 'IV7', 'I7', 'I7', 'V7', 'IV7', 'I7', 'V7'] },
    { name: 'ii–V–I', show: 'ii7 V7 Imaj7', chords: ['ii7', 'V7', 'Imaj7'], lastLong: true },
    { name: 'Andalusian', show: 'i ♭VII ♭VI V — best in a minor scale', chords: ['i', 'bVII', 'bVI', 'V'] }
  ];
  function useStarter(i) {
    const s = STARTERS[i];
    if (!s) return;
    // a chord the panel has on a key keeps that key (so it follows the scale)
    const placeOf = {};
    C.PLACES.forEach(pl => { const e = C.entry(pl); if (e) { const id = C.toId(e.spec); if (!placeOf[id]) placeOf[id] = pl; } });
    const B = barBeats();
    const spec = { name: freeName(s.name), chords: s.chords.map((id, k) => {
      const st = { chord: C.toId(id) || id };
      if (placeOf[st.chord]) st.place = placeOf[st.chord];
      if (s.lastLong && k === s.chords.length - 1) st.beats = 2 * B;
      return st;
    }) };
    if (s.half && B % 2 === 0) spec.beats = B / 2;
    selProg = T.addProg(spec);
    fresh = selProg;
    sel = null;
    showStarters = false;
  }
  function freeName(base) {
    const names = new Set(T.progressions().map(p => p.name));
    if (!names.has(base)) return base;
    let n = 2;
    while (names.has(base + ' ' + n)) n++;
    return base + ' ' + n;
  }

  /* Put it in the song: the first bar with no chords, to the end of the
     melody (or once through, past it) — then the map, with it selected. */
  function putInSong() {
    const p = cur();
    if (!p || !p.chords.length) return;
    const g = T.grid();
    const evs = T.events(g);
    let from = 1;
    const covered = b => evs.some(e => e.at < g.T(b + 1) && e.end > g.T(b));
    while (covered(from) && from < 999) from++;
    T.place(p.id, from);
    selFrom = from;
    selBars = null;
    playhead = from;
    stopHear();
    tab = 'song';
    fresh = null;
    render();
  }

  /* ================= HEAR IT ================= */
  /* Its own little scheduler on the audio clock: the progression's
     strikes (the same expansion the player uses) laid down a second or so
     ahead, round and round. `once`: one time through (the list's ▶). */
  const hear = { on: false };
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function hearBuild() {
    const p = T.prog(hear.id);
    if (!p) { stopHear(); return; }
    const g = fakeGrid();
    const len = cycleTicks(p);
    if (!len) { hear.events = []; hear.period = g.B; return; }
    const pat = g.B * (p.bars || 1);
    let period = hear.once ? len : len / gcd(len, pat) * pat;          // the progression and the rhythm both come round
    if (period > 64 * g.B) period = Math.ceil(len / g.B) * g.B;
    hear.events = T.expand([p], [{ prog: p.id, from: 1, to: Math.ceil(period / g.B) }], g)
      .filter(e => e.at < period)
      .map(e => {
        const list = e.id && C.isKnown(e.id) ? C.midis(e.id) : [];
        return { at: e.at, end: Math.min(e.end, period), step: e.step, id: e.id, list, freqs: list.map(SW.music.midiToFreq),
          strikes: e.strikes.filter(s => s.at < period).map(s => ({ at: s.at, len: Math.min(s.len, period - s.at) })) };
      });
    hear.period = period;
  }
  function startHear(id, once) {
    stopHear();
    if (SW.player && SW.player.playing) SW.player.stop();
    const p = T.prog(id);
    if (!p || !cycleTicks(p)) return;
    const ac = SW.audio.context();
    Object.assign(hear, { on: true, id, once: !!once, t0: ac.currentTime + 0.12, tickSec: SW.timing.tickMs() / 1000, cursor: 0, passStart: 0, voices: [], lit: null, timer: 0, endAt: 0 });
    hearBuild();
    pump();
    render();
  }
  function stopHear() {
    if (!hear.on) return;
    clearTimeout(hear.timer);
    (hear.voices || []).forEach(v => { try { v.o.stop(); } catch (e) {} });
    hear.on = false;
    hear.voices = [];
    hear.lit = null;
    paintHearing();
    const b = body.querySelector('.pw-hear');
    if (b) { b.classList.remove('on'); b.innerHTML = playIcon() + ' Hear it'; }
  }
  function hearSchedule(from, to) {
    const base = hear.passStart;
    const m = mt();
    hear.events.forEach(ev => {
      if (!ev.freqs.length) return;
      ev.strikes.forEach(st => {
        const abs = base + st.at;
        if (abs < from || abs >= to) return;
        const when = hear.t0 + abs * hear.tickSec, hold = st.len * hear.tickSec * 0.95;
        SW.audio.playChordFrequencies(ev.freqs, when, hold).forEach(o => hear.voices.push({ o, start: when, end: when + hold + 0.1 }));
      });
    });
    if (beatOn) {
      const bt = m.beatTicks;
      for (let t = Math.ceil((from - base) / bt) * bt + base; t < to; t += bt) {
        const when = hear.t0 + t * hear.tickSec;
        const o = SW.audio.click(when, ((t - base) % m.barTicks + m.barTicks) % m.barTicks === 0, true);
        if (o) hear.voices.push({ o, start: when, end: when + 0.1 });
      }
    }
  }
  function pump() {
    if (!hear.on) return;
    const ac = SW.audio.context();
    const now = ac.currentTime;
    const horizon = (now + 1.2 - hear.t0) / hear.tickSec;
    let guard = 0;
    while (hear.cursor < horizon && guard++ < 64) {
      const passEnd = hear.passStart + hear.period;
      const upTo = Math.min(horizon, passEnd);
      hearSchedule(hear.cursor, upTo);
      hear.cursor = upTo;
      if (upTo >= passEnd) {
        if (hear.once) { hear.endAt = hear.t0 + passEnd * hear.tickSec; hear.cursor = Infinity; break; }
        hear.passStart = passEnd;
      }
    }
    hear.voices = hear.voices.filter(v => v.end > now);
    // the card sounding lights
    const lat = ac.outputLatency || ac.baseLatency || 0;
    const a = (now - lat - hear.t0) / hear.tickSec;
    if (a >= 0) {
      const start = a >= hear.passStart ? hear.passStart : hear.passStart - hear.period;
      const pos = a - start;
      const ev = hear.events.find(e => e.at <= pos && pos < e.end);
      const lit = ev ? ev.step : null;
      if (lit !== hear.lit) { hear.lit = lit; paintHearing(); }
    }
    if (hear.once && hear.endAt && now > hear.endAt + 0.15) { stopHear(); render(); return; }
    hear.timer = setTimeout(pump, 40);
  }
  /* the progression changed while it plays: from this moment on it plays
     the new one — what is ringing rings on, nothing is struck twice */
  function rehear() {
    if (!hear.on) return;
    if (!T.prog(hear.id) || !cycleTicks(T.prog(hear.id))) { stopHear(); return; }
    const ac = SW.audio.context();
    const now = ac.currentTime;
    hear.voices = hear.voices.filter(v => {
      if (v.start > now) { try { v.o.stop(); } catch (e) {} return false; }
      return true;
    });
    const a = Math.max(0, (now - hear.t0) / hear.tickSec);
    const start = a >= hear.passStart ? hear.passStart : hear.passStart - hear.period;
    hear.passStart = start;
    hearBuild();
    if (a - hear.passStart >= hear.period) hear.passStart = a;          // shorter now than where it was: round again from here
    hear.cursor = a;
    if (hear.once) hear.endAt = 0;
  }
  function paintHearing() {
    body.querySelectorAll('.pw-card.sounding').forEach(c => c.classList.remove('sounding'));
    if (!hear.on || hear.lit === null || hear.lit === undefined || hear.id !== selProg) return;
    const c = body.querySelector('.pw-card[data-card="' + hear.lit + '"]');
    if (c) c.classList.add('sounding');
  }
  function toggleHear() {
    if (hear.on && !hear.once) { stopHear(); render(); return; }
    const p = cur();
    if (p && p.chords.length) startHear(p.id, false);
  }

  /* ================= A CHORD HELD: HEARD IN THE RHYTHM =================
     A chord pressed on the board (or its key) sounds at once. Held past a
     moment, it plays the rhythm on the left — the bar's, or the selected
     chord's custom one — round and round from the press, until it is let
     go: what it would sound like in the progression, before it is placed.
     A quick tap is just the chord, as long as a tapped chord. */
  const HOLD_S = 0.3;            // held this long, it is a hold
  const TAP_S = 0.75;            // a tapped chord's length (audio.js CHORD_HOLD)
  let pv = null;                 // { holder, place, freqs, t0, tickSec, strikes, period, cursor, held, voices, timer }
  function cellStrikes(cells) {
    const out = [];
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] !== 'X') continue;
      let j = i + 1;
      while (j < cells.length && cells[j] === 'O') j++;
      out.push({ at: i * CELL, len: (j - i) * CELL });
    }
    return out;
  }
  function startPreview(id, place, holder) {
    releasePreview();
    const list = id && C.isKnown(id) ? C.midis(id) : [];
    if (!list.length) return;
    S.soundingChord = { id, midis: list };                     // the keyboard's lights and the corner, as C.play does
    SW.bus.emit('chord:played', { id, midis: list, source: 'progression' });
    const freqs = list.map(SW.music.midiToFreq);
    if (!holder) { SW.audio.playChordFrequencies(freqs); return; }   // nothing to hold it: a tap
    const cells = scope().cells;
    const ac = SW.audio.context();
    pv = { holder, place, freqs, t0: ac.currentTime + 0.01, tickSec: SW.timing.tickMs() / 1000,
      strikes: cellStrikes(cells), period: cells.length * CELL, cursor: 0, held: false, voices: [], timer: 0 };
    if (cells[0] !== 'X') SW.audio.playChordFrequencies(freqs);      // the rhythm starts silent: a tap is still heard
    lightBlock(place, true);
    pvPump();
  }
  function pvPump() {
    if (!pv || !pv.period) return;
    const now = SW.audio.context().currentTime;
    if (!pv.held && now - pv.t0 >= HOLD_S) {
      pv.held = true;
      if (hear.on) { stopHear(); render(); }                       // one rhythm at a time
      pv.voices.forEach(v => { if (v.cut) setTimeout(() => v.h.stop(), Math.max(0, v.cut - now) * 1000); });   // the first strike: its own length after all
    }
    const limit = pv.held ? now + 0.25 : Math.min(now + 0.25, pv.t0 + HOLD_S);   // a tap never gets past its first moment
    const horizon = (limit - pv.t0) / pv.tickSec;
    let guard = 0;
    while (pv.cursor < horizon && guard++ < 64) {
      const base = Math.floor(pv.cursor / pv.period) * pv.period;
      const end = Math.min(horizon, base + pv.period);
      pv.strikes.forEach(st => {
        const abs = base + st.at;
        if (abs < pv.cursor || abs >= end) return;
        const when = pv.t0 + abs * pv.tickSec, hold = st.len * pv.tickSec * 0.95;
        // the very first strike rings as long as a tapped chord, in case it is only a tap; a hold cuts it back to its length
        const first = abs === 0 && hold < TAP_S;
        SW.audio.playChordFrequencies(pv.freqs, when, first ? TAP_S : hold).forEach(h => pv.voices.push({ h, start: when, end: when + (first ? TAP_S : hold), cut: first ? when + hold : 0 }));
      });
      pv.cursor = end;
    }
    pv.voices = pv.voices.filter(v => v.end > now);
    pv.timer = setTimeout(pvPump, 40);
  }
  /* let go: a hold stops; a tap rings as long as a tapped chord */
  function releasePreview(holder) {
    if (!pv || (holder && pv.holder !== holder)) return;
    const p = pv;
    pv = null;
    clearTimeout(p.timer);
    lightBlock(p.place, false);
    const now = SW.audio.context().currentTime;
    p.voices.forEach(v => {
      if (v.start > now + 0.005 || p.held) { v.h.stop(); return; }
      if (v.end - v.start > TAP_S) setTimeout(() => v.h.stop(), Math.max(0, v.start + TAP_S - now) * 1000);
    });
  }
  ['pointerup', 'pointercancel'].forEach(type => window.addEventListener(type, e => releasePreview('p' + e.pointerId)));
  const keyHolder = e => 'k' + (e.code || String(e.key || '').toLowerCase());
  document.addEventListener('keyup', e => releasePreview(keyHolder(e)));
  window.addEventListener('blur', () => releasePreview());

  /* ================= GESTURES ================= */
  /* a Z X C V B tab, held while the pointer is down (two fingers: a tab and a chord) */
  function holdTab(modTab, e) {
    e.preventDefault();
    if (modTab.classList.contains('empty')) return;
    const Mk = modTab.dataset.mod;
    try { modTab.setPointerCapture(e.pointerId); } catch (err) {}
    C.setMod(Mk, true);
    const up = () => { C.setMod(Mk, false); modTab.removeEventListener('pointerup', up); modTab.removeEventListener('pointercancel', up); };
    modTab.addEventListener('pointerup', up);
    modTab.addEventListener('pointercancel', up);
  }
  let drag = null;              // a card being dragged to a new place
  body.addEventListener('pointerdown', e => {
    if (tab !== 'build') return;
    // Z X C V B tabs: held while the pointer is down (two fingers: a tab and a chord)
    const modTab = e.target.closest('.pw-board .cmod:not([data-latch])');
    if (modTab) { holdTab(modTab, e); return; }
    const block = e.target.closest('.pw-board .cblock');
    if (block) { e.preventDefault(); pick(block.dataset.place, 'p' + e.pointerId); return; }
    // a chord card: a tap selects it, a drag moves it, a second tap soon after opens its editor
    const card = e.target.closest('.pw-card[data-card]');
    if (card && card.dataset.card !== 'plus' && !e.target.closest('button')) {
      drag = { from: Number(card.dataset.card), x: e.clientX, y: e.clientY, moved: false, card, id: e.pointerId, to: null };
      try { card.setPointerCapture(e.pointerId); } catch (err) {}
    }
  });
  body.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (readOnly()) return;                              // listen only: a tap selects, nothing moves
    if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
    drag.moved = true;
    drag.card.classList.add('dragging');
    let best = null, bestD = Infinity;
    body.querySelectorAll('.pw-card[data-card]').forEach(c => {
      const r = c.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      if (d < bestD) { bestD = d; best = c; }
    });
    body.querySelectorAll('.pw-card.drop').forEach(c => c.classList.remove('drop'));
    if (best && best !== drag.card) {
      best.classList.add('drop');
      drag.to = best.dataset.card === 'plus' ? cur().chords.length - 1 : Number(best.dataset.card);
    } else drag.to = null;
  });
  const endDrag = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag;
    drag = null;
    if (d.moved) {
      d.card.classList.remove('dragging');
      if (d.to !== null && d.to !== d.from && cur()) { T.moveStep(selProg, d.from, d.to); sel = d.to; }
      else render();
      lastTap = null;
      return;
    }
    const now = Date.now();
    if (lastTap && lastTap.i === d.from && now - lastTap.t < 450 && !readOnly()) { lastTap = null; editStep(d.from, true); return; }
    lastTap = { i: d.from, t: now };
    selectCard(d.from);
  };
  body.addEventListener('pointerup', endDrag);
  body.addEventListener('pointercancel', e => { if (drag) { drag.card.classList.remove('dragging'); drag = null; render(); } });

  body.addEventListener('click', e => {
    if (tab !== 'build') return;
    const t = e.target;
    const b = t.closest('button, .pw-pcard, .pw-card');
    if (!b) return;
    if (b.dataset.once) {                                 // ▶ on the list: once round — again, it stops
      e.stopPropagation();
      if (hear.on && hear.id === b.dataset.once) { stopHear(); render(); } else startHear(b.dataset.once, true);
      return;
    }
    if (b.classList.contains('pw-pcard') && b.dataset.prog) { if (b.dataset.prog !== selProg) { selProg = b.dataset.prog; sel = null; fresh = null; confirmDelete = false; render(); } return; }
    if (b.classList.contains('pw-new')) { selProg = null; sel = null; fresh = null; confirmDelete = false; render(); body.querySelector('.pw-main').scrollTop = 0; return; }
    if (b.dataset.latch) { toggleLatch(b.dataset.latch); return; }
    if (b.dataset.modnav) {                               // ‹ ›: on round the list, either way, for ever
      const row = body.querySelector('.pw-modrow');
      if (row) { homeModRow(row); row.scrollBy({ left: Number(b.dataset.modnav) * Math.max(120, row.clientWidth * 0.7), behavior: 'smooth' }); }
      return;
    }
    if (b.classList.contains('pw-put')) { putInSong(); return; }
    if (b.classList.contains('pw-starters-btn')) { showStarters = !showStarters; render(); return; }
    if (b.dataset.starter !== undefined) { useStarter(Number(b.dataset.starter)); return; }
    if (b.classList.contains('pw-card') && b.dataset.card === 'plus') { selectCard('plus'); return; }
    if (b.dataset.x !== undefined) { removeSel(); return; }
    if (b.dataset.len) { setLength(sel, Number(b.dataset.len)); return; }
    if (b.dataset.each) { setEach(Number(b.dataset.each)); return; }
    if (b.classList.contains('pw-hear')) { toggleHear(); return; }
    if (b.classList.contains('pw-more-btn')) { moreChords(); return; }
    if (b.dataset.own) { giveOwnRhythm(b.dataset.own === 'on'); return; }
    if (rhythmClick(b, scope(), render)) return;
  });
  body.addEventListener('change', e => {
    if (tab !== 'build') return;
    const t = e.target;
    if (t.classList.contains('pw-name')) {
      const v = t.value.trim().slice(0, 24);
      if (!v) { render(); return; }
      if (cur()) { if (v !== cur().name) T.setProg(selProg, { name: v }); }
      else ensureProg();
      return;
    }
    if (t.classList.contains('pw-beat-box')) { beatOn = t.checked; if (hear.on) rehear(); return; }
  });
  body.addEventListener('keydown', e => {
    if (e.target.classList && e.target.classList.contains('pw-name') && e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
  });
  body.addEventListener('contextmenu', e => { if (e.target.closest('.cblock, .cmod')) e.preventDefault(); });
  // the changes' row: once a scroll settles (or nears either end), back to the middle copy
  body.addEventListener('scroll', e => {
    const row = e.target;
    if (!row.classList || !row.classList.contains('pw-modrow')) return;
    const P = modPeriod(row);
    if (P > 0 && (row.scrollLeft < P * 0.5 || row.scrollLeft > (MOD_COPIES - 1.5) * P)) { homeModRow(row); return; }
    clearTimeout(modTimer);
    modTimer = setTimeout(() => homeModRow(row), 160);
  }, true);

  /* More chords…: the chord editor on the selected card; with none, any
     chord to try (I to start) — heard, and placed only by Add it */
  function moreChords() {
    const p = cur();
    if (p && typeof sel === 'number' && p.chords[sel]) { editStep(sel, false); return; }
    stopHear();
    openChordEditor({
      title: 'More chords',
      spec: { root: '1', q: 'maj', mods: [] },
      onChange: () => {},
      add: sp => addChord({ chord: C.toId(sp) })
    });
  }

  /* ==================================================================
     THE CHORD EDITOR — #pchord-sheet. More chords… and a double-click
     on a card (Enter on a selected one) open it. The chord's root; its
     quality — Major · Minor · Diminished · Augmented, nothing else —
     with every change beside it as a switch (sus2 add9 sus4 ♭7 maj7,
     the inversions): a 7th chord is Major + ♭7, a °7 Diminished + ♭7 +
     maj7. A chord of another quality (7♭9 …) keeps it as an extra
     choice until another is picked. From a double-click it has its
     rhythm too: the progression's (Standard) or Custom — the same
     builder, and the one the big window shows while it is selected.
     Every change is heard, written at once, and one Undo step.
     ================================================================== */
  const edSheet = document.getElementById('pchord-sheet');
  const edBody = document.getElementById('pchord-body');
  const edFoot = document.getElementById('pchord-foot');
  const edTitle = document.getElementById('pchord-title');
  let ed = null;             // { title, view: { root, q, mods, special }, id, step: { prog, i } | null, rhythm, onChange }
  const edOpen = () => !!(edSheet && edSheet.classList.contains('show'));
  const BASES = ['maj', 'min', 'dim', 'aug'];
  /* the qualities that are a base and changes (checked by ear against Theory, 2026-10-05) */
  const AS_BASE = {
    sus2: ['maj', ['sus2']], sus4: ['maj', ['sus4']], dom7: ['maj', ['b7']], maj7: ['maj', ['maj7']],
    min7: ['min', ['b7']], m7b5: ['dim', ['b7']], dim7: ['dim', ['b7', 'maj7']], mmaj7: ['min', ['maj7']],
    aug7: ['aug', ['b7']], six: ['maj', ['b7', 'maj7']], min6: ['min', ['b7', 'maj7']], add9: ['maj', ['add9']],
    madd9: ['min', ['add9']], six9: ['maj', ['add9', 'b7', 'maj7']], dom9sus4: ['maj', ['add9', 'sus4', 'b7']], dom9s5: ['aug', ['add9', 'b7']]
  };
  const modOrder = list => C.MOD_FUNCS.map(f => f.id).filter(id => list.indexOf(id) !== -1);
  function splitQuality(spec) {
    if (BASES.indexOf(spec.q) !== -1) return { root: spec.root, q: spec.q, mods: spec.mods.slice(), special: null };
    const m = AS_BASE[spec.q];
    if (m) return { root: spec.root, q: m[0], mods: modOrder(m[1].concat(spec.mods)), special: null };
    return { root: spec.root, q: spec.q, mods: spec.mods.slice(), special: spec.q };
  }
  const edSpec = () => ({ root: ed.view.root, q: ed.view.q, mods: ed.view.mods.slice() });

  /* opts: { title, spec, onChange(spec), step: { prog, i } (its rhythm, Take it out), rhythm, add(spec) (a chord to try: Add it) } */
  function openChordEditor(opts) {
    if (!edSheet) return;
    ed = { title: opts.title, view: splitQuality(opts.spec), step: opts.step || null, rhythm: !!opts.rhythm, onChange: opts.onChange, add: opts.add || null };
    ed.id = C.toId(opts.spec);
    ui.openSheet('pchord-sheet');
    renderEditor();
  }
  function editStep(i, withRhythm) {
    const p = cur();
    if (!p || !p.chords[i] || readOnly()) return;
    const id = p.id;
    if (sel !== i) { sel = i; render(); }               // selected in the big window too: its rhythm shows there
    stopHear();
    openChordEditor({
      title: (withRhythm ? 'Chord ' : 'More chords — chord ') + (i + 1) + ' of ' + p.name,
      spec: C.parse(p.chords[i].chord) || { root: '1', q: 'maj', mods: [] },
      step: { prog: id, i },
      rhythm: withRhythm,
      onChange: sp => T.setStep(id, i, { chord: C.toId(sp), place: null })
    });
  }
  /* the chord's own rhythm, as the big window's builder draws it */
  function stepScope() {
    const p = T.prog(ed.step.prog);
    const st = p.chords[ed.step.i];
    const n = toTicks(stepBeats(p, st)) / CELL;
    const i = ed.step.i, id = p.id;
    return { kind: 'own', key: 'ed' + i, step: i, st, cells: T.fit(T.cells(st.rhythm || '') || '', n), beats: n / perBeat(), colour: look(st.chord).color,
      write: r => T.setStep(id, i, { rhythm: r }), redraw: renderEditor };
  }

  function renderEditor() {
    if (!ed || !edOpen()) return;
    let st = null;
    if (ed.step) {
      const p = T.prog(ed.step.prog);
      st = p && p.chords[ed.step.i];
      if (!st) { ui.closeSheet('pchord-sheet'); return; }
      if (st.chord !== ed.id) { ed.id = st.chord; ed.view = splitQuality(C.parse(st.chord) || { root: '1', q: 'maj', mods: [] }); }   // Undo, or a change elsewhere
    }
    const spec = edSpec();
    const d = C.describe(spec);
    const ink = SW.chordStrip.inkOn;
    edTitle.textContent = ed.title;
    // hear it
    let html = '<button type="button" class="chord-preview ce-hear" data-ce="hear" style="--c:' + d.color + ';--ink:' + ink(d.color) + '" title="Hear it">' +
      '<span class="cp-name">' + C.labelHTML(C.nameOf(d)) + '</span><span class="cp-letter">' + esc(d.letter) + '</span>' +
      '<span class="cp-tones">' + d.tones.map(t => '<i style="--c:' + t.color + ';color:' + ink(t.color) + '">' + esc(t.name) + '</i>').join('') + '</span>' +
      (d.inScale ? '' : '<span class="cp-warn">outside the scale</span>') + '</button>';
    // the root: the twelve notes, spelled for the scale
    const scaleSet = new Set(C.scale().degrees.map(Theory.degreeSemis));
    html += '<div class="ce-row"><span class="editor-label">Root</span><div class="chips">' +
      Theory.chromaticDegrees(C.scaleId()).map(deg => {
        const sp = Theory.spellDegree(S.key, deg);
        const c = SW.music.LETTER_COLORS[sp.letter];
        return '<button type="button" class="chip root-chip' + (scaleSet.has(Theory.degreeSemis(deg)) ? ' in-scale' : ' dim') + (Theory.degreeSemis(deg) === Theory.degreeSemis(spec.root) ? ' selected' : '') + '" data-root="' + deg + '" style="--c:' + c + ';--ink:' + ink(c) + '">' +
          '<span>' + esc(sp.name) + '</span><small>' + esc(deg.replace(/#/g, '♯').replace(/b/g, '♭')) + '</small></button>';
      }).join('') + '</div></div>';
    // the quality, and the changes beside it
    const opts = BASES.map(q => '<option value="' + q + '"' + (q === spec.q ? ' selected' : '') + '>' + esc(Theory.QUALITIES[q].name) + '</option>').join('') +
      (ed.view.special ? '<option value="' + ed.view.special + '"' + (spec.q === ed.view.special ? ' selected' : '') + '>' + esc(Theory.QUALITIES[ed.view.special].name) + ' (as it is)</option>' : '');
    html += '<div class="ce-row"><span class="editor-label">Quality</span><div class="ce-qrow">' +
      '<select class="sound-select ce-quality" aria-label="Quality">' + opts + '</select>' +
      '<div class="ce-mods" role="group" aria-label="Changes">' + C.MOD_FUNCS.map(f => {
        const on = spec.mods.indexOf(f.id) !== -1;
        return '<button type="button" class="chip mod-chip' + (on ? ' active' : '') + '" data-cemod="' + f.id + '" aria-pressed="' + on + '" title="' + esc(f.does) + '"><span>' + C.modLabelHTML(f) + '</span></button>';
      }).join('') + '</div></div></div>';
    // its rhythm (a double-click: a chord of the progression)
    if (ed.step && ed.rhythm) {
      const own = !!st.rhythm;
      html += '<div class="ce-rhythm"><div class="pw-rhead"><p class="pw-kicker">Rhythm</p>' +
        '<div class="seg"><button type="button" class="seg-btn' + (own ? '' : ' active') + '" data-ceown="off">Standard rhythm</button><button type="button" class="seg-btn' + (own ? ' active' : '') + '" data-ceown="on">Custom rhythm</button></div></div>' +
        (own ? '<div class="pw-rhythm">' + rhythmTabsHtml(stepScope()) + '</div>' : '') + '</div>';
    }
    edBody.innerHTML = html;
    edFoot.innerHTML = (ed.step ? '<button type="button" class="btn pw-ghost" data-ce="remove">Take it out</button>' : '') +
      '<span class="pw-gap"></span>' +
      (ed.add ? '<button type="button" class="btn" data-ce="done">Close</button><button type="button" class="btn btn-primary" data-ce="add">Add it to the progression</button>'
        : '<button type="button" class="btn btn-primary" data-ce="done">Done</button>');
  }
  function edCommit() {
    const spec = edSpec();
    ed.id = C.toId(spec);
    C.play(spec, 'editor');
    ed.onChange(spec);
    renderEditor();
  }
  if (edSheet) {
    edBody.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || !ed) return;
      if (b.dataset.ce === 'hear') { C.play(edSpec(), 'editor'); return; }
      if (b.dataset.root) { ed.view.root = b.dataset.root; edCommit(); return; }
      if (b.dataset.cemod) {
        const f = C.MOD_BY_ID[b.dataset.cemod];
        let set = ed.view.mods.filter(id => id !== f.id);
        if (set.length === ed.view.mods.length) { if (f.inv) set = set.filter(id => !C.MOD_BY_ID[id].inv); set.push(f.id); }
        ed.view.mods = modOrder(set);
        edCommit();
        return;
      }
      if (b.dataset.ceown) { giveOwnRhythm(b.dataset.ceown === 'on', ed.step.prog, ed.step.i); return; }
      if (ed.step) rhythmClick(b, stepScope(), renderEditor);
    });
    edBody.addEventListener('change', e => {
      if (!ed || !e.target.classList.contains('ce-quality')) return;
      ed.view.q = e.target.value;
      e.target.blur();
      edCommit();
    });
    edFoot.addEventListener('click', e => {
      const b = e.target.closest('button[data-ce]');
      if (!b || !ed) return;
      if (b.dataset.ce === 'done') { ui.closeSheet('pchord-sheet'); return; }
      if (b.dataset.ce === 'add' && ed.add) { const add = ed.add, sp = edSpec(); ui.closeSheet('pchord-sheet'); add(sp); return; }
      if (b.dataset.ce === 'remove' && ed.step) {
        const { prog, i } = ed.step;
        ui.closeSheet('pchord-sheet');
        T.removeStep(prog, i);
        if (prog === selProg) { const left = T.prog(prog); sel = left && i < left.chords.length ? i : null; }
      }
    });
    SW.bus.on('sheet:closed', d => { if (d.id === 'pchord-sheet') ed = null; });
    SW.bus.on('score:changed', () => { if (edOpen()) renderEditor(); });
    SW.bus.on('score:loaded', () => { if (edOpen()) ui.closeSheet('pchord-sheet'); });
    ['chords:changed', 'names:changed', 'key:changed', 'meter:changed'].forEach(evt => SW.bus.on(evt, () => { if (edOpen()) renderEditor(); }));
  }

  foot.addEventListener('click', e => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const p = cur();
    switch (b.dataset.act) {
      case 'duplicate': if (p) { selProg = T.duplicateProg(p.id); sel = null; fresh = null; } break;
      case 'delete': confirmDelete = true; render(); break;
      case 'delete-no': confirmDelete = false; render(); break;
      case 'delete-yes': {
        confirmDelete = false;
        if (!p) break;
        if (hear.on && hear.id === p.id) stopHear();
        const list = T.progressions();
        const i = list.indexOf(p);
        T.removeProg(p.id);
        const left = T.progressions();
        selProg = left.length ? left[Math.min(i, left.length - 1)].id : null;
        sel = null;
        render();
        break;
      }
      case 'put': putInSong(); break;
      case 'done': close(); break;
    }
  });
  undoBtn.addEventListener('click', () => { if (SW.history) SW.history.undo(); });
  redoBtn.addEventListener('click', () => { if (SW.history) SW.history.redo(); });


  /* ==================================================================
     CHORD PLACEMENT (phase 3, DESIGN.md §5 — "In the song" there) — the map of the song's bars:
     the melody's lines, and the stretches of chords over them.
       • tap a band: select it (its card below: from, to, starts on,
         just here, edit, take out); drag its ends to trim, its middle
         to move it (its changes just here go with it)
       • drag along the bar numbers: select bars; shift-tap: from the
         playhead to there; a tap: the playhead goes there
       • Put in: drag a progression onto a bar (it runs to the end of the
         melody, or once through past it), or tap one — into the bars
         selected, or from the first bar with no chords
       • ▶ Play the song: the toolbar's Play, from the playhead, which
         follows the music (SW.player.position)
     Stretches never overlap: one put over another takes those bars, and
     the other carries on afterwards where it would have been (track.js).
     ================================================================== */
  const BANDS = [
    { bc: '#F6E4F4', bd: '#9C168E' }, { bc: '#DDF2E8', bd: '#2E8B57' }, { bc: '#E3ECFF', bd: '#3A5BD9' },
    { bc: '#FFEBD6', bd: '#C8640A' }, { bc: '#DDF4F5', bd: '#1F8A91' }, { bc: '#FDE4EA', bd: '#C2185B' },
    { bc: '#EEF3D9', bd: '#6B7F1A' }, { bc: '#ECE6FF', bd: '#6A4FD0' }
  ];
  const LOOSE = { bc: '#EEEAF2', bd: '#8A7F99' };
  function bandOf(progId) {
    const i = progId ? T.progressions().findIndex(p => p.id === progId) : -1;
    return i < 0 ? LOOSE : BANDS[i % BANDS.length];
  }
  let m = null;                // the map's geometry, as last drawn
  let mdrag = null;            // a drag on the map: bars, a band, its ends, a chip
  let headTimer = 0;

  function stretchName(r) {
    if (r.prog) { const p = T.prog(r.prog); return p ? p.name : '?'; }
    return T.isVirtual() ? 'From the lane' : 'Just here';
  }
  const selIndex = list => (selFrom === null ? -1 : list.findIndex(r => r.from === selFrom));
  function timesText(n) {
    if (!isFinite(n) || n <= 0) return '';
    const r = Math.round(n * 2) / 2;
    if (Math.abs(n - r) > 0.01) return 'part of the way through';
    const whole = Math.floor(r), half = r - whole ? '½' : '';
    if (r === 1) return 'once through';
    if (r === 2) return 'twice through';
    return (whole || '') + half + ' times through';
  }

  function geometry() {
    const g = T.grid();
    const evs = T.events(g);
    const list = T.shown(g);
    const BW = window.innerWidth <= 720 ? 40 : 48;
    const W0 = g.p0 ? Math.max(18, Math.round(BW * g.p0 / g.B)) : 0;
    const firstBar = g.p0 ? 0 : 1;
    const trackLast = evs.end ? g.barAt(evs.end - 1) : 0;
    const waitingLast = list.reduce((mx, r) => Math.max(mx, r.from), 0);
    const lastShown = Math.max(16, Math.max(g.lastBar, trackLast, waitingLast, playhead) + 8);
    const x = t => (t < g.p0 ? t / g.p0 * W0 : W0 + (t - g.p0) / g.B * BW);
    const xb = bar => (bar <= 0 ? 0 : W0 + (bar - 1) * BW);
    // where each stretch really plays: [a, z) — or waiting for the melody
    const spans = list.map((r, i) => {
      const last = T.lastOf(r, g);
      const a = Math.max(0, g.T(r.from));
      const waiting = r.to === 'melody' && g.lastBar < r.from;
      let z = g.T(last + 1);
      list.forEach((o, k) => { const s = Math.max(0, g.T(o.from)); if (k !== i && s > a) z = Math.min(z, s); });
      return { a, z: waiting ? a : z, last: waiting ? r.from : Math.min(last, g.barAt(z - 1)), waiting };
    });
    return { g, evs, list, spans, BW, W0, firstBar, lastShown, x, xb, width: xb(lastShown + 1) };
  }
  function barAtClientX(clientX) {
    const inner = body.querySelector('.mp-inner');
    if (!inner || !m) return null;
    const xx = clientX - inner.getBoundingClientRect().left;
    let bar = xx < m.W0 ? (m.g.p0 ? 0 : 1) : 1 + Math.floor((xx - m.W0) / m.BW);
    return Math.max(m.firstBar, Math.min(m.lastShown, bar));
  }

  function renderSong() {
    const scroller = body.querySelector('.mp-scroll');
    const keepX = scroller ? scroller.scrollLeft : null;
    m = geometry();
    const { g, list, spans, BW, W0, x, xb } = m;
    const si = selIndex(list);
    if (si < 0) selFrom = null;
    const playing = SW.player && SW.player.playing;
    let html = '<div class="mp-top">' +
      '<button type="button" class="pw-hear mp-play' + (playing ? ' on' : '') + '" data-song="play">' + (playing ? '<span class="sq"></span> Stop' : playIcon() + ' Play the song from bar ' + playhead) + '</button>' +
      (readOnly() ? ui.note('song.map.listen', 'Each band is a progression and the bars it plays. Tap one to see it; tap a bar number to start playing there.')
        : ui.note('song.map', 'Tap a band to change where it starts and stops. Drag its ends to trim it, its middle to move it. Drag along the bar numbers to select bars; tap a number to start playing there.')) +
      '</div>';

    // the map
    let nums = '', mel = '', chords = '';
    for (let b = m.firstBar; b <= m.lastShown; b++) {
      const w = b === 0 ? W0 : BW;
      const past = b > Math.max(g.lastBar, m.evs.end ? g.barAt(m.evs.end - 1) : 0);
      nums += '<div class="mp-num' + (past ? ' past' : '') + (b === playhead ? ' here' : '') + '" data-bar="' + b + '" style="left:' + xb(b) + 'px;width:' + w + 'px">' + (b > 0 ? b : '') + '</div>';
    }
    const model = SW.score.read().lines;
    g.song.lines.forEach((le, i) => {
      if (!le.padded) return;
      const left = x(le.at), w = x(le.at + le.padded) - left;
      const words = (model[i] ? model[i].syllables : []).map(s => s.text).filter(t => t && t !== '-').join(' ');
      const label = model[i] && model[i].label ? '<b>' + esc(model[i].label) + '</b>' : '';
      mel += '<div class="mp-mel" data-bar="' + Math.max(m.firstBar, g.barAt(le.at)) + '" style="left:' + (left + 1) + 'px;width:' + Math.max(8, w - 3) + 'px;--c:' + lineColour(i) + '" title="' + esc(words) + '">' + label + '<span>' + esc(words.length > 40 ? words.slice(0, 38) + '…' : words) + '</span></div>';
    });
    const melEnd = x(g.total);
    if (m.width - melEnd > BW) mel += '<div class="mp-nomel" style="left:' + (melEnd + 2) + 'px;width:' + (m.width - melEnd - 6) + 'px">no melody yet — the chords play on</div>';

    list.forEach((r, i) => {
      const sp = spans[i];
      const band = bandOf(r.prog);
      const left = x(sp.a), w = sp.waiting ? BW : x(sp.z) - left;
      let inner = '<span class="mp-bname">' + esc(stretchName(r)) + (sp.waiting ? ' · waits for the melody' : '') + '</span>';
      const evs = m.evs.filter(e => e.stretch === i);
      evs.forEach((e, k) => {
        const ex = x(e.at) - left;
        const nx = (k + 1 < evs.length ? x(evs[k + 1].at) : x(e.end)) - left;
        const l = look(e.id);
        inner += '<span class="mp-tick" style="left:' + ex + 'px"></span>' +
          (nx - ex >= 26 ? '<span class="mp-ch" style="left:' + (ex + 4) + 'px;max-width:' + (nx - ex - 6) + 'px">' + C.labelHTML(e.id ? l.name : '·') + '</span>' : '') +
          (e.here ? '<span class="mp-corner" style="left:' + (x(e.end) - left - 11) + 'px" title="Changed just here"></span>' : '');
      });
      const on = i === si;
      chords += '<div class="mp-band' + (on ? ' on' : '') + (sp.waiting ? ' waiting' : '') + (r.prog ? '' : ' loose') + '" data-stretch="' + i + '" style="left:' + (left + 1) + 'px;width:' + Math.max(10, w - 2) + 'px;--bc:' + band.bc + ';--bd:' + band.bd + '" title="' + esc(stretchName(r)) + '">' +
        (on ? '<span class="mp-h l" data-handle="l" title="Drag: where it starts"></span><span class="mp-h r" data-handle="r" title="Drag: where it stops"></span>' : '') +
        inner + '</div>';
    });
    if (!list.length) chords += '<div class="mp-empty" style="left:2px;width:' + Math.min(m.width - 4, BW * 12) + 'px">No chords in the song yet — put a progression in, below</div>';

    const selRect = selBars ? '<div class="mp-sel" style="left:' + xb(selBars.a) + 'px;width:' + (xb(selBars.b + 1) - xb(selBars.a)) + 'px"></div>' : '';
    html += '<div class="mp-wrap"><div class="mp-labels"><span>Bar</span><span>Melody</span><span>Chords</span></div>' +
      '<div class="mp-scroll"><div class="mp-inner" style="width:' + m.width + 'px">' +
        selRect +
        '<div class="mp-row mp-nums">' + nums + '</div>' +
        '<div class="mp-row mp-mels">' + mel + '</div>' +
        '<div class="mp-row mp-chords">' + chords + '</div>' +
        '<div class="mp-head" style="left:' + x(Math.max(0, g.T(playhead))) + 'px"></div>' +
      '</div></div></div>';

    // the card
    html += '<div class="mp-card">' + songCardHtml(si) + '</div>';

    // put in
    html += '<div class="mp-putin"><p class="pw-kicker">Put in</p>' +
      T.progressions().map(p => { const b = bandOf(p.id); return '<button type="button" class="mp-chip" data-chip="' + p.id + '" style="--bc:' + b.bc + ';--bd:' + b.bd + '"' + (p.chords.length ? '' : ' disabled title="No chords yet"') + '>' + esc(p.name) + '</button>'; }).join('') +
      '<button type="button" class="mp-chip new" data-song="new">+ New</button>' +
      ui.note('song.putin', selBars ? 'Tap a progression to fill bars ' + selBars.a + (selBars.b > selBars.a ? '–' + selBars.b : '') + ' with it.' : 'Drag one onto a bar — or select bars along the numbers, then tap one. Tapped with no bars selected, it goes in at the first bar with no chords.') +
      '</div>';

    body.innerHTML = html;
    foot.innerHTML = ui.note('song.overlap', 'Stretches never overlap: putting one over another gives it those bars, and the other carries on afterwards where it would have been.') +
      '<span class="pw-gap"></span><button type="button" class="btn btn-primary" data-act="done">Done</button>';
    const sc = body.querySelector('.mp-scroll');
    if (sc) {
      if (keepX !== null) sc.scrollLeft = keepX;
      else if (si >= 0) sc.scrollLeft = Math.max(0, x(spans[si].a) - 60);
    }
    paintHead();
  }
  const LINE_TINTS = ['#E9F3FE', '#FFF6DC', '#E8F7EE', '#FBE9F4', '#EFEAFE', '#FFEDE0'];
  const lineColour = i => LINE_TINTS[i % LINE_TINTS.length];

  function songCardHtml(si) {
    const g = m.g;
    if (si < 0) {
      if (selBars) {
        const t = selBars.a === selBars.b ? 'Bar ' + selBars.a : 'Bars ' + selBars.a + '–' + selBars.b;
        const hasChords = m.evs.some(e => e.at < g.T(selBars.b + 1) && e.end > g.T(selBars.a));
        return '<h3 class="mp-card-title">' + t + '</h3>' +
          '<div class="mp-actions">' +
            '<button type="button" class="btn" data-song="play-sel">' + playIcon() + ' Play from bar ' + selBars.a + '</button>' +
            (hasChords ? '<button type="button" class="btn pw-ghost" data-song="clear-sel">Take the chords out of these bars</button>' : '') +
            '<button type="button" class="btn pw-ghost" data-song="unselect">Done selecting</button>' +
          '</div>';
      }
      return '<p class="mp-card-empty">' + (m.list.length ? 'Tap a band to see where it plays.' : 'Put a progression in from the row below.') + '</p>';
    }
    const r = m.list[si], sp = m.spans[si];
    const band = bandOf(r.prog);
    const p = r.prog ? T.prog(r.prog) : null;
    const name = stretchName(r);
    const cyc = p ? T.cycleBeats(p) : 0;
    const spanBeats = (sp.z - sp.a) / g.b;
    const times = cyc ? spanBeats / cyc : 0;
    const where = sp.waiting ? 'from bar ' + r.from + ' — waits for the melody to reach it' : (r.from === sp.last ? 'bar ' + r.from : 'bars ' + r.from + '–' + sp.last);
    let html = '<h3 class="mp-card-title"><span class="mp-swatch" style="--bc:' + band.bc + ';--bd:' + band.bd + '"></span>' + esc(name) + ' <span class="mp-where">· ' + esc(where) + '</span>' +
      (p && !sp.waiting ? ' <span class="mp-times">' + esc(timesText(times)) + '</span>' : '') + '</h3>';
    html += '<div class="mp-fields">' +
      '<label>From bar <input type="number" class="mp-in" data-field="from" min="' + m.firstBar + '" max="999" value="' + r.from + '"></label>' +
      '<label>to bar <input type="number" class="mp-in" data-field="to" min="' + r.from + '" max="999" value="' + (r.to === 'melody' ? Math.max(r.from, g.lastBar) : r.to) + '"></label>' +
      (p ? '<label>or <input type="number" class="mp-in narrow" data-field="times" min="1" max="99" step="1" value="' + Math.max(1, Math.round(times) || 1) + '"> times through</label>' : '') +
      '<button type="button" class="mp-toggle' + (r.to === 'melody' ? ' on' : '') + '" data-song="to-melody" title="It grows and shrinks with the melody">to the end of the melody</button>' +
    '</div>';
    if (p && p.chords.length > 1) {
      let acc = 0, matched = false;
      const opts = p.chords.map((st, k) => {
        const v = acc;
        acc += st.beats || p.beats || barBeats();
        const on = Math.abs((r.phase || 0) - v) < 1e-6;
        if (on) matched = true;
        return '<option value="' + v + '"' + (on ? ' selected' : '') + '>' + (k + 1) + ' · ' + esc(look(st.chord).name) + '</option>';
      }).join('');
      html += '<div class="mp-fields"><label>Starts on chord <select class="mp-in mp-select" data-field="phase">' + (matched ? '' : '<option selected disabled>partway into a chord</option>') + opts + '</select></label></div>';
    }
    if (r.prog) {
      const here = r.here || [];
      html += '<div class="mp-fields mp-here"><span class="mp-flabel">Just here:</span>' +
        (here.length ? here.map(h => '<span class="mp-herechip">bar ' + h.bar + (h.beat > 1 ? ' beat ' + h.beat : '') + ' · ' + h.chords.map(c => C.labelHTML(look(c.chord).name)).join(' ') +
          '<button type="button" data-unhere="' + h.bar + ':' + h.beat + ':' + h.beats + '" title="Back to ' + esc(name) + ' there" aria-label="Back to the progression there">×</button></span>').join('') +
          '<button type="button" class="btn pw-ghost mp-small" data-song="clear-here">Clear them</button>'
          : '<span class="mp-none">none</span>') +
      '</div>';
    }
    html += '<div class="mp-actions">' +
      (p ? '<button type="button" class="btn" data-song="edit">' + (readOnly() ? 'Look at ' : 'Edit ') + esc(p.name) + '</button>' : '') +
      '<button type="button" class="btn" data-song="play-band">' + playIcon() + ' Play from bar ' + r.from + '</button>' +
      '<button type="button" class="btn pw-ghost" data-song="remove">Take it out of the song</button>' +
    '</div>';
    return html;
  }

  /* the playhead: where Play starts, and — while it plays — where the music is */
  function paintHead() {
    if (!m || tab !== 'song') return;
    const head = body.querySelector('.mp-head');
    if (!head) return;
    const pos = SW.player && SW.player.position ? SW.player.position() : null;
    const t = pos === null ? Math.max(0, m.g.T(playhead)) : pos;
    head.style.left = m.x(t) + 'px';
    head.classList.toggle('moving', pos !== null);
    body.querySelectorAll('.mp-band').forEach(b => {
      const sp = m.spans[Number(b.dataset.stretch)];
      b.classList.toggle('sounding', pos !== null && sp && pos >= sp.a && pos < sp.z);
    });
    if (pos !== null) {
      // keep the playhead in view
      const sc = body.querySelector('.mp-scroll');
      const hx = m.x(t);
      if (sc && (hx < sc.scrollLeft + 20 || hx > sc.scrollLeft + sc.clientWidth - 40)) sc.scrollLeft = Math.max(0, hx - 80);
    }
  }
  function followHead() {
    clearTimeout(headTimer);
    if (!isOpen() || tab !== 'song' || !(SW.player && SW.player.playing)) return;
    paintHead();
    headTimer = setTimeout(followHead, 50);
  }

  function playSongFrom(bar) {
    stopHear();
    const g = T.grid();
    SW.player.playFrom(Math.max(0, g.T(bar)));
  }
  function firstEmptyBar() {
    const g = T.grid();
    const evs = T.events(g);
    let b = 1;
    while (b < 999 && evs.some(e => e.at < g.T(b + 1) && e.end > g.T(b))) b++;
    return b;
  }
  function putProg(id, a, b) {
    const p = T.prog(id);
    if (!p || !p.chords.length) return;
    T.place(id, a, b);
    selFrom = a;
    selBars = null;
  }

  /* the map's gestures */
  body.addEventListener('pointerdown', e => {
    if (tab !== 'song' || !m) return;
    const t = e.target;
    if (t.closest('.note-i')) return;
    const num = t.closest('.mp-num');
    if (num) {
      e.preventDefault();
      mdrag = { kind: 'bars', anchor: Number(num.dataset.bar), moved: false, shift: e.shiftKey, id: e.pointerId };
      return;
    }
    const band = t.closest('.mp-band');
    if (band) {
      e.preventDefault();
      const i = Number(band.dataset.stretch);
      const h = t.closest('.mp-h');
      mdrag = { kind: h ? (h.dataset.handle === 'l' ? 'start' : 'end') : 'move', i, band, x0: e.clientX, bar0: barAtClientX(e.clientX), moved: false, id: e.pointerId };
      return;
    }
    const chip = t.closest('.mp-chip[data-chip]');
    if (chip && !chip.disabled) {
      e.preventDefault();
      mdrag = { kind: 'chip', prog: chip.dataset.chip, x0: e.clientX, y0: e.clientY, moved: false, id: e.pointerId, chip };
      return;
    }
    const mel = t.closest('.mp-mel');
    if (mel) { playhead = Number(mel.dataset.bar); selBars = null; renderSong(); return; }
    if (t.closest('.mp-chords, .mp-mels') && !t.closest('.mp-band')) { if (selFrom !== null || selBars) { selFrom = null; selBars = null; renderSong(); } }
  });
  window.addEventListener('pointermove', e => {
    if (!mdrag || e.pointerId !== mdrag.id) return;
    const d = mdrag;
    if (d.kind === 'bars') {
      const bar = barAtClientX(e.clientX);
      if (bar === null) return;
      if (bar !== d.anchor) d.moved = true;
      if (!d.moved) return;
      selBars = { a: Math.min(d.anchor, bar), b: Math.max(d.anchor, bar) };
      const sel = body.querySelector('.mp-sel') || (() => { const s = document.createElement('div'); s.className = 'mp-sel'; body.querySelector('.mp-inner').prepend(s); return s; })();
      sel.style.left = m.xb(selBars.a) + 'px';
      sel.style.width = (m.xb(selBars.b + 1) - m.xb(selBars.a)) + 'px';
      return;
    }
    if (d.kind === 'chip') {
      if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 8) return;
      if (!d.moved) {
        d.moved = true;
        d.ghost = document.createElement('div');
        d.ghost.className = 'mp-ghost';
        d.ghost.textContent = d.chip.textContent;
        d.ghost.style.cssText = d.chip.getAttribute('style') || '';
        document.body.appendChild(d.ghost);
      }
      d.ghost.style.left = (e.clientX + 8) + 'px';
      d.ghost.style.top = (e.clientY - 14) + 'px';
      const overMap = !!document.elementFromPoint(e.clientX, e.clientY)?.closest('.mp-scroll');
      d.ghost.classList.toggle('over', overMap);
      d.bar = overMap ? barAtClientX(e.clientX) : null;
      body.querySelectorAll('.mp-num.drop').forEach(n => n.classList.remove('drop'));
      if (d.bar !== null) { const n = body.querySelector('.mp-num[data-bar="' + d.bar + '"]'); if (n) n.classList.add('drop'); }
      return;
    }
    // a band: trim its ends, or move it (listen only: a tap selects it, nothing moves)
    if (readOnly()) return;
    const bar = barAtClientX(e.clientX);
    if (bar === null) return;
    if (!d.moved && Math.abs(e.clientX - d.x0) < 6) return;
    d.moved = true;
    const r = m.list[d.i], sp = m.spans[d.i];
    if (!r) return;
    d.band.classList.add('dragging');
    if (d.kind === 'start') {
      d.to = Math.min(bar, sp.last);
      d.band.style.left = (m.xb(d.to) + 1) + 'px';
      d.band.style.width = Math.max(10, m.x(sp.z) - m.xb(d.to) - 2) + 'px';
    } else if (d.kind === 'end') {
      d.to = Math.max(bar, r.from);
      d.band.style.width = Math.max(10, m.xb(d.to + 1) - m.x(sp.a) - 2) + 'px';
    } else {
      d.delta = Math.max(m.firstBar - r.from, bar - d.bar0);
      d.band.style.transform = 'translateX(' + (d.delta * m.BW) + 'px)';
    }
  });
  const endMapDrag = e => {
    if (!mdrag || (e && e.pointerId !== mdrag.id)) return;
    const d = mdrag;
    mdrag = null;
    if (d.kind === 'bars') {
      if (!d.moved) {
        if (d.shift) selBars = { a: Math.min(playhead, d.anchor), b: Math.max(playhead, d.anchor) };
        else { playhead = d.anchor; selBars = null; }
      }
      selFrom = null;
      renderSong();
      return;
    }
    if (d.kind === 'chip') {
      body.querySelectorAll('.mp-num.drop').forEach(n => n.classList.remove('drop'));
      if (d.ghost) d.ghost.remove();
      if (!d.moved) {
        if (selBars) putProg(d.prog, selBars.a, selBars.b);
        else { const a = firstEmptyBar(); putProg(d.prog, a); }
      } else if (d.bar !== null && d.bar !== undefined) putProg(d.prog, d.bar);
      return;
    }
    const r = m.list[d.i];
    if (!d.moved) { selFrom = r ? r.from : null; selBars = null; renderSong(); return; }
    if (!r) { renderSong(); return; }
    if (d.kind === 'start' && d.to !== undefined && d.to !== r.from) { selFrom = d.to; T.setStretch(d.i, { from: d.to }); }
    else if (d.kind === 'end' && d.to !== undefined && d.to !== (r.to === 'melody' ? m.spans[d.i].last : r.to)) { selFrom = r.from; T.setStretch(d.i, { to: d.to }); }
    else if (d.kind === 'move' && d.delta) { selFrom = Math.max(m.firstBar, r.from + d.delta); T.moveStretch(d.i, d.delta); }
    else renderSong();
  };
  window.addEventListener('pointerup', endMapDrag);
  window.addEventListener('pointercancel', e => {
    if (!mdrag || e.pointerId !== mdrag.id) return;
    if (mdrag.ghost) mdrag.ghost.remove();
    mdrag = null;
    if (tab === 'song') renderSong();
  });

  body.addEventListener('click', e => {
    if (tab !== 'song') return;
    const b = e.target.closest('button');
    if (!b) return;
    const g = T.grid();
    const list = T.shown(g);
    const si = selIndex(list);
    const r = si >= 0 ? list[si] : null;
    if (b.dataset.unhere) {
      const [bar, beat, beats] = b.dataset.unhere.split(':').map(Number);
      T.setHereSpan(si, bar, beat, beats, null);
      return;
    }
    switch (b.dataset.song) {
      case 'play':
        if (SW.player.playing) SW.player.stop(); else playSongFrom(playhead);
        break;
      case 'play-sel': if (selBars) { playhead = selBars.a; playSongFrom(selBars.a); } break;
      case 'play-band': if (r) { playhead = Math.max(m.firstBar, r.from); playSongFrom(playhead); } break;
      case 'clear-sel': if (selBars) { const s = selBars; selBars = null; T.clearBars(s.a, s.b); } break;
      case 'unselect': selBars = null; renderSong(); break;
      case 'new': tab = 'build'; selProg = null; sel = null; fresh = null; render(); break;
      case 'edit': if (r && r.prog) { selProg = r.prog; sel = null; tab = 'build'; fresh = null; render(); } break;
      case 'remove': if (si >= 0) { selFrom = null; T.removeStretch(si); } break;
      case 'clear-here': if (si >= 0) T.setStretch(si, { here: null }); break;
      case 'to-melody':
        if (!r) break;
        if (r.to !== 'melody') { T.setStretch(si, { to: 'melody' }); break; }
        {
          // back to a bar: where it ends now — or, waiting past the melody, once through
          const sp = m.spans[si];
          const pr = r.prog ? T.prog(r.prog) : null;
          const once = pr ? Math.max(1, Math.ceil(T.cycleBeats(pr) / barBeats())) : 1;
          T.setStretch(si, { to: sp && !sp.waiting ? Math.max(r.from, sp.last) : r.from + once - 1 });
        }
        break;
    }
  });
  body.addEventListener('change', e => {
    if (tab !== 'song') return;
    const t = e.target;
    if (!t.dataset.field) return;
    const g = T.grid();
    const list = T.shown(g);
    const si = selIndex(list);
    if (si < 0) return;
    const r = list[si];
    const n = Number(t.value);
    switch (t.dataset.field) {
      case 'from': {
        if (!isFinite(n)) break;
        const v = Math.max(g.p0 ? 0 : 1, Math.min(999, Math.round(n)));
        if (v !== r.from) { selFrom = v; T.setStretch(si, { from: v }); }
        break;
      }
      case 'to': {
        if (!isFinite(n)) break;
        T.setStretch(si, { to: Math.max(r.from, Math.min(999, Math.round(n))) });
        break;
      }
      case 'times': {
        const p = T.prog(r.prog);
        if (!p || !isFinite(n) || n < 1) break;
        const bars = Math.max(1, Math.ceil(Math.round(n) * T.cycleBeats(p) / barBeats()));
        T.setStretch(si, { to: Math.min(999, r.from + bars - 1) });
        break;
      }
      case 'phase': T.setStretch(si, { phase: Number(t.value) }); break;
    }
  });

  function songKeyDown(e) {
    const k = e.key || '';
    const list = T.shown();
    const si = selIndex(list);
    switch (k) {
      case ' ':
        e.preventDefault();
        if (!e.repeat) { if (SW.player.playing) SW.player.stop(); else playSongFrom(playhead); }
        return true;
      case 'Delete': case 'Backspace':
        e.preventDefault();
        if (si >= 0) { selFrom = null; T.removeStretch(si); }
        return true;
      case 'ArrowLeft': case 'ArrowRight':
        e.preventDefault();
        playhead = Math.max(m ? m.firstBar : 1, playhead + (k === 'ArrowLeft' ? -1 : 1));
        renderSong();
        return true;
    }
    return true;                  // the chord and melody keys are quiet on the map
  }


  /* ==================================================================
     JUST HERE (phase 4, DESIGN.md §7) — opened by a double-click (a
     double tap) on a chord in the score, Enter with one selected, or on
     an empty bar. It covers exactly that chord's span (or the change
     already made there, all its chords) and changes it there only: the
     progression stays as it is (track.js setHereSpan). One chord, two or
     four; any chord (the board, its keys, More chords…, No chord); the
     progression's rhythm or its own. Back to Verse undoes the change
     there; Change it in Verse too writes it into the progression (one
     whole chord, not split). Every change is heard and drawn at once.
     ================================================================== */
  const hereSheet = document.getElementById('here-sheet');
  const hereBody = document.getElementById('here-body');
  const hereFoot = document.getElementById('here-foot');
  const hereTitle = document.getElementById('here-title');
  let here = null;           // { tick, bar, beat, beats, chords:[{chord,beats,place?,rhythm?}], sel, prog, entry, orig, pass, empty }
  const hereOpen = () => !!(hereSheet && hereSheet.classList.contains('show'));
  const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));

  /* the stretch the span is in now (the first chord put in an empty bar makes one) */
  function hereStretch() {
    const g = T.grid();
    const list = T.shown(g);
    const t = g.T(here.bar) + toTicks(here.beat - 1);
    return list.findIndex(r => { const a = Math.max(0, g.T(r.from)); const z = g.T(T.lastOf(r, g) + 1); return t >= a && t < z; });
  }
  function openHere(tick) {
    if (!hereSheet || !SW.settings.can('chords')) return;
    const g = T.grid();
    const h = T.hereAt(tick);
    const B = barBeats();
    if (h.empty) {
      here = { tick: Math.max(0, g.T(h.bar)), bar: h.bar, beat: 1, beats: B, chords: [{ chord: null, beats: B }], sel: 0, prog: null, empty: true };
    } else {
      const r = T.shown(g)[h.stretch];
      here = { tick, bar: h.bar, beat: h.beat, beats: h.beats, chords: h.chords.map(c => Object.assign({}, c)), sel: 0, prog: r && r.prog ? r.prog : null, entry: h.entry, empty: false };
      if (h.event && h.event.hereStep !== null && h.event.hereStep !== undefined) here.sel = h.event.hereStep;
      if (here.prog) {
        // what the progression itself plays over the span
        const bare = JSON.parse(JSON.stringify(r));
        delete bare.here;
        const t0 = g.T(h.bar) + toTicks(h.beat - 1), t1 = t0 + toTicks(h.beats);
        const under = T.expand(T.progressions(), [bare], g).filter(e => e.end > t0 && e.at < t1);
        here.orig = under.map(e => look(e.id).name);
        here.pass = under.length ? under[0].pass : 0;
      }
    }
    here.chords.forEach(c => { if (!c.beats) c.beats = here.beats / here.chords.length; });
    stopHear();
    if (SW.player && SW.player.playing) SW.player.stop();
    ui.openSheet('here-sheet');
    renderHere();
  }
  function hereSpanText() { return here.beats === barBeats() && here.beat === 1 ? 'bar ' + here.bar : 'these ' + here.beats + ' beats'; }

  function renderHere() {
    if (!here || !hereOpen()) return;
    const p = here.prog ? T.prog(here.prog) : null;
    const pname = p ? p.name : '';
    if (here.sel >= here.chords.length) here.sel = here.chords.length - 1;
    hereTitle.textContent = 'Bar ' + here.bar + (here.beat > 1 ? ', beat ' + here.beat : '') + ' — just here';
    let note;
    if (p) note = esc(pname) + ' plays <b>' + (here.orig || []).map(n => C.labelHTML(n)).join(' ') + '</b> here (' + ordinal((here.pass || 0) + 1) + ' time through). Only ' + esc(hereSpanText()) + ' changes — ' + esc(pname) + ' stays as it is.';
    else if (here.empty) note = 'No chords here yet: pick one, and it plays just here.';
    else note = 'Chords that belong to no progression: they change only here.';
    const n = here.chords.length, B = Math.round(here.beats);
    const splits = [['One chord', 1]];
    if (B >= 2) splits.push(['Two', 2]);
    if (B >= 4 && B % 4 === 0) splits.push(['Four', 4]);
    let html = ui.note('here.what', note, { block: true });
    html += '<div class="hw-split"><div class="hw-cards">' + here.chords.map((c, i) => hereCardHtml(c, i)).join('') + '</div>' +
      (splits.length > 1 ? '<div class="seg hw-seg" role="group" aria-label="How many chords">' + splits.map(([t, k]) => '<button type="button" class="seg-btn' + (n === k ? ' active' : '') + '" data-split="' + k + '">' + t + '</button>').join('') + '</div>' : '') +
    '</div>';
    html += '<div class="pw-duo">' +
      pickHtml('<button type="button" class="btn pw-small-btn" data-hw="more">More chords…</button><button type="button" class="btn pw-small-btn" data-hw="none">No chord</button>',
        ui.note('here.pick', 'Tap a card above, then a chord (or press its key — hold <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd> <kbd>V</kbd> <kbd>B</kbd> to change it). <b>No chord</b> makes it silent.')) +
      '<div class="pw-rhythm">' + hereRhythmHtml(p) + '</div>' +
    '</div>';
    hereBody.innerHTML = html;
    const one = n === 1;
    hereFoot.innerHTML =
      (p ? '<button type="button" class="btn" data-hw="back"' + (here.entry === undefined ? ' disabled' : '') + ' title="The chord ' + esc(pname) + ' plays here, back again">Back to ' + esc(pname) + '</button>' : '') +
      (p ? '<button type="button" class="btn pw-ghost" data-hw="writeback"' + (here.entry !== undefined && one ? '' : ' disabled') + ' title="' + (one ? 'Make this part of ' + esc(pname) + ' — every time through' : 'Only one whole chord can go into the progression') + '">Change it in ' + esc(pname) + ' too</button>' : '') +
      '<span class="pw-gap"></span><button type="button" class="btn btn-primary" data-hw="done">Done</button>';
    SW.chordStrip.fitLabels(hereBody.querySelector('.pw-board'));
  }
  function hereCardHtml(c, i) {
    const l = look(c.chord);
    const on = i === here.sel;
    const tones = l.tones.map(t => '<i style="--c:' + t.color + ';color:' + SW.chordStrip.inkOn(t.color) + '">' + esc(C.toneText(t)) + '</i>').join('');
    const many = here.chords.length > 1;
    return '<div class="pw-card hw-card' + (on ? ' on' : '') + (l.inScale ? '' : ' out') + '" data-hcard="' + i + '" style="--c:' + l.color + ';--cink:' + l.ink + '" role="button">' +
      '<div class="pw-card-top">' + (c.chord ? C.labelHTML(l.name) : '—') + '</div>' +
      '<div class="pw-card-tones">' + (tones || '<i style="--c:#E9DFEE">no chord</i>') + '</div>' +
      '<div class="pw-card-len own">' +
        (on && many ? '<button type="button" data-hlen="-1" aria-label="Shorter"' + (c.beats <= 1 ? ' disabled' : '') + '>−</button>' : '') +
        '<span>' + c.beats + (c.beats === 1 ? ' beat' : ' beats') + '</span>' +
        (on && many ? '<button type="button" data-hlen="1" aria-label="Longer">+</button>' : '') +
      '</div>' + (c.rhythm ? '<span class="pw-own-tag">own rhythm</span>' : '') +
    '</div>';
  }
  function hereScope() {
    const c = here.chords[here.sel];
    const len = toTicks(c.beats) / CELL;
    return {
      kind: 'here', key: 'here' + here.sel,
      cells: T.fit(T.cells(c.rhythm || '') || '', len), beats: len / perBeat(), colour: look(c.chord).color,
      write: r => { here.chords[here.sel].rhythm = r; commitHere(); },
      redraw: renderHere
    };
  }
  function hereRhythmHtml(p) {
    const c = here.chords[here.sel];
    const name = c.chord ? C.labelHTML(look(c.chord).name) : '—';
    const theirs = p ? esc(p.name) + '’s rhythm' : 'Held (struck once)';
    let html = '<div class="pw-rhead"><p class="pw-kicker">Rhythm <span class="pw-sub">— ' + name + '</span></p><span class="pw-gap"></span>' +
      '<div class="seg"><button type="button" class="seg-btn' + (c.rhythm ? '' : ' active') + '" data-hown="off">' + theirs + '</button><button type="button" class="seg-btn' + (c.rhythm ? ' active' : '') + '" data-hown="on">Its own</button></div>' +
      '</div>';
    if (c.rhythm) {
      html += rhythmTabsHtml(hereScope());
      if (rtab === 'pre') html += '<p class="pw-rnote">' + ui.note('pw.pre', 'Tap a line to play it. <b>Build your own</b> shows it as dots, to change it beat by beat.') + '</p>';
    } else {
      html += '<p class="pw-rnote">' + ui.note('here.rhythm', p ? 'It plays ' + esc(p.name) + '’s rhythm, as the bars around it do. <b>Its own</b> gives it a rhythm of its own, just here.' : 'Struck once and held. <b>Its own</b> gives it a rhythm.') + '</p>';
    }
    return html;
  }

  /* every change: written into the song at once (one Undo step each) */
  function commitHere() {
    const si = hereStretch();
    T.setHereSpan(si, here.bar, here.beat, here.beats, here.chords.map(c => {
      const o = { chord: c.chord, beats: c.beats };
      if (c.place) o.place = c.place;
      if (c.rhythm) o.rhythm = c.rhythm;
      return o;
    }));
    if (here.prog) { const h = T.hereAt(here.tick); here.entry = h.entry; }
    here.empty = false;
  }
  function herePick(place) {
    const e = C.entry(place);
    if (!e || !here) return;
    if (C.offered().indexOf(place) === -1) return;
    const id = C.toId(C.withHeld(e.spec));
    C.play(id, 'progression');
    const c = here.chords[here.sel];
    c.chord = id;
    if (!C.heldMods.size) c.place = place; else delete c.place;
    commitHere();
    if (here.sel < here.chords.length - 1) here.sel++;           // the next card is ready for the next chord
    renderHere();
  }
  function hereSplit(k) {
    const B = Math.round(here.beats);
    if (k === here.chords.length) return;
    const lens = k === 1 ? [here.beats] : k === 2 ? [Math.ceil(B / 2), Math.floor(B / 2)] : [B / 4, B / 4, B / 4, B / 4];
    const old = here.chords;
    here.chords = lens.map((beats, i) => ({ chord: (old[i] || old[old.length - 1]).chord, beats, place: (old[i] || old[old.length - 1]).place }));
    here.chords.forEach(c => { if (!c.place) delete c.place; });
    here.sel = Math.min(here.sel, here.chords.length - 1);
    commitHere();
    renderHere();
  }
  function hereLength(d) {
    const i = here.sel, cs = here.chords;
    if (cs.length < 2) return;
    const j = i + 1 < cs.length ? i + 1 : i - 1;              // the neighbour gives or takes the beat
    if (cs[i].beats + d < 1 || cs[j].beats - d < 1) return;
    cs[i].beats += d; cs[j].beats -= d;
    [i, j].forEach(k => { if (cs[k].rhythm) cs[k].rhythm = T.rhythmOf(tile(T.cells(cs[k].rhythm), toTicks(cs[k].beats) / CELL)); });
    commitHere();
    renderHere();
  }
  function hereOwn(on) {
    const c = here.chords[here.sel];
    if (!on) { delete c.rhythm; commitHere(); renderHere(); return; }
    // a copy of what it plays now
    const g = T.grid();
    let s = g.T(here.bar) + toTicks(here.beat - 1);
    for (let k = 0; k < here.sel; k++) s += toTicks(here.chords[k].beats);
    const len = toTicks(c.beats);
    const n = len / CELL;
    const a = 'R'.repeat(n).split('');
    const ev = T.events(g).find(e => e.at === s);
    if (ev) ev.strikes.forEach(k => { const k0 = (k.at - s) / CELL; for (let j = 0; j < k.len / CELL; j++) if (k0 + j < n) a[k0 + j] = j ? 'O' : 'X'; });
    else a[0] = 'X';
    c.rhythm = T.rhythmOf(sanitize(a.join('')));
    commitHere();
    renderHere();
  }

  if (hereSheet) {
    hereBody.addEventListener('pointerdown', e => {
      const modTab = e.target.closest('.pw-board .cmod');
      if (modTab) { holdTab(modTab, e); return; }
      const block = e.target.closest('.pw-board .cblock');
      if (block) { e.preventDefault(); herePick(block.dataset.place); }
    });
    hereBody.addEventListener('click', e => {
      const card = e.target.closest('[data-hcard]');
      const b = e.target.closest('button');
      if (b && b.dataset.hlen) { hereLength(Number(b.dataset.hlen)); return; }
      if (card && !b) {
        here.sel = Number(card.dataset.hcard);
        const c = here.chords[here.sel];
        if (c.chord && C.isKnown(c.chord)) C.play(c.chord, 'progression');
        renderHere();
        return;
      }
      if (!b) return;
      if (b.dataset.split) { hereSplit(Number(b.dataset.split)); return; }
      if (b.dataset.hown) { hereOwn(b.dataset.hown === 'on'); return; }
      if (b.dataset.hw === 'more') {
        const c = here.chords[here.sel];
        const idx = here.sel;
        openChordEditor({
          title: 'More chords — bar ' + here.bar + ', just here',
          spec: C.parse(c.chord) || { root: '1', q: 'maj', mods: [] },
          onChange: sp => { if (!here) return; here.chords[idx].chord = C.toId(sp); delete here.chords[idx].place; commitHere(); renderHere(); }
        });
        return;
      }
      if (b.dataset.hw === 'none') { const c = here.chords[here.sel]; c.chord = null; delete c.place; delete c.rhythm; commitHere(); renderHere(); return; }
      rhythmClick(b, hereScope(), renderHere);
    });
    hereFoot.addEventListener('click', e => {
      const b = e.target.closest('button[data-hw]');
      if (!b || !here) return;
      if (b.dataset.hw === 'done') { ui.closeSheet('here-sheet'); return; }
      if (b.dataset.hw === 'back') {
        T.setHereSpan(hereStretch(), here.bar, here.beat, here.beats, null);
        openHere(here.tick);
        return;
      }
      if (b.dataset.hw === 'writeback') {
        const name = (T.prog(here.prog) || {}).name || 'the progression';
        if (T.writeBack(here.tick)) { ui.toast('Now ' + name + ' plays it every time through'); openHere(here.tick); }
        else ui.toast('Only a change of one whole chord of ' + name + ' can go into it');
      }
    });
  }
  function hereKeyDown(e) {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return false;
    if (e.metaKey || e.ctrlKey) return false;
    const k = e.key || '';
    const key1 = k.length === 1 ? k.toLowerCase() : null;
    if (key1 && C.isModKey(key1)) { e.preventDefault(); if (!e.repeat) C.setMod(key1.toUpperCase(), true); return true; }
    const place = key1 && !e.altKey ? C.placeForKey(key1) : null;
    if (place) { e.preventDefault(); if (!e.repeat) herePick(place); return true; }
    switch (k) {
      case 'ArrowLeft': case 'ArrowRight':
        e.preventDefault();
        here.sel = Math.max(0, Math.min(here.chords.length - 1, here.sel + (k === 'ArrowLeft' ? -1 : 1)));
        renderHere();
        return true;
      case 'Delete': case 'Backspace': {
        e.preventDefault();
        const c = here.chords[here.sel]; c.chord = null; delete c.place; delete c.rhythm; commitHere(); renderHere();
        return true;
      }
      case 'Enter': e.preventDefault(); ui.closeSheet('here-sheet'); return true;
    }
    return true;
  }
  SW.bus.on('sheet:closed', d => { if (d.id === 'here-sheet') { here = null; C.clearMods(); } });
  // Undo, another song: what the window holds is no longer what is there
  SW.bus.on('score:changed', d => { if (hereOpen() && d && d.reason === 'history') ui.closeSheet('here-sheet'); });
  SW.bus.on('score:loaded', () => { if (hereOpen()) ui.closeSheet('here-sheet'); });
  ['chords:changed', 'names:changed'].forEach(evt => SW.bus.on(evt, () => { if (hereOpen()) renderHere(); }));

  /* ================= KEYS (app.js hands them over while the window is on top) ================= */
  function keyDown(e) {
    if (here && topSheet() && topSheet().id === 'here-sheet') return hereKeyDown(e);
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return false;
    const k = e.key || '';
    if ((e.metaKey || e.ctrlKey) && !e.altKey && /^[zy]$/i.test(k) && SW.history) {
      e.preventDefault();
      if (k.toLowerCase() === 'y' || e.shiftKey) SW.history.redo(); else SW.history.undo();
      return true;
    }
    if (e.metaKey || e.ctrlKey) return false;
    if (readOnly() && k !== ' ' && !((k === 'ArrowLeft' || k === 'ArrowRight') && !e.altKey)) return true;   // listen only: Space and the arrows
    if (tab === 'song') return songKeyDown(e);
    const key1 = k.length === 1 ? k.toLowerCase() : null;
    if (key1 && C.isModKey(key1)) {                      // here a change is a switch: on until pressed again
      e.preventDefault();
      const f = C.slotFunc(key1.toUpperCase());
      if (!e.repeat && f) toggleLatch(f.id);
      return true;
    }
    const place = key1 && !e.altKey ? C.placeForKey(key1) : null;
    if (place) { e.preventDefault(); if (!e.repeat) pick(place, keyHolder(e)); return true; }
    switch (k) {
      case 'Enter':
        if (typeof sel === 'number') { e.preventDefault(); editStep(sel, true); }
        return true;
      case 'ArrowLeft': case 'ArrowRight':
        e.preventDefault();
        if (e.altKey) moveSel(k === 'ArrowLeft' ? -1 : 1); else stepSel(k === 'ArrowLeft' ? -1 : 1);
        return true;
      case 'Delete': case 'Backspace':
        if (typeof sel === 'number') { e.preventDefault(); removeSel(); }
        return true;
      case ' ':
        e.preventDefault();
        if (!e.repeat) toggleHear();
        return true;
    }
    return true;                 // the melody keys are quiet while the window is open
  }

  /* ================= LISTEN ONLY =================
     A lesson with Chords: listen only (lessons.js), or a task that keeps
     the melody: the window opens to look and to listen — the progressions,
     their cards and rhythms, Hear it, the map and Play — and nothing in it
     changes the song. One guard on the sheet stops every other control
     before its own handler sees it; drags never move. */
  const readOnly = () => !SW.settings.can('chords');
  const RO_OK = '[data-tab], .sheet-close, [data-act="done"], .pw-pcard, .pw-pplay, .pw-hear, .pw-beat, .note-i, .fold-note, ' +
    '[data-song="play"], [data-song="play-sel"], [data-song="play-band"], [data-song="unselect"], [data-song="edit"]';
  function roGuard(e) {
    if (!isOpen() || !readOnly()) return;
    const t = e.target;
    if (!t || !t.closest) return;
    const c = t.closest('.pw-board, .mp-chip, .mp-h, button, input, select, textarea, label');
    if (!c || c.matches(RO_OK) || c.closest(RO_OK)) return;
    e.stopPropagation();
    e.preventDefault();
  }
  ['pointerdown', 'click', 'dblclick', 'change', 'input'].forEach(type => sheet.addEventListener(type, roGuard, true));

  /* ================= OPEN / CLOSE ================= */
  function open(progId, which) {
    if (!SW.settings.can('chords') && !SW.settings.can('chordsListen')) return;
    const list = T.progressions();
    selProg = (progId && T.prog(progId)) ? progId : (T.prog(selProg) ? selProg : (list[0] ? list[0].id : null));
    sel = null;
    fresh = null;
    if (which === 'song' || which === 'build') tab = which;
    selBars = null;
    confirmDelete = false;
    showStarters = false;
    if (SW.player && SW.player.playing) SW.player.stop();
    ui.openSheet('prog-sheet');
    render();
  }
  function close() { ui.closeSheet('prog-sheet'); }

  SW.bus.on('sheet:closed', d => {
    if (d.id !== 'prog-sheet') return;
    stopHear();
    releasePreview();
    clearTimeout(headTimer);
    if (mdrag && mdrag.ghost) mdrag.ghost.remove();
    mdrag = null;
    C.clearMods();
    confirmDelete = false;
  });
  // the song changed (a step, Undo, another song): draw it again, and Hear it plays what is there now
  SW.bus.on('score:changed', () => { if (isOpen()) { schedule(); rehear(); } });
  SW.bus.on('score:loaded', () => { if (isOpen()) { if (selProg && !T.prog(selProg)) selProg = null; schedule(); rehear(); } });
  ['chords:changed', 'names:changed', 'meter:changed', 'key:changed', 'layout:changed'].forEach(evt => SW.bus.on(evt, () => { if (isOpen()) { schedule(); rehear(); } }));
  SW.bus.on('history:changed', () => { if (isOpen()) syncUndo(); });
  // a held tab or key: the board's blocks relabel in place (a re-render would drop the pointer holding the tab)
  SW.bus.on('mods:changed', () => {
    [isOpen() ? body.querySelector('.pw-board') : null, hereOpen() ? hereBody.querySelector('.pw-board') : null].forEach(relabelBoard);
  });
  function relabelBoard(board) {
    if (!board) return;
    const latch = board.classList.contains('latch');     // Edit Chords: the blocks wear the changes switched on
    board.querySelectorAll('.cblock').forEach(b => {
      const e = C.entry(b.dataset.place);
      if (!e) return;
      const tmp = document.createElement('div');
      tmp.innerHTML = blockFor(b.dataset.place, 1, latch);
      const nb = tmp.firstChild;
      b.innerHTML = nb.innerHTML;
      b.className = nb.className;
      b.style.setProperty('--c', nb.style.getPropertyValue('--c'));
      b.style.setProperty('--ink', nb.style.getPropertyValue('--ink'));
    });
    board.querySelectorAll('.cmod[data-mod]').forEach(t => t.classList.toggle('on', C.heldMods.has(t.dataset.mod)));
    SW.chordStrip.fitLabels(board);
  }
  // the song starting stops Hear it
  SW.bus.on('play:changed', d => {
    if (d.playing && hear.on) { stopHear(); render(); }
    if (isOpen() && tab === 'song') { renderSong(); followHead(); }
  });
  SW.bus.on('policy:changed', () => {
    if (hereOpen() && !SW.settings.can('chords')) ui.closeSheet('here-sheet');
    if (!isOpen()) return;
    if (!SW.settings.can('chords') && !SW.settings.can('chordsListen')) close(); else render();   // listen only: the same window, read-only
  });
  window.addEventListener('resize', () => {
    if (!isOpen()) return;
    const mr = body.querySelector('.pw-modrow');
    if (mr) syncModRow(modOffset(mr));
    if (tab === 'song') schedule(); else SW.chordStrip.fitLabels(body.querySelector('.pw-board'));
  });

  SW.progWin = { open, openHere, close, isOpen, onTop, keyDown, render, tab: () => tab, setTab };
})();

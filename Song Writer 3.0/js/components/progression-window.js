/* ==========================================================================
   COMPONENT — the Chords window                                 #prog-sheet
   --------------------------------------------------------------------------
   Phase 2 of ../Song Writer Chord Progressions/ (DESIGN.md §4). One window
   for everything about the chords (2026-10-28, the user: "two different
   menus doing different tasks … we need to unify everything"), its three
   tabs:
     INDIVIDUAL FOCUS ('focus') — one chord of the song: its chord, length
       and rhythm (was the chord-on-the-music window, #here-sheet). A
       double-click on a chord — over the music or on the Time Line —
       opens the window here.
     CHORD CHARTS ('build', was Edit Chords) — the progressions: made,
       named, heard. The Chord Progression button opens the window here.
     TIME LINE ('song', was Chord Placement) — the song's chords laid out
       in groups of separate chords, moved, copied, pasted, taken out.

   The Chord Charts page (2026-10-05), the first time — the draft, or a
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
   • RHYTHM (left) — the progression's rhythm, every chord plays it: the
     rhythm box (components/rhythm-box.js, 2026-10-27) — HELD (each chord
     struck once, ringing as long as it lasts), PRE-BUILT (the meter's
     rhythms as lines of notes), BUILD YOUR OWN (Rhythm Poetry's circles,
     as on the Rhythm page); 1 bar · 2 bars on the tabs' row. A selected
     chord with a rhythm of its own shows that one instead.
   • THE CHORD EDITOR (#pchord-sheet) — root; quality (Major · Minor ·
     Diminished · Augmented) with the changes beside it; from a
     double-click also its rhythm — the same box, always open: the
     progression's until one is chosen there, then its own.
   • ▶ HEAR IT — the progression round and round on the audio clock (its
     own little scheduler, the track's strikes); a change while it plays
     takes effect at once, with no gap and no strike played twice.
   • Every change is a step in the song's history (↶ ↷ in the head, ⌘Z).
   • Place it in the song — the first bar with no chords, to the end of
     the melody (or once through past it); the window turns to the Time
     Line with it selected.
   • THE TIME LINE (was Chord Placement, phase 3) — below, before the keys.
   • INDIVIDUAL FOCUS (was the chord on the music, and Just here, phase
     4) — below, after the Time Line.

   API  SW.progWin.open(progId?, 'focus' | 'build' | 'song') · openHere(tick) · close() · isOpen() · onTop() · keyDown(e)
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
  let fresh = null;          // the progression being made now: its page shows as the first time (a guide, top to bottom)
  const latched = new Set(); // the changes switched on under the board (sus2, ♭7, 6/4 …): on until tapped again
  let lastTap = null;        // { i, t }: a card tapped — a second tap on it soon after opens its editor
  let showStarters = false;
  let confirmDelete = false;
  let beatOn = false;        // Hear it: the steady beat
  let renderTimer = 0;
  let drawn = null;          // the tab last drawn
  let tab = 'build';         // 'focus' (Individual Focus) | 'build' (Chord Charts) | 'song' (Time Line)
  let here = null;           // Individual Focus: { at } — the chord that starts there, or (none) the empty beat
  let selFrom = null;        // Time Line: the group selected, by the bar it starts on
  let tlSel = [];            // Time Line: the chords selected, by where they start (ticks)
  let tlAnchor = null;       // Time Line: ⇧-tap selects along from this chord
  let tlPoint = 0;           // Time Line: the point (ticks) — where Paste goes in and Play starts
  let clip = null;           // Time Line: what Copy took — { kind: 'chords', block } | { kind: 'group', st, name }

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
    return !!top && top === sheet;
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
  /* what a chord plays, as cells over its n: its strikes */
  function playedCells(ev, n) {
    const a = 'R'.repeat(n).split('');
    if (ev) ev.strikes.forEach(s => {
      const k0 = (s.at - ev.at) / CELL;
      for (let k = 0; k < s.len / CELL; k++) if (k0 + k < n) a[k0 + k] = k ? 'O' : 'X';
    });
    else a[0] = 'X';
    return sanitize(a.join(''));
  }
  /* a rhythm from the box (components/rhythm-box.js): 'held', cells, or null → a rhythm string */
  const asRhythm = v => (v === T.HELD ? T.HELD : v ? T.rhythmOf(sanitize(v)) : null);

  /* What the rhythm box is about: the progression's rhythm — every chord
     plays it (held, or a bar or two over and over) — or the selected
     chord's own, when it has one. */
  function scope() {
    const p = cur();
    const m = mt();
    if (p && typeof sel === 'number' && p.chords[sel] && p.chords[sel].rhythm) return stepScopeOf(p, sel, render);
    const bars = (p && p.bars) || 1;
    const n = m.barTicks * bars / CELL;
    const held = !!(p && p.rhythm === T.HELD);
    const c = p && p.rhythm && !held ? T.cells(p.rhythm) : null;
    return {
      key: 'bar:' + (p ? p.id : 'new'), kind: 'bar', bars, held,
      cells: held ? SW.rhythmBox.heldCells(n) : T.fit(c || T.defaultCells(m, bars), n),
      colour: '#9C168E', readOnly: readOnly(),
      write: v => T.setProg(ensureProg(), { rhythm: asRhythm(v) }),
      setBars: k => setTwoBars(k === 2),
      redraw: render
    };
  }
  /* one chord of a progression: its own rhythm, or the progression's that it plays */
  function stepScopeOf(p, i, redraw) {
    const st = p.chords[i];
    const n = toTicks(stepBeats(p, st)) / CELL;
    let off = 0;
    for (let k = 0; k < i; k++) off += toTicks(stepBeats(p, p.chords[k]));
    const held = st.rhythm ? st.rhythm === T.HELD : p.rhythm === T.HELD;
    let cells;
    if (held) cells = SW.rhythmBox.heldCells(n);
    else if (st.rhythm) cells = T.fit(T.cells(st.rhythm) || '', n);
    else cells = playedCells(firstPass(p).find(e => e.step === i), n);
    const id = p.id;
    return {
      key: 'own:' + id + ':' + i, kind: 'chord', held, cells, lead: (off % mt().barTicks) / CELL,
      colour: look(st.chord).color, readOnly: readOnly(), follows: p.name, own: !!st.rhythm,
      // every chord of it plays this: the progression's rhythm, and this one's own gone — one step
      toAll: v => {
        const q = T.prog(id);
        if (!q) return;
        T.setProg(id, { rhythm: v === T.HELD ? T.HELD : T.rhythmOf(v), bars: null,
          chords: q.chords.map((c, k) => { if (k !== i) return c; const o = Object.assign({}, c); delete o.rhythm; return o; }) });
      },
      write: v => T.setStep(id, i, { rhythm: asRhythm(v) }),
      redraw: redraw || render
    };
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
    if (tab === 'focus' && readOnly()) tab = 'build';            // listen only: no chord to change
    const bodyTop = drawn === tab ? body.scrollTop : 0;          // the tab drawn again keeps its place
    drawn = tab;
    syncTabs();
    sheet.classList.toggle('readonly', readOnly());
    body.classList.toggle('song', tab === 'song');
    body.classList.toggle('focus', tab === 'focus');
    if (tab === 'song') { renderSong(); body.scrollTop = bodyTop; syncUndo(); return; }
    if (tab === 'focus') { renderFocus(); body.scrollTop = bodyTop; syncUndo(); return; }
    body.innerHTML = '<aside class="pw-list">' + listHtml() + '</aside><section class="pw-main">' + mainHtml(p) + '</section>';
    foot.innerHTML = footHtml(p);
    SW.chordStrip.fitLabels(body.querySelector('.pw-board'));
    const main = body.querySelector('.pw-main');
    if (main) main.scrollTop = top;
    syncModRow(modOff);
    SW.rhythmBox.layout(body);
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
    if (t === 'focus' && readOnly()) return;
    if (t !== 'build') stopHear();
    // the chord selected on the Time Line is the one in focus — and back again
    if (t === 'focus' && tab === 'song' && tlSel.length) here = { at: tlSel[0] };
    if (t === 'song' && tab === 'focus' && here) {
      const pc = T.chordAt(here.at);
      if (pc) { tlSel = [pc.at]; tlAnchor = pc.at; selFrom = null; tlPoint = pc.at; }
    }
    tab = t;
    fresh = null;                // left behind: next time it shows as made
    td = null;
    render();
  }
  if (tabsEl) tabsEl.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) setTab(b.dataset.tab); });

  function whereText(id) {
    const st = T.stretches().filter(r => r.prog === id);
    if (!st.length) return 'not in the song yet';
    const g = T.grid();
    // made on the music (its home) first: where it was written, then where else it is placed
    const at = r => {
      const last = T.lastOf(r, g);                 // up to the next stretch
      if (r.to === 'melody' && last >= g.lastBar) return 'bar ' + r.from + ' to the end of the melody';
      return r.from === last ? 'bar ' + r.from : 'bars ' + r.from + '–' + last;
    };
    const home = st.find(r => r.home);
    const rest = st.filter(r => !r.home);
    return (home ? 'made on the music: ' + at(home) + (rest.length ? '; also ' : '') : 'in the song: ') + rest.map(at).join(', ');
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
        '<div class="pw-cards pw-grid">' + (p ? cardsHtml(p) : '') + plusHtml() + '</div>' +
      '</div>' +
      (p && p.chords.length ? ui.note('pw.build2', '<b>Double-click</b> a chord to change it or give it a rhythm of its own; drag one to move it.') : '') +
      '</section>';
    if (first) html += '<section class="pw-sec pw-finish"><h3 class="pw-h">Name your chord progression and hear it</h3>' + nameRowHtml(p) + '</section>';
    return html;
  }
  /* made, and come back to: its name, ▶ and Place it, then its chords as
     a plain summary (they light as it plays). The chords are CHANGED below,
     in Build your chord progression, beside Add a chord — the same place
     as the first time, so the tools never move. */
  function headHtml(p) {
    return '<section class="pw-sec pw-headsec">' + nameRowHtml(p) +
      (p.chords.length ? '<div class="pw-cards pw-summary" aria-label="Its chords, in order">' + cardsHtml(p, true) + '</div>' : '<p class="pw-none">No chords yet — play one below.</p>') +
    '</section>';
  }
  function nameRowHtml(p) {
    const name = p ? p.name : 'Progression ' + (T.progressions().length + 1);
    const hearingThis = hear.on && !hear.once && p && hear.id === p.id;
    return '<div class="pw-namerow">' +
      '<input class="pw-name text-field" type="text" maxlength="24" value="' + esc(name) + '" aria-label="The progression’s name"' + (p ? '' : ' placeholder="' + esc(name) + '"') + (readOnly() ? ' readonly tabindex="-1"' : '') + '>' +
      '<button type="button" class="pw-hear' + (hearingThis ? ' on' : '') + '"' + (p && p.chords.length ? '' : ' disabled') + ' title="Hear it round and round (Space)">' + (hearingThis ? '<span class="sq"></span> Stop' : playIcon() + ' Hear it') + '</button>' +
      '<label class="pw-beat"><input type="checkbox" class="pw-beat-box"' + (beatOn ? ' checked' : '') + '> beat</label>' +
      (readOnly() ? '' : '<span class="pw-gap"></span><button type="button" class="btn pw-put"' + (p && p.chords.length ? '' : ' disabled') + ' title="Put it in the song, from the first bar with no chords — then the Time Line shows where">Place it in the song ▸</button>') +
    '</div>';
  }
  function eachHtml(p) {
    const each = p ? (p.beats || barBeats()) : barBeats();
    return '<div class="pw-each"><span class="pw-each-label">Each chord lasts</span><span class="pw-each-row">' +
      '<span class="pw-stepper"><button type="button" data-each="-1" aria-label="Shorter"' + (each <= 1 ? ' disabled' : '') + '>−</button><b>' + each + (each === 1 ? ' beat' : ' beats') + '</b><button type="button" data-each="1" aria-label="Longer"' + (each >= 16 ? ' disabled' : '') + '>+</button></span>' +
      '<small>' + esc(barText(each)) + '</small></span></div>';
  }
  function cardsHtml(p, summary) {
    const passes = firstPass(p);
    return p.chords.map((st, i) => cardHtml(p, st, i, passes, summary)).join('');
  }
  /* Add a chord: nothing is placed until it is pressed (play chords freely
     till then). Pressed, it listens — "Play a chord to place it here" — and
     every chord played goes in at the end, until a press anywhere else. */
  function plusHtml() {
    const on = sel === 'plus';
    return '<div class="pw-card plus' + (on ? ' on listening' : '') + '" data-card="plus" role="button" aria-pressed="' + on + '" title="' + (on ? 'Listening: each chord you play goes in at the end. Tap anywhere else to stop.' : 'Tap, then play a chord: it goes in at the end') + '">' +
      (on ? '<span class="pw-listen" aria-hidden="true">♪</span><small>Play a chord to place it here</small>' : '<span class="pw-plus">+</span><small>Add a chord</small>') + '</div>';
  }

  /* `summary`: the head's copy — no data-card (so no select, drag, × or
     length buttons; data-sum lights it while it sounds) */
  function cardHtml(p, st, i, passes, summary) {
    const l = look(st.chord);
    const on = !summary && sel === i;
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
    return '<div class="pw-card' + (on ? ' on' : '') + (l.inScale ? '' : ' out') + (l.known ? '' : ' unknown') + (summary ? ' pw-sum' : '') + '" ' + (summary ? 'data-sum="' + i + '"' : 'data-card="' + i + '" role="button"') + ' style="--c:' + l.color + ';--cink:' + l.ink + '" title="' + esc((l.known ? l.d.roman + ' — ' + l.d.letter + ' · ' + l.tones.map(t => t.name).join(' ') : 'A chord the app cannot read') + (ro || summary ? '' : ' — double-click to change it')) + '">' +
      '<div class="pw-card-top">' + C.labelHTML(l.name) + '</div>' +
      (on ? '<button type="button" class="pw-card-x" data-x="' + i + '" title="Take it out (Delete)" aria-label="Take this chord out">×</button>' : '') +
      '<div class="pw-card-tones">' + tones + '</div>' +
      '<div class="pw-card-len' + (st.beats ? ' own' : '') + '">' +
        (on ? '<button type="button" data-len="-1" aria-label="Shorter"' + (beats <= 1 ? ' disabled' : '') + '>−</button>' : '') +
        '<span>' + beats + (beats === 1 ? ' beat' : ' beats') + '</span>' +
        (on ? '<button type="button" data-len="1" aria-label="Longer"' + (beats >= 16 ? ' disabled' : '') + '>+</button>' : '') +
      '</div>' + dots +
      (st.rhythm ? '<span class="pw-own-tag">' + (st.rhythm === T.HELD ? 'held' : 'its own rhythm') + '</span>' : '') +
    '</div>';
  }

  /* the panel's board; `latch` (the Chord Charts page): every change under
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

  /* the rhythm: a title, then the box (Held · Pre-built · Build your own) */
  function rhythmHtml(p) {
    const sc = scope();
    const whose = sc.kind === 'chord'
      ? '<span class="pw-sub">— ' + C.labelHTML(look(p.chords[sel].chord).name) + '’s own</span>'
      : '<span class="pw-sub">— every chord plays</span>';
    return '<div class="pw-rhead"><p class="pw-kicker">Rhythm ' + whose + '</p></div><div class="pw-rbody">' + SW.rhythmBox.html(sc) + '</div>';
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
     melody (or once through, past it) — then the Time Line, with it selected. */
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
    tlSel = [];
    tlPoint = Math.max(0, g.T(from));
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
    body.querySelectorAll('.pw-card[data-card="' + hear.lit + '"], .pw-card[data-sum="' + hear.lit + '"]').forEach(c => c.classList.add('sounding'));
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
    if (SW.rhythmBox.click(b, scope())) return;
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
     rhythm too, in the rhythm box (Held · Pre-built · Build your own):
     the progression's until one is chosen, then its own — the one the
     big window shows while it is selected.
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
  /* the chord's rhythm: the progression's, or its own (the rhythm box) */
  function stepScope() {
    return stepScopeOf(T.prog(ed.step.prog), ed.step.i, renderEditor);
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
    // its rhythm (a double-click: a chord of the progression) — Held · Pre-built · Build your own, always there
    if (ed.step && ed.rhythm) {
      html += '<div class="ce-rhythm"><div class="pw-rhead"><p class="pw-kicker">Rhythm</p></div><div class="pw-rhythm">' + SW.rhythmBox.html(stepScope()) + '</div></div>';
    }
    edBody.innerHTML = html;
    SW.rhythmBox.layout(edBody);
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
      if (ed.step && ed.rhythm) SW.rhythmBox.click(b, stepScope());
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
     THE TIME LINE (2026-10-28; was Chord Placement, phase 3) — the song's
     bars, its melody's lines, and its chords in GROUPS: each progression
     in the song is a group of separate chords (track.js THE TIME LINE).
       • a group's top strip (its corner tab ⠿ and name): a tap selects
         the group (its card below: where it plays, how many times
         through, its changes here, take it out); a drag moves all of it,
         a bar at a time — the groups beside it move over to make room;
         the selected group's right grip stretches it over more bars
       • a chord: a tap selects it (⇧ along to it, ⌘ one more) — heard,
         and the point goes to its nearer end; a drag moves it (all the
         selected ones): inside its own row of chords end to end it is a
         reorder (A B C D, B between C and D → A C B D), anywhere else it
         leaves silence and goes in where it is let go (⌥: a copy), the
         chords on the side with room moving over; a double tap:
         Individual Focus on it
       • THE POINT (an orange line): where Paste goes and Play starts — a
         tap on empty time, a bar number, a chord's nearer end
       • Copy ⌘C · Cut ⌘X · Paste ⌘V (at the point) · Duplicate ⌘D (right
         after) · Delete (silence where they were) — buttons too; ← → the
         chord before / after (none selected: the point a beat), ⌥← ⌥→ a
         chord one place along its row; Enter: Individual Focus; Space:
         Play; ⌘A every chord
       • drag along the bar numbers: the chords in those bars, selected
       • Put in: drag a progression onto a bar, or tap it (at the point)
         — once through, a group of its own
       • ▶ Play: the toolbar's Play, from the point's bar; the playhead
         follows the music (SW.player.position)
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
  let m = null;                // the Time Line's geometry, as last drawn
  let td = null;               // a press on the Time Line: a chord, a group, its grip, the numbers, a chip, empty time
  let headTimer = 0;
  let lastTlTap = null;        // { key, t }: a second tap soon after is a double tap

  function stretchName(r) {
    if (r.prog) { const p = T.prog(r.prog); return p ? p.name : '?'; }
    return T.isVirtual() ? 'From the lane' : 'Chords';
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
    const BW = window.innerWidth <= 720 ? 64 : 88;
    const W0 = g.p0 ? Math.max(24, Math.round(BW * g.p0 / g.B)) : 0;
    const firstBar = g.p0 ? 0 : 1;
    const trackLast = evs.end ? g.barAt(evs.end - 1) : 0;
    const waitingLast = list.reduce((mx, r) => Math.max(mx, r.from), 0);
    const lastShown = Math.max(16, Math.max(g.lastBar, trackLast, waitingLast, g.barAt(tlPoint)) + 8);
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
    const pcs = evs.filter(e => e.id);              // the chords, each with its group (e.stretch)
    return { g, evs, pcs, list, spans, BW, W0, firstBar, lastShown, x, xb, width: xb(lastShown + 1) };
  }
  /* a point on the screen → x on the Time Line, in its own pixels (the sheet
     opens with a little zoom: the screen's pixels are not the map's until it ends) */
  function mapX(clientX) {
    const inner = body.querySelector('.mp-inner');
    if (!inner || !m) return null;
    const r = inner.getBoundingClientRect();
    return (clientX - r.left) * (inner.offsetWidth / (r.width || 1));
  }
  function barAtClientX(clientX) {
    const xx = mapX(clientX);
    if (xx === null) return null;
    let bar = xx < m.W0 ? (m.g.p0 ? 0 : 1) : 1 + Math.floor((xx - m.W0) / m.BW);
    return Math.max(m.firstBar, Math.min(m.lastShown, bar));
  }
  /* a point on the Time Line → ticks (the inverse of m.x) */
  function tickAtX(clientX) {
    const xx = mapX(clientX);
    if (xx === null) return 0;
    const t = m.W0 && xx < m.W0 ? xx / m.W0 * m.g.p0 : m.g.p0 + (xx - m.W0) / m.BW * m.g.B;
    return Math.max(0, t);
  }
  const snapBeat = t => { const g = m.g; return Math.max(0, g.p0 + Math.round((t - g.p0) / g.b) * g.b); };
  /* the bar a group put in at the point starts on: the nearest bar line */
  function pointBar() {
    const g = T.grid();
    return Math.max(g.p0 ? 0 : 1, Math.round((tlPoint - g.p0) / g.B) + 1);
  }
  const playBar = () => Math.max(T.grid().p0 ? 0 : 1, T.grid().barAt(tlPoint));
  const tool = (act, label, keys, off) => '<button type="button" class="btn tl-tool" data-tl="' + act + '"' + (off ? ' disabled' : '') + ' title="' + esc(label) + ' (' + keys + ')">' + label + '</button>';

  function renderSong() {
    const scroller = body.querySelector('.mp-scroll');
    const keepX = scroller ? scroller.scrollLeft : null;
    m = geometry();
    const { g, list, spans, pcs, BW, W0, x, xb } = m;
    const si = selIndex(list);
    if (si < 0) selFrom = null;
    tlSel = tlSel.filter(at => pcs.some(e => e.at === at));
    const playing = SW.player && SW.player.playing;
    const ro = readOnly();
    const some = tlSel.length > 0 || si >= 0;
    let html = '<div class="mp-top tl-top">' +
      '<button type="button" class="pw-hear mp-play' + (playing ? ' on' : '') + '" data-song="play">' + (playing ? '<span class="sq"></span> Stop' : playIcon() + ' Play from bar ' + playBar()) + '</button>' +
      (ro ? '' : '<span class="tl-tools">' + tool('copy', 'Copy', '⌘C', !some) + tool('cut', 'Cut', '⌘X', !some) +
        tool('paste', 'Paste', '⌘V', !clip) + tool('delete', 'Delete', 'Delete', !some) + '</span>') +
      (ro ? ui.note('tl.listen', 'Each band is a progression, its chords inside it. Tap one to see it; tap a bar number to start playing there.')
        : ui.note('tl.how', 'Drag a chord to move it — dropped between two chords it slides in and the others make room. Drag a group by its top strip to move all of it. Tap a chord, then Copy, Cut, Paste (at the orange point) or Delete.')) +
      '</div>';

    let nums = '', mel = '', chords = '';
    for (let b = m.firstBar; b <= m.lastShown; b++) {
      const w = b === 0 ? W0 : BW;
      const past = b > Math.max(g.lastBar, m.evs.end ? g.barAt(m.evs.end - 1) : 0);
      nums += '<div class="mp-num' + (past ? ' past' : '') + (b === playBar() ? ' here' : '') + '" data-bar="' + b + '" style="left:' + xb(b) + 'px;width:' + w + 'px">' + (b > 0 ? b : '') + '</div>';
    }
    const model = SW.score.read().lines;
    g.song.lines.forEach((le, i) => {
      if (!le.padded) return;
      const left = x(le.at), w = x(le.at + le.padded) - left;
      const words = (model[i] ? model[i].syllables : []).map(s => s.text).filter(t => t && t !== '-').join(' ');
      const label = model[i] && model[i].label ? '<b>' + esc(model[i].label) + '</b>' : '';
      mel += '<div class="mp-mel" data-bar="' + Math.max(m.firstBar, g.barAt(le.at)) + '" style="left:' + (left + 1) + 'px;width:' + Math.max(8, w - 3) + 'px;--c:' + lineColour(i) + '" title="' + esc(words) + '">' + label + '<span>' + esc(words.length > 60 ? words.slice(0, 58) + '…' : words) + '</span></div>';
    });
    const melEnd = x(g.total);
    if (m.width - melEnd > BW) mel += '<div class="mp-nomel" style="left:' + (melEnd + 2) + 'px;width:' + (m.width - melEnd - 6) + 'px">no melody yet — the chords play on</div>';

    // the groups, then their chords over them
    list.forEach((r, i) => {
      const sp = spans[i];
      const band = bandOf(r.prog);
      const p = r.prog ? T.prog(r.prog) : null;
      const left = x(sp.a), w = sp.waiting ? BW : x(sp.z) - left;
      const on = i === si;
      const times = p && !sp.waiting ? timesText((sp.z - sp.a) / g.b / T.cycleBeats(p)) : '';
      chords += '<div class="tl-group' + (on ? ' on' : '') + (sp.waiting ? ' waiting' : '') + (r.prog ? '' : ' loose') + '" data-stretch="' + i + '" style="left:' + (left + 1) + 'px;width:' + Math.max(12, w - 2) + 'px;--bc:' + band.bc + ';--bd:' + band.bd + '">' +
        '<div class="tl-ghead" data-ghead="' + i + '" title="' + esc(stretchName(r)) + (ro ? '' : ' — drag here to move all of it') + '"><span class="tl-grip" aria-hidden="true"></span><b>' + esc(stretchName(r)) + '</b>' +
          (sp.waiting ? '<span>waits for the melody</span>' : times && times !== 'once through' ? '<span>' + esc(times) + '</span>' : '') + '</div>' +
        (on && !ro ? '<span class="mp-h r" data-handle="r" title="Drag: more bars, or fewer"></span>' : '') +
      '</div>';
    });
    pcs.forEach(e => {
      const l = look(e.id);
      const cx = x(e.at), cw = x(e.end) - cx;
      chords += '<div class="tl-chord' + (tlSel.indexOf(e.at) !== -1 ? ' sel' : '') + (l.inScale ? '' : ' out') + '" data-at="' + e.at + '" data-si="' + e.stretch + '" style="left:' + (cx + 2) + 'px;width:' + Math.max(4, cw - 4) + 'px;--c:' + l.color + ';--ck:' + l.ink + '" title="' + esc(l.name) + (e.here ? ' — changed here' : '') + '">' +
        (cw >= 16 ? '<span>' + C.labelHTML(l.name) + '</span>' : '') + (e.here ? '<i class="tl-corner"></i>' : '') + '</div>';
    });
    if (!list.length) chords += '<div class="mp-empty" style="left:2px;width:' + Math.min(m.width - 4, BW * 10) + 'px">No chords in the song yet — put a progression in, below</div>';

    html += '<div class="mp-wrap"><div class="mp-labels"><span>Bar</span><span>Melody</span><span>Chords</span></div>' +
      '<div class="mp-scroll"><div class="mp-inner" style="width:' + m.width + 'px">' +
        '<div class="mp-row mp-nums">' + nums + '</div>' +
        '<div class="mp-row mp-mels">' + mel + '</div>' +
        '<div class="mp-row mp-chords">' + chords +
          '<div class="tl-point" style="left:' + x(tlPoint) + 'px" title="The point: Paste goes here, Play starts here"></div>' +
        '</div>' +
        '<div class="mp-head" style="display:none"></div>' +
      '</div></div></div>';

    html += '<div class="mp-card">' + tlCardHtml(si) + '</div>';

    html += '<div class="mp-putin"><p class="pw-kicker">Put in</p>' +
      T.progressions().map(p => { const b = bandOf(p.id); return '<button type="button" class="mp-chip" data-chip="' + p.id + '" style="--bc:' + b.bc + ';--bd:' + b.bd + '"' + (p.chords.length ? '' : ' disabled title="No chords yet"') + '>' + esc(p.name) + '</button>'; }).join('') +
      '<button type="button" class="mp-chip new" data-song="new">+ New</button>' +
      ui.note('tl.putin', 'Drag one onto a bar, or tap one to put it in at the point (bar ' + pointBar() + ') — once through, a group of its own. The groups after it move over if they need to.') +
      '</div>';

    body.innerHTML = html;
    foot.innerHTML = ui.note('tl.room', 'Groups never overlap: one moved or put in among others goes in at the bar line nearest, and the groups on the side with room move over.') +
      '<span class="pw-gap"></span><button type="button" class="btn btn-primary" data-act="done">Done</button>';
    const sc = body.querySelector('.mp-scroll');
    if (sc) {
      if (keepX !== null) sc.scrollLeft = keepX;
      else if (si >= 0) sc.scrollLeft = Math.max(0, x(spans[si].a) - 60);
      else if (tlSel.length) sc.scrollLeft = Math.max(0, x(tlSel[0]) - 120);
      else sc.scrollLeft = Math.max(0, x(tlPoint) - 120);
    }
    paintHead();
  }
  const LINE_TINTS = ['#E9F3FE', '#FFF6DC', '#E8F7EE', '#FBE9F4', '#EFEAFE', '#FFEDE0'];
  const lineColour = i => LINE_TINTS[i % LINE_TINTS.length];

  /* the card under the Time Line: the group selected, the chords selected, or how to start */
  function tlCardHtml(si) {
    if (si >= 0) return groupCardHtml(si);
    const g = m.g;
    if (tlSel.length) {
      const sel = m.pcs.filter(e => tlSel.indexOf(e.at) !== -1);
      const first = sel[0], last = sel[sel.length - 1];
      const b1 = g.barAt(first.at), b2 = g.barAt(last.end - 1);
      const bars = b1 === b2 ? 'bar ' + b1 : 'bars ' + b1 + '–' + b2;
      const r = m.list[first.stretch];
      const p = r && r.prog ? T.prog(r.prog) : null;
      const groups = new Set(sel.map(e => e.stretch));
      let title, whose = '';
      if (sel.length === 1) {
        const beats = Math.round((first.end - first.at) / g.b * 100) / 100;
        title = C.labelHTML(look(first.id).name) + ' <span class="mp-where">· ' + bars + (first.at !== g.T(b1) ? ', beat ' + (Math.round((1 + (first.at - g.T(b1)) / g.b) * 100) / 100) : '') + ' · ' + beats + (beats === 1 ? ' beat' : ' beats') + '</span>';
      } else title = sel.length + ' chords <span class="mp-where">· ' + bars + '</span>';
      if (groups.size === 1 && p) {
        whose = r.home ? 'In <b>' + esc(p.name) + '</b>, made on the music: a change here changes ' + esc(p.name) + ' in Chord Charts too.'
          : 'In <b>' + esc(p.name) + '</b>: a change here is just here — ' + esc(p.name) + ' in Chord Charts stays as it is.';
      }
      return '<h3 class="mp-card-title">' + title + '</h3>' + (whose ? '<p class="tl-whose">' + whose + '</p>' : '') +
        '<div class="mp-actions">' +
          (sel.length === 1 && !readOnly() ? '<button type="button" class="btn" data-tl="focus">Individual Focus</button>' : '') +
          '<button type="button" class="btn" data-tl="play-sel">' + playIcon() + ' Play from bar ' + b1 + '</button>' +
          (readOnly() ? '' : '<button type="button" class="btn pw-ghost" data-tl="duplicate" title="A copy right after it (⌘D)">Duplicate</button>') +
          '<button type="button" class="btn pw-ghost" data-tl="unselect">Done selecting</button>' +
        '</div>';
    }
    return '<p class="mp-card-empty">' + (m.list.length ? 'Tap a chord to select it — or a group’s top strip to select the whole group.' : 'Put a progression in from the row below.') + '</p>';
  }
  function groupCardHtml(si) {
    const g = m.g;
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
    if (p) html += '<p class="tl-whose">' + (r.home ? 'Made on the music: changing its chords here changes <b>' + esc(p.name) + '</b> in Chord Charts too.'
      : 'Placed from Chord Charts: it plays <b>' + esc(p.name) + '</b> — change it there and it changes here too, except the chords changed here.') + '</p>';
    html += '<div class="mp-fields">' +
      '<label>From bar <input type="number" class="mp-in" data-field="from" min="' + m.firstBar + '" max="999" value="' + r.from + '"></label>' +
      '<label>to bar <input type="number" class="mp-in" data-field="to" min="' + r.from + '" max="999" value="' + (r.to === 'melody' ? sp.last : r.to) + '"></label>' +
      (p ? '<label>or <input type="number" class="mp-in narrow" data-field="times" min="1" max="99" step="1" value="' + Math.max(1, Math.round(times) || 1) + '"> times through</label>' : '') +
      '<button type="button" class="mp-toggle' + (r.to === 'melody' ? ' on' : '') + '" data-song="to-melody" title="It grows and shrinks with the melody, and stops where the next group starts">to the end of the melody</button>' +
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
    if (r.prog && !r.home) {
      const here = r.here || [];
      html += '<div class="mp-fields mp-here"><span class="mp-flabel">Changed here:</span>' +
        (here.length ? here.map(h => '<span class="mp-herechip">bar ' + h.bar + (h.beat > 1 ? ' beat ' + h.beat : '') + ' · ' + h.chords.map(c => (c.chord ? C.labelHTML(look(c.chord).name) : '—')).join(' ') +
          '<button type="button" data-unhere="' + h.bar + ':' + h.beat + ':' + h.beats + '" title="Back to ' + esc(name) + ' there" aria-label="Back to the progression there">×</button></span>').join('') +
          '<button type="button" class="btn pw-ghost mp-small" data-song="clear-here">Back to ' + esc(name) + ' everywhere</button>'
          : '<span class="mp-none">nothing — it plays ' + esc(name) + ' as it is</span>') +
      '</div>';
    }
    html += '<div class="mp-actions">' +
      (p ? '<button type="button" class="btn" data-song="edit">' + (readOnly() ? 'Look at ' : 'Open ') + esc(p.name) + ' in Chord Charts</button>' : '') +
      '<button type="button" class="btn" data-song="play-band">' + playIcon() + ' Play from bar ' + r.from + '</button>' +
      (readOnly() ? '' : '<button type="button" class="btn pw-ghost" data-tl="duplicate" title="A copy of the group right after it (⌘D)">Duplicate</button>') +
      '<button type="button" class="btn pw-ghost" data-song="remove">Take it out of the song</button>' +
    '</div>';
    return html;
  }

  /* the playhead, while the song plays: where the music is */
  function paintHead() {
    if (!m || tab !== 'song') return;
    const head = body.querySelector('.mp-head');
    if (!head) return;
    const pos = SW.player && SW.player.position ? SW.player.position() : null;
    head.style.display = pos === null ? 'none' : '';
    body.querySelectorAll('.tl-group').forEach(b => {
      const sp = m.spans[Number(b.dataset.stretch)];
      b.classList.toggle('sounding', pos !== null && sp && pos >= sp.a && pos < sp.z);
    });
    body.querySelectorAll('.tl-chord').forEach(c => {
      const e = m.pcs.find(p => p.at === Number(c.dataset.at));
      c.classList.toggle('sounding', pos !== null && !!e && pos >= e.at && pos < e.end);
    });
    if (pos === null) return;
    const hx = m.x(pos);
    head.style.left = hx + 'px';
    const sc = body.querySelector('.mp-scroll');                // keep the playhead in view
    if (sc && (hx < sc.scrollLeft + 20 || hx > sc.scrollLeft + sc.clientWidth - 40)) sc.scrollLeft = Math.max(0, hx - 80);
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

  /* ---- the Time Line's chords: select, copy, paste, take out ---- */
  const clipText = () => (!clip ? '' : clip.kind === 'group' ? clip.name : clip.block.chords.length === 1 ? look(clip.block.chords[0].chord).name : clip.block.chords.length + ' chords');
  function tlCopy() {
    const list = T.shown();
    const si = selIndex(list);
    if (si >= 0) {
      const st = T.tlGroupCopy(si);
      if (!st) return false;
      clip = { kind: 'group', st, name: stretchName(list[si]) };
    } else if (tlSel.length) {
      const block = T.tlBlock(tlSel);
      if (!block) return false;
      clip = { kind: 'chords', block };
    } else return false;
    ui.toast('Copied ' + clipText() + ' — Paste puts it in at the orange point');
    renderSong();
    return true;
  }
  function tlDelete() {
    const si = selIndex(T.shown());
    if (si >= 0) { selFrom = null; T.removeStretch(si); return; }
    if (!tlSel.length) return;
    const ats = tlSel;
    tlSel = [];
    if (!T.tlRemove(ats)) renderSong();
  }
  function tlCut() { if (tlCopy()) tlDelete(); }
  /* Paste: at the point — a group at the bar line nearest it; the point then follows on, so pasting again lays the next copy after */
  function tlPaste(at) {
    if (!clip) return;
    if (clip.kind === 'group') {
      if (clip.st.prog && !T.prog(clip.st.prog)) { ui.toast(clip.name + ' is not in this song any more'); clip = null; renderSong(); return; }
      const b = T.tlGroupTo(-1, at === undefined ? pointBar() : at, clip.st);
      if (b === null) return;
      selFrom = b;
      tlSel = [];
      const g = T.grid();
      tlPoint = g.T(b + (clip.st.to - clip.st.from) + 1);
      return;
    }
    const ats = T.tlPut(clip.block, at === undefined ? tlPoint : at);
    if (!ats.length) return;
    tlSel = ats;
    tlAnchor = ats[0];
    selFrom = null;
    tlPoint = ats[0] + clip.block.len;
  }
  /* Duplicate: a copy right after (a group: after its last bar) — the clipboard kept as it was */
  function tlDuplicate() {
    const keep = clip;
    const list = T.shown();
    const si = selIndex(list);
    if (si >= 0) {
      if (!tlCopy()) return;
      tlPaste(T.lastOf(list[si]) + 1);
    } else if (tlSel.length) {
      const block = T.tlBlock(tlSel);
      if (!block) return;
      clip = { kind: 'chords', block };
      tlPaste(tlSel[0] + block.len);
    }
    clip = keep;
  }
  /* ⌥← ⌥→: the selected chords one place along their row (a reorder) */
  function tlNudge(d) {
    if (!tlSel.length || !m) return;
    const sel = m.pcs.filter(e => tlSel.indexOf(e.at) !== -1);
    const first = sel[0], last = sel[sel.length - 1];
    const nb = d > 0 ? m.pcs.find(e => e.at === last.end && e.stretch === last.stretch) : m.pcs.find(e => e.end === first.at && e.stretch === first.stretch);
    if (!nb) return;
    const ats = T.tlPut(T.tlBlock(tlSel), d > 0 ? nb.end : nb.at, tlSel);
    if (ats.length) { tlSel = ats; tlAnchor = ats[0]; }
  }
  /* ← →: the chord before / after (heard); none selected: the point a beat */
  function tlWalk(d) {
    if (!m) return;
    if (!tlSel.length) {
      tlPoint = Math.max(0, snapBeat(tlPoint) + d * m.g.b);
      selFrom = null;
      renderSong();
      return;
    }
    const ref = d > 0 ? Math.max.apply(null, tlSel) : Math.min.apply(null, tlSel);
    const i = m.pcs.findIndex(e => e.at === ref);
    const n = m.pcs[Math.max(0, Math.min(m.pcs.length - 1, i + d))];
    if (!n) return;
    tlSel = [n.at];
    tlAnchor = n.at;
    tlPoint = d > 0 ? n.end : n.at;
    if (C.isKnown(n.id)) C.play(n.id, 'progression');
    renderSong();
  }
  /* a tap on a chord: select it (⇧ along to it, ⌘ one more), the point to its nearer end; a double tap: Individual Focus */
  function tapChord(at, clientX, shift, meta) {
    const now = Date.now();
    if (!shift && !meta && lastTlTap && lastTlTap.key === 'c' + at && now - lastTlTap.t < 450 && !readOnly()) { lastTlTap = null; focusOn(at); return; }
    lastTlTap = { key: 'c' + at, t: now };
    if (shift && tlAnchor !== null) {
      const a = Math.min(tlAnchor, at), z = Math.max(tlAnchor, at);
      tlSel = m.pcs.filter(e => e.at >= a && e.at <= z).map(e => e.at);
    } else if (meta) {
      tlSel = tlSel.indexOf(at) !== -1 ? tlSel.filter(x => x !== at) : tlSel.concat([at]).sort((a, b) => a - b);
      tlAnchor = at;
    } else { tlSel = [at]; tlAnchor = at; }
    selFrom = null;
    const e = m.pcs.find(p => p.at === at);
    if (e) {
      const tx = tickAtX(clientX);
      tlPoint = tx - e.at < e.end - tx ? e.at : e.end;
      if (C.isKnown(e.id)) C.play(e.id, 'progression');
    }
    renderSong();
  }
  /* Individual Focus on the chord at a tick (none there: that beat) */
  function focusOn(tick) {
    const pc = T.chordAt(tick);
    here = { at: pc ? pc.at : tick };
    setTab('focus');
  }
  /* where chords dragged would go in: a chord under the pointer → its nearer end; empty time → its beat (the grab kept) */
  function dropTick(clientX, clientY, d) {
    const over = document.elementFromPoint(clientX, clientY);
    if (!over || !over.closest('.mp-scroll')) return null;
    const moving = new Set(d.ats);
    const c = over.closest('.tl-chord');
    if (c && !moving.has(Number(c.dataset.at))) {
      const e = m.pcs.find(p => p.at === Number(c.dataset.at));
      const r = c.getBoundingClientRect();
      if (e) return clientX < r.left + r.width / 2 ? e.at : e.end;
    }
    let t = snapBeat(tickAtX(clientX) - d.grab);
    const inside = m.pcs.find(p => !moving.has(p.at) && p.at < t && t < p.end);
    if (inside) t = t - inside.at <= inside.end - t ? inside.at : inside.end;
    return t;
  }

  /* the Time Line's gestures */
  body.addEventListener('pointerdown', e => {
    if (tab !== 'song' || !m || (e.button && e.button !== 0)) return;
    const t = e.target;
    if (t.closest('.note-i, .fold-note, .mp-card, .tl-top')) return;
    const id = e.pointerId;
    const num = t.closest('.mp-num');
    if (num) { e.preventDefault(); td = { kind: 'bars', anchor: Number(num.dataset.bar), moved: false, id }; return; }
    const h = t.closest('.mp-h');
    if (h) {
      e.preventDefault();
      const band = h.closest('.tl-group');
      td = { kind: 'end', i: Number(band.dataset.stretch), band, x0: e.clientX, moved: false, id };
      return;
    }
    const gh = t.closest('.tl-ghead');
    if (gh) {
      e.preventDefault();
      const band = gh.closest('.tl-group');
      td = { kind: 'group', i: Number(band.dataset.stretch), band, x0: e.clientX, bar0: barAtClientX(e.clientX), moved: false, id };
      return;
    }
    const ch = t.closest('.tl-chord');
    if (ch) {
      e.preventDefault();
      const at = Number(ch.dataset.at);
      td = { kind: 'chord', at, x0: e.clientX, y0: e.clientY, grab: tickAtX(e.clientX) - at, moved: false, id, shift: e.shiftKey, meta: e.metaKey || e.ctrlKey };
      return;
    }
    const chip = t.closest('.mp-chip[data-chip]');
    if (chip && !chip.disabled) {
      e.preventDefault();
      td = { kind: 'chip', prog: chip.dataset.chip, x0: e.clientX, y0: e.clientY, moved: false, id, chip };
      return;
    }
    const mel = t.closest('.mp-mel');
    if (mel) { tlPoint = Math.max(0, m.g.T(Number(mel.dataset.bar))); tlSel = []; selFrom = null; renderSong(); return; }
    if (t.closest('.mp-chords')) { e.preventDefault(); td = { kind: 'empty', tick: snapBeat(tickAtX(e.clientX)), id }; }
  });
  window.addEventListener('pointermove', e => {
    if (!td || e.pointerId !== td.id) return;
    const d = td;
    if (d.kind === 'bars') {
      const bar = barAtClientX(e.clientX);
      if (bar === null) return;
      if (bar !== d.anchor) d.moved = true;
      if (!d.moved) return;
      const a = Math.min(d.anchor, bar), b = Math.max(d.anchor, bar);
      d.a = a; d.b = b;
      const sel = body.querySelector('.mp-sel') || (() => { const s = document.createElement('div'); s.className = 'mp-sel'; body.querySelector('.mp-inner').prepend(s); return s; })();
      sel.style.left = m.xb(a) + 'px';
      sel.style.width = (m.xb(b + 1) - m.xb(a)) + 'px';
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
    if (readOnly() || d.kind === 'empty') return;             // listen only: a tap selects, nothing moves
    if (d.kind === 'chord') {
      if (!d.moved && Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < 6) return;
      if (!d.moved) {
        d.moved = true;
        if (tlSel.indexOf(d.at) === -1) { tlSel = [d.at]; tlAnchor = d.at; selFrom = null; }
        d.ats = tlSel.slice().sort((a, b) => a - b);
        body.querySelectorAll('.tl-chord').forEach(c => {
          const on = d.ats.indexOf(Number(c.dataset.at)) !== -1;
          c.classList.toggle('sel', on);
          c.classList.toggle('lifting', on);
        });
        d.ghost = document.createElement('div');
        d.ghost.className = 'tl-ghost';
        d.ghost.innerHTML = m.pcs.filter(p => d.ats.indexOf(p.at) !== -1).map(p => { const l = look(p.id); return '<i style="--c:' + l.color + ';--ck:' + l.ink + '">' + C.labelHTML(l.name) + '</i>'; }).join('');
        document.body.appendChild(d.ghost);
        d.mark = document.createElement('div');
        d.mark.className = 'tl-drop';
        body.querySelector('.mp-chords').appendChild(d.mark);
      }
      d.ghost.style.left = (e.clientX + 10) + 'px';
      d.ghost.style.top = (e.clientY - 18) + 'px';
      d.ghost.classList.toggle('copy', e.altKey);
      d.to = dropTick(e.clientX, e.clientY, d);
      d.mark.style.display = d.to === null ? 'none' : '';
      if (d.to !== null) d.mark.style.left = m.x(d.to) + 'px';
      return;
    }
    // a group: moved by its strip, or stretched by its right grip — a bar at a time
    const bar = barAtClientX(e.clientX);
    if (bar === null) return;
    if (!d.moved && Math.abs(e.clientX - d.x0) < 6) return;
    const r = m.list[d.i], sp = m.spans[d.i];
    if (!r) return;
    if (!d.moved) {
      d.moved = true;
      d.band.classList.add('dragging');
      d.chords = Array.from(body.querySelectorAll('.tl-chord[data-si="' + d.i + '"]'));
    }
    if (d.kind === 'end') {
      d.to = Math.max(bar, r.from);
      d.band.style.width = Math.max(12, m.xb(d.to + 1) - m.x(sp.a) - 2) + 'px';
    } else {
      d.delta = Math.max(m.firstBar - r.from, bar - d.bar0);
      const tx = 'translateX(' + (d.delta * m.BW) + 'px)';
      d.band.style.transform = tx;
      d.chords.forEach(c => { c.style.transform = tx; });
    }
  });
  const endTlDrag = e => {
    if (!td || (e && e.pointerId !== td.id)) return;
    const d = td;
    td = null;
    if (d.ghost) d.ghost.remove();
    if (d.mark) d.mark.remove();
    if (d.kind === 'bars') {
      if (d.moved) {
        const g = m.g;
        tlSel = m.pcs.filter(p => p.at >= g.T(d.a) && p.at < g.T(d.b + 1)).map(p => p.at);
        tlAnchor = tlSel[0] !== undefined ? tlSel[0] : null;
        tlPoint = Math.max(0, g.T(d.a));
      } else { tlPoint = Math.max(0, m.g.T(d.anchor)); tlSel = []; }
      selFrom = null;
      renderSong();
      return;
    }
    if (d.kind === 'empty') {
      const now = Date.now();
      if (lastTlTap && lastTlTap.key === 'e' + d.tick && now - lastTlTap.t < 450 && !readOnly()) { lastTlTap = null; focusOn(d.tick); return; }
      lastTlTap = { key: 'e' + d.tick, t: now };
      tlPoint = d.tick;
      tlSel = [];
      selFrom = null;
      renderSong();
      return;
    }
    if (d.kind === 'chip') {
      body.querySelectorAll('.mp-num.drop').forEach(n => n.classList.remove('drop'));
      if (readOnly()) return;
      const b = !d.moved ? T.tlPlace(d.prog, pointBar()) : (d.bar !== null && d.bar !== undefined ? T.tlPlace(d.prog, d.bar) : null);
      if (b !== null && b !== undefined) { selFrom = b; tlSel = []; schedule(); }
      return;
    }
    if (d.kind === 'chord') {
      if (!d.moved) { tapChord(d.at, d.x0, d.shift, d.meta); return; }
      if (d.to === null || d.to === undefined) { renderSong(); return; }
      const ats = T.tlPut(T.tlBlock(d.ats), d.to, e && e.altKey ? null : d.ats);
      if (ats.length) { tlSel = ats; tlAnchor = ats[0]; }
      selFrom = null;
      renderSong();
      return;
    }
    // a group
    const r = m.list[d.i];
    if (!d.moved) { selFrom = r ? r.from : null; tlSel = []; if (r) tlPoint = Math.max(0, m.g.T(r.from)); renderSong(); return; }
    if (!r) { renderSong(); return; }
    if (d.kind === 'end' && d.to !== undefined && d.to !== (r.to === 'melody' ? m.spans[d.i].last : r.to)) { selFrom = r.from; T.setStretch(d.i, { to: d.to }); }
    else if (d.kind === 'group' && d.delta) {
      const b = T.tlGroupTo(d.i, r.from + d.delta);
      if (b !== null) selFrom = b;
      renderSong();
    } else renderSong();
  };
  window.addEventListener('pointerup', endTlDrag);
  window.addEventListener('pointercancel', e => {
    if (!td || e.pointerId !== td.id) return;
    if (td.ghost) td.ghost.remove();
    if (td.mark) td.mark.remove();
    td = null;
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
    switch (b.dataset.tl) {
      case 'copy': tlCopy(); return;
      case 'cut': tlCut(); return;
      case 'paste': tlPaste(); return;
      case 'delete': tlDelete(); return;
      case 'duplicate': tlDuplicate(); return;
      case 'focus': if (tlSel.length) focusOn(tlSel[0]); return;
      case 'play-sel': if (tlSel.length) { tlPoint = Math.min.apply(null, tlSel); playSongFrom(playBar()); } return;
      case 'unselect': tlSel = []; renderSong(); return;
    }
    switch (b.dataset.song) {
      case 'play':
        if (SW.player.playing) SW.player.stop(); else playSongFrom(playBar());
        break;
      case 'play-band': if (r) { tlPoint = Math.max(0, g.T(r.from)); playSongFrom(Math.max(m.firstBar, r.from)); } break;
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
    const ro = readOnly();
    if ((e.metaKey || e.ctrlKey) && !e.altKey) {
      switch (k.toLowerCase()) {
        case 'c': e.preventDefault(); tlCopy(); return true;
        case 'x': e.preventDefault(); if (!ro) tlCut(); return true;
        case 'v': e.preventDefault(); if (!ro) tlPaste(); return true;
        case 'd': e.preventDefault(); if (!ro) tlDuplicate(); return true;
        case 'a': e.preventDefault(); if (m) { tlSel = m.pcs.map(p => p.at); tlAnchor = tlSel[0] !== undefined ? tlSel[0] : null; selFrom = null; renderSong(); } return true;
      }
      return false;
    }
    switch (k) {
      case ' ':
        e.preventDefault();
        if (!e.repeat) { if (SW.player.playing) SW.player.stop(); else playSongFrom(playBar()); }
        return true;
      case 'Delete': case 'Backspace':
        e.preventDefault();
        if (!ro) tlDelete();
        return true;
      case 'Enter':
        e.preventDefault();
        if (!ro) focusOn(tlSel.length ? tlSel[0] : tlPoint);
        return true;
      case 'ArrowLeft': case 'ArrowRight':
        e.preventDefault();
        if (e.altKey) { if (!ro) tlNudge(k === 'ArrowLeft' ? -1 : 1); } else tlWalk(k === 'ArrowLeft' ? -1 : 1);
        return true;
    }
    return true;                  // the chord and melody keys are quiet on the Time Line
  }


  /* ==================================================================
     INDIVIDUAL FOCUS (2026-10-28 a tab of the Chords window; was THE
     CHORD ON THE MUSIC, 2026-10-27, and Just here, phase 4) — opened by a
     double-click (a double tap) on a chord over the music or on the Time
     Line, Enter with the cursor on one, or on empty time; its tab shows
     the chord at the music's cursor (or the first). One chord, all of it:
       • which chord — the board (its keys; Z X C V B held), More chords…,
         No chord (it goes, and the time is silent);
       • how long — − + a beat at a time (on the music: drag its end);
       • its rhythm — the rhythm box, always open: Held · Pre-built ·
         Build your own (the circles). It plays its progression's until one
         is chosen here, then its own (Back to …'s; Every chord of …).
     Where a change goes is track.js's rule (THE CHORDS ON THE MUSIC):
     chords made on the music are their progression — a change here
     changes it; a progression placed from the window changes just here
     (Back to Verse undoes that; Change it in Verse too writes a one-chord
     change into it). ‹ › (← →) go to the chord before / after. Every
     change is heard, drawn at once, and one Undo step.
     ================================================================== */
  const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));

  function openHere(tick) {
    if (!SW.settings.can('chords')) return;
    const pc = T.chordAt(tick);
    here = { at: pc ? pc.at : tick };
    stopHear();
    if (SW.player && SW.player.playing) SW.player.stop();
    if (!isOpen()) { prepare(); ui.openSheet('prog-sheet'); }
    tab = 'focus';
    fresh = null;
    render();
  }
  /* the chord Individual Focus shows when nothing chose one: the music's cursor, the Time Line's, the first */
  function focusDefault() {
    const cs = S.chordSel && typeof S.chordSel.at === 'number' ? S.chordSel.at : null;
    if (cs !== null) { const pc = T.chordAt(cs); return pc ? pc.at : cs; }
    if (tlSel.length) return tlSel[0];
    const first = T.events().find(e => e.id);
    return first ? first.at : Math.max(0, T.grid().T(1));
  }
  /* the chord there now (Undo, a drag on the music: it may have gone) */
  function hereNow() {
    const g = T.grid();
    const ev = T.events(g).find(e => e.id && e.at === here.at) || null;
    const r = ev ? T.shown(g)[ev.stretch] : null;
    const p = r && r.prog ? T.prog(r.prog) : null;
    return { g, ev, r, p };
  }
  function hereWhere(g) {
    const bar = g.barAt(here.at);
    const beat = Math.round((1 + (here.at - g.T(bar)) / g.b) * 100) / 100;
    return (bar ? 'Bar ' + bar : 'The pick-up') + (beat !== 1 ? ', beat ' + beat : '');
  }
  /* the rhythm box's scope for the chord in focus */
  function hereScope(g, ev, p) {
    const n = (ev.end - ev.at) / CELL;
    const held = ev.rhythm ? ev.rhythm === T.HELD : (!p || p.rhythm === T.HELD);
    const bar = g.barAt(ev.at);
    const at = ev.at;
    return {
      key: 'here:' + at, kind: 'chord', held,
      cells: held ? SW.rhythmBox.heldCells(n) : (ev.rhythm || playedCells(ev, n)),
      lead: Math.round((ev.at - g.T(bar)) / CELL), colour: look(ev.id).color, readOnly: false,
      follows: p ? p.name : null, own: !!ev.rhythm,
      toAll: p ? v => T.rhythmToAll(at, p.id, v === T.HELD ? T.HELD : T.rhythmOf(v)) : null,
      barNo: k => bar + k,
      write: v => T.setChord(at, { rhythm: v }),
      redraw: render
    };
  }

  function renderFocus() {
    if (!here) here = { at: focusDefault() };
    const { g, ev, r, p } = hereNow();
    const l = ev ? look(ev.id) : null;
    // whose chord it is, and so where a change goes
    let note;
    if (!ev) note = 'No chord here yet: pick one and it goes on this beat — it lasts to the next chord, or the bar line.';
    else if (r && r.home && p) {
      const elsewhere = T.stretches().some(x => x.prog === p.id && !x.home);
      note = 'Part of <b>' + esc(p.name) + '</b>, made here on the music: a change here changes ' + esc(p.name) + (elsewhere ? ' — everywhere it is placed' : '') + '. It is in <b>Chord Charts</b> to use again.';
    } else if (p) {
      const bare = JSON.parse(JSON.stringify(r));
      delete bare.here;
      const under = T.expand(T.progressions(), [bare], g).filter(e => e.end > ev.at && e.at < ev.end);
      const names = under.map(e => (e.id ? C.labelHTML(look(e.id).name) : '—')).join(' ');
      note = ev.here
        ? 'Changed just here — ' + esc(p.name) + ' itself plays <b>' + names + '</b> here.'
        : esc(p.name) + ' plays it here (' + ordinal((under.length ? under[0].pass || 0 : 0) + 1) + ' time through). A change here is just here — ' + esc(p.name) + ' stays as it is.';
    } else note = 'A chord that belongs to no progression.';
    const many = T.events(g).filter(e => e.id).length;
    let html = '<div class="hw-head">' +
      '<button type="button" class="pw-hbtn hw-walk" data-hwalk="-1" title="The chord before (←)" aria-label="The chord before"' + (many ? '' : ' disabled') + '><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>' +
      '<h3 class="hw-title">' + esc(hereWhere(g)) + ' — ' + (ev ? C.labelHTML(l.name) : 'no chord yet') + '</h3>' +
      '<button type="button" class="pw-hbtn hw-walk" data-hwalk="1" title="The chord after (→)" aria-label="The chord after"' + (many ? '' : ' disabled') + '><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>' +
    '</div>';
    html += ui.note('here.what', note, { block: true });
    if (ev) {
      const beats = Math.round((ev.end - ev.at) / g.b * 100) / 100;
      const tones = l.tones.map(t => '<i style="--c:' + t.color + ';color:' + SW.chordStrip.inkOn(t.color) + '">' + esc(C.toneText(t)) + '</i>').join('');
      html += '<div class="hw-split"><div class="hw-cards">' +
        '<div class="pw-card hw-card on' + (l.inScale ? '' : ' out') + '" style="--c:' + l.color + ';--cink:' + l.ink + '">' +
          '<div class="pw-card-top">' + C.labelHTML(l.name) + '</div>' +
          '<div class="pw-card-tones">' + tones + '</div>' +
          '<div class="pw-card-len own">' +
            '<button type="button" data-hlen="-1" aria-label="A beat shorter"' + (beats <= 1 ? ' disabled' : '') + '>−</button>' +
            '<span>' + beats + (beats === 1 ? ' beat' : ' beats') + '</span>' +
            '<button type="button" data-hlen="1" aria-label="A beat longer">+</button>' +
          '</div></div></div>' +
        '<p class="hw-len">' + esc(barText(beats) || '') + '</p></div>';
    }
    html += '<div class="pw-duo rhythm-first">' +
      '<div class="pw-rhythm">' + (ev
        ? '<div class="pw-rhead"><p class="pw-kicker">Rhythm <span class="pw-sub">— ' + C.labelHTML(l.name) + '</span></p></div>' + SW.rhythmBox.html(hereScope(g, ev, p))
        : '<div class="pw-rhead"><p class="pw-kicker">Rhythm</p></div><p class="pw-none">Pick a chord first — then how it plays.</p>') + '</div>' +
      pickHtml('<button type="button" class="btn pw-small-btn" data-hw="more">More chords…</button>' + (ev ? '<button type="button" class="btn pw-small-btn" data-hw="none">No chord</button>' : ''),
        ui.note('here.pick', 'Tap a chord (or press its key — hold <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd> <kbd>V</kbd> <kbd>B</kbd> to change it). <b>No chord</b> takes it out.')) +
    '</div>';
    body.innerHTML = html;
    SW.rhythmBox.layout(body);
    const h = ev && p && r && !r.home ? T.hereAt(here.at) : null;
    const one = !!(h && !h.empty && h.entry !== undefined && h.chords.length === 1);
    foot.innerHTML =
      (p && r && !r.home ? '<button type="button" class="btn" data-hw="back"' + (ev && ev.here ? '' : ' disabled') + ' title="What ' + esc(p.name) + ' plays here, back again">Back to ' + esc(p.name) + '</button>' +
        '<button type="button" class="btn pw-ghost" data-hw="writeback"' + (one ? '' : ' disabled') + ' title="' + (one ? 'Make this part of ' + esc(p.name) + ' — every time through' : 'Only a change of one whole chord can go into the progression') + '">Change it in ' + esc(p.name) + ' too</button>' : '') +
      (ev ? '<button type="button" class="btn pw-ghost" data-hw="remove" title="Take it out (Delete): the time is silent">Take it out</button>' : '') +
      '<span class="pw-gap"></span><button type="button" class="btn btn-primary" data-hw="done">Done</button>';
    SW.chordStrip.fitLabels(body.querySelector('.pw-board'));
  }
  function herePick(place) {
    const e = C.entry(place);
    if (!e || !here || C.offered().indexOf(place) === -1) return;
    const id = C.toId(C.withHeld(e.spec));
    C.play(id, 'progression');
    hereSet(id, C.heldMods.size ? null : place);
  }
  /* the chord there becomes `id` (made there, on an empty beat) */
  function hereSet(id, place) {
    if (hereNow().ev) T.setChord(here.at, { chord: id, place: place || null });
    else T.putChord(here.at, place ? { chord: id, place } : { chord: id });
    if (SW.ctrack) SW.ctrack.select({ at: here.at });
    render();
  }
  function hereLength(d) {
    const { g, ev } = hereNow();
    if (!ev) return;
    const least = Math.min(g.b, ev.end - ev.at);
    const end = Math.max(ev.at + least, ev.end + d * g.b);
    if (end !== ev.end) T.resizeChord(ev.at, ev.at, end);
  }
  /* ← →: the chord before / after (the music's cursor goes with it) */
  function hereWalk(d) {
    const evs = T.events().filter(x => x.id);
    if (!evs.length) return;
    let i = evs.findIndex(x => x.at === here.at);
    if (i < 0) i = d > 0 ? evs.findIndex(x => x.at > here.at) - 1 : evs.filter(x => x.at < here.at).length;
    const n = evs[Math.max(0, Math.min(evs.length - 1, i + d))];
    if (!n) return;
    here.at = n.at;
    if (n.id && C.isKnown(n.id)) C.play(n.id, 'progression');
    if (SW.ctrack) SW.ctrack.select({ at: n.at });
    render();
  }

  body.addEventListener('pointerdown', e => {
    if (tab !== 'focus' || !here) return;
    const modTab = e.target.closest('.pw-board .cmod');
    if (modTab) { holdTab(modTab, e); return; }
    const block = e.target.closest('.pw-board .cblock');
    if (block) { e.preventDefault(); herePick(block.dataset.place); }
  });
  body.addEventListener('click', e => {
    if (tab !== 'focus' || !here) return;
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.hwalk) { hereWalk(Number(b.dataset.hwalk)); return; }
    if (b.dataset.hlen) { hereLength(Number(b.dataset.hlen)); return; }
    if (b.dataset.hw === 'more') {
      const { g, ev } = hereNow();
      openChordEditor({
        title: 'More chords — ' + hereWhere(g),
        spec: (ev && C.parse(ev.id)) || { root: '1', q: 'maj', mods: [] },
        onChange: sp => { if (here) hereSet(C.toId(sp), null); }
      });
      return;
    }
    if (b.dataset.hw === 'none') { T.removeChord(here.at); render(); return; }
    const { g, ev, p } = hereNow();
    if (ev) SW.rhythmBox.click(b, hereScope(g, ev, p));
  });
  foot.addEventListener('click', e => {
    if (tab !== 'focus') return;
    const b = e.target.closest('button[data-hw]');
    if (!b || !here) return;
    const { g, ev, p } = hereNow();
    if (b.dataset.hw === 'done') { close(); return; }
    if (b.dataset.hw === 'remove') { T.removeChord(here.at); render(); return; }
    if (b.dataset.hw === 'back' && ev) {
      const bar = g.barAt(ev.at);
      T.setHereSpan(ev.stretch, bar, 1 + (ev.at - g.T(bar)) / g.b, (ev.end - ev.at) / g.b, null);
      const back = T.chordAt(here.at);
      if (back) here.at = back.at;
      render();
      return;
    }
    if (b.dataset.hw === 'writeback') {
      const name = p ? p.name : 'the progression';
      if (T.writeBack(here.at)) { ui.toast('Now ' + name + ' plays it every time through'); render(); }
      else ui.toast('Only a change of one whole chord of ' + name + ' can go into it');
    }
  });
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
        hereWalk(k === 'ArrowLeft' ? -1 : 1);
        return true;
      case 'Delete': case 'Backspace':
        e.preventDefault();
        T.removeChord(here.at);
        render();
        return true;
      case 'Enter': e.preventDefault(); close(); return true;
    }
    return true;
  }


  /* ================= KEYS (app.js hands them over while the window is on top) ================= */
  function keyDown(e) {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return false;
    const k = e.key || '';
    if ((e.metaKey || e.ctrlKey) && !e.altKey && /^[zy]$/i.test(k) && SW.history) {
      e.preventDefault();
      if (k.toLowerCase() === 'y' || e.shiftKey) SW.history.redo(); else SW.history.undo();
      return true;
    }
    if (tab === 'focus' && here) return hereKeyDown(e);
    if (tab === 'song') return songKeyDown(e);
    if (e.metaKey || e.ctrlKey) return false;
    if (readOnly() && k !== ' ' && !((k === 'ArrowLeft' || k === 'ArrowRight') && !e.altKey)) return true;   // listen only: Space and the arrows
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
    '[data-song="play"], [data-song="play-band"], [data-song="edit"], [data-tl="copy"], [data-tl="play-sel"], [data-tl="unselect"]';
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

  /* ================= OPEN / CLOSE =================
     The Chord Progression button opens it on Chord Charts (or the Time
     Line, if that was last); a double-click on a chord — openHere — on
     Individual Focus. */
  function prepare(progId) {
    const list = T.progressions();
    selProg = (progId && T.prog(progId)) ? progId : (T.prog(selProg) ? selProg : (list[0] ? list[0].id : null));
    sel = null;
    fresh = null;
    confirmDelete = false;
    showStarters = false;
    drawn = null;
  }
  function open(progId, which) {
    if (!SW.settings.can('chords') && !SW.settings.can('chordsListen')) return;
    prepare(progId);
    if (which === 'song' || which === 'build' || which === 'focus') tab = which;
    else if (tab === 'focus') tab = 'build';
    if (tab === 'focus' && !here) here = { at: focusDefault() };
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
    if (td && td.ghost) td.ghost.remove();
    if (td && td.mark) td.mark.remove();
    td = null;
    here = null;
    C.clearMods();
    confirmDelete = false;
  });
  // the song changed (a step, Undo, another song): draw it again, and Hear it plays what is there now
  SW.bus.on('score:changed', () => { if (isOpen()) { schedule(); rehear(); } });
  // another song: a group copied is this song's progression (its id means another one there) — chords copied paste anywhere.
  // Undo loads the song again too (score:loaded, then score:changed 'history' at once): that keeps it
  let clipTimer = 0;
  SW.bus.on('score:loaded', () => { clearTimeout(clipTimer); if (clip && clip.kind === 'group') clipTimer = setTimeout(() => { clip = null; }, 0); });
  SW.bus.on('score:changed', d => { if (d && d.reason === 'history') clearTimeout(clipTimer); });
  SW.bus.on('score:loaded', () => { if (isOpen()) { if (selProg && !T.prog(selProg)) selProg = null; schedule(); rehear(); } });
  ['chords:changed', 'names:changed', 'meter:changed', 'key:changed', 'layout:changed'].forEach(evt => SW.bus.on(evt, () => { if (isOpen()) { schedule(); rehear(); } }));
  SW.bus.on('history:changed', () => { if (isOpen()) syncUndo(); });
  // a held tab or key: the board's blocks relabel in place (a re-render would drop the pointer holding the tab)
  SW.bus.on('mods:changed', () => {
    relabelBoard(isOpen() ? body.querySelector('.pw-board') : null);
  });
  function relabelBoard(board) {
    if (!board) return;
    const latch = board.classList.contains('latch');     // Chord Charts: the blocks wear the changes switched on
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

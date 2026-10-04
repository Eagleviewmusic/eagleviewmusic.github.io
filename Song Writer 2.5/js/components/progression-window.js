/* ==========================================================================
   COMPONENT — the Chord Progression window: Build              #prog-sheet
   --------------------------------------------------------------------------
   Phase 2 of ../Song Writer Chord Progressions/ (DESIGN.md §4). Opened by
   the Chord Progression button at the foot of the chord panel.

     THIS SONG       Verse ______   ▶ Hear it  ◌ beat     Each chord − 4 beats +
     [Verse  ▶]      CHORDS   [ I ][ IV ][ V ][ vi ][ + ]
     [Chorus ▶]      PICK A CHORD   the panel's board, Z X C V B
     + New           RHYTHM — every bar plays   ( ● ○ )( ● ○ )( ● ● )( ● ○ )
     Starters ▾                                    ta     ta    ti-ti   ta
     ─────────────────────────────────────────────────────────────────────
     Duplicate  Delete                       Put it in the song ▸   Done

   • THE LIST — the song's progressions; + New; Starters. Tap one to open
     it. A song with none shows an empty progression: the first chord
     picked makes it (nothing is saved by just looking).
   • CHORDS — cards; the selected one (or the dashed +) is where the next
     chord goes: + adds at the end, a card is replaced. A card: its name
     and notes, its length (− + on the selected one: its own length, or
     back to "Each chord"), what it plays as dots. × or Delete removes
     it; drag it, or ⌥← ⌥→, to move it; ← → walk the cards.
   • PICK A CHORD — the panel's board (the same blocks, the same set), its
     keys F D S A G R E Q W 1–5, Z X C V B held (or a tab) to change it.
     More chords… opens the chord editor on the selected chord.
   • RHYTHM — one rhythm every bar plays (or two bars), drawn as the beat
     strip draws a bar: pills of dots (a tap: strike → rings on → silence),
     ⛓ between beats, + − sixteenths, or Easy circles; the rhythm in notes
     above, Rhythm Poetry's Simplified Kodály words below; presets. A
     selected chord can have its own rhythm (as long as the chord).
   • ▶ HEAR IT — the progression round and round on the audio clock (its
     own little scheduler, the track's strikes); a change while it plays
     takes effect at once, with no gap and no strike played twice.
   • Every change is a step in the song's history (↶ ↷ in the head, ⌘Z).
   • Put it in the song — the first bar with no chords, to the end of the
     melody (or once through past it); the window turns to In the song
     with it selected.
   • IN THE SONG (phase 3) — the map: below, before the keys.

   • JUST HERE (phase 4) — the window for one chord of the song: below,
     after In the song.

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
  let sel = 'plus';          // the selected card: 'plus' or an index
  let mode = 'dots';         // the rhythm: 'dots' | 'easy'
  const fine = new Set();    // beats shown in sixteenths: scopeKey + ':' + beat
  let showStarters = false;
  let confirmDelete = false;
  let beatOn = false;        // Hear it: the steady beat
  let renderTimer = 0;
  let tab = 'build';         // 'build' | 'song' (In the song)
  let selFrom = null;        // In the song: the stretch selected, by the bar it starts on
  let selBars = null;        // In the song: bars selected along the numbers, { a, b }
  let playhead = 1;          // In the song: where ▶ Play the song starts

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
          html += spell(L).map(id => glyph(id)).join('');
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
    if (selProg && !cur()) { selProg = null; sel = 'plus'; }
    const p = cur();
    if (p && typeof sel === 'number' && sel >= p.chords.length) sel = 'plus';
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
      html += '<div class="pw-pcard' + (p.id === selProg ? ' on' : '') + '" data-prog="' + p.id + '" role="button" tabindex="-1" style="--bd:' + bandOf(p.id).bd + '">' +
        '<div class="pw-pcard-head"><span class="pw-pname">' + esc(p.name) + '</span>' +
        '<button type="button" class="pw-pplay" data-once="' + p.id + '" title="Hear ' + esc(p.name) + ' once round" aria-label="Hear it once round">' + playIcon() + '</button></div>' +
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

  function mainHtml(p) {
    const name = p ? p.name : 'Progression ' + (T.progressions().length + 1);
    const each = p ? (p.beats || barBeats()) : barBeats();
    const hearingThis = hear.on && !hear.once && p && hear.id === p.id;
    let html = '<div class="pw-top">' +
      '<input class="pw-name text-field" type="text" maxlength="24" value="' + esc(name) + '" aria-label="The progression’s name"' + (p ? '' : ' placeholder="' + esc(name) + '"') + (readOnly() ? ' readonly tabindex="-1"' : '') + '>' +
      '<button type="button" class="pw-hear' + (hearingThis ? ' on' : '') + '"' + (p && p.chords.length ? '' : ' disabled') + ' title="Hear it round and round (Space)">' + (hearingThis ? '<span class="sq"></span> Stop' : playIcon() + ' Hear it') + '</button>' +
      '<label class="pw-beat"><input type="checkbox" class="pw-beat-box"' + (beatOn ? ' checked' : '') + '> beat</label>' +
      '<div class="pw-each"><span class="pw-each-label">Each chord</span>' +
        '<span class="pw-stepper"><button type="button" data-each="-1" aria-label="Shorter"' + (each <= 1 ? ' disabled' : '') + '>−</button><b>' + each + (each === 1 ? ' beat' : ' beats') + '</b><button type="button" data-each="1" aria-label="Longer"' + (each >= 16 ? ' disabled' : '') + '>+</button></span>' +
        '<small>' + esc(barText(each)) + '</small></div>' +
    '</div>';

    // the chords
    html += '<div class="pw-section"><p class="pw-kicker">Chords ' + ui.note('pw.cards', 'The selected card is where the next chord goes: with <b>+</b> selected a chord is added at the end; with a chord selected it is replaced.') + '</p><div class="pw-cards">';
    const passes = p ? firstPass(p) : [];
    (p ? p.chords : []).forEach((st, i) => { html += cardHtml(p, st, i, passes); });
    html += '<div class="pw-card plus' + (sel === 'plus' ? ' on' : '') + '" data-card="plus" role="button" title="Add a chord at the end"><span class="pw-plus">+</span><small>add a chord</small></div>';
    html += '</div></div>';

    // pick a chord
    html += '<div class="pw-section pw-pick"><div class="pw-board-wrap"><p class="pw-kicker">Pick a chord</p>' + boardHtml() + '</div>' +
      '<div class="pw-pick-side"><p class="pw-kicker">&nbsp;</p>' +
      ui.note('pw.pick', 'Tap a chord, or press its key — <kbd>F</kbd> <kbd>D</kbd> <kbd>S</kbd> <kbd>A</kbd> … <kbd>1</kbd>–<kbd>5</kbd>. Hold <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd> <kbd>V</kbd> <kbd>B</kbd> (or a tab) to change it: <kbd>V</kbd> + <kbd>D</kbd> is V7. More chords… for any chord at all.') +
      '<div class="pw-more"><button type="button" class="btn pw-more-btn">More chords…</button></div></div></div>';

    // the rhythm
    html += '<div class="pw-section pw-rhythm">' + rhythmHtml(p) + '</div>';
    return html;
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
    return '<div class="pw-card' + (on ? ' on' : '') + (l.inScale ? '' : ' out') + (l.known ? '' : ' unknown') + '" data-card="' + i + '" style="--c:' + l.color + ';--cink:' + l.ink + '" role="button" title="' + esc(l.known ? l.d.roman + ' — ' + l.d.letter + ' · ' + l.tones.map(t => t.name).join(' ') : 'A chord the app cannot read') + '">' +
      '<div class="pw-card-top">' + C.labelHTML(l.name) + '</div>' +
      (on ? '<button type="button" class="pw-card-x" data-x="' + i + '" title="Take it out (Delete)" aria-label="Take this chord out">×</button>' : '') +
      '<div class="pw-card-tones">' + tones + '</div>' +
      '<div class="pw-card-len' + (st.beats ? ' own' : '') + '">' +
        (on ? '<button type="button" data-len="-1" aria-label="Shorter"' + (beats <= 1 ? ' disabled' : '') + '>−</button>' : '') +
        '<span>' + beats + (beats === 1 ? ' beat' : ' beats') + '</span>' +
        (on ? '<button type="button" data-len="1" aria-label="Longer"' + (beats >= 16 ? ' disabled' : '') + '>+</button>' : '') +
      '</div>' + dots +
      (st.rhythm ? '<span class="pw-own-tag">own rhythm</span>' : '') +
    '</div>';
  }

  function boardHtml() {
    const offered = C.offered();
    let rows = '';
    C.SHAPE.forEach(row => {
      const cells = row.filter(cell => offered.indexOf(cell.place) !== -1).map(cell => SW.chordStrip.blockHtml(C.entry(cell.place), cell.w, { noEdit: true })).join('');
      if (cells) rows += '<div class="crow">' + cells + '</div>';
    });
    return '<div class="pw-board">' +
      '<div class="strip-tower">' + (rows || '<p class="strip-empty">No chords in this set are switched on in Layout settings</p>') + '</div>' +
      '<div class="strip-mods" role="group" aria-label="Chord buttons Z X C V B">' + C.SLOT_KEYS.map(SW.chordStrip.modTabHtml).join('') + '</div>' +
    '</div>';
  }

  function rhythmHtml(p) {
    const sc = scope();
    const card = p && typeof sel === 'number' ? p.chords[sel] : null;
    let html = '<div class="pw-rhead">';
    if (sc.kind === 'own') {
      html += '<p class="pw-kicker">Rhythm <span class="pw-sub">— ' + C.labelHTML(look(sc.st.chord).name) + ' plays its own</span></p>' +
        '<span class="pw-gap"></span>' +
        '<div class="seg"><button type="button" class="seg-btn" data-own="off">The bar’s rhythm</button><button type="button" class="seg-btn active">Its own</button></div>';
    } else {
      html += '<p class="pw-kicker">Rhythm <span class="pw-sub">— every bar plays</span></p>' +
        '<label class="pw-twobars"><input type="checkbox" class="pw-two-box"' + (sc.bars === 2 ? ' checked' : '') + '> 2 bars</label>' +
        '<span class="pw-gap"></span>';
    }
    html += '<div class="seg pw-mode"><button type="button" class="seg-btn' + (mode === 'dots' ? ' active' : '') + '" data-mode="dots">Dots</button><button type="button" class="seg-btn' + (mode === 'easy' ? ' active' : '') + '" data-mode="easy">Easy</button></div></div>';
    html += stripHtml(sc);
    html += '<div class="pw-presets">' + presets(sc).map(pr => '<button type="button" class="pw-preset' + (pr.cells === sc.cells ? ' on' : '') + '" data-preset="' + pr.cells + '">' + esc(pr.label) + '</button>').join('') + '</div>';
    if (sc.kind === 'own') {
      html += '<p class="pw-rnote">' + ui.note('pw.own', 'Only this chord plays this rhythm; the others keep the bar’s. Tap a dot: a strike starts there, rings on, or goes silent.') + '</p>';
    } else if (card) {
      html += '<p class="pw-ownline">' + C.labelHTML(look(card.chord).name) + ' plays: <span class="seg"><button type="button" class="seg-btn active">The bar’s rhythm</button><button type="button" class="seg-btn" data-own="on">Its own</button></span></p>';
    } else {
      html += '<p class="pw-rnote">' + ui.note('pw.rhythm', 'Tap a dot: a strike starts there, rings on, or goes silent. Each strike plays the chord in force at that moment, and a chord always sounds where it starts. Select a chord above to give it a rhythm of its own.') + '</p>';
    }
    return html;
  }

  /* the pills: the beat strip's look, on a string of cells */
  function stripHtml(sc) {
    const pb = perBeat();
    const cells = sc.cells;
    const beats = Math.round(sc.beats);
    const easy = mode === 'easy' && SW.beats && SW.beats.easy;
    let html = '<div class="pw-strip">';
    let skip = { until: 0 };
    for (let b = 0; b < beats; b++) {
      const c0 = b * pb;
      const sixteen = fine.has(sc.key + ':' + b) || needs16(cells, c0);
      const d = sixteen ? pb : pb / 2, span = pb / d;
      if (b > 0) {
        if (sc.kind === 'bar' && b % barBeats() === 0) html += '<span class="pw-barline" aria-hidden="true"></span>';
        const joined = cells[c0] === 'O';
        const can = joined || (cells[c0 - 1] !== 'R' && cells[c0] === 'X');
        html += '<button type="button" class="bb-chain' + (joined ? ' on' : '') + '" data-join="' + b + '"' + (can ? '' : ' disabled') + ' title="' + (joined ? 'Joined — the strike rings on over the beat line; tap to strike again here' : 'Join to the beat before — the strike rings on over the beat line') + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg></button>';
      }
      const notes = beatNotes(cells, b, skip);
      skip = notes.skip;
      html += '<div class="bb-beat pw-beatcol" style="--c:' + sc.colour + '">' +
        '<div class="pw-notes">' + notes.html + '</div>';
      if (easy) html += easyPill(sc, b);
      else {
        html += '<div class="bb-pill d' + d + '">';
        for (let i = 0; i < d; i++) {
          const c = c0 + i * span;
          const ch = cells[c];
          const cls = ch === 'X' ? 'on' : ch === 'O' ? 'hold' : 'rest';
          const title = ch === 'X' ? 'A strike — tap: it rings on from before' : ch === 'O' ? 'Ringing on — tap: silence' : 'Silence — tap: a strike';
          html += '<button type="button" class="bb-dot ' + cls + '" data-cell="' + c + '" data-span="' + span + '" style="--c:' + sc.colour + '" title="' + title + '"></button>';
        }
        html += '</div>';
      }
      html += '<div class="pw-say">' + esc(sayBeat(cells, c0)) + '</div>';
      if (!easy) {
        html += '<div class="bb-pm">' +
          '<button type="button" class="bb-fine" data-coarse="' + b + '"' + (sixteen ? '' : ' disabled') + ' title="Eighths — sixteenths move onto the eighth before them" aria-label="Eighths">−</button>' +
          '<button type="button" class="bb-fine" data-fine="' + b + '"' + (sixteen ? ' disabled' : '') + ' title="Sixteenths in this beat" aria-label="Sixteenths">+</button></div>';
      }
      html += '</div>';
    }
    return html + '</div>';
  }
  function easyFits(ch, b, sc) {
    if (sc.kind === 'bar') {
      const B = barBeats(), at = b % B;
      if (at + ch.beats > B) return false;
      return B % ch.beats === 0 ? at % ch.beats === 0 : true;
    }
    const L = Math.round(sc.beats);
    if (b + ch.beats > L) return false;
    return L % ch.beats === 0 ? b % ch.beats === 0 : true;
  }
  function easyLit(cells, c0, ch) {
    const n = ch.pattern.length;
    const s = cells.slice(c0, c0 + n);
    if (s === ch.pattern && cells[c0 + n] !== 'O') return 'note';
    if (ch.beats === 1 && s === 'R'.repeat(n)) return 'rest';
    return null;
  }
  function easyPill(sc, b) {
    const c0 = b * perBeat();
    let html = '<div class="bb-pill easy">';
    SW.beats.easy().forEach(ch => {
      if (!easyFits(ch, b, sc)) return;
      const lit = easyLit(sc.cells, c0, ch);
      const glyphs = ch.four ? '<span class="bb-four">' + SW.engrave.value('s', { height: 16 }) + '×4</span>'
        : '<span class="bb-glyphs">' + ch.glyph.map((id, i) => SW.engrave.value(id, { height: 18, rest: lit === 'rest' || (ch.restFirst && i === 0) })).join('') + '</span>';
      html += '<button type="button" class="bb-easy' + (lit ? ' on' : '') + (lit === 'rest' ? ' is-rest' : '') + '" data-easy="' + ch.id + '" data-beat="' + b + '" style="--c:' + SW.values.colour(ch.colour) + '" title="' + ch.name + (lit === 'note' ? ' — tap again for silence as long' : '') + '">' + glyphs + '</button>';
    });
    return html + '</div>';
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
      '<button type="button" class="btn" data-act="put"' + (p && p.chords.length ? '' : ' disabled') + ' title="Put this progression in the song, from the first bar with no chords"><span class="pw-long">Put it in the song ▸</span><span class="pw-short">Put in song ▸</span></button>' +
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
    return selProg;
  }

  /* a chord picked (the board, its key): added at the end, or the selected card replaced */
  function pick(place) {
    const e = C.entry(place);
    if (!e) return;
    if (C.offered().indexOf(place) === -1) {
      ui.toast(C.placeShown(place) ? 'That chord is switched off in Layout settings' : 'That chord is outside the ' + C.CHORD_SETS[C.setIndex()].name + ' set — the set button on the panel shows more');
      return;
    }
    const id = C.toId(C.withHeld(e.spec));
    C.play(id, 'progression');
    flash(place);
    const step = { chord: id };
    if (!C.heldMods.size) step.place = place;            // the panel's own chord: it follows the scale (D16)
    putChord(step);
  }
  function putChord(step) {
    const p = cur();
    if (!p) { ensureProg(step); sel = 'plus'; return; }
    if (sel === 'plus') T.insertStep(p.id, p.chords.length, step);
    else T.setStep(p.id, sel, { chord: step.chord, place: step.place || null });
  }
  let flashTimer = 0;
  function flash(place) {
    body.querySelectorAll('.pw-board .cblock').forEach(b => b.classList.toggle('is-on', b.dataset.place === place));
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => body.querySelectorAll('.pw-board .cblock.is-on').forEach(b => b.classList.remove('is-on')), 240);
  }
  function selectCard(i) {
    sel = i;
    const p = cur();
    if (p && typeof i === 'number' && p.chords[i]) {
      const id = p.chords[i].chord;
      if (id && C.isKnown(id)) C.play(id, 'progression');
    }
    render();
  }
  function stepSel(d) {
    const p = cur();
    const n = p ? p.chords.length : 0;
    let i = sel === 'plus' ? n : sel;
    i = Math.max(0, Math.min(n, i + d));
    selectCard(i === n ? 'plus' : i);
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
    sel = left && i < left.chords.length ? i : 'plus';
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
  function giveOwnRhythm(on) {
    const p = cur();
    if (!p || typeof sel !== 'number') return;
    const st = p.chords[sel];
    if (!on) { T.setStep(p.id, sel, { rhythm: null }); return; }
    // a copy of what it was playing
    const ev = firstPass(p).find(e => e.step === sel);
    const n = toTicks(stepBeats(p, st)) / CELL;
    const a = 'R'.repeat(n).split('');
    if (ev) ev.strikes.forEach(s => {
      const k0 = (s.at - ev.at) / CELL;
      for (let k = 0; k < s.len / CELL; k++) if (k0 + k < n) a[k0 + k] = k ? 'O' : 'X';
    });
    T.setStep(p.id, sel, { rhythm: T.rhythmOf(sanitize(a.join(''))) });
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
  function writeEasy(id, b, sc) {
    sc = sc || scope();
    const ch = SW.beats.easy().find(x => x.id === id);
    if (!ch) return;
    const c0 = b * perBeat(), n = ch.pattern.length;
    const lit = easyLit(sc.cells, c0, ch);
    const put = lit === 'note' ? 'R'.repeat(n) : ch.pattern;
    writeScope(sc, sc.cells.slice(0, c0) + put + sc.cells.slice(c0 + n));
  }
  /* a tap on the rhythm (the strip, Easy, presets, Dots · Easy), whichever rhythm `sc` is */
  function rhythmClick(b, sc, redraw) {
    if (b.dataset.mode) { mode = b.dataset.mode; redraw(); return true; }
    if (b.dataset.preset) { writeScope(sc, b.dataset.preset); return true; }
    if (b.dataset.join !== undefined) { toggleJoin(Number(b.dataset.join), sc); return true; }
    if (b.dataset.fine !== undefined) { fine.add(sc.key + ':' + b.dataset.fine); redraw(); return true; }
    if (b.dataset.coarse !== undefined) { coarsen(Number(b.dataset.coarse), sc, redraw); return true; }
    if (b.dataset.easy) { writeEasy(b.dataset.easy, Number(b.dataset.beat), sc); return true; }
    if (b.dataset.cell !== undefined) { tapDot(Number(b.dataset.cell), Number(b.dataset.span) || 1, sc); return true; }
    return false;
  }
  function setTwoBars(on) {
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
    sel = 'plus';
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
    const modTab = e.target.closest('.pw-board .cmod');
    if (modTab) { holdTab(modTab, e); return; }
    const block = e.target.closest('.pw-board .cblock');
    if (block) { e.preventDefault(); pick(block.dataset.place); return; }
    // a chord card: a tap selects it, a drag moves it
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
    } else selectCard(d.from);
  };
  body.addEventListener('pointerup', endDrag);
  body.addEventListener('pointercancel', e => { if (drag) { drag.card.classList.remove('dragging'); drag = null; render(); } });

  body.addEventListener('click', e => {
    if (tab !== 'build') return;
    const t = e.target;
    const b = t.closest('button, .pw-pcard, .pw-card');
    if (!b) return;
    if (b.dataset.once) { e.stopPropagation(); startHear(b.dataset.once, true); return; }
    if (b.classList.contains('pw-pcard') && b.dataset.prog) { if (b.dataset.prog !== selProg) { selProg = b.dataset.prog; sel = 'plus'; confirmDelete = false; render(); } return; }
    if (b.classList.contains('pw-new')) { selProg = null; sel = 'plus'; confirmDelete = false; render(); const n = body.querySelector('.pw-name'); if (n) { n.focus(); n.select(); } return; }
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
    if (t.classList.contains('pw-two-box')) { setTwoBars(t.checked); }
  });
  body.addEventListener('keydown', e => {
    if (e.target.classList && e.target.classList.contains('pw-name') && e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
  });
  body.addEventListener('contextmenu', e => { if (e.target.closest('.cblock, .cmod')) e.preventDefault(); });

  /* More chords…: the chord editor on the selected chord (+ selected: a new one, I to start) */
  function moreChords() {
    let p = cur();
    let i = sel;
    if (!p || i === 'plus') {
      if (!p) { ensureProg({ chord: 'I' }); p = cur(); i = 0; }
      else { T.insertStep(p.id, p.chords.length, { chord: 'I' }); p = cur(); i = p.chords.length - 1; }
      sel = i;
    }
    const st = p.chords[i];
    const spec = C.parse(st.chord) || { root: '1', q: 'maj', mods: [] };
    const id = p.id;
    SW.chordStrip.openSpecEditor({
      title: 'Chord ' + (i + 1) + ' of ' + p.name,
      spec,
      label: false,
      onChange: sp => T.setStep(id, i, { chord: C.toId(sp), place: null })
    });
  }

  foot.addEventListener('click', e => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const p = cur();
    switch (b.dataset.act) {
      case 'duplicate': if (p) { selProg = T.duplicateProg(p.id); sel = 'plus'; } break;
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
        sel = 'plus';
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
     IN THE SONG (phase 3, DESIGN.md §5) — the map of the song's bars:
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
      case 'new': tab = 'build'; selProg = null; sel = 'plus'; render(); break;
      case 'edit': if (r && r.prog) { selProg = r.prog; sel = 'plus'; tab = 'build'; render(); } break;
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
    html += '<div class="pw-pick"><div class="pw-board-wrap"><p class="pw-kicker">Pick a chord</p>' + boardHtml() + '</div>' +
      '<div class="pw-pick-side"><p class="pw-kicker">&nbsp;</p>' +
      ui.note('here.pick', 'Tap a card above, then a chord (or press its key — hold <kbd>Z</kbd> <kbd>X</kbd> <kbd>C</kbd> <kbd>V</kbd> <kbd>B</kbd> to change it). <b>No chord</b> makes it silent.') +
      '<div class="pw-more"><button type="button" class="btn" data-hw="more">More chords…</button> <button type="button" class="btn" data-hw="none">No chord</button></div></div></div>';
    html += '<div class="pw-rhythm">' + hereRhythmHtml(p) + '</div>';
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
      (c.rhythm ? '<div class="seg pw-mode"><button type="button" class="seg-btn' + (mode === 'dots' ? ' active' : '') + '" data-mode="dots">Dots</button><button type="button" class="seg-btn' + (mode === 'easy' ? ' active' : '') + '" data-mode="easy">Easy</button></div>' : '') +
      '</div>';
    if (c.rhythm) {
      const sc = hereScope();
      html += stripHtml(sc) + '<div class="pw-presets">' + presets(sc).map(pr => '<button type="button" class="pw-preset' + (pr.cells === sc.cells ? ' on' : '') + '" data-preset="' + pr.cells + '">' + esc(pr.label) + '</button>').join('') + '</div>';
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
        SW.chordStrip.openSpecEditor({
          title: 'Bar ' + here.bar + ' — just here',
          spec: C.parse(c.chord) || { root: '1', q: 'maj', mods: [] },
          label: false,
          onChange: sp => { if (!here) return; here.chords[idx].chord = C.toId(sp); delete here.chords[idx].place; commitHere(); }
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
    if (key1 && C.isModKey(key1)) { e.preventDefault(); if (!e.repeat) C.setMod(key1.toUpperCase(), true); return true; }
    const place = key1 && !e.altKey ? C.placeForKey(key1) : null;
    if (place) { e.preventDefault(); if (!e.repeat) pick(place); return true; }
    switch (k) {
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
  const RO_OK = '[data-tab], .sheet-close, [data-act="done"], .pw-pcard, .pw-pplay, .pw-hear, .pw-beat, [data-mode], .note-i, .fold-note, ' +
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
    sel = 'plus';
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
    board.querySelectorAll('.cblock').forEach(b => {
      const e = C.entry(b.dataset.place);
      if (!e) return;
      const tmp = document.createElement('div');
      tmp.innerHTML = SW.chordStrip.blockHtml(e, 1, { noEdit: true });
      const nb = tmp.firstChild;
      b.innerHTML = nb.innerHTML;
      b.className = nb.className;
      b.style.setProperty('--c', nb.style.getPropertyValue('--c'));
      b.style.setProperty('--ink', nb.style.getPropertyValue('--ink'));
    });
    board.querySelectorAll('.cmod').forEach(t => t.classList.toggle('on', C.heldMods.has(t.dataset.mod)));
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
    if (tab === 'song') schedule(); else SW.chordStrip.fitLabels(body.querySelector('.pw-board'));
  });

  SW.progWin = { open, openHere, close, isOpen, onTop, keyDown, render, tab: () => tab, setTab };
})();

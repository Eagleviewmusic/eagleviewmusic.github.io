/* ==========================================================================
   COMPONENT — the rhythm box: how a chord plays                SW.rhythmBox
   --------------------------------------------------------------------------
   The user's overhaul (2026-10-27): every place a chord rhythm is chosen
   is this one box — a progression's rhythm (Edit Chords), one chord of it
   (the chord editor), a chord on the music (its window). Three tabs:

     [ Held ][ Pre-built ][ Build your own ]

   HELD — struck once, ringing for its whole length; drawn as its notes:
     a whole note a bar (a dotted half in 3/4), tied over the bar lines.
     The tab is the choice: pressed, the chord is held.
   PRE-BUILT — the meter's rhythms, a line of notes each; a tap takes one
     (laid in step with the bar, wherever the chord starts).
   BUILD YOUR OWN — Rhythm Poetry's circles, as the Rhythm page draws them
     (the same pills, the same classes): a pill a beat, orange a strike,
     yellow it rings on, grey silence — a tap on orange stops it (the
     strike before rings on, or silence), on yellow strikes again, on grey
     strikes and rings to the beat's end; + splits a beat into sixteenths
     (again: back to eighths); ⛓ carries the sound over the beat line
     (again: what was carried over is silence). The notes are engraved
     under the circles, on their centres.

   A SCOPE says what the box is about and how to write it:
     { key,                       tab and sixteenths memory
       kind: 'bar' | 'chord',     a progression's bar (1 or 2) · a chord's own length
       cells,                     what it plays now (X a strike, O rings on, R silence)
       held,                      it plays held
       lead,                      'chord': cells before its start in its first bar
       bars,                      'bar': 1 | 2
       colour, readOnly,
       follows,                   'chord': the progression whose rhythm it plays (its name), or null
       own,                       'chord': it has its own (… Back to Verse's)
       toAll(),                   'chord': every chord of the progression plays this (held, a pre-built)
       barNo(k),                  the song's bar numbers over the circles (or null)
       write(v),                  v: 'held' · cells over its span · null (its progression's again)
       setBars(n), redraw() }

   API  SW.rhythmBox.html(sc) · click(button, sc) → handled? · layout(root) ·
        presets(sc) · held(sc) — the tab a scope opens on: tabOf(sc)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const T = SW.track;
  if (!T) return;
  const CELL = T.CELL;
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const meter = () => SW.meters.byId(S.meter);
  const perBeat = () => meter().beatTicks / CELL;
  const tabs = new Map();         // scope key → the tab looked at: 'held' | 'pre' | 'build'
  const fine = new Set();         // beats shown in sixteenths: scope key + ':' + first cell
  const CHAIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>';

  /* ================= THE CIRCLES' GESTURES (flow.js's, on a chord's cells) ================= */
  const sounds = (a, k) => a[k] === 'X' || a[k] === 'O';
  const starts = (a, k) => a[k] === 'X' || (a[k] === 'R' && k > 0 && a[k - 1] !== 'R');
  /* a circle tapped: cells [i, i+span) are its slot, inside the beat [b0, b1) */
  function tap(cells, i, span, b0, b1) {
    const a = cells.split('');
    if (a[i] === 'X') {
      if (i > b0 && sounds(a, i - 1)) a[i] = 'O';                          // the strike before rings on through it
      else { a[i] = 'R'; for (let j = i + 1; j < a.length && a[j] === 'O'; j++) a[j] = 'R'; }
    } else if (a[i] === 'O') a[i] = 'X';                                    // a new strike
    else {
      a[i] = 'X';                                                           // silence: a strike, ringing to the beat's end
      for (let j = i + 1; j < b1 && a[j] === 'R'; j++) a[j] = 'O';
    }
    for (let j = i + 1; j < i + span && j < b1; j++) if (a[j] === 'X' && a[i] !== 'R') a[j] = 'O';   // a slot is one circle
    return T.tidyCells(a.join(''));
  }
  /* ⛓ at the beat line c1 (the next beat ends at c2) */
  const joined = (cells, c1) => c1 < cells.length && cells[c1] === 'O';
  const canJoin = (cells, c1) => c1 > 0 && c1 < cells.length && cells[c1 - 1] !== 'R';
  function join(cells, c1, c2) {
    const a = cells.split('');
    if (a[c1] === 'O') { a[c1] = 'R'; for (let j = c1 + 1; j < a.length && a[j] === 'O'; j++) a[j] = 'R'; }
    else if (canJoin(cells, c1)) { a[c1] = 'O'; for (let j = c1 + 1; j < c2 && a[j] === 'R'; j++) a[j] = 'O'; }
    return T.tidyCells(a.join(''));
  }
  /* back to eighths: every sixteenth's start moves onto the eighth before it */
  function coarsen(cells, b0, b1) {
    const a = cells.split('');
    for (let o = b0 + 1; o < b1; o += 2) {
      if (!starts(a, o)) continue;
      const e = o - 1, t = a[o];
      if (starts(a, e)) a[o] = sounds(a, e) ? 'O' : 'R';
      else { a[e] = t; a[o] = t === 'X' ? 'O' : 'R'; }
    }
    return T.tidyCells(a.join(''));
  }
  function needs16(cells, b0, b1) {
    const a = cells.split('');
    for (let o = Math.max(1, b0 + 1); o < b1; o += 2) if (starts(a, o)) return true;
    return false;
  }

  /* ================= PRE-BUILT ================= */
  /* the meter's rhythms, as rhythm strings (one bar) */
  const PRESETS = {
    '4/4': ['q q q q', 'h h', 'q q e e q', 'e e e e e e e e', 'q e e q e e', 'e q e e q e', 'h q q', 'q. e q q'],
    '3/4': ['q q q', 'h q', 'q e e e e', 'e e e e e e', 'q q e e', 'q h'],
    '2/4': ['q q', 'e e e e', 'q e e', 'e q e', 'e e q'],
    '6/8': ['q. q.', 'e e e e e e', 'q e q e', 'q. e e e', 'q e q.'],
    '9/8': ['q. q. q.', 'h. q.', 'e e e e e e e e e', 'q e q e q e'],
    '12/8': ['q. q. q. q.', 'h. h.', 'q e q e q e q e', 'e e e e e e e e e e e e', 'q. q. q e q e']
  };
  /* Simplified Kodály, as Rhythm Poetry counts a beat (the lines' names) */
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
  /* a pattern laid over n cells from `offset` cells into it (in step with the bar) */
  function tile(pattern, n, offset) {
    let out = '';
    for (let j = 0; j < n; j++) out += pattern[(offset + j) % pattern.length] || 'R';
    return T.tidyCells(out);
  }
  /* what a one-bar rhythm makes of the scope */
  function wanted(sc, one) {
    const BAR = meter().barTicks / CELL;
    return tile(one, sc.cells.length, sc.kind === 'chord' ? (sc.lead || 0) % BAR : 0);
  }
  function presets(sc) {
    const BAR = meter().barTicks / CELL;
    const seen = new Set();
    return (PRESETS[S.meter] || PRESETS['4/4']).map(str => {
      const c = T.cells(str);
      if (!c) return null;
      const one = tile(c, BAR, 0);
      if (seen.has(one)) return null;
      seen.add(one);
      return { one, label: sayAll(one), want: wanted(sc, one) };
    }).filter(Boolean);
  }
  const matchesPreset = sc => !sc.held && presets(sc).some(p => p.want === sc.cells);
  function tabOf(sc) {
    if (!sc.readOnly && tabs.has(sc.key)) return tabs.get(sc.key);
    return sc.held ? 'held' : matchesPreset(sc) ? 'pre' : 'build';
  }

  /* ================= DRAWING ================= */
  function lengthText(beats) {
    const B = meter().beats;
    const bars = Math.floor(beats / B + 1e-9), rest = Math.round((beats - bars * B) * 100) / 100;
    const parts = [];
    if (bars) parts.push(bars === 1 ? '1 bar' : bars + ' bars');
    if (rest) parts.push(rest === 1 ? '1 beat' : rest + ' beats');
    return parts.join(' and ') || '';
  }
  function html(sc) {
    const t = tabOf(sc);
    const m = meter();
    let h = '<div class="rbox" data-rbkey="' + esc(sc.key) + '">';
    // whose rhythm it is: its progression's, or its own
    if (sc.kind === 'chord' && sc.follows && !sc.own) {
      h += '<div class="rb-whose">' + SW.ui.note('rb.follows', 'It plays <b>' + esc(sc.follows) + '</b>’s rhythm. Choose one here and it has its own.') + '</div>';
    } else if (sc.kind === 'chord' && sc.own && !sc.readOnly) {
      h += '<div class="rb-whose rb-own"><span class="rb-own-tag">Its own rhythm</span>' +
        (sc.follows ? '<button type="button" class="btn pw-small-btn" data-rbback title="It plays ' + esc(sc.follows) + '’s rhythm again">Back to ' + esc(sc.follows) + '’s</button>' : '') +
        (sc.toAll && (sc.held || matchesPreset(sc)) ? '<button type="button" class="btn pw-small-btn" data-rball title="Every chord of ' + esc(sc.follows) + ' plays this rhythm">Every chord of ' + esc(sc.follows) + '</button>' : '') +
      '</div>';
    }
    if (!sc.readOnly) {
      const tabBtn = (id, label) => '<button type="button" class="pw-rtab' + (t === id ? ' on' : '') + '" data-rbtab="' + id + '" role="tab" aria-selected="' + (t === id) + '">' + label + '</button>';
      const bars = sc.kind === 'bar' && t !== 'held'
        ? '<div class="seg pw-bars" role="group" aria-label="How long the rhythm is"><button type="button" class="seg-btn' + (sc.bars === 2 ? '' : ' active') + '" data-rbbars="1">1 bar</button><button type="button" class="seg-btn' + (sc.bars === 2 ? ' active' : '') + '" data-rbbars="2">2 bars</button></div>'
        : '';
      h += '<div class="pw-rtabs" role="tablist" aria-label="Held, a pre-built rhythm, or one you build">' + tabBtn('held', 'Held') + tabBtn('pre', 'Pre-built') + tabBtn('build', 'Build your own') + bars + '</div>';
    }
    h += '<div class="pw-rbox rb-panel' + (sc.readOnly ? ' solo' : '') + (t === 'pre' ? ' pre' : '') + '" role="tabpanel">';
    if (t === 'held') h += heldHtml(sc, m);
    else if (t === 'pre') h += preHtml(sc, m);
    else h += circlesHtml(sc, m);
    return h + '</div></div>';
  }
  /* Held: its whole length in notes (a chord's), or a bar's (a progression's) */
  function heldHtml(sc, m) {
    const BAR = m.barTicks / CELL;
    const n = sc.kind === 'bar' ? BAR : sc.cells.length;
    const lead = sc.kind === 'bar' ? 0 : (sc.lead || 0) % BAR;
    const notes = SW.engrave.rhythm('X' + 'O'.repeat(Math.max(0, n - 1)), { perBeat: m.beatTicks / CELL, barCells: BAR, compound: m.compound, ss: 11, lead });
    const say = sc.kind === 'bar'
      ? 'Each chord is struck once and rings for as long as it lasts.'
      : 'Struck once — it rings for ' + lengthText(n * CELL / m.beatTicks) + '.';
    return '<div class="rb-held' + (sc.held ? ' on' : '') + '" style="--c:' + sc.colour + '"><div class="rb-held-notes">' + notes + '</div>' +
      '<p class="rb-say">' + (sc.held ? '<b>✓</b> ' : '') + esc(say) + '</p></div>';
  }
  function preHtml(sc, m) {
    const o = { perBeat: m.beatTicks / CELL, barCells: m.barTicks / CELL, compound: m.compound, top: m.top, bottom: m.bottom, ss: 8 };
    return '<div class="pw-lines">' + presets(sc).map(pr => {
      const on = !sc.held && pr.want === sc.cells;
      return '<button type="button" class="pw-line' + (on ? ' on' : '') + '" data-rbpre="' + pr.one + '" title="' + esc(pr.label) + '" aria-label="' + esc(pr.label) + '" aria-pressed="' + on + '"' + (sc.readOnly ? ' disabled' : '') + '>' +
        SW.engrave.rhythm(pr.one, o) + '</button>';
    }).join('') + '</div>';
  }
  /* Build your own: a bar a row of pills (wrapping), the notes under them */
  function circlesHtml(sc, m) {
    const PB = m.beatTicks / CELL, BAR = m.barTicks / CELL;
    const cells = sc.cells, n = cells.length;
    const lead = sc.kind === 'chord' ? (sc.lead || 0) % BAR : 0;
    let h = '<div class="rb-kit' + (sc.readOnly ? ' frozen' : '') + '" data-cells="' + cells + '" style="--c:' + sc.colour + '"><div class="rb-bars">';
    for (let barC0 = -lead, k = 0; barC0 < n; barC0 += BAR, k++) {
      let beats = '', count = 0;
      for (let b = 0; b < m.beats; b++) {
        const c0 = barC0 + b * PB, c1 = c0 + PB;
        if (c1 <= 0 || c0 >= n) continue;                     // before the chord, or after it
        beats += pillHtml(sc, cells, c0, count, b === m.beats - 1);
        count++;
      }
      const no = sc.barNo ? sc.barNo(k) : null;
      h += '<div class="rb-bar">' + (k ? '<span class="rb-div" aria-hidden="true"></span>' : '') +
        '<div class="rb-measure" data-c0="' + barC0 + '" style="--beats:' + count + '">' +
        (no !== null && no !== undefined ? '<span class="rb-num">' + esc(no) + '</span>' : '') +
        beats + '<div class="rp-notes"></div></div></div>';
    }
    return h + '</div></div>';
  }
  function pillHtml(sc, cells, c0, n, lastInBar) {
    const PB = perBeat();
    const key = sc.key + ':' + c0;
    const s16 = fine.has(key) || needs16(cells, Math.max(0, c0), Math.min(cells.length, c0 + PB));
    const slots = s16 ? PB : PB / 2, span = PB / slots;
    const ro = !!sc.readOnly;
    let h = '<div class="rp-circles' + (ro ? ' frozen' : '') + '" data-c0="' + c0 + '" style="--slots:' + slots + ';grid-column:' + (n + 1) + '">';
    if (!ro && c0 >= 0) h += '<div class="rp-sub"><button type="button" class="rp-plus' + (s16 ? ' active' : '') + '" data-rbfine="' + c0 + '" title="' +
      (s16 ? 'Back to eighths — sixteenths move onto the eighth before them' : 'Split this beat into sixteenths') + '" aria-label="Sixteenths">+</button></div>';
    const c1 = c0 + PB;
    if (!ro && !lastInBar && c0 >= 0 && c1 < cells.length) {
      const j = joined(cells, c1);
      if (j || canJoin(cells, c1)) h += '<button type="button" class="rp-link' + (j ? ' active' : '') + '" data-rbjoin="' + c1 + '" data-end="' + (c1 + PB) + '" title="' +
        (j ? 'Joined — it rings on over the beat line; tap to part them' : 'Join to the next beat — it rings on over the beat line') + '">' + CHAIN + '</button>';
    }
    for (let i = 0; i < slots; i++) {
      const c = c0 + i * span;
      if (c < 0 || c >= cells.length) { h += '<span class="rp-circle off" aria-hidden="true"></span>'; continue; }
      const ch = cells[c];
      const cls = 'rp-circle' + (ch === 'X' ? ' active' : ch === 'O' ? ' sustain' : '');
      const title = ch === 'X' ? 'A strike starts here — tap to stop it' : ch === 'O' ? 'It rings on — tap to strike again here' : 'Silence — tap for a strike';
      h += ro ? '<span class="' + cls + '"></span>'
        : '<button type="button" class="' + cls + '" data-rbcell="' + c + '" data-span="' + span + '" data-b0="' + Math.max(0, c0) + '" data-b1="' + c1 + '" title="' + title + '"></button>';
    }
    return h + '</div>';
  }

  /* after the box is in the page: fitted to its room, then the notes on the circles */
  function layout(root) {
    (root || document).querySelectorAll('.rb-kit').forEach(kit => {
      if (!kit.offsetWidth) return;
      kit.style.setProperty('--k', '1');
      for (let pass = 0; pass < 2; pass++) {
        const avail = kit.clientWidth;
        let widest = 0;
        kit.querySelectorAll('.rb-bar').forEach(b => { widest = Math.max(widest, b.scrollWidth); });
        if (widest <= avail + 0.5) break;
        const k = parseFloat(kit.style.getPropertyValue('--k')) || 1;
        kit.style.setProperty('--k', Math.max(0.55, k * avail / widest - 0.005).toFixed(3));
      }
      engrave(kit);
    });
  }
  function engrave(kit) {
    const m = meter();
    const PB = m.beatTicks / CELL, BAR = m.barTicks / CELL;
    const cells = kit.dataset.cells || '';
    kit.querySelectorAll('.rb-measure').forEach(meas => {
      const barC0 = Number(meas.dataset.c0);
      const box = meas.querySelector('.rp-notes');
      if (!box) return;
      const br = box.getBoundingClientRect();
      const centres = new Map();
      meas.querySelectorAll('.rp-circles').forEach(c => {
        const c0 = Number(c.dataset.c0);
        const circles = Array.from(c.querySelectorAll('.rp-circle'));
        const span = PB / circles.length;
        circles.forEach((circ, i) => {
          const r = circ.getBoundingClientRect();
          const x = r.left + r.width / 2 - br.left;
          for (let j = 0; j < span; j++) centres.set(c0 + i * span + j, x);
        });
      });
      let str = '';
      for (let a = barC0; a < barC0 + BAR; a++) str += a >= 0 && a < cells.length ? cells[a] : 'R';
      const noteH = box.offsetHeight || 64;
      const ss = noteH / 5.2;
      box.innerHTML = SW.engrave.rhythm(str, {
        perBeat: PB, barCells: BAR, compound: m.compound, ss, width: br.width,
        xAt: a => { const v = centres.get(barC0 + a); return v === undefined ? 0 : v; },
        from: Math.max(0, -barC0), to: Math.min(BAR, cells.length - barC0),
        tiedIn: barC0 > 0 && cells[barC0] === 'O',
        tiedOut: barC0 + BAR < cells.length && cells[barC0 + BAR] === 'O'
      });
      const svg = box.firstElementChild;
      if (!svg) return;
      const picH = ss * 6.9;
      svg.setAttribute('width', br.width);
      svg.setAttribute('height', picH);
      svg.style.top = ((noteH - picH) / 2) + 'px';
      svg.style.setProperty('--ring', (Math.max(1, ss * 0.055) * 360 / ss).toFixed(1));
    });
  }

  /* ================= A TAP ================= */
  function click(b, sc) {
    if (!b || !sc) return false;
    const d = b.dataset;
    if (d.rbtab) {
      tabs.set(sc.key, d.rbtab);
      if (d.rbtab === 'held' && !sc.held && !sc.readOnly) { sc.write(T.HELD); return true; }     // the tab is the choice
      sc.redraw();
      return true;
    }
    if (sc.readOnly) return false;
    if (d.rbpre !== undefined) {
      const want = wanted(sc, d.rbpre);
      if (sc.held || want !== sc.cells) sc.write(want);
      return true;
    }
    if (d.rbbars) { if (sc.setBars) sc.setBars(Number(d.rbbars)); return true; }
    if (d.rbfine !== undefined) {
      const c0 = Number(d.rbfine), key = sc.key + ':' + c0, PB = perBeat();
      if (fine.has(key) || needs16(sc.cells, c0, c0 + PB)) {
        fine.delete(key);
        if (needs16(sc.cells, c0, c0 + PB)) { sc.write(coarsen(sc.cells, c0, c0 + PB)); return true; }
      } else fine.add(key);
      sc.redraw();
      return true;
    }
    if (d.rbjoin !== undefined) { sc.write(join(sc.cells, Number(d.rbjoin), Number(d.end))); return true; }
    if (d.rbcell !== undefined) { sc.write(tap(sc.cells, Number(d.rbcell), Number(d.span) || 1, Number(d.b0), Number(d.b1))); return true; }
    if (d.rbback !== undefined) { tabs.delete(sc.key); sc.write(null); return true; }
    if (d.rball !== undefined && sc.toAll) {
      // held, or the pre-built line it is — as a bar's rhythm
      const pre = sc.held ? null : presets(sc).find(p => p.want === sc.cells);
      if (sc.held || pre) { tabs.delete(sc.key); sc.toAll(sc.held ? T.HELD : pre.one); }
      return true;
    }
    return false;
  }

  /* the circles of a scope, for a rhythm heard while a chord is held (progression-window.js) */
  const heldCells = n => 'X' + 'O'.repeat(Math.max(0, n - 1));

  SW.rhythmBox = { html, click, layout, presets, tabOf, heldCells, sayAll, tile };
})();

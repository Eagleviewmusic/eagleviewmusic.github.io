/* ==========================================================================
   COMPONENT — the chord track in the score             .notation-line > .ctrack
   and the chords after the melody                       #chord-tail
   --------------------------------------------------------------------------
   Phase 4 of ../Song Writer Chord Progressions/ (DESIGN.md §6, §8). The
   chords of the track (js/track.js) drawn over the music, in the row the
   chord lane keeps at the top of every syllable (its .chord-slot is now
   only a spacer), one band per visual row of a wrapped line:

     Verse ▸
     ┌ I ────────────┐┌ IV ───────────┐┌ V ────────────┐┌ vi ┐
     │ •  •  • •  •  ││ •  •  • •  •  ││ •  •  • •  •  ││ •   │
     𝄞 4/4  ♩  ♩  ♩  ♩ │ ♩  ♩  𝅗𝅥     │ …

   • a chord is a bar of its root's colour from its first beat to the
     next chord's, its name at the left, its strikes as dots under it
     (and a line while one rings); a stretch's first chord carries the
     progression's name; a chord changed just here wears a white corner;
     a chord still sounding where a row begins is named again in brackets
   • WHERE A BEAT IS — per visual row: the staff's own measurement (each
     column's centre, the offset walk — never getBoundingClientRect, a
     selected word is scaled), the pieces and rests the staff draws to
     finish a bar (its plan), and the row's end; a tick between two of
     those is placed proportionally
   • in Edit, an empty bar shows a faint +
   • AFTER THE MELODY — the bars of chords past the last line, below it,
     four a row (eight on a wide stage), as a chord chart; + Add a line
     at its top (Edit); it folds to its title
   • a tap: Perform — hear it; Edit — select it (the hat's orange ring;
     a chord key then puts that chord there, just here; Delete makes it
     silent; Enter or a double-click opens Just here; ← → walk the
     chords). A double-click (a double tap) opens Just here in Perform
     too (DECISIONS D12). Play starts from a selected chord.
   • while it plays, the chord sounding lights (the player's
     'track:sounding'), and the chart's bars light and are followed

   API  SW.ctrack.draw() · schedule() · select(sel|null) · selected() ·
        selectedTick() · takesChord() · put(id, place) · keyDown(e) ·
        selectAtTick(tick) · playAtTick(tick) · capture(on)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const T = SW.track;
  const C = SW.chords;
  const score = document.getElementById('score');
  const tail = document.getElementById('chord-tail');
  const stage = document.getElementById('stage');
  if (!score || !T || !C) return;

  S.chordSel = null;           // { at } a chord of the track, or { bar } an empty bar (Edit)
  let timer = 0;
  let sounding = null;         // the at of the chord sounding (Play)
  let playingBar = null;       // the chart's bar sounding
  let folded = false;          // the chart folded to its title
  const esc = C.escapeHtml;

  const shown = () => !!(SW.settings && SW.settings.shows('lane'));
  const canEdit = () => S.editing && SW.settings.can('chords');
  const view = () => (SW.settings && SW.settings.view) || {};
  const blockScale = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bs')) || 1;

  function offsetIn(el, ancestor) {
    let x = 0, y = 0, e = el;
    while (e && e !== ancestor) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y };
  }
  function look(id) {
    const d = id ? C.describe(id) : null;
    if (!d || !d.known) return { name: id ? String(id) : '', color: '#9487A2', known: false };
    return { name: C.nameOf(d), color: d.color, known: true };
  }
  /* a colour's ink for writing on its own soft tint: the darker the better */
  function deep(hex, t) {
    const m = /^#([0-9a-f]{6})$/i.exec(hex || '');
    if (!m) return '#2B1D38';
    const n = parseInt(m[1], 16);
    const mix = (c, d) => Math.round(c + (d - c) * t);
    return 'rgb(' + mix(n >> 16, 43) + ',' + mix((n >> 8) & 255, 29) + ',' + mix(n & 255, 56) + ')';
  }
  const light = hex => /^#(FFCC00|48C4C8|FF9500)$/i.test(hex || '');      // yellow, teal, orange need darker ink

  function stretchName(r) {
    if (!r) return '';
    if (r.prog) { const p = T.prog(r.prog); return p ? p.name : ''; }
    return T.isVirtual() ? 'From the lane' : 'Just here';
  }

  /* ================= DRAWING ================= */
  function schedule() { clearTimeout(timer); timer = setTimeout(draw, 30); }

  function draw() {
    clearTimeout(timer);
    const on = shown();
    document.body.classList.toggle('show-ctrack', on);
    if (!on) {
      score.querySelectorAll('.notation-line > .ctrack').forEach(l => l.remove());
      if (tail) { tail.hidden = true; tail.innerHTML = ''; }
      return;
    }
    const g = T.grid();
    const evs = T.events(g);
    const list = T.shown(g);
    const firstOf = new Set();                                   // the first chord of each stretch: it carries the name
    list.forEach((r, i) => { const e = evs.find(x => x.stretch === i); if (e) firstOf.add(e); });
    const lastOf = new Map();                                    // the last chord of each stretch: an end stroke
    list.forEach((r, i) => { const es = evs.filter(x => x.stretch === i); if (es.length) lastOf.set(es[es.length - 1], true); });
    const ctx = { g, evs, list, firstOf, lastOf, bs: blockScale(), edit: canEdit() && !S.present };
    g.song.lines.forEach(le => drawLine(le, ctx));
    drawTail(ctx);
  }

  /* one line: its rows, where each beat of each row is, the chords over them */
  function drawLine(le, ctx) {
    const line = le.line;
    let layer = line.querySelector(':scope > .ctrack');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'ctrack';
      line.appendChild(layer);
    }
    const g = ctx.g;
    const L0 = le.at, L1 = le.at + le.padded;
    const plan = SW.staff && SW.staff.plan ? SW.staff.plan(line) : null;
    const written = line.classList.contains('has-staff') && plan;
    const rows = [];
    le.events.forEach(ev => {
      const o = offsetIn(ev.stack, line);
      const w = ev.stack.offsetWidth;
      const base = Math.round(o.y + ev.stack.offsetHeight);
      let row = rows.find(r => Math.abs(r.base - base) <= 2);
      if (!row) { row = { base, anchors: [], cols: [], syl: ev.syllable }; rows.push(row); }
      const cx = o.x + w / 2;
      const info = written ? plan.info.get(ev.stack) : null;
      const so = offsetIn(ev.syllable, line);
      row.sylRight = Math.max(row.sylRight || 0, so.x + ev.syllable.offsetWidth);   // syllables tile a written row up to its bar line
      row.cols.push({ ev, cx, w, right: o.x + w, info });
      row.anchors.push([L0 + ev.start, cx]);
      if (info && info.pieces) info.pieces.forEach(pc => row.anchors.push([L0 + pc.start, cx + pc.dx]));
    });
    rows.sort((a, b) => a.base - b.base);
    if (!rows.length) { layer.innerHTML = ''; return; }
    const s = 20 * ctx.bs;                                         // a staff space
    const pad = written ? s * 0.62 : Math.min(18 * ctx.bs, rows[0].cols[0].w / 2);
    const cs = getComputedStyle(line);
    const innerRight = line.clientWidth - (parseFloat(cs.paddingRight) || 0);
    rows.forEach(r => { r.anchors.sort((a, b) => a[0] - b[0]); r.t0 = r.anchors[0][0]; });
    rows.forEach((r, i) => {
      r.t1 = i + 1 < rows.length ? rows[i + 1].t0 : L1;
      // the row's end: the last bar line the staff draws after it, or past the last block
      const last = r.cols[r.cols.length - 1];
      const lastAnchor = r.anchors[r.anchors.length - 1];
      let xEnd;
      if (written) xEnd = Math.max(r.sylRight - 2, lastAnchor[1] + pad + 4);    // written: the bar line closing the row
      else {
        const endTick = L0 + last.ev.end;
        const restTicks = Math.max(0, r.t1 - endTick);
        if (!written && restTicks > 0) {
          // a line of blocks ends inside its bar: its silence gets a short tail after the last block
          const tailW = Math.min(restTicks / g.b * 24 * ctx.bs, Math.max(0, innerRight - last.right - 4));
          r.anchors.push([endTick, last.right + 2]);
          xEnd = last.right + 2 + Math.max(6, tailW);
        } else xEnd = Math.max(last.right + 4, lastAnchor[1] + pad + 4);
      }
      r.anchors.push([r.t1, Math.max(xEnd, r.anchors[r.anchors.length - 1][1] + 6)]);
      // monotonic, in case
      for (let k = 1; k < r.anchors.length; k++) if (r.anchors[k][1] < r.anchors[k - 1][1]) r.anchors[k][1] = r.anchors[k - 1][1];
      const slot = r.syl && r.syl.querySelector('.chord-slot');
      const so = slot ? offsetIn(slot, line) : { y: 0 };
      r.y = so.y;
      r.h = slot ? slot.offsetHeight : 0;
      r.xEnd = r.anchors[r.anchors.length - 1][1];
    });
    const xAt = (r, t) => {
      const a = r.anchors;
      if (t <= a[0][0]) return a[0][1];
      for (let k = 1; k < a.length; k++) {
        if (t <= a[k][0]) {
          const [t0, x0] = a[k - 1], [t1, x1] = a[k];
          return t1 === t0 ? x1 : x0 + (x1 - x0) * (t - t0) / (t1 - t0);
        }
      }
      return a[a.length - 1][1];
    };

    let html = '';
    rows.forEach((r, ri) => {
      if (!r.h) return;
      const inRow = ctx.evs.filter(e => e.end > r.t0 && e.at < r.t1);
      inRow.forEach(e => {
        const st = Math.max(e.at, r.t0), en = Math.min(e.end, r.t1);
        const held = e.at < r.t0;
        const x1 = held ? xAt(r, r.t0) - pad : xAt(r, st) - pad;
        const x2 = en >= r.t1 ? r.xEnd - 2 : xAt(r, en) - pad - 3;
        html += barHtml(e, ctx, {
          left: x1, top: r.y, width: Math.max(6, x2 - x1), height: r.h, held,
          tag: !held && ctx.firstOf.has(e) ? stretchName(ctx.list[e.stretch]) : '',
          end: en === e.end && ctx.lastOf.has(e),
          dots: spread(e.strikes.filter(k => k.at >= st && k.at < en).map(k => {
            const dx = xAt(r, k.at) - x1;                                   // under the note it is struck with
            const ex = Math.min(xAt(r, Math.min(k.at + k.len, en)) - x1 - 6, x2 - x1 - 4);
            return [dx, ex];
          }), x2 - x1)
        });
      });
      // the faint + on an empty bar (Edit)
      if (ctx.edit) {
        for (let b = g.barAt(r.t0); g.T(b) < r.t1; b++) {
          const a = Math.max(g.T(b), r.t0), z = Math.min(g.T(b + 1), r.t1);
          if (z <= a || ctx.evs.some(e => e.end > a && e.at < z)) continue;
          const x1 = xAt(r, a) - pad, x2 = z >= r.t1 ? r.xEnd - 2 : xAt(r, z) - pad - 3;
          if (x2 - x1 < 10) continue;
          html += '<button type="button" class="cbar-add' + (S.chordSel && S.chordSel.bar === b ? ' sel' : '') + '" data-bar="' + b + '" style="left:' + x1.toFixed(1) + 'px;top:' + r.y + 'px;width:' + (x2 - x1).toFixed(1) + 'px;height:' + r.h + 'px" title="Bar ' + b + ' — no chords. Tap, then a chord key; double-click to choose">+</button>';
        }
      }
    });
    layer.innerHTML = html;
  }

  /* dots at least a few px apart, inside the bar (in px) */
  function spread(dots, width) {
    const GAP = 9;
    for (let i = 1; i < dots.length; i++) if (dots[i][0] < dots[i - 1][0] + GAP) dots[i][0] = dots[i - 1][0] + GAP;
    const maxX = width - 6;
    for (let i = dots.length - 1; i >= 0; i--) {
      const lim = i === dots.length - 1 ? maxX : dots[i + 1][0] - 5;
      if (dots[i][0] > lim) dots[i][0] = lim;
    }
    dots.forEach((d, i) => { const next = i + 1 < dots.length ? dots[i + 1][0] - 6 : width - 6; d[1] = Math.min(d[1], next); });
    return dots;
  }

  /* one chord bar (the track over a line, or a bar of the chart) */
  function barHtml(e, ctx, o) {
    const l = look(e.id);
    const cls = ['cbar'];
    if (!e.id) cls.push('nochord');
    if (!l.known && e.id) cls.push('unknown');
    if (e.here) cls.push('here');
    if (o.held) cls.push('held');
    if (o.end) cls.push('end');
    if (S.chordSel && S.chordSel.at === e.at) cls.push('sel');
    if (sounding === e.at) cls.push('sounding');
    const ink = deep(l.color, light(l.color) ? 0.55 : 0.25);
    const pos = o.pct
      ? 'left:' + o.left.toFixed(2) + '%;width:' + o.width.toFixed(2) + '%;'
      : 'left:' + o.left.toFixed(1) + 'px;top:' + o.top + 'px;width:' + o.width.toFixed(1) + 'px;height:' + o.height + 'px;';
    const name = e.id ? C.labelHTML(l.name) : '—';
    let dots = '';
    if (view().chordRhythm !== false && o.dots && o.dots.length) {
      dots = '<span class="cb-dots" aria-hidden="true">' + o.dots.map(([x, ex]) =>
        (o.pct ? '<i style="left:' + x.toFixed(2) + '%"></i>' + (ex > x + 2 ? '<b style="left:' + x.toFixed(2) + '%;width:' + (ex - x).toFixed(2) + '%"></b>' : '')
               : '<i style="left:' + x.toFixed(1) + 'px"></i>' + (ex > x + 6 ? '<b style="left:' + x.toFixed(1) + 'px;width:' + (ex - x).toFixed(1) + 'px"></b>' : ''))
      ).join('') + '</span>';
    }
    const title = (e.id ? (l.known ? l.name : e.id + ' (a chord the app cannot read)') : 'No chord') + (e.here ? ' — changed just here' : '') + ' — double-click to change it just here';
    return '<button type="button" class="' + cls.join(' ') + '" data-at="' + e.at + '" style="' + pos + '--c:' + l.color + ';--cs:' + SW.ui.tint(l.color, 0.17) + ';--ck:' + ink + '" title="' + esc(title) + '">' +
      '<span class="cb-name">' + (o.held ? '(' + name + ')' : name) + '</span>' + dots +
      (o.tag ? '<span class="cb-tag">' + esc(o.tag) + ' ▸</span>' : '') +
    '</button>';
  }

  /* ================= AFTER THE MELODY ================= */
  function drawTail(ctx) {
    if (!tail) return;
    const g = ctx.g;
    const trackLast = ctx.evs.end ? g.barAt(ctx.evs.end - 1) : 0;
    const first = Math.max(g.lastBar + 1, g.p0 ? 0 : 1);
    if (!trackLast || trackLast < first) { tail.hidden = true; tail.innerHTML = ''; return; }
    tail.hidden = false;
    const perRow = stage && stage.clientWidth >= 1100 ? 8 : 4;
    const title = 'After the melody · ' + (first === trackLast ? 'bar ' + first : 'bars ' + first + '–' + trackLast);
    let html = '<div class="ct-head">' +
      '<button type="button" class="ct-fold" aria-expanded="' + !folded + '" title="' + (folded ? 'Show the chords after the melody' : 'Fold them away') + '">' + (folded ? '▸' : '▾') + '</button>' +
      '<h3 class="ct-title">' + esc(title) + '</h3>' +
      (ctx.edit && SW.settings.can('structure') ? '<button type="button" class="ct-add" title="A new line of melody — it starts at bar ' + first + ', over these chords">+ Add a line — it starts at bar ' + first + '</button>' : '') +
    '</div>';
    if (!folded) {
      html += '<div class="ct-chart" style="--per:' + perRow + '">';
      for (let b = first; b <= trackLast; b++) {
        const a = Math.max(0, g.T(b)), z = g.T(b + 1);
        const evs = ctx.evs.filter(e => e.end > a && e.at < z);
        const tagE = evs.find(e => ctx.firstOf.has(e) && e.at >= a);
        const rowEnd = (b - first + 1) % perRow === 0 || b === trackLast;
        html += '<div class="ct-bar' + (rowEnd ? ' row-end' : '') + (playingBar === b ? ' playing' : '') + '" data-bar="' + b + '">' +
          '<span class="ct-num">' + b + '</span>' +
          (tagE ? '<span class="ct-tag">' + esc(stretchName(ctx.list[tagE.stretch])) + ' ▸</span>' : '') +
          '<div class="ct-lane">';
        evs.forEach(e => {
          const st = Math.max(e.at, a), en = Math.min(e.end, z);
          const pct = t => (t - a) / (z - a) * 100;
          html += barHtml(e, ctx, {
            pct: true, left: pct(st), width: Math.max(4, pct(en) - pct(st) - 1.2), held: e.at < a,
            end: en === e.end && ctx.lastOf.has(e),
            // dots in % of the chord's own bar, inside a small margin
            dots: e.strikes.filter(k => k.at >= st && k.at < en).map(k => [
              6 + (k.at - st) / (en - st) * 88,
              6 + (Math.min(k.at + k.len, en) - st) / (en - st) * 88 - 4
            ])
          });
        });
        if (!evs.length && ctx.edit) html += '<button type="button" class="cbar-add in-chart' + (S.chordSel && S.chordSel.bar === b ? ' sel' : '') + '" data-bar="' + b + '" title="Bar ' + b + ' — no chords">+</button>';
        html += '</div></div>';
      }
      html += '</div>';
    }
    tail.innerHTML = html;
  }

  /* ================= SELECTING, HEARING, CHANGING ================= */
  function paintSel() {
    document.querySelectorAll('.cbar.sel, .cbar-add.sel').forEach(b => b.classList.remove('sel'));
    if (!S.chordSel) return;
    if (S.chordSel.at !== undefined) document.querySelectorAll('.cbar[data-at="' + S.chordSel.at + '"]').forEach(b => b.classList.add('sel'));
    else document.querySelectorAll('.cbar-add[data-bar="' + S.chordSel.bar + '"]').forEach(b => b.classList.add('sel'));
  }
  function select(sel) {
    if (sel && !canEdit()) sel = null;
    const was = S.chordSel;
    if (sel && SW.score.getActiveNote()) {
      holdSel = true;
      SW.score.deselect();
      holdSel = false;
    }
    S.chordSel = sel || null;
    paintSel();
    if (!!was !== !!sel || (was && sel && (was.at !== sel.at || was.bar !== sel.bar))) SW.bus.emit('chordsel:changed', { sel: S.chordSel });
  }
  let holdSel = false;
  const selected = () => S.chordSel;
  function selectedTick() {
    if (!S.chordSel) return null;
    if (S.chordSel.at !== undefined) return S.chordSel.at;
    return Math.max(0, T.grid().T(S.chordSel.bar));
  }
  function eventAt(tick) {
    return T.events().find(e => e.at <= tick && tick < e.end) || null;
  }
  function hear(e) {
    if (e && e.id && C.isKnown(e.id)) C.play(e.id, 'track');
  }
  function playAtTick(tick) { hear(eventAt(tick)); }
  /* Edit: the chord (or empty bar) at a tick becomes the selection */
  function selectAtTick(tick) {
    const e = eventAt(tick);
    if (e) { select({ at: e.at }); hear(e); }
    else select({ bar: T.grid().barAt(tick) });
  }

  /* a chord key (or a block on the panel) with a chord selected: that
     chord there, just here */
  const takesChord = () => !!S.chordSel && canEdit() && shown();
  function put(id, place) {
    if (!takesChord()) return false;
    const tick = selectedTick();
    const step = { chord: id };
    if (place) step.place = place;
    if (S.chordSel.bar !== undefined) {
      T.setHere(tick, [step]);
      const e = eventAt(tick);
      S.chordSel = e ? { at: e.at } : S.chordSel;
    } else T.setHere(tick, [step]);
    return true;
  }
  function silenceSelected() {
    if (!takesChord() || S.chordSel.at === undefined) return;
    T.setHere(S.chordSel.at, [{ chord: null }]);
  }
  function walk(d) {
    const evs = T.events();
    if (!evs.length) return;
    const t = selectedTick();
    let i = evs.findIndex(e => e.at === t);
    if (i < 0) i = d > 0 ? -1 : evs.length;
    const n = evs[Math.max(0, Math.min(evs.length - 1, i + d))];
    select({ at: n.at });
    hear(n);
    scrollTo(n.at);
  }
  function scrollTo(at) {
    const b = document.querySelector('.cbar[data-at="' + at + '"]');
    if (b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function openHere(tick) {
    if (!SW.settings.can('chords') || !SW.progWin || !SW.progWin.openHere) return;
    SW.progWin.openHere(tick);
  }

  /* keys (app.js, after the keyboard's own): with a chord selected */
  function keyDown(e) {
    if (!S.chordSel || !canEdit() || !shown()) return false;
    switch (e.key) {
      case 'Delete': case 'Backspace': e.preventDefault(); silenceSelected(); return true;
      case 'Enter': e.preventDefault(); openHere(selectedTick()); return true;
      case 'ArrowLeft': e.preventDefault(); walk(-1); return true;
      case 'ArrowRight': e.preventDefault(); walk(1); return true;
    }
    return false;
  }

  /* ================= GESTURES ================= */
  let lastTap = null;
  function onTap(btn, e) {
    if (btn.classList.contains('cbar-add')) {
      const bar = Number(btn.dataset.bar);
      if (isDouble(btn, e)) { openHere(Math.max(0, T.grid().T(bar))); return; }
      select({ bar });
      return;
    }
    const at = Number(btn.dataset.at);
    if (isDouble(btn, e)) { openHere(at); return; }
    const ev = T.events().find(x => x.at === at);
    if (canEdit()) select({ at });
    hear(ev);
  }
  /* a double tap (a finger, a pen) is the double-click; a mouse sends its own */
  function isDouble(btn, e) {
    if (e.pointerType === 'mouse' || !e.pointerType) return false;
    const now = performance.now();
    const key = btn.dataset.at || 'b' + btn.dataset.bar;
    if (lastTap && lastTap.key === key && now - lastTap.t < 420) { lastTap = null; return true; }
    lastTap = { key, t: now };
    return false;
  }
  function handle(root) {
    // caught before the score's own handlers (which would find the nearest note)
    root.addEventListener('pointerdown', e => { if (e.target.closest('.cbar, .cbar-add')) e.stopPropagation(); }, true);
    root.addEventListener('pointerup', e => {
      const btn = e.target.closest('.cbar, .cbar-add');
      if (!btn) return;
      e.stopPropagation();
      onTap(btn, e);
    }, true);
    root.addEventListener('click', e => { if (e.target.closest('.cbar, .cbar-add')) e.stopPropagation(); }, true);
    root.addEventListener('dblclick', e => {
      const btn = e.target.closest('.cbar, .cbar-add');
      if (!btn) return;
      e.stopPropagation();
      e.preventDefault();
      openHere(btn.dataset.at !== undefined ? Number(btn.dataset.at) : Math.max(0, T.grid().T(Number(btn.dataset.bar))));
    }, true);
  }
  handle(score);
  if (tail) {
    handle(tail);
    tail.addEventListener('click', e => {
      e.stopPropagation();
      if (e.target.closest('.ct-fold')) {
        folded = !folded;
        SW.settings.setView({ chartFolded: folded }, { quiet: true });
        draw();
        return;
      }
      if (e.target.closest('.ct-add')) {
        const line = SW.score.appendEmptyLine();
        if (line) SW.score.changed('line');
      }
    });
  }

  /* ================= PLAY ================= */
  SW.bus.on('track:sounding', d => {
    sounding = d.at;
    document.querySelectorAll('.cbar.sounding').forEach(b => b.classList.remove('sounding'));
    document.querySelectorAll('.cbar[data-at="' + d.at + '"]').forEach(b => b.classList.add('sounding'));
  });
  SW.bus.on('track:bar', d => {
    playingBar = d.bar;
    if (!tail) return;
    tail.querySelectorAll('.ct-bar.playing').forEach(b => b.classList.remove('playing'));
    const bar = tail.querySelector('.ct-bar[data-bar="' + d.bar + '"]');
    if (bar) {
      bar.classList.add('playing');
      if (view().followScroll !== false && bar.scrollIntoView) bar.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
  SW.bus.on('play:changed', d => {
    if (d.playing) return;
    sounding = null;
    playingBar = null;
    document.querySelectorAll('.cbar.sounding').forEach(b => b.classList.remove('sounding'));
    if (tail) tail.querySelectorAll('.ct-bar.playing').forEach(b => b.classList.remove('playing'));
  });

  /* stepping onto a word where a chord starts plays it (Perform, as the lane did) */
  SW.bus.on('selection', d => {
    if (d && d.stack && S.chordSel && !holdSel) { S.chordSel = null; paintSel(); SW.bus.emit('chordsel:changed', { sel: null }); }
    if (!d || !d.sounded || !d.stack || !shown() || S.playing) return;
    if (!SW.settings.view.laneChordsPlay) return;
    const firstCol = d.syllable && d.syllable.querySelector('.harmony-stack') === d.stack;
    if (!firstCol) return;
    const song = SW.timing.song();
    let at = null;
    song.lines.some(le => le.events.some(ev => { if (ev.stack === d.stack) { at = le.at + ev.start; return true; } return false; }));
    if (at === null) return;
    const e = T.events().find(x => x.at === at);
    if (e) hear(e);
  });

  /* Save picture: the chart goes into the picture with the song */
  function capture(on) {
    if (!tail) return;
    if (on) { if (!tail.hidden && tail.innerHTML) score.appendChild(tail); }
    else if (tail.parentNode === score) stage.insertBefore(tail, score.nextSibling);
  }

  // what moves the bars: the staff laid out again, the song, the track, the view
  SW.bus.on('staff:drawn', schedule);
  ['score:changed', 'score:loaded', 'track:changed', 'view:changed', 'layout:changed', 'names:changed', 'chords:changed',
   'policy:changed', 'key:changed', 'scale:changed', 'meter:changed'].forEach(evt => SW.bus.on(evt, schedule));
  SW.bus.on('mode:changed', d => { if (!d.editing && S.chordSel) { S.chordSel = null; SW.bus.emit('chordsel:changed', { sel: null }); } schedule(); });
  SW.bus.on('score:loaded', () => { S.chordSel = null; });
  window.addEventListener('resize', schedule);
  if (SW.settings && SW.settings.view) folded = !!SW.settings.view.chartFolded;

  SW.ctrack = { draw, schedule, select, selected, selectedTick, takesChord, put, keyDown, selectAtTick, playAtTick, capture };
  schedule();
})();

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

   • a chord is a bar of its root's colour from its first beat to its
     end, its name at the left, its strikes as dots under it (and a line
     while one rings); a stretch's first chord carries the progression's
     name; a chord changed just here wears a white corner; a chord still
     sounding where a row begins is named again in brackets
   • WHERE A BEAT IS — per visual row: the staff's own measurement (each
     column's centre, the offset walk — never getBoundingClientRect, a
     selected word is scaled), the pieces and rests the staff draws to
     finish a bar (its plan), and the row's end; a tick between two of
     those is placed proportionally — and back again: a point on the band
     is a tick (tickAtPoint), for taps, drags and drops
   • AFTER THE MELODY — the bars of chords past the last line, below it,
     four a row (eight on a wide stage), as a chord chart; + Add a line
     at its top (Edit); it folds to its title

   A BEAT AT A TIME (the user's overhaul, 2026-10-27). In Edit the band
   shows its beats (faint marks), and empty time a dashed +:
   • a tap puts THE CURSOR on the beat under it (an orange mark; the
     chord sounding there is selected and heard). A chord then — the
     panel, its keys — goes on that beat: on a chord's first beat it
     takes that chord's place, anywhere else it starts there and lasts to
     the next chord or the bar line (track.js putChord). ← → move the
     cursor a beat; ⇧← ⇧→ shorten / lengthen the chord; Delete takes it
     out; Enter or a double-click opens its window (its chord and its
     rhythm — progression-window.js THE CHORD ON THE MUSIC)
   • DRAG a chord to another beat (⌥ held when it is let go: a copy); its
     ENDS stretch it — over bar lines, over its neighbours, which give
     way; a chord dragged off the chord panel goes on the beat it is let
     go over (chord-strip.js → dropOver / dropAt)
   • in Perform a tap hears a chord; a double tap opens its window too
     (DECISIONS D12). Play starts from the cursor.
   • while it plays, the chord sounding lights (the player's
     'track:sounding'), and the chart's bars light and are followed

   API  SW.ctrack.draw() · schedule() · select(sel|null) · selected() ·
        selectedTick() · takesChord() · put(id, place) · keyDown(e) ·
        selectAtTick(tick) · playAtTick(tick) · capture(on) ·
        dropOver(x, y, step) · dropAt(x, y, step) · dropCancel()
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

  S.chordSel = null;           // { at } the beat the cursor is on (Edit): the chord sounding there is the one selected
  let timer = 0;
  let sounding = null;         // the at of the chord sounding (Play)
  let playingBar = null;       // the chart's bar sounding
  let folded = false;          // the chart folded to its title
  const geo = new Map();       // a line → { rows, pad } as last drawn: where each tick is (taps, drags, the cursor)
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

  /* beats: they fall from the first whole bar's line (a pick-up's are before it) */
  const beatFloor = (t, g) => Math.max(0, g.p0 + Math.floor((t - g.p0) / g.b) * g.b);
  const beatRound = (t, g) => Math.max(0, g.p0 + Math.round((t - g.p0) / g.b) * g.b);
  function where(t, g) {
    const bar = g.barAt(t);
    const beat = Math.round((1 + (t - g.T(bar)) / g.b) * 100) / 100;
    return (bar ? 'bar ' + bar : 'the pick-up') + ', beat ' + beat;
  }

  /* a row's tick ↔ x (in the line's own pixels) */
  function xAt(r, t) {
    const a = r.anchors;
    if (t <= a[0][0]) return a[0][1];
    for (let k = 1; k < a.length; k++) {
      if (t <= a[k][0]) {
        const [t0, x0] = a[k - 1], [t1, x1] = a[k];
        return t1 === t0 ? x1 : x0 + (x1 - x0) * (t - t0) / (t1 - t0);
      }
    }
    return a[a.length - 1][1];
  }
  function tickAtX(r, x) {
    const a = r.anchors;
    if (x <= a[0][1]) return a[0][0];
    for (let k = 1; k < a.length; k++) {
      if (x <= a[k][1]) {
        const [t0, x0] = a[k - 1], [t1, x1] = a[k];
        return x1 === x0 ? t1 : t0 + (t1 - t0) * (x - x0) / (x1 - x0);
      }
    }
    return a[a.length - 1][0];
  }
  /* the time under a point on the screen: a row of a line (the band over it, or anything
     under it down to the next row), or a bar of the chart; null elsewhere */
  function tickAtPoint(cx, cy) {
    const el = document.elementFromPoint(cx, cy);
    if (!el || !el.closest) return null;
    const cb = el.closest('.ct-bar');
    if (cb && tail && tail.contains(cb)) {
      const lane = cb.querySelector('.ct-lane');
      const r = lane.getBoundingClientRect();
      const g = T.grid(), b = Number(cb.dataset.bar);
      const a = Math.max(0, g.T(b)), z = g.T(b + 1);
      return Math.max(a, Math.min(z - 1, a + (cx - r.left) / Math.max(1, r.width) * (z - a)));
    }
    const line = el.closest('.notation-line');
    const G = line && geo.get(line);
    if (!G || !G.rows.length) return null;
    const lr = line.getBoundingClientRect();
    const lx = cx - lr.left - line.clientLeft, ly = cy - lr.top - line.clientTop;
    let row = G.rows[0];
    G.rows.forEach(r => { if (r.y - 12 <= ly) row = r; });
    const t = tickAtX(row, lx + G.pad);
    return Math.max(row.t0, Math.min(row.t1 - 1, t));
  }

  /* ================= DRAWING ================= */
  function schedule() { clearTimeout(timer); timer = setTimeout(draw, 30); }

  /* View → Chord track decides (2026-10-05) — in every workspace, Edit or
     not. The row takes room only with chords to show, or in Edit with the
     chord panel out (its + on empty time): a song with no chords looks
     as it always did. */
  function draw() {
    clearTimeout(timer);
    if (press && press.moved) return;                            // never under a drag: it comes round again when it ends
    const g = shown() ? T.grid() : null;
    const evs = g ? T.events(g) : [];
    const on = !!g && (evs.length > 0 || (canEdit() && !S.present && SW.settings.shows('strip')));
    // the chord row takes (or gives back) a row above every word: the staff was drawn without it
    if (document.body.classList.contains('show-ctrack') !== on && SW.staff && SW.staff.schedule) SW.staff.schedule();
    document.body.classList.toggle('show-ctrack', on);
    document.body.classList.toggle('ct-edit', on && canEdit() && !S.present);
    geo.clear();
    if (!on) {
      score.querySelectorAll('.notation-line > .ctrack').forEach(l => l.remove());
      if (tail) { tail.hidden = true; tail.innerHTML = ''; }
      return;
    }
    const list = T.shown(g);
    const firstOf = new Set();                                   // the first chord of each stretch: it carries the name
    list.forEach((r, i) => { const e = evs.find(x => x.stretch === i && x.id); if (e) firstOf.add(e); });
    const lastOf = new Map();                                    // the last chord of each stretch: an end stroke
    list.forEach((r, i) => { const es = evs.filter(x => x.stretch === i && x.id); if (es.length) lastOf.set(es[es.length - 1], true); });
    const ctx = { g, evs: evs.filter(e => e.id), list, firstOf, lastOf, bs: blockScale(), edit: canEdit() && !S.present };
    g.song.lines.forEach(le => drawLine(le, ctx));
    drawTail(ctx);
    paintSel();
  }

  /* the stretches of [a, z) no chord sounds in */
  function gapsIn(a, z, evs) {
    const out = [];
    let t = a;
    evs.filter(e => e.end > a && e.at < z).forEach(e => {
      if (e.at > t) out.push([t, e.at]);
      t = Math.max(t, e.end);
    });
    if (t < z) out.push([t, z]);
    return out;
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
      if (written) {
        // written: the bar line closing the row, where the staff draws it (staff.js renderRow:
        // the last column + its plan's endDx). The last word's edge stops short of it, and
        // squeezed the row's last beat to a sliver (the user, 2026-10-27)
        const endDx = last.info && last.info.endDx;
        xEnd = Math.max(endDx !== undefined ? last.cx + endDx - 2 : r.sylRight - 2, lastAnchor[1] + pad + 4);
      }
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
    geo.set(line, { rows: rows.filter(r => r.h), pad });
    // where a span of time is drawn in a row: from just before its first note to just before the next
    const left = (r, t) => xAt(r, t) - pad;
    const right = (r, t) => (t >= r.t1 ? r.xEnd - 2 : xAt(r, t) - pad - 3);

    let html = '';
    rows.forEach(r => {
      if (!r.h) return;
      const inRow = ctx.evs.filter(e => e.end > r.t0 && e.at < r.t1);
      inRow.forEach(e => {
        const st = Math.max(e.at, r.t0), en = Math.min(e.end, r.t1);
        const held = e.at < r.t0;
        const x1 = left(r, st), x2 = right(r, en);
        html += barHtml(e, ctx, {
          left: x1, top: r.y, width: Math.max(6, x2 - x1), height: r.h, held,
          tag: !held && ctx.firstOf.has(e) ? stretchName(ctx.list[e.stretch]) : '',
          end: en === e.end && ctx.lastOf.has(e),
          grips: ctx.edit ? { l: !held, r: en === e.end } : null,
          dots: spread(e.strikes.filter(k => k.at >= st && k.at < en).map(k => {
            const dx = xAt(r, k.at) - x1;                                   // under the note it is struck with
            const ex = Math.min(xAt(r, Math.min(k.at + k.len, en)) - x1 - 6, x2 - x1 - 4);
            return [dx, ex];
          }), x2 - x1)
        });
      });
      if (!ctx.edit) return;
      // empty time, bar by bar: a dashed + (a tap puts the cursor on the beat under it)
      for (let b = g.barAt(r.t0); g.T(b) < r.t1; b++) {
        const a = Math.max(0, g.T(b), r.t0), z = Math.min(g.T(b + 1), r.t1);
        if (z <= a) continue;
        gapsIn(a, z, ctx.evs).forEach(([s0, z0]) => {
          const x1 = left(r, s0), x2 = right(r, z0);
          if (x2 - x1 < 8) return;
          html += '<button type="button" class="cbar-add" data-a="' + s0 + '" data-z="' + z0 + '" style="left:' + x1.toFixed(1) + 'px;top:' + r.y + 'px;width:' + (x2 - x1).toFixed(1) + 'px;height:' + r.h + 'px" title="No chord here — tap a beat, then a chord (or drag one here from the panel); double-click to choose">' + (x2 - x1 >= 18 ? '+' : '') + '</button>';
        });
      }
      // its beats: faint marks along the band's foot (a bar line is the gap between bars)
      let marks = '';
      for (let t = beatFloor(r.t0, g) + g.b; t < r.t1; t += g.b) {
        if (((t - g.p0) % g.B + g.B) % g.B === 0) continue;
        marks += '<i style="left:' + (xAt(r, t) - pad - 1.5).toFixed(1) + 'px"></i>';
      }
      if (marks) html += '<span class="ct-beats" aria-hidden="true" style="top:' + r.y + 'px;height:' + r.h + 'px">' + marks + '</span>';
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
    const what = e.id ? (l.known ? l.name : e.id + ' (a chord the app cannot read)') : 'No chord';
    const title = what + (e.here ? ' — changed just here' : '') +
      (ctx.edit ? ' — drag it to another beat (⌥: a copy), its ends to stretch it; double-click for its chord and rhythm' : ' — double-click for its chord and rhythm');
    const grips = o.grips ? (o.grips.l ? '<span class="cb-grip l" data-grip="l" aria-hidden="true"></span>' : '') + (o.grips.r ? '<span class="cb-grip r" data-grip="r" aria-hidden="true"></span>' : '') : '';
    return '<button type="button" class="' + cls.join(' ') + '" data-at="' + e.at + '" data-end="' + e.end + '" style="' + pos + '--c:' + l.color + ';--cs:' + SW.ui.tint(l.color, 0.17) + ';--ck:' + ink + '" title="' + esc(title) + '">' +
      '<span class="cb-name">' + (o.held ? '(' + name + ')' : name) + '</span>' + dots +
      (o.tag ? '<span class="cb-tag">' + esc(o.tag) + ' ▸</span>' : '') + grips +
    '</button>';
  }

  /* ================= AFTER THE MELODY ================= */
  function drawTail(ctx) {
    if (!tail) return;
    const g = ctx.g;
    const trackLast = ctx.evs.length ? g.barAt(ctx.evs[ctx.evs.length - 1].end - 1) : 0;
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
        const pct = t => (t - a) / (z - a) * 100;
        html += '<div class="ct-bar' + (rowEnd ? ' row-end' : '') + (playingBar === b ? ' playing' : '') + '" data-bar="' + b + '">' +
          '<span class="ct-num">' + b + '</span>' +
          (tagE ? '<span class="ct-tag">' + esc(stretchName(ctx.list[tagE.stretch])) + ' ▸</span>' : '') +
          '<div class="ct-lane">';
        evs.forEach(e => {
          const st = Math.max(e.at, a), en = Math.min(e.end, z);
          html += barHtml(e, ctx, {
            pct: true, left: pct(st), width: Math.max(4, pct(en) - pct(st) - 1.2), held: e.at < a,
            end: en === e.end && ctx.lastOf.has(e),
            grips: ctx.edit ? { l: e.at >= a, r: en === e.end } : null,
            // dots in % of the chord's own bar, inside a small margin
            dots: e.strikes.filter(k => k.at >= st && k.at < en).map(k => [
              6 + (k.at - st) / (en - st) * 88,
              6 + (Math.min(k.at + k.len, en) - st) / (en - st) * 88 - 4
            ])
          });
        });
        if (ctx.edit) gapsIn(a, z, ctx.evs).forEach(([s0, z0]) => {
          html += '<button type="button" class="cbar-add in-chart" data-a="' + s0 + '" data-z="' + z0 + '" style="left:' + pct(s0).toFixed(2) + '%;width:' + Math.max(3, pct(z0) - pct(s0) - 1.2).toFixed(2) + '%" title="No chord here — tap a beat, then a chord">' + (z0 - s0 >= g.B / 2 ? '+' : '') + '</button>';
        });
        html += '</div></div>';
      }
      html += '</div>';
    }
    tail.innerHTML = html;
  }

  /* ================= THE CURSOR, HEARING, CHANGING ================= */
  /* the cursor's mark (in its row, or its bar of the chart) and the chord it is on */
  function paintSel() {
    document.querySelectorAll('.cbar.sel, .cbar-add.sel').forEach(b => b.classList.remove('sel'));
    document.querySelectorAll('.ct-cursor').forEach(c => c.remove());
    if (!S.chordSel) return;
    const t = S.chordSel.at;
    document.querySelectorAll('.cbar').forEach(b => { if (Number(b.dataset.at) <= t && t < Number(b.dataset.end)) b.classList.add('sel'); });
    document.querySelectorAll('.cbar-add').forEach(b => { if (Number(b.dataset.a) <= t && t < Number(b.dataset.z)) b.classList.add('sel'); });
    let put = false;
    geo.forEach((G, line) => {
      if (put) return;
      const r = G.rows.find(x => x.t0 <= t && t < x.t1);
      const layer = r && line.querySelector(':scope > .ctrack');
      if (!layer) return;
      layer.insertAdjacentHTML('beforeend', '<span class="ct-cursor" aria-hidden="true" style="left:' + (xAt(r, t) - G.pad - 1.5).toFixed(1) + 'px;top:' + (r.y - 4) + 'px;height:' + (r.h + 8) + 'px"></span>');
      put = true;
    });
    if (!put && tail) {
      const g = T.grid();
      const bar = tail.querySelector('.ct-bar[data-bar="' + g.barAt(t) + '"] .ct-lane');
      if (bar) {
        const a = Math.max(0, g.T(g.barAt(t))), z = g.T(g.barAt(t) + 1);
        bar.insertAdjacentHTML('beforeend', '<span class="ct-cursor" aria-hidden="true" style="left:calc(' + ((t - a) / (z - a) * 100).toFixed(2) + '% - 1.5px);top:-4px;bottom:-4px"></span>');
      }
    }
  }
  let holdSel = false;
  function setCursor(at) {
    if (at !== null && at !== undefined && !canEdit()) at = null;
    const was = S.chordSel;
    if (at !== null && at !== undefined && SW.score.getActiveNote()) {
      holdSel = true;
      SW.score.deselect();
      holdSel = false;
    }
    S.chordSel = at === null || at === undefined ? null : { at };
    paintSel();
    if ((was ? was.at : null) !== (S.chordSel ? S.chordSel.at : null)) SW.bus.emit('chordsel:changed', { sel: S.chordSel });
  }
  /* the old shape: { at } a chord, { bar } an empty bar */
  function select(sel) {
    if (!sel) { setCursor(null); return; }
    setCursor(sel.at !== undefined ? sel.at : Math.max(0, T.grid().T(sel.bar)));
  }
  const selected = () => S.chordSel;
  const selectedTick = () => (S.chordSel ? S.chordSel.at : null);
  function eventAt(tick) {
    return T.events().find(e => e.id && e.at <= tick && tick < e.end) || null;
  }
  function hear(e) {
    if (e && e.id && C.isKnown(e.id)) C.play(e.id, 'track');
  }
  function playAtTick(tick) { hear(eventAt(tick)); }
  /* Edit: the cursor on the beat at a tick (the chord there heard) */
  function selectAtTick(tick) {
    const g = T.grid();
    const e = eventAt(tick);
    setCursor(e ? Math.max(e.at, beatFloor(tick, g)) : beatFloor(tick, g));
    if (e) hear(e);
  }

  /* a chord key (or a block on the panel) with the cursor out: that chord on its beat */
  const takesChord = () => !!S.chordSel && canEdit() && shown();
  function put(id, place) {
    if (!takesChord()) return false;
    const step = { chord: id };
    if (place) step.place = place;
    T.putChord(S.chordSel.at, step);
    return true;
  }
  function scrollTo(at) {
    const b = Array.from(document.querySelectorAll('.cbar, .cbar-add')).find(x => {
      const a = Number(x.dataset.at !== undefined ? x.dataset.at : x.dataset.a), z = Number(x.dataset.end !== undefined ? x.dataset.end : x.dataset.z);
      return a <= at && at < z;
    });
    if (b && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function openHere(tick) {
    if (!SW.settings.can('chords') || !SW.progWin || !SW.progWin.openHere) return;
    SW.progWin.openHere(tick);
  }

  /* keys (app.js, after the keyboard's own): with the cursor out */
  function keyDown(e) {
    if (press && press.moved && e.key === 'Escape') { cancelPress(); return true; }
    if (!S.chordSel || !canEdit() || !shown()) return false;
    const g = T.grid();
    const t = S.chordSel.at;
    const pc = T.chordAt(t, g);
    switch (e.key) {
      case 'Delete': case 'Backspace': e.preventDefault(); if (pc) T.removeChord(pc.at); return true;
      case 'Enter': e.preventDefault(); openHere(t); return true;
      case 'Escape': setCursor(null); return true;
      case 'ArrowLeft': case 'ArrowRight': {
        e.preventDefault();
        const d = e.key === 'ArrowRight' ? 1 : -1;
        if (e.shiftKey) {                                   // the chord's end, a beat at a time
          if (pc) T.resizeChord(pc.at, pc.at, Math.max(pc.at + Math.min(g.b, pc.end - pc.at), beatRound(pc.end, g) + d * g.b));
          return true;
        }
        const limit = Math.max(g.total, T.end(g)) + g.B;
        const n = Math.max(0, Math.min(limit, (d > 0 ? beatFloor(t, g) + g.b : (t > beatFloor(t, g) ? beatFloor(t, g) : beatFloor(t, g) - g.b))));
        setCursor(n);
        const at = T.chordAt(n, g);
        if (at && at.at === n) hear(eventAt(n));
        scrollTo(n);
        return true;
      }
    }
    return false;
  }

  /* ================= GESTURES =================
     A press on a chord (or on empty time): let go where it went down, a
     tap; moved, in Edit, a drag — the chord to another beat, or one of its
     ends. Followed on the window (the band is drawn again under it). */
  let press = null;            // { id, x, y, btn, at, end, chord, kind: 'tap' | 'move' | 'l' | 'r', t, moved, target }
  let lastTap = null;
  let quietClick = 0;          // a drag just ended: the click that follows is not a tap
  function onDown(e) {
    const btn = e.target.closest('.cbar, .cbar-add');
    if (!btn) return;
    e.stopPropagation();
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const edit = canEdit() && shown();
    const isBar = btn.classList.contains('cbar');
    const grip = edit && isBar && e.target.closest('.cb-grip');
    const at = isBar ? Number(btn.dataset.at) : null;
    const ev = isBar ? T.events().find(x => x.at === at && x.id) : null;
    press = {
      id: e.pointerId, x: e.clientX, y: e.clientY, btn, at, end: isBar ? Number(btn.dataset.end) : null, chord: ev ? ev.id : null,
      kind: !edit || !ev ? 'tap' : grip ? grip.dataset.grip : 'move',
      t: tickAtPoint(e.clientX, e.clientY), moved: false, target: null, pointerType: e.pointerType
    };
    if (press.kind !== 'tap') e.preventDefault();          // no text selection, no scrolling under a finger
  }
  function onMove(e) {
    if (!press || e.pointerId !== press.id || press.kind === 'tap') return;
    if (!press.moved && Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6) return;
    press.moved = true;
    document.body.classList.add('ct-dragging');
    const g = T.grid();
    const t = tickAtPoint(e.clientX, e.clientY);
    clearGhosts();
    if (t === null) { press.target = null; tip(null); return; }
    let a, z;
    const len = press.end - press.at;
    const least = Math.min(g.b, len);                     // never shorter than a beat (or than it was)
    if (press.kind === 'move') {
      const grab = press.t !== null ? Math.max(0, Math.min(len - 1, press.t - press.at)) : 0;
      a = beatRound(t - grab, g);
      z = a + len;
    } else if (press.kind === 'r') { a = press.at; z = Math.max(press.at + least, beatRound(t, g)); }
    else { z = press.end; a = Math.min(press.end - least, beatRound(t, g)); }
    press.target = { a, z, copy: press.kind === 'move' && e.altKey };
    ghost(a, z, press.chord, press.target.copy);
    const name = look(press.chord).name;
    const beats = Math.round((z - a) / g.b * 100) / 100;
    tip(e, name + (press.target.copy ? ' — a copy' : '') + ' · ' + where(a, g) + ' · ' + beats + (beats === 1 ? ' beat' : ' beats'), press.target.copy);
  }
  function onUp(e) {
    if (!press || e.pointerId !== press.id) return;
    const p = press;
    press = null;
    document.body.classList.remove('ct-dragging');
    if (p.moved) {
      clearGhosts();
      tip(null);
      quietClick = performance.now();
      if (!p.target) { schedule(); return; }
      const copy = p.kind === 'move' && (e.altKey || p.target.copy);
      const pc = p.kind === 'move'
        ? (p.target.a !== p.at ? T.moveChord(p.at, p.target.a, copy) : null)
        : T.resizeChord(p.at, p.target.a, p.target.z);
      if (pc) setCursor(pc.at); else schedule();
      return;
    }
    onTap(p.btn, e, p);
  }
  function cancelPress() {
    if (!press) return;
    press = null;
    document.body.classList.remove('ct-dragging');
    clearGhosts();
    tip(null);
    schedule();
  }
  function onTap(btn, e, p) {
    const g = T.grid();
    const a0 = Number(btn.dataset.at !== undefined ? btn.dataset.at : btn.dataset.a);
    const t = p.t !== null ? p.t : a0;
    const beat = Math.max(a0, beatFloor(t, g));            // the beat under the tap (inside what was tapped)
    if (isDouble(btn, e)) { openHere(beat); return; }
    const ev = btn.classList.contains('cbar') ? T.events().find(x => x.at === a0 && x.id) : null;
    if (canEdit()) setCursor(beat);
    hear(ev);
  }
  /* a double tap (a finger, a pen) is the double-click; a mouse sends its own */
  function isDouble(btn, e) {
    if (e.pointerType === 'mouse' || !e.pointerType) return false;
    const now = performance.now();
    const key = btn.dataset.at || 'a' + btn.dataset.a;
    if (lastTap && lastTap.key === key && now - lastTap.t < 420) { lastTap = null; return true; }
    lastTap = { key, t: now };
    return false;
  }
  function handle(root) {
    // caught before the score's own handlers (which would find the nearest note)
    root.addEventListener('pointerdown', e => { if (e.target.closest('.cbar, .cbar-add')) onDown(e); }, true);
    root.addEventListener('pointerup', e => { if (e.target.closest('.cbar, .cbar-add')) e.stopPropagation(); }, true);
    root.addEventListener('click', e => { if (e.target.closest('.cbar, .cbar-add')) e.stopPropagation(); }, true);
    root.addEventListener('dblclick', e => {
      const btn = e.target.closest('.cbar, .cbar-add');
      if (!btn) return;
      e.stopPropagation();
      e.preventDefault();
      if (performance.now() - quietClick < 400) return;
      const g = T.grid();
      const a0 = Number(btn.dataset.at !== undefined ? btn.dataset.at : btn.dataset.a);
      const t = tickAtPoint(e.clientX, e.clientY);
      openHere(Math.max(a0, beatFloor(t !== null ? t : a0, g)));
    }, true);
  }
  // the window follows a press wherever it goes (it is caught first, before the score stops it)
  window.addEventListener('pointermove', onMove, true);
  window.addEventListener('pointerup', onUp, true);
  window.addEventListener('pointercancel', e => { if (press && e.pointerId === press.id) cancelPress(); }, true);
  // the click a drag ends with lands on whatever is under it (the score would select a note there)
  window.addEventListener('click', e => { if (performance.now() - quietClick < 350) { e.stopPropagation(); e.preventDefault(); quietClick = 0; } }, true);
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

  /* ---- where a dragged chord would go: a ghost over its beats, a word by the pointer ---- */
  function clearGhosts() {
    document.querySelectorAll('.ct-ghost').forEach(x => x.remove());
  }
  function ghost(a, z, id, copy) {
    const l = look(id);
    const style = '--c:' + l.color + ';--cs:' + SW.ui.tint(l.color, 0.3);
    const label = id ? C.labelHTML(l.name) : '';
    let named = false;
    geo.forEach((G, line) => {
      const layer = line.querySelector(':scope > .ctrack');
      if (!layer) return;
      G.rows.forEach(r => {
        const s = Math.max(a, r.t0), e = Math.min(z, r.t1);
        if (e <= s) return;
        const x1 = xAt(r, s) - G.pad, x2 = e >= r.t1 ? r.xEnd - 2 : xAt(r, e) - G.pad - 3;
        layer.insertAdjacentHTML('beforeend', '<span class="ct-ghost' + (copy ? ' copy' : '') + '" style="' + style + ';left:' + x1.toFixed(1) + 'px;top:' + r.y + 'px;width:' + Math.max(6, x2 - x1).toFixed(1) + 'px;height:' + r.h + 'px">' + (named ? '' : label) + '</span>');
        named = true;
      });
    });
    if (!tail) return;
    const g = T.grid();
    tail.querySelectorAll('.ct-bar').forEach(bar => {
      const b = Number(bar.dataset.bar);
      const A = Math.max(0, g.T(b)), Z = g.T(b + 1);
      const s = Math.max(a, A), e = Math.min(z, Z);
      if (e <= s) return;
      const pct = t => (t - A) / (Z - A) * 100;
      bar.querySelector('.ct-lane').insertAdjacentHTML('beforeend', '<span class="ct-ghost' + (copy ? ' copy' : '') + '" style="' + style + ';left:' + pct(s).toFixed(2) + '%;width:' + Math.max(3, pct(e) - pct(s) - 1.2).toFixed(2) + '%;top:0;bottom:0">' + (named ? '' : label) + '</span>');
      named = true;
    });
  }
  let tipEl = null;
  function tip(e, text, copy) {
    if (!e || !text) { if (tipEl) tipEl.hidden = true; return; }
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.className = 'ct-tip';
      document.body.appendChild(tipEl);
    }
    tipEl.hidden = false;
    tipEl.classList.toggle('copy', !!copy);
    tipEl.innerHTML = C.labelHTML(text);
    tipEl.style.left = Math.min(window.innerWidth - 220, e.clientX + 14) + 'px';
    tipEl.style.top = Math.max(4, e.clientY - 38) + 'px';
  }

  /* ---- a chord dragged off the chord panel (chord-strip.js) ---- */
  function dropOver(x, y, step) {
    clearGhosts();
    if (!canEdit() || !shown() || !step || !step.chord) { tip(null); return false; }
    const t = tickAtPoint(x, y);
    if (t === null) { tip(null); return false; }
    const g = T.grid();
    const sp = T.putSpan(beatFloor(t, g));
    document.body.classList.add('ct-dragging');
    ghost(sp.at, sp.end, step.chord, false);
    tip({ clientX: x, clientY: y }, look(step.chord).name + (sp.on ? ' — in place of ' + look(sp.on.chord).name : '') + ' · ' + where(sp.at, g));
    return true;
  }
  function dropAt(x, y, step) {
    const ok = dropOver(x, y, step);
    const t = ok ? tickAtPoint(x, y) : null;
    dropCancel();
    if (t === null) return false;
    const pc = T.putChord(beatFloor(t, T.grid()), step);
    if (pc) setCursor(pc.at);
    return true;
  }
  function dropCancel() {
    document.body.classList.remove('ct-dragging');
    clearGhosts();
    tip(null);
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
    if (!d || !d.sounded || !d.stack || S.playing) return;
    if (!SW.settings.view.laneChordsPlay) return;               // Sound → Chords: heard whether the track shows or not
    const firstCol = d.syllable && d.syllable.querySelector('.harmony-stack') === d.stack;
    if (!firstCol) return;
    const song = SW.timing.song();
    let at = null;
    song.lines.some(le => le.events.some(ev => { if (ev.stack === d.stack) { at = le.at + ev.start; return true; } return false; }));
    if (at === null) return;
    const e = T.events().find(x => x.at === at && x.id);
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

  SW.ctrack = { draw, schedule, select, selected, selectedTick, takesChord, put, keyDown, selectAtTick, playAtTick, capture, dropOver, dropAt, dropCancel };
  schedule();
})();

/* ==========================================================================
   COMPONENT — the other parts beside the page's rows (2026-11-03)
                                                               .part-row
   --------------------------------------------------------------------------
   PARTS (js/parts.js): the page shows one part; this draws the OTHERS
   round it, bar for bar, in the song's order — Part 1 on top, Part 2
   under it, whichever is on the page — at the page's own size, on the
   Notation page. (The Rhythm page does the same in its own
   idiom: rhythm-page.js PARTS.)

   NOTATION — THE JOINT PLAN. The staff engraver (js/staff.js planJoint)
   decides a line's rows and the width of every bar from all the parts at
   once, and places every part's columns inside those bars. So the picture
   is the same whichever part is on the page, and this file only draws:
   render() calls place() once the rows are decided and before anything
   is measured — a .part-row band (a full-width flex item, its height
   known) before each page row for the parts above the page's part, after
   it for the parts below, and whole rows at the line's end for rows the
   page's part has no syllable in (it is all rests there) — then draw()
   fills each band from the plan with the engraver's own drawing
   (SW.staff.kit): clef, key and time signatures, heads in their colours,
   stems, flags, beams, dots, accidentals, ties, rests, the words under
   (no part name — the system line, systems(), joins each row's staves).
   A tap on a drawn note puts that part on the page with that note
   selected (SW.parts.focus(i, { at })); the player lights the drawn note
   ('part:sounding').

   PITCH — NOT DRAWN THERE (later the same day, the user: it showed Part 1
   as a mini thing over the page). The Pitch page has no plan (a line of
   blocks wraps where the browser puts it), so the other parts' blocks
   could only be squeezed between the page's columns. active() keeps the
   bands off it; the block drawing below (blockBand, by the ticks of the
   measured columns) still serves a Notation line with no joint plan, and
   is the start for a Pitch layout of its own. An instrumental line gets
   no band at all (no part has anything on it).

   The bands hold nothing the editor reads (no .syllable, .harmony-stack
   or .note), so every selector in score.js, flow.js and the chord track
   looks straight past them; the engraver re-places them on every draw.

   API  SW.partRows.place(lines) · draw() — called by staff.js render
        SW.partRows.systemOf(syllable) — the system's top/bottom (score.js follows it when playing)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;
  const score = document.getElementById('score');
  if (!score) return;

  const n2 = v => Number(Number(v).toFixed(2));
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const kit = () => SW.staff.kit;
  const page = () => (document.body.classList.contains('page-rhythm') ? 'rhythm' : document.body.classList.contains('show-staff') ? 'notation' : 'pitch');
  /* Notation only (2026-11-03, later: the user did not want Part 1 drawn
     small over the Pitch page — its blocks were squeezed into the page's
     part's columns). The Pitch page shows the part on it alone, until it
     has a plan of its own to lay every part out at full size. */
  const active = () => !!(SW.parts && SW.parts.count() > 1 && page() === 'notation' && SW.staff && SW.staff.available && kit());
  const WORDS = bs => Math.round(22 * bs) + 8;
  /* one part's band: the page's own room for a staff (staff.js staffTop), low notes, and its words */
  function bandH(bs) {
    const K = kit();
    const key = SW.keys ? SW.keys.here() : S.key;
    return page() === 'notation' ? Math.round(K.staffTop(bs, key) + 12 * bs + WORDS(bs)) : Math.round(8 * bs + 200 * bs + WORDS(bs));
  }
  function make(h, data) {
    const d = document.createElement('div');
    d.className = 'part-row';
    d.style.height = h + 'px';
    Object.keys(data || {}).forEach(k => { d.dataset[k] = data[k]; });
    return d;
  }
  /* the parts drawn round the page's: those turned on (parts.js SHOWN), in the song's order */
  const order = () => { const f = SW.parts.focused(), all = SW.parts.shownParts(); return { f, above: all.filter(i => i < f), below: all.filter(i => i > f), all }; };
  /* THE WORDS AS THE PAGE HAS THEM (later the same day, the user: the
     other part's words came out smaller and looked wrong, then right once
     that part was on the page). They are the page's lyrics: the font of
     the page's .text (Look → lyric font and Text size included), centred
     as far from the bar base (the stack's foot, which the staff hangs
     from — staff.js geometry) as the page's own are. Read from a page
     syllable on each draw; the stand-ins before there is one. */
  function lyricLook(bs) {
    const syl = score.querySelector('.notation-line.has-staff > .syllable');
    const t = syl && syl.querySelector('.text');
    const st = syl && syl.querySelector('.harmony-stack');
    if (!t || !st) return { font: '600 ' + Math.round(22 * bs) + 'px sans-serif', colour: '#333', dy: -25 * bs };
    const cs = getComputedStyle(t);
    const tr = t.getBoundingClientRect(), sr = st.getBoundingClientRect();
    return { font: cs.font, colour: cs.color, dy: (tr.top + tr.bottom) / 2 - sr.bottom };
  }

  /* ---------------- the bands, before the page is measured ---------------- */
  function place(lines) {
    score.querySelectorAll('.part-row, .part-system').forEach(el => el.remove());
    score.querySelectorAll('.notation-line.chords-above').forEach(l => l.classList.remove('chords-above'));
    const tail = score.querySelector(':scope > .part-tail');
    if (tail) tail.remove();
    if (!active()) return;
    const bs = kit().blockScale();
    const H = bandH(bs);
    const { above, below, all } = order();
    lines.forEach(line => {
      const plan = SW.staff.plan(line);
      const joint = plan && plan.joint && line.classList.contains('has-staff') ? plan.joint : null;
      /* An instrumental line (an Intro, an Interlude): no part has anything
         on it (every part's entry is { syllables: [] }), so no band — it
         stays the chords' row of bars, as with one part. (Until 2026-11-03 a
         band drew each other part's empty bars here, labelled "Part n".) */
      if (SW.timing.barsOf(line)) return;
      const syls = Array.from(line.querySelectorAll(':scope > .syllable'));
      if (!syls.length) return;
      // the page's rows: the syllables that start them
      let starts;
      if (joint) starts = [syls[0]].concat(plan.breaks);
      else {
        const tops = syls.map(sy => sy.offsetTop);
        starts = syls.filter((sy, i) => !i || tops[i] > tops[i - 1] + 4);
      }
      const pageRows = joint ? joint.rows.filter(r => r.hasPage) : null;
      // THE CHORDS ON TOP (the user: always at the top, whichever part is on the page): with a part drawn
      // over the page's, the page's chord row folds away (style.css .chords-above) and the band over
      // each row keeps the room for it instead, at its top (chord-track.js draws the chords there)
      const chordsOver = !!joint && above.length > 0;
      line.classList.toggle('chords-above', chordsOver);
      const chordH = chordsOver && document.body.classList.contains('show-ctrack') ? chordRow() : 0;
      // NOTATION: the page's rows measured (slotOf) before any band goes in; each part's staff in a band takes
      // the room it would have on the page (partSlot) — so a part sits the same on the page or off it
      const f = SW.parts.focused();
      const refs = joint ? starts.map((syl, ri) => {
        const m = slotOf(syls.slice(syls.indexOf(syl), starts[ri + 1] ? syls.indexOf(starts[ri + 1]) : syls.length));
        const room = pageRows[ri] && pageRows[ri].room ? pageRows[ri].room[f] : null;
        return m && room ? Object.assign(m, { room }) : null;
      }) : [];
      const sized = (parts, ref, jr, data, top) => {
        const slots = ref && jr && jr.room ? parts.map(i => partSlot(ref, jr.room[i])) : null;
        if (!slots || slots.some(x => !x)) return make(parts.length * H + 2, data);
        const total = slots.reduce((a, x) => a + x.h, 0);
        return make((top || 0) + total, Object.assign(data, { chord: n2(top || 0), slots: JSON.stringify(slots.map(x => ({ h: n2(x.h), base: n2(x.base), dy: n2(x.dy) }))) }));
      };
      starts.forEach((syl, ri) => {
        const r = joint ? (pageRows[ri] ? pageRows[ri].r : ri) : ri;
        const jr = joint ? joint.rows[r] : null;
        if (above.length) syl.before(sized(above, refs[ri], jr, { side: 'above', row: r }, chordH));
        if (below.length) {
          const next = starts[ri + 1];
          const band = sized(below, refs[ri], jr, { side: 'below', row: r });
          if (next) { const br = next.previousElementSibling; (br && br.classList.contains('row-break') ? br : next).before(band); } else line.appendChild(band);
        }
      });
      if (joint) joint.rows.filter(r => !r.hasPage).forEach(jr => line.appendChild(sized(all, refs[0], jr, { side: 'full', row: jr.r })));
    });
  }

  /* A page row, measured (later the same day, the user: switching parts
     made the staves jump — the page's row had more room round its staff
     than a band). The row's height (its syllables' margin boxes: a flex
     line of the line), where the bar base falls in it (a stack's foot: the
     staff hangs from it, staff.js geometry) and where the words' middle
     falls from the base. */
  function slotOf(rowSyls) {
    let top = Infinity, bottom = -Infinity;
    rowSyls.forEach(sy => {
      const r = sy.getBoundingClientRect(), cs = getComputedStyle(sy);
      top = Math.min(top, r.top - (parseFloat(cs.marginTop) || 0));
      bottom = Math.max(bottom, r.bottom + (parseFloat(cs.marginBottom) || 0));
    });
    const withText = rowSyls.find(sy => sy.querySelector('.text') && sy.querySelector('.harmony-stack')) || rowSyls[0];
    const st = withText && withText.querySelector('.harmony-stack');
    const t = withText && withText.querySelector('.text');
    if (!st || !isFinite(top)) return null;
    const base = st.getBoundingClientRect().bottom;
    const tr = t ? t.getBoundingClientRect() : null;
    // the chord row at the row's top is the system's, not the part's: a part's staff is the row without it
    const cs = withText.querySelector('.chord-slot');
    const ch = cs ? cs.getBoundingClientRect().height : 0;
    return { h: bottom - top - ch, base: base - top - ch, dy: tr ? (tr.top + tr.bottom) / 2 - base : -25 };
  }
  /* the chord row's height: style.css body.show-ctrack .chord-slot (32 px × the text size) */
  function chordRow() {
    const ts = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--text-scale')) || 1;
    return 32 * ts;
  }
  /* A part's staff as the page would hold it (then the user: one part's
     low notes must not push another part's words down). The joint plan
     gives every part its own ROOM in each row by its own notes (staff.js
     roomOf: `above` — what its notes take over the bar base — and `drop`
     — how far its words go under the 8·bs the CSS keeps); a page row is
     the CSS's sum of those and parts that never change, so from the
     measured row (ref, with the page part's room) a part's row is the
     same less the page's room and plus its own. Every part sits on the
     page exactly as it sat in its band, so nothing moves on a switch. */
  function partSlot(ref, room) {
    if (!ref || !room) return null;
    const dA = room.above - ref.room.above, dD = room.drop - ref.room.drop;
    return { h: ref.h + dA + dD, base: ref.base + dA, dy: ref.dy + dD };
  }

  /* ---------------- drawing ---------------- */
  function draw() {
    if (!active()) return;
    const K = kit();
    const bs = K.blockScale();
    const idiom = page();
    const sg = SW.timing.song();
    const { f, above, below, all } = order();
    sg.lines.forEach((le, lineIndex) => {
      const line = le.line;
      const bands = Array.from(line.querySelectorAll(':scope > .part-row'));
      if (!bands.length) return;
      const plan = SW.staff.plan(line);
      const joint = plan && plan.joint && line.classList.contains('has-staff') ? plan.joint : null;
      const cs = getComputedStyle(line);
      const padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0;
      const W = line.clientWidth;
      const prefixW = parseFloat(line.style.getPropertyValue('--staff-prefix')) || 0;
      if (joint) {
        const H = bandH(bs);
        const look = lyricLook(bs);
        bands.forEach(band => {
          const jr = joint.rows[Number(band.dataset.row)];
          if (!jr) return;
          const parts = band.dataset.side === 'above' ? above : band.dataset.side === 'below' ? below : all;
          // each part's staff in its own room (place: partSlot); without them, the stand-in room
          const slots = band.dataset.slots ? JSON.parse(band.dataset.slots) : null;
          let y = slots ? Number(band.dataset.chord) || 0 : 2;          // under the chords' room, when the band holds it
          // a band is a flex item of the line's content box: x = 0 is where the page's columns start (after the clef room)
          const svg = parts.map((i, k) => {
            const slot = slots ? slots[k] : null;
            const h = slot ? slot.h : H;
            const out = M.withClef(SW.parts.clef(i), () => jointBand(jr, i, i === f, y, h, bs, { prefixW, lineIndex, look, slot }));   // each staff in its part's clef
            y += h;
            return out;
          }).join('');
          band.innerHTML = '<svg class="pr-svg" width="' + n2(W - padL - padR) + '" height="' + n2(y + 4) + '">' + svg + '</svg>';
          band.dataset.parts = parts.join(',');
        });
        systems(line, joint, bs);
        return;
      }
      // PITCH (no plan): the page's columns, measured, give the ticks their x
      if (le.bars) { plainBands(le, bands, bs, idiom, { padL, padR, W }); return; }
      const groups = [];
      le.events.forEach(ev => {
        const o = K.offsetIn(ev.stack, line);
        ev.x = o.x + ev.stack.offsetWidth / 2;
        ev.left = o.x;
        ev.right = o.x + ev.stack.offsetWidth;
        ev.base = Math.round(o.y + ev.stack.offsetHeight);
        let gr = groups.find(r => Math.abs(r.base - ev.base) <= 2);
        if (!gr) { gr = { base: ev.base, events: [] }; groups.push(gr); }
        gr.events.push(ev);
      });
      groups.sort((a, b) => a.base - b.base);
      groups.forEach((gr, gi) => {
        const row = rowOf(le, gr, gi === groups.length - 1, bs, { padL, padR, W });
        row.anchors.forEach(a => { a.x -= padL; });
        row.barX.forEach((v, t) => row.barX.set(t, v - padL));
        row.xStart -= padL; row.xEnd -= padL; row.W = W - padL - padR;
        bands.filter(b => Number(b.dataset.row) === gi).forEach(band => {
          renderPlain(row, band, band.dataset.side === 'above' ? above : below, bs);
        });
      });
    });
  }

  /* ================= NOTATION: THE SYSTEM LINE =================
     (later the same day, the user: "a grand staff … right before the treble
     clef, a line sort of like a measure line, but it stretches from the top
     line of part one to the bottom line of part whatever is the last").
     Each row of the joint plan is a SYSTEM — the page's staff and the
     bands' staves for the same bars — and a thin bar line joins them at
     the staves' left edge, from the top line of the highest staff to the
     bottom line of the lowest. Read from the staff lines as drawn (the
     page's in .staff-svg, five a row, one row for each row the page has a
     syllable in; the bands' five a part), so it meets them exactly; a
     system of one staff has none. An absolute .part-system in the line —
     nothing the editor reads — made again on every draw. */
  function systems(line, joint, bs) {
    line.querySelectorAll(':scope > .part-system').forEach(el => el.remove());
    const K = kit();
    const lr = line.getBoundingClientRect();
    const byRow = new Map();
    const add = (r, rects) => { if (!byRow.has(r)) byRow.set(r, []); byRow.get(r).push(...rects); };
    const pageSl = Array.from(line.querySelectorAll('.staff-svg .sl')).map(el => el.getBoundingClientRect());
    const pageRows = joint.rows.filter(r => r.hasPage);
    if (pageSl.length === pageRows.length * 5) pageRows.forEach((jr, ri) => add(jr.r, pageSl.slice(ri * 5, ri * 5 + 5)));
    line.querySelectorAll(':scope > .part-row').forEach(band => add(Number(band.dataset.row), Array.from(band.querySelectorAll('.sl')).map(el => el.getBoundingClientRect())));
    const w = Math.max(1, K.SS_PX * bs * K.E.thinBar);
    byRow.forEach(rects => {
      if (rects.length < 10) return;                  // one staff: no system to join
      const top = Math.min(...rects.map(r => r.top)), bottom = Math.max(...rects.map(r => r.bottom));
      const left = Math.min(...rects.map(r => r.left));
      const d = document.createElement('div');
      d.className = 'part-system';
      d.style.cssText = 'left:' + n2(left - lr.left) + 'px;top:' + n2(top - lr.top) + 'px;width:' + n2(w) + 'px;height:' + n2(bottom - top) + 'px';
      line.appendChild(d);
    });
  }

  /* ================= NOTATION: a part's band from the joint plan ================= */
  function jointBand(jr, part, isPage, y0, H, bs, o) {
    const K = kit();
    const s = K.SS_PX * bs, k = s / K.UNITS;
    const key = SW.keys ? SW.keys.atTick(jr.bars[0].t0) : S.key;
    const base = y0 + (o.slot ? o.slot.base : K.staffTop(bs, key) + 4 * bs);
    const g = K.geometry(base, bs, key);
    const { yOf } = g;
    const lineW = Math.max(1, s * K.E.staffLine);
    const left = -o.prefixW;                       // the staff starts where the page's does: in the clef room, before the content box
    const cx = x => x;
    const out = [];
    // no name over the staff (the user: it hid under the notes and jumped from staff to staff on a focus — the system line says which goes with which)
    for (let i = 0; i < 5; i++) out.push(K.rect(left, yOf(K.E4 + 2 * i) - lineW / 2, cx(jr.end) - left, lineW, K.INK, ' class="sl"'));
    const pre = K.prefix(s, o.lineIndex === 0 && jr.r === 0, key);
    out.push(K.clefInk(pre, left, yOf, k, part));
    pre.sig.forEach(a => out.push(K.at(a.name, left + a.x, yOf(a.st), k)));
    if (pre.time) {
      const t = pre.time, tx = left + t.x;
      const numeral = (list, y, aboveLine) => { let x = tx + (t.w - t.widthOf(list)) / 2; list.forEach(gl => { out.push(K.boxAt(gl, x, aboveLine ? y - K.gh(gl, k) : y, k)); x += K.gw(gl, k); }); };
      numeral(t.top, yOf(K.B4), true);
      numeral(t.bot, yOf(K.B4), false);
    }
    const barLine = x => K.rect(x - s * K.E.thinBar / 2, yOf(K.F5) - lineW / 2, s * K.E.thinBar, yOf(K.E4) - yOf(K.F5) + lineW, K.INK);
    jr.barLines.forEach(bx => out.push(barLine(cx(bx))));
    if (jr.endBar) {
      if (jr.final) {
        const thick = s * K.E.thickBar;
        out.push(K.rect(cx(jr.end) - thick, yOf(K.F5) - lineW / 2, thick, yOf(K.E4) - yOf(K.F5) + lineW, K.INK));
        out.push(barLine(cx(jr.end) - thick - s * K.E.barSep - s * K.E.thinBar / 2));
      } else out.push(barLine(cx(jr.end) - s * K.E.thinBar / 2));
    }
    // the part's columns, placed by the plan; each drawn as the engraver draws the page's
    const placed = jr.placed[part] || [];
    const evs = placed.map(q => { const c = q.c; c.x = cx(q.x); c.info = c; return c; });
    const noNames = { showNames: false };
    const look = o.look;
    const wordY = base + (o.slot ? o.slot.dy : look.dy);
    const wordAttr = 'class="pr-word" text-anchor="middle" dominant-baseline="central" style="font:' + esc(look.font) + '" fill="' + esc(look.colour) + '"';
    const fillerOpacity = S.editing && isPage ? 0.38 : 1;
    const beamGroups = {};
    evs.forEach(c => { if (c.notated && !c.rest && c.beam !== null && c.beam !== undefined) (beamGroups[c.beam] = beamGroups[c.beam] || []).push(c); });
    Object.keys(beamGroups).forEach(id => { if (beamGroups[id].length < 2) { beamGroups[id][0].beam = null; delete beamGroups[id]; } });
    const bits = [];
    evs.forEach(c => {
      let ink = '';
      if (c.rest) {
        // a whole rest sits in the middle of its bar
        if (c.value.base === 'w') { const sp = jr.bars.find(b => b.b === c.bar); if (sp) c.x = cx((sp.x0 + sp.x1) / 2); }
        ink = K.drawRest(c, g, noNames);
        if (c.standalone && fillerOpacity < 1) ink = '<g class="filler-rest" opacity="' + fillerOpacity + '">' + ink + '</g>';
      } else ink = K.drawNote(c, g, noNames);
      bits.push({ c, ink });
    });
    Object.keys(beamGroups).forEach(id => out.push(K.drawBeam(beamGroups[id], g)));
    // ties: a note drawn in pieces to its pieces, and a tied note to the next
    evs.forEach((c, i) => {
      const nx = evs[i + 1];
      if (!nx || c.rest || nx.rest) return;
      const owner = c.piece ? c.owner : c;
      if (nx.piece && nx.owner === owner) { out.push(K.drawTies(Object.assign({}, c, { tiePitches: owner.pitches }), nx, g)); return; }
      const lastOf = !c.piece ? !(owner.pieces && owner.pieces.length) : c === owner.pieces[owner.pieces.length - 1];
      if (!nx.piece && owner.tieNext && lastOf) out.push(K.drawTies(Object.assign({}, c, { tiePitches: owner.tiePitches || owner.pitches }), nx, g));
    });
    bits.forEach(b => {
      const c = b.c;
      let ink = b.ink;
      if (!c.rest) ink += K.drawHeads(c, g, noNames);
      if (c.word) ink += K.text(c.x, wordY, Math.max(12, 20 * bs), esc(c.word.text) + (c.hy ? '-' : ''), wordAttr);
      const at = c.piece ? c.owner.at : c.at;
      out.push('<g class="pr-ev' + (c.standalone ? ' pr-filler' : '') + '" data-part="' + part + '" data-at="' + (at === undefined ? '' : at) + '">' + ink + '</g>');
    });
    return out.join('');
  }

  /* ================= PITCH: the page's columns give the ticks their x ================= */
  function interp(row, t) {
    const a = row.anchors;
    if (t <= a[0].t) return a[0].x;
    for (let i = 1; i < a.length; i++) {
      if (t <= a[i].t) {
        const p = a[i - 1], q = a[i];
        return q.t === p.t ? q.x : p.x + (t - p.t) / (q.t - p.t) * (q.x - p.x);
      }
    }
    return a[a.length - 1].x;
  }
  const barXOf = (row, t) => (row.barX.has(t) ? row.barX.get(t) : interp(row, t));
  function finish(row) {
    row.anchors.sort((a, b) => a.t - b.t);
    row.anchors = row.anchors.filter((a, i, all) => !i || a.t !== all[i - 1].t);
    row.bars = Array.from(new Set(row.bars)).sort((a, b) => a - b).filter(t => t >= row.T0 && t <= row.T1);
    const bounds = Array.from(new Set([row.T0].concat(row.bars, [row.T1]))).sort((a, b) => a - b);
    row.spans = [];
    for (let i = 1; i < bounds.length; i++) row.spans.push({ t0: bounds[i - 1], t1: bounds[i] });
    return row;
  }
  function rowOf(le, g, lastRow, bs, o) {
    const evs = g.events, first = evs[0], last = evs[evs.length - 1];
    const B = le.meter.barTicks;
    const anchors = [], bars = [], barX = new Map();
    const startsBar = first.start === le.barStart(first.bar);
    const T0 = le.at + (startsBar ? le.barStart(first.bar) : first.start);
    anchors.push({ t: T0, x: first.left });
    if (startsBar) bars.push(T0);
    evs.forEach((ev, i) => {
      anchors.push({ t: ev.at, x: ev.left });
      if (i && ev.start === le.barStart(ev.bar)) { bars.push(ev.at); barX.set(ev.at, (evs[i - 1].right + ev.left) / 2); }
    });
    let T1 = le.at + last.end, xEnd = last.right;
    if (lastRow && le.padded > last.end) {
      const rate = (last.right - first.left) / Math.max(1, (le.at + last.end) - T0);
      xEnd = Math.min(o.W - o.padR, last.right + rate * (le.padded - last.end));
      T1 = le.at + le.padded;
    }
    const endBar = (T1 - le.at + le.shift) % B === 0;
    anchors.push({ t: T1, x: xEnd });
    if (endBar) { bars.push(T1); barX.set(T1, xEnd); }
    return finish({ T0, T1, anchors, bars, barX, xStart: Math.max(4, first.left - 8 * bs), xEnd, endBar, W: o.W });
  }
  /* the other parts' events, read once a song version */
  let cache = null;
  ['score:changed', 'score:loaded', 'key:changed', 'meter:changed', 'scale:changed'].forEach(evt => SW.bus.on(evt, () => { cache = null; }));
  function partEvents(i) {
    if (cache && cache.focused !== SW.parts.focused()) cache = null;
    if (!cache) cache = { focused: SW.parts.focused(), parts: new Map() };
    if (!cache.parts.has(i)) {
      const sg = SW.parts.song(i);
      const evs = [];
      sg.lines.forEach(le => {
        le.events.forEach(ev => { ev.le = le; evs.push(ev); });
        SW.timing.fillPieces(le).forEach(pc => evs.push({ filler: true, rest: true, at: le.at + pc.start, ticks: pc.ticks, value: SW.values.byId(pc.id), pitches: [], le, word: null }));
      });
      evs.sort((a, b) => a.at - b.at);
      cache.parts.set(i, evs);
    }
    return cache.parts.get(i);
  }
  function plainBands(le, bands, bs, idiom, o) {
    const B = le.meter.barTicks;
    const T0 = le.at, T1 = le.at + le.padded;
    const x0 = 44, xEnd = o.W - o.padL - o.padR - 10;
    const bars = [], barX = new Map();
    for (let t = T0 + B; t < T1; t += B) { bars.push(t); barX.set(t, x0 + (xEnd - x0) * (t - T0) / (T1 - T0)); }
    bars.push(T1); barX.set(T1, xEnd);
    const row = finish({ T0, T1, anchors: [{ t: T0, x: x0 }, { t: T1, x: xEnd }], bars, barX, xStart: 0, xEnd, endBar: true, W: o.W - o.padL - o.padR });
    const { above, below } = order();
    bands.forEach(band => renderPlain(row, band, above.concat(below), bs));
  }
  function renderPlain(row, band, parts, bs) {
    const H = bandH(bs);
    const svg = parts.map((i, k) => blockBand(row, i, k * H + 2, H, bs)).join('');
    band.innerHTML = '<svg class="pr-svg" width="' + n2(row.W) + '" height="' + (parts.length * H + 4) + '">' + svg + '</svg>';
    band.dataset.parts = parts.join(',');
  }
  function blockBand(row, part, y0, H, bs) {
    const K = kit();
    const evs = partEvents(part);
    const base = y0 + H - WORDS(bs) - 2;
    const out = [];
    out.push(K.text(row.xStart + 2, y0 + 11, 11, esc(SW.parts.label(part)), 'class="pr-label" font-weight="800" fill="#9487A2"'));
    const barLine = x => K.rect(x - 0.5, y0 + 14, 1, base - y0 - 14, '#B5ABBE');
    row.bars.forEach(t => { if (t > row.T0 && t < row.T1) out.push(barLine(barXOf(row, t) - 2 * bs)); });
    if (row.endBar) out.push(barLine(row.xEnd + 2 * bs));
    const wordY = base + Math.max(12, 20 * bs);
    evs.filter(ev => ev.at >= row.T0 && ev.at < row.T1).forEach(ev => {
      const x = interp(row, ev.at);
      const w = Math.max(10 * bs, Math.min(32 * bs, interp(row, ev.at + ev.ticks) - x - 4 * bs));
      let ink = '';
      if (ev.rest) ink = '<rect x="' + n2(x) + '" y="' + n2(base - 8 * bs) + '" width="' + n2(w) + '" height="' + n2(8 * bs) + '" rx="3" fill="none" stroke="#B5ABBE" stroke-dasharray="3 2"/>';
      else ev.pitches.forEach(pt => {
        const h = Math.max(3, (M.NOTE_HEIGHTS[pt.nc] || 60) * bs);
        ink += '<rect class="pm-block" x="' + n2(x) + '" y="' + n2(base - h) + '" width="' + n2(w) + '" height="' + n2(h) + '" rx="4" fill="' + pt.color + '"/>';
      });
      if (ev.word) ink += K.text(x + w / 2, wordY, Math.max(12, 20 * bs), esc(ev.word.text) + (ev.word.hy ? '-' : ''), 'class="pr-word" text-anchor="middle" font-weight="600" fill="#2B1D38"');
      out.push('<g class="pr-ev" data-part="' + part + '" data-at="' + ev.at + '">' + ink + '</g>');
    });
    // a bar the part has nothing in: a whole rest in its middle
    const s = 16 * bs, k = s / K.UNITS;
    row.spans.filter(sp => !evs.some(ev => (ev.at >= sp.t0 && ev.at < sp.t1) || (ev.at < sp.t0 && ev.at + (ev.ticks || 0) > sp.t0))).forEach(sp => {
      const cxm = (barXOf(row, sp.t0) + barXOf(row, sp.t1)) / 2;
      out.push(K.at('restWhole', cxm - K.gw('restWhole', k) / 2 - K.gx0('restWhole', k), base - 10 * bs, k, 'class="pr-rest" fill="#8A7F99"'));
    });
    return out.join('');
  }

  /* ---------------- lights, taps ---------------- */
  SW.bus.on('part:sounding', d => {
    if (!d) return;
    score.querySelectorAll('.pr-ev.sounding[data-part="' + d.part + '"]').forEach(el => el.classList.remove('sounding'));
    if (d.rest) return;
    score.querySelectorAll('.pr-ev[data-part="' + d.part + '"][data-at="' + d.at + '"]').forEach(el => el.classList.add('sounding'));
  });
  SW.bus.on('play:changed', d => {
    if (d && d.playing) return;
    score.querySelectorAll('.pr-ev.sounding').forEach(el => el.classList.remove('sounding'));
  });
  /* a tap on a drawn note: that part comes onto the page with that note
     selected; on the band alone, with its column nearest the tap */
  score.addEventListener('click', e => {
    const band = e.target.closest ? e.target.closest('.part-row') : null;
    if (!band || !band.dataset.parts) return;
    e.stopImmediatePropagation();
    const ids = band.dataset.parts.split(',').map(Number);
    const r = band.getBoundingClientRect();
    // which part's staff the tap is in: by each one's own height (place: partSlot), else the stand-in's
    const hs = band.dataset.slots ? JSON.parse(band.dataset.slots).map(x => x.h) : ids.map(() => bandH(kit().blockScale()));
    let k = 0, y = e.clientY - r.top - (band.dataset.slots ? Number(band.dataset.chord) || 0 : 2);
    while (k < ids.length - 1 && y >= hs[k]) { y -= hs[k]; k++; }
    const part = ids[k];
    let at = null;
    const hit = e.target.closest('.pr-ev');
    if (hit && hit.dataset.part === String(part) && hit.dataset.at !== '') at = Number(hit.dataset.at);
    else {
      let best = Infinity;
      band.querySelectorAll('.pr-ev[data-part="' + part + '"]').forEach(el => {
        const b = el.getBoundingClientRect();
        const d = Math.abs((b.left + b.right) / 2 - e.clientX);
        if (d < best && el.dataset.at !== '') { best = d; at = Number(el.dataset.at); }
      });
    }
    SW.parts.focus(part, at === null ? undefined : { at });
  }, true);

  /* THE SYSTEM A PAGE SYLLABLE SITS IN (the user, 2026-11-03: playing,
     the page followed the page's row alone, so the part over or under it
     could be out of sight — the whole system must stay in view). The
     row's syllables and the bands drawn over and under it: everything
     between the row breaks round it (place() puts a row's 'above' band
     before its first syllable and its 'below' band before the next break;
     the 'full' rows at the line's end are rows of their own). The chords
     are inside: the page's chord row, or the room an 'above' band keeps
     for them. Client coordinates; null when no part is drawn round it
     (score.js scrollToSyllable then follows the row as before). */
  function systemOf(syl) {
    if (!active() || !syl || !syl.parentElement || !syl.classList.contains('syllable')) return null;
    let top = Infinity, bottom = -Infinity, bands = 0;
    const take = el => { const r = el.getBoundingClientRect(); if (!r.height) return; top = Math.min(top, r.top); bottom = Math.max(bottom, r.bottom); };
    const visit = el => {
      if (el.classList.contains('part-row')) {
        if (el.dataset.side === 'full') return false;
        bands++;
        take(el);
      } else if (el.classList.contains('syllable')) take(el);
      return true;
    };
    take(syl);
    for (let n = syl.previousElementSibling; n && !n.classList.contains('row-break'); n = n.previousElementSibling) visit(n);
    for (let n = syl.nextElementSibling; n && !n.classList.contains('row-break'); n = n.nextElementSibling) if (visit(n) === false) break;
    return bands && isFinite(top) ? { top, bottom } : null;
  }

  SW.partRows = { place, draw, systemOf };
})();

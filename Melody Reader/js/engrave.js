/* ==========================================================================
   Melody Reader — engrave.js
   --------------------------------------------------------------------------
   RR.Eng — one or two bars of treble-clef music, big (ENGINE §5).

   The family's notation: Leland glyphs (lib/notation/glyphs-leland.js, 360
   units to a staff space), Song Writer 2.5's spacing and stem rules, drawn
   for this app's states — the next note's glow, lit notes (pale → full
   colour with a halo, or black → colour), ghost notes where a slip landed,
   the playhead, words under the notes, judgement words.

   render(card, o) → { svg, W, H, evs, total, yOf, xAtTick, ss }
     o: { ss, maxW, maxStretch, colour: 'always'|'lit'|'black',
          states[], judge[], nextIdx, hearIdx, justLit, justAge,
          labels: 'none'|'letters'|'solfege'|'syllables', judgeRow, ghosts[],
          playTick, hidden, bare, noTime, endBar: 'final'|'single',
          noHalo, faintFrom }   (Make a melody: solid colours; the bars'
                                 empty rest drawn faintly from faintFrom)
   measure(card, bare, noTime) → widths in staff spaces, for fitting
   picker(selected)            → the Notes tab's twelve tappable notes
   events(card)                → the notes with their start ticks

   Two things about redrawing (the whole SVG is rebuilt on every change):
   a CSS animation on an element with a transform attribute would replace
   it, so the lit pop runs on a wrapping <g>; and a rebuilt element
   restarts its animation, so the pop and the ghost fade are drawn with a
   negative animation-delay equal to their age.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const GL = (typeof GLYPHS_LELAND !== 'undefined') ? GLYPHS_LELAND : null;
  const UNITS = 360;
  const BAR = RR.BAR, INK = RR.INK;
  const E4 = RR.STEP.E4, G4 = RR.STEP.G4, B4 = RR.STEP.B4, D5 = RR.STEP.D5;

  const r2 = v => Math.round(v * 100) / 100;
  const gw = (n, k) => GL[n].w * k, gh = (n, k) => GL[n].h * k;
  const sc = k => Math.round(k * 1e5) / 1e5;
  function at(name, x, y, k, attrs) {
    return '<path ' + (attrs || '') + ' transform="translate(' + r2(x) + ' ' + r2(y) + ') scale(' + sc(k) + ')" d="' + GL[name].d + '"/>';
  }
  function boxAt(name, x, y, k, attrs) {
    const g = GL[name];
    return '<path ' + (attrs || '') + ' transform="translate(' + r2(x) + ' ' + r2(y) + ') scale(' + sc(k) + ') translate(' + (-g.x0) + ' ' + (-g.y0) + ')" d="' + g.d + '"/>';
  }
  const rect = (x, y, w, h, attrs) => '<rect ' + (attrs || '') + ' x="' + r2(x) + '" y="' + r2(y) + '" width="' + r2(Math.max(0, w)) + '" height="' + r2(Math.max(0, h)) + '"/>';
  const poly = (pts, attrs) => '<polygon ' + (attrs || '') + ' points="' + pts.map(p => r2(p[0]) + ',' + r2(p[1])).join(' ') + '"/>';
  const FILL = 'fill="' + INK + '"';
  // judgement words, each at least 4.5:1 on the paper (WCAG AA)
  const JUDGE_COLOUR = { Perfect: '#15803d', Good: '#0f766e', Early: '#c2410c', Late: '#c2410c', Missed: '#78716c' };

  function events(card) {
    const evs = []; let tick = 0;
    card.notes.forEach((n, i) => {
      evs.push({ i, p: n.p, t: n.t, start: tick, step: n.p ? BAR[n.p].step : null, rest: !n.p, beam: null });
      tick += n.t;
    });
    return { evs, total: tick };
  }
  // eighths and sixteenths beamed within their beat
  function beamGroups(evs) {
    const groups = []; let cur = [];
    const flush = () => { if (cur.length > 1) groups.push(cur); cur = []; };
    evs.forEach(ev => {
      const short = !ev.rest && ev.t < 4 && ev.t !== 3;
      if (!short) { flush(); return; }
      if (cur.length && Math.floor(cur[0].start / 4) !== Math.floor(ev.start / 4)) flush();
      cur.push(ev);
    });
    flush();
    groups.forEach((g, gi) => g.forEach(ev => { ev.beam = gi; }));
    return groups;
  }
  const headFor = t => t >= 16 ? 'noteheadWhole' : t >= 8 ? 'noteheadHalf' : 'noteheadBlack';
  const restFor = t => t >= 16 ? 'restWhole' : t >= 8 ? 'restHalf' : t >= 4 ? 'restQuarter' : t >= 2 ? 'rest8th' : 'rest16th';
  const dotted = t => t === 3 || t === 6 || t === 12;
  const spaceSS = t => Math.max(2.0, 3.4 * Math.sqrt(t / 4)) + (dotted(t) ? 0.5 : 0);

  const SOLFEGE = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'So', A: 'La', B: 'Ti' };
  function sylOf(ev) {
    if (ev.rest) return 'sh';
    const t = ev.t, pos = ev.start % 4;
    if (t >= 16) return 'ta-a-a-a';
    if (t >= 12) return 'ta-a-a';
    if (t >= 8) return 'ta-a';
    if (t === 6) return 'ta-i';
    if (t >= 4) return 'ta';
    if (t === 2) return 'ti';
    return pos % 2 === 0 ? 'ti' : 'ka';
  }

  function measure(card, bare, noTime) {
    const k = 1 / UNITS;
    const { evs, total } = events(card);
    const barTicks = card.time[0] * 4;
    const prefix = bare ? 0.4 : 0.5 + gw('gClef', k) + (noTime ? 1.4 : 0.8 + gw('timeSig4', k) + 1.4);
    let notes = 0; evs.forEach(ev => { notes += spaceSS(ev.t); });
    return { prefix, notes, fixed: Math.ceil(total / barTicks) * 1.2 + 0.8 };
  }

  function render(card, o) {
    const ss = o.ss, k = ss / UNITS;
    const { evs, total } = events(card);
    const barTicks = card.time[0] * 4;
    const groups = beamGroups(evs);
    const hw = gw('noteheadBlack', k);
    const states = o.states || [], judge = o.judge || [];
    const hasLabels = o.labels && o.labels !== 'none';

    // vertical
    const topLine = ss * (o.bare ? 1.6 : 2.7);
    const bottom = topLine + 4 * ss;
    const yOf = st => bottom - (st - E4) * ss / 2;
    let H = bottom + ss * (o.bare ? 1.2 : 2.9);
    const labelY = bottom + ss * 3.0;
    if (hasLabels) H = labelY + ss * 0.8;
    const judgeY = hasLabels ? labelY + ss * 1.45 : bottom + ss * 3.1;
    if (o.judgeRow) H = Math.max(H, judgeY + ss * 1.8);

    // horizontal
    const m = measure(card, o.bare, o.noTime);
    const clefX = ss * 0.5;
    const tsX = clefX + gw('gClef', k) + ss * 0.8;
    const top = 'timeSig' + card.time[0], bot = 'timeSig' + card.time[1];
    const tsW = GL[top] && GL[bot] ? Math.max(gw(top, k), gw(bot, k)) : 0;   // a bare picture can have any length
    const prefixW = m.prefix * ss;
    const room = (o.maxW || 9999) - prefixW - m.fixed * ss;
    const stretch = Math.max(0.72, Math.min(o.maxStretch || 1.9, room / (m.notes * ss)));
    let x = prefixW, barStart = x;
    const barXs = [];
    evs.forEach(ev => {
      ev.x = x;
      x += spaceSS(ev.t) * ss * stretch;
      if ((ev.start + ev.t) % barTicks === 0) {
        const final = ev.start + ev.t === total;
        const bx = ev.x + gw(headFor(ev.t), k) + Math.max(ss * (final ? 1.4 : 1.0), (x - ev.x - hw) * (final ? 0.6 : 0.42));
        barXs.push(bx);
        if (ev.rest && ev.t === barTicks) ev.x = (barStart + bx) / 2 - gw('restWhole', k) / 2 - ss * 0.3;
        x = bx + ss * 1.2; barStart = x;
      }
    });
    const endX = barXs.length ? barXs[barXs.length - 1] : x;
    const W = endX + ss * 0.3;
    evs.forEach(ev => { ev.cx = ev.x + gw(ev.rest ? restFor(ev.t) : headFor(ev.t), k) / 2; });

    const p = [];
    const lineW = Math.max(1, ss * 0.11);
    const stemW = Math.max(1.3, ss * 0.13);
    const glow = (ev, cls) => {
      const y0 = topLine - ss * 1.7;
      p.push('<rect class="' + cls + '" x="' + r2(ev.cx - ss * 1.4) + '" y="' + r2(y0) + '" width="' + r2(ss * 2.8) + '" height="' + r2(bottom + ss * 2.3 - y0) + '" rx="' + r2(ss * 0.8) + '"/>');
    };
    if (o.nextIdx >= 0 && evs[o.nextIdx]) glow(evs[o.nextIdx], 'now-glow');
    if (o.hearIdx >= 0 && evs[o.hearIdx]) glow(evs[o.hearIdx], 'hear-glow');

    if (!o.bare) {
      for (let i = 0; i < 5; i++) p.push(rect(0, bottom - i * ss - lineW / 2, endX, lineW, FILL));
      p.push(at('gClef', clefX, yOf(G4), k, FILL));
      if (!o.noTime) {
        p.push(boxAt(top, tsX + (tsW - gw(top, k)) / 2, yOf(B4) - gh(top, k), k, FILL));
        p.push(boxAt(bot, tsX + (tsW - gw(bot, k)) / 2, yOf(B4), k, FILL));
      }
      barXs.forEach((bx, i) => {
        const last = i === barXs.length - 1 && o.endBar !== 'single';
        if (!last) p.push(rect(bx - ss * 0.08, topLine - lineW / 2, ss * 0.16, 4 * ss + lineW, FILL));
        else {
          p.push(rect(bx - ss * 0.5, topLine - lineW / 2, ss * 0.5, 4 * ss + lineW, FILL));
          p.push(rect(bx - ss * 1.06, topLine - lineW / 2, ss * 0.16, 4 * ss + lineW, FILL));
        }
      });
    }

    const ledger = (x0, st, attrs) => {
      const out = [];
      for (let s = 28; s >= st; s -= 2) out.push(rect(x0 - ss * 0.4, yOf(s) - lineW / 2, hw + ss * 0.8, lineW, attrs || FILL));
      for (let s = 40; s <= st; s += 2) out.push(rect(x0 - ss * 0.4, yOf(s) - lineW / 2, hw + ss * 0.8, lineW, attrs || FILL));
      return out.join('');
    };

    // the columns
    let lastJudge = null;
    evs.forEach((ev, i) => {
      const lit = states[i] === 'lit';
      const q = [];
      if (ev.rest) {
        const name = restFor(ev.t);
        q.push(at(name, ev.x + (ev.t >= 16 ? 0 : (hw - gw(name, k)) / 2), name === 'restWhole' ? yOf(D5) : yOf(B4), k, FILL));
      } else {
        const b = BAR[ev.p];
        const coloured = o.colour === 'always' || (o.colour === 'lit' && lit);
        // a coloured note not yet played is pale; lit, it is full colour with a halo
        const pale = o.colour === 'always' && !lit;
        const attrs = coloured
          ? 'fill="' + b.colour + '"' + (pale ? ' fill-opacity=".42"' : '') + ' stroke="' + INK + '" stroke-width="44" paint-order="stroke" stroke-linejoin="round"'
          : FILL;
        if (lit && o.colour !== 'black' && !o.noHalo) q.push('<circle cx="' + r2(ev.cx) + '" cy="' + r2(yOf(ev.step)) + '" r="' + r2(ss * 1.05) + '" fill="' + b.colour + '" fill-opacity=".3"/>');
        q.push(ledger(ev.x, ev.step));
        const pop = i === o.justLit;
        q.push('<g class="head-wrap' + (pop ? ' pop' : '') + '"' + (pop && o.justAge ? ' style="animation-delay:-' + Math.round(o.justAge) + 'ms"' : '') + '>' +
          at(headFor(ev.t), ev.x, yOf(ev.step), k, attrs) + '</g>');
        if (dotted(ev.t)) {
          const dy = (ev.step - E4) % 2 === 0 ? -ss * 0.5 : 0;
          q.push(boxAt('augmentationDot', ev.x + gw(headFor(ev.t), k) + ss * 0.35, yOf(ev.step) + dy - gh('augmentationDot', k) / 2, k, FILL));
        }
        if (ev.t < 16 && ev.beam === null) {
          const up = ev.step < B4;
          const flag = ev.t <= 2 ? (ev.t === 1 ? '16th' : '8th') : null;
          const len = ss * (flag ? 3.8 : 3.5);
          if (up) {
            const sx = ev.x + hw - stemW, y1 = yOf(ev.step) - ss * 0.17, y0 = yOf(ev.step) - len;
            q.push(rect(sx, y0, stemW, y1 - y0, FILL));
            if (flag) q.push(boxAt('flag' + flag + 'Up', sx, y0, k, FILL));
          } else {
            const sx = ev.x, y0 = yOf(ev.step) + ss * 0.17, y1 = yOf(ev.step) + len;
            q.push(rect(sx, y0, stemW, y1 - y0, FILL));
            if (flag) q.push(boxAt('flag' + flag + 'Down', sx, y1 - gh('flag' + flag + 'Down', k), k, FILL));
          }
        }
        if (lit && o.colour === 'black') q.push('<circle cx="' + r2(ev.cx) + '" cy="' + r2(bottom + ss * 2.25) + '" r="' + r2(ss * 0.36) + '" fill="' + b.colour + '" stroke="' + INK + '" stroke-width="1"/>');
      }
      const faint = o.faintFrom !== undefined && o.faintFrom >= 0 && i >= o.faintFrom;
      // words under the notes
      if (faint) { /* the empty part of the bar: no words */ }
      else if (o.labels === 'letters' && !ev.rest) {
        const b = BAR[ev.p];
        p.push('<rect x="' + r2(ev.cx - ss * 0.75) + '" y="' + r2(labelY - ss * 0.95) + '" width="' + r2(ss * 1.5) + '" height="' + r2(ss * 1.3) + '" rx="' + r2(ss * 0.4) + '" fill="' + b.colour + '" fill-opacity=".3"/>');
        p.push('<text class="label-letter" x="' + r2(ev.cx) + '" y="' + r2(labelY) + '" font-size="' + r2(ss * 1.05) + '" text-anchor="middle" fill="' + INK + '">' + b.letter + '</text>');
      } else if (o.labels === 'solfege' && !ev.rest) {
        // the solfège name (C is Do — the xylophone's own key), tinted with its bar's colour like the letters
        const b = BAR[ev.p], name = SOLFEGE[b.letter];
        p.push('<rect x="' + r2(ev.cx - ss * 0.95) + '" y="' + r2(labelY - ss * 0.95) + '" width="' + r2(ss * 1.9) + '" height="' + r2(ss * 1.3) + '" rx="' + r2(ss * 0.4) + '" fill="' + b.colour + '" fill-opacity=".3"/>');
        p.push('<text class="label-letter" x="' + r2(ev.cx) + '" y="' + r2(labelY) + '" font-size="' + r2(ss * 0.92) + '" text-anchor="middle" fill="' + INK + '">' + name + '</text>');
      } else if (o.labels === 'syllables') {
        p.push('<text class="label-syl" x="' + r2(ev.cx) + '" y="' + r2(labelY) + '" font-size="' + r2(ss * 0.95) + '" text-anchor="middle">' + sylOf(ev) + '</text>');
      }
      if (judge[i]) {
        // words for notes close together take turns on two lines
        const tight = lastJudge && ev.cx - lastJudge.x < ss * 3.4 && lastJudge.row === 0;
        lastJudge = { x: ev.cx, row: tight ? 1 : 0 };
        p.push('<text class="judge-word" x="' + r2(ev.cx) + '" y="' + r2(judgeY + (tight ? ss * 0.95 : 0)) + '" font-size="' + r2(ss * 0.8) + '" text-anchor="middle" fill="' + JUDGE_COLOUR[judge[i]] + '">' + judge[i] + '</text>');
      }
      const hidden = o.hidden && !lit;
      p.push('<g class="col' + (hidden ? ' hidden-note' : '') + (faint ? ' faint' : '') + '">' + q.join('') + '</g>');
    });

    // beamed groups: stems and beams, slanted with the melody, no stem under 3 spaces
    groups.forEach(g => {
      const lo = Math.min.apply(null, g.map(e => e.step)), hi = Math.max.apply(null, g.map(e => e.step));
      const up = (B4 - lo) > (hi - B4);
      const sx = ev => up ? ev.x + hw - stemW : ev.x;
      const first = g[0], last = g[g.length - 1];
      const L = ss * 3.25;
      let y1 = up ? yOf(first.step) - L : yOf(first.step) + L;
      const y2 = up ? yOf(last.step) - L : yOf(last.step) + L;
      const dy = Math.max(-ss * 0.75, Math.min(ss * 0.75, y2 - y1));
      const x1 = sx(first), x2 = sx(last) + stemW;
      const beamAt = xx => y1 + dy * (xx - x1) / Math.max(1, x2 - x1);
      g.forEach(ev => {
        const need = up ? yOf(ev.step) - ss * 3 : yOf(ev.step) + ss * 3;
        const y = beamAt(sx(ev));
        if (up && y > need) y1 += need - y;
        if (!up && y < need) y1 += need - y;
      });
      const bt = ss * 0.5, gap = ss * 0.75;
      const q = [];
      g.forEach(ev => {
        const xx = sx(ev), by = beamAt(xx);
        if (up) q.push(rect(xx, by, stemW, yOf(ev.step) - ss * 0.17 - by, FILL));
        else q.push(rect(xx, yOf(ev.step) + ss * 0.17, stemW, by - yOf(ev.step) - ss * 0.17, FILL));
      });
      const beam = (xa, xb, off) => {
        const ya = beamAt(xa) + off, yb = beamAt(xb) + off;
        q.push(poly(up ? [[xa, ya], [xb, yb], [xb, yb + bt], [xa, ya + bt]] : [[xa, ya - bt], [xb, yb - bt], [xb, yb], [xa, ya]], FILL));
      };
      beam(x1, x2, 0);
      for (let j = 0; j + 1 < g.length; j++) {
        if (g[j].t === 1 && g[j + 1].t === 1) beam(sx(g[j]), sx(g[j + 1]) + stemW, up ? gap : -gap);
      }
      const hidden = o.hidden && g.some(ev => states[ev.i] !== 'lit');
      const faintG = o.faintFrom !== undefined && o.faintFrom >= 0 && g.some(ev => ev.i >= o.faintFrom);
      p.push('<g class="beams' + (hidden ? ' hidden-note' : '') + (faintG ? ' faint' : '') + '">' + q.join('') + '</g>');
    });

    // ghost notes: where the struck bar would be, in the column it was aimed at
    (o.ghosts || []).forEach(gn => {
      const ev = evs[gn.col]; if (!ev || !BAR[gn.id]) return;
      const st = BAR[gn.id].step;
      p.push('<g class="ghost"' + (gn.age ? ' style="animation-delay:-' + Math.round(gn.age) + 'ms"' : '') + '>' +
        ledger(ev.x, st, 'fill="#9a8f86"') + at('noteheadBlack', ev.x, yOf(st), k, 'fill="#9a8f86"') + '</g>');
    });

    // the playhead (With the beat)
    const pts = evs.map(ev => [ev.start, ev.cx]); pts.push([total, endX - ss * 0.9]);
    const xAtTick = t => {
      if (t <= pts[0][0]) return pts[0][1] + (t - pts[0][0]) * ss * 0.6;
      for (let i = 0; i + 1 < pts.length; i++) {
        if (t <= pts[i + 1][0]) return pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (t - pts[i][0]) / Math.max(1e-6, pts[i + 1][0] - pts[i][0]);
      }
      return pts[pts.length - 1][1];
    };
    if (o.playTick !== null && o.playTick !== undefined) {
      const px = xAtTick(o.playTick);
      p.push('<rect id="playhead" class="playhead" x="' + r2(px - ss * 0.14) + '" y="' + r2(topLine - ss * 1.5) + '" width="' + r2(ss * 0.28) + '" height="' + r2(ss * 7.2) + '" rx="' + r2(ss * 0.14) + '"/>');
    }

    const svg = '<svg class="score" xmlns="http://www.w3.org/2000/svg" width="' + r2(W) + '" height="' + r2(H) + '" viewBox="0 0 ' + r2(W) + ' ' + r2(H) + '" aria-hidden="true">' + p.join('') + '</svg>';
    return { svg, W, H, evs, total, yOf, xAtTick, ss };
  }

  /* the Notes tab: twelve whole notes on a staff, each one a tap target */
  function picker(selected) {
    const ss = 12, k = ss / UNITS, hw = gw('noteheadWhole', k);
    const topLine = ss * 2.4, bottom = topLine + 4 * ss, yOf = st => bottom - (st - E4) * ss / 2;
    const x0 = ss * 0.5 + gw('gClef', k) + ss * 1.3, gap = ss * 2.7;
    const W = x0 + RR.BARS.length * gap, H = bottom + ss * 2.2;
    const lineW = 1.1, p = [];
    for (let i = 0; i < 5; i++) p.push(rect(0, bottom - i * ss - lineW / 2, W, lineW, FILL));
    p.push(at('gClef', ss * 0.5, yOf(G4), k, FILL));
    RR.BARS.forEach((b, i) => {
      const x = x0 + i * gap, on = selected.includes(b.id);
      const attrs = on ? 'class="ph" fill="' + b.colour + '" stroke="' + INK + '" stroke-width="44" paint-order="stroke"' : 'class="ph" stroke-width="40"';
      p.push('<g class="pick ' + (on ? 'on' : 'off') + '" data-note="' + b.id + '" role="button" aria-pressed="' + on + '" aria-label="' + b.id + '">' +
        rect(x - gap * 0.3, 0, gap * 0.95, H, 'fill="transparent"') +
        (b.step <= 28 ? rect(x - ss * 0.4, yOf(28) - lineW / 2, hw + ss * 0.8, lineW, FILL) : '') +
        at('noteheadWhole', x, yOf(b.step), k, attrs) + '</g>');
    });
    return '<svg class="pick-staff" width="' + r2(W) + '" height="' + r2(H) + '" viewBox="0 0 ' + r2(W) + ' ' + r2(H) + '">' + p.join('') + '</svg>';
  }

  RR.Eng = { render, events, measure, picker, sylOf, available: !!GL };
})();

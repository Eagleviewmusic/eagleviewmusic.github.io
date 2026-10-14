/* ==========================================================================
   Melody Reader — dial.js
   --------------------------------------------------------------------------
   RR.Dial — the metronome's tempo dial (2026-10-13, the user's: "instead
   of having preset tempos, lets give the user a dial from easy to hard,
   going from 56 to 132 bpm. This dial will effect the playback too. Lets
   make the default 72"). It replaced the Slow · Moderate · Fast buttons in
   Tools and in a battle's metronome pop-up — both draw it with html() and
   hand their panel to bind() once.

     the dial      a half circle, Easy on the left, Hard on the right, in
                   the colours of the points (points.js PACES): green under
                   70 BPM (15 at the top), amber 70–99 (17), red 100 and up
                   (20). It stops on a classic metronome's marks (RR.TEMPO:
                   56 58 60 63 66 69 72 76 … 120 126 132). Drag the knob
                   round it, or tap the arc; − and + a mark at a time; the
                   arrow keys, Page Up / Down, Home / End. The middle (the
                   number) takes no tap — a finger there isn't turning it
     the number    the tempo in quarter notes a minute; in 6/8 (9/8, 12/8)
                   the click is on the dotted quarter: a line says how many

   Above it, the metronome's sound (2026-10-13, the user's: "put this option
   in the tools next to the metronome — click or drum beat"): soundHtml(),
   two buttons, Click · Drum beat (drums.js) → G.setBeatSound — with a word
   when the music's meter has no drum beat yet (it clicks).

   Dragging only moves the picture; the tempo is set when the finger lifts
   (keys and − / + half a second after the last), so a metronome counting
   in starts again once, not at every mark passed (G.setTempo).
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const MARKS = RR.TEMPO.MARKS, LAST = MARKS.length - 1;
  const CX = 110, CY = 106, R = 84;                       // the viewBox is 220 × 128
  const COL = { slow: '#22c55e', moderate: '#f59e0b', fast: '#ef4444' };
  const ang = i => Math.PI * (1 - i / LAST);
  const pt = (i, r) => [CX + r * Math.cos(ang(i)), CY - r * Math.sin(ang(i))];
  const f1 = n => n.toFixed(1);
  const arc = (i0, i1, r) => { const a = pt(i0, r), b = pt(i1, r); return 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'A' + r + ' ' + r + ' 0 0 1 ' + f1(b[0]) + ' ' + f1(b[1]); };
  const paceAt = i => RR.Points.paceAt(MARKS[i]);
  const clampI = i => Math.max(0, Math.min(LAST, Math.round(i)));

  /* the band's words under the dial: "Moderate", and under it "up to 17 points" */
  const bandHtml = (i, points) => { const p = paceAt(i); return '<b>' + p.name + '</b>' + (points ? '<small>up to ' + p.top + ' points</small>' : ''); };
  /* compound meters click on the dotted quarter */
  const beatLine = (i, beatTicks) => beatTicks === 6 ? 'In 6/8 it clicks on the dotted quarter: ' + Math.round(MARKS[i] * 4 / 6) + ' a minute.' : '';

  /* o = { tempo, time (the card's meter), points (show "up to n points") } */
  function html(o) {
    const i = RR.tempoIndex(o.tempo), beatTicks = RR.meter(o.time || [4, 4]).beatTicks;
    // the bands, end to end: where the pace changes, halfway between two marks
    const bands = [];
    let from = 0;
    for (let k = 1; k <= LAST + 1; k++) {
      if (k <= LAST && paceAt(k).id === paceAt(from).id) continue;
      bands.push('<path class="td-band" d="' + arc(from ? from - 0.5 : -0.35, k <= LAST ? k - 0.5 : LAST + 0.35, R) + '" stroke="' + COL[paceAt(from).id] + '"/>');
      from = k;
    }
    const ticks = MARKS.map((m, k) => { const a = pt(k, R + 11), b = pt(k, R + (m % 20 === 0 ? 18 : 15)); return '<line x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/>'; }).join('');
    const [x, y] = pt(i, R), p = paceAt(i);
    return '<div class="td" data-pts="' + (o.points ? 1 : 0) + '" data-bt="' + beatTicks + '">' +
      '<svg class="td-svg" viewBox="0 0 220 128" role="slider" tabindex="0" data-dial="dial" data-i="' + i + '" aria-label="Tempo, from easy to hard"' +
        ' aria-valuemin="' + MARKS[0] + '" aria-valuemax="' + MARKS[LAST] + '" aria-valuenow="' + MARKS[i] + '" aria-valuetext="' + MARKS[i] + ' BPM, ' + p.name + '">' +
        '<path class="td-back" d="' + arc(-0.35, LAST + 0.35, R) + '"/>' + bands.join('') +
        '<g class="td-ticks">' + ticks + '</g>' +
        '<text class="td-end" x="' + (CX - R) + '" y="124">Easy</text><text class="td-end" x="' + (CX + R) + '" y="124">Hard</text>' +
        '<text class="td-num" x="' + CX + '" y="' + (CY - 22) + '">' + MARKS[i] + '</text>' +
        '<text class="td-unit" x="' + CX + '" y="' + (CY - 3) + '">BPM</text>' +
        '<g class="td-knob" transform="translate(' + f1(x) + ' ' + f1(y) + ')"><circle r="13"/><circle class="td-dot" r="5" fill="' + COL[p.id] + '"/></g>' +
      '</svg>' +
      '<div class="td-row">' +
        '<button type="button" class="td-step" data-dial="-1" aria-label="Easier: slower"' + (i ? '' : ' disabled') + '>−</button>' +
        '<span class="td-band-txt" style="--bc:' + COL[p.id] + '">' + bandHtml(i, o.points) + '</span>' +
        '<button type="button" class="td-step" data-dial="1" aria-label="Harder: faster"' + (i < LAST ? '' : ' disabled') + '>+</button>' +
      '</div>' +
      '<p class="td-beat"' + (beatTicks === 6 ? '' : ' hidden') + '>' + beatLine(i, beatTicks) + '</p>' +
    '</div>';
  }

  /* the metronome's sound: Click · Drum beat (`cur`), and a word when the meter has no drum beat yet */
  const SOUND_SVG = {
    click: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 3.2h5.6l4 17.3H5.2z" stroke-width="2" stroke-linejoin="round"/><path d="M6.6 15.2h10.8" stroke-width="1.8"/><path d="M12 15.2L17.6 3.6" stroke-width="2" stroke-linecap="round"/></svg>',
    drums: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="11" rx="8.2" ry="3" stroke-width="2"/><path d="M3.8 11v6.2c0 1.7 3.7 3 8.2 3s8.2-1.3 8.2-3V11" stroke-width="2"/><path d="M6.5 3.2l5 6.6M17.5 3.2l-5 6.6" stroke-width="2" stroke-linecap="round"/></svg>'
  };
  function soundHtml(cur, time) {
    const none = cur === 'drums' && RR.Drums && !RR.Drums.has(time || [4, 4]);
    return '<div class="td-sound" role="group" aria-label="The metronome’s sound">' +
      [['click', 'Click'], ['drums', 'Drum beat']].map(([v, name]) => '<button type="button" class="td-snd' + (v === cur ? ' on' : '') + '" data-beat="' + v + '" aria-pressed="' + (v === cur) + '">' +
        SOUND_SVG[v] + '<span>' + name + '</span></button>').join('') + '</div>' +
      (none ? '<p class="td-none">No drum beat for ' + RR.meterText(time) + ' yet — it clicks.</p>' : '');
  }

  /* the picture at mark i (nothing is set yet) */
  function view(svg, i) {
    i = clampI(i);
    svg.dataset.i = i;
    const td = svg.closest('.td'), p = paceAt(i), [x, y] = pt(i, R);
    svg.querySelector('.td-knob').setAttribute('transform', 'translate(' + f1(x) + ' ' + f1(y) + ')');
    svg.querySelector('.td-dot').setAttribute('fill', COL[p.id]);
    svg.querySelector('.td-num').textContent = MARKS[i];
    svg.setAttribute('aria-valuenow', MARKS[i]);
    svg.setAttribute('aria-valuetext', MARKS[i] + ' BPM, ' + p.name);
    if (!td) return;
    const band = td.querySelector('.td-band-txt');
    band.innerHTML = bandHtml(i, td.dataset.pts === '1'); band.style.setProperty('--bc', COL[p.id]);
    td.querySelector('[data-dial="-1"]').disabled = i === 0;
    td.querySelector('[data-dial="1"]').disabled = i === LAST;
    const bl = td.querySelector('.td-beat'); if (!bl.hidden) bl.textContent = beatLine(i, +td.dataset.bt);
  }
  /* where a pointer is, in the dial's own units */
  function local(svg, e) {
    const r = svg.getBoundingClientRect(), k = 220 / r.width;
    return [(e.clientX - r.left) * k, (e.clientY - r.top) * k];
  }
  /* the mark at a point: its angle round the middle (below the middle: the nearer end) */
  function markAt(p) {
    let a = Math.atan2(CY - p[1], p[0] - CX);
    if (a < 0) a = p[0] < CX ? Math.PI : 0;
    return clampI((1 - a / Math.PI) * LAST);
  }
  const set = svg => { if (RR.Game.setTempo) RR.Game.setTempo(MARKS[+svg.dataset.i]); };

  /* a panel the dial is drawn into (again and again): its pointer, keys and − / + */
  function bind(root) {
    let drag = null, timer = null;
    const later = svg => { clearTimeout(timer); timer = setTimeout(() => { timer = null; set(svg); }, 500); };
    root.addEventListener('pointerdown', e => {
      const svg = e.target.closest('.td-svg');
      if (!svg || e.button > 0) return;
      const p = local(svg, e);
      if (Math.hypot(p[0] - CX, p[1] - CY) < R * 0.6) return;     // the number in the middle: not a turn
      e.preventDefault();
      clearTimeout(timer); timer = null;
      drag = { svg, id: e.pointerId };
      try { svg.setPointerCapture(e.pointerId); } catch (_) { /* fine without */ }
      svg.focus({ preventScroll: true });
      svg.classList.add('turning');
      view(svg, markAt(p));
    });
    root.addEventListener('pointermove', e => {
      if (drag && e.pointerId === drag.id) view(drag.svg, markAt(local(drag.svg, e)));
    });
    const end = e => {
      if (!drag || e.pointerId !== drag.id) return;
      const svg = drag.svg; drag = null;
      svg.classList.remove('turning');
      set(svg);
    };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => root.addEventListener(t, end));
    root.addEventListener('keydown', e => {
      const svg = e.target.closest('.td-svg'); if (!svg) return;
      const step = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -3, PageUp: 3 }[e.key];
      let i = +svg.dataset.i;
      if (step) i += step; else if (e.key === 'Home') i = 0; else if (e.key === 'End') i = LAST; else return;
      e.preventDefault(); e.stopPropagation();
      view(svg, i); later(svg);
    });
    root.addEventListener('click', e => {
      const sb = e.target.closest('button[data-beat]');
      if (sb) { if (RR.Game.setBeatSound) RR.Game.setBeatSound(sb.dataset.beat); return; }
      const b = e.target.closest('button[data-dial]'); if (!b) return;
      const svg = root.querySelector('.td-svg'); if (!svg) return;
      view(svg, +svg.dataset.i + +b.dataset.dial); later(svg);
    });
  }

  RR.Dial = { html, soundHtml, bind };
})();

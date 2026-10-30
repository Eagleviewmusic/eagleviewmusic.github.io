/* ==========================================================================
   COMPONENT — the song as a sound wave (the Chord Chart, 2026-10-28)
   --------------------------------------------------------------------------
   Phase 2 of ../Song Writer Chords Redesign/ (README §3.1, D6–D8). The song
   as it sounds now, drawn as a wave: the melody above the line (plum), the
   chords below it (lavender). Each side is recorded alone through the
   app's own voices, levels and room (SW.audio.renderSide), so a bar with
   no chords has an empty lower half and an intro with no words an empty
   upper one. Over it, the sections (a run of lines with the same label,
   the same label the same colour); under it, the chords placed.

     • ▶ / ■ — the song plays through SW.player (its clock, its voices, the
       light on the music), round and round while ⟲ is on (it is, to
       start); straight in, no count-in, no steady beat
     • a DRAG across the wave loops just those bars (whole bars); a TAP
       jumps to the bar tapped and lets the loop go; a section's tab jumps
       to its start
     • Melody · Chords — each side heard or not, its half of the wave
       greyed (one of them always stays on)
     • the part already played is solid, the rest faded; the playhead
       follows the music
     • ⌄ — the fold (2026-10-29, user): folded, it is a strip a quarter
       the height, ▶ and the wave alone (a tap and a drag still work);
       open, all of the above. Folded to start; remembered (View
       preference waveOpen)
   Chords pressed while it plays (the chart, the board) sound on top of it
   (chord-chart.js).

   API  SW.songWave.html() · attach(root) · draw() · toggle() · stop() · playing()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const C = SW.chords;
  const T = SW.track;
  const M = SW.music;
  if (!C || !T) return;
  const RATE = 22050;                 // a picture needs no more — and every voice's filters stay under its top (half the rate)

  let root = null;                    // the wave on the page now (.cc-wave)
  let geo = null;                     // { total, secs, chords } as last measured
  let cursor = 0;                     // ticks: where ▶ starts while it is stopped
  let region = null;                  // [a, z] ticks: round these bars
  let loopOn = true;
  const layers = { melody: true, chords: true };
  let mine = false;                   // the player is playing for the wave
  let lastPos = 0;
  let raf = 0;
  let renderTimer = 0;
  const wave = { key: '', busy: 0, mel: null, chd: null, rate: RATE, tickSec: 0, total: 0, cache: null };

  /* ---------------- the song, measured ---------------- */
  const TINTS = [['#E4EEFE', '#3A6FD8'], ['#FFF2CF', '#A67600'], ['#FBE3F1', '#C2185B'], ['#DDF2E8', '#2E8B57'], ['#ECE6FF', '#6A4FD0'], ['#FFEBD6', '#C8640A']];
  function measure() {
    const song = SW.timing.song();
    const g = T.grid(song);
    const evs = T.events(g);
    const total = Math.max(song.total, evs.end || 0);
    // a run of lines with the same label is one section; the same label, the same colour
    const secs = [], colour = {};
    song.lines.forEach(le => {
      const input = le.line && le.line.querySelector('.line-label');
      const label = input ? input.value.trim() : '';
      const at = le.at, end = le.at + le.padded;
      // an instrumental line (score.js INSTRUMENTAL LINES): grey, as the Time Line's empty bars
      if (le.bars) { secs.push({ at, end, label: label || (at === 0 ? 'Intro' : 'Interlude'), tint: ['#F2EBF4', '#8A7F99'] }); return; }
      const last = secs[secs.length - 1];
      if (last && label && last.label === label && last.end === at) { last.end = end; return; }
      if (!(label in colour)) colour[label] = TINTS[Object.keys(colour).length % TINTS.length];
      secs.push({ at, end, label, tint: colour[label] });
    });
    const chords = evs.filter(e => e.id && C.isKnown(e.id)).map(e => {
      const d = C.describeVoiced(e.id, e.voice);                 // a chord with its own notes: named by them
      return { at: e.at, end: e.end, color: d.color, ink: SW.chordStrip.inkOn(d.color), name: C.nameOf(d) };
    });
    geo = { total, secs, chords, song, g, evs };
    return geo;
  }

  /* ---------------- the recording ----------------
     What the player plays (player.js schedulePass: the same levels, holds
     and ties), in seconds — the melody and the chords apart. */
  function notesOf(n) {
    const tickSec = SW.timing.tickMs() / 1000;
    const mel = [], chd = [];
    n.song.lines.forEach(le => le.events.forEach(ev => {
      if (ev.rest) return;
      const level = ev.pitches.length > 1 ? 0.3 : 0.42;
      ev.pitches.forEach(p => {
        if (ev.tiedIn && ev.tiedIn.has(p.midi) && ev.at !== 0) return;
        const hold = ev.sustain && ev.sustain.get(p.midi) ? ev.sustain.get(p.midi) : ev.ticks;
        mel.push({ freqs: [M.midiToFreq(p.midi)], at: ev.at * tickSec, hold: hold * tickSec * 0.96, level });
      });
    }));
    n.evs.forEach(ce => {
      if (!ce.id || !C.isKnown(ce.id)) return;
      const freqs = C.midis(ce.id, { voice: ce.voice }).map(M.midiToFreq);
      if (!freqs.length) return;
      ce.strikes.forEach(st => chd.push({ freqs, at: st.at * tickSec, hold: st.len * tickSec * 0.95 }));
    });
    return { mel, chd, tickSec, seconds: n.total * tickSec + 1.5 };
  }
  function refresh() {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(record, 180);
  }
  async function record() {
    if (!root || !document.contains(root)) return;
    const n = geo || measure();
    if (!n.total) { wave.mel = wave.chd = null; wave.key = ''; draw(); return; }
    const notes = notesOf(n);
    const r = x => Math.round(x * 1e3);
    const key = JSON.stringify([r(notes.seconds), SW.audio.mix(), notes.mel.map(x => [r(x.at), r(x.hold), r(x.freqs[0]), x.level]), notes.chd.map(x => [r(x.at), r(x.hold), x.freqs.map(r)])]);
    if (key === wave.key && wave.mel) { draw(); return; }
    const token = ++wave.busy;
    try {
      const [a, b] = await Promise.all([
        SW.audio.renderSide('melody', notes.mel, notes.seconds, RATE),
        SW.audio.renderSide('chords', notes.chd, notes.seconds, RATE)
      ]);
      if (token !== wave.busy) return;
      Object.assign(wave, { key, mel: a.getChannelData(0), chd: b.getChannelData(0), rate: a.sampleRate, tickSec: notes.tickSec, total: n.total, cache: null });
      draw();
    } catch (err) {
      console.warn('The sound wave could not be made', err);
    }
  }
  /* a column's loudness: half its average, half its peak (a strike shows, and so does its ring) */
  function peaks(data, cols) {
    const per = (wave.total * wave.tickSec * wave.rate) / cols;
    const out = new Float32Array(cols);
    let top = 0;
    for (let i = 0; i < cols; i++) {
      const a = Math.floor(i * per), b = Math.min(data.length, Math.floor((i + 1) * per));
      let sq = 0, pk = 0;
      for (let j = a; j < b; j++) { const v = data[j]; sq += v * v; if (v > pk) pk = v; else if (-v > pk) pk = -v; }
      out[i] = b > a ? 0.5 * Math.sqrt(sq / (b - a)) + 0.35 * pk : 0;
      if (out[i] > top) top = out[i];
    }
    for (let i = 0; i < cols; i++) out[i] = top > 1e-4 ? Math.pow(out[i] / top, 0.85) : 0;
    return out;
  }

  /* ---------------- drawing ---------------- */
  const pct = t => (geo && geo.total ? Math.max(0, Math.min(100, t / geo.total * 100)) : 0);
  function html() {
    const n = measure();
    const tab = s => '<button type="button" class="cc-wtab" data-jump="' + s.at + '" style="left:' + pct(s.at) + '%;max-width:' + (pct(s.end) - pct(s.at)) + '%;--tb:' + s.tint[0] + ';--td:' + s.tint[1] + '">' + C.escapeHtml(s.label || '·') + '</button>';
    const lane = n.chords.map(c => '<span class="cc-lchord" style="left:' + pct(c.at) + '%;width:' + (pct(c.end) - pct(c.at)) + '%;--c:' + c.color + ';--cink:' + c.ink + '">' + C.labelHTML(c.name) + '</span>').join('');
    const on = S.playing && mine;
    const open = isOpen();
    return '<div class="cc-wave' + (open ? '' : ' folded') + '" id="cc-wave">' +
      '<div class="cc-transport">' +
        '<button type="button" class="cc-play' + (on ? ' on' : '') + '" title="' + (on ? 'Stop (Space)' : 'Play the song (Space)') + '" aria-label="' + (on ? 'Stop' : 'Play') + '">' + (on ? ICON_STOP : ICON_PLAY) + '</button>' +
        '<button type="button" class="cc-loop' + (loopOn ? ' on' : '') + '" title="Round and round" aria-pressed="' + loopOn + '">' + ICON_LOOP + '</button>' +
        '<button type="button" class="cc-layer' + (layers.melody ? ' on' : '') + '" data-layer="melody" aria-pressed="' + layers.melody + '"><i></i>Melody</button>' +
        '<button type="button" class="cc-layer chords' + (layers.chords ? ' on' : '') + '" data-layer="chords" aria-pressed="' + layers.chords + '"><i></i>Chords</button>' +
      '</div>' +
      '<div class="cc-wmain">' +
        '<div class="cc-wtabs">' + n.secs.map(tab).join('') + '</div>' +
        '<div class="cc-wbody"><canvas></canvas>' +
          '<div class="cc-region"' + (region ? ' style="left:' + pct(region[0]) + '%;width:' + (pct(region[1]) - pct(region[0])) + '%"' : ' hidden') + '></div>' +
          '<div class="cc-phead"></div></div>' +
        '<div class="cc-lane">' + lane + '</div>' +
      '</div>' +
      '<button type="button" class="cc-fold" aria-expanded="' + open + '" title="' + foldTitle(open) + '" aria-label="' + foldTitle(open) + '">' + ICON_FOLD + '</button>' +
    '</div>';
  }
  const isOpen = () => !!(SW.settings && SW.settings.view && SW.settings.view.waveOpen);
  const foldTitle = open => (open ? 'Fold the wave' : 'Show the whole wave');
  function fold(open) {
    SW.settings.setView({ waveOpen: open }, { quiet: true });
    if (!root || !document.contains(root)) return;
    root.classList.toggle('folded', !open);
    const b = root.querySelector('.cc-fold');
    if (b) { b.setAttribute('aria-expanded', open); b.title = foldTitle(open); b.setAttribute('aria-label', foldTitle(open)); }
    draw();
  }
  const ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"/></svg>';
  const ICON_STOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2.5"/></svg>';
  const ICON_LOOP = '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>';
  const ICON_FOLD = '<svg viewBox="0 0 24 24" aria-hidden="true" class="line"><path d="M6 9l6 6 6-6"/></svg>';

  function attach(el) {
    root = el;
    if (!root) return;
    draw();
    refresh();
    if (S.playing && mine) follow();
  }
  const where = () => (S.playing && mine ? (SW.player.position() !== null ? SW.player.position() : lastPos) : cursor);
  function draw() {
    if (!root || !document.contains(root)) return;
    const body = root.querySelector('.cc-wbody');
    const cv = body && body.querySelector('canvas');
    if (!cv) return;
    const box = body.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const dpr = window.devicePixelRatio || 1;
    const Wd = Math.round(box.width * dpr), Hd = Math.round(box.height * dpr);
    if (cv.width !== Wd || cv.height !== Hd) { cv.width = Wd; cv.height = Hd; }
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = box.width, H = box.height, mid = Math.round(H * 0.56);
    g.clearRect(0, 0, W, H);
    const total = geo ? geo.total : 0;
    if (geo) geo.secs.forEach(s => { g.fillStyle = s.tint[0]; g.fillRect(pct(s.at) / 100 * W, 0, (pct(s.end) - pct(s.at)) / 100 * W, H); });
    g.fillStyle = 'rgba(43,29,56,.12)';
    g.fillRect(0, mid - 0.5, W, 1);
    const at = where();
    const ph = root.querySelector('.cc-phead');
    if (ph) ph.style.left = pct(at) + '%';
    if (!wave.mel || !total || wave.total !== total) return;
    const step = 3, cols = Math.max(1, Math.floor(W / step));
    if (!wave.cache || wave.cache.cols !== cols || wave.cache.mel !== wave.mel) wave.cache = { cols, mel: wave.mel, pm: peaks(wave.mel, cols), pc: peaks(wave.chd, cols) };
    const { pm, pc } = wave.cache;
    const px = pct(at) / 100 * W;
    for (let i = 0; i < cols; i++) {
      const x = i * step + 0.5;
      g.globalAlpha = x < px ? 1 : 0.45;
      const mh = pm[i] * (mid - 6);
      if (mh > 0.6) { g.fillStyle = layers.melody ? '#9C168E' : '#D2C7DB'; bar(g, x, mid - 2 - mh, step - 1, mh); }
      const ch = pc[i] * (H - mid - 6);
      if (ch > 0.6) { g.fillStyle = layers.chords ? '#A98BF0' : '#DCD5E3'; bar(g, x, mid + 2, step - 1, ch); }
    }
    g.globalAlpha = 1;
  }
  function bar(g, x, y, w, h) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, 1); else g.rect(x, y, w, h); g.fill(); }

  /* ---------------- playing ---------------- */
  function play(from) {
    mine = true;
    SW.player.playFrom(from, { loop: region ? region.slice() : loopOn, melody: layers.melody, chords: layers.chords, beat: false, countIn: false });
  }
  const playing = () => !!(S.playing && mine);
  function toggle() {
    if (playing()) { stop(); return; }
    play(region ? region[0] : cursor);
  }
  function stop() {
    if (!playing()) return;
    const p = SW.player.position();
    SW.player.stop();
    cursor = p === null ? cursor : snapBar(p);
  }
  function follow() {
    cancelAnimationFrame(raf);
    const step = () => {
      if (!playing() || !root || !document.contains(root)) return;
      const p = SW.player.position();
      if (p !== null) lastPos = p;
      draw();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  SW.bus.on('play:changed', d => {
    if (d.playing && mine) follow();
    // a stop: the wave lets go — unless the music starts again at once (a jump, a loop changed, a chart's
    // change replanned: player.js stops and starts in the same moment)
    if (!d.playing && mine) queueMicrotask(() => {
      if (S.playing) return;
      mine = false;
      if (geo && lastPos >= geo.total - 1) cursor = region ? region[0] : 0;      // it reached the end: from the top again
      paintButtons();
      draw();
    });
    paintButtons();
    draw();
  });
  function paintButtons() {
    if (!root || !document.contains(root)) return;
    const on = playing();
    const b = root.querySelector('.cc-play');
    if (b) { b.classList.toggle('on', on); b.innerHTML = on ? ICON_STOP : ICON_PLAY; b.title = on ? 'Stop (Space)' : 'Play the song (Space)'; }
  }
  /* the song changed (a chord, a voice, the tempo …): measured and recorded again */
  ['score:changed', 'score:loaded', 'key:changed', 'meter:changed', 'chords:changed', 'view:changed'].forEach(evt => SW.bus.on(evt, () => { if (root && document.contains(root)) { measure(); refresh(); } }));
  // another song: the wave starts afresh (top, no loop, both sides heard) — but Undo loads the song
  // again too (score:loaded, then score:changed 'history' at once): that keeps them
  let freshTimer = 0;
  SW.bus.on('score:loaded', () => { clearTimeout(freshTimer); freshTimer = setTimeout(() => { region = null; cursor = 0; layers.melody = layers.chords = true; }, 0); });
  SW.bus.on('score:changed', d => { if (d && d.reason === 'history') clearTimeout(freshTimer); });
  window.addEventListener('resize', () => draw());

  /* ---------------- gestures ---------------- */
  function tickAt(clientX) {
    const r = root.querySelector('.cc-wbody').getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * (geo ? geo.total : 0);
  }
  function snapBar(t) { const g = T.grid(); return Math.max(0, g.T(g.barAt(t))); }
  function barEnd(t) { const g = T.grid(); return Math.min(geo.total, g.T(g.barAt(t) + 1)); }
  let press = null;
  document.addEventListener('pointerdown', e => {
    if (!root || !e.target.closest || !root.contains(e.target)) return;
    const body = e.target.closest('.cc-wbody');
    if (!body || e.button > 0) return;
    e.preventDefault();
    press = { x: e.clientX, a: tickAt(e.clientX), moved: false, id: e.pointerId };
  });
  window.addEventListener('pointermove', e => {
    if (!press || e.pointerId !== press.id) return;
    if (!press.moved && Math.abs(e.clientX - press.x) < 6) return;
    press.moved = true;
    const b = tickAt(e.clientX);
    const a0 = snapBar(Math.min(press.a, b)), z0 = Math.max(barEnd(Math.max(press.a, b) - 1), barEnd(a0));
    region = [a0, z0];
    const reg = root.querySelector('.cc-region');
    if (reg) { reg.hidden = false; reg.style.left = pct(a0) + '%'; reg.style.width = (pct(z0) - pct(a0)) + '%'; }
  });
  window.addEventListener('pointerup', e => {
    if (!press || e.pointerId !== press.id) return;
    const p = press;
    press = null;
    if (p.moved && region) {                       // a drag: round those bars
      cursor = region[0];
      if (playing()) play(region[0]); else draw();
      return;
    }
    region = null;                                 // a tap: that bar, and the loop goes
    const reg = root.querySelector('.cc-region');
    if (reg) reg.hidden = true;
    jump(p.a);
  });
  function jump(t) {
    cursor = snapBar(t);
    if (playing()) play(cursor); else draw();
  }
  document.addEventListener('click', e => {
    if (!root || !e.target.closest || !root.contains(e.target)) return;
    const b = e.target.closest('button');
    if (!b) return;
    if (b.classList.contains('cc-play')) { toggle(); return; }
    if (b.classList.contains('cc-fold')) { fold(!isOpen()); return; }
    if (b.classList.contains('cc-loop')) {
      loopOn = !loopOn;
      b.classList.toggle('on', loopOn);
      b.setAttribute('aria-pressed', loopOn);
      if (playing()) play(Math.floor(where()));
      return;
    }
    if (b.dataset.layer) {
      const k = b.dataset.layer, other = k === 'melody' ? 'chords' : 'melody';
      if (layers[k] && !layers[other]) return;     // one side always sounds
      layers[k] = !layers[k];
      b.classList.toggle('on', layers[k]);
      b.setAttribute('aria-pressed', layers[k]);
      draw();
      if (playing()) play(Math.floor(where()));
      return;
    }
    if (b.dataset.jump !== undefined) {
      region = null;
      const reg = root.querySelector('.cc-region');
      if (reg) reg.hidden = true;
      cursor = Number(b.dataset.jump);
      if (playing()) play(cursor); else draw();
    }
  });

  SW.songWave = { html, attach, draw, toggle, stop, playing };
})();

/* ==========================================================================
   Melody Reader — maker.js
   --------------------------------------------------------------------------
   RR.Maker — Make a melody (DESIGN §14.3). The music card becomes the
   editor and the real xylophone below writes the notes:

     pick a value      ta-a-a-a · ta-a-a · ta-a · ta-i · ta · ti · ka
     strike a bar      adds that note (keys 1–0 − = too); Rest adds a rest
     ⌫ (or Backspace)  takes the last one back
     ▶ (or Space)      hears what is written
     Save              into the set it was opened from

   A melody is one or two whole bars and nothing crosses a bar line, so a
   value that doesn't fit what is left of the bar is greyed out. The empty
   part of the bars is drawn faintly, with the next-note glow where the
   next note will go. A melody that isn't full can still be saved: the
   gap is filled with rests (asked first). All twelve bars are live while
   making, with their letters and numbers.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game;

  const VALUES = [
    { t: 16, name: 'ta-a-a-a', about: 'whole' },
    { t: 12, name: 'ta-a-a', about: 'dotted half' },
    { t: 8, name: 'ta-a', about: 'half' },
    { t: 6, name: 'ta-i', about: 'dotted quarter' },
    { t: 4, name: 'ta', about: 'quarter' },
    { t: 2, name: 'ti', about: 'eighth' },
    { t: 1, name: 'ka', about: 'sixteenth' }
  ];
  const RESTABLE = [16, 8, 4, 2, 1];

  const M = { active: false, setId: null, index: null, melody: null, bars: 1, value: 4, dirty: false, timers: [] };

  const barTicks = () => M.melody.time[0] * 4;
  const used = () => M.melody.notes.reduce((a, n) => a + n.t, 0);
  const capacity = () => M.bars * barTicks();
  const full = () => used() >= capacity();
  /* room left in the bar being written */
  const roomInBar = () => { const u = used(); return full() ? 0 : barTicks() - (u % barTicks()); };
  const fits = t => t <= roomInBar();
  const beatsWord = ticks => {
    const b = ticks / 4, whole = Math.floor(b), frac = b - whole;
    const f = frac === 0.5 ? '½' : frac === 0.25 ? '¼' : frac === 0.75 ? '¾' : '';
    const n = (whole || !f ? whole : '') + f;
    return n + (b === 1 ? ' beat' : ' beats');
  };

  /* rests that fill the rest of the bars, beat by beat — drawn faintly */
  function fillers() {
    const out = [];
    let pos = used();
    const bt = barTicks(), cap = capacity();
    while (pos < cap) {
      const end = (Math.floor(pos / bt) + 1) * bt;
      while (pos < end) {
        const step = pos % 4 === 0 && end - pos >= 4 ? 4 : pos % 2 === 0 && end - pos >= 2 ? 2 : 1;
        out.push({ p: null, t: step });
        pos += step;
      }
    }
    return out;
  }

  /* ---------------- entering and leaving ---------------- */
  function enter(setId, index) {
    const set = RR.Sets.get(setId);
    if (!set || set.received) return;
    if (RR.Melodies) RR.Melodies.close();
    if (RR.View) RR.View.go('play');                // the music card is the editor (from the home page too)
    G.pause(); clearTimeout(G.autoT);
    M.active = true; M.setId = setId; M.index = (index === null || index === undefined) ? null : index;
    const src = M.index !== null && set.melodies[M.index];
    M.melody = src ? RR.clone(src) : { title: '', time: [4, 4], notes: [] };
    M.bars = src ? Math.round(src.notes.reduce((a, n) => a + n.t, 0) / (src.time[0] * 4)) : 1;
    M.value = 4; M.dirty = false;
    $('#app').classList.add('making');
    $('#mk-set').textContent = set.title + (M.index !== null ? ' · melody ' + (M.index + 1) : ' · a new melody');
    $('#mk-title').value = M.melody.title || '';
    if (RR.Xylo.count() !== 12) RR.Xylo.build(12);
    RR.Xylo.setGreyed(null); RR.Xylo.setLabels(true, true); RR.Xylo.setGlow(null);
    render();
    const f = $('#mk-values .mk-val.on'); if (f) f.focus();
    G.announce('Make a melody. Pick a note value, then play the bars — keys 1 to 0 — to write it.');
  }
  function leave(saved) {
    stopHear();
    M.active = false;
    $('#app').classList.remove('making');
    const setId = M.setId;
    G.applyInstrument();
    if (saved && G.setup.set === setId) { G.queue = []; G.newRound(); } else G.draw();
    if (RR.Melodies) RR.Melodies.open(setId);
  }
  async function cancel() {
    if (M.dirty && M.melody.notes.length && !(await RR.ask('Leave without saving this melody?', 'Leave', 'Keep writing'))) return;
    leave(false);
  }
  async function save() {
    if (!M.melody.notes.some(n => n.p)) { RR.toast('Write at least one note first — strike a bar'); return; }
    if (!full()) {
      if (!(await RR.ask('The bars aren’t full yet. Fill the rest with rests and save?', 'Fill and save', 'Keep writing'))) return;
      M.melody.notes = M.melody.notes.concat(fillers());
    }
    M.melody.title = ($('#mk-title').value || '').trim().slice(0, 60);
    const mel = RR.Sets.normalizeMelody(M.melody);
    if (!mel) { RR.toast("That melody couldn't be saved"); return; }
    const rec = RR.Sets.update(M.setId, s => {
      if (M.index === null) s.melodies.push(mel); else s.melodies[M.index] = mel;
    });
    if (!rec) { RR.toast("That set can't be changed here"); return; }
    RR.toast('Saved in ' + rec.title);
    leave(true);
  }

  /* ---------------- writing ---------------- */
  function add(p) {
    if (full()) { RR.toast(M.bars === 1 ? 'The bar is full — Save it, or ⌫ to change the end' : 'The bars are full — Save it, or ⌫ to change the end'); return; }
    let t = M.value;
    if (!fits(t)) {
      const best = VALUES.find(v => v.t <= roomInBar() && (p || RESTABLE.includes(v.t)));
      RR.toast('Only ' + beatsWord(roomInBar()) + ' left in this bar' + (best ? ' — try ' + best.name : ''));
      return;
    }
    if (!p && !RESTABLE.includes(t)) { RR.toast('A rest can’t be dotted here — pick ta-a, ta, ti…'); return; }
    M.melody.notes.push({ p, t });
    M.dirty = true;
    // a value that no longer fits steps down to the largest that does
    if (!full() && !fits(M.value)) { const v = VALUES.find(x => fits(x.t)); if (v) M.value = v.t; }
    render();
  }
  function undo() {
    if (!M.melody.notes.length) return;
    M.melody.notes.pop(); M.dirty = true; render();
  }
  async function setTime(beats) {
    if (beats === M.melody.time[0]) return;
    if (M.melody.notes.length && !(await RR.ask('Change to ' + beats + '/4? The notes so far are cleared.', 'Change it', 'Keep ' + M.melody.time[0] + '/4'))) return;
    M.melody.time = [beats, 4]; M.melody.notes = []; M.dirty = true;
    if (!fits(M.value)) { const v = VALUES.find(x => fits(x.t)); if (v) M.value = v.t; }
    render();
  }
  async function setBars(n) {
    if (n === M.bars) return;
    if (n < M.bars && used() > n * barTicks()) {
      if (!(await RR.ask('Keep only the first bar?', 'Keep bar 1', 'Keep both'))) return;
      let pos = 0;
      M.melody.notes = M.melody.notes.filter(x => { const keep = pos + x.t <= barTicks(); pos += x.t; return keep; });
    }
    M.bars = n; M.dirty = true; render();
  }

  /* ---------------- hearing it ---------------- */
  function hear() {
    if (M.timers.length) { stopHear(); return; }
    if (!M.melody.notes.length || !RR.Sound.ctx) return;
    const spt = 60 / RR.paceTempo(G.setup, RR.listenPace()) / 4;
    let t = RR.Sound.now() + 0.1;
    $('#mk-hear').classList.add('playing');
    M.melody.notes.forEach(n => {
      if (n.p) {
        RR.Sound.playAt(n.p, t);
        const id = n.p;
        M.timers.push(setTimeout(() => RR.Xylo.flash(id, 'demo', 280), Math.max(0, RR.Sound.heardAt(t) - RR.now())));
      }
      t += n.t * spt;
    });
    M.timers.push(setTimeout(stopHear, Math.max(0, RR.Sound.heardAt(t) - RR.now()) + 50));
  }
  function stopHear() {
    M.timers.forEach(clearTimeout); M.timers = [];
    const b = $('#mk-hear'); if (b) b.classList.remove('playing');
  }

  /* ---------------- drawing ---------------- */
  function valuePic(t) {
    return RR.Eng.render({ time: [Math.max(1, Math.ceil(t / 4)), 4], notes: [{ p: 'A4', t }] }, { ss: 6, bare: true, colour: 'black', labels: 'none', maxStretch: 1 }).svg;
  }
  function render() {
    if (!M.active) return;
    // the palette
    $('#mk-values').innerHTML = VALUES.map(v => '<button type="button" class="mk-val' + (v.t === M.value ? ' on' : '') + (fits(v.t) ? '' : ' no') + '" data-t="' + v.t + '" aria-pressed="' + (v.t === M.value) + '" title="' + v.about + '"><span class="pic">' + valuePic(v.t) + '</span><b>' + v.name + '</b></button>').join('');
    $('#mk-rest').disabled = full();
    $('#mk-undo').disabled = !M.melody.notes.length;
    $('#mk-time').querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.v === M.melody.time[0]));
    $('#mk-bars').querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.v === M.bars));
    const u = used(), bt = barTicks();
    $('#mk-status').textContent = full() ? 'Full ✓ — Save it' : (M.bars > 1 ? 'Bar ' + (Math.floor(u / bt) + 1) + ' of ' + M.bars + ' · ' : '') + beatsWord(roomInBar()) + ' left' + (M.bars > 1 && Math.floor(u / bt) + 1 < M.bars ? ' in this bar' : '');
    $('#mk-save').classList.toggle('ready', full());
    // the music: what is written, then the empty rest of the bars, faint
    const music = $('#music');
    const fitW = music.clientWidth, fitH = music.clientHeight;
    if (!fitW || !fitH) return;
    const written = M.melody.notes.length;
    const card = { time: M.melody.time, notes: M.melody.notes.concat(fillers()) };
    const m = RR.Eng.measure(card);
    const ss = Math.max(8, Math.min(fitH / (2.7 + 4 + 2.9 + 1.5), fitW / (m.prefix + m.notes * 0.95 + m.fixed), 30));
    music.setAttribute('aria-label', 'Your melody: ' + M.melody.notes.filter(n => n.p).length + ' notes so far. ' + $('#mk-status').textContent + '.');
    music.innerHTML = RR.Eng.render(card, {
      ss, maxW: fitW, colour: 'always', states: card.notes.map((n, i) => i < written ? 'lit' : 'todo'), noHalo: true,
      faintFrom: written, nextIdx: full() ? -1 : written, labels: 'letters'
    }).svg;
  }

  /* ---------------- wiring ---------------- */
  const gameHit = RR.Xylo.onHit;
  RR.Xylo.onHit = (id, e) => { if (M.active) add(id); else gameHit(id, e); };
  $('#mk-values').addEventListener('click', e => {
    const b = e.target.closest('[data-t]'); if (!b) return;
    const t = +b.dataset.t;
    if (!fits(t)) { RR.toast(full() ? 'The bars are full' : 'Only ' + beatsWord(roomInBar()) + ' left in this bar'); return; }
    M.value = t; render();
  });
  $('#mk-rest').addEventListener('click', () => add(null));
  $('#mk-undo').addEventListener('click', undo);
  $('#mk-hear').addEventListener('click', hear);
  $('#mk-cancel').addEventListener('click', cancel);
  $('#mk-save').addEventListener('click', save);
  $('#mk-time').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b) setTime(+b.dataset.v); });
  $('#mk-bars').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b) setBars(+b.dataset.v); });
  $('#mk-title').addEventListener('input', () => { M.dirty = true; });

  RR.Maker = {
    enter, cancel, save, undo, hear, render, add,
    get active() { return M.active; },
    state: () => M     // for tests
  };
})();

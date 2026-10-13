/* ==========================================================================
   Melody Reader — maker.js
   --------------------------------------------------------------------------
   RR.Maker — Make a melody (DESIGN §14.3). The music card becomes the
   editor and the real xylophone below writes the notes:

     pick a value      ta-a-a-a · ta-a-a · ta-a · ta-i · ta · ti · ka
     strike a bar      adds that note (keys 1–0 − = too); Rest adds a rest
     ⌫ (or Backspace)  takes the last one back
     ▶ (or Space)      hears what is written
     Save              into the set it was opened from, and back to it

   SLIDES (2026-10-12, the user's: "it only lets me make one slide … make
   many slides under the same file"): every melody of the set is a slide,
   numbered along the top. + New slide (or Enter) saves this one and
   starts a blank one after the last, in the same time and length; a
   number goes to that slide, saving this one first; Delete this slide
   (asked). A half-written slide is filled with rests when it is left
   (asked first, as Save does); an untouched blank one is simply dropped.

   THE LAYOUT (2026-10-12, the user's: the staff shrank under rows of
   controls): the music card is the staff and one slim line (the set, the
   slides, + New slide, what is left); the tools are one bar between the
   card and the xylophone (the dock, index.html); the slide's name, time and
   length are in a little window from its ✎ button there (pop).

   A melody is one or two whole bars and nothing crosses a bar line, so a
   value that doesn't fit what is left of the bar is greyed out. The empty
   part of the bars is drawn faintly, with the next-note glow where the
   next note will go. A melody that isn't full can still be saved: the
   gap is filled with rests (asked first). All thirteen bars are live while
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

  const M = { active: false, setId: null, index: null, melody: null, bars: 1, value: 4, dirty: false, changed: false, timers: [] };
  const MAX = 60;                                     // a set's melodies at most (sets.js)

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
    M.active = true; M.setId = setId; M.changed = false;
    M.value = 4;
    $('#app').classList.add('making');
    $('#mk-set').textContent = set.title;
    if (RR.Xylo.count() !== 13) RR.Xylo.build(13);
    RR.Xylo.setGreyed(null); RR.Xylo.setLabels(true, true); RR.Xylo.setGlow(null);
    // a new slide starts in the time and length of the set's last one
    const last = set.melodies[set.melodies.length - 1];
    load(index === null || index === undefined ? null : index, last);
    const f = $('#mk-values .mk-val.on'); if (f) f.focus();
    G.announce('Make a melody. Pick a note value, then play the bars — keys 1 to 0 — to write it. + New slide, or Enter, for the next one.');
  }
  const barsOf = m => Math.max(1, Math.round(m.notes.reduce((a, n) => a + n.t, 0) / (m.time[0] * 4)));
  /* a slide on the stand: one of the set's melodies, or (null) a blank new one — in the time and length of `like` */
  function load(index, like) {
    const set = RR.Sets.get(M.setId);
    const src = set && index !== null && set.melodies[index];
    M.index = src ? index : null;
    M.melody = src ? RR.clone(src) : { title: '', time: like ? like.time.slice() : [4, 4], notes: [] };
    M.bars = src ? barsOf(src) : like ? barsOf(like) : 1;
    M.dirty = false;
    $('#mk-title').value = M.melody.title || '';
    if (!fits(M.value)) { const v = VALUES.find(x => fits(x.t)); if (v) M.value = v.t; }
    stopHear();
    render();
  }
  const hasNotes = () => M.melody.notes.some(n => n.p);
  /* this slide into the set (asked first to fill a half-written one with rests). True when there is nothing
     left unsaved — an untouched blank slide counts: there is nothing to keep */
  async function commit() {
    M.melody.title = ($('#mk-title').value || '').trim().slice(0, 60);
    if (!M.dirty) return true;
    if (!hasNotes()) {
      if (M.index === null && !M.melody.notes.length) return true;      // a blank new slide: nothing to keep
      RR.toast('Write at least one note on this slide — strike a bar' + (M.index !== null ? ', or Delete this slide' : ''));
      return false;
    }
    if (!full()) {
      if (!(await RR.ask('Slide ' + slideNo() + ' isn’t full yet. Fill the rest with rests and save it?', 'Fill and save', 'Keep writing'))) return false;
      M.melody.notes = M.melody.notes.concat(fillers());
    }
    const mel = RR.Sets.normalizeMelody(M.melody);
    if (!mel) { RR.toast("That slide couldn't be saved"); return false; }
    const set = RR.Sets.get(M.setId);
    if (M.index === null && set && set.melodies.length >= MAX) { RR.toast('A set holds ' + MAX + ' slides at most'); return false; }
    let at = M.index;
    const rec = RR.Sets.update(M.setId, s => {
      if (at === null) { s.melodies.push(mel); at = s.melodies.length - 1; } else s.melodies[at] = mel;
    });
    if (!rec) { RR.toast("That set can't be changed here"); return false; }
    M.index = at; M.dirty = false; M.changed = true;
    return true;
  }
  const slideNo = () => M.index !== null ? M.index + 1 : (RR.Sets.get(M.setId) || { melodies: [] }).melodies.length + 1;
  /* + New slide (or Enter): this one saved, a blank one after the last */
  async function newSlide() {
    const set = RR.Sets.get(M.setId); if (!set) return;
    if (M.index === null && !M.melody.notes.length) { RR.toast('This is the new slide — strike the bars to write it'); return; }
    const count = set.melodies.length + (M.index === null ? 1 : 0);
    if (count >= MAX) { RR.toast('A set holds ' + MAX + ' slides at most'); return; }
    if (!(await commit())) return;
    const now = RR.Sets.get(M.setId);
    load(null, M.melody);
    G.announce('Slide ' + (now.melodies.length + 1) + ': a new one. Strike the bars to write it.');
  }
  /* a slide's number: this one saved first */
  async function go(i) {
    if (i === M.index) return;
    if (!(await commit())) return;
    const set = RR.Sets.get(M.setId);
    if (!set || !set.melodies[i]) return;
    load(i);
    G.announce('Slide ' + (i + 1) + ' of ' + set.melodies.length + '.');
  }
  async function delSlide() {
    if (M.index === null) return;
    const i = M.index;
    if (!(await RR.ask('Delete slide ' + (i + 1) + '?', 'Delete', 'Keep it'))) return;
    const rec = RR.Sets.update(M.setId, s => { s.melodies.splice(i, 1); });
    if (!rec) return;
    M.changed = true;
    // the one after it (or before, if it was the last); none left: a blank new one
    load(rec.melodies.length ? Math.min(i, rec.melodies.length - 1) : null, rec.melodies[i - 1] || M.melody);
    RR.toast('Slide ' + (i + 1) + ' deleted');
  }
  function leave(saved) {
    stopHear(); pop(false);
    M.active = false;
    $('#app').classList.remove('making');
    const setId = M.setId;
    G.applyInstrument();
    if ((saved || M.changed) && G.setup.set === setId) { G.queue = []; G.newRound(); } else G.draw();
    if (RR.Melodies) RR.Melodies.open(setId);
  }
  async function cancel() {
    const other = M.changed ? ' (the other slides are saved)' : '';
    if (M.dirty && M.melody.notes.length && !(await RR.ask('Leave without saving this slide?' + other, 'Leave', 'Keep writing'))) return;
    leave(false);
  }
  /* Save: this slide, then back to the set (a blank new slide after others: nothing to save, just back) */
  async function save() {
    const set = RR.Sets.get(M.setId);
    if (!hasNotes() && !(M.index === null && !M.melody.notes.length && set && set.melodies.length)) { RR.toast('Write at least one note first — strike a bar'); return; }
    if (!(await commit())) return;
    RR.toast('Saved in ' + RR.Sets.get(M.setId).title);
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
  function slidesHtml() {
    const set = RR.Sets.get(M.setId), mels = set ? set.melodies : [];
    const chips = mels.map((m, i) => '<button type="button" class="mk-slide' + (i === M.index ? ' on' : '') + '" data-slide="' + i + '" aria-pressed="' + (i === M.index) + '"' +
      ' title="Slide ' + (i + 1) + (m.title ? ': ' + RR.esc(m.title) : '') + '" aria-label="Slide ' + (i + 1) + (m.title ? ', ' + RR.esc(m.title) : '') + (i === M.index ? ', on the stand' : '') + '">' + (i + 1) + '</button>');
    if (M.index === null) chips.push('<button type="button" class="mk-slide on new" aria-pressed="true" aria-label="Slide ' + (mels.length + 1) + ', new, on the stand" title="A new slide">' + (mels.length + 1) + '</button>');
    return chips.join('');
  }
  function render() {
    if (!M.active) return;
    // the slides
    const strip = $('#mk-slides');
    strip.innerHTML = slidesHtml();
    const cur = strip.querySelector('.mk-slide.on');
    if (cur) { const l = cur.offsetLeft - strip.offsetLeft, r = l + cur.offsetWidth; if (l < strip.scrollLeft) strip.scrollLeft = l - 6; else if (r > strip.scrollLeft + strip.clientWidth) strip.scrollLeft = r - strip.clientWidth + 6; }
    $('#mk-del').hidden = M.index === null;
    $('#mk-new').classList.toggle('ready', full());
    // the palette
    $('#mk-values').innerHTML = VALUES.map(v => '<button type="button" class="mk-val' + (v.t === M.value ? ' on' : '') + (fits(v.t) ? '' : ' no') + '" data-t="' + v.t + '" aria-pressed="' + (v.t === M.value) + '" title="' + v.about + '"><span class="pic">' + valuePic(v.t) + '</span><b>' + v.name + '</b></button>').join('');
    $('#mk-rest').disabled = full();
    $('#mk-undo').disabled = !M.melody.notes.length;
    $('#mk-time').querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.v === M.melody.time[0]));
    $('#mk-bars').querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.v === M.bars));
    const u = used(), bt = barTicks();
    $('#mk-status').textContent = full() ? 'Full ✓' : (M.bars > 1 ? 'Bar ' + (Math.floor(u / bt) + 1) + ' of ' + M.bars + ' · ' : '') + beatsWord(roomInBar()) + ' left' + (M.bars > 1 && Math.floor(u / bt) + 1 < M.bars ? ' in this bar' : '');
    $('#mk-status2').textContent = $('#mk-status').textContent;
    $('#mk-save').classList.toggle('ready', full());
    // the slide's button in the dock: its time and length (and name) — its window changes them
    const name = ($('#mk-title').value || '').trim();
    $('#mk-opts').textContent = '✎ ' + M.melody.time[0] + '/4 · ' + (M.bars === 1 ? '1 bar' : '2 bars');
    $('#mk-opts').title = (name ? '“' + name + '” · ' : '') + 'The slide’s name, time and length';
    $('#mk-opts').setAttribute('aria-label', 'This slide: ' + (name ? name + ', ' : '') + M.melody.time[0] + '/4, ' + (M.bars === 1 ? 'one bar' : 'two bars') + '. Its name, time and length');
    // the music: what is written, then the empty rest of the bars, faint
    const music = $('#music');
    const fitW = music.clientWidth, fitH = music.clientHeight;
    if (!fitW || !fitH) { music.innerHTML = ''; return; }          // no room: never the music that was there before
    const written = M.melody.notes.length;
    const card = { time: M.melody.time, notes: M.melody.notes.concat(fillers()) };
    // the tight row (Teach Me to Read's: less room above and below the staff) and as big as it fits — up to a
    // smartboard's 46 (it was capped at 30, in the full row, under two rows of controls). Two bars may draw as
    // two rows, a bar each, when that is bigger (a phone held upright: there the width is what runs out)
    const rowH = RR.Eng.rowSpaces(true, true);
    let tick = 0;
    const cut = card.notes.findIndex(n => { const at = tick; tick += n.t; return at === bt; });
    const plan = split => {
      const ranges = split ? [[0, cut], [cut, card.notes.length]] : [[0, card.notes.length]];
      const rows = ranges.map(([a, b], r) => ({ a, b, card: { time: card.time, notes: card.notes.slice(a, b) }, noTime: r > 0, endBar: split && r === 0 ? 'single' : 'final' }));
      const widest = Math.max.apply(null, rows.map(x => { const mm = RR.Eng.measure(x.card, false, x.noTime); return mm.prefix + mm.notes * 0.95 + mm.fixed; }));
      return { rows, ss: Math.max(8, Math.min(fitH / (rowH * rows.length), fitW / widest, 46)) };
    };
    let lay = plan(false);
    if (M.bars === 2 && cut > 0) { const two = plan(true); if (two.ss > lay.ss * 1.04) lay = two; }
    const states = card.notes.map((n, i) => i < written ? 'lit' : 'todo'), next = full() ? -1 : written;
    music.setAttribute('aria-label', 'Your melody: ' + M.melody.notes.filter(n => n.p).length + ' notes so far. ' + $('#mk-status').textContent + '.');
    const svgs = lay.rows.map(x => RR.Eng.render(x.card, {
      ss: lay.ss, maxW: fitW, maxStretch: lay.rows.length > 1 ? 3 : 1.9, noTime: x.noTime, endBar: x.endBar,
      colour: 'always', states: states.slice(x.a, x.b), noHalo: true,
      faintFrom: Math.max(0, written - x.a), nextIdx: next >= x.a && next < x.b ? next - x.a : -1, labels: 'letters', tight: true
    }).svg);
    music.innerHTML = svgs.length > 1 ? '<div class="rows">' + svgs.join('') + '</div>' : svgs[0];
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
  $('#mk-slides').addEventListener('click', e => { const b = e.target.closest('[data-slide]'); if (b) go(+b.dataset.slide); });
  $('#mk-new').addEventListener('click', newSlide);
  /* the slide's window (its name, time, length, Delete): from its button in the dock; Done, Escape (app.js) or a
     tap anywhere else closes it — not a tap in a question it asked (changing the time asks first) */
  const popEl = $('#mk-pop');
  function pop(want) {
    if (!!want === !popEl.hidden) return;
    popEl.hidden = !want;
    $('#mk-opts').setAttribute('aria-expanded', String(!!want));
    if (want) { const f = popEl.querySelector('#mk-title'); if (f) f.focus(); }
  }
  $('#mk-opts').addEventListener('click', () => pop(popEl.hidden));
  $('#mk-pop-done').addEventListener('click', () => { pop(false); render(); $('#mk-opts').focus(); });
  $('#mk-title').addEventListener('change', render);
  $('#mk-title').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); pop(false); render(); $('#mk-opts').focus(); } });
  document.addEventListener('pointerdown', e => {
    if (!popEl.hidden && !e.target.closest('#mk-pop') && !e.target.closest('#mk-opts') && !e.target.closest('.modal')) { pop(false); render(); }
  }, true);
  $('#mk-del').addEventListener('click', delSlide);

  RR.Maker = {
    enter, cancel, save, undo, hear, render, add, newSlide, go, delSlide,
    popOpen: () => !popEl.hidden, closePop: () => { pop(false); render(); },
    get active() { return M.active; },
    state: () => M     // for tests
  };
})();

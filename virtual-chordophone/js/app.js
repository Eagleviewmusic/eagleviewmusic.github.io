/* ==========================================================================
   Virtual Chordophone — app.js                                 VC.app
   --------------------------------------------------------------------------
   The page: the chord boxes (most of the screen), the top bar (key, chord
   set, BPM, time signature, the beat and Play), each box's settings, the
   app's settings, and what is kept on this device.

   A CHORD BOX has three parts (2026-11-22, the user swapped the first two):
     • the main area = STRIKE         the whole chord once, ringing while held —
                          tap it in your own rhythm
     • HOLD (bottom-left corner)      hold it: the chord plays its pre-built
                          rhythm (four quarter notes to start), in step with the BPM
     • ⚙ (top-right corner)          this chord's settings: its rhythm (block
                          chords, arpeggios, your own) and its notes — the notes
                          part is "Coming soon" for now (NOTES_EDITING below)
   Keys: F S D A · G R · E W Q strike the boxes (as in Digital Accordion and
   Song Writer); with Shift held, or Caps Lock on, they Hold. Space = Play / Stop.

   KEPT ON THIS DEVICE (localStorage `virtual_chordophone_v1`): the key,
   set, tempo, time signature, sound and levels, every box's chord, notes
   and rhythm, and the beat (a copy).
   ========================================================================== */
(function () {
  'use strict';
  const VC = window.VC;
  const C = VC.chords, R = VC.rhythm, P = VC.player;
  const T = Theory;
  const STORE = 'virtual_chordophone_v1';
  const THEME = 'virtual_chordophone_theme_v1';
  const $ = id => document.getElementById(id);
  const esc = C.escapeHtml;
  const boxesEl = $('boxes');

  /* ================= STATE ================= */
  const DEFAULTS = {
    key: 0, set: 'basic', meter: '4/4', bpm: 100, sound: 'piano',
    chordLevel: 0.8, beatLevel: 0.9, clickLevel: 0.5, room: 0.35,
    mono: true, countIn: true, clickAlong: false, names: 'roman', showNotes: true,
    tab: 'rhythm', boxes: {}, beat: null
  };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const num = (x, d) => (typeof x === 'number' && isFinite(x) ? x : d);
  function cleanState(raw) {
    const s = Object.assign({}, DEFAULTS);
    if (!raw || typeof raw !== 'object') return s;
    s.key = Number.isInteger(raw.key) ? ((raw.key % 12) + 12) % 12 : 0;
    s.set = C.SETS.some(x => x.id === raw.set) ? raw.set : 'basic';
    s.meter = R.meterOf(raw.meter).id;
    s.bpm = clamp(Math.round(num(raw.bpm, 100)), 30, 300);
    s.sound = typeof raw.sound === 'string' ? raw.sound : 'piano';
    ['chordLevel', 'beatLevel', 'clickLevel', 'room'].forEach(k => { s[k] = clamp(num(raw[k], DEFAULTS[k]), 0, 1.5); });
    ['mono', 'countIn', 'clickAlong', 'showNotes'].forEach(k => { s[k] = typeof raw[k] === 'boolean' ? raw[k] : DEFAULTS[k]; });
    s.names = raw.names === 'letter' ? 'letter' : 'roman';
    s.tab = raw.tab === 'notes' ? 'notes' : 'rhythm';
    const m = R.meterOf(s.meter);
    s.boxes = {};
    if (raw.boxes && typeof raw.boxes === 'object') C.PLACES.forEach(p => {
      const b = raw.boxes[p];
      if (!b || typeof b !== 'object') return;
      const o = {};
      const sp = C.parse(b.spec);
      if (sp && !C.sameSpec(sp, C.defaultSpec(p))) o.spec = sp;
      const v = C.cleanVoice(b.voice);
      if (v) o.voice = v;
      if (b.rhythm) o.rhythm = R.clean(b.rhythm, m);
      s.boxes[p] = o;
    });
    s.beat = VC.beat.cleanBeat(raw.beat);
    if (s.beat && s.beat.meter !== s.meter) s.beat = null;
    return s;
  }
  let S = cleanState((() => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { return null; } })());
  if (!Audio.PRESETS[S.sound]) S.sound = 'piano';
  let saveTimer = null;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) {} }, 150);
  }
  const meter = () => R.meterOf(S.meter);

  /* ================= THE SKELETON =================
     2026-11-22, the user: "I'm going to use this app tomorrow for a very specific purpose … let's create a
     skeleton version of what I need, and hide the rest of the code — we'll get it all out later. Only I IV V
     vi IV/IV, just in the key of D. The chord name (D G A Bm C) large, the roman numeral under it — larger."
     While SKELETON is set:
       • the key is D or A (the same night, the user: "I do actually need this to change to a different key, but
         only to the key of A … default is D"): the key arrows and the key tile's picker step between the two;
         every page opens on D; the choice is not saved (S.key on the device stays as it was)
       • the Basic · Full · Extended choice is hidden
       • the boxes are I IV V vi IV/IV = D G A Bm C (keys F S D A W)
       • the letter name is the big name, the numeral under it, larger (body.skeleton in style.css);
         Settings' "Big name" choice is hidden
     Nothing is removed — every other key, chord set and the names choice are all still here, only hidden,
     and the saved key/set/names on the device are not touched. Set SKELETON to null to bring everything back. */
  const SKELETON = { key: 2, keys: [2, 9], places: ['f', 's', 'd', 'a', 'w'], names: 'letter' };   // D (default) and A
  let skeletonKey = SKELETON ? SKELETON.key : null;
  const keyNow = () => (SKELETON ? skeletonKey : S.key);
  const shown = () => (SKELETON ? SKELETON.places.slice() : C.placesOf(S.set));
  const namesNow = () => (SKELETON ? SKELETON.names : S.names);
  if (SKELETON) document.body.classList.add('skeleton');

  /* ================= A BOX ================= */
  /* CHANGING A CHORD'S NOTES — paused (2026-11-22, the user: "disable the ability to change the notes of the
     chords; this will be added later"). The editor (notesHtml / wireNotes below) is all still here; the
     Chord & notes tab says "Coming soon" instead. While it is off every box plays its own chord, and any
     changes already kept on the device stay in storage, untouched, for when it comes back. Set true to bring it back. */
  const NOTES_EDITING = false;
  const boxOf = p => S.boxes[p] || {};
  const specOf = p => (NOTES_EDITING && C.parse(boxOf(p).spec)) || C.defaultSpec(p);
  const voiceOf = p => (NOTES_EDITING ? C.cleanVoice(boxOf(p).voice) : null);
  const rhythmOf = p => R.clean(boxOf(p).rhythm || R.defaultRhythm(meter()), meter());
  const midisOf = p => C.midis(specOf(p), voiceOf(p), keyNow());
  function setBox(p, patch) {
    const b = Object.assign({}, boxOf(p), patch);
    if (b.spec && C.sameSpec(b.spec, C.defaultSpec(p))) delete b.spec;
    if (!b.voice) delete b.voice;
    if (!b.spec) delete b.spec;
    S.boxes[p] = b;
    save();
    renderBox(p);
    if (sheetPlace === p && isOpen('box-sheet')) renderBoxSheet();
  }

  /* ================= THE BOXES ================= */
  const GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';
  const HOLD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></svg>';
  function nameParts(p) {
    const d = C.describe(specOf(p), voiceOf(p), keyNow());
    return { d, big: namesNow() === 'letter' ? d.letter : d.roman, small: namesNow() === 'letter' ? d.roman : d.letter };
  }
  function stripHtml(p) {
    const r = rhythmOf(p);
    const m = meter();
    const pat = R.pattern(r, m, midisOf(p).length);
    if (pat.held) return '<div class="box-strip held"><i class="held-bar"></i></div>';
    const strip = R.stripOf(pat);
    const M = Math.max(1, midisOf(p).length);
    const hOf = {};
    pat.strikes.forEach(st => {
      if (st.random) hOf[st.c] = -1;
      else if (st.n && st.n.length < M) hOf[st.c] = st.n.reduce((a, b) => a + b, 0) / st.n.length / Math.max(1, M - 1);
    });
    let h = '<div class="box-strip">';
    for (let b = 0; b < m.beats; b++) {
      h += '<span class="sg">';
      for (let i = b * m.per; i < (b + 1) * m.per; i++) {
        const ch = strip[i];
        const hh = hOf[i];
        h += '<i class="c ' + ch.toLowerCase() + (hh !== undefined ? ' dot' : '') + '" data-i="' + i + '"' + (hh !== undefined ? ' style="--h:' + (hh < 0 ? 0.5 : hh).toFixed(2) + '"' : '') + '></i>';
      }
      h += '</span>';
    }
    return h + '</div>';
  }
  function boxHtml(p) {
    const { d, big, small } = nameParts(p);
    const rd = R.describe(rhythmOf(p), meter());
    const tones = S.showNotes ? '<div class="box-tones">' + d.tones.map(t => '<span style="--tc:' + t.color + '">' + esc(t.name) + '</span>').join('') + '</div>' : '';
    return '<div class="box' + (P.isSounding(p) ? ' on' : '') + (d.own ? ' own' : '') + '" data-place="' + p + '" style="--c:' + d.color + '">' +
      '<div class="box-main" data-part="main" role="button" aria-label="Strike ' + esc(d.roman) + '" title="Strike (' + C.KEY_OF(p) + ')">' +
        '<span class="box-key" aria-hidden="true">' + C.KEY_OF(p) + '</span>' +
        '<div class="box-face"><div class="box-name" style="--s:' + C.nameScale(big) + '">' + C.labelHTML(big) + '</div>' +
        '<div class="box-sub">' + C.labelHTML(small) + '</div>' + tones + '</div>' +
        '<div class="box-foot">' + stripHtml(p) + '<div class="box-rhythm">' + esc(rd.title) + '</div></div>' +
      '</div>' +
      '<button class="box-gear" data-part="gear" type="button" aria-label="Settings for ' + esc(d.roman) + '" title="This chord’s settings">' + GEAR + '</button>' +
      '<div class="box-hold" data-part="hold" role="button" aria-label="Hold ' + esc(d.roman) + ': its rhythm" title="Hold: the chord’s rhythm (Shift+' + C.KEY_OF(p) + ', or Caps Lock)">' + HOLD + '<span>Hold</span></div>' +
    '</div>';
  }
  function renderBoxes() {
    boxesEl.innerHTML = shown().map(boxHtml).join('');
    boxesEl.dataset.count = shown().length;
    layoutBoxes();
  }
  function renderBox(p) {
    const el = boxesEl.querySelector('.box[data-place="' + p + '"]');
    if (!el) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = boxHtml(p);
    const nu = tmp.firstChild;
    // keep a press in progress: swap the insides, not the box
    el.className = nu.className;
    el.style.cssText = nu.style.cssText;
    el.innerHTML = nu.innerHTML;
  }
  function layoutBoxes() {
    const n = shown().length;
    const W = boxesEl.clientWidth || window.innerWidth, H = boxesEl.clientHeight || window.innerHeight;
    const ar = W / Math.max(1, H);
    const cols = n === 4 ? (ar > 1.7 ? 4 : 2) : n === 6 ? (ar > 0.95 ? 3 : 2) : 3;
    boxesEl.style.setProperty('--cols', cols);
    boxesEl.style.setProperty('--rows', Math.ceil(n / cols));
    boxesEl.classList.toggle('five-wide', n === 5 && ar > 0.95);
    boxesEl.classList.toggle('five-tall', n === 5 && ar <= 0.95);
  }

  /* lit while sounding; a flash and the strip's cell on every strike */
  function light(p, on) {
    const el = boxesEl.querySelector('.box[data-place="' + p + '"]');
    if (el) el.classList.toggle('on', !!on);
  }
  P.onHit(info => {
    const el = boxesEl.querySelector('.box[data-place="' + info.place + '"]');
    if (!el) return;
    el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit');
    if (info.cell != null) {
      el.querySelectorAll('.box-strip .c.now').forEach(c => c.classList.remove('now'));
      const c = el.querySelector('.box-strip .c[data-i="' + info.cell + '"]');
      if (c) c.classList.add('now');
    }
  });

  /* ================= PLAYING THE BOXES ================= */
  const pointers = new Map();     // pointerId → { key, el }
  boxesEl.addEventListener('pointerdown', e => {
    const box = e.target.closest('.box');
    if (!box) return;
    const partEl = e.target.closest('[data-part]');
    const part = partEl ? partEl.dataset.part : 'main';
    if (part === 'gear') return;                                   // a click opens the settings
    if (e.button !== undefined && e.button > 0) return;
    e.preventDefault();
    const target = partEl || box;
    try { target.setPointerCapture(e.pointerId); } catch (err) {}
    const key = P.press(box.dataset.place, part === 'hold' ? 'pattern' : 'strike');
    target.classList.add('pressed');
    pointers.set(e.pointerId, { key, el: target });
  });
  function endPointer(e) {
    const hold = pointers.get(e.pointerId);
    if (!hold) return;
    pointers.delete(e.pointerId);
    hold.el.classList.remove('pressed');
    if (hold.key) P.release(hold.key);
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => boxesEl.addEventListener(t, endPointer));
  boxesEl.addEventListener('click', e => {
    const g = e.target.closest('.box-gear');
    if (g) openBoxSheet(g.closest('.box').dataset.place);
  });
  boxesEl.addEventListener('contextmenu', e => e.preventDefault());

  /* the computer's keys: F S D A · G R · E W Q strike; with Shift held or Caps Lock on they Hold (the rhythm); Space = Play */
  const CODE_PLACE = { KeyF: 'f', KeyS: 's', KeyD: 'd', KeyA: 'a', KeyG: 'g', KeyR: 'r', KeyE: 'e', KeyW: 'w', KeyQ: 'q' };
  const keysDown = new Map();
  const typing = el => !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (topSheet()) { closeSheet(topSheet()); e.preventDefault(); } return; }
    if (typing(document.activeElement) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (e.repeat) return;
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') document.activeElement.blur();
      togglePlay();
      return;
    }
    const p = CODE_PLACE[e.code];
    if (!p || shown().indexOf(p) === -1) return;
    e.preventDefault();
    if (e.repeat || keysDown.has(e.code)) return;
    const hold = e.shiftKey || (e.getModifierState && e.getModifierState('CapsLock'));
    const key = P.press(p, hold ? 'pattern' : 'strike');
    keysDown.set(e.code, key);
    const el = boxesEl.querySelector('.box[data-place="' + p + '"] [data-part="' + (hold ? 'hold' : 'main') + '"]');
    if (el) { el.classList.add('pressed'); keysDown.set(e.code + ':el', el); }
  });
  document.addEventListener('keyup', e => {
    if (!keysDown.has(e.code)) return;
    const key = keysDown.get(e.code);
    const el = keysDown.get(e.code + ':el');
    keysDown.delete(e.code); keysDown.delete(e.code + ':el');
    if (el) el.classList.remove('pressed');
    if (key) P.release(key);
  });
  window.addEventListener('blur', () => {
    keysDown.forEach((v, k) => { if (!k.endsWith(':el') && v) P.release(v); else if (v && v.classList) v.classList.remove('pressed'); });
    keysDown.clear();
  });

  /* ================= THE TOP BAR ================= */
  function renderTop() {
    const kn = C.keyName(keyNow());
    $('key-name').textContent = kn;
    const letter = kn.charAt(0);
    document.documentElement.style.setProperty('--tonic', T.KEY_COLORS[letter] || '#FF3B30');
    document.documentElement.style.setProperty('--tonic-ink', letter === 'E' || letter === 'G' ? '#1c1c1e' : '#fff');
    $('set-seg').querySelectorAll('button').forEach(b => {
      b.classList.toggle('on', b.dataset.set === S.set);
      b.setAttribute('aria-selected', b.dataset.set === S.set);
      const set = C.SETS.find(x => x.id === b.dataset.set);
      b.title = set.name + ': ' + C.placesOf(set.id).map(p => C.describe(specOf(p), voiceOf(p), keyNow()).roman).join(' ');
    });
    if (document.activeElement !== $('bpm')) $('bpm').value = S.bpm;
    const m = meter();
    $('ts-num').textContent = m.num; $('ts-den').textContent = m.den;
    $('beat-name').textContent = S.beat ? S.beat.title : 'Add a beat';
    $('beat-btn').classList.toggle('has-beat', !!S.beat);
    $('play-btn').title = (S.beat ? 'Play the beat' : 'Play the click') + ' (Space)';
    if (SKELETON) {                                   // the arrows step between the skeleton's keys, and stop at the ends
      const i = SKELETON.keys.indexOf(keyNow());
      $('key-prev').disabled = i <= 0;
      $('key-next').disabled = i >= SKELETON.keys.length - 1;
      $('key-prev').setAttribute('aria-label', i > 0 ? 'Key: ' + C.keyName(SKELETON.keys[i - 1]) : 'Key down');
      $('key-next').setAttribute('aria-label', i < SKELETON.keys.length - 1 ? 'Key: ' + C.keyName(SKELETON.keys[i + 1]) : 'Key up');
    }
    renderDots();
  }
  function renderDots() {
    const n = meter().beats;
    $('beat-dots').innerHTML = Array.from({ length: n }, (x, i) => '<i data-b="' + i + '"></i>').join('');
  }
  $('key-prev').addEventListener('click', () => stepKey(-1));
  $('key-next').addEventListener('click', () => stepKey(1));
  $('key-tile').addEventListener('click', openKeySheet);
  function stepKey(d) {
    if (!SKELETON) { setKey(S.key + d); return; }
    const i = SKELETON.keys.indexOf(keyNow()) + d;
    if (i >= 0 && i < SKELETON.keys.length) setKey(SKELETON.keys[i]);
  }
  function setKey(k) {
    k = ((k % 12) + 12) % 12;
    if (SKELETON) {
      if (SKELETON.keys.indexOf(k) === -1 || k === skeletonKey) return;
      skeletonKey = k;                                // not saved: every page opens on the skeleton's default
    } else {
      S.key = k;
      save();
    }
    renderTop(); renderBoxes();
    if (isOpen('box-sheet')) renderBoxSheet();
  }
  $('set-seg').addEventListener('click', e => {
    const b = e.target.closest('button[data-set]');
    if (!b || b.dataset.set === S.set) return;
    S.set = b.dataset.set;
    P.releaseAll();
    save(); renderTop(); renderBoxes();
  });
  function setBpm(n, fromField) {
    n = clamp(Math.round(n), 30, 300);
    if (!isFinite(n)) return;
    S.bpm = n;
    P.setBpm(n);
    if (!fromField) $('bpm').value = n;
    save();
  }
  $('bpm').addEventListener('input', () => { const n = parseInt($('bpm').value, 10); if (n >= 30 && n <= 300) setBpm(n, true); });
  $('bpm').addEventListener('change', () => { const n = parseInt($('bpm').value, 10); setBpm(isFinite(n) ? n : S.bpm); });
  $('bpm').addEventListener('keydown', e => { if (e.key === 'Enter') $('bpm').blur(); });
  repeatButton($('bpm-down'), () => setBpm(S.bpm - 1));
  repeatButton($('bpm-up'), () => setBpm(S.bpm + 1));
  function repeatButton(btn, fn) {
    let t1 = null, t2 = null;
    const stopIt = () => { clearTimeout(t1); clearInterval(t2); t1 = t2 = null; };
    btn.addEventListener('pointerdown', e => {
      e.preventDefault(); fn();
      t1 = setTimeout(() => { t2 = setInterval(fn, 70); }, 420);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => btn.addEventListener(t, stopIt));
    btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
  }
  $('meter-btn').addEventListener('click', openMeterSheet);
  $('beat-btn').addEventListener('click', () => VC.beat.open());
  $('play-btn').addEventListener('click', togglePlay);
  $('settings-btn').addEventListener('click', openAppSheet);
  function togglePlay() { if (P.playing()) P.stop(); else P.play(); }
  function transportChanged(on) {
    document.body.classList.toggle('playing', !!on);
    $('play-btn').setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  // the beat dots follow what is heard
  (function follow() {
    const pos = P.position();
    const dots = $('beat-dots').children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle('lit', !!pos.running && !pos.counting && pos.beat === i);
      dots[i].classList.toggle('count', !!pos.counting && pos.beat === i);
    }
    document.body.classList.toggle('grid-on', !!pos.running);
    requestAnimationFrame(follow);
  })();

  function setMeter(id) {
    const from = meter(), to = R.meterOf(id);
    if (from.id === to.id) return;
    Object.keys(S.boxes).forEach(p => { if (S.boxes[p].rhythm) S.boxes[p].rhythm = R.refit(S.boxes[p].rhythm, from, to); });
    S.meter = to.id;
    P.setMeter(to);
    save(); renderTop(); renderBoxes();
    if (isOpen('box-sheet')) renderBoxSheet();
  }
  function setBeat(bt, opts) {
    const was = P.playing();
    S.beat = bt ? VC.beat.cleanBeat(bt) : null;
    if (S.beat && S.beat.meter !== S.meter) setMeter(S.beat.meter);
    if (S.beat && opts && opts.tempo) setBpm(S.beat.bpm);
    P.setBeat(S.beat);
    save(); renderTop();
    if (S.beat) toast(was && P.playing() ? S.beat.title + ' comes in at the next bar' : S.beat.title + ' is ready — press Play (Space)');
    else toast('The beat is gone — Play plays a click');
  }

  /* ================= SHEETS ================= */
  const stack = [];
  const isOpen = id => stack.indexOf(id) !== -1;
  const topSheet = () => stack[stack.length - 1] || null;
  function openSheet(id) {
    const el = $(id);
    if (!isOpen(id)) stack.push(id);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('open'));
  }
  function closeSheet(id) {
    const el = $(id);
    const i = stack.indexOf(id);
    if (i !== -1) stack.splice(i, 1);
    el.classList.remove('open');
    el.hidden = true;
    if (id === 'box-sheet') { P.stopHearing(); sheetPlace = null; }
  }
  document.querySelectorAll('.sheet-back').forEach(back => {
    back.addEventListener('pointerdown', e => { if (e.target === back) back.dataset.down = '1'; });
    back.addEventListener('click', e => { if (e.target === back && back.dataset.down) closeSheet(back.id); delete back.dataset.down; });
    back.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeSheet(back.id)));
  });

  let toastTimer = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------------- the key ---------------- */
  function openKeySheet() {
    const order = SKELETON ? SKELETON.keys.slice() : [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];   // round the circle of fifths
    $('key-grid').innerHTML = order.map(k => {
      const n = C.keyName(k);
      return '<button type="button" class="key-pick' + (k === keyNow() ? ' on' : '') + '" data-k="' + k + '" style="--kc:' + (T.KEY_COLORS[n.charAt(0)] || '#888') + '"><b>' + esc(n) + '</b><small>major</small></button>';
    }).join('');
    $('key-grid').querySelectorAll('.key-pick').forEach(b => b.addEventListener('click', () => { setKey(+b.dataset.k); closeSheet('key-sheet'); }));
    openSheet('key-sheet');
  }
  /* ---------------- the time signature ---------------- */
  function openMeterSheet() {
    const list = R.METER_CHOICES.slice();
    if (list.indexOf(S.meter) === -1) list.push(S.meter);
    const locked = !!S.beat;
    $('meter-grid').innerHTML = list.map(id => {
      const m = R.meterOf(id);
      return '<button type="button" class="meter-pick' + (id === S.meter ? ' on' : '') + '" data-m="' + id + '"' + (locked && id !== S.meter ? ' disabled' : '') + '><span class="ts"><b>' + m.num + '</b><b>' + m.den + '</b></span></button>';
    }).join('');
    $('meter-note').textContent = locked ? 'The beat (' + S.beat.title + ') is in ' + S.meter + '. Remove the beat to choose another time signature.' : 'The chords’ rhythms change with it.';
    $('meter-grid').querySelectorAll('.meter-pick:not([disabled])').forEach(b => b.addEventListener('click', () => { setMeter(b.dataset.m); closeSheet('meter-sheet'); }));
    openSheet('meter-sheet');
  }

  /* ---------------- settings ---------------- */
  const SOUND_GROUPS = [
    { label: 'Recorded instruments', ids: window.Samples ? Samples.ids : [] },
    { label: 'Keyboards', ids: ['piano', 'epiano', 'organ'] },
    { label: 'Mallets & plucks', ids: ['marimba', 'bell', 'pluck'] },
    { label: 'Long tones', ids: ['pad', 'strings', 'voice'] },
    { label: 'Simple waves', ids: ['sine', 'triangle', 'square', 'sawtooth'] }
  ];
  function soundOptions() {
    const grouped = new Set(SOUND_GROUPS.flatMap(g => g.ids));
    const extra = Audio.PRESET_ORDER.filter(id => !grouped.has(id));
    const groups = extra.length ? SOUND_GROUPS.concat([{ label: 'More sounds', ids: extra }]) : SOUND_GROUPS;
    return groups.filter(g => g.ids.some(id => Audio.PRESETS[id])).map(g =>
      '<optgroup label="' + esc(g.label) + '">' + g.ids.filter(id => Audio.PRESETS[id]).map(id =>
        '<option value="' + id + '"' + (id === S.sound ? ' selected' : '') + '>' + esc(Audio.PRESETS[id].name) + '</option>').join('') + '</optgroup>').join('');
  }
  const pct = v => Math.round(v * 100);
  function slider(id, label, v) {
    return '<label class="opt"><span>' + label + '</span><input type="range" id="' + id + '" min="0" max="100" value="' + pct(v) + '"></label>';
  }
  function toggle(id, label, on, sub) {
    return '<label class="opt switch-row"><span>' + label + (sub ? '<small>' + sub + '</small>' : '') + '</span><input type="checkbox" class="switch" id="' + id + '"' + (on ? ' checked' : '') + '></label>';
  }
  function openAppSheet() {
    const theme = document.documentElement.dataset.theme || 'auto';
    $('app-body').innerHTML =
      '<section class="sheet-section"><h3>Sound</h3>' +
        '<label class="opt"><span>Instrument</span><select id="set-sound">' + soundOptions() + '</select></label>' +
        '<p class="note" id="sound-status"></p>' +
        slider('set-chord-level', 'Chords', S.chordLevel) +
        slider('set-beat-level', 'Beat', S.beatLevel) +
        slider('set-click-level', 'Click', S.clickLevel) +
        slider('set-room', 'Room (echo)', S.room) +
      '</section>' +
      '<section class="sheet-section"><h3>Playing</h3>' +
        toggle('set-mono', 'One chord at a time', S.mono, 'A new chord takes over from the one before') +
        toggle('set-count', 'Count in', S.countIn, 'One bar of clicks before the beat starts') +
        toggle('set-along', 'Click along with the beat', S.clickAlong, 'With no beat, Play always clicks') +
      '</section>' +
      '<section class="sheet-section"><h3>On the boxes</h3>' +
        (SKELETON ? '' : '<div class="opt"><span>Big name</span><div class="seg small" id="set-names"><button type="button" data-v="roman"' + (S.names === 'roman' ? ' class="on"' : '') + '>Numerals (IV)</button><button type="button" data-v="letter"' + (S.names === 'letter' ? ' class="on"' : '') + '>Letters (F)</button></div></div>') +
        toggle('set-notes', 'Show each chord’s notes', S.showNotes) +
        '<div class="opt"><span>Colours</span><div class="seg small" id="set-theme"><button type="button" data-v="auto"' + (theme === 'auto' ? ' class="on"' : '') + '>Device</button><button type="button" data-v="dark"' + (theme === 'dark' ? ' class="on"' : '') + '>Dark</button><button type="button" data-v="light"' + (theme === 'light' ? ' class="on"' : '') + '>Light</button></div></div>' +
      '</section>' +
      '<section class="sheet-section"><h3>Keys</h3><p class="note keys-note">' + (SKELETON
        ? shown().map(p => '<kbd>' + C.KEY_OF(p) + '</kbd>').join(' ') + ' = ' + shown().map(p => esc(nameParts(p).d.letter)).join(' ') + '.'
        : '<kbd>F</kbd> <kbd>S</kbd> <kbd>D</kbd> <kbd>A</kbd> = I IV V vi · <kbd>G</kbd> <kbd>R</kbd> = ii iii · <kbd>E</kbd> <kbd>W</kbd> <kbd>Q</kbd> = V/V IV/IV V/vi.') + ' A key strikes the chord (it rings while you hold the key). With <kbd>Shift</kbd> held, or <kbd>Caps Lock</kbd> on, a key is <b>Hold</b>: the chord’s rhythm, round and round. <kbd>Space</kbd> plays and stops the beat.</p></section>' +
      '<section class="sheet-section"><h3>Start again</h3><div class="sheet-actions left"><button class="btn ghost" id="set-reset" type="button">Put every chord back as it was</button></div></section>';
    const sel = $('set-sound');
    sel.addEventListener('change', () => { S.sound = sel.value; save(); wantSound(); });
    wantSound();
    const lv = (id, k) => $(id).addEventListener('input', e => { S[k] = e.target.value / 100; P.applyLevels(); save(); });
    lv('set-chord-level', 'chordLevel'); lv('set-beat-level', 'beatLevel'); lv('set-click-level', 'clickLevel'); lv('set-room', 'room');
    const tg = (id, k, after) => $(id).addEventListener('change', e => { S[k] = e.target.checked; save(); if (after) after(); });
    tg('set-mono', 'mono'); tg('set-count', 'countIn'); tg('set-along', 'clickAlong');
    tg('set-notes', 'showNotes', renderBoxes);
    if ($('set-names')) $('set-names').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      S.names = b.dataset.v; save(); renderBoxes();
      $('set-names').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    });
    $('set-theme').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.v === 'auto') { delete document.documentElement.dataset.theme; try { localStorage.removeItem(THEME); } catch (err) {} }
      else { document.documentElement.dataset.theme = b.dataset.v; try { localStorage.setItem(THEME, b.dataset.v); } catch (err) {} }
      $('set-theme').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    });
    let armed = false;
    $('set-reset').addEventListener('click', e => {
      if (!armed) { armed = true; e.target.textContent = 'Sure? Every chord’s rhythm and notes go back'; return; }
      S.boxes = {}; save(); renderBoxes(); renderTop(); closeSheet('app-sheet'); toast('Every chord is back as it was');
    });
    openSheet('app-sheet');
  }
  function wantSound() {
    const st = $('sound-status');
    if (!window.Samples || !Samples.isSampled(S.sound)) { if (st) st.textContent = ''; return; }
    Samples.want(S.sound);
    showSampleStatus();
  }
  function showSampleStatus() {
    const st = $('sound-status');
    if (!st || !window.Samples) return;
    const s = Samples.status(S.sound);
    st.textContent = s.state === 'loading' ? 'Loading ' + Audio.PRESETS[S.sound].name + '… ' + (s.got || 0) + ' of ' + (s.total || '?') + ' notes (a stand-in plays meanwhile)'
      : s.state === 'failed' ? 'Its notes could not be loaded — the stand-in sound plays.' : s.state === 'ready' ? 'Ready.' : '';
  }
  if (window.Samples) Samples.onChange(() => showSampleStatus());

  /* ================= A BOX'S SETTINGS ================= */
  let sheetPlace = null;
  let rhyTab = null;               // 'block' | 'arp' | 'build'
  let arpBy = 'e', buildBy = 'e';
  function openBoxSheet(p) {
    sheetPlace = p;
    rhyTab = null;
    renderBoxSheet();
    openSheet('box-sheet');
  }
  function stepBox(d) {
    const list = shown();
    const i = list.indexOf(sheetPlace);
    sheetPlace = list[(i + d + list.length) % list.length];
    rhyTab = null;
    P.stopHearing();
    renderBoxSheet();
  }
  $('bs-prev').addEventListener('click', () => stepBox(-1));
  $('bs-next').addEventListener('click', () => stepBox(1));
  $('bs-close').addEventListener('click', () => closeSheet('box-sheet'));
  $('bs-hear').addEventListener('click', () => { if (sheetPlace) P.hear(sheetPlace, 2); });
  $('bs-tabs').addEventListener('click', e => {
    const b = e.target.closest('button[data-tab]');
    if (!b) return;
    S.tab = b.dataset.tab; save();
    renderBoxSheet();
  });
  const hearSoon = () => setTimeout(() => { if (sheetPlace) P.hear(sheetPlace, 1); }, 20);

  function renderBoxSheet() {
    const p = sheetPlace;
    if (!p) return;
    const { d, big, small } = nameParts(p);
    $('bs-head').style.setProperty('--c', d.color);
    document.querySelector('#box-sheet .sheet').style.setProperty('--c', d.color);
    $('bs-title').innerHTML = '<span class="bs-big">' + C.labelHTML(big) + '</span><span class="bs-small">' + C.labelHTML(small) + '</span><span class="bs-q">' + esc(d.own ? 'its own notes' : d.mods.length ? '' : d.quality.toLowerCase()) + '</span><kbd>' + C.KEY_OF(p) + '</kbd>';
    $('bs-tabs').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
    $('bs-tabs').querySelector('[data-tab="notes"]').innerHTML = 'Chord &amp; notes' + (NOTES_EDITING ? '' : ' <span class="tab-soon">soon</span>');
    const body = $('bs-body');
    const keepScroll = body.scrollTop;
    if (S.tab === 'notes' && !NOTES_EDITING) {
      body.innerHTML = comingSoonHtml(p);
    } else {
      body.innerHTML = S.tab === 'notes' ? notesHtml(p) : rhythmHtml(p);
      (S.tab === 'notes' ? wireNotes : wireRhythm)(p, body);
    }
    body.scrollTop = keepScroll;
  }

  /* ---------------- Rhythm ---------------- */
  function tabFor(r) {
    if (r.kind === 'held' || (r.kind === 'block' && Number.isInteger(r.preset))) return 'block';
    if (r.kind === 'arp') return 'arp';
    return 'build';
  }
  function miniStrip(r, M) {
    const m = meter();
    const pat = R.pattern(r, m, M);
    if (pat.held) return '<div class="mini-strip held"><i class="held-bar"></i></div>';
    const s = R.stripOf(pat);
    const hOf = {};
    pat.strikes.forEach(st => { if (st.random) hOf[st.c] = Math.random(); else if (st.n && st.n.length < M) hOf[st.c] = st.n.reduce((a, b) => a + b, 0) / st.n.length / Math.max(1, M - 1); });
    let h = '<div class="mini-strip">';
    for (let b = 0; b < m.beats; b++) {
      h += '<span class="sg">';
      for (let i = b * m.per; i < (b + 1) * m.per; i++) {
        const hh = hOf[i];
        h += '<i class="c ' + s[i].toLowerCase() + (hh !== undefined ? ' dot' : '') + '"' + (hh !== undefined ? ' style="--h:' + hh.toFixed(2) + '"' : '') + '></i>';
      }
      h += '</span>';
    }
    return h + '</div>';
  }
  function speedSeg(id, by) {
    const m = meter();
    return '<div class="seg small speed" id="' + id + '">' + R.BYS.map(b => '<button type="button" data-by="' + b + '"' + (b === by ? ' class="on"' : '') + '>' + R.speedName(b, m) + '</button>').join('') + '</div>';
  }
  function rhythmHtml(p) {
    const r = rhythmOf(p), m = meter(), M = midisOf(p).length;
    if (!rhyTab) rhyTab = tabFor(r);
    if (r.kind === 'arp') arpBy = r.by;
    if (r.kind === 'build') buildBy = r.by;
    let h = '<div class="seg sub-tabs" id="rhy-tabs">' +
      [['block', 'Block chords'], ['arp', 'Arpeggios'], ['build', 'Build your own']].map(([k, n]) => '<button type="button" data-rt="' + k + '"' + (k === rhyTab ? ' class="on"' : '') + '>' + n + '</button>').join('') + '</div>';
    if (rhyTab === 'block') {
      h += '<p class="note">The whole chord, in a rhythm. Hold the box and it goes round and round, in step with the BPM.</p><div class="tiles">';
      h += '<button type="button" class="tile' + (r.kind === 'held' ? ' on' : '') + '" data-held>' + miniStrip({ kind: 'held' }, M) + '<b>Ring</b><small>Struck once, rings while you hold</small></button>';
      R.presets(m).forEach((pr, i) => {
        const on = r.kind === 'block' && r.cells === pr.cells;
        h += '<button type="button" class="tile' + (on ? ' on' : '') + '" data-preset="' + i + '">' + miniStrip({ kind: 'block', cells: pr.cells }, M) + '<b>' + esc(pr.label) + '</b>' + (i === 0 ? '<small>To start: every beat</small>' : '') + '</button>';
      });
      h += '</div>';
    } else if (rhyTab === 'arp') {
      h += '<p class="note">The chord’s notes one at a time.</p>' + speedSeg('arp-by', arpBy) + '<div class="tiles">';
      R.ARPS.forEach(a => {
        const on = r.kind === 'arp' && r.arp === a;
        h += '<button type="button" class="tile' + (on ? ' on' : '') + '" data-arp="' + a + '">' + miniStrip({ kind: 'arp', arp: a, by: arpBy }, M) + '<b>' + esc(R.ARP_INFO[a][0]) + '</b><small>' + esc(R.ARP_INFO[a][1]) + '</small></button>';
      });
      h += '</div>';
    } else {
      h += buildHtml(p, r, m, M);
    }
    h += '<div class="sheet-actions"><button class="btn ghost" id="rhy-all" type="button">Use this rhythm for every chord</button></div>';
    return h;
  }
  /* the block rhythm being built: the box's own, else the first pre-built one */
  function blockCells(r, m) { return r.kind === 'block' ? r.cells : R.presets(m)[0].cells; }
  /* the note order being built, for a chord of M notes */
  function buildGrid(r, m, M) {
    if (r.kind === 'build') {
      const cols = r.n === M ? r.cols : R.arpOrder({ o: r.cols, n: r.n }, M);
      return { by: r.by, cols: R.clean({ kind: 'build', by: r.by, n: M, cols }, m).cols };
    }
    const by = buildBy;
    const n = R.colsOf(by, m);
    let cols;
    if (r.kind === 'arp' && r.arp !== 'random') {
      const order = R.arpOrder(r.arp, M);
      const span = R.spanOf(by, m), aspan = R.spanOf(r.by, m);
      cols = Array.from({ length: n }, (x, i) => { const c = i * span; return c % aspan === 0 ? order[(c / aspan) % order.length].slice() : []; });
    } else {
      const order = R.arpOrder('up', M);
      cols = Array.from({ length: n }, (x, i) => order[i % order.length].slice());
    }
    return { by, cols };
  }
  function buildHtml(p, r, m, M) {
    const cells = blockCells(r, m);
    const playing = r.kind === 'block' && !Number.isInteger(r.preset) ? 'block' : r.kind === 'build' ? 'notes' : null;
    let h = '<section class="build-part' + (playing === 'block' ? ' playing' : '') + '"><h4>Block chord rhythm ' + (playing === 'block' ? '<span class="badge">Playing</span>' : '') + '</h4>' +
      '<p class="note">One bar. Tap a step: <b>strike</b> → <b>hold</b> → <b>rest</b>.</p><div class="cell-edit" id="cell-edit">';
    for (let b = 0; b < m.beats; b++) {
      h += '<span class="sg"><em>' + (b + 1) + '</em>';
      for (let i = b * m.per; i < (b + 1) * m.per; i++) h += '<button type="button" class="ce ' + cells[i].toLowerCase() + '" data-i="' + i + '" aria-label="Step ' + (i + 1) + '"></button>';
      h += '</span>';
    }
    h += '</div></section>';
    const g = buildGrid(r, m, M);
    const ms = midisOf(p).slice().sort((a, b) => a - b);
    const names = ms.map(x => C.spellPc(((x - C.tonicMidi(keyNow())) % 12 + 12) % 12, keyNow()));
    h += '<section class="build-part' + (playing === 'notes' ? ' playing' : '') + '"><h4>The notes in order ' + (playing === 'notes' ? '<span class="badge">Playing</span>' : '') + '</h4>' +
      '<p class="note">Tap where each note plays — two or more in a column sound together; an empty column lets the notes ring on.</p>' +
      speedSeg('build-by', g.by) + '<div class="note-grid-wrap"><div class="note-grid" id="note-grid" style="--cols:' + g.cols.length + '">';
    const span = R.spanOf(g.by, m);
    for (let rk = M - 1; rk >= 0; rk--) {
      h += '<span class="ng-name" style="--tc:' + (T.KEY_COLORS[names[rk].charAt(0)] || '#888') + '">' + esc(names[rk]) + '</span>';
      g.cols.forEach((col, ci) => {
        const beatStart = (ci * span) % m.per === 0;
        h += '<button type="button" class="ng' + (col.indexOf(rk) !== -1 ? ' on' : '') + (beatStart ? ' bs' : '') + '" data-r="' + rk + '" data-c="' + ci + '" style="--tc:' + (T.KEY_COLORS[names[rk].charAt(0)] || '#888') + '" aria-label="' + esc(names[rk]) + ', step ' + (ci + 1) + '"></button>';
      });
    }
    h += '</div></div></section>';
    return h;
  }
  function wireRhythm(p, body) {
    const m = meter(), M = midisOf(p).length;
    body.querySelector('#rhy-tabs').addEventListener('click', e => {
      const b = e.target.closest('button[data-rt]'); if (!b) return;
      rhyTab = b.dataset.rt; renderBoxSheet();
    });
    body.querySelectorAll('.tile[data-held]').forEach(b => b.addEventListener('click', () => { setBox(p, { rhythm: { kind: 'held' } }); hearSoon(); }));
    body.querySelectorAll('.tile[data-preset]').forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.preset;
      setBox(p, { rhythm: { kind: 'block', cells: R.presets(m)[i].cells, preset: i } }); hearSoon();
    }));
    body.querySelectorAll('.tile[data-arp]').forEach(b => b.addEventListener('click', () => { setBox(p, { rhythm: { kind: 'arp', arp: b.dataset.arp, by: arpBy } }); hearSoon(); }));
    const ab = body.querySelector('#arp-by');
    if (ab) ab.addEventListener('click', e => {
      const b = e.target.closest('button[data-by]'); if (!b) return;
      arpBy = b.dataset.by;
      const r = rhythmOf(p);
      if (r.kind === 'arp') { setBox(p, { rhythm: { kind: 'arp', arp: r.arp, by: arpBy } }); hearSoon(); }
      else renderBoxSheet();
    });
    const ce = body.querySelector('#cell-edit');
    if (ce) ce.addEventListener('click', e => {
      const b = e.target.closest('button.ce'); if (!b) return;
      const i = +b.dataset.i;
      const c = blockCells(rhythmOf(p), m).split('');
      c[i] = c[i] === 'X' ? (i > 0 && c[i - 1] !== 'R' ? 'O' : 'R') : c[i] === 'O' ? 'R' : 'X';
      setBox(p, { rhythm: { kind: 'block', cells: c.join('') } });
    });
    const bb = body.querySelector('#build-by');
    if (bb) bb.addEventListener('click', e => {
      const b = e.target.closest('button[data-by]'); if (!b) return;
      const r = rhythmOf(p);
      const g = buildGrid(r, m, M);
      const to = b.dataset.by;
      buildBy = to;
      if (r.kind !== 'build') { renderBoxSheet(); return; }
      const fs = R.spanOf(g.by, m), ts = R.spanOf(to, m), n = R.colsOf(to, m);
      const cols = Array.from({ length: n }, (x, j) => { const c = j * ts; return c % fs === 0 && g.cols[c / fs] ? g.cols[c / fs].slice() : []; });
      setBox(p, { rhythm: { kind: 'build', by: to, n: M, cols } });
    });
    const ng = body.querySelector('#note-grid');
    if (ng) ng.addEventListener('click', e => {
      const b = e.target.closest('button.ng'); if (!b) return;
      const r = rhythmOf(p);
      const g = buildGrid(r, m, M);
      const rk = +b.dataset.r, ci = +b.dataset.c;
      const cols = g.cols.map(c => c.slice());
      const at = cols[ci].indexOf(rk);
      if (at === -1) { cols[ci].push(rk); cols[ci].sort((x, y) => x - y); tapNote(p, rk); }
      else cols[ci].splice(at, 1);
      setBox(p, { rhythm: { kind: 'build', by: g.by, n: M, cols } });
    });
    body.querySelector('#rhy-all').addEventListener('click', () => {
      const r = rhythmOf(p);
      C.PLACES.forEach(q => { S.boxes[q] = Object.assign({}, boxOf(q), { rhythm: JSON.parse(JSON.stringify(r)) }); });
      save(); renderBoxes();
      toast('Every chord plays ' + R.describe(r, m).title);
    });
  }
  function tapNote(p, rank) {
    P.audio();
    const ms = midisOf(p).slice().sort((a, b) => a - b);
    const mm = ms[rank];
    if (mm === undefined) return;
    const ctx = Audio.ensure();
    Audio.schedule('chords', [440 * Math.pow(2, (mm - 69) / 12)], S.sound, ctx.currentTime + 0.01, 0.35, 1);
  }

  /* ---------------- Chord & notes ---------------- */
  /* while NOTES_EDITING is off: a note in its place, so it is remembered */
  function comingSoonHtml(p) {
    const d = nameParts(p).d;
    return '<div class="soon"><div class="soon-tag">Coming soon</div>' +
      '<p>Changing this chord will be here: a different root or kind, sus2 · sus4 · add9 · ♭7 · maj7, inversions, and choosing its own notes on a keyboard.</p>' +
      '<div class="tone-pills">' + d.tones.map(t => '<span style="--tc:' + t.color + '">' + esc(t.name) + '</span>').join('') + '</div></div>';
  }
  const KB_LO = 36, KB_HI = 84;    // C2 – C6
  function notesHtml(p) {
    const spec = specOf(p), def = C.defaultSpec(p), voice = voiceOf(p);
    const changed = !C.sameSpec({ root: spec.root, q: spec.q, mods: [] }, { root: def.root, q: def.q, mods: [] });
    const defName = C.describe(def, null, keyNow());
    const rootOpts = C.ROOTS.map(rt => {
      const name = C.spellPc(T.degreeSemis(rt), keyNow());
      return '<option value="' + rt + '"' + (rt === spec.root ? ' selected' : '') + '>' + esc(C.romanOfRoot(rt, spec.q).replace(/[^IViv♭♯]+$/, '')) + ' — ' + esc(name) + '</option>';
    }).join('');
    const qList = C.QUALITY_CHOICES.indexOf(spec.q) === -1 ? C.QUALITY_CHOICES.concat([spec.q]) : C.QUALITY_CHOICES;
    const qOpts = qList.map(q => '<option value="' + q + '"' + (q === spec.q ? ' selected' : '') + '>' + esc(T.QUALITIES[q].name) + '</option>').join('');
    let h = '<section class="sheet-section"><h3>The chord</h3><div class="chord-row">' +
      '<label class="opt-inline"><span>Root</span><select id="nt-root">' + rootOpts + '</select></label>' +
      '<label class="opt-inline"><span>Kind</span><select id="nt-q">' + qOpts + '</select></label>' +
      (changed ? '<button class="btn ghost" id="nt-back" type="button">Back to ' + C.labelHTML(defName.roman) + '</button>' : '') + '</div></section>';
    const fx = C.MOD_FUNCS.filter(f => !f.inv), inv = C.MOD_FUNCS.filter(f => f.inv);
    const chip = f => '<button type="button" class="chip' + (spec.mods.indexOf(f.id) !== -1 ? ' on' : '') + '" data-mod="' + f.id + '" title="' + esc(f.does) + '">' + (f.figs ? '<span class="figs"><i>' + f.figs.join('</i><i>') + '</i></span>' : esc(f.name)) + '</button>';
    h += '<section class="sheet-section"><h3>Change it</h3><div class="chips">' + fx.map(chip).join('') + '</div>' +
      '<div class="chips inv"><span class="chips-label">Inversions</span>' + inv.map(chip).join('') + '</div></section>';
    const ms = midisOf(p);
    const lit = new Set(ms);
    h += '<section class="sheet-section"><h3>Its notes' + (voice ? ' <span class="badge">Your own</span>' : '') + '</h3>' +
      '<p class="note">Tap a key to add a note or take one away.' + (voice ? ' Changing the chord above puts its own notes back.' : '') + '</p>' +
      '<div class="kbd-wrap"><div class="kbd" id="nt-kbd" style="--w:' + whiteCount() + '">' + keyboardHtml(lit) + '</div></div>' +
      '<div class="sheet-actions left"><button class="btn ghost" id="nt-down" type="button">▼ Octave down</button><button class="btn ghost" id="nt-up" type="button">▲ Octave up</button>' +
      (voice ? '<button class="btn ghost" id="nt-reset" type="button">The chord’s own notes</button>' : '') + '</div>' +
      '<div class="tone-pills">' + ms.slice().sort((a, b) => a - b).map(x => {
        const n = C.spellPc(((x - C.tonicMidi(keyNow())) % 12 + 12) % 12, keyNow());
        return '<span style="--tc:' + (T.KEY_COLORS[n.charAt(0)] || '#888') + '">' + esc(n) + '<sub>' + (Math.floor(x / 12) - 1) + '</sub></span>';
      }).join('') + '</div></section>';
    return h;
  }
  function keyboardHtml(lit) {
    const whites = [], blacks = [];
    const BLACK = [1, 3, 6, 8, 10];
    let w = 0;
    for (let mm = KB_LO; mm <= KB_HI; mm++) {
      const pc = mm % 12;
      const name = C.spellPc(((mm - C.tonicMidi(keyNow())) % 12 + 12) % 12, keyNow());
      const col = T.KEY_COLORS[name.charAt(0)] || '#888';
      const on = lit.has(mm);
      if (BLACK.indexOf(pc) === -1) {
        whites.push('<button type="button" class="wk' + (on ? ' on' : '') + '" data-m="' + mm + '" style="--tc:' + col + '" aria-label="' + esc(name) + (Math.floor(mm / 12) - 1) + '">' + (pc === 0 ? '<small>C' + (Math.floor(mm / 12) - 1) + '</small>' : '') + (on ? '<b>' + esc(name) + '</b>' : '') + '</button>');
        w++;
      } else {
        blacks.push('<button type="button" class="bk' + (on ? ' on' : '') + '" data-m="' + mm + '" style="--x:' + w + ';--tc:' + col + '" aria-label="' + esc(name) + (Math.floor(mm / 12) - 1) + '">' + (on ? '<b>' + esc(name) + '</b>' : '') + '</button>');
      }
    }
    return '<div class="whites">' + whites.join('') + '</div>' + blacks.join('');
  }
  function whiteCount() { let w = 0; for (let mm = KB_LO; mm <= KB_HI; mm++) if ([1, 3, 6, 8, 10].indexOf(mm % 12) === -1) w++; return w; }
  function wireNotes(p, body) {
    const t0 = () => C.tonicMidi(keyNow());
    // the keyboard opens on the chord's notes
    const wrap = body.querySelector('.kbd-wrap'), lit = body.querySelectorAll('#nt-kbd .on');
    if (wrap && lit.length && wrap.scrollWidth > wrap.clientWidth) {
      const xs = Array.from(lit).map(k => k.offsetLeft + k.offsetWidth / 2);
      wrap.scrollLeft = Math.max(0, (Math.min(...xs) + Math.max(...xs)) / 2 - wrap.clientWidth / 2);
    }
    const keepMods = () => specOf(p).mods;
    const chordChanged = (spec) => {
      const had = !!voiceOf(p);
      setBox(p, { spec, voice: null });
      if (had) toast('Its own notes went back to the chord’s');
      hearChord(p);
    };
    body.querySelector('#nt-root').addEventListener('change', e => chordChanged({ root: e.target.value, q: specOf(p).q, mods: keepMods() }));
    body.querySelector('#nt-q').addEventListener('change', e => chordChanged({ root: specOf(p).root, q: e.target.value, mods: keepMods() }));
    const back = body.querySelector('#nt-back');
    if (back) back.addEventListener('click', () => chordChanged(Object.assign({}, C.defaultSpec(p), { mods: keepMods() })));
    body.querySelectorAll('.chip[data-mod]').forEach(b => b.addEventListener('click', () => chordChanged(C.toggleMod(specOf(p), b.dataset.mod))));
    body.querySelector('#nt-kbd').addEventListener('click', e => {
      const k = e.target.closest('button[data-m]'); if (!k) return;
      const mm = +k.dataset.m;
      const cur = midisOf(p);
      let next;
      if (cur.indexOf(mm) !== -1) {
        if (cur.length <= 1) { toast('A chord needs at least one note'); return; }
        next = cur.filter(x => x !== mm);
      } else {
        if (cur.length >= 8) { toast('Eight notes at most'); return; }
        next = cur.concat([mm]);
        P.audio();
        Audio.schedule('chords', [440 * Math.pow(2, (mm - 69) / 12)], S.sound, Audio.ensure().currentTime + 0.01, 0.4, 1);
      }
      setBox(p, { voice: next.map(x => x - t0()) });
    });
    const shift = d => {
      const cur = midisOf(p);
      if (cur.some(x => x + d < KB_LO || x + d > KB_HI)) { toast(d > 0 ? 'That is as high as it goes' : 'That is as low as it goes'); return; }
      setBox(p, { voice: cur.map(x => x + d - t0()) });
      hearChord(p);
    };
    body.querySelector('#nt-down').addEventListener('click', () => shift(-12));
    body.querySelector('#nt-up').addEventListener('click', () => shift(12));
    const rs = body.querySelector('#nt-reset');
    if (rs) rs.addEventListener('click', () => { setBox(p, { voice: null }); hearChord(p); });
  }
  function hearChord(p) {
    P.audio();
    const ms = midisOf(p);
    Audio.schedule('chords', ms.map(m => 440 * Math.pow(2, (m - 69) / 12)), S.sound, Audio.ensure().currentTime + 0.02, 0.9, 1);
  }

  /* ================= GO ================= */
  VC.app = {
    prefs: () => S,
    state: () => S,
    boxPlay: p => ({ midis: midisOf(p), rhythm: rhythmOf(p), sound: S.sound }),
    light, toast, transportChanged, setBeat,
    openSheet, closeSheet
  };
  P.setMeter(meter());
  P.setBpm(S.bpm);
  P.setBeat(S.beat);
  renderTop();
  renderBoxes();
  window.addEventListener('resize', layoutBoxes);
  if (window.Samples && Samples.isSampled(S.sound)) Samples.want(S.sound);
  // the first touch anywhere wakes the sound, so the first chord is never late
  document.addEventListener('pointerdown', () => P.audio(), { once: true, capture: true });
  document.addEventListener('keydown', () => P.audio(), { once: true, capture: true });
})();

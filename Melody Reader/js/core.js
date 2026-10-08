/* ==========================================================================
   Melody Reader — core.js
   --------------------------------------------------------------------------
   The RR namespace and what every other file leans on:

     the bars      twelve of them, C4 to G5 — id, letter, key, colour,
                   frequency, staff step, height (ENGINE §2.1)
     storage       versioned localStorage keys, every read and write in
                   try/catch; a missing or unreadable key means defaults,
                   never an error (ENGINE §2.4)
     the device    sound, points, stars, folded notes, the current practice
     small helpers $, esc, starsHtml, toast, ask (a yes/no window)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR = window.RR || {};

  RR.$ = sel => document.querySelector(sel);
  RR.now = () => performance.now();
  RR.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  RR.clone = o => JSON.parse(JSON.stringify(o));

  /* ---- the bars ---- */
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  // Rainbow Xylophone's own bar colours (Tailwind red-500 … purple-500)
  const COLOUR = { C: '#ef4444', D: '#f97316', E: '#facc15', F: '#22c55e', G: '#2dd4bf', A: '#3b82f6', B: '#a855f7' };
  const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
  const SEMI = [0, 2, 4, 5, 7, 9, 11];
  RR.LETTERS = LETTERS;
  RR.COLOUR = COLOUR;
  RR.INK = '#2b1d16';
  RR.KEYS = KEYS;
  RR.BARS = KEYS.map((key, i) => {
    const letter = LETTERS[i % 7], octave = 4 + Math.floor(i / 7);
    const midi = (octave + 1) * 12 + SEMI[i % 7];
    return {
      i, id: letter + octave, letter, octave, key, colour: COLOUR[letter], midi,
      freq: 440 * Math.pow(2, (midi - 69) / 12),
      step: LETTERS.indexOf(letter) + 7 * octave,       // E4 = 30 is the bottom line
      len: 100 - i * 4                                    // the bar's height, %
    };
  });
  RR.BAR = {};
  RR.BARS.forEach(b => { RR.BAR[b.id] = b; });
  RR.TEN = RR.BARS.slice(0, 10).map(b => b.id);
  RR.TWELVE = RR.BARS.map(b => b.id);
  RR.STEP = { C4: 28, E4: 30, G4: 32, B4: 34, D5: 36, F5: 38, A5: 40 };

  /* ---- meters (2026-10-07: 6/8 joined 2/4 3/4 4/4) ----
     in ticks, a sixteenth = 1: a bar, a beat (a quarter — or in 6/8 a dotted
     quarter, two to the bar) and how many beats. A melody may also start
     with a pick-up (card.pickup, in ticks): its last bar is that much short */
  RR.METERS = [[2, 4], [3, 4], [4, 4], [6, 8]];
  RR.meter = function (time) {
    const t = Array.isArray(time) && time.length === 2 ? time : [4, 4];
    const compound = t[1] === 8 && t[0] % 3 === 0;
    const barTicks = t[0] * 16 / (t[1] || 4), beatTicks = compound ? 6 : 16 / (t[1] || 4);
    return { barTicks, beatTicks, beats: barTicks / beatTicks, compound };
  };
  RR.meterText = t => t[0] + '/' + t[1];

  /* ---- storage ---- */
  RR.KEY = {
    device: 'rainbow_reader_device_v1',
    scores: 'rainbow_reader_scores_v1',
    mine: 'rainbow_reader_mine_v1',          // the old Mine band — read once, into sessions
    sessions: 'rainbow_reader_sessions_v1',  // My sessions (levels.js)
    levels: 'rainbow_reader_levels_v1'       // your own changes to the fifteen levels (levels.js, 2026-10-08)
  };
  RR.load = function (key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      const v = JSON.parse(raw);
      return v == null ? fallback : v;
    } catch (_) { return fallback; }
  };
  RR.save = function (key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; }
  };

  /* ---- the device: what belongs to this browser, not to a practice ----
     Since 2026-10-08 nothing here shapes what is played: the game, a My
     melodies set and tricky notes used to be the browser's, laid over every
     level and session, and leaked from one into the next. Now each level and
     session has its own, and what is played "just this time" lives with the
     choice (practice.over) and ends when something else is chosen. */
  const DEVICE = {
    v: 1, voice: 'vibraphone', volume: 0.8, points: true, stars: true, celebrate: true,
    folded: {},                 // ⓘ notes folded away, by id
    level: 1,                   // the level last played (a battle's format cards fall back to it)
    practice: null,             // what is playing: { kind: 'level', n | 'session', id | 'custom', practice, from, over }
    player: '',
    players: []                 // first names on a shared computer (players.js)
  };
  RR.device = Object.assign(RR.clone(DEVICE), (function () {
    const d = RR.load(RR.KEY.device, {});
    return d && typeof d === 'object' && !Array.isArray(d) ? d : {};
  })());
  if (!RR.device.folded || typeof RR.device.folded !== 'object') RR.device.folded = {};
  delete RR.device.pace;       // the pace pill's (retired 2026-10-05: the metronome is Off each time the page opens)
  // the browser's game, set and tricky notes (retired 2026-10-08): a set being played is carried over
  // once, as "just this time" on what was playing (app.js restore); the rest is dropped
  RR.oldDeviceSet = typeof RR.device.set === 'string' && RR.device.set ? RR.device.set : null;
  ['game', 'clockSecs', 'song', 'songPicks', 'tricky', 'set'].forEach(k => { delete RR.device[k]; });
  RR.saveDevice = () => RR.save(RR.KEY.device, RR.device);

  /* ---- links: JSON as base64url, UTF-8 safe (lesson and melody-set links) ---- */
  RR.b64enc = function (obj) {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = '';
    bytes.forEach(b => { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  RR.b64dec = function (str) {
    let s = String(str).replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s);
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
  };
  RR.pageBase = () => location.href.split(/[?#]/)[0];

  /* ---- small pieces of UI ---- */
  /* after a melody (2026-10-05): a green check — played through; a gold star — a high score */
  RR.CHECK_SVG = '<svg class="mk-check" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#16a34a"/><path d="M13.5 24.5l7 7 14-15" fill="none" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  RR.STAR_SVG = '<svg class="mk-star" viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3.5l6.2 13 14.2 1.8-10.4 9.8 2.7 14.1L24 35.3l-12.7 6.9 2.7-14.1L3.6 18.3l14.2-1.8z" fill="#fbbf24" stroke="#d97706" stroke-width="2.5" stroke-linejoin="round"/></svg>';
  RR.HOME_SVG = '<svg class="ib" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.2L12 3.8l8.5 7.4M6 9.6V20h4.6v-5.6h2.8V20H18V9.6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  /* a melody in the round, small: its gold star, its check, or a grey dash (missed notes, skipped) */
  RR.markHtml = function (r) {
    if (r && r.gold && RR.device.stars) return '<span class="mk mk-g" title="Gold star">' + RR.STAR_SVG + '</span>';
    if (r && r.made) return '<span class="mk mk-m" title="Played through">' + RR.CHECK_SVG + '</span>';
    return '<span class="mk mk-x" title="' + (r && r.skip ? 'Skipped' : 'Notes missed') + '">–</span>';
  };
  RR.starsHtml = function (n, of) {
    let h = '';
    for (let i = 0; i < (of || 3); i++) h += i < n ? '★' : '<span class="off">★</span>';
    return h;
  };

  let toastTimer = null;
  RR.toast = function (text) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  };

  /* A small yes/no window — the family's "Delete "X"?" pattern.
     Resolves true for yes. */
  RR.ask = function (question, yes, no) {
    return new Promise(resolve => {
      const wrap = document.createElement('div');
      wrap.className = 'modal ask';
      wrap.innerHTML = '<div class="ask-card" role="alertdialog" aria-modal="true"><p>' + RR.esc(question) + '</p>' +
        '<div class="ask-btns"><button type="button" class="pill-btn" data-a="no">' + RR.esc(no || 'Cancel') + '</button>' +
        '<button type="button" class="pill-btn danger" data-a="yes">' + RR.esc(yes || 'Yes') + '</button></div></div>';
      const done = v => { wrap.remove(); document.removeEventListener('keydown', onKey, true); resolve(v); };
      const onKey = e => { if (e.key === 'Escape') { e.stopPropagation(); done(false); } };
      wrap.addEventListener('click', e => {
        const b = e.target.closest('[data-a]');
        if (b) done(b.dataset.a === 'yes'); else if (e.target === wrap) done(false);
      });
      document.addEventListener('keydown', onKey, true);
      document.body.appendChild(wrap);
      wrap.querySelector('[data-a="yes"]').focus();
    });
  };

  /* ---- windows and the keyboard ----
     Tab stays inside the window on top (a yes/no question, the Teacher
     Library shelf, or one of the app's windows), and closing a window puts
     the focus back where it was when the window opened. */
  function topWindow() {
    return document.querySelector('.modal.ask') || document.querySelector('.evm-shelf.show .evm-shelf-panel') ||
      Array.from(document.querySelectorAll('.modal:not([hidden])')).pop() || null;
  }
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const top = topWindow(); if (!top) return;
    const items = Array.from(top.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(x => !x.disabled && x.offsetParent !== null && !x.closest('[hidden]'));
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1], at = document.activeElement;
    if (!top.contains(at)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && at === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
  }, true);
  RR.windowOpened = el => { if (el && el.hidden !== false) el._returnFocus = document.activeElement; };
  RR.windowClosed = el => {
    if (RR.Game && RR.Game.syncTick) setTimeout(RR.Game.syncTick, 0);   // the practice metronome, if it was clicking
    const f = el && el._returnFocus;
    if (el) el._returnFocus = null;
    if (f && document.contains(f) && f.focus && !f.closest('[hidden]')) f.focus();
  };

  /* An explaining note that folds into its ⓘ (the user's rule, D25). */
  RR.note = function (id, text) {
    const f = !!RR.device.folded[id];
    return '<p class="note' + (f ? ' folded' : '') + '" data-fold="' + id + '"><span class="note-text">' + text + ' </span>' +
      '<button class="i-btn" type="button" aria-label="' + (f ? 'Open' : 'Fold') + ' this note" title="' + (f ? RR.esc(text.replace(/<[^>]+>/g, '')) : '') + '">ⓘ</button></p>';
  };
  RR.foldClick = function (e) {
    const b = e.target.closest('.i-btn'); if (!b) return false;
    const p = b.closest('.note'); if (!p) return false;
    p.classList.toggle('folded');
    const f = p.classList.contains('folded');
    RR.device.folded[p.dataset.fold] = f;
    b.setAttribute('aria-label', (f ? 'Open' : 'Fold') + ' this note');
    b.title = f ? p.querySelector('.note-text').textContent.trim() : '';
    RR.saveDevice();
    return true;
  };
})();

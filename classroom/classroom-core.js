/* The Classroom: pieces shared by the student page (index.html) and the teacher page (teacher.html).

   WHERE THE CONTENT LIVES
   lessons.json, next to this file, published with the site. It holds every class: its current
   lesson (the things students see when they tap the class) and its Filing Cabinet (older lessons).
   The teacher page keeps a draft in this browser (localStorage) and saves a new lessons.json to publish.
   Later, a mailbox server can replace the file: only Classroom.loadPublished() needs to change.

   LINKS
   Items are ordinary links from the Eagle View Music apps. A link on eagleviewmusic.com opens INSIDE the
   Classroom (a frame at the same address), so students never leave the page. Any other link opens in a
   new tab. */
(function () {
  'use strict';
  const C = window.Classroom = {};

  C.DRAFT_KEY = 'classroom_draft_v1';
  C.LAST_CLASS_KEY = 'classroom_last_class_v1';

  C.COLORS = [
    { id: 'teal',   main: '#0d9488', soft: '#ccfbf1', ink: '#134e4a' },
    { id: 'purple', main: '#7c3aed', soft: '#ede9fe', ink: '#4c1d95' },
    { id: 'orange', main: '#ea580c', soft: '#ffedd5', ink: '#7c2d12' },
    { id: 'blue',   main: '#0284c7', soft: '#e0f2fe', ink: '#0c4a6e' },
    { id: 'pink',   main: '#db2777', soft: '#fce7f3', ink: '#831843' },
    { id: 'green',  main: '#16a34a', soft: '#dcfce7', ink: '#14532d' },
  ];
  C.color = id => C.COLORS.find(c => c.id === id) || C.COLORS[0];
  C.colorVars = id => { const c = C.color(id); return `--main:${c.main};--soft:${c.soft};--ink:${c.ink}`; };

  /* ---------- the apps, matched on the first folder of a link's path ---------- */
  const APPS = [
    { test: /^song writer\b/i,             name: 'Song Writer',          folder: 'Song Writer 3.5',            emoji: '🎼' },
    { test: /^rainbow-xylophone$/i,         name: 'Rainbow Xylophone',    folder: 'rainbow-xylophone',          emoji: '🌈' },
    { test: /^xylophone-play-along$/i,      name: 'Xylophone Play-Along', folder: 'xylophone-play-along',       emoji: '🎬' },
    { test: /^ostinato builder\b/i,         name: 'Ostinato Builder',     folder: 'Ostinato Builder 2.0',       emoji: '🥁' },
    { test: /^rhythm poetry\b/i,            name: 'Rhythm Poetry',        folder: 'Rhythm Poetry 2.0',          emoji: '📝' },
    { test: /^music stand$/i,               name: 'Music Stand',          folder: 'Music Stand',                emoji: '🎵' },
    { test: /^digital accordion$/i,         name: 'Digital Accordion',    folder: 'Digital Accordion',          emoji: '🪗' },
    { test: /^virtual-keyboard\b/i,         name: 'Virtual Keyboard',     folder: 'virtual-keyboard',           emoji: '🎹' },
    { test: /^solfege tower$/i,             name: 'Solfege Tower',        folder: 'Solfege Tower',              emoji: '🗼' },
    { test: /^melody reader$/i,             name: 'Melody Reader',                                              emoji: '📖' },
    { test: /^virtual-drum-kit$/i,          name: 'Virtual Drum Rack',    folder: 'virtual-drum-kit',           emoji: '🥁' },
    { test: /^virtual-chordophone$/i,       name: 'Virtual Chordophone',  folder: 'virtual-chordophone',        emoji: '🎸' },
    { test: /^stringed-instrument-tuner$/i, name: 'Tuner',                folder: 'stringed-instrument-tuner',  emoji: '🎻' },
    { test: /^bpm-tracker$/i,               name: 'BPM Tap Tempo',        folder: 'BPM-tracker',                emoji: '⏱️' },
    { test: /^recording-studio$/i,          name: 'Recording Studio',     folder: 'recording-studio',           emoji: '🎙️' },
    { test: /^vocal-booth$/i,               name: 'Vocal Booth',          folder: 'vocal-booth',                emoji: '🎤' },
    { test: /^virtual-orchestra$/i,         name: 'Virtual Orchestra',    folder: 'virtual-orchestra',          emoji: '🎺' },
    { test: /^virtual-recorder$/i,          name: 'Virtual Recorder',                                           emoji: '🎶' },
    { test: /^virtual-flute$/i,             name: 'Virtual Flute',                                              emoji: '🎶' },
    { test: /^virtual-clarinet$/i,          name: 'Virtual Clarinet',                                           emoji: '🎷' },
    { test: /^virtual-trumpet$/i,           name: 'Virtual Trumpet',                                            emoji: '🎺' },
  ];
  const ORCHESTRA = { flute: 'Virtual Flute', clarinet: 'Virtual Clarinet', trumpet: 'Virtual Trumpet', recorder: 'Virtual Recorder' };

  // segs = the decoded folders of the link's path. Returns { name, emoji, icon (url or null) }.
  C.appFor = function (segs, onSite) {
    if (!onSite) return { name: 'Web page', emoji: '🔗', icon: null };
    const first = segs[0] || '';
    const a = APPS.find(x => x.test.test(first));
    if (!a) return { name: 'Eagle View Music', emoji: '🦅', icon: null };
    let name = a.name;
    if (/^virtual-orchestra$/i.test(first) && ORCHESTRA[(segs[1] || '').toLowerCase()]) name = ORCHESTRA[segs[1].toLowerCase()];
    return { name, emoji: a.emoji, icon: a.folder ? '../' + encodeURI(a.folder) + '/icon.svg' : null };
  };

  /* Reads a pasted link. Returns { ok, url, onSite, local, framePath, app } or { ok: false, problem }.
     framePath = the address to open inside the Classroom (same site), or null = open in a new tab. */
  C.parseLink = function (text) {
    let s = String(text || '').trim();
    if (!s) return { ok: false, problem: 'empty' };
    if (/^(www\.)?eagleviewmusic\.com(\/|$)/i.test(s)) s = 'https://' + s;
    let u;
    try { u = new URL(s); } catch (e) { return { ok: false, problem: 'notlink' }; }
    if (!/^https?:$/.test(u.protocol)) return { ok: false, problem: 'notlink' };
    const host = u.hostname.toLowerCase();
    const sameOrigin = u.origin === location.origin;
    const onSite = /(^|\.)eagleviewmusic\.com$/.test(host) || sameOrigin;
    const local = !onSite && (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(host) || host.endsWith('.localhost'));
    const segs = u.pathname.split('/').filter(Boolean).map(x => { try { return decodeURIComponent(x); } catch (e) { return x; } });
    return {
      ok: true, url: u.href, onSite, local,
      framePath: onSite ? u.pathname + u.search + u.hash : null,
      app: C.appFor(segs, onSite),
    };
  };

  /* ---------- a title from inside the link (song and lesson links carry their name) ---------- */
  function fromBase64Url(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    const bin = atob(s), out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  async function inflate(bytes, format) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream(format));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  }
  async function decodeValue(v) {
    if (!v) return null;
    if (v.charAt(0) === '~') {   // the apps' short links: '~' + base64url of deflated JSON
      if (typeof DecompressionStream === 'undefined') return null;
      let bytes;
      try { bytes = fromBase64Url(v.slice(1)); } catch (e) { return null; }
      for (const format of ['deflate', 'deflate-raw']) {
        try { return JSON.parse(await inflate(bytes, format)); } catch (e) { /* try the next */ }
      }
      return null;
    }
    try { return JSON.parse(v); } catch (e) { /* not plain JSON */ }
    try { return JSON.parse(new TextDecoder().decode(fromBase64Url(v))); } catch (e) { /* not base64 JSON */ }
    return null;
  }
  function findTitle(obj) {
    let level = [obj];
    for (let depth = 0; depth < 4 && level.length; depth++) {
      const keys = depth < 2 ? ['title', 'songTitle', 'lessonTitle', 'songName', 'name'] : ['title', 'songTitle', 'lessonTitle'];
      for (const k of keys) for (const o of level) {
        const v = o && typeof o === 'object' && !Array.isArray(o) ? o[k] : null;
        if (typeof v === 'string' && v.trim() && v.length <= 80) return v.trim();
      }
      const next = [];
      for (const o of level) if (o && typeof o === 'object') for (const v of Object.values(o)) if (v && typeof v === 'object') next.push(v);
      level = next.slice(0, 300);
    }
    return null;
  }
  C.guessTitle = async function (url) {
    try {
      const u = new URL(url);
      const bags = [new URLSearchParams(u.hash.replace(/^#/, '')), u.searchParams];
      for (const bag of bags) for (const key of ['song', 'lesson', 'work', 'pair', 'layout', 'l']) {
        const v = bag.get(key);
        if (!v) continue;
        const t = findTitle(await decodeValue(v));
        if (t) return t;
      }
      for (const bag of bags) { const t = bag.get('title') || bag.get('name'); if (t && t.length <= 80) return t; }
    } catch (e) { /* no title in this link */ }
    return null;
  };

  /* ---------- the data ---------- */
  C.uid = () => Math.random().toString(36).slice(2, 9);
  C.today = () => {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  C.niceDate = (iso, long) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return '';
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.toLocaleDateString(undefined, long ? { weekday: 'long', month: 'long', day: 'numeric' } : { month: 'short', day: 'numeric' });
  };
  C.newLesson = () => ({ id: C.uid(), title: '', note: '', date: C.today(), items: [] });
  C.newClass = (name, color) => ({ id: C.uid(), name, color, lesson: C.newLesson(), cabinet: [] });
  C.emptyData = () => ({ version: 1, published: null, classes: [C.newClass('6th Grade', 'teal'), C.newClass('5th Grade', 'purple')] });

  // Makes any loaded file safe to use: fills what is missing, drops what is broken.
  C.clean = function (raw) {
    const str = (v, max) => (typeof v === 'string' ? v : '').slice(0, max || 500);
    const item = it => (it && typeof it === 'object' && typeof it.url === 'string' && it.url
      ? { id: str(it.id, 20) || C.uid(), title: str(it.title, 120), url: it.url.slice(0, 20000), note: str(it.note, 300) } : null);
    const lesson = l => {
      l = l && typeof l === 'object' ? l : {};
      return { id: str(l.id, 20) || C.uid(), title: str(l.title, 120), note: str(l.note, 1000),
        date: /^\d{4}-\d{2}-\d{2}$/.test(l.date) ? l.date : C.today(), items: (Array.isArray(l.items) ? l.items : []).map(item).filter(Boolean) };
    };
    const classes = (raw && Array.isArray(raw.classes) ? raw.classes : []).filter(c => c && typeof c === 'object').map(c => ({
      id: str(c.id, 20) || C.uid(), name: str(c.name, 60) || 'Class', color: C.color(c.color).id,
      lesson: lesson(c.lesson), cabinet: (Array.isArray(c.cabinet) ? c.cabinet : []).map(lesson),
    }));
    return { version: 1, published: typeof (raw && raw.published) === 'string' ? raw.published : null, classes };
  };

  // The published file. The ?t= makes sure a fresh copy comes back, not one the browser or the site kept.
  C.loadPublished = async function () {
    const r = await fetch('lessons.json?t=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('lessons.json: ' + r.status);
    return C.clean(await r.json());
  };

  C.readDraft = function () {
    try {
      const d = JSON.parse(localStorage.getItem(C.DRAFT_KEY) || 'null');
      return d && d.data ? { data: C.clean(d.data), basedOn: d.basedOn || null } : null;
    } catch (e) { return null; }
  };
  C.writeDraft = function (draft) {
    try { localStorage.setItem(C.DRAFT_KEY, JSON.stringify(draft)); return true; } catch (e) { return false; }
  };

  // Content only (what students would see), for "is the draft the same as the site?"
  C.sameContent = (a, b) => !!a && !!b && JSON.stringify(a.classes) === JSON.stringify(b.classes);

  C.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // Icon markup for an item's app.
  C.iconHtml = app => (app.icon
    ? `<img src="${C.esc(app.icon)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${app.emoji}'}))">`
    : `<span>${app.emoji}</span>`);
})();

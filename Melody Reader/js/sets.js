/* ==========================================================================
   Melody Reader — sets.js
   --------------------------------------------------------------------------
   RR.Sets — My melodies: melody SETS kept by the family library rules
   (lib/evm-library.js; EVM Library/README.md). App slug `rainbow-reader`,
   kind `set`, storage `rainbow_reader_sets_v1` (an id map).

   A RECORD
     { id: 'set_<ms>_<4>', title, isCustom: true, createdAt, updatedAt,
       melodies: [{ title, time: [4,4], notes: [{ p: 'E4'|null, t }] }],
       received?, receivedAt?, derivedFrom?, book? }
   A melody is one or two whole bars (ticks: four to a quarter); nothing
   crosses a bar line; it has at least one note. normalize() drops anything
   else, and carries the library header through (EVM.carry) so a save
   never loses it.

   THE RULES (the family's):
   • Content key: the melodies, sorted-key JSON. A set with no melodies is
     blank — never filed from a link, a file or the shelf.
   • updatedAt moves only when the melodies or the title change (EVM.stamp).
   • A share link (?set=…) carries the set and — only when it holds exactly
     what is stored — its id and dates (EVM.shareHeader). Opening it files
     it once (EVM.file): the same id or the same content finds the copy
     already here; a newer version replaces it. It arrives `received`:
     read-only. Save my copy makes the student's own, derivedFrom it.
   • The Teacher Library shelf (lib/evm-shelf.js) files sets the same way,
     marked with their `book`; Put back removes them.
   • Backups keep ids, so restoring the same file twice adds nothing.

   THE APP'S OWN, AND YOUR COPIES (2026-10-13, the user's: "I want to be
   able to edit any and everything from the Library. If I change a song
   that is hard-coded into the app, make my own copy of that song — put it
   with the rest of them — not with my sessions — and call it 'my copy'"):
   the Songbook's songs and Practice's six lessons read here as sets of
   their own — 'songbook:<song id>', 'practice:<lesson id>' (get(); never
   stored, never changed). A set's page opens on one like any other; the
   first change (update — a melody written, moved or taken out, the name)
   makes your copy instead: a set "<its name> (my copy)" (my copy 2 …),
   derivedFrom the original's id — the family's own field, so it rides
   through backups and envelopes — the change made in it, and onCopied's
   listeners told (the set's page and Make a melody go on in the copy). A
   lesson's copy is a unit of Practice from the start. The Library, the
   Songs and Practice lists put each copy right after its original
   (teach-data.js), and My melodies leaves them out.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const EVM = window.EVMLibrary;
  const KEY = 'rainbow_reader_sets_v1';
  const APP = 'rainbow-reader';
  const TICKS = [1, 2, 3, 4, 6, 8, 12, 16];
  const MAX_MELODIES = 60;

  /* ---------------- shape ---------------- */
  function normalizeMelody(m) {
    if (!m || typeof m !== 'object') return null;
    const beats = Array.isArray(m.time) && [2, 3, 4].includes(m.time[0]) ? m.time[0] : 4;
    const barTicks = beats * 4;
    const notes = [];
    (Array.isArray(m.notes) ? m.notes : []).forEach(n => {
      if (!n || typeof n !== 'object' || !TICKS.includes(n.t)) return;
      notes.push({ p: n.p && RR.BAR[n.p] ? n.p : null, t: n.t });
    });
    let pos = 0;
    for (const n of notes) {
      if (Math.floor(pos / barTicks) !== Math.floor((pos + n.t - 1) / barTicks)) return null;   // crosses a bar line
      pos += n.t;
    }
    if (!notes.length || pos % barTicks || pos / barTicks > 2 || !notes.some(n => n.p)) return null;
    return { title: typeof m.title === 'string' ? m.title.trim().slice(0, 60) : '', time: [beats, 4], notes };
  }
  function normalize(raw, id) {
    const r = raw && typeof raw === 'object' ? raw : {};
    const rec = {
      id: id || r.id,
      title: typeof r.title === 'string' && r.title.trim() ? r.title.trim().slice(0, 60) : 'Untitled set',
      isCustom: true,
      createdAt: Number(r.createdAt) || Date.now(),
      melodies: (Array.isArray(r.melodies) ? r.melodies : []).map(normalizeMelody).filter(Boolean).slice(0, MAX_MELODIES)
    };
    if (Number(r.updatedAt)) rec.updatedAt = Number(r.updatedAt);
    EVM.carry(r, rec);
    return rec;
  }
  const key = rec => rec && Array.isArray(rec.melodies) && rec.melodies.length ? EVM.stableStringify(rec.melodies) : null;
  const fileOpts = received => ({ key, newId: () => EVM.newId('set'), reserved: id => id === 'lesson' || /^lesson_/.test(id), received });

  /* ---------------- storage ---------------- */
  function load() {
    const raw = RR.load(KEY, {});
    const lib = {};
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      Object.keys(raw).forEach(id => { if (raw[id] && typeof raw[id] === 'object') lib[id] = normalize(raw[id], id); });
    }
    return lib;
  }
  // every save moves `rev` on: Teach Me to Read's units are built from sets, and rebuilt only when one changed
  let rev = 0;
  function save(lib) { RR.save(KEY, lib); rev++; }
  function get(id) {
    if (id === 'lesson') return RR.Lesson && RR.Lesson.set;
    if (isBuiltIn(id)) return builtIn(id);
    // a lesson's Song sets (2026-10-08): 'lesson_1', 'lesson_2' … in memory, from the link
    const m = /^lesson_(\d{1,2})$/.exec(id || '');
    if (m) return (RR.Lesson && RR.Lesson.sets && RR.Lesson.sets[+m[1] - 1]) || null;
    return id ? load()[id] || null : null;
  }

  /* ---------------- the app's own, and your copies ---------------- */
  const isBuiltIn = id => /^(songbook|practice):/.test(id || '');
  /* the Songbook's song or Practice's lesson as a set (null when there is none by that id) */
  function builtIn(id) {
    const m = /^(songbook|practice):(.+)$/.exec(id || ''); if (!m) return null;
    let title, mels;
    if (m[1] === 'songbook') {
      const song = RR.SONGS && RR.SONGS[m[2]]; if (!song || !RR.Melody) return null;
      title = song.title;
      mels = RR.Melody.songCards(m[2]).map(c => ({ title: song.title + ' ' + c.part, time: c.time, notes: c.notes }));
    } else {
      const L = (RR.TEACH || []).find(x => x.id === m[2]); if (!L || !RR.teachCards) return null;
      title = L.title + ' · ' + L.name;
      mels = RR.teachCards(L).map(c => ({ title: '', time: c.time, notes: c.notes }));
    }
    return { id, title, isCustom: false, builtIn: m[1] === 'songbook' ? 'song' : 'lesson', createdAt: 0,
      melodies: mels.map(normalizeMelody).filter(Boolean) };
  }
  /* the original a copy was made from ('songbook:…', 'practice:…'), or null */
  const copyOf = rec => rec && typeof rec.derivedFrom === 'string' && isBuiltIn(rec.derivedFrom) ? rec.derivedFrom : null;
  const listeners = [];
  /* the first change to the app's own: your copy, with the change in it */
  function copyOnWrite(id, fn) {
    const src = builtIn(id); if (!src) return null;
    const lib = load(), titles = Object.keys(lib).map(k => lib[k].title.toLowerCase());
    let title = src.title + ' (my copy)';
    for (let n = 2; titles.includes(title.toLowerCase()); n++) title = src.title + ' (my copy ' + n + ')';
    const nid = EVM.newId('set'), rec = normalize({ title, melodies: RR.clone(src.melodies) }, nid);
    rec.derivedFrom = id;
    fn(rec);
    rec.title = (rec.title || '').trim().slice(0, 60) || title;
    rec.melodies = rec.melodies.map(normalizeMelody).filter(Boolean).slice(0, MAX_MELODIES);
    EVM.stamp(rec, null, key);
    lib[nid] = rec; save(lib);
    if (src.builtIn === 'lesson' && RR.TeachUnits) RR.TeachUnits.add(nid);      // played the Practice way, with the lessons
    listeners.forEach(f => { try { f(id, rec); } catch (e) { /* one listener's trouble isn't the copy's */ } });
    return rec;
  }

  /* a change to one of your own sets: stamped, saved — to the app's own: your copy */
  function update(id, fn) {
    if (isBuiltIn(id)) return copyOnWrite(id, fn);
    const lib = load(), prev = lib[id];
    if (!prev || prev.received) return null;          // shared sets are never saved into
    const next = normalize(RR.clone(prev), id);
    fn(next);
    next.melodies = next.melodies.map(normalizeMelody).filter(Boolean).slice(0, MAX_MELODIES);
    EVM.stamp(next, prev, key);
    lib[id] = next; save(lib);
    return next;
  }
  function create(title, melodies) {
    const lib = load(), id = EVM.newId('set');
    const rec = normalize({ title, melodies: melodies || [] }, id);
    EVM.stamp(rec, null, key);
    lib[id] = rec; save(lib);
    return rec;
  }
  function remove(id) { const lib = load(); delete lib[id]; save(lib); }
  /* Save my copy: a shared set made the student's own, pointing back at it */
  function saveMyCopy(id) {
    const src = get(id); if (!src) return null;
    const lib = load(), nid = EVM.newId('set');
    const rec = normalize({ title: src.title + ' (my copy)', melodies: RR.clone(src.melodies) }, nid);
    rec.derivedFrom = src.id;
    EVM.stamp(rec, null, key);
    lib[nid] = rec; save(lib);
    return rec;
  }

  /* the list, the way the window shows it: books, then shared, then yours */
  function list() {
    const lib = load();
    return Object.keys(lib).map(id => lib[id]).sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
  }

  /* ---------------- links ---------------- */
  function shareLink(id) {
    const rec = get(id); if (!rec || /^lesson(_\d+)?$/.test(id)) return '';
    const data = Object.assign({ title: rec.title, melodies: rec.melodies }, EVM.shareHeader(rec, key));
    return RR.pageBase() + '?set=' + RR.b64enc(data);
  }
  /* A set from a link or a file, ready for EVM.file: the sender's id and
     dates kept — and left out when there are none, so EVM.file never takes
     "now" for a stamp and writes it over a set that is here. */
  function incoming(src, fallbackTitle) {
    const rec = normalize(Object.assign({}, src, { title: src.title || fallbackTitle }), src.id || 'incoming');
    if (!src.id || /^lesson(_\d+)?$/.test(src.id)) delete rec.id;
    if (!src.createdAt) delete rec.createdAt;
    if (!src.updatedAt) delete rec.updatedAt;
    return rec;
  }
  /* ?set= in the address: filed once (a page in a Google Site opens with its link on every visit) */
  function receiveFromUrl() {
    const q = new URLSearchParams(location.search);
    if (!q.has('set')) return null;
    let data = null;
    try { data = RR.b64dec(q.get('set')); } catch (_) { data = null; }
    try { history.replaceState(null, '', RR.pageBase()); } catch (_) { /* fine */ }
    if (!data || typeof data !== 'object') { RR.toast("That melody link didn't read"); return null; }
    const lib = load();
    const result = EVM.file(lib, incoming(data, 'Shared melodies'), fileOpts(true));
    if (result.action === 'blank') { RR.toast('That link had no melodies in it'); return null; }
    if (result.id) save(lib);
    return result;
  }

  /* ---------------- backups ---------------- */
  function download() {
    const items = list().filter(r => !(r.received && r.book));   // shelf sets come back from the shelf
    if (!items.length) { RR.toast('No melody sets to back up yet'); return; }
    const data = { app: 'Eagle View Music Melody Reader', version: 1, exportedAt: new Date().toISOString(), count: items.length, items };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'melody-reader-melodies.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    RR.toast('Backup saved to your downloads');
  }
  /* a backup, or a Librarian file (an envelope or a bundle) — see EVM.readItems */
  function restore(json) {
    const found = EVM.readItems(json, { app: APP, looksLike: v => Array.isArray(v.melodies) });
    const lib = load();
    const counts = { added: 0, updated: 0, same: 0, matched: 0, kept: 0, blank: 0 };
    found.forEach(item => {
      const r = EVM.file(lib, incoming(item, 'Melody set'), fileOpts(false));
      counts[r.action] = (counts[r.action] || 0) + 1;
    });
    save(lib);
    const parts = [];
    if (counts.added) parts.push('added ' + counts.added);
    if (counts.updated) parts.push('updated ' + counts.updated);
    if (counts.same + counts.matched) parts.push((counts.same + counts.matched) + ' already here');
    if (counts.kept) parts.push('kept your newer copy of ' + counts.kept);
    if (counts.blank) parts.push('skipped ' + counts.blank + ' empty');
    if (found.otherApp) parts.push(found.otherApp + ' for another app left out');
    return found.length ? parts.join(', ') : 'No melody sets found in that file';
  }

  /* ---------------- the Teacher Library shelf ---------------- */
  function startShelf(onChange) {
    if (!window.EVMShelf) return;
    EVMShelf.init({
      app: APP,
      disabled: !!(RR.Game && RR.Game.inLesson && RR.Game.inLesson()),
      load, save,
      incoming: rec => normalize(Object.assign({}, rec), rec.id),
      key,
      words: 'melody sets',
      changed: summary => { if (onChange) onChange(summary); },
      openSong: id => { if (RR.Melodies) RR.Melodies.open(id); }
    });
    EVMShelf.sync().then(s => { if (s && s.added && s.added.length) RR.toast(s.added.length === 1 ? 'A new melody set from the Teacher Library' : s.added.length + ' new melody sets from the Teacher Library'); });
  }

  /* every pitch a set uses */
  function notesOf(rec) {
    const set = new Set();
    (rec && rec.melodies || []).forEach(m => m.notes.forEach(n => { if (n.p) set.add(n.p); }));
    return set;
  }

  RR.Sets = {
    get rev() { return rev; },
    KEY, APP, normalize, normalizeMelody, key, load, save, get, update, create, remove, saveMyCopy, list,
    shareLink, receiveFromUrl, download, restore, startShelf, notesOf,
    isBuiltIn, copyOf, onCopied: f => listeners.push(f),
    isShelf: rec => !!(rec && rec.received && rec.book)
  };
})();

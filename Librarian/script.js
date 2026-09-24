/* ==========================================================================
   Librarian — Eagle View Music
   --------------------------------------------------------------------------
   Turns a teacher's own songs into Teacher Library files.

   Every app lives on the same site (eagleviewmusic.com), so this page can
   read their libraries straight out of localStorage — nothing has to be
   exported from the apps first. It never writes to them.

   For each song ticked it downloads one EVM envelope (see
   ../EVM Library/README.md, §7), named  <app>--<id>.json  so that
   publishing the same song again replaces its file on GitHub instead of
   adding a second one. The GitHub Action in the live repo rebuilds
   Teacher Library/index.json from the files; the apps read that.

   What is never offered: built-ins, sandboxes, lesson exercises, and blank
   songs (the apps would refuse a blank one anyway).
   ========================================================================== */
(function () {
  'use strict';
  const EVM = window.EVMLibrary;
  const $ = id => document.getElementById(id);

  const REPO = 'Eagleviewmusic/eagleviewmusic.github.io';
  const FOLDER = 'Teacher Library';
  const UPLOAD_URL = `https://github.com/${REPO}/upload/main/${encodeURIComponent(FOLDER)}`;
  const FOLDER_URL = `https://github.com/${REPO}/tree/main/${encodeURIComponent(FOLDER)}`;
  const INDEX_URL = '../' + encodeURIComponent(FOLDER) + '/index.json';
  const BOOKS_URL = '../' + encodeURIComponent(FOLDER) + '/books.json';
  const GH = window.LibGitHub;

  /* ------------------------------------------------------------------
     THE APPS — where each keeps its library, and what counts as blank.
     Song Writer 1.0 and 2.0 publish under one slug: a 1.0 song goes as
     { content } (1.0's text, which 2.0 also reads), a 2.0 song as
     { score }. When both have the same id, the newer one goes.
     ------------------------------------------------------------------ */
  const SOURCES = [
    {
      app: 'rhythm-poetry', name: 'Rhythm Poetry', key: 'rhythm_poetry_song_library_v3',
      settings: true,
      reserved: id => /^sandbox-(rhythm|poetry)$/.test(id),
      kind: rec => (rec.side === 'rhythm' ? 'rhythm' : 'poem'),
      blank: rec => {
        if (rec.side === 'rhythm') {
          const beats = (rec.rhythmState && rec.rhythmState.beats) || [];
          return !beats.some(b => Array.isArray(b) ? b.some(Boolean) : !!b);
        }
        const p = rec.poetryState || {};
        const words = (p.rawLyrics && p.rawLyrics.length ? p.rawLyrics : (p.words || []))
          .filter(w => w && w !== '-' && String(w).trim() !== '');
        const said = words.join(' ').toLowerCase();
        return !words.length || said === 'start here' || said === 'press the words to edit.';
      }
    },
    {
      app: 'ostinato-builder', name: 'Ostinato Builder', key: 'ostinato_builder_library_v1',
      settings: true,
      reserved: id => id === 'sandbox',
      kind: () => 'ostinato',
      blank: rec => !(rec.tracks || []).some(t => (t.beats || []).some(b => (b.cells || []).some(Boolean)))
    },
    {
      app: 'song-writer', name: 'Song Writer', from: '2.0', key: 'song_writer_2_library_v1',
      builtIns: ['twinkle', 'mary', 'starspangledbanner'],
      reserved: id => id === 'sandbox',
      kind: () => 'song',
      blank: rec => {
        const lines = (rec.score && rec.score.lines) || [];
        const words = [];
        lines.forEach(l => (l.syllables || []).forEach(s => {
          const t = String((s && s.text) || '').trim();
          if (t && t !== '-') words.push(t.toLowerCase());
        }));
        return !words.length || words.join(' ') === 'start here';
      },
      data: rec => (rec.layout ? { score: rec.score, layout: rec.layout } : { score: rec.score }),
      settings: true
    },
    {
      app: 'song-writer', name: 'Song Writer', from: '1.0', key: 'song_writer_library_v1',
      builtIns: ['twinkle', 'mary', 'starspangledbanner'],
      reserved: () => false,
      kind: () => 'song',
      blank: rec => {
        const text = String(rec.content || '');
        const lyric = text.split('\n').some(line => {
          const t = line.trim();
          if (!t || /^\[.*\]$/.test(t)) return false;
          return t.split(/\s+/).some(tok => {
            const m = tok.match(/^(.*)\[(.*)\]$/);
            const w = (m ? m[1] : tok).trim();
            return w && w !== '-';
          });
        });
        const tidy = text.replace(/\s+/g, ' ').trim().toLowerCase();
        return !lyric || tidy === '[key of c] [a] start[d1] here[d1]';
      },
      data: rec => ({ content: rec.content })
    },
    /* Music Stand pairings: a poem and an ostinato kept together, with the
       tempo, intro and sound that suit them. A pairing links to songs in
       the teacher's own Rhythm Poetry and Ostinato Builder, which no
       student has — so what is published carries both of them WHOLE,
       frozen into copies from the apps' libraries at the moment it is
       published (pairingData). One file is then all a student needs.
       A pairing counts as changed when either of its songs has been
       edited since, so it never goes out of date quietly (pairingUpdated). */
    {
      app: 'music-stand', name: 'Music Stand', key: 'music_stand_pairings_v1',
      reserved: id => id === 'sandbox',
      kind: () => 'pairing',
      blank: rec => !PAIR_SIDES.some(side => hasSong(rec.songs && rec.songs[side])),
      data: rec => pairingData(rec),
      updatedAt: rec => pairingUpdated(rec),
      detail: rec => PAIR_SIDES.map(side => {
        const s = rec.songs && rec.songs[side];
        if (!hasSong(s)) return null;
        const live = linkedRecord(side, s);
        return (live && live.title) || s.title || (side === 'poem' ? 'a poem' : 'an ostinato');
      }).filter(Boolean).join(' + '),
      parts: rec => PAIR_SIDES.map(side => {
        const s = rec.songs && rec.songs[side];
        return s && s.src === 'library' && s.id && !/^sandbox/.test(s.id) ? PAIR_APPS[side].app + '|' + s.id : null;
      }).filter(Boolean)
    }
  ];

  const APP_ORDER = ['rhythm-poetry', 'ostinato-builder', 'song-writer', 'music-stand'];
  const APP_NAMES = { 'rhythm-poetry': 'Rhythm Poetry', 'ostinato-builder': 'Ostinato Builder', 'song-writer': 'Song Writer', 'music-stand': 'Music Stand' };
  const KIND_NAMES = { poem: 'Poem', rhythm: 'Rhythm', ostinato: 'Ostinato', song: 'Song', pairing: 'Arrangement' };

  /* ------------------------------------------------------------------
     PAIRINGS' SONGS. Each side of a pairing is either a link to a song in
     the teacher's app library ({ src: 'library', id, data }) or the
     stand's own copy ({ src: 'data', data }). A link is resolved against
     the app's library as it is NOW — the stand itself would open that
     version — and falls back to the copy the stand kept if the song has
     gone. Everything published is a copy: { src: 'data', title, data }.
     ------------------------------------------------------------------ */
  const PAIR_SIDES = ['poem', 'ost'];
  const PAIR_APPS = {
    poem: { app: 'rhythm-poetry', key: 'rhythm_poetry_song_library_v3' },
    ost:  { app: 'ostinato-builder', key: 'ostinato_builder_library_v1' }
  };
  const SONG_HEADER = ['id', 'createdAt', 'updatedAt', 'isCustom', 'received', 'receivedAt',
                       'derivedFrom', 'book', 'sandbox', 'savedAt'];
  const hasSong = s => !!(s && typeof s === 'object' && (s.data || s.id));
  let partLibs = {};              // app libraries read for this collect()

  function linkedRecord(side, song) {
    if (!song || song.src !== 'library' || !song.id || /^sandbox/.test(song.id)) return null;
    const key = PAIR_APPS[side].key;
    if (!partLibs[key]) partLibs[key] = readLibrary(key);
    const rec = partLibs[key][song.id];
    return rec && typeof rec === 'object' ? rec : null;
  }

  function frozenSong(side, song) {
    if (!hasSong(song)) return null;
    const live = linkedRecord(side, song);
    const from = live || song.data;
    if (!from || typeof from !== 'object') return null;
    const data = {};
    Object.keys(from).forEach(k => { if (SONG_HEADER.indexOf(k) === -1) data[k] = from[k]; });
    /* Its Layout Settings (EASY's rhythm choices among them): the song's
       own, or else the ones the stand kept with its copy — which are what
       the pane showed. Without them a student's stand would fall back to
       that student's own settings. */
    if (!data.layout && song.data && song.data.layout) data.layout = song.data.layout;
    const title = (live && live.title) || song.title || data.title || '';
    if (title) data.title = title;
    return { src: 'data', id: null, title: title, data: data };
  }

  function pairingData(rec) {
    const songs = {};
    PAIR_SIDES.forEach(side => { songs[side] = frozenSong(side, rec.songs && rec.songs[side]); });
    const out = { songs: songs, settings: rec.settings || {} };
    // how each pane is shown — dots or EASY, text size, lyric font…
    if (rec.views && typeof rec.views === 'object') out.views = rec.views;
    return out;
  }

  function pairingUpdated(rec) {
    let t = 0;
    PAIR_SIDES.forEach(side => {
      const live = linkedRecord(side, rec.songs && rec.songs[side]);
      if (live) t = Math.max(t, Number(live.updatedAt || live.createdAt) || 0);
    });
    return t;
  }

  let items = [];              // everything offered, one per app + id
  let published = null;       // { 'app|id': indexEntry } — null until read, false if unreachable
  let filter = 'all';
  const ticked = new Set();

  /* ------------------------------------------------------------------
     BOOKS. Every published song stands in a book on the students' shelf.
     Which book is the Librarian's own note (librarian_books_v1, keyed
     app|id) — it never writes to an app's library — and, for a song
     already published, the book it was published in is the default, so
     another computer starts from what is on the shelf.
     ------------------------------------------------------------------ */
  const BOOKS_KEY = 'librarian_books_v1';
  const DEFAULT_BOOK = 'More songs';
  let bookNotes = {};
  try { bookNotes = JSON.parse(localStorage.getItem(BOOKS_KEY) || '{}') || {}; } catch (e) { bookNotes = {}; }
  function saveBookNotes() { try { localStorage.setItem(BOOKS_KEY, JSON.stringify(bookNotes)); } catch (e) {} }
  const tidyBook = b => String(b || '').replace(/\s+/g, ' ').trim().slice(0, 60);

  function bookOf(item) {
    const k = item.app + '|' + item.id;
    if (bookNotes[k] !== undefined) return tidyBook(bookNotes[k]);
    const e = published && published[k];
    return e && e.book ? tidyBook(e.book) : '';
  }
  function setBook(item, name) {
    bookNotes[item.app + '|' + item.id] = tidyBook(name);
    saveBookNotes();
  }
  function knownBooks() {
    const names = new Set();
    Object.keys(bookNotes).forEach(k => { if (tidyBook(bookNotes[k])) names.add(tidyBook(bookNotes[k])); });
    if (published) Object.keys(published).forEach(k => { if (published[k].book) names.add(tidyBook(published[k].book)); });
    return [...names].sort((a, b) => a.localeCompare(b));
  }

  /* ---------------- reading the apps' libraries ---------------- */
  function readLibrary(key) {
    try {
      const raw = localStorage.getItem(key);
      const lib = raw ? JSON.parse(raw) : null;
      return lib && typeof lib === 'object' ? lib : {};
    } catch (e) { return {}; }
  }

  function collect() {
    partLibs = {};
    const byKey = new Map();
    SOURCES.forEach(src => {
      const lib = readLibrary(src.key);
      Object.keys(lib).forEach(id => {
        const rec = lib[id];
        if (!rec || typeof rec !== 'object') return;
        if (src.reserved(id) || /^lesson_/.test(id)) return;
        const builtIn = rec.isCustom === false ||
          (src.builtIns && src.builtIns.indexOf(id) !== -1 && rec.isCustom !== true);
        if (builtIn) return;
        // a book taken off the shelf in this browser: already published
        if (rec.received && rec.book) return;
        /* Older songs (Song Writer 1.0's especially) carry no dates. Take
           one from the id ('song_1789512614629…') rather than "now", or
           every download would look like a newer version to the students. */
        const idTime = Number((String(id).match(/_(\d{12,})/) || [])[1]) || 1;
        const createdAt = Number(rec.createdAt) || idTime;
        /* A pairing is as new as the newest of itself and its two songs. */
        const updatedAt = Math.max(Number(rec.updatedAt) || createdAt, src.updatedAt ? src.updatedAt(rec) : 0);
        const item = {
          app: src.app,
          from: src.from || '',
          id: id,
          kind: src.kind(rec),
          title: rec.title || 'Untitled',
          createdAt: createdAt,
          updatedAt: updatedAt,
          received: !!rec.received,
          blank: src.blank(rec),
          /* Pieces keep the Layout Settings they were saved with, and those
             travel with them (record.layout, inside the envelope's data).
             One saved before that has none: say so, since the students
             would get their own settings instead. */
          noSettings: !!src.settings && !rec.layout,
          detail: src.detail ? src.detail(rec) : '',
          parts: src.parts ? src.parts(rec) : [],
          record: Object.assign({}, rec, { id: id, createdAt: createdAt, updatedAt: updatedAt }),
          dataOf: src.data || null
        };
        const k = src.app + '|' + id;
        const had = byKey.get(k);
        if (!had || item.updatedAt > had.updatedAt) byKey.set(k, item);
      });
    });
    items = [...byKey.values()];
  }

  /* ---------------- what is already in the Teacher Library ---------------- */
  async function readPublished() {
    try {
      let index;
      if (GH && GH.connected()) {
        index = (await GH.readJSON('index.json')) || { items: [] };
      } else {
        const res = await fetch(INDEX_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(res.status);
        index = await res.json();
      }
      const map = {};
      (index.items || []).forEach(e => { map[e.app + '|' + e.id] = e; });
      published = map;
    } catch (e) {
      published = false;
    }
  }

  function stateOf(item) {
    if (item.blank) return 'blank';
    if (!published) return 'unknown';
    const e = published[item.app + '|' + item.id];
    if (!e) return 'new';
    if ((bookOf(item) || DEFAULT_BOOK) !== (tidyBook(e.book) || DEFAULT_BOOK)) return 'moved';
    return item.updatedAt > (Number(e.updatedAt) || 0) ? 'changed' : 'published';
  }

  const STATE_LABEL = {
    blank: 'Empty — nothing to publish',
    unknown: '',
    new: 'Not published',
    changed: 'Changed since you published',
    moved: 'Moved to another book',
    published: 'Published'
  };
  const TO_PUBLISH = s => s === 'new' || s === 'changed' || s === 'moved';

  /* ---------------- drawing ---------------- */
  function when(ms) {
    if (!ms) return '';
    const d = new Date(ms);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
  }

  function shown(item) {
    const s = stateOf(item);
    if (filter === 'todo') return TO_PUBLISH(s) || s === 'unknown';
    if (filter === 'published') return s === 'published' || s === 'changed' || s === 'moved';
    return true;
  }

  function render() {
    renderBookNames();
    const groups = $('groups');
    groups.innerHTML = '';
    $('empty').hidden = items.length > 0;

    APP_ORDER.forEach(app => {
      const list = items.filter(i => i.app === app && shown(i))
        .sort((a, b) => (b.updatedAt - a.updatedAt) || a.title.localeCompare(b.title));
      if (!list.length) return;

      const section = document.createElement('section');
      section.className = 'group group-' + app;
      const head = document.createElement('h3');
      head.className = 'group-head';
      head.textContent = APP_NAMES[app];
      section.appendChild(head);

      list.forEach(item => section.appendChild(row(item)));
      groups.appendChild(section);
    });

    if (items.length && !groups.children.length) {
      const none = document.createElement('p');
      none.className = 'none';
      none.textContent = filter === 'todo' ? 'Everything is published and up to date.' : 'Nothing published yet.';
      groups.appendChild(none);
    }
    updateDock();
  }

  function row(item) {
    const k = item.app + '|' + item.id;
    const s = stateOf(item);
    const wrap = document.createElement('div');
    wrap.className = 'item state-' + s;

    const pick = document.createElement('label');
    pick.className = 'item-pick';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = ticked.has(k);
    box.disabled = s === 'blank';
    box.addEventListener('change', () => {
      if (box.checked) ticked.add(k); else ticked.delete(k);
      wrap.classList.toggle('is-ticked', box.checked);
      updateDock();
    });
    wrap.classList.toggle('is-ticked', box.checked);

    const main = document.createElement('span');
    main.className = 'item-main';
    const title = document.createElement('span');
    title.className = 'item-title';
    title.textContent = item.title;
    const meta = document.createElement('span');
    meta.className = 'item-meta';
    const bits = [KIND_NAMES[item.kind] || item.kind];
    if (item.from) bits.push('Song Writer ' + item.from);
    if (item.updatedAt > 1) bits.push('edited ' + when(item.updatedAt));
    meta.textContent = bits.join(' · ');
    main.appendChild(title);
    main.appendChild(meta);
    if (item.detail) {
      const d = document.createElement('span');
      d.className = 'item-detail';
      d.textContent = item.detail;
      main.appendChild(d);
    }
    pick.appendChild(box);
    pick.appendChild(main);

    const side = document.createElement('span');
    side.className = 'item-side';
    if (s !== 'blank') {
      const book = document.createElement('input');
      book.className = 'book-field';
      book.type = 'text';
      book.setAttribute('list', 'book-names');
      book.placeholder = DEFAULT_BOOK;
      book.value = bookOf(item);
      book.title = 'The book this song stands in on the students’ shelf';
      book.setAttribute('aria-label', 'Book for ' + item.title);
      book.addEventListener('change', () => { setBook(item, book.value); render(); });
      side.appendChild(book);
    }
    const tags = document.createElement('span');
    tags.className = 'item-tags';
    if (item.noSettings && s !== 'blank') {
      const t = document.createElement('span');
      t.className = 'tag tag-warn';
      t.textContent = 'No Layout Settings yet';
      t.title = 'This piece was saved before pieces kept their Layout Settings. Open it in the app, set it up, and save it (turn Auto-save on, or Save as…) — then its settings travel with it.';
      tags.appendChild(t);
    }
    /* A pairing carries its songs whole, so it needs nothing else to
       work. Its poem and ostinato can still go out on their own too, for
       students to open in the apps — one tap ticks them. */
    const partItems = (item.parts || []).map(k => items.find(i => i.app + '|' + i.id === k))
      .filter(i => i && !i.blank);
    if (item.app === 'music-stand' && s !== 'blank') {
      const t = document.createElement('span');
      t.className = 'tag';
      t.textContent = 'Carries its poem & ostinato';
      t.title = 'Students need only this file: the poem and the ostinato travel inside it, as they are now in your apps.';
      tags.appendChild(t);
    }
    if (partItems.length) {
      const all = partItems.every(i => ticked.has(i.app + '|' + i.id));
      const b = document.createElement('button');
      b.className = 'text-btn tick-parts';
      b.type = 'button';
      b.textContent = all ? 'Its songs are ticked' : 'Tick its songs too';
      b.title = 'Also publish ' + partItems.map(i => '“' + i.title + '”').join(' and ') +
        ' in their own apps, so students can open them there as well. Not needed for the arrangement itself.';
      b.disabled = all;
      b.addEventListener('click', () => {
        const book = bookOf(item);
        partItems.forEach(i => {
          ticked.add(i.app + '|' + i.id);
          if (book && !bookOf(i)) setBook(i, book);
        });
        render();
      });
      tags.appendChild(b);
    }
    if (item.received) {
      const t = document.createElement('span');
      t.className = 'tag tag-shared';
      t.textContent = 'Shared with you';
      t.title = 'This song came to this browser in a link. You can still publish it.';
      tags.appendChild(t);
    }
    if (STATE_LABEL[s]) {
      const t = document.createElement('span');
      t.className = 'tag tag-' + s;
      t.textContent = STATE_LABEL[s];
      tags.appendChild(t);
    }
    side.appendChild(tags);

    wrap.appendChild(pick);
    wrap.appendChild(side);
    return wrap;
  }

  function renderBookNames() {
    const list = $('book-names');
    list.innerHTML = '';
    knownBooks().forEach(n => {
      const o = document.createElement('option');
      o.value = n;
      list.appendChild(o);
    });
  }

  function updateDock() {
    const n = ticked.size;
    const direct = GH && GH.connected();
    $('dock-count').textContent = n ? `${n} song${n === 1 ? '' : 's'} ticked` : 'Nothing ticked';
    $('download-btn').disabled = !n;
    $('download-btn').textContent = direct
      ? (n ? `Publish ${n} song${n === 1 ? '' : 's'}` : 'Publish')
      : (n ? `Download ${n} file${n === 1 ? '' : 's'}` : 'Download');
    $('download-files-btn').hidden = !direct;
    $('download-files-btn').disabled = !n;
  }

  function setStatus() {
    const el = $('status');
    if (published === null) { el.textContent = 'Checking the Teacher Library…'; el.className = 'status'; return; }
    if (published === false) {
      el.textContent = 'Couldn’t reach the Teacher Library, so this page can’t say what is already published. You can still download and upload.';
      el.className = 'status warn';
      return;
    }
    const n = Object.keys(published).length;
    el.textContent = n
      ? `The Teacher Library holds ${n} song${n === 1 ? '' : 's'}.`
      : 'The Teacher Library is empty so far.';
    el.className = 'status';
  }

  /* ---------------- downloading ---------------- */
  function fileName(item) {
    return item.app + '--' + String(item.id).replace(/[^A-Za-z0-9_.-]/g, '-') + '.json';
  }

  function envelopeOf(item) {
    return EVM.toEnvelope(item.record, {
      app: item.app,
      kind: item.kind,
      book: bookOf(item) || DEFAULT_BOOK,
      dataOf: item.dataOf || undefined
    });
  }

  function download(name, text) {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  /* ------------------------------------------------------------------
     THE INDEX, as the Action writes it (.github/scripts/build-teacher-
     index.js) — the same entries in the same order, so when the Librarian
     writes it itself the Action finds nothing to change.
     ------------------------------------------------------------------ */
  function indexEntry(env, path) {
    const e = {
      app: String(env.app), kind: String(env.kind || 'song'), id: String(env.id),
      title: String(env.title || 'Untitled'),
      updatedAt: Number(env.updatedAt || env.createdAt) || 0,
      path: path
    };
    if (env.book && String(env.book).trim()) e.book = String(env.book).trim();
    return e;
  }
  function indexText(entries) {
    const items = entries.slice().sort((a, b) => (a.book || '').localeCompare(b.book || '') ||
      a.app.localeCompare(b.app) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
    return JSON.stringify({ format: 'evm-index', formatVersion: 1, generatedAt: new Date().toISOString(), items }, null, 2) + '\n';
  }

  /* Connected: the ticked songs go straight into the Teacher Library, one
     commit with the index (and books.json, if a new book appeared). */
  async function publishTicked() {
    const chosen = items.filter(i => ticked.has(i.app + '|' + i.id) && !i.blank);
    if (!chosen.length) return;
    const btn = $('download-btn');
    btn.disabled = true;
    btn.textContent = 'Publishing…';
    try {
      const index = (await GH.readJSON('index.json')) || { items: [] };
      const booksJson = await GH.readJSON('books.json');
      const files = {};
      const byKey = {};
      (index.items || []).forEach(e => { byKey[e.app + '|' + e.id] = e; });
      chosen.forEach(item => {
        const env = envelopeOf(item);
        const path = fileName(item);
        const old = byKey[item.app + '|' + item.id];
        if (old && old.path !== path) files[old.path] = null;   // uploaded by hand under another name
        files[path] = JSON.stringify(env, null, 2) + '\n';
        byKey[item.app + '|' + item.id] = indexEntry(env, path);
      });
      const entries = Object.keys(byKey).map(k => byKey[k]);
      files['index.json'] = indexText(entries);
      const names = new Set(((booksJson && booksJson.books) || []).map(b => b && b.name).filter(Boolean));
      const before = names.size;
      entries.forEach(e => names.add(e.book || DEFAULT_BOOK));
      if (names.size !== before || !booksJson) {
        files['books.json'] = JSON.stringify({ format: 'evm-books', formatVersion: 1,
          books: [...names].sort((a, b) => a.localeCompare(b)).map(name => ({ name })) }, null, 2) + '\n';
      }
      await GH.commit(files, 'Librarian: published ' + chosen.length + ' song' + (chosen.length === 1 ? '' : 's') +
        ' (' + chosen.map(i => i.title).slice(0, 3).join(', ') + (chosen.length > 3 ? ', …' : '') + ')');
      setPublished(entries);
      ticked.clear();
      render();
      toast(`Published — students see ${chosen.length === 1 ? 'it' : 'them'} in about a minute`);
      if (window.LibrarianPanel) window.LibrarianPanel.reload();
    } catch (e) {
      alert('Nothing was published.\n\n' + (e.message || e));
    }
    updateDock();
  }

  function setPublished(entries) {
    const map = {};
    entries.forEach(e => { map[e.app + '|' + e.id] = e; });
    published = map;
    setStatus();
    render();
  }

  async function downloadTicked() {
    const chosen = items.filter(i => ticked.has(i.app + '|' + i.id) && !i.blank);
    if (!chosen.length) return;
    /* One at a time, a beat apart: browsers drop downloads fired in the
       same instant (Chrome asks once to allow several). */
    for (const item of chosen) {
      download(fileName(item), JSON.stringify(envelopeOf(item), null, 2) + '\n');
      await new Promise(r => setTimeout(r, 350));
    }
    $('done-title').textContent = `Downloaded ${chosen.length} file${chosen.length === 1 ? '' : 's'}`;
    $('done').hidden = false;
    $('done').scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast('Check your Downloads folder');
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
  }

  /* ---------------- wiring ---------------- */
  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      document.querySelectorAll('.seg-btn').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      render();
    });
  });
  $('select-todo').addEventListener('click', () => {
    items.forEach(i => { if (TO_PUBLISH(stateOf(i))) ticked.add(i.app + '|' + i.id); });
    render();
  });
  $('select-none').addEventListener('click', () => { ticked.clear(); render(); });
  $('bulk-book-apply').addEventListener('click', () => {
    const name = tidyBook($('bulk-book').value);
    const chosen = items.filter(i => ticked.has(i.app + '|' + i.id) && !i.blank);
    if (!name) { toast('Type a book name first'); return; }
    if (!chosen.length) { toast('Tick some songs first'); return; }
    chosen.forEach(i => setBook(i, name));
    render();
    toast(`${chosen.length} song${chosen.length === 1 ? '' : 's'} put in “${name}”`);
  });
  $('download-btn').addEventListener('click', () => (GH && GH.connected() ? publishTicked() : downloadTicked()));
  $('download-files-btn').addEventListener('click', downloadTicked);
  $('upload-link').href = UPLOAD_URL;
  $('folder-link').href = FOLDER_URL;

  /* Another tab may be where the song is being written: keep up with it. */
  window.addEventListener('storage', e => {
    if (SOURCES.some(s => s.key === e.key)) { collect(); render(); }
  });

  window.Librarian = {
    APP_NAMES, KIND_NAMES, DEFAULT_BOOK, INDEX_URL, BOOKS_URL,
    indexText, toast, setPublished,
    setBookNote: (app, id, name) => { bookNotes[app + '|' + id] = tidyBook(name); saveBookNotes(); render(); },
    hasLocal: (app, id) => items.some(i => i.app === app && i.id === id),
    connectionChanged: () => { updateDock(); readPublished().then(() => { setStatus(); render(); }); }
  };

  collect();
  setStatus();
  render();
  readPublished().then(() => { setStatus(); render(); });
})();

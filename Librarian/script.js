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
    }
  ];

  const APP_ORDER = ['rhythm-poetry', 'ostinato-builder', 'song-writer'];
  const APP_NAMES = { 'rhythm-poetry': 'Rhythm Poetry', 'ostinato-builder': 'Ostinato Builder', 'song-writer': 'Song Writer' };
  const KIND_NAMES = { poem: 'Poem', rhythm: 'Rhythm', ostinato: 'Ostinato', song: 'Song' };

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
        const updatedAt = Number(rec.updatedAt) || createdAt;
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
      const res = await fetch(INDEX_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      const index = await res.json();
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
    $('dock-count').textContent = n ? `${n} song${n === 1 ? '' : 's'} ticked` : 'Nothing ticked';
    $('download-btn').disabled = !n;
    $('download-btn').textContent = n ? `Download ${n} file${n === 1 ? '' : 's'}` : 'Download';
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
  $('download-btn').addEventListener('click', downloadTicked);
  $('upload-link').href = UPLOAD_URL;
  $('folder-link').href = FOLDER_URL;

  /* Another tab may be where the song is being written: keep up with it. */
  window.addEventListener('storage', e => {
    if (SOURCES.some(s => s.key === e.key)) { collect(); render(); }
  });

  collect();
  setStatus();
  render();
  readPublished().then(() => { setStatus(); render(); });
})();

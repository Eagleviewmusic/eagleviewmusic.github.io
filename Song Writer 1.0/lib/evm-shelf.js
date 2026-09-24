/* ==========================================================================
   evm-shelf.js — the Teacher Library shelf, format version 1
   --------------------------------------------------------------------------
   AUTHORITATIVE COPY: Claude Apps/EVM Library/evm-shelf.js (+ evm-shelf.css)
   Each app carries byte-identical copies in its lib/ folder, loaded after
   lib/evm-library.js. See EVM Library/README.md, §8.

   The teacher publishes songs into BOOKS (Librarian → Teacher Library on
   GitHub → index.json). Every app shows the same shelf of books. A student
   TAKES OUT a book: its songs for this app are filed in their library as
   Shared songs (read-only, `received`), marked with `book`. PUTTING IT BACK
   removes them again. Anything the student kept with Save my copy is their
   own song — no `book` — and is never touched.

   One shelf for every app: the books a student has out are one list on
   this site (localStorage `evm_shelf_out_v1`), so a book taken out in one
   app is out in all of them. Each app files its own songs from it the next
   time it opens.

   sync() — run when an app opens — keeps the library in step with the
   Teacher Library: new and newer songs of books that are out are filed;
   songs whose book was put back, or whose file the teacher deleted, leave.
   Nothing is ever removed unless a fresh index.json was read: offline, or
   with the site unreachable, the library is left exactly as it is.

   window.EVMShelf
     init(adapter)     once, at start-up — see ADAPTER below
     sync()            -> Promise<{ added, updated, removed, offline }>
     openSheet()       the shelf, as a sheet over the app
     putBack(book)     -> Promise; asks first
     booksOut()        ['Winter Songs', …]
     DEFAULT_BOOK      the book of a song published without one

   ADAPTER = {
     app:        'rhythm-poetry'          the EVM app slug
     disabled:   bool                     embedded, a lesson… — no shelf at all
     load():     library object           the app's own storage
     save(lib)
     incoming(rec) -> record | null       an envelope's record made into the
                                          app's own shape (its normalize)
     key(rec)  -> string | null           content key, null when blank
     changed(summary)                     after anything was filed or removed:
                                          redraw, and move off a song that left
     openSong(id)                         optional: open a song from a book
     words:      'pairings'               optional: what this app keeps, in the
                                          shelf's sentences (default 'songs')
   }
   ========================================================================== */
(function (root) {
  'use strict';
  const EVM = root.EVMLibrary;

  const OUT_KEY = 'evm_shelf_out_v1';
  const INDEX_CACHE_KEY = 'evm_shelf_index_v1';
  const BASE = '../' + encodeURIComponent('Teacher Library') + '/';
  const DEFAULT_BOOK = 'More songs';

  const KIND = {
    poem: ['poem', 'poems'], rhythm: ['rhythm', 'rhythms'],
    ostinato: ['ostinato', 'ostinatos'], song: ['song', 'songs'],
    scale: ['scale', 'scales'], layout: ['layout', 'layouts'],
    pairing: ['arrangement', 'arrangements']   // the Music Stand's; the kind keeps its first name
  };
  const APP_NAME = {
    'rhythm-poetry': 'Rhythm Poetry', 'ostinato-builder': 'Ostinato Builder',
    'song-writer': 'Song Writer', 'rainbow-xylophone': 'Rainbow Xylophone',
    'key-blocks': 'Key Blocks', 'virtual-drum-kit': 'Drum Kit',
    'music-stand': 'Music Stand'
  };
  const things = () => (A && A.words) || 'songs';

  let A = null;                   // the adapter
  let index = null;               // last index read this visit (or from cache)
  let fresh = false;              // …and whether it was read just now
  let syncing = null;

  /* ---------------- books out ---------------- */
  function booksOut() {
    try {
      const v = JSON.parse(localStorage.getItem(OUT_KEY) || '[]');
      return Array.isArray(v) ? v.filter(b => typeof b === 'string') : [];
    } catch (e) { return []; }
  }
  function setBooksOut(list) {
    try { localStorage.setItem(OUT_KEY, JSON.stringify([...new Set(list)])); } catch (e) {}
  }
  const bookOf = entry => (entry && entry.book && String(entry.book).trim()) || DEFAULT_BOOK;

  /* ---------------- the index ---------------- */
  async function readIndex() {
    try {
      const res = await fetch(BASE + 'index.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      if (!json || json.format !== 'evm-index' || !Array.isArray(json.items)) throw new Error('not an index');
      index = json;
      fresh = true;
      try { localStorage.setItem(INDEX_CACHE_KEY, JSON.stringify(json)); } catch (e) {}
    } catch (e) {
      fresh = false;
      if (!index) {
        try { index = JSON.parse(localStorage.getItem(INDEX_CACHE_KEY) || 'null'); } catch (e2) { index = null; }
      }
    }
    return index;
  }

  function books() {
    const map = new Map();
    ((index && index.items) || []).forEach(e => {
      const name = bookOf(e);
      if (!map.has(name)) map.set(name, { name, items: [] });
      map.get(name).items.push(e);
    });
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }

  /* ---------------- keeping the library in step ---------------- */
  const timeOf = r => Number(r && (r.updatedAt || r.createdAt)) || 0;

  async function fetchItem(entry) {
    try {
      const res = await fetch(BASE + encodeURIComponent(entry.path), { cache: 'no-store' });
      if (!res.ok) return null;
      const env = await res.json();
      if (!env || env.format !== 'evm-item' || env.app !== A.app) return null;
      return EVM.fromEnvelope(env);
    } catch (e) { return null; }
  }

  function sync() {
    if (!A || A.disabled) return Promise.resolve({ added: [], updated: [], removed: [], offline: false });
    if (syncing) return syncing;
    syncing = (async () => {
      const summary = { added: [], updated: [], removed: [], offline: false };
      await readIndex();
      if (!fresh) { summary.offline = true; return summary; }

      const out = booksOut();
      const want = new Map();              // id -> index entry
      index.items.forEach(e => {
        if (e.app === A.app && out.indexOf(bookOf(e)) !== -1) want.set(String(e.id), e);
      });

      const lib = A.load();
      let dirty = false;

      // Leave: a book song whose book went back, or whose file was deleted.
      Object.keys(lib).forEach(id => {
        const rec = lib[id];
        if (!rec || !rec.received || !rec.book) return;
        if (!want.has(id)) { delete lib[id]; summary.removed.push(id); dirty = true; }
      });

      // Arrive: new songs, and newer versions of ones already here.
      for (const [id, e] of want) {
        const have = lib[id];
        const book = bookOf(e);
        if (have && !have.received) continue;          // the teacher's own song, in their own browser
        if (have && timeOf(have) >= (Number(e.updatedAt) || 0)) {
          if (have.book !== book) { have.book = book; dirty = true; }
          continue;
        }
        const raw = await fetchItem(e);
        if (!raw) continue;
        const rec = A.incoming(raw);
        if (!rec || A.key(rec) === null) continue;     // a blank song is never filed
        const now = Date.now();
        rec.id = id;
        rec.isCustom = true;
        rec.received = true;
        rec.receivedAt = now;
        rec.book = book;
        rec.createdAt = Number(raw.createdAt) || (have && have.createdAt) || now;
        rec.updatedAt = Number(raw.updatedAt) || rec.createdAt;
        delete rec.derivedFrom;
        lib[id] = rec;
        (have ? summary.updated : summary.added).push(id);
        dirty = true;
      }

      if (dirty) {
        A.save(lib);
        try { A.changed(summary); } catch (e) { console.error(e); }
      }
      return summary;
    })().finally(() => { syncing = null; });
    return syncing;
  }

  function putBackNow(book) {
    setBooksOut(booksOut().filter(b => b !== book));
    const lib = A.load();
    const removed = [];
    Object.keys(lib).forEach(id => {
      const rec = lib[id];
      if (rec && rec.received && rec.book === book) { delete lib[id]; removed.push(id); }
    });
    if (removed.length) {
      A.save(lib);
      try { A.changed({ added: [], updated: [], removed, offline: false }); } catch (e) { console.error(e); }
    }
    return removed;
  }

  function putBack(book) {
    const ok = confirm('Put “' + book + '” back on the shelf?\n\n'
      + 'Its ' + things() + ' leave your library. Anything you saved as your own (Save my copy) stays.');
    if (!ok) return Promise.resolve(false);
    putBackNow(book);
    render();
    return Promise.resolve(true);
  }

  async function takeOut(book) {
    setBooksOut(booksOut().concat([book]));
    render();
    const s = await sync();
    if (s.offline) {
      setBooksOut(booksOut().filter(b => b !== book));
      note('The Teacher Library can’t be reached right now, so the book stayed on the shelf.');
    }
    render();
    return s;
  }

  /* ==================================================================
     THE SHEET
     ================================================================== */
  let sheet = null;
  let openBook = null;          // name of the book shown, or null for the shelf
  let noteText = '';

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function note(t) { noteText = t; }

  // A book's colour comes from its name, so it looks the same in every app.
  function hue(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return h % 360;
  }

  function countLine(items) {
    const byKind = {};
    items.forEach(e => { byKind[e.kind] = (byKind[e.kind] || 0) + 1; });
    return Object.keys(byKind).map(k => {
      const n = byKind[k], w = KIND[k] || [k, k + 's'];
      return n + ' ' + (n === 1 ? w[0] : w[1]);
    }).join(' · ');
  }

  function build() {
    sheet = el('div', 'evm-shelf');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Teacher Library');
    sheet.innerHTML =
      '<div class="evm-shelf-backdrop"></div>' +
      '<div class="evm-shelf-panel">' +
        '<header class="evm-shelf-head">' +
          '<button class="evm-shelf-back" type="button" aria-label="Back to the shelf" hidden>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg></button>' +
          '<h2 class="evm-shelf-title">Teacher Library</h2>' +
          '<button class="evm-shelf-close" type="button" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>' +
        '</header>' +
        '<div class="evm-shelf-body"></div>' +
      '</div>';
    document.body.appendChild(sheet);
    sheet.querySelector('.evm-shelf-backdrop').addEventListener('click', closeSheet);
    sheet.querySelector('.evm-shelf-close').addEventListener('click', closeSheet);
    sheet.querySelector('.evm-shelf-back').addEventListener('click', () => { openBook = null; render(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sheet.classList.contains('show')) {
        if (openBook) { openBook = null; render(); } else closeSheet();
      }
    });
  }

  async function openSheet() {
    if (!A || A.disabled) return;
    if (!sheet) build();
    openBook = null;
    noteText = '';
    sheet.classList.add('show');
    render('loading');
    await readIndex();
    if (!fresh) note(index ? 'Showing the shelf from your last visit — the Teacher Library can’t be reached right now.'
                           : 'The Teacher Library can’t be reached right now. Try again when you’re online.');
    render();
  }
  function closeSheet() { if (sheet) sheet.classList.remove('show'); }

  function render(state) {
    if (!sheet) return;
    const body = sheet.querySelector('.evm-shelf-body');
    const title = sheet.querySelector('.evm-shelf-title');
    const back = sheet.querySelector('.evm-shelf-back');
    body.innerHTML = '';
    if (noteText) body.appendChild(el('p', 'evm-shelf-note', noteText));

    if (state === 'loading' && !index) {
      body.appendChild(el('p', 'evm-shelf-empty', 'Opening the Teacher Library…'));
      return;
    }
    const all = books();
    const mineOf = b => b.items.filter(e => e.app === A.app);
    const out = booksOut();

    if (openBook) {
      const b = all.find(x => x.name === openBook);
      if (!b) { openBook = null; return render(); }
      title.textContent = b.name;
      back.hidden = false;
      renderBook(body, b, mineOf(b), out.indexOf(b.name) !== -1);
      return;
    }

    title.textContent = 'Teacher Library';
    back.hidden = true;
    const shown = all.filter(b => mineOf(b).length);
    if (!shown.length) {
      if (index) body.appendChild(el('p', 'evm-shelf-empty',
        'No books for ' + (APP_NAME[A.app] || 'this app') + ' on the shelf yet.'));
      return;
    }
    body.appendChild(el('p', 'evm-shelf-intro',
      'Take a book off the shelf and its ' + things() + ' join your library. Put it back when you’re done — anything you saved as your own stays yours.'));

    const shelf = el('div', 'evm-shelf-shelf');
    shown.forEach(b => {
      const isOut = out.indexOf(b.name) !== -1;
      const book = el('button', 'evm-shelf-book' + (isOut ? ' is-out' : ''));
      book.type = 'button';
      book.style.setProperty('--book-hue', hue(b.name));
      book.appendChild(el('span', 'evm-shelf-book-name', b.name));
      book.appendChild(el('span', 'evm-shelf-book-count', countLine(mineOf(b))));
      if (isOut) book.appendChild(el('span', 'evm-shelf-book-flag', 'In your library'));
      book.addEventListener('click', () => { openBook = b.name; noteText = ''; render(); });
      shelf.appendChild(book);
    });
    body.appendChild(shelf);
  }

  function renderBook(body, b, mine, isOut) {
    const cover = el('div', 'evm-shelf-cover');
    cover.style.setProperty('--book-hue', hue(b.name));
    cover.appendChild(el('span', 'evm-shelf-cover-count', countLine(mine)));
    const elsewhere = b.items.filter(e => e.app !== A.app);
    if (elsewhere.length) {
      const apps = [...new Set(elsewhere.map(e => APP_NAME[e.app] || e.app))];
      cover.appendChild(el('span', 'evm-shelf-cover-also',
        'Also in this book: ' + countLine(elsewhere) + ' in ' + apps.join(' and ')));
    }
    body.appendChild(cover);

    const list = el('ul', 'evm-shelf-list');
    const lib = A.load();
    mine.slice().sort((x, y) => x.title.localeCompare(y.title)).forEach(e => {
      const li = el('li', 'evm-shelf-item');
      li.appendChild(el('span', 'evm-shelf-item-title', e.title));
      li.appendChild(el('span', 'evm-shelf-item-kind', (KIND[e.kind] || [e.kind])[0]));
      if (isOut && A.openSong && lib[e.id]) {
        const open = el('button', 'evm-shelf-link', 'Open');
        open.type = 'button';
        open.addEventListener('click', () => { closeSheet(); A.openSong(e.id); });
        li.appendChild(open);
      }
      list.appendChild(li);
    });
    body.appendChild(list);

    const actions = el('div', 'evm-shelf-actions');
    const btn = el('button', 'evm-shelf-btn' + (isOut ? '' : ' primary'),
      isOut ? 'Put back on the shelf' : 'Take out');
    btn.type = 'button';
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      if (isOut) await putBack(b.name);
      else {
        btn.textContent = 'Taking out…';
        await takeOut(b.name);
      }
      render();
    });
    actions.appendChild(btn);
    body.appendChild(actions);
    if (isOut) body.appendChild(el('p', 'evm-shelf-fine',
      'These ' + things() + ' are in your library under “' + b.name + '”. They stay as your teacher made them; Save my copy keeps your changes as your own.'));
  }

  /* ---------------- start-up ---------------- */
  function init(adapter) {
    A = adapter;
    if (!A || A.disabled) return;
    /* Another app (or tab) took a book out or put one back: catch up. */
    window.addEventListener('storage', e => {
      if (e.key === OUT_KEY) sync().then(() => render());
    });
  }

  root.EVMShelf = {
    init, sync, openSheet, closeSheet, putBack, booksOut, DEFAULT_BOOK,
    // for the apps' library lists
    isShelfSong: rec => !!(rec && rec.received && rec.book)
  };
})(typeof window !== 'undefined' ? window : this);

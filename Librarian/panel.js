/* ==========================================================================
   panel.js — the Teacher Library tab of the Librarian
   --------------------------------------------------------------------------
   Shows exactly what is published — every song, in its book, for every
   app — and, once the Librarian is connected to GitHub (github.js), lets
   the teacher organise it: new books, rename a book, delete a book (its
   songs go to "More songs"), move songs between books, take songs down.

   Changes are STAGED: each shows in place ("→ Winter Songs", "Will be
   removed") and a bar counts them; Save sends them all as one commit,
   with a rebuilt index.json and books.json, so students see the result as
   soon as the site rebuilds (~a minute). Discard forgets them.

   books.json (in the Teacher Library) is the list of books, so a new book
   exists before anything is in it. Students only ever see books that have
   songs (the apps read index.json).
   ========================================================================== */
(function () {
  'use strict';
  const L = window.Librarian;
  const GH = window.LibGitHub;
  const $ = id => document.getElementById(id);
  const DEFAULT_BOOK = L.DEFAULT_BOOK;

  let remote = null;         // { items: [index entry], books: [name] }
  let loadError = '';
  let loading = false;
  let staged = [];           // { type: move|remove|keep|newBook|renameBook|deleteBook, … }
  let appFilter = 'all';
  let query = '';
  const picked = new Set();  // app|id ticked in this tab
  const keyOf = e => e.app + '|' + e.id;
  const bookName = e => (e && e.book && String(e.book).trim()) || DEFAULT_BOOK;
  const tidy = b => String(b || '').replace(/\s+/g, ' ').trim().slice(0, 60);

  /* ---------------- reading ---------------- */
  function namesFrom(booksJson) {
    const list = booksJson && Array.isArray(booksJson.books) ? booksJson.books : [];
    return list.map(b => tidy(typeof b === 'string' ? b : b && b.name)).filter(Boolean);
  }

  async function load() {
    loading = true;
    render();
    try {
      let index, books;
      if (GH.connected()) {
        [index, books] = await Promise.all([GH.readJSON('index.json'), GH.readJSON('books.json')]);
      } else {
        const res = await fetch(L.INDEX_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error('The Teacher Library can’t be reached right now.');
        index = await res.json();
        try {
          const r = await fetch(L.BOOKS_URL, { cache: 'no-store' });
          if (r.ok) books = await r.json();
        } catch (e) {}
      }
      remote = { items: (index && index.items) || [], books: namesFrom(books) };
      loadError = '';
    } catch (e) {
      loadError = e.message || 'The Teacher Library can’t be read right now.';
    }
    loading = false;
    render();
  }

  /* ---------------- the library as it will be after Save ---------------- */
  function current() {
    const items = (remote ? remote.items : []).map(e =>
      Object.assign({}, e, { was: bookName(e), book: bookName(e), removed: false }));
    const find = k => items.find(i => keyOf(i) === k);
    const books = new Set((remote ? remote.books : []).concat(items.map(i => i.book)));
    staged.forEach(op => {
      if (op.type === 'move') { const it = find(op.key); if (it) { it.book = op.to; books.add(op.to); } }
      else if (op.type === 'remove') { const it = find(op.key); if (it) it.removed = true; }
      else if (op.type === 'keep') { const it = find(op.key); if (it) it.removed = false; }
      else if (op.type === 'newBook') books.add(op.name);
      else if (op.type === 'renameBook') {
        items.forEach(i => { if (i.book === op.from) i.book = op.to; });
        books.delete(op.from); books.add(op.to);
      } else if (op.type === 'deleteBook') {
        items.forEach(i => { if (i.book === op.name) i.book = DEFAULT_BOOK; });
        books.delete(op.name);
        if (items.some(i => i.book === DEFAULT_BOOK)) books.add(DEFAULT_BOOK);
      }
    });
    return { items, books: [...books].sort((a, b) => a.localeCompare(b)) };
  }

  function pendingCount() {
    const cur = current();
    let n = cur.items.filter(i => i.removed || i.book !== i.was).length;
    const before = new Set(remote ? remote.books.concat(remote.items.map(bookName)) : []);
    const after = new Set(cur.books);
    before.forEach(b => { if (!after.has(b) && !cur.items.some(i => i.was === b && i.book !== b)) n++; });
    after.forEach(b => { if (!before.has(b) && !cur.items.some(i => i.book === b && i.was !== b)) n++; });
    return n;
  }

  function stage(op) { staged.push(op); render(); }

  /* ---------------- asking ---------------- */
  function askBookName(title, value) {
    const name = tidy(prompt(title, value || ''));
    return name || null;
  }

  function newBook() {
    const name = askBookName('Name the new book:');
    if (!name) return null;
    if (current().books.indexOf(name) !== -1) { L.toast('There is already a book called “' + name + '”'); return name; }
    stage({ type: 'newBook', name });
    return name;
  }

  function renameBook(from) {
    const to = askBookName('Rename “' + from + '” to:', from);
    if (!to || to === from) return;
    if (current().books.indexOf(to) !== -1 &&
        !confirm('There is already a book called “' + to + '”. Put the songs of “' + from + '” into it?')) return;
    stage({ type: 'renameBook', from, to });
  }

  function deleteBook(name, count) {
    const ok = count
      ? confirm('Delete the book “' + name + '”?\n\nIts ' + count + ' song' + (count === 1 ? '' : 's') +
                ' will move to “' + DEFAULT_BOOK + '” — nothing is taken down. (To take songs down, remove them.)')
      : confirm('Delete the empty book “' + name + '”?');
    if (ok) stage({ type: 'deleteBook', name });
  }

  function moveTo(keys, to) {
    if (to === '__new__') { to = newBook(); if (!to) { render(); return; } }
    keys.forEach(k => staged.push({ type: 'move', key: k, to }));
    picked.clear();
    render();
  }

  function removeSongs(keys) {
    const n = keys.length;
    if (!confirm('Take ' + (n === 1 ? 'this song' : n + ' songs') + ' down from the Teacher Library?\n\n' +
                 'When you save, ' + (n === 1 ? 'it leaves' : 'they leave') + ' the shelf and every student’s ' +
                 'library at their next visit. Anything a student saved as their own stays theirs.')) return;
    keys.forEach(k => staged.push({ type: 'remove', key: k }));
    picked.clear();
    render();
  }

  /* ---------------- saving ---------------- */
  function entryOf(i) {
    const e = { app: i.app, kind: i.kind, id: i.id, title: i.title, updatedAt: i.updatedAt, path: i.path };
    if (i.book) e.book = i.book;
    return e;
  }

  async function save() {
    if (!GH.connected() || !remote) return;
    const cur = current();
    const moved = cur.items.filter(i => !i.removed && i.book !== i.was);
    const removed = cur.items.filter(i => i.removed);
    const btn = $('lib-save');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    try {
      const files = {};
      for (const it of moved) {
        const env = await GH.readJSON(it.path);
        if (!env) continue;
        env.book = it.book;
        files[it.path] = JSON.stringify(env, null, 2) + '\n';
      }
      removed.forEach(i => { files[i.path] = null; });
      const kept = cur.items.filter(i => !i.removed).map(entryOf);
      files['index.json'] = L.indexText(kept);
      files['books.json'] = JSON.stringify({
        format: 'evm-books', formatVersion: 1,
        books: cur.books.map(name => ({ name }))
      }, null, 2) + '\n';

      const bits = [];
      if (moved.length) bits.push('moved ' + moved.length);
      if (removed.length) bits.push('took down ' + removed.length);
      const message = 'Librarian: ' + (bits.join(', ') || 'organised the books') +
        ' (' + cur.books.length + ' book' + (cur.books.length === 1 ? '' : 's') + ')';
      await GH.commit(files, message);

      moved.forEach(i => L.setBookNote(i.app, i.id, i.book));
      remote = { items: kept, books: cur.books };
      staged = [];
      L.setPublished(kept);
      L.toast('Saved — students see it in about a minute');
    } catch (e) {
      alert('Nothing was changed on GitHub.\n\n' + (e.message || e));
    }
    btn.disabled = false;
    render();
  }

  function discard() {
    if (staged.length && !confirm('Forget the changes you haven’t saved?')) return;
    staged = [];
    picked.clear();
    render();
  }

  /* ==================================================================
     DRAWING
     ================================================================== */
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function hue(name) {            // the same colour the shelf gives the book
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return h % 360;
  }
  function when(ms) {
    if (!ms || ms < 2) return '';
    const d = new Date(ms);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric',
      year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
  }

  function renderConnection() {
    const box = $('lib-connect');
    box.innerHTML = '';
    if (GH.connected()) {
      box.className = 'lib-connected';
      box.appendChild(el('span', 'lib-dot'));
      box.appendChild(el('span', '', 'Connected to GitHub as '));
      box.appendChild(el('strong', '', GH.login()));
      const out = el('button', 'text-btn', 'Disconnect');
      out.addEventListener('click', () => {
        if (staged.length && !confirm('You have unsaved changes. Disconnect anyway?')) return;
        GH.disconnect(); staged = []; load(); L.connectionChanged();
      });
      box.appendChild(out);
      return;
    }
    box.className = 'card lib-connect-card';
    box.innerHTML =
      '<h2>Connect the Librarian to GitHub</h2>' +
      '<p>Once, on your own computer. After that, publishing and organising happen here with one click — no downloading or uploading.</p>' +
      '<ol class="steps">' +
        '<li>On GitHub, signed in as <strong>Eagleviewmusic</strong>, open ' +
          '<a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">New fine-grained access key</a>.</li>' +
        '<li><strong>Name</strong>: Librarian. <strong>Expiration</strong>: up to a year.</li>' +
        '<li><strong>Repository access</strong>: <em>Only select repositories</em> → <strong>eagleviewmusic.github.io</strong>.</li>' +
        '<li><strong>Permissions → Repository permissions → Contents</strong>: <em>Read and write</em>. Nothing else.</li>' +
        '<li>Press <strong>Generate token</strong>, copy it, and paste it here.</li>' +
      '</ol>' +
      '<div class="lib-connect-row">' +
        '<input type="password" id="lib-key" class="book-field lib-key" placeholder="github_pat_…" autocomplete="off" spellcheck="false">' +
        '<button class="btn primary small" id="lib-key-go">Connect</button>' +
      '</div>' +
      '<p class="fine">The key stays in this browser only and can change nothing but this one site. Don’t connect on a shared computer. <em>Disconnect</em> removes it; when it expires, make a new one the same way.</p>';
    $('lib-key-go').addEventListener('click', async () => {
      const btn = $('lib-key-go');
      btn.disabled = true; btn.textContent = 'Checking…';
      try {
        const who = await GH.connect($('lib-key').value);
        L.toast('Connected as ' + who);
        L.connectionChanged();
        load();
      } catch (e) {
        alert(e.message || e);
        btn.disabled = false; btn.textContent = 'Connect';
      }
    });
  }

  function render() {
    if (!$('lib-books')) return;
    renderConnection();
    const can = GH.connected() && !!remote;
    document.body.classList.toggle('lib-can-edit', can);
    const list = $('lib-books');
    list.innerHTML = '';

    if (loading && !remote) { list.appendChild(el('p', 'none', 'Opening the Teacher Library…')); updateBars(); return; }
    if (loadError && !remote) { list.appendChild(el('p', 'status warn', loadError)); updateBars(); return; }
    if (!remote) { updateBars(); return; }

    const cur = current();
    const q = query.toLowerCase();
    const showItem = i => (appFilter === 'all' || i.app === appFilter) &&
      (!q || i.title.toLowerCase().indexOf(q) !== -1);

    const total = cur.items.filter(i => !i.removed).length;
    $('lib-summary').textContent = total
      ? `${total} song${total === 1 ? '' : 's'} in ${cur.books.length} book${cur.books.length === 1 ? '' : 's'}`
      : 'The Teacher Library is empty so far.';

    cur.books.forEach(book => {
      const all = cur.items.filter(i => i.book === book);
      const inView = all.filter(showItem);
      if ((appFilter !== 'all' || q) && !inView.length) return;

      const card = el('section', 'lib-book');
      card.style.setProperty('--book-hue', hue(book));
      const head = el('div', 'lib-book-head');
      head.appendChild(el('span', 'lib-book-spine'));
      head.appendChild(el('h3', 'lib-book-name', book));
      const live = all.filter(i => !i.removed);
      head.appendChild(el('span', 'lib-book-count', live.length ? countLine(live) : 'Empty'));
      if (can) {
        const acts = el('span', 'lib-book-acts');
        const rn = el('button', 'text-btn', 'Rename');
        rn.addEventListener('click', () => renameBook(book));
        acts.appendChild(rn);
        if (book !== DEFAULT_BOOK || !live.length) {
          const del = el('button', 'text-btn danger', 'Delete');
          del.addEventListener('click', () => deleteBook(book, live.length));
          acts.appendChild(del);
        }
        head.appendChild(acts);
      }
      card.appendChild(head);

      if (!inView.length) {
        card.appendChild(el('p', 'lib-empty', all.length ? 'Nothing here matches.' : 'No songs yet — move some in.'));
      }
      inView.sort((a, b) => a.app.localeCompare(b.app) || a.title.localeCompare(b.title))
        .forEach(i => card.appendChild(songRow(i, cur.books, can)));
      list.appendChild(card);
    });
    updateBars();
  }

  function countLine(items) {
    const n = {};
    items.forEach(i => { n[i.app] = (n[i.app] || 0) + 1; });
    return Object.keys(n).map(a => n[a] + ' in ' + (L.APP_NAMES[a] || a)).join(' · ');
  }

  function songRow(i, books, can) {
    const k = keyOf(i);
    const row = el('div', 'lib-song app-' + i.app + (i.removed ? ' is-removed' : '') + (picked.has(k) ? ' is-ticked' : ''));
    if (can) {
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.checked = picked.has(k);
      box.disabled = i.removed;
      box.setAttribute('aria-label', 'Tick ' + i.title);
      box.addEventListener('change', () => {
        if (box.checked) picked.add(k); else picked.delete(k);
        row.classList.toggle('is-ticked', box.checked);
        updateBars();
      });
      row.appendChild(box);
    }
    const main = el('span', 'lib-song-main');
    main.appendChild(el('span', 'lib-song-title', i.title));
    const meta = [L.APP_NAMES[i.app] || i.app, L.KIND_NAMES[i.kind] || i.kind];
    if (when(i.updatedAt)) meta.push(when(i.updatedAt));
    main.appendChild(el('span', 'lib-song-meta', meta.join(' · ')));
    row.appendChild(main);

    const tags = el('span', 'lib-song-tags');
    if (L.hasLocal(i.app, i.id)) {
      const t = el('span', 'tag', 'Yours');
      t.title = 'This song is in your library on this computer (the Publish tab).';
      tags.appendChild(t);
    }
    if (i.removed) tags.appendChild(el('span', 'tag tag-changed', 'Will be taken down'));
    else if (i.book !== i.was) tags.appendChild(el('span', 'tag tag-moved', 'from ' + i.was));
    row.appendChild(tags);

    if (can) {
      if (i.removed) {
        const keep = el('button', 'text-btn', 'Keep');
        keep.addEventListener('click', () => stage({ type: 'keep', key: k }));
        row.appendChild(keep);
      } else {
        row.appendChild(bookSelect(books, i.book, to => moveTo([k], to), 'Move ' + i.title + ' to'));
        const rm = el('button', 'lib-x', '×');
        rm.title = 'Take this song down';
        rm.setAttribute('aria-label', 'Take ' + i.title + ' down');
        rm.addEventListener('click', () => removeSongs([k]));
        row.appendChild(rm);
      }
    }
    return row;
  }

  function bookSelect(books, currentBook, onPick, label) {
    const sel = document.createElement('select');
    sel.className = 'lib-move';
    sel.setAttribute('aria-label', label);
    books.forEach(b => {
      const o = document.createElement('option');
      o.value = b; o.textContent = b;
      if (b === currentBook) o.selected = true;
      sel.appendChild(o);
    });
    const nb = document.createElement('option');
    nb.value = '__new__'; nb.textContent = 'New book…';
    sel.appendChild(nb);
    sel.addEventListener('change', () => { if (sel.value !== currentBook) onPick(sel.value); });
    return sel;
  }

  function updateBars() {
    const n = pendingCount();
    const bar = $('lib-savebar');
    bar.hidden = !(GH.connected() && n > 0);
    $('lib-pending').textContent = n + ' change' + (n === 1 ? '' : 's') + ' not saved yet';

    const bulk = $('lib-bulk');
    const can = GH.connected() && !!remote;
    bulk.hidden = !(can && picked.size);
    if (!bulk.hidden) {
      $('lib-bulk-count').textContent = picked.size + ' ticked';
      const holder = $('lib-bulk-move');
      holder.innerHTML = '';
      const sel = bookSelect(current().books, '', to => moveTo([...picked], to), 'Move the ticked songs to');
      const first = document.createElement('option');
      first.value = ''; first.textContent = 'Move to…'; first.selected = true; first.disabled = true;
      sel.insertBefore(first, sel.firstChild);
      holder.appendChild(sel);
    }
  }

  /* ---------------- wiring ---------------- */
  function wire() {
    document.querySelectorAll('#lib-apps .seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appFilter = btn.dataset.app;
        document.querySelectorAll('#lib-apps .seg-btn').forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-selected', String(b === btn));
        });
        render();
      });
    });
    $('lib-find').addEventListener('input', e => { query = e.target.value.trim(); render(); });
    $('lib-new-book').addEventListener('click', () => {
      if (!GH.connected()) { L.toast('Connect to GitHub first (above)'); return; }
      newBook();
    });
    $('lib-refresh').addEventListener('click', () => {
      if (staged.length && !confirm('Reload from GitHub and forget the changes you haven’t saved?')) return;
      staged = []; picked.clear(); load();
    });
    $('lib-save').addEventListener('click', save);
    $('lib-discard').addEventListener('click', discard);
    $('lib-bulk-remove').addEventListener('click', () => removeSongs([...picked]));
    $('lib-bulk-clear').addEventListener('click', () => { picked.clear(); render(); });
    window.addEventListener('beforeunload', e => {
      if (staged.length && pendingCount()) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  window.LibrarianPanel = {
    open() { if (!remote && !loading) load(); else render(); },
    reload: load,
    hasUnsaved: () => staged.length > 0 && pendingCount() > 0
  };
  wire();
})();

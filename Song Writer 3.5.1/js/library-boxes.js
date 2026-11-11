/* ==========================================================================
   Song Writer — library-boxes.js
   --------------------------------------------------------------------------
   SONG BOXES (2026-11-11, the user): "instead of a list, it's like small
   boxes that can be rearranged, previewed, and linked together … I just
   need to find my Star Spangled Banner box, and inside, I might have all
   sorts of branches from it."

   The Library window shows one BOX per song. A box holds one or more
   VERSIONS — each an ordinary library record (js/library.js), untouched:
   links, the Teacher Library shelf, the Librarian, backups and the
   Recording Studio all keep working on records exactly as before. The
   boxes are a layer over the library, kept under their own key:

     song_writer_351_boxes_v1
       { v: 1,
         view:  'boxes' | 'list'   the Library's view (Boxes is the first)
         alpha: true               the boxes in A–Z order; dragging one turns
                                   it off until A–Z is pressed again
         order: [boxId…]           the person's own order (kept while A–Z)
         boxes: { boxId: { id, title, composer, lead, versions: [songId…] } } }

   A box's `title` and `composer` are the box's own, so a box can be
   renamed even when its versions cannot (a built-in, a teacher's song);
   renaming it takes the person's own versions of the same name with it.
   `lead` is the version Open opens.

   KEPT IN STEP (state(), every time the Library is drawn): a song that is
   gone leaves its box (an empty box goes); a song in no box gets one — in
   the box of the song it was made from (derivedFrom), when that has one,
   else a box of its own at the front. The very first time, songs that
   are plainly the same song share a box: made from one another, or the
   same name once "copy", "(my copy)", "(from 1.0)" are left off. Any of
   them can be moved out again.

   WHAT IS KEPT AS IT CAME (js/library.js kindOf): a built-in, a song from
   a Teacher Library book, a song from a link are never renamed, saved
   into or deleted (a link's may be deleted; a book's leaves with its
   book). They can still move between boxes. Changing one and pressing
   Save my copy makes a new version of the person's own in the same box —
   and, when the box's lead was the one kept as it came, the new one
   becomes the lead.

   THE WINDOWS
   • the grid (render): name · composer · 4/4 · 112 BPM · 4 lines ·
     "3 versions" with whose they are · Open, Preview, Expand. Drag a box
     to move it (the grip, or anywhere on it with a mouse); drop it in the
     middle of another box to put the two together.
   • Expand (#box-sheet): the name, the composer, the versions — lead
     (★), Open, Preview, Rename, Move out, Delete — and Add a version from
     your library.
   • Preview (#song-preview): the song in a small floating window, drawn
     by Song Writer itself in a frame that reads the library and writes
     nothing (?embed=preview: js/embed.js, js/preview-frame.js): scroll,
     tap a note, Play (no count-in), ×.

   In a lesson the Library is the lesson's exercises, as a list: no boxes.
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const ui = SW.ui;
  const L = SW.library;
  const EVM = window.EVMLibrary;
  const $ = id => document.getElementById(id);

  const BOX_KEY = 'song_writer_351_boxes_v1';
  const inLesson = () => !!(SW.lessons && SW.lessons.meta());
  const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });

  /* Whose a version is, as a tag (js/library.js kindOf) */
  const KIND = {
    book:    { tag: 'Teacher',  long: 'From your teacher' },
    builtin: { tag: 'Built-in', long: 'Comes with Song Writer' },
    shared:  { tag: 'Shared',   long: 'Shared with you' },
    lesson:  { tag: 'Lesson',   long: 'A lesson exercise' },
    mine:    { tag: 'Mine',     long: 'Yours' }
  };
  const KIND_ORDER = ['book', 'builtin', 'shared', 'lesson', 'mine'];
  const kindOf = (lib, id) => L.kindOf(id, lib[id]);
  const kept = (lib, id) => L.isProtectedKind(kindOf(lib, id));

  /* ---------------- titles, finding ---------------- */
  function titleOf(lib, id) {
    const t = lib[id] && typeof lib[id].title === 'string' ? lib[id].title.trim() : '';
    return t ? t.slice(0, 60) : 'Untitled Song';
  }
  const fold = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function matches(text, q) { return !q || fold(text).indexOf(q) !== -1; }
  function query() {
    const el = $('lib-find');
    return el ? fold(el.value.trim()) : '';
  }

  /* The same song by its name, the first time the boxes are made: the
     name with "copy", "my copy", "(my copy)", "(from 1.0)" left off. */
  const GENERIC = new Set(['untitled song', 'untitled', 'shared song', 'imported song', 'new song', 'song', 'my song', 'sandbox']);
  function baseTitle(t) {
    let s = fold(t).replace(/\((?:my copy|from 1\.0|copy)\)/g, ' ').trim();
    let prev;
    do {
      prev = s;
      s = s.replace(/[\s\-–—:,]*\b(?:my\s+)?copy(?:\s*\d+)?\s*$/, '').trim();
    } while (s !== prev);
    return s.replace(/[^a-z0-9]+/g, ' ').trim();
  }

  /* ---------------- the state ---------------- */
  function blank() { return { v: 1, view: 'boxes', alpha: true, order: [], boxes: {} }; }
  function read() {
    let st = null;
    try { st = JSON.parse(localStorage.getItem(BOX_KEY) || 'null'); } catch (e) {}
    if (!st || typeof st !== 'object' || !st.boxes || typeof st.boxes !== 'object') return null;
    st.v = 1;
    st.view = st.view === 'list' ? 'list' : 'boxes';
    st.alpha = st.alpha !== false;
    st.order = Array.isArray(st.order) ? st.order.filter((id, i, a) => st.boxes[id] && a.indexOf(id) === i) : [];
    return st;
  }
  function write(st) {
    try { localStorage.setItem(BOX_KEY, JSON.stringify(st)); } catch (e) { /* full or refused: the boxes are made again next time */ }
  }
  const newBoxId = () => EVM.newId('box');

  function makeBox(lib, versions, title) {
    const id = newBoxId();
    return { id, title: title || titleOf(lib, versions[0]), composer: '', lead: versions[0], versions: versions.slice() };
  }
  function addBox(st, box, where) {
    st.boxes[box.id] = box;
    st.order = st.order.filter(x => x !== box.id);
    if (where && where.after && st.order.indexOf(where.after) !== -1) st.order.splice(st.order.indexOf(where.after) + 1, 0, box.id);
    else if (where && where.end) st.order.push(box.id);
    else st.order.unshift(box.id);
  }
  function dropBox(st, bid) {
    delete st.boxes[bid];
    st.order = st.order.filter(x => x !== bid);
  }
  function boxIdOf(st, songId) {
    return Object.keys(st.boxes).find(bid => st.boxes[bid].versions.indexOf(songId) !== -1) || null;
  }

  /* The first time: one box per song, but songs made from one another, or
     of the same name, share one. Its name is the one kept as it came (the
     built-in's, the teacher's), else the oldest's; its lead is the
     person's own most recent version, else the one kept as it came. */
  function firstBoxes(st, lib, ids) {
    const up = {};
    const find = x => (up[x] === x ? x : (up[x] = find(up[x])));
    const join = (a, b) => { up[find(a)] = find(b); };
    ids.forEach(id => { up[id] = id; });
    const byName = {};
    ids.forEach(id => {
      const from = lib[id].derivedFrom;
      if (from && up[from] !== undefined) join(id, from);
      const name = baseTitle(titleOf(lib, id));
      if (!name || GENERIC.has(name)) return;
      if (byName[name]) join(id, byName[name]); else byName[name] = id;
    });
    const groups = {};
    ids.forEach(id => { (groups[find(id)] = groups[find(id)] || []).push(id); });
    const born = id => lib[id].createdAt || 0;
    const touched = id => lib[id].updatedAt || lib[id].createdAt || 0;
    const made = Object.keys(groups).map(root => {
      const members = groups[root].slice().sort((a, b) => born(a) - born(b));
      const keptOnes = members.filter(id => kept(lib, id))
        .sort((a, b) => KIND_ORDER.indexOf(kindOf(lib, a)) - KIND_ORDER.indexOf(kindOf(lib, b)));
      const own = members.filter(id => !kept(lib, id)).sort((a, b) => touched(b) - touched(a));
      const box = makeBox(lib, keptOnes.concat(own), titleOf(lib, keptOnes[0] || members[0]));
      box.lead = own[0] || keptOnes[0];
      box.newest = Math.max.apply(null, members.map(born));
      return box;
    });
    // newest first, as the list was (only seen once A–Z is turned off)
    made.sort((a, b) => b.newest - a.newest).forEach(b => { delete b.newest; addBox(st, b, { end: true }); });
  }

  /* Read the boxes and bring them in step with the library (see KEPT IN
     STEP above). Written back only when something changed. */
  function state(lib) {
    lib = lib || L.getStoredLibrary();
    let st = read();
    const first = !st;
    if (first) st = blank();
    const before = first ? '' : JSON.stringify(st);
    const ids = Object.keys(lib).filter(id => !L.isSandboxId(id) && lib[id] && typeof lib[id] === 'object');
    const has = new Set(ids);
    const boxed = new Map();
    Object.keys(st.boxes).forEach(bid => {
      const b = st.boxes[bid];
      if (!b || typeof b !== 'object') { delete st.boxes[bid]; return; }
      b.id = bid;
      b.versions = (Array.isArray(b.versions) ? b.versions : []).filter(id => {
        if (!has.has(id) || boxed.has(id)) return false;
        boxed.set(id, bid);
        return true;
      });
      if (!b.versions.length) { delete st.boxes[bid]; return; }
      if (b.versions.indexOf(b.lead) === -1) b.lead = b.versions[0];
      b.title = typeof b.title === 'string' && b.title.trim() ? b.title.trim().slice(0, 60) : titleOf(lib, b.lead);
      b.composer = typeof b.composer === 'string' ? b.composer.slice(0, 60) : '';
    });
    st.order = st.order.filter(bid => st.boxes[bid]);
    Object.keys(st.boxes).forEach(bid => { if (st.order.indexOf(bid) === -1) st.order.push(bid); });
    const loose = ids.filter(id => !boxed.has(id));
    if (first) firstBoxes(st, lib, loose);
    else {
      // oldest first, so the newest ends up at the front
      loose.sort((a, b) => (lib[a].receivedAt || lib[a].createdAt || 0) - (lib[b].receivedAt || lib[b].createdAt || 0)).forEach(id => {
        const from = lib[id].derivedFrom;
        const into = from && boxed.has(from) ? boxed.get(from) : null;
        if (into && st.boxes[into]) { st.boxes[into].versions.push(id); boxed.set(id, into); return; }
        const box = makeBox(lib, [id]);
        addBox(st, box, st.alpha ? { end: true } : null);
        boxed.set(id, box.id);
      });
    }
    if (JSON.stringify(st) !== before) write(st);
    return st;
  }

  /* The boxes as they are shown: A–Z, or the person's own order */
  function ordered(st) {
    const list = st.order.map(bid => st.boxes[bid]).filter(Boolean);
    if (st.alpha) list.sort((a, b) => collator.compare(a.title, b.title));
    return list;
  }
  function boxMatches(b, lib, q) {
    if (!q) return true;
    return matches(b.title, q) || matches(b.composer, q) || b.versions.some(id => matches(titleOf(lib, id), q));
  }
  // lead first, then the newest
  function versionsInOrder(b, lib) {
    const touched = id => lib[id].updatedAt || lib[id].createdAt || 0;
    return [b.lead].concat(b.versions.filter(id => id !== b.lead).sort((x, y) => touched(y) - touched(x)));
  }
  function kindsIn(b, lib) {
    const seen = new Set(b.versions.map(id => kindOf(lib, id)));
    return KIND_ORDER.filter(k => seen.has(k));
  }

  /* ---------------- what the rest of the app asks ---------------- */
  function view() {
    const st = read();
    return st ? st.view : 'boxes';
  }
  function boxOf(songId) {
    if (inLesson() || !songId || L.isSandboxId(songId)) return null;
    const st = state();
    const bid = boxIdOf(st, songId);
    return bid ? st.boxes[bid] : null;
  }

  /* Save as… / Save my copy (js/library.js saveCurrentSongAs): the new song
     is a version in the box it was made from — or, unticked, a box of its
     own just after it. A copy of your own of a song kept as it came takes
     over as the lead, when that one was the lead. */
  function placeNew(newId, fromId, keep) {
    if (inLesson()) return;
    const lib = L.getStoredLibrary();
    const st = state(lib);
    const from = boxIdOf(st, fromId);
    const now = boxIdOf(st, newId);
    if (!from) return;
    if (keep) {
      if (now !== from) {
        if (now) {
          st.boxes[now].versions = st.boxes[now].versions.filter(x => x !== newId);
          if (!st.boxes[now].versions.length) dropBox(st, now);
        }
        st.boxes[from].versions.push(newId);
      }
      const b = st.boxes[from];
      if (kept(lib, b.lead) && !kept(lib, newId)) b.lead = newId;
    } else if (now === from) {
      const b = st.boxes[from];
      b.versions = b.versions.filter(x => x !== newId);
      if (b.lead === newId) b.lead = b.versions[0];
      addBox(st, makeBox(lib, [newId]), st.alpha ? { end: true } : { after: from });
    }
    write(st);
  }

  /* A song renamed (js/library.js renameSong): a box named as the song was
     follows it, when the song is its lead or all of it. */
  function recordRenamed(id, was, now) {
    if (inLesson()) return;
    const st = state();
    const bid = boxIdOf(st, id);
    if (!bid) return;
    const b = st.boxes[bid];
    if (b.title === String(was || '').trim() && (b.lead === id || b.versions.length === 1)) {
      b.title = now;
      write(st);
    }
  }

  /* ---------------- backups (js/library.js) ---------------- */
  function exportFor(ids) {
    if (inLesson()) return [];
    const want = new Set(ids);
    const st = state();
    return ordered(st).map(b => {
      const versions = b.versions.filter(id => want.has(id));
      if (!versions.length) return null;
      const out = { id: b.id, title: b.title, lead: versions.indexOf(b.lead) !== -1 ? b.lead : versions[0], versions };
      if (b.composer) out.composer = b.composer;
      return out;
    }).filter(Boolean);
  }
  /* A backup's boxes, once its songs are filed (`where`: the file's id →
     the id here). A song kept with others here already stays where it is;
     a box made only of this file's songs takes the file's name, composer,
     lead and id — so opening the same file again finds the same box. */
  function importFrom(list, where) {
    if (inLesson() || !Array.isArray(list)) return;
    const lib = L.getStoredLibrary();
    const st = state(lib);
    list.forEach(fb => {
      if (!fb || typeof fb !== 'object' || !Array.isArray(fb.versions)) return;
      const ids = fb.versions.map(v => where[v]).filter((id, i, a) => id && lib[id] && a.indexOf(id) === i);
      if (!ids.length) return;
      let target = fb.id && st.boxes[fb.id] ? fb.id : boxIdOf(st, ids[0]);
      if (!target) return;
      const fresh = st.boxes[target].versions.every(v => ids.indexOf(v) !== -1);
      ids.forEach(id => {
        const cur = boxIdOf(st, id);
        if (cur === target) return;
        if (cur && st.boxes[cur].versions.length > 1) return;
        if (cur) dropBox(st, cur);
        st.boxes[target].versions.push(id);
      });
      const b = st.boxes[target];
      if (fresh) {
        if (typeof fb.title === 'string' && fb.title.trim()) b.title = fb.title.trim().slice(0, 60);
        const lead = where[fb.lead];
        if (lead && b.versions.indexOf(lead) !== -1) b.lead = lead;
        if (fb.id && fb.id !== target && !st.boxes[fb.id] && /^box_[\w-]+$/.test(String(fb.id))) {
          const at = st.order.indexOf(target);
          delete st.boxes[target];
          b.id = String(fb.id);
          st.boxes[b.id] = b;
          if (at !== -1) st.order[at] = b.id;
        }
      }
      if (!b.composer && typeof fb.composer === 'string') b.composer = fb.composer.trim().slice(0, 60);
    });
    write(st);
  }
  function reset() { try { localStorage.removeItem(BOX_KEY); } catch (e) {} }

  /* ==================================================================
     THE BAR: Find a song… · Boxes | List · A–Z
     ================================================================== */
  function syncBar(show) {
    const bar = $('lib-bar');
    if (!bar) return;
    bar.hidden = !show;
    const st = read() || blank();
    bar.querySelectorAll('[data-lib-view]').forEach(b => {
      const on = b.dataset.libView === st.view;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', String(on));
    });
    const az = $('lib-az');
    az.hidden = st.view !== 'boxes';
    az.classList.toggle('on', st.alpha);
    az.setAttribute('aria-pressed', String(st.alpha));
    az.title = st.alpha
      ? 'The boxes are in A–Z order. Drag one to put them in your own order'
      : 'The boxes are in your own order. Press to put them A–Z';
  }
  function setView(v) {
    const st = state();
    if (st.view === v) return;
    st.view = v;
    write(st);
    L.renderLibrarySongList();
  }
  function alphabetize() {
    const st = state();
    if (st.alpha) { ui.toast('Already A–Z — drag a box to put them in your own order'); return; }
    st.alpha = true;
    st.order = ordered(st).map(b => b.id);
    write(st);
    L.renderLibrarySongList();
    ui.toast('The boxes are A–Z again');
  }
  function onOpen() {
    const f = $('lib-find');
    if (f) f.value = '';
  }

  /* ==================================================================
     THE GRID
     ================================================================== */
  const GRIP = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>';
  const SANDBOX_ICON = '<path d="M3 21h18"/><path d="M5 21V10l7-5 7 5v11"/>';
  const BOOK_ICON = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>';
  const BOXES_ICON = '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>';

  function head(icon, label) {
    const h = document.createElement('div');
    h.className = 'library-group-head';
    h.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icon + '</svg><span class="library-group-title"></span><span class="library-group-rule"></span>';
    h.querySelector('.library-group-title').textContent = label;
    return h;
  }
  function tag(kind, text) {
    const t = document.createElement('span');
    t.className = 'sb-tag k-' + kind;
    t.textContent = text || KIND[kind].tag;
    return t;
  }
  function scoreOf(lib, id) { return L.normalizeSong(lib[id], id).score; }

  function card(b, lib) {
    const el = document.createElement('article');
    el.className = 'song-box';
    el.dataset.box = b.id;
    if (b.versions.indexOf(L.currentId()) !== -1) el.classList.add('is-open');
    const score = scoreOf(lib, b.lead);
    el.innerHTML =
      '<div class="sb-top">' +
        '<span class="sb-grip" title="Drag to move it — drop it on another box to put the two together">' + GRIP + '</span>' +
        '<h3 class="sb-title"></h3>' +
        '<span class="key-badge sb-key"></span>' +
      '</div>' +
      '<div class="sb-composer"></div>' +
      '<div class="sb-meta"></div>' +
      '<div class="sb-versions"></div>' +
      '<div class="sb-actions">' +
        '<button class="sb-btn sb-open" type="button" data-act="open">Open</button>' +
        '<button class="sb-btn" type="button" data-act="preview">Preview</button>' +
        '<button class="sb-btn" type="button" data-act="expand">Expand</button>' +
      '</div>';
    el.querySelector('.sb-title').textContent = b.title;
    el.querySelector('.sb-title').title = b.title;
    L.paintBadge(el.querySelector('.sb-key'), score.key);
    const comp = el.querySelector('.sb-composer');
    comp.textContent = b.composer;
    comp.hidden = !b.composer;
    el.querySelector('.sb-meta').textContent = L.subline(score);
    const vs = el.querySelector('.sb-versions');
    const kinds = kindsIn(b, lib);
    const n = b.versions.length;
    if (n > 1) {
      const count = document.createElement('span');
      count.className = 'sb-count';
      count.textContent = n + ' versions';
      vs.appendChild(count);
      kinds.forEach(k => vs.appendChild(tag(k)));
    } else if (kinds[0] !== 'mine') {
      vs.appendChild(tag(kinds[0], kinds[0] === 'book' ? String(lib[b.lead].book) : null));
    }
    vs.hidden = !vs.children.length;
    const lead = lib[b.lead];
    el.querySelector('[data-act="open"]').title = 'Open “' + titleOf(lib, b.lead) + '”' + (n > 1 ? ' — the lead version' : '');
    el.querySelector('[data-act="preview"]').title = 'A quick look at “' + titleOf(lib, b.lead) + '”, without opening it';
    el.querySelector('[data-act="expand"]').title = 'Name, composer and every version of this song';
    if (lead && lead.book) el.dataset.book = String(lead.book);
    return el;
  }

  function render(list, lib) {
    lib = lib || L.getStoredLibrary();
    const st = state(lib);
    const q = query();
    list.innerHTML = '';

    if (!q) {
      const sb = document.createElement('section');
      sb.className = 'library-group library-group-sandbox';
      sb.appendChild(head(SANDBOX_ICON, 'Sandbox'));
      sb.appendChild(L.buildSandboxRow());
      list.appendChild(sb);
    }

    // the Teacher Library's books out: their songs are in the boxes, the way to put each back is here
    const books = [];
    Object.keys(lib).forEach(id => { const r = lib[id]; if (L.isShelfSong(r) && books.indexOf(String(r.book)) === -1) books.push(String(r.book)); });
    if (books.length && !q) {
      const g = document.createElement('section');
      g.className = 'library-group library-group-book';
      g.appendChild(head(BOOK_ICON, 'Books from the Teacher Library'));
      const row = document.createElement('div');
      row.className = 'book-pills';
      books.sort((a, b) => collator.compare(a, b)).forEach(book => {
        const p = document.createElement('span');
        p.className = 'book-pill';
        const name = document.createElement('b');
        name.textContent = book;
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'evm-book-head-btn';
        back.textContent = 'Put back';
        back.title = 'Put this book back on the Teacher Library shelf (its songs leave your library; your own copies stay)';
        back.addEventListener('click', () => window.EVMShelf && EVMShelf.putBack(book));
        p.appendChild(name);
        p.appendChild(back);
        row.appendChild(p);
      });
      g.appendChild(row);
      list.appendChild(g);
    }

    const g = document.createElement('section');
    g.className = 'library-group library-group-boxes';
    g.appendChild(head(BOXES_ICON, q ? 'Found' : 'Your songs'));
    const grid = document.createElement('div');
    grid.className = 'box-grid';
    const shown = ordered(st).filter(b => boxMatches(b, lib, q));
    shown.forEach(b => grid.appendChild(card(b, lib)));
    if (!shown.length) {
      const e = document.createElement('div');
      e.className = 'library-empty';
      e.textContent = q ? 'No song is called that.' : 'No songs yet — press New song to make one.';
      g.appendChild(e);
    } else g.appendChild(grid);
    list.appendChild(g);
    wireGrid(grid);
    if (expanded) renderExpand();
  }

  function act(bid, what) {
    const st = state();
    const b = st.boxes[bid];
    if (!b) return;
    if (what === 'open') openSong(b.lead);
    else if (what === 'preview') openPreview(b.lead);
    else if (what === 'expand') expand(bid);
  }

  /* Open: the song, and every window over it goes. The song already open
     just closes the windows (its changes stay as they are). */
  function closeAll() {
    closePreview();
    ui.closeSheet('box-sheet');
    ui.closeSheet('library-sheet');
  }
  function openSong(id) {
    if (id === L.currentId()) { closeAll(); return; }
    if (!L.okToLeave('opens the other song')) return;
    L.save();
    L.loadSongById(id);
    closeAll();
  }

  /* ==================================================================
     DRAG: move a box, or drop it on another to put them together
     A mouse drags from anywhere on a box but its buttons; a finger from
     the grip (anywhere else, it scrolls the window).
     ================================================================== */
  let drag = null;
  function wireGrid(grid) {
    grid.addEventListener('click', e => {
      const btn = e.target.closest('button[data-act]');
      const c = btn && btn.closest('.song-box');
      if (c) act(c.dataset.box, btn.dataset.act);
    });
    grid.addEventListener('pointerdown', e => {
      if (e.button !== 0 || drag) return;
      const c = e.target.closest('.song-box');
      if (!c) return;
      const onGrip = !!e.target.closest('.sb-grip');
      if (!onGrip && (e.pointerType !== 'mouse' || e.target.closest('button, input, a'))) return;
      if (onGrip) e.preventDefault();
      drag = { id: c.dataset.box, card: c, grid, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, on: false, target: null };
      document.addEventListener('pointermove', onDragMove);
      document.addEventListener('pointerup', onDragEnd);
      document.addEventListener('pointercancel', onDragCancel);
    });
  }
  function startDrag() {
    const r = drag.card.getBoundingClientRect();
    const ghost = drag.card.cloneNode(true);
    ghost.classList.add('sb-ghost');
    ghost.classList.remove('is-open');
    ghost.style.width = r.width + 'px';
    ghost.style.height = r.height + 'px';
    drag.dx = drag.x0 - r.left;
    drag.dy = drag.y0 - r.top;
    document.body.appendChild(ghost);
    drag.ghost = ghost;
    drag.card.classList.add('sb-dragging');
    document.body.classList.add('box-dragging');
    drag.on = true;
    drag.scroller = drag.card.closest('.sheet');
    drag.timer = setInterval(autoScroll, 16);
  }
  function clearMarks() {
    document.querySelectorAll('.song-box.drop-merge, .song-box.drop-before, .song-box.drop-after')
      .forEach(el => el.classList.remove('drop-merge', 'drop-before', 'drop-after'));
  }
  function hitTest() {
    const under = document.elementFromPoint(drag.x, drag.y);
    if (!under || !drag.grid.contains(under)) { clearMarks(); drag.target = null; return; }
    const t = under.closest('.song-box');
    if (!t) return;                                    // in a gap: keep the last mark
    clearMarks();
    if (t === drag.card) { drag.target = null; return; }
    const r = t.getBoundingClientRect();
    const px = (drag.x - r.left) / r.width, py = (drag.y - r.top) / r.height;
    if (px > 0.25 && px < 0.75 && py > 0.2 && py < 0.8) {
      t.classList.add('drop-merge');
      drag.target = { id: t.dataset.box, merge: true };
    } else {
      const after = px >= 0.5;
      t.classList.add(after ? 'drop-after' : 'drop-before');
      drag.target = { id: t.dataset.box, after };
    }
  }
  function onDragMove(e) {
    if (!drag) return;
    drag.x = e.clientX;
    drag.y = e.clientY;
    if (!drag.on) {
      if (Math.hypot(drag.x - drag.x0, drag.y - drag.y0) < 6) return;
      startDrag();
    }
    e.preventDefault();
    drag.ghost.style.left = (drag.x - drag.dx) + 'px';
    drag.ghost.style.top = (drag.y - drag.dy) + 'px';
    hitTest();
  }
  function autoScroll() {
    if (!drag || !drag.on || !drag.scroller) return;
    const r = drag.scroller.getBoundingClientRect();
    const edge = 56;
    let d = 0;
    if (drag.y < r.top + edge) d = -Math.ceil((r.top + edge - drag.y) / 4);
    else if (drag.y > r.bottom - edge) d = Math.ceil((drag.y - (r.bottom - edge)) / 4);
    if (!d) return;
    drag.scroller.scrollTop += d;
    hitTest();
  }
  function endDrag() {
    document.removeEventListener('pointermove', onDragMove);
    document.removeEventListener('pointerup', onDragEnd);
    document.removeEventListener('pointercancel', onDragCancel);
    if (!drag) return null;
    const d = drag;
    drag = null;
    clearInterval(d.timer);
    if (d.ghost) d.ghost.remove();
    if (d.card) d.card.classList.remove('sb-dragging');
    document.body.classList.remove('box-dragging');
    clearMarks();
    return d;
  }
  function onDragCancel() { endDrag(); }
  function onDragEnd() {
    const d = endDrag();
    if (!d || !d.on || !d.target) return;
    if (d.target.merge) mergeBoxes(d.id, d.target.id);
    else moveBox(d.id, d.target.id, d.target.after);
  }
  // Esc lets go of a box being dragged
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drag) { e.preventDefault(); e.stopImmediatePropagation(); endDrag(); }
  }, true);

  function moveBox(id, targetId, after) {
    const st = state();
    if (!st.boxes[id] || !st.boxes[targetId]) return;
    const shown = ordered(st).map(b => b.id).filter(x => x !== id);
    const at = shown.indexOf(targetId) + (after ? 1 : 0);
    shown.splice(at, 0, id);
    const was = st.alpha;
    st.order = shown;
    st.alpha = false;
    write(st);
    L.renderLibrarySongList();
    if (was) ui.toast('Your own order now — A–Z puts them back in order', 3200);
  }

  function mergeBoxes(fromId, intoId) {
    const lib = L.getStoredLibrary();
    const st = state(lib);
    const a = st.boxes[fromId], b = st.boxes[intoId];
    if (!a || !b || a === b) return;
    const n = a.versions.length;
    const ok = confirm('Put “' + a.title + '” into “' + b.title + '”?\n\n'
      + (n === 1 ? 'It becomes a version' : 'Its ' + n + ' versions become versions') + ' of “' + b.title + '”. '
      + 'Open still opens “' + b.title + '”’s lead version. Expand → Move out takes any version out again.');
    if (!ok) return;
    b.versions = b.versions.concat(a.versions);
    if (!b.composer && a.composer) b.composer = a.composer;
    dropBox(st, fromId);
    write(st);
    L.renderLibrarySongList();
    ui.toast('“' + a.title + '” is in “' + b.title + '” now');
  }

  /* ==================================================================
     EXPAND: one box, its name and composer, every version
     ================================================================== */
  let expanded = null;
  function expand(bid) {
    expanded = bid;
    $('box-add-panel').hidden = true;
    $('box-add-btn').setAttribute('aria-expanded', 'false');
    $('box-add-find').value = '';
    renderExpand();
    ui.openSheet('box-sheet');
  }

  function lockNote(kind, lib, id) {
    if (kind === 'builtin') return 'Comes with Song Writer: it can’t be renamed, changed or deleted. Change it and press Save my copy — your version joins this box.';
    if (kind === 'book') return 'From your teacher’s book “' + lib[id].book + '”: it can’t be renamed, changed or deleted (it leaves when the book is put back). Save my copy makes your own version here.';
    if (kind === 'shared') return 'Shared with you: it can’t be renamed or changed. Save my copy makes your own version here.';
    return '';
  }
  const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  function when(lib, id) {
    const r = lib[id];
    const t = r.updatedAt || r.createdAt || 0;
    if (!t) return '';
    try { return new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; }
  }
  function smallBtn(text, title, fn, cls) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lib-action-btn' + (cls ? ' ' + cls : '');
    b.innerHTML = text;
    b.title = title;
    b.setAttribute('aria-label', title);
    b.addEventListener('click', fn);
    return b;
  }

  function renderExpand() {
    if (!expanded) return;
    const lib = L.getStoredLibrary();
    const st = state(lib);
    const b = st.boxes[expanded];
    if (!b) { expanded = null; ui.closeSheet('box-sheet'); return; }
    $('box-sheet-title').textContent = b.title;
    const name = $('box-name'), comp = $('box-composer');
    if (document.activeElement !== name) name.value = b.title;
    if (document.activeElement !== comp) comp.value = b.composer || '';
    const anyKept = b.versions.some(id => kept(lib, id));
    const note = $('box-name-note');
    note.hidden = !anyKept;
    note.textContent = anyKept ? 'This is the box’s name. Your own versions take a new name with it; a version kept as it came keeps its own.' : '';
    const n = b.versions.length;
    $('box-versions-title').textContent = n === 1 ? 'One version' : n + ' versions';

    const wrap = $('box-versions');
    wrap.innerHTML = '';
    const cur = L.currentId();
    versionsInOrder(b, lib).forEach(id => {
      const kind = kindOf(lib, id);
      const rec = L.normalizeSong(lib[id], id);
      const isLead = id === b.lead;
      const row = document.createElement('div');
      row.className = 'bv-row' + (isLead ? ' is-lead' : '') + (id === cur ? ' is-open' : '') + (kept(lib, id) ? ' is-kept' : '');
      // the lead: ★ — the one Open opens
      const star = document.createElement('button');
      star.type = 'button';
      star.className = 'bv-star';
      star.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.85 5.95 6.5.85-4.75 4.5 1.2 6.45L12 17.4l-5.8 3.15 1.2-6.45-4.75-4.5 6.5-.85z"/></svg>';
      star.setAttribute('aria-pressed', String(isLead));
      star.title = isLead ? 'The lead version — Open opens this one' : 'Make this the lead version, the one Open opens';
      star.setAttribute('aria-label', star.title);
      if (n === 1) star.disabled = true;
      star.addEventListener('click', () => setLead(b.id, id));
      const badge = document.createElement('span');
      badge.className = 'key-badge';
      L.paintBadge(badge, rec.score.key);
      const main = document.createElement('div');
      main.className = 'bv-main';
      const t = document.createElement('div');
      t.className = 'bv-title';
      const tt = document.createElement('span');
      tt.textContent = rec.title;
      t.appendChild(tt);
      t.appendChild(tag(kind, kind === 'book' ? 'Teacher' : null));
      if (isLead && n > 1) {
        const lt = document.createElement('span');
        lt.className = 'bv-lead-tag';
        lt.textContent = 'Lead';
        t.appendChild(lt);
      }
      if (id === cur) {
        const ot = document.createElement('span');
        ot.className = 'bv-open-tag';
        ot.textContent = 'Open now';
        t.appendChild(ot);
      }
      const meta = document.createElement('small');
      meta.className = 'bv-meta';
      const date = when(lib, id);
      meta.textContent = L.subline(rec.score) + (kind === 'builtin' ? '' : date ? ' · ' + (kind === 'shared' || kind === 'book' ? 'sent ' : 'changed ') + date : '');
      main.appendChild(t);
      main.appendChild(meta);
      const ln = lockNote(kind, lib, id);
      if (ln) {
        const p = document.createElement('small');
        p.className = 'bv-note';
        p.innerHTML = LOCK + '<span></span>';
        p.querySelector('span').textContent = ln;
        main.appendChild(p);
      }
      const actions = document.createElement('div');
      actions.className = 'bv-actions';
      actions.appendChild(smallBtn('Open', 'Open “' + rec.title + '”', () => openSong(id), 'load-btn'));
      actions.appendChild(smallBtn('Preview', 'A quick look at “' + rec.title + '”', () => openPreview(id)));
      if (!kept(lib, id)) actions.appendChild(smallBtn('Rename', 'Give this version a new name', () => L.showNewSongModal('rename', id)));
      if (n > 1) actions.appendChild(smallBtn('Move out', 'Take this version out of the box, into a box of its own', () => moveOut(b.id, id)));
      if (L.canDelete(id, lib[id])) actions.appendChild(smallBtn('&times;', 'Delete this version', () => {
        if (!confirm('Delete “' + rec.title + '”' + (n > 1 ? ', this version of “' + b.title + '”' : '') + '? This cannot be undone.')) return;
        L.deleteSongById(id);
      }, 'delete-btn-item'));
      row.appendChild(star);
      row.appendChild(badge);
      row.appendChild(main);
      row.appendChild(actions);
      wrap.appendChild(row);
    });
    if (!$('box-add-panel').hidden) renderAddList();
  }

  function setLead(bid, id) {
    const st = state();
    const b = st.boxes[bid];
    if (!b || b.lead === id || b.versions.indexOf(id) === -1) return;
    b.lead = id;
    write(st);
    L.renderLibrarySongList();
    renderExpand();
    ui.toast('Open opens this version now');
  }

  function moveOut(bid, id) {
    const lib = L.getStoredLibrary();
    const st = state(lib);
    const b = st.boxes[bid];
    if (!b || b.versions.length < 2) return;
    b.versions = b.versions.filter(x => x !== id);
    if (b.lead === id) b.lead = b.versions[0];
    addBox(st, makeBox(lib, [id]), st.alpha ? { end: true } : { after: bid });
    write(st);
    L.renderLibrarySongList();
    renderExpand();
    ui.toast('“' + titleOf(lib, id) + '” has a box of its own now');
  }

  function renameBox(bid, raw) {
    const title = String(raw || '').trim().slice(0, 60);
    const lib = L.getStoredLibrary();
    const st = state(lib);
    const b = st.boxes[bid];
    if (!b) return;
    if (!title) { $('box-name').value = b.title; return; }
    if (title === b.title) return;
    const was = b.title;
    b.title = title;
    write(st);
    // the person's own versions named as the box was follow it
    b.versions.forEach(id => { if (!kept(lib, id) && titleOf(lib, id) === was) L.setSongTitle(id, title); });
    L.renderLibrarySongList();
    renderExpand();
  }
  function setComposer(bid, raw) {
    const st = state();
    const b = st.boxes[bid];
    if (!b) return;
    const c = String(raw || '').trim().slice(0, 60);
    if (c === (b.composer || '')) return;
    b.composer = c;
    write(st);
    L.renderLibrarySongList();
  }

  /* Add a version from your library: any song not in this box. A song kept
     with other versions elsewhere leaves that box for this one. */
  function renderAddList() {
    const list = $('box-add-list');
    list.innerHTML = '';
    if (!expanded) return;
    const lib = L.getStoredLibrary();
    const st = state(lib);
    const here = st.boxes[expanded];
    if (!here) return;
    const q = fold($('box-add-find').value.trim());
    const rows = [];
    ordered(st).forEach(b => {
      if (b.id === here.id) return;
      versionsInOrder(b, lib).forEach(id => {
        if (q && !matches(titleOf(lib, id), q) && !matches(b.title, q)) return;
        rows.push({ id, box: b });
      });
    });
    if (!rows.length) {
      const e = document.createElement('div');
      e.className = 'library-empty';
      e.textContent = q ? 'No song is called that.' : 'Every song is in this box already.';
      list.appendChild(e);
      return;
    }
    rows.forEach(({ id, box }) => {
      const kind = kindOf(lib, id);
      const row = document.createElement('div');
      row.className = 'box-add-row';
      const badge = document.createElement('span');
      badge.className = 'key-badge';
      L.paintBadge(badge, scoreOf(lib, id).key);
      const main = document.createElement('div');
      main.className = 'bv-main';
      const t = document.createElement('div');
      t.className = 'bv-title';
      const tt = document.createElement('span');
      tt.textContent = titleOf(lib, id);
      t.appendChild(tt);
      if (kind !== 'mine') t.appendChild(tag(kind));
      main.appendChild(t);
      if (box.versions.length > 1) {
        const s = document.createElement('small');
        s.className = 'bv-meta';
        s.textContent = 'A version in “' + box.title + '” (' + box.versions.length + ' versions) — it moves here';
        main.appendChild(s);
      }
      row.appendChild(badge);
      row.appendChild(main);
      row.appendChild(smallBtn('Add', 'Make “' + titleOf(lib, id) + '” a version of “' + here.title + '”', () => addVersion(here.id, id), 'load-btn'));
      list.appendChild(row);
    });
  }
  function addVersion(bid, id) {
    const lib = L.getStoredLibrary();
    const st = state(lib);
    const b = st.boxes[bid];
    const from = boxIdOf(st, id);
    if (!b || from === bid) return;
    if (from) {
      const fb = st.boxes[from];
      fb.versions = fb.versions.filter(x => x !== id);
      if (!fb.versions.length) dropBox(st, from);
      else if (fb.lead === id) fb.lead = fb.versions[0];
    }
    b.versions.push(id);
    write(st);
    L.renderLibrarySongList();
    renderExpand();
    ui.toast('“' + titleOf(lib, id) + '” is a version of “' + b.title + '” now');
  }

  /* ==================================================================
     PREVIEW: a small floating window over everything
     ================================================================== */
  const pv = { id: null, ready: false, placed: false };
  const pvWin = () => $('song-preview');
  const pvFrame = () => $('sp-frame');
  function frameApi() {
    try { const w = pvFrame().contentWindow; return w && w.SongWriterPreview ? w.SongWriterPreview : null; } catch (e) { return null; }
  }
  function frameUrl() {
    const u = new URL(window.location.href);
    u.hash = '';
    u.search = '?embed=preview';
    return u.toString();
  }
  function placePreview() {
    const win = pvWin();
    const vw = window.innerWidth, vh = window.innerHeight;
    let w, h, x, y;
    if (vw < 640) { w = vw - 16; h = Math.round(vh * 0.62); x = 8; y = vh - h - 8; }
    else { w = Math.min(620, vw - 32); h = Math.min(480, vh - 120); x = vw - w - 24; y = Math.max(16, Math.round((vh - h) / 2) - 20); }
    Object.assign(win.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
    pv.placed = true;
  }
  function keepOnScreen() {
    const win = pvWin();
    const r = win.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const x = Math.min(Math.max(r.left, 8 - r.width + 120), vw - 120);
    const y = Math.min(Math.max(r.top, 8), vh - 48);
    win.style.left = x + 'px';
    win.style.top = y + 'px';
  }
  function openPreview(id) {
    const lib = L.getStoredLibrary();
    if (!lib[id]) return;
    const rec = L.normalizeSong(lib[id], id);
    const kind = kindOf(lib, id);
    const st = state(lib);
    const bid = boxIdOf(st, id);
    const b = bid ? st.boxes[bid] : null;
    $('sp-title').textContent = rec.title;
    $('sp-sub').textContent = L.subline(rec.score) + (kind !== 'mine' ? ' · ' + KIND[kind].tag : '') + (b && b.versions.length > 1 ? ' · ' + (b.lead === id ? 'lead version' : 'a version') + ' of “' + b.title + '”' : '');
    const win = pvWin();
    if (!pv.placed) placePreview();
    win.hidden = false;
    keepOnScreen();
    pv.id = id;
    /* Opened as a file (index.html from the Finder), the browser keeps the page
       out of the frame (file:// pages are each their own origin): Preview needs
       Song Writer at a web address — the site, or a local server. */
    if (window.location.protocol === 'file:') {
      $('sp-loading').hidden = false;
      $('sp-loading').textContent = 'Preview works when Song Writer is opened from a web address (eagleviewmusic.com), not from a file on this computer.';
      return;
    }
    const api = pv.ready ? frameApi() : null;
    if (api) { show(id); return; }
    $('sp-loading').hidden = false;
    $('sp-loading').textContent = 'Opening…';
    const f = pvFrame();
    if (!f.getAttribute('src')) f.setAttribute('src', frameUrl());
  }
  function show(id) {
    const api = frameApi();
    if (!api) return;
    let ok = false;
    try { ok = api.open(id); } catch (e) { console.error('Preview:', e); }
    $('sp-loading').hidden = ok;
    if (!ok) $('sp-loading').textContent = 'This song could not be opened here.';
  }
  function closePreview() {
    const win = pvWin();
    if (!win || win.hidden) return;
    const api = frameApi();
    if (api) { try { api.stop(); } catch (e) {} }
    win.hidden = true;
    pv.id = null;
  }
  // the frame lets go when the Library closes (it is a whole Song Writer)
  function unloadPreview() {
    closePreview();
    const f = pvFrame();
    if (f && f.getAttribute('src')) { f.removeAttribute('src'); try { f.contentWindow.location.replace('about:blank'); } catch (e) {} }
    pv.ready = false;
  }

  function wirePreview() {
    const win = pvWin(), f = pvFrame();
    if (!win || !f) return;
    f.addEventListener('load', () => {
      if (!f.getAttribute('src')) return;
      let tries = 0;
      (function wait() {
        if (frameApi()) { pv.ready = true; if (pv.id) show(pv.id); return; }
        if (++tries < 60) setTimeout(wait, 50);
        else $('sp-loading').textContent = 'The preview did not open.';
      })();
    });
    $('sp-close').addEventListener('click', closePreview);
    // moved by its title bar
    const headEl = $('sp-head');
    headEl.addEventListener('pointerdown', e => {
      if (e.button !== 0 || e.target.closest('button')) return;
      e.preventDefault();
      const r = win.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      win.classList.add('moving');
      const move = ev => {
        win.style.left = (ev.clientX - dx) + 'px';
        win.style.top = (ev.clientY - dy) + 'px';
        keepOnScreen();
      };
      const up = () => {
        win.classList.remove('moving');
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        document.removeEventListener('pointercancel', up);
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      document.addEventListener('pointercancel', up);
    });
    // made bigger or smaller by its corner
    const grip = document.createElement('span');
    grip.className = 'sp-size';
    grip.title = 'Drag to make the preview bigger or smaller';
    win.appendChild(grip);
    grip.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      const r = win.getBoundingClientRect();
      const x0 = e.clientX, y0 = e.clientY;
      win.classList.add('moving');
      const move = ev => {
        win.style.width = Math.max(300, Math.min(window.innerWidth - r.left - 4, r.width + ev.clientX - x0)) + 'px';
        win.style.height = Math.max(220, Math.min(window.innerHeight - r.top - 4, r.height + ev.clientY - y0)) + 'px';
      };
      const up = () => {
        win.classList.remove('moving');
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
        document.removeEventListener('pointercancel', up);
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
      document.addEventListener('pointercancel', up);
    });
    // Esc closes the preview first (before the window under it)
    window.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || win.hidden) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      closePreview();
    }, true);
    window.addEventListener('resize', () => { if (!win.hidden) keepOnScreen(); });
  }

  /* ---------------- start ---------------- */
  function init() {
    if (window.EVM_STUDIO_EMBED) return;        // a frame (the studio's, a preview): no Library window to draw
    const find = $('lib-find');
    if (find) {
      find.addEventListener('input', () => L.renderLibrarySongList());
      find.addEventListener('keydown', e => {
        if (e.key === 'Escape' && find.value) { e.preventDefault(); e.stopPropagation(); find.value = ''; L.renderLibrarySongList(); }
      });
    }
    const seg = $('lib-view-seg');
    if (seg) seg.addEventListener('click', e => {
      const b = e.target.closest('[data-lib-view]');
      if (b) setView(b.dataset.libView);
    });
    const az = $('lib-az');
    if (az) az.addEventListener('click', alphabetize);
    $('box-name').addEventListener('change', e => { if (expanded) renameBox(expanded, e.target.value); });
    $('box-composer').addEventListener('change', e => { if (expanded) setComposer(expanded, e.target.value); });
    ['box-name', 'box-composer'].forEach(id => $(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
    }));
    $('box-add-btn').addEventListener('click', () => {
      const p = $('box-add-panel');
      p.hidden = !p.hidden;
      $('box-add-btn').setAttribute('aria-expanded', String(!p.hidden));
      if (!p.hidden) { renderAddList(); setTimeout(() => $('box-add-find').focus(), 40); }
    });
    $('box-add-find').addEventListener('input', renderAddList);
    $('box-add-find').addEventListener('keydown', e => {
      if (e.key === 'Escape' && e.target.value) { e.preventDefault(); e.stopPropagation(); e.target.value = ''; renderAddList(); }
    });
    wirePreview();
    SW.bus.on('sheet:closed', d => {
      if (!d) return;
      if (d.id === 'box-sheet') { expanded = null; }
      if (d.id === 'library-sheet') { ui.closeSheet('box-sheet'); unloadPreview(); }
    });
  }

  SW.boxes = {
    render, view, query, matches, syncBar, onOpen,
    boxOf, placeNew, recordRenamed, exportFor, importFrom, reset,
    openPreview, closePreview, expand
  };
  init();
})();

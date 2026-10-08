/* ==========================================================================
   Melody Reader — melodies.js
   --------------------------------------------------------------------------
   RR.Melodies — the My melodies window (the ♫ button in the top bar).

   THE LIST   + New set · Teacher Library · Download a backup · Restore
              then the sets: the Teacher Library's books (taken out on the
              shelf), Shared with you (from links), Your sets. Each row has
              ▶ Play this set.
   A SET      its melodies as small engravings, each with ▶ hear · ✎ edit ·
              ↑ ↓ · ×, and + Add a melody (which opens Make a melody).
              Your own sets: rename, Copy link, Delete. A shared set is
              read-only: play it as it is, or Save my copy. A Teacher
              Library set leaves with Put back (on the shelf).

   Play this set plays the set just this time (G.over.set, 2026-10-08)
   over whatever level or session is chosen — its helps and tempos — and
   the chip reads "Week 3 · Level 4". Stop here, or picking another level
   or session, ends it; it is never saved into the level or session. (To
   make a session always play a set: its ✎ page → Melody Source → My
   Melodies.)
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game;
  let view = null;        // null = the list; else a set id
  let timers = [];

  const meta = set => {
    const n = set.melodies.length;
    const times = Array.from(new Set(set.melodies.map(m => m.time[0] + '/4')));
    return n + (n === 1 ? ' melody' : ' melodies') + (times.length ? ' · ' + times.join(', ') : '');
  };
  const isOwn = set => !set.received;
  const playing = id => G.over && G.over.set === id && G.mode.kind !== 'lesson';   // played just this time (Stop ends it)

  function pic(m) {
    const card = { time: m.time, notes: m.notes };
    return RR.Eng.render(card, { ss: 8, maxW: 270, maxStretch: 1.4, colour: 'always', states: m.notes.map(() => 'lit'), noHalo: true, labels: 'none' }).svg;
  }

  function rowHtml(set) {
    const tag = RR.Sets.isShelf(set) ? '<span class="mel-tag book">Teacher Library</span>' : set.received ? '<span class="mel-tag">Shared</span>' : '';
    return '<div class="mel-row' + (playing(set.id) ? ' playing' : '') + '"><button type="button" class="mel-open" data-open="' + set.id + '">' +
      '<b>' + RR.esc(set.title) + '</b>' + tag + (playing(set.id) ? '<span class="mel-tag now">Playing now</span>' : '') +
      '<span class="mel-meta">' + meta(set) + '</span></button>' +
      (set.melodies.length ? '<button type="button" class="pill-btn go mel-play" data-play="' + set.id + '">▶ Play</button>' : '') + '</div>';
  }

  function listHtml() {
    const sets = RR.Sets.list();
    const books = new Map(), shared = [], own = [];
    sets.forEach(s => {
      if (RR.Sets.isShelf(s)) { if (!books.has(s.book)) books.set(s.book, []); books.get(s.book).push(s); }
      else if (s.received) shared.push(s);
      else own.push(s);
    });
    const shelfOn = !!window.EVMShelf && G.mode.kind !== 'lesson';
    let h = '<div class="mel-actions">' +
      '<button type="button" class="pill-btn primary" data-act="new">+ New set</button>' +
      (shelfOn ? '<button type="button" class="pill-btn" data-act="shelf">Teacher Library</button>' : '') +
      '<button type="button" class="pill-btn" data-act="backup">Download a backup</button>' +
      '<button type="button" class="pill-btn" data-act="restore">Restore from a backup</button></div>' +
      '<div class="mel-new" id="mel-new" hidden><input type="text" id="mel-new-name" maxlength="60" placeholder="A name for the set — Week 3, say">' +
      '<button type="button" class="pill-btn primary" data-act="create">Make it</button></div>' +
      RR.note('ml', 'A set is a group of melodies you write — Week 3, say. Play it here, or share it with a link. Sets from the Teacher Library and from links are shared: play them as they are, or Save my copy to change them.');
    [...books.keys()].sort().forEach(b => { h += '<h3 class="mel-group">📚 ' + RR.esc(b) + '</h3>' + books.get(b).map(rowHtml).join(''); });
    if (shared.length) h += '<h3 class="mel-group">Shared with you</h3>' + shared.map(rowHtml).join('');
    h += '<h3 class="mel-group">Your sets</h3>' + (own.length ? own.map(rowHtml).join('') : '<p class="note">No sets of your own yet. <b>+ New set</b> to write the first one.</p>');
    return h;
  }

  function setHtml(set) {
    const own = isOwn(set), shelf = RR.Sets.isShelf(set);
    let h = '<div class="mel-set-head">' +
      (own ? '<input type="text" class="mel-rename" id="mel-rename" maxlength="60" value="' + RR.esc(set.title) + '" aria-label="The set’s name">'
        : '<h3 class="mel-set-title">' + RR.esc(set.title) + '</h3>' + (shelf ? '<span class="mel-tag book">Teacher Library · ' + RR.esc(set.book) + '</span>' : '<span class="mel-tag">Shared</span>')) +
      '</div><div class="mel-actions">' +
      (set.melodies.length ? (playing(set.id) ? '<button type="button" class="pill-btn" data-act="stop">■ Stop playing it</button>' : '<button type="button" class="pill-btn go" data-act="play">▶ Play this set</button>') : '') +
      (own ? '' : '<button type="button" class="pill-btn primary" data-act="copy">Save my copy</button>') +
      (set.melodies.length ? '<button type="button" class="pill-btn" data-act="link">Copy a link</button>' : '') +
      (shelf ? '' : '<button type="button" class="pill-btn" data-act="delete">Delete set…</button>') + '</div>' +
      (own ? '' : RR.note('mlro', shelf ? 'This set is from the Teacher Library. It stays as your teacher made it; Save my copy to change it. Put the book back on the Teacher Library shelf when you’re done.' : 'This set came from a link. It stays as it was sent; Save my copy to make one you can change.'));
    h += '<div class="mel-grid">' + set.melodies.map((m, i) => '<div class="mel-card">' +
      '<div class="mel-pic">' + pic(m) + '</div><div class="mel-cap"><b>' + (i + 1) + '</b> ' + RR.esc(m.title || '') + '</div>' +
      '<div class="mel-tools"><button type="button" data-hear="' + i + '" aria-label="Hear melody ' + (i + 1) + '">▶</button>' +
      (own ? '<button type="button" data-edit="' + i + '" aria-label="Change melody ' + (i + 1) + '">✎</button>' +
        '<button type="button" data-up="' + i + '" aria-label="Move up"' + (i ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" data-down="' + i + '" aria-label="Move down"' + (i < set.melodies.length - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" data-del="' + i + '" aria-label="Delete melody ' + (i + 1) + '">×</button>' : '') +
      '</div></div>').join('') +
      (own ? '<button type="button" class="mel-card mel-add" data-act="add"><span>+</span>Add a melody</button>' : '') + '</div>' +
      (own && !set.melodies.length ? RR.note('mlhow', 'Add a melody, pick a note value, then strike the bars to write it — the music draws as you go.') : '');
    return h;
  }

  function render() {
    if ($('#melodies').hidden) return;
    const set = view ? RR.Sets.get(view) : null;
    if (view && !set) view = null;
    $('#mel-back').hidden = !view;
    $('#mel-title').textContent = view ? 'Melody set' : 'My melodies';
    $('#mel-tag').textContent = G.playingSet() && G.mode.kind !== 'lesson' ? 'Playing: ' + G.playingSet().title : '';
    const body = $('#mel-body'), y = body.scrollTop;
    body.innerHTML = view ? setHtml(set) : listHtml();
    body.scrollTop = y;
  }
  function open(id) {
    G.pause();
    view = id && RR.Sets.get(id) ? id : null;
    RR.windowOpened($('#melodies'));
    $('#melodies').hidden = false;
    render();
    const f = $('#melodies .mel-actions .pill-btn') || $('#melodies .close'); if (f) f.focus();
  }
  function close() { if ($('#melodies').hidden) return; stopHear(); $('#melodies').hidden = true; RR.windowClosed($('#melodies')); }

  /* ---------------- playing a set ---------------- */
  function play(id) {
    G.playOnce('set', id);                              // a new round: a new set starts with Practice on
    close();
    if (RR.View) RR.View.go('play');
    RR.toast('Playing ' + RR.Sets.get(id).title);
  }
  function stop() {
    G.playOnce('set', null);
    render();
  }
  function hear(m) {
    stopHear();
    if (!RR.Sound.ctx) return;
    const spt = 60 / RR.paceTempo(G.setup, RR.listenPace()) / 4;
    let t = RR.Sound.now() + 0.1;
    m.notes.forEach(n => {
      if (n.p) { RR.Sound.playAt(n.p, t); const id = n.p; timers.push(setTimeout(() => RR.Xylo.flash(id, 'demo', 260), Math.max(0, RR.Sound.heardAt(t) - RR.now()))); }
      t += n.t * spt;
    });
  }
  function stopHear() { timers.forEach(clearTimeout); timers = []; RR.Sound.stopPlayed(); }

  /* ---------------- the window's clicks ---------------- */
  const body = $('#mel-body');
  body.addEventListener('click', async e => {
    if (RR.foldClick(e)) return;
    const t = e.target;
    const o = t.closest('[data-open]'); if (o) { view = o.dataset.open; body.scrollTop = 0; render(); return; }
    const p = t.closest('[data-play]'); if (p) { play(p.dataset.play); return; }
    const set = view ? RR.Sets.get(view) : null;
    const idx = name => { const b = t.closest('[data-' + name + ']'); return b ? +b.dataset[name] : null; };
    let i;
    if (set && (i = idx('hear')) !== null) { hear(set.melodies[i]); return; }
    if (set && (i = idx('edit')) !== null) { RR.Maker.enter(set.id, i); return; }
    if (set && (i = idx('up')) !== null && i > 0) { RR.Sets.update(set.id, s => { const m = s.melodies.splice(i, 1)[0]; s.melodies.splice(i - 1, 0, m); }); render(); return; }
    if (set && (i = idx('down')) !== null) { RR.Sets.update(set.id, s => { if (i < s.melodies.length - 1) { const m = s.melodies.splice(i, 1)[0]; s.melodies.splice(i + 1, 0, m); } }); render(); return; }
    if (set && (i = idx('del')) !== null) {
      if (await RR.ask('Delete melody ' + (i + 1) + (set.melodies[i].title ? ' (“' + set.melodies[i].title + '”)' : '') + '?', 'Delete')) { RR.Sets.update(set.id, s => { s.melodies.splice(i, 1); }); render(); }
      return;
    }
    const a = t.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    if (act === 'new') { $('#mel-new').hidden = false; $('#mel-new-name').focus(); }
    else if (act === 'create') {
      const name = ($('#mel-new-name').value || '').trim();
      if (!name) { RR.toast('Give the set a name first'); $('#mel-new-name').focus(); return; }
      const rec = RR.Sets.create(name);
      view = rec.id; render();
    } else if (act === 'shelf') { if (window.EVMShelf) EVMShelf.openSheet(); }
    else if (act === 'backup') RR.Sets.download();
    else if (act === 'restore') $('#mel-file').click();
    else if (act === 'add' && set) RR.Maker.enter(set.id, null);
    else if (act === 'play' && set) play(set.id);
    else if (act === 'stop') stop();
    else if (act === 'copy' && set) { const rec = RR.Sets.saveMyCopy(set.id); if (rec) { view = rec.id; render(); RR.toast('Saved as your own: ' + rec.title); } }
    else if (act === 'link' && set) {
      const link = RR.Sets.shareLink(set.id);
      try { await navigator.clipboard.writeText(link); RR.toast('Link copied — opening it adds this set to My melodies'); }
      catch (_) {
        // no clipboard here: show the link, selected, to copy by hand
        let box = body.querySelector('.mel-link');
        if (!box) { box = document.createElement('input'); box.type = 'text'; box.readOnly = true; box.className = 'mel-link'; box.setAttribute('aria-label', 'The link to this set'); body.querySelector('.mel-actions').after(box); }
        box.value = link; box.focus(); box.select();
        RR.toast('Copy the link from the box');
      }
    } else if (act === 'delete' && set) {
      if (!(await RR.ask('Delete “' + set.title + '” and its ' + set.melodies.length + (set.melodies.length === 1 ? ' melody?' : ' melodies?'), 'Delete'))) return;
      const was = G.setup.set === set.id;                 // playing now (just this time, or a session's own source)
      RR.Sets.remove(set.id);
      if (was) G.playOnce('set', null);                   // made-up melodies from here
      view = null; render();
    }
  });
  body.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.id === 'mel-new-name') { e.preventDefault(); body.querySelector('[data-act="create"]').click(); }
    if (e.key === 'Enter' && e.target.id === 'mel-rename') { e.preventDefault(); e.target.blur(); }
  });
  body.addEventListener('change', e => {
    if (e.target.id !== 'mel-rename' || !view) return;
    const name = e.target.value.trim();
    if (!name) { render(); return; }
    RR.Sets.update(view, s => { s.title = name.slice(0, 60); });
    G.drawChips();
  });
  $('#mel-file').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      let said;
      try { said = RR.Sets.restore(JSON.parse(r.result)); } catch (_) { said = 'That file isn’t a backup Melody Reader can read'; }
      RR.toast(said.charAt(0).toUpperCase() + said.slice(1));
      e.target.value = '';
      render();
    };
    r.readAsText(f);
  });
  $('#mel-back').addEventListener('click', () => { view = null; render(); });
  $('#melodies').addEventListener('click', e => { if (e.target === $('#melodies') || e.target.closest('[data-close]')) close(); });

  RR.Melodies = { open, close, render, play, stop, isOpen: () => !$('#melodies').hidden };
})();

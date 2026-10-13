/* ==========================================================================
   Melody Reader — melodies.js
   --------------------------------------------------------------------------
   RR.Melodies — the window that was My melodies (the ♫ button in the top
   bar until 2026-10-12): it is the Library now (the user's: the ♫ and the
   gear became one Library button). Its list is the Library (library.js —
   the sets are its My melodies folder: ▶ Play, Open); this file keeps the
   window and a set's own page.

   A SET      its melodies as small engravings, each with ▶ hear · ✎ edit ·
              ↑ ↓ · ×, and + Add a melody (which opens Make a melody).
              Your own sets: rename, Copy link, Delete. A shared set is
              read-only: play it as it is, or Save my copy. A Teacher
              Library set leaves with Put back (on the shelf).

   ▶ TEACH ME TO READ (2026-10-12, the user's: "turn whatever melodies I
   have into educational mode") — on every set's page: the set becomes a
   unit of Teach Me to Read (RR.TeachUnits) and plays that way at once —
   bigger, round and round, its notes' lines lit. ⧉ Copy melodies in
   (your own sets) copies melodies from your other sets, shared ones and
   the Songbook — so a unit can be built from melodies you already have.

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
  let view = null;        // null = the Library (library.js); else a set id
  let timers = [];
  let copy = null;        // ⧉ Copy melodies in: { into: set id, chosen: Set of 'source|index', open: Set of sources }

  const isOwn = set => !set.received;
  const playing = id => G.over && G.over.set === id && G.mode.kind !== 'lesson';   // played just this time (Stop ends it)

  function pic(m) {
    const card = { time: m.time, notes: m.notes };
    return RR.Eng.render(card, { ss: 8, maxW: 270, maxStretch: 1.4, colour: 'always', states: m.notes.map(() => 'lit'), noHalo: true, labels: 'none' }).svg;
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
      (own ? '' : RR.note('mlro', shelf ? 'This set is from the Teacher Library. It stays as your teacher made it; Save my copy to change it. Put the book back on the Teacher Library shelf when you’re done.' : 'This set came from a link. It stays as it was sent; Save my copy to make one you can change.')) +
      teachHtml(set);
    h += '<div class="mel-grid">' + set.melodies.map((m, i) => '<div class="mel-card">' +
      '<div class="mel-pic">' + pic(m) + '</div><div class="mel-cap"><b>' + (i + 1) + '</b> ' + RR.esc(m.title || '') + '</div>' +
      '<div class="mel-tools"><button type="button" data-hear="' + i + '" aria-label="Hear melody ' + (i + 1) + '">▶</button>' +
      (own ? '<button type="button" data-edit="' + i + '" aria-label="Change melody ' + (i + 1) + '">✎</button>' +
        '<button type="button" data-up="' + i + '" aria-label="Move up"' + (i ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" data-down="' + i + '" aria-label="Move down"' + (i < set.melodies.length - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" data-del="' + i + '" aria-label="Delete melody ' + (i + 1) + '">×</button>' : '') +
      '</div></div>').join('') +
      (own ? '<button type="button" class="mel-card mel-add" data-act="add"><span>+</span>Add a melody</button>' +
        '<button type="button" class="mel-card mel-add" data-act="copyin"><span>⧉</span>Copy melodies in<small>from your other sets or the Songbook</small></button>' : '') + '</div>' +
      (own && !set.melodies.length ? RR.note('mlhow', 'Add a melody, pick a note value, then strike the bars to write it — the music draws as you go.') : '');
    return h;
  }

  const lib = () => !view && !copy;            // the Library's own pages (library.js), not a set's
  function render() {
    if ($('#melodies').hidden) return;
    const set = view ? RR.Sets.get(view) : null;
    if (view && !set) view = null;
    if (copy && (!set || copy.into !== view)) copy = null;
    $('#mel-back').hidden = lib() && !RR.Library.sub();
    $('#mel-back').setAttribute('aria-label', copy ? 'Back to the set' : 'Back to the Library');
    $('#mel-title').textContent = copy ? 'Copy melodies in' : view ? 'Melody set' : RR.Library.title();
    $('#mel-tag').textContent = !lib() && G.playingSet() && G.mode.kind !== 'lesson' ? 'Playing: ' + G.playingSet().title : '';
    const body = $('#mel-body'), y = body.scrollTop;
    body.innerHTML = copy ? copyHtml(set) : view ? setHtml(set) : RR.Library.html();
    body.scrollTop = y;
  }
  /* the Library — or (id) a set's page in it */
  function open(id) {
    G.pause();
    view = id && RR.Sets.get(id) ? id : null;
    copy = null;
    if (!view) RR.Library.reset();
    RR.windowOpened($('#melodies'));
    $('#melodies').hidden = false;
    $('#mel-body').scrollTop = 0;
    render();
    const f = $('#melodies .lb-btns .pill-btn') || $('#melodies .mel-actions .pill-btn') || $('#melodies .close'); if (f) f.focus();
  }
  function close() {
    if ($('#melodies').hidden) return;
    stopHear(); copy = null;
    $('#melodies').hidden = true; RR.windowClosed($('#melodies'));
    if (RR.Teach) RR.Teach.refresh();             // a unit of Teach Me to Read playing: its melodies may have changed
  }

  /* ---------------- Teach Me to Read (2026-10-12) ----------------
     the set as a unit: ▶ plays it there (into the units if it isn't one); a unit can be taken out */
  function teachHtml(set) {
    const isUnit = RR.TeachUnits && RR.TeachUnits.has(set.id), n = set.melodies.length;
    return '<div class="mel-teach"><span class="mel-teach-ico" aria-hidden="true">' + RR.TEACH_ICON + '</span>' +
      '<div class="mel-teach-txt"><b>Practice' + (isUnit ? ' <span class="mel-tag teach">an exercise</span>' : '') + '</b>' +
      '<span>' + (isUnit ? (n ? 'One of Practice’s exercises: played big, round and round, the lines of its notes lit.' : 'One of Practice’s exercises — + Add a melody to write its first.')
        : n ? 'Play this set the Practice way: big, round and round, the lines of its notes lit — it joins Practice’s exercises.'
          : 'Write a melody, then play the set the Practice way.') + '</span></div>' +
      '<div class="mel-teach-btns">' + (n ? '<button type="button" class="pill-btn go" data-act="teach">▶ Practice</button>' : '') +
      (isUnit ? '<button type="button" class="h-link" data-act="teach-out">Take it out</button>' : '') + '</div></div>';
  }

  /* ---------------- ⧉ Copy melodies in (2026-10-12) ----------------
     melodies from your other sets (shared ones and the Teacher Library's too) and the Songbook's songs,
     copied into this set — a copy: changing one never changes the other */
  const MAX = 60;
  function sources(into) {
    const sets = RR.Sets.list().filter(x => x.id !== into && !/^lesson/.test(x.id) && x.melodies.length)
      .map(x => ({ id: 'set:' + x.id, title: x.title, tag: RR.Sets.isShelf(x) ? 'Teacher Library' : x.received ? 'Shared' : '', melodies: x.melodies }));
    const songs = Object.keys(RR.SONGS).map(id => ({ id: 'song:' + id, title: RR.SONGS[id].title, tag: 'Songbook', song: true,
      melodies: RR.Melody.songCards(id).map(c => RR.Sets.normalizeMelody({ title: c.title + ' ' + c.part, time: c.time, notes: c.notes })).filter(Boolean) }))
      .filter(x => x.melodies.length);
    return sets.concat(songs);
  }
  function copyHtml(set) {
    const room = MAX - set.melodies.length, srcs = sources(set.id), n = copy.chosen.size;
    const group = src => {
      const open = copy.open.has(src.id), picked = src.melodies.filter((m, i) => copy.chosen.has(src.id + '|' + i)).length;
      return '<div class="mel-src' + (open ? ' open' : '') + '"><button type="button" class="mel-src-head" data-src="' + RR.esc(src.id) + '" aria-expanded="' + open + '">' +
        '<b>' + (src.song ? '♪ ' : '♫ ') + RR.esc(src.title) + '</b>' + (src.tag ? '<span class="mel-tag' + (src.song ? ' song' : src.tag === 'Teacher Library' ? ' book' : '') + '">' + src.tag + '</span>' : '') +
        '<span class="mel-meta">' + src.melodies.length + (src.melodies.length === 1 ? ' melody' : ' melodies') + (picked ? ' · <em>' + picked + ' picked</em>' : '') + '</span><i aria-hidden="true">' + (open ? '▾' : '▸') + '</i></button>' +
        (open ? '<div class="mel-grid">' + src.melodies.map((m, i) => {
          const k = src.id + '|' + i, on = copy.chosen.has(k);
          return '<button type="button" class="mel-card mel-pick' + (on ? ' on' : '') + '" data-pick="' + RR.esc(k) + '" aria-pressed="' + on + '">' +
            '<span class="mel-check" aria-hidden="true">' + (on ? '✓' : '') + '</span><div class="mel-pic">' + pic(m) + '</div>' +
            '<div class="mel-cap"><b>' + (i + 1) + '</b> ' + RR.esc(m.title || '') + '</div></button>';
        }).join('') + '</div>' : '') + '</div>';
    };
    return '<div class="mel-set-head"><h3 class="mel-set-title">Into “' + RR.esc(set.title) + '”</h3></div>' +
      RR.note('mlcp', 'Tap the melodies to copy in — from your other sets and the Songbook. They’re copies: changing one never changes the other.') +
      '<div class="mel-actions mel-copy-bar"><button type="button" class="pill-btn go" data-cp="do"' + (n ? '' : ' disabled') + '>Copy ' + (n ? n + (n === 1 ? ' melody' : ' melodies') : 'the melodies') + ' in</button>' +
        '<button type="button" class="pill-btn" data-cp="cancel">Cancel</button>' +
        '<span class="mel-room">' + (room > 0 ? 'Room for ' + room + ' more' : 'This set is full (' + MAX + ')') + '</span></div>' +
      (srcs.length ? srcs.map(group).join('') : '<p class="note">No other melodies to copy yet.</p>');
  }
  /* the copy view's clicks: true when one was handled */
  function copyClick(t) {
    const set = RR.Sets.get(copy.into); if (!set) { copy = null; render(); return true; }
    const g = t.closest('[data-src]');
    if (g) { const id = g.dataset.src; if (copy.open.has(id)) copy.open.delete(id); else copy.open.add(id); render(); return true; }
    const p = t.closest('[data-pick]');
    if (p) {
      const k = p.dataset.pick;
      if (copy.chosen.has(k)) copy.chosen.delete(k);
      else if (set.melodies.length + copy.chosen.size >= MAX) { RR.toast('A set holds ' + MAX + ' melodies at most'); return true; }
      else copy.chosen.add(k);
      render(); return true;
    }
    const c = t.closest('[data-cp]'); if (!c) return false;
    if (c.dataset.cp === 'cancel') { copy = null; render(); return true; }
    // in the order they were picked
    const byId = new Map(sources(set.id).map(x => [x.id, x]));
    const mels = Array.from(copy.chosen).map(k => { const j = k.lastIndexOf('|'), src = byId.get(k.slice(0, j)); return src && src.melodies[+k.slice(j + 1)]; }).filter(Boolean);
    if (!mels.length) return true;
    const rec = RR.Sets.update(set.id, s => { mels.forEach(m => s.melodies.push(RR.clone(m))); });
    copy = null; render();
    if (rec) RR.toast('Copied ' + mels.length + (mels.length === 1 ? ' melody' : ' melodies') + ' into ' + rec.title);
    return true;
  }

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
    if (lib() && RR.Library.click(t)) return;
    if (copy && copyClick(t)) return;
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
    if (act === 'add' && set) RR.Maker.enter(set.id, null);
    else if (act === 'copyin' && set) { copy = { into: set.id, chosen: new Set(), open: new Set() }; const first = sources(set.id)[0]; if (first) copy.open.add(first.id); body.scrollTop = 0; render(); }
    else if (act === 'teach' && set) RR.Teach.playSet(set.id);
    else if (act === 'teach-out' && set) {
      if (!(await RR.ask('Take “' + set.title + '” out of Practice? The set stays here; its checks and stars there go.', 'Take it out'))) return;
      RR.TeachUnits.remove(set.id); render();
    }
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
      RR.TeachUnits.remove(set.id);                       // a unit of Teach Me to Read no more
      if (was) G.playOnce('set', null);                   // made-up melodies from here
      view = null; render();
    }
  });
  body.addEventListener('keydown', e => {
    if (lib() && RR.Library.keydown(e)) return;
    if (e.key === 'Enter' && e.target.id === 'mel-rename') { e.preventDefault(); e.target.blur(); }
  });
  body.addEventListener('input', e => { if (lib()) RR.Library.input(e); });
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
  // ‹ : out of Copy melodies in, out of a set, out of one of the Library's own pages — back to the Library
  $('#mel-back').addEventListener('click', () => { if (copy) copy = null; else if (view) view = null; else RR.Library.back(); render(); });
  $('#melodies').addEventListener('click', e => { if (e.target === $('#melodies') || e.target.closest('[data-close]')) close(); });

  RR.Melodies = { open, close, render, play, stop, isOpen: () => !$('#melodies').hidden };
})();

/* The Classroom, student side.
   Screens (the address after # keeps the place, so Back and reload work):
     #/                     the class boxes + the Filing Cabinet box
     #/c/<class>            that class's current lesson
     #/c/<class>/<item>     one thing from it, open inside the Classroom
     #/f[/<class>]          the Filing Cabinet, one drawer per class
     #/f/<class>/<lesson>[/<item>]   an older lesson, and one thing from it
   ?draft shows the teacher's unpublished draft from this browser (Preview as a student). */
(function () {
  'use strict';
  const C = window.Classroom, esc = C.esc;
  const root = document.getElementById('app');
  const PREVIEW = /[?&]draft\b/.test(location.search);
  let data = null, shownJson = '', openFrameKey = '';

  const parts = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const findClass = id => data.classes.find(c => c.id === id);
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

  function setLastClass(id) { try { localStorage.setItem(C.LAST_CLASS_KEY, id); } catch (e) { /* fine */ } }
  function lastClass() { try { return localStorage.getItem(C.LAST_CLASS_KEY); } catch (e) { return null; } }

  /* ---------- screens ---------- */
  function homeHtml() {
    const boxes = data.classes.map(c => {
      const n = c.lesson.items.length;
      const today = n ? (c.lesson.title ? `<span class="box-line">Today: <b>${esc(c.lesson.title)}</b></span>` : '<span class="box-line">Today\'s lesson is ready</span>')
                      : '<span class="box-line quiet">Nothing new yet</span>';
      return `<a class="class-box" href="#/c/${encodeURIComponent(c.id)}" style="${C.colorVars(c.color)}">
        <span class="box-name">${esc(c.name)}</span>${today}
        ${n ? `<span class="box-count">${plural(n, 'thing', 'things')}</span>` : ''}</a>`;
    }).join('');
    const cabinet = `<a class="class-box cabinet-box" href="#/f">
        <span class="cab-drawers" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="box-name">Filing Cabinet</span><span class="box-line">Older lessons to practice</span></a>`;
    return `<header class="top"><div class="brand">🦅 Eagle View Music</div><h1>The Classroom</h1></header>
      <main class="home"><p class="lead">Tap your class</p>
        <div class="class-grid">${boxes}${cabinet}</div>
        ${data.classes.length ? '' : '<p class="empty">No classes yet.</p>'}</main>`;
  }

  function itemsHtml(items, hrefBase) {
    if (!items.length) return '';
    return `<div class="items">${items.map(it => {
      const link = C.parseLink(it.url);
      const app = link.ok ? link.app : { name: 'Link', emoji: '🔗', icon: null };
      return `<a class="item" href="${hrefBase}/${encodeURIComponent(it.id)}">
        <span class="item-icon">${C.iconHtml(app)}</span>
        <span class="item-text"><span class="item-title">${esc(it.title || app.name)}</span>
          <span class="item-app">${esc(app.name)}</span>
          ${it.note ? `<span class="item-note">${esc(it.note)}</span>` : ''}</span>
        <span class="item-go">Open</span></a>`;
    }).join('')}</div>`;
  }

  const canSend = L => !!(L.sendBack && C.mailboxReady());
  function sendCardHtml(c) {
    return `<a class="item send-item" href="#/c/${encodeURIComponent(c.id)}/~send">
      <span class="item-icon">📬</span>
      <span class="item-text"><span class="item-title">Send to the Teacher</span>
        <span class="item-app">Send a message, or a link to your work</span></span>
      <span class="item-go">Send</span></a>`;
  }

  function classHtml(c) {
    const L = c.lesson, base = `#/c/${encodeURIComponent(c.id)}`;
    const body = L.items.length || canSend(L)
      ? `<div class="lesson-head"><h2>${esc(L.title || 'Today\'s lesson')}</h2><span class="lesson-date">${esc(C.niceDate(L.date, true))}</span></div>
         ${L.note ? `<p class="lesson-note">${esc(L.note)}</p>` : ''}${itemsHtml(L.items, base)}
         ${canSend(L) ? `<div class="items">${sendCardHtml(c)}</div>` : ''}`
      : `<div class="empty-card"><b>Nothing here yet.</b><br>Mr. Walby will put today's lesson here.</div>`;
    return `<header class="bar" style="${C.colorVars(c.color)}"><a class="back" href="#/">◀ All classes</a><h1>${esc(c.name)}</h1></header>
      <main class="lesson" style="${C.colorVars(c.color)}">${body}
        <a class="to-cabinet" href="#/f/${encodeURIComponent(c.id)}">Looking for an older lesson? <b>Open the Filing Cabinet</b></a></main>`;
  }

  function cabinetHtml(c) {
    const tabs = data.classes.map(k => `<a class="drawer-tab${k === c ? ' on' : ''}" href="#/f/${encodeURIComponent(k.id)}" style="${C.colorVars(k.color)}">${esc(k.name)}</a>`).join('');
    const folders = c ? c.cabinet.map(L => {
      const apps = [...new Set(L.items.map(it => { const p = C.parseLink(it.url); return p.ok ? p.app.emoji : '🔗'; }))].join(' ');
      return `<a class="folder" href="#/f/${encodeURIComponent(c.id)}/${encodeURIComponent(L.id)}" style="${C.colorVars(c.color)}">
        <span class="folder-date">${esc(C.niceDate(L.date))}</span>
        <span class="folder-title">${esc(L.title || 'Lesson')}</span>
        <span class="folder-apps">${apps}</span></a>`;
    }).join('') : '';
    return `<header class="bar cab-bar"><a class="back" href="#/">◀ All classes</a><h1>Filing Cabinet</h1></header>
      <main class="cabinet"><nav class="drawer-tabs" aria-label="Classes">${tabs}</nav>
        <div class="drawer"${c ? ` style="${C.colorVars(c.color)}"` : ''}>
          ${folders || `<p class="empty">${c ? 'This drawer is empty for now.' : 'No classes yet.'}</p>`}</div></main>`;
  }

  function oldLessonHtml(c, L) {
    const base = `#/f/${encodeURIComponent(c.id)}/${encodeURIComponent(L.id)}`;
    return `<header class="bar" style="${C.colorVars(c.color)}"><a class="back" href="#/f/${encodeURIComponent(c.id)}">◀ Filing Cabinet</a><h1>${esc(c.name)}</h1></header>
      <main class="lesson" style="${C.colorVars(c.color)}">
        <p class="from-cabinet">From the Filing Cabinet</p>
        <div class="lesson-head"><h2>${esc(L.title || 'Lesson')}</h2><span class="lesson-date">${esc(C.niceDate(L.date, true))}</span></div>
        ${L.note ? `<p class="lesson-note">${esc(L.note)}</p>` : ''}
        ${itemsHtml(L.items, base) || '<p class="empty">This folder is empty.</p>'}</main>`;
  }

  // One thing, open inside the Classroom. The frame is kept when the screen is drawn again for the same thing.
  // sendable: the lesson lets students send work back → "Send to the Teacher" at the top right.
  // (The ↗ "open in its own tab" button was taken out 2026-11-23, the user's ask: students stay in the Classroom.)
  function showPlayer(c, it, backHref, backLabel, sendable) {
    const link = C.parseLink(it.url);
    const app = link.ok ? link.app : { name: 'Link', emoji: '🔗', icon: null };
    const key = backHref + '|' + it.id + '|' + it.url + '|' + !!sendable;
    if (key === openFrameKey && root.querySelector('.player')) return;
    openFrameKey = key;
    const title = esc(it.title || app.name);
    const bar = `<div class="player-bar" style="${C.colorVars(c.color)}"><a class="back" href="${backHref}">◀ ${esc(backLabel)}</a>
      <span class="player-title"><span class="player-icon">${C.iconHtml(app)}</span>${title}</span>
      ${sendable && link.ok && link.framePath ? '<button class="send-btn" type="button">📬 <span class="send-word">Send to the Teacher</span><span class="send-short">Send</span></button>' : ''}</div>`;
    if (link.ok && link.framePath) {
      root.innerHTML = `<div class="player">${bar}
        ${it.note ? `<div class="player-note">${esc(it.note)}</div>` : ''}
        <iframe class="player-frame" title="${title}" src="${esc(link.framePath)}"
          allow="autoplay; fullscreen; microphone; camera; midi; clipboard-read; clipboard-write"></iframe></div>`;
      const frame = root.querySelector('.player-frame');
      frame.addEventListener('load', () => { try { frame.contentWindow.focus(); } catch (e) { /* fine */ } });
      const sendBtn = root.querySelector('.send-btn');
      if (sendBtn) sendBtn.addEventListener('click', () => openSendDialog(c, it, frame));
    } else {
      root.innerHTML = `<div class="player">${bar}<main class="lesson"><div class="empty-card">
        ${link.ok ? `<b>This one opens in its own tab.</b><br><a class="big-btn" href="${esc(link.url)}" target="_blank" rel="noopener">Open ${title}</a>`
                  : '<b>This link doesn\'t work.</b><br>Tell Mr. Walby.'}</div></main></div>`;
    }
    document.title = (it.title || app.name) + ' · The Classroom';
  }

  /* ---------- Send to the Teacher, from the app bar ----------
     In Song Writer the student's song goes with it: a #work= link (Song Writer's own "returned work" link — it reads
     it and asks the teacher "open as they had it" or "add to my library as Song — Name"), built here from the
     Song Writer in the frame (same site, so the Classroom can read it). Any other app sends a check-in ("did it"). */
  function songWriterIn(frame) {
    try { const w = frame.contentWindow; return w && w.SW && w.SW.library && w.SW.score && w.SW.settings ? w : null; } catch (e) { return null; }
  }
  async function songWriterWorkLink(w, name) {
    const SW = w.SW, L = SW.library, clone = o => JSON.parse(JSON.stringify(o));
    const id = L.currentId();
    const rec = L.normalizeSong(clone(L.getStoredLibrary()[id] || { title: L.currentTitle() }), id);
    rec.score = SW.score.read();                       // what is on the page now, saved or not
    rec.title = L.currentTitle() || rec.title;
    rec.updatedAt = Date.now();
    ['received', 'receivedAt', 'derivedFrom', 'book', 'layout'].forEach(k => { delete rec[k]; });
    // the student version's rules, as Song Writer's own Save my work writes them (lessons.js policyForLink);
    // a plain song has none: {} opens with every tool, as the student had it
    let policy = {};
    const p = SW.lessons && SW.lessons.policy && SW.lessons.policy();
    if (p) {
      policy = clone(p);
      policy.task.melodyLocked = !!(p.task.pitchLocked || p.task.rhythmLocked);
      if (policy.kind !== 'student-version') { delete policy.kind; delete policy.save; delete policy.student; delete policy.look; }
      else if (policy.shell && policy.shell.lookPage) delete policy.look;
    }
    const meta = SW.lessons && SW.lessons.meta && SW.lessons.meta();
    const payload = {
      v: 1, kind: 'student-work', title: rec.title,
      version: { id: (meta && meta.id) || '', title: (meta && meta.title) || '' },
      student: { name },
      policy,
      layout: SW.settings.layoutSnapshot(),
      song: rec,
      savedAt: new Date().toISOString(),
    };
    return { link: await L.shortLinkFor(payload, 'work'), title: rec.title };
  }

  function openSendDialog(c, it, frame) {
    const sw = songWriterIn(frame);
    let songTitle = '';
    try { songTitle = sw ? sw.SW.library.currentTitle() : ''; } catch (e) { /* fine */ }
    const thing = it.title || (C.parseLink(it.url).ok ? C.parseLink(it.url).app.name : 'this');
    const old = document.querySelector('dialog.send-dialog');
    if (old) old.remove();
    const dlg = document.createElement('dialog');
    dlg.className = 't-dialog send-dialog';
    dlg.style.cssText = C.colorVars(c.color);
    dlg.innerHTML = `<form novalidate>
      <h2>📬 Send to the Teacher</h2>
      <p class="send-what">${sw ? `🎼 Your song <b>“${esc(songTitle || thing)}”</b> goes with it, so your teacher can open your work.`
                               : `✅ Your teacher will see that you did <b>“${esc(thing)}”</b>.`}</p>
      <label>Your first name<input class="field" name="name" maxlength="40" autocomplete="given-name" value="${esc(savedName())}"></label>
      <label>Anything to add? <span class="optional">(you don't have to)</span><textarea class="field" name="message" rows="2" maxlength="2000"></textarea></label>
      <p class="send-msg" role="status"></p>
      <div class="row"><button class="btn" type="button" data-cancel>Cancel</button><button class="btn primary" type="submit">📬 Send</button></div>
    </form>`;
    document.body.appendChild(dlg);
    const form = dlg.querySelector('form'), msg = dlg.querySelector('.send-msg'), btn = form.querySelector('[type=submit]');
    const close = () => { dlg.close(); dlg.remove(); try { frame.contentWindow.focus(); } catch (e) { /* fine */ } };
    dlg.querySelector('[data-cancel]').addEventListener('click', close);
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.showModal();
    (form.name.value ? form.message : form.name).focus();
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = form.name.value.trim(), message = form.message.value.trim();
      msg.className = 'send-msg';
      if (!name) { msg.textContent = 'Type your first name.'; form.name.focus(); return; }
      try { localStorage.setItem(C.NAME_KEY, name); } catch (err) { /* fine */ }
      btn.disabled = true; btn.textContent = 'Sending…'; msg.textContent = '';
      const body = { classId: c.id, className: c.name, lesson: c.lesson.title || C.niceDate(c.lesson.date), item: thing, name, message, kind: 'done', link: '' };
      if (sw) {
        try {
          const work = await songWriterWorkLink(sw, name);
          body.kind = 'work'; body.link = work.link; body.item = work.title || thing;
        } catch (err) {
          btn.disabled = false; btn.textContent = '📬 Try again';
          msg.className = 'send-msg bad'; msg.textContent = 'Your song couldn\'t be packed up. Try again, or tell your teacher.';
          return;
        }
      }
      const r = await C.mailbox('/send', { method: 'POST', body });
      if (r.ok) {
        form.innerHTML = `<h2>Sent! ✓</h2><p>Your teacher got it, ${esc(name)}.${sw ? ' You can keep working: send again any time.' : ''}</p>
          <div class="row"><button class="btn primary" type="button" data-cancel>OK</button></div>`;
        form.querySelector('[data-cancel]').addEventListener('click', close);
        form.querySelector('[data-cancel]').focus();
        return;
      }
      btn.disabled = false; btn.textContent = '📬 Try again';
      msg.className = 'send-msg bad';
      msg.textContent = r.blocked
        ? 'Couldn\'t reach the mailbox. The school network may be blocking it. Tell your teacher: "the mailbox didn\'t work."'
        : (r.body.error || 'The mailbox had a problem. Try again.');
    });
  }

  /* ---------- Send to the Teacher (the card on the lesson page) ---------- */
  function savedName() { try { return localStorage.getItem(C.NAME_KEY) || ''; } catch (e) { return ''; } }
  function showSend(c) {
    openFrameKey = '';
    const back = `#/c/${encodeURIComponent(c.id)}`;
    root.innerHTML = `<header class="bar" style="${C.colorVars(c.color)}"><a class="back" href="${back}">◀ ${esc(c.name)}</a><h1>📬 Send to the Teacher</h1></header>
      <main class="lesson send" style="${C.colorVars(c.color)}">
        <form class="send-form" novalidate>
          <label>Your first name<input class="field" name="name" maxlength="40" autocomplete="given-name" value="${esc(savedName())}"></label>
          <label>Your message<textarea class="field" name="message" rows="4" maxlength="2000" placeholder="What did you make? What do you want your teacher to know?"></textarea></label>
          <label>Link to your work <span class="optional">(if you have one)</span>
            <input class="field" name="link" maxlength="30000" placeholder="Paste it here, e.g. from Song Writer: Save my work → Copy" autocomplete="off"></label>
          <button class="big-btn" type="submit">📬 Send</button>
          <p class="send-msg" role="status"></p>
        </form></main>`;
    document.title = 'Send to the Teacher · The Classroom';
    window.scrollTo(0, 0);
    const form = root.querySelector('.send-form'), msg = form.querySelector('.send-msg'), btn = form.querySelector('button');
    form.name.focus();
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = form.name.value.trim(), message = form.message.value.trim(), link = form.link.value.trim();
      msg.className = 'send-msg';
      if (!name) { msg.textContent = 'Type your first name.'; form.name.focus(); return; }
      if (!message && !link) { msg.textContent = 'Write a message or paste a link.'; form.message.focus(); return; }
      if (link && !/^https?:\/\//i.test(link)) { msg.textContent = 'That link should start with https://'; form.link.focus(); return; }
      try { localStorage.setItem(C.NAME_KEY, name); } catch (err) { /* fine */ }
      btn.disabled = true; btn.textContent = 'Sending…'; msg.textContent = '';
      const r = await C.mailbox('/send', { method: 'POST', body: { classId: c.id, className: c.name, lesson: c.lesson.title || C.niceDate(c.lesson.date), name, message, link } });
      if (r.ok) {
        form.outerHTML = `<div class="empty-card sent"><b>Sent! ✓</b><br>Your teacher got your message, ${esc(name)}.<br>
          <a class="big-btn" href="${back}">Back to ${esc(c.name)}</a> <a class="big-btn ghost" href="${back}/~send" data-again>Send another</a></div>`;
        const again = root.querySelector('[data-again]');
        if (again) again.addEventListener('click', ev => { ev.preventDefault(); showSend(c); });
        return;
      }
      btn.disabled = false; btn.textContent = '📬 Try again';
      msg.className = 'send-msg bad';
      msg.textContent = r.blocked
        ? 'Couldn\'t reach the mailbox. The school network may be blocking it. Tell your teacher: "the mailbox didn\'t work."'
        : (r.body.error || 'The mailbox had a problem. Try again.');
    });
  }

  /* ---------- drawing the screen for the address ---------- */
  function render() {
    const p = parts();
    const preview = PREVIEW ? '<div class="preview-ribbon">Preview of your unpublished changes</div>' : '';
    if (p[0] === 'c' && p[1]) {
      const c = findClass(p[1]);
      if (c) {
        setLastClass(c.id);
        if (p[2] === '~send' && canSend(c.lesson)) {
          if (!root.querySelector('.send-form, .sent')) showSend(c);   // a refresh of the data mustn't wipe what they're typing
          return;
        }
        const it = p[2] && c.lesson.items.find(x => x.id === p[2]);
        if (it) { showPlayer(c, it, `#/c/${encodeURIComponent(c.id)}`, c.name, canSend(c.lesson)); return; }
        draw(preview + classHtml(c), c.name);
        return;
      }
    }
    if (p[0] === 'f') {
      const c = findClass(p[1]) || findClass(lastClass()) || data.classes[0];
      if (c && p[1] === c.id && p[2]) {
        const L = c.cabinet.find(x => x.id === p[2]);
        if (L) {
          const it = p[3] && L.items.find(x => x.id === p[3]);
          if (it) { showPlayer(c, it, `#/f/${encodeURIComponent(c.id)}/${encodeURIComponent(L.id)}`, L.title || 'Filing Cabinet'); return; }
          draw(preview + oldLessonHtml(c, L), 'Filing Cabinet');
          return;
        }
      }
      draw(preview + cabinetHtml(c), 'Filing Cabinet');
      return;
    }
    draw(preview + homeHtml(), '');
  }
  function draw(html, title) {
    openFrameKey = '';
    root.innerHTML = html;
    document.title = (title ? title + ' · ' : '') + 'The Classroom';
    window.scrollTo(0, 0);
  }

  /* ---------- loading, and checking for Mr. Walby's changes ---------- */
  async function load() {
    if (PREVIEW) {
      const d = C.readDraft();
      if (d) return d.data;
    }
    return C.loadPublished();
  }
  async function refresh(first) {
    try {
      const fresh = await load();
      const json = JSON.stringify(fresh.classes);
      if (json === shownJson) return;
      data = fresh; shownJson = json;
      render();
    } catch (e) {
      if (first) root.innerHTML = `<header class="top"><div class="brand">🦅 Eagle View Music</div><h1>The Classroom</h1></header>
        <main class="home"><div class="empty-card"><b>The Classroom can't load right now.</b><br>Check the internet, then <a href="">try again</a>.</div></main>`;
    }
  }

  window.addEventListener('hashchange', () => { if (data) render(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refresh(); });
  setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, 60000);
  if (PREVIEW) window.addEventListener('storage', e => { if (e.key === C.DRAFT_KEY) refresh(); });
  refresh(true);
})();

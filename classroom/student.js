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

  function classHtml(c) {
    const L = c.lesson, base = `#/c/${encodeURIComponent(c.id)}`;
    const body = L.items.length
      ? `<div class="lesson-head"><h2>${esc(L.title || 'Today\'s lesson')}</h2><span class="lesson-date">${esc(C.niceDate(L.date, true))}</span></div>
         ${L.note ? `<p class="lesson-note">${esc(L.note)}</p>` : ''}${itemsHtml(L.items, base)}`
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
  function showPlayer(c, it, backHref, backLabel) {
    const link = C.parseLink(it.url);
    const app = link.ok ? link.app : { name: 'Link', emoji: '🔗', icon: null };
    const key = backHref + '|' + it.id + '|' + it.url;
    if (key === openFrameKey && root.querySelector('.player')) return;
    openFrameKey = key;
    const title = esc(it.title || app.name);
    const bar = `<div class="player-bar" style="${C.colorVars(c.color)}"><a class="back" href="${backHref}">◀ ${esc(backLabel)}</a>
      <span class="player-title"><span class="player-icon">${C.iconHtml(app)}</span>${title}</span>
      ${link.ok ? `<a class="own-tab" href="${esc(link.url)}" target="_blank" rel="noopener" title="Open in its own tab">↗</a>` : ''}</div>`;
    if (link.ok && link.framePath) {
      root.innerHTML = `<div class="player">${bar}
        ${it.note ? `<div class="player-note">${esc(it.note)}</div>` : ''}
        <iframe class="player-frame" title="${title}" src="${esc(link.framePath)}"
          allow="autoplay; fullscreen; microphone; camera; midi; clipboard-read; clipboard-write"></iframe></div>`;
      const frame = root.querySelector('.player-frame');
      frame.addEventListener('load', () => { try { frame.contentWindow.focus(); } catch (e) { /* fine */ } });
    } else {
      root.innerHTML = `<div class="player">${bar}<main class="lesson"><div class="empty-card">
        ${link.ok ? `<b>This one opens in its own tab.</b><br><a class="big-btn" href="${esc(link.url)}" target="_blank" rel="noopener">Open ${title}</a>`
                  : '<b>This link doesn\'t work.</b><br>Tell Mr. Walby.'}</div></main></div>`;
    }
    document.title = (it.title || app.name) + ' · The Classroom';
  }

  /* ---------- drawing the screen for the address ---------- */
  function render() {
    const p = parts();
    const preview = PREVIEW ? '<div class="preview-ribbon">Preview of your unpublished changes</div>' : '';
    if (p[0] === 'c' && p[1]) {
      const c = findClass(p[1]);
      if (c) {
        setLastClass(c.id);
        const it = p[2] && c.lesson.items.find(x => x.id === p[2]);
        if (it) { showPlayer(c, it, `#/c/${encodeURIComponent(c.id)}`, c.name); return; }
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

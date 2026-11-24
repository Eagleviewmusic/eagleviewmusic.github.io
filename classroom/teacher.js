/* The Classroom, teacher side.
   Works on a DRAFT kept in this browser (localStorage, Classroom.DRAFT_KEY), started from the site's lessons.json.
   "Save file to publish" downloads a new lessons.json; once that file is on the site, students see it.
   Nothing here changes what students see until that file is published. */
(function () {
  'use strict';
  const C = window.Classroom, esc = C.esc;
  const SAVED_KEY = 'classroom_saved_file_v1';   // { at, json }: the last file saved here, until the site matches it
  const $ = sel => document.querySelector(sel);
  const main = $('#classes'), statusEl = $('#status'), noticeEl = $('#notice');

  let pub = null;          // the site's lessons.json (null = could not read it)
  let draft = null;        // { data, basedOn }
  let saved = null;        // see SAVED_KEY
  let keptMine = null;     // the site version the teacher chose to ignore (newer-on-site notice)

  const persist = () => { if (!C.writeDraft(draft)) toastNotice('This browser would not save the draft (storage is full or blocked).', true); refreshStatus(); };
  const cls = i => draft.data.classes[i];
  const byDate = (a, b) => (b.date || '').localeCompare(a.date || '');
  const clone = o => JSON.parse(JSON.stringify(o));
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

  /* ---------- drawing ---------- */
  function itemRow(it, ci, ii, count) {
    const link = C.parseLink(it.url);
    const app = link.ok ? link.app : { name: 'Link', emoji: '🔗', icon: null };
    let warn = '';
    if (!link.ok) warn = '<span class="warn">⚠ This is not a working link</span>';
    else if (link.local) warn = '<span class="warn">⚠ Link to a copy on this computer: students can\'t open it</span>';
    else if (!link.onSite) warn = '<span class="warn">Opens in a new tab, outside the Classroom</span>';
    return `<li class="t-item" data-item-id="${esc(it.id)}">
      <span class="item-icon">${C.iconHtml(app)}</span>
      <div class="t-item-main">
        <input class="field t-item-title" data-act="itemTitle" data-c="${ci}" data-i="${ii}" value="${esc(it.title)}" placeholder="${esc(app.name)} (title students see)" aria-label="Title students see">
        <div class="t-item-meta"><span>${esc(app.name)}</span>${link.ok ? `<a href="${esc(link.url)}" target="_blank" rel="noopener">try the link ↗</a>` : ''}${warn}</div>
        <input class="field" data-act="itemNote" data-c="${ci}" data-i="${ii}" value="${esc(it.note)}" placeholder="Note for students (optional), e.g. Play it 3 times" aria-label="Note for students">
      </div>
      <div class="t-item-btns">
        <button class="icon-btn" data-act="itemUp" data-c="${ci}" data-i="${ii}" title="Move up" ${ii === 0 ? 'disabled' : ''}>↑</button>
        <button class="icon-btn" data-act="itemDown" data-c="${ci}" data-i="${ii}" title="Move down" ${ii === count - 1 ? 'disabled' : ''}>↓</button>
        <button class="icon-btn danger" data-act="itemDelete" data-c="${ci}" data-i="${ii}" title="Remove">✕</button>
      </div></li>`;
  }

  function folderRow(L, ci, fi) {
    const items = L.items.map((it, k) => {
      const link = C.parseLink(it.url), app = link.ok ? link.app : { emoji: '🔗', name: 'Link' };
      return `<li><span>${app.emoji}</span><span class="t-fi-title">${esc(it.title || app.name)}</span>
        ${link.ok ? `<a href="${esc(link.url)}" target="_blank" rel="noopener">try ↗</a>` : ''}
        <button class="icon-btn danger" data-act="folderItemDelete" data-c="${ci}" data-f="${fi}" data-i="${k}" title="Remove from this folder">✕</button></li>`;
    }).join('');
    return `<div class="t-folder">
      <div class="t-folder-row">
        <input type="date" value="${esc(L.date)}" data-act="folderDate" data-c="${ci}" data-f="${fi}" aria-label="Date">
        <input class="field" value="${esc(L.title)}" data-act="folderTitle" data-c="${ci}" data-f="${fi}" placeholder="Lesson name" aria-label="Lesson name">
        <span class="t-folder-count">${plural(L.items.length, 'thing', 'things')}</span>
        <button class="btn small" data-act="folderUse" data-c="${ci}" data-f="${fi}" title="Copy these into today's lesson">Use again</button>
        <button class="icon-btn danger" data-act="folderDelete" data-c="${ci}" data-f="${fi}" title="Throw away this folder">🗑</button>
      </div>
      ${items ? `<ul class="t-folder-items">${items}</ul>` : ''}</div>`;
  }

  function classPanel(c, ci, n) {
    const L = c.lesson;
    const dots = C.COLORS.map(k => `<button class="dot${k.id === c.color ? ' on' : ''}" style="background:${k.main}" data-act="classColor" data-c="${ci}" data-color="${k.id}" title="${k.id}" aria-label="Colour ${k.id}"></button>`).join('');
    return `<section class="t-class" style="${C.colorVars(c.color)}">
      <div class="t-class-head">
        <input class="t-class-name" value="${esc(c.name)}" data-act="className" data-c="${ci}" aria-label="Class name">
        <div class="dots">${dots}</div>
        <button class="icon-btn" data-act="classUp" data-c="${ci}" title="Move class up" ${ci === 0 ? 'disabled' : ''}>↑</button>
        <button class="icon-btn" data-act="classDown" data-c="${ci}" title="Move class down" ${ci === n - 1 ? 'disabled' : ''}>↓</button>
        <button class="icon-btn danger" data-act="classDelete" data-c="${ci}" title="Remove this class">🗑</button>
      </div>
      <div class="t-section">
        <div class="t-label">Today's lesson <input type="date" value="${esc(L.date)}" data-act="lessonDate" data-c="${ci}" aria-label="Lesson date"></div>
        <div class="t-fields">
          <input class="field" value="${esc(L.title)}" data-act="lessonTitle" data-c="${ci}" placeholder="Lesson name (optional), e.g. Hot Cross Buns" aria-label="Lesson name">
          <textarea class="field" rows="1" data-act="lessonNote" data-c="${ci}" placeholder="Directions for students (optional)" aria-label="Directions for students">${esc(L.note)}</textarea>
        </div>
        ${L.items.length ? `<ol class="t-items">${L.items.map((it, ii) => itemRow(it, ci, ii, L.items.length)).join('')}</ol>` : ''}
        <form class="t-add" data-act="addItem" data-c="${ci}">
          <input class="field" name="link" placeholder="Paste a link from any Eagle View Music app" aria-label="Paste a link" autocomplete="off">
          <button class="btn primary" type="submit">Add</button>
        </form>
        <div class="t-add-msg" data-msg="${ci}"></div>
        <div class="t-lesson-foot">
          <button class="btn" data-act="toCabinet" data-c="${ci}" ${L.items.length || L.title ? '' : 'disabled'}>🗄️ Lesson done: move it to the Filing Cabinet</button>
        </div>
      </div>
      <details class="t-cab"${c.cabinet.length && c.cabinet.length <= 3 ? ' open' : ''}>
        <summary>🗄️ Filing Cabinet · ${plural(c.cabinet.length, 'older lesson', 'older lessons')}</summary>
        <div class="t-cab-list">${c.cabinet.map((F, fi) => folderRow(F, ci, fi)).join('') || '<p class="empty">Empty. Finished lessons land here.</p>'}</div>
      </details>
    </section>`;
  }

  function render() {
    const open = [...main.querySelectorAll('details.t-cab')].map(d => d.open);
    const n = draft.data.classes.length;
    main.innerHTML = draft.data.classes.map((c, ci) => classPanel(c, ci, n)).join('')
      + '<button class="btn add-class" data-act="addClass">+ Add a class</button>';
    // keep Filing Cabinets the teacher opened or closed as they were
    main.querySelectorAll('details.t-cab').forEach((d, k) => { if (k < open.length) d.open = open[k]; });
    refreshStatus();
  }

  /* ---------- the status chip and notices ---------- */
  function refreshStatus() {
    if (!draft) return;
    const mine = JSON.stringify(draft.data.classes);
    if (pub && C.sameContent(draft.data, pub)) {
      statusEl.className = 'status same'; statusEl.textContent = '✓ Same as the site';
      if (saved) { saved = null; try { localStorage.removeItem(SAVED_KEY); } catch (e) { /* fine */ } }
    } else if (saved && saved.json === mine) {
      statusEl.className = 'status waiting';
      statusEl.textContent = saved.how === 'publish' ? 'Published · on the site in about a minute' : 'File saved · waiting to go on the site';
    } else if (!pub) {
      statusEl.className = 'status'; statusEl.textContent = 'Can\'t read the site\'s file';
    } else {
      statusEl.className = 'status changed'; statusEl.textContent = '● Changes not on the site yet';
    }
    // the site has a newer file than the one this draft started from (saved from another computer?)
    const newer = pub && pub.published && (!draft.basedOn || pub.published > draft.basedOn) && !C.sameContent(draft.data, pub)
      && keptMine !== pub.published && !(saved && saved.at === pub.published);
    if (newer) {
      noticeEl.innerHTML = `<div class="notice"><p><b>The site has a newer version</b> (saved ${esc(new Date(pub.published).toLocaleString())}) than the one this draft started from.</p>
        <button class="btn small primary" data-act="useSite">Use the site's version</button><button class="btn small" data-act="keepMine">Keep my draft</button></div>`;
    } else if (noticeEl.dataset.toast !== '1') noticeEl.innerHTML = '';
  }
  function toastNotice(text, isWarn) {
    noticeEl.dataset.toast = '1';
    noticeEl.innerHTML = `<div class="notice${isWarn ? '' : ' info'}"><p>${esc(text)}</p><button class="btn small" data-act="closeNotice">OK</button></div>`;
  }

  /* ---------- changes ---------- */
  function addLink(ci, text, form) {
    const msg = main.querySelector(`[data-msg="${ci}"]`);
    const link = C.parseLink(text);
    if (!link.ok) { msg.textContent = link.problem === 'empty' ? 'Paste a link first.' : 'That doesn\'t look like a link. Copy the whole address (it starts with https://).'; return; }
    if (link.local) { msg.textContent = 'That link is to a copy on this computer, so students can\'t open it. Use the link from eagleviewmusic.com.'; return; }
    const it = { id: C.uid(), title: '', url: link.url, note: '' };
    cls(ci).lesson.items.push(it);
    persist(); render();
    const box = main.querySelector(`form[data-c="${ci}"] input`);
    if (box) box.focus();
    C.guessTitle(link.url).then(title => {
      if (!title || it.title) return;
      it.title = title; persist();
      const input = main.querySelector(`[data-item-id="${it.id}"] .t-item-title`);
      if (input && !input.value) input.value = title;
    });
    if (!link.onSite) {
      const m = main.querySelector(`[data-msg="${ci}"]`);
      if (m) m.textContent = 'Added. Links outside eagleviewmusic.com open in a new tab, and school computers may block them.';
    }
  }

  function swap(list, a, b) { if (b < 0 || b >= list.length) return; [list[a], list[b]] = [list[b], list[a]]; }

  function act(el, ev) {
    const a = el.dataset.act, ci = +el.dataset.c, ii = +el.dataset.i, fi = +el.dataset.f;
    const c = Number.isFinite(ci) ? cls(ci) : null;
    switch (a) {
      case 'className': c.name = el.value; persist(); return;
      case 'lessonTitle': c.lesson.title = el.value; persist(); refreshToCabinetButton(ci); return;
      case 'lessonNote': c.lesson.note = el.value; persist(); return;
      case 'lessonDate': if (el.value) { c.lesson.date = el.value; persist(); } return;
      case 'itemTitle': c.lesson.items[ii].title = el.value; persist(); return;
      case 'itemNote': c.lesson.items[ii].note = el.value; persist(); return;
      case 'folderTitle': c.cabinet[fi].title = el.value; persist(); return;
      case 'folderDate': if (el.value) { c.cabinet[fi].date = el.value; c.cabinet.sort(byDate); persist(); render(); } return;
      case 'classColor': c.color = el.dataset.color; break;
      case 'classUp': swap(draft.data.classes, ci, ci - 1); break;
      case 'classDown': swap(draft.data.classes, ci, ci + 1); break;
      case 'classDelete': {
        const things = c.lesson.items.length + c.cabinet.reduce((s, L) => s + L.items.length, 0);
        if (!confirm(`Remove "${c.name}"${things ? ` and its ${plural(things, 'link', 'links')} (today's lesson and Filing Cabinet)` : ''}? Students won't see it after you publish.`)) return;
        draft.data.classes.splice(ci, 1); break;
      }
      case 'addClass': {
        const used = draft.data.classes.map(k => k.color);
        const color = (C.COLORS.find(k => !used.includes(k.id)) || C.COLORS[draft.data.classes.length % C.COLORS.length]).id;
        draft.data.classes.push(C.newClass('New class', color));
        persist(); render();
        const names = main.querySelectorAll('.t-class-name');
        const last = names[names.length - 1];
        if (last) { last.focus(); last.select(); }
        return;
      }
      case 'itemUp': swap(c.lesson.items, ii, ii - 1); break;
      case 'itemDown': swap(c.lesson.items, ii, ii + 1); break;
      case 'itemDelete': {
        const it = c.lesson.items[ii];
        if (!confirm(`Remove "${it.title || 'this link'}" from today's lesson?`)) return;
        c.lesson.items.splice(ii, 1); break;
      }
      case 'toCabinet': {
        const L = c.lesson;
        if (!confirm(`Move "${L.title || 'today\'s lesson'}" to ${c.name}'s Filing Cabinet?\n\nThe ${c.name} box will be empty until you add the next lesson. Students can still find this one in the Filing Cabinet.`)) return;
        c.cabinet.unshift(L); c.cabinet.sort(byDate);
        c.lesson = C.newLesson();
        break;
      }
      case 'folderUse': {
        const F = c.cabinet[fi], L = c.lesson;
        const wasEmpty = !L.items.length && !L.title && !L.note;
        L.items.push(...F.items.map(it => Object.assign(clone(it), { id: C.uid() })));
        if (wasEmpty) { L.title = F.title; L.note = F.note; }
        break;
      }
      case 'folderDelete': {
        const F = c.cabinet[fi];
        if (!confirm(`Throw away "${F.title || 'this lesson'}" (${C.niceDate(F.date)}) from the Filing Cabinet? Students won't find it there after you publish.`)) return;
        c.cabinet.splice(fi, 1); break;
      }
      case 'folderItemDelete': {
        const F = c.cabinet[fi];
        if (!confirm(`Remove "${F.items[ii].title || 'this link'}" from this folder?`)) return;
        F.items.splice(ii, 1); break;
      }
      case 'useSite':
        if (!confirm('Replace your draft with the version on the site? Changes you haven\'t published will be lost.')) return;
        draft = { data: clone(pub), basedOn: pub.published }; break;
      case 'keepMine': keptMine = pub && pub.published; refreshStatus(); return;
      case 'closeNotice': noticeEl.dataset.toast = ''; noticeEl.innerHTML = ''; refreshStatus(); return;
      default: return;
    }
    persist(); render();
  }
  function refreshToCabinetButton(ci) {
    const b = main.querySelector(`[data-act="toCabinet"][data-c="${ci}"]`);
    if (b) b.disabled = !(cls(ci).lesson.items.length || cls(ci).lesson.title);
  }

  main.addEventListener('input', e => { const el = e.target.closest('[data-act]'); if (el && /^(INPUT|TEXTAREA)$/.test(el.tagName) && el.type !== 'date') act(el, e); });
  main.addEventListener('change', e => { const el = e.target.closest('[data-act]'); if (el && el.type === 'date') act(el, e); });
  document.addEventListener('click', e => {
    const el = e.target.closest('button[data-act]');
    if (el && !el.disabled) { e.preventDefault(); act(el, e); }
  });
  main.addEventListener('submit', e => {
    const form = e.target.closest('form[data-act="addItem"]');
    if (!form) return;
    e.preventDefault();
    addLink(+form.dataset.c, form.link.value, form);
  });
  main.addEventListener('paste', e => {   // paste a link into the box = add it right away
    const box = e.target.closest('form[data-act="addItem"] input');
    if (!box || box.value.trim()) return;
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (!text || !C.parseLink(text).ok) return;
    e.preventDefault();
    addLink(+box.form.dataset.c, text, box.form);
  });

  /* ---------- publishing ---------- */
  const GH = window.ClassroomGitHub;
  function fileFromDraft() {
    const out = clone(draft.data);
    out.published = new Date().toISOString();
    return out;
  }
  function remember(out, how) {   // the draft now matches what was sent; the chip waits for the site to match
    draft.basedOn = out.published;
    saved = { at: out.published, json: JSON.stringify(out.classes), how };
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); } catch (e) { /* fine */ }
    persist();
  }

  // Publish: one commit of classroom/lessons.json with the Librarian's GitHub key.
  async function publish() {
    if (!GH.connected()) { openGitHub('Connect once, and Publish puts your changes on the site in one click.'); return; }
    const btn = $('#publish');
    btn.disabled = true; btn.textContent = 'Publishing…';
    try {
      for (let attempt = 0; ; attempt++) {
        const site = await GH.read();
        const siteData = site.data ? C.clean(site.data) : null;
        if (attempt === 0 && siteData && C.sameContent(siteData, draft.data)) {
          draft.basedOn = siteData.published || draft.basedOn; persist();
          toastNotice('Nothing new to publish: the site already has these lessons.');
          return;
        }
        if (attempt === 0 && siteData && siteData.published && (!draft.basedOn || siteData.published > draft.basedOn)
            && !confirm(`The site has a newer version (published ${new Date(siteData.published).toLocaleString()}) than the one your draft started from, maybe from another computer.\n\nPublish your draft over it?`)) return;
        const out = fileFromDraft();
        try {
          await GH.write(JSON.stringify(out, null, 1) + '\n', site.sha, 'Classroom: lessons published from the teacher page');
        } catch (err) {
          if ((err.status === 409 || err.status === 422) && attempt === 0) continue;   // the file changed in between: read it again, once
          throw err;
        }
        remember(out, 'publish');
        toastNotice('Published! Students will see the changes in about a minute.');
        recheckSoon();
        return;
      }
    } catch (err) {
      toastNotice('Not published. ' + err.message + ' (You can still Save a file and upload it.)', true);
      if (err.status === 401) { GH.disconnect(); refreshGitHub(); }
    } finally {
      btn.disabled = false; btn.textContent = '🚀 Publish';
    }
  }
  $('#publish').addEventListener('click', publish);

  // Save a file: the same lessons.json, downloaded (a backup, or to upload on GitHub by hand).
  $('#save-file').addEventListener('click', () => {
    const out = fileFromDraft();
    const blob = new Blob([JSON.stringify(out, null, 1) + '\n'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'lessons.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10000);
    remember(out, 'file');
    $('#saved-dialog').showModal();
  });
  $('#saved-ok').addEventListener('click', () => $('#saved-dialog').close());

  /* ---------- the GitHub connection ---------- */
  const ghDialog = $('#gh-dialog');
  function refreshGitHub() {
    const on = GH.connected();
    $('#connect').textContent = on ? '🔗 GitHub ✓' : '🔗 Connect to GitHub';
    $('#connect').title = on ? 'Connected as ' + GH.login() : 'Connect once so Publish can put changes on the site';
    $('#gh-off-box').hidden = on; $('#gh-on-box').hidden = !on;
    $('#gh-login').textContent = GH.login();
  }
  function openGitHub(message) {
    refreshGitHub();
    $('#gh-msg').textContent = message || '';
    $('#gh-key').value = '';
    ghDialog.showModal();
    if (!GH.connected()) $('#gh-key').focus();
  }
  $('#connect').addEventListener('click', () => openGitHub());
  $('#gh-go').addEventListener('click', async () => {
    const go = $('#gh-go');
    go.disabled = true; $('#gh-msg').textContent = 'Checking the key…';
    try {
      const login = await GH.connect($('#gh-key').value);
      $('#gh-key').value = '';
      refreshGitHub();
      $('#gh-msg').textContent = '';
      toastNotice('Connected to GitHub as ' + login + '. Publish is ready.');
      ghDialog.close();
    } catch (err) { $('#gh-msg').textContent = err.message; }
    finally { go.disabled = false; }
  });
  $('#gh-key').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#gh-go').click(); } });
  $('#gh-disconnect').addEventListener('click', () => {
    if (!confirm('Disconnect from GitHub? This removes the key from this browser, for the Librarian too.')) return;
    GH.disconnect(); refreshGitHub(); ghDialog.close();
  });
  ghDialog.addEventListener('click', e => { if (e.target.closest('[data-close-dialog]')) ghDialog.close(); });
  window.addEventListener('storage', e => { if (e.key === 'librarian_github_v1') refreshGitHub(); });
  refreshGitHub();

  // After publishing, look at the site every 10 s for 3 minutes, so the chip turns green soon after it's live.
  let soonTimer = null;
  function recheckSoon() {
    clearInterval(soonTimer);
    let n = 0;
    soonTimer = setInterval(async () => {
      await loadSite(); refreshStatus();
      if (++n >= 18 || (pub && C.sameContent(draft.data, pub))) clearInterval(soonTimer);
    }, 10000);
  }

  $('#open-file').addEventListener('click', () => $('#file-input').click());
  $('#file-input').addEventListener('change', async e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const data = C.clean(JSON.parse(await f.text()));
      if (!data.classes.length) throw new Error('no classes');
      if (!confirm(`Replace your draft with "${f.name}" (${plural(data.classes.length, 'class', 'classes')})?`)) return;
      draft = { data, basedOn: data.published };
      persist(); render();
    } catch (err) { toastNotice('That file isn\'t a Classroom file (lessons.json).', true); }
  });

  /* ---------- start ---------- */
  async function loadSite() {
    try { pub = await C.loadPublished(); } catch (e) { pub = null; }
  }
  (async function start() {
    try { saved = JSON.parse(localStorage.getItem(SAVED_KEY) || 'null'); } catch (e) { saved = null; }
    await loadSite();
    draft = C.readDraft();
    if (!draft) {
      draft = pub ? { data: clone(pub), basedOn: pub.published } : { data: C.emptyData(), basedOn: null };
      C.writeDraft(draft);
    } else if (pub && C.sameContent(draft.data, pub)) {
      draft.basedOn = pub.published; C.writeDraft(draft);
    }
    render();
    const recheck = async () => { await loadSite(); refreshStatus(); };
    setInterval(() => { if (document.visibilityState === 'visible') recheck(); }, 60000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') recheck(); });
  })();
})();

/* The Classroom Inbox: what students sent with "Send to Mr. Walby".
   Opens with the inbox password (a secret on the mailbox; set with `npx wrangler secret put INBOX_PASSWORD` in
   Claude Apps/classroom-mailbox). "Remember on this computer" keeps it in localStorage, otherwise only for this tab. */
(function () {
  'use strict';
  const C = window.Classroom, esc = C.esc, $ = s => document.querySelector(s);
  const PW_KEY = 'classroom_inbox_pw_v1';
  let pw = '', items = [], filter = 'all';

  const readPw = () => { try { return localStorage.getItem(PW_KEY) || sessionStorage.getItem(PW_KEY) || ''; } catch (e) { return ''; } };
  const forgetPw = () => { try { localStorage.removeItem(PW_KEY); sessionStorage.removeItem(PW_KEY); } catch (e) { /* fine */ } };
  const when = iso => {
    const d = new Date(iso);
    const today = new Date().toDateString() === d.toDateString();
    return (today ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }))
      + ' ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  function showLogin(message) {
    $('#login').hidden = false; $('#filters').hidden = true; $('#list').innerHTML = ''; $('#note').hidden = true;
    $('#refresh').hidden = true; $('#lock').hidden = true; $('#count').textContent = '';
    $('#login-msg').textContent = message || '';
    $('#login').pw.focus();
  }

  function render() {
    const classes = [...new Map(items.map(m => [m.classId || m.className, m.className || 'Class'])).entries()];
    $('#filters').hidden = classes.length < 2;
    $('#filters').innerHTML = [['all', 'All']].concat(classes).map(([id, name]) =>
      `<button class="drawer-tab${filter === id ? ' on' : ''}" data-filter="${esc(id)}" type="button">${esc(name)}</button>`).join('');
    const shown = items.filter(m => filter === 'all' || (m.classId || m.className) === filter);
    $('#count').className = 'status' + (items.length ? ' waiting' : '');
    $('#count').textContent = items.length === 1 ? '1 message' : items.length + ' messages';
    $('#list').innerHTML = shown.length ? shown.map(m => {
      const link = m.link ? C.parseLink(m.link) : null;
      return `<article class="msg" data-id="${esc(m.id)}">
        <div class="msg-head"><b class="msg-name">${esc(m.name)}</b>
          <span class="msg-class">${esc(m.className || '')}</span>
          <span class="msg-when">${esc(when(m.at))}</span>
          <button class="btn small danger" data-delete="${esc(m.id)}" type="button">🗑 Delete</button></div>
        ${m.lesson ? `<div class="msg-lesson">${esc(m.lesson)}</div>` : ''}
        ${m.message ? `<p class="msg-text">${esc(m.message)}</p>` : ''}
        ${link && link.ok ? `<a class="btn small primary" href="${esc(link.url)}" target="_blank" rel="noopener">Open their ${esc(link.app.name)} ↗</a>` : ''}
      </article>`;
    }).join('') : '<div class="empty-card"><b>No messages yet.</b><br>When students press Send, their work shows up here.</div>';
  }

  async function load(quiet) {
    if (!quiet) $('#list').innerHTML = '<p class="loading">Opening the Inbox…</p>';
    const r = await C.mailbox('/inbox', { password: pw });
    if (r.status === 401 || r.status === 429) { forgetPw(); pw = ''; showLogin(r.body.error || 'Wrong password.'); return; }
    if (!r.ok) {
      $('#list').innerHTML = `<div class="empty-card"><b>Couldn't reach the mailbox.</b><br>${r.blocked ? 'This network may block it, or it is offline.' : esc(r.body.error || 'Try again.')}</div>`;
      return;
    }
    $('#login').hidden = true; $('#refresh').hidden = false; $('#lock').hidden = false; $('#note').hidden = false;
    items = r.body.items || [];
    render();
  }

  $('#login').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    pw = f.pw.value;
    if (!pw) { $('#login-msg').textContent = 'Type the password.'; return; }
    try { (f.remember.checked ? localStorage : sessionStorage).setItem(PW_KEY, pw); } catch (err) { /* fine */ }
    f.pw.value = '';
    load();
  });
  $('#refresh').addEventListener('click', () => load());
  $('#lock').addEventListener('click', () => { forgetPw(); pw = ''; items = []; showLogin('Locked. The password is forgotten on this computer.'); });
  $('#filters').addEventListener('click', e => { const b = e.target.closest('[data-filter]'); if (b) { filter = b.dataset.filter; render(); } });
  $('#list').addEventListener('click', async e => {
    const b = e.target.closest('[data-delete]');
    if (!b) return;
    const m = items.find(x => x.id === b.dataset.delete);
    if (!m || !confirm(`Delete ${m.name}'s message? This can't be undone.`)) return;
    b.disabled = true;
    const r = await C.mailbox('/inbox/' + encodeURIComponent(m.id), { method: 'DELETE', password: pw });
    if (r.ok) { items = items.filter(x => x !== m); render(); }
    else { b.disabled = false; alert(r.body.error || 'Couldn\'t delete it. Try again.'); }
  });
  setInterval(() => { if (pw && document.visibilityState === 'visible') load(true); }, 30000);

  pw = readPw();
  if (pw) load(); else showLogin();
})();

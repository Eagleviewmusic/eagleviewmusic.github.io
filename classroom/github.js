/* The Classroom's connection to GitHub: Publish puts lessons.json straight on the site.

   It uses THE LIBRARIAN'S KEY: a fine-grained key with "Contents: Read and write" on the one site repo,
   kept in this browser's localStorage as `librarian_github_v1` ({ token, login }). Both apps live on
   eagleviewmusic.com, so they share that storage: connecting either one connects both, and
   disconnecting either one disconnects both.

   One publish = one commit of classroom/lessons.json (GitHub's Contents API). GitHub Pages then
   rebuilds the site, about a minute.

   window.ClassroomGitHub
     connected() -> bool          login() -> the GitHub account name
     connect(key) -> Promise<login>, checks the key can change the site
     disconnect()
     read()  -> Promise<{ sha, data }>  the site's lessons.json as GitHub has it (newer than the live site
                                         for the minute a rebuild takes)
     write(text, sha, message) -> Promise  (err.status 409/422 = the file changed since read()) */
(function () {
  'use strict';
  const OWNER = 'Eagleviewmusic', REPO = 'eagleviewmusic.github.io', BRANCH = 'main';
  const PATH = 'classroom/lessons.json';
  const KEY = 'librarian_github_v1';
  const API = 'https://api.github.com';
  const G = window.ClassroomGitHub = {};

  function conn() {
    try { const c = JSON.parse(localStorage.getItem(KEY) || 'null'); return c && c.token ? c : null; } catch (e) { return null; }
  }
  G.connected = () => !!conn();
  G.login = () => (conn() || {}).login || '';

  function explain(status, detail) {
    if (status === 401) return 'GitHub didn’t accept the key. It may have expired: make a new one and connect again.';
    if (status === 403) return 'The key can’t change this site. Check it has “Contents: Read and write” for eagleviewmusic.github.io.';
    if (status === 404) return 'The key can’t see the site’s repository. Check it was made for eagleviewmusic.github.io.';
    return 'GitHub said: ' + (detail || ('error ' + status));
  }

  async function api(path, opts, token) {
    const o = opts || {};
    const headers = { 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28',
      'Authorization': 'Bearer ' + (token || (conn() || {}).token) };
    if (o.body) headers['Content-Type'] = 'application/json';
    let res;
    try {
      res = await fetch(API + path, { method: o.method || 'GET', headers, body: o.body ? JSON.stringify(o.body) : undefined, cache: 'no-store' });
    } catch (e) {
      const err = new Error('Couldn’t reach GitHub. Check the internet (or the school network may block it), then try again.');
      err.status = 0;
      throw err;
    }
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json()).message || ''; } catch (e) { /* no message */ }
      const err = new Error(explain(res.status, detail));
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  function toBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function fromBase64(b64) {
    const bin = atob(String(b64).replace(/\s/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  G.connect = async function (key) {
    key = String(key || '').trim();
    if (!key) throw new Error('Paste the key first.');
    const repo = await api(`/repos/${OWNER}/${REPO}`, null, key);
    if (repo.permissions && repo.permissions.push === false) {
      throw new Error('That key can read the site but not change it. Give it “Contents: Read and write”.');
    }
    let login = OWNER;
    try { login = (await api('/user', null, key)).login || OWNER; } catch (e) { /* the account name is only for show */ }
    try { localStorage.setItem(KEY, JSON.stringify({ token: key, login })); } catch (e) { throw new Error('This browser would not save the key.'); }
    return login;
  };
  G.disconnect = () => { try { localStorage.removeItem(KEY); } catch (e) { /* fine */ } };

  G.read = async function () {
    const f = await api(`/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`);
    let data = null;
    try { data = JSON.parse(fromBase64(f.content)); } catch (e) { /* not readable: publishing replaces it */ }
    return { sha: f.sha, data };
  };
  G.write = (text, sha, message) =>
    api(`/repos/${OWNER}/${REPO}/contents/${PATH}`, { method: 'PUT', body: { message, content: toBase64(text), sha, branch: BRANCH } });
})();

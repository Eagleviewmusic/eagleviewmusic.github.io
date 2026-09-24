/* ==========================================================================
   github.js — the Librarian's connection to the Teacher Library on GitHub
   --------------------------------------------------------------------------
   With a fine-grained access key (Contents: read and write, on the one site
   repo) the Librarian can change the Teacher Library itself instead of
   handing the teacher files to upload. The key lives only in this
   browser's localStorage (`librarian_github_v1`); Disconnect removes it.

   Every change the Librarian makes is ONE commit, however many files it
   touches (Git Data API: blobs in a tree on top of main, then move main),
   so a rename of a ten-song book is one step in the history and one site
   rebuild. If main moved underneath (the index Action, or an upload made
   on GitHub's website), it starts again from the new main, once.

   window.LibGitHub
     connected()               -> bool
     login()                   -> the GitHub account name, once connected
     connect(key)              -> Promise; checks the key can write the repo
     disconnect()
     list()                    -> Promise<[{ name, path, sha }]> of the folder
     readJSON(name)            -> Promise<object|null> a file in the folder
     commit(files, message)    -> Promise; files = { name: text | null }
                                  (null deletes it)
   ========================================================================== */
(function (root) {
  'use strict';

  const OWNER = 'Eagleviewmusic';
  const REPO = 'eagleviewmusic.github.io';
  const BRANCH = 'main';
  const FOLDER = 'Teacher Library';
  const KEY = 'librarian_github_v1';
  const API = 'https://api.github.com';

  let conn = null;
  try { conn = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { conn = null; }

  const folderPath = name => FOLDER + '/' + name;
  const urlPath = p => p.split('/').map(encodeURIComponent).join('/');

  async function api(path, opts, key) {
    const token = key || (conn && conn.token);
    const o = opts || {};
    const headers = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Authorization': 'Bearer ' + token
    };
    if (o.body) headers['Content-Type'] = 'application/json';
    const res = await fetch(API + path, {
      method: o.method || 'GET',
      headers,
      body: o.body ? JSON.stringify(o.body) : undefined,
      cache: 'no-store'
    });
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json()).message || ''; } catch (e) {}
      const err = new Error(explain(res.status, detail));
      err.status = res.status;
      throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  function explain(status, detail) {
    if (status === 401) return 'GitHub didn’t accept the key — it may have expired. Make a new one and connect again.';
    if (status === 403) return 'The key can’t change this site. Check it has “Contents: Read and write” for eagleviewmusic.github.io.';
    if (status === 404) return 'The key can’t see the site’s repository. Check it was made for eagleviewmusic.github.io.';
    return 'GitHub said: ' + (detail || ('error ' + status));
  }

  function decode(b64) {
    const bin = atob(String(b64).replace(/\s/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  async function connect(key) {
    key = String(key || '').trim();
    if (!key) throw new Error('Paste the key first.');
    const repo = await api(`/repos/${OWNER}/${REPO}`, null, key);
    if (repo.permissions && repo.permissions.push === false) {
      throw new Error('That key can read the site but not change it. Give it “Contents: Read and write”.');
    }
    let login = OWNER;
    try { login = (await api('/user', null, key)).login || OWNER; } catch (e) {}
    conn = { token: key, login };
    try { localStorage.setItem(KEY, JSON.stringify(conn)); } catch (e) {}
    return login;
  }

  function disconnect() {
    conn = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  async function list() {
    try {
      const out = await api(`/repos/${OWNER}/${REPO}/contents/${urlPath(FOLDER)}?ref=${BRANCH}`);
      return (Array.isArray(out) ? out : []).filter(f => f.type === 'file')
        .map(f => ({ name: f.name, path: f.path, sha: f.sha }));
    } catch (e) {
      if (e.status === 404) return [];
      throw e;
    }
  }

  async function readJSON(name) {
    try {
      const f = await api(`/repos/${OWNER}/${REPO}/contents/${urlPath(folderPath(name))}?ref=${BRANCH}`);
      return JSON.parse(decode(f.content));
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  async function commitOnce(files, message) {
    const ref = await api(`/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`);
    const head = ref.object.sha;
    const commit = await api(`/repos/${OWNER}/${REPO}/git/commits/${head}`);
    const tree = Object.keys(files).map(name => {
      const text = files[name];
      return text === null
        ? { path: folderPath(name), mode: '100644', type: 'blob', sha: null }
        : { path: folderPath(name), mode: '100644', type: 'blob', content: text };
    });
    const newTree = await api(`/repos/${OWNER}/${REPO}/git/trees`, {
      method: 'POST', body: { base_tree: commit.tree.sha, tree }
    });
    const newCommit = await api(`/repos/${OWNER}/${REPO}/git/commits`, {
      method: 'POST', body: { message, tree: newTree.sha, parents: [head] }
    });
    await api(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, {
      method: 'PATCH', body: { sha: newCommit.sha, force: false }
    });
    return newCommit.sha;
  }

  async function commit(files, message) {
    try {
      return await commitOnce(files, message);
    } catch (e) {
      // main moved while we were building on it: build again on the new main
      if (e.status === 422 || e.status === 409) return commitOnce(files, message);
      throw e;
    }
  }

  root.LibGitHub = {
    OWNER, REPO, FOLDER,
    connected: () => !!(conn && conn.token),
    login: () => (conn && conn.login) || '',
    connect, disconnect, list, readJSON, commit
  };
})(window);

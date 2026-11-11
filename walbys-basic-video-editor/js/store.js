/* ==========================================================================
   Walby's Basic Video Editor — js/store.js
   Projects are folders on the Mac, inside one projects folder
   (Documents › Walby's Basic Video Editor). Each project folder holds:

     project.json     the timeline (this app writes it as you work)
     Media/           copies of the pictures and sound files you added
     Exports/         the MP4s
     Screenshots/     the 📷 pictures

   Chrome's File System Access API does it: the projects folder is picked once,
   its handle is kept in IndexedDB, and Chrome asks to allow editing again after
   it restarts (that's Chrome's rule). `?test` in the address uses Chrome's own
   private folder instead (for testing; nothing reaches Documents).
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const DB = 'walbys-basic-video-editor', KV = 'kv';
  const St = VE.Store = { FILE: 'project.json', test: /[?&]test\b/.test(location.search) };
  St.supported = St.test ? !!(navigator.storage && navigator.storage.getDirectory) : typeof window.showDirectoryPicker === 'function';

  function db() {
    return new Promise((res, rej) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(KV);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  St.get = async function (key) {
    try {
      const d = await db();
      return await new Promise((res, rej) => { const q = d.transaction(KV).objectStore(KV).get(key); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
    } catch (e) { return undefined; }
  };
  St.set = async function (key, val) {
    try {
      const d = await db();
      await new Promise((res, rej) => { const t = d.transaction(KV, 'readwrite'); t.objectStore(KV).put(val, key); t.oncomplete = res; t.onerror = () => rej(t.error); });
    } catch (e) { /* not kept: fine */ }
  };

  /* ---- the projects folder ---- */
  St.root = async function () {
    if (St.test) return (await navigator.storage.getDirectory()).getDirectoryHandle('Video Editor test root', { create: true });
    return (await St.get('root')) || null;
  };
  St.pickRoot = async function () {
    const dir = await window.showDirectoryPicker({ id: 'walbys-video-editor-root', mode: 'readwrite', startIn: 'documents' });
    await St.set('root', dir);
    return dir;
  };
  St.allowed = async function (dir, ask) {
    if (!dir.queryPermission) return true;
    const opt = { mode: 'readwrite' };
    if ((await dir.queryPermission(opt)) === 'granted') return true;
    try { return ask ? (await dir.requestPermission(opt)) === 'granted' : false; } catch (e) { return false; }
  };
  /* the error Chrome gives when its OK for the folder has lapsed (St.allowed(…, true) gets it back) */
  St.blocked = e => !!e && e.name === 'NotAllowedError';

  /* ---- projects in it ---- */
  St.list = async function (root) {
    const out = [];
    try {
      for await (const [name, h] of root.entries()) {
        if (h.kind !== 'directory') continue;
        try {
          const f = await (await h.getFileHandle(St.FILE)).getFile();
          const p = JSON.parse(await f.text());
          out.push({ handle: h, name, title: p.title || name, modified: f.lastModified, w: p.w, h: p.h });
        } catch (e) { /* not a project */ }
      }
    } catch (e) { /* unreadable */ }
    return out.sort((a, b) => b.modified - a.modified);
  };
  St.safeName = s => String(s || 'Untitled').replace(/[\/\\:*?"<>|]+/g, '-').replace(/^\.+/, '').trim().slice(0, 80) || 'Untitled';
  const exists = async (dir, name) => {
    try { await dir.getFileHandle(name); return true; } catch (e) { /* not a file */ }
    try { await dir.getDirectoryHandle(name); return true; } catch (e) { return false; }
  };
  /* "name", else "name 2", "name 3"… (ext kept at the end) */
  St.unique = async function (dir, name) {
    const dot = name.lastIndexOf('.'), base = dot > 0 ? name.slice(0, dot) : name, ext = dot > 0 ? name.slice(dot) : '';
    for (let k = 1; k < 1000; k++) {
      const n = k === 1 ? name : base + ' ' + k + ext;
      if (!(await exists(dir, n))) return n;
    }
    return base + ' ' + Date.now() + ext;
  };
  St.create = async function (root, project) {
    const name = await St.unique(root, St.safeName(project.title));
    const dir = await root.getDirectoryHandle(name, { create: true });
    for (const sub of ['Media', 'Exports', 'Screenshots']) await dir.getDirectoryHandle(sub, { create: true });
    await St.save(dir, project);
    return dir;
  };
  St.save = async function (dir, project) {
    const w = await (await dir.getFileHandle(St.FILE, { create: true })).createWritable();
    await w.write(JSON.stringify(project, null, 1) + '\n');
    await w.close();
  };
  St.load = async function (dir) {
    return JSON.parse(await (await (await dir.getFileHandle(St.FILE)).getFile()).text());
  };
  St.sub = (dir, name) => dir.getDirectoryHandle(name, { create: true });
  /* write a Blob into dir/sub with a name that isn't taken → the name used */
  St.writeInto = async function (dir, sub, name, blob) {
    const d = await St.sub(dir, sub);
    const n = await St.unique(d, St.safeName(name));
    const w = await (await d.getFileHandle(n, { create: true })).createWritable();
    await w.write(blob); await w.close();
    return n;
  };
  /* a writable for a new file (the MP4 streams into it) → { name, writable } */
  St.newWritable = async function (dir, sub, name) {
    const d = await St.sub(dir, sub);
    const n = await St.unique(d, St.safeName(name));
    return { name: n, writable: await (await d.getFileHandle(n, { create: true })).createWritable() };
  };
  /* "Media/x.jpg" → File, or null */
  St.read = async function (dir, rel) {
    try {
      const parts = rel.split('/');
      let d = dir;
      for (const p of parts.slice(0, -1)) d = await d.getDirectoryHandle(p);
      return await (await d.getFileHandle(parts[parts.length - 1])).getFile();
    } catch (e) { return null; }
  };
})();

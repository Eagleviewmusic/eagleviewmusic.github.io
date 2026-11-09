/* ==========================================================================
   Sound Booth-ACCF Edition — store.js
   Everything is kept in this browser (IndexedDB) and nothing is uploaded.
   Audio goes in as rows of 32-bit floats about a second long, written WHILE a
   take runs, so a crash or a closed tab costs a second of singing at most.

   meta  : one row per recording or added file { id, kind, name, rate, state… }
   audio : key [sourceId, channel, row] → Float32Array
   kv    : the project (tracks, clips) as JSON
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB = window.VB || {};
  const DB_NAME = 'sound-booth-accf', DB_VERSION = 1;
  let db = null;

  const S = VB.Store = {
    ok: false,
    failed: false,          // a write failed (usually: out of space)
    onfail: null
  };

  const wrap = req => new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
  const done = tx => new Promise((res, rej) => {
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
    tx.onabort = () => rej(tx.error);
  });

  S.open = function () {
    return new Promise(resolve => {
      let req;
      try { req = indexedDB.open(DB_NAME, DB_VERSION); } catch (e) { return resolve(false); }
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains('meta')) d.createObjectStore('meta', { keyPath: 'id' });
        if (!d.objectStoreNames.contains('audio')) d.createObjectStore('audio');
        if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv');
      };
      req.onsuccess = () => { db = req.result; S.ok = true; resolve(true); };
      req.onerror = () => resolve(false);
      req.onblocked = () => resolve(false);
    });
  };

  function fail(e) {
    console.error('Sound Booth-ACCF Edition store:', e);
    if (!S.failed) { S.failed = true; if (S.onfail) S.onfail(e); }
  }

  S.putMeta = function (meta) {
    if (!db) return Promise.resolve();
    const tx = db.transaction('meta', 'readwrite');
    tx.objectStore('meta').put(meta);
    return done(tx).catch(fail);
  };
  S.allMeta = function () {
    if (!db) return Promise.resolve([]);
    return wrap(db.transaction('meta').objectStore('meta').getAll());
  };

  S.putRow = function (id, ch, row, data) {
    if (!db) return Promise.resolve();
    const tx = db.transaction('audio', 'readwrite');
    tx.objectStore('audio').put(data, [id, ch, row]);
    return done(tx).catch(fail);
  };

  /* One channel of one source, whole. */
  S.readChannel = async function (id, ch) {
    if (!db) return new Float32Array(0);
    const range = IDBKeyRange.bound([id, ch, 0], [id, ch, Number.MAX_SAFE_INTEGER]);
    const rows = await wrap(db.transaction('audio').objectStore('audio').getAll(range));
    let n = 0;
    for (const r of rows) n += r.length;
    const out = new Float32Array(n);
    let at = 0;
    for (const r of rows) { out.set(r, at); at += r.length; }
    return out;
  };

  S.dropChannel = function (id, ch) {
    if (!db) return Promise.resolve();
    const tx = db.transaction('audio', 'readwrite');
    tx.objectStore('audio').delete(IDBKeyRange.bound([id, ch, 0], [id, ch, Number.MAX_SAFE_INTEGER]));
    return done(tx).catch(fail);
  };

  S.dropSource = function (id) {
    if (!db) return Promise.resolve();
    const tx = db.transaction(['audio', 'meta'], 'readwrite');
    tx.objectStore('audio').delete(IDBKeyRange.bound([id, 0, 0], [id, 9, Number.MAX_SAFE_INTEGER]));
    tx.objectStore('meta').delete(id);
    return done(tx).catch(fail);
  };

  S.getProject = function () {
    if (!db) return Promise.resolve(null);
    return wrap(db.transaction('kv').objectStore('kv').get('project'));
  };
  S.putProject = function (json) {
    if (!db) return Promise.resolve();
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(json, 'project');
    return done(tx).catch(fail);
  };

  S.clearAll = function () {
    if (!db) return Promise.resolve();
    const tx = db.transaction(['meta', 'audio', 'kv'], 'readwrite');
    tx.objectStore('meta').clear();
    tx.objectStore('audio').clear();
    tx.objectStore('kv').clear();
    return done(tx).catch(fail);
  };
})();

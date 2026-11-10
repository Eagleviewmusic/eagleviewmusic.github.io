/* Autosave in the browser's IndexedDB: the document as JSON under 'doc', and
   every photo / PDF file as a Blob in 'assets' (too big for localStorage). */

const DB = 'walbys-pdf-generator', VER = 1;
let dbp = null;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, VER);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', { keyPath: 'id' });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  return dbp;
}

function tx(store, mode, fn) {
  return open().then((db) => new Promise((res, rej) => {
    const t = db.transaction(store, mode);
    const out = fn(t.objectStore(store));
    t.oncomplete = () => res(out && 'result' in out ? out.result : undefined);
    t.onerror = () => rej(t.error);
    t.onabort = () => rej(t.error);
  }));
}

export const loadDoc = () => tx('kv', 'readonly', (s) => s.get('doc')).catch(() => null);
export const saveDoc = (doc) => tx('kv', 'readwrite', (s) => s.put(doc, 'doc'));
export const putAsset = (a) => tx('assets', 'readwrite', (s) => s.put(a));
export const allAssets = () => tx('assets', 'readonly', (s) => s.getAll()).catch(() => []);
export const deleteAssets = (ids) => tx('assets', 'readwrite', (s) => { for (const id of ids) s.delete(id); });
export const clearAssets = () => tx('assets', 'readwrite', (s) => s.clear());

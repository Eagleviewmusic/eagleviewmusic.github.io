/* ==========================================================================
   evm-library.js — Eagle View Music library rules, format version 1
   --------------------------------------------------------------------------
   AUTHORITATIVE COPY: Claude Apps/EVM Library/evm-library.js
   Every app that keeps a library carries a byte-identical copy in its own
   lib/ folder (each app is deployed as a folder of its own, so it cannot
   reach this one). Change it here, then copy it out and run
   EVM Library/check-copies.sh. The rules are written out in
   EVM Library/README.md; this file is those rules as code.

   What it knows nothing about: what a song, a scale or a layout is. Each
   app hands in a `key(record)` that returns the record's content as a
   string (or null when the record is blank), and everything here works
   from that.

   window.EVMLibrary
     FORMAT_VERSION
     stableStringify(value)          JSON with sorted keys
     newId(prefix)                   'song_1789512614629_k3f9'
     carry(from, to)                 copies the shared header fields
     stamp(next, prev, key)          createdAt / updatedAt on a save
     shareHeader(record, key, onScreenKey)
                                     { id, createdAt, updatedAt } for a link
     file(lib, incoming, opts)       the one import rule — see below
     readItems(json, opts)           every shape of file an app accepts
     toEnvelope(record, opts)        an item as the Librarian publishes it
     fromEnvelope(envelope)          and back into an app's record
   ========================================================================== */
(function (root) {
  'use strict';

  const FORMAT_VERSION = 1;

  /* The header fields every library record may carry beyond its app's own
     content. id, title, createdAt and isCustom are older than this file and
     each app already keeps them; these are the ones its normalize and save
     functions must now carry through as well, or a save drops them. */
  const HEADER = ['updatedAt', 'received', 'receivedAt', 'derivedFrom', 'book'];

  function stableStringify(value) {
    if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']';
    if (value && typeof value === 'object') {
      return '{' + Object.keys(value).sort()
        .map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
    }
    return JSON.stringify(value === undefined ? null : value);
  }

  function newId(prefix) {
    return (prefix || 'item') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  }

  function carry(from, to) {
    if (!from || !to) return to;
    HEADER.forEach(k => {
      const v = from[k];
      if (v !== undefined && v !== null && v !== false && v !== '') to[k] = v;
    });
    return to;
  }

  function timeOf(rec) {
    return Number(rec && (rec.updatedAt || rec.createdAt)) || 0;
  }

  function isBuiltIn(rec) { return !!rec && rec.isCustom === false; }

  /* A save. `updatedAt` moves only when the content or the title changed:
     every app also saves on its way out of the page, and a song that was
     merely opened must not look newer than it is — "newer wins" depends on
     it. */
  function stamp(next, prev, key) {
    const now = Date.now();
    if (prev) {
      carry(prev, next);
      next.createdAt = prev.createdAt || next.createdAt || now;
      const same = key(prev) === key(next) && (prev.title || '') === (next.title || '');
      next.updatedAt = same ? (prev.updatedAt || prev.createdAt || now) : now;
    } else {
      next.createdAt = next.createdAt || now;
      next.updatedAt = next.updatedAt || now;
    }
    return next;
  }

  /* What a share link carries about where it came from. The id travels only
     when the link holds exactly what is stored under it — a link made from
     unsaved changes (or from someone's edits to a shared song) is a
     different piece, and must not overwrite the stored one at the other
     end. Built-ins never travel by id: every copy of the app has them. */
  function shareHeader(stored, key, onScreenKey) {
    if (!stored || isBuiltIn(stored) || !stored.id) return {};
    if (onScreenKey !== undefined && onScreenKey !== key(stored)) return {};
    return {
      id: stored.id,
      createdAt: stored.createdAt || undefined,
      updatedAt: stored.updatedAt || stored.createdAt || undefined
    };
  }

  /* ------------------------------------------------------------------
     THE IMPORT RULE — links, files, and (later) the Librarian

     opts = {
       key(rec)       -> content string, or null when the record is blank
       reserved(id)   -> true for ids an import must never take (sandboxes)
       newId()        -> a fresh id for this app
       received       true when the item came from someone else (a link, a
                      Librarian envelope): it is filed read-only
     }

     1. Blank: not filed.
     2. Same id already here (and not a built-in):
          same content, not newer ... 'same'
          incoming stamped newer .... 'updated'  (replaced in place — even with the
                                                  same music: a new title or new
                                                  Layout Settings is a new version)
          ours is newer ............. 'kept'
          no way to tell ............ filed beside it under a new id
     3. No usable id: the same content already here ... 'matched'
        (links made before ids travelled land here)
     4. Otherwise ....................................... 'added'

     `lib` is changed in place; the caller saves it. Returns
     { action, id, record }.
     ------------------------------------------------------------------ */
  function file(lib, incoming, opts) {
    const o = opts || {};
    const reserved = o.reserved || (() => false);
    const k = incoming ? o.key(incoming) : null;
    if (k === null || k === undefined) return { action: 'blank', id: null, record: null };

    const now = Date.now();
    let id = incoming.id && !reserved(incoming.id) ? String(incoming.id) : null;
    const existing = id ? lib[id] : null;

    if (existing && !isBuiltIn(existing)) {
      const tin = Number(incoming.updatedAt) || 0;
      /* Same music and not newer: nothing to do. Same music but stamped
         newer still replaces it — a new title, or new Layout Settings
         (record.layout), is a newer version too. */
      if (o.key(existing) === k && !(tin > timeOf(existing))) {
        return { action: 'same', id: id, record: existing };
      }
      if (tin && tin > timeOf(existing)) {
        // an update keeps what the record was here: shared stays shared, yours stays yours
        const rec = finish(incoming, id, !!existing.received, now);
        rec.createdAt = existing.createdAt || rec.createdAt;
        if (existing.derivedFrom && !rec.derivedFrom) rec.derivedFrom = existing.derivedFrom;
        lib[id] = rec;
        return { action: 'updated', id: id, record: rec };
      }
      if (tin && tin <= timeOf(existing)) return { action: 'kept', id: id, record: existing };
      id = null;          // cannot say which is newer: keep both
    } else if (existing) {
      id = null;          // a built-in is never written over
    }

    const match = findMatch(lib, k, o, reserved);
    if (match) return { action: 'matched', id: match, record: lib[match] };

    if (!id || lib[id]) id = o.newId ? o.newId() : newId('item');
    const rec = finish(incoming, id, o.received ? true : !!incoming.received, now);
    lib[id] = rec;
    return { action: 'added', id: id, record: rec };
  }

  function finish(incoming, id, received, now) {
    const rec = Object.assign({}, incoming);
    rec.id = id;
    rec.isCustom = true;
    rec.createdAt = Number(incoming.createdAt) || now;
    rec.updatedAt = Number(incoming.updatedAt) || rec.createdAt;
    delete rec.received;
    delete rec.receivedAt;
    if (received) { rec.received = true; rec.receivedAt = now; }
    delete rec.sandbox;
    return rec;
  }

  /* The oldest record with the same content, so every old link lands on
     the same song however many copies of it are already lying about. */
  function findMatch(lib, k, o, reserved) {
    let best = null;
    Object.keys(lib).forEach(id => {
      if (reserved(id)) return;
      const rec = lib[id];
      if (!rec || typeof rec !== 'object') return;
      let rk = null;
      try { rk = o.key(rec); } catch (e) { rk = null; }
      if (rk !== k) return;
      if (!best || (Number(rec.createdAt) || 0) < (Number(lib[best].createdAt) || 0)) best = id;
    });
    return best;
  }

  /* ------------------------------------------------------------------
     FILES. Accepts, in order:
       { format: 'evm-bundle', items: [envelope…] }
       { format: 'evm-item', … }                  one envelope
       [record…]                                  a bare array
       { songs: [record…] } / { items: [record…] } an app's own backup
       { id: record, … }                          a raw library object
     opts = { app, looksLike(obj) }  — envelopes for another app are
     skipped and counted in `.otherApp`.
     ------------------------------------------------------------------ */
  function readItems(json, opts) {
    const o = opts || {};
    const looksLike = o.looksLike || (() => true);
    const out = [];
    out.otherApp = 0;
    let list = null;
    if (!json || typeof json !== 'object') return out;
    if (json.format === 'evm-bundle' && Array.isArray(json.items)) list = json.items;
    else if (json.format === 'evm-item') list = [json];
    else if (Array.isArray(json)) list = json;
    else if (Array.isArray(json.songs)) list = json.songs;
    else if (Array.isArray(json.items)) list = json.items;
    else list = Object.keys(json).map(k => json[k]).filter(v => v && typeof v === 'object' && looksLike(v));
    list.forEach(item => {
      if (!item || typeof item !== 'object') return;
      if (item.format === 'evm-item') {
        if (o.app && item.app !== o.app) { out.otherApp++; return; }
        out.push(fromEnvelope(item));
      } else {
        out.push(item);
      }
    });
    return out;
  }

  /* ------------------------------------------------------------------
     ENVELOPES — one item as the Teacher Library holds it.
     { format: 'evm-item', formatVersion: 1, app, kind, id, title,
       createdAt, updatedAt, data: { …the app's own record… } }
     The header lives outside `data` so index.json can be built without
     knowing any app. Built-ins (isCustom false) are never published.
     ------------------------------------------------------------------ */
  const ENVELOPE_SKIP = ['id', 'title', 'createdAt', 'updatedAt', 'isCustom',
                         'received', 'receivedAt', 'derivedFrom', 'sandbox', 'book'];

  function toEnvelope(record, opts) {
    const o = opts || {};
    if (!record || isBuiltIn(record)) return null;
    const data = o.dataOf ? o.dataOf(record) : (() => {
      const d = {};
      Object.keys(record).forEach(k => { if (ENVELOPE_SKIP.indexOf(k) === -1) d[k] = record[k]; });
      return d;
    })();
    return {
      format: 'evm-item',
      formatVersion: FORMAT_VERSION,
      app: o.app,
      kind: o.kind || 'song',
      id: record.id,
      title: record.title || record.name || 'Untitled',
      createdAt: record.createdAt || Date.now(),
      updatedAt: record.updatedAt || record.createdAt || Date.now(),
      // the Teacher Library book it sits in on the shelf (evm-shelf.js)
      book: o.book ? String(o.book) : undefined,
      data: data
    };
  }

  /* An envelope is something published to people — so it arrives
     read-only, unless it says otherwise. Its `book` is not copied: a
     record's `book` means "taken out from the shelf in that book", and
     only evm-shelf.js sets it (a file uploaded by hand is not on loan). */
  function fromEnvelope(env) {
    const rec = Object.assign({}, env.data || {});
    rec.id = env.id;
    rec.title = env.title;
    rec.createdAt = env.createdAt;
    rec.updatedAt = env.updatedAt;
    rec.isCustom = true;
    if (env.received !== false) rec.received = true;
    return rec;
  }

  root.EVMLibrary = {
    FORMAT_VERSION: FORMAT_VERSION,
    HEADER: HEADER.slice(),
    stableStringify: stableStringify,
    newId: newId,
    carry: carry,
    stamp: stamp,
    shareHeader: shareHeader,
    file: file,
    readItems: readItems,
    toEnvelope: toEnvelope,
    fromEnvelope: fromEnvelope
  };
})(typeof window !== 'undefined' ? window : this);

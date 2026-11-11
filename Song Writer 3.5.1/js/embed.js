/* ==========================================================================
   Song Writer — embed.js
   --------------------------------------------------------------------------
   The first script on the page, so nothing after it ever sees the real
   localStorage when it is swapped here. It is swapped in two cases; on any
   other page it stays as it is. It also says, for js/library.js, whether
   this page sits inside someone else's site (EMBEDDED ELSEWHERE, below).

   INSIDE THE RECORDING STUDIO (?embed=studio)

   The Recording Studio (../Recording Studio/, README "Bringing songs in")
   opens this app in a hidden frame to turn a song into notes
   (js/studio-bridge.js). There the app is a guest: it may read its
   library and settings, but nothing it does may write them — opening a
   song for the studio must not change which song is open the next time
   Song Writer is opened on its own, let alone overwrite one.

   Ostinato Builder's guard for the Music Stand, copied (the block at the
   top of Ostinato Builder 2.0/script.js): rather than guard every write,
   localStorage itself is swapped for a layer that reads through to the
   real thing and keeps every write in memory.

   INSIDE THE LIBRARY'S PREVIEW (?embed=preview, 2026-11-11)

   The Library's Preview window (js/library-boxes.js) shows a song in a
   small floating window by opening this app in a frame there, in Present
   mode, locked (js/preview-frame.js). The same guest rules as the studio's
   frame — it reads the library and writes nothing — so the same layer, and
   window.EVM_STUDIO_EMBED is set as there (no shelf, no lessons, no "Leave
   site?"). window.EVM_PREVIEW says which of the two it is, and the page
   gets html.preview-embed before anything is drawn.

   WHEN THE BROWSER REFUSES STORAGE (2026-11-04, the user's report)

   A page embedded in another site (a Google Site) can be refused storage
   altogether: touching localStorage throws, as it does where third-party
   storage is blocked, or in a sandboxed frame. The app kept its songs only
   there, so a song link was filed into a library that forgot it at once,
   and the sandbox too: the app ran with an empty page ("Library · Untitled")
   and the song could not be opened. So the same layer goes in: everything
   works for as long as the page is open, and js/library.js says so when
   there is something to keep. Storage that is only FULL still reads, and
   is not swapped (js/library.js saveStoredLibrary holds on to that case).

   EMBEDDED ELSEWHERE (2026-11-04, the user)

   window.EVM_EMBEDDED_ELSEWHERE: a frame whose top page is another site's,
   a Google Site. There a song link is opened to be read, on every visit,
   lesson after lesson, so js/library.js keeps nothing of it. A frame inside
   our own site (the Recording Studio's) is not this: the browser lets it
   read the top page's address, and only then.
   ========================================================================== */
(function () {
  window.EVM_EMBEDDED_ELSEWHERE = (function () {
    if (window.self === window.top) return false;
    try { void window.top.location.origin; return false; }   // readable: the top page is ours
    catch (e) { return true; }                               // another site's: the browser will not say
  })();

  function refused() {
    try {
      const s = window.localStorage;                    // a refused page throws here
      if (!s) return true;
      s.setItem('evm_storage_probe', '1');
      s.removeItem('evm_storage_probe');
      return false;
    } catch (e) {
      return !/quota/i.test((e && e.name) || '');       // full: it can still be read
    }
  }

  let embedded = false, preview = false;
  try {
    const as = new URLSearchParams(window.location.search).get('embed');
    embedded = (as === 'studio' || as === 'preview') && window.parent !== window;
    preview = embedded && as === 'preview';
  } catch (e) {}
  const refusedNow = !embedded && refused();
  if (!embedded && !refusedNow) return;

  let real = null;
  if (embedded) { try { real = window.localStorage; } catch (e) {} }    // storage blocked: everything stays in memory
  const writes = new Map();             // key -> value, or null once removed
  const layer = {
    getItem(k) {
      k = String(k);
      if (writes.has(k)) return writes.get(k);
      try { return real ? real.getItem(k) : null; } catch (e) { return null; }
    },
    setItem(k, v) { writes.set(String(k), String(v)); },
    removeItem(k) { writes.set(String(k), null); },
    clear() { writes.clear(); },
    key(i) { try { return real ? real.key(i) : null; } catch (e) { return null; } },
    get length() { try { return real ? real.length : 0; } catch (e) { return 0; } }
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: layer, configurable: true });
  } catch (e) {}

  /* If the swap did not take, this is not a safe guest: run as the plain
     app, and the studio finds no bridge (SongWriterStudio) and says so. */
  if (window.localStorage !== layer) return;
  if (refusedNow) { window.EVM_STORAGE_MEMORY = true; return; }
  window.EVM_STUDIO_EMBED = {
    /* Drop what this frame wrote for a key, so the next read is the real,
       current value — the studio's song picker wants the live library. */
    forget(k) { writes.delete(String(k)); }
  };
  if (preview) {
    window.EVM_PREVIEW = true;
    document.documentElement.classList.add('preview-embed');
  }
})();

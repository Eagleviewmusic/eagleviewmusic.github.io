/* ==========================================================================
   Song Writer — embed.js
   --------------------------------------------------------------------------
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
   real thing and keeps every write in memory. This is the first script
   on the page, so nothing after it ever sees the real object.

   Not framed, or no ?embed=studio: nothing happens at all.
   ========================================================================== */
(function () {
  let embedded = false;
  try {
    embedded = new URLSearchParams(window.location.search).get('embed') === 'studio'
      && window.parent !== window;
  } catch (e) {}
  if (!embedded) return;

  let real = null;
  try { real = window.localStorage; } catch (e) {}     // storage blocked: everything stays in memory
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
  window.EVM_STUDIO_EMBED = {
    /* Drop what this frame wrote for a key, so the next read is the real,
       current value — the studio's song picker wants the live library. */
    forget(k) { writes.delete(String(k)); }
  };
})();

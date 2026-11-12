/* ==========================================================================
   Song Writer — preview-frame.js
   --------------------------------------------------------------------------
   window.SongWriterPreview (version 1) — the inside of the Library's
   Preview window (js/library-boxes.js, 2026-11-11, the user: "a small
   preview of the score in a floating window. The user can scroll up and
   down, select a note, press play (no count-in), but really just that").

   Only in the Preview's frame (?embed=preview, js/embed.js: the storage
   there is a read-through layer, so nothing here can write the user's
   songs, settings or which song is open). Anywhere else it does nothing.

   The frame is Song Writer itself, in Present mode — the music, not the
   tools: no Edit box, no toolbars, nothing to change — and locked. The
   Present pill keeps only Play (style.css html.preview-embed), and Play
   starts straight in, without a count-in. Tapping a note selects it and
   sounds it, as it does anywhere; Play starts from it. Esc closes the
   window around the frame.

     open(id)   the song filed under that id, read fresh from the library
                → true, or false when there is no such song
     stop()     silence
   ========================================================================== */
(function () {
  'use strict';
  if (!window.EVM_PREVIEW || !window.EVM_STUDIO_EMBED) return;
  const SW = window.SW;
  const S = SW.state;
  const L = SW.library;
  const EMBED = window.EVM_STUDIO_EMBED;

  function quiet() { if (SW.player) SW.player.stop(); }

  /* looked at, never changed (each of these writes to the frame's memory only) */
  function settle() {
    const v = SW.settings.view;
    if (!v.lockScore || v.editOpen || v.showDock) SW.settings.setView({ lockScore: true, editOpen: false, showDock: false });
    if (S.sound) S.sound.countIn = false;
    if (SW.app && !S.present) SW.app.setPresent(true);
  }

  function open(id) {
    if (id === undefined || id === null) return false;
    quiet();
    // the live library: what this frame read earlier may be old by now
    try { EMBED.forget(L.STORAGE_KEY); } catch (e) {}
    let ok = false;
    try { ok = L.loadSongById(String(id)); } catch (e) { console.error('SongWriterPreview.open:', e); }
    if (!ok) return false;
    settle();
    const stage = document.getElementById('stage');
    if (stage) stage.scrollTop = 0;
    window.scrollTo(0, 0);
    return true;
  }

  // Esc closes the Preview window (never Present, which would bring the tools in)
  window.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    quiet();
    try { window.parent.SW.boxes.closePreview(); } catch (err) {}
  }, true);

  settle();
  window.SongWriterPreview = { version: 1, open, stop: quiet };
})();

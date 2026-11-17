/* EVM hold guard — a finger, pen or mouse may hold a key, a chord block or
   any other part of the page for as long as the music needs, and nothing
   else happens.

   Why (2026-11-11): on a smart board a note held for a couple of seconds
   in Song Writer 3.5 opened Chrome's right-click menu ("Create QR Code for
   this page" and the rest) — a long press is a right-click on a touch
   screen. The same had happened in other EVM apps.

   What it stops, everywhere on the page except where text is typed
   (inputs, text areas, menus, contenteditable) and real links:
     - the right-click / long-press menu (contextmenu)
     - a long press picking up a picture or a piece of the page to drag
       (dragstart; anything marked draggable="true" still drags)
     - a long press selecting text, and the iPad / phone callout
       (selectstart after a finger or pen goes down; a mouse still selects)
   It only cancels what the browser would do. The app's own handlers still
   get every event, so nothing it does on a right-click changes.

   Drop-in: <script src="lib/evm-hold-guard.js"></script>, anywhere in the
   page. Loading it twice does nothing more. */
(function () {
  'use strict';
  if (window.__evmHoldGuard) return;
  window.__evmHoldGuard = true;

  const FREE = 'input, textarea, select, option, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], a[href]';
  const isFree = t => {
    const el = t && t.nodeType === 1 ? t : t && t.parentElement;
    return !!(el && el.closest && el.closest(FREE));
  };

  document.addEventListener('contextmenu', e => {
    if (!isFree(e.target)) e.preventDefault();
  }, true);

  document.addEventListener('dragstart', e => {
    const el = e.target && e.target.nodeType === 1 ? e.target : e.target && e.target.parentElement;
    if (el && el.closest && el.closest('[draggable="true"]')) return;
    if (!isFree(el)) e.preventDefault();
  }, true);

  // A long press selects a word on a touch screen; a mouse drag is left alone.
  let touchy = false;
  document.addEventListener('pointerdown', e => {
    touchy = e.pointerType === 'touch' || e.pointerType === 'pen';
  }, true);
  document.addEventListener('selectstart', e => {
    if (touchy && !isFree(e.target)) e.preventDefault();
  }, true);

  // iPad / iPhone: no "Copy · Look Up · Share" callout on a long press.
  const style = document.createElement('style');
  style.textContent = 'html{-webkit-touch-callout:none}' +
    'input,textarea,[contenteditable=""],[contenteditable="true"],[contenteditable="plaintext-only"]{-webkit-touch-callout:default}';
  (document.head || document.documentElement).appendChild(style);
})();

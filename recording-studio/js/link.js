/* ==========================================================================
   Recording Studio — link.js
   The instruments, each the real app in a frame (?embed=studio), and the
   link they join: window.EVMStudio (README.md, "The instrument link").

   - A frame is made the first time its instrument is shown, then kept:
     the others sit behind it (visibility, never display:none — an app
     must be able to measure itself).
   - Timing: every input event on this page and in the frames is noted by
     its own timestamp (put on this page's clock), so a note is placed at
     the key or touch that made it, not at whenever the call arrived.
   - Keys: Space (play / stop) and Escape (stop) are the studio's even
     while a frame has the keyboard; a key pressed on the studio's own page
     is handed to the instrument showing.

   window.StudioLink = { show(kind), inputStamp(), forward(e), setSound(kind, id) }
   (kind 'voice' shows the microphone panel instead of a frame)
   ========================================================================== */
(() => {
  'use strict';

  const SOURCES = {
    keyboard:  { app: 'virtual-keyboard',  url: '../virtual-keyboard/index.html?embed=studio',  label: 'the keyboard' },
    accordion: { app: 'digital-accordion', url: '../Digital%20Accordion/index.html?embed=studio', label: 'the accordion' },
    xylophone: { app: 'rainbow-xylophone', url: '../rainbow-xylophone/index.html?embed=studio', label: 'the xylophone' }
  };
  const BY_APP = {};
  Object.keys(SOURCES).forEach(kind => { SOURCES[kind].kind = kind; BY_APP[SOURCES[kind].app] = SOURCES[kind]; });

  const stage = document.getElementById('inst-stage');
  const empty = document.getElementById('inst-empty');
  let shown = null;

  // -------- WHEN THINGS HAPPENED --------
  const TYPES = ['keydown', 'keyup', 'pointerdown', 'pointerup', 'pointercancel', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
  let lastStamp = 0;   // performance.now() terms, this page's clock
  const watched = new WeakSet();
  function watch(win) {
    if (watched.has(win)) return;
    watched.add(win);
    let shift = 0;
    try { shift = win.performance.timeOrigin - performance.timeOrigin; } catch (e) {}
    TYPES.forEach(type => win.addEventListener(type, e => { lastStamp = e.timeStamp + shift; }, { capture: true, passive: true }));
  }
  watch(window);
  function inputStamp() {
    const now = performance.now();
    return lastStamp > 0 && lastStamp <= now + 1 && now - lastStamp < 250 ? Math.min(lastStamp, now) : now;
  }

  // -------- SPACE AND ESCAPE INSIDE A FRAME --------
  function typingIn(win) {
    try {
      const a = win.document.activeElement;
      return !!(a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable));
    } catch (e) { return false; }
  }
  function guardKeys(win) {
    let shift = 0;
    try { shift = win.performance.timeOrigin - performance.timeOrigin; } catch (e) {}
    win.addEventListener('keydown', (e) => {
      if (Studio.calibrating()) {          // the timing test: every key is a tap
        if (e.key === 'Escape') return;
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!e.repeat) Studio.calTap(e.timeStamp + shift);
        return;
      }
      if (e.code === 'Space' && !typingIn(win) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!e.repeat && !Studio.sheetOpen()) Studio.togglePlay();
      } else if (e.key === 'Escape' && Studio.busy()) {
        Studio.stop();                      // and let the app close its own sheet too
      }
    }, true);
    win.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && !typingIn(win)) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
  }

  // -------- THE LINK --------
  window.EVMStudio = {
    version: 1,
    join(win, app) {
      const src = BY_APP[app];
      if (!src) return null;
      src.win = win;
      watch(win);
      guardKeys(win);
      const kind = src.kind;
      const key = id => kind + ':' + id;
      return {
        on(id, freqs, sound, level) { if (Array.isArray(freqs) && freqs.length) Studio.noteOn(kind, key(id), freqs, sound, level); },
        off(id) { Studio.noteOff(kind, key(id)); },
        hit(freqs, sound, level) { if (Array.isArray(freqs) && freqs.length) Studio.noteHit(kind, freqs, sound, level); },
        offer(api) {
          src.api = api && typeof api === 'object' ? api : null;
          src.keyGiven = null;
          setTimeout(() => giveKey(src), 0);   // once the app has finished starting
        }
      };
    }
  };

  // -------- THE FRAMES --------
  function frameFor(kind) {
    const src = SOURCES[kind];
    if (src.iframe) return src.iframe;
    const f = document.createElement('iframe');
    f.className = 'inst-frame';
    f.title = src.label.replace(/^the /, '');
    f.setAttribute('allow', 'autoplay');
    f.src = src.url;
    f.addEventListener('load', () => {
      f.classList.add('loaded');
      giveKey(src);
      if (shown === kind) { focusFrame(kind); if (window.InstControls) InstControls.render(kind); }
    });
    stage.appendChild(f);
    src.iframe = f;
    return f;
  }
  function focusFrame(kind) {
    const src = SOURCES[kind];
    if (!src || !src.iframe) return;
    // never take the keyboard from a field being typed in on this page
    const a = document.activeElement;
    if (a && a !== document.body && a.closest && a.closest('input, textarea, select') && !a.closest('.inst-pane')) return;
    try { src.iframe.focus(); src.iframe.contentWindow.focus(); } catch (e) {}
  }
  function release(kind) {
    const src = SOURCES[kind];
    try { if (src && src.api && src.api.releaseAll) src.api.releaseAll(); } catch (e) {}
  }

  // The Voice tab is not a frame: it is the studio's own microphone panel (voice.js).
  function show(kind) {
    const voice = kind === 'voice';
    if (!voice && !SOURCES[kind]) return;
    if (shown && shown !== kind && SOURCES[shown]) release(shown);
    shown = kind;
    Object.keys(SOURCES).forEach(k => {
      const fr = SOURCES[k].iframe;
      if (fr) fr.classList.toggle('active', k === kind);
    });
    empty.hidden = true;
    document.getElementById('voice-panel').hidden = !voice;
    if (typeof StudioVoice !== 'undefined') StudioVoice.shown(voice);   // (a global const, not window.StudioVoice)
    if (window.InstControls) InstControls.render(kind);
    if (voice) { stage.classList.remove('loading'); return; }
    const f = frameFor(kind);
    f.classList.add('active');
    stage.classList.toggle('loading', !f.classList.contains('loaded'));
    if (f.classList.contains('loaded')) focusFrame(kind);
    f.addEventListener('load', () => stage.classList.remove('loading'), { once: true });
  }

  // A key pressed on the studio's page plays the instrument showing — handed
  // over as the same key, and the keyboard moved to the frame so its release
  // (and the next keys) go there directly.
  function forward(e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Tab') return;
    const src = SOURCES[shown];
    if (!src || !src.win || !src.iframe) return;
    const win = src.win;
    let ev;
    try {
      ev = new win.KeyboardEvent('keydown', {
        key: e.key, code: e.code, location: e.location, repeat: e.repeat, shiftKey: e.shiftKey,
        modifierCapsLock: !!(e.getModifierState && e.getModifierState('CapsLock')),
        keyCode: e.keyCode, which: e.which, bubbles: true, cancelable: true, composed: true
      });
    } catch (err) { return; }
    e.preventDefault();
    try { src.iframe.focus(); win.focus(); } catch (err) {}
    const doc = win.document;
    const target = doc.activeElement && doc.activeElement !== doc.body ? doc.activeElement : doc.body;
    target.dispatchEvent(ev);
  }

  // -------- THE KEY --------
  // Every instrument plays in the project's key: given as it joins, and again
  // whenever the key changes (an instrument already in it is left alone).
  function giveKey(src) {
    const key = Studio.key;
    if (!src || !src.api || !src.api.setKey || !key) return;
    const k = key.pc + ' ' + key.scale;
    if (src.keyGiven === k) return;
    try { src.api.setKey(key.pc, key.scale); src.keyGiven = k; } catch (e) {}
  }
  function setKey() { Object.values(SOURCES).forEach(giveKey); }

  function setSound(kind, id) {
    const src = SOURCES[kind];
    try { if (src && src.api && src.api.setSound) src.api.setSound(id); } catch (e) {}
  }

  // After a click on one of the studio's buttons, the computer keyboard goes
  // back to the instrument (a menu, a sheet or a field keeps it).
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('button');
    if (!b || b.closest('.sheet-backdrop, .menu') || !shown) return;
    setTimeout(() => { if (!Studio.sheetOpen() && document.getElementById('track-menu').hidden) focusFrame(shown); }, 0);
  });

  window.StudioLink = { show, inputStamp, forward, setSound, setKey, focus: () => focusFrame(shown), sources: SOURCES };
})();

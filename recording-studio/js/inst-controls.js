/* ==========================================================================
   Recording Studio — inst-controls.js
   The showing instrument's own sound and layout controls, in the studio's
   instrument bar beside the tabs, with its settings gear at the end — so the
   app's own header rows can go and the instrument gets their height.

   Each control here stands in for the real one in the app's frame (same
   origin): a click clicks that button, a menu choice sets that menu, and
   what the app shows (which view, how many octaves, the sound) is read back
   whenever the app's header changes. The app's header itself is hidden by a
   style put into the frame. The key and scale are the project's (the
   transport's menus; link.js hands them on), so they are not here.

   window.InstControls = { render(kind) }
   ========================================================================== */
const InstControls = (() => {
  'use strict';

  const bar = document.getElementById('inst-ctls');

  // How each app's controls are found. Items: seg (buttons side by side,
  // one lit), group (the same, with a label), select, button, gear (last).
  // Left out on purpose (the user's call): the keyboard's and accordion's
  // Library, the xylophone's ? tutorial.
  // on(el): is it lit; label(el): its words when the app's own won't do.
  const pressed = b => b.getAttribute('aria-pressed') === 'true' || b.getAttribute('aria-checked') === 'true' ||
    b.getAttribute('aria-selected') === 'true' || b.classList.contains('active');
  const SPECS = {
    keyboard: {
      hide: '#topbar, #quickbar { display: none !important; }',
      watch: '#topbar, #quickbar',
      items: [
        { type: 'seg', sel: '#topbar .view-seg .seg-btn', copy: true, label: 'View' },
        { type: 'group', label: 'Octaves', sel: '#quickbar .oct-btn' },
        { type: 'select', sel: '#sound-select', label: 'Sound' },
        { type: 'button', sel: '#focus-btn', toggle: true },
        { type: 'button', sel: '#layout-btn' },
        { type: 'gear', sel: '#settings-btn' }
      ]
    },
    accordion: {
      hide: '#topbar { display: none !important; }',
      watch: '#topbar',
      items: [
        { type: 'seg', sel: '#topbar .view-seg .seg-btn', label: 'View' },
        { type: 'gear', sel: '#settings-btn' }
      ]
    },
    xylophone: {
      // The header folds to nothing, but its settings menu (which hangs from
      // the gear) must still show: a hidden parent lets a child be visible.
      hide: 'header { height: 0 !important; min-height: 0 !important; padding-top: 0 !important; padding-bottom: 0 !important; visibility: hidden; }' +
            ' header .settings-container > div { visibility: visible; }',
      watch: 'header',
      items: [
        { type: 'seg', sel: 'header button[aria-label="Vibraphone sound"], header button[aria-label="Marimba sound"]', label: 'Sound',
          on: b => /\bbg-amber-400\b/.test(b.className), text: b => (b.getAttribute('aria-label') || '').replace(/ sound$/, '') },
        { type: 'button', sel: 'header button[aria-label^="Switch to"]', text: b => b.textContent.trim() },
        { type: 'gear', sel: 'header .settings-container > button' }
      ]
    }
  };

  const GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';

  let built = null;   // { kind, doc, parts: [{ item, els: [studio el], srcs: [app el] }] }
  let observer = null, pending = 0;
  let showing = null, retry = 0, tries = 0;   // an app still drawing its header is looked at again

  function docOf(kind) {
    const src = window.StudioLink && StudioLink.sources[kind];
    try { return src && src.iframe && src.iframe.classList.contains('loaded') ? src.iframe.contentDocument : null; } catch (e) { return null; }
  }

  // The app's header rows go: the instrument takes their height.
  function hideHeader(kind, doc) {
    if (doc.getElementById('studio-hosted')) return;
    const st = doc.createElement('style');
    st.id = 'studio-hosted';
    st.textContent = SPECS[kind].hide;
    doc.head.appendChild(st);
    try { doc.defaultView.dispatchEvent(new Event('resize')); } catch (e) {}
  }

  function wordsOf(item, s) {
    if (item.text) return item.text(s);
    return s.textContent.trim();
  }
  function fill(item, el, s) {
    if (item.copy) el.innerHTML = s.innerHTML;   // the app's own icon (and words)
    else el.textContent = wordsOf(item, s);
    const t = item.title || s.getAttribute('title') || s.getAttribute('aria-label');
    if (t) el.title = t;
    const a = s.getAttribute('aria-label');
    if (a) el.setAttribute('aria-label', a);
  }

  // Click the app's own control, then bring this bar up to date.
  function press(s) {
    try { s.click(); } catch (e) {}
    soon();
  }

  function build(kind, doc) {
    const spec = SPECS[kind];
    bar.innerHTML = '';
    const scroll = document.createElement('div');
    scroll.className = 'ic-scroll';
    bar.appendChild(scroll);
    const parts = [];
    spec.items.forEach(item => {
      const srcs = [...doc.querySelectorAll(item.sel)];
      if (!srcs.length) return;
      if (item.type === 'seg' || item.type === 'group') {
        const seg = document.createElement('div');
        seg.className = 'ic-seg';
        seg.setAttribute('role', 'group');
        if (item.label) seg.setAttribute('aria-label', item.label);
        if (item.type === 'group') {
          const l = document.createElement('span');
          l.className = 'ic-label';
          l.textContent = item.label;
          seg.appendChild(l);
        }
        const els = srcs.map(s => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'ic-seg-btn' + (item.copy ? ' ic-icon' : '');
          fill(item, b, s);
          b.addEventListener('click', () => press(s));
          seg.appendChild(b);
          return b;
        });
        scroll.appendChild(seg);
        parts.push({ item, els, srcs });
      } else if (item.type === 'select') {
        const s = srcs[0];
        const sel = document.createElement('select');
        sel.className = 'select ic-select';
        if (item.label) sel.setAttribute('aria-label', item.label);
        sel.addEventListener('change', () => {
          s.value = sel.value;
          s.dispatchEvent(new Event('change', { bubbles: true }));
          sel.blur();
          if (window.StudioLink) StudioLink.focus();   // the computer keys play again
          soon();
        });
        scroll.appendChild(sel);
        parts.push({ item, els: [sel], srcs: [s] });
      } else {
        const s = srcs[0];
        const b = document.createElement('button');
        b.type = 'button';
        if (item.type === 'gear') {
          b.className = 'tb-btn icon-only ic-gear';
          b.innerHTML = GEAR;
          b.title = 'Settings for the ' + kind;
          b.setAttribute('aria-label', b.title);
          bar.appendChild(b);   // outside the scroller: always at the end
        } else {
          b.className = 'quick-btn ic-btn' + (item.copy ? ' ic-icon' : '');
          fill(item, b, s);
          scroll.appendChild(b);
        }
        b.addEventListener('click', () => press(s));
        parts.push({ item, els: [b], srcs: [s] });
      }
    });
    if (!parts.length) {
      // the frame has loaded but its header isn't drawn yet (React draws a
      // moment later): look again shortly, for a few seconds
      built = null;
      clearTimeout(retry);
      if (tries++ < 40) retry = setTimeout(() => { if (showing === kind) render(kind); }, 150);
      return;
    }
    tries = 0;
    built = { kind, doc, parts };
    watch(kind, doc);
    sync();
  }

  // What the app shows, shown here: lit buttons, the words that change
  // (Flex / Chromatic, Vertical / Horizontal), the menu's choice.
  function sync() {
    pending = 0;
    if (!built) return;
    if (built.parts.some(p => p.srcs.some(s => !s.isConnected))) { build(built.kind, built.doc); return; }   // React swapped one
    built.parts.forEach(({ item, els, srcs }) => {
      if (item.type === 'select') {
        const s = srcs[0], sel = els[0];
        if (sel.dataset.opts !== s.innerHTML) { sel.innerHTML = s.innerHTML; sel.dataset.opts = s.innerHTML; }
        if (sel.value !== s.value) sel.value = s.value;
        return;
      }
      els.forEach((el, k) => {
        const s = srcs[k];
        if (!s || !s.isConnected) return;
        const on = item.on ? item.on(s) : pressed(s);
        if (item.type === 'seg' || item.type === 'group') el.classList.toggle('active', on);
        else if (item.type === 'gear') el.classList.toggle('on', s.getAttribute('aria-expanded') === 'true');
        else if (item.toggle) el.setAttribute('aria-pressed', String(on));
        if (!item.copy && item.type !== 'gear') {
          const w = wordsOf(item, s);
          if (el.textContent !== w) el.textContent = w;
        }
      });
    });
  }
  function soon() { if (!pending) pending = requestAnimationFrame(sync); }

  function watch(kind, doc) {
    if (observer) observer.disconnect();
    observer = new MutationObserver(soon);
    doc.querySelectorAll(SPECS[kind].watch).forEach(n => observer.observe(n, { subtree: true, childList: true, attributes: true, characterData: true }));
    if (!doc.studioControlsWatched) {   // a menu's choice changes no attribute
      doc.studioControlsWatched = true;
      doc.addEventListener('change', soon, true);
    }
  }

  // Called whenever the studio redraws its instrument bar, and when a frame
  // finishes loading: builds the controls for a newly shown (or newly
  // loaded) instrument, otherwise just brings them up to date.
  function render(kind) {
    if (kind !== showing) { showing = kind; tries = 0; }
    const doc = SPECS[kind] ? docOf(kind) : null;
    if (!doc) {
      if (built || bar.childElementCount) { bar.innerHTML = ''; built = null; if (observer) observer.disconnect(); }
      return;
    }
    hideHeader(kind, doc);
    if (!built || built.kind !== kind || built.doc !== doc) build(kind, doc);
    else sync();
  }

  window.InstControls = { render };
  return { render };
})();

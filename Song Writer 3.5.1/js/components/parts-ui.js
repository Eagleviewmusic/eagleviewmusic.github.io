/* ==========================================================================
   COMPONENT — the parts on screen (2026-11-03)      #part-strip · #parts-block
   --------------------------------------------------------------------------
   PARTS (js/parts.js) as the user meets them — a first, plain version:
   the code underneath is the point, the look is for later.

   THE STRIP (#part-strip, at the top of the stage, on every page — Pitch,
   Notation and Rhythm alike): a tab for each part and + to add one. Away
   while the song has one part and no chords, so nothing changes for a
   song that has neither. What a tab does depends on the page (later the same day, the
   user):
     PITCH     one part at a time — a tap puts that part on the page (lit)
     NOTATION  switches (parts.js SHOWN) — a tap turns a part on or off;
     RHYTHM    every part on is drawn, Part 1 on top; the pencil marks the
               part being written (a tap on another part's note puts it on
               the page); turning that one off hands the pencil to the
               nearest part on; the last part on stays on.
   CHORDS (then the user): when the song has chords, a Chords switch
   comes first, on every page — the chords are shown or not (the same
   thing as Look → Display Chords Off, view pref showLane). Hidden, they
   still play unless Sound → Hear hidden parts is off (player.js).
   A one-part song gets the strip too once a chord is placed
   (Chords | Part 1 | +); Part 1 is then the one part that stays on.
   (The other parts drawn small under the tabs — view pref partMinis —
   went the same day: the user did not want them; the other parts are
   drawn at full size by part-rows.js and the Rhythm page.)

   OPTIONS → PARTS (#parts-block in the Options popover, the user's
   choice of home for it): the same tabs, "Add a part" (up to four), and
   for the part on the page its name, its sound (its own, or Sound →
   Melody's), its volume and "Remove". Adding, removing and the settings
   are edits (one Undo step each), so they need the song to be editable
   (S.editing); choosing which part is on the page never is.

   A NEW PART (#newpart-sheet, later the same day — the user: "ask if
   they want to copy the notes/rhythm/text from another part"): Add a
   part (the strip's + or Options') opens a small window first — copy
   from which part, and any of Notes · Rhythm · Words (each on its own;
   none = an empty part). SW.parts.add({ from, notes, rhythm, words })
   does the copying (parts.js copySyllables); the choice is remembered
   for the next new part while the page is open.

   API  SW.partsUI.render() · askNew()
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const P = SW.parts;
  const $ = id => document.getElementById(id);
  const strip = $('part-strip');
  const block = $('parts-block');
  const title = $('parts-title');
  if (!strip || !P) return;

  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const can = what => !SW.settings || SW.settings.can(what);
  const allowed = () => !SW.lessons || SW.lessons.shellAllows('view');
  const editable = () => !!S.editing && can('structure');
  let quiet = false;                    // a slider on the move: the block is left as it is

  function tabs(cls) {
    let html = '';
    for (let i = 0; i < P.count(); i++) {
      const on = i === P.focused();
      html += '<button type="button" class="' + cls + (on ? ' active' : '') + '" role="tab" aria-selected="' + on + '" data-part="' + i + '">' + esc(P.label(i)) + '</button>';
    }
    return html;
  }

  /* ---------------- the strip ---------------- */
  const switches = () => document.body.dataset.page === 'notation' || document.body.dataset.page === 'rhythm';
  const PENCIL = '<svg class="ps-pencil" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>';
  function toggles() {
    let html = '';
    for (let i = 0; i < P.count(); i++) {
      const on = P.isShown(i), pen = i === P.focused();
      const name = esc(P.label(i));
      html += '<button type="button" class="ps-tab ps-switch' + (on ? ' on' : '') + (pen ? ' writing' : '') + '" aria-pressed="' + on + '" data-toggle="' + i + '"' +
        ' title="' + (on ? 'Hide ' : 'Show ') + name + (pen ? ' (you are writing it)' : '') + '">' + (pen ? PENCIL : '') + name + '</button>';
    }
    return html;
  }
  /* the Chords switch: while the song has chords (and a lesson leaves them in) */
  function chordsTab() {
    if (!SW.track || !SW.track.hasChords() || (SW.lessons && !SW.lessons.shellAllows('strip'))) return '';
    const on = SW.settings.shows('lane');
    return '<button type="button" class="ps-tab ps-switch ps-chords' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-chords' +
      ' title="' + (on ? 'Hide the chords' : 'Show the chords') + '">Chords</button>';
  }
  function renderStrip() {
    const n = P.count(), chords = chordsTab();
    const away = n < 2 && !chords;                    // one part and no chords: nothing to switch
    strip.hidden = away;
    if (away) { strip.innerHTML = ''; return; }
    const sw = switches();
    strip.innerHTML = '<div class="ps-tabs"' + (sw ? ' role="group" aria-label="Parts shown"' : ' role="tablist" aria-label="Parts"') + '>' + chords + (sw ? toggles() : tabs('ps-tab')) +
      (editable() && n < P.MAX ? '<button type="button" class="ps-add" data-add title="Add a part">+</button>' : '') + '</div>';
  }

  /* ---------------- Options → Parts ---------------- */
  function soundOptions(chosen) {
    let html = '<option value=""' + (!chosen ? ' selected' : '') + '>Melody sound (Sound tab)</option>';
    SW.audio.soundGroups().forEach(g => {
      html += '<optgroup label="' + esc(g.label) + '">' + g.sounds.map(s => '<option value="' + esc(s.id) + '"' + (s.id === chosen ? ' selected' : '') + '>' + esc(s.name) + '</option>').join('') + '</optgroup>';
    });
    return html;
  }
  function renderBlock() {
    if (!block) return;
    const show = allowed();
    block.hidden = !show;
    if (title) title.hidden = !show;
    if (!show) return;
    const f = P.focused(), n = P.count(), meta = P.meta(f), edit = editable();
    let html = '<div class="pt-tabs" role="tablist" aria-label="Parts">' + tabs('pt-tab') + '</div>';
    if (edit && n < P.MAX) html += '<button type="button" class="popover-link pt-add" data-add><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>Add a part</button>';
    html += '<div class="pt-card">' +
      '<label class="pt-row"><span class="pt-k">Name</span><input type="text" class="pt-name" maxlength="24" placeholder="' + esc(P.label(f)) + '" value="' + esc(meta.name) + '"' + (edit ? '' : ' disabled') + ' aria-label="Name of this part"></label>' +
      '<label class="pt-row"><span class="pt-k">Sound</span><select class="sound-select pt-sound"' + (edit ? '' : ' disabled') + ' aria-label="Sound of this part">' + soundOptions(meta.sound) + '</select></label>' +
      '<div class="mix-level pt-row"><span class="pt-k">Volume</span><input type="range" class="zoom-slider pt-volume" min="0" max="100" step="1" value="' + meta.volume + '" style="--fill:' + meta.volume + '%"' + (edit ? '' : ' disabled') + ' aria-label="Volume of this part"><output class="pt-volume-value">' + meta.volume + '%</output></div>' +
      (edit && n > 1 ? '<button type="button" class="popover-link pt-remove" data-remove>Remove ' + esc(P.label(f)) + '</button>' : '') +
      '</div>';
    if (!edit) html += '<p class="popover-note">Open the Edit box to add, name or remove parts.</p>';
    block.innerHTML = html;
  }

  /* ---------------- a new part: copy from another? ---------------- */
  const sheet = $('newpart-sheet');
  const pick = { from: null, notes: false, rhythm: false, words: false };   // the last choice, for the next new part
  const WHAT = [
    { k: 'notes', name: 'Notes', note: 'the pitches' },
    { k: 'rhythm', name: 'Rhythm', note: 'how long each note lasts, and the rests' },
    { k: 'words', name: 'Words', note: 'the lyrics, syllable by syllable' }
  ];
  function outcome() {
    const from = esc(P.label(pick.from));
    const { notes, rhythm, words } = pick;
    if (!notes && !rhythm && !words) return 'An empty part: a rest in every line, ready for anything.';
    if (notes && rhythm && words) return 'A copy of ' + from + ' — its notes, rhythm and words — to change as you like.';
    if (notes && rhythm) return from + "'s notes and rhythm, with no words.";
    if (notes && words) return from + "'s words on its notes, every note a quarter until you give it a rhythm.";
    if (rhythm && words) return from + "'s words and rhythm, every note on do — ready for a tune of its own.";
    if (notes) return from + "'s notes with no words, every note a quarter until you give it a rhythm.";
    if (rhythm) return from + "'s rhythm, every note on do, with no words.";
    return from + "'s words, one quarter note on do for each — ready for a tune and a rhythm of its own.";
  }
  function renderSheet() {
    const n = P.count();
    if (pick.from === null || pick.from >= n) pick.from = Math.min(P.focused(), n - 1);
    $('np-title').textContent = 'Add Part ' + (n + 1);
    $('np-from').innerHTML = '<span class="np-k">Copy from</span>' + Array.from({ length: n }, (_, i) =>
      '<button type="button" class="pt-tab' + (i === pick.from ? ' active' : '') + '" role="radio" aria-checked="' + (i === pick.from) + '" data-from="' + i + '">' + esc(P.label(i)) + '</button>').join('');
    $('np-what').innerHTML = WHAT.map(w =>
      '<label class="np-pick' + (pick[w.k] ? ' on' : '') + '"><input type="checkbox" data-what="' + w.k + '"' + (pick[w.k] ? ' checked' : '') + '><b>' + w.name + '</b><span>' + w.note + '</span></label>').join('');
    $('np-outcome').textContent = outcome();
  }
  function askNew() {
    if (!editable()) return;
    if (P.count() >= P.MAX) { SW.ui.toast('A song has at most ' + P.MAX + ' parts'); return; }
    if (!sheet) { P.add(); return; }
    renderSheet();
    SW.ui.openSheet('newpart-sheet');
  }
  function addNow() {
    SW.ui.closeSheet('newpart-sheet');
    if (!editable()) return;
    if (P.add({ from: pick.from, notes: pick.notes, rhythm: pick.rhythm, words: pick.words }) < 0) SW.ui.toast('A song has at most ' + P.MAX + ' parts');
  }
  if (sheet) {
    sheet.addEventListener('click', e => {
      const f = e.target.closest('[data-from]');
      if (f) { pick.from = parseInt(f.dataset.from, 10); renderSheet(); return; }
      if (e.target.closest('#np-add')) addNow();
    });
    sheet.addEventListener('change', e => {
      const k = e.target.dataset && e.target.dataset.what;
      if (!k) return;
      pick[k] = e.target.checked;
      renderSheet();
    });
    sheet.addEventListener('keydown', e => {
      if (e.key === 'Enter' && sheet.classList.contains('show')) { e.preventDefault(); addNow(); }
    });
  }

  function render() {
    if (quiet) return;
    renderStrip();
    renderBlock();
  }

  /* ---------------- taps ---------------- */
  function onTap(e) {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.stopPropagation();
      askNew();
      return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) {
      e.stopPropagation();
      if (!editable()) return;
      const f = P.focused();
      if (confirm('Remove ' + P.label(f) + ' and everything written on it?')) P.remove(f);
      return;
    }
    if (e.target.closest('[data-chords]')) {
      e.stopPropagation();
      SW.settings.setView({ showLane: !SW.settings.view.showLane });
      return;
    }
    const sw = e.target.closest('[data-toggle]');
    if (sw) {
      e.stopPropagation();
      const i = parseInt(sw.dataset.toggle, 10);
      if (!P.setShown(i, !P.isShown(i)) && P.isShown(i)) SW.ui.toast('One part always stays on');
      return;
    }
    const t = e.target.closest('[data-part]');
    if (!t || e.target.closest('input, select')) return;
    e.stopPropagation();
    P.focus(parseInt(t.dataset.part, 10));
  }
  strip.addEventListener('click', onTap);
  if (block) {
    block.addEventListener('click', onTap);
    block.addEventListener('change', e => {
      const f = P.focused();
      if (e.target.classList.contains('pt-name')) P.setMeta(f, { name: e.target.value });
      else if (e.target.classList.contains('pt-sound')) {
        P.setMeta(f, { sound: e.target.value });
        SW.audio.previewPart(P.meta(f));
        e.target.blur();                              // hand the keys back to the song
      } else if (e.target.classList.contains('pt-volume')) { quiet = false; render(); SW.audio.previewPart(P.meta(f)); }
    });
    block.addEventListener('input', e => {
      if (!e.target.classList.contains('pt-volume')) return;
      SW.audio.context();                             // a gesture: wake the sound so the level lands now
      quiet = true;                                   // the slider stays under the finger
      P.setMeta(P.focused(), { volume: parseInt(e.target.value, 10) });
      e.target.style.setProperty('--fill', e.target.value + '%');
      const out = block.querySelector('.pt-volume-value');
      if (out) out.textContent = e.target.value + '%';
    });
    block.addEventListener('keydown', e => {
      if (e.target.classList.contains('pt-name') && e.key === 'Enter') { e.preventDefault(); e.target.blur(); }
      e.stopPropagation();                            // typing a name is not the song's keys
    });
  }

  ['score:loaded', 'score:changed', 'track:changed', 'view:changed', 'mode:changed', 'editbox:changed', 'policy:changed', 'key:changed', 'parts:shown'].forEach(evt => SW.bus.on(evt, render));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

  SW.partsUI = { render, askNew };
})();

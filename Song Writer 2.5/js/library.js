/* ==========================================================================
   Song Writer — library.js
   --------------------------------------------------------------------------
   Storage, ported from Rhythm Poetry 2.0 (see its "AUTO-SAVE" and sandbox
   notes, and the memory notes rhythm-poetry-lesson-policy / ostinato-lesson-
   policy). Song Writer has one kind of song, so — like Ostinato Builder —
   it has ONE sandbox, not two.

   KEYS (all new; Song Writer 1.0's keys are read once and never written):
     song_writer_25_library_v1       { id: record } — the sandbox lives inside
                                    it under 'sandbox' but is not "in the
                                    library": getSortedSongIds() drops it,
                                    and every list goes through that
     song_writer_25_active_song_v1   the id on screen last visit

   A RECORD
     { id, title, score: <SW.score model>, isCustom, createdAt, updatedAt,
       layout?, received?, receivedAt?, derivedFrom?, book? }
   `layout` is the Layout Settings it was saved with (a layoutSnapshot();
   see A PIECE'S OWN LAYOUT in settings.js). Opening the piece brings them
   back. Lesson exercises never carry it.
   A 1.0 record ({ id, title, content: '<text>' }) is turned into one by
   normalizeSong(), wherever it comes from — storage, a file or a link.
   The last three are the shared library header (lib/evm-library.js):
     received      true: it came from someone else, in a link — read-only
     receivedAt    when it was filed here
     derivedFrom   the id it was saved as… from (a shared song, most often)
     book          the Teacher Library book a shared song came in (set by
                   lib/evm-shelf.js; never on a Save my copy)
   normalizeSong() and save() carry them through, so nothing drops them.

   THE RULES (Rhythm Poetry's, kept):
   • The sandbox is where you land when nothing else is open. Only Save as…
     puts it in the library.
   • A library song opens with auto-save OFF; a song you have just made or
     saved-as opens with it ON. The toggle is not shown for the sandbox or
     a lesson (they always keep themselves).
   • save(force): only `force === true` overrides auto-save off — this
     function is handed to event listeners, and an Event is truthy.
   • Dirtiness is a stableStringify fingerprint of the score and the
     Layout Settings, taken after the song settles on screen.
   • updatedAt moves only when the score, the Layout Settings or the title
     changed (EVM.stamp):
     save() also runs on the way out of the page, and a song that was
     merely opened must not look newer than it is.

   SHARED SONGS (the EVM library rules, as in Rhythm Poetry 2.0):
   • A link carries the song's own id and dates (only when it holds exactly
     what is saved under that id). Opening it again — a link embedded in a
     Google Site opens on every visit — finds the song already here instead
     of adding a copy: by id, or, for links made before ids travelled, by
     content (songKey). A newer version replaces the older one in place.
   • A song from a link is filed `received`: it is never saved into. The
     auto-save toggle reads "Save my copy" and opens Save as…; the copy is
     the student's own, with derivedFrom pointing back at the shared one.
     Its row in the Songs sheet carries a "Shared" tag and has no Rename.
   • The Teacher Library shelf (lib/evm-shelf.js) files songs the same way,
     marked with the `book` they were taken out in. They are listed under
     their book, above the student's own songs, and leave when the book is
     put back. A Save my copy of one is the student's own and stays.
   • A blank song (no words, or nothing but New's "Start Here") is never
     filed from a link or a file.
   • Files follow the same rule (EVM.file): songs keep their ids, so
     importing the same file twice adds nothing. Sandbox links are
     unchanged: they overwrite this person's sandbox.
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  // Shared library rules (ids, updatedAt, the import rule): lib/evm-library.js
  const EVM = window.EVMLibrary;
  const S = SW.state;
  const ui = SW.ui;
  const $ = id => document.getElementById(id);

  const STORAGE_KEY = 'song_writer_25_library_v1';
  const ACTIVE_ID_KEY = 'song_writer_25_active_song_v1';
  const LEGACY_STORAGE_KEY = 'song_writer_library_v1';          // Song Writer 1.0
  const SANDBOX_ID = 'sandbox';
  const SANDBOX_TITLE = 'Sandbox';

  /* 1.0's three examples, in 1.0's order and with 1.0's titles. */
  const DEFAULT_TITLES = {
    twinkle: 'Twinkle Twinkle',
    mary: 'Mary Had a Little Lamb',
    starspangledbanner: 'Star Spangled Banner'
  };
  const DEFAULT_ORDER = Object.keys(DEFAULT_TITLES);
  const NEW_SONG_TEXT = (typeof PRELOADED_SONGS !== 'undefined' && PRELOADED_SONGS['new-song']) || '[Key of C]\n[A]\nStart[D1] Here[D1]';
  const isSandboxId = id => id === SANDBOX_ID;
  const isDefaultId = id => Object.prototype.hasOwnProperty.call(DEFAULT_TITLES, id);

  let currentSongId = null;
  let currentSongTitle = '';
  let autoSave = true;
  let savedFingerprint = null;
  let titlePromptIntent = 'new';
  /* The song on screen arrived from someone else (a link): it is never
     saved into, and the toggle offers Save my copy instead of auto-save. */
  let openedReceived = false;
  // …and, if it came from a book taken off the Teacher Library shelf, which one
  let openedBook = '';

  /* ---------------- records ---------------- */
  function normalizeSong(raw, idHint) {
    if (!raw || typeof raw !== 'object') return null;
    const id = raw.id || idHint || EVM.newId('song');
    let score;
    /* The 1-beat pick-up was a Layout setting until 2026-09-28
       (layout.show.pickup); it is the song's own now (score.pickup). A song
       saved or sent with that setting on takes it as its own. */
    let rawScore = raw.score;
    if (rawScore && typeof rawScore === 'object' && rawScore.pickup === undefined
        && raw.layout && raw.layout.show && raw.layout.show.pickup === true) rawScore = Object.assign({}, rawScore, { pickup: 1 });
    if (rawScore && typeof rawScore === 'object') score = SW.score.normalize(rawScore);
    else if (typeof raw.content === 'string') score = SW.score.fromText(raw.content);
    else score = SW.score.fromText(NEW_SONG_TEXT);
    const out = {
      id,
      title: (typeof raw.title === 'string' && raw.title.trim()) ? raw.title.trim().slice(0, 60) : 'Untitled Song',
      score,
      isCustom: raw.isCustom !== undefined ? !!raw.isCustom : !isDefaultId(id),
      createdAt: raw.createdAt || Date.now(),
      updatedAt: raw.updatedAt || raw.createdAt || Date.now()
    };
    // received, receivedAt, derivedFrom, book (updatedAt is above) — see lib/evm-library.js
    EVM.carry(raw, out);
    // the Layout Settings it was saved with (A PIECE'S OWN LAYOUT, settings.js)
    if (raw.layout && typeof raw.layout === 'object') out.layout = JSON.parse(JSON.stringify(raw.layout));
    return out;
  }

  /* ------------------------------------------------------------------
     WHAT A SONG IS, FOR MATCHING (lib/evm-library.js)

     songKey() is the song's content with its name, id and dates left out:
     two records with the same key are the same piece. It is how a link
     made before ids travelled finds the copy already here instead of
     filing another, and how a save tells whether anything changed.
     Null means blank — a blank song is never filed from a link or file.
     ------------------------------------------------------------------ */
  function songKey(song) {
    if (!song || typeof song !== 'object') return null;
    const n = normalizeSong(song, 'x');
    return isBlankSong(n) ? null : EVM.stableStringify(n.score);
  }

  /* The same, blank or not — what a save compares. normalizeSong runs the
     score through SW.score.normalize, which fills in every default, so a
     1.0 { content } record and a 2.0 { score } record of the same song
     give the same key. */
  function rawSongKey(song) {
    return EVM.stableStringify(normalizeSong(song, 'x').score);
  }

  /* The Layout Settings a record was saved with, as a key. Kept apart from
     rawSongKey on purpose: a song is matched (links, files, the shelf) by
     its music alone, but a save counts a changed setting as a changed
     piece. */
  function pieceLayoutKey(rec) {
    const l = rec && rec.layout && typeof rec.layout === 'object' ? rec.layout : null;
    return EVM.stableStringify(l);
  }

  /* New's template, as a key — worked out the first time it is needed,
     since SW.score is not ready while this file loads. */
  let newSongKey = null;
  function templateKey() {
    if (newSongKey === null) newSongKey = rawSongKey({ content: NEW_SONG_TEXT });
    return newSongKey;
  }

  /* Blank: no real words anywhere (every syllable is '-' or empty), or
     nothing but what New starts with — "Start Here" on D1 D1. */
  function isBlankSong(n) {
    const lines = (n && n.score && n.score.lines) || [];
    const words = lines.some(l => (l.syllables || []).some(s => {
      const t = String((s && s.text) || '').trim();
      return t !== '' && t !== '-';
    }));
    if (!words) return true;
    return EVM.stableStringify(n.score) === templateKey();
  }

  const fileOpts = received => ({
    key: songKey,
    // nor a lesson's id, or a link could overwrite a student's lesson work
    reserved: id => isSandboxId(id) || String(id).indexOf('lesson_') === 0,
    newId: () => EVM.newId('song'),
    received: received
  });

  function defaultRecord(id) {
    const text = (typeof PRELOADED_SONGS !== 'undefined' && PRELOADED_SONGS[id]) || NEW_SONG_TEXT;
    return normalizeSong({ id, title: DEFAULT_TITLES[id], content: text, isCustom: false, createdAt: 0 });
  }
  function defaultLibrary() {
    const lib = {};
    DEFAULT_ORDER.forEach(id => { lib[id] = defaultRecord(id); });
    return lib;
  }

  /* First run: the examples, plus anything the user made in 1.0. A 1.0
     example they changed comes across as a song of its own, so the 2.0
     example stays pristine and nothing they wrote is lost. The 1.0 key is
     left exactly as it was — 1.0 keeps working beside 2.0. */
  function migrateFromV1(library) {
    let legacy = null;
    try { legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || 'null'); } catch (e) {}
    if (!legacy || typeof legacy !== 'object') return 0;
    let n = 0;
    Object.keys(legacy).forEach((id, i) => {
      const song = legacy[id];
      if (!song || typeof song !== 'object' || typeof song.content !== 'string') return;
      if (isDefaultId(id)) {
        const stock = (typeof PRELOADED_SONGS !== 'undefined' && PRELOADED_SONGS[id]) || '';
        if (song.content.trim() === stock.trim()) return;
        const rec = normalizeSong({ title: (song.title || DEFAULT_TITLES[id]) + ' (from 1.0)', content: song.content, isCustom: true, createdAt: Date.now() + i }, 'v1_' + id);
        library[rec.id] = rec;
      } else {
        const rec = normalizeSong({ ...song, isCustom: true, createdAt: Date.now() + i }, id);
        library[rec.id] = rec;
      }
      n++;
    });
    return n;
  }

  function getStoredLibrary() {
    let library = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) library = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading library from localStorage:', e);
    }
    if (!library || typeof library !== 'object' || Object.keys(library).length === 0) {
      library = defaultLibrary();
      const moved = migrateFromV1(library);
      saveStoredLibrary(library);
      if (moved) setTimeout(() => ui.toast(`Brought across ${moved} song${moved > 1 ? 's' : ''} from Song Writer 1.0`), 400);
    }
    return library;
  }

  function saveStoredLibrary(library) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
    } catch (e) {
      console.error('Error saving library to localStorage:', e);
      ui.toast('Could not save — the browser storage is full or blocked');
    }
  }

  /* Every list in the app goes through here — which is what keeps the
     sandbox out of them all. Inside a lesson the library *is* the lesson. */
  function getSortedSongIds(library) {
    const lib = library || getStoredLibrary();
    const lesson = SW.lessons && SW.lessons.meta();
    const user = [], defaults = [];
    Object.keys(lib).forEach(id => {
      if (isSandboxId(id)) return;
      const song = lib[id];
      if (isDefaultId(id) && !song.isCustom) defaults.push(id);
      else user.push(id);
    });
    // a shared song is new here when it arrived, not when it was written
    const when = id => (lib[id] && (lib[id].receivedAt || lib[id].createdAt)) || 0;
    user.sort((a, b) => when(b) - when(a));
    defaults.sort((a, b) => DEFAULT_ORDER.indexOf(a) - DEFAULT_ORDER.indexOf(b));
    const all = user.concat(defaults);
    if (lesson) return lesson.songIds.filter(id => all.indexOf(id) !== -1);
    return all;
  }

  function persistActiveId() {
    try {
      if (currentSongId && !(SW.lessons && SW.lessons.meta())) localStorage.setItem(ACTIVE_ID_KEY, currentSongId);
    } catch (e) {}
  }

  /* ---------------- auto-save ---------------- */
  // the settings are part of the piece: changing one is a change to save
  function fingerprint() {
    return ui.stableStringify(SW.score.read()) + '|' + ui.stableStringify(SW.settings.layoutSnapshot());
  }
  function markSaved() { savedFingerprint = fingerprint(); }

  function autoSaveOffered() {
    return !(SW.lessons && SW.lessons.meta()) && !isSandboxId(currentSongId) && !!currentSongId;
  }
  function autoSaveOn() { return !autoSaveOffered() || (autoSave && !openedReceived); }
  function hasUnsavedChanges() {
    if (autoSaveOn() || savedFingerprint === null) return false;
    if (SW.lessons && SW.lessons.isPreviewing()) return false;
    return fingerprint() !== savedFingerprint;
  }
  /* Before the song on screen is left with changes that are not saved
     (auto-save off, or a shared song): ask, as Reopen does. */
  function okToLeave(where) {
    if (!hasUnsavedChanges()) return true;
    const title = currentSongTitle || 'this song';
    return confirm('Leave “' + title + '” without saving your changes?\n\n'
      + 'Auto-save is off' + (openedReceived ? ' (it is a shared song)' : '') + ', so the changes you have made since opening it are not saved. '
      + 'OK ' + (where || 'goes on') + ' and leaves them behind. Cancel stays here — then Save as… (or turn auto-save on) to keep them.');
  }

  function save(force) {
    if (!currentSongId) return;
    /* Preview as a student works on the teacher's own songs: nothing a
       preview does is written back (2.0 saved them without their layout). */
    if (SW.lessons && SW.lessons.isPreviewing()) return;
    if (force !== true && !autoSaveOn()) return;
    const library = getStoredLibrary();
    const existing = library[currentSongId] || {};
    /* A shared song stays exactly as it was sent — that is what lets a
       student always go back to it. Their changes become theirs only
       through Save my copy (Save as…). A lesson always keeps itself. */
    if (existing.received && !(SW.lessons && SW.lessons.meta())) return;
    const record = {
      id: currentSongId,
      title: currentSongTitle || existing.title || 'Untitled Song',
      score: SW.score.read(),
      isCustom: existing.isCustom !== undefined ? existing.isCustom : !isDefaultId(currentSongId),
      createdAt: existing.createdAt || Date.now()
    };
    // the settings it is saved with (A PIECE'S OWN LAYOUT) — a lesson's are the lesson's
    if (!(SW.lessons && SW.lessons.meta())) record.layout = SW.settings.layoutSnapshot();
    /* updatedAt moves only if something actually changed — the build rules
       count; derivedFrom and the rest of the header are carried over from
       what was stored. A song saved before pieces kept their settings gets
       them now without looking newer: only a change to settings it already
       had moves the date. */
    const key = existing.layout ? r => rawSongKey(r) + '|' + pieceLayoutKey(r) : rawSongKey;
    EVM.stamp(record, existing.id ? existing : null, key);
    library[currentSongId] = record;
    saveStoredLibrary(library);
    markSaved();
  }

  const autoSaveToggle = $('autosave-toggle');
  const ICON_SAVING = '<path d="M20 6 9 17l-5-5"/>';
  const ICON_NOT_SAVING = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  // Save my copy, on a shared song: two sheets, one on the other
  const ICON_COPY = '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>';

  function updateAutoSaveToggle() {
    if (!autoSaveToggle) return;
    const offered = autoSaveOffered();
    autoSaveToggle.hidden = !offered;
    if (!offered) return;
    const on = autoSaveOn();
    autoSaveToggle.classList.toggle('is-off', !on);
    autoSaveToggle.classList.toggle('is-shared', openedReceived);
    autoSaveToggle.setAttribute('aria-pressed', String(on));
    autoSaveToggle.title = openedReceived
      ? 'A shared song stays exactly as it was sent, so you can always go back to it. Press to save your own copy and keep your changes.'
      : on
      ? 'Auto-save is on: every change is saved to this song. Press to stop saving.'
      : 'Auto-save is off: your changes are not being saved. Press to save them and start saving again.';
    $('autosave-label').textContent = openedReceived ? 'Save my copy' : (on ? 'Auto-save' : 'Not saving');
    autoSaveToggle.querySelector('.autosave-icon').innerHTML = openedReceived ? ICON_COPY : (on ? ICON_SAVING : ICON_NOT_SAVING);
  }

  function setAutoSave(on) {
    if (!autoSaveOffered()) return;
    if (on && openedReceived) { showNewSongModal('saveAs'); return; }
    if (on && hasUnsavedChanges()) {
      const title = currentSongTitle || 'this song';
      const ok = confirm('Save the changes you have made to “' + title + '”?\n\n'
        + 'OK saves them and turns auto-save on.\n'
        + 'Cancel leaves auto-save off, and “' + title + '” stays as it was saved.');
      if (!ok) { updateAutoSaveToggle(); return; }
      autoSave = true;
      save(true);
      ui.toast('Saved — auto-save on');
    } else {
      autoSave = !!on;
      if (autoSave) markSaved();
    }
    updateAutoSaveToggle();
    renderLibrarySongList();
  }

  /* ---------------- the chip ---------------- */
  function updateSongChip() {
    const sandbox = isSandboxId(currentSongId);
    const lesson = SW.lessons && SW.lessons.meta();
    const title = sandbox ? SANDBOX_TITLE : (currentSongTitle || 'Untitled');
    const where = sandbox ? 'Sandbox' : (lesson ? 'Lesson' : (openedReceived ? (openedBook || 'Shared') : 'Library'));
    const chip = $('song-chip');
    chip.classList.toggle('is-sandbox', sandbox);
    chip.title = sandbox ? 'Library — your sandbox is open: scratch work, not in your library' : `Library — ${where}: ${title}`;
    const kicker = $('song-chip-kicker');
    kicker.textContent = where;
    kicker.hidden = sandbox;
    $('song-chip-label').textContent = title;
    $('sandbox-clear-btn').hidden = !sandbox;
    $('now-editing-title').textContent = title;
    paintBadge($('now-editing-badge'), S.key);
    const note = $('now-editing-note');
    note.textContent = sandbox
      ? 'Scratch work. It stays here between visits but is not in your library — use Save as… to keep it there.'
      : openedReceived && openedBook
      ? 'From the book “' + openedBook + '” in the Teacher Library. It stays exactly as it was sent, so you can always come back to it — use Save as… to keep your own copy with your changes.'
      : openedReceived
      ? 'Shared with you. It stays exactly as it was sent, so you can always come back to it — use Save as… to keep your own copy with your changes.'
      : '';
    note.hidden = !note.textContent;
    document.title = (sandbox ? 'Sandbox' : title) + ' — Song Writer 2.5';
    updateAutoSaveToggle();
  }

  /* A key badge in its tonic's colour (1.0's key colours). */
  function paintBadge(el, key) {
    if (!el) return;
    el.textContent = SW.music.displayKey(key);
    el.style.setProperty('--kc', SW.music.keySignatureColors[key] || 'var(--accent)');
  }

  /* ---------------- opening ---------------- */
  function loadSongById(songId, options) {
    const library = getStoredLibrary();
    let song = library[songId];
    if (!song && isDefaultId(songId)) {
      song = defaultRecord(songId);
      library[songId] = song;
      saveStoredLibrary(library);
    }
    if (!song) return false;
    const rec = normalizeSong(song, songId);
    currentSongId = songId;
    currentSongTitle = rec.title;
    persistActiveId();
    /* Its own Layout Settings first, so the page is drawn with its rules:
       a shared piece's for this piece only, locked; your own become the
       ones in use. Nothing in a lesson. The policy pass runs from there
       whenever that changes what is out. */
    SW.settings.usePieceLayout(rec.layout, !!rec.received);
    SW.score.render(rec.score);
    // A lesson keeps itself whatever its songs carry; outside one, a shared
    // song is never auto-saved.
    openedReceived = !!rec.received && !(SW.lessons && SW.lessons.meta());
    openedBook = openedReceived && rec.book ? String(rec.book) : '';
    autoSave = !!(options && options.autoSave) && !openedReceived;
    markSaved();
    updateSongChip();
    SW.bus.emit('song:opened', { id: songId, title: rec.title });
    return true;
  }

  function freshSandbox(seedText) {
    return normalizeSong({ id: SANDBOX_ID, title: SANDBOX_TITLE, content: seedText || NEW_SONG_TEXT, isCustom: true, createdAt: Date.now() });
  }
  /* The very first sandbox starts with Twinkle in it, so a first visit is
     not a blank page; Clear gives 1.0's "Start Here". */
  function ensureSandbox() {
    const library = getStoredLibrary();
    if (!library[SANDBOX_ID]) {
      const seed = (typeof PRELOADED_SONGS !== 'undefined' && PRELOADED_SONGS.twinkle) || NEW_SONG_TEXT;
      library[SANDBOX_ID] = freshSandbox(seed);
      saveStoredLibrary(library);
    }
    return SANDBOX_ID;
  }
  function clearSandbox() {
    const library = getStoredLibrary();
    library[SANDBOX_ID] = freshSandbox();
    saveStoredLibrary(library);
    if (isSandboxId(currentSongId)) loadSongById(SANDBOX_ID);
  }

  /* ---------------- new / save as ---------------- */
  const newSongModal = $('newSongModal');
  const newSongTitleInput = $('newSongTitleInput');
  const confirmNewSongBtn = $('confirmNewSongBtn');

  /* The family's name window, with *song*: New, Save as (three ways),
     and Rename (never a browser prompt). */
  let renameId = null;
  function showNewSongModal(intent, id) {
    titlePromptIntent = intent || 'new';
    renameId = titlePromptIntent === 'rename' ? id : null;
    const heading = $('newSongModalHeading'), sub = $('newSongModalSubtext');
    const lesson = SW.lessons && SW.lessons.meta();
    if (titlePromptIntent === 'rename') {
      const rec = getStoredLibrary()[id];
      heading.textContent = 'Rename';
      sub.textContent = 'A new name for this song.';
      confirmNewSongBtn.textContent = 'Rename';
      newSongTitleInput.value = rec ? normalizeSong(rec, id).title : '';
    } else if (titlePromptIntent === 'saveAs' && isSandboxId(currentSongId)) {
      heading.textContent = 'Save to your library';
      sub.textContent = 'Your sandbox stays as it is. This adds a copy to your library as a new song, and you carry on in that copy.';
      confirmNewSongBtn.textContent = 'Save to library';
      newSongTitleInput.value = '';
    } else if (titlePromptIntent === 'saveAs' && openedReceived) {
      heading.textContent = 'Save my copy';
      sub.textContent = 'The shared song stays as it was sent, so you can always go back to it. Your copy is yours to change, and you carry on in it.';
      confirmNewSongBtn.textContent = 'Save my copy';
      newSongTitleInput.value = `${currentSongTitle || 'Untitled'} (my copy)`;
    } else if (titlePromptIntent === 'saveAs') {
      heading.textContent = 'Save as…';
      sub.textContent = 'This keeps the original and starts a new song from where you are.';
      confirmNewSongBtn.textContent = 'Save';
      newSongTitleInput.value = `${currentSongTitle || 'Untitled'} copy`;
    } else {
      heading.textContent = 'Create a new song';
      sub.textContent = lesson
        ? 'Give it a name so you can find it later.'
        : 'Give it a name so you can find it later, or leave it blank for a fresh page in your sandbox.';
      confirmNewSongBtn.textContent = 'Create';
      newSongTitleInput.value = '';
    }
    newSongTitleInput.classList.remove('input-error');
    ui.openSheet('newSongModal');
    setTimeout(() => { newSongTitleInput.focus(); newSongTitleInput.select(); }, 60);
  }
  function hideNewSongModal() {
    ui.closeSheet('newSongModal');
    newSongTitleInput.value = '';
    renameId = null;
  }
  function rejectEmptyTitle() {
    newSongTitleInput.classList.add('input-error');
    newSongTitleInput.focus();
    const sheet = newSongModal.querySelector('.sheet');
    sheet.classList.remove('shake');
    void sheet.offsetWidth;
    sheet.classList.add('shake');
  }

  function renameSong(id, title) {
    const trimmed = (title && title.trim()) ? title.trim().slice(0, 60) : '';
    if (!trimmed) { rejectEmptyTitle(); return; }
    const lib = getStoredLibrary();
    if (!lib[id]) { hideNewSongModal(); return; }
    if (id === currentSongId) save();
    lib[id].title = trimmed;
    lib[id].updatedAt = Date.now();
    saveStoredLibrary(lib);
    if (id === currentSongId) { currentSongTitle = trimmed; updateSongChip(); }
    hideNewSongModal();
    renderLibrarySongList();
    ui.toast('Renamed “' + trimmed + '”');
  }

  /* 1.0: a new song opens straight into Edit mode. */
  function createNewSong(title) {
    const trimmed = (title && title.trim()) ? title.trim() : '';
    const lesson = SW.lessons && SW.lessons.meta();
    if (!trimmed && lesson) { rejectEmptyTitle(); return; }
    if (!okToLeave('makes the new song')) return;
    save();
    /* A blank name: a fresh page in the sandbox (the family's rule). */
    if (!trimmed) {
      clearSandbox();
      if (!isSandboxId(currentSongId)) loadSongById(SANDBOX_ID);
      hideNewSongModal();
      ui.closeSheet('library-sheet');
      SW.score.setEditing(true);
      ui.toast('A blank page in your sandbox');
      return;
    }
    const id = EVM.newId('song');
    const library = getStoredLibrary();
    const now = Date.now();
    const record = { id, title: trimmed, content: NEW_SONG_TEXT, isCustom: true, createdAt: now, updatedAt: now };
    /* A new piece starts from your own settings — not a shared piece's,
       which were for that piece only (usePieceLayout with nothing brings
       yours back). */
    if (!(SW.lessons && SW.lessons.meta())) {
      SW.settings.usePieceLayout(null, false);
      record.layout = SW.settings.layoutSnapshot();
    }
    library[id] = normalizeSong(record);
    saveStoredLibrary(library);
    hideNewSongModal();
    ui.closeSheet('library-sheet');
    loadSongById(id, { autoSave: true });
    SW.score.setEditing(true);
    ui.toast('New song created');
  }

  function saveCurrentSongAs(title) {
    const trimmed = (title && title.trim()) ? title.trim() : '';
    if (!trimmed) { rejectEmptyTitle(); return; }
    save();   // the original — or the sandbox — keeps what is on screen
                // (a shared song is not saved into: it stays as it was sent)
    const from = currentSongId;
    const id = EVM.newId('song');
    const library = getStoredLibrary();
    const now = Date.now();
    const record = { id, title: trimmed, score: SW.score.read(), isCustom: true, createdAt: now, updatedAt: now };
    // the settings on screen travel with the copy — a shared piece's too, unlocked now it is theirs
    if (!(SW.lessons && SW.lessons.meta())) record.layout = SW.settings.layoutSnapshot();
    // The way back to what it was made from — a shared song, most often.
    // No `book`: a copy is the student's own, and stays when the book goes back.
    if (from && !isSandboxId(from)) record.derivedFrom = from;
    library[id] = record;
    saveStoredLibrary(library);
    hideNewSongModal();
    ui.closeSheet('library-sheet');
    const editing = S.editing;
    loadSongById(id, { autoSave: true });
    if (editing) SW.score.setEditing(true);
    ui.toast('Saved as “' + trimmed + '”');
  }

  /* ---------------- the Library window ---------------- */
  const SANDBOX_ICON = '<path d="M3 21h18"/><path d="M5 21V10l7-5 7 5v11"/>';
  const SONGS_ICON = '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>';
  const SHARED_ICON = '<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>';
  const EXAMPLES_ICON = '<path d="M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 17.8 5.7 21.2 7 14.2 2 9.4l7-.9z"/>';

  function groupHead(icon, label) {
    const head = document.createElement('div');
    head.className = 'library-group-head';
    head.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span class="library-group-title"></span><span class="library-group-rule"></span>`;
    head.querySelector('.library-group-title').textContent = label;
    return head;
  }
  function actionBtn(cls, text, title, onClick) {
    const b = document.createElement('button');
    b.className = 'lib-action-btn' + (cls ? ' ' + cls : '');
    b.innerHTML = text;
    if (title) { b.title = title; b.setAttribute('aria-label', title); }
    if (onClick) b.addEventListener('click', onClick);
    return b;
  }
  /* A quiet line under each title: "4/4 · 100 BPM · 3 lines" (Ostinato
     Builder's pattern). */
  function subline(score) {
    const n = (score.lines || []).length;
    return (score.meter || SW.meters.DEFAULT) + ' · ' + (score.bpm || SW.meters.DEFAULT_BPM) + ' BPM · ' + n + (n === 1 ? ' line' : ' lines');
  }

  function openFromLibrary(id) {
    if (!okToLeave('opens the other song')) return;
    save();
    loadSongById(id);
    ui.closeSheet('library-sheet');
  }

  function buildSandboxRow() {
    const isCurrent = isSandboxId(currentSongId);
    const song = getStoredLibrary()[SANDBOX_ID];
    const row = document.createElement('div');
    row.className = 'library-song-item sandbox-item' + (isCurrent ? ' active-song' : '');
    const badge = document.createElement('span');
    badge.className = 'key-badge';
    paintBadge(badge, song ? normalizeSong(song).score.key : 'C');
    const text = document.createElement('span');
    text.className = 'library-song-title';
    text.innerHTML = 'Sandbox<small>Scratch work — not in your library</small>';
    const actions = document.createElement('div');
    actions.className = 'library-song-actions';
    if (isCurrent) {
      const b = actionBtn('is-active', 'Open now');
      b.disabled = true;
      actions.appendChild(b);
    } else {
      actions.appendChild(actionBtn('load-btn', 'Open', 'Open the sandbox', () => openFromLibrary(ensureSandbox())));
    }
    actions.appendChild(actionBtn('', 'Clear', 'Start the sandbox over with a blank page', () => {
      if (!confirm('Clear the sandbox and start with a blank page? This cannot be undone.')) return;
      clearSandbox();
      renderLibrarySongList();
      ui.toast('Sandbox cleared');
    }));
    row.appendChild(badge);
    row.appendChild(text);
    row.appendChild(actions);
    return row;
  }

  function buildSongRow(id, song) {
    const isCurrent = id === currentSongId;
    const rec = normalizeSong(song, id);
    const row = document.createElement('div');
    row.className = 'library-song-item' + (isCurrent ? ' active-song' : '');
    const badge = document.createElement('span');
    badge.className = 'key-badge';
    paintBadge(badge, rec.score.key);
    const titleSpan = document.createElement('span');
    titleSpan.className = 'library-song-title';
    titleSpan.textContent = rec.title;
    if (rec.received && !isShelfSong(rec)) {
      const tag = document.createElement('span');
      tag.className = 'shared-tag';
      tag.textContent = 'Shared';
      tag.title = 'Shared with you: it stays as it was sent. Save as… keeps your own copy.';
      titleSpan.appendChild(tag);
    }
    const small = document.createElement('small');
    small.textContent = subline(rec.score);
    titleSpan.appendChild(small);
    const actions = document.createElement('div');
    actions.className = 'library-song-actions';

    if (isCurrent && !autoSaveOn()) {
      actions.appendChild(actionBtn('load-btn', 'Reopen', 'Open the saved version again, losing the changes on screen', () => {
        if (hasUnsavedChanges() && !confirm('Reopen “' + rec.title + '” as it was saved?\n\nThe changes you have made since opening it are lost.')) return;
        loadSongById(id);
        ui.closeSheet('library-sheet');
        ui.toast('Reopened as saved');
      }));
    } else if (isCurrent) {
      const b = actionBtn('is-active', 'Open now');
      b.disabled = true;
      actions.appendChild(b);
    } else {
      actions.appendChild(actionBtn('load-btn', 'Open', 'Open “' + rec.title + '”', () => openFromLibrary(id)));
    }

    const lesson = SW.lessons && SW.lessons.meta();
    if (lesson) {
      actions.appendChild(actionBtn('', 'Start again', 'Put this exercise back the way your teacher sent it', () => {
        if (!confirm('Put “' + rec.title + '” back the way your teacher sent it?')) return;
        if (SW.lessons.restoreSong(id)) { renderLibrarySongList(); ui.toast('Back to the original'); }
      }));
    } else {
      // A shared song keeps the name it was sent with; a copy can be renamed.
      if (!rec.received) actions.appendChild(actionBtn('', 'Rename', 'Give “' + rec.title + '” a new name', () => showNewSongModal('rename', id)));
      /* A song from a book leaves with its book (Put back): deleted on its
         own it would only come back at the next visit while the book is out. */
      if (!isShelfSong(rec)) actions.appendChild(actionBtn('delete-btn-item', '&times;', 'Delete “' + rec.title + '”', () => {
        if (!confirm('Delete “' + rec.title + '”?')) return;
        const lib = getStoredLibrary();
        delete lib[id];
        saveStoredLibrary(lib);
        // deleting the song on screen drops you into the sandbox
        if (id === currentSongId) loadSongById(ensureSandbox());
        renderLibrarySongList();
        ui.toast('Deleted “' + rec.title + '”');
      }));
    }
    row.appendChild(badge);
    row.appendChild(titleSpan);
    row.appendChild(actions);
    return row;
  }

  /* ------------------------------------------------------------------
     BOOKS FROM THE TEACHER LIBRARY (lib/evm-shelf.js)

     A book taken off the shelf puts its songs in the library as shared
     songs marked with `book`. They are listed under their book, above the
     student's own, with the way to put the book back. Putting it back
     removes them; a Save my copy of one is the student's own and stays.
     ------------------------------------------------------------------ */
  const BOOK_ICON = '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>';
  const isShelfSong = rec => !!(window.EVMShelf && EVMShelf.isShelfSong(rec));

  function renderBookGroups(list, library, ids) {
    const byBook = {};
    ids.forEach(id => {
      const rec = library[id];
      if (isShelfSong(rec)) (byBook[rec.book] = byBook[rec.book] || []).push(id);
    });
    Object.keys(byBook).sort((a, b) => a.localeCompare(b)).forEach(book => {
      const group = document.createElement('section');
      group.className = 'library-group library-group-book';
      const head = groupHead(BOOK_ICON, '');
      // the book's name is the teacher's text: set it, never parse it
      head.querySelector('.library-group-title').textContent = book;
      const back = document.createElement('button');
      back.className = 'evm-book-head-btn';
      back.textContent = 'Put back';
      back.title = 'Put this book back on the Teacher Library shelf';
      back.addEventListener('click', () => EVMShelf.putBack(book));
      head.appendChild(back);
      group.appendChild(head);
      byBook[book]
        .sort((a, b) => String(library[a].title).localeCompare(String(library[b].title)))
        .forEach(id => group.appendChild(buildSongRow(id, library[id])));
      list.appendChild(group);
    });
  }

  /* After the shelf filed or removed songs: move off anything that left,
     show a newer version of the song on screen, and redraw. */
  function shelfChanged(summary) {
    const library = getStoredLibrary();
    if (currentSongId && !library[currentSongId]) loadSongById(ensureSandbox());
    else if (currentSongId && openedReceived && summary.updated.indexOf(currentSongId) !== -1) loadSongById(currentSongId);
    renderLibrarySongList();
    updateSongChip();
    const n = summary.added.length, up = summary.updated.length, gone = summary.removed.length;
    if (n) ui.toast(n === 1 ? 'A song from your books is in your library' : n + ' songs from your books are in your library');
    else if (up) ui.toast(up === 1 ? 'Your teacher updated a song in your books' : 'Your teacher updated ' + up + ' songs in your books');
    else if (gone) ui.toast(gone === 1 ? 'A song from your books left your library' : gone + ' songs from your books left your library');
  }

  /* Sandbox · one group per Teacher Library book · Shared with you · Your
     songs · Examples (DECISIONS D18). In a lesson: Exercises only. */
  function renderLibrarySongList() {
    const list = $('librarySongList');
    if (!list) return;
    const library = getStoredLibrary();
    const lesson = SW.lessons && SW.lessons.meta();
    list.innerHTML = '';
    const group = (cls, icon, label, ids, empty) => {
      if (!ids.length && !empty) return;
      const g = document.createElement('section');
      g.className = 'library-group ' + cls;
      g.appendChild(groupHead(icon, label));
      if (!ids.length) {
        const e = document.createElement('div');
        e.className = 'library-empty';
        e.textContent = empty;
        g.appendChild(e);
      }
      ids.forEach(id => g.appendChild(buildSongRow(id, library[id])));
      list.appendChild(g);
    };
    let ids = getSortedSongIds(library);
    if (lesson) {
      group('library-group-songs', SONGS_ICON, 'Exercises', ids, 'No exercises here.');
      return;
    }
    const g = document.createElement('section');
    g.className = 'library-group library-group-sandbox';
    g.appendChild(groupHead(SANDBOX_ICON, 'Sandbox'));
    g.appendChild(buildSandboxRow());
    list.appendChild(g);
    // songs from a book are listed under their book, above the student's own
    renderBookGroups(list, library, ids);
    ids = ids.filter(id => !isShelfSong(library[id]));
    const shared = ids.filter(id => library[id].received);
    const examples = ids.filter(id => isDefaultId(id) && !library[id].isCustom);
    const own = ids.filter(id => shared.indexOf(id) === -1 && examples.indexOf(id) === -1);
    group('library-group-shared', SHARED_ICON, 'Shared with you', shared);
    group('library-group-songs', SONGS_ICON, 'Your songs', own, 'No songs yet — press New song to make one.');
    group('library-group-examples', EXAMPLES_ICON, 'Examples', examples);
  }

  function showManageLibraryModal() {
    const lesson = SW.lessons && SW.lessons.meta();
    $('library-sheet-title').textContent = lesson ? lesson.title : 'Library';
    save();
    updateSongChip();
    const box = $('picture-colours');
    if (box) box.checked = SW.settings.view.colourPictures !== false;
    renderLibrarySongList();
    ui.openSheet('library-sheet');
  }

  /* ---------------- share by link ---------------- */
  /* In the HASH (#song=), as lesson links are: the part after # never
     leaves the browser, so a long song cannot make the address too long
     for the server. As ?song= (until 2026-09-28) a song past ~8 KB of
     address got GitHub Pages' "URI too long" page and never reached the
     app. Both forms are read. */
  function shareLinkFor(data) {
    return window.location.origin + window.location.pathname + '#song=' + encodeURIComponent(ui.encodeJson(data));
  }
  function offerLink(link, input, row, textEl, feedbackEl) {
    if (input) input.value = link;
    if (row) row.hidden = false;
    ui.copyText(link).then(ok => {
      if (ok) {
        if (textEl) textEl.textContent = 'Copied';
        if (feedbackEl) feedbackEl.textContent = 'Link copied to your clipboard.';
        setTimeout(() => { if (textEl) textEl.textContent = 'Copy'; }, 2500);
      } else if (input) {
        input.focus();
        input.select();
        if (feedbackEl) feedbackEl.textContent = 'Select and copy the link above.';
      }
    });
  }
  function handleShareCurrentSong() {
    save();
    const data = { v: 2, title: currentSongTitle || 'Shared Song', score: SW.score.read() };
    /* The song's own id and dates travel with it, so opening the link
       again finds the copy already filed instead of adding another, and a
       newer version replaces an older one. Only when the link holds what
       is saved under that id (see EVM.shareHeader). */
    if (isSandboxId(currentSongId)) { data.sandbox = true; data.title = SANDBOX_TITLE; }
    else Object.assign(data, EVM.shareHeader(
      getStoredLibrary()[currentSongId], rawSongKey, rawSongKey({ score: data.score })));
    const lock = $('lock-layout-on-share');
    if (lock && lock.checked && SW.settings) {
      data.layout = SW.settings.layoutSnapshot();
      data.layoutLocked = true;
    }
    offerLink(shareLinkFor(data), $('shareLinkInput'), $('shareLinkContainer'), $('copyShareLinkBtnText'), $('shareLinkFeedback'));
  }

  /* 2.0 links use #song= (since 2026-09-28; ?song= before, as Rhythm
     Poetry's do); 1.0's used #song= too and carried { title, content }.
     All are read. */
  function checkUrlForSharedSong() {
    let raw = null;
    if (window.location.hash) {
      const hp = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      if (hp.has('song')) raw = hp.get('song');
    }
    if (!raw) {
      const qp = new URLSearchParams(window.location.search);
      if (qp.has('song')) raw = qp.get('song');
    }
    if (!raw) return null;
    const data = ui.decodeJson(raw);
    return (data && (data.score || data.content || data.title)) ? data : null;
  }

  /* A song from a link or a file, ready for EVM.file: the score
     normalized, the sender's id and dates kept — and left out when there
     are none. A 1.0 link ({ title, content }) or a record with no id loses
     the placeholder id, so it is matched by content; a record with no
     updatedAt keeps none, so EVM.file never takes "now" for a stamp and
     writes it over a song that is here. */
  function incomingSong(src, fallbackTitle) {
    const title = (typeof src.title === 'string' && src.title.trim()) ? src.title : fallbackTitle;
    const rec = normalizeSong({ ...src, id: src.id || 'incoming', title, isCustom: true });
    if (!src.id || isSandboxId(src.id)) delete rec.id;
    if (!src.createdAt) delete rec.createdAt;
    if (!src.updatedAt) delete rec.updatedAt;
    return rec;
  }

  /* Each part lands where it came from: a sandbox link overwrites the
     receiver's sandbox (it is scratch work — that is what the sandbox is
     for); anything else goes into the library as a shared song — once.

     A page embedded in a Google Site opens with its link every time it is
     visited, so filing it is not "add a song" but "make sure it is here":
     the same id, or (for links made before ids travelled) the same
     content, finds the copy already filed. A newer version of it replaces
     the old one. A blank song is not filed at all. See EVM.file in
     lib/evm-library.js.

     Returns { action, id }: action is 'sandbox', or EVM.file's — 'added',
     'same', 'matched', 'updated', 'kept' or 'blank' (id null). */
  function offerSharedSong(data) {
    const library = getStoredLibrary();
    let result;
    if (data.sandbox) {
      const id = SANDBOX_ID;
      library[id] = normalizeSong({ ...data, id, title: SANDBOX_TITLE, isCustom: true, createdAt: Date.now() }, id);
      result = { action: 'sandbox', id };
    } else {
      result = EVM.file(library, incomingSong(data, 'Shared Song'), fileOpts(true));
    }
    if (result.id) saveStoredLibrary(library);
    if (data.layout && SW.settings) SW.settings.applyLayoutSnapshot(data.layout, !!data.layoutLocked);
    try { window.history.replaceState(null, document.title, window.location.pathname); } catch (e) {}
    return result;
  }

  /* ---------------- backup ---------------- */
  function showImportExportModal() {
    save();
    $('uploadStatusMsg').textContent = '';
    $('uploadStatusMsg').className = 'status-msg';
    $('shareLinkContainer').hidden = true;
    $('shareLinkFeedback').textContent = '';
    const clean = (currentSongTitle || 'song-library').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    $('exportFilenameInput').value = clean ? `${clean}-backup` : 'song-library-backup';
    renderExportSongList();
    ui.openSheet('importExportModal');
  }

  function renderExportSongList() {
    const list = $('exportSongList');
    const library = getStoredLibrary();
    list.innerHTML = '';
    const ids = getSortedSongIds(library);
    if (!ids.length) {
      list.innerHTML = '<div class="library-empty">No songs available to export.</div>';
      return;
    }
    ids.forEach(id => {
      const rec = normalizeSong(library[id], id);
      const label = document.createElement('label');
      label.className = 'export-song-item';
      label.innerHTML = '<input type="checkbox" checked><div class="export-song-item-info"><span class="key-badge"></span><span class="export-song-title"></span></div>';
      label.querySelector('input').value = id;
      label.querySelector('.key-badge').textContent = SW.music.displayKey(rec.score.key);
      label.querySelector('.export-song-title').textContent = rec.title;
      list.appendChild(label);
    });
  }

  function handleExportDownload() {
    const library = getStoredLibrary();
    const checked = $('exportSongList').querySelectorAll('input[type="checkbox"]:checked');
    if (!checked.length) { ui.toast('Tick at least one song to download'); return; }
    const songs = [];
    checked.forEach(cb => { if (library[cb.value]) songs.push(normalizeSong(library[cb.value], cb.value)); });
    const exportData = {
      app: 'Eagle View Music Song Writer 2.0',   // unchanged: older readers look for it
      version: 2,
      exportedAt: new Date().toISOString(),
      count: songs.length,
      songs
    };
    let filename = $('exportFilenameInput').value.trim() || 'song-library-backup';
    if (!filename.endsWith('.json')) filename += '.json';
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    ui.toast('Backup saved to your downloads');
  }

  /* Accepts a 2.0 backup, a 1.0 backup, a bare array, or 1.0's raw
     { id: {title, content} } library object. */
  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const status = $('uploadStatusMsg');
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const json = JSON.parse(e.target.result);
        /* A backup, an old export, a raw library, or a Librarian file —
           see EVM.readItems. */
        const imported = EVM.readItems(json, {
          app: 'song-writer',
          looksLike: v => !!(v.content || v.score)
        }).filter(song => song && (song.content || song.score || song.title));
        if (!imported.length) {
          status.textContent = 'No valid songs found in file.';
          status.className = 'status-msg error';
          return;
        }
        /* Songs keep their ids and dates, so importing the same file twice
           adds nothing, and a newer copy of a song replaces the older one.
           A file keeps each song as it was there — yours stay yours, shared
           ones stay shared. Blank songs are left out. */
        const library = getStoredLibrary();
        const counts = { added: 0, updated: 0, same: 0, matched: 0, kept: 0, blank: 0 };
        imported.forEach(song => {
          const result = EVM.file(library, incomingSong(song, 'Imported Song'), fileOpts(false));
          counts[result.action] = (counts[result.action] || 0) + 1;
        });
        const parts = [];
        if (counts.added) parts.push(`added ${counts.added}`);
        if (counts.updated) parts.push(`updated ${counts.updated}`);
        if (counts.same + counts.matched) parts.push(`${counts.same + counts.matched} already here`);
        if (counts.kept) parts.push(`kept your newer copy of ${counts.kept}`);
        if (counts.blank) parts.push(`skipped ${counts.blank} blank`);
        saveStoredLibrary(library);
        renderExportSongList();
        renderLibrarySongList();
        const said = parts.join(', ');
        status.textContent = '✓ ' + said.charAt(0).toUpperCase() + said.slice(1) + '.';
        status.className = 'status-msg';
        $('jsonFileInput').value = '';
      } catch (err) {
        console.error('Error parsing JSON file:', err);
        status.textContent = 'Invalid JSON file format.';
        status.className = 'status-msg error';
      }
    };
    reader.readAsText(file);
  }

  function handleResetAllUserData() {
    if (!confirm('Delete every song you have made and put Song Writer back to how it started? This cannot be undone.')) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_ID_KEY);
      localStorage.removeItem('song_writer_25_skip_delete_section_confirm');
      if (SW.settings) SW.settings.resetLayout();
      currentSongId = null;
      // a fresh library, without bringing 1.0's songs across a second time
      const lib = defaultLibrary();
      lib[SANDBOX_ID] = freshSandbox();
      saveStoredLibrary(lib);
      loadSongById(SANDBOX_ID);
      renderLibrarySongList();
      renderExportSongList();
      const msg = $('resetStatusMsg');
      msg.textContent = '✓ Songs and layout settings restored to defaults!';
      msg.className = 'status-msg';
      setTimeout(() => { msg.textContent = ''; ui.closeSheet('importExportModal'); }, 1200);
    } catch (err) {
      console.error('Error resetting user data:', err);
      $('resetStatusMsg').textContent = 'Failed to reset user data.';
      $('resetStatusMsg').className = 'status-msg error';
    }
  }

  /* ---------------- Save picture ----------------
     The family's name and camera, keeping both halves of 1.0/2.0 and the
     family (DECISIONS D13): the picture is saved to the downloads as a
     JPEG, and — where the browser allows — also copied, ready to paste
     into slides. The capture shows the music, not the tools: the whole
     edit layer and the selection glow are hidden (body.capturing), and
     the section colours stay only if the Library's check box says so. */
  async function copyCanvasToClipboard(canvas) {
    if (!navigator.clipboard || !window.ClipboardItem) return false;
    try {
      return await new Promise(resolve => {
        canvas.toBlob(async blob => {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            resolve(true);
          } catch (err) {
            resolve(false);
          }
        }, 'image/png');
      });
    } catch (err) {
      return false;
    }
  }
  async function captureVisual() {
    const btn = $('copyVisualBtn');
    const label = $('copyVisualLabel');
    if (typeof html2canvas === 'undefined') { ui.toast('The picture tool did not load — check the connection'); return; }
    const target = $('score');
    try {
      document.body.classList.add('capturing');
      document.body.classList.toggle('capture-colour', SW.settings.view.colourPictures !== false);
      if (btn) btn.disabled = true;
      if (label) label.textContent = 'Saving…';
      SW.staff.render();                     // without the selection ring
      if (SW.ctrack) { SW.ctrack.draw(); SW.ctrack.capture(true); }   // the chords after the melody, into the picture
      await new Promise(r => setTimeout(r, 120));
      const canvas = await html2canvas(target, {
        backgroundColor: '#FFFFFF', scale: 2, useCORS: true, allowTaint: true, logging: false,
        ignoreElements: el => !!(el.classList && el.classList.contains('head-tool'))
      });
      const name = (isSandboxId(currentSongId) ? 'sandbox' : (currentSongTitle || 'song')).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'song';
      const a = document.createElement('a');
      a.download = name + '.jpg';
      a.href = canvas.toDataURL('image/jpeg', 0.95);
      document.body.appendChild(a);
      a.click();
      a.remove();
      const copied = await copyCanvasToClipboard(canvas);
      ui.toast(copied ? 'Picture saved to your downloads — and copied, ready to paste' : 'Picture saved to your downloads');
    } catch (error) {
      console.error('Failed to capture the picture:', error);
      ui.toast('Could not save the picture');
    } finally {
      document.body.classList.remove('capturing', 'capture-colour');
      if (SW.ctrack) { SW.ctrack.capture(false); SW.ctrack.draw(); }
      if (btn) btn.disabled = false;
      if (label) label.textContent = 'Save picture';
      SW.staff.render();
    }
  }

  /* ---------------- boot ---------------- */
  function boot() {
    openFirstSong();
    startShelf();
  }

  function openFirstSong() {
    // 1. a lesson link (#lesson=) wins over everything
    const lessonId = SW.lessons ? SW.lessons.bootFromUrl() : null;
    if (lessonId && loadSongById(lessonId)) return;
    // 2. a shared song
    /* A song from a link is filed as shared, which never auto-saves (and
       one that turns out to be already here as the person's own song
       opens like any library song, auto-save off); a sandbox link keeps
       itself as a sandbox always does. A blank link files nothing and
       falls through to the song from last visit. */
    const shared = checkUrlForSharedSong();
    if (shared) {
      const filed = offerSharedSong(shared);
      const t = filed.id ? ((getStoredLibrary()[filed.id] || {}).title || 'the song') : '';
      const said = {
        sandbox: 'A shared sandbox opened',
        added: 'Added “' + t + '” to your library',
        same: 'Opened “' + t + '” from your library',
        matched: 'Opened “' + t + '” from your library',
        updated: 'Updated “' + t + '” to the newest version',
        kept: 'Opened “' + t + '” — you already have a newer version',
        blank: 'That link holds an empty song, so nothing was added'
      }[filed.action];
      if (said) ui.toast(said);
      if (filed.id && loadSongById(filed.id)) return;
    }
    // 3. last visit, or the sandbox
    const library = getStoredLibrary();
    let id = null;
    try { id = localStorage.getItem(ACTIVE_ID_KEY); } catch (e) {}
    if (!id || !library[id]) id = ensureSandbox();
    loadSongById(id);
  }

  /* The Teacher Library shelf: books out are kept in step every visit (new
     songs arrive, put-back and deleted ones leave). Not in a lesson, whose
     library is the lesson. boot() runs it once a song is on screen. A
     Librarian envelope's data holds `score` (2.0) or only `content` (1.0
     text); normalizeSong takes either. */
  function startShelf() {
    if (!window.EVMShelf) return;
    EVMShelf.init({
      app: 'song-writer',
      disabled: !!(SW.lessons && SW.lessons.meta()),
      load: getStoredLibrary,
      save: saveStoredLibrary,
      incoming: rec => normalizeSong({ ...rec }, rec.id),
      key: songKey,
      changed: shelfChanged,
      openSong: id => {
        if (!okToLeave('opens the other song')) return;
        save();
        loadSongById(id);
        ui.closeSheet('library-sheet');
      }
    });
    EVMShelf.sync();
  }

  function init() {
    $('song-chip').addEventListener('click', showManageLibraryModal);
    if (autoSaveToggle) autoSaveToggle.addEventListener('click', () => setAutoSave(!autoSaveOn()));
    $('sandbox-clear-btn').addEventListener('click', () => {
      if (!isSandboxId(currentSongId)) return;
      if (!confirm('Clear the sandbox and start with a blank page? This cannot be undone.')) return;
      clearSandbox();
      ui.toast('Sandbox cleared');
    });
    $('newSongBtn').addEventListener('click', () => showNewSongModal('new'));
    $('saveAsBtn').addEventListener('click', () => showNewSongModal('saveAs'));
    $('shelfBtn').addEventListener('click', () => window.EVMShelf && EVMShelf.openSheet());
    confirmNewSongBtn.addEventListener('click', () => {
      if (titlePromptIntent === 'saveAs') saveCurrentSongAs(newSongTitleInput.value);
      else if (titlePromptIntent === 'rename') renameSong(renameId, newSongTitleInput.value);
      else createNewSong(newSongTitleInput.value);
    });
    newSongTitleInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); confirmNewSongBtn.click(); }
      else if (e.key === 'Escape') { e.stopPropagation(); hideNewSongModal(); }
    });
    const pictureColours = $('picture-colours');
    if (pictureColours) pictureColours.addEventListener('change', () => SW.settings.setView({ colourPictures: pictureColours.checked }, { quiet: true }));
    newSongTitleInput.addEventListener('input', () => newSongTitleInput.classList.remove('input-error'));

    $('importExportBtn').addEventListener('click', () => { ui.closeSheet('library-sheet'); showImportExportModal(); });
    $('generateShareLinkBtn').addEventListener('click', handleShareCurrentSong);
    $('copyShareLinkBtn').addEventListener('click', () => {
      const input = $('shareLinkInput');
      if (input.value) offerLink(input.value, input, null, $('copyShareLinkBtnText'), $('shareLinkFeedback'));
    });
    $('selectAllExportBtn').addEventListener('click', () => $('exportSongList').querySelectorAll('input').forEach(cb => { cb.checked = true; }));
    $('deselectAllExportBtn').addEventListener('click', () => $('exportSongList').querySelectorAll('input').forEach(cb => { cb.checked = false; }));
    $('confirmExportBtn').addEventListener('click', handleExportDownload);
    $('uploadJsonBtn').addEventListener('click', () => $('jsonFileInput').click());
    $('jsonFileInput').addEventListener('change', handleFileUpload);
    $('resetAllDataBtn').addEventListener('click', handleResetAllUserData);
    $('copyVisualBtn').addEventListener('click', captureVisual);
    // the name opens About, at every width (1.0's rule)
    $('appTitleLink').addEventListener('click', () => ui.openSheet('aboutModal'));

    // the key belongs to the song
    SW.bus.on('key:changed', () => { updateSongChip(); });

    // 1.0 links and lesson links live in the hash; pasting one into the
    // address bar of an open app changes only the hash, so re-boot
    window.addEventListener('hashchange', () => {
      const h = window.location.hash;
      if (/[#&](song|lesson)=/.test(h)) { save(); window.location.reload(); }
    });

    // flush on the way out (gated like every other save) — and ask the
    // browser to check first when there are changes nobody is saving
    window.addEventListener('beforeunload', e => {
      save();
      if (hasUnsavedChanges()) { e.preventDefault(); e.returnValue = ''; }
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
  }

  SW.library = {
    init, boot, save,
    getStoredLibrary, saveStoredLibrary, getSortedSongIds, normalizeSong,
    loadSongById, ensureSandbox, renderLibrarySongList, updateSongChip,
    showManageLibraryModal, offerLink, shareLinkFor, hasUnsavedChanges, okToLeave,
    currentId: () => currentSongId,
    currentTitle: () => currentSongTitle,
    isSandboxId, isDefaultId, SANDBOX_ID
  };
})();

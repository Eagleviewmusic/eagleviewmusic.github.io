/* ==========================================================================
   Song Writer — lessons.js
   --------------------------------------------------------------------------
   "Set up for students", ported from Rhythm Poetry 2.0's LESSONS and SET
   UP FOR STUDENTS sections. Two halves that never meet:

   • the SHELL — settings.js's applyPolicyToShell() puts the chrome into
     whatever state the policy asks for, so no control has to remember it
     is in a lesson;
   • the SETUP SHEET — writes a draft policy and turns it into a link.

   The link (#lesson=, in the hash so whole songs never reach a server log)
   carries the policy, the teacher's layout and the exercises. It is
   one-way: exercises land in the student's library under
   lesson_<slug>_<i>, only if absent, so a returning student finds their
   work; the teacher's originals are kept beside them for "Start again".

   KEYS: song_writer_2_lessons_v1 (the teacher's saved lessons),
         song_writer_2_lesson_sources_v1 (pristine exercises), and in
         sessionStorage song_writer_2_open_lesson_v1 (the lesson open in
         this tab, so a reload does not end it).
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const ui = SW.ui;
  const $ = id => document.getElementById(id);

  const LESSON_KEY = 'song_writer_2_lessons_v1';
  const LESSON_SOURCE_KEY = 'song_writer_2_lesson_sources_v1';
  const OPEN_LESSON_KEY = 'song_writer_2_open_lesson_v1';   // sessionStorage
  const POLICY_VERSION = 1;

  let policy = null;        // the student task, or null outside a lesson
  let lessonMeta = null;    // { title, songIds } while a lesson is open

  /* The four tasks: which half of the song is theirs. */
  const TASK_TYPES = [
    { id: 'free',   label: 'Explore',          desc: 'The melody and the words are both theirs.',        m: false, w: false },
    { id: 'melody', label: 'Write the melody', desc: 'Your words are fixed. They find the notes.',        m: false, w: true  },
    { id: 'words',  label: 'Write the words',  desc: 'Your melody is fixed. They write words for it.',    m: true,  w: false },
    { id: 'read',   label: 'Read and sing',    desc: 'Nothing changes — for reading and performing.',    m: true,  w: true  }
  ];
  const TASK_BLURB = {
    free: 'Build whatever you like.',
    melody: 'The words are set — find a melody that fits them.',
    words: 'The melody is set — write words that fit it.',
    read: 'Read and sing this one.'
  };

  const SHELL_SWITCHES = [
    { key: 'sound',      name: 'Sound options',      desc: 'Melody, chords, steady beat, count-in and what happens at the end' },
    { key: 'view',       name: 'View options',       desc: 'Fonts, sizes, section colours and the staff' },
    { key: 'strip',      name: 'Chord strip & lane', desc: 'The Digital Accordion chords and the lane above the words (the Chords tab)' },
    { key: 'dock',       name: 'Keyboard',           desc: 'The keyboard under the song (the Keyboard tab)' },
    { key: 'sections',   name: 'Section tools',      desc: 'Moving, copying and deleting lines' },
    { key: 'textEditor', name: 'Words editor',       desc: 'Write: the words — or the whole song — as text' },
    { key: 'picture',    name: 'Save a picture',     desc: 'A picture of the song for printing' },
    { key: 'present',    name: 'Present mode',       desc: 'Big and clean, filling the screen' }
  ];

  /* Tempo, as Rhythm Poetry's lessons have it: Any · Between · Locked. */
  const TEMPO_MODES = ['any', 'range', 'locked'];

  function blankPolicy() {
    return {
      v: POLICY_VERSION,
      task: { melodyLocked: false, wordsLocked: false, note: '' },
      key: { locked: false },
      tempo: { mode: 'any', min: 60, max: 120 },
      shell: { sound: true, view: true, strip: true, dock: true, sections: true, textEditor: true, picture: true, present: true, library: 'lesson' }
    };
  }
  function normalizePolicy(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const p = blankPolicy();
    if (raw.task) {
      p.task.melodyLocked = !!raw.task.melodyLocked;
      p.task.wordsLocked = !!raw.task.wordsLocked;
      p.task.note = typeof raw.task.note === 'string' ? raw.task.note.slice(0, 160) : '';
    }
    if (raw.key) p.key.locked = !!raw.key.locked;
    // a lesson made before tempo rules reads as Any (and every new shell
    // switch as on), so it opens exactly as before
    if (raw.tempo && typeof raw.tempo === 'object') {
      const clamp = b => SW.meters.clampBpm(b);
      p.tempo.mode = TEMPO_MODES.indexOf(raw.tempo.mode) !== -1 ? raw.tempo.mode : 'any';
      let lo = clamp(raw.tempo.min !== undefined ? raw.tempo.min : 60);
      let hi = clamp(raw.tempo.max !== undefined ? raw.tempo.max : 120);
      if (lo > hi) { const t = lo; lo = hi; hi = t; }
      p.tempo.min = lo;
      p.tempo.max = hi;
    }
    if (raw.shell) {
      SHELL_SWITCHES.forEach(s => { p.shell[s.key] = raw.shell[s.key] !== false; });
      p.shell.library = raw.shell.library === 'none' ? 'none' : 'lesson';
    }
    return p;
  }

  function taskKind(p) {
    const pol = p || policy;
    if (!pol) return 'free';
    const m = pol.task.melodyLocked, w = pol.task.wordsLocked;
    return m && w ? 'read' : m ? 'words' : w ? 'melody' : 'free';
  }
  function taskBlurb() {
    if (policy && policy.task.note) return policy.task.note;
    return TASK_BLURB[taskKind()];
  }
  function shellAllows(key) { return !policy || policy.shell[key] !== false; }
  function libraryMode() { return policy ? policy.shell.library : 'full'; }

  function slugify(text) {
    return String(text || 'lesson').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32) || 'lesson';
  }
  function readSources() {
    try { return JSON.parse(localStorage.getItem(LESSON_SOURCE_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function writeSources(map) {
    try { localStorage.setItem(LESSON_SOURCE_KEY, JSON.stringify(map)); } catch (e) {}
  }

  /* ---------------- opening a lesson link ---------------- */
  function checkUrlForLesson() {
    let raw = null;
    if (window.location.hash) {
      const hp = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      if (hp.has('lesson')) raw = hp.get('lesson');
    }
    if (!raw) {
      const qp = new URLSearchParams(window.location.search);
      if (qp.has('lesson')) raw = qp.get('lesson');
    }
    if (!raw) return null;
    const payload = ui.decodeJson(raw);
    return (payload && payload.lesson) ? payload : null;
  }

  function openLesson(payload) {
    const p = normalizePolicy(payload.policy);
    if (!p) return null;
    const L = SW.library;
    const title = (payload.title && String(payload.title).trim()) || 'Lesson';
    /* Exercises are filed under ids made from the lesson, so the same
       link opened twice is not two copies. A link that carries the
       lesson's own id (every link made now) adds it, so two lessons with
       the same title never share exercises; older links keep the old ids. */
    const tag = payload.id ? '_' + String(payload.id).replace(/[^a-z0-9]/gi, '').slice(-8).toLowerCase() : '';
    const stem = 'lesson_' + slugify(title) + tag + '_';
    const library = L.getStoredLibrary();
    const sources = readSources();
    const ids = [];
    (payload.songs || []).forEach((song, i) => {
      const id = stem + i;
      const fresh = L.normalizeSong({ ...song, id, isCustom: true, createdAt: Date.now() + i }, id);
      /* the lesson's layout rules, not a piece's own — buildLessonPayload
         never sends one, and a hand-made link must not either */
      delete fresh.layout;
      sources[id] = fresh;
      if (!library[id]) library[id] = JSON.parse(JSON.stringify(fresh));
      ids.push(id);
    });
    if (!ids.length) return null;
    L.saveStoredLibrary(library);
    writeSources(sources);
    policy = p;
    lessonMeta = { title, songIds: ids };
    // the lesson brings the teacher's layout, locked
    if (payload.layout) SW.settings.applyLayoutSnapshot(payload.layout, true);
    try { window.history.replaceState(null, document.title, window.location.pathname); } catch (e) {}
    rememberOpenLesson(ids[0]);
    SW.settings.applyPolicyToShell();
    return ids[0];
  }

  /* The link's hash is cleared once the lesson is open (so a whole song
     never sits in the address bar), which used to mean a reload ended the
     lesson. The open lesson is kept for this tab in sessionStorage. */
  function rememberOpenLesson(current) {
    if (previewing || !lessonMeta) return;
    try {
      sessionStorage.setItem(OPEN_LESSON_KEY, JSON.stringify({ title: lessonMeta.title, songIds: lessonMeta.songIds, policy, current }));
    } catch (e) {}
  }
  function reopenFromSession() {
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(OPEN_LESSON_KEY) || 'null'); } catch (e) {}
    if (!saved || !Array.isArray(saved.songIds)) return null;
    const library = SW.library.getStoredLibrary();
    const ids = saved.songIds.filter(id => library[id]);
    const p = normalizePolicy(saved.policy);
    if (!ids.length || !p) return null;
    policy = p;
    lessonMeta = { title: saved.title || 'Lesson', songIds: ids };
    SW.settings.applyPolicyToShell();
    return ids.indexOf(saved.current) !== -1 ? saved.current : ids[0];
  }

  function bootFromUrl() {
    const payload = checkUrlForLesson();
    if (payload) return openLesson(payload);
    return reopenFromSession();
  }

  function restoreSong(id) {
    /* In a preview the exercises are the teacher's own songs, and nothing
       is saved: Start again simply opens the saved version again. */
    if (previewing) {
      SW.library.loadSongById(id);
      return true;
    }
    const sources = readSources();
    if (!sources[id]) return false;
    const library = SW.library.getStoredLibrary();
    library[id] = JSON.parse(JSON.stringify(sources[id]));
    SW.library.saveStoredLibrary(library);
    if (id === SW.library.currentId()) SW.library.loadSongById(id);
    return true;
  }

  /* ==================================================================
     THE SETUP SHEET
     ================================================================== */
  let draft = null;         // { id?, title, policy, songIds }
  let previewing = false;
  let previewLayoutLocked = false;

  const newDraft = () => ({ title: '', policy: blankPolicy(), songIds: [] });

  function renderTask() {
    const grid = $('lesson-task-grid');
    grid.innerHTML = '';
    const cur = taskKind(draft.policy);
    TASK_TYPES.forEach(type => {
      const card = document.createElement('button');
      card.className = 'task-card' + (cur === type.id ? ' active' : '');
      card.innerHTML = '<span class="task-card-label"></span><span class="task-card-desc"></span>';
      card.querySelector('.task-card-label').textContent = type.label;
      card.querySelector('.task-card-desc').textContent = type.desc;
      card.addEventListener('click', () => {
        draft.policy.task.melodyLocked = type.m;
        draft.policy.task.wordsLocked = type.w;
        renderSetupSheet();
      });
      grid.appendChild(card);
    });
    const note = $('lesson-task-note');
    note.placeholder = TASK_BLURB[cur];
    note.value = draft.policy.task.note || '';
  }

  function renderLayoutSummary() {
    const box = $('lesson-layout-summary');
    box.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'summary-list';
    SW.settings.layoutSummary().forEach(line => {
      const li = document.createElement('li');
      li.textContent = line;
      ul.appendChild(li);
    });
    box.appendChild(ul);
    const p = document.createElement('p');
    p.className = 'card-desc lesson-hint';
    p.innerHTML = 'These come from your <b>Layout settings</b>, and the link carries them locked.';
    const b = document.createElement('button');
    b.className = 'text-tool';
    b.textContent = 'Change them…';
    b.addEventListener('click', () => { ui.closeSheet('lesson-setup-sheet'); SW.settings.openLayoutSheet(); });
    p.appendChild(document.createTextNode(' '));
    p.appendChild(b);
    box.appendChild(p);
  }

  const TEMPO_NOTES = {
    any: 'They can set any tempo, 30–300 BPM.',
    range: 'They can set a tempo between these two. A song saved outside them starts at the nearest.',
    locked: 'Each exercise plays at the tempo it was saved with; the BPM shows as plain text.'
  };
  function renderStructure() {
    const list = $('lesson-structure');
    list.innerHTML = '';
    list.appendChild(ui.switchRow('Key stays as written', 'The key letter becomes plain text', draft.policy.key.locked, () => {
      draft.policy.key.locked = !draft.policy.key.locked;
      renderStructure();
    }));
    const t = draft.policy.tempo;
    document.querySelectorAll('#lesson-tempo-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.tempo === t.mode));
    $('lesson-tempo-range').hidden = t.mode !== 'range';
    $('lesson-tempo-min').value = t.min;
    $('lesson-tempo-max').value = t.max;
    $('lesson-tempo-note').textContent = TEMPO_NOTES[t.mode];
  }

  function renderShell() {
    const list = $('lesson-shell');
    list.innerHTML = '';
    SHELL_SWITCHES.forEach(s => {
      list.appendChild(ui.switchRow(s.name, s.desc, draft.policy.shell[s.key], () => {
        draft.policy.shell[s.key] = !draft.policy.shell[s.key];
        renderShell();
      }));
    });
    list.appendChild(ui.switchRow('Move between the exercises',
      draft.songIds.length > 1 ? 'The Library chip, holding this lesson’s ' + draft.songIds.length + ' exercises'
                               : 'The Library chip — with one exercise there is nothing to move to',
      draft.policy.shell.library !== 'none', () => {
        draft.policy.shell.library = draft.policy.shell.library === 'none' ? 'lesson' : 'none';
        renderShell();
      }));
  }

  function renderLessonSongs() {
    const list = $('lesson-song-list');
    const L = SW.library;
    const library = L.getStoredLibrary();
    list.innerHTML = '';
    const ids = L.getSortedSongIds(library);
    if (!ids.length) {
      list.innerHTML = '<div class="library-empty">No songs in your library yet.</div>';
      return;
    }
    ids.forEach(id => {
      const rec = L.normalizeSong(library[id], id);
      const label = document.createElement('label');
      label.className = 'export-song-item';
      label.innerHTML = '<input type="checkbox"><div class="export-song-item-info"><span class="key-badge"></span><span class="export-song-title"></span></div>';
      const box = label.querySelector('input');
      box.checked = draft.songIds.indexOf(id) !== -1;
      box.addEventListener('change', () => {
        const at = draft.songIds.indexOf(id);
        if (box.checked && at === -1) draft.songIds.push(id);
        else if (!box.checked && at !== -1) draft.songIds.splice(at, 1);
        renderShell();
      });
      label.querySelector('.key-badge').textContent = SW.music.displayKey(rec.score.key);
      label.querySelector('.export-song-title').textContent = rec.title;
      list.appendChild(label);
    });
  }

  function getStoredLessons() {
    try { return JSON.parse(localStorage.getItem(LESSON_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function storeLesson() {
    const all = getStoredLessons();
    const id = draft.id || ('lsn_' + Date.now());
    draft.id = id;
    all[id] = { id, title: draft.title, policy: draft.policy, songIds: draft.songIds.slice(), savedAt: Date.now() };
    try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
  }

  function renderSavedLessons() {
    const list = $('lesson-saved-list');
    const saved = getStoredLessons();
    const ids = Object.keys(saved).sort((a, b) => (saved[b].savedAt || 0) - (saved[a].savedAt || 0));
    $('lesson-saved-card').classList.toggle('policy-off', ids.length === 0);
    list.innerHTML = '';
    ids.forEach(id => {
      const item = saved[id];
      const row = document.createElement('div');
      row.className = 'library-song-item';
      const title = document.createElement('span');
      title.className = 'library-song-title';
      title.textContent = item.title || 'Untitled lesson';
      const actions = document.createElement('div');
      actions.className = 'library-song-actions';
      const edit = document.createElement('button');
      edit.className = 'lib-action-btn load-btn';
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => {
        draft = { id, title: item.title || '', policy: normalizePolicy(item.policy) || blankPolicy(), songIds: (item.songIds || []).slice() };
        $('lesson-link-row').hidden = true;
        renderSetupSheet();
      });
      const del = document.createElement('button');
      del.className = 'lib-action-btn delete-btn-item';
      del.innerHTML = '&times;';
      del.title = 'Delete this lesson';
      del.addEventListener('click', () => {
        if (!confirm('Delete “' + (item.title || 'Untitled lesson') + '”?')) return;
        const all = getStoredLessons();
        delete all[id];
        try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
        renderSavedLessons();
      });
      actions.appendChild(edit);
      actions.appendChild(del);
      row.appendChild(title);
      row.appendChild(actions);
      list.appendChild(row);
    });
  }

  function pruneDraftSongs() {
    const library = SW.library.getStoredLibrary();
    draft.songIds = draft.songIds.filter(id => library[id] && !SW.library.isSandboxId(id));
  }

  function renderSetupSheet() {
    if (!draft) draft = newDraft();
    pruneDraftSongs();
    renderTask();
    renderLayoutSummary();
    renderStructure();
    renderLessonSongs();
    renderShell();
    renderSavedLessons();
    $('lesson-title-input').value = draft.title || '';
    $('lesson-link-row').hidden = true;
  }

  function buildLessonPayload() {
    const L = SW.library;
    const library = L.getStoredLibrary();
    const songs = draft.songIds.filter(id => library[id]).map(id => {
      const rec = L.normalizeSong(JSON.parse(JSON.stringify(library[id])), id);
      delete rec.createdAt;
      delete rec.updatedAt;
      /* normalizeSong carries the shared-library header; a lesson's
         exercises are the teacher's content only, never "shared" songs
         that refuse to save (see library.js) — nor songs from a Teacher
         Library book, which the shelf would take away again. Nor a piece's
         own Layout Settings: in a lesson the lesson's layout rules. */
      delete rec.received;
      delete rec.receivedAt;
      delete rec.derivedFrom;
      delete rec.book;
      delete rec.layout;
      return rec;
    });
    return { lesson: 1, v: POLICY_VERSION, id: draft.id, title: draft.title || 'Lesson', policy: draft.policy, layout: SW.settings.layoutSnapshot(), songs };
  }

  /* ---------------- preview ---------------- */
  function startPreview() {
    if (!draft.songIds.length) { ui.toast('Tick at least one exercise first'); return; }
    if (!SW.library.okToLeave('starts the preview')) return;
    SW.library.save();
    policy = normalizePolicy(draft.policy);
    lessonMeta = { title: draft.title || 'Lesson preview', songIds: draft.songIds.slice() };
    previewing = true;
    previewLayoutLocked = SW.settings.layout.locked;
    SW.settings.layout.locked = true;
    $('preview-bar').hidden = false;
    ui.closeSheet('lesson-setup-sheet');
    ui.closeSheet('library-sheet');
    SW.settings.applyPolicyToShell();
    SW.library.loadSongById(draft.songIds[0]);
  }
  function endPreview() {
    const back = previewTarget;
    previewing = false;
    policy = null;
    lessonMeta = null;
    SW.settings.layout.locked = previewLayoutLocked;
    $('preview-bar').hidden = true;
    SW.settings.applyPolicyToShell();
    if (back) SW.library.loadSongById(back);
    ui.openSheet('lesson-setup-sheet');
    renderSetupSheet();
  }
  let previewTarget = null;

  /* ---------------- wiring ---------------- */
  function init() {
    $('lessonSetupBtn').addEventListener('click', () => {
      SW.library.save();
      if (!draft) {
        draft = newDraft();
        const id = SW.library.currentId();
        if (id && !SW.library.isSandboxId(id)) draft.songIds = [id];
        draft.title = SW.library.isSandboxId(id) ? '' : (SW.library.currentTitle() || '');
      }
      ui.closeSheet('library-sheet');
      ui.openSheet('lesson-setup-sheet');
      renderSetupSheet();
    });
    $('lesson-task-note').addEventListener('input', e => { draft.policy.task.note = e.target.value.slice(0, 160); });
    $('lesson-tempo-seg').addEventListener('click', e => {
      const b = e.target.closest('.seg-btn');
      if (!b) return;
      draft.policy.tempo.mode = b.dataset.tempo;
      renderStructure();
    });
    const readRange = () => {
      const t = draft.policy.tempo;
      const lo = parseInt($('lesson-tempo-min').value, 10), hi = parseInt($('lesson-tempo-max').value, 10);
      if (!isNaN(lo)) t.min = SW.meters.clampBpm(lo);
      if (!isNaN(hi)) t.max = SW.meters.clampBpm(hi);
      if (t.min > t.max) { const x = t.min; t.min = t.max; t.max = x; }
    };
    ['change', 'blur'].forEach(ev => {
      $('lesson-tempo-min').addEventListener(ev, () => { readRange(); renderStructure(); });
      $('lesson-tempo-max').addEventListener(ev, () => { readRange(); renderStructure(); });
    });
    $('lesson-title-input').addEventListener('input', e => { draft.title = e.target.value; });
    $('lesson-songs-all').addEventListener('click', () => {
      draft.songIds = SW.library.getSortedSongIds();
      renderLessonSongs();
      renderShell();
    });
    $('lesson-songs-none').addEventListener('click', () => {
      draft.songIds = [];
      renderLessonSongs();
      renderShell();
    });
    $('lesson-preview-btn').addEventListener('click', () => {
      previewTarget = SW.library.currentId();
      startPreview();
    });
    $('preview-exit-btn').addEventListener('click', endPreview);
    $('lesson-link-btn').addEventListener('click', () => {
      if (!draft.songIds.length) { ui.toast('Tick at least one exercise first'); return; }
      if (!draft.title.trim()) draft.title = SW.library.currentTitle() || 'Lesson';
      $('lesson-title-input').value = draft.title;
      storeLesson();
      renderSavedLessons();
      const link = window.location.origin + window.location.pathname + '#lesson=' + encodeURIComponent(ui.encodeJson(buildLessonPayload()));
      SW.library.offerLink(link, $('lesson-link-input'), $('lesson-link-row'), $('lesson-link-copy-text'), $('lesson-link-feedback'));
    });
    $('lesson-link-copy').addEventListener('click', () => {
      const input = $('lesson-link-input');
      if (input.value) SW.library.offerLink(input.value, input, null, $('lesson-link-copy-text'), $('lesson-link-feedback'));
    });
  }

  // the exercise open in this tab, for a reload
  SW.bus.on('song:opened', d => { if (lessonMeta && !previewing) rememberOpenLesson(d.id); });

  SW.lessons = {
    init, bootFromUrl, restoreSong,
    policy: () => policy,
    meta: () => lessonMeta,
    isPreviewing: () => previewing,
    shellAllows, libraryMode, taskBlurb
  };
})();

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

   STUDENT VERSIONS (2026-11-15): Share & backup → Make a student
   version… makes a ONE-SONG lesson on the same policy (kind
   'student-version'): its own sheet (THE STUDENT VERSION SHEET), the same
   link and opening, plus SAVE MY WORK — the student's way to hand the work
   back (#work=~… or a .json file, kind 'student-work') — and RETURNED
   WORK, the teacher's side: Open as they had it (VIEWING, nothing filed)
   or Open with everything (filed as a received song, "Title — Name").
   The melody is two halves since then: task.pitchLocked and
   task.rhythmLocked (melodyLocked read as both — every old link opens as
   it did). JSON-FORMAT.md §6, §6a, §6b.

   KEYS: song_writer_35_lessons_v1 (the teacher's saved lessons — and
         student versions, marked kind: 'student-version'),
         song_writer_35_lesson_sources_v1 (pristine exercises), and in
         sessionStorage song_writer_35_open_lesson_v1 (the lesson open in
         this tab, so a reload does not end it) and
         song_writer_35_student_name_v1 (a student version's name, asked
         once a session).
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const ui = SW.ui;
  const $ = id => document.getElementById(id);

  const LESSON_KEY = 'song_writer_35_lessons_v1';
  const LESSON_SOURCE_KEY = 'song_writer_35_lesson_sources_v1';
  const OPEN_LESSON_KEY = 'song_writer_35_open_lesson_v1';   // sessionStorage
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
    { key: 'view',       name: 'Look options',       desc: 'Sizes, fonts, lights, section colours, the chords and the note names — and the lock and the stage in Options' },   // 'view': View's key until 2026-10-31
    { key: 'strip',      name: 'Chords',             desc: 'The Digital Accordion chords, the chord progressions and the chord track (the Chords tab)' },
    { key: 'dock',       name: 'Keyboard',           desc: 'The keyboard under the song (the Keyboard tab)' },
    { key: 'sections',   name: 'Section tools',      desc: 'Moving, copying and deleting lines' },
    { key: 'textEditor', name: 'Words editor',       desc: 'Write: the words — or the whole song — as text' },
    { key: 'picture',    name: 'Save a picture',     desc: 'A picture of the song for printing' },
    { key: 'present',    name: 'Present mode',       desc: 'Big and clean, filling the screen' }
  ];

  /* Tempo, as Rhythm Poetry's lessons have it: Any · Between · Locked. */
  const TEMPO_MODES = ['any', 'range', 'locked'];

  /* STUDENT VERSIONS (2026-11-15): Share & backup → Make a student
     version… builds a ONE-SONG lesson on this same policy, with
     kind: 'student-version' — its own sheet (below, THE STUDENT VERSION
     SHEET), the same link (#lesson=), the same opening (openLesson), so
     the work is kept as lesson_<slug>_<id>_0 and Start again still works.
     What it adds to the policy:
       task.pitchLocked / task.rhythmLocked — the melody split in two
         (melodyLocked until then, read as both: every old link opens as
         before; a new policy still writes melodyLocked = either, for
         readers older than this);
       shell.lookPage — Look's Music Page rows (lights, follow along,
         section colours, the chords shown or not, note names). Off: policy.look
         carries the teacher's choices, put on for this song only
         (settings.js pinLook — never written over the student's own);
         an older policy reads it as shell.view, which covered them;
       shell.options — the Options button (also gone when nothing is left
         in it, in a student version);
       save { link, file } — the Save my work button and what it offers
         (#work=~… links, .json files: kind 'student-work');
       student { askName } — their name, asked before they hand it in.
     In a student version `view` is only Look's sizes and fonts, `strip`
     only the chord panel (the chords on the music are always seen and
     heard — can('chordsListen')), and the chords change by
     task.chordsLocked alone, not through the melody. */
  const PAGE_LOOK_KEYS = ['playLight', 'followScroll', 'colours', 'showLane', 'noteNames'];   // (chordRhythm went 2026-11-17: an older look's is passed by)

  function blankPolicy() {
    return {
      v: POLICY_VERSION,
      kind: 'lesson',
      task: { pitchLocked: false, rhythmLocked: false, wordsLocked: false, chordsLocked: false, note: '' },
      key: { locked: false },
      tempo: { mode: 'any', min: 60, max: 120 },
      shell: { sound: true, view: true, lookPage: true, strip: true, dock: true, sections: true, textEditor: true, picture: true, present: true, options: true, library: 'lesson' },
      save: { link: false, file: false },
      student: { askName: false },
      look: null
    };
  }
  function normalizePolicy(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const p = blankPolicy();
    if (raw.kind === 'student-version') p.kind = 'student-version';
    if (raw.task) {
      const melody = !!raw.task.melodyLocked;            // until 2026-11-15: pitch and rhythm together
      p.task.pitchLocked = raw.task.pitchLocked !== undefined ? !!raw.task.pitchLocked : melody;
      p.task.rhythmLocked = raw.task.rhythmLocked !== undefined ? !!raw.task.rhythmLocked : melody;
      p.task.wordsLocked = !!raw.task.wordsLocked;
      p.task.chordsLocked = !!raw.task.chordsLocked;       // 2.5: the chord progressions to hear, not to change
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
      // the Music Page rows were the 'view' switch's until 2026-11-15
      p.shell.lookPage = raw.shell.lookPage !== undefined ? raw.shell.lookPage !== false : p.shell.view;
      p.shell.options = raw.shell.options !== false;
      p.shell.library = raw.shell.library === 'none' ? 'none' : 'lesson';
    }
    if (raw.save && typeof raw.save === 'object') {
      p.save.link = !!raw.save.link;
      p.save.file = !!raw.save.file;
    }
    if (raw.student && typeof raw.student === 'object') p.student.askName = !!raw.student.askName;
    if (raw.look && typeof raw.look === 'object') {
      const look = {};
      PAGE_LOOK_KEYS.forEach(k => { if (raw.look[k] !== undefined) look[k] = raw.look[k]; });
      p.look = look;
    }
    return p;
  }
  /* what goes in a link: the policy, plus melodyLocked for older readers
     (either half fixed reads there as the whole melody fixed) */
  function policyForLink(p) {
    const out = JSON.parse(JSON.stringify(p));
    out.task.melodyLocked = !!(p.task.pitchLocked || p.task.rhythmLocked);
    if (out.kind !== 'student-version') { delete out.kind; delete out.save; delete out.student; delete out.look; }
    else if (out.shell.lookPage) delete out.look;
    return out;
  }

  function taskKind(p) {
    const pol = p || policy;
    if (!pol) return 'free';
    const m = pol.task.pitchLocked && pol.task.rhythmLocked, w = pol.task.wordsLocked;
    return m && w ? 'read' : m ? 'words' : w ? 'melody' : 'free';
  }
  /* A student version's strip, when the teacher wrote no sentence: what is theirs to change. */
  function versionBlurb(pol) {
    const t = pol.task;
    const theirs = [];
    if (!t.pitchLocked) theirs.push('the notes');
    if (!t.rhythmLocked) theirs.push('the rhythm');
    if (!t.wordsLocked) theirs.push('the words');
    if (!t.chordsLocked) theirs.push('the chords');
    if (!theirs.length) return TASK_BLURB.read;
    if (theirs.length === 4) return TASK_BLURB.free;
    const list = theirs.length === 1 ? theirs[0] : theirs.slice(0, -1).join(', ') + ' and ' + theirs[theirs.length - 1];
    return 'You can change ' + list + ' — the rest is set.';
  }
  function taskBlurb() {
    if (policy && policy.task.note) return policy.task.note;
    if (policy && policy.kind === 'student-version') return versionBlurb(policy);
    return TASK_BLURB[taskKind()];
  }
  function shellAllows(key) { return !policy || policy.shell[key] !== false; }
  function libraryMode() { return policy ? policy.shell.library : 'full'; }
  function isStudentVersion() { return !!(policy && policy.kind === 'student-version'); }

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
  /* (`false`: a lesson link that cannot be read — cut short, most likely) */
  function checkUrlForLesson() {
    const raw = ui.linkParam('lesson');
    if (!raw) return null;
    const payload = ui.decodeJson(raw);
    return (payload && payload.lesson) ? payload : false;
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
      // (the lesson's layout goes in only so a pick-up it switched on before
      // 2026-09-28 becomes the song's own — normalizeSong; it is dropped below)
      const fresh = L.normalizeSong({ ...song, layout: song.layout || payload.layout, id, isCustom: true, createdAt: Date.now() + i }, id);
      /* the lesson's layout rules, not a piece's own — buildLessonPayload
         never sends one, and a hand-made link must not either */
      delete fresh.layout;
      sources[id] = fresh;
      if (!library[id]) library[id] = JSON.parse(JSON.stringify(fresh));
      ids.push(id);
    });
    if (!ids.length) return null;
    L.saveStoredLibrary(library);
    /* A pristine copy whose exercise has left the library (deleted, or Start
       over) can never be used again — Start again is only offered for
       exercises that are there, and opening the lesson again writes a new
       one. Let go, so the copies do not pile up lesson after lesson. */
    Object.keys(sources).forEach(id => { if (!library[id]) delete sources[id]; });
    writeSources(sources);
    policy = p;
    const layout = payload.layout && typeof payload.layout === 'object' ? payload.layout : null;
    lessonMeta = { title, songIds: ids, id: payload.id ? String(payload.id) : '', kind: p.kind, layout };
    /* The lesson brings the teacher's layout, locked — for the lesson only
       (2026-11-22, bug report M21). It used to be stored as the person's own,
       locked for good: Options lost Layout settings, and every song after
       took the lesson's layout (a teacher testing their own link had it too).
       Now it is held on screen (settings.js holdLayout: never stored), kept
       with the lesson for this tab (rememberOpenLesson) for a reload, and the
       person's own come back with the plain app. */
    if (layout) SW.settings.holdLayout(layout);
    L.clearLinkFromAddress(IN_LESSON);            // (kept when embedded: library.js)
    rememberOpenLesson(ids[0]);
    SW.settings.applyPolicyToShell();
    return ids[0];
  }

  /* The link's hash is cleared once the lesson is open (so a whole song
     never sits in the address bar), which used to mean a reload ended the
     lesson. The open lesson is kept for this tab in sessionStorage.

     A WAY OUT (2026-11-22, bug report L23): the address then reads
     …/#in-lesson, and only an address that says so opens the lesson again —
     a reload does; the plain app's address, typed in the same tab, is the
     whole app again (until then only closing the tab ended a lesson). An
     entry kept before this (no `marked`) still opens on a reload, as it
     did. Embedded, the frame keeps its #lesson= link and opens from that. */
  const IN_LESSON = '#in-lesson';
  function rememberOpenLesson(current) {
    if (previewing || !lessonMeta) return;
    try {
      sessionStorage.setItem(OPEN_LESSON_KEY, JSON.stringify({ title: lessonMeta.title, songIds: lessonMeta.songIds, id: lessonMeta.id, policy, current,
        layout: lessonMeta.layout || null, marked: true }));
    } catch (e) {}
  }
  function navigationType() {
    try { const nav = performance.getEntriesByType('navigation')[0]; return nav ? nav.type : ''; } catch (e) { return ''; }
  }
  function reopenFromSession() {
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(OPEN_LESSON_KEY) || 'null'); } catch (e) {}
    if (!saved || !Array.isArray(saved.songIds)) return null;
    const asked = window.location.hash === IN_LESSON || (!saved.marked && navigationType() === 'reload');
    if (!asked) {
      try { sessionStorage.removeItem(OPEN_LESSON_KEY); } catch (e) {}      // the plain app: the lesson is over in this tab
      return null;
    }
    const library = SW.library.getStoredLibrary();
    const ids = saved.songIds.filter(id => library[id]);
    const p = normalizePolicy(saved.policy);
    if (!ids.length || !p) return null;
    policy = p;
    const layout = saved.layout && typeof saved.layout === 'object' ? saved.layout : null;
    lessonMeta = { title: saved.title || 'Lesson', songIds: ids, id: saved.id || '', kind: p.kind, layout };
    // the lesson's layout again, held (M21; an entry from before kept it in storage, where it still is)
    if (layout) SW.settings.holdLayout(layout);
    SW.settings.applyPolicyToShell();
    return ids.indexOf(saved.current) !== -1 ? saved.current : ids[0];
  }

  function bootFromUrl() {
    // the Recording Studio's hidden frame (js/embed.js) never opens a lesson — not even this tab's
    if (window.EVM_STUDIO_EMBED) return null;
    const payload = checkUrlForLesson();
    if (payload) return openLesson(payload);
    if (payload === false) {
      ui.toast('This lesson link came through incomplete, so the lesson can’t open — it was probably cut short. Make a new link and copy all of it.', 10000);
      return null;                                // library.js opens the sandbox
    }
    /* A song link in the address is what was asked for: it opens, and ends
       the lesson this tab had open (2026-11-04). Until then a lesson opened
       on one page of a site took over every song link on its later pages. */
    if (ui.linkParam('song') || ui.linkParam('work')) {   // (#work=: a student's work, for the teacher — afterStart)
      try { sessionStorage.removeItem(OPEN_LESSON_KEY); } catch (e) {}
      return null;
    }
    return reopenFromSession();
  }

  /* An exercise changed in this tab and in another one at once: this tab's
     work was kept as a copy (library.js ANOTHER TAB), which is one more of
     the lesson's exercises from now on, in this tab. */
  function addExercise(id) {
    if (!lessonMeta || previewing || lessonMeta.songIds.indexOf(id) !== -1) return;
    lessonMeta.songIds.push(id);
    rememberOpenLesson(id);
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
        draft.policy.task.pitchLocked = type.m;      // the whole melody, as before the split (2026-11-15)
        draft.policy.task.rhythmLocked = type.m;
        draft.policy.task.wordsLocked = type.w;
        renderSetupSheet();
      });
      grid.appendChild(card);
    });
    const note = $('lesson-task-note');
    note.placeholder = TASK_BLURB[cur];
    note.value = draft.policy.task.note || '';
  }

  function renderLayoutSummary(boxId, sheetId) {
    const box = $(boxId || 'lesson-layout-summary');
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
    b.addEventListener('click', () => { ui.closeSheet(sheetId || 'lesson-setup-sheet'); SW.settings.openLayoutSheet(); });
    p.appendChild(document.createTextNode(' '));
    p.appendChild(b);
    box.appendChild(p);
  }

  const TEMPO_NOTES = {
    any: 'They can set any tempo, 30–300 BPM.',
    range: 'They can set a tempo between these two. A song saved outside them starts at the nearest.',
    locked: 'Each exercise plays at the tempo and swing it was saved with; they show as plain text.'
  };
  function renderStructure() {
    const list = $('lesson-structure');
    list.innerHTML = '';
    list.appendChild(ui.switchRow('Key stays as written', 'The key letter becomes plain text', draft.policy.key.locked, () => {
      draft.policy.key.locked = !draft.policy.key.locked;
      renderStructure();
    }));
    list.appendChild(ui.switchRow('Chords: listen only', 'They hear and see the chord progressions, but cannot change them', !!draft.policy.task.chordsLocked, () => {
      draft.policy.task.chordsLocked = !draft.policy.task.chordsLocked;
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
        // Look options keeps the Music Page rows with it here, as it always had them
        if (s.key === 'view') draft.policy.shell.lookPage = draft.policy.shell.view;
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
    // (a student version is kept in the same store, and listed on its own sheet)
    const ids = Object.keys(saved).filter(id => saved[id].kind !== 'student-version')
      .sort((a, b) => (saved[b].savedAt || 0) - (saved[a].savedAt || 0));
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
        // (the app's own question: the browser's can be refused — core.js ASK)
        ui.ask({ title: 'Delete “' + (item.title || 'Untitled lesson') + '”?', text: 'Links already sent keep working.', yes: 'Delete', danger: true }).then(ok => {
          if (!ok) return;
          const all = getStoredLessons();
          delete all[id];
          try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
          renderSavedLessons();
        });
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
      /* the song open now goes as it is on the page, as Create a link and Make
         a student version send it (2026-11-22, bug report M20: a library song
         is open with auto-save off, so its saved copy can be older) */
      if (id === L.currentId()) rec.score = SW.score.read();
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
    return { lesson: 1, v: POLICY_VERSION, id: draft.id, title: draft.title || 'Lesson', policy: policyForLink(draft.policy), layout: SW.settings.layoutSnapshot(), songs };
  }

  /* ---------------- preview ---------------- */
  function startPreview() {
    if (!draft.songIds.length) { ui.toast('Tick at least one exercise first'); return; }
    if (!SW.library.okToLeave('starts the preview')) return;
    SW.library.save();
    previewFrom = 'lesson-setup-sheet';
    beginPreview(normalizePolicy(draft.policy), draft.title || 'Lesson preview', draft.songIds.slice());
  }
  /* the preview itself — a lesson's (above) or a student version's (previewVersion) */
  function beginPreview(p, title, songIds) {
    // the song it goes back to opens again with auto-save as it was (bug report L24: it came back off)
    previewAutoSave = SW.library.autoSaveChoice();
    policy = p;
    lessonMeta = { title, songIds, id: '', kind: p.kind };
    previewing = true;
    previewLayoutLocked = SW.settings.layout.locked;
    SW.settings.layout.locked = true;
    $('preview-bar').hidden = false;
    ui.closeSheet('lesson-setup-sheet');
    ui.closeSheet('student-version-sheet');
    ui.closeSheet('library-sheet');
    SW.settings.applyPolicyToShell();
    SW.library.loadSongById(songIds[0]);
  }
  function endPreview() {
    const back = previewTarget;
    previewing = false;
    policy = null;
    lessonMeta = null;
    SW.settings.layout.locked = previewLayoutLocked;
    $('preview-bar').hidden = true;
    ui.closeSheet('save-work-sheet');
    SW.settings.applyPolicyToShell();
    if (back) SW.library.loadSongById(back, { autoSave: previewAutoSave });
    ui.openSheet(previewFrom);
    if (previewFrom === 'student-version-sheet') renderVersionSheet(); else renderSetupSheet();
  }
  let previewAutoSave = false;
  let previewTarget = null;
  let previewFrom = 'lesson-setup-sheet';    // the sheet the preview goes back to

  /* ---------------- files ---------------- */
  function downloadJson(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  // a name a file can carry (the title as written, less what a file system refuses)
  const fileSafe = t => String(t || '').replace(/[\\/:*?"<>|\u0000-\u001f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
  function readJsonFile(input, then) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      let json = null;
      try { json = JSON.parse(e.target.result); } catch (err) { json = null; }
      input.value = '';
      then(json);
    };
    reader.readAsText(file);
  }
  const cloneJson = o => JSON.parse(JSON.stringify(o));
  const alnumTag = v => String(v || '').replace(/[^a-z0-9]/gi, '').slice(-8).toLowerCase();

  /* ==================================================================
     THE STUDENT VERSION SHEET (2026-11-15) — Share & backup → Make a
     student version… One song (the one open when the sheet opened, or a
     saved version's), the switches below written straight into a policy
     (kind 'student-version'), and the same three ways out as a lesson:
     Preview as a student, Create the link (#lesson=~…), and Download as a
     file (the payload as .json). Each version made is kept in the
     lessons' store, marked kind: 'student-version'.
     ================================================================== */
  let sv = null;            // { id, title, policy, songId }

  function newVersionDraft(songId) {
    const p = blankPolicy();
    p.kind = 'student-version';
    p.key.locked = true;                         // Key & scale: off to start
    p.shell = { sound: true, view: true, lookPage: false, strip: true, dock: true, sections: true, textEditor: true,
                picture: false, present: true, options: true, library: 'none' };
    p.save = { link: STUDENT_LINKS, file: true };   // (LINKS OFF: no link to start)
    p.student = { askName: true };
    return { id: null, title: '', policy: p, songId };
  }

  /* A. what they can change in the music: ON = theirs */
  const SV_MUSIC = [
    { k: 'pitchLocked',  name: 'Pitch',  desc: 'Which note: the Pitch page blocks, the letter and arrow keys that write notes, ♯ ♭, harmony, connected notes, the clef, Create Key Change' },
    { k: 'rhythmLocked', name: 'Rhythm', desc: 'Note lengths and rests: the value circles, Dotted, Tie, Rest, the Rhythm page circles, adding notes without words, the time signature' },
    { k: 'chordsLocked', name: 'Chords', desc: 'Changing the chords. Off, they still see and hear them' },
    { k: 'wordsLocked',  name: 'Lyrics', desc: 'Typing words: tap or double-click a word. With Pitch and Rhythm on too, the Lyrics editor and Split into syllables (they can add notes)' }
  ];
  /* B. what they can adjust (the bottom row), after Tempo */
  const SV_ADJUST = [
    { name: 'Key & scale', desc: 'The key and the scale in Setup. Off: the key reads as plain text', get: p => !p.key.locked, set: (p, on) => { p.key.locked = !on; } },
    { shell: 'sound', name: 'Sound', desc: 'The melody, chord and part sounds and volumes, Room, At the end, the steady beat and the count-in' },
    { shell: 'view', name: 'Sizes & fonts', desc: 'Look → Scale, Text size, Lyric font' },
    { shell: 'lookPage', name: 'Music page display', desc: 'Look → Note/Box lights, Follow along, section colours, Display Note Names, and whether the chords show. Off: the way you have them now, for this song only — their own settings are left alone' },
    { shell: 'dock', name: 'Keyboard', desc: 'The Piano button, and the keyboard’s rows in Options' },
    { shell: 'strip', name: 'Chord panel', desc: 'The Edit box’s Chords tab: the chord panel, to play chords and put them on the music' },
    { shell: 'options', name: 'Options button', desc: 'The lock, Parts and the keyboard’s rows. It goes by itself when none of them is left. (Layout settings… is never in a student version)' },
    { shell: 'present', name: 'Present', desc: 'Big and clean, filling the screen' },
    { shell: 'picture', name: 'Save a picture', desc: 'A picture of the song for printing — in the Library, so it needs Library on' }
  ];

  function versionRecord() {
    const L = SW.library;
    const library = L.getStoredLibrary();
    const id = sv.songId;
    if (!id || !library[id]) return null;
    const rec = L.normalizeSong(cloneJson(library[id]), id);
    // the song open now goes as it is on the page (Create a link does the same)
    if (id === L.currentId()) rec.score = SW.score.read();
    if (L.isSandboxId(id)) rec.title = sv.title || 'Song';
    ['createdAt', 'updatedAt', 'received', 'receivedAt', 'derivedFrom', 'book', 'layout'].forEach(k => { delete rec[k]; });
    return rec;
  }
  function versionSongTitle() {
    const L = SW.library;
    const rec = L.getStoredLibrary()[sv.songId];
    if (!rec) return 'this song';
    return L.isSandboxId(sv.songId) ? 'your sandbox' : (L.normalizeSong(rec, sv.songId).title || 'this song');
  }
  /* the policy as it travels: the Music Page as you have it now, when theirs is left out */
  function versionPolicy() {
    const p = cloneJson(sv.policy);
    p.kind = 'student-version';
    p.look = p.shell.lookPage ? null : SW.settings.pageLook();
    return p;
  }
  function versionPayload() {
    const rec = versionRecord();
    if (!rec) return null;
    return { lesson: 1, v: POLICY_VERSION, kind: 'student-version', id: sv.id, title: sv.title || rec.title,
             policy: policyForLink(versionPolicy()), layout: SW.settings.layoutSnapshot(), songs: [rec] };
  }

  function renderVersionMusic() {
    const list = $('sv-music');
    const t = sv.policy.task;
    list.innerHTML = '';
    SV_MUSIC.forEach(m => {
      list.appendChild(ui.switchRow(m.name, m.desc, !t[m.k], () => {
        t[m.k] = !t[m.k];
        // the chord panel follows Chords (it can be changed back below)
        if (m.k === 'chordsLocked') sv.policy.shell.strip = !t.chordsLocked;
        renderVersionSheet(true);
      }));
    });
    const all = !t.pitchLocked && !t.rhythmLocked && !t.wordsLocked;
    const none = t.pitchLocked && t.rhythmLocked && t.wordsLocked && t.chordsLocked;
    $('sv-music-note').textContent = none
      ? 'Nothing in the music changes: a song to read, play and sing. The Edit box and its lock are not there.'
      : all
      ? 'Adding, moving, copying and deleting lines comes with Pitch, Rhythm and Lyrics together.'
      : 'Adding, moving, copying and deleting lines needs Pitch, Rhythm and Lyrics all on — so those stay out.';
  }

  const SV_TEMPO_NOTES = {
    any: 'They can set any tempo, 30–300 BPM, and the swing.',
    range: 'They can set a tempo between these two, and the swing.',
    locked: 'It plays at the tempo and swing it was saved with; they read as plain text.'
  };
  function renderVersionAdjust() {
    const p = sv.policy;
    const t = p.tempo;
    document.querySelectorAll('#sv-tempo-seg .seg-btn').forEach(b => b.classList.toggle('active', b.dataset.tempo === t.mode));
    $('sv-tempo-range').hidden = t.mode !== 'range';
    $('sv-tempo-min').value = t.min;
    $('sv-tempo-max').value = t.max;
    $('sv-tempo-note').textContent = SV_TEMPO_NOTES[t.mode];
    const list = $('sv-adjust');
    list.innerHTML = '';
    SV_ADJUST.forEach(r => {
      const on = r.shell ? p.shell[r.shell] !== false : r.get(p);
      list.appendChild(ui.switchRow(r.name, r.desc, on, () => {
        if (r.shell) p.shell[r.shell] = !on; else r.set(p, !on);
        renderVersionSheet(true);
      }));
    });
    const rhythm = !p.task.rhythmLocked, built = !p.task.pitchLocked && rhythm && !p.task.wordsLocked;
    $('sv-adjust-note').textContent =
      'Time signature: ' + (rhythm ? 'theirs to change, with Rhythm.' : 'stays as written (it goes with Rhythm).') + ' ' +
      'Parts: ' + (built ? 'they can add and remove parts.' : p.shell.sound !== false ? 'they can change each part’s sound and volume, but not add or remove parts.' : 'as written.') +
      (p.key.locked && t.mode === 'locked' && !rhythm ? ' With the key, the time and the tempo all fixed, Setup still reads them back.' : '');
  }

  function renderVersionRest() {
    const p = sv.policy;
    const lib = $('sv-library');
    lib.innerHTML = '';
    lib.appendChild(ui.switchRow('Library', 'The song chip at the top, with Start again (and Save a picture, if it is on). Off: they have only this song',
      p.shell.library !== 'none', () => { p.shell.library = p.shell.library === 'none' ? 'lesson' : 'none'; renderVersionSheet(true); }));
    $('sv-save-link').checked = !!p.save.link;
    $('sv-save-link-row').style.display = STUDENT_LINKS ? '' : 'none';   // LINKS OFF: the file is the way back (.inline-check beats [hidden])
    $('sv-save-file').checked = !!(p.save.file || (!STUDENT_LINKS && p.save.link));   // (LINKS OFF: a link-only version hands back a file)
    $('sv-save-note').textContent = (p.save.link || p.save.file)
      ? 'Whatever they send carries their song, the settings they had, and their name.'
      : 'No Save my work button: their work stays in their browser — a read-and-sing link, say.';
    const st = $('sv-student');
    st.innerHTML = '';
    st.appendChild(ui.switchRow('Ask for their name',
      'Asked the first time they press Save my work, and needed before they can ' + (STUDENT_LINKS ? 'make the link or the file' : 'save the file') + '. It goes on the file’s name and the title you see: Song — Name',
      !!p.student.askName, () => { p.student.askName = !p.student.askName; renderVersionSheet(true); }));
  }

  function getStoredVersions() {
    const all = getStoredLessons();
    const out = {};
    Object.keys(all).forEach(id => { if (all[id] && all[id].kind === 'student-version') out[id] = all[id]; });
    return out;
  }
  function storeVersion() {
    const all = getStoredLessons();
    const id = sv.id || ('sv_' + Date.now());
    sv.id = id;
    all[id] = { id, kind: 'student-version', title: sv.title, policy: sv.policy, songIds: [sv.songId], savedAt: Date.now() };
    try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
  }
  function renderSavedVersions() {
    const list = $('sv-saved-list');
    const saved = getStoredVersions();
    const ids = Object.keys(saved).sort((a, b) => (saved[b].savedAt || 0) - (saved[a].savedAt || 0));
    $('sv-saved-card').classList.toggle('policy-off', ids.length === 0);
    list.innerHTML = '';
    const library = SW.library.getStoredLibrary();
    ids.forEach(id => {
      const item = saved[id];
      const row = document.createElement('div');
      row.className = 'library-song-item' + (id === sv.id ? ' active' : '');
      const title = document.createElement('span');
      title.className = 'library-song-title';
      const songId = (item.songIds || [])[0];
      const song = songId && library[songId] ? SW.library.normalizeSong(library[songId], songId).title : '';
      title.textContent = (item.title || 'Untitled version') + (song && song !== item.title ? ' · ' + song : '');
      const actions = document.createElement('div');
      actions.className = 'library-song-actions';
      const edit = document.createElement('button');
      edit.className = 'lib-action-btn load-btn';
      edit.textContent = 'Edit';
      edit.addEventListener('click', () => {
        const keep = songId && library[songId] ? songId : SW.library.currentId();
        if (keep !== songId) ui.toast('Its song is no longer in your library — it uses the song open now');
        sv = { id, title: item.title || '', policy: normalizePolicy(Object.assign({}, item.policy, { kind: 'student-version' })) || newVersionDraft(keep).policy, songId: keep };
        renderVersionSheet();
      });
      const del = document.createElement('button');
      del.className = 'lib-action-btn delete-btn-item';
      del.innerHTML = '&times;';
      del.title = 'Delete this version';
      del.addEventListener('click', () => {
        ui.ask({ title: 'Delete “' + (item.title || 'Untitled version') + '”?', text: 'Links already sent keep working.', yes: 'Delete', danger: true }).then(ok => {
          if (!ok) return;
          const all = getStoredLessons();
          delete all[id];
          try { localStorage.setItem(LESSON_KEY, JSON.stringify(all)); } catch (e) {}
          if (sv && sv.id === id) sv.id = null;
          renderSavedVersions();
        });
      });
      actions.appendChild(edit);
      actions.appendChild(del);
      row.appendChild(title);
      row.appendChild(actions);
      list.appendChild(row);
    });
  }

  /* keepLink: a switch moved — the link made before it no longer says what the sheet says, so it goes */
  function renderVersionSheet(keepScroll) {
    if (!sv) return;
    $('sv-song-title').textContent = versionSongTitle() === 'your sandbox' ? 'your sandbox' : '“' + versionSongTitle() + '”';
    renderVersionMusic();
    renderVersionAdjust();
    renderVersionRest();
    renderLayoutSummary('sv-layout-summary', 'student-version-sheet');
    $('sv-note').value = sv.policy.task.note || '';
    $('sv-note').placeholder = versionBlurb(sv.policy);
    $('sv-title').value = sv.title || '';
    $('sv-title').placeholder = 'e.g. ' + (SW.library.isSandboxId(sv.songId) ? 'My song' : versionSongTitle()) + ' — write the words';
    $('sv-link-row').hidden = true;
    renderSavedVersions();
    if (!keepScroll) { const sheet = document.querySelector('#student-version-sheet .sheet'); if (sheet) sheet.scrollTop = 0; }
  }

  function openVersionSheet() {
    SW.library.save();
    const cur = SW.library.currentId();
    if (!sv || sv.songId !== cur) sv = newVersionDraft(cur);
    ui.closeSheet('importExportModal');
    ui.closeSheet('library-sheet');
    ui.openSheet('student-version-sheet');
    renderVersionSheet();
  }
  function ensureVersionTitle() {
    if (!sv.title.trim()) {
      const rec = versionRecord();
      sv.title = rec ? rec.title : 'Student version';
      $('sv-title').value = sv.title;
    }
  }
  function previewVersion() {
    if (!versionRecord()) { ui.toast('That song is no longer in your library'); return; }
    if (!SW.library.okToLeave('starts the preview')) return;
    SW.library.save();
    previewTarget = SW.library.currentId();
    previewFrom = 'student-version-sheet';
    beginPreview(normalizePolicy(versionPolicy()), sv.title || 'Student version', [sv.songId]);
  }

  /* ==================================================================
     SAVE MY WORK (2026-11-15) — the student's side. In a student version
     whose policy.save allows a link or a file, one button in the top bar
     (where the auto-save toggle sits outside a lesson). Their work keeps
     itself in their browser as any lesson's does; this is only for
     handing it in:
       • Copy a link to send — #work=~… (core.js SHORT LINKS);
       • Download a file — <Song title> - <Name>.json;
       • Open a saved file — one of their own files, back into this same
         version (in place of what is on the page).
     Both carry { v, kind: 'student-work', title, version, student, policy,
     layout, song }. With policy.student.askName, their name comes first:
     asked the first time, kept for the session (sessionStorage), and
     editable on the sheet.
     ================================================================== */
  /* LINKS OFF (2026-11-17, the user: "remove the link option for the students right now, just keep the
     download option" — other plans are coming for getting work back). false: no Copy a link on Save my
     work, no "Save as a link" on the version sheet, and a version that offered only a link offers the file
     instead, so its students can still hand in. The link code below (THE WORK LINK, SHORTER) stays, and a
     #work= link a teacher is sent still opens. true brings it all back. */
  const STUDENT_LINKS = false;
  const linkOffered = () => !!(STUDENT_LINKS && policy && policy.save.link);
  const fileOffered = () => !!(policy && (policy.save.file || (!STUDENT_LINKS && policy.save.link)));
  const NAME_KEY = 'song_writer_35_student_name_v1';     // sessionStorage
  let nameInMemory = '';
  function studentName() {
    try { const n = sessionStorage.getItem(NAME_KEY); if (n !== null) return n; } catch (e) {}
    return nameInMemory;
  }
  function setStudentName(n) {
    nameInMemory = String(n || '').slice(0, 40);
    try { sessionStorage.setItem(NAME_KEY, nameInMemory); } catch (e) {}
  }
  function saveOffered() {
    return !!(policy && policy.kind === 'student-version' && (policy.save.link || policy.save.file) && !viewing);
  }
  const asksName = () => !!(policy && policy.student && policy.student.askName);
  const nameMissing = () => asksName() && !studentName().trim();

  function workFileName() {
    const title = fileSafe(SW.library.currentTitle()) || 'My song';
    const name = asksName() ? fileSafe(studentName()) : '';
    return title + (name ? ' - ' + name : '') + '.json';
  }
  function workPayload() {
    const L = SW.library;
    const id = L.currentId();
    const library = L.getStoredLibrary();
    const rec = L.normalizeSong(cloneJson(library[id] || { title: L.currentTitle() }), id);
    rec.score = SW.score.read();                       // what is on the page (a preview saves nothing)
    rec.title = L.currentTitle() || rec.title;
    rec.updatedAt = Date.now();
    ['received', 'receivedAt', 'derivedFrom', 'book', 'layout'].forEach(k => { delete rec[k]; });
    return {
      v: 1, kind: 'student-work',
      title: rec.title,
      version: { id: lessonMeta && lessonMeta.id || '', title: lessonMeta && lessonMeta.title || '' },
      student: { name: asksName() ? studentName().trim() : '' },
      policy: policyForLink(policy),
      layout: SW.settings.layoutSnapshot(),
      song: rec,
      savedAt: new Date().toISOString()
    };
  }

  function renderSaveWork() {
    if (!policy) return;
    const ask = asksName();
    const waiting = nameMissing();
    $('sw-name-row').hidden = !ask;
    if (document.activeElement !== $('sw-name')) $('sw-name').value = studentName();
    $('sw-name').classList.remove('input-error');
    $('sw-name-ok').hidden = !waiting;
    $('sw-name-note').textContent = waiting
      ? 'First, your name — it goes with your work, so your teacher knows it is yours.'
      : 'Your name goes with your work. You can change it here.';
    $('sw-choices').hidden = waiting;
    $('sw-link').hidden = !linkOffered();
    if (!linkOffered()) $('sw-link-row').hidden = true;
    $('sw-file').hidden = !fileOffered();
    $('sw-open').hidden = !fileOffered();
    $('sw-file-note').textContent = 'Saves “' + workFileName() + '” to your downloads, to upload or email — or to open here again later.';
    $('sw-sub').textContent = waiting ? 'Your work is kept in this browser as you go.' : 'Your work is kept in this browser as you go. To hand it in:';
  }
  function openSaveWork() {
    if (!saveOffered()) return;
    SW.library.save();
    $('sw-link-row').hidden = true;
    renderSaveWork();
    ui.closeAllPopovers && ui.closeAllPopovers();
    ui.openSheet('save-work-sheet');
    if (nameMissing()) setTimeout(() => $('sw-name').focus(), 60);
  }
  function takeName() {
    const n = $('sw-name').value.trim();
    if (!n) { $('sw-name').classList.add('input-error'); $('sw-name').focus(); return false; }
    setStudentName(n);
    renderSaveWork();
    return true;
  }
  /* the name is needed before a link or a file (when the teacher asked for it) */
  function nameFirst() {
    if (!nameMissing()) return true;
    renderSaveWork();
    $('sw-name').classList.add('input-error');
    $('sw-name').focus();
    ui.toast('Type your name first');
    return false;
  }
  /* THE WORK LINK, SHORTER (2026-11-17, the user: "schoology isn't reading the links the students are
     creating"). The link carried the whole file: every policy switch, the whole layout, the song's record
     and the time — 950 characters for Mary Had a Little Lamb, 2,100 for the Star Spangled Banner, where
     other apps' links had already been cut in Schoology at about 500. Now (`w: 2`) it carries what the
     teacher's side reads — the title, the version, the name, the score (core.js COMPACT LINES) — and the
     policy and layout only where they differ from WORK2_POLICY / WORK2_LAYOUT. Those two are FROZEN: the
     defaults as they were that day; a new default goes in a w: 3, never here. expandWork makes it the same
     object a file holds, and saveWorkLink checks it does, or sends the full one (as before). Files are
     unchanged (no length to keep down). */
  // (a new student version's own start — newVersionDraft — and the Music Page a fresh browser has, its `look`)
  const WORK2_POLICY = {
    v: 1, kind: 'student-version',
    task: { pitchLocked: false, rhythmLocked: false, wordsLocked: false, chordsLocked: false, note: '', melodyLocked: false },
    key: { locked: true },
    tempo: { mode: 'any', min: 60, max: 120 },
    shell: { sound: true, view: true, lookPage: false, strip: true, dock: true, sections: true, textEditor: true, picture: false, present: true, options: true, library: 'none' },
    save: { link: true, file: true },
    student: { askName: true },
    look: { playLight: 'note', followScroll: true, colours: true, showLane: true, noteNames: 'off' }
  };
  const WORK2_LAYOUT = {
    v: 1, notes: null, accidentals: true, rests: true, harmony: true, connected: true, chords: null, values: null, keys: null,
    scaleMorph: true, chordBend: true, show: { sectionTitles: true, keycaps: true, barNumbers: true }, locked: false
  };
  const plainObj = x => !!x && typeof x === 'object' && !Array.isArray(x);
  /* what `cur` changes in `base`: the keys that differ (objects key by key), undefined when nothing does;
     keys `base` has and `cur` lacks are listed under '-', so they can be taken out again */
  function diffFrom(base, cur) {
    if (ui.stableStringify(base) === ui.stableStringify(cur)) return undefined;
    if (!plainObj(base) || !plainObj(cur)) return cur;
    const out = {};
    Object.keys(cur).forEach(k => { const d = diffFrom(base[k], cur[k]); if (d !== undefined) out[k] = d; });
    const gone = Object.keys(base).filter(k => !(k in cur));
    if (gone.length) out['-'] = gone;
    return out;
  }
  function mergeOnto(base, d) {
    if (d === undefined) return cloneJson(base);
    if (!plainObj(base) || !plainObj(d)) return cloneJson(d);
    const out = cloneJson(base);
    Object.keys(d).forEach(k => { if (k !== '-') out[k] = mergeOnto(base[k], d[k]); });
    (Array.isArray(d['-']) ? d['-'] : []).forEach(k => { delete out[k]; });
    return out;
  }
  function workLinkData(full) {
    const song = full.song || {};
    const d = { w: 2, t: full.title };
    if (full.version && full.version.id) d.i = full.version.id;
    if (full.version && full.version.title && full.version.title !== full.title) d.vt = full.version.title;
    if (full.student && full.student.name) d.n = full.student.name;
    if (song.title !== full.title) d.st = song.title;
    const p = diffFrom(WORK2_POLICY, full.policy);
    if (p !== undefined) d.p = p;
    const l = diffFrom(WORK2_LAYOUT, full.layout);
    if (l !== undefined) d.l = l;
    const packed = ui.packScore(song.score);
    if (packed) d.c = packed; else d.s = song.score;
    return d;
  }
  /* a #work= link's data as the file's shape (an older link, or not w: 2, as it came) */
  function expandWork(d) {
    if (!d || d.w !== 2) return d;
    const title = typeof d.t === 'string' ? d.t : '';
    let score = null;
    try { score = d.c ? ui.unpackScore(d.c) : d.s; } catch (e) { score = null; }
    if (!score) return false;
    return {
      v: 1, kind: 'student-work', title,
      version: { id: d.i || '', title: d.vt || title },
      student: { name: d.n || '' },
      policy: mergeOnto(WORK2_POLICY, d.p),
      layout: mergeOnto(WORK2_LAYOUT, d.l),
      song: { title: d.st !== undefined ? d.st : title, score }
    };
  }
  /* the shorter link, when it reads back as this work; else the whole file, as before */
  function workForLink(full) {
    try {
      const d = workLinkData(full);
      const back = expandWork(JSON.parse(JSON.stringify(d)));
      const same = (a, b) => ui.stableStringify(a) === ui.stableStringify(b);
      if (back && same(back.policy, full.policy) && same(back.layout, full.layout) && same(back.song.score, full.song.score) &&
          back.song.title === full.song.title && back.title === full.title && same(back.version, full.version) && same(back.student, full.student)) return d;
    } catch (e) {}
    return full;
  }
  function saveWorkLink() {
    if (!linkOffered() || !nameFirst()) return;
    const link = SW.library.shortLinkFor(workForLink(workPayload()), 'work');
    SW.library.offerLink(link, $('sw-link-input'), $('sw-link-row'), $('sw-link-copy-text'), $('sw-link-feedback'));
  }
  function saveWorkFile() {
    if (!fileOffered() || !nameFirst()) return;
    downloadJson(workPayload(), workFileName());
    ui.toast('Saved “' + workFileName() + '” to your downloads');
  }
  /* A FILE BRINGS NOTHING LOCKED IN (2026-11-22, a lead in the bug report):
     a work file was taken whole, so one changed by hand — or saved before the
     teacher fixed more of the version — could change what the version keeps
     as it is. It must agree with the exercise as the teacher sent it (its
     pristine copy; in a preview, the page) in what nothing else they may do
     can move: the words (wordsLocked: none new or changed — with the rhythm
     theirs, a bar taken out on the Rhythm page can take its words with it,
     so fewer is allowed then); each note's length, tie and rest, and the
     time signature (rhythmLocked; a block counts as the beat, as it sounds);
     with the whole melody fixed, each note's pitches and key changes too
     (pitch alone is not checked: a rhythm change may rightly turn a note
     into a rest, or repeat it); the chords on the music, when the chords,
     the rhythm and the key are all fixed (a new time signature or scale
     moves them rightly); the key (key.locked); the tempo and swing (tempo
     locked); and how many parts, unless parts are theirs to add (Pitch,
     Rhythm and Lyrics all theirs). → what differs, in words. */
  function lockedChanges(was, now) {
    const t = policy.task, out = [];
    const lines = s => [].concat(...SW.parts.everyLine(s));
    const syls = s => [].concat(...lines(s).map(l => l.syllables || []));
    const cols = s => [].concat(...syls(s).map(sy => sy.cols || []));
    const isRest = c => (c.notes || []).length > 0 && c.notes.every(n => n.rest);
    const beat = s => SW.meters.byId(s.meter || SW.meters.DEFAULT).beatValue;
    const same = f => ui.stableStringify(f(was)) === ui.stableStringify(f(now));
    const words = s => syls(s).map(sy => String(sy.text || '').trim()).filter(x => x && x !== '-');
    if (t.wordsLocked) {
      const a = words(was), b = words(now);
      let i = 0;
      b.forEach(w => { while (i < a.length && a[i] !== w) i++; i++; });       // b in a's order, none new
      if (t.rhythmLocked ? a.join('\n') !== b.join('\n') : i > a.length) out.push('the words');
    }
    if (t.rhythmLocked && !same(s => [s.meter || '', cols(s).map(c => [c.v || beat(s), !!c.tie, isRest(c)])])) out.push('the rhythm');
    if (t.pitchLocked && t.rhythmLocked && !same(s => cols(s).map(c => [c.key || '', isRest(c) ? [] : (c.notes || []).map(n => [n.n, n.acc && n.acc !== 'natural' ? n.acc : ''])]))) out.push('the notes');
    if (t.chordsLocked && t.rhythmLocked && policy.key.locked && !same(s => [s.track || [], syls(s).map(sy => sy.chord || '').filter(Boolean)])) out.push('the chords');
    if (policy.key.locked && was.key !== now.key) out.push('the key');
    if (policy.tempo.mode === 'locked' && (was.bpm !== now.bpm || (was.swing || '') !== (now.swing || ''))) out.push('the tempo');
    if ((t.pitchLocked || t.rhythmLocked || t.wordsLocked) && SW.parts.countOf(was) !== SW.parts.countOf(now)) out.push('the parts');
    return out;
  }
  /* one of their own files, back into this version (what is on the page goes) */
  function openWorkFile(json) {
    if (!json || json.kind !== 'student-work' || !json.song || !json.song.score) {
      ui.toast('That file isn’t work saved from Song Writer');
      return;
    }
    const vid = json.version && json.version.id;
    if (vid && lessonMeta && lessonMeta.id && vid !== lessonMeta.id) {
      ui.toast('That file was saved from a different student version — open it from the link it came with');
      return;
    }
    const L = SW.library;
    const id = L.currentId();
    const score = L.normalizeSong({ id, title: L.currentTitle(), score: json.song.score }, id).score;
    const source = !previewing && readSources()[id];
    const was = source && source.score ? L.normalizeSong(source, id).score : SW.score.read();
    const locked = policy ? lockedChanges(was, score) : [];
    if (locked.length) {
      const list = locked.length === 1 ? locked[0] : locked.slice(0, -1).join(', ') + ' and ' + locked[locked.length - 1];
      ui.toast('That file changes ' + list + ', which this version keeps fixed, so it can’t open here.', 9000);
      return;
    }
    ui.ask({ title: 'Open “' + (json.title || 'your saved work') + '”?', text: 'It takes the place of what is on the page now.', yes: 'Open it', danger: true })
      .then(ok => { if (ok) putWorkFile(json, id, score); });
  }
  function putWorkFile(json, id, score) {
    const L = SW.library;
    if (id !== L.currentId()) return;                  // (another song came up meanwhile)
    if (previewing) SW.score.render(score);            // a preview saves nothing
    else {
      const library = L.getStoredLibrary();
      library[id] = L.normalizeSong(Object.assign({}, library[id] || {}, { id, score, updatedAt: Date.now() }), id);
      L.saveStoredLibrary(library);
      L.loadSongById(id);
    }
    if (asksName() && !studentName().trim() && json.student && json.student.name) setStudentName(json.student.name);
    ui.closeSheet('save-work-sheet');
    ui.toast('Opened your saved work');
  }

  /* ==================================================================
     RETURNED WORK, FOR THE TEACHER (2026-11-15). A #work= link, or Share
     & backup → Restore from a backup given a 'student-work' or a
     'student-version' file, asks one question first (#returned-sheet):
       • Open as they had it — VIEWING: the restricted shell, the song held
         in memory (library.js holdVisiting) and the layout too
         (settings.js holdLayout), a bar like the preview's; nothing filed,
         nothing saved;
       • Open with everything — filed into the library as a received song
         (read-only, with Save my copy, as links are), titled
         “Title — Name”, and opened in the whole app.
     Never in the Recording Studio's frame (as lessons).
     ================================================================== */
  const VIEW_ID = 'viewing_student_work';
  let viewing = null;       // { data, back } while a student's work is open as they had it
  let pendingReturned = null;

  function checkUrlForWork() {
    const raw = ui.linkParam('work');
    if (!raw) return null;
    const data = expandWork(ui.decodeJson(raw));        // (w: 2, the shorter link — THE WORK LINK, SHORTER)
    return (data && data.kind === 'student-work' && data.song) ? data : false;
  }
  function returnedParts(data) {
    const work = data.kind === 'student-work';
    const song = work ? data.song : (Array.isArray(data.songs) ? data.songs[0] : null);
    const name = work && data.student && data.student.name ? String(data.student.name).trim().slice(0, 40) : '';
    const songTitle = (song && typeof song.title === 'string' && song.title.trim()) || (typeof data.title === 'string' && data.title.trim()) || 'Untitled Song';
    const versionTitle = work ? (data.version && data.version.title) || '' : (data.title || '');
    return { work, song, name, songTitle, versionTitle, filedTitle: name ? songTitle + ' — ' + name : songTitle };
  }
  function offerReturned(data) {
    if (window.EVM_STUDIO_EMBED || !data) return false;
    const r = returnedParts(data);
    if (!r.song || (!r.song.score && !r.song.content)) return false;
    pendingReturned = data;
    $('rt-title').textContent = r.work ? (r.name ? r.name + '’s work' : 'A student’s work') : 'A student version';
    $('rt-sub').textContent = r.work
      ? '“' + r.songTitle + '”' + (r.versionTitle && r.versionTitle !== r.songTitle ? ', from the student version “' + r.versionTitle + '”' : '') + '. How do you want to open it?'
      : '“' + (r.versionTitle || r.songTitle) + '”, made from “' + r.songTitle + '”. How do you want to open it?';
    $('rt-as-had-note').textContent = r.work
      ? 'In the smaller app they worked in, just as they had it. Nothing is added to your library.'
      : 'The smaller app, as your students get it. Nothing is added to your library.';
    $('rt-everything-note').textContent = 'Adds it to your library as a shared song, “' + r.filedTitle + '”, and opens it with every tool.';
    ui.closeSheet('importExportModal');
    ui.openSheet('returned-sheet');
    return true;
  }

  /* A student's part of the id their work is filed under (2026-11-22, bug
     report M23). It was slugify(name) alone, so every name in another
     alphabet (王小明, 李华, محمد, 김민준 — all "lesson") and Alex / alex /
     ALEX! shared one id, and one student's work replaced another's. Now the
     name as written, exactly, picks it: the letters a slug keeps, then a
     short hash of the whole name. Work filed before under the old id stays
     there and is still replaced by the same student's next hand-in — when
     that copy is theirs (its title, “Song — Name”, ends with their name as
     written). */
  function hashName(s) {
    let h = 2166136261;                               // FNV-1a, 32 bits
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  }
  function studentTag(name, tag, library) {
    const n = String(name || '');
    const plain = n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
    const old = library['work_' + tag + '_' + slugify(n)];
    if (old && typeof old.title === 'string' && old.title.endsWith(' — ' + n)) return slugify(n);
    return (plain ? plain + '-' : '') + hashName(n);
  }

  function fileReturned(data, quiet) {
    const L = SW.library;
    if (!quiet && !L.okToLeave('opens their work')) return;
    L.save();
    const r = returnedParts(data);
    // one copy a student a version: their next hand-in replaces it (two students never share one)
    const tag = alnumTag(r.work ? data.version && data.version.id : data.id) || 'x';
    const library = L.getStoredLibrary();
    const id = r.work ? 'work_' + tag + '_' + (r.name ? studentTag(r.name, tag, library) : alnumTag(Date.now())) : 'version_' + tag;
    const now = Date.now();
    const was = library[id];
    const rec = L.normalizeSong(Object.assign({}, r.song, { id, title: r.filedTitle, isCustom: true, received: true, receivedAt: now,
      createdAt: (was && was.createdAt) || now, updatedAt: now }), id);
    ['layout', 'book', 'derivedFrom'].forEach(k => { delete rec[k]; });
    library[id] = rec;
    L.saveStoredLibrary(library);
    L.loadSongById(id);
    L.renderLibrarySongList();
    ui.toast((was ? 'Updated “' : 'Added “') + rec.title + '” — in your library, under Shared with you');
  }

  function startViewing(data) {
    const L = SW.library;
    if (previewing) return;
    if (!L.okToLeave('opens their work')) return;
    L.save();
    const r = returnedParts(data);
    const p = data.policy ? normalizePolicy(Object.assign({}, data.policy, { kind: 'student-version' })) : null;
    if (!p) { ui.toast('That work came without its settings, so it can only open with everything'); return; }
    viewing = { data, back: L.currentId(), autoSave: L.autoSaveChoice() };      // (back with auto-save as it was: L24)
    L.holdVisiting(VIEW_ID, Object.assign({}, r.song, { title: r.songTitle, isCustom: true }));
    policy = p;
    lessonMeta = { title: r.versionTitle || r.songTitle, songIds: [VIEW_ID], id: '', kind: p.kind };
    previewing = true;
    SW.settings.holdLayout(data.layout);
    $('viewing-text').textContent = r.work
      ? (r.name ? 'Viewing ' + r.name + '’s work as they had it' : 'Viewing this work as they had it')
      : 'Viewing “' + (r.versionTitle || r.songTitle) + '” as your students have it';
    $('viewing-bar').hidden = false;
    ['returned-sheet', 'importExportModal', 'library-sheet', 'save-work-sheet'].forEach(id => ui.closeSheet(id));
    SW.settings.applyPolicyToShell();
    L.loadSongById(VIEW_ID);
  }
  /* back to the whole app; the held song stays until the next one is open (a save
     before then finds it received, and writes nothing) */
  function endViewing() {
    if (!viewing) return null;
    const v = viewing;
    viewing = null;
    previewing = false;
    policy = null;
    lessonMeta = null;
    $('viewing-bar').hidden = true;
    SW.settings.releaseLayout();
    SW.settings.applyPolicyToShell();
    return v;
  }
  function closeViewing() {
    const v = endViewing();
    if (!v) return;
    const L = SW.library;
    const library = L.getStoredLibrary();
    if (v.back && v.back !== VIEW_ID && library[v.back]) L.loadSongById(v.back, { autoSave: v.autoSave });
    else L.loadSongById(L.ensureSandbox());
    L.dropVisiting(VIEW_ID);
  }
  function viewingToEverything() {
    const v = endViewing();
    if (!v) return;
    fileReturned(v.data, true);
    SW.library.dropVisiting(VIEW_ID);
  }

  /* app.js start(), once everything is up: a #work= link asks its question */
  function afterStart() {
    if (window.EVM_STUDIO_EMBED) return;
    const work = checkUrlForWork();
    if (work === null) return;
    SW.library.clearLinkFromAddress();
    if (work === false) {
      ui.toast('This link to a student’s work came through incomplete, so it can’t open — it was probably cut short. Ask them for the link again, or for the file.', 10000);
      return;
    }
    offerReturned(work);
  }

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
      /* not a student's returned work ("Song — Name", work_…): a lesson link
         would carry it, name and all, to the whole class (bug report L26).
         It can still be ticked by hand. */
      draft.songIds = SW.library.getSortedSongIds().filter(id => String(id).indexOf('work_') !== 0);
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
      const link = SW.library.shortLinkFor(buildLessonPayload(), 'lesson');
      SW.library.offerLink(link, $('lesson-link-input'), $('lesson-link-row'), $('lesson-link-copy-text'), $('lesson-link-feedback'));
    });
    $('lesson-link-copy').addEventListener('click', () => {
      const input = $('lesson-link-input');
      if (input.value) SW.library.offerLink(input.value, input, null, $('lesson-link-copy-text'), $('lesson-link-feedback'));
    });
    wireVersionSheet();
    wireSaveWork();
    wireReturned();
  }

  function wireVersionSheet() {
    $('studentVersionBtn').addEventListener('click', openVersionSheet);
    $('sv-tempo-seg').addEventListener('click', e => {
      const b = e.target.closest('.seg-btn');
      if (!b) return;
      sv.policy.tempo.mode = b.dataset.tempo;
      renderVersionSheet(true);
    });
    const readRange = () => {
      const t = sv.policy.tempo;
      const lo = parseInt($('sv-tempo-min').value, 10), hi = parseInt($('sv-tempo-max').value, 10);
      if (!isNaN(lo)) t.min = SW.meters.clampBpm(lo);
      if (!isNaN(hi)) t.max = SW.meters.clampBpm(hi);
      if (t.min > t.max) { const x = t.min; t.min = t.max; t.max = x; }
    };
    ['change', 'blur'].forEach(ev => {
      $('sv-tempo-min').addEventListener(ev, () => { readRange(); renderVersionSheet(true); });
      $('sv-tempo-max').addEventListener(ev, () => { readRange(); renderVersionSheet(true); });
    });
    $('sv-save-link').addEventListener('change', e => { sv.policy.save.link = e.target.checked; renderVersionSheet(true); });
    $('sv-save-file').addEventListener('change', e => {
      sv.policy.save.file = e.target.checked;
      if (!STUDENT_LINKS) sv.policy.save.link = false;       // LINKS OFF: the file box is the whole choice
      renderVersionSheet(true);
    });
    $('sv-note').addEventListener('input', e => { sv.policy.task.note = e.target.value.slice(0, 160); });
    $('sv-title').addEventListener('input', e => { sv.title = e.target.value; });
    $('sv-preview-btn').addEventListener('click', previewVersion);
    $('sv-link-btn').addEventListener('click', () => {
      if (!versionRecord()) { ui.toast('That song is no longer in your library'); return; }
      ensureVersionTitle();
      storeVersion();
      renderSavedVersions();
      const link = SW.library.shortLinkFor(versionPayload(), 'lesson');
      SW.library.offerLink(link, $('sv-link-input'), $('sv-link-row'), $('sv-link-copy-text'), $('sv-link-feedback'));
    });
    $('sv-link-copy').addEventListener('click', () => {
      const input = $('sv-link-input');
      if (input.value) SW.library.offerLink(input.value, input, null, $('sv-link-copy-text'), $('sv-link-feedback'));
    });
    $('sv-file-btn').addEventListener('click', () => {
      if (!versionRecord()) { ui.toast('That song is no longer in your library'); return; }
      ensureVersionTitle();
      storeVersion();
      renderSavedVersions();
      const name = (fileSafe(sv.title) || 'Student version') + '.json';
      downloadJson(versionPayload(), name);
      ui.toast('Saved “' + name + '” to your downloads');
    });
  }

  function wireSaveWork() {
    $('save-work-btn').addEventListener('click', openSaveWork);
    $('sw-name-ok').addEventListener('click', takeName);
    $('sw-name').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); takeName(); } });
    $('sw-name').addEventListener('input', e => {
      // once they have a name, changes to it are kept as they type (cleared: asked for again)
      if (!$('sw-name-ok').hidden) return;
      setStudentName(e.target.value.trim());
      $('sw-file-note').textContent = 'Saves “' + workFileName() + '” to your downloads, to upload or email — or to open here again later.';
      if (!e.target.value.trim()) renderSaveWork();
    });
    $('sw-link').addEventListener('click', saveWorkLink);
    $('sw-link-copy').addEventListener('click', () => {
      const input = $('sw-link-input');
      if (input.value) SW.library.offerLink(input.value, input, null, $('sw-link-copy-text'), $('sw-link-feedback'));
    });
    $('sw-file').addEventListener('click', saveWorkFile);
    $('sw-open').addEventListener('click', () => $('sw-open-input').click());
    $('sw-open-input').addEventListener('change', e => readJsonFile(e.target, openWorkFile));
  }

  function wireReturned() {
    $('rt-as-had').addEventListener('click', () => {
      const d = pendingReturned;
      pendingReturned = null;
      ui.closeSheet('returned-sheet');
      if (d) startViewing(d);
    });
    $('rt-everything').addEventListener('click', () => {
      const d = pendingReturned;
      pendingReturned = null;
      ui.closeSheet('returned-sheet');
      if (d) fileReturned(d);
    });
    $('viewing-close-btn').addEventListener('click', closeViewing);
    $('viewing-everything-btn').addEventListener('click', viewingToEverything);
  }

  // the exercise open in this tab, for a reload
  SW.bus.on('song:opened', d => { if (lessonMeta && !previewing) rememberOpenLesson(d.id); });

  SW.lessons = {
    init, bootFromUrl, restoreSong, afterStart, addExercise,
    policy: () => policy,
    meta: () => lessonMeta,
    isPreviewing: () => previewing,
    isViewing: () => !!viewing,
    shellAllows, libraryMode, taskBlurb, isStudentVersion, saveOffered, offerReturned,
    normalizePolicy
  };
})();

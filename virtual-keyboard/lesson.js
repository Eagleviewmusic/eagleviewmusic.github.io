/* ==========================================================================
   Virtual Keyboard — lesson.js
   WORKSPACES and LINKS: the Library's Create a Link and Save Workspace.

   A WORKSPACE is the keyboard (key, scale, sound, Flex… — getLayout) and
   everything in the recorder, saved under a name in this browser (WS_KEY)
   and listed in the Library above the scales; never in the scale menu.
   Open puts it on screen (one step of the recorder's Undo gives back what
   was there); a recording not saved in any workspace is asked about first.

   CREATE A LINK sends the Scale (the keyboard alone) or the Workspace (with
   the recorder). With Lock link off, a scale link is the plain ?layout=
   link and a workspace link opens as itself. With it on, the link is a
   LESSON: the parts the teacher ticks stay as they are (LESSON.locks in
   script.js) — for a scale: the scale, the key, Flex, recording; for a
   workspace: the scale, the key, Flex, the time signature, the tempo,
   Quantize (locked on, with its rhythm, or off) and the tracks to play
   along with.

   A link that opens a workspace or a lesson (#workspace=~… / #lesson=~…)
   takes the place of the student's own things, which stay untouched: what
   they record, and their octaves, sounds and so on, are kept in this
   browser under the link (LESSONS_KEY), so opening it again carries on.
   "Start again" goes back to the teacher's version; "Send my work as a
   link" sends it with their tracks in it; "Leave" brings back their own. A
   lesson made in this browser shows "Edit this lesson" too: it becomes a
   saved workspace, unlocked, with its locks waiting in Create a Link.

   On the wire, deflated after Song Writer's short links (nothing uploaded):
     { format: 'evm-item', formatVersion: 1, app: 'virtual-keyboard',
       kind: 'lesson' | 'workspace', title, data: {
         title, layout (getLayout), scaleRecord (one of my scales, if used),
         project (the recorder's, compact, notes left for the parts to make;
                  none in a scale link),
         what: 'scale' | 'workspace',                         (a lesson's)
         locks: { scale, key, layout, record, meter, tempo: true|false,
                  quant: { on: true, grid, feel } | { on: false } | null,
                  tracks: [0…3] } } }                          (a lesson's)
   A link's id is a hash of its data: the same link is the same id wherever
   it is opened, and a changed one is new. (The first lesson links locked
   the key and scale as one `key`: that still locks both.)
   ========================================================================== */
(() => {
  if (STUDIO) return; // the Recording Studio's keyboard has no workspaces or links

  const LESSONS_KEY = 'virtual_keyboard_lessons_v1';            // id -> { work, layout, at }: a student's own work in each link
  const MADE_KEY = 'virtual_keyboard_lessons_made_v1';          // ids of the lessons made in this browser (the teacher's)
  const SETUP_KEY = 'virtual_keyboard_lesson_setup_v1';         // Create a Link's last choices
  const WS_KEY = 'virtual_keyboard_workspaces_v1';              // the saved workspaces, newest first
  const WS_CURRENT_KEY = 'virtual_keyboard_workspace_current_v1'; // the one last saved or opened
  const KEEP_MAX = 30;                                          // links kept per browser (the oldest go)
  const LOCK_DEFAULTS = { scale: true, key: true, layout: true, record: false, meter: true, tempo: false };
  const LOCKS_FOR = { scale: ['scale', 'key', 'layout', 'record'], workspace: ['scale', 'key', 'layout', 'meter', 'tempo'] };
  const GRIDS = [4, 8, 16], FEELS = ['none', 'swing8', 'swing16', 'triplets'];
  const TRACK_COLORS = ['#F0525A', '#F4A21C', '#2DB86A', '#3B95E6'];
  const el = id => document.getElementById(id);

  // -------- PACKING A LINK --------
  function b64url(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64url(str) {
    const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  // '~' + deflated JSON; plain base64url JSON where the browser cannot deflate.
  async function packLink(obj) {
    const json = JSON.stringify(obj);
    if (typeof CompressionStream === 'function') {
      try {
        const buf = await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('deflate'))).arrayBuffer();
        return '~' + b64url(new Uint8Array(buf));
      } catch (e) {}
    }
    return b64url(new TextEncoder().encode(json));
  }
  async function unpackLink(str) {
    try {
      if (str[0] !== '~') return decodeLink(str);
      if (typeof DecompressionStream !== 'function') return null;
      const text = await new Response(new Blob([unb64url(str.slice(1))]).stream().pipeThrough(new DecompressionStream('deflate'))).text();
      return JSON.parse(text);
    } catch (e) { return null; }
  }
  // The same data, the same text: keys sorted all the way down.
  function stable(v) {
    if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
    if (v && typeof v === 'object') {
      return '{' + Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
    }
    const s = JSON.stringify(v);
    return s === undefined ? 'null' : s;
  }
  function hash32(str, seed) {
    let h = seed >>> 0;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  const linkId = (kind, data) => { const s = stable(data); return kind + '-' + hash32(s, 2166136261).toString(36) + hash32(s, 0x9747b28c).toString(36); };

  // The address's link, if it has one (#lesson=… / #workspace=…, or in ?…).
  function linkParam() {
    const re = /(?:^|[#?&])(lesson|workspace)=([^&#]*)/;
    const m = re.exec(location.hash) || re.exec(location.search);
    if (!m || !m[2]) return null;
    let value = m[2];
    try { value = decodeURIComponent(value); } catch (e) {}
    return { kind: m[1], value };
  }
  const sameParam = (a, b) => !!a && !!b && a.kind === b.kind && a.value === b.value;
  function clearAddress() {
    if (!history.replaceState) return;
    const search = location.search.replace(/([?&])(?:lesson|workspace)=[^&#]*&?/, '$1').replace(/[?&]$/, '');
    const hash = /(?:lesson|workspace)=/.test(location.hash) ? '' : location.hash;
    history.replaceState(null, '', location.pathname + search + hash);
  }

  // A link or a file: an envelope, a bundle holding one, or the bare data.
  function readLink(obj, kind) {
    if (!obj || typeof obj !== 'object') return null;
    if (obj.format === 'evm-bundle' && Array.isArray(obj.items)) {
      const it = obj.items.find(x => x && x.app === APP_SLUG && x.kind === kind);
      return it ? it.data : null;
    }
    if (obj.format === 'evm-item') return obj.app === APP_SLUG && obj.kind === kind ? obj.data : null;
    return obj.layout ? obj : null;
  }
  function cleanQuantLock(q) {
    if (!q || typeof q !== 'object') return null;
    if (q.on === false) return { on: false };
    if (q.on === true && GRIDS.includes(q.grid) && FEELS.includes(q.feel)) return { on: true, grid: q.grid, feel: q.feel };
    return null;
  }
  function cleanLocks(L) {
    L = L && typeof L === 'object' ? L : {};
    const yes = k => L[k] === true;
    return {
      scale: L.scale === undefined ? yes('key') : yes('scale'), // (the first lessons' `key` was the key and scale)
      key: yes('key'), layout: yes('layout'), record: yes('record'), meter: yes('meter'), tempo: yes('tempo'),
      quant: cleanQuantLock(L.quant),
      tracks: Array.isArray(L.tracks) ? [...new Set(L.tracks.filter(i => Number.isInteger(i) && i >= 0 && i < 4))].sort() : []
    };
  }
  const anyLock = L => ['scale', 'key', 'layout', 'record', 'meter', 'tempo'].some(k => L[k]) || !!L.quant || L.tracks.length > 0;
  // Anything missing or unknown falls back, so every link opens.
  function cleanLink(d, kind) {
    if (!d || typeof d !== 'object' || !d.layout || typeof d.layout !== 'object') return null;
    const title = cleanName(d.title) || (kind === 'lesson' ? 'Lesson' : 'Workspace');
    const scale = d.scaleRecord ? cleanScale(d.scaleRecord) : null;
    const layout = { ...d.layout };
    if (scale) layout.scale = scale.id;
    const what = kind === 'lesson' && d.what === 'scale' ? 'scale' : 'workspace';
    const locks = cleanLocks(kind === 'lesson' ? d.locks : null);
    if (what === 'scale') { locks.meter = locks.tempo = false; locks.quant = null; locks.tracks = []; }
    else locks.record = false;
    return { title, what, layout, scale, project: d.project && typeof d.project === 'object' ? d.project : {}, locks };
  }
  // The recorder's project for a link or a workspace: the notes the parts let
  // through are worked out again when it opens, so they stay behind.
  function slim(p) {
    return { ...p, tracks: (p.tracks || []).map(tr => { const t = { ...tr }; if ((t.clips && t.clips.length) || !(t.notes && t.notes.length)) delete t.notes; return t; }) };
  }
  const recordOf = s => ({ id: s.id, title: s.title, degrees: s.degrees, tonic: s.tonic, base: s.base, updatedAt: s.updatedAt });
  const scaleRecordOf = scaleId => { const s = customScale(scaleId); return s ? recordOf(s) : undefined; };
  const envelope = (kind, data) => ({ format: 'evm-item', formatVersion: 1, app: APP_SLUG, kind, title: data.title, data });
  const linkFor = (kind, packed) => location.origin + location.pathname + '#' + kind + '=' + packed;
  const cleanName = t => (typeof t === 'string' ? t.replace(/\s+/g, ' ').trim().slice(0, 60) : '');
  const fileName = t => t.replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ').trim();

  // Copy a link that is still being made: Safari only lets the clipboard be
  // written inside the click, so it is handed a promise of the text there.
  function copyLater(promise) {
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      try {
        const item = new ClipboardItem({ 'text/plain': promise.then(t => new Blob([t], { type: 'text/plain' })) });
        return navigator.clipboard.write([item]).then(() => true, () => promise.then(copyText));
      } catch (e) {}
    }
    return promise.then(copyText);
  }
  function downloadJSON(obj, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj, null, 1)], { type: 'application/json' }));
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  // -------- STORAGE --------
  function readJSON(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v && typeof v === 'object' ? v : fallback; } catch (e) { return fallback; }
  }
  let warned = false;
  function writeSlot(id, patch) {
    const all = readJSON(LESSONS_KEY, {});
    all[id] = { ...(all[id] || {}), ...patch, at: Date.now() };
    Object.keys(all).sort((a, b) => (all[b].at || 0) - (all[a].at || 0)).slice(KEEP_MAX).forEach(k => { delete all[k]; });
    try { localStorage.setItem(LESSONS_KEY, JSON.stringify(all)); }
    catch (e) { if (!warned) { warned = true; toast('This browser would not keep your work. Send it as a link, or save an MP3, before you close.'); } }
  }
  function dropSlot(id) {
    const all = readJSON(LESSONS_KEY, {});
    delete all[id];
    try { localStorage.setItem(LESSONS_KEY, JSON.stringify(all)); } catch (e) {}
  }
  const madeList = () => { const v = readJSON(MADE_KEY, []); return Array.isArray(v) ? v : []; };
  function markMade(id) {
    const list = [id, ...madeList().filter(x => x !== id)].slice(0, 200);
    try { localStorage.setItem(MADE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  const readSetup = () => readJSON(SETUP_KEY, {});
  function storeSetup(s) { try { localStorage.setItem(SETUP_KEY, JSON.stringify(s)); } catch (e) {} }

  // -------- WORDS --------
  const listWords = xs => xs.length <= 1 ? (xs[0] || '') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];
  const trackWords = ids => (ids.length === 1 ? 'track ' : 'tracks ') + listWords(ids.map(i => String(i + 1)));
  const layoutWord = d => (d.layout === 'chromatic' ? 'Chromatic' : 'Flex');
  const recorded = p => !!p && Array.isArray(p.tracks) && p.tracks.some(t => (t.clips && t.clips.length) || (t.notes && t.notes.length));
  const trackCount = p => (p.tracks || []).filter(t => (t.clips && t.clips.length) || (t.notes && t.notes.length)).length;
  const tracksWord = n => `${n} ${n === 1 ? 'track' : 'tracks'}`;

  // -------- SAVED WORKSPACES --------
  // { id, title, savedAt, layout, scaleRecord?, project, from? (the link or
  // file it came from), link? (Create a Link's choices for it) }
  const okWs = w => !!w && typeof w === 'object' && typeof w.id === 'string' && typeof w.title === 'string' && !!w.layout && typeof w.layout === 'object';
  function readWorkspaces() { const v = readJSON(WS_KEY, []); return Array.isArray(v) ? v.filter(okWs) : []; }
  function writeWorkspaces(list) { try { localStorage.setItem(WS_KEY, JSON.stringify(list)); return true; } catch (e) { return false; } }
  const newWsId = () => 'ws-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
  const byTitle = (list, t) => list.find(w => w.title.toLowerCase() === t.toLowerCase());
  function uniqueWsTitle(base, list = readWorkspaces()) {
    if (!byTitle(list, base)) return base;
    for (let n = 2; ; n++) if (!byTitle(list, `${base} ${n}`)) return `${base} ${n}`;
  }
  // The workspace on screen: the one last saved or opened here (none while a link is open).
  function currentWs() {
    if (LESSON) return null;
    let id = null;
    try { id = localStorage.getItem(WS_CURRENT_KEY); } catch (e) {}
    return id ? readWorkspaces().find(w => w.id === id) || null : null;
  }
  function setCurrent(id) { try { if (id) localStorage.setItem(WS_CURRENT_KEY, id); else localStorage.removeItem(WS_CURRENT_KEY); } catch (e) {} }
  // What is on screen, as a workspace keeps it.
  function screenData() {
    const layout = getLayout();
    const data = { layout, project: slim(Recorder.snapshot()) };
    const rec = scaleRecordOf(layout.scale);
    if (rec) data.scaleRecord = rec;
    return data;
  }
  // The music only (what was played, the tempo, the time signature): a sound
  // or a mute changed since is not "unsaved".
  const musicSig = p => stable({ tempo: p.tempo, meter: p.meter, tracks: (p.tracks || []).map(t => ({ loop: !!t.loop, clips: (t.clips || []).map(c => [c.b, c.o, c.d, c.len, c.loop || 0, c.items]) })) });
  // This browser's own recording has notes no saved workspace holds.
  function ownUnsaved() {
    const p = Recorder.ownProject();
    if (!recorded(p)) return false;
    const sig = musicSig(p);
    return !readWorkspaces().some(w => w.project && musicSig(w.project) === sig);
  }

  // The scale a workspace plays, for its row: its own record, else a known scale.
  function wsScale(w) {
    const rec = w.scaleRecord ? cleanScale(w.scaleRecord) : null;
    if (rec) return { id: rec.id, title: rec.title, degrees: rec.degrees };
    const id = isKnownScale(w.layout.scale) ? w.layout.scale : 'major';
    const s = scaleOf(id);
    return { id, title: s.isCustom ? s.title : s.name, degrees: s.degrees };
  }
  let wsPending = null; // { id, what: 'delete' | 'open', note }: a row asking first
  function renderWorkspaces() {
    const list = el('ws-list'), all = readWorkspaces(), cur = currentWs(), now = getLayout();
    list.innerHTML = '';
    el('ws-empty').hidden = all.length > 0;
    all.forEach(w => {
      const item = document.createElement('div');
      item.className = 'lib-item mine';
      item.dataset.ws = w.id;
      if (cur && cur.id === w.id && now.key === w.layout.key && now.scale === w.layout.scale) item.classList.add('current'); // (still on screen)
      const sc = wsScale(w);
      const key = pitchIndex[w.layout.key] !== undefined ? PHYSICAL_NAMES[pitchIndex[w.layout.key]] : 'C';
      const tonic = isKnownScale(sc.id) ? tonicName(key, sc.id) : prettyNote(Theory.tonicName(pitchIndex[key], 'major'));
      const title = document.createElement('div');
      title.className = 'lib-title';
      title.innerHTML = `<span class="lib-swatch">${sc.degrees.map(d => `<i style="background:${noteColor((pitchIndex[key] + Theory.degreeSemis(d)) % 12)}"></i>`).join('')}</span>`;
      title.append(w.title);
      const meta = document.createElement('div');
      meta.className = 'lib-meta';
      const actions = document.createElement('div');
      actions.className = 'lib-actions';
      const pending = wsPending && wsPending.id === w.id ? wsPending : null;
      if (pending) item.classList.add('confirming');
      if (pending && pending.what === 'delete') {
        meta.textContent = `Delete “${w.title}”? It can’t be brought back.`;
        actions.append(smallBtn('Delete', 'btn-danger', () => deleteWs(w)),
                       smallBtn('Keep', '', () => { wsPending = null; renderWorkspaces(); }));
      } else if (pending) {
        meta.textContent = `What is in the recorder now is not saved as a workspace. Open “${w.title}” in its place? The recorder’s Undo brings it back; Save Workspace keeps it first.`;
        actions.append(smallBtn('Open', 'btn-danger', () => openWorkspace(w, pending.note)),
                       smallBtn('Cancel', '', () => { wsPending = null; renderWorkspaces(); }));
      } else {
        const p = w.project || {}, n = trackCount(p);
        const when = Date.parse(w.savedAt) ? new Date(w.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
        meta.textContent = [`${tonic} ${sc.title}`, n ? `${tracksWord(n)}, ${p.tempo || 90} bpm` : 'nothing recorded', when].filter(Boolean).join(' · ');
        actions.append(smallBtn('Open', 'btn-primary', () => requestOpen(w)),
                       smallBtn('Download', '', () => downloadWs(w)),
                       smallBtn('Delete', 'btn-quiet', () => { wsPending = { id: w.id, what: 'delete' }; renderWorkspaces(); }));
      }
      item.append(title, actions, meta);
      list.appendChild(item);
    });
  }

  // Open a workspace, asking first (in its row) when the recording here is not saved.
  function requestOpen(w, note) {
    if (ownUnsaved()) {
      if (!librarySheet.classList.contains('open')) openLibrary();
      wsPending = { id: w.id, what: 'open', note };
      renderWorkspaces();
      const row = el('ws-list').querySelector(`[data-ws="${w.id}"]`);
      if (row) row.scrollIntoView({ block: 'nearest' });
      return;
    }
    openWorkspace(w, note);
  }
  function openWorkspace(w, note) {
    wsPending = null;
    if (LESSON) leave(); // (a link open with nothing locked: its work stays kept with it)
    const layout = { ...w.layout };
    if (w.scaleRecord) { layout.scaleRecord = w.scaleRecord; takeScaleRecord(layout); delete layout.scaleRecord; } // (its scale joins My scales)
    const had = recorded(Recorder.snapshot());
    Recorder.adoptProject(w.project || {}, `opening “${w.title}”`, () => applyLayout(layout), 'auto');
    setCurrent(w.id);
    closeSheet('library-sheet');
    toast(note || (`Opened “${w.title}”` + (had ? '. The recorder’s Undo brings back what was there.' : '')));
  }
  function deleteWs(w) {
    const ok = writeWorkspaces(readWorkspaces().filter(x => x.id !== w.id));
    const cur = currentWs();
    if (cur && cur.id === w.id) setCurrent(null);
    wsPending = null;
    renderWorkspaces();
    toast(ok ? `Deleted “${w.title}”` : `Deleted “${w.title}” for now: this browser would not save the change`);
  }
  // -------- FILES: DOWNLOAD JSON / UPLOAD JSON --------
  // Every file is Eagle View Music's (EVM Library/README.md §7): an envelope
  // per thing, several in a bundle. The Library's Download JSON is ONE
  // bundle with everything: the keyboard and recorder as they are now
  // (`onScreen`), every saved workspace, and My scales. A workspace's tracks
  // keep their parts and the notes they play, each note a MIDI note number
  // on the song's beats: { m: 60, b: 0, d: 0.5 } is middle C on beat 1 for
  // half a beat. Upload JSON reads that, a workspace, a lesson, a scale, the
  // recorder's own project file, or a scale link's layout (script.js).
  const ABOUT = 'Virtual Keyboard (eagleviewmusic.com/virtual-keyboard): saved workspaces (the keyboard, its scale and the recorder tracks), scales, and what was on screen. In a track, each note is { m: MIDI note number, b: the beat it starts on, d: how many beats it lasts }.';
  const item = (kind, id, title, created, updated, data) =>
    ({ format: 'evm-item', formatVersion: 1, app: APP_SLUG, kind, id, title, createdAt: created, updatedAt: updated, data });
  // A workspace as a file holds it: its keyboard, scale, link choices, and
  // its tracks in full (the parts and the notes they play).
  function wsData(w) {
    const data = { title: w.title, layout: w.layout, project: Recorder.full(w.project || {}) };
    if (w.scaleRecord) data.scaleRecord = w.scaleRecord;
    if (w.link) data.link = w.link;
    return data;
  }
  function downloadWs(w) {
    const name = `${fileName(w.title) || 'Keyboard workspace'} (workspace).json`;
    const at = Date.parse(w.savedAt) || Date.now();
    downloadJSON(item('workspace', w.id, w.title, at, at, wsData(w)), name);
    libraryStatus.textContent = `Downloaded ${name}. Upload JSON brings it back, on any computer.`;
  }
  // What is on screen, and the whole Library, as one bundle.
  function libraryBundle() {
    const now = Date.now(), d = screenData(), p = Recorder.snapshot();
    const items = [item('workspace', 'on-screen', `On screen: ${cleanName(p.name) || layoutTitle(d.layout)}`, now, now,
      { title: `On screen: ${cleanName(p.name) || layoutTitle(d.layout)}`, layout: d.layout, scaleRecord: d.scaleRecord, project: Recorder.full(p), onScreen: true })];
    readWorkspaces().forEach(w => { const at = Date.parse(w.savedAt) || now; items.push(item('workspace', w.id, w.title, at, at, wsData(w))); });
    myScalesInOrder().forEach(s => items.push(item('scale', s.id, s.title, Date.parse(s.createdAt) || now, Date.parse(s.updatedAt) || now,
      { degrees: s.degrees, tonic: s.tonic, base: s.base })));
    return { format: 'evm-bundle', formatVersion: 1, app: APP_SLUG, title: 'Virtual Keyboard library', savedAt: new Date(now).toISOString(), about: ABOUT, items };
  }
  el('download-json-btn').addEventListener('click', () => {
    const bundle = libraryBundle();
    const day = new Date();
    const name = `Virtual Keyboard library ${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}.json`;
    downloadJSON(bundle, name);
    const nWs = bundle.items.filter(x => x.kind === 'workspace' && !x.data.onScreen).length, nSc = bundle.items.filter(x => x.kind === 'scale').length;
    const tracks = trackCount(Recorder.snapshot());
    libraryStatus.textContent = `Downloaded ${name}: ${nWs} saved ${nWs === 1 ? 'workspace' : 'workspaces'}, ${nSc} ${nSc === 1 ? 'scale' : 'scales'}, and the keyboard and recorder as they are now (${tracks ? tracksWord(tracks) : 'nothing recorded'}). Upload JSON brings them back, on any computer.`;
  });

  // A workspace or a lesson from a file (or a lesson's Edit): filed with the
  // saved workspaces — once: the same id, the same link, or a saved
  // workspace of the same name and music (the one a lesson was made from)
  // is the one already there. A lesson keeps its locks for Create a Link.
  // Returns { w, added }.
  function fileWorkspace(raw, kind, id, savedAt) {
    const d = cleanLink(raw, kind);
    if (!d) return null;
    const from = linkId(kind, raw);
    const list = readWorkspaces();
    const sig = musicSig(d.project);
    const have = (id && list.find(x => x.id === id)) || list.find(x => x.from === from)
      || list.find(x => x.title === d.title && x.project && musicSig(x.project) === sig);
    if (have) {
      if (kind === 'lesson') { have.link = { what: d.what, lock: true, locks: d.locks }; writeWorkspaces(list); }
      return { w: have, added: false };
    }
    const w = { id: typeof id === 'string' && /^ws-[a-z0-9-]{1,40}$/.test(id) ? id : newWsId(), title: uniqueWsTitle(d.title, list),
                savedAt: typeof savedAt === 'string' && Date.parse(savedAt) ? savedAt : new Date().toISOString(),
                from, layout: d.layout, project: slim(d.project) };
    if (d.scale) w.scaleRecord = recordOf(d.scale);
    if (kind === 'lesson') w.link = { what: d.what, lock: true, locks: d.locks };
    else if (raw.link && typeof raw.link === 'object') w.link = raw.link;
    writeWorkspaces([w, ...list]);
    return { w, added: true };
  }
  function openFile(kind, raw, id) {
    const got = fileWorkspace(raw, kind, id);
    if (!got) return false;
    renderWorkspaces();
    requestOpen(got.w, kind === 'lesson' ? `“${got.w.title}” is a saved workspace now, unlocked. Create a Link has its locks.` : `Opened “${got.w.title}”. It is in your saved workspaces.`);
    return true;
  }
  // A scale from a file: in My scales (once), on the keyboard.
  function fileScale(env) {
    const iso = t => (Number.isFinite(t) ? new Date(t).toISOString() : undefined);
    const rec = cleanScale({ ...(env.data || {}), id: env.id, title: env.title, createdAt: iso(env.createdAt), updatedAt: iso(env.updatedAt) });
    if (!rec) return null;
    const d = { scaleRecord: rec };
    const added = takeScaleRecord(d);
    return { rec: myScaleById[d.scale] || rec, added };
  }
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  // Upload JSON (script.js hands over every file but a layout). True when it was ours.
  function upload(obj, name) {
    if (!obj || typeof obj !== 'object') return false;
    const mine = x => !!x && typeof x === 'object' && x.format === 'evm-item' && x.app === APP_SLUG;
    let items;
    if (obj.format === 'evm-bundle' && Array.isArray(obj.items)) items = obj.items.filter(mine);
    else if (mine(obj)) items = [obj];
    else if (Array.isArray(obj.tracks)) items = [{ kind: 'recording', data: obj }]; // the recorder's project, bare
    else return false;
    if (!items.some(x => ['workspace', 'lesson', 'scale', 'recording'].includes(x.kind))) return false; // (a layout: script.js)
    const status = libraryStatus;
    const titled = x => ({ ...(x.data || {}), title: (x.data && x.data.title) || x.title });
    // one thing: open it
    if (items.length === 1) {
      const x = items[0];
      if (x.kind === 'workspace' || x.kind === 'lesson') {
        if (x.data && x.data.onScreen) return upload({ format: 'evm-bundle', formatVersion: 1, items }, name);
        if (!openFile(x.kind, titled(x), x.id)) status.textContent = `That ${x.kind} file could not be read.`;
        return true;
      }
      if (x.kind === 'scale') {
        const got = fileScale(x);
        if (!got) { status.textContent = 'That scale file could not be read.'; return true; }
        useMyScale(got.rec); // (redraws the Library, scales and all)
        status.textContent = `Opened “${got.rec.title}”.` + (got.added ? ' It is in your scales now.' : '');
        return true;
      }
      if (x.kind === 'recording') {
        if (!x.data || typeof x.data !== 'object') { status.textContent = 'That recording could not be read.'; return true; }
        Recorder.adoptProject(x.data, `opening ${name}`, () => {}, true);
        closeSheet('library-sheet');
        toast(`Opened the tracks in ${name}. The recorder’s Undo brings back what was there.`);
        return true;
      }
    }
    // a bundle: scales and workspaces join the Library; what was on screen comes back on screen
    let scalesAdded = 0, wsAdded = 0, wsHere = 0, screen = null;
    items.filter(x => x.kind === 'scale').forEach(x => { const got = fileScale(x); if (got && got.added) scalesAdded++; });
    items.filter(x => (x.kind === 'workspace' || x.kind === 'lesson') && !(x.data && x.data.onScreen)).forEach(x => {
      const got = fileWorkspace(titled(x), x.kind, x.id, x.updatedAt ? new Date(x.updatedAt).toISOString() : undefined);
      if (got) { if (got.added) wsAdded++; else wsHere++; }
    });
    const on = items.find(x => x.kind === 'workspace' && x.data && x.data.onScreen);
    const parts = [];
    if (wsAdded) parts.push(`${plural(wsAdded, 'workspace', 'workspaces')} added`);
    if (wsHere) parts.push(`${plural(wsHere, 'workspace was', 'workspaces were')} here already`);
    if (scalesAdded) parts.push(`${plural(scalesAdded, 'scale', 'scales')} added`);
    if (on) {
      const raw = titled(on), d = cleanLink(raw, 'workspace');
      if (d && recorded(d.project)) {
        // its tracks: the saved workspace that holds the same music, or a new one, then opened
        const sig = musicSig(d.project), list = readWorkspaces();
        const twin = list.find(x => x.project && musicSig(x.project) === sig);
        const got = twin ? { w: twin, added: false } : fileWorkspace(raw, 'workspace');
        if (got) { screen = got.w; if (got.added) parts.push(`the tracks that were on screen saved as “${got.w.title}”`); }
      } else if (d) { // nothing recorded: its keyboard only
        const layout = { ...d.layout };
        if (d.scale) { layout.scaleRecord = recordOf(d.scale); takeScaleRecord(layout); delete layout.scaleRecord; }
        applyLayout(layout);
      }
    }
    window.renderLibrary(); // (script.js's: the scales too)
    const said = parts.length ? `From ${name}: ${listWords(parts)}.` : `Everything in ${name} was here already.`;
    status.textContent = said;
    if (screen) requestOpen(screen, `${said} The tracks are back in the recorder.`);
    else if (!items.some(x => x.kind !== 'scale') && !parts.length) status.textContent = `Every scale in ${name} was here already.`;
    return true;
  }

  // -------- SAVE WORKSPACE --------
  const wsName = el('ws-name');
  let wsBack = false; // opened from the Library: back there after
  function defaultWsName() {
    const p = Recorder.snapshot();
    return uniqueWsTitle(cleanName(p.name) || (LESSON ? LESSON.title : `${layoutTitle(getLayout())} workspace`));
  }
  const typedWsName = () => cleanName(wsName.value) || wsName.placeholder;
  function openSaveSheet() {
    const cur = currentWs();
    wsName.value = cur ? cur.title : '';
    wsName.placeholder = defaultWsName();
    wsBack = librarySheet.classList.contains('open');
    librarySheet.classList.remove('open'); // (it comes back when this closes)
    renderSaveSheet();
    openSheet('ws-sheet');
    setTimeout(() => { wsName.focus(); wsName.select(); }, 60);
  }
  function renderSaveSheet() {
    const title = typedWsName(), same = byTitle(readWorkspaces(), title);
    const d = getLayout(), p = Recorder.snapshot(), n = trackCount(p);
    el('ws-what').textContent = [layoutTitle(d), Audio.PRESETS[d.sound].name, layoutWord(d), d.octaves + (d.octaves === 1 ? ' octave' : ' octaves'),
      n ? `${tracksWord(n)} recorded, ${p.tempo} bpm` : 'nothing recorded yet'].join(' · ');
    el('ws-replace').hidden = !same;
    el('ws-replace').textContent = same ? `A workspace called “${same.title}” is saved already: this replaces it.` : '';
    el('ws-save').textContent = same ? 'Replace' : 'Save';
  }
  function saveWorkspace() {
    const title = typedWsName();
    const list = readWorkspaces(), same = byTitle(list, title);
    const data = screenData();
    if (!data.project.name) data.project.name = title; // (the name song files take)
    const w = { id: same ? same.id : newWsId(), title, savedAt: new Date().toISOString(), ...data };
    if (same && same.link) w.link = same.link;
    const ok = writeWorkspaces([w, ...list.filter(x => x !== same)]);
    if (!LESSON) setCurrent(w.id);
    closeSheet('ws-sheet');
    toast(ok ? `Saved “${title}” in the Library` : `“${title}” could not be saved: this browser will not keep any more. Download a workspace or two, then delete them.`);
  }
  onSheetClose['ws-sheet'] = () => { if (wsBack) openLibrary(); };
  el('save-ws-btn').addEventListener('click', openSaveSheet);
  wsName.addEventListener('input', renderSaveSheet);
  wsName.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveWorkspace(); } });
  el('ws-save').addEventListener('click', saveWorkspace);

  // -------- CREATE A LINK --------
  const LK = { what: 'workspace', lock: false };
  const lkChecks = { scale: el('lk-scale'), key: el('lk-key'), layout: el('lk-layout'), record: el('lk-record'), meter: el('lk-meter'), tempo: el('lk-tempo') };
  let lkTracks = [];  // the track checkboxes, by track: null for an empty track
  let lkName = { auto: '', typed: false }; // a workspace link takes the workspace's name, until one is typed
  let gen = 0;        // the link being made: a change since means it is not shown
  const radio = (name, v) => document.querySelector(`input[name="${name}"][value="${v}"]`);
  const radioValue = name => (document.querySelector(`input[name="${name}"]:checked`) || {}).value;

  function defaultTitle() {
    if (LESSON) return LESSON.title;
    const d = getLayout();
    if (LK.what === 'scale') return layoutTitle(d);
    return cleanName(Recorder.snapshot().name) || `${layoutTitle(d)} workspace`;
  }
  function openLinkSheet() {
    const cur = currentWs();
    const own = cur && cur.link; // the choices this workspace's link had last time
    const s = own || readSetup();
    const p = Recorder.snapshot();
    LK.what = s.what === 'scale' || s.what === 'workspace' ? s.what : (recorded(p) ? 'workspace' : 'scale');
    LK.lock = s.lock === true;
    const L = s.locks && typeof s.locks === 'object' ? s.locks : {};
    Object.keys(lkChecks).forEach(k => {
      lkChecks[k].checked = typeof L[k] === 'boolean' ? L[k] : k === 'scale' && typeof L.key === 'boolean' ? L.key : LOCK_DEFAULTS[k];
    });
    const q = cleanQuantLock(L.quant);
    radio('lk-quant', q ? (q.on ? 'on' : 'off') : 'free').checked = true;
    radio('lk-qgrid', q && q.on ? q.grid : p.quant.grid).checked = true;
    radio('lk-qfeel', q && q.on ? q.feel : p.quant.feel).checked = true;
    lkName = { auto: cur ? cur.title : '', typed: false };
    // the tracks with notes: ticked, or as this workspace's link had them
    const box = el('lk-tracks');
    box.innerHTML = '';
    lkTracks = p.tracks.map((tr, i) => {
      if (!(tr.clips && tr.clips.length) && !(tr.notes && tr.notes.length)) return null;
      const label = document.createElement('label');
      label.className = 'choice';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = own && Array.isArray(L.tracks) ? L.tracks.includes(i) : true;
      cb.addEventListener('change', changed);
      const body = document.createElement('span');
      body.className = 'choice-body';
      const sound = Audio.PRESETS[tr.sound] ? Audio.PRESETS[tr.sound].name : tr.sound;
      body.innerHTML = `<span class="choice-title"><span class="ls-num" style="--tc:${TRACK_COLORS[i]}">${i + 1}</span>Track ${i + 1} · ${sound}${tr.loop ? ' · loops' : ''}</span>`
        + `<span class="choice-note">${tr.loop
          ? 'Students can mute it, change its sound, and pull the loop longer or back to one pass, but not record over it, edit it or delete it.'
          : 'Students can mute it and change its sound, but not move it, record over it, edit it or delete it.'}</span>`;
      label.append(cb, body);
      box.appendChild(label);
      return cb;
    });
    const empty = lkTracks.map((cb, i) => (cb ? -1 : i)).filter(i => i >= 0);
    el('lk-tracks-note').textContent = empty.length === 4
      ? 'Nothing is recorded yet. Record an ostinato first (Record, then the loop button) if students should play along with one.'
      : empty.length ? `${empty.length === 1 ? 'Track' : 'Tracks'} ${listWords(empty.map(i => String(i + 1)))} ${empty.length === 1 ? 'is' : 'are'} empty: students record there.` : '';
    clearLink(false);
    el('lk-status').textContent = '';
    renderLink();
    librarySheet.classList.remove('open'); // (the link takes its place)
    openSheet('link-sheet');
    el('link-sheet').querySelector('.sheet-scroll').scrollTop = 0;
  }
  function quantChoice() {
    const mode = radioValue('lk-quant');
    if (mode === 'off') return { on: false };
    if (mode !== 'on') return null;
    const grid = +radioValue('lk-qgrid'), feel = radioValue('lk-qfeel');
    return { on: true, grid: GRIDS.includes(grid) ? grid : 8, feel: FEELS.includes(feel) && Recorder.feelFits(grid, feel) ? feel : 'none' };
  }
  // The locks this kind of link has, as ticked.
  function lockChoices() {
    const locks = {};
    LOCKS_FOR[LK.what].forEach(k => { locks[k] = lkChecks[k].checked; });
    if (LK.what === 'workspace') {
      locks.quant = quantChoice();
      locks.tracks = lkTracks.map((cb, i) => (cb && cb.checked ? i : -1)).filter(i => i >= 0);
    }
    return locks;
  }
  function renderLink() {
    const sheet = el('link-sheet'), d = getLayout(), p = Recorder.snapshot(), ws = LK.what === 'workspace';
    sheet.classList.toggle('lk-scale', !ws);
    sheet.classList.toggle('lk-workspace', ws);
    sheet.classList.toggle('lk-locked', LK.lock);
    sheet.querySelectorAll('.lk-seg-btn').forEach(b => b.setAttribute('aria-checked', String(b.dataset.what === LK.what)));
    el('lk-lock').setAttribute('aria-checked', String(LK.lock));
    el('lk-name-row').hidden = !ws && !LK.lock; // (a plain scale link is called by its key and scale)
    if (!lkName.typed) el('lk-name').value = ws ? lkName.auto : '';
    el('lk-name').placeholder = defaultTitle();
    const n = trackCount(p);
    el('lk-carries').textContent = ws
      ? `${layoutTitle(d)}, the keyboard, and everything in the recorder: ${n ? tracksWord(n) : 'nothing recorded yet'}, ${p.tempo} bpm, ${p.meter}.`
      : `${layoutTitle(d)} and the keyboard: the sound, Flex or Chromatic, octaves, Focus, key colors, names and view. Not the recorder.`;
    el('lk-scale-title').textContent = `Scale: ${scaleName(d.scale)}`;
    el('lk-key-title').textContent = `Key: ${tonicName(d.key, d.scale)}`;
    el('lk-layout-title').textContent = `Computer keys: ${layoutWord(d)}`;
    el('lk-layout-note').textContent = `Students can show or hide the letters on the piano keys, but not switch to ${d.layout === 'chromatic' ? 'Flex' : 'Chromatic'}.`;
    el('lk-meter-title').textContent = `Time signature: ${p.meter}`;
    el('lk-tempo-title').textContent = `Tempo: ${p.tempo} bpm`;
    // Quantize locked on asks which rhythm; a feel that does not fit it is greyed
    const mode = radioValue('lk-quant'), grid = +radioValue('lk-qgrid');
    el('lk-quant-on').hidden = mode !== 'on';
    FEELS.forEach(f => {
      const r = radio('lk-qfeel', f), fits = Recorder.feelFits(grid, f);
      r.disabled = !fits;
      r.closest('.chip').classList.toggle('off', !fits);
    });
    if (!Recorder.feelFits(grid, radioValue('lk-qfeel'))) radio('lk-qfeel', 'none').checked = true;
    const q = quantChoice();
    el('lk-quant-note').textContent = mode === 'on' ? `Every note students record lands on ${Recorder.quantWords(q)}. In place of the Quantize button: that rhythm, with a lock.`
      : mode === 'off' ? 'What students record stays just as they played it. In place of the Quantize button: “Quantize Off”, with a lock.'
      : 'Students turn Quantize on and off, and choose its rhythm, themselves.';
    renderFree();
  }
  function renderFree() {
    if (!LK.lock) { el('lk-free').innerHTML = ''; return; }
    const L = lockChoices(), ws = LK.what === 'workspace';
    const free = ['the sounds', 'how many octaves show', 'the key names and colors', 'the volume and room'];
    if (!L.scale) free.push('the scale');
    if (!L.key) free.push('the key');
    if (!L.layout) free.push('Flex or Chromatic');
    if (ws && !L.tempo) free.push('the tempo');
    if (ws && !L.meter) free.push('the time signature');
    if (ws && !L.quant) free.push('Quantize');
    let tail;
    if (ws) {
      const open = [0, 1, 2, 3].filter(i => !L.tracks.includes(i));
      tail = open.length ? ` They record on ${trackWords(open)}.` : ' Every track is locked, so there is none to record on.';
    } else tail = L.record ? ' They play, but do not record.' : ' They can record on all four tracks.';
    el('lk-free').innerHTML = `<b>Students can always change</b> ${listWords(free)}.` + tail;
  }
  function clearLink(note) {
    gen++;
    const had = !!el('lk-link').value;
    el('lk-link').value = '';
    el('lk-copy').disabled = true;
    if (note && had) el('lk-status').textContent = 'Changed: press Generate link for the new link.';
  }
  function changed() { clearLink(true); renderLink(); }
  // What the link holds: the plain scale link is script.js's ?layout=.
  function buildLink() {
    const d = getLayout();
    const data = { title: cleanName(el('lk-name').value) || defaultTitle(), layout: d };
    const rec = scaleRecordOf(d.scale);
    if (rec) data.scaleRecord = rec;
    if (LK.what === 'workspace') data.project = slim(Recorder.snapshot());
    if (!LK.lock) return { kind: 'workspace', data };
    data.what = LK.what;
    data.locks = lockChoices();
    return { kind: 'lesson', data };
  }
  // Remembered for next time — and with the workspace on screen, for it.
  function storeChoices() {
    const locks = {};
    Object.keys(lkChecks).forEach(k => { locks[k] = lkChecks[k].checked; });
    locks.quant = quantChoice();
    locks.tracks = lkTracks.map((cb, i) => (cb && cb.checked ? i : -1)).filter(i => i >= 0);
    const s = { what: LK.what, lock: LK.lock, locks };
    storeSetup(s);
    const cur = currentWs();
    if (cur) {
      const list = readWorkspaces(), w = list.find(x => x.id === cur.id);
      if (w) { w.link = s; writeWorkspaces(list); }
    }
  }

  el('make-link-btn').addEventListener('click', openLinkSheet);
  el('link-sheet').querySelectorAll('.lk-seg-btn').forEach(b => b.addEventListener('click', () => {
    if (LK.what === b.dataset.what) return;
    LK.what = b.dataset.what;
    changed();
  }));
  el('lk-lock').addEventListener('click', () => { LK.lock = !LK.lock; changed(); });
  Object.values(lkChecks).forEach(cb => cb.addEventListener('change', changed));
  document.querySelectorAll('input[name="lk-quant"], input[name="lk-qgrid"], input[name="lk-qfeel"]').forEach(r => r.addEventListener('change', changed));
  el('lk-name').addEventListener('input', () => { lkName.typed = true; clearLink(true); });

  el('lk-generate').addEventListener('click', () => {
    storeChoices();
    const status = el('lk-status'), mine = ++gen;
    const show = url => {
      if (mine !== gen) return;
      el('lk-link').value = url;
      el('lk-copy').disabled = false;
      el('lk-link').select();
    };
    if (LK.what === 'scale' && !LK.lock) {
      const url = layoutLink();
      show(url);
      copyText(url).then(ok => {
        if (mine === gen) status.textContent = (ok ? 'Link copied. ' : 'Copy the link above to send it. ') + 'Anyone who opens it gets this scale and keyboard; their own recording stays as it is.';
      });
      return;
    }
    const { kind, data } = buildLink();
    if (kind === 'lesson') markMade(linkId(kind, data));
    const link = packLink(envelope(kind, data)).then(p => linkFor(kind, p));
    status.textContent = 'Making the link…';
    copyLater(link).then(ok => link.then(url => {
      if (mine !== gen) return;
      const size = `${url.length.toLocaleString()} characters`;
      status.textContent = (ok ? 'Link copied. ' : 'Copy the link above. ') + (kind === 'lesson'
        ? `Students who open it get “${data.title}” with these locks (${size}). Try it in a private window to see it as they will.`
        : `Anyone who opens it gets “${data.title}” to play with, kept apart from their own things (${size}).`);
    }));
    link.then(show);
  });
  el('lk-copy').addEventListener('click', () => {
    copyText(el('lk-link').value).then(ok => { el('lk-status').textContent = ok ? 'Link copied.' : 'Select the link and copy it.'; });
  });
  el('lk-download').addEventListener('click', () => {
    storeChoices();
    const status = el('lk-status');
    if (LK.what === 'scale' && !LK.lock) { status.textContent = `Downloaded ${downloadLayout()}.`; return; }
    const { kind, data } = buildLink();
    if (kind === 'lesson') markMade(linkId(kind, data));
    if (data.project) data.project = Recorder.full(data.project); // (a file keeps the tracks in full)
    const name = `${fileName(data.title) || 'Keyboard ' + kind} (${kind}).json`;
    downloadJSON(envelope(kind, data), name);
    status.textContent = `Downloaded ${name}. The Library’s Upload JSON brings it back, on any computer` + (kind === 'lesson' ? ', unlocked, to change.' : '.');
  });

  // -------- A LINK OPEN --------
  let ownLayout = null;   // what was on screen before a link opened: Leave brings it back
  let layoutTimer = 0;
  let restarting = false; // Start again pressed once: asking first

  function enter(raw, kind) {
    const d = cleanLink(raw, kind);
    if (!d) return false;
    const id = linkId(kind, raw);
    const slot = readJSON(LESSONS_KEY, {})[id] || null;
    if (!LESSON) ownLayout = getLayout();
    // the link's scale, kept apart from My scales
    lessonScales = d.scale ? { [d.scale.id]: d.scale } : {};
    fillScaleSelect();
    const layout = normalizeLayout(d.layout);
    LESSON = { id, kind, what: d.what, title: d.title, locks: d.locks, locked: anyLock(d.locks), layout, raw,
               teacher: kind === 'lesson' && madeList().includes(id), ready: false };
    restarting = false;
    wsPending = null;
    // the student's own choices since (octaves, sounds…); applyLayout keeps the locked ones the lesson's
    const show = slot && slot.layout ? normalizeLayout(slot.layout) : layout;
    const keep = data => writeSlot(id, { work: data, layout: getLayout() });
    Recorder.openLesson(slot && slot.work ? slot.work : d.project, keep, () => applyLayout(show));
    LESSON.ready = true;
    renderChrome();
    return true;
  }
  function flushLayout() {
    clearTimeout(layoutTimer);
    layoutTimer = 0;
    if (LESSON && LESSON.ready) writeSlot(LESSON.id, { layout: getLayout() });
  }
  function leave() {
    if (!LESSON) return;
    flushLayout();
    LESSON = null;
    lessonScales = {};
    fillScaleSelect();
    const own = ownLayout || DEFAULT_LAYOUT;
    Recorder.leaveLesson(() => applyLayout(own));
    renderChrome();
    clearAddress();
    opened = null; // (the same link opened again in this tab opens it again)
  }
  function restart() {
    if (!LESSON) return;
    const { id, raw, kind } = LESSON;
    Recorder.flush();          // nothing left on its way to being kept…
    clearTimeout(layoutTimer);
    LESSON.ready = false;
    dropSlot(id);              // …then the student's work goes, and the link opens afresh
    enter(raw, kind);
  }

  // The Library's card: what is open, what is locked, and the ways out.
  function renderLessonCard() {
    if (!LESSON) return;
    const L = LESSON.locks, d = LESSON.layout, p = Recorder.snapshot(), isLesson = LESSON.kind === 'lesson';
    el('lesson-heading').textContent = isLesson ? 'This lesson' : 'This workspace';
    el('lesson-name').innerHTML = LESSON.locked ? LOCK_SVG : '';
    el('lesson-name').append(LESSON.title);
    const T = s => s[0].toUpperCase() + s.slice(1);
    if (!LESSON.locked) {
      el('lesson-locked').innerHTML = '<b>Nothing is locked.</b> It came as a link, so it is kept apart from your own things.';
      el('lesson-free').innerHTML = 'Save Workspace keeps a copy among your own.';
    } else {
      const locked = [], free = ['the sounds', 'how many octaves show', 'the key names and colors'];
      if (L.scale && L.key) locked.push(`the key and scale (${tonicName(d.key, d.scale)} ${scaleName(d.scale)})`);
      else if (L.scale) { locked.push(`the scale (${scaleName(d.scale)})`); free.push('the key'); }
      else if (L.key) { locked.push(`the key (${tonicName(d.key, d.scale)})`); free.push('the scale'); }
      else free.push('the key and scale');
      if (L.layout) locked.push(`${layoutWord(d)} on the computer keys`); else free.push('Flex or Chromatic');
      if (L.record) locked.push('recording');
      if (LESSON.what === 'workspace') {
        if (L.meter) locked.push(`the time signature (${p.meter})`); else free.push('the time signature');
        if (L.tempo) locked.push(`the tempo (${p.tempo} bpm)`); else free.push('the tempo');
        if (L.quant) locked.push(L.quant.on ? `Quantize, on ${Recorder.quantWords(L.quant)}` : 'Quantize, off'); else free.push('Quantize');
      }
      const mine = [0, 1, 2, 3].filter(i => !L.tracks.includes(i));
      el('lesson-locked').innerHTML = (locked.length ? `<b>Locked:</b> ${listWords(locked)}.` : '<b>Nothing else is locked.</b>')
        + (L.tracks.length ? ` ${T(trackWords(L.tracks))} ${L.tracks.length === 1 ? 'is' : 'are'} for playing along: mute, or pull a loop longer or shorter.` : '');
      el('lesson-free').innerHTML = `<b>Yours to change:</b> ${listWords(free)}.`
        + (L.record ? '' : mine.length ? ` Record on ${trackWords(mine)}.` : '');
    }
    el('lesson-kept').textContent = L.record
      ? 'Your octaves, sounds and so on are kept in this browser: open the link again to carry on.'
      : 'What you record is kept in this browser: open the link again to carry on.';
    el('lesson-send').hidden = L.record; // (nothing recorded to send)
    el('lesson-leave').textContent = isLesson ? 'Leave the lesson' : 'Leave this workspace';
    el('lesson-edit').hidden = !LESSON.teacher;
    el('lesson-actions').hidden = restarting;
    el('lesson-confirm').hidden = !restarting;
    if (restarting) el('lesson-status').textContent = isLesson
      ? 'Start again? Everything you recorded in this lesson goes, and the teacher’s version comes back.'
      : 'Start again? Everything you changed and recorded here goes, and the workspace comes back as it was sent.';
  }
  function renderLibrary() {
    renderLessonCard();
    renderWorkspaces();
  }
  function openLessonInfo() {
    el('lesson-share-row').hidden = true;
    el('lesson-status').textContent = '';
    restarting = false;
    openLibrary();
  }
  el('lesson-lock').addEventListener('click', openLessonInfo);

  el('lesson-send').addEventListener('click', () => {
    if (!LESSON) return;
    const kind = LESSON.kind;
    const data = { ...LESSON.raw, layout: getLayout(), project: slim(Recorder.snapshot()) };
    const link = packLink(envelope(kind, data)).then(p => linkFor(kind, p));
    const status = el('lesson-status');
    status.textContent = 'Making the link…';
    copyLater(link).then(ok => {
      status.textContent = ok ? `Link copied: paste it where your teacher asked. It opens this ${kind} with your tracks in it.` : 'Copy the link above and paste it where your teacher asked.';
    });
    link.then(url => {
      el('lesson-share-link').value = url;
      el('lesson-share-row').hidden = false;
      el('lesson-share-link').select();
    });
  });
  el('lesson-share-copy').addEventListener('click', () => {
    copyText(el('lesson-share-link').value).then(ok => { el('lesson-status').textContent = ok ? 'Link copied.' : 'Select the link and copy it.'; });
  });
  el('lesson-restart').addEventListener('click', () => { restarting = true; el('lesson-share-row').hidden = true; renderLessonCard(); });
  el('lesson-restart-no').addEventListener('click', () => { restarting = false; el('lesson-status').textContent = ''; renderLessonCard(); });
  el('lesson-restart-yes').addEventListener('click', () => {
    const isLesson = LESSON && LESSON.kind === 'lesson';
    restart();
    restarting = false;
    el('lesson-status').textContent = '';
    closeSheet('library-sheet');
    toast(isLesson ? 'Back to the start of the lesson.' : 'Back to the workspace as it was sent.');
  });
  el('lesson-leave').addEventListener('click', () => {
    const title = LESSON ? LESSON.title : '';
    leave();
    closeSheet('library-sheet');
    toast(`Left “${title}”. Its link brings it back, with your work.`);
  });
  // The teacher's own lesson: a saved workspace, unlocked, its locks waiting in Create a Link.
  el('lesson-edit').addEventListener('click', () => {
    if (!LESSON) return;
    const { raw, kind } = LESSON;
    leave();
    const got = fileWorkspace(raw, kind);
    if (got) requestOpen(got.w, `“${got.w.title}” is open to change, unlocked, and in your saved workspaces. Create a Link has its locks.`);
  });

  // -------- START --------
  window.VKLesson = {
    renderLibrary,
    upload,
    libraryOpened() { wsPending = null; },
    layoutChanged() {
      if (!LESSON || !LESSON.ready) return;
      clearTimeout(layoutTimer);
      layoutTimer = setTimeout(flushLayout, 400);
    }
  };
  // the work is kept as the page goes away (or out of sight on a phone)
  const keepAll = () => { if (LESSON) { Recorder.flush(); flushLayout(); } };
  window.addEventListener('pagehide', keepAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) keepAll(); });

  let opened = linkParam();
  // a link pasted into the address bar of the app already open
  window.addEventListener('hashchange', () => {
    const p = linkParam();
    if (p && !sameParam(p, opened)) { keepAll(); location.reload(); }
  });
  if (opened) {
    const kind = opened.kind;
    unpackLink(opened.value).then(obj => {
      const data = readLink(obj, kind);
      if (!data || !enter(data, kind)) {
        opened = null;
        clearAddress();
        toast('That link could not be read. It may have been cut short: ask for it again.');
        return;
      }
      const L = LESSON.locks;
      setTimeout(() => toast(kind === 'workspace'
        ? `Opened “${LESSON.title}”. What you change is kept with it; the Library has the way back to your own.`
        : `Lesson: “${LESSON.title}”` + (L.tracks.length ? `. Play along with ${trackWords(L.tracks)}, and record on the others.` : '.')), 300);
    });
  }
})();

/* ==========================================================================
   Recording Studio — bring-in.js
   Bringing an ostinato or a song in from the other apps, as tracks.

   Each app lends its music through a frame of its own, laid out off
   screen, in a guest mode that cannot write its storage (README.md,
   "Bringing songs in"):
     Ostinato Builder 2.0   ?embed=music-stand   window.MusicStandBridge
     Song Writer 3.0        ?embed=studio        window.SongWriterStudio
   The music is copied (D6): the track keeps where it came from, not a link.

   An ostinato becomes one track of hits, repeated; a song becomes a melody
   track and a chords track. Beats are the app's own beats — a 6/8 ostinato
   counts dotted quarters, as the studio does in 6/8.
   ========================================================================== */
(() => {
  'use strict';

  const APPS = {
    ostinato: {
      name: 'Ostinato Builder', url: '../Ostinato%20Builder%202.0/index.html?embed=music-stand', bridge: 'MusicStandBridge',
      blurb: 'An ostinato’s rhythms, on its own percussion — a loop: drag its end out for as many bars as you like.'
    },
    song: {
      name: 'Song Writer', url: '../Song%20Writer%203.0/index.html?embed=studio', bridge: 'SongWriterStudio',
      blurb: 'A song’s melody and its chords, each on a track of its own.'
    }
  };
  const el = id => document.getElementById(id);
  const body = el('bring-body');
  const title = el('bring-title');
  const holder = el('bridge-frames');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const frames = {};       // app key -> { iframe, ready: Promise<bridge|null> }
  let step = 0;            // which screen of the sheet is showing (a late answer for an old one is dropped)

  // -------- THE LENDING FRAMES --------
  function bridgeOf(key) {
    if (frames[key]) return frames[key].ready;
    const app = APPS[key];
    const f = document.createElement('iframe');
    f.className = 'bridge-frame';
    f.tabIndex = -1;
    f.title = app.name;
    f.src = app.url;
    holder.appendChild(f);
    const ready = new Promise(resolve => {
      f.addEventListener('load', async () => {
        for (let t = 0; t < 100; t++) {        // up to ten seconds for the app to set itself up
          let b = null;
          try { b = f.contentWindow[app.bridge]; } catch (e) {}
          if (b) { resolve(b); return; }
          await sleep(100);
        }
        resolve(null);
      }, { once: true });
    });
    frames[key] = { iframe: f, ready };
    ready.then(b => { if (!b) { delete frames[key]; f.remove(); } });
    return ready;
  }

  // -------- THE SHEET --------
  function open() {
    if (Studio.busy()) Studio.stop();
    showChoice();
    Studio.openSheet('bring-sheet');
  }
  el('bring-btn').addEventListener('click', open);

  function showChoice() {
    step++;
    title.textContent = 'Bring in';
    body.innerHTML = `
      <p class="sheet-hint">Make a part in another app, then bring it in here as tracks to play along with. It comes in as a copy — changing it in the other app later will not change it here.</p>
      <div class="source-cards">
        ${Object.keys(APPS).map(k => `
          <button class="source-card" type="button" data-src="${k}">
            <span class="source-icon">${k === 'ostinato' ? Studio.icon('ostinato') : Studio.icon('melody')}</span>
            <span class="source-text"><span class="source-name">${APPS[k].name}</span><span class="source-blurb">${APPS[k].blurb}</span></span>
          </button>`).join('')}
      </div>`;
    body.querySelectorAll('.source-card').forEach(b => b.addEventListener('click', () => showList(b.dataset.src)));
  }

  async function showList(key) {
    const my = ++step;
    const app = APPS[key];
    title.textContent = app.name;
    body.innerHTML = `<button class="link-btn back-link" type="button">‹ Back</button><div class="bring-wait">Opening ${app.name}…</div>`;
    body.querySelector('.back-link').addEventListener('click', showChoice);
    const bridge = await bridgeOf(key);
    if (my !== step) return;
    if (!bridge) {
      body.querySelector('.bring-wait').textContent = `${app.name} did not open here. Check it opens on its own in this browser, then try again.`;
      return;
    }
    let songs = [];
    try { songs = bridge.listSongs() || []; } catch (e) { console.error(e); }
    const groups = [];
    const put = (label, list) => { if (list.length) groups.push({ label, list }); };
    put('Sandbox', songs.filter(s => s.sandbox));
    const books = {};
    songs.filter(s => !s.sandbox && s.received).forEach(s => { const b = s.book || 'Shared with you'; (books[b] = books[b] || []).push(s); });
    Object.keys(books).forEach(b => put(b, books[b]));
    const mine = songs.filter(s => !s.sandbox && !s.received && (key === 'ostinato' ? s.isCustom : !s.starter));
    const starters = songs.filter(s => !s.sandbox && !s.received && (key === 'ostinato' ? !s.isCustom : s.starter));
    put(key === 'ostinato' ? 'My ostinatos' : 'My songs', mine);
    put(key === 'ostinato' ? 'Starters' : 'Built in', starters);
    const meta = s => key === 'ostinato'
      ? [s.meter ? s.meter.join('/') : '', s.bpm ? s.bpm + ' bpm' : '',
         s.sections > 1 ? s.sections + ' sections' : s.measures ? s.measures + (s.measures === 1 ? ' bar' : ' bars') : '', s.preview || ''].filter(Boolean).join(' · ')
      : [s.meter || '', s.bpm ? s.bpm + ' bpm' : ''].filter(Boolean).join(' · ');
    body.innerHTML = `<button class="link-btn back-link" type="button">‹ Back</button>` + (groups.length
      ? groups.map(g => `<section class="panel-section"><h3>${esc(g.label)}</h3><div class="pick-list">${g.list.map(s =>
          `<button class="pick-row" type="button" data-id="${esc(s.id)}"><span class="pick-title">${esc(s.title || 'Untitled')}</span><span class="pick-meta">${esc(meta(s))}</span></button>`).join('')}</div></section>`).join('')
      : `<p class="panel-note">Nothing in ${app.name} on this device yet. Make something there, then come back.</p>`);
    body.querySelector('.back-link').addEventListener('click', showChoice);
    body.querySelectorAll('.pick-row').forEach(b => b.addEventListener('click', () => showOptions(key, b.dataset.id)));
  }

  // -------- TURNING THE MUSIC INTO TRACKS --------
  /* An ostinato: one pass of hits, in its own beats, and how it is counted.
     One in sections offers each way through it as a `part` — its
     arrangement, every section in turn, or one section alone — and starts
     on the one it is set to play: a Looped ostinato goes round one section,
     so that one, alone. */
  function readOstinato(bridge, id) {
    const info = bridge.openLibrarySong(id);
    if (!info) return null;
    const snap = bridge.snapshot();
    const volumes = (snap.tracks || []).map(t => (typeof t.volume === 'number' && isFinite(t.volume) ? t.volume : 1));
    const muted = (info.voices || []).map(v => !!v.muted);
    const read = opts => {
      const tl = bridge.timeline(opts);
      return {
        beats: tl.totalBeats,
        hits: tl.notes
          .filter(n => !muted[n.voice] && info.voices[n.voice])
          .map(n => ({ i: info.voices[n.voice].instrument, b: n.tick / tl.beatTicks, g: volumes[n.voice] == null ? 1 : volumes[n.voice], r: n.gapTicks / tl.beatTicks }))
      };
    };
    const sec = info.sections;
    const parts = [];
    if (sec) {
      const steps = order => order.map(([s, x]) => (s + 1) + (x > 1 ? ' ×' + x : '')).join(' › ');
      if (sec.mode === 'arranged') parts.push(Object.assign({ key: 'arranged', label: 'Its arrangement: ' + steps(sec.order) }, read({ play: 'arranged' })));
      parts.push(Object.assign({ key: 'continuous', label: 'Every section in turn: ' + steps(sec.bars.map((_, k) => [k, 1])) }, read({ play: 'continuous' })));
      sec.bars.forEach((_, k) => parts.push(Object.assign({ key: 's' + k, label: 'Section ' + (k + 1) + ' alone' }, read({ section: k }))));
    } else {
      parts.push(Object.assign({ key: 'all', label: '' }, read()));
    }
    const start = !sec ? 'all' : sec.mode === 'loop' ? 's' + sec.current : sec.mode;
    const part = parts.find(p => p.key === start) || parts[0];
    return {
      id, title: info.title, meter: info.meter.join('/'), bpm: info.bpm,
      beats: part.beats, hits: part.hits, parts, part: part.key,
      instruments: (info.voices || []).filter((v, i) => !muted[i]).map(v => v.label)
    };
  }
  function readSong(bridge, id) {
    const plan = bridge.open(id);
    if (!plan) return null;
    return Object.assign({ id }, plan);
  }

  async function showOptions(key, id) {
    const my = ++step;
    const app = APPS[key];
    const bridge = await bridgeOf(key);
    if (my !== step || !bridge) return;
    let m = null;
    try { m = key === 'ostinato' ? readOstinato(bridge, id) : readSong(bridge, id); } catch (e) { console.error(e); }
    if (!m) { toastBack(key, 'That one could not be read.'); return; }
    const P = Studio.project;
    const empty = !P.tracks.some(Studio.hasContent);
    const sameTime = m.meter === P.meter;
    const known = !!Studio.METERS[m.meter];
    const bpb = Studio.barBeats();
    const barsOfPass = () => key === 'ostinato' ? m.beats / (Studio.METERS[m.meter] || bpb) : 0;
    const describe = () => [m.meter, m.bpm + ' bpm', key === 'ostinato'
      ? (barsOfPass() === 1 ? 'one bar' : barsOfPass() + ' bars') + ' · ' + m.instruments.join(', ') : ''].filter(Boolean).join(' · ');
    const passBars = barsOfPass();
    const choosePart = key === 'ostinato' && m.parts && m.parts.length > 1;
    const hasMelody = key === 'song' && m.melody && m.melody.length > 0;
    const hasChords = key === 'song' && m.chords && m.chords.length > 0;
    title.textContent = m.title || 'Untitled';
    body.innerHTML = `
      <button class="link-btn back-link" type="button">‹ ${esc(app.name)}</button>
      <section class="panel-section">
        <h3>How it comes in</h3>
        <p class="panel-note" id="bi-what">${esc(describe())}</p>
        ${choosePart ? `<label class="opt opt-part"><span>Which part</span><select class="select" id="bi-part">${m.parts.map(p =>
          `<option value="${esc(p.key)}"${p.key === m.part ? ' selected' : ''}>${esc(p.label)}</option>`).join('')}</select></label>` : ''}
        <div class="opt-grid">
          <label class="opt"><span>Starts at bar</span><input class="num-field" type="number" id="bi-bar" min="1" max="999" value="1"></label>
          ${key === 'ostinato' ? `<label class="opt"><span>Plays</span><span class="opt-inline"><input class="num-field" type="number" id="bi-times" min="1" max="64" value="${Math.max(1, Math.min(64, Math.round(8 / Math.max(1, passBars))))}"> times</span></label>` : ''}
        </div>
        ${key === 'song' ? `
          <div class="opt-checks">
            <label class="check"><input type="checkbox" id="bi-melody" ${hasMelody ? 'checked' : 'disabled'}><span>The melody, on a track${hasMelody ? '' : ' (this song has none)'}</span></label>
            <label class="check"><input type="checkbox" id="bi-chords" ${hasChords ? 'checked' : 'disabled'}><span>The chords, on a track${hasChords ? '' : ' (this song has none)'}</span></label>
          </div>` : ''}
        <label class="check"><input type="checkbox" id="bi-time" ${empty && known ? 'checked' : ''} ${known ? '' : 'disabled'}><span>Use its tempo (${m.bpm} bpm)${sameTime ? '' : ` and time (${esc(m.meter)})`}</span></label>
        <p class="panel-note" id="bi-note"></p>
        <div class="row-wrap"><button class="btn btn-primary" type="button" id="bi-go">Bring it in</button></div>
      </section>`;
    body.querySelector('.back-link').addEventListener('click', () => showList(key));
    const note = el('bi-note');
    const timeBox = el('bi-time');
    const renderNote = () => {
      const t = timeBox.checked;
      const parts = [];
      if (!t && !sameTime) parts.push(`It is in ${m.meter} and the project is in ${P.meter}: it keeps its beats, counted in the project’s bars.`);
      if (!t && m.bpm !== P.tempo) parts.push(`It will play at the project’s ${P.tempo} bpm.`);
      if (t && !empty && m.bpm !== P.tempo) parts.push(`The whole project will play at ${m.bpm} bpm.`);
      note.textContent = parts.join(' ');
    };
    timeBox.addEventListener('change', renderNote);
    renderNote();
    /* An ostinato in sections: the part chosen is the pass that is repeated. */
    if (choosePart) {
      el('bi-part').addEventListener('change', () => {
        const p = m.parts.find(x => x.key === el('bi-part').value);
        if (!p) return;
        m.part = p.key;
        m.beats = p.beats;
        m.hits = p.hits;
        el('bi-what').textContent = describe();
      });
    }
    el('bi-go').addEventListener('click', () => {
      const useTime = timeBox.checked;
      const meter = useTime ? m.meter : P.meter;
      const perBar = Studio.METERS[meter] || bpb;
      const bar = Math.max(1, Math.round(Number(el('bi-bar').value) || 1));
      const offset = (bar - 1) * perBar;
      const from = { app: key === 'ostinato' ? 'ostinato-builder' : 'song-writer', title: m.title || 'Untitled', id: String(m.id) };
      let tracks = [];
      if (key === 'ostinato') {
        const times = Math.max(1, Math.min(64, Math.round(Number(el('bi-times').value) || 1)));
        const hits = [];
        for (let k = 0; k < times; k++) m.hits.forEach(h => hits.push({ i: h.i, b: offset + k * m.beats + h.b, g: h.g, r: h.r }));
        if (!hits.length) { note.textContent = 'This ostinato has no sounds to bring in.'; return; }
        // a loop block: one pass, going round for `times` passes — drag its end out for more
        const items = m.hits.map(h => ({ i: h.i, b: h.b, g: h.g, r: h.r }));
        tracks.push({ kind: 'ostinato', hits, from, clips: [{ b: offset, o: 0, d: times * m.beats, len: m.beats, loop: m.beats, items }] });
      } else {
        const bt = m.beatTicks;
        const beat = t => offset + (t - (m.pickupTicks || 0)) / bt;
        const s = m.sounds || {};
        if (el('bi-melody').checked && hasMelody) {
          tracks.push({ kind: 'melody', from: { ...from, part: 'melody' },
            notes: m.melody.map(n => ({ m: n.midi, b: beat(n.at), d: Math.max(0.05, n.ticks / bt), s: s.melody || 'piano', v: songLevel(n.level, s.melodyVolume) })) });
        }
        if (el('bi-chords').checked && hasChords) {
          const notes = [];
          m.chords.forEach(c => c.midis.forEach(mm => notes.push({ m: mm, b: beat(c.at), d: Math.max(0.05, c.ticks / bt), s: s.chords || 'piano', v: chordLevel(c.level, c.midis.length, s.chordVolume) })));
          tracks.push({ kind: 'chords', from: { ...from, part: 'chords' }, notes });
        }
        if (!tracks.length) { note.textContent = 'Choose the melody, the chords, or both.'; return; }
      }
      const placed = Studio.bringIn(tracks, {
        label: 'bringing in ' + (m.title || 'a song'),
        tempo: useTime ? m.bpm : null,
        meter: useTime && !sameTime ? m.meter : null,
        key: key !== 'ostinato' && m.key ? { name: m.key, scale: m.scale } : null   // the instruments play in the song's key
      });
      if (!placed) { note.textContent = `There is no room: ${tracks.length === 1 ? 'a track is' : tracks.length + ' tracks are'} needed and the project has ${Studio.MAX_TRACKS}. Clear or remove one first.`; return; }
      Studio.closeSheet('bring-sheet');
      Studio.toast(`${m.title || 'It'} is on track${placed.length > 1 ? 's ' + placed.map(i => i + 1).join(' and ') : ' ' + (placed[0] + 1)}. Undo takes it out again.`);
    });
  }

  /* Song Writer's levels, as the studio keeps them. The plan gives each
     note the level Song Writer hands the engine (1 for a lone note, less in
     harmony, 0.75 for a chord), and Song Writer plays each side at 0.8 × its
     volume — the studio's tracks play at 0.8 × the fader, so the side's
     volume goes into the note. */
  function songLevel(level, volume) {
    const v = (level == null ? 1 : level) * (volume == null ? 1 : volume);
    return Math.round(v * 1000) / 1000;
  }
  // A chord's strike is one engine call in Song Writer: each note gets the engine's share.
  function chordLevel(level, n, volume) {
    const share = n > 1 ? Math.min(1, 1.15 / Math.sqrt(n)) : 1;
    return Math.round(songLevel(level, volume) * share * 1000) / 1000;
  }

  function toastBack(key, msg) {
    Studio.toast(msg);
    showList(key);
  }
})();

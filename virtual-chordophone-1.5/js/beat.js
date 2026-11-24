/* ==========================================================================
   Virtual Chordophone — beat.js                                VC.beat
   --------------------------------------------------------------------------
   Bringing a beat in from Ostinato Builder, the way the Recording Studio
   does (Recording Studio/js/bring-in.js): Ostinato Builder opens in a frame
   of its own, off screen, in the Music Stand's guest mode
   (?embed=music-stand), which cannot write its storage, and lends its
   library through window.MusicStandBridge. Nothing in Ostinato Builder
   changes.

     listSongs()          the ostinatos on this device (mine, starters, shared)
     openLibrarySong(id)  open one → info() (title, meter, bpm, voices, sections)
     loadSong(raw)        a piece from a share link
     timeline(opts)       one time through: hits in ticks, gap to the next

   A beat is COPIED in: { title, meter: '4/4', bpm, beats (one pass), hits:
   [{ i: instrument, b: beat, g: volume, r: beats to the next hit }] } — the
   same hits the studio keeps. It is kept with the chordophone's settings, so
   it is still there next time (and changing the ostinato later does not
   change it: bring it in again).

   A piece in sections offers each way through it (its arrangement, every
   section in turn, one section alone), as the studio does.

   Links: Ostinato Builder's share links (#song=~… short, or the old long
   ones) are read here (Music Stand's readLinkData) and handed to loadSong.

   Needs a server (the frame and the app share an origin); opened as a file
   the frame is walled off, and the sheet says so.

   API  VC.beat.open() · VC.beat.close()
   ========================================================================== */
(function () {
  'use strict';
  const VC = window.VC = window.VC || {};
  const OB_URL = '../Ostinato%20Builder%202.0/index.html?embed=music-stand';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const $ = id => document.getElementById(id);
  let frame = null, ready = null;
  let step = 0;

  function bridge() {
    if (ready) return ready;
    frame = document.createElement('iframe');
    frame.className = 'bridge-frame';
    frame.tabIndex = -1;
    frame.title = 'Ostinato Builder';
    frame.setAttribute('aria-hidden', 'true');
    frame.src = OB_URL;
    document.body.appendChild(frame);
    ready = new Promise(resolve => {
      frame.addEventListener('load', async () => {
        for (let t = 0; t < 100; t++) {
          let b = null;
          try { b = frame.contentWindow.MusicStandBridge; } catch (e) { resolve(null); return; }
          if (b) { resolve(b); return; }
          await sleep(100);
        }
        resolve(null);
      }, { once: true });
    });
    ready.then(b => { if (!b) { ready = null; try { frame.remove(); } catch (e) {} } });
    return ready;
  }

  /* one time through a piece the bridge has open, as hits */
  function readOpen(b, info) {
    const snap = b.snapshot();
    const volumes = (snap.tracks || []).map(t => (typeof t.volume === 'number' && isFinite(t.volume) ? t.volume : 1));
    const muted = (info.voices || []).map(v => !!v.muted);
    const read = opts => {
      const tl = b.timeline(opts);
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
      parts.push(Object.assign({ key: 'continuous', label: 'Every section in turn' }, read({ play: 'continuous' })));
      sec.bars.forEach((_, k) => parts.push(Object.assign({ key: 's' + k, label: 'Section ' + (k + 1) + ' alone' }, read({ section: k }))));
    } else parts.push(Object.assign({ key: 'all', label: '' }, read()));
    const start = !sec ? 'all' : sec.mode === 'loop' ? 's' + sec.current : sec.mode;
    return {
      title: info.title || 'Untitled ostinato',
      meter: info.meter.join('/'), bpm: info.bpm, parts,
      part: (parts.find(p => p.key === start) || parts[0]).key,
      instruments: (info.voices || []).filter((v, i) => !muted[i]).map(v => v.label)
    };
  }

  /* ---------------- links (Music Stand's readLinkData) ---------------- */
  function decodeBase64Json(str) {
    try {
      const bin = atob(String(str).trim().replace(/ /g, '+').replace(/\s/g, ''));
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) { return null; }
  }
  async function readLinkData(str) {
    const text = String(str).trim();
    if (text.charAt(0) !== '~') return decodeBase64Json(text);
    try {
      let b = text.slice(1).replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      const bin = atob(b);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
      return JSON.parse(new TextDecoder().decode(await new Response(stream).arrayBuffer()));
    } catch (e) { return null; }
  }
  async function parseLink(text) {
    const raw = String(text || '').trim();
    if (!raw) return { error: 'Paste a link first.' };
    let url = null;
    try { url = new URL(raw); } catch (e) { url = null; }
    let data = null;
    if (url) {
      const sources = [url.searchParams, new URLSearchParams(url.hash.replace(/^#/, ''))];
      for (const params of sources) {
        if (params.has('lesson')) return { error: 'That is a lesson link. Open it in Ostinato Builder and share the one ostinato you want.' };
        if (params.has('song')) { data = await readLinkData(params.get('song')); break; }
      }
      if (!data) return { error: 'That link has no ostinato in it. Make the link in Ostinato Builder’s Share sheet.' };
    } else data = await readLinkData(raw);
    if (!data || typeof data !== 'object') return { error: 'That link could not be read — it may have been cut short when it was copied.' };
    if (!Array.isArray(data.tracks)) return { error: 'That link opened, but it is not an Ostinato Builder beat.' };
    return { data };
  }

  /* ---------------- the sheet ---------------- */
  const sheet = () => $('beat-sheet');
  const body = () => $('beat-body');
  function open() {
    VC.app.openSheet('beat-sheet');
    showChoice();
  }
  function close() { VC.app.closeSheet('beat-sheet'); }

  async function showChoice() {
    const my = ++step;
    const cur = VC.app.state().beat;
    const fileNote = location.protocol === 'file:'
      ? '<p class="note warn">This page was opened as a file, so it cannot reach Ostinato Builder. Open it from the website (or a local server) to bring a beat in.</p>' : '';
    body().innerHTML = `
      ${cur ? `<div class="beat-now"><div><div class="beat-now-title">${esc(cur.title)}</div><div class="beat-now-meta">${esc(metaOf(cur))}</div></div>
        <button class="btn ghost" id="beat-remove" type="button">Remove beat</button></div>` : ''}
      ${fileNote}
      <section class="sheet-section">
        <h3>From Ostinato Builder</h3>
        <div class="pick-list" id="beat-list"><p class="note">Opening Ostinato Builder…</p></div>
      </section>
      <section class="sheet-section">
        <h3>Or paste an Ostinato Builder link</h3>
        <div class="link-row"><input id="beat-link" type="text" placeholder="https://eagleviewmusic.com/…#song=~…" autocomplete="off" spellcheck="false">
          <button class="btn" id="beat-link-go" type="button">Open</button></div>
        <p class="note" id="beat-link-status"></p>
      </section>`;
    const rm = $('beat-remove');
    if (rm) rm.addEventListener('click', () => { VC.app.setBeat(null); showChoice(); });
    $('beat-link-go').addEventListener('click', fromLink);
    $('beat-link').addEventListener('keydown', e => { if (e.key === 'Enter') fromLink(); e.stopPropagation(); });
    const b = await bridge();
    if (my !== step) return;
    const list = $('beat-list');
    if (!b) { list.innerHTML = '<p class="note">Ostinato Builder did not open here. Check it opens on its own in this browser, then try again.</p>'; return; }
    let songs = [];
    try { songs = b.listSongs() || []; } catch (e) { console.error(e); }
    const groups = [];
    const put = (label, l) => { if (l.length) groups.push({ label, list: l }); };
    const books = {};
    songs.filter(s => !s.sandbox && s.received).forEach(s => { const k = s.book || 'Shared with you'; (books[k] = books[k] || []).push(s); });
    put('My ostinatos', songs.filter(s => !s.sandbox && !s.received && s.isCustom));
    Object.keys(books).forEach(k => put(k, books[k]));
    put('Sandbox', songs.filter(s => s.sandbox));
    put('Starters', songs.filter(s => !s.sandbox && !s.received && !s.isCustom));
    const meta = s => [s.meter ? s.meter.join('/') : '', s.bpm ? s.bpm + ' bpm' : '',
      s.sections > 1 ? s.sections + ' sections' : s.measures ? s.measures + (s.measures === 1 ? ' bar' : ' bars') : '', s.preview || ''].filter(Boolean).join(' · ');
    list.innerHTML = groups.length ? groups.map(g => `<div class="pick-group"><div class="pick-label">${esc(g.label)}</div>${g.list.map(s =>
      `<button class="pick-row" type="button" data-id="${esc(s.id)}"><span class="pick-title">${esc(s.title || 'Untitled')}</span><span class="pick-meta">${esc(meta(s))}</span></button>`).join('')}</div>`).join('')
      : '<p class="note">No ostinatos on this device yet. Make one in Ostinato Builder, then come back.</p>';
    list.querySelectorAll('.pick-row').forEach(btn => btn.addEventListener('click', () => fromLibrary(btn.dataset.id)));
  }

  async function fromLibrary(id) {
    const my = ++step;
    const b = await bridge();
    if (my !== step || !b) return;
    let m = null;
    try { const info = b.openLibrarySong(id); m = info ? readOpen(b, info) : null; } catch (e) { console.error(e); }
    if (!m) { VC.app.toast('That ostinato could not be opened'); return; }
    showOptions(m);
  }
  async function fromLink() {
    const status = $('beat-link-status');
    const parsed = await parseLink($('beat-link').value);
    if (parsed.error) { status.textContent = parsed.error; status.className = 'note warn'; return; }
    const my = ++step;
    status.textContent = 'Opening…'; status.className = 'note';
    const b = await bridge();
    if (my !== step) return;
    if (!b) { status.textContent = 'Ostinato Builder did not open here.'; status.className = 'note warn'; return; }
    let m = null;
    try { const info = b.loadSong(parsed.data); m = info ? readOpen(b, info) : null; } catch (e) { console.error(e); }
    if (!m) { status.textContent = 'That beat could not be read.'; status.className = 'note warn'; return; }
    showOptions(m);
  }

  function metaOf(bt) {
    const bars = bt.beats / (VC.rhythm.meterOf(bt.meter).beats || 4);
    return [bt.meter, bt.bpm + ' bpm', Math.round(bars * 100) / 100 + (bars === 1 ? ' bar' : ' bars'), (bt.instruments || []).join(' · ')].filter(Boolean).join(' · ');
  }
  function showOptions(m) {
    const st = VC.app.state();
    const choose = m.parts.length > 1;
    body().innerHTML = `
      <button class="link-btn" id="beat-back" type="button">‹ Back</button>
      <div class="beat-pick">
        <div class="beat-now-title">${esc(m.title)}</div>
        <div class="beat-now-meta">${esc([m.meter, m.bpm + ' bpm', (m.instruments || []).join(' · ')].filter(Boolean).join(' · '))}</div>
        ${choose ? `<label class="opt"><span>Plays</span><select id="beat-part">${m.parts.map(p => `<option value="${esc(p.key)}"${p.key === m.part ? ' selected' : ''}>${esc(p.label)}</option>`).join('')}</select></label>` : ''}
        <label class="check"><input type="checkbox" id="beat-tempo" checked> Use its tempo (${esc(m.bpm)} bpm)</label>
        ${m.meter !== st.meter ? `<p class="note">It is in ${esc(m.meter)}: the chords change to ${esc(m.meter)} with it.</p>` : ''}
        <div class="sheet-actions"><button class="btn primary" id="beat-use" type="button">Use this beat</button></div>
      </div>`;
    $('beat-back').addEventListener('click', showChoice);
    $('beat-use').addEventListener('click', () => {
      const pick = choose ? $('beat-part').value : m.part;
      const part = m.parts.find(p => p.key === pick) || m.parts[0];
      if (!part.hits.length) { VC.app.toast('That ostinato has no sounds in it'); return; }
      VC.app.setBeat({
        title: m.title + (choose && part.key !== 'all' ? ' (' + part.label.replace(/:.*$/, '') + ')' : ''),
        meter: m.meter, bpm: m.bpm, beats: part.beats, instruments: m.instruments,
        hits: part.hits.map(h => ({ i: h.i, b: Math.round(h.b * 1e4) / 1e4, g: Math.round(h.g * 1e3) / 1e3, r: Math.round(h.r * 1e4) / 1e4 }))
      }, { tempo: $('beat-tempo').checked });
      close();
    });
  }

  function cleanBeat(bt) {
    if (!bt || typeof bt !== 'object' || !Array.isArray(bt.hits)) return null;
    const beats = Number(bt.beats);
    if (!(beats > 0 && beats <= 4096)) return null;
    const hits = bt.hits.filter(h => h && typeof h.i === 'string' && isFinite(h.b) && h.b >= 0 && h.b < beats)
      .map(h => ({ i: h.i, b: +h.b, g: isFinite(h.g) ? +h.g : 1, r: isFinite(h.r) ? +h.r : 0 }))
      .sort((a, b) => a.b - b.b);
    if (!hits.length) return null;
    return {
      title: String(bt.title || 'Beat').slice(0, 80), meter: VC.rhythm.meterOf(bt.meter).id,
      bpm: Math.max(30, Math.min(300, Math.round(+bt.bpm) || 100)), beats, hits,
      instruments: Array.isArray(bt.instruments) ? bt.instruments.slice(0, 16).map(String) : []
    };
  }

  VC.beat = { open, close, cleanBeat, metaOf };
})();

/* ==========================================================================
   Vocal Booth — export.js
   MP3 files, at the rate the project ran at, so that dozens of them stay easy
   to send. Recordings are kept uncompressed until this point. They are mixed
   sample by sample from the same plan playback uses, with no resampling and no
   limiter, and encoded once.

   Every file starts at 0:00 and runs to the end of the project, so a stack of
   files drops straight into line in any other program.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB;
  const P = VB.Project;
  const X = VB.Export = {};
  /* A pause for the page to breathe. Not a timer: those slow to a crawl in a tab
     in the background, and a singer may well switch away during an export. */
  const pipe = new MessageChannel();
  const waiting = [];
  pipe.port1.onmessage = () => { const r = waiting.shift(); if (r) r(); };
  const tick = () => new Promise(r => { waiting.push(r); pipe.port2.postMessage(0); });

  X.channelsFor = function (trackIds) {
    for (const id of trackIds) {
      for (const s of P.plan(id)) {
        const src = P.source(s.sourceId);
        if (src && src.channels > 1) return 2;
      }
    }
    return 1;
  };

  function addPiece(out, src, s, gain) {
    const len = s.end - s.start;
    const F = Math.min(VB.FADE, len >> 1);
    for (let ch = 0; ch < out.length; ch++) {
      const from = src.buffer.getChannelData(Math.min(ch, src.buffer.numberOfChannels - 1));
      const to = out[ch];
      for (let i = 0; i < len; i++) {
        let v = from[s.off + i] * gain;
        if (s.fadeIn && i < F) v *= (i + 0.5) / F;
        if (s.fadeOut && len - 1 - i < F) v *= (len - 1 - i + 0.5) / F;
        to[s.start + i] += v;
      }
    }
  }

  /* Tracks summed into new arrays, at each track's volume. A track ticked for
     export sounds even if it is muted for listening; muted clips stay silent. */
  X.mix = async function (trackIds) {
    const n = P.end();
    const chs = X.channelsFor(trackIds);
    const out = [];
    for (let c = 0; c < chs; c++) out.push(new Float32Array(n));
    for (const id of trackIds) {
      const t = P.track(id);
      if (!t) continue;
      for (const s of P.plan(id)) {
        addPiece(out, P.source(s.sourceId), s, t.volume);
        await tick();
      }
    }
    let peak = 0;
    for (const a of out) {
      for (let i = 0; i < a.length; i++) {
        const v = a[i] < 0 ? -a[i] : a[i];
        if (v > peak) peak = v;
      }
    }
    return { channels: out, peak };
  };

  /* MP3 pushes its audio later: the encoder and decoder together add this many
     samples at the start, and this encoder writes no header to say so. So that a
     file still lands on the beat when it is dropped into another program, the same
     number of samples is left off the front. Measured in tools/test.mjs. */
  const CODEC_DELAY = 1105;

  /* CBR, so every program reads the same length. A voice is mono, so 192 kbps is
     plenty and nothing above 18 kHz or so is lost; the stereo rate only ever applies
     when a stereo file (the accompaniment) is included. */
  X.MONO_KBPS = 192;
  X.STEREO_KBPS = 320;

  async function toRate(channels, from, to) {
    const ctx = new OfflineAudioContext(channels.length, Math.ceil(channels[0].length * to / from), to);
    const b = new AudioBuffer({ numberOfChannels: channels.length, length: channels[0].length, sampleRate: from });
    channels.forEach((d, c) => b.copyToChannel(d, c));
    const n = ctx.createBufferSource();
    n.buffer = b;
    n.connect(ctx.destination);
    n.start();
    const r = await ctx.startRendering();
    return channels.map((d, c) => r.getChannelData(c));
  }

  /* `factor` only ever turns the whole file down, and only when it is too hot. */
  X.mp3 = async function (channels, rate, factor) {
    if (typeof lamejs === 'undefined') throw new Error('the MP3 maker did not load. Reload the page and try again.');
    if (rate !== 44100 && rate !== 48000) {    // only a browser that forces an odd microphone rate gets here
      channels = await toRate(channels, rate, 48000);
      rate = 48000;
    }
    const chs = channels.length;
    const enc = new lamejs.Mp3Encoder(chs, rate, chs > 1 ? X.STEREO_KBPS : X.MONO_KBPS);
    const BLOCK = 1152;
    const f = factor == null ? 1 : factor;
    const a = new Int16Array(BLOCK), b = chs > 1 ? new Int16Array(BLOCK) : null;
    const fill = (from, to, at, n) => {
      for (let i = 0; i < n; i++) {
        const v = from[at + i] * f;
        to[i] = Math.round((v > 1 ? 1 : v < -1 ? -1 : v) * 32767);
      }
    };
    const parts = [];
    const total = channels[0].length;
    let blocks = 0;
    for (let at = CODEC_DELAY; at < total; at += BLOCK) {
      const n = Math.min(BLOCK, total - at);
      fill(channels[0], a, at, n);
      if (b) fill(channels[1], b, at, n);
      const out = n === BLOCK
        ? (b ? enc.encodeBuffer(a, b) : enc.encodeBuffer(a))
        : (b ? enc.encodeBuffer(a.subarray(0, n), b.subarray(0, n)) : enc.encodeBuffer(a.subarray(0, n)));
      if (out.length) parts.push(new Uint8Array(out));
      if (++blocks % 64 === 0) await tick();
    }
    const end = enc.flush();
    if (end.length) parts.push(new Uint8Array(end));
    return new Blob(parts, { type: 'audio/mpeg' });
  };

  /* -------- The window -------- */
  const $ = id => document.getElementById(id);
  const clean = s => (s || '').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim();
  const NAME_KEY = 'vocal_booth_name';
  let lastUrls = [];

  function exportable() {
    return P.data.tracks.filter(t => P.clipsOn(t.id).length);
  }

  function mmss(samples) {
    const sec = Math.round(samples / VB.Engine.rate());
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  X.open = function () {
    const tracks = exportable();
    if (!tracks.length) { VB.say('There is nothing to export yet. Record something first.', 'warn'); return; }
    if (VB.Engine.state !== 'stopped') VB.Engine.stop();
    try { $('ex-name').value = localStorage.getItem(NAME_KEY) || ''; } catch (e) {}
    const hasVoice = tracks.some(t => !P.isFileTrack(t.id));
    const list = $('ex-tracks');
    list.innerHTML = '';
    for (const t of tracks) {
      const isFile = P.isFileTrack(t.id);
      const row = document.createElement('label');
      row.className = 'ex-track';
      const box = document.createElement('input');
      box.type = 'checkbox';
      box.value = t.id;
      box.checked = !t.muted && (!isFile || !hasVoice);
      const name = document.createElement('span');
      name.className = 'ex-tname';
      name.textContent = t.name;
      const tag = document.createElement('span');
      tag.className = 'ex-tag';
      tag.textContent = isFile ? 'Added file' : t.muted ? 'Muted' : '';
      row.append(box, name, tag);
      list.append(row);
    }
    const one = tracks.length === 1;
    $('ex-mode').hidden = one;
    list.hidden = one;
    $('ex-each').checked = true;
    $('ex-len').textContent = 'Each file starts at 0:00 and runs ' + mmss(P.end()) + ', the length of the whole project, so everything lines up when it is put together.';
    $('ex-format').textContent = 'MP3 · ' + X.MONO_KBPS + ' kbps mono, ' + X.STEREO_KBPS + ' kbps stereo · ' + VB.Engine.rate().toLocaleString() + ' Hz';
    $('ex-results').hidden = true;
    $('ex-results').innerHTML = '';
    $('ex-go').hidden = false;
    $('ex-go').disabled = false;
    $('ex-go').textContent = 'Export';
    $('ex-progress').hidden = true;
    $('dlg-export').showModal();
  };

  function save(blob, name) {
    // An iPhone or iPad may open an MP3 in a player tab instead of saving it; a file of
    // no particular kind is always saved. The name still ends in .mp3.
    if (VB.device.ios) blob = new Blob([blob], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    lastUrls.push(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
  }

  /* The audio work without the window, also what the tests run. A decoded MP3 can
     land a little above the level that went in, so a very hot file is turned down
     to leave it room. */
  const CEILING = 0.944;   // −0.5 dB
  X.render = async function (mode, ids, baseName, onStep, encoder) {
    const encode = encoder || X.mp3;
    const rate = VB.Engine.rate();
    const prefix = clean(baseName) ? clean(baseName) + ' - ' : '';
    const files = [];
    const one = async (trackIds, title) => {
      const { channels, peak } = await X.mix(trackIds);
      let factor = 1, turned = 0;
      if (peak > CEILING) {
        factor = CEILING / peak;
        turned = -20 * Math.log10(factor);
      }
      const blob = await encode(channels, rate, factor);
      files.push({ name: prefix + (clean(title) || 'Track') + '.mp3', blob, chs: channels.length, turned });
    };
    if (mode === 'each') {
      let k = 0;
      const seen = new Map();
      for (const id of ids) {
        if (onStep) onStep(++k, ids.length);
        let title = P.track(id).name;
        const c = (seen.get(title) || 0) + 1;
        seen.set(title, c);
        if (c > 1) title += ' ' + c;
        await one([id], title);
      }
    } else {
      if (onStep) onStep(1, 1);
      await one(ids, 'All tracks');
    }
    return files;
  };

  async function go() {
    const boxes = [...$('ex-tracks').querySelectorAll('input:checked')];
    const tracks = exportable();
    const ids = tracks.length === 1 ? [tracks[0].id] : boxes.map(b => b.value);
    if (!ids.length) {       // said here: a message on the page would sit dimmed behind this window
      $('ex-progress').hidden = false;
      $('ex-progress').textContent = 'Tick at least one track.';
      return;
    }
    const base = $('ex-name').value;
    try { localStorage.setItem(NAME_KEY, base); } catch (e) {}
    const mode = $('ex-all').checked && ids.length > 1 ? 'all' : 'each';
    for (const u of lastUrls) URL.revokeObjectURL(u);
    lastUrls = [];

    $('ex-go').disabled = true;
    const prog = $('ex-progress');
    prog.hidden = false;
    prog.textContent = 'Preparing…';
    await tick();
    let files;
    try {
      files = await X.render(mode, ids, base, (k, n) => {
        prog.textContent = n > 1 ? 'Preparing file ' + k + ' of ' + n + '…' : 'Preparing your file…';
      });
    } catch (err) {
      console.error(err);
      prog.textContent = 'That didn’t work: ' + (err.message || err);
      $('ex-go').disabled = false;
      return;
    }
    prog.hidden = true;
    $('ex-go').hidden = true;

    const box = $('ex-results');
    box.innerHTML = '';
    const head = document.createElement('p');
    head.className = 'ex-done';
    head.textContent = files.length > 1
      ? 'Your ' + files.length + ' files are downloading. If your browser asks, allow it to download more than one file.'
      : 'Your file is downloading.';
    box.append(head);
    /* A phone or tablet: Share sends the files on (Messages, Mail, AirDrop, Files…).
       It must come from a tap of its own, so it cannot run by itself after the encode. */
    const shareOf = list => {
      if (!VB.device.mobile || !navigator.share || !navigator.canShare) return null;
      const items = list.map(f => new File([f.blob], f.name, { type: 'audio/mpeg' }));
      try { if (!navigator.canShare({ files: items })) return null; } catch (e) { return null; }
      return async () => {
        try { await navigator.share({ files: items }); } catch (err) {
          if (err && err.name !== 'AbortError') VB.say('That couldn’t be shared (' + (err.name || 'error') + '). Use Save again instead.', 'warn');
        }
      };
    };
    const all = files.length > 1 ? shareOf(files) : null;
    if (all) {
      const btn = document.createElement('button');
      btn.className = 'btn primary ex-share-all';
      btn.type = 'button';
      btn.textContent = 'Share all ' + files.length;
      btn.addEventListener('click', all);
      box.append(btn);
    }
    for (const f of files) {
      const row = document.createElement('div');
      row.className = 'ex-file';
      const name = document.createElement('span');
      name.className = 'ex-fname';
      name.textContent = f.name;
      const size = document.createElement('span');
      size.className = 'ex-size';
      size.textContent = (f.blob.size / 1048576).toFixed(1) + ' MB · ' + (f.chs > 1 ? 'stereo' : 'mono');
      const again = document.createElement('button');
      again.className = 'btn small';
      again.type = 'button';
      again.textContent = 'Save again';
      again.addEventListener('click', () => save(f.blob, f.name));
      row.append(name, size, again);
      const one = shareOf([f]);
      if (one) {
        const share = document.createElement('button');
        share.className = 'btn small';
        share.type = 'button';
        share.textContent = 'Share';
        share.addEventListener('click', one);
        row.append(share);
      }
      box.append(row);
      if (f.turned) {
        const note = document.createElement('p');
        note.className = 'ex-note';
        note.textContent = 'This one was very loud, so the whole file was turned down ' + f.turned.toFixed(1) + ' dB to keep it from distorting. Nothing else about it changed.';
        box.append(note);
      }
    }
    if (all) head.textContent += ' To send them straight on, press Share all.';
    else if (box.querySelector('.ex-file .btn + .btn')) head.textContent += ' To send it straight on, press Share.';
    box.hidden = false;
    for (let i = 0; i < files.length; i++) {
      save(files[i].blob, files[i].name);
      if (i < files.length - 1) await new Promise(r => setTimeout(r, 500));
    }
  }

  X.mount = function () {
    $('ex-go').addEventListener('click', go);
    $('ex-close').addEventListener('click', () => $('dlg-export').close());
  };
})();

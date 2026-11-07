/* ==========================================================================
   Vocal Booth — export.js
   WAV files, 24-bit, at the rate the project ran at. Mixed sample by sample
   from the same plan playback uses, with no resampling and no limiter: a take
   on a track at 0 dB comes out exactly as it went in.

   Every file starts at 0:00 and runs to the end of the project, so a stack of
   files drops straight into line in any other program.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB;
  const P = VB.Project;
  const X = VB.Export = {};
  const tick = () => new Promise(r => setTimeout(r, 0));

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

  function header(frames, chs, rate) {
    const size = frames * chs * 3;
    const b = new ArrayBuffer(44);
    const v = new DataView(b);
    const text = (at, s) => { for (let i = 0; i < s.length; i++) v.setUint8(at + i, s.charCodeAt(i)); };
    text(0, 'RIFF'); v.setUint32(4, 36 + size, true); text(8, 'WAVE');
    text(12, 'fmt '); v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);                 // PCM
    v.setUint16(22, chs, true);
    v.setUint32(24, rate, true);
    v.setUint32(28, rate * chs * 3, true);
    v.setUint16(32, chs * 3, true);
    v.setUint16(34, 24, true);
    text(36, 'data'); v.setUint32(40, size, true);
    return b;
  }

  /* 24-bit. `factor` only ever turns the whole file down, and only when it
     would otherwise go over full scale. */
  X.wav = async function (channels, rate, factor) {
    const chs = channels.length, frames = channels[0].length;
    const parts = [header(frames, chs, rate)];
    const BLOCK = Math.max(1024, rate);
    const f = factor == null ? 1 : factor;
    for (let at = 0; at < frames; at += BLOCK) {
      const count = Math.min(BLOCK, frames - at);
      const bytes = new Uint8Array(count * chs * 3);
      let o = 0;
      for (let i = 0; i < count; i++) {
        for (let c = 0; c < chs; c++) {
          let v = channels[c][at + i] * f;
          v = v > 1 ? 1 : v < -1 ? -1 : v;
          const s = Math.round(v * 8388607);
          bytes[o++] = s & 255;
          bytes[o++] = (s >> 8) & 255;
          bytes[o++] = (s >> 16) & 255;
        }
      }
      parts.push(bytes);
      await tick();
    }
    return new Blob(parts, { type: 'audio/wav' });
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
    $('ex-format').textContent = '24-bit WAV · ' + VB.Engine.rate().toLocaleString() + ' Hz';
    $('ex-results').hidden = true;
    $('ex-results').innerHTML = '';
    $('ex-go').hidden = false;
    $('ex-go').disabled = false;
    $('ex-go').textContent = 'Export';
    $('ex-progress').hidden = true;
    $('dlg-export').showModal();
  };

  function save(blob, name) {
    const url = URL.createObjectURL(blob);
    lastUrls.push(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
  }

  /* The audio work without the window, also what the tests run. */
  X.render = async function (mode, ids, baseName, onStep) {
    const rate = VB.Engine.rate();
    const prefix = clean(baseName) ? clean(baseName) + ' - ' : '';
    const files = [];
    const one = async (trackIds, title) => {
      const { channels, peak } = await X.mix(trackIds);
      let factor = 1, turned = 0;
      if (peak > 0.9999) {
        factor = 0.9999 / peak;
        turned = -20 * Math.log10(factor);
      }
      const blob = await X.wav(channels, rate, factor);
      files.push({ name: prefix + (clean(title) || 'Track') + '.wav', blob, chs: channels.length, turned });
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
    if (!ids.length) { VB.say('Tick at least one track.', 'warn'); return; }
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
      box.append(row);
      if (f.turned) {
        const note = document.createElement('p');
        note.className = 'ex-note';
        note.textContent = 'This one would have gone over full volume, so the whole file was turned down ' + f.turned.toFixed(1) + ' dB. Nothing else about it changed.';
        box.append(note);
      }
    }
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

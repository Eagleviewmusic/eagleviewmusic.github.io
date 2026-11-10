/* ==========================================================================
   Walby's Basic Video Editor — js/export.js
   The MP4 (H.264 video + AAC sound), made in Chrome with WebCodecs and written
   by Mediabunny (lib/mediabunny, MPL-2.0) straight into the project's
   Exports folder. And the 📷 screenshot (a PNG of the canvas right now, into
   Screenshots, and on the clipboard).

   Each frame shows the moment in its middle; a frame is only redrawn when
   what's on it changes (pictures don't move, so most frames are copies).
   ========================================================================== */
(function () {
  'use strict';
  const VE = window.VE;
  const X = VE.Export = { RATE: 48000 };
  let MB = null, job = null;
  X.library = async () => MB || (MB = await import(new URL('lib/mediabunny/mediabunny.min.mjs', location.href).href));

  /* all the sound, mixed, from 0 to len */
  X.mix = async function (len) {
    const ac = new OfflineAudioContext(2, Math.max(1, Math.ceil(len * X.RATE)), X.RATE);
    const n = VE.Player.schedule(ac, ac.destination, 0, 0);
    if (!n.length) return null;
    return ac.startRendering();
  };

  const even = v => Math.max(2, Math.round(v / 2) * 2);
  X.sizes = function () {
    const P = VE.P, out = [[1, `${even(P.w)} × ${even(P.h)} (the canvas)`]];
    if (Math.max(P.w, P.h) > 1280) { const k = 1280 / Math.max(P.w, P.h); out.push([k, `${even(P.w * k)} × ${even(P.h * k)} (smaller file)`]); }
    if (Math.max(P.w, P.h) < 1920) { const k = 1920 / Math.max(P.w, P.h); out.push([k, `${even(P.w * k)} × ${even(P.h * k)} (bigger)`]); }
    return out;
  };

  /* o: { scale, fps, quality (1-3), writable?, onProgress, signal } → { blob? , frames, took } */
  X.run = async function (o) {
    const mb = await X.library(), P = VE.P, started = performance.now();
    const len = VE.length();
    if (!(len > 0)) throw new Error('The timeline is empty.');
    const W = even(P.w * o.scale), H = even(P.h * o.scale), fps = o.fps;
    const frames = Math.max(1, Math.ceil(len * fps - 1e-6));
    const canvas = new OffscreenCanvas(W, H), g = canvas.getContext('2d', { alpha: false });
    const memory = !o.writable;
    const output = new mb.Output({
      format: new mb.Mp4OutputFormat({ fastStart: memory ? 'in-memory' : false }),
      target: memory ? new mb.BufferTarget() : new mb.StreamTarget(o.writable, { chunked: true })
    });
    // about 8 Mbit/s for 1080p30 at "High"; scaled by pixels and frame rate
    const bitrate = Math.round(4e6 * o.quality * (W * H) / (1920 * 1080) * Math.sqrt(fps / 30));
    const video = new mb.CanvasSource(canvas, { codec: 'avc', bitrate: Math.max(1e6, bitrate), keyFrameInterval: 2 });
    output.addVideoTrack(video, { frameRate: fps });
    o.onProgress && o.onProgress(0, 'Mixing the sound…');
    const mix = await X.mix(frames / fps);
    let audio = null;
    if (mix) { audio = new mb.AudioBufferSource({ codec: 'aac', bitrate: 192e3 }); output.addAudioTrack(audio); }
    if (output.setMetadataTags) output.setMetadataTags({ title: P.title });
    await output.start();
    try {
      if (audio) await audio.add(mix);
      let last = '', shown = 0;
      for (let i = 0; i < frames; i++) {
        if (o.signal && o.signal.aborted) { await output.cancel(); return { canceled: true }; }
        const t = (i + 0.5) / fps;
        const key = VE.Render.visible(P, t).map(v => v.clip.id + ':' + v.alpha.toFixed(3)).join('|');
        if (key !== last) { VE.Render.frame(g, P, t, { scale: W / P.w }); last = key; }
        await video.add(i / fps, 1 / fps);
        const now = performance.now();
        if (o.onProgress && (now - shown > 200 || i === frames - 1)) { shown = now; o.onProgress((i + 1) / frames, `Frame ${i + 1} of ${frames}`); }
      }
      await output.finalize();
    } catch (e) {
      try { await output.cancel(); } catch (e2) { /* gone */ }
      throw e;
    }
    const res = { frames, took: (performance.now() - started) / 1000, W, H };
    if (memory) res.blob = new Blob([output.target.buffer], { type: 'video/mp4' });
    return res;
  };

  /* ---- the dialog ---- */
  X.open = function () {
    if (!VE.P) return;
    if (!(VE.length() > 0)) { VE.toast('Put something on the timeline first.'); return; }
    VE.Player.pause();
    const d = document.getElementById('dlg-export');
    document.getElementById('x-name').value = VE.P.title;
    document.getElementById('x-size').innerHTML = X.sizes().map(([k, l]) => `<option value="${k}">${l}</option>`).join('');
    document.getElementById('x-where').textContent = `Length ${VE.fmt(VE.length())}. It goes in this project's Exports folder.`;
    document.getElementById('x-progress').hidden = true;
    document.getElementById('x-go').disabled = false;
    document.getElementById('x-cancel').textContent = 'Cancel';
    d.showModal();
  };
  function init() {
    const d = document.getElementById('dlg-export');
    d.querySelector('form').addEventListener('submit', async e => {
      if (e.submitter && e.submitter.value !== 'ok') { if (job) { e.preventDefault(); job.abort(); } return; }
      e.preventDefault();
      if (job) return;
      const go = document.getElementById('x-go'), bar = document.getElementById('x-bar'), msg = document.getElementById('x-msg');
      go.disabled = true; document.getElementById('x-progress').hidden = false;
      const name = (document.getElementById('x-name').value.trim() || VE.P.title) + '.mp4';
      job = new AbortController();
      let file = null;
      try {
        file = await VE.Store.newWritable(VE.dir, 'Exports', name);
        const res = await X.run({
          scale: +document.getElementById('x-size').value, fps: +document.getElementById('x-fps').value,
          quality: +document.getElementById('x-quality').value, writable: file.writable, signal: job.signal,
          onProgress: (f, m) => { bar.value = f; msg.textContent = m; }
        });
        if (res.canceled) {
          try { await file.writable.abort(); } catch (e2) { /* gone */ }
          await removeFile('Exports', file.name);
          msg.textContent = 'Stopped.';
        } else {
          msg.textContent = `Done in ${res.took.toFixed(1)} s.`;
          d.close();
          VE.toast(`Saved <b>Exports/${VE.esc(file.name)}</b> (${res.W} × ${res.H}, ${VE.fmt(res.frames / +document.getElementById('x-fps').value)})`, 7000);
        }
      } catch (err) {
        console.error(err);
        if (file) { try { await file.writable.abort(); } catch (e2) { /* gone */ } await removeFile('Exports', file.name); }
        msg.textContent = 'It did not work: ' + (err && err.message || err);
      } finally {
        job = null; go.disabled = false;
        document.getElementById('x-cancel').textContent = 'Close';
      }
    });
    d.addEventListener('cancel', e => { if (job) { e.preventDefault(); job.abort(); } });
  }
  /* an unfinished MP4 we made ourselves is taken away again */
  async function removeFile(sub, name) {
    try { await (await VE.Store.sub(VE.dir, sub)).removeEntry(name); } catch (e) { /* fine */ }
  }

  /* ---- 📷 ---- */
  X.screenshot = async function () {
    if (!VE.P) return;
    const P = VE.P, c = new OffscreenCanvas(P.w, P.h);
    VE.Render.frame(c.getContext('2d'), P, VE.time, { scale: 1 });
    const blob = await c.convertToBlob({ type: 'image/png' });
    const t = VE.time, m = Math.floor(t / 60), s = (t - m * 60).toFixed(2).padStart(5, '0');
    const name = await VE.Store.writeInto(VE.dir, 'Screenshots', `${P.title} ${m}m${s}s.png`, blob);
    let copied = false;
    try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); copied = true; } catch (e) { /* not allowed: fine */ }
    VE.toast(`📷 Saved <b>Screenshots/${VE.esc(name)}</b>${copied ? ' — and copied, ready to paste' : ''}`, 5000);
    flash();
  };
  function flash() {
    const st = document.getElementById('stage');
    st.animate([{ boxShadow: 'inset 0 0 0 9999px rgba(255,255,255,.35)' }, { boxShadow: 'inset 0 0 0 9999px rgba(255,255,255,0)' }], { duration: 350 });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

/* ==========================================================================
   Vocal Booth — miccheck.js
   The window that gets a singer ready: the right microphone, a good level, a
   quiet room, a five-second listen, and whether the backing leaks into the mic.
   The browser cannot set a microphone's hardware level, so the advice is to
   move, and no level is ever boosted by software.
   ========================================================================== */
(function () {
  'use strict';
  const VB = window.VB;
  const E = VB.Engine;
  const $ = id => document.getElementById(id);
  const db = x => 20 * Math.log10(Math.max(x, 1e-6));
  const MIC_KEY = 'vocal_booth_mic';
  const CHECKED_KEY = 'vocal_booth_checked';

  const M = VB.MicCheck = { open, isOpen: () => $('dlg-mic').open, checkedBefore };
  let running = false, busy = false;

  function checkedBefore() {
    try { return !!localStorage.getItem(CHECKED_KEY); } catch (e) { return true; }
  }

  async function listDevices() {
    const sel = $('mc-device');
    let list = [];
    try { list = (await navigator.mediaDevices.enumerateDevices()).filter(d => d.kind === 'audioinput'); } catch (e) {}
    sel.innerHTML = '';
    for (const d of list) {
      if (d.deviceId === 'communications') continue;
      const o = document.createElement('option');
      o.value = d.deviceId;
      o.textContent = (d.label || 'Microphone').replace(/^Default\s*-\s*/i, 'Default: ');
      sel.append(o);
    }
    if (E.mic) {
      const wanted = [...sel.options].find(o => o.value === E.mic.deviceId);
      if (wanted) sel.value = wanted.value;
    }
  }

  function showError(text) {
    const box = $('mc-error');
    box.hidden = !text;
    box.textContent = text || '';
  }

  function showProblems() {
    const ul = $('mc-problems');
    ul.innerHTML = '';
    const list = E.mic ? E.mic.problems : [];
    ul.hidden = !list.length;
    for (const p of list) {
      const li = document.createElement('li');
      li.textContent = p;
      ul.append(li);
    }
  }

  function showTimingLine() {
    const info = E.delayInfo();
    $('mc-delay').textContent = E.mic
      ? 'Timing: takes move ' + info.ms + ' ms earlier to line up (' + info.how + ').'
      : '';
  }

  async function showOutput() {
    const label = await E.outputLabel();
    $('mc-output').textContent = label ? 'Sound is going to: ' + label + '.' : '';
  }

  async function start(deviceId) {
    showError('');
    try {
      await E.openMic(deviceId);
      await listDevices();
      showProblems();
      showTimingLine();
      showOutput();
    } catch (err) {
      console.error(err);
      showError(E.micErrorText(err));
      await listDevices();
      showProblems();
    }
  }

  async function open() {
    if (E.state !== 'stopped') await E.stop();
    $('dlg-mic').showModal();
    $('mc-timing-msg').textContent = TIMING_INTRO;
    $('mc-test').textContent = 'Test recording';
    E.level.clipped = false;
    running = true;
    requestAnimationFrame(loop);
    if (E.mic) {
      await listDevices();
      showProblems();
      showTimingLine();
      showOutput();
    } else {
      let saved;
      try { saved = localStorage.getItem(MIC_KEY) || undefined; } catch (e) {}
      await start(saved);
    }
  }

  const TIMING_INTRO = 'Put your headphones on, then press Test. You’ll hear five soft chirps.';

  /* What the last few seconds say about the level and the room. */
  function loop() {
    if (!running || !$('dlg-mic').open) return;
    const now = performance.now();
    const v = $('mc-verdict'), room = $('mc-room');
    let loud = 0;
    for (const r of E.log) if (now - r.t < 5000 && r.peak > loud) loud = r.peak;
    const d = db(loud);
    let word, kind;
    if (E.asking()) { word = 'Your browser is asking to use the microphone. Look near the address bar and choose Allow.'; kind = 'warn'; }
    else if (!E.mic) { word = 'The microphone is off.'; kind = ''; }
    else if (E.level.clipped && d > -1) { word = 'Too loud: that distorted. Move back, or turn the input volume down in your computer’s sound settings.'; kind = 'bad'; }
    else if (d < -50) { word = 'Sing the loudest part of your song.'; kind = ''; }
    else if (d < -30) { word = 'Too quiet. Move closer, or turn the input volume up in your computer’s sound settings.'; kind = 'bad'; }
    else if (d < -18) { word = 'A little quiet, but it will work. Closer would be better.'; kind = 'warn'; }
    else if (d <= -6) { word = 'Great level. Your loudest notes have room.'; kind = 'good'; }
    else if (d < -0.5) { word = 'A little loud. Back up a bit so your biggest notes have room.'; kind = 'warn'; }
    else { word = 'Too loud: that distorted. Move back, or turn the input volume down in your computer’s sound settings.'; kind = 'bad'; }
    if (v.textContent !== word) v.textContent = word;
    v.dataset.kind = kind;

    // the room: the quietest quarter second lately
    let quiet = null;
    const blocks = E.log;
    const W = 12;
    if (blocks.length > 150) {
      for (let i = 0; i + W <= blocks.length; i += 4) {
        let s = 0;
        for (let k = 0; k < W; k++) s += blocks[i + k].rms * blocks[i + k].rms;
        s = Math.sqrt(s / W);
        if (quiet == null || s < quiet) quiet = s;
      }
    }
    if (quiet != null) {
      const q = db(quiet);
      const t = q > -45 ? 'Room noise: high. A quieter spot would help (fans, windows, other people).'
        : q > -58 ? 'Room noise: some, but fine.'
        : 'Room noise: nice and quiet.';
      if (room.textContent !== t) room.textContent = t;
    } else if (room.textContent) {
      room.textContent = '';
    }
    requestAnimationFrame(loop);
  }

  async function testRecording() {
    if (busy || !E.mic) return;
    busy = true;
    const btn = $('mc-test');
    btn.disabled = true;
    $('mc-chirp').disabled = true;
    try {
      await E.ready();
      btn.textContent = 'Recording, sing now…';
      const data = await E.testRecord(5);
      btn.textContent = 'Playing it back…';
      await E.playBuffer(data);
      btn.textContent = 'Test again';
    } catch (err) {
      console.error(err);
      btn.textContent = 'Test recording';
    }
    btn.disabled = false;
    $('mc-chirp').disabled = false;
    busy = false;
  }

  async function timing() {
    if (busy || !E.mic) return;
    busy = true;
    const btn = $('mc-chirp'), msg = $('mc-timing-msg');
    btn.disabled = true;
    $('mc-test').disabled = true;
    msg.dataset.kind = '';
    msg.textContent = 'Listening… please stay quiet for a moment.';
    try {
      await E.ready();
      const r = await E.timingTest();
      if (r.heard) {
        msg.dataset.kind = 'warn';
        msg.textContent = 'Your microphone heard the chirps, so timing is now measured exactly (' + r.ms + ' ms). If that came from speakers or leaky headphones, the music will end up in your vocal too: record with headphones on, and keep them away from the microphone.';
      } else {
        msg.dataset.kind = 'good';
        msg.textContent = 'Your microphone didn’t hear the chirps. That is what you want while recording. Optional, for exact timing: hold one headphone right against the microphone and press Test again.';
      }
    } catch (err) {
      console.error(err);
      msg.textContent = 'That test didn’t work. Try once more.';
    }
    showTimingLine();
    btn.disabled = false;
    $('mc-test').disabled = false;
    busy = false;
  }

  M.mount = function () {
    $('mc-device').addEventListener('change', async e => {
      const id = e.target.value;
      try { localStorage.setItem(MIC_KEY, id); } catch (err) {}
      await start(id);
    });
    $('mc-test').addEventListener('click', testRecording);
    $('mc-chirp').addEventListener('click', timing);
    const finish = () => {
      if (busy) return;     // a test is running: it ends by itself in a moment
      E.stopTest();
      running = false;
      try { localStorage.setItem(CHECKED_KEY, '1'); } catch (e) {}
      $('dlg-mic').close();
      if (VB.App) VB.App.refreshAll();
    };
    $('mc-done').addEventListener('click', finish);
    $('mc-close').addEventListener('click', finish);
    $('dlg-mic').addEventListener('cancel', e => { e.preventDefault(); finish(); });
    $('dlg-mic').addEventListener('close', () => { running = false; });
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        if ($('dlg-mic').open) { listDevices(); showOutput(); }
      });
    }
  };
})();

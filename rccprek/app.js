(() => {
  'use strict';

  const WORDS = window.WORDS || [];
  const GAP = 0.35;            // seconds of quiet between the two languages
  const REPEAT_GUARD = 700;    // ms: a second tap on the same picture this soon is ignored
  const HOLD = 1200;           // ms to hold the grown-ups button
  const ORDERS = { 'zh-en': ['zh', 'en'], 'en-zh': ['en', 'zh'], zh: ['zh'], en: ['en'] };
  const SPEECH_LANG = { zh: 'zh-CN', en: 'en-US' };
  const SETTINGS_KEY = 'i-can-say.settings';

  const settings = Object.assign({ order: 'zh-en', showZh: false }, readSettings());
  if (!ORDERS[settings.order]) settings.order = 'zh-en';

  // ---- the board -----------------------------------------------------------

  const board = document.getElementById('board');
  const cards = new Map();

  for (const w of WORDS) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `card g-${w.group}`;
    card.setAttribute('aria-label', `${w.en}, ${w.zh}`);
    card.innerHTML = `
      <span class="card-inner">
        <span class="pic"><img alt="" draggable="false" decoding="async"></span>
        <span class="words-on-card">
          <span class="zh" lang="zh-CN"></span>
          <span class="en"></span>
        </span>
      </span>`;
    card.querySelector('img').src = picturePath(w);
    card.querySelector('.zh').textContent = w.zh;
    card.querySelector('.en').textContent = w.en;
    card.addEventListener('click', () => say(w));
    board.append(card);
    cards.set(w.id, card);
  }

  function picturePath(w) {
    return typeof w.picture === 'number' ? `pictures/${w.id}.png` : `pictures/${w.picture}`;
  }

  // Keep a 4-year-old's hands from zooming, scrolling or calling up menus.
  document.addEventListener('touchstart', () => {}, { passive: true });   // lets :active show on iOS
  document.addEventListener('contextmenu', e => { if (!e.target.closest('.panel')) e.preventDefault(); });
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('dblclick', e => e.preventDefault(), { passive: false });

  // ---- sound ---------------------------------------------------------------
  // Each picture has two short clips (audio/zh, audio/en), loaded once into memory.
  // Web Audio plays them back to back with a fixed gap; if it is missing, an <audio>
  // element plays the same clips, and if the clips could not load at all, the
  // device's own voices read the words.

  // iOS 17+: play through the silent switch, like a music app.
  try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}

  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  try { ctx = AC ? new AC() : null; } catch (e) { ctx = null; }

  const clips = {};   // 'zh/bathroom' -> { url, buf?, start?, dur?, gain? }
  for (const w of WORDS) for (const lang of ['zh', 'en']) loadClip(lang, w);

  async function loadClip(lang, w) {
    const key = `${lang}/${w.id}`;
    const directUrl = `audio/${key}.m4a`;

    // 1. If audio-data.js is present (works seamlessly on file://, localhost, https:// with zero CORS issues)
    if (window.AUDIO_DATA && window.AUDIO_DATA[key]) {
      const dataUrl = window.AUDIO_DATA[key];
      try {
        const base64 = dataUrl.split(',')[1];
        const binaryStr = atob(base64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
        const clip = { url: dataUrl };
        if (ctx) {
          try { Object.assign(clip, fit(await decode(bytes.buffer))); } catch (e) {}
        }
        clips[key] = clip;
        return;
      } catch (e) {
        clips[key] = { url: dataUrl };
        return;
      }
    }

    // 2. Otherwise load via fetch (for HTTP/HTTPS environments)
    try {
      const res = await fetch(directUrl);
      if (res.ok) {
        const data = await res.arrayBuffer();
        const clip = { url: URL.createObjectURL(new Blob([data], { type: 'audio/mp4' })) };
        if (ctx) {
          try { Object.assign(clip, fit(await decode(data))); } catch (e) {}
        }
        clips[key] = clip;
        return;
      }
    } catch (e) {}

    // 3. Fallback: direct relative URL so HTML5 <audio> plays the actual .m4a file
    clips[key] = { url: directUrl };
  }

  function decode(data) {
    return new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject));
  }

  // Skip the quiet at each end, and bring every clip to the same loudness.
  function fit(buf) {
    const ch = buf.getChannelData(0);
    let peak = 0;
    for (let i = 0; i < ch.length; i++) { const a = Math.abs(ch[i]); if (a > peak) peak = a; }
    if (!peak) return { buf, start: 0, dur: buf.duration, gain: 1 };
    const floor = peak * 0.02;
    let first = 0, last = ch.length - 1;
    while (first < last && Math.abs(ch[first]) < floor) first++;
    while (last > first && Math.abs(ch[last]) < floor) last--;
    const start = Math.max(0, first / buf.sampleRate - 0.02);
    const end = Math.min(buf.duration, last / buf.sampleRate + 0.06);
    return { buf, start, dur: end - start, gain: Math.min(4, 0.9 / peak) };
  }

  let playing = null;   // { id, started, stop() }

  function say(w) {
    const now = performance.now();
    if (playing && playing.id === w.id && now - playing.started < REPEAT_GUARD) return;
    stopPlaying();

    const langs = ORDERS[settings.order];
    const card = cards.get(w.id);
    const play = { id: w.id, started: now, stop: () => {} };
    playing = play;
    card.classList.add('speaking');
    const finish = () => {
      card.classList.remove('speaking');
      if (playing === play) playing = null;
    };

    const parts = langs.map(lang => clips[`${lang}/${w.id}`]);
    if (ctx && parts.every(c => c && c.buf)) playWebAudio(play, parts, finish);
    else if (parts.every(c => c && c.url)) playElement(play, parts, finish);
    else playSpeech(play, langs.map(lang => ({ lang, text: w[lang] })), finish);
  }

  function stopPlaying() {
    if (!playing) return;
    const p = playing;
    playing = null;
    p.stop();
  }

  function playWebAudio(play, parts, finish) {
    if (ctx.state !== 'running') ctx.resume().catch(() => {});
    const out = ctx.createGain();
    out.connect(ctx.destination);
    let t = ctx.currentTime + 0.03;
    const t0 = t;
    const sources = parts.map(c => {
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      src.buffer = c.buf;
      g.gain.value = c.gain;
      src.connect(g).connect(out);
      src.start(t, c.start, c.dur);
      t += c.dur + GAP;
      return src;
    });
    const total = t - GAP - t0;
    const timer = setTimeout(done, total * 1000 + 120);
    function done() { clearTimeout(timer); out.disconnect(); finish(); }
    play.stop = () => {
      // a short fade, so cutting a word off does not click
      const at = ctx.currentTime;
      out.gain.setValueAtTime(out.gain.value, at);
      out.gain.linearRampToValueAtTime(0, at + 0.04);
      sources.forEach(s => { try { s.stop(at + 0.05); } catch (e) {} });
      clearTimeout(timer);
      setTimeout(() => out.disconnect(), 80);
      finish();
    };
  }

  const el = new Audio();
  el.preload = 'auto';

  function playElement(play, parts, finish) {
    let i = 0, timer = 0, stopped = false;
    const next = () => {
      if (stopped) return;
      if (i >= parts.length) { cleanup(); finish(); return; }
      el.src = parts[i++].url;
      el.play().catch(() => { if (!stopped) { cleanup(); finish(); } });
    };
    const onEnded = () => { timer = setTimeout(next, GAP * 1000); };
    const cleanup = () => { el.removeEventListener('ended', onEnded); clearTimeout(timer); };
    el.addEventListener('ended', onEnded);
    play.stop = () => { stopped = true; cleanup(); el.pause(); finish(); };
    next();
  }

  function playSpeech(play, lines, finish) {
    const synth = window.speechSynthesis;
    if (!synth) { finish(); return; }
    synth.cancel();
    let stopped = false;
    lines.forEach((line, n) => {
      const u = new SpeechSynthesisUtterance(line.text);
      u.lang = SPEECH_LANG[line.lang];
      const voice = synth.getVoices().find(v => v.lang.replace('_', '-').startsWith(u.lang));
      if (voice) u.voice = voice;
      u.rate = 0.85;
      if (n === lines.length - 1) u.onend = u.onerror = () => { if (!stopped) finish(); };
      synth.speak(u);
    });
    play.stop = () => { stopped = true; synth.cancel(); finish(); };
  }

  // Leaving the app (home button, lock screen) stops the voice.
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopPlaying(); });

  // ---- grown-ups panel -----------------------------------------------------
  // Held, not tapped, so a quick tap from small fingers never opens it.

  const panel = document.getElementById('panel');
  const btn = document.getElementById('grownupBtn');
  const hint = document.getElementById('grownupHint');
  let holdTimer = 0, hintTimer = 0;

  btn.style.setProperty('--hold', HOLD + 'ms');
  btn.addEventListener('pointerdown', e => {
    e.preventDefault();
    try { btn.setPointerCapture(e.pointerId); } catch (err) {}
    btn.classList.add('holding');
    holdTimer = setTimeout(() => { endHold(); openPanel(); }, HOLD);
  });
  const cancelHold = () => {
    if (!btn.classList.contains('holding')) return;
    endHold();
    hint.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.remove('show'), 2200);
  };
  btn.addEventListener('pointerup', cancelHold);
  btn.addEventListener('pointercancel', cancelHold);
  btn.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(); } });
  function endHold() { clearTimeout(holdTimer); btn.classList.remove('holding'); }

  function openPanel() {
    hint.classList.remove('show');
    stopPlaying();
    if (typeof panel.showModal === 'function') panel.showModal();
    else panel.setAttribute('open', '');
  }
  panel.addEventListener('click', e => { if (e.target === panel) panel.close(); });   // tap outside

  const orderInputs = panel.querySelectorAll('input[name="order"]');
  orderInputs.forEach(input => {
    input.checked = input.value === settings.order;
    input.addEventListener('change', () => { settings.order = input.value; saveSettings(); });
  });

  const showZh = document.getElementById('showZh');
  showZh.checked = settings.showZh;
  document.body.classList.toggle('show-zh', settings.showZh);
  showZh.addEventListener('change', () => {
    settings.showZh = showZh.checked;
    document.body.classList.toggle('show-zh', settings.showZh);
    saveSettings();
  });

  const list = document.getElementById('wordList');
  for (const w of WORDS) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><span class="dot"></span></td><td lang="zh-CN"></td><td></td>`;
    tr.querySelector('.dot').style.background = `var(--${w.group})`;
    tr.cells[0].append(w.en);
    tr.cells[1].textContent = w.zh;
    tr.cells[2].textContent = w.pinyin || '';
    list.append(tr);
  }

  function readSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) {}
  }

  // ---- offline copy ----------------------------------------------------------
  // Skipped on this computer's preview server, so edits show up straight away.
  const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if ('serviceWorker' in navigator && location.protocol === 'https:' && !local) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();

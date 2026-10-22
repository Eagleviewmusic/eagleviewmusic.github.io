/* Xylophone Basics Play-Along: a Xylophone Basics video beside a playable instrument — a 7-bar xylophone
   (C D E F G A B, vibraphone or marimba sound) or a C–B piano with its black keys (the Virtual Keyboard's
   piano sound). Notes are C4–B4, the octave the videos play in, or C5–B5 with Play higher octave. The notes a
   video uses are always on; the others (and the black keys) switch on and off together in Settings. The video
   sits on the left or right, or on top when the screen is tall. */
(() => {
  'use strict';

  /* the twelve notes, by pitch class. Bar colours are the Rainbow Xylophone's, key colours the Virtual
     Keyboard's (white keys: the top half; black keys: while pressed). */
  const NOTES = [
    { name: 'C', bar: '#ef4444', key: '#FF3B30' },
    { name: 'C#', black: 'C♯<br>D♭', key: '#ff6818' },
    { name: 'D', bar: '#f97316', key: '#FF9500' },
    { name: 'D#', black: 'D♯<br>E♭', key: '#ffb000' },
    { name: 'E', bar: '#facc15', key: '#FFCC00' },
    { name: 'F', bar: '#22c55e', key: '#34C759' },
    { name: 'F#', black: 'F♯<br>G♭', key: '#32c490' },
    { name: 'G', bar: '#2dd4bf', key: '#30c0c6' },
    { name: 'G#', black: 'G♯<br>A♭', key: '#189de2' },
    { name: 'A', bar: '#3b82f6', key: '#007AFF' },
    { name: 'A#', black: 'A♯<br>B♭', key: '#5866ee' },
    { name: 'B', bar: '#a855f7', key: '#AF52DE' },
  ];
  NOTES.forEach((n, pc) => { n.pc = pc; n.freq = 440 * Math.pow(2, (pc - 9) / 12); });
  const WHITES = NOTES.filter(n => !n.black);   // the bars, the white keys
  const BLACKS = NOTES.filter(n => n.black);
  /* the Rainbow Xylophone's keys for bars (and white keys) 1–7: the number row (the labels show these),
     the number pad, and the Q row */
  const KEYS = {};
  WHITES.forEach((n, i) => { KEYS['Digit' + (i + 1)] = n.pc; KEYS['Numpad' + (i + 1)] = n.pc; KEYS['Key' + 'QWERTYU'[i]] = n.pc; });
  /* each bar's length: the Rainbow Xylophone's, 4% shorter per bar */
  const pct = i => (100 - i * 4) / 100;

  const VIDEOS = window.XB_VIDEOS;
  const DEFAULTS = { side: 'left', sound: 'vibraphone', high: false, xyloVol: 70, videoVol: 100, unused: false, names: true, keys: false };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const S = Object.assign({}, DEFAULTS, store.get('xbpa.settings'));

  const $ = id => document.getElementById(id);
  const stage = $('stage'), frame = $('frame'), pianoEl = $('piano'), videoBox = $('video-box'),
    panel = $('settings'), gear = $('gear');
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const focusStage = () => stage.focus({ preventScroll: true });
  const piano = () => S.sound === 'piano';

  /* the mallets: the Rainbow Xylophone's engine (sound.js) */
  const mallets = new XyloSound();
  if (!piano()) mallets.instrument = S.sound;
  mallets.setVolume(S.xyloVol / 100);

  /* the piano: the Virtual Keyboard's engine (audio.js, a copy of Digital Accordion's) at its level and room;
     a key sounds while it is held */
  const voices = new Map();   // pc → the piano voice of a held key
  let pianoAwake = false;
  const pianoLevel = () => 0.8 * S.xyloVol / 70;   // 70 (the default) = the Virtual Keyboard's level
  function wakePiano() {
    Audio.ensure();
    if (pianoAwake) return;
    pianoAwake = true;
    Audio.setReverb(0.35);
    Audio.setLevel('keys', pianoLevel());
  }
  function hush(pc) {
    if (!voices.has(pc)) return;
    Audio.stop(voices.get(pc));
    voices.delete(pc);
  }

  let video = pickVideo();
  const barEls = [], keyEls = [];   // by pitch class (bars: whites only)
  let geo = { px: 0, py: 0, bw: 1, gap: 0, bh: 0 };    // the xylophone's measures, from layoutXylophone
  let pgeo = { p: 0, ww: 1, wh: 0, bw: 0, bh: 0 };     // the piano's, from layoutPiano
  const held = NOTES.map(() => 0);   // how many fingers, mice and keys hold each note down

  function pickVideo() {
    const slug = decodeURIComponent(location.hash.slice(1)).toLowerCase() || store.get('xbpa.video');
    return VIDEOS.find(v => v.slug === slug) || VIDEOS[0];
  }
  const used = pc => video.notes.includes(NOTES[pc].name);
  const playable = pc => used(pc) || S.unused;
  const elOf = pc => (piano() ? keyEls : barEls)[pc];
  const colourOf = letter => NOTES.find(n => n.name === letter).bar;

  /* ---------- tabs: one per video, its notes as little bars ---------- */

  function drawTabs() {
    const nav = $('tabs');
    nav.textContent = '';
    VIDEOS.forEach(v => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', v === video);
      tab.setAttribute('aria-label', v.title);
      tab.title = v.title;
      v.notes.forEach(n => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = n;
        chip.style.background = colourOf(n);
        tab.appendChild(chip);
      });
      tab.addEventListener('click', () => { choose(v); focusStage(); });
      nav.appendChild(tab);
    });
  }

  function choose(v) {
    if (!v || v === video) return;
    video = v;
    store.set('xbpa.video', v.slug);
    history.replaceState(null, '', '#' + v.slug);
    drawTabs();
    refreshInstrument();
    refreshSettings();
    $('video-link').href = 'https://youtu.be/' + v.youtube;
    if (ytReady) { $('video-msg').hidden = true; player.cueVideoById(v.youtube); }
  }
  addEventListener('hashchange', () => choose(pickVideo()));

  /* ---------- the instruments ---------- */

  function drawXylophone() {
    WHITES.forEach((n, i) => {
      const el = document.createElement('div');
      el.className = 'bar';
      el.setAttribute('role', 'button');
      el.style.setProperty('--c', n.bar);
      el.style.setProperty('--pct', pct(i));
      el.innerHTML = '<span class="bolt top"></span><span class="letter">' + n.name + '</span>' +
        '<span class="key">' + (i + 1) + '</span><span class="bolt bottom"></span>';
      $('bars').appendChild(el);
      barEls[n.pc] = el;
    });
  }

  function drawPiano() {
    NOTES.forEach(n => {
      const el = document.createElement('div');
      el.className = 'pkey ' + (n.black ? 'black' : 'white');
      el.setAttribute('role', 'button');
      el.style.setProperty('--c', n.key);
      el.innerHTML = n.black ? '<span class="name">' + n.black + '</span>'
        : '<span class="name">' + n.name + '</span><span class="key">' + (WHITES.indexOf(n) + 1) + '</span>';
      $('pkeys').appendChild(el);
      keyEls[n.pc] = el;
    });
  }

  function refreshInstrument() {
    frame.classList.toggle('tray', piano());   // the piano sits on the xylophone's brown tray, bars and rails gone
    pianoEl.hidden = !piano();
    const label = n => n.black ? n.black.replace('<br>', ' / ') : n.name;
    [barEls, keyEls].forEach(els => els.forEach((el, pc) => {
      if (!el) return;
      el.classList.toggle('off', !playable(pc));
      el.setAttribute('aria-label', playable(pc) ? 'Play ' + label(NOTES[pc]) : label(NOTES[pc]) + ', switched off');
    }));
    document.body.classList.toggle('show-names', !!S.names);
    document.body.classList.toggle('show-keys', !!S.keys);
  }

  /* let go of everything (switching instruments) */
  function releaseAll() {
    held.fill(0);
    [...barEls, ...keyEls].forEach(el => el && el.classList.remove('down'));
    [...voices.keys()].forEach(hush);
  }

  function strike(pc) {
    if (pc < 0 || !playable(pc)) return false;
    const freq = NOTES[pc].freq * (S.high ? 2 : 1);
    if (piano()) {
      wakePiano();
      hush(pc);
      voices.set(pc, Audio.play('keys', [freq], 'piano'));
    } else {
      mallets.play(pc, freq);
      const el = barEls[pc];
      if (el.animate) el.animate([{ scale: 1 }, { scale: 0.95 }, { scale: 1 }], { duration: 100, easing: 'ease-in-out' });
    }
    return true;
  }
  function press(pc) {
    if (!strike(pc)) return -1;
    if (held[pc]++ === 0) elOf(pc).classList.add('down');
    return pc;
  }
  function release(pc) {
    if (pc < 0 || held[pc] <= 0 || --held[pc] > 0) return;
    elOf(pc).classList.remove('down');
    hush(pc);   // a piano key stops when let go; the bars ring on
  }

  /* fingers and the mouse: each pointer plays the bar or key it lands on, and every one it slides onto.
     Which one is worked out from the layout, not from what is drawn: a struck bar shrinks for a moment, and a
     finger near its edge would otherwise slip off and strike it again. Each bar owns half the gap on either
     side, and a little past its ends, so no tap lands in a dead spot. */
  const barAt = (x, y) => {
    const r = frame.getBoundingClientRect(), g = geo, slot = g.bw + g.gap;
    const i = Math.floor((x - r.left - 4 - g.px + g.gap / 2) / slot);
    if (i < 0 || i >= WHITES.length) return -1;
    const h = g.bh * pct(i), top = r.top + 4 + g.py + (g.bh - h) / 2, slack = g.py * 0.6;
    return y >= top - slack && y <= top + h + slack ? WHITES[i].pc : -1;
  };
  /* black keys first (they sit on top), then the white key under the finger */
  const blackLeft = n => (WHITES.findIndex(w => w.pc === n.pc - 1) + 1) * pgeo.ww - pgeo.bw / 2;
  const keyAt = (x, y) => {
    const r = pianoEl.getBoundingClientRect(), g = pgeo;
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return -1;
    const fx = clamp(x - r.left - g.p, 0, 7 * g.ww - 0.01), fy = y - r.top - g.p;
    if (fy <= g.bh) {
      const b = BLACKS.find(n => fx >= blackLeft(n) && fx < blackLeft(n) + g.bw);
      if (b) return b.pc;
    }
    return WHITES[Math.floor(fx / g.ww)].pc;
  };
  const noteAt = (x, y) => piano() ? keyAt(x, y) : barAt(x, y);

  const pointers = new Map();   // pointerId → the note it holds, or -1
  const lift = e => {
    if (!pointers.has(e.pointerId)) return;
    release(pointers.get(e.pointerId));
    pointers.delete(e.pointerId);
  };
  [frame, pianoEl].forEach(el => {
    el.addEventListener('pointerdown', e => {
      if (e.button > 0) return;
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
      pointers.set(e.pointerId, press(noteAt(e.clientX, e.clientY)));
    });
    el.addEventListener('pointermove', e => {
      if (!pointers.has(e.pointerId)) return;
      const pc = noteAt(e.clientX, e.clientY), was = pointers.get(e.pointerId);
      if (pc === was) return;
      release(was);
      pointers.set(e.pointerId, press(pc));
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => el.addEventListener(t, lift));
    el.addEventListener('contextmenu', e => e.preventDefault());
  });

  /* keys */
  const keysDown = new Map();   // code → note
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape') { openPanel(false); return; }
    const pc = KEYS[e.code];
    if (pc !== undefined) {
      e.preventDefault();
      if (!e.repeat && !keysDown.has(e.code)) keysDown.set(e.code, press(pc));
      return;
    }
    /* Space plays and pauses the video (the video's own keys are off, so the number keys never jump it) */
    if (e.code === 'Space' && !e.target.closest('button, input, a')) {
      e.preventDefault();
      if (!e.repeat) togglePlay();
    }
  });
  addEventListener('keyup', e => {
    if (!keysDown.has(e.code)) return;
    release(keysDown.get(e.code));
    keysDown.delete(e.code);
  });

  /* Clicking the video gives it the keyboard, and then the number keys would never reach the instrument:
     take the keyboard straight back (the click still plays or pauses the video). */
  addEventListener('blur', () => {
    keysDown.forEach(release);
    keysDown.clear();
    setTimeout(() => {
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') focusStage();
    }, 0);
  });

  /* ---------- layout: sizes in pixels from the stage's size ---------- */

  function place(el, r) {
    el.style.left = Math.round(r.x) + 'px';
    el.style.top = Math.round(r.y) + 'px';
    el.style.width = Math.round(r.w) + 'px';
    el.style.height = Math.round(r.h) + 'px';
  }

  function layout() {
    const W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    const tall = H > W;
    const pad = Math.round(clamp(Math.min(W, H) * 0.03, 8, 24)), gap = pad;
    const B = 8;   // the video box's border, both sides together
    let v, x;
    if (tall) {
      /* video on top, at most 45% of the height; the instrument below */
      let vw = W - 2 * pad, vh = (vw - B) * 9 / 16 + B;
      const most = (H - 2 * pad - gap) * 0.45;
      if (vh > most) { vh = most; vw = (vh - B) * 16 / 9 + B; }
      v = { x: (W - vw) / 2, y: pad, w: vw, h: vh };
      x = { x: pad, y: pad + vh + gap, w: W - 2 * pad, h: H - 2 * pad - gap - vh };
    } else {
      /* side by side: the instrument gets about 42% of the width, the video the rest (as tall as fits) */
      const A = W - 2 * pad - gap;
      let xw = clamp(A * 0.42, Math.min(340, A * 0.5), 760);
      let vw = A - xw, vh = (vw - B) * 9 / 16 + B;
      if (vh > H - 2 * pad) { vh = H - 2 * pad; vw = (vh - B) * 16 / 9 + B; xw = A - vw; }
      const left = S.side !== 'right';
      v = { x: left ? pad : W - pad - vw, y: (H - vh) / 2, w: vw, h: vh };
      x = { x: left ? pad + vw + gap : pad, y: pad, w: xw, h: H - 2 * pad };
    }
    place(videoBox, v);
    layoutXylophone(x);   // the tray is the xylophone's size either way (the piano is a little wider: the user likes it)
    if (piano()) layoutPiano(x);
    $('tall-hint').hidden = !tall;
    panel.querySelector('[data-set="side"]').classList.toggle('disabled', tall);
  }

  /* bars as wide as the space allows (up to 120 px), about 7 times as long, the Rainbow Xylophone's
     padding and gaps scaled to them */
  function xyloSize(r) {
    const room = 14;   // the handles stick out past the frame
    const W = r.w - 2 * room, H = r.h - 8;
    const guess = W / 8.4;
    const px = clamp(guess * 0.4, 12, 32), gap = clamp(guess * 0.1, 4, 10);
    const bw = clamp((W - 2 * px - 6 * gap - 8) / 7, 18, 120);
    const py = clamp(bw * 0.3, 12, 32);
    const bh = Math.max(60, Math.min(bw * 7, H - 2 * py - 8));
    return { px, gap, bw, py, bh, fw: 7 * bw + 6 * gap + 2 * px + 8, fh: bh + 2 * py + 8 };
  }

  function layoutXylophone(r) {
    const { px, gap, bw, py, bh, fw, fh } = xyloSize(r);
    place(frame, { x: r.x + (r.w - fw) / 2, y: r.y + (r.h - fh) / 2, w: fw, h: fh });
    const bolt = clamp(bw * 0.15, 8, 14), boltAt = clamp(bw * 0.15, 7, 14);
    const vars = {
      '--bw': bw, '--bh': bh, '--gap': gap, '--px': px, '--bolt': bolt, '--bolt-at': boltAt,
      '--letter': clamp(bw * 0.4, 16, 42), '--keyfs': clamp(bw * 0.3, 13, 28),
      '--hl': Math.max(40, fh * 0.33), '--hr': Math.max(30, fh * 0.22),
    };
    for (const k in vars) frame.style.setProperty(k, vars[k] + 'px');
    geo = { px, py, bw, gap, bh };
    drawRails({ px, py, bw, gap, bh, bolt, boltAt });
  }

  /* the two felt rails, through the bolts at the bars' ends */
  function drawRails({ px, py, bw, gap, bh, bolt, boltAt }) {
    const cx = i => px + i * (bw + gap) + bw / 2;
    const top = i => py + bh * (1 - pct(i)) / 2;
    const upper = i => top(i) + boltAt + bolt / 2;
    const lower = i => top(i) + bh * pct(i) - 4 - boltAt - bolt / 2;
    const ext = bw / 2 + px * 0.55, last = WHITES.length - 1;
    const line = y => {
      const m = (y(last) - y(0)) / (cx(last) - cx(0));
      return '<line x1="' + (cx(0) - ext) + '" y1="' + (y(0) - m * ext) + '" x2="' + (cx(last) + ext) +
        '" y2="' + (y(last) + m * ext) + '"/>';
    };
    $('rails').innerHTML = '<g stroke="#2d1b15" stroke-width="' + clamp(bw * 0.2, 6, 16) +
      '" stroke-linecap="round">' + line(upper) + line(lower) + '</g>';
  }

  /* the Virtual Keyboard's piano, its keys up to 130 px wide; the whole keyboard as tall as the xylophone's
     B bar would be in the same space (the user's measure: it looks more natural than keys that fill it).
     Black keys 60% as wide and 62.5% as long, as in the Virtual Keyboard. */
  function layoutPiano(r) {
    const m = 6;
    const W = r.w - 2 * m;
    const p = clamp(W * 0.015, 6, 12);
    const ww = clamp((W - 2 * p) / 7, 24, 130);
    const fh = Math.max(80, xyloSize(r).bh * pct(WHITES.length - 1)), wh = fh - 2 * p;
    const bw = ww * 0.6, bh = wh * 0.625;
    const fw = 7 * ww + 2 * p;
    place(pianoEl, { x: r.x + (r.w - fw) / 2, y: r.y + (r.h - fh) / 2, w: fw, h: fh });
    pgeo = { p, ww, wh, bw, bh };
    const vars = {
      '--p': p, '--ww': ww, '--wh': wh, '--kbw': bw, '--kbh': bh,
      '--name': clamp(ww * 0.36, 14, 40), '--bname': clamp(bw * 0.36, 9, 20), '--keyfs': clamp(ww * 0.28, 12, 26),
    };
    for (const k in vars) pianoEl.style.setProperty(k, vars[k] + 'px');
    WHITES.forEach((n, i) => { keyEls[n.pc].style.left = i * ww + 'px'; });
    BLACKS.forEach(n => { keyEls[n.pc].style.left = blackLeft(n) + 'px'; });
  }

  /* ---------- the video (YouTube's player, so its volume can be set) ---------- */

  let player = null, ytReady = false, ytTimer = 0;

  const MSG = {
    blocked: 'The video didn’t load. YouTube may be blocked on this network.',
    file: 'Videos won’t play when this page is opened straight from its file. ' +
      'Double-click “Open the Play-Along” in this folder instead.',
    private: 'This video wasn’t found. It may be private or deleted.',
    noEmbed: 'This video’s owner doesn’t let it play on other sites.',
    other: 'YouTube won’t play this video here.',
  };

  function loadYouTube() {
    $('video-link').href = 'https://youtu.be/' + video.youtube;
    /* YouTube refuses every video in a page opened from a file (it wants to know the site): say what to do */
    if (location.protocol === 'file:') { showVideoMsg(MSG.file); return; }
    window.onYouTubeIframeAPIReady = () => {
      const vars = { rel: 0, playsinline: 1, disablekb: 1, iv_load_policy: 3, modestbranding: 1 };
      if (/^https?:/.test(location.protocol)) vars.origin = location.origin;
      player = new YT.Player('yt', {
        videoId: video.youtube,
        playerVars: vars,
        events: {
          onReady: () => {
            ytReady = true;
            clearTimeout(ytTimer);
            $('video-msg').hidden = true;
            applyVideoVolume();
          },
          onError: e => showVideoMsg(e.data === 100 ? MSG.private : e.data === 101 || e.data === 150 ? MSG.noEmbed : MSG.other),
        },
      });
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => showVideoMsg(MSG.blocked);
    document.head.appendChild(s);
    ytTimer = setTimeout(() => { if (!ytReady) showVideoMsg(MSG.blocked); }, 15000);
  }

  function showVideoMsg(text) {
    $('video-msg').querySelector('p').textContent = text;
    $('video-msg').hidden = false;
  }

  function applyVideoVolume() {
    if (!ytReady) return;
    if (S.videoVol <= 0) player.mute();
    else { player.unMute(); player.setVolume(S.videoVol); }
  }

  /* the video's own slider may have moved it */
  function readVideoVolume() {
    if (!ytReady) return;
    const v = player.isMuted() ? 0 : Math.round(player.getVolume());
    if (v !== S.videoVol) { S.videoVol = v; store.set('xbpa.settings', S); }
  }

  function togglePlay() {
    if (!ytReady) return;
    const st = player.getPlayerState();
    if (st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING) player.pauseVideo();
    else player.playVideo();
  }

  /* ---------- settings ---------- */

  function openPanel(open) {
    if (open === undefined) open = panel.hidden;
    if (open === !panel.hidden) return;
    panel.hidden = !open;
    gear.setAttribute('aria-expanded', open);
    if (open) { readVideoVolume(); refreshSettings(); }
    else if (panel.contains(document.activeElement) || document.activeElement === gear) focusStage();
  }
  gear.addEventListener('click', () => openPanel());
  /* a click anywhere else closes it — except on the instrument, so it can be played while the volume is set */
  document.addEventListener('pointerdown', e => {
    if (panel.hidden || [panel, gear, frame, pianoEl].some(el => el.contains(e.target))) return;
    openPanel(false);
  });

  function refreshSettings() {
    panel.querySelectorAll('.seg').forEach(seg => seg.querySelectorAll('button').forEach(b => {
      b.classList.toggle('on', S[seg.dataset.set] === b.dataset.v);
    }));
    panel.querySelectorAll('input[type="range"]').forEach(inp => {
      inp.value = S[inp.dataset.set];
      inp.nextElementSibling.textContent = S[inp.dataset.set];
    });
    panel.querySelectorAll('.switch').forEach(sw => sw.setAttribute('aria-checked', !!S[sw.dataset.set]));
    const unused = WHITES.filter(n => !used(n.pc)).map(n => n.name);
    $('unused-names').textContent = unused.join(' ');
    /* the piano always has unused keys (the black ones); the xylophone may not */
    panel.querySelector('[data-set="unused"]').closest('.row').hidden = !unused.length && !piano();
    $('key-names').textContent = WHITES.map((n, i) => playable(n.pc) ? i + 1 : 0).filter(Boolean).join(' ');
  }

  function set(k, v) {
    S[k] = v;
    store.set('xbpa.settings', S);
    if (k === 'sound') {
      releaseAll();
      if (!piano()) mallets.instrument = v;
      refreshInstrument();
      layout();
      demo();
    }
    if (k === 'high') demo();
    if (k === 'xyloVol') {
      mallets.setVolume(v / 100);
      if (pianoAwake) Audio.setLevel('keys', pianoLevel());
    }
    if (k === 'videoVol') applyVideoVolume();
    if (k === 'side') layout();
    if (k === 'unused' || k === 'names' || k === 'keys') refreshInstrument();
    refreshSettings();
  }
  /* a note to hear the sound or volume just chosen: the video's lowest (a piano key let go after a moment) */
  function demo() {
    const pc = WHITES.find(n => used(n.pc)).pc;
    if (held[pc] || !strike(pc) || !piano()) return;
    const v = voices.get(pc);
    setTimeout(() => { if (voices.get(pc) === v && !held[pc]) hush(pc); }, 450);
  }

  panel.addEventListener('click', e => {
    const b = e.target.closest('.seg button'), sw = e.target.closest('.switch');
    if (b) set(b.parentElement.dataset.set, b.dataset.v);
    if (sw) set(sw.dataset.set, !S[sw.dataset.set]);
  });
  panel.addEventListener('input', e => { if (e.target.dataset.set) set(e.target.dataset.set, +e.target.value); });
  panel.addEventListener('change', e => { if (e.target.dataset.set === 'xyloVol') demo(); });

  if (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
    $('ios-hint').hidden = false;
  }

  /* ---------- start ---------- */

  history.replaceState(null, '', '#' + video.slug);
  drawTabs();
  drawXylophone();
  drawPiano();
  refreshInstrument();
  refreshSettings();
  layout();
  new ResizeObserver(layout).observe(stage);
  addEventListener('resize', layout);
  loadYouTube();
  focusStage();
})();

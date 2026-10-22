/* Xylophone Basics Play-Along: a Xylophone Basics video beside a playable 7-bar xylophone (C D E F G A B,
   C4–B4, the octave the videos play in, or C5–B5 with Play higher octave). The bars a video uses are always on; the unused ones switch on
   and off together in Settings. The video sits on the left or right, or on top when the screen is tall. */
(() => {
  'use strict';

  const BARS = [
    { letter: 'C', freq: 261.63, color: '#ef4444' },
    { letter: 'D', freq: 293.66, color: '#f97316' },
    { letter: 'E', freq: 329.63, color: '#facc15' },
    { letter: 'F', freq: 349.23, color: '#22c55e' },
    { letter: 'G', freq: 392.00, color: '#2dd4bf' },
    { letter: 'A', freq: 440.00, color: '#3b82f6' },
    { letter: 'B', freq: 493.88, color: '#a855f7' },
  ];
  /* the Rainbow Xylophone's keys for bars 1–7: the number row (the labels show these), the number pad,
     and the Q row */
  const KEYS = {};
  BARS.forEach((b, i) => { KEYS['Digit' + (i + 1)] = i; KEYS['Numpad' + (i + 1)] = i; KEYS['Key' + 'QWERTYU'[i]] = i; });
  /* each bar's length: the Rainbow Xylophone's, 4% shorter per bar */
  const pct = i => (100 - i * 4) / 100;

  const VIDEOS = window.XB_VIDEOS;
  const DEFAULTS = { side: 'left', sound: 'vibraphone', high: false, xyloVol: 70, videoVol: 100, unused: false, keys: false };
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const S = Object.assign({}, DEFAULTS, store.get('xbpa.settings'));

  const $ = id => document.getElementById(id);
  const stage = $('stage'), frame = $('frame'), videoBox = $('video-box'), panel = $('settings'), gear = $('gear');
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const focusStage = () => stage.focus({ preventScroll: true });

  const sound = new XyloSound();
  sound.instrument = S.sound;
  sound.setVolume(S.xyloVol / 100);

  let video = pickVideo();
  let barEls = [];
  let geo = { px: 0, py: 0, bw: 1, gap: 0, bh: 0 };   // the xylophone's measures, from layoutXylophone
  const held = BARS.map(() => 0);   // how many fingers, mice and keys hold each bar down

  function pickVideo() {
    const slug = decodeURIComponent(location.hash.slice(1)).toLowerCase() || store.get('xbpa.video');
    return VIDEOS.find(v => v.slug === slug) || VIDEOS[0];
  }
  const used = i => video.notes.includes(BARS[i].letter);
  const playable = i => used(i) || S.unused;
  const colourOf = letter => BARS.find(b => b.letter === letter).color;

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
    refreshBars();
    refreshSettings();
    $('video-link').href = 'https://youtu.be/' + v.youtube;
    if (ytReady) { $('video-msg').hidden = true; player.cueVideoById(v.youtube); }
  }
  addEventListener('hashchange', () => choose(pickVideo()));

  /* ---------- the xylophone ---------- */

  function drawBars() {
    const row = $('bars');
    barEls = BARS.map((b, i) => {
      const el = document.createElement('div');
      el.className = 'bar';
      el.dataset.i = i;
      el.setAttribute('role', 'button');
      el.style.setProperty('--c', b.color);
      el.style.setProperty('--pct', pct(i));
      el.innerHTML = '<span class="bolt top"></span><span class="letter">' + b.letter + '</span>' +
        '<span class="key">' + (i + 1) + '</span><span class="bolt bottom"></span>';
      row.appendChild(el);
      return el;
    });
    refreshBars();
  }

  function refreshBars() {
    barEls.forEach((el, i) => {
      el.classList.toggle('off', !playable(i));
      el.setAttribute('aria-label', playable(i) ? 'Play ' + BARS[i].letter : BARS[i].letter + ', switched off');
    });
    document.body.classList.toggle('show-keys', !!S.keys);
  }

  function strike(i) {
    if (i < 0 || !playable(i)) return false;
    sound.play(i, BARS[i].freq * (S.high ? 2 : 1));
    if (barEls[i].animate) barEls[i].animate([{ scale: 1 }, { scale: 0.95 }, { scale: 1 }], { duration: 100, easing: 'ease-in-out' });
    return true;
  }
  function press(i) {
    if (!strike(i)) return -1;
    if (held[i]++ === 0) barEls[i].classList.add('down');
    return i;
  }
  function release(i) {
    if (i >= 0 && held[i] > 0 && --held[i] === 0) barEls[i].classList.remove('down');
  }

  /* fingers and the mouse: each pointer strikes the bar it lands on, and every bar it slides onto.
     Which bar is worked out from the layout, not from what is drawn: a struck bar shrinks for a moment,
     and a finger near its edge would otherwise slip off and strike it again. Each bar owns half the gap
     on either side, and a little past its ends, so no tap lands in a dead spot. */
  const pointers = new Map();   // pointerId → the bar it holds, or -1
  const barAt = (x, y) => {
    const r = frame.getBoundingClientRect(), g = geo, slot = g.bw + g.gap;
    const i = Math.floor((x - r.left - 4 - g.px + g.gap / 2) / slot);
    if (i < 0 || i >= BARS.length) return -1;
    const h = g.bh * pct(i), top = r.top + 4 + g.py + (g.bh - h) / 2, slack = g.py * 0.6;
    return y >= top - slack && y <= top + h + slack ? i : -1;
  };
  frame.addEventListener('pointerdown', e => {
    if (e.button > 0) return;
    e.preventDefault();
    try { frame.setPointerCapture(e.pointerId); } catch (err) {}
    pointers.set(e.pointerId, press(barAt(e.clientX, e.clientY)));
  });
  frame.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    const i = barAt(e.clientX, e.clientY), was = pointers.get(e.pointerId);
    if (i === was) return;
    release(was);
    pointers.set(e.pointerId, press(i));
  });
  const lift = e => {
    if (!pointers.has(e.pointerId)) return;
    release(pointers.get(e.pointerId));
    pointers.delete(e.pointerId);
  };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => frame.addEventListener(t, lift));
  frame.addEventListener('contextmenu', e => e.preventDefault());

  /* keys */
  const keysDown = new Map();   // code → bar
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape') { openPanel(false); return; }
    const i = KEYS[e.code];
    if (i !== undefined) {
      e.preventDefault();
      if (!e.repeat && !keysDown.has(e.code)) keysDown.set(e.code, press(i));
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

  /* Clicking the video gives it the keyboard, and then the number keys would never reach the xylophone:
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
      /* video on top, at most 45% of the height; the xylophone below */
      let vw = W - 2 * pad, vh = (vw - B) * 9 / 16 + B;
      const most = (H - 2 * pad - gap) * 0.45;
      if (vh > most) { vh = most; vw = (vh - B) * 16 / 9 + B; }
      v = { x: (W - vw) / 2, y: pad, w: vw, h: vh };
      x = { x: pad, y: pad + vh + gap, w: W - 2 * pad, h: H - 2 * pad - gap - vh };
    } else {
      /* side by side: the xylophone gets about 42% of the width, the video the rest (as tall as fits) */
      const A = W - 2 * pad - gap;
      let xw = clamp(A * 0.42, Math.min(340, A * 0.5), 760);
      let vw = A - xw, vh = (vw - B) * 9 / 16 + B;
      if (vh > H - 2 * pad) { vh = H - 2 * pad; vw = (vh - B) * 16 / 9 + B; xw = A - vw; }
      const left = S.side !== 'right';
      v = { x: left ? pad : W - pad - vw, y: (H - vh) / 2, w: vw, h: vh };
      x = { x: left ? pad + vw + gap : pad, y: pad, w: xw, h: H - 2 * pad };
    }
    place(videoBox, v);
    layoutXylophone(x);
    $('tall-hint').hidden = !tall;
    panel.querySelector('[data-set="side"]').classList.toggle('disabled', tall);
  }

  /* bars as wide as the space allows (up to 120 px), about 7 times as long, the Rainbow Xylophone's
     padding and gaps scaled to them */
  function layoutXylophone(r) {
    const room = 14;   // the handles stick out past the frame
    const W = r.w - 2 * room, H = r.h - 8;
    const guess = W / 8.4;
    const px = clamp(guess * 0.4, 12, 32), gap = clamp(guess * 0.1, 4, 10);
    const bw = clamp((W - 2 * px - 6 * gap - 8) / 7, 18, 120);
    const py = clamp(bw * 0.3, 12, 32);
    const bh = Math.max(60, Math.min(bw * 7, H - 2 * py - 8));
    const fw = 7 * bw + 6 * gap + 2 * px + 8, fh = bh + 2 * py + 8;
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
    const ext = bw / 2 + px * 0.55, last = BARS.length - 1;
    const line = y => {
      const m = (y(last) - y(0)) / (cx(last) - cx(0));
      return '<line x1="' + (cx(0) - ext) + '" y1="' + (y(0) - m * ext) + '" x2="' + (cx(last) + ext) +
        '" y2="' + (y(last) + m * ext) + '"/>';
    };
    $('rails').innerHTML = '<g stroke="#2d1b15" stroke-width="' + clamp(bw * 0.2, 6, 16) +
      '" stroke-linecap="round">' + line(upper) + line(lower) + '</g>';
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
  /* a click anywhere else closes it — except on the xylophone, so it can be played while the volume is set */
  document.addEventListener('pointerdown', e => {
    if (!panel.hidden && !panel.contains(e.target) && !gear.contains(e.target) && !frame.contains(e.target)) openPanel(false);
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
    const unused = BARS.filter((b, i) => !used(i)).map(b => b.letter);
    $('unused-names').textContent = unused.join(' ');
    panel.querySelector('[data-set="unused"]').closest('.row').hidden = !unused.length;
    $('key-names').textContent = BARS.map((b, i) => i + 1).filter(n => playable(n - 1)).join(' ');
  }

  function set(k, v) {
    S[k] = v;
    store.set('xbpa.settings', S);
    if (k === 'sound') { sound.instrument = v; demo(); }
    if (k === 'high') demo();
    if (k === 'xyloVol') sound.setVolume(v / 100);
    if (k === 'videoVol') applyVideoVolume();
    if (k === 'side') layout();
    if (k === 'unused' || k === 'keys') refreshBars();
    refreshSettings();
  }
  /* a note to hear the sound or volume just chosen: the video's lowest */
  const demo = () => strike(BARS.findIndex((b, i) => used(i)));

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
  drawBars();
  refreshSettings();
  layout();
  new ResizeObserver(layout).observe(stage);
  addEventListener('resize', layout);
  loadYouTube();
  focusStage();
})();

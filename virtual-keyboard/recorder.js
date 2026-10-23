/* ==========================================================================
   Virtual Keyboard — recorder.js
   A four-track recorder, after the tape machines: record a line, then play
   it back while recording the next line on another track.

   It keeps what was played — which note, on which beat, for how long — not
   the sound itself, and plays it back through the same engine (audio.js),
   so a track sounds exactly as it did and can change its sound afterwards.
   Notes are kept in beats, so a new tempo speeds the whole song up or slows
   it down. Song files are rendered offline by Audio.render(); the MP3 is
   written by vendor/lame.min.js.

   Timing: a key's moment is read from its event's own timestamp, put on the
   audio clock, then moved earlier by the recording delay — how late sound
   reaches this player, and their hands come back — which "Line up the
   timing" measures by tapping along with a click. Kept per device.

   window.Recorder = { noteOn, noteOff, syncSound } — script.js calls these.
   ========================================================================== */
(() => {
  // In the Recording Studio, the studio's tracks take the place of these four.
  if (typeof STUDIO !== 'undefined' && STUDIO) return;
  const TRACKS = 4;
  const TRACK_COLORS = ['#F0525A', '#F4A21C', '#2DB86A', '#3B95E6']; // the count-in card's colours
  const STORE_KEY = 'virtual_keyboard_recording_v1';
  const DELAY_KEY = 'virtual_keyboard_rec_delay_v1';
  const OPEN_KEY = 'virtual_keyboard_recorder_open_v1';
  const METERS = { '2/4': 2, '3/4': 3, '4/4': 4, '6/8': 2 }; // beats in a bar; 6/8 is counted in two
  const CLICKS = ['record', 'always', 'off'];
  const TEMPO_MIN = 40, TEMPO_MAX = 220;
  const LOOKAHEAD = 0.15;   // seconds of notes handed to the engine ahead of time
  const HIDDEN_LOOKAHEAD = 1.5;
  const PUMP_MS = 25;
  const MIN_HOLD = 0.05;    // beats: the shortest note kept
  const EARLY = 0.125;      // beats: how early a note can come and still belong to the beat after it
  const UNDO_MAX = 30;
  const LEAD = 0.1;         // seconds before the first note in a song file
  const TAIL = 2.5;         // seconds after the last note in a song file (release and room)

  const el = id => document.getElementById(id);
  const dock = el('recorder');
  const toggleBtn = el('recorder-btn');
  const tracksEl = el('rec-tracks');
  const playBtn = el('rec-play');
  const recordBtn = el('rec-record');
  const homeBtn = el('rec-home');
  const posEl = el('rec-pos');
  const tempoInput = el('rec-tempo');
  const meterSelect = el('rec-meter');
  const countInBtn = el('rec-countin');
  const clickSelect = el('rec-click');
  const undoBtn = el('rec-undo');
  const timingBtn = el('rec-timing');

  let P = null;              // the project: what is saved
  const R = { open: false, armed: 0, state: 'idle', pos: 0 }; // state: idle | priming | playing | recording
  let run = null;            // the play or take under way
  let runToken = 0;
  let view = { start: 0, end: 32 }; // beats shown across the lanes
  const lanes = [];          // { wrap, canvas, head } — [0] is the ruler, then one per track
  const ctls = [];
  let undo = [];
  let saveTimer = null;
  let saveWarned = false;

  // -------- PROJECT --------
  function blankTracks() {
    return Array.from({ length: TRACKS }, () => ({ sound: currentSound, volume: 1, muted: false, notes: [] }));
  }
  function blankProject() {
    return { name: '', tempo: 90, meter: '4/4', countIn: true, click: 'record', tracks: blankTracks() };
  }
  const byBeat = (a, b) => a.b - b.b;

  // Anything missing or unknown falls back to the default, so every file opens.
  function normalizeProject(src) {
    const p = blankProject();
    if (!src || typeof src !== 'object') return p;
    if (typeof src.name === 'string') p.name = src.name.slice(0, 60);
    const tempo = Math.round(Number(src.tempo));
    if (tempo >= TEMPO_MIN && tempo <= TEMPO_MAX) p.tempo = tempo;
    if (METERS[src.meter]) p.meter = src.meter;
    if (typeof src.countIn === 'boolean') p.countIn = src.countIn;
    if (CLICKS.includes(src.click)) p.click = src.click;
    if (Array.isArray(src.tracks)) src.tracks.slice(0, TRACKS).forEach((tr, i) => {
      if (!tr || typeof tr !== 'object') return;
      const d = p.tracks[i];
      if (Audio.PRESETS[tr.sound]) d.sound = tr.sound;
      const v = Number(tr.volume);
      if (tr.volume != null && v >= 0 && v <= 1) d.volume = v;
      d.muted = tr.muted === true;
      if (Array.isArray(tr.notes)) {
        d.notes = tr.notes
          .filter(n => n && Number.isFinite(n.m) && Number.isFinite(n.b) && Number.isFinite(n.d) && n.m >= 12 && n.m <= 120 && n.d > 0)
          .map(n => ({ m: Math.round(n.m), b: n.b, d: n.d }))
          .sort(byBeat);
      }
    });
    return p;
  }

  // Beats to four places: a sixteenth of a millisecond at any tempo here.
  function compact(p) {
    const r = x => Math.round(x * 10000) / 10000;
    return { ...p, tracks: p.tracks.map(tr => ({ ...tr, notes: tr.notes.map(n => ({ m: n.m, b: r(n.b), d: r(n.d) })) })) };
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 250);
  }
  function saveNow() {
    clearTimeout(saveTimer);
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(compact(P)));
    } catch (e) {
      if (!saveWarned) { saveWarned = true; toast('This browser would not keep the recording. Save a project file to keep it.'); }
    }
  }
  function load() {
    let src = null;
    try { src = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) {}
    P = normalizeProject(src);
  }

  const barBeats = () => METERS[P.meter];
  const hasNotes = () => P.tracks.some(tr => tr.notes.length);
  function firstBeat() {
    let lo = Infinity;
    P.tracks.forEach(tr => { if (tr.notes.length && tr.notes[0].b < lo) lo = tr.notes[0].b; });
    return lo;
  }
  // The beginning: bar 1, or the bar before it when there is a pick-up — but a
  // note only a hair before a bar line was meant for the bar after it.
  function songStart() {
    return Math.min(0, Math.floor((firstBeat() + EARLY) / barBeats()) * barBeats());
  }
  function songEnd() {
    let hi = 0;
    P.tracks.forEach(tr => tr.notes.forEach(n => { if (n.b + n.d > hi) hi = n.b + n.d; }));
    return hi;
  }

  // -------- UNDO --------
  function pushUndo(label) {
    undo.push({ label, json: JSON.stringify(P) });
    if (undo.length > UNDO_MAX) undo.shift();
  }
  function doUndo() {
    if (busy()) return;
    const u = undo.pop();
    if (!u) return;
    P = normalizeProject(JSON.parse(u.json));
    afterProjectChange();
    toast('Undone: ' + u.label);
  }
  function afterProjectChange() {
    if (R.armed >= TRACKS) R.armed = 0;
    R.pos = songStart();
    adoptSound();
    applyLevels();
    renderAll();
    save();
  }

  // -------- SOUND AND TIME --------
  const midiFreq = m => 440 * Math.pow(2, (m - 69) / 12);
  const midiOfName = name => midiOf(name.slice(0, -1), parseInt(name.slice(-1), 10));
  const busy = () => R.state !== 'idle';

  // The armed track and the keyboard share one sound. Arming a track that has
  // notes brings its sound to the keyboard; an empty track takes the keyboard's.
  function adoptSound() {
    const tr = P.tracks[R.armed];
    if (tr.notes.length && tr.sound !== currentSound) {
      currentSound = tr.sound;
      renderChrome();
    } else if (!tr.notes.length) {
      tr.sound = currentSound;
    }
  }
  // renderChrome calls this: a sound picked on the keyboard is the armed track's.
  function syncSound() {
    if (!R.open || !P) return;
    const tr = P.tracks[R.armed];
    if (tr.sound === currentSound) return;
    tr.sound = currentSound;
    renderCtl(R.armed);
    save();
  }

  function trackLevel(tr) { return tr.muted ? 0 : BASE_LEVEL * volume * tr.volume; }
  function applyLevels() {
    if (!audioWoken) return; // set when the sound starts (startRun)
    P.tracks.forEach((tr, i) => Audio.setLevel('rec' + (i + 1), trackLevel(tr)));
  }

  // When an input event happened, by its own timestamp: the capture listeners
  // note every key and touch before script.js plays it.
  let lastStamp = 0;
  ['keydown', 'keyup', 'pointerdown', 'pointerup', 'pointercancel', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchend', 'touchmove']
    .forEach(type => window.addEventListener(type, e => { lastStamp = e.timeStamp; }, { capture: true, passive: true }));
  function inputStamp() {
    const now = performance.now();
    return lastStamp > 0 && lastStamp <= now && now - lastStamp < 250 ? lastStamp : now;
  }
  // That moment on the audio clock (the clock notes are scheduled on).
  function clockOf(stamp) {
    const ctx = Audio.ensure();
    return ctx.currentTime - Math.max(0, performance.now() - stamp) / 1000;
  }

  // The recording delay, in ms: measured by the tap-along test, or set by hand;
  // until then the browser's own figure for its output.
  function storedDelay() {
    try {
      const d = JSON.parse(localStorage.getItem(DELAY_KEY));
      if (d && Number.isFinite(d.ms)) return d;
    } catch (e) {}
    return null;
  }
  function guessMs() {
    if (!audioWoken) return 0;
    const ctx = Audio.ensure();
    return Math.round((ctx.outputLatency || ctx.baseLatency || 0) * 1000);
  }
  function delayMs() {
    const d = storedDelay();
    return d ? d.ms : guessMs();
  }
  function setDelay(ms, how) {
    try {
      if (how) localStorage.setItem(DELAY_KEY, JSON.stringify({ ms, how }));
      else localStorage.removeItem(DELAY_KEY);
    } catch (e) {}
    renderTiming();
  }

  // The metronome: a short click straight to the speakers, never in a song file.
  function clickAt(ctx, t, accent) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = accent ? 1760 : 1175;
    const peak = Math.max(0.0002, 0.5 * volume * (accent ? 1 : 0.65));
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.09);
    o.onended = () => { try { o.disconnect(); g.disconnect(); } catch (e) {} };
    return o;
  }
  const isDownbeat = b => ((b % barBeats()) + barBeats()) % barBeats() === 0;

  // -------- PLAYBACK LIGHTS --------
  // A note played back lights its key, or the same note an octave or more
  // away when its own key is not on screen.
  const lit = new Map();        // key name -> how many notes hold it lit
  const lightTimers = new Set();
  function shownKey(m) {
    if (keysView) return null;
    const shown = new Set(whiteKeysPhysical.concat(blackKeysPhysical));
    for (let k = 0; k <= 8; k++) {
      if (shown.has(midiName(m - 12 * k))) return midiName(m - 12 * k);
      if (shown.has(midiName(m + 12 * k))) return midiName(m + 12 * k);
    }
    return null;
  }
  function light(name, on) {
    const n = (lit.get(name) || 0) + (on ? 1 : -1);
    if (n > 0) { lit.set(name, n); if (on && n === 1) pressVisual(name, true); return; }
    lit.delete(name);
    if (!active.has(name)) pressVisual(name, false);
  }
  function lightLater(ctx, m, t, hold) {
    const name = shownKey(m);
    if (!name) return;
    const on = EVMCountIn.heardAt(ctx, t) - performance.now();
    const later = (ms, fn) => { const id = setTimeout(() => { lightTimers.delete(id); fn(); }, Math.max(0, ms)); lightTimers.add(id); };
    later(on, () => light(name, true));
    later(on + hold * 1000, () => light(name, false));
  }
  function clearLights() {
    lightTimers.forEach(clearTimeout);
    lightTimers.clear();
    lit.forEach((n, name) => { if (!active.has(name)) pressVisual(name, false); });
    lit.clear();
  }

  // -------- PLAY AND RECORD --------
  async function startRun(recording) {
    const token = ++runToken;
    wakeAudio();
    const ctx = Audio.ensure();
    applyLevels();
    let from = R.pos;
    if (!recording) {
      if (!hasNotes()) { toast('Nothing recorded yet. Press ● to record a line.'); return; }
      if (from >= songEnd()) from = songStart(); // at the end: play from the top
    } else {
      const tr = P.tracks[R.armed];
      tr.sound = currentSound;
      if (tr.muted) { tr.muted = false; applyLevels(); }
    }
    const count = recording && P.countIn ? EVMCountIn.beats(barBeats()) : 0;
    R.state = 'priming';
    R.priming = recording ? 'recording' : 'playing';
    renderTransport();
    if (count) EVMCountIn.open(count, barBeats());
    const ok = await EVMCountIn.prime(ctx, { warm: count ? 0.35 : 0.12 });
    if (token !== runToken) return;
    if (!ok) {
      EVMCountIn.close();
      R.state = 'idle';
      renderTransport();
      toast('The sound did not start. Tap a key, then try again.');
      return;
    }
    const spb = 60 / P.tempo;
    const anchor = ctx.currentTime + 0.1 + count * spb; // when beat `from` sounds
    run = {
      ctx, from, spb, anchor, count, recording,
      delay: delayMs() / 1000, // read once: the browser's own figure wanders a little
      armed: R.armed,
      end: songEnd(),
      // (a note played a hair early for where this starts is still played)
      next: P.tracks.map(tr => { const k = tr.notes.findIndex(n => n.b >= from - count - EARLY); return k < 0 ? tr.notes.length : k; }),
      nextClick: Math.ceil(from - count - 1e-9),
      ids: [], clicks: [], take: [], held: new Map(),
      timer: 0, raf: 0, drawn: 0
    };
    if (count) {
      const times = [];
      for (let k = count; k > 0; k--) times.push(EVMCountIn.heardAt(ctx, anchor - k * spb));
      EVMCountIn.run(times, EVMCountIn.heardAt(ctx, anchor));
    }
    R.state = recording ? 'recording' : 'playing';
    pump();
    run.timer = setInterval(pump, PUMP_MS);
    run.raf = requestAnimationFrame(frame);
    renderTransport();
    renderCtls();
  }

  // Hand the engine every note and click due in the next moment. A hidden page's
  // timers run only once a second, so it looks further ahead then. The end of a
  // playback is caught here too: drawing (frame) stops while the page is hidden.
  function pump() {
    if (!run) return;
    const ctx = run.ctx;
    if (!run.recording && heardBeat(run) > run.end + 0.05) { finishPlayback(); return; }
    const ahead = document.hidden ? HIDDEN_LOOKAHEAD : LOOKAHEAD;
    const until = run.from + (ctx.currentTime + ahead - run.anchor) / run.spb;
    P.tracks.forEach((tr, i) => {
      let k = run.next[i];
      while (k < tr.notes.length && tr.notes[k].b < until) {
        const n = tr.notes[k++];
        // a muted track, and the one being recorded over, keep their place but stay quiet
        if (tr.muted || (run.recording && i === run.armed)) continue;
        const t = run.anchor + (n.b - run.from) * run.spb;
        const hold = n.d * run.spb;
        if (t + hold < ctx.currentTime) continue; // long gone (a tab that slept)
        run.ids.push(Audio.schedule('rec' + (i + 1), [midiFreq(n.m)], tr.sound, t, hold, 1));
        lightLater(ctx, n.m, t, hold);
      }
      run.next[i] = k;
    });
    const clickOn = P.click === 'always' || (P.click === 'record' && run.recording);
    while (run.nextClick < until) {
      const b = run.nextClick++;
      const counting = b < run.from;
      if (counting ? run.count > 0 : clickOn) {
        run.clicks.push(clickAt(ctx, run.anchor + (b - run.from) * run.spb, isDownbeat(b)));
      }
    }
  }

  // The beat being heard now (the speakers are a little behind the clock).
  function heardBeat(r) {
    const latency = r.ctx.outputLatency || r.ctx.baseLatency || 0;
    return r.from + (r.ctx.currentTime - latency - r.anchor) / r.spb;
  }

  function frame(now) {
    if (!run) return;
    const beat = heardBeat(run);
    if (!run.recording && beat > run.end + 0.05) { finishPlayback(); return; }
    if (beat > view.end - barBeats() / 2) { view.end += 4 * barBeats(); drawAll(); }
    setHeads(beat);
    posEl.textContent = beat < run.from && run.count ? 'Count-in' : posText(beat);
    if (run.recording && now - run.drawn > 80) { run.drawn = now; drawLane(run.armed); }
    run.raf = requestAnimationFrame(frame);
  }

  // A playback that reached the end: the last notes ring on.
  function finishPlayback() {
    const r = run;
    run = null;
    clearInterval(r.timer);
    cancelAnimationFrame(r.raf);
    R.state = 'idle';
    R.pos = r.from <= 0 ? songStart() : r.from;
    renderAll();
  }

  function stopRun() {
    runToken++; // a start still waking the sound will not go on
    EVMCountIn.close();
    const r = run;
    run = null;
    if (r) {
      clearInterval(r.timer);
      cancelAnimationFrame(r.raf);
      if (r.recording) keepTake(r);
      r.ids.forEach(id => Audio.stop(id));
      r.clicks.forEach(o => { try { o.stop(); } catch (e) {} });
      clearLights();
      R.pos = r.from <= 0 ? songStart() : r.from;
    }
    R.state = 'idle';
    renderAll();
  }

  // Where a key went down or up, in beats, moved earlier by the recording delay.
  function beatNow(r) {
    const t = clockOf(inputStamp()) - r.delay;
    return r.from + (t - r.anchor) / r.spb;
  }

  function noteOn(name) {
    if (!run || !run.recording) return;
    const b = beatNow(run);
    if (b < run.from - run.count - 0.25) return; // before the count began
    if (run.held.has(name)) noteOff(name);
    run.held.set(name, { m: midiOfName(name), b });
  }
  function noteOff(name) {
    if (!run || !run.recording) return;
    const h = run.held.get(name);
    if (!h) return;
    run.held.delete(name);
    run.take.push({ m: h.m, b: h.b, d: Math.max(MIN_HOLD, beatNow(run) - h.b) });
  }

  // Tape rules: the take replaces what the track had from where it began to
  // where it stopped. A take with no notes changes nothing.
  function keepTake(r) {
    const stop = beatNow(r);
    r.held.forEach(h => r.take.push({ m: h.m, b: h.b, d: Math.max(MIN_HOLD, stop - h.b) }));
    r.held.clear();
    if (!r.take.length) return;
    const tr = P.tracks[r.armed];
    pushUndo('the take on track ' + (r.armed + 1));
    const lo = Math.min(r.from, ...r.take.map(n => n.b));
    const hi = Math.max(stop, ...r.take.map(n => n.b + n.d));
    tr.notes = tr.notes.filter(n => n.b < lo || n.b >= hi).concat(r.take).sort(byBeat);
    save();
    const others = P.tracks.filter((t, i) => i !== r.armed && t.notes.length).length;
    if (!storedDelay() && !sessionStorageGet('tip')) {
      sessionStorageSet('tip');
      setTimeout(() => toast('Tip: “Calibrate” lines up your timing for these speakers or headphones.'), 600);
    } else if (!others) {
      const next = P.tracks.findIndex(t => !t.notes.length);
      if (next >= 0) setTimeout(() => toast(`Recorded. Choose track ${next + 1} to play a line over it.`), 600);
    }
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem('vk_rec_' + k); } catch (e) { return null; } }
  function sessionStorageSet(k) { try { sessionStorage.setItem('vk_rec_' + k, '1'); } catch (e) {} }

  function togglePlay() { if (busy()) stopRun(); else startRun(false); }
  function toggleRecord() { if (busy()) stopRun(); else startRun(true); }

  // -------- TRACKS ON SCREEN --------
  function posText(beat) {
    const bpb = barBeats();
    const bar = Math.floor(beat / bpb + 1e-6);
    const inBar = Math.floor(beat - bar * bpb + 1e-6) + 1;
    return bar < 0 ? `Pick-up · ${inBar}` : `Bar ${bar + 1} · ${inBar}`;
  }

  // What the lanes show: the whole song, at least eight bars, and a bar to spare.
  function fitView() {
    const bpb = barBeats();
    const start = songStart();
    view = { start, end: Math.max(Math.ceil(songEnd() / bpb) * bpb + bpb, start + 8 * bpb, R.pos + bpb) };
  }
  const pxPerBeat = w => w / (view.end - view.start);

  const ICONS = {
    mute: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>',
    muted: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>',
    clear: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 12.5h9l1-12.5"/></svg>'
  };

  function makeLane(cls) {
    const wrap = document.createElement('div');
    wrap.className = 'rec-lane ' + cls;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    const head = document.createElement('div');
    head.className = 'rec-head';
    wrap.append(canvas, head);
    // a click moves the start to the nearest bar line
    wrap.addEventListener('pointerdown', (e) => {
      if (busy() || e.button > 0) return;
      const rect = wrap.getBoundingClientRect();
      const bpb = barBeats();
      const beat = view.start + (e.clientX - rect.left) / pxPerBeat(rect.width);
      R.pos = Math.min(Math.max(Math.round(beat / bpb) * bpb, songStart()), view.end - bpb);
      renderPos();
    });
    return { wrap, canvas, head };
  }

  function buildTracks() {
    tracksEl.innerHTML = '';
    const rulerRow = document.createElement('div');
    rulerRow.className = 'rec-row rec-ruler-row';
    const spacer = document.createElement('div');
    spacer.className = 'rec-ctl rec-ctl-spacer';
    const ruler = makeLane('rec-ruler');
    rulerRow.append(spacer, ruler.wrap);
    tracksEl.appendChild(rulerRow);
    lanes.length = 0;
    lanes.push(ruler);
    ctls.length = 0;

    for (let i = 0; i < TRACKS; i++) {
      const row = document.createElement('div');
      row.className = 'rec-row rec-track';
      row.style.setProperty('--tc', TRACK_COLORS[i]);
      const ctl = document.createElement('div');
      ctl.className = 'rec-ctl';

      const arm = document.createElement('button');
      arm.type = 'button';
      arm.className = 'rec-arm';
      arm.innerHTML = `<span class="rec-arm-dot"></span><span class="rec-arm-num">${i + 1}</span>`;
      arm.setAttribute('aria-label', `Record onto track ${i + 1}`);
      arm.title = 'Record onto this track';
      arm.addEventListener('click', () => { if (busy()) return; R.armed = i; adoptSound(); renderCtls(); drawAll(); });

      const sound = document.createElement('select');
      sound.className = 'select rec-sound';
      sound.innerHTML = soundSelect.innerHTML; // the keyboard's own list, groups and all
      sound.setAttribute('aria-label', `Track ${i + 1} sound`);
      sound.addEventListener('change', () => {
        P.tracks[i].sound = sound.value;
        if (i === R.armed) { currentSound = sound.value; renderChrome(); }
        sound.blur(); // hand the computer keyboard back to the piano
        save();
      });

      const mute = document.createElement('button');
      mute.type = 'button';
      mute.className = 'rec-icon-btn rec-mute';
      mute.addEventListener('click', () => {
        P.tracks[i].muted = !P.tracks[i].muted;
        applyLevels();
        renderCtl(i);
        drawLane(i);
        save();
      });

      const vol = document.createElement('input');
      vol.type = 'range';
      vol.className = 'rec-vol';
      vol.min = 0; vol.max = 100; vol.step = 1;
      vol.setAttribute('aria-label', `Track ${i + 1} volume`);
      vol.addEventListener('input', () => { P.tracks[i].volume = vol.value / 100; applyLevels(); save(); });

      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'rec-icon-btn rec-clear';
      clear.innerHTML = ICONS.clear;
      clear.setAttribute('aria-label', `Clear track ${i + 1}`);
      clear.title = 'Clear this track (Undo brings it back)';
      clear.addEventListener('click', () => {
        if (busy() || !P.tracks[i].notes.length) return;
        pushUndo('clearing track ' + (i + 1));
        P.tracks[i].notes = [];
        afterProjectChange();
        toast(`Track ${i + 1} cleared. Undo brings it back.`);
      });

      ctl.append(arm, sound, mute, vol, clear);
      const lane = makeLane('rec-track-lane');
      row.append(ctl, lane.wrap);
      tracksEl.appendChild(row);
      lanes.push(lane);
      ctls.push({ row, arm, sound, mute, vol, clear });
    }
  }

  function renderCtl(i) {
    const c = ctls[i], tr = P.tracks[i];
    const armed = i === R.armed;
    c.row.classList.toggle('armed', armed);
    c.row.classList.toggle('taking', armed && R.state === 'recording');
    c.row.classList.toggle('muted', tr.muted);
    c.arm.setAttribute('aria-pressed', String(armed));
    c.sound.value = tr.sound;
    c.mute.innerHTML = tr.muted ? ICONS.muted : ICONS.mute;
    c.mute.setAttribute('aria-pressed', String(tr.muted));
    c.mute.setAttribute('aria-label', `${tr.muted ? 'Unmute' : 'Mute'} track ${i + 1}`);
    c.mute.title = tr.muted ? 'Muted: not heard, and left out of song files' : 'Mute';
    c.vol.value = Math.round(tr.volume * 100);
    c.clear.disabled = !tr.notes.length || busy();
    c.arm.disabled = busy() && !armed;
  }
  function renderCtls() { for (let i = 0; i < TRACKS; i++) renderCtl(i); }

  function sizeLanes() {
    const dpr = window.devicePixelRatio || 1;
    lanes.forEach(l => {
      const w = l.wrap.clientWidth, h = l.wrap.clientHeight;
      if (!w || !h) return;
      l.canvas.width = Math.round(w * dpr);
      l.canvas.height = Math.round(h * dpr);
      l.w = w; l.h = h; l.dpr = dpr;
    });
  }

  function cssVar(name) { return getComputedStyle(dock).getPropertyValue(name).trim(); }

  function drawRuler() {
    const l = lanes[0];
    if (!l.w) return;
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    const ppb = pxPerBeat(l.w), bpb = barBeats();
    const every = [1, 2, 4, 8, 16, 32].find(n => n * bpb * ppb >= 26) || 64;
    g.font = '800 11px Nunito, system-ui, sans-serif';
    g.textBaseline = 'middle';
    for (let b = Math.ceil(view.start / bpb) * bpb; b < view.end; b += bpb) {
      const bar = b / bpb + 1;
      const x = (b - view.start) * ppb;
      g.fillStyle = cssVar('--line-strong');
      g.fillRect(Math.round(x), l.h - 7, 1, 7);
      if (bar >= 1 && (bar - 1) % every === 0) {
        g.fillStyle = cssVar('--text-3');
        g.fillText(String(bar), x + 4, l.h / 2 - 1);
      }
    }
  }

  function drawLane(i) {
    const l = lanes[i + 1];
    if (!l || !l.w) return;
    const tr = P.tracks[i];
    const g = l.canvas.getContext('2d');
    g.setTransform(l.dpr, 0, 0, l.dpr, 0, 0);
    g.clearRect(0, 0, l.w, l.h);
    const ppb = pxPerBeat(l.w), bpb = barBeats();

    // bar lines, and beats when there is room for them
    g.fillStyle = cssVar('--line');
    for (let b = Math.ceil(view.start); b < view.end; b++) {
      const bar = isDownbeat(b);
      if (!bar && ppb < 9) continue;
      g.globalAlpha = bar ? 1 : 0.45;
      g.fillRect(Math.round((b - view.start) * ppb), 0, 1, l.h);
    }
    g.globalAlpha = 1;
    if (view.start < 0) { // the pick-up bar, shaded
      g.fillStyle = cssVar('--line');
      g.fillRect(0, 0, (0 - view.start) * ppb, l.h);
    }

    const taking = run && run.recording && run.armed === i;
    let notes = tr.notes;
    let fresh = [];
    if (taking) {
      const now = heardBeat(run);
      fresh = run.take.concat([...run.held.values()].map(h => ({ m: h.m, b: h.b, d: Math.max(MIN_HOLD, now - h.b) })));
    }
    const all = notes.concat(fresh);
    if (!all.length) {
      g.fillStyle = cssVar('--text-3');
      g.font = '700 12px Nunito, system-ui, sans-serif';
      g.textBaseline = 'middle';
      g.fillText(i === R.armed ? 'Empty: press ● to record here' : 'Empty', 10, l.h / 2);
      return;
    }
    let lo = Infinity, hi = -Infinity;
    all.forEach(n => { if (n.m < lo) lo = n.m; if (n.m > hi) hi = n.m; });
    if (hi - lo < 12) { const mid = (lo + hi) / 2; lo = mid - 6; hi = mid + 6; }
    const pad = 4, span = hi - lo;
    const nh = Math.max(3, Math.min(7, (l.h - 2 * pad) / (span + 1)));
    const y = m => pad + (hi - m) / span * (l.h - 2 * pad - nh);
    const paint = (n, alpha) => {
      g.globalAlpha = alpha;
      g.fillStyle = noteColor(n.m % 12);
      const x = (n.b - view.start) * ppb;
      g.fillRect(x, y(n.m), Math.max(2, n.d * ppb - 1), nh);
    };
    const base = tr.muted ? 0.3 : 1;
    // while a take goes on, what it will replace is shown faint
    notes.forEach(n => paint(n, taking && n.b >= run.from - run.count ? 0.25 : base));
    fresh.forEach(n => paint(n, 1));
    g.globalAlpha = 1;
  }

  function drawAll() {
    drawRuler();
    for (let i = 0; i < TRACKS; i++) drawLane(i);
    setHeads(run ? heardBeat(run) : R.pos);
  }

  function setHeads(beat) {
    lanes.forEach(l => {
      if (!l.w) return;
      const x = (beat - view.start) * pxPerBeat(l.w);
      l.head.style.transform = `translateX(${x}px)`;
      l.head.style.visibility = x < 0 || x > l.w ? 'hidden' : '';
    });
  }

  function renderPos() {
    if (!run) { posEl.textContent = posText(R.pos); setHeads(R.pos); }
  }

  // -------- CONTROLS --------
  function renderTransport() {
    const playing = R.state === 'playing' || (R.state === 'priming' && R.priming === 'playing');
    const recording = R.state === 'recording' || (R.state === 'priming' && R.priming === 'recording');
    playBtn.classList.toggle('on', busy());
    playBtn.innerHTML = busy()
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="6.5" width="11" height="11" rx="1.5"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
    playBtn.setAttribute('aria-label', busy() ? 'Stop' : 'Play');
    playBtn.title = busy() ? 'Stop (Space)' : 'Play (Space)';
    recordBtn.classList.toggle('on', recording);
    recordBtn.setAttribute('aria-pressed', String(recording));
    recordBtn.setAttribute('aria-label', recording ? 'Stop recording' : `Record onto track ${R.armed + 1}`);
    recordBtn.title = recording ? 'Stop recording' : `Record onto track ${R.armed + 1}`;
    dock.classList.toggle('is-recording', recording);
    dock.classList.toggle('is-playing', playing);
    homeBtn.disabled = busy();
    [tempoInput, meterSelect, countInBtn, el('rec-tempo-down'), el('rec-tempo-up')].forEach(c => { c.disabled = busy(); });
    undoBtn.disabled = busy() || !undo.length;
    undoBtn.title = undo.length ? 'Undo ' + undo[undo.length - 1].label : 'Nothing to undo';
  }

  function renderSettings() {
    tempoInput.value = P.tempo;
    meterSelect.value = P.meter;
    countInBtn.setAttribute('aria-pressed', String(P.countIn));
    clickSelect.value = P.click;
  }

  function renderTiming() {
    const d = storedDelay();
    const ms = delayMs();
    const text = d ? `${ms >= 0 ? '' : '−'}${Math.abs(ms)} ms` : 'not measured';
    timingBtn.innerHTML = `Timing: ${text} · <u>Calibrate</u>`;
    timingBtn.title = 'Headphones or speakers changed? Calibrate again.';
    const s = el('set-delay');
    if (s) s.textContent = d ? `Recordings are moved ${Math.abs(ms)} ms ${ms >= 0 ? 'earlier' : 'later'} (${d.how === 'test' ? 'measured' : 'set by hand'}).` : 'Not measured on this device yet.';
    renderCal();
  }

  function renderAll() {
    if (!P) return;
    fitView();
    renderSettings();
    renderCtls();
    renderTransport();
    renderTiming();
    sizeLanes();
    drawAll();
    renderPos();
  }

  function setOpen(open) {
    if (!open && busy()) stopRun();
    R.open = open;
    dock.hidden = !open;
    toggleBtn.setAttribute('aria-pressed', String(open));
    try { localStorage.setItem(OPEN_KEY, open ? '1' : '0'); } catch (e) {}
    if (open) {
      // the first empty track is ready to record onto
      const empty = P.tracks.findIndex(tr => !tr.notes.length);
      R.armed = empty >= 0 ? empty : 0;
      if (R.pos <= 0) R.pos = songStart(); // the beginning, pick-up and all
      adoptSound();
      renderAll();
    }
  }

  toggleBtn.addEventListener('click', () => setOpen(!R.open));
  playBtn.addEventListener('click', togglePlay);
  recordBtn.addEventListener('click', toggleRecord);
  homeBtn.addEventListener('click', () => { if (!busy()) { R.pos = songStart(); renderPos(); } });
  undoBtn.addEventListener('click', doUndo);

  function setTempo(v) {
    v = Math.round(Number(v));
    if (!Number.isFinite(v)) v = P.tempo;
    P.tempo = Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, v));
    tempoInput.value = P.tempo;
    save();
  }
  tempoInput.addEventListener('change', () => { setTempo(tempoInput.value); tempoInput.blur(); });
  tempoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tempoInput.blur(); });
  el('rec-tempo-down').addEventListener('click', () => setTempo(P.tempo - 1));
  el('rec-tempo-up').addEventListener('click', () => setTempo(P.tempo + 1));
  meterSelect.addEventListener('change', () => { P.meter = meterSelect.value; meterSelect.blur(); R.pos = songStart(); renderAll(); save(); });
  countInBtn.addEventListener('click', () => { P.countIn = !P.countIn; renderSettings(); save(); });
  clickSelect.addEventListener('change', () => { P.click = clickSelect.value; clickSelect.blur(); save(); });
  volumeRange.addEventListener('input', applyLevels); // the main volume sets every track's level too

  // Space plays and stops; Escape stops.
  document.addEventListener('keydown', (e) => {
    if (!R.open || document.querySelector('.sheet-backdrop.open')) return;
    const t = e.target;
    if (t && t.closest && t.closest('input, textarea, select, [contenteditable]')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) togglePlay();
    } else if (e.key === 'Escape' && busy()) {
      stopRun();
    }
  });
  // a focused button would click on Space as well
  document.addEventListener('keyup', (e) => { if (e.code === 'Space' && R.open && e.target && e.target.tagName === 'BUTTON') e.preventDefault(); });

  new ResizeObserver(() => { if (R.open) { sizeLanes(); drawAll(); } }).observe(tracksEl);
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (R.open) drawAll(); });
  document.querySelectorAll('input[name="theme"]').forEach(r => r.addEventListener('change', () => { if (R.open) drawAll(); }));

  // -------- SAVE: SONG FILES AND PROJECT FILES --------
  const saveSheet = el('rec-save-sheet');
  const saveStatus = el('rec-save-status');
  const nameInput = el('rec-name');
  let exporting = false;

  el('rec-save').addEventListener('click', () => {
    if (busy()) stopRun();
    nameInput.value = P.name;
    saveStatus.textContent = '';
    openSheet('rec-save-sheet');
  });
  nameInput.addEventListener('input', () => { P.name = nameInput.value.slice(0, 60); save(); });

  function fileBase() {
    const name = (P.name || 'Keyboard recording').trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, ' ');
    return name || 'Keyboard recording';
  }
  function download(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const pause = () => new Promise(resolve => setTimeout(resolve, 0));

  // The tracks that are heard, from the first note (a breath before it) to the
  // last note and its ring.
  function songForFile() {
    const tracks = P.tracks.filter(tr => !tr.muted && tr.notes.length);
    if (!tracks.length) return null;
    const spb = 60 / P.tempo;
    let lo = Infinity, hi = -Infinity;
    tracks.forEach(tr => tr.notes.forEach(n => { lo = Math.min(lo, n.b); hi = Math.max(hi, n.b + n.d); }));
    return {
      seconds: LEAD + (hi - lo) * spb + TAIL,
      room,
      parts: tracks.map(tr => ({
        level: BASE_LEVEL * tr.volume,
        notes: tr.notes.map(n => ({ freqs: [midiFreq(n.m)], preset: tr.sound, at: LEAD + (n.b - lo) * spb, hold: n.d * spb }))
      }))
    };
  }

  const toS16 = x => (x < -1 ? -32768 : x > 1 ? 32767 : Math.round(x < 0 ? x * 32768 : x * 32767));

  async function encodeMp3(buffer, progress) {
    const enc = new lamejs.Mp3Encoder(2, buffer.sampleRate, 192);
    const L = buffer.getChannelData(0), Rt = buffer.getChannelData(1);
    const BLOCK = 1152, l16 = new Int16Array(BLOCK), r16 = new Int16Array(BLOCK);
    const out = [];
    let rested = performance.now();
    for (let i = 0; i < L.length; i += BLOCK) {
      const n = Math.min(BLOCK, L.length - i);
      for (let k = 0; k < n; k++) { l16[k] = toS16(L[i + k]); r16[k] = toS16(Rt[i + k]); }
      const chunk = n === BLOCK ? enc.encodeBuffer(l16, r16) : enc.encodeBuffer(l16.subarray(0, n), r16.subarray(0, n));
      if (chunk.length) out.push(chunk);
      if (performance.now() - rested > 40) { progress(i / L.length); await pause(); rested = performance.now(); }
    }
    const end = enc.flush();
    if (end.length) out.push(end);
    return new Blob(out, { type: 'audio/mpeg' });
  }

  function encodeWav(buffer) {
    const L = buffer.getChannelData(0), Rt = buffer.getChannelData(1);
    const len = buffer.length, rate = buffer.sampleRate;
    const view = new DataView(new ArrayBuffer(44 + len * 4));
    const text = (at, s) => { for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i)); };
    text(0, 'RIFF'); view.setUint32(4, 36 + len * 4, true); text(8, 'WAVE');
    text(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 2, true);
    view.setUint32(24, rate, true); view.setUint32(28, rate * 4, true); view.setUint16(32, 4, true); view.setUint16(34, 16, true);
    text(36, 'data'); view.setUint32(40, len * 4, true);
    for (let i = 0, at = 44; i < len; i++, at += 4) {
      view.setInt16(at, toS16(L[i]), true);
      view.setInt16(at + 2, toS16(Rt[i]), true);
    }
    return new Blob([view], { type: 'audio/wav' });
  }

  async function exportSong(kind) {
    if (exporting) return;
    const song = songForFile();
    if (!song) { saveStatus.textContent = 'Nothing to save yet. Record a line first (muted tracks are left out).'; return; }
    if (kind === 'mp3' && typeof lamejs === 'undefined') { saveStatus.textContent = 'The MP3 maker did not load. Try WAV, or reload the page.'; return; }
    exporting = true;
    document.querySelectorAll('#rec-mp3, #rec-wav').forEach(b => { b.disabled = true; });
    try {
      saveStatus.textContent = 'Mixing the tracks…';
      await pause();
      const buffer = await Audio.render(song);
      const blob = kind === 'mp3'
        ? await encodeMp3(buffer, p => { saveStatus.textContent = `Making the MP3… ${Math.round(p * 100)}%`; })
        : encodeWav(buffer);
      const filename = `${fileBase()}.${kind}`;
      download(blob, filename);
      const secs = Math.round(buffer.duration);
      saveStatus.textContent = `Saved ${filename} (${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}, ${(blob.size / 1048576).toFixed(1)} MB).`;
    } catch (e) {
      console.error(e);
      saveStatus.textContent = 'Something went wrong making the file. Please try again.';
    } finally {
      exporting = false;
      document.querySelectorAll('#rec-mp3, #rec-wav').forEach(b => { b.disabled = false; });
    }
  }
  el('rec-mp3').addEventListener('click', () => exportSong('mp3'));
  el('rec-wav').addEventListener('click', () => exportSong('wav'));

  // A project file is an Eagle View Music envelope (EVM Library/README.md §7).
  el('rec-project-dl').addEventListener('click', () => {
    const env = { format: 'evm-item', formatVersion: 1, app: APP_SLUG, kind: 'recording', title: fileBase(), data: compact(P) };
    download(new Blob([JSON.stringify(env, null, 1)], { type: 'application/json' }), `${fileBase()}.json`);
    saveStatus.textContent = `Saved ${fileBase()}.json.`;
  });
  const projectFile = el('rec-project-file');
  el('rec-project-open').addEventListener('click', () => projectFile.click());
  projectFile.addEventListener('change', () => {
    const file = projectFile.files[0];
    projectFile.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let obj = null;
      try { obj = JSON.parse(reader.result); } catch (e) {}
      let data = null;
      if (obj && obj.format === 'evm-item' && obj.app === APP_SLUG && obj.kind === 'recording') data = obj.data;
      else if (obj && Array.isArray(obj.tracks)) data = obj;
      if (!data) { saveStatus.textContent = 'That file is not a Virtual Keyboard recording.'; return; }
      pushUndo('opening ' + file.name);
      P = normalizeProject(data);
      afterProjectChange();
      nameInput.value = P.name;
      saveStatus.textContent = 'Opened ' + file.name + '. Undo brings back what was here.';
    };
    reader.readAsText(file);
  });
  el('rec-new').addEventListener('click', () => {
    if (!hasNotes()) { saveStatus.textContent = 'The tracks are already empty.'; return; }
    pushUndo('starting over');
    P.tracks.forEach(tr => { tr.notes = []; });
    P.name = '';
    nameInput.value = '';
    afterProjectChange();
    closeSheet('rec-save-sheet');
    toast('All four tracks cleared. Undo brings them back.');
  });

  // -------- LINE UP THE TIMING (the tap-along test) --------
  // A steady click: four to listen to, then ten to tap along with. The first
  // two taps are left out while the player settles; the rest are matched to
  // their clicks, and the middle value is the delay — so one rushed or late
  // tap cannot throw it off. Taps that disagree too much are not trusted.
  const CAL = { bpm: 80, listen: 4, taps: 10, skip: 2, need: 5, spread: 0.04 };
  const calSheet = el('cal-sheet');
  const calPad = el('cal-pad');
  const calMsg = el('cal-msg');
  const calDots = el('cal-dots');
  const calRange = el('cal-range');
  const calValue = el('cal-value');
  let cal = null;
  let calToken = 0;
  let calDoneAt = 0;

  function buildCalDots() {
    calDots.innerHTML = '';
    for (let i = 0; i < CAL.listen + CAL.taps; i++) {
      const d = document.createElement('span');
      d.className = 'cal-dot' + (i < CAL.listen ? ' listen' : '');
      calDots.appendChild(d);
    }
  }
  function calDot(i, cls) { const d = calDots.children[i]; if (d) d.classList.add(cls); }

  function renderCal() {
    if (!calSheet) return;
    const ms = delayMs();
    calRange.value = ms;
    calValue.textContent = `${ms > 0 ? '+' : ms < 0 ? '−' : ''}${Math.abs(ms)} ms`;
    if (!cal) { calPad.textContent = calPad.dataset.again ? 'Again' : 'Start'; calPad.classList.remove('running'); }
  }

  async function startCal() {
    stopCal();
    if (busy()) stopRun();
    wakeAudio();
    const ctx = Audio.ensure();
    const token = ++calToken;
    cal = { token, clicks: [], taps: new Map(), timers: [], nodes: [], phase: 'listen' };
    buildCalDots();
    calPad.textContent = 'Listen…';
    calPad.classList.add('running');
    calMsg.textContent = 'Listen to four clicks, then tap along with the rest.';
    const ok = await EVMCountIn.prime(ctx, { warm: 0.35 });
    if (!cal || cal.token !== token) return;
    if (!ok) { stopCal(); calMsg.textContent = 'The sound did not start. Tap a key, then try again.'; return; }
    const spb = 60 / CAL.bpm, n = CAL.listen + CAL.taps;
    const t0 = ctx.currentTime + 0.25;
    for (let i = 0; i < n; i++) {
      const t = t0 + i * spb;
      cal.clicks.push(t);
      cal.nodes.push(clickAt(ctx, t, i % 4 === 0));
      cal.timers.push(setTimeout(() => calBeat(i), Math.max(0, EVMCountIn.heardAt(ctx, t) - performance.now())));
    }
    cal.timers.push(setTimeout(finishCal, Math.max(0, EVMCountIn.heardAt(ctx, t0 + (n - 0.2) * spb) - performance.now())));
  }

  function calBeat(i) {
    if (!cal) return;
    calDot(i, 'lit');
    if (i > 0) calDots.children[i - 1].classList.remove('lit');
    if (i === CAL.listen) { cal.phase = 'tap'; calMsg.textContent = 'Now tap along with each click.'; }
    calPad.textContent = i < CAL.listen ? 'Listen…' : 'Tap!';
    calPad.classList.remove('beat');
    void calPad.offsetWidth; // restart the pulse
    calPad.classList.add('beat');
  }

  // A tap belongs to the click it is nearest — allowing for a late setup, a
  // tap up to three quarters of a beat after a click still counts as that click's.
  function calTap(stamp) {
    if (!cal || !cal.clicks.length) return;
    const spb = 60 / CAL.bpm;
    const t = clockOf(stamp);
    const i = Math.floor((t - cal.clicks[0] + 0.25 * spb) / spb);
    if (i < 0 || i >= cal.clicks.length) return;
    const off = t - cal.clicks[i];
    if (!cal.taps.has(i) || Math.abs(off) < Math.abs(cal.taps.get(i))) cal.taps.set(i, off);
    if (i >= CAL.listen) calDot(i, 'hit');
    calPad.classList.remove('tapped');
    void calPad.offsetWidth;
    calPad.classList.add('tapped');
  }

  function median(xs) {
    const s = xs.slice().sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  function finishCal() {
    if (!cal) return;
    const offs = [...cal.taps].filter(([i]) => i >= CAL.listen + CAL.skip).map(([, off]) => off);
    stopCal();
    calDoneAt = performance.now();
    calPad.dataset.again = '1';
    renderCal();
    if (offs.length < CAL.need) {
      calMsg.textContent = offs.length
        ? `Only ${offs.length} taps landed near the clicks. Try again, tapping right on each click.`
        : 'No taps were heard. Press Start, then tap the pad (or any key) with each click.';
      return;
    }
    const mid = median(offs);
    const spread = median(offs.map(o => Math.abs(o - mid)));
    if (spread > CAL.spread) {
      calMsg.textContent = `The taps were too spread out to measure (about ±${Math.round(spread * 1000)} ms). Try again, tapping right on each click.`;
      return;
    }
    const ms = Math.round(mid * 1000);
    setDelay(ms, 'test');
    calMsg.textContent = ms >= 0
      ? `Your setup is ${ms} ms behind. Recordings will be moved ${ms} ms earlier.`
      : `You tap ${-ms} ms ahead of the click. Recordings will be moved ${-ms} ms later.`;
  }

  function stopCal() {
    if (!cal) return;
    cal.timers.forEach(clearTimeout);
    cal.nodes.forEach(o => { try { o.stop(); } catch (e) {} });
    calDots.querySelectorAll('.lit').forEach(d => d.classList.remove('lit'));
    calPad.classList.remove('beat', 'tapped');
    cal = null;
    renderCal();
  }

  function openCal() {
    if (busy()) stopRun();
    buildCalDots();
    delete calPad.dataset.again;
    calMsg.textContent = 'Listen to four clicks, then tap along with the next ten: on the pad, or with any key.';
    renderCal();
    openSheet('cal-sheet');
  }

  calPad.addEventListener('pointerdown', (e) => {
    if (cal) { e.preventDefault(); calTap(e.timeStamp); }
  });
  // (not the release of the last tap, which can come just after the test ends)
  calPad.addEventListener('click', () => { if (!cal && performance.now() - calDoneAt > 800) startCal(); });
  // While the test runs, any key is a tap and plays nothing.
  window.addEventListener('keydown', (e) => {
    if (!cal || e.key === 'Escape') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (!e.repeat) calTap(e.timeStamp);
  }, true);
  // Closing the sheet ends the test.
  new MutationObserver(() => { if (!calSheet.classList.contains('open')) stopCal(); })
    .observe(calSheet, { attributes: true, attributeFilter: ['class'] });

  calRange.addEventListener('input', () => setDelay(Number(calRange.value), 'hand'));
  el('cal-reset').addEventListener('click', () => {
    setDelay(0, null);
    calMsg.textContent = `Back to the browser's own figure (${guessMs()} ms). Press Start to measure.`;
  });
  timingBtn.addEventListener('click', openCal);
  el('settings-calibrate').addEventListener('click', () => { closeSheet('settings-sheet'); openCal(); });

  // -------- START --------
  load();
  buildTracks();
  renderTiming();
  let wasOpen = false;
  try { wasOpen = localStorage.getItem(OPEN_KEY) === '1'; } catch (e) {}
  setOpen(wasOpen);

  window.Recorder = { noteOn, noteOff, syncSound };
})();

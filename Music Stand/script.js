/* ============================================================
   Music Stand
   ------------------------------------------------------------
   A bridge between Rhythm Poetry 2.0 and Ostinato Builder 2.0:
   a poem on one side, an ostinato on the other, one play button.

   Three ideas carry it:

   1. Each side is the real app, in a frame, in an embedded mode
      (?embed=music-stand). The app draws its own score and makes its own
      sounds, so nothing here can drift from what the app shows.
      The Music Stand talks to each through a small bridge
      (window.MusicStandBridge) — see README.md for the contract.

   2. There is one clock. The Music Stand owns the only AudioContext and
      hands it to both apps, and a single scheduler here sounds
      both sides: events that land together are fired from the
      same timer callback, so they reach the speakers in the same
      audio block. Two apps each running their own loop would
      drift apart; one conductor cannot.

   3. Both sides count the same beat. A beat is a beat — a quarter
      in 4/4, a dotted quarter in 6/8 — so one tempo drives both,
      and the ostinato simply goes round under the poem, starting
      again with each pass of it.

   The frames are guests. The apps swap their storage for an
   in-memory layer when embedded, so nothing the Music Stand does can
   change a library or a setting in either app.
   ============================================================ */

(function () {
  'use strict';

  /* ==================================================================
     THE TWO APPS
     Written as data so a third can be added later without the rest of
     this file knowing it is there — each side is only ever reached
     through its bridge.
     ================================================================== */

  const SIDES = ['poem', 'ost'];

  const APPS = {
    poem: {
      app: 'rhythm-poetry',
      name: 'Rhythm Poetry',
      noun: 'poem',
      url: '../Rhythm Poetry 2.0/index.html'
    },
    ost: {
      app: 'ostinato-builder',
      name: 'Ostinato Builder',
      noun: 'ostinato',
      url: '../Ostinato Builder 2.0/index.html'
    }
  };

  const BPM_MIN = 30, BPM_MAX = 260;
  const SESSION_KEY  = 'music_stand_session_v1';
  const PAIRINGS_KEY = 'music_stand_pairings_v1';

  /* This app was the Poetry Ostinato Player ("the POP") and kept its work
     under pop_*. Carry that over once; the old keys are left in place so
     nothing is destroyed. */
  [['pop_session_v1', SESSION_KEY], ['pop_pairings_v1', PAIRINGS_KEY]].forEach(([from, to]) => {
    try {
      if (localStorage.getItem(to) === null && localStorage.getItem(from) !== null) {
        localStorage.setItem(to, localStorage.getItem(from));
      }
    } catch (e) {}
  });

  const $ = id => document.getElementById(id);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const mod = (a, n) => ((a % n) + n) % n;


  /* ==================================================================
     STATE
     Everything the Music Stand decides. The songs themselves live in the
     frames; this keeps where each came from and a copy of it, so a
     pairing still opens if the original is later deleted.
     ================================================================== */

  const state = {
    name: '',
    pairingId: null,
    bpm: 92,
    countIn: false,
    leadIn: 1,            // times round the ostinato goes before the poem
    loop: true,
    wordsSound: 'tone',   // 'tone' | 'drum'
    mute: { poem: false, ost: false },
    /* per voice, keyed by the voice id the bridge gives. The steady beat
       starts muted: with an ostinato underneath, it is already there. */
    voiceMute: { poem: { beat: true }, ost: {} },
    vol: { poem: 100, ost: 100 },
    /* the split is kept per arrangement: a size chosen for two scores one
       above the other means nothing once they sit side by side */
    layout: { arrange: 'stacked', first: 'poem', show: 'both',
              split: { stacked: 'auto', side: 'auto' } },
    views: {
      poem: { sizeMode: 'page', zoomPct: 100, measuresPerLine: 'auto',
              textPct: 100, lyricFont: 'rounded',
              showDots: true, showMeasureNumbers: true, followPlayback: true },
      ost:  { layout: 'pages', measuresPerPage: 4, zoomPct: 100, showDots: true,
              lightNotes: true, showSyllables: false, showBarNumbers: true, showBeatNumbers: true }
    },
    /* { src: 'library' | 'data', id, title, data } — `data` is always the
       latest snapshot, `id` only means something while src is 'library' */
    songs: { poem: null, ost: null }
  };

  const sides = {};
  SIDES.forEach(side => {
    sides[side] = {
      frame: $('frame-' + side),
      empty: $('empty-' + side),
      status: $('status-' + side),
      pane: $('pane-' + side),
      bridge: null,
      info: null,
      pending: null
    };
  });


  /* ==================================================================
     STORAGE
     ================================================================== */

  function readJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { toast('There was no room to save — the browser storage is full'); return false; }
  }

  let sessionTimer = null;
  function saveSession() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => writeJSON(SESSION_KEY, sessionRecord()), 250);
  }
  function flushSession() {
    clearTimeout(sessionTimer);
    writeJSON(SESSION_KEY, sessionRecord());
  }
  window.addEventListener('beforeunload', flushSession);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSession();
  });

  function settingsRecord() {
    return {
      bpm: state.bpm, countIn: state.countIn, leadIn: state.leadIn, loop: state.loop,
      wordsSound: state.wordsSound,
      mute: Object.assign({}, state.mute),
      voiceMute: JSON.parse(JSON.stringify(state.voiceMute)),
      vol: Object.assign({}, state.vol)
    };
  }

  function sessionRecord() {
    return Object.assign(settingsRecord(), {
      v: 1,
      name: state.name,
      pairingId: state.pairingId,
      layout: JSON.parse(JSON.stringify(state.layout)),
      views: JSON.parse(JSON.stringify(state.views)),
      songs: JSON.parse(JSON.stringify(state.songs))
    });
  }

  /* Whatever was read goes through here, so a hand-edited or old record
     cannot put the Music Stand into a state it has no controls for. */
  function adoptSettings(src) {
    if (!src || typeof src !== 'object') return;
    if (Number(src.bpm)) state.bpm = clamp(Math.round(Number(src.bpm)), BPM_MIN, BPM_MAX);
    if (typeof src.countIn === 'boolean') state.countIn = src.countIn;
    if ([0, 1, 2, 4].indexOf(src.leadIn) !== -1) state.leadIn = src.leadIn;
    if (typeof src.loop === 'boolean') state.loop = src.loop;
    if (src.wordsSound === 'drum' || src.wordsSound === 'tone') state.wordsSound = src.wordsSound;
    SIDES.forEach(side => {
      if (src.mute && typeof src.mute[side] === 'boolean') state.mute[side] = src.mute[side];
      if (src.voiceMute && src.voiceMute[side] && typeof src.voiceMute[side] === 'object') {
        state.voiceMute[side] = Object.assign({}, src.voiceMute[side]);
      }
      if (src.vol && Number.isFinite(src.vol[side])) state.vol[side] = clamp(src.vol[side], 0, 100);
    });
  }

  function adoptLayout(src) {
    if (!src || typeof src !== 'object') return;
    const L = state.layout;
    if (src.arrange === 'side' || src.arrange === 'stacked') L.arrange = src.arrange;
    if (src.first === 'poem' || src.first === 'ost') L.first = src.first;
    if (['both', 'poem', 'ost'].indexOf(src.show) !== -1) L.show = src.show;
    const ok = v => v === 'auto' || (typeof v === 'number' && v > 0 && v < 1);
    if (src.split && typeof src.split === 'object') {
      ['stacked', 'side'].forEach(k => { if (ok(src.split[k])) L.split[k] = src.split[k]; });
    }
  }

  function currentSplit() { return state.layout.split[effectiveArrange()]; }
  function setSplit(v) { state.layout.split[effectiveArrange()] = v; }

  function adoptViews(src) {
    if (!src || typeof src !== 'object') return;
    SIDES.forEach(side => {
      if (src[side] && typeof src[side] === 'object') {
        Object.keys(state.views[side]).forEach(k => {
          if (src[side][k] !== undefined) state.views[side][k] = src[side][k];
        });
      }
    });
  }


  /* ==================================================================
     CONNECTING TO THE FRAMES
     ================================================================== */

  function frameUrl(side) {
    return encodeURI(APPS[side].url) + '?embed=music-stand';
  }

  function bootFrame(side) {
    const s = sides[side];
    s.frame.addEventListener('load', () => connect(side));
    s.frame.src = frameUrl(side);
    document.querySelectorAll('[data-make="' + side + '"]').forEach(a => {
      a.href = encodeURI(APPS[side].url);
    });
  }

  function connect(side) {
    const s = sides[side];
    let bridge = null;
    try { bridge = s.frame.contentWindow.MusicStandBridge || null; } catch (e) { bridge = null; }

    if (!bridge || bridge.version !== 1) {
      s.bridge = null;
      showStatus(side, 'Could not reach ' + APPS[side].name + '. The Music Stand has to be opened from the same '
        + 'website as ' + APPS[side].name + ' — not from a file on this computer.');
      return;
    }

    s.bridge = bridge;
    bridge.onHostKey = handleKey;
    attachSide(side);
    safe(() => bridge.setView(state.views[side]));
    showStatus(side, '');

    if (s.pending) {
      const job = s.pending;
      s.pending = null;
      job();
    } else {
      /* A frame that reloads (it never should, but a browser may) comes
         back holding its own last song; put ours back. */
      const song = state.songs[side];
      if (song) loadInto(side, song, { keepTempo: true, keepMutes: true, quiet: true });
    }
  }

  /* The apps' sandboxes are scratch work kept beside the library, under
     ids of their own ('sandbox-poetry', 'sandbox-rhythm', 'sandbox'). */
  function isSandboxId(id) { return typeof id === 'string' && id.indexOf('sandbox') === 0; }

  /* A song opened from an app's library is the live one: edited in that
     app in another tab, it is opened again here — straight away when
     nothing is playing, or at the next Stop. */
  window.addEventListener('storage', e => {
    SIDES.forEach(side => {
      const s = sides[side], song = state.songs[side];
      if (!s.bridge || !song || song.src !== 'library' || e.key !== s.bridge.libraryKey) return;
      if (isPlaying()) { s.stale = true; return; }
      reopen(side);
    });
  });

  function reopen(side) {
    const song = state.songs[side];
    sides[side].stale = false;
    if (song) loadInto(side, song, { keepTempo: true, keepMutes: true, quiet: true });
  }

  function showStatus(side, text) {
    const el = sides[side].status;
    el.textContent = text;
    el.hidden = !text;
  }

  /* One side failing must never take the other down with it. */
  function safe(fn, fallback) {
    try { return fn(); } catch (e) { console.error(e); return fallback; }
  }


  /* ==================================================================
     OPENING A SONG ON ONE SIDE
     ================================================================== */

  /* `entry` is { src: 'library', id } for a song in the app's library, or
     { data } for one that came by link. A library song is opened by id so
     it is the current version — edited in its app since, it opens edited;
     deleted since, the copy we kept is opened instead. */
  function loadInto(side, entry, opts) {
    const o = opts || {};
    const s = sides[side];
    if (!s.bridge) {
      /* Held until the frame is ready. What to open is written down now,
         so a page closed before then does not forget it. */
      s.pending = () => loadInto(side, entry, opts);
      state.songs[side] = { src: entry.src || 'data', id: entry.id || null,
                            title: entry.title || '', data: entry.data || null };
      s.empty.classList.add('opening');
      return true;
    }
    s.empty.classList.remove('opening');
    if (isPlaying()) stopPlayback();

    let info = null;
    let src = 'data';
    if (entry.src === 'library' && entry.id) {
      info = safe(() => s.bridge.openLibrarySong(entry.id));
      if (info) src = 'library';
    }
    if (!info && entry.data) info = safe(() => s.bridge.loadSong(entry.data));
    if (!info) {
      if (!o.quiet) toast('That ' + APPS[side].noun + ' could not be opened');
      return false;
    }

    state.songs[side] = {
      src: src,
      id: src === 'library' ? entry.id : null,
      title: info.title,
      data: safe(() => s.bridge.snapshot(), entry.data || null)
    };
    s.info = info;

    if (!o.keepMutes) resetVoiceMutes(side, info);
    if (!o.keepTempo && (side === 'poem' || !state.songs.poem)) setBpm(info.bpm, { quiet: true });

    s.empty.hidden = true;
    requestAnimationFrame(() => safe(() => s.bridge.refit()));
    if (side === 'poem') resplitWhenFontsSettle('poem');

    refreshHeads();
    renderMixer();
    scheduleSplit();
    saveSession();
    return true;
  }

  function resetVoiceMutes(side, info) {
    if (side === 'poem') {
      state.voiceMute.poem = { beat: true };
    } else {
      const m = {};
      (info.voices || []).forEach(v => { if (v.muted) m[v.id] = true; });
      state.voiceMute.ost = m;
    }
  }

  function clearSide(side) {
    state.songs[side] = null;
    sides[side].info = null;
    sides[side].pending = null;
    sides[side].stale = false;
    sides[side].empty.classList.remove('opening');
    sides[side].empty.hidden = false;
    refreshHeads();
    renderMixer();
    scheduleSplit();
  }


  /* ==================================================================
     THE HEADINGS
     ================================================================== */

  function meterText(info) { return info.meter[0] + '/' + info.meter[1]; }

  function barsOf(info) {
    const body = Math.max(0, info.totalBeats - (info.pickupBeats || 0));
    return Math.max(1, Math.ceil(body / Math.max(1, info.beatsPerMeasure)));
  }

  function refreshHeads() {
    SIDES.forEach(side => {
      const info = state.songs[side] ? sides[side].info : null;
      $(side + '-title').textContent = info ? info.title : 'Choose ' + (side === 'poem' ? 'a poem' : 'an ostinato');
      let meta = '';
      if (info) {
        const bars = barsOf(info);
        meta = meterText(info) + ' · ' + bars + (bars === 1 ? ' bar' : ' bars')
             + (info.pickupBeats ? ' + pickup' : '');
      }
      $(side + '-meta').textContent = meta;
      sides[side].pane.classList.toggle('muted', state.mute[side]);
      const muteBtn = sides[side].pane.querySelector('.pane-mute');
      muteBtn.setAttribute('aria-pressed', String(state.mute[side]));
      muteBtn.title = (state.mute[side] ? 'Unmute the ' : 'Mute the ') + APPS[side].noun;
    });

    /* When the two count their bars differently, say so once, quietly.
       Nothing is wrong — an ostinato crossing the bar line is a thing
       composers do on purpose — but it should not come as a surprise. */
    const note = $('meter-note');
    const p = state.songs.poem && sides.poem.info;
    const q = state.songs.ost && sides.ost.info;
    let text = '', title = '';
    if (p && q) {
      if (p.beatTicks !== q.beatTicks) {
        text = meterText(q) + ' against ' + meterText(p);
        title = 'One side is in simple time and the other in compound. The beats line up; the notes between them do not.';
      } else if (p.beatsPerMeasure !== q.beatsPerMeasure) {
        text = q.beatsPerMeasure + ' beats against ' + p.beatsPerMeasure;
        title = 'The ostinato’s bars are ' + q.beatsPerMeasure + ' beats long and the poem’s are '
              + p.beatsPerMeasure + ', so the ostinato will cross the poem’s bar lines.';
      }
    }
    note.textContent = text;
    note.title = title;
    note.hidden = !text;

    const titles = SIDES.map(side => state.songs[side] && state.songs[side].title).filter(Boolean);
    $('pair-chip-label').textContent = state.name || (titles.length ? titles.join(' + ') : 'New pairing');
    document.title = (state.name || titles.join(' + ') || 'Music Stand')
      + (titles.length || state.name ? ' — Music Stand' : '');
  }


  /* ==================================================================
     SOUND
     ------------------------------------------------------------------
     The Music Stand owns the only AudioContext. Each side has its own gain on it
     (the mixer's volume), and in front of that a gate that lasts one
     play: the apps connect to the gate in place of the speakers. Notes
     are scheduled a little ahead of time, so on Stop some are already
     waiting in the audio graph — closing that play's gate silences them,
     and the next play gets a fresh one.

     The apps' sound code reads `currentTime` once per note and schedules
     everything from that reading. What they are handed is a view of the
     context whose `currentTime` the Music Stand can set: while a note is being
     sounded it reads as the moment the note is due. So a note is placed
     on the audio clock to the sample, not left to when a timer fires —
     without either app, or the shared instrument library, knowing.
     ================================================================== */

  const audio = { ctx: null, timed: null, master: null, gain: {}, gate: {} };

  function makeTimedContext(ctx) {
    let at = null;
    const view = new Proxy(ctx, {
      get(target, prop) {
        if (prop === 'currentTime') return at != null ? at : target.currentTime;
        const value = Reflect.get(target, prop, target);
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop, value) { return Reflect.set(target, prop, value, target); }
    });
    return {
      ctx: view,
      /* run `fn` with the clock reading `time` — never in the past */
      soundAt(time, fn) {
        at = Math.max(time, ctx.currentTime);
        try { fn(); } finally { at = null; }
      }
    };
  }

  function ensureAudio() {
    if (!audio.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      const ctx = new Ctor({ latencyHint: 'interactive' });
      audio.ctx = ctx;
      audio.timed = makeTimedContext(ctx);
      audio.master = ctx.createGain();
      audio.master.connect(ctx.destination);
      SIDES.forEach(side => {
        const g = ctx.createGain();
        g.connect(audio.master);
        audio.gain[side] = g;
      });
      applyVolumes();
      openGates();
    }
    if (audio.ctx.state === 'suspended') audio.ctx.resume();
    return audio.ctx;
  }

  function attachSide(side) {
    const b = sides[side].bridge;
    if (b && audio.ctx) safe(() => b.attachAudio(audio.timed.ctx, audio.gate[side]));
  }

  function openGates() {
    SIDES.forEach(side => {
      const gate = audio.ctx.createGain();
      gate.connect(audio.gain[side]);
      audio.gate[side] = gate;
      attachSide(side);
    });
  }

  function closeGates() {
    if (!audio.ctx) return;
    const t = audio.ctx.currentTime;
    SIDES.forEach(side => {
      const gate = audio.gate[side];
      if (!gate) return;
      gate.gain.setValueAtTime(gate.gain.value, t);
      gate.gain.linearRampToValueAtTime(0, t + 0.015);
      setTimeout(() => gate.disconnect(), 500);
    });
  }

  /* Squared, so the slider's travel is spread evenly to the ear. */
  function applyVolumes() {
    if (!audio.ctx) return;
    SIDES.forEach(side => {
      const v = state.vol[side] / 100;
      audio.gain[side].gain.setTargetAtTime(v * v, audio.ctx.currentTime, 0.02);
    });
  }

  /* The count-in. Plain and quiet, like Ostinato Builder's metronome, and
     through the poem's gate so Stop silences it with everything else. */
  function playClick(strong, time) {
    const ctx = audio.ctx;
    if (!ctx) return;
    const t = Math.max(time, ctx.currentTime);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(strong ? 1600 : 1050, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(strong ? 0.16 : 0.09, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    osc.connect(gain);
    gain.connect(audio.gate.poem || audio.master);
    osc.start(t);
    osc.stop(t + 0.06);
  }


  /* ==================================================================
     THE CONDUCTOR
     ------------------------------------------------------------------
     Time is counted in beats from the moment Play is pressed. Each side
     hands over one pass of its piece as events in its own ticks; those
     are filed by beat, so the question "what sounds on beat g?" is a
     lookup, and the answer to "which beat of each piece is g?" is
     worked out by resolveBeat() from four landmarks:

        count-in   C beats of clicks, if asked for
        intro      L beats of ostinato alone (the ostinato, L times round)
        T0         the poem's first downbeat
        passes     the poem, then again if looping; the ostinato starts
                   again at every pass's downbeat, so its bar 1 always
                   lands on the poem's bar 1

     A pickup comes in on the last beat before T0, over the end of the
     intro.

     Beats are placed on the audio clock: beat g is at
     audioAnchor + g * secPerBeat. A pump running every few milliseconds
     walks forward through the events, one at a time, and hands each to
     its app a short way (LOOKAHEAD) before it is due. Only that far is
     ever committed, so a mute or a tempo change is heard almost at once.
     The lights are timers, set to go off when each beat is heard.
     ================================================================== */

  const LOOKAHEAD = 0.12;    // seconds of sound committed ahead of time
  const PUMP_MS = 20;
  const LEAD_IN = 0.1;       // a moment to settle before beat one

  const play = {
    on: false,
    plan: null,
    audioAnchor: 0,   // ctx time of global beat 0
    spb: 0,           // seconds per beat
    beat: 0,          // the beat the cursor is in
    items: null,      // that beat's events, in time order
    index: 0,         // the next of them to hand over
    ending: false,
    timers: new Set(),
    pump: null
  };

  function isPlaying() { return play.on; }

  function sidePlan(side) {
    const s = sides[side];
    if (!s.bridge || !state.songs[side]) return null;
    const info = safe(() => s.bridge.info());
    const tl = safe(() => s.bridge.timeline());
    if (!info || !tl || !tl.totalBeats) return null;
    s.info = info;

    const n = tl.totalBeats;
    const bt = tl.beatTicks;
    const byBeat = Array.from({ length: n }, () => []);
    tl.notes.forEach(ev => {
      const b = Math.floor(ev.tick / bt + 1e-9);
      if (b < 0 || b >= n) return;
      byBeat[b].push({
        frac: (ev.tick - b * bt) / bt,
        voice: ev.voice,
        key: String(ev.voice),
        hold: (ev.holdTicks || 0) / bt,
        gap: (ev.gapTicks || 0) / bt
      });
    });
    return {
      info: info,
      n: n,
      byBeat: byBeat,
      bpb: Math.max(1, info.beatsPerMeasure),
      pickup: info.pickupBeats || 0
    };
  }

  function buildPlan() {
    const poem = sidePlan('poem');
    const ost = sidePlan('ost');
    if (!poem && !ost) return null;

    const lead = poem || ost;
    const C = state.countIn ? lead.bpb : 0;
    const pk = poem ? poem.pickup : 0;
    const L = (poem && ost) ? state.leadIn * ost.n : 0;
    let T0 = C + L;
    if (poem && L === 0) T0 = Math.max(T0, pk);

    return {
      poem: poem,
      ost: ost,
      lead: lead,
      C: C,
      L: L,
      T0: T0,
      pk: pk,
      poemStart: poem ? T0 - pk : Infinity,
      ostStart: ost ? (poem ? T0 - L : T0) : Infinity
    };
  }

  /* Which beat of each piece global beat g is, or null where a side is
     silent. `end` marks the first beat past the end, when not looping. */
  function resolveBeat(plan, g) {
    const r = { pb: null, ob: null, pass: 0, click: 0, end: false };
    const firstSound = Math.min(plan.poemStart, plan.ostStart);

    if (g < firstSound) {
      if (g < plan.C) r.click = g % plan.lead.bpb === 0 ? 2 : 1;
      return r;
    }

    const poem = plan.poem, ost = plan.ost;
    if (poem) {
      if (g >= plan.poemStart) {
        const rel = g - plan.poemStart;
        const k = Math.floor(rel / poem.n);
        if (!state.loop && k >= 1) { r.end = true; return r; }
        r.pass = k;
        r.pb = rel - k * poem.n;
      }
      if (ost && g >= plan.ostStart) {
        if (g < plan.T0) {
          r.ob = mod(g - plan.T0, ost.n);
        } else {
          const k = Math.floor((g - plan.poemStart) / poem.n);
          r.ob = mod(g - (plan.T0 + k * poem.n), ost.n);
        }
      }
    } else if (ost) {
      const rel = g - plan.ostStart;
      const k = Math.floor(rel / ost.n);
      if (!state.loop && k >= 1) { r.end = true; return r; }
      r.pass = k;
      r.ob = rel - k * ost.n;
    }
    return r;
  }

  /* One beat's events, in time order. The beat marker comes after any
     notes at the same instant, so sound goes out first. */
  function beatItems(g) {
    const plan = play.plan;
    const r = resolveBeat(plan, g);
    const items = [];
    if (r.end) {
      items.push({ frac: 0, kind: 'end' });
      return items;
    }
    if (r.pb != null) plan.poem.byBeat[r.pb].forEach(ev => items.push({ frac: ev.frac, kind: 'poem', ev: ev }));
    if (r.ob != null) plan.ost.byBeat[r.ob].forEach(ev => items.push({ frac: ev.frac, kind: 'ost', ev: ev }));
    items.push({ frac: 0, kind: 'beat', r: r });
    items.sort((a, b) => a.frac - b.frac || (a.kind === 'beat') - (b.kind === 'beat'));
    return items;
  }

  function itemTime(g, item) {
    return play.audioAnchor + (g + item.frac) * play.spb;
  }

  /* When an audio time will be heard, in performance.now() terms — for
     the lights, which should change with the sound rather than with the
     scheduling of it. */
  function heardAt(time) {
    const ctx = audio.ctx;
    const latency = (ctx.outputLatency || ctx.baseLatency || 0);
    return performance.now() + (time - ctx.currentTime + latency) * 1000;
  }

  function later(perfDue, fn) {
    const id = setTimeout(() => { play.timers.delete(id); safe(fn); },
                          Math.max(0, perfDue - performance.now()));
    play.timers.add(id);
  }

  function clearTimers() {
    play.timers.forEach(clearTimeout);
    play.timers.clear();
  }

  function pump() {
    if (!play.on || play.ending) return;
    const horizon = audio.ctx.currentTime + LOOKAHEAD;
    for (let guard = 0; guard < 2000; guard++) {
      if (!play.items) { play.items = beatItems(play.beat); play.index = 0; }
      if (play.index >= play.items.length) {
        play.beat++;
        play.items = null;
        continue;
      }
      const item = play.items[play.index];
      const time = itemTime(play.beat, item);
      if (time > horizon) break;
      dispatch(play.beat, item, time);
      play.index++;
      if (play.ending) break;
    }
  }

  function dispatch(g, item, time) {
    if (item.kind === 'poem') soundPoem(item.ev, time);
    else if (item.kind === 'ost') soundOst(item.ev, time);
    else if (item.kind === 'beat') {
      if (item.r.click) playClick(item.r.click === 2, time);
      const r = item.r;
      later(heardAt(time), () => onBeat(g, r));
    } else if (item.kind === 'end') {
      play.ending = true;
      later(heardAt(time), () => stopPlayback());
    }
  }

  function soundPoem(ev, time) {
    if (state.mute.poem || state.voiceMute.poem[ev.key]) return;
    const b = sides.poem.bridge;
    if (!b) return;
    const opts = { holdMs: ev.hold * play.spb * 1000, style: state.wordsSound };
    safe(() => audio.timed.soundAt(time, () => b.sound(ev.voice, opts)));
  }

  function soundOst(ev, time) {
    if (state.mute.ost || state.voiceMute.ost[ev.key]) return;
    const b = sides.ost.bridge;
    if (!b) return;
    const opts = { gapMs: ev.gap * play.spb * 1000 };
    safe(() => audio.timed.soundAt(time, () => b.sound(ev.voice, opts)));
  }

  function onBeat(g, r) {
    if (sides.poem.bridge && state.songs.poem) safe(() => sides.poem.bridge.highlight(r.pb == null ? -1 : r.pb));
    if (sides.ost.bridge && state.songs.ost) safe(() => sides.ost.bridge.highlight(r.ob == null ? -1 : r.ob));
    updateReadout(g, r);
  }

  function startPlayback() {
    const plan = buildPlan();
    if (!plan) {
      toast('Choose a poem or an ostinato first');
      return;
    }
    const ctx = ensureAudio();
    if (!ctx) {
      toast('This browser cannot play sound');
      return;
    }
    closePopovers();
    if (play.on) stopPlayback();
    openGates();

    play.plan = plan;
    play.on = true;
    play.ending = false;
    play.spb = 60 / state.bpm;
    play.audioAnchor = ctx.currentTime + LEAD_IN;
    play.beat = 0;
    play.items = null;
    play.index = 0;
    pump();
    clearInterval(play.pump);
    play.pump = setInterval(pump, PUMP_MS);
    setPlayGlyph(true);
  }

  function stopPlayback() {
    const was = play.on;
    play.on = false;
    play.ending = false;
    clearInterval(play.pump);
    play.pump = null;
    clearTimers();
    if (was) closeGates();
    SIDES.forEach(side => {
      const b = sides[side].bridge;
      if (b && state.songs[side]) safe(() => b.stop());
    });
    $('readout-poem').textContent = '';
    $('readout-ost').textContent = '';
    setPlayGlyph(false);
    SIDES.forEach(side => { if (sides[side].stale) reopen(side); });
  }

  function togglePlayback() {
    if (play.on) stopPlayback(); else startPlayback();
  }

  /* A new tempo takes effect from where the music is, not from the top.
     Everything already handed over keeps its time; the clock is
     re-anchored so the next event not yet handed over lands exactly where
     it would have, and everything after it follows the new tempo. */
  function retime() {
    if (!play.on) return;
    const newSpb = 60 / state.bpm;
    const items = play.items || beatItems(play.beat);
    const item = items[Math.min(play.index, items.length - 1)];
    const pos = play.beat + (item ? item.frac : 0);
    const keep = play.audioAnchor + pos * play.spb;
    play.spb = newSpb;
    play.audioAnchor = keep - pos * newSpb;
  }

  function setPlayGlyph(playing) {
    const btn = $('play-btn');
    btn.classList.toggle('playing', playing);
    $('play-glyph').textContent = playing ? '■' : '▶';
  }

  function updateReadout(g, r) {
    const plan = play.plan;
    if (!plan) return;
    const poemEl = $('readout-poem'), ostEl = $('readout-ost');
    let p = '', o = '';

    if (r.click) {
      const count = 'Count-in ' + (g + 1);
      if (plan.poem) p = count; else o = count;
    }
    if (plan.poem && !r.click) {
      if (r.pb == null) p = 'Intro';
      else if (r.pb < plan.pk) p = 'Pickup';
      else {
        const bar = Math.floor((r.pb - plan.pk) / plan.poem.bpb) + 1;
        p = 'Bar ' + bar + ' of ' + barsOf(plan.poem.info) + (r.pass > 0 ? ' · round ' + (r.pass + 1) : '');
      }
    }
    if (plan.ost && r.ob != null) {
      const bar = Math.floor(r.ob / plan.ost.bpb) + 1;
      o = 'Bar ' + bar + ' of ' + barsOf(plan.ost.info);
    }
    poemEl.textContent = p;
    ostEl.textContent = o;
  }


  /* ==================================================================
     TEMPO
     ================================================================== */

  const bpmInput = $('bpm-input');

  function setBpm(value, opts) {
    const v = clamp(Math.round(Number(value) || state.bpm), BPM_MIN, BPM_MAX);
    const changed = v !== state.bpm;
    state.bpm = v;
    if (document.activeElement !== bpmInput) bpmInput.value = String(v);
    $('bpm-slider').value = String(v);
    $('tempo-pop-value').textContent = String(v);
    if (changed) { retime(); saveSession(); }
    if (!(opts && opts.quiet)) syncTempoPop();
  }

  /* Committed as it is typed, not on blur: focus can fail to land in a
     background tab, and a popover opening takes it away. */
  bpmInput.addEventListener('input', () => {
    const digits = bpmInput.value.replace(/\D/g, '');
    if (digits !== bpmInput.value) bpmInput.value = digits;
    const n = Number(digits);
    if (n >= BPM_MIN && n <= BPM_MAX) setBpm(n);
  });
  bpmInput.addEventListener('blur', () => { bpmInput.value = String(state.bpm); });
  bpmInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === 'Escape') { bpmInput.blur(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setBpm(state.bpm + (e.shiftKey ? 5 : 1)); bpmInput.value = String(state.bpm); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setBpm(state.bpm - (e.shiftKey ? 5 : 1)); bpmInput.value = String(state.bpm); }
  });
  bpmInput.addEventListener('focus', () => bpmInput.select());

  $('bpm-up').addEventListener('click', e => setBpm(state.bpm + (e.shiftKey ? 5 : 1)));
  $('bpm-down').addEventListener('click', e => setBpm(state.bpm - (e.shiftKey ? 5 : 1)));
  $('bpm-slider').addEventListener('input', e => setBpm(e.target.value));

  function syncTempoPop() {
    SIDES.forEach(side => {
      const btn = $('tempo-from-' + side);
      const info = state.songs[side] && sides[side].info;
      btn.disabled = !info;
      btn.textContent = (side === 'poem' ? 'The poem' : 'The ostinato') + (info ? ' (' + info.bpm + ')' : '');
      btn.classList.toggle('active', !!info && info.bpm === state.bpm);
    });
  }
  SIDES.forEach(side => {
    $('tempo-from-' + side).addEventListener('click', () => {
      const info = state.songs[side] && sides[side].info;
      if (info) setBpm(info.bpm);
    });
  });


  /* ==================================================================
     COUNT-IN, INTRO, LOOP
     ================================================================== */

  function syncSequence() {
    $('countin-btn').setAttribute('aria-pressed', String(state.countIn));
    $('loop-btn').setAttribute('aria-pressed', String(state.loop));
    $('leadin-value').textContent = state.leadIn ? state.leadIn + '×' : 'Off';
    document.querySelectorAll('#leadin-seg [data-leadin]').forEach(b => {
      b.classList.toggle('active', Number(b.dataset.leadin) === state.leadIn);
    });
  }

  $('countin-btn').addEventListener('click', () => {
    state.countIn = !state.countIn;
    syncSequence();
    saveSession();
    if (play.on) toast('The count-in starts with the next play');
  });
  $('loop-btn').addEventListener('click', () => {
    state.loop = !state.loop;
    syncSequence();
    saveSession();
  });
  document.querySelectorAll('#leadin-seg [data-leadin]').forEach(b => {
    b.addEventListener('click', () => {
      state.leadIn = Number(b.dataset.leadin);
      syncSequence();
      saveSession();
      if (play.on) toast('The intro changes with the next play');
    });
  });


  /* ==================================================================
     MIXER
     ================================================================== */

  function voiceButton(side, voice) {
    const btn = document.createElement('button');
    btn.className = 'voice-btn';
    const muted = !!state.voiceMute[side][String(voice.id)];
    btn.classList.toggle('muted', muted);
    if (voice.image) {
      const img = document.createElement('img');
      img.src = voice.image;
      img.alt = '';
      btn.appendChild(img);
    }
    const label = document.createElement('span');
    label.className = 'voice-label';
    label.textContent = voice.label;
    const st = document.createElement('span');
    st.className = 'voice-state';
    st.textContent = muted ? 'Off' : 'On';
    btn.append(label, st);
    btn.title = (muted ? 'Turn on ' : 'Turn off ') + voice.label;
    btn.addEventListener('click', () => {
      const k = String(voice.id);
      if (state.voiceMute[side][k]) delete state.voiceMute[side][k];
      else state.voiceMute[side][k] = true;
      renderMixer();
      saveSession();
    });
    return btn;
  }

  function renderMixer() {
    SIDES.forEach(side => {
      const box = $('mixer-' + side);
      box.innerHTML = '';
      const info = state.songs[side] && sides[side].info;
      if (!info) {
        const empty = document.createElement('div');
        empty.className = 'mixer-empty';
        empty.textContent = side === 'poem' ? 'No poem chosen yet.' : 'No ostinato chosen yet.';
        box.appendChild(empty);
      } else {
        info.voices.forEach(v => box.appendChild(voiceButton(side, v)));
      }
      $('vol-' + side).value = String(state.vol[side]);
    });
    $('words-tone').classList.toggle('active', state.wordsSound === 'tone');
    $('words-drum').classList.toggle('active', state.wordsSound === 'drum');
  }

  SIDES.forEach(side => {
    $('vol-' + side).addEventListener('input', e => {
      state.vol[side] = Number(e.target.value);
      applyVolumes();
      saveSession();
    });
  });
  $('words-tone').addEventListener('click', () => { state.wordsSound = 'tone'; renderMixer(); saveSession(); });
  $('words-drum').addEventListener('click', () => { state.wordsSound = 'drum'; renderMixer(); saveSession(); });

  document.querySelectorAll('.pane-mute').forEach(btn => {
    btn.addEventListener('click', () => {
      const side = btn.dataset.side;
      state.mute[side] = !state.mute[side];
      refreshHeads();
      saveSession();
    });
  });


  /* ==================================================================
     LAYOUT
     ------------------------------------------------------------------
     One number, --split, is the poem's share of the room; order and
     arrangement are attributes. None of it reloads a frame — each app
     sees its window change size and re-fits its own score, the same as
     if the browser had been resized.

     Left to itself ('auto'), the stacked layout asks the ostinato how
     tall a page of it is at this width and gives it exactly that, so
     it is drawn as large as its width allows, and the poem gets the
     rest. Dragging the line takes over; double-clicking gives it back.
     ================================================================== */

  const panesEl = $('panes');
  const divider = $('divider');

  function effectiveArrange() {
    return window.innerWidth <= 640 ? 'stacked' : state.layout.arrange;
  }

  function applyArrangement() {
    const arrange = effectiveArrange();
    panesEl.dataset.arrange = arrange;
    panesEl.dataset.first = state.layout.first;
    panesEl.dataset.show = state.layout.show;
    document.body.classList.toggle('arrange-side', arrange === 'side');
    divider.setAttribute('aria-orientation', arrange === 'side' ? 'vertical' : 'horizontal');

    $('arrange-stacked').classList.toggle('active', arrange === 'stacked');
    $('arrange-side').classList.toggle('active', arrange === 'side');
    $('first-poem').classList.toggle('active', state.layout.first === 'poem');
    $('first-ost').classList.toggle('active', state.layout.first === 'ost');
    document.querySelectorAll('#layout-pop [data-show]').forEach(b => {
      b.classList.toggle('active', b.dataset.show === state.layout.show);
    });
    $('split-auto').classList.toggle('active', currentSplit() === 'auto');
    $('split-even').classList.toggle('active', currentSplit() === 0.5);
    applySplit();
  }

  /* The room the two panes share along the split, less the line between. */
  function splitRoom() {
    const cs = getComputedStyle(panesEl);
    const side = effectiveArrange() === 'side';
    const size = side
      ? panesEl.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      : panesEl.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    return Math.max(1, size - divider.offsetHeight * (side ? 0 : 1) - divider.offsetWidth * (side ? 1 : 0));
  }

  /* The two scores should come out with notes of about the same size, so
     the room is shared by scale, not by a fixed ratio. Each app reports
     its natural size and how it scales (sizing()); from that, the size
     along the split is a function of one common scale s. The largest s
     at which both fit is found by bisection, each side gets what it
     needs at that scale, and the spare is split evenly between them.

     A side can never be drawn wider (stacked) or taller (side by side)
     than its pane allows, whatever s is — that cap is `room` below.
     A poem set to fill the width is its own fixed height when stacked.

     When the poem may choose how many bars go on a line, it offers every
     choice (`layouts`), and the one that lets both be drawn largest wins;
     the poem then makes the same choice itself in the pane it is given. */
  /* For one side: its size along the split at common scale s, and the
     scale it is actually drawn at then (it stops growing at its cap). */
  function sizeCurve(side, sz, stacked) {
    const frame = sides[side].frame;
    const along  = stacked ? sz.h : sz.w,    padAlong  = stacked ? sz.padH : sz.padW;
    const across = stacked ? sz.w : sz.h,    padAcross = stacked ? sz.padW : sz.padH;
    const room = (stacked ? frame.clientWidth : frame.clientHeight) - padAcross;
    const cap = Math.min(sz.maxScale, Math.max(0.05, room / across));

    if (sz.mode === 'fixed') {
      return { size: () => along * sz.fixedScale + padAlong, drawn: () => sz.fixedScale };
    }
    if (sz.mode === 'fit' && stacked) {
      return { size: () => along * cap + padAlong, drawn: () => cap };
    }
    const top = sz.mode === 'fit' ? sz.maxScale : cap;
    return { size: s => along * Math.min(s, top) + padAlong, drawn: s => Math.min(s, top) };
  }

  function sizingOf(side) {
    const b = sides[side].bridge;
    const sz = b && typeof b.sizing === 'function' ? safe(() => b.sizing(), null) : null;
    return sz && sz.w && sz.h ? sz : null;
  }

  /* The largest common scale both fit at, the poem's share of the room
     there, and how big the smaller of the two is then drawn — which is
     what a choice between layouts is judged by. */
  function solveSplit(cp, co, chromeP, chromeO, room) {
    const total = s => cp.size(s) + co.size(s) + chromeP + chromeO;
    let lo = 0.05, hi = 1.8, s;
    if (total(hi) <= room) s = hi;
    else if (total(lo) > room) {
      /* even tiny does not fit: share by what each asks for at that size */
      return { s: lo, least: 0, share: (cp.size(lo) + chromeP) / total(lo) };
    } else {
      for (let i = 0; i < 28; i++) {
        const mid = (lo + hi) / 2;
        if (total(mid) <= room) lo = mid; else hi = mid;
      }
      s = lo;
    }
    const spare = Math.max(0, room - total(s));
    return {
      s: s,
      least: Math.min(cp.drawn(s), co.drawn(s)),
      share: (cp.size(s) + chromeP + spare / 2) / room
    };
  }

  function autoSplit() {
    if (!state.songs.poem || !state.songs.ost) return 0.5;
    const stacked = effectiveArrange() !== 'side';
    const sp = sizingOf('poem'), so = sizingOf('ost');
    if (!sp || !so) return 0.5;

    const chromeOf = side => {
      const head = sides[side].pane.querySelector('.pane-head');
      return (stacked && head && head.offsetParent ? head.offsetHeight : 0) + 2;
    };
    const chromeP = chromeOf('poem'), chromeO = chromeOf('ost');
    const room = splitRoom();
    const co = sizeCurve('ost', so, stacked);

    const options = sp.layouts && sp.layouts.length
      ? sp.layouts.map(L => Object.assign({}, sp, { w: L.w, h: L.h }))
      : [sp];
    let best = null;
    options.forEach(opt => {
      const r = solveSplit(sizeCurve('poem', opt, stacked), co, chromeP, chromeO, room);
      /* a near-tie goes to the longer line, as the poem itself decides */
      if (!best || r.least >= best.least * 0.98) best = r;
    });
    return clamp(best.share, 0.15, 0.85);
  }

  function applySplit() {
    const split = currentSplit() === 'auto' ? autoSplit() : currentSplit();
    panesEl.style.setProperty('--split', String(clamp(split, 0.12, 0.88)));
  }

  /* Each app re-fits on its own resize, a moment after ours, and the poem
     may then choose a different number of bars to a line — which changes
     what it asks for. So the auto size is worked out once the apps have
     settled, and once more after that answer has settled in turn. */
  let splitTimer = null, settleTimer = null;
  function scheduleSplit() {
    clearTimeout(splitTimer);
    clearTimeout(settleTimer);
    splitTimer = setTimeout(() => {
      if (sides.ost.bridge && state.songs.ost) safe(() => sides.ost.bridge.refit());
      applySplit();
      if (currentSplit() === 'auto') {
        settleTimer = setTimeout(() => { applySplit(); setTimeout(endBooting, 350); }, 450);
      } else {
        setTimeout(endBooting, 300);
      }
    }, 180);
  }

  /* On the first load the scores are hidden until the sizes have settled,
     so the page does not visibly shuffle itself into place. */
  function endBooting() { document.body.classList.remove('booting'); }

  function setLayout(patch) {
    const p = Object.assign({}, patch);
    if ('split' in p) { setSplit(p.split); delete p.split; }
    Object.assign(state.layout, p);
    applyArrangement();
    scheduleSplit();
    saveSession();
  }

  $('arrange-stacked').addEventListener('click', () => setLayout({ arrange: 'stacked' }));
  $('arrange-side').addEventListener('click', () => setLayout({ arrange: 'side' }));
  $('first-poem').addEventListener('click', () => setLayout({ first: 'poem' }));
  $('first-ost').addEventListener('click', () => setLayout({ first: 'ost' }));
  $('split-auto').addEventListener('click', () => setLayout({ split: 'auto' }));
  $('split-even').addEventListener('click', () => setLayout({ split: 0.5 }));
  document.querySelectorAll('#layout-pop [data-show]').forEach(b => {
    b.addEventListener('click', () => setLayout({ show: b.dataset.show }));
  });

  /* ---- dragging the line between them ---- */

  function poemShareAt(clientX, clientY) {
    const rect = panesEl.getBoundingClientRect();
    const cs = getComputedStyle(panesEl);
    const side = effectiveArrange() === 'side';
    const start = side ? rect.left + parseFloat(cs.paddingLeft) : rect.top + parseFloat(cs.paddingTop);
    const room = splitRoom();
    const half = (side ? divider.offsetWidth : divider.offsetHeight) / 2;
    let firstShare = ((side ? clientX : clientY) - start - half) / room;
    firstShare = clamp(firstShare, 0.12, 0.88);
    return state.layout.first === 'poem' ? firstShare : 1 - firstShare;
  }

  divider.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    divider.setPointerCapture(e.pointerId);
    document.body.classList.add('dragging');
    const move = ev => {
      setSplit(Math.round(poemShareAt(ev.clientX, ev.clientY) * 1000) / 1000);
      applySplit();
    };
    const up = () => {
      divider.removeEventListener('pointermove', move);
      divider.removeEventListener('pointerup', up);
      divider.removeEventListener('pointercancel', up);
      document.body.classList.remove('dragging');
      applyArrangement();
      saveSession();
    };
    divider.addEventListener('pointermove', move);
    divider.addEventListener('pointerup', up);
    divider.addEventListener('pointercancel', up);
  });

  divider.addEventListener('dblclick', () => setLayout({ split: 'auto' }));

  divider.addEventListener('keydown', e => {
    const side = effectiveArrange() === 'side';
    const back = side ? 'ArrowLeft' : 'ArrowUp';
    const fwd = side ? 'ArrowRight' : 'ArrowDown';
    if (e.key !== back && e.key !== fwd) {
      if (e.key === 'Enter') setLayout({ split: 'auto' });
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const current = currentSplit() === 'auto' ? autoSplit() : currentSplit();
    const towardFirst = e.key === back ? -0.03 : 0.03;
    const delta = state.layout.first === 'poem' ? towardFirst : -towardFirst;
    setLayout({ split: Math.round(clamp(current + delta, 0.12, 0.88) * 1000) / 1000 });
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    closePopovers();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { applyArrangement(); scheduleSplit(); }, 120);
  });


  /* ==================================================================
     HOW EACH SCORE IS SHOWN
     Handed straight to the app, which already knows how to do all of
     it; the Music Stand only remembers the choices, separately from the app's
     own settings, so a pane can be set up for the room without touching
     how the app looks when it is opened on its own.
     ================================================================== */

  function setView(side, patch) {
    Object.assign(state.views[side], patch);
    const b = sides[side].bridge;
    if (b) safe(() => b.setView(patch));
    syncViewPops();
    scheduleSplit();
    if (side === 'poem' && 'lyricFont' in patch) resplitWhenFontsSettle('poem');
    saveSession();
  }

  /* A typeface that has not arrived yet is measured in its fallback, and
     the poem's natural size changes when it does — so once the frame has
     its fonts, the split is worked out again. */
  function resplitWhenFontsSettle(side) {
    const doc = safe(() => sides[side].frame.contentDocument, null);
    if (!doc || !doc.fonts || !doc.fonts.ready) return;
    doc.fonts.ready.then(() => setTimeout(scheduleSplit, 80)).catch(() => {});
  }

  function syncViewPops() {
    const rp = state.views.poem;
    document.querySelectorAll('[data-rp-size]').forEach(b => {
      b.classList.toggle('active', b.dataset.rpSize === rp.sizeMode);
    });
    $('rp-zoom').value = String(rp.zoomPct);
    $('rp-zoom-val').textContent = rp.zoomPct + '%';
    $('rp-text').value = String(rp.textPct);
    $('rp-text-val').textContent = rp.textPct + '%';
    document.querySelectorAll('#rp-font [data-font]').forEach(b => {
      b.classList.toggle('active', b.dataset.font === rp.lyricFont);
    });
    document.querySelectorAll('#rp-mpl [data-mpl]').forEach(b => {
      b.classList.toggle('active', String(rp.measuresPerLine) === b.dataset.mpl);
    });
    document.querySelectorAll('[data-rp-switch]').forEach(b => {
      b.classList.toggle('on', !!rp[b.dataset.rpSwitch]);
    });

    const ob = state.views.ost;
    document.querySelectorAll('[data-ob-layout]').forEach(b => {
      b.classList.toggle('active', b.dataset.obLayout === ob.layout);
    });
    $('ob-perpage-section').hidden = ob.layout !== 'pages';
    $('ob-zoom-section').hidden = ob.layout === 'pages';
    document.querySelectorAll('#ob-perpage [data-per-page]').forEach(b => {
      b.classList.toggle('active', Number(b.dataset.perPage) === ob.measuresPerPage);
    });
    $('ob-zoom').value = String(ob.zoomPct);
    $('ob-zoom-val').textContent = ob.zoomPct + '%';
    document.querySelectorAll('[data-ob-switch]').forEach(b => {
      b.classList.toggle('on', !!ob[b.dataset.obSwitch]);
    });
  }

  document.querySelectorAll('[data-rp-size]').forEach(b => {
    b.addEventListener('click', () => setView('poem', { sizeMode: b.dataset.rpSize }));
  });
  $('rp-zoom').addEventListener('input', e => {
    $('rp-zoom-val').textContent = e.target.value + '%';
    setView('poem', { zoomPct: Number(e.target.value) });
  });
  $('rp-text').addEventListener('input', e => {
    $('rp-text-val').textContent = e.target.value + '%';
    setView('poem', { textPct: Number(e.target.value) });
  });
  document.querySelectorAll('#rp-font [data-font]').forEach(b => {
    b.addEventListener('click', () => setView('poem', { lyricFont: b.dataset.font }));
  });
  document.querySelectorAll('#rp-mpl [data-mpl]').forEach(b => {
    b.addEventListener('click', () => {
      setView('poem', { measuresPerLine: b.dataset.mpl === 'auto' ? 'auto' : Number(b.dataset.mpl) });
    });
  });
  document.querySelectorAll('[data-rp-switch]').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.rpSwitch;
      setView('poem', { [k]: !state.views.poem[k] });
    });
  });

  document.querySelectorAll('[data-ob-layout]').forEach(b => {
    b.addEventListener('click', () => setView('ost', { layout: b.dataset.obLayout }));
  });
  document.querySelectorAll('#ob-perpage [data-per-page]').forEach(b => {
    b.addEventListener('click', () => setView('ost', { measuresPerPage: Number(b.dataset.perPage) }));
  });
  $('ob-zoom').addEventListener('input', e => {
    $('ob-zoom-val').textContent = e.target.value + '%';
    setView('ost', { zoomPct: Number(e.target.value) });
  });
  document.querySelectorAll('[data-ob-switch]').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.obSwitch;
      setView('ost', { [k]: !state.views.ost[k] });
    });
  });


  /* ==================================================================
     POPOVERS
     ================================================================== */

  let openPop = null;
  let openPopTrigger = null;

  function closePopovers() {
    if (!openPop) return;
    openPop.classList.remove('open');
    if (openPopTrigger) openPopTrigger.classList.remove('open');
    openPop = null;
    openPopTrigger = null;
  }

  /* Above the trigger if it sits in the lower half of the screen (the
     transport), below it otherwise; nudged back on screen at the edges. */
  function togglePopover(pop, trigger) {
    if (openPop === pop) { closePopovers(); return; }
    closePopovers();
    pop.classList.add('open');
    trigger.classList.add('open');
    openPop = pop;
    openPopTrigger = trigger;

    const t = trigger.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = t.left + t.width / 2 - w / 2;
    left = clamp(left, 8, vw - w - 8);
    const above = t.top > vh / 2;
    const top = above ? t.top - h - 8 : t.bottom + 8;
    pop.style.left = Math.round(left) + 'px';
    pop.style.top = Math.round(clamp(top, 8, vh - h - 8)) + 'px';
  }

  function wirePopover(triggerId, popId, before) {
    const trigger = $(triggerId), pop = $(popId);
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      if (before) before();
      togglePopover(pop, trigger);
    });
  }

  wirePopover('layout-btn', 'layout-pop');
  wirePopover('tempo-btn', 'tempo-pop', syncTempoPop);
  wirePopover('leadin-btn', 'leadin-pop');
  wirePopover('mixer-btn', 'mixer-pop', renderMixer);
  document.querySelectorAll('.pane-view').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      syncViewPops();
      togglePopover($('view-' + btn.dataset.side + '-pop'), btn);
    });
  });

  document.addEventListener('pointerdown', e => {
    if (!openPop) return;
    if (openPop.contains(e.target) || (openPopTrigger && openPopTrigger.contains(e.target))) return;
    closePopovers();
  });
  /* A click inside a frame never reaches this document — but it does take
     focus away from this window, which is the signal to close. */
  window.addEventListener('blur', () => closePopovers());


  /* ==================================================================
     SHEETS
     ================================================================== */

  function openSheet(el) { closePopovers(); el.classList.add('open'); }
  function closeSheet(el) { el.classList.remove('open'); }
  function openSheetEl() { return document.querySelector('.sheet-backdrop.open'); }

  document.querySelectorAll('.sheet-backdrop').forEach(sheet => {
    sheet.addEventListener('click', e => { if (e.target === sheet) closeSheet(sheet); });
    sheet.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => closeSheet(sheet)));
  });


  /* ---- choosing a song for one side ---- */

  const picker = { side: 'poem', filter: 'poetry' };
  const pickerSheet = $('picker-sheet');

  function openPicker(side, tab) {
    picker.side = side;
    const sheet = pickerSheet.querySelector('.sheet');
    sheet.style.setProperty('--side', side === 'poem' ? 'var(--poem)' : 'var(--ost)');
    $('picker-heading').textContent = side === 'poem' ? 'Choose a poem' : 'Choose an ostinato';
    $('picker-app-name').textContent = APPS[side].name;
    $('picker-filter').hidden = side !== 'poem';
    $('link-status').textContent = '';
    $('link-status').className = 'status-msg';
    showPickerTab(tab || 'library');
    openSheet(pickerSheet);
    if (tab === 'link') setTimeout(() => $('link-input').focus(), 40);
  }

  function showPickerTab(tab) {
    $('picker-tab-library').classList.toggle('active', tab === 'library');
    $('picker-tab-link').classList.toggle('active', tab === 'link');
    $('picker-library').hidden = tab !== 'library';
    $('picker-link').hidden = tab !== 'link';
    if (tab === 'library') renderPickerList();
  }

  $('picker-tab-library').addEventListener('click', () => showPickerTab('library'));
  $('picker-tab-link').addEventListener('click', () => {
    showPickerTab('link');
    $('link-input').focus();
  });
  document.querySelectorAll('#picker-filter [data-filter]').forEach(b => {
    b.addEventListener('click', () => { picker.filter = b.dataset.filter; renderPickerList(); });
  });

  function songRow(song, current, onPick) {
    const row = document.createElement('button');
    row.className = 'song-row' + (current ? ' current' : '');
    const main = document.createElement('div');
    main.className = 'song-main';
    const title = document.createElement('div');
    title.className = 'song-title';
    title.textContent = song.title;
    const sub = document.createElement('div');
    sub.className = 'song-sub';
    const bits = [song.meter[0] + '/' + song.meter[1]];
    if (song.measures) bits.push(song.measures + (song.measures === 1 ? ' bar' : ' bars'));
    bits.push(song.bpm + ' BPM');
    if (song.preview) bits.push(song.preview);
    sub.textContent = bits.join(' · ');
    main.append(title, sub);
    row.appendChild(main);
    if (current) {
      const badge = document.createElement('span');
      badge.className = 'song-badge';
      badge.textContent = 'Open';
      row.appendChild(badge);
    }
    row.addEventListener('click', onPick);
    return row;
  }

  function renderPickerList() {
    const side = picker.side;
    const list = $('picker-list');
    const foot = $('picker-foot');
    list.innerHTML = '';
    document.querySelectorAll('#picker-filter [data-filter]').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === picker.filter);
    });

    const bridge = sides[side].bridge;
    if (!bridge) {
      list.innerHTML = '<div class="list-empty">' + APPS[side].name + ' is still opening…</div>';
      foot.textContent = '';
      return;
    }

    let songs = safe(() => bridge.listSongs(), []);
    if (side === 'poem') songs = songs.filter(s => s.kind === picker.filter);

    const current = state.songs[side];
    const scratch = songs.filter(s => s.sandbox);
    const mine = songs.filter(s => !s.sandbox && s.isCustom);
    const theirs = songs.filter(s => !s.sandbox && !s.isCustom);
    const group = (label, items) => {
      if (!items.length) return;
      const h = document.createElement('div');
      h.className = 'song-group-label';
      h.textContent = label;
      list.appendChild(h);
      items.forEach(song => {
        const isCurrent = !!current && current.src === 'library' && current.id === song.id;
        list.appendChild(songRow(song, isCurrent, () => {
          if (loadInto(side, { src: 'library', id: song.id })) closeSheet(pickerSheet);
        }));
      });
    };
    group('Sandbox — scratch work', scratch);
    group(side === 'poem' ? 'Yours' : 'Your ostinatos', mine);
    group(side === 'poem' ? 'Examples' : 'Starters', theirs);
    if (!songs.length) {
      list.innerHTML = '<div class="list-empty">Nothing here yet.</div>';
    }
    foot.textContent = 'This is your ' + APPS[side].name + ' library in this browser. Songs are opened, never changed. '
      + 'The sandbox is the scratch page from the app itself, and is shown as it is there right now.';
  }

  /* ---- a pasted link ---- */

  function decodeBase64Json(str) {
    try {
      const clean = String(str).trim().replace(/ /g, '+').replace(/\s/g, '');
      const bin = atob(clean);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
      return null;
    }
  }

  function encodeBase64Json(value) {
    const bytes = new TextEncoder().encode(JSON.stringify(value));
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  /* Which side a payload belongs to is read from its shape, not from the
     address it came from: an ostinato has tracks, a poem or rhythm has a
     poetry or rhythm state. Either app's link can be pasted anywhere. */
  function classify(key, data) {
    if (key === 'lesson') {
      return { error: 'That is a lesson link, which holds a whole set of songs. Open it in its app and share the one song you want.' };
    }
    if (!data || typeof data !== 'object') {
      return { error: 'That link could not be read — it may have been cut short when it was copied.' };
    }
    if (key === 'pair' || data.stand || data.pop) return { kind: 'pair', data: data };
    if (Array.isArray(data.tracks)) return { kind: 'ost', data: data };
    if (data.poetryState || data.rhythmState || Array.isArray(data.words)) return { kind: 'poem', data: data };
    return { error: 'That link opened, but it is not a poem or an ostinato.' };
  }

  function parseLink(text) {
    const raw = String(text || '').trim();
    if (!raw) return { error: 'Paste a link first.' };
    let url = null;
    try { url = new URL(raw); } catch (e) { url = null; }
    if (url) {
      const sources = [url.searchParams, new URLSearchParams(url.hash.replace(/^#/, ''))];
      for (const params of sources) {
        for (const key of ['pair', 'song', 'lesson']) {
          if (params.has(key)) return classify(key, key === 'lesson' ? {} : decodeBase64Json(params.get(key)));
        }
      }
      return { error: 'That link has no song in it. Make the link from the app’s Share & backup sheet.' };
    }
    const data = decodeBase64Json(raw);
    return data ? classify('song', data) : { error: 'That doesn’t look like a share link.' };
  }

  function openParsed(parsed, opts) {
    if (parsed.kind === 'pair') { openPairingData(parsed.data); return true; }
    const ok = loadInto(parsed.kind, { data: parsed.data });
    if (ok && opts && opts.from && opts.from !== parsed.kind) {
      toast('That link is ' + (parsed.kind === 'poem' ? 'a poem' : 'an ostinato') + ' — it is open on that side');
    }
    return ok;
  }

  $('link-open').addEventListener('click', () => {
    const parsed = parseLink($('link-input').value);
    const status = $('link-status');
    if (parsed.error) {
      status.textContent = parsed.error;
      status.className = 'status-msg error';
      return;
    }
    if (openParsed(parsed, { from: picker.side })) {
      $('link-input').value = '';
      closeSheet(pickerSheet);
    }
  });

  /* A link pasted anywhere on the page, outside a text field, goes
     straight to the side it belongs to. */
  document.addEventListener('paste', e => {
    const t = e.target;
    if (t && t.matches && t.matches('input, textarea')) return;
    const text = e.clipboardData && e.clipboardData.getData('text');
    if (!text || !/song=|pair=/.test(text)) return;
    const parsed = parseLink(text);
    if (parsed.error) { toast(parsed.error); return; }
    e.preventDefault();
    if (openParsed(parsed)) toast('Opened from the link');
  });

  document.querySelectorAll('[data-pick]').forEach(b => {
    b.addEventListener('click', () => openPicker(b.dataset.pick, b.dataset.tab));
  });


  /* ==================================================================
     PAIRINGS
     A poem and an ostinato kept together, with the tempo, intro and
     mixer that suit them. Stored by the Music Stand, apart from both apps.
     ================================================================== */

  const pairSheet = $('pair-sheet');

  function readPairings() {
    const all = readJSON(PAIRINGS_KEY);
    return all && typeof all === 'object' ? all : {};
  }

  function openPairSheet() {
    $('pair-name').value = state.name;
    $('pair-name').classList.remove('input-error');
    $('share-row').hidden = true;
    renderPairList();
    openSheet(pairSheet);
  }

  function renderPairList() {
    const list = $('pair-list');
    list.innerHTML = '';
    const all = readPairings();
    const ids = Object.keys(all).sort((a, b) => (all[b].savedAt || 0) - (all[a].savedAt || 0));
    if (!ids.length) {
      list.innerHTML = '<div class="list-empty">Nothing saved yet. Name the pairing above and save it to find it here next time.</div>';
      return;
    }
    ids.forEach(id => {
      const rec = all[id];
      const row = document.createElement('div');
      row.className = 'song-row' + (id === state.pairingId ? ' current' : '');
      row.setAttribute('role', 'button');
      row.tabIndex = 0;
      const main = document.createElement('div');
      main.className = 'song-main';
      const title = document.createElement('div');
      title.className = 'song-title';
      title.textContent = rec.title || 'Untitled pairing';
      const sub = document.createElement('div');
      sub.className = 'song-sub';
      const parts = SIDES.map(side => rec.songs && rec.songs[side] && rec.songs[side].title).filter(Boolean);
      sub.textContent = (parts.join(' + ') || 'Empty') + ' · ' + (rec.settings && rec.settings.bpm || '') + ' BPM';
      main.append(title, sub);

      const actions = document.createElement('div');
      actions.className = 'row-actions';
      const del = document.createElement('button');
      del.className = 'icon-btn danger';
      del.title = 'Delete this pairing';
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/></svg>';
      /* Two taps: the first turns the button into the question. */
      del.addEventListener('click', e => {
        e.stopPropagation();
        if (!del.classList.contains('confirm')) {
          del.classList.add('confirm');
          del.textContent = 'Delete?';
          setTimeout(() => { if (del.isConnected) renderPairList(); }, 3000);
          return;
        }
        const next = readPairings();
        delete next[id];
        writeJSON(PAIRINGS_KEY, next);
        if (state.pairingId === id) state.pairingId = null;
        renderPairList();
        saveSession();
      });
      actions.appendChild(del);

      row.append(main, actions);
      const open = () => { openPairingRecord(id, rec); closeSheet(pairSheet); };
      row.addEventListener('click', open);
      row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      list.appendChild(row);
    });
  }

  /* A pairing is a saved moment. A sandbox is scratch work that gets
     cleared and rewritten, so a pairing keeps the copy it had rather than
     the sandbox's id — which would open whatever the sandbox holds by the
     time the pairing is next used. The session itself stays live. */
  function pairingSongs() {
    const songs = JSON.parse(JSON.stringify(state.songs));
    SIDES.forEach(side => {
      const song = songs[side];
      if (song && isSandboxId(song.id)) { song.src = 'data'; song.id = null; }
    });
    return songs;
  }

  function applyPairing(songs, settings) {
    if (isPlaying()) stopPlayback();
    adoptSettings(settings);
    SIDES.forEach(side => {
      const song = songs && songs[side];
      if (song && (song.data || song.id)) {
        loadInto(side, song, { keepTempo: true, keepMutes: true });
      } else {
        clearSide(side);
      }
    });
    syncAll();
  }

  function openPairingRecord(id, rec) {
    state.pairingId = id;
    state.name = rec.title || '';
    applyPairing(rec.songs, rec.settings);
    saveSession();
    toast('Opened “' + (rec.title || 'pairing') + '”');
  }

  /* From a link: the songs travel whole, so they open as copies. */
  function openPairingData(data) {
    state.pairingId = null;
    state.name = typeof data.title === 'string' ? data.title : '';
    const songs = {};
    if (data.poem) songs.poem = { data: data.poem };
    if (data.ost) songs.ost = { data: data.ost };
    applyPairing(songs, data.settings);
    saveSession();
  }

  $('pair-save').addEventListener('click', () => {
    const name = $('pair-name').value.trim();
    if (!name) {
      $('pair-name').classList.add('input-error');
      $('pair-name').focus();
      toast('Give the pairing a name to save it');
      return;
    }
    const all = readPairings();
    /* Saving under a new name makes a new pairing; the same name updates
       the one that is open. */
    let id = state.pairingId;
    if (!id || !all[id] || all[id].title !== name) {
      id = Object.keys(all).find(k => all[k].title === name) || ('pair_' + Date.now());
    }
    all[id] = {
      title: name,
      savedAt: Date.now(),
      songs: pairingSongs(),
      settings: settingsRecord()
    };
    if (writeJSON(PAIRINGS_KEY, all)) {
      state.pairingId = id;
      state.name = name;
      refreshHeads();
      renderPairList();
      saveSession();
      toast('Saved “' + name + '”');
    }
  });

  $('pair-name').addEventListener('input', () => $('pair-name').classList.remove('input-error'));
  $('pair-name').addEventListener('keydown', e => { if (e.key === 'Enter') $('pair-save').click(); });

  $('pair-new').addEventListener('click', () => {
    if (isPlaying()) stopPlayback();
    state.name = '';
    state.pairingId = null;
    SIDES.forEach(clearSide);
    $('pair-name').value = '';
    saveSession();
    closeSheet(pairSheet);
  });

  $('pair-share').addEventListener('click', () => {
    if (!state.songs.poem && !state.songs.ost) {
      toast('Choose a poem or an ostinato first');
      return;
    }
    const payload = {
      stand: 1,
      title: $('pair-name').value.trim() || state.name || '',
      poem: state.songs.poem ? state.songs.poem.data : null,
      ost: state.songs.ost ? state.songs.ost.data : null,
      settings: settingsRecord()
    };
    const link = window.location.origin + window.location.pathname
      + '?pair=' + encodeURIComponent(encodeBase64Json(payload));
    const input = $('share-link');
    const status = $('share-status');
    input.value = link;
    $('share-row').hidden = false;
    copyText(link).then(ok => {
      status.textContent = ok ? 'Link copied — it carries both songs, so it works for anyone.' : 'Select the link above and copy it.';
      status.className = 'status-msg ' + (ok ? 'ok' : '');
      if (!ok) { input.focus(); input.select(); }
    });
  });

  /* navigator.clipboard is missing outright on plain http, so the throw
     has to land inside the try. */
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (e2) {
        return false;
      }
    }
  }

  $('pair-chip').addEventListener('click', openPairSheet);


  /* ==================================================================
     PRESENT MODE
     ================================================================== */

  let presenting = false;

  function setPresent(on) {
    presenting = !!on;
    document.body.classList.toggle('present', presenting);
    closePopovers();
    if (presenting && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!presenting && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    requestAnimationFrame(() => { applySplit(); scheduleSplit(); });
  }

  $('present-btn').addEventListener('click', () => setPresent(true));
  $('present-exit').addEventListener('click', () => setPresent(false));
  /* Leaving full screen with the browser's own Esc leaves present mode too. */
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && presenting) setPresent(false);
  });


  /* ==================================================================
     KEYS
     Also called by the frames, which pass their keys up — Space starts
     the Music Stand wherever focus happens to be.
     ================================================================== */

  function isSpace(k) { return k.code === 'Space' || k.key === ' ' || k.key === 'Spacebar'; }

  function handleKey(k) {
    if (isSpace(k)) {
      togglePlayback();
      return;
    }
    if (k.key === 'Escape') {
      const sheet = openSheetEl();
      if (sheet) closeSheet(sheet);
      else if (openPop) closePopovers();
      else if (presenting) setPresent(false);
      else if (isPlaying()) stopPlayback();
    }
  }

  document.addEventListener('keydown', e => {
    const t = e.target;
    const inField = t && t.matches && t.matches('input, textarea');
    if (inField) {
      if (e.key === 'Escape') t.blur();
      return;
    }
    if (isSpace(e) && t && t.matches && t.matches('button, [role="button"]')) {
      /* Space on a focused button presses it; only take it for play when
         the button is the play button itself or nothing is focused. */
      if (t.id !== 'play-btn') return;
    }
    if (isSpace(e)) e.preventDefault();
    handleKey(e);
  });

  $('play-btn').addEventListener('click', e => {
    e.preventDefault();
    togglePlayback();
  });
  /* A mouse click on Play leaves it focused, and Space would then press
     it a second time on keyup; clicking should not keep the focus. */
  $('play-btn').addEventListener('mouseup', () => $('play-btn').blur());


  /* ==================================================================
     TOAST
     ================================================================== */

  const toastEl = $('toast');
  let toastTimer = null;
  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }


  /* ==================================================================
     GO
     ================================================================== */

  function syncAll() {
    bpmInput.value = String(state.bpm);
    $('bpm-slider').value = String(state.bpm);
    $('tempo-pop-value').textContent = String(state.bpm);
    syncSequence();
    syncViewPops();
    renderMixer();
    refreshHeads();
    applyVolumes();
    applyArrangement();
  }

  /* A pairing link wins over the last session: following a link is a
     deliberate act. Either way the songs are queued, and each opens the
     moment its frame is ready. */
  const session = readJSON(SESSION_KEY);
  if (session) {
    adoptSettings(session);
    adoptLayout(session.layout);
    adoptViews(session.views);
  }

  let linkPair = null;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('pair')) {
      linkPair = decodeBase64Json(params.get('pair'));
      window.history.replaceState(null, document.title, window.location.pathname);
      if (!linkPair) toast('That pairing link could not be read');
    }
  } catch (e) {}

  if (linkPair) {
    openPairingData(linkPair);
  } else if (session) {
    state.name = typeof session.name === 'string' ? session.name : '';
    state.pairingId = session.pairingId || null;
    SIDES.forEach(side => {
      const song = session.songs && session.songs[side];
      if (song && (song.data || song.id)) loadInto(side, song, { keepTempo: true, keepMutes: true, quiet: true });
    });
  }

  syncAll();
  document.body.classList.add('booting');
  setTimeout(endBooting, 3000);        // never leave the scores hidden
  SIDES.forEach(bootFrame);
})();

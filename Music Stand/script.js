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
    /* How full the poem's voice is — 1, 2 or 3 deep. The complaint it
       answers is one only a stand can hear: on its own the poem is fine,
       and under an ostinato it is thin. Rhythm Poetry has the same
       switch, and this one is simply that switch reached from here. */
    wordsStrength: 1,
    mute: { poem: false, ost: false },
    /* per voice, keyed by the voice id the bridge gives. The steady beat
       starts muted: with an ostinato underneath, it is already there. */
    voiceMute: { poem: { beat: true }, ost: {} },
    vol: { poem: 100, ost: 100 },
    /* Editing in the panes. A mode of the stand rather than of a pane:
       what is being worked on is the pairing, and reaching for the other
       score is part of that. Kept with the session, not with the pairing
       — a pairing opened to be played should open ready to play. */
    editing: false,
    /* the split is kept per arrangement: a size chosen for two scores one
       above the other means nothing once they sit side by side */
    /* `auto` lets the stand choose one above the other or side by side,
       whichever draws the two scores larger — see FITTING TWO SCORES
       INTO ONE SCREEN. The split is kept per arrangement still: a size
       chosen for two scores one above the other means nothing once they
       sit side by side. */
    layout: { arrange: 'auto', first: 'poem', show: 'both',
              split: { stacked: 'auto', side: 'auto' } },
    views: {
      poem: { sizeMode: 'page', zoomPct: 100, measuresPerLine: 'auto',
              textPct: 100, lyricFont: 'rounded',
              showDots: true, showMeasureNumbers: true, followPlayback: true },
      /* `Lines` with the number left to the stand: in a pane the whole
         ostinato should be on show — a pane that turns its own pages
         under a stand that is already turning them is one page too many
         — and how many bars to a line is a question about the pane,
         which is the stand's to answer. */
      ost:  { layout: 'systems', measuresPerPage: 'auto', zoomPct: 100, showDots: true,
              lightNotes: true, showSyllables: false, showBarNumbers: true, showBeatNumbers: true }
    },
    /* { src: 'library' | 'data', id, title, data, edited?, origin? } —
       `data` is always the latest snapshot and `id` only means something
       while src is 'library'. A song edited here is no longer the library
       song, so it becomes 'data': `origin` remembers where it came from,
       which is all that is needed to put it back. */
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
      wordsStrength: state.wordsStrength,
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
      editing: state.editing,
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
    if ([1, 2, 3].indexOf(src.wordsStrength) !== -1) state.wordsStrength = src.wordsStrength;
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
    if (['auto', 'side', 'stacked'].indexOf(src.arrange) !== -1) L.arrange = src.arrange;
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
    upgradeOstDefault(src && src.ost);
  }

  /* The ostinato used to be shown in pages, four bars at a time, and a
     saved session still says so. A default that has been replaced should
     not outlive it — but a choice someone made should. So only the old
     default itself is moved on: pages, four to a page, and nothing else. */
  function upgradeOstDefault(saved) {
    if (!saved) return;
    if (saved.layout === 'pages' && saved.measuresPerPage === 4) {
      state.views.ost.layout = 'systems';
      state.views.ost.measuresPerPage = 'auto';
    }
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
    forgetShapes();
    bridge.onHostKey = handleKey;
    bridge.onEdit = () => paneEdited(side);
    /* A badge pressed in a pane. Not an edit — the piece is untouched;
       what moved is this stand's mixer, so that is all that is written
       down. The pane has already changed its own badge. */
    bridge.onVoiceMute = (id, muted) => {
      const k = String(id);
      if (muted) state.voiceMute[side][k] = true;
      else delete state.voiceMute[side][k];
      renderMixer();
      saveSession();
    };
    attachSide(side);
    safe(() => bridge.setView(viewFor(side)));
    safe(() => { bridge.editable = state.editing; });
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
                            title: entry.title || '', data: entry.data || null,
                            edited: !!entry.edited, origin: entry.origin || null };
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
      data: safe(() => s.bridge.snapshot(), entry.data || null),
      /* An edited song is opened here again every time the page is — from
         the session, or from a pairing that kept it. It has to come back
         still wearing both, or it would look like the library version and
         the way back to that version would be lost. */
      edited: !!entry.edited,
      origin: entry.origin || null
    };
    s.info = info;

    if (!o.keepMutes) resetVoiceMutes(side, info);
    if (!o.keepTempo && (side === 'poem' || !state.songs.poem)) setBpm(info.bpm, { quiet: true });

    s.empty.hidden = true;
    requestAnimationFrame(() => safe(() => s.bridge.refit()));
    if (side === 'poem') resplitWhenFontsSettle('poem');

    refreshHeads();
    renderMixer();
    pushVoiceMutes(side);
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

  /* ==================================================================
     EDITING IN THE PANES
     The frames hold the whole app, and an app in a frame cannot reach
     its own storage (each swaps localStorage for a read-through layer on
     the way in), so a score edited here is edited here and nowhere else.
     That is the whole of the guarantee: the poem in Rhythm Poetry and the
     ostinato in Ostinato Builder are not touched, and cannot be. What the
     Music Stand keeps is the edited version, and a pairing saves it whole.
     ================================================================== */

  function setEditing(on) {
    on = !!on;
    if (on === state.editing) return;
    state.editing = on;
    document.body.classList.toggle('editing', on);
    $('edit-btn').setAttribute('aria-pressed', String(on));
    /* Editing while the music runs would be writing under the plan the
       conductor is already reading from. */
    if (on && isPlaying()) stopPlayback();
    SIDES.forEach(side => {
      const b = sides[side].bridge;
      if (b) safe(() => { b.editable = on; });
    });
    /* Controls appear on the score and the score changes size with them. */
    SIDES.forEach(side => safe(() => sides[side].bridge && sides[side].bridge.refit()));
    scheduleSplit();
    saveSession();
  }

  /* A pane says its score came out different. The song here is now that
     score: the snapshot is taken again, and a song that came from a
     library stops being the library's — it keeps where it came from so it
     can be put back, but it is a copy from this moment on. Left as
     'library' it would be reopened from the library the next time that
     app saved anything in another tab, and the edit would vanish. */
  function paneEdited(side) {
    const s = sides[side], song = state.songs[side];
    if (!s.bridge || !song) return;
    if (isPlaying()) stopPlayback();

    if (!song.edited) {
      song.edited = true;
      if (song.src === 'library' && song.id) song.origin = { src: 'library', id: song.id };
      song.src = 'data';
      song.id = null;
    }
    s.stale = false;
    const info = safe(() => s.bridge.info());
    if (info) { s.info = info; song.title = info.title; }
    song.data = safe(() => s.bridge.snapshot(), song.data);

    refreshHeads();
    renderMixer();
    scheduleSplit();
    saveSession();
  }

  /* Back to the version the score was opened from. Only ever offered for
     a song that came from a library — one that arrived by link or in a
     pairing has no other version to go back to, so its chip only says
     that it has been edited. */
  function revertSide(side) {
    const song = state.songs[side];
    if (!song || !song.origin) return;
    const from = song.origin;
    if (loadInto(side, { src: from.src, id: from.id }, { keepTempo: true, keepMutes: true })) {
      toast('Back to the saved ' + APPS[side].noun);
    } else {
      toast('That ' + APPS[side].noun + ' is no longer in the library');
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

      /* Said in the heading rather than left to be noticed: from here on
         this is not the song that is in the app, and anyone coming back
         to the stand later needs to know that before they wonder why. */
      const song = state.songs[side];
      const chip = $(side + '-edited');
      const revertable = !!(song && song.edited && song.origin);
      chip.hidden = !(song && song.edited);
      chip.classList.toggle('revertable', revertable);
      chip.classList.remove('confirm');
      chip.textContent = 'Edited here';
      chip.title = revertable
        ? 'Changed on the stand. The ' + APPS[side].noun + ' in '
          + APPS[side].name + ' is untouched — press to go back to it.'
        : 'Changed on the stand. Save the pairing to keep these changes.';

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
     THE SOUND LIBRARY
     ------------------------------------------------------------------
     The stand keeps its own copy of the shared instrument engine — the
     same one Ostinato Builder plays and Rhythm Poetry now sounds its
     rhythm on — so it can let a sound be heard without a frame having to
     make it. Today that is the fourteen percussion voices; the apps that
     join this stand later bring pitched instruments with them, and they
     go here, which is why what follows asks the library what it holds
     rather than naming anything.

     It is not a second way of playing the music. A pane plays its own
     score, through the same context, on the same clock — see attachAudio.
     This is for the stand's own sounds: an instrument heard in a picker
     before it is chosen, and whatever comes next.
     ================================================================== */

  const VI = window.VirtualInstruments || null;
  let library = null;

  /* Built on the stand's context, straight on to the master — a preview
     is the stand speaking, not either side, so neither side's volume and
     neither side's gate should touch it. */
  function sounds() {
    if (!VI) return null;
    if (!library) {
      const ctx = ensureAudio();
      if (!ctx) return null;
      library = VI.createKit({ audioContext: ctx, destination: audio.master, volume: 0.9 });
      library.unlock();
    }
    return library;
  }

  /* One instrument, now. `id` is the library's own — 'tom', 'shaker'. */
  function previewSound(id) {
    const k = sounds();
    if (k && k.has(id)) k.play(id, {});
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
    const opts = { holdMs: ev.hold * play.spb * 1000, style: state.wordsSound,
                   strength: state.wordsStrength };
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

  /* Whether the ostinato's instruments may be changed from here. The app
     answers, not this file: a lesson can lock the instruments, and a
     locked line has to stay locked wherever it is being looked at.
     Asked once a render, because every row asks. */
  let swapOffered = false;

  function refreshSwapOffered() {
    const b = sides.ost.bridge;
    if (!b || typeof b.instruments !== 'function' || !state.songs.ost) {
      swapOffered = false;
      return;
    }
    const got = safe(() => b.instruments(null), null);
    swapOffered = !!(got && got.editable && got.items && got.items.length > 1);
  }

  function canSwapInstrument(side) { return side === 'ost' && swapOffered; }

  /* One voice, as it reads in the mixer: a picture and a name. The
     picture is the instrument and the name is the switch — the same two
     things, in the same order, as the track head in Ostinato Builder, so
     a line muted in a pane and a line muted here are plainly the one
     line. A voice with no picture (the poem's two) is only the switch. */
  function voiceRow(side, voice) {
    const row = document.createElement('div');
    row.className = 'voice-row';

    const muted = !!state.voiceMute[side][String(voice.id)];

    if (voice.image) {
      const pic = document.createElement(canSwapInstrument(side) ? 'button' : 'div');
      pic.className = 'voice-pic' + (muted ? ' muted' : '');
      const img = document.createElement('img');
      img.src = voice.image;
      img.alt = '';
      pic.appendChild(img);
      if (canSwapInstrument(side)) {
        pic.title = 'Change this instrument';
        pic.setAttribute('aria-label', 'Change ' + voice.label);
        pic.addEventListener('click', () => openInstrumentSheet(voice.id));
      } else {
        pic.title = voice.label;
      }
      row.appendChild(pic);
    }

    const btn = document.createElement('button');
    btn.className = 'voice-btn';
    btn.classList.toggle('muted', muted);
    const label = document.createElement('span');
    label.className = 'voice-label';
    label.textContent = voice.label;
    const st = document.createElement('span');
    st.className = 'voice-state';
    st.textContent = muted ? 'Off' : 'On';
    btn.append(label, st);
    btn.title = (muted ? 'Turn on ' : 'Turn off ') + voice.label;
    btn.addEventListener('click', () => setVoiceMute(side, voice.id, !muted));
    row.appendChild(btn);

    return row;
  }

  /* The one place a voice is muted, wherever the asking came from — the
     mixer here or the badge on the instrument in the pane. The pane is
     told either way, so the two never show different answers. */
  function setVoiceMute(side, id, muted) {
    const k = String(id);
    if (muted) state.voiceMute[side][k] = true;
    else delete state.voiceMute[side][k];
    pushVoiceMute(side, id, muted);
    renderMixer();
    saveSession();
  }

  function pushVoiceMute(side, id, muted) {
    const b = sides[side].bridge;
    if (b && typeof b.setVoiceMuted === 'function') safe(() => b.setVoiceMuted(id, muted));
  }

  /* After a song is opened, the whole picture at once: the pane has just
     seeded itself from the piece's own mutes, and this puts back anything
     the stand is keeping on top of them (a pairing's, a session's). */
  function pushVoiceMutes(side) {
    const info = sides[side].info;
    if (!info) return;
    (info.voices || []).forEach(v => {
      pushVoiceMute(side, v.id, !!state.voiceMute[side][String(v.id)]);
    });
  }

  function renderMixer() {
    refreshSwapOffered();
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
        info.voices.forEach(v => box.appendChild(voiceRow(side, v)));
      }
      $('vol-' + side).value = String(state.vol[side]);
    });
    $('words-tone').classList.toggle('active', state.wordsSound === 'tone');
    $('words-drum').classList.toggle('active', state.wordsSound === 'drum');
    syncStrength();
    $('mixer-ost-note').hidden = !(state.songs.ost && canSwapInstrument('ost'));
  }

  /* What x2 means depends on which sound is playing, so it is written
     out rather than left as a number to be tried. The words are Rhythm
     Poetry's own — one switch, said the same way in both places. */
  const STRENGTH_WORDS = {
    tone: ['One voice on every note.',
           'The note, and the octave above it.',
           'The note, and the two octaves above it.'],
    drum: ['Tom and shaker together.',
           'Tom, shaker and snare.',
           'Tom, shaker, snare and claves.']
  };

  function syncStrength() {
    document.querySelectorAll('#mixer-pop [data-strength]').forEach(b => {
      b.classList.toggle('active', Number(b.dataset.strength) === state.wordsStrength);
    });
    $('strength-note').textContent =
      STRENGTH_WORDS[state.wordsSound][state.wordsStrength - 1];
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
  document.querySelectorAll('#mixer-pop [data-strength]').forEach(b => {
    b.addEventListener('click', () => {
      state.wordsStrength = Number(b.dataset.strength);
      syncStrength();
      saveSession();
    });
  });

  /* ---- changing an instrument ----
     The kit is the app's, and so is the answer about which of it this
     piece may use — the stand only draws it and plays the one tapped, so
     an instrument can be heard before it is taken. What comes back is an
     edit like any other made in a pane: the ostinato on this stand
     becomes its own copy, and the one in the library is not touched. */
  const instrumentSheet = $('instrument-sheet');
  let pickingVoice = null;

  function openInstrumentSheet(voiceId) {
    const b = sides.ost.bridge;
    if (!b || typeof b.instruments !== 'function') return;
    const got = safe(() => b.instruments(voiceId), null);
    if (!got || !got.editable || !got.items || !got.items.length) return;

    pickingVoice = voiceId;
    const grid = $('instrument-grid');
    grid.innerHTML = '';
    got.items.forEach(item => {
      const card = document.createElement('button');
      card.className = 'instrument-card' + (item.id === got.current ? ' selected' : '');
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.alt || '';
      const name = document.createElement('span');
      name.textContent = item.label;
      card.append(img, name);
      card.addEventListener('click', () => chooseInstrument(item.id));
      grid.appendChild(card);
    });
    instrumentSheet.querySelector('.sheet').style.setProperty('--side', 'var(--ost)');
    openSheet(instrumentSheet);
  }

  function chooseInstrument(id) {
    const b = sides.ost.bridge;
    if (!b) return;
    previewSound(id);                       // heard as it is taken
    const info = safe(() => b.setInstrument(pickingVoice, id), null);
    if (!info) return;
    pickingVoice = null;
    closeSheet(instrumentSheet);
    /* The stand asked for the change, so the pane will not report it —
       nothing in there was reached for. It is still an edit. */
    paneEdited('ost');
    togglePopover($('mixer-pop'), $('mixer-btn'));
  }

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

  /* Below this a screen is a column and nothing else will do, whatever
     anyone has asked for: two scores side by side on a phone are two
     scores nobody can read. */
  const NARROW_W = 640;

  /* What is actually on screen. With the arrangement left to the stand
     this is the solver's answer, so it cannot be read back off the
     setting — and everything that measures the room needs the answer,
     not the setting. */
  let liveArrange = 'stacked';

  function effectiveArrange() { return liveArrange; }

  function isNarrow() { return window.innerWidth <= NARROW_W; }

  function applyArrangeAttrs(arrange) {
    if (isNarrow()) arrange = 'stacked';
    liveArrange = arrange;
    document.body.classList.toggle('narrow', isNarrow());
    panesEl.dataset.arrange = arrange;
    document.body.classList.toggle('arrange-side', arrange === 'side');
    divider.setAttribute('aria-orientation', arrange === 'side' ? 'vertical' : 'horizontal');
  }

  function applyArrangement() {
    /* Left to the stand, the arrangement on screen stands until the
       solver says otherwise — applySplit() is a moment away, and
       flicking to a default in between would be a visible twitch. */
    applyArrangeAttrs(state.layout.arrange === 'auto' ? liveArrange : state.layout.arrange);
    const arrange = effectiveArrange();
    panesEl.dataset.first = state.layout.first;
    panesEl.dataset.show = state.layout.show;

    $('arrange-auto').classList.toggle('active', state.layout.arrange === 'auto');
    $('arrange-stacked').classList.toggle('active', state.layout.arrange === 'stacked');
    $('arrange-side').classList.toggle('active', state.layout.arrange === 'side');
    $('first-poem').classList.toggle('active', state.layout.first === 'poem');
    $('first-ost').classList.toggle('active', state.layout.first === 'ost');
    document.querySelectorAll('#layout-pop [data-show]').forEach(b => {
      b.classList.toggle('active', b.dataset.show === state.layout.show);
    });
    $('split-auto').classList.toggle('active', currentSplit() === 'auto');
    $('split-even').classList.toggle('active', currentSplit() === 0.5);
    applySplit();
  }

  /* ==================================================================
     FITTING TWO SCORES INTO ONE SCREEN
     ------------------------------------------------------------------
     The hard part of a stand is not sharing the room out. It is that a
     score has a shape, and the room has a shape, and they are usually
     not the same shape: a band of eight instruments over one bar is a
     tall, narrow thing, and a poem is a long, thin one, and a screen is
     neither. Giving a tall score a wide, short band leaves most of the
     band empty however the line between the panes is moved.

     So a score is not asked how big it is. It is asked what shapes it
     can be — `sizing().layouts`, one entry per number of bars to a line
     — and the stand chooses. Ostinato Builder answers with its Lines
     layout (bars across, then again underneath); Rhythm Poetry with its
     bars to a line. Three things are chosen together, because each one
     changes what the others are worth:

        arrangement  one above the other, or side by side
        shape        how many bars to a line, for each score
        split        where the line between the panes goes

     Every combination is tried and scored by the size of the SMALLER of
     the two scores — the one that decides whether a class at the back of
     the room can read this. Everything is worked out from the box the
     panes share, not measured off the frames, so an arrangement can be
     judged without first being committed to and undone.

     This is the part that has to hold when a third app arrives. Nothing
     here knows what a poem or an ostinato is: an app publishes a menu of
     shapes and is handed a box, and that is the whole of the contract.
     ================================================================== */

  /* The room the two panes share along the split, less the line between. */
  function splitRoom() {
    return paneGeometry(effectiveArrange()).room;
  }

  function paneHeadHeight() {
    const head = sides.poem.pane.querySelector('.pane-head');
    return (head && head.offsetParent ? head.offsetHeight : 0) + 2;
  }

  /* The two boxes an arrangement would make, without making it.
       room   the length the two panes share, along the split
       cross  each pane's other side, which neither of them shares
       chrome what each pane's heading takes off the split */
  function paneGeometry(arrange) {
    const cs = getComputedStyle(panesEl);
    const W = panesEl.clientWidth  - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const H = panesEl.clientHeight - parseFloat(cs.paddingTop)  - parseFloat(cs.paddingBottom);
    const side = arrange === 'side';
    /* The line between the panes is the same thickness whichever way it
       lies, and the one that is *not* its thickness is the whole width of
       the stand — so reading the wrong one takes the entire room away and
       the arrangement being judged can never win. Its thickness is simply
       the smaller of the two, whatever it is lying as right now. */
    const gap = Math.min(divider.offsetWidth, divider.offsetHeight);
    const head = paneHeadHeight();
    return {
      side: side,
      room:  Math.max(1, (side ? W : H) - gap),
      cross: Math.max(1, side ? H - head : W),
      chrome: side ? 0 : head
    };
  }

  /* One score's demand on the split, as a function of a common scale s,
     and the scale it is actually drawn at then — it stops growing once it
     has filled the side it does not share. */
  function sizeCurve(sz, geo) {
    const along  = geo.side ? sz.w : sz.h,    padAlong  = geo.side ? sz.padW : sz.padH;
    const across = geo.side ? sz.h : sz.w,    padAcross = geo.side ? sz.padH : sz.padW;
    const cap = Math.min(sz.maxScale, Math.max(0.05, (geo.cross - padAcross) / across));

    if (sz.mode === 'fixed') {
      return { size: () => along * sz.fixedScale + padAlong, drawn: () => sz.fixedScale };
    }
    if (sz.mode === 'fit' && !geo.side) {
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

  /* Whether the shape of a score is the stand's to choose. Asking for
     `auto` is what hands it over; naming a number in the View menu takes
     it back, and then there is one shape and it is the user's. */
  function shapeFree(side) {
    return side === 'poem'
      ? state.views.poem.measuresPerLine === 'auto'
      : state.views.ost.measuresPerPage === 'auto' && state.views.ost.layout === 'systems';
  }

  /* The shapes a score offers, as whole sizings. A score that offers
     none, or whose shape is not ours to choose, has exactly one: the one
     it is already in. */
  function shapeMenu(side, sz) {
    if (!shapeFree(side) || !sz.layouts || !sz.layouts.length) {
      return [Object.assign({ n: null }, sz)];
    }
    return sz.layouts.map(L => Object.assign({}, sz, { n: L.n, w: L.w, h: L.h }));
  }

  /* The largest common scale both fit at, the poem's share of the room
     there, and how big the smaller of the two is then drawn — which is
     what every choice here is judged by. */
  function solveSplit(cp, co, geo) {
    const chrome = geo.chrome * 2;
    const total = s => cp.size(s) + co.size(s) + chrome;
    const room = geo.room;
    let lo = 0.05, hi = 1.8, s;
    if (total(hi) <= room) s = hi;
    else if (total(lo) > room) {
      /* even tiny does not fit: share by what each asks for at that size */
      return { least: 0, share: (cp.size(lo) + geo.chrome) / total(lo) };
    } else {
      for (let i = 0; i < 28; i++) {
        const mid = (lo + hi) / 2;
        if (total(mid) <= room) lo = mid; else hi = mid;
      }
      s = lo;
    }
    const spare = Math.max(0, room - total(s));
    return {
      least: Math.min(cp.drawn(s), co.drawn(s)),
      share: (cp.size(s) + geo.chrome + spare / 2) / room
    };
  }

  /* Which arrangements are on the table. A narrow screen is a column and
     that is that; otherwise it is the user's, unless they have left it to
     the stand. */
  function arrangeChoices() {
    if (window.innerWidth <= NARROW_W) return ['stacked'];
    return state.layout.arrange === 'auto' ? ['stacked', 'side'] : [state.layout.arrange];
  }

  /* Near enough is a tie, and a tie must not make the screen jump about:
     it goes to what is already on screen, and then to the longer line,
     which is the choice a reader would make. */
  const TIE = 0.02;

  function better(cand, best) {
    if (!best) return true;
    if (cand.least > best.least * (1 + TIE)) return true;
    if (cand.least < best.least * (1 - TIE)) return false;
    const now = effectiveArrange();
    if (cand.arrange !== best.arrange) return cand.arrange === now;
    if (cand.poemN !== best.poemN) return (cand.poemN || 0) > (best.poemN || 0);
    return (cand.ostN || 0) > (best.ostN || 0);
  }

  function solveLayout() {
    if (!state.songs.poem || !state.songs.ost) return null;
    const sp = sizingOf('poem'), so = sizingOf('ost');
    if (!sp || !so) return null;

    const poems = shapeMenu('poem', sp), osts = shapeMenu('ost', so);
    let best = null;
    arrangeChoices().forEach(arrange => {
      const geo = paneGeometry(arrange);
      poems.forEach(P => {
        const cp = sizeCurve(P, geo);
        osts.forEach(O => {
          const r = solveSplit(cp, sizeCurve(O, geo), geo);
          const cand = { arrange: arrange, poemN: P.n, ostN: O.n,
                         least: r.least, share: clamp(r.share, 0.15, 0.85) };
          if (better(cand, best)) best = cand;
        });
      });
    });
    return best;
  }

  /* The shape each score was promised. Asked for only when it changes —
     a setView rebuilds the score in the frame, and rebuilding it on every
     re-fit would make a drag of the line into a slideshow. */
  const shownShape = { poem: null, ost: null };

  function askForShape(side, n) {
    if (n == null || shownShape[side] === n) return;
    const b = sides[side].bridge;
    if (!b) return;
    shownShape[side] = n;
    /* Sent, never written down: the stand's own view keeps saying `auto`,
       so the user's setting survives a shape being chosen for them. */
    safe(() => b.setView(side === 'poem'
      ? { measuresPerLine: n }
      : { layout: 'systems', measuresPerPage: n }));
  }

  function forgetShapes() { shownShape.poem = null; shownShape.ost = null; }

  /* ---- a narrow screen ----
     Nothing is shared, so there is nothing to solve: each score is drawn
     as large as the width allows and given exactly the height that takes,
     and the column scrolls. The shape is chosen on the same principle as
     everywhere else, only against one dimension — the widest line that
     still comes out big enough to read, which on a phone usually means
     one bar to a line.

     The height has to be worked out here rather than left to the frame:
     a frame in a column has no height of its own to fit into, so it
     would fit to whatever it was last given and never grow. */
  const COMFORT = 1;   /* big enough; past this, prefer fewer lines */

  function widthFit(sz, w) {
    return Math.max(0.05, Math.min(sz.maxScale, (w - sz.padW) / sz.w));
  }

  function narrowShape(side, sz, w) {
    let best = null;
    shapeMenu(side, sz).forEach(S => {
      const s = widthFit(S, w);
      /* the widest line that still reads: past COMFORT the extra size is
         worth less than the scrolling it costs */
      const score = Math.min(s, COMFORT);
      if (!best || score > best.score + 1e-4
               || (Math.abs(score - best.score) <= 1e-4 && (S.n || 0) > (best.n || 0))) {
        best = { n: S.n, score: score, scale: s, h: S.h * s + S.padH };
      }
    });
    return best;
  }

  function applyNarrow() {
    const headH = paneHeadHeight();
    SIDES.forEach(side => {
      const pane = sides[side].pane;
      if (!state.songs[side]) { pane.style.height = ''; return; }
      const sz = sizingOf(side);
      if (!sz) { pane.style.height = ''; return; }
      const shape = narrowShape(side, sz, sides[side].frame.clientWidth);
      if (!shape) { pane.style.height = ''; return; }
      askForShape(side, shape.n);
      /* Read the score again, because asking for a shape changed it: a
         poem set to fewer bars a line re-flows its words, and the height
         that follows from the shape we asked for is not the height of
         the shape we got. Measuring the promise instead of the thing was
         worth 140% of the pane's width. */
      const now = sizingOf(side) || sz;
      const w = sides[side].frame.clientWidth;
      pane.style.height = Math.ceil(now.h * widthFit(now, w) + now.padH + headH) + 'px';
    });
  }

  function clearNarrow() {
    SIDES.forEach(side => { sides[side].pane.style.height = ''; });
  }

  /* Put the answer on the screen. The arrangement is an attribute and the
     split is a number, so neither reloads a frame; the shapes are asked
     for last, because a frame that has just been handed a new shape is
     about to re-fit anyway. */
  function applySplit() {
    if (isNarrow()) { applyNarrow(); return; }
    clearNarrow();
    let split = currentSplit();
    if (split === 'auto' || state.layout.arrange === 'auto') {
      const best = solveLayout();
      if (best) {
        if (state.layout.arrange === 'auto') applyArrangeAttrs(best.arrange);
        if (split === 'auto') split = best.share;
        askForShape('poem', best.poemN);
        askForShape('ost', best.ostN);
      }
    }
    if (split === 'auto') split = 0.5;
    panesEl.style.setProperty('--split', String(clamp(split, 0.12, 0.88)));
  }

  /* Each app re-fits on its own resize, a moment after ours, and the poem
     may then choose a different number of bars to a line — which changes
     what it asks for. So the auto size is worked out once the apps have
     settled, and once more after that answer has settled in turn. */
  let splitTimer = null, settleTimer = null;

  /* Fit each score to the box it has just been given. A frame does notice
     its own size changing, but only after its own delay, and the stand
     works out the next answer from what the frames report — so waiting
     for them means solving against sizes that are one step out of date.
     Asking is cheap and it is exact. */
  function refitAll() {
    SIDES.forEach(side => {
      if (sides[side].bridge && state.songs[side]) safe(() => sides[side].bridge.refit());
    });
  }

  function scheduleSplit() {
    clearTimeout(splitTimer);
    clearTimeout(settleTimer);
    splitTimer = setTimeout(() => {
      applySplit();
      refitAll();
      /* Round again: a score re-fitted into its new box may be a
         different size — a poem re-flows its words — and the room is
         shared out from what the scores are, not what they were. */
      settleTimer = setTimeout(() => {
        applySplit();
        refitAll();
        setTimeout(endBooting, 350);
      }, 450);
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

  $('arrange-auto').addEventListener('click', () => setLayout({ arrange: 'auto' }));
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
    const solved = solveLayout();
    const current = currentSplit() === 'auto'
      ? (solved ? solved.share : 0.5)
      : currentSplit();
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

  /* The view as the frame should hear it. `auto` is a word the stand says
     to itself — the app is told a number, by askForShape(), once one has
     been worked out. Sent through, it would land as a guess. */
  function viewFor(side) {
    const out = Object.assign({}, state.views[side]);
    if (side === 'ost' && out.measuresPerPage === 'auto') delete out.measuresPerPage;
    return out;
  }

  function setView(side, patch) {
    Object.assign(state.views[side], patch);
    const b = sides[side].bridge;
    if (b) safe(() => b.setView(viewFor(side)));
    /* A view the user chose outranks a shape the stand chose for them,
       so the next solve starts again rather than assuming what is up. */
    forgetShapes();
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
    const obBlocks = ob.layout === 'pages' || ob.layout === 'systems';
    $('ob-perpage-section').hidden = !obBlocks;
    $('ob-zoom-section').hidden = obBlocks;
    $('ob-perpage-label').textContent = ob.layout === 'systems' ? 'Bars on a line' : 'Bars on a page';
    document.querySelectorAll('#ob-perpage [data-per-page]').forEach(b => {
      const v = b.dataset.perPage === 'auto' ? 'auto' : Number(b.dataset.perPage);
      b.classList.toggle('active', v === ob.measuresPerPage);
    });
    /* Auto is only ever the stand's answer, and the stand only answers
       when it is drawing both scores. */
    $('ob-perpage-note').hidden = ob.measuresPerPage !== 'auto';
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
    b.addEventListener('click', () => setView('ost', {
      measuresPerPage: b.dataset.perPage === 'auto' ? 'auto' : Number(b.dataset.perPage)
    }));
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
    /* Present mode is the two scores and nothing else, and the way back
       out of editing is in the bar it hides. Showing and editing are two
       different jobs anyway. */
    if (presenting) setEditing(false);
    document.body.classList.toggle('present', presenting);
    closePopovers();
    if (presenting && document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (!presenting && document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    requestAnimationFrame(() => { applySplit(); scheduleSplit(); });
  }

  $('edit-btn').addEventListener('click', () => setEditing(!state.editing));

  /* Two taps to undo a piece of work: the first turns the chip into the
     question, the way the pairing list's delete does. */
  SIDES.forEach(side => {
    const chip = $(side + '-edited');
    chip.addEventListener('click', () => {
      const song = state.songs[side];
      if (!song || !song.origin) return;
      if (!chip.classList.contains('confirm')) {
        chip.classList.add('confirm');
        chip.textContent = 'Undo my changes?';
        setTimeout(() => { if (chip.isConnected) refreshHeads(); }, 3000);
        return;
      }
      revertSide(side);
    });
  });

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

  /* Before the frames are booted, so each connects already knowing. */
  if (session && session.editing === true) {
    state.editing = true;
    document.body.classList.add('editing');
    $('edit-btn').setAttribute('aria-pressed', 'true');
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

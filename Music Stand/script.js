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
    /* What is open: the sandbox (pairingId null) or a pairing from the
       stand's library. `name` is that pairing's title; `shared` and `book`
       say it came from someone else, and so is never saved into; and
       `autoSave` is the switch on the top bar — off when a pairing is
       opened, as in both apps. See PAIRINGS below. */
    name: '',
    pairingId: null,
    shared: false,
    book: '',
    autoSave: false,
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
              showDots: true, easyMode: false, showMeasureNumbers: true, followPlayback: true },
      /* `Lines` with the number left to the stand: in a pane the whole
         ostinato should be on show — a pane that turns its own pages
         under a stand that is already turning them is one page too many
         — and how many bars to a line is a question about the pane,
         which is the stand's to answer. */
      ost:  { layout: 'systems', measuresPerPage: 'auto', zoomPct: 100, showDots: true, easyMode: false,
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

  /* The session is what is on the stand right now, saved or not. Every
     save of it also saves the work where it belongs — into the sandbox,
     or into the open pairing while auto-save is on (saveWorking). */
  let sessionTimer = null;
  function saveSession() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(flushSession, 250);
  }
  function flushSession() {
    clearTimeout(sessionTimer);
    writeJSON(SESSION_KEY, sessionRecord());
    saveWorking();
    refreshLibraryChrome();
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
      v: 2,
      name: state.name,
      pairingId: state.pairingId,
      autoSave: state.autoSave,
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
    /* An instrument picture pressed in the ostinato pane: the same
       picker the mixer's pictures open. */
    if (side === 'ost') bridge.onInstrumentPick = voice => openInstrumentSheet(voice, false);
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
    s.from = src === 'library' ? libraryEntry(side, entry.id) : null;
    /* A copy kept in a pairing comes back from the app a little tidied
       (the app fills in what the link left out). That is the same piece,
       so the stored copy takes the tidied form quietly — otherwise the
       pairing would look changed the moment it was opened. */
    if (o.settle) settleStored(o.settle, side);

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

  /* What the app's library says about a song opened from it — whether it
     is the app's sandbox, a song shared with this browser, or one from a
     Teacher Library book — for the pane's heading. Read once, when the
     song is opened. */
  function libraryEntry(side, id) {
    const b = sides[side].bridge;
    const list = b ? safe(() => b.listSongs(), []) : [];
    return list.find(song => song.id === id) || null;
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
    syncEditSwitch();
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
    sides[side].from = null;
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
      const src = sourceOf(side);
      $(side + '-src').textContent = src.word;
      sides[side].pane.querySelector('.pane-title').title = src.title
        || ('Choose ' + (side === 'poem' ? 'a poem' : 'an ostinato'));

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

    refreshLibraryChrome();
  }

  /* Where a pane's song came from, in a word for the heading and a
     sentence for its title: the same words the apps' own song chips use.
     A library song is live — edited in its app, it opens edited here; a
     copy is the stand's own and does not follow the app. */
  function sourceOf(side) {
    const song = state.songs[side];
    const name = APPS[side].name;
    if (!song) return { word: '', title: '' };
    if (song.src === 'library') {
      const e = sides[side].from;
      if (isSandboxId(song.id)) {
        return { word: 'Sandbox', title: name + '’s sandbox, as it is there now. Change it in ' + name + ' and it changes here.' };
      }
      if (e && e.book) return { word: e.book, title: 'From the “' + e.book + '” book of the Teacher Library, in ' + name + '.' };
      if (e && e.received) return { word: 'Shared', title: 'Shared with you, in your ' + name + ' library.' };
      return { word: 'Library', title: 'From your ' + name + ' library. Change it there and it changes here.' };
    }
    return { word: 'Copy', title: 'A copy kept on the stand' + (state.pairingId ? ', in this pairing' : '')
      + '. Changing it in ' + name + ' does not change it here.' };
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
    ['readout-poem', 'readout-ost', 'where-poem', 'where-ost'].forEach(id => { $(id).textContent = ''; });
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
    /* The same words in each pane's heading, beside the score they are
       about; the toolbar's copy is for present mode, where the headings
       are hidden. */
    $('where-poem').textContent = p;
    $('where-ost').textContent = o;
  }


  /* ==================================================================
     TEMPO
     ================================================================== */

  const bpmBtn = $('bpm-btn');
  const bpmValue = $('bpm-value');

  function setBpm(value, opts) {
    const v = clamp(Math.round(Number(value) || state.bpm), BPM_MIN, BPM_MAX);
    const changed = v !== state.bpm;
    state.bpm = v;
    bpmValue.textContent = String(v);
    if (changed) { retime(); saveSession(); }
  }

  /* Tap to type, as in Rhythm Poetry. The number is taken as soon as it
     is a real tempo — focus can fail to land in a background tab — and
     the box closes on Enter, on blur, or on a tap anywhere else. */
  bpmBtn.addEventListener('click', () => {
    if (bpmBtn.querySelector('.bpm-input')) return;
    $('bpm-gauge-wrap').classList.remove('show');
    const before = state.bpm;
    const unit = bpmBtn.querySelector('.bpm-unit');
    const input = document.createElement('input');
    input.type = 'number';
    input.inputMode = 'numeric';
    input.min = String(BPM_MIN);
    input.max = String(BPM_MAX);
    input.value = String(state.bpm);
    input.className = 'bpm-input';
    input.setAttribute('aria-label', 'Tempo in beats per minute');
    bpmBtn.replaceChildren(input);
    input.focus();
    input.select();

    const typed = () => {
      const n = parseInt(input.value, 10);
      return n >= BPM_MIN && n <= BPM_MAX ? n : null;
    };
    let closed = false;
    const close = keep => {
      if (closed) return;
      closed = true;
      document.removeEventListener('pointerdown', onOutside, true);
      if (!keep) setBpm(before);
      bpmBtn.replaceChildren(bpmValue, unit);
      bpmValue.textContent = String(state.bpm);
    };
    const onOutside = ev => { if (ev.target !== input) close(true); };
    input.addEventListener('input', () => { const n = typed(); if (n !== null) setBpm(n); });
    input.addEventListener('blur', () => close(true));
    input.addEventListener('click', ev => ev.stopPropagation());
    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') { ev.preventDefault(); close(true); }
      else if (ev.key === 'Escape') { ev.preventDefault(); close(false); }
      else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
        ev.preventDefault();
        setBpm(state.bpm + (ev.key === 'ArrowUp' ? 1 : -1) * (ev.shiftKey ? 5 : 1));
        input.value = String(state.bpm);
      }
    });
    setTimeout(() => document.addEventListener('pointerdown', onOutside, true), 0);
  });

  /* Hover to slide, as in Rhythm Poetry: a slider above the button, for a
     real mouse only (on a board or a touch laptop a tap would open it on
     top of its own typing). A short grace period lets the mouse cross the
     gap from the button to the slider. */
  (function tempoGauge() {
    const wrap = $('bpm-gauge-wrap'), slider = $('bpm-gauge'), label = $('bpm-gauge-label');
    let hideTimer = null, dragging = false;
    const fine = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    function show() {
      if (!fine() || bpmBtn.querySelector('.bpm-input')) return;
      clearTimeout(hideTimer);
      slider.value = String(state.bpm);
      label.textContent = state.bpm + ' BPM';
      wrap.classList.add('show');
      const r = bpmBtn.getBoundingClientRect();
      const w = wrap.offsetWidth || 260;
      wrap.style.bottom = (window.innerHeight - r.top + 10) + 'px';
      wrap.style.left = clamp(r.left + r.width / 2 - w / 2, 10, window.innerWidth - w - 10) + 'px';
    }
    function scheduleHide() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => { if (!dragging) wrap.classList.remove('show'); }, 150);
    }
    bpmBtn.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(); });
    bpmBtn.addEventListener('mouseleave', scheduleHide);
    wrap.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    wrap.addEventListener('mouseleave', scheduleHide);
    slider.addEventListener('pointerdown', () => { dragging = true; });
    window.addEventListener('pointerup', () => { if (dragging) { dragging = false; scheduleHide(); } });
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10);
      label.textContent = v + ' BPM';
      setBpm(v);
    });
  })();


  /* ==================================================================
     COUNT-IN, INTRO, LOOP
     ================================================================== */

  function syncSequence() {
    $('countin-btn').classList.toggle('on', state.countIn);
    $('countin-btn').setAttribute('aria-checked', String(state.countIn));
    $('loop-btn').setAttribute('aria-pressed', String(state.loop));
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
        pic.addEventListener('click', () => openInstrumentSheet(voice.id, true));
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
  let pickedFromMixer = false;

  /* From a picture in the mixer, or from the instrument's own picture
     in the pane (bridge.onInstrumentPick). Only the mixer is put back
     afterwards — a pane's picture was pressed where the answer shows. */
  function openInstrumentSheet(voiceId, fromMixer) {
    const b = sides.ost.bridge;
    if (!b || typeof b.instruments !== 'function') return;
    const got = safe(() => b.instruments(voiceId), null);
    if (!got || !got.editable || !got.items || !got.items.length) return;

    pickingVoice = voiceId;
    pickedFromMixer = !!fromMixer;
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
    if (pickedFromMixer) togglePopover($('mixer-pop'), $('mixer-btn'));
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
  /* Where Automatic starts: side by side on a computer or any screen
     wider than it is tall, one above the other on a screen held upright.
     The solver moves off it only when the other arrangement draws the two
     scores clearly larger (see `better`). */
  const shapeDefault = () => (window.innerWidth >= window.innerHeight ? 'side' : 'stacked');
  let liveArrange = shapeDefault();
  let liveLandscape = window.innerWidth >= window.innerHeight;

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
    document.querySelectorAll('[data-show-tab]').forEach(b => {
      const on = b.dataset.showTab === state.layout.show;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
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
     it goes to what is already on screen — which starts as the screen's
     own shape (shapeDefault) — and then to the longer line, which is the
     choice a reader would make.
     Trap: a score's natural size shifts a little with the box it was last
     fitted into, so each arrangement can look slightly better when measured
     from the other one. A fixed preference ("ties go to side by side") made
     the second settling pass flip a portrait tablet from stacked back to
     side. Keeping what is on screen is what holds it still. */
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
  document.querySelectorAll('[data-show-tab]').forEach(b => {
    b.addEventListener('click', () => setLayout({ show: b.dataset.showTab }));
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
    resizeTimer = setTimeout(() => {
      /* Turned from wide to tall or back (a tablet rotated, a window
         dragged narrow): Automatic starts again from the new shape. */
      const landscape = window.innerWidth >= window.innerHeight;
      if (landscape !== liveLandscape) {
        liveLandscape = landscape;
        if (state.layout.arrange === 'auto') liveArrange = shapeDefault();
      }
      applyArrangement();
      scheduleSplit();
    }, 120);
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
    syncDotsSeg('poem');

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
    syncDotsSeg('ost');
  }

  /* The dots above each beat, three ways — the same three the dots
     button in either app cycles through: none, the ordinary dots, or
     EASY's one coloured circle per rhythm. Two view keys say it between
     them, because that is how both apps keep it. */
  function dotsMode(side) {
    const v = state.views[side];
    return !v.showDots ? 'off' : v.easyMode ? 'easy' : 'dots';
  }

  function syncDotsSeg(side) {
    const mode = dotsMode(side);
    document.querySelectorAll('[data-dots-side="' + side + '"]').forEach(b => {
      b.classList.toggle('active', b.dataset.dots === mode);
    });
  }

  document.querySelectorAll('[data-dots-side]').forEach(b => {
    b.addEventListener('click', () => {
      const mode = b.dataset.dots;
      setView(b.dataset.dotsSide, { showDots: mode !== 'off', easyMode: mode === 'easy' });
    });
  });

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

  wirePopover('view-btn', 'view-pop', syncEditSwitch);
  wirePopover('mixer-btn', 'mixer-pop', () => { renderMixer(); syncSequence(); });
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

  /* ---- the library, drawn the apps' way ----
     A group is a heading with its icon and a rule, then rows; a row is a
     badge, the name (with a Shared tag where it applies) and a line
     under it, and its buttons. The pickers and the pairings list both
     use these, so the stand's lists read like the apps' Songs sheets. */
  const ICONS = {
    sandbox: '<path d="M4 20h16"/><path d="M6 20l1.5-6h9L18 20"/><path d="M12 14V4"/><path d="M12 4l5 3-5 3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    shared: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    poem: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    ost: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="15" r="3"/><path d="M9 17V5l12-2v12"/><path d="M9 9l12-2"/>',
    pair: '<rect x="3" y="4.5" width="8" height="15" rx="2"/><rect x="13" y="4.5" width="8" height="15" rx="2"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z"/>'
  };

  function libGroup(list, icon, title, opts) {
    const o = opts || {};
    const group = document.createElement('section');
    group.className = 'library-group';
    if (o.color) group.style.setProperty('--group', o.color);
    const head = document.createElement('div');
    head.className = 'library-group-head';
    head.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[icon] + '</svg>'
      + '<span class="library-group-title"></span><span class="library-group-rule"></span>';
    head.querySelector('.library-group-title').textContent = title;
    if (o.headButton) head.appendChild(o.headButton);
    group.appendChild(head);
    list.appendChild(group);
    return group;
  }

  function libEmpty(group, text) {
    const empty = document.createElement('div');
    empty.className = 'library-empty';
    empty.textContent = text;
    group.appendChild(empty);
  }

  /* One row. `badge` is a text (a meter) or an element; `whole` makes the
     row itself the button, as in the pickers, where opening is the only
     thing to do. */
  function libRow(o) {
    const row = document.createElement(o.whole ? 'button' : 'div');
    row.className = 'lib-row' + (o.current ? ' is-current' : '') + (o.extraClass ? ' ' + o.extraClass : '');
    const badge = document.createElement('span');
    badge.className = 'meter-badge';
    if (typeof o.badge === 'string') badge.textContent = o.badge;
    else if (o.badge) { badge.classList.add('pair-badge'); badge.appendChild(o.badge); }
    const main = document.createElement('span');
    main.className = 'lib-main';
    const title = document.createElement('span');
    title.className = 'lib-title';
    title.textContent = o.title;
    if (o.shared) {
      const tag = document.createElement('span');
      tag.className = 'shared-tag';
      tag.textContent = 'Shared';
      tag.title = 'Shared with you: it stays as it was sent.';
      title.appendChild(tag);
    }
    main.appendChild(title);
    if (o.sub) {
      const sub = document.createElement('span');
      sub.className = 'lib-sub';
      sub.textContent = o.sub;
      main.appendChild(sub);
    }
    const actions = document.createElement('span');
    actions.className = 'lib-actions';
    (o.actions || []).forEach(a => actions.appendChild(a));
    row.append(badge, main, actions);
    if (o.whole && o.onOpen) row.addEventListener('click', o.onOpen);
    return row;
  }

  function libButton(label, cls, onClick, title) {
    const b = document.createElement(onClick ? 'button' : 'span');
    b.className = 'lib-btn' + (cls ? ' ' + cls : '');
    b.textContent = label;
    if (title) b.title = title;
    if (onClick) b.addEventListener('click', e => { e.stopPropagation(); onClick(e, b); });
    return b;
  }

  function songRow(song, current, onPick) {
    const bits = [];
    if (song.measures) bits.push(song.measures + (song.measures === 1 ? ' bar' : ' bars'));
    bits.push(song.bpm + ' BPM');
    if (song.preview) bits.push(song.preview);
    return libRow({
      whole: true,
      current: current,
      badge: song.meter[0] + '/' + song.meter[1],
      title: song.title,
      shared: !!song.received && !song.book,
      sub: bits.join(' · '),
      extraClass: song.sandbox ? 'sandbox-row' : '',
      actions: [current ? libButton('Open now', 'is-active') : libButton('Open', 'open-btn')],
      onOpen: onPick
    });
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
      list.innerHTML = '<div class="library-empty">' + APPS[side].name + ' is still opening…</div>';
      foot.textContent = '';
      return;
    }

    let songs = safe(() => bridge.listSongs(), []);
    if (side === 'poem') songs = songs.filter(s => s.kind === picker.filter);

    const current = state.songs[side];
    const color = side === 'poem' ? 'var(--poem)' : 'var(--ost)';
    const add = (group, items) => items.forEach(song => {
      const isCurrent = !!current && current.src === 'library' && current.id === song.id;
      group.appendChild(songRow(song, isCurrent, () => {
        if (loadInto(side, { src: 'library', id: song.id })) closeSheet(pickerSheet);
      }));
    });

    /* The app's own order: scratch work, the teacher's books, what was
       shared, your own, and the examples it came with. */
    const scratch = songs.filter(s => s.sandbox);
    const books = {};
    songs.filter(s => !s.sandbox && s.book).forEach(s => { (books[s.book] = books[s.book] || []).push(s); });
    const shared = songs.filter(s => !s.sandbox && !s.book && s.received);
    const mine = songs.filter(s => !s.sandbox && !s.book && !s.received && s.isCustom);
    const theirs = songs.filter(s => !s.sandbox && !s.isCustom);

    if (scratch.length) add(libGroup(list, 'sandbox', 'Sandbox — scratch work'), scratch);
    Object.keys(books).sort((a, b) => a.localeCompare(b)).forEach(book => add(libGroup(list, 'book', book), books[book]));
    if (shared.length) add(libGroup(list, 'shared', 'Shared with you'), shared);
    const yours = libGroup(list, side, side === 'ost' ? 'Your ostinatos'
      : picker.filter === 'rhythm' ? 'Your rhythms' : 'Your poems', { color: color });
    if (mine.length) add(yours, mine);
    else libEmpty(yours, 'None of your own yet — make one in ' + APPS[side].name + ' and it appears here.');
    if (theirs.length) add(libGroup(list, 'star', side === 'poem' ? 'Examples' : 'Starters'), theirs);

    foot.textContent = 'This is your ' + APPS[side].name + ' library in this browser. Songs are opened, never changed. '
      + 'A song opened from here stays linked: change it in ' + APPS[side].name + ' and it changes on the stand.';
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
    if (parsed.kind === 'pair') { closeSheet(pickerSheet); return openLinkPairing(parsed.data); }
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
     PAIRINGS — THE STAND'S OWN LIBRARY
     ------------------------------------------------------------------
     A pairing is a poem and an ostinato kept together, with the tempo,
     intro and sound that suit them. It is kept the way every Eagle View
     Music app keeps what it saves (EVM Library/README.md): an item with
     an id made once, `createdAt` and `updatedAt` (which moves only when
     something actually changed), and the header that says it was shared
     with you (`received`), which pairing it was saved from
     (`derivedFrom`) and — once the Teacher Library shelf reaches the
     stand — which book it came in (`book`).

     And it behaves the way a song does in Rhythm Poetry and Ostinato
     Builder:
       - the SANDBOX is scratch work, kept under the reserved id
         'sandbox' in the same map, always saving itself, and never
         listed, shared by id, or published as a pairing;
       - a saved pairing opens with AUTO-SAVE off, and turning it on is
         what keeps the changes (New and Save as… start with it on);
       - a pairing that came in a link is SHARED: read-only, with Save my
         copy in place of Auto-save, and opening the same link again
         finds it instead of adding another (EVMLibrary.file).

     Stored in PAIRINGS_KEY as an id map, which is what the Librarian
     reads. Nothing here writes to either app's library.
     ================================================================== */

  const EVM = window.EVMLibrary;
  const APP_SLUG = 'music-stand';
  const SANDBOX_ID = 'sandbox';
  const SANDBOX_TITLE = 'Pairing sandbox';
  const isReserved = id => id === SANDBOX_ID;
  const clone = v => JSON.parse(JSON.stringify(v));
  /* Read before any session is adopted: what New and a cleared sandbox
     start from. */
  const DEFAULT_SETTINGS = clone(settingsRecord());

  const pairSheet = $('pair-sheet');
  const shareSheet = $('share-sheet');
  const nameSheet = $('name-sheet');

  /* An old record that says nothing of its date is dated by its id
     (pair_<ms>) — never "now", or it would look newer than it is. */
  function idTime(id) {
    const m = /_(\d{12,})/.exec(String(id || ''));
    return m ? Number(m[1]) : 0;
  }

  function cleanSong(s) {
    if (!s || typeof s !== 'object' || !(s.data || s.id)) return null;
    const linked = s.src === 'library' && !!s.id;
    const out = { src: linked ? 'library' : 'data', id: linked ? String(s.id) : null,
                  title: typeof s.title === 'string' ? s.title : '', data: s.data || null };
    if (s.edited) out.edited = true;
    if (s.origin && s.origin.id) out.origin = { src: s.origin.src || 'library', id: String(s.origin.id) };
    return out;
  }

  /* Every record read goes through here, so an old one (title, savedAt,
     songs, settings — from before pairings were items) comes out in the
     same shape as a new one. */
  function normalizePairing(rec, id) {
    if (!rec || typeof rec !== 'object') return null;
    const sandbox = id === SANDBOX_ID;
    const created = Number(rec.createdAt) || Number(rec.savedAt) || idTime(id) || Date.now();
    const title = typeof rec.title === 'string' && rec.title.trim() ? rec.title.trim().slice(0, 60) : '';
    const out = {
      id: id,
      title: sandbox ? SANDBOX_TITLE : (title || 'Untitled pairing'),
      isCustom: true,
      createdAt: created,
      updatedAt: Number(rec.updatedAt) || Number(rec.savedAt) || created,
      songs: { poem: cleanSong(rec.songs && rec.songs.poem), ost: cleanSong(rec.songs && rec.songs.ost) },
      settings: rec.settings && typeof rec.settings === 'object' ? clone(rec.settings) : {}
    };
    if (!sandbox) EVM.carry(rec, out);
    if (typeof rec.filedAs === 'string') out.filedAs = rec.filedAs;
    return out;
  }

  function readLibrary() {
    const raw = readJSON(PAIRINGS_KEY);
    const lib = {};
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      Object.keys(raw).forEach(id => {
        const rec = normalizePairing(raw[id], id);
        if (rec) lib[id] = rec;
      });
    }
    return lib;
  }
  function writeLibrary(lib) { return writeJSON(PAIRINGS_KEY, lib); }

  /* ---- what counts as the same pairing ----
     The content key (EVMLibrary's `key`): both scores and the settings,
     with ids, titles-of-the-pairing and dates left out. A score is
     compared by what it holds, not by where it came from, so a pairing
     linked to a library song changes when that song does, and a link to
     it and a copy of it with the same notes are the same pairing. Blank —
     nothing on either side — is null, and is never filed. */
  const DATA_SKIP = ['id', 'createdAt', 'updatedAt', 'isCustom', 'received', 'receivedAt',
                     'derivedFrom', 'book', 'sandbox', 'savedAt'];

  function songContent(s) {
    if (!s || !(s.data || s.id)) return null;
    if (!s.data) return { ref: s.id };
    const d = {};
    Object.keys(s.data).forEach(k => { if (DATA_SKIP.indexOf(k) === -1) d[k] = s.data[k]; });
    return d;
  }

  function settingsContent(st) {
    const s = st || {};
    return {
      bpm: s.bpm, countIn: !!s.countIn, leadIn: s.leadIn, loop: s.loop !== false,
      wordsSound: s.wordsSound || 'tone', wordsStrength: s.wordsStrength || 1,
      mute: s.mute || {}, voiceMute: s.voiceMute || {}, vol: s.vol || {}
    };
  }

  function pairingKey(rec) {
    if (!rec) return null;
    const songs = { poem: songContent(rec.songs && rec.songs.poem), ost: songContent(rec.songs && rec.songs.ost) };
    if (!songs.poem && !songs.ost) return null;
    return EVM.stableStringify({ songs: songs, settings: settingsContent(rec.settings) });
  }

  /* What a link or a file is matched by when it arrives. A pairing that
     came that way remembers the fingerprint of what it arrived as
     (`filedAs`), because opening it lets the apps tidy the scores inside
     (see settleStored) — and a link from before ids travelled can only be
     recognised by its content, which must still be the content it came
     with, or every visit to a page with that link on it would add another
     copy. */
  function fingerprint(text) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 'f' + (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
  }

  function fileKey(rec) {
    const k = pairingKey(rec);
    if (k === null) return null;
    return rec.filedAs || fingerprint(k);
  }

  const fileOpts = received => ({
    key: fileKey, reserved: isReserved, newId: () => EVM.newId('pair'), received: !!received
  });

  /* A pairing is a saved moment. An app's sandbox is scratch work that
     gets cleared and rewritten, so a pairing keeps the copy it had rather
     than the sandbox's id — which would open whatever the sandbox holds by
     the time the pairing is next used. The stand's own sandbox stays live. */
  function pairingSongs() {
    const songs = clone(state.songs);
    SIDES.forEach(side => {
      const song = songs[side];
      if (song && isSandboxId(song.id)) { song.src = 'data'; song.id = null; }
    });
    return songs;
  }

  /* What is on the stand, as a pairing would keep it. */
  function workingRecord() {
    return { title: state.name, songs: pairingSongs(), settings: settingsRecord() };
  }

  function standTitles() {
    return SIDES.map(side => state.songs[side] && state.songs[side].title).filter(Boolean);
  }

  /* ---- saving ----
     Called with every save of the session. The sandbox always keeps
     itself; a pairing only while auto-save is on; a shared pairing never. */
  function saveWorking() {
    if (!state.pairingId) {
      const lib = readLibrary();
      const prev = lib[SANDBOX_ID];
      const next = { id: SANDBOX_ID, title: SANDBOX_TITLE, isCustom: true,
                     createdAt: prev ? prev.createdAt : Date.now(),
                     songs: clone(state.songs), settings: settingsRecord() };
      next.updatedAt = prev && pairingKey(prev) === pairingKey(next) ? prev.updatedAt : Date.now();
      lib[SANDBOX_ID] = next;
      return writeLibrary(lib);
    }
    if (state.shared || !state.autoSave) return false;
    const lib = readLibrary();
    const prev = lib[state.pairingId];
    if (!prev) return false;
    const next = Object.assign({}, prev, workingRecord(), { title: state.name || prev.title });
    delete next.updatedAt;
    EVM.stamp(next, prev, pairingKey);
    lib[state.pairingId] = next;
    return writeLibrary(lib);
  }

  /* See loadInto: a copy the app has tidied is put back tidied, without
     calling it a change. Only a copy (a linked song follows its app and
     is saved the ordinary way), and only while that pairing is open. */
  function settleStored(id, side) {
    if (state.pairingId !== id) return;
    const song = state.songs[side];
    if (!song || song.src !== 'data' || song.edited || !song.data) return;
    const lib = readLibrary();
    const rec = lib[id];
    const kept = rec && rec.songs[side];
    if (!kept || kept.src !== 'data') return;
    if (EVM.stableStringify(songContent(kept)) === EVM.stableStringify(songContent(song))) return;
    kept.data = clone(song.data);
    writeLibrary(lib);
  }

  function hasUnsavedChanges() {
    if (!state.pairingId) return false;
    const prev = readLibrary()[state.pairingId];
    if (!prev) return false;
    return pairingKey(prev) !== pairingKey(workingRecord())
      || (!state.shared && (state.name || prev.title) !== prev.title);
  }

  /* ---- opening ---- */

  /* Everything a pairing does not say goes back to the stand's defaults,
     so one pairing's count-in cannot leak into the next. */
  function applyPairing(songs, settings, id) {
    if (isPlaying()) stopPlayback();
    adoptSettings(Object.assign(clone(DEFAULT_SETTINGS), settings || {}));
    SIDES.forEach(side => {
      const song = songs && songs[side];
      if (song && (song.data || song.id)) {
        loadInto(side, song, { keepTempo: true, keepMutes: true, settle: id || null });
      } else {
        clearSide(side);
      }
    });
    syncAll();
  }

  /* `noFlush` when the session on screen must not be saved first: at
     start-up, before it has been put back, and after a link has just
     written the sandbox. */
  function openPairingRecord(id, opts) {
    const o = opts || {};
    if (id === SANDBOX_ID) return openSandbox(o);
    const rec = readLibrary()[id];
    if (!rec) return false;
    if (!o.noFlush) flushSession();
    state.pairingId = id;
    state.name = rec.title;
    state.shared = !!rec.received;
    state.book = rec.received && rec.book ? String(rec.book) : '';
    state.autoSave = !!o.autoSave && !state.shared;
    applyPairing(rec.songs, rec.settings, id);
    saveSession();
    if (!o.quiet) toast('Opened “' + rec.title + '”');
    return true;
  }

  function openSandbox(opts) {
    const o = opts || {};
    if (!o.noFlush) flushSession();
    const rec = readLibrary()[SANDBOX_ID];
    state.pairingId = null;
    state.name = '';
    state.shared = false;
    state.book = '';
    state.autoSave = false;
    applyPairing(rec ? rec.songs : null, rec ? rec.settings : null, null);
    saveSession();
    return true;
  }

  /* ---- the top bar: where the work is going ---- */

  const ICON_SAVING = '<path d="M20 6 9 17l-5-5"/>';
  const ICON_NOT_SAVING = '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>';
  const ICON_COPY = '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>';

  function chipKicker() {
    if (!state.pairingId) return 'Sandbox';
    if (state.shared) return state.book || 'Shared';
    return 'Pairing';
  }

  function refreshLibraryChrome() {
    const sandbox = !state.pairingId;
    const titles = standTitles();
    const label = sandbox ? (titles.length ? titles.join(' + ') : 'Empty stand') : (state.name || 'Untitled pairing');

    const chip = $('pair-chip');
    chip.classList.toggle('is-sandbox', sandbox);
    $('pair-chip-kicker').textContent = chipKicker();
    $('pair-chip-label').textContent = label;
    chip.title = sandbox
      ? 'Sandbox — scratch work, kept between visits but not in your pairings'
      : (state.shared ? 'Shared with you: ' : 'Pairing: ') + label;

    $('sandbox-clear-btn').hidden = !sandbox;

    const t = $('autosave-toggle');
    t.hidden = sandbox;
    if (!sandbox) {
      const on = state.autoSave && !state.shared;
      t.classList.toggle('is-off', !on);
      t.classList.toggle('is-shared', state.shared);
      t.setAttribute('aria-pressed', String(on));
      t.title = state.shared
        ? 'A shared pairing stays exactly as it was sent, so you can always go back to it. Press to save your own copy and keep your changes.'
        : on
        ? 'Auto-save is on: every change is saved to this pairing. Press to stop saving.'
        : 'Auto-save is off: your changes are not being saved. Press to save them and start saving again.';
      $('autosave-label').textContent = state.shared ? 'Save my copy' : (on ? 'Auto-save' : 'Not saving');
      t.querySelector('.autosave-icon').innerHTML = state.shared ? ICON_COPY : (on ? ICON_SAVING : ICON_NOT_SAVING);
    }

    document.title = (sandbox ? (titles.join(' + ') || 'Music Stand') : label)
      + (titles.length || !sandbox ? ' — Music Stand' : '');
  }

  /* Turning it back on is the moment to ask about the work done while it
     was off: save it, or leave it on screen only and stay off. The same
     question, in the same words, as both apps ask. */
  function setAutoSave(on) {
    if (!state.pairingId) return;
    if (state.shared) { openNameSheet('copy'); return; }
    if (on && hasUnsavedChanges()) {
      const title = state.name || 'this pairing';
      const ok = confirm('Save the changes you have made to “' + title + '”?\n\n'
        + 'OK saves them and turns auto-save on.\n'
        + 'Cancel leaves auto-save off, and “' + title + '” stays as it was saved.');
      if (!ok) { refreshLibraryChrome(); return; }
      state.autoSave = true;
      flushSession();
      toast('Saved — auto-save on');
    } else {
      state.autoSave = !!on;
      flushSession();
    }
    if (pairSheet.classList.contains('open')) renderPairList();
  }

  $('autosave-toggle').addEventListener('click', () => setAutoSave(!state.autoSave));
  $('sandbox-clear-btn').addEventListener('click', clearSandbox);

  function clearSandbox() {
    if (!confirm('Clear the sandbox and start with an empty stand? This can’t be undone.')) return;
    const lib = readLibrary();
    delete lib[SANDBOX_ID];
    writeLibrary(lib);
    if (!state.pairingId) {
      if (isPlaying()) stopPlayback();
      adoptSettings(clone(DEFAULT_SETTINGS));
      SIDES.forEach(clearSide);
      syncAll();
      saveSession();
    }
    if (pairSheet.classList.contains('open')) renderPairList();
    toast('Sandbox cleared');
  }

  /* ---- the Pairings sheet ---- */

  function openPairSheet() {
    renderPairList();
    openSheet(pairSheet);
  }

  function pairBadge(rec) {
    const frag = document.createDocumentFragment();
    SIDES.forEach(side => {
      const i = document.createElement('i');
      i.className = side + (rec.songs && rec.songs[side] ? ' on' : '');
      frag.appendChild(i);
    });
    return frag;
  }

  function pairSub(rec) {
    const parts = SIDES.map(side => rec.songs && rec.songs[side] && rec.songs[side].title).filter(Boolean);
    const bpm = rec.settings && rec.settings.bpm;
    return (parts.join(' + ') || 'Nothing on the stand yet') + (bpm ? ' · ' + bpm + ' BPM' : '');
  }

  function renderPairList() {
    const lib = readLibrary();
    const sandbox = !state.pairingId;

    /* what is open */
    $('now-open-title').textContent = sandbox ? 'Sandbox' : (state.name || 'Untitled pairing');
    const badge = $('now-open-badge');
    badge.textContent = sandbox ? 'Sandbox' : state.shared ? (state.book ? 'From a book' : 'Shared') : 'Pairing';
    badge.className = 'kind-badge' + (sandbox ? ' is-sandbox' : state.shared ? ' is-shared' : '');
    $('now-open-note').textContent = sandbox
      ? 'Scratch work. It stays here between visits but is not in your pairings — use Save as… to keep it.'
      : state.shared
      ? 'Shared with you. It stays exactly as it was sent, so you can always come back to it — use Save my copy to keep your own with your changes.'
      : (state.autoSave ? '' : 'Auto-save is off: changes on the stand are not kept until you turn it on.');
    $('pair-saveas').textContent = state.shared ? 'Save my copy' : 'Save as…';

    const list = $('pair-list');
    list.innerHTML = '';

    /* the sandbox, first and on its own, as in both apps */
    const sb = lib[SANDBOX_ID] || { songs: {}, settings: {} };
    const sbGroup = libGroup(list, 'sandbox', 'Sandbox');
    sbGroup.appendChild(libRow({
      current: sandbox,
      extraClass: 'sandbox-row',
      badge: pairBadge(sb),
      title: 'Pairing sandbox',
      sub: 'Scratch work — not in your pairings · ' + pairSub(sb),
      actions: [
        sandbox ? libButton('Open now', 'is-active')
                : libButton('Open', 'open-btn', () => { openSandbox(); closeSheet(pairSheet); }),
        libButton('Clear', '', clearSandbox, 'Start the sandbox over with an empty stand')
      ]
    }));

    const ids = Object.keys(lib).filter(id => !isReserved(id))
      .sort((a, b) => String(lib[a].title).localeCompare(String(lib[b].title)));

    /* books from the Teacher Library, each with its way back */
    const books = {};
    ids.filter(id => lib[id].received && lib[id].book).forEach(id => {
      (books[lib[id].book] = books[lib[id].book] || []).push(id);
    });
    Object.keys(books).sort((a, b) => a.localeCompare(b)).forEach(book => {
      let back = null;
      if (window.EVMShelf && shelfConnected) {
        back = document.createElement('button');
        back.className = 'book-head-btn';
        back.textContent = 'Put back';
        back.title = 'Put this book back on the Teacher Library shelf';
        back.addEventListener('click', () => EVMShelf.putBack(book));
      }
      const g = libGroup(list, 'book', book, { headButton: back });
      books[book].forEach(id => g.appendChild(pairRow(lib[id])));
    });

    const shared = ids.filter(id => lib[id].received && !lib[id].book);
    if (shared.length) {
      const g = libGroup(list, 'shared', 'Shared with you');
      shared.forEach(id => g.appendChild(pairRow(lib[id])));
    }

    const mine = ids.filter(id => !lib[id].received);
    const g = libGroup(list, 'pair', 'Your pairings', { color: 'var(--ink)' });
    if (mine.length) mine.forEach(id => g.appendChild(pairRow(lib[id])));
    else libEmpty(g, 'Nothing saved yet. Put a poem and an ostinato on the stand, then Save as… to keep them together.');
  }

  function pairRow(rec) {
    const id = rec.id;
    const current = id === state.pairingId;
    const actions = [];

    /* With auto-save off, the pairing on the stand and the one saved are
       two different things — so where the button would say "Open now" it
       offers the saved one back instead. */
    if (current && !(state.autoSave && !state.shared) && hasUnsavedChanges()) {
      actions.push(libButton('Reopen', 'open-btn', () => {
        if (!confirm('Reopen “' + rec.title + '” as it was saved?\n\nThe changes you have made since opening it are lost.')) return;
        openPairingRecord(id, { noFlush: true, quiet: true });
        closeSheet(pairSheet);
        toast('Reopened as saved');
      }, 'Open the saved version again, losing the changes on the stand'));
    } else if (current) {
      actions.push(libButton('Open now', 'is-active'));
    } else {
      actions.push(libButton('Open', 'open-btn', () => { openPairingRecord(id); closeSheet(pairSheet); }));
    }

    /* A shared pairing keeps the name it was sent with, so it stays
       recognisable; one from a book leaves with its book (Put back). */
    if (!rec.received) {
      actions.push(libButton('Rename', 'rename-btn', () => openNameSheet('rename', id)));
    }
    if (!(rec.received && rec.book)) {
      actions.push(libButton('×', 'delete-btn', (e, btn) => {
        /* Two taps: the first turns the button into the question. */
        if (!btn.classList.contains('confirm')) {
          btn.classList.add('confirm');
          btn.textContent = 'Delete?';
          setTimeout(() => { if (btn.isConnected) renderPairList(); }, 3000);
          return;
        }
        deletePairing(id);
      }, 'Delete this pairing'));
    }

    return libRow({
      current: current,
      badge: pairBadge(rec),
      title: rec.title,
      shared: !!rec.received && !rec.book,
      sub: pairSub(rec),
      actions: actions
    });
  }

  function deletePairing(id) {
    const lib = readLibrary();
    const title = lib[id] ? lib[id].title : 'pairing';
    delete lib[id];
    writeLibrary(lib);
    if (state.pairingId === id) openSandbox({ noFlush: true });
    renderPairList();
    toast('Deleted “' + title + '”');
  }

  /* ---- naming: New, Save as…, Save my copy, Rename ---- */

  let naming = null;   // { mode, id }

  const NAMING = {
    new:    { heading: 'New pairing', ok: 'Create',
              sub: 'Give it a name. It starts as an empty stand, and saves itself as you work.' },
    saveAs: { heading: 'Save as a new pairing', ok: 'Save',
              sub: 'Everything on the stand now — both scores, the tempo, the intro and the sound — kept together under a name.' },
    copy:   { heading: 'Save my copy', ok: 'Save my copy',
              sub: 'A shared pairing stays exactly as it was sent. Your copy is yours to change, and saves itself.' },
    rename: { heading: 'Rename', ok: 'Rename', sub: 'A new name for this pairing.' }
  };

  function openNameSheet(mode, id) {
    const m = NAMING[mode];
    naming = { mode: mode, id: id || null };
    $('name-heading').textContent = m.heading;
    $('name-sub').textContent = m.sub;
    $('name-ok').textContent = m.ok;
    const input = $('name-input');
    const lib = readLibrary();
    input.value = mode === 'rename' ? (lib[id] ? lib[id].title : '')
      : mode === 'new' ? ''
      : (state.name || standTitles().join(' + '));
    input.classList.remove('input-error');
    if (mode !== 'rename' && mode !== 'new' && !state.songs.poem && !state.songs.ost) {
      toast('Put a poem or an ostinato on the stand first');
      return;
    }
    openSheet(nameSheet);
    setTimeout(() => { input.focus(); input.select(); }, 40);
  }

  function confirmName() {
    const input = $('name-input');
    const name = input.value.replace(/\s+/g, ' ').trim().slice(0, 60);
    if (!name) {
      input.classList.add('input-error');
      input.focus();
      return;
    }
    const mode = naming && naming.mode;
    const lib = readLibrary();
    const now = Date.now();

    if (mode === 'rename') {
      const rec = lib[naming.id];
      if (rec && rec.title !== name) {
        rec.title = name;
        rec.updatedAt = now;
        writeLibrary(lib);
        if (state.pairingId === naming.id) state.name = name;
      }
      closeSheet(nameSheet);
      refreshLibraryChrome();
      renderPairList();
      return;
    }

    const id = EVM.newId('pair');
    if (mode === 'new') {
      lib[id] = { id: id, title: name, isCustom: true, createdAt: now, updatedAt: now,
                  songs: { poem: null, ost: null }, settings: clone(DEFAULT_SETTINGS) };
      writeLibrary(lib);
      closeSheet(nameSheet);
      closeSheet(pairSheet);
      openPairingRecord(id, { autoSave: true, quiet: true });
      toast('Made “' + name + '” — it saves itself as you work');
      return;
    }

    /* Save as… and Save my copy: what is on the stand, under a new id,
       remembering which pairing it came from. The stand does not reopen
       anything — it is already showing it — it simply starts saving
       there. An app's sandbox is frozen into a copy on the way in. */
    const rec = Object.assign(workingRecord(), {
      id: id, title: name, isCustom: true, createdAt: now, updatedAt: now
    });
    if (state.pairingId) rec.derivedFrom = state.pairingId;
    lib[id] = rec;
    writeLibrary(lib);
    state.songs = clone(rec.songs);
    state.pairingId = id;
    state.name = name;
    state.shared = false;
    state.book = '';
    state.autoSave = true;
    closeSheet(nameSheet);
    closeSheet(pairSheet);
    refreshHeads();
    saveSession();
    toast(mode === 'copy' ? 'Saved your copy — auto-save on' : 'Saved “' + name + '” — auto-save on');
  }

  $('name-ok').addEventListener('click', confirmName);
  $('name-input').addEventListener('keydown', e => { if (e.key === 'Enter') confirmName(); });
  $('name-input').addEventListener('input', () => $('name-input').classList.remove('input-error'));

  $('pair-chip').addEventListener('click', openPairSheet);
  $('pair-new').addEventListener('click', () => openNameSheet('new'));
  $('pair-saveas').addEventListener('click', () => openNameSheet(state.shared ? 'copy' : 'saveAs'));
  $('pair-share-open').addEventListener('click', openShareSheet);

  /* ---- links ----
     A pairing link carries both scores whole, so it works for anyone. It
     also carries the pairing's id and dates — but only when the link
     holds exactly what is saved under that id (EVMLibrary.shareHeader),
     so a link made from unsaved changes can never overwrite the saved
     pairing at the other end. A link made in the sandbox says so, and
     lands in the other person's sandbox, as the apps' sandbox links do. */

  function songPayload(side) {
    const song = state.songs[side];
    return song && song.data ? clone(song.data) : null;
  }

  function makeShareLink() {
    if (!state.songs.poem && !state.songs.ost) {
      toast('Put a poem or an ostinato on the stand first');
      return null;
    }
    flushSession();
    const payload = {
      stand: 1,
      title: state.name || standTitles().join(' + '),
      poem: songPayload('poem'),
      ost: songPayload('ost'),
      settings: settingsRecord()
    };
    if (!state.pairingId) payload.sandbox = true;
    else if (!hasUnsavedChanges()) Object.assign(payload, EVM.shareHeader(readLibrary()[state.pairingId], pairingKey));
    return window.location.origin + window.location.pathname
      + '?pair=' + encodeURIComponent(encodeBase64Json(payload));
  }

  /* From a link, pasted or followed. Filed first — "make sure this is
     here", not "add a pairing" — then opened, read-only. */
  function openLinkPairing(data, opts) {
    const o = opts || {};
    const songs = {};
    SIDES.forEach(side => {
      const d = data && data[side];
      if (d && typeof d === 'object') songs[side] = { src: 'data', title: typeof d.title === 'string' ? d.title : '', data: d };
    });
    if (!songs.poem && !songs.ost) { toast('That pairing link has nothing in it'); return false; }
    const titles = SIDES.map(side => songs[side] && songs[side].title).filter(Boolean);
    const base = {
      title: typeof data.title === 'string' && data.title.trim() ? data.title : (titles.join(' + ') || 'Shared pairing'),
      songs: songs,
      settings: data.settings && typeof data.settings === 'object' ? data.settings : {}
    };

    if (!o.boot) flushSession();
    const lib = readLibrary();

    if (data.sandbox) {
      lib[SANDBOX_ID] = normalizePairing(Object.assign(base, { createdAt: Date.now() }), SANDBOX_ID);
      writeLibrary(lib);
      openSandbox({ noFlush: true });
      toast('That pairing is in your sandbox');
      return true;
    }

    const id = data.id && !isReserved(String(data.id)) && String(data.id) !== 'shared' ? String(data.id) : null;
    const incoming = normalizePairing(Object.assign(base, { createdAt: data.createdAt, updatedAt: data.updatedAt }), id || 'incoming');
    if (!id) delete incoming.id;
    incoming.filedAs = fingerprint(pairingKey(incoming) || '');
    const result = EVM.file(lib, incoming, fileOpts(true));
    if (result.action === 'blank') { toast('That pairing link has nothing in it'); return false; }
    writeLibrary(lib);
    openPairingRecord(result.id, { noFlush: true, quiet: true });
    const t = result.record.title;
    toast({
      added: 'Added “' + t + '” to your pairings',
      same: 'Opened “' + t + '” from your pairings',
      matched: 'Opened “' + t + '” from your pairings',
      updated: 'Updated “' + t + '” to the newest version',
      kept: 'Opened “' + t + '” — you already have a newer version'
    }[result.action] || 'Opened “' + t + '”');
    return true;
  }

  /* ---- Share & backup ---- */

  function openShareSheet() {
    $('share-row').hidden = true;
    $('share-status').textContent = '';
    $('import-status').textContent = '';
    $('reset-status').textContent = '';
    $('share-desc').textContent = !state.pairingId
      ? 'Both scores travel inside the link, with the tempo, intro and sound settings, so it works for anyone. A link from the sandbox lands in their sandbox.'
      : 'Both scores travel inside the link, with the tempo, intro and sound settings, so it works for anyone. It arrives as a shared pairing, and opening it again never makes a second copy.';
    renderExportList();
    closeSheet(pairSheet);
    openSheet(shareSheet);
  }

  $('share-make').addEventListener('click', () => {
    const link = makeShareLink();
    if (!link) return;
    $('share-link').value = link;
    $('share-row').hidden = false;
    copyText(link).then(ok => {
      $('share-status').textContent = ok ? 'Link copied to your clipboard.' : 'Select the link and copy it.';
      $('share-status').className = 'status-msg ' + (ok ? 'ok' : '');
      if (!ok) { $('share-link').focus(); $('share-link').select(); }
    });
  });
  $('share-copy').addEventListener('click', () => {
    const v = $('share-link').value;
    if (!v) return;
    copyText(v).then(ok => {
      $('share-status').textContent = ok ? 'Link copied to your clipboard.' : 'Select the link and copy it.';
      $('share-status').className = 'status-msg ' + (ok ? 'ok' : '');
    });
  });

  function renderExportList() {
    const lib = readLibrary();
    const box = $('export-list');
    box.innerHTML = '';
    const ids = Object.keys(lib).filter(id => !isReserved(id))
      .sort((a, b) => String(lib[a].title).localeCompare(String(lib[b].title)));
    if (!ids.length) {
      box.innerHTML = '<div class="lib-sub" style="padding:10px">Nothing saved yet.</div>';
      return;
    }
    ids.forEach(id => {
      const label = document.createElement('label');
      label.className = 'export-item';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = id;
      cb.checked = true;
      const title = document.createElement('span');
      title.textContent = lib[id].title;
      const sub = document.createElement('span');
      sub.className = 'lib-sub';
      sub.textContent = lib[id].received ? (lib[id].book || 'Shared') : '';
      label.append(cb, title, sub);
      box.appendChild(label);
    });
  }

  $('export-all').addEventListener('click', () => { $('export-list').querySelectorAll('input').forEach(i => { i.checked = true; }); });
  $('export-none').addEventListener('click', () => { $('export-list').querySelectorAll('input').forEach(i => { i.checked = false; }); });

  /* A backup is an EVM bundle — the same envelopes the Librarian writes,
     one per pairing — so it is already the shape the Teacher Library
     takes. A backup is yours: each envelope says whether it was shared,
     so it comes back the way it went. Library-linked songs keep their
     link and their copy: restored here they open live, restored anywhere
     else they open from the copy. */
  $('export-go').addEventListener('click', () => {
    const lib = readLibrary();
    const ids = [...$('export-list').querySelectorAll('input:checked')].map(i => i.value).filter(id => lib[id]);
    if (!ids.length) { toast('Tick at least one pairing'); return; }
    const items = ids.map(id => {
      const env = EVM.toEnvelope(lib[id], { app: APP_SLUG, kind: 'pairing' });
      env.received = !!lib[id].received;
      return env;
    });
    const bundle = { format: 'evm-bundle', formatVersion: EVM.FORMAT_VERSION, app: APP_SLUG,
                     exportedAt: new Date().toISOString(), items: items };
    const name = ($('export-name').value.trim() || 'my-pairings').replace(/[\\/:*?"<>|]+/g, '-');
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast(ids.length === 1 ? 'Downloaded 1 pairing' : 'Downloaded ' + ids.length + ' pairings');
  });

  $('import-btn').addEventListener('click', () => $('import-file').click());
  $('import-file').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const status = $('import-status');
    const reader = new FileReader();
    reader.onload = () => {
      let json = null;
      try { json = JSON.parse(String(reader.result)); } catch (err) { json = null; }
      const items = json ? EVM.readItems(json, {
        app: APP_SLUG, looksLike: v => !!(v && typeof v === 'object' && v.songs)
      }) : [];
      if (!items.length) {
        status.textContent = items.otherApp
          ? 'That file is for another app — there are no pairings in it.'
          : 'No pairings were found in that file.';
        status.className = 'status-msg error';
        return;
      }
      flushSession();
      const lib = readLibrary();
      const count = { added: 0, updated: 0, same: 0 };
      items.forEach(item => {
        const id = item.id && !isReserved(String(item.id)) ? String(item.id) : null;
        const incoming = normalizePairing(item, id || 'incoming');
        if (!incoming) return;
        if (!id) delete incoming.id;
        const r = EVM.file(lib, incoming, fileOpts(false));
        if (r.action === 'added') count.added++;
        else if (r.action === 'updated') count.updated++;
        else if (r.action !== 'blank') count.same++;
      });
      writeLibrary(lib);
      const bits = [];
      if (count.added) bits.push(count.added + ' added');
      if (count.updated) bits.push(count.updated + ' updated');
      if (count.same) bits.push(count.same + ' already here');
      status.textContent = bits.length ? 'Done: ' + bits.join(', ') + '.' : 'Nothing to add.';
      status.className = 'status-msg ok';
      renderExportList();
    };
    reader.readAsText(file);
  });

  $('reset-btn').addEventListener('click', () => {
    if (!confirm('Delete every pairing you have saved, and clear the sandbox?\n\n'
      + 'The poems and ostinatos in Rhythm Poetry and Ostinato Builder are not touched. This can’t be undone.')) return;
    writeLibrary({});
    if (isPlaying()) stopPlayback();
    state.pairingId = null;
    state.name = '';
    state.shared = false;
    state.book = '';
    state.autoSave = false;
    adoptSettings(clone(DEFAULT_SETTINGS));
    SIDES.forEach(clearSide);
    syncAll();
    flushSession();
    renderExportList();
    $('reset-status').textContent = 'Every pairing has been deleted.';
    $('reset-status').className = 'status-msg ok';
  });

  /* ---- the Teacher Library ----
     The shelf (lib/evm-shelf.js, shared with every app) takes a book out,
     keeps it in step with the Teacher Library on every visit, and puts it
     back; this adapter is all the stand hands it. The books a student has
     out are one list for the whole site, so a book taken out in Rhythm
     Poetry is out here too, and its pairings arrive the next time the
     stand opens.

     A published pairing carries its poem and its ostinato whole (the
     Librarian freezes them into copies when it publishes), so one file is
     everything a student needs: nothing is looked up in their own
     Rhythm Poetry or Ostinato Builder. The stand writes only its own
     pairings here — unlike the apps in its panes, it may have a shelf. */
  let shelfConnected = false;

  function connectShelf() {
    if (!window.EVMShelf) return false;
    EVMShelf.init({
      app: APP_SLUG,
      disabled: false,
      load: readLibrary,
      save: writeLibrary,
      incoming: rec => normalizePairing(rec, rec.id || 'incoming'),
      key: pairingKey,
      changed: shelfChanged,
      openSong: id => { openPairingRecord(id); closeSheet(pairSheet); },
      words: 'pairings'
    });
    shelfConnected = true;
    EVMShelf.sync();
    return true;
  }

  /* After the shelf filed or removed pairings: move off one that left,
     show a newer version of the one on the stand, and redraw. */
  function shelfChanged(summary) {
    const lib = readLibrary();
    if (state.pairingId && !lib[state.pairingId]) openSandbox({ noFlush: true });
    else if (state.pairingId && state.shared && summary.updated.indexOf(state.pairingId) !== -1) {
      openPairingRecord(state.pairingId, { noFlush: true, quiet: true });
    }
    if (pairSheet.classList.contains('open')) renderPairList();
    refreshLibraryChrome();
    const n = summary.added.length, up = summary.updated.length, gone = summary.removed.length;
    if (n) toast(n === 1 ? 'A pairing from your books is in your pairings' : n + ' pairings from your books are in your pairings');
    else if (up) toast(up === 1 ? 'Your teacher updated a pairing in your books' : 'Your teacher updated ' + up + ' pairings in your books');
    else if (gone) toast(gone === 1 ? 'A pairing from your books left your pairings' : gone + ' pairings from your books left your pairings');
  }

  $('shelf-btn').addEventListener('click', () => {
    if (!shelfConnected) { toast('The Teacher Library could not be loaded'); return; }
    closeSheet(pairSheet);
    EVMShelf.openSheet();
  });

  /* Another tab changed the pairings (saved one, deleted one): the list
     and the chip follow. The pairing on the stand is left as it is. */
  window.addEventListener('storage', e => {
    if (e.key !== PAIRINGS_KEY) return;
    if (state.pairingId && !readLibrary()[state.pairingId]) {
      state.pairingId = null; state.name = ''; state.shared = false; state.book = '';
      saveSession();
    }
    if (pairSheet.classList.contains('open')) renderPairList();
    refreshLibraryChrome();
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

  /* The Edit switch in the View popover, and the flag on the View button
     that says editing is on while the popover is closed. */
  function syncEditSwitch() {
    const sw = $('edit-btn');
    sw.classList.toggle('on', state.editing);
    sw.setAttribute('aria-checked', String(state.editing));
    $('view-btn').title = state.editing
      ? 'View — editing is on: the scores answer the pointer'
      : 'View — how the stand is laid out, and editing';
  }

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
    bpmValue.textContent = String(state.bpm);
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
    syncEditSwitch();
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

  /* Pairings saved before they were items (title, savedAt, songs,
     settings) are given an id, dates and isCustom, once, so the
     Librarian and a backup find the same shape in every record. */
  (function upgradeLibrary() {
    const raw = readJSON(PAIRINGS_KEY);
    if (!raw || typeof raw !== 'object') return;
    const old = Object.keys(raw).some(id => raw[id] && (!raw[id].id || !raw[id].updatedAt));
    if (old) writeLibrary(readLibrary());
  })();

  /* Before there was a sandbox, what was on the stand with no pairing
     open lived only in the session. It becomes the sandbox, once — before
     a link followed on this very visit can put something else on the
     stand. */
  (function sandboxFromOldSession() {
    if (!session || session.pairingId || !session.songs) return;
    const lib = readLibrary();
    if (lib[SANDBOX_ID]) return;
    const songs = { poem: cleanSong(session.songs.poem), ost: cleanSong(session.songs.ost) };
    if (!songs.poem && !songs.ost) return;
    const now = Date.now();
    lib[SANDBOX_ID] = { id: SANDBOX_ID, title: SANDBOX_TITLE, isCustom: true, createdAt: now, updatedAt: now,
                        songs: songs, settings: Object.assign(clone(DEFAULT_SETTINGS), settingsRecord()) };
    writeLibrary(lib);
  })();

  if (linkPair) {
    openLinkPairing(linkPair, { boot: true });
  } else if (session) {
    /* What was on the stand last time, saved or not. The pairing it
       belonged to is looked up again: deleted since, the work on the stand
       becomes the sandbox's rather than being lost. */
    const lib = readLibrary();
    const id = session.pairingId && lib[session.pairingId] ? String(session.pairingId) : null;
    state.pairingId = id;
    state.name = id ? lib[id].title : '';
    state.shared = !!(id && lib[id].received);
    state.book = state.shared && lib[id].book ? String(lib[id].book) : '';
    state.autoSave = !!(id && !state.shared && session.autoSave === true);
    SIDES.forEach(side => {
      const song = session.songs && session.songs[side];
      if (song && (song.data || song.id)) {
        loadInto(side, song, { keepTempo: true, keepMutes: true, quiet: true });
      }
    });
  } else {
    /* No session at all: whatever the sandbox holds. */
    const sb = readLibrary()[SANDBOX_ID];
    if (sb) {
      adoptSettings(Object.assign(clone(DEFAULT_SETTINGS), sb.settings || {}));
      SIDES.forEach(side => {
        const song = sb.songs[side];
        if (song) loadInto(side, song, { keepTempo: true, keepMutes: true, quiet: true });
      });
    }
  }

  connectShelf();
  syncAll();
  document.body.classList.add('booting');
  setTimeout(endBooting, 3000);        // never leave the scores hidden
  SIDES.forEach(bootFrame);
})();

/* ==========================================================================
   Song Writer — studio-bridge.js
   --------------------------------------------------------------------------
   window.SongWriterStudio (version 1) — a song, as notes, for the
   Recording Studio (../Recording Studio/, README "Bringing songs in").

   Only inside the studio's hidden frame (?embed=studio, js/embed.js — the
   storage there is a read-through layer, so nothing here can write the
   user's songs). Anywhere else this file does nothing.

     listSongs()    [{ id, title, updatedAt, sandbox?, starter?, received?, book? }]
                    the live library (read past anything this frame wrote),
                    in the Library window's order: the sandbox, the Teacher
                    Library books (A–Z, each book's songs by title), Shared
                    with you, Your songs, the three examples (starter)
     open(id)       opens that song in this frame (memory only) → plan | null
     load(record)   { title, score } — or a whole library record, a share
                    link's payload, a 1.0 { title, content } — → plan | null

   THE PLAN is what js/player.js plays from the top, read with the
   player's own modules (SW.timing.song, SW.track.events, SW.chords.midis)
   and its own numbers, whatever Sound → Melody / Chords say:
     { title, key, scale, meter, bpm, beatTicks, barTicks,
       pickupTicks,       ticks from 0 to the first downbeat (0: none)
       totalTicks,        the longer of the melody and the chord track
       melody: [{ midi, at, ticks, level }],        every pitch struck; a tie once, held for the chain
       chords: [{ midis, at, ticks, level, name, id }],   every chord strike
       sounds: { melody, chords, melodyVolume, chordVolume, room } }   SW.audio.mix()
   Ticks: 24 to a quarter (a 6/8 beat is 36); `bpm` counts beats (dotted
   quarters in compound time). `ticks` is how long the player holds it:
   a note × 0.96 (a tie: the whole chain), a chord strike × 0.95.
   `level` is the engine's per-note level, as lib/audio.js schedule() and
   render() take it (1 = as play() would): a melody note 0.42 / 0.42 = 1,
   in a column with harmony 0.3 / 0.42; a chord 0.75 (SW.audio.CHORD_LEVEL),
   all its notes in ONE schedule() call (the engine evens out a chord's
   loudness and strums it 6 ms). Each side's own level is 0.8 × its volume,
   Room is setReverb(room). tone() never holds a note under 0.08 s.

   Opening a song saves nothing and leaves the frame silent.
   ========================================================================== */
(function () {
  'use strict';
  const EMBED = window.EVM_STUDIO_EMBED;
  if (!EMBED) return;
  const SW = window.SW;
  const S = SW.state;
  const L = SW.library;

  /* js/player.js schedulePass's numbers — keep them in step */
  const MELODY_LEVEL = 0.42, HARMONY_LEVEL = 0.3, MELODY_HOLD = 0.96, CHORD_HOLD = 0.95;

  function quiet() { if (SW.player) SW.player.stop(); }

  function chordName(id) {
    try { return SW.chords.nameOf(SW.chords.describe(id)) || id; } catch (e) { return id; }
  }

  /* The song on screen in this frame, planned whole from tick 0. */
  function plan(title) {
    const song = SW.timing.song();
    const mt = song.meter;
    const g = SW.track ? SW.track.grid(song) : null;
    const events = g ? SW.track.events(g) : [];
    const total = Math.max(song.total, events.end || 0);
    const from = 0;

    const melody = [];
    song.lines.forEach(le => le.events.forEach(ev => {
      if (ev.at < from || ev.at >= total || ev.rest) return;
      const level = (ev.pitches.length > 1 ? HARMONY_LEVEL : MELODY_LEVEL) / SW.audio.PLAYER_PEAK;
      ev.pitches.forEach(p => {
        // a tie: the pitch is still sounding from the note before, held for the whole chain
        if (ev.tiedIn && ev.tiedIn.has(p.midi) && ev.at !== from) return;
        const hold = ev.sustain && ev.sustain.get(p.midi) ? ev.sustain.get(p.midi) : ev.ticks;
        melody.push({ midi: p.midi, at: ev.at, ticks: hold * MELODY_HOLD, level });
      });
    }));

    const chords = [];
    events.forEach(ce => {
      if (ce.end <= from || ce.at >= total) return;
      const list = ce.id && SW.chords.isKnown(ce.id) ? SW.chords.midis(ce.id, { voice: ce.voice }) : [];   // its own notes, when it has them
      if (!list.length) return;
      const name = chordName(ce.id);
      ce.strikes.forEach(st => {
        const sEnd = Math.min(st.at + st.len, total);
        if (sEnd <= from || st.at >= total) return;
        const s0 = Math.max(st.at, from);
        chords.push({ midis: list.slice(), at: s0, ticks: (sEnd - s0) * CHORD_HOLD, level: SW.audio.CHORD_LEVEL, name, id: ce.id });
      });
    });

    return {
      title: title || 'Untitled Song',
      key: S.key,
      scale: SW.chords.scaleId(),
      meter: mt.id,
      bpm: S.bpm || 100,                       // as SW.timing.tickMs reads it
      beatTicks: mt.beatTicks,
      barTicks: mt.barTicks,
      pickupTicks: song.pickup || 0,
      totalTicks: total,
      melody,
      chords,
      sounds: Object.assign({}, SW.audio.mix())
    };
  }

  /* ---------------- the library ---------------- */
  function liveLibrary() {
    EMBED.forget(L.STORAGE_KEY);
    return L.getStoredLibrary();
  }

  function listSongs() {
    const lib = liveLibrary();
    const shelf = id => !!(window.EVMShelf && EVMShelf.isShelfSong(lib[id]));
    const item = (id, extra) => {
      const raw = lib[id];
      const out = { id, title: L.normalizeSong(raw, id).title, updatedAt: raw.updatedAt || raw.createdAt || 0 };
      if (raw.received) out.received = true;
      if (shelf(id)) out.book = String(raw.book);
      return Object.assign(out, extra || {});
    };
    const out = [];
    if (lib[L.SANDBOX_ID]) out.push(item(L.SANDBOX_ID, { title: 'Sandbox', sandbox: true }));
    // as the Library window lists them (library.js renderLibrarySongList)
    const ids = L.getSortedSongIds(lib);
    const byBook = {};
    ids.filter(shelf).forEach(id => { (byBook[lib[id].book] = byBook[lib[id].book] || []).push(id); });
    Object.keys(byBook).sort((a, b) => a.localeCompare(b)).forEach(book => {
      byBook[book].sort((a, b) => String(lib[a].title).localeCompare(String(lib[b].title))).forEach(id => out.push(item(id)));
    });
    const rest = ids.filter(id => !shelf(id));
    const shared = rest.filter(id => lib[id].received);
    const starters = rest.filter(id => L.isDefaultId(id) && !lib[id].isCustom);
    const own = rest.filter(id => shared.indexOf(id) === -1 && starters.indexOf(id) === -1);
    shared.concat(own).forEach(id => out.push(item(id)));
    starters.forEach(id => out.push(item(id, { starter: true })));
    return out;
  }

  function open(id) {
    if (id === undefined || id === null) return null;
    try {
      liveLibrary();
      quiet();
      if (!L.loadSongById(String(id))) return null;
      return plan(L.currentTitle());
    } catch (e) {
      console.error('SongWriterStudio.open:', e);
      return null;
    }
  }

  function load(record) {
    if (!record || typeof record !== 'object') return null;
    if (!(record.score && typeof record.score === 'object') && typeof record.content !== 'string') return null;
    try {
      const rec = L.normalizeSong(record, record.id || 'studio');
      if (!rec) return null;
      quiet();
      // drawn as the Library opens a song (loadSongById), without filing it anywhere
      SW.settings.usePieceLayout(rec.layout, !!rec.received);
      SW.score.render(rec.score);
      return plan(rec.title);
    } catch (e) {
      console.error('SongWriterStudio.load:', e);
      return null;
    }
  }

  window.SongWriterStudio = { version: 1, listSongs, open, load };
})();

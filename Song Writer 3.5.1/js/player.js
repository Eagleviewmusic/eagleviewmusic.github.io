/* ==========================================================================
   Song Writer — player.js
   --------------------------------------------------------------------------
   SW.player   Plays the song on its own, in time: every column in turn at
               the song's tempo, notes ringing for their written length,
               blocks for one beat, rests silent, each line padded to its
               last bar. The selection follows along (silently, so the
               scheduled sound is the only sound), which also scrolls the
               stage, slides the keyboard dock and lights the sounding
               word and column (View → While it plays → Light up).

   Everything is placed on the audio clock — a setTimeout would drift. A
   pass is planned up front, but its sounds are laid on the clock only a
   moment ahead of the music (LOOKAHEAD): laying a whole song down at once
   (2026-10-12, a 56-bar song with its chords, some 8,400 audio nodes)
   overloaded the audio — its clock crawled at a quarter speed and the
   start went silent. A timer loop tops the sounds up and moves the
   highlight when the clock passes each cue, allowing for the output's
   latency so the light changes with the sound.

   THE FAMILY'S START (EVM Library/evm-count-in.js, as in Rhythm Poetry,
   Ostinato Builder and the Music Stand): Play shows ■ at once, puts up
   the "Get ready" card when Count-in is on, waits for the sound to be
   ready (EVMCountIn.prime — a sleeping Bluetooth or HDMI speaker would
   swallow the first click), then anchors beat one on the clock. A Stop
   while it is getting ready cancels the start (playToken).

   SOUND (the popover; SW.state.sound, reset each visit):
     melody    the notes of the song
     Chords    the chord track (js/track.js): every strike of every
               chord, in its rhythm, on the audio clock — or an old
               song's lane chords, read by the track as loose chords
               (View pref laneChordsPlay — on, they are heard whatever is out)
     beat      a soft tick on every beat
     countIn   one bar first (two when the bar has two beats); when Play
               starts in a line's pick-up, the count stops where the
               pick-up comes in (a beat's pick-up: 1 2 3 · pick-up on 4;
               an eighth's: 1 2 3 4 · pick-up on the "and")
     atEnd     'stop'  — stop at the end (2.0's behaviour)
               'round' — go round from where Play began, re-anchored at
                         the end of the last pass so nothing drifts
               'line'  — play the selected line over and over

   TIES (timing.js): a tied pitch is struck once and held for the whole
   chain; the notes it is held over into only move the light.

   SWING (timing.js SWING, Setup → Swing): every sound and cue is placed
   through the run's bend (run.sw) — ticks stay straight, the clock is
   bent. A change of swing while playing re-times the run, as a change
   of tempo does (during the count-in too: the music is laid down again
   from beat one, the clicks left alone).

   PARTS (2026-11-03, js/parts.js): every part plays. The part on the page
   is the run's melody as always — read from the page, its words and
   columns lit as it goes; the other parts are read from their model
   lines (SW.timing.songOf) and laid on the clock beside it, each with its
   own sound and volume (SW.audio.tone's `meta`), nothing lit. Sound →
   Melody is all of them; the run lasts as long as the longest part.

   THE CHORD TRACK can run past the melody (sixty bars of chords under
   three of tune): a run lasts as long as the longer of the two. Past
   the melody there is no word to light; the chords are announced as
   they come (the keyboard, the corner) and each bar is announced
   ('track:bar') for the chart to light. A chord already ringing where a
   pass starts is struck there for what is left of it.

   Play starts from the selected column, or from the top when nothing is
   selected (SW.player.playFrom(tick) starts anywhere — past the melody
   too). Stop leaves the selection where the music was, so the next
   Play carries on from there; a run that reaches the end lets the
   selection go, so the next Play starts from the top (1.0's "past the
   end, nothing is selected").

   API
     SW.player.toggle()   play / stop
     SW.player.play()     start (from the selection)
     SW.player.playFrom(tick, opts?)   start at a tick of the song (the Chords window). opts (2026-10-28,
                                the Chord Chart's sound wave): loop — [a, z] round those ticks, true round
                                the whole song from its top, false once; once: true — the [a, z] span one
                                time through; melody / chords / beat — true or false over Sound's own;
                                countIn: false — straight in; preview: { k, at, voice } — the chords from
                                card k (and the one at tick `at`) sound with that voice (Focus, unsaved;
                                a list of them when Focus compares chords, 2026-10-30);
                                events: the chords to play instead of the song's (an expand() list, or a
                                function of the grid giving one — the Time Line's draft, 2026-10-29);
                                song: the song to play instead of SW.timing.song() (an object of its shape,
                                or a function giving one — the draft's sections in their new order)
     SW.player.replan()         playing: the same run planned again from where the music is (no count-in)
     SW.player.position()       where the music is now (ticks), or null
     SW.player.stop()
     SW.player.playing    boolean
   events: 'play:changed' { playing }
           'part:sounding' { part, at, rest } — another part's note is sounding (PARTS; its drawn note lights)
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;

  const START_GAP = 0.1;      // seconds between the sound being ready and beat one
  const HANDOVER = 0.3;       // the next pass is laid down this long before it is due
  const LOOKAHEAD = 1.5;      // seconds of sound on the clock ahead of the music

  let voices = [];            // { o: oscillator, start, end } scheduled for this run
  let pending = [];           // sounds planned but not yet on the clock: { t, play } in time order
  let pendingIndex = 0;
  let cues = [];              // [{ t (ctx seconds), ev, chord? }] in order
  let cueIndex = 0;
  let loopTimer = 0;
  let passTimer = 0;
  let playToken = 0;          // a start still getting ready is dropped if this moves
  let run = null;             // the run in progress (see play)
  let soundingSyl = null;
  let soundingStack = null;   // the column itself (View → Light up → Note)

  const ctx = () => SW.audio.context();
  const latency = () => { const ac = ctx(); return ac.outputLatency || ac.baseLatency || 0; };

  function setPlaying(on) {
    S.playing = on;
    document.body.classList.toggle('playing', on);
    SW.bus.emit('play:changed', { playing: on });
  }

  /* .sounding on the word and on the column that is sounding: style.css
     and staff.js light them as View → While it plays → Light up says. */
  function markSounding(syl, stack) {
    if (soundingStack !== (stack || null)) {
      if (soundingStack) soundingStack.classList.remove('sounding');
      soundingStack = stack || null;
      if (soundingStack) soundingStack.classList.add('sounding');
    }
    if (soundingSyl === syl) return;
    if (soundingSyl) soundingSyl.classList.remove('sounding');
    soundingSyl = syl || null;
    if (soundingSyl) soundingSyl.classList.add('sounding');
  }

  function silence() {
    voices.forEach(v => { try { v.o.stop(); } catch (e) {} });
    voices = [];
    pending = [];
    pendingIndex = 0;
  }

  /* Lay on the clock every planned sound due before now + LOOKAHEAD. */
  function pump() {
    const now = ctx().currentTime;
    while (pendingIndex < pending.length && pending[pendingIndex].t <= now + LOOKAHEAD) pending[pendingIndex++].play();
    if (pendingIndex > 256) { pending = pending.slice(pendingIndex); pendingIndex = 0; }
    if (voices.length > 256) voices = voices.filter(v => v.end > now);
  }

  function stop() {
    playToken++;
    clearTimeout(loopTimer);
    clearTimeout(passTimer);
    loopTimer = passTimer = 0;
    if (window.EVMCountIn) EVMCountIn.close();
    silence();
    cues = [];
    run = null;
    markSounding(null);
    if (S.playing) setPlaying(false);
  }

  /* ---------------- the plan ---------------- */
  function flatten(song) {
    const all = [];
    song.lines.forEach(le => le.events.forEach(ev => { ev.line = le; all.push(ev); }));
    return all;
  }

  /* Sound → Chords alone (2026-10-05): not the chord track being out, not the workspace, not Edit —
     only a lesson that leaves the chords out altogether silences them */
  // Sound → Chords; and chords hidden (the Chords switch / Look → Display Chords Off) only while Sound → Hear hidden parts is on
  function chordsHeard() {
    return !!SW.settings.view.laneChordsPlay && (!SW.lessons || SW.lessons.shellAllows('strip')) &&
      (SW.settings.shows('lane') || SW.settings.view.hearHidden !== false);
  }

  /* What a run plays: the first pass, and (for the two loops) the span
     every later pass repeats. Ticks are absolute, from the song's top.
     The song lasts as long as the longer of the melody and the chord
     track. `fromTick`: where to start (else the selection, else the top). */
  let heardWith = null;                // the page and the chords shown when the run was planned (a change replans: see below)
  function makePlan(fromTick, opts) {
    const o = opts || {};
    const song = (typeof o.song === 'function' ? o.song() : o.song) || SW.timing.song();   // the Time Line's draft: its sections in its order
    const all = flatten(song);
    // the other parts, from the model (PARTS): { part, meta, all, total }
    const focus = SW.parts.focused();
    const others = [];
    // which: the PITCH page plays the part on it alone (the user: blocks are pitch, not rhythm — a half
    // over an eighth would put every chord after it out of line); Notation and Rhythm play every part,
    // or with Sound → Hear hidden parts off only the parts turned on (parts.js SHOWN)
    const pitchPage = document.body.dataset.page === 'pitch';
    heardWith = { page: document.body.dataset.page, chords: SW.settings.shows('lane') };
    const hearAll = SW.settings.view.hearHidden !== false;
    for (let i = 0; i < SW.parts.count(); i++) {
      if (i === focus || pitchPage || (!hearAll && !SW.parts.isShown(i))) continue;
      const sg = SW.parts.song(i);
      others.push({ part: i, meta: SW.parts.meta(i), all: flatten(sg), total: sg.total });
    }
    const g = SW.track ? SW.track.grid(song) : null;
    const own = typeof o.events === 'function' ? o.events(g) : o.events;     // the Time Line's draft: its chords, not the song's
    const chords = g && (o.chords !== undefined ? o.chords : chordsHeard()) ? (own || SW.track.events(g)) : [];
    const total = Math.max(song.total, chords.end || 0, ...others.map(p => p.total));
    if (!all.length && !chords.length && !others.some(p => p.all.length)) return null;
    let startTick = 0;
    if (typeof fromTick === 'number' && isFinite(fromTick)) startTick = Math.max(0, Math.min(Math.round(fromTick), total - 1));
    else {
      const active = all.length ? SW.score.getActiveNote() : null;
      const activeStack = active ? active.closest('.harmony-stack') : null;
      const from = activeStack ? all.findIndex(ev => ev.stack === activeStack) : -1;
      const chordAt = SW.ctrack ? SW.ctrack.selectedTick() : null;      // a chord selected in the chord track
      startTick = from >= 0 ? all[from].at : chordAt !== null ? Math.min(chordAt, total - 1) : 0;
    }
    const base = { song, all, chords, g, total, preview: o.preview || null, others, meta: SW.parts.meta(focus),
      melody: o.melody !== undefined ? !!o.melody : !!S.sound.melody, beat: o.beat !== undefined ? !!o.beat : !!S.sound.beat };
    // the Chord Chart's wave: round a span, round the whole song from its top, or once
    if (Array.isArray(o.loop)) {
      const span = [Math.max(0, o.loop[0]), Math.min(total, o.loop[1])];
      if (span[1] > span[0]) {
        const at = startTick >= span[0] && startTick < span[1] ? startTick : span[0];
        return Object.assign(base, { first: [at, span[1]], loop: o.once ? null : span, mode: 'span' });
      }
    }
    if (o.loop === true) return Object.assign(base, { first: [startTick, total], loop: [0, total], mode: 'song' });
    if (o.loop === false) return Object.assign(base, { first: [startTick, total], loop: null, mode: 'stop' });
    const mode = S.sound.atEnd;
    if (mode === 'line') {
      const le = song.lines.find(l => startTick >= l.at && startTick < l.at + l.padded);
      let span;
      if (le) span = [le.at, le.at + le.padded];
      else {
        // past the melody: the row of four bars it is in (counted from the bar after the melody)
        const first = g.lastBar + 1;
        const row = first + 4 * Math.max(0, Math.floor((g.barAt(startTick) - first) / 4));
        span = [Math.max(0, g.T(row)), Math.min(g.T(row + 4), total)];
      }
      return Object.assign(base, { first: [startTick, span[1]], loop: span, mode });
    }
    return Object.assign(base, { first: [startTick, total], loop: mode === 'round' ? [startTick, total] : null, mode });
  }

  /* Lay one pass down on the clock: [fromTick, toTick) starting at audio
     time `anchor`. Returns when the pass ends. `resumed`: picking the
     music up mid-pass (a change of tempo), so a chord already sounding is
     not struck again. SWING: `anchor` is where fromTick falls on the
     straight beat grid (the count-in's, the pass before's), so a swung
     note there sounds a little after it; `clock` (a re-timing) says
     instead which point of the bent clock `anchor` is. */
  function schedulePass(plan, fromTick, toTick, anchor, tickSec, resumed, clock) {
    const sw = run.sw;                          // the swing (timing.js SWING): straight when there is none
    const c0 = clock === undefined ? fromTick : clock;
    run.c0 = c0;
    const secs = t => (sw.at(t) - c0) * tickSec;
    const melody = plan.melody;
    const mt = plan.song.meter;
    const newCues = [];
    const sounds = [];          // this pass's sounds, laid on the clock by pump()

    /* a part's notes: the page's part with its cues (the light), the
       others sound alone (PARTS) */
    const layPart = (evs, meta, cueing, part) => evs.forEach(ev => {
      if (ev.at < fromTick || ev.at >= toTick) return;
      const at = anchor + secs(ev.at);
      const dur = sw.len(ev.at, ev.ticks) * tickSec;
      if (cueing) newCues.push({ t: at, ev });
      else newCues.push({ t: at, pev: ev, part });              // another part's note: lit where it is drawn ('part:sounding')
      if (ev.rest || !melody) return;
      // js/studio-bridge.js copies these numbers (0.42 / 0.3, 0.96 below, 0.95 for chords): keep them in step
      const level = ev.pitches.length > 1 ? 0.3 : 0.42;
      ev.pitches.forEach(p => {
        // a tie: the pitch is still sounding from the note before (unless
        // the pass starts here), and a tied note sounds for the whole chain
        if (ev.tiedIn && ev.tiedIn.has(p.midi) && ev.at !== fromTick) return;
        const hold = ev.sustain && ev.sustain.get(p.midi) ? sw.len(ev.at, ev.sustain.get(p.midi)) * tickSec : dur;
        sounds.push({ t: at, play: () => {
          const o = SW.audio.tone(M.midiToFreq(p.midi), at, hold * 0.96, level, meta);
          if (o) voices.push({ o, start: at, end: at + hold + 0.1 });
        } });
      });
    });
    layPart(plan.all, plan.meta, true);
    plan.others.forEach(p => layPart(p.all, p.meta, false, p.part));
    if (plan.others.length) newCues.sort((x, y) => x.t - y.t);

    // THE CHORD TRACK (js/track.js): each strike in its rhythm. A pass that
    // starts inside a ringing strike sounds it at once for what is left
    // (unless it is a re-timing: then it is still ringing)
    plan.chords.forEach(ce => {
      if (ce.end <= fromTick || ce.at >= toTick) return;
      // Focus, unsaved: a chord from card k (or the one at tick `at`) sounds with that voice — several at once when it compares chords
      const pvs = !plan.preview ? [] : Array.isArray(plan.preview) ? plan.preview : [plan.preview];
      const pvAt = pvs.find(p => p.at !== undefined && p.at !== null && ce.at <= p.at && p.at < ce.end);
      const pvK = pvs.find(p => p.k && ce.k === p.k);
      const pv = (pvAt || pvK) ? (pvAt || pvK).voice : null;
      // a chord in the song always plays (Layout settings govern building, not hearing); its own notes, when it has them; in its bar's key (KEY CHANGES)
      const list = ce.id && SW.chords.isKnown(ce.id) ? M.withKey(SW.keys.atTick(ce.at), () => SW.chords.midis(ce.id, { voice: pv || ce.voice })) : [];
      newCues.push({ t: anchor + secs(Math.max(ce.at, fromTick)), chord: list.length ? { id: ce.id, list } : null, track: ce });
      if (!list.length) return;
      ce.strikes.forEach(st => {
        const freqs = SW.track.strikeNotes(list, st).map(M.midiToFreq);        // an arpeggio: its notes one by one, each ringing on (track.js)
        const sEnd = Math.min(st.at + SW.track.strikeHold(st), toTick);
        if (sEnd <= fromTick || st.at >= toTick) return;
        let s0 = st.at;
        if (s0 < fromTick) { if (resumed) return; s0 = fromTick; }
        const when = anchor + secs(s0);
        const hold = sw.len(s0, sEnd - s0) * tickSec * 0.95;
        sounds.push({ t: when, play: () => {
          SW.audio.playChordFrequencies(freqs, when, hold).forEach(o => voices.push({ o, start: when, end: when + hold + 0.1 }));
        } });
      });
    });
    if (plan.chords.length) {
      // the melody's end, when the chords go on: the light leaves the last word
      const mEnd = plan.song.total;
      if (mEnd > fromTick && mEnd < toTick) newCues.push({ t: anchor + secs(mEnd), melodyEnd: true });
      // each bar past the melody, and each of an instrumental line's (the chart lights them)
      const g = plan.g;
      const barCue = b => { if (g.T(b) >= fromTick || b === g.barAt(fromTick)) newCues.push({ t: anchor + secs(Math.max(g.T(b), fromTick)), bar: b }); };
      for (let b = Math.max(g.lastBar + 1, g.barAt(fromTick)); g.T(b) < toTick; b++) barCue(b);
      plan.song.lines.forEach(le => {
        if (!le.bars) return;
        for (let b = g.barAt(le.at), k = 0; k < le.bars; b++, k++) if (g.T(b + 1) > fromTick && g.T(b) < toTick) barCue(b);
      });
      newCues.sort((x, y) => x.t - y.t);
    }

    // the steady beat: every beat in the span, the bar's first stronger
    // (a beat later with a pick-up: timing.js PICK-UP)
    if (plan.beat) {
      const bt = mt.beatTicks;
      const shift = plan.song.shift || 0;
      for (let t = Math.ceil((fromTick + shift) / bt) * bt - shift; t < toTick; t += bt) {
        const when = anchor + secs(t), strong = (t + shift) % mt.barTicks === 0;
        sounds.push({ t: when, play: () => {
          const o = SW.audio.click(when, strong, true);
          if (o) voices.push({ o, start: when, end: when + 0.1 });
        } });
      }
    }

    // keep only what is still to sound, then add this pass's cues and sounds
    const now = ctx().currentTime;
    voices = voices.filter(v => v.end > now);
    cues = cues.slice(cueIndex).concat(newCues);
    cueIndex = 0;
    pending = pending.slice(pendingIndex).concat(sounds).sort((x, y) => x.t - y.t);
    pendingIndex = 0;
    pump();
    return anchor + secs(toTick);
  }

  /* After a pass: the next one (a loop) is laid down just before it is
     due, anchored exactly where this one ends. */
  function planNextPass(plan, passEnd) {
    if (!run) return;
    run.passEnd = passEnd;
    clearTimeout(passTimer);
    const wait = Math.max(0, (passEnd - HANDOVER - ctx().currentTime) * 1000);
    passTimer = setTimeout(() => {
      if (!run || !plan.loop) return;
      run.passFrom = plan.loop[0];
      run.passTo = plan.loop[1];
      run.anchor = passEnd;
      planNextPass(plan, schedulePass(plan, plan.loop[0], plan.loop[1], passEnd, run.tickSec));
    }, wait);
  }

  /* ---------------- the count-in ---------------- */
  /* Where in its bar a start inside a line's pick-up falls (ticks from
     the bar line before it), or 0 when it is not in one. */
  function intoPickup(plan, start) {
    const le = plan.song.lines.find(l => start >= l.at && start < l.at + Math.max(l.padded, l.total));
    if (!le || !le.pickup || start - le.at >= le.pickup) return 0;
    const B = plan.song.meter.barTicks;
    return ((start + plan.song.shift) % B + B) % B;
  }
  /* `endAt`: when the music comes in, if not on the beat after the last
     click (a pick-up that starts off the beat). */
  function scheduleCountIn(from, beatSec, n, perBar, endAt) {
    const ac = ctx();
    const times = [];
    for (let i = 0; i < n; i++) {
      const time = from + i * beatSec;
      const o = SW.audio.click(time, i % perBar === 0, false);
      if (o) voices.push({ o, start: time, end: time + 0.1 });
      times.push(EVMCountIn.heardAt(ac, time));
    }
    const end = endAt || from + n * beatSec;
    EVMCountIn.run(times, EVMCountIn.heardAt(ac, end));
    return end;
  }

  /* ---------------- play ---------------- */
  async function play(fromTick, opts) {
    stop();
    const plan = makePlan(fromTick, opts);
    if (!plan) { SW.ui.toast('Nothing to play yet'); return; }
    const hasChords = plan.chords.some(c => c.strikes.length && c.id && SW.chords.isKnown(c.id));
    if (!plan.melody && !hasChords && !plan.beat) {
      SW.ui.toast('The melody is off in Sound, and there are no chords to hear');
      return;
    }
    const token = playToken;
    setPlaying(true);
    const mt = plan.song.meter;
    let count = S.sound.countIn && window.EVMCountIn && !(opts && opts.countIn === false) ? EVMCountIn.beats(mt.beats) : 0;
    // into a pick-up, the count's last bar stops where the pick-up comes in:
    // the clicks at or after it are left out, and the music starts there
    const start = plan.first[0];
    const into = intoPickup(plan, start);
    if (count && into) count -= mt.beats - Math.ceil(into / mt.beatTicks);
    if (count) EVMCountIn.open(count, mt.beats);

    const ac = ctx();
    const ready = window.EVMCountIn ? await EVMCountIn.prime(ac, { warm: count ? 0.35 : 0.12 }) : true;
    if (token !== playToken) return;              // stopped while it was getting ready
    if (!ready) {
      stop();
      SW.ui.toast('The sound would not start — press Play again');
      return;
    }

    const tickSec = SW.timing.tickMs() / 1000;
    let t = ac.currentTime + START_GAP;
    if (count) t = scheduleCountIn(t, mt.beatTicks * tickSec, count, mt.beats,
      into ? t + (count - Math.ceil(into / mt.beatTicks) + into / mt.beatTicks) * mt.beatTicks * tickSec : 0);
    run = { plan, tickSec, sw: swingOf(plan), anchor: t, passFrom: plan.first[0], passTo: plan.first[1], passEnd: 0, opts: opts || null };
    cues = [];
    cueIndex = 0;
    const end = schedulePass(plan, plan.first[0], plan.first[1], t, tickSec);
    planNextPass(plan, end);
    loop();
  }

  /* Move the highlight when the clock passes each cue. */
  function loop() {
    if (!S.playing || !run) return;
    pump();
    const now = ctx().currentTime - latency();
    while (cueIndex < cues.length && cues[cueIndex].t <= now + 0.02) {
      const cue = cues[cueIndex++];
      const ev = cue.ev;
      if (ev) {
        if (!document.contains(ev.stack)) { stop(); return; }
        const first = ev.stack.querySelector('.note');
        if (first) SW.score.setNoteAsActive(first, false);
        markSounding(ev.syllable, ev.stack);
      }
      // the keyboard's chord wash and the corner go with the chord panel; without it the chords are only heard
      if (cue.chord && SW.settings.panelOut()) SW.chords.announce(cue.chord.id, cue.chord.list, 'track');
      if (cue.track) SW.bus.emit('track:sounding', { at: cue.track.at, event: cue.track });
      if (cue.melodyEnd) markSounding(null);
      if (cue.pev) SW.bus.emit('part:sounding', { part: cue.part, at: cue.pev.at, rest: !!cue.pev.rest });
      if (cue.bar) SW.bus.emit('track:bar', { bar: cue.bar });
    }
    if (!run.plan.loop && cueIndex >= cues.length && now >= run.passEnd + 0.05) {
      finish();
      return;
    }
    loopTimer = setTimeout(loop, 16);
  }

  /* The end of the song (At the end: Stop): the selection lets go, so
     the next Play starts from the top. */
  function finish() {
    stop();
    if (SW.score.deselect) SW.score.deselect('afterEnd');
  }

  /* the run's bend (timing.js SWING), on the grid of the song it plays */
  function swingOf(plan) { return SW.timing.swing(plan.song.shift || 0, plan.song.meter); }
  /* where the music is in a pass `x` seconds after its anchor (ticks) */
  function tickAfter(x) { return Math.max(run.passFrom, Math.min(run.passTo, run.sw.back(run.c0 + x / run.tickSec))); }

  /* A tempo change while playing takes effect from where the music is,
     without starting again or counting in: whatever is sounding rings
     on, and the rest of the pass is laid down again from this exact
     point (the part of the beat still to go, at the new tempo). A
     change of swing does the same — and while counting in it lays the
     music down again from beat one, leaving the clicks as they are. */
  function retime(why) {
    if (!S.playing || !run) return;
    const now = ctx().currentTime;
    const counting = now < run.anchor;
    if (counting && why !== 'swing') return;      // still counting in: this run keeps its tempo
    const plan = run.plan;
    const from = counting ? run.anchor : now;
    // where the music is: the time on the bent clock (the same under any swing — the beats never move),
    // and the tick there, read with the bend it was laid down with
    const clock = run.c0 + (now - run.anchor) / run.tickSec;
    const tickAt = counting ? run.passFrom : tickAfter(now - run.anchor);
    voices = voices.filter(v => {
      if (v.start > now && v.start >= from) { try { v.o.stop(); } catch (e) {} return false; }
      return true;
    });
    pending = [];                                 // what was still to come is planned again at the new tempo
    pendingIndex = 0;
    clearTimeout(passTimer);
    cues = cues.filter(c => c.t <= now);
    cueIndex = Math.min(cueIndex, cues.length);
    run.tickSec = SW.timing.tickMs() / 1000;
    run.sw = swingOf(plan);
    run.passFrom = tickAt;
    run.anchor = from;
    // from the count-in's beat, or from this point of the clock (a note the new swing puts just before it sounds at once)
    planNextPass(plan, schedulePass(plan, tickAt, run.passTo, from, run.tickSec, !counting, counting ? undefined : clock));
  }

  function toggle() { if (S.playing) stop(); else play(); }

  /* The same run, planned again from where the music is — a chord's notes
     changed on the Chord Chart while it plays (straight on: no count-in) */
  function replan() {
    if (!S.playing || !run) return;
    const at = position();
    play(at === null ? run.passFrom : Math.floor(at), Object.assign({}, run.opts || {}, { countIn: false }));
  }

  /* Where the music is now, in ticks from the song's top (null when not
     playing; the starting point while counting in) — the chord map's
     playhead (progression-window.js). */
  function position() {
    if (!S.playing || !run) return null;
    const now = ctx().currentTime - latency();
    if (now < run.anchor) return run.passFrom;
    return tickAfter(now - run.anchor);
  }

  // any redraw or edit of the song ends a run (the schedule no longer
  // matches); a change of tempo or swing re-times it instead
  SW.bus.on('score:changed', d => {
    if (d && (d.reason === 'tempo' || d.reason === 'swing')) retime(d.reason);
    else if (d && (d.reason === 'chart' || d.reason === 'part-sound' || d.reason === 'part-volume' || d.reason === 'part-clef')) replan();   // the Chord Chart, a part's sound or clef: the music goes on
    else stop();
  });
  ['score:loaded', 'key:changed'].forEach(evt => SW.bus.on(evt, stop));
  // Sound → Hear hidden parts, or a part turned on or off while only the parts on are heard: the music goes on with it
  SW.bus.on('sound:changed', d => { if (d && 'hearHidden' in d) replan(); });
  SW.bus.on('parts:shown', () => { if (SW.settings.view.hearHidden === false) replan(); });
  // to or from the Pitch page (the part on it alone): the music goes on with the parts it now plays
  // … or the chords shown or hidden while only what shows is heard
  // (against what the run was planned with: makePlan notes it)
  SW.bus.on('view:changed', () => {
    if (!S.playing || !heardWith) return;
    const p = document.body.dataset.page, c = SW.settings.shows('lane');
    if (p !== heardWith.page || (SW.settings.view.hearHidden === false && c !== heardWith.chords)) replan();
  });
  SW.bus.on('meter:changed', d => { if (!d || d.what !== 'tempo') stop(); });

  SW.player = { play: () => play(), playFrom: (tick, opts) => play(tick, opts), stop, toggle, position, replan, get playing() { return S.playing; } };
})();

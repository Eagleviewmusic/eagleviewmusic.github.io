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
   pass is scheduled up front (songs are short), and a timer loop moves
   the highlight when the clock passes each cue, allowing for the
   output's latency so the light changes with the sound.

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
     SW.player.playFrom(tick)   start at a tick of the song (the chord track's window)
     SW.player.position()       where the music is now (ticks), or null
     SW.player.stop()
     SW.player.playing    boolean
   events: 'play:changed' { playing }
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const S = SW.state;
  const M = SW.music;

  const START_GAP = 0.1;      // seconds between the sound being ready and beat one
  const HANDOVER = 0.3;       // the next pass is laid down this long before it is due

  let voices = [];            // { o: oscillator, start, end } scheduled for this run
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
  function chordsHeard() { return !!SW.settings.view.laneChordsPlay && (!SW.lessons || SW.lessons.shellAllows('strip')); }

  /* What a run plays: the first pass, and (for the two loops) the span
     every later pass repeats. Ticks are absolute, from the song's top.
     The song lasts as long as the longer of the melody and the chord
     track. `fromTick`: where to start (else the selection, else the top). */
  function makePlan(fromTick) {
    const song = SW.timing.song();
    const all = flatten(song);
    const g = SW.track ? SW.track.grid(song) : null;
    const chords = g && chordsHeard() ? SW.track.events(g) : [];
    const total = Math.max(song.total, chords.end || 0);
    if (!all.length && !chords.length) return null;
    let startTick = 0;
    if (typeof fromTick === 'number' && isFinite(fromTick)) startTick = Math.max(0, Math.min(Math.round(fromTick), total - 1));
    else {
      const active = all.length ? SW.score.getActiveNote() : null;
      const activeStack = active ? active.closest('.harmony-stack') : null;
      const from = activeStack ? all.findIndex(ev => ev.stack === activeStack) : -1;
      const chordAt = SW.ctrack ? SW.ctrack.selectedTick() : null;      // a chord selected in the chord track
      startTick = from >= 0 ? all[from].at : chordAt !== null ? Math.min(chordAt, total - 1) : 0;
    }
    const base = { song, all, chords, g, total };
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
     not struck again. */
  function schedulePass(plan, fromTick, toTick, anchor, tickSec, resumed) {
    const secs = t => (t - fromTick) * tickSec;
    const melody = S.sound.melody;
    const mt = plan.song.meter;
    const newCues = [];

    plan.all.forEach(ev => {
      if (ev.at < fromTick || ev.at >= toTick) return;
      const at = anchor + secs(ev.at);
      const dur = ev.ticks * tickSec;
      const cue = { t: at, ev };
      newCues.push(cue);
      if (ev.rest || !melody) return;
      const level = ev.pitches.length > 1 ? 0.3 : 0.42;
      ev.pitches.forEach(p => {
        // a tie: the pitch is still sounding from the note before (unless
        // the pass starts here), and a tied note sounds for the whole chain
        if (ev.tiedIn && ev.tiedIn.has(p.midi) && ev.at !== fromTick) return;
        const hold = ev.sustain && ev.sustain.get(p.midi) ? ev.sustain.get(p.midi) * tickSec : dur;
        const o = SW.audio.tone(M.midiToFreq(p.midi), at, hold * 0.96, level);
        if (o) voices.push({ o, start: at, end: at + hold + 0.1 });
      });
    });

    // THE CHORD TRACK (js/track.js): each strike in its rhythm. A pass that
    // starts inside a ringing strike sounds it at once for what is left
    // (unless it is a re-timing: then it is still ringing)
    plan.chords.forEach(ce => {
      if (ce.end <= fromTick || ce.at >= toTick) return;
      const list = ce.id && SW.chords.isKnown(ce.id) ? SW.chords.midis(ce.id) : [];   // a chord in the song always plays (Layout settings govern building, not hearing)
      newCues.push({ t: anchor + secs(Math.max(ce.at, fromTick)), chord: list.length ? { id: ce.id, list } : null, track: ce });
      if (!list.length) return;
      const freqs = list.map(M.midiToFreq);
      ce.strikes.forEach(st => {
        const sEnd = Math.min(st.at + st.len, toTick);
        if (sEnd <= fromTick || st.at >= toTick) return;
        let s0 = st.at;
        if (s0 < fromTick) { if (resumed) return; s0 = fromTick; }
        const when = anchor + secs(s0);
        const hold = (sEnd - s0) * tickSec * 0.95;
        SW.audio.playChordFrequencies(freqs, when, hold).forEach(o => voices.push({ o, start: when, end: when + hold + 0.1 }));
      });
    });
    if (plan.chords.length) {
      // the melody's end, when the chords go on: the light leaves the last word
      const mEnd = plan.song.total;
      if (mEnd > fromTick && mEnd < toTick) newCues.push({ t: anchor + secs(mEnd), melodyEnd: true });
      // each bar past the melody (the chart lights them)
      const g = plan.g;
      for (let b = Math.max(g.lastBar + 1, g.barAt(fromTick)); g.T(b) < toTick; b++) {
        if (g.T(b) >= fromTick || b === g.barAt(fromTick)) newCues.push({ t: anchor + secs(Math.max(g.T(b), fromTick)), bar: b });
      }
      newCues.sort((x, y) => x.t - y.t);
    }

    // the steady beat: every beat in the span, the bar's first stronger
    // (a beat later with a pick-up: timing.js PICK-UP)
    if (S.sound.beat) {
      const bt = mt.beatTicks;
      const shift = plan.song.shift || 0;
      for (let t = Math.ceil((fromTick + shift) / bt) * bt - shift; t < toTick; t += bt) {
        const o = SW.audio.click(anchor + secs(t), (t + shift) % mt.barTicks === 0, true);
        if (o) voices.push({ o, start: anchor + secs(t), end: anchor + secs(t) + 0.1 });
      }
    }

    // keep only what is still to sound, then add this pass's cues
    const now = ctx().currentTime;
    voices = voices.filter(v => v.end > now);
    cues = cues.slice(cueIndex).concat(newCues);
    cueIndex = 0;
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
  async function play(fromTick) {
    stop();
    const plan = makePlan(fromTick);
    if (!plan) { SW.ui.toast('Nothing to play yet'); return; }
    const hasChords = plan.chords.some(c => c.strikes.length && c.id && SW.chords.isKnown(c.id));
    if (!S.sound.melody && !hasChords && !S.sound.beat) {
      SW.ui.toast('The melody is off in Sound, and there are no chords to hear');
      return;
    }
    const token = playToken;
    setPlaying(true);
    const mt = plan.song.meter;
    let count = S.sound.countIn && window.EVMCountIn ? EVMCountIn.beats(mt.beats) : 0;
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
    run = { plan, tickSec, anchor: t, passFrom: plan.first[0], passTo: plan.first[1], passEnd: 0 };
    cues = [];
    cueIndex = 0;
    const end = schedulePass(plan, plan.first[0], plan.first[1], t, tickSec);
    planNextPass(plan, end);
    loop();
  }

  /* Move the highlight when the clock passes each cue. */
  function loop() {
    if (!S.playing || !run) return;
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
      if (cue.chord && SW.settings.shows('strip')) SW.chords.announce(cue.chord.id, cue.chord.list, 'track');
      if (cue.track) SW.bus.emit('track:sounding', { at: cue.track.at, event: cue.track });
      if (cue.melodyEnd) markSounding(null);
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

  /* A tempo change while playing takes effect from where the music is,
     without starting again or counting in: whatever is sounding rings
     on, and the rest of the pass is laid down again from this exact
     point (the part of the beat still to go, at the new tempo). */
  function retime() {
    if (!S.playing || !run) return;
    const now = ctx().currentTime;
    if (now < run.anchor) return;                 // still counting in: this run keeps its tempo
    const plan = run.plan;
    const tickAt = Math.min(run.passTo, run.passFrom + (now - run.anchor) / run.tickSec);
    voices = voices.filter(v => {
      if (v.start > now) { try { v.o.stop(); } catch (e) {} return false; }
      return true;
    });
    clearTimeout(passTimer);
    cues = cues.filter(c => c.t <= now);
    cueIndex = Math.min(cueIndex, cues.length);
    run.tickSec = SW.timing.tickMs() / 1000;
    run.passFrom = tickAt;
    run.anchor = now;
    planNextPass(plan, schedulePass(plan, tickAt, run.passTo, now, run.tickSec, true));
  }

  function toggle() { if (S.playing) stop(); else play(); }

  /* Where the music is now, in ticks from the song's top (null when not
     playing; the starting point while counting in) — the chord map's
     playhead (progression-window.js). */
  function position() {
    if (!S.playing || !run) return null;
    const now = ctx().currentTime - latency();
    if (now < run.anchor) return run.passFrom;
    return Math.min(run.passTo, run.passFrom + (now - run.anchor) / run.tickSec);
  }

  // any redraw or edit of the song ends a run (the schedule no longer
  // matches); a change of tempo re-times it instead
  SW.bus.on('score:changed', d => { if (d && d.reason === 'tempo') retime(); else stop(); });
  ['score:loaded', 'key:changed'].forEach(evt => SW.bus.on(evt, stop));
  SW.bus.on('meter:changed', d => { if (!d || d.what !== 'tempo') stop(); });

  SW.player = { play: () => play(), playFrom: tick => play(tick), stop, toggle, position, get playing() { return S.playing; } };
})();

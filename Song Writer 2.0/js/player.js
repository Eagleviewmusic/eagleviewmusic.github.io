/* ==========================================================================
   Song Writer — player.js
   --------------------------------------------------------------------------
   SW.player   Plays the song on its own, in time: every column in turn at
               the song's tempo, notes ringing for their written length,
               blocks for one beat, rests silent, each line padded to its
               last bar. The selection follows along (silently, so the
               scheduled sound is the only sound), which also scrolls the
               stage, slides the keyboard dock and lights the sounding
               syllable (View → Light up the notes).

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
     Chords    the lane's chords where they change (View pref
               laneChordsPlay; heard with the chord lane out, as in 2.0)
     beat      a soft tick on every beat
     countIn   one bar first (two when the bar has two beats); with a
               1-beat pick-up (Layout settings) and Play starting on a
               bar's last beat, one beat fewer, so the pick-up falls on
               the count's missing beat (1 2 3 · pick-up on 4)
     atEnd     'stop'  — stop at the end (2.0's behaviour)
               'round' — go round from where Play began, re-anchored at
                         the end of the last pass so nothing drifts
               'line'  — play the selected line over and over

   TIES (timing.js): a tied pitch is struck once and held for the whole
   chain; the notes it is held over into only move the light.

   Play starts from the selected column, or from the top when nothing is
   selected. Stop leaves the selection where the music was, so the next
   Play carries on from there; a run that reaches the end lets the
   selection go, so the next Play starts from the top (1.0's "past the
   end, nothing is selected").

   API
     SW.player.toggle()   play / stop
     SW.player.play()     start (from the selection)
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

  const ctx = () => SW.audio.context();
  const latency = () => { const ac = ctx(); return ac.outputLatency || ac.baseLatency || 0; };

  function setPlaying(on) {
    S.playing = on;
    document.body.classList.toggle('playing', on);
    SW.bus.emit('play:changed', { playing: on });
  }

  function markSounding(syl) {
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

  /* What a run plays: the first pass, and (for the two loops) the span
     every later pass repeats. Ticks are absolute, from the song's top. */
  function makePlan() {
    const song = SW.timing.song();
    const all = flatten(song);
    if (!all.length) return null;
    const active = SW.score.getActiveNote();
    const activeStack = active ? active.closest('.harmony-stack') : null;
    let from = activeStack ? all.findIndex(ev => ev.stack === activeStack) : 0;
    if (from < 0) from = 0;
    const startTick = all[from].at;
    const mode = S.sound.atEnd;
    if (mode === 'line') {
      const le = all[from].line;
      return { song, all, first: [startTick, le.at + le.padded], loop: [le.at, le.at + le.padded], mode };
    }
    return { song, all, first: [startTick, song.total], loop: mode === 'round' ? [startTick, song.total] : null, mode };
  }

  function chordsHeard() { return SW.settings.shows('lane') && !!SW.settings.view.laneChordsPlay; }

  /* Lay one pass down on the clock: [fromTick, toTick) starting at audio
     time `anchor`. Returns when the pass ends. `resumed`: picking the
     music up mid-pass (a change of tempo), so a chord already sounding is
     not struck again. */
  function schedulePass(plan, fromTick, toTick, anchor, tickSec, resumed) {
    const secs = t => (t - fromTick) * tickSec;
    const melody = S.sound.melody;
    const chords = chordsHeard();
    const mt = plan.song.meter;
    const newCues = [];
    let firstInPass = !resumed;

    plan.all.forEach(ev => {
      if (ev.at < fromTick || ev.at >= toTick) return;
      const at = anchor + secs(ev.at);
      const dur = ev.ticks * tickSec;
      const cue = { t: at, ev };
      // the lane: a chord written where this word starts sounds with it —
      // and a pass that begins under a held chord sounds that one
      if (chords && ev.syllable) {
        const firstCol = ev.syllable.querySelector('.harmony-stack') === ev.stack;
        let id = firstCol ? ev.syllable.dataset.chord : null;
        if (!id && firstInPass && SW.lane) id = SW.lane.chordAt(ev.syllable);
        if (id && SW.chords.isKnown(id)) {                 // a chord written in the song always plays (Layout settings govern building, not hearing)
          const list = SW.chords.midis(id);
          if (list.length) {
            SW.audio.playChordFrequencies(list.map(M.midiToFreq), at, SW.audio.CHORD_PLAY_HOLD).forEach(o => voices.push({ o, start: at, end: at + SW.audio.CHORD_PLAY_HOLD + 0.1 }));
            cue.chord = { id, list };
          }
        }
      }
      firstInPass = false;
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

    // the steady beat: every beat in the span, the bar's first stronger
    // (a beat later with a pick-up: timing.js PICK-UP)
    if (S.sound.beat) {
      const bt = mt.beatTicks;
      const shift = plan.song.shift || 0;
      for (let t = Math.ceil(fromTick / bt) * bt; t < toTick; t += bt) {
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
  function scheduleCountIn(from, beatSec, n, perBar) {
    const ac = ctx();
    const times = [];
    for (let i = 0; i < n; i++) {
      const time = from + i * beatSec;
      const o = SW.audio.click(time, i % perBar === 0, false);
      if (o) voices.push({ o, start: time, end: time + 0.1 });
      times.push(EVMCountIn.heardAt(ac, time));
    }
    const end = from + n * beatSec;
    EVMCountIn.run(times, EVMCountIn.heardAt(ac, end));
    return end;
  }

  /* ---------------- play ---------------- */
  async function play() {
    stop();
    const plan = makePlan();
    if (!plan) { SW.ui.toast('Nothing to play yet'); return; }
    const hasChords = chordsHeard() && !!document.querySelector('#score .syllable[data-chord]');
    if (!S.sound.melody && !hasChords && !S.sound.beat) {
      SW.ui.toast('The melody is off in Sound, and there are no chords to hear');
      return;
    }
    const token = playToken;
    setPlaying(true);
    const mt = plan.song.meter;
    let count = S.sound.countIn && window.EVMCountIn ? EVMCountIn.beats(mt.beats) : 0;
    // into a pick-up (the last beat of a bar), the count leaves that beat for it
    const start = plan.first[0];
    if (count > 1 && plan.song.pickup && (start + plan.song.shift) % mt.barTicks === mt.barTicks - mt.beatTicks) count--;
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
    if (count) t = scheduleCountIn(t, mt.beatTicks * tickSec, count, mt.beats);
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
      if (!document.contains(ev.stack)) { stop(); return; }
      const first = ev.stack.querySelector('.note');
      if (first) SW.score.setNoteAsActive(first, false);
      markSounding(ev.syllable);
      if (cue.chord) SW.chords.announce(cue.chord.id, cue.chord.list, 'lane');
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

  // any redraw or edit of the song ends a run (the schedule no longer
  // matches); a change of tempo re-times it instead
  SW.bus.on('score:changed', d => { if (d && d.reason === 'tempo') retime(); else stop(); });
  ['score:loaded', 'key:changed'].forEach(evt => SW.bus.on(evt, stop));
  SW.bus.on('meter:changed', d => { if (!d || d.what !== 'tempo') stop(); });

  SW.player = { play, stop, toggle, get playing() { return S.playing; } };
})();

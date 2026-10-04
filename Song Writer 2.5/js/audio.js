/* ==========================================================================
   Song Writer — audio.js
   --------------------------------------------------------------------------
   SW.audio   Every sound the song makes, played by Key Blocks' engine
              (lib/audio.js — the same sounds as Key Blocks and the Virtual
              Keyboard). Two sides, each with its own sound and volume, as
              in Key Blocks: 'melody' (the blocks, the keyboard dock, the
              melody in Play) and 'chords' (the strip, the lane). Room is
              the engine's reverb, over both. The choices are View
              preferences (Sound popover): melodySound · melodyVolume ·
              chordSound · chordVolume · room.

              1.0's arithmetic is kept: the same frequencies, the same chord
              voicings, a tapped block rings half a second; a tapped chord
              three quarters of a second (half of 1.0's, since 2026-09-27),
              a chord in playback the full second and a half. The count-in and steady-beat clicks stay
              Song Writer's own short triangle ticks, dry, straight to the
              speakers. There is one AudioContext — the engine's — so the
              player's clock, the clicks and the notes all keep one time.
              It is made (and resumed) on first use, never at load: a
              context made before the first tap starts suspended.

   The chord engine (SW.chords) moved to js/chords.js on 2026-09-27: the
   scale-driven board, the Z X C V B functions and the voicings live
   there; 1.0's own voicings (generateChordForKey) stay here for it.
   ========================================================================== */
(function () {
  'use strict';
  const SW = window.SW;
  const M = SW.music;

  /* ------------------------------------------------------------------ */
  /* lib/audio.js declares `const Audio` at the top level of a classic
     script: a global binding, not window.Audio (which it hides). */
  const E = Audio;
  const BASE_LEVEL = 0.8;        // the engine's own level for a side (Key Blocks, Virtual Keyboard)
  const TAP_HOLD = 0.5;          // 1.0: a tapped block rings half a second
  const CHORD_HOLD = 0.75;       // a tapped chord (the panel, the lane, a preview): three quarters of a second — half of 1.0's 1.5 s (user, 2026-09-27)
  const CHORD_PLAY_HOLD = 1.5;   // a chord the player lays under the words keeps 1.0's second and a half
  const CHORD_LEVEL = 0.75;      // a chord sits a little under the tune
  const PLAYER_PEAK = 0.42;      // what the player asks for a single note (harmony asks less)
  let woken = false;

  function mix() {
    const v = (SW.settings && SW.settings.view) || {};
    const pct = (x, d) => (typeof x === 'number' && x >= 0 && x <= 100 ? x : d) / 100;
    return {
      melody: E.PRESETS[v.melodySound] ? v.melodySound : 'piano',
      chords: E.PRESETS[v.chordSound] ? v.chordSound : 'piano',
      melodyVolume: pct(v.melodyVolume, 100),
      chordVolume: pct(v.chordVolume, 100),
      room: pct(v.room, 35)
    };
  }

  /* Levels and Room go to the engine once it is awake (the first sound);
     before that they are only remembered. */
  function applyMix() {
    if (!woken) return;
    const m = mix();
    E.setLevel('melody', BASE_LEVEL * m.melodyVolume);
    E.setLevel('chords', BASE_LEVEL * m.chordVolume);
    E.setReverb(m.room);
  }

  function audioCtx() {
    const ac = E.ensure();
    if (!woken) { woken = true; applyMix(); }
    return ac;
  }

  /* A scheduled voice, stoppable the way an oscillator was (the player
     keeps { o, start, end } and calls o.stop()). */
  function handle(id) { return { stop() { E.stop(id); } }; }

  const A4_HZ = 440.0;
  const SEMITONES_IN_OCTAVE = 12;
  const C0_HZ = A4_HZ * Math.pow(2, -57 / SEMITONES_IN_OCTAVE);

  /* ---- 1.0: calculateFrequency / getFrequencyForNote / getModifiedFrequency ---- */
  function calculateFrequency(key, solfegeWithOctave, accidental) {
    const tonicChromaticIndex = M.KEY_SIGNATURES_CHROMATIC_INDEX[key];
    if (typeof tonicChromaticIndex === 'undefined') return null;
    let baseSolfegeLowercase = solfegeWithOctave;
    let octaveShift = 0;
    if (solfegeWithOctave.endsWith('-low')) {
      baseSolfegeLowercase = solfegeWithOctave.replace('-low', '');
      octaveShift = -1;
    } else if (solfegeWithOctave.endsWith('-high')) {
      baseSolfegeLowercase = solfegeWithOctave.replace('-high', '');
      octaveShift = 1;
    }
    const baseSolfegeCapitalized = baseSolfegeLowercase.charAt(0).toUpperCase() + baseSolfegeLowercase.slice(1);
    const solfegeInterval = M.SOLFEGE_INTERVALS[baseSolfegeCapitalized];
    if (typeof solfegeInterval === 'undefined') return null;
    let accidentalOffset = 0;
    if (accidental === 'sharp') accidentalOffset = 1;
    else if (accidental === 'flat') accidentalOffset = -1;
    const keyOctaveShift = M.KEY_TRANSPOSITION[key] ? (M.KEY_TRANSPOSITION[key].octaveShift || 0) : 0;
    const tonicSemis = tonicChromaticIndex + (M.DEFAULT_SOLFEGE_OCTAVE + keyOctaveShift) * SEMITONES_IN_OCTAVE;
    const targetSemis = tonicSemis + solfegeInterval + accidentalOffset + (octaveShift * SEMITONES_IN_OCTAVE);
    const frequency = C0_HZ * Math.pow(2, targetSemis / SEMITONES_IN_OCTAVE);
    return isNaN(frequency) ? null : frequency;
  }
  const getFrequencyForNote = (noteClass, key) => calculateFrequency(key || SW.state.key, noteClass, 'natural');
  const getModifiedFrequency = (baseNote, accidental, key) => calculateFrequency(key || SW.state.key, baseNote, accidental);

  function valid(f) { return f !== null && !isNaN(f) && f > 0; }

  /* ---- a tapped block, a step of the arrows: the melody sound, half a second ---- */
  function playNote(frequency) {
    if (!valid(frequency)) {
      console.warn('Attempted to play invalid frequency:', frequency);
      return;
    }
    const ac = audioCtx();
    E.schedule('melody', [frequency], mix().melody, ac.currentTime, TAP_HOLD);
  }

  /* ---- a chord (the panel, the lane): the chords sound ----
     `at` (context time, optional) places it on the audio clock — the
     player schedules the lane's chords with the melody, and asks for the
     longer hold (`seconds`). Returns handles so a run that stops can
     silence them. */
  function playChordFrequencies(frequencies, at, seconds) {
    const list = (frequencies || []).filter(valid);
    if (!list.length) return [];
    const ac = audioCtx();
    const when = at === undefined ? ac.currentTime : Math.max(at, ac.currentTime);
    return [handle(E.schedule('chords', list, mix().chords, when, seconds || CHORD_HOLD, CHORD_LEVEL))];
  }

  /* ---- a chord held down (the panel's blocks, their keys) ----
     Digital Accordion's chords ring for as long as they are held: this
     one rings until release(), and never shorter than a tapped chord
     (CHORD_HOLD), however quick the press. stop() silences it at once —
     a function key changed the chord and it is struck again (chords.js
     holdPlace / restrike). HELD_MAX is only a safety net for a let-go
     that never arrives. */
  const HELD_MAX = 60;
  function holdChord(frequencies) {
    const list = (frequencies || []).filter(valid);
    if (!list.length) return null;
    const t0 = audioCtx().currentTime;
    const id = E.schedule('chords', list, mix().chords, t0, HELD_MAX, CHORD_LEVEL);
    let done = false;
    return {
      release() {
        if (done) return;
        done = true;
        const left = CHORD_HOLD - (audioCtx().currentTime - t0);
        if (left > 0.02) setTimeout(() => E.stop(id), left * 1000);
        else E.stop(id);
      },
      stop() { done = true; E.stop(id); }
    };
  }

  /* ---- 1.0: transposeNote / generateChordForKey ---- */
  function transposeNote(noteWithOctave, semitonesUp, octaveShift) {
    const noteMatch = noteWithOctave.match(/^([A-G][b#]?)(\d+)$/);
    if (!noteMatch) return null;
    const noteName = noteMatch[1];
    const octave = parseInt(noteMatch[2], 10);
    let noteIndex = M.CHROMATIC_NOTES.indexOf(noteName);
    if (noteIndex === -1) {
      const enharmonics = { 'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb' };
      noteIndex = M.CHROMATIC_NOTES.indexOf(enharmonics[noteName]);
    }
    if (noteIndex === -1) return null;
    let newNoteIndex = (noteIndex + semitonesUp) % 12;
    if (newNoteIndex < 0) newNoteIndex += 12;
    const newOctave = octave + Math.floor((noteIndex + semitonesUp) / 12) + (octaveShift || 0);
    return M.CHROMATIC_NOTES[newNoteIndex] + newOctave;
  }
  function generateChordForKey(key, chordSymbol) {
    const transposition = M.KEY_TRANSPOSITION[key];
    if (!transposition) return null;
    const baseVoicing = M.BASE_CHORD_VOICINGS[chordSymbol];
    if (!baseVoicing) return null;
    return baseVoicing.map(n => transposeNote(n, transposition.semitones, transposition.octaveShift)).filter(Boolean);
  }

  /* ---- 1.0: playNoteWithAccidental / playHarmony, reading the DOM ---- */
  function playNoteElement(noteElement) {
    if (!noteElement || noteElement.classList.contains('rest-note')) return;
    const noteClass = M.noteClassOf(noteElement);
    if (!noteClass) return;
    const accidental = SW.score ? SW.score.getAccidentalFromNote(noteElement) : 'natural';
    const frequency = getModifiedFrequency(noteClass, accidental, SW.state.key);
    if (frequency !== null) playNote(frequency);
  }
  function playHarmony(stackOrNote) {
    if (!stackOrNote) return;
    let notes = [];
    if (stackOrNote.classList.contains('harmony-stack')) {
      notes = Array.from(stackOrNote.querySelectorAll('.note'));
    } else if (stackOrNote.classList.contains('note')) {
      const parentStack = stackOrNote.closest('.harmony-stack');
      notes = parentStack ? Array.from(parentStack.querySelectorAll('.note')) : [stackOrNote];
    }
    notes.forEach(playNoteElement);
  }

  /* ---- 2.0: a note of a known length, on the audio clock ----
     The melody sound held for `seconds` from `at` (context time), so a
     half note rings twice as long as a quarter. `level` is the player's
     loudness for it (0.42 alone, less in a harmony stack). Returns a
     handle so the player can stop it. Used by js/player.js, which
     schedules the whole song ahead. */
  function tone(frequency, at, seconds, level) {
    if (!valid(frequency)) return null;
    const ac = audioCtx();
    const id = E.schedule('melody', [frequency], mix().melody, Math.max(at, ac.currentTime), Math.max(0.08, seconds), (level || PLAYER_PEAK) / PLAYER_PEAK);
    return handle(id);
  }

  /* ---- the keyboard dock: a key held down rings until it is let go ---- */
  function noteOn(midi) {
    audioCtx();
    return E.play('melody', [M.midiToFreq(midi)], mix().melody);
  }
  function noteOff(id) { if (id) E.stop(id); }

  /* ---- the count-in and steady-beat click ----
     Song Writer's own: a short, high triangle tick (the family counts
     with brushes and square clicks; this one sits with the triangle
     voices), the first beat of a bar stronger. Placed on the audio clock,
     dry — Room and the volumes leave it alone. */
  function click(at, strong, soft) {
    const ac = audioCtx();
    const t0 = Math.max(at, ac.currentTime);
    const peak = (strong ? 0.34 : 0.22) * (soft ? 0.6 : 1);
    const oscillator = ac.createOscillator();
    const gainNode = ac.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(strong ? 1760 : 1318.5, t0);
    gainNode.gain.setValueAtTime(0.0001, t0);
    gainNode.gain.linearRampToValueAtTime(peak, t0 + 0.003);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.075);
    oscillator.connect(gainNode);
    gainNode.connect(ac.destination);
    oscillator.start(t0);
    oscillator.stop(t0 + 0.09);
    return oscillator;
  }

  /* ---- the Sound popover's previews: a taste of a choice ---- */
  function previewMelody() {
    const ac = audioCtx();
    const doMidi = M.noteMidi('do', 'natural');
    if (doMidi !== null) E.schedule('melody', [M.midiToFreq(doMidi)], mix().melody, ac.currentTime, 0.45);
  }
  function previewChords() {
    const home = SW.chords && SW.chords.entry('f');
    const list = home ? SW.chords.midis(home.id) : [];
    if (list.length) playChordFrequencies(list.map(M.midiToFreq));
  }

  /* The sounds, grouped for the menus as the Virtual Keyboard groups them;
     anything Key Blocks adds later lands in "More sounds". */
  const SOUND_GROUPS = [
    { label: 'Keyboards', ids: ['piano', 'epiano', 'organ'] },
    { label: 'Mallets & plucks', ids: ['marimba', 'bell', 'pluck'] },
    { label: 'Long tones', ids: ['pad', 'strings', 'voice'] },
    { label: 'Simple waves', ids: ['sine', 'triangle', 'square', 'sawtooth'] }
  ];
  function soundGroups() {
    const grouped = new Set(SOUND_GROUPS.reduce((a, g) => a.concat(g.ids), []));
    const extra = E.PRESET_ORDER.filter(id => !grouped.has(id));
    const groups = SOUND_GROUPS.map(g => ({ label: g.label, ids: g.ids.filter(id => E.PRESETS[id]) }));
    if (extra.length) groups.push({ label: 'More sounds', ids: extra });
    return groups.map(g => ({ label: g.label, sounds: g.ids.map(id => ({ id, name: E.PRESETS[id].name })) }));
  }

  SW.audio = {
    context: audioCtx,
    now: () => audioCtx().currentTime,
    calculateFrequency, getFrequencyForNote, getModifiedFrequency,
    playNote, playChordFrequencies, holdChord, transposeNote, generateChordForKey,
    playNoteElement, playHarmony, tone, click, noteOn, noteOff,
    playMidi(midi) { playNote(M.midiToFreq(midi)); },
    applyMix, previewMelody, previewChords, soundGroups, CHORD_PLAY_HOLD,
    hasSound: id => !!E.PRESETS[id]
  };
})();

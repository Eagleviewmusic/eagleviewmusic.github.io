/* ==========================================================================
   Recording Studio — voices.js
   Every track heard back, on the one audio clock — and the same again,
   offline, for a song file.

   Three engines, by what a track holds:
     notes (keyboard, accordion, a song's melody and chords)
               the Digital Accordion engine (audio.js): each track is its
               own engine side ('trk-<id>'), so its level is its fader
     strikes (xylophone)
               the Rainbow Xylophone's voices (xylo.js), each track through
               a gain of its own into the xylophone's master
     hits (an ostinato)
               the shared percussion engine (lib/instruments/), one kit a
               track, played through EVMCountIn.timed so a hit handed over a
               moment early still lands to the sample
     takes (a voice)
               the microphone's own sound (voice.js), each region a buffer
               source with a 4 ms fade at either end so a cut never clicks

   A track's level here is the engine's: 0.8 (BASE) × its fader × the
   playback volume, and nothing at all when muted or soloed out. Each
   event's own `level` is relative — 1 is how the instrument plays it.

   A run (start) owns a gate in front of the xylophones and kits: Stop
   closes it, so a strike or hit already handed over is not heard. The
   engine's notes are stopped by id.

   window.Voices = { BASE, start(ctx) → run, render(song) → Promise<AudioBuffer> }
   run   = { level(track, v), note(track, ev), strike(track, ev), hit(track, ev), audio(track, ev), stop() }
   ========================================================================== */
const Voices = (() => {
  const BASE = 0.8;          // the engine's own level for a side (Digital Accordion, Virtual Keyboard)
  const RATE = 44100;
  const VI = window.VirtualInstruments;

  const sideOf = track => 'trk-' + track.id;

  /* ---------------- live ---------------- */
  function start(ctx) {
    const gate = ctx.createGain();
    gate.connect(window.StudioBus ? StudioBus.out(ctx) : ctx.destination);
    const timed = EVMCountIn.timed(ctx);
    let xyloBus = null;
    const gains = new Map();      // track id -> GainNode (xylophone, ostinato)
    const kits = new Map();       // track id -> kit
    const rings = new Map();      // track id -> Map(freq -> voice), for damping a re-struck bar
    const sources = [];           // voice takes laid down
    const levels = new Map();     // track id -> its level now
    const ids = [];
    let stopped = false;
    const levelOf = track => (levels.has(track.id) ? levels.get(track.id) : BASE);

    function trackGain(track, level) {
      let g = gains.get(track.id);
      if (!g) {
        g = ctx.createGain();
        g.gain.value = level / BASE;
        if (track.kind === 'xylophone') {
          if (!xyloBus) xyloBus = Xylo.bus(ctx, gate);
          g.connect(xyloBus);
        } else {
          g.connect(gate);
        }
        gains.set(track.id, g);
      }
      return g;
    }

    return {
      level(track, level) {
        levels.set(track.id, level);
        if (track.kind === 'xylophone' || track.kind === 'ostinato' || track.kind === 'voice') {
          trackGain(track, level).gain.setTargetAtTime(level / BASE, ctx.currentTime, 0.02);
        } else {
          Audio.setLevel(sideOf(track), level);
        }
      },
      note(track, ev) {
        if (stopped) return;
        ids.push(Audio.schedule(sideOf(track), [ev.freq], ev.preset, ev.at, ev.hold, ev.level));
      },
      strike(track, ev) {
        if (stopped) return;
        const out = trackGain(track, levelOf(track));
        let ring = rings.get(track.id);
        if (!ring) { ring = new Map(); rings.set(track.id, ring); }
        const key = Math.round(ev.freq * 100);
        const prev = ring.get(key);
        if (prev && prev.end > ev.at) prev.damp(ev.at);
        ring.set(key, Xylo.strike(out, ev.freq, ev.sound, Math.max(ev.at, ctx.currentTime), ev.level));
      },
      hit(track, ev) {
        if (stopped) return;
        let kit = kits.get(track.id);
        if (!kit) {
          kit = VI.createKit({ audioContext: timed.ctx, destination: trackGain(track, levelOf(track)) });
          kit.unlock();
          kits.set(track.id, kit);
        }
        const opts = ev.gapMs > 0 ? kit.optionsForRepeat(ev.inst, ev.gapMs) : {};
        if (ev.gain !== 1) opts.gain = ev.gain;
        timed.soundAt(ev.at, () => kit.play(ev.inst, opts));
      },
      audio(track, ev) {
        if (stopped || ev.dur <= 0) return;
        const buf = StudioVoice.bufferFor(ctx, ev.clip);
        if (!buf) return;
        sources.push(playTake(ctx, buf, trackGain(track, levelOf(track)), ev));
      },
      stop() {
        stopped = true;
        ids.forEach(id => Audio.stop(id));
        sources.forEach(s => { try { s.stop(); } catch (e) {} });
        const t = ctx.currentTime;
        gate.gain.setTargetAtTime(0, t, 0.01);
        setTimeout(() => { try { gate.disconnect(); } catch (e) {} }, 400);
      }
    };
  }

  // One region of a take: `dur` seconds from `offset` into the buffer, at `at`.
  function playTake(ctx, buf, out, ev) {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    const at = ev.at, end = ev.at + ev.dur, fade = Math.min(0.004, ev.dur / 3);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(1, at + fade);
    g.gain.setValueAtTime(1, end - fade);
    g.gain.linearRampToValueAtTime(0, end);
    src.connect(g);
    g.connect(out);
    src.start(at, Math.max(0, ev.offset), ev.dur);
    src.onended = () => { try { g.disconnect(); } catch (e) {} };
    return src;
  }

  /* ---------------- a song file ----------------
     song = { seconds, room, tracks: [{ kind, level, events }] } with events
     as the live run takes them, `at` in seconds from the start. The three
     engines render apart and are added together; a mix that would clip is
     brought down as a whole (never squashed). */
  async function render(song) {
    const length = Math.max(1, Math.ceil(song.seconds * RATE));
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const renders = [];

    const noteTracks = song.tracks.filter(t => t.events.length && !(t.kind === 'xylophone' || t.kind === 'ostinato' || t.kind === 'voice'));
    if (noteTracks.length) {
      renders.push(Audio.render({
        seconds: song.seconds, room: song.room, rate: RATE,
        parts: noteTracks.map(t => ({
          level: t.level,
          notes: t.events.map(ev => ({ freqs: [ev.freq], preset: ev.preset, at: ev.at, hold: ev.hold, level: ev.level }))
        }))
      }));
    }

    const xyloTracks = song.tracks.filter(t => t.events.length && t.kind === 'xylophone');
    if (xyloTracks.length) {
      const off = new OAC(2, length, RATE);
      const bus = Xylo.bus(off, off.destination);
      xyloTracks.forEach(t => {
        const g = off.createGain();
        g.gain.value = t.level / BASE;
        g.connect(bus);
        const ring = new Map();
        t.events.forEach(ev => {
          const key = Math.round(ev.freq * 100);
          const prev = ring.get(key);
          if (prev && prev.end > ev.at) prev.damp(ev.at);
          ring.set(key, Xylo.strike(g, ev.freq, ev.sound, Math.max(0, ev.at), ev.level));
        });
      });
      renders.push(off.startRendering());
    }

    const kitTracks = song.tracks.filter(t => t.events.length && t.kind === 'ostinato');
    if (kitTracks.length) {
      const off = new OAC(2, length, RATE);
      const timed = EVMCountIn.timed(off);
      // the kit wakes a suspended context before each hit; an offline one is
      // started by startRendering(), and refuses to be resumed before that
      const quiet = new Proxy(timed.ctx, {
        get(target, prop) { return prop === 'resume' ? () => Promise.resolve() : Reflect.get(target, prop); }
      });
      kitTracks.forEach(t => {
        const g = off.createGain();
        g.gain.value = t.level / BASE;
        g.connect(off.destination);
        const kit = VI.createKit({ audioContext: quiet, destination: g });
        kit.unlock();
        t.events.forEach(ev => {
          const opts = ev.gapMs > 0 ? kit.optionsForRepeat(ev.inst, ev.gapMs) : {};
          if (ev.gain !== 1) opts.gain = ev.gain;
          timed.soundAt(Math.max(0, ev.at), () => kit.play(ev.inst, opts));
        });
      });
      renders.push(off.startRendering());
    }

    const voiceTracks = song.tracks.filter(t => t.events.length && t.kind === 'voice');
    if (voiceTracks.length) {
      const off = new OAC(2, length, RATE);
      voiceTracks.forEach(t => {
        const g = off.createGain();
        g.gain.value = t.level / BASE;
        g.connect(off.destination);
        t.events.forEach(ev => {
          const buf = StudioVoice.bufferFor(off, ev.clip);
          if (buf && ev.dur > 0) playTake(off, buf, g, ev);
        });
      });
      renders.push(off.startRendering());
    }

    const buffers = await Promise.all(renders);
    const L = new Float32Array(length), R = new Float32Array(length);
    buffers.forEach(b => {
      const n = Math.min(length, b.length);
      const bl = b.getChannelData(0), br = b.numberOfChannels > 1 ? b.getChannelData(1) : bl;
      for (let i = 0; i < n; i++) { L[i] += bl[i]; R[i] += br[i]; }
    });
    let peak = 0;
    for (let i = 0; i < length; i++) { const a = Math.max(Math.abs(L[i]), Math.abs(R[i])); if (a > peak) peak = a; }
    if (peak > 0.98) {
      const k = 0.98 / peak;
      for (let i = 0; i < length; i++) { L[i] *= k; R[i] *= k; }
    }
    return { sampleRate: RATE, length, duration: length / RATE, numberOfChannels: 2, getChannelData: ch => (ch ? R : L) };
  }

  return { BASE, start, render, sideOf };
})();

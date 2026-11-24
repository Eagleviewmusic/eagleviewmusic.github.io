/* ==========================================================================
   Virtual Chordophone — player.js                              VC.player
   --------------------------------------------------------------------------
   Everything that sounds, on one audio clock.

   THE CLOCK — the BPM made into a grid of sixteenths with bar lines.
     • While Play is on (an Ostinato Builder beat, or the click when no beat
       is loaded) the grid is the beat's: bar 1 is where the beat starts.
     • While it is off, the first chord pressed starts the grid — the press
       is a downbeat — and it keeps going for as long as you keep playing,
       so changing chords keeps the groove. After a bar of silence it lets
       go, and the next press starts it again.

   A BOX'S HOLD CORNER (mode 'pattern') plays its rhythm, round and round, in
   step with the grid, for as long as it is held:
     • pressed just after a strike was due (≤ 70 ms): that strike, now
     • pressed just before one (≤ 80 ms): it waits for it
     • otherwise: the chord sounds at once (as the rhythm has it at that
       moment — the note an arpeggio is on), then follows the grid.
   Let go: everything still to come is called off and what is sounding is
   let go. "Held" is struck once and rings while held.

   STRIKE (mode 'strike' — the box's main area, 2026-11-22): the whole chord,
   now, ringing while held — the rhythm is yours.

   ONE CHORD AT A TIME (a setting, on by default): a new chord takes over
   from the one before, even if that box is still held.

   THE BEAT — an Ostinato Builder piece (beat.js): one pass of hits {i, b, g, r}
   in its own beats, round and round, on the shared percussion kit, through
   EVMCountIn.timed so each hit lands on the audio clock to the sample.
   Play can count in first (EVMCountIn, the same card as the other apps).

   API  press(place, mode) → key · release(key) · releaseAll() · isSounding(place)
        play() · stop() · playing() · setBpm(n) · setMeter(m) · setBeat(b) · hear(place)
        position() → { bar, beat, cell, running } · onHit(fn)
   ========================================================================== */
(function () {
  'use strict';
  const VC = window.VC = window.VC || {};
  const R = VC.rhythm;

  const LOOK = 0.14;           // seconds ahead the pump lays sound down
  const TICK_MS = 20;
  const LATE = 0.07;           // a press this soon after a strike was due plays that strike
  const EARLY = 0.08;          // a press this soon before one waits for it
  let ctx = null, timedCk = null;
  let beatBus = null, gate = null, kit = null, clickBus = null;   // chords go through Audio's 'chords' side

  const clock = { t0: null, spb: 0.6, transport: false, lastSound: -1e9, countEnd: 0 };
  let meter = R.meterOf('4/4');
  let beat = null;             // { title, beats, hits: [{ i, b, g, r }], meter, bpm }
  let beatNext = { pass: 0, idx: 0 };
  let clickNext = 0;           // the next beat number to click (negative: the count-in)
  const active = new Map();    // key 'place:mode' → a voice
  const hitFns = [];
  let pumpTimer = null;

  const prefs = () => (VC.app && VC.app.prefs()) || {};
  function audio() {
    if (!ctx) {
      ctx = Audio.ensure();
      timedCk = EVMCountIn.timed(ctx);
      beatBus = ctx.createGain(); beatBus.gain.value = 0.9; beatBus.connect(ctx.destination);
      clickBus = ctx.createGain(); clickBus.gain.value = 0.5; clickBus.connect(ctx.destination);
      applyLevels();
    } else Audio.ensure();
    if (!pumpTimer) pumpTimer = setInterval(pump, TICK_MS);
    return ctx;
  }
  function applyLevels() {
    if (!ctx) return;
    const p = prefs();
    Audio.setLevel('chords', p.chordLevel == null ? 0.8 : p.chordLevel);
    Audio.setReverb(p.room == null ? 0.35 : p.room);
    beatBus.gain.setTargetAtTime(p.beatLevel == null ? 0.9 : p.beatLevel, ctx.currentTime, 0.02);
    clickBus.gain.setTargetAtTime(p.clickLevel == null ? 0.5 : p.clickLevel, ctx.currentTime, 0.02);
  }

  const cellSec = () => clock.spb / meter.per;
  const cellAt = t => (t - clock.t0) / cellSec();
  const timeOf = c => clock.t0 + c * cellSec();
  const barSec = () => meter.barCells * cellSec();
  const mod = (a, n) => ((a % n) + n) % n;
  const freqs = ms => ms.map(m => 440 * Math.pow(2, (m - 69) / 12));

  /* ---------------- the strikes ---------------- */
  function notesOf(v, st) {
    const sorted = v.midis.slice().sort((a, b) => a - b);
    if (st.random) {
      let r = Math.floor(Math.random() * sorted.length);
      if (sorted.length > 1 && r === v.lastRank) r = (r + 1 + Math.floor(Math.random() * (sorted.length - 1))) % sorted.length;
      v.lastRank = r;
      return [sorted[r]];
    }
    if (!st.n) return sorted;
    return st.n.map(r => sorted[Math.min(r, sorted.length - 1)]).filter(m => m !== undefined);
  }
  function lay(v, st, cellStart, when, hold) {
    const t = ctx.currentTime;
    const at = Math.max(when, t + 0.003);
    const ms = notesOf(v, st);
    if (!ms.length) return;
    const h = Math.max(0.06, hold - (at - when));
    const id = Audio.schedule('chords', freqs(ms), v.sound, at, h, 1);
    v.ids.push({ id, at, end: at + h });
    tellHit(v.place, at, st, cellStart);
  }
  function strikeAtOrBefore(p, pos) {
    const B = p.barCells;
    for (let i = 0, c = Math.floor(pos); i < B; i++, c--) { const st = p.byCell.get(mod(c, B)); if (st) return { cell: c, st }; }
    return null;
  }
  function strikeAfter(p, pos) {
    const B = p.barCells;
    for (let i = 0, c = Math.floor(pos) + 1; i <= B; i++, c++) { const st = p.byCell.get(mod(c, B)); if (st) return { cell: c, st }; }
    return null;
  }

  /* ---------------- pressing a box ---------------- */
  function press(place, mode) {
    audio();
    const key = place + ':' + mode;
    if (active.has(key)) release(key);
    if (prefs().mono !== false) Array.from(active.keys()).forEach(k => { if (k !== key) release(k); });
    const box = VC.app.boxPlay(place);           // { midis, rhythm, sound }
    if (!box || !box.midis.length) return null;
    if (box.sound && window.Samples && Samples.isSampled(box.sound)) Samples.want(box.sound);
    const t = ctx.currentTime;
    const p = mode === 'strike' ? null : R.pattern(box.rhythm, meter, box.midis.length);
    if (mode === 'strike' || p.held) {
      const id = Audio.play('chords', freqs(box.midis), box.sound);
      active.set(key, { key, place, mode, held: true, midis: box.midis, ids: [{ id, at: t, end: Infinity }] });
      tellHit(place, t, null, null);
      VC.app.light(place, true);
      return key;
    }
    if (p.empty) { VC.app.toast('This chord’s rhythm has no notes in it yet — open its settings ⚙'); return null; }
    if (clock.t0 === null) { clock.t0 = t + 0.006; clock.spb = 60 / (prefs().bpm || 100); }   // the press is a downbeat
    const v = { key, place, mode, p, midis: box.midis, sound: box.sound, ids: [], next: 0, lastRank: -1 };
    const pos = cellAt(t);
    const cs = cellSec();
    const prev = strikeAtOrBefore(p, pos);
    const nxt = strikeAfter(p, pos);
    if (pos <= 0) v.next = Math.ceil(pos);                                      // the clock starts now (or is counting in)
    else if (prev && (pos - prev.cell) * cs <= LATE) v.next = prev.cell;         // just late: that strike, now
    else if (nxt && (nxt.cell - pos) * cs <= EARLY) v.next = nxt.cell;           // just early: wait for it
    else {
      if (prev && pos < prev.cell + prev.st.len) {                              // in the middle of a note: sound it at once
        lay(v, prev.st, prev.cell, t, (prev.cell + prev.st.ring - pos) * cs);
      }
      v.next = Math.floor(pos) + 1;
    }
    active.set(key, v);
    VC.app.light(place, true);
    pump();
    return key;
  }
  function release(key) {
    const v = active.get(key);
    if (!v) return;
    v.ids.forEach(x => Audio.stop(x.id));
    active.delete(key);
    if (ctx) clock.lastSound = ctx.currentTime;
    VC.app.light(v.place, isSounding(v.place));
  }
  function releaseAll() { Array.from(active.keys()).forEach(release); }
  const isSounding = place => Array.from(active.values()).some(v => v.place === place);

  /* ---------------- the pump ---------------- */
  function pump() {
    if (!ctx) return;
    const t = ctx.currentTime;
    const horizon = t + LOOK;
    active.forEach(v => {
      if (v.held) return;
      v.ids = v.ids.filter(x => x.end > t - 0.5);
      if (clock.t0 === null) return;
      const B = v.p.barCells, cs = cellSec();
      let guard = 0;
      while (timeOf(v.next) < horizon && guard++ < 128) {
        const st = v.p.byCell.get(mod(v.next, B));
        if (st) lay(v, st, v.next, timeOf(v.next), st.ring * cs);
        v.next++;
      }
    });
    if (clock.transport) {
      pumpBeat(t, horizon);
      pumpClick(t, horizon);
    } else if (clock.t0 !== null && active.size === 0 && t - clock.lastSound > Math.max(barSec(), 1.2)) {
      clock.t0 = null;                                                           // a bar of silence: the grid lets go
    }
  }
  function pumpBeat(t, horizon) {
    if (!beat || !beat.hits.length || !kit) return;
    let guard = 0;
    while (guard++ < 512) {
      const h = beat.hits[beatNext.idx];
      const at = clock.t0 + ((beat.offset || 0) + beatNext.pass * beat.beats + h.b) * clock.spb;
      if (at >= horizon) break;
      if (at >= t - 0.03) {
        const gapMs = h.r * clock.spb * 1000;
        const o = Object.assign(gapMs > 0 ? kit.optionsForRepeat(h.i, gapMs) : {}, { gain: h.g == null ? 1 : h.g });
        timedCk.soundAt(at, () => { try { kit.play(h.i, o); } catch (e) {} });
      }
      beatNext.idx++;
      if (beatNext.idx >= beat.hits.length) { beatNext.idx = 0; beatNext.pass++; }
    }
  }
  /* the click: every beat (the count-in always; after it only with no beat loaded, or "click along") */
  function pumpClick(t, horizon) {
    const along = !beat || prefs().clickAlong;
    let guard = 0;
    while (guard++ < 64) {
      const at = clock.t0 + clickNext * clock.spb;
      if (at >= horizon) break;
      if (at >= t - 0.03 && (clickNext < 0 || along)) click(at, mod(clickNext, meter.beats) === 0 && clickNext >= 0, clickNext < 0);
      clickNext++;
    }
  }
  function click(at, accent, counting) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = counting ? (accent ? 1568 : 1175) : (accent ? 1760 : 1320);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(accent || counting ? 0.9 : 0.55, at + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
    o.connect(g); g.connect(clickBus);
    o.start(at); o.stop(at + 0.08);
  }

  /* ---------------- the transport ---------------- */
  let starting = false;
  async function play() {
    if (clock.transport || starting) return;
    audio();
    starting = true;
    const count = prefs().countIn !== false ? EVMCountIn.beats(meter.beats) : 0;
    if (count) EVMCountIn.open(count, meter.beats);
    await EVMCountIn.prime(ctx, { warm: count ? 0.35 : 0.12 });
    starting = false;
    const t = ctx.currentTime;
    clock.spb = 60 / (prefs().bpm || 100);
    clock.t0 = t + 0.12 + count * clock.spb;
    clock.transport = true;
    clock.countEnd = clock.t0;
    beatNext = { pass: 0, idx: 0 };
    clickNext = -count;
    if (gate) { try { gate.disconnect(); } catch (e) {} }
    gate = ctx.createGain(); gate.connect(beatBus);
    kit = VirtualInstruments.createKit({ audioContext: timedCk.ctx, destination: gate });
    kit.unlock();
    // chords already held come into step with the new grid
    active.forEach(v => {
      if (v.held) return;
      v.ids.filter(x => x.at > t + 0.005).forEach(x => Audio.stop(x.id));
      v.ids = v.ids.filter(x => x.at <= t + 0.005);
      v.next = Math.ceil(cellAt(t));
    });
    if (count) {
      const times = [];
      for (let i = 0; i < count; i++) times.push(EVMCountIn.heardAt(ctx, clock.t0 - (count - i) * clock.spb));
      EVMCountIn.run(times, EVMCountIn.heardAt(ctx, clock.t0));
    }
    VC.app.transportChanged(true);
    pump();
  }
  function stop() {
    starting = false;
    if (!clock.transport) { EVMCountIn.close(); return; }
    clock.transport = false;
    EVMCountIn.close();
    if (gate && ctx) {
      const g = gate;
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.03);
      setTimeout(() => { try { g.disconnect(); } catch (e) {} }, 400);
      gate = null; kit = null;
    }
    if (!active.size) clock.t0 = null;                 // chords still held keep the grid going
    else clock.lastSound = ctx.currentTime;
    VC.app.transportChanged(false);
  }
  const playing = () => clock.transport || starting;

  /* a new tempo: the grid keeps its place (the next sound comes at the new speed) */
  function setBpm(n) {
    const spb = 60 / n;
    if (clock.t0 !== null && ctx) {
      const t = ctx.currentTime;
      const beats = (t - clock.t0) / clock.spb;
      clock.t0 = t - beats * spb;
    }
    clock.spb = spb;
  }
  function setMeter(m) {
    meter = m;
    const was = clock.transport;
    if (was) stop();
    releaseAll();
    clock.t0 = null;
    return was;
  }
  /* a beat chosen while playing comes in at the next bar line (the grid stays where it is) */
  function setBeat(b) {
    beat = b && b.hits && b.hits.length ? Object.assign({}, b, { offset: 0 }) : null;
    beatNext = { pass: 0, idx: 0 };
    if (beat && clock.transport && ctx) {
      const bar = Math.max(0, Math.ceil((ctx.currentTime + 0.05 - clock.t0) / (meter.beats * clock.spb)));
      beat.offset = bar * meter.beats;
    }
  }

  /* ---------------- hearing a chord from its settings ---------------- */
  let hearing = null;
  function hear(place, bars) {
    audio();
    if (hearing) { hearing.ids.forEach(id => Audio.stop(id)); clearTimeout(hearing.timer); }
    const box = VC.app.boxPlay(place);
    if (!box || !box.midis.length) return;
    if (box.sound && window.Samples && Samples.isSampled(box.sound)) Samples.want(box.sound);
    const p = R.pattern(box.rhythm, meter, box.midis.length);
    const t = ctx.currentTime + 0.05, cs = (60 / (prefs().bpm || 100)) / meter.per;
    const ids = [];
    const v = { midis: box.midis, lastRank: -1 };
    if (p.held || p.empty) {
      ids.push(Audio.schedule('chords', freqs(box.midis), box.sound, t, 1.6, 1));
    } else {
      const n = bars || 2;
      for (let b = 0; b < n; b++) p.strikes.forEach(st => {
        const c = b * p.barCells + st.c;
        const ms = notesOf(v, st);
        const hold = Math.min(st.ring, n * p.barCells - c) * cs;
        ids.push(Audio.schedule('chords', freqs(ms), box.sound, t + c * cs, hold, 1));
      });
    }
    hearing = { ids, timer: setTimeout(() => { hearing = null; }, 8000) };
  }
  function stopHearing() { if (hearing) { hearing.ids.forEach(id => Audio.stop(id)); hearing = null; } }

  /* ---------------- what the screen follows ---------------- */
  function onHit(fn) { hitFns.push(fn); }
  function tellHit(place, at, st, cell) {
    const ms = Math.max(0, EVMCountIn.heardAt(ctx, at) - performance.now());
    const info = { place, strike: st, cell: cell == null ? null : mod(cell, meter.barCells) };
    setTimeout(() => hitFns.forEach(fn => { try { fn(info); } catch (e) {} }), ms);
  }
  function position() {
    if (!ctx || clock.t0 === null) return { running: false };
    const lat = ctx.outputLatency || ctx.baseLatency || 0;
    const heard = ctx.currentTime - lat;
    const beats = (heard - clock.t0) / clock.spb;
    return {
      running: true, transport: clock.transport, counting: beats < 0,
      beat: mod(Math.floor(beats), meter.beats), bar: Math.floor(beats / meter.beats),
      cell: mod(Math.floor((heard - clock.t0) / cellSec()), meter.barCells), meter
    };
  }

  VC.player = {
    press, release, releaseAll, isSounding,
    play, stop, playing, setBpm, setMeter, setBeat, hear, stopHearing,
    position, onHit, applyLevels, audio,
    get meter() { return meter; }, get beat() { return beat; }
  };
})();

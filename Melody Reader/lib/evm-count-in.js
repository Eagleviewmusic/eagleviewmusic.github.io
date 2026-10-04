/* ==========================================================================
   EVM Count-in — one count-in for every Eagle View Music app that plays
   --------------------------------------------------------------------------
   Authoritative copy: Claude Apps/EVM Library/evm-count-in.js (+ .css).
   Byte-identical copies live in <app>/lib/ of Rhythm Poetry 2.0, Ostinato
   Builder 2.0 and the Music Stand; check-copies.sh keeps them honest.

   A count-in is only any use if a room of children can come in on it, and
   they can only do that if it is steady from the very first click. Three
   things make it so:

   1. prime(ctx)    Play is pressed and the sound is made ready before
                    anything is counted. The context is resumed and *waited
                    for* — asked and not waited for, the first click or two
                    went out while it was still waking and the count stumbled
                    in. Then a moment of sound far too quiet to hear wakes an
                    output that has gone to sleep (Bluetooth speakers, a
                    projector's HDMI, a board's amplifier), which would
                    otherwise swallow the first thing played.

   2. timed(ctx)    A view of the context whose currentTime can be set for
                    the length of one call. Sound code that reads the clock
                    once per note — every voice in these apps does — then
                    places that note on the audio clock to the sample. A note
                    handed over a moment early lands exactly when it is due,
                    however late the timer that handed it over ran.

   3. The card      A pop-up in the middle of the screen that counts with the
                    clicks — 1 2 3 4 — each number lighting as its click is
                    heard, gone as the music starts. The same card, the same
                    colours, in every app.

   window.EVMCountIn = { prime, timed, heardAt, beats, open, run, close }
   ========================================================================== */
(function () {
  'use strict';

  function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  /* ------------------------------------------------------------------
     1. PRIMING
     ------------------------------------------------------------------ */

  const RESUME_WAIT_MS = 2500;   // a context that has not woken by then will not
  const WAKE_LEVEL = 0.00015;    // about -76 dBFS: below the room, above silence

  const noiseFor = new WeakMap();

  function noiseBuffer(ctx) {
    let buffer = noiseFor.get(ctx);
    if (!buffer) {
      buffer = ctx.createBuffer(1, Math.round(ctx.sampleRate * 0.5), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noiseFor.set(ctx, buffer);
    }
    return buffer;
  }

  /* Keep the output awake for `seconds` from now. It runs on under the
     first beats as well, so the output never goes back to digital silence
     between the warm-up and the first click. */
  function wake(ctx, seconds) {
    try {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(ctx);
      src.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = WAKE_LEVEL;
      src.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime;
      src.start(t);
      src.stop(t + seconds);
    } catch (e) { /* a context that cannot do this cannot play either */ }
  }

  /* Resolves true once the context is running and the output has had
     `warm` seconds (default 0.3) to wake; false if sound is not coming
     at all, so the caller can say so rather than count into silence. */
  async function prime(ctx, opts) {
    opts = opts || {};
    if (!ctx) return false;
    if (ctx.state !== 'running') {
      try { await Promise.race([ctx.resume(), wait(RESUME_WAIT_MS)]); } catch (e) { /* checked below */ }
    }
    if (ctx.state !== 'running') return false;
    const warm = opts.warm == null ? 0.3 : Math.max(0, opts.warm);
    if (warm > 0) {
      wake(ctx, warm + 1.5);
      await wait(warm * 1000);
    }
    return true;
  }

  /* ------------------------------------------------------------------
     2. THE TIMED CLOCK
     ------------------------------------------------------------------ */

  function timed(ctx) {
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
      raw: ctx,
      /* run `fn` with the clock reading `time` — never in the past */
      soundAt(time, fn) {
        at = Math.max(time, ctx.currentTime);
        try { fn(); } finally { at = null; }
      }
    };
  }

  /* When a sound placed at audio `time` will be heard, in performance.now()
     terms — for anything drawn, which should change with the sound rather
     than with the scheduling of it. */
  function heardAt(ctx, time) {
    const latency = (ctx.outputLatency || ctx.baseLatency || 0);
    return performance.now() + (time - ctx.currentTime + latency) * 1000;
  }

  /* How long a count-in is: one bar in the meter's own beats — but a
     count of two is over before anyone has caught it, so a bar of two
     (2/4, 6/8) is counted twice. */
  function beats(perBar) {
    const n = Math.max(1, Math.round(perBar) || 4);
    return n < 3 ? n * 2 : n;
  }

  /* ------------------------------------------------------------------
     3. THE CARD
     ------------------------------------------------------------------ */

  /* The EASY colours, one per beat of the bar, so "1" is always red
     whichever app is counting. */
  const COLOURS = ['#F0525A', '#F4A21C', '#2DB86A', '#3B95E6'];

  let root = null;
  let row = null;
  let nums = [];
  let timers = [];
  let leaveTimer = null;
  let showing = false;   // set at once; the class follows a frame later

  function build() {
    if (root) return;
    root = document.createElement('div');
    root.className = 'evm-count';
    root.setAttribute('aria-hidden', 'true');   // the clicks are the count
    const card = document.createElement('div');
    card.className = 'evm-count-card';
    const title = document.createElement('div');
    title.className = 'evm-count-title';
    title.textContent = 'Get ready';
    row = document.createElement('div');
    row.className = 'evm-count-row';
    card.append(title, row);
    root.appendChild(card);
    document.body.appendChild(root);
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
    clearTimeout(leaveTimer);
    leaveTimer = null;
  }

  /* Up at once, every number waiting: the card says a count is coming
     while the sound is still being made ready. `count` beats, `perBar`
     to a bar — each number is its beat of the bar, and a count of two
     bars reads 1 2 · 1 2. */
  function open(count, perBar) {
    build();
    clearTimers();
    perBar = Math.max(1, Math.round(perBar) || count);
    row.innerHTML = '';
    nums = [];
    for (let i = 0; i < count; i++) {
      if (i > 0 && i % perBar === 0) {
        const gap = document.createElement('span');
        gap.className = 'evm-count-bar';
        row.appendChild(gap);
      }
      const beat = i % perBar;
      const num = document.createElement('span');
      num.className = 'evm-count-num';
      num.textContent = String(beat + 1);
      num.style.setProperty('--c', COLOURS[beat % COLOURS.length]);
      row.appendChild(num);
      nums.push(num);
    }
    showing = true;
    root.classList.remove('leaving');
    /* next frame, so the card eases in rather than appearing */
    requestAnimationFrame(() => { if (showing) root.classList.add('open'); });
  }

  function light(i) {
    nums.forEach((num, k) => {
      num.classList.toggle('lit', k === i);
      num.classList.toggle('done', k < i);
    });
  }

  /* Light number i at times[i] (performance.now() ms) and go at `end`,
     which is when the music starts. A time already past lights at once,
     so this can be called again with new times after a change of tempo. */
  function run(times, end) {
    if (!root) return;
    clearTimers();
    const now = performance.now();
    let current = -1;
    times.forEach((t, i) => {
      if (t <= now) current = i;
      else timers.push(setTimeout(() => light(i), t - now));
    });
    if (current >= 0) light(current);
    if (end != null) timers.push(setTimeout(close, Math.max(0, end - now)));
  }

  /* Gone — at the downbeat, or at once when the music is stopped. */
  function close() {
    if (!root) return;
    clearTimers();
    if (!showing) return;
    showing = false;
    root.classList.add('leaving');
    leaveTimer = setTimeout(() => {
      root.classList.remove('open', 'leaving');
      nums.forEach(num => num.classList.remove('lit', 'done'));
    }, 200);
  }

  window.EVMCountIn = {
    prime: prime,
    timed: timed,
    heardAt: heardAt,
    beats: beats,
    open: open,
    run: run,
    close: close
  };
})();

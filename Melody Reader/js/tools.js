/* ==========================================================================
   Melody Reader — tools.js
   --------------------------------------------------------------------------
   RR.Tools — the Tools button beside the music and its panel, in every
   mode (2026-10-12, the user's: "change it for everyone … all sections
   should be able to choose color notes, color lines, names under notes"; it
   began in Teach Me to Read the same day):

     Metronome        Click · Drum beat (drums.js), the tempo dial, Easy
                      56 → Hard 132 BPM (dial.js, 2026-10-13 — it was Off
                      · Slow · Moderate · Fast), and ▶ Start / ■ Stop. Not
                      in a battle — there it stands beside the music — nor
                      in Beat the clock
     Computer         the computer keyboard in the music's place: the
     Keyboard         bars' keys lit, playable, nothing counts
     Auto-Next Slide  On / Off: the next melody comes by itself once one
                      is played through
     Note Colors · Staff Color · Text Below the Notes

   Where a change goes: in Teach Me to Read, the browser's — every level
   and unit (RR.teachLook); anywhere else, the level or session playing,
   as its ✎ page would (G.base, G.saveSetup — a level becomes your Level
   n). A battle can turn Tools off (its page: Tools On / Off).

   The panel opens beside the button (over the xylophone on a phone),
   stays open while the look is changed (the music redraws as it does),
   and closes for the metronome's Start / Stop or the keyboard, on Escape,
   or a tap anywhere else. Turning the dial leaves it open.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game, esc = RR.esc;
  const teach = () => G.mode.kind === 'teach';
  const T = RR.Tools = {};

  /* ---- the look: what the panel shows and changes ---- */
  T.look = function () {
    if (teach()) { const l = RR.teachLook(); if (G.mode.song) l.auto = G.mode.auto !== false; return l; }    // Songs: its own Auto-Next
    const s = G.setup || {};
    return { colour: s.colour, staff: s.staff || 'plain', labels: s.labels, auto: !!s.auto, beat: s.beat === 'drums' ? 'drums' : 'click' };
  };
  /* beat: the metronome's sound, Click or Drum beat (2026-10-13) — kept with the look */
  function setLook(k, v) {
    if (teach() && G.mode.song && k === 'auto') { G.mode.auto = !!v; G.remember(); }
    else if (teach()) {
      if (!RR.setTeachLook(k, v)) return false;
    } else {
      if (!G.base) return false;
      G.base[k] = v;
      G.compose(); G.saveSetup();
    }
    // the practice's colour and labels draw the notes (Teach Me to Read's too); the lines come from T.staff
    const look = T.look();
    ['colour', 'labels'].forEach(x => { if (G.base) G.base[x] = look[x]; if (G.setup) G.setup[x] = look[x]; });
    G.draw();
    return true;
  }
  T.setLook = setLook;
  /* the notes the bars play here: the level's (Teach Me to Read), else what the xylophone has live */
  const notesHere = () => teach() ? RR.Teach.level().notes.slice()
    : Array.from(G.liveBars ? G.liveBars() : (G.setup && G.setup.notes) || []).filter(id => RR.BAR[id]).sort((a, b) => RR.BAR[a].step - RR.BAR[b].step);
  /* the staff's lines for game.js draw: its notes' lines lit (the rest greyed), all five, or plain black */
  T.staff = function () {
    if (teach()) return RR.Teach.staff();
    const want = T.look().staff;
    if (want === 'plain') return null;
    const ns = notesHere();
    return RR.teachStaff({ lines: RR.teachLines(ns), ledgers: RR.teachLedgers(ns) }, want);
  };

  /* ---- the panel ---- */
  const panel = $('#teach-tools');
  let hint = '', was = '';
  const isOpen = () => !panel.hidden;
  T.isOpen = isOpen;
  const NOTE_COLOURS = [['solid', 'Solid Color'], ['always', 'Transparent Color'], ['lit', 'When Played'], ['black', 'Black']];
  const STAFFS = [['notes', 'Its Notes’ Lines'], ['all', 'All Lines'], ['plain', 'Black']];
  const LABELS = [['letters', 'Letter Name'], ['solfege', 'Solfège'], ['none', 'Nothing']];
  const KBD_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="20" height="12.5" rx="2.4" fill="none" stroke-width="2"/><g class="keys"><rect x="5" y="9" width="2.4" height="2.2" rx=".5"/><rect x="8.6" y="9" width="2.4" height="2.2" rx=".5"/><rect x="12.2" y="9" width="2.4" height="2.2" rx=".5"/><rect x="15.8" y="9" width="2.4" height="2.2" rx=".5"/><rect x="7" y="13.6" width="10" height="2.2" rx=".6"/></g></svg>';
  function noteSwatch(v) {
    const head = (fill, op) => '<ellipse cx="22" cy="16" rx="8.6" ry="6.4" transform="rotate(-20 22 16)" fill="' + fill + '"' + (op ? ' fill-opacity="' + op + '"' : '') + ' stroke="#2b1d16" stroke-width="1.6"/>';
    const body = v === 'solid' ? head('#facc15') : v === 'always' ? head('#facc15', '.42') :
      v === 'lit' ? '<circle cx="22" cy="16" r="12.5" fill="#facc15" fill-opacity=".35"/>' + head('#2b1d16') : head('#2b1d16');
    return '<svg viewBox="0 0 44 32" aria-hidden="true">' + body + '</svg>';
  }
  function staffSwatch(v) {
    const C = ['#facc15', '#2dd4bf', '#a855f7', '#f97316', '#22c55e'];
    return '<svg viewBox="0 0 44 32" aria-hidden="true">' + [0, 1, 2, 3, 4].map(i => {
      const y = 27 - i * 5.5;
      const c = v === 'plain' ? '#2b1d16' : v === 'all' ? C[i] : i < 2 ? C[i] : '#d9cfbf';
      const w = v === 'plain' ? 1.3 : v === 'notes' && i >= 2 ? 1.3 : 3;
      return '<line x1="3" x2="41" y1="' + y + '" y2="' + y + '" stroke="' + c + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    }).join('') + '</svg>';
  }
  const labelSwatch = v => '<span class="tl-word">' + (v === 'letters' ? 'E' : v === 'solfege' ? 'Mi' : '–') + '</span>';
  function choice(group, list, cur, pic) {
    return '<div class="tl-choices n' + list.length + '" role="group">' + list.map(([v, name]) =>
      '<button type="button" class="tl-opt' + (v === cur ? ' on' : '') + '" data-tl="' + group + '" data-v="' + v + '" aria-pressed="' + (v === cur) + '">' +
      pic(v) + '<span>' + name + '</span></button>').join('') + '</div>';
  }
  /* the metronome lives here — except in a battle (beside the music) and Beat the clock (none) */
  const metroHere = () => !G.battle && !G.clock;
  function html() {
    const look = T.look(), kb = T.kbdOn(), card = G.card || { time: [4, 4] };
    const changed = teach() && ['colour', 'staff', 'labels'].some(k => look[k] !== RR.TEACH_LOOK[k]);
    const on = G.metroOn();
    // the dial (dial.js) and Start / Stop; the points a tempo is worth where there are points
    const metro = RR.Dial.soundHtml(look.beat, card.time) + RR.Dial.html({ tempo: G.tempo, time: card.time, points: !!RR.device.points && !teach() }) +
      '<button type="button" class="tl-go' + (on ? ' on' : '') + '" data-tl="metro" data-v="' + (on ? 'off' : 'on') + '">' + (on ? '■ Stop the metronome' : '▶ Start the metronome') + '</button>';
    const say = teach() && G.mode.song ? (on ? 'The click goes on from slide to slide, all through the song.' : 'Start it: it counts in, then keeps the beat from slide to slide.')
      : teach() ? (on ? 'Round and round until you stop it — each time through with every note: a gold star.' : 'Start it: it counts in, then plays along round and round — every note for a gold star.')
      : G.stage === 'practice' ? 'In Practice it clicks along; a Test with it counts you in.' : 'Starting it counts you in at once.';
    return '<div class="tl-head"><b id="tl-title">Tools</b>' +
        '<button type="button" class="icon-btn close" data-tl="close" aria-label="Close the tools">×</button></div>' +
      '<div class="tl-body">' +
        (metroHere() ? '<section class="tl-sec tl-metro-sec' + (hint === 'metro' ? ' hint' : '') + '"><h4>Metronome</h4>' + metro +
          '<p class="tl-say">' + say + ' Listen plays at this tempo too.</p></section>' : '') +
        // the user's: "Computer Keyboard — with computer on top and keyboard below it, and a little keyboard next to
        // it — that's all. Right next to it, write Auto-Next Slide on/off"
        '<section class="tl-sec tl-pair">' +
          '<button type="button" class="tl-big tl-kbd' + (kb ? ' on' : '') + '" data-tl="kbd" aria-pressed="' + kb + '" aria-label="Computer keyboard">' + KBD_SVG +
            '<span class="tl-two"><b>Computer</b><b>Keyboard</b></span></button>' +
          '<button type="button" class="tl-big tl-auto' + (look.auto ? ' on' : '') + '" data-tl="auto" data-v="' + !look.auto + '" aria-pressed="' + !!look.auto + '" aria-label="Auto-Next Slide: ' + (look.auto ? 'on' : 'off') + '">' +
            '<span class="tl-two"><b>Auto-Next</b><b>Slide</b></span><i class="tl-sw" aria-hidden="true">' + (look.auto ? 'On' : 'Off') + '</i></button>' +
        '</section>' +
        '<section class="tl-sec"><h4>Note Colors</h4>' + choice('colour', NOTE_COLOURS, look.colour, noteSwatch) + '</section>' +
        '<section class="tl-sec"><h4>Staff Color</h4>' + choice('staff', STAFFS, look.staff, staffSwatch) + '</section>' +
        '<section class="tl-sec"><h4>Text Below the Notes</h4>' + choice('labels', LABELS, look.labels, labelSwatch) + '</section>' +
        (changed ? '<button type="button" class="h-link tl-reset" data-tl="reset">↺ All the colors and letters back</button>' : '') +
      '</div>';
  }
  function draw(focusSel) {
    const h = html();
    if (h === was && !focusSel && panel.firstChild) return;      // nothing changed (game.js draws on every note)
    was = h;
    const a = document.activeElement;
    // the focus where it was: a choice, the dial or its − / +
    const f = focusSel || (a && panel.contains(a) ? (a.dataset.tl ? '[data-tl="' + a.dataset.tl + '"]' + (a.dataset.v && !['auto', 'metro'].includes(a.dataset.tl) ? '[data-v="' + a.dataset.v + '"]' : '') :
      a.dataset.dial ? '[data-dial="' + a.dataset.dial + '"]' : a.dataset.beat ? '[data-beat="' + a.dataset.beat + '"]' : null) : null);
    const body = panel.querySelector('.tl-body'), y = body ? body.scrollTop : 0;
    panel.innerHTML = h;
    panel.querySelector('.tl-body').scrollTop = y;
    place();
    const el = f && panel.querySelector(f); if (el) el.focus();
  }
  /* beside the Tools button, its middle level with the button (kept on the screen); a phone: over the xylophone */
  function place() {
    if (panel.hidden) return;
    if (window.innerWidth <= 700) { panel.style.left = ''; panel.style.top = ''; return; }
    const b = $('#btn-tools').getBoundingClientRect(), h = panel.offsetHeight;
    const top = Math.max(8, Math.min(window.innerHeight - h - 8, b.top + b.height / 2 - h / 2));
    panel.style.left = Math.round(b.right + 14) + 'px';
    panel.style.top = Math.round(top) + 'px';
    panel.style.setProperty('--ay', Math.round(b.top + b.height / 2 - top) + 'px');
  }
  const toolsOff = () => !!(G.battle && G.battle.tools === false);
  function open(want, why) {
    if (want && (G.overlay || toolsOff())) return;
    hint = want ? why || '' : '';
    if (!want) {
      if (panel.hidden) return;
      panel.hidden = true;
      $('#btn-tools').setAttribute('aria-expanded', 'false');
      return;
    }
    panel.hidden = false;
    $('#btn-tools').setAttribute('aria-expanded', 'true');
    draw(why === 'metro' ? '[data-tl="metro"]' : metroHere() ? '.td-svg' : '.tl-kbd');
  }
  T.open = open;
  T.close = () => open(false);

  /* the Tools button: green with a ticking dot while the metronome plays (in the panel), pink while the
     keyboard shows; no word under it (2026-10-12, the user's: no text on the buttons) */
  T.drawButton = function () {
    const tb = $('#btn-tools'), metro = G.metroOn() && metroHere(), kb = T.kbdOn();
    tb.classList.toggle('metro-on', metro);
    tb.classList.toggle('kbd-on', kb);
    tb.title = 'Tools: the metronome, the computer keyboard, the colors' + (metro ? ' — the metronome is on (' + G.tempo + ' BPM' + (RR.Beat.hasDrums(G.card.time) ? ', the drum beat' : '') + ')' : '');
    tb.setAttribute('aria-label', tb.title);
    if (isOpen()) { if (toolsOff()) open(false); else draw(); }
  };

  $('#btn-tools').addEventListener('click', () => { if (!G.overlay) open(!isOpen()); });
  RR.Dial.bind(panel);                                                    // the tempo dial: G.setTempo when it is set
  panel.addEventListener('click', e => {
    const b = e.target.closest('[data-tl]'); if (!b) return;
    const a = b.dataset.tl, v = b.dataset.v;
    if (a === 'close') { open(false); $('#btn-tools').focus(); }
    else if (a === 'metro') { open(false); if (T.kbdOn()) kbd(false); G.setMetro(v); }      // Start / Stop: the music wants seeing
    else if (a === 'kbd') { open(false); kbd(!T.kbdOn()); }
    else if (a === 'auto') {
      const on = v === 'true';
      if (setLook('auto', on)) { draw('[data-tl="auto"]'); G.announce('Auto-Next Slide ' + (on ? 'on: the next one comes by itself.' : 'off.')); }
    } else if (a === 'reset') {
      RR.resetTeachLook();                                                // colours and letters only
      setLook('colour', RR.TEACH_LOOK.colour);
      draw('[data-tl="colour"].on');
      G.announce('The colors and letters are back.');
    } else if (setLook(a, v)) {
      draw();
      G.announce(b.textContent.trim() + '.');
    }
  });
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); open(false); $('#btn-tools').focus(); } });
  document.addEventListener('pointerdown', e => {
    if (isOpen() && !e.target.closest('#teach-tools') && !e.target.closest('#btn-tools')) open(false);
  }, true);
  window.addEventListener('resize', place);

  /* ---- the computer keyboard (the user's: "just to play with it to understand the computer keyboard
     layout") — the number row, the keys of the bars live here lit in their colours and playable; the letters
     row under it, greyed, so it looks like the keyboard in front of them ---- */
  const ROW1 = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];
  const ROW2 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']'];
  T.kbdOn = () => $('#app').classList.contains('kbd-on');
  // both octaves of a letter here: say which is which
  const octWord = (b, ns) => ns.filter(id => id[0] === b.letter).length > 1 ? (b.octave === 4 ? 'low ' : 'high ') : '';
  function keyHtml(k, ns) {
    const i = RR.KEYS.indexOf(k), b = i >= 0 ? RR.BARS[i] : null;
    // = and + are one key (+ is Shift and =): with high A here, the key shows both, + over = as printed
    if (k === '=' && ns.includes('A5')) {
      const half = (bar, sym, cls) => ns.includes(bar.id)
        ? '<button type="button" class="kk-half lit ' + cls + '" data-bar="' + bar.id + '" style="--c:' + bar.colour + '" aria-label="' + (sym === '+' ? 'Shift and equals (plus)' : 'Equals') + ' plays ' + octWord(bar, ns) + bar.letter + '">' +
          '<b>' + sym + '</b><small><span class="oct">' + octWord(bar, ns) + '</span>' + bar.letter + '</small></button>'
        : '<span class="kk-half ' + cls + '"><b>' + sym + '</b></span>';
      return '<span class="kk split">' + half(RR.BAR.A5, '+', 'top') + half(RR.BAR.G5, '=', 'bottom') + '</span>';
    }
    if (!b || !ns.includes(b.id)) return '<span class="kk' + (i >= 0 ? ' num' : ' edge') + '">' + esc(RR.keyShow(k)) + '</span>';
    const oct = octWord(b, ns);
    return '<button type="button" class="kk lit" data-bar="' + b.id + '" style="--c:' + b.colour + '" aria-label="Key ' + RR.keyName(k) + ' plays ' + oct + b.letter + '">' +
      '<b>' + RR.keyShow(k) + '</b><small>' + (oct ? '<span class="oct">' + oct + '</span>' : '') + b.letter + '</small></button>';
  }
  function kbdHtml() {
    const ns = notesHere(), lit = RR.BARS.filter(b => ns.includes(b.id));
    return '<div class="kbd-head"><b>Your computer’s keyboard plays the bars too</b>' +
      '<span>' + lit.map(b => '<em><i style="--c:' + b.colour + '">' + RR.keyShow(b.key) + '</i>' + octWord(b, ns) + b.letter + (b.key === '+' ? ' <small>(Shift and =)</small>' : '') + '</em>').join('') + '</span></div>' +
      '<div class="kbd-board" role="group" aria-label="The number keys">' +
        '<div class="kbd-row">' + ROW1.map(k => keyHtml(k, ns)).join('') + '<span class="kk wide edge">delete</span></div>' +
        '<div class="kbd-row r2"><span class="kk wide">tab</span>' + ROW2.map(k => '<span class="kk">' + esc(k) + '</span>').join('') + '<span class="kk">\\</span></div>' +
      '</div>' +
      '<div class="kbd-foot"><span class="kbd-note">Press them, or tap them — just for playing: the music waits.</span>' +
        '<button type="button" class="pill-btn go" data-kb="back">♪ Back to the music</button></div>';
  }
  function kbd(want) {
    const app = $('#app');
    if (!!want === T.kbdOn()) return;
    if (want) {
      // nothing goes on underneath: the sound stops, the metronome goes off, the melody starts afresh (in Teach Me
      // to Read, back to playing on your own)
      G.pause(); clearTimeout(G.practiceT);
      G.metro = 'off'; G.closePick();
      G.resetCard(teach() ? 'practice' : undefined);
      $('#kbd-view').innerHTML = kbdHtml();
    }
    app.classList.toggle('kbd-on', !!want);
    if (!want) $('#kbd-view').innerHTML = '';
    G.draw(); G.syncTick();
    G.announce(want ? 'The computer keyboard: ' + notesHere().map(id => RR.BAR[id].key + ' plays ' + RR.BAR[id].letter).join(', ') + '.' : 'Back to the music.');
    const f = want ? $('#kbd-view .kk.lit') : $('#btn-tools'); if (f && RR.View.current === 'play') f.focus();
  }
  T.kbd = kbd;
  /* a bar played while the keyboard shows — its key, its bar and its sound; nothing counts */
  T.kbdHit = function (id) {
    const k = $('#kbd-view [data-bar="' + id + '"]');
    if (k) {
      k.classList.remove('hit'); void k.offsetWidth; k.classList.add('hit');
      clearTimeout(k._t); k._t = setTimeout(() => k.classList.remove('hit'), 240);
    }
    RR.Xylo.flash(id, 'right', 420);
  };
  const kv = $('#kbd-view');
  kv.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-bar]'); if (!b) return;
    e.preventDefault();
    RR.Xylo.press(b.dataset.bar, e);
  });
  kv.addEventListener('click', e => {
    if (e.target.closest('[data-kb="back"]')) { kbd(false); return; }
    // Enter or Space on a focused key (a pointer has already played it)
    const b = e.target.closest('[data-bar]');
    if (b && e.detail === 0) RR.Xylo.press(b.dataset.bar, e);
  });
})();

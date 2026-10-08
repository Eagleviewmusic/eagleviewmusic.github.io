/* ==========================================================================
   Melody Reader — drop.js
   --------------------------------------------------------------------------
   RR.Drop — the drop-down under the level box at the top of the music
   (2026-10-08, the user's design). The Melody Reader name takes you to
   where you choose what to do (the home page); this box helps you change
   HOW you are doing it — "when the user clicks the drop down, they want to
   change an aspect of what they are already doing, not to do something
   different". So what it shows depends on what is playing:

     a level         the other levels (the same format: Rounds of 7 stay
                     Rounds of 7) · ✎ Change Level n
     a session       the other sessions · ✎ Change this session
     Generated       Choose the Notes · Choose the Rhythm, changed in place
     a Song          the songs, in the order they play
     My melodies     the other sets · ✎ Edit this set · + Write a new set
     a battle        its teams, turns and rounds
     a lesson        (no drop-down: the Lesson tab, as before)

   and, at its foot, the ✎ page of what is playing for the rest (Settings).
   Changes are made as on the ✎ page (Settings' own sections and controls);
   picking another level, session or set starts it at once; the rest takes
   effect when the drop-down closes (RR.Settings.settle: the next melody,
   or a new round).
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, $ = RR.$, G = RR.Game, esc = RR.esc;
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));

  let el = null;
  const isOpen = () => !!(el && !el.hidden);

  /* what is playing, for the drop-down */
  function what() {
    const m = G.mode;
    if (m.kind === 'lesson') return 'lesson';
    if (G.battle) return 'battle';
    if (G.setup.game === 'song') return 'songs';
    if (G.playingSet()) return 'mel';
    if (m.kind === 'level') return 'level';
    if (m.kind === 'session') return 'session';
    return 'gen';
  }
  /* the format, in words: "a round of 7 · 2 played" */
  function formatWords() {
    const s = G.setup, n = RR.roundLen(s.game);
    const done = G.battle ? '' : isFinite(G.roundN) && G.round.length ? ' · ' + G.round.length + ' of ' + G.roundN + ' played' : '';
    if (G.battle) return plural(G.battle.teams.length, 'team') + ' · ' + plural(G.battle.rounds, 'round') + ' · ' + plural(G.battle.per, 'melody', 'melodies') + ' a turn';
    if (n) return 'Rounds of ' + n + done;
    if (s.game === 'song') return 'Songs' + done;
    if (s.game === 'clock') return 'Beat the clock · ' + (s.clockSecs === 120 ? '2 min' : s.clockSecs + ' s');
    return 'Endless';
  }
  /* the link at the foot: the ✎ page of what is playing */
  function pageWord() {
    const m = G.mode;
    if (G.battle) return '✎ Notes, rhythms and more';
    if (m.kind === 'level') return '✎ Change Level ' + m.n;
    if (m.kind === 'session') return '✎ Change ' + m.name;
    return '✎ Look & Feel and more';
  }

  /* ---- what each one shows ---- */
  function levelHtml() {
    const cur = G.mode.kind === 'level' ? G.mode.n : 0;
    return '<h3 class="dd-h">Choose a different level</h3><div class="ladder" role="group" aria-label="The levels">' +
      RR.BANDS.map(b => '<div class="lad-band" style="--bc:' + b.colour + '"><span class="lad-name">' + b.name + '</span><div class="lad-row">' +
        RR.LEVELS.filter(l => l.band === b.id).map(l => {
          const st = RR.Scores.levelStars(RR.levelKey(l.n)), ed = RR.LevelEdits.edited(l.n), on = cur === l.n;
          return '<button type="button" class="lad-lv' + (on ? ' on' : '') + (ed ? ' edited' : '') + '" data-d="level" data-n="' + l.n + '" aria-pressed="' + on + '" aria-label="Level ' + l.n + ': ' + esc(l.name) + (ed ? ' (your own)' : '') + ', ' + st + ' of 3 stars" title="Level ' + l.n + ' · ' + esc(l.name) + '">' +
            '<b>' + l.n + (ed ? '<i class="lad-ed" aria-hidden="true">✎</i>' : '') + '</b><span class="lad-st" aria-hidden="true">' + RR.starsHtml(st, 3) + '</span></button>';
        }).join('') + '</div></div>').join('') + '</div>' +
      (cur ? '<p class="note dd-note">' + esc(RR.summary(G.base)) + ' · ' + (G.base.bars === 2 ? '2 bars' : '1 bar') + '</p>' : '');
  }
  function sessionHtml() {
    const list = RR.Sessions.list().filter(x => x.kind !== 'battle');
    return '<h3 class="dd-h">Choose a different session</h3><div class="dd-chips">' + list.map(x => {
      const on = G.mode.kind === 'session' && G.mode.id === x.id;
      return '<button type="button" class="ses-chip' + (on ? ' on' : '') + '" data-d="session" data-id="' + esc(x.id) + '" aria-pressed="' + on + '">♪ ' + esc(x.name) + '</button>';
    }).join('') + '</div><p class="note dd-note">' + esc(RR.summary(G.base)) + ' · ' + (G.base.bars === 2 ? '2 bars' : '1 bar') + '</p>';
  }
  function songsHtml() {
    const picks = G.songPicks(), at = id => picks.indexOf(id);
    const btn = (id, title) => '<button type="button" data-d="song" data-id="' + esc(id) + '" class="' + (at(id) >= 0 ? 'on' : '') + '" aria-pressed="' + (at(id) >= 0) + '">' +
      (at(id) >= 0 ? '<b class="ord">' + (at(id) + 1) + '</b>' : '') + esc(title) + '</button>';
    const sets = RR.Sets.list().filter(x => x.melodies.length);
    return '<h3 class="dd-h">The songs, in the order they play</h3>' +
      '<div class="picks song-picks">' + Object.keys(RR.SONGS).map(id => btn(id, RR.SONGS[id].title)).join('') + '</div>' +
      (sets.length ? '<div class="picks-head">My melodies</div><div class="picks song-picks">' + sets.map(x => btn('set:' + x.id, x.title)).join('') + '</div>' : '') +
      '<p class="note dd-note">Tap a song to add it or take it out (at least one stays). The round starts again with them when you close this.</p>';
  }
  function melHtml() {
    const cur = G.playingSet(), sets = RR.Sets.list().filter(x => x.melodies.length);
    return '<h3 class="dd-h">Choose different melodies</h3><div class="mc-list dd-sets">' + sets.map(x => {
      const on = cur && cur.id === x.id;
      return '<button type="button" class="mc-row' + (on ? ' on' : '') + '" data-d="set" data-id="' + esc(x.id) + '" aria-pressed="' + !!on + '"><b>♫ ' + esc(x.title) + '</b><span class="mc-n">' + plural(x.melodies.length, 'melody', 'melodies') + '</span>' +
        (x.received ? '<small>' + (RR.Sets.isShelf(x) ? 'Teacher Library · ' + esc(x.book) : 'Shared with you') + '</small>' : '') + '</button>';
    }).join('') + '</div>' +
      '<div class="dd-btns">' + (cur && cur.id !== 'lesson' ? '<button type="button" class="pill-btn" data-d="edit-set">✎ Edit “' + esc(cur.title) + '”</button>' : '') +
      '<button type="button" class="pill-btn primary" data-d="new-set">+ Write a new set</button></div>';
  }
  function genHtml() { return RR.Settings.sectionHtml('notes') + RR.Settings.sectionHtml('rhythms'); }
  function battleHtml() { return RR.Settings.sectionHtml('battle'); }

  function html() {
    const k = what();
    const body = k === 'level' ? levelHtml() : k === 'session' ? sessionHtml() : k === 'songs' ? songsHtml() : k === 'mel' ? melHtml() : k === 'battle' ? battleHtml() : genHtml();
    return '<div class="dd-panel" role="dialog" aria-modal="true" aria-labelledby="dd-title" data-ctx="' + k + '">' +
      '<span class="dd-caret" aria-hidden="true"></span>' +
      '<header class="dd-head"><i class="band-dot" style="--band:' + G.modeColour() + '"></i><div class="dd-what"><b id="dd-title">' + esc(G.modeLabel()) + '</b><span>' + esc(formatWords()) + '</span></div>' +
      '<button class="icon-btn close" data-d="close" type="button" aria-label="Close">×</button></header>' +
      '<div class="dd-body dd-' + k + '">' + body + '</div>' +
      '<footer class="dd-foot"><button type="button" class="h-link" data-d="page">' + esc(pageWord()) + '</button>' +
      '<button type="button" class="pill-btn go" data-d="close">Done</button></footer></div>';
  }
  function draw(focusSel) {
    const b = el.querySelector('.dd-body'), y = b ? b.scrollTop : 0;
    el.innerHTML = html();
    el.querySelector('.dd-body').scrollTop = y;
    place();
    const f = focusSel && el.querySelector(focusSel); if (f) f.focus();
  }
  /* under the level box, its little point at the box's middle */
  function place() {
    const panel = el && el.querySelector('.dd-panel'); if (!panel) return;
    const chip = $('#level-chip').getBoundingClientRect(), p = panel.getBoundingClientRect();
    const x = Math.max(18, Math.min(p.width - 18, chip.left + chip.width / 2 - p.left));
    panel.style.setProperty('--cx', x + 'px');
  }

  function open() {
    if (G.mode.kind === 'lesson') { RR.Settings.open('leave'); return; }
    if (!el) {
      el = document.createElement('div');
      el.className = 'modal drop-modal'; el.hidden = true;
      document.body.appendChild(el);
      el.addEventListener('click', onClick);
      el.addEventListener('input', e => { RR.Settings.battleInput(e); });
      el.addEventListener('change', e => { if (RR.Settings.battleChange(e)) draw(); });
      el.addEventListener('keydown', e => {
        if (e.key === 'Escape') { e.stopPropagation(); close(); }
        if (e.key === 'Enter' && (e.target.id === 'battle-rounds' || e.target.matches('.bt-name'))) { e.preventDefault(); e.target.blur(); }
      });
      window.addEventListener('resize', () => { if (isOpen()) place(); });
    }
    G.pause();
    el.innerHTML = html();
    RR.windowOpened(el);
    el.hidden = false;
    place();
    $('#level-chip').setAttribute('aria-expanded', 'true');
    const f = el.querySelector('.dd-body .on, .dd-body button, .dd-body input') || el.querySelector('.close'); if (f) f.focus();
  }
  function close() {
    if (!isOpen()) return;
    el.hidden = true;
    $('#level-chip').setAttribute('aria-expanded', 'false');
    RR.windowClosed(el);
    RR.Settings.settle();                        // the changes take effect: the next melody, or a new round
  }
  /* away to another window: this one closes first (its changes settle) */
  const thenOpen = fn => { close(); fn(); };

  function onClick(e) {
    if (e.target === el) { close(); return; }
    if (RR.foldClick(e)) return;
    const t = e.target, k = what();
    const d = t.closest('[data-d]');
    if (d) {
      const a = d.dataset.d;
      if (a === 'close') close();
      else if (a === 'page') thenOpen(() => RR.Settings.open('session'));
      else if (a === 'level') {
        // another level, the same way of playing (a round of 7 stays a round of 7)
        const keep = {}; if (G.over.game) keep.game = G.over.game; if (G.over.tricky) keep.tricky = true;
        G.selectLevel(+d.dataset.n, keep); close();
        G.announce('Level ' + d.dataset.n + ': ' + RR.LEVELS[+d.dataset.n - 1].name);
      }
      else if (a === 'session') { G.selectSession(d.dataset.id); close(); }
      else if (a === 'set') { G.switchSet(d.dataset.id); close(); }
      else if (a === 'song') {
        const list = G.songPicks().slice(), id = d.dataset.id, i = list.indexOf(id);
        if (i >= 0) { if (list.length > 1) list.splice(i, 1); } else list.push(id);
        G.setSongPicks(list); draw('[data-d="song"][data-id="' + CSS.escape(id) + '"]');
      }
      else if (a === 'edit-set') { const cur = G.playingSet(); thenOpen(() => RR.Melodies.open(cur && cur.id)); }
      else if (a === 'new-set') thenOpen(() => { RR.Melodies.open(); const nb = document.querySelector('#melodies [data-act="new"]'); if (nb) nb.click(); });
      return;
    }
    // a battle's teams, turns and rounds; Generated's notes and rhythms — Settings' own controls
    if (k === 'battle') { const bc = RR.Settings.battleClick(t); if (bc) { draw(); if (bc === 'add-team') RR.Settings.focusLastTeam(el); } return; }
    if (k === 'gen' && RR.Settings.liveClick(t)) draw();
  }

  RR.Drop = { open, close, isOpen };
})();

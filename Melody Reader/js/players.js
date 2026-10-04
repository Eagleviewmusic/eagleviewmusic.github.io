/* ==========================================================================
   Melody Reader — players.js
   --------------------------------------------------------------------------
   RR.Players — names on a shared classroom computer or smartboard (D23).

   One player per browser until a name is added. With names, the score chip
   says whose turn it is (Maya · ★ 7 · 240), and each player has their own
   saved scores, ladder stars and tricky notes (RR.Scores keeps them under
   the name), and their own points for the session. Switch in the Score
   board or Settings → Points; switching starts a new round.

   The first name added takes over the scores kept so far, so a family
   with one child loses nothing by adding a name. Removing a name removes
   that player's scores (asked first).
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR, G = RR.Game;

  function list() {
    const v = RR.device.players;
    return Array.isArray(v) ? v.filter(n => typeof n === 'string' && n.trim()).map(n => n.trim().slice(0, 20)) : [];
  }
  const current = () => (list().includes(RR.device.player) ? RR.device.player : '');

  function add(raw) {
    const name = String(raw || '').trim().replace(/\s+/g, ' ').slice(0, 20);
    if (!name) return { ok: false, why: 'Type a first name first' };
    const names = list();
    const same = names.find(n => n.toLowerCase() === name.toLowerCase());
    if (same) return { ok: false, why: same + ' is already a player' };
    names.push(name);
    RR.device.players = names;
    if (names.length === 1) {
      // the first name takes over the scores kept so far
      const P = RR.Scores.data.players;
      if (P[''] && !P[name]) { P[name] = P['']; delete P['']; RR.Scores.save(); }
      RR.device.player = name; RR.saveDevice();
      G.drawChips();
    } else {
      RR.saveDevice();
      G.switchPlayer(name);
    }
    return { ok: true, name };
  }
  function remove(name) {
    const names = list().filter(n => n !== name);
    RR.device.players = names;
    delete RR.Scores.data.players[name];
    RR.Scores.save();
    if (RR.device.player === name || !names.length) G.switchPlayer(names[0] || '');
    else RR.saveDevice();
    G.drawChips();
  }
  function use(name) { if (name !== current() && (name === '' || list().includes(name))) G.switchPlayer(name); }

  /* the chips for the Score board and Settings: tap a name to play as them */
  function chipsHtml(withRemove) {
    const names = list(), cur = current();
    return '<div class="players">' + names.map(n =>
      '<span class="player' + (n === cur ? ' on' : '') + '"><button type="button" data-player="' + RR.esc(n) + '" aria-pressed="' + (n === cur) + '">' + RR.esc(n) + '</button>' +
      (withRemove ? '<button type="button" class="x" data-unplayer="' + RR.esc(n) + '" aria-label="Remove ' + RR.esc(n) + '">×</button>' : '') + '</span>').join('') + '</div>';
  }

  RR.Players = { list, current, add, remove, use, chipsHtml };
})();

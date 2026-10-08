/* ==========================================================================
   Melody Reader — lesson.js
   --------------------------------------------------------------------------
   RR.Lesson — a practice shared as a link (DESIGN §15, ENGINE §8):

     ?lesson=Week%203&p=<base64url of the practice>
                     [&m=<base64url of { title, melodies }>]
                     [&ss=<base64url of [{ title, melodies }, …]>]
                     [&b=<base64url of { teams, per, rounds }>]

   Opening one plays that practice as a lesson: the chip reads "Lesson ·
   Week 3", Settings shows only the Lesson, Points and Sound tabs, scores
   are kept under the lesson's name, and the player's own saved practice is
   left as it was. Leave the lesson goes back to it. For focus, not
   security — there is no password.

   Everything that decides what is played travels (2026-10-08, the user's:
   "I want all the exact settings to come through in that link"): the whole
   practice — every field, not just those that differ from today's
   defaults, so a later change of default can't change an old link — the
   melody set it plays (`m`), the My melodies sets its Song format plays
   (`ss`, picked as 'set:lesson_1' …), and a battle's teams, turns and
   rounds (`b`). The browser's own things stay the student's: the sound,
   the volume, Points / Gold stars shown or not, the players.

   Sets travel as their melodies, never a library id: the family rule is
   that lesson payloads carry no item header, so a lesson can never
   overwrite anyone's library. A lesson's sets live in memory only
   (RR.Lesson.set → 'lesson', RR.Lesson.sets → 'lesson_1' …).
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const melodiesOf = s => ({ title: s.title, melodies: s.melodies });
  const readSet = (raw, id) => {
    const s = RR.Sets ? RR.Sets.normalize({ title: raw && raw.title, melodies: raw && raw.melodies }, id) : null;
    return s && s.melodies.length ? { id, title: s.title, melodies: s.melodies, isCustom: true } : null;
  };

  RR.Lesson = {
    set: null,     // the lesson's own melody set, in memory, while a lesson is open
    sets: [],      // the sets its Song format plays ('lesson_1' …)
    link(name, practice, set, battle) {
      const p = RR.sanitize(practice);
      delete p.set;                                   // ids never travel in a lesson
      p.tricky = false;                               // a personal help, not the lesson's
      const playsSet = !!(set && set.melodies && set.melodies.length);
      if (!playsSet && p.from === 'set') p.from = 'made';
      // the Song format's My melodies sets go inside the link, numbered in the order they play
      const extra = [];
      p.songPicks = p.songPicks.map(id => {
        if (id.indexOf('set:') !== 0) return id;
        const s = RR.Sets && RR.Sets.get(id.slice(4));
        if (!s || !s.melodies.length) return null;
        extra.push(melodiesOf(s));
        return 'set:lesson_' + extra.length;
      }).filter(Boolean);
      let href = RR.pageBase() + '?lesson=' + encodeURIComponent(String(name).slice(0, 40)) + '&p=' + RR.b64enc(p);
      if (playsSet) href += '&m=' + RR.b64enc(melodiesOf(set));
      if (extra.length) href += '&ss=' + RR.b64enc(extra);
      if (battle) href += '&b=' + RR.b64enc(RR.cleanBattle(battle));
      return href;
    },
    /* the lesson in a link, if it has one; bad: true when part of it didn't read */
    parse(href) {
      let q;
      try { q = new URL(href, location.href).searchParams; } catch (_) { return null; }
      if (!q.has('lesson')) return null;
      let raw = {}, bad = false, set = null, battle = null;
      const sets = [];
      try { raw = q.get('p') ? RR.b64dec(q.get('p')) : {}; } catch (_) { bad = true; }
      if (q.get('m')) {
        try { set = readSet(RR.b64dec(q.get('m')), 'lesson'); if (!set) bad = true; } catch (_) { bad = true; }
      }
      if (q.get('ss')) {
        try {
          const list = RR.b64dec(q.get('ss'));
          (Array.isArray(list) ? list : []).slice(0, 40).forEach((x, i) => { sets[i] = readSet(x, 'lesson_' + (i + 1)); });
        } catch (_) { bad = true; }
      }
      if (q.get('b')) {
        try { battle = RR.cleanBattle(RR.b64dec(q.get('b'))); } catch (_) { bad = true; }
      }
      const practice = RR.sanitize(raw);
      // a Song set that didn't come through is left out
      practice.songPicks = practice.songPicks.filter(id => { const m = /^set:lesson_(\d+)$/.exec(id); return !m ? id.indexOf('set:') !== 0 : !!sets[+m[1] - 1]; });
      if (set) {
        practice.set = 'lesson';
        // a link made before 2026-10-08 had no 'set' Melody Source: its set was laid over the practice —
        // and, with the Song format, played as the song
        if (practice.from !== 'set') {
          practice.from = 'set';
          if (practice.game === 'song' && !practice.songPicks.length) practice.songPicks = ['set:lesson'];
        }
      } else {
        practice.set = null;
        if (practice.from === 'set') practice.from = 'made';
      }
      return { name: (q.get('lesson') || 'Lesson').slice(0, 40), practice, set, sets, battle, bad };
    },
    /* the lesson in the address */
    fromUrl() {
      const l = RR.Lesson.parse(location.href);
      if (l && l.bad) RR.toast("Part of that lesson link didn't read — playing it with the usual settings");
      if (l) { RR.Lesson.set = l.set; RR.Lesson.sets = l.sets; }
      return l;
    },
    leave() {
      try { history.replaceState(null, '', RR.pageBase()); } catch (_) { /* a page that can't change its address just restores */ }
      document.title = 'Melody Reader';
      RR.Lesson.set = null; RR.Lesson.sets = [];
      RR.App.restore();
      RR.toast('Back to your own levels');
    }
  };
})();

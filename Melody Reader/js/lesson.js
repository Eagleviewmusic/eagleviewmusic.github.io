/* ==========================================================================
   Melody Reader — lesson.js
   --------------------------------------------------------------------------
   RR.Lesson — a practice shared as a link (DESIGN §15, ENGINE §8):

     ?lesson=Week%203&p=<base64url of the practice, less its defaults>
                     [&m=<base64url of { title, melodies }>]

   Opening one plays that practice as a lesson: the chip reads "Lesson ·
   Week 3", Settings shows only the Lesson, Points and Sound tabs, scores
   are kept under the lesson's name, and the player's own saved practice is
   left as it was. Leave the lesson goes back to it. For focus, not
   security — there is no password.

   A lesson that plays a melody set carries the melodies themselves (`m`),
   never a library id: the family rule is that lesson payloads carry no
   item header, so a lesson can never overwrite anyone's library. Its set
   lives in memory only (RR.Lesson.set) and is played as set 'lesson'.
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;

  RR.Lesson = {
    set: null,     // the lesson's own melody set, in memory, while a lesson is open
    link(name, practice, set) {
      const p = RR.trimPractice(practice);
      delete p.set;                                   // ids never travel in a lesson
      let href = RR.pageBase() + '?lesson=' + encodeURIComponent(String(name).slice(0, 40)) + '&p=' + RR.b64enc(p);
      if (set && set.melodies && set.melodies.length) href += '&m=' + RR.b64enc({ title: set.title, melodies: set.melodies });
      return href;
    },
    /* the lesson in a link, if it has one; bad: true when part of it didn't read */
    parse(href) {
      let q;
      try { q = new URL(href, location.href).searchParams; } catch (_) { return null; }
      if (!q.has('lesson')) return null;
      let raw = {}, bad = false, set = null;
      try { raw = q.get('p') ? RR.b64dec(q.get('p')) : {}; } catch (_) { bad = true; }
      if (q.get('m')) {
        try {
          const m = RR.b64dec(q.get('m'));
          const s = RR.Sets ? RR.Sets.normalize({ title: m && m.title, melodies: m && m.melodies }, 'lesson') : null;
          if (s && s.melodies.length) set = { id: 'lesson', title: s.title, melodies: s.melodies, isCustom: true };
          else bad = true;
        } catch (_) { bad = true; }
      }
      const practice = RR.sanitize(raw);
      practice.set = set ? 'lesson' : null;
      return { name: (q.get('lesson') || 'Lesson').slice(0, 40), practice, set, bad };
    },
    /* the lesson in the address */
    fromUrl() {
      const l = RR.Lesson.parse(location.href);
      if (l && l.bad) RR.toast("Part of that lesson link didn't read — playing it with the usual settings");
      if (l) RR.Lesson.set = l.set;
      return l;
    },
    leave() {
      try { history.replaceState(null, '', RR.pageBase()); } catch (_) { /* a page that can't change its address just restores */ }
      document.title = 'Melody Reader';
      RR.Lesson.set = null;
      RR.App.restore();
      RR.toast('Back to your own levels');
    }
  };
})();

/* ==========================================================================
   Melody Reader — lesson.js
   --------------------------------------------------------------------------
   RR.Lesson — whatever is playing, shared as a link (DESIGN §15, ENGINE §8):

     ?lesson=Week%203&z=~<deflated base64url of { p, m, ss, b, t, tempo }>

   Opening one plays it as a lesson: the chip reads "Lesson · Week 3",
   Settings shows only the Lesson, Points and Sound tabs, scores are kept
   under the lesson's name, and the player's own saved practice is left as
   it was. Leave the lesson goes back to it. For focus, not security —
   there is no password.

   Everything that decides what is played travels (2026-10-08, the user's:
   "I want all the exact settings to come through in that link"):

     p       the whole practice — every field, not just those that differ
             from today's defaults, so a later change of default can't
             change an old link
     m       the melody set it plays, as its melodies
     ss      the My melodies sets its Song format plays (picked as
             'set:lesson_1' …)
     b       a battle's teams, turns and rounds
     t       (2026-10-13, the user's: "a link to whatever it is they are
             doing — even practice sessions, and songs and whatever")
             Practice or Songs instead of a practice: { id, at, song, look }
             — one of Practice's six lessons ('L2') or a Songbook song
             ('S:hot-cross-buns') by name; one of your own (an exercise, your
             copy of a lesson or a song, a set played as a song) as 'U' or
             'M' with its melodies in `m`; where it opens (`at`: the exercise
             or slide); a song's section, Practice and Auto-Next; the Tools
             look (colours, staff, letters, Auto-Next, click or drum beat)
     tempo   the tempo dial's tempo (2026-10-13)

   A session played the Practice or Songs way travels as that lesson or
   song, under the session's name. The browser's own things stay the
   student's: the sound, the volume, Points / Gold stars shown or not, the
   players, the checks and gold stars a student has on Practice's lessons.

   SHORT LINKS (2026-10-13, as Song Writer 2.5's of the same day: a long
   link can be cut short on its way into a Google Site). Everything is one
   JSON, deflated (the browser's CompressionStream) and written after a '~'
   in `z` — a level's about 40% shorter (~530 characters); with melodies
   inside, under a third as long.
   Inflating is asynchronous, so app.js waits for RR.Lesson.unpack() before
   it starts, and parse() stays synchronous. A browser that can't deflate
   still makes the long form (p= m= ss= b= t= tempo=, each base64url), and
   links of either form made before keep opening. A short link that can't
   be read (cut short) opens nothing: the app opens as usual and says so.
   SHORTER STILL (2026-10-19, the user's: a Round's ~500-character link
   was too long for Schoology): a short link now carries only what isn't
   a default — against LINK_1, a copy of the day's defaults kept here and
   never changed — and its melodies as a few letters each; it opens at the
   folder (no index.html). A generated Round is under 200 characters.

   Sets travel as their melodies, never a library id: the family rule is
   that lesson payloads carry no item header, so a lesson can never
   overwrite anyone's library. A lesson's sets live in memory only
   (RR.Lesson.set → 'lesson', RR.Lesson.sets → 'lesson_1' …; Practice and
   Songs play the set as 'U:lesson' / 'M:lesson').
   ========================================================================== */
(function () {
  'use strict';
  const RR = window.RR;
  const melodiesOf = s => ({ title: s.title, melodies: s.melodies });
  const readSet = (raw, id) => {
    const s = RR.Sets ? RR.Sets.normalize({ title: raw && raw.title, melodies: raw && raw.melodies }, id) : null;
    return s && s.melodies.length ? { id, title: s.title, melodies: s.melodies, isCustom: true } : null;
  };
  const clip = (s, n) => String(s == null ? '' : s).slice(0, n);

  /* ---- short links: deflated JSON in base64url after '~' ---- */
  const canPack = typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';
  async function streamBytes(bytes, stream) {
    return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
  }
  function toB64u(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function fromB64u(s) {
    let b = String(s).replace(/-/g, '+').replace(/_/g, '/');
    while (b.length % 4) b += '=';
    const bin = atob(b), out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  const unpacked = {};       // a short link's `z`, read before the app started: its data (or null: it didn't read)

  /* ---- shorter still: only what isn't a default (2026-10-19, the user's: a Round of generated notes was "too
     long for Schoology", which sent the class to the home page — every link carried all ~35 settings, ~500
     characters) ----
     A short link made from now on says `v: 1` and carries only what differs from LINK_1: the defaults of
     2026-10-19, written out here and NEVER to be changed (new defaults would be a LINK_2, with v: 2). So every
     setting still travels (the 2026-10-08 rule) — the unchanged ones by the version number — and a later change
     of RR.DEFAULTS can't change what an old link plays. Melodies go in as a few letters each: the beats, then
     each note and its length, then the title ('4E4qD4qC4h|Hot Cross Buns 1'; z = a rest). A generated Round:
     ~500 → under 200 characters. Links without `v` (made before) are read as they always were.
     A LEVEL goes by its number (`lv`) and only what differs from the level as made (your changes to it, a round's
     length …) — as Practice's lessons and the Songbook's songs go by name: Level 15 was 421 characters, now
     under 100. (So a level redone later opens redone, with the link's changes on top.)
     v: 2 (2026-10-19, the same day): Practice Off became the usual (practiceStart 'off' — each melody opens
     live), so LINK_2 is LINK_1 with that one change; a v: 1 link keeps its Practice On. */
  const LINK_1 = {
    p: {
      notes: ['C4', 'D4', 'E4', 'F4', 'G4'], moves: 'steps', endDo: true, tricky: false, grey: false,
      rhythms: ['q', 'h'], time: [4, 4], bars: 1, endLong: true, times: [[4, 4]], pickup: false,
      leaps: ['P4', 'P5'], endLa: false, focus: [], practice: true, practiceStart: 'on', oneGo: false, flash: 0,
      gold: 11, game: 'round5', clockSecs: 60, song: null, songPicks: [], from: 'both', auto: true,
      colour: 'always', letters: true, nums: true, glow: 'after2', labels: 'none', staff: 'plain', beat: 'click',
      playHidden: false, playLights: true, songs: []
    },
    look: { colour: 'solid', staff: 'notes', labels: 'letters', auto: false, beat: 'click' },
    b: { per: 1, rounds: 3, tools: true },
    tempo: 72
  };
  const LINK_2 = { p: Object.assign({}, LINK_1.p, { practiceStart: 'off' }), look: LINK_1.look, b: LINK_1.b, tempo: LINK_1.tempo };
  const LINKS = { 1: LINK_1, 2: LINK_2 }, V = 2;      // V: the version a link is made in
  const obj = x => x && typeof x === 'object' && !Array.isArray(x) ? x : {};
  const less = (o, base) => {
    const out = {};
    Object.keys(o).forEach(k => { if (JSON.stringify(o[k]) !== JSON.stringify(base[k])) out[k] = o[k]; });
    return out;
  };
  const DUR = { 1: 's', 2: 'e', 3: 'f', 4: 'q', 6: 'r', 8: 'h', 12: 'i', 16: 'w' };     // a note's length in ticks
  const TICKS = {};
  Object.keys(DUR).forEach(t => { TICKS[DUR[t]] = +t; });
  const melIn = m => m.time[0] + m.notes.map(n => (n.p || 'z') + DUR[n.t]).join('') + (m.title ? '|' + m.title : '');
  function melOut(s) {
    if (typeof s !== 'string') return null;
    const bar = s.indexOf('|'), code = bar < 0 ? s : s.slice(0, bar);
    if (!/^[234]/.test(code)) return null;
    const notes = [], re = /([A-G]\d|z)([sefqrhiw])/g;
    let x, at = 1;
    while ((x = re.exec(code)) && x.index === at) { notes.push({ p: x[1] === 'z' ? null : x[1], t: TICKS[x[2]] }); at = re.lastIndex; }
    return at === code.length ? { title: bar < 0 ? '' : s.slice(bar + 1), time: [+code[0], 4], notes } : null;   // a stray letter: not a melody
  }
  const setIn = s => [s.title || ''].concat(s.melodies.map(melIn));
  const setOut = a => Array.isArray(a) ? { title: a[0], melodies: a.slice(1).map(melOut).filter(Boolean) } : null;
  /* the parts as a short link carries them … */
  const levelOk = n => Number.isInteger(n) && n >= 1 && n <= RR.LEVELS.length;
  function trim(d) {
    const o = { v: V }, LINK = LINKS[V];
    if (d.p && levelOk(d.lv)) { o.lv = d.lv; o.p = less(d.p, RR.originalLevel(d.lv)); }
    else if (d.p) o.p = less(d.p, LINK.p);
    if (d.m) o.m = setIn(d.m);
    if (d.ss) o.ss = d.ss.map(setIn);
    if (d.b) o.b = less(d.b, LINK.b);
    if (d.t) {
      o.t = Object.assign({}, d.t);
      const look = d.t.look ? less(d.t.look, LINK.look) : {};
      if (Object.keys(look).length) o.t.look = look; else delete o.t.look;
    }
    if (d.tempo != null && d.tempo !== LINK.tempo) o.tempo = d.tempo;
    return o;
  }
  /* … and whole again: null when it's a kind of link this app doesn't know (a newer one) */
  function untrim(d) {
    if (d.v == null) return d;                    // made before 2026-10-19: every part whole
    const LINK = LINKS[d.v];
    if (!LINK) return null;
    const o = { tempo: d.tempo != null ? d.tempo : LINK.tempo };
    if (d.lv != null && !levelOk(d.lv)) return null;            // a level this app doesn't have
    if (d.p) o.p = Object.assign(d.lv ? RR.originalLevel(d.lv) : RR.clone(LINK.p), obj(d.p));
    if (d.m) o.m = setOut(d.m);
    if (Array.isArray(d.ss)) o.ss = d.ss.map(setOut);
    if (d.b) o.b = Object.assign(RR.clone(LINK.b), obj(d.b));
    if (d.t) o.t = Object.assign({}, obj(d.t), { look: Object.assign({}, LINK.look, obj(obj(d.t).look)) });
    return o;
  }
  /* where a short link opens: the folder, not index.html, on the web (10 characters); a space in the name is + */
  const linkBase = () => RR.pageBase().replace(/^(https?:\/\/.*\/)index\.html$/, '$1');
  const nameParam = name => encodeURIComponent(clip(name, 40)).replace(/%20/g, '+');

  /* ---- what the link carries ---- */
  /* a practice (a level, a session of Rounds, Games or Battle, Generated, a set): { p, m, ss, b } */
  function practiceData(practice, set, battle) {
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
    const d = { p };
    if (playsSet) d.m = melodiesOf(set);
    if (extra.length) d.ss = extra;
    if (battle) d.b = RR.cleanBattle(battle);
    return d;
  }
  /* Practice or Songs (G.mode.kind 'teach'): { t, m } — null when there is nothing to play.
     `from` 'start': from its first exercise (a Practice lesson: the student's first not yet played) or
     the section's first slide; else where it is now */
  function teachData(mode, at, from) {
    const L = RR.teachLevel(mode.id);
    if (!L || !L.ex.length) return null;
    let id = L.id, set = null;
    if (/^[UM]:/.test(id)) {
      set = RR.Sets.get(L.set);
      if (!set || !set.melodies.length) return null;
      id = id[0];                                   // your own: its melodies go inside, never its id
    }
    const t = { id, look: RR.teachLook() };
    if (mode.song) t.song = { from: mode.from | 0, to: mode.to == null ? L.ex.length - 1 : mode.to | 0, practice: !!mode.practice, auto: mode.auto !== false };
    if (from !== 'start') t.at = at | 0;
    else if (mode.song) t.at = t.song.from;
    const d = { t };
    if (set) d.m = melodiesOf(set);
    return d;
  }

  /* the long form: each part its own parameter (the only form before 2026-10-13; still made where the browser
     can't deflate) */
  function longLink(name, d) {
    let href = RR.pageBase() + '?lesson=' + encodeURIComponent(clip(name, 40));
    ['p', 'm', 'ss', 'b', 't'].forEach(k => { if (d[k]) href += '&' + k + '=' + RR.b64enc(d[k]); });
    if (d.tempo) href += '&tempo=' + d.tempo;
    return href;
  }
  async function shortLink(name, d) {
    if (!canPack) return longLink(name, d);
    try {
      return linkBase() + '?lesson=' + nameParam(name) + '&z=~' +
        toB64u(await streamBytes(new TextEncoder().encode(JSON.stringify(trim(d))), new CompressionStream('deflate')));
    } catch (_) { return longLink(name, d); }
  }

  /* ---- reading one back ---- */
  const LESSONS = () => (RR.TEACH || []).map(x => x.id);
  function readTeach(t, set) {
    if (!t || typeof t !== 'object') return null;
    let id = typeof t.id === 'string' ? t.id : '';
    if (id === 'U' || id === 'M') id = set ? id + ':lesson' : '';
    const ok = LESSONS().includes(id) || (/^S:/.test(id) && RR.SONGS && RR.SONGS[id.slice(2)]) || /^[UM]:lesson$/.test(id);
    if (!ok) return null;
    const n = x => Number.isFinite(+x) && +x >= 0 ? Math.floor(+x) : undefined;
    const s = t.song && typeof t.song === 'object' ? t.song : null;
    return {
      id, at: n(t.at), look: RR.cleanTeachLook(t.look),
      song: s ? { from: n(s.from) || 0, to: n(s.to), practice: s.practice === true, auto: s.auto !== false } : null
    };
  }

  RR.Lesson = {
    set: null,     // the lesson's own melody set, in memory, while a lesson is open
    sets: [],      // the sets its Song format plays ('lesson_1' …)
    rev: 0,        // moves on whenever those change (Practice's levels built from them are built again)
    canPack,
    /* a practice's link, the long form (what every link was until 2026-10-13; the tests read it) */
    link(name, practice, set, battle) { return longLink(name, practiceData(practice, set, battle)); },
    /* what is playing, as a link's parts — `from` 'start' or 'here' (Practice and Songs); null when it
       can't be one */
    current(from) {
      const G = RR.Game, m = G.mode;
      const d = m.kind === 'teach' ? teachData(m, RR.Teach.at, from) : practiceData(G.setup, G.playingSet(), G.battle);
      if (d) d.tempo = G.tempo;
      if (d && m.kind === 'level') d.lv = m.n;           // a short link names the level (2026-10-19)
      return d;
    },
    longLink, shortLink,
    /* the name a link of what is playing starts with */
    defaultName() {
      const G = RR.Game, m = G.mode;
      if (m.kind === 'session') return m.name;
      if (m.kind === 'level') return 'Level ' + m.n;
      if (m.kind === 'teach') {
        if (m.session) return m.session.name;
        const L = RR.teachLevel(m.id) || {};
        return clip(m.song || L.unit ? L.title : 'Practice ' + L.title, 40);
      }
      return clip(String(m.label || '').replace(/^[♫♪]\s*/, ''), 40);
    },
    /* a short link in the address: read it before the app starts (app.js) */
    needsUnpack(href) {
      try { return (new URL(href || location.href, location.href).searchParams.get('z') || '').charAt(0) === '~'; } catch (_) { return false; }
    },
    async unpack(href) {
      let z;
      try { z = new URL(href || location.href, location.href).searchParams.get('z'); } catch (_) { return; }
      if (!z || z.charAt(0) !== '~' || z in unpacked) return;
      unpacked[z] = null;
      if (!canPack) return;
      try {
        const d = JSON.parse(new TextDecoder().decode(await streamBytes(fromB64u(z.slice(1)), new DecompressionStream('deflate'))));
        unpacked[z] = d && typeof d === 'object' && !Array.isArray(d) ? d : null;
      } catch (_) { /* cut short, most likely: parse says it's lost */ }
    },
    /* the lesson in a link, if it has one; bad: true when part of it didn't read; lost: true when nothing of it
       can be played (a short link cut short, a lesson or song that isn't in this app) */
    parse(href) {
      let q;
      try { q = new URL(href, location.href).searchParams; } catch (_) { return null; }
      if (!q.has('lesson')) return null;
      const name = (q.get('lesson') || 'Lesson').slice(0, 40);
      let bad = false, set = null, battle = null, raw = {};
      const sets = [];
      // the parts: one short `z`, or each its own parameter
      const z = q.get('z');
      let d;
      if (z) {
        d = z.charAt(0) === '~' && unpacked[z] ? untrim(unpacked[z]) : null;
        if (!d) return { name, lost: true };
      } else {
        d = {};
        ['p', 'm', 'ss', 'b', 't'].forEach(k => { if (q.get(k)) { try { d[k] = RR.b64dec(q.get(k)); } catch (_) { bad = true; } } });
        if (q.get('tempo')) d.tempo = q.get('tempo');
      }
      if (d.p) raw = d.p;
      if (d.m) { set = readSet(d.m, 'lesson'); if (!set) bad = true; }
      if (d.ss) (Array.isArray(d.ss) ? d.ss : []).slice(0, 40).forEach((x, i) => { sets[i] = readSet(x, 'lesson_' + (i + 1)); });
      if (d.b) { try { battle = RR.cleanBattle(d.b); } catch (_) { bad = true; } }
      const tempo = d.tempo != null && Number.isFinite(+d.tempo) && RR.snapTempo ? RR.snapTempo(+d.tempo) : null;
      // Practice or Songs: nothing else to read — and if it can't be played, nothing is
      if (d.t) {
        const teach = readTeach(d.t, set);
        return teach ? { name, teach, set, sets: [], battle: null, practice: RR.sanitize({}), tempo, bad } : { name, lost: true };
      }
      const practice = RR.sanitize(raw && typeof raw === 'object' ? raw : {});
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
      return { name, practice, set, sets, battle, teach: null, tempo, bad };
    },
    /* the lesson in the address */
    fromUrl() {
      const l = RR.Lesson.parse(location.href);
      if (l && l.lost) {
        RR.toast('That lesson link didn’t come through whole — it may have been cut short. Ask for it again.', 7000);
        return null;
      }
      if (l && l.bad) RR.toast("Part of that lesson link didn't read — playing it with the usual settings");
      if (l) { RR.Lesson.set = l.set; RR.Lesson.sets = l.sets; RR.Lesson.rev++; }
      return l;
    },
    leave() {
      try { history.replaceState(null, '', RR.pageBase()); } catch (_) { /* a page that can't change its address just restores */ }
      document.title = 'Melody Reader';
      RR.Lesson.set = null; RR.Lesson.sets = []; RR.Lesson.rev++;
      RR.lessonLook = null;                       // Practice's look is this browser's again
      RR.App.restore();
      RR.toast('Back to your own levels');
    }
  };
})();

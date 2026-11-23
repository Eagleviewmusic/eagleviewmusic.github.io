/* ==========================================================================
   Virtual Chordophone — chords.js                              VC.chords
   --------------------------------------------------------------------------
   The chord engine: which chords the boxes hold, how each one is named and
   which notes it sounds. Song Writer 3.5's chord engine (js/chords.js),
   ported to stand on its own — the same Theory (lib/theory.js, Digital
   Accordion's), the same functions and inversions, the same voicing, the
   same "own notes" — so a chord here sounds and reads as it does there.

   THE BOXES — nine places, named by the key that plays them (Digital
   Accordion's and Song Writer's keys), in the order the sets add them:
       F = I   S = IV   D = V   A = vi        Basic
       G = ii  R = iii                         Full     (+ ii and iii)
       E = V/V W = IV/IV Q = V/vi              Extended (+ V/V, IV/IV, V/vi)
   Major keys only (for now): the chords are the Major scale's.

   A BOX'S CHORD — { root, q, mods } (root a degree '1' '♭7'…, q a Theory
   quality, mods the functions below) and, if the player has set them, its
   own notes (`voice`: semitones above the key's tonic, low to high, so they
   move with the key).

   FUNCTIONS (Song Writer's Z X C V B and inversions):
     sus2 · add9 · sus4 · ♭7 · maj7        colour (Theory.applyMods)
     6 · 6/4 · 6/5 · 4/3 · 4/2            inversions (6/5 4/3 4/2 add the scale's 7th first)

   API
     PLACES · SETS · placesOf(set) · KEY_OF(place)
     keyName(k) · tonicMidi(k)
     defaultSpec(place) · parse(spec) · sameSpec(a, b)
     describe(spec, voice, k) → { roman, letter, quality, color, tones, bass, own }
     midis(spec, voice, k) · voiceOf(spec, k) · cleanVoice(v)
     MOD_FUNCS · toggleMod(spec, id) · ROOTS · QUALITY_CHOICES
     labelHTML(text) · nameScale(text) · escapeHtml(s)
   ========================================================================== */
(function () {
  'use strict';
  const VC = window.VC = window.VC || {};
  const T = (typeof Theory !== 'undefined') ? Theory : null;   // a top-level const, not on window
  if (!T) { console.error('chords.js: lib/theory.js is missing'); return; }

  const MAJOR = T.SCALE_BY_ID.major;
  const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const SOLFEGE_UP = ['Do', 'Di', 'Re', 'Ri', 'Mi', 'Fa', 'Fi', 'So', 'Si', 'La', 'Li', 'Ti'];
  const SOLFEGE_DOWN = ['Do', 'Ra', 'Re', 'Me', 'Mi', 'Fa', 'Se', 'So', 'Le', 'La', 'Te', 'Ti'];

  /* ---------------- the places and the sets ---------------- */
  // the order the user listed them: I IV V vi · ii iii · V/V IV/IV V/vi
  const PLACES = ['f', 's', 'd', 'a', 'g', 'r', 'e', 'w', 'q'];
  // MAJOR.chords is in Digital Accordion's order: I V IV vi ii iii V/V V/vi IV/IV → f d s a g r e q w
  const RANK_PLACE = ['f', 'd', 's', 'a', 'g', 'r', 'e', 'q', 'w'];
  const SETS = [
    { id: 'basic', name: 'Basic', places: 'fsda', adds: 'I IV V vi' },
    { id: 'full', name: 'Full', places: 'fsdagr', adds: '+ ii iii' },
    { id: 'extended', name: 'Extended', places: 'fsdagrewq', adds: '+ V/V IV/IV V/vi' }
  ];
  function placesOf(setId) {
    const s = SETS.find(x => x.id === setId) || SETS[0];
    return PLACES.filter(p => s.places.indexOf(p) !== -1);
  }
  const KEY_OF = p => p.toUpperCase();

  /* ---------------- keys (major only) ---------------- */
  const keyName = k => T.tonicName(((k % 12) + 12) % 12, 'major').replace(/b/g, '♭').replace(/#/g, '♯');
  const keyAscii = k => T.tonicName(((k % 12) + 12) % 12, 'major');
  const tonicMidi = k => T.tonicMidi(((k % 12) + 12) % 12);

  /* ---------------- the functions ---------------- */
  const MOD_FUNCS = [
    { id: 'sus2', name: 'sus2', engine: 'Z', does: 'The 3rd drops to the 2nd' },
    { id: 'sus4', name: 'sus4', engine: 'C', does: 'The 3rd rises to the 4th' },
    { id: 'add9', name: 'add9', engine: 'X', does: 'Adds the 9th' },
    { id: 'b7', name: '♭7', engine: 'V', does: 'Adds the minor 7th (with maj7: a 6th)' },
    { id: 'maj7', name: 'maj7', engine: 'B', does: 'Adds the major 7th (with ♭7: a 6th)' },
    { id: 'inv6', name: '6', figs: ['6'], inv: 1, does: 'First inversion: the 3rd in the bass' },
    { id: 'inv64', name: '6/4', figs: ['6', '4'], inv: 2, does: 'Second inversion: the 5th in the bass' },
    { id: 'inv65', name: '6/5', figs: ['6', '5'], inv: 1, seventh: true, does: 'A 7th chord, the 3rd in the bass' },
    { id: 'inv43', name: '4/3', figs: ['4', '3'], inv: 2, seventh: true, does: 'A 7th chord, the 5th in the bass' },
    { id: 'inv42', name: '4/2', figs: ['4', '2'], inv: 3, seventh: true, does: 'A 7th chord, the 7th in the bass' }
  ];
  const MOD_BY_ID = {};
  MOD_FUNCS.forEach(f => { MOD_BY_ID[f.id] = f; });
  const ORDER = MOD_FUNCS.map(f => f.id);
  function cleanMods(list) {
    const out = [];
    (Array.isArray(list) ? list : []).forEach(id => { if (MOD_BY_ID[id] && out.indexOf(id) === -1) out.push(id); });
    return ORDER.filter(id => out.indexOf(id) !== -1);
  }
  /* a function pressed on a chord: on or off. sus2 and sus4 take each other's place, and one inversion at a time. */
  function toggleMod(spec, id) {
    const sp = parse(spec);
    if (!sp || !MOD_BY_ID[id]) return sp;
    let mods = sp.mods.slice();
    if (mods.indexOf(id) !== -1) mods = mods.filter(m => m !== id);
    else {
      if (id === 'sus2') mods = mods.filter(m => m !== 'sus4');
      if (id === 'sus4') mods = mods.filter(m => m !== 'sus2');
      if (MOD_BY_ID[id].inv) mods = mods.filter(m => !MOD_BY_ID[m].inv);
      mods.push(id);
    }
    return Object.assign({}, sp, { mods: cleanMods(mods) });
  }

  /* ---------------- specs ---------------- */
  function parse(x) {
    if (!x || typeof x !== 'object') return null;
    if (!T.QUALITIES[x.q] || !/^[#b]*[1-7]$/.test(String(x.root))) return null;
    const spec = { root: String(x.root), q: x.q, mods: cleanMods(x.mods) };
    if (typeof x.label === 'string' && x.label.trim()) spec.label = x.label.trim().slice(0, 12);
    return spec;
  }
  function defaultSpec(place) {
    const c = MAJOR.chords[RANK_PLACE.indexOf(place)];
    return c ? { root: c.root, q: c.q, mods: [], label: c.label || undefined } : { root: '1', q: 'maj', mods: [] };
  }
  const sameSpec = (a, b) => !!(a && b) && a.root === b.root && a.q === b.q && cleanMods(a.mods).join() === cleanMods(b.mods).join();

  /* the 12 roots a box can be given, spelled as the Major scale would */
  const ROOTS = ['1', 'b2', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'];
  /* the qualities offered for a box's chord (Theory has more) */
  const QUALITY_CHOICES = ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4', 'pow', 'dom7', 'maj7', 'min7', 'm7b5', 'dim7', 'six', 'min6', 'add9', 'madd9'];

  /* ---------------- theory: tones, voicing, names (Song Writer's) ---------------- */
  function effective(spec) {
    const mods = cleanMods(spec.mods);
    const letters = ['V', 'B', 'Z', 'C', 'X'].filter(L => mods.some(id => MOD_BY_ID[id].engine === L));
    let tones = letters.length ? T.applyMods(T.qualityTones(spec.q), letters) : null;
    const invs = mods.filter(id => MOD_BY_ID[id].inv);
    const inv = invs.length ? MOD_BY_ID[invs[invs.length - 1]] : null;
    if (inv && inv.seventh) {
      const t = tones || T.qualityTones(spec.q);
      if (!t.some(x => x[1] === 7)) tones = withSeventh(spec, t);
    }
    return { mods, tones, inv, colour: letters.length > 0 };
  }
  /* a triad made a 7th chord: the 7th the scale has above the root; a ♭7 where it has neither */
  function withSeventh(spec, tones) {
    const set = new Set(MAJOR.degrees.map(T.degreeSemis));
    const r = T.degreeSemis(spec.root);
    const semi = [10, 11, 9].find(x => set.has((r + x) % 12));
    return tones.concat([[semi === undefined ? 10 : semi, 7]]).sort((a, b) => a[0] - b[0]);
  }
  function bassTone(tones, n) {
    const has3 = tones.some(t => t[1] === 3);
    const members = tones.filter(t => t[1] === 3 || t[1] === 5 || t[1] === 7 || (!has3 && (t[1] === 2 || t[1] === 4))).sort((a, b) => a[1] - b[1]);
    return members[n - 1] || null;
  }
  function accAscii(alter) { return alter > 0 ? '#'.repeat(alter) : alter < 0 ? 'b'.repeat(-alter) : ''; }
  function pretty(s) { return String(s).replace(/b(?=[IViv\d])/g, '♭').replace(/#(?=[IViv\d])/g, '♯'); }
  function prettyAcc(s) { return String(s).replace(/#/g, '♯').replace(/b/g, '♭'); }
  /* The chord's notes spelled in the key: a tone the scale has takes the scale's spelling,
     one outside sits on the letter its interval says. Root first. */
  function spellTones(spec, tones, k) {
    const t = keyAscii(k);
    const rootP = T.parseDegree(spec.root);
    const rootSemis = T.degreeSemis(spec.root);
    const seen = new Set(), out = [];
    (tones || T.qualityTones(spec.q)).slice().sort((a, b) => a[0] - b[0]).forEach(tone => {
      const semis = tone[0], gen = tone[1] - 1;
      const pc = (rootSemis + semis) % 12;
      if (seen.has(pc)) return;
      seen.add(pc);
      let deg = MAJOR.degrees.find(d => T.degreeSemis(d) === pc);
      if (!deg) {
        const num = ((rootP.num - 1 + gen) % 7) + 1;
        let alter = ((pc - MAJOR_SEMIS[num - 1]) % 12 + 12) % 12;
        if (alter > 6) alter -= 12;
        deg = accAscii(alter) + num;
      }
      const p = T.parseDegree(deg);
      const sp = T.spellDegree(t, deg);
      out.push({
        deg, degreeLabel: prettyAcc(accAscii(p.alter)) + p.num,
        solfege: (p.alter > 0 ? SOLFEGE_UP : SOLFEGE_DOWN)[pc],
        name: sp.name, letter: sp.letter, color: T.KEY_COLORS[sp.letter], pc
      });
    });
    return out;
  }
  function figured(roman, n, has7) {
    const figs = has7 ? ['⁶₅', '⁴₃', '⁴₂'][n - 1] : ['⁶', '⁶₄', '⁶₄'][n - 1];
    const cut = roman.indexOf('/');
    let head = cut < 0 ? roman : roman.slice(0, cut);
    const tail = cut < 0 ? '' : roman.slice(cut);
    if (has7) head = head.replace(/7$/, '');
    return head + figs + tail;
  }
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBS = '₀₁₂₃₄₅₆₇₈₉';
  const FIGS_RE = /([⁰¹²³⁴⁵⁶⁷⁸⁹]+)([₀₁₂₃₄₅₆₇₈₉]*)/g;
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]); }
  /* a label as HTML: figured-bass numbers drawn as a small stack */
  function labelHTML(text) {
    return escapeHtml(text).replace(FIGS_RE, (m, sup, sub) => {
      const top = Array.from(sup).map(c => SUPS.indexOf(c)).join('');
      const low = Array.from(sub).map(c => SUBS.indexOf(c)).join('');
      return low ? '<span class="figs"><i>' + top + '</i><i>' + low + '</i></span>' : '<sup class="fig">' + top + '</sup>';
    });
  }
  function nameScale(text) {
    const n = Array.from(String(text).replace(/[⁰-⁹₀-₉]/g, '')).length;
    return n <= 3 ? 1 : n === 4 ? 0.86 : n === 5 ? 0.74 : n === 6 ? 0.64 : n === 7 ? 0.56 : 0.48;
  }
  /* the scale's own label for a chord (V/V, IV/IV), if it has one */
  function presetLabel(spec) {
    const hit = MAJOR.chords.concat(MAJOR.top || []).find(c => c.root === spec.root && c.q === spec.q && c.label);
    return hit ? hit.label : null;
  }

  /* everything a box shows about its chord, from the spec */
  function describeSpec(spec, k) {
    const eff = effective(spec);
    const tones = eff.tones || T.qualityTones(spec.q);
    const rootSp = T.spellDegree(keyAscii(k), spec.root);
    const sfx = T.suffixFor(tones, spec.q);
    const named = spellTones(spec, tones, k);
    let roman = (!eff.colour && (spec.label || presetLabel(spec))) || (eff.tones ? T.romanForTones(spec.root, tones, spec.q) : T.romanFor(spec.root, spec.q));
    roman = pretty(roman);
    let letter = rootSp.name + sfx.sfx;
    let bass = null;
    if (eff.inv) {
      const bt = bassTone(tones, eff.inv.inv);
      if (bt) {
        roman = figured(roman, eff.inv.inv, tones.some(t => t[1] === 7));
        const pc = (T.degreeSemis(spec.root) + bt[0]) % 12;
        bass = named.find(t => t.pc === pc) || null;
        if (bass) letter += '/' + bass.name;
      }
    }
    return {
      roman, letter, quality: T.QUALITIES[spec.q].name,
      color: T.KEY_COLORS[rootSp.letter] || '#8A8A8A', rootLetter: rootSp.letter,
      tones: named, bass, mods: eff.mods
    };
  }

  /* The notes a chord sounds, as MIDI: its own notes if it has them; an inverted chord with the bass
     tone at the bottom (no higher than B3) and the others close above; else Digital Accordion's voicing. */
  function engineMidis(spec, k) {
    const eff = effective(spec);
    const tones = eff.tones || T.qualityTones(spec.q);
    const bt = eff.inv ? bassTone(tones, eff.inv.inv) : null;
    if (bt) {
      const root = tonicMidi(k) - 12 + T.degreeSemis(spec.root);
      let bass = root + (bt[0] % 12);
      if (bass > 59) bass -= 12;
      const pcs = Array.from(new Set(tones.map(t => (root + t[0]) % 12))).filter(pc => pc !== bass % 12);
      const upper = pcs.map(pc => { const d = ((pc - bass) % 12 + 12) % 12; return bass + (d || 12); }).sort((a, b) => a - b);
      const out = [bass].concat(upper);
      if (out.length < 4) out.push(bass + 12);
      return out;
    }
    return T.chordMidis(((k % 12) + 12) % 12, spec.root, spec.q, 0, eff.tones);
  }

  /* ---------------- a box's own notes ----------------
     A VOICE: semitones above the key's tonic (Theory's tonicMidi), low to high, 1–8 of them,
     no pitch twice. It moves with the key. */
  const LOW = 24, HIGH = 96;
  function cleanVoice(v) {
    if (!Array.isArray(v)) return null;
    const out = Array.from(new Set(v.map(Number).filter(n => Number.isInteger(n) && n >= -36 && n <= 48))).sort((a, b) => a - b).slice(0, 8);
    return out.length ? out : null;
  }
  function voiceOf(spec, k) { return engineMidis(parse(spec) || defaultSpec('f'), k).map(m => m - tonicMidi(k)); }
  function midis(spec, voice, k) {
    const v = cleanVoice(voice);
    if (v) return v.map(s => tonicMidi(k) + s).filter(m => m >= LOW && m <= HIGH);
    const sp = parse(spec);
    return sp ? engineMidis(sp, k) : [];
  }
  /* own notes named: the chord they make (with its inversion), or the notes themselves */
  const TRIAD_Q = ['maj', 'min', 'dim', 'aug'];
  const SEVENTH_Q = ['dom7', 'maj7', 'min7', 'm7b5', 'dim7', 'mmaj7', 'aug7'];
  const NAME_Q = ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4', 'dom7', 'maj7', 'min7', 'm7b5', 'dim7', 'mmaj7', 'six', 'min6', 'add9', 'madd9', 'pow', 'six9', 'dom9sus4', 'aug7'];
  function nameVoice(v, k) {
    const ms = (cleanVoice(v) || []).map(s => s);
    if (!ms.length) return null;
    const pcs = Array.from(new Set(ms.map(s => ((s % 12) + 12) % 12)));
    const bassPc = ((ms[0] % 12) + 12) % 12;
    const roots = [bassPc].concat(pcs.filter(p => p !== bassPc));
    const qset = (id, no5) => {
      let iv = Array.from(new Set(T.QUALITIES[id].iv.map(x => x % 12)));
      if (no5) { if (iv.indexOf(7) === -1) return null; iv = iv.filter(x => x !== 7); if (iv.length < 2) return null; }
      return iv.sort((a, b) => a - b).join();
    };
    const tries = [];
    [false, true].forEach(no5 => roots.forEach(r => tries.push([r, no5])));
    for (const [r, no5] of tries) {
      const set = pcs.map(p => ((p - r) % 12 + 12) % 12).sort((a, b) => a - b).join();
      const q = NAME_Q.find(id => qset(id, no5) === set);
      if (!q) continue;
      const root = T.semisToDegree(r, MAJOR.degrees);
      const i = ((bassPc - r) % 12 + 12) % 12;
      let inv = null;
      if (i && TRIAD_Q.indexOf(q) !== -1) inv = i === 3 || i === 4 ? 'inv6' : i >= 6 && i <= 8 ? 'inv64' : null;
      else if (i && SEVENTH_Q.indexOf(q) !== -1) inv = i === 3 || i === 4 ? 'inv65' : i >= 6 && i <= 8 ? 'inv43' : i >= 9 ? 'inv42' : null;
      const spec = parse({ root, q, mods: inv ? [inv] : [] });
      if (!spec) continue;
      const slash = i && !inv ? spellPc(bassPc, k) : null;
      return { spec, slash };
    }
    return { notes: Array.from(new Set(ms.map(s => spellPc(((s % 12) + 12) % 12, k)))).join(' ') };
  }
  function spellPc(pc, k) {
    const deg = T.semisToDegree(pc, MAJOR.degrees);
    return T.spellDegree(keyAscii(k), deg).name;
  }

  function describe(spec, voice, k) {
    const sp = parse(spec) || defaultSpec('f');
    const d = describeSpec(sp, k);
    const v = cleanVoice(voice);
    if (!v) return Object.assign(d, { own: false });
    const n = nameVoice(v, k);
    const ms = midis(sp, v, k);
    const tones = Array.from(new Set(ms.map(m => ((m - tonicMidi(k)) % 12 + 12) % 12))).map(pc => {
      const name = spellPc(pc, k);
      return { pc, name, letter: name.charAt(0), color: T.KEY_COLORS[name.charAt(0)], solfege: SOLFEGE_DOWN[pc] };
    });
    if (n && n.spec) {
      const vd = describeSpec(n.spec, k);
      return Object.assign(d, { roman: vd.roman, letter: vd.letter + (n.slash ? '/' + n.slash : ''), tones, own: true });
    }
    return Object.assign(d, { roman: d.roman + '*', letter: (n && n.notes) || d.letter, tones, own: true });
  }

  VC.chords = {
    PLACES, SETS, placesOf, KEY_OF, keyName, tonicMidi,
    MOD_FUNCS, MOD_BY_ID, toggleMod, cleanMods,
    defaultSpec, parse, sameSpec, ROOTS, QUALITY_CHOICES,
    describe, midis, voiceOf, cleanVoice, engineMidis,
    labelHTML, nameScale, escapeHtml, pretty, spellPc,
    romanOfRoot: (root, q) => pretty(T.romanFor(root, q))
  };
})();
